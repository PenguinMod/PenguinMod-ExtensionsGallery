(function(Scratch) {
    'use strict';

    const VERT_SRC = `#version 300 es
precision highp float;
in  vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv        = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

    const FRAG_SRC = `#version 300 es
precision highp float;

#define POINT  0
#define SPOT   1
#define AREA   2

in  vec2 v_uv;
out vec4 o_color;

uniform vec2      u_res;
uniform vec3      u_ambient;
uniform float     u_opacity;
uniform int       u_nLights;
uniform float     u_bloomAmount;
uniform float     u_bloomRadius;
uniform float     u_bloomThreshold;
uniform float     u_contrast;
uniform float     u_colorTemp;
uniform sampler2D u_lightTex;

vec4 lt_postype(int i) { return texelFetch(u_lightTex, ivec2(0, i), 0); }
vec4 lt_col    (int i) { return texelFetch(u_lightTex, ivec2(1, i), 0); }
vec4 lt_dim    (int i) { return texelFetch(u_lightTex, ivec2(2, i), 0); }

float smoothstep3(float e0, float e1, float x) {
  float t = clamp((x - e0) / max(e1 - e0, 1e-5), 0.0, 1.0);
  return t * t * (3.0 - 2.0 * t);
}

float pointFalloff(float t) {
  if (t < 0.10) return mix(0.95, 0.80, t / 0.10);
  if (t < 0.25) return mix(0.80, 0.50, (t - 0.10) / 0.15);
  if (t < 0.45) return mix(0.50, 0.25, (t - 0.25) / 0.20);
  if (t < 0.65) return mix(0.25, 0.10, (t - 0.45) / 0.20);
  if (t < 0.85) return mix(0.10, 0.03, (t - 0.65) / 0.20);
               return mix(0.03, 0.00, (t - 0.85) / 0.15);
}

vec3 pointRealistic(vec2 p, int i) {
  vec4 pt = lt_postype(i);
  float d = length(p - pt.xy);
  float R = pt.w;
  if (d >= R) return vec3(0.0);

  vec3  rgb    = lt_col(i).xyz;
  float outer  = pointFalloff(d / R);
  float bT     = clamp(d / (R * u_bloomRadius), 0.0, 1.0);
  float rawA   = (bT < 0.4) ? mix(0.90, 0.40, bT / 0.4) : mix(0.40, 0.00, (bT - 0.4) / 0.6);
  float bloomA = max(rawA - u_bloomThreshold, 0.0) * u_bloomAmount;

  return rgb * outer + mix(rgb, vec3(1.0), 0.5) * bloomA;
}

vec3 spotRealistic(vec2 p, int i) {
  vec4 pt   = lt_postype(i);
  vec4 col  = lt_col(i);
  vec4 dim  = lt_dim(i);
  vec2  toP = p - pt.xy;
  float d   = length(toP);
  float R   = pt.w;
  if (d >= R) return vec3(0.0);

  float arc    = dim.w;
  float soft   = max(col.w, 0.10);
  float delta  = abs(mod(atan(toP.y, toP.x) - dim.z + 3.14159265, 6.28318530) - 3.14159265);
  float softPx = max(soft * d, 1.5);

  if (delta > arc + softPx / max(d, 0.001)) return vec3(0.0);

  float edgePx = d * sin(delta - arc);

  if (edgePx > softPx) return vec3(0.0);

  float angFactor = 1.0 - smoothstep(-softPx * 0.15, softPx, edgePx);
  float axisBoost = 1.0 + 0.18 * clamp(1.0 - delta / max(arc, 0.001), 0.0, 1.0);

  float t = d / R, radial;
  if      (t < 0.08) radial = mix(1.00, 0.92, t / 0.08);
  else if (t < 0.22) radial = mix(0.92, 0.68, (t - 0.08) / 0.14);
  else if (t < 0.45) radial = mix(0.68, 0.38, (t - 0.22) / 0.23);
  else if (t < 0.70) radial = mix(0.38, 0.14, (t - 0.45) / 0.25);
  else if (t < 0.88) radial = mix(0.14, 0.04, (t - 0.70) / 0.18);
  else               radial = mix(0.04, 0.00, (t - 0.88) / 0.12);

  vec3  rgb   = col.xyz;
  float nearT = clamp(d / (R * 0.14), 0.0, 1.0);
  float hazeT = smoothstep3(arc * 0.72, arc, delta);
  float hazeA = hazeT * (1.0 - smoothstep(arc, arc + soft, delta)) * radial * 0.20;

  return rgb * (radial * angFactor * axisBoost)
       + mix(rgb, vec3(1.0), 0.55) * ((1.0 - nearT * nearT) * angFactor * 0.40)
       + rgb * hazeA;
}

float areaFalloff(float t) {
  if (t < 0.25) return mix(0.95, 0.55, t / 0.25);
  if (t < 0.55) return mix(0.55, 0.20, (t - 0.25) / 0.30);
  if (t < 0.80) return mix(0.20, 0.05, (t - 0.55) / 0.25);
               return mix(0.05, 0.00, (t - 0.80) / 0.20);
}

vec3 areaRealistic(vec2 p, int i) {
  vec4 pt   = lt_postype(i);
  vec4 col  = lt_col(i);
  vec4 dim  = lt_dim(i);
  vec2  hd  = abs(p - pt.xy) - vec2(dim.x * 0.5, dim.y * 0.5);
  float sdf = length(max(hd, 0.0)) + min(max(hd.x, hd.y), 0.0);
  float soft = col.w;
  float a    = (sdf <= 0.0) ? 0.95 : (sdf >= soft) ? 0.0 : areaFalloff(sdf / soft);
  vec3  rgb  = col.xyz;
  float bA   = clamp(1.0 - length(p - pt.xy) / max(max(dim.x, dim.y) * 1.8, 1.0), 0.0, 1.0) * 0.12;

  return rgb * a + mix(rgb, vec3(1.0), 0.3) * bA;
}

void main() {
  vec2 pos = vec2(v_uv.x, 1.0 - v_uv.y) * u_res;
  vec4 acc = vec4(u_ambient * u_opacity, u_opacity);

  for (int i = 0; i < u_nLights; i++) {
    int  lt = int(lt_postype(i).z);
    vec3 lc = (lt == POINT) ? pointRealistic(pos, i)
            : (lt == SPOT)  ? spotRealistic(pos, i)
                            : areaRealistic(pos, i);
    acc.rgb += lc;
    acc.a   += dot(lc, vec3(0.299, 0.587, 0.114)) * (1.0 - u_opacity);
  }

  o_color = clamp(acc, 0.0, 1.0);

  o_color.rgb = clamp((o_color.rgb - 0.5) * u_contrast + 0.5, 0.0, 1.0);

  float t = u_colorTemp;
  o_color.r = clamp(o_color.r + t * 0.15, 0.0, 1.0);
  o_color.g = clamp(o_color.g + t * 0.05, 0.0, 1.0);
  o_color.b = clamp(o_color.b - t * 0.18, 0.0, 1.0);
}`;

    const WORKER_SRC = `
'use strict';

const VERT_SRC   = ${JSON.stringify(VERT_SRC)};
const FRAG_SRC   = ${JSON.stringify(FRAG_SRC)};

let gl, prog, vao, u, lightTex, oc;

function compile(type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
  return s;
}

function init(w, h) {
  oc = new OffscreenCanvas(w, h);
  gl = oc.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });
  if (!gl) throw new Error('webgl2 unavailable in worker');

  prog = gl.createProgram();
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SRC));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG_SRC));
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

  vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const loc = gl.getAttribLocation(prog, 'a_pos');
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  lightTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, lightTex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

  u = {
    res:            gl.getUniformLocation(prog, 'u_res'),
    ambient:        gl.getUniformLocation(prog, 'u_ambient'),
    opacity:        gl.getUniformLocation(prog, 'u_opacity'),
    nLights:        gl.getUniformLocation(prog, 'u_nLights'),
    bloomAmount:    gl.getUniformLocation(prog, 'u_bloomAmount'),
    bloomRadius:    gl.getUniformLocation(prog, 'u_bloomRadius'),
    bloomThreshold: gl.getUniformLocation(prog, 'u_bloomThreshold'),
    contrast:       gl.getUniformLocation(prog, 'u_contrast'),
    colorTemp:      gl.getUniformLocation(prog, 'u_colorTemp'),
    lightTex:       gl.getUniformLocation(prog, 'u_lightTex'),
  };

  gl.enable(gl.BLEND);
  gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
}

function render(d) {
  if (oc.width !== d.pw || oc.height !== d.ph) {
    oc.width  = d.pw;
    oc.height = d.ph;

    gl = oc.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, stencil: false });

    prog = gl.createProgram();
    gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SRC));
    gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG_SRC));
    gl.linkProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);

    vao = gl.createVertexArray();
    gl.bindVertexArray(vao);
    const loc = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    lightTex = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, lightTex);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

    u = {
      res:            gl.getUniformLocation(prog, 'u_res'),
      ambient:        gl.getUniformLocation(prog, 'u_ambient'),
      opacity:        gl.getUniformLocation(prog, 'u_opacity'),
      nLights:        gl.getUniformLocation(prog, 'u_nLights'),
      bloomAmount:    gl.getUniformLocation(prog, 'u_bloomAmount'),
      bloomRadius:    gl.getUniformLocation(prog, 'u_bloomRadius'),
      bloomThreshold: gl.getUniformLocation(prog, 'u_bloomThreshold'),
      contrast:       gl.getUniformLocation(prog, 'u_contrast'),
      colorTemp:      gl.getUniformLocation(prog, 'u_colorTemp'),
      lightTex:       gl.getUniformLocation(prog, 'u_lightTex'),
    };

    gl.enable(gl.BLEND);
    gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
  }

  gl.viewport(0, 0, d.pw, d.ph);
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (d.visible) {
    gl.useProgram(prog);
    gl.uniform2f(u.res,              d.w, d.h);
    gl.uniform3f(u.ambient,          d.ambient[0], d.ambient[1], d.ambient[2]);
    gl.uniform1f(u.opacity,          d.opacity);
    gl.uniform1i(u.nLights,          d.n);
    gl.uniform1f(u.bloomAmount,      d.bloomAmount);
    gl.uniform1f(u.bloomRadius,      d.bloomRadius);
    gl.uniform1f(u.bloomThreshold,   d.bloomThreshold);
    gl.uniform1f(u.contrast,         d.contrast   ?? 1.0);
    gl.uniform1f(u.colorTemp,        d.colorTemp  ?? 0.0);

    if (d.n > 0) {
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, lightTex);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 3, d.n, 0, gl.RGBA, gl.FLOAT, d.lightBuf);
      gl.uniform1i(u.lightTex, 0);
    }

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }

  const bitmap = oc.transferToImageBitmap();
  self.postMessage({ type: 'frame', bitmap }, [bitmap]);
}

