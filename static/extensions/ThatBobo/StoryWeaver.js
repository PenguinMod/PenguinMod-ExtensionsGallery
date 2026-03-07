/*
   Story Weaver 2.0 — ExtForge-style Story Engine
*/
(async function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!");
        return;
    }

    const ExtForge = {
        Variables: new function () {
            this.raw_ = {};
            this.set = (name, value) => this.raw_[name] = value;
            this.get = (name) => this.raw_[name] ?? null;
        }
    };

    class Extension {
        getInfo() {
            return {
                id: "storyw",
                name: "Story Weaver",
                color1: "#00ffff",
                blocks: [

                    // ===== STORY SETUP =====
                    { blockType: "label", text: "Story Setup" },

                    {
                        opcode: "startNewStory",
                        text: "Start new story of genre [GENRE]",
                        blockType: "command",
                        arguments: {
                            GENRE: { type: "string", menu: "genres" }
                        }
                    },
                    {
                        opcode: "setStoryTitle",
                        text: "Set story title to [TITLE]",
                        blockType: "command",
                        arguments: {
                            TITLE: { type: "string" }
                        }
                    },
                    {
                        opcode: "addChapter",
                        text: "Add chapter [CHAPTER]",
                        blockType: "command",
                        arguments: {
                            CHAPTER: { type: "string" }
                        }
                    },
                    {
                        opcode: "setNarrator",
                        text: "Set narrator to [NARRATOR]",
                        blockType: "command",
                        arguments: {
                            NARRATOR: { type: "string", defaultValue: "Narrator" }
                        }
                    },
                    {
                        opcode: "endStory",
                        text: "End story",
                        blockType: "command",
                        arguments: {}
                    },

                    // ===== WRITING & DIALOGUE =====
                    { blockType: "label", text: "Writing & Dialogue" },

                    {
                        opcode: "writeLine",
                        text: "Write line [TEXT]",
                        blockType: "command",
                        arguments: {
                            TEXT: { type: "string" }
                        }
                    },
                    {
                        opcode: "writeLineAs",
                        text: "Write line [TEXT] as [CHARACTER]",
                        blockType: "command",
                        arguments: {
                            TEXT: { type: "string" },
                            CHARACTER: { type: "string", defaultValue: "Character" }
                        }
                    },
                    {
                        opcode: "writeLineAsEmotion",
                        text: "Write line [TEXT] as [CHARACTER] with emotion [EMOTION]",
                        blockType: "command",
                        arguments: {
                            TEXT: { type: "string" },
                            CHARACTER: { type: "string", defaultValue: "Character" },
                            EMOTION: { type: "string", menu: "emotions" }
                        }
                    },
                    {
                        opcode: "insertLine",
                        text: "Insert line [TEXT] at position [INDEX]",
                        blockType: "command",
                        arguments: {
                            TEXT: { type: "string" },
                            INDEX: { type: "number" }
                        }
                    },
                    {
                        opcode: "removeContaining",
                        text: "Remove lines containing [TEXT]",
                        blockType: "command",
                        arguments: {
                            TEXT: { type: "string" }
                        }
                    },
                    {
                        opcode: "removeByCharacter",
                        text: "Remove lines where character = [CHARACTER]",
                        blockType: "command",
                        arguments: {
                            CHARACTER: { type: "string" }
                        }
                    },

                    // ===== STORY DATA =====
                    { blockType: "label", text: "Story Data" },

                    {
                        opcode: "showStories",
                        text: "Show Stories",
                        blockType: "reporter",
                        arguments: {}
                    },
                    {
                        opcode: "showFullStory",
                        text: "Show Full Story",
                        blockType: "reporter",
                        arguments: {}
                    },
                    {
                        opcode: "getStoryTitle",
                        text: "Get story title",
                        blockType: "reporter",
                        arguments: {}
                    },
                    {
                        opcode: "getStoryGenre",
                        text: "Get story genre",
                        blockType: "reporter",
                        arguments: {}
                    }
                ],

                menus: {
                    genres: {
                        items: ["fantasy", "sci-fi", "mystery", "romance", "horror", "slice-of-life"]
                    },
                    emotions: {
                        items: ["happy", "sad", "angry", "scared", "excited", "neutral"]
                    }
                }
            };
        }

        // --- Helpers ---
        _getStory() {
            return ExtForge.Variables.get("Storys") || [];
        }
        _setStory(story) {
            ExtForge.Variables.set("Storys", story);
        }

        // --- STORY SETUP ---

        async startNewStory(args) {
            this._setStory([]);
            ExtForge.Variables.set("Story Genre", args.GENRE || "");
            ExtForge.Variables.set("Story Title", "");
            ExtForge.Variables.set("Narrator", "Narrator");

            // Add placeholder title to Story Titles list
            const titles = ExtForge.Variables.get("Story Titles") || [];
            titles.push("Untitled Story");
            ExtForge.Variables.set("Story Titles", titles);
        }

        async setStoryTitle(args) {
            const title = args.TITLE || "";
            ExtForge.Variables.set("Story Title", title);

            // Update last story title in the list
            const titles = ExtForge.Variables.get("Story Titles") || [];
            if (titles.length > 0) {
                titles[titles.length - 1] = title;
                ExtForge.Variables.set("Story Titles", titles);
            }
        }

        async addChapter(args) {
            const story = this._getStory();
            const chapterName = args.CHAPTER || "Chapter";
            story.push("");
            story.push("== " + chapterName + " ==");
            story.push("");
            this._setStory(story);
        }

        async setNarrator(args) {
            ExtForge.Variables.set("Narrator", args.NARRATOR || "Narrator");
        }

        async endStory(args) {
            // Reserved for future finalization logic
        }

        // --- WRITING & DIALOGUE ---

        async writeLine(args) {
            const story = this._getStory();
            const narrator = ExtForge.Variables.get("Narrator") || "Narrator";
            story.push(`${narrator}: ${args.TEXT || ""}`);
            this._setStory(story);
        }

        async writeLineAs(args) {
            const story = this._getStory();
            story.push(`${args.CHARACTER || "Character"}: ${args.TEXT || ""}`);
            this._setStory(story);
        }

        async writeLineAsEmotion(args) {
            const story = this._getStory();
            story.push(`${args.CHARACTER || "Character"} (${args.EMOTION || "neutral"}): ${args.TEXT || ""}`);
            this._setStory(story);
        }

        async insertLine(args) {
            const story = this._getStory();
            let index = Number(args.INDEX) || 1;
            index = Math.max(1, Math.min(story.length + 1, index));
            story.splice(index - 1, 0, args.TEXT || "");
            this._setStory(story);
        }

        async removeContaining(args) {
            const story = this._getStory();
            const filtered = story.filter(line => !line.includes(args.TEXT || ""));
            this._setStory(filtered);
        }

        async removeByCharacter(args) {
            const story = this._getStory();
            const character = args.CHARACTER || "";
            const filtered = story.filter(line => {
                return !(line.startsWith(character + ":") || line.startsWith(character + " ("));
            });
            this._setStory(filtered);
        }

        // --- STORY DATA ---

        showStories() {
            // Return ONLY story titles
            return ExtForge.Variables.get("Story Titles") || [];
        }

        showFullStory() {
            const title = ExtForge.Variables.get("Story Title") || "";
            const genre = ExtForge.Variables.get("Story Genre") || "";
            const story = this._getStory();

            let out = "";
            if (title) out += title + "\n";
            if (genre) out += "(" + genre + ")\n";
            if (title || genre) out += "\n";
            out += story.join("\n");
            return out;
        }

        getStoryTitle() {
            return ExtForge.Variables.get("Story Title") || "";
        }

        getStoryGenre() {
            return ExtForge.Variables.get("Story Genre") || "";
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
