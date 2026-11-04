// Name: iCastRays
// ID: mubiraycast
// Description: Cast rays into other sprites
// License: MIT

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('iCastRays must run unsandboxed');
  }

  const { BlockType, ArgumentType, Cast } = Scratch;
  const vm = Scratch.vm;
  const runtime = vm.runtime;
  const isPm = Scratch.extensions.isPenguinMod;

  const menuIconURI =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNDUuMzU4IiBoZWlnaHQ9IjE0NS4zNTgiIHZpZXdCb3g9IjAgMCAxNDUuMzU4IDE0NS4zNTgiPjxjaXJjbGUgY3g9IjcyLjY3OSIgY3k9IjcyLjY3OSIgcj0iNzIuNjc5IiBmaWxsPSIjM2YxYTc4Ii8+PGNpcmNsZSBjeD0iNzIuNjc5IiBjeT0iNzIuNjc5IiByPSI2My42MzgiIGZpbGw9IiM5YjVjZmYiLz48ZyBzdHJva2U9IiMzZjFhNzgiIHN0cm9rZS1saW5lam9pbj0icm91bmQiIHN0cm9rZS13aWR0aD0iMS44IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3Mi42NzkgNzYpIHNjYWxlKDEuOCkiPjxlbGxpcHNlIGN5PSIxMiIgcng9IjI3IiByeT0iNyIgZmlsbD0iI2ZmZiIvPjxwYXRoIGQ9Ik0tMTcgMTFDLTE2LTItOS0xOCAxLTI3YzUtMyAxMC0xIDExIDQtMy0xLTUgMS00IDUgMSAxMCA1IDIxIDkgMjl6IiBmaWxsPSIjZmZmIiBzdHJva2U9Im5vbmUiLz48cGF0aCBkPSJNLTE3IDExQy0xNi0yLTktMTggMS0yN2M1LTMgMTAtMSAxMSA0LTMtMS01IDEtNCA1IDEgMTAgNSAyMSA5IDI5IiBmaWxsPSJub25lIi8+PC9nPjwvc3ZnPg==';

  const blockIconURI =
    'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI1MiIgdmlld0JveD0iLTMwIC0zMCA2MCA1MiI+PGcgc3Ryb2tlPSIjM2YxYTc4IiBzdHJva2UtbGluZWpvaW49InJvdW5kIiBzdHJva2Utd2lkdGg9IjIuNCI+PGVsbGlwc2UgY3k9IjEyIiByeD0iMjciIHJ5PSI3IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTS0xNyAxMUMtMTYtMi05LTE4IDEtMjdjNS0zIDEwLTEgMTEgNC0zLTEtNSAxLTQgNSAxIDEwIDUgMjEgOSAyOXoiIGZpbGw9IiNmZmYiIHN0cm9rZT0ibm9uZSIvPjxwYXRoIGQ9Ik0tMTcgMTFDLTE2LTItOS0xOCAxLTI3YzUtMyAxMC0xIDExIDQtMy0xLTUgMS00IDUgMSAxMCA1IDIxIDkgMjkiIGZpbGw9Im5vbmUiLz48L2c+PC9zdmc+';

  const DEG = Math.PI / 180;
  const EPS = 1e-9;
  const MAX_LENGTH = 1e6;
  const ANY = '__any__';
  const OTHERS = '__others__';

  let stepSize = 1;
  let warnedNoContent = false;

  const num = (v) => {
    const n = Cast.toNumber(v);
    return Number.isFinite(n) ? n : 0;
  };

  const wrapAngle = (a) => {
    const w = ((((a + 180) % 360) + 360) % 360) - 180;
    return w === -180 ? 180 : w;
  };

  const missResult = (ox, oy, dx, dy, len) => ({
    hit: false,
    distance: len,
    x: ox + dx * len,
    y: oy + dy * len,
    sprite: '',
    normal: 0
  });

  const targetKey = (target) => (target && target.id !== undefined ? target.id : target);

  // TODO: make this be an option/setting
  const cappedSet = (map, key, value, capacity) => {
    if (!map.has(key) && map.size >= capacity) {
      const oldest = map.keys().next().value;
      map.delete(oldest);
    }
    map.set(key, value);
  };

  const lastMap = new Map();
  const radialMap = new Map();

  const sensorKey = (target, tag) => `${targetKey(target)}::${Cast.toString(tag || '')}`;

  let debugEnabled = false;
  let debugRays = [];
  const RAY_LIFETIME_MS = 150;
  const DOT_HALF = 4;
  const SUPERSAMPLE = 2;

  let debugCanvas = null;
  let debugCtx = null;
  let debugSkinId = null;
  let debugDrawableId = null;
  let debugStageW = 0;
  let debugStageH = 0;
  let debugRaf = null;
  let warnedNoDebug = false;

  const getStageSize = () => ({
    w: (runtime.stageWidth || 480),
    h: (runtime.stageHeight || 360)
  });

  const toCanvas = (w, h, x, y) => [w / 2 + x, h / 2 - y];

  const destroyDebugDrawable = () => {
    const renderer = runtime.renderer;
    if (renderer) {
      try {
        if (debugDrawableId !== null) renderer.destroyDrawable(debugDrawableId, 'sprite');
      } catch (e) {}
      try {
        if (debugSkinId !== null) renderer.destroySkin(debugSkinId);
      } catch (e) {}
    }
    debugDrawableId = null;
    debugSkinId = null;
    debugCanvas = null;
    debugCtx = null;
  };

  const ensureDebugDrawable = () => {
    const renderer = runtime.renderer;
    if (!renderer || typeof renderer.createDrawable !== 'function') return false;

    const { w, h } = getStageSize();
    if (debugDrawableId !== null && w === debugStageW && h === debugStageH) return true;
    if (debugDrawableId !== null) destroyDebugDrawable();

    debugStageW = w;
    debugStageH = h;
    debugCanvas = document.createElement('canvas');
    debugCanvas.width = w * SUPERSAMPLE;
    debugCanvas.height = h * SUPERSAMPLE;
    debugCtx = debugCanvas.getContext('2d');
    debugCtx.scale(SUPERSAMPLE, SUPERSAMPLE);

    debugSkinId = renderer.createBitmapSkin(debugCanvas, SUPERSAMPLE);
    debugDrawableId = renderer.createDrawable('sprite');
    renderer.updateDrawableSkinId(debugDrawableId, debugSkinId);
    renderer.updateDrawablePosition(debugDrawableId, [0, 0]);
    renderer.updateDrawableDirectionScale(debugDrawableId, 90, [100, 100]);
    if (typeof renderer.updateDrawableVisible === 'function') {
      renderer.updateDrawableVisible(debugDrawableId, true);
    }
    if (typeof renderer.setDrawableOrder === 'function') {
      renderer.setDrawableOrder(debugDrawableId, Infinity, 'sprite');
    }
    return true;
  };

  const uploadDebugTexture = () => {
    const renderer = runtime.renderer;
    const skin = renderer._allSkins && renderer._allSkins[debugSkinId];
    if (skin && skin._texture && renderer.gl) {
      const gl = renderer.gl;
      gl.bindTexture(gl.TEXTURE_2D, skin._texture);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, debugCanvas);
    } else if (typeof renderer.updateBitmapSkin === 'function') {
      renderer.updateBitmapSkin(debugSkinId, debugCanvas, SUPERSAMPLE);
    } else {
      return false;
    }
    renderer.dirty = true;
    runtime.requestRedraw();
    return true;
  };

  const drawDebugFrame = () => {
    if (!debugEnabled) {
      debugRaf = null;
      return;
    }
    if (!ensureDebugDrawable()) {
      if (!warnedNoDebug) {
        warnedNoDebug = true;
        console.warn('[iCastRays] Renderer is not okay...');
      }
      debugRaf = requestAnimationFrame(drawDebugFrame);
      return;
    }

    const { w, h } = getStageSize();
    debugCtx.clearRect(0, 0, w, h);

    const now = performance.now();
    debugRays = debugRays.filter((r) => r.expire > now);

    for (const r of debugRays) {
      const [ox, oy] = toCanvas(w, h, r.ox, r.oy);
      const [ex, ey] = toCanvas(w, h, r.x, r.y);
      const alpha = Math.max(0, Math.min(1, (r.expire - now) / RAY_LIFETIME_MS));

      debugCtx.save();
      debugCtx.globalAlpha = alpha;

      debugCtx.strokeStyle = r.hit ? '#ff3b3b' : '#3bd6ff';
      debugCtx.lineWidth = 2;

      debugCtx.setLineDash(r.hit ? [] : [6, 4]);
      debugCtx.beginPath();
      debugCtx.moveTo(ox, oy);
      debugCtx.lineTo(ex, ey);
      debugCtx.stroke();

      if (r.hit) {
        debugCtx.fillStyle = '#ff3b3b';
        debugCtx.beginPath();
        debugCtx.arc(ex, ey, DOT_HALF, 0, Math.PI * 2);
        debugCtx.fill();
      }

      debugCtx.fillStyle = '#ffd93b';
      debugCtx.beginPath();
      debugCtx.arc(ox, oy, DOT_HALF, 0, Math.PI * 2);
      debugCtx.fill();

      debugCtx.restore();
    }

    uploadDebugTexture();
    debugRaf = requestAnimationFrame(drawDebugFrame);
  };

  let debugSeen = false;

  const shouldShowDebugWarning = () => !!Scratch.gui && !!isPm;

  const showDebugWarningModal = async () => {
    try {
      const ScratchBlocks = await Scratch.gui.getBlockly();
      if (!ScratchBlocks || typeof ScratchBlocks.customPrompt !== 'function') return;

      const modal = await ScratchBlocks.customPrompt(
        { title: 'Warning' },
        { content: { width: '400px' } },
        [{ name: 'OK', role: 'ok', callback: () => {} }]
      );

      const text = document.createElement('p');
      text.textContent = 'The Debug Mode feature has performance issues, use it only while debugging.';
      text.style.cssText = 'margin:0;line-height:1.4;';
      modal.appendChild(text);
    } catch (e) {
      console.warn('[iCastRays] Could not show debug warning modal', e);
    }
  };

  const setDebugMode = (on) => {
    debugEnabled = on;
    if (on) {
      if (!debugSeen) {
        debugSeen = true;
        if (shouldShowDebugWarning()) showDebugWarningModal();
      }
      if (!debugRaf) debugRaf = requestAnimationFrame(drawDebugFrame);
    } else {
      debugRays = [];
      destroyDebugDrawable();
    }
  };

  const recordDebugRay = (ox, oy, dx, dy, result) => {
    if (!debugEnabled) return;
    debugRays.push({
      ox,
      oy,
      x: result.x,
      y: result.y,
      hit: result.hit,
      expire: performance.now() + RAY_LIFETIME_MS
    });
    if (debugRays.length > 300) debugRays.shift();
  };

  const intersectBox = (ox, oy, dx, dy, left, right, bottom, top, maxT) => {
    let tmin = 0;
    let tmax = maxT;
    let nx = 0;
    let ny = 0;

    if (Math.abs(dx) < EPS) {
      if (ox < left || ox > right) return null;
    } else {
      let t1 = (left - ox) / dx;
      let t2 = (right - ox) / dx;
      let n = -1;
      if (t1 > t2) {
        const s = t1;
        t1 = t2;
        t2 = s;
        n = 1;
      }
      if (t1 > tmin) {
        tmin = t1;
        nx = n;
        ny = 0;
      }
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) return null;
    }

    if (Math.abs(dy) < EPS) {
      if (oy < bottom || oy > top) return null;
    } else {
      let t1 = (bottom - oy) / dy;
      let t2 = (top - oy) / dy;
      let n = -1;
      if (t1 > t2) {
        const s = t1;
        t1 = t2;
        t2 = s;
        n = 1;
      }
      if (t1 > tmin) {
        tmin = t1;
        nx = 0;
        ny = n;
      }
      if (t2 < tmax) tmax = t2;
      if (tmin > tmax) return null;
    }

    if (nx === 0 && ny === 0) {
      nx = -dx;
      ny = -dy;
    }
    return { tmin, tmax, nx, ny };
  };

  const getDrawable = (target) => {
    const renderer = runtime.renderer;
    return renderer && renderer._allDrawables
      ? renderer._allDrawables[target.drawableID]
      : null;
  };

  const getBounds = (target) => {
    const b = target.getBounds();
    if (!b) return null;
    return {
      left: b.left,
      right: b.right,
      bottom: Math.min(b.bottom, b.top),
      top: Math.max(b.bottom, b.top)
    };
  };

  const castHitbox = (bounds, ox, oy, dx, dy, maxT) => {
    const seg = intersectBox(
      ox, oy, dx, dy,
      bounds.left, bounds.right, bounds.bottom, bounds.top,
      maxT
    );
    return seg ? { t: seg.tmin, nx: seg.nx, ny: seg.ny } : null;
  };

  const castContent = (target, bounds, ox, oy, dx, dy, maxT) => {
    const seg = intersectBox(
      ox, oy, dx, dy,
      bounds.left - 1, bounds.right + 1, bounds.bottom - 1, bounds.top + 1,
      maxT
    );
    if (!seg) return null;

    const drawable = getDrawable(target);
    if (!drawable || typeof drawable.isTouching !== 'function') return undefined;
    if (typeof drawable.updateCPURenderAttributes === 'function') {
      drawable.updateCPURenderAttributes();
    }

    const point = [0, 0, 0];
    const touching = (x, y) => {
      point[0] = x;
      point[1] = y;
      return !!drawable.isTouching(point);
    };

    const step = Math.max(0.05, stepSize);
    let t = seg.tmin;
    let prevMiss = null;
    let found = null;
    for (;;) {
      if (touching(ox + dx * t, oy + dy * t)) {
        found = t;
        break;
      }
      prevMiss = t;
      if (t >= seg.tmax) break;
      t = Math.min(t + step, seg.tmax);
    }
    if (found === null) return null;

    if (prevMiss !== null) {
      let lo = prevMiss;
      let hi = found;
      for (let i = 0; i < 8; i++) {
        const mid = (lo + hi) / 2;
        if (touching(ox + dx * mid, oy + dy * mid)) hi = mid;
        else lo = mid;
      }
      found = hi;
    }

    const hx = ox + dx * found;
    const hy = oy + dy * found;
    let sx = 0;
    let sy = 0;
    for (const r of [2, 4]) {
      for (let i = 0; i < 16; i++) {
        const a = (i / 16) * 2 * Math.PI;
        const cx = Math.cos(a);
        const cy = Math.sin(a);
        if (!touching(hx + cx * r, hy + cy * r)) {
          sx += cx;
          sy += cy;
        }
      }
    }
    if (Math.hypot(sx, sy) < 1e-6) {
      sx = -dx;
      sy = -dy;
    }
    return { t: found, nx: sx, ny: sy };
  };

  const getCandidates = (caller, targetArg) => {
    const out = [];
    for (const t of runtime.targets) {
      if (t.isStage || !t.visible) continue;
      if (typeof t.drawableID !== 'number') continue;
      if (t.effects && t.effects.ghost >= 100) continue;
      if (targetArg === ANY) {
        out.push(t);
      } else if (targetArg === OTHERS) {
        if (t !== caller) out.push(t);
      } else if (t.getName() === targetArg) {
        out.push(t);
      }
    }
    return out;
  };

  const raycast = (caller, ox, oy, dir, len, targetArg, mode) => {
    const rad = dir * DEG;
    const dx = Math.sin(rad);
    const dy = Math.cos(rad);

    let best = null;
    for (const target of getCandidates(caller, targetArg)) {
      const bounds = getBounds(target);
      if (!bounds) continue;
      const limit = best ? best.t : len;

      let h = null;
      if (mode === 'content') {
        h = castContent(target, bounds, ox, oy, dx, dy, limit);
        if (h === undefined) {
          if (!warnedNoContent) {
            warnedNoContent = true;
            console.warn('[iCastRays] Content test mode is unavailable, falling back to hitbox.');
          }
          h = castHitbox(bounds, ox, oy, dx, dy, limit);
        }
      } else {
        h = castHitbox(bounds, ox, oy, dx, dy, limit);
      }
      if (h && (!best || h.t < best.t)) {
        best = h;
        best.target = target;
      }
    }

    const result = best
      ? {
          hit: true,
          distance: best.t,
          x: ox + dx * best.t,
          y: oy + dy * best.t,
          sprite: best.target.getName(),
          normal: wrapAngle(Math.atan2(best.nx, best.ny) / DEG)
        }
      : missResult(ox, oy, dx, dy, len);

    recordDebugRay(ox, oy, dx, dy, result);
    return result;
  };

  const runRay = (args, util) => {
    const ox = num(args.X);
    const oy = num(args.Y);
    const dir = num(args.DIR);
    const len = Math.min(MAX_LENGTH, Math.max(0, num(args.LEN)));
    const mode = Cast.toString(args.MODE).toLowerCase() === 'content' ? 'content' : 'hitbox';
    return raycast(util.target, ox, oy, dir, len, Cast.toString(args.TARGET), mode);
  };

  const MAX_RADIAL_RAYS = 512;

  const runRadial = (args, util) => {
    const ox = num(args.X);
    const oy = num(args.Y);
    const count = Math.max(1, Math.min(MAX_RADIAL_RAYS, Math.round(num(args.COUNT)) || 1));
    const start = num(args.START);
    const spread = num(args.SPREAD);
    const len = Math.min(MAX_LENGTH, Math.max(0, num(args.LEN)));
    const mode = Cast.toString(args.MODE).toLowerCase() === 'content' ? 'content' : 'hitbox';
    const targetArg = Cast.toString(args.TARGET);

    const results = [];
    for (let i = 0; i < count; i++) {
      let dir;
      if (count === 1) {
        dir = start;
      } else if (Math.abs(spread) >= 360) {
        dir = start + (360 / count) * i;
      } else {
        dir = start - spread / 2 + (spread / (count - 1)) * i;
      }
      const r = raycast(util.target, ox, oy, dir, len, targetArg, mode);
      results.push({ dir: wrapAngle(dir), ...r });
    }
    return results;
  };

  const closestRadialHit = (arr) => {
    let best = null;
    let bestIdx = -1;
    for (let i = 0; i < arr.length; i++) {
      const r = arr[i];
      if (r.hit && (!best || r.distance < best.distance)) {
        best = r;
        bestIdx = i;
      }
    }
    return best ? { index: bestIdx + 1, ...best } : null;
  };

  const rayArgs = {
    X: { type: ArgumentType.NUMBER, defaultValue: 0 },
    Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
    DIR: { type: ArgumentType.NUMBER, defaultValue: 90 },
    LEN: { type: ArgumentType.NUMBER, defaultValue: 480 },
    TARGET: { type: ArgumentType.STRING, menu: 'targetMenu', defaultValue: OTHERS },
    MODE: { type: ArgumentType.STRING, menu: 'modeMenu', defaultValue: 'hitbox' }
  };

  const groupArg = { GROUP: { type: ArgumentType.STRING, defaultValue: '' } };

  class ICastRays {
    getInfo() {
      return {
        id: 'mubiraycast',
        name: 'iCastRays',
        docsURI: "https://extensions.penguinmod.com/docs/ICastRays",
        color1: '#6230b8',
        color2: '#4c2094',
        color3: '#3f1a78',
        blockIconURI,
        menuIconURI,
        blocks: [
          {
            opcode: 'cast',
            blockType: BlockType.COMMAND,
            text: 'cast ray from x: [X] y: [Y] direction: [DIR] length: [LEN] at [TARGET] using [MODE]',
            arguments: rayArgs
          },
          {
            opcode: 'didHit',
            blockType: BlockType.BOOLEAN,
            text: 'ray hit something?'
          },
          {
            opcode: 'getResult',
            blockType: BlockType.REPORTER,
            text: 'ray [WHAT]',
            arguments: {
              WHAT: { type: ArgumentType.STRING, menu: 'resultMenu', defaultValue: 'distance' }
            }
          },
          {
            opcode: 'distanceTo',
            blockType: BlockType.REPORTER,
            text: 'ray distance from x: [X] y: [Y] direction: [DIR] length: [LEN] at [TARGET] using [MODE]',
            arguments: rayArgs
          },
          {
            opcode: 'doWeNeedAOpcode',
            blockType: BlockType.LABEL,
            text: 'Radial'
          },
          {
            opcode: 'castRadial',
            blockType: BlockType.COMMAND,
            text: 'cast [COUNT] rays from x: [X] y: [Y] center direction: [START] spread: [SPREAD] length: [LEN] at [TARGET] using [MODE] as sensor [GROUP]',
            arguments: {
              X: { type: ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: ArgumentType.NUMBER, defaultValue: 0 },
              COUNT: { type: ArgumentType.NUMBER, defaultValue: 8 },
              START: { type: ArgumentType.NUMBER, defaultValue: 0 },
              SPREAD: { type: ArgumentType.NUMBER, defaultValue: 360 },
              LEN: { type: ArgumentType.NUMBER, defaultValue: 480 },
              TARGET: { type: ArgumentType.STRING, menu: 'targetMenu', defaultValue: OTHERS },
              MODE: { type: ArgumentType.STRING, menu: 'modeMenu', defaultValue: 'hitbox' },
              GROUP: { type: ArgumentType.STRING, defaultValue: '' }
            }
          },
          {
            opcode: 'radialCount',
            blockType: BlockType.REPORTER,
            text: 'radial ray count (sensor [GROUP])',
            arguments: groupArg
          },
          {
            opcode: 'getRadial',
            blockType: BlockType.REPORTER,
            text: 'radial ray [INDEX] [WHAT] (sensor [GROUP])',
            arguments: {
              INDEX: { type: ArgumentType.NUMBER, defaultValue: 1 },
              WHAT: { type: ArgumentType.STRING, menu: 'radialWhatMenu', defaultValue: 'distance' },
              GROUP: { type: ArgumentType.STRING, defaultValue: '' }
            }
          },
          {
            opcode: 'radialHit',
            blockType: BlockType.BOOLEAN,
            text: 'radial ray [INDEX] hit? (sensor [GROUP])',
            arguments: {
              INDEX: { type: ArgumentType.NUMBER, defaultValue: 1 },
              GROUP: { type: ArgumentType.STRING, defaultValue: '' }
            }
          },
          {
            opcode: 'anyRadialHit',
            blockType: BlockType.BOOLEAN,
            text: 'any radial ray hit? (sensor [GROUP])',
            arguments: groupArg
          },
          {
            opcode: 'closestRadial',
            blockType: BlockType.REPORTER,
            text: 'closest radial hit [WHAT] (sensor [GROUP])',
            arguments: {
              WHAT: { type: ArgumentType.STRING, menu: 'closestWhatMenu', defaultValue: 'distance' },
              GROUP: { type: ArgumentType.STRING, defaultValue: '' }
            }
          },
          {
            opcode: 'getAllSensors',
            blockType: BlockType.REPORTER,
            blockShape: Scratch.BlockShape.SQUARE,
            text: 'get all sensors'
          },
          {
            opcode: 'doWeNeedAOpcode',
            blockType: BlockType.LABEL,
            text: 'Additional/Debug'
          },
          {
            opcode: 'setStep',
            blockType: BlockType.COMMAND,
            text: 'set content ray step to [STEP] px',
            arguments: {
              STEP: { type: ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'setDebug',
            blockType: BlockType.COMMAND,
            text: 'set raycast debug mode [STATE]',
            arguments: {
              STATE: { type: ArgumentType.STRING, menu: 'onOffMenu', defaultValue: 'off' }
            }
          },
          {
            opcode: 'isDebug',
            blockType: BlockType.BOOLEAN,
            text: 'raycast debug mode on?'
          }
        ],
        menus: {
          targetMenu: { acceptReporters: true, items: 'getTargetMenu' },
          modeMenu: {
            acceptReporters: true,
            items: [
              { text: 'hitbox', value: 'hitbox' },
              { text: 'content (pixels)', value: 'content' }
            ]
          },
          onOffMenu: {
            acceptReporters: true,
            items: [
              { text: 'on', value: 'on' },
              { text: 'off', value: 'off' }
            ]
          },
          resultMenu: {
            acceptReporters: false,
            items: [
              { text: 'distance', value: 'distance' },
              { text: 'hit x', value: 'x' },
              { text: 'hit y', value: 'y' },
              { text: 'hit sprite', value: 'sprite' },
              { text: 'hit normal direction', value: 'normal' }
            ]
          },
          radialWhatMenu: {
            acceptReporters: false,
            items: [
              { text: 'distance', value: 'distance' },
              { text: 'hit x', value: 'x' },
              { text: 'hit y', value: 'y' },
              { text: 'hit sprite', value: 'sprite' },
              { text: 'hit normal direction', value: 'normal' },
              { text: 'ray direction', value: 'dir' }
            ]
          },
          closestWhatMenu: {
            acceptReporters: false,
            items: [
              { text: 'index', value: 'index' },
              { text: 'distance', value: 'distance' },
              { text: 'x', value: 'x' },
              { text: 'y', value: 'y' },
              { text: 'sprite', value: 'sprite' },
              { text: 'hit normal direction', value: 'normal' },
              { text: 'ray direction', value: 'dir' }
            ]
          }
        }
      };
    }

    getTargetMenu() {
      const items = [
        { text: 'any sprite except this one', value: OTHERS },
        { text: 'any sprite', value: ANY }
      ];
      for (const t of runtime.targets) {
        if (t.isOriginal && !t.isStage) {
          items.push({ text: t.getName(), value: t.getName() });
        }
      }
      return items;
    }

    cast(args, util) {
      cappedSet(lastMap, sensorKey(util.target, ''), runRay(args, util), 512);
    }

    distanceTo(args, util) {
      const r = runRay(args, util);
      cappedSet(lastMap, sensorKey(util.target, ''), r, 512);
      return r.distance;
    }

    didHit(args, util) {
      const r = lastMap.get(sensorKey(util.target, ''));
      return !!(r && r.hit);
    }

    getResult(args, util) {
      const r = lastMap.get(sensorKey(util.target, '')) || missResult(0, 0, 0, 1, 0);
      switch (Cast.toString(args.WHAT)) {
        case 'distance': return r.distance;
        case 'x': return r.x;
        case 'y': return r.y;
        case 'sprite': return r.sprite;
        case 'normal': return r.normal;
        default: return '';
      }
    }

    castRadial(args, util) {
      const key = sensorKey(util.target, args.GROUP);
      cappedSet(radialMap, key, runRadial(args, util), 256);
    }

    radialCount(args, util) {
      const arr = radialMap.get(sensorKey(util.target, args.GROUP));
      return arr ? arr.length : 0;
    }

    getRadial(args, util) {
      const arr = radialMap.get(sensorKey(util.target, args.GROUP));
      const r = arr && arr[Math.round(num(args.INDEX)) - 1];
      if (!r) return Cast.toString(args.WHAT) === 'sprite' ? '' : 0;
      switch (Cast.toString(args.WHAT)) {
        case 'distance': return r.distance;
        case 'x': return r.x;
        case 'y': return r.y;
        case 'sprite': return r.sprite;
        case 'normal': return r.normal;
        case 'dir': return r.dir;
        default: return '';
      }
    }

    radialHit(args, util) {
      const arr = radialMap.get(sensorKey(util.target, args.GROUP));
      const r = arr && arr[Math.round(num(args.INDEX)) - 1];
      return !!(r && r.hit);
    }

    anyRadialHit(args, util) {
      const arr = radialMap.get(sensorKey(util.target, args.GROUP));
      return !!(arr && arr.some((r) => r.hit));
    }

    closestRadial(args, util) {
      const arr = radialMap.get(sensorKey(util.target, args.GROUP)) || [];
      const c = closestRadialHit(arr);
      const what = Cast.toString(args.WHAT);
      if (!c) return what === 'sprite' ? '' : 0;
      switch (what) {
        case 'index': return c.index;
        case 'distance': return c.distance;
        case 'x': return c.x;
        case 'y': return c.y;
        case 'sprite': return c.sprite;
        case 'normal': return c.normal;
        case 'dir': return c.dir;
        default: return '';
      }
    }

    getAllSensors(args, util) {
      const prefix = `${targetKey(util.target)}::`;
      const sensors = [];

      for (const key of radialMap.keys()) {
        if (key.startsWith(prefix)) {
          sensors.push(key.slice(prefix.length));
        }
      }

      return sensors;
    }

    setStep(args) {
      stepSize = Math.min(20, Math.max(0.1, num(args.STEP) || 1));
    }

    setDebug(args) {
      setDebugMode(Cast.toString(args.STATE).toLowerCase() === 'on');
    }

    isDebug() {
      return debugEnabled;
    }
  }

  Scratch.extensions.register(new ICastRays());
})(Scratch);
