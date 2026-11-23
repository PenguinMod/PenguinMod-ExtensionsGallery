(function(Scratch) {
    'use strict';

    function ReosAuth() {
        this.currentUser = '';
        this.authToken = '';
        this.authStatus = 'IDLE';
        this.clientId = 'client_d5587d84';
        this.clientSecret = 'sec_10c935961724bc06c95d3715';
        this.frontendUrl = 'https://reostech.web.app';
        this.backendUrl = 'https://server-skby.onrender.com';
        this.redirectUri = 'https://reostech.github.io/ReosAuthForPenguinMod/';
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

                    if (event.data.username) {
                        self.currentUser = String(event.data.username);
                        self.authToken = event.data.token || '';
                        self.authStatus = 'VERIFIED';
                    } else if (event.data.code) {
                        self.exchangeCode(event.data.code);
                    } else if (event.data.status === 'BLOCKED') {
                        self.authStatus = 'BLOCKED_BY_THREAT_AI';
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

    ReosAuth.prototype.exchangeCode = function(code) {
        var self = this;
        self.authStatus = 'EXCHANGING_TOKEN';

        var tokenUrl = self.backendUrl + '/oauth/token';

        // Standard OAuth 2.0 form-urlencoded body (avoids CORS preflight & satisfies strict OAuth parsers)
        var formBody = new URLSearchParams();
        formBody.append('grant_type', 'authorization_code');
        formBody.append('code', code);
        formBody.append('client_id', self.clientId);
        formBody.append('client_secret', self.clientSecret);
        formBody.append('redirect_uri', self.redirectUri);

        fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody.toString()
        })
        .then(function(res) {
            return res.text().then(function(text) {
                var data = {};
                try { data = JSON.parse(text); } catch (e) {}

                if (!res.ok) {
                    var detail = data.error_description || data.error || data.message || text || ('HTTP_' + res.status);
                    throw new Error(res.status + ': ' + detail);
                }
                return data;
            });
        })
        .then(function(data) {
            var token = data.access_token || data.token || '';
            var username = data.username || (data.user && data.user.username) || data.name;

            if (username) {
                self.currentUser = String(username);
                self.authToken = token;
                self.authStatus = 'VERIFIED';
                return;
            }

            if (token) {
                self.authToken = token;
                self.fetchUserProfile(token);
            } else {
                self.authStatus = 'NO_TOKEN_IN_RESPONSE';
            }
        })
        .catch(function(err) {
            self.authStatus = 'TOKEN_ERROR_' + err.message;
        });
    };

    ReosAuth.prototype.fetchUserProfile = function(token) {
        var self = this;
        self.authStatus = 'FETCHING_USER';

        fetch(self.backendUrl + '/oauth/userinfo', {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + token
            }
        })
        .then(function(res) {
            return res.text().then(function(text) {
                var profile = {};
                try { profile = JSON.parse(text); } catch (e) {}

                if (!res.ok) {
                    var detail = profile.error_description || profile.error || profile.message || text || ('HTTP_' + res.status);
                    throw new Error(res.status + ': ' + detail);
                }
                return profile;
            });
        })
        .then(function(profile) {
            var username = profile.username || profile.preferred_username || profile.name || (profile.user && profile.user.username);
            if (username) {
                self.currentUser = String(username);
                self.authStatus = 'VERIFIED';
            } else {
                self.authStatus = 'USERNAME_MISSING_IN_PROFILE';
            }
        })
        .catch(function(err) {
            self.authStatus = 'PROFILE_ERROR_' + err.message;
        });
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
