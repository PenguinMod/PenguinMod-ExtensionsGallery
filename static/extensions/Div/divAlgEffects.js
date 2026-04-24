(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Algebraic Effects\' must run unsandboxed!');
    }
    const {BlockType, BlockShape, NotchShape, ArgumentType, vm} = Scratch

    const menuIconURI = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgd2lkdGg9IjIwcHgiIGhlaWdodD0iMjBweCIgeG1sbnM6Yng9Imh0dHBzOi8vYm94eS1zdmcuY29tIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQtMS0wIiBocmVmPSIjZ3JhZGllbnQtMSIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxMCIgeTE9IjAiIHgyPSIxMCIgeTI9IjIwIi8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTEiIGJ4OnBpbm5lZD0idHJ1ZSI+CiAgICAgIDxzdG9wIG9mZnNldD0iMCIgc3R5bGU9InN0b3AtY29sb3I6IHJnYigxMTAsIDEyLCAxNjEpOyIvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEiIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoNzAsIDAsIDE1MCk7Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudC0wLTAiIGhyZWY9IiNncmFkaWVudC0wIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjEwIiB5MT0iMSIgeDI9IjEwIiB5Mj0iMTkiLz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQtMCIgYng6cGlubmVkPSJ0cnVlIj4KICAgICAgPHRpdGxlPkZpbGw8L3RpdGxlPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoMTM3LCA0NywgMjI3KTsiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDkyLCAzNywgMjEyKTsiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgPC9kZWZzPgogIDxlbGxpcHNlIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IGZpbGw6IHVybCgjZ3JhZGllbnQtMS0wKTsiIGN4PSIxMCIgY3k9IjEwIiByeD0iMTAiIHJ5PSIxMCIgdHJhbnNmb3JtPSJtYXRyaXgoMS4wMDAwMDAwMDAwMDAwMDAyLCAwLCAwLCAxLjAwMDAwMDAwMDAwMDAwMDIsIC0zLjU1MjcxMzY3ODgwMDUwMWUtMTUsIC0xLjMzMjI2NzYyOTU1MDE4NzhlLTE1KSIvPgogIDxlbGxpcHNlIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IGZpbGw6IHVybCgjZ3JhZGllbnQtMC0wKTsiIGN4PSIxMCIgY3k9IjEwIiByeD0iOSIgcnk9IjkiIHRyYW5zZm9ybT0ibWF0cml4KDEuMDAwMDAwMDAwMDAwMDAwMiwgMCwgMCwgMS4wMDAwMDAwMDAwMDAwMDAyLCAtMy41NTI3MTM2Nzg4MDA1MDFlLTE1LCAtMS4zMzIyNjc2Mjk1NTAxODc4ZS0xNSkiLz4KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLjE1MjgwNTAxNTQ0NDc1NTU4LCAwLCAwLCAwLjE1MjgwNTAxNTQ0NDc1NTU4LCAtMjcuNDYwOTQ3NDQ1OTQzMTY2LCAtMTcuMzg2NjI3NDU2MzQ2NTYpIiBzdHlsZT0iIj4KICAgIDxnIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj4KICAgICAgPHBhdGggZD0iTTIwOS42NzY5NywyMDcuNTkzNDZjMCwwIC0xLjI2MjUzLC0zLjE5MjkxIC0xLjQ5MTQ0LC00LjAzMDczYy0wLjEyODU5LC0wLjQ3MDYzIDAuMTkzMTIsLTAuODA5MTcgMC41NTg5LC0wLjc1Mzc0YzAuODU0ODcsMC4xMjk1MyA0LjIwMjQxLDEuMDMxOCA0LjIwMjQxLDEuMDMxOGMwLDAgMi40MDA2NSwtMS43NjU4OSAzLjE0MDA1LC0yLjE3ODVjMC4zODkwOSwtMC4yMTcxMyAwLjk2NzcsLTAuMDMzMDIgMS4wMzE1OSwwLjM1MjQxYzAuMTM2MTMsMC44MjExOCAwLjI1NTgxLDMuODU2MTMgMC4yNTU4MSwzLjg1NjEzYzAsMCAyLjYzNzYzLDIuMDE5ODIgMy4zMTk0NSwyLjYzMDc2YzAuMzY0NDcsMC4zMjY1NyAwLjQwNTUxLDAuOTc5MDggMC4wNDQ5MSwxLjE2ODI1Yy0wLjc3MDU5LDAuNDA0MjUgLTMuOTMyNjcsMS41MTg3MyAtMy45MzI2NywxLjUxODczYzAsMCAtMC44NDA1MywyLjc5MTk1IC0xLjE4ODQ4LDMuNTIyNDFjLTAuMTg2NTgsMC4zOTE3IC0wLjc3ODMzLDAuNTQzNjMgLTEuMDY2MTksMC4yNDcwMmMtMC42MDc5NCwtMC42MjY0MiAtMi42MDc3MywtMy4xNTQwOSAtMi42MDc3MywtMy4xNTQwOWMwLDAgLTIuNzcwMDgsMC4wMzU4MiAtMy41NzA2NSwtMC4wMjU0Yy0wLjQ0OTMsLTAuMDM0MzYgLTAuOTAwMTcsLTAuNDY1MjcgLTAuNzY5MTcsLTAuNzk2ODdjMC4yOTc1MSwtMC43NTMwNiAyLjA3MzIxLC0zLjM4ODE4IDIuMDczMjEsLTMuMzg4MTh6IiBzdHJva2U9Im5vbmUiLz4KICAgICAgPHBhdGggZD0iTTIwNy4xNTIxMywxNjMuODMyMDdjLTAuNTQyMDgsLTExLjQzNTgyIC0wLjU5MzMyLC0xMi44OTUyOCAtMC41OTMzMiwtMTIuODk1MjhjMCwwIC0xLjE5MDkxLC04LjE4MzkgNy4wOTQsLTguMzEzODJjNy4zMTM5NywtMC4xMTQ2OSA3LjAxNDc0LDguMjY3MzYgNy4wMTQ3NCw4LjI2NzM2YzAsMCAtMC4wMDAwMSwxLjA4NzM3IC0wLjQ1ODQzLDEzLjU0ODQyYy0wLjM5OTAzLDEwLjg0NjY1IC0yLjE5MTE1LDI4LjE5NjY4IC0yLjE5MTE1LDI4LjE5NjY4YzAsMCAtMC4xNjkzMyw0LjE4MjU2IC00LjY0MDg4LDQuMTUzMjNjLTQuMjQxNDksLTAuMDI5MzQgLTQuMjk5OTQsLTQuMzA5MjcgLTQuMjk5OTQsLTQuMzA5MjdjMCwwIC0xLjM2MDI3LC0xNi43MzMxOSAtMS45MjUwMiwtMjguNjQ3MzR6IiBzdHJva2U9IiM0NjAwOTYiLz4KICAgICAgPHBhdGggZD0iTSAyMzQuNTE4IDIxMS4xMDMgQyAyMjQuOTUzIDIwMi45OSAyMjUuOTM3IDE4Ni41ODcgMjMwLjQyMyAxNzQuODY3IEMgMjM2LjEwOCAxNjAuMDE1IDI1Ni41MzMgMTQ2LjM4NiAyNzkuMjM1IDE1NS40NzUgQyAyODEuMzY3IDE1Ni4zMjkgMjg1LjI1NCAxNTkuNjY0IDI4My4yNzEgMTYzLjIzMSBDIDI4MS4zMjYgMTY2LjczIDI3Ni45ODcgMTY1LjE4OSAyNzMuNzAxIDE2My41OTQgQyAyNjkuODkgMTYxLjc0NSAyNjEuNDIgMTYwLjI4OCAyNTEuNjQgMTY0Ljk0MyBDIDI0NS43NTUgMTY3Ljc0NCAyNDIuMjUzIDE3Mi4yNzUgMjQwLjIxMyAxNzguMTI2IEwgMjY1LjAxOCAxNzguMyBDIDI2NS4wMTggMTc4LjMgMjcxLjE1NSAxNzguMjMxIDI3MC42MTIgMTgzLjM5OSBDIDI3MC4wODUgMTg4LjQyNiAyNjQuNzI0IDE4Ny44NiAyNjQuNzI0IDE4Ny44NiBMIDIzOC4yMjEgMTg3LjMgQyAyMzcuNTYxIDE5Mi44MzMgMjM3LjkwNyAxOTguNjg0IDI0MS42NjUgMjAyLjQ3MSBDIDI0Ni45NDYgMjA3Ljc5NSAyNTcuNDEgMjA2LjE3NiAyNjMuMTM3IDIwMy44NzcgQyAyNjcuNTk5IDIwMi4wODYgMjcwLjAwNiAyMDQuMzE2IDI3MC44NzkgMjA2LjY1OCBDIDI3MS43NTIgMjA5IDI2OC45NzYgMjExLjQxIDI2Ni4zODggMjEyLjkxNiBDIDI2My4wODUgMjE0LjgzNyAyNDQuMDg0IDIxOS4yMTYgMjM0LjUxOCAyMTEuMTAzIFoiIHN0cm9rZT0iIzQ2MDA5NiIvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+`

    class DeepHandle {
        constructor(gen, tailcall = false) {this.gen = gen; this.tailcall = tailcall}
    }

    // This never gets exposed to the user lol
    class divEffect {
        customId = "divEffect"
        constructor(eff, data) {
            this.eff = eff;
            this.data = data;
        }

        static *runHandler(body, handlers, val = null) {
            let yielded = body.next(val);
            while(!yielded.done) {
                if(yielded.value instanceof divEffect && yielded.value.eff in handlers) {
                    // console.log(yielded.value.data)
                    return yield* handlers[yielded.value.eff](yielded.value.data, (val, tailcall) =>
                        new DeepHandle(divEffect.runHandler(body, handlers, val), tailcall)
                    , (body) =>
                        new DeepHandle(divEffect.runHandler(body, handlers))
                    );
                }
                yielded = body.next(yield yielded.value)
            }
            return yielded.value;
        }
    }

    const divAlgEffects = {
        Effect: divEffect,
        contType: null,
        continuation(divEffResume) {
            if(this.contType == null)
                this.contType = class extends vm.jwLambda.Type {
                    get resumed() {return this.timesExecuted > 0};
                    jwArrayHandler() {
                        return 'Continuation'
                    }
                    toString() {
                        return 'Continuation' + (this.resumed ? ' (resumed)' : '')
                    }
                }
            return new this.contType(function*(arg) {return yield divEffResume(arg, false)})
        },
        isCont(x) {return this.contType == null ? false : x instanceof this.contType},
        hasRes(x) {return this.isCont(x) && x.resumed},

        *effRun(gen) {
            const stack = [gen]
            let val = null;
            while(stack.length > 0) {
                const top = stack[stack.length-1];
                const step = top.next(val);
                if(step.done) {
                    stack.pop()
                    val = step.value
                } else if(step.value instanceof DeepHandle) {
                    if(step.value.tailcall) stack[stack.length-1] = step.value.gen
                    else stack.push(step.value.gen)
                    val = null
                } else val = yield step.value
            }
            return val
        },

        // descendStack override (can be switched with a new one)
        descendStack(old, nodes, frame) {
            console.log(
                this,
                nodes,
                frame
            )
            if(this.script.yields && this.frames.length == 0) {
                if(this.isProcedure) this.source += 'return '
                this.source += 'yield* vm.divAlgEffects.effRun(function*(){\n'
                const result = old.call(this, nodes, frame)
                this.source +='\n}());'
                return result;
            }
            return old.call(this, nodes, frame)
        }
    }

    function descendSubstack(substack, compiler, frame) {
        const src = compiler.source
        compiler.source = ""
        compiler.descendStack(substack, frame)
        const res = compiler.source
        compiler.source = src
        return res
    }

    class Extension {
        constructor() {
            if(!vm.divAlgEffects) {
                const oldDescendStack = vm.exports.JSGenerator.prototype.descendStack
                vm.exports.JSGenerator.prototype.descendStack = function(nodes, frame) {
                    return vm.divAlgEffects.descendStack.call(this, oldDescendStack, nodes, frame)
                }
            }
            vm.divAlgEffects = divAlgEffects
            vm.runtime.registerCompiledExtensionBlocks('divAlgEffects', this.getCompileInfo());
        }
        getInfo = () => ({
            id: "divAlgEffects",
            name: "Algebraic Effects",
            color1: "#5c25d4",
            color2: "#3d16a8",
            menuIconURI,
            blocks: [
                {
                    opcode: 'effPerform',
                    text: 'perform [EFF] with [DATA]',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    arguments: {
                        EFF: {type: ArgumentType.STRING, defaultValue: "effect"},
                        DATA: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "foo"
                        }
                    },
                },
                {
                    opcode: 'effPerformRet',
                    text: 'perform [EFF] with [DATA]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    allowDropAnywhere: true,
                    arguments: {
                        EFF: {type: ArgumentType.STRING, defaultValue: "effect"},
                        DATA: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "foo"
                        }
                    },
                },

                {
                    opcode: 'effHandle',
                    text: ['handle in', 'effects'],
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    branchCount: 2,
                    branches: [
                        {},
                        {accepts: NotchShape.JIGSAW}
                    ]
                },
                {
                    opcode: 'effHandlerCase',
                    text: 'effect [EFF] with [DATA]',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    notchAccepts: NotchShape.JIGSAW,
                    branchCount: 1,
                    arguments: {
                        EFF: {type: ArgumentType.STRING, defaultValue: "effect"},
                        DATA: {fillIn: 'effData'},
                    }
                },
                {
                    opcode: 'effRecurseHandler',
                    text: 'recursively handle',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    branchCount: 1,
                },

                {
                    opcode: 'effResume',
                    text: 'resume with [DATA]',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "bar"
                        }
                    }
                },
                {
                    opcode: 'effResumeRet',
                    text: 'resume with [DATA]',
                    blockType: BlockType.REPORTER,
                    allowDropAnywhere: true,
                    canDragDuplicate: true,
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "bar"
                        }
                    }
                },
                {
                    opcode: 'effResumeTail',
                    text: 'resume with [DATA]',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    arguments: {
                        DATA: {
                            type: ArgumentType.STRING,
                            exemptFromNormalization: true,
                            defaultValue: "bar"
                        }
                    }
                },

                {
                    opcode: 'effData',
                    text: 'data',
                    blockType: BlockType.REPORTER,
                    hideFromPalette: true,
                    allowDropAnywhere: true,
                    canDragDuplicate: true
                },

                {
                    opcode: "effContinuation",
                    text: "continuation",
                    hideFromPalette: !vm.runtime.ext_jwLambda,
                    blockType: BlockType.REPORTER,
                    blockShape: BlockShape.SQUARE,
                    ...(vm.jwLambda ? vm.jwLambda.Block : {})
                },
                {
                    opcode: "effContHasResumed",
                    text: "has [CONT] resumed?",
                    hideFromPalette: !vm.runtime.ext_jwLambda,
                    blockType: BlockType.BOOLEAN,
                    blockShape: BlockShape.HEXAGONAL
                }
            ]
        })
        getCompileInfo = () => ({
            ir: {
                effPerform(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        EFF: generator.descendInputOfBlock(block, 'EFF'),
                        DATA: generator.descendInputOfBlock(block, 'DATA'),
                    }
                },
                effPerformRet(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        EFF: generator.descendInputOfBlock(block, 'EFF'),
                        DATA: generator.descendInputOfBlock(block, 'DATA'),
                    }
                },

                effHandle(generator, block) {
                    generator.script.yields = true
                    const casesId = block.inputs.SUBSTACK2?.block;
                    function walkStack(blockId) {
                        const result = []
                        while(blockId != null) {
                            const block = generator.getBlockById(blockId);
                            if(!block) break;
                            const handler = {
                                eff: generator.descendInputOfBlock(block, 'EFF'),
                                handler: generator.descendSubstack(block, 'SUBSTACK'),
                            };
                            result.push(handler);
                            blockId = block.next;
                        }
                        return result;
                    }
                    return {
                        kind: 'stack',
                        SUBSTACK1: generator.descendSubstack(block, 'SUBSTACK'),
                        effCases: walkStack(casesId)
                    }
                },
                effHandlerCase(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        EFF: generator.descendInputOfBlock(block, 'EFF'),
                        SUBSTACK: generator.descendSubstack(block, 'SUBSTACK'),
                    }
                },
                effRecurseHandler(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        SUBSTACK: generator.descendSubstack(block, 'SUBSTACK'),
                    }
                },

                effResume(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        DATA: generator.descendInputOfBlock(block, 'DATA'),
                    }
                },
                effResumeRet(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        DATA: generator.descendInputOfBlock(block, 'DATA'),
                    }
                },
                effResumeTail(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        DATA: generator.descendInputOfBlock(block, 'DATA'),
                    }
                },

                effData(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                    }
                },

                effContinuation(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                    }
                },
                effContHasResumed(generator, block) {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        CONT: generator.descendInputOfBlock(block, 'CONT'),
                    }
                },
            },
            js: {
                effPerform(node, compiler, imports) {
                    compiler.source += `yield new vm.divAlgEffects.Effect(${compiler.descendInput(node.EFF).asString()}, ${compiler.descendInput(node.DATA).asUnknown()});`
                },
                effPerformRet(node, compiler, imports) {
                    return new imports.TypedInput(`(yield new vm.divAlgEffects.Effect(${compiler.descendInput(node.EFF).asString()}, ${compiler.descendInput(node.DATA).asUnknown()}))`, imports.TYPE_UNKNOWN)
                },

                effHandle(node, compiler, imports) {
                    const body = compiler.localVariables.next(),
                      handlers = compiler.localVariables.next(),
                           res = compiler.localVariables.next();
                    const substack1 = descendSubstack(node.SUBSTACK1, compiler, new imports.Frame(false, null, true));
                    const effName = (eff) => {
                        const key = compiler.descendInput(eff).asString();
                        return eff.kind == "constant" ? key : `[${key}]`
                    }
                    const effCases = node.effCases.map(({eff, handler}) =>
                     /*js*/`${effName(eff)}: function*(divEffData, divEffResume, divEffRehandle) {\n`
                          +`    ${descendSubstack(handler, compiler, new imports.Frame(false, "divAlgEffects.effHandlerCase", true))};\n`
                          +`},`
                    ).join("");
                    compiler.source +=
                    /*js*/`const ${body} = (function*() {${substack1}})();\n`
                   +/*js*/`const ${handlers} = {\n${effCases}\n};\n`
                   +/*js*/`const ${res} = yield* vm.divAlgEffects.Effect.runHandler(${body}, ${handlers});\n`
                   +/*js*/`if(${res} != null) return ${res};`
                },
                effHandlerCase(node, compiler, imports) {
                    // This should never be directly compiled
                    // effHandle deconstructs it automatically
                    compiler.source += `throw 'All "effect" blocks must be inside of a "handle" block.';\n`
                },
                effRecurseHandler(node, compiler, imports) {
                    if(!compiler.frames.some(f => f.parent === "divAlgEffects.effHandlerCase")) return;
                    const substack = descendSubstack(node.SUBSTACK, compiler, new imports.Frame(false, null, true));
                    compiler.source +=
                    /*js*/`yield divEffRehandle((function*() {${substack}})());`
                },

                effResume(node, compiler, imports) {
                    if(!compiler.frames.some(f => f.parent === "divAlgEffects.effHandlerCase")) return;
                    compiler.source +=
                    /*js*/`yield divEffResume(${compiler.descendInput(node.DATA).asUnknown()}, false);`
                },
                effResumeRet(node, compiler, imports) {
                    if(!compiler.frames.some(f => f.parent === "divAlgEffects.effHandlerCase")) 
                        return new imports.TypedInput(`""`, imports.TYPE_UNKNOWN);
                    return new imports.TypedInput(
                        /*js*/`yield divEffResume(${compiler.descendInput(node.DATA).asUnknown()}, false)`,
                        imports.TYPE_UNKNOWN);
                },
                effResumeTail(node, compiler, imports) {
                    if(!compiler.frames.some(f => f.parent === "divAlgEffects.effHandlerCase")) return;
                    compiler.source +=
                    /*js*/`return yield divEffResume(${compiler.descendInput(node.DATA).asUnknown()}, true);`
                },

                effData(node, compiler, imports) {
                    if(compiler.frames.some(f => f.parent === "divAlgEffects.effHandlerCase"))
                        return new imports.TypedInput("divEffData", imports.TYPE_UNKNOWN)
                    return new imports.TypedInput("''", imports.TYPE_UNKNOWN)
                },

                effContinuation: (node, compiler, imports) => {
                    if(compiler.frames.some(f => f.parent === "divAlgEffects.effHandlerCase"))
                        return new imports.TypedInput(!vm.jwLambda ? '0' : 'vm.divAlgEffects.continuation(divEffResume)', imports.TYPE_UNKNOWN)
                    return new imports.TypedInput(!vm.jwLambda ? '0' : 'new vm.jwLambda.Type()', imports.TYPE_UNKNOWN)
                },
                effContHasResumed: (node, compiler, imports) => {
                    return new imports.TypedInput(!vm.jwLambda ? 'false' : `vm.divAlgEffects.hasRes(${compiler.descendInput(node.CONT).asUnknown()})`, imports.TYPE_BOOLEAN)
                }
            }
        })

        effPerform() {
            return "noop"
        }
        effPerformRet() {
            return "noop"
        }

        effHandle() {
            return "noop"
        }
        effHandlerCase() {
            return "noop"
        }
        effRecurseHandler() {
            return "noop"
        }

        effResume() {
            return "noop"
        }
        effResumeRet() {
            return "noop"
        }
        effResumeTail() {
            return "noop"
        }

        effData() {
            return "noop"
        }

        effContinuation() {
            return "noop"
        }
        effContHasResumed() {
            return "noop"
        }
    }
    Scratch.extensions.register(new Extension())
})(Scratch)
