(function (Scratch) {
    'use strict';

    let audioElement = null;
    let audioContext = null;
    let analyserNode = null;
    let sourceNode = null;
    let gainNode = null;

    let currentURL = 'https://www.clubfmserver.be/pink.mp3';
    let isPlaying = false;

    let averageVolume = 0;
    let frequencyData = new Uint8Array(0);

    let metadataCache = {};

    class InternetRadioExtension {
        constructor() {
            if (typeof Scratch !== 'undefined' && Scratch.vm) {
                Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
                    this.stopStreaming();
                });
            }
        }

        getInfo() {
            return {
                id: 'internetradio',
                name: 'Internet Radio',
                color1: '#00BFA5',
color2: '#009688',
color3: '#00796B',

menuIconURI: 'data:image/svg+xml;base64,PCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPCEtLSBVcGxvYWRlZCB0bzogU1ZHIFJlcG8sIHd3dy5zdmdyZXBvLmNvbSwgVHJhbnNmb3JtZWQgYnk6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIHdpZHRoPSIxMDFweCIgaGVpZ2h0PSIxMDFweCIgdmlld0JveD0iLTIgLTIgMjQuMDAgMjQuMDAiIHZlcnNpb249IjEuMSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgZmlsbD0iIzAwOTY4OCIgdHJhbnNmb3JtPSJyb3RhdGUoMCltYXRyaXgoMSwgMCwgMCwgMSwgMCwgMCkiIHN0cm9rZT0iIzAwOTY4OCI+Cgo8ZyBpZD0iU1ZHUmVwb19iZ0NhcnJpZXIiIHN0cm9rZS13aWR0aD0iMCIgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoMCwwKSwgc2NhbGUoMSkiLz4KCjxnIGlkPSJTVkdSZXBvX3RyYWNlckNhcnJpZXIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlPSIjQ0NDQ0NDIiBzdHJva2Utd2lkdGg9IjAuNDgiLz4KCjxnIGlkPSJTVkdSZXBvX2ljb25DYXJyaWVyIj4gPHRpdGxlPnJhZGlvX3Rvd2VyIFsjMDA5Njg4XTwvdGl0bGU+IDxkZXNjPkNyZWF0ZWQgd2l0aCBTa2V0Y2guPC9kZXNjPiA8ZGVmcz4gPC9kZWZzPiA8ZyBpZD0iUGFnZS0xIiBzdHJva2Utd2lkdGg9IjAuMDAwMiIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4gPGcgaWQ9IkRyaWJiYmxlLUxpZ2h0LVByZXZpZXciIHRyYW5zZm9ybT0idHJhbnNsYXRlKC02MC4wMDAwMDAsIC0zMzIwLjAwMDAwMCkiIGZpbGw9IiMwMEJGQTUiPiA8ZyBpZD0iaWNvbnMiIHRyYW5zZm9ybT0idHJhbnNsYXRlKDU2LjAwMDAwMCwgMTYwLjAwMDAwMCkiPiA8cGF0aCBkPSJNMTQuMDAwMDg3MSwzMTcxLjAwNyBMMTMuOTk0MDg3MSwzMTcxIEw4LjAwMDA4NzEyLDMxNzcuNCBMOS40OTgwODcxMiwzMTc5IEwxNC4wMDAwODcxLDMxNzQuMTk0IEwxOC41MDIwODcxLDMxNzkgTDIwLjAwMDA4NzEsMzE3Ny40IEwxNC4wMDYwODcxLDMxNzEgTDE0LjAwMDA4NzEsMzE3MS4wMDcgWiBNMTIuNjM2MDg3MSwzMTY4LjU4NiBDMTMuNDE3MDg3MSwzMTY5LjM2NyAxNC43NTYwODcxLDMxNjkuMjk0IDE1LjQ2NDA4NzEsMzE2OC41ODcgQzE2LjEyOTA4NzEsMzE2Ny45MjEgMTYuMjUzMDg3MSwzMTY2LjU0MyAxNS4zNjcwODcxLDMxNjUuNjU3IEwxNS4zNjQwODcxLDMxNjUuNjYgQzE0LjU4MzA4NzEsMzE2NC44NzkgMTMuMjQzMDg3MSwzMTY0Ljk1MiAxMi41MzYwODcxLDMxNjUuNjU5IEMxMS44NzEwODcxLDMxNjYuMzI1IDExLjc0NzA4NzEsMzE2Ny43MDMgMTIuNjMzMDg3MSwzMTY4LjU4OSBMMTIuNjM2MDg3MSwzMTY4LjU4NiBaIE05LjgwNTA4NzEyLDMxNzEuNDE3IEwxMS4yMTkwODcxLDMxNzAuMDAzIEM5LjgwNTA4NzEyLDMxNjguNTg5IDkuNzA2MDg3MTIsMzE2NS42NTcgMTEuMTIwMDg3MSwzMTY0LjI0MyBMOS43MDYwODcxMiwzMTYyLjgyOSBDNy41ODQwODcxMiwzMTY0Ljk1IDcuNjgzMDg3MTIsMzE2OS4yOTYgOS44MDUwODcxMiwzMTcxLjQxNyBMOS44MDUwODcxMiwzMTcxLjQxNyBaIE04LjI5MTA4NzEyLDMxNjEuNDE1IEw2Ljg3NzA4NzEyLDMxNjAgQzIuNjM0MDg3MTIsMzE2NC4yNDMgMy40NDEwODcxMiwzMTcwLjcxIDYuOTc2MDg3MTIsMzE3NC4yNDYgTDguMzkwMDg3MTIsMzE3Mi44MzIgQzUuNTYyMDg3MTIsMzE3MC4wMDMgNS40NjMwODcxMiwzMTY0LjI0MyA4LjI5MTA4NzEyLDMxNjEuNDE1IEw4LjI5MTA4NzEyLDMxNjEuNDE1IFogTTE2Ljg4MDA4NzEsMzE3MC4wMDMgTDE4LjI5NDA4NzEsMzE3MS40MTcgQzIwLjQxNjA4NzEsMzE2OS4yOTYgMjAuMzE3MDg3MSwzMTY0Ljk1IDE4LjE5NTA4NzEsMzE2Mi44MjkgTDE2Ljc4MTA4NzEsMzE2NC4yNDMgQzE4LjE5NTA4NzEsMzE2NS42NTcgMTguMjk0MDg3MSwzMTY4LjU4OSAxNi44ODAwODcxLDMxNzAuMDAzIEwxNi44ODAwODcxLDMxNzAuMDAzIFogTTIxLjEyMzA4NzEsMzE3NC4yNDYgTDE5LjcwOTA4NzEsMzE3Mi44MzIgQzIyLjUzNzA4NzEsMzE3MC4wMDMgMjIuNDM4MDg3MSwzMTY0LjI0MyAxOS42MTAwODcxLDMxNjEuNDE1IEwyMS4wMjQwODcxLDMxNjAgQzI0LjU1OTA4NzEsMzE2My41MzYgMjUuMzY1MDg3MSwzMTcwLjAwMyAyMS4xMjMwODcxLDMxNzQuMjQ2IEwyMS4xMjMwODcxLDMxNzQuMjQ2IFoiIGlkPSJyYWRpb190b3dlci1bIzAwOTY4OF0iPiA8L3BhdGg+IDwvZz4gPC9nPiA8L2c+IDwvZz4KCjwvc3ZnPg==',
blockIconURI: '',

blocks: [
    {
        blockType: Scratch.BlockType.BUTTON,
        text: 'Find Radio Streams',
        func: 'openRadioBrowser'
    },
    {
        opcode: 'setStreamURL',
        blockType: Scratch.BlockType.COMMAND,
        text: 'set stream URL to [URL]',
        arguments: {
            URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://www.clubfmserver.be/pink.mp3'
            }
        }
    },
    {
        opcode: 'startStreaming',
        blockType: Scratch.BlockType.COMMAND,
        text: 'start streaming'
    },
    {
        opcode: 'stopStreaming',
        blockType: Scratch.BlockType.COMMAND,
        text: 'stop streaming'
    },
    {
        opcode: 'setVolume',
        blockType: Scratch.BlockType.COMMAND,
        text: 'set volume to [VOLUME]%',
        arguments: {
            VOLUME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100
            }
        }
    },
    {
        opcode: 'changeVolume',
        blockType: Scratch.BlockType.COMMAND,
        text: 'change volume by [VOLUME]%',
        arguments: {
            VOLUME: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 10
            }
        }
    },
    '---',
    {
        opcode: 'getCurrentServer',
        blockType: Scratch.BlockType.REPORTER,
        text: 'current server'
    },
    {
        opcode: 'getStationData',
        blockType: Scratch.BlockType.REPORTER,
        text: 'get station [DATA] from url [URL]',
        arguments: {
            DATA: {
                type: Scratch.ArgumentType.STRING,
                menu: 'stationInfo',
                defaultValue: 'name'
            },
            URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://www.clubfmserver.be/pink.mp3'
            }
        }
    },
    '---',
    {
        opcode: 'getVolume',
        blockType: Scratch.BlockType.REPORTER,
        text: 'volume'
    },
    {
        opcode: 'getAverageVolume',
        blockType: Scratch.BlockType.REPORTER,
        text: 'average audio volume'
    },
    {
        opcode: 'getFrequencyVolume',
        blockType: Scratch.BlockType.REPORTER,
        text: 'volume on [SIDE] side',
        arguments: {
            SIDE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
            }
        }
    },
    {
        opcode: 'getFrequencyRange',
        blockType: Scratch.BlockType.REPORTER,
        text: 'frequency [RANGE] volume',
        arguments: {
            RANGE: {
                type: Scratch.ArgumentType.STRING,
                menu: 'frequencyRanges',
                defaultValue: 'bass'
            }
        }
    },
    {
        opcode: 'getFrequencyBand',
        blockType: Scratch.BlockType.REPORTER,
        text: 'frequency band [BAND] volume',
        arguments: {
            BAND: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
            }
        }
    },
    {
        opcode: 'isStreaming',
        blockType: Scratch.BlockType.BOOLEAN,
        text: 'is streaming?'
    },
    {
        opcode: 'isServerWorking',
        blockType: Scratch.BlockType.BOOLEAN,
        text: 'is server [URL] working?',
        arguments: {
            URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://www.clubfmserver.be/pink.mp3'
            }
        }
    }
],
menus: {
    frequencyRanges: {
        acceptReporters: true,
        items: ['bass', 'mid', 'treble', 'sub-bass', 'high']
    },
    stationInfo: {
        acceptReporters: true,
        items: [
            { text: 'Name', value: 'name' },
            { text: 'Country', value: 'country' },
            { text: 'Tags', value: 'tags' },
            { text: 'Language', value: 'language' },
            { text: 'Homepage', value: 'homepage' },
            { text: 'Bitrate', value: 'bitrate' },
            { text: 'Votes', value: 'votes' }
        ]
    }
}
            };
        }


        initAudioContext() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
                analyserNode = audioContext.createAnalyser();
                analyserNode.fftSize = 512;
                analyserNode.smoothingTimeConstant = 0.8;
                gainNode = audioContext.createGain();
                gainNode.connect(analyserNode);
                analyserNode.connect(audioContext.destination);

                frequencyData = new Uint8Array(analyserNode.frequencyBinCount);

                this.updateVolume();
            }
        }

        updateVolume() {
            if (analyserNode && isPlaying) {
                analyserNode.getByteFrequencyData(frequencyData);
                const sum = frequencyData.reduce((a, b) => a + b, 0);
                averageVolume = Math.round((sum / frequencyData.length / 255) * 100);
            } else {
                averageVolume = 0;
            }

            if (isPlaying) {
                requestAnimationFrame(() => this.updateVolume());
            }
        }

        setStreamURL(args) {
            currentURL = args.URL;
            if (isPlaying && audioElement) {
                audioElement.src = currentURL;
                audioElement.play().catch(err => {
                    console.error('Failed to play new stream:', err);
                });
            }
        }

        startStreaming() {
            this.initAudioContext();

            if (!audioElement) {
                audioElement = new Audio();
                audioElement.crossOrigin = 'anonymous';

                if (!sourceNode) {
                    sourceNode = audioContext.createMediaElementSource(audioElement);
                    sourceNode.connect(gainNode);
                }

                audioElement.addEventListener('error', () => { isPlaying = false; });
                audioElement.addEventListener('playing', () => {
                    isPlaying = true;
                    this.updateVolume();
                });
                audioElement.addEventListener('pause', () => { isPlaying = false; });
                audioElement.addEventListener('ended', () => { isPlaying = false; });
            }

            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            audioElement.src = currentURL;
            audioElement.play().catch(err => {
                console.error('Failed to start streaming:', err);
                isPlaying = false;
            });
        }

        stopStreaming() {
            if (audioElement) {
                audioElement.pause();
                audioElement.currentTime = 0;
                isPlaying = false;
                averageVolume = 0;
            }
        }

        setVolume(args) {
            const volume = Math.max(0, Math.min(100, args.VOLUME));
            if (gainNode) gainNode.gain.value = volume / 100;
            if (audioElement) audioElement.volume = volume / 100;
        }

        changeVolume(args) {
            const current = gainNode ? (gainNode.gain.value * 100) : 100;
            this.setVolume({ VOLUME: current + args.VOLUME });
        }


        getCurrentServer() {
            return currentURL;
        }

        getStationData(args) {
            const url = args.URL;
            const type = args.DATA;

            if (metadataCache[url] && metadataCache[url][type]) {
                return metadataCache[url][type];
            }

            const apiUrl = `https://de1.api.radio-browser.info/json/stations/search?url=${encodeURIComponent(url)}&limit=1`;

            return fetch(apiUrl)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const station = data[0];
                    metadataCache[url] = station;

                    if (type === 'votes') return station.votes || 0;
                    if (type === 'bitrate') return station.bitrate || 0;
                    return station[type] || 'Unknown';
                }
                return 'Unknown';
            })
            .catch(err => {
                console.error(err);
                return 'Error';
            });
        }

        getVolume() {
            if (gainNode) return Math.round(gainNode.gain.value * 100);
            return 100;
        }

        getAverageVolume() {
            return averageVolume;
        }

        getFrequencyVolume(args) {
            if (!analyserNode || !isPlaying || frequencyData.length === 0) return 0;

            const side = Math.max(-100, Math.min(100, args.SIDE));
            const normalizedPosition = (side + 100) / 200;

            const dataLength = frequencyData.length;
            const centerIndex = Math.floor(normalizedPosition * dataLength);
            const rangeSize = Math.floor(dataLength / 10);

            const startIndex = Math.max(0, centerIndex - Math.floor(rangeSize / 2));
            const endIndex = Math.min(dataLength, startIndex + rangeSize);

            let sum = 0;
            for (let i = startIndex; i < endIndex; i++) sum += frequencyData[i];

            const avg = sum / (endIndex - startIndex);
            return Math.round((avg / 255) * 100);
        }

        getFrequencyRange(args) {
            if (!analyserNode || !isPlaying || frequencyData.length === 0) return 0;

            const range = args.RANGE.toLowerCase();
            const dataLength = frequencyData.length;
            let startIndex, endIndex;

            switch (range) {
                case 'sub-bass': startIndex = 0; endIndex = Math.floor(dataLength * 0.05); break;
                case 'bass': startIndex = Math.floor(dataLength * 0.05); endIndex = Math.floor(dataLength * 0.2); break;
                case 'mid': startIndex = Math.floor(dataLength * 0.2); endIndex = Math.floor(dataLength * 0.5); break;
                case 'treble': startIndex = Math.floor(dataLength * 0.5); endIndex = Math.floor(dataLength * 0.8); break;
                case 'high': startIndex = Math.floor(dataLength * 0.8); endIndex = dataLength; break;
                default: startIndex = 0; endIndex = dataLength;
            }

            let sum = 0;
            for (let i = startIndex; i < endIndex; i++) sum += frequencyData[i];
            const avg = sum / (endIndex - startIndex);
            return Math.round((avg / 255) * 100);
        }

        getFrequencyBand(args) {
            if (!analyserNode || !isPlaying || frequencyData.length === 0) return 0;
            const band = Math.max(1, Math.min(frequencyData.length, Math.floor(args.BAND)));
            return Math.round((frequencyData[band - 1] / 255) * 100);
        }

        isStreaming() {
            return isPlaying;
        }

        isServerWorking(args) {
            return new Promise((resolve) => {
                const testAudio = new Audio();
                testAudio.crossOrigin = 'anonymous';
                let resolved = false;

                const timeout = setTimeout(() => {
                    if (!resolved) { resolved = true; resolve(false); }
                }, 5000);

                testAudio.addEventListener('canplay', () => {
                    if (!resolved) { resolved = true; clearTimeout(timeout); resolve(true); }
                });
                testAudio.addEventListener('error', () => {
                    if (!resolved) { resolved = true; clearTimeout(timeout); resolve(false); }
                });

                testAudio.src = args.URL;
            });
        }

        openRadioBrowser() {
            window.open('https://www.radio-browser.info/map', '_blank');
        }
    }

    Scratch.extensions.register(new InternetRadioExtension());
})(Scratch);
