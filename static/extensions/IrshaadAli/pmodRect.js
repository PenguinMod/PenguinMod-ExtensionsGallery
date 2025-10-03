// !! READ THIS !!
// This is only a "Translated" version, please check for any errors
const BlockType = require('../../extension-support/block-type')
const BlockShape = require('../../extension-support/block-shape')
const ArgumentType = require('../../extension-support/argument-type')
const TargetType = require('../../extension-support/target-type')
const Cast = require('../../util/cast')

function formatNumber(x) {
    if (x >= 1e6) {
        return x.toExponential(4)
    } else {
        x = Math.floor(x * 1000) / 1000
        return x.toFixed(Math.min(3, (String(x).split('.')[1] || '').length))
    }
}

/**
 @param {vm.jwVector.Type, Array} x
 @returns {[number, number]}
 */
function parseToArray(x) {
    if (x instanceof vm.jwVector.Type && x.length == 2) { return [x.x, x.y] }
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
        this.x = x
        this.y = y
        this.width = width
        this.height = height
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
        return new vm.jwVector.Type(this.singlePoints.left, this.singlePoints.top)
    }
    get midtop() {
        return new vm.jwVector.Type(this.x, this.singlePoints.top)
    }
    get topright() {
        return new vm.jwVector.Type(this.singlePoints.right, this.singlePoints.top)
    }
    get midleft() {
        return new vm.jwVector.Type(this.singlePoints.left, this.y)
    }
    get center() {
        return new vm.jwVector.Type(this.x, this.y)
    }
    get midright() {
        return new vm.jwVector.Type(this.singlePoints.right, this.y)
    }
    get bottomleft() {
        return new vm.jwVector.Type(this.singlePoints.left, this.singlePoints.bottom)
    }
    get midbottom() {
        return new vm.jwVector.Type(this.x, this.singlePoints.bottom)
    }
    get bottomright() {
        return new vm.jwVector.Type(this.singlePoints.right, this.singlePoints.bottom)
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
        return vm.jwVector.Type(this.width, this.height)
    }

    set size(value) {
        let values = parseToArray(value)
        this.width = isNaN(values[0]) ? 0 : values[0]
        this.height = isNaN(values[1]) ? 0 : values[1]
    }
}

const Rect = {
    Type: RectType,
    Block: {
        blockType: BlockType.REPORTER,
        blockShape: BlockShape.SQUARE,
        forceOutputType: 'Rect',
        disableMonitor: true,
        allowDropAnywhere: true,
    },
    Argument: {
        shape: BlockShape.SQUARE,
        check: ["Rect"]
    },
    NumArg: {
        type: ArgumentType.NUMBER,
        defaultValue: 0,
    }
}

class Extension {
    constructor() {
        vm.IAliRect = Rect
        vm.runtime.registerSerializer(
            "IAliRect",
            v => [v.x, v.y, v.width, v.height],
            v => new RectType(v.x, v.y, v.width, v.height)
        )

        if (!vm.jwVector) vm.extensionManager.loadExtensionIdSync('jwVector')
    }

