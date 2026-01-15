(function(Scratch) {
  'use strict';

  class CryptoExtension {
    getInfo() {
      return {
        id: 'strongcryptoJP',
        name: '日本語対応・暗号化',
        color1: '#4a4a4a',
        blocks: [
          {
            opcode: 'encrypt',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TEXT] をパスワード [PASS] で暗号化',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'こんにちは' },
              PASS: { type: Scratch.ArgumentType.STRING, defaultValue: 'abc' }
            }
          },
          {
            opcode: 'decrypt',
            blockType: Scratch.BlockType.REPORTER,
            text: '[TEXT] をパスワード [PASS] で復号',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: '' },
              PASS: { type: Scratch.ArgumentType.STRING, defaultValue: 'abc' }
            }
          }
        ]
      };
    }

    // 日本語対応版の暗号化
    encrypt(args) {
      try {
        const text = args.TEXT;
        const pass = args.PASS;
        // UTF-8としてエンコードしてから処理
        const utf8Text = unescape(encodeURIComponent(text));
        const result = btoa(utf8Text.split('').map((char, i) => 
          String.fromCharCode(char.charCodeAt(0) ^ pass.charCodeAt(i % pass.length))
        ).join(''));
        return result;
      } catch (e) {
        return "エラーが発生しました";
      }
    }

    // 日本語対応版の復号
    decrypt(args) {
      try {
        const text = atob(args.TEXT);
        const pass = args.PASS;
        const decoded = text.split('').map((char, i) => 
          String.fromCharCode(char.charCodeAt(0) ^ pass.charCodeAt(i % pass.length))
        ).join('');
        // UTF-8から日本語に戻す
        return decodeURIComponent(escape(decoded));
      } catch (e) {
        return '復号エラー：正しいパスワードかデータではありません';
      }
    }
  }

  Scratch.extensions.register(new CryptoExtension());
})(Scratch);
