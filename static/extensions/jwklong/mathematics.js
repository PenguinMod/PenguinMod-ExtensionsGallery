class Mathematics {
  getInfo() {
    return {
      id: 'jwklongmathematics',
      name: 'Mathematics',
      color1: '#7ac94f',
      color2: '#6aa14d',
      blocks: [
        {
          opcode: 'constant',
          blockType: Scratch.BlockType.REPORTER,
          text: 'constant [CONSTANT]',
          disableMonitor: true,
          arguments: {
            CONSTANT: {
              type: Scratch.ArgumentType.STRING,
              menu: 'CONSTANT'
            }
          }
        },
        {
          blockType: Scratch.BlockType.LABEL,
          text: "Boolean Operations",
        },
        {
          opcode: 'matConditional',
          blockType: Scratch.BlockType.REPORTER,
          text: '[X] → [Y]',
          disableMonitor: true,
          arguments: {
            X: {
              type: Scratch.ArgumentType.BOOLEAN,
            },
            Y: {
              type: Scratch.ArgumentType.BOOLEAN,
            }
          }
        },
        {
          opcode: 'matBiconditional',
          blockType: Scratch.BlockType.REPORTER,
          text: '[X] ↔ [Y]',
          disableMonitor: true,
          arguments: {
            X: {
              type: Scratch.ArgumentType.BOOLEAN,
            },
            Y: {
              type: Scratch.ArgumentType.BOOLEAN,
            }
          }
        },
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
            },
            {
              text: 'ϕ',
              value: 'phi'
            }
          ]
        }
      }
    }
  }

  constant(args) {
    switch (args.CONSTANT) {
      case "pi": return 3.141592653589793238462643383279502884197; break
      case "tau": return 3.141592653589793238462643383279502884197 * 2; break
      case "phi": return 1.61803398874989484820458683436563811; break
      default: return 0; break
    }
  }

  _matConditional(x, y) {
    return !x || y
  }
  
  matConditional(args) {
    return this._matConditional(args.X, args.Y)
  }
  
  matBiconditional(args) {
    return this._matConditional(args.X, args.Y) && this._matConditional(args.Y, args.X)
  }
}
Scratch.extensions.register(new Mathematics())
