(function (Scratch) {
    'use strict';

    const dom = new DOMParser()
    const toAString = new XMLSerializer()

    class HTMLDocuments {
        constructor(runtime) {
            this.pages = new Map()
            this.changePx = [
                "block-size",
                "border-block-end-width",
                "border-block-start-width",
                "border-block-width",
                "border-bottom-left-radius",
                "border-bottom-right-radius",
                "border-bottom-width",
                "border-image-outset",
                "border-image-width",
                "border-inline-end-width",
                "border-inline-start-width",
                "border-inline-width",
                "border-left-width",
                "border-right-width",
                "border-spacing",
                "border-top-left-radius",
                "border-top-right-radius",
                "border-top-width",
                "border-width",
                "bottom",
                "column-gap",
                "column-rule-width",
                "column-width",
                "contain-intrinsic-block-size",
                "contain-intrinsic-height",
                "contain-intrinsic-inline-size",
                "contain-intrinsic-size",
                "contain-intrinsic-width",
                "cx",
                "cy",
                "font-size",
                "gap",
                "grid-auto-columns",
                "grid-auto-rows",
                "grid-template-columns",
                "grid-template-rows",
                "height",
                "inline-size",
                "left",
                "letter-spacing",
                "margin-block-end",
                "margin-block-start",
                "margin-block",
                "margin-bottom",
                "margin-inline-end",
                "margin-inline-start",
                "margin-inline",
                "margin-left",
                "margin-right",
                "margin-top",
                "max-block-size",
                "max-height",
                "max-inline-size",
                "max-width",
                "min-block-size",
                "min-height",
                "min-inline-size",
                "min-width",
                "object-position",
                "offset-distance",
                "offset-path",
                "outline-offset",
                "outline-width",
                "padding-block-end",
                "padding-block-start",
                "padding-block",
                "padding-bottom",
                "padding-inline-end",
                "padding-inline-start",
                "padding-inline",
                "padding-left",
                "padding-right",
                "padding-top",
                "perspective",
                "perspective-origin",
                "r",
                "right",
                "row-gap",
                "rx",
                "ry",
                "scroll-margin-bottom",
                "scroll-margin-left",
                "scroll-margin-right",
                "scroll-margin-top",
                "scroll-padding-bottom",
                "scroll-padding-left",
                "scroll-padding-right",
                "scroll-padding-top",
                "shape-margin",
                "tab-size",
                "text-decoration-thickness",
                "text-indent",
                "top",
                "transform-origin",
                "translate",
                "width",
                "word-spacing",
                "x",
                "y"
            ]
            this.viewing = []
            this.runtime = runtime
        }
        getInfo() {
            return {
                id: 'scrtwpmhtmldocuments',
                name: 'HTML documents',
                color1: '#ff9900',
                blocks: [

                    {
                        opcode: 'createPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create new page named [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'deletePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete page named [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'clearPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear content of [PAGE]',
                        // notchAccepts: "htmldocuments-coolshape",
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'allPages',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all pages',
                        disableMonitor: true,
                    },
                    {
                        opcode: 'getHTML',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get html code of [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    // {
                    //     opcode: 'get',
                    //     blockType: Scratch.BlockType.REPORTER,
                    //     text: 'get',
                    // },
                    { blockType: Scratch.BlockType.LABEL, text: "Render HTML" },
                    {
                        opcode: 'displayPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'display page [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'hidePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'hide page [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'hidePageAll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'hide all pages',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'current',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current pages displayed',
                        disableMonitor: true
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Element Management" },
                    {
                        opcode: 'nestEl',
                        blockType: Scratch.BlockType.CONDITIONAL,
                        text: 'add [EL] id [ID] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nest",
                                defaultValue: "div"
                            }
                        }
                    },
                    {
                        opcode: 'noNestEl',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add [EL] id [ID] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nonest",
                                defaultValue: "input"
                            },
                        }
                    },
                    {
                        opcode: 'text',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add text [TEXT] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello World!"
                            },
                        }
                    },
                    {
                        opcode: 'removeEl',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove element with id [ID] from [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                        }
                    },
                    {
                        opcode: 'setAttr',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [ATTR] of [ID] to [VAL] in [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            VAL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-class"
                            },
                            ATTR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "class",
                                menu: "attr"
                            },
                        }

                    },


                    {
                        opcode: 'changeHTML',
                        blockType: Scratch.BlockType.CONDITIONAL,
                        text: 'change [ID] in [PAGE] to',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nonest",
                                defaultValue: "input"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "CSS Styles" },

                    // {
                    //     opcode: 'styleEl',
                    //     blockType: Scratch.BlockType.CONDITIONAL,
                    //     text: 'add style to [PAGE]',
                    //     branchCount: 1,
                    //     // notchAccepts: "htmldocuments-coolshape",
                    //     branches: [
                    //         { accepts: "htmldocuments-coolshape2" },
                    //     ],
                    //     arguments: {
                    //       PAGE: {
                    //         type: Scratch.ArgumentType.STRING,
                    //         defaultValue: "my-page"
                    //       },
                    //     }
                    // },
                    {
                        opcode: 'property',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [PROPERTY] for [TYPE] [NAME] to [VALUE] in [PAGE]',
                        // notchAccepts: "htmldocuments-coolshape2",
                        arguments: {
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "properties",
                                defaultValue: "color"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "types"
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "green",
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page",
                            },
                        }
                    },

                    {
                        opcode: 'remallstyle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear styling of [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "Event Listeners" },


                    {
                        opcode: 'eve',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when listener for [ID] activated in [PAGE]',
                        isEdgeActivated: false,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el",
                                // defaultValue: '{"Hello":"Item 1", "Bye":"Item 2"}'
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'addeve',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add event listener [EVE] for [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'remeve',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove event listeners from [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "Webpage Data" },

                    {
                        opcode: 'allEls',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all elements in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'dataEl',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[OPTS] of [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            OPTS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "opts"
                            },
                        }
                    },


                    { blockType: Scratch.BlockType.LABEL, text: "Webpage Positioning" },

                    {
                        opcode: 'movePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'move [PAGE] to x: [X] y: [Y]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "50"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "50"
                            },
                        }
                    },
                    {
                        opcode: 'resizePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'resize [PAGE] to x: [X] y: [Y]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "300"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "200"
                            },
                        }
                    },
                    {
                        opcode: 'resetDefault',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [PAGE] display settings to stage size',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "300"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "200"
                            },
                        }
                    },
                    {
                        opcode: 'ppos',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[AXIS] of [PAGE]',
                        disableMonitor: true,
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            AXIS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "axis"
                            },
                        }
                    },
                    {
                        opcode: 'spw',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[WH] of the stage',
                        disableMonitor: true,
                        arguments: {
                            WH: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "wh"
                            },
                        }
                    },

                ],
                menus: {
                    nonest: {
                        acceptReporters: true,
                        items:
                            [
                                "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "script", "source", "textarea", "track", "wbr"
                            ]
                    },
                    nest: {
                        acceptReporters: true,
                        items:
                            [
                                "a", "abbr", "address", "article", "aside", "audio", "b", "bdi", "bdo", "blockquote", "button", "canvas", "caption", "cite", "code", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "i", "iframe", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "menu", "meter", "nav", "object", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "slot", "small", "span", "strong", "sub", "summary", "sup", "table", "tbody", "td", "template", "tfoot", "th", "thead", "time", "tr", "u", "ul", "var", "video"
                            ]
                    },
                    types: {
                        acceptReporters: false,
                        items: [
                            { text: "id", value: "#" },
                            { text: "class", value: "." },
                            { text: "tag", value: "" },
                            // {text: "animation", value: "@keyframes "},
                        ]
                    },
                    opts: {
                        acceptReporters: false,
                        items: [
                            { text: "inner HTML", value: "innerHTML" },
                            { text: "text content", value: "textContent" },
                            { text: "children", value: "children" },
                            { text: "parent element", value: "parentElement" },
                            { text: "tag name", value: "tagName" },
                            // { text: "style", value: "style" },
                            { text: "value", value: "value" },
                            { text: "checked", value: "checked" },
                            { text: "class list", value: "classList" },
                            { text: "offset width", value: "offsetWidth" },
                            { text: "offset height", value: "offsetHeight" },
                            { text: "scroll width", value: "scrollWidth" },
                            { text: "scroll height", value: "scrollHeight" },
                            { text: "disabled", value: "disabled" },
                            // { text: "all data of", value: "all" },
                        ]
                    },
                    properties: {
                        acceptReporters: true,
                        items: [

                            'align-content', 'align-items', 'align-self', 'all', 'animation', 'animation-delay', 'animation-direction', 'animation-duration', 'animation-fill-mode', 'animation-iter-count', 'animation-name', 'animation-play-state', 'animation-timing-fn', 'backface-visibility', 'background', 'background-attachment', 'background-blend-mode', 'background-clip', 'background-color', 'background-image', 'background-origin', 'background-position', 'background-repeat', 'background-size', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-left-rad', 'border-bottom-right-ra', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-image', 'border-image-outset', 'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-radius', 'border-right', 'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width', 'border-width', 'bottom', 'box-decoration-break', 'box-shadow', 'box-sizing', 'caption-side', 'caret-color',
                            'clear', 'clip', 'clip-path', 'color', 'column-count', 'column-fill', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-style', 'column-rule-width', 'column-span', 'column-width', 'columns', 'content', 'counter-increment', 'counter-reset', 'cursor', 'direction', 'display', 'empty-cells', 'filter', 'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'float', 'font',
                            'font-family', 'font-kerning', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'gap', 'grid', 'grid-area', 'grid-auto-columns', 'grid-auto-flow', 'grid-auto-rows', 'grid-column', 'grid-column-end', 'grid-column-gap', 'grid-column-start', 'grid-gap', 'grid-row', 'grid-row-end', 'grid-row-gap', 'grid-row-start', 'grid-template', 'grid-template-areas', 'grid-template-columns', 'grid-template-rows', 'height', 'hyphens',
                            'justify-content',
                            'left', 'letter-spacing', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-height', 'max-width',
                            'min-height', 'min-width', 'object-fit', 'object-position', 'opacity', 'order', 'outline', 'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page-break-after', 'page-break-before', 'page-break-inside', 'perspective', 'perspective-origin', 'pointer-events', 'position', 'quotes', 'right', 'row-gap', 'scroll-behavior', 'table-layout', 'text-align', 'text-align-last', 'text-decoration', 'text-decoration-color', 'text-decoration-line', 'text-decoration-style', 'text-indent', 'text-justify', 'text-overflow', 'text-shadow', 'text-transform', 'top', 'transform', 'transform-origin', 'transform-style', 'transition', 'transition-delay', 'transition-duration', 'transition-property', 'transition-timing-fn', 'user-select', 'vertical-align', 'visibility', 'white-space', 'width', 'word-break', 'word-spacing', 'word-wrap', 'writing-mode', 'z-index'

                        ]
                    },
                    axis: {
                        acceptReporters: false,
                        items: [
                            { text: "x position", value: "x" }, { text: "y position", value: "y" }, "width", "height"
                        ]
                    },
                    wh: {
                        acceptReporters: false,
                        items: [
                            "width", "height"
                        ]
                    },
                    eves: {
                        acceptReporters: true,
                        items: [
                            // Mouse & Pointer
                            "click", "dblclick", "mousedown", "mouseup", "mouseenter",
                            "mouseleave", "mousemove", "mouseover", "mouseout", "contextmenu", "wheel",

                            // Keyboard
                            "keydown", "keyup", "keypress",

                            // Form & Input
                            "submit", "input", "change", "focus", "blur", "reset", "invalid",

                            // Window & Document
                            "load", "DOMContentLoaded", "beforeunload", "unload", "resize",
                            "scroll", "error", "visibilitychange",

                            // Drag & Drop
                            "dragstart", "drag", "dragenter", "dragover", "dragleave", "drop", "dragend",

                            // Mobile & Media
                            "touchstart", "touchmove", "touchend", "play"
                        ]
                    },
                    attr: {
                        acceptReporters: false,
                        items: [
                            "accesskey", "autocapitalize", "autofocus", "class", "contenteditable",
                            "dir", "draggable", "enterkeyhint", "hidden", "inert", "inputmode",
                            "lang", "nonce", "part", "popover", "role", "slot", "style", "tabindex",
                            "title", "translate", "virtualkeyboardpolicy",
                            "accept", "accept-charset", "action", "align", "allow", "alt", "as",
                            "async", "autocomplete", "autoplay", "background", "bgcolor", "border",
                            "capture", "charset", "checked", "cite", "color", "cols", "colspan",
                            "content", "controls", "coords", "crossorigin", "csp", "data", "datetime",
                            "decoding", "default", "defer", "disabled", "download", "enctype", "for",
                            "form", "formaction", "formenctype", "formmethod", "formnovalidate",
                            "formtarget", "headers", "height", "high", "href", "hreflang", "http-equiv",
                            "imagesizes", "imagesrcset", "integrity", "ismap", "kind", "label", "list",
                            "loading", "loop", "low", "max", "maxlength", "min", "minlength", "media",
                            "method", "multiple", "muted", "name", "novalidate", "open", "optimum",
                            "pattern", "ping", "placeholder", "playsinline", "poster", "preload",
                            "readonly", "referrerpolicy", "rel", "required", "reversed", "rows",
                            "rowspan", "sandbox", "scope", "selected", "shape", "size", "sizes",
                            "span", "src", "srcdoc", "srclang", "srcset", "start", "step", "target",
                            "type", "usemap", "value", "width", "wrap"
                        ]

                    }

                }
            };
        }

        createPage(args, util) {
            if (!Object.keys(this.pages).includes(args.PAGE)) {
                if (args.PAGE !== "") {
                    this.pages.set(args.PAGE, new Map().set("data", new Map().set("x", 5).set("y", 5).set("width", 470).set("height", 350)).set("code", dom.parseFromString("", 'text/html')).set("eves", new Map()))
                    console.log(this.pages)
                } else {
                    throw new Error("Name cannot be empty")
                }
            }
        }
        clearPage(args, util) {

            // //if (Object.keys(this.pages).includes(args.PAGE)) {
            // let pages = this.pages

            this.pages.get(args.PAGE)?.set("code", dom.parseFromString("", 'text/html'))
            this.pages.get(args.PAGE)?.set("eves", new Map())
            // }
        }
        deletePage(args, util) {

            //if (Object.keys(this.pages).includes(args.PAGE)) {
            this.pages.delete(args.PAGE)
            if (this.viewing.includes(args.PAGE)) {
                const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                elements.forEach(el => el.remove());
            }

            // }
        }
        allPages() {
            return (JSON.stringify(Array.from(this.pages.keys())))
        }
        get() {
            if (Object.keys(this.pages).includes("my-page")) {
                return (JSON.stringify(this.pages["my-page"].code))
            }
        }


        displayPage(args, util) {
            return new Promise((resolve, reject) => {
                try {
                    const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                    elements.forEach(el => el.remove());
                    const el = document.createElement("iframe");
                    el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    el.setAttribute("class", `htmlpage display${args.PAGE}`)
                    el.style.position = 'absolute';
                    el.style.pointerEvents = 'auto';
                    el.style.zIndex = '10';
                    el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                    el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                    el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                    el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                    el.style.border = "1px solid black"
                    const container = Scratch.renderer.canvas.parentElement;
                    container.appendChild(el);
                    if (!this.viewing.includes(args.PAGE)) {
                        this.viewing.push(args.PAGE)
                    }
                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // console.log(key, value)
                            console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        hidePageAll(args, util) {
            const elements = document.querySelectorAll('.htmlpage');
            elements.forEach(el => el.remove());
            this.viewing = []
        }

        hidePage(args, util) {
            const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
            elements.forEach(el => el.remove());
            this.viewing.splice(this.viewing.indexOf(args.PAGE), 1)
        }

        noNestEl(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (args.ID !== "") {
                    if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        // console.log(this.pages)
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack();
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        const target = util.thread.target;



                        let parentBlockId = ""
                        let parentBlock = ""


                        let childId = currentBlockId;
                        let blockId = target.blocks.getBlock(currentBlockId)?.parent;

                        let nest = ""
                        const loopOpcodes = [
                            'scrtwpmhtmldocuments_nestEl',
                            'scrtwpmhtmldocuments_changeHTML',
                        ];
                        // let blockId = currentBlockId;






                        while (blockId) {
                            const parentBlock = target.blocks.getBlock(blockId);
                            // if (!parentBlock) break;
                            console.log(parentBlock)

                            if (loopOpcodes.includes(parentBlock.opcode)) {


                                const substackId = parentBlock.inputs?.SUBSTACK?.block;
                                //   const substack2Id = parentBlock.inputs?.SUBSTACK2?.block;

                                // console.log(parentBlock)

                                if (substackId === childId) {

                                    console.log(`found by ${args.ID}`)
                                    parentBlockId = blockId;
                                    console.log("pbid", parentBlockId)
                                    const pB = blockContainer.getBlock(parentBlockId)
                                    if (pB && pB.el.bin.includes(currentBlockId)) {
                                        nest = pB.el.el
                                        console.log("nest", nest)


                                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                        // console.log(`body is`, body)
                                        let el = document.createElement(args.EL)
                                        el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                                        el = body.appendChild(el)
                                        return
                                    }
                                }

                                if (substackId) {
                                    let checkId = substackId;
                                    while (checkId) {
                                        if (checkId === childId) return blockId;
                                        checkId = target.blocks.getBlock(checkId)?.next;
                                    }
                                }

                                //   if (substack2Id) {
                                //     let checkId = substack2Id;
                                //     while (checkId) {
                                //       if (checkId === childId) return blockId;
                                //       checkId = target.blocks.getBlock(checkId)?.next;
                                //     }
                                //   }
                            }
                            childId = blockId;
                            blockId = parentBlock.parent;
                        }
                        // console.log("cb", currentBlock)
                        // console.log("Parent is", currentBlock.parent)
                        // if (currentBlock && currentBlock.parent){
                        //     const parentBlockId = currentBlock.parent;
                        //     const parentBlock = blockContainer.getBlock(parentBlockId)
                        //     if(parentBlock && parentBlock.el){
                        //         console.log("el", parentBlock.el)
                        //         nest = parentBlock.el.el
                        //     }
                        // } 
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        // console.log(`nest is`, nest)


                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                        // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                        // console.log(this.pages)


                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        // console.log(`body is`, body)
                        let el = document.createElement(args.EL)
                        el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        el = body.appendChild(el)
                    } else {
                        throw new Error(`Only one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)

                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                }
            }
        }

        nestEl(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (util.stackFrame.startedBranch) {
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</${args.EL}><!-- end the bottom of ${args.ID} -->`)
                    // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                    // console.log(this.pages)
                    util.stackFrame.startedBranch = false;
                    return;
                }
                if (args.ID !== "") {
                    if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack(); //
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        let blocksInLoop = []
                        function fn() {

                            const bc = util.thread.target.blocks;

                            const substackInput = currentBlock.inputs.SUBSTACK;
                            if (!substackInput || !substackInput.block) {
                                console.log("The loop branch is empty.");
                                return;
                            }

                            const branchBlockIds = [];

                            // Helper function to recursively collect block IDs down the chain
                            const scanChain = (startBlockId) => {
                                let nextBlockId = startBlockId;

                                while (nextBlockId) {
                                    branchBlockIds.push(nextBlockId);

                                    const blockInfo = blockContainer.getBlock(nextBlockId);
                                    if (!blockInfo) break;

                                    // If this block is ANOTHER loop, dive inside its mouth first!
                                    if (blockInfo.inputs && blockInfo.inputs.SUBSTACK && blockInfo.inputs.SUBSTACK.block) {
                                        scanChain(blockInfo.inputs.SUBSTACK.block);
                                    }

                                    // If it's an If-Else block, it might also have a SUBSTACK2 mouth
                                    if (blockInfo.inputs && blockInfo.inputs.SUBSTACK2 && blockInfo.inputs.SUBSTACK2.block) {
                                        scanChain(blockInfo.inputs.SUBSTACK2.block);
                                    }

                                    // Move to the next block directly underneath
                                    nextBlockId = blockInfo.next;
                                }
                            };

                            // Start scanning from the very first block inside your custom loop
                            scanChain(substackInput.block);

                            blocksInLoop = branchBlockIds

                        }

                        fn()

                        if (currentBlock) {
                            currentBlock.el = {
                                el: args.ID,
                                compiledScope: 'global',
                                bin: blocksInLoop
                            };
                        }
                        // console.log(this.pages)

                        const target = util.thread.target;


                        let parentBlockId = ""
                        let parentBlock = ""
                        let nest = ""
                        const loopOpcodes = [
                            'scrtwpmhtmldocuments_nestEl',
                            'scrtwpmhtmldocuments_changeHTML',
                        ];
                        let blockId = currentBlockId;
                        while (blockId) {
                            const block = target.blocks.getBlock(blockId);
                            if (!block) break;

                            if (loopOpcodes.includes(block.opcode) && block !== currentBlock) {
                                // blockId = block.parent;
                                console.log(`found by ${args.ID}`)
                                parentBlockId = block;
                                console.log(parentBlockId)
                                parentBlock = blockContainer.getBlock(parentBlockId)
                                // const pB = blockContainer.getBlock(parentBlockId)
                                if (parentBlockId && parentBlockId.el.bin.includes(currentBlockId)) {
                                    nest = parentBlockId.el.el
                                    console.log("nest is", nest)


                                    let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                    // console.log(`body is`, body)
                                    let el = document.createElement(args.EL)
                                    el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                                    el = body.appendChild(el)


                                    util.stackFrame.startedBranch = true;
                                    util.startBranch(1);
                                    return
                                }


                            }

                            blockId = block.parent; // Move to the parent block [3]

                        }
                        // console.log("cb", currentBlock)
                        // if (currentBlock && currentBlock.parent && currentBlock.parent.el){
                        //     nest = currentBlock.parent.el
                        // } 
                        // console.log(this.pages)
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        // console.log(`body is`, body)
                        let el = document.createElement(args.EL)
                        el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        el = body.appendChild(el)
                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`)
                    } else {
                        throw new Error(`Ony one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)
                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`)
                }
                util.stackFrame.startedBranch = true;
                util.startBranch(1, true);
            }
        }


        changeHTML(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (util.stackFrame.startedBranch) {
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</${args.EL}><!-- end the bottom of ${args.ID} -->`)
                    // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                    // console.log(this.pages)
                    util.stackFrame.startedBranch = false;
                    return;
                }
                if (args.ID !== "") {
                    if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack(); //
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        function fn() {
                            const bc = util.thread.target.blocks;
                            const currentBlock = bc.getBlock(currentBlockId);
                            if (!currentBlock) return;

                            // 3. Find the ID of the first block inside the loop's C-shaped slot (SUBSTACK)
                            const substackInput = currentBlock.inputs.SUBSTACK;
                            if (!substackInput || !substackInput.block) {
                                console.log("The loop branch is empty.");
                                return;
                            }

                            const branchBlockIds = [];
                            let nextBlockId = substackInput.block;

                            // 4. Follow the chain of linked blocks sequentially down the branch
                            while (nextBlockId) {
                                branchBlockIds.push(nextBlockId);

                                const blockInfo = bc.getBlock(nextBlockId);
                                // Move down to the next block inline, stopping if there are no more
                                nextBlockId = blockInfo ? blockInfo.next : null;
                            }

                            // 5. Output the list of specific IDs
                            blocksInLoop = (branchBlockIds);
                        }

                        fn()

                        if (currentBlock) {
                            currentBlock.el = {
                                el: args.ID,
                                compiledScope: 'global',
                                bin: blocksInLoop
                            };
                        }
                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                        body.innerHTML = ""
                        // console.log(this.pages)

                        //   const target = util.thread.target;


                        //     let parentBlockId = ""
                        //     let parentBlock = ""
                        //     let nest = ""
                        //     const loopOpcodes = [
                        //         'scrtwpmhtmldocuments_nestEl',
                        //                 ];
                        //                 let blockId = currentBlockId;
                        //                 while (blockId) {
                        //                     const block = target.blocks.getBlock(blockId);
                        //                     if (!block) break;

                        //                     if (loopOpcodes.includes(block.opcode) && block !== currentBlock) {
                        //                         // blockId = block.parent;
                        //                         console.log(`found by ${args.ID}`)
                        //                         parentBlockId = block;
                        //                         console.log(parentBlockId)
                        //                         parentBlock = blockContainer.getBlock(parentBlockId)
                        //                         nest = parentBlockId.el.el
                        //                         console.log("nest is", nest)


                        //             // let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        //             // // console.log(`body is`, body)
                        //             // let el = document.createElement(args.EL)
                        //             // el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        //             // el = body.appendChild(el)


                        //                         util.stackFrame.startedBranch = true;
                        //     util.startBranch(1);
                        //     return



                        // }

                        //  blockId = block.parent; // Move to the parent block [3]

                        // }
                        // console.log("cb", currentBlock)
                        // if (currentBlock && currentBlock.parent && currentBlock.parent.el){
                        //     nest = currentBlock.parent.el
                        // } 
                        // console.log(this.pages)
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        // let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        // // console.log(`body is`, body)
                        // let el = document.createElement(args.EL)
                        // el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        // el = body.appendChild(el)
                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`)
                    } else {
                        throw new Error(`Ony one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)
                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`)
                }
                util.stackFrame.startedBranch = true;
                util.startBranch(1, true);
            }
        }

        text(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {

            // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}${text}`)



            if ((this.pages).has(args.PAGE)) {
                // if (args.ID !== "") {
                // if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                // console.log(this.pages)
                const blockContainer = util.thread.blockContainer;
                const currentBlockId = util.thread.peekStack();
                const currentBlock = blockContainer.getBlock(currentBlockId);
                const target = util.thread.target;



                let parentBlockId = ""
                let parentBlock = ""


                let childId = currentBlockId;
                let blockId = target.blocks.getBlock(currentBlockId)?.parent;

                let nest = ""
                const loopOpcodes = [
                    'scrtwpmhtmldocuments_nestEl',
                    'scrtwpmhtmldocuments_changeHTML',

                ];
                // let blockId = currentBlockId;






                while (blockId) {
                    const parentBlock = target.blocks.getBlock(blockId);
                    // if (!parentBlock) break;
                    console.log(parentBlock)

                    if (loopOpcodes.includes(parentBlock.opcode)) {


                        const substackId = parentBlock.inputs?.SUBSTACK?.block;
                        //   const substack2Id = parentBlock.inputs?.SUBSTACK2?.block;

                        // console.log(parentBlock)

                        if (substackId === childId) {

                            console.log(`found by ${args.ID}`)
                            parentBlockId = blockId;
                            console.log("pbid", parentBlockId)
                            const pB = blockContainer.getBlock(parentBlockId)
                            if (pB && pB.el.bin.includes(currentBlockId)) {
                                nest = pB.el.el
                                console.log("nest", nest)

                                let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                // console.log(`body is`, body)

                                let text = document.createRange().createContextualFragment(args.TEXT)
                                let elements = text.querySelectorAll(`script`);
                                elements.forEach(el => el.remove());
                                text = toAString.serializeToString(text)
                                body.innerHTML += text

                                console.log("BODY", body)
                                return
                            }
                        }

                        if (substackId) {
                            let checkId = substackId;
                            while (checkId) {
                                if (checkId === childId) return blockId;
                                checkId = target.blocks.getBlock(checkId)?.next;
                            }
                        }

                        //   if (substack2Id) {
                        //     let checkId = substack2Id;
                        //     while (checkId) {
                        //       if (checkId === childId) return blockId;
                        //       checkId = target.blocks.getBlock(checkId)?.next;
                        //     }
                        //   }
                    }
                    childId = blockId;
                    blockId = parentBlock.parent;
                }
                // console.log("cb", currentBlock)
                // console.log("Parent is", currentBlock.parent)
                // if (currentBlock && currentBlock.parent){
                //     const parentBlockId = currentBlock.parent;
                //     const parentBlock = blockContainer.getBlock(parentBlockId)
                //     if(parentBlock && parentBlock.el){
                //         console.log("el", parentBlock.el)
                //         nest = parentBlock.el.el
                //     }
                // } 
                // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                // console.log(`nest is`, nest)


                // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                // console.log(this.pages)
                //     } else {
                //         throw new Error(`Only one element with the id "${args.ID}" can exist in the document`)
                //     }
                // } else {
                //         throw new Error(`Element must have an id`)

                //     // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                //     // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                // }

                let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                // console.log(`body is`, body)

                let text = document.createRange().createContextualFragment(args.TEXT)
                let elements = text.querySelectorAll(`script`);
                elements.forEach(el => el.remove());
                text = toAString.serializeToString(text)
                body.innerHTML += text

            }



            // }
        }

        removeEl(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {


                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                    // console.log(`body is`, body)
                    el.remove()
                }

                console.log(this.pages)
            }
            // }

        }

        styleEl(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {


            if (util.stackFrame.startedBranch) {
                this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</style><!--end my style-->`)

                util.stackFrame.startedBranch = false;
                return;
            }

            const blockContainer = util.thread.blockContainer;
            const currentBlockId = util.thread.peekStack(); //
            const currentBlock = blockContainer.getBlock(currentBlockId);
            if (currentBlock) {
                currentBlock.stylePage = {
                    page: args.PAGE,
                    compiledScope: 'global',
                };
            }
            this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!--begin my style--><style>`)

            util.stackFrame.startedBranch = true;
            util.startBranch(1, true);

            //             if (Object.keys(this.pages).includes(args.PAGE)){
            //     if (util.stackFrame.startedBranch) {
            //         this.pages[args.PAGE].code += `</${args.EL}><!-- end the bottom of ${args.ID} -->`

            //         util.stackFrame.startedBranch = false; 
            //         return; 
            //     }
            //     if(args.ID !== ""){
            //         if(!this.pages[args.PAGE].ids.includes(args.ID)){
            //         this.pages[args.PAGE].ids.push(args.ID)
            //         this.pages[args.PAGE].code += `<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`
            //         } else {
            //         throw new Error (`Ony one element with the id "${args.ID}" can exist in the document`)
            //         }
            //     } else {
            //         this.pages[args.PAGE].code += `<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`
            //     }
            //     util.stackFrame.startedBranch = true;
            //     util.startBranch(1, true); 
            // }


            //     if (util.stackFrame.startedBranch) {
            //         //do after
            //         this.pages[args.PAGE].code += `</style><!--end my style-->`

            //         util.stackFrame.startedBranch = false; 
            //         return; 
            //     }
            //     //do before
            //         const blockContainer = util.thread.blockContainer;
            //         const currentBlockId = util.thread.peekStack(); //
            //         const currentBlock = blockContainer.getBlock(currentBlockId);
            //         if (currentBlock) {
            //         currentBlock.stylePage = {
            //             page: args.PAGE,
            //             compiledScope: 'global',
            //         };

            //         this.pages[args.PAGE].code += `<!--begin my style--><style>`




            //         }
            //     util.stackFrame.startedBranch = true;
            //     util.startBranch(1, true); 
            // }


            // }
            // }

        }
        property(args, util) {
            if (this.pages.has(args.PAGE)) {
                function containsCssUnit(str) {
                    const cssUnitsPattern = /\d+(?:px|em|rem|ex|ch|vw|vh|vmin|vmax|cm|mm|in|pt|pc|Q|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|%)\b/i;
                    return cssUnitsPattern.test(str);
                }

                // const blockContainer = util.thread.blockContainer;
                // const currentBlockId = util.thread.peekStack();
                // const currentBlock = blockContainer.getBlock(currentBlockId);

                // if (currentBlock) {
                //     if(currentBlock.parent){
                //     const parentBlockId = currentBlock.parent;
                //     const parentBlock = blockContainer.getBlock(parentBlockId);
                let px = this.changePx
                let value = ""
                console.log(px)
                if (px.includes(args.VALUE)) {
                    if (!containsCssUnit(args.VALUE)) {
                        value = `${args.VALUE}px`
                    } else {
                        value = args.VALUE
                    }
                } else {
                    value = args.VALUE
                }

                // if (parentBlock.stylePage && parentBlock) {

                console.log(value)
                if (!this.pages.get(args.PAGE)?.get("code").querySelector("style")) {
                    let body = this.pages.get(args.PAGE)?.get("code").querySelector("head")
                    // console.log(`body is`, body)
                    let el = document.createElement("style")
                    if (args.TYPE === "") {
                        el.innerHTML = `${args.NAME}{${args.PROPERTY}:${value};}`
                    } else {
                        el.innerHTML = `${args.TYPE}element${args.PAGE}${args.NAME}{${args.PROPERTY}:${value};}`
                    }
                    el = body.appendChild(el)
                } else {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector("style")
                    if (args.TYPE === "") {
                        el.innerHTML += `${args.NAME}{${args.PROPERTY}:${value};}`
                    } else {
                        el.innerHTML += `${args.TYPE}element${args.PAGE}${args.NAME}{${args.PROPERTY}:${value};}`
                    }
                }

                // }

                //     } else {
                //         // throw new Error(`Just clicking this block won't do anything. You have to put it inside of an "add style to" loop first. The shape matches the shape of this block!`)
                //     }
                // }


            }
        }


        remallstyle(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {


            if (this.pages.get(args.PAGE)?.get("code").querySelector(`style`)) {
                let el = this.pages.get(args.PAGE)?.get("code").querySelector(`style`)
                // console.log(`body is`, body)
                el.remove()
            }

            // }
        }

        setAttr(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            if (args.ID !== "") {


                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                    // console.log(`body is`, body)
                    if (args.ATTR === "class") {
                        el.setAttribute(args.ATTR, `element${args.PAGE}${args.VAL}`)
                    } else {
                        el.setAttribute(args.ATTR, args.VAL)
                    }

                }
            }
            // }
        }

        ppos(args, util) {
            if ((this.pages).has(args.PAGE)) {
                return (this.pages.get(args.PAGE).get("data").get(args.AXIS))
            } else {
                return ('Page does not exist!')
            }
        }

        movePage(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            return new Promise((resolve, reject) => {
                try {
                    this.pages.get(args.PAGE).get("data").set("x", args.X)
                    this.pages.get(args.PAGE).get("data").set("y", args.Y)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // console.log(key, value)
                            console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });


        }
        resizePage(args, util) {

            return new Promise((resolve, reject) => {
                try {
                    //if (Object.keys(this.pages).includes(args.PAGE)) {
                    this.pages.get(args.PAGE).get("data").set("width", args.X)
                    this.pages.get(args.PAGE).get("data").set("height", args.Y)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // console.log(key, value)
                            console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        resetDefault(args, util) {

            return new Promise((resolve, reject) => {
                try {
                    //if (Object.keys(this.pages).includes(args.PAGE)) {
                    this.pages.get(args.PAGE).get("data").set("width", Number(window.getComputedStyle(Scratch.renderer.canvas.parentElement).width.replace("px", "")) - 10)
                    this.pages.get(args.PAGE).get("data").set("height", Number(window.getComputedStyle(Scratch.renderer.canvas.parentElement).height.replace("px", "")) - 10)
                    this.pages.get(args.PAGE).get("data").set("x", 5)
                    this.pages.get(args.PAGE).get("data").set("y", 5)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // console.log(key, value)
                            console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        spw(args, util) {
            return (window.getComputedStyle(Scratch.renderer.canvas.parentElement)[args.WH].replace("px", ""))
        }

        importHTML(args, util) {

        }

        prettierInText(html) {
            let clean = html.replace(/\s*([<>])\s*/g, '$1').replace(/\s+/g, ' ');
            let reg = /(<[^>]+>)/g;
            let matches = clean.split(reg).filter(Boolean);
            let formatted = '';
            let pad = 0;
            matches.forEach((token) => {
                if (token.match(/<\/\w+/)) {
                    pad--;
                }
                formatted += '  '.repeat(Math.max(0, pad)) + token + '\n';
                if (token.match(/<[^\/][^>]*[^>\/]>/) && !token.match(/<(input|img|br|hr|meta|link)/)) {
                    pad++;
                }
            });
            return formatted.trim();
        }


        getHTML(args, util) {
            if ((this.pages).has(args.PAGE)) {
                let doc = this.pages.get(args.PAGE).get("code")
                let el = toAString.serializeToString(doc)
                // let el = this.pages.get(args.PAGE).get("code");
                let cleanString = el.replace(/<!--[\s\S]*?-->/g, "").replace(/xmlns="[\s\S]*?"/g, "").replaceAll(`element${args.PAGE}`, "");
                let toChange = `<html><body>${cleanString}</body></html>`

                return (this.prettierInText(cleanString))
            } else {
                return ('Page does not exist!')
            }
        }


        addeve(args, util) {
            let el = this.pages.get(args.PAGE)?.get("code").getElementById(`element${args.PAGE}${args.ID}`);
            if (!el) throw new Error(`An element with the id "${args.ID}" doesn't exist in the page`);
            this.pages.get(args.PAGE)?.get("eves").set(args.ID, args.EVE)
            // console.log(this.pages.get(args.PAGE)?.get("eves"))
        }

        remeve(args) {
            let el = this.pages.get(args.PAGE)?.get("code").getElementById(`element${args.PAGE}${args.ID}`);
            if (!el) return;
            this.pages.get(args.PAGE)?.get("eves").delete(args.ID)


            if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                return new Promise((resolve, reject) => {
                    try {
                        //if (Object.keys(this.pages).includes(args.PAGE)) {
                        if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                            const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                            elements.forEach(el => el.remove());
                            const el = document.createElement("iframe");
                            el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                            el.setAttribute("class", `htmlpage display${args.PAGE}`)
                            el.style.position = 'absolute';
                            el.style.pointerEvents = 'auto';
                            el.style.zIndex = '10';
                            el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                            el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                            el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                            el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                            el.style.border = "1px solid black"
                            const container = Scratch.renderer.canvas.parentElement;
                            container.appendChild(el);
                            if (!this.viewing.includes(args.PAGE)) {
                                this.viewing.push(args.PAGE)
                            }
                        }
                        // }

                        el.onload = () => {
                            for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                                // console.log(key, value)
                                console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                                el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                    const triggerText = String(key);
                                    const triggerTexta = String(args.PAGE);

                                    const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                    const vm = Scratch.vm;

                                    vm.runtime.targets.forEach(target => {
                                        const blocks = target.blocks;
                                        const scripts = blocks.getScripts();

                                        scripts.forEach(rootBlockId => {
                                            const block = blocks.getBlock(rootBlockId);

                                            if (block && block.opcode === targetOpcode) {
                                                let hatValue = '';
                                                let hatValuea = '';

                                                if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                    hatValue = block.fields.ID.value;
                                                    hatValuea = block.fields.PAGE.value;
                                                }
                                                else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                    const inputID = block.inputs.ID;
                                                    const inputPAGE = block.inputs.PAGE;

                                                    const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                    const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                    if (shadowBlockID && shadowBlockID.fields) {
                                                        const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                        hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                    }
                                                    if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                        const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                        hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                    }
                                                }

                                                if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                    vm.runtime._pushThread(rootBlockId, target);
                                                }
                                            }
                                        });
                                    });
                                }

                                )


                            }
                        }
                    } catch (error) { }
                    resolve();
                });
            }
        }

        allEls(args, util) {
            if (this.pages.has(args.PAGE)) {
                const allIds = Array.from(this.pages.get(args.PAGE).get("code").querySelectorAll('[id]:not([id=""])'))
                    .map(element => element.id.replace(`element${args.PAGE}`, ""));
                return (JSON.stringify(allIds));
            } else {
                return ('[]')
            }
        }

        dataEl(args, util) {
            try {
                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    switch (args.OPTS) {
                        case "children":
                            return ([...this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS]].map(child => child.id).filter(id => id !== ""))
                        case "parentElement":
                            return (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS].getAttribute("id") ?? this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS].tagName)
                        default:
                            if (args.OPTS !== "innerHTML") {
                                if (this.viewing.includes(args.PAGE)) {
                                    return (document.querySelector(`.htmlpage.display${args.PAGE}`).contentDocument.querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS] ?? "")
                                } else {
                                    return ("Display the page to use these.")
                                }
                            } else {
                                return (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS] ?? "")
                            }

                    }
                } else {
                    return (`An element with the id "${args.ID}" doesn't exist in the page`)
                }
            } catch (error) { return ("") }
        }




        eve() {
            return true;
        }

        current() {
            if (document.querySelector(".htmlpage")) {
                return (JSON.stringify(this.viewing))
            } else {
                return ('[]')
            }
        }
    }

    Scratch.extensions.register(new HTMLDocuments(Scratch.runtime));
})(Scratch);
(function (Scratch) {
    'use strict';

    const dom = new DOMParser()
    const toAString = new XMLSerializer()

    class HTMLDocuments {
        constructor(runtime) {
            this.pages = new Map()
            this.changePx = [
                "block-size",
                "border-block-end-width",
                "border-block-start-width",
                "border-block-width",
                "border-bottom-left-radius",
                "border-bottom-right-radius",
                "border-bottom-width",
                "border-image-outset",
                "border-image-width",
                "border-inline-end-width",
                "border-inline-start-width",
                "border-inline-width",
                "border-left-width",
                "border-right-width",
                "border-spacing",
                "border-top-left-radius",
                "border-top-right-radius",
                "border-top-width",
                "border-width",
                "bottom",
                "column-gap",
                "column-rule-width",
                "column-width",
                "contain-intrinsic-block-size",
                "contain-intrinsic-height",
                "contain-intrinsic-inline-size",
                "contain-intrinsic-size",
                "contain-intrinsic-width",
                "cx",
                "cy",
                "font-size",
                "gap",
                "grid-auto-columns",
                "grid-auto-rows",
                "grid-template-columns",
                "grid-template-rows",
                "height",
                "inline-size",
                "left",
                "letter-spacing",
                "margin-block-end",
                "margin-block-start",
                "margin-block",
                "margin-bottom",
                "margin-inline-end",
                "margin-inline-start",
                "margin-inline",
                "margin-left",
                "margin-right",
                "margin-top",
                "max-block-size",
                "max-height",
                "max-inline-size",
                "max-width",
                "min-block-size",
                "min-height",
                "min-inline-size",
                "min-width",
                "object-position",
                "offset-distance",
                "offset-path",
                "outline-offset",
                "outline-width",
                "padding-block-end",
                "padding-block-start",
                "padding-block",
                "padding-bottom",
                "padding-inline-end",
                "padding-inline-start",
                "padding-inline",
                "padding-left",
                "padding-right",
                "padding-top",
                "perspective",
                "perspective-origin",
                "r",
                "right",
                "row-gap",
                "rx",
                "ry",
                "scroll-margin-bottom",
                "scroll-margin-left",
                "scroll-margin-right",
                "scroll-margin-top",
                "scroll-padding-bottom",
                "scroll-padding-left",
                "scroll-padding-right",
                "scroll-padding-top",
                "shape-margin",
                "tab-size",
                "text-decoration-thickness",
                "text-indent",
                "top",
                "transform-origin",
                "translate",
                "width",
                "word-spacing",
                "x",
                "y"
            ]
            this.viewing = []
            this.runtime = runtime
        }
        getInfo() {
            return {
                id: 'scrtwpmhtmldocuments',
                name: 'HTML documents',
                color1: '#ff9900',
                blocks: [

                    {
                        opcode: 'createPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'create new page named [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'deletePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'delete page named [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'clearPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear content of [PAGE]',
                        // notchAccepts: "htmldocuments-coolshape",
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'allPages',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all pages',
                        disableMonitor: true,
                    },
                    {
                        opcode: 'getHTML',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get html code of [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    // {
                    //     opcode: 'get',
                    //     blockType: Scratch.BlockType.REPORTER,
                    //     text: 'get',
                    // },
                    { blockType: Scratch.BlockType.LABEL, text: "Render HTML" },
                    {
                        opcode: 'displayPage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'display page [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'hidePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'hide page [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'hidePageAll',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'hide all pages',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            }
                        }
                    },
                    {
                        opcode: 'current',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current pages displayed',
                        disableMonitor: true
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Element Management" },
                    {
                        opcode: 'nestEl',
                        blockType: Scratch.BlockType.CONDITIONAL,
                        text: 'add [EL] id [ID] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nest",
                                defaultValue: "div"
                            }
                        }
                    },
                    {
                        opcode: 'noNestEl',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add [EL] id [ID] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nonest",
                                defaultValue: "input"
                            },
                        }
                    },
                    {
                        opcode: 'text',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add text [TEXT] to [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello World!"
                            },
                        }
                    },
                    {
                        opcode: 'removeEl',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove element with id [ID] from [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                        }
                    },
                    {
                        opcode: 'setAttr',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [ATTR] of [ID] to [VAL] in [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            VAL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-class"
                            },
                            ATTR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "class",
                                menu: "attr"
                            },
                        }

                    },


                    {
                        opcode: 'changeHTML',
                        blockType: Scratch.BlockType.CONDITIONAL,
                        text: 'change [ID] in [PAGE] to',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            EL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "nonest",
                                defaultValue: "input"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "CSS Styles" },

                    // {
                    //     opcode: 'styleEl',
                    //     blockType: Scratch.BlockType.CONDITIONAL,
                    //     text: 'add style to [PAGE]',
                    //     branchCount: 1,
                    //     // notchAccepts: "htmldocuments-coolshape",
                    //     branches: [
                    //         { accepts: "htmldocuments-coolshape2" },
                    //     ],
                    //     arguments: {
                    //       PAGE: {
                    //         type: Scratch.ArgumentType.STRING,
                    //         defaultValue: "my-page"
                    //       },
                    //     }
                    // },
                    {
                        opcode: 'property',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [PROPERTY] for [TYPE] [NAME] to [VALUE] in [PAGE]',
                        // notchAccepts: "htmldocuments-coolshape2",
                        arguments: {
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "properties",
                                defaultValue: "color"
                            },
                            TYPE: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "types"
                            },
                            NAME: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el"
                            },
                            VALUE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "green",
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page",
                            },
                        }
                    },

                    {
                        opcode: 'remallstyle',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear styling of [PAGE]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "Event Listeners" },


                    {
                        opcode: 'eve',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when listener for [ID] activated in [PAGE]',
                        isEdgeActivated: false,
                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "new-el",
                                // defaultValue: '{"Hello":"Item 1", "Bye":"Item 2"}'
                            },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'addeve',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add event listener [EVE] for [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'remeve',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove event listeners from [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },

                    { blockType: Scratch.BlockType.LABEL, text: "Webpage Data" },

                    {
                        opcode: 'allEls',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'all elements in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                        }
                    },
                    {
                        opcode: 'dataEl',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[OPTS] of [ID] in [PAGE]',
                        arguments: {
                            EVE: { type: Scratch.ArgumentType.STRING, menu: 'eves', defaultValue: 'click' },
                            ID: { type: Scratch.ArgumentType.STRING, defaultValue: 'new-el' },
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            OPTS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "opts"
                            },
                        }
                    },


                    { blockType: Scratch.BlockType.LABEL, text: "Webpage Positioning" },

                    {
                        opcode: 'movePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'move [PAGE] to x: [X] y: [Y]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "50"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "50"
                            },
                        }
                    },
                    {
                        opcode: 'resizePage',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'resize [PAGE] to x: [X] y: [Y]',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "300"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "200"
                            },
                        }
                    },
                    {
                        opcode: 'resetDefault',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set [PAGE] display settings to stage size',
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "300"
                            },
                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: "200"
                            },
                        }
                    },
                    {
                        opcode: 'ppos',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[AXIS] of [PAGE]',
                        disableMonitor: true,
                        arguments: {
                            PAGE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "my-page"
                            },
                            AXIS: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "axis"
                            },
                        }
                    },
                    {
                        opcode: 'spw',
                        blockType: Scratch.BlockType.REPORTER,
                        text: '[WH] of the stage',
                        disableMonitor: true,
                        arguments: {
                            WH: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "wh"
                            },
                        }
                    },

                ],
                menus: {
                    nonest: {
                        acceptReporters: true,
                        items:
                            [
                                "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "script", "source", "textarea", "track", "wbr"
                            ]
                    },
                    nest: {
                        acceptReporters: true,
                        items:
                            [
                                "a", "abbr", "address", "article", "aside", "audio", "b", "bdi", "bdo", "blockquote", "button", "canvas", "caption", "cite", "code", "colgroup", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "div", "dl", "dt", "em", "fieldset", "figcaption", "figure", "footer", "form", "h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup", "i", "iframe", "ins", "kbd", "label", "legend", "li", "main", "map", "mark", "menu", "meter", "nav", "object", "ol", "optgroup", "option", "output", "p", "picture", "pre", "progress", "q", "rp", "rt", "ruby", "s", "samp", "section", "select", "slot", "small", "span", "strong", "sub", "summary", "sup", "table", "tbody", "td", "template", "tfoot", "th", "thead", "time", "tr", "u", "ul", "var", "video"
                            ]
                    },
                    types: {
                        acceptReporters: false,
                        items: [
                            { text: "id", value: "#" },
                            { text: "class", value: "." },
                            // {text: "animation", value: "@keyframes "},
                        ]
                    },
                    opts: {
                        acceptReporters: false,
                        items: [
                            { text: "inner HTML", value: "innerHTML" },
                            { text: "text content", value: "textContent" },
                            { text: "children", value: "children" },
                            { text: "parent element", value: "parentElement" },
                            { text: "tag name", value: "tagName" },
                            // { text: "style", value: "style" },
                            { text: "value", value: "value" },
                            { text: "checked", value: "checked" },
                            { text: "class list", value: "classList" },
                            { text: "offset width", value: "offsetWidth" },
                            { text: "offset height", value: "offsetHeight" },
                            { text: "scroll width", value: "scrollWidth" },
                            { text: "scroll height", value: "scrollHeight" },
                            { text: "disabled", value: "disabled" },
                            // { text: "all data of", value: "all" },
                        ]
                    },
                    properties: {
                        acceptReporters: true,
                        items: [

                            'align-content', 'align-items', 'align-self', 'all', 'animation', 'animation-delay', 'animation-direction', 'animation-duration', 'animation-fill-mode', 'animation-iter-count', 'animation-name', 'animation-play-state', 'animation-timing-fn', 'backface-visibility', 'background', 'background-attachment', 'background-blend-mode', 'background-clip', 'background-color', 'background-image', 'background-origin', 'background-position', 'background-repeat', 'background-size', 'border', 'border-bottom', 'border-bottom-color', 'border-bottom-left-rad', 'border-bottom-right-ra', 'border-bottom-style', 'border-bottom-width', 'border-collapse', 'border-color', 'border-image', 'border-image-outset', 'border-image-repeat', 'border-image-slice', 'border-image-source', 'border-image-width', 'border-left', 'border-left-color', 'border-left-style', 'border-left-width', 'border-radius', 'border-right', 'border-right-color', 'border-right-style', 'border-right-width', 'border-spacing', 'border-style', 'border-top', 'border-top-color', 'border-top-left-radius', 'border-top-right-radius', 'border-top-style', 'border-top-width', 'border-width', 'bottom', 'box-decoration-break', 'box-shadow', 'box-sizing', 'caption-side', 'caret-color',
                            'clear', 'clip', 'clip-path', 'color', 'column-count', 'column-fill', 'column-gap', 'column-rule', 'column-rule-color', 'column-rule-style', 'column-rule-width', 'column-span', 'column-width', 'columns', 'content', 'counter-increment', 'counter-reset', 'cursor', 'direction', 'display', 'empty-cells', 'filter', 'flex', 'flex-basis', 'flex-direction', 'flex-flow', 'flex-grow', 'flex-shrink', 'flex-wrap', 'float', 'font',
                            'font-family', 'font-kerning', 'font-size', 'font-stretch', 'font-style', 'font-variant', 'font-weight', 'gap', 'grid', 'grid-area', 'grid-auto-columns', 'grid-auto-flow', 'grid-auto-rows', 'grid-column', 'grid-column-end', 'grid-column-gap', 'grid-column-start', 'grid-gap', 'grid-row', 'grid-row-end', 'grid-row-gap', 'grid-row-start', 'grid-template', 'grid-template-areas', 'grid-template-columns', 'grid-template-rows', 'height', 'hyphens',
                            'justify-content',
                            'left', 'letter-spacing', 'line-height', 'list-style', 'list-style-image', 'list-style-position', 'list-style-type', 'margin', 'margin-bottom', 'margin-left', 'margin-right', 'margin-top', 'max-height', 'max-width',
                            'min-height', 'min-width', 'object-fit', 'object-position', 'opacity', 'order', 'outline', 'outline-color', 'outline-offset', 'outline-style', 'outline-width', 'overflow', 'overflow-x', 'overflow-y', 'padding', 'padding-bottom', 'padding-left', 'padding-right', 'padding-top', 'page-break-after', 'page-break-before', 'page-break-inside', 'perspective', 'perspective-origin', 'pointer-events', 'position', 'quotes', 'right', 'row-gap', 'scroll-behavior', 'table-layout', 'text-align', 'text-align-last', 'text-decoration', 'text-decoration-color', 'text-decoration-line', 'text-decoration-style', 'text-indent', 'text-justify', 'text-overflow', 'text-shadow', 'text-transform', 'top', 'transform', 'transform-origin', 'transform-style', 'transition', 'transition-delay', 'transition-duration', 'transition-property', 'transition-timing-fn', 'user-select', 'vertical-align', 'visibility', 'white-space', 'width', 'word-break', 'word-spacing', 'word-wrap', 'writing-mode', 'z-index'

                        ]
                    },
                    axis: {
                        acceptReporters: false,
                        items: [
                            { text: "x position", value: "x" }, { text: "y position", value: "y" }, "width", "height"
                        ]
                    },
                    wh: {
                        acceptReporters: false,
                        items: [
                            "width", "height"
                        ]
                    },
                    eves: {
                        acceptReporters: true,
                        items: [
                            // Mouse & Pointer
                            "click", "dblclick", "mousedown", "mouseup", "mouseenter",
                            "mouseleave", "mousemove", "mouseover", "mouseout", "contextmenu", "wheel",

                            // Keyboard
                            "keydown", "keyup", "keypress",

                            // Form & Input
                            "submit", "input", "change", "focus", "blur", "reset", "invalid",

                            // Window & Document
                            "load", "DOMContentLoaded", "beforeunload", "unload", "resize",
                            "scroll", "error", "visibilitychange",

                            // Drag & Drop
                            "dragstart", "drag", "dragenter", "dragover", "dragleave", "drop", "dragend",

                            // Mobile & Media
                            "touchstart", "touchmove", "touchend", "play"
                        ]
                    },
                    attr: {
                        acceptReporters: false,
                        items: [
                            "accesskey", "autocapitalize", "autofocus", "class", "contenteditable",
                            "dir", "draggable", "enterkeyhint", "hidden", "inert", "inputmode",
                            "lang", "nonce", "part", "popover", "role", "slot", "style", "tabindex",
                            "title", "translate", "virtualkeyboardpolicy",
                            "accept", "accept-charset", "action", "align", "allow", "alt", "as",
                            "async", "autocomplete", "autoplay", "background", "bgcolor", "border",
                            "capture", "charset", "checked", "cite", "color", "cols", "colspan",
                            "content", "controls", "coords", "crossorigin", "csp", "data", "datetime",
                            "decoding", "default", "defer", "disabled", "download", "enctype", "for",
                            "form", "formaction", "formenctype", "formmethod", "formnovalidate",
                            "formtarget", "headers", "height", "high", "href", "hreflang", "http-equiv",
                            "imagesizes", "imagesrcset", "integrity", "ismap", "kind", "label", "list",
                            "loading", "loop", "low", "max", "maxlength", "min", "minlength", "media",
                            "method", "multiple", "muted", "name", "novalidate", "open", "optimum",
                            "pattern", "ping", "placeholder", "playsinline", "poster", "preload",
                            "readonly", "referrerpolicy", "rel", "required", "reversed", "rows",
                            "rowspan", "sandbox", "scope", "selected", "shape", "size", "sizes",
                            "span", "src", "srcdoc", "srclang", "srcset", "start", "step", "target",
                            "type", "usemap", "value", "width", "wrap"
                        ]

                    }

                }
            };
        }

        createPage(args, util) {
            if (!Object.keys(this.pages).includes(args.PAGE)) {
                if (args.PAGE !== "") {
                    this.pages.set(args.PAGE, new Map().set("data", new Map().set("x", 5).set("y", 5).set("width", 470).set("height", 350)).set("code", dom.parseFromString("", 'text/html')).set("eves", new Map()))
                    console.log(this.pages)
                } else {
                    throw new Error("Name cannot be empty")
                }
            }
        }
        clearPage(args, util) {

            // //if (Object.keys(this.pages).includes(args.PAGE)) {
            // let pages = this.pages

            this.pages.get(args.PAGE)?.set("code", dom.parseFromString("", 'text/html'))
            this.pages.get(args.PAGE)?.set("eves", new Map())
            // }
        }
        deletePage(args, util) {

            //if (Object.keys(this.pages).includes(args.PAGE)) {
            this.pages.delete(args.PAGE)
            if (this.viewing.includes(args.PAGE)) {
                const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                elements.forEach(el => el.remove());
            }

            // }
        }
        allPages() {
            return (JSON.stringify(Array.from(this.pages.keys())))
        }
        get() {
            if (Object.keys(this.pages).includes("my-page")) {
                return (JSON.stringify(this.pages["my-page"].code))
            }
        }


        displayPage(args, util) {
            return new Promise((resolve, reject) => {
                try {
                    const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                    elements.forEach(el => el.remove());
                    const el = document.createElement("iframe");
                    el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    el.setAttribute("class", `htmlpage display${args.PAGE}`)
                    el.style.position = 'absolute';
                    el.style.pointerEvents = 'auto';
                    el.style.zIndex = '10';
                    el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                    el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                    el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                    el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                    el.style.border = "1px solid black"
                    const container = Scratch.renderer.canvas.parentElement;
                    container.appendChild(el);
                    if (!this.viewing.includes(args.PAGE)) {
                        this.viewing.push(args.PAGE)
                    }
                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // console.log(key, value)
                            console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        hidePageAll(args, util) {
            const elements = document.querySelectorAll('.htmlpage');
            elements.forEach(el => el.remove());
            this.viewing = []
        }

        hidePage(args, util) {
            const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
            elements.forEach(el => el.remove());
            this.viewing.splice(this.viewing.indexOf(args.PAGE), 1)
        }

        noNestEl(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (args.ID !== "") {
                    if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        // console.log(this.pages)
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack();
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        const target = util.thread.target;



                        let parentBlockId = ""
                        let parentBlock = ""


                        let childId = currentBlockId;
                        let blockId = target.blocks.getBlock(currentBlockId)?.parent;

                        let nest = ""
                        const loopOpcodes = [
                            'scrtwpmhtmldocuments_nestEl',
                            'scrtwpmhtmldocuments_changeHTML',
                        ];
                        // let blockId = currentBlockId;






                        while (blockId) {
                            const parentBlock = target.blocks.getBlock(blockId);
                            // if (!parentBlock) break;
                            console.log(parentBlock)

                            if (loopOpcodes.includes(parentBlock.opcode)) {


                                const substackId = parentBlock.inputs?.SUBSTACK?.block;
                                //   const substack2Id = parentBlock.inputs?.SUBSTACK2?.block;

                                // console.log(parentBlock)

                                if (substackId === childId) {

                                    console.log(`found by ${args.ID}`)
                                    parentBlockId = blockId;
                                    console.log("pbid", parentBlockId)
                                    const pB = blockContainer.getBlock(parentBlockId)
                                    if(pB && pB.el.bin.includes(currentBlockId)){
                                    nest = pB.el.el
                                    console.log("nest", nest)


                                    let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                    // console.log(`body is`, body)
                                    let el = document.createElement(args.EL)
                                    el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                                    el = body.appendChild(el)
                                    return
                                    }
                                }

                                if (substackId) {
                                    let checkId = substackId;
                                    while (checkId) {
                                        if (checkId === childId) return blockId;
                                        checkId = target.blocks.getBlock(checkId)?.next;
                                    }
                                }

                                //   if (substack2Id) {
                                //     let checkId = substack2Id;
                                //     while (checkId) {
                                //       if (checkId === childId) return blockId;
                                //       checkId = target.blocks.getBlock(checkId)?.next;
                                //     }
                                //   }
                            }
                            childId = blockId;
                            blockId = parentBlock.parent;
                        }
                        // console.log("cb", currentBlock)
                        // console.log("Parent is", currentBlock.parent)
                        // if (currentBlock && currentBlock.parent){
                        //     const parentBlockId = currentBlock.parent;
                        //     const parentBlock = blockContainer.getBlock(parentBlockId)
                        //     if(parentBlock && parentBlock.el){
                        //         console.log("el", parentBlock.el)
                        //         nest = parentBlock.el.el
                        //     }
                        // } 
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        // console.log(`nest is`, nest)


                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                        // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                        // console.log(this.pages)

                        
                                    let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                    // console.log(`body is`, body)
                                    let el = document.createElement(args.EL)
                                    el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                                    el = body.appendChild(el)
                    } else {
                        throw new Error(`Only one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)

                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                }
            }
        }

        nestEl(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (util.stackFrame.startedBranch) {
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</${args.EL}><!-- end the bottom of ${args.ID} -->`)
                    // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                    // console.log(this.pages)
                    util.stackFrame.startedBranch = false;
                    return;
                }
                if (args.ID !== "") {
                    if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack(); //
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        let blocksInLoop = []
            function fn () {

            const bc = util.thread.target.blocks;

            const substackInput = currentBlock.inputs.SUBSTACK;
            if (!substackInput || !substackInput.block) {
                console.log("The loop branch is empty.");
                return;
            }

            const branchBlockIds = [];

            // Helper function to recursively collect block IDs down the chain
            const scanChain = (startBlockId) => {
                let nextBlockId = startBlockId;

                while (nextBlockId) {
                    branchBlockIds.push(nextBlockId);
                    
                    const blockInfo = blockContainer.getBlock(nextBlockId);
                    if (!blockInfo) break;

                    // If this block is ANOTHER loop, dive inside its mouth first!
                    if (blockInfo.inputs && blockInfo.inputs.SUBSTACK && blockInfo.inputs.SUBSTACK.block) {
                        scanChain(blockInfo.inputs.SUBSTACK.block);
                    }
                    
                    // If it's an If-Else block, it might also have a SUBSTACK2 mouth
                    if (blockInfo.inputs && blockInfo.inputs.SUBSTACK2 && blockInfo.inputs.SUBSTACK2.block) {
                        scanChain(blockInfo.inputs.SUBSTACK2.block);
                    }

                    // Move to the next block directly underneath
                    nextBlockId = blockInfo.next;
                }
            };

            // Start scanning from the very first block inside your custom loop
            scanChain(substackInput.block);

            blocksInLoop = branchBlockIds

                        }

fn()

                        if (currentBlock) {
                            currentBlock.el = {
                                el: args.ID,
                                compiledScope: 'global',
                                bin: blocksInLoop
                            };
                        }
                        // console.log(this.pages)

                        const target = util.thread.target;


                        let parentBlockId = ""
                        let parentBlock = ""
                        let nest = ""
                        const loopOpcodes = [
                            'scrtwpmhtmldocuments_nestEl',
                            'scrtwpmhtmldocuments_changeHTML',
                        ];
                        let blockId = currentBlockId;
                        while (blockId) {
                            const block = target.blocks.getBlock(blockId);
                            if (!block) break;

                            if (loopOpcodes.includes(block.opcode) && block !== currentBlock) {
                                // blockId = block.parent;
                                console.log(`found by ${args.ID}`)
                                parentBlockId = block;
                                console.log(parentBlockId)
                                parentBlock = blockContainer.getBlock(parentBlockId)
                            // const pB = blockContainer.getBlock(parentBlockId)
                                if(parentBlockId && parentBlockId.el.bin.includes(currentBlockId)){
                                nest = parentBlockId.el.el
                                console.log("nest is", nest)


                                let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                                // console.log(`body is`, body)
                                let el = document.createElement(args.EL)
                                el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                                el = body.appendChild(el)


                                util.stackFrame.startedBranch = true;
                                util.startBranch(1);
                                return
                                    }


                            }

                            blockId = block.parent; // Move to the parent block [3]

                        }
                        // console.log("cb", currentBlock)
                        // if (currentBlock && currentBlock.parent && currentBlock.parent.el){
                        //     nest = currentBlock.parent.el
                        // } 
                        // console.log(this.pages)
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        // console.log(`body is`, body)
                        let el = document.createElement(args.EL)
                        el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        el = body.appendChild(el)
                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`)
                    } else {
                        throw new Error(`Ony one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)
                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`)
                }
                util.stackFrame.startedBranch = true;
                util.startBranch(1, true);
            }
        }


        changeHTML(args, util) {
            if ((this.pages).has(args.PAGE)) {
                if (util.stackFrame.startedBranch) {
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</${args.EL}><!-- end the bottom of ${args.ID} -->`)
                    // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                    // console.log(this.pages)
                    util.stackFrame.startedBranch = false;
                    return;
                }
                if (args.ID !== "") {
                    if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                        const blockContainer = util.thread.blockContainer;
                        const currentBlockId = util.thread.peekStack(); //
                        const currentBlock = blockContainer.getBlock(currentBlockId);
                        function fn () {
            const bc = util.thread.target.blocks;
            const currentBlock = bc.getBlock(currentBlockId);
            if (!currentBlock) return;

            // 3. Find the ID of the first block inside the loop's C-shaped slot (SUBSTACK)
            const substackInput = currentBlock.inputs.SUBSTACK;
            if (!substackInput || !substackInput.block) {
                console.log("The loop branch is empty.");
                return;
            }

            const branchBlockIds = [];
            let nextBlockId = substackInput.block;

            // 4. Follow the chain of linked blocks sequentially down the branch
            while (nextBlockId) {
                branchBlockIds.push(nextBlockId);
                
                const blockInfo = bc.getBlock(nextBlockId);
                // Move down to the next block inline, stopping if there are no more
                nextBlockId = blockInfo ? blockInfo.next : null;
            }

            // 5. Output the list of specific IDs
            blocksInLoop = (branchBlockIds);
                        }

fn()

                        if (currentBlock) {
                            currentBlock.el = {
                                el: args.ID,
                                compiledScope: 'global',
                                bin: blocksInLoop
                            };
                        }
                        let body = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                        body.innerHTML = ""
                        // console.log(this.pages)

                        //   const target = util.thread.target;


                        //     let parentBlockId = ""
                        //     let parentBlock = ""
                        //     let nest = ""
                        //     const loopOpcodes = [
                        //         'scrtwpmhtmldocuments_nestEl',
                        //                 ];
                        //                 let blockId = currentBlockId;
                        //                 while (blockId) {
                        //                     const block = target.blocks.getBlock(blockId);
                        //                     if (!block) break;

                        //                     if (loopOpcodes.includes(block.opcode) && block !== currentBlock) {
                        //                         // blockId = block.parent;
                        //                         console.log(`found by ${args.ID}`)
                        //                         parentBlockId = block;
                        //                         console.log(parentBlockId)
                        //                         parentBlock = blockContainer.getBlock(parentBlockId)
                        //                         nest = parentBlockId.el.el
                        //                         console.log("nest is", nest)


                        //             // let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        //             // // console.log(`body is`, body)
                        //             // let el = document.createElement(args.EL)
                        //             // el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        //             // el = body.appendChild(el)


                        //                         util.stackFrame.startedBranch = true;
                        //     util.startBranch(1);
                        //     return



                        // }

                        //  blockId = block.parent; // Move to the parent block [3]

                        // }
                        // console.log("cb", currentBlock)
                        // if (currentBlock && currentBlock.parent && currentBlock.parent.el){
                        //     nest = currentBlock.parent.el
                        // } 
                        // console.log(this.pages)
                        // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        // let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                        // // console.log(`body is`, body)
                        // let el = document.createElement(args.EL)
                        // el.setAttribute("id", `element${args.PAGE}${args.ID}`)
                        // el = body.appendChild(el)
                        // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`)
                    } else {
                        throw new Error(`Ony one element with the id "${args.ID}" can exist in the document`)
                    }
                } else {
                    throw new Error(`Element must have an id`)
                    // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                    // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`)
                }
                util.stackFrame.startedBranch = true;
                util.startBranch(1, true);
            }
        }

        text(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {

            // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}${text}`)



            if ((this.pages).has(args.PAGE)) {
                // if (args.ID !== "") {
                // if (!this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                // console.log(this.pages)
                const blockContainer = util.thread.blockContainer;
                const currentBlockId = util.thread.peekStack();
                const currentBlock = blockContainer.getBlock(currentBlockId);
                const target = util.thread.target;



                let parentBlockId = ""
                let parentBlock = ""


                let childId = currentBlockId;
                let blockId = target.blocks.getBlock(currentBlockId)?.parent;

                let nest = ""
                const loopOpcodes = [
                    'scrtwpmhtmldocuments_nestEl',
                    'scrtwpmhtmldocuments_changeHTML',

                ];
                // let blockId = currentBlockId;






                while (blockId) {
                    const parentBlock = target.blocks.getBlock(blockId);
                    // if (!parentBlock) break;
                    console.log(parentBlock)

                    if (loopOpcodes.includes(parentBlock.opcode)) {


                        const substackId = parentBlock.inputs?.SUBSTACK?.block;
                        //   const substack2Id = parentBlock.inputs?.SUBSTACK2?.block;

                        // console.log(parentBlock)

                        if (substackId === childId) {

                            console.log(`found by ${args.ID}`)
                            parentBlockId = blockId;
                            console.log("pbid", parentBlockId)
                            const pB = blockContainer.getBlock(parentBlockId)
                            if(pB && pB.el.bin.includes(currentBlockId)){
                            nest = pB.el.el
                            console.log("nest", nest)

                            let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                            // console.log(`body is`, body)

                            let text = document.createRange().createContextualFragment(args.TEXT)
                            let elements = text.querySelectorAll(`script`);
                            elements.forEach(el => el.remove());
                            text = toAString.serializeToString(text)
                            body.innerHTML += text

                            console.log("BODY",body)
                            return
                                    }
                        }

                        if (substackId) {
                            let checkId = substackId;
                            while (checkId) {
                                if (checkId === childId) return blockId;
                                checkId = target.blocks.getBlock(checkId)?.next;
                            }
                        }

                        //   if (substack2Id) {
                        //     let checkId = substack2Id;
                        //     while (checkId) {
                        //       if (checkId === childId) return blockId;
                        //       checkId = target.blocks.getBlock(checkId)?.next;
                        //     }
                        //   }
                    }
                    childId = blockId;
                    blockId = parentBlock.parent;
                }
                // console.log("cb", currentBlock)
                // console.log("Parent is", currentBlock.parent)
                // if (currentBlock && currentBlock.parent){
                //     const parentBlockId = currentBlock.parent;
                //     const parentBlock = blockContainer.getBlock(parentBlockId)
                //     if(parentBlock && parentBlock.el){
                //         console.log("el", parentBlock.el)
                //         nest = parentBlock.el.el
                //     }
                // } 
                // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                // console.log(`nest is`, nest)


                // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                // this.pages.get(args.PAGE)?.set("code", document.createRange().createContextualFragment(this.pages.get(args.PAGE).get("code")))
                // console.log(this.pages)
                //     } else {
                //         throw new Error(`Only one element with the id "${args.ID}" can exist in the document`)
                //     }
                // } else {
                //         throw new Error(`Element must have an id`)

                //     // this.pages.get(args.PAGE)?.set("code", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                //     // this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top --><!-- end the bottom of ${args.ID} -->`)
                // }

                                            let body = this.pages.get(args.PAGE)?.get("code").querySelector(nest === "" ? "body" : `#element${args.PAGE}${nest}`)
                            // console.log(`body is`, body)

                            let text = document.createRange().createContextualFragment(args.TEXT)
                            let elements = text.querySelectorAll(`script`);
                            elements.forEach(el => el.remove());
                            text = toAString.serializeToString(text)
                            body.innerHTML += text

            }



            // }
        }

        removeEl(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {


                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                    // console.log(`body is`, body)
                    el.remove()
                }

                console.log(this.pages)
            }
            // }

        }

        styleEl(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {


            if (util.stackFrame.startedBranch) {
                this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}</style><!--end my style-->`)

                util.stackFrame.startedBranch = false;
                return;
            }

            const blockContainer = util.thread.blockContainer;
            const currentBlockId = util.thread.peekStack(); //
            const currentBlock = blockContainer.getBlock(currentBlockId);
            if (currentBlock) {
                currentBlock.stylePage = {
                    page: args.PAGE,
                    compiledScope: 'global',
                };
            }
            this.pages.get(args.PAGE)?.set("code", `${this.pages.get(args.PAGE)?.get("code")}<!--begin my style--><style>`)

            util.stackFrame.startedBranch = true;
            util.startBranch(1, true);

            //             if (Object.keys(this.pages).includes(args.PAGE)){
            //     if (util.stackFrame.startedBranch) {
            //         this.pages[args.PAGE].code += `</${args.EL}><!-- end the bottom of ${args.ID} -->`

            //         util.stackFrame.startedBranch = false; 
            //         return; 
            //     }
            //     if(args.ID !== ""){
            //         if(!this.pages[args.PAGE].ids.includes(args.ID)){
            //         this.pages[args.PAGE].ids.push(args.ID)
            //         this.pages[args.PAGE].code += `<!-- begin the ${args.ID} --><${args.EL} id="element${args.PAGE}${args.ID}"><!-- end the top -->`
            //         } else {
            //         throw new Error (`Ony one element with the id "${args.ID}" can exist in the document`)
            //         }
            //     } else {
            //         this.pages[args.PAGE].code += `<!-- begin the ${args.ID} --><${args.EL} ><!-- end the top -->`
            //     }
            //     util.stackFrame.startedBranch = true;
            //     util.startBranch(1, true); 
            // }


            //     if (util.stackFrame.startedBranch) {
            //         //do after
            //         this.pages[args.PAGE].code += `</style><!--end my style-->`

            //         util.stackFrame.startedBranch = false; 
            //         return; 
            //     }
            //     //do before
            //         const blockContainer = util.thread.blockContainer;
            //         const currentBlockId = util.thread.peekStack(); //
            //         const currentBlock = blockContainer.getBlock(currentBlockId);
            //         if (currentBlock) {
            //         currentBlock.stylePage = {
            //             page: args.PAGE,
            //             compiledScope: 'global',
            //         };

            //         this.pages[args.PAGE].code += `<!--begin my style--><style>`




            //         }
            //     util.stackFrame.startedBranch = true;
            //     util.startBranch(1, true); 
            // }


            // }
            // }

        }
        property(args, util) {
            if (this.pages.has(args.PAGE)) {
                function containsCssUnit(str) {
                    const cssUnitsPattern = /\d+(?:px|em|rem|ex|ch|vw|vh|vmin|vmax|cm|mm|in|pt|pc|Q|deg|grad|rad|turn|s|ms|Hz|kHz|dpi|dpcm|dppx|%)\b/i;
                    return cssUnitsPattern.test(str);
                }

                // const blockContainer = util.thread.blockContainer;
                // const currentBlockId = util.thread.peekStack();
                // const currentBlock = blockContainer.getBlock(currentBlockId);

                // if (currentBlock) {
                //     if(currentBlock.parent){
                //     const parentBlockId = currentBlock.parent;
                //     const parentBlock = blockContainer.getBlock(parentBlockId);
                let px = this.changePx
                let value = ""
                console.log(px)
                if (px.includes(args.VALUE)) {
                    if (!containsCssUnit(args.VALUE)) {
                        value = `${args.VALUE}px`
                    } else {
                        value = args.VALUE
                    }
                } else {
                    value = args.VALUE
                }

                // if (parentBlock.stylePage && parentBlock) {

                console.log(value)
                if (!this.pages.get(args.PAGE)?.get("code").querySelector("style")) {
                    let body = this.pages.get(args.PAGE)?.get("code").querySelector("head")
                    // console.log(`body is`, body)
                    let el = document.createElement("style")
                    el.innerHTML = `${args.TYPE}element${args.PAGE}${args.NAME}{${args.PROPERTY}:${value};}`
                    el = body.appendChild(el)
                } else {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector("style")
                    el.innerHTML += `${args.TYPE}element${args.PAGE}${args.NAME}{${args.PROPERTY}:${value};}`
                }

                // }

                //     } else {
                //         // throw new Error(`Just clicking this block won't do anything. You have to put it inside of an "add style to" loop first. The shape matches the shape of this block!`)
                //     }
                // }


            }
        }


        remallstyle(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {


            if (this.pages.get(args.PAGE)?.get("code").querySelector(`style`)) {
                let el = this.pages.get(args.PAGE)?.get("code").querySelector(`style`)
                // console.log(`body is`, body)
                el.remove()
            }

            // }
        }

        setAttr(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            if (args.ID !== "") {


                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    let el = this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)
                    // console.log(`body is`, body)
                    if(args.ATTR === "class"){
                        el.setAttribute(args.ATTR, `element${args.PAGE}${args.VAL}`)
                    } else {
                        el.setAttribute(args.ATTR, args.VAL)
                    }

                }
            }
            // }
        }

        ppos(args, util) {
            if ((this.pages).has(args.PAGE)) {
                return (this.pages.get(args.PAGE).get("data").get(args.AXIS))
            } else {
                return ('Page does not exist!')
            }
        }

        movePage(args, util) {
            //if (Object.keys(this.pages).includes(args.PAGE)) {
            return new Promise((resolve, reject) => {
                try {
                    this.pages.get(args.PAGE).get("data").set("x", args.X)
                    this.pages.get(args.PAGE).get("data").set("y", args.Y)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // console.log(key, value)
                            console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });


        }
        resizePage(args, util) {

            return new Promise((resolve, reject) => {
                try {
                    //if (Object.keys(this.pages).includes(args.PAGE)) {
                    this.pages.get(args.PAGE).get("data").set("width", args.X)
                    this.pages.get(args.PAGE).get("data").set("height", args.Y)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // console.log(key, value)
                            console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        resetDefault(args, util) {

            return new Promise((resolve, reject) => {
                try {
                    //if (Object.keys(this.pages).includes(args.PAGE)) {
                    this.pages.get(args.PAGE).get("data").set("width", Number(window.getComputedStyle(Scratch.renderer.canvas.parentElement).width.replace("px", "")) - 10)
                    this.pages.get(args.PAGE).get("data").set("height", Number(window.getComputedStyle(Scratch.renderer.canvas.parentElement).height.replace("px", "")) - 10)
                    this.pages.get(args.PAGE).get("data").set("x", 5)
                    this.pages.get(args.PAGE).get("data").set("y", 5)
                    if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                        const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                        elements.forEach(el => el.remove());
                        const el = document.createElement("iframe");
                        el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                        el.setAttribute("class", `htmlpage display${args.PAGE}`)
                        el.style.position = 'absolute';
                        el.style.pointerEvents = 'auto';
                        el.style.zIndex = '10';
                        el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                        el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                        el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                        el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                        el.style.border = "1px solid black"
                        const container = Scratch.renderer.canvas.parentElement;
                        container.appendChild(el);
                        if (!this.viewing.includes(args.PAGE)) {
                            this.viewing.push(args.PAGE)
                        }
                    }
                    // }

                    el.onload = () => {
                        for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                            // console.log(key, value)
                            console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                            el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                const triggerText = String(key);
                                const triggerTexta = String(args.PAGE);

                                const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                const vm = Scratch.vm;

                                vm.runtime.targets.forEach(target => {
                                    const blocks = target.blocks;
                                    const scripts = blocks.getScripts();

                                    scripts.forEach(rootBlockId => {
                                        const block = blocks.getBlock(rootBlockId);

                                        if (block && block.opcode === targetOpcode) {
                                            let hatValue = '';
                                            let hatValuea = '';

                                            if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                hatValue = block.fields.ID.value;
                                                hatValuea = block.fields.PAGE.value;
                                            }
                                            else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                const inputID = block.inputs.ID;
                                                const inputPAGE = block.inputs.PAGE;

                                                const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                if (shadowBlockID && shadowBlockID.fields) {
                                                    const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                    hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                }
                                                if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                    const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                    hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                }
                                            }

                                            if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                vm.runtime._pushThread(rootBlockId, target);
                                            }
                                        }
                                    });
                                });
                            }

                            )


                        }
                    }
                } catch (error) { }
                resolve();
            });
        }

        spw(args, util) {
            return (window.getComputedStyle(Scratch.renderer.canvas.parentElement)[args.WH].replace("px", ""))
        }

        importHTML(args, util) {

        }

        prettierInText(html) {
            let clean = html.replace(/\s*([<>])\s*/g, '$1').replace(/\s+/g, ' ');
            let reg = /(<[^>]+>)/g;
            let matches = clean.split(reg).filter(Boolean);
            let formatted = '';
            let pad = 0;
            matches.forEach((token) => {
                if (token.match(/<\/\w+/)) {
                    pad--;
                }
                formatted += '  '.repeat(Math.max(0, pad)) + token + '\n';
                if (token.match(/<[^\/][^>]*[^>\/]>/) && !token.match(/<(input|img|br|hr|meta|link)/)) {
                    pad++;
                }
            });
            return formatted.trim();
        }


        getHTML(args, util) {
            if ((this.pages).has(args.PAGE)) {
                let doc = this.pages.get(args.PAGE).get("code")
                let el = toAString.serializeToString(doc)
                // let el = this.pages.get(args.PAGE).get("code");
                let cleanString = el.replace(/<!--[\s\S]*?-->/g, "").replace(/xmlns="[\s\S]*?"/g, "");
                let toChange = `<html><body>${cleanString}</body></html>`

                return (this.prettierInText(cleanString))
            } else {
                return ('Page does not exist!')
            }
        }


        addeve(args, util) {
            let el = this.pages.get(args.PAGE)?.get("code").getElementById(`element${args.PAGE}${args.ID}`);
            if (!el) throw new Error(`An element with the id "${args.ID}" doesn't exist in the page`);
            this.pages.get(args.PAGE)?.get("eves").set(args.ID, args.EVE)
            // console.log(this.pages.get(args.PAGE)?.get("eves"))
        }

        remeve(args) {
            let el = this.pages.get(args.PAGE)?.get("code").getElementById(`element${args.PAGE}${args.ID}`);
            if (!el) return;
            this.pages.get(args.PAGE)?.get("eves").delete(args.ID)


            if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                return new Promise((resolve, reject) => {
                    try {
                        //if (Object.keys(this.pages).includes(args.PAGE)) {
                        if (this.viewing.includes(args.PAGE) && document.querySelector(".htmlpage")) {
                            const elements = document.querySelectorAll(`.htmlpage.display${args.PAGE}`);
                            elements.forEach(el => el.remove());
                            const el = document.createElement("iframe");
                            el.setAttribute("srcdoc", toAString.serializeToString(this.pages.get(args.PAGE).get("code")))
                            el.setAttribute("class", `htmlpage display${args.PAGE}`)
                            el.style.position = 'absolute';
                            el.style.pointerEvents = 'auto';
                            el.style.zIndex = '10';
                            el.style.left = `${this.pages.get(args.PAGE).get("data").get("x")}px`;
                            el.style.top = `${this.pages.get(args.PAGE).get("data").get("y")}px`;
                            el.setAttribute("width", `${this.pages.get(args.PAGE).get("data").get("width")}px`)
                            el.setAttribute("height", `${this.pages.get(args.PAGE).get("data").get("height")}px`)
                            el.style.border = "1px solid black"
                            const container = Scratch.renderer.canvas.parentElement;
                            container.appendChild(el);
                            if (!this.viewing.includes(args.PAGE)) {
                                this.viewing.push(args.PAGE)
                            }
                        }
                        // }

                        el.onload = () => {
                            for (const [key, value] of this.pages.get(args.PAGE)?.get("eves")) {
                                // console.log(key, value)
                                console.log(el.contentDocument.querySelector(`#element${args.PAGE}${key}`))
                                el.contentDocument.querySelector(`#element${args.PAGE}${key}`).addEventListener(value, () => {
                                    const triggerText = String(key);
                                    const triggerTexta = String(args.PAGE);

                                    const targetOpcode = 'scrtwpmhtmldocuments_eve';
                                    const vm = Scratch.vm;

                                    vm.runtime.targets.forEach(target => {
                                        const blocks = target.blocks;
                                        const scripts = blocks.getScripts();

                                        scripts.forEach(rootBlockId => {
                                            const block = blocks.getBlock(rootBlockId);

                                            if (block && block.opcode === targetOpcode) {
                                                let hatValue = '';
                                                let hatValuea = '';

                                                if (block.fields && block.fields.ID && block.fields.PAGE) {
                                                    hatValue = block.fields.ID.value;
                                                    hatValuea = block.fields.PAGE.value;
                                                }
                                                else if (block.inputs && block.inputs.ID && block.inputs.PAGE) {
                                                    const inputID = block.inputs.ID;
                                                    const inputPAGE = block.inputs.PAGE;

                                                    const shadowBlockID = blocks.getBlock(inputID.shadow);
                                                    const shadowBlockPAGE = blocks.getBlock(inputPAGE.shadow);

                                                    if (shadowBlockID && shadowBlockID.fields) {
                                                        const fieldKey = Object.keys(shadowBlockID.fields)[0];
                                                        hatValue = shadowBlockID.fields[fieldKey]?.value || '';
                                                    }
                                                    if (shadowBlockPAGE && shadowBlockPAGE.fields) {
                                                        const fieldKeya = Object.keys(shadowBlockPAGE.fields)[0];
                                                        hatValuea = shadowBlockPAGE.fields[fieldKeya]?.value || '';
                                                    }
                                                }

                                                if (hatValue === triggerText && hatValuea === triggerTexta) {
                                                    vm.runtime._pushThread(rootBlockId, target);
                                                }
                                            }
                                        });
                                    });
                                }

                                )


                            }
                        }
                    } catch (error) { }
                    resolve();
                });
            }
        }

        allEls(args, util) {
            if (this.pages.has(args.PAGE)) {
                const allIds = Array.from(this.pages.get(args.PAGE).get("code").querySelectorAll('[id]:not([id=""])'))
                    .map(element => element.id.replace(`element${args.PAGE}`, ""));
                return (JSON.stringify(allIds));
            } else {
                return ('[]')
            }
        }

        dataEl(args, util) {
            try {
                if (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)) {
                    switch (args.OPTS) {
                        case "children":
                            return ([...this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS]].map(child => child.id).filter(id => id !== ""))
                        case "parentElement":
                            return (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS].getAttribute("id") ?? this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS].tagName)
                        default:
                            if (args.OPTS !== "innerHTML") {
                                if (this.viewing.includes(args.PAGE)) {
                                    return (document.querySelector(`.htmlpage.display${args.PAGE}`).contentDocument.querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS] ?? "")
                                } else {
                                    return ("Display the page to use these.")
                                }
                            } else {
                                return (this.pages.get(args.PAGE)?.get("code").querySelector(`#element${args.PAGE}${args.ID}`)[args.OPTS] ?? "")
                            }

                    }
                } else {
                    return (`An element with the id "${args.ID}" doesn't exist in the page`)
                }
            } catch (error) { return ("") }
        }




        eve() {
            return true;
        }

        current() {
            if (document.querySelector(".htmlpage")) {
                return (JSON.stringify(this.viewing))
            } else {
                return ('[]')
            }
        }
    }

    Scratch.extensions.register(new HTMLDocuments(Scratch.runtime));
})(Scratch);
