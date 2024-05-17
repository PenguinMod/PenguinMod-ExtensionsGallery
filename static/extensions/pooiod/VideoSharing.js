// Video sharing (v2.4.2) by pooiod7

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  const runtime = Scratch.vm.runtime;
  const renderer = runtime.renderer;
  const Cast = Scratch.Cast;
  
  var createdSkins = [];

  const videoElement = document.createElement('video');
  videoElement.style.display = 'none';
  document.body.appendChild(videoElement);
  let mediaStream = null;

  let haswarned;
  function shouldwarn(){
    return !Scratch.vm.runtime.isPackaged;
  }

  class VideoSharing {
    getInfo() {
      return {
        id: 'p7videosharing',
        name: 'Video Sharing',
        color1: '#00a1ff',
        color2: '#006bff',
        blocks: [
          {
            opcode: 'startScreenSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Start screen sharing',
          },
          {
            opcode: 'startCameraSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Start camera sharing',
          },
          {
            opcode: 'stopSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Stop sharing video',
          },
          {
            opcode: 'getHEX',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get share HEX: rez [REZ]',
            arguments: {
              REZ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.1,
              },
            },
          },
          {
            opcode: 'getPNG',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get share PNG: rez [REZ]',
            arguments: {
              REZ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.5,
              },
            },
          },
          {
            opcode: 'getWEBP',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get share WEBP: rez [REZ] Quality [QUALITY]',
            arguments: {
              REZ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.5,
              },
              QUALITY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.7, 
              },
            },
          },
          {
            opcode: 'getJPEG',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get share JPEG: rez [REZ] Quality [QUALITY]',
            arguments: {
              REZ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.5,
              },
              QUALITY: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.7, 
              },
            },
          },
          {
            opcode: "showimage",
            blockType: Scratch.BlockType.COMMAND,
            text: "Show image [URL]",
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://extensions.turbowarp.org/dango.png",
              },
            },
          },
          {
            opcode: 'isSharing',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Is sharing?',
          },
          {
            opcode: 'canScreen',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'Can share screen?',
          },
          {
            opcode: 'getAspectRatio',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Stream Size',
          },
        ],
      };
    }

    async _createURLSkin(URL) {
      let imageData;
      if (await Scratch.canFetch(URL)) {
        imageData = await Scratch.fetch(URL);
      } else {
        return;
      }

      const contentType = imageData.headers.get("Content-Type");
      if (
        contentType === "image/png" ||
        contentType === "image/jpeg" ||
        contentType === "image/bmp" ||
        contentType === "image/webp"
      ) {
        // eslint-disable-next-line no-restricted-syntax
        const output = new Image();
        output.src = URL;
        output.crossOrigin = "anonymous";
        await output.decode();
        return renderer.createBitmapSkin(output);
      }
    }

    _refreshTargetsFromID(skinId, reset, newId) {
      const drawables = renderer._allDrawables;
      const skins = renderer._allSkins;

      for (const target of runtime.targets) {
        const drawableID = target.drawableID;
        const targetSkin = drawables[drawableID].skin.id;

        if (targetSkin === skinId) {
          target.updateAllDrawableProperties();
          if (!reset)
            drawables[drawableID].skin = newId ? skins[newId] : skins[skinId];
        }
      }
    }

    async showimage(args, util) {
      const name = "vidshareskin";
      const skinName = `lms-${Cast.toString(name)}`;
      const url = Cast.toString(args.URL);

      let oldSkinId = null;
      if (createdSkins[skinName]) {
        oldSkinId = createdSkins[skinName];
      }

      const skinId = await this._createURLSkin(url);
      if (!skinId) return;
      createdSkins[skinName] = skinId;

      if (oldSkinId) {
        this._refreshTargetsFromID(oldSkinId, false, skinId);
        renderer.destroySkin(oldSkinId);
      }

      this.setSkin({NAME:name}, util)
    }

    setSkin(args, util) {
      const skinName = `lms-${Cast.toString(args.NAME)}`;
      if (!createdSkins[skinName]) return;

      const targetName = Cast.toString(args.TARGET);
      const target = util.target;
      if (!target) return;
      const drawableID = target.drawableID;

      const skinId = createdSkins[skinName];
      renderer._allDrawables[drawableID].skin = renderer._allSkins[skinId];
    }

    restoreSkin(args, util) {
      const target = util.target;
      if (!target) return;
      target.updateAllDrawableProperties();
    }

    canScreen() {
      try {
        return navigator.mediaDevices && 'getDisplayMedia' in navigator.mediaDevices;
      } catch (error) {
        return false;
      }
    }
    
    stopSharing() {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
        videoElement.srcObject = null;
      }
    }

    isSharing() {
      return !!mediaStream && !!videoElement.srcObject;
    }

    warn(thing) {
      if (haswarned != thing) {
        if (window.confirm("Do you want to share your " + thing + "?")) {
          haswarned = thing;
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    startScreenSharing() {
      if (this.isSharing()) {
        this.stopSharing();
      }

      if (!this.canScreen()) {
        return;
      }

      if (shouldwarn()) {
        if (!this.warn("screen")) {
          return;
        }
      }
      
      return new Promise((resolve) => {
        navigator.mediaDevices
          .getDisplayMedia({ video: true })
          .then((stream) => {
            mediaStream = stream; 
            videoElement.srcObject = stream;
            videoElement.play();
            stream.getVideoTracks()[0].onended = function () {
              stream.getTracks().forEach((track) => {
                track.stop();
              });
              videoElement.srcObject = null;
              mediaStream = null;
            };
            resolve();
          })
          .catch((error) => {
            console.error('Error getting screen:', error);
            resolve();
          });
      });
    }

    startCameraSharing() {
      if (this.isSharing()) {
        this.stopSharing();
      }

      if (shouldwarn()) {
        if (!this.warn("camera")) {
          return;
        }
      }
      
      return new Promise((resolve, reject) => {
        navigator.mediaDevices
          .getUserMedia({ video: true })
          .then((stream) => {
            mediaStream = stream;
            videoElement.srcObject = stream;
            videoElement.play();
            stream.getVideoTracks()[0].onended = function () {
              mediaStream.getTracks().forEach((track) => {
                track.stop();
              });
              videoElement.srcObject = null;
              mediaStream = null;
            };
            resolve();
          })
          .catch((error) => {
            console.error('Error getting camera:', error);
            reject();
          });
      });
    }

    stopSharing() {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
        videoElement.srcObject = null;
      }
    }

    getHEX(args) {
      if (!this.isSharing()) {
        return;
      }
      
      var rez = args.REZ;
      if (rez > 1) {
        rez = 1;
      }
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = videoElement.videoWidth * rez;
      const height = videoElement.videoHeight * rez;
      canvas.width = width;
      canvas.height = height;

      context.drawImage(videoElement, 0, 0, width, height);

      const imageData = context.getImageData(0, 0, width, height).data;

      const hexColors = [];
      for (let i = 0; i < imageData.length; i += 4) {
        const r = imageData[i].toString(16).padStart(2, '0');
        const g = imageData[i + 1].toString(16).padStart(2, '0');
        const b = imageData[i + 2].toString(16).padStart(2, '0');
        hexColors.push(`#${r}${g}${b}`);
      }

      return hexColors;
    }

    getPNG(args) {
      if (!this.isSharing()) {
        return;
      }
      
      var rez = args.REZ;
      if (rez > 1) {
        rez = 1;
      }
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = videoElement.videoWidth * rez;
      const height = videoElement.videoHeight * rez;
      canvas.width = width;
      canvas.height = height;

      context.drawImage(videoElement, 0, 0, width, height);

      const dataURI = canvas.toDataURL('image/png');

      return dataURI;
    }

    getJPEG(args) {
      if (!this.isSharing()) {
        return;
      }
      
      let rez = args.REZ;
      if (rez > 1) {
        rez = 1;
      }
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = videoElement.videoWidth * rez;
      const height = videoElement.videoHeight * rez;
      canvas.width = width;
      canvas.height = height;

      context.drawImage(videoElement, 0, 0, width, height);

      const quality = args.QUALITY;
      const dataURI = canvas.toDataURL('image/jpeg', quality);

      return dataURI;
    }

    getWEBP(args) {
      if (!this.isSharing()) {
        return;
      }
      
      let rez = args.REZ;
      if (rez > 1) {
        rez = 1;
      }

      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      const width = videoElement.videoWidth * rez;
      const height = videoElement.videoHeight * rez;
      canvas.width = width;
      canvas.height = height;

      context.drawImage(videoElement, 0, 0, width, height);

      const quality = args.QUALITY;

      const dataURI = canvas.toDataURL('image/webp', quality);

      return dataURI;
    }

    getAspectRatio() {
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;
      return "["+width+", "+height+"]";
    }
  }

  Scratch.extensions.register(new VideoSharing());
})(Scratch);
