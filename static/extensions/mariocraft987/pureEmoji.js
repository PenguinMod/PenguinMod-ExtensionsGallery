/*
   Just some joke blocks 😅
   Happy Aprils Fools!
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
          {
            opcode: 'rating',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Movie rating of word [STR]',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Killer Sharks"
              },
            }
          },
           "---",
          {
            func: "dumb",
            blockType: Scratch.BlockType.BUTTON,
            text: "Useless button fr"
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
       throw new Error("Could not understand string: '( ͡° ͜ʖ ͡°)'");
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
     rating(args) {
        let w = args.STR.toLowerCase();
        if (w.includes("murder")||w.includes("kill")||w.includes("sex")||w.includes("fuck")){ return "R" } else
        if (w.includes("doll")||w.includes("creepy")||w.includes("love")||w.includes("damn")){ return "PG-13" } else
        if (w.includes("scary")||w.includes("hate")||w.includes("crap")||w.includes("shit")){ return "TV-MA" } else
        if (w.includes("fun")||w.includes("adventure")){ return "TV-Y7" } else
        { return "PG"}
     }
      
   }
  Scratch.extensions.register(new PureEmoji())
})(Scratch);
