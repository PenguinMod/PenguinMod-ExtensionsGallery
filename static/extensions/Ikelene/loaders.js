// Name: Animated Loaders
// ID: ikeleneAnimatedLoaders
// Description: Create and display modern CSS loading spinners on the stage.
// By: Ikelene
// License: MIT

(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Animated Loaders must run unsandboxed (DOM access is required).");
  }

  const EXT_ID = "ikeleneAnimatedLoaders";
  const STYLE_TAG_ID = "pma-animated-loaders-stylesheet";
  const DEFAULT_STAGE_W = 480;
  const DEFAULT_STAGE_H = 360;

  // presets scale off wrapper font-size (em units) and read --pma-color / --pma-speed
  const BASE_CSS = `
.pma-loader-wrapper {
  position: absolute;
  transform: translate(-50%, -50%);
  pointer-events: none;
  will-change: left, top, font-size;
}
.pma-loader-wrapper * { box-sizing: border-box; }

@keyframes pma-spin { to { transform: rotate(360deg); } }
@keyframes pma-spin-rev { to { transform: rotate(-360deg); } }

.pma-ring {
  width: 1em; height: 1em; border-radius: 50%;
  border: 0.12em solid rgba(255,255,255,0.18);
  border-top-color: var(--pma-color);
  animation: pma-spin calc(0.9s / var(--pma-speed)) linear infinite;
}

.pma-dualring { position: relative; width: 1em; height: 1em; }
.pma-dualring i { position: absolute; inset: 0; border-radius: 50%; border: 0.09em solid transparent; }
.pma-dualring i:nth-child(1) {
  border-top-color: var(--pma-color);
  animation: pma-spin calc(1s / var(--pma-speed)) linear infinite;
}
.pma-dualring i:nth-child(2) {
  border-bottom-color: var(--pma-color);
  opacity: 0.45;
  animation: pma-spin-rev calc(1.4s / var(--pma-speed)) linear infinite;
}

.pma-gradient {
  width: 1em; height: 1em; border-radius: 50%;
  background: conic-gradient(from 0deg, transparent 0%, var(--pma-color) 100%);
  -webkit-mask: radial-gradient(farthest-side, transparent calc(100% - 0.13em), #000 calc(100% - 0.13em));
  mask: radial-gradient(farthest-side, transparent calc(100% - 0.13em), #000 calc(100% - 0.13em));
  animation: pma-spin calc(0.8s / var(--pma-speed)) linear infinite;
}

.pma-dots { display: flex; align-items: flex-end; justify-content: center; gap: 0.16em; width: 1em; height: 1em; }
.pma-dots span {
  width: 0.22em; height: 0.22em; border-radius: 50%; background: var(--pma-color);
  animation: pma-bounce calc(0.6s / var(--pma-speed)) ease-in-out infinite;
}
.pma-dots span:nth-child(2) { animation-delay: calc(0.1s / var(--pma-speed)); }
.pma-dots span:nth-child(3) { animation-delay: calc(0.2s / var(--pma-speed)); }
@keyframes pma-bounce { 0%, 80%, 100% { transform: translateY(0); opacity: 0.6; } 40% { transform: translateY(-0.5em); opacity: 1; } }

.pma-dotpulse { display: flex; align-items: center; justify-content: center; gap: 0.18em; width: 1em; height: 1em; }
.pma-dotpulse span {
  width: 0.22em; height: 0.22em; border-radius: 50%; background: var(--pma-color);
  animation: pma-dotpulse calc(1s / var(--pma-speed)) ease-in-out infinite;
}
.pma-dotpulse span:nth-child(2) { animation-delay: calc(0.15s / var(--pma-speed)); }
.pma-dotpulse span:nth-child(3) { animation-delay: calc(0.3s / var(--pma-speed)); }
@keyframes pma-dotpulse { 0%, 100% { transform: scale(0.6); opacity: 0.35; } 50% { transform: scale(1); opacity: 1; } }

.pma-bars { display: flex; align-items: center; justify-content: center; gap: 0.12em; width: 1em; height: 1em; }
.pma-bars span {
  width: 0.15em; height: 100%; background: var(--pma-color); border-radius: 0.08em;
  animation: pma-eq calc(0.9s / var(--pma-speed)) ease-in-out infinite;
  transform-origin: center;
}
.pma-bars span:nth-child(1) { animation-delay: calc(-0.6s / var(--pma-speed)); }
.pma-bars span:nth-child(2) { animation-delay: calc(-0.4s / var(--pma-speed)); }
.pma-bars span:nth-child(3) { animation-delay: calc(-0.2s / var(--pma-speed)); }
.pma-bars span:nth-child(4) { animation-delay: 0s; }
@keyframes pma-eq { 0%, 100% { transform: scaleY(0.25); } 50% { transform: scaleY(1); } }

.pma-pulse { position: relative; width: 1em; height: 1em; }
.pma-pulse span {
  position: absolute; inset: 0; border-radius: 50%; border: 0.07em solid var(--pma-color);
  opacity: 0; animation: pma-ripple calc(1.4s / var(--pma-speed)) ease-out infinite;
}
.pma-pulse span:nth-child(2) { animation-delay: calc(0.7s / var(--pma-speed)); }
@keyframes pma-ripple { 0% { transform: scale(0.2); opacity: 0.8; } 100% { transform: scale(1); opacity: 0; } }

.pma-rippledot { position: relative; width: 1em; height: 1em; }
.pma-rippledot span {
  position: absolute; inset: 0; border-radius: 50%; background: var(--pma-color);
  opacity: 0; animation: pma-rippledot calc(1.2s / var(--pma-speed)) ease-out infinite;
}
.pma-rippledot span:nth-child(2) { animation-delay: calc(0.6s / var(--pma-speed)); }
@keyframes pma-rippledot { 0% { transform: scale(0); opacity: 0.55; } 100% { transform: scale(1); opacity: 0; } }

.pma-orbit { position: relative; width: 1em; height: 1em; animation: pma-spin calc(1.1s / var(--pma-speed)) linear infinite; }
.pma-orbit i {
  position: absolute; top: 50%; left: 50%; width: 0.18em; height: 0.18em; margin: -0.09em;
  border-radius: 50%; background: var(--pma-color);
}
.pma-orbit i:nth-child(1) { transform: rotate(0deg) translateX(0.44em); opacity: 1; }
.pma-orbit i:nth-child(2) { transform: rotate(120deg) translateX(0.44em); opacity: 0.6; }
.pma-orbit i:nth-child(3) { transform: rotate(240deg) translateX(0.44em); opacity: 0.3; }

.pma-sweep { width: 4.4em; height: 0.34em; border-radius: 0; background: rgba(255,255,255,0.12); position: relative; overflow: hidden; }
.pma-sweep i {
  position: absolute; top: 0; left: -35%; width: 35%; height: 100%; border-radius: 0;
  background: linear-gradient(90deg, transparent, var(--pma-color), transparent);
  animation: pma-sweep calc(1.3s / var(--pma-speed)) cubic-bezier(.4,0,.2,1) infinite;
}
@keyframes pma-sweep {
  0% { left: -35%; opacity: 0; }
  12% { opacity: 1; }
  55% { opacity: 1; }
  100% { left: 100%; opacity: 0; }
}

.pma-indeterminate { width: 4.4em; height: 0.28em; border-radius: 0; background: rgba(255,255,255,0.12); position: relative; overflow: hidden; }
.pma-indeterminate i { position: absolute; top: 0; height: 100%; border-radius: 0; background: var(--pma-color); }
.pma-indeterminate i:nth-child(1) { animation: pma-indet1 calc(1.6s / var(--pma-speed)) cubic-bezier(.65,.15,.35,.85) infinite; }
.pma-indeterminate i:nth-child(2) { animation: pma-indet2 calc(1.6s / var(--pma-speed)) cubic-bezier(.65,.15,.35,.85) infinite; opacity: 0.6; }
@keyframes pma-indet1 { 0% { left: -40%; width: 40%; } 60% { left: 100%; width: 60%; } 100% { left: 100%; width: 60%; } }
@keyframes pma-indet2 { 0% { left: -60%; width: 50%; } 100% { left: 120%; width: 20%; } }
`;

  function injectBaseStylesheet() {
    if (document.getElementById(STYLE_TAG_ID)) return;
    const style = document.createElement("style");
    style.id = STYLE_TAG_ID;
    style.textContent = BASE_CSS;
    document.head.appendChild(style);
  }

  const PRESETS = {
    ring: () => `<div class="pma-ring"></div>`,
    dualring: () => `<div class="pma-dualring"><i></i><i></i></div>`,
    gradient: () => `<div class="pma-gradient"></div>`,
    dots_bounce: () => `<div class="pma-dots"><span></span><span></span><span></span></div>`,
    dots_pulse: () => `<div class="pma-dotpulse"><span></span><span></span><span></span></div>`,
    bars: () => `<div class="pma-bars"><span></span><span></span><span></span><span></span></div>`,
    radar: () => `<div class="pma-pulse"><span></span><span></span></div>`,
    ripple: () => `<div class="pma-rippledot"><span></span><span></span></div>`,
    orbit: () => `<div class="pma-orbit"><i></i><i></i><i></i></div>`,
    progress_sweep: () => `<div class="pma-sweep"><i></i></div>`,
    indeterminate: () => `<div class="pma-indeterminate"><i></i><i></i></div>`,
  };

  const DEFAULT_CUSTOM_CSS =
    `.pma-custom-demo {\n` +
    `  width: 1em; height: 1em; border-radius: 50%;\n` +
    `  border: 0.15em solid rgba(255,255,255,0.2);\n` +
    `  border-top-color: var(--pma-color);\n` +
    `  animation: pma-custom-spin calc(1s / var(--pma-speed)) linear infinite;\n` +
    `}\n` +
    `@keyframes pma-custom-spin { to { transform: rotate(360deg); } }`;
  const DEFAULT_CUSTOM_HTML = `<div class="pma-custom-demo"></div>`;

  class AnimatedLoaders {
    constructor(runtime) {
      this.runtime = runtime;
      this.loaders = new Map();
      this.container = null;
      this._observedCanvas = null;
      this._looping = false;
      this._rafId = null;
      injectBaseStylesheet();
    }

    getInfo() {
      return {
        id: EXT_ID,
        name: "Animated Loaders",
        color1: "#8b5cf6",
        color2: "#7c3aed",
        blocks: [
          {
            opcode: "createLoader",
            blockType: Scratch.BlockType.COMMAND,
            text: "create loader [ID] with style [STYLE]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" },
              STYLE: { type: Scratch.ArgumentType.STRING, menu: "STYLES", defaultValue: "ring" },
            },
          },
          {
            opcode: "removeLoader",
            blockType: Scratch.BlockType.COMMAND,
            text: "remove loader [ID]",
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" } },
          },
          {
            opcode: "removeAllLoaders",
            blockType: Scratch.BlockType.COMMAND,
            text: "remove all loaders",
          },
          "---",
          {
            opcode: "showLoader",
            blockType: Scratch.BlockType.COMMAND,
            text: "show loader [ID]",
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" } },
          },
          {
            opcode: "hideLoader",
            blockType: Scratch.BlockType.COMMAND,
            text: "hide loader [ID]",
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" } },
          },
          "---",
          {
            opcode: "setLoaderPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "set loader [ID] position to x: [X] y: [Y]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            opcode: "changeLoaderPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "change loader [ID] position by x: [X] y: [Y]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            opcode: "setLoaderSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "set loader [ID] size to [SIZE]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" },
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 },
            },
          },
          {
            opcode: "setLoaderSpeed",
            blockType: Scratch.BlockType.COMMAND,
            text: "set loader [ID] speed to [SPEED] x",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" },
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
            },
          },
          {
            opcode: "setLoaderColor",
            blockType: Scratch.BlockType.COMMAND,
            text: "set loader [ID] color to [COLOR]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" },
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: "#8b5cf6" },
            },
          },
          {
            opcode: "setLoaderStyle",
            blockType: Scratch.BlockType.COMMAND,
            text: "set loader [ID] style to [STYLE]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" },
              STYLE: { type: Scratch.ArgumentType.STRING, menu: "STYLES", defaultValue: "ring" },
            },
          },
          "---",
          {
            opcode: "setCustomLoader",
            blockType: Scratch.BlockType.COMMAND,
            text: "set loader [ID] to custom loader — html: [HTML] css: [CSS]",
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" },
              HTML: { type: Scratch.ArgumentType.STRING, defaultValue: DEFAULT_CUSTOM_HTML },
              CSS: { type: Scratch.ArgumentType.STRING, defaultValue: DEFAULT_CUSTOM_CSS },
            },
          },
          "---",
          {
            opcode: "loaderExists",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "loader [ID] exists?",
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" } },
          },
          {
            opcode: "loaderVisible",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "loader [ID] is visible?",
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" } },
          },
          {
            opcode: "getLoaderX",
            blockType: Scratch.BlockType.REPORTER,
            text: "loader [ID] x",
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" } },
          },
          {
            opcode: "getLoaderY",
            blockType: Scratch.BlockType.REPORTER,
            text: "loader [ID] y",
            arguments: { ID: { type: Scratch.ArgumentType.STRING, defaultValue: "loader1" } },
          },
        ],
        menus: {
          STYLES: {
            acceptReporters: true,
            items: [
              { text: "ring", value: "ring" },
              { text: "dual ring", value: "dualring" },
              { text: "gradient spinner", value: "gradient" },
              { text: "bouncing dots", value: "dots_bounce" },
              { text: "pulsing dots", value: "dots_pulse" },
              { text: "equalizer bars", value: "bars" },
              { text: "radar ripple", value: "radar" },
              { text: "ripple", value: "ripple" },
              { text: "orbit dots", value: "orbit" },
              { text: "progress sweep bar", value: "progress_sweep" },
              { text: "indeterminate bar", value: "indeterminate" },
              { text: "custom", value: "custom" },
            ],
          },
        },
      };
    }

    // re-checked every frame instead of cached once, since fullscreen or a stage size change can swap the canvas or reparent it
    _ensureContainer() {
      const canvas = this.runtime.renderer && this.runtime.renderer.canvas;
      if (!canvas || !canvas.parentElement) return this.container;

      const parent = canvas.parentElement;

      if (this.container && this.container.parentElement === parent && document.body.contains(this.container)) {
        return this.container;
      }

      if (getComputedStyle(parent).position === "static") {
        parent.style.position = "relative";
      }

      let container = this.container;
      if (!container || !document.body.contains(container)) {
        const orphaned = container; // still holds live loader elements
        container = document.createElement("div");
        container.id = "pma-loader-container";
        container.style.position = "absolute";
        container.style.top = "0";
        container.style.left = "0";
        container.style.right = "0";
        container.style.bottom = "0";
        container.style.overflow = "hidden";
        container.style.pointerEvents = "none";
        container.style.zIndex = "300";
        if (orphaned) {
          while (orphaned.firstChild) container.appendChild(orphaned.firstChild);
        }
        this.container = container;
      }

      if (container.parentElement !== parent) {
        parent.appendChild(container);
      }

      return container;
    }

    _repositionAll() {
      for (const id of this.loaders.keys()) this._applyTransform(id);
    }

    _startLoop() {
      if (this._looping) return;
      this._looping = true;
      const step = () => {
        if (this.loaders.size === 0) {
          this._looping = false;
          return;
        }
        this._ensureContainer();
        this._repositionAll();
        this._rafId = requestAnimationFrame(step);
      };
      this._rafId = requestAnimationFrame(step);
    }

    _applyTransform(id) {
      const loader = this.loaders.get(id);
      const container = this.container;
      if (!loader || !container) return;

      const rect = container.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const stageWidth = this.runtime.stageWidth || DEFAULT_STAGE_W;
      const pxPerUnit = rect.width / stageWidth;

      const leftPx = rect.width / 2 + loader.x * pxPerUnit;
      const topPx = rect.height / 2 - loader.y * pxPerUnit;

      loader.wrapper.style.left = `${leftPx}px`;
      loader.wrapper.style.top = `${topPx}px`;
      loader.wrapper.style.fontSize = `${Math.max(1, loader.size * pxPerUnit)}px`;
    }

    _renderPreset(loader) {
      loader.wrapper.querySelectorAll("style[data-pma-custom]").forEach((el) => el.remove());

      if (loader.style === "custom") {
        const styleEl = document.createElement("style");
        styleEl.setAttribute("data-pma-custom", "1");
        styleEl.textContent = loader.customCss || "";
        loader.wrapper.innerHTML = "";
        loader.wrapper.appendChild(styleEl);
        const holder = document.createElement("div");
        holder.innerHTML = loader.customHtml || "";
        while (holder.firstChild) loader.wrapper.appendChild(holder.firstChild);
        return;
      }

      const build = PRESETS[loader.style] || PRESETS.ring;
      loader.wrapper.innerHTML = build();
    }

    _getOrNull(id) {
      return this.loaders.get(String(id)) || null;
    }

    createLoader(args) {
      const id = String(args.ID);
      const container = this._ensureContainer();
      if (!container) return;

      let loader = this.loaders.get(id);
      if (!loader) {
        const wrapper = document.createElement("div");
        wrapper.className = "pma-loader-wrapper";
        container.appendChild(wrapper);
        loader = {
          wrapper,
          x: 0,
          y: 0,
          size: 60,
          speed: 1,
          color: "#8b5cf6",
          style: "ring",
          visible: true,
          customCss: DEFAULT_CUSTOM_CSS,
          customHtml: DEFAULT_CUSTOM_HTML,
        };
        this.loaders.set(id, loader);
        this._startLoop();
      }

      loader.style = String(args.STYLE);
      loader.wrapper.style.setProperty("--pma-color", loader.color);
      loader.wrapper.style.setProperty("--pma-speed", String(loader.speed));
      loader.wrapper.style.display = loader.visible ? "" : "none";
      this._renderPreset(loader);
      this._applyTransform(id);
    }

    removeLoader(args) {
      const id = String(args.ID);
      const loader = this.loaders.get(id);
      if (!loader) return;
      loader.wrapper.remove();
      this.loaders.delete(id);
    }

    removeAllLoaders() {
      for (const id of Array.from(this.loaders.keys())) {
        this.removeLoader({ ID: id });
      }
    }

    showLoader(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      loader.visible = true;
      loader.wrapper.style.display = "";
    }

    hideLoader(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      loader.visible = false;
      loader.wrapper.style.display = "none";
    }

    setLoaderPosition(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      loader.x = Number(args.X) || 0;
      loader.y = Number(args.Y) || 0;
      this._applyTransform(String(args.ID));
    }

    changeLoaderPosition(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      loader.x += Number(args.X) || 0;
      loader.y += Number(args.Y) || 0;
      this._applyTransform(String(args.ID));
    }

    setLoaderSize(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      loader.size = Math.max(1, Number(args.SIZE) || 60);
      this._applyTransform(String(args.ID));
    }

    setLoaderSpeed(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      let speed = Number(args.SPEED);
      if (!isFinite(speed) || speed === 0) speed = 1;
      speed = Math.min(50, Math.max(0.05, Math.abs(speed)));
      loader.speed = speed;
      loader.wrapper.style.setProperty("--pma-speed", String(speed));
    }

    setLoaderColor(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      const hex = String(args.COLOR);
      loader.color = hex;
      loader.wrapper.style.setProperty("--pma-color", hex);
    }

    setLoaderStyle(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      loader.style = String(args.STYLE);
      this._renderPreset(loader);
      this._applyTransform(String(args.ID));
    }

    setCustomLoader(args) {
      const loader = this._getOrNull(args.ID);
      if (!loader) return;
      loader.customHtml = String(args.HTML);
      loader.customCss = String(args.CSS);
      loader.style = "custom";
      this._renderPreset(loader);
      this._applyTransform(String(args.ID));
    }

    loaderExists(args) {
      return this.loaders.has(String(args.ID));
    }

    loaderVisible(args) {
      const loader = this._getOrNull(args.ID);
      return !!loader && loader.visible;
    }

    getLoaderX(args) {
      const loader = this._getOrNull(args.ID);
      return loader ? loader.x : 0;
    }

    getLoaderY(args) {
      const loader = this._getOrNull(args.ID);
      return loader ? loader.y : 0;
    }
  }

  Scratch.extensions.register(new AnimatedLoaders(Scratch.vm.runtime));
})(Scratch);
