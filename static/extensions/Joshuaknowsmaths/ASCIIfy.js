/**!
 * @file ASCIIfy
 * @author Joshuaknowsmaths
 * @link https://github.com/PenguinModding/PenguinModding.github.io/blob/main/hosted-extensions/ascii.js
 * @copyright Licensed under LGPL-3.0
 */
(function (Scratch) {
    "use strict";

    class ASCIIfy {
        getInfo() {
            return {
                id: "asciify",
                name: "ASCIIfy",
                color1: "#5265C9",
                color2: "#4052AC",
                blocks: [
                    {
                        opcode: "characterToID",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "character [CHARACTER] to Unicode ID with codepoint [CODEPOINT]",
                        arguments: {
                            CHARACTER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "a"
                            },
                            CODEPOINT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "codepointMenu",
                                defaultValue: "first"
                            }
                        }
                    },
                    {
                        opcode: "idToCharacter",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Unicode ID [ID] to character with codepoint [CODEPOINT]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "97"
                            },
                            CODEPOINT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "codepointMenu",
                                defaultValue: "all"
                            }
                        }
                    },
                    {
                        opcode: "characterAt",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "character [INDEX] of [TEXT]",
                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello"
                            }
                        }
                    },
                    {
                        opcode: "unicodeLength",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Unicode length of [TEXT]",
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello"
                            }
                        }
                    },
                    {
                        opcode: "asciiCheck",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is [ID] a valid ASCII ID?",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 97
                            }
                        }
                    }
                ],
                menus: {
                    codepointMenu: {
                        acceptReporters: true,
                        items: ["first", "last", "all"]
                    }
                }
            };
        }

        characterToID(args) {
            const characters = Array.from(String(args.CHARACTER));
            if (!characters.length) return "";

            const codepoints = characters.map(character => character.codePointAt(0));
            const choice = String(args.CODEPOINT).toLowerCase();

            if (choice === "first") return codepoints[0];
            if (choice === "last") return codepoints[codepoints.length - 1];
            if (choice === "all") return codepoints.join("-");

            const index = Math.floor(Number(args.CODEPOINT)) - 1;
            if (!Number.isFinite(index) || index < 0 || index >= codepoints.length) {
                return "";
            }

            return codepoints[index];
        }

        idToCharacter(args) {
            const values = String(args.ID).split("-").map(value => value.trim());
            if (!values.length || values.some(value => value === "")) return "";

            const codepoints = values.map(Number);
            const isValid = codepoints.every(id =>
                Number.isInteger(id) &&
                id >= 0 &&
                id <= 0x10FFFF &&
                !(id >= 0xD800 && id <= 0xDFFF)
            );

            if (!isValid) return "";

            const choice = String(args.CODEPOINT).toLowerCase();
            let selected;

            if (choice === "first") {
                selected = [codepoints[0]];
            } else if (choice === "last") {
                selected = [codepoints[codepoints.length - 1]];
            } else if (choice === "all") {
                selected = codepoints;
            } else {
                const index = Math.floor(Number(args.CODEPOINT)) - 1;
                if (!Number.isFinite(index) || index < 0 || index >= codepoints.length) {
                    return "";
                }
                selected = [codepoints[index]];
            }

            return selected.map(id => String.fromCodePoint(id)).join("");
        }

        characterAt(args) {
            const characters = Array.from(String(args.TEXT));
            const index = Math.floor(Number(args.INDEX)) - 1;

            return index >= 0 && index < characters.length ? characters[index] : "";
        }

        unicodeLength(args) {
            return Array.from(String(args.TEXT)).length;
        }

        asciiCheck(args) {
            const id = Number(args.ID);
            return Number.isInteger(id) && id >= 0 && id <= 127;
        }
    }

    Scratch.extensions.register(new ASCIIfy());
})(Scratch);
