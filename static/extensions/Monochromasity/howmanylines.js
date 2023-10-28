// Name: How Many Lines?
// ID: monochromasityhml
// Description: Adds a "How Many Lines in ()" block to the editor. Useful for finding the amount of lines in a user-edited variable.
// By: Monochromasity

(function (Scratch) {
  "use strict";

  class HML {
    getInfo() {
      return {
        id: 'monochromasityhml',
        name: 'How Many Lines?',
        blocks: [
          {
            opcode: 'hml',
            blockType: Scratch.BlockType.REPORTER,
            text: 'how many lines in [INP]',
            arguments: {
              INP: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'one line'
              }
            }
          }
        ]
      };
    }

    hml(args) {
      let inp = Scratch.Cast.toString(args.INP)
      const lines = inp.split('\n');
      const nonEmptyLines = lines.filter(line => line.trim() !== '');
      return nonEmptyLines.length;
    }
  }
  Scratch.extensions.register(new HML());
})(Scratch);
