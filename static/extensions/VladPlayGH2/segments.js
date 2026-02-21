// Name: Segments
// ID: vpsegments
// Description: Split text into various segments!
// License: MIT AND MPL-2.0

class segments {
    getInfo() {
        return {
            id: 'vpsegments',
            name: 'Segments',
            color1: "#ff8080",
            blocks: [
                {
                    opcode: 'splitIntoSegments',
                    blockType: 'reporter',
                    text: 'split [TEXT] into [NUM] segments',
                    arguments: {
                        TEXT: {
                            type: 'string',
                            defaultValue: 'foobar'
                        },
                        NUM: {
                            type: 'number',
                            defaultValue: 2
                        }
                    }
                }
            ]
        };
    }

    splitIntoSegments(args) {
        const text = String(args.TEXT);
        const num = Math.max(1, parseInt(args.NUM));
        const segmentLength = Math.ceil(text.length / num);
        const segments = [];

        for (let i = 0; i < text.length; i += segmentLength) {
            segments.push(text.substring(i, i + segmentLength));
        }

        // arrays yay
        return JSON.stringify(segments); 
    }
}
Scratch.extensions.register(new segments());
