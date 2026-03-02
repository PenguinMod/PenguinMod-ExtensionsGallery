/* global Scratch, jwArray */

let jwArray = {
    Type: class {},
    Block: {},
    Argument: {}
};

class MIDI {
    constructor() {
        if (!Scratch.vm.jwArray) Scratch.vm.extensionManager.loadExtensionIdSync("jwArray");
        jwArray = Scratch.vm.jwArray;

        this.activeNotes = new Map();
        this.activePads = new Map();

        this.lastNote = "";
        this.lastVelocity = 0;
        this.lastChannel = -1;

        this.lastPad = "";
        this.lastPadVelocity = 0;

        this.visualizerEl = null;
        this.inputs = [];
        this.midiAccess = null;

        this.lastNotePressed = null;
        this.notePressedFlag = false;
        this.specificNotePressedFlags = {};
        this.notePressTimes = new Map();
        this.lastNNotes = [];

        this.pitchBend = 0;
        this.modWheel = 0;

        this.sequenceQueue = [];

        if (navigator.requestMIDIAccess) {
            navigator.requestMIDIAccess().then(access => {
                this.midiAccess = access;
                this.inputs = Array.from(access.inputs.values());
                access.onstatechange = () => {
                    this.inputs = Array.from(access.inputs.values());
                };
            }).catch(err => console.error("MIDI init failed", err));
        }
    }

    getInfo() {
        return {
            id: "midi",
            name: "MIDI",
            color1: "#960000",
            color2: "#960000",
            blocks: [
                { opcode: "startListening", blockType: Scratch.BlockType.COMMAND, text: "start MIDI listener" },
                { opcode: "stopListening", blockType: Scratch.BlockType.COMMAND, text: "stop MIDI listener" },

                { opcode: "setNote", blockType: Scratch.BlockType.COMMAND, text: "map note [NOTE] to event [EVENT]",
                  arguments: { NOTE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 },
                               EVENT: { type: Scratch.ArgumentType.STRING, defaultValue: "kick" } } },

                { opcode: "currentNote", blockType: Scratch.BlockType.REPORTER, text: "current note number" },
                { opcode: "currentVelocity", blockType: Scratch.BlockType.REPORTER, text: "current note velocity" },
                { opcode: "currentChannel", blockType: Scratch.BlockType.REPORTER, text: "current channel" },

                { opcode: "currentPad", blockType: Scratch.BlockType.REPORTER, text: "current pad ID" },
                { opcode: "currentPadVelocity", blockType: Scratch.BlockType.REPORTER, text: "current pad velocity" },

                { opcode: "notesPressed", blockType: Scratch.BlockType.REPORTER, text: "notes currently pressed", ...jwArray.Block },
                { opcode: "notesByChannel", blockType: Scratch.BlockType.REPORTER, text: "notes by channel", ...jwArray.Block },

                { opcode: "notesOnChannel", blockType: Scratch.BlockType.REPORTER, text: "notes on channel [CHANNEL]",
                  arguments: { CHANNEL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } }, ...jwArray.Block },

                { opcode: "noteNumberToName", blockType: Scratch.BlockType.REPORTER, text: "note name of [NOTE]",
                  arguments: { NOTE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 } } },

