// Name: Yet Another String Extension
// ID: dogeiscutyetanotherstringextension
// Description: A small collection of utilty blocks intended to make managing strings much, much easier.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Yet Another String Extension\' must run unsandboxed!');
    }

    if (Scratch.gui) {
        Scratch.gui.getBlockly().then(ScratchBlocks => {
            function recursiveRender(block) {
                if (!block) return;
                while (block.parentBlock_ !== null) {
                    if (block.parentBlock_ !== null) {
                        block.render(false);
                        block = block.parentBlock_;
                    }
                }
                block.render(false);
            }
            ScratchBlocks.FieldCustom.registerInput(
                "multiline",
                (() => {
                    const container = document.createElement('textarea');
                    container.style.background = "#fff";
                    container.style.color = "#404040";
                    container.style.minWidth = "29px";
                    container.style.minHeight = "27px";
                    container.style.margin = "5px 0";
                    container.style.padding = "5px";
                    container.style.borderRadius = '8px';
                    container.style.display = 'block';
                    container.style.resize = "both";
                    container.style.overflow = "auto";
                    container.style.boxSizing = "border-box";

                    document.body.appendChild(container);

                    return container;
                })(),
                (field, input) => {
                    if (!input) return;

                    let value;
                    try {
                      value = JSON.parse(field.getValue());
                    } catch {
                        value = field.getValue();
                    }
                    let str = "";
                    let width = 120;
                    let height = 80;

                    if (typeof value === "string") {
                        str = value;
                    } else if (value && typeof value === "object") {
                        str = value['string'] || "";
                        if (Array.isArray(value['size']) && value['size'].length === 2) {
                            width = value['size'][0] || 120;
                            height = value['size'][1] || 80;
                        }
                    }

                    input.value = str;
                    input.style.width = width + "px";
                    input.style.height = height + "px";
                    field.setValue(JSON.stringify({ 'string': str, 'size': [width, height] }));
                    let isPaused = false;
                    input.addEventListener("keydown", function(event) {
                        if (event.key === "Tab") {
                            event.preventDefault();

                            let textarea = this;
                            let cursorStart = textarea.selectionStart;
                            let cursorEnd = textarea.selectionEnd;

                            textarea.value =
                                textarea.value.substring(0, cursorStart) +
                                "\t" +
                                textarea.value.substring(cursorEnd);

                            textarea.selectionStart = textarea.selectionEnd = cursorStart + 1;
                        }
                    });
                    const observer = new ResizeObserver(entries => {
                        if (isPaused) return;
                        for (const entry of entries) {
                            isPaused = true;
                            let { width, height } = entry.contentRect;
                            //width = Math.max(100, width);
                            //height = Math.max(32, height);

                            const foreignObject = input.parentNode;
                            foreignObject.setAttribute("width", width);
                            foreignObject.setAttribute("height", height);

                            field.size_.width = width + 15;
                            field.size_.height = height + 25;
                            input.style.border = `solid 1px ${field.sourceBlock_?.colourTertiary_}`;
                            recursiveRender(field.sourceBlock_);
                            requestAnimationFrame(() => { isPaused = false });
                            field.setValue(JSON.stringify({ 'string': input.value, 'size': [width, height] }));
                        }
                    });

                    observer.observe(input);

                    input.addEventListener("change", () => {
                        field.setValue(JSON.stringify({ 'string': input.value, 'size': [parseFloat(input.style.width), parseFloat(input.style.height)] }));
                    })
                },
                (block) => { },
                (block) => { }
            );
        });
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
                    '---',
                    /*UNFINISHED {
                        opcode: 'multiline',
                        text: '[STRING]',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        disableMonitor: true,
                        arguments: {
                            STRING: {
                                type: Scratch.ArgumentType.CUSTOM,
                                id: "multiline",
                                defaultValue: "Multiple\nLines!\nYay!"
                            }
                        }
                    }*/
                ]
            }
        }

        getCompileInfo() {
            return {
                ir: {
                    builder: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            substack: generator.descendSubstack(block, 'SUBSTACK')
                        }
                    },
                },
                js: {
                    builder: (node, compiler, imports) => {
                        const originalSource = compiler.source;

                        compiler.source =  'Scratch.Cast.toString(yield* (function*() {';
                        compiler.source += `    thread._dogeiscutyetanotherstringextensionBuilderIndex ??= [];`;
                        compiler.source += `    thread._dogeiscutyetanotherstringextensionBuilderIndex.push('');`;
                        compiler.descendStack(node.substack, new imports.Frame(false, undefined, true));
                        compiler.source += `    return thread._dogeiscutyetanotherstringextensionBuilderIndex.pop();`;
                        compiler.source += '})())';

                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_STRING);
                    }
                }
            };
        }

        currentString({}, util) {
            if (util.thread._dogeiscutyetanotherstringextensionBuilderIndex && util.thread._dogeiscutyetanotherstringextensionBuilderIndex.length > 0) {
                return util.thread._dogeiscutyetanotherstringextensionBuilderIndex[util.thread._dogeiscutyetanotherstringextensionBuilderIndex.length-1]
            } else {
                throw 'This block must be inside of a "string builder" block.';
            }
        }

        async builder({}, util) {
            return 'noop'
        }

        builderAppend({ STRING }, util) {
            STRING = Scratch.Cast.toString(STRING)
            if (util.thread._dogeiscutyetanotherstringextensionBuilderIndex && util.thread._dogeiscutyetanotherstringextensionBuilderIndex.length > 0) {
                util.thread._dogeiscutyetanotherstringextensionBuilderIndex[util.thread._dogeiscutyetanotherstringextensionBuilderIndex.length-1] += STRING
            } else {
                throw 'This block must be inside of a "string builder" block.';
            }
        }

        builderSet({ STRING }, util) {
            STRING = Scratch.Cast.toString(STRING)
            if (util.thread._dogeiscutyetanotherstringextensionBuilderIndex && util.thread._dogeiscutyetanotherstringextensionBuilderIndex.length > 0) {
                util.thread._dogeiscutyetanotherstringextensionBuilderIndex[util.thread._dogeiscutyetanotherstringextensionBuilderIndex.length-1] = STRING
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

        multiline({ STRING }) {
            let value;
            try {
                value = JSON.parse(STRING)['string'];
            } catch {
                throw 'Failed to get multiline string, this should never happen!'
            }
            return value;
        }
            
    }

    Scratch.extensions.register(new YetAnotherStringExtension());
})(Scratch);