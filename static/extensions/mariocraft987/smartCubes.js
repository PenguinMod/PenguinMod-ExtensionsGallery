/*
@Under MIT LICENSE (C)
@Version 0.5.2
@Created by Mariocraft987 <https://scratch.mit.edu/users/mariocraft987>
DO NOT REMOVE THIS COMMENT OR ELSE
*/

(async function (Scratch) {
  const array = [];
  const variables = [];
  
  class SmartCubes {
    getInfo() {
      return {
        id: 'thesmartestcodingcubes45',
        name: 'Smart Cubes',
        blocks: [
          {
            opcode: "runProject",
            blockType: Scratch.BlockType.COMMAND,
            text: "Wave green Flag",
            disableMonitor: true,
          },
          {
            opcode: "comment",
            blockType: Scratch.BlockType.COMMAND,
            text: "//[micro]",
            disableMonitor: true,
            arguments: {
              micro: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Comment"
              }
            }
          },
          {
            opcode: "longComment",
            blockType: Scratch.BlockType.CONDITIONAL,
            text: "/*",
            disableMonitor: true,
          },
          { blockType: Scratch.BlockType.LABEL, text: "Variable Blocks" },
          {
            opcode: "setVar",
            blockType: Scratch.BlockType.COMMAND,
            text: "set [STR] to [value]",
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "health"
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "3"
              }
            }
          },
          {
            opcode: "getVar",
            blockType: Scratch.BlockType.REPORTER,
            text: "get [STR]",
            disableMonitor: true,
            arguments: {
               STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "health"
              },
            }
          },
          { blockType: Scratch.BlockType.LABEL, text: "Array Blocks" },
          {
            opcode: "addArray",
            blockType: Scratch.BlockType.COMMAND,
            text: "Add [STR] to Array",
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Apple"
              }
            }
          },
          {
            opcode: "removeFromArray",
            blockType: Scratch.BlockType.COMMAND,
            text: "Remove [STR] from Array",
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: "0"
              }
            }
          },
          {
            opcode: "removeArray",
            blockType: Scratch.BlockType.COMMAND,
            text: "Remove the last item from Array",
            disableMonitor: true,
          },
          {
            opcode: "clearArray",
            blockType: Scratch.BlockType.COMMAND,
            text: "Clear Array",
            disableMonitor: true,
          },
          {
            opcode: "array",
            blockType: Scratch.BlockType.REPORTER,
            text: "Return Array",
            disableMonitor: true,
          },
          { blockType: Scratch.BlockType.LABEL, text: "AI Blocks" },
          {
            opcode: "AInow",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "Is CubeAI available?",
            disableMonitor: true,
          },
          {
            opcode: "AIdecide",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "True or false",
            disableMonitor: true,
          },
          {
            opcode: "AIcolor",
            blockType: Scratch.BlockType.REPORTER,
            text: "Random color hex",
            disableMonitor: true,
          },
          { blockType: Scratch.BlockType.LABEL, text: "Danger Zone" },
          {
            opcode: "localSet",
            blockType: Scratch.BlockType.COMMAND,
            text: "Localstorage: set [STR] to [value]",
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "name"
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Ted"
              }
            }
          },
          {
            opcode: "localGet",
            blockType: Scratch.BlockType.REPORTER,
            text: "Localstorage: get [STR]",
            disableMonitor: true,
            arguments: {
              STR: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "name"
              }
            }
          },
            
        ],
      };
    }
    
    runProject(args) {
      Scratch.vm.runtime.greenFlag();
    }
    comment(args) {
        // Comment 
        // args.micro
    }
    longComment(args) {
        /* Long Comment 
        args.micro */
    }
    clearArray(args) {
      while (array.length > 0) {
        array.pop();
      }
    }

    removeArray(args) {
      array.pop();
    }

    removeFromArray(args) {
        let value = args.STR
        array.splice(value, value);
    }
    
    addArray(args) {
      array.push(args.STR);
    }
    
    array(args) {
        return array
    }
    
    AInow(args) {
        return true
    }
    
    AIdecide(args) {
      let number = Math.floor(Math.random() * 2);
      if (number === 1) {
        return true
      }else{
        return false
      }
    }
    
    AIcolor(args) {
      return "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);})
    }
    
    localSet(args) {
      let string = args.STR
      let value = args.value
      localStorage.setItem(string, value)
    }
    localGet(args) {
      let value = localStorage.getItem(args.STR);
      if (!value) {
        return ""
      }else{
        return value
      }
    }
    
    setVar(args) {
      variables[args.STR] = args.value;
    }
    getVar(args) {
      let value = args.STR
      if (!value) {
        return ""
      }else{
        return variables[value];
      }
    }
    
  }
  Scratch.extensions.register(new SmartCubes())
})(Scratch);
