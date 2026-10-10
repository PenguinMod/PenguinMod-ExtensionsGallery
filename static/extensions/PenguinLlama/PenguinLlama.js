(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Penguin Llama cần chạy ở chế độ unsandboxed.');
    }

    class PenguinLlama {
        constructor() {
            this.proxy = 'https://cj2api.keh5.workers.dev/v1/';
            this.model = 'llama3.1-8B';

            // Lịch sử của ask ai thông thường
            this.mainHistory = [];

            // Các chatbot riêng
            this.chatbots = {};

            this.lastAnswer = '';
        }

        getInfo() {
            return {
                id: 'penguinllama',
                name: 'Penguin Llama',

                color1: '#000000',
                color2: '#333333',
                color3: '#000000',

                menuIconURI:
                    'data:image/png;base64,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',
                
                blocks: [
                    {
                        opcode: 'setProxy',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set reverse proxy AI [URL]',
                        arguments: {
                            URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'https://cj2api.keh5.workers.dev/v1/'
                            }
                        }
                    },

                    {
                        opcode: 'askAI',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ask ai [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello!'
                            }
                        }
                    },

                    {
                        opcode: 'createChatbot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create chatbot name [NAME]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'MyBot'
                            }
                        }
                    },

                    {
                        opcode: 'askChatbot',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'ask ai [TEXT] chatbot name [NAME]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello!'
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'MyBot'
                            }
                        }
                    },

                    {
                        opcode: 'resetChatbot',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset chat history chatbot name [NAME]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'MyBot'
                            }
                        }
                    },

                    {
                        opcode: 'historyChatbot',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'history chatbot name [NAME]',
                        arguments: {
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'MyBot'
                            }
                        }
                    },

                    {
                        opcode: 'setModel',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set model to [MODEL]',
                        arguments: {
                            MODEL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'models',
                                defaultValue: 'llama3.1-8B'
                            }
                        }
                    },

                    // =========================
                    // GENERATE IMAGE
                    // =========================
                    {
                        opcode: 'generateImage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'generate image [PROMPT]',
                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'a cute penguin'
                            }
                        }
                    }
                ],

                menus: {
                    models: {
                        acceptReporters: true,
                        items: [
                            'llama3.1-8B'
                        ]
                    }
                }
            };
        }

        setProxy(args) {
            let url = String(args.URL || '').trim();

            if (!url) return;

            if (!url.endsWith('/')) {
                url += '/';
            }

            this.proxy = url;
        }

        setModel(args) {
            const model = String(args.MODEL || '').trim();

            if (model) {
                this.model = model;
            }
        }

        normalizeEndpoint() {
            let base = this.proxy.trim();

            if (!base.endsWith('/')) {
                base += '/';
            }

            if (base.endsWith('chat/completions/')) {
                return base.slice(0, -1);
            }

            return base + 'chat/completions';
        }

        async requestAI(history) {
            const endpoint = this.normalizeEndpoint();

            const response = await fetch(endpoint, {
                method: 'POST',

                headers: {
                    'Content-Type': 'application/json'
                },

                body: JSON.stringify({
                    model: this.model,
                    messages: history,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                const errorText = await response
                    .text()
                    .catch(() => '');

                throw new Error(
                    `HTTP ${response.status}` +
                    (errorText ? ': ' + errorText : '')
                );
            }

            const data = await response.json();

            if (
                data &&
                data.choices &&
                data.choices[0] &&
                data.choices[0].message
            ) {
                return String(
                    data.choices[0].message.content || ''
                );
            }

            if (typeof data.content === 'string') {
                return data.content;
            }

            if (typeof data.response === 'string') {
                return data.response;
            }

            if (typeof data.text === 'string') {
                return data.text;
            }

            throw new Error(
                'Proxy không trả về nội dung AI hợp lệ.'
            );
        }

        async askAI(args) {
            const text = String(args.TEXT || '');

            if (!text.trim()) {
                return '';
            }

            this.mainHistory.push({
                role: 'user',
                content: text
            });

            try {
                const answer = await this.requestAI(
                    this.mainHistory
                );

                this.mainHistory.push({
                    role: 'assistant',
                    content: answer
                });

                this.lastAnswer = answer;

                return answer;
            } catch (error) {
                this.mainHistory.pop();

                return `Lỗi: ${error.message}`;
            }
        }

        createChatbot(args) {
            const name = String(args.NAME || '').trim();

            if (!name) {
                return;
            }

            if (!this.chatbots[name]) {
                this.chatbots[name] = {
                    history: []
                };
            }
        }

        async askChatbot(args) {
            const text = String(args.TEXT || '');
            const name = String(args.NAME || '').trim();

            if (!name || !text.trim()) {
                return '';
            }

            // Nếu chatbot chưa tồn tại thì tự tạo
            if (!this.chatbots[name]) {
                this.chatbots[name] = {
                    history: []
                };
            }

            const bot = this.chatbots[name];

            bot.history.push({
                role: 'user',
                content: text
            });

            try {
                const answer = await this.requestAI(
                    bot.history
                );

                bot.history.push({
                    role: 'assistant',
                    content: answer
                });

                return answer;
            } catch (error) {
                bot.history.pop();

                return `Lỗi: ${error.message}`;
            }
        }

        resetChatbot(args) {
            const name = String(args.NAME || '').trim();

            if (!name) {
                return;
            }

            if (this.chatbots[name]) {
                this.chatbots[name].history = [];
            } else {
                this.chatbots[name] = {
                    history: []
                };
            }
        }

        historyChatbot(args) {
            const name = String(args.NAME || '').trim();

            if (!name || !this.chatbots[name]) {
                return '';
            }

            const history = this.chatbots[name].history;

            return history
                .map(message => {
                    const role =
                        message.role === 'user'
                            ? 'User'
                            : 'Assistant';

                    return `${role}: ${message.content}`;
                })
                .join('\n');
        }

        // ==========================================
        // GENERATE IMAGE
        // ==========================================
        generateImage(args) {
            const prompt = String(args.PROMPT || '').trim();

            if (!prompt) {
                return '';
            }

            const encodedPrompt =
                encodeURIComponent(prompt);

            return `https://image.pollinations.ai/prompt/${encodedPrompt}`;
        }
    }

    Scratch.extensions.register(
        new PenguinLlama()
    );

})(Scratch);