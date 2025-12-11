class EnhancedRecorderExtension {
    constructor(runtime) {
        this.runtime = runtime;

        // Audio nodes / state
        this.audioContext = null;
        this.stream = null;
        this.source = null;
        this.processor = null;
        this.silentGain = null;

        // Recording buffer (raw floats)
        this.recordedData = [];

        // Latest sample for mic sample reporter
        this.latestSample = 0;

        // Recording state
        this.isRecording = false;

        // Config: maximum recording seconds to keep in memory (prevents huge RAM usage)
        this.maxRecordingSeconds = 30; // default 30s
        this.maxSamples = 44100 * this.maxRecordingSeconds; // updated when context created
        this.sampleRate = 44100; // will be overwritten with actual context sampleRate
    }

    getInfo() {
        return {
            id: 'enhancedRecorder',
            name: 'PenguinMic',
            color1: '#FF7043',
            color2: '#D84315',
            blocks: [
                { opcode: 'startRecording', blockType: Scratch.BlockType.COMMAND, text: 'start recording' },
                { opcode: 'stopRecording', blockType: Scratch.BlockType.COMMAND, text: 'stop recording' },
                { opcode: 'playRecording', blockType: Scratch.BlockType.COMMAND, text: 'play recording' },
                { opcode: 'playSamples', blockType: Scratch.BlockType.COMMAND, text: 'play samples [SAMPLES]', arguments: {
                    SAMPLES: { type: Scratch.ArgumentType.STRING, defaultValue: '[]' }
                } },
                { opcode: 'getSample', blockType: Scratch.BlockType.REPORTER, text: 'mic sample' },
                { opcode: 'getRecordedData', blockType: Scratch.BlockType.REPORTER, text: 'recorded data (json)' },
                { opcode: 'getRecordingLength', blockType: Scratch.BlockType.REPORTER, text: 'recording length (samples)' },
                { opcode: 'clearRecording', blockType: Scratch.BlockType.COMMAND, text: 'clear recording' },
                { opcode: 'setMaxSeconds', blockType: Scratch.BlockType.COMMAND, text: 'set max recording seconds to [SECONDS]', arguments: {
                    SECONDS: { type: Scratch.ArgumentType.STRING, defaultValue: '30' }
                } },
                { opcode: 'downloadWav', blockType: Scratch.BlockType.COMMAND, text: 'download recording (wav) [FILENAME]', arguments: {
                    FILENAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'recording.wav' }
                } }
            ],
            menus: {}
        };
    }

    // --- Recording control ---
    async startRecording() {
        if (this.isRecording) return;
        this.isRecording = true;

        try {
            // Request mic
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create or reuse AudioContext
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.audioContext = this.audioContext || new AudioContext();

            // Get actual sample rate
            this.sampleRate = this.audioContext.sampleRate || 44100;
            this.maxSamples = Math.floor(this.sampleRate * Number(this.maxRecordingSeconds || 30));

            // Resume if suspended
            if (this.audioContext.state === 'suspended') {
                try { await this.audioContext.resume(); } catch (e) {}
            }

            // ScriptProcessorNode for wide compatibility
            const bufferSize = 1024;
            this.processor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);

            // Silent gain to keep node in graph without audible output
            this.silentGain = this.audioContext.createGain();
            try { this.silentGain.gain.value = 0; } catch (e) {}

            // Source
            this.source = this.audioContext.createMediaStreamSource(this.stream);

            // Connect graph: source -> processor -> silentGain -> destination
            this.source.connect(this.processor);
            this.processor.connect(this.silentGain);
            this.silentGain.connect(this.audioContext.destination);

            // onaudioprocess: push samples into internal buffer
            this.processor.onaudioprocess = (event) => {
                try {
                    const input = event.inputBuffer.getChannelData(0); // Float32Array
                    if (!input || input.length === 0) return;

                    // update single-sample reporter
                    this.latestSample = input[0];

                    // push input samples into recordedData
                    // keep within memory cap: if buffer would exceed maxSamples, drop oldest
                    const neededSpace = input.length;
                    const currentLen = this.recordedData.length;
                    if (currentLen + neededSpace > this.maxSamples) {
                        const overflow = (currentLen + neededSpace) - this.maxSamples;
                        // remove oldest samples (shift). For large arrays this can be slow,
                        // so use a more efficient slice reassignment when overflow large.
                        if (overflow < 10000) {
                            this.recordedData.splice(0, overflow);
                        } else {
                            // rebuild trimmed array
                            this.recordedData = this.recordedData.slice(overflow);
                        }
                    }

                    // Copy typed array values to JS array (raw floats)
                    for (let i = 0; i < input.length; i++) {
                        this.recordedData.push(input[i]);
                    }
                } catch (e) {
                    console.error('EnhancedRecorder onaudioprocess error:', e);
                }
            };
        } catch (err) {
            console.error('EnhancedRecorder startRecording error:', err);
            // cleanup if start fails
            this._cleanupAfterError();
            this.isRecording = false;
        }
    }

    stopRecording() {
        if (!this.isRecording) return;
        try {
            if (this.processor) {
                try { this.processor.onaudioprocess = null; } catch (e) {}
                try { this.processor.disconnect(); } catch (e) {}
                this.processor = null;
            }
            if (this.source) {
                try { this.source.disconnect(); } catch (e) {}
                this.source = null;
            }
            if (this.silentGain) {
                try { this.silentGain.disconnect(); } catch (e) {}
                this.silentGain = null;
            }
            if (this.stream) {
                try { this.stream.getTracks().forEach(t => t.stop()); } catch (e) {}
                this.stream = null;
            }
        } finally {
            this.isRecording = false;
        }
    }

    _cleanupAfterError() {
        try {
            if (this.processor) { try { this.processor.onaudioprocess = null; } catch (e) {} this.processor.disconnect(); this.processor = null; }
            if (this.source) { try { this.source.disconnect(); } catch (e) {} this.source = null; }
            if (this.silentGain) { try { this.silentGain.disconnect(); } catch (e) {} this.silentGain = null; }
            if (this.stream) { try { this.stream.getTracks().forEach(t => t.stop()); } catch (e) {} this.stream = null; }
        } catch (e) { /* ignore */ }
    }

    // --- Playback: play the internal recorded buffer directly (fast, no JSON) ---
    playRecording() {
        try {
            if (!this.audioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
            }
            if (this.audioContext.state === 'suspended') {
                try { this.audioContext.resume(); } catch (e) {}
            }
        } catch (e) {
            console.error('EnhancedRecorder playRecording: no AudioContext', e);
            return;
        }

        const len = this.recordedData.length;
        if (len === 0) return;

        try {
            const sampleRate = this.sampleRate || this.audioContext.sampleRate || 44100;
            const buffer = this.audioContext.createBuffer(1, len, sampleRate);
            buffer.getChannelData(0).set(new Float32Array(this.recordedData));

            const src = this.audioContext.createBufferSource();
            src.buffer = buffer;
            src.connect(this.audioContext.destination);
            src.start(0);
            src.onended = () => { try { src.disconnect(); } catch (e) {} };
        } catch (e) {
            console.error('EnhancedRecorder playRecording failed:', e);
        }
    }

    // --- Backwards-compatible: play arbitrary samples passed from Scratch (JSON/list/array) ---
    playSamples(args) {
        // Accepts args.SAMPLES as JSON string, CSV, JS array, or Scratch list-like object
        const raw = args && args.SAMPLES ? args.SAMPLES : '[]';
        let arr = [];

        // Normalize raw into arr[]
        if (Array.isArray(raw)) {
            arr = raw.slice();
        } else if (typeof raw === 'string') {
            const s = raw.trim();
            if (s.startsWith('[')) {
                try { arr = JSON.parse(s); } catch (e) { /* fallthrough */ }
            }
            if (arr.length === 0 && s.includes(',')) {
                arr = s.split(',').map(v => parseFloat(v));
            }
            if (arr.length === 0 && s.length > 0 && !s.includes(',')) {
                const n = parseFloat(s);
                if (!Number.isNaN(n)) arr = [n];
            }
        } else if (typeof raw === 'object' && raw !== null) {
            if (Array.isArray(raw.items)) arr = raw.items.slice();
            else if (Array.isArray(raw.value)) arr = raw.value.slice();
            else if (Array.isArray(raw.contents)) arr = raw.contents.slice();
            else {
                try {
                    for (const k in raw) {
                        if (Object.prototype.hasOwnProperty.call(raw, k)) {
                            const v = raw[k];
                            if (!Number.isNaN(Number(v))) arr.push(Number(v));
                        }
                    }
                } catch (e) {}
            }
        }

        // Convert to Float32Array
        const floats = new Float32Array(arr.length);
        for (let i = 0; i < arr.length; i++) {
            let v = Number(arr[i]) || 0;
            if (v > 1) v = 1;
            if (v < -1) v = -1;
            floats[i] = v;
        }

        if (floats.length === 0) return;

        // Play buffer
        try {
            if (!this.audioContext) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                this.audioContext = new AudioContext();
            }
            if (this.audioContext.state === 'suspended') {
                try { this.audioContext.resume(); } catch (e) {}
            }

            const sampleRate = this.audioContext.sampleRate || 44100;
            const buffer = this.audioContext.createBuffer(1, floats.length, sampleRate);
            buffer.getChannelData(0).set(floats);

            const src = this.audioContext.createBufferSource();
            src.buffer = buffer;
            src.connect(this.audioContext.destination);
            src.start(0);
            src.onended = () => { try { src.disconnect(); } catch (e) {} };
        } catch (e) {
            console.error('EnhancedRecorder playSamples failed:', e);
        }
    }

    // Reporter: latest mic sample (float)
    getSample() {
        if (!this.isRecording) return 0;
        const s = Number(this.latestSample) || 0;
        if (s > 1) return 1;
        if (s < -1) return -1;
        return s;
    }

    // Reporter: dump recordedData as JSON of raw floats
    getRecordedData() {
        try {
            return JSON.stringify(this.recordedData);
        } catch (e) {
            console.error('EnhancedRecorder getRecordedData stringify failed:', e);
            return this.recordedData.join(',');
        }
    }

    // Reporter: how many samples are in recording
    getRecordingLength() {
        return this.recordedData ? this.recordedData.length : 0;
    }

    // Clear the internal recording buffer
    clearRecording() {
        this.recordedData = [];
        this.latestSample = 0;
    }

    // Set the max recording seconds (changes memory cap)
    setMaxSeconds(args) {
        const seconds = Math.max(1, Number(args && args.SECONDS ? args.SECONDS : this.maxRecordingSeconds) || this.maxRecordingSeconds);
        this.maxRecordingSeconds = seconds;
        this.maxSamples = Math.floor((this.audioContext ? this.audioContext.sampleRate : this.sampleRate) * this.maxRecordingSeconds);
    }

    // Download recording as a WAV file (16-bit PCM)
    downloadWav(args) {
        const filename = (args && args.FILENAME) ? String(args.FILENAME) : 'recording.wav';
        if (!this.recordedData || this.recordedData.length === 0) return;

        try {
            const sampleRate = this.sampleRate || (this.audioContext && this.audioContext.sampleRate) || 44100;
            // Convert float32 [-1,1] to 16-bit PCM
            const buffer = new ArrayBuffer(44 + this.recordedData.length * 2);
            const view = new DataView(buffer);

            function writeString(view, offset, string) {
                for (let i = 0; i < string.length; i++) {
                    view.setUint8(offset + i, string.charCodeAt(i));
                }
            }

            // RIFF header
            writeString(view, 0, 'RIFF');
            view.setUint32(4, 36 + this.recordedData.length * 2, true);
            writeString(view, 8, 'WAVE');
            writeString(view, 12, 'fmt ');
            view.setUint32(16, 16, true); // Subchunk1Size (16 for PCM)
            view.setUint16(20, 1, true); // AudioFormat (1 = PCM)
            view.setUint16(22, 1, true); // NumChannels
            view.setUint32(24, sampleRate, true); // SampleRate
            view.setUint32(28, sampleRate * 2, true); // ByteRate (SampleRate * NumChannels * BitsPerSample/8)
            view.setUint16(32, 2, true); // BlockAlign (NumChannels * BitsPerSample/8)
            view.setUint16(34, 16, true); // BitsPerSample
            writeString(view, 36, 'data');
            view.setUint32(40, this.recordedData.length * 2, true);

            // Write PCM samples
            let offset = 44;
            for (let i = 0; i < this.recordedData.length; i++, offset += 2) {
                let s = Math.max(-1, Math.min(1, this.recordedData[i]));
                // scale to 16-bit signed int
                s = s < 0 ? s * 0x8000 : s * 0x7FFF;
                view.setInt16(offset, Math.floor(s), true);
            }

            const blob = new Blob([view], { type: 'audio/wav' });
            const url = URL.createObjectURL(blob);

            // Create a temporary link and click it
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = filename;
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 1000);
        } catch (e) {
            console.error('EnhancedRecorder downloadWav failed:', e);
        }
    }
}

// Register extension
(function() {
    if (typeof Scratch !== 'undefined' && Scratch.extensions) {
        Scratch.extensions.register(new EnhancedRecorderExtension());
    } else if (typeof window !== 'undefined') {
        window.EnhancedRecorderExtension = EnhancedRecorderExtension;
        console.log('EnhancedRecorderExtension loaded. Use `new EnhancedRecorderExtension(runtime)` or register with Scratch.extensions.register(...)');
    }
})();
