(function(Scratch) {
  'use strict';

  class BarcodeExtension {
    constructor() {
      this.activeBarcodes = [];
      this.currentSize = 100;

      if (Scratch.vm && Scratch.vm.runtime) {
        Scratch.vm.runtime.on('PROJECT_START', () => this.deleteAllBarcodes());
        Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => this.deleteAllBarcodes());
      }
    }

    getInfo() {
      return {
        id: 'moosanaeempcLinksAndBarcodes',
        name: 'Links & Barcodes',
        blocks: [
          {
            opcode: 'openLink',
            blockType: Scratch.BlockType.COMMAND,
            text: 'open link [URL]',
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://penguinmod.com' }
            }
          },
          {
            opcode: 'generateBarcode',
            blockType: Scratch.BlockType.COMMAND,
            text: 'generate barcode of link [URL] at x [X] y [Y]',
            arguments: {
              URL: { type: Scratch.ArgumentType.STRING, defaultValue: 'https://penguinmod.com' },
              X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 }
            }
          },
          {
            opcode: 'setSize',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set barcode size to [SIZE]',
            arguments: {
              SIZE: { 
                type: Scratch.ArgumentType.NUMBER, 
                defaultValue: 100,
                min: 5, 
                max: 300
              }
            }
          },
          {
            opcode: 'deleteAllBarcodes',
            blockType: Scratch.BlockType.COMMAND,
            text: 'delete all barcodes'
          }
        ]
      };
    }

    _clampSize(size) {
      return Math.min(Math.max(Number(size), 5), 300);
    }

    openLink(args) {
      // Try multiple ways to open the window safely
      const url = args.URL;
      if (typeof window !== 'undefined' && window.open) {
         window.open(url, '_blank', 'noopener,noreferrer');
      } else {
         // Fallback if window.open is blocked
         console.warn('Could not open link: Sandbox mode is active.');
      }
    }

    generateBarcode(args) {
      const stageLayer = document.querySelector('.stage_stage_2SR8W') || 
                         document.querySelector('[class*="stage_stage"]') || 
                         document.body;

      const img = document.createElement('img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(args.URL)}`;
      
      img.style.position = 'absolute';
      img.style.pointerEvents = 'auto';
      img.style.zIndex = '10';
      
      const left = 240 + Number(args.X);
      const top = 180 - Number(args.Y);

      img.style.left = `${(left / 480) * 100}%`;
      img.style.top = `${(top / 360) * 100}%`;
      img.style.transform = 'translate(-50%, -50%)';
      
      const finalSize = this._clampSize(this.currentSize);
      img.style.width = `${finalSize}px`;
      img.style.height = 'auto';
      
      stageLayer.appendChild(img);
      this.activeBarcodes.push(img);
    }

    setSize(args) {
      this.currentSize = this._clampSize(args.SIZE);
    }

    deleteAllBarcodes() {
      this.activeBarcodes.forEach(el => {
        if (el && el.parentNode) {
          el.remove();
        }
      });
      this.activeBarcodes = [];
    }
  }

  Scratch.extensions.register(new BarcodeExtension(), {
    useSandbox: false
  });
})(Scratch);
