// Name: New Windows
// ID: monowindows
// Description: Lets you open websites in new windows.
// By: Monochromasity

(function (Scratch) {
  "use strict";

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
            text: 'open website [WEB] in new window with ID: [ID] width: [WIDTH] height: [HEIGHT] distance from left: [LEFT] distance from top: [TOP] show menu bar: [MENUBAR] add status bar: [STATUSBAR] show title bar: [TITLEBAR] fullscreen (Internet Explorer): [FULLSCREEN] show address field (Opera): [LOCATION] resizable (Internet Explorer): [RESIZABLE] show scrollbars (Internet Explorer, Firefox, Opera): [SCROLL] show toolbar (Internet Explorer, Firefox): [TOOLBAR] replace (Deprecated): [REPLACE]',
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
              },
              MENUBAR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'MENUBAR',
                defaultValue: 'no'
              },
              STATUSBAR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'STATUSBAR',
                defaultValue: 'no'
              },
              TITLEBAR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'TITLEBAR',
                defaultValue: 'no'
              },
              FULLSCREEN: {
                type: Scratch.ArgumentType.STRING,
                menu: 'FULLSCREEN',
                defaultValue: 'no'
              },
              LOCATION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'LOCATION',
                defaultValue: 'no'
              },
              RESIZABLE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'RESIZABLE',
                defaultValue: 'yes'
              },
              SCROLL: {
                type: Scratch.ArgumentType.STRING,
                menu: 'SCROLL',
                defaultValue: 'yes'
              },
              TOOLBAR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'TOOLBAR',
                defaultValue: 'yes'
              },
              REPLACE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'REPLACE',
                defaultValue: 'false'
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
          FULLSCREEN: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          MENUBAR: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          STATUSBAR: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          TITLEBAR: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          LOCATION: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          RESIZABLE: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          SCROLL: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          TOOLBAR: {
            acceptReporters: true,
            items: ['yes', 'no']
          },
          REPLACE: {
            acceptReporters: true,
            items: ['true', 'false']
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
      let full = args.FULLSCREEN;
      let left = Math.abs(Number(args.LEFT));
      let top = Math.abs(Number(args.TOP));
      let menubar = args.MENUBAR;
      let status = args.STATUSBAR;
      let titlebar = args.TITLEBAR;
      let location = args.LOCATION;
      let resizable = args.RESIZABLE;
      let scroll = args.SCROLL;
      let toolbar = args.TOOLBAR;
      let replace = args.REPLACE;
      let str = strstart.concat(width, ",height=", height, ",fullscreen=", full, ",left=", left, ",top=", top, ",menubar=", menubar, ",status=", status, ",titlebar=", titlebar, ",location=", location, ",resizable=", resizable, ",scrollbars=", scroll, ",toolbar=", toolbar);
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
  }
  Scratch.extensions.register(new NewWindows());
})(Scratch);
