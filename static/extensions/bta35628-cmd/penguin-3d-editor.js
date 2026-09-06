(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("Penguin 3D Editor must run unsandboxed.");
    }

    class Penguin3DEditor {
        constructor() {
            this.world = new Map();
            this.blockTypes = new Map();

            this.worldSize = {
                x: 32,
                y: 16,
                z: 32
            };

            this.camera = {
                x: 8,
                y: 8,
                z: 14,
                rotX: -25,
                rotY: 45,
                zoom: 35
            };

            this.ray = {
                originX: 0,
                originY: 0,
                originZ: 0,
                directionX: 0,
                directionY: 0,
                directionZ: 1,
                maxDistance: 100,
                stepSize: 0.1,
                hit: false,
                x: 0,
                y: 0,
                z: 0,
                blockX: 0,
                blockY: 0,
                blockZ: 0,
                distance: 0,
                type: ""
            };

            this.cameraRay = {
                ...this.ray
            };

            this.canvas = null;
            this.ctx = null;
            this.container = null;

            this.editorVisible = false;
            this.gridVisible = true;
            this.axesVisible = true;

            this.selectedBlock = "grass";

            this.createDefaultBlockTypes();
        }

        /* =====================================================
           BASIC
        ===================================================== */

        num(value, fallback = 0) {
            const n = Number(value);
            return Number.isFinite(n) ? n : fallback;
        }

        key(x, y, z) {
            return `${Math.floor(x)},${Math.floor(y)},${Math.floor(z)}`;
        }

        /* =====================================================
           BLOCK TYPES
        ===================================================== */

        createDefaultBlockTypes() {
            const defaults = {
                grass: "#58a942",
                dirt: "#8b5a2b",
                stone: "#888888",
                wood: "#9b642f",
                sand: "#d8c27c",
                water: "#3b82c4",
                glass: "#8ed8e8",
                brick: "#a84b35",
                metal: "#777f87",
                ice: "#bde8ff",
                snow: "#eeeeee",
                lava: "#e85d24",
                gold: "#d6a928",
                diamond: "#4fd6df"
            };

            for (const name of Object.keys(defaults)) {
                this.blockTypes.set(name, {
                    id: name,
                    texture: name,
                    color: defaults[name]
                });
            }
        }

        textureColor(texture) {
            const colors = {
                grass: "#58a942",
                dirt: "#8b5a2b",
                stone: "#888888",
                wood: "#9b642f",
                sand: "#d8c27c",
                water: "#3b82c4",
                glass: "#8ed8e8",
                brick: "#a84b35",
                metal: "#777f87",
                ice: "#bde8ff",
                snow: "#eeeeee",
                lava: "#e85d24",
                gold: "#d6a928",
                diamond: "#4fd6df"
            };

            return (
                colors[String(texture).toLowerCase()] ||
                "#9b59b6"
            );
        }

        /* =====================================================
           EXTENSION INFO
        ===================================================== */

        getInfo() {
            return {
                id: "bta35628cmdpenguin3deditor",
                name: "Penguin 3D Editor",

                color1: "#4C97FF",
                color2: "#3373CC",
                color3: "#2855A8",

                blocks: [

                    /* =========================
                       3D WORLD
                    ========================= */

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "3D World"
                    },

                    {
                        opcode: "createCube",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Create cube x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    {
                        opcode: "createBlock",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Create block type [TYPE] x: [X] y: [Y] z: [Z]",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "grass"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    {
                        opcode: "setBlockTexture",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set block texture to [TEXTURE]",
                        arguments: {
                            TEXTURE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "grass"
                            }
                        }
                    },

                    {
                        opcode: "deleteBlock",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Delete block at x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    {
                        opcode: "clearWorld",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Clear 3D world"
                    },

                    {
                        opcode: "fillBox",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Fill box x: [X] y: [Y] z: [Z] size x: [SX] y: [SY] z: [SZ] with [TYPE]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            SX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            },
                            SY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            SZ: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "grass"
                            }
                        }
                    },

                    {
                        opcode: "setWorldSize",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set world size x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 32
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 16
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 32
                            }
                        }
                    },

                    {
                        opcode: "blockExists",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Block exists at x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    {
                        opcode: "getBlockType",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Block type at x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    {
                        opcode: "countBlocks",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Number of blocks"
                    },

                    {
                        opcode: "countType",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Number of blocks of type [TYPE]",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "grass"
                            }
                        }
                    },

                    {
                        opcode: "createBlockType",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Create block type [TYPE] with texture [TEXTURE]",
                        arguments: {
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "brick"
                            },
                            TEXTURE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "brick"
                            }
                        }
                    },

                    /* =========================
                       WORLD DATA
                    ========================= */

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "World Data"
                    },

                    {
                        opcode: "exportJSON",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Export world as JSON"
                    },

                    {
                        opcode: "importJSON",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Import world from JSON [JSON]",
                        arguments: {
                            JSON: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"version":1,"blocks":[]}'
                            }
                        }
                    },

                    {
                        opcode: "createWorldFromMap",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Create world from map [MAP]",
                        arguments: {
                            MAP: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue:
                                    "11111\n" +
                                    "10001\n" +
                                    "10001\n" +
                                    "11111"
                            }
                        }
                    },

                    {
                        opcode: "exportMap",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Export world as map"
                    },

                    {
                        opcode: "saveWorld",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Save current world"
                    },

                    {
                        opcode: "loadWorld",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Load saved world"
                    },

                    /* =========================
                       CAMERA
                    ========================= */

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Camera"
                    },

                    {
                        opcode: "setCameraPosition",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set camera x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 8
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 8
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 14
                            }
                        }
                    },

                    {
                        opcode: "setCameraRotation",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set camera rotation X: [X] Y: [Y]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -25
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 45
                            }
                        }
                    },

                    {
                        opcode: "setCameraZoom",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set camera zoom to [ZOOM]",
                        arguments: {
                            ZOOM: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 35
                            }
                        }
                    },

                    {
                        opcode: "moveCamera",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Move camera x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    /* =========================
                       RAYCASTING
                    ========================= */

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "3D Raycasting"
                    },

                    {
                        opcode: "setRayOrigin",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set ray origin x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    {
                        opcode: "setRayDirection",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set ray direction x: [X] y: [Y] z: [Z]",
                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            Z: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "castRay",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Cast ray max distance [DISTANCE]",
                        arguments: {
                            DISTANCE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },

                    {
                        opcode: "rayHit",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Ray hit?"
                    },

                    {
                        opcode: "rayHitX",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ray hit x"
                    },

                    {
                        opcode: "rayHitY",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ray hit y"
                    },

                    {
                        opcode: "rayHitZ",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ray hit z"
                    },

                    {
                        opcode: "rayHitBlockX",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ray hit block X"
                    },

                    {
                        opcode: "rayHitBlockY",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ray hit block Y"
                    },

                    {
                        opcode: "rayHitBlockZ",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ray hit block Z"
                    },

                    {
                        opcode: "rayHitDistance",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ray hit distance"
                    },

                    {
                        opcode: "rayHitType",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Ray hit block type"
                    },

                    {
                        opcode: "castRayFromCamera",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Cast ray from camera max distance [DISTANCE]",
                        arguments: {
                            DISTANCE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100
                            }
                        }
                    },

                    {
                        opcode: "cameraRayHit",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "Camera ray hit?"
                    },

                    {
                        opcode: "cameraRayDistance",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Camera ray hit distance"
                    },

                    {
                        opcode: "cameraRayType",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Camera ray hit block type"
                    },

                    {
                        opcode: "cameraRayX",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Camera ray hit block X"
                    },

                    {
                        opcode: "cameraRayY",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Camera ray hit block Y"
                    },

                    {
                        opcode: "cameraRayZ",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "Camera ray hit block Z"
                    },

                    {
                        opcode: "setRayStep",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Set ray step size to [STEP]",
                        arguments: {
                            STEP: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0.1
                            }
                        }
                    },

                    /* =========================
                       EDITOR
                    ========================= */

                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Editor"
                    },

                    {
                        opcode: "showEditor",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Show 3D editor"
                    },

                    {
                        opcode: "hideEditor",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Hide 3D editor"
                    },

                    {
                        opcode: "toggleGrid",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Toggle 3D grid"
                    },

                    {
                        opcode: "toggleAxes",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Toggle XYZ axes"
                    },

                    {
                        opcode: "renderWorld",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Render 3D world"
                    }
                ]
            };
        }

        /* =====================================================
           WORLD OPERATIONS
        ===================================================== */

        createCube(args) {
            this.createBlock({
                TYPE: "cube",
                X: args.X,
                Y: args.Y,
                Z: args.Z
            });
        }

        createBlock(args) {
            const type = String(
                args.TYPE || "grass"
            )
                .trim()
                .toLowerCase();

            const x = Math.floor(
                this.num(args.X)
            );

            const y = Math.floor(
                this.num(args.Y)
            );

            const z = Math.floor(
                this.num(args.Z)
            );

            if (!this.blockTypes.has(type)) {
                this.createBlockType({
                    TYPE: type,
                    TEXTURE: type
                });
            }

            this.world.set(
                this.key(x, y, z),
                {
                    x,
                    y,
                    z,
                    type
                }
            );

            this.render();
        }

        setBlockTexture(args) {
            const texture = String(
                args.TEXTURE || "grass"
            )
                .trim()
                .toLowerCase();

            this.selectedBlock = texture;

            if (!this.blockTypes.has(texture)) {
                this.createBlockType({
                    TYPE: texture,
                    TEXTURE: texture
                });
            }

            this.render();
        }

        deleteBlock(args) {
            const x = Math.floor(
                this.num(args.X)
            );

            const y = Math.floor(
                this.num(args.Y)
            );

            const z = Math.floor(
                this.num(args.Z)
            );

            this.world.delete(
                this.key(x, y, z)
            );

            this.render();
        }

        clearWorld() {
            this.world.clear();
            this.render();
        }

        fillBox(args) {
            const x = Math.floor(
                this.num(args.X)
            );

            const y = Math.floor(
                this.num(args.Y)
            );

            const z = Math.floor(
                this.num(args.Z)
            );

            const sx = Math.max(
                1,
                Math.floor(
                    this.num(args.SX, 1)
                )
            );

            const sy = Math.max(
                1,
                Math.floor(
                    this.num(args.SY, 1)
                )
            );

            const sz = Math.max(
                1,
                Math.floor(
                    this.num(args.SZ, 1)
                )
            );

            const type = String(
                args.TYPE || "grass"
            )
                .trim()
                .toLowerCase();

            if (!this.blockTypes.has(type)) {
                this.createBlockType({
                    TYPE: type,
                    TEXTURE: type
                });
            }

            for (
                let ix = 0;
                ix < sx;
                ix++
            ) {
                for (
                    let iy = 0;
                    iy < sy;
                    iy++
                ) {
                    for (
                        let iz = 0;
                        iz < sz;
                        iz++
                    ) {
                        const bx = x + ix;
                        const by = y + iy;
                        const bz = z + iz;

                        this.world.set(
                            this.key(
                                bx,
                                by,
                                bz
                            ),
                            {
                                x: bx,
                                y: by,
                                z: bz,
                                type
                            }
                        );
                    }
                }
            }

            this.render();
        }

        setWorldSize(args) {
            this.worldSize.x = Math.max(
                1,
                Math.floor(
                    this.num(
                        args.X,
                        32
                    )
                )
            );

            this.worldSize.y = Math.max(
                1,
                Math.floor(
                    this.num(
                        args.Y,
                        16
                    )
                )
            );

            this.worldSize.z = Math.max(
                1,
                Math.floor(
                    this.num(
                        args.Z,
                        32
                    )
                )
            );

            this.render();
        }

        blockExists(args) {
            return this.world.has(
                this.key(
                    this.num(args.X),
                    this.num(args.Y),
                    this.num(args.Z)
                )
            );
        }

        getBlockType(args) {
            const block =
                this.world.get(
                    this.key(
                        this.num(args.X),
                        this.num(args.Y),
                        this.num(args.Z)
                    )
                );

            return block
                ? block.type
                : "";
        }

        countBlocks() {
            return this.world.size;
        }

        countType(args) {
            const type = String(
                args.TYPE || ""
            )
                .trim()
                .toLowerCase();

            let count = 0;

            for (
                const block of this.world.values()
            ) {
                if (
                    block.type === type
                ) {
                    count++;
                }
            }

            return count;
        }

        createBlockType(args) {
            const type = String(
                args.TYPE || "block"
            )
                .trim()
                .toLowerCase();

            const texture = String(
                args.TEXTURE || type
            )
                .trim()
                .toLowerCase();

            this.blockTypes.set(
                type,
                {
                    id: type,
                    texture,
                    color:
                        this.textureColor(
                            texture
                        )
                }
            );

            this.selectedBlock = type;

            this.render();
        }

        /* =====================================================
           JSON
        ===================================================== */

        exportJSON() {
            const blocks = [];

            for (
                const block of this.world.values()
            ) {
                blocks.push({
                    x: block.x,
                    y: block.y,
                    z: block.z,
                    type: block.type
                });
            }

            return JSON.stringify({
                version: 1,
                size: this.worldSize,
                blocks
            });
        }

        importJSON(args) {
            try {
                const data =
                    JSON.parse(
                        String(
                            args.JSON || "{}"
                        )
                    );

                this.world.clear();

                if (data.size) {
                    this.worldSize.x =
                        this.num(
                            data.size.x,
                            32
                        );

                    this.worldSize.y =
                        this.num(
                            data.size.y,
                            16
                        );

                    this.worldSize.z =
                        this.num(
                            data.size.z,
                            32
                        );
                }

                if (
                    Array.isArray(
                        data.blocks
                    )
                ) {
                    for (
                        const block of data.blocks
                    ) {
                        const x =
                            Math.floor(
                                this.num(
                                    block.x
                                )
                            );

                        const y =
                            Math.floor(
                                this.num(
                                    block.y
                                )
                            );

                        const z =
                            Math.floor(
                                this.num(
                                    block.z
                                )
                            );

                        const type =
                            String(
                                block.type ||
                                "grass"
                            );

                        if (
                            !this.blockTypes.has(
                                type
                            )
                        ) {
                            this.createBlockType({
                                TYPE: type,
                                TEXTURE: type
                            });
                        }

                        this.world.set(
                            this.key(
                                x,
                                y,
                                z
                            ),
                            {
                                x,
                                y,
                                z,
                                type
                            }
                        );
                    }
                }

                this.render();

            } catch (e) {
                console.warn(
                    "Penguin 3D Editor: Invalid JSON.",
                    e
                );
            }
        }

        /* =====================================================
           NUMBER MAP
        ===================================================== */

        createWorldFromMap(args) {
            const map =
                String(
                    args.MAP || ""
                );

            const lines =
                map
                    .split(/\r?\n/)
                    .filter(
                        line =>
                            line.length > 0
                    );

            this.world.clear();

            for (
                let z = 0;
                z < lines.length;
                z++
            ) {
                const line =
                    lines[z];

                for (
                    let x = 0;
                    x < line.length;
                    x++
                ) {
                    const char =
                        line[x];

                    let type = null;

                    if (
                        char === "1" ||
                        char === "#"
                    ) {
                        type = "grass";
                    } else if (
                        char === "2"
                    ) {
                        type = "stone";
                    } else if (
                        char === "3"
                    ) {
                        type = "wood";
                    } else if (
                        char === "4"
                    ) {
                        type = "sand";
                    } else if (
                        char === "5"
                    ) {
                        type = "water";
                    }

                    if (type) {
                        this.world.set(
                            this.key(
                                x,
                                0,
                                z
                            ),
                            {
                                x,
                                y: 0,
                                z,
                                type
                            }
                        );
                    }
                }
            }

            this.render();
        }

        exportMap() {
            if (
                this.world.size === 0
            ) {
                return "";
            }

            let maxX = 0;
            let maxZ = 0;

            for (
                const block of this.world.values()
            ) {
                maxX =
                    Math.max(
                        maxX,
                        block.x
                    );

                maxZ =
                    Math.max(
                        maxZ,
                        block.z
                    );
            }

            const rows = [];

            for (
                let z = 0;
                z <= maxZ;
                z++
            ) {
                let row = "";

                for (
                    let x = 0;
                    x <= maxX;
                    x++
                ) {
                    const block =
                        this.world.get(
                            this.key(
                                x,
                                0,
                                z
                            )
                        );

                    if (!block) {
                        row += "0";
                    } else {
                        row +=
                            this.typeToMap(
                                block.type
                            );
                    }
                }

                rows.push(row);
            }

            return rows.join("\n");
        }

        typeToMap(type) {
            switch (type) {
                case "grass":
                    return "1";

                case "stone":
                    return "2";

                case "wood":
                    return "3";

                case "sand":
                    return "4";

                case "water":
                    return "5";

                default:
                    return "1";
            }
        }

        saveWorld() {
            try {
                localStorage.setItem(
                    "penguin3d-world",
                    this.exportJSON()
                );
            } catch (e) {
                console.warn(e);
            }
        }

        loadWorld() {
            try {
                const data =
                    localStorage.getItem(
                        "penguin3d-world"
                    );

                if (data) {
                    this.importJSON({
                        JSON: data
                    });
                }
            } catch (e) {
                console.warn(e);
            }
        }

        /* =====================================================
           CAMERA
        ===================================================== */

        setCameraPosition(args) {
            this.camera.x =
                this.num(
                    args.X,
                    8
                );

            this.camera.y =
                this.num(
                    args.Y,
                    8
                );

            this.camera.z =
                this.num(
                    args.Z,
                    14
                );

            this.render();
        }

        setCameraRotation(args) {
            this.camera.rotX =
                this.num(
                    args.X,
                    -25
                );

            this.camera.rotY =
                this.num(
                    args.Y,
                    45
                );

            this.render();
        }

        setCameraZoom(args) {
            this.camera.zoom =
                Math.max(
                    5,
                    Math.min(
                        150,
                        this.num(
                            args.ZOOM,
                            35
                        )
                    )
                );

            this.render();
        }

        moveCamera(args) {
            this.camera.x +=
                this.num(args.X);

            this.camera.y +=
                this.num(args.Y);

            this.camera.z +=
                this.num(args.Z);

            this.render();
        }

        /* =====================================================
           DDA VOXEL RAYCASTING
        ===================================================== */

        normalizeDirection(
            x,
            y,
            z
        ) {
            const length =
                Math.sqrt(
                    x * x +
                    y * y +
                    z * z
                );

            if (
                length < 0.000001
            ) {
                return {
                    x: 0,
                    y: 0,
                    z: 1
                };
            }

            return {
                x: x / length,
                y: y / length,
                z: z / length
            };
        }

        raycast(
            ox,
            oy,
            oz,
            dx,
            dy,
            dz,
            maxDistance
        ) {
            const direction =
                this.normalizeDirection(
                    dx,
                    dy,
                    dz
                );

            dx = direction.x;
            dy = direction.y;
            dz = direction.z;

            let x =
                Math.floor(ox);

            let y =
                Math.floor(oy);

            let z =
                Math.floor(oz);

            /*
             * If the ray starts inside a block,
             * report that block immediately.
             */
            const startKey =
                this.key(
                    x,
                    y,
                    z
                );

            if (
                this.world.has(
                    startKey
                )
            ) {
                const block =
                    this.world.get(
                        startKey
                    );

                return {
                    hit: true,

                    x: ox,
                    y: oy,
                    z: oz,

                    blockX: x,
                    blockY: y,
                    blockZ: z,

                    distance: 0,

                    type: block.type
                };
            }

            const stepX =
                dx > 0
                    ? 1
                    : -1;

            const stepY =
                dy > 0
                    ? 1
                    : -1;

            const stepZ =
                dz > 0
                    ? 1
                    : -1;

            const tDeltaX =
                dx === 0
                    ? Infinity
                    : Math.abs(
                        1 / dx
                    );

            const tDeltaY =
                dy === 0
                    ? Infinity
                    : Math.abs(
                        1 / dy
                    );

            const tDeltaZ =
                dz === 0
                    ? Infinity
                    : Math.abs(
                        1 / dz
                    );

            let tMaxX;

            if (dx > 0) {
                tMaxX =
                    ((x + 1) - ox) /
                    dx;
            } else if (dx < 0) {
                tMaxX =
                    (ox - x) /
                    -dx;
            } else {
                tMaxX = Infinity;
            }

            let tMaxY;

            if (dy > 0) {
                tMaxY =
                    ((y + 1) - oy) /
                    dy;
            } else if (dy < 0) {
                tMaxY =
                    (oy - y) /
                    -dy;
            } else {
                tMaxY = Infinity;
            }

            let tMaxZ;

            if (dz > 0) {
                tMaxZ =
                    ((z + 1) - oz) /
                    dz;
            } else if (dz < 0) {
                tMaxZ =
                    (oz - z) /
                    -dz;
            } else {
                tMaxZ = Infinity;
            }

            let distance = 0;

            /*
             * Safety limit.
             */
            const maxSteps =
                Math.ceil(
                    maxDistance * 4
                ) + 32;

            for (
                let step = 0;
                step < maxSteps;
                step++
            ) {
                if (
                    tMaxX <
                    tMaxY &&
                    tMaxX <
                    tMaxZ
                ) {
                    x += stepX;

                    distance =
                        tMaxX;

                    tMaxX +=
                        tDeltaX;

                } else if (
                    tMaxY <
                    tMaxZ
                ) {
                    y += stepY;

                    distance =
                        tMaxY;

                    tMaxY +=
                        tDeltaY;

                } else {
                    z += stepZ;

                    distance =
                        tMaxZ;

                    tMaxZ +=
                        tDeltaZ;
                }

                if (
                    distance >
                    maxDistance
                ) {
                    break;
                }

                const block =
                    this.world.get(
                        this.key(
                            x,
                            y,
                            z
                        )
                    );

                if (block) {
                    return {
                        hit: true,

                        x:
                            ox +
                            dx *
                            distance,

                        y:
                            oy +
                            dy *
                            distance,

                        z:
                            oz +
                            dz *
                            distance,

                        blockX: x,
                        blockY: y,
                        blockZ: z,

                        distance,

                        type: block.type
                    };
                }
            }

            return {
                hit: false,

                x: 0,
                y: 0,
                z: 0,

                blockX: 0,
                blockY: 0,
                blockZ: 0,

                distance:
                    maxDistance,

                type: ""
            };
        }

        /* =====================================================
           RAY BLOCKS
        ===================================================== */

        setRayOrigin(args) {
            this.ray.originX =
                this.num(args.X);

            this.ray.originY =
                this.num(args.Y);

            this.ray.originZ =
                this.num(args.Z);
        }

        setRayDirection(args) {
            this.ray.directionX =
                this.num(args.X);

            this.ray.directionY =
                this.num(args.Y);

            this.ray.directionZ =
                this.num(args.Z);
        }

        castRay(args) {
            const maxDistance =
                Math.max(
                    0,
                    this.num(
                        args.DISTANCE,
                        100
                    )
                );

            const result =
                this.raycast(
                    this.ray.originX,
                    this.ray.originY,
                    this.ray.originZ,

                    this.ray.directionX,
                    this.ray.directionY,
                    this.ray.directionZ,

                    maxDistance
                );

            this.ray = {
                ...this.ray,
                ...result,
                maxDistance
            };

            this.render();
        }

        rayHit() {
            return !!this.ray.hit;
        }

        rayHitX() {
            return this.ray.hit
                ? this.ray.x
                : "";
        }

        rayHitY() {
            return this.ray.hit
                ? this.ray.y
                : "";
        }

        rayHitZ() {
            return this.ray.hit
                ? this.ray.z
                : "";
        }

        rayHitBlockX() {
            return this.ray.hit
                ? this.ray.blockX
                : "";
        }

        rayHitBlockY() {
            return this.ray.hit
                ? this.ray.blockY
                : "";
        }

        rayHitBlockZ() {
            return this.ray.hit
                ? this.ray.blockZ
                : "";
        }

        rayHitDistance() {
            return this.ray.hit
                ? this.ray.distance
                : "";
        }

        rayHitType() {
            return this.ray.hit
                ? this.ray.type
                : "";
        }

        /* =====================================================
           CAMERA RAY
        ===================================================== */

        cameraDirection() {
            const pitch =
                this.camera.rotX *
                Math.PI / 180;

            const yaw =
                this.camera.rotY *
                Math.PI / 180;

            const cosPitch =
                Math.cos(pitch);

            const sinPitch =
                Math.sin(pitch);

            const cosYaw =
                Math.cos(yaw);

            const sinYaw =
                Math.sin(yaw);

            return {
                x:
                    sinYaw *
                    cosPitch,

                y:
                    -sinPitch,

                z:
                    cosYaw *
                    cosPitch
            };
        }

        castRayFromCamera(args) {
            const direction =
                this.cameraDirection();

            const maxDistance =
                Math.max(
                    0,
                    this.num(
                        args.DISTANCE,
                        100
                    )
                );

            const result =
                this.raycast(
                    this.camera.x,
                    this.camera.y,
                    this.camera.z,

                    direction.x,
                    direction.y,
                    direction.z,

                    maxDistance
                );

            this.cameraRay = {
                ...result,

                maxDistance,

                originX:
                    this.camera.x,

                originY:
                    this.camera.y,

                originZ:
                    this.camera.z,

                directionX:
                    direction.x,

                directionY:
                    direction.y,

                directionZ:
                    direction.z
            };

            this.render();
        }

        cameraRayHit() {
            return !!this.cameraRay.hit;
        }

        cameraRayDistance() {
            return this.cameraRay.hit
                ? this.cameraRay.distance
                : "";
        }

        cameraRayType() {
            return this.cameraRay.hit
                ? this.cameraRay.type
                : "";
        }

        cameraRayX() {
            return this.cameraRay.hit
                ? this.cameraRay.blockX
                : "";
        }

        cameraRayY() {
            return this.cameraRay.hit
                ? this.cameraRay.blockY
                : "";
        }

        cameraRayZ() {
            return this.cameraRay.hit
                ? this.cameraRay.blockZ
                : "";
        }

        setRayStep(args) {
            this.ray.stepSize =
                Math.max(
                    0.001,
                    this.num(
                        args.STEP,
                        0.1
                    )
                );
        }

        /* =====================================================
           EDITOR WINDOW
        ===================================================== */

        showEditor() {
            this.createCanvas();

            this.editorVisible = true;

            if (this.container) {
                this.container.style.display =
                    "block";
            }

            this.render();
        }

        hideEditor() {
            this.editorVisible = false;

            if (this.container) {
                this.container.style.display =
                    "none";
            }
        }

        toggleGrid() {
            this.gridVisible =
                !this.gridVisible;

            this.render();
        }

        toggleAxes() {
            this.axesVisible =
                !this.axesVisible;

            this.render();
        }

        renderWorld() {
            this.render();
        }

        /* =====================================================
           CENTERED CANVAS
        ===================================================== */

        createCanvas() {
            if (this.canvas) {
                return;
            }

            this.container =
                document.createElement("div");

            /*
             * CENTER THE EDITOR
             */
            this.container.style.position =
                "fixed";

            this.container.style.left =
                "50%";

            this.container.style.top =
                "50%";

            this.container.style.transform =
                "translate(-50%, -50%)";

            /*
             * RESPONSIVE SIZE
             */
            this.container.style.width =
                "min(800px, 90vw)";

            this.container.style.height =
                "min(600px, 80vh)";

            this.container.style.zIndex =
                "999999";

            this.container.style.background =
                "#10151c";

            this.container.style.border =
                "2px solid #4C97FF";

            this.container.style.borderRadius =
                "10px";

            this.container.style.overflow =
                "hidden";

            this.container.style.boxShadow =
                "0 10px 40px rgba(0,0,0,.45)";

            this.canvas =
                document.createElement(
                    "canvas"
                );

            /*
             * INTERNAL RENDERING RESOLUTION
             */
            this.canvas.width = 800;
            this.canvas.height = 600;

            /*
             * FIT CANVAS TO WINDOW
             */
            this.canvas.style.width =
                "100%";

            this.canvas.style.height =
                "100%";

            this.canvas.style.display =
                "block";

            this.container.appendChild(
                this.canvas
            );

            document.body.appendChild(
                this.container
            );

            this.ctx =
                this.canvas.getContext(
                    "2d"
                );

            this.setupMouseControls();
        }

        setupMouseControls() {
            let dragging = false;

            let lastX = 0;
            let lastY = 0;

            this.canvas.addEventListener(
                "mousedown",
                e => {
                    dragging = true;

                    lastX =
                        e.clientX;

                    lastY =
                        e.clientY;
                }
            );

            window.addEventListener(
                "mouseup",
                () => {
                    dragging = false;
                }
            );

            window.addEventListener(
                "mousemove",
                e => {
                    if (
                        !dragging ||
                        !this.editorVisible
                    ) {
                        return;
                    }

                    const dx =
                        e.clientX -
                        lastX;

                    const dy =
                        e.clientY -
                        lastY;

                    lastX =
                        e.clientX;

                    lastY =
                        e.clientY;

                    this.camera.rotY +=
                        dx * 0.5;

                    this.camera.rotX +=
                        dy * 0.5;

                    this.camera.rotX =
                        Math.max(
                            -89,
                            Math.min(
                                89,
                                this.camera.rotX
                            )
                        );

                    this.render();
                }
            );

            this.canvas.addEventListener(
                "wheel",
                e => {
                    e.preventDefault();

                    this.camera.zoom -=
                        e.deltaY * 0.03;

                    this.camera.zoom =
                        Math.max(
                            5,
                            Math.min(
                                150,
                                this.camera.zoom
                            )
                        );

                    this.render();
                },
                {
                    passive: false
                }
            );
        }

        /* =====================================================
           3D PROJECTION
        ===================================================== */

        project(x, y, z) {
            const rx =
                this.camera.rotX *
                Math.PI / 180;

            const ry =
                this.camera.rotY *
                Math.PI / 180;

            let px =
                x - this.camera.x;

            let py =
                y - this.camera.y;

            let pz =
                z - this.camera.z;

            const cosY =
                Math.cos(ry);

            const sinY =
                Math.sin(ry);

            const x1 =
                px * cosY -
                pz * sinY;

            const z1 =
                px * sinY +
                pz * cosY;

            const cosX =
                Math.cos(rx);

            const sinX =
                Math.sin(rx);

            const y1 =
                py * cosX -
                z1 * sinX;

            const z2 =
                py * sinX +
                z1 * cosX;

            const scale =
                this.camera.zoom /
                Math.max(
                    1,
                    z2 + 20
                );

            return {
                x:
                    400 +
                    x1 * scale,

                y:
                    300 -
                    y1 * scale,

                depth: z2
            };
        }

        /* =====================================================
           CUBE RENDER
        ===================================================== */

        drawCube(block) {
            const x = block.x;
            const y = block.y;
            const z = block.z;

            const points = [
                this.project(
                    x,
                    y,
                    z
                ),

                this.project(
                    x + 1,
                    y,
                    z
                ),

                this.project(
                    x + 1,
                    y + 1,
                    z
                ),

                this.project(
                    x,
                    y + 1,
                    z
                ),

                this.project(
                    x,
                    y,
                    z + 1
                ),

                this.project(
                    x + 1,
                    y,
                    z + 1
                ),

                this.project(
                    x + 1,
                    y + 1,
                    z + 1
                ),

                this.project(
                    x,
                    y + 1,
                    z + 1
                )
            ];

            const info =
                this.blockTypes.get(
                    block.type
                ) || {
                    color:
                        this.textureColor(
                            block.type
                        )
                };

            const base =
                info.color ||
                "#999999";

            const dark =
                this.shade(
                    base,
                    -35
                );

            const light =
                this.shade(
                    base,
                    25
                );

            /*
             * TOP
             */
            this.face(
                [
                    points[3],
                    points[2],
                    points[6],
                    points[7]
                ],
                light
            );

            /*
             * FRONT
             */
            this.face(
                [
                    points[0],
                    points[1],
                    points[2],
                    points[3]
                ],
                base
            );

            /*
             * SIDE
             */
            this.face(
                [
                    points[1],
                    points[5],
                    points[6],
                    points[2]
                ],
                dark
            );

            const ctx =
                this.ctx;

            ctx.strokeStyle =
                "rgba(0,0,0,.35)";

            ctx.lineWidth = 1;

            const edges = [
                [0, 1],
                [1, 2],
                [2, 3],
                [3, 0],

                [4, 5],
                [5, 6],
                [6, 7],
                [7, 4],

                [0, 4],
                [1, 5],
                [2, 6],
                [3, 7]
            ];

            for (
                const edge of edges
            ) {
                ctx.beginPath();

                ctx.moveTo(
                    points[
                        edge[0]
                    ].x,
                    points[
                        edge[0]
                    ].y
                );

                ctx.lineTo(
                    points[
                        edge[1]
                    ].x,
                    points[
                        edge[1]
                    ].y
                );

                ctx.stroke();
            }
        }

        face(points, color) {
            const ctx =
                this.ctx;

            ctx.beginPath();

            ctx.moveTo(
                points[0].x,
                points[0].y
            );

            for (
                let i = 1;
                i < points.length;
                i++
            ) {
                ctx.lineTo(
                    points[i].x,
                    points[i].y
                );
            }

            ctx.closePath();

            ctx.fillStyle =
                color;

            ctx.fill();
        }

        shade(hex, amount) {
            let color =
                String(hex)
                    .replace("#", "");

            if (
                color.length !== 6
            ) {
                return hex;
            }

            let r =
                parseInt(
                    color.substring(
                        0,
                        2
                    ),
                    16
                );

            let g =
                parseInt(
                    color.substring(
                        2,
                        4
                    ),
                    16
                );

            let b =
                parseInt(
                    color.substring(
                        4,
                        6
                    ),
                    16
                );

            r = Math.max(
                0,
                Math.min(
                    255,
                    r + amount
                )
            );

            g = Math.max(
                0,
                Math.min(
                    255,
                    g + amount
                )
            );

            b = Math.max(
                0,
                Math.min(
                    255,
                    b + amount
                )
            );

            return (
                "#" +
                r.toString(16)
                    .padStart(2, "0") +
                g.toString(16)
                    .padStart(2, "0") +
                b.toString(16)
                    .padStart(2, "0")
            );
        }

        /* =====================================================
           GRID
        ===================================================== */

        drawGrid() {
            if (
                !this.gridVisible
            ) {
                return;
            }

            const ctx =
                this.ctx;

            ctx.lineWidth = 1;

            ctx.strokeStyle =
                "rgba(255,255,255,.10)";

            const size =
                Math.min(
                    20,
                    Math.max(
                        this.worldSize.x,
                        this.worldSize.z
                    )
                );

            for (
                let i = 0;
                i <= size;
                i++
            ) {
                const a =
                    this.project(
                        i,
                        0,
                        0
                    );

                const b =
                    this.project(
                        i,
                        0,
                        size
                    );

                ctx.beginPath();

                ctx.moveTo(
                    a.x,
                    a.y
                );

                ctx.lineTo(
                    b.x,
                    b.y
                );

                ctx.stroke();

                const c =
                    this.project(
                        0,
                        0,
                        i
                    );

                const d =
                    this.project(
                        size,
                        0,
                        i
                    );

                ctx.beginPath();

                ctx.moveTo(
                    c.x,
                    c.y
                );

                ctx.lineTo(
                    d.x,
                    d.y
                );

                ctx.stroke();
            }
        }

        /* =====================================================
           AXES
        ===================================================== */

        drawAxes() {
            if (
                !this.axesVisible
            ) {
                return;
            }

            const ctx =
                this.ctx;

            const origin =
                this.project(
                    0,
                    0,
                    0
                );

            const x =
                this.project(
                    4,
                    0,
                    0
                );

            const y =
                this.project(
                    0,
                    4,
                    0
                );

            const z =
                this.project(
                    0,
                    0,
                    4
                );

            ctx.lineWidth = 3;

            ctx.strokeStyle =
                "#e74c3c";

            ctx.beginPath();

            ctx.moveTo(
                origin.x,
                origin.y
            );

            ctx.lineTo(
                x.x,
                x.y
            );

            ctx.stroke();

            ctx.strokeStyle =
                "#2ecc71";

            ctx.beginPath();

            ctx.moveTo(
                origin.x,
                origin.y
            );

            ctx.lineTo(
                y.x,
                y.y
            );

            ctx.stroke();

            ctx.strokeStyle =
                "#3498db";

            ctx.beginPath();

            ctx.moveTo(
                origin.x,
                origin.y
            );

            ctx.lineTo(
                z.x,
                z.y
            );

            ctx.stroke();

            ctx.font =
                "bold 14px Arial";

            ctx.fillStyle =
                "#e74c3c";

            ctx.fillText(
                "X",
                x.x,
                x.y
            );

            ctx.fillStyle =
                "#2ecc71";

            ctx.fillText(
                "Y",
                y.x,
                y.y
            );

            ctx.fillStyle =
                "#3498db";

            ctx.fillText(
                "Z",
                z.x,
                z.y
            );
        }

        /* =====================================================
           RAY VISUALIZATION
        ===================================================== */

        drawRay() {
            if (
                !this.cameraRay.hit
            ) {
                return;
            }

            const start =
                this.project(
                    this.cameraRay.originX,
                    this.cameraRay.originY,
                    this.cameraRay.originZ
                );

            const end =
                this.project(
                    this.cameraRay.x,
                    this.cameraRay.y,
                    this.cameraRay.z
                );

            const ctx =
                this.ctx;

            ctx.strokeStyle =
                "#ffff00";

            ctx.lineWidth = 2;

            ctx.beginPath();

            ctx.moveTo(
                start.x,
                start.y
            );

            ctx.lineTo(
                end.x,
                end.y
            );

            ctx.stroke();

            const hit =
                this.project(
                    this.cameraRay.blockX +
                        0.5,

                    this.cameraRay.blockY +
                        0.5,

                    this.cameraRay.blockZ +
                        0.5
                );

            ctx.fillStyle =
                "#ffff00";

            ctx.beginPath();

            ctx.arc(
                hit.x,
                hit.y,
                5,
                0,
                Math.PI * 2
            );

            ctx.fill();
        }

        /* =====================================================
           HUD
        ===================================================== */

        drawHUD() {
            const ctx =
                this.ctx;

            ctx.fillStyle =
                "rgba(0,0,0,.68)";

            ctx.fillRect(
                10,
                10,
                290,
                125
            );

            ctx.fillStyle =
                "#ffffff";

            ctx.font =
                "bold 15px Arial";

            ctx.fillText(
                "Penguin 3D Editor",
                20,
                32
            );

            ctx.font =
                "12px Arial";

            ctx.fillText(
                `Blocks: ${this.world.size}`,
                20,
                52
            );

            ctx.fillText(
                `Camera: ${Math.round(this.camera.x)}, ${Math.round(this.camera.y)}, ${Math.round(this.camera.z)}`,
                20,
                69
            );

            ctx.fillText(
                "Drag = rotate",
                20,
                87
            );

            ctx.fillText(
                "Wheel = zoom",
                20,
                103
            );

            if (
                this.cameraRay.hit
            ) {
                ctx.fillStyle =
                    "#ffff00";

                ctx.fillText(
                    `Ray: ${this.cameraRay.type}`,
                    20,
                    119
                );
            }
        }

        /* =====================================================
           MAIN RENDER
        ===================================================== */

        render() {
            if (
                !this.editorVisible ||
                !this.canvas
            ) {
                return;
            }

            const ctx =
                this.ctx;

            ctx.clearRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            ctx.fillStyle =
                "#10151c";

            ctx.fillRect(
                0,
                0,
                this.canvas.width,
                this.canvas.height
            );

            this.drawGrid();
            this.drawAxes();

            const blocks =
                Array.from(
                    this.world.values()
                );

            /*
             * Painter's algorithm:
             * far blocks first.
             */
            blocks.sort(
                (a, b) => {
                    const pa =
                        this.project(
                            a.x + 0.5,
                            a.y + 0.5,
                            a.z + 0.5
                        );

                    const pb =
                        this.project(
                            b.x + 0.5,
                            b.y + 0.5,
                            b.z + 0.5
                        );

                    return (
                        pb.depth -
                        pa.depth
                    );
                }
            );

            for (
                const block of blocks
            ) {
                this.drawCube(
                    block
                );
            }

            this.drawRay();
            this.drawHUD();
        }
    }

    Scratch.extensions.register(
        new Penguin3DEditor()
    );

})(Scratch);
