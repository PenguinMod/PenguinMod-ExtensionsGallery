// Dictation v1.3 by pooiod7

(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) throw new Error('Dictation Must Run Unsandboxed!');

  class pooiod7Dictation {
    constructor() {
      this.recognizedSpeech = "";
      this.cando = !typeof scaffolding === "undefined";
    }

    getInfo() {
      return {
        id: 'pooiod7Dictation',
        name: 'Dictation',
        color1: '#b969cf',
        color2: '#9253a3',
        blocks: [
          {
            opcode: 'canUse',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Can use dictation',
          },
          {
            opcode: 'WaitAndrecognizeSpeech',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Recognize speech and wait',
          },
          {
            opcode: 'getRecognizedSpeech',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Last recognized speech',
          },
          {
            opcode: 'GetSpeech',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Wait for recognized speech',
            disableMonitor: true,
          }
        ]
      };
    }

    WaitAndrecognizeSpeech() {
      return this.recognizeSpeech(false);
    }

    canUse() {
      return window.webkitSpeechRecognition != undefined
    }

    getRecognizedSpeech() {
      return this.recognizedSpeech ?? "";
    }

    GetSpeech() {
      return this.recognizeSpeech(true);
    }

    recognizeSpeech(show) {
      if (!this.cando) this.cando = window.confirm("Do you want to share your speech as text?");
      if (this.cando) {
        return new Promise(resolve => {
          this.recognizedSpeech = "";
          const recognition = new webkitSpeechRecognition();
          recognition.onresult = event => {
            if (event.results.length > 0) {
              this.recognizedSpeech = event.results[0][0].transcript;
              if (show) resolve(this.recognizedSpeech);
              else resolve("");
            }
          };
          recognition.start();
        });
      }
    }

  }
  Scratch.extensions.register(new pooiod7Dictation());
})(Scratch);
