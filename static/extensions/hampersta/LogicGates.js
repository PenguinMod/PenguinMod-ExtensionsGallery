(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];


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
                "id": "logicGates",
                "name": "Logic Gates",
                "color1": "#ffc800",
                "color2": "#cc8100",
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `andGate`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[bool1] and [bool2]`,
        arguments: {
            "bool1": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "bool2": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`andGate`] = async (args, util) => {
        if (Boolean((args["bool1"] && args["bool2"]))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: `orGate`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[bool1] or [bool2]`,
        arguments: {
            "bool1": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "bool2": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`orGate`] = async (args, util) => {
        if (Boolean((args["bool1"] || args["bool2"]))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: `xorGate`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[bool1] xor [bool2]`,
        arguments: {
            "bool1": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "bool2": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`xorGate`] = async (args, util) => {
        if (Boolean((args["bool1"] && args["bool2"]))) {
            return false

        } else {
            if (Boolean(!(args["bool1"] || args["bool2"]))) {
                return false

            } else {
                return true

            };

        };
    };

    blocks.push({
        opcode: `nandGate`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[bool1] nand [bool2]`,
        arguments: {
            "bool1": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "bool2": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`nandGate`] = async (args, util) => {
        if (Boolean((args["bool1"] && args["bool2"]))) {
            return false

        } else {
            if (Boolean(!(args["bool1"] && args["bool2"]))) {
                return true
            };

        };
    };

    true;

    blocks.push({
        opcode: `norGate`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[bool1] nor [bool2]`,
        arguments: {
            "bool1": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "bool2": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`norGate`] = async (args, util) => {
        if (Boolean(!(args["bool1"] || args["bool2"]))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: `xnorGate`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[bool1] xnor [bool2]`,
        arguments: {
            "bool1": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "bool2": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`xnorGate`] = async (args, util) => {
        if (Boolean((args["bool1"] && args["bool2"]))) {
            return true

        } else {
            if (Boolean(!(args["bool1"] || args["bool2"]))) {
                return true

            } else {
                return false

            };

        };
    };

    blocks.push({
        opcode: `notGate`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `not [bool]`,
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`notGate`] = async (args, util) => {
        if (Boolean(!args["bool"])) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: `bufferGate`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `buffer [bool]`,
        arguments: {
            "bool": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`bufferGate`] = async (args, util) => {
        if (Boolean(!args["bool"])) {
            return false

        } else {
            return true

        };
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
