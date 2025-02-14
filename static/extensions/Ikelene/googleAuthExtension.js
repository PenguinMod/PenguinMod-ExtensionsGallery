class GoogleAuthExtension {
    constructor() {
        this.accountName = null;
        this.fullName = null;
        this.profilePicture = null;
    }

    getInfo() {
    return {
        id: 'googleAuth',
        name: 'Google Auth',
        color1: '#4285F4', // main color (google blue)
        color2: '#357AE8', // darker shade of first color
        color3: '#2A56C6',
        blocks: [
            {
                opcode: 'login',
                blockType: Scratch.BlockType.COMMAND,
                text: 'Open Google Login Page',
            },
            {
                opcode: 'getAccountName',
                blockType: Scratch.BlockType.REPORTER,
                text: 'Account Email',
            },
            {
                opcode: 'getFullName',
                blockType: Scratch.BlockType.REPORTER,
                text: 'Full Name',
            },
            {
                opcode: 'getProfilePicture',
                blockType: Scratch.BlockType.REPORTER,
                text: 'Profile Picture URL',
            },
        ],
        menus: {},
        docsURI: 'https://ikelene.ca/api/googleAuthDocumentation',
    };
}

    login() {
        const clientId = '382430967410-3svk456rj8ntlu3d3gd9oma09i96cpr9.apps.googleusercontent.com';
        const redirectUri = 'https://ikelene.ca/api/googleLogin.php';
        const scope = 'profile email';
        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&prompt=select_account`;

        const authWindow = window.open(authUrl, 'Google Login', 'width=500,height=600');

        window.addEventListener('message', (event) => {
            if (event.origin === 'https://ikelene.ca') {
                const { accountName, fullName, profilePicture } = event.data;
                this.accountName = accountName;
                this.fullName = fullName;
                this.profilePicture = profilePicture;
                authWindow.close();
            }
        });
    }

    getAccountName() {
        return this.accountName || '';
    }

    getFullName() {
        return this.fullName || '';
    }

    getProfilePicture() {
        return this.profilePicture || '';
    }
}

Scratch.extensions.register(new GoogleAuthExtension());
