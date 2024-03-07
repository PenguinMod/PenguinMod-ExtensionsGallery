// Penguin Hook
// By MubiLop under MIT License, you can find it on choosealicense.com specifically on here: https://choosealicense.com/licenses/mit/
// I didn't see any extension with embed support so yeah i made it.

(function (Scratch) {

    class MubilopPenguinHook {
        'use strict'
        embedProperties = {};

        getInfo() {
            return {
                id: 'mubiloppenguinhook',
                name: 'PenguinHook',
                color1: "#02b4e0",
                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Discord'
                    },
                    {
                        opcode: 'sendWebhook',
                        text: 'send webhook with name [NAME] icon [IMAGEURL] message [MESSAGE] to webhook [WEBHOOK]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'user'
                            },
                            IMAGEURL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://example.com/image.jpg'
                            },
                            MESSAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello, world!'
                            },
                            WEBHOOK: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://your.webhook.url'
                            }
                        }
                    },
                    {
                        opcode: 'setHexColor',
                        text: 'set hex color to [COLOR]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            COLOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '#000000'
                            }
                        }
                    },
                    {
                        opcode: 'setName',
                        text: 'set name to [NAME]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'PenguinHook'
                            }
                        }
                    },
                    {
                        opcode: 'setTitle',
                        text: 'set embed title to [TITLE]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            TITLE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Title'
                            }
                        }
                    },
                    {
                        opcode: 'setDescription',
                        text: 'set embed description to [DESCRIPTION]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            DESCRIPTION: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Description'
                            }
                        }
                    },
                    {
                        opcode: 'setFooter',
                        text: 'set embed footer to [FOOTER]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            FOOTER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Footer'
                            }
                        }
                    },
                    {
                        opcode: 'sendWebhookWithEmbed',
                        text: 'send webhook with embeds to webhook [WEBHOOK]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            WEBHOOK: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://your.webhook.url'
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: 'Customizable Section'
                    },
                    {
                        opcode: 'sendjson',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'send using json [JSON_DATA] webhook url: [WEBHOOK]',
                        arguments: {
                            JSON_DATA: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"content": "Sent with JSON!!","embeds": null,"attachments": []}'
                            },
                            WEBHOOK: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://your.webhook.url'
                            }
                        }
                    }
                ]
            };
        }

        // New functions for setting individual embed properties
        setTitle(args) {
            this.embedProperties.title = Scratch.Cast.toString(args.TITLE);
        }

        setDescription(args) {
            this.embedProperties.description = Scratch.Cast.toString(args.DESCRIPTION);
        }

        setFooter(args) {
            this.embedProperties.footer = Scratch.Cast.toString(args.FOOTER);
        }

        setHexColor(args) {
            this.embedProperties.hexColor = Scratch.Cast.toString(args.COLOR);
        }

        setName(args) {
            this.embedProperties.name = Scratch.Cast.toString(args.NAME);
        }

        sendWebhook(args) {
            const { NAME, IMAGEURL, MESSAGE, WEBHOOK } = args;
            const name = Scratch.Cast.toString(NAME);
            const imageUrl = Scratch.Cast.toString(IMAGEURL);
            const message = Scratch.Cast.toString(MESSAGE);
            const webhookUrl = Scratch.Cast.toString(WEBHOOK);
            let nameReq;

            if (name) {
                nameReq = name;
            }

            if (!Scratch.canFetch(webhookUrl)) {
                return;
            }

            const payload = {
                username: nameReq,
                avatar_url: imageUrl,
                content: message
            };

            console.log(JSON.stringify(payload))

            return fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (!response.ok) {
                        console.error('Webhook request failed:', response.statusText);
                        return 'Webhook request failed';
                    }
                    return 'Webhook sent successfully';
                })
                .catch(error => {
                    console.error('Error sending webhook:', error);
                    return 'Error sending webhook';
                });
        }

        sendWebhookWithEmbed(args) {
            const embed = {};
            const name = {};

            if (this.embedProperties.title) {
                embed.title = Scratch.Cast.toString(this.embedProperties.title);
            }

            if (this.embedProperties.description) {
                embed.description = Scratch.Cast.toString(this.embedProperties.description);
            }

            if (this.embedProperties.footer) {
                embed.footer = { text: Scratch.Cast.toString(this.embedProperties.footer) };
            }

            if (this.embedProperties.name) {
                name.name = Scratch.Cast.toString(this.embedProperties.name);
            }

            const webhookUrl = Scratch.Cast.toString(args.WEBHOOK);
            const payload = {
                embeds: [embed],
                username: name.name,
            };

            if (!Scratch.canFetch(webhookUrl)) {
                return;
            }

            return fetch(webhookUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            })
                .then(response => {
                    if (!response.ok) {
                        console.error('Webhook request with embeds failed:', response.statusText);
                        return 'Webhook request with embeds failed';
                    }
                    return 'Webhook with embeds sent successfully';
                })
                .catch(error => {
                    console.error('Error sending webhook with embeds:', error);
                    return 'Error sending webhook with embeds';
                });
        }

        sendjson(args) {
            const webhookUrl = Scratch.Cast.toString(args.WEBHOOK);
            if (!Scratch.canFetch(webhookUrl)) {
                return;
            }
            
            try {
                return fetch(args.WEBHOOK, {
                    method: "POST",
                    headers: {
                        'Content-type': 'application/json'
                    },
                    body: Scratch.Cast.toString(args.JSON_DATA)
                }).then(res => {
                    console.log(res);
                })
            } catch (err) { }
        }
    }

    Scratch.extensions.register(new MubilopPenguinHook());
})(Scratch);
