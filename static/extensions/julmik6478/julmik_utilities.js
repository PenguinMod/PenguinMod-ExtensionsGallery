/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = [];


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
                "id": "julmikutilitesstb",
                "name": "Jul Mik Utilities",
                "color1": "#89b235",
                "color2": "#728745",
                "color3": "#516822",
                "blocks": blocks,
                menus: {
                    // Définition du menu pour argument
                    times: ['ms', 'sec', 'minutes', 'hours', 'days', 'weeks', 'months', 'years', 'leap years', 'decades', 'centuries', 'millenniums']
                }
            }
        }
    }
    blocks.push({
        opcode: `color`,
        blockType: Scratch.BlockType.REPORTER,
        text: `color [color]`,
        arguments: {
            "color": {
                type: Scratch.ArgumentType.COLOR,
                defaultValue: '#ff0000',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`color`] = async (args, util) => {
        return args["color"]
    };

    blocks.push({
        opcode: `ms1970`,
        blockType: Scratch.BlockType.REPORTER,
        text: `time (ms) since 1970`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`ms1970`] = async (args, util) => {
        return Date.now()
    };

    blocks.push({
        opcode: `waittime`,
        blockType: Scratch.BlockType.COMMAND,
        text: `wait [time] [timemenu]`,
        arguments: {
            "time": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1,
            },
            "timemenu": {
                type: Scratch.ArgumentType.STRING,
                menu: "times",
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`waittime`] = async function(args, util) {
        let timeToWait = 0;
        const timeUnitToMilliseconds = {
            "ms": 1,
            "sec": 1000,
            "minutes": 60 * 1000,
            "hours": 60 * 60 * 1000,
            "days": 24 * 60 * 60 * 1000,
            "weeks": 7 * 24 * 60 * 60 * 1000,
            "months": 30 * 24 * 60 * 60 * 1000, // Approximation
            "years": 365.25 * 24 * 60 * 60 * 1000, // Compte pour une année bissextile tous les quatre ans
            "leap years": 366 * 24 * 60 * 60 * 1000,
            "decades": 10 * 365.25 * 24 * 60 * 60 * 1000,
            "centuries": 100 * 365.25 * 24 * 60 * 60 * 1000, // Simplification pour les siècles
            "millenniums": 1000 * 365.25 * 24 * 60 * 60 * 1000 // Ajout de millénaires
        };
    
        if (args["timemenu"] in timeUnitToMilliseconds) {
            // Pour `millenniums`, `args["m"]` est déjà multiplié par 1000 dans les conversions
            timeToWait = args["time"] * timeUnitToMilliseconds[args["timemenu"]];
            await new Promise(resolve => setTimeout(resolve, timeToWait));
        } else {
            console.error("Unrecognized time unit: " + args["timemenu"]);
        }
    };

    blocks.push({
        opcode: `isleapyear`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `is leap year?`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`isleapyear`] = async (args, util) => {
        return ((new Date(new Date(Date.now()).getYear(), 1, 29)).getDate() === 29)
    };

    blocks.push({
        opcode: `null`,
        blockType: Scratch.BlockType.REPORTER,
        text: `null`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`null`] = async (args, util) => {
        return null
    };

    blocks.push({
        opcode: `ifthenelsereporter`,
        blockType: Scratch.BlockType.REPORTER,
        text: `if [boolean] then [then] else [else]`,
        arguments: {
            "boolean": {
                type: Scratch.ArgumentType.BOOLEAN,
            },
            "then": {
                type: Scratch.ArgumentType.STRING,
            },
            "else": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`ifthenelsereporter`] = async (args, util) => {
        return (args["boolean"] ? args["then"] : args["else"])
    };

    blocks.push({
        opcode: `confirm`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `confirm [text]`,
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Are you sure?',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`confirm`] = async (args, util) => {
        return confirm(args["text"])
    };

    blocks.push({
        opcode: `alert`,
        blockType: Scratch.BlockType.COMMAND,
        text: `alert [text]`,
        arguments: {
            "text": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Hello, World!',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`alert`] = async (args, util) => {
        alert(args["text"])
    };

    blocks.push({
        opcode: `root`,
        blockType: Scratch.BlockType.REPORTER,
        text: `[1] root [2]`,
        arguments: {
            "1": {
                type: Scratch.ArgumentType.NUMBER,
            },
            "2": {
                type: Scratch.ArgumentType.NUMBER,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`root`] = async (args, util) => {
        return (args["1"] ** (1 / args["2"]))
    };

    blocks.push({
        opcode: `log`,
        blockType: Scratch.BlockType.REPORTER,
        text: `[1] log [2]`,
        arguments: {
            "1": {
                type: Scratch.ArgumentType.NUMBER,
            },
            "2": {
                type: Scratch.ArgumentType.NUMBER,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`log`] = async (args, util) => {
        return (Math.log(args["2"]) / Math.log(args["1"]))
    };

    blocks.push({
        opcode: `thirtyequals`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[1] === [2]`,
        arguments: {
            "1": {
                type: Scratch.ArgumentType.STRING,
            },
            "2": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`thirtyequals`] = async (args, util) => {
        return (args["1"] === args["2"])
    };

    blocks.push({
        opcode: `randomboolean`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `random`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`randomboolean`] = async (args, util) => {
        if (Boolean((Math.floor(Math.random() * (1 - 0 + 1) + 0) == 0))) {
            return false

        } else {
            return true

        };
    };


    Scratch.extensions.register(new Extension());
})(Scratch);