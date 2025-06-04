(function (Scratch) {
    'use strict';

    let restrictionLevel = 3; // default to high restriction
    let lastResponse = {
        flagged: false,
        words: [],
        fixedText: ''
    };

    class IkeContentGuard {
        getInfo() {
            return {
                id: 'IkeContentGuard',
                name: 'Text Filter',
                color1: '#b399d4', // light purple
                blocks: [
                    {
                        opcode: 'setRestrictionLevel',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set restriction level [LEVEL]',
                        arguments: {
                            LEVEL: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'levels',
                                defaultValue: '3'
                            }
                        }
                    },
                    {
                        opcode: 'filterText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Filter text [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Your message here'
                            }
                        }
                    },
                    {
                        opcode: 'wasFiltered',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'Filtered?'
                    },
                    {
                        opcode: 'getFilteredWords',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Filtered words'
                    },
                    {
                        opcode: 'getFixedText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Fixed text'
                    }
                ],
                menus: {
                    levels: {
                        acceptReporters: true,
                        items: [
                            { text: '0 - Unfiltered', value: '0' },
                            { text: '1 - Low restriction level', value: '1' },
                            { text: '2 - Medium restriction level', value: '2' },
                            { text: '3 - High restriction level', value: '3' }
                        ]
                    }
                }
            };
        }

        setRestrictionLevel(args) {
            restrictionLevel = parseInt(args.LEVEL);
        }

        async filterText(args) {
            const text = encodeURIComponent(args.TEXT);
            const url = `https://ikelene.ca/api/filter/filter.php?restrictLevel=${restrictionLevel}&prompt=${text}`;
            try {
                const response = await fetch(url);
                if (!response.ok) throw new Error('API error');

                const data = await response.json();
                lastResponse = {
                    flagged: !!data.flagged,
                    words: Array.isArray(data.words) ? data.words : [],
 fixedText: data.fixedText || args.TEXT
                };
            } catch (error) {
                console.error('Text Filter API error:', error);
                lastResponse = {
                    flagged: false,
                    words: [],
                    fixedText: args.TEXT
                };
            }
        }

        wasFiltered() {
            return lastResponse.flagged;
        }

        getFilteredWords() {
            return lastResponse.words.join(', ');
        }

        getFixedText() {
            return lastResponse.fixedText;
        }
    }

    Scratch.extensions.register(new IkeContentGuard());
})(Scratch);
