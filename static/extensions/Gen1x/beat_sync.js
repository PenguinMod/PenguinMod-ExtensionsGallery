(function(Scratch) {
    'use strict';

    const isPenguinMod = Scratch.extensions.isPenguinMod;

    class BeatSync {
        constructor() {
            this.bpm = 120;
            this.isRunning = false;
            this.autoStart = false;
            this.beatsPerMeasure = 4;

            this.totalBeats = 0;
            this.beatPosition = 0;

            this.audioCtx = null;
            this.startAudioTime = 0;
            this.pausedElapsed = 0;

            this.vmEventBound = false;

            this.loadAutoStart();
        }

        loadAutoStart() {
            if (!isPenguinMod) {
                try {
                    const vm = Scratch.vm;
                    const storage = vm.runtime.extensionStorage?.beatSync;
                    if (storage && typeof storage.autoStart === 'boolean') {
                        this.autoStart = storage.autoStart;
                    }
                } catch (e) {
                }
            }
        }

        saveAutoStart() {
            if (!isPenguinMod) {
                try {
                    const vm = Scratch.vm;
                    if (!vm.runtime.extensionStorage) {
                        vm.runtime.extensionStorage = {};
                    }
                    if (!vm.runtime.extensionStorage.beatSync) {
                        vm.runtime.extensionStorage.beatSync = {};
                    }
                    vm.runtime.extensionStorage.beatSync.autoStart = this.autoStart;
                } catch (e) {
                }
            }
        }

        serialize() {
            if (isPenguinMod) {
                return {
                    autoStart: this.autoStart
                };
            }
            return {};
        }

        deserialize(data) {
            if (isPenguinMod && data) {
                if (typeof data.autoStart === 'boolean') {
                    this.autoStart = data.autoStart;
                }
            }
        }

        getAudioCtx() {
            if (this.audioCtx) {
                return this.audioCtx;
            }

            let scratchCtx = null;
            try {
                const vm = Scratch.vm;
                scratchCtx =
                    vm?.runtime?.audioEngine?.audioContext ||
                    vm?.runtime?.scratch?.audioEngine?.audioContext ||
                    vm?.audioEngine?.audioContext ||
                    null;
            } catch (e) {
            }

            this.audioCtx = scratchCtx || new(window.AudioContext || window.webkitAudioContext)();
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
            return this.audioCtx;
        }

        getLatencySeconds() {
            const ctx = this.getAudioCtx();
            return (ctx.baseLatency || 0) + (ctx.outputLatency || 0);
        }

        getElapsedSeconds() {
            if (!this.isRunning) return this.pausedElapsed;
            const ctx = this.getAudioCtx();
            return this.pausedElapsed + (ctx.currentTime - this.startAudioTime) + this.getLatencySeconds();
        }

        tick() {
            if (!this.isRunning) return;
            const elapsed = this.getElapsedSeconds();
            const secondsPerBeat = 60 / this.bpm;
            this.totalBeats = elapsed / secondsPerBeat;
            this.beatPosition = this.totalBeats % 1;
        }

        setupVMEvents() {
            if (this.vmEventBound) return;
            this.vmEventBound = true;

            const vm = Scratch.vm;
            
            vm.on('BEFORE_EXECUTE', () => {
                this.tick();
            });

            if (isPenguinMod) {
                vm.runtime.on('RUNTIME_STEP_START', () => {
                    this.tick();
                });
            }
        }

        updateTime() {
            if (!this.isRunning) return;
            const elapsed = this.getElapsedSeconds();
            const secondsPerBeat = 60 / this.bpm;
            this.totalBeats = elapsed / secondsPerBeat;
            this.beatPosition = this.totalBeats % 1;
        }

        getInfo() {
            return {
                id: 'beatSync',
                name: 'Beat Sync',
                color1: '#790612',
                blocks: [
                    {
                        opcode: 'toggleAutoStart',
                        blockType: Scratch.BlockType.BUTTON,
                        text: this.autoStart ? 'Auto start toggle: ON' : 'Auto start toggle: OFF'
                    },                    
                    {
                        opcode: 'setBPM',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set BPM to [BPM]',
                        arguments: {
                            BPM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 120
                            }
                        }
                    },
                    {
                        opcode: 'setBeatsPerMeasure',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set beats per measure to [NUM]',
                        arguments: {
                            NUM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4
                            }
                        }
                    },
                    {
                        opcode: 'startBeat',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'start syncing to beat'
                    },
                    {
                        opcode: 'stopBeat',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop syncing to beat'
                    },
                    {
                        opcode: 'resetBeat',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'reset beat to 0'
                    },
                    '---',
                    {
                        opcode: 'waitUntilNextBeat',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'wait until next beat'
                    },
                    '---',
                    {
                        opcode: 'getBeatValue',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'beat value (0.0-1.0)'
                    },
                    {
                        opcode: 'getCurrentBeat',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current beat number'
                    },
                    {
                        opcode: 'getCurrentMeasure',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current measure number'
                    },
                    {
                        opcode: 'getTimeBetweenBeats',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'time between beats (s)'
                    },
                    '---',
                    {
                        opcode: 'whenBeatReachesStep',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when beat reaches step [STEP]',
                        isEdgeActivated: true,
                        arguments: {
                            STEP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.5
                            }
                        }
                    },
                    {
                        opcode: 'whenFullBeat',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when full beat happens',
                        isEdgeActivated: true
                    },
                    {
                        opcode: 'whenMeasureHappen',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when new measure starts',
                        isEdgeActivated: true
                    }
                ],
                menus: {}
            };
        }

        setBPM(args) {
            if (this.isRunning) {
                this.pausedElapsed = this.getElapsedSeconds();
                this.startAudioTime = this.getAudioCtx().currentTime;
            }
            this.bpm = Math.max(1, Number(args.BPM));
        }

        setBeatsPerMeasure(args) {
            this.beatsPerMeasure = Math.max(1, Number(args.NUM));
        }

        toggleAutoStart() {
            this.autoStart = !this.autoStart;
            this.saveAutoStart();
            Scratch.vm.extensionManager.refreshBlocks('beatSync');
        }

        startBeat() {
            if (!this.isRunning) {
                this.isRunning = true;
                const ctx = this.getAudioCtx();
                this.startAudioTime = ctx.currentTime;
            }
        }

        stopBeat() {
            if (this.isRunning) {
                this.pausedElapsed = this.getElapsedSeconds();
                this.isRunning = false;
            }
        }

        resetBeat() {
            this.pausedElapsed = 0;
            this.totalBeats = 0;
            this.beatPosition = 0;
            if (this.isRunning) {
                const ctx = this.getAudioCtx();
                this.startAudioTime = ctx.currentTime;
            }
        }

        waitUntilNextBeat() {
            this.updateTime();
            const startBeat = Math.floor(this.totalBeats);
            return new Promise(resolve => {
                const poll = () => {
                    this.updateTime();
                    if (Math.floor(this.totalBeats) > startBeat) {
                        resolve();
                    } else {
                        requestAnimationFrame(poll);
                    }
                };
                requestAnimationFrame(poll);
            });
        }

        getBeatValue() {
            this.updateTime();
            return Math.round(this.beatPosition * 100) / 100;
        }

        getCurrentBeat() {
            this.updateTime();
            return Math.floor(this.totalBeats);
        }

        getCurrentMeasure() {
            this.updateTime();
            return Math.floor(this.totalBeats / this.beatsPerMeasure);
        }

        getTimeBetweenBeats() {
            return 60 / this.bpm;
        }

        whenBeatReachesStep(args) {
            if (!this.isRunning) return false;
            this.updateTime();
            return this.beatPosition >= (Number(args.STEP) % 1);
        }

        whenFullBeat() {
            if (!this.isRunning) return false;
            this.updateTime();
            return this.beatPosition < 0.5;
        }

        whenMeasureHappen() {
            if (!this.isRunning) return false;
            this.updateTime();
            const beatInMeasure = this.totalBeats % this.beatsPerMeasure;
            return beatInMeasure < 0.5;
        }

        onGreenFlag() {
            this.resetBeat();
            if (this.autoStart) {
                this.startBeat();
            }
        }

        onStopAll() {
            this.stopBeat();
            this.resetBeat();
        }
    }

    const extensionInstance = new BeatSync();
    const runtime = Scratch.vm.runtime;

    extensionInstance.setupVMEvents();

    runtime.on('PROJECT_START', () => {
        extensionInstance.onGreenFlag();
    });

    runtime.on('PROJECT_STOP_ALL', () => {
        extensionInstance.onStopAll();
    });

    Scratch.extensions.register(extensionInstance);
})(Scratch);
