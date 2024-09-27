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

    const icon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMTUuNjU5MzYiIGhlaWdodD0iMzQ3LjA2OTMzIiB2aWV3Qm94PSIyLjc1LDIuNzUsMzE1LjY1OTM2LDM0Ny4wNjkzMyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTc5LjQyMDMyLC0zLjcxNTMzKSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSIjYWZjZjQ2IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTI2OC4yODMwNiwzMS4wMzIyMWMwLDEzLjQ4OTQ1IC0xMS4wOTIzMiwyNC41NjY4OCAtMjQuNTY2ODgsMjQuNTY2ODhjLTEzLjQ3NDU2LDAgLTI0LjU2Njg4LC0xMS4wNzc0MyAtMjQuNTY2ODgsLTI0LjU2Njg4YzAsLTEzLjQ4OTQ1IDExLjA5MjMyLC0yNC41NjY4OCAyNC41NjY4OCwtMjQuNTY2ODhjMTMuNDc0NTYsMCAyNC41NjY4OCwxMS4wNzc0MyAyNC41NjY4OCwyNC41NjY4OHpNMjMyLjU0OTQxLDMxLjAzMjIxYzAsNi4yNDU5NCA0LjkxMzM4LDExLjE2Njc2IDExLjE2Njc2LDExLjE2Njc2YzYuMjUzMzksMCAxMS4xNjY3NiwtNC45MjA4MiAxMS4xNjY3NiwtMTEuMTY2NzZjMCwtNi4yNDU5NCAtNC45MTMzOCwtMTEuMTY2NzYgLTExLjE2Njc2LC0xMS4xNjY3NmMtNi4yNTMzOSwwIC0xMS4xNjY3Niw0LjkyMDgyIC0xMS4xNjY3NiwxMS4xNjY3NnpNMTMxLjMwNDA4LDc0LjIxMDM3YzAsMTMuNDc0NTYgLTExLjA3NzQzLDI0LjU2Njg4IC0yNC41NjY4OCwyNC41NjY4OGMtMTMuNDg5NDUsMCAtMjQuNTY2ODgsLTExLjA5MjMyIC0yNC41NjY4OCwtMjQuNTY2ODhjMCwtMTMuNDg5NDUgMTEuMDc3NDMsLTI0LjU2Njg4IDI0LjU2Njg4LC0yNC41NjY4OGMxMy40ODk0NSwwIDI0LjU2Njg4LDExLjA3NzQzIDI0LjU2Njg4LDI0LjU2Njg4ek05NS41NzA0NCw3NC4yMTAzN2MwLDYuMjUzMzkgNC45MjA4MiwxMS4xNjY3NiAxMS4xNjY3NiwxMS4xNjY3NmM2LjI0NTk0LDAgMTEuMTY2NzYsLTQuOTEzMzggMTEuMTY2NzYsLTExLjE2Njc2YzAsLTYuMjQ1OTQgLTQuOTIwODIsLTExLjE2Njc2IC0xMS4xNjY3NiwtMTEuMTY2NzZjLTYuMjQ1OTQsMCAtMTEuMTY2NzYsNC45MjA4MiAtMTEuMTY2NzYsMTEuMTY2NzZ6TTI1My4zMTk2LDEyMy4xMjA4YzAsMTYuNzUwMTUgLTEzLjc3MjM0LDMwLjUyMjQ5IC0zMC41MjI0OSwzMC41MjI0OWMtMTYuNzUwMTUsMCAtMzAuNTIyNDksLTEzLjc3MjM0IC0zMC41MjI0OSwtMzAuNTIyNDljMCwtMTYuNzUwMTUgMTMuNzcyMzQsLTMwLjUyMjQ5IDMwLjUyMjQ5LC0zMC41MjI0OWMxNi43NTAxNSwwIDMwLjUyMjQ5LDEzLjc3MjM0IDMwLjUyMjQ5LDMwLjUyMjQ5ek0yMDUuNjc0NzMsMTIzLjEyMDhjMCw5LjUyODk3IDcuNTkzNCwxNy4xMjIzNyAxNy4xMjIzNywxNy4xMjIzN2M5LjUyODk3LDAgMTcuMTIyMzcsLTcuNTkzNCAxNy4xMjIzNywtMTcuMTIyMzdjMCwtOS41Mjg5NyAtNy41OTM0LC0xNy4xMjIzNyAtMTcuMTIyMzcsLTE3LjEyMjM3Yy05LjUyODk3LDAgLTE3LjEyMjM3LDcuNTkzNCAtMTcuMTIyMzcsMTcuMTIyMzd6TTE1NC4zODIwNiwxMjcuODEwODRjMCw2LjU3ODM4IC01LjMzMjgzLDExLjkxMTIyIC0xMS45MTEyMiwxMS45MTEyMmMtNi41NzgzOCwwIC0xMS45MTEyMiwtNS4zMzI4MyAtMTEuOTExMjIsLTExLjkxMTIyYzAsLTYuNTc4MzggNS4zMzI4MywtMTEuOTExMjIgMTEuOTExMjIsLTExLjkxMTIyYzYuNTc4MzgsMCAxMS45MTEyMiw1LjMzMjgzIDExLjkxMTIyLDExLjkxMTIyek0zMjQuODYxMzMsMTY2Ljg5NDUxbDAuMDc0NDUsMC4wNzQ0NWw2My4xMjk0NCwzMS41NjQ3MnYwLjA3NDQ1YzcuMjk1NjIsMy41NzMzNiA4LjQ4Njc0LDQuOTg3ODIgOS4xNTY3NSw2Ljk5Nzg0YzAuNzQ0NDUsMS45MzU1NyAwLjU5NTU2LDcuMjIxMTcgMC41OTU1NiwxNi42NzU3djI4LjczNTgxYzAsNi45OTc4NCAtMC41MjExMiwxMC43MjAwOSAtMi4wMTAwMiwxMy40NzQ1NmMtMS40ODg5LDIuNjgwMDIgLTQuNTQxMTUsNS41MDg5NCAtMTEuNjEzNDMsOS40NTQ1M2wtMTQ4LjM2OTA4LDczLjYyNjJjLTE0LjgxNDU3LDcuNDQ0NTEgLTMwLjA3NTgyLDguMTE0NTIgLTQyLjIxMDM3LDAuODkzMzRsLTAuMjIzMzQsLTAuMDc0NDVsLTU4LjU4ODI5LC0yOS4zMzEzN2MtNi4zNDI3MiwtMy4yNzU1OCAtOC4xMjk0LC00LjY5MDA0IC04LjU3NjA4LC01LjUwODk0Yy0wLjQzOTIzLC0wLjc0NDQ1IC0wLjg3ODQ1LC0zLjk0NTU5IC0wLjg3ODQ1LC0xMS42ODc4OHYtMzIuMDg1ODRjMCwtOS45NzU2NCAxLjk0MzAyLC0xNC42NjU2OCA0Ljc1NzA0LC0xOC4xNjQ2YzIuNzkxNjksLTMuNDI0NDcgNy4zMDMwNiwtNi4wMzAwNSAxMy40MDc1NiwtOS42MDM0MmwxNy40MjAxNSwtOC43MTAwOGM2LjMyNzgzLDUuMjg1NiAxNC4zNjc5LDguNDEyMyAyMy4yMjY4Nyw4LjQxMjNjMjAuMTAwMTgsMCAzNi40NzgxLC0xNi4zNzc5MiAzNi40NzgxLC0zNi40NzgxYzAsLTAuNTk1NTYgMCwtMS4xOTExMiAtMC4wNzQ0NSwtMS43ODY2OGw3My4wMzA2NCwtMzYuNTUyNTRjNi45OTc4NCwtMy40OTg5MiAxMS4xNjY3NiwtNS4xMzY3MSAxNC44ODkwMiwtNS4yODU2YzMuNzk2NywtMC4xNDg4OSA4LjI2MzQxLDEuMDQyMjMgMTYuMzc3OTIsNS4yODU2ek0yMDcuMjM4MDgsMjA1LjIzMzc0YzAsMTIuODA0NTYgLTEwLjI3MzQyLDIzLjA3Nzk4IC0yMy4wNzc5OCwyMy4wNzc5OGMtMTIuODA0NTYsMCAtMjMuMDc3OTgsLTEwLjI3MzQyIC0yMy4wNzc5OCwtMjMuMDc3OThjMCwtMTIuODA0NTYgMTAuMjczNDIsLTIzLjA3Nzk4IDIzLjA3Nzk4LC0yMy4wNzc5OGMxMi44MDQ1NiwwIDIzLjA3Nzk4LDEwLjI3MzQyIDIzLjA3Nzk4LDIzLjA3Nzk4ek0yNTMuMzk0MDQsMjYyLjYzMDkxYy0xMy4wMjc4OSw1Ljk1NTYxIC0yMi4yNTkwOCwxMC42NDU2NSAtMzAuMzczNiwxMi4wNjAxMWMtOC4xODg5NiwxLjQxNDQ2IC0xNS43ODIzNiwwLjM3MjIzIC0yOC4xNDAyNSwtNi41NTExN2wtMC4xNDg4OSwtMC4xNDg4OWwtMzIuNTMyNTEsLTE2LjAwNTdsLTUuOTU1NjEsMTIuMDYwMTFsMzIuMzgzNjIsMTUuOTMxMjVsLTAuMjk3NzgsLTAuMjIzMzRjMTMuOTk1NjgsNy44OTExOCAyNS44MzI0NSwxMC4xMjQ1MyAzNi45MjQ3Nyw4LjE4ODk2YzExLjE2Njc2LC0yLjAxMDAyIDIxLjA2Nzk2LC03LjI5NTYyIDMzLjcyMzYzLC0xMy4xMDIzNGgwLjA3NDQ1bDExNC42NDU0NSwtNTQuOTQwNDhsLTUuODA2NzIsLTEyLjA2MDExeiIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE2MC41Nzk2ODA4NjU2ODA5ODoxNzYuMjg0NjY3NDExNTQxOTMtLT4=";

    const blockicon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMTUuNjU5MzYiIGhlaWdodD0iMzQ3LjA2OTMzIiB2aWV3Qm94PSIwLDAsMzE1LjY1OTM2LDM0Ny4wNjkzMyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTgyLjE3MDMyLC02LjQ2NTMzKSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsPSIjZmZmZmZmIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTI2OC4yODMwNiwzMS4wMzIyMWMwLDEzLjQ4OTQ1IC0xMS4wOTIzMiwyNC41NjY4OCAtMjQuNTY2ODgsMjQuNTY2ODhjLTEzLjQ3NDU2LDAgLTI0LjU2Njg4LC0xMS4wNzc0MyAtMjQuNTY2ODgsLTI0LjU2Njg4YzAsLTEzLjQ4OTQ1IDExLjA5MjMyLC0yNC41NjY4OCAyNC41NjY4OCwtMjQuNTY2ODhjMTMuNDc0NTYsMCAyNC41NjY4OCwxMS4wNzc0MyAyNC41NjY4OCwyNC41NjY4OHpNMjMyLjU0OTQxLDMxLjAzMjIxYzAsNi4yNDU5NCA0LjkxMzM4LDExLjE2Njc2IDExLjE2Njc2LDExLjE2Njc2YzYuMjUzMzksMCAxMS4xNjY3NiwtNC45MjA4MiAxMS4xNjY3NiwtMTEuMTY2NzZjMCwtNi4yNDU5NCAtNC45MTMzOCwtMTEuMTY2NzYgLTExLjE2Njc2LC0xMS4xNjY3NmMtNi4yNTMzOSwwIC0xMS4xNjY3Niw0LjkyMDgyIC0xMS4xNjY3NiwxMS4xNjY3NnpNMTMxLjMwNDA4LDc0LjIxMDM3YzAsMTMuNDc0NTYgLTExLjA3NzQzLDI0LjU2Njg4IC0yNC41NjY4OCwyNC41NjY4OGMtMTMuNDg5NDUsMCAtMjQuNTY2ODgsLTExLjA5MjMyIC0yNC41NjY4OCwtMjQuNTY2ODhjMCwtMTMuNDg5NDUgMTEuMDc3NDMsLTI0LjU2Njg4IDI0LjU2Njg4LC0yNC41NjY4OGMxMy40ODk0NSwwIDI0LjU2Njg4LDExLjA3NzQzIDI0LjU2Njg4LDI0LjU2Njg4ek05NS41NzA0NCw3NC4yMTAzN2MwLDYuMjUzMzkgNC45MjA4MiwxMS4xNjY3NiAxMS4xNjY3NiwxMS4xNjY3NmM2LjI0NTk0LDAgMTEuMTY2NzYsLTQuOTEzMzggMTEuMTY2NzYsLTExLjE2Njc2YzAsLTYuMjQ1OTQgLTQuOTIwODIsLTExLjE2Njc2IC0xMS4xNjY3NiwtMTEuMTY2NzZjLTYuMjQ1OTQsMCAtMTEuMTY2NzYsNC45MjA4MiAtMTEuMTY2NzYsMTEuMTY2NzZ6TTI1My4zMTk2LDEyMy4xMjA4YzAsMTYuNzUwMTUgLTEzLjc3MjM0LDMwLjUyMjQ5IC0zMC41MjI0OSwzMC41MjI0OWMtMTYuNzUwMTUsMCAtMzAuNTIyNDksLTEzLjc3MjM0IC0zMC41MjI0OSwtMzAuNTIyNDljMCwtMTYuNzUwMTUgMTMuNzcyMzQsLTMwLjUyMjQ5IDMwLjUyMjQ5LC0zMC41MjI0OWMxNi43NTAxNSwwIDMwLjUyMjQ5LDEzLjc3MjM0IDMwLjUyMjQ5LDMwLjUyMjQ5ek0yMDUuNjc0NzMsMTIzLjEyMDhjMCw5LjUyODk3IDcuNTkzNCwxNy4xMjIzNyAxNy4xMjIzNywxNy4xMjIzN2M5LjUyODk3LDAgMTcuMTIyMzcsLTcuNTkzNCAxNy4xMjIzNywtMTcuMTIyMzdjMCwtOS41Mjg5NyAtNy41OTM0LC0xNy4xMjIzNyAtMTcuMTIyMzcsLTE3LjEyMjM3Yy05LjUyODk3LDAgLTE3LjEyMjM3LDcuNTkzNCAtMTcuMTIyMzcsMTcuMTIyMzd6TTE1NC4zODIwNiwxMjcuODEwODRjMCw2LjU3ODM4IC01LjMzMjgzLDExLjkxMTIyIC0xMS45MTEyMiwxMS45MTEyMmMtNi41NzgzOCwwIC0xMS45MTEyMiwtNS4zMzI4MyAtMTEuOTExMjIsLTExLjkxMTIyYzAsLTYuNTc4MzggNS4zMzI4MywtMTEuOTExMjIgMTEuOTExMjIsLTExLjkxMTIyYzYuNTc4MzgsMCAxMS45MTEyMiw1LjMzMjgzIDExLjkxMTIyLDExLjkxMTIyek0zMjQuODYxMzMsMTY2Ljg5NDUxbDAuMDc0NDUsMC4wNzQ0NWw2My4xMjk0NCwzMS41NjQ3MnYwLjA3NDQ1YzcuMjk1NjIsMy41NzMzNiA4LjQ4Njc0LDQuOTg3ODIgOS4xNTY3NSw2Ljk5Nzg0YzAuNzQ0NDUsMS45MzU1NyAwLjU5NTU2LDcuMjIxMTcgMC41OTU1NiwxNi42NzU3djI4LjczNTgxYzAsNi45OTc4NCAtMC41MjExMiwxMC43MjAwOSAtMi4wMTAwMiwxMy40NzQ1NmMtMS40ODg5LDIuNjgwMDIgLTQuNTQxMTUsNS41MDg5NCAtMTEuNjEzNDMsOS40NTQ1M2wtMTQ4LjM2OTA4LDczLjYyNjJjLTE0LjgxNDU3LDcuNDQ0NTEgLTMwLjA3NTgyLDguMTE0NTIgLTQyLjIxMDM3LDAuODkzMzRsLTAuMjIzMzQsLTAuMDc0NDVsLTU4LjU4ODI5LC0yOS4zMzEzN2MtNi4zNDI3MiwtMy4yNzU1OCAtOC4xMjk0LC00LjY5MDA0IC04LjU3NjA4LC01LjUwODk0Yy0wLjQzOTIzLC0wLjc0NDQ1IC0wLjg3ODQ1LC0zLjk0NTU5IC0wLjg3ODQ1LC0xMS42ODc4OHYtMzIuMDg1ODRjMCwtOS45NzU2NCAxLjk0MzAyLC0xNC42NjU2OCA0Ljc1NzA0LC0xOC4xNjQ2YzIuNzkxNjksLTMuNDI0NDcgNy4zMDMwNiwtNi4wMzAwNSAxMy40MDc1NiwtOS42MDM0MmwxNy40MjAxNSwtOC43MTAwOGM2LjMyNzgzLDUuMjg1NiAxNC4zNjc5LDguNDEyMyAyMy4yMjY4Nyw4LjQxMjNjMjAuMTAwMTgsMCAzNi40NzgxLC0xNi4zNzc5MiAzNi40NzgxLC0zNi40NzgxYzAsLTAuNTk1NTYgMCwtMS4xOTExMiAtMC4wNzQ0NSwtMS43ODY2OGw3My4wMzA2NCwtMzYuNTUyNTRjNi45OTc4NCwtMy40OTg5MiAxMS4xNjY3NiwtNS4xMzY3MSAxNC44ODkwMiwtNS4yODU2YzMuNzk2NywtMC4xNDg4OSA4LjI2MzQxLDEuMDQyMjMgMTYuMzc3OTIsNS4yODU2ek0yMDcuMjM4MDgsMjA1LjIzMzc0YzAsMTIuODA0NTYgLTEwLjI3MzQyLDIzLjA3Nzk4IC0yMy4wNzc5OCwyMy4wNzc5OGMtMTIuODA0NTYsMCAtMjMuMDc3OTgsLTEwLjI3MzQyIC0yMy4wNzc5OCwtMjMuMDc3OThjMCwtMTIuODA0NTYgMTAuMjczNDIsLTIzLjA3Nzk4IDIzLjA3Nzk4LC0yMy4wNzc5OGMxMi44MDQ1NiwwIDIzLjA3Nzk4LDEwLjI3MzQyIDIzLjA3Nzk4LDIzLjA3Nzk4ek0yNTMuMzk0MDQsMjYyLjYzMDkxYy0xMy4wMjc4OSw1Ljk1NTYxIC0yMi4yNTkwOCwxMC42NDU2NSAtMzAuMzczNiwxMi4wNjAxMWMtOC4xODg5NiwxLjQxNDQ2IC0xNS43ODIzNiwwLjM3MjIzIC0yOC4xNDAyNSwtNi41NTExN2wtMC4xNDg4OSwtMC4xNDg4OWwtMzIuNTMyNTEsLTE2LjAwNTdsLTUuOTU1NjEsMTIuMDYwMTFsMzIuMzgzNjIsMTUuOTMxMjVsLTAuMjk3NzgsLTAuMjIzMzRjMTMuOTk1NjgsNy44OTExOCAyNS44MzI0NSwxMC4xMjQ1MyAzNi45MjQ3Nyw4LjE4ODk2YzExLjE2Njc2LC0yLjAxMDAyIDIxLjA2Nzk2LC03LjI5NTYyIDMzLjcyMzYzLC0xMy4xMDIzNGgwLjA3NDQ1bDExNC42NDU0NSwtNTQuOTQwNDhsLTUuODA2NzIsLTEyLjA2MDExeiIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE1Ny44Mjk2ODA4NjU2ODA5ODoxNzMuNTM0NjY3NDExNTQxOTMtLT4=";

    class MubiLopMouthWasher {
        getInfo() {
            return {
                id: "mubilopMouthWasher",
                name: "Mouth Washer",
                color1: '#afcf46',
                color2: '#8aa337',
                color3: '#617327',
                menuIconURI: icon,
                blockIconURI: blockicon,
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
