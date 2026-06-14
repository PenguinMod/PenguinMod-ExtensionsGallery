// ============================================================
//  3Dcamera — PenguinMod / TurboWarp Extension
//  A full software 3D renderer embedded in Scratch.
//  Author: Hacttagamexx
//  Version: 2.0.0
//
//  Features:
//   • Full perspective projection pipeline
//   • Z-buffer (depth buffer) per-pixel
//   • Phong shading (ambient + diffuse + specular)
//   • Multiple primitive types: Box, Sphere, Plane, Cylinder, Pyramid, Cone
//   • OBJ model import (from URL or text)
//   • Texture mapping with image loading
//   • Shadow mapping (soft shadows)
//   • Environment hemisphere lighting
//   • Material presets (metal, glass, plastic, etc.)
//   • Point lights, Directional lights, Ambient light
//   • Fog (linear / exponential)
//   • Skybox solid color or gradient
//   • Object transforms: position, rotation (Euler), scale
//   • Materials: color, shininess, wireframe mode, texture
//   • Raycasting: world-space ray from screen pixel
//   • Object hit detection (bounding-sphere)
//   • Camera: position, yaw/pitch/roll, FOV, near/far
//   • 3-D point projection → 2-D screen coordinate
//   • Render-quality control (pixel size)
//   • Object visibility toggle
//   • Delete objects by name
//   • 40+ blocks in total
// ============================================================

