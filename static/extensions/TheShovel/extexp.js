(function (Scratch) {
    'use strict';
    
    const parseJSON = (json) => {
        try {
            return JSON.parse(json);
        } catch {
            return {};
        }
    };

    class jodieextexp {
        getInfo() {
            const defaultArgs = {
                FUNCNAME: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: "test"
                },
                EXTLIST: {
                    type: Scratch.ArgumentType.STRING,
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
                        opcode: 'getfunctions',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get blocks from [EXTLIST]',
                        arguments: {
                            EXTLIST: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'EXTLIST'
                            },
                        }
                    },
                    {
                        opcode: 'runcommand',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'run function [FUNCNAME] from [EXTLIST] with inputs [INPUT]',
                        arguments: defaultArgs
                    },
                    {
                        opcode: 'runreporter',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        text: 'run function [FUNCNAME] from [EXTLIST] with inputs [INPUT]',
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
        
        getExtList() {
            return Array.from(Scratch.vm.extensionManager._loadedExtensions.keys());
        }
        getfunctions(args) {
            const extension = Scratch.vm.runtime["ext_" + args.EXTLIST];
            const info = extension.getInfo() || {};
            return (info.blocks || []).map(block => block.opcode).filter(opcode => !!opcode).join(",")
        }
        runcommand(args, util, realBlockInfo) {
            Scratch.vm.runtime["ext_" + args.EXTLIST][args.FUNCNAME](parseJSON(args.INPUT), util, realBlockInfo);
        }
        runreporter(args, util, realBlockInfo) {
            return Scratch.vm.runtime["ext_" + args.EXTLIST][args.FUNCNAME](parseJSON(args.INPUT), util, realBlockInfo);
        }
        runboolean(args, util, realBlockInfo) {
            return Scratch.vm.runtime["ext_" + args.EXTLIST][args.FUNCNAME](parseJSON(args.INPUT), util, realBlockInfo);
        }

        test(args) {
            return args.INPUT || "";
        }
    }
    
    Scratch.extensions.register(new jodieextexp());
})(Scratch);