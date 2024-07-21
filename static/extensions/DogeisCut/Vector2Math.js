// Name: Vector2 Math
// ID: dogeiscutdvector2math
// Description: Adds a completley new Vector2 data type with it's associated math functions!
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>
// License: MPL-2.0

// Version 1.0.0

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Vector2 Math\' must run unsandboxed!');
    }

    class Vector2 {
        constructor(x = 0, y = 0) {
            this.x = x;
            this.y = y;
        }
    
        add(v) {
            return new Vector2(this.x + v.x, this.y + v.y);
        }
    
        subtract(v) {
            return new Vector2(this.x - v.x, this.y - v.y);
        }

        multiply(scalar) {
            return new Vector2(this.x * scalar, this.y * scalar);
        }
    
        divide(scalar) {
            return new Vector2(this.x / scalar, this.y / scalar);
        }
    
        dot(v) {
            return this.x * v.x + this.y * v.y;
        }
    
        cross(v) {
            return this.x * v.y - this.y * v.x;
        }
    
        magnitude() {
            return Math.sqrt(this.x * this.x + this.y * this.y);
        }
    
        normalize() {
            let mag = this.magnitude();
            if (mag !== 0) {
                return this.divide(mag);
            } else {
                return new Vector2(0, 0);
            }
        }
    
        distance(v) {
            let dx = this.x - v.x;
            let dy = this.y - v.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    
        rotate(angle) {
            let cos = Math.cos(angle);
            let sin = Math.sin(angle);
            return new Vector2(this.x * cos - this.y * sin, this.x * sin + this.y * cos);
        }
    
        static fromAngle(angle) {
            return new Vector2(Math.cos(angle), Math.sin(angle));
        }

        getAngle() {
            return Math.atan2(this.y, this.x);
        }

        getAngleTo(v) {
            let direction = v.subtract(this);
            return direction.getAngle();
        }
    
        toString() {
            //return `Vector2(${this.x}, ${this.y})`;
            return '<Vector2>'
        }

        static fromString(str) {
            str = str.trim().replace(/^\[|\]$/g, '').replace(/^\(|\)$/g, '').replace(/Vector2|vector2/g, '');
            
            const numbers = str.match(/-?\d*\.?\d+/g);
    
            const x = parseFloat(numbers[0]);
            const y = numbers.length > 1 ? parseFloat(numbers[1]) : x;
    
            if (!isNaN(x)) {
                return new Vector2(x, y);
            } else {
                throw new Error("Invalid string format");
            }
        }

        static isVector2(obj) {
            return obj instanceof Vector2;
        }

        static cast(value) {
            if (Vector2.isVector2(value)) {
                return value;
            } else if (typeof value === 'string') {
                try {
                    return Vector2.fromString(value);
                } catch(error) {
                    return new Vector2()
                }
            } else if (typeof value === 'number') {
                return new Vector2(value, value);
            } else if (typeof value === 'object' && value !== null) {
                if ('x' in value && 'y' in value) {
                    const x = parseFloat(value.x);
                    const y = parseFloat(value.y);
                    if (!isNaN(x) && !isNaN(y)) {
                        return new Vector2(x, y);
                    } else {
                        return new Vector2()
                    }
                }
            }
            return new Vector2()
        }
    }

    class Vector2Math {
        getInfo() {
            return {
                id: 'dogeiscutvector2math',
                name: 'Vector2 Math',
                color1: "#43dba8",
                color2: "#38a881",
                color3: "#339e77",
                blocks: [
                    {
                        opcode: "newVector2",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "new vector2 x: [X] y: [Y]",
                        arguments: {
                          X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10,
                          },
                          Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10,
                          },
                        },
                    },
                    {
                        opcode: "newVector2Single",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "new vector2 xy: [XY]",
                        arguments: {
                          XY: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10,
                          },
                        },
                    },
                    '---',
                    {
                        opcode: "setVector2to",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set vector2 [VECTOR2] to x: [X] y: [Y]",
                        arguments: {
                          VECTOR2: {
                            type: null,
                          },
                          X: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 25,
                          },
                          Y: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 25,
                          },
                        },
                    }, 
                    {
                        opcode: "setVector2XYto",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set vector2 [VECTOR2] [XY] to [A]",
                        arguments: {
                          VECTOR2: {
                            type: null,
                          },
                          XY: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'COORDS_MENU'
                          },
                          A: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 25,
                          },
                        },
                    },
                    '---',
                    {
                        opcode: "getXYOfVector2",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "get [XY] of vector2 [VECTOR2]",
                        arguments: {
                          XY: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'COORDS_MENU'
                          },
                          VECTOR2: {
                            type: null,
                          }
                        },
                    },
                    {
                        opcode: "setXYOfVector2",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "set [XY] of vector2 [VECTOR2] to [A]",
                        arguments: {
                          XY: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'COORDS_MENU'
                          },
                          VECTOR2: {
                            type: null,
                          },
                          A: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 25,
                          },
                        },
                    },
                    {
                        opcode: "changeXYOfVector2",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "change [XY] of vector2 [VECTOR2] by [A]",
                        arguments: {
                          XY: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'COORDS_MENU'
                          },
                          VECTOR2: {
                            type: null,
                          },
                          A: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 25,
                          },
                        },
                    },
                    '---',
                    {
                        opcode: "vector2AsString",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "vector2 [VECTOR2] as string",
                        arguments: {
                            VECTOR2: {
                            type: null
                          },
                        },
                    },
                    {
                        opcode: "stringAsVector2",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "string [STRING] as vector2",
                        arguments: {
                          STRING: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '[10, 10]',
                          }
                        },
                    },
                    {
                        opcode: "isVector2",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is [A] vector2?",
                        arguments: {
                          A: {
                            type: null
                          },
                        },
                    },
                    '---',
                    {
                        opcode: "add",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "[A] + [B]",
                        arguments: {
                          A: {
                            type: null,
                          },
                          B: {
                            type: null,
                          }
                        },
                    },
                    {
                        opcode: "subtract",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "[A] - [B]",
                        arguments: {
                          A: {
                            type: null,
                          },
                          B: {
                            type: null,
                          }
                        },
                    },
                    {
                        opcode: "multiply",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "[A] * [B]",
                        arguments: {
                          A: {
                            type: null,
                          },
                          B: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10,
                          }
                        },
                    },
                    {
                        opcode: "divide",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "[A] / [B]",
                        arguments: {
                          A: {
                            type: null,
                          },
                          B: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 10,
                          }
                        },
                    },
                    '---',
                    {
                        opcode: "dot",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "dot product of [A] and [B]",
                        arguments: {
                          A: {
                            type: null,
                          },
                          B: {
                            type: null,
                          }
                        },
                    },
                    {
                        opcode: "cross",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "cross product of [A] and [B]",
                        arguments: {
                          A: {
                            type: null,
                          },
                          B: {
                            type: null,
                          }
                        },
                    },
                    {
                        opcode: "magnitude",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "magnitude of [VECTOR2]",
                        arguments: {
                          VECTOR2: {
                            type: null,
                          },
                        },
                    },
                    '---',
                    {
                        opcode: "normalize",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "[VECTOR2] normalized",
                        arguments: {
                          VECTOR2: {
                            type: null,
                          },
                        },
                    },
                    '---',
                    {
                        opcode: "distance",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "distance between [A] and [B]",
                        arguments: {
                          A: {
                            type: null,
                          },
                          B: {
                            type: null,
                          }
                        },
                    },
                    {
                        opcode: "angleTo",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "angle from [A] to [B]",
                        arguments: {
                          A: {
                            type: null,
                          },
                          B: {
                            type: null,
                          }
                        },
                    },
                    '---',
                    {
                        opcode: "fromAngle",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "vector2 from direction [DIRECTION]",
                        arguments: {
                          DIRECTION: {
                            type: Scratch.ArgumentType.ANGLE,
                            defaultValue: 90
                          },
                        },
                    },
                    {
                        opcode: "rotate",
                        blockType: Scratch.BlockType.REPORTER,
                        blockShape: Scratch.BlockShape.SQUARE,
                        text: "rotate vector2 [VECTOR2] by [A]",
                        arguments: {
                          VECTOR2: {
                            type: null,
                          },
                          A: {
                            type: Scratch.ArgumentType.NUMBER,
                            defaultValue: 15
                          },
                        },
                    },
                    {
                        opcode: "toAngle",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "direction from vector2 [VECTOR2]",
                        arguments: {
                        VECTOR2: {
                            type: null,
                          },
                        },
                    },
                ],
                menus: {
                    COORDS_MENU: {
                      acceptReporters: true,
                      items: ["x", "y"],
                    },
                }
            }
        }

        scratchDirectionToRadians(scratchDirection) {
            let adjustedDegrees = 90 - scratchDirection;
            let radians = adjustedDegrees * (Math.PI / 180);
            return radians;
        }
        radiansToScratchDirection(radians) {
            let degrees = radians * (180 / Math.PI);
            let scratchDirection = 90 - degrees;
            scratchDirection = ((scratchDirection + 180) % 360) - 180;
            return scratchDirection;
        }

        newVector2(args) {
            return (new Vector2(args.X, args.Y))
        }

        newVector2Single(args) {
            return this.newVector2({X: args.XY, Y: args.XY})
        }


        setVector2to(args) {
            const vector2 = Vector2.cast(args.VECTOR2)
            vector2.x = args.X
            vector2.y = args.Y
        }

        setVector2XYto(args) {
            const vector2 = Vector2.cast(args.VECTOR2)
            switch (args.XY) {
                case 'x':
                    vector2.x = args.A
                    break;
                case 'y':
                    vector2.y = args.A
                    break;
            } 
        }


        isVector2(args) {
            return Vector2.isVector2(args.A)
        }


        getXYOfVector2(args) {
            const vector2 = Vector2.cast(args.VECTOR2)
            switch (args.XY) {
                case 'x':
                    return vector2.x
                case 'y':
                    return vector2.y
            } 
        }
        setXYOfVector2(args) {
            const vector2 = new Vector2(Vector2.cast(args.VECTOR2).x, Vector2.cast(args.VECTOR2).y)
            switch (args.XY) {
                case 'x':
                    vector2.x = args.A
                    break;
                case 'y':
                    vector2.y = args.A
                    break;
            } 
            return vector2
        }
        changeXYOfVector2(args) {
            const vector2 = new Vector2(Vector2.cast(args.VECTOR2).x, Vector2.cast(args.VECTOR2).y)
            switch (args.XY) {
                case 'x':
                    vector2.x += args.A
                    break;
                case 'y':
                    vector2.y += args.A
                    break;
            } 
            return vector2
        }

        vector2AsString(args) {
            const vector2 = Vector2.cast(args.VECTOR2)
            return `[${vector2.x}, ${vector2.y}]`;
        }

        stringAsVector2(args) {
            return Vector2.cast(args.STRING)
        }


        add(args) {
            const A = Vector2.cast(args.A)
            const B = Vector2.cast(args.B)
            return A.add(B)
        }

        subtract(args) {
            const A = Vector2.cast(args.A)
            const B = Vector2.cast(args.B)
            return A.subtract(B)
        }

        multiply(args) {
            const A = Vector2.cast(args.A)
            const B = Scratch.Cast.toNumber(args.B)
            return A.multiply(B)
        }

        divide(args) {
            const A = Vector2.cast(args.A)
            const B = Scratch.Cast.toNumber(args.B)
            return A.divide(B)
        }


        dot(args) {
            const A = Vector2.cast(args.A)
            const B = Vector2.cast(args.B)
            return A.dot(B)
        }

        cross(args) {
            const A = Vector2.cast(args.A)
            const B = Vector2.cast(args.B)
            return A.cross(B)
        }


        magnitude(args) {
            const A = Vector2.cast(args.VECTOR2)
            return A.magnitude()
        }

        normalize(args) {
            const A = Vector2.cast(args.VECTOR2)
            return A.normalize()
        }


        distance(args) {
            const A = Vector2.cast(args.A)
            const B = Vector2.cast(args.B)
            return A.distance(B)
        }

        angleTo(args) {
            const A = Vector2.cast(args.A)
            const B = Vector2.cast(args.B)
            return this.radiansToScratchDirection(A.getAngleTo(B))
        }


        fromAngle(args) {
            const DIRECTION = this.scratchDirectionToRadians(Scratch.Cast.toNumber(args.DIRECTION))
            return Vector2.fromAngle(DIRECTION)
        }

        rotate(args) {
            const A = Vector2.cast(args.VECTOR2)
            return A.rotate(this.scratchDirectionToRadians(args.A))
        }

        toAngle(args) {
            const A = Vector2.cast(args.VECTOR2)
            return this.radiansToScratchDirection(A.getAngle())
        }
    }

    Scratch.extensions.register(new Vector2Math());
})(Scratch);