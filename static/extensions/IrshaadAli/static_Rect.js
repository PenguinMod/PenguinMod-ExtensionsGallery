(function (Scratch) {
    const Cast = Scratch.Cast
    const vm = Scratch.vm

    if (vm.IAliRect) vm.extensionManager.removeExtension('IAliRect')

    if (!vm.jwVector) vm.extensionManager.loadExtensionIdSync('jwVector')

    const jwVector = vm.jwVector
    const jwVectorType = jwVector.Type

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

    /**
     @param {jwVectorType, Array} x
     @returns {[number, number]}
     */
    function parseToArray(x) {
        if (x instanceof jwVectorType && x.length == 2) { return [x.x, x.y] }
        if (x instanceof Array) { return x }

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

        static toRect(x) {
            if (x instanceof RectType) return x
            if (x instanceof Array && x.length == 4) return new RectType(x[0], x[1], x[2], x[3])
            if (x instanceof Array && x.length == 2) return new RectType(x[0][0], x[0][1], x[1][0], x[1][1])
            if (String(x).split(',')) {
                let array = String(x).split(',')
                return new RectType(
                    Cast.toNumber(array[0]),
                    Cast.toNumber(array[1]),
                    Cast.toNumber(array[2]),
                    Cast.toNumber(array[3])
                )
            }
            return new RectType(0, 0, 0,0)
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

        get singlePoints() {
            return {
                'top': this.y + this.offsets.top,
                'left': this.x + this.offsets.left,
                'right': this.x + this.offsets.right,
                'bottom': this.y + this.offsets.bottom,
            }
        }

        get topleft() {
            return new jwVectorType(this.singlePoints.left, this.singlePoints.top)
        }
        get midtop() {
            return new jwVectorType(this.x, this.singlePoints.top)
        }
        get topright() {
            return new jwVectorType(this.singlePoints.right, this.singlePoints.top)
        }
        get midleft() {
            return new jwVectorType(this.singlePoints.left, this.y)
        }
        get center() {
            return new jwVectorType(this.x, this.y)
        }
        get midright() {
            return new jwVectorType(this.singlePoints.right, this.y)
        }
        get bottomleft() {
            return new jwVectorType(this.singlePoints.left, this.singlePoints.bottom)
        }
        get midbottom() {
            return new jwVectorType(this.x, this.singlePoints.bottom)
        }
        get bottomright() {
            return new jwVectorType(this.singlePoints.right, this.singlePoints.bottom)
        }

        set topleft(value) {
            let values = parseToArray(value)
            this.x = values[0] - this.singlePoints.left
            this.y = values[1] - this.singlePoints.top
        }

        set midtop(value) {
            let values = parseToArray(value)
            this.x = values[0]
            this.y = values[1] - this.singlePoints.top
        }

        set topright(value) {
            let values = parseToArray(value)
            this.x = values[0] - this.singlePoints.right
            this.y = values[1] - this.singlePoints.top
        }

        set midleft(value) {
            let values = parseToArray(value)
            this.x = values[0] - this.singlePoints.left
            this.y = values[1]
        }

        set center(value) {
            let values = parseToArray(value)
            this.x = values[0]
            this.y = values[1]
        }

        set midright(value) {
            let values = parseToArray(value)
            this.x = values[0] - this.singlePoints.right
            this.y = values[1]
        }

        set bottomleft(value) {
            let values = parseToArray(value)
            this.x = values[0] - this.singlePoints.left
            this.y = values[1] - this.singlePoints.bottom
        }
        set midbottom(value) {
            let values = parseToArray(value)
            this.x = values[0]
            this.y = values[1] - this.singlePoints.bottom
        }
        set bottomright(value) {
            let values = parseToArray(value)
            this.x = values[0] - this.singlePoints.right
            this.y = values[1] - this.singlePoints.bottom
        }

        get size() {
            return jwVectorType(this.width, this.height)
        }

        set size(value) {
            let values = parseToArray(value)
            this.width = isNaN(values[0]) ? 0 : values[0]
            this.height = isNaN(values[1]) ? 0 : values[1]
        }


    }

    // Makes it so Vectors & Jsons can grab XYWH
    const Rect = {
        Type: RectType,
        Block: {
            blockType: Scratch.BlockType.REPORTER,
            blockShape: Scratch.BlockShape.SQUARE,
            //forceOutputType: "Rect",
            disableMonitor: true,
            allowDropAnywhere: true,
        },
        Argument: {
            shape: Scratch.BlockShape.SQUARE,
            //check: ["Rect"]
        }
    }

    const RectArgType1 = {
        type: Scratch.ArgumentType.NUMBER,
        defaultValue: 0
    }

    const SingleValue = {
        menu: 'singleRectValue',
        defaultValue: 'x'
    }

    const VectorValue = {
        menu: 'vectorRectValue',
        defaultValue: 'topleft'
    }




    class Extension {
        constructor() {
            vm.IAliRect = Rect
            vm.runtime.registerSerializer(
                "IAliRect",
                v => [v.x, v.y, v.width, v.height],
                v => new RectType(v.x, v.y, v.width, v.height)
            )
        }

        getInfo() {
            return {
                id: "IAliRect",
                name: "Rect",
                color1: "#ff0061",
                color2: "#d80052",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+DQogIDxlbGxpcHNlIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAwLCA5Nyk7IHN0cm9rZTogcmdiKDIxNiwgMCwgODIpOyIgY3g9IjEwIiBjeT0iMTAiIHJ4PSI5LjUiIHJ5PSI5LjUiPjwvZWxsaXBzZT4NCiAgPHJlY3QgeD0iNi4wNTkiIHk9IjUuNzkzIiB3aWR0aD0iOS40NzciIGhlaWdodD0iOS40NzciIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2U6IHJnYigyNTUsIDI1NSwgMjU1KTsiPjwvcmVjdD4NCiAgPHJlY3QgeD0iNS40OTQiIHk9IjMuMjIyIiB3aWR0aD0iMTAuNjQzIiBoZWlnaHQ9IjEuMzcyIiByeD0iMSIgcnk9IjEiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7Ij48L3JlY3Q+DQogIDxyZWN0IHg9IjEuNjA1IiB5PSI3LjQ3MyIgd2lkdGg9IjEwLjY0MyIgaGVpZ2h0PSIxLjM3MiIgcng9IjEiIHJ5PSIxIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDE7IHRyYW5zZm9ybS1ib3g6IGZpbGwtYm94OyB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlOyIgdHJhbnNmb3JtPSJtYXRyaXgoMCwgMSwgLTEsIDAsIC0yLjcwMTY4NCwgMi41MTc0OCkiPjwvcmVjdD4NCjwvc3ZnPg==",
                blocks: [
                    {
                        opcode: 'fromSprite',
                        text: 'from [SPRITE]',
                        arguments: {
                            SPRITE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "sprites",
                            }
                        },
                        ...Rect.Block
                    },
                    '---',
                    {
                        opcode: 'newRectX_Y_W_H',
                        text: 'rect x: [X] y: [Y] w: [W] h: [H]',
                        arguments: {
                            X: RectArgType1,
                            Y: RectArgType1,
                            W: RectArgType1,
                            H: RectArgType1,
                        },
                        ...Rect.Block
                    },
                    {
                        opcode: 'newRectXY_WH',
                        text: "rect xy: [XY] wh: [WH]",
                        arguments: {
                            XY: vm.jwVector.Argument,
                            WH: vm.jwVector.Argument,
                        },
                        ...Rect.Block
                    },
                    '---',
                    {
                        opcode: 'getSingleRectPoint',
                        text: 'get [RECT] [TYPE]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            RECT: Rect.Argument,
                            TYPE: SingleValue
                        },
                    },

                    {
                        opcode: 'setSingleRectPoint',
                        text: 'set [RECT] [TYPE] to [VALUE]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            RECT: Rect.Argument,
                            TYPE: SingleValue,
                            VALUE: RectArgType1,
                        },
                        ...Rect.Block
                    },

                    '---',

                    {
                        opcode: 'getVectorRectPoint',
                        text: 'get [RECT] [TYPE]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            RECT: Rect.Argument,
                            TYPE: VectorValue,
                        },
                        ...jwVector.Block
                    },

                    {
                        opcode: 'setVectorRectPoint',
                        text: 'set [RECT] [TYPE] to [VALUE]',
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            RECT: Rect.Argument,
                            TYPE: VectorValue,
                            VALUE: jwVector.Argument,
                        },
                        ...Rect.Block
                    },
                ],
                menus: {
                    sprites: {
                        acceptReporters: true,
                        items: this.getSpriteMenu()
                    },
                    singleRectValue: {
                        acceptReporters: true,
                        items: ['x', 'y', 'width', 'height', 'topleft x', 'topleft y']
                    },
                    vectorRectValue: {
                        acceptReporters: true,
                        items: [
                            'topleft', 'midtop', 'topright',
                            'midleft', 'center', 'midright',
                            'bottomleft', 'midbottom', 'bottomright',
                            'size'
                        ],
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
        }

        getSpriteMenu (){
            const targets = vm.runtime.targets;
            const emptyMenu = [{ text: "", value: "" }];
            if (!targets) return emptyMenu;
            const menu = targets.filter(target => target.isOriginal && (!target.isStage)).map(target => ({ text: target.sprite.name, value: target.sprite.name }));
            return (menu.length > 0) ? menu : emptyMenu;
        }

        /**
         *
         * @param args
         * @returns {RectType}
         */
        newRectX_Y_W_H({AX, AY, AW, AH}) {
            const X = Cast.toNumber(AX)
            const Y = Cast.toNumber(AY)
            const W = Cast.toNumber(AW)
            const H = Cast.toNumber(AH)

            return new RectType(X, Y, W, H)
        }

        /**
         *
         * @param args
         * @returns {RectType}
         */
        newRectXY_WH({XY, WH}) {
            let xy = jwVectorType.toVector(XY)
            let wh = jwVectorType.toVector(WH)
            return new RectType(xy.x, xy.y, wh.x, wh.y)
        }

        getSingleRectPoint({RECT, TYPE}) {
            let rect = RectType.toRect(RECT);
            switch(TYPE) {
                case 'x':
                    return rect.x;
                case 'y':
                    return rect.y;
                case 'width':
                    return rect.width;
                case 'height':
                    return rect.height;
                case 'topleft x':
                    return rect.topleft.x;
                case 'topleft y':
                    return rect.topleft.y
            }
            return 0;
        }

        setSingleRectPoint({RECT, TYPE, VALUE}) {
            let rect = RectType.toRect(RECT);
            let value = Cast.toNumber(VALUE);

            switch (TYPE) {
                case 'x':
                    rect.x = value;
                    break;
                case 'y':
                    rect.y = value;
                    break;
                case 'width':
                    rect.width = value;
                    break;
                case 'height':
                    rect.height = value;
                    break;
                case 'topleft x':
                    rect.topleft = new jwVectorType(value, rect.topleft.y)
                    break;
                case 'topleft y':
                    rect.topleft = new jwVectorType(rect.topleft.x, value)
                    break;
            }
            return rect;
        }

        getVectorRectPoint({RECT, TYPE}) {
            let rect = RectType.toRect(RECT);
            switch (TYPE) {
                case 'topleft':
                    return rect.topleft;
                case 'midtop':
                    return rect.midtop;
                case 'topright':
                    return rect.topright;

                case 'midleft':
                    return rect.midleft;
                case 'center':
                    return rect.center;
                case 'midright':
                    return rect.midright;

                case 'bottomleft':
                    return rect.bottomleft;
                case 'midbottom':
                    return rect.midbottom;
                case 'bottomright':
                    return rect.bottomright;

                case 'size':
                    return rect.size;
            }
            return new jwVectorType(0, 0);
        }

        setVectorRectPoint({RECT, TYPE, VALUE}) {
            let rect = RectType.toRect(RECT);
            let value = jwVectorType.toVector(VALUE);
            switch (TYPE) {
                case 'topleft':
                    rect.topleft = value;
                    break;
                case 'midtop':
                    rect.midtop = value;
                    break;
                case 'topright':
                    rect.topright = value;
                    break;
                case 'midleft':
                    rect.midleft = value;
                    break;
                case 'center':
                    rect.center = value;
                    break;
                case 'midright':
                    rect.midright = value;
                    break;
                case 'bottomleft':
                    rect.bottomleft = value;
                    break;
                case 'midbottom':
                    rect.midbottom = value;
                    break;
                case 'bottomright':
                    rect.bottomright = value;
                    break;
                case 'size':
                    rect.size = value;
                    break;
            }
            return rect;
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
    }

    Scratch.extensions.register(new Extension())
})(Scratch);
