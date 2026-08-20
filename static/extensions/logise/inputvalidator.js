// Name: Input Validator
// ID: inputValidator
// Description: Blocks to easily validate user inputs like emails, numbers, and text patterns.
// By: Logise
// License: MIT

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Input Validator extension must run unsandboxed');
    }

    const menuIconURI = "data:image/png;base64,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";

    class InputValidator {
        getInfo() {
            return {
                id: 'inputValidator',
                name: 'Input Validator',
                color1: '#4CBF57',
                color2: '#3A9944',
                menuIconURI: menuIconURI,
                blocks: [{
                        opcode: 'isValidEmail',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [TEXT] a valid email?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'test@example.com',
                            },
                        },
                    },
                    {
                        opcode: 'isNumberInRange',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [NUMBER] in range min [MIN] max [MAX]?',
                        arguments: {
                            NUMBER: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50,
                            },
                            MIN: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            MAX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                        },
                    },
                    {
                        opcode: 'isTextType',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [TEXT] [TYPE] only?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'HelloWorld',
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'textType',
                                defaultValue: 'letters',
                            },
                        },
                    },
                    {
                        opcode: 'isTextLengthBetween',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is length of [TEXT] between [MIN] and [MAX]?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'penguin',
                            },
                            MIN: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3,
                            },
                            MAX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                        },
                    },
                    {
                        opcode: 'matchesRegex',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'does [TEXT] match regex pattern [PATTERN]?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'abc-123',
                            },
                            PATTERN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '^[a-z]{3}-[0-9]{3}$',
                            },
                        },
                    },
                    {
                        opcode: 'isCase',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [TEXT] [CASE]?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'HELLO',
                            },
                            CASE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'caseType',
                                defaultValue: 'UPPERCASE',
                            },
                        },
                    },
                    {
                        opcode: 'startsWith',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'does [TEXT] start with [PREFIX]?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'PenguinMod',
                            },
                            PREFIX: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Penguin',
                            },
                        },
                    },
                    {
                        opcode: 'endsWith',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'does [TEXT] end with [SUFFIX]?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'PenguinMod',
                            },
                            SUFFIX: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Mod',
                            },
                        },
                    },
                    {
                        opcode: 'containsText',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'does [TEXT] contain [SUBSTRING]?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'PenguinMod is cool',
                            },
                            SUBSTRING: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Mod',
                            },
                        },
                    },
                    {
                        opcode: 'isNumberType',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [NUMBER] an [NUM_TYPE]?',
                        arguments: {
                            NUMBER: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 42,
                            },
                            NUM_TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'numberType',
                                defaultValue: 'integer',
                            },
                        },
                    },
                    {
                        opcode: 'isNumberSign',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [NUMBER] [SIGN]?',
                        arguments: {
                            NUMBER: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 10,
                            },
                            SIGN: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'signType',
                                defaultValue: 'positive',
                            },
                        },
                    },
                    {
                        opcode: 'isValidURL',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [TEXT] a valid URL?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://penguinmod.com',
                            },
                        },
                    },
                    {
                        opcode: 'isValidHexColor',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [TEXT] a valid hex color code?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#4CBF57',
                            },
                        },
                    },
                    {
                        opcode: 'countOccurrences',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'count occurrences of [SUBSTRING] in [TEXT]',
                        arguments: {
                            SUBSTRING: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'p',
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple pineapple',
                            },
                        },
                    },
                    {
                        opcode: 'sanitizeText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'sanitize [TEXT] by removing [SANITIZE_ACTION]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '  Hello World! 123  ',
                            },
                            SANITIZE_ACTION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'sanitizeAction',
                                defaultValue: 'leading/trailing spaces',
                            },
                        },
                    },
                ],
                menus: {
                    textType: {
                        acceptReporters: true,
                        items: ['letters', 'numbers', 'alphanumeric'],
                    },
                    caseType: {
                        acceptReporters: true,
                        items: ['UPPERCASE', 'lowercase'],
                    },
                    numberType: {
                        acceptReporters: true,
                        items: ['integer', 'decimal'],
                    },
                    signType: {
                        acceptReporters: true,
                        items: ['positive', 'negative'],
                    },
                    sanitizeAction: {
                        acceptReporters: true,
                        items: ['leading/trailing spaces', 'all spaces', 'letters', 'numbers', 'special characters'],
                    },
                },
            };
        }

        isValidEmail({ TEXT }) {
            const text = String(TEXT);
            const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return pattern.test(text);
        }

        isNumberInRange({ NUMBER, MIN, MAX }) {
            const num = Number(NUMBER);
            const min = Number(MIN);
            const max = Number(MAX);
            if (isNaN(num) || isNaN(min) || isNaN(max)) {
                return false;
            }
            return num >= min && num <= max;
        }

        isTextType({ TEXT, TYPE }) {
            const text = String(TEXT);
            let pattern;
            switch (TYPE) {
                case 'letters':
                    pattern = /^[a-zA-Z]+$/;
                    break;
                case 'numbers':
                    pattern = /^[0-9]+$/;
                    break;
                case 'alphanumeric':
                    pattern = /^[a-zA-Z0-9]+$/;
                    break;
                default:
                    return false;
            }
            return pattern.test(text);
        }

        isTextLengthBetween({ TEXT, MIN, MAX }) {
            const text = String(TEXT);
            const min = Number(MIN);
            const max = Number(MAX);
            if (isNaN(min) || isNaN(max)) {
                return false;
            }
            const length = text.length;
            return length >= min && length <= max;
        }

        matchesRegex({ TEXT, PATTERN }) {
            const text = String(TEXT);
            const pattern = String(PATTERN);
            try {
                const regex = new RegExp(pattern);
                return regex.test(text);
            } catch (e) {
                console.error("Invalid Regex Pattern:", e);
                return false;
            }
        }

        isCase({ TEXT, CASE }) {
            const text = String(TEXT);
            if (CASE === 'UPPERCASE') {
                return text === text.toUpperCase();
            } else if (CASE === 'lowercase') {
                return text === text.toLowerCase();
            }
            return false;
        }

        startsWith({ TEXT, PREFIX }) {
            return String(TEXT).startsWith(String(PREFIX));
        }

        endsWith({ TEXT, SUFFIX }) {
            return String(TEXT).endsWith(String(SUFFIX));
        }

        containsText({ TEXT, SUBSTRING }) {
            return String(TEXT).includes(String(SUBSTRING));
        }

        isNumberType({ NUMBER, NUM_TYPE }) {
            const num = Number(NUMBER);
            if (isNaN(num)) return false;
            if (NUM_TYPE === 'integer') {
                return Number.isInteger(num);
            } else if (NUM_TYPE === 'decimal') {
                return !Number.isInteger(num);
            }
            return false;
        }

        isNumberSign({ NUMBER, SIGN }) {
            const num = Number(NUMBER);
            if (isNaN(num)) return false;
            if (SIGN === 'positive') {
                return num > 0;
            } else if (SIGN === 'negative') {
                return num < 0;
            }
            return false;
        }

        isValidURL({ TEXT }) {
            const text = String(TEXT);
            try {
                new URL(text);
                return true;
            } catch (_) {
                return false;
            }
        }

        isValidHexColor({ TEXT }) {
            const text = String(TEXT);
            const pattern = /^#([0-9A-Fa-f]{3}){1,2}$/;
            return pattern.test(text);
        }

        countOccurrences({ SUBSTRING, TEXT }) {
            const text = String(TEXT);
            const substring = String(SUBSTRING);
            if (substring.length === 0) return 0;
            return text.split(substring).length - 1;
        }

        sanitizeText({ TEXT, SANITIZE_ACTION }) {
            const text = String(TEXT);
            switch (SANITIZE_ACTION) {
                case 'leading/trailing spaces':
                    return text.trim();
                case 'all spaces':
                    return text.replace(/\s/g, '');
                case 'letters':
                    return text.replace(/[a-zA-Z]/g, '');
                case 'numbers':
                    return text.replace(/[0-9]/g, '');
                case 'special characters':
                    return text.replace(/[^a-zA-Z0-9\s]/g, '');
                default:
                    return text;
            }
        }
    }

    Scratch.extensions.register(new InputValidator());
})(Scratch);
