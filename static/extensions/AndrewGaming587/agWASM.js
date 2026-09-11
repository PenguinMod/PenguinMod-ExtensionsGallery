// To whoever may be reading this, any and all errors the blocks in this extension
// may produce should be considered intentional, because let's be honest if you're using this
// extension you're probably advanced enough to know what the try-catch block does.
// This extension is intended purely for PenguinMod projects to interface with the WebAssembly API,
// not for projects to interface with the WebAssembly API while being heavily error-checked.
// Tryna get the ext to be as fast as possible while not being bad.

(async function(Scratch) {
    const {BlockType, BlockShape, ArgumentType, Cast, vm} = Scratch
    const variables = {};
    const AsyncFunction = async function () {}.constructor;
    vm.agBuffer ??= {}
    vm.jwArray ??= {}
    vm.dogeiscutObject ??= {}
    const isPort = Boolean(vm.runtime.pmVersion)
    function wrap(value) {
        if (typeof value === "number") return value;
        if (typeof value === "bigint") return vm.jwInt?.Type ? vm.jwInt.Type.toInt(value) : value.toString();
        if (typeof value === "function") return new FunctionReferenceType(value);
        if (value instanceof WebAssembly.Memory) return new WASMMemoryType(value);
        if (value instanceof WebAssembly.Table) return new WASMTableType(value);
        if (value instanceof WebAssembly.Global) return new WASMGlobalType(value);
        return value;
    }



    function convertValue(value) {
        if (value.toJSON) {
            return value.toJSON()
        } else if (vm.jwInt?.Type && value instanceof vm.jwInt.Type) {
            return value.number;
        } else {
            return value
        }
    }

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
    class WASMModuleType {
        module;
        modulePromise;
        jwArrayHandler() {
            return `WASM Module`
        }
        customId = "agWASMModule";

        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none" // Idk if this works i'm just trying stuff
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            root.appendChild(span("WebAssembly Module"))
            return root
        }
        toString() {
            return "<WASM Module>";
        } 
        constructor(source) {
            source ??= 0;
            const importObject = {
                my_namespace: { imported_func: (arg) => console.log(arg) },
            };
            if (((typeof source === "object" && "customId" in source && source.customId === "agWASMModule") || source instanceof WASMModuleType)) return source;
            if (source instanceof vm.agBuffer.Type) {
                this.modulePromise = WebAssembly.compile(source.arrayBuffer)
                this.modulePromise.then(result => {this.module = result;})
            }
            window.agWASMDebug = this;
        }
        *waitForFinish(promiseHandler) {
            if (this.module) return this
            let result = yield* promiseHandler(this.modulePromise)
            this.module = result
            return this
        }


    }

    class WASMInstanceType {
        module;
        instance;
        instancePromise;
        exports;
        done = false
        jwArrayHandler() {
            return `WASM Instance`
        }
        customId = "agWASMInst";

        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none" // Idk if this works i'm just trying stuff
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            root.appendChild(span("WebAssembly Instance"))
            return root
        }
        toString() {
            return "<WASM Instance>";
        } 
        constructor(source,imports = {}) {
            if (vm.dogeiscutObject.Type && imports instanceof vm.dogeiscutObject.Type) imports = imports.toJSON()
            source ??= 0;
            const importObject = {
                my_namespace: { imported_func: (arg) => console.log(arg) },
                ...imports
            };
            if (((typeof source === "object" && "customId" in source && source.customId === "agWASMInst") || source instanceof WASMInstanceType)) return source;
            if (source instanceof WASMModuleType) {
                this.module = source
                this.instancePromise = WebAssembly.instantiate(source.module,importObject)
                this.instancePromise.then(result => {this.instance = result;this.exports = result.exports;this.done = true})
                window.agWASMInstDebug = this;
            }
            
        }
        static cast(value) {
            if (value instanceof WASMInstanceType) return value;
            return new WASMInstanceType(value)
        }
        
        *waitForFinish(promiseHandler) {
            //console.log(this)
            //console.log(this.exports)
            if (this.instance?.exports) return this;
            else {
                
                // console.log("Instance is not done yet, running the promise handler")
                // console.log(this.instancePromise)
                let result = yield* promiseHandler(this.instancePromise)
                this.instance = result
                this.exports = result.exports
                this.done = true
                return this
            }
        }
        callExport(name,...args) {
            // console.log(this)
            if (!this.done) throw new ReferenceError("This WASM module instance has not finished instantiating yet!");
            if (!this.exports[name]) return null;
            return this.exports[name](...args)
        }
        getWrappedExport(name) {
            // console.log(this)
            if (!this.done) throw new ReferenceError("This WASM module instance has not finished instantiating yet!");
            if (!this.exports[name]) return null;
            const exp = this.exports[name];
            return wrap(exp)
        }
        getAllExportsWrapped() {
            const mappedObj = Object.fromEntries(
                Object.keys(this.exports).map((key) => [key, this.getWrappedExport(key)])
            );
            return vm.dogeiscutObject.Type.toObject(mappedObj);
        }
    }
    class WASMMemoryType {
        memory;
        jwArrayHandler() {
            return `WASM Memory`
        }
        customId = "agWASMMemory";
        getAGBuffer() {
            return new vm.agBuffer.Type(this.memory?.buffer ?? new ArrayBuffer(0))
        }
        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none" // Idk if this works i'm just trying stuff
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            root.appendChild(span("WebAssembly Memory:"))
            root.appendChild(this.getAGBuffer().toReporterContent())
            return root
        }
        toJSON() {
            return this.memory
        }
        static cast(value) {
            if (value instanceof WASMMemoryType) return value
            return new WASMMemoryType(value)
        }

        toString() {
            return "<WASM Memory>";
        } 
        constructor(source) {
            if (((typeof source === "object" && "customId" in source && source.customId === "agWASMMemory") || source instanceof WASMMemoryType)) return source;
            if (source instanceof WebAssembly.Memory) {
                this.memory = source
            }
            if (source instanceof WASMInstanceType) {
                this.memory = source.exports.memory // Might not exist
            }

            window.agWASMMemoryDebug = this;
        }
    }

    class WASMTableType {
        table;
        jwArrayHandler() {
            return `WASM Table<${this.table?.length ?? "null"}>`
        }
        customId = "agWASMTable";
        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none" // Idk if this works i'm just trying stuff
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            root.appendChild(span("WebAssembly Table"))
            root.appendChild(span(`Length: ${this.table.length}`))
            return root
        }
        toJSON() {
            return this.table
        }
        static cast(value) {
            if (value instanceof WASMTableType) return value
            return new WASMTableType(value)
        }

        toString() {
            return "<WASM Table>";
        } 
        constructor(source) {
            if (((typeof source === "object" && "customId" in source && source.customId === "agWASMTable") || source instanceof WASMTableType)) return source;
            if (source instanceof WebAssembly.Table) {
                this.table = source
            }

            window.agWASMTableDebug = this;
        }
        getWrapped(index) {
            return wrap(this.table.get(index))
        }
        set(index, value) {
            this.table.set(index, convertValue(value))
        }
    }
    class WASMGlobalType {
        global;
        jwArrayHandler() {
            return `WASM Global<${this.global?.valueOf() ?? "null"}>`
        }
        customId = "agWASMGlobal";
        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none" // Idk if this works i'm just trying stuff
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            root.appendChild(span(`WebAssembly Global = ${this.global.valueOf()}`))
            return root
        }
        toJSON() {
            return this.global
        }
        static cast(value) {
            if (value instanceof WASMGlobalType) return value
            return new WASMGlobalType(value)
        }

        toString() {
            return "<WASM Global>";
        } 
        constructor(source, mutable = true) {
            if (((typeof source === "object" && "customId" in source && source.customId === "agWASMGlobal") || source instanceof WASMGlobalType)) return source;
            if (source instanceof WebAssembly.Global) {
                this.global = source
            }
            if (typeof source === "number") {
                this.global = new WebAssembly.Global({value: "f64", mutable: mutable},source)
            }
            if (vm.jwInt?.Type && source instanceof vm.jwInt.Type) source = source.number;
            if (typeof source === "bigint") {
                this.global = new WebAssembly.Global({value: "i64", mutable: mutable},source)
            }

            window.agWASMGlobalDebug = this;
        }
        get(wrap = true) {
            if (wrap && typeof this.global.value === "bigint") {
                if (vm.jwInt?.Type) {
                    return vm.jwInt?.Type.toInt(this.global.value)
                } else {
                    return this.global.valueOf() // WebAssembly.Global.prototype.valueOf() returns string, no string conversion necessary
                }
            } 
            return this.global.value
        }
        set(value) {
            if (vm.jwInt?.Type && value instanceof vm.jwInt.Type) value = value.number;
            let type = typeof this.global.value;
            if (type === "bigint") {
                if (typeof value !== "bigint") this.global.value = BigInt(value);
            } else {
                if (typeof value !== "number") this.global.value = Number(value);
            }
        }
    }
    
    class WASMSuspendingType {
        funct;
        jwArrayHandler() {
            return `WASM Suspending Import`
        }
        customId = "agWASMSuspending";
        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none" // Idk if this works i'm just trying stuff
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            root.appendChild(span(`WebAssembly Suspending Import Function`))
            return root
        }
        toJSON() {
            return this.funct
        }
        static cast(value) {
            if (value instanceof WASMSuspendingType) return value
            return new WASMSuspendingType(value)
        }

        toString() {
            return "<WASM Suspending>";
        } 
        constructor(source, mutable = true) {
            if (((typeof source === "object" && "customId" in source && source.customId === "agWASMSuspending") || source instanceof WASMSuspendingType)) return source;
            if (source instanceof WebAssembly.Suspending) {
                this.funct = source
            }
            if (typeof source === "function") {
                this.funct = new WebAssembly.Suspending(source)
            }
            if (source instanceof FunctionReferenceType) {
                this.funct = new WebAssembly.Suspending(source.funct)
            }


            window.agWASMGlobalDebug = this;
        }
    }


    class FunctionReferenceType {
        funct;
        jwArrayHandler() {
            return `Function Reference<${this.table?.length ?? "null"}>`
        }
        customId = "agWASMFunctionRef";
        toReporterContent() {
            let root = document.createElement('div')
            root.style.maxWidth = "none" // Idk if this works i'm just trying stuff
            root.style.display = 'flex'
            root.style.flexDirection = 'column'
            root.style.justifyContent = 'center'
            root.appendChild(span("Function Reference:"))
            root.appendChild(span(this.funct.toString()))
            return root
        }
        toJSON() {
            return this.funct
        }
        static cast(value) {
            if (value instanceof FunctionReferenceType) return value
            return new FunctionReferenceType(value)
        }
        call(...args) {
            const output = this.funct(...args)
            if (typeof output !== "undefined") {
                if (typeof output?.then === "function") {
                    return output.then(value => {return wrap(value)})
                }
                return wrap(output)
            }
        }
        // toString(...args) {return this.funct.toString(...args)}
        constructor(source) {
            if (((typeof source === "object" && "customId" in source && source.customId === "agWASMFunctionRef") || source instanceof FunctionReferenceType)) return source;
            if (typeof source === "function") {
                this.funct = source
            }
            if (!this.funct) return null;
            window.agWASMFunctRefDebug = this;
        }
    }

    
    let util = {
        // code copied from PM's waitPromise function which for some reason might not exist
        waitPromise: function*(promise, globalState) { // I added globalState as an input because I know it won't exist otherwise
            const thread = globalState.thread;
            let returnValue;
            let errorReturn;
            promise
                .then(value => {
                    returnValue = value;
                    thread.status = 0; // STATUS_RUNNING
                })
                .catch(error => {
                    errorReturn = error;
                    // i realized, i dont actually know what would happen if we never do this but throw and exit anyways
                    thread.status = 0; // STATUS_RUNNING
                });
            
            // enter STATUS_PROMISE_WAIT and yield
            // this will stop script execution until the promise handlers reset the thread status
            thread.status = 1; // STATUS_PROMISE_WAIT
            yield;
            
            // throw the promise error if ee got one
            if (errorReturn) throw errorReturn
            return returnValue;
        },
        AsyncFunction: AsyncFunction,
    }
    
    const agWASM = {
        util: util,
        ModuleType: WASMModuleType,
        
        ModuleBlock: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SCRAPPED,
            //blockShape: "agBuffer-arrayBuffer",
            forceOutputType: "WASMModule",
            disableMonitor: true
        },
        ModuleArgument: {
            shape: BlockShape.SCRAPPED,
            //shape: "agBuffer-arrayBuffer",
            exemptFromNormalization: true,
            check: ["WASMModule"]
        },
        InstType: WASMInstanceType,
        getJSV2Function: (name, util) => {
            const jsv2 = vm?.runtime?.ext_SPjavascriptV2
            const func = vm?.runtime?.ext_SPjavascriptV2?.globalFuncs?.get(name) ?? null
            let wrapped;
            if (func?.isBlockCode) {
                wrapped = async (...args) => {
                    if (isPort) {
                        return await jsv2.runCode(`return await ${name}(...data)`,{data: args})
                    } else {
                        return await jsv2._compileCode(`return await ${name}(...data)`,args,util)
                    }

                    
                }

            } else {
                wrapped = Function("...args",`return (${func.code ?? "() => null"})(...args)`)
            }
            return new FunctionReferenceType(wrapped)
            
        },
            
        InstBlock: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SCRAPPED,
            //blockShape: "agBuffer-arrayBuffer",
            forceOutputType: "WASMInst",
            disableMonitor: true
        },

        InstArgument: {
            shape: BlockShape.SCRAPPED,
            //shape: "agBuffer-arrayBuffer",
            exemptFromNormalization: true,
            check: ["WASMInst"]
        },
        FuncRefBlock: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SCRAPPED,
            //blockShape: "agBuffer-arrayBuffer",
            forceOutputType: "WASMFunctionRef",
            disableMonitor: true
        },

        FuncRefArgument: {
            shape: BlockShape.SCRAPPED,
            //shape: "agBuffer-arrayBuffer",
            exemptFromNormalization: true,
            check: ["WASMFunctionRef"]
        },
        SuspendingBlock: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SCRAPPED,
            //blockShape: "agBuffer-arrayBuffer",
            forceOutputType: "WASMSuspending",
            disableMonitor: true
        },

        SuspendingArgument: {
            shape: BlockShape.SCRAPPED,
            //shape: "agBuffer-arrayBuffer",
            exemptFromNormalization: true,
            check: ["WASMSuspending"]
        },

        MemBlock: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SQUARE,
            //blockShape: "agBuffer-arrayBuffer",
            forceOutputType: "WASMMem",
            disableMonitor: true
        },
        MemArgument: {
            shape: BlockShape.SQUARE,
            //shape: "agBuffer-arrayBuffer",
            exemptFromNormalization: true,
            check: ["WASMMem"]
        },
        TableBlock: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SQUARE,
            //blockShape: "agBuffer-arrayBuffer",
            forceOutputType: "WASMTable",
            disableMonitor: true
        },
        TableArgument: {
            shape: BlockShape.SQUARE,
            //shape: "agBuffer-arrayBuffer",
            exemptFromNormalization: true,
            check: ["WASMTable"]
        },
        GlobalBlock: {
            blockType: BlockType.REPORTER,
            //blockShape: BlockShape.SQUARE,
            //blockShape: "agBuffer-arrayBuffer",
            forceOutputType: "WASMGlobal",
            disableMonitor: true
        },
        GlobalArgument: {
            //shape: BlockShape.SQUARE,
            //shape: "agBuffer-arrayBuffer",
            exemptFromNormalization: true,
            check: ["WASMGlobal"]
        },

        MemType: WASMMemoryType,
        FuncRefType: FunctionReferenceType,
        SuspendingType: WASMSuspendingType,
        TableType: WASMTableType,
        GlobalType: WASMGlobalType,
        convertValue: convertValue
    }

    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    class Extension {
        constructor() {
            vm.runtime.registerSerializer(
                "agWASMModule",
                v => null, 
                v => null
            );
            vm.runtime.registerSerializer(
                "agWASMInst",
                v => null, 
                v => null
            );
            vm.runtime.registerSerializer(
                "agWASMMemory",
                v => null, 
                v => null
            );
            vm.runtime.registerSerializer(
                "agWASMTable",
                v => null, 
                v => null
            );
            vm.runtime.registerSerializer(
                "agWASMGlobal",
                v => null, 
                v => null
            );
            vm.runtime.registerSerializer(
                "agWASMSuspending",
                v => null, 
                v => null
            );

            vm.runtime.registerSerializer(
                "agWASMFunctionRef",
                v => null, 
                v => null
            );

            if (!vm.runtime.ext_jwArray) vm.extensionManager.loadExtensionIdSync('jwArray')
            if (!vm.agBuffer.Type) vm.extensionManager.loadExtensionURL('https://extensions.penguinmod.com/extensions/AndrewGaming587/agBuffer.js')
            if (!vm.dogeiscutObject.Type) vm.extensionManager.loadExtensionURL('https://extensions.penguinmod.com/extensions/DogeisCut/dogeiscutObject.js')
            vm.runtime.registerCompiledExtensionBlocks('agWASM', this.getCompileInfo())
            if (vm.extensionManager?.extendCompiler) {
                vm.extensionManager.extendCompiler("agWASM", this.extendCompiler.bind(this));
            }
        }
        getInfo() {
            return {
                "id": "agWASM",
                "name": "WebAssembly",
                "color1": "#644fef",
                //"menuIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMCIgaGVpZ2h0PSIyMCIgdmlld0JveD0iMCwwLDIwLDIwIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjkwLC0xNDApIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yOTEsMTUwYzAsLTQuOTcwNTYgNC4wMjk0NCwtOSA5LC05YzQuOTcwNTYsMCA5LDQuMDI5NDQgOSw5YzAsNC45NzA1NiAtNC4wMjk0NCw5IC05LDljLTQuOTcwNTYsMCAtOSwtNC4wMjk0NCAtOSwtOXoiIGZpbGw9IiMxZmFhZTAiIHN0cm9rZT0iIzE4OGFiOCIgc3Ryb2tlLXdpZHRoPSIyIi8+PHBhdGggZD0iTTI5OC4wNzMsMTQ2LjE0N2gtMS45MjZ2Ny43MDZoMS45MjZ2MS45MjdoLTEuOTI2Yy0xLjA2NCwwIC0xLjkyNywtMC44NjEgLTEuOTI3LC0xLjkyN3YtNy43MDZjMCwtMS4wNjQgMC44NjMsLTEuOTI3IDEuOTI3LC0xLjkyN2gxLjkyNnpNMzAxLjkyNywxNTUuNzhoMS45MjZjMS4wNjQsMCAxLjkyNywtMC44NjEgMS45MjcsLTEuOTI3di03LjcwNmMwLC0xLjA2NCAtMC44NjMsLTEuOTI3IC0xLjkyNywtMS45MjdoLTEuOTI2djEuOTI3aDEuOTI2djcuNzA2aC0xLjkyNnoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHRleHQgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMjk2LjkxNDYsMTQ5LjMwOTg1KSBzY2FsZSgwLjA1OTgyLDAuMDU5ODIpIiBmb250LXNpemU9IjQwIiB4bWw6c3BhY2U9InByZXNlcnZlIiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgZm9udC1mYW1pbHk9IkFyY2hpdm8iIGZvbnQtd2VpZ2h0PSJub3JtYWwiIHRleHQtYW5jaG9yPSJzdGFydCI+PHRzcGFuIHg9IjAiIGR5PSIwIj4wMCBGRjwvdHNwYW4+PHRzcGFuIHg9IjAiIGR5PSI0Ni4xNXB4Ij41MSAyRTwvdHNwYW4+PC90ZXh0PjwvZz48L2c+PC9zdmc+",
                "blocks": [
                {
                    blockType: BlockType.LABEL,
                    text: "Javascript V2 extension recommended"
                },

                {
                    opcode: "newModule",
                    text: "create new module [SOURCE]",
                    ...agWASM.ModuleBlock,
                    arguments: {
                        SOURCE: vm.agBuffer?.Argument ?? {shape: BlockShape.SQUARE}
                    }
                },
                {
                    opcode: "instantiateModule",
                    text: "instantiate module [MODULE]",
                    ...agWASM.InstBlock,
                    arguments: {
                        MODULE: agWASM.ModuleArgument
                    }
                },
                {
                    opcode: "instantiateModuleImport",
                    text: "instantiate module [MODULE] with import object [IMPORTS]",
                    // was gonna hide this without jsv2 but decided to not
                    // hideFromPalette: !vm.runtime?.ext_SPjavascriptV2?.isEditorUnsandboxed,
                    ...agWASM.InstBlock,
                    arguments: {
                        MODULE: agWASM.ModuleArgument,
                        IMPORTS: vm.dogeiscutObject.Argument
                    }
                },
                "---",
                {
                    opcode: "exports",
                    text: "get all export names of [INSTANCE]",
                    ...vm.jwArray.Block,
                    arguments: {
                        INSTANCE: agWASM.InstArgument,
                    }
                },
                {
                    opcode: "exportsObj",
                    text: "get all exports of [INSTANCE]",
                    ...vm.dogeiscutObject?.Block ?? {blockType: BlockType.REPORTER, blockShape: BlockShape.PLUS},
                    arguments: {
                        INSTANCE: agWASM.InstArgument,
                    }
                },

                {
                    opcode: "instCall",
                    text: "call export [NAME] of [INSTANCE] with [ARGS]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        INSTANCE: agWASM.InstArgument,
                        NAME: {type: ArgumentType.STRING},
                        ARGS: vm.jwArray.Argument
                    }
                },
                {
                    opcode: "instCallR",
                    text: "call export [NAME] of [INSTANCE] with [ARGS]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        INSTANCE: agWASM.InstArgument,
                        NAME: {type: ArgumentType.STRING},
                        ARGS: vm.jwArray.Argument
                    }
                },
                {
                    opcode: "instCallExp",
                    text: "call export [NAME] of [INSTANCE] with [ARGS]",
                    blockType: BlockType.COMMAND,
                    // hideFromPalette: !isPort,
                    hideFromPalette: true,
                    arguments: {
                        INSTANCE: agWASM.InstArgument,
                        NAME: {type: ArgumentType.STRING},
                        ARGS: {
                            type: ArgumentType.EXPANDABLE,
                            minValue: 0,
                            defaultValue: 0,
                            text: '[ARG]',
                            arguments: {
                                ARG: {
                                    type: ArgumentType.STRING
                                }
                            }
                        }
                    }
                },


                {
                    opcode: "instCallRExp",
                    text: "call export [NAME] of [INSTANCE] with [ARGS]",
                    blockType: BlockType.REPORTER,
                    hideFromPalette: !isPort,
                    dualBlock: true,
                    arguments: {
                        INSTANCE: agWASM.InstArgument,
                        NAME: {type: ArgumentType.STRING},
                        ARGS: {
                            type: ArgumentType.EXPANDABLE,
                            minValue: 0,
                            defaultValue: 0,
                            text: '[ARG]',
                            arguments: {
                                ARG: {
                                    type: ArgumentType.STRING
                                }
                            }
                        }
                    }
                },

                {
                    opcode: "refCall",
                    text: "call function reference [FUNCTION] with [ARGS]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        FUNCTION: agWASM.FuncRefArgument,
                        
                        ARGS: vm.jwArray.Argument
                    }
                },


                {
                    opcode: "refCallR",
                    text: "call function reference [FUNCTION] with [ARGS]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        FUNCTION: agWASM.FuncRefArgument,
                        
                        ARGS: vm.jwArray.Argument
                    }
                },
                {
                    opcode: "refCallExp",
                    text: "call function reference [FUNCTION] with [ARGS]",
                    blockType: BlockType.COMMAND,
                    // hideFromPalette: !isPort,
                    hideFromPalette: true,
                    arguments: {
                        FUNCTION: agWASM.FuncRefArgument,
                        
                        ARGS: {
                            type: ArgumentType.EXPANDABLE,
                            minValue: 0,
                            defaultValue: 0,
                            text: '[ARG]',
                            arguments: {
                                ARG: {
                                    type: ArgumentType.STRING
                                }
                            }
                        }
                    }
                },


                {
                    opcode: "refCallRExp",
                    text: "call function reference [FUNCTION] with [ARGS]",
                    blockType: BlockType.REPORTER,
                    hideFromPalette: !isPort,
                    dualBlock: true,
                    arguments: {
                        FUNCTION: agWASM.FuncRefArgument,
                        
                        ARGS: {
                            type: ArgumentType.EXPANDABLE,
                            minValue: 0,
                            defaultValue: 0,
                            text: '[ARG]',
                            arguments: {
                                ARG: {
                                    type: ArgumentType.STRING
                                }
                            }
                        }
                    }
                },

                {
                    opcode: "getExport",
                    text: "get export [NAME] of [INSTANCE]",
                    blockType: BlockType.REPORTER,
                    blockShape: BlockShape.SCRAPPED,
                    disableMonitor: true,
                    allowDropAnywhere: true,
                    arguments: {
                        NAME: {type: ArgumentType.STRING},
                        INSTANCE: agWASM.InstArgument,
                    }
                },
                {
                    opcode: "newMemory",
                    text: "create new memory with initial pages [INITIAL]",
                    ...agWASM.MemBlock,
                    disableMonitor: true,
                    arguments: {
                        INITIAL: {type: ArgumentType.NUMBER},
                    }
                },
                {
                    opcode: "newMemoryObj",
                    text: "create new memory with settings [OBJECT]",
                    ...agWASM.MemBlock,
                    disableMonitor: true,
                    arguments: {
                        OBJECT: vm.dogeiscutObject.Argument,
                    }
                },
                {
                    opcode: "memoryGrow",
                    text: "grow memory [MEMORY] by [DELTA] pages",
                    blockType: BlockType.COMMAND,
                    disableMonitor: true,
                    arguments: {
                        MEMORY: agWASM.MemArgument,
                        DELTA: {type: ArgumentType.NUMBER},
                    }
                },

                {
                    opcode: "getMemoryBuffer",
                    text: "get attached array buffer of memory [MEMORY]",
                    blockType: BlockType.REPORTER,
                    ...vm.agBuffer.Block,
                    arguments: {
                        MEMORY: agWASM.MemArgument,
                    }
                },
                {
                    opcode: "tableNew",
                    text: "new [TYPE] wasm table with default size [SIZE]",
                    ...agWASM.TableBlock,
                    arguments: {
                        TYPE: {type: ArgumentType.STRING, menu: 'tableType'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 4},
                    }
                },
                {
                    opcode: "tableNewMax",
                    text: "new [TYPE] wasm table with default size [SIZE] and max size [MAX]",
                    ...agWASM.TableBlock,
                    arguments: {
                        TYPE: {type: ArgumentType.STRING, menu: 'tableType'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 4},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 10},
                    }
                },
                {
                    opcode: "tableNewDefault",
                    text: "new [TYPE] wasm table with default size [SIZE] and default value [DEFAULT]",
                    ...agWASM.TableBlock,
                    arguments: {
                        TYPE: {type: ArgumentType.STRING, menu: 'tableType'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 4},
                        DEFAULT: {type: ArgumentType.STRING},
                    }
                },
                {
                    opcode: "tableNewMaxDefault",
                    text: "new [TYPE] wasm table with default size [SIZE] max size [MAX] and default value [DEFAULT]",
                    ...agWASM.TableBlock,
                    arguments: {
                        TYPE: {type: ArgumentType.STRING, menu: 'tableType'},
                        SIZE: {type: ArgumentType.NUMBER, defaultValue: 4},
                        MAX: {type: ArgumentType.NUMBER, defaultValue: 10},
                        DEFAULT: {type: ArgumentType.STRING},
                    }
                },


                // {
                //     blockType: BlockType.LABEL,
                //     text: "Below block(s) require raw JS"
                // },
                // {
                //     blockType: BlockType.LABEL,
                //     text: "functions to work, so use the JS"
                // },
                // {
                //     blockType: BlockType.LABEL,
                //     text: "extension to make JS functions."
                // },
                {
                    opcode: "tableGet",
                    text: "get item [INDEX] from wasm table [TABLE]",
                    blockType: BlockType.REPORTER,
                    allowDropAnywhere: true,
                    arguments: {
                        TABLE: agWASM.TableArgument,
                        INDEX: {type: ArgumentType.NUMBER}
                    }
                },
                {
                    opcode: "tableSet",
                    text: "set item [INDEX] in wasm table [TABLE] to [VALUE]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        TABLE: agWASM.TableArgument,
                        INDEX: {type: ArgumentType.NUMBER},
                        VALUE: {}
                    }
                },
                {
                    opcode: "globalNewMutable",
                    text: "new mutable [TYPE] wasm global with value [VALUE]",
                    ...agWASM.GlobalBlock,
                    arguments: {
                        TYPE: {type: ArgumentType.STRING,menu:'globalType'},
                        VALUE: {type: ArgumentType.NUMBER}
                    }
                },
                {
                    opcode: "globalNewImmutable",
                    text: "new immutable [TYPE] wasm global with value [VALUE]",
                    ...agWASM.GlobalBlock,
                    arguments: {
                        TYPE: {type: ArgumentType.STRING,menu:'globalType'},
                        VALUE: {type: ArgumentType.NUMBER}
                    }
                },
                
                {
                    opcode: "globalGet",
                    text: "value of wasm global [GLOBAL]",
                    blockType: BlockType.REPORTER,
                    arguments: {
                        GLOBAL: agWASM.GlobalArgument 
                    }
                },
                {
                    opcode: "globalSet",
                    text: "set wasm global [GLOBAL] to [VALUE]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        GLOBAL: agWASM.GlobalArgument,
                        VALUE: {type: ArgumentType.NUMBER}
                    }
                },



                {
                    opcode: "consoleLog",
                    text: "console.log [VALUE]",
                    blockType: BlockType.COMMAND,
                    arguments: {
                        VALUE: {type: ArgumentType.STRING}
                    }
                },


                {
                    opcode: "jsV2Func",
                    text: "get JSV2 global function named [NAME]",
                    blockType: BlockType.REPORTER,
                    hideFromPalette: !(vm.runtime?.ext_SPjavascriptV2?.isEditorUnsandboxed),
                    allowDropAnywhere: true,
                    arguments: {
                        NAME:{type: ArgumentType.STRING},
                    }
                },
                {
                    blockType: BlockType.LABEL,
                    text: "JS Promise Integration"
                },
                {
                    opcode: "aboutJSPI",
                    text: "About JSPI",
                    blockType: BlockType.BUTTON,
                },
                {
                    opcode: "newSuspending",
                    text: "(JSPI) suspending (async) function [FUNCTION]",
                    ...agWASM.SuspendingBlock,
                    arguments: {
                        FUNCTION: agWASM.FuncRefArgument,
                    }
                },

                {
                    opcode: "newPromising",
                    text: "(JSPI) promising wasm (async) function [FUNCTION]",
                    ...agWASM.FuncRefBlock,
                    arguments: {
                        FUNCTION: agWASM.FuncRefArgument,
                    }
                },


                {
                    opcode: "awaitPort",
                    text: "wait for JS promise [PROMISE]",
                    blockType: BlockType.REPORTER,
                    hideFromPalette: !isPort,
                    allowDropAnywhere: true,
                    dualBlock: true,
                    arguments: {
                        PROMISE:{},
                    }
                },
                {
                    opcode: "awaitR",
                    text: "wait for JS promise [PROMISE]",
                    blockType: BlockType.REPORTER,
                    hideFromPalette: isPort,
                    allowDropAnywhere: true,
                    arguments: {
                        PROMISE:{},
                    }
                },
                {
                    opcode: "await",
                    text: "wait for JS promise [PROMISE]",
                    blockType: BlockType.COMMAND,
                    hideFromPalette: isPort,
                    arguments: {
                        PROMISE:{},
                    }
                },
   
                ],
                "menus":{
                    globalType: {
                        acceptReporters: false,
                        items: ["i32","i64","f32","f64"]
                    },
                    tableType: {
                        acceptReporters: false,
                        items: ["anyfunc","externref"]
                    }

                }
            }
        }

    extendCompiler({IntermediateStackBlock, IntermediateInput, InputType, InputOpcode}) {
        const opcodes = {
            
            INST_CALL: 'agWASM.instCall',
            REF_CALL: 'agWASM.refCall',
            AWAIT: 'agWASM.await'

        };

        return {
            ir: {
                reporter(block) {
                    switch (block.opcode) {
                        case 'agWASM_instCallRExp':
                            return new IntermediateInput(opcodes.INST_CALL, InputType.ANY, {
                                inst: this.descendInputOfBlock(block, 'INSTANCE'),
                                name: this.descendInputOfBlock(block, 'NAME'),
                                args: this.descendExpandableValue(block, 'ARGS', 'ARG')
                            }, true);
                        case 'agWASM_refCallRExp':
                            return new IntermediateInput(opcodes.REF_CALL, InputType.ANY, {
                                ref: this.descendInputOfBlock(block, 'FUNCTION'),
                                args: this.descendExpandableValue(block, 'ARGS', 'ARG')
                            }, true);
                        case 'agWASM_awaitPort':
                            return new IntermediateInput(opcodes.AWAIT, InputType.ANY, {
                                promise: this.descendInputOfBlock(block, 'PROMISE'),
                            }, true);

                    }
                },
                command(block) {
                    switch (block.opcode) {
                        case 'agWASM_instCallRExp':
                            return new IntermediateInput(opcodes.INST_CALL, InputType.ANY, {
                                inst: this.descendInputOfBlock(block, 'INSTANCE'),
                                name: this.descendInputOfBlock(block, 'NAME'),
                                args: this.descendExpandableValue(block, 'ARGS', 'ARG')
                            });
                        case 'agWASM_refCallRExp':
                            return new IntermediateInput(opcodes.REF_CALL, InputType.ANY, {
                                ref: this.descendInputOfBlock(block, 'FUNCTION'),
                                args: this.descendExpandableValue(block, 'ARGS', 'ARG')
                            });
                        case 'agWASM_awaitPort':
                            return new IntermediateInput(opcodes.AWAIT, InputType.ANY, {
                                promise: this.descendInputOfBlock(block, 'PROMISE'),
                            }, true);

                    }

                }
            },
            js: {
                reporter(block) {
                    const node = block.inputs;

                    switch (block.opcode) {
                        case opcodes.INST_CALL:
                            return `vm.agWASM.InstType.cast(${this.descendInput(node.inst)}).callExport(${this.descendInput(node.name)},${node.args.map(v => this.descendInput(v)).join(', ')})`
                            // return `(yield* vm.jwLambda.Type.toLambda(${this.descendInput(node.lambda)}).execute(${this.descendInput(node.arg)}, thread, target, runtime, stage))`;
                        case opcodes.REF_CALL:
                            return `vm.agWASM.FuncRefType.cast(${this.descendInput(node.ref)}).call(${node.args.map(v => this.descendInput(v)).join(', ')})`
                            // return `(yield* vm.jwLambda.Type.toLambda(${this.descendInput(node.lambda)}).execute(${this.descendInput(node.arg)}, thread, target, runtime, stage))`;
                        case opcodes.AWAIT:
                            return `(yield* ((typeof waitPromise !== "undefined" ? waitPromise : vm.agWASM.util.waitPromise)(${this.descendInput(node.promise)},globalState)))`
                    }
                },
                command(block) {
                    const node = block.inputs;

                    switch (block.opcode) {
                        case opcodes.INST_CALL:
                            this.source += `vm.agWASM.InstType.cast(${this.descendInput(node.inst)}).callExport(${this.descendInput(node.name)},${node.args.map(v => this.descendInput(v)).join(', ')});\n`
                            // return `(yield* vm.jwLambda.Type.toLambda(${this.descendInput(node.lambda)}).execute(${this.descendInput(node.arg)}, thread, target, runtime, stage))`;
                            return true;
                        case opcodes.REF_CALL:
                            this.source += `vm.agWASM.FuncRefType.cast(${this.descendInput(node.ref)}).call(${node.args.map(v => this.descendInput(v)).join(', ')});\n`
                            // return `(yield* vm.jwLambda.Type.toLambda(${this.descendInput(node.lambda)}).execute(${this.descendInput(node.arg)}, thread, target, runtime, stage))`;
                            return true;
                        case opcodes.AWAIT:
                            this.source += `yield* ((typeof waitPromise !== "undefined" ? waitPromise : vm.agWASM.util.waitPromise)(${this.descendInput(node.promise)},globalState));\n`
                            return true;

                    }
                }
            }
        }
    }
        getCompileInfo() {
            return {
                ir: {
                    newModule: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            source: generator.descendInputOfBlock(block, 'SOURCE')
                        }
                    },

                    instantiateModule: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            module: generator.descendInputOfBlock(block, 'MODULE')
                        }
                    },
                    instantiateModuleImport: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            module: generator.descendInputOfBlock(block, 'MODULE'),
                            imports: generator.descendInputOfBlock(block, 'IMPORTS')
                        }
                    },

                    instCall: (generator, block) => {
                        
                        return {
                            kind: 'stack',
                            inst: generator.descendInputOfBlock(block, 'INSTANCE'),
                            name: generator.descendInputOfBlock(block, 'NAME'),
                            args: generator.descendInputOfBlock(block, 'ARGS'),
                        }
                    },
                    await: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'stack',
                            promise: generator.descendInputOfBlock(block, 'PROMISE'),
                        }
                    },
                    awaitR: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            promise: generator.descendInputOfBlock(block, 'PROMISE'),
                        }
                    },
                    newSuspending: (generator, block) => {
                        return {
                            kind: 'input',
                            ref: generator.descendInputOfBlock(block, 'FUNCTION'),
                        }
                    },
                    newPromising: (generator, block) => {
                        return {
                            kind: 'input',
                            ref: generator.descendInputOfBlock(block, 'FUNCTION'),
                        }
                    },

                    refCallR: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            ref: generator.descendInputOfBlock(block, 'FUNCTION'),
                            args: generator.descendInputOfBlock(block, 'ARGS'),
                        }
                    },

                    refCall: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'stack',
                            ref: generator.descendInputOfBlock(block, 'FUNCTION'),
                            args: generator.descendInputOfBlock(block, 'ARGS'),
                        }
                    },

                    instCallR: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            inst: generator.descendInputOfBlock(block, 'INSTANCE'),
                            name: generator.descendInputOfBlock(block, 'NAME'),
                            args: generator.descendInputOfBlock(block, 'ARGS'),
                        }
                    },
                    instCallExp: (generator, block) => {
                        
                        return {
                            kind: 'stack',
                            inst: generator.descendInputOfBlock(block, 'INSTANCE'),
                            name: generator.descendInputOfBlock(block, 'NAME'),
                            args: generator.descendExpandableValue(block, 'ARGS', 'ARG'),
                        }
                    },

                    refCallRExp: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            ref: generator.descendInputOfBlock(block, 'FUNCTION'),
                            args: generator.descendExpandableValue(block, 'ARGS', 'ARG'),
                        }
                    },
                    refCallExp: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'stack',
                            ref: generator.descendInputOfBlock(block, 'FUNCTION'),
                            args: generator.descendExpandableValue(block, 'ARGS', 'ARG'),
                        }
                    },

                    instCallRExp: (generator, block) => {
                        generator.script.yields = true
                        return {
                            kind: 'input',
                            inst: generator.descendInputOfBlock(block, 'INSTANCE'),
                            name: generator.descendInputOfBlock(block, 'NAME'),
                            args: generator.descendExpandableValue(block, 'ARGS', 'ARG'),
                        }
                    },

                    exports: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            inst: generator.descendInputOfBlock(block, 'INSTANCE'),
                        }
                    },
                    exportsObj: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            inst: generator.descendInputOfBlock(block, 'INSTANCE'),
                        }
                    },

                    getExport: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            name: generator.descendInputOfBlock(block, 'NAME'),
                            inst: generator.descendInputOfBlock(block, 'INSTANCE')
                        }
                    },
                    newMemory: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            pages: generator.descendInputOfBlock(block, 'INITIAL'),
                        }
                    },
                    newMemoryObj: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            settings: generator.descendInputOfBlock(block, 'OBJECT'),
                        }
                    },
                    memoryGrow: (generator, block) => {
                        
                        return {
                            kind: 'stack',
                            memory: generator.descendInputOfBlock(block, 'MEMORY'),
                            delta: generator.descendInputOfBlock(block, 'DELTA'),
                        }
                    },


                    getMemoryBuffer: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            memory: generator.descendInputOfBlock(block, 'MEMORY')
                        }
                    },
                    tableNew: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            size: generator.descendInputOfBlock(block, 'SIZE'),
                            type: block.fields.TYPE.value,
                        }
                    },
                    tableNewMax: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            size: generator.descendInputOfBlock(block, 'SIZE'),
                            max: generator.descendInputOfBlock(block, 'MAX'),
                            type: block.fields.TYPE.value,
                            
                        }
                    },
                    tableNewDefault: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            size: generator.descendInputOfBlock(block, 'SIZE'),
                            default: generator.descendInputOfBlock(block, 'DEFAULT'),
                            type: block.fields.TYPE.value,
                        }
                    },
                    tableNewMaxDefault: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            size: generator.descendInputOfBlock(block, 'SIZE'),
                            max: generator.descendInputOfBlock(block, 'MAX'),
                            default: generator.descendInputOfBlock(block, 'DEFAULT'),
                            type: block.fields.TYPE.value,
                        }
                    },

                    tableGet: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            table: generator.descendInputOfBlock(block, 'TABLE'),
                            index: generator.descendInputOfBlock(block, 'INDEX'),
                        }
                    },
                    tableSet: (generator, block) => {
                        
                        return {
                            kind: 'stack',
                            table: generator.descendInputOfBlock(block, 'TABLE'),
                            index: generator.descendInputOfBlock(block, 'INDEX'),
                            value: generator.descendInputOfBlock(block, 'VALUE'),
                        }
                    },
                    globalNewMutable: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            type: block.fields.TYPE.value,
                            value: generator.descendInputOfBlock(block, 'VALUE'),

                        }
                    },
                    globalNewImmutable: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            type: block.fields.TYPE.value,
                            value: generator.descendInputOfBlock(block, 'VALUE'),
                        }
                    },
                    globalGet: (generator, block) => {
                        
                        return {
                            kind: 'input',
                            global: generator.descendInputOfBlock(block, 'GLOBAL'),
                            
                        }
                    },
                    globalSet: (generator, block) => {
                        
                        return {
                            kind: 'stack',
                            global: generator.descendInputOfBlock(block, 'GLOBAL'),
                            value: generator.descendInputOfBlock(block, 'VALUE'),
                        }
                    },

                    consoleLog: (generator, block) => {
                        return {
                            kind: 'stack',
                            val: generator.descendInputOfBlock(block, 'VALUE'),
                        }
                    },
                    jsV2Func: (generator, block) => {
                        return {
                            kind: 'input',
                            name: generator.descendInputOfBlock(block, 'NAME'),
                        }
                    },

                },
                js: {
                    newModule: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `yield* (new vm.agWASM.ModuleType(${compiler.descendInput(node.source).asUnknown()}).waitForFinish(typeof waitPromise !== "undefined" ? waitPromise : function*(promise) {return yield* vm.agWASM.util.waitPromise(promise,globalState)}))`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    instantiateModule: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `yield* (new vm.agWASM.InstType(${compiler.descendInput(node.module).asUnknown()}).waitForFinish(typeof waitPromise !== "undefined" ? waitPromise : function*(promise) {return yield* vm.agWASM.util.waitPromise(promise,globalState)}))`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    instantiateModuleImport: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `yield* (new vm.agWASM.InstType(${compiler.descendInput(node.module).asUnknown()},vm.dogeiscutObject.Type.toObject(${compiler.descendInput(node.imports).asUnknown()})).waitForFinish(typeof waitPromise !== "undefined" ? waitPromise : function*(promise) {return yield* vm.agWASM.util.waitPromise(promise,globalState)}))`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    refCall: (node, compiler, imports) => {
                        compiler.source += `vm.agWASM.FuncRefType.cast(${compiler.descendInput(node.ref).asUnknown()}).call(...vm.jwArray.Type.toArray(${compiler.descendInput(node.args).asUnknown()}).array);\n`
                    },
                    await: (node, compiler, imports) => {
                        compiler.source += `yield* ((typeof waitPromise !== "undefined" ? waitPromise : vm.agWASM.util.waitPromise)(${compiler.descendInput(node.promise).asUnknown()},globalState));\n`
                    },
                    awaitR: (node, compiler, imports) => {
                        return new imports.TypedInput(`(yield* ((typeof waitPromise !== "undefined" ? waitPromise : vm.agWASM.util.waitPromise)(${compiler.descendInput(node.promise).asUnknown()},globalState)))`, imports.TYPE_UNKNOWN)
                    },
                    newSuspending: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agWASM.SuspendingType.cast(vm.agWASM.FuncRefType.cast(${compiler.descendInput(node.ref).asUnknown()}))`, imports.TYPE_UNKNOWN)
                    },
                    newPromising: (node, compiler, imports) => {
                        return new imports.TypedInput(`vm.agWASM.FuncRefType.cast(WebAssembly.promising(vm.agWASM.FuncRefType.cast(${compiler.descendInput(node.ref).asUnknown()}).funct))`, imports.TYPE_UNKNOWN)
                    },


                    instCall: (node, compiler, imports) => {
                        compiler.source += `vm.agWASM.InstType.cast(${compiler.descendInput(node.inst).asUnknown()}).callExport(${compiler.descendInput(node.name).asString()},...vm.jwArray.Type.toArray(${compiler.descendInput(node.args).asUnknown()}).array);\n`
                    },
                    refCallR: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `vm.agWASM.FuncRefType.cast(${compiler.descendInput(node.ref).asUnknown()}).call(...vm.jwArray.Type.toArray(${compiler.descendInput(node.args).asUnknown()}).array)`
                        const stackSource = compiler.source;
                        
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },

                    instCallR: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `vm.agWASM.InstType.cast(${compiler.descendInput(node.inst).asUnknown()}).callExport(${compiler.descendInput(node.name).asString()},...vm.jwArray.Type.toArray(${compiler.descendInput(node.args).asUnknown()}).array)`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    refCallExp: (node, compiler, imports) => {
                        compiler.source += `vm.agWASM.FuncRefType.cast(${compiler.descendInput(node.ref).asUnknown()}).call(${node.args.map(v => compiler.descendInput(v).asUnknown()).join(', ')});\n`
                    },

                    instCallExp: (node, compiler, imports) => {
                        compiler.source += `vm.agWASM.InstType.cast(${compiler.descendInput(node.inst).asUnknown()}).callExport(${compiler.descendInput(node.name).asString()},${node.args.map(v => compiler.descendInput(v).asUnknown()).join(', ')});\n`
                    },
                    refCallRExp: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `vm.agWASM.FuncRefType.cast(${compiler.descendInput(node.ref).asUnknown()}).call(${node.args.map(v => compiler.descendInput(v).asUnknown()).join(', ')})`
                        const stackSource = compiler.source;
                        
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },

                    instCallRExp: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `vm.agWASM.InstType.cast(${compiler.descendInput(node.inst).asUnknown()}).callExport(${compiler.descendInput(node.name).asString()},${node.args.map(v => compiler.descendInput(v).asUnknown()).join(', ')})`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },

                    consoleLog: (node, compiler, imports) => {
                        compiler.source += `console.log(${compiler.descendInput(node.val).asUnknown()});\n`
                    },
                    jsV2Func: (node, compiler, imports) => {
                        
                        let source = `vm.agWASM.getJSV2Function(${compiler.descendInput(node.name).asString()},{thread: thread})`
                        
                        
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    exports: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `vm.jwArray.Type.toArray(Object.keys(vm.agWASM.InstType.cast(${compiler.descendInput(node.inst).asUnknown()}).exports))`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    exportsObj: (node, compiler, imports) => {
                        let stackSource = `vm.dogeiscutObject.Type.toObject(vm.agWASM.InstType.cast(${compiler.descendInput(node.inst).asUnknown()}).getAllExportsWrapped())`
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },

                    getExport: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `vm.agWASM.InstType.cast(${compiler.descendInput(node.inst).asUnknown()}).getWrappedExport(${compiler.descendInput(node.name).asString()})`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    newMemory: (node, compiler, imports) => {
                        
                        let source = `new vm.agWASM.MemType(new WebAssembly.Memory({initial: ${compiler.descendInput(node.pages).asNumber()}}))`
                        
                        
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    newMemoryObj: (node, compiler, imports) => {
                        
                        let source = `new vm.agWASM.MemType(new WebAssembly.Memory(vm.dogeiscutObject.Type.toObject(${compiler.descendInput(node.settings).asUnknown()}).toJSON()))`
                        
                        
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    memoryGrow: (node, compiler, imports) => {
                        compiler.source += `vm.agWASM.MemType.cast(${compiler.descendInput(node.memory).asUnknown()}).memory.grow(${compiler.descendInput(node.delta).asNumber()});\n`
                    },

                    getMemoryBuffer: (node, compiler, imports) => {
                        const originalSource = compiler.source;
                        compiler.source = `vm.agWASM.MemType.cast(${compiler.descendInput(node.memory).asUnknown()}).getAGBuffer()`
                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    },
                    tableNew: (node, compiler, imports) => {
                        let source = `new vm.agWASM.TableType(new WebAssembly.Table({element: "${node.type}", initial: ${compiler.descendInput(node.size).asNumber()}}))`
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    tableNewMax: (node, compiler, imports) => {
                        let source = `new vm.agWASM.TableType(new WebAssembly.Table({element: "${node.type}", initial: ${compiler.descendInput(node.size).asNumber()}, maximum: ${compiler.descendInput(node.max).asNumber()}}))`
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    tableNewDefault: (node, compiler, imports) => {
                        let source = `new vm.agWASM.TableType(new WebAssembly.Table({element: "${node.type}", initial: ${compiler.descendInput(node.size).asNumber()}}, vm.agWASM.convertValue(${compiler.descendInput(node.default).asUnknown()})))`
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    tableNewMaxDefault: (node, compiler, imports) => {
                        let source = `new vm.agWASM.TableType(new WebAssembly.Table({element: "${node.type}", initial: ${compiler.descendInput(node.size).asNumber()}, maximum: ${compiler.descendInput(node.max).asNumber()}}, vm.agWASM.convertValue(${compiler.descendInput(node.default).asUnknown()})))`
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    tableGet: (node, compiler, imports) => {
                        let source = `vm.agWASM.TableType.cast(${compiler.descendInput(node.table).asUnknown()}).getWrapped(${compiler.descendInput(node.index).asNumber()})`
                        
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    tableSet: (node, compiler, imports) => {
                        compiler.source += `vm.agWASM.TableType.cast(${compiler.descendInput(node.table).asUnknown()}).set(${compiler.descendInput(node.index).asNumber()},${compiler.descendInput(node.value).asUnknown()});\n`
                    },
                    globalNewMutable: (node, compiler, imports) => {
                        let defaultCode = node.type === "i64" ? `BigInt(vm.agWASM.convertValue(${compiler.descendInput(node.value).asUnknown()}))` : `vm.agWASM.convertValue(${compiler.descendInput(node.value).asUnknown()})`;
                        let source = `new vm.agWASM.GlobalType(new WebAssembly.Global({value: "${node.type}", mutable: true}, ${defaultCode}))`
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    globalNewImmutable: (node, compiler, imports) => {
                        let defaultCode = node.type === "i64" ? `BigInt(vm.agWASM.convertValue(${compiler.descendInput(node.value).asUnknown()}))` : `vm.agWASM.convertValue(${compiler.descendInput(node.value).asUnknown()})`;
                        let source = `new vm.agWASM.GlobalType(new WebAssembly.Global({value: "${node.type}", mutable: false}, ${defaultCode}))`
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    globalGet: (node, compiler, imports) => {
                        let source = `vm.agWASM.GlobalType.cast(${compiler.descendInput(node.global).asUnknown()}).get()`
                        
                        return new imports.TypedInput(source, imports.TYPE_UNKNOWN);
                    },
                    globalSet: (node, compiler, imports) => {
                        compiler.source += `vm.agWASM.GlobalType.cast(${compiler.descendInput(node.global).asUnknown()}).set(${compiler.descendInput(node.value).asUnknown()});\n`
                    },
                    



                }
            };
        }
        aboutJSPI() {
            alert("Some blocks require the WASM JavaScript Promise Integration, which as of right now, is only default on chromium-based browsers like Chrome, Edge, Brave, etc, and browsers such as Firefox and Safari require certain things to enable it.\nThese blocks, as such, have been labelled with '(JSPI)'.\n\nOn Firefox, the flag javascript.options.wasm_js_promise_integration needs to be enabled, and Safari needs to be a Technical Preview equivalent to \nSafari Technical Preview 238 or newer.")
        }
    }
    vm.agWASM = agWASM
    let extension = new Extension();
    Scratch.extensions.register(extension);
})(Scratch);