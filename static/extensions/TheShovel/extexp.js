class jodieextexp {
    getInfo() {
        let defaultArgs = {
            FUNCNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue:"test"
            },
            EXTLIST: {
                type: Scratch.ArgumentType.MENU,
                menu: 'EXTLIST'
            },
            INPUT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue:'{"INPUT":"Hello World!"}'
            }
        };
        return {
            id: 'jodieextexp',
            name: 'Extension Exposer',
            blocks: [
                {
                    opcode: 'runcommand',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'run function [FUNCNAME] from [EXTLIST] with inputs [INPUT]',
                    arguments: defaultArgs
                },
                {
                    opcode: 'runreporter',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'run function [FUNCNAME] from [EXTLIST] with inputs [INPUT] ',
                    arguments: defaultArgs
                },
                {
                    opcode: 'runboolean',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'run function [FUNCNAME] from [EXTLIST] with inputs [INPUT]',
                    arguments: defaultArgs
                },
            ],
            menus: {
                EXTLIST: {
                    acceptReporters: true,
                    items: "getExtList"
                }
            }
        };
    }
    
    getExtList()  {
        return Array.from(vm.extensionManager._loadedExtensions.keys()); 
    }
    runcommand(args) {
        vm.runtime["ext_" + args.EXTLIST][args.FUNCNAME](JSON.parse(args.INPUT));
    }
    runreporter(args) {
        return vm.runtime["ext_" + args.EXTLIST][args.FUNCNAME](JSON.parse(args.INPUT));
    }
    runboolean(args) {
        return vm.runtime["ext_" + args.EXTLIST][args.FUNCNAME](JSON.parse(args.INPUT));
    }
    test(args) {
        return args.INPUT
    }
}

Scratch.extensions.register(new jodieextexp());