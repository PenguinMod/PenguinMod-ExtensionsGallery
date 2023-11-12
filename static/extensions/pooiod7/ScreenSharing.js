// Screen sharing (v1.0) by pooiod7

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  var canShareScreen = false;

  // Create a hidden video element for screen sharing
  const videoElement = document.createElement('video');
  videoElement.style.display = 'none';
  document.body.appendChild(videoElement);

  let mediaStream = null;

  class ScreenSharing {
    getInfo() {
      return {
        id: 'pooscreensharing',
        name: 'Screen Sharing',
        color1: '#00a1ff',
        color2: '#006bff',
        blocks: [
          {
            opcode: 'askToShare',
            blockType: Scratch.BlockType.COMMAND,
            text: 'ask to share screen',
          },
          {
            opcode: 'canShare',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'allowed to share screen?',
          },
          '---',
          {
            opcode: 'startScreenSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'start screen sharing',
          },
          {
            opcode: 'stopScreenSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'stop screen sharing',
          },
          {
            opcode: 'getVideoImage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get video image as hex colors with resolution [REZ]',
            arguments: {
              REZ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.1,
              },
            },
          },
          {
            opcode: 'getFrameDataURI',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get frame as data URI with resolution [REZ]',
            arguments: {
              REZ: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.5,
              },
            },
          },
          {
            opcode: 'getCompressedFrameDataURI',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get compressed rez [REZ] quality [QUALITY]',
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
            text: 'is sharing?',
          },
          {
            opcode: 'getAspectRatio',
            blockType: Scratch.BlockType.REPORTER,
            text: 'stream size',
          },
        ],
      };
    }

    askToShare() {
      if (!canShareScreen) {
        canShareScreen = confirm("This project would like to share your screen.");
      }
    }

    canShare() {
      return canShareScreen;
    }

    startScreenSharing() {
      if (canShareScreen) {
        navigator.mediaDevices
        .getDisplayMedia({ video: true })
        .then((stream) => {
          mediaStream = stream; 
          videoElement.srcObject = stream;
          videoElement.play();
        })
        .catch((error) => {
          console.error('Error starting screen sharing:', error);
        });
      } else {
        console.warn("Please run the 'ask to share' command before attempting to share the user's screen.");
      }
    }

    stopScreenSharing() {
      if (mediaStream) {
        mediaStream.getTracks().forEach((track) => {
          track.stop();
        });
        videoElement.srcObject = null;
      }
    }

    getVideoImage(args) {
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

    getFrameDataURI(args) {
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

    getCompressedFrameDataURI(args) {
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

    isSharing() {
      return !!mediaStream && !!videoElement.srcObject;
    }

    getAspectRatio() {
      const width = videoElement.videoWidth;
      const height = videoElement.videoHeight;
      return "["+width+", "+height+"]";
    }
  }

  Scratch.extensions.register(new ScreenSharing());
})(Scratch);
