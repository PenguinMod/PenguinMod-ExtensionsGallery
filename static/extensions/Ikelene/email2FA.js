(function(Scratch) {
    'use strict';

    let cachedProjectID = null;
    let customEmailSettings = null;
    let emailPreset = 0;
    let customHTML = '';

    const PROJECT_ID_KEY = 'IkeEmailTwofa_ProjectID';

    class TwoFAExtension {
        getInfo() {
            return {
                id: 'IkeEmailTwofa',
                name: 'Email 2FA',
                color1: '#ff8c3b',
                color2: '#ff8c3b',
                blockIconURI: 'https://ikelene.ca/api/2fa/icon-white.svg',
                menuIconURI: 'https://ikelene.ca/api/2fa/icon-orange.svg',
                blocks: [
                    {
                        opcode: 'registerProjectID',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get Project ID with name [PROJECTNAME]',
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
                        text: 'Send 2FA code to [EMAIL] from project ID [PROJECT_ID]',
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
                        text: 'Is 2FA code [CODE] correct for [EMAIL] in project ID [PROJECT_ID]?',
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
                        text: 'Is [EMAIL] verified in project ID [PROJECT_ID]?',
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
                        text: 'Clear verification for [EMAIL] in project ID [PROJECT_ID]',
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
                        text: 'Is 2FA server online?'
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Customization'
                    },
                    {
                        opcode: 'setEmailPreset',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set email style preset to [PRESET]',
                        arguments: {
                            PRESET: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'presetMenu'
                            }
                        }
                    },
                    {
                        opcode: 'setCustomHTML',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set custom email HTML to [HTML]',
                        arguments: {
                            HTML: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '<h1>Your Code</h1>'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Use your own email'
                    },
                    {
                        opcode: 'setCustomEmailLogin',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Use custom email login [EMAIL] pass [PASS] smtp [SMTP] port [PORT]',
                        arguments: {
                            EMAIL: { type: Scratch.ArgumentType.STRING, defaultValue: 'your@email.com' },
                            PASS: { type: Scratch.ArgumentType.STRING, defaultValue: 'password' },
                            SMTP: { type: Scratch.ArgumentType.STRING, defaultValue: 'smtp.gmail.com' },
                            PORT: { type: Scratch.ArgumentType.STRING, defaultValue: '465' }
                        }
                    },
                    {
                        opcode: 'clearCustomEmailLogin',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Clear custom email login'
                    }
                ],
                menus: {
                    presetMenu: {
                        acceptReporters: true,
                        items: [
                            { text: 'Classic (default)', value: '5' },
 { text: 'Yellow Card', value: '1' },
 { text: 'Blue Card', value: '2' },
 { text: 'Minimalist Dashed', value: '3' },
 { text: 'Welcome Style', value: '4' }
                        ]
                    }
                }
            };
        }

        constructor() {
            const runtime = Scratch.runtime;
            if (runtime && runtime.vm) {
                const state = runtime.vm.extensionState['IkeEmailTwofa'] ||= {};
                cachedProjectID = state['projectID'] || null;
            } else {
                console.warn('Scratch.runtime.vm not available yet.');
            }
        }

        setEmailPreset(args) {
            emailPreset = parseInt(args.PRESET);
        }

        setCustomHTML(args) {
            customHTML = args.HTML;
        }

        setCustomEmailLogin(args) {
            customEmailSettings = {
                email: args.EMAIL,
                pass: args.PASS,
                smtp: args.SMTP,
                port: args.PORT
            };
        }

        clearCustomEmailLogin() {
            customEmailSettings = null;
        }

        async registerProjectID(args) {
            if (cachedProjectID) return cachedProjectID;

            try {
                const res = await fetch('https://ikelene.ca/api/2fa/register_project.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: `project=${encodeURIComponent(args.PROJECTNAME)}`
                });

                const id = await res.text();
                const trimmed = id.trim();

                const isError = ['invalid name', 'invalid chars', 'rate limit', 'rate limited'].includes(trimmed);
                if (trimmed && !isError) {
                    cachedProjectID = trimmed;

                    const runtime = Scratch.runtime;
                    if (runtime && runtime.vm) {
                        runtime.vm.extensionState['IkeEmailTwofa'] ||= {};
                        runtime.vm.extensionState['IkeEmailTwofa']['projectID'] = trimmed;
                    }

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
                const body = {
                    email: args.EMAIL,
                    project_id: args.PROJECT_ID,
                    preset: emailPreset
                };

                if (customHTML && customEmailSettings) {
                    body.custom_html = customHTML;
                }

                if (customEmailSettings) {
                    body.custom_email = customEmailSettings.email;
                    body.custom_pass = customEmailSettings.pass;
                    body.custom_smtp = customEmailSettings.smtp;
                    body.custom_port = customEmailSettings.port;
                }

                const response = await fetch('https://ikelene.ca/api/2fa/send_code.php', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(body)
                });
                const result = await response.text();
                if (!response.ok) throw new Error(result);
                console.log("2FA send success:", result);
            } catch (e) {
                console.error("2FA send error:", e);
                throw e;
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
