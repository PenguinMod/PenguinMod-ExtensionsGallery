(function (Scratch) {
    'use strict';

    const DB_NAME = 'IndexedCatDB';
    const STORE_NAME = 'texts';

    class IndexedCat {
        constructor() {
            this.db = null;
            this._openDB();
        }

        _openDB() {
            const request = indexedDB.open(DB_NAME, 1);

            request.onupgradeneeded = (event) => {
                const db = event.target.result;
                if (!db.objectStoreNames.contains(STORE_NAME)) {
                    db.createObjectStore(STORE_NAME);
                }
            };

            request.onsuccess = (event) => {
                this.db = event.target.result;
                console.log('[IndexedCat] Database ready');
            };

            request.onerror = (event) => {
                console.error('[IndexedCat] Database error:', event.target.error);
            };
        }

        getInfo() {
            return {
                id: 'indexedcat',
                name: 'IndexedCat',
                blocks: [
                    {
                        opcode: 'saveText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'store text [TEXT] under key [KEY]',
                        arguments: {
                            TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello, world!' },
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'greeting' },
                        },
                    },
                    {
                        opcode: 'loadText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'load text from key [KEY]',
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'greeting' },
                        },
                    },
                    {
                        opcode: 'deleteKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete key [KEY]',
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'greeting' },
                        },
                    },
                    {
                        opcode: 'clearAll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete all stored data',
                        arguments: {},
                    },
                    {
                        opcode: 'listKeys',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'list all keys',
                        arguments: {},
                    }
                ],
            };
        }

        _withStore(mode, callback) {
            return new Promise((resolve, reject) => {
                if (!this.db) {
                    return reject('Database not ready yet');
                }
                const tx = this.db.transaction([STORE_NAME], mode);
                const store = tx.objectStore(STORE_NAME);
                const request = callback(store);
                request.onsuccess = () => resolve(request.result);
                request.onerror = () => reject(request.error);
            });
        }

        saveText(args) {
            return this._withStore('readwrite', (store) =>
                store.put(args.TEXT, args.KEY)
            ).catch(console.error);
        }

        async loadText(args) {
            try {
                const value = await this._withStore('readonly', (store) =>
                    store.get(args.KEY)
                );
                return value || '';
            } catch (e) {
                console.error(e);
                return '';
            }
        }

        deleteKey(args) {
            return this._withStore('readwrite', (store) =>
                store.delete(args.KEY)
            ).catch(console.error);
        }

        clearAll() {
            return this._withStore('readwrite', (store) =>
                store.clear()
            ).catch(console.error);
        }

        async listKeys() {
            try {
                const keys = await this._withStore('readonly', (store) =>
                    store.getAllKeys()
                );
                return keys.join(', ');
            } catch (e) {
                console.error(e);
                return '';
            }
        }
    }

    Scratch.extensions.register(new IndexedCat());
})(Scratch);
