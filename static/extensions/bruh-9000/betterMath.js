class BetterMath {
  getInfo() {
    return {
      id: 'bettermath',
      name: 'Better Math',
      blocks: [
        {
          opcode: 'degreeToRadian',
          blockType: Scratch.BlockType.REPORTER,
          text: 'convert [degree] to a radian',
          arguments: {
            degree: {
              type: Scratch.ArgumentType.NUMBER
            }
          }
        },
        {
          opcode: 'radianToDegree',
          blockType: Scratch.BlockType.REPORTER,
          text: 'convert [radian] to a degree',
          arguments: {
            radian: {
              type: Scratch.ArgumentType.NUMBER
            }
          }
        },
        {
          opcode: 'signOfNumber',
          blockType: Scratch.BlockType.REPORTER,
          text: 'sign of [number]',
          arguments: {
            number: {
              type: Scratch.ArgumentType.NUMBER
            }
          }
        },
        {
          opcode: 'maximum',
          blockType: Scratch.BlockType.REPORTER,
          text: '[num1] maximum [num2]',
          arguments: {
            num1: {
              type: Scratch.ArgumentType.NUMBER
            },
            num2: {
              type: Scratch.ArgumentType.NUMBER
            }
          }
        },
        {
          opcode: 'minimum',
          blockType: Scratch.BlockType.REPORTER,
          text: '[num1] minimum [num2]',
          arguments: {
            num1: {
              type: Scratch.ArgumentType.NUMBER
            },
            num2: {
              type: Scratch.ArgumentType.NUMBER
            }
          }
        }
      ]
    };
  }

  degreeToRadian(args) {
    return args.degree*0.01745329251;
  }
  radianToDegree(args) {
    return args.radian*57.2957795131;
  }
  signOfNumber(args) {
    if (args.number > 0) {
      return 1;
    } else if (args.number < 0) {
      return -1;
    } else {
      return 0;
    }
  }
  maximum(args) {
    return args.num1 > args.num2 ? args.num1 : args.num2;
  }
  minimum(args) {
    return args.num1 < args.num2 ? args.num1 : args.num2;
  }
}

Scratch.extensions.register(new BetterMath());