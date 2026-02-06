// Name: Sets
// ID: dogeiscutSet
// Description: Store non-repeating, unordered, data super efficently in sets.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Sets\' must run unsandboxed!');
    }

    let setLimit = 2 ** 32 - 1

    // credit to sharpool because jwklong stole the for each code from his extension haha he's soo evil
    // credit to jwklong because i stole the array type code from his extension haha im soo evil

    /**
    * @param {number} x
    * @returns {string}
    */
    function formatNumber(x) {
        if (x >= 1e6) {
            return x.toExponential(4)
        } else {
            x = Math.floor(x * 1000) / 1000
            return x.toFixed(Math.min(3, (String(x).split('.')[1] || '').length))
        }
    }

    const escapeHTML = unsafe => {
        return unsafe
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;")
    };

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    // polyfills

    if (!Set.prototype.union) {
        Set.prototype.union = function union(iterableValue) {
            const resultSet = new Set(this)
            for (const elementValue of iterableValue) {
                resultSet.add(elementValue)
            }
            return resultSet
        }
    }

    if (!Set.prototype.difference) {
        Set.prototype.difference = function difference(iterableValue) {
            const iterableSet = new Set(iterableValue)
            const resultSet = new Set()
            for (const elementValue of this) {
                if (!iterableSet.has(elementValue)) {
                    resultSet.add(elementValue)
                }
            }
            return resultSet
        }
    }

    if (!Set.prototype.intersection) {
        Set.prototype.intersection = function intersection(iterableValue) {
            const iterableSet = new Set(iterableValue)
            const resultSet = new Set()
            for (const elementValue of this) {
                if (iterableSet.has(elementValue)) {
                    resultSet.add(elementValue)
                }
            }
            return resultSet
        }
    }

    if (!Set.prototype.symmetricDifference) {
        Set.prototype.symmetricDifference = function symmetricDifference(iterableValue) {
            const iterableSet = new Set(iterableValue)
            const resultSet = new Set()

            for (const elementValue of this) {
                if (!iterableSet.has(elementValue)) {
                    resultSet.add(elementValue)
                }
            }

            for (const elementValue of iterableSet) {
                if (!this.has(elementValue)) {
                    resultSet.add(elementValue)
                }
            }

            return resultSet
        }
    }

    if (!Set.prototype.isSubsetOf) {
        Set.prototype.isSubsetOf = function isSubsetOf(iterableValue) {
            const iterableSet = new Set(iterableValue)
            for (const elementValue of this) {
                if (!iterableSet.has(elementValue)) {
                    return false
                }
            }
            return true
        }
    }

    if (!Set.prototype.isSupersetOf) {
        Set.prototype.isSupersetOf = function isSupersetOf(iterableValue) {
            const iterableSet = new Set(iterableValue)
            for (const elementValue of iterableSet) {
                if (!this.has(elementValue)) {
                    return false
                }
            }
            return true
        }
    }

    if (!Set.prototype.isDisjointFrom) {
        Set.prototype.isDisjointFrom = function isDisjointFrom(iterableValue) {
            const iterableSet = new Set(iterableValue)
            for (const elementValue of this) {
                if (iterableSet.has(elementValue)) {
                    return false
                }
            }
            return true
        }
    }

    function isObject(x) {
        const fnToString = Function.prototype.toString
        const classRegex = /^class\s/
        if (typeof x === "function") {
            return !classRegex.test(fnToString.call(x))
        }
        if (x !== null && typeof x === "object") {
            const ctor = x.constructor
            return !(typeof ctor === "function" && classRegex.test(fnToString.call(ctor)))
        }
        return false
    }

    class SetType {
        customId = "dogeiscutSet"

        set = new Set()

        constructor(set = new Set()) {
            this.set = new Set();
            for (let item of set) {
                if (item instanceof Set && !(item instanceof SetType)) {
                    this.set.add(new SetType(item));
                } else {
                    this.set.add(item);
                }
            }
        }

        static toSet(x) {
            if (x instanceof SetType) return new SetType([...x.set])
            if (x instanceof Set) return new SetType([...x])
            if (vm.jwArray && x instanceof vm.jwArray.Type) return new SetType(new Set([...x.array]))
            if (x instanceof Array) return new SetType(new Set([...x]))
            if (x === "" || x === null || x === undefined) return new SetType([])
            if (typeof x == "object" && typeof x.toJSON == "function") {
                let parsed = x.toJSON()
                if (parsed instanceof Array) return new SetType(new Set(parsed))
                if (isObject(parsed)) return new SetType(new Set(Object.values(parsed)))
                return new SetType(new Set([parsed]))
            }
            try {
                let parsed = JSON.parse(x)
                if (parsed instanceof Array) return new SetType(parsed)
            } catch {}
            return new SetType([x])
        }

        static forSet(x) {
            if (x instanceof SetType) return new SetType(x.set)
            if (x instanceof Set) return new SetType(x)
            if (vm.jwArray && x instanceof vm.jwArray.Type) return new vm.jwArray.Type([...x.array])
            if (vm.jwArray && x instanceof Array) return new vm.jwArray.Type([...x.array])
            if (vm.dogeiscutObject && isObject(x)) return new vm.dogeiscutObject.Type({...x})
            return x
        }

        static display(x) {
            try {
                switch (typeof x) {
                    case "object":
                        if (x === null) return "null"
                        if (typeof x.dogeiscutSetHandler == "function") {
                            return x.dogeiscutSetHandler()
                        }
                        if (typeof x.jwArrayHandler == "function") {
                            return x.jwArrayHandler()
                        }
                        return "Object"
                    case "undefined":
                        return "null"
                    case "number":
                        return formatNumber(x)
                    case "boolean":
                        return x ? "true" : "false"
                    case "string":
                        return `"${escapeHTML(Scratch.Cast.toString(x))}"`
                }
            } catch {}
            return "?"
        }

        dogeiscutSetHandler() {
            return `Set<${formatNumber(this.set.size)}>`
        }

        jwArrayHandler() {
            return `Set<${formatNumber(this.set.size)}>`
        }

        toString(pretty = false) {
            return JSON.stringify(Array.from(this.set), null, pretty ? "\t" : null)
        }
        toJSON() {
            return Array.from(this.set).map(v => {
                if (typeof v == "object" && v !== null) {
                    if (v.toJSON && typeof v.toJSON == "function") return v.toJSON()
                    if (v.toString && typeof v.toString == "function") return v.toString()
                    return JSON.stringify(v)
                }
                return v
            })
        }
        
        toMonitorContent = () => span(this.toString())

        toReporterContent() {
            let root = document.createElement('div')
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'

            let setDisplay = span(`Set: {${Array.from(this.set).slice(0, 50).map(v => SetType.display(v)).join(', ')}}`)
            setDisplay.style.overflow = "hidden"
            setDisplay.style.whiteSpace = "nowrap"
            setDisplay.style.textOverflow = "ellipsis"
            setDisplay.style.maxWidth = "256px"
            root.appendChild(setDisplay)

            root.appendChild(span(`Size: ${this.set.size}`))

            return root
        }

        flat(depth = 1) {
            depth = Math.floor(depth)
            if (depth < 1) return this
            let result = new Set()
            for (let v of this.set) {
                if (v instanceof SetType) {
                    for (let item of v.flat(depth - 1).set) {
                    result.add(item)
                    }
                } else {
                    result.add(v)
                }
            }
            return new SetType(result)
        }

        get size() {
            return this.set.size
        }
    }

    const dogeiscutSet = {
        Type: SetType,
        Block: {
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.ARROW,
            forceOutputType: "Set",
            disableMonitor: true
        },
        Argument: {
            shape: Scratch.BlockShape.ARROW,
            check: ["Set"]
        }
    }

    class Extension {
        constructor() {
            vm.dogeiscutSet = dogeiscutSet
            vm.runtime.registerSerializer(
                "dogeiscutSet",
                v => Array.from(v.set).map(w => {
                    if (typeof w == "object" && w != null && w.customId) {
                        return {
                            customType: true,
                            typeId: w.customId,
                            serialized: vm.runtime.serializers[w.customId].serialize(w)
                        };
                    }
                    return w
                }), 
                v => new dogeiscutSet.Type(v.map(w => {
                    if (typeof w == "object" && w != null && w.customType) {
                        return vm.runtime.serializers[w.typeId].deserialize(w.serialized)
                    }
                    return w
                }))
            );
            vm.runtime.registerCompiledExtensionBlocks('dogeiscutSet', this.getCompileInfo());
        }

        getInfo() {
            return {
                id: "dogeiscutSet",
                name: "Sets",
                color1: "#1ABC9C",
                menuIconURI: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDIwIDIwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICBzb2RpcG9kaTpkb2NuYW1lPSJkb3dubG9hZCAoOSkuc3ZnIgogICB4bWw6c3BhY2U9InByZXNlcnZlIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjMgKDBlMTUwZWQ2YzQsIDIwMjMtMDctMjEpIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxkZWZzCiAgICAgaWQ9ImRlZnMxIiAvPjxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MSIKICAgICBwYWdlY29sb3I9IiM1MDUwNTAiCiAgICAgYm9yZGVyY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyb3BhY2l0eT0iMSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMCIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMCIKICAgICBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIxIgogICAgIGlua3NjYXBlOmRlc2tjb2xvcj0iIzUwNTA1MCIKICAgICBpbmtzY2FwZTp6b29tPSIzLjczNDc0NSIKICAgICBpbmtzY2FwZTpjeD0iLTQ0LjcxNTIzNSIKICAgICBpbmtzY2FwZTpjeT0iMjQuMzY1Nzg3IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMjU2MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMzg3IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEiIC8+PGNpcmNsZQogICAgIHN0eWxlPSJzdHJva2Utd2lkdGg6MnB4O3BhaW50LW9yZGVyOnN0cm9rZTtmaWxsOiMxYWJjOWM7c3Ryb2tlOiMxNDk2N2Q7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICBjeD0iMTAiCiAgICAgY3k9IjEwIgogICAgIHI9IjkiCiAgICAgaWQ9ImNpcmNsZTEiIC8+PHBhdGgKICAgICBpZD0icGF0aDMiCiAgICAgc3R5bGU9ImNvbG9yOiMwMDAwMDA7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjpBcmlhbDtmaWxsOiNmZmZmZmY7LWlua3NjYXBlLXN0cm9rZTpub25lIgogICAgIGQ9Im0gOS4xNjIyODY3LDMuNjg4NDc3IGMgLTEuNTM4ODcsMCAtMi45MDAxNCwwLjYzMjAxMTMgLTMuOTkyMTg4LDEuODQ1NzAzMSBoIC0wLjAwMTkgYyAtMS4wODY5ODMsMS4yMTUwMzM3IC0xLjY1MDM5MywyLjc0MDk2OTkgLTEuNjUwMzkzLDQuNDY2Nzk2OSAwLDEuNzI1ODI3IDAuNTYzNDE4LDMuMjQ5ODEgMS42NTAzOSw0LjQ2NDg0NCAxLjA4Njc3NCwxLjIxNDgxMSAyLjQ0OTg5OSwxLjg0NTcwMiAzLjk5NDE0MSwxLjg0NTcwMiBIIDE0LjgwODgyIFYgMTQuMjg4MDg1IEggOS4xNjIzMzY3IGMgLTAuOTk5Mzg2LDAgLTEuODM5MzcsLTAuMzYzNzEyIC0yLjYwMTU2MywtMS4xMjY5NTIgLTAuNjA4OTk5LC0wLjYxOTk4IC0wLjkyMTkxLC0xLjM0MzU3OSAtMS4wODAwNzgsLTIuMTU0Mjk4IEggMTQuODA4ODIgViA4Ljk4MzM5OTEgSCA1LjQ4MjY0ODcgYyAwLjE2MjQ1LC0wLjgwNTgwNjkgMC40NzgwNDIsLTEuNTI0ODA2MSAxLjA4Nzg5MSwtMi4xNDQ1MzE0IDAuNzU2MDksLTAuNzY4MzM1MyAxLjU5MzI0LC0xLjEzNDc2NTYgMi41OTE3OTcsLTEuMTM0NzY1NyBIIDE0LjgwODgyIFYgMy42ODg0NzcgWiIgLz48L3N2Zz4K",
                blocks: [
                    {
                        opcode: 'blank',
                        text: 'blank set',
                        ...dogeiscutSet.Block
                    },
                    {
                        opcode: 'fromList',
                        text: 'set from list [LIST]',
                        arguments: {
                            LIST: {
                                menu: "list"
                            }
                        },
                        hideFromPalette: true, //doesn't work for some reason
                        ...dogeiscutSet.Block
                    },
                    {
                        opcode: 'parse',
                        text: 'parse [INPUT] as set',
                        arguments: {
                            INPUT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '["a", "b", "c"]',
                                exemptFromNormalization: true
                            }
                        },
                        ...dogeiscutSet.Block
                    },
                    "---",
                    {
                        opcode: 'builderCurrent',
                        text: 'current set',
                        hideFromPalette: true,
                        canDragDuplicate: true,
                        ...dogeiscutSet.Block
                    },
                    {
                        opcode: 'builder',
                        text: 'set builder [SHADOW]',
                        branches: [{}],
                        arguments: {
                            SHADOW: {
                                fillIn: 'builderCurrent'
                            }
                        },
                        ...dogeiscutSet.Block
                    },
                    {
                        opcode: 'builderAppend',
                        text: 'append [VALUE] to builder',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true
                            }
                        },
                    },
                    {
                        opcode: 'builderSet',
                        text: 'set builder to [SET]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            SET: dogeiscutSet.Argument
                        }
                    },
                    "---",
                    {
                        opcode: 'has',
                        text: '[SET] has [VALUE]',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            SET: dogeiscutSet.Argument,
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                exemptFromNormalization: true
                            }
                        }
                    },
                    {
                        opcode: 'isSubsetOf',
                        text: 'is [ONE] a subset of [TWO]?',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            ONE: dogeiscutSet.Argument,
                            TWO: dogeiscutSet.Argument,
                        }
                    },
                    {
                        opcode: 'isSupersetOf',
                        text: 'is [ONE] a superset of [TWO]?',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            ONE: dogeiscutSet.Argument,
                            TWO: dogeiscutSet.Argument,
                        }
                    },
                    {
                        opcode: 'isDisjointFrom',
                        text: 'is [ONE] disjoint from [TWO]?',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            ONE: dogeiscutSet.Argument,
                            TWO: dogeiscutSet.Argument,
                        }
                    },
                    {
                        opcode: 'size',
                        text: 'size of [SET]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            SET: dogeiscutSet.Argument
                        }
                    },
                    "---",
                    {
                        opcode: 'add',
                        text: 'add [VALUE] to [SET]',
                        arguments: {
                            SET: dogeiscutSet.Argument,
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true
                            }
                        },
                        ...dogeiscutSet.Block
                    },
                    {
                        opcode: 'delete',
                        text: 'delete [VALUE] from [SET]',
                        arguments: {
                            SET: dogeiscutSet.Argument,
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true
                            }
                        },
                        ...dogeiscutSet.Block
                    },
                    '---',
                    {
                        opcode: 'union',
                        text: 'union [ONE] with [TWO]',
                        arguments: {
                            ONE: dogeiscutSet.Argument,
                            TWO: dogeiscutSet.Argument
                        },
                        ...dogeiscutSet.Block
                    },
                    {
                        opcode: 'intersect',
                        text: 'intersect [ONE] with [TWO]',
                        arguments: {
                            ONE: dogeiscutSet.Argument,
                            TWO: dogeiscutSet.Argument
                        },
                        ...dogeiscutSet.Block
                    },
                    {
                        opcode: 'difference',
                        text: 'difference [ONE] with [TWO]',
                        arguments: {
                            ONE: dogeiscutSet.Argument,
                            TWO: dogeiscutSet.Argument
                        },
                        ...dogeiscutSet.Block
                    },
                    {
                        opcode: 'symmetricDifference',
                        text: 'symmetric difference [ONE] with [TWO]',
                        arguments: {
                            ONE: dogeiscutSet.Argument,
                            TWO: dogeiscutSet.Argument
                        },
                        ...dogeiscutSet.Block
                    },
                    "---",
                    {
                        opcode: 'flat',
                        text: 'flat [SET] with depth [DEPTH]',
                        arguments: {
                            SET: dogeiscutSet.Argument,
                            DEPTH: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        ...dogeiscutSet.Block
                    },
                    "---",
                    {
                        opcode: 'toString',
                        text: 'stringify [SET] [FORMAT]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            SET: dogeiscutSet.Argument,
                            FORMAT: {
                                menu: "stringifyFormat",
                                defaultValue: "compact"
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'forEachV',
                        text: 'value',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        allowDropAnywhere: true,
                        canDragDuplicate: true
                    },
                    {
                        opcode: 'forEach',
                        text: 'for [V] of [SET]',
                        blockType: Scratch.BlockType.LOOP,
                        arguments: {
                            SET: dogeiscutSet.Argument,
                            V: {
                                fillIn: 'forEachV'
                            }
                        }
                    },
                    /*{
                        opcode: 'forEachBreak',
                        text: 'break',
                        blockType: Scratch.BlockType.COMMAND,
                        isTerminal: true
                    }*/
                ],
                menus: {
                    list: {
                        acceptReporters: false,
                        items: "getLists",
                    },
                    stringifyFormat: {
                        acceptReporters: false,
                        items: [
                            "compact",
                            "pretty"
                        ]
                    }
                }
            };
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
                        compiler.source = 'vm.dogeiscutSet.Type.toSet(yield* (function*() {';
                        compiler.source += `thread._dogeiscutSetBuilderIndex ??= [];`
                        compiler.source += `thread._dogeiscutSetBuilderIndex.push([]);`
                        compiler.descendStack(node.substack, new imports.Frame(false, undefined, true));
                        compiler.source += `return thread._dogeiscutSetBuilderIndex.pop();`
                        compiler.source += '})())';
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    }
                }
            };
        }
        
        getLists() {
            const globalLists = Object.values(vm.runtime.getTargetForStage().variables)
                .filter((x) => x.type == "list");
            const localLists = Object.values(vm.editingTarget.variables)
                .filter((x) => x.type == "list");
            const uniqueLists = [...new Set([...globalLists, ...localLists])];
            if (uniqueLists.length === 0) return [{ text: "", value: "" }];
            return uniqueLists.map((v) => ({ text: v.name, value: new dogeiscutSet.Type(v.value) }));
        }

        blank() {
            return new dogeiscutSet.Type()
        }

        blankLength({LENGTH}) {
            LENGTH = clampIndex(Scratch.Cast.toNumber(LENGTH))

            return new dogeiscutSet.Type(Array(LENGTH).fill(undefined))
        }

        fromList({LIST}) {
            return dogeiscutSet.Type.toSet(LIST)
        }

        parse({INPUT}) {
            return dogeiscutSet.Type.toSet(INPUT)
        }

        builderCurrent({}, util) {
            let bi = util.thread._dogeiscutSetBuilderIndex ?? []
            return bi[bi.length-1] ? new dogeiscutSet.Type(bi[bi.length-1]) : new dogeiscutSet.Type([], true)
        }

        builder() {
            return 'noop'
        }

        builderAppend({VALUE}, util) {
            let bi = util.thread._dogeiscutSetBuilderIndex ?? []
            if (bi[bi.length-1]) {
                bi[bi.length-1].push(VALUE)
            }
        }

        builderSet({SET}, util) {
            SET = dogeiscutSet.Type.toSet(SET)
            let bi = util.thread._dogeiscutSetBuilderIndex ?? []
            if (bi[bi.length-1]) {
                bi[bi.length-1] = [...Array.from(SET.set)]
            }
        }

        has({SET, VALUE}) {
            SET = dogeiscutSet.Type.toSet(SET)

            return SET.set.has(VALUE)
        }

        isSubsetOf({ONE, TWO}) {
            ONE = dogeiscutSet.Type.toSet(ONE)
            TWO = dogeiscutSet.Type.toSet(TWO)

            return ONE.set.isSubsetOf(TWO.set);
        }

        isSupersetOf({ONE, TWO}) {
            ONE = dogeiscutSet.Type.toSet(ONE)
            TWO = dogeiscutSet.Type.toSet(TWO)

            return ONE.set.isSupersetOf(TWO.set);
        }

        isDisjointFrom({ONE, TWO}) {
            ONE = dogeiscutSet.Type.toSet(ONE)
            TWO = dogeiscutSet.Type.toSet(TWO)

            return ONE.set.isDisjointFrom(TWO.set);
        }
        
        symmetricDifference({ONE, TWO}) {
            ONE = dogeiscutSet.Type.toSet(ONE)
            TWO = dogeiscutSet.Type.toSet(TWO)

            const logic = ONE.set.symmetricDifference(TWO.set);
            return new dogeiscutSet.Type(logic)
        }

        size({SET}) {
            SET = dogeiscutSet.Type.toSet(SET)

            return SET.size
        }

        add({SET, VALUE}) {
            SET = dogeiscutSet.Type.toSet(SET)

            SET.set.add(dogeiscutSet.Type.forSet(VALUE))
            return SET
        }

        delete({SET, VALUE}) {
            SET = dogeiscutSet.Type.toSet(SET)
            VALUE = dogeiscutSet.Type.forSet(VALUE)

            if (SET.set.has(VALUE)) {
                SET.set.delete(VALUE)
            }// else { // eh even though PM as support for errors, i like to avoid them in extensions...
            //    throw new Error(`Value ${dogeiscutSet.Type.display(VALUE)} not found in set`);
            //}
            return SET
        }

        union({ONE, TWO}) {
            ONE = dogeiscutSet.Type.toSet(ONE)
            TWO = dogeiscutSet.Type.toSet(TWO)

            const logic = ONE.set.union(TWO.set);
            return new dogeiscutSet.Type(logic)
        }

        intersect({ONE, TWO}) {
            ONE = dogeiscutSet.Type.toSet(ONE)
            TWO = dogeiscutSet.Type.toSet(TWO)

            const logic = ONE.set.intersection(TWO.set);
            return new dogeiscutSet.Type(logic)
        }

        difference({ ONE, TWO }) {
            ONE = dogeiscutSet.Type.toSet(ONE)
            TWO = dogeiscutSet.Type.toSet(TWO)

            const logic = ONE.set.difference(TWO.set);
            return new dogeiscutSet.Type(logic)
        }

        flat({SET, DEPTH}) {
            SET = dogeiscutSet.Type.toSet(SET)
            DEPTH = Scratch.Cast.toNumber(DEPTH)

            return SET.flat(DEPTH)
        }

        toString({SET, FORMAT}) {
            SET = dogeiscutSet.Type.toSet(SET)
            
            return SET.toString(FORMAT === "pretty")
        }

        forEachV({}, util) {
            const pair = util.thread.stackFrames[0].dogeiscutSet;
            return pair ? pair[1] : "";
        }

        forEach({SET}, util) {
            SET = dogeiscutSet.Type.toSet(SET);

            if (util.stackFrame.execute) {
                const { entries, pointer } = util.stackFrame;
                util.stackFrame.pointer++;
                if (util.stackFrame.pointer >= entries.length) return;
                util.thread.stackFrames[0].dogeiscutSet = entries[util.stackFrame.pointer];
            } else {
                const entries = [...SET.set].map(value => [value, value]);
                if (entries.length === 0) return;
                util.stackFrame.entries = entries;
                util.stackFrame.pointer = 0;
                util.stackFrame.execute = true;
                util.thread.stackFrames[0].dogeiscutSet = entries[0];
            }

            util.startBranch(1, true);
        }

        forEachBreak({}, util) {
            util.stackFrame.entry = []
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);