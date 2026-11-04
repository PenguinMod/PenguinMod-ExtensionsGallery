(async function(Scratch) {
    const variables = {
        volume: 1.0,
        pitchShift: 0,
        leftRightValue: 0,
        selectedEffect: "none",
        isPlaying: false,
        instrument: "sine",
        instrumentID: 0,
        instrumentName: "without instrument",
        pauseDuration: 0.5
    };

    class MusicGenerator {
        constructor() {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.digitToFrequency = {
                "0": 261.63, // C4
                "1": 293.66, // D4
                "2": 329.63, // E4
                "3": 349.23, // F4
                "4": 392.00, // G4
                "5": 440.00, // A4
                "6": 493.88, // B4
                "7": 523.25, // C5
                "8": 587.33, // D5
                "9": 659.25  // E5
            };
            this.activeOscillators = [];
        }

        getFrequencyWithEffect(frequency) {
            if (variables.selectedEffect === "pitch") {
                return frequency * Math.pow(2, variables.pitchShift / 12);
            }
            return frequency;
        }

        playContinuousSequence(sequence, noteDuration = 0.3) {
            let currentTime = this.audioContext.currentTime;
            variables.isPlaying = true;

            sequence.split('').forEach((char) => {
                if (this.digitToFrequency[char] !== undefined) {
                    const frequency = this.getFrequencyWithEffect(this.digitToFrequency[char]);
                    this.playNoteAtTime(frequency, currentTime, noteDuration);
                    currentTime += noteDuration;
                } else if (char === ' ' || char === '_' || char === '.') {
                    currentTime += variables.pauseDuration;
                }
            });

            setTimeout(() => { variables.isPlaying = false; }, (currentTime - this.audioContext.currentTime) * 1000);
        }

        playNoteAtTime(frequency, startTime, duration) {
            const oscillator = this.audioContext.createOscillator();
            oscillator.type = variables.instrument;
            oscillator.frequency.setValueAtTime(frequency, startTime);

            const gainNode = this.audioContext.createGain();
            gainNode.gain.setValueAtTime(variables.volume * 0.1, startTime);

            let panNode;
            if (variables.selectedEffect === "left-right") {
                panNode = this.audioContext.createStereoPanner();
                panNode.pan.setValueAtTime(variables.leftRightValue, startTime);
                oscillator.connect(panNode);
                panNode.connect(gainNode);
            } else {
                oscillator.connect(gainNode);
            }

            gainNode.connect(this.audioContext.destination);
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
            this.activeOscillators.push(oscillator);
        }

        stopAllMusic() {
            this.activeOscillators.forEach(oscillator => oscillator.stop());
            this.activeOscillators = [];
            variables.isPlaying = false;
        }
    }

    const musicGen = new MusicGenerator();

    const extension = {
        getInfo() {
            return {
                blockIconURI: "data:image/png;base64,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",
                id: "musicDigitGenerator",
                name: "Music to Numbers",
                color1: "#0088ff",
                color2: "#0063ba",
                blocks: [
                    {
                        opcode: 'playDigitSequence',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'play note sequence for [sequence]',
                        arguments: {
                            sequence: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '1 2 3 . 4 _ 5'
                            }
                        }
                    },
                    {
                        opcode: 'setVolume',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set volume to [volume] (1-100)',
                        arguments: {
                            volume: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },
                    {
                        opcode: 'setEffect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [effectType] effect value to [value]',
                        arguments: {
                            effectType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'effectTypes',
                                defaultValue: 'pitch'
                            },
                            value: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },
                    {
                        opcode: 'changeEffect',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change [effectType] effect by [amount]',
                        arguments: {
                            effectType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'effectTypes',
                                defaultValue: 'pitch'
                            },
                            amount: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'getCurrentEffect',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current [effectType] effect',
                        arguments: {
                            effectType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'effectTypes',
                                defaultValue: 'pitch'
                            }
                        }
                    },
                    {
                        opcode: 'setPauseDuration',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set pause to [duration] seconds',
                        arguments: {
                            duration: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            }
                        }
                    },
                    {
                        opcode: 'changePauseDuration',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'change pause by [amount] seconds',
                        arguments: {
                            amount: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.1
                            }
                        }
                    },
                    {
                        opcode: 'getCurrentPause',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current pause duration',
                    },
                    {
                        opcode: 'setInstrument',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set instrument to [instrument]',
                        arguments: {
                            instrument: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'instruments',
                                defaultValue: 'without instrument'
                            }
                        }
                    },
                    {
                        opcode: 'getCurrentInstrument',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current instrument [returnType]',
                        arguments: {
                            returnType: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'returnTypes',
                                defaultValue: 'name'
                            }
                        }
                    },
                    {
                        opcode: 'isMusicPlaying',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'music playing now?'
                    },
                    {
                        opcode: 'stopMusic',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop music'
                    }
                ],
                menus: {
                    effectTypes: {
                        acceptReporters: true,
                        items: ['pitch', 'left-right']
                    },
                    instruments: {
                        acceptReporters: true,
                        items: ['without instrument', 'piano', 'organ']
                    },
                    returnTypes: {
                        acceptReporters: true,
                        items: ['name', 'number']
                    }
                }
            };
        },

        playDigitSequence(args) {
            const sequence = args.sequence;
            musicGen.playContinuousSequence(sequence);
        },

        setVolume(args) {
            variables.volume = Math.max(0, Math.min(1, args.volume / 100));
        },

        setEffect(args) {
            variables.selectedEffect = args.effectType;
            if (args.effectType === "pitch") {
                variables.pitchShift = args.value;
            } else if (args.effectType === "left-right") {
                variables.leftRightValue = Math.max(-1, Math.min(1, args.value));
            }
        },

        changeEffect(args) {
            if (args.effectType === "pitch") {
                variables.pitchShift += args.amount;
            } else if (args.effectType === "left-right") {
                variables.leftRightValue = Math.max(-1, Math.min(1, variables.leftRightValue + args.amount));
            }
        },

        getCurrentEffect(args) {
            if (args.effectType === "pitch") {
                return variables.pitchShift;
            } else if (args.effectType === "left-right") {
                return variables.leftRightValue;
            }
            return 0;
        },

        setPauseDuration(args) {
            variables.pauseDuration = Math.max(0, args.duration);
        },

        changePauseDuration(args) {
            variables.pauseDuration = Math.max(0, variables.pauseDuration + args.amount);
        },

        getCurrentPause() {
            return variables.pauseDuration;
        },

        getCurrentInstrument(args) {
            return args.returnType === "name" ? variables.instrumentName : variables.instrumentID;
        },
        
        setInstrument(args) {
            switch (args.instrument) {
                case 'piano':
                    variables.instrument = 'triangle';
                    variables.instrumentID = 1;
                    variables.instrumentName = 'piano';
                    break;
                case 'organ':
                    variables.instrument = 'square';
                    variables.instrumentID = 2;
                    variables.instrumentName = 'organ';
                    break;
                default:
                    variables.instrument = 'sine';
                    variables.instrumentID = 0;
                    variables.instrumentName = 'without instrument';
            }
        },
        
        isMusicPlaying() {
            return variables.isPlaying;
        },

        stopMusic() {
            musicGen.stopAllMusic();
        }
    };

    Scratch.extensions.register(extension);
})(Scratch);
