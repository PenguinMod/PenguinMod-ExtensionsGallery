class UnicodeConverter {
  getInfo() {
    return {
      id: 'unicodeconverter',
      name: 'Unicode',
      blocks: [
        {
          opcode: 'unicodeToString',
          blockType: Scratch.BlockType.REPORTER,
          text: 'unicode [ONE] as as string',
          arguments: {
            ONE: {
              type: Scratch.ArgumentType.STRING
            }
          }
        },
        {
          opcode: 'stringToUnicode',
          blockType: Scratch.BlockType.REPORTER,
          text: 'unicode of [ONE]',
          arguments: {
            ONE: {
              type: Scratch.ArgumentType.STRING
            }
          }
        }
      ]
    };
  }

  unicodeToString(args) {
    return (args.ONE).replace(/\\u[\dA-F]{4}/gi, function(match) {
      return String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16));
    });
  }
  stringToUnicode(args) {
    let unicode = '';
    for (let i = 0; i < (args.ONE).length; i++) {
      unicode += '\\u' + (args.ONE).charCodeAt(i).toString(16).toUpperCase().padStart(4, '0');
    }
    return unicode;
  }
}

Scratch.extensions.register(new UnicodeConverter());
