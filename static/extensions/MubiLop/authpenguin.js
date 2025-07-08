// Made by MubiLop (pls dont remove meee)

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('"AuthPenguin" cannot run sandboxed.');
    }
    
    const { BlockType, ArgumentType, Cast } = Scratch;

    class AuthPenguinExt {
        constructor() {
            this.serverUrl = 'https://oauth.mubilop.com';
            this.userData = null;
            this.authToken = null;
            this.projectId = this.generateProjectId();
        }
        
        getInfo() {
            return {
                docsURI: 'https://extensions.penguinmod.com/docs/AuthPenguin',
                color1: '#00c3ff',
                id: 'authpenguin',
                name: 'AuthPenguin',
                blocks: [
                    {
                        opcode: 'loginWithProvider',
                        blockType: BlockType.COMMAND,
                        text: 'login with [PROVIDER]',
                        arguments: {
                            PROVIDER: {
                                type: ArgumentType.STRING,
                                menu: 'providers'
                            }
                        }
                    },
                    {
                        opcode: 'loginWithPopup',
                        blockType: BlockType.COMMAND,
                        text: 'login with popup selector'
                    },
                    {
                        opcode: 'getUserInfo',
                        blockType: BlockType.REPORTER,
                        text: 'get user [INFO]',
                        arguments: {
                            INFO: {
                                type: ArgumentType.STRING,
                                menu: 'userInfo'
                            }
                        }
                    },
                    {
                        opcode: 'getAllUserInfo',
                        blockType: BlockType.REPORTER,
                        text: 'get all user info as JSON'
                    },
                    {
                        opcode: 'getUsedProvider',
                        blockType: BlockType.REPORTER,
                        text: 'get used provider'
                    },
                    {
                        opcode: 'isLoggedIn',
                        blockType: BlockType.BOOLEAN,
                        text: 'is logged in?'
                    },
                    {
                        opcode: 'logout',
                        blockType: BlockType.COMMAND,
                        text: 'logout'
                    },
                    {
                        opcode: 'NOUSEOPCODE',
                        blockType: BlockType.LABEL,
                        text: 'Advanced'
                    },
                    {
                        opcode: 'setServerUrl',
                        blockType: BlockType.COMMAND,
                        text: 'set server URL to [URL]',
                        arguments: {
                            URL: {
                                type: ArgumentType.STRING,
                                defaultValue: 'http://localhost:3000'
                            }
                        }
                    }
                ],
                menus: {
                    providers: {
                        acceptReporters: true,
                        items: ['discord', 'google', 'github', 'scratch', 'soundcloud']
                    },
                    userInfo: {
                        acceptReporters: true,
                        items: ['username', 'email', 'id', 'avatar']
                    }
                }
            };
        }

        loginWithProvider(args) {
            const provider = args.PROVIDER.toLowerCase();
            const origin = encodeURIComponent(window.location.origin);
            return new Promise(async (resolve) => {
                // Auto-logout if already logged in
                if (this.isLoggedIn()) {
                    await this.logout();
                }
                
                const popup = window.open(
                    `${this.serverUrl}/auth/${provider}?projectId=${this.projectId}&origin=${origin}`,
                    'oauth',
                    'width=500,height=600,scrollbars=yes,resizable=yes'
                );

                const messageListener = (event) => {
                    if (event.data && event.data.type === 'AUTH_SUCCESS') {
                        this.authToken = event.data.token;
                        window.removeEventListener('message', messageListener);
                        this.checkAuthStatus().then(resolve);
                    } else if (event.data && event.data.type === 'AUTH_FAILURE') {
                        window.removeEventListener('message', messageListener);
                        resolve(false);
                    } else if (event.data && event.data.type === 'AUTH_BLOCKED') {
                        window.removeEventListener('message', messageListener);
                        console.warn('AuthPenguin: Project blocked -', event.data.reason);
                        resolve(false);
                    }
                };

                window.addEventListener('message', messageListener);

                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        resolve(false);
                    }
                }, 1000);
            });
        }

        loginWithPopup() {
            const origin = encodeURIComponent(window.location.origin);
            return new Promise(async (resolve) => {
                // Auto-logout if already logged in
                if (this.isLoggedIn()) {
                    await this.logout();
                }
                
                const popup = window.open(
                    `${this.serverUrl}/auth/selector?projectId=${this.projectId}&origin=${origin}`,
                    'oauth-selector',
                    'width=400,height=500,scrollbars=yes,resizable=yes'
                );

                const messageListener = (event) => {
                    if (event.data && event.data.type === 'AUTH_SUCCESS') {
                        this.authToken = event.data.token;
                        window.removeEventListener('message', messageListener);
                        this.checkAuthStatus().then(resolve);
                    } else if (event.data && event.data.type === 'AUTH_FAILURE') {
                        window.removeEventListener('message', messageListener);
                        resolve(false);
                    } else if (event.data && event.data.type === 'AUTH_BLOCKED') {
                        window.removeEventListener('message', messageListener);
                        console.warn('AuthPenguin: Project blocked -', event.data.reason);
                        resolve(false);
                    }
                };

                window.addEventListener('message', messageListener);

                const checkClosed = setInterval(() => {
                    if (popup.closed) {
                        clearInterval(checkClosed);
                        window.removeEventListener('message', messageListener);
                        resolve(false);
                    }
                }, 1000);
            });
        }

        async checkAuthStatus() {
            if (!this.authToken) return false;
            
            try {
                const response = await fetch(`${this.serverUrl}/auth/status?projectId=${this.projectId}`, {
                    headers: this.getHeaders()
                });
                if (response.ok) {
                    this.userData = await response.json();
                    return true;
                } else if (response.status === 403) {
                    // Project might be blocked
                    const errorData = await response.json();
                    console.warn('AuthPenguin: Project blocked -', errorData.error);
                    return false;
                }
            } catch (error) {
                console.error('Auth status check failed:', error);
            }
            return false;
        }

        getUserInfo(args) {
            if (!this.userData) return '';
            const info = args.INFO.toLowerCase();
            return this.userData[info] || '';
        }

        getAllUserInfo() {
            if (!this.userData) return '{}';
            return JSON.stringify(this.userData);
        }

        getUsedProvider() {
            if (!this.userData) return '';
            return this.userData.provider || '';
        }

        isLoggedIn() {
            return this.userData !== null;
        }

        async logout() {
            if (!this.authToken) return;
            
            try {
                await fetch(`${this.serverUrl}/auth/logout?projectId=${this.projectId}`, {
                    method: 'POST',
                    headers: this.getHeaders()
                });
                this.userData = null;
                this.authToken = null;
            } catch (error) {
                console.error('Logout failed:', error);
            }
        }

        setServerUrl(args) {
            this.serverUrl = args.URL;
        }

        generateProjectId() {
            const urlParams = new URLSearchParams(window.location.hash.substring(1));
            if (urlParams.has('project_id')) {
                return urlParams.get('project_id');
            }
            
            // get penguinmod project ID from URL (btw this actually happens when you open the project, cool right?)
            const penguinModMatch = window.location.href.match(/#(\d+)/);
            if (penguinModMatch) {
                return `penguinmod_${penguinModMatch[1]}`;
            }
            
            // generate a random ID for other cases
            return `project_${Math.random().toString(36).substring(2, 15)}`;
        }

        getHeaders() {
            const headers = {
                'Content-Type': 'application/json'
            };
            
            if (this.authToken) {
                headers['Authorization'] = `Bearer ${this.authToken}`;
            }
            
            return headers;
        }
    }

    Scratch.extensions.register(new AuthPenguinExt());
})(Scratch);
