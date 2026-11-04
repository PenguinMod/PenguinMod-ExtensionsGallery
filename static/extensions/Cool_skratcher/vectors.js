// Name: Vectors!
// ID: cooldevvectors
// Description: Adds a set of blocks for vector operations in 2D and 3D space.
// By: cool_skratcher <https://scratch.mit.edu/users/cool_skratcher/>
// License: MIT

(function(Scratch) {
	'use strict';
	const vm = Scratch.vm;
	const mouse = vm.runtime.ioDevices.mouse;
	
	const DEG2RAD = Math.PI / 180;
	const RAD2DEG = 180 / Math.PI;

	const STAGE_HALF_WIDTH = 240;
	const STAGE_HALF_HEIGHT = 180;
	const STAGE_ASPECT = STAGE_HALF_WIDTH / STAGE_HALF_HEIGHT;

	let penPLoaded = false;
	let penPModule = null;
	const penPCheck = () => {
		if (penPLoaded) return;
		if (vm.runtime.ext_penP) {
			penPLoaded = true;
			penPModule = vm.runtime.ext_penP;
			if (penPModule) {
				penPModule.turnAdvancedSettingOff({ Setting: "wValueUnderFlow", onOrOff: "on" });
			}
			vm.runtime.extensionManager.refreshBlocks();
		}
	};
	penPCheck();

	class VecMath {
		constructor() {
			this.camera = { pos: { x: 0, y: 0, z: 0 }, rot: { yaw: 0, pitch: 0, roll: 0 }, fov: 100 };
			this._basisCache = null;
			this._projCache = null;
			this._updateProjectionCache();
			Scratch.vm.runtime.on("EXTENSION_ADDED", () => { penPCheck(); });
		}

		getInfo() {
			return {
				id: 'cooldevvectors',
				name: 'Vectors',
				color1: "#57a3e5",
				color2: "#0063ba",
				blocks: [
					{ text: 'Vector Creation & Access', blockType: Scratch.BlockType.LABEL },
					{ opcode: 'vec2', blockType: Scratch.BlockType.REPORTER, text: 'vec2 [x] [y]', arguments: { x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },
					{ opcode: 'vec3', blockType: Scratch.BlockType.REPORTER, text: 'vec3 [x] [y] [z]', arguments: { x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },
					{ opcode: 'getComponent', blockType: Scratch.BlockType.REPORTER, text: '[component] of [v]', arguments: { component: { type: Scratch.ArgumentType.STRING, menu: 'components' }, v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'setComponent', blockType: Scratch.BlockType.REPORTER, text: 'set [component] of [v] to [val]', arguments: { component: { type: Scratch.ArgumentType.STRING, menu: 'components' }, v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },
					"---",

					{ text: 'Basic Arithmetic', blockType: Scratch.BlockType.LABEL },
					{ opcode: 'add', blockType: Scratch.BlockType.REPORTER, text: '[v1] + [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'sub', blockType: Scratch.BlockType.REPORTER, text: '[v1] - [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'mul', blockType: Scratch.BlockType.REPORTER, text: '[v] * [scalar]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, scalar: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } } },
					{ opcode: 'div', blockType: Scratch.BlockType.REPORTER, text: '[v] / [scalar]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, scalar: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } } },
					"---",

					{ text: 'Advanced Math & Utility', blockType: Scratch.BlockType.LABEL },
					{ opcode: 'mag', blockType: Scratch.BlockType.REPORTER, text: 'mag [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'normalize', blockType: Scratch.BlockType.REPORTER, text: 'normalize [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'distance', blockType: Scratch.BlockType.REPORTER, text: 'distance between [v1] and [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '1,0,0' } } },
					{ opcode: 'angleBetween', blockType: Scratch.BlockType.REPORTER, text: 'angle between [v1] and [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '1,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,1,0' } } },
					{ opcode: 'dot', blockType: Scratch.BlockType.REPORTER, text: 'dot [v1] [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'cross', blockType: Scratch.BlockType.REPORTER, text: 'cross [v1] [v2]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'lerp', blockType: Scratch.BlockType.REPORTER, text: 'lerp [v1] to [v2] by [t]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '10,10,10' }, t: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 } } },
					{ opcode: 'clamp', blockType: Scratch.BlockType.REPORTER, text: 'clamp [v] min [min] max [max]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, min: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, max: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } } },
					"---",

					{ text: '3D Transformations', blockType: Scratch.BlockType.LABEL },
					{ opcode: 'rotateVec3', blockType: Scratch.BlockType.REPORTER, text: 'rotate [v] by x: [rx] y: [ry] z: [rz]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, rx: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, ry: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, rz: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },
					{ opcode: 'rotateAroundOrigin', blockType: Scratch.BlockType.REPORTER, text: 'rotate [v] around [origin] by x: [rx] y: [ry] z: [rz]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, origin: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, rx: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, ry: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }, rz: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },
					"---",

					{ text: 'Camera Control', blockType: Scratch.BlockType.LABEL },
					{ opcode: 'getCamPos', blockType: Scratch.BlockType.REPORTER, text: 'camera pos' },
					{ opcode: 'setCamPos', blockType: Scratch.BlockType.COMMAND, text: 'set camera pos to [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'changeCamPos', blockType: Scratch.BlockType.COMMAND, text: 'change camera pos by [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'changeCamComponent', blockType: Scratch.BlockType.COMMAND, text: 'change camera [component] by [val]', arguments: { component: { type: Scratch.ArgumentType.STRING, menu: 'components' }, val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },

					{ opcode: 'getCamRot', blockType: Scratch.BlockType.REPORTER, text: 'camera rotation' },
					{ opcode: 'getCamDirection', blockType: Scratch.BlockType.REPORTER, text: 'camera [dir]', arguments: { dir: { type: Scratch.ArgumentType.STRING, menu: 'camDirs' } } },
					{ opcode: 'cameraLookAt', blockType: Scratch.BlockType.COMMAND, text: 'camera look at [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,10' } } },
					{ opcode: 'setCamRot', blockType: Scratch.BlockType.COMMAND, text: 'set camera rotation to [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'changeCamRot', blockType: Scratch.BlockType.COMMAND, text: 'change camera rotation by [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'changeCamAngle', blockType: Scratch.BlockType.COMMAND, text: 'change camera [angle] by [val]', arguments: { angle: { type: Scratch.ArgumentType.STRING, menu: 'angles' }, val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },

					{ opcode: 'getFOV', blockType: Scratch.BlockType.REPORTER, text: 'FOV' },
					{ opcode: 'setFOV', blockType: Scratch.BlockType.COMMAND, text: 'set FOV to [val]', arguments: { val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 } } },
					{ opcode: 'changeFOV', blockType: Scratch.BlockType.COMMAND, text: 'change FOV by [val]', arguments: { val: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 } } },
					"---",

					{ text: 'Projection Culling', blockType: Scratch.BlockType.LABEL },
					{ opcode: 'project', blockType: Scratch.BlockType.REPORTER, text: 'project [v] to screen', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'getZDepth', blockType: Scratch.BlockType.REPORTER, text: 'get z-depth of [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,10' } } },
					{ opcode: 'isCulled', blockType: Scratch.BlockType.BOOLEAN, text: 'is [v] culled (behind camera)', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' } } },
					{ opcode: 'frustumCull', blockType: Scratch.BlockType.BOOLEAN, text: 'is [v] visible (in frustum) near: [near] far: [far]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, near: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.1 }, far: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 } } },
					{ opcode: 'backFaceCull', blockType: Scratch.BlockType.BOOLEAN, text: 'is face [v1] [v2] [v3] culled', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '1,0,0' }, v3: { type: Scratch.ArgumentType.STRING, defaultValue: '0,1,0' } } },
					{ opcode: 'cullAgainstPlane', blockType: Scratch.BlockType.BOOLEAN, text: 'is [v] culled against plane [plane]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,0' }, plane: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0,1' } } },
					"---",

					{ text: '2D Sprite Movement', blockType: Scratch.BlockType.LABEL },
					{ opcode: 'getPosVec2', blockType: Scratch.BlockType.REPORTER, text: 'get position as vec2' },
					{ opcode: 'getMousePosVec2', blockType: Scratch.BlockType.REPORTER, text: 'mouse pos vec2' },
					{ opcode: 'getSizeVec2', blockType: Scratch.BlockType.REPORTER, text: 'get size as vec2' },
					{ opcode: 'goToVec2', blockType: Scratch.BlockType.COMMAND, text: 'go to vec2 [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0' } } },
					{ opcode: 'moveByVec2', blockType: Scratch.BlockType.COMMAND, text: 'change pos by vec2 [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0' } } },
					{ opcode: 'pointTo', blockType: Scratch.BlockType.COMMAND, text: 'point to vec2 [v]', arguments: { v: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0' } } },
					"---",

					{ hideFromPalette: !penPLoaded, text: 'Pen+ Integration', blockType: Scratch.BlockType.LABEL },
					{ hideFromPalette: !penPLoaded, opcode: 'drawTriangle', blockType: Scratch.BlockType.COMMAND, text: 'triangle between [v1] [v2] [v3]', arguments: { v1: { type: Scratch.ArgumentType.STRING, defaultValue: '0,0' }, v2: { type: Scratch.ArgumentType.STRING, defaultValue: '1,0' }, v3: { type: Scratch.ArgumentType.STRING, defaultValue: '0,1' } } },
				],
				menus: {
					components: { items: ['x', 'y', 'z'] },
					angles: { items: ['yaw', 'pitch', 'roll'] },
					camDirs: { items: ['forward', 'backward', 'right', 'left', 'up', 'down'] },
				}
			};
		}

		_parseVec(str) {
			if (!str) return [0, 0, 0];
			const s = String(str).split(',');
			return [Number(s[0]) || 0, Number(s[1]) || 0, Number(s[2]) || 0];
		}

		_vectorOp(v1, v2, op) {
			const [x1, y1, z1] = this._parseVec(v1);
			const [x2, y2, z2] = this._parseVec(v2);
			return `${op(x1, x2)},${op(y1, y2)},${op(z1, z2)}`;
		}

		_scalarOp(v, scalar, op) {
			const [x, y, z] = this._parseVec(v);
			return `${op(x, scalar)},${op(y, scalar)},${op(z, scalar)}`;
		}

		_normArr(arr) {
			const m = Math.hypot(arr[0], arr[1], arr[2]);
			if (m === 0) return [0, 0, 0];
			return [arr[0] / m, arr[1] / m, arr[2] / m];
		}

		_worldToView(targetV) {
			const cam = this.camera;
			const dx = targetV[0] - cam.pos.x;
			const dy = targetV[1] - cam.pos.y;
			const dz = targetV[2] - cam.pos.z;

			const yawRad = -cam.rot.yaw * DEG2RAD;
			const pitchRad = -cam.rot.pitch * DEG2RAD;
			const rollRad = -cam.rot.roll * DEG2RAD;

			const sinYaw = Math.sin(yawRad);
			const cosYaw = Math.cos(yawRad);
			const sinPitch = Math.sin(pitchRad);
			const cosPitch = Math.cos(pitchRad);
			const sinRoll = Math.sin(rollRad);
			const cosRoll = Math.cos(rollRad);

			let x = dx * cosYaw + dz * sinYaw;
			let z = -dx * sinYaw + dz * cosYaw;
			let y = dy;

			let tempY = y * cosPitch - z * sinPitch;
			z = y * sinPitch + z * cosPitch;
			y = tempY;

			let tempX = x * cosRoll - y * sinRoll;
			y = x * sinRoll + y * cosRoll;
			x = tempX;

			return { x, y, z };
		}

		_getCameraBasis() {
			const rot = this.camera.rot;
			const cache = this._basisCache;
			if (cache && cache.yaw === rot.yaw && cache.pitch === rot.pitch && cache.roll === rot.roll) {
				return cache;
			}

			const yawRad = rot.yaw * DEG2RAD;
			const pitchRad = rot.pitch * DEG2RAD;
			const rollRad = rot.roll * DEG2RAD;

			const cy = Math.cos(yawRad), sy = Math.sin(yawRad);
			const cp = Math.cos(pitchRad), sp = Math.sin(pitchRad);
			const cr = Math.cos(rollRad), sr = Math.sin(rollRad);

			const rotateCam = (x, y, z) => {
				let x1 = x * cy + z * sy;
				let z1 = -x * sy + z * cy;
				let y1 = y;

				let y2 = y1 * cp - z1 * sp;
				let z2 = y1 * sp + z1 * cp;
				let x2 = x1;

				let x3 = x2 * cr - y2 * sr;
				let y3 = x2 * sr + y2 * cr;
				let z3 = z2;
				return [x3, y3, z3];
			};

			const forward = this._normArr(rotateCam(0, 0, 1));
			const right = this._normArr(rotateCam(1, 0, 0));
			const up = this._normArr(rotateCam(0, 1, 0));

			const basis = { forward, right, up, yaw: rot.yaw, pitch: rot.pitch, roll: rot.roll };
			this._basisCache = basis;
			return basis;
		}

		_updateProjectionCache() {
			let fov = Scratch.Cast.toNumber(this.camera.fov);
			if (!Number.isFinite(fov)) fov = 60;
			if (fov < 1) fov = 1;
			if (fov > 179) fov = 179;
			this.camera.fov = fov;
			const fovRad = fov * DEG2RAD;
			this._projCache = { tanHalfFov: Math.tan(fovRad / 2) };
		}

		_getProjectionCache() {
			if (!this._projCache) this._updateProjectionCache();
			return this._projCache;
		}

		vec2(args) { return `${Scratch.Cast.toNumber(args.x) || 0},${Scratch.Cast.toNumber(args.y) || 0}`; }
		vec3(args) { return `${Scratch.Cast.toNumber(args.x) || 0},${Scratch.Cast.toNumber(args.y) || 0},${Scratch.Cast.toNumber(args.z) || 0}`; }

		getComponent(args) {
			const [x, y, z] = this._parseVec(args.v);
			return args.component === 'x' ? x : args.component === 'y' ? y : z;
		}

		setComponent(args) {
			let [x, y, z] = this._parseVec(args.v);
			const val = Scratch.Cast.toNumber(args.val) || 0;
			if (args.component === 'x') x = val;
			else if (args.component === 'y') y = val;
			else z = val;
			return `${x},${y},${z}`;
		}

		add(args) { return this._vectorOp(args.v1, args.v2, (a, b) => a + b); }
		sub(args) { return this._vectorOp(args.v1, args.v2, (a, b) => a - b); }
		mul(args) { return this._scalarOp(args.v, Scratch.Cast.toNumber(args.scalar) || 0, (a, b) => a * b); }
		div(args) { return this._scalarOp(args.v, Scratch.Cast.toNumber(args.scalar) || 1, (a, b) => b !== 0 ? a / b : 0); }

		mag(args) { return Math.hypot(...this._parseVec(args.v)); }

		dot(args) {
			const [x1, y1, z1] = this._parseVec(args.v1);
			const [x2, y2, z2] = this._parseVec(args.v2);
			return x1 * x2 + y1 * y2 + z1 * z2;
		}

		cross(args) {
			const [x1, y1, z1] = this._parseVec(args.v1);
			const [x2, y2, z2] = this._parseVec(args.v2);
			return `${y1 * z2 - z1 * y2},${z1 * x2 - x1 * z2},${x1 * y2 - y1 * x2}`;
		}

		normalize(args) {
			const v = this._parseVec(args.v);
			const m = Math.hypot(...v);
			if (m === 0) return '0,0,0';
			const [x, y, z] = v;
			return `${x / m},${y / m},${z / m}`;
		}

		distance(args) {
			const [x1, y1, z1] = this._parseVec(args.v1);
			const [x2, y2, z2] = this._parseVec(args.v2);
			return Math.hypot(x1 - x2, y1 - y2, z1 - z2);
		}

		angleBetween(args) {
			const [x1, y1, z1] = this._parseVec(args.v1);
			const [x2, y2, z2] = this._parseVec(args.v2);
			const dotProduct = x1 * x2 + y1 * y2 + z1 * z2;
			const mag1 = Math.hypot(x1, y1, z1);
			const mag2 = Math.hypot(x2, y2, z2);
			if (mag1 === 0 || mag2 === 0) return 0;
			const cosTheta = Math.min(1, Math.max(-1, dotProduct / (mag1 * mag2)));
			return Math.acos(cosTheta) * RAD2DEG;
		}

		lerp(args) {
			const [x1, y1, z1] = this._parseVec(args.v1);
			const [x2, y2, z2] = this._parseVec(args.v2);
			const t = Scratch.Cast.toNumber(args.t) || 0;
			const invT = 1 - t;
			const x = x1 * invT + x2 * t;
			const y = y1 * invT + y2 * t;
			const z = z1 * invT + z2 * t;
			return `${x},${y},${z}`;
		}

		clamp(args) {
			const [x, y, z] = this._parseVec(args.v);
			let min = Scratch.Cast.toNumber(args.min);
			let max = Scratch.Cast.toNumber(args.max);
			if (!Number.isFinite(min)) min = 0;
			if (!Number.isFinite(max)) max = 1;
			if (min > max) {
				const tmp = min;
				min = max;
				max = tmp;
			}
			const clamped = (val) => Math.min(max, Math.max(min, val));
			return `${clamped(x)},${clamped(y)},${clamped(z)}`;
		}


		_rotate3D(x, y, z, rx, ry, rz) {

			let tempX = x * Math.cos(rz) - y * Math.sin(rz);
			let tempY = x * Math.sin(rz) + y * Math.cos(rz);
			x = tempX; y = tempY;
			
			tempX = x * Math.cos(ry) + z * Math.sin(ry);
			let tempZ = -x * Math.sin(ry) + z * Math.cos(ry);
			x = tempX; z = tempZ;
			
			tempY = y * Math.cos(rx) - z * Math.sin(rx);
			tempZ = y * Math.sin(rx) + z * Math.cos(rx);
			y = tempY; z = tempZ;
			
			return `${x},${y},${z}`;
		}

		rotateVec3(args) {
			const v = this._parseVec(args.v);
			const rx = (Scratch.Cast.toNumber(args.rx) || 0) * DEG2RAD;
			const ry = (Scratch.Cast.toNumber(args.ry) || 0) * DEG2RAD;
			const rz = (Scratch.Cast.toNumber(args.rz) || 0) * DEG2RAD;
			return this._rotate3D(v[0], v[1], v[2], rx, ry, rz);
		}

		rotateAroundOrigin(args) {
			const [vx, vy, vz] = this._parseVec(args.v);
			const [ox, oy, oz] = this._parseVec(args.origin);
			const rx = (Scratch.Cast.toNumber(args.rx) || 0) * DEG2RAD;
			const ry = (Scratch.Cast.toNumber(args.ry) || 0) * DEG2RAD;
			const rz = (Scratch.Cast.toNumber(args.rz) || 0) * DEG2RAD;
		
			let x = vx - ox;
			let y = vy - oy;
			let z = vz - oz;
			
			const rotated = this._rotate3D(x, y, z, rx, ry, rz).split(',');
			x = Number(rotated[0]);
			y = Number(rotated[1]);
			z = Number(rotated[2]);
		
			return `${x + ox},${y + oy},${z + oz}`;
		}


		project(args) {
			const v = this._parseVec(args.v);
			const { x, y, z } = this._worldToView(v);

			if (z <= 0.01) return '0,0';

			const proj = this._getProjectionCache();
			const tanHalfFov = proj.tanHalfFov;

			const ndcX = (x / z) / (tanHalfFov * STAGE_ASPECT);
			const ndcY = (y / z) / tanHalfFov;

			const screenX = ndcX * STAGE_HALF_WIDTH;
			const screenY = ndcY * STAGE_HALF_HEIGHT;

			return `${screenX},${screenY}`;
		}

		getZDepth(args) {
			const v = this._parseVec(args.v);
			const { z } = this._worldToView(v);
			return z;
		}

		isCulled(args) {
			const v = this._parseVec(args.v);
			const { z } = this._worldToView(v);
			return z <= 0;
		}

		frustumCull(args) {
			const v = this._parseVec(args.v);
			let near = Scratch.Cast.toNumber(args.near);
			let far = Scratch.Cast.toNumber(args.far);

			if (!Number.isFinite(near) || near <= 0) near = 0.1;
			if (!Number.isFinite(far) || far <= near) far = near + 0.1;

			const { x, y, z } = this._worldToView(v);
			if (z <= 0) return false;
			if (z < near || z > far) return false;

			const proj = this._getProjectionCache();
			const tanHalfFov = proj.tanHalfFov;

			const ndcX = (x / z) / (tanHalfFov * STAGE_ASPECT);
			const ndcY = (y / z) / tanHalfFov;

			return Math.abs(ndcX) <= 1 && Math.abs(ndcY) <= 1;
		}

		cullAgainstPlane(args) {
			const v = this._parseVec(args.v);
			const { x, y, z } = this._worldToView(v);

			const planeStr = String(args.plane || '');
			const parts = planeStr.split(',');
			const nx = Number(parts[0]) || 0;
			const ny = Number(parts[1]) || 0;
			const nz = Number(parts[2]) || 0;
			const d = Number(parts[3]) || 0;

			return nx * x + ny * y + nz * z + d <= 0;
		}

		backFaceCull(args) {
			const p1 = this._worldToView(this._parseVec(args.v1));
			const p2 = this._worldToView(this._parseVec(args.v2));
			const p3 = this._worldToView(this._parseVec(args.v3));

			const ux = p2.x - p1.x;
			const uy = p2.y - p1.y;
			const uz = p2.z - p1.z;

			const vx = p3.x - p1.x;
			const vy = p3.y - p1.y;
			const vz = p3.z - p1.z;

			const nx = uy * vz - uz * vy;
			const ny = uz * vx - ux * vz;
			const nz = ux * vy - uy * vx;

			return nz >= 0;
		}

		cameraLookAt(args) {
			const [tx, ty, tz] = this._parseVec(args.v);
			const { pos } = this.camera;

			const dx = pos.x - tx;
			const dy = pos.y - ty;
			const dz = pos.z - tz;

			let yawRad = Math.atan2(dx, -dz);
			let yaw = yawRad * RAD2DEG;
			
			const r = Math.hypot(dx, dz);
			let pitchRad = Math.atan2(dy, r);
			let pitch = pitchRad * RAD2DEG;
			
			this.camera.rot.yaw = -yaw; 
			this.camera.rot.pitch = -Math.min(90, Math.max(-90, -pitch));
			this._basisCache = null;
		}

		setCamPos(args) { 
			const [x, y, z] = this._parseVec(args.v);
			this.camera.pos.x = x; this.camera.pos.y = y; this.camera.pos.z = z;
		}
		changeCamPos(args) { 
			const [x, y, z] = this._parseVec(args.v);
			this.camera.pos.x += x; this.camera.pos.y += y; this.camera.pos.z += z;
		}
		changeCamComponent(args) { 
			const component = args.component;
			if (!['x', 'y', 'z'].includes(component)) return;
			const val = Scratch.Cast.toNumber(args.val) || 0;
			this.camera.pos[component] += val;
		}
		getCamPos() { return `${this.camera.pos.x},${this.camera.pos.y},${this.camera.pos.z}`; }

		setCamRot(args) { 
			const [yaw, pitch, roll] = this._parseVec(args.v);
			this.camera.rot.yaw = yaw; this.camera.rot.pitch = pitch; this.camera.rot.roll = roll;
			this._basisCache = null;
		}
		changeCamRot(args) { 
			const [yaw, pitch, roll] = this._parseVec(args.v);
			this.camera.rot.yaw += yaw; this.camera.rot.pitch += pitch; this.camera.rot.roll += roll;
			this._basisCache = null;
		}
		changeCamAngle(args) { 
			const angle = args.angle;
			if (!['yaw', 'pitch', 'roll'].includes(angle)) return;
			const val = Scratch.Cast.toNumber(args.val) || 0;
			this.camera.rot[angle] += val; 
			this._basisCache = null;
		}
		getCamRot() { return `${this.camera.rot.yaw},${this.camera.rot.pitch},${this.camera.rot.roll}`; }

		getCamDirection(args) {
			const basis = this._getCameraBasis();
			let v;
			switch (args.dir) {
				case 'backward':
					v = [-basis.forward[0], -basis.forward[1], -basis.forward[2]];
					break;
				case 'right':
					v = basis.right;
					break;
				case 'left':
					v = [-basis.right[0], -basis.right[1], -basis.right[2]];
					break;
				case 'up':
					v = basis.up;
					break;
				case 'down':
					v = [-basis.up[0], -basis.up[1], -basis.up[2]];
					break;
				case 'forward':
				default:
					v = basis.forward;
					break;
			}
			return `${v[0]},${v[1]},${v[2]}`;
		}

		setFOV(args) {
			const val = Scratch.Cast.toNumber(args.val);
			if (!Number.isFinite(val)) return;
			this.camera.fov = val;
			this._updateProjectionCache();
		}

		changeFOV(args) {
			const delta = Scratch.Cast.toNumber(args.val) || 0;
			this.camera.fov += delta;
			this._updateProjectionCache();
		}

		getFOV() { return this.camera.fov; }

		moveByVec2(args, util) {
			const [dx, dy] = this._parseVec(args.v);
			util.target.setXY(util.target.x + dx, util.target.y + dy);
		}

		pointTo(args, util) {
			const [tx, ty] = this._parseVec(args.v);
			const dx = tx - util.target.x;
			const dy = ty - util.target.y;
			
			const direction = 90 - (Math.atan2(dy, dx) * RAD2DEG);
			util.target.setDirection(direction);
		}

		goToVec2(args, util) {
			const [dx, dy] = this._parseVec(args.v);
			util.target.setXY(dx, dy);
		}

		getPosVec2(args, util) {
			return `${util.target.x},${util.target.y}`;
		}

		getSizeVec2(args, util) {
			const bounds = Scratch.vm.renderer.getBounds(util.target.drawableID);
			return `${Math.ceil(bounds.width)},${Math.ceil(bounds.height)}`;
		}
		
		getMousePosVec2() {
			return `${Math.round(mouse._scratchX)},${Math.round(mouse._scratchY)}`;
		}

		drawTriangle(args, util) {
			const [x1, y1] = this._parseVec(args.v1);
			const [x2, y2] = this._parseVec(args.v2);
			const [x3, y3] = this._parseVec(args.v3);
			
			if (penPModule) {
				penPModule.drawSolidTri({ x1, y1, x2, y2, x3, y3 }, util);
			}
		}
	}

	Scratch.extensions.register(new VecMath());
})(Scratch);
