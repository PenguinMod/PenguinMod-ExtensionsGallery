// Name: Ruffle
// ID: mateostudiosruffle
// Description: Load and run .swf files directly inside PenguinMod with playback controls and save data support.
// By: mateo_studios
// License: MIT

(function(Scratch) {
  'use strict';

  class RuffleExtension {
    constructor() {
      this.player = null;
      this.overlay = null;
      this.ruffleLoaded = false;
      this.swfName = '';
      this.flaName = '';
      this.fileType = '';
      this.isPaused = false;
      this.loadRuffle();
    }
        loadRuffle() {
            if (window.RufflePlayer) {
                this.ruffleLoaded = true;
                return;
            }
            const base = 'https://extensions.penguinmod.com';
            window.RufflePlayer ??= {};
            window.RufflePlayer.config = {
                publicPath: base
            };
            const script = document.createElement('script');
            script.src = base + 'ruffle.js';
            script.onload = () => {
                this.ruffleLoaded = true;
            };
            document.head.appendChild(script);
        }


    getInfo() {
      return {
        id: 'mateostudiosruffle',
        name: 'Ruffle',
        color1: '#393e79',
        blocks: [
          {
            opcode: 'whenSWFLoaded',
            blockType: Scratch.BlockType.EVENT,
            text: 'when SWF loaded',
            isEdgeActivated: false
          },
          {
            opcode: 'whenSWFPaused',
            blockType: Scratch.BlockType.EVENT,
            text: 'when SWF paused',
            isEdgeActivated: false
          },
          {
            opcode: 'whenSWFResumed',
            blockType: Scratch.BlockType.EVENT,
            text: 'when SWF resumed',
            isEdgeActivated: false
          },
          {
            opcode: 'mostrarSelector',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show drag or browse .swf screen'
          },
          {
            opcode: 'mostrarSelectorFormato',
            blockType: Scratch.BlockType.COMMAND,
            text: 'show drag or browse [FORMAT] screen',
            arguments: {
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'formatMenu',
                defaultValue: '.swf'
              }
            }
          },
          {
            opcode: 'loadSWF',
            blockType: Scratch.BlockType.COMMAND,
            text: 'load SWF from URL [URL]',
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com'
              }
            }
          },
          {
            opcode: 'pauseSWF',
            blockType: Scratch.BlockType.COMMAND,
            text: 'pause SWF file'
          },
          {
            opcode: 'resumeSWF',
            blockType: Scratch.BlockType.COMMAND,
            text: 'resume SWF file'
          },
          {
            opcode: 'removeSWF',
            blockType: Scratch.BlockType.COMMAND,
            text: 'remove Ruffle player and screen'
          },
          {
            opcode: 'getSWFName',
            blockType: Scratch.BlockType.REPORTER,
            text: 'loaded SWF name'
          },
          {
            opcode: 'getFLAName',
            blockType: Scratch.BlockType.REPORTER,
            text: 'loaded FLA name'
          },
          {
            opcode: 'getFileType',
            blockType: Scratch.BlockType.REPORTER,
            text: 'file type'
          }
        ],
        menus: {
          formatMenu: {
            acceptReporters: true,
            items: ['.swf', '.fla']
          }
        }
      };
    }

    mostrarSelector() {
      this.crearPantallaSelector('.swf');
    }

    mostrarSelectorFormato(args) {
      const formato = String(args.FORMAT || '.swf').toLowerCase();
      this.crearPantallaSelector(formato);
    }

    crearPantallaSelector(formato) {
      this.removeSWF();

      const canvas = Scratch.vm.renderer.canvas;
      const stage = canvas.parentElement;

      // Gray background matching the UI
      this.overlay = document.createElement('div');
      this.overlay.style.position = 'absolute';
      this.overlay.style.top = '0';
      this.overlay.style.left = '0';
      this.overlay.style.width = '100%';
      this.overlay.style.height = '100%';
      this.overlay.style.backgroundColor = '#7f7f7f';
      this.overlay.style.display = 'flex';
      this.overlay.style.alignItems = 'center';
      this.overlay.style.justifyContent = 'center';
      this.overlay.style.zIndex = '100';
      this.overlay.style.fontFamily = 'Arial, sans-serif';

      // White box with dashed gray border
      const dropZone = document.createElement('div');
      dropZone.style.backgroundColor = '#ffffff';
      dropZone.style.border = '6px dashed #7f7f7f';
      dropZone.style.outline = '4px solid #ffffff';
      dropZone.style.borderRadius = '24px';
      dropZone.style.padding = '28px 40px';
      dropZone.style.textAlign = 'center';
      dropZone.style.cursor = 'pointer';
      dropZone.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      dropZone.style.userSelect = 'none';
      dropZone.style.transition = 'transform 0.1s ease';

      const title = document.createElement('div');
      title.textContent = 'Select or drop file';
      title.style.fontSize = '24px';
      title.style.color = '#000000';
      title.style.marginBottom = '8px';

      const subtitle = document.createElement('div');
      subtitle.textContent = `Accepted formats: ${formato}`;
      subtitle.style.fontSize = '15px';
      subtitle.style.color = '#000000';

      dropZone.appendChild(title);
      dropZone.appendChild(subtitle);
      this.overlay.appendChild(dropZone);
      stage.appendChild(this.overlay);

      // Hidden file input on click
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = formato;
      input.style.display = 'none';
      this.overlay.appendChild(input);

      const procesarArchivo = (file) => {
        if (!file) return;
        if (!file.name.toLowerCase().endsWith(formato)) {
          subtitle.textContent = `Please select a valid ${formato} file`;
          subtitle.style.color = '#cc0000';
          return;
        }
        if (formato === '.fla') {
          this.removeSWF();
          this.flaName = file.name;
          this.fileType = '.fla';
          Scratch.vm.runtime.startHats('mateostudiosruffle_whenSWFLoaded');
          return;
        }
        if (!this.ruffleLoaded) {
          subtitle.textContent = 'Ruffle is still loading, please try again in a second.';
          subtitle.style.color = '#cc0000';
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          this.iniciarReproductor({ data: event.target.result }, file.name, formato);
        };
        reader.readAsArrayBuffer(file);
      };

      // Click event
      dropZone.onclick = () => input.click();
      input.onchange = (e) => {
        procesarArchivo(e.target.files.item(0));
      };

      // Drag & Drop events
      this.overlay.ondragover = (e) => {
        e.preventDefault();
        dropZone.style.transform = 'scale(1.03)';
      };

      this.overlay.ondragleave = () => {
        dropZone.style.transform = 'scale(1)';
      };

      this.overlay.ondrop = (e) => {
        e.preventDefault();
        dropZone.style.transform = 'scale(1)';
        if (e.dataTransfer && e.dataTransfer.files.length > 0) {
          procesarArchivo(e.dataTransfer.files.item(0));
        }
      };
    }

    loadSWF(args) {
      if (!this.ruffleLoaded) {
        console.warn('Ruffle is still loading, please try again in a second.');
        return;
      }
      const urlStr = String(args.URL || '');
      const cleanUrl = urlStr.split('?')[0].split('#')[0];
      const extractedName = cleanUrl.split('/').pop() || urlStr;
      const dotIndex = extractedName.lastIndexOf('.');
      const extractedType = dotIndex !== -1 ? extractedName.slice(dotIndex).toLowerCase() : '.swf';
      this.iniciarReproductor(urlStr, extractedName, extractedType);
    }

    iniciarReproductor(source, name = '', type = '.swf') {
      this.removeSWF();
      this.fileType = type;
      if (type === '.fla') {
        this.flaName = name;
        this.swfName = '';
      } else {
        this.swfName = name;
        this.flaName = '';
      }
      this.isPaused = false;

      const ruffle = window.RufflePlayer.newest();
      this.player = ruffle.createPlayer();

      const canvas = Scratch.vm.renderer.canvas;
      const stage = canvas.parentElement;

      this.player.style.position = 'absolute';
      this.player.style.top = '0';
      this.player.style.left = '0';
      this.player.style.width = '100%';
      this.player.style.height = '100%';
      this.player.style.zIndex = '100';

      stage.appendChild(this.player);

      this.player.load(source).then(() => {
        this.isPaused = false;
        Scratch.vm.runtime.startHats('mateostudiosruffle_whenSWFLoaded');
      });
    }

    pauseSWF() {
      if (this.player && typeof this.player.pause === 'function') {
        this.player.pause();
        if (!this.isPaused) {
          this.isPaused = true;
          Scratch.vm.runtime.startHats('mateostudiosruffle_whenSWFPaused');
        }
      }
    }

    resumeSWF() {
      if (this.player && typeof this.player.play === 'function') {
        this.player.play();
        if (this.isPaused) {
          this.isPaused = false;
          Scratch.vm.runtime.startHats('mateostudiosruffle_whenSWFResumed');
        }
      }
    }

    removeSWF() {
      this.swfName = '';
      this.flaName = '';
      this.fileType = '';
      this.isPaused = false;
      if (this.overlay) {
        this.overlay.remove();
        this.overlay = null;
      }
      if (this.player) {
        this.player.remove();
        this.player = null;
      }
    }

    getSWFName() {
      return this.fileType === '.swf' ? this.swfName : '';
    }

    getFLAName() {
      return this.fileType === '.fla' ? this.flaName : '';
    }

    getFileType() {
      return this.fileType;
    }
  }

Scratch.extensions.register(new RuffleExtension());
})(Scratch);
