// Name: Regular Expressions
// ID: dogeiscutRegularExpressions
// Description: No description provided.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>

// TODO: buttons to enable objects and/or arrays support, which is saved in the project.

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

        expression = new RegExp()
        isValid = false

        constructor(expression = this.expression, isValid = false) {
            this.expression = expression
            this.isValid = isValid
        }

        static toRegularExpression(pattern, flags) {
            try {
                let expression = new RegExp(pattern, flags)
                return new RegularExpressionType(expression, true) 
            } catch (e) {
                //console.log(e)
                return new RegularExpressionType() 
            }
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
                return Cast.toBoolean(this.expression.dotAll)
            }
            return false
        }
        get flags() {
            if (this.isValid) {
                return Cast.toString(this.expression.flags)
            }
            return ""
        }
        get global() {
            if (this.isValid) {
                return Cast.toBoolean(this.expression.global)
            }
            return false
        }
        get hasIndices() {
            if (this.isValid) {
                return Cast.toBoolean(this.expression.hasIndices)
            }
            return false
        }
        get ignoreCase() {
            if (this.isValid) {
                return Cast.toBoolean(this.expression.ignoreCase)
            }
            return false
        }
        get multiline() {
            if (this.isValid) {
                return Cast.toBoolean(this.expression.multiline)
            }
            return false
        }
        get source() {
            if (this.isValid) {
                return Cast.toString(this.expression.source)
            }
            return ""
        }
        get unicode() {
            if (this.isValid) {
                return Cast.toBoolean(this.expression.unicode)
            }
            return false
        }
        get unicodeSets() {
            if (this.isValid) {
                return Cast.toBoolean(this.expression.unicodeSets)
            }
            return false
        }
        get lastIndex() {
            if (this.isValid) {
                return Cast.toNumber(this.expression.lastIndex)
            }
            return 0
        }

        // depricated
        // compile(pattern, flags) {
        //     if (this.isValid) {
        //         this.expression.compile(pattern, flags)
        //     }
        // }
        exec(string) {
            // returns an array or null. need arrays ext
            // also this array aparently has additional properties.. i love js 
            // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec
            if (this.isValid) {
                return this.expression.exec(string)
            }
            return 0
        }
        test(string) {
            if (this.isValid) {
                return Cast.toBoolean(this.expression.test(string))
            }
            return false
        }

        // TODO: figure out search, split, replace, and match since those are string prototype functions, not in regex
        // TODO: static properties/methods
    }

    const dogeiscutRegularExpression = {
        Type: RegularExpressionType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SQUARE,
            forceOutputType: "Regular Expression",
            disableMonitor: true
        },
        Argument: {
            shape: BlockShape.SQUARE,
            exemptFromNormalization: true,
            check: ["Regular Expression"],
        },
    }
    
    class Extension {
        getInfo() {
            return {
                id: "dogeiscutRegularExpressions",
                name: "Regular Expressions",
                color1: "#913dff",
                blocks: [
                    {
                        opcode: 'regex',
                        text: 'regular expression [PATTERN]',
                        arguments: {
                            PATTERN: {
                                type: ArgumentType.STRING,
                                defaultValue: ".*"
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
                                defaultValue: ".*"
                            },
                            FLAGS: {
                                type: ArgumentType.STRING,
                                defaultValue: "gm"
                            }
                        },
                        ...dogeiscutRegularExpression.Block
                    },
                ],
                menus: {}
            }
        }

        regex({ PATTERN }) {
            PATTERN = Cast.toString(PATTERN)
            return RegularExpressionType.toRegularExpression(PATTERN)
        }
        regexFlags({ PATTERN, FLAGS }) {
            PATTERN = Cast.toString(PATTERN)
            FLAGS = Cast.toString(FLAGS)
            return RegularExpressionType.toRegularExpression(PATTERN, FLAGS)
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);