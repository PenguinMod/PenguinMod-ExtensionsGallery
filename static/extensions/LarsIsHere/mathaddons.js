(function(Scratch) {
    'use strict';

    class mathaddons {
        getInfo() {
            return {
              id: 'mathaddons',
              name: 'Math Addons',
              color1: '#c91e4c',
              color2: '#9e2143',
              blocks: [
                  {
                      opcode: 'calc1',
                      blockType: Scratch.BlockType.REPORTER,
                      text: '[OPERATOR] of [NUMBER]',
                      arguments: {
                          OPERATOR: {
                              type: Scratch.ArgumentType.STRING,
                              defaultValue: 'square root',
                              menu: 'operators1',
                          },
                          NUMBER: {
                              type: Scratch.ArgumentType.NUMBER,
                          }
                      }
                  },
                  '---',
                  {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Trigonometric ratios'
                  },
                  {
                    opcode: 'calc2',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[OPERATOR] of degree [NUMBER]',
                    arguments: {
                        OPERATOR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'sin',
                            menu: 'operators2',
                        },
                        NUMBER: {
                            type: Scratch.ArgumentType.NUMBER,
                        }
                    }
                },
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Inverse trigonometric functions'
                  },
                {
                    opcode: 'calc4',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[OPERATOR] of [NUMBER]',
                    arguments: {
                        OPERATOR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'asin',
                            menu: 'operators3',
                        },
                        NUMBER: {
                            type: Scratch.ArgumentType.NUMBER,
                        }
                    }
                },
                '---',
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Constants'
                },
                {
                    opcode: 'constants',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[CONSTANT]',
                    arguments: {
                        CONSTANT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'π',
                            menu: 'constants',
                        }
                    }
                },
                '---',
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Booleans'
                },
                {
                    opcode: 'mathbool',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: '[NUMBER] is [BOOLEAN]',
                    arguments: {
                        BOOLEAN: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'even',
                            menu: 'boolean',
                        },
                        NUMBER: {
                            type: Scratch.ArgumentType.NUMBER
                        }
                    }
                },
                '---',
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Other'
                },
                {
                    opcode: 'round',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[ROUND] [NUMBER]',
                    arguments: {
                        ROUND: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'round up',
                            menu: 'round',
                        },
                        NUMBER: {
                            type: Scratch.ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'remainder',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'remainder of [NUMBER1] ÷ [NUMBER2]',
                    arguments: {
                        NUMBER1: {
                            type: Scratch.ArgumentType.NUMBER
                        },
                        NUMBER2: {
                            type: Scratch.ArgumentType.NUMBER
                        }
                    }
                },
                {
                    opcode: 'constrain',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'constrain [NUMBER] low [LOW] high [HIGH]',
                    arguments: {
                        NUMBER: {
                            type: Scratch.ArgumentType.NUMBER
                        },
                        LOW: {
                            type: Scratch.ArgumentType.NUMBER
                        },
                        HIGH: {
                            type: Scratch.ArgumentType.NUMBER
                        }
                    }
                },
              ],
              menus: {
                operators1: {
                    acceptReporters: true,
                    items: ["square root","absolute","ln","log10","e^","10^"]
                },
                operators2: {
                    acceptReporters: true,
                    items: ["sin","cos","tan"]
                },
                operators3: {
                    acceptReporters: true,
                    items: ["asin","acos","atan"]
                },
                constants: {
                    acceptReporters: false,
                    items: ["π","e","φ","sqrt(2)","sqrt(½)","∞"]
                },
                boolean: {
                    acceptReporters: true,
                    items: ["even","odd","prime","whole","positive","negative"]
                },
                round: {
                    acceptReporters: true,
                    items: ["round up","round","round down"]
                },
                
              }
            };
          }
          calc1(args) {
            
  const operator = args.OPERATOR;
  const number = args.NUMBER;

  let result;

  switch (operator) {
    case 'square root':
      result = Math.sqrt(number);
      break;
    case 'absolute':
      result = Math.abs(number);
      break;
    case 'ln':
      result = Math.log(number);
      break;
    case 'log10':
      result = Math.log10(number);
      break;
    case 'e^':
      result = Math.exp(number);
      break;
    case '10^':
      result = Math.pow(10, number);
      break;
    default:
      result = 0; 
      break;
  }

  return result;

           
          }
calc2(args) {
            
  const operator = args.OPERATOR;
  const number = args.NUMBER;

  let result;

  switch (operator) {
    case 'sin':
      result = Math.sin(number);
      break;
    case 'cos':
      result = Math.cos(number);
      break;
    case 'tan':
      result = Math.tan(number);
      break;
    default:
      result = 0; 
      break;
  }
    return result;
    }

calc3(args) {
    
    const operator = args.OPERATOR;
    const number = args.NUMBER;

    let result;

    switch (operator) {
      case 'asin':
        result = Math.asin(number);
        break;
      case 'acos':
        result = Math.acos(number);
        break;
      case 'atan':
        result = Math.atan(number);
        break;
      default:
        result = 0; 
        break;
    }

    return result;
 
}
constants(args) {
    
  const constant = args.CONSTANT;
  let value;

  switch (constant) {
    case 'π':
      value = Math.PI;
      break;
    case 'e':
      value = Math.E;
      break;
    case 'φ':
      value = (1 + Math.sqrt(5)) / 2;
      break;
    case 'sqrt(2)':
      value = Math.sqrt(2);
      break;
    case 'sqrt(½)':
      value = Math.sqrt(1 / 2);
      break;
    case '∞':
      value = Infinity;
      break;
    default:
      value = 0; 
      break;
  }

  return value;

}

mathbool (args) {
    
  const number = args.NUMBER;
  const boolType = args.BOOLEAN;

  let result;

  switch (boolType) {
    case 'even':
      result = number % 2 === 0;
      break;
    case 'odd':
      result = number % 2 !== 0;
      break;
    case 'prime':
      if (number < 2) {
        result = false;
      } else {
        let isPrime = true;
        for (let i = 2; i <= Math.sqrt(number); i++) {
          if (number % i === 0) {
            isPrime = false;
            break;
          }
        }
        result = isPrime;
      }
      break;
    case 'whole':
      result = Number.isInteger(number);
      break;
    case 'positive':
      result = number > 0;
      break;
    case 'negative':
      result = number < 0;
      break;
    default:
      result = false; 
      break;
  }

  return result;

}
round (args) {
    
  const roundOption = args.ROUND;
  const number = args.NUMBER;

  let result;

  switch (roundOption) {
    case 'round up':
      result = Math.ceil(number);
      break;
    case 'round':
      result = Math.round(number);
      break;
    case 'round down':
      result = Math.floor(number);
      break;
    default:
      result = 0; 
      break;
  }

  return result;

}

remainder (args) {
    
  const number1 = args.NUMBER1;
  const number2 = args.NUMBER2;

  if (number2 === 0) {
    return NaN; // Don't u dare try diving by 0... yes i see u there lil boi
  }

  const remainder = number1 % number2;
  return remainder;

}
constrain(args) {
    const number = args.NUMBER;
    const low = args.LOW;
    const high = args.HIGH;
  
    if (low > high) {
      
      const temp = low;
      low = high;
      high = temp;
    }
  
    if (number < low) {
      return low;
    } else if (number > high) {
      return high;
    } else {
      return number;
    }
  }
    }
    Scratch.extensions.register(new mathaddons());
})(Scratch);
