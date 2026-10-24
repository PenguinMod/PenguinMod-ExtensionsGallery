
(function (Scratch) {
    "use strict";

    // PenguinJS logo — SVG URL embedded in the script
    const PENGUINJS_ICON_URL =
        "https://www.svgrepo.com/show/303206/javascript-logo.svg";

    class PenguinJS {
        constructor() {
            this.variables = Object.create(null);
            this.output = "";
            this.error = "";
            this.consoleLines = [];
        }

        getInfo() {
            return {
                id: "penguinjs",
                name: "PenguinJS",
                iconURL: PENGUINJS_ICON_URL,
                menuIconURI: PENGUINJS_ICON_URL,
                color1: "#F7DF1E",
                color2: "#D6B900",
                color3: "#A88E00",

                blocks: [
                    {
                        opcode: "runJS",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "run JavaScript [CODE]",
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'console.log("Hello PenguinJS!");'
                            }
                        }
                    },
                    {
                        opcode: "evaluateJS",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "JavaScript expression [CODE]",
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "1 + 2"
                            }
                        }
                    },
                    {
                        opcode: "setVariable",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set JS variable [NAME] to [VALUE]",
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "score"
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "100"
                            }
                        }
                    },
                    {
                        opcode: "getVariable",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "JS variable [NAME]",
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "score"
                            }
                        }
                    },
                    {
                        opcode: "lastOutput",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "last JavaScript output"
                    },
                    {
                        opcode: "lastError",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "last JavaScript error"
                    },
                    {
                        opcode: "getConsole",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "PenguinJS console"
                    },
                    {
                        opcode: "clearConsole",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "clear PenguinJS console"
                    },
                    {
                        opcode: "reset",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "reset PenguinJS"
                    }
                ]
            };
        }

        runJS(args) {
            this.error = "";
            this.output = "";

            const log = (...values) => {
                const line = values.map(value => {
                    if (typeof value === "string") return value;
                    try {
                        const json = JSON.stringify(value);
                        return json === undefined ? String(value) : json;
                    } catch {
                        return String(value);
                    }
                }).join(" ");

                this.output = line;
                this.consoleLines.push(line);
            };

            try {
                const execute = new Function(
                    "console",
                    "vars",
                    "Scratch",
                    '"use strict";\n' + String(args.CODE)
                );

                execute(
                    { log, info: log, warn: log, error: log },
                    this.variables,
                    Scratch
                );
            } catch (error) {
                this.error = String(error?.stack || error);
                this.output = this.error;
                this.consoleLines.push("ERROR: " + this.error);
            }
        }

        evaluateJS(args) {
            this.error = "";

            try {
                const evaluate = new Function(
                    "vars",
                    "Scratch",
                    '"use strict"; return (' + String(args.CODE) + ");"
                );

                const result = evaluate(this.variables, Scratch);
                this.output = result == null ? "" : String(result);
                return this.output;
            } catch (error) {
                this.error = String(error?.message || error);
                this.output = this.error;
                this.consoleLines.push("ERROR: " + this.error);
                return "";
            }
        }

        setVariable(args) {
            this.variables[String(args.NAME)] = String(args.VALUE);
        }

        getVariable(args) {
            return this.variables[String(args.NAME)] ?? "";
        }

        lastOutput() {
            return this.output;
        }

        lastError() {
            return this.error;
        }

        getConsole() {
            return this.consoleLines.join("\n");
        }

        clearConsole() {
            this.consoleLines = [];
            this.output = "";
            this.error = "";
        }

        reset() {
            this.variables = Object.create(null);
            this.clearConsole();
        }
    }

    Scratch.extensions.register(new PenguinJS());
})(Scratch);
