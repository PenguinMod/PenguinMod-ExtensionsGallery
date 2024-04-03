/*
   Just some joke blocks 😅
   MIT Licensed
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
            blockType: Scratch.BlockType.BOOLEAN,
            text: '(⌐■_■)',
            disableMonitor: true,
          },
          {
            opcode: 'notcool',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '( •_•)>⌐■-■',
            disableMonitor: true,
          },
          {
            opcode: 'heppy',
            blockType: Scratch.BlockType.REPORTER,
            text: '( ͡° ͜ʖ ͡°)',
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
      return true;
    }    
    notcool(args) {
      return false;
    }    
    heppy(args) {
       throw new Error("Glitch of some sort?!");
    }
  }
  Scratch.extensions.register(new PureComedy())
})(Scratch);
