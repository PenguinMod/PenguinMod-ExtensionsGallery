(function (Scratch) {
  'use strict';
  class Extension {
    constructor() {
      let apikey = ''
    }
    serialize() {
      return {
        apikey: apikey
      };
    }
    deserialize(data) {
      apikey = data?.apikey || '';
    }
    getInfo() {
      return {
        id: 'anuqrngisfreakingawesome',
        name: 'Quantum Randomness',
        color1: '#21ab61',
        blocks: [
          {
            opcode: 'how2getapikey',
            text: 'How To Get An Api Key',
            blockType: Scratch.BlockType.BUTTON
          },
          {
            opcode: 'setapikey',
            text: 'Set Api Key',
            blockType: Scratch.BlockType.BUTTON
          },
          {
            opcode: 'nrandomnumbers',
            text: 'Get Random Number Inbetween [MIN] To [MAX]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              MIN: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
              MAX: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
              }
            }
          }
        ]
      };
    }

    how2getapikey() {
      alert(
        "How To Get An Api Key(100% Clickbait)(Cops Called)(At 3 Am)Works In 2026\n\n" +
        "1. Go to https://quantumnumbers.anu.edu.au/\n\n" +
        "2. Create an account or log in.\n\n" +
        "3. Open your Dashboard or Account page.\n\n" +
        "4. Locate your API Key section.\n\n" +
        "5. Copy your Free API Key.\n\n" +
        "6. Click On 'Set API Key' Button.\n\n" +
        "7. Paste Your Api Key.\n\n" +
        "8. Click On Ok"
      );
    }


    async nrandomnumbers(args) {
      let min = Number(args.MIN);
      let max = Number(args.MAX);
      if (min > max) [min, max] = [max, min];
      if (min === max) return min;
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => {
          controller.abort();
          console.warn('[INSERT TIMEOUT ERRROR]');
        }, 3000);

        const response = await fetch(
          'https://api.quantumnumbers.anu.edu.au?length=1&type=uint8',
          {
            headers: {
              'x-api-key': this.apikey
            },
            signal: controller.signal
          }
        );
        clearTimeout(timeout);
        const json = await response.json();
        const quantumValue = json.data[0] / 255;

        return Math.floor(min + quantumValue * (max - min + 1));

      } catch (error) {
        clearTimeout(timeout);
        console.warn("Quantum API failed, Error:", error);
      }
    }

    setapikey() {
      apikey = prompt('Insert Api Key');
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
