// Name: Regular Expressions
// ID: dogeiscutRegularExpressions
// Description: Create, modify, filter, and more with the new regular epression type.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) { 
        throw new Error("'Regex Expressions' must run unsandboxed!");   
    }

    const BlockType = Scratch.BlockType
    const BlockShape = Scratch.BlockShape
    const ArgumentType = Scratch.ArgumentType
    const TargetType = Scratch.TargetType
    const Cast = Scratch.Cast
    const vm = Scratch.vm;
    const runtime = Scratch.vm.runtime;
    const SB = ScratchBlocks;

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    const escapeHTML = unsafe => {
        return unsafe
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;")
    };
    
    class RegularExpressionType {
        customId = "dogeiscutRegularExpression"

        regex = /(?:)/
        isValid = false

        constructor(regex = /(?:)/, isValid = false, lastIndex = 0) {
            this.regex = regex
            this.isValid = isValid
            this.lastIndex = lastIndex
        }

        static toRegularExpression(x) {
            if (x instanceof RegularExpressionType) {
                return new RegularExpressionType(x.regex, x.isValid, x.lastIndex)
            }
            if (x instanceof RegExp) return new RegularExpressionType(x, true, x.lastIndex)
            try {
                let expression = new RegExp(x)
                return new RegularExpressionType(expression, true) 
            } catch { }
            return new RegularExpressionType() 
        }

        toString() {
            if (this.isValid) {
                return `/${this.source}/${this.flags}`
            }
            return "Invalid Regex"
        }

        jwArrayHandler = () => this.toString()
        toMonitorContent = () => span(this.toString())

        toReporterContent() {
            let root = document.createElement('div')

            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            root.style.fontWeight = 'bold'

            root.appendChild(span(this.toString()))

            return root
        }

        // makes things easy for me
        get dotAll() {
            if (this.isValid) {
                return Cast.toBoolean(this.regex.dotAll)
            }
            return false
        }
        get flags() {
            if (this.isValid) {
                return Cast.toString(this.regex.flags)
            }
            return ""
        }
        get global() {
            if (this.isValid) {
                return Cast.toBoolean(this.regex.global)
            }
            return false
        }
        get hasIndices() {
            if (this.isValid) {
                return Cast.toBoolean(this.regex.hasIndices)
            }
            return false
        }
        get ignoreCase() {
            if (this.isValid) {
                return Cast.toBoolean(this.regex.ignoreCase)
            }
            return false
        }
        get multiline() {
            if (this.isValid) {
                return Cast.toBoolean(this.regex.multiline)
            }
            return false
        }
        get source() {
            if (this.isValid) {
                return Cast.toString(this.regex.source)
            }
            return ""
        }
        get unicode() {
            if (this.isValid) {
                return Cast.toBoolean(this.regex.unicode)
            }
            return false
        }
        get unicodeSets() {
            if (this.isValid) {
                return Cast.toBoolean(this.regex.unicodeSets)
            }
            return false
        }
        get lastIndex() {
            if (this.isValid) {
                return Cast.toNumber(this.regex.lastIndex)
            }
            return 0
        }
        set lastIndex(newLastIndex) {
            if (this.isValid) {
                this.regex.lastIndex = Cast.toNumber(newLastIndex)
            }
        }

        // depricated
        // compile(pattern, flags) {
        //     if (this.isValid) {
        //         this.regex.compile(pattern, flags)
        //     }
        // }
        exec(string) {
            // returns an array or null. need arrays ext
            // also this array aparently has additional properties.. i love js 
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
            if (this.isValid) {
                let baseArray = this.regex.exec(string)
                if (baseArray) {
                    let newObj = Object.create(null);
                    newObj.array = vm.jwArray.Type.toArray([...baseArray])
                    newObj.index = Cast.toNumber(baseArray.index)
                    newObj.input = Cast.toString(baseArray.input)
                    if (baseArray.groups) {
                        newObj.groups = vm.dogeiscutObject.Type.toObject(baseArray.groups)
                    }
                    if (baseArray.indices) {
                        newObj.indices = Object.create(null);
                        newObj.indices.array = vm.jwArray.Type.toArray([...baseArray.indices])
                        if (baseArray.indices.groups) {
                            newObj.indices.groups = vm.dogeiscutObject.Type.toObject(baseArray.indices.groups)
                        }
                    }
                    return vm.dogeiscutObject.Type.toObject(newObj)
                }
            }
            let newObj = Object.create(null);
            return vm.dogeiscutObject.Type.toObject(newObj)
        }
        test(string) {
            if (this.isValid) {
                return Cast.toBoolean(this.regex.test(string))
            }
            return false
        }

        // TODO: static properties/methods
    }

    const dogeiscutRegularExpression = {
        Type: RegularExpressionType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SCRAPPED,
            forceOutputType: "Regular Expression",
            disableMonitor: true
        },
        Argument: {
            shape: BlockShape.SCRAPPED,
            exemptFromNormalization: true,
            check: ["Regular Expression"],
        },
    }

    class Extension {
        constructor() {
            vm.dogeiscutRegularExpression = dogeiscutRegularExpression
            vm.runtime.registerSerializer(
                "dogeiscutRegularExpression", 
                v => ({ source: v.source, flags: v.flags, lastIndex: v.lastIndex }), 
                v => {
                    let regex = new dogeiscutRegularExpression.Type.toRegularExpression(new RegExp(v.source, v.flags))
                    regex.lastIndex = v.lastIndex
                    return lastIndex
                } 
            );
        }
        getInfo() {
            return {
                id: "dogeiscutRegularExpressions",
                name: "Regular Expressions",
                color1: "#913dff",
                menuIconURI: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+Cjxzdmcgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgdmlld0JveD0iMCAwIDIwIDIwIiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zOnNlcmlmPSJodHRwOi8vd3d3LnNlcmlmLmNvbS8iIHN0eWxlPSJmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZDsiPgogICAgPGNpcmNsZSBjeD0iMTAiIGN5PSIxMCIgcj0iOSIgc3R5bGU9ImZpbGw6cmdiKDE0NSw2MSwyNTUpO3N0cm9rZTpyZ2IoMTE2LDQ4LDIwNCk7c3Ryb2tlLXdpZHRoOjJweDsiLz4KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDEuMDI2NDg2LDAsMCwxLjAyNjQ4NiwtMTk2LjE3NjEzMSwtMTM0Ljc4MjIzNykiPgogICAgICAgIDxwYXRoIGQ9Ik0xOTUuOTc4LDE0Ni42NzdDMTk1LjI0NCwxNDUuOTIzIDE5NC42OTQsMTQ1LjA3OCAxOTQuMzI5LDE0NC4xNEMxOTMuOTY0LDE0My4yMDMgMTkzLjc4MSwxNDIuMTcxIDE5My43ODEsMTQxLjA0NkMxOTMuNzgxLDEzOS45MjEgMTkzLjk2NCwxMzguODkgMTk0LjMyOSwxMzcuOTUzQzE5NC42OTQsMTM3LjAxNSAxOTUuMjQ0LDEzNi4xNjkgMTk1Ljk3OCwxMzUuNDE2TDE5Ni45MTYsMTM2LjU3QzE5Ni4zODUsMTM3LjE3NSAxOTUuOTg3LDEzNy44NDkgMTk1LjcyMywxMzguNTkxQzE5NS40NiwxMzkuMzM0IDE5NS4zMjgsMTQwLjE1MiAxOTUuMzI4LDE0MS4wNDZDMTk1LjMyOCwxNDEuOTQxIDE5NS40NiwxNDIuNzYgMTk1LjcyMywxNDMuNTA0QzE5NS45ODcsMTQ0LjI0OSAxOTYuMzg1LDE0NC45MjMgMTk2LjkxNiwxNDUuNTI5TDE5NS45NzgsMTQ2LjY3N1oiIHN0eWxlPSJmaWxsOndoaXRlO2ZpbGwtcnVsZTpub256ZXJvOyIvPgogICAgICAgIDxyZWN0IHg9IjE5Ny40NzIiIHk9IjE0My4yMzgiIHdpZHRoPSIxLjYwNSIgaGVpZ2h0PSIxLjYwNSIgc3R5bGU9ImZpbGw6d2hpdGU7ZmlsbC1ydWxlOm5vbnplcm87Ii8+CiAgICAgICAgPHBhdGggZD0iTTIwMS43MiwxMzguMjYzTDIwMi43MTEsMTM3LjU0OEwyMDQuMDI5LDEzOS4zNTlMMjAzLjAzOSwxNDAuMDhMMjAxLjcyLDEzOC4yNjNaTTIwMC40MDIsMTM5LjM1OUwyMDEuNzIsMTM3LjU0OEwyMDIuNzExLDEzOC4yNjNMMjAxLjM5MiwxNDAuMDhMMjAwLjQwMiwxMzkuMzU5Wk0xOTkuODkyLDEzNy43OTRMMjAwLjI3MywxMzYuNjI4TDIwMi40MDYsMTM3LjMyNkwyMDIuMDI1LDEzOC40ODZMMTk5Ljg5MiwxMzcuNzk0Wk0yMDEuNjAzLDEzNS42NjJMMjAyLjgyOCwxMzUuNjYyTDIwMi44MjgsMTM3LjkwNkwyMDEuNjAzLDEzNy45MDZMMjAxLjYwMywxMzUuNjYyWk0yMDIuMDI1LDEzNy4zMjZMMjA0LjE1OCwxMzYuNjI4TDIwNC41MzksMTM3Ljc5NEwyMDIuNDA2LDEzOC40ODZMMjAyLjAyNSwxMzcuMzI2WiIgc3R5bGU9ImZpbGw6d2hpdGU7ZmlsbC1ydWxlOm5vbnplcm87Ii8+CiAgICAgICAgPHBhdGggZD0iTTIwNC43OTcsMTQ1LjUyOUMyMDUuMzI4LDE0NC45MjMgMjA1LjcyNSwxNDQuMjQ5IDIwNS45ODksMTQzLjUwNEMyMDYuMjUzLDE0Mi43NiAyMDYuMzg1LDE0MS45NDEgMjA2LjM4NSwxNDEuMDQ2QzIwNi4zODUsMTQwLjE1MiAyMDYuMjUzLDEzOS4zMzQgMjA1Ljk4OSwxMzguNTkxQzIwNS43MjUsMTM3Ljg0OSAyMDUuMzI4LDEzNy4xNzUgMjA0Ljc5NywxMzYuNTdMMjA1LjczNCwxMzUuNDE2QzIwNi40NjgsMTM2LjE2OSAyMDcuMDE4LDEzNy4wMTUgMjA3LjM4NCwxMzcuOTUzQzIwNy43NDksMTM4Ljg5IDIwNy45MzEsMTM5LjkyMSAyMDcuOTMxLDE0MS4wNDZDMjA3LjkzMSwxNDIuMTcxIDIwNy43NDksMTQzLjIwMyAyMDcuMzg0LDE0NC4xNEMyMDcuMDE4LDE0NS4wNzggMjA2LjQ2OCwxNDUuOTIzIDIwNS43MzQsMTQ2LjY3N0wyMDQuNzk3LDE0NS41MjlaIiBzdHlsZT0iZmlsbDp3aGl0ZTtmaWxsLXJ1bGU6bm9uemVybzsiLz4KICAgIDwvZz4KPC9zdmc+Cg==",
                blocks: [
                    {
                        opcode: 'regex',
                        text: 'regular expression [PATTERN]',
                        arguments: {
                            PATTERN: {
                                type: ArgumentType.STRING,
                                defaultValue: "(.*)"
                            }
                        },
                        ...dogeiscutRegularExpression.Block
                    },
                    {
                        opcode: 'regexFlags',
                        text: 'regular expression [PATTERN] with flags [FLAGS]',
                        arguments: {
                            PATTERN: {
                                type: ArgumentType.STRING,
                                defaultValue: "(.*)"
                            },
                            FLAGS: {
                                type: ArgumentType.STRING,
                                defaultValue: "gm"
                            }
                        },
                        ...dogeiscutRegularExpression.Block
                    },
                    '---',
                    {
                        opcode: 'test',
                        text: 'test [STRING] for [REGEX]',
                        blockType: BlockType.BOOLEAN,
                        disableMonitor: true,
                        arguments: {
                            STRING: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                            REGEX: dogeiscutRegularExpression.Argument
                        },
                    },
                    '---',
                    //...(vm.runtime.ext_dogeiscutObject ? ['---'] : []),
                    {
                        opcode: 'exec',
                        text: 'execute [REGEX] on [STRING]',
                        arguments: {
                            REGEX: dogeiscutRegularExpression.Argument,
                            STRING: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                        },
                        hideFromPalette: !vm.runtime.ext_dogeiscutObject,
                        ...(vm.runtime.ext_dogeiscutObject ? vm.dogeiscutObject.Block : {}),
                    },
                    {
                        opcode: 'getLastIndex',
                        text: 'get last index of [REGEX]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            REGEX: dogeiscutRegularExpression.Argument,
                        },
                    },
                    {
                        opcode: 'setLastIndex',
                        text: 'set last index of [REGEX] to [INDEX]',
                        arguments: {
                            REGEX: dogeiscutRegularExpression.Argument,
                            INDEX: {
                                type: ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                        },
                        hideFromPalette: true,
                        ...dogeiscutRegularExpression.Block
                    },
                    {
                        blockType: BlockType.XML,
                        xml: `<block type="dogeiscutRegularExpressions_setLastIndex" ><value name="INDEX"><shadow type="math_whole_number" ><field name="NUM">0</field></shadow></value></block>`
                    },
                    '---',
                    {
                        opcode: 'search',
                        text: 'search [STRING] with [REGEX]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            STRING: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                            REGEX: dogeiscutRegularExpression.Argument
                        },
                    },
                    {
                        opcode: 'split',
                        text: 'split [STRING] by [REGEX]',
                        arguments: {
                            STRING: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                            REGEX: dogeiscutRegularExpression.Argument,
                        },
                        hideFromPalette: !vm.runtime.ext_jwArray,
                        ...(vm.runtime.ext_jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'replace',
                        text: 'replace [REGEX] in [A] with [B]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            REGEX: dogeiscutRegularExpression.Argument,
                            A: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                            B: {
                                type: ArgumentType.STRING,
                                defaultValue: "bar"
                            },
                        },
                    },
                    {
                        opcode: 'replaceAll',
                        text: 'replace all [REGEX] in [A] with [B]',
                        blockType: BlockType.REPORTER,
                        disableMonitor: true,
                        arguments: {
                            REGEX: dogeiscutRegularExpression.Argument,
                            A: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                            B: {
                                type: ArgumentType.STRING,
                                defaultValue: "bar"
                            },
                        },
                    },
                    {
                        opcode: 'match',
                        text: 'match [REGEX] with [STRING]',
                        arguments: {
                            REGEX: dogeiscutRegularExpression.Argument,
                            STRING: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                        },
                        hideFromPalette: !vm.runtime.ext_jwArray,
                        ...(vm.runtime.ext_jwArray ? vm.jwArray.Block : {}),
                    },
                    {
                        opcode: 'matchAll',
                        text: 'match all [REGEX] with [STRING]',
                        arguments: {
                            REGEX: dogeiscutRegularExpression.Argument,
                            STRING: {
                                type: ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                        },
                        hideFromPalette: !vm.runtime.ext_jwArray,
                        ...(vm.runtime.ext_jwArray ? vm.jwArray.Block : {}),
                    },
                    //BLOCKS TODO:
                    // sort them better
                    // research more regex functions
                    // static methods/properties
                    // get source and get flags
                    // dependancy disclaimers
                    // toIndex mutability disclaimer
                ],
                menus: {}
            }
        }

        regex({ PATTERN }) {
            PATTERN = Cast.toString(PATTERN)
            return RegularExpressionType.toRegularExpression(new RegExp(PATTERN))
        }

        regexFlags({ PATTERN, FLAGS }) {
            PATTERN = Cast.toString(PATTERN)
            FLAGS = Cast.toString(FLAGS)
            return RegularExpressionType.toRegularExpression(new RegExp(PATTERN, FLAGS))
        }

        test({ STRING, REGEX }) {
            STRING = Cast.toString(STRING)
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            return REGEX.test(STRING)
        }

        exec({ STRING, REGEX }) {
            STRING = Cast.toString(STRING)
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            return REGEX.exec(STRING)
        }

        getLastIndex({ REGEX }) {
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            return REGEX.lastIndex
        }

        setLastIndex({ REGEX, INDEX }) {
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            INDEX = Cast.toNumber(INDEX)
            REGEX.lastIndex = INDEX
            return REGEX
        }

        search({ STRING, REGEX }) {
            STRING = Cast.toString(STRING)
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            return Cast.toNumber(STRING.search(REGEX.regex))
        }

        split({ REGEX, STRING }) {
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            STRING = Cast.toString(STRING)
            return vm.jwArray.Type.toArray(STRING.split(REGEX.regex))
        }

        replace({ REGEX, A, B }) {
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            A = Cast.toString(A)
            B = Cast.toString(B)
            return Cast.toString(A.replace(REGEX.regex, B))
        }

        replaceAll({ REGEX, A, B }) {
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            A = Cast.toString(A)
            B = Cast.toString(B)
            try {
                return Cast.toString(A.replaceAll(REGEX.regex, B))
            } catch {
                return vm.jwArray.Type.toArray([])
            }
        }

        match({ REGEX, STRING }) {
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            STRING = Cast.toString(STRING)
            return vm.jwArray.Type.toArray(STRING.match(REGEX.regex))
        }

        matchAll({ REGEX, STRING }) {
            REGEX = RegularExpressionType.toRegularExpression(REGEX)
            STRING = Cast.toString(STRING)
            try {
                return vm.jwArray.Type.toArray(STRING.matchAll(REGEX.regex))
            } catch {
                return vm.jwArray.Type.toArray([])
            }
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);