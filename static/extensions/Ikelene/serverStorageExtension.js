(function (Scratch) {
    'use strict';

    class ServerStorage {
        constructor() {
            this.serverUrl = 'https://ikelene.dev/storage/';
            this.apiKey = '';
            this.maxDataSize = 262144;

            this.editMode = 'live'; /** @type {'live' | 'local'} */
            this.localCache = new Map();
            this.dirtyKeys = new Set();
        }

        serialize() {
            return {
                serverUrl: this.serverUrl,
                apiKey: this.apiKey,
                editMode: this.editMode
            };
        }

        deserialize(data) {
            if (!data || typeof data !== 'object') return;

            if (typeof data.serverUrl === 'string' && data.serverUrl.trim().length) {
                const trimmed = data.serverUrl.trim();
                this.serverUrl = trimmed.endsWith('/') ? trimmed : trimmed + '/';
            }

            if (typeof data.apiKey === 'string') {
                this.apiKey = data.apiKey;
            }

            if (data.editMode === 'local' || data.editMode === 'live') {
                this.editMode = data.editMode;
            }
        }

        getInfo() {
            return {
                id: 'ikeleneServerStorage',
                name: 'Server Storage',
                color1: '#ff9bfd',
                color2: '#ff9bfd',
                color3: '#ff9bfd',
                docsURI: this.serverUrl + 'docs.html',
                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'press "Open Docs" to get API key'
                    },
                    {
                        opcode: 'setServerUrl',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set server to [SERVER] server',
                        arguments: {
                            SERVER: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'serverMenu',
                                defaultValue: 'global'
                            }
                        }
                    },
                    {
                        opcode: 'setApiKey',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set API key to [APIKEY]',
                        arguments: {
                            APIKEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'paste-your-api-key-here'
                            }
                        }
                    },
                    {
                        opcode: 'getAllKeys',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get all stored keys'
                    },
                    {
                        opcode: 'saveToServer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'save [VALUE] to server as [KEY]',
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'value'
                            },
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'key'
                            }
                        }
                    },
                    {
                        opcode: 'getFromServer',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get [KEY] from server',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'key'
                            }
                        }
                    },
                    {
                        opcode: 'serverDataExists',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'server has [KEY]',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'key'
                            }
                        }
                    },
                    {
                        opcode: 'deleteFromServer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete [KEY] from server',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'key'
                            }
                        }
                    },
                    {
                        opcode: 'isServerWorking',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is server working?'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Local Caching (Faster, but not live)'
                    },
                    {
                        opcode: 'currentEditMode',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current editing mode'
                    },
                    {
                        opcode: 'setEditMode',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'switch to [MODE] editing',
                        arguments: {
                            MODE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'editModeMenu',
                                defaultValue: 'live'
                            }
                        }
                    },
                    {
                        opcode: 'downloadCache',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'download all keys to local cache'
                    },
                    {
                        opcode: 'pushCache',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'push local changes to server'
                    }
                ],
                menus: {
                    serverMenu: {
                        acceptReporters: true,
                        items: ['global']
                    },
                    editModeMenu: {
                        acceptReporters: false,
                        items: ['live', 'local']
                    }
                }
            };
        }

        setServerUrl(args) {
            const server = args.SERVER;
            if (server === 'global') {
                this.serverUrl = 'https://ikelene.dev/storage/';
            } else {
                const trimmed = server.trim();
                if (!trimmed.length) return;
                this.serverUrl = trimmed.endsWith('/') ? trimmed : trimmed + '/';
            }
        }

        setApiKey(args) {
            this.apiKey = args.APIKEY.trim();
        }

        hasValidKey() {
            if (!this.apiKey || this.apiKey.length === 0) {
                throw new Error('Missing API key');
            }
            return true;
        }

        currentEditMode() {
            return this.editMode;
        }

        setEditMode(args) {
            const mode = args.MODE === 'local' ? 'local' : 'live';
            this.editMode = mode;
        }

        async getAllKeys() {
            this.hasValidKey();
            try {
                const res = await fetch(this.serverUrl + 'listKeys.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ apiKey: this.apiKey })
                });
                if (!res.ok) return '[]';
                const result = await res.json();
                if (!result.success || !Array.isArray(result.keys)) return '[]';
                return JSON.stringify(result.keys);
            } catch (_) {
                return '[]';
            }
        }

        async downloadCache() {
            this.hasValidKey();
            try {
                const res = await fetch(this.serverUrl + 'getAll.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({ apiKey: this.apiKey })
                });
                if (!res.ok) return;
                const result = await res.json();
                if (!result.success || !Array.isArray(result.items)) return;

                this.localCache = new Map();
                this.dirtyKeys = new Set();

                for (const item of result.items) {
                    this.localCache.set(item.key, item.value);
                }
            } catch (_) {}
        }

        async pushCache() {
            this.hasValidKey();
            if (this.dirtyKeys.size === 0) return;

            for (const key of this.dirtyKeys) {
                const value = this.localCache.get(key);
                if (typeof value === 'undefined') continue;

                const payload = {
                    apiKey: this.apiKey,
                    key: key,
                    value: value,
                    mimeType: 'application/json'
                };

                try {
                    const res = await fetch(this.serverUrl + 'store.php', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(payload)
                    });
                    if (res.status === 401) {
                        throw new Error('Unauthorized: missing or invalid API key');
                    }
                } catch (_) {
                    throw new Error('Server request failed');
                }
            }

            this.dirtyKeys = new Set();
        }

        async saveToServer(args) {
            this.hasValidKey();

            const value = args.VALUE;
            const key = args.KEY;
            const size = new TextEncoder().encode(value).length;

            if (size > this.maxDataSize) {
                throw new Error('Data too large');
            }

            if (this.editMode === 'local') {
                this.localCache.set(key, value);
                this.dirtyKeys.add(key);
                return;
            }

            const payload = {
                apiKey: this.apiKey,
                key: key,
                value: value,
                mimeType: 'application/json'
            };

            try {
                const response = await fetch(this.serverUrl + 'store.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify(payload)
                });

                if (response.status === 401) {
                    throw new Error('Unauthorized: missing or invalid API key');
                }

                const result = await response.json();
                if (!result.success) {
                    throw new Error('Server rejected request');
                }
            } catch (_) {
                throw new Error('Server request failed');
            }
        }

        async getFromServer(args) {
            this.hasValidKey();

            const key = args.KEY;

            if (this.editMode === 'local') {
                if (this.localCache.has(key)) {
                    return this.localCache.get(key);
                }
                return '';
            }

            try {
                const response = await fetch(this.serverUrl + 'get.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        apiKey: this.apiKey,
                        key: key
                    })
                });

                if (response.status === 401) {
                    throw new Error('Unauthorized: missing or invalid API key');
                }

                const result = await response.json();
                if (result.success && result.data) {
                    return result.data.value || '';
                }
                return '';
            } catch (_) {
                throw new Error('Server request failed');
            }
        }

        async serverDataExists(args) {
            this.hasValidKey();

            const key = args.KEY;

            if (this.editMode === 'local') {
                return this.localCache.has(key);
            }

            try {
                const response = await fetch(this.serverUrl + 'get.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        apiKey: this.apiKey,
                        key: key
                    })
                });

                if (response.status === 401) {
                    throw new Error('Unauthorized: missing or invalid API key');
                }

                const result = await response.json();
                return result.success && !!result.data;
            } catch (_) {
                throw new Error('Server request failed');
            }
        }

        async deleteFromServer(args) {
            this.hasValidKey();

            const key = args.KEY;

            if (this.editMode === 'local') {
                this.localCache.delete(key);
                this.dirtyKeys.add(key);
                return;
            }

            try {
                const response = await fetch(this.serverUrl + 'delete.php', {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    },
                    body: JSON.stringify({
                        apiKey: this.apiKey,
                        key: key
                    })
                });

                if (response.status === 401) {
                    throw new Error('Unauthorized: missing or invalid API key');
                }

                const result = await response.json();
                if (!result.success) {
                    throw new Error('Server rejected request');
                }
            } catch (_) {
                throw new Error('Server request failed');
            }
        }

        async isServerWorking() {
            try {
                const response = await fetch(this.serverUrl + 'ping.php', {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (!response.ok) {
                    return false;
                }

                const result = await response.json();
                return result.success === true && result.status === 'ok';
            } catch (_) {
                return false;
            }
        }
    }

    Scratch.extensions.register(new ServerStorage());
})(Scratch);