                { opcode: "whenNotePressed", blockType: Scratch.BlockType.HAT, text: "when MIDI note pressed" },
                { opcode: "whenSpecificNotePressed", blockType: Scratch.BlockType.HAT, text: "when note [NOTE] pressed",
                  arguments: { NOTE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 } } },

                { opcode: "getPitchBend", blockType: Scratch.BlockType.REPORTER, text: "pitch bend" },
                { opcode: "getModWheel", blockType: Scratch.BlockType.REPORTER, text: "mod wheel" },

                { opcode: "lastNNotesPressed", blockType: Scratch.BlockType.REPORTER, text: "last [N] notes pressed",
                  arguments: { N: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 } }, ...jwArray.Block },

                { opcode: "noteHeldTime", blockType: Scratch.BlockType.REPORTER, text: "time note [NOTE] is held",
                  arguments: { NOTE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 60 } } },

                { opcode: "anyNoteHeldTime", blockType: Scratch.BlockType.REPORTER, text: "time note is held" },

                { opcode: "deviceName", blockType: Scratch.BlockType.REPORTER, text: "MIDI device name [INDEX]",
                  arguments: { INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },

                { opcode: "deviceManufacturer", blockType: Scratch.BlockType.REPORTER, text: "MIDI device manufacturer [INDEX]",
                  arguments: { INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },

                { opcode: "deviceChannels", blockType: Scratch.BlockType.REPORTER, text: "MIDI device channels [INDEX]",
                  arguments: { INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 } } },

                { opcode: "whenSequencePlayed", blockType: Scratch.BlockType.HAT, text: "when sequence [SEQUENCE] played",
                  arguments: { SEQUENCE: { type: Scratch.ArgumentType.STRING, defaultValue: "60 62 64" } } },

                { opcode: "visualizerControl", blockType: Scratch.BlockType.COMMAND, text: "[ACTION] visualizer",
                  arguments: { ACTION: { type: Scratch.ArgumentType.STRING, menu: "showHide", defaultValue: "show" } } }
            ],
            menus: {
                showHide: ["show", "hide"]
            }
        };
    }

    startListening() {
        if (!this.inputs || this.inputs.length === 0) {
            alert("MIDI device not detected!");
            throw new Error("MIDI device not detected!");
        }
        this.inputs.forEach(input => input.onmidimessage = e => this._onMIDIMessage(e));
    }

    stopListening() {
        this.inputs.forEach(input => input.onmidimessage = null);
        this.activeNotes.clear();
        this.activePads.clear();
        this.lastNote = "";
        this.lastVelocity = 0;
        this.lastChannel = -1;
        this.lastPad = "";
        this.lastPadVelocity = 0;
        this.updateVisualizer();
    }

    _onMIDIMessage(event) {
        const [status, note, velocity] = event.data;
        const MIDI_NOTE_ON = 0x90;
        const MIDI_NOTE_OFF = 0x80;
        const PAD_NOTE_MIN = 36;
        const PAD_NOTE_MAX = 51;
        const CONTROL_CHANGE = 0xB0;
        const PITCH_BEND = 0xE0;

        const command = status & 0xf0;
        const channel = (status & 0x0f) + 1;

        if (command === CONTROL_CHANGE && note === 1) this.modWheel = velocity;
        if (command === PITCH_BEND) this.pitchBend = ((velocity << 7) | note) - 8192;

        const isPad = note >= PAD_NOTE_MIN && note <= PAD_NOTE_MAX;
        const isNoteOn = command === MIDI_NOTE_ON && velocity > 0;
        const isNoteOff = command === MIDI_NOTE_OFF || (command === MIDI_NOTE_ON && velocity === 0);

        if (isNoteOn) {
            this.lastNotePressed = note;
            this.notePressedFlag = true;
            this.specificNotePressedFlags[note] = true;
            this.notePressTimes.set(note, Date.now());
            this.lastNNotes.push(note);
            if (this.lastNNotes.length > 50) this.lastNNotes.shift();

            this.sequenceQueue.push(note);
            if (this.sequenceQueue.length > 20) this.sequenceQueue.shift();

            if (isPad) this._padOn(channel, note, velocity);
            else this._noteOn(channel, note, velocity);
        }

        if (isNoteOff) {
            if (isPad) this._padOff(channel, note);
            else this._noteOff(channel, note);
            this.notePressTimes.delete(note);
        }
    }

    whenSequencePlayed(args) {
        const target = args.SEQUENCE.trim().split(" ").map(Number);
        const qlen = this.sequenceQueue.length;
        if (qlen < target.length) return false;
        const recent = this.sequenceQueue.slice(qlen - target.length);
        return recent.every((n, i) => n === target[i]);
    }

    whenNotePressed() {
        if (this.notePressedFlag) {
            this.notePressedFlag = false;
            return true;
        }
        return false;
    }

    whenSpecificNotePressed(args) {
        const n = args.NOTE;
        if (this.specificNotePressedFlags[n]) {
            this.specificNotePressedFlags[n] = false;
            return true;
        }
        return false;
    }

    getPitchBend() { return this.pitchBend; }
    getModWheel() { return this.modWheel; }

    lastNNotesPressed(args) { return new jwArray.Type(this.lastNNotes.slice(-args.N)); }

    noteHeldTime(args) {
        const n = args.NOTE;
        return this.notePressTimes.has(n) ? ((Date.now() - this.notePressTimes.get(n))/1000).toFixed(2) : 0;
    }

    anyNoteHeldTime() {
        return this.lastNotePressed && this.notePressTimes.has(this.lastNotePressed) ?
            ((Date.now() - this.notePressTimes.get(this.lastNotePressed))/1000).toFixed(2) : 0;
    }

    deviceName(args) { return this.inputs[args.INDEX]?.name || ""; }
    deviceManufacturer(args) { return this.inputs[args.INDEX]?.manufacturer || ""; }
    deviceChannels(args) { return this.inputs[args.INDEX]?.channels || 16; }

    visualizerControl(args) {
        if (args.ACTION === "show") this.showVisualizer();
        else this.hideVisualizer();
    }

    _noteOn(channel,note,velocity){ if(!this.activeNotes.has(channel)) this.activeNotes.set(channel,new Map()); this.activeNotes.get(channel).set(note,velocity); this.lastNote=note; this.lastVelocity=velocity; this.lastChannel=channel; this.updateVisualizer(); }
    _noteOff(channel,note){ if(this.activeNotes.has(channel)){ this.activeNotes.get(channel).delete(note); if(this.activeNotes.get(channel).size===0) this.activeNotes.delete(channel); } if(!this.activeNotes.has(channel)||this.activeNotes.get(channel).size===0)this.lastNote=""; this.lastVelocity=0; this.lastChannel=channel; this.updateVisualizer(); }
    _padOn(channel,note,velocity){ if(!this.activePads.has(channel)) this.activePads.set(channel,new Map()); this.activePads.get(channel).set(note,velocity); this.lastPad=note; this.lastPadVelocity=velocity; this.updateVisualizer(); }
    _padOff(channel,note){ if(this.activePads.has(channel)){ this.activePads.get(channel).delete(note); if(this.activePads.get(channel).size===0) this.activePads.delete(channel); } if(!this.activePads.has(channel)||this.activePads.get(channel).size===0)this.lastPad=""; this.lastPadVelocity=0; this.updateVisualizer(); }

    currentNote(){ return this.lastNote; }
    currentVelocity(){ return this.lastVelocity; }
    currentChannel(){ return this.lastChannel; }
    currentPad(){ return this.lastPad; }
    currentPadVelocity(){ return this.lastPadVelocity; }

    notesPressed(){ const arr=[]; for(const notes of this.activeNotes.values()) for(const note of notes.keys()) arr.push(note); for(const pads of this.activePads.values()) for(const pad of pads.keys()) arr.push(pad); return new jwArray.Type(arr); }
    notesByChannel(){ const arr=[]; for(const [ch,notes] of this.activeNotes.entries()) for(const note of notes.keys()) arr.push(note); for(const [ch,pads] of this.activePads.entries()) for(const pad of pads.keys()) arr.push(pad); return new jwArray.Type(arr); }
    notesOnChannel(args){ const arr=[]; const channel=args.CHANNEL; if(this.activeNotes.has(channel)) arr.push(...this.activeNotes.get(channel).keys()); if(this.activePads.has(channel)) arr.push(...this.activePads.get(channel).keys()); return new jwArray.Type(arr); }
    noteNumberToName(args){ const noteNumber=args.NOTE; if(!Number.isInteger(noteNumber)||noteNumber<0||noteNumber>127) return ""; const names=["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"]; const octave=Math.floor(noteNumber/12)-1; return names[noteNumber%12]+octave; }

    setNote(args){ console.log(`Map note ${args.NOTE} → ${args.EVENT}`); }

    showVisualizer(){ if(this.visualizerEl)return; this.visualizerEl=document.createElement("div"); this.visualizerEl.style.position="fixed"; this.visualizerEl.style.top="50px"; this.visualizerEl.style.left="50px"; this.visualizerEl.style.background="#222"; this.visualizerEl.style.color="#fff"; this.visualizerEl.style.padding="10px"; this.visualizerEl.style.borderRadius="8px"; this.visualizerEl.style.fontFamily="monospace"; this.visualizerEl.style.zIndex=9999; this.visualizerEl.style.cursor="move"; this.visualizerEl.innerText="Notes: []"; document.body.appendChild(this.visualizerEl); let dragging=false; let offsetX=0; let offsetY=0; this.visualizerEl.addEventListener("mousedown",(e)=>{dragging=true; offsetX=e.clientX-this.visualizerEl.offsetLeft; offsetY=e.clientY-this.visualizerEl.offsetTop;}); document.addEventListener("mousemove",(e)=>{if(!dragging)return; this.visualizerEl.style.left=e.clientX-offsetX+"px"; this.visualizerEl.style.top=e.clientY-offsetY+"px";}); document.addEventListener("mouseup",()=>dragging=false); this.updateVisualizer(); }
    hideVisualizer(){ if(this.visualizerEl){document.body.removeChild(this.visualizerEl); this.visualizerEl=null;} }
    updateVisualizer(){ if(!this.visualizerEl) return; const arr=[]; for(const [ch,notes] of this.activeNotes.entries()) for(const note of notes.keys()) arr.push(`N Ch${ch}:${note} v${notes.get(note)}`); for(const [ch,pads] of this.activePads.entries()) for(const pad of pads.keys()) arr.push(`P Ch${ch}:${pad} v${pads.get(pad)}`); this.visualizerEl.innerText=`Notes: [${arr.join(", ")}]`; }
}

Scratch.extensions.register(new MIDI());
// Howdy! I'm Flowey! Flowey the Flower!
