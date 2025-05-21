(function(Scratch) {
    'use strict';

    class TwoFAExtension {
        getInfo() {
            return {
                id: 'twofa',
                name: 'Email 2FA',
                color1: '#4C97FF',
                color2: '#3373CC',
                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'You can only send a code'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'every 60 seconds.'
                    },
                    {
                        opcode: 'send2FACode',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'send 2FA code to [EMAIL] from [PROJECT]',
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user@example.com'
                            },
                            PROJECT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'My Game'
                            }
                        }
                    },
                    {
                        opcode: 'verify2FACode',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is 2FA code [CODE] correct for [EMAIL]?',
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '123456'
                            },
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user@example.com'
                            }
                        }
                    },
                    {
                        opcode: 'isUserVerified',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [EMAIL] verified?',
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user@example.com'
                            }
                        }
                    },
                    {
                        opcode: 'clearVerification',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear verification for [EMAIL]',
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user@example.com'
                            }
                        }
                    },
                    {
                        opcode: 'isServerOnline',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is 2FA server online?'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'It\'s recommended to clear verification'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'before verifying, The user may already'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'be verified from another project.'
                    }
                ]
            };
        }

        async send2FACode(args) {
            try {
                await fetch('https://ikelene.ca/api/2fa/send_code.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        email: args.EMAIL,
                        project: args.PROJECT || 'Your App'
                    })
                });
            } catch (e) {
                console.error("2FA send error:", e);
            }
        }

        async verify2FACode(args) {
            try {
                const res = await fetch('https://ikelene.ca/api/2fa/verify_code.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        email: args.EMAIL,
                        code: args.CODE
                    })
                });
                const text = await res.text();
                return text.trim() === 'true';
            } catch (e) {
                console.error("2FA verify error:", e);
                return false;
            }
        }

        async isUserVerified(args) {
            try {
                const res = await fetch(`https://ikelene.ca/api/2fa/is_verified.php?email=${encodeURIComponent(args.EMAIL)}`);
                const text = await res.text();
                return text.trim() === 'true';
            } catch (e) {
                console.error("2FA is_verified error:", e);
                return false;
            }
        }

        async clearVerification(args) {
            try {
                await fetch('https://ikelene.ca/api/2fa/clear_verification.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ email: args.EMAIL })
                });
            } catch (e) {
                console.error("2FA clear error:", e);
            }
        }

        async isServerOnline() {
            try {
                const res = await fetch('https://ikelene.ca/api/2fa/ping.php');
                const text = await res.text();
                return text.trim() === 'pong';
            } catch (e) {
                return false;
            }
        }
    }

    Scratch.extensions.register(new TwoFAExtension());
})(Scratch);
