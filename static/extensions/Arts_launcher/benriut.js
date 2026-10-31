(function (Scratch) {
    'use strict';

    // 演算アイコンのSVGデータ
    const svgIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="142.81332" height="142.81332" viewBox="0 0 142.81332 142.81332">
<g>
<circle cx="71.40666" cy="71.40666" r="68.90666" fill="#59c059" stroke="#389438" stroke-width="5"/>
<path d="M89.80618 37.11312c-5.62208-.5111-10.57972 3.62879-11.09082 9.30198l-1.27774 14.77072h14.41296v10.22195H76.51765l-2.24883 25.91266c-.46208 5.39995-3.05679 10.39321-7.21006 13.87505-4.15328 3.48185-9.52275 5.16526-14.92047 4.67779-6.42746-.54504-12.22249-4.08645-15.63959-9.55753l7.66647-7.66647c1.22663 3.78212 4.59988 6.69538 8.84199 7.05315 5.62208.5111 10.57972-3.62879 11.09082-9.30198l2.19772-24.99268H51.96277V61.18581h16.2018l1.37996-15.6907c.97109-11.24415 10.88638-19.57504 22.13053-18.55285 6.69538.56221 12.31746 4.29322 15.63959 9.55753l-7.66647 7.66647c-1.22663-3.78212-4.59988-6.69538-8.84199-7.05315z" fill="#fff"/>
</g>
</svg>`;

    // menuIconURIはBase64形式にする
    function svgToDataURI(svg) {
        const encoded = btoa(
            encodeURIComponent(svg).replace(
                /%([0-9A-F]{2})/g,
                function (_, hex) {
                    return String.fromCharCode(parseInt(hex, 16));
                }
            )
        );
        return 'data:image/svg+xml;base64,' + encoded;
    }

    const icon = svgToDataURI(svgIcon);

    function getLocale() {
        try {
            const savedLocale = localStorage.getItem('tw:language');
            if (typeof savedLocale === 'string' && savedLocale.trim()) {
                return savedLocale.trim().toLowerCase().replace('_', '-');
            }
        } catch (e) {}

        try {
            if (Scratch.translate) {
                const locale = Scratch.translate.locale;
                if (typeof locale === 'string' && locale.trim()) {
                    return locale.trim().toLowerCase().replace('_', '-');
                }
            }
        } catch (e) {}

        try {
            if (Scratch.vm && Scratch.vm.runtime) {
                const runtime = Scratch.vm.runtime;
                const locale = runtime._locale || runtime.locale || runtime.language;

                if (typeof locale === 'string' && locale.trim()) {
                    return locale.trim().toLowerCase().replace('_', '-');
                }
            }
        } catch (e) {}

        return 'en';
    }

    function isJapanese() {
        return getLocale().split('-')[0] === 'ja';
    }

    function t(ja, en) {
        return isJapanese() ? ja : en;
    }

    function toFiniteNumber(value, label) {
        const number = Number(value);

        if (!Number.isFinite(number)) {
            throw new Error(label + ': 有効な数値を入力してください。');
        }

        return number;
    }

    class BenriUt {
        constructor() {
            this.trials = 0;
            this.successes = 0;
        }

        getInfo() {
            return {
                id: 'benriut',
                name: t('便利演算ユーティリティ', 'Utility Operators'),
                color1: '#59C059',
                color2: '#46A546',
                color3: '#389438',

                // パレット左側のカテゴリ用アイコン
                menuIconURI: icon,

                // ブロック側のアイコン
                blockIconURI: icon,

                blocks: [
                    {
                        opcode: 'probability',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: t('確率 [PERCENT] %', 'Probability [PERCENT] %'),
                        arguments: {
                            PERCENT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 50
                            }
                        }
                    },
                    {
                        opcode: 'removeText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[TEXT]から[REMOVE]を消す', 'Remove [REMOVE] from [TEXT]'),
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Hello world'
                            },
                            REMOVE: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'world'
                            }
                        }
                    },
                    {
                        opcode: 'toNumber',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[TEXT]を数字にする', 'Convert [TEXT] to a number'),
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'abc123'
                            }
                        }
                    },
                    {
                        opcode: 'averageProbability',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('確率を引き当てた平均%', 'Average success rate %'),
                        disableMonitor: true
                    },
                    {
                        opcode: 'resetProbability',
                        blockType: Scratch.BlockType.COMMAND,
                        text: t('成功した平均をリセット', 'Reset success rate')
                    },
                    {
                        opcode: 'repeatText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[TEXT]を[COUNT]回繰り返した文章', 'Repeat [TEXT] [COUNT] times'),
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'abc'
                            },
                            COUNT: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 3
                            }
                        }
                    },
                    {
                        opcode: 'splitText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[TEXT]を[SEPARATOR]で分割した[INDEX]番目', 'Item [INDEX] of [TEXT] split by [SEPARATOR]'),
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple,banana,orange'
                            },
                            SEPARATOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ','
                            },
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },
                    {
                        opcode: 'reverseText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[TEXT]を逆順にした文字列', 'Reverse [TEXT]'),
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'PenguinMod'
                            }
                        }
                    },
                    {
                        opcode: 'randomCharacter',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[TEXT]からランダムな1文字', 'Random character from [TEXT]'),
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'PenguinMod'
                            }
                        }
                    },
                    {
                        opcode: 'splitCount',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[TEXT]を[SEPARATOR]で分割した個数', 'Number of items in [TEXT] split by [SEPARATOR]'),
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'apple,banana,orange'
                            },
                            SEPARATOR: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ','
                            }
                        }
                    },
                    {
                        opcode: 'listNumberAverage',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[LIST]の数値の平均', 'Average of numbers in [LIST]'),
                        arguments: {
                            LIST: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'getLists',
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'listNumberSum',
                        blockType: Scratch.BlockType.REPORTER,
                        text: t('[LIST]の合計', 'Sum of [LIST]'),
                        arguments: {
                            LIST: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'getLists',
                                defaultValue: ''
                            }
                        }
                    }
                ],
                menus: {
                    getLists: {
                        acceptReporters: false,
                        items: 'getLists'
                    }
                }
            };
        }

        getLists() {
            const runtime = Scratch.vm && Scratch.vm.runtime;
            const stage = runtime && runtime.getTargetForStage();

            if (!stage) {
                return [{
                    text: t('リストがありません', 'No lists'),
                    value: ''
                }];
            }

            const lists = [];

            for (const variable of Object.values(stage.variables)) {
                if (variable.type === 'list') {
                    lists.push({
                        text: variable.name,
                        value: variable.id
                    });
                }
            }

            if (lists.length === 0) {
                return [{
                    text: t('リストがありません', 'No lists'),
                    value: ''
                }];
            }

            return lists;
        }

        probability(args) {
            const percent = toFiniteNumber(args.PERCENT, '確率');

            if (percent < 0 || percent > 100) {
                throw new Error('確率は0から100までの範囲で指定してください。');
            }

            this.trials++;
            const success = Math.random() * 100 < percent;

            if (success) {
                this.successes++;
            }

            return success;
        }

        removeText(args) {
            const text = String(args.TEXT ?? '');
            const remove = String(args.REMOVE ?? '');

            if (remove === '') {
                return text;
            }

            return text.split(remove).join('');
        }

        toNumber(args) {
            const text = String(args.TEXT ?? '');
            const cleaned = text.replace(/[^0-9.-]/g, '');

            if (!/^-?(?:\d+\.?\d*|\.\d+)$/.test(cleaned)) {
                throw new Error('文字列から有効な数値を取り出せませんでした。');
            }

            const number = Number(cleaned);

            if (!Number.isFinite(number)) {
                throw new Error('有効な数値ではありません。');
            }

            return number;
        }

        averageProbability() {
            if (this.trials === 0) {
                throw new Error('まだ確率ブロックが実行されていません。');
            }

            return ((this.successes / this.trials) * 100).toFixed(2) + '%';
        }

        resetProbability() {
            this.trials = 0;
            this.successes = 0;
        }

        repeatText(args) {
            const text = String(args.TEXT ?? '');
            const count = toFiniteNumber(args.COUNT, '繰り返し回数');

            if (!Number.isInteger(count) || count < 0 || count > 10000) {
                throw new Error('繰り返し回数は0から10000までの整数にしてください。');
            }

            return text.repeat(count);
        }

        splitText(args) {
            const text = String(args.TEXT ?? '');
            const separator = String(args.SEPARATOR ?? '');
            const index = toFiniteNumber(args.INDEX, '分割位置');

            if (separator === '') {
                throw new Error('分割する文字を指定してください。');
            }

            if (!Number.isInteger(index) || index < 1) {
                throw new Error('分割位置は1以上の整数にしてください。');
            }

            return text.split(separator)[index - 1] ?? '';
        }

        reverseText(args) {
            return Array.from(String(args.TEXT ?? '')).reverse().join('');
        }

        randomCharacter(args) {
            const characters = Array.from(String(args.TEXT ?? ''));

            if (characters.length === 0) {
                throw new Error('空の文字列から文字を選べません。');
            }

            return characters[Math.floor(Math.random() * characters.length)];
        }

        splitCount(args) {
            const text = String(args.TEXT ?? '');
            const separator = String(args.SEPARATOR ?? '');

            if (separator === '') {
                throw new Error('分割する文字を指定してください。');
            }

            return text.split(separator).length;
        }

        getSelectedList(args) {
            const listId = String(args.LIST ?? '');
            const runtime = Scratch.vm && Scratch.vm.runtime;
            const stage = runtime && runtime.getTargetForStage();

            if (!listId) {
                throw new Error('リストを選択してください。');
            }

            if (!stage || !stage.variables[listId]) {
                throw new Error('選択したリストが見つかりません。');
            }

            const variable = stage.variables[listId];

            if (variable.type !== 'list') {
                throw new Error('選択した項目はリストではありません。');
            }

            return variable.value;
        }

        getNumericList(args) {
            const values = this.getSelectedList(args);

            if (values.length === 0) {
                throw new Error('空のリストから計算できません。');
            }

            return values.map((value) => {
                const text = String(value);

                if (text.trim() === '') {
                    throw new Error('リストに数値ではない項目が含まれています。');
                }

                const number = Number(text);

                if (!Number.isFinite(number)) {
                    throw new Error('リストに数値ではない項目が含まれています。');
                }

                return number;
            });
        }

        listNumberAverage(args) {
            const numbers = this.getNumericList(args);
            const sum = numbers.reduce((total, number) => total + number, 0);

            return sum / numbers.length;
        }

        listNumberSum(args) {
            const numbers = this.getNumericList(args);

            return numbers.reduce((total, number) => total + number, 0);
        }
    }

    Scratch.extensions.register(new BenriUt());
})(Scratch);
