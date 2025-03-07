class TabUtilsExtension {
    getInfo() {
        return {
            id: 'spacecatstabutils',
            name: 'Tab Utils',
            blocks: [
                {
                    opcode: 'openNewTab',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'open new tab with url [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://example.com'
                        }
                    }
                },
                {
                    opcode: 'getCurrentOpenTab',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get current open tab',
                    arguments: {}
                },
                {
                    opcode: 'changeUrlOfCurrentTab',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'change url of current tab to [URL] (aka redirect)',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'https://example.com'
                        }
                    }
                }
            ]
        };
    }

    openNewTab(args) {
        window.open(args.URL, '_blank');
    }

    getCurrentOpenTab() {
        return window.location.href;
    }

    changeUrlOfCurrentTab(args) {
        window.location.href = args.URL;
    }
}

Scratch.extensions.register(new TabUtilsExtension());
