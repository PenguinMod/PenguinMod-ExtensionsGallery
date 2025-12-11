class VoiceRecorder {
    constructor(runtime) {
        this.runtime = runtime;
        this.audioCtx = null;
        this.micStream = null;
        this.micSource = null;
        this.processorNode = null;
        this.silentGainNode = null;
        this.samples = [];
        this.latestSample = 0;
        this.isRecording = false;
        this.maxSeconds = 30;
        this.maxSamples = 44100 * this.maxSeconds;
        this.sampleRate = 44100;
    }

    getInfo() {
        return {
            id: 'voiceRecorder',
            name: 'PenguinMic',
            color1: '#FF7043',
            color2: '#D84315',
            blocks: [
                { opcode: 'start', blockType: Scratch.BlockType.COMMAND, text: 'start recording' },
                { opcode: 'stop', blockType: Scratch.BlockType.COMMAND, text: 'stop recording' },
                { opcode: 'play', blockType: Scratch.BlockType.COMMAND, text: 'play recording' },
                { opcode: 'playArray', blockType: Scratch.BlockType.COMMAND, text: 'play samples [ARRAY]', arguments: {
                    ARRAY: { type: Scratch.ArgumentType.STRING, defaultValue: '[]' }
                }},
                { opcode: 'micSample', blockType: Scratch.BlockType.REPORTER, text: 'mic sample' },
                { opcode: 'allSamples', blockType: Scratch.BlockType.REPORTER, text: 'recorded data (json)' },
                { opcode: 'length', blockType: Scratch.BlockType.REPORTER, text: 'recording length (samples)' },
                { opcode: 'clear', blockType: Scratch.BlockType.COMMAND, text: 'clear recording' },
                { opcode: 'setMax', blockType: Scratch.BlockType.COMMAND, text: 'set max seconds to [SECONDS]', arguments: {
                    SECONDS: { type: Scratch.ArgumentType.STRING, defaultValue: '30' }
                }},
                { opcode: 'download', blockType: Scratch.BlockType.COMMAND, text: 'download recording (wav) [NAME]', arguments: {
                    NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'recording.wav' }
                }}
            ],
            menus: {}
        };
    }

    async start() {
        if (this.isRecording) return;
        this.isRecording = true;
        try {
            this.micStream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioCtx = this.audioCtx || new AudioContext();
            this.sampleRate = this.audioCtx.sampleRate || 44100;
            this.maxSamples = Math.floor(this.sampleRate * this.maxSeconds);
            if (this.audioCtx.state === 'suspended') await this.audioCtx.resume();

            const bufferSize = 1024;
            this.processorNode = this.audioCtx.createScriptProcessor(bufferSize, 1, 1);

            this.silentGainNode = this.audioCtx.createGain();
            this.silentGainNode.gain.value = 0;

            this.micSource = this.audioCtx.createMediaStreamSource(this.micStream);
            this.micSource.connect(this.processorNode);
            this.processorNode.connect(this.silentGainNode);
            this.silentGainNode.connect(this.audioCtx.destination);

            this.processorNode.onaudioprocess = (e) => {
                const input = e.inputBuffer.getChannelData(0);
                if (!input || input.length === 0) return;
                this.latestSample = input[0];

                const needed = input.length;
                const current = this.samples.length;
                if (current + needed > this.maxSamples) {
                    const overflow = current + needed - this.maxSamples;
                    this.samples = overflow < 10000 ? this.samples.slice(overflow) : this.samples.slice(overflow);
                }
                for (let i = 0; i < input.length; i++) this.samples.push(input[i]);
            };
        } catch (err) {
            console.error('Start recording error:', err);
            this._cleanup();
            this.isRecording = false;
        }
    }

    stop() {
        if (!this.isRecording) return;
        try {
            if (this.processorNode) { this.processorNode.onaudioprocess = null; this.processorNode.disconnect(); this.processorNode = null; }
            if (this.micSource) { this.micSource.disconnect(); this.micSource = null; }
            if (this.silentGainNode) { this.silentGainNode.disconnect(); this.silentGainNode = null; }
            if (this.micStream) { this.micStream.getTracks().forEach(t => t.stop()); this.micStream = null; }
        } finally { this.isRecording = false; }
    }

    _cleanup() {
        try {
            if (this.processorNode) { this.processorNode.onaudioprocess = null; this.processorNode.disconnect(); this.processorNode = null; }
            if (this.micSource) { this.micSource.disconnect(); this.micSource = null; }
            if (this.silentGainNode) { this.silentGainNode.disconnect(); this.silentGainNode = null; }
            if (this.micStream) { this.micStream.getTracks().forEach(t => t.stop()); this.micStream = null; }
        } catch(e){}
    }

    play() {
        if (!this.audioCtx) this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        if (this.audioCtx.state === 'suspended') this.audioCtx.resume();
        if (this.samples.length === 0) return;

        const buffer = this.audioCtx.createBuffer(1, this.samples.length, this.sampleRate);
        buffer.getChannelData(0).set(new Float32Array(this.samples));
        const src = this.audioCtx.createBufferSource();
        src.buffer = buffer;
        src.connect(this.audioCtx.destination);
        src.start(0);
        src.onended = () => { try { src.disconnect(); } catch(e){} };
    }

    playArray(args) {
        let arr = [];
        const raw = args && args.ARRAY ? args.ARRAY : '[]';
        try { arr = JSON.parse(raw); } catch(e){ if(raw.includes(',')) arr = raw.split(',').map(Number); }
        if(arr.length === 0) arr = [Number(raw) || 0];
        const floats = new Float32Array(arr.map(v => Math.max(-1, Math.min(1, v))));
        if(floats.length === 0) return;

        const buffer = this.audioCtx.createBuffer(1, floats.length, this.audioCtx.sampleRate || 44100);
        buffer.getChannelData(0).set(floats);
        const src = this.audioCtx.createBufferSource();
        src.buffer = buffer;
        src.connect(this.audioCtx.destination);
        src.start(0);
        src.onended = () => { try { src.disconnect(); } catch(e){} };
    }

    micSample() { return Math.max(-1, Math.min(1, this.latestSample)); }
    allSamples() { return JSON.stringify(this.samples); }
    length() { return this.samples.length; }
    clear() { this.samples = []; this.latestSample = 0; }
    setMax(args) { this.maxSeconds = Math.max(1, Number(args.SECONDS) || this.maxSeconds); this.maxSamples = Math.floor((this.audioCtx?.sampleRate || this.sampleRate) * this.maxSeconds); }

    download(args) {
        if (!this.samples.length) return;
        const name = args?.NAME || 'recording.wav';
        const rate = this.audioCtx?.sampleRate || this.sampleRate;
        const buffer = new ArrayBuffer(44 + this.samples.length * 2);
        const view = new DataView(buffer);

        const writeStr = (v, o, s) => { for(let i=0;i<s.length;i++) v.setUint8(o+i,s.charCodeAt(i)); };

        writeStr(view,0,'RIFF'); view.setUint32(4,36+this.samples.length*2,true); writeStr(view,8,'WAVE');
        writeStr(view,12,'fmt '); view.setUint32(16,16,true); view.setUint16(20,1,true); view.setUint16(22,1,true); view.setUint32(28,rate*2,true); view.setUint16(32,2,true); view.setUint16(34,16,true);
        writeStr(view,36,'data'); view.setUint32(40,this.samples.length*2,true);

        let offset = 44;
        for (let i=0;i<this.samples.length;i++,offset+=2){
            let s=Math.max(-1,Math.min(1,this.samples[i]));
            s = s<0?s*0x8000:s*0x7FFF;
            view.setInt16(offset,Math.floor(s),true);
        }

        const blob = new Blob([view], { type:'audio/wav' });
        const url = URL.createObjectURL(blob);
        const a=document.createElement('a');
        a.style.display='none'; a.href=url; a.download=name; document.body.appendChild(a); a.click();
        setTimeout(()=>{document.body.removeChild(a); URL.revokeObjectURL(url);},1000);
    }
}

(function(){
    if(typeof Scratch!=='undefined'&&Scratch.extensions) Scratch.extensions.register(new VoiceRecorder());
    else if(typeof window!=='undefined'){ window.VoiceRecorder=VoiceRecorder; console.log('VoiceRecorder loaded'); }
})();
