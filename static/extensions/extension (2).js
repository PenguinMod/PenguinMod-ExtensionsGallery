class Extension {
  getInfo() {
    return {
      id: 'extension',
      name: 'What is the best mod',
      blocks: [
        {
          opcode: 'extension',
          blockType: Scratch.BlockType.REPORTER,
          text: 'What is the best mod?'
        }
      ]
    };
  }

  extension() {
    return 'PenguinMod';
  }
}

Scratch.extensions.register(new Extension());
