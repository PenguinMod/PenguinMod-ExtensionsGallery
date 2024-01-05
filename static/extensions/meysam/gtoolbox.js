/*
   This extension was made with TurboBuilder!
   https://turbobuilder-steel.vercel.app/
*/
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
                "id": "Gtoolbox",
                "name": "Gtoolbox 2.5",
                "color1": "#0088ff",
                "color2": "#0063ba",
                "blocks": blocks
            }
        }
    }
    blocks.push({
        opcode: `StrictlyEqual`,
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
    Extension.prototype[`StrictlyEqual`] = async (args, util) => {
        return (args["1"] === args["2"])
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
        opcode: `LeapYear`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `is leap year?`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`LeapYear`] = async (args, util) => {
        return ((new Date(new Date(Date.now()).getYear(), 1, 29)).getDate() === 29)
    };

    blocks.push({
        opcode: `GreatOrLess`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `[1a] >< [2a]`,
        arguments: {
            "1a": {
                type: Scratch.ArgumentType.NUMBER,
            },
            "2a": {
                type: Scratch.ArgumentType.NUMBER,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`GreatOrLess`] = async (args, util) => {
        if (Boolean(((args["1a"] < args["2a"]) || (args["1a"] > args["2a"])))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: `YearToMoonYears`,
        blockType: Scratch.BlockType.REPORTER,
        text: `[year] to moon years`,
        arguments: {
            "year": {
                type: Scratch.ArgumentType.NUMBER,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`YearToMoonYears`] = async (args, util) => {
        return ((args["year"] * 365) / 27)
    };

    blocks.push({
        opcode: `AlertBlock`,
        blockType: Scratch.BlockType.COMMAND,
        text: `alert [AlertInput]`,
        arguments: {
            "AlertInput": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'allahu akbar!',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`AlertBlock`] = async (args, util) => {
        alert(args["AlertInput"])
    };

    blocks.push({
        opcode: `PromptBlock`,
        blockType: Scratch.BlockType.REPORTER,
        text: `prompt [PromptInput]`,
        arguments: {
            "PromptInput": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`PromptBlock`] = async (args, util) => {
        return prompt(args["PromptInput"])
    };

    blocks.push({
        opcode: `ConfirmBlock`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `confirm [ComfirmInput]`,
        arguments: {
            "ComfirmInput": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'are you the haram person?',
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`ConfirmBlock`] = async (args, util) => {
        return confirm(args["ComfirmInput"])
    };

    blocks.push({
        opcode: `RandomBooleaqn`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `random`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`RandomBooleaqn`] = async (args, util) => {
        if (Boolean((Math.floor(Math.random() * (2 - 1 + 1) + 1) == 1))) {
            return true

        } else {
            return false

        };
    };

    blocks.push({
        opcode: `Chance`,
        blockType: Scratch.BlockType.REPORTER,
        text: `return [input1] by [chance] or return [input2]`,
        arguments: {
            "input1": {
                type: Scratch.ArgumentType.STRING,
            },
            "input2": {
                type: Scratch.ArgumentType.STRING,
            },
            "chance": {
                type: Scratch.ArgumentType.NUMBER,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`Chance`] = async (args, util) => {
        if (Boolean((Math.floor(Math.random() * (args["chance"] - 1 + 1) + 1) == 1))) {
            return args["input1"]

        } else {
            return args["input2"]

        };
    };

    blocks.push({
        opcode: `ConsoleLog`,
        blockType: Scratch.BlockType.COMMAND,
        text: `log [input1]`,
        arguments: {
            "input1": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`ConsoleLog`] = async (args, util) => {
        if (Boolean(confirm('this doesnt work on mobile, so please avoid this'))) {
            console.log(args["input1"]);
        };
    };

    blocks.push({
        opcode: `ConsoleWarn`,
        blockType: Scratch.BlockType.COMMAND,
        text: `warn [input2]`,
        arguments: {
            "input2": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`ConsoleWarn`] = async (args, util) => {
        if (Boolean(confirm('this doesnt work on mobile, so please avoid this'))) {
            console.warn(args["input2"]);
        };
    };

    blocks.push({
        opcode: `ConsoleError`,
        blockType: Scratch.BlockType.COMMAND,
        text: `error [input3]`,
        arguments: {
            "input3": {
                type: Scratch.ArgumentType.STRING,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`ConsoleError`] = async (args, util) => {
        if (Boolean(confirm('this doesnt work on mobile, so please avoid this'))) {
            console.error(args["input3"]);
        };
    };

    blocks.push({
        opcode: `GTBlicense`,
        blockType: Scratch.BlockType.REPORTER,
        text: `license`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`GTBlicense`] = async (args, util) => {
        return (('!  * Copyright ' + (new Date(Date.now()).getFullYear())) + ' meysam  *   * Licensed under the Apache License, Version 2.0 (the "License");  * you may not use this file except in compliance with the License.  * You may obtain a copy of the License at  *  *   http://www.apache.org/licenses/LICENSE-2.0  *   * Unless required by applicable law or agreed to in writing, software  * distributed under the License is distributed on an "AS IS" BASIS,  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.  * See the License for the specific language governing permissions and  * limitations under the License.')
    };

    blocks.push({
        opcode: `RepeatText`,
        blockType: Scratch.BlockType.REPORTER,
        text: `repeat [Text1] [repeater1] times`,
        arguments: {
            "Text1": {
                type: Scratch.ArgumentType.STRING,
            },
            "repeater1": {
                type: Scratch.ArgumentType.NUMBER,
            },
        },
        disableMonitor: true
    });
    Extension.prototype[`RepeatText`] = async (args, util) => {
        variables['text1'] = ''
        for (var IMdEKmURnGedFWfr = 0; IMdEKmURnGedFWfr < args["repeater1"]; IMdEKmURnGedFWfr++) {
            variables['text1'] = (variables['text1'] + args["Text1"])
        }
        return variables['text1']
    };

    blocks.push({
        opcode: `pi`,
        blockType: Scratch.BlockType.REPORTER,
        text: `pi`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`pi`] = async (args, util) => {
        return '3.14159265359'
    };

    blocks.push({
        opcode: `phi`,
        blockType: Scratch.BlockType.REPORTER,
        text: `phi`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`phi`] = async (args, util) => {
        return '1.61803398875'
    };

    blocks.push({
        opcode: `euler`,
        blockType: Scratch.BlockType.REPORTER,
        text: `euler`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`euler`] = async (args, util) => {
        return '2.718281828459045'
    };

    blocks.push({
        opcode: `daler`,
        blockType: Scratch.BlockType.REPORTER,
        text: `daler`,
        arguments: {},
        disableMonitor: true
    });
    Extension.prototype[`daler`] = async (args, util) => {
        return '4.918456284'
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
