(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This extension must run unsandboxed');
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;
    const objects = {};
    let scene, camera, renderer;
    
    // Physics Globals
    let world;
    let physicsEnabled = false;
    const physicsBodies = {}; // Maps Body ID -> Cannon Body
    const physicsMeshMap = {}; // Maps Body ID -> Three Mesh (The Visual)

    const loadScript = (url) => {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = () => reject(new Error(`Failed to load ${url}`));
            document.head.appendChild(script);
        });
    };

    const parseArg = (arg) => {
        const str = String(arg);
        if (str.startsWith('@')) return objects[str.substring(1)];
        if (str.startsWith('#')) return parseInt(str.replace('#', '0x'), 16);
        try { return JSON.parse(str); } catch (e) { return str; }
    };

    class ThreePM {
        getInfo() {
            return {
                id: 'threepm',
                name: 'Three.pm',
                color1: '#6b47fd',
                color2: '#333333',
                blocks: [
                    {
                        opcode: 'loadThree',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Load Three.js Engine',
                    },
                    {
                        opcode: 'initScene',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Initialize Scene | Transparent: [TRANS] | Background: [COLOR]',
                        arguments: {
                            TRANS: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: false },
                            COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#000000' }
                        }
                    },
                    {
                        opcode: 'clearScene',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Clear All Objects from Scene',
                    },
                    {
                        opcode: 'setSkybox',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set Skybox (Panorama) URL: [URL]',
                        arguments: { URL: { type: Scratch.ArgumentType.STRING, defaultValue: '' } }
                    },
                    '---',
                    {
                        opcode: 'quickShape',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'New [ID] shape [SHAPE] color [COLOR]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' },
                            SHAPE: { type: Scratch.ArgumentType.STRING, menu: 'shapes', defaultValue: 'BoxGeometry' },
                            COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' }
                        }
                    },
                    {
                        opcode: 'loadOBJMTL',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Load OBJ [ID] from URL [OBJ] with MTL [MTL]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'model1' },
                            OBJ: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
                            MTL: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                        }
                    },
                    {
                        opcode: 'createLight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Create Light [ID] type [TYPE] color [COLOR] intensity [INT] flare: [FLARE]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'light1' },
                            TYPE: { type: Scratch.ArgumentType.STRING, menu: 'lightTypes', defaultValue: 'PointLight' },
                            COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' },
                            INT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            FLARE: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: true }
                        }
                    },
                    '---',
                    {
                        opcode: 'setTextureGlobal',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set [ID] texture [TYPE] to [URL]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' },
                            TYPE: { type: Scratch.ArgumentType.STRING, menu: 'texTypes', defaultValue: 'Skin' },
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                        }
                    },
                    {
                        opcode: 'setTextureSide',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set [ID] side [SIDE] texture [TYPE] to [URL]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' },
                            SIDE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            TYPE: { type: Scratch.ArgumentType.STRING, menu: 'texTypes', defaultValue: 'Skin' },
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: '' }
                        }
                    },
                    '---',
                    {
                        opcode: 'lookAt',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[ID] Look At [TARGET]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'camera' },
                            TARGET: { type: Scratch.ArgumentType.STRING, defaultValue: 'light1' }
                        }
                    },
                    {
                        opcode: 'addToScene',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Add [ID] to Scene',
                        arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' } }
                    },
                    {
                        opcode: 'removeFromScene',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Remove [ID] from Scene',
                        arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' } }
                    },
                    '---',
                    // --- CAMERA CONTROLS ---
                    {
                        opcode: 'cameraYaw',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Camera Yaw (Turn) by [DEG]',
                        arguments: { DEG: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 } }
                    },
                    {
                        opcode: 'cameraPitch',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Camera Pitch (Look Up/Down) by [DEG]',
                        arguments: { DEG: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 } }
                    },
                    {
                        opcode: 'cameraRoll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Camera Roll (Tilt) by [DEG]',
                        arguments: { DEG: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 } }
                    },
                    '---',
                    // --- RELATIVE MOVEMENT ---
                    {
                        opcode: 'cameraMoveForward',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Camera Move Forward/Back by [DIST]',
                        arguments: { DIST: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } }
                    },
                    {
                        opcode: 'cameraMoveRight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Camera Move Right/Left by [DIST]',
                        arguments: { DIST: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } }
                    },
                    {
                        opcode: 'cameraMoveUp',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Camera Move Up/Down by [DIST]',
                        arguments: { DIST: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } }
                    },
                    '---',
                    // --- PHYSICS ---
                    {
                        opcode: 'enablePhysics',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Enable Physics [ENABLE]',
                        arguments: { ENABLE: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: true } }
                    },
                    {
                        opcode: 'setGravity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set Gravity Y [VAL]',
                        arguments: { VAL: { type: Scratch.ArgumentType.NUMBER, defaultValue: -9.82 } }
                    },
                    {
                        opcode: 'addBody',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Add Physics Body [ID] Shape [SHAPE] Mass [MASS] Bind to [MESH_ID]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'phys1' },
                            SHAPE: { type: Scratch.ArgumentType.STRING, menu: 'physShapes', defaultValue: 'Box' },
                            MASS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            MESH_ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' }
                        }
                    },
                    {
                        opcode: 'setVelocity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set [ID] Velocity X [X] Y [Y] Z [Z]',
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'phys1' },
                            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            Z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
                        }
                    },
                    '---',
                    {
                        opcode: 'setProperty',
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set [ID]'s [PROP] to [VAL]",
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' },
                            PROP: { type: Scratch.ArgumentType.STRING, menu: 'properties', defaultValue: 'position.x' },
                            VAL: { type: Scratch.ArgumentType.STRING, defaultValue: '0' }
                        }
                    },
                    {
                        opcode: 'changeProperty',
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Change [ID]'s [PROP] by [VAL]",
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' },
                            PROP: { type: Scratch.ArgumentType.STRING, menu: 'properties', defaultValue: 'position.x' },
                            VAL: { type: Scratch.ArgumentType.NUMBER, defaultValue: '0.1' }
                        }
                    },
                    {
                        opcode: 'getProperty',
                        blockType: Scratch.BlockType.REPORTER,
                        text: "[ID]'s [PROP]",
                        arguments: {
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'cube1' },
                            PROP: { type: Scratch.ArgumentType.STRING, menu: 'properties', defaultValue: 'position.x' }
                        }
                    },
                    {
                        opcode: 'render',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Update Screen (Render)',
                    }
                ],
                menus: {
                    shapes: ['BoxGeometry', 'SphereGeometry', 'PlaneGeometry', 'TorusGeometry', 'CylinderGeometry'],
                    physShapes: ['Box', 'Sphere', 'Plane'],
                    lightTypes: ['PointLight', 'SpotLight', 'DirectionalLight', 'HemisphereLight'],
                    texTypes: ['Skin', 'Bumps', 'Roughness', 'Reflection'],
                    properties: [
                        'position.x', 'position.y', 'position.z', 
                        'rotation.x', 'rotation.y', 'rotation.z', 
                        'scale.x', 'scale.y', 'scale.z', 
                        'visible', 'material.opacity', 
                        'intensity', 'distance', 'angle', 'penumbra', 'decay',
                        'color', 'groundColor'
                    ]
                }
            };
        }

        async loadThree() {
            if (window.THREE) return;
            try {
                await loadScript('https://cdn.jsdelivr.net/npm/three@0.125.0/build/three.min.js');
                await loadScript('https://cdn.jsdelivr.net/npm/three@0.125.0/examples/js/loaders/MTLLoader.js');
                await loadScript('https://cdn.jsdelivr.net/npm/three@0.125.0/examples/js/loaders/OBJLoader.js');
                await loadScript('https://cdn.jsdelivr.net/npm/three@0.125.0/examples/js/objects/Lensflare.js');
                // Load Cannon.js for physics
                await loadScript('https://cdnjs.cloudflare.com/ajax/libs/cannon.js/0.6.2/cannon.min.js');
            } catch (e) {
                console.error(e);
            }
        }

        initScene({ TRANS, COLOR }) {
            if (!window.THREE) return;
            const old = document.getElementById('three-layer');
            if (old) old.remove();

            const canvas = document.createElement('canvas');
            canvas.id = 'three-layer';
            Object.assign(canvas.style, { position: 'absolute', top: '0', left: '0', width: '100%', height: '100%', pointerEvents: 'none', zIndex: '1' });
            runtime.renderer.canvas.parentElement.appendChild(canvas);

            scene = new THREE.Scene();
            const width = runtime.renderer.canvas.clientWidth;
            const height = runtime.renderer.canvas.clientHeight;
            camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 2000);
            camera.position.z = 5;

            renderer = new THREE.WebGLRenderer({ canvas, alpha: TRANS, antialias: true });
            renderer.setSize(width, height, false);
            if (!TRANS) renderer.setClearColor(COLOR, 1);

            const ro = new ResizeObserver(() => {
                const w = runtime.renderer.canvas.clientWidth;
                const h = runtime.renderer.canvas.clientHeight;
                renderer.setSize(w, h, false);
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
            });
            ro.observe(runtime.renderer.canvas);

            objects['scene'] = scene;
            objects['camera'] = camera;
        }

        // --- PHYSICS ENGINE LOGIC ---

        enablePhysics({ ENABLE }) {
            if (!window.CANNON) return;
            physicsEnabled = ENABLE;
            
            if (physicsEnabled) {
                if (!world) {
                    world = new CANNON.World();
                    world.gravity.set(0, -9.82, 0);
                    world.broadphase = new CANNON.NaiveBroadphase();
                    world.solver.iterations = 10;
                }
            }
        }

        setGravity({ VAL }) {
            if (world && physicsEnabled) {
                world.gravity.set(0, Number(VAL), 0);
            }
        }

        addBody({ ID, SHAPE, MASS, MESH_ID }) {
            if (!world || !physicsEnabled) return;
            
            // 1. Find the Mesh to bind to
            const mesh = objects[MESH_ID];
            if (!mesh) {
                console.warn(`Three.pm: Cannot bind physics body [${ID}] to missing mesh [${MESH_ID}]`);
                return;
            }

            // 2. Auto-Generate Collision from the specific Mesh
            mesh.updateMatrixWorld();
            
            const box = new THREE.Box3().setFromObject(mesh);
            const size = new THREE.Vector3();
            box.getSize(size);
            const center = new THREE.Vector3();
            box.getCenter(center);

            let shape;
            const halfExtents = new CANNON.Vec3(size.x / 2, size.y / 2, size.z / 2);

            switch (SHAPE) {
                case 'Box':
                    shape = new CANNON.Box(halfExtents);
                    break;
                case 'Sphere':
                    const radius = Math.max(size.x, size.y, size.z) / 2;
                    shape = new CANNON.Sphere(radius);
                    break;
                case 'Plane':
                    shape = new CANNON.Plane();
                    break;
                default:
                    shape = new CANNON.Box(halfExtents);
            }

            const body = new CANNON.Body({
                mass: Number(MASS) 
            });
            
            body.addShape(shape);

            // 3. Set Initial Position based on the Mesh
            if (SHAPE === 'Plane') {
                body.quaternion.setFromAxisAngle(new CANNON.Vec3(1,0,0), -Math.PI/2);
                body.position.set(center.x, center.y, center.z);
            } else {
                body.position.set(center.x, center.y, center.z);
                if (MASS > 0) {
                    body.quaternion.set(mesh.quaternion.x, mesh.quaternion.y, mesh.quaternion.z, mesh.quaternion.w);
                }
            }

            world.addBody(body);
            
            // 4. Create the Binding
            // We store the body under ID (for velocity control)
            physicsBodies[ID] = body;
            // We store the MESH_ID under ID (for visual update)
            physicsMeshMap[ID] = mesh;
        }

        setVelocity({ ID, X, Y, Z }) {
            if (!physicsEnabled) return;
            const body = physicsBodies[ID];
            if (body) {
                body.velocity.set(Number(X), Number(Y), Number(Z));
            }
        }

        // --- END PHYSICS ---

        clearScene() {
            if (!scene) return;
            // Also clear physics to prevent ghost collisions
            if (world) {
                for (const id in physicsBodies) {
                    world.removeBody(physicsBodies[id]);
                }
                // Reset maps
                for (const prop in physicsBodies) delete physicsBodies[prop];
                for (const prop in physicsMeshMap) delete physicsMeshMap[prop];
            }

            while(scene.children.length > 0){ 
                scene.remove(scene.children[0]); 
            }
        }

        setSkybox({ URL }) {
            if (!scene) return;
            const loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous'); 
            
            loader.load(URL, (texture) => {
                texture.mapping = THREE.EquirectangularReflectionMapping;
                scene.background = texture;
                scene.environment = texture;
                if (renderer && scene && camera) {
                    scene.updateMatrixWorld();
                    renderer.render(scene, camera);
                }
            });
        }

        quickShape({ ID, SHAPE, COLOR }) {
            if (!window.THREE) return;
            
            let geo;
            switch (SHAPE) {
                case 'BoxGeometry': geo = new THREE.BoxGeometry(1, 1, 1); break;
                case 'SphereGeometry': geo = new THREE.SphereGeometry(1, 32, 16); break;
                case 'PlaneGeometry': geo = new THREE.PlaneGeometry(1, 1); break;
                case 'TorusGeometry': geo = new THREE.TorusGeometry(1, 0.4, 16, 100); break;
                case 'CylinderGeometry': geo = new THREE.CylinderGeometry(1, 1, 1, 32); break;
                default: geo = new THREE.BoxGeometry(1, 1, 1);
            }

            const materials = Array.from({length: SHAPE === 'BoxGeometry' ? 6 : 1}, () => 
                new THREE.MeshStandardMaterial({ color: parseArg(COLOR) })
            );
            objects[ID] = new THREE.Mesh(geo, materials.length > 1 ? materials : materials[0]);
        }

        createLight({ ID, TYPE, COLOR, INT, FLARE }) {
            if (!window.THREE) return;
            const light = new THREE[TYPE](parseArg(COLOR), Number(INT));
            
            if (FLARE && TYPE === 'PointLight') {
                const textureLoader = new THREE.TextureLoader();
                const textureFlare0 = textureLoader.load('https://threejs.org/examples/textures/lensflare/lensflare0.png');
                const textureFlare3 = textureLoader.load('https://threejs.org/examples/textures/lensflare/lensflare3.png');

                const lensflare = new THREE.Lensflare();
                lensflare.addElement(new THREE.LensflareElement(textureFlare0, 700, 0, light.color));
                lensflare.addElement(new THREE.LensflareElement(textureFlare3, 60, 0.6));
                lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 0.7));
                lensflare.addElement(new THREE.LensflareElement(textureFlare3, 120, 0.9));
                lensflare.addElement(new THREE.LensflareElement(textureFlare3, 70, 1));
                light.add(lensflare);
            }

            objects[ID] = light;
        }

        loadOBJMTL({ ID, OBJ, MTL }) {
            if (!window.THREE || !THREE.OBJLoader || !THREE.MTLLoader) return;
            const mtlLoader = new THREE.MTLLoader();
            mtlLoader.setCrossOrigin('anonymous');
            
            const loadModel = (materials = null) => {
                const objLoader = new THREE.OBJLoader();
                if (materials) objLoader.setMaterials(materials);
                objLoader.load(OBJ, (obj) => { 
                    objects[ID] = obj;
                    if (scene) {
                        scene.add(obj);
                    }
                });
            };
            if (MTL) mtlLoader.load(MTL, (mat) => { mat.preload(); loadModel(mat); });
            else loadModel();
        }

        lookAt({ ID, TARGET }) {
            const obj = objects[ID];
            const target = objects[TARGET];
            if (obj && target) obj.lookAt(target.position);
        }

        _applyTexture(mat, type, url) {
            if (!mat) return;
            const loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');
            const tex = url ? loader.load(url) : null;
            switch (type) {
                case 'Skin': mat.map = tex; if (url) mat.color.set(0xffffff); break;
                case 'Bumps': mat.normalMap = tex; break;
                case 'Roughness': mat.roughnessMap = tex; break;
                case 'Reflection': if (tex) tex.mapping = THREE.EquirectangularReflectionMapping; mat.envMap = tex; break;
            }
            mat.needsUpdate = true;
        }

        setTextureGlobal({ ID, TYPE, URL }) {
            const obj = objects[ID];
            if (!obj) return;
            obj.traverse(node => {
                if (node.isMesh) {
                    const mats = Array.isArray(node.material) ? node.material : [node.material];
                    mats.forEach(m => this._applyTexture(m, TYPE, URL));
                }
            });
        }

        setTextureSide({ ID, SIDE, TYPE, URL }) {
            const obj = objects[ID];
            if (!obj) return;
            const mesh = obj.isMesh ? obj : obj.children.find(c => c.isMesh);
            if (mesh) {
                const targetMat = Array.isArray(mesh.material) ? mesh.material[SIDE] : mesh.material;
                this._applyTexture(targetMat, TYPE, URL);
            }
        }

        _getPropContext(id, prop) {
            if (!objects[id]) return null;
            const parts = String(prop).split('.');
            let target = objects[id];
            for (let i = 0; i < parts.length - 1; i++) {
                if (!target || target[parts[i]] === undefined) return null;
                target = target[parts[i]];
            }
            return { target, key: parts[parts.length - 1] };
        }

        setProperty({ ID, PROP, VAL }) {
            const ctx = this._getPropContext(ID, PROP);
            if (ctx && ctx.target) {
                let finalVal = parseArg(VAL);
                if (PROP.includes('rotation')) finalVal = finalVal * (Math.PI / 180);
                
                if (ctx.target[ctx.key] && typeof ctx.target[ctx.key] === 'object' && ctx.target[ctx.key].isColor) {
                     ctx.target[ctx.key].set(finalVal);
                } else {
                     ctx.target[ctx.key] = finalVal;
                }
            }
        }

        changeProperty({ ID, PROP, VAL }) {
            const ctx = this._getPropContext(ID, PROP);
            if (ctx && ctx.target && typeof ctx.target[ctx.key] === 'number') {
                let change = Number(VAL);
                if (PROP.includes('rotation')) change = change * (Math.PI / 180);
                ctx.target[ctx.key] += change;
            }
        }

        getProperty({ ID, PROP }) {
            const ctx = this._getPropContext(ID, PROP);
            if (ctx && ctx.target) {
                let val = ctx.target[ctx.key];
                if (PROP.includes('rotation')) val = val * (180 / Math.PI);
                if (val && val.isColor) return '#' + val.getHexString();
                return (typeof val === 'object') ? JSON.stringify(val) : val;
            }
            return '';
        }

        addToScene({ ID }) {
            if (scene && objects[ID]) scene.add(objects[ID]);
        }

        removeFromScene({ ID }) {
            if (scene && objects[ID]) scene.remove(objects[ID]);
        }

        // --- CAMERA CONTROLS ---

        cameraYaw({ DEG }) {
            if (!objects['camera']) return;
            const axis = new THREE.Vector3(0, 1, 0);
            const rad = THREE.Math.degToRad(Number(DEG));
            objects['camera'].rotateOnWorldAxis(axis, rad);
        }

        cameraPitch({ DEG }) {
            if (!objects['camera']) return;
            const rad = THREE.Math.degToRad(Number(DEG));
            objects['camera'].rotateX(rad);
        }

        cameraRoll({ DEG }) {
            if (!objects['camera']) return;
            const rad = THREE.Math.degToRad(Number(DEG));
            objects['camera'].rotateZ(rad);
        }

        // --- RELATIVE CAMERA MOVEMENT ---

        cameraMoveForward({ DIST }) {
            if (!objects['camera']) return;
            objects['camera'].translateZ(Number(DIST));
        }

        cameraMoveRight({ DIST }) {
            if (!objects['camera']) return;
            objects['camera'].translateX(Number(DIST));
        }

        cameraMoveUp({ DIST }) {
            if (!objects['camera']) return;
            objects['camera'].translateY(Number(DIST));
        }

        render() {
            // AUTO-UPDATE PHYSICS LOGIC
            if (physicsEnabled && world) {
                // Step the simulation
                world.step(1 / 60);

                // Bind: Sync all physics bodies to their linked visual meshes
                for (const [id, body] of Object.entries(physicsBodies)) {
                    const mesh = physicsMeshMap[id]; // Look up the specific mesh linked to this body
                    if (mesh) {
                        mesh.position.copy(body.position);
                        mesh.quaternion.copy(body.quaternion);
                    }
                }
            }

            if (renderer && scene && camera) {
                scene.updateMatrixWorld();
                renderer.render(scene, camera);
            }
        }
    }

    Scratch.extensions.register(new ThreePM());
})(Scratch);
