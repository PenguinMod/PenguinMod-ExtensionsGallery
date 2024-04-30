// Video sharing (v2.2.3) by pooiod7

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  const videoElement = document.createElement('video');
  videoElement.style.display = 'none';
  document.body.appendChild(videoElement);
  let mediaStream = null;

  let haswarned;
  function shouldwarn(){
    var should = typeof ScratchBlocks !== "undefined";
    should = should || window.location.hostname == 'studio.penguinmod.com';
    should = should || window.location.hostname == 'mirror.turbowarp.xyz';
    should = should || window.location.hostname == 'turbowarp.org';
    return should;
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
        if (window.confirm("Are you sure you want to share your " + thing + "?")) {
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
