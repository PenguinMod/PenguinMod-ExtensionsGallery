// Dictation v1.2 by pooiod7

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Your microphone can\'t be accessed in the sandbox');
  }

  class dictation {
    constructor() {
      this.recognizedSpeech;
      this.cando = Scratch.vm.runtime.isPackaged;
    }

    getInfo() {
      return {
        id: 'dictation',
        name: 'Dictation',
        color1: '#b969cf',
        color2: '#9253a3',
        blocks: [
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
            opcode: 'GetSpeach',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Wait for recognized speach',
            disableMonitor: true,
          },
          {
            opcode: 'canuse',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Can use dictation',
          },
        ]
      };
    }

    WaitAndrecognizeSpeech() {
      return this.recognizeSpeech(false);
    }

    canuse() {
      return window.webkitSpeechRecognition != undefined
    }

    getRecognizedSpeech() {
      return this.recognizedSpeech;
    }

    GetSpeach() {
      return this.recognizeSpeech(true);
    }

    recognizeSpeech(show) {
      if (this.cando) {
        return new Promise(resolve => {
          this.recognizedSpeech = '';
          const recognition = new webkitSpeechRecognition();
          recognition.onresult = event => {
            if (event.results.length > 0) {
              this.recognizedSpeech = event.results[0][0].transcript;
              if (show) {
                resolve(this.recognizedSpeech);
              } else {
                resolve();
              }
            }
          };
          recognition.start();
        });
      } else {
        this.cando = window.confirm("Do you want to share your speach as text?");
      }
    }

  }
  Scratch.extensions.register(new dictation());
})(Scratch);
