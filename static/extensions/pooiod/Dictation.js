// Name: Dictation
// ID: pooiod7Dictation
// Version: 2
// Description: 
// By: pooiod7 <https://scratch.mit.edu/users/pooiod7/>
// Builds: main
// Unsandboxed: true
// WIP: false
// Created: May 17, 2024

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) throw new Error('Dictation Must Run Unsandboxed!');

    class pooiod7Dictation {
        constructor() {
            this.recognizedSpeech = "";
            this.cando = typeof scaffolding !== "undefined";

            this.continuousRecognition = null;
            this.isContinuousActive = false;
            this.currentResult = "";
            this.fullResult = "";
            this.isListening = false;

            (function () {
                if (window.SpeechRecognition || window.webkitSpeechRecognition) {
                    return;
                }

                class SpeechRecognitionPolyfill {
                    constructor() {
                        this.continuous = false;
                        this.interimResults = false;
                        this.lang = 'en-US';
                        this.onresult = null;
                        this.onend = null;
                        this.onerror = null;
                        this.onstart = null;

                        this._audioContext = null;
                        this._mediaStream = null;
                        this._recognizer = null;
                        this._model = null;
                        this._processor = null;
                        this._isListening = false;
                        this._loadedModelUrl = "";
                        this.modelUrl = "https://ccoreilly.github.io/vosk-browser/models/vosk-model-small-en-us-0.15.tar.gz";

                        this.isLoadedScript = false;
                        (async () => {
                            if (!window.Vosk) {
                                await this._loadScript("https://cdn.jsdelivr.net/npm/vosk-browser@0.0.8/dist/vosk.js");

                                if (!window._voskModelShared || this._loadedModelUrl !== this.modelUrl) {
                                    window._voskModelShared = await Vosk.createModel(this.modelUrl);
                                    this._loadedModelUrl = this.modelUrl;
                                }

                                this._model = window._voskModelShared;
                                this.isLoadedScript = true;
                            }
                        })();
                    }

                    async _loadScript(src) {
                        return new Promise((resolve, reject) => {
                            const script = document.createElement("script");
                            script.src = src;
                            script.onload = resolve;
                            script.onerror = reject;
                            document.head.appendChild(script);
                        });
                    }

                    _fireError(type, message) {
                        if (this.onerror) {
                            this.onerror({ error: type, message: message });
                        }
                    }

                    async start() {
                        if (this._isListening) return;
                        this._isListening = true;

                        if (!window.Vosk) {
                            this._isListening = false;
                            this._fireError("not-loaded", "The dictation api has not been loaded yet");
                            if (this.onend) this.onend();
                        }

                        try {
                            if (!window._voskModelShared || this._loadedModelUrl !== this.modelUrl) {
                                window._voskModelShared = await Vosk.createModel(this.modelUrl);
                                this._loadedModelUrl = this.modelUrl;
                            }
                            this._model = window._voskModelShared;

                            this._mediaStream = await navigator.mediaDevices.getUserMedia({
                                audio: {
                                    echoCancellation: true,
                                    noiseSuppression: true,
                                    channelCount: 1,
                                    sampleRate: 16000
                                }
                            });

                            this._audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
                            const source = this._audioContext.createMediaStreamSource(this._mediaStream);

                            this._recognizer = new this._model.KaldiRecognizer(16000);

                            if (this.onstart) this.onstart();

                            this._recognizer.on("result", (message) => {
                                const result = message.result;
                                if (result && result.text && this.onresult) {
                                    this._emitResult(result.text, true);
                                }
                                if (!this.continuous) {
                                    this.stop();
                                }
                            });

                            this._recognizer.on("partialresult", (message) => {
                                const partial = message.result;
                                if (partial && partial.partial && this.interimResults && this.onresult) {
                                    this._emitResult(partial.partial, false);
                                }
                            });

                            this._processor = this._audioContext.createScriptProcessor(4096, 1, 1);
                            source.connect(this._processor);
                            this._processor.connect(this._audioContext.destination);

                            this._processor.onaudioprocess = (e) => {
                                if (!this._isListening) return;
                                try {
                                    this._recognizer.acceptWaveform(e.inputBuffer);
                                } catch (err) {}
                            };

                        } catch (err) {
                            this._isListening = false;
                            this._fireError("not-allowed", err.message);
                            if (this.onend) this.onend();
                        }
                    }

                    _emitResult(text, isFinal) {
                        const mockEvent = {
                            resultIndex: 0,
                            results: [
                                [{
                                    transcript: text,
                                    confidence: 1.0
                                }]
                            ]
                        };
                        mockEvent.results[0].isFinal = isFinal;
                        this.onresult(mockEvent);
                    }

                    stop() {
                        if (!this._isListening) return;
                        this._isListening = false;

                        if (this._processor) {
                            this._processor.onaudioprocess = null;
                            try { this._processor.disconnect(); } catch (e) {}
                        }
                        if (this._mediaStream) {
                            this._mediaStream.getTracks().forEach(track => track.stop());
                        }
                        if (this._audioContext && this._audioContext.state !== 'closed') {
                            this._audioContext.close();
                        }

                        if (this.onend) {
                            this.onend();
                        }
                    }
                }

                window.SpeechRecognition = SpeechRecognitionPolyfill;
                window.webkitSpeechRecognition = SpeechRecognitionPolyfill;
            })();
        }

        getInfo() {
            return {
                id: 'pooiod7Dictation',
                name: 'Dictation',
                color1: '#b969cf',
                color2: '#9253a3',
                blocks: [
                    {
                        opcode: 'canUse',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'dictation ready',
                        hideFromPalette: false,
                    },
                    {
                        opcode: 'isRecognizingSpeech',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'recognizing speech',
                    },

                    {
                        opcode: 'WaitAndrecognizeSpeech',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'recognize speech and wait',
                    },
                    {
                        opcode: 'getRecognizedSpeech',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'last recognized speech',
                    },
                    {
                        opcode: 'GetSpeech',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'wait for recognized speech',
                        disableMonitor: true,
                    },

                    "---",

                    {
                        opcode: 'startContinuous',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'start continuous recognition',
                    },
                    {
                        opcode: 'stopContinuous',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop continuous recognition',
                    },

                    {
                        opcode: 'getCurrentContinuous',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get part of recognition',
                    }
                ]
            };
        }

        isRecognizingSpeech() {
            return this.isListening;
        }

        WaitAndrecognizeSpeech() {
            return this.recognizeSpeech(false);
        }

        canUse() {
            return window.webkitSpeechRecognition !== undefined;
        }

        getRecognizedSpeech() {
            return this.fullResult || this.recognizedSpeech || "";
        }

        GetSpeech() {
            return this.recognizeSpeech(true);
        }

        recognizeSpeech(show) {
            if (!this.canUse()) return Promise.resolve("");
            if (!this.cando) this.cando = window.confirm("Do you want to share your speech as text?");

            if (this.cando) {
                return new Promise(resolve => {
                    this.recognizedSpeech = "";
                    this.fullResult = "";
                    this.currentResult = "";

                    const recognition = new webkitSpeechRecognition();

                    recognition.onstart = () => {
                        this.isListening = true;
                    };

                    recognition.onresult = event => {
                        if (event.results.length > 0) {
                            this.recognizedSpeech = event.results[0][0].transcript;
                            this.currentResult = this.recognizedSpeech;
                            if (show) resolve(this.recognizedSpeech);
                            else resolve("");
                        }
                    };

                    recognition.onerror = () => {
                        this.isListening = false;
                        resolve("");
                    };

                    recognition.onend = () => {
                        this.isListening = false;
                        resolve("");
                    };

                    try { recognition.start(); } catch(e) { resolve(""); }
                });
            }

            return Promise.resolve("");
        }

        startContinuous() {
            if (!this.canUse()) return;
            if (!this.cando) this.cando = window.confirm("Do you want to share your speech as text?");

            if (this.cando) {
                this.stopContinuous(); 

                this.currentResult = "";
                this.fullResult = "";
                this.isContinuousActive = true;

                this._startInternal();
            }
        }

        _startInternal() {
            if (!this.isContinuousActive) return;

            const recognition = new webkitSpeechRecognition();
            recognition.continuous = true;
            recognition.interimResults = true;

            recognition.onstart = () => {
                this.isListening = true;
            };

            const previousFull = this.fullResult;

            recognition.onresult = event => {
                let current = "";
                let sessionFull = "";

                for (let i = 0; i < event.results.length; i++) {
                    if (event.results[i].isFinal) {
                        sessionFull = event.results[i][0].transcript;
                    } else {
                        current += event.results[i][0].transcript;
                    }
                }

                let newFull = previousFull;
                if (newFull && sessionFull && !newFull.endsWith(" ") && !sessionFull.startsWith(" ")) {
                    newFull += " ";
                }
                newFull += sessionFull;

                this.fullResult = newFull;
                this.currentResult = current;
            };

            recognition.onend = () => {
                this.isListening = false;
                this.currentResult = "";

                if (this.isContinuousActive) {
                    this._startInternal();
                }
            };

            recognition.onerror = (e) => {
                this.isListening = false;
                if (e.error === 'not-allowed' || e.error === 'audio-capture') {
                    this.isContinuousActive = false;
                }
            };

            try {
                recognition.start();
                this.continuousRecognition = recognition;
            } catch(e) {
                this.continuousRecognition = null;
                this.isContinuousActive = false;
                this.isListening = false;
            }
        }

        stopContinuous() {
            this.isContinuousActive = false;
            this.isListening = false;

            if (this.continuousRecognition) {
                try {
                    this.continuousRecognition.stop();
                } catch(e) {}

                this.continuousRecognition = null;
            }

            this.currentResult = "";
        }

        getCurrentContinuous() {
            return this.currentResult ?? "";
        }
    }

    Scratch.extensions.register(new pooiod7Dictation());
})(Scratch);
