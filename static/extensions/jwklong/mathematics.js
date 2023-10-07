class ComplexNumber {
  constructor(a = 0, b = 0) {
    this.real = a
    this.imaginary = b
  }
}

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
          blockType: Scratch.BlockType.BOOLEAN,
          text: '[X] ⇒ [Y]',
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
          blockType: Scratch.BlockType.BOOLEAN,
          text: '[X] ⇔ [Y]',
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
          blockType: Scratch.BlockType.LABEL,
          text: "Complex Numbers",
        },
        {
          opcode: 'imaginary',
          blockType: Scratch.BlockType.REPORTER,
          text: 'i',
          disableMonitor: true
        },
        {
          opcode: 'toComplex',
          blockType: Scratch.BlockType.REPORTER,
          text: 'convert [NUMBER] to complex',
          disableMonitor: true,
          arguments: {
            NUMBER: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0
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
            },
            { 
              text: 'e',
              value: 'e'
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
      case "e": return 2.718281828459045235360287471352662497757; break
      case "phi": return 1.618033988749894848204586834365638117720; break
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

  imaginary() {
    return JSON.stringify(new ComplexNumber(0, 1))
  }

  toComplex(args) {
    return JSON.stringify(new ComplexNumber(Number(args.NUMBER), 0))
  }
}
Scratch.extensions.register(new Mathematics())
