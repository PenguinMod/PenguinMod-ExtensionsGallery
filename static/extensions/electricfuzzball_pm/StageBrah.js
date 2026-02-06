class StageCompanion {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.img = null;
    this.bumpAudio = "https://raw.githubusercontent.com/FloppyDisk-OSC/extensions-assets/main/smb_bump.wav";
    this.kickAudio = "https://raw.githubusercontent.com/FloppyDisk-OSC/extensions-assets/main/smb_kick.wav";
    this.oneUpAudio = "https://raw.githubusercontent.com/FloppyDisk-OSC/extensions-assets/main/smb_1-up.wav";
    this.balls = [];
    this.running = false;
    this.mouseX = -999;
    this.mouseY = -999;
    this.mouseRadius = 20;
    this.mouseHandler = null;
    this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }

  getInfo() {
    return {
      id: "stagecompanion",
      name: "Stage Brah",
      blocks: [
        {
          opcode: "spawnBall",
          blockType: Scratch.BlockType.COMMAND,
          text: "spawn brah with speed [SPEED] px/s and size [SIZE]",
          arguments: {
            SPEED: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 },
            SIZE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 32 }
          }
        },
        {
          opcode: "remove",
          blockType: Scratch.BlockType.COMMAND,
          text: "remove all brahs"
        }
      ]
    };
  }

  spawnBall(args) {
    const speed = Number(args.SPEED) || 2;
    const size = Number(args.SIZE) || 32;
    if (!this.running) {
      this.running = true;
      this.initCanvas();
      this.initImage();
      this.initMouseTracking();
      this.loop();
    }
    const angle = Math.random() * Math.PI * 2;
    const ball = {
      x: 240 + (Math.random() - 0.5) * 50,
      y: 180 + (Math.random() - 0.5) * 50,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: size,
      squash: 1,
      squashDir: 0,
      consecutiveMouseHits: 0,
      comboDisplay: 0,
      comboAlpha: 0
    };
    this.balls.push(ball);
  }

  initCanvas() {
    const stage = document.querySelector("canvas").parentElement;
    this.canvas = document.createElement("canvas");
    this.canvas.width = 480;
    this.canvas.height = 360;
    this.canvas.style.position = "absolute";
    this.canvas.style.left = "0";
    this.canvas.style.top = "0";
    this.canvas.style.pointerEvents = "none";
    this.canvas.style.zIndex = "10";
    stage.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
  }

  initImage() {
    this.img = new Image();
    this.img.src = "https://raw.githubusercontent.com/FloppyDisk-OSC/extensions-assets/main/brah.webp";
  }

  initMouseTracking() {
    if (this.mouseHandler) window.removeEventListener("mousemove", this.mouseHandler);
    this.mouseHandler = (e) => {
      const r = this.canvas.getBoundingClientRect();
      this.mouseX = e.clientX - r.left;
      this.mouseY = e.clientY - r.top;
    };
    window.addEventListener("mousemove", this.mouseHandler);
  }

  remove() {
    this.running = false;
    if (this.canvas) this.canvas.remove();
    this.canvas = null;
    this.balls = [];
    if (this.mouseHandler) {
      window.removeEventListener("mousemove", this.mouseHandler);
      this.mouseHandler = null;
    }
  }

  playSound(url, pitch = 1) {
    const ctx = this.audioCtx;
    fetch(url)
      .then(r => r.arrayBuffer())
      .then(buf => ctx.decodeAudioData(buf))
      .then(decoded => {
        const source = ctx.createBufferSource();
        source.buffer = decoded;
        source.playbackRate.value = pitch;
        source.connect(ctx.destination);
        source.start();
      })
      .catch(() => {});
  }

  loop() {
    if (!this.running) return;
    this.update();
    requestAnimationFrame(() => this.loop());
  }

  update() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, 480, 360);

    for (let ball of this.balls) {
      const half = ball.size / 2;
      ball.x += ball.vx;
      ball.y += ball.vy;

      let wallHit = false;
      if (ball.x < half) { ball.x = half; ball.vx *= -1; wallHit = true; }
      if (ball.x > 480 - half) { ball.x = 480 - half; ball.vx *= -1; wallHit = true; }
      if (ball.y < half) { ball.y = half; ball.vy *= -1; wallHit = true; }
      if (ball.y > 360 - half) { ball.y = 360 - half; ball.vy *= -1; wallHit = true; }
      if (wallHit) {
        this.playSound(this.bumpAudio);
        ball.squashDir = 1;
        ball.consecutiveMouseHits = 0;
        ball.comboDisplay = 0;
        ball.comboAlpha = 0;
      }

      const dx = ball.x - this.mouseX;
      const dy = ball.y - this.mouseY;
      const dist = Math.hypot(dx, dy);
      if (dist < this.mouseRadius + half) {
        const nx = dx / dist;
        const ny = dy / dist;
        const speed = Math.hypot(ball.vx, ball.vy);
        ball.vx = nx * speed;
        ball.vy = ny * speed;
        ball.x = Math.min(Math.max(ball.x + nx * 5, half), 480 - half);
        ball.y = Math.min(Math.max(ball.y + ny * 5, half), 360 - half);

        ball.consecutiveMouseHits++;
        ball.comboDisplay = ball.consecutiveMouseHits;
        ball.comboAlpha = 1;

        if (ball.consecutiveMouseHits <= 7) {
          const pitch = 1 + 0.1 * (ball.consecutiveMouseHits - 1);
          this.playSound(this.kickAudio, pitch);
        } else {
          this.playSound(this.oneUpAudio, 1);
        }

        ball.squashDir = 1;
      }
    }

    for (let i = 0; i < this.balls.length; i++) {
      for (let j = i + 1; j < this.balls.length; j++) {
        const a = this.balls[i];
        const b = this.balls[j];
        const halfA = a.size / 2;
        const halfB = b.size / 2;
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist < (halfA + halfB)) {
          const nx = dx / dist;
          const ny = dy / dist;
          const p = 2 * ((a.vx * nx + a.vy * ny) - (b.vx * nx + b.vy * ny)) / 2;
          a.vx -= p * nx;
          a.vy -= p * ny;
          b.vx += p * nx;
          b.vy += p * ny;

          const overlap = (halfA + halfB) - dist;
          a.x -= nx * overlap / 2;
          a.y -= ny * overlap / 2;
          b.x += nx * overlap / 2;
          b.y += ny * overlap / 2;

          this.playSound(this.bumpAudio);
          a.squashDir = 1;
          b.squashDir = 1;
        }
      }
    }

    for (let ball of this.balls) {
      const half = ball.size / 2;
      if (ball.squashDir > 0) {
        ball.squash = 0.7 + Math.random() * 0.6;
        ball.squashDir = 0;
      } else {
        ball.squash += (1 - ball.squash) * 0.2;
      }

      this.ctx.save();
      this.ctx.translate(ball.x, ball.y);
      this.ctx.scale(1, ball.squash);
      this.ctx.drawImage(this.img, -half, -half, ball.size, ball.size);
      this.ctx.restore();

      if (ball.comboDisplay > 0 && ball.comboAlpha > 0) {
        this.ctx.font = `${Math.floor(ball.size / 2.5)}px Arial`;
        this.ctx.fillStyle = `rgba(255,255,255,${ball.comboAlpha})`;
        this.ctx.strokeStyle = `rgba(0,0,0,${ball.comboAlpha})`;
        this.ctx.lineWidth = 2;
        this.ctx.textAlign = "center";
        this.ctx.fillText(ball.comboDisplay, ball.x, ball.y - half - 10);
        this.ctx.strokeText(ball.comboDisplay, ball.x, ball.y - half - 10);
        ball.comboAlpha -= 0.02;
        if (ball.comboAlpha < 0) ball.comboAlpha = 0;
      }
    }
  }
}

Scratch.extensions.register(new StageCompanion());
