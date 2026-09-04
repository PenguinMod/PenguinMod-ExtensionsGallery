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
        "Complex Number Type for do complex analysis functions, perfect for rotation where vectors are slow": 
        "El tipo de dato de Números complejos para realizar funciones de analisis complejo, perfecto para rotaciones donde los vectores son lentos",
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
        "[A] x [B] using [FORM]": "[A] x [B] usando [FORM]",
        "[A] / [B] using [FORM]": "[A] / [B] usando [FORM]",
        "[A] ^ [B] using [FORM]": "[A] ^ [B] usando [FORM]",
        "multiply [A] with its conjugate":"multiplicar [A] con su conjugado",
        "reciprocal [A]": "recíproca [A]",
        "parse [A] to a complex number": "convertir [A] a un número complejo",
        // "complex number in polar form modulus: [R] phase: [PHASE]": "número complejo en forma polar modulo: [R] fase [PHASE]",
        "[COMPLEX] to [FORM] as text": "[COMPLEX] a [FORM] como texto",
        "use [FORM] for [COMPLEX]": "usar [FORM] para [COMPLEX]",
        // "multiply [A] with [B] using the polar form": "multiplicar [A] con [B] usando la forma polar",
        // "divide [A] with [B] using the polar form": "dividir [A] con [B] usando la forma polar",
        "[A] ^ [B] using the polar form": "[A] ^ [B] usando la forma polar",
        "square root of [A]": "raíz cuadrada de [A]",
        "[B]th root of [A] using the polar form": "[B]ésima raíz de [A] usando la forma polar",
        "solutions of equation [A]x^2 + [B]x + [C] = 0": "soluciones de la ecuación [A]x^2 + [B]x + [C] = 0",
        "[SOLUTION] solution of equation [A]x^2 + [B]x + [C] = 0": "[SOLUTION] solución de la ecuación [A]x^2 + [B]x + [C] = 0",
        "positive": "positiva",
        "negative": "negativa",
        "first": "primera",
        "second": "segunda",
        "polar form": "forma polar",
        "rectangular form": "forma rectangular",
        // "roots of equation x^[A] - [B] = 0": "raices de la ecuación x^[A] - [B] = 0",
        "roots of equation [C]x^[A] - [B] = 0": "raices de la ecuación [C]x^[A] - [B] = 0", 
        // "[D]th root of equation x^[A] - [B] = 0": "[D]ava raíz de la ecuación x^[A] - [B] = 0",
        "[D]th root of equation [C]x^[A] - [B] = 0": "[D]ava raíz de la ecuación [C]x^[A] - [B] = 0",
        'position in [FORM]': "posición en [FORM]",
        'go to [COMPLEX] using [FORM]': "ir a [COMPLEX] usando [FORM]",
        'direction in [FORM]': "dirección en [FORM]",
        'point in sense of [COMPLEX] using [FORM]': "apuntar en sentido de [COMPLEX] usando [FORM]",
        'stretch in [FORM]': "estiramiento en [FORM]",
        'set stretch to [COMPLEX] using [FORM]': "establecer estiramiento en [COMPLEX] usando [FORM]",
        'mouse position in [FORM]': "posición del ratión en [FORM]",
        "convert [COMPLEX] to vector": "convertir [COMPLEX] a vector",
        "convert [VECTOR] to complex number": "convertir [VECTOR] a número complejo",
        "transform [ANGLE] into Complex Plane Angle": "transformar [ANGLE] en ángulo del plano complejo",
        "transform [ANGLE] into Scratch Angle": "transformar [ANGLE] en ángulo de Scratch",
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

    function isInteger(n) {
        return Math.round(n) === n;
    }
    
    /**
     * Transform an Scratch Angle into Complex Plane Angle
     *
     * @param {number} angle Scratch Angle
     * @returns {number} 
     */
    function transformAngle(angle) {
        return -angle + 90
    }

    /**
     * Transform an Complex Plane Angle into Scratch Angle
     *
     * @param {number} angle Complex Plane Angle
     * @returns {number} 
     */
    function untransformAngle(angle) {
        return -(angle - 90)
    }

    function standarizeJSONObject(json) {
        
        const standardMap = {
            real: ["real", "x"],
            imaginary: ["imaginary", "y"],
            absolute: ["absolute", "magnitude", "force"],
            phase: ["phase", "argument", "angle", "rotation"]
        }
        const standarized = {};

        for (const key of standardMap.real) {
            if(json.hasOwnProperty(key)) {
                standarized.real = json[key];
            }
        }
        for (const key of standardMap.imaginary) {
            if(json.hasOwnProperty(key)) {
                standarized.imaginary = json[key];
            }
        }
        for (const key of standardMap.absolute) {
            if(json.hasOwnProperty(key)) {
                standarized.absolute = json[key];
            }
        }
        for (const key of standardMap.phase) {
            if(json.hasOwnProperty(key)) {
                standarized.phase = json[key];
            }
        }

        return standarized;
    }

    
    /**
     * Forces one kind of complex number, either polar or rectangular
     *
     * @param {ComplexNumberType} complex
     * @param {"polar"|"rectangular"} form
     * @returns {ComplexNumberType} 
     */
    function forceForm(complex,form) {
        switch (form) {
            case "polar":
                return new ComplexNumberType(complex.real, complex.imaginary, complex._modulus || complex.modulus, complex._phase || complex.phase);
        
            case "rectangular":
                return new ComplexNumberType(complex.real, complex.imaginary);
        }       
    }

    const Degrees = {
        sin(x) {
            return Math.sin(degreesToRadian(x));
        },
        cos(x) {
            return Math.cos(degreesToRadian(x));
        },
        atan2(a,b) {
            return radianToDegrees(Math.atan2(b,a));
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
         * @param {number} [phase] Angle, in case you're working with polars, in degrees, transposed to the complex plane
         */
        constructor(real = 0,imaginary = 0, modulus, phase) {
            // console.log(modulus, angle)
            if(!(typeof modulus == "undefined" || typeof phase == "undefined")) {
                this._fromPolar = true;
                this._modulus = modulus;
                this._phase = clampAngleDegrees(phase);
                
                switch (this._phase) {
                    case 360:
                    case 0:
                        this.real = modulus;
                        this.imaginary = 0;
                        break;
                
                    case 90:
                        this.real = 0 ;
                        this.imaginary = modulus;
                        break;

                    case 180:
                        this.real = -modulus;
                        this.imaginary = 0;
                        break;

                    case 270:
                        this.real = 0;
                        this.imaginary = -modulus;
                        break;

                    default:
                        
                        this.real = (isNaN(real) | real == 0) ? modulus * Degrees.cos(phase) : real;
                        this.imaginary = (isNaN(imaginary) | imaginary == 0) ? modulus * Degrees.sin(phase) : imaginary;
                        break;
                }
            } else {
                this._fromPolar = false;
                this._modulus = null;
                this._phase = null;
                
                this.real = isNaN(real) ? 0 : real;
                this.imaginary = isNaN(imaginary) ? 0 : imaginary;
            }     
        }

        static toComplex(u) {
            if (u instanceof ComplexNumberType) {
                if(u._fromPolar) {
                    return new ComplexNumberType(u.real, u.imaginary, u.modulus, clampAngleDegrees(u.phase));
                } else {        
                    return new ComplexNumberType(u.real, u.imaginary);
                }
            }
            if (vm.jwVector && u instanceof vm.jwVector.Type) {
                return new ComplexNumberType(u.x, u.y)
            };
            if (vm.jwArray && u instanceof vm.jwArray.Type) {
                const s = u.array.map(c => Scratch.Cast.toNumber(c));
                if(s[3]) {
                    s[3] = transformAngle(s[3]);
                }
                return new ComplexNumberType(...u);
            };
            if (u instanceof Array) {
                const s = u.map(c => Scratch.Cast.toNumber(c));
                if(s[3]) {
                    s[3] = transformAngle(s[3]);
                }
                return new ComplexNumberType(...u);
            }
            if (typeof u == "number") {
                return new ComplexNumberType(u);
            }
            if (String(u).split(',')) {
                const s = String(u).split(',').map(c => Scratch.Cast.toNumber(c));
                if(s[3]) {
                    s[3] = transformAngle(s[3]);
                }
                return new ComplexNumberType(...s);
            }
            
            try {
                let parsed = JSON.parse(u)
                if (parsed instanceof Array) {
                    if(s[3]) {
                        s[3] = transformAngle(s[3]);
                    }
                    return new ComplexNumberType(...u)
                };

                // if (parsed instanceof Object) {
                //     return new ComplexNumberType()
                // };
            } catch {}
            return new ComplexNumberType(0, 0);
        }

        
        /**
         * Support for the Jwklong Array Handler!
         *
         * @returns {string} 
         */
        jwArrayHandler() {
            return 'Complex';
        }
        
        /**
         * Casts the complex number as a string, choose whether to use rectangular or polar form
         *
         * @param {boolean} [polarForm=false] Choose whether to convert it as polar form when casting to string
         * @returns {string} 
         */
        toString(polarForm = false) {
            if(polarForm) {   
                return `${this.modulus}∠${this.phase}°`;
            } else {
                return parseComplexToString(this.real,this.imaginary)
            }
        }

        toMonitorContent = () => span(parseComplexToString(this.real,this.imaginary))

        toReporterContent() {
            let root = document.createElement('div')
            root.textContent = parseComplexToString(this.real,this.imaginary);
            return root
        }
        
        /** 
         * Returns the absolute value or modulus of a complex number
         * @returns {number} 
         */
        get modulus() { 
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
        get phase() {
            if(this._fromPolar) {
                return this._phase
            } else {
                return Degrees.atan2(this.real, this.imaginary)
            }
        }

        /** @returns {ComplexNumberType} */
        get conjugate() {
            if(this._fromPolar) {
            return new ComplexNumberType(this.real,-this.imaginary, this._modulus, -this._phase)
            } else {
            return new ComplexNumberType(this.real,-this.imaginary)
            }
        }


        toJSON() {
            if(this._fromPolar) {
                return {
                    real: this.real, 
                    imaginary: this.imaginary, 
                    modulus: this._modulus, 
                    phase: untransformAngle(this._phase)
                }
            } else {
                return {
                    real: this.real,
                    imaginary: this.imaginary
                }
            }
        }

        toArray() {
            if(this._fromPolar) {
                return [ this.real, this.imaginary, this._modulus, untransformAngle(this._phase)]
            } else {
                return [ this.real, this.imaginary ];
            }
        }

        
        /**
         * Creates a complex number given it's polar form
         *
         * @static
         * @param {number} modulus The absolute value, or modulus of the original number
         * @param {number} phase The angle, in degrees
         * @returns {ComplexNumberType} 
         */
        static fromPolar(modulus, phase) {
            // const real = absolute * Degrees.cos(argument)
            // const imaginary = absolute * Degrees.sin(argument)
            return new ComplexNumberType(0, 0, modulus, clampAngleDegrees(phase))
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
                return [z.real, z.imaginary, z.modulus, untransformAngle(z.phase)];
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
            if(s[3]) {
                s[3] = transformAngle(s[3]);
            }
            return new ComplexNumber.Type(...z)
        }
    }

    class ComplexNumberExtension {
        constructor() {
            Scratch.vm.salagataComplexNumber = ComplexNumber,
            // Scratch.vm.reisenComplexPolar = ComplexPolar,
            Scratch.vm.runtime.registerSerializer(
                "salagataComplexNumber",
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
                id: "salagataComplexNumber",
                name: this.formatMessage("Complex Numbers"),
                description: this.formatMessage("Complex Number Type for do complex analysis functions, perfect for rotation where vectors are slow"),
                color1: "#c3ba5e",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMjEuNjIxNjIiIGhlaWdodD0iMTIxLjYyMTYyIiB2aWV3Qm94PSIwLDAsMTIxLjYyMTYyLDEyMS42MjE2MiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE3OS4xODkxOSwtMTE5LjE4OTE5KSI+PGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTE3OS4xODkxOSwxODBjMCwtMzMuNTg0ODggMjcuMjI1OTMsLTYwLjgxMDgxIDYwLjgxMDgxLC02MC44MTA4MWMzMy41ODQ4OCwwIDYwLjgxMDgxLDI3LjIyNTkzIDYwLjgxMDgxLDYwLjgxMDgxYzAsMzMuNTg0ODggLTI3LjIyNTkzLDYwLjgxMDgxIC02MC44MTA4MSw2MC44MTA4MWMtMzMuNTg0ODgsMCAtNjAuODEwODEsLTI3LjIyNTkzIC02MC44MTA4MSwtNjAuODEwODF6IiBmaWxsPSIjYzNiYTVlIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNjIuMjMyNjksMTQ1LjA0NDA5YzAsNS4yMDA3NyAtNS4wMzI2Myw4LjYwNDQ2IC0xMi4zMTM3MSw4LjYwNDQ2Yy03LjI4MTA3LDAgLTEwLjc4NjUzLC0xLjEzNDE5IC0xMC43ODY1MywtNi4zMzQ5NWMwLC01LjIwMDc3IDQuNTc3NjgsLTkuODU5MjMgMTEuODU4NzUsLTkuODU5MjNjNy4yODEwOCwwIDExLjI0MTUsMi4zODg5NyAxMS4yNDE1LDcuNTg5NzR6IiBmaWxsPSIjZmZlYTAwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIvPjxwYXRoIGQ9Ik0yNTEuNzQ3MDYsMTc3LjQ1Nzk4Yy0xLjY1ODEzLDMuNDYzNTggLTMuNTEyMzEsNi42ODI2OCAtNi45MDI3OCwxNC4zNjA4M2MtMy4wMTc0OCw2LjgzMzQ3IC0xMS45MjA0OCwyMi41MTA4MiAtOS45MDgzLDIzLjUxOTkyYzMuNTYwMzQsNS40MTE3MyA1LjgyMTY2LDQuODExMDMgMTMuNDkyMiw2LjU5Njk1Yy00LjE5Nzc1LDEuOTg4MDggLTIyLjAyNjk5LC0xLjUwMDUzIC0yNC41MTA2OSwtMS43MjgyNWMtMTEuNTg2NDcsLTEuMDYyMzIgLTQuNTg4MiwtMTcuMTg3OTQgMi45MTMxNSwtMzAuODg4MTJjMi4xNTEyLC0zLjkyODg4IDkuMzYyMTgsLTE1LjIyNjM4IDkuMTUzMzMsLTE4LjY4MTI3Yy0wLjQwNzg2LC02Ljc0NzExIC0xNy42OTM1OCwtNC44MzI4OCAtMTUuMzIxMTMsLTYuOTk0NzhjMi41MjM3NiwtMi4yOTk3OSAyMy41MTYyNiwtMC4xNzM0MyAyOC45MzMsMC43MzMxOWM0LjQzOTYyLDEuNDg3NjkgNi4yOTA0MSwxLjk2NjUyIDYuMjI5NTUsNC4xOTcyOGMtMC4wNzUxLDIuNzUyOTQgLTMuMTYzNzMsNi4yMjUxNyAtNC4wNzgzMyw4Ljg4NDI0eiIgZmlsbD0iI2ZmZWEwMCIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIi8+PC9nPjwvZz48L3N2Zz4=",
                docsURI
                // blockText: "#000000",
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
                    {
                        opcode: "parseToComplex",
                        text: this.formatMessage("parse [A] to a complex number"),
                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "1,1",
                                exemptFromNormalization: true
                            }
                        },
                        blockType: Scratch.BlockType.REPORTER,
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
                        opcode: "getModulus",
                        text: this.formatMessage("absolute value [A]"),
                        arguments: {
                            A: ComplexNumber.Argument
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: "getPhase",
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
                        text: this.formatMessage("[A] x [B] using [FORM]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument,
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "divide",
                        text: this.formatMessage("[A] / [B] using [FORM]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument,
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            }
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
                        opcode: "complexToString",
                        text: this.formatMessage("[COMPLEX] to [FORM] as text"),
                        arguments: {
                            COMPLEX: ComplexNumber.Argument,
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            }
                        },
                        blockType: Scratch.BlockType.REPORTER
                    },
                    {
                        opcode: "forceForm",
                        text: this.formatMessage("use [FORM] for [COMPLEX]"),
                        arguments: {
                            COMPLEX: ComplexNumber.Argument,
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    // "---",
                    // {
                    //     opcode: "multiply2",
                    //     text: this.formatMessage("multiply [A] with [B] using the polar form"),
                    //     arguments: {
                    //         A: ComplexNumber.Argument,
                    //         B: ComplexNumber.Argument
                    //     },
                    //     ...ComplexNumber.Block
                    // },
                    // {
                    //     opcode: "divide2",
                    //     text: this.formatMessage("divide [A] with [B] using the polar form"),
                    //     arguments: {
                    //         A: ComplexNumber.Argument,
                    //         B: ComplexNumber.Argument
                    //     },
                    //     ...ComplexNumber.Block
                    // },
                    "---",
                    {
                        opcode: "power",
                        text: this.formatMessage("[A] ^ [B] using [FORM]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            },
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            }
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: "squareRoot",
                        text: this.formatMessage("square root of [A]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                        },
                        ...ComplexNumber.Block
                    },
                    // {
                    //     opcode: "power2",
                    //     text: this.formatMessage("[A] ^ [B] using the polar form"),
                    //     arguments: {
                    //         A: ComplexNumber.Argument,
                    //         B: {
                    //             type: Scratch.ArgumentType.NUMBER,
                    //             defaultValue: 2
                    //         },
                    //     },
                    //     ...ComplexNumber.Block
                    // },
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
                    {
                        opcode: "complexPower",
                        text: this.formatMessage("[A] ^ [B]"),
                        arguments: {
                            A: ComplexNumber.Argument,
                            B: ComplexNumber.Argument,
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
                        opcode: "exponential3",
                        text: this.formatMessage("e^[B]"),
                        arguments: {
                            B: ComplexNumber.Argument,
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
                    "---",
                    {
                        opcode: 'getPos',
                        text: this.formatMessage('position in [FORM]'),
                        blockText: null,
                        extensions: ["colours_motion"],
                        filter: [Scratch.TargetType.SPRITE],
                        arguments: {
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: 'getDirection',
                        text: this.formatMessage('direction in [FORM]'),
                        blockText: null,
                        extensions: ["colours_motion"],
                        filter: [Scratch.TargetType.SPRITE],
                        arguments: {
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: 'setPos',
                        text: this.formatMessage('go to [COMPLEX] using [FORM]'),
                        arguments: {
                            COMPLEX: ComplexNumber.Argument,
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            },
                        },
                        blockText: null,
                        extensions: ["colours_motion"],
                        filter: [Scratch.TargetType.SPRITE]
                    },
                    {
                        opcode: 'pointTowards',
                        text: this.formatMessage('point towards [COMPLEX] using [FORM]'),
                        arguments: {
                            COMPLEX: ComplexNumber.Argument,
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            },
                        },
                        blockText: null,
                        extensions: ["colours_motion"],
                        filter: [Scratch.TargetType.SPRITE]
                    },
                    "---",
                    {
                        opcode: 'getStretch',
                        text: this.formatMessage('stretch in [FORM]'),
                        blockText: null,
                        extensions: ["colours_looks"],
                        filter: [Scratch.TargetType.SPRITE],
                        arguments: {
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    {
                        opcode: 'setStretch',
                        text: this.formatMessage('set stretch to [COMPLEX] using [FORM]'),
                        arguments: {
                            COMPLEX: ComplexNumber.Argument,
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            },
                        },
                        blockText: null,
                        extensions: ["colours_looks"],
                        filter: [Scratch.TargetType.SPRITE]
                    },
                    "---",
                    {
                        opcode: 'getMouse',
                        text: this.formatMessage('mouse position in [FORM]'),
                        blockText: null,
                        extensions: ["colours_sensing"],
                        arguments: {  
                            FORM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FORMS'
                            },
                        },
                        ...ComplexNumber.Block
                    },
                    "---",
                    {
                        opcode: 'transformAngle',
                        text: this.formatMessage("transform [ANGLE] into Complex Plane Angle"),
                        blockText: null,
                        extensions: ["colours_operators"],
                        arguments: {  
                            ANGLE: {
                                type: Scratch.ArgumentType.ANGLE,
                                defaultValue: 60
                            }
                        },
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.ROUND,
                        disableMonitor: true
                    },
                    {
                        opcode: 'untransformAngle',
                        text: this.formatMessage("transform [ANGLE] into Scratch Angle"),
                        blockText: null,
                        extensions: ["colours_operators"],
                        arguments: {  
                            ANGLE: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 30
                            }
                        },
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.ROUND,
                        disableMonitor: true
                    },
                    
                    ...(Scratch.vm.runtime.ext_jwVector ? ["---"] : []),
                    {
                        opcode: "toVector",
                        text: this.formatMessage("convert [COMPLEX] to vector"),
                        arguments: {
                            COMPLEX: ComplexNumber.Argument,
                        },
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.LEAF,
                        disableMonitor: true,
                        hideFromPalette: !Scratch.vm.runtime.ext_jwVector,
                        ...(Scratch.vm.jwVector ? Scratch.vm.jwVector.Block : {})
                    },
                    {
                        opcode: "fromVector",
                        text: this.formatMessage("convert [VECTOR] to complex number"),
                        arguments: {
                            VECTOR: {
                                ...(Scratch.vm.jwVector ? Scratch.vm.jwVector.Argument : {})
                            },
                        },
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        hideFromPalette: !Scratch.vm.runtime.ext_jwVector,
                        ...ComplexNumber.Block
                    },


                    // ...(Scratch.vm.runtime.ext_jwArray ? ["---"] : []),
                    // {
                    //     opcode: "roots3",
                    //     text: this.formatMessage("roots of equation [C]x^[A] - [B] = 0"),
                    //     arguments: {
                    //         A: {
                    //             type: Scratch.ArgumentType.NUMBER,
                    //             defaultValue: 1
                    //         },
                    //         B: {
                    //             type: Scratch.ArgumentType.NUMBER,
                    //             defaultValue: 0
                    //         },
                    //         C: {
                    //             type: Scratch.ArgumentType.NUMBER,
                    //             defaultValue: 1
                    //         },
                    //     },
                        
                    //     blockType: Scratch.BlockType.REPORTER,
                    //     blockShape: Scratch.BlockShape.SQUARE,
                    //     disableMonitor: true,
                    //     hideFromPalette: !Scratch.vm.runtime.ext_jwArray,
                    //     ...(Scratch.vm.jwArray ? Scratch.vm.jwArray.Block : {})
                    // },

                ],
                menus: {
                    SOLUTIONS: {
                        acceptReporters: false,
                        items: [
                            {
                                text: this.formatMessage("first"),
                                value: "first"
                            },
                            {
                                text: this.formatMessage("second"),
                                value: "second"
                            },
                        ]
                    },
                    FORMS: {
                        acceptReporters: false,
                        items: [
                            {
                                text: this.formatMessage("rectangular form"),
                                value: "rectangular"
                            },
                            {
                                text: this.formatMessage("polar form"),
                                value: "polar"
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
            const phase = transformAngle(Scratch.Cast.toNumber(args.PHASE));

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
            const phase = transformAngle(Scratch.Cast.toNumber(args.PHASE));

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

        getModulus(args) {
            return ComplexNumberType.toComplex(args.A).modulus
        } 

        getPhase(args) {
            return untransformAngle(ComplexNumberType.toComplex(args.A).phase)
        } 

        parseToComplex(args) {
            return ComplexNumberType.toComplex(args.A);
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
            const FORM = Scratch.Cast.toString(args.FORM);
            
            switch (FORM) {
                case "polar":
                    return new ComplexNumberType(
                        A.real * B.real - A.imaginary  * B.imaginary, 
                        A.real * B.imaginary + A.imaginary  * B.real
                        , A.modulus * B.modulus
                        , (A.phase + B.phase)
                    );
            
                case "rectangular":
                    return new ComplexNumberType(
                        A.real * B.real - A.imaginary  * B.imaginary, 
                        A.real * B.imaginary + A.imaginary  * B.real
                    );
            }       
            
            
            
        }

        divide(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const B = ComplexNumberType.toComplex(args.B);
            const FORM = Scratch.Cast.toString(args.FORM);
            const u = B.real ** 2 + B.imaginary ** 2;

            switch (FORM) {
                case "polar":
                    return new ComplexNumberType(
                        (A.real * B.real + A.imaginary * B.imaginary) / u, 
                        (A.imaginary * B.real - A.real * B.imaginary) / u
                        , A.modulus / B.modulus
                        , (A.phase - B.phase)
                    );
                case "rectangular":
            
                    return new ComplexNumberType(
                        (A.real * B.real + A.imaginary * B.imaginary) / u, 
                        (A.imaginary * B.real - A.real * B.imaginary) / u
                    );

            }
        }

        multiplyConjugate(args) {
            const A = ComplexNumberType.toComplex(args.A);
            
            if(A._fromPolar) {
                return new ComplexNumberType(A.real ** 2 + A.imaginary ** 2,0,
                    A.modulus ** 2, 0);
            } else {
                return new ComplexNumberType(A.real ** 2 + A.imaginary ** 2,0);
            }
        }

        reciprocal(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const u = A.real ** 2 + A.imaginary ** 2;

            if(A._fromPolar) {
                return new ComplexNumberType(A.real / u, -A.imaginary / u, 
                    1 / A.modulus, -A.phase);
            } else {
                return new ComplexNumberType(A.real / u, -A.imaginary / u);
            }
            
        }

        /**
         * Forces one kind of complex number, either polar or rectangular
         *
         * @param {ComplexNumberType} args.COMPLEX
         * @param {"polar"|"rectangular"} args.FORM
         * @returns {ComplexNumberType} 
         */
        forceForm(args) {
            const COMPLEX = ComplexNumberType.toComplex(args.COMPLEX);
            const FORM = Scratch.Cast.toString(args.FORM);

            return forceForm(COMPLEX,FORM);
        }
        
        /**
         * Converts a polar number or a complex number into a text
         *
         * @param {ComplexNumberType} args.COMPLEX
         * @param {"polar"|"rectangular"} args.FORM
         * @returns {ComplexNumberType} 
         */
        complexToString(args) {
            const COMPLEX = ComplexNumberType.toComplex(args.COMPLEX);
            const FORM = Scratch.Cast.toString(args.FORM);


            return COMPLEX.toString(FORM == "polar");
        }
        
        power(args) {
            const A = ComplexNumberType.toComplex(args.A);
            let power = Scratch.Cast.toNumber(args.B);
            const FORM = Scratch.Cast.toString(args.FORM);
            
            switch (FORM) {
                case "polar":
                    // quickier and accepts decimals
                    if(power == 0) {
                        return new ComplexNumberType(1,0)
                    }
                    if(power == 1) {
                        return A
                    }

                    const r = A.modulus ** power;
                    const phi = A.phase * power;

                    return new ComplexNumberType(
                        r * Degrees.cos(phi),
                        r * Degrees.sin(phi),
                        r, phi
                    );
                case "rectangular":
                    power = Math.round(power); // This uses the definition of product for integer powers, 
                    // still can't do an rectangular form-only for do decimal powers of complex numbers

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
        }


        
        squareRoot(args) {
            const A = ComplexNumberType.toComplex(args.A);
            const r = Math.hypot(A.real, A.imaginary);

            return new ComplexNumberType(
                Math.sqrt(1/2 * (r + A.real)),
                (A.imaginary >= 0 ? 1 : -1) * Math.sqrt(1/2 * (r - A.real)),
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

            const r = subRadical == 2 ? Math.sqrt(A.modulus) : (A.modulus ** (1/subRadical));
            const phi = A.phase / subRadical;

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
                return new ComplexNumberType(1,0,1,180);
            }
            if(radians == 1) {
                return new ComplexNumberType(-1,0,1,180);
            }
            
            const real = Math.cos(radians * Math.PI);
            const imaginary = Math.sin(radians * Math.PI);

            return new ComplexNumberType(real, imaginary, 1, radianToDegrees(radians * Math.PI))
        }
        exponential2(args) {
            const radians = Scratch.Cast.toNumber(args.B);
            if(radians == 0) {
                return new ComplexNumberType(1,0,1,180);
            }
            if(radians == Math.PI) {
                return new ComplexNumberType(-1,0,1,180);
            }
            
            const real = Math.cos(radians);
            const imaginary = Math.sin(radians);

            return new ComplexNumberType(real, imaginary, 1, radianToDegrees(radians))
        }

        
        /**
         * Calculates exp(z) or e^z of a complex number
         *
         * @param {ComplexNumberType} complex A complex number
         * @returns {ComplexNumberType} Exponentiated
         */
        _exp(complex) {
            const radians = complex.imaginary;
            const ea = complex.real == 0 ? 1 : Math.exp(complex.real);

            if(radians == 0) {
                return new ComplexNumberType(ea,0,ea,0);
            }
            if(radians == Math.PI) {
                return new ComplexNumberType(-ea,0,ea,180);
            }

            const real = ea * Math.cos(radians);
            const imaginary = ea * Math.sin(radians);

            return new ComplexNumberType(real, imaginary, ea, radianToDegrees(radians))
        }
        
        exponential3(args) {
            // e^(a+bi) = e^a * e^bi
            const complex = ComplexNumberType.toComplex(args.B);

            return this._exp(complex)
        }

        
        /**
         * Direct Natural logarithm of a complex number
         *
         * @param {ComplexNumberType} complex Complex
         * @returns {ComplexNumberType} The Natural Logarithm
         */
        _ln(complex) {
            const A = complex;
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

            const r = Math.log(A.modulus);
            const arg = degreesToRadian(A.phase);
            
            return new ComplexNumberType(r,arg);
        }

        naturalLogarithm(args) {
            const A = ComplexNumberType.toComplex(args.A);

            return this._ln(A);
        }

        complexPower(args) {
            // (a+bi)^(c+di) = e^[(c+di)*ln(a+bi)]
            const A = ComplexNumberType.toComplex(args.A);
            const B = ComplexNumberType.toComplex(args.B);

            const lnA = this._ln(A);

            let blnA
            if(B._fromPolar) {
                blnA = new ComplexNumberType(
                    lnA.real * B.real - lnA.imaginary  * B.imaginary, 
                    lnA.real * B.imaginary + lnA.imaginary  * B.real
                    , lnA.modulus * B.modulus
                    , (lnA.phase + B.phase)
                );
            } else {
                blnA = new ComplexNumberType(
                    lnA.real * B.real - lnA.imaginary  * B.imaginary, 
                    lnA.real * B.imaginary + lnA.imaginary  * B.real
                );
            }

            return this._exp(blnA);

            
            // if(A.real == 0 && A.imaginary == 0) {
            //     return new ComplexNumberType(1);
            // }
            // if(A.imaginary == 0) {
            //     // a^(c+di) = e^[(c+di)*ln(a)]

            //     const lnA = this._ln(new ComplexNumberType(A.real));

            //     // if(A.real > 0) {
            //     //     return new ComplexNumberType(Math.log(A.real));
            //     // } else {
            //     //     return new ComplexNumberType(Math.log(Math.abs(A.real)),Math.PI);
            //     // }
            // }
            // if(A.real == 0) {
            //     if(A.imaginary > 0) {
            //         return new ComplexNumberType(Math.log(A.imaginary), Math.PI / 2);
            //     } else {
            //         return new ComplexNumberType(Math.log(Math.abs(A.imaginary)), -Math.PI / 2);
            //     }
            // }

            // const complex = B;
            // const radians = complex.imaginary;
            // const ea = complex.real == 0 ? 1 : Math.exp(complex.real);

            // if(radians == 0) {
            //     return new ComplexNumberType(ea,0,ea,0);
            // }
            // if(radians == Math.PI) {
            //     return new ComplexNumberType(-ea,0,ea,180);
            // }

            // const real = ea * Math.cos(radians);
            // const imaginary = ea * Math.sin(radians);

            // return new ComplexNumberType(real, imaginary, ea, radianToDegrees(radians))
        }
        
        
        /**
         * Solve an equation of the form ax^2 + bx + c = 0
         *
         * @param {number} a Quadratic component
         * @param {number} b Linear component
         * @param {number} c Inpedentent component
         * @returns {[ComplexNumberType,ComplexNumberType]} Solutions
         */
        _quadratic(a,b,c) {
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

        quadraticEquation(args) {
            const a = Math.round(Scratch.Cast.toNumber(args.A));
            const b = Math.round(Scratch.Cast.toNumber(args.B));
            const c = Math.round(Scratch.Cast.toNumber(args.C));

            return this._quadratic(a,b,c);
        }
        quadraticEquation2(args) {
            const a = Math.round(Scratch.Cast.toNumber(args.A));
            const b = Math.round(Scratch.Cast.toNumber(args.B));
            const c = Math.round(Scratch.Cast.toNumber(args.C));

            const solutions = this._quadratic(a,b,c);

            switch (args.SOLUTION) {
                case "first":
                    return solutions[0];

                case "second":
                    return solutions[1];
            
                default:
                    break;
            }
        }
        
        // roots(args) {
        //     const a = Math.round(Math.abs(Scratch.Cast.toNumber(args.A)));
        //     const b = Scratch.Cast.toNumber(args.B);

        //     if(a == 0) {
        //         return NaN;
        //     }
        //     if(a == 1) {
        //         return [ ComplexNumberType.toComplex(a) ];
        //     }

        //     let roots = [];

        //     const r = a == 2 ? Math.sqrt(b) : (b ** (1/a));
        //     for (let k = 0; k < a; k++) {
                
        //         const phi = (0 + k * 360) / a;

        //         roots.push(new ComplexNumberType(
        //             0, // r * Degrees.cos(phi),
        //             0, // r * Degrees.sin(phi),
        //             r, phi
        //         ));
        //     }

        //     return roots;
        // }

        
        /**
         * Solve the equation of the form cz^a - b = 0
         *
         * @param {number} a Positive integer power
         * @param {number} b Independent component
         * @param {number} c Factor
         * 
         * @returns {NaN | Array<ComplexNumberType>} Solutions
         */
        _poly(a,b,c) {
            if(a == 0) {
                return NaN;
            }
            if(a == 1) {
                return [ ComplexNumberType.toComplex(a) ];
            }

            let roots = [];

            const r = a == 2 ? Math.sqrt(b)/Math.sqrt(c) : ((b ** (1/a))/(c ** (1/a)));
            for (let k = 0; k < a; k++) {
                
                const phi = (0 + k * 360) / a;

                roots.push(new ComplexNumberType(
                    0, // r * Degrees.cos(phi),
                    0, // r * Degrees.sin(phi),
                    r, phi
                ));
            }

            return roots;
        }
        
        roots2(args) {
            const a = Math.round(Math.abs(Scratch.Cast.toNumber(args.A)));
            const b = Scratch.Cast.toNumber(args.B);
            const c = Scratch.Cast.toNumber(args.C);

            return this._poly(a,b,c);
        }
        
        // roots3(args) {
        //     const a = Math.round(Math.abs(Scratch.Cast.toNumber(args.A)));
        //     const b = Scratch.Cast.toNumber(args.B);
        //     const d = Math.round(Math.abs(Scratch.Cast.toNumber(args.D)));

        //     // const c = Scratch.Cast.toNumber(args.C);

        //     if(a == 0) {
        //         return NaN;
        //     }
        //     if(a == 1) {
        //         return [ ComplexNumberType.toComplex(a) ];
        //     }

        //     let roots = [];

        //     const r = a == 2 ? Math.sqrt(b) : (b ** (1/a));
                
        //         const phi = (0 + d * 360) / a;

        //     return new ComplexNumberType(
        //             0, // r * Degrees.cos(phi),
        //             0, // r * Degrees.sin(phi),
        //             r, phi
        //         );
        // }
        
        roots4(args) {
            // d-th solution of equation cz^a - b = 0  
            const a = Math.round(Math.abs(Scratch.Cast.toNumber(args.A)));
            const b = Scratch.Cast.toNumber(args.B);

            const c = Scratch.Cast.toNumber(args.C);
            const d = Math.round(Math.abs(Scratch.Cast.toNumber(args.D)));

            if(a == 0) {
                return NaN;
            }
            if(a == 1) {
                return [ ComplexNumberType.toComplex(a) ];
            }

            let roots = [];

            const r = a == 2 ? Math.sqrt(b)/Math.sqrt(c) : ((b ** (1/a))/(c ** (1/a)));

                const phi = (0 + d * 360) / a;

            return new ComplexNumberType(
                    0, // r * Degrees.cos(phi),
                    0, // r * Degrees.sin(phi),
                    r, phi
                );
        }

        // Integrations with Scratch for doing things easier <3
        
        getPos(args, util) {
            const FORM = Scratch.Cast.toString(args.FORM);
            return forceForm(new ComplexNumberType(util.target.x,util.target.y), FORM);
        }

        getDirection(args, util) {
            const FORM = Scratch.Cast.toString(args.FORM);
            return forceForm(ComplexNumberType.fromPolar(1, transformAngle(util.target.direction)), FORM);
        }

        setPos(args, util) {
            const FORM = Scratch.Cast.toString(args.FORM);
            const POSITION = forceForm(ComplexNumberType.toComplex(args.COMPLEX), FORM);

            util.target.setXY(POSITION.real, POSITION.imaginary)
        }

        pointTowards(args, util) {
            const FORM = Scratch.Cast.toString(args.FORM);
            const POSITION = forceForm(ComplexNumberType.toComplex(args.COMPLEX), FORM);
            util.target.setDirection(untransformAngle(POSITION.phase));
            // return forceForm(new ComplexNumberType(undefined, undefined, 1, util.target.direction), FORM);
        }

        getStretch(args, util) {
            const FORM = Scratch.Cast.toString(args.FORM);
            return forceForm(new ComplexNumberType(...util.target.stretch), FORM)
        }

        setStretch(args, util) {
            const FORM = Scratch.Cast.toString(args.FORM);
            const STRETCH = forceForm(ComplexNumberType.toComplex(args.COMPLEX), FORM)

            util.target.setStretch(STRETCH.real, STRETCH.imaginary)
        }

        getMouse(args, util) {
            const FORM = Scratch.Cast.toString(args.FORM);
            
            return forceForm(new ComplexNumberType(vm.runtime.ioDevices.mouse.getScratchX(), vm.runtime.ioDevices.mouse.getScratchY()), FORM)
        }

        toVector(args) {
            const COMPLEX = ComplexNumberType.toComplex(args.COMPLEX);
        
            return new Scratch.vm.jwVector.Type(COMPLEX.real, COMPLEX.imaginary)
        }
        
        fromVector(args) {
            const VECTOR = Scratch.vm.jwVector.Type.toVector(args.VECTOR);

            return new ComplexNumberType(VECTOR.x, VECTOR.y)

        }

        transformAngle(args) {
            const angle = Scratch.Cast.toNumber(args.ANGLE);

            return transformAngle(angle);
        }

        untransformAngle(args) {
            const angle = Scratch.Cast.toNumber(args.ANGLE);

            return untransformAngle(angle);
        }


    }
    Scratch.extensions.register( new ComplexNumberExtension() )
})(Scratch)