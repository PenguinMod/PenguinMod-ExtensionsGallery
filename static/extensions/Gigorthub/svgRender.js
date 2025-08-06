(function(Scratch) {
    'use strict';

    const EXTENSION_ID = 'svgRenderExt';
    const SHAPE_NAME = 'svgShape';

    if (Scratch.gui) {
        Scratch.gui.getBlockly().then(ScratchBlocks => {
            ScratchBlocks.BlockSvg.registerCustomShape(`${EXTENSION_ID}-${SHAPE_NAME}`, {
                emptyInputPath: "m 16 0 h 16 h 12 a 4 4 0 0 1 4 4 l 0 24 a 4 4 0 0 1 -4 4 h -12 h -16 h -4 a 4 4 0 0 1 -4 -4 l 0 -12 l -7 0 a 1 1 0 0 1 -1 1 a 1 1 0 0 1 0 -2 a 1 1 0 0 1 1 1 l 7 0 l 0 -12 a 4 4 0 0 1 4 -4 z",
                emptyInputWidth: 19 * ScratchBlocks.BlockSvg.GRID_UNIT,
                leftPath: (block) => {
                    const s = block.edgeShapeWidth_ / 16;
                    const height = block.edgeShapeWidth_ * 2;
                    return [
                        `h ${-4 * s} a 4 4 0 0 1 -4 -4 l 0 ${-12 * s} l ${-7 * s} 0 a 1 1 0 0 1 -1 1 a 1 1 0 0 1 0 -2 a 1 1 0 0 1 1 1 l ${7 * s} 0 l 0 ${-12 * s} a 4 4 0 0 1 4 -4`
                    ];
                },
                rightPath: (block) => {
                    const s = block.edgeShapeWidth_ / 16;
                    return [
                        `h ${12 * s} a 4 4 0 0 1 4 4 l 0 ${24 * s} a 4 4 0 0 1 -4 4 h ${-12 * s}`
                    ];
                }
            });
        });
    }

    class SvgRenderExtension {
        getInfo() {
            return {
                id: EXTENSION_ID,
                name: 'SVG Render',
                color1: '#ff6680',
                color2: '#ff5570',
                color3: '#ff4460',
                blocks: [
                    {
                        opcode: 'renderSVG',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'render SVG [SVG]',
                        arguments: {
                            SVG: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '<svg width="100" height="100"><circle cx="50" cy="50" r="40" fill="red"/></svg>'
                            }
                        },
                        blockShape: `${EXTENSION_ID}-${SHAPE_NAME}`,
                        forceOutputType: `${EXTENSION_ID}-${SHAPE_NAME}`
                    }
                ]
            };
        }

        renderSVG({ SVG }) {
            return SVG;
        }
    }

    Scratch.extensions.register(new SvgRenderExtension());
})(Scratch);
