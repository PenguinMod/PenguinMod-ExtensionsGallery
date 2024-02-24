/*
@MIT LICENSE (C)
@VERSION 1.2
@MARIOCRAFT987
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
            text: 'Do I exist?',
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
            
        ],
      };
    }
    alertname(args) {
      alert(args.STR)
    }

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

    notExist(args) {
      return false
    }

    amExist(args) {
      return true
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
  }
  
  Scratch.extensions.register(new RandomlyBlocks())
})(Scratch);
