//Created by ZiploxZQS and OutsideFlight X3
//There will be unneccesary comments because why not

(async function(Scratch) {
    "use strict";
    if (!Scratch.extensions.unsandboxed) {
        alert("This extension must be unsandboxed.");
        return;
    }
    const nodes = new Map();
    let links = [];
const NODE1 = "#56ad57";
const NODE2 = "#419b42";
const NODE3 = "#348235";

const LINK1 = "#2f8242";
const LINK2 = "#256e35";
const LINK3 = "#1c5729";
    function getNode(id) {
    return nodes.get(Scratch.Cast.toNumber(id));
}
    function linkExists(a, b) {
        return links.some(
            l =>
                (l.from === Scratch.Cast.toNumber(a) && l.to === Scratch.Cast.toNumber(b)) ||
                (l.from === Scratch.Cast.toNumber(b) && l.to === Scratch.Cast.toNumber(a))
        );
    }
function getNodeNeighbors(id) {
    id = Scratch.Cast.toNumber(id);

    return links.flatMap(link => {
        if (link.from === id) return [link.to];
        if (link.to === id) return [link.from];
        return [];
    });
}
    function areAdjacent(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);

        return (
            (dx === 1 && dy === 0) ||
            (dx === 0 && dy === 1)
        );
    }
    class NodeSystem {
        getInfo() {
            return {
                id: "ziploxnodesystem",
                name: "Nodes",
                "blockIconURI": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4My43NSIgaGVpZ2h0PSI4My43NSIgdmlld0JveD0iMCwwLDgzLjc1LDgzLjc1Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjc4LjEyNSwtMTM4LjEyNSkiPjxnIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTMxNC4zMjg1LDIwMi4xNzUybC0xNi44MzA5LC0xNi44MzA5IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4zOTIxNiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxwYXRoIGQ9Ik0zMTkuNzgxODcsMTUyLjE1MzNsLTIyLjUwMjQsMjIuNTAyNCIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMzkyMTYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjg3LjA2MjU4LDE3NC45MDkyOGMyLjgxMTUzLC0yLjgxMTUzIDcuMzY5OTIsLTIuODExNTMgMTAuMTgxNDUsMGMyLjgxMTUzLDIuODExNTMgMi44MTE1Myw3LjM2OTkyIDAsMTAuMTgxNDVjLTIuODExNTMsMi44MTE1MyAtNy4zNjk5MiwyLjgxMTUzIC0xMC4xODE0NSwwYy0yLjgxMTUzLC0yLjgxMTUzIC0yLjgxMTUzLC03LjM2OTkyIDAsLTEwLjE4MTQ1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMzkyMTYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0zNTIuOTM3NDIsMTg1LjA5MDcyYy0yLjgxMTUzLDIuODExNTMgLTcuMzY5OTIsMi44MTE1MyAtMTAuMTgxNDUsMGMtMi44MTE1MywtMi44MTE1MyAtMi44MTE1MywtNy4zNjk5MiAwLC0xMC4xODE0NWMyLjgxMTUzLC0yLjgxMTUzIDcuMzY5OTIsLTIuODExNTMgMTAuMTgxNDUsMGMyLjgxMTUzLDIuODExNTMgMi44MTE1Myw3LjM2OTkyIDAsMTAuMTgxNDV6IiBmaWxsPSJub25lIiBzdHJva2Utb3BhY2l0eT0iMC4zOTIxNiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjYiIHN0cm9rZS1saW5lY2FwPSJidXR0Ii8+PHBhdGggZD0iTTMxNC45MDkyOCwyMDIuNzU1OThjMi44MTE1MywtMi44MTE1MyA3LjM2OTkyLC0yLjgxMTUzIDEwLjE4MTQ1LDBjMi44MTE1MywyLjgxMTUzIDIuODExNTMsNy4zNjk5MiAwLDEwLjE4MTQ1Yy0yLjgxMTUzLDIuODExNTMgLTcuMzY5OTIsMi44MTE1MyAtMTAuMTgxNDUsMGMtMi44MTE1MywtMi44MTE1MyAtMi44MTE1MywtNy4zNjk5MiAwLC0xMC4xODE0NXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjM5MjE2IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzI1LjA5MDcyLDE1Ny4yNDQwMmMtMi44MTE1MywyLjgxMTUzIC03LjM2OTkyLDIuODExNTMgLTEwLjE4MTQ1LDBjLTIuODExNTMsLTIuODExNTMgLTIuODExNTMsLTcuMzY5OTIgMCwtMTAuMTgxNDVjMi44MTE1MywtMi44MTE1MyA3LjM2OTkyLC0yLjgxMTUzIDEwLjE4MTQ1LDBjMi44MTE1MywyLjgxMTUzIDIuODExNTMsNy4zNjk5MiAwLDEwLjE4MTQ1eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMzkyMTYiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI2IiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0zMTQuMzI4NSwyMDIuMTc1MmwtMTYuODMwOSwtMTYuODMwOSIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PHBhdGggZD0iTTMxOS43ODE4NywxNTIuMTUzM2wtMjIuNTAyNCwyMi41MDI0IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMy41IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz48cGF0aCBkPSJNMjg3LjA2MjU4LDE3NC45MDkyOGMyLjgxMTUzLC0yLjgxMTUzIDcuMzY5OTIsLTIuODExNTMgMTAuMTgxNDUsMGMyLjgxMTUzLDIuODExNTMgMi44MTE1Myw3LjM2OTkyIDAsMTAuMTgxNDVjLTIuODExNTMsMi44MTE1MyAtNy4zNjk5MiwyLjgxMTUzIC0xMC4xODE0NSwwYy0yLjgxMTUzLC0yLjgxMTUzIC0yLjgxMTUzLC03LjM2OTkyIDAsLTEwLjE4MTQ1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzUyLjkzNzQyLDE4NS4wOTA3MmMtMi44MTE1MywyLjgxMTUzIC03LjM2OTkyLDIuODExNTMgLTEwLjE4MTQ1LDBjLTIuODExNTMsLTIuODExNTMgLTIuODExNTMsLTcuMzY5OTIgMCwtMTAuMTgxNDVjMi44MTE1MywtMi44MTE1MyA3LjM2OTkyLC0yLjgxMTUzIDEwLjE4MTQ1LDBjMi44MTE1MywyLjgxMTUzIDIuODExNTMsNy4zNjk5MiAwLDEwLjE4MTQ1eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzE0LjkwOTI4LDIwMi43NTU5OGMyLjgxMTUzLC0yLjgxMTUzIDcuMzY5OTIsLTIuODExNTMgMTAuMTgxNDUsMGMyLjgxMTUzLDIuODExNTMgMi44MTE1Myw3LjM2OTkyIDAsMTAuMTgxNDVjLTIuODExNTMsMi44MTE1MyAtNy4zNjk5MiwyLjgxMTUzIC0xMC4xODE0NSwwYy0yLjgxMTUzLC0yLjgxMTUzIC0yLjgxMTUzLC03LjM2OTkyIDAsLTEwLjE4MTQ1eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMzI1LjA5MDcyLDE1Ny4yNDQwMmMtMi44MTE1MywyLjgxMTUzIC03LjM2OTkyLDIuODExNTMgLTEwLjE4MTQ1LDBjLTIuODExNTMsLTIuODExNTMgLTIuODExNTMsLTcuMzY5OTIgMCwtMTAuMTgxNDVjMi44MTE1MywtMi44MTE1MyA3LjM2OTkyLC0yLjgxMTUzIDEwLjE4MTQ1LDBjMi44MTE1MywyLjgxMTUzIDIuODExNTMsNy4zNjk5MiAwLDEwLjE4MTQ1eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjMuNSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiLz48cGF0aCBkPSJNMjc4LjEyNSwyMjEuODc1di04My43NWg4My43NXY4My43NXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjQxLjg3NTo0MS44NzUtLT4=",
                color1: "#f06681",
                color2: "#d6516c",
                blocks: [
            {
                blockType: Scratch.BlockType.LABEL,
                text: "By ZiploxZQS and OutsideFlight"
            },

            {
                opcode: "createNode",
                blockType: Scratch.BlockType.COMMAND,
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
            },
            {
                opcode: "deleteNode",
                blockType: Scratch.BlockType.COMMAND,
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
    opcode: "makeGrid",
    blockType: Scratch.BlockType.COMMAND,
    color1: NODE1,
    color2: NODE2,
    color3: NODE3,
    text: "make a grid from x: [X1] y: [Y1] to x: [X2] y: [Y2]",
    arguments: {
        X1: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: -1
        },
        Y1: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 1
        },
        X2: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 1
        },
        Y2: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: -1
        }
    },
},
                    {
    opcode: "clearNodes",
    blockType: Scratch.BlockType.COMMAND,
    color1: NODE1,
    color2: NODE2,
    color3: NODE3,
    text: "remove all nodes",
    arguments: {},
},
            {
                opcode: "nodeExists",
                blockType: Scratch.BlockType.BOOLEAN,
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
            },
            {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='24'/>`
            },
            {
                opcode: "setNodePosition",
                blockType: Scratch.BlockType.COMMAND,
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
            },
            {
                opcode: "getNodeX",
                blockType: Scratch.BlockType.REPORTER,
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
            },
            {
                opcode: "getNodeY",
                blockType: Scratch.BlockType.REPORTER,
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
            },
                                        {
    opcode: "closestNode",
    blockType: Scratch.BlockType.REPORTER,
    color1: NODE1,
    color2: NODE2,
    color3: NODE3,
    text: "node closest to x: [X] y: [Y]",
    arguments: {
        X: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 0
        },
        Y: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 0
        }
    }
},
            {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='24'/>`
            },
                    {
    opcode: "lowestNodeID",
    blockType: Scratch.BlockType.REPORTER,
    color1: NODE1,
    color2: NODE2,
    color3: NODE3,
    text: "lowest node ID",
    arguments: {}
},
{
    opcode: "highestNodeID",
    blockType: Scratch.BlockType.REPORTER,
    color1: NODE1,
    color2: NODE2,
    color3: NODE3,
    text: "highest node ID",
    arguments: {}
},
                    {
    opcode: "nodeCount",
    blockType: Scratch.BlockType.REPORTER,
    color1: NODE1,
    color2: NODE2,
    color3: NODE3,
    text: "number of nodes",
    arguments: {},
},
            {
                opcode: "allNodes",
                blockType: Scratch.BlockType.REPORTER,
                color1: NODE1,
                color2: NODE2,
                color3: NODE3,
                text: "all nodes",
                arguments: {},
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
            },
            {
                opcode: "unlinkNodes",
                blockType: Scratch.BlockType.COMMAND,
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
            },
                    {
    opcode: "unlinkAllNeighbors",
    blockType: Scratch.BlockType.COMMAND,
    color1: LINK1,
    color2: LINK2,
    color3: LINK3,
    text: "unlink all neighbors of node [ID]",
    arguments: {
        ID: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 1
        }
    }
},
                    {
    opcode: "connectNodesAnyWay",
    blockType: Scratch.BlockType.COMMAND,
    color1: LINK1,
    color2: LINK2,
    color3: LINK3,
    text: "connect nodes from the range [A] to [B] in any way possible",
    arguments: {
        A: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 1
        },
        B: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 5
        }
    },
},
            {
                opcode: "nodesLinked",
                blockType: Scratch.BlockType.BOOLEAN,
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
            },
            {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='24'/>`
            },
            {
                opcode: "goDirection",
                blockType: Scratch.BlockType.REPORTER,
                color1: LINK1,
                color2: LINK2,
                color3: LINK3,
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
            },
            {
            opcode: "getNeighbors",
            blockType: Scratch.BlockType.REPORTER,
            color1: LINK1,
            color2: LINK2,
            color3: LINK3,
            text: "neighbors of node [ID]",
            arguments: {
            ID: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 1
            }
            },
            },
                    {
    opcode: "linkCount",
    blockType: Scratch.BlockType.REPORTER,
    color1: LINK1,
    color2: LINK2,
    color3: LINK3,
    text: "node [ID] neighbor amount",
    arguments: {
        ID: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 1
        }
    },
},
            {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='24'/>`
            },
                    {
    opcode: "linkedNode",
    blockType: Scratch.BlockType.REPORTER,
    color1: LINK1,
    color2: LINK2,
    color3: LINK3,
    text: "linked node #[INDEX] of node ID [ID]",
    arguments: {
        INDEX: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 1
        },
        ID: {
            type: Scratch.ArgumentType.NUMBER,
            defaultValue: 1
        }
    },
},
                              {
                blockType: Scratch.BlockType.XML,
                xml: `<sep gap='24'/>`
            },  
                    {
    opcode: "linkCountTotal",
    blockType: Scratch.BlockType.REPORTER,
    color1: LINK1,
    color2: LINK2,
    color3: LINK3,
    text: "number of links",
    arguments: {},
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
            }
        ],
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
    const id = Scratch.Cast.toNumber(args.ID);

    nodes.set(id, {
        id,
        x: Scratch.Cast.toNumber(args.X),
        y: Scratch.Cast.toNumber(args.Y)
    });
}
deleteNode(args) {
    const id = Scratch.Cast.toNumber(args.ID);

    nodes.delete(id);

links = links.filter(link =>
    link.from !== id &&
    link.to !== id
);
}
nodeExists(args) {
    return nodes.has(Scratch.Cast.toNumber(args.ID));
}
        setNodePosition(args) {
            const node = getNode(args.ID);
            if (!node) return;
            node.x = Scratch.Cast.toNumber(args.X);
            node.y = Scratch.Cast.toNumber(args.Y);
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
getNeighbors(args) {
    return JSON.stringify(getNodeNeighbors(args.ID));
}
linkCount(args) {
    return getNodeNeighbors(args.ID).length;
}

linkedNode(args) {
    const neighbors = getNodeNeighbors(args.ID);

    return (
        neighbors[
            Scratch.Cast.toNumber(args.INDEX) - 1
        ] ?? ""
    );
}
goDirection(args) {
    const node = getNode(args.ID);
    if (!node) return "";

    let targetX = node.x;
    let targetY = node.y;

    switch (String(args.DIR)) {
        case "right":
            targetX += 1;
            break;
        case "left":
            targetX -= 1;
            break;
        case "up":
            targetY += 1;
            break;
        case "down":
            targetY -= 1;
            break;
    }

    const target = [...nodes.values()].find(
        n => n.x === targetX && n.y === targetY
    );

    if (!target) return "";

    // i uhhh forgot to add this back whoops
    if (!linkExists(node.id, target.id)) return "";

    return target.id;
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
        nodeCount() {
    return nodes.size;
}
        linkCountTotal() {
    return links.length;
}
// its so fucking BUGGY aaaaarrrgghhhhh
connectNodesAnyWay(args) {
    const A = Scratch.Cast.toNumber(args.A);
    const B = Scratch.Cast.toNumber(args.B);

    const minID = Math.min(A, B);
    const maxID = Math.max(A, B);

    const nodesArr = [...nodes.values()];

    for (const node of nodesArr) {

        if (node.id < minID || node.id > maxID) continue;

        const directions = [
            { dx: 1, dy: 0 },
            { dx: -1, dy: 0 },
            { dx: 0, dy: 1 },
            { dx: 0, dy: -1 }
        ];

        for (const dir of directions) {

            const nx = node.x + dir.dx;
            const ny = node.y + dir.dy;

            const neighbor = nodesArr.find(
                n => n.x === nx && n.y === ny
            );
//they find their lovers awwwww!!!
            if (!neighbor) continue;

            if (neighbor.id < minID || neighbor.id > maxID) continue;

            if (!linkExists(node.id, neighbor.id)) {
                links.push({
                    from: node.id,
                    to: neighbor.id
                });
            }
        }
    }
}
makeGrid(args) {
    const x1 = Scratch.Cast.toNumber(args.X1);
    const y1 = Scratch.Cast.toNumber(args.Y1);
    const x2 = Scratch.Cast.toNumber(args.X2);
    const y2 = Scratch.Cast.toNumber(args.Y2);

    const minX = Math.min(x1, x2);
    const maxX = Math.max(x1, x2);
    const minY = Math.min(y1, y2);
    const maxY = Math.max(y1, y2);

    let id = 1;

    for (let y = maxY; y >= minY; y--) {
        for (let x = minX; x <= maxX; x++) {

            nodes.set(id, {
                id,
                x,
                y
            });

            id++;
        }
    }
}
        unlinkNodes(args) {
            const a = Scratch.Cast.toNumber(args.A);
            const b = Scratch.Cast.toNumber(args.B);
            links = links.filter(l =>
    !(
        (l.from === a && l.to === b) ||
        (l.from === b && l.to === a)
    )
);
        }
        nodesLinked(args) {
            return linkExists(args.A, args.B);
        }
allNodes() {
    return JSON.stringify(
        [...nodes.values()]
    );
}
        allLinks() {
            return JSON.stringify(links);
        }
        clearNodes() {
    nodes.clear();
    links = [];
}
        closestNode(args) {
    const x = Scratch.Cast.toNumber(args.X);
    const y = Scratch.Cast.toNumber(args.Y);

    let best = null;
    let bestDist = Infinity;

    for (const node of nodes.values()) {
        const dx = node.x - x;
        const dy = node.y - y;
        const dist = dx * dx + dy * dy; // this might be useful since i dont want to keep changing the value when the grid is in the middle

        if (dist < bestDist) {
            bestDist = dist;
            best = node;
        }
    }

    return best ? best.id : "";
}
lowestNodeID() {
    if (nodes.size === 0) return "";
    return Math.min(...nodes.keys());
}

highestNodeID() {
    if (nodes.size === 0) return "";
    return Math.max(...nodes.keys());
}
        unlinkAllNeighbors(args) {
    const id = Scratch.Cast.toNumber(args.ID);

    links = links.filter(l =>
        !(l.from === id || l.to === id)
    );
}
    }
    Scratch.extensions.register(new NodeSystem());
})(Scratch);
