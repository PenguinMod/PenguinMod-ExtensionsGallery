// Name: Vectors!
// ID: vectors
// Description: Adds a set of blocks for vector operations in 2D and 3D space.
// By: cool_skratcher <https://scratch.mit.edu/users/cool_skratcher/>
// License: MIT

(function(Scratch) {
  'use strict';

  class VecMath {
    constructor() {
      this.camera = { pos: { x: 0, y: 0, z: 0 }, rot: { yaw: 0, pitch: 0, roll: 0 }, fov: 100 };
    }

    getInfo() {
      return {
        id: 'vectors',
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
          { opcode: 'getPosVec2', blockType: Scratch.BlockType.REPORTER, text: 'get position as vec2' },
          { opcode: 'getSizeVec2', blockType: Scratch.BlockType.REPORTER, text: 'get size as vec2' },
        ],
        menus: {
          components: { items: ['x', 'y', 'z'] },
          angles: { items: ['yaw', 'pitch', 'roll'] },
        }
      };
    }

    // Vector creation
    vec2(args) { return `${args.x},${args.y},0`; }
    vec3(args) { return `${args.x},${args.y},${args.z}`; }

    // Vector component access
    getComponent(args) {
      const [x, y, z = 0] = args.v.split(',').map(Number);
      return args.component === 'x' ? x : args.component === 'y' ? y : z;
    }

    // Basic vector math
    add(args) { return this._vectorOp(args.v1, args.v2, (a, b) => a + b); }
    sub(args) { return this._vectorOp(args.v1, args.v2, (a, b) => a - b); }
    mul(args) { return this._scalarOp(args.v, args.scalar, (a, b) => a * b); }
    div(args) { return this._scalarOp(args.v, args.scalar, (a, b) => a / b); }
    mag(args) { return Math.hypot(...args.v.split(',').map(Number)); }
    dot(args) {
      const [x1, y1, z1] = args.v1.split(',').map(Number);
      const [x2, y2, z2] = args.v2.split(',').map(Number);
      return x1 * x2 + y1 * y2 + z1 * z2;
    }
    cross(args) {
      const [x1, y1, z1] = args.v1.split(',').map(Number);
      const [x2, y2, z2] = args.v2.split(',').map(Number);
      return `${y1 * z2 - z1 * y2},${z1 * x2 - x1 * z2},${x1 * y2 - y1 * x2}`;
    }

    rotateVec3(args) {
      const [x, y, z] = args.v.split(',').map(Number);
      return this._rotate3D({ x, y, z }, this._toRadians(args.rx), this._toRadians(args.ry), this._toRadians(args.rz));
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
      const [x, y, z] = args.v.split(',').map(Number);
      const cam = this.camera;
      const dx = x - cam.pos.x, dy = y - cam.pos.y, dz = z - cam.pos.z;

      // Apply yaw rotation
      const camZ = dz * Math.cos(cam.rot.yaw) + dx * Math.sin(cam.rot.yaw);
      const camX = dx * Math.cos(cam.rot.yaw) - dz * Math.sin(cam.rot.yaw);

      // Apply pitch rotation
      const tempY = dy * Math.cos(cam.rot.pitch) - camZ * Math.sin(cam.rot.pitch);
      const tempZ = dy * Math.sin(cam.rot.pitch) + camZ * Math.cos(cam.rot.pitch);
      const finalZ = tempZ; // This is now the new Z after pitch rotation
      const finalY = tempY; // This is now the new Y after pitch rotation

      // Apply roll rotation
      const finalX = finalY * Math.sin(cam.rot.roll) + camX * Math.cos(cam.rot.roll);
      const adjustedY = finalY * Math.cos(cam.rot.roll) - camX * Math.sin(cam.rot.roll);

      // Calculate screen coordinates
      const screenX = (finalX / finalZ) * cam.fov;
      const screenY = (adjustedY / finalZ) * cam.fov;
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
      const [x, y, z] = args.v.split(',').map(Number);
      const { pos, rot, fov } = this.camera;
      const near = args.near, far = args.far;
    
      // Translate point relative to camera
      const dx = x - pos.x;
      const dy = y - pos.y;
      const dz = z - pos.z;
    
      // Rotate point relative to camera
      const cx = dx * Math.cos(rot.yaw) - dz * Math.sin(rot.yaw);
      const cz = dx * Math.sin(rot.yaw) + dz * Math.cos(rot.yaw);
      const cy = dy;
    
      // Check depth (near and far planes)
      if (cz < near || cz > far) return true;
    
      // Check horizontal FOV
      const hHalf = Math.tan((fov / 2) * (Math.PI / 180)) * cz;
      if (cx < -hHalf || cx > hHalf) return true;
    
      // Check vertical FOV
      const vHalf = hHalf * (3 / 4); // Assuming aspect ratio of 4:3
      if (cy < -vHalf || cy > vHalf) return true;
    
      return false;
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
      const [x1, y1, z1] = v1.split(',').map(Number);
      const [x2, y2, z2] = v2.split(',').map(Number);
      return `${op(x1, x2)},${op(y1, y2)},${op(z1, z2)}`;
    }

    _scalarOp(v, scalar, op) {
      const [x, y, z] = v.split(',').map(Number);
      return `${op(x, scalar)},${op(y, scalar)},${op(z, scalar)}`;
    }

    _setVec(target, v) { const [x, y, z] = v.split(',').map(Number); target.x = x; target.y = y; target.z = z; }
    _addVec(target, v) { const [x, y, z] = v.split(',').map(Number); target.x += x; target.y += y; target.z += z; }
    _setRot(target, v) { const [x, y, z] = v.split(',').map(Number); target.yaw = x; target.pitch = y; target.roll = z; }
    _addRot(target, v) { const [x, y, z] = v.split(',').map(Number); target.yaw += x; target.pitch += y; target.roll += z; }

    _rotate3D(v, rx, ry, rz) {
      const cos = Math.cos, sin = Math.sin;
      let { x, y, z } = v;
      [y, z] = [y * cos(rx) - z * sin(rx), y * sin(rx) + z * cos(rx)];
      [x, z] = [x * cos(ry) + z * sin(ry), -x * sin(ry) + z * cos(ry)];
      [x, y] = [x * cos(rz) - y * sin(rz), x * sin(rz) + y * cos(rz)];
      return `${x},${y},${z}`;
    }

    moveByVec2(args, util) {
      const [dx, dy] = args.v.split(',').map(Number);
      const x = Scratch.Cast.toNumber(dx);
      const y = Scratch.Cast.toNumber(dy);
      util.target.setXY(util.target.x + x, util.target.y + y);
    }

    goToVec2(args, util) {
      const [dx, dy] = args.v.split(',').map(Number);
      const x = Scratch.Cast.toNumber(dx);
      const y = Scratch.Cast.toNumber(dy);
      util.target.setXY(x, y);
    }

    getPosVec2(args, util) {
      return `${util.target.x},${util.target.y}`;
    }

    getSizeVec2(args, util) {
      const bounds = Scratch.vm.renderer.getBounds(util.target.drawableID)
      return `${Math.ceil(bounds.width)},${Math.ceil(bounds.height)}`;
    }

    // New utility function to convert degrees to radians
    _toRadians(degrees) {
      return degrees * (Math.PI / 180);
    }
  }

  Scratch.extensions.register(new VecMath());
})(Scratch);
