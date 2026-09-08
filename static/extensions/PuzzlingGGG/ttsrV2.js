// name: Text To Speech: Redone
// credit: PuzzlingGGG
// description: Create better text to speech

(function(Scratch) {
    "use strict";

    let dev = false; // set to true to enable dev prints

    function devpr(txt) {
        if (dev) {console.log(txt);}
    }

    let cache = {};

    class Speech {
        constructor(speed, pitch, speech, voice, combinator) { // combinator is another instance of speech that'll be combined with this one to form conversation and more complex speech
            if (!(combinator instanceof Speech) && combinator != undefined) {
                throw new Error("combinator must be Speech or undefined");
            }
            this.speed = speed;
            this.pitch = pitch;
            this.text = speech;
            this.voice = voice;
            this.combinator = combinator;
        }
        toString() {
            let comb = "";
            if (this.combinator) {
                comb = " with " + this.combinator.toString();
            }
            return `Speech(${this.speed}, ${this.pitch}, ${this.text}, ${this.voice} ${comb})`;
        }
        conv(txt) {
            if (txt === "normal") return "medium";
            return txt.replace("super ", "x-");
        }
        escapeXml(txt) {
            return String(txt)
                .replaceAll("&", "&amp;")
                .replaceAll("<", "&lt;")
                .replaceAll(">", "&gt;")
                .replaceAll('"', "&quot;")
                .replaceAll("'", "&apos;");
        }
        makeObj(voicelangs) {
            let spd = this.conv(this.speed);
            let ptch = this.conv(this.pitch);
            let vce = this.voice;
            let txt = this.escapeXml(this.text);
            let lang = voicelangs[vce];
            let xml = `<speak version=\"1.0\" xml:lang="${lang}"><prosody rate="${spd}" pitch="${ptch}">${txt}</prosody></speak>`;
            return {voiceId: vce, ssml: xml}
        }
        makeReqArr(voicelangs) {
            const arr = [];
            let current = this;
            while (current) {
                arr.push(current.makeObj(voicelangs));
                current = current.combinator;
            }

            devpr(JSON.stringify(arr));

            return arr;
        }
    }

    class ttsrV2 {
        constructor() {
            this.voices = ["..."];
            this.voicelangs = {};
            this.fetching = false; // cuz for some reason blockly calls it like 3 times aaaand we dont want that!
            this.audioPlayer = new Audio();
        }
        getInfo() {
            return {
                id: "puzzlinggggttsrv2",
                name: "Text to Speech: Redone",
                color1: "#1be758",
                color2: "#22c24a",
                color3: "#3c813f",
                blockText: "#000000",
                blocks: [
                    /* old dev stuff
                    {
                        opcode: "menutest",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "menu test [MENU]",
                        arguments: {
                            MENU: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "speed",
                                defaultValue: "normal"
                            }
                        }
                    },
                    {
                        opcode: "speechtestclass",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        text: "speech test class [SPEED] [TEXT]",
                        arguments: {
                            SPEED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "speed",
                                defaultValue: "normal"
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "hello world"
                            }
                        }
                    },
                    {
                        opcode: "isspeechtest",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is [SPEECH] speech class?",
                        arguments: {
                            SPEECH: {
                                type: Scratch.ArgumentType.STRING,
                                exemptFromNormalization: true
                            }
                        }
                    },
                    {
                        opcode: "voicemenutest",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        text: "get voices [VOICEMENU]",
                        arguments: {
                            VOICEMENU: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "voices",
                                defaultValue: "ababababa"
                            }
                        }
                    },
                    {
                        opcode:"requestarr",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "make request array from [SPEECH]",
                        arguments: {
                            SPEECH: {
                                type: Scratch.ArgumentType.STRING,
                                exemptFromNormalization: true
                            }
                        }
                    },
                    */
                    {
                        opcode: "credit",
                        blockType: Scratch.BlockType.BUTTON,
                        text: "credits"
                    },
                    {
                        opcode: "makespeechpart",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.PLUS,
                        text: "make speech part with speed [SPEED] pitch [PITCH] text [TEXT] using voice [VOICE] with [COMBINATION]",
                        arguments: {
                            SPEED: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "speed",
                                defaultValue: "normal"
                            },
                            PITCH: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "pitch",
                                defaultValue: "normal"
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Joe"
                            },
                            VOICE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "voices",
                                defaultValue: "Amazon US English (Joey)"
                            },
                            COMBINATION: {
                                exemptFromNormalization: true,
                                shape: Scratch.BlockShape.PLUS
                            }
                        }
                    },
                    "---",
                    {
                        opcode: "speak",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "speak [SPEECH]",
                        arguments: {
                            SPEECH: {
                                exemptFromNormalization: true,
                                shape: Scratch.BlockShape.PLUS
                            }
                        }
                    },
                    {
                        opcode: "speakwait",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "speak [SPEECH] and wait",
                        arguments: {
                            SPEECH: {
                                exemptFromNormalization: true,
                                shape: Scratch.BlockShape.PLUS
                            }
                        }
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "advanced blocks"
                    },
                    {
                        opcode: "datauri",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "data uri of [SPEECH]",
                        arguments: {
                            SPEECH: {
                                exemptFromNormalization: true,
                                shape: Scratch.BlockShape.PLUS
                            }
                        }
                    },
                    {
                        opcode: "cache",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "add [SPEECH] to cache",
                        arguments: {
                            SPEECH: {
                                exemptFromNormalization: true,
                                shape: Scratch.BlockShape.PLUS
                            }
                        }
                    },
                    {
                        opcode: "clearcache",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "clear cache"
                    }
                ],
                menus: {
                    speed: {
                        acceptReporters: true,
                        items: ["super slow", "slow", "normal", "fast", "super fast"]
                    },
                    pitch: {
                        acceptReporters: true,
                        items: ["super low", "low", "normal", "high", "super high"]
                    },
                    voices: {
                        acceptReporters: true,
                        items: "getVoices"
                    }
                }
            }
        }
        menutest(args) {
            return args.MENU;
        }
        speechtestclass(args) {
            return new Speech(args.SPEED, args.TEXT, "abababa");
        }
        isspeechtest(args) {
            return (args.SPEECH instanceof Speech);
        }
        getVoices() {
            if (this.voices[0] == "...") {
                devpr("no voices loaded");
                void this.fetchVoices(); // just found out about this! cool!
            }
            return this.voices;
        }
        async fetchVoices() { // i hate promises :(
            if (this.fetching) {
                devpr("already fetching voices");
                return;
            }
            this.fetching = true;
            devpr("fetching voices");
            fetch("https://support.readaloud.app/read-aloud/list-voices/premium").catch((e) => {alert("!!HORRIBLE ERROR!! cannot fetch voices: " + e)}).then((response) => {
                console.log("got response for voices " + response);
                if (!response.ok) {
                    alert("!!HORRIBLE ERROR!! cannot fetch voices response was not ok");
                }
                response.json().then((data) => {
                    this.voices = [];
                    for (const voice of data) {
                        devpr("got voice " + voice.voiceName + " " + voice.lang + " " + voice.gender);
                        this.voices.push(voice.voiceName);
                        this.voicelangs[voice.voiceName] = voice.lang;
                    }
                });
            });
        }
        voicemenutest(args) {
            return args.VOICEMENU;
        }
        makespeechpart(args) {
            let combinator = undefined;

            if (args.COMBINATION instanceof Speech) {
                combinator = args.COMBINATION;
            } else if (args.COMBINATION != null && args.COMBINATION !== "") {
                throw new Error("final input must be a speech part or left empty");
            }

            return new Speech(args.SPEED, args.PITCH, args.TEXT, args.VOICE, combinator);
        }
        requestarr(args) {
            return JSON.stringify(args.SPEECH.makeReqArr(this.voicelangs));
        }
        play(blob) {
            return new Promise((resolve, reject) => {
                devpr("audio blob type: " + blob.type);
                devpr("audio blob size: " + blob.size);

                const url = URL.createObjectURL(blob);

                this.audioPlayer.pause();
                this.audioPlayer.currentTime = 0;
                this.audioPlayer.src = url;

                this.audioPlayer.onended = () => {
                    URL.revokeObjectURL(url);
                    resolve();
                };

                this.audioPlayer.onerror = () => {
                    URL.revokeObjectURL(url);
                    reject(this.audioPlayer.error);
                };

                this.audioPlayer.play().catch((e) => {
                    URL.revokeObjectURL(url);
                    reject(e);
                });
            });
        }
        async speakwait(args) {
            devpr(cache);

            if (!(args.SPEECH instanceof Speech)) {
                throw new Error("input must be a speech part");
            }
            const key = args.SPEECH.toString();

            if (cache[key] != undefined) {
                const blob = cache[key];
                await this.play(blob);
                return;
            }
            const arr = args.SPEECH.makeReqArr(this.voicelangs);
            const makeparts = await fetch("https://support.readaloud.app/ttstool/createParts", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(arr)
            });

            if (!makeparts.ok) {
                throw new Error("cannot create speech response was not ok");
            }

            const audioids = await makeparts.json();
            devpr("got audio ids " + JSON.stringify(audioids));

            const audio = await fetch(
                "https://support.readaloud.app/ttstool/getParts?q=" + audioids.join(",")
            );

            if (!audio.ok) {
                throw new Error("cannot get speech response was not ok");
            }

            const blob = await audio.blob();

            cache[key] = blob;

            await this.play(blob);
        }
        speak(args) {
            void this.speakwait(args); // same thing but no waiting. taht code is a mess soo just reuse it??
        }
        makedatauri(blob) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject(reader.error);
                };
                reader.readAsDataURL(blob);
            });
        }
        async datauri(args) {
            if (!(args.SPEECH instanceof Speech)) {
                throw new Error("input must be a speech part");
            }
            const key = args.SPEECH.toString();
            if (cache[key] != undefined) {
                const blob = cache[key];
                return this.makedatauri(blob);
            }
            const arr = args.SPEECH.makeReqArr(this.voicelangs);
            const makeparts = await fetch("https://support.readaloud.app/ttstool/createParts", {
                method: "POST",
                headers: {"Content-Type": "application/json"},
                body: JSON.stringify(arr)
            });
            if (!makeparts.ok) {
                throw new Error("cannot create speech response was not ok");
            }
            const audioids = await makeparts.json();
            devpr("got audio ids " + JSON.stringify(audioids));
            const audio = await fetch(
                "https://support.readaloud.app/ttstool/getParts?q=" + audioids.join(",")
            );
            if (!audio.ok) {
                throw new Error("cannot get speech response was not ok");
            }
            const blob = await audio.blob();
            cache[key] = blob;
            return this.makedatauri(blob);
        }
        credit() {
            alert("Text To Speech: Redone by PuzzlingGGG\nUses TTSTools's TTS API (https://ttstool.com) created by LSD Software (https://www.lsdsoftware.com/)");
        }
        async cache(args) {
            if (!(args.SPEECH instanceof Speech)) {
                throw new Error("input must be a speech part");
            }
            await this.datauri(args); // already has caching so use that and ignore the output
        }
        clearcache() {
            cache = {};
        }
    }

    Scratch.extensions.register(new ttsrV2());
})(Scratch);
