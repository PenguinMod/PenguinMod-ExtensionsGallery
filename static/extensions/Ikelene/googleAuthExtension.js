class GoogleAuthExtension {
    constructor() {
        this.accountName = null;
        this.fullName = null;
        this.profilePicture = null;
        this.userId = null;
        this.locale = null;
        this.emailVerified = null;
        this.authWindow = null;
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
                    opcode: 'clearData',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Clear data',
                },
                {
                    opcode: 'isLoginWindowOpen',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Is login window open?',
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
                {
                    opcode: 'getUserId',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'User ID',
                },
                {
                    opcode: 'getLocale',
                    blockType: Scratch.BlockType.REPORTER,
                    text: "User's preferred language",
                },
                {
                    opcode: 'isEmailVerified',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Email verified?',
                },
            ],
            menus: {},
        };
    }

    login() {
        const clientId = '382430967410-3svk456rj8ntlu3d3gd9oma09i96cpr9.apps.googleusercontent.com';
        const redirectUri = 'https://ikelene.dev/google/googleLogin.php';
        const scope = 'profile email';

        const sourceDomain = window.location.hostname;

        const state = encodeURIComponent(JSON.stringify({ source: sourceDomain }));

        const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&prompt=select_account&state=${state}`;

        this.authWindow = window.open(authUrl, 'Google Login', 'width=500,height=600');

        window.addEventListener('message', (event) => {
            if (event.origin === 'https://ikelene.dev') {
                const { accountName, fullName, profilePicture, userId, locale, emailVerified } = event.data;
                this.accountName = accountName;
                this.fullName = fullName;
                this.profilePicture = profilePicture;
                this.userId = userId;
                this.locale = locale;
                this.emailVerified = emailVerified;
                if (this.authWindow) {
                    this.authWindow.close();
                    this.authWindow = null;
                }
            }
        });
    }

    clearData() {
        this.accountName = null;
        this.fullName = null;
        this.profilePicture = null;
        this.userId = null;
        this.locale = null;
        this.emailVerified = null;
    }

    isLoginWindowOpen() {
        return !!(this.authWindow && !this.authWindow.closed);
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

    getUserId() {
        return this.userId || '';
    }

    getLocale() {
        return this.locale || '';
    }

    isEmailVerified() {
        return !!this.emailVerified;
    }
}

Scratch.extensions.register(new GoogleAuthExtension());
