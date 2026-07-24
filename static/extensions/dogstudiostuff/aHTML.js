(function(Scratch) {
  'use strict';
  class Extension {
    constructor() {
        if (!vm.jwArray) {
            vm.extensionManager.loadExtensionIdSync('jwArray')
        }
        this.jwArray = vm.jwArray
    }
    getInfo() {
      return {
        id: "aHTML",
        name: "HTML",
        color1: "#d4693b",
        blocks: [
          {
            opcode: 'parseAsHTML',
            text: 'parse as HTML [HTML]',
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.INDENTED,
            forceOutputType: "HTML",
            arguments: {
                HTML: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "<html></html>"
                }
            }
          },
          {
            opcode: 'stringifyHTML',
            text: 'stringify HTML [HTML]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
                HTML: {
                    shape: Scratch.BlockShape.INDENTED,
                    check: ["HTML"]
                }
            }
          },
          {
            opcode: 'getChildren',
            text: 'get children of [HTML]',
            arguments: {
                HTML: {
                    shape: Scratch.BlockShape.INDENTED,
                    check: ["HTML"]
                }
            },
            ...this.jwArray.Block
          },
          {
            opcode: 'getNameOf',
            text: 'get name of [HTML]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
                HTML: {
                    shape: Scratch.BlockShape.INDENTED,
                    check: ["HTML"]
                }
            },
          },
          {
            opcode: 'getTextOf',
            text: 'get text contents of [HTML]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
                HTML: {
                    shape: Scratch.BlockShape.INDENTED,
                    check: ["HTML"]
                }
            },
          },
          {
            opcode: 'getArgumentOf',
            text: 'get attribute [ATTR] of [HTML]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
                HTML: {
                    shape: Scratch.BlockShape.INDENTED,
                    check: ["HTML"]
                },
                ATTR: {
                    type: Scratch.ArgumentType.STRING
                }
            },
          },
          "---",
          {
            opcode: 'getStyleOf',
            text: 'get inline style of [HTML]',
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.INDENTED,
            arguments: {
                HTML: {
                    shape: Scratch.BlockShape.INDENTED,
                    check: ["HTML"]
                }
            },
            color1: "#3700ff",
            color2: "#2700b4",
            color3: "#1d0088",
            forceOutputType: "CSS",
          },
          {
            opcode: 'getStyleAttrOf',
            text: 'get style attribute [ATTR] of [CSS]',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
                CSS: {
                    shape: Scratch.BlockShape.INDENTED,
                    check: ["CSS"]
                },
                ATTR: {
                    type: Scratch.ArgumentType.STRING
                }
            },
            color1: "#3700ff",
            color2: "#2700b4",
            color3: "#1d0088",
          },
        ]
      };
    }

    parseAsHTML(args) {
      const htmlParser = new DOMParser()
      const newHTML = htmlParser.parseFromString(args.HTML, "text/html")
      return newHTML
    }

    stringifyHTML(args) {
        try {
            const htmlStringify = new XMLSerializer()
            const stringified = htmlStringify.serializeToString(args.HTML)
            return stringified
        } catch {
            return ""
        }
    }

    getChildren(args) {
        try {
            /** @type {HTMLDocument} */
            let html;
            html = args.HTML;
            let newArray = []
            for (let i = 0; i < html.children.length; i++) {
                newArray.push(html.children.item(i))
            }
            return newArray
        } catch {
            return []
        }  
    }
    
    getNameOf(args) {
        try {
            /** @type {HTMLElement} */
            let html;
            html = args.HTML;
            return html.tagName
        } catch {
            return ""
        }
    }

    getTextOf(args) {
        try {
            /** @type {HTMLElement} */
            let html;
            html = args.HTML;
            return html.innerText
        } catch {
            return ""
        }
    }

    getArgumentOf(args) {
        try {
            /** @type {HTMLElement} */
            let html;
            html = args.HTML;
            return html.getAttribute(args.ATTR)
        } catch {
            return ""
        }
    }

    getStyleOf(args) {
        try {
            /** @type {HTMLElement} */
            let html;
            html = args.HTML;
            return html.style
        } catch {
            return ""
        }
    }


    getStyleAttrOf(args) {
        try {
            /** @type {CSSStyleDeclaration} */
            let css;
            css = args.CSS;
            return css.getPropertyValue(args.ATTR)
        } catch {
            return ""
        }
    }
  }

  Scratch.extensions.register(new Extension());
})(Scratch);
