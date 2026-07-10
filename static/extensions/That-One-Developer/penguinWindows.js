(function(Scratch) {
    'use strict';
    class Extension {
        constructor() {
            this.allWindows = {};
        }
        getInfo() {
            return {
                id: "jonathanWindows",
                name: "Penguin Windows",
                color1: "#e0c919",
                color2: "#f5dc22",
                color3: "#bf9022",
                blocks: [
                    {
                        opcode: 'openblankWindow',
                        text: 'Open Blank Window With ID [ID]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'window1',
                            }
                        }
                    },
                    {
                        opcode: 'openhtmlWindow',
                        text: 'Open Window with HTML [HTML] and ID [ID]',
                        blockType: Scratch.BlockType.COMMAND, // 1. FIXED: Changed blocktype to blockType
                        arguments: {
                            HTML: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '<h1>Hello World</h1>',
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'window1',
                            }
                        }
                    },
                    {
                        opcode: 'closewindowwithId',
                        text: 'Close Window with id [ID]',
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'window1',
                            }
                        }
                    },
                    {
                        opcode: 'closeallWindows',
                        text: 'Close all windows',
                        blockType: Scratch.BlockType.COMMAND,
                    },
                    { 
                        opcode: 'windowAmount',
                        text: 'Amount of Windows',
                        blockType: Scratch.BlockType.REPORTER,
                    }
                ]
            };
        }
        openblankWindow(args) {
            this.allWindows[args.ID] = window.open('', '_blank', 'width=600,height=400');
        }
        openhtmlWindow(args) {
            const openedWindow = window.open('', '_blank', 'width=600,height=400');
            this.allWindows[args.ID] = openedWindow;
            if (openedWindow) {
                openedWindow.document.write(args.HTML);
                openedWindow.document.close();
            }
        }
    closewindowwithId(args) {
        this.allWindows[args.ID]?.close();
        delete this.allWindows[args.ID];  
    }
    closeallWindows() {
        Object.values(this.allWindows).forEach(win => win?.close()); 
    this.allWindows = {};
    }
    windowAmount() {
   return Object.keys(this.allWindows).length;     
   }
    }
    Scratch.extensions.register(new Extension());
})(Scratch);
