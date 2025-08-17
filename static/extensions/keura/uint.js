var decoder = new TextDecoder('utf8');

class CustomArray {
    constructor(data, type, context) {
        let TypeClass = globalThis[type];

        data = data.data || data;
        if (TypeClass != Array) {
            data = data.buffer || data;
        }
        if (typeof data == "string" && data.startsWith('data:')) {
            data = Uint8Array.fromBase64(data.split(',')[1]).buffer
        }

        if (TypeClass && (TypeClass == Array || TypeClass.prototype.__proto__ == Uint8Array.prototype.__proto__)) {
            if (TypeClass == Array) {
                this.data = Array.from(data);
            } else {
                this.data = new TypeClass(data);
            }
            this.type = type;
            this.context = context;
        } else {
            throw new Error("That isn't a typed array!");
        }
    }
    toReporterContent() {
        let prefix = (this.context == "Bitmap") ? "image/png" : "image/bmp";
        if (this.context == "Bitmap" || this.context == "Bitmap (easy)") {
            const img = document.createElement("img");
            img.src = URL.createObjectURL(
                new Blob([this.data.buffer], { type: prefix })
            );
            return img;
        }
        const emWrap = document.createElement('span');
        emWrap.innerText = JSON.stringify(Array.from(this.data));
        return emWrap;
    }
    toString() {
        let prefix = (this.context == "Bitmap") ? "image/png" : "image/bmp";
        if (this.context == "Bitmap" || this.context == "Bitmap (easy)") {
            return "data:" + prefix + ";base64," + this.data.toBase64({options: "base64url"});
        }
        return JSON.stringify({
            type: this.type,
            context: this.context,
            data: Array.from(this.data) 
        });
    }
}
class Extension {
    getInfo() {
        return {
            id: 'keuraTypedArrays',
            name: 'Typed Arrays',
            color1: "#8d3ca6",
            blocks: [
                {

                    blockShape: Scratch.BlockShape.SQUARE,
                    opcode: 'init_arr',
                    blockType: Scratch.BlockType.REPORTER,
                    text: '[DATA] to [TYPE] array for [CONTEXT]',
                    arguments: {
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'type'
                        },
                        CONTEXT: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'context'
                        }
                    }
                },
                {
                    opcode: 'set_arr',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set [INDEX] in array [DATA] to [VALUE]',
                    arguments: {
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                        INDEX: {
                            type: Scratch.ArgumentType.NUMBER,
                        },
                        VALUE: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                    }
                },
                {
                    opcode: 'get_arr',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get [INDEX] in array [DATA]',
                    arguments: {
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                        INDEX: {
                            type: Scratch.ArgumentType.NUMBER,
                        }
                    }
                },
                {
                    opcode: 'string_arr',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'serialize array [DATA] via MIME type [TYPE]',
                    arguments: {
                        DATA: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                        }
                    }
                }
            ],
            menus: {
                type: {
                    items: ["Int8Array","Uint8Array","Uint8ClampedArray","Int16Array","Uint16Array","Int32Array","Uint32Array","Float16Array","Float32Array","Float64Array","BigInt64Array","BigUint64Array","Array"].map(x => ({
                        text: x.replace('Array','').replace(/([A-Z])/g, " $1").replace(/([0-9]+)/g, " $1 Bits").replaceAll(/Int/g,"Signed Integer").replaceAll(/Uint/g,"Unsigned Integer").replaceAll(/^$/g,'Default'),
                        value: x
                    }))
                },
                context: {
                    items: ["JSON","Bitmap", "Bitmap (easy)"].map(x => ({
                        text: x,
                        value: x
                    }))
                }
            }
        }
    }
    init_arr({DATA, TYPE, CONTEXT}) {
        return new CustomArray(DATA,TYPE,CONTEXT);
    }
    get_arr({DATA, INDEX}) {
        return DATA.data[Number(INDEX)];
    }
    set_arr({DATA,INDEX,VALUE}) {
        DATA.data[Number(INDEX)] = VALUE;
        return VALUE;
    }
    string_arr({DATA,TYPE}) {
        return "data:" + TYPE + ";base64," + DATA.data.toBase64({options: "base64url"});    
    }
}

(function(Scratch) {
    Scratch.extensions.register(new Extension());
})(Scratch)
