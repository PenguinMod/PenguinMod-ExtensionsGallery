/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("This extension needs to be unsandboxed to run!")
        return
    }

    function doSound(ab, cd, runtime) {
        const audioEngine = runtime.audioEngine;

        const fetchAsArrayBufferWithTimeout = (url) =>
            new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                let timeout = setTimeout(() => {
                    xhr.abort();
                    reject(new Error("Timed out"));
                }, 5000);
                xhr.onload = () => {
                    clearTimeout(timeout);
                    if (xhr.status === 200) {
                        resolve(xhr.response);
                    } else {
                        reject(new Error(`HTTP error ${xhr.status} while fetching ${url}`));
                    }
                };
                xhr.onerror = () => {
                    clearTimeout(timeout);
                    reject(new Error(`Failed to request ${url}`));
                };
                xhr.responseType = "arraybuffer";
                xhr.open("GET", url);
                xhr.send();
            });

        const soundPlayerCache = new Map();

        const decodeSoundPlayer = async (url) => {
            const cached = soundPlayerCache.get(url);
            if (cached) {
                if (cached.sound) {
                    return cached.sound;
                }
                throw cached.error;
            }

            try {
                const arrayBuffer = await fetchAsArrayBufferWithTimeout(url);
                const soundPlayer = await audioEngine.decodeSoundPlayer({
                    data: {
                        buffer: arrayBuffer,
                    },
                });
                soundPlayerCache.set(url, {
                    sound: soundPlayer,
                    error: null,
                });
                return soundPlayer;
            } catch (e) {
                soundPlayerCache.set(url, {
                    sound: null,
                    error: e,
                });
                throw e;
            }
        };

        const playWithAudioEngine = async (url, target) => {
            const soundBank = target.sprite.soundBank;

            let soundPlayer;
            try {
                const originalSoundPlayer = await decodeSoundPlayer(url);
                soundPlayer = originalSoundPlayer.take();
            } catch (e) {
                console.warn(
                    "Could not fetch audio; falling back to primitive approach",
                    e
                );
                return false;
            }

            soundBank.addSoundPlayer(soundPlayer);
            await soundBank.playSound(target, soundPlayer.id);

            delete soundBank.soundPlayers[soundPlayer.id];
            soundBank.playerTargets.delete(soundPlayer.id);
            soundBank.soundEffects.delete(soundPlayer.id);

            return true;
        };

        const playWithAudioElement = (url, target) =>
            new Promise((resolve, reject) => {
                const mediaElement = new Audio(url);

                mediaElement.volume = target.volume / 100;

                mediaElement.onended = () => {
                    resolve();
                };
                mediaElement
                    .play()
                    .then(() => {
                        // Wait for onended
                    })
                    .catch((err) => {
                        reject(err);
                    });
            });

        const playSound = async (url, target) => {
            try {
                if (!(await Scratch.canFetch(url))) {
                    throw new Error(`Permission to fetch ${url} denied`);
                }

                const success = await playWithAudioEngine(url, target);
                if (!success) {
                    return await playWithAudioElement(url, target);
                }
            } catch (e) {
                console.warn(`All attempts to play ${url} failed`, e);
            }
        };

        playSound(ab, cd)
    }
    class Extension {
        getInfo() {
            return {
                "id": "fpTriggers",
                "name": "Triggers",
                "color1": "#9dbd00",
                "color2": "#709900",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "whenTrigger",
        blockType: Scratch.BlockType.EVENT,
        text: "when trigger called",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["whenTrigger"] = async (args, util) => {};

    blocks.push({
        opcode: "sendTrigger",
        blockType: Scratch.BlockType.COMMAND,
        text: "send trigger to x[XPOS] y[YPOS] with size of[XSIZE] y[YSIZE]",
        arguments: {
            "XPOS": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "YPOS": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "XSIZE": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
            },
            "YSIZE": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["sendTrigger"] = async (args, util) => {
        variables['xpos'] = args["XPOS"]
        variables['ypos'] = args["YPOS"]
        variables['xsize'] = args["XSIZE"]
        variables['ysize'] = args["YSIZE"]
        variables['data'] = ""
        Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_whenTrigger`)
    };

    blocks.push({
        opcode: "sendTriggerWithData",
        blockType: Scratch.BlockType.COMMAND,
        text: "send trigger to x[XPOS] y[YPOS] with size of[XSIZE] y[YSIZE] with data[DATA]",
        arguments: {
            "XPOS": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "YPOS": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "XSIZE": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
            },
            "YSIZE": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 50,
            },
            "DATA": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'apple',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["sendTriggerWithData"] = async (args, util) => {
        variables['xpos'] = args["XPOS"]
        variables['ypos'] = args["YPOS"]
        variables['xsize'] = args["XSIZE"]
        variables['ysize'] = args["YSIZE"]
        variables['data'] = args["DATA"]
        Scratch.vm.runtime.startHats(`${Extension.prototype.getInfo().id}_whenTrigger`)
    };

    blocks.push({
        opcode: "isInTrigger",
        blockType: Scratch.BlockType.BOOLEAN,
        text: "is x[X] y[Y] in trigger",
        arguments: {
            "X": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "Y": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["isInTrigger"] = async (args, util) => {
        if (Boolean((((args["X"] > ((0 - variables['xsize']) + variables['xpos'])) && (args["X"] < (variables['xsize'] + variables['xpos']))) && ((args["Y"] > ((0 - variables['ysize']) + variables['ypos'])) && (args["Y"] < (variables['ysize'] + variables['ypos'])))))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: "isInTriggerData",
        blockType: Scratch.BlockType.REPORTER,
        text: "is x[X] y[Y] in trigger with data",
        arguments: {
            "X": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
            "Y": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["isInTriggerData"] = async (args, util) => {
        if (Boolean((((args["X"] > ((0 - variables['xsize']) + variables['xpos'])) && (args["X"] < (variables['xsize'] + variables['xpos']))) && ((args["Y"] > ((0 - variables['ysize']) + variables['ypos'])) && (args["Y"] < (variables['ysize'] + variables['ypos'])))))) {
            return variables['data']

        } else {
            return

        };
    };

    ((0 - variables['ysize']) + variables['ypos']);

    Scratch.extensions.register(new Extension());
})(Scratch);
