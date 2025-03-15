// Video sharing (v2.5.2) by pooiod7

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

  function shouldwarn() {
    return !Scratch.vm.runtime.isPackaged;
  }

  function MakeWidget(html, pageTitle, width, height) {
    var accent = "#e01f1f";
    var backColor = "rgba(0, 0, 0, 0.7)";

    function getTheme() {
      function standardizeColor(color) {
        if (color.startsWith('#')) {
          let r = parseInt(color.slice(1, 3), 16);
          let g = parseInt(color.slice(3, 5), 16);
          let b = parseInt(color.slice(5, 7), 16);
          return `rgb(${r}, ${g}, ${b})`;
        } else if (color.startsWith('rgb')) {
          return color;
        } else if (color.startsWith('rgba')) {
          return color.slice(0, color.length - 4) + '1)';
        }
        return color;
      }

      try {
        accent = "#e01f1f";
        backColor = "rgba(0, 0, 0, 0.7)";
        var themeSetting = localStorage.getItem('tw:theme');
        var parsed = JSON.parse(themeSetting);
        if (parsed.accent === 'purple') {
          accent = '#855cd6';
        } else if (parsed.accent === 'blue') {
          accent = '#4c97ff';
        }
      } catch (err) {
        err = err;
      }

      if (document.querySelector("#app > div > div > div > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp")) {
        var accent2 = window.getComputedStyle(document.querySelector("#app > div > div > div > div.gui_menu-bar-position_3U1T0.menu-bar_menu-bar_JcuHF.box_box_2jjDp")).backgroundColor;
        if (accent2 && accent != "transparent") {
          accent = accent2;
        }
      }

      backColor = standardizeColor(accent).replace('rgb', 'rgba').replace(')', ', 0.7)');
    }
    getTheme();

    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = '0';
    overlay.style.left = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.backgroundColor = backColor;
    overlay.style.zIndex = '9999';
    overlay.id = "widgetoverlay";

    const wrapper = document.createElement('div');
    wrapper.style.position = 'absolute';
    wrapper.style.top = "50%";
    wrapper.style.left = "50%";
    wrapper.style.transform = 'translate(-50%, -50%)';
    wrapper.style.border = '4px solid rgba(255, 255, 255, 0.25)';
    wrapper.style.borderRadius = '13px';
    wrapper.style.padding = '0px';
    wrapper.style.width = width || '70vw';
    wrapper.style.height = height || '80vh';

    const modal = document.createElement('div');
    modal.style.padding = '0px';
    modal.style.borderRadius = '10px';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.textAlign = 'center';

    wrapper.appendChild(modal);

    const title = document.createElement('div');
    title.style.position = 'absolute';
    title.style.top = '0';
    title.style.left = '0';
    title.style.width = '100%';
    title.style.height = '50px';
    title.style.backgroundColor = accent;
    title.style.display = 'flex';
    title.style.justifyContent = 'center';
    title.style.alignItems = 'center';
    title.style.color = 'white';
    title.style.fontSize = '24px';
    title.style.borderTopLeftRadius = '10px';
    title.style.borderTopRightRadius = '10px';
    title.id = "WidgetTitle";
    title.innerHTML = pageTitle || "Widget";

    const widgetframe = document.createElement('div');
    widgetframe.style.width = '100%';
    widgetframe.style.height = `calc(100% - 50px)`;
    widgetframe.style.marginTop = '50px';
    widgetframe.style.border = 'none';
    widgetframe.id = "Widgetframe";
    widgetframe.name = 'Widgetframe';
    widgetframe.style.borderBottomLeftRadius = '10px';
    widgetframe.style.borderBottomRightRadius = '10px';
    widgetframe.style.backgroundColor = 'var(--ui-primary, white)';
    widgetframe.innerHTML = html;
    modal.appendChild(widgetframe);

    modal.appendChild(title);
    overlay.appendChild(wrapper);
    document.body.appendChild(overlay);
  }

  class VideoSharing {
    getInfo() {
      return {
        id: 'p7videosharing',
        name: 'Video Sharing',
        color1: '#00a1ff',
        color2: '#006bff',
        blocks: [{
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

    async showimage({
      URL
    }, util) {
      const target = util.target || util;
      if (!target) return;

      if (!URL) {
        this.restoreSkin({}, util);
      }

      var skins = renderer._allSkins;
      var drawables = renderer._allDrawables;

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
          } catch (e) {
            removeSkin = true;
            return `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/ep7rVQAAAAASUVORK5CYII=`;
          }
        }

        URL = await imageToDataURI(URL)
      }

      var doUpdate = skins[drawables[drawableID]._skin._id] && skins[drawables[drawableID]._skin._id].tmpSkin;

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
              drawables[drawableID]._skin &&
              skins[drawables[drawableID]._skin._id] &&
              skins[drawables[drawableID]._skin._id].tmpSkin
            ) {
              renderer.destroySkin(drawables[drawableID]._skin._id);
            }
          }
          target.updateAllDrawableProperties();
        }

        if (doUpdate) {
          renderer.updateBitmapSkin(drawables[drawableID]._skin._id, canvas, 2);
          renderer.updateDrawableSkinId(drawableID, drawables[drawableID]._skin._id);
        } else {
          const skinId = renderer.createBitmapSkin(canvas);
          skins[skinId].tmpSkin = true;
          renderer.updateDrawableSkinId(drawableID, skinId);
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

      var skins = renderer._allSkins;
      var drawables = renderer._allDrawables;

      if (
        drawables[drawableID]._skin &&
        skins[drawables[drawableID]._skin._id] &&
        skins[drawables[drawableID]._skin._id].tmpSkin
      ) {
        renderer.destroySkin(drawables[drawableID]._skin._id);
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
      return Scratch.Cast.toBoolean(mediaStream && videoElement.srcObject);
    }

    async warn(thing) {
      if (haswarned != thing) {

        if (document.getElementById("widgetoverlay")) {
          return false;
        }

        window.resolve8932902095902;
        var allow = new Promise((res, rej) => {
          window.resolve8932902095902 = res;
        });

        MakeWidget(`<div class="security-manager-modal_body_Pn7qy box_box_2jjDp" style="border-bottom-left-radius: 10px; border-bottom-right-radius: 10px; padding-bottom: 25px;">
            <div>
              <p><span>
                This project is is requesting access to your ${thing}.<br>Do you wish to allow this action?
              </span></p>
              <div class="load-extension_unsandboxed-warning_2iFhK"><span>
                If you say yes, your choice will be remembered until a new project is loaded, or the project asks for something else.
              </span></div>
            </div>
            <div class="security-manager-modal_buttons_1LSKA box_box_2jjDp">
              <button class="security-manager-modal_deny-button_3Vd-R" onclick='document.getElementById("widgetoverlay").remove(); window.resolve8932902095902(false);'><span>Deny</span></button>
              <button class="security-manager-modal_allow-button_3tcXk" onclick='document.getElementById("widgetoverlay").remove(); window.resolve8932902095902(true);'><span>Allow</span></button>
            </div>
          </div>`, "Extension Security", "500px", "259px");

        if (await allow) {
          haswarned = thing;
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    }

    async startScreenSharing() {
      if (this.isSharing()) {
        this.stopSharing();
      }

      if (!this.canScreen()) {
        return;
      }

      if (shouldwarn()) {
        if (!await this.warn("screen")) {
          return;
        }
      }

      return new Promise((resolve) => {
        navigator.mediaDevices
          .getDisplayMedia({
            video: true
          })
          .then((stream) => {
            mediaStream = stream;
            videoElement.srcObject = stream;
            videoElement.play();
            stream.getVideoTracks()[0].onended = function() {
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

    async startCameraSharing() {
      if (this.isSharing()) {
        this.stopSharing();
      }

      if (shouldwarn()) {
        if (!await this.warn("camera")) {
          return;
        }
      }

      return new Promise((resolve, reject) => {
        navigator.mediaDevices
          .getUserMedia({
            video: true
          })
          .then((stream) => {
            mediaStream = stream;
            videoElement.srcObject = stream;
            videoElement.play();
            stream.getVideoTracks()[0].onended = function() {
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
      return "[" + width + ", " + height + "]";
    }
  }

  Scratch.extensions.register(new VideoSharing());
})(Scratch);
