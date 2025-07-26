/**
Copyright (c) 2025 BurningHot687

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

/* 
    By BurningHot687 (Raichu-Model or Raichu-Rig on Scratch). In case you can't tell I have basically no idea what I'm doing lol. What even is this license :sob:

    put some kind of documentation here so I don't have to think of it later

    oh all the blocks assume you are using decimal input unless it's shown to be hexadecimal

    TO-DO:

    - Add more of the blocks that TrueFantom had
    - Get feedback

*/

(function(Scratch){
    "use strict";
    class Extension {
        getInfo() {
            return {
                id: "notrealidipromiselol",
                name: "Bits and Hexa",
                color1: "#15448f",
                color2: "#0f1f70",
                color3: "#0a094f",
                // docsuri: "setupwhenyouhavetimeto.com",
                blocks: [
                    {
                        opcode: "convertBaseTypes",
                        text: "convert [NUM] to [BASE]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        // allowDropAnywhere: true, could potentially save on blocks in minor use cases and doesn't harm otherwise?
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            BASE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "BASES",
                            },
                        },
                    }
                ],
                menus: {
                    BASES: {
                        acceptReporters: false,
                        items: ['decimal', 'binary', 'hexadecimal'],
                    },
                },
            };
        }

        convertBaseTypes(args) {
            var computeValue = args.NUM;
            if (!parseInt(computeValue) && !parseInt(computeValue, 16)) {
                console.log("bad");
                return "";
            }
            else {
                console.log("good!");
                computeValue = parseInt(computeValue);
            }
            
            switch (args.BASE) {
                case 'decimal':
                    computeValue = computeValue.toString(10);
                case 'binary':
                    computeValue = computeValue.toString(2);
                case 'hexadecimal':
                    computeValue = computeValue.toString(16);
            }

            return computeValue;
        }
    }
    Scratch.extensions.register(new Extension());
})(Scratch);
