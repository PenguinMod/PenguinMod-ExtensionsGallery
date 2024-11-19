(function(Scratch) {
    'use strict';

    // Perlin Noise algorithm from Noise.js
    const Perlin = {
        perm: new Array(512),
        gradP: new Array(512),
        grad3: [
            [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
            [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
            [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1]
        ],
        seed(seed) {
            let p = [];
            for (let i = 0; i < 256; i++) {
                p[i] = i;
            }
            let n, q;
            for (let i = 255; i > 0; i--) {
                n = Math.floor(seed * (i + 1)) % 256;
                q = p[i];
                p[i] = p[n];
                p[n] = q;
            }
            for (let i = 0; i < 512; i++) {
                this.perm[i] = p[i & 255];
                this.gradP[i] = this.grad3[this.perm[i] % 12];
            }
        },
        fade(t) {
            return t * t * t * (t * (t * 6 - 15) + 10);
        },
        lerp(t, a, b) {
            return a + t * (b - a);
        },
        dot(g, x, y) {
            return g[0] * x + g[1] * y;
        },
        noise(x, y) {
            const X = Math.floor(x) & 255;
            const Y = Math.floor(y) & 255;
            x = x - Math.floor(x);
            y = y - Math.floor(y);

            const u = this.fade(x);
            const v = this.fade(y);

            const grad00 = this.gradP[X + this.perm[Y]];
            const grad01 = this.gradP[X + this.perm[Y + 1]];
            const grad10 = this.gradP[X + 1 + this.perm[Y]];
            const grad11 = this.gradP[X + 1 + this.perm[Y + 1]];

            const n00 = this.dot(grad00, x, y);
            const n10 = this.dot(grad10, x - 1, y);
            const n01 = this.dot(grad01, x, y - 1);
            const n11 = this.dot(grad11, x - 1, y - 1);

            const nx0 = this.lerp(u, n00, n10);
            const nx1 = this.lerp(u, n01, n11);

            return this.lerp(v, nx0, nx1);
        }
    };

    class PerlinNoiseExtension {
        constructor() {
            this.noiseMap = {};
        }

        // Pre-generate Perlin noise based on seed and store it
        generateNoise(seed, octaves) {
            Perlin.seed(seed);
            this.noiseMap[seed] = { octaves };
        }

        // Get pre-generated noise at X, Y
        getNoiseAt({ seed, x, y }) {
            const noiseData = this.noiseMap[seed];
            if (!noiseData) {
                return 0; // Return 0 if noise is not pre-generated
            }

            const { octaves } = noiseData;
            let total = 0;
            let frequency = 1;
            let amplitude = 1;
            let maxValue = 0;

            for (let i = 0; i < octaves; i++) {
                total += Perlin.noise(x * frequency, y * frequency) * amplitude;
                maxValue += amplitude;
                amplitude /= 2;
                frequency *= 2;
            }

            return total / maxValue; // Normalize the result
        }

        // Get Perlin noise directly without pre-generation
        getDirectNoise({ seed, x, y, octaves }) {
            Perlin.seed(seed);
            let total = 0;
            let frequency = 1;
            let amplitude = 1;
            let maxValue = 0;

            for (let i = 0; i < octaves; i++) {
                total += Perlin.noise(x * frequency, y * frequency) * amplitude;
                maxValue += amplitude;
                amplitude /= 2;
                frequency *= 2;
            }

            return total / maxValue; // Normalize the result
        }

        getInfo() {
            return {
                id: 'perlinNoise',
                name: 'Perlin Noise',
                blocks: [
                    {
                        opcode: 'generateNoise',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'pre-generate perlin noise Seed: [SEED] Octave: [OCTAVE]',
                        arguments: {
                            SEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1234,
                            },
                            OCTAVE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4,
                            },
                        },
                    },
                    {
                        opcode: 'getNoiseAt',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get pre-generated perlin noise Seed: [SEED] at X: [X] Y: [Y]',
                        arguments: {
                            SEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1234,
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                        },
                    },
                    {
                        opcode: 'getDirectNoise',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get direct perlin noise Seed: [SEED] X: [X] Y: [Y] Octave: [OCTAVE]',
                        arguments: {
                            SEED: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1234,
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            OCTAVE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 4,
                            },
                        },
                    }
                ],
            };
        }
    }

    Scratch.extensions.register(new PerlinNoiseExtension());
})(Scratch);