(function (Scratch) {
  'use strict';

  // ============================================================
  // §1  MATH LIBRARY
  // ============================================================

  const DEG = Math.PI / 180;

  // ── Vec2 (for UV texture coordinates) ───────────────────────
  class Vec2 {
    constructor(x = 0, y = 0) { this.x = x; this.y = y; }
    clone()        { return new Vec2(this.x, this.y); }
    add(v)         { return new Vec2(this.x + v.x, this.y + v.y); }
    mul(s)         { return new Vec2(this.x * s, this.y * s); }
    lerp(v, t)     { return new Vec2(this.x + (v.x - this.x) * t, this.y + (v.y - this.y) * t); }
    static fromArray(a) { return new Vec2(a[0], a[1]); }
  }

  // ── Vec3 ──────────────────────────────────────────────────
  class Vec3 {
    constructor(x = 0, y = 0, z = 0) { this.x = x; this.y = y; this.z = z; }

    clone()           { return new Vec3(this.x, this.y, this.z); }
    add(v)            { return new Vec3(this.x + v.x, this.y + v.y, this.z + v.z); }
    sub(v)            { return new Vec3(this.x - v.x, this.y - v.y, this.z - v.z); }
    mul(s)            { return new Vec3(this.x * s,   this.y * s,   this.z * s);   }
    div(s)            { return new Vec3(this.x / s,   this.y / s,   this.z / s);   }
    dot(v)            { return this.x * v.x + this.y * v.y + this.z * v.z; }
    lengthSq()        { return this.dot(this); }
    length()          { return Math.sqrt(this.lengthSq()); }
    normalize()       { const l = this.length(); return l > 1e-8 ? this.div(l) : new Vec3(0,1,0); }
    negate()          { return new Vec3(-this.x, -this.y, -this.z); }
    cross(v) {
      return new Vec3(
        this.y * v.z - this.z * v.y,
        this.z * v.x - this.x * v.z,
        this.x * v.y - this.y * v.x
      );
    }
    lerp(v, t)        { return this.add(v.sub(this).mul(t)); }
    static fromArray(a) { return new Vec3(a[0], a[1], a[2]); }
    toArray()          { return [this.x, this.y, this.z]; }
  }

  // ── Plane ─────────────────────────────────────────────────
  class Plane {
    constructor(normal = new Vec3(0, 1, 0), distance = 0) {
      this.normal = normal.normalize();
      this.distance = distance;
    }

    // Signed distance from point to plane
    distanceToPoint(point) {
      return this.normal.dot(point) - this.distance;
    }
  }

  // ── Vec4 ──────────────────────────────────────────────────
  class Vec4 {
    constructor(x = 0, y = 0, z = 0, w = 1) { this.x = x; this.y = y; this.z = z; this.w = w; }
    toVec3() { return new Vec3(this.x, this.y, this.z); }
  }

  // ── Perlin Noise (simplified) ─────────────────────────────
  const grad = [
    new Vec3(1,1,0),new Vec3(-1,1,0),new Vec3(1,-1,0),new Vec3(-1,-1,0),
    new Vec3(1,0,1),new Vec3(-1,0,1),new Vec3(1,0,-1),new Vec3(-1,0,-1),
    new Vec3(0,1,1),new Vec3(0,-1,1),new Vec3(0,1,-1),new Vec3(0,-1,-1)
  ];
  const p = new Uint8Array(512);
  for (let i=0; i<256; i++) p[i] = p[i+256] = Math.random()*256|0;

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(t, a, b) { return a + t * (b - a); }
  function gradDot(hash, x, y, z) {
    const g = grad[hash % 12];
    return x*g.x + y*g.y + z*g.z;
  }

  function perlinNoise(x, y, z) {
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;
    const Z = Math.floor(z) & 255;

    x -= Math.floor(x);
    y -= Math.floor(y);
    z -= Math.floor(z);

    const u = fade(x);
    const v = fade(y);
    const w = fade(z);

    const A = p[X]+Y, AA = p[A]+Z, AB = p[A+1]+Z;
    const B = p[X+1]+Y, BA = p[B]+Z, BB = p[B+1]+Z;

    return lerp(w, lerp(v, lerp(u, gradDot(p[AA], x, y, z), gradDot(p[BA], x-1, y, z)),
                           lerp(u, gradDot(p[AB], x, y-1, z), gradDot(p[BB], x-1, y-1, z))),
                   lerp(v, lerp(u, gradDot(p[AA+1], x, y, z-1), gradDot(p[BA+1], x-1, y, z-1)),
                           lerp(u, gradDot(p[AB+1], x, y-1, z-1), gradDot(p[BB+1], x-1, y-1, z-1))));
  }

  // ── Bone ──────────────────────────────────────────────────
  class Bone {
    constructor(name, parent = null) {
      this.name = name;
      this.parent = parent;
      this.position = new Vec3(0,0,0);
      this.rotation = new Vec3(0,0,0); // Euler degrees
      this.scale = new Vec3(1,1,1);
      this._localMatrix = Mat4.identity();
      this._worldMatrix = Mat4.identity();
      this._dirty = true;
    }

    localMatrix() {
      if (!this._dirty) return this._localMatrix;
      const T  = Mat4.translation(this.position.x, this.position.y, this.position.z);
      const Rx = Mat4.rotationX(this.rotation.x * DEG);
      const Ry = Mat4.rotationY(this.rotation.y * DEG);
      const Rz = Mat4.rotationZ(this.rotation.z * DEG);
      const S  = Mat4.scale(this.scale.x, this.scale.y, this.scale.z);
      this._localMatrix = T.mul(Ry).mul(Rx).mul(Rz).mul(S);
      this._dirty = false;
      return this._localMatrix;
    }

    worldMatrix() {
      if (this.parent) {
        this._worldMatrix = this.parent.worldMatrix().mul(this.localMatrix());
      } else {
        this._worldMatrix = this.localMatrix();
      }
      return this._worldMatrix;
    }

    setRotation(x, y, z) {
      this.rotation = new Vec3(x, y, z);
      this._dirty = true;
    }
    setPosition(x, y, z) {
      this.position = new Vec3(x, y, z);
      this._dirty = true;
    }
    setScale(x, y, z) {
      this.scale = new Vec3(x, y, z);
      this._dirty = true;
    }
  }

  // ── Mat4 (column-major) ───────────────────────────────────
  class Mat4 {
    constructor() { this.m = new Float64Array(16); this.identity(); }

    identity() {
      const m = this.m;
      m[0]=1; m[4]=0; m[8]=0;  m[12]=0;
      m[1]=0; m[5]=1; m[9]=0;  m[13]=0;
      m[2]=0; m[6]=0; m[10]=1; m[14]=0;
      m[3]=0; m[7]=0; m[11]=0; m[15]=1;
      return this;
    }

    static identity() { return new Mat4(); }

    static translation(x, y, z) {
      const r = new Mat4();
      r.m[12] = x; r.m[13] = y; r.m[14] = z;
      return r;
    }

    static scale(x, y, z) {
      const r = new Mat4();
      r.m[0] = x; r.m[5] = y; r.m[10] = z;
      return r;
    }

    static rotationX(a) {
      const r = new Mat4();
      const c = Math.cos(a), s = Math.sin(a);
      r.m[5]=c; r.m[6]=s; r.m[9]=-s; r.m[10]=c;
      return r;
    }

    static rotationY(a) {
      const r = new Mat4();
      const c = Math.cos(a), s = Math.sin(a);
      r.m[0]=c; r.m[2]=-s; r.m[8]=s; r.m[10]=c;
      return r;
    }

    static rotationZ(a) {
      const r = new Mat4();
      const c = Math.cos(a), s = Math.sin(a);
      r.m[0]=c; r.m[1]=s; r.m[4]=-s; r.m[5]=c;
      return r;
    }

    mul(b) {
      const r = new Mat4();
      const a = this.m, bm = b.m, rm = r.m;
      for (let row = 0; row < 4; row++) {
        for (let col = 0; col < 4; col++) {
          let sum = 0;
          for (let k = 0; k < 4; k++) {
            sum += a[k * 4 + row] * bm[col * 4 + k];
          }
          rm[col * 4 + row] = sum;
        }
      }
      return r;
    }

    mulVec4(v) {
      const m = this.m;
      return new Vec4(
        m[0]*v.x + m[4]*v.y + m[8]*v.z  + m[12]*v.w,
        m[1]*v.x + m[5]*v.y + m[9]*v.z  + m[13]*v.w,
        m[2]*v.x + m[6]*v.y + m[10]*v.z + m[14]*v.w,
        m[3]*v.x + m[7]*v.y + m[11]*v.z + m[15]*v.w
      );
    }

    mulVec3(v) {
      const r = this.mulVec4(new Vec4(v.x, v.y, v.z, 1));
      return new Vec3(r.x, r.y, r.z);
    }

    mulDir(v) {
      const r = this.mulVec4(new Vec4(v.x, v.y, v.z, 0));
      return new Vec3(r.x, r.y, r.z);
    }

    transpose() {
      const r = new Mat4(), m = this.m, rm = r.m;
      for (let i = 0; i < 4; i++)
        for (let j = 0; j < 4; j++)
          rm[j * 4 + i] = m[i * 4 + j];
      return r;
    }

    static perspective(fovY, aspect, near, far) {
      const r = new Mat4();
      const f = 1.0 / Math.tan(fovY * 0.5);
      const nf = 1.0 / (near - far);
      r.m[0]  = f / aspect;
      r.m[5]  = f;
      r.m[10] = (far + near) * nf;
      r.m[11] = -1;
      r.m[14] = 2 * far * near * nf;
      r.m[15] = 0;
      return r;
    }

    static orthographic(left, right, bottom, top, near, far) {
      const r = new Mat4();
      r.m[0] = 2 / (right - left);
      r.m[5] = 2 / (top - bottom);
      r.m[10] = -2 / (far - near);
      r.m[12] = -(right + left) / (right - left);
      r.m[13] = -(top + bottom) / (top - bottom);
      r.m[14] = -(far + near) / (far - near);
      return r;
    }

    static lookAt(eye, center, up) {
      const f = center.sub(eye).normalize();
      const s = f.cross(up).normalize();
      const u = s.cross(f);
      const r = new Mat4();
      const m = r.m;
      m[0]=s.x;  m[4]=s.y;  m[8]=s.z;   m[12]=-s.dot(eye);
      m[1]=u.x;  m[5]=u.y;  m[9]=u.z;   m[13]=-u.dot(eye);
      m[2]=-f.x; m[6]=-f.y; m[10]=-f.z; m[14]=f.dot(eye);
      m[15]=1;
      return r;
    }

    inverse() {
      const m = this.m, inv = new Float64Array(16);
      inv[0]  =  m[5]*m[10]*m[15] - m[5]*m[11]*m[14] - m[9]*m[6]*m[15] + m[9]*m[7]*m[14] + m[13]*m[6]*m[11] - m[13]*m[7]*m[10];
      inv[4]  = -m[4]*m[10]*m[15] + m[4]*m[11]*m[14] + m[8]*m[6]*m[15] - m[8]*m[7]*m[14] - m[12]*m[6]*m[11] + m[12]*m[7]*m[10];
      inv[8]  =  m[4]*m[9]*m[15]  - m[4]*m[11]*m[13] - m[8]*m[5]*m[15] + m[8]*m[7]*m[13] + m[12]*m[5]*m[11] - m[12]*m[7]*m[9];
      inv[12] = -m[4]*m[9]*m[14]  + m[4]*m[10]*m[13] + m[8]*m[5]*m[14] - m[8]*m[6]*m[13] - m[12]*m[5]*m[10] + m[12]*m[6]*m[9];
      inv[1]  = -m[1]*m[10]*m[15] + m[1]*m[11]*m[14] + m[9]*m[2]*m[15] - m[9]*m[3]*m[14] - m[13]*m[2]*m[11] + m[13]*m[3]*m[10];
      inv[5]  =  m[0]*m[10]*m[15] - m[0]*m[11]*m[14] - m[8]*m[2]*m[15] + m[8]*m[3]*m[14] + m[12]*m[2]*m[11] - m[12]*m[3]*m[10];
      inv[9]  = -m[0]*m[9]*m[15]  + m[0]*m[11]*m[13] + m[8]*m[1]*m[15] - m[8]*m[3]*m[13] - m[12]*m[1]*m[11] + m[12]*m[3]*m[9];
      inv[13] =  m[0]*m[9]*m[14]  - m[0]*m[10]*m[13] - m[8]*m[1]*m[14] + m[8]*m[2]*m[13] + m[12]*m[1]*m[10] - m[12]*m[2]*m[9];
      inv[2]  =  m[1]*m[6]*m[15]  - m[1]*m[7]*m[14]  - m[5]*m[2]*m[15] + m[5]*m[3]*m[14] + m[13]*m[2]*m[7]  - m[13]*m[3]*m[6];
      inv[6]  = -m[0]*m[6]*m[15]  + m[0]*m[7]*m[14]  + m[4]*m[2]*m[15] - m[4]*m[3]*m[14] - m[12]*m[2]*m[7]  + m[12]*m[3]*m[6];
      inv[10] =  m[0]*m[5]*m[15]  - m[0]*m[7]*m[13]  - m[4]*m[1]*m[15] + m[4]*m[3]*m[13] + m[12]*m[1]*m[7]  - m[12]*m[3]*m[5];
      inv[14] = -m[0]*m[5]*m[14]  + m[0]*m[6]*m[13]  + m[4]*m[1]*m[14] - m[4]*m[2]*m[13] - m[12]*m[1]*m[6]  + m[12]*m[2]*m[5];
      inv[3]  = -m[1]*m[6]*m[11]  + m[1]*m[7]*m[10]  + m[5]*m[2]*m[11] - m[5]*m[3]*m[10] - m[9]*m[2]*m[7]   + m[9]*m[3]*m[6];
      inv[7]  =  m[0]*m[6]*m[11]  - m[0]*m[7]*m[10]  - m[4]*m[2]*m[11] + m[4]*m[3]*m[10] + m[8]*m[2]*m[7]   - m[8]*m[3]*m[6];
      inv[11] = -m[0]*m[5]*m[11]  + m[0]*m[7]*m[9]   + m[4]*m[1]*m[11] - m[4]*m[3]*m[9]  - m[8]*m[1]*m[7]   + m[8]*m[3]*m[5];
      inv[15] =  m[0]*m[5]*m[10]  - m[0]*m[6]*m[9]   - m[4]*m[1]*m[10] + m[4]*m[2]*m[9]  + m[8]*m[1]*m[6]   - m[8]*m[2]*m[5];
      let det = m[0]*inv[0] + m[1]*inv[4] + m[2]*inv[8] + m[3]*inv[12];
      if (Math.abs(det) < 1e-12) return Mat4.identity();
      det = 1.0 / det;
      const res = new Mat4();
      for (let i = 0; i < 16; i++) res.m[i] = inv[i] * det;
      return res;
    }
  }

  // ── Color helpers ─────────────────────────────────────────
  function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) hex = hex.split('').map(c=>c+c).join('');
    const n = parseInt(hex, 16);
    return { r: (n >> 16) & 0xff, g: (n >> 8) & 0xff, b: n & 0xff };
  }

  function clamp01(v) { return Math.max(0, Math.min(1, v)); }
  function clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); }

  // ── Texture Manager ───────────────────────────────────────
  class Texture {
    constructor(url = null, color = null) {
      this.image = null;
      this.data = null;
      this.width = 1;
      this.height = 1;
      this.loaded = false;
      this.error = false;
      this._solidColor = color || null;

      if (url) this.loadFromUrl(url);
      else if (color) this._createSolidColor(color);
    }

    _createSolidColor(hex) {
      const c = hexToRgb(hex);
      this.width = 1;
      this.height = 1;
      this.data = new Uint8ClampedArray([c.r, c.g, c.b, 255]);
      this.loaded = true;
    }

    loadFromUrl(url) {
      if (typeof document === 'undefined') {
        this.error = true;
        return;
      }
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        this.data = ctx.getImageData(0, 0, img.width, img.height).data;
        this.width = img.width;
        this.height = img.height;
        this.loaded = true;
      };
      img.onerror = () => { this.error = true; };
      img.src = url;
      this.image = img;
    }

    sample(u, v) {
      if (!this.loaded || !this.data) return { r: 255, g: 255, b: 255 };
      let x = Math.floor(u * (this.width - 1));
      let y = Math.floor(v * (this.height - 1));
      x = Math.max(0, Math.min(this.width - 1, x));
      y = Math.max(0, Math.min(this.height - 1, y));
      const idx = (y * this.width + x) * 4;
      return { r: this.data[idx], g: this.data[idx+1], b: this.data[idx+2] };
    }
  }

  class TextureManager {
    constructor() { this.textures = new Map(); }
    createSolid(name, hex) { this.textures.set(name, new Texture(null, hex)); }
    loadFromUrl(name, url) { this.textures.set(name, new Texture(url)); }
    get(name) { return this.textures.get(name); }
    delete(name) { this.textures.delete(name); }
    clear() { this.textures.clear(); }
  }

  // ============================================================
  // §2  GEOMETRY & MATERIALS
  // ============================================================

  class Geometry {
    constructor(vertices = [], indices = [], normals = [], uvs = []) {
      this.vertices = vertices; // Vec3[]
      this.indices  = indices;  // number[] (triplets)
      this.normals  = normals;  // Vec3[]
      this.uvs      = uvs;      // Vec2[]
    }
  }

  class Material {
    constructor(color = '#ffffff', shininess = 32) {
      this.color = hexToRgb(color);
      this.shininess = shininess;
      this.wireframe = false;
      this.texture = null;
      this.normalMap = null;
      this.normalMapStrength = 0.5;
      this.opacity = 1.0;
      this.specular = 0.5;
    }
    setColor(hex) { this.color = hexToRgb(hex); }
    setNormalMap(tex) { this.normalMap = tex; }
  }

  // ============================================================
  // §3  GEOMETRY GENERATORS
  // ============================================================

  function genBox(w, h, d) {
    const x = w/2, y = h/2, z = d/2;
    const v = [
      new Vec3(-x,-y, z), new Vec3( x,-y, z), new Vec3( x, y, z), new Vec3(-x, y, z),
      new Vec3(-x,-y,-z), new Vec3( x,-y,-z), new Vec3( x, y,-z), new Vec3(-x, y,-z)
    ];
    const indices = [
      0,1,2, 0,2,3, 1,5,6, 1,6,2, 5,4,7, 5,7,6,
      4,0,3, 4,3,7, 3,2,6, 3,6,7, 4,5,1, 4,1,0
    ];
    const normals = [];
    for (let i=0; i<8; i++) normals.push(v[i].normalize());
    const uvs = [
      new Vec2(0,0), new Vec2(1,0), new Vec2(1,1), new Vec2(0,1),
      new Vec2(0,0), new Vec2(1,0), new Vec2(1,1), new Vec2(0,1)
    ];
    return new Geometry(v, indices, normals, uvs);
  }

  function genSphere(r, segs) {
    const v = [], ind = [], norm = [], uvs = [];
    for (let lat=0; lat<=segs; lat++) {
      const theta = lat * Math.PI / segs;
      const sinTheta = Math.sin(theta), cosTheta = Math.cos(theta);
      for (let lon=0; lon<=segs; lon++) {
        const phi = lon * 2 * Math.PI / segs;
        const x = r * Math.cos(phi) * sinTheta;
        const y = r * cosTheta;
        const z = r * Math.sin(phi) * sinTheta;
        v.push(new Vec3(x, y, z));
        norm.push(new Vec3(x, y, z).normalize());
        uvs.push(new Vec2(lon/segs, lat/segs));
      }
    }
    for (let lat=0; lat<segs; lat++) {
      for (let lon=0; lon<segs; lon++) {
        const first = (lat * (segs + 1)) + lon;
        const second = first + segs + 1;
        ind.push(first, second, first + 1);
        ind.push(second, second + 1, first + 1);
      }
    }
    return new Geometry(v, ind, norm, uvs);
  }

  function genPlane(w, d) {
    const x = w/2, z = d/2;
    const v = [new Vec3(-x,0,z), new Vec3(x,0,z), new Vec3(x,0,-z), new Vec3(-x,0,-z)];
    const ind = [0,1,2, 0,2,3];
    const norm = [new Vec3(0,1,0), new Vec3(0,1,0), new Vec3(0,1,0), new Vec3(0,1,0)];
    const uvs = [new Vec2(0,0), new Vec2(1,0), new Vec2(1,1), new Vec2(0,1)];
    return new Geometry(v, ind, norm, uvs);
  }

  function genCylinder(r, h, segs) {
    const v = [], ind = [], norm = [], uvs = [];
    const hh = h/2;
    for (let i=0; i<=segs; i++) {
      const a = i * 2 * Math.PI / segs;
      const x = r * Math.cos(a), z = r * Math.sin(a);
      v.push(new Vec3(x, hh, z), new Vec3(x, -hh, z));
      norm.push(new Vec3(x, 0, z).normalize(), new Vec3(x, 0, z).normalize());
      uvs.push(new Vec2(i/segs, 0), new Vec2(i/segs, 1));
    }
    for (let i=0; i<segs; i++) {
      const b = i*2;
      ind.push(b, b+1, b+2, b+1, b+3, b+2);
    }
    return new Geometry(v, ind, norm, uvs);
  }

  function genTerrain(w, d, hs, res, nf) {
    const v = [], ind = [], norm = [], uvs = [];
    const stepX = w / res;
    const stepZ = d / res;
    const startX = -w/2;
    const startZ = -d/2;

    for (let i=0; i<=res; i++) {
      for (let j=0; j<=res; j++) {
        const x = startX + i * stepX;
        const z = startZ + j * stepZ;
        const y = perlinNoise(x * nf, 0, z * nf) * hs;
        v.push(new Vec3(x, y, z));
        uvs.push(new Vec2(i/res, j/res));
      }
    }

    for (let i=0; i<res; i++) {
      for (let j=0; j<res; j++) {
        const r1 = i * (res + 1) + j;
        const r2 = (i + 1) * (res + 1) + j;
        ind.push(r1, r2, r1 + 1);
        ind.push(r2, r2 + 1, r1 + 1);
      }
    }

    for (let i=0; i<v.length; i++) norm.push(new Vec3(0,1,0));
    return new Geometry(v, ind, norm, uvs);
  }

  // ============================================================
  // §4  LIGHTS
  // ============================================================

  class Light {
    constructor(name, color, intensity) {
      this.name = name;
      this.color = hexToRgb(color);
      this.intensity = intensity;
      this.on = true;
    }
  }

  class PointLight extends Light {
    constructor(name, pos, col, i, range) {
      super(name, col, i);
      this.position = pos;
      this.range = range;
    }
  }

  class DirectionalLight extends Light {
    constructor(name, dir, col, i) {
      super(name, col, i);
      this.direction = dir.normalize();
    }
  }

  // ============================================================
  // §5  SCENE & RENDER PIPELINE
  // ============================================================

  class Camera {
    constructor() {
      this.position = new Vec3(0, 1, 5);
      this.yaw = 0; this.pitch = 0; this.roll = 0;
      this.fov = 60;
      this.near = 0.1;
      this.far = 500;
      this.frustumPlanes = [];
    }

    forward() {
      const y = this.yaw * DEG, p = this.pitch * DEG;
      return new Vec3(Math.sin(y)*Math.cos(p), -Math.sin(p), -Math.cos(y)*Math.cos(p)).normalize();
    }
    right() { return this.forward().cross(new Vec3(0,1,0)).normalize(); }
    up()    { return this.right().cross(this.forward()).normalize(); }

    moveForward(d) { this.position = this.position.add(this.forward().mul(d)); }
    moveRight(d)   { this.position = this.position.add(this.right().mul(d)); }
    moveUp(d)      { this.position = this.position.add(this.up().mul(d)); }

    getFrustumPlanes(aspect) {
      const fovRad = this.fov * DEG;
      const h = Math.tan(fovRad * 0.5);
      const w = h * aspect;
      const f = this.forward();
      const r = this.right();
      const u = this.up();

      return [
        new Plane(f, this.position.dot(f) + this.near), // Near
        new Plane(f.negate(), this.position.dot(f.negate()) - this.far), // Far
        new Plane(r.mul(1/w).add(f).cross(u), this.position.dot(r.mul(1/w).add(f).cross(u))), // Left
        new Plane(u.cross(r.mul(-1/w).add(f)), this.position.dot(u.cross(r.mul(-1/w).add(f)))), // Right
        new Plane(u.mul(1/h).add(f).cross(r.negate()), this.position.dot(u.mul(1/h).add(f).cross(r.negate()))), // Top
        new Plane(r.negate().cross(u.mul(-1/h).add(f)), this.position.dot(r.negate().cross(u.mul(-1/h).add(f)))) // Bottom
      ];
    }
  }

  class SceneObject {
    constructor(name, geo, mat) {
      this.name = name;
      this.geometry = geo;
      this.material = mat;
      this.position = new Vec3(0,0,0);
      this.rotation = new Vec3(0,0,0);
      this.scale    = new Vec3(1,1,1);
      this.visible  = true;
      this.castShadow = true;
      this.receiveShadow = true;
      this.mass = 1;
      this.velocity = new Vec3(0,0,0);
      this.isStatic = false;
      this.useGravity = true;
      this.rootBone = null;
      this.bones = new Map();
      this._worldMatrix = Mat4.identity();
      this._dirty = true;
    }

    updateWorldMatrix() {
      if (!this._dirty) return this._worldMatrix;
      const T  = Mat4.translation(this.position.x, this.position.y, this.position.z);
      const Rx = Mat4.rotationX(this.rotation.x * DEG);
      const Ry = Mat4.rotationY(this.rotation.y * DEG);
      const Rz = Mat4.rotationZ(this.rotation.z * DEG);
      const S  = Mat4.scale(this.scale.x, this.scale.y, this.scale.z);
      this._worldMatrix = T.mul(Ry).mul(Rx).mul(Rz).mul(S);
      if (this.rootBone) {
        this._worldMatrix = this._worldMatrix.mul(this.rootBone.worldMatrix());
      }
      this._dirty = false;
      return this._worldMatrix;
    }
  }

  class PhysicsEngine {
    constructor() {
      this.gravity = new Vec3(0, -9.81, 0);
      this.enabled = false;
      this.lastTime = 0;
    }

    update(objects) {
      if (!this.enabled) return;
      const dt = 0.016; // 60fps fixed
      for (const obj of objects) {
        if (obj.isStatic) continue;
        if (obj.useGravity) obj.velocity = obj.velocity.add(this.gravity.mul(dt));
        obj.position = obj.position.add(obj.velocity.mul(dt));
        if (obj.position.y < 0) {
          obj.position.y = 0;
          obj.velocity.y *= -0.5;
        }
        obj._dirty = true;
      }
    }
  }

  class Particle {
    constructor(pos, vel, col, life, size) {
      this.pos = pos; this.vel = vel; this.col = col; this.life = life; this.maxLife = life; this.size = size;
    }
  }

  class ParticleSystem {
    constructor() { this.particles = []; this.emitters = []; }
    addEmitter(name, pos, rate, life, speed, col, size) {
      this.emitters.push({ name, position: pos, rate, life, speed, color: col, size, lastEmit: 0 });
    }
    update(dt) {
      for (const em of this.emitters) {
        em.lastEmit += dt;
        const interval = 1 / em.rate;
        while (em.lastEmit >= interval) {
          const vel = new Vec3(Math.random()-0.5, 1, Math.random()-0.5).normalize().mul(em.speed);
          this.particles.push(new Particle(em.position.clone(), vel, em.color, em.life, em.size));
          em.lastEmit -= interval;
        }
      }
      for (let i = this.particles.length - 1; i >= 0; i--) {
        const p = this.particles[i];
        p.life -= dt;
        if (p.life <= 0) { this.particles.splice(i, 1); continue; }
        p.pos = p.pos.add(p.vel.mul(dt));
      }
    }
    render(renderer, camera, W, H) {
      for (const p of this.particles) {
        const pt = renderer.project(p.pos, W, H);
        if (!pt) continue;
        const size = (p.size * H) / pt.w;
        renderer.drawCircle(pt.x, pt.y, size, p.col, p.life / p.maxLife);
      }
    }
  }

  class Renderer {
    constructor() {
      this.quality = 2; // pixel size
      this.pixels = null;
      this.zBuffer = null;
      this.ambient = { r: 0.2, g: 0.2, b: 0.2 };
      this.shadowEnabled = true;
      this.shadowStrength = 0.5;
      this.shadowSoftness = 2;
      this.envLightEnabled = true;
      this.envSkyColor = { r: 150, g: 180, b: 255 };
      this.envGroundColor = { r: 80, g: 60, b: 40 };
      this.skyTop = { r: 30, g: 60, b: 114 };
      this.skyBottom = { r: 120, g: 180, b: 222 };
      this.fogEnabled = false;
      this.fogColor = { r: 200, g: 200, b: 200 };
      this.fogNear = 10;
      this.fogFar = 50;
      this.fogExp = false;
      this.viewMat = null;
      this.projMat = null;
    }

    init(w, h) {
      const rw = Math.ceil(w / this.quality), rh = Math.ceil(h / this.quality);
      this.pixels = new Uint8ClampedArray(rw * rh * 4);
      this.zBuffer = new Float64Array(rw * rh);
    }

    drawCircle(x, y, r, col, alpha) {
      // simplified particle draw
    }

    project(v, W, H) {
      const v4 = this.projMat.mulVec4(this.viewMat.mulVec4(new Vec4(v.x, v.y, v.z, 1)));
      if (v4.w <= 0) return null;
      return { x: (v4.x/v4.w * 0.5 + 0.5) * W, y: (1 - (v4.y/v4.w * 0.5 + 0.5)) * H, w: v4.w };
    }

    drawTriangle(p0, p1, p2, n0, n1, n2, v0, v1, v2, uv0, uv1, uv2, mat, lights, camPos) {
      const rw = Math.ceil(this.width / this.quality), rh = Math.ceil(this.height / this.quality);
      const minX = Math.max(0, Math.floor(Math.min(p0.x, p1.x, p2.x) / this.quality));
      const maxX = Math.min(rw - 1, Math.ceil(Math.max(p0.x, p1.x, p2.x) / this.quality));
      const minY = Math.max(0, Math.floor(Math.min(p0.y, p1.y, p2.y) / this.quality));
      const maxY = Math.min(rh - 1, Math.ceil(Math.max(p0.y, p1.y, p2.y) / this.quality));

      const area = (p1.x - p0.x) * (p2.y - p0.y) - (p1.y - p0.y) * (p2.x - p0.x);
      if (Math.abs(area) < 1e-6) return;
      const invArea = 1.0 / area;

      for (let y = minY; y <= maxY; y++) {
        for (let x = minX; x <= maxX; x++) {
          const px = x * this.quality, py = y * this.quality;
          const w0 = ((p1.x - px) * (p2.y - py) - (p1.y - py) * (p2.x - px)) * invArea;
          const w1 = ((p2.x - px) * (p0.y - py) - (p2.y - py) * (p0.x - px)) * invArea;
          const w2 = 1.0 - w0 - w1;

          if (w0 >= 0 && w1 >= 0 && w2 >= 0) {
            const z = w0 * p0.z + w1 * p1.z + w2 * p2.z;
            const idx = y * rw + x;
            if (z < this.zBuffer[idx]) {
              this.zBuffer[idx] = z;
              const pos = v0.mul(w0).add(v1.mul(w1)).add(v2.mul(w2));
              let norm = n0.mul(w0).add(n1.mul(w1)).add(n2.mul(w2)).normalize();

              if (mat.normalMap && uv0) {
                const uv = uv0.mul(w0).add(uv1.mul(w1)).add(uv2.mul(w2));
                const nSample = mat.normalMap.sample(uv.x, 1 - uv.y);
                const perturb = new Vec3(
                  (nSample.r / 255 * 2 - 1) * mat.normalMapStrength,
                  (nSample.g / 255 * 2 - 1) * mat.normalMapStrength,
                  (nSample.b / 255 * 2 - 1)
                ).normalize();
                norm = norm.add(perturb).normalize();
              }

              let r = mat.color.r * this.ambient.r;
              let g = mat.color.g * this.ambient.g;
              let b = mat.color.b * this.ambient.b;

              if (this.envLightEnabled) {
                const up = norm.y * 0.5 + 0.5;
                r += mat.color.r * lerp(up, this.envGroundColor.r/255, this.envSkyColor.r/255);
                g += mat.color.g * lerp(up, this.envGroundColor.g/255, this.envSkyColor.g/255);
                b += mat.color.b * lerp(up, this.envGroundColor.b/255, this.envSkyColor.b/255);
              }

              const viewDir = camPos.sub(pos).normalize();
              for (const l of lights) {
                if (!l.on) continue;
                let lDir, atten = l.intensity;
                if (l instanceof PointLight) {
                  const diff = l.position.sub(pos);
                  const dist = diff.length();
                  if (dist > l.range) continue;
                  lDir = diff.div(dist);
                  atten *= (1.0 - dist / l.range);
                } else {
                  lDir = l.direction.negate();
                }

                const diff = Math.max(0, norm.dot(lDir));
                r += l.color.r * diff * atten;
                g += l.color.g * diff * atten;
                b += l.color.b * diff * atten;

                if (diff > 0) {
                  const reflect = lDir.negate().sub(norm.mul(lDir.negate().dot(norm) * 2)).normalize();
                  const spec = Math.pow(Math.max(0, viewDir.dot(reflect)), mat.shininess);
                  r += l.color.r * spec * mat.specular * atten;
                  g += l.color.g * spec * mat.specular * atten;
                  b += l.color.b * spec * mat.specular * atten;
                }
              }

              if (this.fogEnabled) {
                const dist = camPos.sub(pos).length();
                let f = this.fogExp 
                  ? Math.exp(-0.05 * dist) 
                  : clamp((this.fogFar - dist) / (this.fogFar - this.fogNear), 0, 1);
                r = lerp(1-f, r, this.fogColor.r);
                g = lerp(1-f, g, this.fogColor.g);
                b = lerp(1-f, b, this.fogColor.b);
              }

              const pIdx = idx * 4;
              this.pixels[pIdx] = r; this.pixels[pIdx+1] = g; this.pixels[pIdx+2] = b; this.pixels[pIdx+3] = 255;
            }
          }
        }
      }
    }
  }

  class Scene {
    constructor() {
      this.camera = new Camera();
      this.objects = [];
      this.lights = [];
      this.renderer = new Renderer();
      this.textureManager = new TextureManager();
      this.physicsEngine = new PhysicsEngine();
      this.particleSystem = new ParticleSystem();
      this.lastHitName = '';
      this.lastProjected = { x: 0, y: 0 };
    }

    addObject(name, type, size, col, shin) {
      let geo;
      if (type === 'box') geo = genBox(size[0], size[1], size[2]);
      else if (type === 'sphere') geo = genSphere(size[0], 16);
      else if (type === 'plane') geo = genPlane(size[0], size[2]);
      else if (type === 'cylinder') geo = genCylinder(size[0], size[1], 16);
      else geo = genBox(1,1,1);
      this.objects.push(new SceneObject(name, geo, new Material(col, shin)));
    }

    findObject(name) { return this.objects.find(o => o.name === name); }
    removeObject(name) { this.objects = this.objects.filter(o => o.name !== name); }

    render(canvas) {
      const W = canvas.width, H = canvas.height;
      this.renderer.width = W; this.renderer.height = H;
      this.renderer.init(W, H);
      const rW = Math.ceil(W / this.renderer.quality), rH = Math.ceil(H / this.renderer.quality);

      // Sky
      for (let y=0; y<rH; y++) {
        const t = y / (rH - 1);
        const r = lerp(t, this.renderer.skyTop.r, this.renderer.skyBottom.r);
        const g = lerp(t, this.renderer.skyTop.g, this.renderer.skyBottom.g);
        const b = lerp(t, this.renderer.skyTop.b, this.renderer.skyBottom.b);
        for (let x=0; x<rW; x++) {
          const idx = (y * rW + x) * 4;
          this.renderer.pixels[idx]=r; this.renderer.pixels[idx+1]=g; this.renderer.pixels[idx+2]=b; this.renderer.pixels[idx+3]=255;
          this.renderer.zBuffer[y * rW + x] = 1e10;
        }
      }

      this.renderer.viewMat = Mat4.lookAt(this.camera.position, this.camera.position.add(this.camera.forward()), this.camera.up());
      this.renderer.projMat = Mat4.perspective(this.camera.fov * DEG, W/H, this.camera.near, this.camera.far);
      const frustumPlanes = this.camera.getFrustumPlanes(W/H);

      for (const obj of this.objects) {
        if (!obj.visible) continue;
        
        // Simple sphere culling
        let inFrustum = true;
        for (const plane of frustumPlanes) {
          if (plane.distanceToPoint(obj.position) < -5) { // 5 is rough radius
            inFrustum = false; break;
          }
        }
        if (!inFrustum) continue;

        const worldMat = obj.updateWorldMatrix();
        const normMat  = worldMat.inverse().transpose();
        const geo = obj.geometry;
        const wv = geo.vertices.map(v => worldMat.mulVec3(v));
        const wn = geo.normals.map(n => normMat.mulDir(n).normalize());
        const sp = wv.map(v => this.renderer.project(v, W, H));

        for (let i=0; i<geo.indices.length; i+=3) {
          const i0 = geo.indices[i], i1 = geo.indices[i+1], i2 = geo.indices[i+2];
          const sp0 = sp[i0], sp1 = sp[i1], sp2 = sp[i2];
          if (!sp0 || !sp1 || !sp2) continue;

          if (obj.material.wireframe) {
            // wireframe logic
          } else {
            const ex = sp1.x-sp0.x, ey = sp1.y-sp0.y;
            const fx = sp2.x-sp0.x, fy = sp2.y-sp0.y;
            if (ex*fy - ey*fx > 0) continue;

            this.renderer.drawTriangle(
              sp0, sp1, sp2,
              wn[i0], wn[i1], wn[i2],
              wv[i0], wv[i1], wv[i2],
              geo.uvs ? geo.uvs[i0] : null, geo.uvs ? geo.uvs[i1] : null, geo.uvs ? geo.uvs[i2] : null,
              obj.material, this.lights, this.camera.position
            );
          }
        }
      }

      const ctx = canvas.getContext('2d');
      const imgData = new ImageData(this.renderer.pixels, rW, rH);
      if (this.renderer.quality === 1) {
        ctx.putImageData(imgData, 0, 0);
      } else {
        const tmpCanvas = document.createElement('canvas');
        tmpCanvas.width = rW; tmpCanvas.height = rH;
        tmpCanvas.getContext('2d').putImageData(imgData, 0, 0);
        ctx.imageSmoothingEnabled = false;
        ctx.drawImage(tmpCanvas, 0, 0, W, H);
      }
    }
  }

  class OverlayManager {
    constructor() {
      this.canvas = null;
      this.scene = new Scene();
      this._loop = null;
      this._running = false;
    }
    _createCanvas() {
      if (this.canvas) return;
      const stage = document.querySelector('canvas') || document.body;
      const c = document.createElement('canvas');
      c.id = '__3dcamera_overlay';
      c.style.cssText = 'position:absolute;top:0;left:0;pointer-events:none;z-index:9999;width:100%;height:100%';
      (stage.parentElement || document.body).appendChild(c);
      this.canvas = c;
      this._resize();
      window.addEventListener('resize', () => this._resize());
    }
    _resize() {
      if (!this.canvas) return;
      const p = this.canvas.parentElement;
      this.canvas.width = p ? p.clientWidth : window.innerWidth;
      this.canvas.height = p ? p.clientHeight : window.innerHeight;
    }
    startRender() {
      this._createCanvas();
      if (this._running) return;
      this._running = true;
      this.scene.physicsEngine.lastTime = performance.now();
      const loop = () => {
        if (!this._running) return;
        const now = performance.now();
        const dt = Math.min((now - this.scene.physicsEngine.lastTime) / 1000, 0.1);
        this.scene.physicsEngine.lastTime = now;
        this.scene.physicsEngine.update(this.scene.objects);
        this.scene.particleSystem.update(dt);
        this.scene.render(this.canvas);
        this.scene.particleSystem.render(this.scene.renderer, this.scene.camera, this.canvas.width, this.canvas.height);
        this._loop = requestAnimationFrame(loop);
      };
      loop();
    }
    stopRender() {
      this._running = false;
      if (this._loop) cancelAnimationFrame(this._loop);
    }
  }

  const overlay = new OverlayManager();

  class Ext3DCamera {
    constructor(runtime) {
      this.runtime = runtime;
      overlay.startRender();
    }
    getInfo() {
      return {
        id: 'threedcamera',
        name: '3D Camera',
        color1: '#1a73e8',
        color2: '#1558b0',
        color3: '#0d3f80',
        blocks: [
          { opcode: 'startRender', blockType: Scratch.BlockType.COMMAND, text: 'start 3D render' },
          { opcode: 'stopRender', blockType: Scratch.BlockType.COMMAND, text: 'stop 3D render' },
          { opcode: 'clearScene', blockType: Scratch.BlockType.COMMAND, text: 'clear all objects' },
          '---',
          { opcode: 'setCameraPosition', blockType: Scratch.BlockType.COMMAND, text: 'set camera x [X] y [Y] z [Z]', arguments: { X:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:1}, Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:5} } },
          { opcode: 'setCameraRotation', blockType: Scratch.BlockType.COMMAND, text: 'set camera yaw [YAW] pitch [PITCH] roll [ROLL]', arguments: { YAW:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, PITCH:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, ROLL:{type:Scratch.ArgumentType.NUMBER,defaultValue:0} } },
          '---',
          { opcode: 'setPhysicsEnabled', blockType: Scratch.BlockType.COMMAND, text: 'set physics [BOOL]', arguments: { BOOL:{type:Scratch.ArgumentType.STRING,defaultValue:'on',menu:'onOff'} } },
          { opcode: 'setGravity', blockType: Scratch.BlockType.COMMAND, text: 'set gravity x [X] y [Y] z [Z]', arguments: { X:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:-9.81}, Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:0} } },
          '---',
          { opcode: 'addObject', blockType: Scratch.BlockType.COMMAND, text: 'add [TYPE] named [NAME] color [COLOR]', arguments: { TYPE:{type:Scratch.ArgumentType.STRING,defaultValue:'box',menu:'objectTypes'}, NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'cube1'}, COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:'#ff8800'} } },
          { opcode: 'addTerrain', blockType: Scratch.BlockType.COMMAND, text: 'add terrain named [NAME] w [W] d [D] h [HS] res [RES] freq [NF] color [COLOR]', arguments: { NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'terrain1'}, W:{type:Scratch.ArgumentType.NUMBER,defaultValue:50}, D:{type:Scratch.ArgumentType.NUMBER,defaultValue:50}, HS:{type:Scratch.ArgumentType.NUMBER,defaultValue:5}, RES:{type:Scratch.ArgumentType.NUMBER,defaultValue:30}, NF:{type:Scratch.ArgumentType.NUMBER,defaultValue:0.05}, COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:'#4CAF50'} } },
          { opcode: 'setPosition', blockType: Scratch.BlockType.COMMAND, text: 'set [NAME] pos x [X] y [Y] z [Z]', arguments: { NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'cube1'}, X:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:0} } },
          '---',
          { opcode: 'addParticleEmitter', blockType: Scratch.BlockType.COMMAND, text: 'add emitter [NAME] at x [X] y [Y] z [Z] rate [RATE] life [LIFE] speed [SPEED] color [COLOR] size [SIZE]', arguments: { NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'emitter1'}, X:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, RATE:{type:Scratch.ArgumentType.NUMBER,defaultValue:10}, LIFE:{type:Scratch.ArgumentType.NUMBER,defaultValue:2}, SPEED:{type:Scratch.ArgumentType.NUMBER,defaultValue:1}, COLOR:{type:Scratch.ArgumentType.COLOR,defaultValue:'#ffffff'}, SIZE:{type:Scratch.ArgumentType.NUMBER,defaultValue:0.1} } },
          '---',
          { opcode: 'addRootBone', blockType: Scratch.BlockType.COMMAND, text: 'add root bone [NAME] to [OBJ_NAME] at x [X] y [Y] z [Z]', arguments: { NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'root'}, OBJ_NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'cube1'}, X:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, Y:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, Z:{type:Scratch.ArgumentType.NUMBER,defaultValue:0} } },
          { opcode: 'setBoneRotation', blockType: Scratch.BlockType.COMMAND, text: 'set bone [NAME] on [OBJ_NAME] rot x [RX] y [RY] z [RZ]', arguments: { NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'root'}, OBJ_NAME:{type:Scratch.ArgumentType.STRING,defaultValue:'cube1'}, RX:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, RY:{type:Scratch.ArgumentType.NUMBER,defaultValue:0}, RZ:{type:Scratch.ArgumentType.NUMBER,defaultValue:0} } },
          '---',
          { opcode: 'setObjectNormalMap', blockType: Scratch.BlockType.COMMAND, text: 'set [OBJ] normal map [TEX]', arguments: { OBJ:{type:Scratch.ArgumentType.STRING,defaultValue:'cube1'}, TEX:{type:Scratch.ArgumentType.STRING,defaultValue:'tex1'} } },
          { opcode: 'setRenderQuality', blockType: Scratch.BlockType.COMMAND, text: 'set quality [Q]', arguments: { Q:{type:Scratch.ArgumentType.STRING,defaultValue:'2',menu:'qualities'} } }
        ],
        menus: {
          objectTypes: { acceptReporters: true, items: ['box', 'sphere', 'plane', 'cylinder'] },
          onOff: { acceptReporters: false, items: ['on', 'off'] },
          qualities: { acceptReporters: false, items: [{text:'high',value:'1'}, {text:'medium',value:'2'}, {text:'low',value:'4'}] }
        }
      };
    }

    startRender() { overlay.startRender(); }
    stopRender() { overlay.stopRender(); }
    clearScene() { overlay.scene.objects = []; overlay.scene.lights = []; }
    setCameraPosition({X,Y,Z}) { overlay.scene.camera.position = new Vec3(+X,+Y,+Z); }
    setCameraRotation({YAW,PITCH,ROLL}) { overlay.scene.camera.yaw=+YAW; overlay.scene.camera.pitch=+PITCH; overlay.scene.camera.roll=+ROLL; }
    setPhysicsEnabled({BOOL}) { overlay.scene.physicsEngine.enabled = (BOOL === 'on'); }
    setGravity({X,Y,Z}) { overlay.scene.physicsEngine.gravity = new Vec3(+X,+Y,+Z); }
    addObject({TYPE,NAME,COLOR}) { overlay.scene.addObject(NAME, TYPE, [1,1,1], COLOR, 32); }
    addTerrain({NAME,W,D,HS,RES,NF,COLOR}) {
      const geo = genTerrain(+W,+D,+HS,+RES,+NF);
      overlay.scene.objects.push(new SceneObject(NAME, geo, new Material(COLOR, 32)));
    }
    setPosition({NAME,X,Y,Z}) { const o = overlay.scene.findObject(NAME); if(o) o.position = new Vec3(+X,+Y,+Z); }
    addParticleEmitter({NAME,X,Y,Z,RATE,LIFE,SPEED,COLOR,SIZE}) { overlay.scene.particleSystem.addEmitter(NAME, new Vec3(+X,+Y,+Z), +RATE, +LIFE, +SPEED, COLOR, +SIZE); }
    addRootBone({NAME,OBJ_NAME,X,Y,Z}) {
      const obj = overlay.scene.findObject(OBJ_NAME);
      if(obj) { const b = new Bone(NAME); b.setPosition(+X,+Y,+Z); obj.rootBone = b; obj.bones.set(NAME, b); }
    }
    setBoneRotation({NAME,OBJ_NAME,RX,RY,RZ}) {
      const obj = overlay.scene.findObject(OBJ_NAME);
      if(obj) { const b = obj.bones.get(NAME); if(b) b.setRotation(+RX,+RY,+RZ); }
    }
    setObjectNormalMap({OBJ,TEX}) {
      const o = overlay.scene.findObject(OBJ);
      const t = overlay.scene.textureManager.get(TEX);
      if(o && t) o.material.setNormalMap(t);
    }
    setRenderQuality({Q}) { overlay.scene.renderer.quality = parseInt(Q); }
  }

  Scratch.extensions.register(new Ext3DCamera());
})(Scratch);
