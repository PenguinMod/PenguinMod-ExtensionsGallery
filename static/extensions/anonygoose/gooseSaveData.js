(function (Scratch) {
    "use strict";

    const extensionID = "anonygoosesavedata";

    class MyExtension {
        getInfo() {
            if (!Scratch.extensions.unsandboxed) {
                throw new Error("This has to run unsandboxed")
            }

            return {
                id: "gooseSaveData",
                name: "Save Data",
                color1: "#3cadea",
                color2: "#0070d9",
                color3: "#0070d9",

                blocks: [
                    {
                        // save data to slot
                        // remember to create the slot if it doesn't exist
                        opcode: "saveToSlot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set data [KEY] to [VALUE] in slot [SLOT]",
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        // load data from slot
                        opcode: "loadFromSlot",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "load data [KEY] in slot [SLOT]",
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        // check if slot exists
                        opcode: "slotExists",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "slot [SLOT] exists?",
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        // check if data exists in slot
                        opcode: "dataExistsInSlot",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "data [KEY] exists in slot [SLOT]?",
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        // delete data in slot
                        // remember to NOT delete the slot if the slot becomes empty after deleting this data
                        opcode: "deleteDataInSlot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete data [KEY] in slot [SLOT]",
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        // delete all data in slot
                        opcode: "deleteSlot",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete slot [SLOT]",
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        // delete all save slots
                        opcode: "deleteAllSlots",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete all save slots"
                    },

                    "---",

                    {
                        // export single slot data to json
                        opcode: "exportSlotData",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "all save data in slot [SLOT]",
                        arguments: {
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        // import single slot data from json
                        opcode: "importSlotData",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "import data [JSON] to slot [SLOT]",
                        arguments: {
                            JSON: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            },
                            SLOT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        // export all data slots to json
                        opcode: "exportAllSlotsData",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "all save slot data"
                    },

                    {
                        // import all data slots from json
                        opcode: "importAllSlotsData",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "import all save slots [JSON]",
                        arguments: {
                            JSON: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ""
                            }
                        }
                    }
                ]
            };
        }

        // FUNCTIONS

        getProjectID() {
            let projectID = window.location.hash.slice(1);

            // if in editor, return default id
            if (projectID === "") {
                return "EDITOR";
            } else {
                return projectID;
            }
        }

        getSlotPrefix() {
            let storagePrefix = "GOOSE_SAVEDATA_EXT_";
            return `${storagePrefix}${this.getProjectID()}_SLOT_`;
        }

        getSlotKey(slot) {
            if (slot === "" || slot === null || slot === undefined) {
                return null;
            }

            let slotNumber = Math.floor(Number(slot));

            // make sure number is a number pluh
            if (!Number.isFinite(slotNumber)) {
                return null;
            }

            return `${this.getSlotPrefix()}${slotNumber}`;
        }

        readSlot(slotKey) {
            if (slotKey === null) {
                return null;
            }
            
            try {
                let data = JSON.parse(localStorage.getItem(slotKey));

                return data;
            } catch {
                return null;
            }
        }

        writeSlot(slotKey, data) {
            try {
                localStorage.setItem(slotKey, JSON.stringify(data));
            } catch {
                return;
            }
        }

        // BLOCKS

        saveToSlot(args) {
            // read data
            let slotKey = this.getSlotKey(args.SLOT);
            let data = this.readSlot(slotKey);

            // check if blank
            if (args.KEY === "" || args.SLOT === "" || slotKey === null) {
                return;
            }

            // make slot if there is no slot
            if (data === null) {
                data = {};
            }

            // save data
            data[args.KEY] = args.VALUE;
            this.writeSlot(slotKey, data);
        }

        loadFromSlot(args) {
            // read data
            let slotKey = this.getSlotKey(args.SLOT);
            let data = this.readSlot(slotKey);

            // check if blank
            if (args.KEY === "" || args.SLOT === "" || slotKey === null || data === null) {
                return "";
            }

            if (data[args.KEY] === undefined) {
                return "";
            } else {
                return data[args.KEY];
            }
        }

        slotExists(args) {
            let slotKey = this.getSlotKey(args.SLOT);

            if (slotKey === null) {
                return false;
            }


            return localStorage.getItem(slotKey) !== null;
        }

        dataExistsInSlot(args) {
            let slotKey = this.getSlotKey(args.SLOT);
            let data = this.readSlot(slotKey);

            if (args.KEY === "" || args.SLOT === "" || slotKey === null || data === null) {
                return false;
            }

            return Object.prototype.hasOwnProperty.call(data, args.KEY);
        }

        deleteDataInSlot(args) {
            let slotKey = this.getSlotKey(args.SLOT);
            let data = this.readSlot(slotKey);

            if (args.KEY === "" || args.SLOT === "" || slotKey === null || data === null) {
                return;
            }

            delete data[args.KEY];

            this.writeSlot(slotKey, data);
        }

        deleteSlot(args) {
            let slotKey = this.getSlotKey(args.SLOT);

            if (slotKey === null) {
                return;
            }

            localStorage.removeItem(slotKey);
        }

        deleteAllSlots() {
            let prefix = this.getSlotPrefix();

            // loop through all save slots and see if it matches
            let i = localStorage.length - 1;
            while (i >= 0) {
                let key = localStorage.key(i);

                if (key !== null && key.startsWith(prefix)) {
                    localStorage.removeItem(key);
                }

                i -= 1;
            }
        }

        exportSlotData(args) {
            let slotKey = this.getSlotKey(args.SLOT);
            let data = this.readSlot(slotKey);

            if (slotKey === null || data === null) {
                return "{}";
            }

            return JSON.stringify(data);
        }

        importSlotData(args) {
            let slotKey = this.getSlotKey(args.SLOT);

            if (slotKey === null) {
                return;
            }

            try {
                let data = JSON.parse(args.JSON);

                if (data !== null && typeof data === "object" && !Array.isArray(data)) {
                    this.writeSlot(slotKey, data)
                }
            } catch {
                return;
            }
        }

        exportAllSlotsData() {
            let prefix = this.getSlotPrefix();
            let allData = {};

            // loop through all slots to make sure it has the right prefix
            let i = 0;
            while (i < localStorage.length) {
                let key = localStorage.key(i);

                if (key !== null && key.startsWith(prefix)) {
                    let slotNumber = key.slice(prefix.length);

                    allData[`slot${slotNumber}`] = this.readSlot(key);
                }
                i += 1;
            }

            return JSON.stringify(allData);
        }

        // IMPORT ALL SLOTS DATA
        importAllSlotsData(args) {
            try {
                let allData = JSON.parse(args.JSON);

                if (allData === null || typeof allData !== "object" || Array.isArray(allData)) {
                    return;
                }

                let slotNames = Object.keys(allData);
                let i = 0;

                // loop through all slots to make sure they have the right prefix
                while (i < slotNames.length) {
                    let slotName = slotNames[i];
                    let match = /^slot([1-9]\d*)$/.exec(slotName);
                    let slotKey = this.getSlotKey(match[1])
                
                    if (match && allData[slotName] !== null && typeof allData[slotName] === "object") {
                        this.writeSlot(slotKey, allData[slotName])
                    }

                    i += 1;
                }
            
            } catch {
                return;
            }
        }
    }
Scratch.extensions.register(new MyExtension());})(Scratch);
