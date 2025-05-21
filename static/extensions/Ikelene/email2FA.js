(function(Scratch) {
    'use strict';

    let cachedProjectID = null;

    class TwoFAExtension {
        getInfo() {
            return {
                id: 'twofa',
                name: 'Email 2FA',
                color1: '#ff8c3b',
                color2: '#ff8c3b',
                blockIconURI: 'https://ikelene.ca/api/2fa/icon-white.svg',
                menuIconURI: 'https://ikelene.ca/api/2fa/icon-orange.svg',
                blocks: [
                    {
                        opcode: 'registerProjectID',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'register project [PROJECTNAME]',
                        arguments: {
                            PROJECTNAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'CoolGame'
                            }
                        }
                    },
                    {
                        opcode: 'send2FACode',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'send 2FA code to [EMAIL] from project ID [PROJECT_ID]',
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user@example.com'
                            },
                            PROJECT_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'abc123'
                            }
                        }
                    },
                    {
                        opcode: 'verify2FACode',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is 2FA code [CODE] correct for [EMAIL] in project ID [PROJECT_ID]?',
                        arguments: {
                            CODE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '123456'
                            },
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user@example.com'
                            },
                            PROJECT_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'abc123'
                            }
                        }
                    },
                    {
                        opcode: 'isUserVerified',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is [EMAIL] verified in project ID [PROJECT_ID]?',
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user@example.com'
                            },
                            PROJECT_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'abc123'
                            }
                        }
                    },
                    {
                        opcode: 'clearVerification',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear verification for [EMAIL] in project ID [PROJECT_ID]',
                        arguments: {
                            EMAIL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user@example.com'
                            },
                            PROJECT_ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'abc123'
                            }
                        }
                    },
                    {
                        opcode: 'isServerOnline',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is 2FA server online?'
                    }
                ]
            };
        }

        async registerProjectID(args) {
            if (cachedProjectID) return cachedProjectID;
            const confirmed = window.confirm('âš ï¸ DO NOT use this block in running code!\n\nThis block is for one-time manual use to register a project.\nClick OK to continue.');
            if (!confirmed) return '';

            try {
                const res = await fetch('https://ikelene.ca/api/2fa/register_project.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({ project: args.PROJECTNAME })
                });
                const id = await res.text();
                const trimmed = id.trim();
                if (trimmed && trimmed !== 'invalid name' && trimmed !== 'disallowed name' && trimmed !== 'rate limited') {
                    cachedProjectID = trimmed;
                    return cachedProjectID;
                }
                return '';
            } catch (e) {
                console.error('Failed to register project:', e);
                return '';
            }
        }

        async send2FACode(args) {
            try {
                await fetch('https://ikelene.ca/api/2fa/send_code.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        email: args.EMAIL,
                        project_id: args.PROJECT_ID
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
                        code: args.CODE,
                        project_id: args.PROJECT_ID
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
                const res = await fetch(`https://ikelene.ca/api/2fa/is_verified.php?email=${encodeURIComponent(args.EMAIL)}&project_id=${encodeURIComponent(args.PROJECT_ID)}`);
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
                    body: new URLSearchParams({
                        email: args.EMAIL,
                        project_id: args.PROJECT_ID
                    })
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
