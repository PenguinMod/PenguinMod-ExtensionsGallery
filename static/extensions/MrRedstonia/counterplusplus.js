(function (Scratch) {
  "use strict";

  class CounterPlusPlus {
    constructor() {
      this.count = 0;
    }

    getInfo() {
      return {
        id: "redstoniacounterplusplus",
        name: "Counter++",
        color1: "#4A4A5E",
        blocks: [
          {
            opcode: "countInput",
            blockType: Scratch.BlockType.REPORTER,
            text: "count [S1] in [S2]",
            arguments: {
              S1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello",
              },
              S2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello, World!",
              },
            },
          },
          {
            opcode: "countWords",
            blockType: Scratch.BlockType.REPORTER,
            text: "count words [S1]",
            arguments: {
              S1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },

          "---",

          {
            opcode: "getCounter",
            blockType: Scratch.BlockType.REPORTER,
            text: "counter",
          },
          {
            opcode: "resetCounter",
            blockType: Scratch.BlockType.COMMAND,
            text: "reset counter",
          },
          {
            opcode: "setCounter",
            blockType: Scratch.BlockType.COMMAND,
            text: "set counter to [N1]",
            arguments: {
              N1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10,
              },
            },
          },
          {
            opcode: "changeCounterBy",
            blockType: Scratch.BlockType.COMMAND,
            text: "change counter by [N1]",
            arguments: {
              N1: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
              },
            },
          },
        ],
      };
    }

    countInput(args) {
      const word = Scratch.Cast.toString(args.S1);
      const text = Scratch.Cast.toString(args.S2);
      let count = 0;
      const wordLen = word.length;
      const textLen = text.length;

      if (word === "") {
        return 0;
      }

      for (let i = 0; i < textLen - wordLen + 1; i++) {
        if (text.substring(i, i + wordLen) === word) {
          count++;
        }
      }

      return count;
    }

    countWords(args) {
      const text = Scratch.Cast.toString(args.S1);

      if (text.trim() === "") {
        return 0;
      }

      const words = text.split(/\s+/);
      return words.length;
    }

    getCounter() {
      return this.count;
    }

    resetCounter() {
      this.count = 0;
    }

    setCounter(args) {
      this.count = Scratch.Cast.toNumber(args.N1);
    }

    changeCounterBy(args) {
      this.count += Scratch.Cast.toNumber(args.N1);
    }
  }

  Scratch.extensions.register(new CounterPlusPlus());
})(Scratch);
