// Name: Yet Another String Extension
// ID: dogeiscutyetanotherstringextension
// Description: A small collection of utilty blocks intended to make managing strings much, much easier.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Yet Another String Extension\' must run unsandboxed!');
    }

    //ScratchBlocks.BlockSvg.registerCustomNotch("stringBuilder", `a 4 4 0 0 1 4 4 a 14 6 0 0 0 14 6 a 14 6 0 0 0 14 -6 a 4 4 0 0 1 4 -4`);

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
                        branches: [{
                            //accepts: 'stringBuilder'
                        }],
                        extensions: ["colours_operators"],
                    },
                    {
                        opcode: 'builderAppend',
                        text: 'append [STRING] to builder',
                        blockType: Scratch.BlockType.COMMAND,
                        //notchAccepts: 'stringBuilder',
                        arguments: {
                            STRING: {type: Scratch.ArgumentType.STRING,defaultValue: "foo"},
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
                    '---',
                    {
                        blockType: Scratch.BlockType.XML,
                        hideFromPalette: true,
                        xml: `<block type="procedures_definition_return" ><value name="custom_block"><shadow type="procedures_prototype" ><mutation proccode="uwuify %s" argumentids="[&quot;*?@d4k=gX[DhDoY/NJR)&quot;]" argumentnames="[&quot;number or text&quot;]" argumentdefaults="[&quot;&quot;]" warp="false" returns="true" edited="true" optype="&quot;string&quot;" color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><value name="*?@d4k=gX[DhDoY/NJR)"><shadow type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></shadow></value></shadow></value><next><block type="procedures_return" ><value name="return"><block type="dogeiscutyetanotherstringextension_builder" ><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_forEach" ><value name="I"><shadow type="dogeiscutyetanotherstringextension_forEachI" ></shadow></value><value name="L"><shadow type="dogeiscutyetanotherstringextension_forEachL" ></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="SUBSTACK"><block type="control_switch_default" ><value name="CONDITION"><block type="dogeiscutyetanotherstringextension_forEachL" ></block></value><value name="SUBSTACK1"><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">r</field></shadow></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">w</field></shadow></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">l</field></shadow></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">w</field></shadow></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">R</field></shadow></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">W</field></shadow></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">L</field></shadow></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">W</field></shadow></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">n</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_contains" ><value name="STRING1"><shadow type="text" ><field name="TEXT">aeiou</field></shadow></value><value name="STRING2"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT">a</field></shadow></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">ny</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">N</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_contains" ><value name="STRING1"><shadow type="text" ><field name="TEXT">aeiou</field></shadow></value><value name="STRING2"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT">a</field></shadow></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">Ny</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">o</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_and" ><value name="OPERAND1"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT">u</field></shadow></value></block></value><value name="OPERAND2"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">2</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT">v</field></shadow></value></block></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">uv</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">y</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_and" ><value name="OPERAND1"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT">o</field></shadow></value></block></value><value name="OPERAND2"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">2</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT">u</field></shadow></value></block></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">yu</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">t</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_and" ><value name="OPERAND1"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT">h</field></shadow></value></block></value><value name="OPERAND2"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">2</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT">e</field></shadow></value></block></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">da</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">T</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT">H</field></shadow></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">D</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">m</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT">m</field></shadow></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">mwe</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">s</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT"></field></shadow></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT">s~</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value><next><block type="control_case" ><value name="CONDITION"><shadow type="text" ><field name="TEXT">!</field></shadow></value><value name="SUBSTACK"><block type="control_if_else" ><value name="CONDITION"><block type="operator_equals" ><value name="OPERAND1"><block type="operator_letter_of" ><value name="LETTER"><block type="operator_add" ><value name="NUM1"><block type="dogeiscutyetanotherstringextension_forEachI" ></block><shadow type="math_number" ><field name="NUM"></field></shadow></value><value name="NUM2"><shadow type="math_number" ><field name="NUM">1</field></shadow></value></block><shadow type="math_whole_number" ><field name="NUM">1</field></shadow></value><value name="STRING"><block type="argument_reporter_string_number" ><mutation color="[&quot;#59C059&quot;,&quot;#3eac3e&quot;,&quot;#31a031&quot;]"></mutation><field name="VALUE">number or text</field></block><shadow type="text" ><field name="TEXT">apple</field></shadow></value></block><shadow type="text" ><field name="TEXT"></field></shadow></value><value name="OPERAND2"><shadow type="text" ><field name="TEXT"></field></shadow></value></block></value><value name="SUBSTACK"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><shadow type="text" ><field name="TEXT"> owo!</field></shadow></value></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></next></block></value><value name="SUBSTACK2"><block type="dogeiscutyetanotherstringextension_builderAppend" ><value name="STRING"><block type="dogeiscutyetanotherstringextension_forEachL" ></block><shadow type="text" ><field name="TEXT">foo</field></shadow></value></block></value></block></value></block></value></block><shadow type="text" ><field name="TEXT">1</field></shadow></value></block></next></block>,<shadow type="text" ><field name="TEXT"></field></shadow>`
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
            
    }

    Scratch.extensions.register(new YetAnotherStringExtension());
})(Scratch);