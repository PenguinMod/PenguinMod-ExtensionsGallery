// Name: Regex & String Parser
// ID: lucmanplayzRegexParser
// Description: Test, match, replace, and extract capture groups from text using regular expressions. NOTE: SOME BLOCKS MAY SHOW \\d or \\w instead of \d or \w. Just delete one of the "\" and it will work!
// By: lucmanplayz

(function(Scratch) {
    'use strict';

    const bs = String.fromCharCode(92);

    class RegexParser {
        constructor() {}

        getInfo() {
            return {
                id: 'lucmanplayzRegexParser',
                name: 'Regex & String Parser',
                color1: '#4A90E2',
                color2: '#357ABD',
                blocks: [
                    {
                        opcode: 'testRegex',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'does [TEXT] match regex [PATTERN] with flags [FLAGS]?',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'User123'
                            },
                            PATTERN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '^User' + bs + 'd+$'
                            },
                            FLAGS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'findMatch',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'first match of regex [PATTERN] in [TEXT] with flags [FLAGS]',
                        arguments: {
                            PATTERN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: bs + 'd+'
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Your score is 95 points'
                            },
                            FLAGS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'findAllMatches',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all matches of regex [PATTERN] in [TEXT] with flags [FLAGS] as JSON',
                        arguments: {
                            PATTERN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: bs + 'd+'
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'IDs: 12, 34, 56'
                            },
                            FLAGS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'g'
                            }
                        }
                    },
                    {
                        opcode: 'extractGroup',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get capture group [GROUP] of regex [PATTERN] in [TEXT] with flags [FLAGS]',
                        arguments: {
                            GROUP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PATTERN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Name: (' + bs + 'w+)'
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Name: Alice, Age: 25'
                            },
                            FLAGS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'replaceRegex',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'replace matches of regex [PATTERN] in [TEXT] with [REPLACEMENT] with flags [FLAGS]',
                        arguments: {
                            PATTERN: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple'
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple banana apple'
                            },
                            REPLACEMENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'orange'
                            },
                            FLAGS: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'g'
                            }
                        }
                    },
                    {
                        opcode: 'escapeRegex',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'escape regex special characters in [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'price.$10?*+'
                            }
                        }
                    }
                ]
            };
        }

        _safeRegex(pattern, flags) {
            try {
                return new RegExp(pattern.trim(), flags.trim());
            } catch (e) {
                return null;
            }
        }

        testRegex(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const pattern = Scratch.Cast.toString(args.PATTERN);
            const flags = Scratch.Cast.toString(args.FLAGS);
            const regex = this._safeRegex(pattern, flags);
            if (!regex) return false;
            return regex.test(text);
        }

        findMatch(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const pattern = Scratch.Cast.toString(args.PATTERN);
            const flags = Scratch.Cast.toString(args.FLAGS);
            const regex = this._safeRegex(pattern, flags);
            if (!regex) return '';
            const match = text.match(regex);
            return match ? match[0] : '';
        }

        findAllMatches(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const pattern = Scratch.Cast.toString(args.PATTERN);
            let flags = Scratch.Cast.toString(args.FLAGS);
            if (!flags.includes('g')) {
                flags += 'g';
            }
            const regex = this._safeRegex(pattern, flags);
            if (!regex) return '[]';
            const matches = [...text.matchAll(regex)].map(m => m[0]);
            return JSON.stringify(matches);
        }

        extractGroup(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const pattern = Scratch.Cast.toString(args.PATTERN);
            const groupIndex = Scratch.Cast.toNumber(args.GROUP);
            const flags = Scratch.Cast.toString(args.FLAGS);
            const regex = this._safeRegex(pattern, flags);
            if (!regex) return '';
            const match = text.match(regex);
            if (match && match[groupIndex] !== undefined) {
                return match[groupIndex];
            }
            return '';
        }

        replaceRegex(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            const pattern = Scratch.Cast.toString(args.PATTERN);
            const replacement = Scratch.Cast.toString(args.REPLACEMENT);
            const flags = Scratch.Cast.toString(args.FLAGS);
            const regex = this._safeRegex(pattern, flags);
            if (!regex) return text;
            return text.replace(regex, replacement);
        }

        escapeRegex(args) {
            const text = Scratch.Cast.toString(args.TEXT);
            return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        }
    }

    Scratch.extensions.register(new RegexParser());
})(Scratch);