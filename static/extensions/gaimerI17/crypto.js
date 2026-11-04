(function(Scratch) {
    'use strict';

    function bufToHex(buffer) {
        const bytes = buffer instanceof ArrayBuffer ? new Uint8Array(buffer)
            : buffer instanceof Uint8Array ? buffer
            : new Uint8Array(buffer);
        return Array.prototype.map.call(bytes, b => b.toString(16).padStart(2, '0')).join('');
    }

    function hexToBuf(hex) {
        const clean = String(hex).replace(/[^0-9a-f]/gi, '').toLowerCase();
        if (clean.length % 2 !== 0) throw new Error('Invalid hex string');
        const out = new Uint8Array(clean.length / 2);
        for (let i = 0; i < out.length; i++) {
            out[i] = parseInt(clean.substr(i * 2, 2), 16);
        }
        return out.buffer;
    }

    const menuIconURI = 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIiB2aWV3Qm94PSIwLDAsMzAwLDMwMCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1MCwwKSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMTUwLDMwMHYtMzAwaDMwMHYzMDB6IiBmaWxsPSIjNjc2NzY3IiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41Ii8+PHBhdGggZD0iTTE1MCwzMDB2LTMwMGgzMDBsLTExOS4wOTA1LDE3Ny4wMzY2M3oiIGZpbGw9IiM0NTQ1NDUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNMzExLjM3NzUzLDE0OS45OTk5OWMwLC0yMS40NjQyMSAxNy40MDAxOSwtMzguODY0MzkgMzguODY0NCwtMzguODY0MzljMjEuNDY0MjEsMCAzOC44NjQ0LDE3LjQwMDE4IDM4Ljg2NDQsMzguODY0NGMwLDIxLjQ2NDIxIC0xNy40MDAxOSwzOC44NjQ0IC0zOC44NjQzOSwzOC44NjQ0Yy0yMS40NjQyMSwwIC0zOC44NjQzOSwtMTcuNDAwMTggLTM4Ljg2NDM5LC0zOC44NjQzOXpNMzUwLjI0MTk0LDE3OS4xNDE4NGMxNi4wOTQ2LDAgMjkuMTQxODUsLTEzLjA0NzI2IDI5LjE0MTg1LC0yOS4xNDE4NWMwLC0xNi4wOTQ1OSAtMTMuMDQ3MjYsLTI5LjE0MTg1IC0yOS4xNDE4NSwtMjkuMTQxODVjLTE2LjA5NDYsMCAtMjkuMTQxODUsMTMuMDQ3MjYgLTI5LjE0MTg1LDI5LjE0MTg1YzAsMTYuMDk0NTkgMTMuMDQ3MjUsMjkuMTQxODUgMjkuMTQxODUsMjkuMTQxODV6IiBmaWxsPSIjZmY5OTAwIiBzdHJva2U9IiNmZjk5MDAiIHN0cm9rZS13aWR0aD0iNyIvPjxwYXRoIGQ9Ik0yMTAuODkzNjcsMTU2LjE3NzI4di0xMi4zNTQ1N2gxMDYuODk5NDR2MTIuMzU0NTd6IiBmaWxsPSIjZmY5OTAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMTAuODkzNjcsMTc5LjEwODM0di0zNS4yODU2M2gxMy4yMzIxMXYzNS4yODU2M3oiIGZpbGw9IiNmZjk5MDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI0OS41MTY3MSwxNjcuODA1NXYtMjMuMjU2NDRoOC4wMTk0NnYyMy4yNTY0NHoiIGZpbGw9IiNmZjk5MDAiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIi8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MTUwOjE1MC0tPg==';

    class Extension {
        getInfo() {
            return {
                id: "gaimeriCryptoExtension",
                name: "Cryptography",
                color1: "#676767",
                color2: "#444444",
                color3: "#222222",
                menuIconURI,
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: 'Random' },
                    {
                        opcode: 'randomUUID',
                        text: 'random UUID',
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true
                    },
                    {
                        opcode: 'randomValues',
                        text: '[SCALE] of [AMOUNT] random values',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
                            SCALE: { type: Scratch.ArgumentType.STRING, menu: 'TYPED_ARRAYS', allowReporters: false }
                        }
                    },

                    '---',
                    { blockType: Scratch.BlockType.LABEL, text: 'Hashing' },
                    {
                        opcode: 'digest',
                        text: 'hash [VALUE] with [ALGORITHM]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
                            ALGORITHM: { type: Scratch.ArgumentType.STRING, menu: 'ALGORITHM' }
                        }
                    },

                    '---',
                    { blockType: Scratch.BlockType.LABEL, text: 'HMAC' },
                    {
                        opcode: 'generateSignKey',
                        text: 'generate HMAC key',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.OCTAGONAL,
                        disableMonitor: true
                    },
                    {
                        opcode: 'signValue',
                        text: 'HMAC sign [VALUE] with key [KEY]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
                            KEY: { type: Scratch.ArgumentType.EMPTY, shape: Scratch.BlockShape.OCTAGONAL }
                        }
                    },
                    {
                        opcode: 'verifySignature',
                        text: 'HMAC verify signature [SIGNATURE] of [VALUE] with key [KEY]',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            SIGNATURE: { type: Scratch.ArgumentType.STRING, defaultValue: 'signature' },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
                            KEY: { type: Scratch.ArgumentType.EMPTY, shape: Scratch.BlockShape.OCTAGONAL }
                        }
                    },

                    '---',
                    { blockType: Scratch.BlockType.LABEL, text: 'AES-GCM Encryption' },
                    {
                        opcode: 'generateAESKey',
                        text: 'generate AES-GCM key (256-bit)',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.OCTAGONAL,
                        disableMonitor: true
                    },
                    {
                        opcode: 'encryptAES',
                        text: 'encrypt [PLAINTEXT] with AES key [KEY]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            PLAINTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
                            KEY: { type: Scratch.ArgumentType.EMPTY, shape: Scratch.BlockShape.OCTAGONAL }
                        }
                    },
                    {
                        opcode: 'decryptAES',
                        text: 'decrypt [CIPHERTEXT] with AES key [KEY]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            CIPHERTEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'encrypted' },
                            KEY: { type: Scratch.ArgumentType.EMPTY, shape: Scratch.BlockShape.OCTAGONAL }
                        }
                    },

                    '---',
                    { blockType: Scratch.BlockType.LABEL, text: 'RSA-PSS' },
                    {
                        opcode: 'generateRSAKey',
                        text: 'generate RSA-PSS keypair',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.OCTAGONAL,
                        disableMonitor: true
                    },
                    {
                        opcode: 'rsaSign',
                        text: 'RSA sign [VALUE] with private key [KEY]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
                            KEY: { type: Scratch.ArgumentType.EMPTY, shape: Scratch.BlockShape.OCTAGONAL }
                        }
                    },
                    {
                        opcode: 'rsaVerify',
                        text: 'RSA verify [SIGNATURE] of [VALUE] with public key [KEY]',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            SIGNATURE: { type: Scratch.ArgumentType.STRING, defaultValue: 'signature' },
                            VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'apple' },
                            KEY: { type: Scratch.ArgumentType.EMPTY, shape: Scratch.BlockShape.OCTAGONAL }
                        }
                    },
                    {
                        opcode: 'rsaPublicKey',
                        text: 'RSA public key from [KEY]',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.OCTAGONAL,
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.EMPTY, shape: Scratch.BlockShape.OCTAGONAL }
                        }
                    },
                    {
                        opcode: 'rsaPrivateKey',
                        text: 'RSA private key from [KEY]',
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.OCTAGONAL,
                        arguments: {
                            KEY: { type: Scratch.ArgumentType.EMPTY, shape: Scratch.BlockShape.OCTAGONAL }
                        }
                    },
                ],

                menus: {
                    ALGORITHM: { items: ['SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] },
                    TYPED_ARRAYS: ['Uint8Array','Uint16Array','Uint32Array','Int8Array','Int16Array','Int32Array']
                }
            };
        }

        randomUUID() {
            return (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : '';
        }

        randomValues(args) {
            const typedArrayConstructors = {
                Uint8Array: Uint8Array,
                Uint16Array: Uint16Array,
                Uint32Array: Uint32Array,
                Int8Array: Int8Array,
                Int16Array: Int16Array,
                Int32Array: Int32Array
            };

            const TypedArrayConstructor = typedArrayConstructors[args.SCALE];
            if (!TypedArrayConstructor) throw new Error('Unsupported TypedArray type specified.');

            let amt = Number(args.AMOUNT) || 0;
            amt = Math.max(0, Math.floor(amt));
            if (amt > 1000000) amt = 1000000;

            const arr = new TypedArrayConstructor(amt);
            crypto.getRandomValues(arr);
            return JSON.stringify(Array.from(arr));
        }

        async digest(args) {
            const algo = typeof args.ALGORITHM === 'string' ? args.ALGORITHM : 'SHA-256';
            const bytes = new TextEncoder().encode(String(args.VALUE));
            const hash = await crypto.subtle.digest(algo, bytes);
            return bufToHex(hash);
        }

        async generateSignKey() {
            const key = await crypto.subtle.generateKey({
                name: 'HMAC',
                hash: { name: 'SHA-512' }
            }, true, ['sign', 'verify']);
            const jwk = await crypto.subtle.exportKey('jwk', key);
            return JSON.stringify(jwk);
        }

        async signValue(args) {
            let jwk;
            try {
                jwk = JSON.parse(String(args.KEY));
            } catch {
                return '';
            }
            const key = await crypto.subtle.importKey('jwk', jwk, {
                name: 'HMAC',
                hash: { name: 'SHA-512' }
            }, false, ['sign']);
            const data = new TextEncoder().encode(String(args.VALUE));
            const sig = await crypto.subtle.sign('HMAC', key, data);
            return bufToHex(sig);
        }

        async verifySignature(args) {
            let jwk;
            try {
                jwk = JSON.parse(String(args.KEY));
            } catch {
                return '';
            }
            const key = await crypto.subtle.importKey('jwk', jwk, {
                name: 'HMAC',
                hash: { name: 'SHA-512' }
            }, false, ['verify']);
            const data = new TextEncoder().encode(String(args.VALUE));
            try {
                return await crypto.subtle.verify('HMAC', key, hexToBuf(args.SIGNATURE), data);
            } catch (e) {
                return false;
            }
        }

        async generateAESKey() {
            const key = await crypto.subtle.generateKey({
                name: 'AES-GCM',
                length: 256
            }, true, ['encrypt', 'decrypt']);
            const jwk = await crypto.subtle.exportKey('jwk', key);
            return JSON.stringify(jwk);
        }

        async encryptAES(args) {
            let jwk;
            try {
                jwk = JSON.parse(String(args.KEY));
            } catch {
                return '';
            }
            const key = await crypto.subtle.importKey('jwk', jwk, { name: 'AES-GCM' }, false, ['encrypt']);
            const iv = crypto.getRandomValues(new Uint8Array(12));
            const data = new TextEncoder().encode(String(args.PLAINTEXT));
            const ciphertext = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, data);
            return JSON.stringify({
                iv: bufToHex(iv),
                ct: bufToHex(ciphertext)
            });
        }

        async decryptAES(args) {
            let obj;
            try {
                obj = JSON.parse(String(args.CIPHERTEXT));
            } catch {
                return '';
            }
            let jwk;
            try {
                jwk = JSON.parse(String(args.KEY));
            } catch {
                return '';
            }
            const key = await crypto.subtle.importKey('jwk', jwk, { name: 'AES-GCM' }, false, ['decrypt']);
            try {
                const plaintextBuf = await crypto.subtle.decrypt({
                    name: 'AES-GCM',
                    iv: new Uint8Array(hexToBuf(String(obj.iv)))
                }, key, hexToBuf(String(obj.ct)));
                return new TextDecoder().decode(plaintextBuf);
            } catch {
                return '';
            }
        }

        async generateRSAKey() {
            const keyPair = await crypto.subtle.generateKey({
                name: 'RSA-PSS',
                modulusLength: 2048,
                publicExponent: new Uint8Array([1, 0, 1]),
                hash: { name: 'SHA-256' }
            }, true, ['sign', 'verify']);

            const ret = {
                publicKey: await crypto.subtle.exportKey('jwk', keyPair.publicKey),
                privateKey: await crypto.subtle.exportKey('jwk', keyPair.privateKey)
            };
            return JSON.stringify(ret);
        }

        async rsaSign(args) {
            let jwk;
            try {
                jwk = JSON.parse(String(args.KEY));
            } catch {
                return '';
            }
            const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSA-PSS', hash: { name: 'SHA-256' } }, false, ['sign']);
            const data = new TextEncoder().encode(String(args.VALUE));
            const sig = await crypto.subtle.sign({ name: 'RSA-PSS', saltLength: 32 }, key, data);
            return bufToHex(sig);
        }

        async rsaVerify(args) {
            let jwk;
            try {
                jwk = JSON.parse(String(args.KEY));
            } catch {
                return '';
            }
            const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSA-PSS', hash: { name: 'SHA-256' } }, false, ['verify']);
            const data = new TextEncoder().encode(String(args.VALUE));
            try {
                return await crypto.subtle.verify({ name: 'RSA-PSS', saltLength: 32 }, key, hexToBuf(args.SIGNATURE), data);
            } catch {
                return false;
            }
        }

        // these two key methods have more validation (i cried while making them)
        async rsaPublicKey(args) {
            if (typeof args.KEY !== 'string') return '';
            try {
                const key = JSON.parse(args.KEY);
                if (key && key.publicKey) {
                    return JSON.stringify(key.publicKey);
                }
                return '';
            } catch (error) {
                return '';
            }
        }

        async rsaPrivateKey(args) {
            if (typeof args.KEY !== 'string') return '';
            try {
                const key = JSON.parse(args.KEY);
                if (key && key.privateKey) {
                    return JSON.stringify(key.privateKey);
                }
                return '';
            } catch (error) {
                return '';
            }
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
