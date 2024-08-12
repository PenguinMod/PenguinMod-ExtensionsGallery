/*
Under @MIT LICENSE
Version 3.2
Created by AtomicBolts {scratch.mit.edu/users/mariocraft987}
*/

(function (Scratch) {
  "use strict";
  let hideEarlyAcessBlocks = true;
  class RandomlyBlocks {
    getInfo() {
      return {
        id: 'randomlyblockscool',
        name: 'Browser Interaction',
        color1: '#07f290',
        color2: '#1ee894',
        blocks: [
          {
            opcode: 'alertname',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Alert [STR]',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello, world!"
              },
            }
          },
          {
            opcode: 'changeTitle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Change website title to [STR]',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Randomly blocks"
              },
            }
          },
          {
            opcode: 'changeUrl',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Have [bot] Redirect user to [STR] in [NEWTAB]',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
              },
              bot: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Penguinmod"
              },
              NEWTAB: {
                type: Scratch.ArgumentType.STRING,
                menu: 'newTab',
                defaultValue: 'same'
              },
            }
          },
          {
            opcode: 'consoleAdd',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add [STR] to console log',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Penguin"
              },
            }
          },
          {
            opcode: 'consoleError',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add [STR] to console error',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "banana"
              },
            }
          },
          "---",
          {
            opcode: 'amExist',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Do Dinosoars still exist?',
            disableMonitor: true,
            hideFromPalette: true,
          },
          {
            opcode: 'notExist',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Do Dinosaurs exist?',
            disableMonitor: true,
            hideFromPalette: true,
          },
          {
            opcode: 'randomBoolean',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Random output',
            disableMonitor: true,
          },
          {
            opcode: 'YesNoAlert',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '"Ok" button pressed on alert [STR]?',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Popup"
              },
            }
          },
          {
            opcode: 'isBlank',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is not words or numbers [STR]',
            disableMonitor: true,
            hideFromPalette: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "   "
              },
            }
          },
          {
            opcode: 'inputAlert',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Input of [STR] with default of [default]',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "What's your username?"
              },
              default: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "mariocraft987"
              },
            }
          },
          {
            opcode: 'howManyIn',
            blockType: Scratch.BlockType.REPORTER,
            text: 'How many [WORD]s are in [STR]',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "cool is the cool and cool"
              },
              WORD: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "cool"
              },
            }
          },
          {
            opcode: 'replaceSelected',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Replace #[number] of [target] in [STR] with [selectedword]',
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "cat cat cat cat"
              },
              number: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 3
              },
              target: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "cat"
              },
              selectedword: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "dog"
              },
            }
          },
          {
            opcode: 'getDate',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Date',
            disableMonitor: true,
          },
          {
            opcode: 'getMilisecs',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Miliseconds',
            disableMonitor: true,
          },
          {
            opcode: 'getTime1970',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Miliseconds since 1970',
            disableMonitor: true,
          },
          {
            opcode: 'currentHolliday',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Current holliday',
            disableMonitor: true, 
          },
          {
            opcode: 'newImg',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get image URL of file selected',
            disableMonitor: true, 
            hideFromPalette: hideEarlyAcessBlocks,
          },
          "---",
          {
            func: "showEarlyAcessBlocks",
            blockType: Scratch.BlockType.BUTTON,
            text: "Early Acess Blocks",
            hideFromPalette: !hideEarlyAcessBlocks,
          },
          {
            func: "HideEarlyAcessBlocks",
            blockType: Scratch.BlockType.BUTTON,
            text: "Hide Early Acess Blocks",
            hideFromPalette: hideEarlyAcessBlocks,
          },

            
        ],
            menus: {
        newTab: [
          {text: 'same tab', value: 'same'},
          {text: 'new tab', value: 'new'},
        ]
      }
      };
    }

    // This show/hide blocks function is from Lily's Toolbox by LilyMakesThings
    showEarlyAcessBlocks(args) {
        if (
        confirm(
          "Are you sure about showing these Early Acess blocks? Some may be buggy because they are still in development"
        )
      ) {
        hideEarlyAcessBlocks = false;
        Scratch.vm.extensionManager.refreshBlocks();
      } else {
        //
      }
    }

    HideEarlyAcessBlocks() {
      hideEarlyAcessBlocks = true;
      Scratch.vm.extensionManager.refreshBlocks();
    }
    
    alertname(args) {
      alert(args.STR)
    }    
    // Old Block Test
    YNalert(args) {
      return("hello!")
    }

    changeTitle(args) {
      document.title = args.STR
    }

    /* 
      Wrong use with the redirect block can lead to major adult websites, so it is intended to ask for
      permission for the directed URL.
    */
    changeUrl(args) {
      let link = args.STR
      let bot = args.bot
      if (confirm(bot+" wants to redirect you to "+link) == true) {
        if (args.NEWTAB == "new") {
          window.open(args.STR, '_blank');
        }else{
          location.href = args.STR;
        }
      }
    }

    howManyIn(args) {
      let word = args.WORD
      let string = args.STR
      let result = string;
      let randomReplacer = Math.random();
      if (word == "") { // true
        console.log('user typed in ""')
        throw new Error('"" is not supported')
      } else { // false
        let i = 1;
        while (result.includes(word)) {
          i += 1;
          result = result.replace(word, randomReplacer);
        }
        result = result.replaceAll(randomReplacer, word);
        return (i - 1);
      }
    }
    
    consoleAdd(args) {
      console.log(args.STR)
    }

    consoleError(args) {
      window.console.error(args.STR)
    }
    
    amExist(args) {
      return "Imposter Reporter as a Boolean!!"
    }
    
    randomBoolean(args) {
      if ((Math.floor(Math.random() * 2)) == 1) {
      return true
      }else{
      return false
      }
    }
    
    getDate(args) {
      let date = Date()
      return date
    }

    getMilisecs(args) {
      let date = new Date()
      return date.getMilliseconds();
    }

    getTime1970(args) {
      let date = new Date()
      return date.getTime();
    }

    YesNoAlert(args) {
      let jtext = args.STR
      var pressLog
      if (confirm(jtext) == true) {
        pressLog = true
      } else {
        pressLog = false
      }
      return pressLog
    }

    isBlank(args) {
      return args.STR.trim() == "";
    }
    
    inputAlert(args) {
        let question = args.STR
        let normal = args.default
        let answer = prompt(question, normal);
      if (answer != null) {
        return answer
      }
    }

      replaceSelected(args) {
        let text = args.STR
        let target = args.target
        let selected = args.target
        let randomReplacer = Math.random();
        for (let i = 0; i < (args.number - 1); i++) {
          text = text.replace(target, randomReplacer)
        }
        text = text.replace(target, args.selectedword)
        text = text.replaceAll(randomReplacer, target)
        return text;
      }
    
    currentHolliday(args) {
        let date = new Date();
        let month = date.getMonth()
        let day = date.getDate()
            if (month == 0) {
                if (day == 1) {return "new_year"}
                if (day == 15) {return "martin_luther_king"}
            }else
            if (month == 1) {
                if (day == 2) {return "groundhogs_day"}
                if (day == 19) {return "presidents_day"}
            }else
            if (month == 2) {
                if (day == 31) {return "easter"}
            }else
            if (month == 3) {
                if (day == 15) {return "tax_day"}
            }else
            if (month == 4) {
                if (day == 12) {return "mothers_day"}
            }else
            if (month == 5) {
                if (day == 16) {return "fathers_day"}
            }else
            if (month == 6) {
                if (day == 4) {return "independence_day"}
                if (day == 28) {return "parents_day"}
            }else
            if (month == 7) {
                /* Nothing much */
            }else
            if (month == 8) {
                if (day == 2) {return "labor_day"}
            }else
            if (month == 9) {
                if (day == 31) {return "halloween"}
            }else
            if (month == 10) {
                if (day == 28) {return "thanksgiving"}
            }else
            if (month == 11) {
                if (day == 25) {return "christmas"}
                if (day == 31) {return "new_year_eve"}
            }
            return "none"
        }
        throwError(args) {
          throw new Error(args.STR)
        }
        newImg(args) {
    // Start of script
var input = document.createElement('input');
input.type = 'file';

input.onchange = e => { 

   // getting a hold of the file reference
   var file = e.target.files[0]; 

   // setting up the reader
   var reader = new FileReader();
   reader.readAsDataURL(file); // this is reading as data url

   // here we tell the reader what to do when it's done reading...
   reader.onload = readerEvent => {
      var content = readerEvent.target.result; // this is the content!
      let selectedImg = content
   }
  // End of script
  return selectedImg
}
input.click();
        }           
  }
  
  Scratch.extensions.register(new RandomlyBlocks())
})(Scratch);
