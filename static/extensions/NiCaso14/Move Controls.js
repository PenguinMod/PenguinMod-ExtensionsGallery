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
                "id": "nc14ext-movecontrols",
                "name": "Move controls",
                "color1": "#0033ff",
                "blocks": [{
                    "opcode": "block_c95abcbce3226c3f",
                    "text": "Degrees to turn moving with arrows",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_db20b46a08d32b01",
                    "text": "Move [676644052dece104] steps moving with arrows",
                    "blockType": "command",
                    "arguments": {
                        "676644052dece104": {
                            "type": "number",
                            "defaultValue": 10
                        }
                    }
                }, {
                    "opcode": "block_0a1dd2e2e976d273",
                    "text": "Number of steps moving with arrows",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_23c0f3d60ab13008",
                    "text": "Degrees to turn moving with WASD",
                    "blockType": "reporter",
                    "arguments": {}
                }, {
                    "opcode": "block_99c194c02a452e93",
                    "text": "Move [a1ca9305cc1303a6] moving with WASD",
                    "blockType": "command",
                    "arguments": {
                        "a1ca9305cc1303a6": {
                            "type": "number",
                            "defaultValue": 10
                        }
                    }
                }, {
                    "opcode": "block_81f5905b39ad0168",
                    "text": "Number of steps moving with WASD",
                    "blockType": "reporter",
                    "arguments": {}
                }]
            }
        }
        async block_c95abcbce3226c3f(args) {
            if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(("up arrow"))) {
                return (("90"))
            } else {
                if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(("left arrow"))) {
                    return (("0"))
                } else {
                    if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(("right arrow"))) {
                        return (("180"))
                    } else {
                        if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(("down arrow"))) {
                            return (("-90"))
                        };
                    };
                };
            };
        }
        async block_db20b46a08d32b01(args) {
            ExtForge.Variables.set("arrow steps", args["676644052dece104"])
        }
        async block_0a1dd2e2e976d273(args) {
            return (ExtForge.Variables.get("arrow steps"))
        }
        async block_23c0f3d60ab13008(args) {
            if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(("w"))) {
                return (("90"))
            } else {
                if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(("a"))) {
                    return (("0"))
                } else {
                    if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(("d"))) {
                        return (("180"))
                    } else {
                        if (Scratch.vm.runtime.ioDevices.keyboard.getKeyIsDown(("s"))) {
                            return (("-90"))
                        };
                    };
                };
            };
        }
        async block_99c194c02a452e93(args) {
            ExtForge.Variables.set("WASD steps", args["a1ca9305cc1303a6"])
        }
        async block_81f5905b39ad0168(args) {
            return (ExtForge.Variables.get("arrow steps"))
        }
    }

    let extension = new Extension();
    // code compiled from extforge
    (async () => {
        ExtForge.Variables.set("arrow steps", Scratch.Cast.toNumber((10)))
    })();

    Scratch.extensions.register(extension);
})(Scratch);
