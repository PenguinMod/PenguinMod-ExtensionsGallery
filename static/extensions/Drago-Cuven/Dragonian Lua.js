// @ts-nocheck
;(async function (Scratch) {
  if (Scratch.extensions.unsandboxed === false) {
    throw new Error('Sandboxed mode is not supported')
  }

  function waitFinish(script) {
    return new Promise(resolve => {
      script.addEventListener('load', resolve)
    })
  }

  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/ace-builds@1.36.2/src-min/ace.js'
  document.head.appendChild(script)
  await waitFinish(script)

  Scratch.gui.getBlockly().then(ScratchBlocks => {
    ScratchBlocks._LightenDarkenColor = function (col, amt) {
      const num = parseInt(col.replace('#', ''), 16)
      const r = (num >> 16) + amt
      const b = ((num >> 8) & 0x00ff) + amt
      const g = (num & 0x0000ff) + amt
      const newColor = g | (b << 8) | (r << 16)
      return (col.at(0) === '#' ? '#' : '') + newColor.toString(16)
    }
    function _setCssNattr(node, attr, value) {
      node.setAttribute(attr, String(value))
      node.style[attr] = value
    }
    function _delCssNattr(node, attr) {
      node.removeAttribute(attr)
      delete node.style[attr]
    }

    // These should NEVER be called without ScratchBlocks existing
    function _fixColours(doText, col1, textColor) {
      const LDA = -10
      const LDC = ScratchBlocks._LightenDarkenColor
      const self = this.sourceBlock_
      const parent = self?.parentBlock_
      if (!parent) return
      const path = self?.svgPath_
      const argumentSvg = path?.parentNode
      const textNode = argumentSvg.querySelector('g.blocklyEditableText text')
      const oldFirstColour = parent.colour_
      self.colour_ = col1 ?? LDC(parent.colour_, LDA)
      self.colourSecondary_ = LDC(parent.colourSecondary_, LDA)
      self.colourTertiary_ = LDC(parent.colourTertiary_, LDA)
      self.colourQuaternary_ = LDC(
        parent?.colourQuaternary_ ?? oldFirstColour,
        LDA
      )
      _setCssNattr(path, 'fill', self.colour_)
      _setCssNattr(path, 'stroke', self.colourTertiary_)
      if (doText && textNode)
        _setCssNattr(textNode, 'fill', textColor ?? '#FFFFFF')
    }
    const _endBlockDrag = ScratchBlocks.BlockDragger.prototype.endBlockDrag
    ScratchBlocks.BlockDragger.prototype.endBlockDrag = function (a, b) {
      _endBlockDrag.call(this, a, b)
      for (const childBlock of this.draggingBlock_.childBlocks_) {
        if (
          childBlock.inputList.length === 1 &&
          childBlock.inputList[0].fieldRow.length === 1 &&
          childBlock.inputList[0].fieldRow[0]
        ) {
          const field = childBlock.inputList[0].fieldRow[0]
          if (field.constructor.inline === true) {
            childBlock.render()
          }
          if (!field.constructor.acceptReporters === false) {
            childBlock.outputConnection.targetConnection.setHidden(true)
          }
        }
      }
    }
    // based on https://github.com/LLK/scratch-blocks/blob/893c7e7ad5bfb416eaed75d9a1c93bdce84e36ab/core/field_angle.js
    class FieldAceEditor extends ScratchBlocks.Field {
      static inline = true
      static acceptReporters = true
      constructor(opt_value) {
        opt_value = opt_value && !isNaN(opt_value) ? String(opt_value) : '0'
        super(opt_value)
        this.addArgType('String')
        this.addArgType('aceeditor')
      }
      updateWidth() {
        if (this._textarea) {
          const width = this._textarea.offsetWidth + 1,
            height = this._textarea.offsetHeight + 1
          this._textareaHolder.setAttribute('width', String(width + 3))
          this._textareaHolder.setAttribute('height', String(height + 3))
          this.size_.width = width + 8
          this.size_.height = height + 16
        }
      }
      dispose() {
        super.dispose()
        this.editorInstance.destroy()
        delete this.editorInstance
      }
      init(...initArgs) {
        ScratchBlocks.Field.prototype.init.call(this, ...initArgs)
        const textNode = this.sourceBlock_.svgPath_.parentNode.querySelector(
          'g.blocklyEditableText text'
        )
        if (textNode) textNode.style.display = 'none'
        if (this.sourceBlock_.parentBlock_)
          _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_)
        const textareaHolder = document.createElementNS(
          'http://www.w3.org/2000/svg',
          'foreignObject'
        )
        textareaHolder.setAttribute('x', '16')
        textareaHolder.setAttribute('y', '8')
        textareaHolder.addEventListener('mousedown', e => e.stopPropagation())
        const div = document.createElement('div')
        div.textContent = this.getValue()
        if (this.editorInstance) this.editorInstance.destroy()
        div.style.width = '500px'
        div.style.height = '300px'
        this.editorInstance = window.ace.edit(div, {
          mode: 'ace/mode/lua',
          selectionStyle: 'text'
        })
        this.editorInstance.session.on('change', () => {
          const value = this.editorInstance.getValue()
          this.setValue(value)
        })
        // div.addEventListener('input', () => this._onInput())
        if (this.fieldGroup_) {
          this.fieldGroup_.insertAdjacentElement('afterend', textareaHolder)
          textareaHolder.appendChild(div)
          this._textareaHolder = textareaHolder
          this._textarea = div
        }
        this.sourceBlock_.outputConnection.x_ -= 16
        this.sourceBlock_.outputConnection.y_ -= 8
      }
      showEditor_() {}
    }
    ScratchBlocks.Field.register('field_DragonianLua_aceeditor', {
      fromJson(args) {
        return new FieldAceEditor(args['aceeditor'])
      }
    })
  })
  const { LuaFactory } = await import(
    'https://cdn.jsdelivr.net/npm/wasmoon@1.16.0/+esm'
  )

  async function resetLua() {
    lua.global.close()
    const threads = vm.runtime.threads
    //pause
    const oldStatus = []
    for (var i = 0; i < threads.length; i++) {
      const thisThread = threads[i]
      oldStatus.push(thisThread.status)
      thisThread.status = 5
    }
    //readd system
    const lua = await factory.createEngine()
    // jscmdinlua()
    //unpause
    for (var i = 0; i < threads.length; i++) {
      threads[i].status = oldStatus[i]
    }
  }

  const factory = new LuaFactory()
  const lua = await factory.createEngine()

  const _getVarObjectFromName = (name, util, type) => {
    const stageTarget = runtime.getTargetForStage()
    const target = util.target
    let listObject = Object.create(null)

    listObject = stageTarget.lookupVariableByNameAndType(name, type)
    if (listObject) return listObject
    listObject = target.lookupVariableByNameAndType(name, type)
    if (listObject) return listObject
  }

  // Scratch devs forgot to add functionality to change color1, color2, color3
  // for custom fields separately from the category colors, even though
  // it is important feature used by almost all default inputs. Example:
  // https://github.com/LLK/scratch-blocks/blob/bdfeaef0f2021997b85385253604690aa24f299a/blocks_common/math.js#L52-L54
  const vm = Scratch.vm
  const runtime = vm.runtime
  // const bcfi = runtime._buildCustomFieldInfo.bind(runtime)
  // const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime)
  // let fi = null
  // runtime._buildCustomFieldInfo = function (
  //   fieldName,
  //   fieldInfo,
  //   extensionId,
  //   categoryInfo
  // ) {
  //   fi = fieldInfo
  //   return bcfi(fieldName, fieldInfo, extensionId, categoryInfo)
  // }
  // runtime._buildCustomFieldTypeForScratchBlocks = function (
  //   fieldName,
  //   output,
  //   outputShape,
  //   categoryInfo
  // ) {
  //   let res = bcftfsb(fieldName, output, outputShape, categoryInfo)
  //   if (fi) {
  //     if (fi.color1) res.json.colour = fi.color1
  //     if (fi.color2) res.json.colourSecondary = fi.color2
  //     if (fi.color3) res.json.colourTertiary = fi.color3
  //     fi = null
  //   }
  //   return res
  // }
  // @ts-ignore
  const cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime)
  // @ts-ignore
  runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
    const res = cbfsb(blockInfo, categoryInfo)
    if (blockInfo.outputShape) {
      res.json.outputShape = blockInfo.outputShape
    }
    return res
  }

  // Your extension's code
  class DragonianLua {
    runtime
    constructor(runtime) {
      Scratch.vm.runtime.on('PROJECT_START', () => resetLua())
      Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => resetLua())
      this.runtime = runtime
    }
    getInfo() {
      return {
        id: 'DragonianLua',
        name: 'Lua',
        color1: '#0b0080',
        color2: '#00006b',
        blocks: [
          {
            blockType: Scratch.BlockType.REPORTER,
            outputShape: 3,
            opcode: 'runLuaReporter',
            text: 'Run Lua code [code]',
            arguments: {
              code: {
                type: 'aceeditor',
                defaultValue: `--setScratchVar("variable", "value", is a list?) \nsetScratchVar("my variable", "Success!", false) \nreturn(getScratchVar("my variable"))` //#ff0000,
              }
            }
          },
          {
            blockType: Scratch.BlockType.COMMAND,
            outputShape: 3,
            opcode: 'runLua',
            text: 'Run Lua code [code]',
            arguments: {
              code: {
                type: 'aceeditor',
                defaultValue: `--setScratchVar("variable", "value", is a list?) \nsetScratchVar("my variable", "It works!", false) \nprint(getScratchVar("my variable"))` //#ff0000,
              }
            }
          },
          {
            opcode: 'executeblock',
            blockType: Scratch.BlockType.COMMAND,
            text: 'execute [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "print('hello world')"
              }
            }
          },
          {
            opcode: 'executereporter',
            blockType: Scratch.BlockType.REPORTER,
            text: 'evaluate [CODE]',
            arguments: {
              CODE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'return 1+1'
              }
            }
          }
        ],
        customFieldTypes: {
          aceeditor: {
            output: 'string',
            outputShape: 3
          }
        }
      }
    }

    async runLuaReporter({ code }, util) {
      lua.global.set('setScratchVar', (varName, value, isList) => {
        isList = isList || false
        _getVarObjectFromName(varName, util, isList ? 'list' : '').value = value
      })

      lua.global.set('getScratchVar', (varName, isList) => {
        isList = isList || false
        return _getVarObjectFromName(varName, isList ? 'list' : '').value
      })
      const returnValue = await lua.doString(code)
      return returnValue
    }
    async runLua({ code }, util) {
      lua.global.set('setScratchVar', (varName, value, isList) => {
        isList = isList || false
        _getVarObjectFromName(varName, util, isList ? 'list' : '').value = value
      })

      lua.global.set('getScratchVar', (varName, isList) => {
        isList = isList || false
        return _getVarObjectFromName(varName, isList ? 'list' : '').value
      })
      const script = await lua.doString(code)
    }
    async executeblock(args, util) {
      lua.global.set('setScratchVar', (varName, value, isList) => {
        isList = isList || false
        _getVarObjectFromName(varName, util, isList ? 'list' : '').value = value
      })

      lua.global.set('getScratchVar', (varName, isList) => {
        isList = isList || false
        return _getVarObjectFromName(varName, isList ? 'list' : '').value
      })
      const script = await lua.doString(args.CODE)
    }
    async executereporter(args, util) {
      lua.global.set('setScratchVar', (varName, value, isList) => {
        isList = isList || false
        _getVarObjectFromName(varName, util, isList ? 'list' : '').value = value
      })

      lua.global.set('getScratchVar', (varName, isList) => {
        isList = isList || false
        return _getVarObjectFromName(varName, isList ? 'list' : '').value
      })

      const returnValue = await lua.doString(args.CODE)
      return returnValue
    }
  }
  // The following snippet ensures compatibility with Turbowarp / Gandi IDE. If you want to write Turbowarp-only or Gandi-IDE code, please remove corresponding code
  if (Scratch.vm?.runtime) {
    // For Turbowarp
    Scratch.extensions.register(new DragonianLua(Scratch.runtime))
  }
})(Scratch)
