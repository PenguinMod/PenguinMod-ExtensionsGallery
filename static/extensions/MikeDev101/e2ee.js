/*
General-purpose E2EE extension for Scratch 3

MIT License

Copyright (C) 2024 Mike Renaker "MikeDEV".

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/

// E2EE
// ID: e2ee
// Description: General-purpose E2EE extension for Scratch.
// By: MikeDEV
// License: MIT
(() => {
    (function (Scratch2) {
        if (!Scratch2.extensions.unsandboxed) {
            throw new Error("Sandboxed mode is not supported in this extension.");
        }
    
        // Define class to provide encryption (ECDH-P256-AES-GCM with SPKI-BASE64 public keys)
        class Encryption {
            async generateKeyPair() {
                let keyPair = await window.crypto.subtle.generateKey(
                    {
                        name: "ECDH",
                        namedCurve: "P-256"
                    },
                    true,
                    ["deriveKey", "deriveBits"]
                );
                let publicKey = await this.exportPublicKey(keyPair.publicKey);
                let privateKey = await this.exportPrivateKey(keyPair.privateKey);
                return [publicKey, privateKey];
            }
    
            async exportPublicKey(pubKey) {
                let exportedKey = await window.crypto.subtle.exportKey("spki", pubKey);
                return this.arrayBufferToBase64(new Uint8Array(exportedKey));
            }
    
            async importPublicKey(exportedKey) {
                const exportedKeyArray = this.base64ToArrayBuffer(exportedKey);
                return await window.crypto.subtle.importKey(
                    "spki",
                    exportedKeyArray,
                    {
                        name: "ECDH",
                        namedCurve: "P-256"
                    },
                    true,
                    []
                );
            }
    
            async exportPrivateKey(privKey) {
                let exportedKey = await window.crypto.subtle.exportKey("pkcs8", privKey);
                return this.arrayBufferToBase64(new Uint8Array(exportedKey));
            }
    
            async importPrivateKey(exportedKey) {
                const exportedKeyArray = this.base64ToArrayBuffer(exportedKey);
                return await window.crypto.subtle.importKey(
                    "pkcs8",
                    exportedKeyArray,
                    {
                        name: "ECDH",
                        namedCurve: "P-256"
                    },
                    true,
                    ["deriveKey", "deriveBits"]
                );
            }
    
            async deriveSharedKey(publicKey, privateKey) {
                let pubkey = await this.importPublicKey(publicKey);
                let privkey = await this.importPrivateKey(privateKey);
                let shared = await window.crypto.subtle.deriveKey(
                    {
                        name: "ECDH",
                        public: pubkey
                    },
                    privkey,
                    {
                        name: "AES-GCM",
                        length: 256
                    },
                    true,
                    ["encrypt", "decrypt"]
                );
                let exported = await this.exportSharedKey(shared);
                return exported;
            }
    
            async exportSharedKey(sharedKey) {
                let exportedKey = await window.crypto.subtle.exportKey("raw", sharedKey);
                return this.arrayBufferToBase64(new Uint8Array(exportedKey));
            }
        
            async importSharedKey(exportedKey) {
                const exportedKeyArray = this.base64ToArrayBuffer(exportedKey);
                return await window.crypto.subtle.importKey(
                    "raw",
                    exportedKeyArray,
                    {
                        name: "AES-GCM",
                        length: 256
                    },
                    true,
                    ["encrypt", "decrypt"]
                );
            }
    
            async encrypt(message, sharedKey) {
                let shared = await this.importSharedKey(sharedKey);
                let encodedMessage = new TextEncoder().encode(message);
                const iv = window.crypto.getRandomValues(new Uint8Array(12));
                const encryptedMessage = await window.crypto.subtle.encrypt(
                    {
                        name: "AES-GCM",
                        iv: iv
                    },
                    shared,
                    encodedMessage
                );
                const encryptedMessageArray = new Uint8Array(encryptedMessage);
                const encryptedMessageBase64 = this.arrayBufferToBase64(encryptedMessageArray);
                const ivBase64 = this.arrayBufferToBase64(iv);
                return [encryptedMessageBase64, ivBase64];
            }
    
            async decrypt(encryptedMessageBase64, ivBase64, sharedKey) {
                let shared = await this.importSharedKey(sharedKey);
                let encryptedMessageArray = this.base64ToArrayBuffer(encryptedMessageBase64);
                const iv = this.base64ToArrayBuffer(ivBase64);
                const decryptedMessage = await window.crypto.subtle.decrypt(
                    {
                        name: "AES-GCM",
                        iv: iv
                    },
                    shared,
                    encryptedMessageArray
                );
                const decodedMessage = new TextDecoder().decode(decryptedMessage);
                return decodedMessage;
            }
    
            arrayBufferToBase64(buffer) {
                let binary = '';
                let bytes = new Uint8Array(buffer);
                for (let i = 0; i < bytes.byteLength; i++) {
                    binary += String.fromCharCode(bytes[i]);
                }
                return btoa(binary);
            }
    
            base64ToArrayBuffer(base64) {
                let binary_string = window.atob(base64);
                let len = binary_string.length;
                let bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binary_string.charCodeAt(i);
                }
                return bytes.buffer;
            }
        }
    
        // Define E2EE extension
        class E2EE {
            constructor() {
                this.encryption = new Encryption();
                this.publicKey = "";
                this.privateKey = "";
                this.sharedKey = "";
                this.encrypted = "";
                this.IV = "";
                this.decrypted = "";

                this.menuIconURI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDIyMCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xODMuMzMzIDExOS4xNjdDMTgzLjMzMyAxNjUgMTUxLjI1IDE4Ny45MTcgMTEzLjExNyAyMDEuMjA4QzExMS4xMiAyMDEuODg1IDEwOC45NTEgMjAxLjg1MyAxMDYuOTc1IDIwMS4xMTdDNjguNzUwMSAxODcuOTE3IDM2LjY2NjcgMTY1IDM2LjY2NjcgMTE5LjE2N1Y1NUMzNi42NjY3IDUyLjU2ODggMzcuNjMyNSA1MC4yMzczIDM5LjM1MTYgNDguNTE4MkM0MS4wNzA3IDQ2Ljc5OTEgNDMuNDAyMyA0NS44MzMzIDQ1LjgzMzQgNDUuODMzM0M2NC4xNjY3IDQ1LjgzMzMgODcuMDgzNCAzNC44MzMzIDEwMy4wMzMgMjAuOUMxMDQuOTc1IDE5LjI0MDggMTA3LjQ0NiAxOC4zMjkyIDExMCAxOC4zMjkyQzExMi41NTQgMTguMzI5MiAxMTUuMDI1IDE5LjI0MDggMTE2Ljk2NyAyMC45QzEzMy4wMDggMzQuOTI1IDE1NS44MzMgNDUuODMzMyAxNzQuMTY3IDQ1LjgzMzNDMTc2LjU5OCA0NS44MzMzIDE3OC45MjkgNDYuNzk5MSAxODAuNjQ5IDQ4LjUxODJDMTgyLjM2OCA1MC4yMzczIDE4My4zMzMgNTIuNTY4OCAxODMuMzMzIDU1VjExOS4xNjdaIiBmaWxsPSIjNzY3Njc2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTY1IDEzN1YxNTAuNUM2NSAxNTMuMiA2Ni44IDE1NSA2OS41IDE1NUg4Ny41VjE0MS41SDEwMVYxMjhIMTEwTDExNi4zIDEyMS43QzEyMi41NTQgMTIzLjg3OSAxMjkuMzYzIDEyMy44NyAxMzUuNjEyIDEyMS42NzZDMTQxLjg2MSAxMTkuNDgyIDE0Ny4xOCAxMTUuMjMzIDE1MC43IDEwOS42MjNDMTU0LjIxOSAxMDQuMDEyIDE1NS43MzEgOTcuMzczOCAxNTQuOTg3IDkwLjc5MjhDMTU0LjI0MyA4NC4yMTE5IDE1MS4yODggNzguMDc4MSAxNDYuNjA1IDczLjM5NTFDMTQxLjkyMiA2OC43MTIgMTM1Ljc4OCA2NS43NTY4IDEyOS4yMDcgNjUuMDEzQzEyMi42MjYgNjQuMjY5MiAxMTUuOTg4IDY1Ljc4MDcgMTEwLjM3NyA2OS4zMDA0QzEwNC43NjcgNzIuODIgMTAwLjUxOCA3OC4xMzk0IDk4LjMyMzYgODQuMzg4M0M5Ni4xMjk3IDkwLjYzNzIgOTYuMTIxMyA5Ny40NDU3IDk4LjMgMTAzLjdMNjUgMTM3WiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTMzLjA0OSIgY3k9Ijg2Ljk1MTIiIHI9IjkuODc4MDUiIGZpbGw9IiM3Njc2NzYiLz4KPC9zdmc+Cg==";
                this.blockIconURI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjIwIiBoZWlnaHQ9IjIyMCIgdmlld0JveD0iMCAwIDIyMCAyMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxwYXRoIGQ9Ik0xODMuMzMzIDExOS4xNjdDMTgzLjMzMyAxNjUgMTUxLjI1IDE4Ny45MTcgMTEzLjExNyAyMDEuMjA4QzExMS4xMiAyMDEuODg1IDEwOC45NTEgMjAxLjg1MyAxMDYuOTc1IDIwMS4xMTdDNjguNzUwMSAxODcuOTE3IDM2LjY2NjcgMTY1IDM2LjY2NjcgMTE5LjE2N1Y1NUMzNi42NjY3IDUyLjU2ODggMzcuNjMyNSA1MC4yMzczIDM5LjM1MTYgNDguNTE4MkM0MS4wNzA3IDQ2Ljc5OTEgNDMuNDAyMyA0NS44MzMzIDQ1LjgzMzQgNDUuODMzM0M2NC4xNjY3IDQ1LjgzMzMgODcuMDgzNCAzNC44MzMzIDEwMy4wMzMgMjAuOUMxMDQuOTc1IDE5LjI0MDggMTA3LjQ0NiAxOC4zMjkyIDExMCAxOC4zMjkyQzExMi41NTQgMTguMzI5MiAxMTUuMDI1IDE5LjI0MDggMTE2Ljk2NyAyMC45QzEzMy4wMDggMzQuOTI1IDE1NS44MzMgNDUuODMzMyAxNzQuMTY3IDQ1LjgzMzNDMTc2LjU5OCA0NS44MzMzIDE3OC45MjkgNDYuNzk5MSAxODAuNjQ5IDQ4LjUxODJDMTgyLjM2OCA1MC4yMzczIDE4My4zMzMgNTIuNTY4OCAxODMuMzMzIDU1VjExOS4xNjdaIiBmaWxsPSIjNzY3Njc2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjIwIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz4KPHBhdGggZD0iTTY1IDEzN1YxNTAuNUM2NSAxNTMuMiA2Ni44IDE1NSA2OS41IDE1NUg4Ny41VjE0MS41SDEwMVYxMjhIMTEwTDExNi4zIDEyMS43QzEyMi41NTQgMTIzLjg3OSAxMjkuMzYzIDEyMy44NyAxMzUuNjEyIDEyMS42NzZDMTQxLjg2MSAxMTkuNDgyIDE0Ny4xOCAxMTUuMjMzIDE1MC43IDEwOS42MjNDMTU0LjIxOSAxMDQuMDEyIDE1NS43MzEgOTcuMzczOCAxNTQuOTg3IDkwLjc5MjhDMTU0LjI0MyA4NC4yMTE5IDE1MS4yODggNzguMDc4MSAxNDYuNjA1IDczLjM5NTFDMTQxLjkyMiA2OC43MTIgMTM1Ljc4OCA2NS43NTY4IDEyOS4yMDcgNjUuMDEzQzEyMi42MjYgNjQuMjY5MiAxMTUuOTg4IDY1Ljc4MDcgMTEwLjM3NyA2OS4zMDA0QzEwNC43NjcgNzIuODIgMTAwLjUxOCA3OC4xMzk0IDk4LjMyMzYgODQuMzg4M0M5Ni4xMjk3IDkwLjYzNzIgOTYuMTIxMyA5Ny40NDU3IDk4LjMgMTAzLjdMNjUgMTM3WiIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iMTMzLjA0OSIgY3k9Ijg2Ljk1MTIiIHI9IjkuODc4MDUiIGZpbGw9IiM3Njc2NzYiLz4KPC9zdmc+Cg==";
            }
    
            getInfo() {
                return {
                    id: 'e2ee',
                    name: 'E2EE',
                    color1: '#767676',
                    color2: '#575757',
                    menuIconURI: this.menuIconURI,
                    blockIconURI: this.blockIconURI,
                    blocks: [
                        {
                            opcode: 'generateKeyPair',
                            blockType: Scratch2.BlockType.COMMAND,
                            text: 'Generate Keys'
                        },
                        {
                            opcode: 'myPubKey',
                            blockType: Scratch2.BlockType.REPORTER,
                            text: 'Public Key'
                        },
                        {
                            opcode: 'myPrivKey',
                            blockType: Scratch2.BlockType.REPORTER,
                            text: 'Private Key'
                        },
                        "---",
                        {
                            opcode: 'makeSharedKey',
                            blockType: Scratch2.BlockType.REPORTER,
                            arguments: {
                                otherPublicKey: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "Other public key"
                                },
                                myPrivateKey: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "My private key"
                                }
                            },
                            text: 'Create Secret [otherPublicKey] [myPrivateKey]'
                        },
                        "---",
                        {
                            opcode: 'encryptData',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                data: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "Data to encrypt"
                                },
                                secret: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "Secret"
                                }
                            },
                            text: 'Encrypt [data] [secret]'
                        },
                        {
                            opcode: 'iv',
                            blockType: Scratch2.BlockType.REPORTER,
                            text: 'IV'
                        },
                        {
                            opcode: 'encryptedData',
                            blockType: Scratch2.BlockType.REPORTER,
                            text: 'Encrypted'
                        },
                        "---",
                        {
                            opcode: 'decryptData',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                data: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "Encrypted data"
                                },
                                iv: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "IV"
                                },
                                secret: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "Secret"
                                }
                            },
                            text: 'Decrypt [data] [iv] [secret]'
                        },
                        {
                            opcode: 'decryptedData',
                            blockType: Scratch2.BlockType.REPORTER,
                            text: 'Decrypted'
                        }
                    ]
                }
            }

            iv() {
                return this.IV;
            }

            encryptedData() {
                return this.encrypted;
            }

            decryptedData() {
                return this.decrypted;
            }
    
            myPubKey() {
                return this.publicKey;
            }
    
            myPrivKey() {
                return this.privateKey;
            }
    
            async generateKeyPair() {
                const self = this;
                [self.publicKey, self.privateKey] = await this.encryption.generateKeyPair();
            }

            async makeSharedKey({otherPublicKey, myPrivateKey}) {
                const self = this;
                return await self.encryption.deriveSharedKey(otherPublicKey, myPrivateKey);
            }

            async encryptData({data, secret}) {
                const self = this;
                [self.encrypted, self.IV] = await self.encryption.encrypt(data, secret);
            }

            async decryptData({data, iv, secret}) {
                const self = this;
                self.decrypted = await self.encryption.decrypt(data, iv, secret);
            }

        }

        Scratch2.extensions.register(new E2EE())
    })(Scratch);    
})();
