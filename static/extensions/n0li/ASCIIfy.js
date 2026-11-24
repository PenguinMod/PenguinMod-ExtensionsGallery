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
                id: "n0li_asciify",
                name: "ASCIIfy",
                color1: "#5265C9",
                color2: "#4052AC",
                blocks: [
                    {
                        opcode: "characterToID",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "character [CHARACTER] to Unicode ID at index [INDEX]",
                        arguments: {
                            CHARACTER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "a"
                            },
                            INDEX: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "indexMenu",
                                defaultValue: "first"
                            }
                        }
                    },
                    {
                        opcode: "idToCharacter",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Unicode ID [ID] to character at index [INDEX]",
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "97"
                            },
                            INDEX: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "indexMenu",
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
                    indexMenu: {
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
            const index = String(args.INDEX).toLowerCase();

            switch (index) {
                case "first":
                    return codepoints[0];
                case "last":
                    return codepoints[codepoints.length - 1];
                case "all":
                    return codepoints.join("-");
                default: {
                    const position = Math.floor(Number(index)) - 1;
                    if (!Number.isFinite(position) || position < 0 || position >= codepoints.length) {
                        return "";
                    }
                    return codepoints[position];
                }
            }
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

            const index = String(args.INDEX).toLowerCase();

            switch (index) {
                case "first":
                    return String.fromCodePoint(codepoints[0]);
                case "last":
                    return String.fromCodePoint(codepoints[codepoints.length - 1]);
                case "all":
                    return codepoints.map(id => String.fromCodePoint(id)).join("");
                default: {
                    const position = Math.floor(Number(index)) - 1;
                    if (!Number.isFinite(position) || position < 0 || position >= codepoints.length) {
                        return "";
                    }
                    return String.fromCodePoint(codepoints[position]);
                }
            }
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
