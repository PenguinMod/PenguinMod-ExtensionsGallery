(function(Scratch) {
    'use strict';

    const BASE_URL = 'https://gen1x.derpygamer2142.com';
    let lastStatus = "No requests made yet";
    let storageMode = 'server';

    const stupiduri = "data:image/png;base64,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"
    const DB_NAME = 'storageplus_db';
    const STORE_NAME = 'kv_store';

    const getDB = () => {
        return new Promise((resolve, reject) => {
            const request = indexedDB.open(DB_NAME, 1);
            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };
            request.onsuccess = () => resolve(request.result);
            request.onerror = () => reject(request.error);
        });
    };

    class BettererStorage {
        getInfo() {
            return {
                id: 'g1nxBettererStorage',
                name: 'Storage+',
                color1: '#b19cd9',
                color2: '#967bb6',
                menuIconURI: stupiduri,
                blocks: [{
                        opcode: 'disclaimer',
                        blockType: Scratch.BlockType.BUTTON,
                        text: 'DISCLAIMER',
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Settings"
                    },
                    {
                        opcode: 'setMode',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set storage mode to [MODE]',
                        arguments: {
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'modes',
                                defaultValue: 'server'
                            }
                        }
                    },
                    {
                        opcode: 'getMode',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current storage mode',
                    },
                    "---",
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Basic Storage"
                    },
                    {
                        opcode: 'setVal',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [KEY] to [VAL] | locked? [LOCK]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'score'
                            },
                            VAL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '100'
                            },
                            LOCK: {
                                type: Scratch.ArgumentType.BOOLEAN
                            }
                        }
                    },
                    {
                        opcode: 'getVal',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get key [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'score'
                            }
                        }
                    },
                    {
                        opcode: 'getValAttr',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get attributes of key [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'score'
                            }
                        }
                    },
                    {
                        opcode: 'exists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'key [KEY] exists?',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'score'
                            }
                        }
                    },
                    "---",
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Debug"
                    },
                    {
                        opcode: 'getStatus',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'last status',
                    },
                    "---",
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Math"
                    },
                    {
                        opcode: 'increment',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change key [KEY] by [NUM]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'global_clicks'
                            },
                            NUM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    "---",
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "List Management"
                    },
                    {
                        opcode: 'appendList',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add [ITEM] to list [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'players'
                            },
                            ITEM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Scratcher123'
                            }
                        }
                    },
                    {
                        opcode: 'getList',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get list [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'players'
                            }
                        }
                    },
                    {
                        opcode: 'listContains',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'list [KEY] contains [ITEM]?',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'players'
                            },
                            ITEM: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Scratcher123'
                            }
                        }
                    },
                    {
                        opcode: 'lengthOfList',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'length of list [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'players'
                            }
                        }
                    },
                    {
                        opcode: 'getItemFromList',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'item [INDEX] of list [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'players'
                            },
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'deleteItemFromList',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete item [INDEX] from list [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'players'
                            },
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'clearList',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete all of list [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'players'
                            }
                        }
                    }
                ],
                menus: {
                    modes: {
                        acceptReporters: true,
                        items: [{
                                text: 'Server Storage',
                                value: 'server'
                            },
                            {
                                text: 'Local Storage',
                                value: 'local'
                            },
                            {
                                text: 'Indexed DB',
                                value: 'indexeddb'
                            }
                        ]
                    }
                }
            };
        }

        async disclaimer() {
            const disclaimerText = `This extension, no matter how fancy it may look, IS NOT entirely secure, unless you're very very very smart.
My API may go down at any time! (it's a personal server)

Also, my server will log any interactions you have with it, for security reasons. It's basically anarchy, so I need to have some control over it. I probably won't act unless you're actively exploiting the server.

Contact me on Discord at gen1x_loll or on the PenguinMod server if it goes down or you have any issues.`;

            if (ScratchBlocks.customPrompt) {
                const modal = await ScratchBlocks.customPrompt({
                        title: "Disclaimer!"
                    }, {
                        content: {
                            width: "500px"
                        }
                    },
                    [{
                        name: "OK",
                        role: "ok",
                        callback: () => console.log("Confirmed")
                    }]
                );

                const p = document.createElement("p");
                p.innerHTML = disclaimerText.replace(/\n/g, "<br>");
                modal.appendChild(p);
            } else {
                alert(disclaimerText);
            }
        }

        setMode({
            MODE
        }) {
            storageMode = MODE.toLowerCase();
            lastStatus = `Mode changed to ${storageMode}`;
        }

        getMode() {
            return storageMode;
        }

        getStatus() {
            return lastStatus;
        }

        async _getWrapper(key) {
            if (storageMode === 'local') {
                const raw = localStorage.getItem(`g1nx_${key}`);
                if (!raw) return null;
                try {
                    const parsed = JSON.parse(raw);
                    return (parsed && typeof parsed === 'object' && 'value' in parsed) ? parsed : {
                        value: parsed,
                        locked: false
                    };
                } catch {
                    return {
                        value: raw,
                        locked: false
                    };
                }
            }

            if (storageMode === 'indexeddb') {
                const db = await getDB();
                return new Promise(resolve => {
                    const req = db.transaction(STORE_NAME).objectStore(STORE_NAME).get(key);
                    req.onsuccess = () => {
                        const res = req.result;
                        if (res === undefined) return resolve(null);
                        resolve((res && typeof res === 'object' && 'value' in res) ? res : {
                            value: res,
                            locked: false
                        });
                    };
                    req.onerror = () => resolve(null);
                });
            }
            return null;
        }

        async _setRaw(key, val, lock = false) {
            if (storageMode === 'server') {
                try {
                    const res = await Scratch.fetch(`${BASE_URL}/storage/set`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            key,
                            value: val,
                            lock
                        })
                    });
                    const data = await res.json();
                    lastStatus = data.status || data.error || "Server Success";
                } catch {
                    lastStatus = "Server Error";
                }
                return;
            }

            const existing = await this._getWrapper(key);
            if (existing && existing.locked) {
                lastStatus = `Error: Key "${key}" is locked and cannot be modified.`;
                return;
            }

            const wrapper = {
                value: val,
                locked: lock
            };

            if (storageMode === 'local') {
                localStorage.setItem(`g1nx_${key}`, JSON.stringify(wrapper));
                lastStatus = lock ? "Local Success (Locked)" : "Local Success";
            } else if (storageMode === 'indexeddb') {
                const db = await getDB();
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).put(wrapper, key);
                lastStatus = lock ? "IDB Success (Locked)" : "IDB Success";
            }
        }

        async _getRaw(key) {
            if (storageMode === 'server') {
                try {
                    const res = await Scratch.fetch(`${BASE_URL}/storage/get/${key}`);
                    const data = await res.json();
                    return data.value;
                } catch {
                    return null;
                }
            }
            const wrapper = await this._getWrapper(key);
            return wrapper ? wrapper.value : null;
        }

        async setVal({
            KEY,
            VAL,
            LOCK
        }) {
            await this._setRaw(KEY, VAL, LOCK);
        }

        async getVal({
            KEY
        }) {
            const val = await this._getRaw(KEY);
            return val !== null ? val : "";
        }

        async getValAttr({
            KEY
        }) {
            if (storageMode === 'server') {
                try {
                    const res = await Scratch.fetch(`${BASE_URL}/storage/attrs/${KEY}`);
                    const data = await res.json();

                    if (!data.exists) {
                        return JSON.stringify({
                            exists: false,
                            value: "",
                            locked: false,
                            type: "undefined"
                        });
                    }

                    return JSON.stringify(data);
                } catch {
                    return JSON.stringify({
                        exists: false,
                        error: "Server Error"
                    });
                }
            }

            const wrapper = await this._getWrapper(KEY);

            if (!wrapper) {
                return JSON.stringify({
                    exists: false,
                    value: "",
                    locked: false,
                    type: "undefined"
                });
            }

            const val = wrapper.value;
            const type = Array.isArray(val) ? 'array' : typeof val;

            return JSON.stringify({
                exists: true,
                value: val,
                locked: !!wrapper.locked,
                type
            });
        }

        async exists({
            KEY
        }) {
            if (storageMode === 'server') {
                try {
                    const res = await Scratch.fetch(`${BASE_URL}/storage/exists/${KEY}`);
                    const data = await res.json();
                    return !!data.exists;
                } catch {
                    return false;
                }
            }
            const val = await this._getRaw(KEY);
            return val !== null;
        }

        async increment({
            KEY,
            NUM
        }) {
            const current = await this._getRaw(KEY);
            const newVal = (Number(current) || 0) + Number(NUM);
            await this._setRaw(KEY, newVal);
        }

        async appendList({
            KEY,
            ITEM
        }) {
            let list = await this._getRaw(KEY);
            if (!Array.isArray(list)) list = [];
            list.push(ITEM);
            await this._setRaw(KEY, list);
        }

        async getList({
            KEY
        }) {
            const list = await this._getRaw(KEY);
            return Array.isArray(list) ? JSON.stringify(list) : "[]";
        }

        async listContains({
            KEY,
            ITEM
        }) {
            const list = await this._getRaw(KEY);
            return Array.isArray(list) && list.includes(ITEM);
        }

        async lengthOfList({
            KEY
        }) {
            const list = await this._getRaw(KEY);
            return Array.isArray(list) ? list.length : 0;
        }

        async getItemFromList({
            KEY,
            INDEX
        }) {
            const list = await this._getRaw(KEY);
            if (Array.isArray(list)) {
                return list[INDEX - 1] ?? "";
            }
            return "";
        }

        async deleteItemFromList({
            KEY,
            INDEX
        }) {
            const list = await this._getRaw(KEY);
            if (Array.isArray(list)) {
                list.splice(INDEX - 1, 1);
                await this._setRaw(KEY, list);
            }
        }

        async clearList({
            KEY
        }) {
            await this._setRaw(KEY, []);
        }
    }

    Scratch.extensions.register(new BettererStorage());
})(Scratch);


