(async function(Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) {
        alert("This extension must be unsandboxed.");
        return;
    }
    const nodes = [];
    const links = [];
    const blocks = [];
const NODE1 = "#56ad57";
const NODE2 = "#419b42";
const NODE3 = "#348235";

const LINK1 = "#2f8242";
const LINK2 = "#256e35";
const LINK3 = "#1c5729";
    function getNode(id) {
        return nodes.find(n => n.id === Number(id));
    }
    function linkExists(a, b) {
        return links.some(
            l =>
                (l.from === Number(a) && l.to === Number(b)) ||
                (l.from === Number(b) && l.to === Number(a))
        );
    }
    function areAdjacent(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);

        return (
            (dx === 1 && dy === 0) ||
            (dx === 0 && dy === 1)
        );
    }
getInfo() {
    return {
        id: "yourExtensionId",
        name: "Your Extension",
        blocks: [
            {
                opcode: "createNode",
                blockType: Scratch.BlockType.COMMAND,
                hideFromPalette: false,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "create node at x: [X] y: [Y] with an id of [ID]",
                arguments: {
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    ID: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                },
                disableMonitor: true
            },
            {
                opcode: "deleteNode",
                blockType: Scratch.BlockType.COMMAND,
                hideFromPalette: false,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "delete node [ID]",
                arguments: {
                    ID: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                },
                disableMonitor: true
            },
            {
                opcode: "nodeExists",
                blockType: Scratch.BlockType.BOOLEAN,
                hideFromPalette: false,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "node [ID] exists?",
                arguments: {
                    ID: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                },
                disableMonitor: true
            },
            {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='24'/>`
            },
            {
                opcode: "setNodePosition",
                blockType: Scratch.BlockType.COMMAND,
                hideFromPalette: false,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "set node [ID] position x: [X] y: [Y]",
                arguments: {
                    ID: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    },
                    X: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    },
                    Y: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 0
                    }
                },
                disableMonitor: true
            },
            {
                opcode: "getNodeX",
                blockType: Scratch.BlockType.REPORTER,
                hideFromPalette: false,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "x of node [ID]",
                arguments: {
                    ID: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                },
                disableMonitor: true
            },
            {
                opcode: "getNodeY",
                blockType: Scratch.BlockType.REPORTER,
                hideFromPalette: false,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "y of node [ID]",
                arguments: {
                    ID: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                },
                disableMonitor: true
            },
            {
                opcode: "goDirection",
                blockType: Scratch.BlockType.REPORTER,
                hideFromPalette: false,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "go [DIR] of node id [ID]",
                arguments: {
                    DIR: {
                        type: Scratch.ArgumentType.STRING,
                        menu: "directions"
                    },
                    ID: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    }
                },
                disableMonitor: true
            },
            {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='24'/>`
            },
            {
                opcode: "allNodes",
                blockType: Scratch.BlockType.REPORTER,
                hideFromPalette: false,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "all nodes",
                arguments: {},
                disableMonitor: true
            },
            {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='48'/>`
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: "Links"
            },
            {
                opcode: "linkNodes",
                blockType: Scratch.BlockType.COMMAND,
                hideFromPalette: false,
                color1: LINK1,
                color2: LINK2,
                color3: LINK3,
                text: "link node [A] to node [B]",
                arguments: {
                    A: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    },
                    B: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 2
                    }
                },
                disableMonitor: true
            },
            {
                opcode: "unlinkNodes",
                blockType: Scratch.BlockType.COMMAND,
                hideFromPalette: false,
                color1: LINK1,
                color2: LINK2,
                color3: LINK3,
                text: "unlink node [A] from node [B]",
                arguments: {
                    A: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    },
                    B: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 2
                    }
                },
                disableMonitor: true
            },
            {
                opcode: "nodesLinked",
                blockType: Scratch.BlockType.BOOLEAN,
                hideFromPalette: false,
                color1: LINK1,
                color2: LINK2,
                color3: LINK3,
                text: "node [A] linked to node [B]?",
                arguments: {
                    A: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 1
                    },
                    B: {
                        type: Scratch.ArgumentType.NUMBER,
                        defaultValue: 2
                    }
                },
                disableMonitor: true
            },
            {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='24'/>`
            },
            {
                opcode: "allLinks",
                blockType: Scratch.BlockType.REPORTER,
                hideFromPalette: false,
                color1: LINK1,
                color2: LINK2,
                color3: LINK3,
                text: "all links",
                arguments: {},
                disableMonitor: true
            }
        ]
    };
}
    class NodeSystem {
        getInfo() {
            return {
                id: "ziploxnodesystem",
                name: "Nodes",
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4My43NSIgaGVpZ2h0PSI4My43NSIgdmlld0JveD0iMCwwLDgzLjc1LDgzLjc1Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjc4LjEyNSwtMTM4LjEyNSkiPjxnIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTMxNC4zMjg1LDIwMi4xNzUybC0xNi44MzA5LC0xNi44MzA5IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4zOTIxNiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zMTkuNzgxODcsMTUyLjE1MzNsLTIyLjUwMjQsMjIuNTAyNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMzkyMTYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjg3LjA2MjU4LDE3NC45MDkyOGMyLjgxMTUzLC0yLjgxMTUzIDcuMzY5OTIsLTIuODExNTMgMTAuMTgxNDUsMGMyLjgxMTUzLDIuODExNTMgMi44MTE1Myw3LjM2OTkyIDAsMTAuMTgxNDVjLTIuODExNTMsMi44MTE1MyAtNy4zNjk5MiwyLjgxMTUzIC0xMC4xODE0NSwwYy0yLjgxMTUzLC0yLjgxMTUzIC0yLjgxMTUzLC03LjM2OTkyIDAsLTEwLjE4MTQ1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMzkyMTYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0zNTIuOTM3NDIsMTg1LjA5MDcyYy0yLjgxMTUzLDIuODExNTMgLTcuMzY5OTIsMi44MTE1MyAtMTAuMTgxNDUsMGMtMi44MTE1MywtMi44MTE1MyAtMi44MTE1MywtNy4zNjk5MiAwLC0xMC4xODE0NWMyLjgxMTUzLC0yLjgxMTUzIDcuMzY5OTIsLTIuODExNTMgMTAuMTgxNDUsMGMyLjgxMTUzLDIuODExNTMgMi44MTE1Myw3LjM2OTkyIDAsMTAuMTgxNDV6IiBmaWxsPSJub25lIiBzdHJva2Utb3BhY2l0eT0iMC4zOTIxNiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTMxNC45MDkyOCwyMDIuNzU1OThjMi44MTE1MywtMi44MTE1MyA3LjM2OTkyLC0yLjgxMTUzIDEwLjE4MTQ1LDBjMi44MTE1MywyLjgxMTUzIDIuODExNTMsNy4zNjk5MiAwLDEwLjE4MTQ1Yy0yLjgxMTUzLDIuODExNTMgLTcuMzY5OTIsMi44MTE1MyAtMTAuMTgxNDUsMGMtMi44MTE1MywtMi44MTE1MyAtMi44MTE1MywtNy4zNjk5MiAwLC0xMC4xODE0NXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjM5MjE2IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzI1LjA5MDcyLDE1Ny4yNDQwMmMtMi44MTE1MywyLjgxMTUzIC03LjM2OTkyLDIuODExNTMgLTEwLjE4MTQ1LDBjLTIuODExNTMsLTIuODExNTMgLTIuODExNTMsLTcuMzY5OTIgMCwtMTAuMTgxNDVjMi44MTE1MywtMi44MTE1MyA3LjM2OTkyLC0yLjgxMTUzIDEwLjE4MTQ1LDBjMi44MTE1MywyLjgxMTUzIDIuODExNTMsNy4zNjk5MiAwLDEwLjE4MTQ1eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMzkyMTYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0zMTQuMzI4NSwyMDIuMTc1MmwtMTYuODMwOSwtMTYuODMwOSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTMxOS43ODE4NywxNTIuMTUzM2wtMjIuNTAyNCwyMi41MDI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMy41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjg3LjA2MjU4LDE3NC45MDkyOGMyLjgxMTUzLC0yLjgxMTUzIDcuMzY5OTIsLTIuODExNTMgMTAuMTgxNDUsMGMyLjgxMTUzLDIuODExNTMgMi44MTE1Myw3LjM2OTkyIDAsMTAuMTgxNDVjLTIuODExNTMsMi44MTE1MyAtNy4zNjk5MiwyLjgxMTUzIC0xMC4xODE0NSwwYy0yLjgxMTUzLC0yLjgxMTUzIC0yLjgxMTUzLC03LjM2OTkyIDAsLTEwLjE4MTQ1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzUyLjkzNzQyLDE4NS4wOTA3MmMtMi44MTE1MywyLjgxMTUzIC03LjM2OTkyLDIuODExNTMgLTEwLjE4MTQ1LDBjLTIuODExNTMsLTIuODExNTMgLTIuODExNTMsLTcuMzY5OTIgMCwtMTAuMTgxNDVjMi44MTE1MywtMi44MTE1MyA3LjM2OTkyLC0yLjgxMTUzIDEwLjE4MTQ1LDBjMi44MTE1MywyLjgxMTUzIDIuODExNTMsNy4zNjk5MiAwLDEwLjE4MTQ1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzE0LjkwOTI4LDIwMi43NTU5OGMyLjgxMTUzLC0yLjgxMTUzIDcuMzY5OTIsLTIuODExNTMgMTAuMTgxNDUsMGMyLjgxMTUzLDIuODExNTMgMi44MTE1Myw3LjM2OTkyIDAsMTAuMTgxNDVjLTIuODExNTMsMi44MTE1MyAtNy4zNjk5MiwyLjgxMTUzIC0xMC4xODE0NSwwYy0yLjgxMTUzLC0yLjgxMTUzIC0yLjgxMTUzLC03LjM2OTkyIDAsLTEwLjE4MTQ1eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzI1LjA5MDcyLDE1Ny4yNDQwMmMtMi44MTE1MywyLjgxMTUzIC03LjM2OTkyLDIuODExNTMgLTEwLjE4MTQ1LDBjLTIuODExNTMsLTIuODExNTMgLTIuODExNTMsLTcuMzY5OTIgMCwtMTAuMTgxNDVjMi44MTE1MywtMi44MTE1MyA3LjM2OTkyLC0yLjgxMTUzIDEwLjE4MTQ1LDBjMi44MTE1MywyLjgxMTUzIDIuODExNTMsNy4zNjk5MiAwLDEwLjE4MTQ1eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjc4LjEyNSwyMjEuODc1di04My43NWg4My43NXY4My43NXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjQxLjg3NTo0MS44NzUtLT4=",
                color1: "#f06681",
                color2: "#d6516c",
                blocks: blocks,
                menus: {
                    directions: {
                        acceptReporters: true,
                        items: [
                            "right",
                            "left",
                            "up",
                            "down"
                        ]
                    }
                }
            };
        }
createNode(args) {
    nodes.push({
        id: Number(args.ID),
        x: Number(args.X),
        y: Number(args.Y)
    });
}
        deleteNode(args) {
            const id = Number(args.ID);
            const index = nodes.findIndex(
                n => n.id === id
            );
            if (index !== -1) {
                nodes.splice(index, 1);
            }
            for (let i = links.length - 1; i >= 0; i--) {
                if (
                    links[i].from === id ||
                    links[i].to === id
                ) {
                    links.splice(i, 1);
                }
            }
        }
        nodeExists(args) {
            return !!getNode(args.ID);
        }
        setNodePosition(args) {
            const node = getNode(args.ID);
            if (!node) return;
            node.x = Number(args.X);
            node.y = Number(args.Y);
        }
        getNodeX(args) {
            const node = getNode(args.ID);
            if (!node) return 0;
            return node.x;
        }
        getNodeY(args) {
            const node = getNode(args.ID);
            if (!node) return 0;
            return node.y;
        }
        goDirection(args) {
            const node = getNode(args.ID);
            if (!node) return "";
            let x = node.x;
            let y = node.y;
            switch (String(args.DIR)) {
                case "right":
                    x += 1;
                    break;
                case "left":
                    x -= 1;
                    break;
                case "up":
                    y += 1;
                    break;
                case "down":
                    y -= 1;
                    break;
            }
            const found = nodes.find(
                n => n.x === x && n.y === y
            );
            return found ? found.id : "";
        }
        linkNodes(args) {
            const a = getNode(args.A);
            const b = getNode(args.B);
            if (!a || !b) return;
            if (a.id === b.id) return;
            if (!areAdjacent(a, b)) return;
            if (linkExists(a.id, b.id)) return;
            links.push({
                from: a.id,
                to: b.id
            });
        }
        unlinkNodes(args) {
            const a = Number(args.A);
            const b = Number(args.B);
            for (let i = links.length - 1; i >= 0; i--) {
                const l = links[i];
                if (
                    (l.from === a && l.to === b) ||
                    (l.from === b && l.to === a)
                ) {
                    links.splice(i, 1);
                }
            }
        }
        nodesLinked(args) {
            return linkExists(args.A, args.B);
        }
        allNodes() {
            return JSON.stringify(nodes);
        }
        allLinks() {
            return JSON.stringify(links);
        }
    }
    Scratch.extensions.register(new Extension());
})(Scratch);
