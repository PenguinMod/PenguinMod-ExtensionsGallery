(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("This extension must run unsandboxed");
  }

  const icon =
    "https://raw.githubusercontent.com/TheShovel/MotionSprite/refs/heads/main/extension/icon.png";

  class MotionSprite {
    constructor() {
      this.ctx = null;
      this.runtime = null;
      this.spriteSkins = {};
      this.resolution = 100;

      this.canvas = document.createElement("canvas");
      this.canvas.width = 500;
      this.canvas.height = 500;
      this.ctx = this.canvas.getContext("2d", {
        alpha: true,
        premultipliedAlpha: false,
      });
      this.ctx.imageSmoothingEnabled = true;

      this.animFiles = [];
      this.animAssets = {};
      this.animAnims = {};
      this.animFunctions = {};
      this.animParts = {};
      this.compiledExpressions = {};
      this.expressionCache = {};
      this.lastFrameTime = 0;
      this.frameTimeCache = 0;
      this.animProperties = {};
      this.savedinProjectFiles = {};

      this.debugoutputlol = null;
      this.propertyNames = {
        "Animation intensity": "ai",
        "X velocity": "xvel",
        "Y velocity": "yvel",
        Time: "time",
      };

      // just in case i decide to add mutating blocks
      this.blocksArray = [
        {
          opcode: "openDocumentation",
          blockType: Scratch.BlockType.BUTTON,
          text: "Documentation",
        },
        {
          opcode: "openEditor",
          blockType: Scratch.BlockType.BUTTON,
          text: "Animation editor",
        },
        {
          opcode: "loadAnimation",
          blockType: Scratch.BlockType.COMMAND,
          text: "load file from [URL] as [NAME]",
          arguments: {
            URL: {
              type: Scratch.ArgumentType.STRING,
              defaultValue:
                "https://raw.githubusercontent.com/TheShovel/MotionSprite/refs/heads/main/examples/defaultGuy.qoan",
            },
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "anim",
            },
          },
        },
        {
          opcode: "deleteAnimation",
          blockType: Scratch.BlockType.COMMAND,
          text: "delete animation file [NAME]",
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "anim",
            },
          },
        },
        "---",
        {
          opcode: "renderAnim",
          blockType: Scratch.BlockType.COMMAND,
          text: "render animation [NAME] from [FILE]",
          arguments: {
            FILE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "anim",
            },
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "idle",
            },
          },
        },
        {
          opcode: "setProperty",
          blockType: Scratch.BlockType.COMMAND,
          text: "set [PROPERTY] of [FILE] to [VALUE]",
          arguments: {
            PROPERTY: {
              type: Scratch.ArgumentType.STRING,
              menu: "PROPMENU",
            },
            FILE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "anim",
            },
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: "1",
            },
          },
        },
        "---",
        {
          opcode: "animList",
          blockType: Scratch.BlockType.REPORTER,
          text: "loaded files",
          disableMonitor: true,
        },
        {
          opcode: "getAnims",
          blockType: Scratch.BlockType.REPORTER,
          text: "animations of [FILE]",
          arguments: {
            FILE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: "anim",
            },
          },
        },
        "---",
        {
          opcode: "renderResolution",
          blockType: Scratch.BlockType.COMMAND,
          text: "animation render resolution [SIZE]%",
          arguments: {
            SIZE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 100,
            },
          },
        },
        {
          opcode: "setSmooth",
          blockType: Scratch.BlockType.COMMAND,
          text: "animation anti aliasing [BOOL]",
          arguments: {
            BOOL: {
              type: Scratch.ArgumentType.BOOLEAN,
              menu: "BOOLMENU",
            },
          },
        },
        "---",
        {
          opcode: "dataLabel",
          blockType: Scratch.BlockType.LABEL,
          text: "In-project animation files",
        },
        {
          opcode: "openAnimManager",
          blockType: Scratch.BlockType.BUTTON,
          text: "Manage animation files",
        },
        {
          opcode: "animationFile",
          blockType: Scratch.BlockType.REPORTER,
          blockShape: Scratch.BlockShape.LEAF,
          text: "file[ANIM]",
          arguments: {
            ANIM: {
              type: Scratch.ArgumentType.STRING,
              menu: "LOCALANIMSMENU",
            },
          },
        },
      ];
    }

    getInfo() {
      return {
        id: "qoanrenderer",
        name: "MotionSprite 1.0-Beta",
        color1: "#6359d5",
        menuIconURI: icon,
        blockIconURI: icon,
        blocks: this.blocksArray,
        menus: {
          PROPMENU: {
            acceptReporters: false,
            items: ["Time", "Animation intensity", "X velocity", "Y velocity"],
          },
          BOOLMENU: {
            acceptReporters: false,
            items: ["true", "false"],
          },
          LOCALANIMSMENU: {
            acceptReporters: true,
            items: "getanimfilelist",
          },
        },
      };
    }
    openDocumentation() {
      window.open(
        "https://github.com/TheShovel/MotionSprite/blob/main/docs.md",
        "_blank",
      );
    }
    async openAnimManager() {
      const modal = await ScratchBlocks.customPrompt(
        {
          title: "MotionSprite file manager",
          scrollable: true,
        },
        {
          content: { width: "500px" },
        },
        [
          {
            name: "Import file",
            role: "ok",
            callback: () => this.loadProjectAnim(),
          },
        ],
      );
      const container = document.createElement("div");
      container.style.display = "flex";
      container.style.flexDirection = "column";
      container.style.gap = "10px";
      container.style.paddingBottom = "20px";
      container.style.justifyContent = "end";

      if (Object.keys(this.savedinProjectFiles).length === 0) {
        const noFilesLabel = document.createElement("label");
        noFilesLabel.textContent = "No files imported!";
        container.appendChild(noFilesLabel);
      } else {
        for (const key in this.savedinProjectFiles) {
          const fileContainer = document.createElement("div");
          const style = document.createElement("style");
          style.textContent = `
          .file-container {
            display: flex;
            flex-direction: row;
            align-items: center;
            background: transparent;
            padding: 5px;
            border-radius: 5px;
            outline: 2px solid var(--text-primary, hsla(225, 15%, 40%, 1));
          }
        `;
          document.head.appendChild(style);

          fileContainer.classList.add("file-container");
          const label = document.createElement("label");
          label.textContent = key;
          const deleteButton = document.createElement("button");
          deleteButton.textContent = "X";
          const buttonStyle = `
          color: white;
          background: hsla(194, 100%, 50%, 1);
          border: hsla(194, 100%, 50%, 1);
          border-radius: 5px;
          padding: 5px;
          margin-left: 5px;
        `;

          deleteButton.style.cssText = buttonStyle;
          deleteButton.onclick = () => {
            delete this.savedinProjectFiles[key];
            vm.extensionManager.refreshBlocks("qoanrenderer");
            fileContainer.remove();
          };

          const downloadButton = document.createElement("button");
          downloadButton.textContent = "Download";
          downloadButton.style.cssText = buttonStyle;
          downloadButton.onclick = () => {
            const base64Data = this.savedinProjectFiles[key];
            const byteString = atob(base64Data.split(",")[1]);
            const mimeString = base64Data
              .split(",")[0]
              .split(":")[1]
              .split(";")[0];
            const ab = new ArrayBuffer(byteString.length);
            const ia = new Uint8Array(ab);
            for (let i = 0; i < byteString.length; i++) {
              ia[i] = byteString.charCodeAt(i);
            }
            const blob = new Blob([ab], { type: mimeString });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = key + ".qoan";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          };

          label.style.marginRight = "auto";

          fileContainer.appendChild(label);
          fileContainer.appendChild(downloadButton);
          fileContainer.appendChild(deleteButton);
          container.appendChild(fileContainer);
        }
      }
      modal.appendChild(container);
    }
    openEditor() {
      window.open("https://theshovel.rocks/MotionSprite/", "_blank");
    }
    animationFile(args) {
      if (typeof this.savedinProjectFiles[args.ANIM] == "undefined") return "";
      return this.savedinProjectFiles[args.ANIM];
    }
    getanimfilelist() {
      if (Object.keys(this.savedinProjectFiles).length > 0) {
        return Object.keys(this.savedinProjectFiles);
      } else {
        return ["No files"];
      }
    }
    loadProjectAnim() {
      return new Promise((resolve, reject) => {
        const input = document.createElement("input");
        input.type = "file";
        input.accept = ".qoan";
        input.addEventListener("change", () => {
          if (input.files && input.files.length > 0) {
            const file = input.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
              this.savedinProjectFiles[file.name.replace(".qoan", "")] =
                e.target.result;
              vm.extensionManager.refreshBlocks("qoanrenderer");

              resolve(file);
            };
            reader.onerror = (error) => {
              reject(error);
            };
            reader.readAsDataURL(file);
          } else {
            reject(new Error("No file selected"));
          }
        });
        input.click();
      });
    }
    serialize() {
      return {
        savedAnims: this.savedinProjectFiles,
      };
    }
    deserialize(data) {
      this.savedinProjectFiles = data.savedAnims;
    }
    setProperty(args) {
      if (typeof this.animProperties[args.FILE] !== "undefined") {
        const prop = this.propertyNames[args.PROPERTY];
        let value = args.VALUE;

        switch (prop) {
          case "ai":
            value = Math.max(0, Math.min(1, value));
            break;
          case "yvel":
          case "xvel":
            value = Math.max(-1, Math.min(1, value)) * 0.25;
            break;
        }

        this.animProperties[args.FILE][prop] = value;
      }
    }

    setSmooth(args) {
      this.ctx.imageSmoothingEnabled = args.BOOL;
    }
    renderResolution(args) {
      this.resolution = Math.max(1, Math.min(500, args.SIZE));
      this.canvas.width = 500 * this.resolution * 0.01;
      this.canvas.height = 500 * this.resolution * 0.01;
    }
    getAnims(args) {
      if (vm.runtime.ext_qoanrenderer.animAnims[args.FILE + "anims"])
        return this.animAnims[args.FILE + "anims"];
      return "";
    }
    animList() {
      return JSON.stringify(this.animFiles);
    }
    async loadAnimation(args) {
      await fetch(args.URL)
        .then((r) => r.text())
        .then((text) => {
          const anim = JSON.parse(text);

          if (this.animFiles.includes(args.NAME))
            this.deleteAnimation({ NAME: args.NAME });
          this.animParts[args.NAME] = anim.parts;

          //load images
          const animImages = Object.keys(anim.images);

          this.animFiles.push(args.NAME);
          for (var i = 0; i < animImages.length; i++) {
            this.animAssets[args.NAME + animImages[i]] = new Image();
            this.animAssets[args.NAME + animImages[i]].src =
              anim.images[animImages[i]];
          }
          //create animProperties
          this.animProperties[args.NAME] = { ai: 0, xvel: 0, yvel: 0, time: 0 };
          //load animation functions
          const animFunctions = Object.keys(anim.animations);
          this.animAnims[args.NAME + "anims"] = JSON.stringify(
            Object.keys(anim.animations),
          );
          for (var i = 0; i < animFunctions.length; i++) {
            this.animFunctions[args.NAME + animFunctions[i]] =
              anim.animations[animFunctions[i]];
          }
          //cleanup data just in case
          for (var v = 0; v < animFunctions.length; v++) {
            const tempAnim = this.animFunctions[args.NAME + animFunctions[v]];
            const partKeys = Object.keys(tempAnim);
            for (var i = 0; i < partKeys.length; i++) {
              if (this.animParts[args.NAME][partKeys[i]] == undefined) {
                delete this.animFunctions[args.NAME + animFunctions[v]][
                  partKeys[i]
                ];
              }
            }
          }
        })
        .catch(() => "");
    }

    deleteAnimation(args) {
      if (!this.animFiles.includes(args.NAME)) return;

      // files list
      const index = this.animFiles.indexOf(args.NAME);
      if (index > -1) {
        this.animFiles.splice(index, 1);
      }

      //  assets
      const assetsToDelete = Object.keys(this.animAssets).filter((key) =>
        key.startsWith(args.NAME),
      );
      assetsToDelete.forEach((key) => {
        delete this.animAssets[key];
      });

      // animation functions
      const functionsToDelete = Object.keys(this.animFunctions).filter((key) =>
        key.startsWith(args.NAME),
      );
      functionsToDelete.forEach((key) => {
        delete this.animFunctions[key];
      });
      delete this.animProperties[args.NAME];

      // parts
      delete this.animParts[args.NAME];

      // animations list
      delete this.animAnims[args.NAME + "anims"];

      // compiled expressions cache
      const expressionsToDelete = Object.keys(this.compiledExpressions).filter(
        (key) => key.startsWith(args.NAME + "_"),
      );
      expressionsToDelete.forEach((key) => {
        delete this.compiledExpressions[key];
      });
    }

    compileExpression(expression, cacheKey) {
      if (this.compiledExpressions[cacheKey]) {
        return this.compiledExpressions[cacheKey];
      }

      try {
        const compiledFn = new Function(
          "mathFuncs",
          "time",
          "xvel",
          "yvel",
          "ai",
          `with(mathFuncs) { return ${expression}; }`,
        );
        this.compiledExpressions[cacheKey] = compiledFn;
        return compiledFn;
      } catch (error) {
        console.warn(`Failed to compile expression: ${expression}`, error);
        return () => 0;
      }
    }

    clearCanvas() {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    renderAnim(args, util) {
      if (!this.animFiles.includes(args.FILE)) return;
      if (!this.animFunctions[args.FILE + args.NAME]) return;
      const target = util.target;
      if (!target) return;

      const renderer = this.runtime.renderer;
      const drawableId = target.drawableID;
      if (drawableId === undefined) return;

      this.clearCanvas();

      const time = this.animProperties[args.FILE].time;
      const ai = this.animProperties[args.FILE].ai;
      const xvel = this.animProperties[args.FILE].xvel;
      const yvel = this.animProperties[args.FILE].yvel;

      const mathFuncs = {
        cos: Math.cos,
        sin: Math.sin,
        abs: Math.abs,
        sqrt: Math.sqrt,
        pow: Math.pow,
        max: Math.max,
        min: Math.min,
        clamp: (value, min, max) => Math.min(Math.max(value, min), max),
        round: Math.round,
        floor: Math.floor,
        ceil: Math.ceil,
        mod: (a, b) => ((a % b) + b) % b,
      };

      const tempAnim = this.animFunctions[args.FILE + args.NAME];
      const animPartsKeys = Object.keys(this.animParts[args.FILE]);
      const renderData = [];

      for (let i = 0; i < animPartsKeys.length; i++) {
        const partKey = animPartsKeys[i];
        if (!tempAnim[partKey]) continue;

        const part = tempAnim[partKey];

        if (!part.x || part.x.trim() === "") continue;

        const texture =
          this.animAssets[args.FILE + this.animParts[args.FILE][partKey]];
        if (!texture || !texture.complete) continue;

        const cacheKey = `${args.FILE}_${args.NAME}_${partKey}`;

        const xFn = this.compileExpression(part.x, `${cacheKey}_x`);
        const yFn = this.compileExpression(part.y, `${cacheKey}_y`);
        const rFn = this.compileExpression(part.r, `${cacheKey}_r`);
        const wFn = this.compileExpression(part.w, `${cacheKey}_w`);
        const hFn = this.compileExpression(part.h, `${cacheKey}_h`);

        const x = xFn(mathFuncs, time, xvel, yvel, ai);
        const y = 0 - yFn(mathFuncs, time, xvel, yvel, ai);
        const r =
          ((0 - rFn(mathFuncs, time, xvel, yvel, ai) + 90) * Math.PI) / 180;
        const w = wFn(mathFuncs, time, xvel, yvel, ai) * 0.01;
        const h = hFn(mathFuncs, time, xvel, yvel, ai) * 0.01;
        const size = this.resolution * 0.01;

        renderData.push({
          texture,
          x: x * size + this.canvas.width * 0.5,
          y: y * size + this.canvas.height * 0.5,
          rotation: r,
          width: texture.width * w * size,
          height: texture.height * h * size,
        });
      }

      this.ctx.globalCompositeOperation = "source-over";

      for (let i = 0; i < renderData.length; i++) {
        const data = renderData[i];

        // Save context before applying transforms
        this.ctx.save();

        // Move origin to image position
        this.ctx.translate(data.x, data.y);

        // Apply rotation
        this.ctx.rotate(data.rotation);

        // Handle flipping via scaling
        const scaleX = data.width < 0 ? -1 : 1;
        const scaleY = data.height < 0 ? -1 : 1;
        this.ctx.scale(scaleX, scaleY);

        // Draw image centered at origin
        this.ctx.drawImage(
          data.texture,
          -Math.abs(data.width) * 0.5,
          -Math.abs(data.height) * 0.5,
          Math.abs(data.width),
          Math.abs(data.height),
        );

        // Restore context after drawing
        this.ctx.restore();
      }

      this.ctx.setTransform(1, 0, 0, 1, 0, 0);

      const targetId = target.id;

      if (!this.spriteSkins[targetId]) {
        this.spriteSkins[targetId] = renderer.createBitmapSkin(
          this.canvas,
          1 * this.resolution * 0.01,
        );
      } else {
        const skin = renderer._allSkins[this.spriteSkins[targetId]];
        if (skin && skin._texture) {
          const gl = renderer.gl;
          gl.bindTexture(gl.TEXTURE_2D, skin._texture);
          gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
          gl.texImage2D(
            gl.TEXTURE_2D,
            0,
            gl.RGBA,
            gl.RGBA,
            gl.UNSIGNED_BYTE,
            this.canvas,
          );
        } else {
          renderer.destroySkin(this.spriteSkins[targetId]);
          this.spriteSkins[targetId] = renderer.createBitmapSkin(
            this.canvas,
            1,
          );
        }
      }

      renderer.updateDrawableSkinId(drawableId, this.spriteSkins[targetId]);
      renderer.dirty = true;
      this.runtime.requestRedraw();
    }
  }

  const motionSprite = new MotionSprite();
  motionSprite.runtime = Scratch.vm.runtime;
  Scratch.extensions.register(motionSprite);
})(Scratch);
