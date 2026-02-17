// id: spong
// name: spong
// description: tes
// by: mln1239 <https://penguinmod.com/profile?user=mln1239>
// license: MIT
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


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

    const ExtForge_Utils = {
        // from https://jwklong.github.io/extforge
        Broadcasts: new function() {
            this.raw_ = {};
            this.register = (name, blocks) => {
                this.raw_[name] = blocks;
            };
            this.execute = async (name) => {
                if (this.raw_[name]) {
                    await this.raw_[name]();
                };
            };
        }
    }
    class Extension {
        getInfo() {
            return {
                "id": "spong",
                "name": "spong",
                "color1": "#ffdd00",
                "color2": "#dfc311",
                "tbShow": true,
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: `s`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[s1]=[s2]`,
        arguments: {
            "s1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Text',
            },
            "s2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Text',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`s`] = async (args, util) => {
        return '{"' + args["s1"] + '=' + args["s2"] + '":"' + (args["s1"] == args["s2"]) + '"}'
    };

    blocks.push({
        opcode: `a`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[a1]===[a2]`,
        arguments: {
            "a1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Text',
            },
            "a2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Text',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`a`] = async (args, util) => {
        return '{"' + args["a1"] + '===' + args["a2"] + '":"' + (args["d1"] === args["d2"]) + '"}'
    };

    blocks.push({
        opcode: `d`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[d1]≠[d2]`,
        arguments: {
            "d2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Text',
            },
            "d1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Text',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`d`] = async (args, util) => {
        return '{"' + args["d1"] + '≠' + args["d2"] + '":"' + !(args["d1"] == args["d2"]) + '"}'
    };

    blocks.push({
        opcode: `w`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[w1]≠≠≠[w2]`,
        arguments: {
            "w1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Text',
            },
            "w2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Text',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`w`] = async (args, util) => {
        return '{"' + args["w1"] + '≠≠≠' + args["w2"] + '":"' + !(args["w1"] === args["w2"]) + '"}'
    };

    blocks.push({
        opcode: `u`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[u1]>[u2]`,
        arguments: {
            "u1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
            },
            "u2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '6',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`u`] = async (args, util) => {
        return '{"' + args["u1"] + '>' + args["u2"] + '":"' + (args["u1"] > args["u2"]) + '"}'
    };

    blocks.push({
        opcode: `e`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[e1]≥[e2]`,
        arguments: {
            "e1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
            },
            "e2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '6',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`e`] = async (args, util) => {
        return '{"' + args["e1"] + '≥' + args["e2"] + '":"' + ((args["e1"] > args["e2"]) || (args["e1"] == args["e2"])) + '"}'
    };

    blocks.push({
        opcode: `p`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[p1]<[p2]`,
        arguments: {
            "p1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
            },
            "p2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '6',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`p`] = async (args, util) => {
        return '{"' + args["p1"] + '<' + args["p2"] + '":"' + (args["p1"] < args["p2"]) + '"}'
    };

    blocks.push({
        opcode: `r`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[r1]≤[r2]`,
        arguments: {
            "r1": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '1',
            },
            "r2": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '6',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`r`] = async (args, util) => {
        return '{"' + args["r1"] + '≤' + args["r2"] + '":"' + ((args["r1"] < args["r2"]) || (args["r1"] == args["r2"])) + '"}'
    };

    blocks.push({
        opcode: `mt`,
        blockType: Scratch.BlockType.REPORTER,
        blockShape: Scratch.BlockShape.SCRAPPED,
        hideFromPalette: false,
        text: `[m]of[t]`,
        arguments: {
            "m": {
                type: Scratch.ArgumentType.STRING,
                menu: 'm'
            },
            "t": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Sprite1',
            },
        },
        disableMonitor: false
    });
    Extension.prototype[`mt`] = async (args, util) => {
        if ((args["m"] == 'x')) {
            return '{"' + 'x ":"' + (Scratch.vm.runtime.getSpriteTargetByName(args["t"]) !== undefined ? Scratch.vm.runtime.getSpriteTargetByName(args["t"]).x : 0) + '"}'
        } else {
            if ((args["m"] == 'y')) {
                return '{"' + 'y ":"' + (Scratch.vm.runtime.getSpriteTargetByName(args["t"]) !== undefined ? Scratch.vm.runtime.getSpriteTargetByName(args["t"]).y : 0) + '"}'
            } else {
                return '{"' + 'direction ":"' + (Scratch.vm.runtime.getSpriteTargetByName(args["t"]) !== undefined ? Scratch.vm.runtime.getSpriteTargetByName(args["t"]).direction : 0) + '"}'
            };
        };
    };

    menus["m"] = {
        acceptReporters: false,
        items: [{
            text: "x",
            value: "x"
        }, {
            text: "y",
            value: "y"
        }, {
            text: "direction",
            value: "z"
        }]
    }

    'x';

    Scratch.extensions.register(new Extension());
})(Scratch);
