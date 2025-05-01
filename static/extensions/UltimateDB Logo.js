(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) throw new Error("UltimateDB must be used without sandbox.");

    const menuIconURI = "data:image/octet-stream;base64,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"

    // Special thanks to Logise

    class UltimateDB {
        constructor() {
            this.somrotiAPI = "https://bdd.somroti-yt.workers.dev";
            this.firebaseAPI = "https://guessthepin-2fe64-default-rtdb.europe-west1.firebasedatabase.app";
        }

        getInfo() {
            return {
                id: "UltimateDB",
                name: "Ultimate DB",
                color1: "#7b3ff2",
                menuIconURI: menuIconURI,
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "SomrotiDB" },
                    {
                        opcode: "getSomrotiKey",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "get [KEY] from SomrotiDB",
                        arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" } }
                    },
                    {
                        opcode: "setSomrotiKey",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set [KEY] to [VALUE] in SomrotiDB",
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "value" }
                        }
                    },
                    {
                        opcode: "deleteSomrotiKey",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete [KEY] in SomrotiDB",
                        arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" } }
                    },
                    {
                        opcode: "setProtectedSomrotiKey",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set protected key [KEY] to [VALUE] with password [PASSWORD] in SomrotiDB",
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "value" },
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" }
                        }
                    },
                    {
                        opcode: "getProtectedSomrotiKey",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "get protected key [KEY] with password [PASSWORD] in SomrotiDB",
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" }
                        }
                    },
                    {
                        opcode: "checkSomrotiPassword",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "password [PASSWORD] is correct for [KEY] in SomrotiDB?",
                        arguments: {
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" },
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" }
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "FirebaseDB" },
                    {
                        opcode: "setFirebaseURL",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set Firebase URL to [URL]",
                        arguments: {
                            URL: { type: Scratch.ArgumentType.STRING, defaultValue: this.firebaseAPI }
                        }
                    },
                    {
                        opcode: "setFirebaseKey",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set key [KEY] to value [VALUE] in Firebase",
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "value" }
                        }
                    },
                    {
                        opcode: "getFirebaseKey",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "get key [KEY] from Firebase",
                        arguments: { KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" } }
                    },
                    {
                        opcode: "setFirebaseKeyWithPassword",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set key [KEY] to [VALUE] with password [PASSWORD] in Firebase",
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "value" },
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" }
                        }
                    },
                    {
                        opcode: "getFirebaseKeyWithPassword",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "get key [KEY] with password [PASSWORD] from Firebase",
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" }
                        }
                    },
                    {
                        opcode: "checkFirebasePassword",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "check if [PASSWORD] is valid for [KEY] in Firebase",
                        arguments: {
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" },
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" }
                        }
                    },
                    {
                        opcode: "setFirebaseViewableKey",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set viewable key [KEY] to [VALUE] with password [PASSWORD] in Firebase",
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.STRING, defaultValue: "key" },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "value" },
                            PASSWORD: { type: Scratch.ArgumentType.STRING, defaultValue: "password" }
                        }
                    }
                ]
            };
        }

        // --- Somroti ---
        async getSomrotiKey({ KEY }) {
            try {
                const r = await fetch(`${this.somrotiAPI}/get/${encodeURIComponent(KEY)}`);
                return r.ok ? await r.text() : "";
            } catch (e) {
                console.error(e);
                return "";
            }
        }

        setSomrotiKey({ KEY, VALUE }) {
            return fetch(`${this.somrotiAPI}/set/${encodeURIComponent(KEY)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: VALUE })
            });
        }

        deleteSomrotiKey({ KEY }) {
            return fetch(`${this.somrotiAPI}/delete/${encodeURIComponent(KEY)}`, {
                method: "DELETE"
            });
        }

        setProtectedSomrotiKey({ KEY, VALUE, PASSWORD }) {
            return fetch(`${this.somrotiAPI}/set_protected/${encodeURIComponent(KEY)}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ value: VALUE, password: PASSWORD })
            });
        }

        async getProtectedSomrotiKey({ KEY, PASSWORD }) {
            try {
                const r = await fetch(`${this.somrotiAPI}/get_protected/${encodeURIComponent(KEY)}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password: PASSWORD })
                });
                return r.ok ? await r.text() : "";
            } catch (e) {
                console.error(e);
                return "";
            }
        }

        async checkSomrotiPassword({ PASSWORD, KEY }) {
            try {
                const r = await fetch(`${this.somrotiAPI}/check_password/${encodeURIComponent(KEY)}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ password: PASSWORD })
                });
                const json = await r.json();
                return !!json.match;
            } catch (e) {
                console.error(e);
                return false;
            }
        }

        // --- Firebase ---
        setFirebaseURL({ URL }) {
            this.firebaseAPI = URL;
        }

        async setFirebaseKey({ KEY, VALUE }) {
            await fetch(`${this.firebaseAPI}/pin/${encodeURIComponent(KEY)}.json`, {
                method: "PUT",
                body: JSON.stringify(VALUE)
            });
        }

        async getFirebaseKey({ KEY }) {
            const res = await fetch(`${this.firebaseAPI}/pin/${encodeURIComponent(KEY)}.json`);
            const data = await res.json();
            return data ?? "";
        }

        async deriveKey(password, salt) {
            const enc = new TextEncoder();
            const keyMaterial = await crypto.subtle.importKey(
                "raw", enc.encode(password), "PBKDF2", false, ["deriveKey"]
            );
            return crypto.subtle.deriveKey(
                { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
                keyMaterial, { name: "AES-GCM", length: 256 }, false, ["encrypt", "decrypt"]
            );
        }

        async setFirebaseKeyWithPassword({ KEY, VALUE, PASSWORD }) {
            const enc = new TextEncoder();
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const salt = crypto.getRandomValues(new Uint8Array(16));
            const key = await this.deriveKey(PASSWORD, salt);
            const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, enc.encode(VALUE));
            const payload = {
                iv: Array.from(iv),
                salt: Array.from(salt),
                data: Array.from(new Uint8Array(encrypted))
            };
            await fetch(`${this.firebaseAPI}/cypher/${encodeURIComponent(KEY)}.json`, {
                method: "PUT",
                body: JSON.stringify(payload)
            });
        }

        async getFirebaseKeyWithPassword({ KEY, PASSWORD }) {
            const res = await fetch(`${this.firebaseAPI}/cypher/${encodeURIComponent(KEY)}.json`);
            const encryptedPackage = await res.json();
            if (!encryptedPackage?.data) return "";
            try {
                const iv = new Uint8Array(encryptedPackage.iv);
                const salt = new Uint8Array(encryptedPackage.salt);
                const data = new Uint8Array(encryptedPackage.data);
                const key = await this.deriveKey(PASSWORD, salt);
                const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
                return new TextDecoder().decode(decrypted);
            } catch (e) {
                console.error(e);
                return "";
            }
        }

        async checkFirebasePassword({ KEY, PASSWORD }) {
            const res = await fetch(`${this.firebaseAPI}/cypher/${encodeURIComponent(KEY)}.json`);
            const encryptedPackage = await res.json();
            if (!encryptedPackage?.data) return false;
            try {
                const iv = new Uint8Array(encryptedPackage.iv);
                const salt = new Uint8Array(encryptedPackage.salt);
                const data = new Uint8Array(encryptedPackage.data);
                const key = await this.deriveKey(PASSWORD, salt);
                await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
                return true;
            } catch (e) {
                return false;
            }
        }

        async setFirebaseViewableKey({ KEY, VALUE, PASSWORD }) {
            const res = await fetch(`${this.firebaseAPI}/cypher/${encodeURIComponent(KEY)}.json`);
            const encryptedPackage = await res.json();

            if (encryptedPackage?.iv && encryptedPackage?.salt && encryptedPackage?.data) {
                try {
                    const iv = new Uint8Array(encryptedPackage.iv);
                    const salt = new Uint8Array(encryptedPackage.salt);
                    const data = new Uint8Array(encryptedPackage.data);
                    const key = await this.deriveKey(PASSWORD, salt);
                    await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, data);
                } catch {
                    return;
                }
            }

            const enc = new TextEncoder();
            const newIv = crypto.getRandomValues(new Uint8Array(12));
            const newSalt = crypto.getRandomValues(new Uint8Array(16));
            const newKey = await this.deriveKey(PASSWORD, newSalt);
            const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv: newIv }, newKey, enc.encode(VALUE));
            const packageData = {
                iv: Array.from(newIv),
                salt: Array.from(newSalt),
                data: Array.from(new Uint8Array(encrypted))
            };

            await fetch(`${this.firebaseAPI}/cypher/${encodeURIComponent(KEY)}.json`, {
                method: "PUT",
                body: JSON.stringify(packageData)
            });

            await fetch(`${this.firebaseAPI}/pin/${encodeURIComponent(KEY)}.json`, {
                method: "PUT",
                body: JSON.stringify(VALUE)
            });
        }
    }

    Scratch.extensions.register(new UltimateDB());
})(Scratch);
