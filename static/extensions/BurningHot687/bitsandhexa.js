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

    - Get feedback

*/

// V1.1.2.7

(function(Scratch){
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("This extension has to be used unsandboxed, please.");
    }

    // yo thanks PackGod, or jwlong or whatever you like to call yourself
    let jwArray = {
        Type: class { },
        Block: {},
        Argument: {},
    }

    let fullLength = true;
    let selLengthIsFull = true;
    let extOpen = false;
    let basesArray = ["decimal", "binary", "hexadecimal"];
    const icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMjUgMjI1Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjkuNS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjAgQnVpbGQgMTQxKSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICMxYjQ2OGQ7CiAgICAgIH0KCiAgICAgIC5zdDIgewogICAgICAgIGZpbGw6ICMxNDY0OGE7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGNsYXNzPSJzdDEiIHdpZHRoPSIyMjUiIGhlaWdodD0iMjI1Ii8+CiAgPGc+CiAgICA8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjE3NC4wNiAxNC4wMSAxMTkuMjEgMTQuMDEgOTEuNzkgNjEuNTEgMTE5LjIxIDEwOS4wMSAxNzQuMDYgMTA5LjAxIDIwMS40OSA2MS41MSAxNzQuMDYgMTQuMDEiLz4KICAgIDxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjY1LjY1IiBjeT0iMTIyLjI2IiByPSI0Mi4xNCIvPgogICAgPHJlY3QgY2xhc3M9InN0MCIgeD0iMTE3LjE3IiB5PSIxMTcuOCIgd2lkdGg9Ijc0LjE4IiBoZWlnaHQ9IjkzLjE5IiByeD0iMTIiIHJ5PSIxMiIvPgogIDwvZz4KPC9zdmc+";
    const iconCircle = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMjUgMjI1Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjkuNS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjAgQnVpbGQgMTQxKSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICMxNDY0OGE7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDIgewogICAgICAgIGZpbGw6ICMxYjQ2OGQ7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGNsYXNzPSJzdDIiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMjUiIGhlaWdodD0iMjI1IiByeD0iMTEyLjUiIHJ5PSIxMTIuNSIvPgogIDxnPgogICAgPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxNjMuODUgMzAuMzQgMTE4LjEgMzAuMzQgOTUuMjIgNjkuOTcgMTE4LjEgMTA5LjU5IDE2My44NSAxMDkuNTkgMTg2LjczIDY5Ljk3IDE2My44NSAzMC4zNCIvPgogICAgPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iNzMuNDIiIGN5PSIxMjAuNjQiIHI9IjM1LjE1Ii8+CiAgICA8cmVjdCBjbGFzcz0ic3QxIiB4PSIxMTYuNCIgeT0iMTE2LjkyIiB3aWR0aD0iNjEuODgiIGhlaWdodD0iNzcuNzQiIHJ4PSIxMC4wMSIgcnk9IjEwLjAxIi8+CiAgPC9nPgogIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01MS41MSwxOTAuMjNjLTMuNjksMC0zLjY5LDUuNzMsMCw1LjczczMuNjktNS43MywwLTUuNzNaIi8+CiAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTcwLjk3LDE3OS4wM2MtMy42OSwwLTMuNjksNS43MywwLDUuNzNzMy42OS01LjczLDAtNS43M1oiLz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjYuNzcsMTkzLjF2MS40NGMtLjI2LS4xNS0uNTEtLjMtLjc2LS40NS0zLjE0LTEuOTYtNi4wMiwzLTIuODksNC45NSwxLjA3LjY3LDIuMTksMS4yMiwzLjM2LDEuNywxLjI4LjUzLDIuNjMsMS4wMywzLjk5LjQsMS42NS0uNzYsMi4wMy0yLjM2LDIuMDQtNC4wM3YtNC4wMWMwLTMuNjktNS43Mi0zLjY5LTUuNzMsMFoiLz4KPC9zdmc+";

    function isInCorrectFormat(inputString) {
        if ((inputString != parseInt(inputString, 10).toString(10)) && !isItHexadecimal(inputString)) {
            return false;
        }
        return true;
    };

    function isItHexadecimal(inputString) {
        return !/[^abcdef0123456789]/i.test(inputString);
    };

    function isItDecimal(inputString) {
        return !/[^0123456789-]/.test(inputString);
    };

    function isItBinary(inputString) {
        return !/[^01]/.test(inputString);
    };

    function isItOctal(inputString) {
        return !/[^01234567]/.test(inputString);
    };

    function testForFormat(numString, base) {
        switch (basesArray.indexOf(base)) {
        case 0:
            return isItDecimal(numString);
        case 1:
            return isItBinary(numString);
        case 2:
            return isItHexadecimal(numString);
        }
    };
    
    function getBitAt(NUM, IDX) {
        if (IDX > 31 || IDX < 0) return "";
        let cValue = NUM;
        if (!(isItDecimal(cValue) || isItHexadecimal(cValue))) return "";
        if (isItHexadecimal(cValue) && /[abcdef]/i.test(cValue)) {
            cValue = "0x" + cValue;
        }
        if (IDX > parseInt(cValue).toString(2).length && !fullLength) return "";
        return (parseInt(cValue) >>> IDX) & 1;
    };

    function binaryReformat(Value, neg = true) {
        let computedValue = (Value >>> 0).toString(2);
        let newValue = 0;
        for (let i = 0; i < computedValue.length; i++) {
            if (computedValue[i] == "0") break;
            newValue++;
        }
        newValue--;
        if (!fullLength) {
            if (neg) computedValue = computedValue.slice(newValue);
            if (!neg) computedValue = "0" + computedValue
        }
        return computedValue;
    };

    function clamp(value, min, max) {
        return Math.max(min, Math.min(value, max));
    };

    function binaryToDecimal(computedValue) {
        let newerValue = 0;
        for (let i = computedValue.length; i > 0; i--) {
            newerValue += parseInt(computedValue[i - 1]) * (Math.pow(2, computedValue.length - i)) * ((i === 1) ? -1 : 1);
        }
        return newerValue;
    };
    
    function binaryStupidity(value) {
        return fullLength ? value : binaryToDecimal(binaryReformat(value, binaryToDecimal(value.toString(2)) < 0));
    };

    function leadingZeroez(computeValue) {
        let returnValue = '';
        for (let i = 0; i < computeValue.length; i++) {
            if (computeValue[i] != "0") break;
            returnValue = returnValue.concat("0");
        }
        return returnValue;
    };

    function chooseBaseValue(index) {
        return index === 0 ? 10 : index === 1 ? 2 : 16;
    };

    class Extension {
        constructor() {
            if (!vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray'); jwArray = vm.jwArray;
        }

        getInfo() {
            const extBlockArray = [
                {
                    text: "Strings",
                    blockType: Scratch.BlockType.LABEL,
                },
                {
                    opcode: "charToBit",
                    text: "character [NUM] of [CHAR] to [ENCODE] in [BASE]",
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 0,
                        },
                        CHAR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "f",
                        },
                        ENCODE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "ENCODING",
                        },
                        BASE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "BASES",
                        },
                    },
                },
                {
                    opcode: "bitToChar",
                    text: "number [NUM] using [ENCODE] in [BASE] to character",
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "41",
                        },
                        ENCODE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "ENCODING",
                        },
                        BASE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "BASES",
                        },
                    },
                },
                {
                    opcode: "stringToBitArray",
                    text: "[STR] to [ENCODE] array in [BASE]",
                    arguments: {
                        STR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "foo?!",
                        },
                        ENCODE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "ENCODING",
                        },
                        BASE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "BASES",
                        },
                    },
                    ...jwArray.Block
                },
                {
                    opcode: "bitArrayToString",
                    text: "[ENCODE] array [ARRAY] in [BASE] to string",
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        ARRAY: jwArray.Argument,
                        ENCODE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "ENCODING",
                        },
                        BASE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "BASES",
                        },
                    },
                },
                "---",
                {
                    text: "Utilities",
                    blockType: Scratch.BlockType.LABEL,
                },
                {
                    opcode: "hexaNum",
                    text: "Ox[NUM]",
                    switchText: "Ox",
                    blockType: Scratch.BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.STRING,
                        },
                    },
                    switches: [ 'bitNum', 'octNum' ],
                },
                {
                    opcode: "bitNum",
                    text: "Ob[NUM]",
                    switchText: "Ob",
                    blockType: Scratch.BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.NUMBER,
                        },
                    },
                    switches: [ 'hexaNum', 'octNum' ],
                },
                {
                    opcode: "octNum",
                    text: "Oo[NUM]",
                    switchText: "Oo",
                    blockType: Scratch.BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.NUMBER,
                        },
                    },
                    switches: [ 'hexaNum', 'bitNum' ],
                },
                {
                    opcode: "convertToLittleEndian",
                    text: "reverse endianness of [NUM] in [BASE]",
                    tooltip: 'This just basically reverses the byte order. Doesn\'t support dynamic length.',
                    blockType: Scratch.BlockType.REPORTER,
                    disableMonitor: true,
                    arguments: {
                        NUM: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "37",
                        },
                        BASE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "BASES",
                        },
                    },
                },
                "---",
                {
                    text: "Configuration Settings ⚠",
                    blockType: Scratch.BlockType.LABEL,
                },
                {
                    text: "Likely to not work as intended!",
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
                    label: selLengthIsFull ? "using static length" : "using dynamic length",
                    disableMonitor: true, // NEED TO FIX SOMEDAY
                    arguments: {
                        LENGTH: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "LENGTHS",
                        },
                    },
                },
            ];
            return {
                id: "burninghot687bitwisewhexa",
                name: Scratch.translate("Bitwise") + "+",
                color1: "#15448f",
                color2: "#0f1f70",
                color3: "#0a094f",
                menuIconURI: iconCircle,
                blockIconURI: icon,
                isDynamic: true,

                blocks: [
                    {
                        opcode: "bitwiseDocumentationButton",
                        text: "Open Documentation",
                        blockType: Scratch.BlockType.BUTTON,
                        // hideFromPalette: true,
                    },
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
                        text: "convert [NUM] from [FROM] to [BASE]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        // allowDropAnywhere: true, could potentially save on blocks in minor use cases and doesn't harm otherwise?
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "4d2",
                            },
                            FROM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "BASES2",
                            },
                            BASE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "BASES",
                            },
                        },
                    },
                    {
                        opcode: "getBitAtIdx",
                        text: "get bit at index [IDX] of [NUM]",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        allowDropAnywhere: true,
                        arguments: {
                            IDX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3,
                            },
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '13',
                            },
                        },
                    },
                    {
                        text: "Bitwise Manipulation",
                        blockType: Scratch.BlockType.LABEL,
                    },
                    {
                        opcode: "signedRightShiftBitz",
                        text: "[NUM] >> [AMOUNT]",
                        switchText: ">>",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "4d2",
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
                        switchText: "<<",
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
                        switchText: ">>>",
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
                        switchText: "↻",
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
                        switchText: "↺",
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
                        text: "Bitwise Operators",
                        blockType: Scratch.BlockType.LABEL,
                    },
                    {
                        opcode: "bitwiseAndOperator",
                        text: "[NUM] & [NUM2] | and",
                        switchText: "& and",
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
                        switches: [ 'bitwiseOrOperator', 'bitwiseXorOperator', 'bitwiseNotOperator', 'bitwiseNandOperator', 'bitwiseNorOperator', 'bitwiseXnorOperator' ],
                    },
                    {
                        opcode: "bitwiseOrOperator",
                        text: "[NUM] | [NUM2] | or",
                        switchText: "| or",
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
                        switches: [ 'bitwiseAndOperator', 'bitwiseXorOperator', 'bitwiseNotOperator', 'bitwiseNandOperator', 'bitwiseNorOperator', 'bitwiseXnorOperator' ],
                    },
                    {
                        opcode: "bitwiseXorOperator",
                        text: "[NUM] ^ [NUM2] | xor",
                        switchText: "^ xor",
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
                        switches: [ 'bitwiseOrOperator', 'bitwiseAndOperator', 'bitwiseNotOperator', 'bitwiseNandOperator', 'bitwiseNorOperator', 'bitwiseXnorOperator' ],
                    },
                    {
                        opcode: "bitwiseNotOperator",
                        text: "~[NUM] | not",
                        switchText: "~ not",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.STRING,
                            },
                        },
                        switches: [ 'bitwiseOrOperator', 'bitwiseXorOperator', 'bitwiseAndOperator', 'bitwiseNandOperator', 'bitwiseNorOperator', 'bitwiseXnorOperator' ],
                    },
                    "---",
                    {
                        opcode: "bitwiseNandOperator",
                        text: "~[NUM] & [NUM2] | nand",
                        switchText: "~& nand",
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
                        switches: [ 'bitwiseOrOperator', 'bitwiseXorOperator', 'bitwiseNotOperator', 'bitwiseAndOperator', 'bitwiseNorOperator', 'bitwiseXnorOperator' ],
                    },
                    {
                        opcode: "bitwiseNorOperator",
                        text: "~[NUM] | [NUM2] | nor",
                        switchText: "~| nor",
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
                        switches: [ 'bitwiseOrOperator', 'bitwiseXorOperator', 'bitwiseNotOperator', 'bitwiseNandOperator', 'bitwiseAndOperator', 'bitwiseXnorOperator' ],
                    },
                    {
                        opcode: "bitwiseXnorOperator",
                        text: "~[NUM] ^ [NUM2] | xnor",
                        switchText: "~^ xnor",
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
                        switches: [ 'bitwiseOrOperator', 'bitwiseXorOperator', 'bitwiseNotOperator', 'bitwiseNandOperator', 'bitwiseNorOperator', 'bitwiseAndOperator' ],
                    },
                    "---",
                    {
                        func: "openExtraBitwise",
                        text: extOpen ? "Close Extras" : "Open Extras",
                        blockType: Scratch.BlockType.BUTTON,
                    },
                ].concat(extOpen ? extBlockArray : []),
                menus: {
                    BASES: {
                        acceptReporters: false,
                        items: basesArray.slice(),
                    },
                    LENGTHS: {
                        acceptReporters: false,
                        items: ['static', 'dynamic'],
                    },
                    BASES2: {
                        acceptReporters: false,
                        items: basesArray.slice(),
                    },
                    ENCODING: {
                        acceptReporters: false,
                        items: ['UTF-16', 'Unicode'],
                    },
                },
            };
        }
        
        openExtraBitwise() {
            extOpen = !extOpen;
            Scratch.vm.runtime.requestToolboxExtensionsUpdate();
        }

        bitwiseDocumentationButton() {
            window.open("https://extensions.penguinmod.com/docs/bitsandhexa");
        }

        binaryLengthGetter(args) {
            // Still need to fix monitors here lol
            switch (args.LENGTH) {
            case 'static':
                selLengthIsFull = true;
                return fullLength;
            case 'dynamic':
                selLengthIsFull = false;
                return !fullLength;
            }
            // Scratch.vm.runtime.requestToolboxExtensionsUpdate();
        }

        binaryLengthSetter(args) {
            switch (args.LENGTH) {
            case 'static':
                fullLength = true;
                break;
            case 'dynamic':
                fullLength = false;
                break;
            }
        }

        isNumActuallyBase(args) {
            let computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return false;
            }

            return testForFormat(computeValue, args.BASE);
        }

        convertBaseTypesBitW(args) {
            let computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (!testForFormat(computeValue, args.FROM)) {
                return "";
            }
            if (args.FROM === args.BASE) {
                return args.NUM;
            }

            if (fullLength) {
                computeValue = parseInt(computeValue, chooseBaseValue(basesArray.indexOf(args.FROM)));
            } else {
                switch (basesArray.indexOf(args.FROM)) {
                case 0:
                    computeValue = parseInt(computeValue);
                    break;
                case 1:
                    computeValue = binaryToDecimal(computeValue);
                    break;
                case 2:
                    computeValue = binaryToDecimal(leadingZeroez(computeValue) + (parseInt(computeValue, 16) >>> 0).toString(2));
                    break;
                }
            }
            if (fullLength) computeValue = computeValue >> 0;
            
            switch (basesArray.indexOf(args.BASE)) {
            case 0:
                computeValue = computeValue.toString(10);
                break;
            case 1:
                computeValue = binaryReformat(computeValue, computeValue < 0);
                break;
            case 2:
                let negative = computeValue < 0;
                computeValue = parseInt(binaryReformat(computeValue, negative), 2).toString(16);
                if (!fullLength && !negative) computeValue = "0" + computeValue; 
                break;
            default:
                return "";
            }

            return computeValue;
        }

        getBitAtIdx(args) {
            return getBitAt(args.NUM, args.IDX);
        }

        signedRightShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }
            
            if (fullLength) {
                return computeValue >> args.AMOUNT;
            }
            computeValue = leadingZeroez(computeValue) + (computeValue >> args.AMOUNT).toString(2);
            let signBit = computeValue[0];
            return binaryToDecimal(signBit.repeat(args.AMOUNT) + computeValue);
        }

        leftShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }
            
            if (fullLength) return computeValue << args.AMOUNT;
            return binaryToDecimal(leadingZeroez(computeValue) + (computeValue << args.AMOUNT).toString(2));
        }

        unsignedRightShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return binaryStupidity(computeValue >>> args.AMOUNT);
        }

        circularRightShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return binaryStupidity(computeValue >> args.AMOUNT | computeValue << (fullLength ? 32 : binaryReformat(computeValue) - args.AMOUNT));
        }

        circularLeftShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return binaryStupidity(computeValue << args.AMOUNT | computeValue >> (fullLength ? 32 : binaryReformat(computeValue) - args.AMOUNT));
        }

        bitwiseAndOperator(args) {
            let value1 = args.NUM;
            let value2 = args.NUM2;
            if (!(isItDecimal(value1) || isItHexadecimal(value2))) return "";
            if (!(isItDecimal(value2) || isItHexadecimal(value2))) return "";
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }

            return binaryStupidity(value1 & value2);
        }

        bitwiseOrOperator(args) {
            let value1 = args.NUM;
            let value2 = args.NUM2;
            if (!(isItDecimal(value1) || isItHexadecimal(value2))) return "";
            if (!(isItDecimal(value2) || isItHexadecimal(value2))) return "";
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }

            return binaryStupidity(value1 | value2);
        }

        bitwiseXorOperator(args) {
            let value1 = args.NUM;
            let value2 = args.NUM2;
            if (!(isItDecimal(value1) || isItHexadecimal(value2))) return "";
            if (!(isItDecimal(value2) || isItHexadecimal(value2))) return "";
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }

            return binaryStupidity(value1 ^ value2);
        }

        bitwiseNotOperator(args) {
            let value1 = args.NUM;
            if (!(isItDecimal(value1) || isItHexadecimal(value2))) return "";
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isNaN(parseInt(value1))) {
                return "";
            }

            return binaryStupidity(~value1);
        }

        bitwiseNandOperator(args) {
            let value1 = args.NUM;
            let value2 = args.NUM2;
            if (!(isItDecimal(value1) || isItHexadecimal(value2))) return "";
            if (!(isItDecimal(value2) || isItHexadecimal(value2))) return "";
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }

            return binaryStupidity(~(value1 & value2));
        }

        bitwiseNorOperator(args) {
            let value1 = args.NUM;
            let value2 = args.NUM2;
            if (!(isItDecimal(value1) || isItHexadecimal(value2))) return "";
            if (!(isItDecimal(value2) || isItHexadecimal(value2))) return "";
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }

            return binaryStupidity(~(value1 | value2));
        }

        bitwiseXnorOperator(args) {
            let value1 = args.NUM;
            let value2 = args.NUM2;
            if (!(isItDecimal(value1) || isItHexadecimal(value2))) return "";
            if (!(isItDecimal(value2) || isItHexadecimal(value2))) return "";
            if (isItHexadecimal(value1) && /[abcdef]/i.test(value1)) {
                value1 = "0x" + value1;
            }
            if (isItHexadecimal(value2) && /[abcdef]/i.test(value2)) {
                value2 = "0x" + value2;
            }
            if (isNaN(parseInt(value1)) || isNaN(parseInt(value2))) {
                return "";
            }
            
            return binaryStupidity(~(value1 ^ value2));
        }
        
        hexaNum(args) {
            return isItHexadecimal(args.NUM) ? parseInt(args.NUM, 16) : '';
        }

        bitNum(args) {
            return isItBinary(args.NUM.toString()) ? parseInt(args.NUM.toString(), 2) : '';
        }

        octNum(args) {
            return isItOctal(args.NUM.toString()) ? parseInt(args.NUM.toString(), 8) : '';
        }

        charToBit(args) {
            if (args.ENCODE == 'UTF-16') return args.CHAR.charCodeAt(args.NUM).toString(chooseBaseValue(basesArray.indexOf(args.BASE)));
            if (args.ENCODE == 'Unicode') return args.CHAR.codePointAt(args.NUM).toString(chooseBaseValue(basesArray.indexOf(args.BASE)));
        }

        bitToChar(args) {
            if (args.ENCODE == 'UTF-16') return String.fromCharCode(parseInt(args.NUM, chooseBaseValue(basesArray.indexOf(args.BASE))));
            if (args.ENCODE == 'Unicode') return String.fromCodePoint(parseInt(args.NUM, chooseBaseValue(basesArray.indexOf(args.BASE))));
        }

        stringToBitArray(args) {
            let computeValue = [];
            for (let i = 0; i < args.STR.length; i++) {
                if (args.ENCODE == 'UTF-16') computeValue.push(args.STR.charCodeAt(i).toString(args.BASE === 'decimal' ? 10 : args.BASE === 'binary' ? 2 : 16));
                if (args.ENCODE == 'Unicode') computeValue.push(args.STR.codePointAt(i).toString(args.BASE === 'decimal' ? 10 : args.BASE === 'binary' ? 2 : 16));
            }
            return new jwArray.Type(computeValue);
        }

        bitArrayToString(args) {
            let myArray = jwArray.Type.toArray(args.ARRAY).array;
            if (myArray.length === 0) return '';
            let computeValue = '';
            for (let i = 0; i < myArray.length; i++) {
                let charValue = parseInt(myArray[i], chooseBaseValue(basesArray.indexOf(args.BASE)));
                computeValue = computeValue.concat(args.ENCODE === 'UTF-16' ? String.fromCharCode(charValue) : String.fromCodePoint(charValue));
            }
            return computeValue;
        }


        convertToLittleEndian(args) {
            let computeValue = parseInt(args.NUM, chooseBaseValue(basesArray.indexOf(args.BASE)));
            computeValue = new Int32Array([computeValue]);
            computeValue.reverse();
            const myDataView = new DataView(computeValue.buffer);
            return myDataView.getInt32(0, false);
        }
    }
    Scratch.extensions.register(new Extension());
})(Scratch);