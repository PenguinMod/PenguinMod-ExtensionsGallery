// Name: Project Interfaces
// ID: lordcatprojectinterfaces
// Description: Easily create more interactive projects!
// By: LordCat0
// Licence: MIT
(function(Scratch){
    console.log("Lordcat project interfaces")
    if(!Scratch.extensions.unsandboxed){alert("This extension must run unsandboxed!"); return}
    const extIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAAAXNSR0IB2cksfwAAAAlwSFlzAAE69gABOvYBOrFXOgAAAAZQTFRFAAAAcH7/bShqagAAAAJ0Uk5TAP9bkSK1AAACUUlEQVR4nO3dW04DMQyF4Q4gwRvsAHYCO6PdGewEdkDfQALKOJnpBahofCx5VP5I5Yl8VImTqRAcdzNxdAAAAAAAAAAAAAAAAP8AuH5qmre8+gacvzb+5Me7XeB+3gh8nO0AzW9g/RYG4PahGXi72AK6z+b566kxgGMJxkWoQGMR1FFLoQIrx/zZ6mQNuJZgnGtfXEswLEIM4FrDYRUL0HwQ6ijHoQCuTRi2wYDTdx9QJtvr8sUJPN8EAc5NqNtggOMyqMOuBAOcu1j30QDnLtZ97IRdnM0WcwOcJ8FGfxoiAHcZlEKIANx1VCqpE+qoVFIn1FGppCkAzju9jn66UslWywGAUMlWywGAUMlWywGAcBTsMAQAwlmy09QplWy1HAC4L3Ubq5MJANJp7s/zMQDSfdLfKBMApAupv5IAekC6U/tbFWASgPRgmgKwBABoBsbfn219QAcAAAAAAAAAAAAAAIgBfhkAAAAAAAAAAAAAAAAAAAAAAAAAOcBivuf79v4JIQAAAAAAAAAAAAAAwIFA+wAAAAAAAJg08PPZ+Nc/oQIAAAAAAAAAAAAAABwItA8AgBAgIA8lPxMGIADIT2g6AiA/K0wG8hPb8oH85D4dyM9PlCMgpUdTSIplfpJnfpppfqKrHEqbn6urA3I4sXAYajxyfsJzfsq1HNQtR4XrYeVyXLq7ksbA9vzMefeVMsbmy8H9eusA5zZsmhfk919wHqdNCwm5iYXeRkNu5JHfi0Rup6I3dJFbyuhNbeS2Ou4BAAAAAAAAAAAAAABwxMAXm3stnfulMqUAAAAASUVORK5CYII='
    const textIcon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIAAQMAAADOtka5AAAAAXNSR0IB2cksfwAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAZQTFRFAAAA////pdmf3QAAAAJ0Uk5TAP9bkSK1AAADbElEQVR4nO3dQW7bMBCFYbkp0O7aG0S7HKMFcrDEN0tuEt0g2TVAHVeQ6THJkYaiJw6D4tfGBi18kjgkTW/8Nl1+XP09vL5+jxqvnw6vj7/z0zcK+PHcqZOPaPfyswz8eghvdl+l7e5ety0Ce3kntyA3MHO+bniTt9ILxx4Yj+19lx4KiK4mH8oTzPSiAr79Ob0PZ8fm0JcAKUInfT7TZADR8x77XOrSZaOjCIRP91FLGYgvd+iEuAv0QLCB6YnjLlgBRCULN5w81P5LFTCdrltMYK8+1i0VwNiLSR9WA0OfDM16YCxDUoRqYKxaUtdqYOz0pAjVwPi5aqgDttu3tKEWeLxNq1gNDDdpFauBl+u0itXA682TD9jdPviAfb6OF4Fs3Ci/bj1oAmRzJz8qF9VzgGQJ1Uf5eyFbP/Kj/NWWrWD5MfQXB7JFOD/K+4N8LJfO14A5ktQ4mgHMOqoqzgBmLw59GTA7QZ8+A8zeiL50CUgnhd6hloHkFhZvwACSvlg+zQCiZ1h+AguI5qXe5a8Bolmhf2esAaJ9u9qjrwJOs0LPgHXA3G+XKkCmlZ5C6wApg1EEE5AyGEW4LCB1NKpoAjIbzKtYQBgI1jCwgTAQrGFgA2EgWMPgwkAYSdY4ujAQlsWhPxcIQ9EaiB8DWCPZBsJkaAiE2WRf5JMD03w2Z/P/D0xLkrkgAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAB8NqD9v1y3B9r/27kXaP+f8+6/zW//z//u8IL2+QvtMyimBamwJJmAO8jDGyXiDjNpn8fijpRxh9qEYWAPBAvwBvu4o4Xc4UbueCXpQ7MXDcAbMeUOuYqewHqGRcAR9OWNGnOHnbnj1tyBb97IOXfoXfvcPnf0oDv8MJkC+lCT4v2B9hmWbsAdBPreUaTuMFR3HKs7ENYdSesOxfXG8rqDgXfeaGJ3OPLgjWd2B0Rv8pYPCMl2x3QnVTsnKDwBzokqd4elF+Lay99M7sB4d2R9dLaULCpteX8Q7dGlw6J+Uft2a4sjVzvd1Zo90tzvFOO3iwakz6PHlVvQ+/6ZrWfohGTIHHtB/3T5Bx4eQT0z7Oa2AAAAAElFTkSuQmCC'
    const imageIcon = 'data:image/png;base64,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'
    const videoIcon = 'data:image/png;base64,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'
    const inputIcon = 'data:image/png;base64,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'
    const vm = Scratch.vm
    const elementbox = document.createElement('div')
    elementbox.classList.add('LordCatInterfaces')
    vm.renderer.addOverlay(elementbox, "scale")
    const datauri = (file) => {
        return new Promise((resolve, reject) => {
            if(!(file instanceof File)) resolve('')
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = () => resolve(reader.result)
            reader.onerror = () => reject(reader.error)
        })
    }
    let elements = {}
    let metadata = {}
    const fonts = []
    document.fonts.ready.then(() => {document.fonts.forEach(font => fonts.push(font.family));});
    class lordcatprojectinterfaces{
    getInfo(){return{
        id: "lordcatprojectinterfaces",
        name: "Project interfaces",
        color1: "#707eff",
        color2: "#6675fa",
        menuIconURI: extIcon,
        blocks: [{
            opcode: "ClearAll",
            text: "Clear all elements",
            blockType: Scratch.BlockType.COMMAND
            },{
            opcode: "Create",
            text: "Create [type] element with ID [id]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {type: {type: Scratch.ArgumentType.STRING, menu: 'ElementType'}, id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "Delete",
            text: "Delete element with ID [id]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "Position",
            text: "Set position of ID [id] to x: [x] y: [y]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, x: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0}, y: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0}}
            },{
            opcode: "Direction",
            text: "Set direction of ID [id] to [dir]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, dir: {type: Scratch.ArgumentType.NUMBER, defaultValue: 90}}
            },{
            opcode: "Scale",
            text: "Set scale of ID [id] to width: [width]px height: [height]px",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, width: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}, height: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}}
            },{
            opcode: "Layer",
            text: "Set layer of ID [id] to [layer]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, layer: {type: Scratch.ArgumentType.NUMBER, defaultValue: 1}}
            },{
            opcode: "Cursor",
            text: "Set hover cursor of ID [id] to [cursor]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, cursor: {type: Scratch.ArgumentType.STRING, menu: 'Cursors'}}
            },{
            opcode: "Color",
            text: "Set color of ID [id] to [color]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, color: {type: Scratch.ArgumentType.COLOR}}
            },{
            opcode: "BackgroundColor",
            text: "Set background color of ID [id] to [color]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, color: {type: Scratch.ArgumentType.COLOR}}
            },{
            opcode: "CustomCSS",
            text: "Set custom CSS of [id] to [css]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, css: {type: Scratch.ArgumentType.STRING, defaultValue: 'background-color: red'}}
            },{
            opcode: "HtmlElement",
            text: "Create html element [htmltag] with ID [id]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, htmltag: {type: Scratch.ArgumentType.STRING, defaultValue: 'h1'}}
            },{
            opcode: "HtmlAttribute",
            text: "Set html attribute [attribute] of [id] to [attributevalue]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, attribute: {type: Scratch.ArgumentType.STRING, defaultValue: "readonly"}, attributevalue: {type: Scratch.ArgumentType.STRING, defaultValue: "true"}}
            },"---",{
            opcode: "WhenClicked",
            text: "When ID [id] is clicked",
            blockType: Scratch.BlockType.HAT,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "Attribute",
            text: "[attr] of ID [id]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {attr: {type: Scratch.ArgumentType.STRING, menu: "Attributes"}, id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            opcode: "IsHovered",
            text: "[id] hovered?",
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}}
            },{
            blockType: Scratch.BlockType.LABEL,text: "Labels"},{
            opcode: "LabelText",
            text: "Set label text with ID [id] to [text]",
            arguments: {text: {type: Scratch.ArgumentType.STRING, defaultValue: "Hello world!"}, id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}},
            blockIconURI: textIcon
            },{
            opcode: "LabelAlign",
            text: "Set label alignment with ID [id] to [align]",
            arguments: {align: {type: Scratch.ArgumentType.STRING, menu: "Alignment"}, id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}},
            blockIconURI: textIcon
            },{
            opcode: "LabelFontSize",
            text: "Set label font size with ID [id] to [size]px",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, size: {type: Scratch.ArgumentType.NUMBER, defaultValue: 40}},
            blockIconURI: textIcon
            },{
            opcode: "LabelFont",
            text: "Set label font with ID [id] to [font]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, font: {type: Scratch.ArgumentType.STRING, menu: 'Fonts'}},
            blockIconURI: textIcon
            },{blockType: Scratch.BlockType.LABEL, text: "Images"
            },{
            opcode: "ImageUrl",
            text: "Set image with ID [id] to url [url]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, url: {type: Scratch.ArgumentType.STRING, defaultValue: 'https://extensions.turbowarp.org/dango.png'}},
            blockIconURI: imageIcon
            },{
            opcode: "ImageCostume",
            text: "Set image with ID [id] to costume [costume]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, costume: {type: Scratch.ArgumentType.COSTUME}},
            blockIconURI: imageIcon
            },{blockType: Scratch.BlockType.LABEL,text: "Videos"
            },{
            opcode: "VideoSource",
            text: "Set video with ID [id] to url [url]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}, url: {type: Scratch.ArgumentType.STRING, defaultValue: 'https://extensions.turbowarp.org/dango.png'}},
            blockIconURI: videoIcon
            },{
            opcode: "VideoControl",
            text: "[control] video with ID [id]",
            arguments: {control: {type: Scratch.ArgumentType.STRING, menu: 'VideoControls'}, id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}},
            blockIconURI: videoIcon
            },{
            opcode: "VideoVolume",
            text: "Set volume of video [id] to [volume]%",
            arguments: {volume: {type: Scratch.ArgumentType.NUMBER, defaultValue: 100}, id: {type: Scratch.ArgumentType.STRING, defaultValue: 'My element'}},
            blockIconURI: videoIcon
            },{
            opcode: "VideoLoop",
            text: "Set loop of video [id] to [toggle]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, toggle: {type: Scratch.ArgumentType.STRING, menu: "EnableDisable"}},
            blockIconURI: videoIcon
            },{
            opcode: "VideoHtmlControls",
            text: "Set video controls of ID [id] to [toggle]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, toggle: {type: Scratch.ArgumentType.STRING, menu: "EnableDisable"}},
            blockIconURI: videoIcon
            },{blockType: Scratch.BlockType.LABEL, text: "Inputs"
            },{
            opcode: "InputType",
            text: "Set input type of ID [id] to [input]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, input: {type: Scratch.ArgumentType.STRING, menu: 'Inputs'}},
            blockIconURI: inputIcon
            },{
            opcode: "InputPlaceholder",
            text: "Set placeholder of ID [id] to [placeholder]",
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}, placeholder: {type: Scratch.ArgumentType.STRING, defaultValue: "Hello world!"}},
            blockIconURI: inputIcon
            },{
            opcode: "InputValue",
            text: "Value of input with id [id]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {id: {type: Scratch.ArgumentType.STRING, defaultValue: "My element"}},
            blockIconURI: inputIcon
            }
        ],
        menus: {ElementType: {acceptReporters: false,items: ["Label", "Image", "Video", "Input", "Box"]},
            Inputs: {acceptReporters: false,items: ["Text", "Number", "Color", "File", "Email", "Range", "Image"]},
            Cursors: {acceptReporters: false,items: ["default", "pointer", "text", "wait", "move", "not-allowed", "crosshair","help", "progress", "grab", "grabbing"]},
            Fonts: {acceptReporters: true, items: fonts},
            Attributes: {acceptReporters: false, items: ['X', "Y", "Direction", "Width", "Height", "Cursor", "Source"]},
            VideoControls: {acceptReporters: false, items: ["Play", "Stop", "Pause"]},
            EnableDisable: {acceptReporters: false, items: ["Enabled", "Disabled"]},
            Alignment: {acceptReporters: false, items: ["Left", "Right", "Center"]}}
    }}
    FixPos(elementid){
        setTimeout(() => {
            if(!elements[elementid]){console.warn(`FixPos exception: ${elementid}`); return}
            this.Position({id: elementid, x: metadata[elementid].x, y: metadata[elementid].y})
        }, 1) // Timeout needed because for some reason it wont run otherwise..
    }
    ClearAll(){
        elements = {}
        metadata = {}
        elementbox.innerHTML = ''
    }
    Create(args){
        if(elements[args.id]) return
        const lookup = {Label: "span", Video: "video", Image: "img", Input: "input", Box: "div"}
        const element = document.createElement(lookup[args.type])
        const boundingRect = element.getBoundingClientRect()
        element.dataset.id = args.id
        element.style.position = 'absolute'
        element.style.pointerEvents = 'auto'
        element.style.userSelect = 'none'
        element.style.color = 'black'
        if(args.type == 'Image'){element.draggable = false}
        elements[args.id] = element
        elementbox.append(element)
        metadata[args.id] = {x: 0, y: 0, direction: 90, width: boundingRect.width, height: boundingRect.height, hovered: false, clicked: false}
        this.FixPos(args.id)
        element.addEventListener("mouseover", () => metadata[args.id].hovered = true)
        element.addEventListener("mouseout", () => metadata[args.id].hovered = false)
        element.addEventListener("click", () => metadata[args.id].clicked = true)
    }
    Position(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        element.style.left = `${(vm.runtime.stageWidth/2) + args.x - (element.offsetWidth/2)}px`
        element.style.top = `${(vm.runtime.stageHeight/2) - args.y - (element.offsetHeight/2)}px`
        metadata[args.id].x = args.x
        metadata[args.id].y = args.y
    }
    Direction(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        element.style.transform = `rotate(${args.dir - 90}deg)`
        metadata[args.id].direction = args.dir
    }
    Scale(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        element.style.width = `${args.width}px`
        element.style.height = `${args.height}px`
        metadata[args.id].width = args.width + 'px'
        metadata[args.id].height = args.height + 'px'
        element.style.objectFit = 'fill'
        this.FixPos(args.id)
    }
    Layer(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        element.style.zIndex = args.layer
    }
    Cursor(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        console.log(args.cursor)
        element.style.cursor = args.cursor
    }
    Color(args){
        if(!elements[args.id]){return}
        if(elements[args.id].tagName == 'DIV'){elements[args.id].style.backgroundColor = args.color; return} // for people who are confused why 'color' doesnt work with div/box elements
        elements[args.id].style.color = args.color
    }
    BackgroundColor(args){
        if(!elements[args.id]){return}
        elements[args.id].style.backgroundColor = args.color
    }
    CustomCSS(args){
        if(!elements[args.id]){return}
        const element = elements[args.id]
        let style = document.getElementById(`LCGuiStyle_${args.id}`)
        let lines = args.css.split(";")
        if(!style){
            style = document.createElement('style')
            style.id = `LCGuiStyle_${args.id}`
            document.head.append(style)
        }
        style.textContent = `[data-id='${args.id}']{\n${lines.join(" !important;\n") + " !important"}\n}`
    }
    HtmlElement(args){
        if(elements[args.id]) return
        const element = document.createElement(args.htmltag.toLowerCase())
        const boundingRect = element.getBoundingClientRect()
        element.dataset.id = args.id
        element.style.position = 'absolute'
        element.style.pointerEvents = 'auto'
        element.style.userSelect = 'none'
        element.style.color = 'black'
        elements[args.id] = element
        elementbox.append(element)
        metadata[args.id] = {x: 0, y: 0, direction: 90, width: boundingRect.width, height: boundingRect.height, hovered: false, clicked: false}
        this.FixPos(args.id)
        element.addEventListener("mouseover", () => metadata[args.id].hovered = true)
        element.addEventListener("mouseout", () => metadata[args.id].hovered = false)
        element.addEventListener("click", () => metadata[args.id].clicked = true)
    }
    HtmlAttribute(args){
        const element = elements[args.id]
        if(!element) return
        if(args.attributevalue === 'false' || args.attributevalue === ''){element.removeAttribute(args.attribute); return}
        element.setAttribute(args.attribute, args.attributevalue)
    }
    Attribute(args){
        const element = elements[args.id]
        if(!element) return
        const meta = metadata[args.id]
        switch(args.attr){
           case 'Cursor':
                return element.style.cursor
            case 'Source':
                if(element.tagName != 'IMG' && element.tagName != 'VIDEO') return
                return element.src
            default:
                return meta[args.attr.toLowerCase()]
        }
    }
    IsHovered(args){
        if(!elements[args.id]){return ''}
        return metadata[args.id].hovered
    }
    Delete(args){
        if(!elements[args.id]){return}
        if(document.getElementById(`LCGuiStyle_${args.id}`)){document.getElementById(`LCGuiStyle_${args.id}`).remove()}
        elements[args.id].remove()
        delete elements[args.id]
        delete metadata[args.id]
    }
    LabelText(args){
        if(!elements[args.id] || elements[args.id].tagName != "SPAN"){return}
        elements[args.id].textContent = args.text
        this.FixPos(args.id)
    }
    LabelAlign(args){
        if(!elements[args.id] || elements[args.id].tagName != "SPAN"){return}
        elements[args.id].style.textAlign = args.align.toLowerCase()
    }
    LabelFontSize(args){
        if(!elements[args.id] || elements[args.id].tagName != "SPAN"){return}
        elements[args.id].style.fontSize = `${args.size}px`
        this.FixPos(args.id)
    }
    LabelFont(args){
        if(!elements[args.id] || elements[args.id].tagName != "SPAN"){return}
        elements[args.id].style.fontFamily = args.font
    }
    ImageUrl(args){
        if(!elements[args.id] || elements[args.id].tagName != "IMG"){return}
        elements[args.id].src = args.url
        this.FixPos(args.id)
    }
    ImageCostume(args, util){
        if(!elements[args.id] || elements[args.id].tagName != "IMG"){return}
        const target = util.target
        console.log(target)
        const costumeIndex = target.getCostumeIndexByName("costume1")//Scratch.Cast.toString(args.COSTUME))
        console.log(costumeIndex)
        const costume = target.sprite.costumes[costumeIndex]
        console.log(costume)
        elements[args.id].src = costume.asset.encodeDataURI()
        this.FixPos(args.id)
    }
    InputType(args){
        if(!elements[args.id] || elements[args.id].tagName != "INPUT"){return}
        elements[args.id].type = args.input
        if(args.input == 'File'){elements[args.id].value = null}
        this.FixPos(args.id)
    }
    InputPlaceholder(args){
        if(!elements[args.id] || elements[args.id].tagName != "INPUT"){return}
        elements[args.id].setAttribute('placeholder', args.placeholder)
    }
    async InputValue(args){
        const element = elements[args.id]
        if(!element || element.tagName != "INPUT"){return}
        return (element.type == 'file' ? await datauri(element.files[0]) : element.value)
    }
    WhenClicked(args){
        //This isnt ideal, but its basically the only option we have
        if(!metadata[args.id]) return false
        if(metadata[args.id].clicked){return new Promise((res, rej) => {
            setTimeout(() => {metadata[args.id].clicked = false; res(true)}, 1)
        })}
        return false
    }
    VideoSource(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        element.src = args.url
        this.FixPos(args.id)
    }
    VideoControl(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        switch(args.control){
            case 'Play':
                element.play()
                break;
            case 'Stop':
                element.pause()
                element.currentTime = 0
                break;
            case 'Pause':
                element.pause()
                break;
        }
    }
    VideoVolume(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        element.volume = (args.volume / 100)
    }
    VideoHtmlControls(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        switch(args.toggle){
            case 'Enabled':
                element.setAttribute("controls", "true")
                break;
            case 'Disabled':
                element.removeAttribute("controls")
                break;
        }
    }
    VideoLoop(args){
        const element = elements[args.id]
        if(!element || element.tagName != "VIDEO") return
        element.loop = (args.toggle == "Enabled")
    }
    }
    Scratch.extensions.register(new lordcatprojectinterfaces())
})(Scratch)
