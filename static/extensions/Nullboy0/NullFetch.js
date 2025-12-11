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
                "id": "nullboyNullFetch",
                "name": "NullFetch",
                "color1": "#0fbd8c",
                "blocks": [{
                    "opcode": "block_0d47bbad80920232",
                    "text": "fetch [b6cd0cd9cedbc808] [fcf10a6fc8576428]",
                    "blockType": "command",
                    "arguments": {
                        "b6cd0cd9cedbc808": {
                            "type": "string",
                            "defaultValue": "https://www.google.com/"
                        },
                        "fcf10a6fc8576428": {
                            "type": "string",
                            "defaultValue": "{ method: \"GET\", headers: { \"Foo\": \"Bar\"}, body: \"foobar\" }"
                        }
                    }
                }]
            }
        }
        async block_0d47bbad80920232(args) {
            eval(String.prototype.concat(String("fetch(\""), args["b6cd0cd9cedbc808"], String("\", "), args["fcf10a6fc8576428"], String(")")))
        }
    }

    let extension = new Extension();
    // code compiled from extforge

    Scratch.extensions.register(extension);
})(Scratch);
