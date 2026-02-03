/* global Scratch, jwArray */

// jwArray placeholder
let jwArray = {
    Type: class {},
    Block: {},
    Argument: {}
};

class MIDI {
    constructor() {
        if (!Scratch.vm.jwArray) Scratch.vm.extensionManager.loadExtensionIdSync('jwArray');
        jwArray = Scratch.vm.jwArray;

        this.activeNotes = new Map();
        this.activePads = new Map();

        this.lastNote = '';
        this.lastVelocity = 0;
        this.lastChannel = -1;
        this.lastPad = '';
        this.lastPadVelocity = 0;

        this.visualizerEl = null;
        this.inputs = [];

        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(access => {
                this._onMIDISuccess(access);
            }, err => {
                console.error('MIDI failed', err);
            });
        }
    }

    getInfo() {
        return {
            id: 'midi',
            name: 'MIDI',
            color1: '#960000',
            color2: '#960000',
            blocks: [
                { opcode: 'startListening', blockType: Scratch.BlockType.COMMAND, text: 'start MIDI listener' },
                { opcode: 'stopListening', blockType: Scratch.BlockType.COMMAND, text: 'stop MIDI listener' },
                { opcode: 'setNote', blockType: Scratch.BlockType.COMMAND, text: 'map note [NOTE] to event [EVENT]',
                  arguments: {
                      NOTE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 },
                      EVENT: { type: Scratch.ArgumentType.STRING, defaultValue: 'kick' }
                  }
                },
                { opcode: 'currentNote', blockType: Scratch.BlockType.REPORTER, text: 'current note number' },
                { opcode: 'currentVelocity', blockType: Scratch.BlockType.REPORTER, text: 'current note velocity' },
                { opcode: 'currentChannel', blockType: Scratch.BlockType.REPORTER, text: 'current channel' },
                { opcode: 'currentPad', blockType: Scratch.BlockType.REPORTER, text: 'current pad ID' },
                { opcode: 'currentPadVelocity', blockType: Scratch.BlockType.REPORTER, text: 'current pad velocity' },
                { opcode: 'notesPressed', blockType: Scratch.BlockType.REPORTER, text: 'notes currently pressed', ...jwArray.Block },
                { opcode: 'notesByChannel', blockType: Scratch.BlockType.REPORTER, text: 'notes by channel', ...jwArray.Block },
                { opcode: 'notesOnChannel', blockType: Scratch.BlockType.REPORTER, text: 'notes on channel [CHANNEL]', 
                  arguments: { CHANNEL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } }, 
                  ...jwArray.Block 
                },
                { opcode: 'noteNumberToName', blockType: Scratch.BlockType.REPORTER, text: 'note name of [NOTE]',
                  arguments: { NOTE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 } } 
                },
                { opcode: 'showVisualizer', blockType: Scratch.BlockType.COMMAND, text: 'show visualizer' },
                { opcode: 'hideVisualizer', blockType: Scratch.BlockType.COMMAND, text: 'hide visualizer' }
            ]
        };
    }

    /* ======= MIDI Setup ======= */
    _onMIDISuccess(access) {
        this.inputs = Array.from(access.inputs.values());
        this.inputs.forEach(input => input.onmidimessage = e => this._onMIDIMessage(e));
    }

    _onMIDIMessage(event) {
        const [status, note, velocity] = event.data;
        const command = status & 0xf0;
        const channel = (status & 0x0f) + 1;
        const isPad = (note >= 36 && note <= 51); // MPK Mini pads

        if (command === 0x90 && velocity > 0) {
            if (isPad) this._padOn(channel, note, velocity);
            else this._noteOn(channel, note, velocity);
        } else if (command === 0x80 || (command === 0x90 && velocity === 0)) {
            if (isPad) this._padOff(channel, note);
            else this._noteOff(channel, note);
        }
    }

    _noteOn(channel, note, velocity) {
        if (!this.activeNotes.has(channel)) this.activeNotes.set(channel, new Map());
        this.activeNotes.get(channel).set(note, velocity);
        this.lastNote = note;
        this.lastVelocity = velocity;
        this.lastChannel = channel;
        this.updateVisualizer();
    }

    _noteOff(channel, note) {
        if (this.activeNotes.has(channel)) {
            this.activeNotes.get(channel).delete(note);
            if (this.activeNotes.get(channel).size === 0) this.activeNotes.delete(channel);
        }

        if (!this.activeNotes.has(channel) || this.activeNotes.get(channel).size === 0) {
            this.lastNote = '';
        }

        this.lastVelocity = 0;
        this.lastChannel = channel;
        this.updateVisualizer();
    }

    _padOn(channel, note, velocity) {
        if (!this.activePads.has(channel)) this.activePads.set(channel, new Map());
        this.activePads.get(channel).set(note, velocity);
        this.lastPad = note;
        this.lastPadVelocity = velocity;
        this.updateVisualizer();
    }

    _padOff(channel, note) {
        if (this.activePads.has(channel)) {
            this.activePads.get(channel).delete(note);
            if (this.activePads.get(channel).size === 0) this.activePads.delete(channel);
        }

        if (!this.activePads.has(channel) || this.activePads.get(channel).size === 0) {
            this.lastPad = '';
        }

        this.lastPadVelocity = 0;
        this.updateVisualizer();
    }

    /* ======= Listeners ======= */
    startListening() { this.inputs.forEach(input => input.onmidimessage = e => this._onMIDIMessage(e)); }
    stopListening() {
        this.inputs.forEach(input => input.onmidimessage = null);
        this.activeNotes.clear();
        this.activePads.clear();
        this.lastNote = '';
        this.lastVelocity = 0;
        this.lastChannel = -1;
        this.lastPad = '';
        this.lastPadVelocity = 0;
        this.updateVisualizer();
    }

    setNote(args) { console.log(`Map note ${args.NOTE} → ${args.EVENT}`); }

    /* ======= Visualizer ======= */
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

        let dragging = false, offsetX = 0, offsetY = 0;
        this.visualizerEl.addEventListener('mousedown', e => { dragging=true; offsetX=e.clientX-this.visualizerEl.offsetLeft; offsetY=e.clientY-this.visualizerEl.offsetTop; });
        document.addEventListener('mousemove', e => { if(dragging){ this.visualizerEl.style.left=(e.clientX-offsetX)+'px'; this.visualizerEl.style.top=(e.clientY-offsetY)+'px'; } });
        document.addEventListener('mouseup', () => dragging=false);
        this.updateVisualizer();
    }

    hideVisualizer() { if(this.visualizerEl){ document.body.removeChild(this.visualizerEl); this.visualizerEl=null; } }

    updateVisualizer() {
        if(!this.visualizerEl) return;
        const arr = [];
        for(const [ch, notes] of this.activeNotes.entries()){ for(const note of notes.keys()) arr.push(`N Ch${ch}:${note}`); }
        for(const [ch, pads] of this.activePads.entries()){ for(const pad of pads.keys()) arr.push(`P Ch${ch}:${pad}`); }
        this.visualizerEl.innerText = `Notes: [${arr.join(', ')}]`;
    }

    /* ======= REPORTERS ======= */
    currentNote() { return this.lastNote; }
    currentVelocity() { return this.lastVelocity; }
    currentChannel() { return this.lastChannel; }
    currentPad() { return this.lastPad; }
    currentPadVelocity() { return this.lastPadVelocity; }

    notesPressed() {
        const arr = [];
        for(const notes of this.activeNotes.values()){ for(const note of notes.keys()) arr.push(note); }
        for(const pads of this.activePads.values()){ for(const pad of pads.keys()) arr.push(pad); }
        return new jwArray.Type(arr);
    }

    notesByChannel() {
        const arr = [];
        for(const [ch, notes] of this.activeNotes.entries()){ for(const note of notes.keys()) arr.push(note); }
        for(const [ch, pads] of this.activePads.entries()){ for(const pad of pads.keys()) arr.push(pad); }
        return new jwArray.Type(arr);
    }

    notesOnChannel(args) {
        const channel = args.CHANNEL;
        const arr = [];
        if(this.activeNotes.has(channel)) arr.push(...this.activeNotes.get(channel).keys());
        if(this.activePads.has(channel)) arr.push(...this.activePads.get(channel).keys());
        return new jwArray.Type(arr);
    }

    noteNumberToName(args) {
        const noteNumber = args.NOTE;
        if (!Number.isInteger(noteNumber) || noteNumber < 0 || noteNumber > 127) return '';
        const names = ['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
        const octave = Math.floor(noteNumber / 12) - 1;
        return names[noteNumber % 12] + octave;
    }
}

Scratch.extensions.register(new MIDI());

// Hello ddededodediamante
