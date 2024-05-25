/*!
 * Created by 0znzw | v1.2
 * Licensed Under MIT & LGPLv3 License.
 * DO NOT REMOVE THIS COMMENT
 */
(async function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"More Fields" must be ran unsandboxed.`);
  }

  const vm = Scratch.vm;
  const runtime = vm.runtime;

  // Some checks
  const DOOMcheck = (vm.runtime.ioDevices.userData._username === 'DOOM1997');
  // IDK maybe they are not on web or smth (or webkit cause yeah).
  const _URLSearchParams = (window.URLSearchParams ?? class {
    has() {return(false)}
    get() {return('')};
  });
  const searchParams = new _URLSearchParams(window.location.search);
  const hideInlineTextarea = !searchParams.has('MoreFields_InlineTextarea');

  // "Constants"
  const customFieldTypes = {};
  let Blockly = null; // Blockly is used cause Its easier than ScratchBlocks imo, it does not make a difference.

  // Me being lazy
  function _setCssNattr(node, attr, value) {
    node.setAttribute(attr, String(value));
    node.style[attr] = value;
  }
  function _delCssNattr(node, attr) {
    node.removeAttribute(attr);
    delete node.style[attr];
  }

  // These should NEVER be called without ScratchBlocks existing
  function _fixColours(doText, col1, textColor) {
    const LDA = -10;
    const LDC = Blockly._LightenDarkenColor;
    const self = this.sourceBlock_;
    const parent = self?.parentBlock_;
    if (!parent) return;
    const path = self?.svgPath_;
    const argumentSvg = path?.parentNode;
    const textNode = argumentSvg.querySelector('g.blocklyEditableText text');
    const oldFirstColour = parent.colour_;
    self.colour_ = (col1 ?? LDC(parent.colour_, LDA));
    self.colourSecondary_ = LDC(parent.colourSecondary_, LDA);
    self.colourTertiary_ = LDC(parent.colourTertiary_, LDA);
    self.colourQuaternary_ = LDC(parent?.colourQuaternary_ ?? oldFirstColour, LDA);
    _setCssNattr(path, 'fill', self.colour_);
    _setCssNattr(path, 'stroke', self.colourTertiary_);
    if (doText && textNode) _setCssNattr(textNode, 'fill', textColor ?? '#FFFFFF');
  }
  function _moveDropdown(toArgument) {
    toArgument = toArgument ?? false;
    Blockly.DropDownDiv.showPositionedByBlock(this, (toArgument ? this.sourceBlock_ : this.sourceBlock_.parentBlock_));
  }
  function _disableReporters() {
    const block = this?.sourceBlock_?.parentBlock_;
    if (!block) return;
    // "i" is the index in block.inputList of the current rendered connection
    // todo: fix the index cause its always the last input :skull:
    let i = -1, found = false;
    block.inputList.find(input => {
      if (found) return false;
      found = (input.connection == this || input == this.sourceBlock_);
      i++;
      return found;
    });
    const connection = block.inputList?.[i]?.connection;
    if (i < 0 || !connection) return;
    // Lmao your wrong.
    connection.check_ = [];
  }

  // https://github.com/Xeltalliv/extensions/blob/examples/examples/custom-field-types.js
  const bcfi = runtime._buildCustomFieldInfo.bind(runtime);
  const bcftfsb = runtime._buildCustomFieldTypeForScratchBlocks.bind(runtime);
  let fi = null;
  runtime._buildCustomFieldInfo = function (fieldName, fieldInfo, extensionId, categoryInfo) {
    fi = fieldInfo;
    return bcfi(fieldName, fieldInfo, extensionId, categoryInfo);
  };
  runtime._buildCustomFieldTypeForScratchBlocks = function (fieldName, output, outputShape, categoryInfo) {
    let res = bcftfsb(fieldName, output, outputShape, categoryInfo);
    if (fi) {
      if (fi.color1) res.json.colour = fi.color1;
      if (fi.color2) res.json.colourSecondary = fi.color2;
      if (fi.color3) res.json.colourTertiary = fi.color3;
      fi = null;
    }
    return res;
  };

  const toRegisterOnBlocklyGot = [];

  // https://github.com/LLK/scratch-vm/blob/f405e59d01a8f9c0e3e986fb5276667a8a3c7d40/test/unit/extension_conversion.js#L85-L124
  // https://github.com/LLK/scratch-vm/commit/ceaa3c7857b79459ccd1b14d548528e4511209e7
  vm.addListener('EXTENSION_FIELD_ADDED', (fieldInfo) => {
    console.log('EXTENSION_FIELD_ADDED', fieldInfo, Blockly);
    if (Blockly) Blockly.Field.register(fieldInfo.name, fieldInfo.implementation);
    else toRegisterOnBlocklyGot.push([fieldInfo.name, fieldInfo.implementation]);
  });

  // ArgumentType additions
  Scratch.ArgumentType.TEXTAREA = 'TextareaInput';
  Scratch.ArgumentType.INLINETEXTAREA = 'TextareaInputInline';
  Scratch.ArgumentType.SNAPBOOLEAN = 'SnapBoolean';
  Scratch.ArgumentType.INLINESLIDER = 'SliderInline';
  Scratch.ArgumentType.HIDDENSTRING = 'StringHidden';
  Scratch.ArgumentType.INLINEDATE = 'DateInline';
  Scratch.ArgumentType.FILE = 'FileInput';

 
  let implementations = {
    FieldTextarea: null,
    FieldInlineTextarea: null,
    FieldSnapBoolean: null,
    FieldInlineSlider: null,
    FieldInlineDate: null,
    FieldFileInput: null,
    FieldInlineDoom: null,
  };

  customFieldTypes[Scratch.ArgumentType.TEXTAREA] = {
    output: 'String',
    color1: '#9566d3',
    outputShape: 2,
    implementation: {
      fromJson: () => new implementations.FieldTextarea()
    }
  };
  customFieldTypes[Scratch.ArgumentType.INLINETEXTAREA] = {
    output: 'String',
    color1: '#9566d3',
    outputShape: 2,
    implementation: {
      fromJson: () => new implementations.FieldInlineTextarea()
    }
  };
  customFieldTypes[Scratch.ArgumentType.SNAPBOOLEAN] = {
    output: 'Number',
    color1: '#9566d3',
    outputShape: 1,
    implementation: {
      fromJson: () => new implementations.FieldSnapBoolean()
    }
  };
  customFieldTypes[Scratch.ArgumentType.INLINESLIDER] = {
    output: 'Number',
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldInlineSlider()
    }
  };
  customFieldTypes[Scratch.ArgumentType.HIDDENSTRING] = {
    output: 'String',
    color1: '#9566d3',
    outputShape: 2,
    implementation: {
      fromJson: () => new implementations.FieldHiddenTextInput()
    }
  };
  customFieldTypes[Scratch.ArgumentType.INLINEDATE] = {
    output: 'String',
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldInlineDate()
    }
  };
  customFieldTypes[Scratch.ArgumentType.FILE] = {
    output: 'String',
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldFileInput()
    }
  };
  customFieldTypes['InlineDoom'] = {
    output: 'String',
    color1: '#9566d3',
    outputShape: 3,
    implementation: {
      fromJson: () => new implementations.FieldInlineDoom()
    }
  };

  // Main try thing
  function tryUseScratchBlocks(_sb) {
    console.log('Got ScratchBlocks', _sb);

    Blockly = _sb;
    // https://stackoverflow.com/questions/5560248/programmatically-lighten-or-darken-a-hex-color-or-rgb-and-blend-colors
    Blockly._LightenDarkenColor = function(col, amt) {
      const num = parseInt(col.replace('#', ''), 16);
      const r = (num >> 16) + amt;
      const b = ((num >> 8) & 0x00FF) + amt;
      const g = (num & 0x0000FF) + amt;
      const newColor = g | (b << 8) | (r << 16);
      return (col.at(0) === '#' ? '#' : '') + newColor.toString(16);
    }

    // Patch for a bug in size_.height
    const _endBlockDrag = Blockly.BlockDragger.prototype.endBlockDrag
    Blockly.BlockDragger.prototype.endBlockDrag = function (...a) {
      _endBlockDrag.call(this, ...a);
      for (const childBlock of this.draggingBlock_.childBlocks_) {
        const inputList = childBlock.inputList;
        if (inputList.length === 1 && inputList[0].fieldRow.length === 1 && !!inputList[0].fieldRow[0]?.inlineDblRender) childBlock.render();
      }
    }

    // Fields
    const textInputs_trueToOriginal = true;
    implementations.FieldTextarea = class FieldTextarea extends Blockly.FieldTextInput {
      constructor(opt_value) {
        opt_value = Scratch.ArgumentType.TEXTAREA;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(Scratch.ArgumentType.TEXTAREA);
      }
      showEditor_() {
        Blockly.DropDownDiv.clearContent();
        const div = Blockly.DropDownDiv.getContentDiv();
        const input = document.createElement('textarea');
        input.value = this.getValue();
        div.append(input);
        this._textarea = input;
        input.addEventListener('input', () => this._onInput());
        Blockly.DropDownDiv.setColour(this.sourceBlock_.parentBlock_.getColour(), this.sourceBlock_.parentBlock_.getColourTertiary());
        Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
        _moveDropdown.call(this);
      }
      init(...initArgs) {
        Blockly.Field.prototype.init.call(this, ...initArgs);
        this.sourceBlock_.outputConnection.check_ = [];
        _fixColours.call(this, !textInputs_trueToOriginal, (textInputs_trueToOriginal ? '#FFFFFF' : undefined), '#FFFFFF');
      }
      _onInput() {
        this.setValue(this._textarea.value);
        _moveDropdown.call(this);
      }
    }
    implementations.FieldInlineTextarea = class FieldInlineTextarea extends Blockly.Field {
      constructor(opt_value) {
        opt_value = Scratch.ArgumentType.INLINETEXTAREA;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(Scratch.ArgumentType.INLINETEXTAREA);
      }
      updateWidth() {
        this.size_.width = this._FakeWidth;
        this.size_.height = this._FakeHeight;
      }
      init(...initArgs) {
        this.inlineDblRender = true;
        Blockly.Field.prototype.init.call(this, ...initArgs);
        _disableReporters.call(this);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__) {
          this.textNode__.style.display = 'none';
          _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        this._FakeWidth = this._FakeWidth ?? 40;
        this._FakeHeight = this._FakeHeight ?? 20;
        const textareaHolder = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        textareaHolder.setAttribute('x', '16');
        textareaHolder.setAttribute('y', '8');
        textareaHolder.addEventListener('mousedown', (e) => e.stopPropagation());
        const textarea = document.createElement('textarea');
        textarea.addEventListener('input', () => this._onInput());
        textarea.addEventListener('mouseup', (e) => this._resizeHolder());
        if (this.fieldGroup_) {
          this.fieldGroup_.insertAdjacentElement('afterend', textareaHolder);
          textareaHolder.appendChild(textarea);
          this._textareaHolder = textareaHolder;
          this._textarea = textarea;
          if (this.sourceBlock_ && this.sourceBlock_.isInFlyout) {
            textarea.disabled = true;
            textarea.style.resize = 'none';
          }
          this._resizeHolder();
          new ResizeObserver(() => this._resizeHolder()).observe(this._textarea);
        }
      }
      _resizeHolder() {
        const width = this._textarea.offsetWidth + 1, height = this._textarea.offsetHeight + 1;
        this._textareaHolder.setAttribute('width', String(width + 3));
        this._textareaHolder.setAttribute('height', String(height + 3));
        this._FakeWidth = width + 8;
        this._FakeHeight = height + 16;
        this.updateWidth();
        const ov = this.getValue();
        this.setValue(ov + '~');
        this.setValue(ov);
        this.render_();
      }
      _onInput() {
        this.setValue(this._textarea.value);
      }
      showEditor_() {
      }
    }
    implementations.FieldSnapBoolean = class FieldSnapBoolean extends Blockly.Field {
      constructor(opt_value) {
        opt_value = Number(opt_value);
        super(opt_value);
        this.addArgType('Boolean');
        this.addArgType(Scratch.ArgumentType.SNAPBOOLEAN);
        this.checkSymbol = String.fromCodePoint('10003');
        this.slap = `${this.checkSymbol}\u00A0\u00A0\u00A0x`;
      }
      // Initial DOM building.
      init(...a) {
        Blockly.Field.prototype.init.call(this, ...a);
        _disableReporters.call(this);
        const sliderCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        sliderCircle.setAttribute('cx', '0');
        sliderCircle.setAttribute('cy', '0');
        sliderCircle.setAttribute('r', '10');
        sliderCircle.setAttribute('fill', 'white');
        sliderCircle.setAttribute('transform', 'translate(16, 16)');
        this.sliderCircle_ = sliderCircle;
        if (this.fieldGroup_) this.fieldGroup_.insertAdjacentElement('afterend', sliderCircle);
      }
      // Colors <3
      rerender() {
        const fg_ = this.fieldGroup_;
        if (!fg_) return;
        const path = fg_?.previousElementSibling;
        if (path?.nodeName !== 'path') return;
        const circle = this.sliderCircle_;
        if (Number(this.getValue())) {
          path.setAttribute('stroke', '#21DD21');
          path.setAttribute('fill', '#21DD21');
          if (circle) circle.setAttribute('cx', '24');
        } else {
          path.setAttribute('stroke', '#FF3333');
          path.setAttribute('fill', '#FF3333');
          if (circle) circle.setAttribute('cx', '0');
        }
      }
      // State management
      updateState(value, toggle) {
        let n = Number(value);
        if (toggle) n = Number(!Boolean(Number(this.getValue())));
        this.setValue(n);
      }
      showEditor_() {
        this.updateState(0, true);
        this.render_();
      }
      // Rendering
      render_() {
        if (this.visible_ && this.textElement_) {
          // Replace the text.
          this.textElement_.textContent = this.slap; //this.getDisplayText_();
          this.updateWidth();

          // Update text centering, based on newly calculated width.
          var centerTextX = (this.size_.width - this.arrowWidth_) / 2;
          if (this.sourceBlock_.RTL) {
            centerTextX += this.arrowWidth_;
          }

          // In a text-editing shadow block's field,
          // if half the text length is not at least center of
          // visible field (FIELD_WIDTH), center it there instead,
          // unless there is a drop-down arrow.
          if (this.sourceBlock_.isShadow() && !this.positionArrow) {
            var minOffset = Blockly.BlockSvg.FIELD_WIDTH / 2;
            if (this.sourceBlock_.RTL) {
              // X position starts at the left edge of the block, in both RTL and LTR.
              // First offset by the width of the block to move to the right edge,
              // and then subtract to move to the same position as LTR.
              var minCenter = this.size_.width - minOffset;
              centerTextX = Math.min(minCenter, centerTextX);
            } else {
              // (width / 2) should exceed Blockly.BlockSvg.FIELD_WIDTH / 2
              // if the text is longer.
              centerTextX = Math.max(minOffset, centerTextX);
            }
          }

          // Apply new text element x position.
          this.textElement_.setAttribute('x', centerTextX);
        }

        // Update any drawn box to the correct width and height.
        if (this.box_) {
          this.box_.setAttribute('width', this.size_.width);
          this.box_.setAttribute('height', this.size_.height);
        }

        if (this.textElement_) {
          // this.textElement_.style.display = 'none';
        }

        this.rerender();
      }
    }
    implementations.FieldInlineSlider = class FieldInlineSlider extends Blockly.FieldNumber {
      constructor(opt_value) {
        opt_value = Scratch.ArgumentType.INLINESLIDER;
        super(opt_value);
        this.addArgType('Number');
        this.addArgType(Scratch.ArgumentType.INLINESLIDER);
      }
      updateWidth() {
        this.size_.width = 139;
      }
      init(...initArgs) {
        Blockly.FieldNumber.prototype.init.call(this, ...initArgs);
        _disableReporters.call(this);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__) {
          this.textNode__.style.display = 'none';
          _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        if (!String(this.getValue()).includes(',')) this.setValue(`${this.getValue()},${Number(this.getValue())-Number(this.getValue())/2},${Number(this.getValue())+Number(this.getValue())/2}`);
        const vals = this.getValue().split(',');
        const input = document.createElement('input');
        input.type = 'range';
        input.value = Number(vals[0]);
        input.min = Number(vals[1]);
        input.max = Number(vals[2]);
        input.width = 139;
        input.height = 16;
        input.addEventListener('input', () => this._onSliderInput());
        const sliderHolder = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        sliderHolder.setAttribute('x', '16');
        sliderHolder.setAttribute('y', '8');
        sliderHolder.setAttribute('width', '139');
        sliderHolder.setAttribute('height', '16');
        sliderHolder.addEventListener('mousedown', (e) => e.stopPropagation());
        if (this.fieldGroup_) this.fieldGroup_.insertAdjacentElement('afterend', sliderHolder);
        sliderHolder.appendChild(input);
        this._slider = input;
        this._sliderHolder = sliderHolder;
        this.render_();
      }
      _onInput() {
        this._valInput.min = this._minInput.value;
        this._valInput.max = this._maxInput.value;
        this._slider.value = this._valInput.value;
        this._slider.min = this._minInput.value;
        this._slider.max = this._maxInput.value;
        const val = `${this._slider.value},${this._minInput.value},${this._maxInput.value}`;
        this.setValue(val);
      }
      _onSliderInput() {
        if (!!this._valInput) this._valInput.value = Number(this._slider.value);
        const val = `${this._slider.value},${this._slider.min},${this._slider.max}`;
        this.setValue(val);
      }
      showEditor_() {
        Blockly.DropDownDiv.clearContent();
        const div = Blockly.DropDownDiv.getContentDiv();
        const minInput = document.createElement('input');
        minInput.type = 'number';
        minInput.value = Number(this._slider.min);
        const maxInput = document.createElement('input');
        maxInput.type = 'number';
        maxInput.value = Number(this._slider.max);
        const valInput = document.createElement('input');
        valInput.type = 'number';
        valInput.value = Number(this._slider.value);
        valInput.min = minInput.value;
        valInput.max = maxInput.value;
        div.append(document.createTextNode('Min: '));
        div.append(minInput);
        div.append(document.createElement('br'));
        div.append(document.createTextNode('Value: '));
        div.append(valInput);
        div.append(document.createElement('br'));
        div.append(document.createTextNode('Max: '));
        div.append(maxInput);
        this._minInput = minInput;
        this._maxInput = maxInput;
        this._valInput = valInput;
        minInput.addEventListener('input', () => this._onInput());
        maxInput.addEventListener('input', () => this._onInput());
        valInput.addEventListener('input', () => this._onInput());
        Blockly.DropDownDiv.setColour(this.sourceBlock_.parentBlock_.getColour(), this.sourceBlock_.parentBlock_.getColourTertiary());
        Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
        _moveDropdown.call(this, true);
      }
    }
    implementations.FieldHiddenTextInput = class FieldHiddenTextInput extends Blockly.FieldTextInput {
      constructor(opt_value) {
        opt_value = Scratch.ArgumentType.HIDDENSTRING;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(Scratch.ArgumentType.HIDDENSTRING);
      }
      init(...initArgs) {
        Blockly.FieldTextInput.prototype.init.call(this, ...initArgs);
        _disableReporters.call(this);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__) _fixColours.call(this, true, this.sourceBlock_.parentBlock_.colour_, this.sourceBlock_.parentBlock_.colour_);
      }
      showEditor_(...showArgs) {
        if (!!this.textNode__) _delCssNattr(this.textNode__, 'fill');
        Blockly.FieldTextInput.prototype.showEditor_.call(this, ...showArgs);
      }
    }
    implementations.FieldInlineDate = class FieldInlineDate extends Blockly.Field {
      // For help with date related stuff look at these at they helped me alot.
      // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/date
      // https://stackoverflow.com/questions/847185/convert-a-unix-timestamp-to-time-in-javascript
      // https://stackoverflow.com/questions/7556591/is-the-javascript-date-object-always-one-day-off
      constructor(opt_value) {
        opt_value = Scratch.ArgumentType.INLINEDATE;
        super(opt_value);
        this.addArgType('Number');
        this.addArgType(Scratch.ArgumentType.INLINEDATE);
      }
      updateWidth() {
        this.size_.width = 136;
      }
      init(...initArgs) {
        Blockly.FieldNumber.prototype.init.call(this, ...initArgs);
        _disableReporters.call(this);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__) {
          this.textNode__.style.display = 'none';
          _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        const validDateFormat = (/(\d{4}(\-|\/)\d{2}(\-|\/)\d{2})/i.test(this.getValue()));
        if (!validDateFormat) this.setValue('2001-01-01');
        const date = new Date(this._getDate());
        const ts = this._dateFormat(date);
        this.setValue(ts);
        const input = document.createElement('input');
        input.type = 'date';
        this._fixDate(input);
        input.width = 136;
        input.height = 22;
        input.addEventListener('input', () => this._onInput());
        input.addEventListener('change', () => this._onInput());
        const dateHolder = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        dateHolder.setAttribute('x', '8');
        dateHolder.setAttribute('y', '5');
        dateHolder.setAttribute('width', '136');
        dateHolder.setAttribute('height', '22');
        dateHolder.addEventListener('mousedown', (e) => e.stopPropagation());
        if (this.fieldGroup_) this.fieldGroup_.insertAdjacentElement('afterend', dateHolder);
        dateHolder.appendChild(input);
        this._date = input;
        this._dateHolder = dateHolder;
        this.render_();
      }
      _onInput() {
        this.setValue(this._date.value.toString());
      }
      _getDate() {
        return this.getValue().replaceAll('-', '/');
      }
      _dateFormat(date) {
        return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
      }
      _fixDate(_date) {
        const date = new Date(this._getDate());
        const ts = this._dateFormat(date);
        const msUnix = date.getTime();
        _date.valueAsNumber = msUnix;
        _date.value = ts;
      }
      showEditor_() {
        // TODO: add min and max date along with "step"
      }
    }

    // icons from: https://fonts.google.com/icons
    const _fileIconColor = `style="fill:#FFFFFF;stroke:#FFFFFF;" fill="#FFFFFF" stroke="#FFFFFF"`;
    const settingsIcon = `data:image/svg+xml;base64,${btoa(`<svg ${_fileIconColor} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="m370-80-16-128q-13-5-24.5-12T307-235l-119 50L78-375l103-78q-1-7-1-13.5v-27q0-6.5 1-13.5L78-585l110-190 119 50q11-8 23-15t24-12l16-128h220l16 128q13 5 24.5 12t22.5 15l119-50 110 190-103 78q1 7 1 13.5v27q0 6.5-2 13.5l103 78-110 190-118-50q-11 8-23 15t-24 12L590-80H370Zm70-80h79l14-106q31-8 57.5-23.5T639-327l99 41 39-68-86-65q5-14 7-29.5t2-31.5q0-16-2-31.5t-7-29.5l86-65-39-68-99 42q-22-23-48.5-38.5T533-694l-13-106h-79l-14 106q-31 8-57.5 23.5T321-633l-99-41-39 68 86 64q-5 15-7 30t-2 32q0 16 2 31t7 30l-86 65 39 68 99-42q22 23 48.5 38.5T427-266l13 106Zm42-180q58 0 99-41t41-99q0-58-41-99t-99-41q-59 0-99.5 41T342-480q0 58 40.5 99t99.5 41Zm-2-140Z"/></svg>`)}`;
    const uploadIcon = `data:image/svg+xml;base64,${btoa(`<svg ${_fileIconColor} xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 -960 960 960" width="24"><path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z"/></svg>`)}`;
    implementations.FieldFileInput = class FieldFileInput extends Blockly.Field {
      constructor(opt_value) {
        opt_value = Scratch.ArgumentType.FILE;
        super(opt_value);
        this.addArgType('String');
        this.addArgType(Scratch.ArgumentType.FILE);
      }
      updateWidth() {
        this.size_.width = 40;
      }
      init(...initArgs) {
        this._delim = '\n';
        Blockly.FieldTextInput.prototype.init.call(this, ...initArgs);
        _disableReporters.call(this);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__) {
          this.textNode__.style.display = 'none';
          _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        this._fileData = null;
        const fg_ = this.fieldGroup_;
        if (!fg_) return;
        const path = fg_?.previousElementSibling;
        if (path?.nodeName !== 'path') return;
        const settingsButton = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        settingsButton.setAttribute('width', '24');
        settingsButton.setAttribute('height', '24');
        settingsButton.setAttribute('x', '19.5');
        settingsButton.setAttribute('y', '4');
        settingsButton.setAttribute('xlink:href', settingsIcon);
        settingsButton.setAttribute('href', settingsIcon);
        settingsButton.addEventListener('mousedown', (e) => this._onSettingsClick(e));
        this._settingsButton = settingsButton;
        const uploadButton = document.createElementNS('http://www.w3.org/2000/svg', 'image');
        uploadButton.setAttribute('width', '24');
        uploadButton.setAttribute('height', '24');
        uploadButton.setAttribute('x', '-4');
        uploadButton.setAttribute('y', '3.5');
        uploadButton.setAttribute('xlink:href', uploadIcon);
        uploadButton.setAttribute('href', uploadIcon);
        uploadButton.addEventListener('mousedown', (e) => this._onUploadClick(e));
        this._uploadButton = uploadButton;
        fg_.appendChild(settingsButton);
        fg_.appendChild(uploadButton);
        this._saveFileData();
      }
      _loadData(item) {
        const value = this.getValue();
        const cr1 = value.indexOf(this._delim);
        const cr2 = value.indexOf(this._delim, cr1 + 1);
        switch (item) {
          case 1:
            this._fileData = value.substr(cr2 + 1);
            break;
          case 2:
            this._outputOptions.value = value.slice(0, cr1);
            break;
          case 3:
            this._fileLimiter.value = value.slice(cr1 + 1, cr2);
            break;
          default:
            break;
        }
      }
      _saveFileData(skipLoad) {
        if (!Boolean(skipLoad ?? false)) this._loadData(1);
        this.showEditor_(true);
        this._onInput(this._fileData);
        Blockly.DropDownDiv.hideWithoutAnimation();
        this._fileData = null;
      }
      _onSettingsClick(e) {
        e.stopPropagation();
        this.showEditor_(true);
      }
      _onUploadClick(e) {
        e.stopPropagation();
        const fileInput = document.createElement('input');
        this.showEditor_(true);
        fileInput.type = 'file';
        fileInput.accept = this._fileLimiter.value.replaceAll(this._delim, '').trim() || '*.*';
        const loadType = this._outputOptions.value;
        Blockly.DropDownDiv.hideWithoutAnimation();
        const fiErr = (c, alr) => {
          c = !c;
          if (c) {
            this._uploadButton.style.display = 'block';
            fileInput.remove();
            alert(alr);
          }
          return c;
        }
        fileInput.addEventListener('change', (event) => {
          this._uploadButton.style.display = 'none';
          const fileList = event.target.files;
          // This wont do anything why :cri:
          let noFileErr = () => false;
          const unfe = () => {
            if (fileList.length < 0) noFileErr = () => fiErr(true, 'No file uploaded?');
            return true;
          };
          window.addEventListener('focus', unfe, {once: true});
          if (unfe() && noFileErr()) return;
          // Ok done crying.
          const reader = new FileReader();
          reader.addEventListener('load', (event) => {
            this._fileData = event.target.result;
            this._saveFileData(true);
            this._uploadButton.style.display = 'block';
            fileInput.remove();
            alert('File uploaded.');
          });
          const file = fileList[0];
          if (fiErr(!!file, 'File is null?!!??')) return;
          switch(loadType) {
            case 'dataURL':
              reader.readAsDataURL(file);
              break;
            case 'text':
              reader.readAsText(file);
              break;
            default:
              if (fiErr(false, 'Invalid output option.')) return;
              break;
          }
        });
        fileInput.click();
      }
      _getFileData() {
        if (!!this._fileData) return this._fileData;
        this._loadData(1);
        const fileData = this._fileData ?? '';
        this._fileData = null;
        return fileData;
      }
      _onInput(fileData) {
        if (this._fileLimiter.value.trim().length < 1) this._fileLimiter.value = '*.*';
        this.setValue(`${this._outputOptions.value}${this._delim}${this._fileLimiter.value.replaceAll(this._delim, '')}${this._delim}${fileData ?? this._getFileData()}`);
      }
      _optDropdown(selected, ...optValues) {
        optValues = (optValues ?? []).map(opt => `<option value="${opt}"${selected===opt ? 'selected=""' : ''}>${opt}</option>`).join('\n');
        const select = document.createElement('select');
        return { select, optValues };
      }
      showEditor_(forceShow) {
        if (!Boolean(forceShow ?? false)) return;
        Blockly.DropDownDiv.clearContent();
        const div = Blockly.DropDownDiv.getContentDiv();
        const outputOptions_temp = this._optDropdown('dataURL', 'dataURL', 'text');
        const outputOptions = outputOptions_temp.select;
        outputOptions.addEventListener('input', () => this._onInput());
        const fileLimiter = document.createElement('input');
        fileLimiter.addEventListener('input', () => this._onInput());
        const clearBtn = document.createElement('button');
        if (!!this._getFileData().at(0)) {
          clearBtn.addEventListener('click', () => {
            this._fileData = null;
            this._onInput('');
            clearBtn.nextElementSibling.remove();
            clearBtn.remove();
          });
          div.appendChild(clearBtn);
          clearBtn.textContent = 'Clear file.';
          div.appendChild(document.createElement('br'));
        }
        div.appendChild(document.createTextNode('Upload as: '));
        div.appendChild(outputOptions);
        outputOptions.innerHTML = outputOptions_temp.optValues;
        div.appendChild(document.createElement('br'));
        div.appendChild(document.createTextNode('Limit file types: '));
        div.appendChild(fileLimiter);
        div.appendChild(document.createElement('br'));
        this._outputOptions = outputOptions;
        this._fileLimiter = fileLimiter;
        Blockly.DropDownDiv.setColour(this.sourceBlock_.parentBlock_.getColour(), this.sourceBlock_.parentBlock_.getColourTertiary());
        Blockly.DropDownDiv.setCategory(this.sourceBlock_.parentBlock_.getCategory());
        _moveDropdown.call(this, true);
        this._loadData(2);
        this._loadData(3);
      }
    }

    implementations.FieldInlineDoom = class FieldInlineDoom extends Blockly.Field {
      showEditor_() {
      }
      constructor(opt_value) {
        opt_value = 'InlineDoom';
        super(opt_value);
        this.addArgType('String');
        this.addArgType('InlineDoom');
      }
      updateWidth() {
        this.size_.width = 650;
        this.size_.height = 410;
      }
      init(...initArgs) {
        this.inlineDblRender = true;
        Blockly.Field.prototype.init.call(this, ...initArgs);
        _disableReporters.call(this);
        this.textNode__ = this.sourceBlock_.svgPath_.parentNode.querySelector('g.blocklyEditableText text');
        if (!!this.textNode__) {
          this.textNode__.style.display = 'none';
          _fixColours.call(this, false, this.sourceBlock_.parentBlock_.colour_);
        }
        const fg_ = this.fieldGroup_;
        if (!fg_) return;
        const path = fg_?.previousElementSibling;
        if (path?.nodeName !== 'path') return;
        const fObj = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fObj.setAttribute('width', '650');
        fObj.setAttribute('height', '410');
        fObj.setAttribute('x', '0');
        fObj.setAttribute('y', '0');
        this._fObj = fObj;
        this.fg_ = fg_;
        if (this.fieldGroup_) this.fieldGroup_.insertAdjacentElement('afterend', fObj);
        this._addDOOM();
      }
      _addDOOM() {
        let frame = document.createElement('iframe');
        frame.width = 640;
        frame.height = 400;
        frame.id = 'DOOM';
        this._fObj.appendChild(frame);
        /**
          * 
          * ORIGINAL: https://diekmann.github.io/wasm-fizzbuzz/doom/
          * Ported for use in turbowarp blocks
          * 
          */
        frame.srcdoc = atob(`PCEtLSBPUklHSU5BTDogaHR0cHM6Ly9kaWVrbWFubi5naXRodWIuaW8vd2FzbS1maXp6YnV6ei9kb29tLyAtLT48IWRvY3R5cGVodG1sPjxodG1sPjxib2R5PjxET09NPjxzdHlsZT4jb3V0cHV0e2JvcmRlcjozcHggZ3Jvb3ZlICM3ZmZmZDQ7YmFja2dyb3VuZC1jb2xvcjpiaXNxdWU7d2lkdGg6NTUwcHg7aGVpZ2h0OjQwMHB4O2ZvbnQtZmFtaWx5Om1vbm9zcGFjZSxzZXJpZjtmb250LXNpemU6MTBweDtvdmVyZmxvdy15OnNjcm9sbH0jb3V0cHV0IHNwYW4ubG9ne2NvbG9yOiM0ODNkOGJ9I291dHB1dCBzcGFuLnN0ZG91dHtjb2xvcjojMDAwfSNvdXRwdXQgc3Bhbi5zdGRlcnJ7Zm9udC13ZWlnaHQ6NzAwO2NvbG9yOmJyb3dufS5jb250YWluZXJ7ZGlzcGxheTpmbGV4fSp7bWFyZ2luOjBweDtwYWRkaW5nOjBweH08L3N0eWxlPjxzcGFuIGhpZGRlbj48cCBpZD1mb2N1c2hpbnQ+PC9wPjxwPjxidXR0b24gaWQ9ZW50ZXJCdXR0b24+PC9idXR0b24+PGJ1dHRvbiBpZD1sZWZ0QnV0dG9uPjwvYnV0dG9uPjxidXR0b24gaWQ9dXBCdXR0b24+PC9idXR0b24+PGJ1dHRvbiBpZD1kb3duQnV0dG9uPjwvYnV0dG9uPjxidXR0b24gaWQ9cmlnaHRCdXR0b24+PC9idXR0b24+IDxidXR0b24gaWQ9Y3RybEJ1dHRvbj48L2J1dHRvbj48YnV0dG9uIGlkPXNwYWNlQnV0dG9uPjwvYnV0dG9uPiA8YnV0dG9uIGlkPWFsdEJ1dHRvbj48L2J1dHRvbj48L3A+PC9zcGFuPjxkaXYgY2xhc3M9Y29udGFpbmVyPjxjYW52YXMgaGVpZ2h0PTQwMCBpZD1zY3JlZW4gdGFiaW5kZXg9MCB3aWR0aD02NDA+VGhpcyBpcyB3aGVyZSB0aGUgRG9vTSBzY3JlZW4gc2hvdWxkIHJlbmRlci48L2NhbnZhcz48ZGl2IGhpZGRlbiBpZD1vdXRwdXQ+PC9kaXY+PC9kaXY+PHNwYW4gaGlkZGVuPjxzcGFuIGlkPWdldG1zcHNfc3RhdHM+PC9zcGFuPjxzcGFuIGlkPWdldG1zX3N0YXRzPjwvc3Bhbj4gPHNwYW4gaWQ9ZnBzX3N0YXRzPjwvc3Bhbj48c3BhbiBpZD1kcmF3ZnJhbWVzX3N0YXRzPjwvc3Bhbj4gPHNwYW4gaWQ9YW5pbWF0aW9uZnBzX3N0YXRzPjwvc3Bhbj48L3NwYW4+PHNjcmlwdCBkZWZlcj4idXNlIHN0cmljdCI7dmFyIG1lbW9yeT1uZXcgV2ViQXNzZW1ibHkuTWVtb3J5KHtpbml0aWFsOjEwOH0pO2NvbnN0IG91dHB1dD1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgib3V0cHV0Iik7ZnVuY3Rpb24gcmVhZFdhc21TdHJpbmcodCxlKXtsZXQgbj1uZXcgVWludDhBcnJheShtZW1vcnkuYnVmZmVyLHQsZSk7cmV0dXJuIG5ldyBUZXh0RGVjb2RlcigidXRmOCIpLmRlY29kZShuKX1mdW5jdGlvbiBjb25zb2xlTG9nU3RyaW5nKHQsZSl7bGV0IG49cmVhZFdhc21TdHJpbmcodCxlKTtjb25zb2xlLmxvZygnIicrbisnIicpfWZ1bmN0aW9uIGFwcGVuZE91dHB1dCh0KXtyZXR1cm4gZnVuY3Rpb24oZSxuKXtsZXQgcz1yZWFkV2FzbVN0cmluZyhlLG4pLnNwbGl0KCJcbiIpO2Zvcih2YXIgYT0wO2E8cy5sZW5ndGg7KythKWlmKDAhPXNbYV0ubGVuZ3RoKXt2YXIgcj1kb2N1bWVudC5jcmVhdGVFbGVtZW50KCJzcGFuIik7ci5jbGFzc0xpc3QuYWRkKHQpLHIuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoc1thXSkpLG91dHB1dC5hcHBlbmRDaGlsZChyKSxvdXRwdXQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgiYnIiKSksci5zY3JvbGxJbnRvVmlldyh7YmVoYXZpb3I6InNtb290aCIsYmxvY2s6ImVuZCIsaW5saW5lOiJuZWFyZXN0In0pfX19Y29uc3QgZ2V0bXNwc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZ2V0bXNwc19zdGF0cyIpLGdldG1zX3N0YXRzPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJnZXRtc19zdGF0cyIpO3ZhciBnZXRtc19jYWxsc190b3RhbD0wLGdldG1zX2NhbGxzPTA7ZnVuY3Rpb24gZ2V0TWlsbGlzZWNvbmRzKCl7cmV0dXJuKytnZXRtc19jYWxscyxwZXJmb3JtYW5jZS5ub3coKX13aW5kb3cuc2V0SW50ZXJ2YWwoZnVuY3Rpb24oKXtnZXRtc19jYWxsc190b3RhbCs9Z2V0bXNfY2FsbHMsZ2V0bXNwc19zdGF0cy5pbm5lclRleHQ9Z2V0bXNfY2FsbHMvMWUzKyJrIixnZXRtc19zdGF0cy5pbm5lclRleHQ9Z2V0bXNfY2FsbHNfdG90YWwsZ2V0bXNfY2FsbHM9MH0sMWUzKTtjb25zdCBjYW52YXM9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoInNjcmVlbiIpLGRvb21fc2NyZWVuX3dpZHRoPTY0MCxkb29tX3NjcmVlbl9oZWlnaHQ9NDAwLGZwc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZnBzX3N0YXRzIiksZHJhd2ZyYW1lc19zdGF0cz1kb2N1bWVudC5nZXRFbGVtZW50QnlJZCgiZHJhd2ZyYW1lc19zdGF0cyIpO3ZhciBudW1iZXJfb2ZfZHJhd3NfdG90YWw9MCxudW1iZXJfb2ZfZHJhd3M9MDtmdW5jdGlvbiBkcmF3Q2FudmFzKHQpe3ZhciBlPW5ldyBVaW50OENsYW1wZWRBcnJheShtZW1vcnkuYnVmZmVyLHQsMTAyNGUzKSxuPW5ldyBJbWFnZURhdGEoZSw2NDAsNDAwKTtjYW52YXMuZ2V0Q29udGV4dCgiMmQiKS5wdXRJbWFnZURhdGEobiwwLDApLCsrbnVtYmVyX29mX2RyYXdzfXdpbmRvdy5zZXRJbnRlcnZhbChmdW5jdGlvbigpe251bWJlcl9vZl9kcmF3c190b3RhbCs9bnVtYmVyX29mX2RyYXdzLGRyYXdmcmFtZXNfc3RhdHMuaW5uZXJUZXh0PW51bWJlcl9vZl9kcmF3c190b3RhbCxmcHNfc3RhdHMuaW5uZXJUZXh0PW51bWJlcl9vZl9kcmF3cyxudW1iZXJfb2ZfZHJhd3M9MH0sMWUzKTt2YXIgaW1wb3J0T2JqZWN0PXtqczp7anNfY29uc29sZV9sb2c6YXBwZW5kT3V0cHV0KCJsb2ciKSxqc19zdGRvdXQ6YXBwZW5kT3V0cHV0KCJzdGRvdXQiKSxqc19zdGRlcnI6YXBwZW5kT3V0cHV0KCJzdGRlcnIiKSxqc19taWxsaXNlY29uZHNfc2luY2Vfc3RhcnQ6Z2V0TWlsbGlzZWNvbmRzLGpzX2RyYXdfc2NyZWVuOmRyYXdDYW52YXN9LGVudjp7bWVtb3J5Om1lbW9yeX19O1dlYkFzc2VtYmx5Lmluc3RhbnRpYXRlU3RyZWFtaW5nKGZldGNoKCJodHRwczovL3N1cnYuaXMtYS5kZXYvZG9vbS53YXNtIiksaW1wb3J0T2JqZWN0KS50aGVuKHQ9Pnt0Lmluc3RhbmNlLmV4cG9ydHMubWFpbigpO2xldCBlPWZ1bmN0aW9uKHQpe3N3aXRjaCh0KXtjYXNlIDg6cmV0dXJuIDEyNztjYXNlIDE3OnJldHVybiAxNTc7Y2FzZSAxODpyZXR1cm4gMTg0O2Nhc2UgMzc6cmV0dXJuIDE3MjtjYXNlIDM4OnJldHVybiAxNzM7Y2FzZSAzOTpyZXR1cm4gMTc0O2Nhc2UgNDA6cmV0dXJuIDE3NTtkZWZhdWx0OmlmKHQ+PTY1JiZ0PD05MClyZXR1cm4gdCszMjtpZih0Pj0xMTImJnQ8PTEyMylyZXR1cm4gdCs3NTtyZXR1cm4gdH19LG49ZnVuY3Rpb24oZSl7dC5pbnN0YW5jZS5leHBvcnRzLmFkZF9icm93c2VyX2V2ZW50KDAsZSl9LHM9ZnVuY3Rpb24oZSl7dC5pbnN0YW5jZS5leHBvcnRzLmFkZF9icm93c2VyX2V2ZW50KDEsZSl9O2NhbnZhcy5hZGRFdmVudExpc3RlbmVyKCJrZXlkb3duIixmdW5jdGlvbih0KXtuKGUodC5rZXlDb2RlKSksdC5wcmV2ZW50RGVmYXVsdCgpfSwhMSksY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoImtleXVwIixmdW5jdGlvbih0KXtzKGUodC5rZXlDb2RlKSksdC5wcmV2ZW50RGVmYXVsdCgpfSwhMSksW1siZW50ZXJCdXR0b24iLDEzXSxbImxlZnRCdXR0b24iLDE3Ml0sWyJyaWdodEJ1dHRvbiIsMTc0XSxbInVwQnV0dG9uIiwxNzNdLFsiZG93bkJ1dHRvbiIsMTc1XSxbImN0cmxCdXR0b24iLDE1N10sWyJzcGFjZUJ1dHRvbiIsMzJdLFsiYWx0QnV0dG9uIiwxODRdXS5mb3JFYWNoKChbdCxlXSk9Pntjb25zb2xlLmxvZyh0KyIgZm9yICIrZSk7dmFyIGE9ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodCk7YS5hZGRFdmVudExpc3RlbmVyKCJ0b3VjaHN0YXJ0IiwoKT0+bihlKSksYS5hZGRFdmVudExpc3RlbmVyKCJ0b3VjaGVuZCIsKCk9PnMoZSkpLGEuYWRkRXZlbnRMaXN0ZW5lcigidG91Y2hjYW5jZWwiLCgpPT5zKGUpKX0pO2xldCBhPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJmb2N1c2hpbnQiKSxyPWZ1bmN0aW9uKHQpe2EuaW5uZXJUZXh0PSJLZXlib2FyZCBldmVudHMgd2lsbCBiZSBjYXB0dXJlZCBhcyBsb25nIGFzIHRoZSB0aGUgRE9PTSBjYW52YXMgaGFzIGZvY3VzLiIsYS5zdHlsZS5mb250V2VpZ2h0PSJub3JtYWwifTtjYW52YXMuYWRkRXZlbnRMaXN0ZW5lcigiZm9jdXNpbiIsciwhMSksY2FudmFzLmFkZEV2ZW50TGlzdGVuZXIoImZvY3Vzb3V0IixmdW5jdGlvbih0KXthLmlubmVyVGV4dD0iQ2xpY2sgb24gdGhlIGNhbnZhcyB0byBjYXB1dGUgaW5wdXQgYW5kIHN0YXJ0IHBsYXlpbmcuIixhLnN0eWxlLmZvbnRXZWlnaHQ9ImJvbGQifSwhMSksY2FudmFzLmZvY3VzKCkscigpO2xldCBvPWRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCJhbmltYXRpb25mcHNfc3RhdHMiKTt2YXIgdT0wO2Z1bmN0aW9uIGMoZSl7Kyt1LHQuaW5zdGFuY2UuZXhwb3J0cy5kb29tX2xvb3Bfc3RlcCgpLHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUoYyl9d2luZG93LnNldEludGVydmFsKGZ1bmN0aW9uKCl7by5pbm5lclRleHQ9dSx1PTB9LDFlMyksd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZShjKX0pOzwvc2NyaXB0PjwvRE9PTT48L2JvZHk+PC9odG1sPg==`);
      }
    }

    while (toRegisterOnBlocklyGot.length > 0) {
      const [name, impl] = toRegisterOnBlocklyGot.shift();
      Blockly.Field.register(name, impl);
    }

    // Attempt to reload the workspace and what not.
    // https://github.com/TurboWarp/addons/blob/tw/addons/custom-block-shape/update-all-blocks.js
    const eventsOriginallyEnabled = Blockly.Events.isEnabled(), workspace = Blockly.getMainWorkspace();
    Blockly.Events.disable();
    if (workspace) {
      if (vm.editingTarget) {
        vm.emitWorkspaceUpdate();
      }
      const flyout = workspace.getFlyout();
      if (flyout) {
        const flyoutWorkspace = flyout.getWorkspace();
        Blockly.Xml.clearWorkspaceAndLoadFromXml(
          Blockly.Xml.workspaceToDom(flyoutWorkspace),
          flyoutWorkspace
        );
        workspace.getToolbox().refreshSelection();
        workspace.toolboxRefreshEnabled_ = true;
      }
    }
    if (eventsOriginallyEnabled) Blockly.Events.enable();

    // Exposing fields
    // This does not affect anything its just me doing debugging stuff.
    // Blockly.FieldTextarea = FieldTextarea;
    // Blockly.FieldSnapBoolean = FieldSnapBoolean;
    // Blockly.FieldHiddenTextInput = FieldHiddenTextInput;
    // Blockly.FieldInlineSlider = FieldInlineSlider;
    // Blockly.FieldInlineDate = FieldInlineDate;
    // Blockly.FieldFileInput = FieldFileInput;
    // Skip DOOM cause its my funny field.
  }

  // Passes "Blockly" to tryUseScratchBlocks if Scratch.gui is a object.
  if (typeof Scratch?.gui === 'object') Scratch.gui.getBlockly().then((Blockly) => tryUseScratchBlocks(Blockly));

  // Actual "extension" part
  class extension {
    constructor() {}
    getInfo() {
      const getInfo = ({
        id: '0znzwMoreFields',
        name: 'More Fields',
        color1: '#9566d3',
        color2: '#9566d3',
        color3: '#9566d3',
        color4: '#9566d3',
        blocks: [
          {
            hideFromPalette: true,
            opcode: 'multifieldTest',
            blockType: Scratch.BlockType.REPORTER,
            text: 'file [FILE] snap bool [BOOL] slider [NUM]',
            arguments: {
              FILE: {
                type: Scratch.ArgumentType.FILE,
                defaultValue: 'dataURL\n*/*\n',
              },
              BOOL: {
                type: Scratch.ArgumentType.SNAPBOOLEAN,
                defaultValue: 0,
              },
              NUM: {
                type: Scratch.ArgumentType.INLINESLIDER,
                defaultValue: '10,0,20',
              },
            },
          },
          {
            opcode: 'textarea',
            blockType: Scratch.BlockType.REPORTER,
            text: 'textarea [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.TEXTAREA,
                defaultValue: ':D',
              },
            },
          },
          {
            hideFromPalette: hideInlineTextarea,
            opcode: 'textareaInline',
            blockType: Scratch.BlockType.REPORTER,
            text: 'textarea [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.INLINETEXTAREA,
                defaultValue: ':D',
              },
            },
          },
          {
            hideFromPalette: hideInlineTextarea,
            blockType: Scratch.BlockType.XML,
            xml: '<sep gap="16"/>',
          },
          {
            opcode: 'snapBool',
            blockType: Scratch.BlockType.BOOLEAN,
            text: '[BOOL]',
            arguments: {
              BOOL: {
                type: Scratch.ArgumentType.SNAPBOOLEAN,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: 'sliderInline',
            blockType: Scratch.BlockType.REPORTER,
            text: 'slider: [NUM]',
            arguments: {
              NUM: {
                type: Scratch.ArgumentType.INLINESLIDER,
                defaultValue: '10,0,20',
              }
            }
          },
          {
            opcode: 'hiddenString',
            blockType: Scratch.BlockType.REPORTER,
            text: '"secret" [TEXT]',
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.HIDDENSTRING,
                defaultValue: 'oo a secret ;)',
              },
            },
          },
          {
            opcode: 'date',
            blockType: Scratch.BlockType.REPORTER,
            text: 'date [DATE]',
            arguments: {
              DATE: {
                type: Scratch.ArgumentType.INLINEDATE,
                defaultValue: '2024-03-14',
              },
            },
          },
          {
            opcode: 'file',
            blockType: Scratch.BlockType.REPORTER,
            text: 'file [FILE]',
            arguments: {
              FILE: {
                type: Scratch.ArgumentType.FILE,
                defaultValue: 'dataURL\n*/*\n',
              },
            },
          },
          {
            hideFromPalette: !DOOMcheck,
            opcode: 'DOOM',
            blockType: Scratch.BlockType.COMMAND,
            text: 'DOOM [_a]',
            arguments: {
              _a: {
                type: 'InlineDoom',
                defaultValue: '',
              },
            },
          },
        ],
        customFieldTypes,
      });
      return getInfo;
    }
    multifieldTest() {}
    textarea(args) {
      return args.TEXT;
    }
    textareaInline(args) {
      return args.TEXT;
    }
    snapBool(args) {
      return Scratch.Cast.toBoolean(args.BOOL);
    }
    sliderInline(args) {
      return Scratch.Cast.toNumber(args.NUM.split(',')[0]);
    }
    hiddenString(args) {
      return args.TEXT;
    }
    date(args) {
      let date = new Date(args.DATE.replaceAll('-', '/'));
      return (date.getTime());
    }
    file(args) {
      const cr1 = args.FILE.indexOf('\n');
      const cr2 = args.FILE.indexOf('\n', cr1 + 1);
      return args.FILE.substr(cr2 + 1);
    }
    DOOM(args) {
      return '';
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
