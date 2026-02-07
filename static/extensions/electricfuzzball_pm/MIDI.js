// jwArray placeholder
let jwArray = {
    Type: class {},
    Block: {},
    Argument: {}
};

(function (Scratch) {
    'use strict';

    class MIDIExtension {
        constructor() {
            // Inject jwArray
            if (!Scratch.vm.jwArray) Scratch.vm.extensionManager.loadExtensionIdSync('jwArray');
            jwArray = Scratch.vm.jwArray;

            this.midiAccess = null;
            this.inputs = [];
            this.listening = false;

            this.noteMap = {
                60: 'kick',
                62: 'snare',
                64: 'hihat',
                65: 'clap',
                36: 'pad1',
                37: 'pad2',
                38: 'pad3',
                39: 'pad4',
                40: 'pad5',
                41: 'pad6',
                42: 'pad7',
                43: 'pad8'
            };

            this._currentNote = 0;
            this._currentVelocity = 0;
            this._currentPad = 0;
            this._currentPadVelocity = 0;

            this._notesPressed = new Set();

            this.visualizerEl = null;
        }

        getInfo() {
            return {
                id: 'midi',
                name: 'MIDI',
                color1: '#960000',
                iconURI: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyOC41OTE4MyIgaGVpZ2h0PSIyNS4zODk0NCIgdmlld0JveD0iMCwwLDI4LjU5MTgzLDI1LjM4OTQ0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI1LjcwNDA4LC0xNjcuMzA1MjgpIj48ZyBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTIyNi4yMDQwOCwxNzQuMzk1MDl2LTYuNTg5ODFoMjcuNTkxODN2Ni41ODk4MXoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjI3LjY0NDY0LDE5Mi4xOTQ3MmMtMC43OTU2LDAgLTEuNDQwNTUsLTAuODE3NTggLTEuNDQwNTUsLTEuODI2MTF2LTE1Ljk3MzUzaDYuODk3OTZ2MTUuOTczNTNjMCwxLjAwODUzIC0wLjY0NDk2LDEuODI2MTEgLTEuNDQwNTUsMS44MjYxMXoiIGZpbGw9Im5vbmUiLz48cGF0aCBkPSJNMjM0LjU0MjYsMTkyLjE5NDcyYy0wLjc5NTYsMCAtMS40NDA1NSwtMC44MTc1OCAtMS40NDA1NSwtMS44MjYxMXYtMTUuOTczNTNoNi44OTc5NnYxNS45NzM1M2MwLDEuMDA4NTMgLTAuNjQ0OTYsMS44MjYxMSAtMS40NDA1NSwxLjgyNjExeiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yNDEuNDQwNTUsMTkyLjE5NDcyYy0wLjc5NTYsMCAtMS40NDA1NSwtMC44MTc1OCAtMS40NDA1NSwtMS44MjYxMXYtMTUuOTczNTNoNi44OTc5NnYxNS45NzM1M2MwLDEuMDA4NTMgLTAuNjQ0OTYsMS44MjYxMSAtMS40NDA1NSwxLjgyNjExeiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yNDguMzM4NTEsMTkyLjE5NDcyYy0wLjc5NTYsMCAtMS40NDA1NiwtMC44MTc1OCAtMS40NDA1NiwtMS44MjYxMXYtMTUuOTczNTNoNi44OTc5NnYxNS45NzM1M2MwLDEuMDA4NTMgLTAuNjQ0OTYsMS44MjYxMSAtMS40NDA1NSwxLjgyNjExeiIgZmlsbD0ibm9uZSIvPjxwYXRoIGQ9Ik0yMzEuMDgxMTgsMTgzLjU3NDYydi05LjE3OTUzaDQuMDQxNzN2OS4xNzk1M3oiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMjQ0Ljg3NzA5LDE4My41NzQ2MnYtOS4xNzk1NGg0LjA0MTczdjkuMTc5NTR6IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTIzNy45NzkxMywxODMuNTc0NjJ2LTkuMTc5NTRoNC4wNDE3M3Y5LjE3OTU0eiIgZmlsbD0iI2ZmZmZmZiIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE0LjI5NTkxNjcyMDYzODc1ODoxMi42OTQ3MjIyMTgzNDU1MDQtLT4=',
                blocks: [
                    { opcode: 'startListening', blockType: Scratch.BlockType.COMMAND, text: 'start MIDI listener' },
                    { opcode: 'stopListening', blockType: Scratch.BlockType.COMMAND, text: 'stop MIDI listener' },
                    { 
                        opcode: 'setNote', 
                        blockType: Scratch.BlockType.COMMAND, 
                        text: 'map note [NOTE] to event [EVENT]',
                        arguments: {
                            NOTE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 },
                            EVENT: { type: Scratch.ArgumentType.STRING, defaultValue: 'kick' }
                        }
                    },
                    { opcode: 'currentNote', blockType: Scratch.BlockType.REPORTER, text: 'current note number' },
                    { opcode: 'currentVelocity', blockType: Scratch.BlockType.REPORTER, text: 'current note velocity' },
                    { opcode: 'currentPad', blockType: Scratch.BlockType.REPORTER, text: 'current pad ID' },
                    { opcode: 'currentPadVelocity', blockType: Scratch.BlockType.REPORTER, text: 'current pad velocity' },
                    { 
                        opcode: 'notesPressed', 
                        blockType: Scratch.BlockType.REPORTER, 
                        text: 'notes currently pressed',
                        ...jwArray.Block
                    },
                    { opcode: 'showVisualizer', blockType: Scratch.BlockType.COMMAND, text: 'show visualizer' },
                    { opcode: 'hideVisualizer', blockType: Scratch.BlockType.COMMAND, text: 'hide visualizer' }
                ]
            };
        }

        async startListening() {
            if (this.listening) return;
            this.listening = true;

            if (!navigator.requestMIDIAccess) {
                console.log('MIDI not supported in this browser!');
                return;
            }

            this.midiAccess = await navigator.requestMIDIAccess();
            this.inputs = Array.from(this.midiAccess.inputs.values());
            this.inputs.forEach(input => input.onmidimessage = this.handleMIDIMessage.bind(this));
            console.log('MIDI listener started!');
        }

        stopListening() {
            this.listening = false;
            if (this.inputs.length > 0) {
                this.inputs.forEach(input => input.onmidimessage = null);
            }
            this._notesPressed.clear();
            this.updateVisualizer();
            console.log('MIDI listener stopped!');
        }

        setNote(args) {
            const note = args.NOTE;
            const event = args.EVENT;
            this.noteMap[note] = event;
            console.log(`Mapped note ${note} → event "${event}"`);
        }

        handleMIDIMessage(event) {
            if (!this.listening) return;

            const [status, noteValue, velocityValue] = event.data;
            const isNoteOn = (status & 0xF0) === 0x90 && velocityValue > 0;
            const isNoteOff = ((status & 0xF0) === 0x80) || ((status & 0xF0) === 0x90 && velocityValue === 0);

            if (isNoteOn) {
                const isPad = (noteValue >= 36 && noteValue <= 51);
                if (isPad) {
                    this._currentPad = noteValue;
                    this._currentPadVelocity = velocityValue;
                } else {
                    this._currentNote = noteValue;
                    this._currentVelocity = velocityValue;
                }

                this._notesPressed.add(noteValue);

                const mappedEvent = this.noteMap[noteValue];
                if (mappedEvent) {
                    Scratch.vm.runtime.emit('MIDI_NOTE', {
                        note: noteValue,
                        velocity: velocityValue,
                        event: mappedEvent,
                        isPad: isPad
                    });
                }
            }

            if (isNoteOff) {
                this._notesPressed.delete(noteValue);
            }

            this.updateVisualizer();
        }

        noteNumberToName(number) {
            const names = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const octave = Math.floor(number / 12) - 1;
            const name = names[number % 12];
            return `${name}${octave}`;
        }

        showVisualizer() {
            if (this.visualizerEl) return;
            this.visualizerEl = document.createElement('div');
            this.visualizerEl.style.position = 'fixed';
            this.visualizerEl.style.top = '50px';
            this.visualizerEl.style.left = '50px';
            this.visualizerEl.style.background = '#222';
            this.visualizerEl.style.color = '#fff';
            this.visualizerEl.style.padding = '10px';
            this.visualizerEl.style.borderRadius = '8px';
            this.visualizerEl.style.fontFamily = 'monospace';
            this.visualizerEl.style.zIndex = 9999;
            this.visualizerEl.style.cursor = 'move';
            this.visualizerEl.innerText = 'Notes: []';
            document.body.appendChild(this.visualizerEl);

            let isDragging = false;
            let offsetX = 0;
            let offsetY = 0;

            this.visualizerEl.addEventListener('mousedown', (e) => {
                isDragging = true;
                offsetX = e.clientX - this.visualizerEl.offsetLeft;
                offsetY = e.clientY - this.visualizerEl.offsetTop;
            });

            document.addEventListener('mousemove', (e) => {
                if (isDragging) {
                    this.visualizerEl.style.left = (e.clientX - offsetX) + 'px';
                    this.visualizerEl.style.top = (e.clientY - offsetY) + 'px';
                }
            });

            document.addEventListener('mouseup', () => {
                isDragging = false;
            });

            this.updateVisualizer();
        }

        hideVisualizer() {
            if (this.visualizerEl) {
                document.body.removeChild(this.visualizerEl);
                this.visualizerEl = null;
            }
        }

        updateVisualizer() {
            if (!this.visualizerEl) return;
            const names = Array.from(this._notesPressed).map(n => this.noteNumberToName(n));
            this.visualizerEl.innerText = `Notes: [${names.join(', ')}]`;
        }

        currentNote() { return this._currentNote; }
        currentVelocity() { return this._currentVelocity; }
        currentPad() { return this._currentPad; }
        currentPadVelocity() { return this._currentPadVelocity; }
        notesPressed() { 
            // Return formatted as jwArray type
            return new jwArray.Type(Array.from(this._notesPressed));
        }
    }

    Scratch.extensions.register(new MIDIExtension());
})(Scratch);
