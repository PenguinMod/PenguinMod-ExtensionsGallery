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

        Vector: class {
            constructor(x, y) {
                this.x = x;
                this.y = y;
            }

            static from(v) {
                if (v instanceof ExtForge.Vector) return v
                if (v instanceof Array) return new ExtForge.Vector(Number(v[0]), Number(v[1]))
                if (v instanceof Object) return new ExtForge.Vector(Number(v.x), Number(v.y))
                return new ExtForge.Vector()
            }

            add(v) {
                return new Vector(this.x + v.x, this.y + v.y);
            }

            set(x, y) {
                return new Vector(x ?? this.x, y ?? this.y)
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
                "id": "37373636",
                "name": "More blocks ",
                "color1": "#0800ff",
                "blocks": [{
                    "opcode": "block_14821e870ca38b14",
                    "text": "space",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_743cd87aeeedc1a8",
                    "text": "[9b2380133c87ccc6]",
                    "blockType": "reporter",
                    "arguments": {
                        "9b2380133c87ccc6": {
                            "type": "string"
                        }
                    }
                }, {
                    "opcode": "block_8c311a6b6429daf6",
                    "text": "[8ba8263fd77dd952]",
                    "blockType": "Boolean",
                    "arguments": {
                        "8ba8263fd77dd952": {
                            "type": "string"
                        }
                    }
                }, {
                    "opcode": "block_4386ac2c1cf46e32",
                    "text": "[51fbfafb4bab601e]",
                    "blockType": "reporter",
                    "arguments": {
                        "51fbfafb4bab601e": {
                            "type": "number",
                            "defaultValue": 0
                        }
                    }
                }, {
                    "opcode": "block_330ace58a966673c",
                    "text": "[2f5385429776110e]",
                    "blockType": "Boolean",
                    "arguments": {
                        "2f5385429776110e": {
                            "type": "number",
                            "defaultValue": 0
                        }
                    }
                }, {
                    "opcode": "block_98a2a4a011a568b1",
                    "text": "[e6d40e2437eed2c2]",
                    "blockType": "Boolean",
                    "arguments": {
                        "e6d40e2437eed2c2": {
                            "type": "Boolean"
                        }
                    }
                }, {
                    "opcode": "block_3cc13e4ad63f98fa",
                    "text": "[c9426c0356092956]",
                    "blockType": "reporter",
                    "arguments": {
                        "c9426c0356092956": {
                            "type": "Boolean"
                        }
                    }
                }, {
                    "opcode": "block_5df904ec392a9145",
                    "text": "",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_40cd4bef3b80b1f0",
                    "text": "Project Timer",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_35d3f7e3047092a3",
                    "text": "Start Project",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_742f0884d952d38c",
                    "text": "Stop Project",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_486e18d499c531b0",
                    "text": "Wait until Turbo Mode is enabled (broken)",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_d199a739efa37392",
                    "text": "Turbo Mode on (broken)",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_f330abbeec943402",
                    "text": "Turbo Mode off (broken)",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_560b5746f65b0f43",
                    "text": "Turbo Mode random off and on (broken)",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_f2d486ecd72fcc53",
                    "text": "FPS",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_d9ea62810277c3db",
                    "text": "FPS",
                    "blockType": "Boolean",
                    "arguments": {}
                }, {
                    "opcode": "block_68408c7ba7c721fa",
                    "text": "If Turbo Mode is on then continue else stop (broken)",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_fdc8eecec7be2d44",
                    "text": "If Turbo Mode is on then continue else stop (broken)",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_202f0f5c523f27ac",
                    "text": "If Turbo Mode is on then continue else stop (broken)",
                    "blockType": "Boolean",
                    "arguments": {}
                }, {
                    "opcode": "block_88d45bc9c1a4be8b",
                    "text": "Wait until next frame",
                    "blockType": "command",
                    "arguments": {}
                }, {
                    "opcode": "block_7e9e89945097662e",
                    "text": "Wait until next frame",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_afa8684bc63f15b2",
                    "text": "Wait until next frame",
                    "blockType": "Boolean",
                    "arguments": {}
                }, {
                    "opcode": "block_8b5ae5d44c937d9c",
                    "text": "eval [e949cf5226dfb3ce]",
                    "blockType": "command",
                    "arguments": {
                        "e949cf5226dfb3ce": {
                            "type": "string",
                            "defaultValue": "eval"
                        }
                    }
                }, {
                    "opcode": "block_55add9761333f6db",
                    "text": "eval [e84aa8b709d88f7b]",
                    "blockType": "reporter",
                    "arguments": {
                        "e84aa8b709d88f7b": {
                            "type": "string",
                            "defaultValue": "eval"
                        }
                    }
                }, {
                    "opcode": "block_a0cb6434305efeb4",
                    "text": "set frame rate to [d986f71fe44e7e03]",
                    "blockType": "command",
                    "arguments": {
                        "d986f71fe44e7e03": {
                            "type": "number",
                            "defaultValue": 30
                        }
                    }
                }, {
                    "opcode": "block_8ddf1e71129b307a",
                    "text": "return [8ff3bd808a4a964a]",
                    "blockType": "command",
                    "arguments": {
                        "8ff3bd808a4a964a": {
                            "type": "number",
                            "defaultValue": 0
                        }
                    }
                }, {
                    "opcode": "block_bba7aae438a7ffd6",
                    "text": "return [9544f5522a2d3f80]",
                    "blockType": "command",
                    "arguments": {
                        "9544f5522a2d3f80": {
                            "type": "string"
                        }
                    }
                }, {
                    "opcode": "block_2eec727b37d9b3cd",
                    "text": "return [b0882f9890661813]",
                    "blockType": "command",
                    "arguments": {
                        "b0882f9890661813": {
                            "type": "Boolean"
                        }
                    }
                }, {
                    "opcode": "block_1f5ed8d483ae9cec",
                    "text": "is mobile?",
                    "blockType": "Boolean",
                    "arguments": {}
                }, {
                    "opcode": "block_c8c4834ae67d779a",
                    "text": "get browser",
                    "blockType": "reporter",
                    "arguments": {}
                }]
            }
        }
        async block_14821e870ca38b14(args) {}
        async block_743cd87aeeedc1a8(args) {}
        async block_8c311a6b6429daf6(args) {}
        async block_4386ac2c1cf46e32(args) {}
        async block_330ace58a966673c(args) {}
        async block_98a2a4a011a568b1(args) {}
        async block_3cc13e4ad63f98fa(args) {}
        async block_5df904ec392a9145(args) {}
        async block_40cd4bef3b80b1f0(args) {
            return Scratch.vm.runtime.ioDevices.clock.projectTimer();
        }
        async block_35d3f7e3047092a3(args) {
            Scratch.vm.greenFlag();
        }
        async block_742f0884d952d38c(args) {
            Scratch.vm.stopAll();
        }
        async block_486e18d499c531b0(args) {
            await new Promise(temp_c3ec235830686c9de33f6d13 => {
                let temp_e6685e19055fd6c105a8f209 = () => false ? temp_c3ec235830686c9de33f6d13() : requestAnimationFrame(temp_e6685e19055fd6c105a8f209);
                temp_e6685e19055fd6c105a8f209()
            })
        }
        async block_d199a739efa37392(args) {
            Scratch.vm.runtime.turboMode = true;
        }
        async block_f330abbeec943402(args) {
            Scratch.vm.runtime.turboMode = false;
        }
        async block_560b5746f65b0f43(args) {
            Scratch.vm.runtime.turboMode = (Math.random() > .5);
        }
        async block_f2d486ecd72fcc53(args) {
            return Scratch.vm.runtime.frameLoop.framerate;
        }
        async block_d9ea62810277c3db(args) {
            return Scratch.vm.runtime.frameLoop.framerate;
        }
        async block_68408c7ba7c721fa(args) {
            if (Scratch.vm.runtime.turboMode) {
                Scratch.vm.greenFlag();
            } else {
                Scratch.vm.stopAll();
            };
        }
        async block_fdc8eecec7be2d44(args) {
            if (Scratch.vm.runtime.turboMode) {
                Scratch.vm.greenFlag();
            } else {
                Scratch.vm.stopAll();
            };
        }
        async block_202f0f5c523f27ac(args) {
            if (Scratch.vm.runtime.turboMode) {
                Scratch.vm.greenFlag();
            } else {
                Scratch.vm.stopAll();
            };
        }
        async block_88d45bc9c1a4be8b(args) {
            await new Promise(temp_0504d8bd6512ac3543ea0e3a => {
                requestAnimationFrame(() => {
                    temp_0504d8bd6512ac3543ea0e3a()
                })
            })
        }
        async block_7e9e89945097662e(args) {
            await new Promise(temp_1a98e433141e77893bd812b3 => {
                requestAnimationFrame(() => {
                    temp_1a98e433141e77893bd812b3()
                })
            })
        }
        async block_afa8684bc63f15b2(args) {
            await new Promise(temp_929a7846c1092bea522a6c66 => {
                requestAnimationFrame(() => {
                    temp_929a7846c1092bea522a6c66()
                })
            })
        }
        async block_8b5ae5d44c937d9c(args) {
            eval(args["e949cf5226dfb3ce"])
        }
        async block_55add9761333f6db(args) {
            eval(args["e84aa8b709d88f7b"])
        }
        async block_a0cb6434305efeb4(args) {
            Scratch.vm.runtime.frameLoop.setFramerate(args["d986f71fe44e7e03"]);
        }
        async block_8ddf1e71129b307a(args) {
            return args["8ff3bd808a4a964a"];
        }
        async block_bba7aae438a7ffd6(args) {
            return args["9544f5522a2d3f80"];
        }
        async block_2eec727b37d9b3cd(args) {
            return args["b0882f9890661813"];
        }
        async block_1f5ed8d483ae9cec(args) {
            eval(("/Mobi|Android|iPhone/i.test(navigator.userAgent)\n"))
        }
        async block_c8c4834ae67d779a(args) {
            eval(("((a=navigator.userAgent)=>/edg/i.test(a)?'Edge':/opr/i.test(a)?'Opera':/chrome/i.test(a)?'Chrome':/firefox/i.test(a)?'Firefox':/safari/i.test(a)?'Safari':'Other')()\n"))
        }
    }

    let extension = new Extension();
    // code compiled from extforge
    (async () => {
        eval(("alert(\"48w22?\")"))
    })();

    Scratch.extensions.register(extension);
})(Scratch);
