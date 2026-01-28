(function(Scratch) {
  'use strict';

  class StageJoystick {
    constructor() {
      this.container = null;
      this.base = null;
      this.stick = null;
      this.xMove = 0;
      this.yMove = 0;
      this.isVisible = false;
      this.scratchX = -100; 
      this.scratchY = -100;
      this.scratchSize = 100;
      this.baseAlpha = 0; 
      this.stickAlpha = 0;

      this._injectJoystick();
      this._setupListeners();
    }

    getInfo() {
      return {
        id: 'codemasterJoystick',
        name: 'Joystick',
        color1: '#3366ff',
        blocks: [
          { opcode: 'showJoystick', blockType: Scratch.BlockType.COMMAND, text: 'show joystick' },
          { opcode: 'hideJoystick', blockType: Scratch.BlockType.COMMAND, text: 'hide joystick' },
          {
            opcode: 'setPos',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set joystick x [X] y [Y]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: -100 }
            }
          },
          {
            opcode: 'setSize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set joystick size to [SIZE]',
            arguments: {
              SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
            }
          },
          {
            opcode: 'setBaseColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set joystick base color to [COLOR]',
            arguments: {
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#888888' }
            }
          },
          {
            opcode: 'setBaseOpacity',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set joystick base transparency level to [OPACITY]',
            arguments: {
              OPACITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setStickColor',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set joystick stick color to [COLOR]',
            arguments: {
              COLOR: { type: Scratch.ArgumentType.COLOR, defaultValue: '#ffffff' }
            }
          },
          {
            opcode: 'setStickOpacity',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set joystick stick transparency level to [OPACITY]',
            arguments: {
              OPACITY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          { opcode: 'getX', blockType: Scratch.BlockType.REPORTER, text: 'joystick x movement' },
          { opcode: 'getY', blockType: Scratch.BlockType.REPORTER, text: 'joystick y movement' }
        ]
      };
    }

    _setupListeners() {
      Scratch.vm.runtime.on('PROJECT_START', () => this.hideJoystick());
      Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => this.hideJoystick());
      const updateLoop = () => {
        this._updateVisuals();
        requestAnimationFrame(updateLoop);
      };
      requestAnimationFrame(updateLoop);
    }

    _updateVisuals() {
      if (!this.container) return;
      const stageWrapper = document.querySelector('[class*="stage_stage-wrapper"]');
      const isGuiOverlay = !!document.querySelector('[class*="modal_modal-overlay"]');
      if (!stageWrapper || isGuiOverlay || !this.isVisible) {
        this.container.style.display = 'none';
        return;
      }
      if (this.container.parentElement !== stageWrapper) stageWrapper.appendChild(this.container);
      const rect = stageWrapper.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const scale = rect.width / 480; 
      const halfSize = this.scratchSize / 2;
      const clampedX = Math.max(-240 + halfSize, Math.min(240 - halfSize, this.scratchX));
      const clampedY = Math.max(-180 + halfSize, Math.min(180 - halfSize, this.scratchY));
      const percentX = ((clampedX + 240) / 480) * 100;
      const percentY = ((180 - clampedY) / 360) * 100;
      const pixelSize = this.scratchSize * scale;
      this.container.style.display = 'block';
      Object.assign(this.container.style, {
        position: 'absolute',
        width: `${pixelSize}px`,
        height: `${pixelSize}px`,
        left: `calc(${percentX}% - ${pixelSize / 2}px)`,
        top: `calc(${percentY}% - ${pixelSize / 2}px)`,
        zIndex: '1000'
      });
      if (this.base) this.base.style.opacity = 1 - this.baseAlpha;
      if (this.stick) this.stick.style.opacity = 1 - this.stickAlpha;
    }

    _injectJoystick() {
      this.container = document.createElement('div');
      this.container.style.touchAction = 'none';
      this.base = document.createElement('div');
      Object.assign(this.base.style, {
        width: '100%', height: '100%', borderRadius: '50%',
        backgroundColor: '#888888', position: 'absolute',
        boxSizing: 'border-box', border: '2px solid rgba(0,0,0,0.1)',
        top: '0', left: '0'
      });
      this.stick = document.createElement('div');
      Object.assign(this.stick.style, {
        width: '40%', height: '40%', borderRadius: '50%',
        backgroundColor: '#ffffff', position: 'absolute',
        top: '30%', left: '30%', pointerEvents: 'none',
        boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
        zIndex: '1001'
      });
      this.container.appendChild(this.base);
      this.container.appendChild(this.stick);
      const handleMove = (e) => {
        const bRect = this.base.getBoundingClientRect();
        const cX = bRect.left + bRect.width / 2;
        const cY = bRect.top + bRect.height / 2;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        let dx = clientX - cX;
        let dy = clientY - cY;
        const maxDist = bRect.width / 2;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist > maxDist) {
          dx *= maxDist / dist;
          dy *= maxDist / dist;
        }
        this.stick.style.transform = `translate(${dx}px, ${dy}px)`;
        this.xMove = (dx / maxDist) * 100;
        this.yMove = (dy / maxDist) * -100;
      };
      this.container.addEventListener('pointerdown', (e) => {
        this.container.setPointerCapture(e.pointerId);
        const onMove = (me) => handleMove(me);
        const onUp = () => {
          window.removeEventListener('pointermove', onMove);
          window.removeEventListener('pointerup', onUp);
          this.stick.style.transform = 'translate(0,0)';
          this.xMove = 0; this.yMove = 0;
        };
        window.addEventListener('pointermove', onMove);
        window.addEventListener('pointerup', onUp);
      });
    }

    showJoystick() { this.isVisible = true; }
    hideJoystick() { this.isVisible = false; }
    setPos(args) {
      this.scratchX = Number(args.X);
      this.scratchY = Number(args.Y);
    }
    setSize(args) { this.scratchSize = Number(args.SIZE); }
    setBaseColor(args) { if(this.base) this.base.style.backgroundColor = args.COLOR; }
    setStickColor(args) { if(this.stick) this.stick.style.backgroundColor = args.COLOR; }
    setBaseOpacity(args) { this.baseAlpha = Math.max(0, Math.min(100, Number(args.OPACITY))) / 100; }
    setStickOpacity(args) { this.stickAlpha = Math.max(0, Math.min(100, Number(args.OPACITY))) / 100; }
    getX() { return Math.round(this.xMove); }
    getY() { return Math.round(this.yMove); }
  }

  Scratch.extensions.register(new StageJoystick());
})(Scratch);
