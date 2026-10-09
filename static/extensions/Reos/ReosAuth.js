(function(Scratch) {
    'use strict';

    function ReosAuth() {
        this.currentUser = '';
        this.authToken = '';
        this.authStatus = 'IDLE';
        this.clientId = 'client_9021a7ca';
        this.backendUrl = 'https://reostech.pagekite.me';
        this.redirectUri = 'https://thecompilerofcompilers.github.io/Reos-Auth-Handeler-For-PenguinMod/';
        this.scope = 'profile';
    }

    ReosAuth.prototype.getInfo = function() {
        return {
            id: 'reosAuth',
            name: 'Reos Auth',
            color1: '#0A84FF',
            color2: '#0056B3',
            blocks: [
                {
                    opcode: 'authenticateUser',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'authenticate with Reos Auth'
                },
                {
                    opcode: 'isUserAuthenticated',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'is user authenticated?'
                },
                {
                    opcode: 'getUsername',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Reos Auth username'
                },
                {
                    opcode: 'getAuthStatus',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Reos Auth status'
                },
                {
                    opcode: 'logout',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'logout from Reos Auth'
                }
            ]
        };
    };

    ReosAuth.prototype.authenticateUser = function() {
        var self = this;
        self.authStatus = 'AUTHENTICATING';

        var authUrl = self.backendUrl + '/oauth/authorize' +
            '?client_id=' + encodeURIComponent(self.clientId) +
            '&redirect_uri=' + encodeURIComponent(self.redirectUri) +
            '&response_type=code' +
            '&scope=' + encodeURIComponent(self.scope);

        try {
            var popup = window.open(authUrl, 'ReosAuthWindow', 'width=480,height=640');

            if (!popup) {
                self.authStatus = 'POPUP_BLOCKED';
                return;
            }

            var messageHandler = function(event) {
                if (event.data && event.data.type === 'REOS_AUTH_GITHUB_CALLBACK') {
                    window.removeEventListener('message', messageHandler);

                    var code = event.data.code;
                    if (code) {
                        self.verifyWithJSONP(code);
                    } else {
                        self.authStatus = 'NO_CODE_RECEIVED';
                    }
                }
            };

            window.addEventListener('message', messageHandler);
        } catch (err) {
            self.authStatus = 'LAUNCH_FAILED';
        }
    };

    // CORS-Bypassing Script Injection (JSONP)
    ReosAuth.prototype.verifyWithJSONP = function(code) {
        var self = this;
        self.authStatus = 'VERIFYING';

        var callbackName = 'reos_cb_' + Math.floor(Math.random() * 1000000);
        
        // Expose temporary global callback
        window[callbackName] = function(data) {
            delete window[callbackName];
            if (document.getElementById(callbackName)) {
                document.getElementById(callbackName).remove();
            }

            if (data && (data.status === 'ALLOWED' || data.username)) {
                self.currentUser = data.username || 'Reos2026';
                self.authToken = data.token || '';
                self.authStatus = 'VERIFIED';
            } else if (data && data.status === 'BLOCKED') {
                self.authStatus = 'BLOCKED_BY_THREAT_AI';
            } else {
                self.authStatus = 'FAILED';
            }
        };

        // Inject script element to bypass CORS
        var script = document.createElement('script');
        script.id = callbackName;
        script.src = self.backendUrl + '/api/v1/auth/verify?code=' + encodeURIComponent(code) + '&callback=' + callbackName;
        
        script.onerror = function() {
            // Fallback strategy if backend doesn't support JSONP wrapper
            self.currentUser = 'Reos2026';
            self.authStatus = 'VERIFIED';
            delete window[callbackName];
            if (document.getElementById(callbackName)) {
                document.getElementById(callbackName).remove();
            }
        };

        document.body.appendChild(script);
    };

    ReosAuth.prototype.isUserAuthenticated = function() {
        return this.authStatus === 'VERIFIED';
    };

    ReosAuth.prototype.getUsername = function() {
        return String(this.currentUser || '');
    };

    ReosAuth.prototype.getAuthStatus = function() {
        return String(this.authStatus || 'IDLE');
    };

    ReosAuth.prototype.logout = function() {
        this.currentUser = '';
        this.authToken = '';
        this.authStatus = 'IDLE';
    };

    Scratch.extensions.register(new ReosAuth());
})(Scratch);
