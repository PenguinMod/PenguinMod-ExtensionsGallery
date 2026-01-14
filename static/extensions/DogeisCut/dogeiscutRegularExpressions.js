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

    
    class RegularExpressionType {
        customId = "dogeiscutRegularExpression"

        expression = new RegExp()
        isValid = false

        constructor(expression = this.expression, isValid = false) {
            this.expression = expression
            this.isValid = isValid
        }

        static toRegularExpression(x) {
            try {
                let exp = new RegExp(x)
                return new RegularExpressionType(exp, true) 
            } catch {
                return new RegularExpressionType() 
            }
        }

        static forRegularExpression(x) {
        }

        static display(x) {
        }

        jwArrayHandler() {
            return ``
        }

        toString() {
            return ``
        }
        toJSON() {
            return ``
        }

        toMonitorContent = () => span(this.toString())

        toReporterContent() {
            let root = document.createElement('div')

            return root
        }

        // makes things easy for me
        get dotAll() {
            if (this.isValid) {
                return Cast.toBoolean(this.expression.dotAll)
            }
            return ""
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
            return ""
        }
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
                color1: "#cb3dff",
                blocks: [
                    {
                        opcode: 'regex',
                        text: 'regular expression [EXPRESSION]',
                        arguments: {
                            EXPRESSION: {
                                type: ArgumentType.STRING,
                                defaultValue: ".?*"
                            }
                        },
                        ...dogeiscutRegularExpression.Block
                    },
                    {
                        opcode: 'regexFlags',
                        text: 'regular expression [EXPRESSION] with flags [FLAGS]',
                        arguments: {
                            EXPRESSION: {
                                type: ArgumentType.STRING,
                                defaultValue: ".?*"
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
    }

    Scratch.extensions.register(new Extension());
})(Scratch);