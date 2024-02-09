class DiscordAuth {
    constructor() {
        this.userData = null;
    }

    getInfo() {
        return {
            id: 'discordAuth',
            name: 'Discord Auth',
            blocks: [
                {
                    opcode: 'auth',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'authenticate user'
                },
                {
                    opcode: 'getUsername',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'username'
                },
                {
                    opcode: 'getProfilePicture',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'profile picture'
                },
                {
                    opcode: 'isAuthenticated',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'authenticated?'
                }
            ]
        };
    }

    async auth({ width, height }) {
        return new Promise((resolve, reject) => {
            let top = (screen.height - height) / 2;
            let left = (screen.width - width) / 2;
            const authWindow = window.open(
                `https://opensnail.onrender.com/auth/discord`,
                'Discord Auth',
                `scrollbars=1,resizable=no,width=${width},height=${height},top=${top},left=${left}`
            );

            const intervalId = setInterval(async () => {
                if (authWindow.closed) {
                    clearInterval(intervalId);
                    try {
                        // Fetch user data from the server
                        const response = await fetch('https://opensnail.onrender.com/api/userdata');
                        if (!response.ok) {
                            throw new Error('Failed to fetch user data');
                        }
                        // Extract username and profile picture from the response JSON
                        this.userData = await response.json();
                        // Resolve with the extracted data
                        resolve(this.userData);
                    } catch (error) {
                        // Reject with the error if fetching or parsing fails
                        reject(error);
                    }
                }
            }, 1000);
        });
    }

    getUsername() {
        // Reporter block to get the username
        return this.userData ? this.userData.username : 'Please Authenticate';
    }

    getProfilePicture() {
        // Reporter block to get the profile picture
        return this.userData ? this.userData.profile_picture : '';
    }

    isAuthenticated() {
        // Boolean block to check if the user is authenticated
        return this.userData !== null;
    }
}

Scratch.extensions.register(new DiscordAuth());
