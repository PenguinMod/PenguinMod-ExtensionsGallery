(function(Scratch) {
  'use strict';
  const THEME = {
    primary:   '#3892D1',
    secondary: '#2671A5',
    tertiary:  '#1A4F73'
  };

  class PlatformerPhysics {
    constructor() {
      this.sprites = new Map();
      this.defaults = {
        vx: 0,
        vy: 0,
        gravity: 0.6,
        jumpForce: 12,
        moveSpeed: 6,
        friction: 0.82,
        maxSpeed: 12,
        onGround: false,
        wasOnGround: false,
        groundY: null,
        platforms: [],
        bounce: 0,
        airResistance: 0.97,
        coyoteTime: 5,
        coyoteTimer: 0,
        jumpBuffer: 5,
        jumpBufferTimer: 0,
        wallSlide: false,
        wallSlideSpeed: 2,
        jumpCount: 0,
        maxJumps: 1,
        jumpCooldown: 0
      };
    }

    _getData(target) {
      if (!this.sprites.has(target.id)) {
        this.sprites.set(target.id, { ...this.defaults });
      }
      return this.sprites.get(target.id);
    }

    _getPos(target) {
      return { x: target.x, y: target.y };
    }

    _setPos(target, x, y) {
      target.setXY(x, y);
    }

    _clampVelocity(data) {
      data.vx = Math.max(-data.maxSpeed, Math.min(data.maxSpeed, data.vx));
      data.vy = Math.max(-data.maxSpeed * 2, Math.min(data.maxSpeed * 2, data.vy));
    }

    getInfo() {
      return {
        id: 'platformerPhysics2D',
        name: 'Platformer Physics',
        color1: THEME.primary,
        color2: THEME.secondary,
        color3: THEME.tertiary,
        tbShow: true,
        blocks: [
          // MOVEMENT
          {
            opcode: 'moveLeft',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Move left with speed [SPEED]',
            arguments: {
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 6 }
            }
          },
          {
            opcode: 'moveRight',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Move right with speed [SPEED]',
            arguments: {
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 6 }
            }
          },
          {
            opcode: 'jump',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Jump with force [FORCE]',
            arguments: {
              FORCE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 }
            }
          },
          {
            opcode: 'jumpWithBuffer',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Buffered jump with force [FORCE]',
            arguments: {
              FORCE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 }
            }
          },
          {
            opcode: 'dash',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Dash [DIRECTION] with power [POWER]',
            arguments: {
              DIRECTION: { type: Scratch.ArgumentType.STRING, menu: 'directionMenu', defaultValue: 'right' },
              POWER: { type: Scratch.ArgumentType.NUMBER, defaultValue: 15 }
            }
          },
          {
            opcode: 'stopMovement',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Stop movement'
          },
          {
            opcode: 'setVelocity',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set velocity to x: [VX] y: [VY]',
            arguments: {
              VX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              VY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          '---',
          // PHYSICS SETTINGS
          {
            opcode: 'setGravity',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set gravity to [VALUE]',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.6 }
            }
          },
          {
            opcode: 'setFriction',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set friction to [VALUE]',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.82 }
            }
          },
          {
            opcode: 'setMaxSpeed',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set max speed to [VALUE]',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 }
            }
          },
          {
            opcode: 'setBounce',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set bounce to [VALUE]',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setAirResistance',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set air resistance to [VALUE]',
            arguments: {
              VALUE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.97 }
            }
          },
          {
            opcode: 'setCoyoteTime',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set coyote time to [FRAMES] frames',
            arguments: {
              FRAMES: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 }
            }
          },
          {
            opcode: 'setMaxJumps',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set max jumps to [COUNT]',
            arguments: {
              COUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          '---',
          // GROUND & PLATFORMS
          {
            opcode: 'setGroundLevel',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set ground level to y: [Y]',
            arguments: {
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: -150 }
            }
          },
          {
            opcode: 'addPlatform',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add platform at x: [X] y: [Y] width: [W] height: [H]',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              W: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              H: { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 }
            }
          },
          {
            opcode: 'addMovingPlatform',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add moving platform at x: [X] y: [Y] width: [W] height: [H] speed x: [SX] y: [SY]',
            arguments: {
              X:  { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y:  { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              W:  { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
              H:  { type: Scratch.ArgumentType.NUMBER, defaultValue: 20 },
              SX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
              SY: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'clearPlatforms',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Clear all platforms'
          },
          '---',
          // PHYSICS ENGINE
          {
            opcode: 'updatePhysics',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Update physics'
          },
          {
            opcode: 'updatePhysicsWithDelta',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Update physics with delta [DELTA]',
            arguments: {
              DELTA: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }
            }
          },
          {
            opcode: 'applyForce',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Apply force x: [FX] y: [FY]',
            arguments: {
              FX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              FY: { type: Scratch.ArgumentType.NUMBER, defaultValue: -8 }
            }
          },
          {
            opcode: 'resetPhysics',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Reset physics'
          },
          '---',
          // STATE REPORTERS
          {
            opcode: 'getVelocityX',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Velocity X'
          },
          {
            opcode: 'getVelocityY',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Velocity Y'
          },
          {
            opcode: 'getSpeed',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Total speed'
          },
          {
            opcode: 'getJumpCount',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Jump count'
          },
          {
            opcode: 'isOnGround',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is on ground?'
          },
          {
            opcode: 'isFalling',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is falling?'
          },
          {
            opcode: 'isMoving',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is moving?'
          },
          {
            opcode: 'canJump',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Can jump?'
          },
          {
            opcode: 'isSliding',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is sliding?'
          },
          '---',
          // EVENTS
          {
            opcode: 'whenHitGround',
            blockType: Scratch.BlockType.HAT,
            text: 'When hit ground',
            isEdgeActivated: false
          },
          {
            opcode: 'whenHitWall',
            blockType: Scratch.BlockType.HAT,
            text: 'When hit wall',
            isEdgeActivated: false
          },
          {
            opcode: 'whenStartFalling',
            blockType: Scratch.BlockType.HAT,
            text: 'When start falling',
            isEdgeActivated: false
          },
          '---',
          // ADVANCED
          {
            opcode: 'enableWallSlide',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Enable wall slide [ENABLED]',
            arguments: {
              ENABLED: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: true }
            }
          },
          {
            opcode: 'setWallSlideSpeed',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set wall slide speed to [SPEED]',
            arguments: {
              SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
            }
          },
          {
            opcode: 'wallJump',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Wall jump with force [FORCE]',
            arguments: {
              FORCE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          }
        ],
        menus: {
          directionMenu: {
            acceptReporters: true,
            items: [
              { text: 'right',  value: 'right' },
              { text: 'left',   value: 'left' },
              { text: 'up',     value: 'up' },
              { text: 'down',   value: 'down' }
            ]
          }
        }
      };
    }

    // MOVEMENT METHODS
    moveLeft(args, util) {
      const data = this._getData(util.target);
      data.vx -= Scratch.Cast.toNumber(args.SPEED) * 0.6;
      this._clampVelocity(data);
    }

    moveRight(args, util) {
      const data = this._getData(util.target);
      data.vx += Scratch.Cast.toNumber(args.SPEED) * 0.6;
      this._clampVelocity(data);
    }

    jump(args, util) {
      const data = this._getData(util.target);
      const force = Scratch.Cast.toNumber(args.FORCE);
      if (data.jumpCooldown === 0 && data.jumpCount < data.maxJumps) {
        data.vy = force;
        data.jumpCount++;
        data.jumpCooldown = 8;
        data.onGround = false;
        data.coyoteTimer = 0;
        data.jumpBufferTimer = 0;
      }
    }

    jumpWithBuffer(args, util) {
      const data = this._getData(util.target);
      const force = Scratch.Cast.toNumber(args.FORCE);
      if (data.jumpCooldown === 0 && data.jumpCount < data.maxJumps) {
        data.vy = force;
        data.jumpCount++;
        data.jumpCooldown = 8;
        data.onGround = false;
        data.coyoteTimer = 0;
      } else {
        data.jumpBufferTimer = data.jumpBuffer;
      }
    }

    dash(args, util) {
      const data = this._getData(util.target);
      const power = Scratch.Cast.toNumber(args.POWER);
      switch (args.DIRECTION) {
        case 'right': data.vx =  power; break;
        case 'left':  data.vx = -power; break;
        case 'up':    data.vy =  power; break;
        case 'down':  data.vy = -power; break;
      }
      this._clampVelocity(data);
    }

    stopMovement(args, util) {
      const data = this._getData(util.target);
      data.vx = 0;
      data.vy = 0;
    }

    setVelocity(args, util) {
      const data = this._getData(util.target);
      data.vx = Scratch.Cast.toNumber(args.VX);
      data.vy = Scratch.Cast.toNumber(args.VY);
    }

    // PHYSICS SETTINGS METHODS
    setGravity(args, util) {
      this._getData(util.target).gravity = Scratch.Cast.toNumber(args.VALUE);
    }

    setFriction(args, util) {
      this._getData(util.target).friction = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.VALUE)));
    }

    setMaxSpeed(args, util) {
      this._getData(util.target).maxSpeed = Scratch.Cast.toNumber(args.VALUE);
    }

    setBounce(args, util) {
      this._getData(util.target).bounce = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.VALUE)));
    }

    setAirResistance(args, util) {
      this._getData(util.target).airResistance = Math.max(0, Math.min(1, Scratch.Cast.toNumber(args.VALUE)));
    }

    setCoyoteTime(args, util) {
      this._getData(util.target).coyoteTime = Scratch.Cast.toNumber(args.FRAMES);
    }

    setMaxJumps(args, util) {
      this._getData(util.target).maxJumps = Math.max(1, Scratch.Cast.toNumber(args.COUNT));
    }

    // GROUND & PLATFORM METHODS
    setGroundLevel(args, util) {
      this._getData(util.target).groundY = Scratch.Cast.toNumber(args.Y);
    }

    addPlatform(args, util) {
      const data = this._getData(util.target);
      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      const w = Scratch.Cast.toNumber(args.W);
      const h = Scratch.Cast.toNumber(args.H);
      
      // Aynı koordinat ve boyutta platform varsa belleği şişirmemek için ekleme (Memory Leak Koruması)
      const exists = data.platforms.some(p => p.x === x && p.y === y && p.w === w && p.h === h && p.type === 'static');
      
      if (!exists) {
        data.platforms.push({ x, y, w, h, type: 'static' });
      }
    }

    addMovingPlatform(args, util) {
      const data = this._getData(util.target);
      const x = Scratch.Cast.toNumber(args.X);
      const y = Scratch.Cast.toNumber(args.Y);
      const w = Scratch.Cast.toNumber(args.W);
      const h = Scratch.Cast.toNumber(args.H);
      
      const exists = data.platforms.some(p => p.x === x && p.y === y && p.w === w && p.h === h && p.type === 'moving');

      if (!exists) {
        data.platforms.push({
          x, y, w, h, type: 'moving',
          sx: Scratch.Cast.toNumber(args.SX),
          sy: Scratch.Cast.toNumber(args.SY),
          time: 0
        });
      }
    }

    clearPlatforms(args, util) {
      this._getData(util.target).platforms = [];
    }

    // PHYSICS ENGINE METHODS
    updatePhysics(args, util) {
      this._doPhysicsUpdate(util.target, 1);
    }

    updatePhysicsWithDelta(args, util) {
      this._doPhysicsUpdate(util.target, Scratch.Cast.toNumber(args.DELTA));
    }

    _doPhysicsUpdate(target, delta) {
      const data = this._getData(target);
      const pos = this._getPos(target);

      if (!data.onGround) {
        data.coyoteTimer = Math.max(0, data.coyoteTimer - 1);
      } else {
        data.coyoteTimer = data.coyoteTime;
      }

      if (data.jumpCooldown > 0) {
        data.jumpCooldown--;
      }

      if (data.jumpBufferTimer > 0) {
        data.jumpBufferTimer--;
        if (data.onGround) {
          data.vy = data.jumpForce;
          data.onGround = false;
          data.jumpBufferTimer = 0;
        }
      }

      // Delta uyumlu ivme ve kuvvet çarpanları
      data.vy -= data.gravity * delta;
      data.vy *= Math.pow(data.airResistance, delta);
      data.vx *= Math.pow(data.airResistance, delta);

      if (data.onGround) {
        data.vx *= Math.pow(data.friction, delta);
      }

      if (data.wallSlide && !data.onGround) {
        data.vy = Math.max(data.vy, -data.wallSlideSpeed);
      }

      this._clampVelocity(data);

      let newX = pos.x + data.vx * delta;
      let newY = pos.y + data.vy * delta;

      const wasOnGround = data.onGround;
      const wasFalling = data.vy < 0;
      data.onGround = false;
      data.wallSlide = false;

      const bounds = {
        w: target.getBounds().width  || 30,
        h: target.getBounds().height || 30
      };

      for (let i = 0; i < data.platforms.length; i++) {
        const plat = data.platforms[i];

        if (plat.type === 'moving') {
          plat.time = (plat.time || 0) + 0.02 * delta;
          plat.x += Math.sin(plat.time) * (plat.sx || 0) * delta;
          plat.y += Math.cos(plat.time) * (plat.sy || 0) * delta;
        }

        const pLeft   = plat.x - plat.w / 2;
        const pRight  = plat.x + plat.w / 2;
        const pTop    = plat.y + plat.h / 2;
        const pBottom = plat.y - plat.h / 2;

        const sLeft   = newX - bounds.w / 2;
        const sRight  = newX + bounds.w / 2;
        const sTop    = newY + bounds.h / 2;
        const sBottom = newY - bounds.h / 2;

        if (sRight > pLeft && sLeft < pRight && sTop > pBottom && sBottom < pTop) {
          if (data.vy <= 0 && pos.y - bounds.h / 2 >= pTop - 2) {
            newY = pTop + bounds.h / 2;
            data.vy = 0;
            data.onGround = true;
            data.jumpCount = 0;
            data.jumpCooldown = 0;
          }
          else if (data.vy > 0 && pos.y + bounds.h / 2 <= pBottom + 2) {
            newY = pBottom - bounds.h / 2;
            data.vy = -data.vy * data.bounce;
          }
          else if (data.vx > 0 && pos.x + bounds.w / 2 <= pLeft + 2) {
            newX = pLeft - bounds.w / 2;
            data.vx = -data.vx * data.bounce;
            data.wallSlide = true;
          }
          else if (data.vx < 0 && pos.x - bounds.w / 2 >= pRight - 2) {
            newX = pRight + bounds.w / 2;
            data.vx = -data.vx * data.bounce;
            data.wallSlide = true;
          }
        }
      }

      if (data.groundY !== null) {
        const feetY = newY - bounds.h / 2;
        if (feetY <= data.groundY) {
          newY = data.groundY + bounds.h / 2;
          if (data.vy < 0) data.vy = -data.vy * data.bounce;
          data.onGround = true;
          data.jumpCount = 0;
          data.jumpCooldown = 0;
        }
      }

      const stageW = 480;
      const stageH = 360;
      if (newX < -stageW / 2) { newX = -stageW / 2; data.vx =  Math.abs(data.vx) * data.bounce; }
      if (newX >  stageW / 2) { newX =  stageW / 2; data.vx = -Math.abs(data.vx) * data.bounce; }
      if (newY >  stageH / 2) { newY =  stageH / 2; data.vy = -Math.abs(data.vy) * data.bounce; }

      this._setPos(target, newX, newY);

      if (Math.abs(data.vx) < 0.02) data.vx = 0;
      if (Math.abs(data.vy) < 0.02 && data.onGround) data.vy = 0;

      if (data.onGround && !wasOnGround) {
        Scratch.vm.runtime.startHats('platformerPhysics2D_whenHitGround', null, target);
      }
      if (data.wallSlide) {
        Scratch.vm.runtime.startHats('platformerPhysics2D_whenHitWall', null, target);
      }
      if (data.vy < 0 && !wasFalling) {
        Scratch.vm.runtime.startHats('platformerPhysics2D_whenStartFalling', null, target);
      }
    }

    // STATE REPORTER METHODS
    getVelocityX(args, util) { return Math.round(this._getData(util.target).vx * 100) / 100; }
    getVelocityY(args, util) { return Math.round(this._getData(util.target).vy * 100) / 100; }
    getSpeed(args, util) {
      const data = this._getData(util.target);
      return Math.round(Math.sqrt(data.vx * data.vx + data.vy * data.vy) * 100) / 100;
    }
    getJumpCount(args, util) { return this._getData(util.target).jumpCount; }
    isOnGround(args, util) { return this._getData(util.target).onGround; }
    isFalling(args, util) { return this._getData(util.target).vy < 0; }
    isMoving(args, util) {
      const data = this._getData(util.target);
      return Math.abs(data.vx) > 0.1 || Math.abs(data.vy) > 0.1;
    }
    canJump(args, util) {
      const data = this._getData(util.target);
      return data.onGround || data.coyoteTimer > 0;
    }
    isSliding(args, util) { return this._getData(util.target).wallSlide; }

    // EVENT METHODS (İçi boş bırakılarak Scratch Engine'in doğal Hat davranışına uygun hale getirildi)
    whenHitGround(args, util) {}
    whenHitWall(args, util) {}
    whenStartFalling(args, util) {}

    // ADVANCED METHODS
    enableWallSlide(args, util) {
      this._getData(util.target).wallSlide = Scratch.Cast.toBoolean(args.ENABLED);
    }
    setWallSlideSpeed(args, util) {
      this._getData(util.target).wallSlideSpeed = Scratch.Cast.toNumber(args.SPEED);
    }
    wallJump(args, util) {
      const data = this._getData(util.target);
      const force = Scratch.Cast.toNumber(args.FORCE);
      if (data.wallSlide) {
        data.vy = force;
        data.vx = (data.vx > 0) ? -force * 0.7 : force * 0.7;
        data.wallSlide = false;
      }
    }
    applyForce(args, util) {
      const data = this._getData(util.target);
      data.vx += Scratch.Cast.toNumber(args.FX);
      data.vy += Scratch.Cast.toNumber(args.FY);
      this._clampVelocity(data);
    }
    resetPhysics(args, util) {
      const data = this._getData(util.target);
      Object.assign(data, this.defaults);
      data.platforms = [];
      data.jumpCount = 0;
      data.jumpCooldown = 0;
    }
  }

  Scratch.extensions.register(new PlatformerPhysics());
})(Scratch);
