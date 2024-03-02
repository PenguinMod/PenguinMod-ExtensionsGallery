/*
@Under MIT LICENSE (C)
@Version 1.7
@Created by Mariocraft987
*/

(function (Scratch) {
  "use strict";
  class RandomlyBlocks {
    getInfo() {
      return {
        id: 'randomlyblockscool',
        name: 'Randomly Blocks',
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
                defaultValue: "Hello world!"
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
            text: 'True?',
            disableMonitor: true,
          },
          {
            opcode: 'notExist',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Do Dinosaurs exist?',
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
            opcode: 'getDate',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get Date',
            disableMonitor: true,
          },
          {
            opcode: 'getMilisecs',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get Miliseconds',
            disableMonitor: true,
          },
          {
            opcode: 'getTime1970',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get Miliseconds since 1970',
            disableMonitor: true,
          },
          {
            opcode: 'currentHolliday',
            blockType: Scratch.BlockType.REPORTER,
            text: 'current holliday',
            disableMonitor: true, 
          },
            
        ],
      };
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

    consoleAdd(args) {
      console.log(args.STR)
    }

    consoleError(args) {
      window.console.error(args.STR)
    }
    
    amExist(args) {
      return "Imposter Reporter as a Boolean!!"
    }
    
    notExist(args) {
      return false
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
    
    inputAlert(args) {
        let question = args.STR
        let normal = args.default
        let answer = prompt(question, normal);
      if (answer != null) {
        return answer
      }
    }
    
    currentHolliday(args) {
        let date = new Date();
        let month = date.getMonth()
        let day = date.getDate()
            if (month == 0) {
                if (day == 1) {return "new year"}
                if (day == 15) {return "martin luther king"}
            }else
            if (month == 1) {
                if (day == 2) {return "groundhogs day"}
                if (day == 19) {return "presidents day"}
            }else
            if (month == 2) {
                if (day == 31) {return "easter"}
            }else
            if (month == 3) {
                if (day == 15) {return "tax day"}
            }else
            if (month == 4) {
                if (day == 12) {return "mothers day"}
            }else
            if (month == 5) {
                if (day == 16) {return "fathers day"}
            }else
            if (month == 6) {
                if (day == 4) {return "independence day"}
                if (day == 28) {return "parents day"}
            }else
            if (month == 7) {
                /* Nothing much */
            }else
            if (month == 8) {
                if (day == 2) {return "labor day"}
            }else
            if (month == 9) {
                if (day == 31) {return "halloween"}
            }else
            if (month == 10) {
                if (day == 28) {return "thanksgiving"}
            }else
            if (month == 11) {
                if (day == 25) {return "christmas"}
                if (day == 31) {return "new years eve"}
            }
            return "No Importent Hollidays Today!"
        }
  }
  
  Scratch.extensions.register(new RandomlyBlocks())
})(Scratch);
