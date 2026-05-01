

(async function(Scratch) {
    if (Scratch.gui) {
        Scratch.gui.getBlockly().then(ScratchBlocks => {
            ScratchBlocks.BlockSvg.registerCustomShape(
                "agBuffer-arrayBuffer",{
                    emptyInputPath: "m 31 0 h 10 h 10 a 4 4 0 0 1 4 4 h 7 l -7 7 v 10 l 7 7 h -7 a 4 4 0 0 1 -4 4 h -10 h -10 h -10 h -10 a 4 4 0 0 1 -4 -4 h -7 l 7 -7 v -10 l -7 -7 h 7 a 4 4 0 0 1 4 -4 z",
                    emptyInputWidth: 16 * ScratchBlocks.BlockSvg.GRID_UNIT,
                    leftPath: (block) => {
                        const edgeWidth = block.height / 2;
                        const s = edgeWidth / 16;
                        const height = edgeWidth * 2
                        return [
                            `h ${-10 * s} h ${- 10 * s} a 4 4 0 0 1 -4 -4 h ${-7 * s} l ${7*s} ${-7*s} v ${-(height - (14 * s) - 8)} l ${-7 * s} ${-7 * s} h ${7 * s} a 4 4 0 0 1 4 -4 h ${20 * s}`
                            // `a 4 4 0 0 1 -4 -4 h -7 l 7 -7 v -10 l -7 -7 h 7 a 4 4 0 0 1 4 -4`
                        ];
                    },
                    rightPath: (block) => {
                        const edgeWidth = block.height / 2;
                        const s = edgeWidth / 16;
                        const height = edgeWidth * 2
                        return [
                            `h ${10 * s} h ${10 * s} a 4 4 0 0 1 4 4 h ${7 * s} l ${-7 * s} ${7 * s} v ${(height - (14 * s) - 8)} l ${7 * s} ${7 * s} h ${-7 * s} a 4 4 0 0 1 -4 4 h ${-20 * s}`
                            // `a 4 4 0 0 1 4 4 h 7 l -7 7 v 10 l 7 7 h -7 a 4 4 0 0 1 -4 4`
                        ];
                    }
                }
            );
        })
    }
    
    const {BlockType, BlockShape, ArgumentType, Cast, vm} = Scratch
    const variables = {};
    
    const escapeHTML = unsafe => {
        return unsafe
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;")
    };
    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }
    class ArrayBufferType {
        arrayBuffer;
        dataView;
        
        static cast(obj) {
            if (obj instanceof ArrayBufferType) return obj
            else if (obj instanceof ArrayBufferPointerType) return obj.buffer
            else return new ArrayBufferType(obj)
        }

        toArrayBuffer() {
            return this.arrayBuffer
        }
        jwArrayHandler() {
            return `Buffer<${this.arrayBuffer.byteLength}>`
        }
        dogeiscutObjectHandler() {
            return `Array Buffer (Length: ${this.arrayBuffer.byteLength})`
        }
        // dogeiscutSetHandler() {
        //     return `Buffer<${this.arrayBuffer.byteLength}>`
        // }
        toJSON() {
            return Array.from(new Uint8Array(this.arrayBuffer))
        }
        divIntoIterHandler(Iter, {Item, Done}) {
            const {arrayBuffer, dataView} = this;
            return new Iter("ArrayBuffer",
                {i: 0}, 
                function*(state) {
                    return state.i >= arrayBuffer.byteLength ? Done() : Item(dataView.getUint8(state.i++))
                }
            );
        }
        customId = "agBuffer";
        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none" // Idk if this works i'm just trying stuff
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            let length = this.arrayBuffer.byteLength
            root.appendChild(span("Array Buffer:"))
            if (length > 0) {
                let binaryHeader = span("-BINARY-" + " 00\u200901\u200902\u200903\u200904\u200905\u200906\u200907\u200908\u200909\u20090A\u20090B\u20090C\u20090D\u20090E\u20090F")
                binaryHeader.style.fontSize = "9px"
                binaryHeader.style.textAlign = "left"
                binaryHeader.style.backgroundColor = "#808080a4" 
                binaryHeader.style.borderWidth = "3px"
                // binaryHeader.style.letterSpacing = "0px"
                binaryHeader.style.fontFamily = "monospace"
                root.appendChild(binaryHeader)
                for (let i = 0; i < Math.min(this.arrayBuffer.byteLength / 16, vm.agBuffer.maxReporterRows); i++) {
                    let arrBufDisplay = span(
                        `0x${(i * 16).toString(16).toUpperCase().padStart(6,"0")} ` + Array.from(new Uint8Array(this.arrayBuffer)).slice(i * 16,(i + 1) * 16).map(
                            (num, index) => {
                                return num.toString(16).toUpperCase().padStart(2, '0');
                            }
                        ).join("\u2009")//.padEnd(16*3,"\u2009..")
                    )
                    // arrBufDisplay.style.overflow = "hidden"
                    // arrBufDisplay.style.whiteSpace = "normal"
                    // arrBufDisplay.style.textOverflow = "ellipsis"
                    // arrBufDisplay.style.maxWidth = "256px"
                    arrBufDisplay.style.fontSize = "9px"
                    if (i % 2 === 1) arrBufDisplay.style.backgroundColor = "#88888845" 
                    else arrBufDisplay.style.backgroundColor = "#88888820"
                    // arrBufDisplay.style.letterSpacing = "0px"
                    arrBufDisplay.style.textAlign = "left"
                    arrBufDisplay.style.fontFamily = "monospace"
                    root.appendChild(arrBufDisplay)
                }
            } else {
                let emptyBuffer = span(`(Empty Buffer)`)
                emptyBuffer.style.color = "#888888"
                root.appendChild(emptyBuffer)
            }
            let sizeDisplay = span(`Byte Length: ${length}`)
            sizeDisplay.style.fontSize = "12px"
            root.appendChild(sizeDisplay)
            return root
        }
        toString() {
            return JSON.stringify([...(new Uint8Array(this.arrayBuffer))]);
        } 
        constructor(source, passthrough = true) { // Passthrough will return the source if the source is already an ArrayBufferType and passthrough is true, for optimization reasons
            source ??= 0;
            if (passthrough && ((typeof source === "object" && "customId" in source && source.customId === "agBuffer") || source instanceof ArrayBufferType)) return source;
            if (source instanceof Array) {
                // window.agBufferDebugLastType = "jsarray"
                // Uint8Array conversion is necessary because ArrayBuffer constructor doesn't take normal arrays as input
                this.arrayBuffer = (new Uint8Array(source)).buffer 
            } else if (source instanceof vm.jwArray.Type) {
                // window.agBufferDebugLastType = "jwArray"
                // Same reason here
                this.arrayBuffer = new Uint8Array(source.array).buffer
            } else if (typeof source === "number") {
                // window.agBufferDebugLastType = "length"
                // no Uint8Array needed as the constructor can take (number) to create a blank arraybuffer of length (number)
                this.arrayBuffer = new ArrayBuffer(source)
            } else if (source instanceof DataView && passthrough) {
                this.arrayBuffer = source.buffer
                this.dataView = source
                return
            } else if (source instanceof DataView) {
                this.arrayBuffer = source.buffer
            } else if (source instanceof Uint8Array || (source.buffer && source.buffer instanceof ArrayBuffer)) {
                // window.agBufferDebugLastType = "typedarray"
                this.arrayBuffer = source.buffer
            } else if (source instanceof ArrayBuffer) {
                // window.agBufferDebugLastType = "jsarraybuffer"
                this.arrayBuffer = source
            } else if (typeof source === "string" && (() => {try{return Array.isArray(JSON.parse(source))}catch{return false}})()) { // weird inline code to see if we can JSON.parse the string as array
                // window.agBufferDebugLastType = "json"
                this.arrayBuffer = new Uint8Array(JSON.parse(source)).buffer
            } else if (typeof source.toArrayBuffer === "function") {
                // window.agBufferDebugLastType = "toArrayBuffer"
                this.arrayBuffer = source.toArrayBuffer()
            } else if (typeof source === "string") {
                // window.agBufferDebugLastType = "fromString"
                this.arrayBuffer = new TextEncoder().encode(source).buffer;
            } else {
                // window.agBufferDebugLastType = "invalidBuffer"
                this.arrayBuffer = new ArrayBuffer(0);
            }
            
            // Make a dataview to access the buffer better
            this.dataView = new DataView(this.arrayBuffer)
            // some debug code so I can debug what the heck the problem is from the console
            
            // window.agBufferDebug = this;
        }
        get(type = "Uint8",index,endian = false) {
            switch (type) {
                case "Uint8":
                    return this.dataView.getUint8(index);
                case "Int8":
                    return this.dataView.getInt8(index);
                case "Uint16":
                    return this.dataView.getUint16(index,endian);
                case "Int16":
                    return this.dataView.getInt16(index,endian);
                case "Uint32":
                    return this.dataView.getUint32(index,endian);
                case "Int32":
                    return this.dataView.getInt32(index,endian);
                case "Uint64":
                    return ArrayBufferType.wrapBigInts(this.dataView.getBigUint64(index,endian));
                case "Int64":
                    return ArrayBufferType.wrapBigInts(this.dataView.getBigInt64(index,endian));
                case "Float16":
                    return this.dataView.getFloat16(index,endian);
                case "Float32":
                    return this.dataView.getFloat32(index,endian);
                case "Float64":
                    return this.dataView.getFloat64(index,endian);
                default:
                    throw new TypeError(`Unknown Type: ${type}`);
                    // new DataView(new ArrayBuffer(32)).getUint32(0)
            }

        }
        static wrapBigInts(bi) {
            // a method to let js BigInts not break everything ever either by converting it to a jwInt if the extension is added, or making it a string otherwise.
            if (typeof bi != "bigint") return bi;
            return vm.jwInt ? new vm.jwInt.Type(bi) : bi.toString()
        }

        static handleWrappedBigInts(bi) {
            if (vm.jwInt && bi instanceof vm.jwInt.Type) return bi.number;
            if (typeof bi === "bigint") return bi;
            return BigInt(bi);
        }
        set(type = "Uint8",index,value,endian = false) {
            let buffer = this;
            // console.log(type)
            // console.log(index)
            // console.log(endian)
            // console.log(value)
            switch (type) {
                case "Uint8":
                    buffer.dataView.setUint8(index,value);
                    return;
                case "Int8":
                    buffer.dataView.setInt8(index,value);
                    return;
                case "Uint16":
                    buffer.dataView.setUint16(index,value,endian);
                    return;
                case "Int16":
                    buffer.dataView.setInt16(index,value,endian);
                    return;
                case "Uint32":
                    buffer.dataView.setUint32(index,value,endian);
                    return;
                case "Int32":
                    buffer.dataView.setInt32(index,value,endian);
                    return;
                case "Uint64":
                    buffer.dataView.setBigUint64(index,ArrayBufferType.handleWrappedBigInts(value),endian);
                    return;
                case "Int64":
                    buffer.dataView.setBigInt64(index,ArrayBufferType.handleWrappedBigInts(value),endian);
                    return;
                case "Float16":
                    buffer.dataView.setFloat16(index,value,endian);
                    return;
                case "Float32":
                    buffer.dataView.setFloat32(index,value,endian);
                    return;
                case "Float64":
                    buffer.dataView.setFloat64(index,value,endian);
                    return;
                default:
                    throw new TypeError(`Unknown Type: ${type}`);
            }

        }
        writeSubBuffer(subbuffer,startindex) {
            if (subbuffer === undefined && !agBuffer.disableErrorHandling) return;
            subbuffer = new ArrayBufferType(subbuffer)
            let buffer = this
            let arr = new Uint8Array(subbuffer.arrayBuffer)
            arr.forEach((value, index) => {
                buffer.dataView.setUint8(index + startindex, value)
            })
        }
        toTypedArray(type) {
            let array = [];
            let buf = this.itemsOf(0,Math.floor(this.arrayBuffer.byteLength / sizes[type]) * sizes[type]).arrayBuffer
            switch (type) {
                case "Uint8":
                    array = new Uint8Array(buf); break;
                case "Int8":
                    array = new Int8Array(buf); break;
                case "Uint16":
                    array = new Uint16Array(buf); break;
                case "Int16":
                    array = new Int16Array(buf); break;
                case "Uint32":
                    array = new Uint32Array(buf); break;
                case "Int32":
                    array = new Int32Array(buf); break;
                case "Uint64":
                    array = new BigUint64Array(buf); break;
                case "Int64":
                    array = new BigInt64Array(buf); break;
                case "Float16":
                    array = new Float16Array(buf); break;
                case "Float32":
                    array = new Float32Array(buf); break;
                case "Float64":
                    array = new Float64Array(buf); break;
                default:
                    if (agBuffer.disableErrorHandling) {return new Uint8Array(0)} else {throw new TypeError(type + " is not a valid array type!");}

            }
            
            return array;
        }
        itemsOf(min, max) {
            return new agBuffer.Type(this.arrayBuffer.slice(min,max))
        }
        clone() {
            return new ArrayBufferType(this.arrayBuffer.slice())
        }
        resizeAsNew(size) {
            return new ArrayBufferType(this.arrayBuffer.slice().transfer(size))
        }
        resize(size) {
            this.arrayBuffer = this.arrayBuffer.transfer(size)
        }

        reverse() {
            this.arrayBuffer = new Uint8Array(this.arrayBuffer).reverse().buffer
        }
        reverseAsNew() {
            return new ArrayBufferType(new Uint8Array(this.arrayBuffer).reverse())
        }

        readString(index) {
            let arr = new Uint8Array(this.arrayBuffer).slice(index)
            let len = arr.findIndex(v => v === 0)
            if (len === -1) return ""; 
            else return new TextDecoder().decode(arr.slice(0,len));
        }

        writeString(index,string) {
            let stringBuffer = new TextEncoder().encode(string).buffer
            stringBuffer = stringBuffer.transfer(stringBuffer.byteLength + 1)
            let arr = new Uint8Array(stringBuffer)
            arr.forEach((value, idx) => {
                this.dataView.setUint8(idx + index, value)
            })

        }
    }
    class ArrayBufferPointerType {
        customId = "agBufferPointer"
        buffer;
        type;
        index;
        endian;
        constructor(buffer = new ArrayBufferType(16),index = 0,type = "Uint8",endian = false) {
            this.buffer = buffer
            this.index = index
            this.endian = endian
            this.type = type
            
        }

        static tryConvertToPointer(object) {
            if (object instanceof ArrayBufferPointerType) return object;
            if (object instanceof ArrayBufferType) return new ArrayBufferPointerType(object);
            return new ArrayBufferPointerType()
        }
        copy() {
            return new ArrayBufferPointerType(this.buffer,this.index,this.type,this.endian)
        }
        toArrayBuffer() {
            return this.buffer
        }
        jwArrayHandler() {
            return `BufferPTR:${this.type}@${"0x" + this.index.toString(16).padStart(8,"0")}`
        }
        dogeiscutObjectHandler() {
            return `${this.type} Buffer Pointer @ ${"0x" + this.index.toString(16).padStart(8,"0")})`

        }
        toString() {
            return this.getValue()
        }
        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none"
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'

            root.appendChild(span("Buffer Pointer"))
            root.appendChild(span(`Index: ${"0x" + this.index.toString(16).padStart(8,"0")}`))
            try {
                root.appendChild(span(`Value: ${this.type === "void" ? "N/A" : this.getValue()}`))
            } catch (e) {
                root.appendChild(span(`Value: ??`))
            }
            root.appendChild(span(`Type: ${["Uint8","Int8","void"].includes(this.type) ? "" : (this.endian ? "Little-Endian " : "Big-Endian ")}${this.type}`))
            return root
        }
        getValue() {
            try {
                return this.buffer.get(this.type,this.index % this.buffer.arrayBuffer.byteLength,this.endian)
            } catch {
                return 0
            }
        }
        setValue(value) {
            try {
                this.buffer.set(this.type, this.index % this.buffer.arrayBuffer.byteLength, value, this.endian)
            } catch {}
        }
    }
    const sizes = {
        Uint8:1,
        Int8:1,
        Uint16:2,
        Int16:2,
        Uint32:4,
        Int32:4,
        Uint64:8,
        Int64:8,
        Float16:2,
        Float32:4,
        Float64:8
    }

    const agBuffer = {
        Type: ArrayBufferType,
        PointerType: ArrayBufferPointerType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SQUARE,
            //blockShape: "agBuffer-arrayBuffer",
            forceOutputType: "ArrayBuffer",
            disableMonitor: true
        },
        PointerBlock: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.ARROW,
            forceOutputType: "ArrayBufferPointer",
            disableMonitor: true
        },
        Argument: {
            shape: BlockShape.SQUARE,
            //shape: "agBuffer-arrayBuffer",
            exemptFromNormalization: true,
            check: ["ArrayBuffer"]
        },
        PointerArgument: {
            shape: BlockShape.ARROW,
            exemptFromNormalization: true,
            check: ["ArrayBufferPointer"]
        },
        sizes: sizes,
        maxReporterRows: 10,
        disableErrorHandling: false,
    }
    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    class Extension {
        constructor() {
            vm.runtime.registerSerializer(
                "agBuffer",
                v => Array.from(new Uint8Array(v.arrayBuffer)), 
                v => new ArrayBufferType(new Uint8Array([...v]))
            );
            vm.runtime.registerSerializer(
                "agBufferPointer",
                v => v.type === "void" ? "Void pointers do not serialize" : v.getValue(), 
                v => v
            );

            vm.runtime.registerCompiledExtensionBlocks('agBuffer', this.getCompileInfo())
            if (!vm.runtime.ext_jwArray) vm.extensionManager.loadExtensionIdSync('jwArray')

                vm.divFromIter ??= new Map()
                vm.divFromIter.set("Array Buffer", function*(...env) {
                    return new ArrayBufferType(yield* this.fold([], 
                        function*(acc, item) {return [...acc, item]}, 
                        ...env
                    ));
                });
            
            
        }
        getInfo() {
            return {
                "id": "agBuffer",
                "name": "Array Buffers",
                "color1": "#0078e2",
                "menuIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCwwLDIwLDIwIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjkwLC0xNDApIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yOTEsMTUwYzAsLTQuOTcwNTYgNC4wMjk0NCwtOSA5LC05YzQuOTcwNTYsMCA5LDQuMDI5NDQgOSw5YzAsNC45NzA1NiAtNC4wMjk0NCw5IC05LDljLTQuOTcwNTYsMCAtOSwtNC4wMjk0NCAtOSwtOXoiIGZpbGw9IiMxZmFhZTAiIHN0cm9rZT0iIzE4OGFiOCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTI5OC4wNzMsMTQ2LjE0N2gtMS45MjZ2Ny43MDZoMS45MjZ2MS45MjdoLTEuOTI2Yy0xLjA2NCwwIC0xLjkyNywtMC44NjEgLTEuOTI3LC0xLjkyN3YtNy43MDZjMCwtMS4wNjQgMC44NjMsLTEuOTI3IDEuOTI3LC0xLjkyN2gxLjkyNnpNMzAxLjkyNywxNTUuNzhoMS45MjZjMS4wNjQsMCAxLjkyNywtMC44NjEgMS45MjcsLTEuOTI3di03LjcwNmMwLC0xLjA2NCAtMC44NjMsLTEuOTI3IC0xLjkyNywtMS45MjdoLTEuOTI2djEuOTI3aDEuOTI2djcuNzA2aC0xLjkyNnoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjk2LjkxNDYsMTQ5LjMwOTg1KSBzY2FsZSgwLjA1OTgyLDAuMDU5ODIpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZm9udC1mYW1pbHk9IkFyY2hpdm8iIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCI+PHRzcGFuIHg9IjAiIGR5PSIwIj4wMCBGRjwvdHNwYW4+PHRzcGFuIHg9IjAiIGR5PSI0Ni4xNXB4Ij41MSAyRTwvdHNwYW4+PC90ZXh0PjwvZz48L2c+PC9zdmc+",
                "blocks": [{
                    opcode: "newBuffer",
                    text: "create new array buffer of size [LENGTH]",
                    ...agBuffer.Block,
                    arguments: {
                        LENGTH: {
                            type: ArgumentType.NUMBER,
                            defaultValue: 32
                        }
                    }
                },
                {
                    opcode: "bufferOf",
                    text: "parse [VALUE] as array buffer",
                    ...agBuffer.Block,
                    arguments: {
                        VALUE: {type: ArgumentType.STRING}
                    }
                    
                },
                {
                    opcode: "fromUrl",
                    text: "get array buffer from url [URL]",
                    ...agBuffer.Block,
                    arguments: {
                        URL: {type: ArgumentType.STRING}
                    }
                },
                {
                    opcode: "fromBase64",
                    text: "array buffer from base64 [BASE64]",
                    ...agBuffer.Block,
                    arguments: {
                        BASE64: {type: ArgumentType.STRING, defaultValue: 'SGVsbG8sIFdvcmxkIQ=='}
                    }
                },
                {
                    opcode: "fromString",
                    text: "array buffer from string [STRING]",
                    ...agBuffer.Block,
                    arguments: {
                        STRING: {type: ArgumentType.STRING}
                    }
                },
                "---",
                {
                    opcode: 'builderCurrent',
                    text: 'current buffer',
                    hideFromPalette: true,
                    canDragDuplicate: true,
                    ...agBuffer.Block
                },
                {
                    opcode: 'builder',
                    text: 'array buffer builder [CURRENT]',
                    branches: [{}],
                    arguments: {
                        CURRENT: {
                            fillIn: 'builderCurrent'
                        }
                    },
                    ...agBuffer.Block
                },
                {
                    opcode: 'builderAppend',
                    text: 'append [TYPE] value [VALUE] [ENDIAN] to builder',
                    blockType: Scratch.BlockType.COMMAND,
                    arguments: {
                        TYPE:{
                            menu:'DATATYPES',
                            type: ArgumentType.STRING
                        },
                        VALUE: {
                            type: ArgumentType.NUMBER,
                            defaultValue: "0",
                            exemptFromNormalization: true
                        },
                        ENDIAN: {
                            type: ArgumentType.BOOLEAN
                        }
                    },
                },
                {
                    opcode: 'builderAppendBuffer',
                    text: 'append buffer [VALUE] to builder',
                    blockType: Scratch.BlockType.COMMAND,
                    arguments: {
                        VALUE: agBuffer.Argument
                    },
                },

                {
                    opcode: 'builderSet',
                    text: 'set builder to [BUFFER]',
                    blockType: Scratch.BlockType.COMMAND,
                    arguments: {
                        BUFFER: agBuffer.Argument
                    }
                },
                "---",
                {
                    opcode: "getValue",
                    text: "read [TYPE] value of [BUFFER] at [INDEX] [ENDIAN]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'DATATYPES'
                        },
                        VALUE: {type: ArgumentType.NUMBER},
                        BUFFER: agBuffer.Argument,
                        INDEX: {type: ArgumentType.NUMBER},
                        ENDIAN: {type: ArgumentType.BOOLEAN}
                    }
                },
                {
                    opcode: "setValue",
                    text: "write [TYPE] value [VALUE] to [BUFFER] at [INDEX] [ENDIAN]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'DATATYPES'
                        },
                        VALUE: {type: ArgumentType.NUMBER},
                        BUFFER: agBuffer.Argument,
                        INDEX: {type: ArgumentType.NUMBER},
                        ENDIAN: {type: ArgumentType.BOOLEAN}
                    }
                },
                "---",
                {
                    opcode: "writeSubBuffer",
                    text: "write sub-buffer [SUBBUFFER] to [BUFFER] at [INDEX]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        SUBBUFFER: agBuffer.Argument,
                        BUFFER: agBuffer.Argument,
                        INDEX: {type: ArgumentType.NUMBER}
                    }
                },
                /*
                    // commented out because hideFromPallete doesn't want to work for me
                {
                    opcode: "writeAutoType",
                    text: "write auto-detected value [VALUE] to [BUFFER] at [INDEX] [ENDIAN]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VALUE: {type: ArgumentType.STRING},
                        BUFFER: agBuffer.Argument,
                        INDEX: {type: ArgumentType.NUMBER},
                        ENDIAN: {type: ArgumentType.BOOLEAN}
                    }
                },
                */
                "---",
                {
                    opcode: "isBuffer",
                    text: "[VALUE] is array buffer?",
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        VALUE: {exemptFromNormalization: true}
                    }
                },
                {
                    opcode: "getSize",
                    text: "byte length of buffer [BUFFER]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        BUFFER: agBuffer.Argument
                    }
                },
                "---",
                {
                    opcode: "toArray",
                    text: "convert [BUFFER] to array",
                    blockType: "reporter",
                    arguments: {
                        BUFFER: agBuffer.Argument
                    },
                    ...vm.jwArray.Block,
                },
                {
                    opcode: "toTypedArray",
                    text: "convert [BUFFER] to [TYPE] typed array",
                    blockType: "reporter",
                    arguments: {
                        BUFFER: agBuffer.Argument,
                        TYPE: {type: ArgumentType.STRING, menu: 'DATATYPES'}
                    },
                    ...vm.jwArray.Block,
                },

                {
                    opcode: "bufferToString",
                    text: "array buffer [BUFFER] to string",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        BUFFER: agBuffer.Argument
                    }
                },
                {
                    opcode: "toBase64",
                    text: "array buffer [BUFFER] to base64",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        BUFFER: agBuffer.Argument
                    }
                },
                {
                    opcode: "toDataUrl",
                    text: "array buffer [BUFFER] to data:url",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        BUFFER: agBuffer.Argument
                    }
                },
                "---",
                {
                    opcode: "readNullTerminatedString",
                    text: "read string at [INDEX] of [BUFFER]",
                    blockType: BlockType.REPORTER,
                    
                    arguments: {
                        BUFFER: agBuffer.Argument,
                        INDEX: {type: ArgumentType.NUMBER}
                    }
                },
                {
                    opcode: "writeNullTerminatedString",
                    text: "write string [STRING] at [INDEX] of [BUFFER]",
                    blockType: BlockType.COMMAND,
                    
                    arguments: {
                        BUFFER: agBuffer.Argument,
                        INDEX: {type: ArgumentType.NUMBER},
                        STRING: {type: ArgumentType.STRING}
                    }
                },

                "---",
                {
                    opcode: "itemsOf",
                    text: "get bytes [MIN] to [MAX] from [BUFFER] as new buffer",
                    ...agBuffer.Block,
                    arguments: {
                        BUFFER: agBuffer.Argument,
                        MIN: {type: ArgumentType.NUMBER},
                        MAX: {type: ArgumentType.NUMBER}
                    }
                },
                "---",
                {
                    opcode: "resize",
                    text: "resize [BUFFER] to [SIZE] bytes as new",
                    ...agBuffer.Block,
                    arguments: {
                        BUFFER: agBuffer.Argument,
                        SIZE: {type: ArgumentType.NUMBER}
                    }
                },
                {
                    opcode: "resizeInst",
                    text: "resize [BUFFER] to [SIZE] bytes",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BUFFER: agBuffer.Argument,
                        SIZE: {type: ArgumentType.NUMBER}
                    }
                },

                {
                    opcode: "copy",
                    text: "copy [BUFFER]",
                    ...agBuffer.Block,
                    arguments: {
                        BUFFER: agBuffer.Argument
                    }
                },
                {
                    opcode: "reverse",
                    text: "reverse [BUFFER]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        BUFFER: agBuffer.Argument
                    }
                },
                {
                    opcode: "reverseR",
                    text: "reverse [BUFFER] as new",
                    ...agBuffer.Block,
                    arguments: {
                        BUFFER: agBuffer.Argument
                    }
                },
                {
                    opcode: "stringify",
                    text: "stringify [BUFFER] [MODE]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        BUFFER: agBuffer.Argument,
                        MODE:{type:ArgumentType.STRING,menu:'STRINGIFYMODE'}
                    }
                },
                {
                    opcode: 'forEachV',
                    text: 'byte',
                    blockType: Scratch.BlockType.REPORTER,
                    hideFromPalette: true,
                    allowDropAnywhere: true,
                    canDragDuplicate: true
                },
                {
                    opcode: 'forEachI',
                    text: 'index',
                    blockType: Scratch.BlockType.REPORTER,
                    hideFromPalette: true,
                    allowDropAnywhere: true,
                    canDragDuplicate: true
                },

                "---",
                {
                    opcode: 'forEach',
                    text: 'for each [INDEX], [BYTE] of [BUFFER]',
                    blockType: Scratch.BlockType.LOOP,
                    arguments: {
                        BUFFER: agBuffer.Argument,
                        INDEX: {
                            fillIn: 'forEachI'
                        },

                        BYTE: {
                            fillIn: 'forEachV'
                        }
                    }
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Datatype Utilities"
                },

                {
                    opcode: 'sizeOfType',
                    text: 'size of [TYPE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        TYPE: {
                            menu: 'DATATYPES',
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'cast',
                    text: 'cast [VALUE] to [TYPE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        VALUE: {type: ArgumentType.STRING},
                        TYPE: {
                            menu: 'DATATYPES',
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    blockType: BlockType.LABEL,
                    text: "Buffer Pointers"
                },
                {
                    opcode: 'createPointer',
                    text: 'create [TYPE] pointer for [BUFFER] at [INDEX] [ENDIAN]',
                    // blockType: BlockType.REPORTER,
                    ...agBuffer.PointerBlock,
                    arguments: {
                        INDEX: {type: ArgumentType.NUMBER},
                        ENDIAN: {type: ArgumentType.BOOLEAN},
                        BUFFER: agBuffer.Argument,
                        TYPE: {
                            menu: 'POINTER_TYPES',
                            type: ArgumentType.STRING
                        }
                    }
                },
                {
                    opcode: 'setPointer',
                    text: 'set value of pointer [PTR] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PTR: agBuffer.PointerArgument,
                        VALUE: {type: ArgumentType.NUMBER}

                    }
                },
                {
                    opcode: 'setPointerIndex',
                    text: 'set address of pointer [PTR] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PTR: agBuffer.PointerArgument,
                        VALUE: {type: ArgumentType.NUMBER}

                    }
                },
                {
                    opcode: 'setPointerEndian',
                    text: 'set endian of pointer [PTR] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PTR: agBuffer.PointerArgument,
                        VALUE: {type: ArgumentType.BOOLEAN}

                    }
                },
                {
                    opcode: 'setPointerType',
                    text: 'set type of pointer [PTR] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PTR: agBuffer.PointerArgument,
                        VALUE: {type: ArgumentType.STRING,menu:'POINTER_TYPES'}

                    }
                },
                {
                    opcode: 'setPointerBuffer',
                    text: 'set buffer of pointer [PTR] to [VALUE]',
                    blockType: BlockType.COMMAND,
                    arguments: {
                        PTR: agBuffer.PointerArgument,
                        VALUE: agBuffer.Argument

                    }
                },
                "---",
                {
                    opcode: 'getPointer',
                    text: 'get value of pointer [PTR]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        PTR: agBuffer.PointerArgument
                    }
                },
                {
                    opcode: 'getPointerIndex',
                    text: 'get address of pointer [PTR]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        PTR: agBuffer.PointerArgument
                    }
                },
                {
                    opcode: 'getPointerType',
                    text: 'get type of pointer [PTR]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        PTR: agBuffer.PointerArgument
                    }
                },
                {
                    opcode: 'getPointerEndian',
                    text: 'is pointer [PTR] little-endian?',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PTR: agBuffer.PointerArgument
                    }
                },
                {
                    opcode: 'getPointerBuffer',
                    text: 'get array buffer of pointer [PTR]',
                    ...agBuffer.Block,
                    arguments: {
                        PTR: agBuffer.PointerArgument
                    }
                },
                {
                    opcode: 'isPointer',
                    text: 'is pointer [PTR]?',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        PTR: {
                            exemptFromNormalization: true
                        }
                    }
                },
                {
                    opcode: 'copyPointer',
                    text: 'copy pointer [PTR]',
                    ...agBuffer.PointerBlock,
                    arguments: {
                        PTR: agBuffer.PointerArgument,
                        TYPE: {type: ArgumentType.STRING,menu:'POINTER_TYPES'},
                        ENDIAN: {type: ArgumentType.BOOLEAN}
                    }
                },
                {
                    opcode: 'pointerAsType',
                    text: '[PTR] as [TYPE] pointer [ENDIAN]',
                    ...agBuffer.PointerBlock,
                    arguments: {
                        PTR: agBuffer.PointerArgument,
                        TYPE: {type: ArgumentType.STRING,menu:'POINTER_TYPES'},
                        ENDIAN: {type: ArgumentType.BOOLEAN}
                    }
                },

                {
                    blockType: BlockType.LABEL,
                    text: "Visual Blocks"
                },
                {
                    opcode: "maxReporterLines",
                    text: "(only visual) set max lines shown in reporter output to [LINES]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        LINES: {type:ArgumentType.NUMBER}
                    }
                },
                // {
                //     blockType: BlockType.LABEL,
                //     text: "Danger Zone"
                // },
                {
                    opcode: "errorHandling",
                    text: "set disable error prevention to [VALUE]",
                    blockType: BlockType.COMMAND,
                    hideFromPalette: true,
                    arguments: {
                        VALUE: {type:ArgumentType.BOOLEAN}
                    },
                },
                ],
                "menus":{
                    DATATYPES: {
                        acceptReporters: true,
                        items: ["Uint8","Uint16","Uint32","Uint64","Int8","Int16","Int32","Int64","Float16","Float32","Float64"]
                    },
                    POINTER_TYPES: {
                        acceptReporters: true,
                        items: ["Uint8","Uint16","Uint32","Uint64","Int8","Int16","Int32","Int64","Float16","Float32","Float64","void"]
                    },

                    STRINGIFYMODE: {
                        acceptReporters: false,
                        items: ["array","bytes","binary"]
                    }
                }
            }
        }

        getCompileInfo() {
            return {
                ir: {
                    builder: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            substack: generator.descendSubstack(block, 'SUBSTACK')
                        }
                    },
                    newBuffer: (generator, block) => {
                        return {
                            kind: 'input',
                            size: generator.descendInputOfBlock(block, 'LENGTH')
                        }
                    },
                    createPointer: (generator, block) => {
                        return {
                            kind: 'input',
                            index: generator.descendInputOfBlock(block, 'INDEX'),
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            endian: generator.descendInputOfBlock(block, 'ENDIAN'),
                            datatype: generator.descendInputOfBlock(block, 'TYPE'),
                        }
                    },

                    bufferOf: (generator, block) => {
                        return {
                            kind: 'input',
                            value: generator.descendInputOfBlock(block, 'VALUE')
                        }
                    },
                    toDataUrl: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER')
                        }
                    },
                    getValue: (generator, block) => {
                        generator.script.yields = true
                        return {
                            
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            index: generator.descendInputOfBlock(block, 'INDEX'),
                            datatype: generator.descendInputOfBlock(block, 'TYPE'),
                            endian: generator.descendInputOfBlock(block, 'ENDIAN'),
                        }
                    },
                    setValue: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'stack',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            index: generator.descendInputOfBlock(block, 'INDEX'),
                            datatype: generator.descendInputOfBlock(block, 'TYPE'),
                            endian: generator.descendInputOfBlock(block, 'ENDIAN'),
                            value: generator.descendInputOfBlock(block, 'VALUE'),
                        }
                    },
                    writeSubBuffer: (generator, block) => {
                        return {
                            kind: 'stack',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            index: generator.descendInputOfBlock(block, 'INDEX'),
                            subbuffer: generator.descendInputOfBlock(block, 'SUBBUFFER')
                        }
                    },

                    toArray: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER')
                        }
                    },
                    builderCurrent: (generator, block) => {
                        return {
                            kind: 'input',
                            // buffer: generator.descendInputOfBlock(block, 'BUFFER')
                        }
                    },
                    builderAppend: (generator, block) => {
                        return {
                            kind: 'stack',
                            value: generator.descendInputOfBlock(block, 'VALUE'),
                            datatype: generator.descendInputOfBlock(block, 'TYPE'),
                            endian: generator.descendInputOfBlock(block, 'ENDIAN'),
                        }
                    },
                    builderSet: (generator, block) => {
                        return {
                            kind: 'stack',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                        }
                    },
                    builderAppendBuffer: (generator, block) => {
                        return {
                            kind: 'stack',
                            buffer: generator.descendInputOfBlock(block, 'VALUE')
                            
                        }
                    },
                    toTypedArray: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            datatype: generator.descendInputOfBlock(block, 'TYPE'),
                        }
                    },
                    sizeOfType: (generator, block) => {
                        return {
                            kind: 'input',
                            datatype: generator.descendInputOfBlock(block, 'TYPE'),
                        }
                    },
                    fromString: (generator, block) => {
                        return {
                            kind: 'input',
                            string: generator.descendInputOfBlock(block, 'STRING')
                        }
                    },
                    bufferToString: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER')
                        }
                    },
                    fromBase64: (generator, block) => {
                        return {
                            kind: 'input',
                            base64: generator.descendInputOfBlock(block, 'BASE64')
                        }
                    },
                    toBase64: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER')
                        }
                    },
                    copy: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER')
                        }
                    },
                    resize: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            size: generator.descendInputOfBlock(block, 'SIZE'),
                        }
                    },
                    resizeInst: (generator, block) => {
                        return {
                            kind: 'stack',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            size: generator.descendInputOfBlock(block, 'SIZE'),
                        }
                    },

                    getSize: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                        }
                    },

                    isBuffer: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                        }
                    },
                    reverse: (generator, block) => {
                        return {
                            kind: 'stack',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                        }
                    },
                    reverseR: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                        }
                    },
                    toDataUrl: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                        }
                    },
                    readNullTerminatedString: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            index: generator.descendInputOfBlock(block, 'INDEX'),
                        }
                    },
                    writeNullTerminatedString: (generator, block) => {
                        return {
                            kind: 'stack',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            index: generator.descendInputOfBlock(block, 'INDEX'),
                            string: generator.descendInputOfBlock(block, 'STRING'),
                        }
                    },
                    itemsOf: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            min: generator.descendInputOfBlock(block, 'MIN'),
                            max: generator.descendInputOfBlock(block, 'MAX'),
                        }
                    },
                    forEach: (generator, block) => {
                        return {
                            kind: 'stack',
                            buffer: generator.descendInputOfBlock(block, 'BUFFER'),
                            substack: generator.descendSubstack(block,'SUBSTACK'),
                            
                        }
                    },
                    forEachI: (generator, block) => {
                        return {
                            kind: 'input',
                        }
                    },
                    forEachV: (generator, block) => {
                        return {
                            kind: 'input',
                        }
                    },
                    isPointer: (generator, block) => {
                        return {
                            kind: 'input',
                            value: generator.descendInputOfBlock(block,'PTR')
                        }
                    },
                    getPointer: (generator, block) => {
                        return {
                            kind: 'input',
                            pointer: generator.descendInputOfBlock(block,'PTR')
                        }
                    },
                    getPointerIndex: (generator, block) => {
                        return {
                            kind: 'input',
                            pointer: generator.descendInputOfBlock(block,'PTR')
                        }
                    },
                    getPointerType: (generator, block) => {
                        return {
                            kind: 'input',
                            pointer: generator.descendInputOfBlock(block,'PTR')
                        }
                    },
                    getPointerEndian: (generator, block) => {
                        return {
                            kind: 'input',
                            pointer: generator.descendInputOfBlock(block,'PTR')
                        }
                    },
                    getPointerBuffer: (generator, block) => {
                        return {
                            kind: 'input',
                            pointer: generator.descendInputOfBlock(block,'PTR')
                        }
                    },
                    setPointer: (generator, block) => {
                        return {
                            kind: 'stack',
                            pointer: generator.descendInputOfBlock(block,'PTR'),
                            value: generator.descendInputOfBlock(block,'VALUE')
                        }
                    },
                    setPointerIndex: (generator, block) => {
                        return {
                            kind: 'stack',
                            pointer: generator.descendInputOfBlock(block,'PTR'),
                            value: generator.descendInputOfBlock(block,'VALUE')
                        }
                    },
                    setPointerType: (generator, block) => {
                        return {
                            kind: 'stack',
                            pointer: generator.descendInputOfBlock(block,'PTR'),
                            value: generator.descendInputOfBlock(block,'VALUE')
                        }
                    },
                    setPointerEndian: (generator, block) => {
                        return {
                            kind: 'stack',
                            pointer: generator.descendInputOfBlock(block,'PTR'),
                            value: generator.descendInputOfBlock(block,'VALUE')
                        }
                    },
                    setPointerBuffer: (generator, block) => {
                        return {
                            kind: 'stack',
                            pointer: generator.descendInputOfBlock(block,'PTR'),
                            value: generator.descendInputOfBlock(block,'VALUE')
                        }
                    },
                    pointerAsType: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            pointer: generator.descendInputOfBlock(block,'PTR'),
                            datatype: generator.descendInputOfBlock(block,'TYPE'),
                            endian: generator.descendInputOfBlock(block,'ENDIAN'),
                        }
                    },
                    copyPointer: (generator, block) => {
                        return {
                            kind: 'input',
                            pointer: generator.descendInputOfBlock(block,'PTR')
                        }
                    },
                    stringify: (generator, block) => {
                        return {
                            kind: 'input',
                            buffer: generator.descendInputOfBlock(block,'BUFFER'),
                            mode: block.fields.MODE.value
                        }
                    },


                    // cast: (generator, block) => {
                    //     generator.script.yields = true  
                    //     return {
                    //         kind: 'input',
                    //         datatype: generator.descendInputOfBlock(block, 'TYPE'),
                    //         value: generator.descendInputOfBlock(block, 'VALUE'),
                    //     }
                    // },



                },
                js: {
                    builder: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = 'vm.agBuffer.Type.cast(yield* (function*() {';
                        compiler.source += `thread._agBufferBuilderIndex ??= [];`
                        compiler.source += `thread._agBufferBuilderIndex.push(new vm.agBuffer.Type(0));`
                        //compiler.source += `try{} catch (err) {throw new Error("fancy error catch: " + err)};`
                        compiler.descendStack(node.substack, new imports.Frame(false, undefined, true));
                        compiler.source += `return thread._agBufferBuilderIndex.pop();`
                        compiler.source += '})())';
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    newBuffer: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `new vm.agBuffer.Type(${compiler.descendInput(node.size).asNumber()})`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    bufferOf: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `new vm.agBuffer.Type(${compiler.descendInput(node.value).asUnknown()})`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    toDataUrl: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `("data:application/octet-stream;base64," + new Uint8Array(vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer).toBase64())`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_STRING);
                    },
                    getValue: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        let datatype = compiler.descendInput(node.datatype).asString();
                        let buffer = compiler.descendInput(node.buffer).asUnknown();
                        let index = compiler.descendInput(node.index).asNumber();
                        let endian = compiler.descendInput(node.datatype).asBoolean();
                        compiler.source = 'yield* (function*(buffer, index, endian, datatype = null) {'
                        // compiler.source += `let buffer = ${buffer};`
                        // console.log(datatype)
                        let isConst = false
                        // console.log(datatype)
                        switch (datatype) {
                            case '"Uint8"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getUint8(index) : 0);`
                                break;
                            case '"Int8"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getInt8(index) : 0);`
                                break;
                            case '"Uint16"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getUint16(index, endian) : 0);`
                                break;
                            case '"Int16"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getInt16(index, endian) : 0);`
                                break;
                            case '"Uint32"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getUint32(index, endian) : 0);`
                                break;
                            case '"Int32"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getInt32(index, endian) : 0);`
                                break;
                            case '"Uint64"':
                                compiler.source += `return vm.agBuffer.Type.wrapBigInts(((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getBigUint64(index, endian) : 0n));`
                                break;
                            case '"Int64"':
                                compiler.source += `return vm.agBuffer.Type.wrapBigInts(((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getBigInt64(index, endian) : 0n));`
                                break;
                            case '"Float16"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getFloat16(index, endian) : 0.0);`
                                break;
                            case '"Float32"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getFloat32(index, endian) : 0.0);`
                                break;
                            case '"Float64"':
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.dataView.getFloat64(index, endian) : 0.0);`
                                break;
                            default:
                                compiler.source += `return ((buffer instanceof vm.agBuffer.Type) ? buffer.get(${datatype},index,endian) : 0);`
                                isConst = true
                                break;
                            
                        }
                        compiler.source += `})(${buffer}, ${index}, ${endian}, ${isConst ? datatype : "undefined"})`
                        // console.log(compiler.source)
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    setValue: (node, compiler, imports) => {
                        let bufName = compiler.localVariables.next()
                        let datatype = compiler.descendInput(node.datatype).asString();
                        let buffer = compiler.descendInput(node.buffer).asUnknown();
                        let index = compiler.descendInput(node.index).asNumber();
                        let endian = compiler.descendInput(node.datatype).asBoolean();
                        let value = compiler.descendInput(node.value).asUnknown();
                        // compiler.source += '(function(buffer, index, endian, datatype = null) {'
                        // compiler.source += `let buffer = ${buffer};`
                        // console.log(datatype)
                        let isConst = false
                        // console.log(datatype)
                        compiler.source += `let ${bufName} = ${buffer};`
                        switch (datatype) {
                            case '"Uint8"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setUint8(${index}, ${value});`
                                break;
                            case '"Int8"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setInt8(${index}, ${value});`
                                break;
                            case '"Uint16"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setUint16(${index}, ${value}, ${endian});`
                                break;
                            case '"Int16"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setInt16(${index}, ${value}, ${endian});`
                                break;
                            case '"Uint32"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setUint32(${index}, ${value}, ${endian});`
                                break;
                            case '"Int32"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setInt32(${index}, ${value}, ${endian});`
                                break;
                            case '"Uint64"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setBigUint64(${index}, vm.agBuffer.Type.handleWrappedBigInts(${value}), ${endian});`
                                break;
                            case '"Int64"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setBigInt64(${index}, vm.agBuffer.Type.handleWrappedBigInts(${value}), ${endian});`
                                break;
                            case '"Float16"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setFloat16(${index}, ${value}, ${endian});`
                                break;
                            case '"Float32"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setFloat32(${index}, ${value}, ${endian});`
                                break;
                            case '"Float64"':
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.dataView.setFloat64(${index}, ${value}, ${endian});`
                                break;
                            default:
                                compiler.source += `if (${bufName} instanceof vm.agBuffer.Type) ${bufName}.set(${datatype}, ${index}, ${value}, ${endian});`
                                isConst = true
                                break;
                            
                        }
                        
                        // compiler.source += `})(${buffer}, ${index}, ${value}, ${endian}, ${isConst ? datatype : "undefined"})`
                        // console.log(compiler.source)
                        // const stackSource = compiler.source;
                        // compiler.source = originalSource;
                    },
                    toArray: (node, compiler, imports) => {
                        let buffer = compiler.descendInput(node.buffer).asUnknown();
                        const originalSource = compiler.source;
                        compiler.source = `vm.jwArray.Type.toArray(Array.from(new Uint8Array(vm.agBuffer.Type.cast(${buffer}).arrayBuffer)))`;
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    builderCurrent: (node, compiler, imports) => {
                        // let buffer = compiler.descendInput(node.buffer).asUnknown();
                        
                        const originalSource = compiler.source;
                        compiler.source = `(() => {let bi = (thread._agBufferBuilderIndex ?? []);return bi[bi.length-1] ? new vm.agBuffer.Type(bi[bi.length-1]) : new vm.agBuffer.Type(0)})()`;
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    builderAppend: (node, compiler, imports) => {
                        
                        let datatype = compiler.descendInput(node.datatype).asString();
                        let value = compiler.descendInput(node.value).asUnknown();
                        let endian = compiler.descendInput(node.endian).asBoolean();
                        const bi = compiler.localVariables.next();
                        compiler.source += `let ${bi} = thread._agBufferBuilderIndex ?? [];`;
                        compiler.source += `if (${bi}[${bi}.length-1]) {`
                        
                        compiler.source += `let buffer = ${bi}[${bi}.length-1];`
                        compiler.source += `let oldBufferLen = buffer.arrayBuffer.byteLength;`
                        compiler.source += `let newBuffer;`
                        compiler.source += `${bi}[${bi}.length-1] = newBuffer = new vm.agBuffer.Type(buffer.arrayBuffer.transfer(oldBufferLen + (vm.agBuffer.sizes[${datatype}] ?? 0)));`
                        compiler.source += `newBuffer.set(${datatype}, oldBufferLen, ${value}, ${endian});`
                        compiler.source += `};`
                        
                    },
                    builderSet: (node, compiler, imports) => {
                        
                        
                        let buffer = compiler.descendInput(node.buffer).asUnknown();
                        
                        const bi = compiler.localVariables.next();
                        compiler.source += `let ${bi} = thread._agBufferBuilderIndex ?? [];`;
                        compiler.source += `if (${bi}[${bi}.length-1]) {`
                        compiler.source += `let newBuffer;`
                        compiler.source += `${bi}[${bi}.length-1] = newBuffer = new vm.agBuffer.Type(${buffer});`
                        compiler.source += `};`
                        
                    },
                    builderAppendBuffer: (node, compiler, imports) => {
                        
                        let buffer = compiler.descendInput(node.buffer).asUnknown();
                        const bi = compiler.localVariables.next();
                        compiler.source += `let ${bi} = thread._agBufferBuilderIndex ?? [];`;
                        compiler.source += `if (${bi}[${bi}.length-1]) {`
                        compiler.source += `let bufferInput = vm.agBuffer.Type.cast(${buffer});`
                        compiler.source += `let buffer = ${bi}[${bi}.length-1];`
                        compiler.source += `let oldBufferLen = buffer.arrayBuffer.byteLength;`
                        compiler.source += `let bufferInputLen = bufferInput.arrayBuffer.byteLength;`
                        compiler.source += `let newBuffer;`
                        compiler.source += `${bi}[${bi}.length-1] = newBuffer = new vm.agBuffer.Type(buffer.arrayBuffer.transfer(oldBufferLen + bufferInputLen));`
                        compiler.source += `newBuffer.writeSubBuffer(bufferInput, oldBufferLen);`
                        compiler.source += `};`
                        
                    },
                    toTypedArray: (node, compiler, imports) => {
                        let buffer = compiler.descendInput(node.buffer).asUnknown();
                        let type = compiler.descendInput(node.datatype).asString();
                        const originalSource = compiler.source;
                        
                        compiler.source = `vm.jwArray.Type.toArray(Array.from((vm.agBuffer.Type.cast(${buffer})).toTypedArray(${type})).map((value, index, array) => ((typeof value === "bigint") ? vm.agBuffer.Type.wrapBigInts(value) : value)))`;
                        
                        
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },

                    sizeOfType: (node, compiler, imports) => {
                        let src = "";
                        let isConst = false;
                        let datatype = compiler.descendInput(node.datatype).asString();
                        // console.log(datatype)
                        
                        switch (datatype) {
                            case '"Uint8"':
                            case '"Int8"' :
                                src = "1"
                                break;
                            case '"Uint16"':
                            case '"Int16"':
                            case '"Float16"':
                                src = "2"
                                break;
                            case '"Uint32"':
                            case '"Int32"':
                            case '"Float32"':
                                src = "4"
                                break;
                            case '"Uint64"':
                            case '"Int64"':
                            case '"Float64"':
                                src = "8"
                                break;
                            default:
                                src = `vm.agBuffer.sizes[${datatype}]`
                                isConst = true
                                break;
                            
                        }
                        return new imports.TypedInput(src, imports.TYPE_NUMBER);

                    },
                    fromString: (node, compiler, imports) => {
                        return new imports.TypedInput(`new vm.agBuffer.Type(new TextEncoder().encode(${compiler.descendInput(node.string).asString()}))`, imports.TYPE_UNKNOWN);
                    },
                    bufferToString: (node, compiler, imports) => {
                        return new imports.TypedInput(`new TextDecoder().decode(new Uint8Array(vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer))`, imports.TYPE_STRING);
                    },
                    fromBase64: (node, compiler, imports) => {
                        return new imports.TypedInput(`new vm.agBuffer.Type(Uint8Array.fromBase64(${compiler.descendInput(node.base64).asString()}))`, imports.TYPE_UNKNOWN);
                    },
                    toBase64: (node, compiler, imports) => {
                        return new imports.TypedInput(`new Uint8Array(new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer).toBase64()`, imports.TYPE_STRING);
                    },
                    
                    writeSubBuffer: (node, compiler, imports) => {
                        compiler.source += `new vm.agBuffer.Type(new Uint8Array(new vm.agBuffer.Type(${compiler.descendInput(node.subbuffer).asUnknown()}).arrayBuffer).forEach((value, index) => {new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).dataView.setUint8(index + ${compiler.descendInput(node.index).asNumber()}, value)}));`
                    },
                    copy: (node, compiler, imports) => {
                        return new imports.TypedInput(`new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).clone()`, imports.TYPE_UNKNOWN);
                    },
                    resize: (node, compiler, imports) => {
                        return new imports.TypedInput(`new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).resizeAsNew(${compiler.descendInput(node.size).asNumber()})`, imports.TYPE_UNKNOWN);
                    },
                    resizeInst: (node, compiler, imports) => {
                        compiler.source += `new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).resize(${compiler.descendInput(node.size).asNumber()})`;
                    },

                    getSize: (node, compiler, imports) => {
                        return new imports.TypedInput(`new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer.byteLength`, imports.TYPE_NUMBER);
                    },
                    isBuffer: (node, compiler, imports) => {
                        return new imports.TypedInput(`${compiler.descendInput(node.buffer).asUnknown()} instanceof vm.agBuffer.Type`, imports.TYPE_BOOLEAN);
                    },
                    reverseR: (node, compiler, imports) => {
                        return new imports.TypedInput(`new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).reverseAsNew()`, imports.TYPE_UNKNOWN);
                    },
                    reverse: (node, compiler, imports) => {
                        compiler.source += `new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).reverse()`;
                    },
                    toDataUrl: (node, compiler, imports) => {
                        return new imports.TypedInput(`("data:application/octet-stream;base64," + new Uint8Array(new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer).toBase64())`, imports.TYPE_STRING);
                    },
                    readNullTerminatedString: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).readString(${compiler.descendInput(node.index).asNumber()})`, imports.TYPE_STRING);
                    },
                    writeNullTerminatedString: (node, compiler, imports) => {
                        compiler.source += `vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).writeString(${compiler.descendInput(node.index).asNumber()},${compiler.descendInput(node.string).asString()})`;
                    },
                    itemsOf: (node, compiler, imports) => {
                        return new imports.TypedInput(`new vm.agBuffer.Type(vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer.slice(${compiler.descendInput(node.min).asNumber()},${compiler.descendInput(node.max).asNumber()}))`,imports.TYPE_STRING)
                    },
                    forEach: (node, compiler, imports) => {
                        const arr = compiler.localVariables.next()
                        compiler.source += `let ${arr} = new Uint8Array(vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer);`
                        compiler.source += `for (agBuffer_index in ${arr}) {agBuffer_index = Number(agBuffer_index);const agBuffer_byte = Number(${arr}[agBuffer_index]);`
                        compiler.descendStack(node.substack, new imports.Frame(true, undefined, true));
                        compiler.yieldLoop()
                        compiler.source += `}`

                    },

                    forEachI: (node, compiler, imports) => {
                        return new imports.TypedInput(`typeof agBuffer_index === "undefined" ? 0 : agBuffer_index`,imports.TYPE_NUMBER)
                    },
                    forEachV: (node, compiler, imports) => {
                        return new imports.TypedInput(`typeof agBuffer_byte === "undefined" ? 0 : agBuffer_byte`,imports.TYPE_NUMBER)
                    },
  
                    createPointer: (node, compiler, imports) => {
                        return new imports.TypedInput(`new vm.agBuffer.PointerType(new vm.agBuffer.Type(${compiler.descendInput(node.buffer).asUnknown()}),${compiler.descendInput(node.index).asNumber()},${compiler.descendInput(node.datatype).asString()},${compiler.descendInput(node.endian).asBoolean()})`, imports.TYPE_UNKNOWN);
                    },
                    getPointer: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).getValue()`, imports.TYPE_UNKNOWN);
                    },
                    getPointerIndex: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).index`, imports.TYPE_NUMBER);
                    },
                    getPointerType: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).type`, imports.TYPE_STRING);
                    },
                    getPointerEndian: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).endian`, imports.TYPE_BOOLEAN);
                    },
                    getPointerBuffer: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).buffer`, imports.TYPE_UNKNOWN);
                    },
                    setPointer: (node, compiler, imports) => {
                        compiler.source += `vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).setValue(${compiler.descendInput(node.value).asUnknown()});`
                    },
                    setPointerIndex: (node, compiler, imports) => {
                        compiler.source += `vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).index = ${compiler.descendInput(node.value).asUnknown()};`
                    },
                    setPointerType: (node, compiler, imports) => {
                        compiler.source += `vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).type = ${compiler.descendInput(node.value).asString()};`
                    },
                    setPointerEndian: (node, compiler, imports) => {
                        compiler.source += `vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).endian = ${compiler.descendInput(node.value).asBoolean()};`
                    },
                    setPointerBuffer: (node, compiler, imports) => {
                        compiler.source += `vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).buffer = vm.agBuffer.Type.cast(${compiler.descendInput(node.value).asUnknown()});`
                    },
                    pointerAsType: (node, compiler, imports) => {
                        return new imports.TypedInput(`yield* (function*(){let ptr = vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()});return new vm.agBuffer.PointerType(ptr.buffer,ptr.index,${compiler.descendInput(node.datatype).asString()},${compiler.descendInput(node.endian).asBoolean()})})()`, imports.TYPE_UNKNOWN);
                    },

                    isPointer: (node, compiler, imports) => {
                        return new imports.TypedInput(`${compiler.descendInput(node.value).asUnknown()} instanceof vm.agBuffer.PointerType`, imports.TYPE_BOOLEAN);
                    },
                    copyPointer: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agBuffer.PointerType.tryConvertToPointer(${compiler.descendInput(node.pointer).asUnknown()}).copy()`, imports.TYPE_UNKNOWN);
                    },

                    // cast: (node, compiler, imports) => {
                    //     return new imports.TypedInput(`yield* (function*(){let type = ${compiler.descendInput(node.datatype).asString()};let buf = new vm.agBuffer.Type(vm.agBuffer.sizes[type]);buf.set(type,0,${compiler.descendInput(node.datatype).asNumber()});return buf.get(type,0)})()`,imports.TYPE_UNKNOWN)
                    // },
                    stringify: (node, compiler, imports) => {
                        switch (node.mode) {
                            case "array":
                                return new imports.TypedInput(`vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).toString()`, imports.TYPE_STRING);
                            case "bytes":
                                return new imports.TypedInput(`Array.from(new Uint8Array(vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer)).map((value,index,array) => {return value.toString(16).padStart(2,"0")}).join(" ")`, imports.TYPE_STRING);
                            case "binary":
                                return new imports.TypedInput(`Array.from(new Uint8Array(vm.agBuffer.Type.cast(${compiler.descendInput(node.buffer).asUnknown()}).arrayBuffer)).map((value,index,array) => {return value.toString(2).padStart(8,"0")}).join(" ")`, imports.TYPE_STRING);
                            default:
                                throw new TypeError("how the heck did you trigger this message this should never be possible")
                        }
                        
                    },


                }
            };
        }

        newBuffer(args) {
            const length = args.LENGTH;
            if (typeof length != "number") return;
            return new ArrayBufferType(length)
        }
        bufferOf(args) {
            const value = args.VALUE;
            return new ArrayBufferType(value)
        }

        builderCurrent({}, util) {
            let bi = util.thread._agBufferBuilderIndex ?? []
            return bi[bi.length-1] ? new ArrayBufferType(bi[bi.length-1]) : new ArrayBufferType(0)
        }

        builder() {
            return 'noop'
        }

        builderAppend({TYPE,VALUE,ENDIAN = false}, util) {
            let bi = util.thread._agBufferBuilderIndex ?? []
            if (bi[bi.length-1]) {
                let buffer = bi[bi.length-1]
                let oldBufferLen = buffer.arrayBuffer.byteLength
                let newBuffer;
                bi[bi.length-1] = newBuffer = new ArrayBufferType(buffer.arrayBuffer.transfer(oldBufferLen + (sizes[TYPE] ?? 0)))
                this.setValue({TYPE: TYPE, INDEX: oldBufferLen, ENDIAN: ENDIAN, VALUE: VALUE, BUFFER: newBuffer})
            }
        }
        builderAppendBuffer({VALUE}, util) {
            if (!VALUE && !agBuffer.disableErrorHandling) return;
            VALUE = new ArrayBufferType(VALUE)
            let bi = util.thread._agBufferBuilderIndex ?? []
            if (bi[bi.length-1]) {
                let buffer = bi[bi.length-1]
                let oldBufferLen = buffer.arrayBuffer.byteLength
                let newBuffer;
                bi[bi.length-1] = newBuffer = new ArrayBufferType(buffer.arrayBuffer.transfer(oldBufferLen + VALUE.arrayBuffer.byteLength))
                this.writeSubBuffer({INDEX: oldBufferLen, SUBBUFFER: VALUE, BUFFER: newBuffer})
            }
        }

        builderSet({BUFFER}, util) {
            if (!BUFFER && !agBuffer.disableErrorHandling) return;
            BUFFER = new ArrayBufferType(BUFFER)
            let bi = util.thread._agBufferBuilderIndex ?? []
            if (bi[bi.length-1]) {
                bi[bi.length-1] = new ArrayBufferType(BUFFER.arrayBuffer.transfer())
            }
        }

        toArray({BUFFER}) {
            if (!BUFFER && !agBuffer.disableErrorHandling) return;
            BUFFER = new ArrayBufferType(BUFFER)
            
            
            return vm.jwArray.Type.toArray(Array.from(new Uint8Array(BUFFER.arrayBuffer)))
        }
        toTypedArray({BUFFER,TYPE}) {
            BUFFER = new ArrayBufferType(BUFFER)
            let array;
            let buf = BUFFER.arrayBuffer
            switch (TYPE) {
                case "Uint8":
                    array = new Uint8Array(buf); break;
                case "Int8":
                    array = new Int8Array(buf); break;
                case "Uint16":
                    array = new Uint16Array(buf); break;
                case "Int16":
                    array = new Int16Array(buf); break;
                case "Uint32":
                    array = new Uint32Array(buf); break;
                case "Int32":
                    array = new Int32Array(buf); break;
                case "Uint64":
                    array = new BigUint64Array(buf); break;
                case "Int64":
                    array = new BigInt64Array(buf); break;
                case "Float16":
                    array = new Float16Array(buf); break;
                case "Float32":
                    array = new Float32Array(buf); break;
                case "Float64":
                    array = new Float64Array(buf); break;
                default:
                    if (agBuffer.disableErrorHandling) {return vm.jwArray.Type.toArray([])} else {throw new TypeError(TYPE + " is not a valid array type!");}

            }
            return vm.jwArray.Type.toArray([...array]);

        }

        getValue(args) {
            if (!args.BUFFER && !agBuffer.disableErrorHandling) return 0;
            
            let buffer = new ArrayBufferType(args.BUFFER)
            
            const type = args.TYPE
            const index = args.INDEX
            const endian = args.ENDIAN
            switch (type) {
                case "Uint8":
                    return buffer.dataView.getUint8(index);
                case "Int8":
                    return buffer.dataView.getInt8(index);
                case "Uint16":
                    return buffer.dataView.getUint16(index,endian);
                case "Int16":
                    return buffer.dataView.getInt16(index,endian);
                case "Uint32":
                    return buffer.dataView.getUint32(index,endian);
                case "Int32":
                    return buffer.dataView.getInt32(index,endian);
                case "Uint64":
                    return buffer.dataView.getBigUint64(index,endian);
                case "Int64":
                    return buffer.dataView.getBigInt64(index,endian);
                case "Float16":
                    return buffer.dataView.getFloat16(index,endian);
                case "Float32":
                    return buffer.dataView.getFloat32(index,endian);
                case "Float64":
                    return buffer.dataView.getFloat64(index,endian);
                default:
                    throw new TypeError(`Unknown Type: ${type}`);
                    // new DataView(new ArrayBuffer(32)).getUint32(0)
            }
        }
        setValue(args) {
            if (!args.BUFFER && !agBuffer.disableErrorHandling) return;
            
            let buffer = new ArrayBufferType(args.BUFFER)
            const type = args.TYPE
            const index = args.INDEX
            const endian = args.ENDIAN
            const value = args.VALUE
            // console.log(type)
            // console.log(index)
            // console.log(endian)
            // console.log(value)
            switch (type) {
                case "Uint8":
                    buffer.dataView.setUint8(index,value);
                    return;
                case "Int8":
                    buffer.dataView.setInt8(index,value);
                    return;
                case "Uint16":
                    buffer.dataView.setUint16(index,value,endian);
                    return;
                case "Int16":
                    buffer.dataView.setInt16(index,value,endian);
                    return;
                case "Uint32":
                    buffer.dataView.setUint32(index,value,endian);
                    return;
                case "Int32":
                    buffer.dataView.setInt32(index,value,endian);
                    return;
                case "Uint64":
                    buffer.dataView.setBigUint64(index,BigInt(value),endian);
                    return;
                case "Int64":
                    buffer.dataView.setBigInt64(index,BigInt(value),endian);
                    return;
                case "Float16":
                    buffer.dataView.setFloat16(index,value,endian);
                    return;
                case "Float32":
                    buffer.dataView.setFloat32(index,value,endian);
                    return;
                case "Float64":
                    buffer.dataView.setFloat64(index,value,endian);
                    return;
                default:
                    throw new TypeError(`Unknown Type: ${type}`);
            }
            
        }
        isBuffer(args) {
            return this.bufferCheck(args.VALUE)
        }
        bufferCheck(value) {
            return value != undefined && value instanceof ArrayBufferType
        }
        getSize(args) {
            if (!args.BUFFER && !agBuffer.disableErrorHandling) return 0;
            args.BUFFER = new ArrayBufferType(args.BUFFER)
            if (!args.BUFFER.customId || args.BUFFER.customId != "agBuffer") return 0;
            return args.BUFFER.arrayBuffer.byteLength
        }
        fromString(args) {
            return new agBuffer.Type(new TextEncoder().encode(args.STRING))
        }
        bufferToString(args) {
            if (!args.BUFFER && !agBuffer.disableErrorHandling) return "";
            args.BUFFER = new ArrayBufferType(args.BUFFER)
            return new TextDecoder().decode(new Uint8Array(args.BUFFER.arrayBuffer))
        }
        fromBase64(args) {
            const base64 = args.BASE64
            return new agBuffer.Type(Uint8Array.fromBase64(base64));
        }
        toBase64(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return "";

            const buffer = new ArrayBufferType(args.BUFFER)
            return new Uint8Array(buffer.arrayBuffer).toBase64();
        }
        async fromUrl(args) {
            const url = args.URL;
            let fetchRes = await fetch(url)
            let buffer = await fetchRes.arrayBuffer()
            return new agBuffer.Type(buffer)
        }
        toDataUrl(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return "";
            const buffer = new ArrayBufferType(args.BUFFER)
            return ("data:application/octet-stream;base64," + new Uint8Array(buffer.arrayBuffer).toBase64())
        }
        maxReporterLines(args) {
            vm.agBuffer.maxReporterRows = Cast.toNumber(args.LINES)
        }
        itemsOf(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return new ArrayBufferType(0);
            args.BUFFER = new ArrayBufferType(args.BUFFER)
            return new agBuffer.Type(args.BUFFER.arrayBuffer.slice(args.MIN, args.MAX))
        }
        writeSubBuffer(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return;
            if (args.SUBBUFFER === undefined && !agBuffer.disableErrorHandling) return;
            args.BUFFER = new ArrayBufferType(args.BUFFER)
            args.SUBBUFFER = new ArrayBufferType(args.SUBBUFFER)
            let buffer = args.BUFFER
            let subbuffer = args.SUBBUFFER
            let startindex = args.INDEX
            let arr = new Uint8Array(subbuffer.arrayBuffer)
            arr.forEach((value, index) => {
                buffer.dataView.setUint8(index + startindex, value)
            })
        }
        writeAutoType(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return 0;
            let buffer = new ArrayBufferType(args.BUFFER)
            let value = args.VALUE
            let index = args.INDEX
            let endian = args.ENDIAN
            if (this.isBuffer({value: value})) {this.writeSubBuffer({BUFFER: buffer, SUBBUFFER: value, INDEX: index})}
            else if (!isNaN(value)) {buffer.dataView.setFloat64(index,value,endian)}
            else if (typeof(value.number) === "bigint") {buffer.dataView.setBigInt64(index,value.number,endian)}
            // else if (typeof(value.map) === "map") {buffer.dataView.setBigInt64(index,value.number,endian)}
        }
        resize(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return new ArrayBufferType(args.SIZE);
            let buffer = new ArrayBufferType(args.BUFFER)
            let newSize = Cast.toNumber(args.SIZE)
            return buffer.resizeAsNew(newSize)
        }
        resizeInst(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return;
            let buffer = new ArrayBufferType(args.BUFFER)
            let newSize = Cast.toNumber(args.SIZE)
            return buffer.resizeAsNew(newSize)
        }

        copy(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return new ArrayBufferType(0);
            args.BUFFER = new ArrayBufferType(args.BUFFER)
            return new ArrayBufferType(args.BUFFER.arrayBuffer.slice())
        }
        reverse(args) {
            let buffer = new ArrayBufferType(args.BUFFER)
            buffer.arrayBuffer = new Uint8Array(buffer.arrayBuffer).reverse().buffer
            buffer.dataView = new DataView(buffer.arrayBuffer)
        }
        reverseR(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return new ArrayBufferType(0);
            let buffer = new ArrayBufferType(args.BUFFER)
            return new ArrayBufferType(new Uint8Array(buffer.arrayBuffer.slice()).reverse())
        }
        stringify(args) {
            if (args.BUFFER === undefined && !agBuffer.disableErrorHandling) return "";
            let buffer = new ArrayBufferType(args.BUFFER)
            let mode = args.MODE
            switch (mode) {
                case "array":
                    return buffer.toString()
                case "bytes":
                    return Array.from(new Uint8Array(buffer.arrayBuffer)).map((value,index,array) => {return value.toString(16).padStart(2,"0")}).join(" ")
                case "binary":
                    return Array.from(new Uint8Array(buffer.arrayBuffer)).map((value,index,array) => {return value.toString(2).padStart(8,"0")}).join(" ")
                default:
                    throw new TypeError("how the heck did you trigger this message this should never be possible")
            }
        }
        errorHandling(args) {
            agBuffer.disableErrorHandling = Cast.toBoolean(args.VALUE)
        }
        forEachV({}, util) {
            const pair = util.thread.stackFrames[0].agBuffer;
            return pair ? pair[1] : "";
        }
        forEachI({}, util) {
            const pair = util.thread.stackFrames[0].agBuffer;
            return pair ? pair[0] : "";
        }

        forEach({BUFFER}, util) {
            if (!BUFFER && !agBuffer.disableErrorHandling) return;
            BUFFER = new ArrayBufferType(BUFFER)
            if (util.stackFrame.execute) {
                const { entries, pointer } = util.stackFrame;
                util.stackFrame.pointer++;
                if (util.stackFrame.pointer >= entries.length) return;
                util.thread.stackFrames[0].agBuffer = entries[util.stackFrame.pointer];
            } else {
                const entries = [...new Uint8Array(BUFFER.arrayBuffer)].map((value,index) => [index, value]);
                if (entries.length === 0) return;
                util.stackFrame.entries = entries;
                util.stackFrame.pointer = 0;
                util.stackFrame.execute = true;
                util.thread.stackFrames[0].agBuffer = entries[0];
            }

            util.startBranch(1, true);
        }
        sizeOfType({TYPE}) {
            return sizes[TYPE] ?? 0
        }
        cast({VALUE,TYPE}) {
            VALUE = Cast.toString(VALUE)
            let buffer = new ArrayBufferType(Cast.toNumber(sizes[TYPE]))
            this.setValue({INDEX:0,ENDIAN:false,VALUE:VALUE,TYPE:TYPE,BUFFER:buffer})
            return this.getValue({INDEX:0,ENDIAN:false,TYPE:TYPE,BUFFER:buffer})
        }
        writeNullTerminatedString({STRING,BUFFER,INDEX}) {
            if ((BUFFER === undefined || STRING === undefined) && !agBuffer.disableErrorHandling) return;
            BUFFER = new ArrayBufferType(BUFFER,true)
            let stringBuffer = new TextEncoder().encode(STRING).buffer
            stringBuffer = stringBuffer.transfer(stringBuffer.byteLength + 1)
            let arr = new Uint8Array(stringBuffer)
            arr.forEach((value, index) => {
                BUFFER.dataView.setUint8(index + INDEX, value)
            })
        }
        readNullTerminatedString({BUFFER,INDEX}) {
            if (!BUFFER) return;
            BUFFER = new ArrayBufferType(BUFFER,true)
            let arr = new Uint8Array(BUFFER.arrayBuffer).slice(INDEX)
            let len = arr.findIndex(v => v === 0)
            if (len === -1) return ""; 
            else return new TextDecoder().decode(arr.slice(0,len));
        }
        createPointer({INDEX,BUFFER,ENDIAN,TYPE}) {
            if (!BUFFER) return null;
            INDEX = Cast.toNumber(INDEX)
            ENDIAN = Cast.toBoolean(ENDIAN)
            return new ArrayBufferPointerType(BUFFER,INDEX,TYPE,ENDIAN)
        }
        getPointer({PTR}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return 0;
            return PTR.getValue()
        }
        getPointerIndex({PTR}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return 0;
            return PTR.index
        }
        getPointerType({PTR}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return "(invalid)";
            return PTR.type
        }
        getPointerBuffer({PTR}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return "(invalid)";
            return PTR.buffer
        }
        getPointerEndian({PTR}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return false;
            return PTR.endian
        }

        setPointer({PTR,VALUE}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return;
            PTR.setValue(VALUE)
        }
        setPointerIndex({PTR,VALUE}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return;
            PTR.index = Cast.toNumber(VALUE) % PTR.buffer.arrayBuffer.byteLength
        }
        setPointerType({PTR,VALUE}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return;
            PTR.type = VALUE
        }
        setPointerEndian({PTR,VALUE}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return;
            PTR.endian = Cast.toBoolean(VALUE)
        }
        setPointerBuffer({PTR,VALUE}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return;
            if (!VALUE || !(PTR instanceof ArrayBufferType)) return;
            PTR.buffer = new ArrayBufferType(VALUE,true)
        }

        copyPointer({PTR}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return new ArrayBufferPointerType(new ArrayBufferType(0),0,undefined,false);
            return PTR.copy()
        }

        isPointer({PTR}) {
            return (PTR instanceof ArrayBufferPointerType)
        }

        pointerAsType({PTR,TYPE,ENDIAN = false}) {
            if (!PTR || !(PTR instanceof ArrayBufferPointerType)) return null;
            ENDIAN = Cast.toBoolean(ENDIAN)
            TYPE = Cast.toString(TYPE)
            return new ArrayBufferPointerType(PTR.buffer,PTR.index,TYPE,ENDIAN)
        }

    }
        
    vm.agBuffer = agBuffer
    let extension = new Extension();
    Scratch.extensions.register(extension);
})(Scratch);
