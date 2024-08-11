(function (Scratch) {
  "use strict";

  class WebCreator {
    getInfo() {
      return {
        id: 'webcreator',
        name: 'Website Creator',
        color1: '#4A90E2',
        color2: '#0064D2',
        blocks: [
          {
            opcode: 'setHTML',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set HTML to [html]',
            arguments: {
              html: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '<div id="content"></div>'
              }
            }
          },
          {
            opcode: 'setCSS',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set CSS to [css]',
            arguments: {
              css: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'body { background-color: lightblue; }'
              }
            }
          },
          {
            opcode: 'setJS',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set JS to [js]',
            arguments: {
              js: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'console.log("JavaScript code")'
              }
            }
          },
          {
            opcode: 'setFavicon',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set favicon to [favicon]',
            arguments: {
              favicon: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'favicon.ico'
              }
            }
          },
          {
            opcode: 'testWebsite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'test website',
            arguments: {}
          },
          {
            opcode: 'getHTML',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get HTML content',
            arguments: {}
          },
          {
            opcode: 'getCSS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get CSS content',
            arguments: {}
          },
          {
            opcode: 'getJS',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get JS content',
            arguments: {}
          },
          {
            opcode: 'resetWebsite',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset website',
            arguments: {}
          },
          {
            opcode: 'getSingleFileHTML',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get single-file HTML code',
            arguments: {}
          }
        ]
      };
    }

    constructor() {
      this.html = '<div id="content"></div>';
      this.css = 'body { background-color: lightblue; }';
      this.js = 'console.log("JavaScript code")';
      this.favicon = 'favicon.ico';
    }

    setHTML(args) {
      this.html = args.html;
    }

    setCSS(args) {
      this.css = args.css;
    }

    setJS(args) {
      this.js = args.js;
    }

    setFavicon(args) {
      this.favicon = args.favicon;
    }

    testWebsite() {
      const popup = window.open('', '_blank', 'width=800,height=600');
      const popupDoc = popup.document;

      popupDoc.open();
      popupDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="icon" href="${this.favicon}">
          <style>${this.css}</style>
        </head>
        <body>
          ${this.html}
          <script>${this.js}</script>
        </body>
        </html>
      `);
      popupDoc.close();
    }

    getHTML() {
      return this.html;
    }

    getCSS() {
      return this.css;
    }

    getJS() {
      return this.js;
    }

    resetWebsite() {
      this.html = '';
      this.css = '';
      this.js = '';
      this.favicon = 'favicon.ico';
    }

    getSingleFileHTML() {
      return `
        <!DOCTYPE html>
        <html>
        <head>
          <link rel="icon" href="${this.favicon}">
          <style>${this.css}</style>
        </head>
        <body>
          ${this.html}
          <script>${this.js}</script>
        </body>
        </html>
      `;
    }
  }

  Scratch.extensions.register(new WebCreator());
})(Scratch);
