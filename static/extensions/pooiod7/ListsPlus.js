//ListsPlus by scratch.mit.edu/users/pooiod7

class ListPlus {
  getInfo() {
    return {
      id: 'listsPlus',
      name: 'Lists+',
      color1: '#ff661a',
      color2: '#cc5215',
      menuIconURI: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEgAAABICAMAAABiM0N1AAAAZlBMVEVHcEz249fz1sfYeEfaf1L4597quaDdi2Lfj2jSZjHnrI/y1cb33NPOWB3hmXbinnzVbjvuxLD/ZhrMUhX/////2cb/7OH/n3D0YRjVVBXpXBfhWhfRYSnbVxb/eTb/sIn/m2n/1L8SGbgGAAAAEnRSTlMAVnf+iC/J/GLQ+WsO78IwuJX5z0ScAAACBElEQVRYw82Y25KCMAyGXYW1VVSEVdoCiu//krtNWyhIsS252Fwww8B8k/xJD8lms2Dp8XqmTVOWZUPzhKSbGEuP511pGZePPBj2dW7KecuJPyXb7l0Yaack8+Ns90M8tWCskMaYqDnvUSFB8VohbGO1ZtGPAV61wq0o5k206odlp9Jv5U7LCrcxhaKXhbCUOnwJAygVoDO8496ljUMrspQt/hkzOEXc/rR+HKMUcenjzXGSUuDU/hxDmuYO8t6GcDSJztSh5Dyer5u01/MBP5v3qcF3ICVvAkG+uvuPsnsFoP59avfO5I5MAuOwKKoJqHKC4Lvgo+C2u17oQBCr7eCyw1CIgSAI7pSNHCqiQIXt0qEZMh8Mkpk7WSnTDoWDwCUypMyUYlj6jUq0XxzGob8C1BXXF+Rt3vR37dJF7x5cFPEma4noyAIX2fuSy2XO7MiiTMamJFoVmYrtAhsjAojABrJKIiVSMtU6Iv1abQmytO68K7sbqU1hoVmg8CWiQM00+7Gg8n+BBK5HWGJ/SH/nnf63ggw4IEcFibZE0BYt2jaCtrHhbbVomz/acbR8QFb+ByTekY12icC71qBdtNCufniXUbzrMdqFHa+F0E1Nu76p0W1WvbrNwmv88FpRvOYYr13HGyDgjTQQhyyjsQ9fM/ZBHEThjcZmh3Vl3LAufHz4C7rDNXmU2lmoAAAAAElFTkSuQmCC',
      name: 'Lists+',
      blocks: [
        {
          opcode: 'getItem',
          blockType: Scratch.BlockType.REPORTER,
          text: 'item [INDEX] of [LIST]',
          arguments: {
            INDEX: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            }
          }
        },
        {
          opcode: 'addItem',
          blockType: Scratch.BlockType.REPORTER,
          text: 'add [ITEM] to [LIST]',
          arguments: {
            ITEM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'thing'
            },
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            }
          }
        },
        {
          opcode: 'insertItem',
          blockType: Scratch.BlockType.REPORTER,
          text: 'insert [ITEM] at [INDEX] in [LIST]',
          arguments: {
            ITEM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'thing'
            },
            INDEX: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            }
          }
        },
        {
          opcode: 'flattenList',
          blockType: Scratch.BlockType.REPORTER,
          text: 'string [LIST]',
          arguments: {
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            }
          }
        },
        {
          opcode: 'createListFromText',
          blockType: Scratch.BlockType.REPORTER,
          text: '[TEXT] as a list',
          arguments: {
            TEXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'string'
            }
          }
        },
        {
          opcode: 'createBlankList',
          blockType: Scratch.BlockType.REPORTER,
          text: 'blank list',
        },
        {
          opcode: 'deleteItem',
          blockType: Scratch.BlockType.REPORTER,
          text: 'delete item [INDEX] from [LIST]',
          arguments: {
            INDEX: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            }
          }
        },
        {
          opcode: 'replaceItem',
          blockType: Scratch.BlockType.REPORTER,
          text: 'replace item [INDEX] in [LIST] with [ITEM]',
          arguments: {
            INDEX: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            },
            ITEM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'thing'
            }
          }
        },
        {
          opcode: 'listContains',
          blockType: Scratch.BlockType.BOOLEAN,
          text: '[LIST] contains [ITEM]',
          arguments: {
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            },
            ITEM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'thing'
            }
          }
        },
        {
          opcode: 'itemIndex',
          blockType: Scratch.BlockType.REPORTER,
          text: 'item # of [ITEM] in [LIST]',
          arguments: {
            ITEM: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'thing'
            },
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            }
          }
        },
        {
          opcode: 'listLength',
          blockType: Scratch.BlockType.REPORTER,
          text: 'length of [LIST]',
          arguments: {
            LIST: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: '["list"]'
            }
          }
        }
      ]
    };
  }

  createListFromText(args) {
    return '["' + args.TEXT.replace(/, /g, '", "') + '"]';
  }

  getItem(args) {
    const index = Math.max(1, Math.floor(args.INDEX));
    const list = JSON.parse(args.LIST);
    if (Array.isArray(list) && index <= list.length) {
      const item = list[index - 1];
      if (Array.isArray(item)) {
        return JSON.stringify(item);
      }
      return item;
    }
    return null;
  }

  addItem(args) {
    const item = args.ITEM;
    const list = JSON.parse(args.LIST);
    if (Array.isArray(list)) {
      list.push(item);
      return JSON.stringify(list);
    }
    return null;
  }

  insertItem(args) {
    const item = args.ITEM;
    const index = Math.max(1, Math.floor(args.INDEX));
    const list = JSON.parse(args.LIST);
    if (Array.isArray(list) && index <= list.length) {
      list.splice(index - 1, 0, item);
      return JSON.stringify(list);
    }
    return null;
  }

  flattenList(args) {
    const flatten = (list) => {
      let flattenedList = [];

      const processItem = (item) => {
        if (Array.isArray(item)) {
          for (let i = 0; i < item.length; i++) {
            processItem(item[i]);
          }
        } else {
          flattenedList.push(item);
        }
      };

      processItem(list);

      return flattenedList.join(', ');
    };

    const list = JSON.parse(args.LIST);
    const flattenedList = flatten(list);
    return flattenedList;
  }

  createBlankList() {
    return '[]';
  }

  deleteItem(args) {
    const index = Math.max(1, Math.floor(args.INDEX));
    const list = JSON.parse(args.LIST);
    if (Array.isArray(list) && index <= list.length) {
      list.splice(index - 1, 1);
      return JSON.stringify(list);
    }
    return null;
  }

  replaceItem(args) {
    const index = Math.max(1, Math.floor(args.INDEX));
    const item = args.ITEM;
    const list = JSON.parse(args.LIST);
    if (Array.isArray(list) && index <= list.length) {
      list[index - 1] = item;
      return JSON.stringify(list);
    }
    return null;
  }

  listContains(args) {
    const item = args.ITEM;
    const list = JSON.parse(args.LIST);
    if (Array.isArray(list)) {
      return list.includes(item);
    }
    return false;
  }

  itemIndex(args) {
    const item = args.ITEM;
    const list = JSON.parse(args.LIST);
  
    if (Array.isArray(list)) {
      const index = list.findIndex((element) => element === item);
      return index + 1;
    }
  
    return 0;
  }

  listLength(args) {
    const list = JSON.parse(args.LIST);
    if (Array.isArray(list)) {
      return list.length;
    }
    return 0;
  }
}

Scratch.extensions.register(new ListPlus());
