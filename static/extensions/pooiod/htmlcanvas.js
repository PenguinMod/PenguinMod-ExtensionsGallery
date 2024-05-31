// HTML Canvas v1 by pooiod7

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  const vm = Scratch.vm;
  const packaged = !typeof scaffolding === "undefined";

  class HTMLCanvas {
    constructor() {
      this.stagewidth = Scratch.vm.runtime.stageWidth;
      this.stageheight = Scratch.vm.runtime.stageHeight;

      var htmlcanvaspageiframe = document.getElementById('htmlcanvaspageiframe');
      if (htmlcanvaspageiframe) {
        htmlcanvaspageiframe.parentNode.removeChild(htmlcanvaspageiframe);
      } this.createOverlayFrame();

      this.canscript = packaged;

      this.page;
      this.pagecontent;

      if (!packaged) {
        setInterval(()=> {
          try {
            if (!document.getElementById('htmlcanvaspageiframe')) {
              this.createOverlayFrame();
            }
          } catch (error) {
            this.createOverlayFrame();
          }
        }, 1000);
      }

      this.docsloaded = false;
      window.addEventListener("message", (event) => {
        try {
          if (event.data && 'docsloaded' in event.data) {
            this.docsloaded = event.data.docsloaded;
          } else {
            this.docsloaded = false;
          }
        } catch (err) {
          console.error(err);
          this.docsloaded = false;
        }
      }, false);
      this.docs = "https://extensions.penguinmod.com/docs/HTMLcanvas";

      vm.runtime.on('PROJECT_LOADED', () => {
        clearAllElements(true);
        this.setClickThrough(true);
      });

      vm.runtime.on('PROJECT_START', () => {
        var htmlcanvaspageiframe = document.getElementById('htmlcanvaspageiframe');
        if (htmlcanvaspageiframe) {
          htmlcanvaspageiframe.parentNode.removeChild(htmlcanvaspageiframe);
        } this.createOverlayFrame();

        clearAllElements(true);
        this.setClickThrough(true);
      });

      // Scratch.vm.runtime.on('BEFORE_EXECUTE', () => {});

      this.debugcss = `* {
  outline: 2px dashed #8B7070; 
  outline-offset: 0px; 
}

body > * {
  outline: 2px dashed #707D8B; 
  outline-offset: -3px; 
}`;
    }

    getInfo() {
      return {
        id: 'HTMLcanvas',
        name: 'HTML Canvas',
        color1: "#6164ff",
        color2: '#4346d1',
        // docsURI: 'https://example.com',
        blocks: [
          {
            func: "showdocs",
            blockType: Scratch.BlockType.BUTTON,
            text: (this.findelement("#extdocsp7codepen"))?"Close Documentation":"Open Documentation"
          },
          
          {
            func: "toggledebug",
            blockType: Scratch.BlockType.BUTTON,
            text: "Toggle Debug outlines"
          },

          {
            blockType: "label", text: "Elements",
          },

          {
            opcode: 'makeElement',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Make element [type] with id [id]',
            arguments: {
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: 'elementTypes',
                defaultValue: 'div',
              },
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'elementId',
              },
            },
          },
          {
            opcode: 'setContent',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set content of [elm] to [content]',
            arguments: {
              elm: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              },
              content: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, Scratch!',
              },
            },
          },
          {
            opcode: 'setProperty',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set property [property] of [element] to [value]',
            arguments: {
              property: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'id',
              },
              element: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'elementId2',
              },
            },
          },
          {
            opcode: 'setParent',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Parent [element1] to [element2]',
            arguments: {
              element1: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              },
              element2: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '/',
              },
            },
          },
          {
            opcode: 'deleteElement',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Delete element [elm]',
            arguments: {
              elm: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              },
            },
          },
          {
            opcode: 'clearAllElements',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Clear all elements',
          },
          {
            opcode: 'getProperty',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get property [property] from [element]',
            arguments: {
              property: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'style',
              },
              element: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              },
            },
          },

          {
            opcode: 'strformat',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Format string [STRING]',
            arguments: {
              STRING: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '<p>Check out my website, pooiod7.dev</p>',
              },
            },
          },

          {
            opcode: 'elementExists',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Element [elm] exists?',
            arguments: {
              elm: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              },
            },
          },

          {
            blockType: "label", text: "Styles",
          },

          {
            opcode: 'setStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set [property] of [element] to [value]',
            arguments: {
              property: {
                type: Scratch.ArgumentType.STRING,
                menu: 'styleProperties',
                defaultValue: 'filter',
              },
              element: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'blur(2px)',
              },
            },
          },
          {
            opcode: 'addStyle',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add css [STYLE] with id [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'style1',
              },
              STYLE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'body { background-color: yellow; }',
              },
            },
          },
          {
            opcode: 'setTransition',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set transition of [property] on [element] to [value]',
            arguments: {
              property: {
                type: Scratch.ArgumentType.STRING,
                menu: 'styleProperties',
                defaultValue: 'backgroundColor',
              },
              element: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '2s ease-in-out',
              },
            },
          },

          {
            blockType: "label", text: "Interactions",
          },

          {
            opcode: 'setInteract',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set HTML interactions to [interact]',
            arguments: {
              interact: {
                type: Scratch.ArgumentType.BOOLEAN,
                menu: 'truefalse',
                defaultValue: true,
              },
            },
          },
          {
            blockType: Scratch.BlockType.HAT, // REPORTER // HAT
            opcode: 'whenelmclicked',
            text: 'When element [ELM] clicked',
            isEdgeActivated: true,
            arguments: {
              ELM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              }
            }
          },
          {
            opcode: 'ishovering',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Hovering [ELM]',
            arguments: {
              ELM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              }
            }
          },
          {
            opcode: 'isactive',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Button [ELM] active',
            arguments: {
              ELM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              }
            }
          },
          {
            opcode: 'isclicking',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[ELM] clicked',
            arguments: {
              ELM: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '#elementId',
              }
            }
          },

          {
            blockType: "label", text: "Scripts",
          },
          {
            func: "enablejs",
            blockType: Scratch.BlockType.BUTTON,
            text: "Enable scripts",
            hideFromPalette: this.canscript
          },
          
          {
            opcode: 'addScript',
            hideFromPalette: !this.canscript,
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add script [script] with id [id]',
            arguments: {
              script: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'alert("Hello, World!");',
              },
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'script1',
              },
            },
          },
          {
            opcode: 'runScript',
            hideFromPalette: !this.canscript,
            blockType: Scratch.BlockType.REPORTER,
            text: 'Run script [script]',
            arguments: {
              script: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1 + 1',
              },
            },
          },
          "---",
        ],
        menus: {
          elementTypes: [
            'div',
            'span',
            'p',
            'a',
            'img',
            'button',
            'iframe',
            'br',
            'wbr',
            
            'h1',
            'h2',
            'h3',
            'h4',
            'h5',
            'h6',

            'form',
            'fieldset',
            'legend',
            'textarea',
            'input',
            'label',

            'article',
            'main',
            'nav',
            
            'header',
            'footer',

            'audio',
            'video',
            'source',

            'select',
            'option',
            
            'b',
            'i',
            'u',
            's',

            'dialog',
            
            'mark',
            'sub',
            'sup',
            'em',
            'strong',
            'ins',
            'del',
            'small',
            'big',
            'code',
            'kbd',
            'samp',
            'var',
            'cite',
            'dfn',
            'abbr',
            'time'
          ],
          truefalse: ['true', 'false'],
          styleProperties: [
            'filter',
            'width',
            'height',
            'position',
            'border',
            'borderWidth',
            'borderRadius',
            'borderStyle',
            'borderColor',
            'backgroundColor',
            'background',
            'color',
            'top',
            'left',
            'right',
            'bottom',
          ],
        },
      };
    }

    createOverlayFrame() {
      this.page = document.createElement('iframe');
      this.page.style.position = 'absolute';
      this.page.style.left = '50%';
      this.page.style.top = '50%';
      this.page.style.transform = 'translate(-50%, -50%)';
      this.page.style.width = '100%';
      this.page.style.height = '100%';
      this.page.style.border = 'none';
      this.page.id = "htmlcanvaspageiframe";
      vm.runtime.renderer.canvas.parentNode.appendChild(this.page);
      this.pagecontent = this.page.contentDocument;
      this.clearAllElements(true);
      this.setClickThrough(true);
    }

    setClickThrough(shouldClickThrough) {
      this.page.style.pointerEvents = shouldClickThrough ? 'none' : 'auto';
    }

    toggledebug() {
      if (!this.pagecontent.getElementById('debugoutlineStyle')) {
        const styleElement = document.createElement('style');
        styleElement.id = 'debugoutlineStyle';
        styleElement.textContent = this.debugcss;
        this.pagecontent.head.appendChild(styleElement);
      } else {
        const styleElement = this.pagecontent.getElementById('debugoutlineStyle');
        if (styleElement) {
          styleElement.remove();
        }
      }
    }

    showdocs() {
      if (this.findelement("#extdocsp7codepen")) {
        this.clearAllElements();
        this.setClickThrough(true);
        Scratch.vm.extensionManager.refreshBlocks();
      } else {
        this.clearAllElements(true);
        var html = `<iframe src="https://pooiod7.neocities.org/markdown/#/projects/scratch/extensions/other/markdown/htmlcanvas" style="width: 100vw; height: calc(100vh + 0px); position: absolute; top: 0px; left: 0; border: none;"></iframe>`;
        var css = `body {margin:0px;padding:0px;} iframe{width:100%;height:100%;border:none;}`;
        this.makeElement({type:"iframe",id:"extdocsp7codepen"});
        this.setContent({elm:"#extdocsp7codepen",content:html});
        this.addStyle({STYLE:css,ID:"styledocs"});
        this.setClickThrough(false);

        Scratch.vm.extensionManager.refreshBlocks();

        this.docsloaded = false;
        setTimeout(function() {
          if (!this.docsloaded && this.findelement("#extdocsp7codepen")) {
            this.clearAllElements();
            window.open(this.docs);
            this.setClickThrough(true);
            Scratch.vm.extensionManager.refreshBlocks();
          } // my website is blocked by GoGardian
        }.bind(this), 4000);
      }
    }

    strformat(args) { // A basic string formatting function pulled from scratchx.free.nf
      var str = String(args.STRING);
      // strip harmful tags but allow user formated text
      var allowedTags = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'b', 'br', 'i', 'u', 's', 'mark', 'sub', 'sup', 'em', 'strong', 'ins', 'del', 'small', 'big', 'code', 'kbd', 'samp', 'var', 'cite', 'dfn', 'abbr', 'time', 'a', 'span', 'img'];
      str = str.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, function(match, p1) {
        // Check if the tag is in the allowedTags array
        if (allowedTags.indexOf(p1.toLowerCase()) !== -1) {
          return match; // Allowed tag, keep it
        } else {
          return ''; // Disallowed tag, remove it
        }
      });
      // newline fixes
      str = str.replace(/(?<!\\)\\n/g, " <br>");
      str = str.replace(/\n/g, " <br>");
      // @user links
      str = str.replace(/https:\/\/scratch\.mit\.edu\/users\/([\w-]+)/g, '@$1');
      str = str.replace(/(?<!\/)@([\w-]+)/g, '<a href="https://scratch.mit.edu/users/$1" target="_blank">@$1</a>');
      // https links
      str = str.replace(/(\/\/|www\.)([^ \n]+)/g, '$1<a href="https://$2" target="_blank">$2</a>');
      // special links
      str = str.replace(/web\.pooiod7/g, '<a href="https://pooiod7.pages.dev" target="_blank">web.pooiod7</a>');
      str = str.replace(/pooiod7\.dev/g, '<a href="https://pooiod7.pages.dev" target="_blank">pooiod7.dev</a>');
      return str;
    }

    makeElement(args) {
      const { type, id } = args;
      this.deleteElement("#" + id);
      const element = document.createElement(type);
      element.id = id;
      if (type == "a") {
        element.target = "_blank";
      }
      element.style.position = 'absolute';
      this.pagecontent.body.appendChild(element);
    }

    setContent(args) {
      const { elm, content } = args;
      const element = this.findelement(elm);
      if (element) {
        if (content.includes("<script") || content.includes("onclick=") || content.includes("onload=") || content.includes("onerror=") || content.includes("javascript:")) {
          if (!this.canscript) {
            if (!window.confirm("Do you want to allow this project to run custom javascript?")) {
              return;
            } else {
              this.canscript = true;
            }
          }
        }
        if (element.tagName.toLowerCase() === 'iframe') {
          if (content.startsWith("http")) {
            element.src = content;
          } else {
            element.src = "data:text/html;base64," + btoa(content);
          }
        } else if (element.tagName.toLowerCase() === 'source') {
          element.src = content;
        } else if (element.tagName.toLowerCase() === 'img') {
          element.src = content;
        } else {
          element.innerHTML = content;
        }
      }
    }

    setInteract(args) {
      const { interact } = args;
      this.setClickThrough(!interact);
    }

    findelement(elm) {
      return this.pagecontent.querySelector(elm);
    }

    whenelmclicked({ ELM }) {
      var element = this.findelement(ELM);

      if (!element) {
        return false;
      }

      if (!element.hasclickeventlistenerfromext) {
        element.hasclickeventlistenerfromext = true;
        element.hasbeenclickedrecently = false;

        element.addEventListener('click', function() {
          if (!element.hasbeenclickedrecently) {
            element.hasbeenclickedrecently = true;
            Scratch.vm.runtime.startHats('HTMLcanvas_whenelmclicked');

            setTimeout(function() {
              element.hasbeenclickedrecently = false;
              Scratch.vm.runtime.startHats('HTMLcanvas_whenelmclicked');
            }.bind(this), 100);
          }
        }.bind(this));

        element.addEventListener('tap', function() {
          if (!element.hasbeenclickedrecently) {
            element.hasbeenclickedrecently = true;
            Scratch.vm.runtime.startHats('HTMLcanvas_whenelmclicked');

            setTimeout(function() {
              element.hasbeenclickedrecently = false;
              Scratch.vm.runtime.startHats('HTMLcanvas_whenelmclicked');
            }.bind(this), 100);
          }
        }.bind(this));
        
        return false;
      } else {
        if (element.hasbeenclickedrecently) {
          return true;
        } else {
          return false;
        }
      }
    }

    ishovering({ ELM }) {
      var element = this.findelement(ELM);

      if (!element) {
        return false;
      }

      if (!element.hasHoverListenerFromExt) {
        element.hasHoverListenerFromExt = true;
        element.isHovered = false;

        element.addEventListener('mouseenter', function() {
          element.isHovered = true;
        });
        element.addEventListener('mouseleave', function() {
          element.isHovered = false;
        });

        element.addEventListener('touchstart', function() {
          element.isHovered = true;
        });
        element.addEventListener('touchend', function() {
          element.isHovered = false;
        });

        return element.isHovered;
      } else {
        return element.isHovered;
      }
    }


    isactive({ ELM }) {
      var element = this.findelement(ELM);
      if (!element) {
        return false;
      }

      return this.pagecontent.activeElement === element;
    }

    isclicking({ ELM }) {
      var element = this.findelement(ELM);

      if (!element) {
        return false;
      }

      if (!element.hasMouseDownListenerFromExt) {
        element.hasMouseDownListenerFromExt = true;
        element.isMouseDown = false;

        element.addEventListener('mousedown', function() {
          element.isMouseDown = true;
        });

        element.addEventListener('mouseup', function() {
          element.isMouseDown = false;
        });

        return element.isMouseDown;
      } else {
        return element.isMouseDown;
      }
    }

    setProperty(args) {
      const { property, element, value } = args;
      const targetElement = this.findelement(element);

      if (value.includes("javascript:") || property == "onclick" || property == "onerror" || property == "onload") {
        if (!this.canscript) {
          if (!window.confirm("Do you want to allow this project to run custom javascript?")) {
            return;
          } else {
            this.canscript = true;
          }
        }
      }
      
      if (targetElement) {
        targetElement[property] = value;
      }
    }

    getProperty(args) {
      const { property, element } = args;
      const targetElement = this.findelement(element);

      if (targetElement) {
        var jsonreturn = targetElement[property];
        if (!this.isobject(jsonreturn)) {
          try {
            jsonreturn = JSON.stringify(returncontent);
          } catch (e) {
            e = e;
          }
        }
        return jsonreturn;
      } else {
        return false;
      }
    }

    setStyle(args) {
      const { property, element, value } = args;
      const targetElement = this.findelement(element);
      if (targetElement) {
        targetElement.style[property] = value;
      }
    }

    addStyle({ ID, STYLE }) {
      const existingStyle = this.pagecontent.getElementById(ID);
      if (existingStyle) {
        if (existingStyle.href) {
          existingStyle.href = STYLE;
        } else {
          existingStyle.textContent = STYLE;
        }
      } else {
        if (STYLE.startsWith("http")) {
          const linkElement = document.createElement('link');
          linkElement.rel = 'stylesheet';
          linkElement.href = STYLE;
          linkElement.id = ID;
          this.pagecontent.head.appendChild(linkElement);
        } else {
          const styleElement = document.createElement('style');
          styleElement.id = ID;
          styleElement.textContent = STYLE;
          this.pagecontent.head.appendChild(styleElement);
        }
      }
    }

    setTransition({ property, element, value }) {
      const el = this.findelement(element);
      property = property.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      if (!el) {
        return;
      }
      let currentTransition = el.style.transition;
      let transitions = currentTransition ? currentTransition.split(',').map(t => t.trim()) : [];
      const existingTransitionIndex = transitions.findIndex(t => t.startsWith(property));
      if (value === '') {
        if (existingTransitionIndex !== -1) {
          transitions.splice(existingTransitionIndex, 1);
        }
      } else {
        const newTransition = `${property} ${value}`;
        if (existingTransitionIndex !== -1) {
          transitions[existingTransitionIndex] = newTransition;
        } else {
          transitions.push(newTransition);
        }
      }
      el.style.transition = transitions.join(', ');
    }

    setParent(args) {
      const { element1, element2 } = args;
      try {
        const childElement = this.findelement(element1);
        if (element2 === '/') { // you can also just say "body"
          this.pagecontent.body.appendChild(childElement);
        } else {
          const parentElement = this.findelement(element2);
          if (parentElement && childElement) {
            parentElement.appendChild(childElement);
          }
        }
      } catch (e) {
        console.error('Error setting parent:', e);
      }
    }

    elementExists({ elm }) {
      return !!this.findelement(elm);
    }

    deleteElement({ elm }) {
      let element = this.findelement(elm);
      if (element) {
        element.parentNode.removeChild(element);
      }
    }

    clearAllElements() {
      if (this.pagecontent.getElementById('debugoutlineStyle')) {
        const newDoc = document.implementation.createHTMLDocument();
        this.page.contentDocument.documentElement.replaceWith(newDoc.documentElement);
        this.toggledebug();
      } else {
        const newDoc = document.implementation.createHTMLDocument();
        this.page.contentDocument.documentElement.replaceWith(newDoc.documentElement);
      }
    }

    addScript({ script }) {
      if (!this.canscript) {
        if (!window.confirm("Do you want to allow this project to run custom javascript?")) {
          return;
        } else {
          this.canscript = true;
        }
      }

      try {
        const scriptElement = this.pagecontent.createElement('script');
        scriptElement.text = script;
        this.pagecontent.head.appendChild(scriptElement);
      } catch (e) {
        console.error('Error adding script:', e);
      }
    }

    isobject(obj) {
      return typeof obj === 'object'
    }

    runScript({ script }) {
      if (!this.canscript) {
        if (!window.confirm("Do you want to allow this project to run custom javascript?")) {
          return;
        } else {
          this.canscript = true;
        }
      }

      try {
        var returncontent = this.page.contentWindow.eval(script);
        var jsonreturn = returncontent;
        if (!this.isobject(jsonreturn)) {
          try {
            jsonreturn = JSON.stringify(jsonreturn);
          } catch (e) {
            e = e;
          }
        }
        return jsonreturn;
      } catch (e) {
        console.error('Error running script:', e);
        return e;
      }
    }

    enablejs() {
      if (!this.canscript) {
        if (!window.confirm("Do you want to allow this project to run custom javascript?")) {
          return;
        } else {
          this.canscript = true;
          Scratch.vm.extensionManager.refreshBlocks();
        }
      } else {
        alert("Scripts already enabled");
      }
    }

  }

  Scratch.extensions.register(new HTMLCanvas());
})(Scratch);
