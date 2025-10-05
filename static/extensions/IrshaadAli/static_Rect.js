(function (Scratch) {
    const Cast = Scratch.Cast;
    const BlockType = Scratch.BlockType;
    const BlockShape = Scratch.BlockShape;
    const ArgumentType = Scratch.ArgumentType;

    const vm = Scratch.vm;
    const mouse = vm.runtime.ioDevices.mouse

    if (!vm.jwVector) vm.extensionManager.loadExtensionIdSync('jwVector')

    const jwVector = vm.jwVector
    const Vector = jwVector.Type

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

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }


    class RectType {
        customId = "IAliRect"

        constructor(x = 0, y = 0, width = 0, height = 0) {
            this.x = isNaN(x) ? 0 : x
            this.y = isNaN(y) ? 0 : y
            this.width = isNaN(width) ? 0 : width
            this.height = isNaN(height) ? 0 : height
        }

        static toRect(r) {
            if (r instanceof RectType) return r
            if (r instanceof Array && r.length == 4) return new RectType(r[0], r[1], r[2], r[3])
            if (r instanceof Array && r.length == 2) {
                let x = 0
                let y = 0
                let w = 0
                let h = 0

                if (r[0] instanceof Vector) {
                    r[0] = Vector.toVector(r[0])
                    x = r[0].x
                    y = r[0].y
                } else {
                    x = r[0][0]
                    y = r[0][1]
                }
                if (r[1] instanceof Vector) {
                    r[1] = Vector.toVector(r[1])
                    w = r[1].x
                    h = r[1].y
                } else {
                    w = r[1][0]
                    h = r[1][1]
                }

                return new RectType(x, y, w, h)
            }
            if (String(r).split(',')) {
                let array = String(r).split(',').map(value => Cast.toNumber(value))
                return new RectType(
                    array[0],
                    array[1],
                    array[2],
                    array[3],
                )
            }
            return new RectType(0, 0, 0, 0)
        }

        IAliRectHandler() {
            return "Rect"
        }

        toString() {
            return `${this.x},${this.y},${this.width},${this.height}`
        }

        toMonitorContent = () => span(this.toString())

        toReporterContent() {
            let root = document.createElement('div')
            root.style.display = 'flex'
            root.style.width = "200px"
            root.style.overflow = "hidden"

            let details = document.createElement('div')
            details.style.display = 'flex'
            details.style.flexDirection = 'column'
            details.style.justifyContent = 'center'
            details.style.width = "100px"

            details.appendChild(span(`<b>X:</b> ${formatNumber(this.x)}`))
            details.appendChild(span(`<b>Y:</b> ${formatNumber(this.y)}`))
            details.appendChild(span(`<b>W:</b> ${formatNumber(this.width)}`))
            details.appendChild(span(`<b>H:</b> ${formatNumber(this.height)}`))

            root.appendChild(details)

            let square = document.createElement("div")
            square.style.width = "84px"
            square.style.height = "84px"
            square.style.margin = "8px"
            square.style.border = "4px solid black"
            square.style.boxSizing = "border-box"

            root.append(square)
            return root
        }

        get offsets() {
            return {
                'left': this.width / -2.0,
                'top': this.height / 2.0,
                'right': this.width / 2.0,
                'bottom': this.height / -2.0,
                'center': 0
            }
        }

        getPoint(type) {
            switch (type) {
                case 'x':
                    return this.x
                case 'y':
                    return this.y
                case 'width':
                    return this.width
                case 'height':
                    return this.height

                case 'left':
                    return this.x + this.offsets.left
                case 'top':
                    return this.y + this.offsets.top
                case 'bottom':
                    return this.y + this.offsets.bottom
                case 'right':
                    return this.x + this.offsets.right

                case 'topleft x':
                    return this.getPoint('left')
                case 'topleft y':
                    return this.getPoint('top')

                case 'topleft':
                    return new Vector(this.getPoint('left'), this.getPoint('top'))
                case 'midtop':
                    return new Vector(this.x, this.getPoint('top'))
                case 'topright':
                    return new Vector(this.getPoint('right'), this.getPoint('top'))

                case 'midleft':
                    return new Vector(this.getPoint('left'), this.y)
                case 'center':
                    return new Vector(this.x, this.y)
                case 'midright':
                    return new Vector(this.getPoint('right'), this.y)

                case 'bottomleft':
                    return new Vector(this.getPoint('left'), this.getPoint('bottom'))
                case 'midbottom':
                    return new Vector(this.x, this.getPoint('bottom'))
                case 'bottomright':
                    return new Vector(this.getPoint('right'), this.getPoint('bottom'))
                case 'size':
                    return new Vector(this.width, this.height)
            }
            return NaN
        }

        setSinglePoint(type, value) {
            value = Cast.toNumber(value)
            switch (type) {
                case 'x': this.x = value; break;
                case 'y': this.y = value; break;
                case 'width': this.width = value; break;
                case 'height': this.height = value; break;

                case 'topleft x': this.x = value - this.offsets.left; break;
                case 'topleft y': this.y = value - this.offsets.top; break;
            }
        }

        setVectorPoint(type, value) {
            value = Vector.toVector(value)
            switch (type) {
                case 'topleft':
                    this.x = value.x - this.offsets.left;
                    this.y = value.y - this.offsets.top;
                    break;
                case 'midtop':
                    this.x = value.x;
                    this.y = value.y - this.offsets.top;
                    break;
                case 'topright':
                    this.x = value.x - this.offsets.right;
                    this.y = value.y - this.offsets.left;
                    break;
                case 'midleft':
                    this.x = value.x - this.offsets.left;
                    this.y = value.y;
                    break;
                case 'center':
                    this.x = value.x
                    this.y = value.y
                    break;
                case 'midright':
                    this.x = value.x - this.offsets.right;
                    this.y = value.y;
                    break;
                case 'bottomleft':
                    this.x = value.x - this.offsets.left;
                    this.y = value.y - this.offsets.bottom;
                    break;
                case 'midbottom':
                    this.x = value.x;
                    this.y = value.y - this.offsets.bottom;
                    break;
                case 'bottomright':
                    this.x = value.x - this.offsets.right;
                    this.y = value.y - this.offsets.bottom;
                    break;

                case 'size':
                    this.width = value.x;
                    this.height = value.y;
                    break;
            }
        }

        collidesXYPoint(x, y) {
            x = isNaN(x) ? 0 : x
            y = isNaN(y) ? 0 : y

            return (
                x >= this.getPoint('left') && x <= this.getPoint('right') &&
                y >= this.getPoint('bottom') && y <= this.getPoint('top')
            )
        }

        collidesVectorPoint(vec) {
            vec = Vector.toVector(vec)

            return (
                vec.x >= this.getPoint('left') && vec.x <= this.getPoint('right') &&
                vec.y >= this.getPoint('bottom') && vec.y <= this.getPoint('top')
            )
        }

        collidesRect(rect) {
            rect = RectType.toRect(rect)

            return (
                this.getPoint('left') <= rect.getPoint('right') &&
                this.getPoint('right') >= rect.getPoint('left') &&
                this.getPoint('top') >= rect.getPoint('bottom') &&
                this.getPoint('bottom') <= rect.getPoint('top')
            )
        }
    }

    const Rect = {
        Type: RectType,
        Block: {
            blockType: BlockType.REPORTER,
            blockShape: BlockShape.SQUARE,
            // forceOutputType: "Rect",
            disableMonitor: true,
            allowDropAnywhere: true,
        },
        Argument: {
            shape: BlockShape.SQUARE,
        },

        NumberArg: {
            type: ArgumentType.NUMBER,
            defaultValue: 0,
        },

        SinglePointArg: {
            menu: 'singlePoint',
            defaultValue: 'x'
        },

        VectorPointArg: {
            menu: 'vectorPoint',
            defaultValue: 'topleft',
        }
    }

    class Extension {
        constructor () {
            vm.IAliRect = Rect
            vm.runtime.registerSerializer(
                "IAliRect",
                v => [v.x, v.y, v.width, v.height],
                v => new RectType(v.x, v.y, v.width, v.height)
            )
        }

        getInfo() {
            let blocks = [
                {
                    opcode: 'fromSprite',
                    text: 'from [SPRITE]',
                    arguments: {
                        SPRITE: {
                            type: ArgumentType.STRING,
                            menu: 'sprites'
                        }
                    },
                    ...Rect.Block
                },
                '---',
                {
                    opcode: 'newRect4',
                    text: 'rect x: [X] y: [Y] w: [W] h: [H]',
                    arguments: {
                        X: Rect.NumberArg,
                        Y: Rect.NumberArg,
                        W: Rect.NumberArg,
                        H: Rect.NumberArg,
                    },
                    ...Rect.Block
                },
                {
                    opcode: 'newRect2',
                    text: 'rect xy: [XY] wh: [WH]',
                    arguments: {
                        XY: jwVector.Argument,
                        WH: jwVector.Argument,
                    },
                    ...Rect.Block
                },
            ]

            blocks = blocks.concat([{
                opcode: 'newRect1',
                text: 'rect xywh: [XYWH]',
                hideFromPalette: !vm.runtime.ext_jwArray,
                arguments: {
                    XYWH: vm.runtime.ext_jwArray ? vm.jwArray.Argument : ArgumentType.CUSTOM,
                },
                ...Rect.Block
            }])

            blocks = blocks.concat([
                '---',
                {
                    opcode: 'getSinglePoint',
                    text: 'get [RECT] [TYPE]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        TYPE: Rect.SinglePointArg
                    }
                },
                {
                    opcode: 'setSinglePoint',
                    text: 'set [RECT] [TYPE] to [VALUE]',
                    arguments: {
                        RECT: Rect.Argument,
                        TYPE: Rect.SinglePointArg,
                        VALUE: Rect.NumberArg,
                    },
                    ...Rect.Block
                },

                '---',

                {
                    opcode: 'getVectorPoint',
                    text: 'get [RECT] [TYPE]',
                    arguments: {
                        RECT: Rect.Argument,
                        TYPE: Rect.VectorPointArg
                    },
                    ...jwVector.Block
                },
                {
                    opcode: 'setVectorPoint',
                    text: 'set [VALUE] [TYPE] to [VALUE]',
                    arguments: {
                        RECT: Rect.Argument,
                        TYPE: Rect.VectorPointArg,
                        VALUE: jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    blockType: BlockType.LABEL,
                    text: 'Collisions'
                },

                {
                    opcode: 'collidingXY',
                    text: '[RECT] colliding with x: [X] y: [Y]?',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        RECT: Rect.Argument,
                        X: Rect.NumberArg,
                        Y: Rect.NumberArg,
                    }
                },

                {
                    opcode: 'collidingPoint',
                    text: '[RECT] colliding with point [VECTOR]?',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        RECT: Rect.Argument,
                        VECTOR: jwVector.Argument,
                    }
                },

                {
                    opcode: 'collidingRect',
                    text: '[RECTA] colliding with rect [RECTB]?',
                    blockType: Scratch.BlockType.BOOLEAN,
                    arguments: {
                        RECTA: Rect.Argument,
                        RECTB: Rect.Argument,
                    },
                },

                {
                    opcode: 'collidingMouse',
                    text: '[RECT] touching mouse (via client [CLIENT] and centered [CENTERED])?',
                    blockType: BlockType.BOOLEAN,
                    arguments: {
                        RECT: Rect.Argument,
                        CLIENT: {type: ArgumentType.BOOLEAN, shape: BlockShape.HEXAGONAL},
                        CENTERED: {type: ArgumentType.BOOLEAN, shape: BlockShape.HEXAGONAL},
                    }
                },

                {
                    blockType: BlockType.LABEL,
                    text: 'Extras'
                },

                {
                    opcode: 'mousePos',
                    text: 'mouse pos (client: [CLIENT] and centered: [CENTERED])',
                    arguments: {
                        CLIENT: {
                            type: ArgumentType.BOOLEAN,
                            shape: BlockShape.HEXAGONAL,
                        },
                        CENTERED: {type: ArgumentType.BOOLEAN, shape: BlockShape.HEXAGONAL},
                    },
                    ...jwVector.Block
                },

                {
                    opcode: 'screenSize',
                    text: 'screen size',
                    ...jwVector.Block
                }
            ])

            return {
                id: "IAliRect",
                name: "Rect",
                color1: "#ff0061",
                color2: "#d80052",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+DQogIDxlbGxpcHNlIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAwLCA5Nyk7IHN0cm9rZTogcmdiKDIxNiwgMCwgODIpOyIgY3g9IjEwIiBjeT0iMTAiIHJ4PSI5LjUiIHJ5PSI5LjUiPjwvZWxsaXBzZT4NCiAgPHJlY3QgeD0iNi4wNTkiIHk9IjUuNzkzIiB3aWR0aD0iOS40NzciIGhlaWdodD0iOS40NzciIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2U6IHJnYigyNTUsIDI1NSwgMjU1KTsiPjwvcmVjdD4NCiAgPHJlY3QgeD0iNS40OTQiIHk9IjMuMjIyIiB3aWR0aD0iMTAuNjQzIiBoZWlnaHQ9IjEuMzcyIiByeD0iMSIgcnk9IjEiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7Ij48L3JlY3Q+DQogIDxyZWN0IHg9IjEuNjA1IiB5PSI3LjQ3MyIgd2lkdGg9IjEwLjY0MyIgaGVpZ2h0PSIxLjM3MiIgcng9IjEiIHJ5PSIxIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDE7IHRyYW5zZm9ybS1ib3g6IGZpbGwtYm94OyB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlOyIgdHJhbnNmb3JtPSJtYXRyaXgoMCwgMSwgLTEsIDAsIC0yLjcwMTY4NCwgMi41MTc0OCkiPjwvcmVjdD4NCjwvc3ZnPg==",

                blocks: blocks,
                menus: {
                    sprites: {
                        acceptReporters: true,
                        items: this.getSpriteMenu()
                    },
                    singlePoint: {
                        acceptReporters: true,
                        items: ['x', 'y', 'width', 'height', 'topleft x', 'topleft y']
                    },
                    vectorPoint: {
                        acceptReporters: true,
                        items: [
                            'topleft', 'midtop', 'topright',
                            'midleft', 'center', 'midright',
                            'bottomleft', 'midbottom', 'bottomright',
                            'size'
                        ],
                    }
                },

                roundingFunctions: {
                    acceptReporters: false,
                    items: [
                        {
                            text: 'round',
                            value: 'round'
                        },
                        {
                            text: 'ceil', // might as well go full in on the inconsistencies since we are already doing "round of"
                            value: 'ceil'
                        },
                        {
                            text: 'floor',
                            value: 'floor'
                        }
                    ]
                }
            }
        }

        getSpriteMenu(){
            const targets = vm.runtime.targets;
            const emptyMenu = [{ text: "", value: "" }];
            if (!targets) return emptyMenu;
            const menu = targets.filter(target => target.isOriginal && (!target.isStage)).map(target => ({ text: target.sprite.name, value: target.sprite.name }));
            return (menu.length > 0) ? menu : emptyMenu;
        }

        fromSprite({SPRITE}) {
            let spr = vm.runtime.getSpriteTargetByName(SPRITE)
            let x = spr.x
            let y = spr.y

            let costume = spr.sprite.costumes_[spr.currentCostume]
            let asset = costume.asset
            let assetType = asset.assetType.name
            let size = costume.size

            return new RectType(x, y, assetType == "ImageBitmap" ? size[0]/2 : size[0], assetType == "ImageBitmap" ? size[1]/2 : size[1])
        }


        newRect4({X, Y, W, H}) {
            return new RectType(X, Y, W, H);
        }

        newRect2({XY, WH}) {
            XY = Vector.toVector(XY)
            WH = Vector.toVector(WH)
            return RectType.toRect([XY, WH]);
        }

        newRect1({XYWH}) {
            return RectType.toRect(XYWH)
        }

        getSinglePoint({RECT, TYPE}) {
            let val = RectType.toRect(RECT).getPoint(TYPE)
            return isNaN(val) ? 0 : val
        }

        getVectorPoint({RECT, TYPE}) {
            let val = RectType.toRect(RECT).getPoint(TYPE);
            return isNaN(val) ? val : new Vector()
        }

        setSinglePoint({RECT, TYPE, VALUE}) {
            RECT = RectType.toRect(RECT)
            RECT.setSinglePoint(TYPE, VALUE);
            return RECT;
        }

        setVectorPoint({RECT, TYPE, VALUE}) {
            RECT = RectType.toRect(RECT)
            RECT.setVectorPoint(TYPE, VALUE);
            return RECT;
        }

        collidingXY({RECT, X, Y}) {
            RECT = RectType.toRect(RECT);
            X = Cast.toNumber(X);
            Y = Cast.toNumber(Y);

            return RECT.collidesXYPoint(X, Y);
        }

        collidingPoint({RECT, VECTOR}) {
            RECT = RectType.toRect(RECT);
            let XY = Vector.toVector(VECTOR);

            return RECT.collidesVectorPoint(XY)
        }

        collidingRect({RECTA, RECTB}) {
            RECTA = RectType.toRect(RECTA)
            RECTB = RectType.toRect(RECTB)

            return RECTA.collidesRect(RECTB)
        }

        collidingMouse({RECT, CLIENT, CENTERED}) {
            RECT = RectType.toRect(RECT);
            let vector = new Vector(CLIENT ? mouse.getClientX() : mouse.getScratchX(), CLIENT ? mouse.getClientY() : mouse.getScratchY());
            vector = CENTERED && CLIENT ? new Vector(vector.x - vm.runtime.stageWidth / 2, -vector.y + vm.runtime.stageHeight / 2) : vector;
            return RECT.collidesVectorPoint(vector);
        }


        mousePos({CLIENT, CENTERED}) {
            let vector = new Vector(CLIENT ? mouse.getClientX() : mouse.getScratchX(), CLIENT ? mouse.getClientY() : mouse.getScratchY());
            vector = CENTERED && CLIENT ? new Vector(vector.x - vm.runtime.stageWidth / 2, -vector.y + vm.runtime.stageHeight / 2) : vector;
            return vector;
        }

        screenSize() {
            return new Vector(vm.runtime.stageWidth, vm.runtime.stageHeight)
        }


    }

    Scratch.extensions.register(new Extension())
})(Scratch);
