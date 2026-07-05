class Extension {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.ctx = this.canvas.getContext("2d");

        this.canvas.width = 480;
        this.canvas.height = 360;

        this.seeds = [];
        this.enabled = false;
    }

    getInfo() {
        return {
            id: "blackMold",
            name: "Black Mold",
            color1: "#111111",
            color2: "#000000",
            blocks: [
                {
                    opcode: "start",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "start mold"
                },
                {
                    opcode: "stop",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "stop mold"
                },
                {
                    opcode: "clear",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "clear mold"
                },
                {
                    opcode: "tick",
                    blockType: Scratch.BlockType.COMMAND,
                    text: "grow mold"
                }
            ]
        };
    }

    start() {
        this.enabled = true;

        if (this.seeds.length === 0) {
            this.seeds.push({
                x: Math.random() * 480,
                y: Math.random() * 360,
                r: 5
            });
        }

        if (!this.overlay) {
            this.overlay = document.createElement("canvas");
            this.overlay.width = 480;
            this.overlay.height = 360;
            this.overlay.style.position = "absolute";
            this.overlay.style.pointerEvents = "none";
            this.overlay.style.left = "0";
            this.overlay.style.top = "0";
            this.overlay.style.width = "100%";
            this.overlay.style.height = "100%";
            this.overlay.style.zIndex = "9999";

            this.octx = this.overlay.getContext("2d");

            const stage = document.querySelector("canvas");
            stage.parentElement.appendChild(this.overlay);
        }
    }

    stop() {
        this.enabled = false;
    }

    clear() {
        this.seeds = [];
        if (this.octx) {
            this.octx.clearRect(0,0,480,360);
        }
    }

    tick() {
        if (!this.enabled) return;

        const ctx = this.octx;

        // Grow existing blobs
        for (const blob of this.seeds) {

            blob.r += Math.random() * 0.5;

            ctx.beginPath();
            ctx.arc(
                blob.x + (Math.random()-0.5)*blob.r*0.3,
                blob.y + (Math.random()-0.5)*blob.r*0.3,
                blob.r,
                0,
                Math.PI*2
            );
            ctx.fillStyle = "#000";
            ctx.fill();

            // Chance to branch
            if (Math.random() < 0.04) {
                this.seeds.push({
                    x: blob.x + (Math.random()-0.5)*blob.r*4,
                    y: blob.y + (Math.random()-0.5)*blob.r*4,
                    r: 2
                });
            }
        }
    }
}

Scratch.extensions.register(new Extension());
