let deviceMotionAccelX = 0;
let deviceMotionAccelY = 0;
let deviceMotionAccelZ = 0;
let deviceMotionAccelMagnitude = 0;
let deviceMotionIsShaken = false;
let deviceShakingTime = 0;
let deviceRotationRateA = 0;
let deviceRotationRateB = 0;
let deviceRotationRateC = 0;
let deviceMotionInterval = 0;
let deviceOrientationAlpha = 0;
let deviceOrientationBeta = 0;
let deviceOrientationGamma = 0;
let deviceOrientationAbs = false;

const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3MS4zMzAyNiIgaGVpZ2h0PSI3OC44MzAyNSIgdmlld0JveD0iMCwwLDcxLjMzMDI2LDc4LjgzMDI1Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA0LjMzNDg3LC0xNDAuNTg0ODgpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMjEuNTQyNDQsMTgyLjUwMDAxdi01aDM2LjkxNTEzdjV6IiBmaWxsPSIjMDAwMWZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMzcuNSwxOTguNDU3NTd2LTM2LjkxNTEyaDV2MzYuOTE1MTJ6IiBmaWxsPSIjMDFmZjAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMzQuOTgzNDksMTYxLjU0MjQ0bDUuMDMzMDMsLTVsNS4wMzMwMyw1eiIgZmlsbD0iIzAxZmYwMCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjM0LjQ1Nzk2LDE5MS40OTkwM2MtMS4xMDczNywwIC0yLjAwNTA4LC0wLjg5NzcxIC0yLjAwNTA4LC0yLjAwNTA5bC0wLjAxMzc3LC0xOS4wMTgzM2MwLC0xLjEwNzM3IDAuODk3NzEsLTIuMDA1MDggMi4wMDUwOCwtMi4wMDUwOGwxMS4xMTE2MiwwLjA0MjA1YzEuMTA3MzcsMCAyLjAwNTA4LDAuODk3NzEgMi4wMDUwOCwyLjAwNTA4bC0wLjEyOTIsMTkuMDA2NzNjMCwxLjEwNzM3IC0wLjg5NzcxLDIuMDA1MDggLTIuMDA1MDksMi4wMDUwOHoiIGZpbGw9IiMwMDAwMDAiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTIzMy4xODg4OCwxODcuNDMyNjN2LTE2LjU4MTUyaDEzLjYyMjI0djE2LjU4MTUyeiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjM3LjQ4MzQ5LDE2OS43MzYxNXYtMS4yNjU2MWg1LjAzMzAzdjEuMjY1NjF6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMC41Ii8+PHBhdGggZD0iTTIzOC43NDY4MywxODkuNDU5MjVjMCwtMC42OTIxMSAwLjU2MTA2LC0xLjI1MzE3IDEuMjUzMTcsLTEuMjUzMTdjMC42OTIxMSwwIDEuMjUzMTcsMC41NjEwNiAxLjI1MzE3LDEuMjUzMTdjMCwwLjY5MjExIC0wLjU2MTA2LDEuMjUzMTggLTEuMjUzMTcsMS4yNTMxOGMtMC42OTIxMSwwIC0xLjI1MzE3LC0wLjU2MTA3IC0xLjI1MzE3LC0xLjI1MzE4eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSIjMDAwMDAwIiBzdHJva2Utd2lkdGg9IjAuNSIvPjxwYXRoIGQ9Ik0yMDUuNTg0ODcsMTgwLjAwMDAxYzAsLTE5LjAwNjk1IDE1LjQwODE4LC0zNC40MTUxMyAzNC40MTUxMywtMzQuNDE1MTNjMTkuMDA2OTUsMCAzNC40MTUxMywxNS40MDgxOCAzNC40MTUxMywzNC40MTUxM2MwLDE5LjAwNjk1IC0xNS40MDgxOCwzNC40MTUxMyAtMzQuNDE1MTMsMzQuNDE1MTNjLTE5LjAwNjk1LDAgLTM0LjQxNTEzLC0xNS40MDgxOCAtMzQuNDE1MTMsLTM0LjQxNTEzeiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZmYwMDAwIiBzdHJva2Utd2lkdGg9IjIuNSIvPjxwYXRoIGQ9Ik0yNDAuMDM4MzMsMTUwLjU4NDg4di01aDV6IiBmaWxsPSIjZmYwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNDUuMDM4MzMsMTQ1LjU4NDg4aC01di01eiIgZmlsbD0iI2ZmMDAwMCIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjM0Ljk1ODg0LDIxNC40MTUxM2g1djV6IiBmaWxsPSIjZmYwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMzkuOTU4ODQsMjA5LjQxNTEzdjVoLTV6IiBmaWxsPSIjZmYwMDAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMTYuNTQyNDQsMTgwLjAwMDAxbDUsLTV2MTB6IiBmaWxsPSIjMDAwMWZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNTguNDcxMTUsMTg1LjAwMDE1di0xMGw1LDV6IiBmaWxsPSIjMDAwMWZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNDQuOTUwMTgsMTk4LjQ1NzU3bC01LjAzMzAzLDVsLTUuMDMzMDMsLTV6IiBmaWxsPSIjMDFmZjAwIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM1LjY2NTEzMDAwMDAwMDAwNTozOS40MTUxMjQ5OTk5OTk5OS0tPg==";

