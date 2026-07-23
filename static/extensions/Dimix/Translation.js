(function (Scratch) {
  'use strict';

  class Extension {
    constructor() {
      this.dictionary = {};
      this.blockIconURI = "https://i.postimg.cc/tgq4Xyx0/Untitled-07-13-2026-11-20-30.png";
    }

    getInfo() {
      return {
        id: 'chipsahoy',
        name: 'Applele Translations',
        blockIconURI: this.blockIconURI,
        color1: '#1059e0',
        color2: '#1089e0',
        color3: '#c3d9e8',
        blocks: [
          {
            opcode: 'addTranslation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add translation for [WORD] as [TRANSLATION]',
            arguments: {
              WORD: { type: Scratch.ArgumentType.STRING, defaultValue: 'apples' },
              TRANSLATION: { type: Scratch.ArgumentType.STRING, defaultValue: 'las manzanas' }
            }
          },
          {
            opcode: 'removeTranslation',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove translation for [WORD]',
            arguments: {
              WORD: { type: Scratch.ArgumentType.STRING, defaultValue: 'apples' }
            }
          },
          {
            opcode: 'clearDictionary',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear all translations'
          },
          '---',
          {
            opcode: 'translateText',
            blockType: Scratch.BlockType.REPORTER,
            text: 'translate [TEXT]',
            arguments: {
              TEXT: { type: Scratch.ArgumentType.STRING, defaultValue: 'I like apples' }
            }
          },
          {
            opcode: 'getTranslation',
            blockType: Scratch.BlockType.REPORTER,
            text: 'translation of [WORD]',
            arguments: {
              WORD: { type: Scratch.ArgumentType.STRING, defaultValue: 'apples' }
            }
          },
          {
            opcode: 'hasTranslation',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'has translation for [WORD]?',
            arguments: {
              WORD: { type: Scratch.ArgumentType.STRING, defaultValue: 'apples' }
            }
          },
          {
            opcode: 'dictionarySize',
            blockType: Scratch.BlockType.REPORTER,
            text: 'number of translations'
          },
          {
            opcode: 'dihtionary',
            blockType: Scratch.BlockType.REPORTER,
            text: 'dictionary'
          }
        ]
      };
    }

    _clean(word) {
      return String(word).toLowerCase().trim();
    }

    addTranslation(args) {
      const word = this._clean(args.WORD);
      if (word === '') return;
      this.dictionary[word] = String(args.TRANSLATION);
    }

    removeTranslation(args) {
      const word = this._clean(args.WORD);
      delete this.dictionary[word];
    }

    clearDictionary() {
      this.dictionary = {};
    }

    hasTranslation(args) {
      const word = this._clean(args.WORD);
      return Object.prototype.hasOwnProperty.call(this.dictionary, word);
    }

    getTranslation(args) {
      const word = this._clean(args.WORD);
      return this.dictionary[word] || '';
    }

    dictionarySize() {
      return Object.keys(this.dictionary).length;
    }

    dihtionary() {
      return JSON.stringify(this.dictionary);
    }

    translateText(args) {
      const text = String(args.TEXT);
      const keys = Object.keys(this.dictionary);
      if (keys.length === 0) return text;

      const sortedKeys = keys.sort((a, b) => b.length - a.length);
      const escaped = sortedKeys.map((k) =>
        k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      );
      const pattern = new RegExp('\\b(' + escaped.join('|') + ')\\b', 'gi');

      return text.replace(pattern, (match) => {
        const lower = match.toLowerCase();
        let translated = this.dictionary[lower];
        if (translated === undefined) return match;
        if (
          match[0] === match[0].toUpperCase() &&
          match[0] !== match[0].toLowerCase()
        ) {
          translated = translated.charAt(0).toUpperCase() + translated.slice(1);
        }
        return translated;
      });
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);