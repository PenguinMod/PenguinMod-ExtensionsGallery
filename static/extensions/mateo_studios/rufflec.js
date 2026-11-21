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
      this.ruffleLoaded = false;
      this.swfName = '';
      this.fileType = '';
      this.isPaused = false;
      this.loadRuffle();
    }

    loadRuffle() {
      if (window.RufflePlayer) {
        this.ruffleLoaded = true;
        return;
      }
      const base = 'https://penguinmod.com';
      window.RufflePlayer ??= {};
      window.RufflePlayer.config = {
        publicPath: base
      };
      const script = document.createElement('script');
      script.src = base + '/ruffle.js';
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
            opcode: 'searchSWF',
            blockType: Scratch.BlockType.COMMAND,
            text: 'search for SWF file'
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
            opcode: 'getFileType',
            blockType: Scratch.BlockType.REPORTER,
            text: 'file type'
          }
        ]
      };
    }

    searchSWF() {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.swf';
      input.onchange = (e) => {
        const file = e.target.files.item(0);
        if (!file) return;

        if (!this.ruffleLoaded) {
          console.warn('Ruffle is still loading, please try again in a second.');
          return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
          this.iniciarReproductor({ data: event.target.result }, file.name, '.swf');
        };
        reader.readAsArrayBuffer(file);
      };
      input.click();
    }

    loadSWF(args) {
      const urlStr = String(args.URL || '').trim();
      if (!urlStr) return;

      if (!this.ruffleLoaded) {
        console.warn('Ruffle is still loading, please try again in a second.');
        return;
      }

      let extractedName = '';
      if (urlStr.startsWith('data:')) {
        extractedName = 'local_file.swf';
      } else {
        const cleanUrl = urlStr.split('?')[0].split('#')[0];
        extractedName = cleanUrl.split('/').pop() || urlStr;
      }

      this.iniciarReproductor(urlStr, extractedName, '.swf');
    }

    iniciarReproductor(source, name = '', type = '.swf') {
      this.fileType = type;
      this.swfName = name;
      this.isPaused = false;

      if (!this.player) {
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
      }

      this.player.style.display = 'block';

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
      this.fileType = '';
      this.isPaused = false;
      if (this.player) {
        if (typeof this.player.pause === 'function') {
          this.player.pause();
        }
        this.player.style.display = 'none';
      }
    }

    getSWFName() {
      return this.swfName;
    }

    getFileType() {
      return this.fileType;
    }
  }

  Scratch.extensions.register(new RuffleExtension());
})(Scratch);
