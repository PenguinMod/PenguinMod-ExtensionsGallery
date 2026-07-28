
(function (Scratch) {
    'use strict';
	if (!Scratch.extensions.unsandboxed) {
		throw new Error('somehow \'Complex Numbers\' must run unsandboxed');
	}

    // 1
    // -1
    // i
    // -i
    // 1 + i
    // 1 - i
    // -1 + i
    // -1 - i

    // function parseStringToComplex(str) {
        
    // }
  Scratch.translate.setup({
    es: {
        "Complex Numbers": "Números Complejos",
        "Complex Number Type for do complex analysis functions, better implementation than the one made by jwklong in Mathemathics extension lmao": 
        "El tipo de dato de Números complejos para realizar funciones de analisis complejo, mejor implementación que la que jwklong hizo en la extensión Mathemathics",
        "complex number from [REAL]": "número complejo desde [REAL]",
        "complex number from [IMAGINARY]i": "número complejo desde [IMAGINARY]i",
        "complex number [REAL] + [IMAGINARY]i": "número complejo [REAL] + [IMAGINARY]i",
        "complex number modulus: [R] phase: [PHASE]": "número complejo de módulo: [R] fase: [PHASE]",
        "complex number modulus: 1 phase: [PHASE]": "número complejo de módulo: 1 fase [PHASE]",
        "real part [A]": "parte real [A]",
        "imaginary part [A]": "parte imaginaria [A]",
        "absolute value [A]": "valor absoluto [A]",
        "phase [A]": "fase [A]",
        "conjugate [A]": "conjugado [A]",
        "multiply [A] with its conjugate":"multiplicar [A] con su conjugado",
        "reciprocal [A]": "recíproca [A]",
        // "complex number in polar form modulus: [R] phase: [PHASE]": "número complejo en forma polar modulo: [R] fase [PHASE]",
        "[POLAR] to rectangular form": "[POLAR] a forma rectangular",
        "[COMPLEX] to polar form": "[COMPLEX] a forma polar",
        "multiply [A] with [B] using the polar form": "multiplicar [A] con [B] usando la forma polar",
        "divide [A] with [B] using the polar form": "dividir [A] con [B] usando la forma polar",
        "[A] ^ [B] using the polar form": "[A] ^ [B] usando la forma polar",
        "squareroot of [A]": "raíz cuadrada de [A]",
        "[B]th root of [A] using the polar form": "[B]ésima raíz de [A] usando la forma polar",
        "solutions of equation [A]x^2 + [B]x + [C] = 0": "soluciones de la ecuación [A]x^2 + [B]x + [C] = 0",
        "[SOLUTION] solution of equation [A]x^2 + [B]x + [C] = 0": "[SOLUTION] solución de la ecuación [A]x^2 + [B]x + [C] = 0",
        "positive": "positiva",
        "negative": "negativa",
        "roots of equation x^[A] - [B] = 0": "raices de la ecuación x^[A] - [B] = 0",
        "roots of equation [C]x^[A] - [B] = 0": "raices de la ecuación [C]x^[A] - [B] = 0", 
        "[D]th root of equation x^[A] - [B] = 0": "[D]ava raíz de la ecuación x^[A] - [B] = 0",
        "[D]th root of equation [C]x^[A] - [B] = 0": "[D]ava raíz de la ecuación [C]x^[A] - [B] = 0"
    },
  });
    
    function radianToDegrees(radian) {
        return radian * (180 / Math.PI);
    }

    function degreesToRadian(degree) {
        return degree * (Math.PI / 180);
    }

    function parseComplexToString(real,imaginary) {
        let str = "";
        if(!real && !imaginary) {
            return "0";
        }
        if(real) {
            // 1
            // -1
            str += String(real);
            if(imaginary) {
                if(imaginary > 0) {
                    str += "+";
                }
                str += String(imaginary) + "i";
            }
        } else {
            // i
            // -i
            str += String(imaginary) + "i"
        }
        return str
    }

    function roundToDigits(n,d) {
        const dd = 10 ** d
        return Math.floor(n * dd) / dd
    }

    /**
     * @param {number} x
     * @returns {string}
     */
    function formatNumber(x) {
        if (x >= 1e6) {
            return x.toExponential(4)
        } else {
            x = Math.floor(x * 1000) / 1000
            return x.toFixed(Math.min(3, (String(x).split('.')[1] || '').length))
        }
    }

    function clampAngleDegrees(angle) {
        
        const s = Math.sign(angle);
        const a = angle % 360

        const b = (s === -1) ? 
        ((a <= -180) ? a + 360 : a) :
        ((a > 180) ? a - 360 : a);

        return b;
    }

    function clampAngleRadians(angle) {
        let a = angle;

        while(a <= 0) {
            a += Math.PI;
        }

        return a
    }

    function castAngle(angle) {
        return String((Math.sign(angle) === -1) ? angle + 360 : angle);
    }

    function transposeAngle(angle) {
        return -angle + 90
    }

    function untransposeAngle(angle) {
        return -(angle - 90)
    }

    const Degrees = {
        sin(x) {
            return Math.sin(degreesToRadian(transposeAngle(x)));
        },
        cos(x) {
            return Math.cos(degreesToRadian(transposeAngle(x)));
        },
        atan2(a,b) {
            return radianToDegrees(Math.atan2(a,b));
        }
    }

    // credits for many parts of this code to jwklong owo

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    
    /**
     * A complex number
     *
     * @class ComplexNumberType
     * @typedef {ComplexNumberType}
     */
    class ComplexNumberType {
        customId = "reisenComplexNumber";

        
        /**
         * Creates an instance of ComplexNumberType.
         *
         * @constructor
         * @param {number} [real=0] Real part
         * @param {number} [imaginary=0] Imaginary part
         * @param {number} [modulus] Modulus in case you're working with polars
         * @param {number} [angle] Angle in case you're working with polars, in degrees
         */
        constructor(real = 0,imaginary = 0, modulus, angle) {
            // console.log(modulus, angle)
            if(!(typeof modulus == "undefined" || typeof angle == "undefined")) {
                this._fromPolar = true;
                this._modulus = modulus;
                this._angle = clampAngleDegrees(angle);
                
                switch (this._angle) {
                    case 360:
                    case 0:
                        this.real = 0 ;
                        this.imaginary = modulus;
                        break;
                
                    case 90:
                        this.real = modulus;
                        this.imaginary = 0;
                        break;

                    case 180:
                        this.real = 0;
                        this.imaginary = -modulus;
                        break;

                    case 270:
                        this.real = -modulus;
                        this.imaginary = 0;
                        break;

                    default:
                        
                        this.real = (isNaN(real) | real == 0) ? modulus * Degrees.cos(angle) : real;
                        this.imaginary = (isNaN(imaginary) | imaginary == 0) ? modulus * Degrees.sin(angle) : imaginary;
                        break;
                }
            } else {
                this._fromPolar = false;
                this._modulus = null;
                this._angle = null;
                
                this.real = isNaN(real) ? 0 : real;
                this.imaginary = isNaN(imaginary) ? 0 : imaginary;
            }     
        }

        static toComplex(u) {
            if (u instanceof ComplexNumberType) {
                if(u._fromPolar) {
                    return new ComplexNumberType(u.real, u.imaginary, u.absolute, clampAngleDegrees(u.argument));
                } else {        
                    return new ComplexNumberType(u.real, u.imaginary);
                }
            }
            // if (u instanceof VectorType) return new ComplexNumberType(u.x, u.y);
            if (u instanceof Array) {
                if (u.length == 4) {
                    return new ComplexNumberType(u[0], u[1], u[2], u[3])
                }
                
                if (u.length == 2) {
                    return new ComplexNumberType(u[0], u[1])
                }
            };
            if (typeof u == "number") {
                return new ComplexNumberType(u);
            }
            if (String(u).split(',')) {
                const s = String(u).split(',');
                return new ComplexNumberType(Scratch.Cast.toNumber(s[0]), Scratch.Cast.toNumber(s[1]))
            }
            return new ComplexNumberType(0, 0)
        }

        
        /**
         * Support for the Jwklong Array Handler!
         *
         * @returns {string} 
         */
        jwArrayHandler() {
            return 'Complex'
        }
        
        /**
         * Casts the complex number as a string, choose whether to use rectangular or polar form
         *
         * @param {boolean} [polarForm=false] Choose whether to convert it as polar form when casting to string
         * @returns {string} 
         */
        toString(polarForm = false) {
            if(polarForm) {   
                return `${this.absolute}∠${this.argument}°`;
            } else {
                return parseComplexToString(this.real,this.imaginary)
            }
        }

        toMonitorContent = () => span(this.toString())

        toReporterContent() {
            let root = document.createElement('div')
            root.textContent = parseComplexToString(this.real,this.imaginary);
            return root
        }
        
        /** 
         * Returns the absolute value or modulus of a complex number
         * @returns {number} 
         */
        get absolute() { 
            if(this._fromPolar) {
                return this._modulus
            } else {
                return Math.hypot(this.real, this.imaginary)
            }
        }

        /** 
         * Returns the argument or phase of a complex number in radians
         * @returns {number} 
         */
        get argument() {
            if(this._fromPolar) {
                return this._angle
            } else {
                return Degrees.atan2(this.real, this.imaginary)
            }
        }

        /** @returns {ComplexNumberType} */
        get conjugate() {
            return new ComplexNumberType(this.real,-this.imaginary)
        }


        toJSON() {
            return {
                real: this.real,
                imaginary: this.imaginary
            }
        }

        toArray() {
            return [ this.real, this.imaginary ]
        }

        
        /**
         * Creates a complex number given it's polar form
         *
         * @static
         * @param {number} absolute The absolute value, or modulus of the original number
         * @param {number} argument The angle, in degrees
         * @returns {ComplexNumberType} 
         */
        static fromPolar(absolute, argument) {
            const real = absolute * Degrees.cos(argument)
            const imaginary = absolute * Degrees.sin(argument)
            return new ComplexNumberType(real, imaginary, absolute, clampAngleDegrees(argument))
        }
    }
    
    const ComplexNumber = {
        Type: ComplexNumberType,
        Block: {
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.BUMPED,
            forceOutputType: "ComplexNumber",
            disableMonitor: true
        },
        
        Argument: {
            shape: Scratch.BlockShape.BUMPED,
            check: [ "ComplexNumber" ]
        },
        
        /**
         * Serializer for this type
         *
         * @param {ComplexNumberType} z Unserialized
         * @returns {{}} 
         */
        Serializer(z) {
            if(z._fromPolar) {
                return [z.real, z.imaginary, z.absolute, z.argument];
            } else {
                return [z.real, z.imaginary];
            }            
        },

        
        /**
         * Deserializer for this type
         *
         * @param {[number,number]|[number,number,number,number]} z Serialized 
         * @returns {ComplexNumberType} 
         */
        Deserializer(z) {
            if(z.length == 4) {
                return new ComplexNumber.Type(z[0],z[1],z[2],z[3])
            } else {
                return new ComplexNumber.Type(z[0],z[1])
            }
        }
    }

    class ComplexNumberExtension {
        constructor() {
            Scratch.vm.reisenComplexNumber = ComplexNumber,
            // Scratch.vm.reisenComplexPolar = ComplexPolar,
            Scratch.vm.runtime.registerSerializer(
                "reisenComplexNumber",
                ComplexNumber.Serializer, ComplexNumber.Deserializer
            )

            this.formatMessage = function (id) {
                return Scratch.translate({ id: id, default: id });
            };
            
            this.formatEveryBlock = function (blocks) {
                // console.log("Before")
                // console.log(blocks)
                return blocks
                // return blocks.map(block => {
                //     console.log("Loop")
                //     console.log(block)
                //     block.text = Scratch.translate({id: block.text, default: block.text});
                //     console.log("Next")
                //     console.log(block.text)
                //     return block.text
                // })
            }
        }

        getInfo() {
            return {
                id: "reisenComplexNumber",
                name: this.formatMessage("Complex Numbers"),
                description: this.formatMessage("Complex Number Type for do complex analysis functions, better implementation than the one made by jwklong in Mathemathics extension lmao"),
                color1: "#ffdd02",
                blockText: "#000000",
                blocks: [
                    {
                        opcode: "realToComplex",
                        text: this.formatMessage("complex number from [REAL]"),
                        arguments: {
                            REAL: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "imaginaryToComplex",
                        text: this.formatMessage("complex number from [IMAGINARY]i"),
                        arguments: {
                            IMAGINARY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "newComplex",
                        text: this.formatMessage("complex number [REAL] + [IMAGINARY]i"),
                        arguments: {
                            REAL: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            IMAGINARY: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "newComplexFromPolar",
                        text: this.formatMessage("complex number modulus: [R] phase: [PHASE]"),
                        arguments: {
                            R: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            PHASE: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 45
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "newComplexFromPolar2",
                        text: this.formatMessage("complex number modulus: 1 phase: [PHASE]"),
                        arguments: {
                            PHASE: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 45
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    "---",
                    {
                        opcode: "getRealPart",
                        text: this.formatMessage("real part [A]"),
                        arguments: {
                            A: ComplexNumber.Argument
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: "getImaginaryPart",
                        text: this.formatMessage("imaginary part [A]"),
                        arguments: {
                            A: ComplexNumber.Argument
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: "getAbsolute",
                        text: this.formatMessage("absolute value [A]"),
                        arguments: {
                            A: ComplexNumber.Argument
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: "getArgument",
                        text: this.formatMessage("phase [A]"),
                        arguments: {
                            A: ComplexNumber.Argument
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    "---",
                    {
                        opcode: "add",
                        text: this.formatMessage("[A] + [B]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "subtract",
                        text: this.formatMessage("[A] - [B]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "multiply",
                        text: this.formatMessage("[A] x [B]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "divide",
                        text: this.formatMessage("[A] / [B]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    "---",
                    {
                        opcode: "conjugate",
                        text: this.formatMessage("conjugate [A]"),
                        arguments: {
                            A: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "multiplyConjugate",
                        text: this.formatMessage("multiply [A] with its conjugate"),
                        arguments: {
                            A: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "reciprocal",
                        text: this.formatMessage("reciprocal [A]"),
                        arguments: {
                            A: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    "---",
                    {
                        opcode: "polarToComplex",
                        text: this.formatMessage("[POLAR] to rectangular form"),
                        arguments: {
                            POLAR: ComplexNumber.Argument
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: "complexToPolar",
                        text: this.formatMessage("[COMPLEX] to polar form"),
                        arguments: {
                            COMPLEX: ComplexNumber.Argument
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    "---",
                    {
                        opcode: "multiply2",
                        text: this.formatMessage("multiply [A] with [B] using the polar form"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "divide2",
                        text: this.formatMessage("divide [A] with [B] using the polar form"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument
                        },
                        ...ComplexNumber.Block
                    },
                    "---",
                    {
                        opcode: "power",
                        text: this.formatMessage("[A] ^ [B]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "squareRoot",
                        text: this.formatMessage("squareroot of [A]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "power2",
                        text: this.formatMessage("[A] ^ [B] using the polar form"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "nRoot",
                        text: this.formatMessage("[B]th root of [A] using the polar form"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    "---",
                    {
                        opcode: "exponential",
                        text: this.formatMessage("e^[B]i pi"),
                        arguments: {
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "exponential2",
                        text: this.formatMessage("e^[B]i"),
                        arguments: {
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "naturalLogarithm",
                        text: this.formatMessage("ln [A]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                        },
                        ...ComplexNumber.Block
                    },
                    // {
                    //     opcode: "multiply",
                    //     text: this.formatMessage("multiply [A] with [B] in polar form"),
                    //     arguments: {
                    //         A: ComplexNumber.Argument,
                    //         B: ComplexNumber.Argument
                    //     },
                    //     ...ComplexNumber.Block
                    // },
                    {
                        opcode: "quadraticEquation",
                        text: this.formatMessage("solutions of equation [A]x^2 + [B]x + [C] = 0"),
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            C: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                        },
                        
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        disableMonitor: true
                    },
                    {
                        opcode: "quadraticEquation2",
                        text: this.formatMessage("[SOLUTION] solution of equation [A]x^2 + [B]x + [C] = 0"),
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            C: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            SOLUTION: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'SOLUTIONS'
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "roots",
                        text: this.formatMessage("roots of equation x^[A] - [B] = 0"),
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                        },
                        
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        disableMonitor: true
                    },
                    {
                        opcode: "roots2",
                        text: this.formatMessage("roots of equation [C]x^[A] - [B] = 0"),
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            C: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                        },
                        
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        disableMonitor: true
                    },
                    {
                        opcode: "roots3",
                        text: this.formatMessage("[D]th root of equation x^[A] - [B] = 0"),
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            D: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "roots4",
                        text: this.formatMessage("[D]th root of equation [C]x^[A] - [B] = 0"),
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },
                            C: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                            D: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },
                        },
                        ...ComplexNumber.Block
                    },
                ],
                menus: {
                    SOLUTIONS: {
                        acceptReporters: false,
                        items: [
                            {
                                text: this.formatMessage("positive"),
                                value: "positive"
                            },
                            {
                                text: this.formatMessage("negative"),
                                value: "negative"
                            },
                        ]
                    }
                }
            }
        }
        
        /**
         * Creates a new complex number given the real and imaginary part
         *
         * @param { number } args.REAL 
         * @param { number } args.IMAGINARY
         * @returns {ComplexNumberType} 
         */
        newComplex(args) {
            const real = Scratch.Cast.toNumber(args.REAL)
            const imaginary = Scratch.Cast.toNumber(args.IMAGINARY)

            return new ComplexNumberType(real,imaginary);
        }

        
        /**
         * Given the polar form creates a complex
         *
         * @param { number } args.R
         * @param { number } args.PHASE 
         * @returns {ComplexNumberType} 
         */
        newComplexFromPolar(args) {
            const modulus = Scratch.Cast.toNumber(args.R)
            const phase = Scratch.Cast.toNumber(args.PHASE);

            return ComplexNumberType.fromPolar(modulus,phase);
            // z = r(cos a + i sin a)
            // const real = modulus * Math.cos(phase);
            // const imaginary = modulus * Math.sin(phase);

        }
        
        /**
         * Given the phase creates a complex assuming modulus is 1
         *
         * @param { number } args.PHASE 
         * @returns {ComplexNumberType} 
         */
        newComplexFromPolar2(args) {
            const phase = Scratch.Cast.toNumber(args.PHASE);

            return ComplexNumberType.fromPolar(1,phase);
            // z = r(cos a + i sin a)
            // const real = modulus * Math.cos(phase);
            // const imaginary = modulus * Math.sin(phase);
        }

        
        /**
         * Converts a single real number into a complex type
         *
         * @param { number } args.REAL 
         * @returns {ComplexNumberType} 
         */
        realToComplex(args) {
            return new ComplexNumberType(args.REAL,0)
        }
        
        /**
         * Converts a sole imaginary number into a complex type
         *
         * @param { number } args.IMAGINARY 
         * @returns {ComplexNumberType} 
         */
        imaginaryToComplex(args) {
            return new ComplexNumberType(0,args.IMAGINARY)
        }

        getRealPart(args) {
            return ComplexNumberType.toComplex(args.A).real
        } 

        getImaginaryPart(args) {
            return ComplexNumberType.toComplex(args.A).imaginary
        } 

        getAbsolute(args) {
            return ComplexNumberType.toComplex(args.A).absolute
        } 

        getArgument(args) {
            return ComplexNumberType.toComplex(args.A).argument
        } 

        conjugate(args) {
            return ComplexNumberType.toComplex(args.A).conjugate
        } 

        add(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const B = ComplexNumberType.toComplex(args.B);
            
            return new ComplexNumberType(A.real + B.real,  A.imaginary + B.imaginary);
        } 

        subtract(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const B = ComplexNumberType.toComplex(args.B);
            
            return new ComplexNumberType(A.real - B.real, A.imaginary  - B.imaginary);
        } 

        multiply(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const B = ComplexNumberType.toComplex(args.B);
            
            return new ComplexNumberType(
                A.real * B.real - A.imaginary  * B.imaginary, 
                A.real * B.imaginary + A.imaginary  * B.real
            );
        }

        multiplyConjugate(args) {
            const A = ComplexNumberType.toComplex(args.A);
            
            return new ComplexNumberType(A.real ** 2 + A.imaginary ** 2, 0);
        }

        reciprocal(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const u = A.real ** 2 + A.imaginary ** 2;

            
            return new ComplexNumberType(A.real / u, -A.imaginary / u);
        }

        divide(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const B = ComplexNumberType.toComplex(args.B);
            const u = B.real ** 2 + B.imaginary ** 2;


            
            return new ComplexNumberType(
                (A.real * B.real + A.imaginary * B.imaginary) / u, 
                (A.imaginary * B.real - A.real * B.imaginary) / u
            );
        }

        
        /**
         * Converts a polar number into a complex number
         *
         * @param {ComplexNumberType} args.POLAR
         * @returns {ComplexNumberType} 
         */
        polarToComplex(args) {
            const POLAR = ComplexNumberType.toComplex(args.POLAR);

            return POLAR.toString();
        }
        

        complexToPolar(args) {
            const COMPLEX = ComplexNumberType.toComplex(args.COMPLEX);

            return COMPLEX.toString(true);
        }

        
        multiply2(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const B = ComplexNumberType.toComplex(args.B);
            
            return new ComplexNumberType(
                A.real * B.real - A.imaginary  * B.imaginary, 
                A.real * B.imaginary + A.imaginary  * B.real
                , A.absolute * B.absolute
                , untransposeAngle(-(A.argument + B.argument) + 180)
            );
        }
        
        divide2(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const B = ComplexNumberType.toComplex(args.B);
            const u = B.real ** 2 + B.imaginary ** 2;
            
            return new ComplexNumberType(
                (A.real * B.real + A.imaginary * B.imaginary) / u, 
                (A.imaginary * B.real - A.real * B.imaginary) / u
                , A.absolute / B.absolute
                , untransposeAngle(-(A.argument - B.argument))
            );
        }
        
        power(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const power = Math.round(Scratch.Cast.toNumber(args.B));
            
            const firstReal = A.real, firstImaginary = A.imaginary;
            let pair = [firstReal, firstImaginary];
            
            if(power == 0) {
                return new ComplexNumberType(1,0)
            }
            if(power == 1) {
                return A
            }
            if(power == -1) {
                const u = A.real ** 2 + A.imaginary ** 2;
                return new ComplexNumberType(A.real / u, -A.imaginary / u);
            }
            
            const absPower = Math.abs(power);
            
            for (let _ = 1; _ < absPower; _++) {
                pair = [
                    pair[0] * firstReal - pair[1] * firstImaginary, 
                    pair[0] * firstImaginary + pair[1] * firstReal
                ];
            }

            if(power < -1) {
                const u = pair[0] ** 2 + pair[1] ** 2;
                return new ComplexNumberType(pair[0] / u, -pair[1] / u);
                
            }

            return new ComplexNumberType(
                pair[0], pair[1]
            );
        }

        
        squareRoot(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const r = Math.hypot(A.real, A.imaginary);

            return new ComplexNumberType(
                Math.sqrt(1/2 * (r + A.real)),
                (A.imaginary >= 0 ? 1 : -1) * Math.sqrt(1/2 * (r - A.real)),
            );
        }

        power2(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const power = Scratch.Cast.toNumber(args.B);

            if(power == 0) {
                return new ComplexNumberType(1,0)
            }
            if(power == 1) {
                return A
            }

            const r = A.absolute ** power;
            const phi = A.argument * power;

            return new ComplexNumberType(
                r * Degrees.cos(phi),
                r * Degrees.sin(phi),
                r, phi
            );
        }
        
        nRoot(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const subRadical = Scratch.Cast.toNumber(args.B);

            if(subRadical == 0) {
                return Infinity
            }
            if(subRadical == 1) {
                return A
            }

            const r = subRadical == 2 ? Math.sqrt(A.absolute) : (A.absolute ** (1/subRadical));
            const phi = A.argument / subRadical;

            return new ComplexNumberType(
                r * Degrees.cos(phi),
                r * Degrees.sin(phi),
                r, phi
            );
        }
        
        // power3(args) {
        //     const A = ComplexNumberType.toComplex(args.A);
        //     const power = Math.round(Scratch.Cast.toNumber(args.B));

        //     if(power == 0) {
        //         return new ComplexNumberType(1,0)
        //     }
        //     if(power == 1) {
        //         return A
        //     }

        //     const r = A.absolute ** n;
        //     const phi = A.argument * n;

        //     return new ComplexNumberType(
        //         undefined, undefined,
        //         r * Degrees.cos(phi),
        //         r * Degrees.sin(phi)
        //     );
        // }
        exponential(args) {
            const radians = Scratch.Cast.toNumber(args.B);
            if(radians == 0) {
                return new ComplexNumberType(1,0);
            }
            if(radians == 1) {
                return new ComplexNumberType(-1,0,);
            }
            
            const real = Math.cos(radians * Math.PI);
            const imaginary = Math.sin(radians * Math.PI);

            return new ComplexNumberType(real, imaginary, 1, radianToDegrees(radians * Math.PI))
        }
        exponential2(args) {
            const radians = Scratch.Cast.toNumber(args.B);
            if(radians == 0) {
                return new ComplexNumberType(1,0);
            }
            if(radians == Math.PI) {
                return new ComplexNumberType(-1,0);
            }
            
            const real = Math.cos(radians);
            const imaginary = Math.sin(radians);

            return new ComplexNumberType(real, imaginary, 1, radianToDegrees(radians))
        }
        naturalLogarithm(args) {
            const A = ComplexNumberType.toComplex(args.A);

            if(A.real == 0 && A.imaginary == 0) {
                return NaN;
            }
            if(A.imaginary == 0) {
                if(A.real > 0) {
                    return new ComplexNumberType(Math.log(A.real));
                } else {
                    return new ComplexNumberType(Math.log(Math.abs(A.real)),Math.PI);
                }
            }
            if(A.real == 0) {
                if(A.imaginary > 0) {
                    return new ComplexNumberType(Math.log(A.imaginary), Math.PI / 2);
                } else {
                    return new ComplexNumberType(Math.log(Math.abs(A.imaginary)), -Math.PI / 2);
                }
            }

            const r = Math.log(A.absolute);
            const arg = A.argument * Math.PI;
            
            return new ComplexNumberType(r,arg);
        }

        quadraticEquation(args) {
            const a = Math.round(Scratch.Cast.toNumber(args.A));
            const b = Math.round(Scratch.Cast.toNumber(args.B));
            const c = Math.round(Scratch.Cast.toNumber(args.C));

            if(a == 0) {
                throw new Error("Quadratic component can't be 0");
            }
            
            const det = b ** 2 - 4 * a * c;
            let solutions = [];

            if(det > 0) {
                const positive = ( -b + Math.sqrt(det)) / (2 * a);
                const negative = ( -b - Math.sqrt(det)) / (2 * a);

                solutions = [ new ComplexNumberType(positive,0), new ComplexNumberType(negative,0) ];
            }

            if(det ==  0) {
                const unique = ( -b ) / (2 * a);
                
                solutions = [ new ComplexNumberType(unique,0), new ComplexNumberType(unique,0) ];
            }
            
            if(det < 0) {
                const positive = new ComplexNumberType(-b / (2 * a), Math.sqrt(Math.abs(det)) / (2 * a));
                const negative = new ComplexNumberType(-b / (2 * a), -Math.sqrt(Math.abs(det)) / (2 * a));

                solutions = [ positive, negative ];
            }
            
            return solutions;
        }
        quadraticEquation2(args) {
            const a = Math.round(Scratch.Cast.toNumber(args.A));
            const b = Math.round(Scratch.Cast.toNumber(args.B));
            const c = Math.round(Scratch.Cast.toNumber(args.C));

            
            const det = b ** 2 - 4 * a * c;
            let solutions = [];

            if(det > 0) {
                const positive = ( -b + Math.sqrt(det)) / (2 * a);
                const negative = ( -b - Math.sqrt(det)) / (2 * a);

                solutions = [ new ComplexNumberType(positive,0), new ComplexNumberType(negative,0) ];
            }

            if(det ==  0) {
                const unique = ( -b ) / (2 * a);
                
                solutions = [ new ComplexNumberType(unique,0), new ComplexNumberType(unique,0) ];
            }
            
            if(det < 0) {
                const positive = new ComplexNumberType(-b / (2 * a), Math.sqrt(Math.abs(det)) / (2 * a));
                const negative = new ComplexNumberType(-b / (2 * a), Math.sqrt(Math.abs(det)) / (2 * a));

                solutions = [ positive, negative ];
            }

            switch (args.SOLUTION) {
                case "positive":
                    return solutions[0];

                case "negative":
                    return solutions[1];
            
                default:
                    break;
            }
        }
        
        roots(args) {
            const a = Math.round(Math.abs(Scratch.Cast.toNumber(args.A)));
            const b = Scratch.Cast.toNumber(args.B);

            if(a == 0) {
                return NaN;
            }
            if(a == 1) {
                return [ ComplexNumberType.toComplex(a) ];
            }

            let roots = [];

            const r = a == 2 ? Math.sqrt(b) : (b ** (1/a));
            for (let k = 0; k < a; k++) {
                
                const phi = (0 + k * 360) / a;

                roots.push(new ComplexNumberType(
                    r * Degrees.cos(phi),
                    r * Degrees.sin(phi),
                    r, phi
                ));
            }

            return roots;
        }
        
        roots2(args) {
            const a = Math.round(Math.abs(Scratch.Cast.toNumber(args.A)));
            const b = Scratch.Cast.toNumber(args.B);
            const c = Scratch.Cast.toNumber(args.C);

            if(a == 0) {
                return NaN;
            }
            if(a == 1) {
                return [ ComplexNumberType.toComplex(a) ];
            }

            let roots = [];

            const r = a == 2 ? Math.sqrt(b/c) : ((b/c) ** (1/a));
            for (let k = 0; k < a; k++) {
                
                const phi = (0 + k * 360) / a;

                roots.push(new ComplexNumberType(
                    r * Degrees.cos(phi),
                    r * Degrees.sin(phi),
                    r, phi
                ));
            }

            return roots;
        }
        
        roots3(args) {
            const a = Math.round(Math.abs(Scratch.Cast.toNumber(args.A)));
            const b = Scratch.Cast.toNumber(args.B);

            const c = Scratch.Cast.toNumber(args.C);

            if(a == 0) {
                return NaN;
            }
            if(a == 1) {
                return [ ComplexNumberType.toComplex(a) ];
            }

            let roots = [];

            const r = a == 2 ? Math.sqrt(b) : (b ** (1/a));
                
                const phi = (0 + d * 360) / a;

            return new ComplexNumberType(
                    r * Degrees.cos(phi),
                    r * Degrees.sin(phi),
                    r, phi
                );
        }
        
        roots4(args) {
            const a = Math.round(Math.abs(Scratch.Cast.toNumber(args.A)));
            const b = Scratch.Cast.toNumber(args.B);

            const c = Scratch.Cast.toNumber(args.C);

            if(a == 0) {
                return NaN;
            }
            if(a == 1) {
                return [ ComplexNumberType.toComplex(a) ];
            }

            let roots = [];

            const r = a == 2 ? Math.sqrt(b/c) : ((b/c) ** (1/a));
                
                const phi = (0 + d * 360) / a;

            return new ComplexNumberType(
                    r * Degrees.cos(phi),
                    r * Degrees.sin(phi),
                    r, phi
                );
        }
    }
    Scratch.extensions.register( new ComplexNumberExtension() )
})(Scratch)
