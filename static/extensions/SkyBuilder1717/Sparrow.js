// Name: Sparrow
// ID: SkyBuilder1717Sparrow
// Description: Adds Sparrow V2 Spritesheet support with animations.
// By: SkyBuilder1717 <https://scratch.mit.edu/users/SkyBuilder1717/>
// License: MIT

(async function(Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Sparrow must run unsandboxed');
    }

    const sparrowData = {loadedSprites: {}, animationTimers: {}, currentFrames: {}};
    const runtime = Scratch.vm.runtime;
    const renderer = runtime.renderer;

    function _getSprite(name) {
        if (!sparrowData.loadedSprites) return null;
        return sparrowData.loadedSprites[name] || null;
    }

    function _removeSprite(name) {
        if (!sparrowData.loadedSprites) return;
        const spriteName = name.trim();
        if (sparrowData.animationTimers[spriteName]) {
            clearInterval(sparrowData.animationTimers[spriteName]);
            delete sparrowData.animationTimers[spriteName];
        }
        if (sparrowData.loadedSprites[name] != null && sparrowData.loadedSprites[name].skins != null) {
            for (var i = 0; i < (sparrowData.loadedSprites[name].skins).length; i++) {
                renderer.destroySkin(Object.values(sparrowData.loadedSprites[name].skins)[i]);
            }
        }
        delete sparrowData.loadedSprites[spriteName];
    }

    function _setFrame(target, skins, frame, name, sprite) {
        const skin = skins[name];
        if (!skin) {
            throw new Error("\"" + name + "\" not found")
        }
        renderer._allDrawables[target.drawableID].skin = renderer._allSkins[skin];
        sparrowData.currentFrames[target.getName()] = { frame: frame, name: name, sprite: sprite };
    }

    async function _playAnimation(target, spr, prefix, interval) {
        if (!target.drawableID) {
            console.error("target.drawableID is empty");
            return;
        }

        const sprite = _getSprite(spr);
        if (!sprite || !sprite.frames || sprite.frames.length === 0) {
            throw new Error("Spritesheet not found");
            return;
        }

        const skins = sprite.skins;
        if (!skins || Object.keys(skins).length === 0) {
            console.error("Rendered textures are not available");
            return;
        }

        const drawable = renderer._allDrawables[target.drawableID];
        if (!drawable) {
            console.error("Drawable not found for drawableID:", target.drawableID);
            return;
        }

        const timerKey = target.getName();

        if (!sparrowData.animationTimers[timerKey]) {
            sparrowData.animationTimers[timerKey] = {
                stopped: false,
                stopPromise: null,
                stopResolve: null,
            };
        }

        const controller = sparrowData.animationTimers[timerKey];
        controller.stopped = false;

        controller.stopPromise = new Promise(resolve => {
            controller.stopResolve = resolve;
        });

        const frameNames = Object.keys(skins)
            .filter(name => name.startsWith(prefix))
            .sort();

        if (frameNames.length === 0) {
            console.error("Frames with", prefix, "not found");
            return;
        }

        try {
            for (let frameIndex = 0; frameIndex < frameNames.length; frameIndex++) {
                if (controller.stopped) {
                    break;
                }

                const frameName = frameNames[frameIndex];
            
                _setFrame(target, skins, frameIndex, frameName, spr);

                await Promise.race([
                    new Promise(resolve => setTimeout(resolve, interval)),
                    controller.stopPromise,
                ]);

                if (controller.stopped) {
                    break;
                }
            }
        } catch (e) {
            throw new Error(e.message);
        }

        delete sparrowData.animationTimers[timerKey];
    }

    function _stopAnimation(util) {
        const target = util.target;
        if (!target) return;

        const timerKey = target.getName();
        const controller = sparrowData.animationTimers[timerKey];
        if (controller && !controller.stopped) {
            controller.stopped = true;
            if (controller.stopResolve) {
                controller.stopResolve();
            }
            delete sparrowData.animationTimers[timerKey];
        }
    }

    async function _costumeToImage(costume) {
        return new Promise(async (resolve, reject) => {
            try {
                const dataUrl = costume.asset.encodeDataURI();
                if (costume.dataFormat === 'svg') {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.onload = async () => {
                        try {
                            const canvas = document.createElement('canvas');
                            const width = costume.size[0];
                            const height = costume.size[1];
                            canvas.width = width;
                            canvas.height = height;
                            const ctx = canvas.getContext('2d');
                            ctx.clearRect(0, 0, width, height);
                            ctx.drawImage(img, 0, 0, width, height);
                            const pngDataUrl = canvas.toDataURL('image/png');

                            const pngImg = new Image();
                            pngImg.crossOrigin = "anonymous";
                            pngImg.src = pngDataUrl;
                            await pngImg.decode();
                            resolve(pngImg);
                        } catch (err) {
                            reject(err);
                        }
                    };
                    img.onerror = reject;
                    img.src = dataUrl;

                } else if (costume.dataFormat === 'bitmap') {
                    const img = new Image();
                    img.crossOrigin = "anonymous";
                    img.src = dataUrl;
                    await img.decode();
                    resolve(img);

                } else {
                    reject("Unsupported costume dataFormat: " + costume.dataFormat);
                }
            } catch (e) {
                reject(e);
            }
        });
    }

    async function _createSpriteSheetFromCostumes(costumes) {
        const canvas = document.createElement('canvas');

        let sheetWidth = 0;
        let sheetHeight = 0;
        for (let i = 0; i < costumes.length; i++) {
            const costume = costumes[i];
            sheetWidth += costume.size[0];
            if (costume.size[1] > sheetHeight) {
                sheetHeight = costume.size[1];
            }
        }

        canvas.width = sheetWidth;
        canvas.height = sheetHeight;
        const ctx = canvas.getContext('2d');

        const frames = [];
        let offsetX = 0;
        for (let i = 0; i < costumes.length; i++) {
            const costume = costumes[i];
            const frameWidth = costume.size[0];
            const frameHeight = costume.size[1];
            try {
                const img = await _costumeToImage(costume);
                ctx.drawImage(img, offsetX, 0, frameWidth, frameHeight);

                frames.push({
                    name: costume.name,
                    x: offsetX,
                    y: 0,
                    width: frameWidth,
                    height: frameHeight,
                    frameWidth: frameWidth,
                    frameHeight: frameHeight
                });

                offsetX += frameWidth;
            } catch (e) {
                throw new Error(e);
            }
        }

        return { base64: canvas.toDataURL('image/png'), frames: frames };
    }

    class SparrowExtension {
        getInfo() {
            return {
                id: "SkyBuilder1717Sparrow",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDBtbSIgaGVpZ2h0PSIxMDBtbSIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHZlcnNpb249IjEuMSIgaWQ9InN2ZzEiIGlua3NjYXBlOnZlcnNpb249IjEuNC4yIChmNDMyN2Y0LCAyMDI1LTA1LTEzKSIgc29kaXBvZGk6ZG9jbmFtZT0ic3BhcnJvd19sb2dvLnN2ZyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldyBpZD0ibmFtZWR2aWV3MSIgcGFnZWNvbG9yPSIjZmZmZmZmIiBib3JkZXJjb2xvcj0iI2NjY2NjYyIgYm9yZGVyb3BhY2l0eT0iMSIgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjAiIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIxIiBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIiBpbmtzY2FwZTpkZXNrY29sb3I9IiNkMWQxZDEiIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJtbSIgaW5rc2NhcGU6em9vbT0iMS40Mzc4MzY3IiBpbmtzY2FwZTpjeD0iMjU2Ljk4MzI5IiBpbmtzY2FwZTpjeT0iMTY5LjM1MTY0IiBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMDkiIGlua3NjYXBlOndpbmRvdy14PSItOCIgaW5rc2NhcGU6d2luZG93LXk9Ii04IiBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiLz4KICA8ZGVmcyBpZD0iZGVmczEiLz4KICA8ZyBpbmtzY2FwZTpsYWJlbD0i0KHQu9C+0LkgMSIgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIgaWQ9ImxheWVyMSI+CiAgICA8cmVjdCBzdHlsZT0iZmlsbDojZTMyYzUzO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDowLjEyOTc1NCIgaWQ9InJlY3QyIiB3aWR0aD0iNTAuMDI3OTE2IiBoZWlnaHQ9IjUwLjAyNzkxNiIgeD0iNC43NzUwMDAxIiB5PSI0NS4yMTQ2MDciLz4KICAgIDxyZWN0IHN0eWxlPSJmaWxsOiNlMzJjNTM7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMTI5NzU0IiBpZD0icmVjdDMiIHdpZHRoPSI0MS4zNDk2MDkiIGhlaWdodD0iNDEuMzQ5NjA5IiB4PSI1NC43OTg2NDEiIHk9IjMuODY1Ii8+CiAgPC9nPgo8L3N2Zz4=",
                blockIconURI: "data:image/svg+xml;base64,PHN2ZyB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNzcuOTUzIiBoZWlnaHQ9IjM3Ny45NTI3NiIgdmlld0JveD0iMCAwIDEwMC4wMDAwNyAxMDAiIHZlcnNpb249IjEuMSIgaWQ9InN2ZzEiIGlua3NjYXBlOnZlcnNpb249IjEuNC4yIChmNDMyN2Y0LCAyMDI1LTA1LTEzKSIgc29kaXBvZGk6ZG9jbmFtZT0ic3BhcnJvd19sb2dvX3doaXRlLnN2ZyI+CiAgPHNvZGlwb2RpOm5hbWVkdmlldyBpZD0ibmFtZWR2aWV3MSIgcGFnZWNvbG9yPSIjZmZmZmZmIiBib3JkZXJjb2xvcj0iI2NjY2NjYyIgYm9yZGVyb3BhY2l0eT0iMSIgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjAiIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIxIiBpbmtzY2FwZTpwYWdlY2hlY2tlcmJvYXJkPSIwIiBpbmtzY2FwZTpkZXNrY29sb3I9IiNhN2E3YTciIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJweCIgaW5rc2NhcGU6em9vbT0iMS40Mzc4MzY3IiBpbmtzY2FwZTpjeD0iMjU2Ljk4MzI5IiBpbmtzY2FwZTpjeT0iMTY5LjM1MTY0IiBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE5MjAiIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwMDkiIGlua3NjYXBlOndpbmRvdy14PSItOCIgaW5rc2NhcGU6d2luZG93LXk9Ii04IiBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIiBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJsYXllcjEiLz4KICA8ZGVmcyBpZD0iZGVmczEiLz4KICA8ZyBpbmtzY2FwZTpsYWJlbD0i0KHQu9C+0LkgMSIgaW5rc2NhcGU6Z3JvdXBtb2RlPSJsYXllciIgaWQ9ImxheWVyMSI+CiAgICA8cmVjdCBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZS13aWR0aDowLjEyOTc1NCIgaWQ9InJlY3QyIiB3aWR0aD0iNTAuMDI3OTE2IiBoZWlnaHQ9IjUwLjAyNzkxNiIgeD0iNC43NzUwMDAxIiB5PSI0NS4yMTQ2MDciLz4KICAgIDxyZWN0IHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlLXdpZHRoOjAuMTI5NzU0IiBpZD0icmVjdDMiIHdpZHRoPSI0MS4zNDk2MDkiIGhlaWdodD0iNDEuMzQ5NjA5IiB4PSI1NC43OTg2NDEiIHk9IjMuODY1Ii8+CiAgPC9nPgo8L3N2Zz4=",
                name: "Sparrow",
                color1: "#e32c53",
                color2: "#c42144ff",
                blocks: [
                    { blockType: Scratch.BlockType.LABEL, text: "Loading" },
                    {
                        opcode: "loadSparrowFilesAs",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "load PNG: [PNG] XML: [XML] as [SPRITENAME]",
                        arguments: {
                            PNG: { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com/spritesheet.png" },
                            XML: { type: Scratch.ArgumentType.STRING, defaultValue: "https://example.com/spritesheet.xml" },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    {
                        opcode: "createSpritesheetFromCostumes",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "create spritesheet from costumes as [SPRITENAME]",
                        arguments: { SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" } }
                    },
                    {
                        opcode: "onSpriteLoaded",
                        blockType: Scratch.BlockType.HAT,
                        text: "when sprite [SPRITENAME] loaded",
                        arguments: { SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" } }
                    },
                    {
                        opcode: "isSpriteLoaded",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "is sprite [SPRITENAME] loaded?",
                        arguments: { SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" } }
                    },
                    {
                        opcode: "deleteSprite",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete spritesheet [SPRITENAME]",
                        arguments: { SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }  }
                    },
                    {
                        opcode: "deleteSprites",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "delete all of spritesheets"
                    },
                    {
                        opcode: "getLoadedSprites",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "list of loaded sprites"
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Frame Count" },
                    {
                        opcode: "getFrameNames",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "get frame names as [SPRITENAME]",
                        arguments: { SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" } }
                    },
                    {
                        opcode: "getFrameCount",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "amount of frames for [SPRITENAME]",
                        arguments: { SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" } }
                    },
                    {
                        opcode: "getFrameCountPrefix",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "amount of frames for animation [PREFIX] as [SPRITENAME]",
                        arguments: {
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" },
                            PREFIX: { type: Scratch.ArgumentType.STRING, defaultValue: "" }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Frame Data" },
                    {
                        opcode: "getFrameName",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "frame name of [INDEX] as [SPRITENAME]",
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    {
                        opcode: "getFrameIndex",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "index of frame name [FRAME] as [SPRITENAME]",
                        arguments: {
                            FRAME: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    {
                        opcode: "getFrameProperty",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "property [PROPERTY] of frame [INDEX] as [SPRITENAME]",
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" },
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "frameProperties",
                                defaultValue: "x"
                            }
                        }
                    },
                    {
                        opcode: "getFramePropertyByName",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "property [PROPERTY] of frame named [FRAME] as [SPRITENAME]",
                        arguments: {
                            FRAME: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" },
                            PROPERTY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "frameProperties",
                                defaultValue: "x"
                            }
                        }
                    },
                    {
                        opcode: "getFrameIndexCycle",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "frame index [INDEX] as [SPRITENAME] (cyclic)",
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    {
                        opcode: "getFrameNameCycle",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "frame index [INDEX] with prefix [PREFIX] as [SPRITENAME] (cyclic)",
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            PREFIX: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    "---",
                    {
                        opcode: "getFrameImageIndex",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "base64 from frame [INDEX] as [SPRITENAME]",
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        } 
                    },
                    {
                        opcode: "getFrameImageName",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "base64 from frame name [FRAME] as [SPRITENAME]",
                        arguments: {
                            FRAME: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Animation" },
                    {
                        opcode: "getNextFrame",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "next frame after [INDEX] with animation [PREFIX] as [SPRITENAME]",
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            PREFIX: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    {
                        opcode: "getPrevFrame",
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: true,
                        text: "previous frame before [INDEX] with animation [PREFIX] as [SPRITENAME]",
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            PREFIX: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    {
                        opcode: "currentFrame",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "current frame index"
                    },
                    {
                        opcode: "currentFrameName",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "current frame name"
                    },
                    {
                        opcode: "currentSprite",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "current spritesheet"
                    },
                    {
                        opcode: "setFrameIndex",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set frame to [INDEX] as [SPRITENAME]",
                        arguments: {
                            INDEX: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    {
                        opcode: "setFrameName",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set frame name to [FRAME] as [SPRITENAME]",
                        arguments: {
                            FRAME: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" }
                        }
                    },
                    {
                        opcode: "playAnimation",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "play animation as [SPRITENAME] frames starting with [PREFIX] interval [INTERVAL] ms",
                        arguments: {
                            SPRITENAME: { type: Scratch.ArgumentType.STRING, defaultValue: "default" },
                            PREFIX: { type: Scratch.ArgumentType.STRING, defaultValue: "" },
                            INTERVAL: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 }
                        }
                    },
                    {
                        opcode: "stopAnimation",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "stop animation"
                    },
                    {
                        opcode: "resetSprite",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "reset default sprite"
                    }
                ],
                menus: {
                    frameProperties: ["x", "y", "width", "height", "frameX", "frameY", "frameWidth", "frameHeight"],
                }
            };
        }

        async loadSparrowFilesAs(args) {
            const name = args.SPRITENAME.trim();
            if (!name) {
                alert("Sprite name cannot be empty!");
                return;
            }
            try {
                const img = new Image();
                img.crossOrigin = "anonymous";
                const imgLoadPromise = new Promise((resolve, reject) => {
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error("Failed to load PNG"));
                });
                img.src = args.PNG;

                if (!Scratch.canFetch(args.XML)) throw new Error("Unable to fetch XML");

                const xmlResponse = await Scratch.fetch(args.XML);
                if (!xmlResponse.ok) throw new Error("Failed to load XML");
                const xmlText = await xmlResponse.text();

                const parser = new DOMParser();
                const xmlDoc = parser.parseFromString(xmlText, "application/xml");

                const subTextures = xmlDoc.getElementsByTagName("SubTexture");
                const frames = [];
                for (let i = 0; i < subTextures.length; i++) {
                    const st = subTextures[i];
                    frames.push({
                        name: st.getAttribute("name"),
                        x: parseInt(st.getAttribute("x")),
                        y: parseInt(st.getAttribute("y")),
                        width: parseInt(st.getAttribute("width")),
                        height: parseInt(st.getAttribute("height")),
                        frameX: st.hasAttribute("frameX") ? parseInt(st.getAttribute("frameX")) : 0,
                        frameY: st.hasAttribute("frameY") ? parseInt(st.getAttribute("frameY")) : 0,
                        frameWidth: st.hasAttribute("frameWidth") ? parseInt(st.getAttribute("frameWidth")) : parseInt(st.getAttribute("width")),
                        frameHeight: st.hasAttribute("frameHeight") ? parseInt(st.getAttribute("frameHeight")) : parseInt(st.getAttribute("height"))
                    });
                }

                if (!frames || frames.length === 0) {
                    throw new Error("frames are empty");
                }
                
                const imgLoad = await imgLoadPromise;

                const skins = {};
                for (let i = 0; i < frames.length; i++) {
                    const image = frames[i];
                    if (!image) {
                        console.warn(`frames[${i}] is undefined.`);
                        continue;
                    }

                    const frameWidth = image.frameWidth || image.width;
                    const frameHeight = image.frameHeight || image.height;

                    const canvas = document.createElement("canvas");
                    canvas.width = frameWidth;
                    canvas.height = frameHeight;
                    const ctx = canvas.getContext("2d");

                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(
                        imgLoad,
                        image.x, image.y, image.width, image.height,
                        - (image.frameX || 0), - (image.frameY || 0),
                        image.width, image.height
                    );

                    const frameImage = new Image();
                    await new Promise((resolve, reject) => {
                        frameImage.onload = resolve;
                        frameImage.onerror = reject;
                        frameImage.src = canvas.toDataURL();
                    });

                    await frameImage.decode();

                    const skin = renderer.createBitmapSkin(frameImage);
                    skins[image.name] = skin;
                }

                sparrowData.loadedSprites[name] = {
                    image: imgLoad,
                    frames: frames,
                    skins: skins,
                    hat: false
                };
            } catch (e) {
                delete sparrowData.loadedSprites[name];
                throw new Error(e.message);
            }
        }

        async createSpritesheetFromCostumes(args, util) {
            const name = args.SPRITENAME.trim();
            if (!name) {
                alert("Sprite name cannot be empty!");
                return;
            }
            const data = await _createSpriteSheetFromCostumes(util.target.getCostumes());
            const frames = data.frames
            const base64 = data.base64
            const img = new Image();
            img.crossOrigin = "anonymous";
            const imgLoadPromise = new Promise((resolve, reject) => {
                img.onload = () => resolve(img);
                img.onerror = () => reject(new Error("Failed to load costumes"));
            });
            img.src = base64;
            const imgLoad = await imgLoadPromise;

            const skins = {};
            for (let i = 0; i < frames.length; i++) {
                const image = frames[i];
                if (!image) {
                    console.warn(`frames[${i}] is undefined.`);
                    continue;
                }

                const frameWidth = image.frameWidth || image.width;
                const frameHeight = image.frameHeight || image.height;

                const canvas = document.createElement("canvas");
                canvas.width = frameWidth;
                canvas.height = frameHeight;
                const ctx = canvas.getContext("2d");

                ctx.clearRect(0, 0, canvas.width, canvas.height);
                ctx.drawImage(
                    imgLoad,
                    image.x, image.y, image.width, image.height,
                    - (image.frameX || 0), - (image.frameY || 0),
                    image.width, image.height
                );

                const frameImage = new Image();
                await new Promise((resolve, reject) => {
                    frameImage.onload = resolve;
                    frameImage.onerror = reject;
                    frameImage.src = canvas.toDataURL();
                });

                await frameImage.decode();

                const skin = renderer.createBitmapSkin(frameImage);
                skins[image.name] = skin;
            }

            sparrowData.loadedSprites[name] = {
                image: imgLoad,
                frames: frames,
                skins: skins,
                hat: false
            };
        }

        onSpriteLoaded(args) {
            const sprite = sparrowData.loadedSprites[args.SPRITENAME]
            if(!sprite) return false
            if(!sprite.hat) {
                return new Promise((res) => {
                    setTimeout(() => {
                        sprite.hat = true
                        res(true)
                    }, 1)
                })
            }
            return false
        }

        isSpriteLoaded(args) {
            return !!_getSprite(args.SPRITENAME);
        }

        async deleteSprite(args) { _removeSprite(args.SPRITENAME); }

        async deleteSprites() {
            for (var i = 0; i < Object.keys(sparrowData.loadedSprites).length; i++) {
                _removeSprite(Object.keys(sparrowData.loadedSprites)[i]);
            }
        }

        getLoadedSprites() {
            return JSON.stringify(Object.keys(sparrowData.loadedSprites));
        }

        getFrameNames(args) {
            const spr = _getSprite(args.SPRITENAME);
            if (!spr || !spr.frames) return '[]';
            return JSON.stringify(spr.frames.map(f => f.name));
        }

        getFrameCount(args) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr) return 0;
            return spr.frames.length;
        }

        getFrameCountPrefix(args) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr) return 0;
            if (!args.PREFIX) return spr.frames.length;
            const prefix = args.PREFIX;
            let count = 0;
            for (const frame of spr.frames) {
                if (frame.name.startsWith(prefix)) count++;
            }
            return count;
        }

        getFrameName(args) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr) return "";
            const idx = Math.floor(args.INDEX) - 1;
            if (idx < 0 || idx >= spr.frames.length) return "";
            return spr.frames[idx].name;
        }

        getFrameIndex(args) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr) return 0;
            const idx = spr.frames.findIndex(f => f.name === args.FRAME);
            return idx >= 0 ? idx + 1 : 0;
        }

        getFrameProperty(args) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr) return 0;
            const idx = Math.floor(args.INDEX) - 1;
            if (idx < 0 || idx >= spr.frames.length) return 0;
            const frame = spr.frames[idx];
            return frame[args.PROPERTY] || 0;
        }

        getFramePropertyByName(args) {
            const spr = _getSprite(args.SPRITENAME);
            if (!spr || !spr.frames) return "";
            const frame = spr.frames.find(f => f.name === args.FRAME);
            if (!frame) return "";
            const prop = args.PROPERTY.toLowerCase();
            return frame.hasOwnProperty(prop) ? frame[prop] : "";
        }

        getFrameIndexCycle(args) {
            const spr = _getSprite(args.SPRITENAME);
            if (!spr || !spr.frames) return 0;
            const len = spr.frames.length;
            if (len === 0) return 0;
            let idx = Math.floor(args.INDEX);
            idx = ((idx - 1) % len + len) % len + 1;
            return idx;
        }

        getFrameNameCycle(args) {
            const spr = _getSprite(args.SPRITENAME);
            if (!spr || !spr.frames) return 0;
            const prefix = args.PREFIX;
            const filteredFrames = spr.frames.filter(name => name.startsWith(prefix));
            const len = filteredFrames.length;
            if (len === 0) return 0;
            let idx = Math.floor(args.INDEX);
            idx = ((idx - 1) % len + len) % len + 1;
            return idx;
        }

        getFrameImageIndex(args) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr) return "";
            const idx = Math.floor(args.INDEX) - 1;
            if (idx < 0 || idx >= spr.frames.length) return "";

            const frame = spr.frames[idx];
            const canvas = document.createElement("canvas");
            canvas.width = frame.frameWidth;
            canvas.height = frame.frameHeight;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                spr.image,
                frame.x, frame.y, frame.width, frame.height,
                -frame.frameX, -frame.frameY, frame.width, frame.height
            );

            return canvas.toDataURL("image/png");
        }

        getFrameImageName(args) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr) return "";
            const frame = spr.frames.find(f => f.name === args.FRAME);
            if (!frame) return "";

            const canvas = document.createElement("canvas");
            canvas.width = frame.frameWidth;
            canvas.height = frame.frameHeight;
            const ctx = canvas.getContext("2d");

            ctx.drawImage(
                spr.image,
                frame.x, frame.y, frame.width, frame.height,
                -frame.frameX, -frame.frameY, frame.width, frame.height
            );

            return canvas.toDataURL("image/png");
        }

        getNextFrame(args) {
            const spr = _getSprite(args.SPRITENAME);
            if (!spr || !spr.frames) return 0;
            const prefix = args.PREFIX;
            const filteredFrames = spr.frames
                .filter(name => name.startsWith(prefix))
                .sort();

            if (filteredFrames.length === 0) return 0;
            const currentIdx = Math.floor(args.INDEX);
            const len = filteredFrames.length;
            let idx = ((currentIdx - 1) % len + len) % len;
            let nextIdx = (idx + 1) % len;
            return nextIdx + 1;
        }

        getPrevFrame(args) {
            const spr = _getSprite(args.SPRITENAME);
            if (!spr || !spr.frames) return 0;
            const prefix = args.PREFIX;
            const filteredFrames = spr.frames
                .filter(name => name.startsWith(prefix))
                .sort();

            if (filteredFrames.length === 0) return 0;
            const currentIdx = Math.floor(args.INDEX);

            const len = filteredFrames.length;
            let idx = ((currentIdx - 1) % len + len) % len;
            let prevIdx = (idx - 1 + len) % len;
            return prevIdx + 1;
        }

        currentFrame(_, util) {
            const currentFrame = sparrowData.currentFrames[util.target.getName()];
            if (!currentFrame || !currentFrame.frame) return 0;
            return currentFrame.frame;
        }

        currentFrameName(_, util) {
            const currentFrame = sparrowData.currentFrames[util.target.getName()];
            if (!currentFrame || !currentFrame.name) return '';
            return currentFrame.name;
        }

        currentSprite(_, util) {
            const currentFrame = sparrowData.currentFrames[util.target.getName()];
            if (!currentFrame || !currentFrame.sprite) return '';
            return currentFrame.sprite;
        }

        async setFrameIndex(args, util) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr || !spr.frames || spr.frames.length === 0) return;

            const idx = Math.floor(args.INDEX) - 1;
            if (idx < 0 || idx >= spr.frames.length) return;

            const frameName = spr.frames[idx].name;
            const skin = spr.skins;
            if (!skin) return;

            _setFrame(util.target, skin, idx, frameName, args.SPRITENAME.trim())
        }

        async setFrameName(args, util) {
            const spr = _getSprite(args.SPRITENAME.trim());
            if (!spr || !spr.frames || spr.frames.length === 0) return;

            const skin = spr.skins;
            if (!skin) return;
            const idx = spr.frames.findIndex(f => f.name === args.FRAME);

            _setFrame(util.target, skin, idx, args.FRAME, args.SPRITENAME.trim())
        }

        async playAnimation(args, util) {
            _stopAnimation(util);
            const target = util.target;
            if (!target) return;
            const spriteName = args.SPRITENAME.trim();
            const prefix = args.PREFIX.trim();
            if (!spriteName || !prefix) return;
            await _playAnimation(target, spriteName, prefix, parseInt(args.INTERVAL));
        }

        async stopAnimation(_, util) { _stopAnimation(util); }

        resetSprite(_, util) {
            const target = util.target;
            if (!target) return;
            target.updateAllDrawableProperties();
            delete sparrowData.currentFrames[target.getName()];
        }
    }

    Scratch.extensions.register(new SparrowExtension());
})(Scratch);