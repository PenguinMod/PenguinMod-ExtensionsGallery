// MADE FOR PENGUNMOD BY JUSTABLOCK
class penguinconsole {
    getInfo() {
        return {
            id: "penguinconsole",
            name: "Penguin Console",
            color1: "#ff7300",
            color2: "#f49510",
            blocks:[
                {
                    opcode: "sendcateg",
                    blockType: Scratch.BlockType.LABEL,
                    text: "Console loggers"
                  },
                {
                    opcode: "clog",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Log [LOG] to console",
                    arguments: {
                        LOG: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "This is log."
                        }
                    }
                },
                {
                    opcode: "cwarn",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Warn [WARN] to console",
                    arguments: {
                        WARN: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "This is warning."
                        }
                    }
                },
                {
                    opcode: "cerror",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Error [ERROR] to console",
                    arguments: {
                        ERROR: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "This is error."
                        }
                    }
                },
                {
                    opcode: "configcateg",
                    blockType: Scratch.BlockType.LABEL,
                    text: "Settings and Config"
                  },
                {
                    opcode: "center",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Enter dev console",
                },
                {
                    opcode: "cclear",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "Clear dev console",
                },
            ]
        }
    }
    clog(args) {
        if (args.LOG === ""){
            console.error("WRONG INPUT FOR LOG BLOCK!!!")
        } else{
        console.log(args.LOG)
        }
    }
    cwarn(args) {
        if (args.WARN === ""){
            console.error("WRONG INPUT FOR WARN BLOCK!!!")
        } else{
        console.warn(args.WARN)
        }
    }
    cerror(args) {
        if (args.ERROR === ""){
            console.error("WRONG INPUT FOR ERROR BLOCK!!!")
        } else{
        console.error(args.ERROR)
        }
    }
    center() {
        alert("Press 'ctrl+shift+i' to open console")
    }
    cclear() {
        console.clear()
    }
}

Scratch.extensions.register(new penguinconsole());
