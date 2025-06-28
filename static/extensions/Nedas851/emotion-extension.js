/*
   How We Feel – Real-Time Facecam Emotion Extension (with explicit camera permission request)
   https://jwklong.github.io/extforge
*/

(async function (Scratch) {
    const variables = {
        emotionLog: [],
        detectedEmotion: "neutral",
        emoji: "😐",
        lastBrightness: 150,
        smartDetect: true,
        intervalMs: 500,
        totalDetections: 0,
        counts: {
            happy: 0,
            sad: 0,
            angry: 0,
            neutral: 0,
            surprised: 0,
            fearful: 0,
            disgusted: 0,
            excited: 0,
            calm: 0,
            confused: 0,
            anxious: 0,
            bored: 0,
            tired: 0,
            proud: 0,
            embarrassed: 0,
            relaxed: 0,
            curious: 0,
            amused: 0,
            lonely: 0,
            hopeful: 0,
            frustrated: 0
        },
        lastThree: [],
        detecting: false
    };

    if (!Scratch.extensions.unsandboxed) {
        alert("This extension requires unsandboxed mode.");
        return;
    }

    const video = document.createElement("video");
    video.autoplay = true;
    video.playsInline = true;
    video.width = 320;
    video.height = 240;

    const canvas = document.createElement("canvas");
    canvas.width = 320;
    canvas.height = 240;
    const ctx = canvas.getContext("2d");

    async function detectAndUpdateEmotion() {
        if (video.readyState < 2) return; // Not ready
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const frame = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = frame.data;
        let totalBrightness = 0;

        for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
            totalBrightness += brightness;
        }

        const avgBrightness = totalBrightness / (canvas.width * canvas.height);
        const change = Math.abs(avgBrightness - variables.lastBrightness);
        variables.lastBrightness = avgBrightness;

        // Basic heuristic for emotion based on brightness and changes
        let emotion = "neutral";
        let emoji = "😐";

        if (change > 35 || avgBrightness < 80) {
            emotion = "angry";
            emoji = "😠";
        } else if (avgBrightness > 230) {
            emotion = "excited";
            emoji = "😃";
        } else if (avgBrightness > 180) {
            emotion = "happy";
            emoji = "😀";
        } else if (avgBrightness > 150) {
            emotion = "calm";
            emoji = "🙂";
        } else if (avgBrightness > 130) {
            emotion = "neutral";
            emoji = "😐";
        } else if (avgBrightness > 110) {
            emotion = "curious";
            emoji = "🤨";
        } else if (avgBrightness > 90) {
            emotion = "sad";
            emoji = "😢";
        } else if (avgBrightness > 80) {
            emotion = "bored";
            emoji = "😒";
        } else if (avgBrightness > 70) {
            emotion = "fearful";
            emoji = "😨";
        } else if (avgBrightness > 60) {
            emotion = "disgusted";
            emoji = "🤢";
        } else if (avgBrightness > 50) {
            emotion = "anxious";
            emoji = "😰";
        } else if (avgBrightness > 45) {
            emotion = "frustrated";
            emoji = "😤";
        } else if (avgBrightness > 40) {
            emotion = "embarrassed";
            emoji = "😳";
        } else if (avgBrightness > 30) {
            emotion = "tired";
            emoji = "😴";
        } else if (avgBrightness > 20) {
            emotion = "relaxed";
            emoji = "😌";
        } else if (avgBrightness > 10) {
            emotion = "amused";
            emoji = "😄";
        } else if (avgBrightness > 5) {
            emotion = "proud";
            emoji = "😌";
        } else if (avgBrightness <= 5) {
            emotion = "lonely";
            emoji = "😞";
        } else {
            emotion = "hopeful";
            emoji = "🤞";
        }

        if (emotion !== variables.detectedEmotion) {
            const time = new Date().toLocaleString();
            variables.emotionLog.push(`${emotion} (auto) at ${time}`);
            variables.detectedEmotion = emotion;
            variables.emoji = emoji;

            if (typeof Scratch !== "undefined" && Scratch.vm) {
                Scratch.vm.runtime.startHats("event_whenbroadcastreceived", {
                    BROADCAST_OPTION: `I feel ${emotion}!`
                });
            }
        }

        variables.totalDetections++;
        if (variables.counts[emotion] !== undefined) {
            variables.counts[emotion]++;
        }

        variables.lastThree.push(emotion);
        if (variables.lastThree.length > 3) {
            variables.lastThree.shift();
        }
    }

    async function detectionLoop() {
        while (variables.detecting) {
            await new Promise(r => setTimeout(r, variables.intervalMs));
            detectAndUpdateEmotion();
        }
    }

    class HowWeFeelRealtime {
        getInfo() {
            return {
                id: "howwefeelrt",
                name: "How We Feel+ (Realtime)",
                color1: "#ff7f50",
                blocks: [
                    {
                        opcode: "startDetection",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "start emotion detection"
                    },
                    {
                        opcode: "stopDetection",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "stop emotion detection"
                    },
                    {
                        opcode: "setEmotion",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "I feel [EMOTION]",
                        arguments: {
                            EMOTION: { type: Scratch.ArgumentType.STRING, menu: "emotions", defaultValue: "happy" }
                        }
                    },
                    {
                        opcode: "getLog",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "emotion log"
                    },
                    {
                        opcode: "getLatestEmotion",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "latest emotion"
                    },
                    {
                        opcode: "countEmotion",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "count of [EMOTION] felt",
                        arguments: {
                            EMOTION: { type: Scratch.ArgumentType.STRING, menu: "emotions", defaultValue: "happy" }
                        }
                    },
                    {
                        opcode: "getDetectedEmotion",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "detected emotion"
                    },
                    {
                        opcode: "getDetectedEmoji",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "detected emoji"
                    },
                    {
                        opcode: "setSmartDetect",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set smart detect to [STATE]",
                        arguments: {
                            STATE: { type: Scratch.ArgumentType.STRING, menu: "toggle", defaultValue: "on" }
                        }
                    },
                    {
                        opcode: "setDetectInterval",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set detection interval to [SECS] seconds",
                        arguments: {
                            SECS: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0.5 }
                        }
                    },
                    {
                        opcode: "getEmotionPercent",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "emotion % for [EMOTION]",
                        arguments: {
                            EMOTION: { type: Scratch.ArgumentType.STRING, menu: "emotions", defaultValue: "happy" }
                        }
                    },
                    {
                        opcode: "getEmotionPercentNumber",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "emotion percent number for [EMOTION]",
                        arguments: {
                            EMOTION: { type: Scratch.ArgumentType.STRING, menu: "emotions", defaultValue: "happy" }
                        }
                    },
                    {
                        opcode: "getTotalDetections",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "total detections"
                    },
                    {
                        opcode: "getMostFrequentEmotion",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "most frequent emotion"
                    },
                    {
                        opcode: "resetLog",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "reset emotion log"
                    },
                    {
                        opcode: "isBurst",
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: "detect burst (same emotion 3+ times)"
                    }
                ],
                menus: {
                    toggle: {
                        acceptReporters: true,
                        items: ["on", "off"]
                    },
                    emotions: {
                        acceptReporters: true,
                        items: [
                            "happy",
                            "sad",
                            "angry",
                            "neutral",
                            "surprised",
                            "fearful",
                            "disgusted",
                            "excited",
                            "calm",
                            "confused",
                            "anxious",
                            "bored",
                            "tired",
                            "proud",
                            "embarrassed",
                            "relaxed",
                            "curious",
                            "amused",
                            "lonely",
                            "hopeful",
                            "frustrated"
                        ]
                    }
                }
            };
        }

        async startDetection() {
            if (variables.detecting) return;
            variables.detecting = true;
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                await new Promise(r => {
                    video.onloadedmetadata = () => {
                        video.play();
                        r();
                    };
                });
                detectionLoop();
            } catch (e) {
                alert("Camera access denied or error: " + e.message);
                variables.detecting = false;
            }
        }

        stopDetection() {
            if (!variables.detecting) return;
            variables.detecting = false;
            if (video.srcObject) {
                video.srcObject.getTracks().forEach(t => t.stop());
                video.srcObject = null;
            }
        }

        setEmotion(args) {
            const emotion = args.EMOTION.trim().toLowerCase();
            const time = new Date().toLocaleString();
            variables.emotionLog.push(`${emotion} at ${time}`);
        }

        getLog() {
            return variables.emotionLog.join(" | ");
        }

        getLatestEmotion() {
            if (variables.emotionLog.length === 0) return "none";
            return variables.emotionLog[variables.emotionLog.length - 1];
        }

        countEmotion(args) {
            const e = args.EMOTION.trim().toLowerCase();
            return variables.counts[e] ?? 0;
        }

        getDetectedEmotion() {
            return variables.detectedEmotion;
        }

        getDetectedEmoji() {
            return variables.emoji;
        }

        setSmartDetect(args) {
            variables.smartDetect = args.STATE === "on";
        }

        setDetectInterval(args) {
            const seconds = Number(args.SECS);
            variables.intervalMs = Math.max(100, seconds * 1000);
        }

        getEmotionPercent(args) {
            const e = args.EMOTION.trim().toLowerCase();
            if (variables.totalDetections === 0) return "0%";
            const count = variables.counts[e] ?? 0;
            const percent = ((count / variables.totalDetections) * 100).toFixed(1);
            return `${percent}%`;
        }

        getEmotionPercentNumber(args) {
            const e = args.EMOTION.trim().toLowerCase();
            if (variables.totalDetections === 0) return "0";
            const count = variables.counts[e] ?? 0;
            const percent = ((count / variables.totalDetections) * 100).toFixed(1);
            return percent;
        }

        getTotalDetections() {
            return variables.totalDetections;
        }

        getMostFrequentEmotion() {
            let max = 0;
            let top = "none";
            for (const e in variables.counts) {
                if (variables.counts[e] > max) {
                    max = variables.counts[e];
                    top = e;
                }
            }
            return top;
        }

        resetLog() {
            variables.emotionLog = [];
            variables.totalDetections = 0;
            variables.lastThree = [];
            for (const key in variables.counts) {
                variables.counts[key] = 0;
            }
        }

        isBurst() {
            if (variables.lastThree.length < 3) return false;
            return variables.lastThree.every(e => e === variables.lastThree[0]);
        }
    }

    Scratch.extensions.register(new HowWeFeelRealtime());
})(Scratch);
