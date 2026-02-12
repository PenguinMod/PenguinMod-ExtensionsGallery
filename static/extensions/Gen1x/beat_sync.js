(function(Scratch) {
    'use strict';

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

            this.rafHandle = null;
        }

        getAudioCtx() {
            if (this.audioCtx) {
                if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
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
                /* ignore */ }

            this.audioCtx = scratchCtx || new(window.AudioContext || window.webkitAudioContext)();
            if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
            return this.audioCtx;
        }

        getLatencySeconds() {
            const ctx = this.getAudioCtx();
            return (ctx.outputLatency || 0);
        }

        getElapsedSeconds() {
            if (!this.isRunning) return this.pausedElapsed;
            const ctx = this.getAudioCtx();
            return this.pausedElapsed + (ctx.currentTime - this.startAudioTime) + this.getLatencySeconds();
        }

        tick() {
            if (!this.isRunning) {
                this.rafHandle = null;
                return;
            }
            const elapsed = this.getElapsedSeconds();
            const secondsPerBeat = 60 / this.bpm;
            this.totalBeats = elapsed / secondsPerBeat;
            this.beatPosition = this.totalBeats % 1;
            this.rafHandle = requestAnimationFrame(() => this.tick());
        }

        startRaf() {
            if (!this.rafHandle) {
                this.rafHandle = requestAnimationFrame(() => this.tick());
            }
        }

        stopRaf() {
            if (this.rafHandle) {
                cancelAnimationFrame(this.rafHandle);
                this.rafHandle = null;
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
                blocks: [{
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
                        opcode: 'setAutoStart',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set auto start on project start [AUTO]',
                        arguments: {
                            AUTO: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'autoStartMenu',
                                defaultValue: 'true'
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
                menus: {
                    autoStartMenu: {
                        acceptReporters: true,
                        items: ['true', 'false']
                    }
                }
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

        setAutoStart(args) {
            this.autoStart = String(args.AUTO).toLowerCase() === 'true';
        }

        startBeat() {
            if (!this.isRunning) {
                this.isRunning = true;
                this.startAudioTime = this.getAudioCtx().currentTime;
                this.startRaf();
            }
        }

        stopBeat() {
            if (this.isRunning) {
                this.pausedElapsed = this.getElapsedSeconds();
                this.isRunning = false;
                this.stopRaf();
            }
        }

        resetBeat() {
            this.pausedElapsed = 0;
            this.totalBeats = 0;
            this.beatPosition = 0;
            if (this.isRunning) {
                this.startAudioTime = this.getAudioCtx().currentTime;
            }
        }

        waitUntilNextBeat() {
            this.updateTime();
            const startBeat = Math.floor(this.totalBeats);
            return new Promise(resolve => {
                const poll = () => {
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
    }

    const extensionInstance = new BeatSync();

    const runtime = Scratch.vm.runtime;

    const originalGreenFlag = runtime.greenFlag;
    runtime.greenFlag = function() {
        extensionInstance.resetBeat();
        if (extensionInstance.autoStart) {
            extensionInstance.startBeat();
        }
        return originalGreenFlag.apply(this, arguments);
    };

    const originalStopAll = runtime.stopAll;
    runtime.stopAll = function() {
        extensionInstance.stopBeat();
        extensionInstance.resetBeat();
        return originalStopAll.apply(this, arguments);
    };

    Scratch.extensions.register(extensionInstance);
})(Scratch);
