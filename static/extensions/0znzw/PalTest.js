/*
* All code is by 0znzw || licensed under MIT license.
* Palette Test or DevTools
* Do not remove this comment
*/
(function(Scratch) {
    'use strict';

    function genLabelXML(text, _GAP) {
      //text = text.replaceAll('\\', '\\\\');
      text = text.replaceAll('"', '&quot;');
      text = text.split('\n');

      let gap = _GAP; //minimum gap is not 0?
      for (let i = 0; i < text.length; i++) {
        let str = text[i];
        str = `<label text="${str}"/><sep gap="${gap}"/>`;
        text[i] = str;
      }

      text = text.join('');
      return text;
    }

    function querySelectorText(_querySelector, innerText) {
      let elems = document.querySelectorAll(_querySelector);
      let found;
      for (let i = 0; i < elems.length; i++) {
        let elem = elems[i];
        if (elem.innerHTML == innerText || elem.innerText == innerText || elem.textContent == innerText) { found = elem; break };
      }
      return found;
    }

    class SepTest {
      constructor() {
        this.gap = -20;
        this.label = 'Test Label\nthis is on a "NEWLINE"';
      }
      getInfo() {
        return {
          id: '0znzwSepTest',
          name: '‭',
          blocks: [
            {
              isTerminal: true,
              blockType: Scratch.BlockType.HAT,
              text: 'Palette Test / DevTools',
              opcode: '_zero'
            },
            {
              blockType: Scratch.BlockType.XML,
              xml: genLabelXML('Put the above block in\nyour project to have this\nutility loaded everytime\nyou load your project.', this.gap)
            },
            '---',
            {
              blockType: Scratch.BlockType.BUTTON,
              text: 'Refresh Palette',
              func: '_refresh'
            },
            {
              blockType: Scratch.BlockType.BUTTON,
              text: 'Set Label',
              func: 'setLabel'
            },
            {
              blockType: Scratch.BlockType.BUTTON,
              text: 'Set Sep-Gap',
              func: 'setGap'
            },
            {
              blockType: Scratch.BlockType.BUTTON,
              text: 'Inject HTML into LN# of Label',
              func: 'injHTML'
            },
            {
              blockType: Scratch.BlockType.BUTTON,
              text: 'eval',
              func: 'eval_'
            },
            {
              blockType: Scratch.BlockType.XML,
              xml: genLabelXML(this.label, this.gap)
            },
            '---'
          ]
        };
      }

      _zero() { return 0 }

      _refresh() {
        this.label = this.label.replaceAll('\\n', '\n');
        this.label = this.label.replaceAll('\\\\', '\\');
        Scratch.vm.extensionManager.refreshBlocks();
      }

      setLabel(data) {
         data = data ?? prompt('What should the label be set to? (use \n for new-lines and \\\\ for \\)');
         if (data != '') { this.label = data; } else { alert('Cannot be empty!') };
         this._refresh();
      }

      setGap() {
        this.gap = parseFloat(prompt('What size gap?'));
        this._refresh();
      }

      injHTML(label, data) {
        label = label ?? prompt('Label Text? (if it is multiline only put 1 of the lines)');
        data = data ?? prompt('HTML');
        try {
          let query = querySelectorText('g>text.blocklyFlyoutLabelText', label);
          query.innerHTML = data;
        } catch(err) {
          alert(`Failed to inject into LN of Label.\n\nTry-Catch Caught An Error:\n${err}`);
        }
      }

      eval_(data) {
        data = data ?? prompt('JS');
        try { return eval(data) } catch(err) { alert(`Try-Catch Caught An Error:\n${err}`); return err };
      }

    }
    const CC = new SepTest();
    Scratch.extensions.register(CC);
    CC._refresh();
})(Scratch);
