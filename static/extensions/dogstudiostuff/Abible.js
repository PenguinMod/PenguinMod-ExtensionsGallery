(function(Scratch) {
  'use strict';
  class Extension {
    constructor() {
        this.returnFull = false
    }
    getInfo() {
      return {
        id: "Abible",
        name: "Bible",
        color1: "#14d0ff",
        blocks: [
          {
            opcode: 'getTranslations',
            text: 'get translations',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true
          },
          {
            opcode: 'getBooks',
            text: 'get books for translation [TRANSLATION]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
                TRANSLATION: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: ""
                }
            }
          },
          {
            opcode: 'getChapter',
            text: 'get chapter [CHAPTER] of book [BOOK] in translation [TRANSLATION]',
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            arguments: {
                CHAPTER: {
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 1
                },
                BOOK: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: ""
                },
                TRANSLATION: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: ""
                }
            }
          },
          {
            opcode: 'returnFullResult',
            text: 'return full result [OPTION]',
            blockType: Scratch.BlockType.COMMAND,
            disableMonitor: true,
            arguments: {
                OPTION: {
                    type: Scratch.ArgumentType.BOOLEAN,
                    defaultValue: false
                }
            }
          },
        ]
      };
    }

    async getTranslations() {
      const request = await fetch("https://bible.helloao.org/api/available_translations.json")
      const result = await request.json()
      if (this.returnFull) {
        return JSON.stringify(result)
      } else {
        return JSON.stringify(result.translations)
      }
    }

    async getBooks(args) {
      const request = await fetch(`https://bible.helloao.org/api/${JSON.parse(args.TRANSLATION).id}/books.json`)
      const result = await request.json()
      if (this.returnFull) {
        return JSON.stringify(result)
      } else {
        return JSON.stringify(result.books)
      }
    }
    
    async getChapter(args) {
      const request = await fetch(`https://bible.helloao.org/api/${JSON.parse(args.TRANSLATION).id}/${JSON.parse(args.BOOK).id}/${args.CHAPTER}.json`)
      const result = await request.json()
      if (this.returnFull) {
        return JSON.stringify(result)
      } else {
        return JSON.stringify(result.chapter)
      }
    }

    returnFullResult(args) {
        this.returnFull = args.OPTION
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
