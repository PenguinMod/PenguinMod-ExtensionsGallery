// Name: New Windows
// ID: monowindows
// Description: Lets you open websites in new windows.
// By: Monochromasity

(function (Scratch) {
  "use strict";
  
  let menubar = "no";
  let status = "no";
  let titlebar = "no";
  let full = "no";
  let location = "no";
  let resizable = "no";
  let scroll = "no";
  let toolbar = "no";
  let replace = "false";

  class NewWindows {
    getInfo() {
      return {
        id: 'monowindows',
        color1: '#297bff',
        name: 'New Windows',
        blocks: [
          {
            opcode: 'openwindow',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open website [WEB] in new window with ID: [ID] width: [WIDTH] height: [HEIGHT] distance from left: [LEFT] distance from top: [TOP]',
            arguments: {
              WEB: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://penguinmod.com'
              },
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myWindow'
              },
              WIDTH: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '400'
              },
              HEIGHT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '400'
              },
              LEFT: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              },
              TOP: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: '0'
              }
            }
          },
          {
            opcode: 'setproperty',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set window property [PROPERTY] to [TOGGLE]',
            arguments: {
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'PROPERTY'
              },
              TOGGLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'TOGGLE'
              }
            }
          },
          {
            opcode: 'reset',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset properties to default',
            hideFromPalette: true
          },
          {
            opcode: 'getproperty',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get value of property [PROPERTY]',
            arguments: {
              PROPERTY: {
                type: Scratch.ArgumentType.STRING,
                menu: 'PROPERTY'
              }
            }
          },
          {
            opcode: 'closewithid',
            blockType: Scratch.BlockType.COMMAND,
            text: 'close window with id [ID]',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myWindow'
              }
            }
          },
          {
            opcode: 'isopen',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'is window with ID [ID] open?',
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'myWindow'
              }
            }
          }
        ],
        menus: {
          PROPERTY: {
            acceptReporters: true,
            items: [
              {
                text: 'menu bar',
                value: 'menubar'
              },
              {
                text: 'status bar',
                value: 'status'
              },
              {
                text: 'title bar',
                value: 'titlebar'
              },
              {
                text: 'fullscreen (IE only)',
                value: 'full'
              },
              {
                text: 'address field (Opera only)',
                value: 'location'
              },
              {
                text: 'resizable (IE only)',
                value: 'resizable'
              },
              {
                text: 'scrollbars (IE, Firefox, Opera only)',
                value: 'scroll',
              },
              {
                text: 'toolbar (IE, Firefox)',
                value: 'toolbar',
              },
              {
                text: 'replace (Deprecated)',
                value: 'replace'
              }
            ]
          },
          TOGGLE: {
            acceptReporters: true,
            items: [
              {
                text: 'true',
                value: 'yes'
              },
              {
                text: 'false',
                value: 'no'
              }
            ]
          }
        }
      };
    }

    openwindow(args) {
      let web = args.WEB;
      let iduf = args.ID;
      let id = iduf.toLowerCase();
      let width = args.WIDTH;
      let height = args.HEIGHT;
      let strstart = "width=";
      let left = Math.abs(Number(args.LEFT));
      let top = Math.abs(Number(args.TOP));
      let str = strstart.concat(width, ",height=", height, ",fullscreen=", full, ",left=", left, ",top=", top, ",menubar=", menubar, ",status=", status, ",titlebar=", titlebar, ",location=", location, ",resizable=", resizable, ",scrollbars=", scroll, ",toolbar=", toolbar);
      console.log(str);
      let name = "windows" + id;
      this[name] = window.open(web, '', str, replace);
    }
    closewithid(args) {
      let iduf = args.ID;
      let id = iduf.toLowerCase();
      let name = "windows" + id;
      this[name].close();
    }
    isopen(args) {
      let iduf = args.ID;
      let id = iduf.toLowerCase();
      let name = "windows" + id;
      try {
        if (!this[name].closed) {
          return true;
        } else {
          return false;
        }
      }
      catch(err) {
        return false;
      }
    }
    setproperty(args) {
      let title = args.PROPERTY;
      if (title == "replace") {
        let toggle = args.TOGGLE;
        if (toggle == "yes") {
          this[title] = "true";
        } else if (toggle == "no") {
          this[title] = "false";
        }
      } else {
        this[title] = args.TOGGLE;
      }
    }
    reset() {
      menubar = "no";
      status = "no";
      titlebar = "no";
      full = "no";
      location = "no";
      resizable = "no";
      scroll = "no";
      toolbar = "no";
      replace = "false";
    }
    getproperty(args) {
      let title = args.PROPERTY;
      let propval = this[title];
      if (propval == "yes") {
        return true;
      } else if (propval == "no") {
        return false;
      } else {
        return propval;
      }
    }
  }
  Scratch.extensions.register(new NewWindows());
})(Scratch);
