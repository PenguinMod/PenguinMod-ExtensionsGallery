(function(Scratch) {
    'use strict';

    class RaycastExtension {
        constructor() {
            this.rayData = [];
            this.maxRays = 360;
            this.disabledSprites = new Set();
        }

        getInfo() {
            return {
                id: 'gatocmyextension',
                name: 'Raycast',
                color1: '#FF6B35',
                color2: '#F7931E',
                color3: '#FFD23F',
                blocks: [
                    {
                        opcode: 'castRay',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'cast ray from X [X] Y [Y] direction [DIRECTION] distance [DISTANCE]',
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            DIRECTION: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 90
                            },
                            DISTANCE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    },
                    {
                        opcode: 'castMultipleRays',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'cast [COUNT] rays from X [X] Y [Y] spread [SPREAD] degrees distance [DISTANCE]',
                        arguments: {
                            COUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 8
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SPREAD: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 360
                            },
                            DISTANCE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 200
                            }
                        }
                    },
                    {
                        opcode: 'getHitSpriteX',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'hit sprite X at ray [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getHitSpriteY',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'hit sprite Y at ray [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getHitSpriteSize',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'hit sprite size at ray [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getHitSpriteName',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'hit sprite name at ray [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getHitDistance',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'hit distance at ray [INDEX]',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getRayCount',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'number of active rays'
                    },
                    {
                        opcode: 'rayHitSprite',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'ray [INDEX] hit a sprite?',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getRayX',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ray [INDEX] X',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getRayY',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ray [INDEX] Y',
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'disableThisSprite',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'disable this sprite from ray detection'
                    },
                    {
                        opcode: 'enableThisSprite',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'enable this sprite from ray detection'
                    },
                    {
                        opcode: 'clearRays',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear all rays'
                    }
                ]
            };
        }

        castRay(args, util) {
            const startX = Scratch.Cast.toNumber(args.X);
            const startY = Scratch.Cast.toNumber(args.Y);
            const direction = Scratch.Cast.toNumber(args.DIRECTION);
            const maxDistance = Scratch.Cast.toNumber(args.DISTANCE);

            const rayResult = this.performRaycast(startX, startY, direction, maxDistance, util);
            
            this.rayData = [rayResult];
            
            if (rayResult.hit) {
                return `Hit: ${rayResult.spriteName} at (${rayResult.hitX.toFixed(1)}, ${rayResult.hitY.toFixed(1)})`;
            } else {
                return 'No hit';
            }
        }

        castMultipleRays(args, util) {
            const count = Math.min(Math.max(1, Scratch.Cast.toNumber(args.COUNT)), this.maxRays);
            const startX = Scratch.Cast.toNumber(args.X);
            const startY = Scratch.Cast.toNumber(args.Y);
            const spread = Scratch.Cast.toNumber(args.SPREAD);
            const maxDistance = Scratch.Cast.toNumber(args.DISTANCE);

            this.rayData = [];

            const angleStep = count > 1 ? spread / (count - 1) : 0;
            const startAngle = -spread / 2;

            for (let i = 0; i < count; i++) {
                const direction = startAngle + (angleStep * i);
                const rayResult = this.performRaycast(startX, startY, direction, maxDistance, util);
                this.rayData.push(rayResult);
            }
        }

        performRaycast(startX, startY, direction, maxDistance, util) {
            const runtime = util.runtime;
            
            const angleRad = (direction * Math.PI) / 180;
            const deltaX = Math.sin(angleRad);
            const deltaY = Math.cos(angleRad);

            let closestHit = null;
            let closestDistance = maxDistance;

            const allSprites = runtime.targets.filter(target => {
                return !target.isStage && 
                       target !== util.target && 
                       target.visible &&
                       !this.disabledSprites.has(target.getName());
            });

            console.log(`Raycasting from (${startX}, ${startY}) direction ${direction}° distance ${maxDistance}`);
            console.log(`Found ${allSprites.length} sprites to check`);

            for (const target of allSprites) {
                console.log(`Checking sprite: ${target.getName()} at (${target.x}, ${target.y})`);
                
                const hitResult = this.checkRayTargetIntersection(
                    startX, startY, deltaX, deltaY, maxDistance, target
                );

                if (hitResult) {
                    console.log(`Hit detected at distance ${hitResult.distance}`);
                    if (hitResult.distance < closestDistance) {
                        closestDistance = hitResult.distance;
                        closestHit = {
                            hit: true,
                            spriteName: target.getName(),
                            spriteX: target.x,
                            spriteY: target.y,
                            spriteSize: target.size,
                            hitX: hitResult.hitX,
                            hitY: hitResult.hitY,
                            distance: hitResult.distance
                        };
                    }
                }
            }

            if (closestHit) {
                console.log(`Closest hit: ${closestHit.spriteName} at distance ${closestHit.distance}`);
                return closestHit;
            } else {
                console.log('No hits detected');
                return {
                    hit: false,
                    spriteName: '',
                    spriteX: 0,
                    spriteY: 0,
                    spriteSize: 0,
                    hitX: startX + deltaX * maxDistance,
                    hitY: startY + deltaY * maxDistance,
                    distance: maxDistance
                };
            }
        }

        checkRayTargetIntersection(startX, startY, deltaX, deltaY, maxDistance, target) {
            const spriteX = target.x;
            const spriteY = target.y;
            const spriteSize = target.size / 100;

            let bounds = null;
            try {
                if (target.getBounds) {
                    bounds = target.getBounds();
                }
            } catch (e) {
              
            }

            let width, height;
            if (bounds) {
                width = bounds.width;
                height = bounds.height;
            } else {

                const costume = target.getCostume();
                if (costume) {
                    width = (costume.bitmapResolution ? costume.size[0] : costume.rotationCenterX * 2) * spriteSize;
                    height = (costume.bitmapResolution ? costume.size[1] : costume.rotationCenterY * 2) * spriteSize;
                } else {
                    width = 60 * spriteSize;
                    height = 60 * spriteSize;
                }
            }


            width = Math.max(width, 30);
            height = Math.max(height, 30);


            const padding = 5;
            const left = spriteX - (width / 2) - padding;
            const right = spriteX + (width / 2) + padding;
            const bottom = spriteY - (height / 2) - padding;
            const top = spriteY + (height / 2) + padding;

       
            let tNear = 0;
            let tFar = maxDistance;


            if (Math.abs(deltaX) > 0.001) {
                const t1 = (left - startX) / deltaX;
                const t2 = (right - startX) / deltaX;
                tNear = Math.max(tNear, Math.min(t1, t2));
                tFar = Math.min(tFar, Math.max(t1, t2));
            } else {

                if (startX < left || startX > right) return null;
            }


            if (Math.abs(deltaY) > 0.001) {
                const t1 = (bottom - startY) / deltaY;
                const t2 = (top - startY) / deltaY;
                tNear = Math.max(tNear, Math.min(t1, t2));
                tFar = Math.min(tFar, Math.max(t1, t2));
            } else {

                if (startY < bottom || startY > top) return null;
            }


            if (tNear <= tFar && tNear >= 0 && tNear <= maxDistance) {
                const hitX = startX + deltaX * tNear;
                const hitY = startY + deltaY * tNear;
                
                return {
                    hitX: hitX,
                    hitY: hitY,
                    distance: tNear
                };
            }

            return null;
        }

        getHitSpriteX(args) {
            const index = Math.floor(Scratch.Cast.toNumber(args.INDEX)) - 1;
            if (index >= 0 && index < this.rayData.length && this.rayData[index].hit) {
                return this.rayData[index].spriteX;
            }
            return 0;
        }

        getHitSpriteY(args) {
            const index = Math.floor(Scratch.Cast.toNumber(args.INDEX)) - 1;
            if (index >= 0 && index < this.rayData.length && this.rayData[index].hit) {
                return this.rayData[index].spriteY;
            }
            return 0;
        }

        getHitSpriteSize(args) {
            const index = Math.floor(Scratch.Cast.toNumber(args.INDEX)) - 1;
            if (index >= 0 && index < this.rayData.length && this.rayData[index].hit) {
                return this.rayData[index].spriteSize;
            }
            return 0;
        }

        getHitSpriteName(args) {
            const index = Math.floor(Scratch.Cast.toNumber(args.INDEX)) - 1;
            if (index >= 0 && index < this.rayData.length && this.rayData[index].hit) {
                return this.rayData[index].spriteName;
            }
            return '';
        }

        getHitDistance(args) {
            const index = Math.floor(Scratch.Cast.toNumber(args.INDEX)) - 1;
            if (index >= 0 && index < this.rayData.length) {
                return this.rayData[index].distance;
            }
            return 0;
        }

        getRayCount() {
            return this.rayData.length;
        }

        rayHitSprite(args) {
            const index = Math.floor(Scratch.Cast.toNumber(args.INDEX)) - 1;
            if (index >= 0 && index < this.rayData.length) {
                return this.rayData[index].hit;
            }
            return false;
        }

        getRayX(args) {
            const index = Math.floor(Scratch.Cast.toNumber(args.INDEX)) - 1;
            if (index >= 0 && index < this.rayData.length) {
                return this.rayData[index].hitX;
            }
            return 0;
        }

        getRayY(args) {
            const index = Math.floor(Scratch.Cast.toNumber(args.INDEX)) - 1;
            if (index >= 0 && index < this.rayData.length) {
                return this.rayData[index].hitY;
            }
            return 0;
        }

        disableThisSprite(args, util) {
            const spriteName = util.target.getName();
            this.disabledSprites.add(spriteName);
            console.log(`Disabled sprite from ray detection: ${spriteName}`);
        }

        enableThisSprite(args, util) {
            const spriteName = util.target.getName();
            this.disabledSprites.delete(spriteName);
            console.log(`Enabled sprite for ray detection: ${spriteName}`);
        }

        clearRays() {
            this.rayData = [];
        }
    }

    Scratch.extensions.register(new RaycastExtension());
})(Scratch);
