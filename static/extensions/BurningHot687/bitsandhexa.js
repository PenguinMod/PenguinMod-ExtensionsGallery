/**
Copyright (c) 2025 BurningHot687

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
**/

/* 
    By BurningHot687 (Raichu-Model or Raichu-Rig on Scratch). In case you can't tell I have basically no idea what I'm doing lol. What even is this license :sob:

    oh all the other blocks assume you are using decimal input unless it's shown to be hexadecimal

    TO-DO:

    - Add more of the blocks that TrueFantom had
    - Get feedback

*/

let fullLength = true;
const icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMjUgMjI1Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjkuNS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjAgQnVpbGQgMTQxKSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICMxYjQ2OGQ7CiAgICAgIH0KCiAgICAgIC5zdDIgewogICAgICAgIGZpbGw6ICMxNDY0OGE7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGNsYXNzPSJzdDEiIHdpZHRoPSIyMjUiIGhlaWdodD0iMjI1Ii8+CiAgPGc+CiAgICA8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjE3NC4wNiAxNC4wMSAxMTkuMjEgMTQuMDEgOTEuNzkgNjEuNTEgMTE5LjIxIDEwOS4wMSAxNzQuMDYgMTA5LjAxIDIwMS40OSA2MS41MSAxNzQuMDYgMTQuMDEiLz4KICAgIDxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjY1LjY1IiBjeT0iMTIyLjI2IiByPSI0Mi4xNCIvPgogICAgPHJlY3QgY2xhc3M9InN0MCIgeD0iMTE3LjE3IiB5PSIxMTcuOCIgd2lkdGg9Ijc0LjE4IiBoZWlnaHQ9IjkzLjE5IiByeD0iMTIiIHJ5PSIxMiIvPgogIDwvZz4KPC9zdmc+";
const iconCircle = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMjUgMjI1Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjkuNS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjAgQnVpbGQgMTQxKSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICMxNDY0OGE7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDIgewogICAgICAgIGZpbGw6ICMxYjQ2OGQ7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGNsYXNzPSJzdDIiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMjUiIGhlaWdodD0iMjI1IiByeD0iMTEyLjUiIHJ5PSIxMTIuNSIvPgogIDxnPgogICAgPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxNjMuODUgMzAuMzQgMTE4LjEgMzAuMzQgOTUuMjIgNjkuOTcgMTE4LjEgMTA5LjU5IDE2My44NSAxMDkuNTkgMTg2LjczIDY5Ljk3IDE2My44NSAzMC4zNCIvPgogICAgPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iNzMuNDIiIGN5PSIxMjAuNjQiIHI9IjM1LjE1Ii8+CiAgICA8cmVjdCBjbGFzcz0ic3QxIiB4PSIxMTYuNCIgeT0iMTE2LjkyIiB3aWR0aD0iNjEuODgiIGhlaWdodD0iNzcuNzQiIHJ4PSIxMC4wMSIgcnk9IjEwLjAxIi8+CiAgPC9nPgogIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01MS41MSwxOTAuMjNjLTMuNjksMC0zLjY5LDUuNzMsMCw1LjczczMuNjktNS43MywwLTUuNzNaIi8+CiAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTcwLjk3LDE3OS4wM2MtMy42OSwwLTMuNjksNS43MywwLDUuNzNzMy42OS01LjczLDAtNS43M1oiLz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjYuNzcsMTkzLjF2MS40NGMtLjI2LS4xNS0uNTEtLjMtLjc2LS40NS0zLjE0LTEuOTYtNi4wMiwzLTIuODksNC45NSwxLjA3LjY3LDIuMTksMS4yMiwzLjM2LDEuNywxLjI4LjUzLDIuNjMsMS4wMywzLjk5LjQsMS42NS0uNzYsMi4wMy0yLjM2LDIuMDQtNC4wM3YtNC4wMWMwLTMuNjktNS43Mi0zLjY5LTUuNzMsMFoiLz4KPC9zdmc+";

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
                id: "burninghot687bitwisewhexa",
                name: Scratch.translate("Bits and Hexa"),
                color1: "#15448f",
                color2: "#0f1f70",
                color3: "#0a094f",
                menuIconURI: iconCircle,
                blockIconURI: icon,

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
                        opcode: "convertBaseTypesBitW",
                        text: "convert [NUM] from dec/hexa to [BASE]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        // allowDropAnywhere: true, could potentially save on blocks in minor use cases and doesn't harm otherwise?
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "4d2",
                            },
                            BASE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "BASES",
                            },
                        },
                        switches: [ "convertBinaryToOtherTypes" ],
                    },
                    {
                        opcode: "convertBinaryToOtherTypes",
                        text: "convert [NUM] from binary to [BASE]",
                        /// hideFromPalette: true,
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "10011010010",
                            },
                            BASE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "BASES",
                            }
                        },
                        switches: [ "convertBaseTypesBitW" ],
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
                        switches: [ "leftShiftBitz", "unsignedRightShiftBitz", "circularRightShiftBitz", "circularLeftShiftBitz" ],
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
                        switches: [ "signedRightShiftBitz", "unsignedRightShiftBitz", "circularRightShiftBitz", "circularLeftShiftBitz" ],
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
                        switches: [ "signedRightShiftBitz", "leftShiftBitz", "circularRightShiftBitz", "circularLeftShiftBitz" ],
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
                        switches: [ "signedRightShiftBitz", "leftShiftBitz", "unsignedRightShiftBitz", "circularLeftShiftBitz" ],
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
                        switches: [ "signedRightShiftBitz", "leftShiftBitz", "unsignedRightShiftBitz", "circularRightShiftBitz" ],
                    },
                    {
                        opcode: "bitHexBitwiseOperatorsLabel",
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
                    {
                        opcode: "bitHexConfigurationLabel",
                        text: "Configuration Settings ⚠",
                        blockType: Scratch.BlockType.LABEL,
                    },
                    {
                        opcode: "binaryLengthSetter",
                        text: "use a [LENGTH] length for binary",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            LENGTH: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "LENGTHS",
                            }
                        },
                    },
                    {
                        opcode: "binaryLengthGetter",
                        text: "using [LENGTH] length?",
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            LENGTH: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "LENGTHS",
                            },
                        },
                    },
                ],
                menus: {
                    BASES: {
                        acceptReporters: false,
                        items: ['decimal', 'binary', 'hexadecimal'],
                    },
                    LENGTHS: {
                        acceptReporters: false,
                        items: ['fixed', 'dynamic'],
                    },
                },
            };
        }
        
        binaryLengthGetter(args) {
            switch (args.LENGTH) {
                case 'fixed':
                    return fullLength;
                case 'dynamic':
                    return !fullLength;
                default:
                    console.log("error here?");
                    break;
            }
        }

        binaryLengthSetter(args) {
            switch (args.LENGTH) {
                case 'fixed':
                    fullLength = true;
                    break;
                case 'dynamic':
                    fullLength = false;
                    break;
                default:
                    console.log("error here?");
                    break;
            }
        }

        isNumActuallyBase(args) {
            console.log(args.BASE);
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

        convertBaseTypesBitW(args) {
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
                    break;
                case 'binary':
                    /*if (computeValue < 0) {
                        console.log("huh cool");
                        computeValue = Math.abs(computeValue);
                        computeValue = ~computeValue;
                        computeValue++;
                    }*/
                    computeValue = (computeValue >>> 0).toString(2);
                    break;
                case 'hexadecimal':
                    /*if (computeValue < 0) {
                        computeValue = Math.abs(computeValue);
                        computeValue = ~computeValue;
                        computeValue++;
                    }*/
                    computeValue = (computeValue >>> 0).toString(16);
                    break;
                default:
                    console.log("failed?");
                    return "";
            }

            return computeValue;
        }

        convertBinaryToOtherTypes(args) {
            if (/[^01]/.test(args.NUM)) {
                return "";
            }
            var computeValue = 0;

            switch (args.BASE) {
                case 'decimal':
                    for (var i = args.NUM.length; i > 0; i--) {
                        computeValue = computeValue + (parseInt(args.NUM[i])*2^(args.NUM.length - i)).toString();
                    }
                    break;
                case 'binary':
                    return args.NUM;
                case 'hexadecimal':
                    if (computeValue < 0) {
                        computeValue *= -1;
                        computeValue = ~computeValue;
                        computeValue--;
                    }
                    computeValue = computeValue.toString(16);
                    break;
                default:
                    console.log("failed?");
                    return "";
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