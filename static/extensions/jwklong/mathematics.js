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
        "---",
        {
          opcode: 'addComplex',
          blockType: Scratch.BlockType.REPORTER,
          text: 'complex [X] + [Y]',
          disableMonitor: true,
          arguments: {
            X: {},
            Y: {}
          }
        },
        {
          opcode: 'subComplex',
          blockType: Scratch.BlockType.REPORTER,
          text: 'complex [X] - [Y]',
          disableMonitor: true,
          arguments: {
            X: {},
            Y: {}
          }
        },
        {
          opcode: 'mulComplex',
          blockType: Scratch.BlockType.REPORTER,
          text: 'complex [X] * [Y]',
          disableMonitor: true,
          arguments: {
            X: {},
            Y: {}
          }
        },
        {
          opcode: 'divComplex',
          blockType: Scratch.BlockType.REPORTER,
          text: 'complex [X] / [Y]',
          disableMonitor: true,
          arguments: {
            X: {},
            Y: {}
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

  addComplex(args) {
    try {
      var x = JSON.parse(args.X)
      var y = JSON.parse(args.Y)
      return JSON.stringify(new ComplexNumber(Number(x.real) + Number(y.real), Number(x.imaginary) + Number(y.imaginary)))
    } catch {
      return JSON.stringify(new ComplexNumber(0, 0))
    }
  }

  subComplex(args) {
    try {
      var x = JSON.parse(args.X)
      var y = JSON.parse(args.Y)
      return JSON.stringify(new ComplexNumber(Number(x.real) - Number(y.real), Number(x.imaginary) - Number(y.imaginary)))
    } catch {
      return JSON.stringify(new ComplexNumber(0, 0))
    }
  }

  mulComplex(args) {
    try {
      var x = JSON.parse(args.X)
      var y = JSON.parse(args.Y)

      var a = Number(x.real) * Number(y.real)
      var b = Number(x.imaginary) * Number(y.real)
      var c = Number(x.real) * Number(y.imaginary)
      var d = Number(x.imaginary) * Number(y.imaginary) * -1
      
      return JSON.stringify(new ComplexNumber(a + d, b + c))
    } catch {
      return JSON.stringify(new ComplexNumber(0, 0))
    }
  }

  divComplex(args) {
    try {
      var x = JSON.parse(args.X)
      var y = JSON.parse(args.Y)
      
      return this.mulComplex({
        X: x,
        Y: new ComplexNumber(1 / Number(y.real), 1 / Number(y.imaginary))
      })
    } catch {
      return JSON.stringify(new ComplexNumber(0, 0))
    }
  }
}
Scratch.extensions.register(new Mathematics())
