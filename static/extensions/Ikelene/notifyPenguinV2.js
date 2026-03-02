(function(Scratch) {
    'use strict';

    class IkeNotifyPenguin {
        constructor() {
            this.apiUrl = 'https://ikelene.dev/notifications/v2';
            this.projectId = null; 
        }

        serialize() { return { projectId: this.getProjectId() }; }
        deserialize(data) { if (data && data.projectId) this.projectId = data.projectId; }

        getProjectId() {
            if (!this.projectId) this.projectId = 'proj_' + Math.random().toString(36).substr(2, 8) + '_' + Date.now().toString(36);
            return this.projectId;
        }

        getInfo() {
            return {
                id: 'IkeNotifyPenguin',
                name: 'NotifyPenguin V2',
                color1: '#008080',
                color2: '#006666',
                blocks: [
                    {
                        opcode: 'registerDevice',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'register this device for notifications as [USER]',
                        arguments: { USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'Player1' } }
                    },
                    {
                        opcode: 'openSettings',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'manage notification settings'
                    },
                    {
                        opcode: 'sendLive',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'send live notification to [USER] title: [TITLE] body: [BODY]',
                        arguments: {
                            USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'Player1' },
                            TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'penguinmod Alert' },
                            BODY: { type: Scratch.ArgumentType.STRING, defaultValue: 'Immediate Dispatch.' }
                        }
                    },
                    {
                        opcode: 'schedulePush',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'schedule notification to [USER] title: [TITLE] body: [BODY] at date: [DATE] time: [TIME]',
                        arguments: {
                            USER: { type: Scratch.ArgumentType.STRING, defaultValue: 'Player1' },
                            TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: 'penguinmod Reminder' },
                            BODY: { type: Scratch.ArgumentType.STRING, defaultValue: 'Check dispatch.' },
                            DATE: { type: Scratch.ArgumentType.STRING, defaultValue: '2026-03-05' },
                            TIME: { type: Scratch.ArgumentType.STRING, defaultValue: '14:30' } 
                        }
                    }
                ]
            };
        }

        openRegistrationPopup() {
            return new Promise((resolve, reject) => {
                const width = 400, height = 400;
                const left = (window.screen.width / 2) - (width / 2);
                const top = (window.screen.height / 2) - (height / 2);
                
                const popup = window.open(`${this.apiUrl}/subscribe.html`, 'Push Registration', `width=${width},height=${height},top=${top},left=${left}`);

                if (!popup) return reject(new Error("Popup blocked."));

                const listener = (event) => {
                    if (event.data && event.data.action) {
                        if (event.data.action === 'POPUP_SUCCESS') {
                            window.removeEventListener('message', listener);
                            resolve(event.data.subscription);
                        } else if (event.data.action === 'POPUP_ERROR') {
                            window.removeEventListener('message', listener);
                            reject(new Error(event.data.error));
                        }
                    }
                };

                window.addEventListener('message', listener);
            });
        }

        async registerDevice(args) {
            try {
                const subscription = await this.openRegistrationPopup();
                const apiRes = await fetch(`${this.apiUrl}/register.php`, {
                    method: 'POST',
                    body: JSON.stringify({
                        project_id: this.getProjectId(),
                        username: args.USER,
                        subscription: subscription
                    }),
                    headers: { 'Content-Type': 'application/json' }
                });

                const data = await apiRes.json();
                if (data.error) throw new Error(data.error);
            } catch (err) {
                throw new Error(`Register Error: ${err.message}`);
            }
        }

        openSettings() {
            window.open(`${this.apiUrl}/index.html?highlight=${this.getProjectId()}`, '_blank');
        }

        async sendLive(args) {
            try {
                const response = await fetch(`${this.apiUrl}/send_live.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ project_id: this.getProjectId(), username: args.USER, title: args.TITLE, body: args.BODY })
                });
                const data = await response.json();
                if (data.error || data.status === 'failed') throw new Error(data.error || 'Unknown error');
            } catch (err) {
                throw new Error(`Send Error: ${err.message}`);
            }
        }

        async schedulePush(args) {
            try {
                const response = await fetch(`${this.apiUrl}/schedule.php`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ project_id: this.getProjectId(), username: args.USER, title: args.TITLE, body: args.BODY, date: args.DATE, time: args.TIME })
                });
                const data = await response.json();
                if (data.error || data.status === 'failed') throw new Error(data.error);
            } catch (err) {
                throw new Error(`Schedule Error: ${err.message}`);
            }
        }
    }

    Scratch.extensions.register(new IkeNotifyPenguin());
})(Scratch);
