// Dado (https://icons8.com/icon/qAN1P79CQdvH/dado) icon by Icons8 (https://icons8.com/)

// reminder to add a space before any block text that starts with a number

let defaultChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
let characters = defaultChars;

function randomStr(dataset, length) {
  let randomString = '';
  const datasetLength = dataset.length;

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * datasetLength);
    randomString += dataset[randomIndex];
  }

  return randomString;
}

let uuids = [
    {
      text: 'version 1',
      value: 'v1'
    },
    {
      text: 'version 4',
      value: 'v4'
    }
]

let seed = (Math.random() * Number.MAX_SAFE_INTEGER) | 0;
let icon = "data:image/png;base64,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"

function randomChance(percentageChance) {
  if (percentageChance < 0 || percentageChance > 100) {
    return -1
  }

  const probabilityOfOne = percentageChance / 100;

  if (Math.random() < probabilityOfOne) {
    // Return 1
    return 1;
  } else {
    // Return a random number between 2 and 10
    return Math.floor(Math.random() * 9) + 2;
  }
}

function seededRandom(seed, min, max) {
  const m = 4294967296; // 2^32
  const a = 1664525;
  const c = 1013904223;

  seed = (seed * a + c) % m;

  const normalized = seed / m;

  return Math.floor(min + normalized * (max - min + 1));
}

function UUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

class RandomUtils {
  getInfo() {
    return {
      id: 'randomutils',
      name: 'Random Utilities',
      menuIconURI: icon,
      blockIconURI: icon,
      color1: '#ad3931',
      color2: '#943129',
      color3: '#782722',
      blocks: [
        {
          opcode: 'truerndnumber',
          blockType: Scratch.BlockType.REPORTER,
          text: '[RND] number between [MIN] and [MAX]',
          arguments: {
            MIN: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            MAX: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100
            },
            RND: {
              type: Scratch.ArgumentType.STRING,
              menu: 'RND_MENU'
            }
          }
        },
        {
          opcode: 'uuid',
          blockType: Scratch.BlockType.REPORTER,
          text: 'uuid [VERSION]',
          disableMonitor: true,
          arguments: {
              VERSION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'UUID_MENU',
              }
           }
        },
        {
          opcode: 'rndtext',
          blockType: Scratch.BlockType.REPORTER,
          text: ' 50% chance of [TXT] or [TXT2]',
          arguments: {
            TXT: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'hello'
            },
            TXT2: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'world!'
            }
          }
        },
        {
          opcode: 'rndchance',
          blockType: Scratch.BlockType.REPORTER,
          text: 'random number 1-10 with [RND]% chance for 1',
          arguments: {
           RND: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 60
           }
         }
        },
        {
          opcode: 'rndcolor',
          blockType: Scratch.BlockType.REPORTER,
          text: 'random [COLOR] color',
          disableMonitor: true,
          arguments: {
             COLOR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'COLOR_MENU'
             }
           }
        },
        {
          blockType: Scratch.BlockType.LABEL,
          text: 'Seeds',
        },
        {
          opcode: 'seed',
          blockType: Scratch.BlockType.REPORTER,
          text: 'seed',
        },
        {
          opcode: 'setseed',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set seed to [SEED]',
          arguments: {
            SEED: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 69420
          }
         }
        },
        {
          opcode: 'rndseed',
          blockType: Scratch.BlockType.COMMAND,
          text: 'randomize seed (better way)',
        },
        {
          blockType: Scratch.BlockType.LABEL,
          text: "Random Strings",
        },
        {
          opcode: 'datasetSet',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set dataset to [DATASET]',
          arguments: {
            DATASET: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'racecar'
            }
          }
        },
        {
          opcode: 'datasetdefault',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set dataset to default',
        },
        {
          opcode: 'dataset',
          blockType: Scratch.BlockType.REPORTER,
          text: 'dataset',
        },
        {
          opcode: 'rndstr',
          blockType: Scratch.BlockType.REPORTER,
          text: 'random string with length [LENGTH]',
          arguments: {
             LENGTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 13
             }
           }
        },
      ],
      menus: {
        RND_MENU: {
          acceptReporters: false,
          items: ['true random', 'seeded random']
        },
        COLOR_MENU: {
          acceptReporters: false,
          items: ['hex', 'RGB']
        },
        UUID_MENU: {
          acceptReporters: false,
          items: uuids
        },
      }
    };
  }

  truerndnumber(args) {
   if (args.RND == "true random") {
    return fetch(`https://www.random.org/integers/?num=1&min=${args.MIN}&max=${args.MAX}&col=1&base=10&format=plain&rnd=new`)
    .then((response) => {
      return response.text();
    })
    .catch((error) => {
      console.error(error);
      return 'Infinity';
    });
   } else {
     return seededRandom(seed, args.MIN, args.MAX);
   }
  }

  uuid(args) {
    return fetch(`https://api.allorigins.win/raw?url=https://www.uuidtools.com/api/generate/${args.VERSION}/count/1`)
    .then((response) => {
      if (response.ok) {
        return response.json();
      } else {
        console.error('Network response was not ok');
        return '?????????????????';
      }
    })
    .then((data) => {
      let uuid = data[0];
      return uuid
    })
    .catch((error) => {
      console.error(error);
      return '?????????????????';
    });
  }

  rndchance(args) {
    return randomChance(args.RND)
  }

  rndtext(args) {
    if (Math.random() < 0.5) {
      return args.TXT; // 50% chance
    } else {
      return args.TXT2 // 50% chance
    }
  }

  setseed(args) {
    seed = args.SEED
  }
  
  seed() {
    return seed
  }

  rndseed() {
    seed = (Math.random() * Number.MAX_SAFE_INTEGER) | 0;
  }

  rndcolor(args) {
    if (args.COLOR == "hex") {
    // Generate a random number between 0 and 16777215 (0xFFFFFF in hexadecimal)
    const randomColor = Math.floor(Math.random() * 16777215);

    // Convert the number to a 6-digit hexadecimal string and pad with zeros if needed
    const hexCode = "#" + randomColor.toString(16).padStart(6, '0');

    return hexCode;
    } else {
      // Generate random values for the red, green, and blue components (0-255).
      const red = Math.floor(Math.random() * 256);
      const green = Math.floor(Math.random() * 256);
      const blue = Math.floor(Math.random() * 256);

      // Return the RGB color in format.
      return `[${red}, ${green}, ${blue}]`;
    }
  }

  datasetSet(args) {
    characters = args.DATASET
  }

  datasetdefault() {
    characters = defaultChars
  }

  dataset() {
    return characters
  }

  rndstr(args) {
    return randomStr(characters, args.LENGTH)
  }
}

Scratch.extensions.register(new RandomUtils());
