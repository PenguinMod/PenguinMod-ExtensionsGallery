class CloudRTCExtension {
    constructor(runtime) {
        this.runtime = runtime;
        this.username = '';
        this.room = '';
        this.peers = {};
        this.messages = [];
        this.socket = null;
        this.signalingServerUrl = 'sorry but i dont have a signaling server yet'; // Default signaling server URL
    }

    getInfo() {
        return {
            id: 'cloudRTC',
            name: 'Cloud RTC',
            blocks: [
                {
                    opcode: 'setUsername',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set username to [NAME]',
                    arguments: {
                        NAME: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'user'
                        }
                    }
                },
                {
                    opcode: 'setSignalingServer',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'set signaling server to [URL]',
                    arguments: {
                        URL: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'wss://your-signaling-server.com'
                        }
                    }
                },
                {
                    opcode: 'joinRoom',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'join room [ROOM]',
                    arguments: {
                        ROOM: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'lobby'
                        }
                    }
                },
                {
                    opcode: 'createRoom',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'create room [ROOM]',
                    arguments: {
                        ROOM: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'myRoom'
                        }
                    }
                },
                {
                    opcode: 'getAllMessages',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get all messages in current room'
                },
                {
                    opcode: 'sendMessage',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'send message [MESSAGE] in current room',
                    arguments: {
                        MESSAGE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Hello!'
                        }
                    }
                },
                {
                    opcode: 'getLatestMessage',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'get latest message in current room'
                },
                {
                    opcode: 'disconnect',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'disconnect from room'
                },
                {
                    opcode: 'whenMessageReceived',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when message in current room received'
                },
                {
                    opcode: 'whenMessageReceivedByUser',
                    blockType: Scratch.BlockType.HAT,
                    text: 'when message in current room received by [USER]',
                    arguments: {
                        USER: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'user'
                        }
                    }
                },
                {
                    opcode: 'openDocumentation',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'how to make your own signaling server'
                }
            ],
            menus: {}
        };
    }

    setUsername(args) {
        this.username = args.NAME;
    }

    setSignalingServer(args) {
        this.signalingServerUrl = args.URL;
    }

    async joinRoom(args) {
        this.room = args.ROOM;
        await this.connectToSignalingServer();
    }

    async createRoom(args) {
        this.room = args.ROOM;
        await this.connectToSignalingServer();
    }

    getAllMessages() {
        return JSON.stringify(this.messages);
    }

    sendMessage(args) {
        const message = {
            from: this.username,
            content: args.MESSAGE,
            timestamp: Date.now()
        };

        Object.values(this.peers).forEach(peer => {
            if (peer.dataChannel.readyState === 'open') {
                peer.dataChannel.send(JSON.stringify(message));
            }
        });

        this.messages.push(message);
    }

    getLatestMessage() {
        return this.messages.length > 0 
            ? `${this.messages[this.messages.length - 1].from}: ${this.messages[this.messages.length - 1].content}`
            : '';
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
        }
        Object.values(this.peers).forEach(peer => peer.close());
        this.peers = {};
        this.messages = [];
    }

    whenMessageReceived() {
        // This is a hat block, so it doesn't need to do anything here
    }

    whenMessageReceivedByUser(args) {
        // This is a hat block, so it doesn't need to do anything here
    }

    openDocumentation() {
        window.open('https://unknows-organization.gitbook.io/cloudrtc', '_blank');
    }

    // Helper methods
    async connectToSignalingServer() {
        this.socket = new WebSocket(this.signalingServerUrl);

        this.socket.onmessage = async (event) => {
            const message = JSON.parse(event.data);

            if (message.type === 'offer') {
                await this.handleOffer(message);
            } else if (message.type === 'answer') {
                await this.handleAnswer(message);
            } else if (message.type === 'candidate') {
                await this.handleCandidate(message);
            } else if (message.type === 'message') {
                await this.handleIncomingMessage(message);
            }
        };
    }

    async handleOffer(offer) {
        const peer = new RTCPeerConnection();
        this.peers[offer.from] = peer;

        peer.ondatachannel = (event) => {
            event.channel.onmessage = (msg) => {
                this.handleIncomingMessage(JSON.parse(msg.data));
            };
        };

        await peer.setRemoteDescription(offer);
        const answer = await peer.createAnswer();
        await peer.setLocalDescription(answer);

        this.socket.send(JSON.stringify({
            type: 'answer',
            to: offer.from,
            from: this.username,
            room: this.room,
            sdp: answer.sdp
        }));
    }

    async handleAnswer(answer) {
        const peer = this.peers[answer.from];
        await peer.setRemoteDescription(answer);
    }

    async handleCandidate(candidate) {
        const peer = this.peers[candidate.from];
        await peer.addIceCandidate(new RTCIceCandidate(candidate.candidate));
    }

    async handleIncomingMessage(message) {
        this.messages.push(message);

        // Dispatch event for when any message is received
        this.runtime.startHats('cloudRTC_whenMessageReceived', {
            USERNAME: message.from,
            CONTENT: message.content
        });

        // Dispatch event for when a specific user sends a message
        this.runtime.startHats('cloudRTC_whenMessageReceivedByUser', {
            USERNAME: message.from,
            CONTENT: message.content,
            USER: message.from
        });
    }
}

Scratch.extensions.register(new CloudRTCExtension(Scratch.vm.runtime));
