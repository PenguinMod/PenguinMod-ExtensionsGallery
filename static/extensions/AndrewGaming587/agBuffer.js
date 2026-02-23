(async function(Scratch) {
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
            if (passthrough && ((typeof source == "object" && "customId" in source && source.customId == "agBuffer") || source instanceof ArrayBufferType)) return source;
            if (source instanceof Array) {
                // window.agBufferDebugLastType = "jsarray"
                // Uint8Array conversion is necessary because ArrayBuffer constructor doesn't take normal arrays as input
                this.arrayBuffer = (new Uint8Array(source)).buffer 
            } else if (source instanceof vm.jwArray.Type) {
                // window.agBufferDebugLastType = "jwArray"
                // Same reason here
                this.arrayBuffer = new Uint8Array(source.array).buffer
            } else if (typeof source == "number") {
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
            } else if (typeof source == "string" && (() => {try{return Array.isArray(JSON.parse(source))}catch{return false}})()) { // weird inline code to see if we can JSON.parse the string as array
                // window.agBufferDebugLastType = "json"
                this.arrayBuffer = new Uint8Array(JSON.parse(source)).buffer
            } else if (typeof source.toArrayBuffer == "function") {
                // window.agBufferDebugLastType = "toArrayBuffer"
                this.arrayBuffer = source.toArrayBuffer()
            } else if (typeof source == "string") {
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
    }
    const agBuffer = {
        Type: ArrayBufferType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SQUARE,
            forceOutputType: "ArrayBuffer",
            disableMonitor: true
        },
        Argument: {
            shape: BlockShape.SQUARE,
            exemptFromNormalization: true,
            check: ["ArrayBuffer"]
        },
        maxReporterRows: 10,
        disableErrorHandling: false
    }
    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
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

    class Extension {
        constructor() {
            vm.runtime.registerSerializer(
                "agBuffer",
                v => Array.from(new Uint8Array(v.arrayBuffer)), 
                v => new ArrayBufferType(new Uint8Array([...v]))
            );
            vm.runtime.registerCompiledExtensionBlocks('agBuffer', this.getCompileInfo())
            if (!vm.runtime.ext_jwArray) vm.extensionManager.loadExtensionIdSync('jwArray')
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
                    opcode: "stringify",
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
                    text: "resize [BUFFER] to [SIZE] bytes",
                    ...agBuffer.Block,
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
                "---",
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
                {
                    blockType: BlockType.LABEL,
                    text: "Danger Zone"
                },
                {
                    opcode: "errorHandling",
                    text: "set disable error prevention to [VALUE]",
                    blockType: BlockType.COMMAND,
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
                },
                js: {
                    builder: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = 'new vm.agBuffer.Type(yield* (function*() {';
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
                    new DataView(new ArrayBuffer(32)).getUint32(0)
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
            return value && value instanceof ArrayBufferType
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
        stringify(args) {
            if (!args.BUFFER && !agBuffer.disableErrorHandling) return "";
            args.BUFFER = new ArrayBufferType(args.BUFFER)
            return new TextDecoder().decode(new Uint8Array(args.BUFFER.arrayBuffer))
        }
        fromBase64(args) {
            const base64 = args.BASE64
            return new agBuffer.Type(Uint8Array.fromBase64(base64));
        }
        toBase64(args) {
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return "";

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
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return "";
            const buffer = new ArrayBufferType(args.BUFFER)
            return ("data:application/octet-stream;base64," + new Uint8Array(buffer.arrayBuffer).toBase64())
        }
        maxReporterLines(args) {
            vm.agBuffer.maxReporterRows = Cast.toNumber(args.LINES)
        }
        itemsOf(args) {
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return new ArrayBufferType(0);
            args.BUFFER = new ArrayBufferType(args.BUFFER)
            return new agBuffer.Type(args.BUFFER.arrayBuffer.slice(args.MIN, args.MAX))
        }
        writeSubBuffer(args) {
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return;
            if (args.SUBBUFFER == undefined && !agBuffer.disableErrorHandling) return;
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
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return 0;
            let buffer = new ArrayBufferType(args.BUFFER)
            let value = args.VALUE
            let index = args.INDEX
            let endian = args.ENDIAN
            if (this.isBuffer({value: value})) {this.writeSubBuffer({BUFFER: buffer, SUBBUFFER: value, INDEX: index})}
            else if (!isNaN(value)) {buffer.dataView.setFloat64(index,value,endian)}
            else if (typeof(value.number) == "bigint") {buffer.dataView.setBigInt64(index,value.number,endian)}
            // else if (typeof(value.map) == "map") {buffer.dataView.setBigInt64(index,value.number,endian)}
        }
        resize(args) {
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return new ArrayBufferType(args.SIZE);
            let buffer = new ArrayBufferType(args.BUFFER)
            let newSize = Cast.toNumber(args.SIZE)
            return new agBuffer.Type(buffer.arrayBuffer.transfer(newSize))
        }
        copy(args) {
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return new ArrayBufferType(0);
            args.BUFFER = new ArrayBufferType(args.BUFFER)
            return new ArrayBufferType(args.BUFFER.arrayBuffer.transfer())
        }
        reverse(args) {
            let buffer = new ArrayBufferType(args.BUFFER)
            buffer.arrayBuffer = new Uint8Array(buffer.arrayBuffer).reverse().buffer
            buffer.dataView = new DataView(buffer.arrayBuffer)
        }
        reverseR(args) {
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return new ArrayBufferType(0);
            let buffer = new ArrayBufferType(args.BUFFER)
            return new ArrayBufferType(new Uint8Array(buffer.arrayBuffer).reverse())
        }
        stringify(args) {
            if (args.BUFFER == undefined && !agBuffer.disableErrorHandling) return "";
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
        
    }
        
    vm.agBuffer = agBuffer
    let extension = new Extension();
    Scratch.extensions.register(extension);
})(Scratch);
