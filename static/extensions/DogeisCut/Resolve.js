// Name: Resolve
// ID: dogeiscutresolve
// Description: Utility blocks that enables ease in creation of projects with dynamic resolution.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Resolve\' must run unsandboxed!');
    }

    class Resolve {
        getInfo() {
            return {
                id: 'dogeiscutresolve',
                name: 'Resolve',
                color1: "#009dff",
                docsURI: 'https://extensions.penguinmod.com/docs/Resolve',
                blocks: [
                    {
                        opcode: 'whenWindowResized',
                        blockType: Scratch.BlockType.EVENT,
                        text: 'when window resized',
                        isEdgeActivated: false
                    },
                    '---',
                    {
                        opcode: 'suggestedStageWidth',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'suggested stage width',
                    },
                    {
                        opcode: 'suggestedStageHeight',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'suggested stage height',
                    },
                    '---',
                    {
                        opcode: 'devicePixelRatio',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'device pixel ratio',
                    },
                    '---',
                    {
                        opcode: 'screenResolution',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'screen resolution [DIM]',
                        arguments: {
                            DIM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'dimensionMenu',
                                defaultValue: 'width'
                            }
                        }
                    },
                    {
                        opcode: 'innerResolution',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'inner resolution [DIM]',
                        arguments: {
                            DIM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'dimensionMenu',
                                defaultValue: 'width'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'stageEdgePositionX',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'x of a stage with width [WIDTH]\'s [EDGE]',
                        arguments: {
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.suggestedStageWidth()
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.suggestedStageHeight()
                            },
                            EDGE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'stageEdgeMenu',
                                defaultValue: 'top left corner'
                            }
                        }
                    },
                    {
                        opcode: 'stageEdgePositionY',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'y of a stage with height [HEIGHT]\'s [EDGE]',
                        arguments: {
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.suggestedStageWidth()
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.suggestedStageHeight()
                            },
                            EDGE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'stageEdgeMenu',
                                defaultValue: 'top left corner'
                            }
                        }
                    },
                    {
                        opcode: 'stageAnchorX',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'x of stage anchor at [PERCENT]% to the right of a stage with width [WIDTH]',
                        arguments: {
                            PERCENT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            },
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.suggestedStageWidth()
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.suggestedStageHeight()
                            },
                        }
                    },
                    {
                        opcode: 'stageAnchorY',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'y of stage anchor at [PERCENT]% to the bottom of a stage with height [HEIGHT]',
                        arguments: {
                            PERCENT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            },
                            WIDTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.suggestedStageWidth()
                            },
                            HEIGHT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: this.suggestedStageHeight()
                            },
                        }
                    }
                ],
                menus: {
                    dimensionMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'width', value: 'width' },
                            { text: 'height', value: 'height' }
                        ]
                    },
                    axisMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'x', value: 'x' },
                            { text: 'y', value: 'y' }
                        ]
                    },
                    stageEdgeMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'top left corner', value: 'top left corner' },
                            { text: 'top edge', value: 'top edge' },
                            { text: 'top right corner', value: 'top right corner' },
                            { text: 'right edge', value: 'right edge' },
                            { text: 'bottom right corner', value: 'bottom right corner' },
                            { text: 'bottom edge', value: 'bottom edge' },
                            { text: 'bottom left corner', value: 'bottom left corner' },
                            { text: 'left edge', value: 'left edge' }
                        ]
                    }
                }
            }
        }

        suggestedStageWidth() {
            const width = Math.max(360, Math.round((window.innerWidth / window.innerHeight) * 360));
            return width;
        }

        suggestedStageHeight() {
            if (window.innerHeight > window.innerWidth) {
            return Math.round((window.innerHeight / window.innerWidth) * 360);
            }
            return 360;
        }

        screenResolution(args) {
            const DIM = Scratch.Cast.toString(args.DIM);
            return DIM === 'width' ? window.screen.width : window.screen.height;
        }

        innerResolution(args) {
            const DIM = Scratch.Cast.toString(args.DIM);
            return DIM === 'width' ? window.innerWidth : window.innerHeight;
        }

        devicePixelRatio() {
            return window.devicePixelRatio;
        }

        stageEdgePosition(axis, args) {
            const AXIS = axis;
            const EDGE = Scratch.Cast.toString(args.EDGE);
            const WIDTH = Scratch.Cast.toNumber(args.WIDTH);
            const HEIGHT = Scratch.Cast.toNumber(args.HEIGHT);

            switch (EDGE) {
                case 'top left corner':
                    return AXIS === 'x' ? -WIDTH / 2 : -HEIGHT / 2;
                case 'top edge':
                    return AXIS === 'x' ? 0 : -HEIGHT / 2;
                case 'top right corner':
                    return AXIS === 'x' ? WIDTH / 2 : -HEIGHT / 2;
                case 'right edge':
                    return AXIS === 'x' ? WIDTH / 2 : 0;
                case 'bottom right corner':
                    return AXIS === 'x' ? WIDTH / 2 : HEIGHT / 2;
                case 'bottom edge':
                    return AXIS === 'x' ? 0 : HEIGHT / 2;
                case 'bottom left corner':
                    return AXIS === 'x' ? -WIDTH / 2 : HEIGHT / 2;
                default: // 'left edge'
                    return AXIS === 'x' ? -WIDTH / 2 : 0;
            }
        }

        stageEdgePositionX(args) {
            return this.stageEdgePosition('x', args);
        }
        stageEdgePositionY(args) {
            return this.stageEdgePosition('y', args);
        }

        stageAnchorX(args) {
            const PERCENT = Scratch.Cast.toNumber(args.PERCENT);
            const WIDTH = Scratch.Cast.toNumber(args.WIDTH);

            return (-WIDTH / 2) + (WIDTH * (PERCENT / 100));
        }

        stageAnchorY(args) {
            const PERCENT = Scratch.Cast.toNumber(args.PERCENT);
            const HEIGHT = Scratch.Cast.toNumber(args.HEIGHT);

            return (-HEIGHT / 2) + (HEIGHT * (PERCENT / 100));
        }
    }
    
    window.addEventListener('resize', () => {
        Scratch.vm.runtime.startHats('dogeiscutresolve_whenWindowResized');
    });

    Scratch.extensions.register(new Resolve());
})(Scratch);