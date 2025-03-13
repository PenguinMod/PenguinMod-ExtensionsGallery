// Video sharing (v2.4.5) by pooiod7

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

      async showimage({ URL }, util) {
        const target = util.target || util;
        if (!target) return;

        if (!URL) {
          this.restoreSkin({}, util);
        }

        const drawableID = target.drawableID;

        var removeSkin = false;

        if (!URL.startsWith("data:")) {
          async function imageToDataURI(url) {
            try {
              const response = await fetch(url);
              const blob = await response.blob();
              return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
              });
            } catch(e) {
              removeSkin = true;
              return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ep7rVQAAAAASUVORK5CYII=`;
            }
          }

          URL = await imageToDataURI(URL)
        }

        var doUpdate = Scratch.vm.renderer._allSkins[Scratch.vm.renderer._allDrawables[drawableID]._skin._id] && Scratch.vm.renderer._allSkins[Scratch.vm.renderer._allDrawables[drawableID]._skin._id].tmpSkin;

        const image = new Image();
        image.onload = () => {
          var canvas = document.createElement("canvas");

          canvas.width = image.width;
          canvas.height = image.height;

          const ctx = canvas.getContext("2d");
          ctx.drawImage(image, 0, 0);

          if (removeSkin) {
            if (doUpdate) {
              if (
                Scratch.vm.renderer._allDrawables[drawableID]._skin && 
                Scratch.vm.renderer._allSkins[Scratch.vm.renderer._allDrawables[drawableID]._skin._id] &&
                Scratch.vm.renderer._allSkins[Scratch.vm.renderer._allDrawables[drawableID]._skin._id].tmpSkin
              ) {
                Scratch.vm.renderer.destroySkin(Scratch.vm.renderer._allDrawables[drawableID]._skin._id);
              }
            }
            target.updateAllDrawableProperties();
          }

          if (doUpdate) {
            Scratch.vm.renderer.updateBitmapSkin(Scratch.vm.renderer._allDrawables[drawableID]._skin._id, canvas, 2);
            Scratch.vm.renderer.updateDrawableSkinId(drawableID, Scratch.vm.renderer._allDrawables[drawableID]._skin._id);
          } else {
            const skinId = Scratch.vm.renderer.createBitmapSkin(canvas);
            Scratch.vm.renderer._allSkins[skinId].tmpSkin = true;
            Scratch.vm.renderer.updateDrawableSkinId(drawableID, skinId);
          }

          if (target.onTargetVisualChange) {
            target.onTargetVisualChange();
          }
        };
        image.src = Scratch.Cast.toString(URL);
      }

      restoreSkin(args, util) {
        const target = util.target;
        if (!target) return;
        const drawableID = target.drawableID;
        if (
          Scratch.vm.renderer._allDrawables[drawableID]._skin && 
          Scratch.vm.renderer._allSkins[Scratch.vm.renderer._allDrawables[drawableID]._skin._id] &&
          Scratch.vm.renderer._allSkins[Scratch.vm.renderer._allDrawables[drawableID]._skin._id].tmpSkin
        ) {
          Scratch.vm.renderer.destroySkin(Scratch.vm.renderer._allDrawables[drawableID]._skin._id);
        }
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
