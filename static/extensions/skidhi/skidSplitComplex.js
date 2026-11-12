(function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error("This extension must be loaded unsandboxed");
    }

    class SplitComplex {
        constructor(real, imag) {
            this.real = real;
            this.imag = imag;
        }
        get customId() {
            return "skidhiSplitComplex";
        }
        toString() {
            const sign = this.imag < 0 ? "-" : "+";
            return `${this.real} ${sign} ${Math.abs(this.imag)}j`;
        }
    }

    const toSplit = (v) =>
        v instanceof SplitComplex ? v : new SplitComplex(Scratch.Cast.toNumber(v), 0);

    const SHAPE = Scratch.BlockShape.LEAF;

    const complexOut = {
        blockType: Scratch.BlockType.REPORTER,
        blockShape: SHAPE,
        forceOutputType: "SplitComplex",
    };
    const complexArg = { shape: BUMPED, check: "SplitComplex" };

    Scratch.vm.runtime.registerSerializer(
        "skidhiSplitComplex",
        (value) => ({ real: String(value.real), imag: String(value.imag) }),
        (data) => new SplitComplex(Number(data.real), Number(data.imag))
    );

    class Extension {
        getInfo() {
            return {
                id: "skidhiSplitComplex",
                name: "Split Complex",
                color1: "#14b655",
                blocks: [
                    {
                        ...complexOut,
                        opcode: "makeSplit",
                        text: "[R] + [I]j",
                        arguments: {
                            R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                            I: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        },
                    },
                    {
                        ...complexOut,
                        opcode: "addSplit",
                        text: "[A] + [B]",
                        arguments: { A: complexArg, B: complexArg },
                    },
                    {
                        ...complexOut,
                        opcode: "subSplit",
                        text: "[A] - [B]",
                        arguments: { A: complexArg, B: complexArg },
                    },
                    {
                        ...complexOut,
                        opcode: "multSplit",
                        text: "[A] * [B]",
                        arguments: { A: complexArg, B: complexArg },
                    },
                    {
                        ...complexOut,
                        opcode: "divSplit",
                        text: "[A] / [B]",
                        arguments: { A: complexArg, B: complexArg },
                    },
                    {
                        ...complexOut,
                        opcode: "conjSplit",
                        text: "conjugate of [A]",
                        arguments: { A: complexArg },
                    },
                    {
                        ...complexOut,
                        opcode: "hyperbolicSplit",
                        text: "magnitude [R] rapidity [T]",
                        arguments: {
                            R: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            T: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
                        },
                    },
                    {
                        ...complexOut,
                        opcode: "sqrtSplit",
                        text: "square root of [A]",
                        arguments: { A: complexArg },
                    },
                    {
                        ...complexOut,
                        opcode: "expSplit",
                        text: "e to the [A]",
                        arguments: { A: complexArg },
                    },
                    {
                        opcode: "realOf",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "real part of [A]",
                        arguments: { A: complexArg },
                    },
                    {
                        opcode: "imagOf",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "j part of [A]",
                        arguments: { A: complexArg },
                    },
                    {
                        opcode: "modOf",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "modulus of [A]",
                        arguments: { A: complexArg },
                    },
                    {
                        opcode: "rapidityOf",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "rapidity of [A]",
                        arguments: { A: complexArg },
                    },
                    {
                        opcode: "isZeroDivisor",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[A] is a zero divisor?",
                        arguments: { A: complexArg },
                    },
                    {
                        opcode: "equalsSplit",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "[A] = [B]",
                        arguments: { A: complexArg, B: complexArg },
                    },
                ],
            };
        }

        makeSplit(args) {
            return new SplitComplex(
                Scratch.Cast.toNumber(args.R),
                Scratch.Cast.toNumber(args.I)
            );
        }
        addSplit(args) {
            const a = toSplit(args.A);
            const b = toSplit(args.B);
            return new SplitComplex(a.real + b.real, a.imag + b.imag);
        }
        subSplit(args) {
            const a = toSplit(args.A);
            const b = toSplit(args.B);
            return new SplitComplex(a.real - b.real, a.imag - b.imag);
        }
        multSplit(args) {
            const { real: a, imag: b } = toSplit(args.A);
            const { real: c, imag: d } = toSplit(args.B);
            return new SplitComplex(a * c + b * d, a * d + b * c);
        }
        divSplit(args) {
            const { real: a, imag: b } = toSplit(args.A);
            const { real: c, imag: d } = toSplit(args.B);
            const denom = c * c - d * d; // zero whenever |c| === |d|
            if (denom === 0) return new SplitComplex(NaN, NaN);
            return new SplitComplex(
                (a * c - b * d) / denom,
                (b * c - a * d) / denom
            );
        }
        conjSplit(args) {
            const z = toSplit(args.A);
            return new SplitComplex(z.real, -z.imag);
        }
        hyperbolicSplit(args) {
            const r = Scratch.Cast.toNumber(args.R);
            const t = Scratch.Cast.toNumber(args.T);
            return new SplitComplex(r * Math.cosh(t), r * Math.sinh(t));
        }
        sqrtSplit(args) {
            const z = toSplit(args.A);
            const u = z.real + z.imag;
            const v = z.real - z.imag;
            if (u < 0 || v < 0) return new SplitComplex(NaN, NaN);
            const su = Math.sqrt(u);
            const sv = Math.sqrt(v);
            return new SplitComplex((su + sv) / 2, (su - sv) / 2);
        }
        expSplit(args) {
            const z = toSplit(args.A);
            const m = Math.exp(z.real);
            return new SplitComplex(m * Math.cosh(z.imag), m * Math.sinh(z.imag));
        }
        realOf(args) {
            return toSplit(args.A).real;
        }
        imagOf(args) {
            return toSplit(args.A).imag;
        }
        modOf(args) {
            const z = toSplit(args.A);
            return z.real * z.real - z.imag * z.imag;
        }
        rapidityOf(args) {
            const z = toSplit(args.A);
            if (Math.abs(z.imag) >= Math.abs(z.real)) return NaN;
            return Math.atanh(z.imag / z.real);
        }
        isZeroDivisor(args) {
            const z = toSplit(args.A);
            return Math.abs(z.real) === Math.abs(z.imag);
        }
        equalsSplit(args) {
            const a = toSplit(args.A);
            const b = toSplit(args.B);
            return a.real === b.real && a.imag === b.imag;
        }
    }

    Scratch.extensions.register(new Extension());
})(Scratch);
