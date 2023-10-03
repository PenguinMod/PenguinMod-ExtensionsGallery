// Screen sharing (v1.0) by pooiod7

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  // Create a hidden video element for screen sharing
  const videoElement = document.createElement('video');
  videoElement.style.display = 'none';
  document.body.appendChild(videoElement);

  let mediaStream = null;

  class ScreenSharing {
    getInfo() {
      return {
        id: 'screensharing',
        name: 'Screen Sharing',
      color1: '#00a1ff',
      color2: '#006bff',
        blocks: [
          {
            opcode: 'startScreenSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Start Screen Sharing',
          },
          {
            opcode: 'stopScreenSharing',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Stop Screen Sharing',
          },
          {
            opcode: 'getVideoImage',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get Video Image as Hex Colors with Resolution [REZ]',
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
            text: 'Get Frame as Data URI with Resolution [REZ]',
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
            text: 'Get Compressed rez [REZ] Quality [QUALITY]',
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
            text: 'Is Sharing?',
          },
          {
            opcode: 'getAspectRatio',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Stream Size',
          },
        ],
      };
    }

    startScreenSharing() {
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