self.onmessage = ({ data: msg }) => {
  if (msg.type === 'init') {
    try {
      init(msg.w, msg.h);
      self.postMessage({ type: 'ready' });
    } catch (e) {
      self.postMessage({ type: 'error', message: e.message });
    }
  } else if (msg.type === 'render') {
    render(msg);
  }
};
`;

    function buildGLState(gl) {
        const compile = (type, src) => {
            const s = gl.createShader(type);
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s));
            return s;
        };

        const prog = gl.createProgram();
        gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERT_SRC));
        gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAG_SRC));
        gl.linkProgram(prog);
        if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) throw new Error(gl.getProgramInfoLog(prog));

        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]), gl.STATIC_DRAW);

        const vao = gl.createVertexArray();
        gl.bindVertexArray(vao);

        const loc = gl.getAttribLocation(prog, 'a_pos');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const lightTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, lightTex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

        const uf = name => gl.getUniformLocation(prog, name);
        const u = {
            res: uf('u_res'),
            ambient: uf('u_ambient'),
            opacity: uf('u_opacity'),
            nLights: uf('u_nLights'),
            bloomAmount: uf('u_bloomAmount'),
            bloomRadius: uf('u_bloomRadius'),
            bloomThreshold: uf('u_bloomThreshold'),
            contrast: uf('u_contrast'),
            colorTemp: uf('u_colorTemp'),
            lightTex: uf('u_lightTex'),
        };

        gl.enable(gl.BLEND);
        gl.blendFuncSeparate(gl.ONE, gl.ONE_MINUS_SRC_ALPHA, gl.ONE, gl.ONE_MINUS_SRC_ALPHA);

        return {
            prog,
            vao,
            u,
            lightTex
        };
    }

    const isPenguinMod = Scratch.extensions.isPenguinMod === true;
    const isTurboWarp = !isPenguinMod;

    const RENDER_DEFAULTS = {
        shadowOpacity: 0.85,
        bgOpacity: 1.0,
        ambient: '#333333',
        bloomAmount: 1.0,
        bloomRadius: 0.32,
        bloomThreshold: 0.0,
        pixelated: false,
        pixelSize: 4,
        contrast: 1.0,
        colorTemp: 0.0,
        resetLightsOnStart: false,
        renderThread: 'worker',
        cameraFollow: false,
        cameraFollowName: 'default',
    };

    class LightExtension {
        constructor() {
            this.lights = {};
            this.ambient = RENDER_DEFAULTS.ambient;
            this.visible = true;
            this.shadowOpacity = RENDER_DEFAULTS.shadowOpacity;
            this.bgOpacity = RENDER_DEFAULTS.bgOpacity;

            this.bloomAmount = RENDER_DEFAULTS.bloomAmount;
            this.bloomRadius = RENDER_DEFAULTS.bloomRadius;
            this.bloomThreshold = RENDER_DEFAULTS.bloomThreshold;
            this.pixelated = RENDER_DEFAULTS.pixelated;
            this.pixelSize = RENDER_DEFAULTS.pixelSize;
            this.contrast = RENDER_DEFAULTS.contrast;
            this.colorTemp = RENDER_DEFAULTS.colorTemp;
            this.resetLightsOnStart = RENDER_DEFAULTS.resetLightsOnStart;
            this.renderThread = RENDER_DEFAULTS.renderThread;
            this.cameraFollow = RENDER_DEFAULTS.cameraFollow;
            this.cameraFollowName = RENDER_DEFAULTS.cameraFollowName;

            this.inclusionMode = 'Blacklist';
            this._inclusionList = [];

            this._mode = 'none';
            this._worker = null;
            this._workerReady = false;
            this._pendingRender = null;
            this._workerBusy = false;
            this._nextRender = null;
            this._displayCtx = null;
            this._gl = null;
            this._glState = null;
            this._dirty = true;
            this._excludedSprites = new Set();
            this._costumeImageCache = new Map();
            this._lastGLBitmap = null;
            this._lastBitmapPw = 0;
            this._lastBitmapPh = 0;
            this._cachedPw = 0;
            this._cachedPh = 0;
            this._cachedNativeDpr = 0;

            this._uboData = null;
            this._ambientRGB = this.hexToRgb(this.ambient);

            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText =
                'position:absolute;pointer-events:none;z-index:0;mix-blend-mode:multiply;display:block;clip-path:inset(0 round inherit);';

            this._init();
            this.attachToStage();

            this._boundRender = this._render.bind(this);
            this._boundSyncPos = () => {
                this._syncCanvasPosition();
                this._markDirty();
                this._render();
            };

            this._setupResizeObserver();

            window.addEventListener('resize', this._boundSyncPos);
            document.addEventListener('fullscreenchange', this._boundSyncPos);

            Scratch.vm.runtime.on('AFTER_EXECUTE', this._boundRender);
            Scratch.vm.runtime.on('PROJECT_START', () => {
                if (this.resetLightsOnStart) this.clearLights();
            });
            this._loadRenderSettings();
        }

        async openRenderSettings() {
            const ScratchBlocks = window.ScratchBlocks;
            if (!ScratchBlocks || !ScratchBlocks.customPrompt) {
                const op = parseFloat(prompt('Overlay Opacity (0-1):', this.shadowOpacity));
                if (!isNaN(op)) this.shadowOpacity = Math.max(0, Math.min(1, op));
                const amb = prompt('Ambient color (hex):', this.ambient);
                if (amb) {
                    this.ambient = amb;
                    this._ambientRGB = this.hexToRgb(amb);
                }
                this._saveRenderSettings();
                this._markDirty();
                return;
            }

            const snapshot = {
                shadowOpacity: this.shadowOpacity,
                bgOpacity: this.bgOpacity,
                ambient: this.ambient,
                bloomAmount: this.bloomAmount,
                bloomRadius: this.bloomRadius,
                bloomThreshold: this.bloomThreshold,
                pixelated: this.pixelated,
                pixelSize: this.pixelSize,
                contrast: this.contrast,
                colorTemp: this.colorTemp,
                resetLightsOnStart: this.resetLightsOnStart,
                renderThread: this.renderThread,
                cameraFollow: this.cameraFollow,
                cameraFollowName: this.cameraFollowName,
                inclusionMode: this.inclusionMode,
                inclusionList: [...this._inclusionList],
            };

            let pending = {
                ...snapshot,
                inclusionList: [...snapshot.inclusionList]
            };

            const applyPending = () => {
                this.shadowOpacity = pending.shadowOpacity;
                this.bgOpacity = pending.bgOpacity;
                this.ambient = pending.ambient;
                this._ambientRGB = this.hexToRgb(pending.ambient);
                this.bloomAmount = pending.bloomAmount;
                this.bloomRadius = pending.bloomRadius;
                this.bloomThreshold = pending.bloomThreshold;
                this.pixelated = pending.pixelated;
                this.pixelSize = pending.pixelSize;
                this.contrast = pending.contrast;
                this.colorTemp = pending.colorTemp;
                this.resetLightsOnStart = pending.resetLightsOnStart;
                this.cameraFollow = pending.cameraFollow;
                this.cameraFollowName = pending.cameraFollowName;
                this.inclusionMode = pending.inclusionMode;
                this._inclusionList = [...(pending.inclusionList || [])];
                this._markDirty();
            };

            const modal = await ScratchBlocks.customPrompt({
                    title: 'Render Settings'
                }, {
                    content: {
                        width: '500px'
                    }
                },
                [{
                        name: 'Save',
                        role: 'ok',
                        callback: () => {
                            applyPending();
                            this._saveRenderSettings();
                        }
                    },
                    {
                        name: 'Cancel',
                        role: 'cancel',
                        callback: () => {
                            this.shadowOpacity = snapshot.shadowOpacity;
                            this.bgOpacity = snapshot.bgOpacity;
                            this.ambient = snapshot.ambient;
                            this._ambientRGB = this.hexToRgb(snapshot.ambient);
                            this.bloomAmount = snapshot.bloomAmount;
                            this.bloomRadius = snapshot.bloomRadius;
                            this.bloomThreshold = snapshot.bloomThreshold;
                            this.pixelated = snapshot.pixelated;
                            this.pixelSize = snapshot.pixelSize;
                            this.contrast = snapshot.contrast;
                            this.colorTemp = snapshot.colorTemp;
                            this.resetLightsOnStart = snapshot.resetLightsOnStart;
                            this.cameraFollow = snapshot.cameraFollow;
                            this.cameraFollowName = snapshot.cameraFollowName;
                            if (this.renderThread !== snapshot.renderThread) {
                                this.renderThread = snapshot.renderThread;
                                this._switchRenderThread(this.renderThread);
                            }
                            this.inclusionMode = snapshot.inclusionMode;
                            this._inclusionList = [...snapshot.inclusionList];
                            this._markDirty();
                        }
                    }
                ]
            );

            const container = document.createElement('div');
            container.style.cssText = 'display:flex;flex-direction:column;gap:12px;padding:12px 16px 20px;margin:8px;font-family:sans-serif;max-height:420px;overflow-y:auto;';

            const headerNote = document.createElement('div');
            headerNote.textContent = 'All settings are saved to your project!';
            headerNote.style.cssText = 'font-size:0.85rem;font-weight:600;color:#4a9eff;padding:6px 10px;background:rgba(74,158,255,0.1);border-radius:6px;border:1px solid rgba(74,158,255,0.3);';
            container.appendChild(headerNote);

            const makeRow = (labelText, inputEl, valueEl) => {
                const row = document.createElement('div');
                row.style.cssText = 'display:flex;align-items:center;gap:12px;padding:4px 8px;';
                const lbl = document.createElement('label');
                lbl.textContent = labelText;
                lbl.style.cssText = 'min-width:130px;font-size:0.88rem;font-weight:600;';
                row.appendChild(lbl);
                row.appendChild(inputEl);
                if (valueEl) row.appendChild(valueEl);
                return row;
            };

            const makeSlider = (min, max, step, initVal, onChange) => {
                const sl = document.createElement('input');
                sl.type = 'range';
                sl.min = min;
                sl.max = max;
                sl.step = step;
                sl.value = initVal;
                sl.style.cssText = 'flex:1;cursor:pointer;';
                const val = document.createElement('span');
                val.style.cssText = 'width:36px;font-size:0.82rem;text-align:right;opacity:0.7;flex-shrink:0;';
                sl.addEventListener('input', () => {
                    val.textContent = onChange(sl.value);
                    applyPending();
                });
                return [sl, val];
            };

            const [shadowSlider, shadowVal] = makeSlider(0, 100, 1, Math.round(this.shadowOpacity * 100), v => {
                pending.shadowOpacity = v / 100;
                return (v / 100).toFixed(2);
            });
            shadowVal.textContent = this.shadowOpacity.toFixed(2);
            container.appendChild(makeRow('Overlay Opacity', shadowSlider, shadowVal));

            const [bgOpacitySlider, bgOpacityVal] = makeSlider(0, 100, 1, Math.round(this.bgOpacity * 100), v => {
                pending.bgOpacity = v / 100;
                return (v / 100).toFixed(2);
            });
            bgOpacityVal.textContent = this.bgOpacity.toFixed(2);
            container.appendChild(makeRow('Background Opacity', bgOpacitySlider, bgOpacityVal));

            const ambientInput = document.createElement('input');
            ambientInput.type = 'color';
            ambientInput.value = this.ambient;
            ambientInput.style.cssText = 'width:32px;height:32px;border:none;padding:0;cursor:pointer;border-radius:4px;';
            ambientInput.addEventListener('input', () => {
                pending.ambient = ambientInput.value;
                applyPending();
            });
            container.appendChild(makeRow('Ambient Color', ambientInput));

            const [bloomSlider, bloomVal] = makeSlider(0, 200, 1, Math.round(this.bloomAmount * 100), v => {
                pending.bloomAmount = v / 100;
                return (v / 100).toFixed(2);
            });
            bloomVal.textContent = this.bloomAmount.toFixed(2);
            container.appendChild(makeRow('Bloom Amount', bloomSlider, bloomVal));

            const [bloomRadiusSlider, bloomRadiusVal] = makeSlider(1, 100, 1, Math.round(this.bloomRadius * 100), v => {
                pending.bloomRadius = v / 100;
                return (v / 100).toFixed(2);
            });
            bloomRadiusVal.textContent = this.bloomRadius.toFixed(2);
            container.appendChild(makeRow('Bloom Radius', bloomRadiusSlider, bloomRadiusVal));

            const [bloomThreshSlider, bloomThreshVal] = makeSlider(0, 100, 1, Math.round(this.bloomThreshold * 100), v => {
                pending.bloomThreshold = v / 100;
                return (v / 100).toFixed(2);
            });
            bloomThreshVal.textContent = this.bloomThreshold.toFixed(2);
            container.appendChild(makeRow('Bloom Threshold', bloomThreshSlider, bloomThreshVal));

            const pixelSection = document.createElement('div');
            pixelSection.style.cssText = 'display:flex;flex-direction:column;gap:6px;padding:12px 16px 14px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:8px;';

            const pixelHeaderRow = document.createElement('div');
            pixelHeaderRow.style.cssText = 'display:flex;align-items:center;gap:12px;padding:2px 8px;';
            const pixelLabel = document.createElement('label');
            pixelLabel.textContent = 'Pixelated Rendering';
            pixelLabel.style.cssText = 'min-width:140px;font-size:0.88rem;font-weight:600;';
            const pixelToggle = document.createElement('input');
            pixelToggle.type = 'checkbox';
            pixelToggle.checked = this.pixelated;
            pixelToggle.style.cssText = 'width:17px;height:17px;cursor:pointer;accent-color:#4a9eff;';
            pixelHeaderRow.appendChild(pixelLabel);
            pixelHeaderRow.appendChild(pixelToggle);
            pixelSection.appendChild(pixelHeaderRow);

            const pixelSizeRow = document.createElement('div');
            pixelSizeRow.style.cssText = `display:flex;align-items:center;gap:12px;padding:4px 8px;min-width:0;opacity:${this.pixelated ? 1 : 0.35};transition:opacity 0.2s;pointer-events:${this.pixelated ? 'auto' : 'none'};`;
            const pixelSizeLabel = document.createElement('label');
            pixelSizeLabel.textContent = `\u21B3 Pixel Size (${this.pixelSize}px)`;
            pixelSizeLabel.style.cssText = 'min-width:130px;font-size:0.85rem;font-weight:500;opacity:0.85;white-space:nowrap;';
            const [pixelSizeSlider] = makeSlider(1, 16, 1, this.pixelSize, v => {
                pending.pixelSize = parseInt(v, 10);
                pixelSizeLabel.textContent = `\u21B3 Pixel Size (${v}px)`;
                return v + 'px';
            });
            pixelSizeRow.appendChild(pixelSizeLabel);
            pixelSizeRow.appendChild(pixelSizeSlider);
            pixelSection.appendChild(pixelSizeRow);

            pixelToggle.addEventListener('change', () => {
                pending.pixelated = pixelToggle.checked;
                pixelSizeRow.style.opacity = pixelToggle.checked ? '1' : '0.35';
                pixelSizeRow.style.pointerEvents = pixelToggle.checked ? 'auto' : 'none';
                applyPending();
            });

            container.appendChild(pixelSection);

            const [contrastSlider, contrastVal] = makeSlider(50, 200, 1, Math.round(this.contrast * 100), v => {
                pending.contrast = v / 100;
                return (v / 100).toFixed(2);
            });
            contrastVal.textContent = this.contrast.toFixed(2);
            container.appendChild(makeRow('Contrast', contrastSlider, contrastVal));

            const [colorTempSlider, colorTempVal] = makeSlider(-100, 100, 1, Math.round(this.colorTemp * 100), v => {
                pending.colorTemp = v / 100;
                const label = v > 0 ? `+${(v/100).toFixed(2)} warm` : v < 0 ? `${(v/100).toFixed(2)} cool` : '0 (neutral)';
                return label;
            });
            colorTempVal.textContent = this.colorTemp === 0 ? '0 (neutral)' : (this.colorTemp > 0 ? `+${this.colorTemp.toFixed(2)} warm` : `${this.colorTemp.toFixed(2)} cool`);
            colorTempVal.style.minWidth = '90px';
            container.appendChild(makeRow('Color Temperature', colorTempSlider, colorTempVal));

            const resetOnStartToggle = document.createElement('input');
            resetOnStartToggle.type = 'checkbox';
            resetOnStartToggle.checked = this.resetLightsOnStart;
            resetOnStartToggle.style.cssText = 'width:17px;height:17px;cursor:pointer;accent-color:#4a9eff;';
            resetOnStartToggle.addEventListener('change', () => {
                pending.resetLightsOnStart = resetOnStartToggle.checked;
                applyPending();
            });
            container.appendChild(makeRow('Reset Lights on Start', resetOnStartToggle));

            if (isPenguinMod) {
                const cameraFollowToggle = document.createElement('input');
                cameraFollowToggle.type = 'checkbox';
                cameraFollowToggle.checked = this.cameraFollow;
                cameraFollowToggle.style.cssText = 'width:17px;height:17px;cursor:pointer;accent-color:#4a9eff;';
                cameraFollowToggle.addEventListener('change', () => {
                    pending.cameraFollow = cameraFollowToggle.checked;
                    applyPending();
                });
                container.appendChild(makeRow('Follow PM Camera', cameraFollowToggle));
            }

            const renderThreadSelect = document.createElement('select');
            renderThreadSelect.style.cssText = 'flex:1;padding:4px 8px;border-radius:4px;font-size:0.85rem;cursor:pointer;';
            ['worker', 'main'].forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.textContent = opt === 'worker' ? 'Worker Thread' : 'Main Thread';
                if (this.renderThread === opt) o.selected = true;
                renderThreadSelect.appendChild(o);
            });
            renderThreadSelect.addEventListener('change', () => {
                pending.renderThread = renderThreadSelect.value;
                this.renderThread = renderThreadSelect.value;
                this._switchRenderThread(renderThreadSelect.value);
                this._saveRenderSettings();
            });
            container.appendChild(makeRow('Render Thread', renderThreadSelect));

            const inclusionSection = document.createElement('div');
            inclusionSection.style.cssText = 'display:flex;flex-direction:column;gap:10px;padding:10px 16px 14px;background:rgba(255,255,255,0.07);border:1px solid rgba(255,255,255,0.12);border-radius:8px;';

            const inclusionHeaderRow = document.createElement('div');
            inclusionHeaderRow.style.cssText = 'display:flex;align-items:center;gap:12px;padding:2px 8px;';
            const inclusionLabel = document.createElement('label');
            inclusionLabel.textContent = 'Inclusion Mode';
            inclusionLabel.style.cssText = 'min-width:130px;font-size:0.88rem;font-weight:600;';
            const inclusionSelect = document.createElement('select');
            inclusionSelect.style.cssText = 'flex:1;padding:4px 8px;border-radius:4px;font-size:0.85rem;cursor:pointer;';
            ['Blacklist', 'Whitelist'].forEach(opt => {
                const o = document.createElement('option');
                o.value = opt;
                o.textContent = opt;
                if (this.inclusionMode === opt) o.selected = true;
                inclusionSelect.appendChild(o);
            });
            inclusionHeaderRow.appendChild(inclusionLabel);
            inclusionHeaderRow.appendChild(inclusionSelect);
            inclusionSection.appendChild(inclusionHeaderRow);

            const inclusionDesc = document.createElement('div');
            inclusionDesc.style.cssText = 'font-size:0.78rem;opacity:0.6;padding:0 8px;';
            const updateInclusionDesc = () => {
                inclusionDesc.textContent = inclusionSelect.value === 'Blacklist' ?
                    'Selected sprites will be excluded from lighting.' :
                    'Only selected sprites will receive lighting.';
            };
            updateInclusionDesc();
            inclusionSection.appendChild(inclusionDesc);

            const spriteListContainer = document.createElement('div');
            spriteListContainer.style.cssText = 'display:flex;flex-direction:column;gap:6px;max-height:150px;overflow-y:auto;padding:4px 8px;';

            const allSprites = Scratch.vm.runtime.targets.filter(t => !t.isStage).map(t => t.sprite.name);

            const rebuildSpriteList = () => {
                spriteListContainer.innerHTML = '';
                if (allSprites.length === 0) {
                    const empty = document.createElement('div');
                    empty.textContent = 'No sprites found.';
                    empty.style.cssText = 'font-size:0.8rem;opacity:0.5;';
                    spriteListContainer.appendChild(empty);
                    return;
                }
                allSprites.forEach(name => {
                    const row = document.createElement('label');
                    row.style.cssText = 'display:flex;align-items:center;gap:8px;font-size:0.85rem;cursor:pointer;';
                    const cb = document.createElement('input');
                    cb.type = 'checkbox';
                    cb.style.cssText = 'width:15px;height:15px;accent-color:#4a9eff;cursor:pointer;';
                    cb.checked = pending.inclusionList.includes(name);
                    cb.addEventListener('change', () => {
                        if (cb.checked) {
                            if (!pending.inclusionList.includes(name)) pending.inclusionList.push(name);
                        } else {
                            pending.inclusionList = pending.inclusionList.filter(n => n !== name);
                        }
                        applyPending();
                    });
                    const nameSpan = document.createElement('span');
                    nameSpan.textContent = name;
                    row.appendChild(cb);
                    row.appendChild(nameSpan);
                    spriteListContainer.appendChild(row);
                });
            };

            inclusionSection.appendChild(spriteListContainer);
            container.appendChild(inclusionSection);

            pending.inclusionMode = this.inclusionMode;
            pending.inclusionList = [...this._inclusionList];

            rebuildSpriteList();

            inclusionSelect.addEventListener('change', () => {
                pending.inclusionMode = inclusionSelect.value;
                updateInclusionDesc();
                applyPending();
            });

            const resetBtn = document.createElement('button');
            resetBtn.textContent = 'Reset to Defaults';
            resetBtn.style.cssText = 'align-self:flex-start;margin-top:4px;padding:7px 18px;font-size:0.82rem;cursor:pointer;border-radius:4px;';
            resetBtn.addEventListener('click', () => {
                pending = {
                    ...RENDER_DEFAULTS,
                    inclusionMode: 'Blacklist',
                    inclusionList: []
                };
                shadowSlider.value = Math.round(RENDER_DEFAULTS.shadowOpacity * 100);
                shadowVal.textContent = RENDER_DEFAULTS.shadowOpacity.toFixed(2);
                bgOpacitySlider.value = Math.round(RENDER_DEFAULTS.bgOpacity * 100);
                bgOpacityVal.textContent = RENDER_DEFAULTS.bgOpacity.toFixed(2);
                ambientInput.value = RENDER_DEFAULTS.ambient;
                bloomSlider.value = Math.round(RENDER_DEFAULTS.bloomAmount * 100);
                bloomVal.textContent = RENDER_DEFAULTS.bloomAmount.toFixed(2);
                bloomRadiusSlider.value = Math.round(RENDER_DEFAULTS.bloomRadius * 100);
                bloomRadiusVal.textContent = RENDER_DEFAULTS.bloomRadius.toFixed(2);
                bloomThreshSlider.value = Math.round(RENDER_DEFAULTS.bloomThreshold * 100);
                bloomThreshVal.textContent = RENDER_DEFAULTS.bloomThreshold.toFixed(2);
                pixelToggle.checked = RENDER_DEFAULTS.pixelated;
                pixelSizeSlider.value = RENDER_DEFAULTS.pixelSize;
                pixelSizeLabel.textContent = `\u21B3 Pixel Size (${RENDER_DEFAULTS.pixelSize}px)`;
                pixelSizeRow.style.opacity = RENDER_DEFAULTS.pixelated ? '1' : '0.35';
                pixelSizeRow.style.pointerEvents = RENDER_DEFAULTS.pixelated ? 'auto' : 'none';
                contrastSlider.value = Math.round(RENDER_DEFAULTS.contrast * 100);
                contrastVal.textContent = RENDER_DEFAULTS.contrast.toFixed(2);
                colorTempSlider.value = Math.round(RENDER_DEFAULTS.colorTemp * 100);
                colorTempVal.textContent = '0 (neutral)';
                resetOnStartToggle.checked = RENDER_DEFAULTS.resetLightsOnStart;
                renderThreadSelect.value = RENDER_DEFAULTS.renderThread;
                if (this.renderThread !== RENDER_DEFAULTS.renderThread) {
                    this.renderThread = RENDER_DEFAULTS.renderThread;
                    this._switchRenderThread(this.renderThread);
                    this._saveRenderSettings();
                }
                inclusionSelect.value = 'Blacklist';
                updateInclusionDesc();
                rebuildSpriteList();
                applyPending();
            });
            container.appendChild(resetBtn);

            const footerNote = document.createElement('div');
            footerNote.textContent = 'Extension created by gen1x_loll (Gen1x/G1nX). DM me on Discord if it bugs!';
            footerNote.style.cssText = 'font-size:0.72rem;opacity:0.5;text-align:center;margin-top:4px;';
            container.appendChild(footerNote);

            modal.appendChild(container);
        }

        _saveRenderSettings() {
            if (isPenguinMod) return;
            try {
                const vm = Scratch.vm;
                if (!vm.runtime.extensionStorage) vm.runtime.extensionStorage = {};
                if (!vm.runtime.extensionStorage.simpleLighting) vm.runtime.extensionStorage.simpleLighting = {};
                Object.assign(vm.runtime.extensionStorage.simpleLighting, {
                    shadowOpacity: this.shadowOpacity,
                    bgOpacity: this.bgOpacity,
                    ambient: this.ambient,
                    bloomAmount: this.bloomAmount,
                    bloomRadius: this.bloomRadius,
                    bloomThreshold: this.bloomThreshold,
                    pixelated: this.pixelated,
                    pixelSize: this.pixelSize,
                    contrast: this.contrast,
                    colorTemp: this.colorTemp,
                    resetLightsOnStart: this.resetLightsOnStart,
                    renderThread: this.renderThread,
                });
            } catch (e) {}
        }

        _loadRenderSettings() {
            if (isPenguinMod) return;
            try {
                const vm = Scratch.vm;
                const s = vm.runtime.extensionStorage?.simpleLighting;
                if (!s) return;
                if (typeof s.shadowOpacity === 'number') this.shadowOpacity = s.shadowOpacity;
                if (typeof s.bgOpacity === 'number') this.bgOpacity = s.bgOpacity;
                if (typeof s.ambient === 'string') {
                    this.ambient = s.ambient;
                    this._ambientRGB = this.hexToRgb(s.ambient);
                }
                if (typeof s.bloomAmount === 'number') this.bloomAmount = s.bloomAmount;
                if (typeof s.bloomRadius === 'number') this.bloomRadius = s.bloomRadius;
                if (typeof s.bloomThreshold === 'number') this.bloomThreshold = s.bloomThreshold;
                if (typeof s.pixelated === 'boolean') this.pixelated = s.pixelated;
                if (typeof s.pixelSize === 'number') this.pixelSize = s.pixelSize;
                if (typeof s.contrast === 'number') this.contrast = s.contrast;
                if (typeof s.colorTemp === 'number') this.colorTemp = s.colorTemp;
                if (typeof s.resetLightsOnStart === 'boolean') this.resetLightsOnStart = s.resetLightsOnStart;
                if (typeof s.renderThread === 'string' && (s.renderThread === 'worker' || s.renderThread === 'main')) {
                    this.renderThread = s.renderThread;
                    this._switchRenderThread(this.renderThread);
                }
            } catch (e) {}
        }

        serialize() {
            if (isPenguinMod) {
                return {
                    shadowOpacity: this.shadowOpacity,
                    bgOpacity: this.bgOpacity,
                    ambient: this.ambient,
                    bloomAmount: this.bloomAmount,
                    bloomRadius: this.bloomRadius,
                    bloomThreshold: this.bloomThreshold,
                    pixelated: this.pixelated,
                    pixelSize: this.pixelSize,
                    contrast: this.contrast,
                    colorTemp: this.colorTemp,
                    resetLightsOnStart: this.resetLightsOnStart,
                    renderThread: this.renderThread,
                    cameraFollow: this.cameraFollow,
                    cameraFollowName: this.cameraFollowName,
                    inclusionMode: this.inclusionMode,
                    inclusionList: [...this._inclusionList],
                };
            }
            return {};
        }

        deserialize(data) {
            if (isPenguinMod && data) {
                if (typeof data.shadowOpacity === 'number') this.shadowOpacity = data.shadowOpacity;
                if (typeof data.bgOpacity === 'number') this.bgOpacity = data.bgOpacity;
                if (typeof data.ambient === 'string') {
                    this.ambient = data.ambient;
                    this._ambientRGB = this.hexToRgb(data.ambient);
                }
                if (typeof data.bloomAmount === 'number') this.bloomAmount = data.bloomAmount;
                if (typeof data.bloomRadius === 'number') this.bloomRadius = data.bloomRadius;
                if (typeof data.bloomThreshold === 'number') this.bloomThreshold = data.bloomThreshold;
                if (typeof data.pixelated === 'boolean') this.pixelated = data.pixelated;
                if (typeof data.pixelSize === 'number') this.pixelSize = data.pixelSize;
                if (typeof data.contrast === 'number') this.contrast = data.contrast;
                if (typeof data.colorTemp === 'number') this.colorTemp = data.colorTemp;
                if (typeof data.resetLightsOnStart === 'boolean') this.resetLightsOnStart = data.resetLightsOnStart;
                if (typeof data.renderThread === 'string' && (data.renderThread === 'worker' || data.renderThread === 'main')) {
                    this.renderThread = data.renderThread;
                    this._switchRenderThread(this.renderThread);
                }
                if (typeof data.cameraFollow === 'boolean') this.cameraFollow = data.cameraFollow;
                if (typeof data.cameraFollowName === 'string') this.cameraFollowName = data.cameraFollowName;
                if (typeof data.inclusionMode === 'string') this.inclusionMode = data.inclusionMode;
                if (Array.isArray(data.inclusionList)) this._inclusionList = data.inclusionList;
                this._markDirty();
            }
        }

        attachToStage() {
            this._tryAttach();

            if (!this._docObserver) {
                this._docObserver = new MutationObserver(() => {
                    const stageCanvas = Scratch.vm.renderer.canvas
                    if (stageCanvas && stageCanvas.parentElement !== this._attachedParent) {
                        this._tryAttach();
                    }
                });
                this._docObserver.observe(document.body, {
                    childList: true,
                    subtree: true
                });
            }
        }

        _tryAttach() {
            const stageCanvas = Scratch.vm.renderer.canvas
            if (!stageCanvas) {
                setTimeout(() => this._tryAttach(), 500);
                return;
            }

            const canvasParent = stageCanvas.parentElement;
            this._attachedParent = canvasParent;

            const sortLayer = () => {
                const currentParent = document.querySelector('[class*="stage_stage_"] canvas, .sc-layers canvas.sc-canvas')?.parentElement;
                if (!currentParent) return;

                const monitorWrapper = currentParent.querySelector('[class*="monitor-wrapper_"]');
                const customOverlays = currentParent.querySelector('[class*="custom-overlays_"]');
                const scratchOverlays = currentParent.querySelector('.scratch-render-overlays');
                const targetReference = monitorWrapper || customOverlays || scratchOverlays;

                if (targetReference) {
                    if (this.canvas.nextSibling !== targetReference) {
                        currentParent.insertBefore(this.canvas, targetReference);
                    }
                } else {
                    if (this.canvas.parentElement !== currentParent) {
                        currentParent.appendChild(this.canvas);
                    }
                }
            };

            sortLayer();

            if (this._parentObserver) this._parentObserver.disconnect();
            this._parentObserver = new MutationObserver(sortLayer);
            this._parentObserver.observe(canvasParent, {
                childList: true,
                subtree: false
            });

            if (this._setupResizeObserver) this._setupResizeObserver();
            this._markDirty();
        }

        _init() {
            if (typeof OffscreenCanvas !== 'undefined' && typeof Worker !== 'undefined') {
                try {
                    const blob = new Blob([WORKER_SRC], {
                        type: 'application/javascript'
                    });
                    const url = URL.createObjectURL(blob);
                    this._worker = new Worker(url);
                    URL.revokeObjectURL(url);

                    this._displayCtx = this.canvas.getContext('2d');
                    this._displayCtx.imageSmoothingEnabled = false;

                    this._worker.onmessage = ({
                        data: msg
                    }) => {
                        if (msg.type === 'ready') {
                            console.log('LightExtension: worker thread active');
                            this._mode = 'worker';
                            this._workerReady = true;
                            if (this._pendingRender) {
                                this._workerBusy = true;
                                this._worker.postMessage(this._pendingRender);
                                this._pendingRender = null;
                            }
                        } else if (msg.type === 'frame') {
                            this._workerBusy = false;
                            const bmp = msg.bitmap;
                            if (this._lastGLBitmap) this._lastGLBitmap.close();
                            this._lastGLBitmap = bmp;
                            this._lastBitmapPw = bmp.width;
                            this._lastBitmapPh = bmp.height;
                            const _bw = bmp.width,
                                _bh = bmp.height;
                            const _w = Scratch.vm.runtime.stageWidth || 480;
                            const _h = Scratch.vm.runtime.stageHeight || 360;
                            if (this.canvas.width !== _bw || this.canvas.height !== _bh) {
                                this.canvas.width = _bw;
                                this.canvas.height = _bh;
                            }
                            this._displayCtx.imageSmoothingEnabled = false;
                            this._displayCtx.clearRect(0, 0, _bw, _bh);
                            this._drawBitmapPixelated(this._displayCtx, this._lastGLBitmap, _bw, _bh);
                            this._applyCutouts(this._displayCtx, _w, _h, _bw, _bh);
                            if (this._nextRender) {
                                const next = this._nextRender;
                                this._nextRender = null;
                                this._workerBusy = true;
                                this._worker.postMessage(next);
                            }
                        } else if (msg.type === 'error') {
                            console.warn('LightExtension: worker GL error:', msg.message, 'falling back to main thread');
                            this._worker.terminate();
                            this._worker = null;
                            this._displayCtx = null;
                            this._initMainThread();
                        }
                    };

                    this._worker.onerror = (e) => {
                        console.warn('LightExtension: worker crashed:', e.message, 'falling back to main thread');
                        this._worker = null;
                        this._displayCtx = null;
                        this._initMainThread();
                    };

                    const w = Scratch.vm.runtime.stageWidth;
                    const h = Scratch.vm.runtime.stageHeight;
                    this._worker.postMessage({
                        type: 'init',
                        w,
                        h
                    });
                    return;

                } catch (e) {
                    console.warn('LightExtension: worker setup failed:', e.message, 'falling back to main thread');
                    if (this._worker) {
                        this._worker.terminate();
                        this._worker = null;
                    }
                    this._displayCtx = null;
                }
            } else {
                console.log('LightExtension: OffscreenCanvas/Worker unavailable, using main-thread WebGL');
            }

            this._initMainThread();
        }

        _initMainThread() {
            try {
                const w = Scratch.vm.runtime.stageWidth || 480;
                const h = Scratch.vm.runtime.stageHeight || 360;
                const oc = new OffscreenCanvas(w, h);
                const gl = oc.getContext('webgl2', {
                    alpha: true,
                    premultipliedAlpha: true,
                    antialias: false,
                    depth: false,
                    stencil: false
                });
                if (!gl) throw new Error('getContext("webgl2") returned null');

                this._glOffscreen = oc;
                this._gl = gl;
                this._glState = buildGLState(gl);
                this._displayCtx = this.canvas.getContext('2d');
                this._displayCtx.imageSmoothingEnabled = false;
                this._mode = 'main';
                console.log('LightExtension: main-thread WebGL2 active');
            } catch (e) {
                console.error('LightExtension: WebGL2 unavailable:', e.message);
                this._mode = 'none';
            }
        }

        _switchRenderThread(target) {
            if (target === 'worker' && this._mode !== 'worker') {
                if (this._gl) {
                    this._gl = null;
                    this._glState = null;
                    this._glOffscreen = null;
                }
                if (this._worker) {
                    this._worker.terminate();
                    this._worker = null;
                }
                this._workerReady = false;
                this._workerBusy = false;
                this._nextRender = null;
                this._pendingRender = null;
                this._displayCtx = null;
                this._mode = 'none';
                this._init();
            } else if (target === 'main' && this._mode !== 'main') {
                if (this._worker) {
                    this._worker.terminate();
                    this._worker = null;
                }
                this._workerReady = false;
                this._workerBusy = false;
                this._nextRender = null;
                this._pendingRender = null;
                this._displayCtx = null;
                this._mode = 'none';
                this._initMainThread();
            }
            this._markDirty();
        }

        _getSpriteMenuItems() {
            const editingTarget = Scratch.vm.editingTarget;
            const myselfName = (editingTarget && !editingTarget.isStage)
                ? editingTarget.sprite.name
                : null;
            const sprites = Scratch.vm.runtime.targets
                .filter(t => !t.isStage && t.sprite.name !== myselfName)
                .map(t => t.sprite.name);
            const items = [{ text: 'myself', value: '_myself_' }];
            for (const name of sprites) items.push({ text: name, value: name });
            return items;
        }

        _resolveSpriteName(raw) {
            if (Scratch.Cast.toString(raw) === '_myself_') {
                const editingTarget = Scratch.vm.editingTarget;
                if (editingTarget && !editingTarget.isStage) return editingTarget.sprite.name;
                return null;
            }
            return Scratch.Cast.toString(raw);
        }

        _setupResizeObserver() {
            if (this._resizeObserver) this._resizeObserver.disconnect();

            const renderer = Scratch.vm.runtime.renderer;
            const glCanvas = renderer && renderer._gl && renderer._gl.canvas;
            if (!glCanvas) {
                setTimeout(() => this._setupResizeObserver(), 200);
                return;
            }

            this._resizeObserver = new ResizeObserver(() => {
                this._syncCanvasPosition();
                this._markDirty();
                this._render();
            });
            this._resizeObserver.observe(glCanvas);
        }

        _syncCanvasPosition() {
            const renderer = Scratch.vm.runtime.renderer;
            const glCanvas = renderer && renderer._gl && renderer._gl.canvas;
            if (!glCanvas) return;
            const cs = this.canvas.style;
            const l = glCanvas.offsetLeft + 'px';
            const t = glCanvas.offsetTop + 'px';
            const W = glCanvas.offsetWidth + 'px';
            const H = glCanvas.offsetHeight + 'px';
            if (cs.left !== l) cs.left = l;
            if (cs.top !== t) cs.top = t;
            if (cs.width !== W) cs.width = W;
            if (cs.height !== H) cs.height = H;

            const ow = glCanvas.offsetWidth;
            const oh = glCanvas.offsetHeight;
            if (ow > 0 && oh > 0) {
                const w = Scratch.vm.runtime.stageWidth || 480;
                const h = Scratch.vm.runtime.stageHeight || 360;
                const dpr = window.devicePixelRatio || 1;
                this._cachedNativeDpr = (ow / w) * dpr;
                this._cachedPw = Math.max(1, Math.round(w * this._cachedNativeDpr));
                this._cachedPh = Math.max(1, Math.round(h * this._cachedNativeDpr));
            }
        }

        _getTarget(name) {
            return Scratch.vm.runtime.targets.find(t => !t.isStage && t.sprite.name === name) || null;
        }

        _getEffectiveExclusionSet() {
            const result = new Set(this._excludedSprites);
            const allSprites = Scratch.vm.runtime.targets
                .filter(t => !t.isStage)
                .map(t => t.sprite.name);
            if (this.inclusionMode === 'Blacklist') {
                for (const name of this._inclusionList) result.add(name);
            } else {
                for (const name of allSprites) {
                    if (!this._inclusionList.includes(name)) result.add(name);
                }
            }
            return result;
        }

        _applyCutouts(ctx, w, h, pw, ph) {
            const effectiveExclusions = this._getEffectiveExclusionSet();
            if (effectiveExclusions.size === 0) return;
            const renderer = Scratch.vm.runtime.renderer;
            if (!renderer || typeof renderer.extractDrawableScreenSpace !== 'function') return;

            const glCanvas = renderer._gl && renderer._gl.canvas;
            if (!glCanvas) return;

            ctx.save();
            ctx.globalCompositeOperation = 'destination-out';

            for (const name of effectiveExclusions) {
                const target = this._getTarget(name);
                if (!target || !target.visible || target.drawableID == null) continue;
                try {
                    const extracted = renderer.extractDrawableScreenSpace(target.drawableID);
                    if (!extracted) continue;

                    const imageData = extracted.imageData || extracted.data;
                    if (!imageData) continue;
                    if (imageData.width <= 0 || imageData.height <= 0) continue;

                    const {
                        x,
                        y,
                        width,
                        height
                    } = extracted;
                    if (width <= 0 || height <= 0) continue;

                    const oc = new OffscreenCanvas(imageData.width, imageData.height);
                    const oct = oc.getContext('2d');
                    oct.putImageData(imageData, 0, 0);

                    const scaleX = pw / glCanvas.offsetWidth;
                    const scaleY = ph / glCanvas.offsetHeight;
                    const pad = 0.5;
                    ctx.drawImage(oc,
                        x * scaleX + pad,
                        y * scaleY + pad,
                        width * scaleX - pad * 2,
                        height * scaleY - pad * 2);
                } catch (e) {}
            }

            ctx.restore();
        }

        _drawBitmapPixelated(ctx, bitmap, pw, ph) {
            if (!this.pixelated) {
                ctx.drawImage(bitmap, 0, 0);
                return;
            }
            const scale = this._cachedNativeDpr || 1;
            const ps = Math.max(1, Math.round(this.pixelSize * scale));
            const sw = Math.max(1, Math.round(pw / ps));
            const sh = Math.max(1, Math.round(ph / ps));
            const tmp = new OffscreenCanvas(sw, sh);
            const tc = tmp.getContext('2d');
            tc.imageSmoothingEnabled = false;
            tc.drawImage(bitmap, 0, 0, sw, sh);
            ctx.imageSmoothingEnabled = false;
            ctx.drawImage(tmp, 0, 0, pw, ph);
        }

        setSpriteExcluded(args) {
            const name = this._resolveSpriteName(args.SPRITE) || Scratch.Cast.toString(args.SPRITE);
            const state = Scratch.Cast.toString(args.STATE);
            if (state === 'excluded') {
                this._excludedSprites.add(name);
            } else {
                this._excludedSprites.delete(name);
            }
            this._markDirty();
        }

        isSpriteExcluded(args) {
            const name = this._resolveSpriteName(args.SPRITE);
            return this._excludedSprites.has(name || Scratch.Cast.toString(args.SPRITE));
        }

        spriteTouchingLight(args, util) {
            const lightId = Scratch.Cast.toString(args.LIGHT);
            const li = this.lights[lightId];
            if (!li) return false;

            let spriteName = Scratch.Cast.toString(args.SPRITE);
            if (spriteName === '_myself_') {
                const t = util && util.target ? util.target : Scratch.vm.editingTarget;
                spriteName = t ? t.sprite.name : null;
            }
            if (!spriteName) return false;

            const target = Scratch.vm.runtime.targets.find(
                t => !t.isStage && t.sprite.name === spriteName
            );
            if (!target) return false;

            const sx = target.x;
            const sy = target.y;
            const lx = li.x;
            const ly = li.y;

            if (li.type === 'point') {
                const dist = Math.sqrt((sx - lx) ** 2 + (sy - ly) ** 2);
                return dist <= li.radius;
            } else if (li.type === 'area') {
                const hw = (li.width || 0) / 2;
                const hh = (li.height || 0) / 2;
                return sx >= lx - hw && sx <= lx + hw && sy >= ly - hh && sy <= ly + hh;
            } else if (li.type === 'spot') {
                const dx = sx - lx;
                const dy = sy - ly;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist >= li.radius) return false;
                const angle = Math.atan2(dy, dx);
                const dirRad = (90 - li.direction) * (Math.PI / 180);
                let delta = Math.abs(((angle - dirRad + Math.PI) % (2 * Math.PI)) - Math.PI);
                return delta <= li.arc * (Math.PI / 180);
            }
            return false;
        }

        hexToRgb(hex) {
            const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
            return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
        }

        _getCameraState() {
            return this._getCameraStateByName(this.cameraFollowName || 'default');
        }

        _getCameraStateByName(name) {
            if (!isPenguinMod) return null;
            const runtime = Scratch.vm.runtime;
            if (typeof runtime.getCamera !== 'function') return null;
            try {
                return runtime.getCamera(name);
            } catch (e) {
                return null;
            }
        }

        setCameraFollow(args) {
            this.cameraFollow = Scratch.Cast.toString(args.STATE) === 'on';
            this._markDirty();
        }

        setCameraFollowName(args) {
            this.cameraFollowName = Scratch.Cast.toString(args.NAME) || 'default';
            this._markDirty();
        }

        setLightCameraFollow(args) {
            const id = Scratch.Cast.toString(args.ID);
            const state = Scratch.Cast.toString(args.STATE);
            if (!this.lights[id]) return;
            if (state === 'none') {
                this.lights[id].cameraOverride = 'none';
            } else if (state === 'global') {
                this.lights[id].cameraOverride = null;
            } else if (state === 'custom') {
                if (this.lights[id].cameraOverride === null || this.lights[id].cameraOverride === 'none') {
                    this.lights[id].cameraOverride = this.cameraFollowName || 'default';
                }
            }
            this._markDirty();
        }

        setLightCameraName(args) {
            const id = Scratch.Cast.toString(args.ID);
            const name = Scratch.Cast.toString(args.NAME) || 'default';
            if (!this.lights[id]) return;
            this.lights[id].cameraOverride = name;
            this._markDirty();
        }

        getLightCameraFollow(args) {
            const id = Scratch.Cast.toString(args.ID);
            if (!this.lights[id]) return '';
            const ov = this.lights[id].cameraOverride;
            if (ov === null || ov === undefined) return 'global';
            if (ov === 'none') return 'none';
            return ov;
        }

        _fillUBOData(w, h) {
            const lights = Object.values(this.lights);
            const n = lights.length;
            const needed = n * 12;
            if (!this._uboData || this._uboData.length < needed) {
                this._uboData = new Float32Array(Math.max(needed, 12));
            }
            const buf = this._uboData;

            let globalCamX = 0, globalCamY = 0, globalCamScale = 1, globalCamDirRad = 0;
            if (this.cameraFollow && isPenguinMod) {
                const cam = this._getCameraState();
                if (cam) {
                    globalCamX = cam.pos[0];
                    globalCamY = cam.pos[1];
                    globalCamScale = cam.scale || 1;
                    globalCamDirRad = cam.dir * (Math.PI / 180);
                }
            }

            const _camCache = {};
            const _resolveCamera = (name) => {
                if (_camCache[name] !== undefined) return _camCache[name];
                const cam = this._getCameraStateByName(name);
                _camCache[name] = cam;
                return cam;
            };

            for (let i = 0; i < n; i++) {
                const li = lights[i];
                const base = i * 12;

                let camX = globalCamX, camY = globalCamY, camScale = globalCamScale, camDirRad = globalCamDirRad;

                if (isPenguinMod && li.cameraOverride !== undefined && li.cameraOverride !== null) {
                    if (li.cameraOverride === 'none') {
                        camX = 0; camY = 0; camScale = 1; camDirRad = 0;
                    } else {
                        const cam = _resolveCamera(li.cameraOverride);
                        if (cam) {
                            camX = cam.pos[0];
                            camY = cam.pos[1];
                            camScale = cam.scale || 1;
                            camDirRad = cam.dir * (Math.PI / 180);
                        } else {
                            camX = 0; camY = 0; camScale = 1; camDirRad = 0;
                        }
                    }
                }

                const cosA = Math.cos(-camDirRad);
                const sinA = Math.sin(-camDirRad);

                let lx = li.x - camX;
                let ly = li.y - camY;
                const rx = (lx * cosA - ly * sinA) / camScale;
                const ry = (lx * sinA + ly * cosA) / camScale;

                buf[base]      = rx + w * 0.5;
                buf[base + 1]  = h * 0.5 - ry;
                buf[base + 2]  = li.ltype;
                buf[base + 3]  = (li.radius || 0) / camScale;

                buf[base + 4]  = li.cr;
                buf[base + 5]  = li.cg;
                buf[base + 6]  = li.cb;
                buf[base + 7]  = li.softness || 0;

                buf[base + 8]  = (li.width || 0) / camScale;
                buf[base + 9]  = (li.height || 0) / camScale;
                buf[base + 10] = (li.direction - 90) * (Math.PI / 180) - camDirRad;
                buf[base + 11] = (Math.abs(li.arc) / 2) * (Math.PI / 180);
            }

            return n;
        }

        _markDirty() {
            this._dirty = true;
        }

        _render() {
            if (this._mode === 'none') return;

            const hasCutouts = this._getEffectiveExclusionSet().size > 0;
            const needsFrame = this._dirty || hasCutouts || (this.cameraFollow && isPenguinMod);
            if (!needsFrame) return;

            this._syncCanvasPosition();

            const w = Scratch.vm.runtime.stageWidth || 480;
            const h = Scratch.vm.runtime.stageHeight || 360;

            const renderer = Scratch.vm.runtime.renderer;
            const glCanvas = renderer && renderer._gl && renderer._gl.canvas;

            if (this._cachedPw === 0 && glCanvas && glCanvas.offsetWidth > 0) {
                this._syncCanvasPosition();
            }
            const pw = this._cachedPw || Math.max(1, Math.round(w * Math.min(window.devicePixelRatio || 1, 3)));
            const ph = this._cachedPh || Math.max(1, Math.round(h * Math.min(window.devicePixelRatio || 1, 3)));



            if (this.canvas.style.imageRendering !== '') {
                this.canvas.style.imageRendering = '';
            }

            const targetOpacity = String(this.shadowOpacity);
            if (this.canvas.style.opacity !== targetOpacity) {
                this.canvas.style.opacity = targetOpacity;
            }

            const targetBlend = this.bgOpacity < 0.01 ? 'screen' : 'multiply';
            if (this.canvas.style.mixBlendMode !== targetBlend) {
                this.canvas.style.mixBlendMode = targetBlend;
            }

            if (this._mode === 'worker') {
                const needsWorkerRender = this._dirty || (this.cameraFollow && isPenguinMod);
                if (needsWorkerRender) {
                    this._dirty = false;
                    const n = this._fillUBOData(w, h);
                    const ambientRGB = this._ambientRGB;
                    const msg = {
                        type: 'render',
                        w,
                        h,
                        pw,
                        ph,
                        visible: this.visible,
                        lightBuf: this._uboData,
                        n,
                        ambient: ambientRGB,
                        opacity: this.bgOpacity,
                        bloomAmount: this.bloomAmount,
                        bloomRadius: this.bloomRadius,
                        bloomThreshold: this.bloomThreshold,
                        contrast: this.contrast,
                        colorTemp: this.colorTemp,
                    };
                    if (this._workerReady) {
                        if (this._workerBusy) {
                            this._nextRender = msg;
                        } else {
                            this._workerBusy = true;
                            this._worker.postMessage(msg);
                        }
                    } else {
                        this._pendingRender = msg;
                    }
                }

                if (hasCutouts && this._lastGLBitmap && this._lastBitmapPw === pw && this._lastBitmapPh === ph) {
                    if (this.canvas.width !== pw || this.canvas.height !== ph) {
                        this.canvas.width = pw;
                        this.canvas.height = ph;
                    }
                    this._displayCtx.imageSmoothingEnabled = false;
                    this._displayCtx.clearRect(0, 0, pw, ph);
                    this._drawBitmapPixelated(this._displayCtx, this._lastGLBitmap, pw, ph);
                    this._applyCutouts(this._displayCtx, w, h, pw, ph);
                }
                return;
            }

            const oc = this._glOffscreen;
            if (oc.width !== pw || oc.height !== ph) {
                oc.width = pw;
                oc.height = ph;
                this._glState = buildGLState(this._gl);
                if (this._lastGLBitmap) {
                    this._lastGLBitmap.close();
                    this._lastGLBitmap = null;
                }
                this._lastBitmapPw = 0;
                this._lastBitmapPh = 0;
            }
            if (this.canvas.width !== pw || this.canvas.height !== ph) {
                this.canvas.width = pw;
                this.canvas.height = ph;
            }

            if (this._dirty || (this.cameraFollow && isPenguinMod)) {
                this._dirty = false;
                const n = this._fillUBOData(w, h);
                const ambientRGB = this._ambientRGB;

                const gl = this._gl;
                const {
                    prog,
                    vao,
                    u,
                    lightTex
                } = this._glState;

                gl.viewport(0, 0, pw, ph);
                gl.clearColor(0, 0, 0, 0);
                gl.clear(gl.COLOR_BUFFER_BIT);

                if (this.visible) {
                    gl.useProgram(prog);
                    gl.uniform2f(u.res, w, h);
                    gl.uniform3f(u.ambient, ambientRGB[0], ambientRGB[1], ambientRGB[2]);
                    gl.uniform1f(u.opacity, this.bgOpacity);
                    gl.uniform1i(u.nLights, n);
                    gl.uniform1f(u.bloomAmount, this.bloomAmount);
                    gl.uniform1f(u.bloomRadius, this.bloomRadius);
                    gl.uniform1f(u.bloomThreshold, this.bloomThreshold);
                    gl.uniform1f(u.contrast, this.contrast);
                    gl.uniform1f(u.colorTemp, this.colorTemp);

                    if (n > 0) {
                        gl.activeTexture(gl.TEXTURE0);
                        gl.bindTexture(gl.TEXTURE_2D, lightTex);
                        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, 3, n, 0, gl.RGBA, gl.FLOAT, this._uboData);
                        gl.uniform1i(u.lightTex, 0);
                    }

                    gl.bindVertexArray(vao);
                    gl.drawArrays(gl.TRIANGLES, 0, 6);
                }

                if (this._lastGLBitmap) this._lastGLBitmap.close();
                this._lastGLBitmap = oc.transferToImageBitmap();
                this._lastBitmapPw = pw;
                this._lastBitmapPh = ph;
            }

            this._displayCtx.imageSmoothingEnabled = false;
            this._displayCtx.clearRect(0, 0, pw, ph);
            if (this._lastGLBitmap) this._drawBitmapPixelated(this._displayCtx, this._lastGLBitmap, pw, ph);
            this._applyCutouts(this._displayCtx, w, h, pw, ph);
        }

        settingSetShadowOpacity(args) {
            this.shadowOpacity = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.OPACITY)));
            this._saveRenderSettings();
            this._markDirty();
        }

        settingSetBgOpacity(args) {
            this.bgOpacity = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.OPACITY)));
            this._saveRenderSettings();
            this._markDirty();
        }

        settingSetAmbient(args) {
            this.ambient = Scratch.Cast.toString(args.COLOR);
            this._ambientRGB = this.hexToRgb(this.ambient);
            this._saveRenderSettings();
            this._markDirty();
        }

        settingSetBloomAmount(args) {
            this.bloomAmount = Math.max(0, Scratch.Cast.toNumber(args.VALUE));
            this._saveRenderSettings();
            this._markDirty();
        }

        settingSetBloomRadius(args) {
            this.bloomRadius = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.VALUE)));
            this._saveRenderSettings();
            this._markDirty();
        }

        settingSetBloomThreshold(args) {
            this.bloomThreshold = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.VALUE)));
            this._saveRenderSettings();
            this._markDirty();
        }

        settingSetPixelated(args) {
            this.pixelated = (Scratch.Cast.toString(args.STATE) === 'on');
            this._saveRenderSettings();
            this._syncCanvasPosition();
            this._markDirty();
        }

        settingSetPixelSize(args) {
            this.pixelSize = Math.max(1, Math.round(Scratch.Cast.toNumber(args.SIZE)));
            this._saveRenderSettings();
            this._syncCanvasPosition();
            this._markDirty();
        }

        settingSetContrast(args) {
            this.contrast = Math.max(0, Scratch.Cast.toNumber(args.VALUE));
            this._saveRenderSettings();
            this._markDirty();
        }

        settingSetColorTemp(args) {
            this.colorTemp = Math.max(-1, Math.min(1, Scratch.Cast.toNumber(args.VALUE)));
            this._saveRenderSettings();
            this._markDirty();
        }

        settingSetResetLightsOnStart(args) {
            this.resetLightsOnStart = (Scratch.Cast.toString(args.STATE) === 'on');
            this._saveRenderSettings();
        }

        settingResetAll() {
            this.shadowOpacity = RENDER_DEFAULTS.shadowOpacity;
            this.bgOpacity = RENDER_DEFAULTS.bgOpacity;
            this.ambient = RENDER_DEFAULTS.ambient;
            this._ambientRGB = this.hexToRgb(RENDER_DEFAULTS.ambient);
            this.bloomAmount = RENDER_DEFAULTS.bloomAmount;
            this.bloomRadius = RENDER_DEFAULTS.bloomRadius;
            this.bloomThreshold = RENDER_DEFAULTS.bloomThreshold;
            this.pixelated = RENDER_DEFAULTS.pixelated;
            this.pixelSize = RENDER_DEFAULTS.pixelSize;
            this.contrast = RENDER_DEFAULTS.contrast;
            this.colorTemp = RENDER_DEFAULTS.colorTemp;
            this.resetLightsOnStart = RENDER_DEFAULTS.resetLightsOnStart;
            this.cameraFollow = RENDER_DEFAULTS.cameraFollow;
            this.cameraFollowName = RENDER_DEFAULTS.cameraFollowName;
            this.renderThread = RENDER_DEFAULTS.renderThread;
            this._switchRenderThread(this.renderThread);
            this._saveRenderSettings();
            this._markDirty();
        }

        settingGet(args) {
            const key = Scratch.Cast.toString(args.SETTING);
            switch (key) {
                case 'shadowOpacity':
                    return this.shadowOpacity;
                case 'bgOpacity':
                    return this.bgOpacity;
                case 'ambient':
                    return this.ambient;
                case 'bloomAmount':
                    return this.bloomAmount;
                case 'bloomRadius':
                    return this.bloomRadius;
                case 'bloomThreshold':
                    return this.bloomThreshold;
                case 'pixelated':
                    return this.pixelated ? 'on' : 'off';
                case 'pixelSize':
                    return this.pixelSize;
                case 'contrast':
                    return this.contrast;
                case 'colorTemp':
                    return this.colorTemp;
                case 'resetLightsOnStart':
                    return this.resetLightsOnStart ? 'on' : 'off';
                case 'renderThread':
                    return this.renderThread;
                case 'cameraFollow':
                    return this.cameraFollow ? 'on' : 'off';
                case 'cameraFollowName':
                    return this.cameraFollowName;
                default:
                    return '';
            }
        }

        setRenderThread(args) {
            const t = Scratch.Cast.toString(args.THREAD);
            if (t !== 'worker' && t !== 'main') return;
            if (this.renderThread === t) return;
            this.renderThread = t;
            this._switchRenderThread(t);
            this._saveRenderSettings();
        }

        getInfo() {
            return {
                id: 'g1nxLighting',
                name: 'Lighting',
                color1: '#4a5568',
                color2: '#2d3748',
                blocks: [{
                        opcode: 'openRenderSettings',
                        blockType: Scratch.BlockType.BUTTON,
                        hideFromPalette: false,
                        text: 'Render Settings'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Engine'
                    },
                    {
                        opcode: 'glSupported',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'browser supports lighting engine?'
                    },
                    {
                        opcode: 'renderMode',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'render mode'
                    },
                    {
                        opcode: 'toggleLight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: '[STATE] light engine',
                        arguments: {
                            STATE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'stateMenu'
                            }
                        }
                    },
                    {
                        opcode: 'setSpriteExcluded',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [SPRITE] as [STATE] from lighting',
                        arguments: {
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'spriteMenu'
                            },
                            STATE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'excludeMenu'
                            }
                        }
                    },
                    {
                        opcode: 'isSpriteExcluded',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [SPRITE] excluded from lighting?',
                        arguments: {
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'spriteMenu'
                            }
                        }
                    },
                    {
                        opcode: 'spriteTouchingLight',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: '[SPRITE] touching light [LIGHT]?',
                        arguments: {
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'spriteMenu'
                            },
                            LIGHT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            }
                        }
                    },
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Stage Camera extension required:'
                    },
                    {
                        opcode: 'setCameraFollow',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !isPenguinMod,
                        text: 'set camera follow [STATE]',
                        arguments: {
                            STATE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'onOffMenu'
                            }
                        }
                    },
                    {
                        opcode: 'setCameraFollowName',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !isPenguinMod,
                        text: 'set camera to follow [NAME]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'default'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'setLightCameraFollow',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !isPenguinMod,
                        text: 'set light [ID] camera follow [STATE]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            },
                            STATE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'lightCameraFollowMenu'
                            }
                        }
                    },
                    {
                        opcode: 'setLightCameraName',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: !isPenguinMod,
                        text: 'set light [ID] to follow camera [NAME]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'default'
                            }
                        }
                    },
                    {
                        opcode: 'getLightCameraFollow',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: !isPenguinMod,
                        text: 'light [ID] camera follow',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            }
                        }
                    },
                    '---',
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Ambient & Shadow'
                    },
                    {
                        opcode: 'setAmbient',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set ambient light to [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#333333'
                            }
                        }
                    },
                    {
                        opcode: 'setShadowOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set overlay opacity to [OPACITY]%',
                        arguments: {
                            OPACITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 85
                            }
                        }
                    },
                    {
                        opcode: 'setBgOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set background opacity to [OPACITY]%',
                        arguments: {
                            OPACITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Create Lights'
                    },
                    {
                        opcode: 'createPointLight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create point light [ID] at x: [X] y: [Y] radius: [RADIUS] color: [COLOR]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'point1'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            RADIUS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 150
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#ffffff'
                            }
                        }
                    },
                    {
                        opcode: 'createSpotLight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create spot light [ID] at x: [X] y: [Y] direction: [DIRECTION] angle: [ANGLE]\u00b0 radius: [RADIUS] color: [COLOR] softness: [SOFTNESS]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'spot1'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            DIRECTION: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 180
                            },
                            ANGLE: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 40
                            },
                            RADIUS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#ffffff'
                            },
                            SOFTNESS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: 'createAreaLight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create area light [ID] at x: [X] y: [Y] width: [WIDTH] height: [HEIGHT] color: [COLOR] softness: [SOFTNESS]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'area1'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 60
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#ffffff'
                            },
                            SOFTNESS: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 40
                            }
                        }
                    },
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Modify Lights'
                    },
                    {
                        opcode: 'setLightProp',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [PROP] of light [ID] to [VAL]',
                        arguments: {
                            PROP: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'propMenu'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            },
                            VAL: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'changeLightProp',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change [PROP] of light [ID] by [VAL]',
                        arguments: {
                            PROP: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'propMenu'
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            },
                            VAL: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10
                            }
                        }
                    },
                    {
                        opcode: 'setLightXY',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set light [ID] x: [X] y: [Y]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'setLightColor',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set light [ID] color to [COLOR]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            },
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#ff0000'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Read Lights'
                    },
                    {
                        opcode: 'getLightProp',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'light [ID] [PROP]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            },
                            PROP: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'propMenuFull'
                            }
                        }
                    },
                    {
                        opcode: 'lightExists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'light [ID] exists?',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            }
                        }
                    },
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Manage'
                    },
                    {
                        opcode: 'deleteLight',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete light [ID]',
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'light1'
                            }
                        }
                    },
                    {
                        opcode: 'clearLights',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear all lights'
                    },
                    '---',
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Render Settings'
                    },
                    {
                        opcode: 'settingSetShadowOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set overlay opacity to [OPACITY]',
                        arguments: {
                            OPACITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.85
                            }
                        }
                    },
                    {
                        opcode: 'settingSetBgOpacity',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set background opacity to [OPACITY]',
                        arguments: {
                            OPACITY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            }
                        }
                    },
                    {
                        opcode: 'settingSetAmbient',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set ambient color to [COLOR]',
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.COLOR,
                                defaultValue: '#333333'
                            }
                        }
                    },
                    ...(isTurboWarp ? [{
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Bloom'
                    }] : []),
                    {
                        opcode: 'settingSetBloomAmount',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set bloom amount to [VALUE]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            }
                        }
                    },
                    {
                        opcode: 'settingSetBloomRadius',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set bloom radius to [VALUE]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.32
                            }
                        }
                    },
                    {
                        opcode: 'settingSetBloomThreshold',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set bloom threshold to [VALUE]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.0
                            }
                        }
                    },
                    ...(isTurboWarp ? [{
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Pixelation'
                    }] : []),
                    {
                        opcode: 'settingSetPixelated',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'turn pixelated rendering [STATE]',
                        arguments: {
                            STATE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'onOffMenu'
                            }
                        }
                    },
                    {
                        opcode: 'settingSetPixelSize',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set pixel size to [SIZE]',
                        arguments: {
                            SIZE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4
                            }
                        }
                    },
                    ...(isTurboWarp ? [{
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Post Processing'
                    }] : []),
                    {
                        opcode: 'settingSetContrast',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set contrast to [VALUE]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1.0
                            }
                        }
                    },
                    {
                        opcode: 'settingSetColorTemp',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set color temperature to [VALUE]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.0
                            }
                        }
                    },
                    {
                        opcode: 'settingSetResetLightsOnStart',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'set reset lights on project start [STATE]',
                        arguments: {
                            STATE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'onOffMenu'
                            }
                        }
                    },
                    {
                        opcode: 'setRenderThread',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set render thread to [THREAD]',
                        arguments: {
                            THREAD: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'renderThreadMenu'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'settingGet',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: false,
                        text: 'get setting [SETTING]',
                        arguments: {
                            SETTING: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'settingMenu'
                            }
                        }
                    },
                    {
                        opcode: 'settingResetAll',
                        blockType: Scratch.BlockType.COMMAND,
                        hideFromPalette: false,
                        text: 'reset all render settings to defaults'
                    },
                ],
                menus: {
                    stateMenu: {
                        acceptReporters: false,
                        items: ['show', 'hide']
                    },
                    excludeMenu: {
                        acceptReporters: false,
                        items: ['excluded', 'included']
                    },
                    spriteMenu: {
                        acceptReporters: true,
                        items: '_getSpriteMenuItems'
                    },
                    propMenu: {
                        acceptReporters: false,
                        items: ['x', 'y', 'radius', 'width', 'height', 'direction', 'arc', 'softness']
                    },
                    propMenuFull: {
                        acceptReporters: false,
                        items: ['x', 'y', 'radius', 'width', 'height', 'direction', 'arc', 'softness', 'color', 'type']
                    },
                    onOffMenu: {
                        acceptReporters: false,
                        items: ['on', 'off']
                    },
                    lightCameraFollowMenu: {
                        acceptReporters: false,
                        items: ['global', 'none', 'custom']
                    },
                    settingMenu: {
                        acceptReporters: false,
                        items: ['shadowOpacity', 'bgOpacity', 'ambient', 'bloomAmount', 'bloomRadius', 'bloomThreshold', 'pixelated', 'pixelSize', 'contrast', 'colorTemp', 'resetLightsOnStart', 'renderThread', 'cameraFollow', 'cameraFollowName']
                    },
                    renderThreadMenu: {
                        acceptReporters: false,
                        items: ['worker', 'main']
                    },
                }
            };
        }

        glSupported() {
            return this._mode !== 'none';
        }
        renderMode() {
            return this._mode;
        }

        setAmbient(args) {
            this.ambient = Scratch.Cast.toString(args.COLOR);
            this._ambientRGB = this.hexToRgb(this.ambient);
            this._markDirty();
        }

        setShadowOpacity(args) {
            this.shadowOpacity = Math.max(0, Math.min(100, Scratch.Cast.toNumber(args.OPACITY))) / 100;
            this._markDirty();
        }

        setBgOpacity(args) {
            this.bgOpacity = Math.max(0, Math.min(100, Scratch.Cast.toNumber(args.OPACITY))) / 100;
            this._markDirty();
        }

        _cacheRGB(li, hex) {
            [li.cr, li.cg, li.cb] = this.hexToRgb(hex || '#ffffff');
        }

        createPointLight(args) {
            const id = Scratch.Cast.toString(args.ID);
            const li = {
                type: 'point',
                ltype: 0,
                x: +args.X,
                y: +args.Y,
                color: Scratch.Cast.toString(args.COLOR),
                radius: +args.RADIUS,
                width: 0,
                height: 0,
                direction: 0,
                arc: 360,
                softness: 0
            };
            this._cacheRGB(li, li.color);
            this.lights[id] = li;
            this._markDirty();
        }

        createSpotLight(args) {
            const id = Scratch.Cast.toString(args.ID);
            const li = {
                type: 'spot',
                ltype: 1,
                x: +args.X,
                y: +args.Y,
                color: Scratch.Cast.toString(args.COLOR),
                radius: +args.RADIUS,
                direction: +args.DIRECTION,
                arc: +args.ANGLE,
                softness: +args.SOFTNESS * (Math.PI / 180),
                width: 0,
                height: 0
            };
            this._cacheRGB(li, li.color);
            this.lights[id] = li;
            this._markDirty();
        }

        createAreaLight(args) {
            const id = Scratch.Cast.toString(args.ID);
            const li = {
                type: 'area',
                ltype: 2,
                x: +args.X,
                y: +args.Y,
                color: Scratch.Cast.toString(args.COLOR),
                width: +args.WIDTH,
                height: +args.HEIGHT,
                softness: +args.SOFTNESS,
                radius: 0,
                direction: 0,
                arc: 360
            };
            this._cacheRGB(li, li.color);
            this.lights[id] = li;
            this._markDirty();
        }

        setLightProp(args) {
            const id = Scratch.Cast.toString(args.ID);
            const prop = Scratch.Cast.toString(args.PROP);
            if (this.lights[id]) {
                this.lights[id][prop] = Scratch.Cast.toNumber(args.VAL);
                this._markDirty();
            }
        }

        changeLightProp(args) {
            const id = Scratch.Cast.toString(args.ID);
            const prop = Scratch.Cast.toString(args.PROP);
            if (this.lights[id]) {
                this.lights[id][prop] += Scratch.Cast.toNumber(args.VAL);
                this._markDirty();
            }
        }

        setLightXY(args) {
            const id = Scratch.Cast.toString(args.ID);
            if (this.lights[id]) {
                this.lights[id].x = +args.X;
                this.lights[id].y = +args.Y;
                this._markDirty();
            }
        }

        setLightColor(args) {
            const id = Scratch.Cast.toString(args.ID);
            if (this.lights[id]) {
                this.lights[id].color = Scratch.Cast.toString(args.COLOR);
                this._cacheRGB(this.lights[id], this.lights[id].color);
                this._markDirty();
            }
        }

        getLightProp(args) {
            const id = Scratch.Cast.toString(args.ID);
            const prop = Scratch.Cast.toString(args.PROP);
            return this.lights[id] ? (this.lights[id][prop] ?? '') : '';
        }

        lightExists(args) {
            return !!this.lights[Scratch.Cast.toString(args.ID)];
        }

        deleteLight(args) {
            delete this.lights[Scratch.Cast.toString(args.ID)];
            this._markDirty();
        }

        clearLights() {
            this.lights = {};
            this._markDirty();
        }

        toggleLight(args) {
            this.visible = (args.STATE === 'show');
            this._markDirty();
        }
    }

    Scratch.extensions.register(new LightExtension());
})(Scratch);
