/*
@MIT LICENSE
@VERSION 1.0
CREATED BY MARIOCRAFT987
COME SEE RANDOMLY BLOCKS
*/
class CakeUtilitys {
    getInfo() {
      return {
        id: 'utilitysForCake',
        name: 'Cake Utilitys',
        color1: '#f75b00',
        color2: '#e85500',
        blocks: [
          {
            opcode: 'addmore',
            blockType: Scratch.BlockType.REPORTER,
            text: 'join [first] [second] [third] [fourth] [fifth]',
            disableMonitor: true,
            arguments: {
              first: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "apple "
              },
                second: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "banana "
              },
                 third: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "pear "
              },
                 fourth: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "orange "
              },
                fifth: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "kiwi "
              },
            }
          },
          {
            opcode: 'addupit',
            blockType: Scratch.BlockType.REPORTER,
            text: 'round [input]',
            disableMonitor: true,
            arguments: {
              input: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "4.7"
              },
            {
            opcode: 'pieinmath',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Math Pie',
            disableMonitor: true,
            },
        ],
      }
    }
    addmore(args) {
      return args.first + args.second + args.third + args.fourth + args.fifth;
    }
    additup(args) {
        let input = args.input
    return Math.round(input);
    }
    pieinmath(args) {
        return Math.PI
    }

  }
  
  Scratch.extensions.register(new CakeUtilitys())
