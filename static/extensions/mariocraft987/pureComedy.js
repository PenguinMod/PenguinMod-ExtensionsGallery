/*
   Just some joke blocks 😅
*/

(function (Scratch) {
  "use strict";
  class PureComedy {
    getInfo() {
      return {
        id: 'purecomedylaffs',
        name: 'Pure Comedy (Joke Extension)',
        color1: '#ff4f4f',
        blocks: [
          {
            opcode: 'cool',
            blockType: Scratch.BlockType.REPORTER,
            text: '(⌐■_■)',
            disableMonitor: true,
          },
          /*
          {
            opcode: 'alertname',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Alert [STR]',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello world!"
              },
            }
          },
          */
            
        ],
      };
    }
    cool(args) {
      return "cool";
    }    
  }
  Scratch.extensions.register(new PureComedy())
})(Scratch);
