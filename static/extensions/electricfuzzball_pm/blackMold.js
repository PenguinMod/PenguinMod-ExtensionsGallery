//oh yeah its moldin' time
(function (Scratch) {
    "use strict";

    let overlay, canvas, ctx;
    let running = false;
    let growth = 3;

    const GRID_SIZE = 4;
    let cols = 0, rows = 0;
    let grid = new Uint8Array(0);

    function resize() {
        if (!canvas) return;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        cols = Math.ceil(canvas.width / GRID_SIZE);
        rows = Math.ceil(canvas.height / GRID_SIZE);
        grid = new Uint8Array(cols * rows);
    }

    function createOverlay() {
        if (overlay) return;
        overlay = document.createElement("div");
        Object.assign(overlay.style, {
            position: "fixed", left: "0", top: "0", width: "100vw", height: "100vh",
            pointerEvents: "none", zIndex: "999999"
        });
        canvas = document.createElement("canvas");
        canvas.style.width = "100%"; canvas.style.height = "100%";
        overlay.appendChild(canvas);
        document.body.appendChild(overlay);
        ctx = canvas.getContext("2d", { alpha: true });
        resize();
    }

    function step() {
        let nextGrid = new Uint8Array(grid);
        
        for (let y = 1; y < rows - 1; y++) {
            for (let x = 1; x < cols - 1; x++) {
                let i = y * cols + x;
                
                // added a mold age thing
                if (grid[i] > 10) {
                    nextGrid[i] -= 2;
                } else if (grid[i] > 0) {
                    nextGrid[i] = 0;
                }

                // growing the mold
                if (grid[i] === 0) {
                    let neighbors = 0;
                    if (grid[i - cols - 1] > 0) neighbors++;
                    if (grid[i - cols] > 0) neighbors++;
                    if (grid[i - cols + 1] > 0) neighbors++;
                    if (grid[i - 1] > 0) neighbors++;
                    if (grid[i + 1] > 0) neighbors++;
                    if (grid[i + cols - 1] > 0) neighbors++;
                    if (grid[i + cols] > 0) neighbors++;
                    if (grid[i + cols + 1] > 0) neighbors++;

                    if (neighbors > 0 && Math.random() < (neighbors * 0.15)) {
                        nextGrid[i] = 255;
                    }
                }
            }
        }
        grid.set(nextGrid);
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
                let val = grid[y * cols + x];
                if (val > 0) {
                    let size = (GRID_SIZE * 0.8) + (Math.random() * GRID_SIZE * 0.4);
                    let alpha = val / 255;
                    ctx.fillStyle = `rgba(20, 25, 20, ${alpha})`;
                    let ox = (Math.random() - 0.5) * 2;
                    let oy = (Math.random() - 0.5) * 2;
                    ctx.fillRect(x * GRID_SIZE + ox, y * GRID_SIZE + oy, size, size);
                }
            }
        }
    }

    function loop() {
        if (running) {
            for (let i = 0; i < growth; i++) step();
        }
        draw();
        requestAnimationFrame(loop);
    }

    class BlackMold {
        getInfo() {
            return {
                id: "blackmold", name: "Black Mold",
                color1: "#111111",
                color2: "#000000",
                color3: "#222222",
                blocks: [
                    { opcode: "start", blockType: Scratch.BlockType.COMMAND, text: "start black mold" },
                    { opcode: "stop", blockType: Scratch.BlockType.COMMAND, text: "pause black mold" },
                    { opcode: "clear", blockType: Scratch.BlockType.COMMAND, text: "clear black mold" },
                    { opcode: "seed", blockType: Scratch.BlockType.COMMAND, text: "add a spore" },
                    { 
                        opcode: "setGrowth", blockType: Scratch.BlockType.COMMAND, 
                        text: "set mold growth to [G]",
                        arguments: { G: { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 } }
                    }
                ]
            };
        }
        start() { if(!overlay) createOverlay(); running = true; requestAnimationFrame(loop); }
        stop() { running = false; }
        clear() { grid.fill(0); }
        seed() { 
            for (let i = 0; i < 10; i++) {
                let idx = Math.floor(Math.random() * grid.length);
                grid[idx] = 255;
            }
        }
        setGrowth(args) { growth = Math.max(1, Math.min(50, Math.floor(args.G))); }
    }

    Scratch.extensions.register(new BlackMold());
})(Scratch);
// all that glitters is gold
// only shooting stars break the mold
