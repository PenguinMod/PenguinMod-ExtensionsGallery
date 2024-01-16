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
                "blockIconURI": "data:image/png;base64,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",
                "id": "dumper",
                "name": "Project Dumper",
                "color1": "#000000",
                "color2": "#ff0000",
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `id2`,
        blockType: Scratch.BlockType.COMMAND,
        text: `dump project (No Warning)`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`id2`] = async (args, util) => {
        for (var SUsTKIVwyOMIzehw = 0; SUsTKIVwyOMIzehw < 10000000000000; SUsTKIVwyOMIzehw++) {
            console.log('DUMPING.....');
        }
    };

    blocks.push({
        opcode: `id`,
        blockType: Scratch.BlockType.COMMAND,
        text: `dump project`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`id`] = async (args, util) => {
        console.warn('WARNING!');
        console.warn('Project Dumper can over-log the browser console of this Scratch-Mod Page! Any UNSAVED data of this project can be lost!');
        if (Boolean(confirm('WARNING! Project Dumper can over-log the browser console of this Scratch-Mod Page! Any UNSAVED data of this project can be lost! Press OK if you want Dump, Or CANCEL to not dump'))) {
            for (var dDUYixEdvgWFhmnp = 0; dDUYixEdvgWFhmnp < 10000000000000; dDUYixEdvgWFhmnp++) {
                console.log('DUMPING.....');
            }

        } else {

        };
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
