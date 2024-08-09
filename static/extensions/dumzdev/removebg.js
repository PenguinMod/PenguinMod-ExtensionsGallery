// Name: Background Remover
// ID: backgroundRemover
// Description: Removes background from images. 
// By: dumzdev, Kaleido AI  <https://scratch.mit.edu/users/dumzdev/>
// License: MIT

class BackgroundRemoverExtension {
    constructor() {
        this.apiKey = '4LjLg3UzLPWtkU2VX9H38hqx'; // Default API Key
    }

    getInfo() {
        return {
            id: 'backgroundRemover',
            name: 'Background Remover',
            blocks: [
                {
                    opcode: 'setApiKey',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set API key to [APIKEY]',
                    arguments: {
                        APIKEY: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '4LjLg3UzLPWtkU2VX9H38hqx'
                        }
                    }
                },
                {
                    opcode: 'removeBackground',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'remove background from image [IMAGE]',
                    arguments: {
                        IMAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'data:image/png;base64,...'
                        }
                    }
                }
            ],
            menus: { },
            color1: '#FFC536', // Main theme color
            color2: '#FFD06B', // Lighter shade of #FFC536
            color3: '#FFC536',
            menuIconURI: 'https://files.catbox.moe/ezlx70.svg', // Menu icon
            blockIconURI: 'https://files.catbox.moe/ezlx70.svg', // Block icon
            textColor: '#000000', // Black text on the blocks
            docsURI: 'https://www.remove.bg/api' // Button linking to Remove.bg API
        };
    }

    setApiKey(args) {
        this.apiKey = args.APIKEY;
    }

    async removeBackground(args) {
        const imageDataURL = args.IMAGE;
        const apiKey = this.apiKey;

        const formData = new FormData();
        formData.append('image_file_b64', imageDataURL.split(',')[1]);
        formData.append('size', 'auto');

        return new Promise((resolve, reject) => {
            fetch("https://api.remove.bg/v1.0/removebg", {
                method: "POST",
                headers: {
                    "X-Api-Key": apiKey
                },
                body: formData
            })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(err => {
                        reject(err.errors[0].title);
                    });
                }
                return response.blob();
            })
            .then(blob => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.onerror = () => {
                    reject("Failed to read the response blob");
                };
                reader.readAsDataURL(blob);
            })
            .catch(error => reject(error.message));
        });
    }
}

// Register the extension
Scratch.extensions.register(new BackgroundRemoverExtension());
