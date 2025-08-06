// Name: Yet Another String Extension
// ID: dogeiscutyetanotherstringextension
// Description: A small collection of utilty blocks intended to make managing strings much, much easier.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Yet Another String Extension\' must run unsandboxed!');
    }

    class YetAnotherStringExtension {
        constructor() {
            vm.runtime.registerCompiledExtensionBlocks('dogeiscutyetanotherstringextension', this.getCompileInfo());
        }
        getInfo() {
            return {
                id: 'dogeiscutyetanotherstringextension',
                name: 'Yet Another String Extension',
                color1: '#59C059',
                blocks: [
                    {
                        opcode: 'currentString',
                        text: 'current string',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        canDragDuplicate: true,
                        extensions: ["colours_operators"],
                    },
                    {
                        opcode: 'builder',
                        text: 'string builder [CURRENT_STRING]',
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            CURRENT_STRING: {
                                fillIn: 'currentString'
                            },
                        },
                        branches: [{}],
                        extensions: ["colours_operators"],
                    },
                    {
                        opcode: 'builderAppend',
                        text: 'append [STRING] to builder',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "foo"},
                        },
                        extensions: ["colours_operators"],
                    },
                    {
                        opcode: 'builderSet',
                        text: 'set builder output to [STRING]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "bar"},
                        },
                        extensions: ["colours_operators"],
                    },
                    '---',
                    {
                        opcode: 'forEachI',
                        text: 'index',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        canDragDuplicate: true,
                        extensions: ["colours_operators"],
                    },
                    {
                        opcode: 'forEachL',
                        text: 'letter',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        allowDropAnywhere: true,
                        canDragDuplicate: true,
                        extensions: ["colours_operators"],
                    },
                    {
                        opcode: 'forEach',
                        text: 'for [I] [L] of [STRING]',
                        blockType: Scratch.BlockType.LOOP,
                        arguments: {
                            STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "foo"},
                            I: {
                                fillIn: 'forEachI'
                            },
                            L: {
                                fillIn: 'forEachL'
                            }
                        },
                        extensions: ["colours_operators"],
                    },
                    '---',
                    {
                        opcode: 'uwuify',
                        text: 'uwuify [STRING]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "Hello world!"},
                        },
                        extensions: ["colours_operators"],
                    },
                    {
                        opcode: 'repeat',
                        text: 'repeat [STRING] [INT] times',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            STRING: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
                            INT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 },
                        },
                        extensions: ["colours_operators"],
                    },
                    '---',
                    {
                        opcode: 'nextLine',
                        text: '[A] next line [B]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            A: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello" },
                            B: { type: Scratch.ArgumentType.STRING, defaultValue: "world!" },
                        },
                        extensions: ["colours_operators"],
                    },
                    {
                        opcode: 'pick',
                        text: 'pick [A] or [B]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            A: { type: Scratch.ArgumentType.STRING, defaultValue: "foo" },
                            B: { type: Scratch.ArgumentType.STRING, defaultValue: "bar" },
                        },
                        extensions: ["colours_operators"],
                    },
                    '---',
                    {
                        opcode: 'containsAllLetters',
                        text: '[A] contains all letters from [B]?',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            A: { type: Scratch.ArgumentType.STRING, defaultValue: "bcad" },
                            B: { type: Scratch.ArgumentType.STRING, defaultValue: "abc" },
                        },
                        extensions: ["colours_operators"],
                    },
                ]
            }
        }

        getCompileInfo() {
            return {
                ir: {
                    builder: (generator, block) => ({
                        kind: 'input',
                        substack: generator.descendSubstack(block, 'SUBSTACK')
                    }),
                },
                js: {
                    builder: (node, compiler, imports) => {
                        const originalSource = compiler.source;

                        compiler.source = 'yield* (function*() {';
                        compiler.source += '    const __inner = yield* (function*() {';
                        compiler.source += `        runtime.ext_dogeiscutyetanotherstringextension.builderIndex.push('');`;
                        compiler.descendStack(node.substack, new imports.Frame(false, undefined, true));
                        compiler.source += `        return new runtime.ext_dogeiscutyetanotherstringextension.BuilderReturnValue(runtime.ext_dogeiscutyetanotherstringextension.builderIndex.pop());`;
                        compiler.source += '    })();';
                        compiler.source += '    const __result = __inner;';
                        compiler.source += '    if (!(__result instanceof runtime.ext_dogeiscutyetanotherstringextension.BuilderReturnValue)) {';
                        compiler.source += '        throw "Return statements are not supported in builders.";';
                        compiler.source += '    }';
                        compiler.source += '    return __result.value;';
                        compiler.source += '})()';

                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_STRING);
                    }
                }
            };
        }

        builderIndex = []

        BuilderReturnValue = class {
            constructor(value) {
                this.value = value
            }
        } 

        currentString({}) {
            if (this.builderIndex.length > 0) {
                return this.builderIndex[this.builderIndex.length-1]
            } else {
                throw 'This block must be inside of a "string builder" block.';
            }
        }

        async builder({}, util) {
            return 'noop'
        }

        builderAppend({ STRING }) {
            STRING = Scratch.Cast.toString(STRING)
            if (this.builderIndex.length > 0) {
                this.builderIndex[this.builderIndex.length-1] += STRING
            } else {
                throw 'This block must be inside of a "string builder" block.';
            }
        }

        builderSet({ STRING }) {
            STRING = Scratch.Cast.toString(STRING)
            if (this.builderIndex.length > 0) {
                this.builderIndex[this.builderIndex.length-1] = STRING
            } else {
                throw 'This block must be inside of a "string builder" block.';
            }
        }

        forEachI({}, util) {
            let str = util.thread.stackFrames[0].string
            return str ? Scratch.Cast.toNumber(str[0]) + 1 : 0
        }

        forEachL({}, util) {
            let str = util.thread.stackFrames[0].string;
            return str ? Scratch.Cast.toString(str[1]) : ''
        }

        forEach({STRING}, util) {
            STRING = Scratch.Cast.toString(STRING)

            if (util.stackFrame.execute) {
                util.stackFrame.index++;
                const { index, entry } = util.stackFrame;
                if (index > entry.length - 1) return;
                util.thread.stackFrames[0].string = entry[index];
            } else {
                const entry = Object.entries(STRING);
                if (entry.length === 0) return;
                util.stackFrame.entry = entry;
                util.stackFrame.execute = true;
                util.stackFrame.index = 0;
                util.thread.stackFrames[0].string = entry[0];
            }
            util.startBranch(1, true);
        }

        uwuify({ STRING }, util) {
            STRING = Scratch.Cast.toString(STRING);
 
            return STRING
                .replace(/(?:r|l)/g, 'w')
                .replace(/(?:R|L)/g, 'W')
                .replace(/n([aeiou])/g, 'ny$1')
                .replace(/N([aeiou])/g, 'Ny$1')
                .replace(/N([AEIOU])/g, 'NY$1')
                .replace(/ove/g, 'uv')
                .replace(/!+/g, ' owo!')
                .replace(/\b(?:you|u)\b/gi, 'yu')
                .replace(/\b(?:the)\b/gi, 'da')
                .replace(/(?:th)/gi, 'd')
                .replace(/(?:TH)/g, 'D')
                .replace(/\b(?:me)\b/gi, 'mwe')
                .replace(/(?:s+)/g, 's~');
        }

        nextLine({ A, B }) {
            A = Scratch.Cast.toString(A);
            B = Scratch.Cast.toString(B);
            return A + '\n' + B;
        }

        pick({ A, B }) {
            A = Scratch.Cast.toString(A);
            B = Scratch.Cast.toString(B);
            return Math.random() < 0.5 ? A : B;
        }

        containsAllLetters({ A, B }) {
            A = Scratch.Cast.toString(A);
            B = Scratch.Cast.toString(B);
            for (const letter of B) {
                if (!A.includes(letter)) {
                    return false;
                }
            }
            return true;
        }

        repeat({ STRING, INT }) {
            STRING = Scratch.Cast.toString(STRING);
            INT = Scratch.Cast.toNumber(INT);
            if (INT <= 0 || INT == Infinity) {
                return '';
            }
            return STRING.repeat(Math.round(INT));
        }
            
    }

    Scratch.extensions.register(new YetAnotherStringExtension());
})(Scratch);