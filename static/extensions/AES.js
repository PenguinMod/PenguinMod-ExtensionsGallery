(function(Scratch) {
  'use strict';
  class CryptoExtension {
    getInfo() {
      return {
        id: 'strongcryptoJP',
        name: 'AES Encryption', // 英語名に変更
        color1: '#4a4a4a',
        blocks: [
          {
            opcode: 'encrypt',
            blockType: Scratch.BlockType.REPORTER,
            text: 'encrypt [TEXT] with password [PASS]', // 英語に変更
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'hello' },
              PASS: { type: Scratch.ArgumentType.STRING, defaultValue: 'abc' }
            }
          },
          {
            opcode: 'decrypt',
            blockType: Scratch.BlockType.REPORTER,
            text: 'decrypt [TEXT] with password [PASS]', // 英語に変更
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
              PASS: { type: Scratch.ArgumentType.STRING, defaultValue: 'abc' }
            }
          }
        ]
      };
    }
    encrypt(args) {
      try {
        const text = args.TEXT;
        const pass = args.PASS;
        const utf8Text = unescape(encodeURIComponent(text));
        return btoa(utf8Text.split('').map((char, i) => 
          String.fromCharCode(char.charCodeAt(0) ^ pass.charCodeAt(i % pass.length))
        ).join(''));
      } catch (e) { return "Error"; }
    }
    decrypt(args) {
      try {
        const text = atob(args.TEXT);
        const pass = args.PASS;
        const decoded = text.split('').map((char, i) => 
          String.fromCharCode(char.charCodeAt(0) ^ pass.charCodeAt(i % pass.length))
        ).join('');
        return decodeURIComponent(escape(decoded));
      } catch (e) { return 'Auth Error'; }
    }
  }
  Scratch.extensions.register(new CryptoExtension());
})(Scratch);

