// Name: RPG Collisions
// ID: rpgcollisions
// Description: Tag sprites as Wall, Player, or None and get automatic RPG-style solid collisions — no more walking through walls.
// By: Gatoc_Dev
// License: MIT

(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('RPG Collisions must run unsandboxed');
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;

  const TAG_WALL = 'wall';
  const TAG_PLAYER = 'player';
  const TAG_NONE = 'none';

  const ICON = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIj4KPHJlY3QgeD0iMSIgeT0iMSIgd2lkdGg9IjM4IiBoZWlnaHQ9IjM4IiByeD0iOCIgZmlsbD0iIzRDQUY1MCIgc3Ryb2tlPSIjMkU3RDMyIiBzdHJva2Utd2lkdGg9IjIiLz4KPHJlY3QgeD0iNyIgeT0iOSIgd2lkdGg9IjEwIiBoZWlnaHQ9IjYiIGZpbGw9IiNFOEY1RTkiIHN0cm9rZT0iIzJFN0QzMiIgc3Ryb2tlLXdpZHRoPSIxIi8+CjxyZWN0IHg9IjE5IiB5PSI5IiB3aWR0aD0iMTAiIGhlaWdodD0iNiIgZmlsbD0iI0U4RjVFOSIgc3Ryb2tlPSIjMkU3RDMyIiBzdHJva2Utd2lkdGg9IjEiLz4KPHJlY3QgeD0iMTMiIHk9IjE3IiB3aWR0aD0iMTAiIGhlaWdodD0iNiIgZmlsbD0iI0U4RjVFOSIgc3Ryb2tlPSIjMkU3RDMyIiBzdHJva2Utd2lkdGg9IjEiLz4KPHJlY3QgeD0iMjUiIHk9IjE3IiB3aWR0aD0iOCIgaGVpZ2h0PSI2IiBmaWxsPSIjRThGNUU5IiBzdHJva2U9IiMyRTdEMzIiIHN0cm9rZS13aWR0aD0iMSIvPgo8cmVjdCB4PSI3IiB5PSIxNyIgd2lkdGg9IjQiIGhlaWdodD0iNiIgZmlsbD0iI0U4RjVFOSIgc3Ryb2tlPSIjMkU3RDMyIiBzdHJva2Utd2lkdGg9IjEiLz4KPHJlY3QgeD0iNyIgeT0iMjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiBmaWxsPSIjRThGNUU5IiBzdHJva2U9IiMyRTdEMzIiIHN0cm9rZS13aWR0aD0iMSIvPgo8cmVjdCB4PSIxOSIgeT0iMjUiIHdpZHRoPSIxMCIgaGVpZ2h0PSI2IiBmaWxsPSIjRThGNUU5IiBzdHJva2U9IiMyRTdEMzIiIHN0cm9rZS13aWR0aD0iMSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0LjUiIGZpbGw9IiMxQjVFMjAiLz4KPC9zdmc+Cg==';

  class RPGCollisions {
    constructor() {
      this.MICRO_STEP = 2;
    }

    getInfo() {
      return {
        id: 'rpgcollisions',
        name: 'RPG Collisions',
        color1: '#4CAF50',
        color2: '#43A047',
        color3: '#2E7D32',
        blockIconURI: ICON,
        menuIconURI: ICON,
        blocks: [
          {
            opcode: 'setTag',
            blockType: Scratch.BlockType.COMMAND,
            text: 'tag this sprite as [TAG]',
            arguments: {
              TAG: { type: Scratch.ArgumentType.STRING, menu: 'tags', defaultValue: TAG_WALL }
            }
          },
          {
            opcode: 'getTag',
            blockType: Scratch.BlockType.REPORTER,
            text: 'tag of this sprite'
          },
          {
            opcode: 'isSpriteTagged',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[SPRITE] is tagged as [TAG] ?',
            arguments: {
              SPRITE: { type: Scratch.ArgumentType.STRING, menu: 'spriteMenu' },
              TAG: { type: Scratch.ArgumentType.STRING, menu: 'tags', defaultValue: TAG_WALL }
            }
          },
          {
            opcode: 'enableCollisions',
            blockType: Scratch.BlockType.COMMAND,
            text: 'enable this sprite from rpg collisions'
          },
          {
            opcode: 'disableCollisions',
            blockType: Scratch.BlockType.COMMAND,
            text: 'disable this sprite from rpg collisions'
          },
          {
            opcode: 'collisionsEnabled',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'rpg collisions enabled for this sprite?'
          },
          '---',
          {
            opcode: 'moveAvoidingWalls',
            blockType: Scratch.BlockType.COMMAND,
            text: 'move [STEPS] steps avoiding walls',
            arguments: {
              STEPS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'stepInDirection',
            blockType: Scratch.BlockType.COMMAND,
            text: 'step [STEPS] steps in direction [DIR] avoiding walls',
            arguments: {
              STEPS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              DIR: { type: Scratch.ArgumentType.ANGLE, defaultValue: 90 }
            }
          },
          {
            opcode: 'moveTowardsAvoidingWalls',
            blockType: Scratch.BlockType.COMMAND,
            text: 'move up to [STEPS] steps towards x: [X] y: [Y] avoiding walls',
            arguments: {
              STEPS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'pushOutOfWalls',
            blockType: Scratch.BlockType.COMMAND,
            text: 'push out of any wall I\'m stuck in'
          },
          '---',
          {
            opcode: 'touchingWall',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'touching a wall?'
          },
          {
            opcode: 'wouldTouchWallAt',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'would touch a wall at x: [X] y: [Y] ?',
            arguments: {
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'whenTouchingWall',
            blockType: Scratch.BlockType.HAT,
            text: 'when I touch a wall',
            isEdgeActivated: true
          }
        ],
        menus: {
          tags: {
            acceptReporters: false,
            items: [
              { text: 'wall', value: TAG_WALL },
              { text: 'player', value: TAG_PLAYER },
              { text: 'none (decoration/UI)', value: TAG_NONE }
            ]
          },
          spriteMenu: {
            acceptReporters: true,
            items: 'getSpriteMenu'
          }
        }
      };
    }

    // ---------- menu helpers ----------

    getSpriteMenu() {
      const names = runtime.targets
        .filter(t => t.isOriginal && !t.isStage)
        .map(t => t.getName());
      return names.length ? names : [''];
    }


    getTagOf(target) {
      if (!target) return TAG_NONE;
      return target.rpgCollisionTag || TAG_NONE;
    }

    setTag(args, util) {
      const tag = String(args.TAG);
      util.target.rpgCollisionTag = (tag === TAG_WALL || tag === TAG_PLAYER) ? tag : TAG_NONE;
    }

    getTag(args, util) {
      return this.getTagOf(util.target);
    }

    isSpriteTagged(args) {
      const spriteName = String(args.SPRITE);
      const target = runtime.getSpriteTargetByName(spriteName);
      return this.getTagOf(target) === String(args.TAG);
    }
.

    isEnabledTarget(target) {
      if (!target) return false;
      return target.rpgCollisionEnabled !== false;
    }

    enableCollisions(args, util) {
      util.target.rpgCollisionEnabled = true;
    }

    disableCollisions(args, util) {
      util.target.rpgCollisionEnabled = false;
    }

    collisionsEnabled(args, util) {
      return this.isEnabledTarget(util.target);
    }

    

    getWallDrawableIDs(excludeTarget) {
      const ids = [];
      for (const t of runtime.targets) {
        if (t === excludeTarget) continue;
        if (t.isStage) continue;
        if (this.getTagOf(t) === TAG_WALL && this.isEnabledTarget(t)) {
          ids.push(t.drawableID);
        }
      }
      return ids;
    }

    isTouchingWalls(target) {
      if (!runtime.renderer) return false;
      if (!this.isEnabledTarget(target)) return false;
      const wallIDs = this.getWallDrawableIDs(target);
      if (wallIDs.length === 0) return false;
      return runtime.renderer.isTouchingDrawables(target.drawableID, wallIDs);
    }

    
    slideMove(target, dxUnit, dyUnit, distance) {
      const step = this.MICRO_STEP;
      let moved = 0;
      const total = Math.abs(distance);
      const sign = distance < 0 ? -1 : 1;

      while (moved < total) {
        const thisStep = Math.min(step, total - moved);
        const oldX = target.x;
        const oldY = target.y;
        const nx = oldX + dxUnit * thisStep * sign;
        const ny = oldY + dyUnit * thisStep * sign;
        target.setXY(nx, ny);
        if (this.isTouchingWalls(target)) {
          target.setXY(oldX, oldY);
          break;
        }
        moved += thisStep;
      }
      return moved;
    }

    

    moveAvoidingWalls(args, util) {
      const target = util.target;
      const steps = Number(args.STEPS) || 0;
      const radians = (90 - target.direction) * Math.PI / 180;
      const dx = Math.cos(radians);
      const dy = Math.sin(radians);
      this.slideMove(target, dx, dy, steps);
    }

    stepInDirection(args, util) {
      const target = util.target;
      const steps = Number(args.STEPS) || 0;
      const dir = Number(args.DIR) || 0;
      const radians = (90 - dir) * Math.PI / 180;
      const dx = Math.cos(radians);
      const dy = Math.sin(radians);
      this.slideMove(target, dx, dy, steps);
    }

    moveTowardsAvoidingWalls(args, util) {
      const target = util.target;
      const targetX = Number(args.X) || 0;
      const targetY = Number(args.Y) || 0;
      const diffX = targetX - target.x;
      const diffY = targetY - target.y;
      const distToPoint = Math.sqrt(diffX * diffX + diffY * diffY);
      if (distToPoint < 0.001) return;

      const dxUnit = diffX / distToPoint;
      const dyUnit = diffY / distToPoint;
      const steps = Math.min(Number(args.STEPS) || 0, distToPoint);
      this.slideMove(target, dxUnit, dyUnit, steps);
    }

    pushOutOfWalls(args, util) {
      const target = util.target;
      if (!this.isTouchingWalls(target)) return;

 .
      const maxRadius = 64;
      for (let radius = this.MICRO_STEP; radius <= maxRadius; radius += this.MICRO_STEP) {
        for (let angle = 0; angle < 360; angle += 15) {
          const radians = angle * Math.PI / 180;
          const nx = target.x + Math.cos(radians) * radius;
          const ny = target.y + Math.sin(radians) * radius;
          const oldX = target.x;
          const oldY = target.y;
          target.setXY(nx, ny);
          if (!this.isTouchingWalls(target)) return;
          target.setXY(oldX, oldY);
        }
      }
    }



    touchingWall(args, util) {
      return this.isTouchingWalls(util.target);
    }

    wouldTouchWallAt(args, util) {
      const target = util.target;
      const oldX = target.x;
      const oldY = target.y;
      target.setXY(Number(args.X) || 0, Number(args.Y) || 0);
      const result = this.isTouchingWalls(target);
      target.setXY(oldX, oldY);
      return result;
    }

    whenTouchingWall(args, util) {
      return this.isTouchingWalls(util.target);
    }
  }

  Scratch.extensions.register(new RPGCollisions());
})(Scratch);
