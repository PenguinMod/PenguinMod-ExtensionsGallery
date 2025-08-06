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

// V0.14

(function(Scratch){
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        // throw new Error("This extension prefers to be used unsandboxed");
    }

    let fullLength = true;
    let selLengthIsFull = true;
    let extOpen = false;
    let basesArray = ["decimal", "binary", "hexadecimal"];
    const extBlockArray = [
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
            label: selLengthIsFull ? "using fixed length" : "using dynamic length",
            arguments: {
                LENGTH: {
                    type: Scratch.ArgumentType.STRING,
                    menu: "LENGTHS",
                },
            },
        },
    ];
    const icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMjUgMjI1Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjkuNS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjAgQnVpbGQgMTQxKSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICMxYjQ2OGQ7CiAgICAgIH0KCiAgICAgIC5zdDIgewogICAgICAgIGZpbGw6ICMxNDY0OGE7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGNsYXNzPSJzdDEiIHdpZHRoPSIyMjUiIGhlaWdodD0iMjI1Ii8+CiAgPGc+CiAgICA8cG9seWdvbiBjbGFzcz0ic3QwIiBwb2ludHM9IjE3NC4wNiAxNC4wMSAxMTkuMjEgMTQuMDEgOTEuNzkgNjEuNTEgMTE5LjIxIDEwOS4wMSAxNzQuMDYgMTA5LjAxIDIwMS40OSA2MS41MSAxNzQuMDYgMTQuMDEiLz4KICAgIDxjaXJjbGUgY2xhc3M9InN0MiIgY3g9IjY1LjY1IiBjeT0iMTIyLjI2IiByPSI0Mi4xNCIvPgogICAgPHJlY3QgY2xhc3M9InN0MCIgeD0iMTE3LjE3IiB5PSIxMTcuOCIgd2lkdGg9Ijc0LjE4IiBoZWlnaHQ9IjkzLjE5IiByeD0iMTIiIHJ5PSIxMiIvPgogIDwvZz4KPC9zdmc+";
    const iconCircle = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyBpZD0iTGF5ZXJfMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCAyMjUgMjI1Ij4KICA8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMjkuNS4xLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogMi4xLjAgQnVpbGQgMTQxKSAgLS0+CiAgPGRlZnM+CiAgICA8c3R5bGU+CiAgICAgIC5zdDAgewogICAgICAgIGZpbGw6ICMxNDY0OGE7CiAgICAgIH0KCiAgICAgIC5zdDEgewogICAgICAgIGZpbGw6ICNmZmY7CiAgICAgIH0KCiAgICAgIC5zdDIgewogICAgICAgIGZpbGw6ICMxYjQ2OGQ7CiAgICAgIH0KICAgIDwvc3R5bGU+CiAgPC9kZWZzPgogIDxyZWN0IGNsYXNzPSJzdDIiIHg9IjAiIHk9IjAiIHdpZHRoPSIyMjUiIGhlaWdodD0iMjI1IiByeD0iMTEyLjUiIHJ5PSIxMTIuNSIvPgogIDxnPgogICAgPHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSIxNjMuODUgMzAuMzQgMTE4LjEgMzAuMzQgOTUuMjIgNjkuOTcgMTE4LjEgMTA5LjU5IDE2My44NSAxMDkuNTkgMTg2LjczIDY5Ljk3IDE2My44NSAzMC4zNCIvPgogICAgPGNpcmNsZSBjbGFzcz0ic3QwIiBjeD0iNzMuNDIiIGN5PSIxMjAuNjQiIHI9IjM1LjE1Ii8+CiAgICA8cmVjdCBjbGFzcz0ic3QxIiB4PSIxMTYuNCIgeT0iMTE2LjkyIiB3aWR0aD0iNjEuODgiIGhlaWdodD0iNzcuNzQiIHJ4PSIxMC4wMSIgcnk9IjEwLjAxIi8+CiAgPC9nPgogIDxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik01MS41MSwxOTAuMjNjLTMuNjksMC0zLjY5LDUuNzMsMCw1LjczczMuNjktNS43MywwLTUuNzNaIi8+CiAgPHBhdGggY2xhc3M9InN0MSIgZD0iTTcwLjk3LDE3OS4wM2MtMy42OSwwLTMuNjksNS43MywwLDUuNzNzMy42OS01LjczLDAtNS43M1oiLz4KICA8cGF0aCBjbGFzcz0ic3QxIiBkPSJNNjYuNzcsMTkzLjF2MS40NGMtLjI2LS4xNS0uNTEtLjMtLjc2LS40NS0zLjE0LTEuOTYtNi4wMiwzLTIuODksNC45NSwxLjA3LjY3LDIuMTksMS4yMiwzLjM2LDEuNywxLjI4LjUzLDIuNjMsMS4wMywzLjk5LjQsMS42NS0uNzYsMi4wMy0yLjM2LDIuMDQtNC4wM3YtNC4wMWMwLTMuNjktNS43Mi0zLjY5LTUuNzMsMFoiLz4KPC9zdmc+";

    function isInCorrectFormat(inputString) {
        if ((inputString != parseInt(inputString, 10).toString(10)) && !isItHexadecimal(inputString)) {
            console.log("bad string")
            return false;
        }
        console.log("good string");
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

    function binaryReformat(Value, neg = true) {
        let newValue = Math.abs(Value).toString(2).length + 1;
        let computedValue = (Value >>> 0).toString(2);
        if (!fullLength) {
            console.log(computedValue);
            console.log(newValue);
            if (neg) computedValue = computedValue.slice(clamp(computedValue.length - newValue, 0, computedValue.length), computedValue.length);
            if (!neg) computedValue = "0" + computedValue
            console.log(computedValue);
        }
        return computedValue;
    };

    function clamp(value, min, max) {
        console.log(Math.max(min, Math.min(value, max)))
        return Math.max(min, Math.min(value, max));
    };

    function binaryToDecimal(computedValue) {
        let newerValue = 0;
        for (let i = computedValue.length; i > 0; i--) {
            newerValue += parseInt(computedValue[i - 1]) * (Math.pow(2, computedValue.length - i)) * ((i === 0) ? -1 : 1);
        }
        console.log(newerValue);
        return newerValue;
    };

    class Extension {
        getInfo() {
            const extraBlocks = extOpen ? extBlockArray : [];
            return {
                id: "burninghot687bitwisewhexa",
                name: Scratch.translate("Bits and Hexa"),
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
                        hideFromPalette: true,
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
                        opcode: "bitHexManipulationLabel",
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
                        opcode: "bitHexBitwiseOperatorsLabel",
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
                    "---",
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
                    "---",
                ].concat(extraBlocks),
                menus: {
                    BASES: {
                        acceptReporters: false,
                        items: basesArray.slice(),
                    },
                    LENGTHS: {
                        acceptReporters: false,
                        items: ['fixed', 'dynamic'],
                    },
                    BASES2: {
                        acceptReporters: false,
                        items: basesArray.slice(),
                    },
                },
            };
        }
        
        openExtraBitwise() {
            extOpen = !extOpen;
            Scratch.vm.runtime.requestToolboxExtensionsUpdate();
        }

        bitwiseDocumentationButton() {
            window.location.href = "https://docs.penguinmod.com/extensions/bitsandhexa";
        }

        binaryLengthGetter(args) {
            // Still need to fix monitors here lol
            switch (args.LENGTH) {
                case 'fixed':
                    selLengthIsFull = true;
                    return fullLength;
                case 'dynamic':
                    selLengthIsFull = false;
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
            let computeValue = args.NUM;
            if (isInCorrectFormat(computeValue) === false) {
                return false;
            }

            return testForFormat(computeValue, args.BASE);
        }

        convertBaseTypesBitW(args) {
            let computeValue = args.NUM;
            console.log(args.FROM);
            console.log(args.BASE);
            if (isInCorrectFormat(computeValue) === false) {
                return "";
            }
            if (!testForFormat(computeValue, args.FROM)) {
                console.log("not same as [from]");
                return "";
            }
            if (args.FROM === args.BASE) {
                console.log("same!");
                // return args.NUM;
            }
            if (fullLength) {
                computeValue = parseInt(computeValue, (args.FROM === basesArray[0]) ? 10 : ((args.FROM === basesArray[1]) ? 2: 16));
            } else {
                console.log("dynamic adjust")
                switch (basesArray.indexOf(args.FROM)) {
                    case 0:
                        computeValue = parseInt(computeValue);
                        break;
                    case 1:
                        computeValue = binaryToDecimal(computeValue);
                        break;
                    case 2:
                        computeValue = binaryToDecimal((parseInt(computeValue, 16) >>> 0).toString(2));
                        break;
                }
            }

            switch (basesArray.indexOf(args.BASE)) {
                case 0:
                    computeValue = computeValue.toString(10);
                    break;
                case 1:
                    computeValue = binaryReformat(computeValue, computeValue < 0);
                    break;
                case 2:
                    computeValue = fullLength ? computeValue.toString(16) : parseInt(binaryReformat(computeValue, computeValue < 0), 2).toString(16);
                    break;
                default:
                    console.log("failed?");
                    return "";
            }

            return computeValue;
        }

        getBitAtIdx(args) {
            if (args.IDX > 31) return "";
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }
            if (args.IDX > parseInt(computeValue, 2).length && !fullLength) return "";
            return (parseInt(computeValue) >> args.IDX) & 1;
        }

        signedRightShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue >> args.AMOUNT;
        }

        leftShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue << args.AMOUNT;
        }

        unsignedRightShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue >>> args.AMOUNT;
        }

        circularRightShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue >> args.AMOUNT | computeValue << (32 - args.AMOUNT);
        }

        circularLeftShiftBitz(args) {
            let computeValue = args.NUM;
            if (!(isItDecimal(computeValue) || isItHexadecimal(computeValue))) return "";
            if (isItHexadecimal(computeValue) && /[abcdef]/i.test(computeValue)) {
                computeValue = "0x" + computeValue;
            }

            return computeValue << args.AMOUNT | computeValue >> (32 - args.AMOUNT);
        }

        bitwiseAndOperator(args) {
            let value1 = args.NUM;
            let value2 = args.NUM2;
            console.log(value1);
            console.log(value2);
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

            return value1 & value2;
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

            return value1 | value2;
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

            return value1 ^ value2;
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

            return ~value1;
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

            return ~(value1 & value2);
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

            return ~(value1 | value2);
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

            return ~(value1 ^ value2);
        }
    }
    Scratch.extensions.register(new Extension());
})(Scratch);