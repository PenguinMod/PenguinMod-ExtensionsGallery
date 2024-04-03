/*
   Just some joke blocks 😅
   MIT Licensed
*/

(function (Scratch) {
  "use strict";
  class PureEmoji {
    getInfo() {
      return {
        id: 'purecomedylaffs',
        name: 'Pure Emoji (Joke Extension)',
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
           "---",
          {
            opcode: 'heppy',
            blockType: Scratch.BlockType.REPORTER,
            text: '( ͡° ͜ʖ ͡°)',
            disableMonitor: true,
          },
          {
            opcode: 'decode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'decode [STR] to emoji',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: ":)"
              },
            }
          },
          {
            opcode: 'encode',
            blockType: Scratch.BlockType.REPORTER,
            text: 'encode [STR] to texmoji',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "🙂"
              },
            }
          },
            
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
    decode(args) {
       let e = args.STR
       return e.replaceAll(":)", "🙂")
       .replaceAll(":D", "😀")
       .replaceAll("B)", "😎")
       .replaceAll(":P", "😜")
       .replaceAll(":l", "😐")
       .replaceAll(":O", "😮")
       .replaceAll(":/", "🫤")
       .replaceAll("-_-", "😑")
       .replaceAll("ToT", "😭")
       .replaceAll("lol", "😂")
       .replaceAll("rofl", "🤣")
    }
    encode(args) {
       let e = args.STR
       return e.replaceAll("🙂", ":)")
       .replaceAll("😀", ":D")
       .replaceAll("😎", "B)")
       .replaceAll("😜", ":P")
       .replaceAll("😐", ":l")
       .replaceAll("😮", ":O")
       .replaceAll("🫤", ":/")
       .replaceAll("😑", "-_-")
       .replaceAll("😭", "ToT")
       .replaceAll("😂", "lol")
       .replaceAll("🤣", "rofl")
    }
      
   }
  Scratch.extensions.register(new PureEmoji())
})(Scratch);
