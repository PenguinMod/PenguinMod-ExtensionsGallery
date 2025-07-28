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
    if ((inputString != parseInt(inputString, 10).toString(10)) && !isItHexadecimal(inputString)) {
        return false;
    }
    console.log("good");
    return true;
};

function isItHexadecimal(inputString) {
    return !/[^abcdef0123456789]/i.test(inputString);
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
                                defaultValue: "1011",
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
                                defaultValue: "4b2",
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
                    {
                        opcode: "signedRightShiftBitz",
                        text: "[NUM] >> [AMOUNT]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "4b2",
                            },
                            AMOUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3,
                            }
                        },
                    },
                    {
                        opcode: "leftShiftBitz",
                        text: "[NUM] << [AMOUNT]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "31",
                            },
                            AMOUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2,
                            }
                        },
                    },
                    {
                        opcode: "unsignedRightShiftBitz",
                        text: "[NUM] >>> [AMOUNT]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "fe5",
                            },
                            AMOUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5,
                            }
                        },
                    },
                    {
                        opcode: "circularRightShiftBitz",
                        text: "[NUM] ↻ [AMOUNT]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "fe5",
                            },
                            AMOUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5,
                            }
                        },
                    },
                    {
                        opcode: "circularLeftShiftBitz",
                        text: "[NUM] ↺ [AMOUNT]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "fe5",
                            },
                            AMOUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5,
                            }
                        },
                    },
                    {
                        opcode: "bitHexBitwiseOpratorsLabel",
                        text: "Bitwise Operators",
                        blockType: Scratch.BlockType.LABEL,
                    },
                    {
                        opcode: "bitwiseAndOperator",
                        text: "[NUM] & [NUM2] | and",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            NUM2: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        },
                    },
                    {
                        opcode: "bitwiseOrOperator",
                        text: "[NUM] | [NUM2] | or",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            NUM2: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        },
                    },
                    {
                        opcode: "bitwiseXorOperator",
                        text: "[NUM] ^ [NUM2] | xor",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            NUM2: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        },
                    },
                    {
                        opcode: "bitwiseNotOperator",
                        text: "~[NUM] | not",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                        },
                    },
                    {
                        opcode: "bitwiseNandOperator",
                        text: "~[NUM] & [NUM2] | nand",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            NUM2: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        },
                    },
                    {
                        opcode: "bitwiseNorOperator",
                        text: "~[NUM] | [NUM2] | nor",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            NUM2: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        },
                    },
                    {
                        opcode: "bitwiseXnorOperator",
                        text: "~[NUM] ^ [NUM2] | xnor",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            NUM2: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        },
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
            if (isInCorrectFormat(computeValue) === false) {
                console.log("bad");
                return false;
            }

            switch (args.BASE) {
                case 'decimal':
                    return !/[^0123456789-]/.test(computeValue);
                case 'binary':
                    return !/[^01]/.test(computeValue);
                case 'hexadecimal':
                    return isItHexadecimal(computeValue);
            }

        }

        convertBaseTypes(args) {
            var computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
                console.log("hexa");
            }
            computeValue = parseInt(computeValue);

            switch (args.BASE) {
                case 'decimal':
                    computeValue = computeValue.toString(10);
                case 'binary':
                    if (computeValue < 0) {
                        console.log("huh cool");
                        computeValue *= -1;
                        computeValue = ~computeValue;
                        computeValue++;
                    }
                    computeValue = computeValue.toString(2);
                case 'hexadecimal':
                    if (computeValue < 0) {
                        computeValue *= -1;
                        computeValue = ~computeValue;
                        computeValue++;
                    }
                    computeValue = computeValue.toString(16);
            }

            return computeValue;
        }

        signedRightShiftBitz(args) {
            var computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (!parseInt(args.AMOUNT)) {
                return computeValue;
            }
            if (isNaN(parseInt(computeValue)) || isNaN(parseInt(args.AMOUNT)) || parseInt(args.AMOUNT) < 0) {
                return "";
            }
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue >> args.AMOUNT;
        }

        leftShiftBitz(args) {
            var computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (!parseInt(args.AMOUNT)) {
                return computeValue;
            }
            if (isNaN(parseInt(computeValue)) || isNaN(parseInt(args.AMOUNT)) || parseInt(args.AMOUNT) < 0) {
                return "";
            }
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue << args.AMOUNT;
        }

        unsignedRightShiftBitz(args) {
            var computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (!parseInt(args.AMOUNT)) {
                return computeValue;
            }
            if (isNaN(parseInt(computeValue)) || isNaN(parseInt(args.AMOUNT)) || parseInt(args.AMOUNT) < 0) {
                return "";
            }
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue >>> args.AMOUNT;
        }

        circularRightShiftBitz(args) {
            var computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (!parseInt(args.AMOUNT)) {
                return computeValue;
            }
            if (isNaN(parseInt(computeValue)) || isNaN(parseInt(args.AMOUNT)) || parseInt(args.AMOUNT) < 0) {
                return "";
            }
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue >> args.AMOUNT | computeValue << (32 - args.AMOUNT);
        }

        circularLeftShiftBitz(args) {
            var computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (!parseInt(args.AMOUNT)) {
                return computeValue;
            }
            if (isNaN(parseInt(computeValue)) || isNaN(parseInt(args.AMOUNT)) || parseInt(args.AMOUNT) < 0) {
                return "";
            }
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue << args.AMOUNT | computeValue >> (32 - args.AMOUNT);
        }

        bitwiseAndOperator(args) {
            var value1 = args.NUM;
            var value2 = args.NUM2;
            if (!isInCorrectFormat(value1) && !isInCorrectFormat(value2)) {
                return "";
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                console.log(value1);
                value1 = "0x" + value1;
                console.log(value1);
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }

            return value1 & value2;
        }

        bitwiseOrOperator(args) {
            var value1 = args.NUM;
            var value2 = args.NUM2;
            if (!isInCorrectFormat(value1) && !isInCorrectFormat(value2)) {
                return "";
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }

            return value1 | value2;
        }

        bitwiseXorOperator(args) {
            var value1 = args.NUM;
            var value2 = args.NUM2;
            if (!isInCorrectFormat(value1) && !isInCorrectFormat(value2)) {
                return "";
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }

            return value1 ^ value2;
        }

        bitwiseNotOperator(args) {
            var value1 = args.NUM;
            if (!isInCorrectFormat(value1)) {
                return "";
            }
            if (isNaN(parseInt(value1))) {
                return "";
            }
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }

            return ~value1;
        }

        bitwiseNandOperator(args) {
            var value1 = args.NUM;
            var value2 = args.NUM2;
            if (!isInCorrectFormat(value1) && !isInCorrectFormat(value2)) {
                return "";
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }

            return !(value1 & value2);
        }

        bitwiseNorOperator(args) {
            var value1 = args.NUM;
            var value2 = args.NUM2;
            if (!isInCorrectFormat(value1) && !isInCorrectFormat(value2)) {
                return "";
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }

            return !(value1 | value2);
        }

        bitwiseXnorOperator(args) {
            var value1 = args.NUM;
            var value2 = args.NUM2;
            if (!isInCorrectFormat(value1) && !isInCorrectFormat(value2)) {
                return "";
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }

            return !(value1 ^ value2);
        }
    }
    Scratch.extensions.register(new Extension());
})(Scratch);