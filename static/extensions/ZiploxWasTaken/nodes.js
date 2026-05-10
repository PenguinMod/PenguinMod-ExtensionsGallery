// Created by ZiploxZQS and OutsideFlight X3
// There will be unnecessary comments because why not

(async function (Scratch) {
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
        id = Scratch.Cast.toNumber(id);

        if (!Number.isFinite(id)) return null;

        return nodes.get(id);
    }

    function linkExists(a, b) {
        a = Scratch.Cast.toNumber(a);
        b = Scratch.Cast.toNumber(b);

        return links.some(
            l =>
                (l.from === a && l.to === b) ||
                (l.from === b && l.to === a)
        );
    }

    function getNodeNeighbors(id) {
        id = Scratch.Cast.toNumber(id);

        return [
            ...new Set(
                links.flatMap(link => {
                    if (link.from === id) {
                        return [link.to];
                    }

                    if (link.to === id) {
                        return [link.from];
                    }

                    return [];
                })
            )
        ];
    }

    function areAdjacent(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);

        return (
            (dx === 1 && dy === 0) ||
            (dx === 0 && dy === 1)
        );
    }

    function findNodeAt(x, y) {
        for (const node of nodes.values()) {
            if (node.x === x && node.y === y) {
                return node;
            }
        }

        return null;
    }

    class NodeSystem {
        getInfo() {
            return {
                id: "ziploxnodesystem",
                name: "Nodes",

                color1: "#f06681",
                color2: "#d6516c",

                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "By ZiploxZQS and OutsideFlight"
                    },

                    // =========================
                    // NODES
                    // =========================

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
                        }
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
                        }
                    },

                    {
                        opcode: "clearNodes",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "remove all nodes"
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        opcode: "lowestNodeID",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "lowest node ID"
                    },

                    {
                        opcode: "highestNodeID",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "highest node ID"
                    },

                    {
                        opcode: "nodeCount",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "number of nodes"
                    },

                    {
                        opcode: "allNodes",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "all nodes"
                    },

                    // =========================
                    // LINKS
                    // =========================

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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
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
                        }
                    },

                    {
                        opcode: "linkCountTotal",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "number of links"
                    },

                    {
                        opcode: "allLinks",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "all links"
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
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);

            if (!Number.isFinite(id)) return;
            if (!Number.isFinite(x)) return;
            if (!Number.isFinite(y)) return;

            const existing = findNodeAt(x, y);

            // no stacking!!!
            if (existing && existing.id !== id) {
                return;
            }

            // remove old links if replacing node
            if (nodes.has(id)) {
                links = links.filter(
                    l =>
                        l.from !== id &&
                        l.to !== id
                );
            }

            nodes.set(id, {
                id,
                x,
                y
            });
        }

        deleteNode(args) {
            const id = Scratch.Cast.toNumber(args.ID);

            nodes.delete(id);

            links = links.filter(
                link =>
                    link.from !== id &&
                    link.to !== id
            );
        }

        clearNodes() {
            nodes.clear();
            links = [];
        }

        nodeExists(args) {
            return nodes.has(
                Scratch.Cast.toNumber(args.ID)
            );
        }

        setNodePosition(args) {
            const node = getNode(args.ID);

            if (!node) return;

            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);

            if (!Number.isFinite(x)) return;
            if (!Number.isFinite(y)) return;

            const existing = findNodeAt(x, y);

            // don't overlap nodes
            if (existing && existing.id !== node.id) {
                return;
            }

            node.x = x;
            node.y = y;
        }

        getNodeX(args) {
            const node = getNode(args.ID);

            return node ? node.x : 0;
        }

        getNodeY(args) {
            const node = getNode(args.ID);

            return node ? node.y : 0;
        }

        closestNode(args) {
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);

            let best = null;
            let bestDist = Infinity;

            for (const node of nodes.values()) {
                const dx = node.x - x;
                const dy = node.y - y;

                const dist = dx * dx + dy * dy;

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
            if (nodes.size === 0) return 0;

            return Math.max(...nodes.keys());
        }

        nodeCount() {
            return nodes.size;
        }

        allNodes() {
            return JSON.stringify([
                ...nodes.values()
            ]);
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
            const a = Scratch.Cast.toNumber(args.A);
            const b = Scratch.Cast.toNumber(args.B);

            links = links.filter(
                l =>
                    !(
                        (l.from === a &&
                            l.to === b) ||
                        (l.from === b &&
                            l.to === a)
                    )
            );
        }

        unlinkAllNeighbors(args) {
            const id = Scratch.Cast.toNumber(args.ID);

            links = links.filter(
                l =>
                    !(
                        l.from === id ||
                        l.to === id
                    )
            );
        }

        nodesLinked(args) {
            return linkExists(args.A, args.B);
        }

        connectNodesAnyWay(args) {
            const A = Scratch.Cast.toNumber(args.A);
            const B = Scratch.Cast.toNumber(args.B);

            const minID = Math.min(A, B);
            const maxID = Math.max(A, B);

            const directions = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];

            for (const node of nodes.values()) {
                if (
                    node.id < minID ||
                    node.id > maxID
                ) {
                    continue;
                }

                for (const dir of directions) {
                    const neighbor = findNodeAt(
                        node.x + dir.dx,
                        node.y + dir.dy
                    );

                    // they find their lovers awwwww!!!
                    if (!neighbor) continue;

                    if (
                        neighbor.id < minID ||
                        neighbor.id > maxID
                    ) {
                        continue;
                    }

                    if (
                        neighbor.id !== node.id &&
                        !linkExists(
                            node.id,
                            neighbor.id
                        )
                    ) {
                        links.push({
                            from: node.id,
                            to: neighbor.id
                        });
                    }
                }
            }
        }

        getNeighbors(args) {
            return JSON.stringify(
                getNodeNeighbors(args.ID)
            );
        }

        linkCount(args) {
            return getNodeNeighbors(args.ID).length;
        }

        linkedNode(args) {
            const neighbors =
                getNodeNeighbors(args.ID);

            const index =
                Math.floor(
                    Scratch.Cast.toNumber(args.INDEX)
                ) - 1;

            if (index < 0) return "";

            return neighbors[index] ?? "";
        }

        goDirection(args) {
            const node = getNode(args.ID);

            if (!node) return "";

            let targetX = node.x;
            let targetY = node.y;

            switch (
                String(args.DIR).toLowerCase()
            ) {
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

                default:
                    return "";
            }

            const target = findNodeAt(
                targetX,
                targetY
            );

            if (!target) return "";

            if (
                !linkExists(node.id, target.id)
            ) {
                return "";
            }

            return target.id;
        }

        linkCountTotal() {
            return links.length;
        }

        allLinks() {
            return JSON.stringify(links);
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

            let id = this.highestNodeID() + 1;

            for (let y = maxY; y >= minY; y--) {
                for (
                    let x = minX;
                    x <= maxX;
                    x++
                ) {
                    if (findNodeAt(x, y)) {
                        continue;
                    }

                    nodes.set(id, {
                        id,
                        x,
                        y
                    });

                    id++;
                }
            }
        }
    }

    Scratch.extensions.register(
        new NodeSystem()
    );
})(Scratch);
