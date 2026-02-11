(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Iterators\' must run unsandboxed!');
    }
    const {BlockType, BlockShape, ArgumentType, Cast, vm} = Scratch

    // Using jw's Array extension
    let jwArray = {
        Type: class {},
        Block: {},
        Argument: {}
    }

    // const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgd2lkdGg9IjIwcHgiIGhlaWdodD0iMjBweCIgeG1sbnM6Yng9Imh0dHBzOi8vYm94eS1zdmcuY29tIj4KICA8ZWxsaXBzZSBzdHlsZT0iZmlsbDogI2I1MmM1N2ZmOyBzdHJva2Utd2lkdGg6IDE7IiBjeD0iMTAiIGN5PSIxMCIgcng9IjEwIiByeT0iMTAiIHRyYW5zZm9ybT0ibWF0cml4KDAuOTk5OTk5OTk5OTk5OTk5OSwgMCwgMCwgMC45OTk5OTk5OTk5OTk5OTk5LCAtMy41NTI3MTM2Nzg4MDA1MDFlLTE1LCAtMS43NzYzNTY4Mzk0MDAyNTA1ZS0xNSkiLz4KICA8ZWxsaXBzZSBzdHlsZT0iZmlsbDogI2U0NDE1ZmZmOyBzdHJva2Utd2lkdGg6IDE7IiBjeD0iMTAiIGN5PSIxMCIgcng9IjkiIHJ5PSI5IiB0cmFuc2Zvcm09Im1hdHJpeCgwLjk5OTk5OTk5OTk5OTk5OTksIDAsIDAsIDAuOTk5OTk5OTk5OTk5OTk5OSwgLTMuNTUyNzEzNjc4ODAwNTAxZS0xNSwgLTEuNzc2MzU2ODM5NDAwMjUwNWUtMTUpIi8+CiAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4xMTI1OTMwMDI2MTczNTkxNiwgMCwgMCwgMC4xMTI1OTMwMDI2MTczNTkxNiwgLTE2Ljk0OTkyNDcyMTU2NzY5NywgLTYuMjEzMzk0MjU3NjI1ODUwNSkiIHN0eWxlPSIiPgogICAgPHJlY3QgeD0iMTc1Ljc5NSIgeT0iMTQwIiB3aWR0aD0iMTE0IiBoZWlnaHQ9IjgiIHN0eWxlPSJmaWxsOiAjZmZmOyIvPgogICAgPGVsbGlwc2Ugc3R5bGU9ImZpbGw6IHJnYigyMjgsIDY1LCA5NSk7IHN0cm9rZTogI2ZmZjsgc3Ryb2tlLXdpZHRoOiA4OyIgY3g9IjE5MCIgY3k9IjE0NCIgcng9IjE3LjA1NCIgcnk9IjE3LjA1NCIvPgogICAgPGVsbGlwc2Ugc3R5bGU9ImZpbGw6IHJnYigyMjgsIDY1LCA5NSk7IHN0cm9rZTogI2ZmZjsgc3Ryb2tlLXdpZHRoOiA4OyIgY3g9IjI4OC43MTQiIGN5PSIxNDQiIHJ4PSIxNy4wNTQiIHJ5PSIxNy4wNTQiLz4KICAgIDxwYXRoIGQ9Ik0gMjg0LjIwNSA3OS4zMyBRIDI4Ny4zODEgNzMuNzAyIDI5MC41NTYgNzkuMzMgTCAzMDUuMzc3IDEwNS41OTUgUSAzMDguNTUzIDExMS4yMjMgMzAyLjIwMSAxMTEuMjIzIEwgMjcyLjU2IDExMS4yMjMgUSAyNjYuMjA4IDExMS4yMjMgMjY5LjM4NCAxMDUuNTk1IFoiIGJ4OnNoYXBlPSJ0cmlhbmdsZSAyNjYuMjA4IDczLjcwMiA0Mi4zNDUgMzcuNTIxIDAuNSAwLjE1IDFAYTA3MDQ1MjYiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZTogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDg7IHN0cm9rZS1saW5lY2FwOiByb3VuZDsgdHJhbnNmb3JtLWJveDogZmlsbC1ib3g7IHRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7IiB0cmFuc2Zvcm09Im1hdHJpeCgwLCAxLCAtMSwgMCwgLTQ4LjQ2ODAwOSwgNTAuMTMwNTA2KSIvPgogIDwvZz4KPC9zdmc+";
    const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCIgd2lkdGg9IjIwcHgiIGhlaWdodD0iMjBweCIgeG1sbnM6Yng9Imh0dHBzOi8vYm94eS1zdmcuY29tIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQtMCIgYng6cGlubmVkPSJ0cnVlIj4KICAgICAgPHRpdGxlPkZpbGw8L3RpdGxlPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoMjU1LCA2OCwgMTE4KTsiPjwvc3RvcD4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDI1NSwgNTQsIDk4KTsiPjwvc3RvcD4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTAtMCIgaHJlZj0iI2dyYWRpZW50LTAiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTAiIHkxPSIxIiB4Mj0iMTAiIHkyPSIxOSI+PC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQtMSIgYng6cGlubmVkPSJ0cnVlIj4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDE4NiwgMzgsIDk2KTsiPjwvc3RvcD4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDE3MiwgNDEsIDc5KTsiPjwvc3RvcD4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTEtMCIgaHJlZj0iI2dyYWRpZW50LTEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iMTAiIHkxPSIwIiB4Mj0iMTAiIHkyPSIyMCI+PC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPGVsbGlwc2Ugc3R5bGU9InN0cm9rZS13aWR0aDogMTsgZmlsbDogdXJsKCNncmFkaWVudC0xLTApOyIgY3g9IjEwIiBjeT0iMTAiIHJ4PSIxMCIgcnk9IjEwIiB0cmFuc2Zvcm09Im1hdHJpeCgwLjk5OTk5OTk5OTk5OTk5OTksIDAsIDAsIDAuOTk5OTk5OTk5OTk5OTk5OSwgLTMuNTUyNzEzNjc4ODAwNTAxZS0xNSwgLTEuNzc2MzU2ODM5NDAwMjUwNWUtMTUpIj48L2VsbGlwc2U+CiAgPGVsbGlwc2Ugc3R5bGU9InN0cm9rZS13aWR0aDogMTsgZmlsbDogdXJsKCNncmFkaWVudC0wLTApOyIgY3g9IjEwIiBjeT0iMTAiIHJ4PSI5IiByeT0iOSIgdHJhbnNmb3JtPSJtYXRyaXgoMC45OTk5OTk5OTk5OTk5OTk5LCAwLCAwLCAwLjk5OTk5OTk5OTk5OTk5OTksIC0zLjU1MjcxMzY3ODgwMDUwMWUtMTUsIC0xLjc3NjM1NjgzOTQwMDI1MDVlLTE1KSI+PC9lbGxpcHNlPgogIDxyZWN0IHg9IjYuMjI4IiB5PSI5LjU1IiB3aWR0aD0iNy40ODMiIGhlaWdodD0iMC45MDEiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMC4xMTM7Ij48L3JlY3Q+CiAgPGVsbGlwc2Ugc3R5bGU9InN0cm9rZTogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDAuOTAxOyBmaWxsOiBub25lOyIgY3g9IjQuNDQzIiBjeT0iMTAiIHJ4PSIxLjkyIiByeT0iMS45MiI+PC9lbGxpcHNlPgogIDxlbGxpcHNlIHN0eWxlPSJzdHJva2U6IHJnYigyNTUsIDI1NSwgMjU1KTsgc3Ryb2tlLXdpZHRoOiAwLjkwMTsgZmlsbDogbm9uZTsiIGN4PSIxNS41NTciIGN5PSIxMCIgcng9IjEuOTIiIHJ5PSIxLjkyIj48L2VsbGlwc2U+CiAgPHBhdGggZD0iTSAzMS45OTkgOC45MzIgUSAzMi4zNTcgOC4yOTggMzIuNzE1IDguOTMyIEwgMzQuMzgzIDExLjg4OSBRIDM0Ljc0MSAxMi41MjMgMzQuMDI2IDEyLjUyMyBMIDMwLjY4OCAxMi41MjMgUSAyOS45NzMgMTIuNTIzIDMwLjMzMSAxMS44ODkgWiIgYng6c2hhcGU9InRyaWFuZ2xlIDI5Ljk3MyA4LjI5OCA0Ljc2OCA0LjIyNSAwLjUgMC4xNSAxQDY4NjMxOGZkIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2U6IHJnYigyNTUsIDI1NSwgMjU1KTsgc3Ryb2tlLXdpZHRoOiAwLjkwMTsgc3Ryb2tlLWxpbmVjYXA6IHJvdW5kOyB0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsiIHRyYW5zZm9ybT0ibWF0cml4KDAsIDEsIC0xLCAwLCAtMjIuNDA3MDA1LCAtMC41NjkwMzUpIj48L3BhdGg+Cjwvc3ZnPg=="
    const arrowURI = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxNS44OTMiIGhlaWdodD0iMTUuODkzIiB2aWV3Qm94PSIwIDAgMTUuODkzIDE1Ljg5MyI+PHBhdGggZD0iTTkuMDIxIDEyLjI5NHYtMi4xMDdsLTYuODM5LS45MDVDMS4zOTggOS4xODQuODQ2IDguNDg2Ljk2MiA3LjcyN2MuMDktLjYxMi42MDMtMS4wOSAxLjIyLTEuMTY0bDYuODM5LS45MDVWMy42YzAtLjU4Ni43MzItLjg2OSAxLjE1Ni0uNDY0bDQuNTc2IDQuMzQ1YS42NDMuNjQzIDAgMCAxIDAgLjkxOGwtNC41NzYgNC4zNmMtLjQyNC40MDQtMS4xNTYuMTEtMS4xNTYtLjQ2NSIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9Ii4xNSIgc3Ryb2tlPSIjMDAwIiBzdHJva2Utd2lkdGg9IjEuNzUiLz48cGF0aCBkPSJNOS4wMjEgMTIuMjk0di0yLjEwN2wtNi44MzktLjkwNUMxLjM5OCA5LjE4NC44NDYgOC40ODYuOTYyIDcuNzI3Yy4wOS0uNjEyLjYwMy0xLjA5IDEuMjItMS4xNjRsNi44MzktLjkwNVYzLjZjMC0uNTg2LjczMi0uODY5IDEuMTU2LS40NjRsNC41NzYgNC4zNDVhLjY0My42NDMgMCAwIDEgMCAuOTE4bC00LjU3NiA0LjM2Yy0uNDI0LjQwNC0xLjE1Ni4xMS0xLjE1Ni0uNDY1IiBmaWxsPSIjZmZmIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiLz48cGF0aCBkPSJNMCAxNS44OTJWMGgxNS44OTJ2MTUuODkyeiIgZmlsbD0ibm9uZSIvPjwvc3ZnPg==";

    function span(text) {
        let el = document.createElement('span')
        el.innerText = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    class IteratorType {
        customId = "divIterator"
        consumed = 0
        done = false;

        constructor(kind = "Empty", state = {}, next = function*() {return {value: undefined, done: true}}, clonable = true) {
            this.kind = [].concat(kind);
            this.state = state;
            this.iterNext = next;
            this.clonable = clonable;
        }

        jwArrayHandler() {
            return `Iterator<${this.consumed}>`
        }
        toString() {
            return `${this.getIterKind()} Iterator`
        }
        toReporterContent() {
            const root = document.createElement('div');
            root.style.display = 'flex';
            root.style.flexDirection = 'column';
            const s = span(`${this.getIterChain()} Iterator`); s.style.fontStyle = "italic";
            root.appendChild(s);
            if(this.consumed > 0 || this.done) {
                let text = ''
                if(this.consumed > 0) text += `consumed: ${this.consumed}` + (this.done ? " " : "")
                if(this.done) text += "(done)"
                root.appendChild(span(text));
            }
            return root;
        }
        toMonitorContent() {
            const root = document.createElement('div');
            root.style.display = 'flex';
            root.style.flexDirection = 'column';
            const s = span(`${this.getIterKind()} Iterator`); s.style.fontStyle = "italic";
            root.appendChild(s);
            if(this.consumed > 0 || this.done) {
                let text = ''
                if(this.consumed > 0) text += `consumed: ${this.consumed}` + (this.done ? " " : "")
                if(this.done) text += "(done)"
                root.appendChild(span(text));
            }
            return root;
        }

        getIterChain() {
            return this.kind
            .map(k => typeof k === "string" ? k
                : k.kind && k.args ? `${k.kind}(${
                    k.args.map(i => i instanceof IteratorType ? i.getIterChain() : i.toString()).join(",")
                })`
                : ""
            ).join("↦")
        }
        getIterKind() {
            const kind = this.kind[this.kind.length-1]
            return typeof kind === "string" ? kind : kind.kind ?? ''
        }

        static toIterator(x) {
            if(x instanceof IteratorType) return x;
            return new IteratorType();
        }

        chainIter(kind, state, next, clonable) {return new IteratorType(this.kind.concat(kind), state, next, clonable)}

        *next(thread, target, runtime, stage) {
            if(this.done) return divIterator.Done()
            const next = yield* this.iterNext.apply(this, [this.state, thread, target, runtime, stage]);
            if(next.done) this.done = true;
            else this.consumed++;
            return next
        }

        clone() {
            if(!this.clonable) {
                console.error(`Iterator chain '${this.getIterChain}' is not clonable. Use 'branch' instead, or check before cloning.`)
                throw `Iterator chain '${this.getIterChain}' is not clonable.`
            }
            const state = Object.fromEntries(Object.entries(this.state).map(([key, val]) => [key, 
                val instanceof IteratorType ? val.clone() : val
            ]))
            const clone = new IteratorType(this.kind, state, this.iterNext);
            clone.consumed = this.consumed;
            return clone
        }

        branch(n) {
            const buffers = Array(n).fill().map(() => []);
            let done = false;
            return buffers.map(buffer => this.chainIter({kind: "Branch", args: [n]},
                {iter: this}, function*(state, thread, target, runtime, stage) {
                    console.log(buffer);
                    if(buffer.length > 0) return divIterator.Item(buffer.shift());
                    if(done) return divIterator.Done();
                    const item = yield* state.iter.next(thread, target, runtime, stage);
                    done = item.done; if(item.done) return divIterator.Done() 
                    buffers.forEach(b => b.push(item.value));
                    return divIterator.Item(buffer.shift());
                }
            ), false);
        }

        // NOTE: Using this will give you unclonable iterators. Only use this
        // if you can't or don't want to make your iterator clonable
        fromNative(kind, itern, extra = function*(x) {return x}) {
            if(typeof itern[Symbol.iterator] !== 'function') throw `${kind} is not a native iterator.`
            if(typeof kind !== 'string' && typeof kind?.kind !== 'string' || !(kind?.args instanceof Array))
                kind = 'Native'
            return new IteratorType(kind, {}, () => extra(itern.next()), false)
        }
    }

    const divIterator = {
        Item: (value) => ({value, done: false}),
        Done: () => ({value: undefined, done: true}),
        Type: IteratorType,
        Block: {
            blockType: BlockType.REPORTER,
            //blockShape: "divIterator", 
            blockShape: vm.runtime.pmVersion ? BlockShape.ARROW : "divIterator",
            forceOutputType: "Iterator",
            allowDropAnywhere: true,
            disableMonitor: true
        },
        Argument: {
            shape: vm.runtime.pmVersion ? BlockShape.ARROW : "divIterator",
            exemptFromNormalization: true,
            check: ["Iterator"]
        },

        // Extensions depending on Iterators may feel free to use
        // Any of these :Fabrication: :dingly: :Fabrication: :Fabrication:
        Iterables: {
            range(start, end) {
                const advance = n => n + (start < end ? 1 : -1);
                const finished = n => start < end ? (n > end) : (n < end)
                return new IteratorType({kind: "Range", args: [start, end]},
                    {curr: start}, function*(state){
                    const {curr} = state;
                    if(finished(curr)) return divIterator.Done()
                    state.curr = advance(curr);
                    return divIterator.Item(curr)
                });
            },
            iterOver(val) {
                if(val instanceof IteratorType) return val
                if(typeof val.divIntoIterHandler === "function") 
                    return val.divIntoIterHandler(IteratorType, {Item: divIterator.Item, Done: divIterator.Done})
                
                const iterCommon = (val, kind) =>
                    new IteratorType(kind,
                    {i: 0}, function*(state) {
                    return state.i >= val.length 
                    ? divIterator.Done() 
                    : divIterator.Item(val[state.i++])
                });
                if(["string", "number", "boolean"].includes(typeof val)) 
                    return iterCommon(Cast.toString(val), "String");
                if(val instanceof jwArray.Type) return iterCommon(val.array, "Array");
                if(vm.dogeiscutObject && val instanceof vm.dogeiscutObject.Type)
                    return iterCommon(Object.entries(val.object).map(([key, value]) => {
                        return new jwArray.Type([key, vm.dogeiscutObject.Type.convertIfNeeded(value)]);
                    }),"Object")
                return new IteratorType()
            },
            iterBuilder(state, next) {
                return new IteratorType("Custom", {state}, next)
            }
        },
        Adapters: {
            map(iter, map) {
                iter = IteratorType.toIterator(iter)
                return iter.chainIter("Map", 
                    {iter}, function*(state, thread, target, runtime, stage) {
                    const {iter} = state;
                    const item = yield* iter.next(thread, target, runtime, stage)
                    if(item.done) return item
                    const mapped = yield* map(item.value, thread, target, runtime, stage);
                    return divIterator.Item(mapped)
                }, iter.clonable)
            },
            keep(iter, pred) {
                iter = IteratorType.toIterator(iter)
                return iter.chainIter("Keep", 
                    {iter}, function*(state, thread, target, runtime, stage) {
                    let item, bool;
                    while(true) {
                        item = yield* state.iter.next(thread, target, runtime, stage)
                        if(item.done) return item
                        bool = yield* pred(item.value, thread, target, runtime, stage);
                        if(bool) return item
                    }
                }, iter.clonable)
            },

            enum(iter) {
                iter = IteratorType.toIterator(iter)
                return iter.chainIter("Enumerate",
                    {iter, num: 1}, function*(state, thread, target, runtime, stage) {
                    const item = yield* state.iter.next(thread, target, runtime, stage); 
                    if(item.done) return item
                    return divIterator.Item(new jwArray.Type([state.num++, item.value]))
                }, iter.clonable)
            },
            cycle(iter) {
                iter = IteratorType.toIterator(iter)
                return iter.chainIter("Cycle", 
                    {iter, buffer: [], i: 0}, function*(state, thread, target, runtime, stage) {
                    const item = yield* state.iter.next(thread, target, runtime, stage);
                    if(item.done) {
                        if(state.buffer.length == 0) return divIterator.Done()
                        state.i %= state.buffer.length
                        return state.buffer[state.i++]
                    }
                    state.buffer.push(item)
                    return item;
                }, iter.clonable)
            },

            take(iter, count) {
                iter = IteratorType.toIterator(iter)
                return iter.chainIter({kind: "Take", args: [count]},
                    {iter, count}, function*(state, thread, target, runtime, stage) {
                    if(state.count <= 0) return divIterator.Done()
                    const item = yield* state.iter.next(thread, target, runtime, stage);
                    if(item.done) return item
                    state.count--;
                    return item;
                }, iter.clonable)
            },
            skip(iter, count) {
                iter = IteratorType.toIterator(iter)
                return iter.chainIter({kind: "Skip", args: [count]},
                    {iter, count}, function*(state, thread, target, runtime, stage) {
                    while(state.count > 0) {
                        const item = yield* state.iter.next(thread, target, runtime, stage);
                        if(item.done) return item
                        state.count--;
                    }
                    return yield* state.iter.next(thread, target, runtime, stage)
                }, iter.clonable)
            },
            stepBy(iter, step) {
                iter = IteratorType.toIterator(iter)
                return iter.chainIter({kind: "StepBy", args: [step]},
                    {iter, first: true}, function*(state, thread, target, runtime, stage) {
                    if(state.first) {
                        state.first = false;
                        return yield* state.iter.next(thread, target, runtime, stage);
                    }
                    for(let i = 1; i < step; i++) {
                        const item = yield* state.iter.next(thread, target, runtime, stage);
                        if(item.done) return item
                    }
                    return yield* state.iter.next(thread, target, runtime, stage)
                }, iter.clonable)
            },

            chain(iter1, iter2) {
                iter1 = IteratorType.toIterator(iter1)
                iter2 = IteratorType.toIterator(iter2)
                return iter1.chainIter({kind: "Chain", args: [iter2]},
                    {iter1, iter2}, function*(state, thread, target, runtime, stage) {
                    const item1 = yield* state.iter1.next(thread, target, runtime, stage);
                    if(!item1.done) return item1
                    return yield* state.iter2.next(thread, target, runtime, stage)
                }, iter1.clonable && iter2.clonable)
            },
            zip(iter1, iter2) {
                iter1 = IteratorType.toIterator(iter1)
                iter2 = IteratorType.toIterator(iter2)
                return iter1.chainIter({kind: "Zip", args: [iter2]},
                    {iter1, iter2}, function*(state, thread, target, runtime, stage) {
                    const item1 = yield* state.iter1.next(thread, target, runtime, stage);
                    if(item1.done) return item1
                    const item2 = yield* state.iter2.next(thread, target, runtime, stage);
                    if(item2.done) return item2
                    return divIterator.Item(new jwArray.Type([item1.value, item2.value]))
                }, iter1.clonable && iter2.clonable)
            },
            cross(iter1, iter2) {
                iter1 = IteratorType.toIterator(iter1)
                iter2 = IteratorType.toIterator(iter2)
                return iter1.chainIter({kind: "Cross", args: [iter2]},
                    {iter1, buffer: [], i: 0, iter2, item2: null}, function*(state, thread, target, runtime, stage) {
                    const item1 = yield* state.iter1.next(thread, target, runtime, stage);
                    if(item1.done) {
                        if(state.buffer.length == 0) return divIterator.Done()
                        state.i %= state.buffer.length
                        if(state.i == 0) {
                            const item2 = yield* state.iter2.next(thread, target, runtime, stage)
                            if(item2.done) return divIterator.Done()
                            state.item2 = item2.value;
                        }
                        return divIterator.Item(new jwArray.Type([state.buffer[state.i++], state.item2]))
                    }
                    if(state.item2 == null) {
                        const item2 = yield* state.iter2.next(thread, target, runtime, stage)
                        if(item2.done) return divIterator.Done()
                        state.item2 = item2.value;
                    }
                    state.buffer.push(item1.value)
                    return divIterator.Item(new jwArray.Type([item1.value, state.item2]));
                }, iter1.clonable && iter2.clonable)
            },
            
            inspect(iter, inspect) {
                iter = IteratorType.toIterator(iter)
                return iter.chainIter("Inspect", 
                    {iter}, function*(state, thread, target, runtime, stage) {
                    const {iter} = state;
                    const item = yield* iter.next(thread, target, runtime, stage)
                    if(item.done) return item
                    yield* inspect(item.value, thread, target, runtime, stage);
                    return item
                }, iter.clonable)
            },
        },
        Terminators: {
            // Unlike Iterables and Adapters which directly return iterators
            // with no additional effects (yields), terminators are intended
            // to be eagerly run so they will yield
            *count(iter, yieldLoop, thread, target, runtime, stage) {
                iter = IteratorType.toIterator(iter)
                for(let i = 0;; i++) {
                    const item = yield* iter.next(thread, target, runtime, stage)
                    if(item.done) return i
                    yield* yieldLoop()
                }
            },

            *fold(iter, init, fold, yieldLoop, thread, target, runtime, stage) {
                iter = IteratorType.toIterator(iter)
                let acc = init
                for(;;) {
                    const item = yield* iter.next(thread, target, runtime, stage)
                    if(item.done) return acc
                    acc = yield* fold(acc, item.value, thread, target, runtime, stage)
                    yield* yieldLoop()
                }
            },
            *any(iter, pred, yieldLoop, thread, target, runtime, stage) {
                iter = IteratorType.toIterator(iter)
                for(;;) {
                    const item = yield* iter.next(thread, target, runtime, stage)
                    if(item.done) return false
                    if(yield* pred(item.value, thread, target, runtime, stage)) return true
                    yield* yieldLoop()
                }
            },
            *all(iter, pred, yieldLoop, thread, target, runtime, stage) {
                iter = IteratorType.toIterator(iter)
                for(;;) {
                    const item = yield* iter.next(thread, target, runtime, stage)
                    if(item.done) return true
                    if(!(yield* pred(item.value, thread, target, runtime, stage))) return false
                    yield* yieldLoop()
                }
            },
            *collectTo(iter, type, yieldLoop, thread, target, runtime, stage) {
                iter = IteratorType.toIterator(iter)
                switch (type) {
                    case "String":
                        return yield* divIterator.Terminators.fold(iter, "", 
                            function*(acc, item) {return acc + Cast.toString(item)}, 
                            yieldLoop, thread, target, runtime, stage
                        )
                    case "Array":
                        return new jwArray.Type(yield* divIterator.Terminators.fold(iter, [], 
                            function*(acc, item) {return [...acc, item]}, 
                            yieldLoop, thread, target, runtime, stage
                        ))
                    case "Object":
                        const arr = new jwArray.Type(yield* divIterator.Terminators.fold(iter, [], 
                            function*(acc, item) {return [...acc, item]}, 
                            yieldLoop, thread, target, runtime, stage
                        ))
                        try {
                            return new vm.dogeiscutObject.Type(Object.assign(Object.create(null),
                                Object.fromEntries(arr.array.map((value) => value.array ? value.array : value))
                            ))
                        } catch {}
                        return new vm.dogeiscutObject.Type()
                }
                if(vm.divFromIter && typeof vm.divFromIter.get(type) === "function")
                    return yield* vm.divFromIter.get(type)(iter, yieldLoop, thread, target, runtime, stage)
            }
        }
    }

    function descendInput(compiler, input, frame) {
        if(frame == null) return compiler.descendInput(input)
        compiler.pushFrame(frame)
        const res = compiler.descendInput(input);
        compiler.popFrame()
        return res
    }

    function descendSubstack(compiler, substack, frame) {
        const src = compiler.source; compiler.source = ""
        compiler.descendStack(substack, frame)
        const sub = compiler.source; compiler.source = src
        return sub
    }

    function yieldLoop(compiler) {
        const src = compiler.source; compiler.source = ""
        compiler.yieldLoop()
        const ly = compiler.source; compiler.source = src
        return ly
    }

    function inputThunk(compiler, input, args = null) {
        const proc = compiler.localVariables.next();
        return (/*js*/
            `(function() {\n`
           +`   const ${proc} = thread.procedures;`
           +`   return function*(${args ? args + ', ' : '' }thread, target, runtime, stage) {\n`
           +`       thread.procedures = {...${proc}, ...thread.procedures};\n`
           +`       return ${input};\n`
           +`   };\n`
           +`})()`
        )
    }
    function substackThunk(compiler, substack, args = null) {
        const proc = compiler.localVariables.next();
        return (/*js*/
            `(function() {\n`
           +`   const ${proc} = thread.procedures;`
           +`   return function*(${args ? args + ', ' : '' }thread, target, runtime, stage) {\n`
           +`       thread.procedures = {...${proc}, ...thread.procedures};\n`
           +`       ${substack}\n`
           +`   };\n`
           +`})()`
        )
    }

    class Extension {
        constructor() {
            // Add jwArray
            if (!vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray')
            jwArray = vm.jwArray

            vm.divIterator = divIterator
            vm.runtime.registerSerializer("divIterator",
                _ => null,
                _ => new IteratorType()
            )
            vm.runtime.registerCompiledExtensionBlocks('divIterator', this.getCompileInfo());

            // Initialize FromIter registry if it hasn't been initialized yet
            vm.divFromIter ??= new Map()

            // If this isn't on the port, use a custom arrow shape
            if(!vm.runtime.pmVersion) {
                Scratch.gui.getBlockly().then(ScratchBlocks => {
                    ScratchBlocks.BlockSvg.registerCustomShape("divIterator", {
                        emptyInputPath: ScratchBlocks.BlockSvg.getInputShapeInfo_(Scratch.BlockShape.ARROW).path,// `m 16 0 h 15 q 3 0 5 2 l 8 8 q 3 3 3 4 v 4 q 0 1 -3 4 l -8 8 q -2 2 -5 2 h -15 h -11 c -2 0 -3 0 -4 -1 s -1 -3 0 -4 l 9 -9 v -4 l -8 -8 c -2 -2 -2 -4 -1 -5 s 2 -1 4 -1 h 11 z`,
                        leftPath(block) {
                            const edgeWidth = block.height / 2;
                            const h = -2*Math.max(edgeWidth - 14*1.25, 0);
                            return [
                                block.inputList.some(i => i.type === ScratchBlocks.NEXT_STATEMENT) 
                                ? `h -21 c -2.5 0 -3.75 0 -5 -1.25 s -1.25 -3.75 0 -5 l 11.25 -11.25 v ${h} l -10 -10 c -2.5 -2.5 -2.5 -5 -1.25 -6.25 s 2.5 -1.25 5 -1.25 h 21` 
                                : `h ${-13.75 + h/2.} c -2.5 0 -3.75 0 -5 -1.25 s -1.25 -3.75 0 -5 l 11.25 -11.25 v ${h} l -10 -10 c -2.5 -2.5 -2.5 -5 -1.25 -6.25 s 2.5 -1.25 5 -1.25 h ${13.75 - h/2.}`
                            ];
                        },
                        rightPath(block) {
                            const edgeWidth = /*block.height/2.;*/ block.edgeShapeWidth_;
                            const h = 2*Math.max(edgeWidth - 14*1.25, 0);
                            return [`h ${h/2} q 3.75 0 6.25 2.5 l 10 10 q 3.75 3.75 3.75 5 v ${h} q 0 1.25 -3.75 5 l -10 10 q -2.5 2.5 -6.25 2.5 h ${-h/2}`];
                        },
                        outputLeftPadding(block) {
                            return block.inputList.some(i => i.type == ScratchBlocks.NEXT_STATEMENT) 
                            ? -block.height/2 + 22 : 0
                        }
                    });
                });
            }
        }
        getInfo = () => ({
            id: "divIterator",
            name: "Iterators",
            color1: "#ff3662",
            color2: "#7d101d",
            color3: "#ac294f",
            menuIconURI,
            blocks: [
                {
                    opcode: 'iterItem',
                    text: 'item',
                    blockType: BlockType.REPORTER,
                    hideFromPalette: true,
                    allowDropAnywhere: true,
                    canDragDuplicate: true
                },
                {
                    opcode: 'iterAcc',
                    text: 'acc',
                    blockType: BlockType.REPORTER,
                    hideFromPalette: true,
                    allowDropAnywhere: true,
                    canDragDuplicate: true
                },

                {
                    opcode: 'iterAdvance',
                    text: 'advance [ITER]',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    arguments: {
                        ITER: divIterator.Argument
                    }
                },
                {
                    opcode: 'iterNext',
                    text: 'next item from [ITER]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    blockShape: BlockShape.ROUND,
                    allowDropAnywhere: true,
                    arguments: {
                        ITER: divIterator.Argument
                    }
                },
                {
                    opcode: 'iterDone',
                    text: '[ITER] is done?',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN,
                    allowDropAnywhere: true,
                    arguments: {
                        ITER: divIterator.Argument
                    }
                },
                '---',
                {
                    opcode: 'iterClone',
                    text: 'clone [ITER]',
                    arguments: {
                        ITER: divIterator.Argument
                    },
                    ...divIterator.Block
                },
                {
                    opcode: 'iterClonable',
                    text: '[ITER] is clonable?',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN,
                    allowDropAnywhere: true,
                    arguments: {
                        ITER: divIterator.Argument
                    }
                },
                {
                    opcode: 'iterBranch',
                    text: 'branch [ITER] into [NUM] branches',
                    arguments: {
                        ITER: divIterator.Argument,
                        NUM: {type: ArgumentType.NUMBER, defaultValue: 2}
                    },
                    ...jwArray.Block
                },
                '---',
                {
                    opcode: 'iterTermForEach',
                    text: 'for [I] of [ITER]',
                    blockType: BlockType.LOOP,
                    branchCount: 1,
                    arguments: {
                        ITER: divIterator.Argument,
                        I: {fillIn: 'iterItem'},
                    },
                },

                {
                    blockType: BlockType.LABEL,
                    text: 'Iterables'
                },
                {
                    opcode: 'iterRange',
                    text: 'range from [START] to [END]',
                    arguments: {
                        START: {type: ArgumentType.NUMBER, defaultValue: 1},
                        END: {type: ArgumentType.NUMBER, defaultValue: 10},
                    },
                    ...divIterator.Block
                },
                {
                    opcode: 'iterIterOver',
                    text: 'iter over [VAL]',
                    arguments: {
                        VAL: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                    },
                    ...divIterator.Block
                },

                '---',
                {
                    opcode: 'iterBuilder',
                    text: 'iterator builder with [S] = [STATE]',
                    branchCount: 1,
                    arguments: {
                        STATE: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                        S: {fillIn: 'iterBuilderGetState'},
                    },
                    branches: [{}],
                    ...divIterator.Block
                },
                {
                    opcode: 'iterBuilderGetState',
                    text: 'state',
                    blockType: BlockType.REPORTER,
                    hideFromPalette: true,
                    allowDropAnywhere: true,
                    canDragDuplicate: true
                },
                {
                    opcode: 'iterBuilderSetState',
                    text: 'set state to [STATE]',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    arguments: {
                        STATE: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        }
                    }
                },
                {
                    opcode: 'iterBuilderItem',
                    text: 'return item [ITEM]',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                    arguments: {
                        ITEM: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        }
                    }
                },
                {
                    opcode: 'iterBuilderDone',
                    text: 'finish iterator',
                    disableMonitor: true,
                    blockType: BlockType.COMMAND,
                    isTerminal: true,
                },

                {
                    blockType: BlockType.LABEL,
                    text: 'Iterator Adapters'
                },
                {
                    opcode: 'iterAdapterMap',
                    text: '[ITER] then map [I] [IMG] [MAP]',
                    arguments: {
                        ITER: divIterator.Argument,
                        I: {fillIn: 'iterItem'},
                        MAP: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                        IMG: { type: Scratch.ArgumentType.IMAGE, dataURI: arrowURI } // Stole from Sharkpool muhahaha
                    },
                    ...divIterator.Block
                },
                {
                    opcode: 'iterAdapterKeep',
                    text: '[ITER] then keep [I] if [PRED]',
                    arguments: {
                        ITER: divIterator.Argument,
                        I: {fillIn: 'iterItem'},
                        PRED: {type: Scratch.ArgumentType.BOOLEAN},
                    },
                    ...divIterator.Block
                },
                '---',
                {
                    opcode: 'iterAdapterEnum',
                    text: '[ITER] then enumerate items',
                    arguments: {
                        ITER: divIterator.Argument,
                    },
                    ...divIterator.Block
                },
                {
                    opcode: 'iterAdapterCycle',
                    text: '[ITER] then cycle items',
                    arguments: {
                        ITER: divIterator.Argument,
                    },
                    ...divIterator.Block
                },
                '---',
                {
                    opcode: 'iterAdapterTake',
                    text: '[ITER] then take [COUNT] items',
                    arguments: {
                        ITER: divIterator.Argument,
                        COUNT: {type: Scratch.ArgumentType.NUMBER, defaultValue: 4},
                    },
                    ...divIterator.Block
                },
                {
                    opcode: 'iterAdapterSkip',
                    text: '[ITER] then skip [COUNT] items',
                    arguments: {
                        ITER: divIterator.Argument,
                        COUNT: {type: Scratch.ArgumentType.NUMBER, defaultValue: 4},
                    },
                    ...divIterator.Block
                },
                {
                    opcode: 'iterAdapterStepBy',
                    text: '[ITER] then step by [STEP] items',
                    arguments: {
                        ITER: divIterator.Argument,
                        STEP: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2},
                    },
                    ...divIterator.Block
                },
                '---',
                {
                    opcode: 'iterAdapterChain',
                    text: '[ITER1] then chain with [ITER2]',
                    arguments: {
                        ITER1: divIterator.Argument,
                        ITER2: divIterator.Argument,
                    },
                    ...divIterator.Block
                },
                {
                    opcode: 'iterAdapterZip',
                    text: '[ITER1] then zip with [ITER2]',
                    arguments: {
                        ITER1: divIterator.Argument,
                        ITER2: divIterator.Argument,
                    },
                    ...divIterator.Block
                },
                {
                    opcode: 'iterAdapterCross',
                    text: '[ITER1] then cross with [ITER2]',
                    arguments: {
                        ITER1: divIterator.Argument,
                        ITER2: divIterator.Argument,
                    },
                    ...divIterator.Block
                },
                '---',
                {
                    opcode: 'iterAdapterInspect',
                    text: '[ITER] then inspect [I]',
                    branchCount: 1,
                    arguments: {
                        ITER: divIterator.Argument,
                        I: {fillIn: 'iterItem'},
                    },
                    branches: [{}],
                    ...divIterator.Block
                },

                {
                    blockType: BlockType.LABEL,
                    text: 'Iterator Terminators'
                },
                {
                    opcode: 'iterCollectTo',
                    text: '[ITER] finally collect to [TYPE]',
                    arguments: {
                        ITER: divIterator.Argument,
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "fromIter",
                            defaultValue: "Array"
                        }
                    },
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    blockShape: BlockShape.ROUND,
                    allowDropAnywhere: true,
                },
                {
                    opcode: 'iterTermCount',
                    text: '[ITER] finally count items',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        ITER: divIterator.Argument,
                    },
                },

                {
                    opcode: 'iterTermFold',
                    text: '[ITER] finally reduce [INIT] with [A] [I] [IMG] [FOLD]',
                    disableMonitor: true,
                    blockType: BlockType.REPORTER,
                    blockShape: BlockShape.ROUND,
                    allowDropAnywhere: true,
                    arguments: {
                        ITER: divIterator.Argument,
                        INIT: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "foo",
                            exemptFromNormalization: true
                        },
                        FOLD: {
                            type: Scratch.ArgumentType.STRING,
                            exemptFromNormalization: true
                        },
                        A: {fillIn: 'iterAcc'},
                        I: {fillIn: 'iterItem'},
                        IMG: { type: Scratch.ArgumentType.IMAGE, dataURI: arrowURI }
                    }
                },
                {
                    opcode: 'iterTermAny',
                    text: '[ITER] finally any [I] [IMG] [PRED]',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN,
                    allowDropAnywhere: true,
                    arguments: {
                        ITER: divIterator.Argument,
                        PRED: {type: Scratch.ArgumentType.BOOLEAN},
                        I: {fillIn: 'iterItem'},
                        IMG: { type: Scratch.ArgumentType.IMAGE, dataURI: arrowURI }
                    }
                },
                {
                    opcode: 'iterTermAll',
                    text: '[ITER] finally all [I] [IMG] [PRED]',
                    disableMonitor: true,
                    blockType: BlockType.BOOLEAN,
                    allowDropAnywhere: true,
                    arguments: {
                        ITER: divIterator.Argument,
                        PRED: {type: Scratch.ArgumentType.BOOLEAN},
                        I: {fillIn: 'iterItem'},
                        IMG: { type: Scratch.ArgumentType.IMAGE, dataURI: arrowURI }
                    }
                },
            ],
            menus: {
                fromIter: {
                    acceptReporters: false,
                    items: 'getFromIterMenu'
                }
            }
        })

        getFromIterMenu() {
            let more = []
            if(vm.divFromIter) more = [...vm.divFromIter.keys()]
            return ["String", "Array", ...(vm.dogeiscutObject ? ["Object"] : []), ...more].map(s => ({
                text: s,
                value: s,
            }))
        }

        getCompileInfo = () => ({
            ir: {
                iterItem: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                    }
                },
                iterAcc: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                    }
                },

                iterAdvance: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                    }
                },
                iterNext: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                    }
                },

                iterTermForEach: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                        SUBSTACK: generator.descendSubstack(block, 'SUBSTACK')
                    }
                },

                iterCollectTo: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                        TYPE: block.fields.TYPE.value
                    }
                },
                
                iterBuilder: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        STATE: generator.descendInputOfBlock(block, 'STATE'),
                        NEXT: generator.descendSubstack(block, 'SUBSTACK'),
                    }
                },
                iterBuilderGetState: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                    }
                },
                iterBuilderSetState: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        STATE: generator.descendInputOfBlock(block, 'STATE'),
                    }
                },
                iterBuilderItem: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                        ITEM: generator.descendInputOfBlock(block, 'ITEM'),
                    }
                },
                iterBuilderDone: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'stack',
                    }
                },

                iterAdapterMap: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                        MAP: generator.descendInputOfBlock(block, 'MAP'),
                    }
                },
                iterAdapterKeep: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                        PRED: generator.descendInputOfBlock(block, 'PRED'),
                    }
                },
                
                iterAdapterInspect: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                        INSPECT: generator.descendSubstack(block, 'SUBSTACK'),
                    }
                },
                
                iterTermCount: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                    }
                },

                iterTermFold: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                        INIT: generator.descendInputOfBlock(block, 'INIT'),
                        FOLD: generator.descendInputOfBlock(block, 'FOLD'),
                    }
                },
                iterTermAny: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                        PRED: generator.descendInputOfBlock(block, 'PRED'),
                    }
                },
                iterTermAll: (generator, block) => {
                    generator.script.yields = true
                    return {
                        kind: 'input',
                        ITER: generator.descendInputOfBlock(block, 'ITER'),
                        PRED: generator.descendInputOfBlock(block, 'PRED'),
                    }
                },
            },
            js: {
                iterItem(node, compiler, imports) {
                    if(compiler.frames.some(f => f.parent === "_divIterItem" || f.parent === "_divIterAcc"))
                        return new imports.TypedInput("_divIterItem", imports.TYPE_UNKNOWN);
                    return new imports.TypedInput("''", imports.TYPE_UNKNOWN);
                },
                iterAcc(node, compiler, imports) {
                    if(compiler.frames.some(f => f.parent === "_divIterAcc"))
                        return new imports.TypedInput("_divIterAcc", imports.TYPE_UNKNOWN);
                    return new imports.TypedInput("''", imports.TYPE_UNKNOWN);
                },

                iterAdvance(node, compiler, imports) {
                    const iter = compiler.localVariables.next();
                    compiler.source += 
                 /*js*/`const ${iter} = vm.divIterator.Type.toIterator(${compiler.descendInput(node.ITER).asUnknown()});\n`
                +/*js*/`yield* ${iter}.next(thread, target, runtime, stage);\n`
                },
                iterNext(node, compiler, imports) {
                    const iter = compiler.localVariables.next(),
                          item = compiler.localVariables.next();
                    return new imports.TypedInput(
                 /*js*/`(yield* (function*() {\n`
                      +`    const ${iter} = vm.divIterator.Type.toIterator(${compiler.descendInput(node.ITER).asUnknown()});\n`
                      +`    const ${item} = yield* ${iter}.next(thread, target, runtime, stage);\n`
                      +`    return ${item}.done ? '' : ${item}.value;\n`
                      +`})())`
                    , imports.TYPE_UNKNOWN)
                },

                iterTermForEach(node, compiler, imports) {
                    const iterv = compiler.localVariables.next(),
                          item = compiler.localVariables.next();
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    const substack = descendSubstack(compiler, node.SUBSTACK, new imports.Frame(true, "_divIterItem"));
                    compiler.source +=
                    /*js*/`const ${iterv} = vm.divIterator.Type.toIterator(${iter});\n`
                   +/*js*/`for(let ${item} = yield* ${iterv}.next(thread, target, runtime, stage);\n`
                         +`!${item}.done; ${item} = yield* ${iterv}.next(thread, target, runtime, stage)) {\n`
                         +`    const _divIterItem = ${item}.value;\n`
                         +`    ${substack}\n`
                         +`    ${yieldLoop(compiler)}\n`
                         +`}`
                },

                iterCollectTo(node, compiler, imports) {
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    return new imports.TypedInput(
                 /*js*/`(yield* vm.divIterator.Terminators.collectTo(\n`
                      +`    ${iter}, '${node.TYPE}',\n`
                      +`    function*() {${yieldLoop(compiler)}},\n`
                      +`thread, target, runtime, stage))\n`
                    , imports.TYPE_UNKNOWN)
                },
                
                iterBuilder(node, compiler, imports) {
                    const state = compiler.descendInput(node.STATE).asUnknown();
                    const next = descendSubstack(compiler, node.NEXT, new imports.Frame(false, "_divIterBuilder"))
                        +`\nreturn vm.divIterator.Item("");\n`
                    return new imports.TypedInput(
                 /*js*/`vm.divIterator.Iterables.iterBuilder(\n`
                      +`    ${state},\n`
                      +`    ${substackThunk(compiler, next, '_divIterState')}\n`
                      +`)\n`
                    , imports.TYPE_UNKNOWN)
                },
                iterBuilderGetState(node, compiler, imports) {
                    if(compiler.frames.some(f => f.parent === "_divIterBuilder"))
                        return new imports.TypedInput("_divIterState.state", imports.TYPE_UNKNOWN);
                    return new imports.TypedInput("''", imports.TYPE_UNKNOWN);
                },
                iterBuilderSetState(node, compiler, imports) {
                    if(!compiler.frames.some(f => f.parent === "_divIterBuilder")) return;
                    const state = compiler.descendInput(node.STATE).asUnknown()
                    compiler.source += `_divIterState.state = ${state};`
                },
                iterBuilderItem(node, compiler, imports) {
                    if(!compiler.frames.some(f => f.parent === "_divIterBuilder")) return;
                    const item = compiler.descendInput(node.ITEM).asUnknown()
                    compiler.source += `return vm.divIterator.Item(${item});`
                },
                iterBuilderDone(node, compiler, imports) {
                    if(!compiler.frames.some(f => f.parent === "_divIterBuilder")) return;
                    compiler.source += `return vm.divIterator.Done();`
                },

                iterAdapterMap(node, compiler, imports) {
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    const map = descendInput(compiler, node.MAP, new imports.Frame(true, "_divIterItem",))
                        .asUnknown();
                    return new imports.TypedInput(
                 /*js*/`vm.divIterator.Adapters.map(\n`
                      +`    ${iter},\n`
                      +`    ${inputThunk(compiler, map, '_divIterItem')}\n`
                      +`)\n`
                    , imports.TYPE_UNKNOWN)
                },
                iterAdapterKeep(node, compiler, imports) {
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    const pred = descendInput(compiler, node.PRED, new imports.Frame(true, "_divIterItem"))
                        .asBoolean();
                    return new imports.TypedInput(
                 /*js*/`vm.divIterator.Adapters.keep(\n`
                      +`    ${iter},\n`
                      +`    ${inputThunk(compiler, pred, '_divIterItem')}\n`
                      +`)\n`
                    , imports.TYPE_UNKNOWN)
                },

                iterAdapterInspect(node, compiler, imports) {
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    const inspect = descendSubstack(compiler, node.INSPECT, new imports.Frame(false, "_divIterItem"));
                    return new imports.TypedInput(
                 /*js*/`vm.divIterator.Adapters.inspect(\n`
                      +`    ${iter},\n`
                      +`    ${substackThunk(compiler, inspect, '_divIterItem')}\n`
                      +`)\n`
                    , imports.TYPE_UNKNOWN)
                },

                iterTermCount(node, compiler, imports) {
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    return new imports.TypedInput(
                 /*js*/`(yield* vm.divIterator.Terminators.count(\n`
                      +`    ${iter},\n`
                      +`    function*() {${yieldLoop(compiler)}},\n`
                      +`thread, target, runtime, stage))\n`
                    , imports.TYPE_UNKNOWN)
                },

                iterTermFold(node, compiler, imports) {
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    const init = compiler.descendInput(node.INIT).asUnknown();
                    const fold = descendInput(compiler, node.FOLD, new imports.Frame(true, "_divIterAcc")).asUnknown();
                    return new imports.TypedInput(
                 /*js*/`(yield* vm.divIterator.Terminators.fold(\n`
                      +`    ${iter}, ${init},\n`
                      +`    ${inputThunk(compiler, fold, '_divIterAcc, _divIterItem')},\n`
                      +`    function*() {${yieldLoop(compiler)}},\n`
                      +`thread, target, runtime, stage))\n`
                    , imports.TYPE_UNKNOWN)
                },
                iterTermAny(node, compiler, imports) {
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    const pred = descendInput(compiler, node.PRED, new imports.Frame(true, "_divIterItem")).asBoolean();
                    return new imports.TypedInput(
                 /*js*/`(yield* vm.divIterator.Terminators.any(\n`
                      +`    ${iter},\n`
                      +`    ${inputThunk(compiler, pred, '_divIterItem')},\n`
                      +`    function*() {${yieldLoop(compiler)}},\n`
                      +`thread, target, runtime, stage))\n`
                    , imports.TYPE_UNKNOWN)
                },
                iterTermAll(node, compiler, imports) {
                    const iter = compiler.descendInput(node.ITER).asUnknown();
                    const pred = descendInput(compiler, node.PRED, new imports.Frame(true, "_divIterItem")).asBoolean();
                    return new imports.TypedInput(
                 /*js*/`(yield* vm.divIterator.Terminators.all(\n`
                      +`    ${iter},\n`
                      +`    ${inputThunk(compiler, pred, '_divIterItem')},\n`
                      +`    function*() {${yieldLoop(compiler)}},\n`
                      +`thread, target, runtime, stage))\n`
                    , imports.TYPE_UNKNOWN)
                },
            }
        })

        iterItem() {
            return "noop"
        }
        iterAcc() {
            return "noop"
        }

        iterAdvance() {
            return "noop"
        }
        iterNext() {
            return "noop"
        }
        iterDone({ITER}) {
            return IteratorType.toIterator(ITER).done
        }
        iterClone({ITER}) {
            return IteratorType.toIterator(ITER).clone()
        }
        iterClonable({ITER}) {
            return IteratorType.toIterator(ITER).clonable
        }
        iterBranch({ITER, NUM}) {
            return new jwArray.Type(IteratorType.toIterator(ITER).branch(NUM))
        }

        iterTermForEach() {
            return "noop"
        }

        // Iterables
        // Note: set end to 1e308 for a practically infinite iterator.
        iterRange({START, END}) {
            return divIterator.Iterables.range(START, END)
        }
        iterIterOver({VAL}) {
            return divIterator.Iterables.iterOver(VAL)
        }
        iterCollectTo() {
            return "noop"
        }

        // Builder
        iterBuilder() {
            return "noop"
        }
        iterBuilderGetState() {
            return "noop"
        }
        iterBuilderSetState() {
            return "noop"
        }
        iterBuilderItem() {
            return "noop"
        }
        iterBuilderDone() {
            return "noop"
        }

        // Adapters
        iterAdapterMap() {
            return "noop"
        }
        iterAdapterKeep() {
            return "noop"
        }

        iterAdapterEnum({ITER}) {
            return divIterator.Adapters.enum(ITER)
        }
        iterAdapterCycle({ITER}) {
            return divIterator.Adapters.cycle(ITER)
        }

        iterAdapterTake({ITER, COUNT}) {
            return divIterator.Adapters.take(ITER, COUNT)
        }
        iterAdapterSkip({ITER, COUNT}) {
            return divIterator.Adapters.skip(ITER, COUNT)
        }
        iterAdapterStepBy({ITER, STEP}) {
            return divIterator.Adapters.stepBy(ITER, STEP)
        }

        iterAdapterChain({ITER1, ITER2}) {
            return divIterator.Adapters.chain(ITER1, ITER2)
        }
        iterAdapterZip({ITER1, ITER2}) {
            return divIterator.Adapters.zip(ITER1, ITER2)
        }
        iterAdapterCross({ITER1, ITER2}) {
            return divIterator.Adapters.cross(ITER1, ITER2)
        }
        
        iterAdapterInspect() {
            return "noop"
        }

        // Terminators
        iterTermCount() {
            return "noop"
        }

        iterTermFold() {
            return "noop"
        }
        iterTermAny() {
            return "noop"
        }
        iterTermAll() {
            return "noop"
        }
    }
    Scratch.extensions.register(new Extension())
})(Scratch)
