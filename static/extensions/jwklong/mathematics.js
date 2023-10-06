class Strings2 {
  getInfo() {
    return {
      id: 'jwklongmathematics',
      name: 'Mathematics',
      blocks: [
        {
          opcode: 'constant',
          blockType: Scratch.BlockType.REPORTER,
          text: 'constant [CONSTANT]',
          arguments: {
            CONSTANT: {
              type: Scratch.ArgumentType.STRING,
              menu: 'CONSTANT'
            }
          }
        }
      ],
      menus: {
        CONSTANT: {
          acceptReporters: false,
          items: [
            {
              text: 'π',
              value: 'pi'
            },
            {
              text: 'τ',
              value: 'tau'
            }
          ]
        }
      }
    }
  }

  constant(args) {
    switch (args.CONSTANT) {
      case "pi": return 3.141592653589793238462643383279502884197; break
      case "tau" return 3.141592653589793238462643383279502884197 * 2; break
      default: return 0; break
    }
  }
}
Scratch.extensions.register(new Strings2())