    getInfo() {
        return {
            id: "IAliRect",
            name: "Rect",
            color1: "#ff0061",
            color2: "#d80052",
            menuIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMCAyMCI+DQogIDxlbGxpcHNlIHN0eWxlPSJmaWxsOiByZ2IoMjE2LCAwLCA4Mik7IiBjeD0iMTAiIGN5PSIxMCIgcng9IjEwIiByeT0iMTAiPjwvZWxsaXBzZT4NCiAgPGVsbGlwc2Ugc3R5bGU9ImZpbGw6IHJnYigyNTUsIDAsIDk3KTsiIGN4PSIxMCIgY3k9IjEwIiByeD0iOSIgcnk9IjkiPjwvZWxsaXBzZT4NCiAgPHJlY3QgeD0iNi45ODMiIHk9IjcuMDE1IiB3aWR0aD0iNy4yMTYiIGhlaWdodD0iNy4yMTYiIHN0eWxlPSJmaWxsOiBub25lOyBzdHJva2U6IHJnYigyNTUsIDI1NSwgMjU1KTsiPjwvcmVjdD4NCiAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMC4wODUwMzksIDAsIDAsIDAuMDg1MDM5LCAtMi4xNjQ3NzgsIDIuMjg5ODk0KSIgc3R5bGU9IiI+DQogICAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoLTIuNDk5OTUsIDAsIDAsIDEuOTQ4ODA0LCAxNTQuOTk4OTA0LCA0LjExNDMzKSIgc3R5bGU9IiI+DQogICAgICA8cGF0aCBkPSJNMS45OTk3NCAxMi45OTk5TDEuOTk5NiAxMUwxNS41ODU4IDExVjUuNTg1ODJMMjIgMTJMMTUuNTg1OCAxOC40MTQyVjEzTDEuOTk5NzQgMTIuOTk5OVoiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7Ij48L3BhdGg+DQogICAgPC9nPg0KICAgIDxnIHRyYW5zZm9ybT0ibWF0cml4KDIuNDk5OTUsIDAsIDAsIDEuOTQ4ODA0LCAxNDUuMDAxMTAxLCA0LjExNDMzMSkiIHN0eWxlPSIiPg0KICAgICAgPHBhdGggZD0iTTEuOTk5NzQgMTIuOTk5OUwxLjk5OTYgMTFMMTUuNTg1OCAxMVY1LjU4NTgyTDIyIDEyTDE1LjU4NTggMTguNDE0MlYxM0wxLjk5OTc0IDEyLjk5OTlaIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyI+PC9wYXRoPg0KICAgIDwvZz4NCiAgPC9nPg0KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgwLCAtMC4yMTI1OTIsIC0wLjE2NTcyMywgMCwgNi44Mzk1NzIsIDExLjEzMzc4OSkiIHN0eWxlPSIiPg0KICAgIDxwYXRoIGQ9Ik0xLjk5OTc0IDEyLjk5OTlMMS45OTk2IDExTDE1LjU4NTggMTFWNS41ODU4MkwyMiAxMkwxNS41ODU4IDE4LjQxNDJWMTNMMS45OTk3NCAxMi45OTk5WiIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsiPjwvcGF0aD4NCiAgPC9nPg0KICA8cGF0aCBkPSJNIDIuNzI1IDEzIEwgMi43MjUgMTIuNjY5IEwgNS42MTMgMTIuNjY5IEwgNS42MTMgMTEuNzcxIEwgNi45NzcgMTIuODM0IEwgNS42MTMgMTMuODk4IEwgNS42MTMgMTMgTCAyLjcyNSAxMyBaIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDIuMjI0OyB0cmFuc2Zvcm0tYm94OiBmaWxsLWJveDsgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTsiIHRyYW5zZm9ybT0ibWF0cml4KDAsIDEuMDAwMDA3LCAtMC45OTk5OTMsIDAsIDAuMDAwMDAyLCAwKSI+PC9wYXRoPg0KPC9zdmc+",
            blocks: [
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Sprite-Based Rects'
                },
                {
                    opcode: 'fromSprite',
                    text: 'from [SPRITE]',
                    arguments: {
                        SPRITE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: ""
                        }
                    },
                    ...Rect.Block
                },
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Rect Initialization'
                },
                {
                    opcode: 'newRectX_Y_W_H',
                    text: 'Rect X: [X] Y: [Y] W: [W] H: [H]',
                    arguments: {
                        X: Rect.NumArg,
                        Y: Rect.NumArg,
                        W: Rect.NumArg,
                        H: Rect.NumArg,
                    },
                    ...Rect.Block
                },
                {
                    opcode: 'newRectXY_WH',
                    text: "Rect XY: [XY] WH: [WH]",
                    arguments: {
                        XY: vm.vm.jwVector.Argument,
                        WH: vm.vm.jwVector.Argument,
                    },
                    ...Rect.Block
                },
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Getters'
                },
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: "Single Positional Value",
                },
                {
                    opcode: 'getRectX',
                    text: 'Get [RECT] X',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    }
                },
                {
                    opcode: 'getRectY',
                    text: 'Get [RECT] Y',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    }
                },
                {
                    opcode: 'getRectW',
                    text: 'Get [RECT] Width',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    }
                },
                {
                    opcode: 'getRectH',
                    text: 'Get [RECT] Height',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    }
                },

                {
                    opcode: 'getRectTopLeftX',
                    text: 'Get [RECT] TopLeft X',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    }
                },

                {
                    opcode: 'getRectTopLeftY',
                    text: 'Get [RECT] TopLeft Y',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    }
                },

                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Vector Positional Value',
                },

                {
                    opcode: 'getRectTopLeft',
                    text: 'Get [RECT] TopLeft',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    opcode: 'getRectMidTop',
                    text: 'Get [RECT] MidTop',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    opcode: 'getRectTopRight',
                    text: 'Get [RECT] TopRight',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    opcode: 'getRectMidLeft',
                    text: 'Get [RECT] MidLeft',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    opcode: 'getRectCenter',
                    text: 'Get [RECT] Center',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    opcode: 'getRectMidRight',
                    text: 'Get [RECT] MidRight',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    opcode: 'getRectBottomLeft',
                    text: 'Get [RECT] BottomLeft',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    opcode: 'getRectMidBottom',
                    text: 'Get [RECT] MidBottom',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    opcode: 'getRectBottomRight',
                    text: 'Get [RECT] BottomRight',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument
                    },
                    ...vm.jwVector.Block
                },

                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Setters',
                },
                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Single Positional Value',
                },

                {
                    opcode: 'setRectX',
                    text: 'Set [RECT] X [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: Rect.NumArg,
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectY',
                    text: 'Set [RECT] Y [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: Rect.NumArg
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectW',
                    text: 'Set [RECT] W [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: Rect.NumArg
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectH',
                    text: 'Set [RECT] H [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: Rect.NumArg
                    },
                    ...Rect.Block
                },

                {
                    blockType: Scratch.BlockType.LABEL,
                    text: 'Vector Positional Value',
                },

                {
                    opcode: 'setRectTopLeft',
                    text: 'Set [RECT] TopLeft [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectMidTop',
                    text: 'Set [RECT] MidTop [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectTopRight',
                    text: 'Set [RECT] TopRight [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectMidLeft',
                    text: 'Set [RECT] MidLeft [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectCenter',
                    text: 'Set [RECT] Center [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectMidRight',
                    text: 'Set [RECT] MidRight [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectBottomLeft',
                    text: 'Set [RECT] BottomLeft [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectMidBottom',
                    text: 'Set [RECT] MidBottom [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                },

                {
                    opcode: 'setRectBottomRight',
                    text: 'Set [RECT] BottomRight [VALUE]',
                    blockType: Scratch.BlockType.REPORTER,
                    arguments: {
                        RECT: Rect.Argument,
                        VALUE: vm.jwVector.Argument
                    },
                    ...Rect.Block
                }
            ],
            menus: {
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

    newRectXY_WH(args) {
        const XY = args.XY
        const WH = args.WH

        return new RectType(XY.x, XY.y, WH.x, WH.y)
    }

    getRectX(args) {
        return RectType.toRect(args.RECT).x
    }

    getRectY(args) {
        return RectType.toRect(args.RECT).y
    }

    getRectW(args) {
        return RectType.toRect(args.RECT).width
    }
    getRectH(args) {
        return RectType.toRect(args.RECT).height
    }

    getRectTopLeftX(args) {
        return RectType.toRect(args.RECT).singlePoints.left
    }

    getRectTopLeftY(args) {
        return RectType.toRect(args.RECT).singlePoints.top
    }

    getRectTopLeft(args) {
        return RectType.toRect(args.RECT).topleft
    }

    getRectMidTop(args) {
        return RectType.toRect(args.RECT).midtop
    }
    getRectTopRight(args) {
        return RectType.toRect(args.RECT).topright
    }

    getRectMidLeft(args) {
        return RectType.toRect(args.RECT).midleft
    }
    getRectCenter(args) {
        return RectType.toRect(args.RECT).center
    }
    getRectMidRight(args) {
        return RectType.toRect(args.RECT).midright
    }

    getRectBottomLeft(args) {
        return RectType.toRect(args.RECT).bottomleft
    }
    getRectMidBottom(args) {
        return RectType.toRect(args.RECT).midbottom
    }
    getRectBottomRight(args) {
        return RectType.toRect(args.RECT).bottomright
    }

    setRectX(args) {
        let rect = RectType.toRect(args.RECT)
        rect.x = args.VALUE
        return rect
    }

    setRectY(args) {
        let rect = RectType.toRect(args.RECT)
        rect.y = args.VALUE
        return rect
    }

    setRectW(args) {
        let rect = RectType.toRect(args.RECT)
        rect.width = args.VALUE
        return rect
    }

    setRectH(args) {
        let rect = RectType.toRect(args.RECT)
        rect.height = args.VALUE
        return rect
    }

    setRectTopLeft(args) {
        let rect = RectType.toRect(args.RECT)
        rect.topleft = args.VALUE
        return rect
    }
    setRectMidTop(args) {
        let rect = RectType.toRect(args.RECT)
        rect.midtop = args.VALUE
        return rect
    }
    setRectTopRight(args) {
        let rect = RectType.toRect(args.RECT)
        rect.topright = args.VALUE
        return rect
    }

    setRectMidLeft(args) {
        let rect = RectType.toRect(args.RECT)
        rect.midleft = args.VALUE
        return rect
    }

    setRectCenter(args) {
        let rect = RectType.toRect(args.RECT)
        rect.center = args.VALUE
        return rect
    }

    setRectMidRight(args) {
        let rect = RectType.toRect(args.RECT)
        rect.midright = args.VALUE
        return rect
    }

    setRectBottomLeft(args) {
        let rect = RectType.toRect(args.RECT)
        rect.bottomleft = args.VALUE
        return rect
    }

    setRectMidBottom(args) {
        let rect = RectType.toRect(args.RECT)
        rect.midbottom = args.VALUE
        return rect
    }

    setRectBottomRight(args) {
        let rect = RectType.toRect(args.RECT)
        rect.bottomright = args.VALUE
        return rect
    }

    fromSprite({SPRITE}) {
        let spr = vm.runtime.getSpriteTargetByName(SPRITE)
        console.log(spr)
        let x = spr.x
        let y = spr.y

        let costume = spr.sprite.costumes_[spr.currentCostume]
        let asset = costume.asset
        let assetType = asset.assetType.name
        let size = costume.size

        return new RectType(x, y, assetType == "ImageBitmap" ? size[0]/2 : size[0], assetType == "ImageBitmap" ? size[1]/2 : size[1])
    }
}

module.exports = Extension