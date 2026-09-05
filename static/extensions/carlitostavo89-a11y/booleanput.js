(function(Scratch) {
  'use strict';

  class Booleanput {
    constructor() {
      this.c1 = '#8B5E34';
      this.c2 = '#6F4B2A';
      this.c3 = '#5A3D22';
      this.hookWorkspaceRetry(0);
    }

    hookWorkspaceRetry(i) {
      try {
        const blocklyObj = typeof Blockly !== 'undefined' ? Blockly : (window.Blockly || null);
        const ws = blocklyObj?.getMainWorkspace?.();
        if (!ws) {
          if (i < 30) setTimeout(() => this.hookWorkspaceRetry(i + 1), 300);
          return;
        }
        ws.addChangeListener((e) => {
          if (e && (e.type === 'move' || e.type === 'change' || e.type === 'endDrag')) {
            requestAnimationFrame(() => this.recolor());
          }
        });
        this.recolor();
      } catch(e) {
        setTimeout(() => this.hookWorkspaceRetry(i + 1), 300);
      }
    }

    getInfo() {
      return {
        id: 'booleanput',
        name: 'Booleanput',
        color1: this.c1, color2: this.c2, color3: this.c3,
        blocks: [
          {
            opcode: 'bool',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'a booleano [INPUT]',
            arguments: { INPUT: { type: Scratch.ArgumentType.STRING, defaultValue: '' } }
          },
          {
            opcode: 'text',
            blockType: Scratch.BlockType.REPORTER,
            text: 'a texto [INPUT]',
            arguments: { INPUT: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: false } }
          },
          {
            opcode: 'number',
            blockType: Scratch.BlockType.REPORTER,
            text: 'a número [INPUT]',
            arguments: { INPUT: { type: Scratch.ArgumentType.BOOLEAN, defaultValue: false } }
          },
          {
            opcode: 'runAsBool',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'ejecutar [SUBSTACK] como booleano',
            branchCount: 1
          },
          {
            opcode: 'runAsReporter',
            blockType: Scratch.BlockType.REPORTER,
            text: 'ejecutar [SUBSTACK] y devolver [RET]',
            branchCount: 1,
            arguments: {
              RET: { type: Scratch.ArgumentType.STRING, defaultValue: 'resultado' }
            }
          }
        ]
      };
    }

    bool(args){ return args.INPUT; }
    text(args){ return args.INPUT; }
    number(args){ return args.INPUT; }

    runAsBool(args, util) {
      if (args.SUBSTACK) {
        util.startBranch(1, false);
      }
      return true;
    }

    runAsReporter(args, util) {
      if (args.SUBSTACK) {
        util.startBranch(1, false);
      }
      return args.RET;
    }

    isLight(c){
      if (!c) return false;
      let r,g,b;
      if (c.startsWith('rgb')){ 
        const match = c.match(/\d+/g);
        if (!match) return false;
        [r,g,b] = match.map(Number); 
      } else { 
        let h = c.replace('#',''); 
        if (h.length === 3) h = h.split('').map(x=>x+x).join(''); 
        r = parseInt(h.substr(0,2),16); 
        g = parseInt(h.substr(2,2),16); 
        b = parseInt(h.substr(4,2),16); 
      }
      return !isNaN(r) && (0.299*r + 0.587*g + 0.114*b) > 190;
    }

    recolor(){
      const blocklyObj = typeof Blockly !== 'undefined' ? Blockly : (window.Blockly || null);
      const ws = blocklyObj?.getMainWorkspace?.();
      if (!ws) return;

      const blocks = ws.getAllBlocks(false).filter(b => b.type && b.type.startsWith('booleanput_'));
      
      blocks.forEach(b => {
        let connectedBlock = null;

        if (b.inputList && b.inputList.length > 0) {
          for (const inp of b.inputList) {
            if (inp.connection && inp.connection.targetBlock()) {
              const target = inp.connection.targetBlock();
              if (!target.isShadow()) {
                connectedBlock = target;
                break;
              }
            }
          }
        }

        const svg = b.getSvgRoot();

        if (connectedBlock) {
          const col = connectedBlock.getColour ? connectedBlock.getColour() : (connectedBlock.colour_ || this.c1);
          const colSec = connectedBlock.getColourSecondary ? connectedBlock.getColourSecondary() : (connectedBlock.colourSecondary_ || col);
          const colTert = connectedBlock.getColourTertiary ? connectedBlock.getColourTertiary() : (connectedBlock.colourTertiary_ || col);

          b.setColour(col);
          if (b.setColourSecondary) b.setColourSecondary(colSec);
          if (b.setColourTertiary) b.setColourTertiary(colTert);

          if (typeof b.render === 'function') b.render();

          svg?.querySelectorAll('text.blocklyText, text').forEach(t => {
            t.style.fill = this.isLight(String(col)) ? '#000000' : '#FFFFFF';
          });
        } else {
          b.setColour(this.c1);
          if (b.setColourSecondary) b.setColourSecondary(this.c2);
          if (b.setColourTertiary) b.setColourTertiary(this.c3);

          if (typeof b.render === 'function') b.render();

          svg?.querySelectorAll('text.blocklyText, text').forEach(t => {
            t.style.fill = '#FFFFFF';
          });
        }
      });
    }
  }

  Scratch.extensions.register(new Booleanput());
})(Scratch);
