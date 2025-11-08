// Name: Objects
// ID: dogeiscutObject
// Description: Store data efficiently in multi-purpose objects.
// By: dogeiscut <https://scratch.mit.edu/users/dogeiscut/>

// this was a nightmare to code

// FUTURE UPDATE TODO:
// - block toggle for the recursion stuff i had before (wouldn't save or display in bubbles though unless i figure that out)

// TODO:
// turn keys values and entires of into a single block with a dropdown

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Objects\' must run unsandboxed!');
    }

    const vm = Scratch.vm

    const isArray = Array.isArray
    const fnToString = Function.prototype.toString
    const classRegex = /^class\s/
    const hasOwn = Object.hasOwn;
    const defaultPrototype = Object.getPrototypeOf({})

    function isClassOrInstance(x) {
        if (typeof x === "function") {
            return classRegex.test(fnToString.call(x))
        }
        if (x && typeof x === "object") {
            const ctor = x.constructor
            return typeof ctor === "function" && classRegex.test(fnToString.call(ctor))
        }
        return false
    }

    function escapeHTML (unsafe) {
        return unsafe
            .replaceAll("&", "&amp;")
            .replaceAll("<", "&lt;")
            .replaceAll(">", "&gt;")
            .replaceAll('"', "&quot;")
            .replaceAll("'", "&#039;")
    }

    class ObjectType {
        customId = "dogeiscutObject"

        constructor(object) {
            if (object && typeof object === "object") {
                this.object = { ...object }
                Object.setPrototypeOf(this.object, null)
            } else {
                this.object = Object.create(null)
            }
        }

        static toObject(x, copy = true) {
            if (copy) {
                if (x === "" || x === null || x === undefined) return new ObjectType()
                if (x instanceof ObjectType) return new ObjectType(x.object)
            } else {
                if (x === "" || x === null || x === undefined) return ObjectType.blank
                if (x instanceof ObjectType) return x
            }

            if (x && typeof x === "object") {
                if (x instanceof jwArray.Type) {
                    return new ObjectType(Object.fromEntries(x.array.map((v,i)=>[i+1,v])))
                }
                if (isArray(x)) {
                    return new ObjectType(Object.fromEntries(x.map((v,i)=>[i+1,v])))
                }
                if (typeof x.toJSON == "function") {
                    x = x.toJSON()
                }
                if (isClassOrInstance(x)) {
                    return new ObjectType({ value: x })
                }
                return new ObjectType(Object.assign(Object.create(null), x))
            }

            if (typeof x === "string") {
                try {
                    const parsed = JSON.parse(x)
                    if (isArray(parsed)) {
                        return new ObjectType(Object.fromEntries(parsed.map((v,i)=>[i+1,v])))
                    }
                    if (parsed && typeof parsed === "object") {
                        return new ObjectType(Object.assign(Object.create(null), parsed))
                    }
                } catch {}
            }

            return new ObjectType({ value: x })
        }

        jwArrayHandler() {
            // not sure how i feel about this
            return this.toVisualContent().outerHTML
        }

        dogeiscutObjectHandler() {
            return this.toString()
        }

        static convertIfNeeded(x) {
            if (x === null || typeof x !== "object") return x
            if (x instanceof jwArray.Type || x instanceof dogeiscutObject.Type) return x

            if (isArray(x)) return jwArray.Type.toArray(x)
            const prototype = Object.getPrototypeOf(x)
            if (!prototype || prototype === defaultPrototype) return dogeiscutObject.Type.toObject(x)

            return x
        }

        toString() {
            const stringify = (obj) => {
                if (obj instanceof jwArray.Type) {
                    return `[${obj.array.map(item => stringify(item)).join(",")}]`;
                }
                if (isArray(obj)) {
                    return `[${obj.map(stringify).join(",")}]`;
                }
                if (obj instanceof dogeiscutObject.Type) {
                    return obj.toString();
                }
                if (obj !== null && typeof obj === "object") {
                    if (typeof obj.dogeiscutObjectHandler == "function") {
                        return obj.dogeiscutObjectHandler()
                    }
                    if (typeof obj.jwArrayHandler == "function") {
                        return obj.jwArrayHandler()
                    }
                    const entries = Object.entries(obj)
                        .map(([key, value]) => `"${key.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}":${stringify(value)}`)
                        .join(",");
                    return `{${entries}}`;
                }
                if (obj === null || obj === undefined) return "null";
                if (typeof obj === "string") return JSON.stringify(obj);
                if (typeof obj === "number" || typeof obj === "boolean") return obj.toString();
                return "?";
            };

            return stringify(this.object);
        }

        toVisualContent(border = '1px solid #ccc', keyBackground = '#f9f9f9', background = '#fff') {
            // wasnt sure how i wanted this to look so i have some customization
            const RENDER_ARRAYS_VISUALLY = true;
            const SHOW_ARRAY_INDEX_NUMBERS = false;
            const RENDER_STRING_VALUES_WITH_QUOTES = true;
            const ENTRY_LIMIT = 1000;

            function renderObject(obj) {
                const table = document.createElement('table');
                table.style.borderCollapse = 'collapse';
                table.style.margin = '4px 0';
                table.style.fontSize = '12px';

                const entries = Object.entries(obj);
                const limitedEntries = entries.slice(0, ENTRY_LIMIT);

                for (const [key, value] of limitedEntries) {
                    const row = document.createElement('tr');

                    const keyCell = document.createElement('td');
                    keyCell.textContent = key;
                    keyCell.style.border = border;
                    keyCell.style.padding = '2px 6px';
                    keyCell.style.background = keyBackground;
                    keyCell.style.fontWeight = 'bold';

                    const valueCell = document.createElement('td');
                    valueCell.style.border = border;
                    valueCell.style.padding = '2px 6px';
                    valueCell.style.background = background;

                    if (typeof value === 'object' && value !== null) {
                        if (value instanceof dogeiscutObject.Type) {
                            valueCell.appendChild(renderObject(value.object));
                        } else if (RENDER_ARRAYS_VISUALLY && (isArray(value) || (jwArray && value instanceof jwArray.Type))) {
                            valueCell.appendChild(renderArray(isArray(value) ? value : (value.array || [])));
                        } else if (typeof value.dogeiscutObjectHandler === "function") {
                            valueCell.innerHTML = escapeHTML(value.dogeiscutObjectHandler());
                        } else if (typeof value.jwArrayHandler === "function") {
                            valueCell.innerHTML = escapeHTML(value.jwArrayHandler());
                        } else {
                            valueCell.appendChild(renderObject(value));
                        }
                    } else if (typeof value === "string" && RENDER_STRING_VALUES_WITH_QUOTES) {
                        valueCell.textContent = `"${value}"`;
                    } else if (value && typeof value.toString === "function" && value.toString !== Object.prototype.toString) {
                        valueCell.textContent = value.toString();
                    } else if (value === null || value === undefined) {
                        valueCell.textContent = "null";
                    } else {
                        valueCell.textContent = String(value);
                    }

                    row.appendChild(keyCell);
                    row.appendChild(valueCell);
                    table.appendChild(row);
                }

                if (entries.length > ENTRY_LIMIT) {
                    const moreRow = document.createElement('tr');
                    const moreCell = document.createElement('td');
                    moreCell.colSpan = 2;
                    moreCell.textContent = `... ${entries.length - ENTRY_LIMIT} more entries`;
                    moreCell.style.textAlign = 'center';
                    moreCell.style.fontStyle = 'italic';
                    moreRow.appendChild(moreCell);
                    table.appendChild(moreRow);
                }

                return table;
            }

            function renderArray(arr) {
                const arrTable = document.createElement('table');
                arrTable.style.borderCollapse = 'collapse';
                arrTable.style.margin = '2px 0';
                arrTable.style.fontSize = '12px';
                arrTable.style.background = background;
                arrTable.style.border = border;

                const limitedArray = arr.slice(0, ENTRY_LIMIT);

                limitedArray.forEach((item, idx) => {
                    const row = document.createElement('tr');

                    if (SHOW_ARRAY_INDEX_NUMBERS) {
                        const idxCell = document.createElement('td');
                        idxCell.textContent = idx;
                        idxCell.style.border = border;
                        idxCell.style.padding = '2px 6px';
                        idxCell.style.background = keyBackground;
                        idxCell.style.fontWeight = 'bold';
                        row.appendChild(idxCell);
                    }

                    const valCell = document.createElement('td');
                    valCell.style.border = border;
                    valCell.style.padding = '2px 6px';
                    valCell.style.background = background;

                    if (typeof item === 'object' && item !== null) {
                        if (item instanceof dogeiscutObject.Type) {
                            valCell.appendChild(renderObject(item.object));
                        } else if (RENDER_ARRAYS_VISUALLY && (isArray(item) || (jwArray && item instanceof jwArray.Type))) {
                            valCell.appendChild(renderArray(isArray(item) ? item : (item.array || [])));
                        } else if (typeof item.dogeiscutObjectHandler === "function") {
                            valCell.innerHTML = escapeHTML(item.dogeiscutObjectHandler());
                        } else if (typeof item.jwArrayHandler === "function") {
                            valCell.innerHTML = escapeHTML(item.jwArrayHandler());
                        } else {
                            valCell.appendChild(renderObject(item));
                        }
                    } else if (typeof item === "string" && RENDER_STRING_VALUES_WITH_QUOTES) {
                        valCell.textContent = `"${item}"`;
                    } else if (item && typeof item.toString === "function" && item.toString !== Object.prototype.toString) {
                        valCell.textContent = item.toString();
                    } else if (item === null || item === undefined) {
                        valCell.textContent = "null";
                    } else {
                        valCell.textContent = String(item);
                    }

                    row.appendChild(valCell);
                    arrTable.appendChild(row);
                });

                if (arr.length > ENTRY_LIMIT) {
                    const moreRow = document.createElement('tr');
                    const moreCell = document.createElement('td');
                    moreCell.colSpan = SHOW_ARRAY_INDEX_NUMBERS ? 2 : 1;
                    moreCell.textContent = `... ${arr.length - ENTRY_LIMIT} more items`;
                    moreCell.style.textAlign = 'center';
                    moreCell.style.fontStyle = 'italic';
                    moreRow.appendChild(moreCell);
                    arrTable.appendChild(moreRow);
                }

                return arrTable;
            }

            let root = document.createElement('div');
            root.appendChild(renderObject(this.object));
            return root;
        }

        toMonitorContent = () => this.toVisualContent('1px solid #fff', '#ffffff33', 'ffffff00')

        toReporterContent = () => this.toVisualContent()

        toJSON() {
            return Object.fromEntries(
                Object.entries(this.object).map(([key, value]) => {
                    if (typeof value === "object" && value !== null) {
                        if (typeof value.toJSON === "function") return [key, value.toJSON()]
                        if (typeof value.toString === "function") return [key, value.toString()]
                        return [key, JSON.stringify(value)]
                    }
                    return [key, value]
                })
            )
        }

        // Runtime var support

        get(key) {
            if (typeof key !== "string" && typeof key !== "number") return undefined
            return ObjectType.convertIfNeeded(this.object[key])
        }

        set(key, value) {
            if (typeof key !== "string" && typeof key !== "number") return
            this.object[key] = ObjectType.convertIfNeeded(value)
        }

        delete(key) {
            if (typeof key !== "string" && typeof key !== "number") return
            if (hasOwn(this.object, key)) {
                delete this.object[key]
            }
        }

        remove(key) {
            this.delete(key)
        }

        has(key) {
            if (typeof key !== "string" && typeof key !== "number") return false
            return hasOwn(this.object, key)
        }

        // Optomizition thingy

        static blank = new ObjectType()
    }

    const dogeiscutObject = {
        Type: ObjectType,
        Block: {
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.PLUS,
            forceOutputType: "Object",
            disableMonitor: true
        },
        Argument: {
            shape: Scratch.BlockShape.PLUS,
            exemptFromNormalization: true,
            check: ["Object"]
        }
    }

    let jwArray = {
        Type: class { constructor(array) {/* noop */} static toArray(x) {/* noop */} },
        Block: {},
        Argument: {}
    }

    class Extension {
        constructor() {
            vm.runtime.registerCompiledExtensionBlocks('dogeiscutObject', this.getCompileInfo());

            vm.dogeiscutObject = dogeiscutObject

            vm.runtime.registerSerializer(
                "dogeiscutObject",
                v => {
                    if (v instanceof dogeiscutObject.Type) {
                        return {
                            entries: Object.entries(v.object).map(([key, value]) => {
                                if (typeof value === "object" && value !== null && value.customId) {
                                    return {
                                        key,
                                        customType: true,
                                        typeId: value.customId,
                                        serialized: vm.runtime.serializers[value.customId].serialize(value)
                                    };
                                }
                                return { key, value };
                            })
                        };
                    }
                    return null;
                },
                v => {
                    try {
                        const parsed = v.entries.map(entry => {
                            if (entry.customType) {
                                return [entry.key, vm.runtime.serializers[entry.typeId].deserialize(entry.serialized)];
                            }
                            return [entry.key, entry.value];
                        });
                        return new dogeiscutObject.Type(Object.fromEntries(parsed));
                    } catch {
                        return null;
                    }
                },
            );

            if (!vm.jwArray) vm.extensionManager.loadExtensionIdSync('jwArray')
            jwArray = vm.jwArray
        }

        getInfo() {
            return {
                id: 'dogeiscutObject',
                name: 'Objects',
                color1: "#f9bb58",
                blockText: "#575e75",
                menuIconURI: "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgdmlld0JveD0iMCAwIDIwIDIwIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICBzb2RpcG9kaTpkb2NuYW1lPSJvYmplY3RzLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4zICgwZTE1MGVkNmM0LCAyMDIzLTA3LTIxKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMSIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzEiCiAgICAgcGFnZWNvbG9yPSIjNTA1MDUwIgogICAgIGJvcmRlcmNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMSIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiM1MDUwNTAiCiAgICAgaW5rc2NhcGU6em9vbT0iNDIuMjQ0MTA1IgogICAgIGlua3NjYXBlOmN4PSI3Ljc3NjIzMyIKICAgICBpbmtzY2FwZTpjeT0iOS43NzY1MTIxIgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMjU2MCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMzg3IgogICAgIGlua3NjYXBlOndpbmRvdy14PSIxOTEyIgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzEiIC8+CiAgPGNpcmNsZQogICAgIHN0eWxlPSJzdHJva2Utd2lkdGg6MnB4O3BhaW50LW9yZGVyOnN0cm9rZTtmaWxsOiNmOWJiNTg7c3Ryb2tlOiNjNzk1NDY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLW9wYWNpdHk6MSIKICAgICBjeD0iMTAiCiAgICAgY3k9IjEwIgogICAgIHI9IjkiCiAgICAgaWQ9ImNpcmNsZTEiIC8+CiAgPHBhdGgKICAgICBkPSJtIDcuNzc3MzA4NCwzLjU4NTg2OTQgYyAtMC4xNTE5NTkxLDAgLTAuMjk1NjM5LDAuMDAzMDYgLTAuNDMxNjQwNiwwLjAwOTc3IC0wLjEzNjAwMTcsMC4wMDY3MSAtMC4yNjQwOTIxLDAuMDE3Mjg5IC0wLjM4NDc2NTYsMC4wMzEyNSAtMC4xMjA2NzM1LDAuMDEzOTU3IC0wLjIzMzg2OTIsMC4wMzA5NzkgLTAuMzM5ODQzOCwwLjA1MjczNCAtMC4xMDU5NzQ2LDAuMDIxNzU1IC0wLjIwNDk3LDAuMDQ4MDMzIC0wLjI5Njg3NSwwLjA3ODEyNSAtMC4wNDUzNjQsMC4wMTQzMjUgLTAuMDg5MjA3LDAuMDI5ODkgLTAuMTMyODEyNSwwLjA0Njg3NSAtMC4wNDM2MDUsMC4wMTY5ODUgLTAuMDg2OTcyLDAuMDM1MzkyIC0wLjEyODkwNjIsMC4wNTQ2ODcgLTAuMDQxOTM0LDAuMDE5Mjk1IC0wLjA4MzAxMSwwLjAzOTE5NiAtMC4xMjMwNDY5LDAuMDYwNTQ3IC0wLjA0MDAzNiwwLjAyMTM1MSAtMC4wNzkwMzIsMC4wNDQxNTEgLTAuMTE3MTg3NSwwLjA2ODM1OSAtMC4wMzgxNTUsMC4wMjQyMDggLTAuMDc1MTc1LDAuMDQ5NDUxIC0wLjExMTMyODEsMC4wNzYxNzIgLTAuMDM2MTUzLDAuMDI2NzIxIC0wLjA3MTQ0MSwwLjA1NDkyMSAtMC4xMDU0Njg4LDAuMDgzOTg0IC0wLjAzNDAyOCwwLjAyOTA2NCAtMC4wNjc3NzYsMC4wNjAzMjcgLTAuMDk5NjA5LDAuMDkxNzk3IC0wLjAzMTgzNCwwLjAzMTQ3IC0wLjA2MjI0NSwwLjA2Mzc5NCAtMC4wOTE3OTcsMC4wOTc2NTYgLTAuMDI5OCwwLjAzNDE0NiAtMC4wNTg5MjUsMC4wNjkyMjUgLTAuMDg1OTM3LDAuMTA1NDY4OCAtMC4wMjcwMTQsMC4wMzYyNDMgLTAuMDUxOTM3LDAuMDczMDY5IC0wLjA3NjE3MiwwLjExMTMyODEgLTAuMDI0MjM1LDAuMDM4MjU5IC0wLjA0Njg5NywwLjA3ODk0NyAtMC4wNjgzNTksMC4xMTkxNDA2IC0wLjAyMTQ2MywwLjA0MDE5NCAtMC4wNDE4NDksMC4wODEgLTAuMDYwNTQ3LDAuMTIzMDQ2OSAtMC4wMTg2OTgsMC4wNDIwNDYgLTAuMDM0ODI4LDAuMDg1MzY1IC0wLjA1MDc4MSwwLjEyODkwNjIgLTAuMDE1OTU0LDAuMDQzNTQxIC0wLjAzMTczMSwwLjA4NzMwNSAtMC4wNDQ5MjIsMC4xMzI4MTI1IC0wLjAxMzE5LDAuMDQ1NTA4IC0wLjAyNDc1NywwLjA5MTQwOSAtMC4wMzUxNTYsMC4xMzg2NzE5IC0wLjAxMDM5OSwwLjA0NzI2MyAtMC4wMTk2MzIsMC4wOTU4ODggLTAuMDI3MzQ0LDAuMTQ0NTMxMyB2IDAuMDAxOTUgYyAtMC4wMTM3NTMsMC4wOTI4MzYgLTAuMDI1MDcsMC4xOTYyNjAzIC0wLjAzNTE1NiwwLjMxMDU0NjkgLTAuMDEwMDg2LDAuMTE0Mjg2NCAtMC4wMTg4MTksMC4yMzg2NzQ1IC0wLjAyNTM5MSwwLjM3NSAtMC4wMDY1NywwLjEzNjMyNTUgLTAuMDEyNDE2LDAuMjg0NDA2MiAtMC4wMTU2MjUsMC40NDMzNTkzIC0wLjAwMzIxLDAuMTU4OTUzMyAtMC4wMDM5MSwwLjMyOTU0OTMgLTAuMDAzOTEsMC41MTE3MTg4IDAsMC4xMTU5NjYgLTAuMDAxNDUsMC4yMjcxNjc5IC0wLjAwNTg2LDAuMzMyMDMxMiAtMC4wMDQ0MSwwLjEwNDg2MzUgLTAuMDExMzQzLDAuMjAzMzQyMSAtMC4wMTk1MzEsMC4yOTY4NzUgLTAuMDA4MTksMC4wOTM1MzMgLTAuMDE3OTUzLDAuMTgxNjk3NiAtMC4wMjkyOTcsMC4yNjM2NzE5IC0wLjAxMTM0NCwwLjA4MTk3NSAtMC4wMjUxODgsMC4xNTgzMjc4IC0wLjAzOTA2MywwLjIyODUxNTcgLTAuMDEzODc1LDAuMDcwMTg4IC0wLjAyOTE0MiwwLjEzMzIzMzEgLTAuMDQ0OTIyLDAuMTkxNDA2MiAtMC4wMTU3OCwwLjA1ODE3MyAtMC4wMzE3NjgsMC4xMTAzMTk1IC0wLjA0ODgyOCwwLjE1NjI1IC0wLjAxNzA2LDAuMDQ1OTMxIC0wLjAzNTAyLDAuMDg1NjgxIC0wLjA1MjczNCwwLjExOTE0MDYgLTAuMDE3NzE0LDAuMDMzNDYgLTAuMDM0OTkxLDAuMDYxMjcgLTAuMDUyNzM0LDAuMDgyMDMxIHYgMC4wMDE5NSBjIC0wLjAyMjcyNSwwLjAyNTkwMSAtMC4wNDY4MjcsMC4wNTEyODYgLTAuMDcyMjY2LDAuMDc0MjE5IC0wLjAyNTQzOSwwLjAyMjkzMyAtMC4wNTE2NSwwLjA0MjU5NSAtMC4wODAwNzgsMC4wNjI1IC0wLjAyODQyOCwwLjAxOTkwNSAtMC4wNTgxNSwwLjAzOTgyNCAtMC4wODk4NDQsMC4wNTY2NDEgLTAuMDMxNjk0LDAuMDE2ODE3IC0wLjA2NjMyOCwwLjAzMTI1MyAtMC4xMDE1NjI1LDAuMDQ0OTIyIC0wLjAzNTIzNSwwLjAxMzY2OSAtMC4wNzIyNzcsMC4wMjY2NDkgLTAuMTExMzI4MSwwLjAzNzEwOSAtMC4wMzkwNTEsMC4wMTA0NjEgLTAuMDc5OTAzLDAuMDE4MTk3IC0wLjEyMzA0NjgsMC4wMjUzOTEgLTAuMDQzMTQ0LDAuMDA3MTkgLTAuMDg3MjU0LDAuMDEzNzEyIC0wLjEzNDc2NTcsMC4wMTc1NzggLTAuMDQ3NTEyLDAuMDAzODcgLTAuMDk4MjM0LDAuMDA1MzggLTAuMTUwMzkwNiwwLjAwNTg2IGwgLTAuMjQ4MDQ2OSwwLjAwMTk1IHYgMi4wMjkyOTc3IGwgMC4yNDAyMzQ0LDAuMDA3OCBjIDAuMDU0OTc5LDAuMDAyIDAuMTA3MjY1LDAuMDA1MSAwLjE1NjI1LDAuMDA5OCAwLjA0ODk4NSwwLjAwNDcgMC4wOTU0ODMsMC4wMTA0NyAwLjEzODY3MTksMC4wMTc1OCAwLjA0MzE4OSwwLjAwNzEgMC4wODM1MDQsMC4wMTYxOCAwLjEyMTA5MzcsMC4wMjUzOSAwLjAzNzU5LDAuMDA5MiAwLjA3MTMyNywwLjAxODMgMC4xMDM1MTU2LDAuMDI5MyAwLjAzMjE4OCwwLjAxMSAwLjA2Mjg1OSwwLjAyMjY4IDAuMDg5ODQ0LDAuMDM1MTYgMC4wMjY5ODQsMC4wMTI0OCAwLjA1MDI4OCwwLjAyNzM4IDAuMDcyMjY2LDAuMDQxMDEgMC4wMjE5NzgsMC4wMTM2NSAwLjA0MTQyNiwwLjAyNjUgMC4wNTg1OTQsMC4wNDEwMiAwLjAxNzE2OCwwLjAxNDUxIDAuMDMyMzY2LDAuMDI5ODUgMC4wNDQ5MjIsMC4wNDQ5MiBoIDAuMDAxOTUgdiAwLjAwMiBjIDAuMDM3MDE3LDAuMDQzNSAwLjA3MDkxOSwwLjA4NzgxIDAuMTAxNTYyNSwwLjEzMjgxMyAwLjAzMDY0MywwLjA0NSAwLjA1NzU3OCwwLjA4OTg5IDAuMDgyMDMxLDAuMTM2NzE4IDAuMDI0NDU0LDAuMDQ2ODMgMC4wNDYwMDQsMC4wOTU1NyAwLjA2NDQ1MywwLjE0NDUzMiAwLjAxODQ0OSwwLjA0ODk2IDAuMDM0MjQ2LDAuMDk4OTcgMC4wNDY4NzUsMC4xNTAzOSAwLjAxMDg0OSwwLjA0NDE3IDAuMDIxNTI2LDAuMTEzMDgzIDAuMDMxMjUsMC4yMDUwNzggMC4wMDk3MiwwLjA5MiAwLjAxNzg0OSwwLjIwNzA2MSAwLjAyNTM5MSwwLjM0Mzc1IDAuMDA3NTQsMC4xMzY2OTEgMC4wMTUyMzEsMC4yOTQ0MDQgMC4wMTk1MzEsMC40NzI2NTcgMC4wMDQzLDAuMTc4MjUxIDAuMDA1ODYsMC4zNzcwNjcgMC4wMDU4NiwwLjU5Mzc1IDAsMC4yMDIxODggMC4wMDU0LDAuMzkwMjYyIDAuMDE1NjI1LDAuNTY2NDA2IDAuMDA1MTEsMC4wODgwNyAwLjAxMTU5OCwwLjE3NDA4MyAwLjAxOTUzMSwwLjI1NTg1OSAwLjAwNzkzLDAuMDgxNzggMC4wMTY0MTYsMC4xNjA3MDMgMC4wMjczNDQsMC4yMzYzMjggMC4wMTA5MjcsMC4wNzU2MiAwLjAyMzAxMywwLjE0NzE4IDAuMDM3MTA5LDAuMjE2Nzk3IDAuMDE0MDk2LDAuMDY5NjIgMC4wMzEzODksMC4xMzc0MTggMC4wNDg4MjgsMC4yMDExNzIgMC4wMTc0MzksMC4wNjM3NSAwLjAzNTY4NCwwLjEyMzYwNiAwLjA1NjY0MSwwLjE4MTY0MSAwLjAyMDk1NywwLjA1ODAzIDAuMDQzNzExLDAuMTEzNTU2IDAuMDY4MzU5LDAuMTY2MDE1IDAuMDIzODg3LDAuMDUwODQgMC4wNTAxNCwwLjEwMDc4IDAuMDc4MTI1LDAuMTQ4NDM4IDAuMDI3OTg1LDAuMDQ3NjYgMC4wNTc5MDEsMC4wOTIzNyAwLjA4OTg0NCwwLjEzNjcxOSAwLjAzMTk0MywwLjA0NDM1IDAuMDY1ODAzLDAuMDg3OTggMC4xMDE1NjI1LDAuMTI4OTA2IDAuMDM1NzYsMC4wNDA5MiAwLjA3Mzg0NCwwLjA3OTgyIDAuMTEzMjgxMywwLjExNzE4NyAwLjAzOTQzNywwLjAzNzM2IDAuMDgwMDc0LDAuMDczNzQgMC4xMjMwNDY5LDAuMTA3NDIyIDAuMDQyOTczLDAuMDMzNjggMC4wODgzOTYsMC4wNjM4OCAwLjEzNDc2NTYsMC4wOTM3NSAwLjA0NjM2OSwwLjAyOTg3IDAuMDkyOTUzLDAuMDU4MDUgMC4xNDI1NzgxLDAuMDgzOTggMC4wNDk2MjUsMC4wMjU5MyAwLjEwMTU1NjgsMC4wNTA0IDAuMTU0Mjk2OSwwLjA3MjI3IDAuMDUyODU4LDAuMDIyNDggMC4xMDcwMzcsMC4wNDMyMSAwLjE2NDA2MjUsMC4wNjI1IDAuMDU3MDI2LDAuMDE5MjkgMC4xMTY0NzkyLDAuMDM2NTQgMC4xNzc3MzQ0LDAuMDUyNzMgMC4wNjEyNTUsMC4wMTYyMSAwLjEyNTg1ODksMC4wMzE2OSAwLjE5MTQwNjIsMC4wNDQ5MiAwLjA2NTU0OCwwLjAxMzI0IDAuMTMzMjIzMiwwLjAyNDc4IDAuMjAzMTI1LDAuMDM1MTYgMC4wNjk5MDIsMC4wMTAzNyAwLjE0MjY0MzksMC4wMTk5NSAwLjIxNjc5NjksMC4wMjczNCAwLjA3NDE1MywwLjAwNzQgMC4xNDk3MTgxLDAuMDEyNjEgMC4yMjg1MTU2LDAuMDE3NTggMC4xNTc1OTUyLDAuMDA5OSAwLjMyNDExNDgsMC4wMTU2MyAwLjUsMC4wMTU2MyBoIDAuNTgzOTkgdiAtMi4wMzkxMzIgaCAtMC4yNSBjIC0wLjEyNjY4MjMsMCAtMC4yNDEyOTY0LC0wLjAwNTcgLTAuMzQzNzUsLTAuMDEzNjcgLTAuMTAyNDUzNywtMC4wMDggLTAuMTkzMDI2NiwtMC4wMTc4NSAtMC4yNjc1NzgxLC0wLjAyOTMgLTAuMDc0NTUyLC0wLjAxMTQ1IC0wLjEzNDc1ODYsLTAuMDI0NyAtMC4xNzc3MzQ0LC0wLjAzNTE2IC0wLjA0Mjk3NiwtMC4wMTA0NiAtMC4wNjg0NDUsLTAuMDE4NDQgLTAuMDc2MTcyLC0wLjAyMzQ0IGggLTAuMDAxOTUgbCAtMC4wMDE5NSwtMC4wMDIgYyAtMC4wMjIyNjgsLTAuMDEzNzQgLTAuMDQxNTA3LC0wLjAyNzM0IC0wLjA1ODU5NCwtMC4wNDI5NyAtMC4wMTcwODYsLTAuMDE1NjMgLTAuMDMyMTUyLC0wLjAzMzcyIC0wLjA0NDkyMiwtMC4wNTI3NCAtMC4wMTI3NywtMC4wMTkwMiAtMC4wMjM4ODUsLTAuMDQwNTQgLTAuMDMzMjAzLC0wLjA2NDQ1IC0wLjAwOTMyLC0wLjAyMzkxIC0wLjAxNjcwNywtMC4wNDk3NiAtMC4wMjM0MzcsLTAuMDgwMDggbCAtMC4wOTM3NSwtMS44MzAwNzggYyAtMC4wMDc3NiwtMC4xNTYyNDEgLTAuMDE5OTIzLC0wLjMwNTExMSAtMC4wMzcxMDksLTAuNDQ1MzEzIC0wLjAwODU5LC0wLjA3MDEgLTAuMDE4MTczLC0wLjEzNjk5NCAtMC4wMjkyOTcsLTAuMjAzMTI1IC0wLjAxMTEyNCwtMC4wNjYxMyAtMC4wMjMzMzksLTAuMTMxMTczIC0wLjAzNzEwOSwtMC4xOTMzNTkgLTAuMDEzNzcsLTAuMDYyMTkgLTAuMDMwMzQzLC0wLjEyMTQyMSAtMC4wNDY4NzUsLTAuMTc5Njg3IC0wLjAxNjUzMywtMC4wNTgyNyAtMC4wMzMzMjQsLTAuMTE1NTQ4IC0wLjA1MjczNCwtMC4xNjk5MjIgLTAuMDE5NDEsLTAuMDU0MzggLTAuMDQwMDk2LC0wLjEwNTc0MiAtMC4wNjI1LC0wLjE1NjI1IC0wLjAyMjQwNCwtMC4wNTA1MSAtMC4wNDY3NTMsLTAuMDk5ODIgLTAuMDcyMjY2LC0wLjE0NjQ4NSAtMC4wMTg2ODcsLTAuMDM0OTMgLTAuMDQwMTQsLTAuMDY4NTkgLTAuMDYyNSwtMC4xMDE1NjIgLTAuMDIyMzY3LC0wLjAzMjkxIC0wLjA0NDc2NywtMC4wNjQzOCAtMC4wNzAzMiwtMC4wOTU2NCBDIDYuNDY2NDI5MiwxMC40NDcyMjQgNi40MDg2MTQ2LDEwLjM4NzI1MSA2LjM0NzYyMDksMTAuMzMwMDEgNi4yODY2MjcyLDEwLjI3Mjc3IDYuMjIxMjk4MiwxMC4yMTc5NzMgNi4xNTQyNjE1LDEwLjE2Mzk5NSA2LjA4NzIyNDksMTAuMTEwMDE1IDYuMDE4NDE4NSwxMC4wNTY1ODcgNS45NDkxODM0LDEwLjAwMzgzOCA2LjAyMDE4MDEsOS45NDk3NjgxIDYuMDkwMTU2LDkuODk2NDk2MyA2LjE1ODE2NzgsOS44NDE3Mjg4IDYuMjI2MTc5NSw5Ljc4Njk2MTEgNi4yOTI3MDQyLDkuNzMwNDE4MyA2LjM1MzQ4MDMsOS42NzM3NiA2LjQxNDI1NjQsOS42MTcxMDE4IDYuNDcwMjA2MSw5LjU1OTY3NDUgNi41MTk0OTU5LDkuNDk5OTMxOSBjIDAuMDI0NjQ1LC0wLjAyOTg3MSAwLjA0NzM4NCwtMC4wNjA5MyAwLjA2ODM1OSwtMC4wOTE3OTcgMC4wMjA5NzYsLTAuMDMwODY2IDAuMDM5ODY0LC0wLjA2MTczOSAwLjA1NjY0MSwtMC4wOTM3NSBDIDYuNjg1MTM2OSw5LjIzNzc0ODkgNi43MjI0MTU5LDkuMTYwNjUzIDYuNzU1ODI0LDkuMDgxOTYzMiA2Ljc4OTIzMiw5LjAwMzI3MzIgNi44MTk2Nyw4LjkyMjM2NTggNi44NDU2NjgsOC44NDE3Mjg4IDYuODcxNjY2LDguNzYxMDkxOCA2Ljg5MzY2NSw4LjY4MDA2NTQgNi45MTIwNzQsOC41OTc1ODgyIGMgMC4wMTg0MDksLTAuMDgyNDc4IDAuMDMyMzI3LC0wLjE2NTc4OTEgMC4wNDI5NjksLTAuMjUgdiAtMC4wMDM5MSBDIDYuOTY2NzY1LDguMjU4ODY1MiA2Ljk3ODM1LDguMTU0NzUwOSA2Ljk4ODI0Niw4LjAyOTIyNTEgNi45OTgxNDYsNy45MDM2OTkyIDcuMDA3MTg2LDcuNzU3NTM2NCA3LjAxNTU5LDcuNTg5NzcxOSA3LjAzMjM5Nyw3LjI1NDI0MzIgNy4wNDU3MTgsNi44MzE5MjQ2IDcuMDU4NTU5LDYuMzE4Mjg3NiB2IC0wLjAwMTk1IGMgMC4wMDE5NywtMC4wODU4NzMgMC4wMDg3OCwtMC4xNjMyNTcxIDAuMDE3NTc4LC0wLjIzMDQ2ODcgMC4wMDg4LC0wLjA2NzIxMiAwLjAxODg0OSwtMC4xMjMzNTM1IDAuMDMxMjUsLTAuMTcxODc1IDAuMDEyNDAxLC0wLjA0ODUyMiAwLjAyNjI4LC0wLjA4OTMzOCAwLjAzOTA2MywtMC4xMTkxNDA2IDAuMDEyNzgzLC0wLjAyOTgwMyAwLjAyNTIxMywtMC4wNDk0OTIgMC4wMzUxNTYsLTAuMDYwNTQ3IGggMC4wMDE5NSBjIC0wLjAwNDQzLDAuMDA0ODIgMC4wMTM3NTYsLTAuMDA1NyAwLjA1MjczNCwtMC4wMjE0ODQgMC4wMTk0OSwtMC4wMDc4OSAwLjA0NDE0OCwtMC4wMTY1NTQgMC4wNzQyMTksLTAuMDI1MzkxIDAuMDMwMDcsLTAuMDA4ODQgMC4wNjQ5OTksLTAuMDE4NDEzIDAuMTA1NDY4OCwtMC4wMjUzOTEgMC4wODE1NiwtMC4wMTQwNjIgMC4xODE2MDYxLC0wLjAyNDAyMyAwLjI5ODgyODEsLTAuMDMxMjUgMC4xMTcyMjIxLC0wLjAwNzIzIDAuMjUxNjI0MSwtMC4wMTE3MTkgMC40MDIzNDM4LC0wLjAxMTcxOSBoIDAuMjUgViAzLjU4NTg2OTQgWiBtIDMuODU1NDY4NiwwIHYgMi4wMzMyMDMxIGggMC4yNSBjIDAuMTMwNjQ3LDAgMC4yNDgyNDMsMC4wMDE3IDAuMzUxNTYzLDAuMDA1ODYgMC4xMDMzMiwwLjAwNDE2IDAuMTkyMzY2LDAuMDEwNzk2IDAuMjY3NTc4LDAuMDE5NTMxIDAuMDc1MjEsMC4wMDg3MyAwLjEzNjc3NywwLjAyMjA4OSAwLjE3OTY4OCwwLjAzMzIwMyAwLjA0MjkxLDAuMDExMTE0IDAuMDY3MTcsMC4wMTk5ODkgMC4wNjY0MSwwLjAxOTUzMSBsIDAuMDAyLDAuMDAxOTUgYyAwLjAyNDMsMC4wMTQxMDggMC4wNDM4NSwwLjAyODIyNyAwLjA2MDU1LDAuMDQxMDE2IDAuMDE2NywwLjAxMjc4OCAwLjAzMDQ1LDAuMDIzNzMzIDAuMDQxMDEsMC4wMzUxNTYgMC4wMjExNSwwLjAyMjg0NyAwLjAzMTYzLDAuMDQzNDMyIDAuMDM3MTEsMC4wNjA1NDcgLTAuMDAyOCwtMC4wMDg4MSAwLjAwMzYsMC4wMjQ1ODcgMC4wMTE3MiwwLjA4NTkzNyAwLjAwODIsMC4wNjEzNTEgMC4wMTgwOSwwLjE1MDY2MTcgMC4wMjUzOSwwLjI1MzkwNjIgMC4wMTQ2LDAuMjA2NDg5NSAwLjAyODI1LDAuNDk1MDYyNCAwLjA0MTAyLDAuODYzMjgxMyAwLjAwNjUsMC4xODUwNzg2IDAuMDExODUsMC4zNTU3MjQ2IDAuMDE5NTMsMC41MTE3MTg3IDAuMDA3NywwLjE1NTk5NDIgMC4wMTc2NSwwLjI5NzMzOTUgMC4wMjczNCwwLjQyNTc4MTMgMC4wMDk3LDAuMTI4NDQxNyAwLjAyMTM2LDAuMjQzODA0IDAuMDMzMiwwLjM0NTcwMzEgMC4wMTE4NCwwLjEwMTg5OTEgMC4wMjQ3MSwwLjE5MTAzNzggMC4wMzkwNiwwLjI2NzU3ODIgMC4wMTQyNCwwLjA3NDc5MiAwLjAzMTc1LDAuMTQ4MTkxNSAwLjA1Mjc0LDAuMjIwNzAzMSAwLjAyMDk4LDAuMDcyNTEyIDAuMDQ0NjcsMC4xNDQ4NTY4IDAuMDcyMjYsMC4yMTQ4NDM3IDAuMDI3NTksMC4wNjk5ODcgMC4wNTk2OCwwLjEzNzg2MDYgMC4wOTM3NSwwLjIwNTA3ODIgMC4wMzQwNywwLjA2NzIxOCAwLjA3MDksMC4xMzMwNjIgMC4xMTEzMjksMC4xOTcyNjU2IDAuMDMyMjQsMC4wNTExOTYgMC4wNzE5NywwLjEwMTUzMDkgMC4xMTcxODcsMC4xNTAzOTA2IDAuMDQ1MjIsMC4wNDg4NiAwLjA5NjA1LDAuMDk3MjExIDAuMTUwMzkxLDAuMTQ0NTMxMyAwLjA1NDM0LDAuMDQ3MzIgMC4xMTIyOTIsMC4wOTQwNDggMC4xNzE4NzUsMC4xNDA2MjUgMC4wNTk1OCwwLjA0NjU3NyAwLjEyMDY4NiwwLjA5MjA0IDAuMTgxNjQsMC4xMzg2NzIyIC0wLjA1OTA1LDAuMDQzOTIgLTAuMTE5NDkzLDAuMDg4NDcgLTAuMTc3NzM0LDAuMTMyODEzIC0wLjA1ODI0LDAuMDQ0MzQgLTAuMTE0MTM2LDAuMDg4MTUgLTAuMTY3OTY5LDAuMTM0NzY1IC0wLjA1MzgzLDAuMDQ2NjIgLTAuMTA0NTY3LDAuMDk1NzQgLTAuMTUwMzksMC4xNDY0ODUgLTAuMDIyOTEsMC4wMjUzNyAtMC4wNDQyMiwwLjA1MTM2IC0wLjA2NDQ1LDAuMDc4MTMgLTAuMDIwMjMsMC4wMjY3NSAtMC4wMzk1NCwwLjA1MzY3IC0wLjA1NjY0LDAuMDgyMDMgbCAtMC4wMDIsMC4wMDIgYyAtMC4wNDMyOCwwLjA3MzY5IC0wLjA4MjgsMC4xNDk2MDggLTAuMTE5MTQxLDAuMjI2NTYzIC0wLjAzNjM0LDAuMDc2OTUgLTAuMDcwMjcsMC4xNTQ0MzYgLTAuMDk5NjEsMC4yMzQzNzUgLTAuMDI5MzQsMC4wNzk5NCAtMC4wNTM5LDAuMTYxNDk3IC0wLjA3NjE3LDAuMjQ0MTQgLTAuMDIyMjgsMC4wODI2NCAtMC4wNDE0OSwwLjE2Njg4NCAtMC4wNTY2NCwwLjI1MTk1MyB2IDAuMDAyIGMgLTAuMDE0NTMsMC4wODcxNiAtMC4wMjcxOCwwLjE5NTEyNiAtMC4wMzkwNiwwLjMyNjE3MiAtMC4wMTE4OCwwLjEzMTA0NyAtMC4wMjM1NSwwLjI4NTk4NSAtMC4wMzMyLDAuNDYyODkxIC0wLjAwOTcsMC4xNzY5MDQgLTAuMDE3NTUsMC4zNzY4MjQgLTAuMDI1MzksMC42MDE1NjIgLTAuMDA3OCwwLjIyNDczOSAtMC4wMTUwNCwwLjQ3MzUwMSAtMC4wMjE0OCwwLjc0ODA0NyAtMC4wMDIsMC4wODc4MiAtMC4wMDc5LDAuMTY0OTA1IC0wLjAxNzU4LDAuMjMyNDIyIC0wLjAwOTcsMC4wNjc1MiAtMC4wMjMyOSwwLjEyNjAzOCAtMC4wMzcxMSwwLjE3MzgyOCAtMC4wMTM4MiwwLjA0Nzc5IC0wLjAyODY4LDAuMDg0NjQgLTAuMDQyOTcsMC4xMTMyODIgLTAuMDE0MjksMC4wMjg2NCAtMC4wMjc5NCwwLjA0ODUyIC0wLjAzOTA2LDAuMDU4NTkgdiAwLjAwMiBoIC0wLjAwMzkgYyA4Ljk4ZS00LC04LjVlLTQgLTAuMDIxMTgsMC4wMTE0OSAtMC4wNjI1LDAuMDI3MzQgLTAuMDIwNjYsMC4wMDc5IC0wLjA0NTY3LDAuMDE2ODQgLTAuMDc2MTcsMC4wMjUzOSAtMC4wMzA1MSwwLjAwODUgLTAuMDY1NiwwLjAxNjY0IC0wLjEwNTQ2OSwwLjAyMzQ0IC0wLjA3OTc1LDAuMDEzNjEgLTAuMTc2MTIyLDAuMDIzOTEgLTAuMjg5MDYzLDAuMDMxMjUgLTAuMTEyOTQsMC4wMDczIC0wLjI0MjQ1MSwwLjAxMTcyIC0wLjM4NjcxOCwwLjAxMTcyIGggLTAuMjUgdiAyLjAzOTA2MiBoIDAuNTg5ODQzIGMgMC4xNTIxNjIsMCAwLjI5NTQzMywtMC4wMDMxIDAuNDMxNjQxLC0wLjAwOTggMC4xMzYyMDgsLTAuMDA2NyAwLjI2NTg2MywtMC4wMTczMSAwLjM4NjcxOSwtMC4wMzEyNSAwLjEyMDg1NCwtMC4wMTM5NCAwLjIzMzc0LC0wLjAzMDk2IDAuMzM5ODQ0LC0wLjA1MjczIDAuMTA2MTAyLC0wLjAyMTc3IDAuMjA0OTIxLC0wLjA0Nzk1IDAuMjk2ODc1LC0wLjA3ODEzIDAuMDQ1MzYsLTAuMDE0MzIgMC4wOTExNCwtMC4wMjk4OSAwLjEzNDc2NSwtMC4wNDY4NyAwLjA0MzYzLC0wLjAxNjk5IDAuMDg1MTEsLTAuMDM1MzkgMC4xMjY5NTMsLTAuMDU0NjkgMC4wNDE4NCwtMC4wMTkyOSAwLjA4Mjk2LC0wLjAzOTIgMC4xMjMwNDcsLTAuMDYwNTUgMC4wNDAwOSwtMC4wMjEzNSAwLjA3OTE1LC0wLjA0NDE1IDAuMTE3MTg4LC0wLjA2ODM2IDAuMDM4MDMsLTAuMDI0MjEgMC4wNzU2MSwtMC4wNDk0NSAwLjExMTMyOCwtMC4wNzYxNyAwLjAzNTcyLC0wLjAyNjcyIDAuMDY5NTgsLTAuMDU0OTIgMC4xMDM1MTUsLTAuMDgzOTggMC4wMzM5NCwtMC4wMjkwNiAwLjA2NzgzLC0wLjA2MDMzIDAuMDk5NjEsLTAuMDkxOCAwLjAzMTc4LC0wLjAzMTQ3IDAuMDYyMjQsLTAuMDYzOCAwLjA5MTgsLTAuMDk3NjYgMC4wMjk4MiwtMC4wMzQxNyAwLjA1ODk2LC0wLjA2OTE2IDAuMDg1OTQsLTAuMTA1NDY4IDAuMDI2OTgsLTAuMDM2MzEgMC4wNTIwNCwtMC4wNzI5OCAwLjA3NjE3LC0wLjExMTMyOCAwLjAyNDE0LC0wLjAzODM1IDAuMDQ3MDYsLTAuMDc4ODQgMC4wNjgzNiwtMC4xMTkxNDEgMC4wMjEzLC0wLjA0MDMgMC4wNDAxMywtMC4wODA4OSAwLjA1ODU5LC0wLjEyMzA0NyAwLjAxODQ2LC0wLjA0MjE2IDAuMDM1MTUsLTAuMDg0OTggMC4wNTA3OCwtMC4xMjg5MDYgMC4wMTU2MywtMC4wNDM5MiAwLjAzMDE2LC0wLjA4OTE3IDAuMDQyOTcsLTAuMTM0NzY2IDAuMDEyODEsLTAuMDQ1NiAwLjAyNTAxLC0wLjA5MTQzIDAuMDM1MTYsLTAuMTM4NjcyIDAuMDEwMTUsLTAuMDQ3MjQgMC4wMTgyMywtMC4wOTU4OCAwLjAyNTM5LC0wLjE0NDUzMSB2IC0wLjAwMiBjIDAuMDEzNzMsLTAuMDkyODYgMC4wMjcwMywtMC4xOTU5NjkgMC4wMzcxMSwtMC4zMTA1NDcgMC4wMTAwOCwtMC4xMTQ1NzggMC4wMTY4NiwtMC4yNDAxMTQgMC4wMjM0NCwtMC4zNzY5NTMgMC4wMDY2LC0wLjEzNjg0MSAwLjAxNDM2LC0wLjI4NTY2IDAuMDE3NTgsLTAuNDQ1MzEzIDAuMDAzMiwtMC4xNTk2NTEgMC4wMDIsLTAuMzMwNjU5IDAuMDAyLC0wLjUxMzY3MSAwLC0wLjExNTAwNiAwLjAwMzQsLTAuMjI0MTE1IDAuMDA3OCwtMC4zMjgxMjUgMC4wMDQ0LC0wLjEwNDAxMiAwLjAxMTM4LC0wLjIwMjEyOSAwLjAxOTUzLC0wLjI5NDkyMiAwLjAwODEsLTAuMDkyOCAwLjAxNzk5LC0wLjE4MDM2NiAwLjAyOTMsLTAuMjYxNzE5IDAuMDExMywtMC4wODEzNSAwLjAyNTIyLC0wLjE1Njg3NCAwLjAzOTA2LC0wLjIyNjU2MyAwLjAxMzg0LC0wLjA2OTY5IDAuMDI3MiwtMC4xMzM2MDYgMC4wNDI5NywtMC4xOTE0MDYgMC4wMTU3NywtMC4wNTc4IDAuMDMzNywtMC4xMTA1NjMgMC4wNTA3OCwtMC4xNTYyNSAwLjAxNzA4LC0wLjA0NTY5IDAuMDM0OTYsLTAuMDgzODQgMC4wNTI3NCwtMC4xMTcxODcgMC4wMTc3OCwtMC4wMzMzNSAwLjAzNDg3LC0wLjA2MTI0IDAuMDUyNzMsLTAuMDgyMDMgMC4wMjI4LC0wLjAyNjU0IDAuMDQ2NzksLTAuMDUwNzggMC4wNzIyNywtMC4wNzQyMiAwLjAyNTQ3LC0wLjAyMzQ0IDAuMDUxNjUsLTAuMDQ2MTEgMC4wODAwOCwtMC4wNjY0MSAwLjAyODQzLC0wLjAyMDMgMC4wNjAxMiwtMC4wMzk1MyAwLjA5MTgsLTAuMDU2NjQgMC4wMzE2NywtMC4wMTcxMSAwLjA2NDQxLC0wLjAzMyAwLjA5OTYxLC0wLjA0Njg3IDAuMDM1MiwtMC4wMTM4OCAwLjA3MjMxLC0wLjAyNDU2IDAuMTExMzI4LC0wLjAzNTE2IDAuMDM5MDIsLTAuMDEwNiAwLjA3OTkyLC0wLjAyMDA4IDAuMTIzMDQ3LC0wLjAyNzM0IDAuMDQzMTMsLTAuMDA3MyAwLjA4NzI0LC0wLjAxMzY4IDAuMTM0NzY2LC0wLjAxNzU4IDAuMDQ3NTIsLTAuMDAzOSAwLjA5ODE5LC0wLjAwNTQgMC4xNTAzOSwtMC4wMDU5IGwgMC4yNDgwNDcsLTAuMDAyIFYgMTAuNzY5NDYzIDguOTg4MjEzMiBsIC0wLjI0MDIzNCwtMC4wMDc4MSBjIC0wLjA1Mzk5LC0wLjAwMTk4IC0wLjEwNjIwMiwtMC4wMDUxNCAtMC4xNTQyOTcsLTAuMDA5NzcgLTAuMDQ4MSwtMC4wMDQ2MyAtMC4wOTIwNywtMC4wMTA3MjUgLTAuMTM0NzY2LC0wLjAxNzU3OCAtMC4wNDI2OSwtMC4wMDY4NSAtMC4wODM2MSwtMC4wMTQ1OCAtMC4xMjEwOTMsLTAuMDIzNDM3IC0wLjAzNzQ4LC0wLjAwODg2IC0wLjA3MTUzLC0wLjAxODg0NSAtMC4xMDM1MTYsLTAuMDI5Mjk3IC0wLjAzMTk5LC0wLjAxMDQ1MSAtMC4wNjI3OSwtMC4wMjE0MzIgLTAuMDg5ODQsLTAuMDMzMjAzIC0wLjAyNzA2LC0wLjAxMTc3MSAtMC4wNTAzOCwtMC4wMjQzMzMgLTAuMDcyMjYsLTAuMDM3MTA5IC0wLjAyMTg5LC0wLjAxMjc3NyAtMC4wMzk1OCwtMC4wMjU2IC0wLjA1NjY0LC0wLjAzOTA2MyAtMC4wMTcwNiwtMC4wMTM0NjIgLTAuMDMyNTQsLTAuMDI3MTg2IC0wLjA0NDkyLC0wLjA0MTAxNiAtMC4wMzU4MiwtMC4wNDI0NzEgLTAuMDY5NDIsLTAuMDg0OTQ3IC0wLjA5OTYxLC0wLjEyODkwNjIgLTAuMDMwMTksLTAuMDQzOTU5IC0wLjA1NzI3LC0wLjA4OTE0NiAtMC4wODIwMywtMC4xMzQ3NjU2IC0wLjAyNDc2LC0wLjA0NTYyIC0wLjA0Njg2LC0wLjA5MzE3IC0wLjA2NjQxLC0wLjE0MDYyNSAtMC4wMTk1NSwtMC4wNDc0NTQgLTAuMDM2MjQsLTAuMDk1MDY5IC0wLjA1MDc4LC0wLjE0NDUzMTIgLTAuMDEwNjcsLTAuMDM5MTM4IC0wLjAyMTAxLC0wLjEwNTk0MjQgLTAuMDMxMjUsLTAuMTk3MjY1NiAtMC4wMTAyNCwtMC4wOTEzMjQgLTAuMDIwOTgsLTAuMjA3OTI5IC0wLjAyOTMsLTAuMzQ3NjU2MyAtMC4wMDgzLC0wLjEzOTcyNzMgLTAuMDE0NjMsLTAuMzAxOTc4NSAtMC4wMTk1MywtMC40ODYzMjgxIC0wLjAwNDksLTAuMTg0MzQ5NyAtMC4wMDc4LC0wLjM5MDA0MzkgLTAuMDA3OCwtMC42MTUyMzQ0IDAsLTAuMjAyMTg4OCAtMC4wMDU0LC0wLjM5MDI2MzEgLTAuMDE1NjMsLTAuNTY2NDA2MyAtMC4wMDUxLC0wLjA4ODA3MiAtMC4wMTE2LC0wLjE3NDA4MzIgLTAuMDE5NTMsLTAuMjU1ODU5MyAtMC4wMDc5LC0wLjA4MTc3NiAtMC4wMTY0MiwtMC4xNjA3MDM0IC0wLjAyNzM0LC0wLjIzNjMyODIgLTAuMDEwOTMsLTAuMDc1NjI1IC0wLjAyMzAxLC0wLjE0NzE3OTYgLTAuMDM3MTEsLTAuMjE2Nzk2OCAtMC4wMTQxLC0wLjA2OTYxOCAtMC4wMzEzOSwtMC4xMzc0MTgyIC0wLjA0ODgzLC0wLjIwMTE3MTkgLTAuMDE3NDQsLTAuMDYzNzU0IC0wLjAzNTY4LC0wLjEyMzYwNjQgLTAuMDU2NjQsLTAuMTgxNjQwNiAtMC4wMjA5NiwtMC4wNTgwMzQgLTAuMDQzNzEsLTAuMTEzNTU2OSAtMC4wNjgzNiwtMC4xNjYwMTU3IC0wLjAyMzg5LC0wLjA1MDgzNiAtMC4wNTAxMywtMC4xMDA3Nzk2IC0wLjA3ODEzLC0wLjE0ODQzNzUgLTAuMDI3OTksLTAuMDQ3NjU4IC0wLjA1NzksLTAuMDkyMzY1IC0wLjA4OTg0LC0wLjEzNjcxODcgLTAuMDMxOTQsLTAuMDQ0MzUzIC0wLjA2NTgsLTAuMDg3OTg0IC0wLjEwMTU2MiwtMC4xMjg5MDYzIEMgMTQuNTM2NTYyLDQuMjc1NDEzNSAxNC40OTg0ODIsNC4yMzY1MTQ1IDE0LjQ1OTA0LDQuMTk5MTQ5IDE0LjQxOTYsNC4xNjE3ODQgMTQuMzc4OTcsNC4xMjU0MDggMTQuMzM1OTkzLDQuMDkxNzI3MiBjIC0wLjA0Mjk3LC0wLjAzMzY4MSAtMC4wODg0LC0wLjA2Mzg3OSAtMC4xMzQ3NjUsLTAuMDkzNzUgLTAuMDQ2MzcsLTAuMDI5ODcxIC0wLjA5Mjk1LC0wLjA1ODA1IC0wLjE0MjU3OCwtMC4wODM5ODQgLTAuMDQ5NjMsLTAuMDI1OTM0IC0wLjEwMTU1NywtMC4wNTAzOTUgLTAuMTU0Mjk3LC0wLjA3MjI2NiBoIC0wLjAwMzkgYyAtMC4wNTI4MywtMC4wMjI0MjUgLTAuMTA3MDg2LC0wLjA0MzI0IC0wLjE2NDA2MywtMC4wNjI1IC0wLjA1Njk4LC0wLjAxOTI2IC0wLjExNjU0NiwtMC4wMzY1MzYgLTAuMTc3NzM0LC0wLjA1MjczNCAtMC4wNjExOSwtMC4wMTYxOTggLTAuMTIzOTg2LC0wLjAzMTY4MiAtMC4xODk0NTMsLTAuMDQ0OTIyIC0wLjA2NTQ3LC0wLjAxMzI0IC0wLjEzMzMxNSwtMC4wMjQ3NzEgLTAuMjAzMTI1LC0wLjAzNTE1NiAtMC4wNjk4MSwtMC4wMTAzODUgLTAuMTQwNjQzLC0wLjAxOTk1NiAtMC4yMTQ4NDQsLTAuMDI3MzQ0IC0wLjA3NDIsLTAuMDA3MzkgLTAuMTUxNzczLC0wLjAxMjU5MyAtMC4yMzA0NjksLTAuMDE3NTc4IC0wLjE1NzM5MiwtMC4wMDk5NyAtMC4zMjQzMTUsLTAuMDE1NjI1IC0wLjUsLTAuMDE1NjI1IHoiCiAgICAgc3R5bGU9Ii1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246SW1wYWN0O2ZpbGw6I2ZmZmZmZiIKICAgICBpZD0icGF0aDYiIC8+Cjwvc3ZnPgo=",
                blocks: [
                    {
                        opcode: 'blank',
                        text: 'blank object',
                        ...dogeiscutObject.Block
                    },
                    {
                        opcode: 'parse',
                        text: 'parse [VALUE] as object',
                        ...dogeiscutObject.Block,
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "{\"foo\": \"bar\"}",
                                exemptFromNormalization: true
                            }
                        }
                    },
                    // can litterally just use a blank (set foo in () to bar)
                    // {
                    //     opcode: 'keyValue',
                    //     text: 'key [KEY] value [VALUE]',
                    //     ...dogeiscutObject.Block,
                    //     arguments: {
                    //         KEY: {
                    //             type: Scratch.ArgumentType.STRING,
                    //             defaultValue: "foo",
                    //             exemptFromNormalization: true
                    //         },
                    //         VALUE: {
                    //             type: Scratch.ArgumentType.STRING,
                    //             defaultValue: "bar",
                    //             exemptFromNormalization: true
                    //         }
                    //     }
                    // },
                    {
                        opcode: 'fromEntries',
                        text: 'from entries [ARRAY]',
                        ...dogeiscutObject.Block,
                        arguments: {
                            ARRAY: jwArray.Argument
                        }
                    },
                    '---',
                    {
                        opcode: 'currentObject',
                        text: 'current object',
                        hideFromPalette: true,
                        canDragDuplicate: true,
                        ...dogeiscutObject.Block,
                    },
                    {
                        opcode: 'builder',
                        text: 'object builder [CURRENT_OBJECT]',
                        ...dogeiscutObject.Block,
                        arguments: {
                            CURRENT_OBJECT: {
                                fillIn: 'currentObject'
                            },
                        },
                        branches: [{
                            //accepts: 'dogeiscutObjectBuilder'
                        }],
                    },
                    {
                        opcode: 'builderAppend',
                        text: 'append key [KEY] value [VALUE] to builder',
                        blockType: Scratch.BlockType.COMMAND,
                        //notchAccepts: 'dogeiscutObjectBuilder',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "bar",
                                exemptFromNormalization: true
                            }
                        }
                    },
                    {
                        opcode: 'builderAppendEmpty',
                        text: 'append key [KEY] to builder',
                        blockType: Scratch.BlockType.COMMAND,
                        //notchAccepts: 'dogeiscutObjectBuilder',
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true
                            },
                        }
                    },
                    {
                        opcode: 'builderSet',
                        text: 'set builder to [OBJECT]',
                        blockType: Scratch.BlockType.COMMAND,
                        //notchAccepts: 'dogeiscutObjectBuilder',
                        arguments: {
                            OBJECT: dogeiscutObject.Argument
                        }
                    },
                    '---',
                    {
                        opcode: 'get',
                        text: 'get [KEY] in [OBJECT]',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo"
                            }
                        }
                    },
                    {
                        opcode: 'getPath',
                        text: 'get path [ARRAY] in [OBJECT]',
                        blockType: Scratch.BlockType.REPORTER,
                        allowDropAnywhere: true,
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                            ARRAY: jwArray.Argument
                        }
                    },
                    {
                        opcode: 'has',
                        text: '[OBJECT] has key [KEY]',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'set',
                        text: 'set [KEY] in [OBJECT] to [VALUE]',
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "bar",
                                exemptFromNormalization: true
                            }
                        },
                        ...dogeiscutObject.Block,
                    },
                    {
                        opcode: 'setPath',
                        text: 'set path [ARRAY] in [OBJECT] to [VALUE]',
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                            ARRAY: jwArray.Argument,
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "bar",
                                exemptFromNormalization: true
                            },
                        },
                        ...dogeiscutObject.Block,
                    },
                    {
                        opcode: 'delete',
                        text: 'delete key [KEY] from [OBJECT]',
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo"
                            },
                        },
                        ...dogeiscutObject.Block,
                    },
                    {
                        opcode: 'merge',
                        text: 'merge [ONE] into [TWO]',
                        arguments: {
                            ONE: dogeiscutObject.Argument,
                            TWO: dogeiscutObject.Argument,
                        },
                        ...dogeiscutObject.Block,
                    },
                    '---',
                    {
                        opcode: 'keys',
                        text: 'keys of [OBJECT]',
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                        },
                        ...jwArray.Block,
                    },
                    {
                        opcode: 'values',
                        text: 'values of [OBJECT]',
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                        },
                        ...jwArray.Block,
                    },
                    {
                        opcode: 'entries',
                        text: 'entries of [OBJECT]',
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                        },
                        ...jwArray.Block,
                    },
                    "---",
                    {
                        opcode: 'is',
                        text: 'is [VALUE] an object?',
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "foo",
                                exemptFromNormalization: true
                            }
                        }
                    },
                    "---",
                    {
                        opcode: 'forEachK',
                        text: 'key',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        canDragDuplicate: true
                    },
                    {
                        opcode: 'forEachV',
                        text: 'value',
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: true,
                        allowDropAnywhere: true,
                        canDragDuplicate: true
                    },
                    {
                        opcode: 'forEach',
                        text: 'for [K] [V] of [OBJECT]',
                        blockType: Scratch.BlockType.LOOP,
                        arguments: {
                            OBJECT: dogeiscutObject.Argument,
                            K: {
                                fillIn: 'forEachK'
                            },
                            V: {
                                fillIn: 'forEachV'
                            }
                        }
                    },
                ]
            }
        }

        getCompileInfo() {
            return {
                ir: {
                    builder: (generator, block) => ({
                        kind: 'input',
                        substack: generator.descendSubstack(block, 'SUBSTACK')
                    }),
                },
                js: {
                    builder: (node, compiler, imports) => {
                        const originalSource = compiler.source;

                        compiler.source = '(yield* (function*() {';
                        compiler.source += '    const __inner = (yield* (function*() {';
                        compiler.source += `        thread._dogeiscutObjectBuilderIndex ??= [];`;
                        compiler.source += `        thread._dogeiscutObjectBuilderIndex.push(Object.create(null));`;
                        compiler.descendStack(node.substack, new imports.Frame(false, undefined, true));
                        compiler.source += `        return new runtime.ext_dogeiscutObject.BuilderReturnValue(thread._dogeiscutObjectBuilderIndex.pop());`;
                        compiler.source += '    })());';
                        compiler.source += '    const __result = __inner;';
                        compiler.source += '    if (!(__result instanceof runtime.ext_dogeiscutObject.BuilderReturnValue)) {';
                        compiler.source += '        throw "Return statements are not supported in builders.";';
                        compiler.source += '    }';
                        compiler.source += '    return new runtime.vm.dogeiscutObject.Type(__result.value);';
                        compiler.source += '})())';

                        const stackSource = compiler.source;
                        compiler.source = originalSource;
                        return new imports.TypedInput(stackSource, imports.TYPE_UNKNOWN);
                    }
                }
            };
        }

        BuilderReturnValue = class {
            constructor(value) {
                this.value = value
            }
        } 

        /* Blocks */

        blank() {
            return dogeiscutObject.Type.blank;
        }

        parse({ VALUE }) {
            return dogeiscutObject.Type.toObject(VALUE);
        }

        keyValue({ KEY, VALUE }) {
            const obj = Object.create(null);
            obj[KEY] = VALUE;
            return new dogeiscutObject.Type(obj);
        }

        fromEntries({ ARRAY }) {
            ARRAY = jwArray.Type.toArray(ARRAY)

            try {
                return new dogeiscutObject.Type(Object.assign(Object.create(null),
                    Object.fromEntries(ARRAY.array.map((value) => value.array ? value.array : value))
                ))
            } catch {}
            return new dogeiscutObject.Type()
        }

        currentObject({}, util) {
            if (util.thread._dogeiscutObjectBuilderIndex && util.thread._dogeiscutObjectBuilderIndex.length > 0) {
                return dogeiscutObject.Type.toObject(util.thread._dogeiscutObjectBuilderIndex[util.thread._dogeiscutObjectBuilderIndex.length-1])
            } else {
                throw 'This block must be inside of a "string builder" block.';
            }
        }

        async builder({}, util) {
            return 'noop'
        }

        builderAppend({ KEY, VALUE }, util) {
            if (util.thread._dogeiscutObjectBuilderIndex && util.thread._dogeiscutObjectBuilderIndex.length > 0) {
                util.thread._dogeiscutObjectBuilderIndex[util.thread._dogeiscutObjectBuilderIndex.length-1][KEY] = VALUE
            } else {
                throw 'This block must be inside of a "object builder" block.';
            }
        }

        builderAppendEmpty({ KEY }, util) {
            if (util.thread._dogeiscutObjectBuilderIndex && util.thread._dogeiscutObjectBuilderIndex.length > 0) {
                util.thread._dogeiscutObjectBuilderIndex[util.thread._dogeiscutObjectBuilderIndex.length - 1][KEY] = null;
            } else {
                throw 'This block must be inside of a "object builder" block.';
            }
        }

        builderSet({ OBJECT }, util) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT)

            if (util.thread._dogeiscutObjectBuilderIndex && util.thread._dogeiscutObjectBuilderIndex.length > 0) {
                util.thread._dogeiscutObjectBuilderIndex[util.thread._dogeiscutObjectBuilderIndex.length-1] = OBJECT.object
            } else {
                throw 'This block must be inside of a "object builder" block.';
            }
        }


        get({ OBJECT, KEY }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT, false)

            return hasOwn(OBJECT.object, KEY) ? dogeiscutObject.Type.convertIfNeeded(OBJECT.object[KEY]) : ""
        }

        getPath({ OBJECT, ARRAY }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT, false);
            ARRAY = jwArray.Type.toArray(ARRAY);

            let current = OBJECT.object;
            for (const key of ARRAY.array) {
                if (current instanceof dogeiscutObject.Type) {
                    current = current.object
                }
                if (current && hasOwn(current, key)) {
                    current = current[key];
                } else {
                    return "";
                }
            }
            
            return dogeiscutObject.Type.convertIfNeeded(current);
        }

        has({ OBJECT, KEY }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT, false)

            return hasOwn(OBJECT.object, KEY)
        }

        set({ OBJECT, KEY, VALUE }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT);

            OBJECT.object[KEY] = VALUE;
            return OBJECT;
        }

        setPath({ OBJECT, ARRAY, VALUE }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT);
            ARRAY = jwArray.Type.toArray(ARRAY);

            let current = OBJECT.object;
            for (let i = 0; i < ARRAY.array.length; i++) {
                let key = ARRAY.array[i];

                if (current instanceof dogeiscutObject.Type) {
                    current = current.object;
                } else if (current instanceof jwArray.Type) {
                    current = current.array;
                }

                if (Array.isArray(current) && typeof key === "number") {
                    key = key - 1;
                }

                if (i === ARRAY.array.length - 1) {
                    current[key] = VALUE;
                    return OBJECT;
                }

                let existing = current[key];
                if (existing === undefined || existing === null || typeof existing !== "object") {
                    current[key] = Object.create(null);
                } else if (existing instanceof dogeiscutObject.Type) {
                    current[key] = new dogeiscutObject.Type(
                        Object.assign(Object.create(null), existing.object)
                    );
                } else if (existing instanceof jwArray.Type) {
                    current[key] = new jwArray.Type(existing.array.slice());
                } else {
                    current[key] = Object.assign(
                        Array.isArray(existing) ? [] : Object.create(null),
                        existing
                    );
                }

                current = current[key];
            }

            return OBJECT;
        }

        delete({ KEY, OBJECT }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT);

            delete OBJECT.object[KEY];
            return OBJECT;
        }

        merge({ ONE, TWO }) {
            console.log(ONE)
            console.log(TWO)
            ONE = dogeiscutObject.Type.toObject(ONE);
            TWO = dogeiscutObject.Type.toObject(TWO);

            Object.assign(TWO.object, Object.assign(Object.create(null), ONE.object))
            return TWO;
        }

        keys({ OBJECT }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT, false);

            return new jwArray.Type(Object.keys(OBJECT.object));
        }

        values({ OBJECT }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT, false);

            return new jwArray.Type(Object.values(OBJECT.object).map(dogeiscutObject.Type.convertIfNeeded));
        }

        entries({ OBJECT }) {
            OBJECT = dogeiscutObject.Type.toObject(OBJECT, false);

            return new jwArray.Type(Object.entries(OBJECT.object).map(([key, value]) => {
                return new jwArray.Type([key, dogeiscutObject.Type.convertIfNeeded(value)]);
            }));
        }

        is({ VALUE }) {
            try {
                const parsed = JSON.parse(VALUE);
                return typeof parsed === 'object' && parsed !== null && !isArray(parsed);
            } catch {
                return false;
            }
        }

        forEachK({}, util) {
            let obj = util.thread.stackFrames[0].dogeiscutObject;
            return obj ? dogeiscutObject.Type.convertIfNeeded(obj[0]) : "";
        }

        forEachV({}, util) {
            let obj = util.thread.stackFrames[0].dogeiscutObject;
            return obj ? dogeiscutObject.Type.convertIfNeeded(obj[1]) : "";
        }

        forEach({ OBJECT }, util) {
            if (util.stackFrame.execute) {
                util.stackFrame.index++;
                const { index, entries } = util.stackFrame;
                if (index > entries.length - 1) return;
                util.thread.stackFrames[0].dogeiscutObject = entries[index];
            } else {
                OBJECT = dogeiscutObject.Type.toObject(OBJECT, false);
                const entries = Object.entries(OBJECT.object).map(([key, value]) => {
                    return [dogeiscutObject.Type.convertIfNeeded(key), dogeiscutObject.Type.convertIfNeeded(value)];
                });
                if (entries.length === 0) return;
                util.stackFrame.entries = entries;
                util.stackFrame.execute = true;
                util.stackFrame.index = 0;
                util.thread.stackFrames[0].dogeiscutObject = entries[0];
            }
            util.startBranch(1, true);
        }

    }

    Scratch.extensions.register(new Extension());
})(Scratch);