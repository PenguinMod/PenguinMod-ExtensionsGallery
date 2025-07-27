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

function isInCorrectFormat(inputString) {
    if ((inputString != parseInt(inputString, 10).toString(10)) && (inputString != parseInt(inputString, 16).toString(16))) {
        console.log(inputString);
        console.log(parseInt(inputString).toString(10));
        console.log(parseInt(inputString, 16).toString(16));
        return false;
    }
    console.log("good");
    return true;
};

(function(Scratch){
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        // throw new Error("This extension prefers to be used unsandboxed");
    }

    class Extension {
        getInfo() {
            return {
                id: "notrealidipromiselol",
                name: Scratch.translate("Bits and Hexa"),
                color1: "#15448f",
                color2: "#0f1f70",
                color3: "#0a094f",
                // docsURI: "setupwhenyouhavetimeto.com",
                // menuIconURI: "you get it",
                // blockIconURI: "oo I can do this too",

                blocks: [
                    {
                        opcode: "isNumActuallyBase",
                        text: "is [NUM] [BASE]?",
                        blockType: Scratch.BlockType.BOOLEAN,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            BASE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "BASES",
                            },
                        },
                    },
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
                    },
                    {
                        opcode: "bitHexManipulationLabel",
                        text: "Bitwise Manipulation",
                        blockType: Scratch.BlockType.LABEL,
                    },
                ],
                menus: {
                    BASES: {
                        acceptReporters: false,
                        items: ['decimal', 'binary', 'hexadecimal'],
                    },
                },
            };
        }
        
        isNumActuallyBase(args) {
            var computeValue = args.NUM;
            if (isInCorrectFormat(args.NUM) === false) {
                console.log("bad");
                return false;
            }

            switch (args.BASE) {
                case 'decimal':
                    console.log(parseInt(computeValue, 10).toString(10));
                    console.log(computeValue);
                    console.log(parseInt(computeValue, 10).toString(10) === computeValue);
                    return (parseInt(computeValue, 10).toString(10) === computeValue);
                case 'binary':
                    return (parseInt(computeValue, 2).toString(2) === computeValue);
                case 'hexadecimal':
                    return (parseInt(computeValue, 16).toString(16) === computeValue);
            }

        }

        convertBaseTypes(args) {
            var computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (computeValue === parseInt(computeValue, 16).toString(16)) {
                computeValue = "0x" + computeValue;
            }
            computeValue = parseInt(computeValue);

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