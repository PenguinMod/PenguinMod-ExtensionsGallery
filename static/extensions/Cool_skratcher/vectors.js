// Name: Vectors!
// ID: cooldevvectors
// Description: Adds a set of blocks for vector operations in 2D and 3D space.
// By: cool_skratcher <https://scratch.mit.edu/users/cool_skratcher/>
// License: MIT

(function(Scratch) {
  'use strict';
  const vm = Scratch.vm;
  const mouse = vm.runtime.ioDevices.mouse;

  let penPLoaded = false;
  let penPModule = null;
  const penPCheck = () => {
    if (penPLoaded) {
      return;
    }
    if (vm.runtime.ext_penP) {
      penPLoaded = true;
      penPModule = vm.runtime.ext_penP;

      if (penPModule) {
        penPModule.turnAdvancedSettingOff({
          Setting: "wValueUnderFlow",
          onOrOff: "on",
        });
      }

      vm.runtime.extensionManager.refreshBlocks();
    }
  };
  penPCheck();

  class VecMath {
    constructor() {
      this.camera = { pos: { x: 0, y: 0, z: 0 }, rot: { yaw: 0, pitch: 0, roll: 0 }, fov: 100 };
      Scratch.vm.runtime.on("EXTENSION_ADDED", () => {
        penPCheck();
        console.log(vm.runtime.ext_penP)
      });
    }

    getInfo() {
      return {
        id: 'cooldevvectors',
        name: 'Vectors',
        color1: "#57a3e5",
        color2: "#0063ba",
        blocks: [
          "---",
          { text: 'Vector Operations', blockType: Scratch.BlockType.LABEL},
          { opcode: 'vec2', blockType: Scratch.BlockType.REPORTER, text: 'vec2 [x] [y]', arguments: { x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } }},
          { opcode: 'vec3', blockType: Scratch.BlockType.REPORTER, text: 'vec3 [x] [y] [z]', arguments: { x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
          { opcode: 'getComponent', blockType: Scratch.BlockType.REPORTER, text: '[component] of [v]', arguments: { component: { type: Scratch.ArgumentType.STRING, menu: 'components' }, v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'add', blockType: Scratch.BlockType.REPORTER, text: 'add [v1] [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'sub', blockType: Scratch.BlockType.REPORTER, text: 'sub [v1] [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'mul', blockType: Scratch.BlockType.REPORTER, text: 'mul [v] by [scalar]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, scalar: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }}},
          { opcode: 'div', blockType: Scratch.BlockType.REPORTER, text: 'div [v] by [scalar]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, scalar: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }}},
          { opcode: 'mag', blockType: Scratch.BlockType.REPORTER, text: 'mag [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'dot', blockType: Scratch.BlockType.REPORTER, text: 'dot [v1] [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'cross', blockType: Scratch.BlockType.REPORTER, text: 'cross [v1] [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'rotateVec3', blockType: Scratch.BlockType.REPORTER, text: 'rotate [v] by x: [rx] y: [ry] z: [rz]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, rx: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, ry: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, rz: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
          { opcode: 'rotateAroundOrigin', blockType: Scratch.BlockType.REPORTER, text: 'rotate [v] around [origin] by x: [rx] y: [ry] z: [rz]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, origin: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, rx: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, ry: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, rz: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
          "---",
          { text: 'Culling', blockType: Scratch.BlockType.LABEL},
          { opcode: 'isCulled', blockType: Scratch.BlockType.BOOLEAN, text: 'is [v] culled', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'cullAgainstPlane', blockType: Scratch.BlockType.BOOLEAN, text: 'is [v] culled against plane [plane]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, plane: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,1' }}},
          { opcode: 'frustumCull', blockType: Scratch.BlockType.BOOLEAN, text: 'is [v] inside frustum with near: [near] far: [far]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, near: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 }, far: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }}},
          { opcode: 'backFaceCull', blockType: Scratch.BlockType.BOOLEAN, text: 'is face [v1] [v2] [v3] culled', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '1,0,0' }, v3: { type: Scratch.ArgumentType.STRING, defaultValue: '0,1,0' }}},
          "---",
          { text: 'Projection and Camera', blockType: Scratch.BlockType.LABEL},
          { opcode: 'project', blockType: Scratch.BlockType.REPORTER, text: 'project [v] to screen', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'setCamPos', blockType: Scratch.BlockType.COMMAND, text: 'set camera pos to [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'changeCamPos', blockType: Scratch.BlockType.COMMAND, text: 'change camera pos by [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'changeCamComponent', blockType: Scratch.BlockType.COMMAND, text: 'change camera [component] by [val]', arguments: { component: { type: Scratch.ArgumentType.STRING, menu: 'components' }, val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
          { opcode: 'getCamPos', blockType: Scratch.BlockType.REPORTER, text: 'camera pos' },

          { opcode: 'setCamRot', blockType: Scratch.BlockType.COMMAND, text: 'set camera rotation to [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'changeCamRot', blockType: Scratch.BlockType.COMMAND, text: 'change camera rotation by [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }}},
          { opcode: 'changeCamAngle', blockType: Scratch.BlockType.COMMAND, text: 'change camera [angle] by [val]', arguments: { angle: { type: Scratch.ArgumentType.STRING, menu: 'angles' }, val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }}},
          { opcode: 'getCamRot', blockType: Scratch.BlockType.REPORTER, text: 'camera rotation' },

          { opcode: 'setFOV', blockType: Scratch.BlockType.COMMAND, text: 'set FOV to [val]', arguments: { val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }}},
          { opcode: 'changeFOV', blockType: Scratch.BlockType.COMMAND, text: 'change FOV by [val]', arguments: { val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }}},
          { opcode: 'getFOV', blockType: Scratch.BlockType.REPORTER, text: 'FOV' },
          "---",
          { text: 'Sprite Movement', blockType: Scratch.BlockType.LABEL },
          { opcode: 'moveByVec2', blockType: Scratch.BlockType.COMMAND, text: 'change pos by vec2 [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0' }}},
          { opcode: 'goToVec2', blockType: Scratch.BlockType.COMMAND, text: 'go to vec2 [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0' }}},
          { opcode: 'pointTo', blockType: Scratch.BlockType.COMMAND, text: 'point to vec2 [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0' }}},
          { opcode: 'getPosVec2', blockType: Scratch.BlockType.REPORTER, text: 'get position as vec2' },
          { opcode: 'getSizeVec2', blockType: Scratch.BlockType.REPORTER, text: 'get size as vec2' },
          { opcode: 'getMousePosVec2', blockType: Scratch.BlockType.REPORTER, text: 'mouse pos vec2' },
          "---",
          { hideFromPalette: !penPLoaded, text: 'Pen+', blockType: Scratch.BlockType.LABEL },
          { hideFromPalette: !penPLoaded, opcode: 'drawTriangle', blockType: Scratch.BlockType.COMMAND, text: 'triangle between [v1] [v2] [v3]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '1,0' }, v3: { type: Scratch.ArgumentType.STRING, defaultValue: '0,1' }}},
        ],
        menus: {
          components: { items: ['x', 'y', 'z'] },
          angles: { items: ['yaw', 'pitch', 'roll'] },
        }
      };
    }

    // Vector creation
    vec2(args) {
      const x = Scratch.Cast.toNumber(args.x) || 0;
      const y = Scratch.Cast.toNumber(args.y) || 0;
      return `${x},${y}`;
    }

    vec3(args) {
      const x = Scratch.Cast.toNumber(args.x) || 0;
      const y = Scratch.Cast.toNumber(args.y) || 0;
      const z = Scratch.Cast.toNumber(args.z) || 0;
      return `${x},${y},${z}`;
    }

    // Vector component access
    getComponent(args) {
      const [x, y, z = 0] = args.v.split(',').map(Number);
      return args.component === 'x' ? x : args.component === 'y' ? y : z;
    }

    // Basic vector math
    add(args) {
      return this._vectorOp(args.v1, args.v2, (a, b) => (a || 0) + (b || 0));
    }

    sub(args) {
      return this._vectorOp(args.v1, args.v2, (a, b) => (a || 0) - (b || 0));
    }

    mul(args) {
      const scalar = Scratch.Cast.toNumber(args.scalar) || 0;
      return this._scalarOp(args.v, scalar, (a, b) => (a || 0) * b);
    }

    div(args) {
      const scalar = Scratch.Cast.toNumber(args.scalar) || 1;
      return this._scalarOp(args.v, scalar, (a, b) => b !== 0 ? (a || 0) / b : 0);
    }

    mag(args) {
      const components = args.v.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      return Math.hypot(...components);
    }

    // Fixed dot product with validation
    dot(args) {
      const v1 = args.v1.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const v2 = args.v2.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const [x1 = 0, y1 = 0, z1 = 0] = v1;
      const [x2 = 0, y2 = 0, z2 = 0] = v2;
      return x1 * x2 + y1 * y2 + z1 * z2;
    }

    // Improved cross product
    cross(args) {
      const v1 = args.v1.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const v2 = args.v2.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const [x1 = 0, y1 = 0, z1 = 0] = v1;
      const [x2 = 0, y2 = 0, z2 = 0] = v2;
      return `${y1 * z2 - z1 * y2},${z1 * x2 - x1 * z2},${x1 * y2 - y1 * x2}`;
    }

    // Fixed rotation functions
    rotateVec3(args) {
      const [x = 0, y = 0, z = 0] = args.v.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const rx = this._toRadians(Scratch.Cast.toNumber(args.rx) || 0);
      const ry = this._toRadians(Scratch.Cast.toNumber(args.ry) || 0);
      const rz = this._toRadians(Scratch.Cast.toNumber(args.rz) || 0);
      return this._rotate3D({ x, y, z }, rx, ry, rz);
    }

    // Camera Controls
    setCamPos(args) { this._setVec(this.camera.pos, args.v); }
    changeCamPos(args) { this._addVec(this.camera.pos, args.v); }
    changeCamComponent(args) { this.camera.pos[args.component] += args.val; }
    getCamPos() { return `${this.camera.pos.x},${this.camera.pos.y},${this.camera.pos.z}`; }

    setCamRot(args) { this._setRot(this.camera.rot, args.v); }
    changeCamRot(args) { this._addRot(this.camera.rot, args.v); }
    changeCamAngle(args) { this.camera.rot[args.angle] += args.val; }
    getCamRot() { return `${this.camera.rot.yaw},${this.camera.rot.pitch},${this.camera.rot.roll}`; }

    setFOV(args) { this.camera.fov = args.val; }
    changeFOV(args) { this.camera.fov += args.val; }
    getFOV() { return this.camera.fov; }

    // Projection
    project(args) {
      const [x = 0, y = 0, z = 0] = args.v.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const cam = this.camera;
      
      // Apply transformations in correct order
      const dx = x - cam.pos.x;
      const dy = y - cam.pos.y;
      const dz = z - cam.pos.z;

      // Convert angles to radians for consistency
      const yawRad = this._toRadians(cam.rot.yaw);
      const pitchRad = this._toRadians(cam.rot.pitch);
      const rollRad = this._toRadians(cam.rot.roll);

      // Apply rotations in correct order: yaw -> pitch -> roll
      // First yaw (around Y axis)
      let cx = dx * Math.cos(yawRad) - dz * Math.sin(yawRad);
      let cz = dx * Math.sin(yawRad) + dz * Math.cos(yawRad);
      let cy = dy;

      // Then pitch (around X axis)
      const tempZ = cz * Math.cos(pitchRad) - cy * Math.sin(pitchRad);
      cy = cz * Math.sin(pitchRad) + cy * Math.cos(pitchRad);
      cz = tempZ;

      // Finally roll (around Z axis)
      const finalX = cx * Math.cos(rollRad) - cy * Math.sin(rollRad);
      const finalY = cx * Math.sin(rollRad) + cy * Math.cos(rollRad);

      // Prevent division by zero
      if (Math.abs(cz) < 0.0001) {
        return '0,0';
      }

      // Calculate screen coordinates with FOV
      const screenX = (finalX / cz) * cam.fov;
      const screenY = (finalY / cz) * cam.fov;

      return `${screenX},${screenY}`;
    }

    rotateAroundOrigin(args) {
      const [vx, vy, vz] = args.v.split(',').map(Number);
      const [ox, oy, oz] = args.origin.split(',').map(Number);
      const rx = this._toRadians(args.rx);
      const ry = this._toRadians(args.ry);
      const rz = this._toRadians(args.rz);
    
      // Translate vector to origin
      let x = vx - ox;
      let y = vy - oy;
      let z = vz - oz;
    
      // Rotate around Z-axis
      let tempX = x * Math.cos(rz) - y * Math.sin(rz);
      let tempY = x * Math.sin(rz) + y * Math.cos(rz);
      x = tempX; y = tempY;
    
      // Rotate around Y-axis
      tempX = x * Math.cos(ry) + z * Math.sin(ry);
      let tempZ = -x * Math.sin(ry) + z * Math.cos(ry);
      x = tempX; z = tempZ;
    
      // Rotate around X-axis
      tempY = y * Math.cos(rx) - z * Math.sin(rx);
      tempZ = y * Math.sin(rx) + z * Math.cos(rx);
      y = tempY; z = tempZ;
    
      // Translate back to original position
      x += ox;
      y += oy;
      z += oz;
    
      return `${x},${y},${z}`;
    }      

    isCulled(args) {
      const [x, y, z] = args.v.split(',').map(Number);
      const { pos, rot } = this.camera;
    
      // Transform point relative to camera
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dz = z - pos.z;
    
      // Simple culling: check if behind the camera (z <= 0 in camera space)
      const camZ = dz * Math.cos(rot.yaw) + dx * Math.sin(rot.yaw);
      return camZ <= 0;
    }
    
    cullAgainstPlane(args) {
      const [x, y, z] = args.v.split(',').map(Number);
      const [nx, ny, nz] = args.plane.split(',').map(Number);
    
      // Plane culling: check if point is behind the plane (dot product <= 0)
      const dot = x * nx + y * ny + z * nz;
      return dot <= 0;
    }
    
    frustumCull(args) {
      const [x = 0, y = 0, z = 0] = args.v.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const { pos, rot, fov } = this.camera;
      const near = Math.max(0.1, Scratch.Cast.toNumber(args.near) || 0.1);
      const far = Math.max(near + 0.1, Scratch.Cast.toNumber(args.far) || 100);
      
      // Transform point to camera space
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dz = z - pos.z;
      
      // Convert angles to radians
      const yawRad = this._toRadians(rot.yaw);
      const pitchRad = this._toRadians(rot.pitch);
      
      // Apply rotations (yaw then pitch)
      let cx = dx * Math.cos(yawRad) - dz * Math.sin(yawRad);
      let cz = dx * Math.sin(yawRad) + dz * Math.cos(yawRad);
      let cy = dy;
      
      // Apply pitch
      const temp_z = cz * Math.cos(pitchRad) - cy * Math.sin(pitchRad);
      cy = cz * Math.sin(pitchRad) + cy * Math.cos(pitchRad);
      cz = temp_z;
      
      // Early exit if behind camera
      if (cz <= 0) return true;
      
      // Check against near/far planes
      if (cz < near || cz > far) return true;
      
      // Calculate FOV bounds with correct aspect ratio (4:3)
      const hFovRad = this._toRadians(fov);
      const vFovRad = 2 * Math.atan(Math.tan(hFovRad / 2) * (3/4));
      
      // Check against frustum planes
      const hHalf = Math.abs(Math.tan(hFovRad / 2) * cz);
      const vHalf = Math.abs(Math.tan(vFovRad / 2) * cz);
      
      return Math.abs(cx) > hHalf || Math.abs(cy) > vHalf;
    }
    
    backFaceCull(args) {
      const [x1, y1, z1] = args.v1.split(',').map(Number);
      const [x2, y2, z2] = args.v2.split(',').map(Number);
      const [x3, y3, z3] = args.v3.split(',').map(Number);
      const { pos } = this.camera;
    
      // Calculate face normal
      const ux = x2 - x1, uy = y2 - y1, uz = z2 - z1;
      const vx = x3 - x1, vy = y3 - y1, vz = z3 - z1;
      const nx = uy * vz - uz * vy;
      const ny = uz * vx - ux * vz;
      const nz = ux * vy - uy * vx;
    
      // Vector from camera to one vertex
      const cx = x1 - pos.x, cy = y1 - pos.y, cz = z1 - pos.z;
    
      // Dot product of face normal and camera vector
      const dot = nx * cx + ny * cy + nz * cz;
    
      return dot >= 0;
    }    

    // Utility Functions
    _vectorOp(v1, v2, op) {
      const vec1 = v1.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const vec2 = v2.split(',').map(n => Scratch.Cast.toNumber(n) || 0);
      const [x1 = 0, y1 = 0, z1 = 0] = vec1;
      const [x2 = 0, y2 = 0, z2 = 0] = vec2;
      return `${op(x1, x2)},${op(y1, y2)},${op(z1, z2)}`;
    }

    _scalarOp(v, scalar, op) {
      const [x, y, z] = v.split(',').map(Number);
      return `${op(x, scalar)},${op(y, scalar)},${op(z, scalar)}`;
    }

    _setVec(target, v) { const [x, y, z] = v.split(',').map(Number); target.x = x; target.y = y; target.z = z; }
    _addVec(target, v) { const [x, y, z] = v.split(',').map(Number); target.x += x; target.y += y; target.z += z; }
    _setRot(target, v) { 
      const [yaw, pitch, roll] = v.split(',').map(Number); 
      target.yaw = yaw; 
      target.pitch = pitch; 
      target.roll = roll; 
    }

    _addRot(target, v) { 
      const [yaw, pitch, roll] = v.split(',').map(Number); 
      target.yaw += yaw; 
      target.pitch += pitch; 
      target.roll += roll; 
    }

    _rotate3D(v, rx, ry, rz) {
      const cos = Math.cos;
      const sin = Math.sin;
      let { x, y, z } = v;
      
      // Apply rotations in order: X -> Y -> Z
      // X rotation
      let temp = y;
      y = y * cos(rx) - z * sin(rx);
      z = temp * sin(rx) + z * cos(rx);
      
      // Y rotation
      temp = x;
      x = x * cos(ry) + z * sin(ry);
      z = -temp * sin(ry) + z * cos(ry);
      
      // Z rotation
      temp = x;
      x = x * cos(rz) - y * sin(rz);
      y = temp * sin(rz) + y * cos(rz);
      
      return `${x},${y},${z}`;
    }

    moveByVec2(args, util) {
      const [dx, dy] = args.v.split(',').map(Number);
      const x = Scratch.Cast.toNumber(dx);
      const y = Scratch.Cast.toNumber(dy);
      util.target.setXY(util.target.x + x, util.target.y + y);
    }

    pointTo(args, util) {
      const [dx, dy] = args.v.split(',').map(Number);
      const x = Scratch.Cast.toNumber(dx);
      const y = Scratch.Cast.toNumber(dy);
      if (util.target.y > y) {
        util.target.setDirection(
          (180 / Math.PI) *
            Math.atan((x - util.target.x) / (y - util.target.y)) +
            180
        );
      } else {
        util.target.setDirection(
          (180 / Math.PI) * Math.atan((x - util.target.x) / (y - util.target.y))
        );
      }
    }

    goToVec2(args, util) {
      const [dx, dy] = args.v.split(',').map(Number);
      const x = Scratch.Cast.toNumber(dx);
      const y = Scratch.Cast.toNumber(dy);
      util.target.setXY(x, y);
    }

    getPosVec2(util) {
      return `${util.target.x},${util.target.y}`;
    }

    getSizeVec2(util) {
      const bounds = Scratch.vm.renderer.getBounds(util.target.drawableID)
      return `${Math.ceil(bounds.width)},${Math.ceil(bounds.height)}`;
    }
    getMousePosVec2() {
      return `${Math.round(mouse._scratchX)},${Math.round(mouse._scratchY)}`;
    }

    drawTriangle(args, util) {
      const [x1, y1] = args.v1.split(',').map(Number);
      const [x2, y2] = args.v2.split(',').map(Number);
      const [x3, y3] = args.v3.split(',').map(Number);
      
      penPModule.drawSolidTri(
        {
          x1: x1,
          y1: y1,
          x2: x2,
          y2: y2,
          x3: x3,
          y3: y3,
        },
        util
      );
    }

    // New utility function to convert degrees to radians
    _toRadians(degrees) {
      return (degrees || 0) * (Math.PI / 180);
    }
  }

  Scratch.extensions.register(new VecMath());
})(Scratch);
