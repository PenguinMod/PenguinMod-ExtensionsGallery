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

            this._audioCtx = null;
            this._startAudioTime = 0;
            this._pausedElapsed = 0;

            this._rafHandle = null;
        }

        _getAudioCtx() {
            if (this._audioCtx) {
                if (this._audioCtx.state === 'suspended') this._audioCtx.resume();
                return this._audioCtx;
            }

            let scratchCtx = null;
            try {
                const vm = Scratch.vm;
                scratchCtx =
                    vm?.runtime?.audioEngine?.audioContext ||
                    vm?.runtime?.audioEngine?._audioContext ||
                    vm?.runtime?.scratch?.audioEngine?.audioContext ||
                    vm?.audioEngine?.audioContext ||
                    null;
            } catch (e) { /* ignore */ }

            this._audioCtx = scratchCtx || new (window.AudioContext || window.webkitAudioContext)();
            if (this._audioCtx.state === 'suspended') this._audioCtx.resume();
            return this._audioCtx;
        }

        _getLatencySeconds() {
            const ctx = this._getAudioCtx();
            return (ctx.outputLatency || 0);
        }

        _getElapsedSeconds() {
            if (!this.isRunning) return this._pausedElapsed;
            const ctx = this._getAudioCtx();
            return this._pausedElapsed + (ctx.currentTime - this._startAudioTime) + this._getLatencySeconds();
        }

        _tick() {
            if (!this.isRunning) {
                this._rafHandle = null;
                return;
            }
            const elapsed = this._getElapsedSeconds();
            const secondsPerBeat = 60 / this.bpm;
            this.totalBeats = elapsed / secondsPerBeat;
            this.beatPosition = this.totalBeats % 1;
            this._rafHandle = requestAnimationFrame(() => this._tick());
        }

        _startRaf() {
            if (!this._rafHandle) {
                this._rafHandle = requestAnimationFrame(() => this._tick());
            }
        }

        _stopRaf() {
            if (this._rafHandle) {
                cancelAnimationFrame(this._rafHandle);
                this._rafHandle = null;
            }
        }

        _updateTime() {
            if (!this.isRunning) return;
            const elapsed = this._getElapsedSeconds();
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
                        opcode: 'setBPM',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set BPM to [BPM]',
                        arguments: {
                            BPM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 120 }
                        }
                    },
                    {
                        opcode: 'setBeatsPerMeasure',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set beats per measure to [NUM]',
                        arguments: {
                            NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 }
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
                        text: 'start beat sync'
                    },
                    {
                        opcode: 'stopBeat',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'stop beat sync'
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
                            STEP: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 }
                        }
                    },
                    {
                        opcode: 'whenFullBeat',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when full beat happen',
                        isEdgeActivated: true
                    },
                    {
                        opcode: 'whenMeasureHappen',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when new measure start',
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
                this._pausedElapsed = this._getElapsedSeconds();
                this._startAudioTime = this._getAudioCtx().currentTime;
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
                this._startAudioTime = this._getAudioCtx().currentTime;
                this._startRaf();
            }
        }

        stopBeat() {
            if (this.isRunning) {
                this._pausedElapsed = this._getElapsedSeconds();
                this.isRunning = false;
                this._stopRaf();
            }
        }

        resetBeat() {
            this._pausedElapsed = 0;
            this.totalBeats = 0;
            this.beatPosition = 0;
            if (this.isRunning) {
                this._startAudioTime = this._getAudioCtx().currentTime;
            }
        }

        waitUntilNextBeat() {
            this._updateTime();
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
            this._updateTime();
            return Math.round(this.beatPosition * 100) / 100;
        }

        getCurrentBeat() {
            this._updateTime();
            return Math.floor(this.totalBeats);
        }

        getCurrentMeasure() {
            this._updateTime();
            return Math.floor(this.totalBeats / this.beatsPerMeasure);
        }

        getTimeBetweenBeats() {
            return 60 / this.bpm;
        }

        whenBeatReachesStep(args) {
            if (!this.isRunning) return false;
            this._updateTime();
            return this.beatPosition >= (Number(args.STEP) % 1);
        }

        whenFullBeat() {
            if (!this.isRunning) return false;
            this._updateTime();
            return this.beatPosition < 0.5;
        }

        whenMeasureHappen() {
            if (!this.isRunning) return false;
            this._updateTime();
            const beatInMeasure = this.totalBeats % this.beatsPerMeasure;
            return beatInMeasure < 0.5;
        }
    }

    const extensionInstance = new BeatSync();

    if (Scratch && Scratch.vm) {
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
    }

    Scratch.extensions.register(extensionInstance);
})(Scratch);
