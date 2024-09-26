(function(Scratch) {
    'use strict';

    const { vm, Cast, ArgumentType, BlockType } = Scratch;

    // cache for the lists
    const cache = new Map();

    // languages for the profanity list
    const languages = [
        { language: "Arabic", code: "ar" },
        { language: "Chinese", code: "zh" },
        { language: "Czech", code: "cs" },
        { language: "Danish", code: "da" },
        { language: "Dutch", code: "nl" },
        { language: "English", code: "en" },
        { language: "Esperanto", code: "eo" },
        { language: "Finnish", code: "fi" },
        { language: "French", code: "fr" },
        { language: "German", code: "de" },
        { language: "Hindi", code: "hi" },
        { language: "Hungarian", code: "hu" },
        { language: "Italian", code: "it" },
        { language: "Japanese", code: "ja" },
        { language: "Klingon", code: "tlh" },
        { language: "Korean", code: "ko" },
        { language: "Norwegian", code: "no" },
        { language: "Persian", code: "fa" },
        { language: "Polish", code: "pl" },
        { language: "Portuguese", code: "pt" },
        { language: "Russian", code: "ru" },
        { language: "Spanish", code: "es" },
        { language: "Swedish", code: "sv" },
        { language: "Thai", code: "th" },
        { language: "Turkish", code: "tr" }
    ];

    // bypass bypassers LOL
    const substitutions = {
        'a': ['@', '4', '/\\', '^'],
        'b': ['8', '13', '|3'],
        'c': ['(', '{', '[', '<'],
        'd': [')', '|)'],
        'e': ['3'],
        'g': ['6', '9'],
        'h': ['#', '|-|'],
        'i': ['1', '!', '|', '¡'],
        'l': ['1', '|', '£'],
        'o': ['0', '()', '°', '¤'],
        's': ['$', '5', '§'],
        't': ['+', '†'],
        'u': ['7'],
        'v': ['\\/'],
        'w': ['\\/\\/', 'VV'],
        'x': ['%', '><'],
        'z': ['2'],
    };

    // this literally just changes the chars
    function replaceSubstitutions(input) {
        let output = input;
    
        for (const [key, values] of Object.entries(substitutions)) {
            for (const value of values) {
                const regex = new RegExp(value.replace(/[-\/\\^$.*+?()[\]{}|]/g, '\\$&'), 'g');
                output = output.replace(regex, key);
            }
        }

        console.log(output);
        return output;
    }

    async function containsProfanity(inputStr, lang) {
        if (cache.has('custom')) {
            const badWordsList = cache.get('custom');
            const input = replaceSubstitutions(inputStr).toLowerCase();
            
            for (const word of badWordsList) {
                const regex = new RegExp(`\\b${word}\\b`, 'i');
                if (inputStr.match(regex) || input.match(regex)) {
                    return true;
                }
            }
        }
    
        if (!cache.has(lang)) {
            const response = await fetch('https://raw.githubusercontent.com/cicerorph/profanity/master/' + lang);
            const text = await response.text();
            const badWordsList = text.split('\n').map(word => word.trim().toLowerCase());
            cache.set(lang, badWordsList);
        }
    
        const badWordsList = cache.get(lang);
        const input = replaceSubstitutions(inputStr).toLowerCase();
    
        for (const word of badWordsList) {
            const regex = new RegExp(`\\b${word}\\b`, 'i');
            if (inputStr.match(regex) || input.match(regex)) {
                return true;
            }
        }
    
        return false;
    }
    
    async function censorText(inputStr, lang, symbol) {
        let censoredText = inputStr;
    
        if (cache.has('custom')) {
            const badWordsList = cache.get('custom');
            console.log(badWordsList);
    
            for (const word of badWordsList) {
                const regex = new RegExp(`\\b${word}\\b`, 'gi');
                censoredText = censoredText.replace(regex, '*'.repeat(word.length));
            }
    
            if (badWordsList.some(word => censoredText.includes('*'.repeat(word.length)))) {
                return censoredText;
            }
        }
    
        if (!cache.has(lang)) {
            const response = await fetch('https://raw.githubusercontent.com/cicerorph/profanity/master/' + lang);
            const text = await response.text();
            const badWordsList = text.split('\n').map(word => word.trim().toLowerCase());
            cache.set(lang, badWordsList);
        }
    
        const badWordsList = cache.get(lang);
    
        for (const word of badWordsList) {
            const regex = new RegExp(`\\b${word}\\b`, 'gi');
            censoredText = censoredText.replace(regex, symbol.repeat(word.length));
        }
    
        return censoredText;
    }
    

    async function loadCustomProfanityList(input) {
        const badWordsList = input.toLowerCase().split(',');
        console.log(badWordsList)
        cache.set('custom', badWordsList);
    }

    class MubiLopMouthWasher {
        getInfo() {
            return {
                id: "mubilopMouthWasher",
                name: "Mouth Washer",
                color1: '#afcf46',
                color2: '#8aa337',
                color3: '#617327',
                blocks: [
                    {
                        opcode: 'hasSwear',
                        blockType: BlockType.BOOLEAN,
                        text: '[TEXT] has a swear in [LANG]?',
                        arguments: {
                            TEXT: {
                                type: ArgumentType.STRING,
                                defaultValue: "Did I swear?"
                            },
                            LANG: {
                                type: ArgumentType.STRING,
                                menu: 'LANGS_MENU'
                            }
                        }
                    },
                    {
                        opcode: 'censor',
                        blockType: BlockType.REPORTER,
                        text: 'censor [TEXT] with [SYMBOL] in [LANG]',
                        arguments: {
                            TEXT: { type: ArgumentType.STRING, defaultValue: "Did I swear?" },
                            SYMBOL: { type: ArgumentType.STRING, defaultValue: "*" },
                            LANG: { type: ArgumentType.STRING, menu: 'LANGS_MENU' }
                        }
                    },
                    {
                        opcode: 'loadCustomProfanity',
                        blockType: BlockType.COMMAND,
                        text: 'load custom profanity list from [INPUT]',
                        arguments: {
                            INPUT: { type: ArgumentType.STRING, defaultValue: "badword1,badword2,badword3" }
                        }
                    }
                ],
                menus: {
                    LANGS_MENU: {
                        acceptReporters: false,
                        items: languages.map(entry => ({
                            text: entry.language,
                            value: entry.code
                        }))
                    }
                }
            };
        }

        async hasSwear({ TEXT, LANG }) {
            // Cast stuff
            TEXT = Cast.toString(TEXT);
            LANG = Cast.toString(LANG);

            return await containsProfanity(TEXT, LANG);
        }

        async censor({ TEXT, SYMBOL, LANG }) {
            TEXT = Cast.toString(TEXT);
            SYMBOL = Cast.toString(SYMBOL);
            LANG = Cast.toString(LANG);

            return await censorText(TEXT, LANG, SYMBOL);
        }

        async loadCustomProfanity({ INPUT }) {
            INPUT = Cast.toString(INPUT);
            await loadCustomProfanityList(INPUT);
        }
    }

    Scratch.extensions.register(new MubiLopMouthWasher());
})(Scratch);