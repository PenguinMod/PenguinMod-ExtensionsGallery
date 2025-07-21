/*
   Created with ExtForge
   https://jwklong.github.io/extforge
*/
(async function(Scratch) {
    const variables = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    const ExtForge = {
        Broadcasts: new function() {
            this.raw_ = {};
            this.register = (name, blocks) => {
                this.raw_[name] = blocks;
            };
            this.execute = async (name) => {
                if (this.raw_[name]) {
                    await this.raw_[name]();
                };
            };
        },

        Variables: new function() {
            this.raw_ = {};
            this.set = (name, value) => {
                this.raw_[name] = value;
            };
            this.get = (name) => {
                return this.raw_[name] ?? null;
            }
        },

        Utils: {
            setList: (list, index, value) => {
                [...list][index] = value;
                return list;
            },
            lists_foreach: {
                index: [0],
                value: [null],
                depth: 0
            },
            countString: (x, y) => {
                return y.length == 0 ? 0 : x.split(y).length - 1
            }
        }
    }

    class Extension {
        getInfo() {
            return {
                "id": "dearenjoythecookies",
                "name": "Granny's Cookies",
                "color1": "#c26700",
                "blocks": [{
                    "opcode": "block_16bc853b82f5c172",
                    "text": "Bake Cookie [fd2157001809ddd5] Value [cd2535f412a7c4e6] Atributes [2372c3013861ab1f]",
                    "blockType": "command",
                    "arguments": {
                        "fd2157001809ddd5": {
                            "type": "string"
                        },
                        "cd2535f412a7c4e6": {
                            "type": "string"
                        },
                        "2372c3013861ab1f": {
                            "type": "string"
                        }
                    }
                }, {
                    "opcode": "block_e1a6c15eedca9b8b",
                    "text": "Get Plate Of Cookies",
                    "blockType": "reporter",
                    "arguments": {}
                }]
            }
        }
        async block_16bc853b82f5c172(args) {
            if ((args["2372c3013861ab1f"] == (""))) {
                eval(String.prototype.concat(String("document.cookie = \""), args["fd2157001809ddd5"], String("="), args["cd2535f412a7c4e6"], String("\";")))
            } else {
                eval(String.prototype.concat(String("document.cookie = \""), args["fd2157001809ddd5"], String("="), args["cd2535f412a7c4e6"], String("\";"), args["2372c3013861ab1f"], String(";")))
            };
        }
        async block_e1a6c15eedca9b8b(args) {
            return (eval(("document.cookie")))
        }
    }

    let extension = new Extension();
    // code compiled from extforge

    Scratch.extensions.register(extension);
})(Scratch);
