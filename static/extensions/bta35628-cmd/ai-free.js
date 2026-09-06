(function (Scratch) {
    'use strict';

    // =========================================================
    // puterAI - PenguinMod Extension
    // =========================================================

    if (!Scratch.extensions.unsandboxed) {
        throw new Error(
            'Tiện ích puterAI cần bật chế độ Unsandboxed để hoạt động!'
        );
    }

    let puterLoading = null;

    // =========================================================
    // LOAD PUTER.JS
    // =========================================================

    function loadPuterScript() {
        // Đã có Puter
        if (window.puter && window.puter.ai) {
            return Promise.resolve(window.puter);
        }

        // Đang load -> dùng chung Promise
        if (puterLoading) {
            return puterLoading;
        }

        puterLoading = new Promise(function (resolve, reject) {
            // Kiểm tra lần nữa
            if (window.puter && window.puter.ai) {
                resolve(window.puter);
                return;
            }

            const script = document.createElement('script');

            script.src = 'https://js.puter.com/v2/';

            script.onload = function () {
                if (window.puter && window.puter.ai) {
                    resolve(window.puter);
                } else {
                    reject(
                        new Error(
                            'Puter.js đã tải nhưng window.puter.ai không tồn tại.'
                        )
                    );
                }
            };

            script.onerror = function () {
                reject(
                    new Error(
                        'Không thể tải Puter.js từ https://js.puter.com/v2/'
                    )
                );
            };

            document.head.appendChild(script);
        });

        return puterLoading;
    }

    // =========================================================
    // GET RESPONSE TEXT
    // =========================================================

    function getResponseText(response) {
        if (!response) {
            return '';
        }

        // OpenAI-compatible normalized response
        if (
            response.message &&
            typeof response.message.content === 'string'
        ) {
            return response.message.content;
        }

        // Một số response có content trực tiếp
        if (typeof response.content === 'string') {
            return response.content;
        }

        // Fallback
        if (typeof response === 'string') {
            return response;
        }

        try {
            return JSON.stringify(response);
        } catch (e) {
            return String(response);
        }
    }

    // =========================================================
    // EXTENSION
    // =========================================================

    class PuterAIExtension {

        getInfo() {
            return {
                id: 'bta35628cmdputerai',

                name: 'puterAI',

                color1: '#6a0eab',
                color2: '#520b85',
                color3: '#3d0764',

                blocks: [

                    // -----------------------------------------
                    // BASIC CHAT
                    // -----------------------------------------

                    {
                        opcode: 'askAI',

                        blockType: Scratch.BlockType.REPORTER,

                        text: 'Send the question [PROMPT] to puterAI',

                        arguments: {
                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'hi'
                            }
                        }
                    },

                    // -----------------------------------------
                    // CHAT WITH MODEL
                    // -----------------------------------------

                    {
                        opcode: 'askAIModel',

                        blockType: Scratch.BlockType.REPORTER,

                        text: 'Ask [PROMPT] with the [MODEL] model',

                        arguments: {

                            PROMPT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'hi'
                            },

                            MODEL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'models',
                                defaultValue: 'gpt-5.6-luna'
                            }
                        }
                    }
                ],

                menus: {

                    models: {

                        acceptReporters: true,

                        items: [
                            'gpt-5.6-luna',
                            'gpt-5-nano',
                            'claude-sonnet-4-6',
                            'gemini-3.1-flash-lite',
                            'deepseek-chat'
                        ]
                    }
                }
            };
        }

        // =====================================================
        // ASK AI
        // =====================================================

        async askAI(args) {

            try {

                await loadPuterScript();

                const prompt = String(args.PROMPT);

                // GIỮ NGUYÊN API PUTER
                const response =
                    await window.puter.ai.chat(prompt);

                return getResponseText(response);

            } catch (error) {

                console.error(
                    '[puterAI] askAI error:',
                    error
                );

                return 'Lỗi: ' + (
                    error && error.message
                        ? error.message
                        : String(error)
                );
            }
        }

        // =====================================================
        // ASK AI WITH MODEL
        // =====================================================

        async askAIModel(args) {

            try {

                await loadPuterScript();

                const prompt =
                    String(args.PROMPT);

                const model =
                    String(args.MODEL);

                // GIỮ NGUYÊN window.puter.ai.chat(...)
                const response =
                    await window.puter.ai.chat(
                        prompt,
                        {
                            model: model,
                            normalize: true
                        }
                    );

                return getResponseText(response);

            } catch (error) {

                console.error(
                    '[puterAI] askAIModel error:',
                    error
                );

                return 'Lỗi: ' + (
                    error && error.message
                        ? error.message
                        : String(error)
                );
            }
        }
    }

    // =========================================================
    // REGISTER
    // =========================================================

    Scratch.extensions.register(
        new PuterAIExtension()
    );

})(Scratch);