window.addEventListener("devicemotion", (event) => {
  deviceMotionAccelX = -1 * event.acceleration.x ?? 0;
  deviceMotionAccelY = -1 * event.acceleration.y ?? 0;
  deviceMotionAccelZ = event.acceleration.z ?? 0;
  deviceMotionAccelMagnitude = Math.sqrt(deviceMotionAccelX * deviceMotionAccelX + deviceMotionAccelY * deviceMotionAccelY + deviceMotionAccelZ * deviceMotionAccelZ) ?? 0;
  deviceMotionIsShaken = (deviceMotionAccelMagnitude > 20) ?? false;
  deviceRotationRateA = event.rotationRate.alpha ?? 0;
  deviceRotationRateB = event.rotationRate.beta ?? 0;
  deviceRotationRateC = event.rotationRate.gamma ?? 0;
  deviceMotionInterval = event.interval ?? 0;

  if (deviceMotionIsShaken) {
    deviceShakingTime += 1;
  } else {
    deviceShakingTime = 0;
  }
});

window.addEventListener("deviceorientation", (event) => {
  deviceOrientationAlpha = -1 * event.alpha ?? 0; // reversed to fit better in Scratch coordinate system
  deviceOrientationBeta = event.beta ?? 0;
  deviceOrientationGamma = event.gamma ?? 0;
  deviceOrientationAbs = event.absolute ?? false;
});

class gaimeriDeviceMotionExtension {
  getInfo() {
    return {
      id: 'gaimeriDeviceMotionExtension',
      name: 'Device Motion',
      color1: "#55e9fc",
      color2: "#5595fc",
      color3: "#6955fc",
      menuIconURI,
      blocks: [
        {
          opcode: 'deviceAccelerationX',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device acceleration x',
          disableMonitor: false
        },
        {
          opcode: 'deviceAccelerationY',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device acceleration y',
          disableMonitor: false
        },
        {
          opcode: 'deviceAccelerationZ',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device acceleration z',
          disableMonitor: false
        },
        {
          opcode: 'deviceAccelerationMagnitude',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device acceleration magnitude',
          disableMonitor: false
        },
        '---',
        {
          opcode: 'deviceRotationA',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device rotation rate alpha',
          disableMonitor: false
        },
        {
          opcode: 'deviceRotationB',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device rotation rate beta',
          disableMonitor: false
        },
        {
          opcode: 'deviceRotationC',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device rotation rate gamma',
          disableMonitor: false
        },
        '---',
        {
          opcode: 'deviceMotionInterval',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device motion capture interval (ms)',
          disableMonitor: false
        },
        '---',
        {
          opcode: 'deviceDirectionA',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device direction alpha',
          disableMonitor: false
        },
        {
          opcode: 'deviceDirectionB',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device direction beta',
          disableMonitor: false
        },
        {
          opcode: 'deviceDirectionC',
          blockType: Scratch.BlockType.REPORTER,
          text: 'device direction gamma',
          disableMonitor: false
        },
        {
          opcode: 'deviceDirectionAbs',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is device direction absolute?',
          disableMonitor: false
        },
        '---',
        {
          opcode: 'deviceMotionIsShakenContinuous',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'device shaking?',
          disableMonitor: false
        },
        {
          opcode: 'deviceMotionIsShakenSingle',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'device shaken?',
          disableMonitor: false
        },
      ]
    };
  }
  deviceAccelerationX(){
    return deviceMotionAccelX;
  }

  deviceAccelerationY(){
    return deviceMotionAccelY;
  }

  deviceAccelerationZ(){
    return deviceMotionAccelZ;
  }

  deviceAccelerationMagnitude(){
    return deviceMotionAccelMagnitude;
  }

  deviceRotationA(){
    return deviceRotationRateA;
  }

  deviceRotationB(){
    return deviceRotationRateB;
  }

  deviceRotationC(){
    return deviceRotationRateC;
  }

  deviceMotionInterval(){
    return deviceMotionInterval;
  }

  deviceDirectionA(){
    return deviceOrientationAlpha;
  }

  deviceDirectionB(){
    return deviceOrientationBeta;
  }

  deviceDirectionC(){
    return deviceOrientationGamma;
  }

  deviceDirectionAbs(){
    return deviceOrientationAbs;
  }

  deviceMotionIsShakenContinuous(){
    return deviceMotionIsShaken;
  }

  deviceMotionIsShakenSingle(){
    return (deviceShakingTime == 1);
  }
}

Scratch.extensions.register(new gaimeriDeviceMotionExtension());
