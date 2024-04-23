/*
Barebones WebRTC extension for Scratch 3

MIT License

Copyright (C) 2024 Mike Renaker "MikeDEV".

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

TODO 1: Remove CL Omega redundant code
TODO 2: Audio support
TODO 3: Audio panning support https://developer.mozilla.org/en-US/docs/Web/API/StereoPannerNode
*/

// WebRTC
// ID: webrtc
// Description: A barebones WebRTC implementation.
// By: MikeDEV
// License: MIT
(() => {
    (function (Scratch2) {

        function until(conditionFunction) {
            const poll = resolve => {
                if(conditionFunction()) resolve();
                else setTimeout(_ => poll(resolve), 100);
            };
            return new Promise(poll);
        }

        class WebRTC {
            constructor() {
                this.configuration = {
    
                    // Public STUN/TURN servers.
                    iceServers: [
                        { urls: 'stun:vpn.mikedev101.cc:3478' },
                        { urls: 'turn:vpn.mikedev101.cc:3478', username: "free", credential: "free" },
                        { urls: 'stun:stun.l.google.com:19302' },
                        { urls: 'stun:freeturn.net:3478' },
                        { urls: 'stun:freeturn.net:5349' },
                        { urls: 'turn:freeturn.net:3478', username: "free", credential: "free" },
                        { urls: 'turns:freeturn.net:5349', username: "free", credential: "free" },
                    ],
    
                    // Set to 'relay' if you want to only use TURN.
                    iceTransportPolicy: 'all',
                };
    
                this.peerConnections = new Map();
                this.voiceConnections = new Map();
                this.dataChannels = new Map();
                this.messageHandlers = {
                    onIceCandidate: {},
                    onIceGatheringDone: {},
                    onChannelOpen: {},
                    onChannelMessage: {},
                    onChannelClose: {},
                }
                this.iceCandidates = {};
            }
    
            getPeers() {
                let output = new Array();
    
                // Convert each entry of peerConnections into [name] format
                let peers = Array.from(this.peerConnections.keys());
                Array.from(peers).forEach((ulid) => {
                    output.push(ulid);
                })
    
                return output;
            }

            getConnectedPeers() {
                let output = new Array();
    
                // Convert each entry of peerConnections into [name] format
                let peers = Array.from(this.peerConnections.keys());
                
                // Filter out disconnected or preparing peers
                Array.from(peers).forEach((ulid) => {
                    if (this.peerConnections.get(ulid).connectionState == "connected") output.push(ulid);
                })
    
                return output;
            }
    
            getPeerChannels(remoteUserId) {
                if (!this.isPeerConnected(remoteUserId)) return [];
                return Array.from(this.dataChannels.get(remoteUserId).keys());
            }
    
            // Voice channel functions
    
            async createVoiceOffer(remoteUserId, remoteUserName) {
                const voiceConnection = this.createConnection(remoteUserId, remoteUserName, true);
                await this.handleVoiceStream(voiceConnection, remoteUserId, remoteUserName);
                try {
                    const offer = await voiceConnection.createOffer();
                    await voiceConnection.setLocalDescription(offer);
                    return offer;
                } catch (error) {
                    console.error(`Error creating voice offer for ${voiceConnection.user} (${remoteUserId}): ${error}`);
                    return null;
                }
            }
    
            async createVoiceAnswer(remoteUserId, remoteUserName, offer) {
                const voiceConnection = this.createConnection(remoteUserId, remoteUserName, true);
                await this.handleVoiceStream(voiceConnection, remoteUserId, remoteUserName);
                try {
                    await voiceConnection.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await voiceConnection.createAnswer();
                    await voiceConnection.setLocalDescription(answer);
                    return answer;
                } catch (error) {
                    console.error(`Error creating voice answer for ${voiceConnection.user} (${remoteUserId}): ${error}`);
                    return null;
                }
            }
    
            async handleVoiceAnswer(remoteUserId, answer) {
                const voiceConnection = this.voiceConnections.get(remoteUserId);
                if (voiceConnection) {
                    try {
                        await voiceConnection.setRemoteDescription(new RTCSessionDescription(answer));
                    } catch (error) {
                        console.error(`Error handling voice answer for ${voiceConnection.user} (${remoteUserId}): ${error}`);
                    }
                } else {
                    console.error(`Peer voice connection not found for ${remoteUserId}`);
                }
            }
    
            addVoiceIceCandidate(remoteUserId, iceCandidate) {
                const voiceConnection = this.voiceConnections.get(remoteUserId);
                if (voiceConnection) {
                    try {
                        const candidate = new RTCIceCandidate(iceCandidate);
                        voiceConnection.addIceCandidate(candidate);
                    } catch (error) {
                        console.error(`Error adding voice ice candidate for ${voiceConnection.user} (${remoteUserId}): ${error}`);
                    }
                } else {
                    console.error(`Peer voice connection not found for ${remoteUserId}`);
                }
            }
    
            // Data channel functions
    
            async createDataOffer(remoteUserId, remoteUserName) {
                const peerConnection = this.createConnection(remoteUserId, remoteUserName);
                this.createDefaultChannel(peerConnection, remoteUserId, remoteUserName);
                try {
                    const offer = await peerConnection.createOffer();
                    await peerConnection.setLocalDescription(offer);
                    return offer;
                } catch (error) {
                    console.error(`Error creating offer for ${peerConnection.user} (${remoteUserId}): ${error}`);
                    return null;
                }
            }
    
            async createDataAnswer(remoteUserId, remoteUserName, offer) {
                const peerConnection = this.createConnection(remoteUserId, remoteUserName, false);
                this.createDefaultChannel(peerConnection, remoteUserId, remoteUserName);
                try {
                    await peerConnection.setRemoteDescription(new RTCSessionDescription(offer));
                    const answer = await peerConnection.createAnswer();
                    await peerConnection.setLocalDescription(answer);
                    return answer;
                } catch (error) {
                    console.error(`Error creating answer for ${peerConnection.user} (${remoteUserId}): ${error}`);
                    return null;
                }
            }
    
            async handleDataAnswer(remoteUserId, answer) {
                const peerConnection = this.peerConnections.get(remoteUserId);
                if (peerConnection) {
                    try {
                        await peerConnection.setRemoteDescription(new RTCSessionDescription(answer));
                    } catch (error) {
                        console.error(`Error handling answer for ${peerConnection.user} (${remoteUserId}): ${error}`);
                    }
                } else {
                    console.error(`Peer connection not found for ${remoteUserId}`);
                }
            }
    
            addDataIceCandidate(remoteUserId, iceCandidate) {
                const peerConnection = this.peerConnections.get(remoteUserId);
                if (peerConnection) {
                    try {
                        const candidate = new RTCIceCandidate(iceCandidate);
                        peerConnection.addIceCandidate(candidate);
                    } catch (error) {
                        console.error(`Error adding ice candidate for ${peerConnection.user} (${remoteUserId}): ${error}`);
                    }
                } else {
                    console.error(`Peer connection not found for ${peerConnection.user} (${remoteUserId})`);
                }
            }
    
            // Common function for creating peer/voice connections
            createConnection(remoteUserId, remoteUserName, isAudioOnly) {
                const conn = new RTCPeerConnection(this.configuration);
    
                // Set username
                conn.user = remoteUserName;
    
                // Add channel ID counter
                conn.channelIdCounter = 0;
    
                // Add flag to check if the peer has sent a public key
                conn.hasPublicKey = false;
    
                // Handle ICE candidate gathering
                conn.onicecandidate = (event) => {
                    if (event.candidate) {
                        if (!this.iceCandidates[remoteUserId]) {
                            this.iceCandidates[remoteUserId] = [];
                        }
                        this.iceCandidates[remoteUserId].push(event.candidate);
                        if (this.messageHandlers.onIceCandidate[remoteUserId]) {
                            this.messageHandlers.onIceCandidate[remoteUserId](event.candidate);
                        }
                    }
                    if (event.target.iceGatheringState === 'complete') {
                        if (this.messageHandlers.onIceGatheringDone[remoteUserId]) {
                            this.messageHandlers.onIceGatheringDone[remoteUserId]();
                        }
                    }
                };
    
                // handle data channel creation
                if (!isAudioOnly) {
                    conn.ondatachannel = (event) => {
                        const dataChannel = event.channel;
                        this.handleDataChannel(dataChannel, remoteUserId, remoteUserName);
                    };
                }
    
                // Handle connection state changes
                conn.onconnectionstatechange = () => {
                    switch (conn.connectionState) {
                        case "new":
                            console.log(`Peer ${remoteUserName} (${remoteUserId}) created.`);
                            break;
                        case "connecting":
                            console.log(`Peer ${remoteUserName} (${remoteUserId}) connecting...`);
                            break;
                        case "connected":
                            console.log(`Peer ${remoteUserName} (${remoteUserId}) connected.`);
                            break;
                        case "disconnected":
                            console.log(`Peer ${remoteUserName} (${remoteUserId}) disconnecting...`);
                            break;
                        case "closed":
                            console.log(`Peer ${remoteUserName} (${remoteUserId}) disconnected.`);
                            if (isAudioOnly) this.closeVoiceStream(remoteUserId);
                            else this.disconnectDataPeer(remoteUserId);
                            break;
                        case "failed":
                            console.log(`Peer ${remoteUserName} (${remoteUserId}) connection failed.`);
                            if (isAudioOnly) this.closeVoiceStream(remoteUserId);
                            else this.disconnectDataPeer(remoteUserId);
                            break;
                        default:
                            console.log(`Peer ${remoteUserName} (${remoteUserId}) connection state unknown.`);
                            break;
                    }
                };
    
                if (isAudioOnly) {
                    // Handle incoming tracks
                    conn.ontrack = (event) => {
                        console.log(`Adding peer ${remoteUserId} audio stream... ${event.streams}`);
    
                        // Auto-play the received audio stream
                        for (const stream of event.streams) {
                            let audioElement = document.createElement(`audio`);
                            audioElement.id = `audio_${remoteUserId}`;
                            audioElement.srcObject = stream;
                            audioElement.autoplay = true;
    
                            // Attach audio element to DOM for remote playback
                            document.body.appendChild(audioElement);
                        }
                    };
                }
    
                if (isAudioOnly) this.voiceConnections.set(remoteUserId, conn);
                else this.peerConnections.set(remoteUserId, conn);
    
                return conn;
            }
    
            handleDataChannel(dataChannel, remoteUserId, remoteUserName) {
                const channel = dataChannel;
    
                // Create reference to channel
                if (!this.dataChannels.has(remoteUserId)) this.dataChannels.set(remoteUserId, new Map());
    
                // Create channel message storage
                channel.dataStorage = "";
    
                channel.onmessage = (event) => {
                    console.log(`Data channel ${channel.label} with ${remoteUserName} (${remoteUserId}) has new message ${event.data}`);
                    this.dataChannels.get(remoteUserId).get(channel.label).dataStorage = event.data;
                    if (this.messageHandlers.onChannelMessage[remoteUserId]) {
                        this.messageHandlers.onChannelMessage[remoteUserId](event.data, channel);
                    }
                };
    
                channel.onopen = () => {
                    console.log(`Data channel ${channel.label} with ${remoteUserName} (${remoteUserId}) opened`);
                    if (this.messageHandlers.onChannelOpen[remoteUserId]) {
                        this.messageHandlers.onChannelOpen[remoteUserId](channel.label);
                    }
                };
    
                channel.onclose = () => {
                    console.log(`Data channel ${channel.label} with ${remoteUserName} (${remoteUserId}) closed`);
                    if (channel.label == "default") {
                        this.closeVoiceStream(remoteUserId);
                        this.disconnectDataPeer(remoteUserId);
                    } else {
                        this.dataChannels.get(remoteUserId).delete(channel.label);
                    }

                    if (this.messageHandlers.onChannelClose[remoteUserId]) this.messageHandlers.onChannelClose[remoteUserId](channel.label);
                };
    
                // Store reference to channel
                this.dataChannels.get(remoteUserId).set(channel.label, channel);
            }
    
            async handleVoiceStream(voiceConnection, remoteUserId, remoteUserName) {
                // Create a new audio track
                console.log(`Preparing to open voice stream channel with ${remoteUserName} (${remoteUserId})...`);
    
                await navigator.mediaDevices.getUserMedia({ audio: true })
                    .then(stream => {
                        stream.getTracks().forEach(track => {
                            console.log("Adding track:", track, `to peer ${remoteUserName} (${remoteUserId})...`);
                            voiceConnection.addTrack(track, stream);
                        });
                        console.log(`Opened voice stream channel with ${remoteUserName} (${remoteUserId}).`);
                    })
                    .catch(err => {
                        console.error(`Error adding audio stream for peer ${remoteUserName} (${remoteUserId}):`, err);
                    });
            }
    
            closeVoiceStream(remoteUserId) {
                let audioElement = document.getElementById(`audio_${remoteUserId}`);
                if (audioElement) {
                    console.log(`Removing peer ${remoteUserId} audio stream...`);
                    document.body.removeChild(audioElement);
                }
    
                // Delete the voiceConnection and all ICE candidates gathered
                this.voiceConnections.delete(remoteUserId);
                delete this.iceCandidates[remoteUserId];
            }
    
            createChannel(remoteUserId, label, ordered) {
                const peerConnection = this.peerConnections.get(remoteUserId);
                const dataChannel = peerConnection.createDataChannel(
                    label,
                    { negotiated: false, ordered }
                );
                this.handleDataChannel(dataChannel, remoteUserId, peerConnection.user);
                return dataChannel;
            }

            closeChannel(remoteUserId, label) {
                if (!this.dataChannels.has(remoteUserId)) return;
                if (!this.dataChannels.get(remoteUserId).has(label)) return;
                this.dataChannels.get(remoteUserId).get(label).close();
                this.dataChannels.get(remoteUserId).delete(label);
            }
    
            isPeerConnected(remoteUserId) {
                if (!this.peerConnections.get(remoteUserId)) return false;
                return (this.peerConnections.get(remoteUserId).connectionState == "connected");
            }
    
            doesPeerChannelExist(remoteUserId, channel) {
                if (!this.isPeerConnected(remoteUserId)) return false;
                return this.dataChannels.get(remoteUserId).has(channel);
            }
    
            createDefaultChannel(peerConnection, remoteUserId, remoteUserName) {
                const dataChannel = peerConnection.createDataChannel(
                    "default",
                    { negotiated: true, id: 0, ordered: true }
                );
                this.handleDataChannel(dataChannel, remoteUserId, remoteUserName);
                return dataChannel;
            }
    
            disconnectDataPeer(remoteUserId) {
                const peerConnection = this.peerConnections.get(remoteUserId);
                if (peerConnection) {
                    const remoteUserName = peerConnection.user;
                    peerConnection.close();
    
                    // Delete the peerConnection and all ICE candidates gathered
                    this.peerConnections.delete(remoteUserId);
                    delete this.iceCandidates[remoteUserId];
    
                    // Clear all data channels
                    if (this.dataChannels.has(remoteUserId)) {
                        const channels = this.dataChannels.get(remoteUserId);
                        for (const channel of channels.values()) {
                            channel.close();
                        }
                        this.dataChannels.delete(remoteUserId);
                    }

                    console.log(`Disconnected peer ${remoteUserName} (${remoteUserId}).`);
                }
            }
    
            onIceCandidate(remoteUserId, callback) {
                this.messageHandlers.onIceCandidate[remoteUserId] = callback;
            }
    
            onIceGatheringDone(remoteUserId, callback) {
                this.messageHandlers.onIceGatheringDone[remoteUserId] = callback;
            }
    
            onChannelOpen(remoteUserId, callback) {
                this.messageHandlers.onChannelOpen[remoteUserId] = callback;
            }
    
            onChannelClose(remoteUserId, callback) {
                this.messageHandlers.onChannelClose[remoteUserId] = callback;
            }
    
            onChannelMessage(remoteUserId, callback) {
                this.messageHandlers.onChannelMessage[remoteUserId] = callback;
            }
    
            sendData(remoteUserId, channelLabel, data, wait) {
                // Get peer.
                const peer = this.dataChannels.get(remoteUserId);
    
                if (!peer) {
                    console.warn(`Peer ${remoteUserId} does not exist`);
                    return;
                }
    
                // Get channel from peer.
                const channel = peer.get(channelLabel);
    
                if (!channel) {
                    console.warn(`Channel ${channelLabel} does not exist for peer ${remoteUserId}`);
                    return;
                }
    
                if (wait) channel.bufferedAmountThreshold = 0;
    
                channel.send(data);
    
                if (wait) return new Promise((resolve) => {
                    channel.onbufferedamountlow = () => {
                        resolve();
                    }
                })
            }
    
            getChannelData(remoteUserId, channelLabel) {
                const peer = this.dataChannels.get(remoteUserId);
                if (!peer) return;
                const channel = peer.get(channelLabel);
                if (!channel) return;
                return channel.dataStorage;
            }
    
            removeIceCandidate(remoteUserId, candidate) {
                if (this.iceCandidates[remoteUserId].includes(candidate)) {
                    this.iceCandidates[remoteUserId].splice(this.iceCandidates[remoteUserId].indexOf(candidate), 1);
                }
            }
        }
    
        // Define the extension for WebRTC for Scratch
        class ScratchWebRTC {
            constructor(Scratch2) {
                this.vm = Scratch2.vm; // VM
                this.webrtc = new WebRTC();
                this.offers = new Map();
                this.answers = new Map();
                this.ice = new Map();
                this.iceComplete = new Map();
                this.menuIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+Cjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIC0zLjUgMjU2IDI1NiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+Cgk8Zz4KCQk8cGF0aCBkPSJNMTQyLjA3NjU3OCwxOTEuMDg2ODE3IEMxNDIuMDc2NTc4LDE1OS4yODA2NTYgMTE2LjI5NDc1OSwxMzMuNDk0NjE1IDg0LjQ4ODU5NjksMTMzLjQ5NDYxNSBDNTIuNjc4MjEzNiwxMzMuNDk0NjE1IDI2Ljg5NjM5NCwxNTkuMjgwNjU2IDI2Ljg5NjM5NCwxOTEuMDg2ODE3IEMyNi44OTYzOTQsMjIyLjg5Mjk3OSA1Mi42NzgyMTM2LDI0OC42NzkwMiA4NC40ODg1OTY5LDI0OC42NzkwMiBDMTE2LjI5NDc1OSwyNDguNjc5MDIgMTQyLjA3NjU3OCwyMjIuODkyOTc5IDE0Mi4wNzY1NzgsMTkxLjA4NjgxNyIgZmlsbD0iI0ZGNjYwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODQuNDg2NDg2LCAxOTEuMDg2ODE3KSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC04NC40ODY0ODYsIC0xOTEuMDg2ODE3KSAiPgoNPC9wYXRoPgoJCTxwYXRoIGQ9Ik0yNTUuOTc5NzAzLDExMC40NTQzNTYgQzI1NS45Nzk3MDMsNzguNjUyNDE2IDIzMC4xOTc4ODQsNTIuODYyMTUzIDE5OC4zOTE3MjIsNTIuODYyMTUzIEMxNjYuNTgxMzM5LDUyLjg2MjE1MyAxNDAuNzk5NTE5LDc4LjY1MjQxNiAxNDAuNzk5NTE5LDExMC40NTQzNTYgQzE0MC43OTk1MTksMTQyLjI2MDUxOCAxNjYuNTgxMzM5LDE2OC4wNTA3ODEgMTk4LjM5MTcyMiwxNjguMDUwNzgxIEMyMzAuMTk3ODg0LDE2OC4wNTA3ODEgMjU1Ljk3OTcwMywxNDIuMjYwNTE4IDI1NS45Nzk3MDMsMTEwLjQ1NDM1NiIgZmlsbD0iI0ZGQ0MwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk4LjM4OTYxMSwgMTEwLjQ1NjQ2Nykgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMTk4LjM4OTYxMSwgLTExMC40NTY0NjcpICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTExNS4yMDA0OTgsMTA5LjE3NjQ1MiBDMTE1LjIwMDQ5OCw3Ny4zNzQ1MTI1IDg5LjQxODY3ODYsNTEuNTg0MjQ5NSA1Ny42MDgyOTUzLDUxLjU4NDI0OTUgQzI1LjgwNjM1NTMsNTEuNTg0MjQ5NSAwLjAyMDMxNDAyNzEsNzcuMzc0NTEyNSAwLjAyMDMxNDAyNzEsMTA5LjE3NjQ1MiBDMC4wMjAzMTQwMjcxLDE0MC45ODI2MTQgMjUuODA2MzU1MywxNjYuNzcyODc3IDU3LjYwODI5NTMsMTY2Ljc3Mjg3NyBDODkuNDE4Njc4NiwxNjYuNzcyODc3IDExNS4yMDA0OTgsMTQwLjk4MjYxNCAxMTUuMjAwNDk4LDEwOS4xNzY0NTIiIGZpbGw9IiMwMDg5Q0MiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU3LjYxMDQwNiwgMTA5LjE3ODU2Mykgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtNTcuNjEwNDA2LCAtMTA5LjE3ODU2MykgIj4KDTwvcGF0aD4KCQk8cGF0aCBkPSJNMjMwLjM4NTc0OSwxOTEuMDg2ODE3IEMyMzAuMzg1NzQ5LDE1OS4yODA2NTYgMjA0LjYwMzkyOSwxMzMuNDk0NjE1IDE3Mi43ODkzMjQsMTMzLjQ5NDYxNSBDMTQwLjk4NzM4NCwxMzMuNDk0NjE1IDExNS4yMDEzNDMsMTU5LjI4MDY1NiAxMTUuMjAxMzQzLDE5MS4wODY4MTcgQzExNS4yMDEzNDMsMjIyLjg5Mjk3OSAxNDAuOTg3Mzg0LDI0OC42NzkwMiAxNzIuNzg5MzI0LDI0OC42NzkwMiBDMjA0LjYwMzkyOSwyNDguNjc5MDIgMjMwLjM4NTc0OSwyMjIuODkyOTc5IDIzMC4zODU3NDksMTkxLjA4NjgxNyIgZmlsbD0iIzAwOTkzOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcyLjc5MzU0NiwgMTkxLjA4NjgxNykgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMTcyLjc5MzU0NiwgLTE5MS4wODY4MTcpICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTE4NS41OTIwMDEsNTcuOTg0MzIxMyBDMTg1LjU5MjAwMSwyNi4xNzgxNTk3IDE1OS44MDU5NTksMC4zOTIxMTgzNDkgMTI3Ljk5OTc5OCwwLjM5MjExODM0OSBDOTYuMTkzNjM1OSwwLjM5MjExODM0OSA3MC40MDc1OTQ2LDI2LjE3ODE1OTcgNzAuNDA3NTk0Niw1Ny45ODQzMjEzIEM3MC40MDc1OTQ2LDg5Ljc5MDQ4MyA5Ni4xOTM2MzU5LDExNS41NzY1MjQgMTI3Ljk5OTc5OCwxMTUuNTc2NTI0IEMxNTkuODA1OTU5LDExNS41NzY1MjQgMTg1LjU5MjAwMSw4OS43OTA0ODMgMTg1LjU5MjAwMSw1Ny45ODQzMjEzIiBmaWxsPSIjQkYwMDAwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjcuOTk5Nzk4LCA1Ny45ODQzMjEpIHNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTEyNy45OTk3OTgsIC01Ny45ODQzMjEpICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTE0MC43OTg2NzUsNTcuOTc4ODMzMSBDMTQwLjc5ODY3NSw1Ni43NjcyMSAxNDAuOTA0MjE3LDU1LjU4MDkxNyAxNDAuOTgwMjA3LDU0LjM4NjE4MDcgQzE2Ni41MjU2MTIsNjAuMjc5NjUwNSAxODUuNTkwNzM0LDgzLjExODk1NjkgMTg1LjU5MDczNCwxMTAuNDU0MzU2IEMxODUuNTkwNzM0LDExMS42NjU5NzkgMTg1LjQ4NTE5MiwxMTIuODU2NDk0IDE4NS40MDkyMDIsMTE0LjA1MTIzIEMxNTkuODYzNzk2LDEwOC4xNTM1MzkgMTQwLjc5ODY3NSw4NS4zMTQyMzIyIDE0MC43OTg2NzUsNTcuOTc4ODMzMSIgZmlsbD0iI0ZDMDAwNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYzLjE5NDcwNCwgODQuMjE4NzA1KSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC0xNjMuMTk0NzA0LCAtODQuMjE4NzA1KSAiPgoNPC9wYXRoPgoJCTxwYXRoIGQ9Ik0xNDguMzk2ODYsMTYyLjU3MDYxNCBDMTU4LjMyMjAzOCwxNDUuMjE5NDk1IDE3Ni45NzM0MzQsMTMzLjQ5NTg4MSAxOTguMzk0MjU1LDEzMy40OTU4ODEgQzIwNy4xMjQ2OTYsMTMzLjQ5NTg4MSAyMTUuMzY5NjQzLDEzNS40OTY5NTkgMjIyLjc4NzE0MSwxMzguOTc1NjI2IEMyMTIuODY2MTg1LDE1Ni4zMjY3NDQgMTk0LjIxNDc4OSwxNjguMDUwMzU4IDE3Mi43ODk3NDYsMTY4LjA1MDM1OCBDMTY0LjA1OTMwNSwxNjguMDUwMzU4IDE1NS44MTQzNTgsMTY2LjA0OTI4MSAxNDguMzk2ODYsMTYyLjU3MDYxNCIgZmlsbD0iIzFDRDMwNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg1LjU5MjAwMSwgMTUwLjc3MzEyMCkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMTg1LjU5MjAwMSwgLTE1MC43NzMxMjApICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTExNS4yMDA0OTgsMTkxLjA4NjgxNyBDMTE1LjIwMDQ5OCwxNzcuMDE1OTQ3IDEyMC4yNTgwNzUsMTY0LjEzOTgxMyAxMjguNjQyMzM4LDE1NC4xMzg2NDYgQzEzNy4wMTgxNTcsMTY0LjEzOTgxMyAxNDIuMDc1NzM0LDE3Ny4wMTU5NDcgMTQyLjA3NTczNCwxOTEuMDg2ODE3IEMxNDIuMDc1NzM0LDIwNS4xNTc2ODggMTM3LjAxODE1NywyMTguMDMzODIyIDEyOC42NDIzMzgsMjI4LjAzNDk4OSBDMTIwLjI1ODA3NSwyMTguMDMzODIyIDExNS4yMDA0OTgsMjA1LjE1NzY4OCAxMTUuMjAwNDk4LDE5MS4wODY4MTciIGZpbGw9IiMwRjc1MDQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyOC42MzgxMTYsIDE5MS4wODY4MTcpIHNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTEyOC42MzgxMTYsIC0xOTEuMDg2ODE3KSAiPgoNPC9wYXRoPgoJCTxwYXRoIGQ9Ik0zNC44MDY5ODQsMTM4LjIxMjc2OCBDNDEuODAyMzEzMiwxMzUuMTkwMDQzIDQ5LjUwMjY2MzUsMTMzLjQ5NzE0OCA1Ny42MDgyOTUzLDEzMy40OTcxNDggQzc4LjgxODAzMiwxMzMuNDk3MTQ4IDk3LjI5NjMzOTYsMTQ0Ljk5Mjc5MSAxMDcuMjkzMjg2LDE2Mi4wNjEwNTYgQzEwMC4yOTc5NTYsMTY1LjA4Mzc4MiA5Mi41OTMzODQ0LDE2Ni43NzI0NTUgODQuNDkxOTc0MywxNjYuNzcyNDU1IEM2My4yODIyMzc2LDE2Ni43NzI0NTUgNDQuNzk5NzA4MywxNTUuMjc2ODExIDM0LjgwNjk4NCwxMzguMjEyNzY4IiBmaWxsPSIjMEM1RTg3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MS4wNTAxMzUsIDE1MC4xMzQ4MDEpIHNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTcxLjA1MDEzNSwgLTE1MC4xMzQ4MDEpICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTcwLjY1NDU2MzEsMTE0LjAzNjAzMiBDNzAuNTE5NDY5MiwxMTIuNDMxNzkyIDcwLjQwNTQ4MzgsMTEwLjgxOTEwOSA3MC40MDU0ODM4LDEwOS4xNzY4NzUgQzcwLjQwNTQ4MzgsODEuODYyNTg0IDg5LjQ0MTA1MzYsNTkuMDQ0Mzg2IDExNC45NTY5MDcsNTMuMTI1NTg2MSBDMTE1LjA4Nzc3OSw1NC43Mjk4MjU3IDExNS4yMDE3NjUsNTYuMzQyNTA4NyAxMTUuMjAxNzY1LDU3Ljk4MDUyMTggQzExNS4yMDE3NjUsODUuMjk0ODEyNSA5Ni4xNzA0MTY3LDEwOC4xMjE0NTQgNzAuNjU0NTYzMSwxMTQuMDM2MDMyIiBmaWxsPSIjNkIwMDAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Mi44MDM2MjQsIDgzLjU4MDgwOSkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtOTIuODAzNjI0LCAtODMuNTgwODA5KSAiPgoNPC9wYXRoPgoJCTxwYXRoIGQ9Ik03Ni4wMzA0NTQ1LDExMS41MDM4NjYgTDY3LjAyMTM4MjUsMTExLjUwMzg2NiBDNTkuMDY3NzMxMiwxMTEuNTAzODY2IDUyLjYwMDExMjUsMTE3Ljk1MDM3NyA1Mi42MDAxMTI1LDEyNS44ODI5MiBMNTIuNjAwMTEyNSwyMDcuNDI4OTUzIEM1Mi42MDAxMTI1LDIxNS4zNjE0OTYgNTkuMDY3NzMxMiwyMjEuODEyMjI4IDY3LjAyMTM4MjUsMjIxLjgxMjIyOCBMMTc5Ljk4OTQwNSwyMjEuODEyMjI4IEMxODcuOTQzMDU2LDIyMS44MTIyMjggMTk0LjQwNjQ1MywyMTUuMzYxNDk2IDE5NC40MDY0NTMsMjA3LjQyODk1MyBMMTk0LjQwNjQ1MywxMjUuODgyOTIgQzE5NC40MDY0NTMsMTE3Ljk1MDM3NyAxODcuOTQzMDU2LDExMS41MDM4NjYgMTc5Ljk4OTQwNSwxMTEuNTAzODY2IEwxNDEuNTA0NTQsMTExLjUwMzg2NiBMNjQuMjg5OTUzNCw3My42NTIyNTQ0IEw3Ni4wMzA0NTQ1LDExMS41MDM4NjYgTDc2LjAzMDQ1NDUsMTExLjUwMzg2NiBaIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjMuNTAzMjgzLCAxNDcuNzMyMjQxKSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC0xMjMuNTAzMjgzLCAtMTQ3LjczMjI0MSkgIj4KDTwvcGF0aD4KCTwvZz4KPC9zdmc+";
                this.blockIconURI = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gVXBsb2FkZWQgdG86IFNWRyBSZXBvLCB3d3cuc3ZncmVwby5jb20sIEdlbmVyYXRvcjogU1ZHIFJlcG8gTWl4ZXIgVG9vbHMgLS0+Cjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIC0zLjUgMjU2IDI1NiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiBwcmVzZXJ2ZUFzcGVjdFJhdGlvPSJ4TWlkWU1pZCI+Cgk8Zz4KCQk8cGF0aCBkPSJNMTQyLjA3NjU3OCwxOTEuMDg2ODE3IEMxNDIuMDc2NTc4LDE1OS4yODA2NTYgMTE2LjI5NDc1OSwxMzMuNDk0NjE1IDg0LjQ4ODU5NjksMTMzLjQ5NDYxNSBDNTIuNjc4MjEzNiwxMzMuNDk0NjE1IDI2Ljg5NjM5NCwxNTkuMjgwNjU2IDI2Ljg5NjM5NCwxOTEuMDg2ODE3IEMyNi44OTYzOTQsMjIyLjg5Mjk3OSA1Mi42NzgyMTM2LDI0OC42NzkwMiA4NC40ODg1OTY5LDI0OC42NzkwMiBDMTE2LjI5NDc1OSwyNDguNjc5MDIgMTQyLjA3NjU3OCwyMjIuODkyOTc5IDE0Mi4wNzY1NzgsMTkxLjA4NjgxNyIgZmlsbD0iI0ZGNjYwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoODQuNDg2NDg2LCAxOTEuMDg2ODE3KSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC04NC40ODY0ODYsIC0xOTEuMDg2ODE3KSAiPgoNPC9wYXRoPgoJCTxwYXRoIGQ9Ik0yNTUuOTc5NzAzLDExMC40NTQzNTYgQzI1NS45Nzk3MDMsNzguNjUyNDE2IDIzMC4xOTc4ODQsNTIuODYyMTUzIDE5OC4zOTE3MjIsNTIuODYyMTUzIEMxNjYuNTgxMzM5LDUyLjg2MjE1MyAxNDAuNzk5NTE5LDc4LjY1MjQxNiAxNDAuNzk5NTE5LDExMC40NTQzNTYgQzE0MC43OTk1MTksMTQyLjI2MDUxOCAxNjYuNTgxMzM5LDE2OC4wNTA3ODEgMTk4LjM5MTcyMiwxNjguMDUwNzgxIEMyMzAuMTk3ODg0LDE2OC4wNTA3ODEgMjU1Ljk3OTcwMywxNDIuMjYwNTE4IDI1NS45Nzk3MDMsMTEwLjQ1NDM1NiIgZmlsbD0iI0ZGQ0MwMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTk4LjM4OTYxMSwgMTEwLjQ1NjQ2Nykgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMTk4LjM4OTYxMSwgLTExMC40NTY0NjcpICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTExNS4yMDA0OTgsMTA5LjE3NjQ1MiBDMTE1LjIwMDQ5OCw3Ny4zNzQ1MTI1IDg5LjQxODY3ODYsNTEuNTg0MjQ5NSA1Ny42MDgyOTUzLDUxLjU4NDI0OTUgQzI1LjgwNjM1NTMsNTEuNTg0MjQ5NSAwLjAyMDMxNDAyNzEsNzcuMzc0NTEyNSAwLjAyMDMxNDAyNzEsMTA5LjE3NjQ1MiBDMC4wMjAzMTQwMjcxLDE0MC45ODI2MTQgMjUuODA2MzU1MywxNjYuNzcyODc3IDU3LjYwODI5NTMsMTY2Ljc3Mjg3NyBDODkuNDE4Njc4NiwxNjYuNzcyODc3IDExNS4yMDA0OTgsMTQwLjk4MjYxNCAxMTUuMjAwNDk4LDEwOS4xNzY0NTIiIGZpbGw9IiMwMDg5Q0MiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU3LjYxMDQwNiwgMTA5LjE3ODU2Mykgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtNTcuNjEwNDA2LCAtMTA5LjE3ODU2MykgIj4KDTwvcGF0aD4KCQk8cGF0aCBkPSJNMjMwLjM4NTc0OSwxOTEuMDg2ODE3IEMyMzAuMzg1NzQ5LDE1OS4yODA2NTYgMjA0LjYwMzkyOSwxMzMuNDk0NjE1IDE3Mi43ODkzMjQsMTMzLjQ5NDYxNSBDMTQwLjk4NzM4NCwxMzMuNDk0NjE1IDExNS4yMDEzNDMsMTU5LjI4MDY1NiAxMTUuMjAxMzQzLDE5MS4wODY4MTcgQzExNS4yMDEzNDMsMjIyLjg5Mjk3OSAxNDAuOTg3Mzg0LDI0OC42NzkwMiAxNzIuNzg5MzI0LDI0OC42NzkwMiBDMjA0LjYwMzkyOSwyNDguNjc5MDIgMjMwLjM4NTc0OSwyMjIuODkyOTc5IDIzMC4zODU3NDksMTkxLjA4NjgxNyIgZmlsbD0iIzAwOTkzOSIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTcyLjc5MzU0NiwgMTkxLjA4NjgxNykgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMTcyLjc5MzU0NiwgLTE5MS4wODY4MTcpICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTE4NS41OTIwMDEsNTcuOTg0MzIxMyBDMTg1LjU5MjAwMSwyNi4xNzgxNTk3IDE1OS44MDU5NTksMC4zOTIxMTgzNDkgMTI3Ljk5OTc5OCwwLjM5MjExODM0OSBDOTYuMTkzNjM1OSwwLjM5MjExODM0OSA3MC40MDc1OTQ2LDI2LjE3ODE1OTcgNzAuNDA3NTk0Niw1Ny45ODQzMjEzIEM3MC40MDc1OTQ2LDg5Ljc5MDQ4MyA5Ni4xOTM2MzU5LDExNS41NzY1MjQgMTI3Ljk5OTc5OCwxMTUuNTc2NTI0IEMxNTkuODA1OTU5LDExNS41NzY1MjQgMTg1LjU5MjAwMSw4OS43OTA0ODMgMTg1LjU5MjAwMSw1Ny45ODQzMjEzIiBmaWxsPSIjQkYwMDAwIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjcuOTk5Nzk4LCA1Ny45ODQzMjEpIHNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTEyNy45OTk3OTgsIC01Ny45ODQzMjEpICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTE0MC43OTg2NzUsNTcuOTc4ODMzMSBDMTQwLjc5ODY3NSw1Ni43NjcyMSAxNDAuOTA0MjE3LDU1LjU4MDkxNyAxNDAuOTgwMjA3LDU0LjM4NjE4MDcgQzE2Ni41MjU2MTIsNjAuMjc5NjUwNSAxODUuNTkwNzM0LDgzLjExODk1NjkgMTg1LjU5MDczNCwxMTAuNDU0MzU2IEMxODUuNTkwNzM0LDExMS42NjU5NzkgMTg1LjQ4NTE5MiwxMTIuODU2NDk0IDE4NS40MDkyMDIsMTE0LjA1MTIzIEMxNTkuODYzNzk2LDEwOC4xNTM1MzkgMTQwLjc5ODY3NSw4NS4zMTQyMzIyIDE0MC43OTg2NzUsNTcuOTc4ODMzMSIgZmlsbD0iI0ZDMDAwNyIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTYzLjE5NDcwNCwgODQuMjE4NzA1KSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC0xNjMuMTk0NzA0LCAtODQuMjE4NzA1KSAiPgoNPC9wYXRoPgoJCTxwYXRoIGQ9Ik0xNDguMzk2ODYsMTYyLjU3MDYxNCBDMTU4LjMyMjAzOCwxNDUuMjE5NDk1IDE3Ni45NzM0MzQsMTMzLjQ5NTg4MSAxOTguMzk0MjU1LDEzMy40OTU4ODEgQzIwNy4xMjQ2OTYsMTMzLjQ5NTg4MSAyMTUuMzY5NjQzLDEzNS40OTY5NTkgMjIyLjc4NzE0MSwxMzguOTc1NjI2IEMyMTIuODY2MTg1LDE1Ni4zMjY3NDQgMTk0LjIxNDc4OSwxNjguMDUwMzU4IDE3Mi43ODk3NDYsMTY4LjA1MDM1OCBDMTY0LjA1OTMwNSwxNjguMDUwMzU4IDE1NS44MTQzNTgsMTY2LjA0OTI4MSAxNDguMzk2ODYsMTYyLjU3MDYxNCIgZmlsbD0iIzFDRDMwNiIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMTg1LjU5MjAwMSwgMTUwLjc3MzEyMCkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtMTg1LjU5MjAwMSwgLTE1MC43NzMxMjApICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTExNS4yMDA0OTgsMTkxLjA4NjgxNyBDMTE1LjIwMDQ5OCwxNzcuMDE1OTQ3IDEyMC4yNTgwNzUsMTY0LjEzOTgxMyAxMjguNjQyMzM4LDE1NC4xMzg2NDYgQzEzNy4wMTgxNTcsMTY0LjEzOTgxMyAxNDIuMDc1NzM0LDE3Ny4wMTU5NDcgMTQyLjA3NTczNCwxOTEuMDg2ODE3IEMxNDIuMDc1NzM0LDIwNS4xNTc2ODggMTM3LjAxODE1NywyMTguMDMzODIyIDEyOC42NDIzMzgsMjI4LjAzNDk4OSBDMTIwLjI1ODA3NSwyMTguMDMzODIyIDExNS4yMDA0OTgsMjA1LjE1NzY4OCAxMTUuMjAwNDk4LDE5MS4wODY4MTciIGZpbGw9IiMwRjc1MDQiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDEyOC42MzgxMTYsIDE5MS4wODY4MTcpIHNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTEyOC42MzgxMTYsIC0xOTEuMDg2ODE3KSAiPgoNPC9wYXRoPgoJCTxwYXRoIGQ9Ik0zNC44MDY5ODQsMTM4LjIxMjc2OCBDNDEuODAyMzEzMiwxMzUuMTkwMDQzIDQ5LjUwMjY2MzUsMTMzLjQ5NzE0OCA1Ny42MDgyOTUzLDEzMy40OTcxNDggQzc4LjgxODAzMiwxMzMuNDk3MTQ4IDk3LjI5NjMzOTYsMTQ0Ljk5Mjc5MSAxMDcuMjkzMjg2LDE2Mi4wNjEwNTYgQzEwMC4yOTc5NTYsMTY1LjA4Mzc4MiA5Mi41OTMzODQ0LDE2Ni43NzI0NTUgODQuNDkxOTc0MywxNjYuNzcyNDU1IEM2My4yODIyMzc2LDE2Ni43NzI0NTUgNDQuNzk5NzA4MywxNTUuMjc2ODExIDM0LjgwNjk4NCwxMzguMjEyNzY4IiBmaWxsPSIjMEM1RTg3IiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg3MS4wNTAxMzUsIDE1MC4xMzQ4MDEpIHNjYWxlKDEsIC0xKSB0cmFuc2xhdGUoLTcxLjA1MDEzNSwgLTE1MC4xMzQ4MDEpICI+Cg08L3BhdGg+CgkJPHBhdGggZD0iTTcwLjY1NDU2MzEsMTE0LjAzNjAzMiBDNzAuNTE5NDY5MiwxMTIuNDMxNzkyIDcwLjQwNTQ4MzgsMTEwLjgxOTEwOSA3MC40MDU0ODM4LDEwOS4xNzY4NzUgQzcwLjQwNTQ4MzgsODEuODYyNTg0IDg5LjQ0MTA1MzYsNTkuMDQ0Mzg2IDExNC45NTY5MDcsNTMuMTI1NTg2MSBDMTE1LjA4Nzc3OSw1NC43Mjk4MjU3IDExNS4yMDE3NjUsNTYuMzQyNTA4NyAxMTUuMjAxNzY1LDU3Ljk4MDUyMTggQzExNS4yMDE3NjUsODUuMjk0ODEyNSA5Ni4xNzA0MTY3LDEwOC4xMjE0NTQgNzAuNjU0NTYzMSwxMTQuMDM2MDMyIiBmaWxsPSIjNkIwMDAxIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSg5Mi44MDM2MjQsIDgzLjU4MDgwOSkgc2NhbGUoMSwgLTEpIHRyYW5zbGF0ZSgtOTIuODAzNjI0LCAtODMuNTgwODA5KSAiPgoNPC9wYXRoPgoJCTxwYXRoIGQ9Ik03Ni4wMzA0NTQ1LDExMS41MDM4NjYgTDY3LjAyMTM4MjUsMTExLjUwMzg2NiBDNTkuMDY3NzMxMiwxMTEuNTAzODY2IDUyLjYwMDExMjUsMTE3Ljk1MDM3NyA1Mi42MDAxMTI1LDEyNS44ODI5MiBMNTIuNjAwMTEyNSwyMDcuNDI4OTUzIEM1Mi42MDAxMTI1LDIxNS4zNjE0OTYgNTkuMDY3NzMxMiwyMjEuODEyMjI4IDY3LjAyMTM4MjUsMjIxLjgxMjIyOCBMMTc5Ljk4OTQwNSwyMjEuODEyMjI4IEMxODcuOTQzMDU2LDIyMS44MTIyMjggMTk0LjQwNjQ1MywyMTUuMzYxNDk2IDE5NC40MDY0NTMsMjA3LjQyODk1MyBMMTk0LjQwNjQ1MywxMjUuODgyOTIgQzE5NC40MDY0NTMsMTE3Ljk1MDM3NyAxODcuOTQzMDU2LDExMS41MDM4NjYgMTc5Ljk4OTQwNSwxMTEuNTAzODY2IEwxNDEuNTA0NTQsMTExLjUwMzg2NiBMNjQuMjg5OTUzNCw3My42NTIyNTQ0IEw3Ni4wMzA0NTQ1LDExMS41MDM4NjYgTDc2LjAzMDQ1NDUsMTExLjUwMzg2NiBaIiBmaWxsPSIjRkZGRkZGIiB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxMjMuNTAzMjgzLCAxNDcuNzMyMjQxKSBzY2FsZSgxLCAtMSkgdHJhbnNsYXRlKC0xMjMuNTAzMjgzLCAtMTQ3LjczMjI0MSkgIj4KDTwvcGF0aD4KCTwvZz4KPC9zdmc+";
            }
    
            // Define blocks used in the extension
            getInfo() {
                return {
                    id: 'webrtc',
                    name: 'WebRTC',
                    color1: '#f6a639',
                    color2: '#a56d22',
                    menuIconURI: this.menuIconURI,
                    blockIconURI: this.blockIconURI,
                    docsURI: "https://github.com/cloudlink-omega/scratch3-webrtc",
                    blocks: [
                        {
                            opcode: 'allPeers',
                            blockType: Scratch2.BlockType.REPORTER,
                            text: 'All peer connection objects'
                        },
                        {
                            opcode: 'allConnectedPeers',
                            blockType: Scratch2.BlockType.REPORTER,
                            text: 'All connected peers'
                        },
                        {
                            opcode: 'allPeerChannels',
                            blockType: Scratch2.BlockType.REPORTER,
                            text: 'All channels of peer [peer]',
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            }
                        },
                        "---",
                        {
                            opcode: 'newPeer',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                name: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Create peer [name] connection object'
                        },
                        {
                            opcode: 'closePeer',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                name: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Close peer [name] connection object'
                        },
                        {
                            opcode: 'isPeerConnected',
                            blockType: Scratch2.BlockType.BOOLEAN,
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Is peer [peer] connected?'
                        },
                        "---",
                        {
                            opcode: 'createOffer',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Make an offer for peer [peer]'
                        },
                        {
                            opcode: 'getOffer',
                            blockType: Scratch2.BlockType.REPORTER,
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Offer for peer [peer]'
                        },
                        "---",
                        {
                            opcode: 'createAnswer',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                },
                                offer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "offer",
                                }
                            },
                            text: 'Make answer for peer [peer] using offer [offer]'
                        },
                        {
                            opcode: 'getAnswer',
                            blockType: Scratch2.BlockType.REPORTER,
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Answer for peer [peer]'
                        },
                        "---",
                        {
                            opcode: 'generateIce',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Gather ICE candidates for peer [peer]'
                        },
                        {
                            opcode: 'getIce',
                            blockType: Scratch2.BlockType.REPORTER,
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'All ICE candidates for peer [peer]'
                        },
                        "---",
                        {
                            opcode: 'handleAnswer',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                answer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "answer",
                                },
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Handle peer [peer]\'s answer [answer]'
                        },
                        {
                            opcode: 'handleIce',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                ice: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "ice",
                                },
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Handle peer [peer]\'s ICE candidates [ice]'
                        },
                        "---",
                        {
                            opcode: 'sendData',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                data: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "banana",
                                },
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                },
                                channel: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "default",
                                },
                                wait: {
                                    type: Scratch2.ArgumentType.BOOLEAN,
                                    defaultValue: false,
                                }
                            },
                            text: 'Send [data] to peer [peer] using channel [channel] and wait? [wait]'
                        }, 
                        {
                            opcode: 'getData',
                            blockType: Scratch2.BlockType.REPORTER,
                            arguments: {
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                },
                                channel: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "default",
                                }
                            },
                            text: 'Data from peer [peer] in channel [channel]'
                        },
                        "---",
                        {
                            opcode: 'createChannel',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                channel: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "default",
                                },
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                },
                                ordered: {
                                    type: Scratch2.ArgumentType.BOOLEAN,
                                    defaultValue: false,
                                }
                            },
                            text: 'Create data channel [channel] with peer [peer] and is this channel ordered? [ordered]'
                        },
                        {
                            opcode: 'closeChannel',
                            blockType: Scratch2.BlockType.COMMAND,
                            arguments: {
                                channel: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "default",
                                },
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Close data channel [channel] with peer [peer]'
                        },
                        {
                            opcode: 'isChannelOpen',
                            blockType: Scratch2.BlockType.BOOLEAN,
                            arguments: {
                                channel: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "default",
                                },
                                peer: {
                                    type: Scratch2.ArgumentType.STRING,
                                    defaultValue: "apple",
                                }
                            },
                            text: 'Does data channel [channel] with peer [peer] exist?'
                        },
                    ]
                }
            }

            allConnectedPeers(){
                return JSON.stringify(this.webrtc.getConnectedPeers());
            }
    
            newPeer(args) {
                const name = args.name;

                if (this.webrtc.peerConnections.has(name)) {
                    console.warn(`Peer ${name} already exists`);
                    return;
                }

                this.webrtc.createConnection(name, name, false);

                this.iceComplete[name] = false;
                this.ice[name] = new Array();

                this.webrtc.onIceCandidate(name, (candidate) => {
                    this.ice[name].push(candidate);
                });
                
                this.webrtc.onIceGatheringDone(name, () => {
                    this.iceComplete[name] = true;
                });

                this.webrtc.onChannelClose(name, (channel) => {
                    if (channel == "default") { 
                        this.iceComplete.delete(name);
                        this.ice.delete(name);
                    }
                })
            }
    
            closePeer(args) {
                const name = args.name;

                if (!this.webrtc.peerConnections.has(name)) {
                    console.warn(`Peer ${name} does not exist`);
                    return;
                }

                this.webrtc.disconnectDataPeer(name);
            }
    
            getData(args) {
                return this.webrtc.getChannelData(args.peer, args.channel);
            }
    
            sendData(args) {
                return this.webrtc.sendData(args.peer, args.channel, args.data, args.wait);
            }
    
            createChannel(args) {
                const channel = args.channel;
                const peer = args.peer;

                if (this.webrtc.doesPeerChannelExist(peer, channel)) {
                    console.warn(`Channel ${channel} already exists with peer ${peer}`);
                    return;
                };

                this.webrtc.createChannel(peer, channel, args.ordered);
            }
    
            closeChannel(args) {
                const channel = args.channel;
                const peer = args.peer;

                if (!this.webrtc.doesPeerChannelExist(peer, channel)) {
                    console.warn(`Channel ${channel} does not exist with peer ${peer}`);
                    return;
                }

                if (channel == "default") {
                    console.warn("Cannot close default channel, use the close connection block instead");
                    return;
                }

                this.webrtc.closeChannel(peer, channel);
            }
    
            isChannelOpen(args) {
                return this.webrtc.doesPeerChannelExist(args.peer, args.channel);
            }
    
            getOffer(args) {
                return this.offers[args.peer] ? btoa(JSON.stringify(this.offers[args.peer])) : "";
            }
    
            async createOffer(args) {
                this.offers[args.peer] = await this.webrtc.createDataOffer(args.peer, args.peer);
            }
    
            getAnswer(args) {
                return this.answers[args.peer] ? btoa(JSON.stringify(this.answers[args.peer])) : "";
            }
    
            async createAnswer(args) {
                this.answers[args.peer] = await this.webrtc.createDataAnswer(args.peer, args.peer, JSON.parse(atob(args.offer)));
            }
    
            async handleAnswer(args, util) {
                await this.webrtc.handleDataAnswer(args.peer, JSON.parse(atob(args.answer)));
            }
    
            async generateIce(args) {
                await until(() => this.iceComplete[args.peer]);
            }
    
            getIce(args) {
                return this.ice[args.peer] ? btoa(JSON.stringify(this.ice[args.peer])) : "";
            }
    
            handleIce(args) {
                const candidates = JSON.parse(atob(args.ice));
                for (const key in candidates) {
                    this.webrtc.addDataIceCandidate(args.peer, candidates[key]);
                }
            }
    
            isPeerConnected(args) {
                return this.webrtc.isPeerConnected(args.peer);
            }

            allPeers() {
                return JSON.stringify(this.webrtc.getPeers());
            }

            allPeerChannels(args) {
                return JSON.stringify(this.webrtc.getPeerChannels(args.peer));
            }
        }
    
        Scratch2.extensions.register(new ScratchWebRTC(Scratch2));
    })(Scratch);
})();
