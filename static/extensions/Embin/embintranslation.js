// Name: Translation Keys
// ID: embintranslation
// Description: Use translation keys in your projects for multi-language support
// By: Embin <https://scratch.mit.edu/users/Embin/>
// License: MIT

(function (Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('"Translation Keys" must run unsandboxed');
    }

    const embin_translation_keys_version = 'v1.1.2';
    const Cast = Scratch.Cast;
    let selected_lang = navigator.language || navigator.userLanguage;
    let current_lang_data = Object.create(null);
    let languages = Object.create(null);
    languages[selected_lang] = Object.create(null);
    if (selected_lang != "en-US") languages["en-US"] = Object.create(null);
  
    class EmbinTranslation {
        getInfo() {
            return {
                id: 'embintranslation',
                name: 'Translation Keys',
                color1: '#00565b',
                color2: '#00494d',
                color3: '#00f4ff',
                blocks: [
                    {
                        opcode: 'get_user_language',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'user language code',
                        disableMonitor: false
                    },
                    {
                        opcode: 'get_selected_language',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'current selected language',
                        disableMonitor: false
                    },
                    '---',
                    {
                        opcode: 'get_translation_json',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get current translation data as json',
                        disableMonitor: true
                    },
                    {
                        opcode: 'get_all_translation_json',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get all translation data as json',
                        disableMonitor: true
                    },
                    {
                        opcode: 'set_translation_json',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set current translation data to json [json]',
                        arguments: {
                            json: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"block.stone":"Stone","block.air":"Air %s dud"}'
                            }
                        }
                    },
                    {
                        opcode: 'set_lang_translation_json',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set translation data of language [lang] to json [json]',
                        arguments: {
                            lang: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'en-US'
                            },
                            json: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: '{"block.stone":"Stone","block.air":"Air %s dud"}'
                            }
                        }
                    },
                    {
                        opcode: 'set_current_language',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set current language to [lang]',
                        arguments: {
                            lang: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'en-US'
                            }
                        }
                    },
                    {
                        opcode: 'clear_translations',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear current translation data'
                    },
                    {
                        opcode: 'clear_all_translations',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'clear all translations'
                    },
                    '---',
                    {
                        opcode: 'get_translation',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get translation [translation_key]',
                        disableMonitor: true,
                        arguments: {
                            translation_key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'block.stone'
                            }
                        }
                    },
                    {
                        opcode: 'get_translation_with_data',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'get translation [translation_key] with data [data]',
                        disableMonitor: true,
                        arguments: {
                            translation_key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'block.air'
                            },
                            data: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'soap'
                            }
                        }
                    },
                    '---',
                    {
                        opcode: 'add_translation',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'add translation key [key] with value [value] to current lang',
                        arguments: {
                            key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'block.stone'
                            },
                            value: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Stone'
                            }
                        }
                    },
                    {
                        opcode: 'remove_translation',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'remove translation key [key] from current lang',
                        arguments: {
                            key: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'block.stone'
                            }
                        }
                    },
                ]
            };
        }

        return_version (args) {
            return embin_translation_keys_version;
        }

        get_user_language (args) {
            return navigator.language || navigator.userLanguage;
        }

        get_translation (args) {
            let key = Cast.toString(args.translation_key);
            if (Object.keys(current_lang_data).includes(key)) return String(current_lang_data[key]);
            if (Object.keys(current_lang_data).includes("missingtranslation")) return this.get_translation_with_data({translation_key: "missingtranslation", data: key});
            return key;
        }

        get_translation_with_data (args) {
            let string = this.get_translation(args);
            let datas;
            let is_data_string = false;
            try {
                datas = JSON.parse(args.data);
                if (!Array.isArray(datas)) throw new Error("not array");
            } catch {
                datas = Cast.toString(args.data);
                is_data_string = true;
            }
            if (is_data_string) {
                //if (datas === "") return string;
                if (string.includes("%1$s")) return string.replaceAll("%1$s", datas);
                return string.replaceAll("%s", datas);
            } else {
                let mutated_string = string;
                for (let i = 0; i < datas.length; i++) {
                    let indexed_replace_key = "%" + String(i + 1) + "$s";
                    let thing = datas[i];
                    if (mutated_string.includes(indexed_replace_key)) {
                        mutated_string = mutated_string.replaceAll(indexed_replace_key, String(thing));
                    } else {
                        mutated_string = mutated_string.replace("%s", String(thing));
                    }
                }
                return mutated_string;
            }
        }

        get_translation_json (args) {
            return JSON.stringify(current_lang_data);
        }

        add_translation (args) {
            current_lang_data[Cast.toString(args.key)] = Cast.toString(args.value);
            if (!Object.hasOwn(languages, selected_lang)) languages[selected_lang] = {};
            languages[selected_lang][Cast.toString(args.key)] = Cast.toString(args.value);
        }

        set_translation_json (args) {
            let new_json = JSON.parse(args.json);
            if (!Array.isArray(new_json)) {
                current_lang_data = new_json;
                languages[selected_lang] = current_lang_data;
            }
        }

        
        serialize () {
            return { embintranslation: { current_lang_data: current_lang_data, languages: languages } };
        }

        deserialize (data) {
            if (data.embintranslation !== undefined) {
                current_lang_data = data.embintranslation.current_lang_data;
                languages = data.embintranslation.languages;
            }
        }
        

        remove_translation (args) {
            delete current_lang_data[Cast.toString(args.key)];
            delete languages[selected_lang][Cast.toString(args.key)];
        }

        clear_translations (args) {
            current_lang_data = Object.create(null);
            languages[selected_lang] = Object.create(null);
        }

        get_selected_language (args) {
            return selected_lang;
        }

        clear_all_translations (args) {
            languages = Object.create(null);
            current_lang_data = Object.create(null);
        }

        set_current_language (args) {
            selected_lang = Cast.toString(args.lang);
            if (!Object.hasOwn(languages, selected_lang)) languages[selected_lang] = Object.create(null);
            current_lang_data = languages[selected_lang];
        }

        get_all_translation_json (args) {
            return JSON.stringify(languages);
        }

        set_lang_translation_json (args) {
            let new_json = JSON.parse(args.json);
            if (!Array.isArray(new_json)) {
                languages[Cast.toString(args.lang)] = new_json;
                if (selected_lang == Cast.toString(args.lang)) current_lang_data = new_json;
            }
        }

    } // end of blocks code
    Scratch.extensions.register(new EmbinTranslation());
})(Scratch);
