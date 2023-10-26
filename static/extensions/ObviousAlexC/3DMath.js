(function (Scratch) {
  "use strict";
  const vm = Scratch.vm;


  //3dMath variables
  const spriteData = {};
  let fov = 300;
  const d2r = 0.0174533;
  const camera = {
    position: [0, 0, 0],
    rotation: [0, 0, 0],
    sinAndCos: [
      0,
      1,
      0,
      1,
      0,
      1,
    ],
  };

  //I'm going to write a whole library for pen+ interaction in the future.
  let penPLoaded = false;let penPModule = null;
  let penPIcon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2My45NDMyMiIgaGVpZ2h0PSI2My45NDMyMiIgdmlld0JveD0iMCwwLDYzLjk0MzIyLDYzLjk0MzIyIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA4LjAyODM3LC0xNDguMDI4MzkpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMTIuNTU4NCwyMDcuMTgyNjJ2LTM3Ljg4NDU3aDM3Ljc1NzQ0djM3Ljg4NDU3eiIgZmlsbD0iI2FkYzIxMyIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjEzLjk1NjgzLDE2OS42Nzk0NWwxNi4zOTk2OSwtMTcuNTQzODZsMzUuODUwNSwwLjUwODUybC0xNS41MDk3OSwxNi42NTM5NXoiIGZpbGw9IiNhZGMyMTMiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIi8+PHBhdGggZD0iTTI1MC45NTE0OSwyMDYuNTQ2OTh2LTUzLjAxMjk3aDE2LjkwODIxbC0wLjYzNTY1LDM2LjQ4NjE0eiIgZmlsbD0iI2FkYzIxMyIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjY4LjgzMDA0LDE1Mi4zNzEyNHYzOC40NDAwMmMwLDAuMDY5NzEgLTAuMDI4ODMsMC4xMzIyMSAtMC4wNDA4OCwwLjE5OTQ1Yy0wLjAxNDQyLDAuMDg4ODYgLTAuMDE5MTQsMC4xNzUzNSAtMC4wNTI4MiwwLjI1OTQ3Yy0wLjA2MDAyLDAuMTQ2NTIgLTAuMTQ4OTksMC4yODEwOSAtMC4yNTk0NywwLjM5MTU3bC0xNi44MTc0OSwxNi44MTc0OWMtMC4wMDk2OSwwLjAwOTU3IC0wLjAyNDEsMC4wMTIwNSAtMC4wMzM2NywwLjAyMTYyYy0wLjEwNTY0LDAuMDk2MTggLTAuMjIwOTUsMC4xODAxOSAtMC4zNTU1MywwLjIzNTQ4Yy0wLjE0NjYzLDAuMDYyNSAtMC4zMDI3MiwwLjA5MzcgLTAuNDU4OTIsMC4wOTM3aC0zOC40NDAwMmMtMC42NjMwOSwwIC0xLjIwMTI5LC0wLjUzODIgLTEuMjAxMjksLTEuMjAxMTh2LTM4LjQzNTI5YzAsLTAuMTU4NTcgMC4wMzEyLC0wLjMxNDc3IDAuMDkxMzMsLTAuNDY2MTJjMC4wNTUzLC0wLjEzMjEgMC4xMzk0MiwtMC4yNDk5IDAuMjM1NDgsLTAuMzUzMTdjMC4wMTE5NCwtMC4wMDk2OSAwLjAxNDQyLC0wLjAyNDEgMC4wMjM5OSwtMC4wMzM2N2wxNi44MTczOCwtMTYuODE3NDljMC4xMTI5NiwtMC4xMTI4NCAwLjI0NTA2LC0wLjE5OTMzIDAuMzk0MDUsLTAuMjYxODRjMC4wODE3NiwtMC4wMzM2NyAwLjE3MDYyLC0wLjAzNjA0IDAuMjU3MTEsLTAuMDUwNDVjMC4wNjczNSwtMC4wMTIwNSAwLjEyOTc0LC0wLjA0MDg4IDAuMTk5NDUsLTAuMDQwODhoMzguNDQwMDJjMC4wOTEzMywwIDAuMTcyOTgsMC4wMzM2NyAwLjI1NDc0LDAuMDUwNDVjMC4wNjcyMywwLjAxNjg5IDAuMTM0NDcsMC4wMTQ0MiAwLjE5Njk3LDAuMDQwODhjMC4yOTc4NywwLjEyMjUzIDAuNTMzMzYsMC4zNTgwMSAwLjY1NTg4LDAuNjU1ODhjMC4wMjY0NywwLjA2MjM5IDAuMDI2NDcsMC4xMzIxIDAuMDQwODgsMC4xOTY5N2MwLjAxOTE0LDAuMDg0MTIgMC4wNTI4MiwwLjE2NTc3IDAuMDUyODIsMC4yNTcxMXpNMjQ5LjYwOTk3LDE3MC4zOTAwMmgtMzYuMDM3NTZ2MzYuMDM3NTZoMzYuMDM3NTZ6TTI2NC43Mjg5NSwxNTMuNTcyNDJoLTM1LjA0MjkybC0xNC40MTUwMiwxNC40MTUwMmgzNS4wNDI5MnpNMjY2LjQyNzU3LDE1NS4yNzEwM2wtMTQuNDE1MDIsMTQuNDE1MDJ2MzUuMDQyOTJsMTQuNDE1MDIsLTE0LjQxNTAyeiIgZmlsbD0iIzdlOGQwYiIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiM3ZThkMGIiIHN0cm9rZS13aWR0aD0iNiIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjIyLjUyNzU2LDE5OC45ODA5NmwtMy4yMjM0NywxLjM1MDA2bDEuMzUyMzQsLTMuMjEzNjFjMC45MjM4MSwtMi4xOTM0OCAyLjIwNDg1LC00LjExMzE1IDMuODE1MDcsLTUuNzE3M2wxNC45Nzk2NSwtMTQuOTI0MjhjMC42NDE2NiwtMC42Mzg2MyAyLjAwOTkzLC0wLjMxMDk3IDMuMDU4MTIsMC43MzM0M2MxLjA0NjY4LDEuMDQyODkgMS4zNzczNywyLjQwNjYgMC43MzU3MSwzLjA0NTIzbC0xNC45Nzk2NSwxNC45MjUwNGMtMS42MTAyMiwxLjYwNDkxIC0zLjUzNzQ3LDIuODgyMTYgLTUuNzM3NzcsMy44MDE0MiIgZmlsbD0iI2I3YzI2NiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiM3ZThkMGIiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIyOC42NzQ5LDE4Mi45MjEyNmMwLDAgMS45ODQxNCwxLjY4Mzc5IDMuMjk5MzEsLTEuMTcyNThjMi44NDU3NSwtNi4xODE0NyA2LjIyMDkxLC00LjM3Nzg1IDYuMjIwOTEsLTQuMzc3ODUiIGZpbGw9Im5vbmUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjN2U4ZDBiIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPjxwYXRoIGQ9Ik0yNDMuNTExOTYsMTc5LjQzMDA2YzAsMC4zNTExNyAtMC4xMDYxOCwwLjY2MjE0IC0wLjMyNzY2LDAuODgyODVsLTcuMDgwMjUsNy4wNTM3MWMwLjIxMzg5LC0wLjIxOTk1IDAuMzEwOTcsLTAuNTA2NjUgMC4zMTA5NywtMC44NDk0OGMwLC0wLjY2MjkgLTAuMzg0NTQsLTEuNDg4ODYgLTEuMDY2NCwtMi4xNzUyN2MtMS4wMzMwMywtMS4wMjk5OSAtMi4zODY4OCwtMS4zNjUyMyAtMy4wMzUzNywtMC43NTA4OGw3LjA4MDI1LC03LjA1NDQ3YzAuNjQwMTQsLTAuNjM3MTEgMi4wMDk5MywtMC4zMTA5NyAzLjA2MDQsMC43MjgxMmMwLjY4MTEsMC42ODU2NSAxLjA1ODgxLDEuNTAzMjcgMS4wNTg4MSwyLjE2NTQxTTIyMy44NjM5NywxOTguMzUyOTZjLTAuNDM0NiwwLjIyOTA2IC0wLjg3NzU0LDAuNDMyMzIgLTEuMzM3OTMsMC42Mjk1MmwtMy4yMjQyMywxLjM0ODU1bDEuMzU0NjIsLTMuMjEyMDljMC4xOTU2OCwtMC40NTgxMSAwLjQwMTk5LC0wLjg5OTU0IDAuNjMxOCwtMS4zMzI2MmMwLjUyMzM0LDAuMTM4OCAxLjA5ODI1LDAuNDc0MDQgMS41OTg4NCwwLjk3MjM1YzAuNTAwNTksMC40OTkwNyAwLjgzNTgzLDEuMDcwOTUgMC45NzYxNCwxLjU5NDI5IiBmaWxsPSIjYWRjMjEzIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiIHN0cm9rZT0iIzdlOGQwYiIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0icm91bmQiLz48cGF0aCBkPSJNMjQzLjU3MTEyLDE3OS4zNzE2NmMwLDAuMzUxOTMgLTAuMTA2MTgsMC42NjI5IC0wLjMyODQxLDAuODgzNjFsLTE0Ljk3MzU4LDE0LjkyNjU2Yy0xLjYxNTUzLDEuNjAwMzYgLTMuNTQ0MywyLjg3Njg1IC01Ljc0MzA4LDMuNzk5OWwtMy4yMjQyMywxLjM0Nzc5bDAuNzM4NzQsLTEuNzU2NmwxLjQ2MDA0LC0wLjYxMjg0YzIuMTk4MDMsLTAuOTIzODEgNC4xMjYwNCwtMi4xOTk1NCA1Ljc0MTU3LC0zLjc5OTlsMTQuOTc0MzQsLTE0LjkyNjU2YzAuMjIxNDcsLTAuMjIxNDcgMC4zMjc2NiwtMC41MzI0NCAwLjMyNzY2LC0wLjg4MzYxYzAsLTAuNDg5OTcgLTAuMjA0NzksLTEuMDYxODUgLTAuNTkxNiwtMS42MDk0NmMwLjE4OTYyLDAuMTMwNDYgMC4zNzkyMywwLjI4NTk0IDAuNTU4OTksMC40NjU3YzAuNjgxMSwwLjY4NjQxIDEuMDU4ODEsMS41MDQwMyAxLjA1ODgxLDIuMTY2MTciIGZpbGw9IiM1NzVlNzUiIGZpbGwtcnVsZT0iZXZlbm9kZCIgc3Ryb2tlPSIjNTc1ZTc1IiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgb3BhY2l0eT0iMC4xNSIvPjxwYXRoIGQ9Ik0yMjkuODgyMzgsMTgyLjQ2NzdjMCwwLjM3OTIzIC0wLjMwNjQyLDAuNjg2NDEgLTAuNjg1NjUsMC42ODY0MWMtMC4zNzkyMywwIC0wLjY4NjQxLC0wLjMwNzE4IC0wLjY4NjQxLC0wLjY4NTY1YzAsLTAuMzc5MjMgMC4zMDg2OSwtMC42ODQ4OSAwLjY4NzE3LC0wLjY4NDg5YzAuMzc5MjMsMCAwLjY4NTY1LDAuMzA2NDIgMC42ODU2NSwwLjY4NTY1eiIgZmlsbD0iIzdlOGQwYiIgZmlsbC1ydWxlPSJldmVub2RkIiBzdHJva2U9IiM3ZThkMGIiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+PHBhdGggZD0iTTIzNC44NDg4NSwxOTMuMjU1MzFoNy4yMTg3OSIgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9IiNiN2MyNjYiIHN0cm9rZS13aWR0aD0iMS41IiBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiLz48cGF0aCBkPSJNMjM4LjQ1ODI0LDE5Ni44NjQ3di03LjIxODc5IiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZT0iI2I3YzI2NiIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjMxLjk3MTYzMDY4NzExOTI3MzozMS45NzE2MDU2ODcxMTkzMDgtLT4=";
  const penPCheck = () => {
    if (penPLoaded) {return;} // Return if pen+ integration is loaded
    if (vm.runtime.ext_penP) {penPLoaded = true;}
    penPModule = vm.runtime.ext_penP;

    if (penPModule) {penPModule.turnAdvancedSettingOff({Setting:"wValueUnderFlow",onOrOff:"on"});}

    vm.runtime.extensionManager.refreshBlocks();
  }
  penPCheck();
  vm.runtime.on("EXTENSION_ADDED", penPCheck);

  class extension {
    getInfo() {
      return {
        blocks: [
          //#3D Vector Math#
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Vector 3",
          },
          {
            disableMonitor: true,
            opcode: "newV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "vector 3 x:[x] y:[y] z:[z]",
            arguments: {
              x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              z: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            disableMonitor: true,
            opcode: "newV3fromValue",
            blockType: Scratch.BlockType.REPORTER,
            text: "vector 3 from [value]",
            arguments: {
              value: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            disableMonitor: true,
            opcode: "getAxisOfV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "get the [axis] axis of [vector]",
            arguments: {
              axis: { type: Scratch.ArgumentType.STRING, menu: "axisMenu" },
              vector: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "[0,0,0]",
              },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Equations",
          },
          {
            disableMonitor: true,
            opcode: "addV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: [a] + [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "subV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: [a] - [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "mulV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: [a] * [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "divV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: [a] / [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "dotProductOfV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: dot product between [a] and [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "crossProductOfV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: cross product between [a] and [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "magnitudeV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: magnitude of [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "distanceV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: distance between [a] and [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "rotateAroundPointV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: rotate [a] around [b] by yaw:[yaw] pitch:[pitch], and roll:[roll]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              yaw: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
              pitch: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
              roll: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
            },
          },
          {
            disableMonitor: true,
            opcode: "rotateAroundCenterV3",
            blockType: Scratch.BlockType.REPORTER,
            text: "V3: rotate [a] around the center by yaw:[yaw] pitch:[pitch], and roll:[roll]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              yaw: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
              pitch: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
              roll: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
            },
          },

          //#2D Vector Math#
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Vector 2",
          },
          {
            disableMonitor: true,
            opcode: "newV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "vector 2 x:[x] y:[y]",
            arguments: {
              x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
              y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            disableMonitor: true,
            opcode: "newV2fromValue",
            blockType: Scratch.BlockType.REPORTER,
            text: "vector 2 from [value]",
            arguments: {
              value: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
          },
          {
            disableMonitor: true,
            opcode: "getAxisOfV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: get the [axis] axis of [vector]",
            arguments: {
              axis: { type: Scratch.ArgumentType.STRING, menu: "axisMenu2D" },
              vector: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "[0,0]",
              },
            },
          },
          {
            disableMonitor: true,
            opcode: "project2DFromCam",
            blockType: Scratch.BlockType.REPORTER,
            text: "get projected [a] to 2D from camera",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "[0,0,100]",
              },
            },
          },
          {
            disableMonitor: true,
            opcode: "project2DFromPos",
            blockType: Scratch.BlockType.REPORTER,
            text: "get projected [a] to 2D from [b] yaw:[yaw] pitch:[pitch] roll:[roll]",
            arguments: {
              a: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "[0,0,100]",
              },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
              yaw: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
              pitch: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
              roll: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
            },
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Equations",
          },
          {
            disableMonitor: true,
            opcode: "addV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: [a] + [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "subV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: [a] - [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "mulV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: [a] * [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "divV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: [a] / [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "dotProductOfV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: dot product between [a] and [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "crossProductOfV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: cross product between [a] and [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "magnitudeV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: magnitude of [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "distanceV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: distance between [a] and [b]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "rotateAroundPointV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: rotate [a] around [b] by [yaw] degrees",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              b: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              yaw: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
            },
          },
          {
            disableMonitor: true,
            opcode: "rotateAroundCenterV2",
            blockType: Scratch.BlockType.REPORTER,
            text: "V2: rotate [a] around the center by [yaw] degrees",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0]" },
              yaw: { type: Scratch.ArgumentType.STRING, defaultValue: "0" },
            },
          },

          //#CAMERA CONTROLS#
          {
            blockType: Scratch.BlockType.LABEL,
            text: "camera",
          },
          {
            disableMonitor: true,
            opcode: "cam3DsetPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "set camera position to [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "cam3DchangePosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "change camera position by [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[5,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "cam3DchangePositionOnAxis",
            blockType: Scratch.BlockType.COMMAND,
            text: "change camera [axis] by [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.NUMBER, defaultValue: "15" },
              axis: { type: Scratch.ArgumentType.STRING, defaultValue: "0", menu: "axisMenu2"},
            },
          },
          {
            disableMonitor: false,
            opcode: "cam3DgetPosition",
            blockType: Scratch.BlockType.REPORTER,
            text: "get camera position",
            arguments: {},
          },

          {
            disableMonitor: true,
            opcode: "cam3DsetRotation",
            blockType: Scratch.BlockType.COMMAND,
            text: "set camera rotation to [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "cam3DchangeRotation",
            blockType: Scratch.BlockType.COMMAND,
            text: "change camera rotation by [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[15,0,0]" },
            },
          },
          {
            disableMonitor: true,
            opcode: "cam3DchangeRotationOnAxis",
            blockType: Scratch.BlockType.COMMAND,
            text: "change camera [rotator] by [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.NUMBER, defaultValue: "15" },
              rotator: { type: Scratch.ArgumentType.STRING, defaultValue: "0", menu: "angleMenu"},
            },
          },
          {
            disableMonitor: false,
            opcode: "cam3DgetRotation",
            blockType: Scratch.BlockType.REPORTER,
            text: "get camera rotation",
            arguments: {},
          },
          {
            disableMonitor: true,
            opcode: "setFov",
            blockType: Scratch.BlockType.COMMAND,
            text: "set fov to [dist]",
            arguments: {
              dist: { type: Scratch.ArgumentType.NUMBER, defaultValue: 300 },
            },
          },
          {
            disableMonitor: true,
            opcode: "changeFov",
            blockType: Scratch.BlockType.COMMAND,
            text: "change fov by [dist]",
            arguments: {
              dist: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            },
          },
          {
            disableMonitor: false,
            opcode: "getFov",
            blockType: Scratch.BlockType.REPORTER,
            text: "fov",
          },

          //#SPRITE 3D#
          {
            blockType: Scratch.BlockType.LABEL,
            text: "sprite 3D",
          },
          {
            disableMonitor: true,
            opcode: "spr3DsetPosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "set my position to [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3DsetPositionComponent",
            blockType: Scratch.BlockType.COMMAND,
            text: "set my [component] to [a]",
            arguments: {
              component: { type: Scratch.ArgumentType.STRING, defaultValue: "0", menu: "axisMenu2"},
              a: { type: Scratch.ArgumentType.NUMBER, defaultValue: 0 },
            },
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3DchangePosition",
            blockType: Scratch.BlockType.COMMAND,
            text: "change my position by [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,0]" },
            },
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3DchangePositionComponent",
            blockType: Scratch.BlockType.COMMAND,
            text: "change my [component] by [a]",
            arguments: {
              component: { type: Scratch.ArgumentType.STRING, defaultValue: "0", menu: "axisMenu2"},
              a: { type: Scratch.ArgumentType.NUMBER, defaultValue: 5 },
            },
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3DgetPosition",
            blockType: Scratch.BlockType.REPORTER,
            text: "my 3d position",
            arguments: {},
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3DgetPositionComponent",
            blockType: Scratch.BlockType.REPORTER,
            text: "my [component] position",
            arguments: {
              component: { type: Scratch.ArgumentType.STRING, defaultValue: "0", menu: "axisMenu2"},
            },
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3DsetSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "set my 3d size to [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.NUMBER, defaultValue: 100 },
            },
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3DchangeSize",
            blockType: Scratch.BlockType.COMMAND,
            text: "change my 3d size by [a]",
            arguments: {
              a: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
            },
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3DgetSize",
            blockType: Scratch.BlockType.REPORTER,
            text: "my 3d size",
            arguments: {},
            filter: "sprite",
          },
          {
            disableMonitor: true,
            opcode: "spr3D",
            blockType: Scratch.BlockType.COMMAND,
            text: "go to my position in 3D",
            arguments: {},
            filter: "sprite",
          },

          //#Pen+ Integration #
          {
            hideFromPalette:(!penPLoaded),
            blockType: Scratch.BlockType.LABEL,
            text: "Pen+ 3D",
          },
          {
            disableMonitor: true,
            hideFromPalette:(!penPLoaded),
            opcode: "draw3dTri",
            blockType: Scratch.BlockType.COMMAND,
            text: "draw 3d triangle between [point1], [point2], [point3]",
            arguments: {
                point1: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,100]"},
                point2: { type: Scratch.ArgumentType.STRING, defaultValue: "[10,0,100]"},
                point3: { type: Scratch.ArgumentType.STRING, defaultValue: "[10,10,100]"},
            },
            blockIconURI: penPIcon,
            filter: "sprite",
          },
          {
            disableMonitor: true,
            hideFromPalette:(!penPLoaded),
            opcode: "draw3dTexTri",
            blockType: Scratch.BlockType.COMMAND,
            text: "draw 3d triangle between [point1], [point2], [point3] with the image [texture]",
            arguments: {
                point1: { type: Scratch.ArgumentType.STRING, defaultValue: "[0,0,100]"},
                point2: { type: Scratch.ArgumentType.STRING, defaultValue: "[10,0,100]"},
                point3: { type: Scratch.ArgumentType.STRING, defaultValue: "[10,10,100]"},
                texture: { menu: "tdMathPPCosMen"}
            },
            blockIconURI: penPIcon,
            filter: "sprite",
          },
        ],
        menus: {
          axisMenu: {
            items: [
              { text: "x / yaw", value: "0" },
              { text: "y / pitch", value: "1" },
              { text: "z / roll", value: "2" },
            ],
            acceptReporters: false,
          },
          axisMenu2D: {
            items: [
              { text: "x", value: "0" },
              { text: "y", value: "1" },
            ],
            acceptReporters: false,
          },
          angleMenu: {
            items: [
              { text: "yaw", value: "0" },
              { text: "pitch", value: "1" },
              { text: "roll", value: "2" },
            ],
            acceptReporters: true,
          },
          axisMenu2: {
            items: [
              { text: "x", value: "0" },
              { text: "y", value: "1" },
              { text: "z", value: "2" },
            ],
            acceptReporters: true,
          },
          tdMathPPCosMen: {
            items: "tdMathPPCosMen", acceptReporters: true
          },
        },
        name: "3D Math",
        id: "obviousAlexCMath3d",
        menuIconURI:
          "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4OC44NTEwNCIgaGVpZ2h0PSI4OC44NTEwNCIgdmlld0JveD0iMCwwLDg4Ljg1MTA0LDg4Ljg1MTA0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMTk1LjU3NDQ5LC0xMzUuNTc0NDkpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0xOTUuNTc0NSwxODAuMDAwMDFjMCwtMjQuNTM1NTQgMTkuODg5OTgsLTQ0LjQyNTUyIDQ0LjQyNTUyLC00NC40MjU1MmMyNC41MzU1NCwwIDQ0LjQyNTUyLDE5Ljg4OTk4IDQ0LjQyNTUyLDQ0LjQyNTUyYzAsMjQuNTM1NTQgLTE5Ljg4OTk4LDQ0LjQyNTUyIC00NC40MjU1Miw0NC40MjU1MmMtMjQuNTM1NTQsMCAtNDQuNDI1NTIsLTE5Ljg4OTk4IC00NC40MjU1MiwtNDQuNDI1NTJ6IiBmaWxsPSIjYzJkOTE2IiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMTIuNTU4NDIsMjA3LjE4MjYydi0zNy44ODQ1N2gzNy43NTc0NHYzNy44ODQ1N3oiIGZpbGw9IiNhZGMyMTMiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTIxMy45NTY4NSwxNjkuNjc5NDRsMTYuMzk5NjksLTE3LjU0Mzg2bDM1Ljg1MDUsMC41MDg1MmwtMTUuNTA5NzksMTYuNjUzOTV6IiBmaWxsPSIjYWRjMjEzIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNTAuOTUxNTEsMjA2LjU0Njk4di01My4wMTI5N2gxNi45MDgyMWwtMC42MzU2NSwzNi40ODYxNHoiIGZpbGw9IiNhZGMyMTMiIHN0cm9rZT0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI2OC44MzAwNiwxNTIuMzcxMjR2MzguNDQwMDJjMCwwLjA2OTcxIC0wLjAyODgzLDAuMTMyMjEgLTAuMDQwODgsMC4xOTk0NWMtMC4wMTQ0MiwwLjA4ODg2IC0wLjAxOTE0LDAuMTc1MzUgLTAuMDUyODIsMC4yNTk0N2MtMC4wNjAwMiwwLjE0NjUyIC0wLjE0ODk5LDAuMjgxMDkgLTAuMjU5NDcsMC4zOTE1N2wtMTYuODE3NDksMTYuODE3NDljLTAuMDA5NjksMC4wMDk1NyAtMC4wMjQxLDAuMDEyMDUgLTAuMDMzNjcsMC4wMjE2MmMtMC4xMDU2NCwwLjA5NjE4IC0wLjIyMDk1LDAuMTgwMTkgLTAuMzU1NTMsMC4yMzU0OGMtMC4xNDY2MywwLjA2MjUgLTAuMzAyNzIsMC4wOTM3IC0wLjQ1ODkyLDAuMDkzN2gtMzguNDQwMDJjLTAuNjYzMDksMCAtMS4yMDEyOSwtMC41MzgyIC0xLjIwMTI5LC0xLjIwMTE4di0zOC40MzUyOWMwLC0wLjE1ODU3IDAuMDMxMiwtMC4zMTQ3NyAwLjA5MTMzLC0wLjQ2NjEyYzAuMDU1MywtMC4xMzIxIDAuMTM5NDIsLTAuMjQ5OSAwLjIzNTQ4LC0wLjM1MzE3YzAuMDExOTQsLTAuMDA5NjkgMC4wMTQ0MiwtMC4wMjQxIDAuMDIzOTksLTAuMDMzNjdsMTYuODE3MzgsLTE2LjgxNzQ5YzAuMTEyOTYsLTAuMTEyODQgMC4yNDUwNiwtMC4xOTkzMyAwLjM5NDA1LC0wLjI2MTg0YzAuMDgxNzYsLTAuMDMzNjcgMC4xNzA2MiwtMC4wMzYwNCAwLjI1NzExLC0wLjA1MDQ1YzAuMDY3MzUsLTAuMDEyMDUgMC4xMjk3NCwtMC4wNDA4OCAwLjE5OTQ1LC0wLjA0MDg4aDM4LjQ0MDAyYzAuMDkxMzMsMCAwLjE3Mjk4LDAuMDMzNjcgMC4yNTQ3NCwwLjA1MDQ1YzAuMDY3MjMsMC4wMTY4OSAwLjEzNDQ3LDAuMDE0NDIgMC4xOTY5NywwLjA0MDg4YzAuMjk3ODcsMC4xMjI1MyAwLjUzMzM2LDAuMzU4MDEgMC42NTU4OCwwLjY1NTg4YzAuMDI2NDcsMC4wNjIzOSAwLjAyNjQ3LDAuMTMyMSAwLjA0MDg4LDAuMTk2OTdjMC4wMTkxNCwwLjA4NDEyIDAuMDUyODIsMC4xNjU3NyAwLjA1MjgyLDAuMjU3MTF6TTI0OS42MDk5OSwxNzAuMzkwMDJoLTM2LjAzNzU2djM2LjAzNzU2aDM2LjAzNzU2ek0yNjQuNzI4OTgsMTUzLjU3MjQyaC0zNS4wNDI5MmwtMTQuNDE1MDIsMTQuNDE1MDJoMzUuMDQyOTJ6TTI2Ni40Mjc1OSwxNTUuMjcxMDNsLTE0LjQxNTAyLDE0LjQxNTAydjM1LjA0MjkybDE0LjQxNTAyLC0xNC40MTUwMnoiIGZpbGw9IiM3ZThkMGIiIHN0cm9rZT0iIzdlOGQwYiIgc3Ryb2tlLXdpZHRoPSI2Ii8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6NDQuNDI1NTA0OTk5OTk5OTk6NDQuNDI1NTE0OTk5OTk5OTktLT4=",
        blockIconURI:
          "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2My45NDMyMiIgaGVpZ2h0PSI2My45NDMyMiIgdmlld0JveD0iMCwwLDYzLjk0MzIyLDYzLjk0MzIyIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA4LjAyODQsLTE0OC4wMjgzOCkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTIxMi41NTg0MywyMDcuMTgyNjJ2LTM3Ljg4NDU3aDM3Ljc1NzQ0djM3Ljg4NDU3eiIgZmlsbD0iI2FkYzIxMyIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjEzLjk1Njg2LDE2OS42Nzk0NGwxNi4zOTk2OSwtMTcuNTQzODZsMzUuODUwNSwwLjUwODUybC0xNS41MDk3OSwxNi42NTM5NXoiIGZpbGw9IiNhZGMyMTMiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI1MC45NTE1MiwyMDYuNTQ2OTh2LTUzLjAxMjk3aDE2LjkwODIxbC0wLjYzNTY1LDM2LjQ4NjE0eiIgZmlsbD0iI2FkYzIxMyIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjY4LjgzMDA3LDE1Mi4zNzEyNHYzOC40NDAwMmMwLDAuMDY5NzEgLTAuMDI4ODMsMC4xMzIyMSAtMC4wNDA4OCwwLjE5OTQ1Yy0wLjAxNDQyLDAuMDg4ODYgLTAuMDE5MTQsMC4xNzUzNSAtMC4wNTI4MiwwLjI1OTQ3Yy0wLjA2MDAyLDAuMTQ2NTIgLTAuMTQ4OTksMC4yODEwOSAtMC4yNTk0NywwLjM5MTU3bC0xNi44MTc0OSwxNi44MTc0OWMtMC4wMDk2OSwwLjAwOTU3IC0wLjAyNDEsMC4wMTIwNSAtMC4wMzM2NywwLjAyMTYyYy0wLjEwNTY0LDAuMDk2MTggLTAuMjIwOTUsMC4xODAxOSAtMC4zNTU1MywwLjIzNTQ4Yy0wLjE0NjYzLDAuMDYyNSAtMC4zMDI3MiwwLjA5MzcgLTAuNDU4OTIsMC4wOTM3aC0zOC40NDAwMmMtMC42NjMwOSwwIC0xLjIwMTI5LC0wLjUzODIgLTEuMjAxMjksLTEuMjAxMTh2LTM4LjQzNTI5YzAsLTAuMTU4NTcgMC4wMzEyLC0wLjMxNDc3IDAuMDkxMzMsLTAuNDY2MTJjMC4wNTUzLC0wLjEzMjEgMC4xMzk0MiwtMC4yNDk5IDAuMjM1NDgsLTAuMzUzMTdjMC4wMTE5NCwtMC4wMDk2OSAwLjAxNDQyLC0wLjAyNDEgMC4wMjM5OSwtMC4wMzM2N2wxNi44MTczOCwtMTYuODE3NDljMC4xMTI5NiwtMC4xMTI4NCAwLjI0NTA2LC0wLjE5OTMzIDAuMzk0MDUsLTAuMjYxODRjMC4wODE3NiwtMC4wMzM2NyAwLjE3MDYyLC0wLjAzNjA0IDAuMjU3MTEsLTAuMDUwNDVjMC4wNjczNSwtMC4wMTIwNSAwLjEyOTc0LC0wLjA0MDg4IDAuMTk5NDUsLTAuMDQwODhoMzguNDQwMDJjMC4wOTEzMywwIDAuMTcyOTgsMC4wMzM2NyAwLjI1NDc0LDAuMDUwNDVjMC4wNjcyMywwLjAxNjg5IDAuMTM0NDcsMC4wMTQ0MiAwLjE5Njk3LDAuMDQwODhjMC4yOTc4NywwLjEyMjUzIDAuNTMzMzYsMC4zNTgwMSAwLjY1NTg4LDAuNjU1ODhjMC4wMjY0NywwLjA2MjM5IDAuMDI2NDcsMC4xMzIxIDAuMDQwODgsMC4xOTY5N2MwLjAxOTE0LDAuMDg0MTIgMC4wNTI4MiwwLjE2NTc3IDAuMDUyODIsMC4yNTcxMXpNMjQ5LjYxLDE3MC4zOTAwMmgtMzYuMDM3NTZ2MzYuMDM3NTZoMzYuMDM3NTZ6TTI2NC43Mjg5OCwxNTMuNTcyNDJoLTM1LjA0MjkybC0xNC40MTUwMiwxNC40MTUwMmgzNS4wNDI5MnpNMjY2LjQyNzYsMTU1LjI3MTAzbC0xNC40MTUwMiwxNC40MTUwMnYzNS4wNDI5MmwxNC40MTUwMiwtMTQuNDE1MDJ6IiBmaWxsPSIjN2U4ZDBiIiBzdHJva2U9IiM3ZThkMGIiIHN0cm9rZS13aWR0aD0iNiIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjMxLjk3MTU5NTY4NzExOTI3NjozMS45NzE2MTU2ODcxMTkyODItLT4=",
        color1: "#ADC213",
        color2: "#A0B312",
        color3: "#697700",
      };
    }
    
    draw3dTri({ point1, point2, point3 },util) {
      if (!penPModule) throw "Pen+ module not found";
      point1 = JSON.parse(point1);point2 = JSON.parse(point2);point3 = JSON.parse(point3);
      //Check if points are valid
      if (!(point1.length >= 3 && point2.length >=3 && point3.length >= 3)) throw "All points are not Vector3s!";
      //cast points to number

      const target = util.target;
      
      this.checkFor3dPositionData(target.id);
      const sprX = spriteData[target.id].position[0] - camera.position[0];
      const sprY = spriteData[target.id].position[1] - camera.position[1];
      const sprZ = spriteData[target.id].position[2] - camera.position[2];

      point1[0] = Scratch.Cast.toNumber(point1[0]) + sprX;point1[1] = Scratch.Cast.toNumber(point1[1]) + sprY;point1[2] = Scratch.Cast.toNumber(point1[2]) + sprZ;
      point2[0] = Scratch.Cast.toNumber(point2[0]) + sprX;point2[1] = Scratch.Cast.toNumber(point2[1]) + sprY;point2[2] = Scratch.Cast.toNumber(point2[2]) + sprZ;
      point3[0] = Scratch.Cast.toNumber(point3[0]) + sprX;point3[1] = Scratch.Cast.toNumber(point3[1]) + sprY;point3[2] = Scratch.Cast.toNumber(point3[2]) + sprZ;

      //Rotate points around camera
      let temp = point1[0];
      point1[0] = point1[2] * camera.sinAndCos[0] + point1[0] * camera.sinAndCos[1];point1[2] = point1[2] * camera.sinAndCos[1] - temp * camera.sinAndCos[0];
      temp = point1[1];
      point1[1] = point1[2] * camera.sinAndCos[2] + point1[1] * camera.sinAndCos[3];point1[2] = point1[2] * camera.sinAndCos[3] - temp * camera.sinAndCos[2];
      temp = point1[0];
      point1[0] = point1[1] * camera.sinAndCos[4] + point1[0] * camera.sinAndCos[5];point1[1] = point1[1] * camera.sinAndCos[5] - temp * camera.sinAndCos[4];

      temp = point2[0];
      point2[0] = point2[2] * camera.sinAndCos[0] + point2[0] * camera.sinAndCos[1];point2[2] = point2[2] * camera.sinAndCos[1] - temp * camera.sinAndCos[0];
      temp = point2[1];
      point2[1] = point2[2] * camera.sinAndCos[2] + point2[1] * camera.sinAndCos[3];point2[2] = point2[2] * camera.sinAndCos[3] - temp * camera.sinAndCos[2];
      temp = point2[0];
      point2[0] = point2[1] * camera.sinAndCos[4] + point2[0] * camera.sinAndCos[5];point2[1] = point2[1] * camera.sinAndCos[5] - temp * camera.sinAndCos[4];

      temp = point3[0];
      point3[0] = point3[2] * camera.sinAndCos[0] + point3[0] * camera.sinAndCos[1];point3[2] = point3[2] * camera.sinAndCos[1] - temp * camera.sinAndCos[0];
      temp = point3[1];
      point3[1] = point3[2] * camera.sinAndCos[2] + point3[1] * camera.sinAndCos[3];point3[2] = point3[2] * camera.sinAndCos[3] - temp * camera.sinAndCos[2];
      temp = point3[0];
      point3[0] = point3[1] * camera.sinAndCos[4] + point3[0] * camera.sinAndCos[5];point3[1] = point3[1] * camera.sinAndCos[5] - temp * camera.sinAndCos[4];
      
      if (point1[2] < 1 && point2[2] < 1 && point3[2] < 1) {return;}

      //Get projection points
      let project1 = fov / point1[2];
      let project2 = fov / point2[2];
      let project3 = fov / point3[2];

      point1[0] = point1[0] * project1;point1[1] = point1[1] * project1;
      point2[0] = point2[0] * project2;point2[1] = point2[1] * project2;
      point3[0] = point3[0] * project3;point3[1] = point3[1] * project3;

      //Corner Pinch
      penPModule.setTrianglePointAttribute({ point:1, attribute:6, value:point1[2] }, util);
      penPModule.setTrianglePointAttribute({ point:2, attribute:6, value:point2[2] }, util);
      penPModule.setTrianglePointAttribute({ point:3, attribute:6, value:point3[2] }, util);
      //Depth Buffer Value
      penPModule.setTrianglePointAttribute({ point:1, attribute:5, value:point1[2] }, util);
      penPModule.setTrianglePointAttribute({ point:2, attribute:5, value:point2[2] }, util);
      penPModule.setTrianglePointAttribute({ point:3, attribute:5, value:point3[2] }, util);

      penPModule.drawSolidTri({ x1:point1[0], y1:point1[1], x2:point2[0], y2:point2[1], x3:point3[0], y3:point3[1] },util);
    }
    draw3dTexTri({ point1, point2, point3, texture },util) {
      if (!penPModule) throw "Pen+ module not found";
      point1 = JSON.parse(point1);point2 = JSON.parse(point2);point3 = JSON.parse(point3);
      //Check if we have all needed points
      if (!(point1.length >= 3 && point2.length >=3 && point3.length >= 3)) throw "All points are not Vector3s!";
      //cast points to number
      
      const target = util.target;
      
      this.checkFor3dPositionData(target.id);
      const sprX = spriteData[target.id].position[0] - camera.position[0];
      const sprY = spriteData[target.id].position[1] - camera.position[1];
      const sprZ = spriteData[target.id].position[2] - camera.position[2];

      point1[0] = Scratch.Cast.toNumber(point1[0]) + sprX;point1[1] = Scratch.Cast.toNumber(point1[1]) + sprY;point1[2] = Scratch.Cast.toNumber(point1[2]) + sprZ;
      point2[0] = Scratch.Cast.toNumber(point2[0]) + sprX;point2[1] = Scratch.Cast.toNumber(point2[1]) + sprY;point2[2] = Scratch.Cast.toNumber(point2[2]) + sprZ;
      point3[0] = Scratch.Cast.toNumber(point3[0]) + sprX;point3[1] = Scratch.Cast.toNumber(point3[1]) + sprY;point3[2] = Scratch.Cast.toNumber(point3[2]) + sprZ;
      //Rotate points around camera
      let temp = point1[0];
      point1[0] = point1[2] * camera.sinAndCos[0] + point1[0] * camera.sinAndCos[1];point1[2] = point1[2] * camera.sinAndCos[1] - temp * camera.sinAndCos[0];
      temp = point1[1];
      point1[1] = point1[2] * camera.sinAndCos[2] + point1[1] * camera.sinAndCos[3];point1[2] = point1[2] * camera.sinAndCos[3] - temp * camera.sinAndCos[2];
      temp = point1[0];
      point1[0] = point1[1] * camera.sinAndCos[4] + point1[0] * camera.sinAndCos[5];point1[1] = point1[1] * camera.sinAndCos[5] - temp * camera.sinAndCos[4];

      temp = point2[0];
      point2[0] = point2[2] * camera.sinAndCos[0] + point2[0] * camera.sinAndCos[1];point2[2] = point2[2] * camera.sinAndCos[1] - temp * camera.sinAndCos[0];
      temp = point2[1];
      point2[1] = point2[2] * camera.sinAndCos[2] + point2[1] * camera.sinAndCos[3];point2[2] = point2[2] * camera.sinAndCos[3] - temp * camera.sinAndCos[2];
      temp = point2[0];
      point2[0] = point2[1] * camera.sinAndCos[4] + point2[0] * camera.sinAndCos[5];point2[1] = point2[1] * camera.sinAndCos[5] - temp * camera.sinAndCos[4];

      temp = point3[0];
      point3[0] = point3[2] * camera.sinAndCos[0] + point3[0] * camera.sinAndCos[1];point3[2] = point3[2] * camera.sinAndCos[1] - temp * camera.sinAndCos[0];
      temp = point3[1];
      point3[1] = point3[2] * camera.sinAndCos[2] + point3[1] * camera.sinAndCos[3];point3[2] = point3[2] * camera.sinAndCos[3] - temp * camera.sinAndCos[2];
      temp = point3[0];
      point3[0] = point3[1] * camera.sinAndCos[4] + point3[0] * camera.sinAndCos[5];point3[1] = point3[1] * camera.sinAndCos[5] - temp * camera.sinAndCos[4];
      
      if (point1[2] < 1 && point2[2] < 1 && point3[2] < 1) {return;}

      //Get projection points
      let project1 = fov / point1[2];
      let project2 = fov / point2[2];
      let project3 = fov / point3[2];

      point1[0] = point1[0] * project1;point1[1] = point1[1] * project1;
      point2[0] = point2[0] * project2;point2[1] = point2[1] * project2;
      point3[0] = point3[0] * project3;point3[1] = point3[1] * project3;

      //Corner Pinch
      penPModule.setTrianglePointAttribute({ point:1, attribute:6, value:point1[2] }, util);
      penPModule.setTrianglePointAttribute({ point:2, attribute:6, value:point2[2] }, util);
      penPModule.setTrianglePointAttribute({ point:3, attribute:6, value:point3[2] }, util);
      //Depth Buffer Value
      penPModule.setTrianglePointAttribute({ point:1, attribute:5, value:point1[2] }, util);
      penPModule.setTrianglePointAttribute({ point:2, attribute:5, value:point2[2] }, util);
      penPModule.setTrianglePointAttribute({ point:3, attribute:5, value:point3[2] }, util);

      penPModule.drawTexTri({ x1:point1[0], y1:point1[1], x2:point2[0], y2:point2[1], x3:point3[0], y3:point3[1], tex:texture },util);
    }
    tdMathPPCosMen() {
      if (!penPModule) throw "Pen+ module not found";
      return penPModule.costumeMenuFunction();
    }
    newV3({ x, y, z }) {
      return JSON.stringify([
        Scratch.Cast.toNumber(x) || 0,
        Scratch.Cast.toNumber(y) || 0,
        Scratch.Cast.toNumber(z) || 0,
      ]);
    }
    newV3fromValue({ value }) {
      if (typeof value == "number") {
        return JSON.stringify([value, value, value]);
      }
      return JSON.stringify([0, 0, 0]);
    }
    getAxisOfV3({ axis, vector }) {
      axis = Scratch.Cast.toNumber(axis);
      vector = JSON.parse(vector);
      if (vector) {
        return vector[axis];
      }
      return 0;
    }
    addV3({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        return JSON.stringify([a[0] + b[0], a[1] + b[1], a[2] + b[2]]);
      }
      return "[0,0,0]";
    }
    subV3({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        return JSON.stringify([a[0] - b[0], a[1] - b[1], a[2] - b[2]]);
      }
      return "[0,0,0]";
    }
    mulV3({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        return JSON.stringify([a[0] * b[0], a[1] * b[1], a[2] * b[2]]);
      }
      return "[0,0,0]";
    }
    divV3({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        const c = [0, 0, 0];
        c[0] = a[0] / b[0];
        c[1] = a[1] / b[1];
        c[2] = a[2] / b[2];
        if (isNaN(c[0])) {
          c[0] = 0;
        }

        if (isNaN(c[1])) {
          c[1] = 0;
        }

        if (isNaN(c[2])) {
          c[2] = 0;
        }

        return JSON.stringify(c);
      }
      return "[0,0,0]";
    }
    dotProductOfV3({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a.length == 3 && b.length == 3) {
        return a[0] * b[0] + a[1] * b[1] + a[2] + b[2];
      }
      return 0;
    }
    dotProductOfV2({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a.length == 2 && b.length == 2) {
        return a[0] * b[0] + a[1] * b[1];
      }
      return 0;
    }
    crossProductOfV3({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);

      if (a && b) {
        const c = [0, 0, 0];

        c[0] = a[1] * b[2] - a[2] * b[1];
        c[1] = a[2] * b[0] - a[0] * b[2];
        c[2] = a[0] * b[1] - a[1] * b[0];

        return JSON.stringify(c);
      }
      return "[0,0,0]";
    }
    magnitudeV3({ a }) {
      a = JSON.parse(a);
      if (a) {
        return Math.sqrt(
          Math.pow(a[0], 2) + Math.pow(a[1], 2) + Math.pow(a[2], 2)
        );
      }
      return 0;
    }
    distanceV3({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        return Math.sqrt(
          Math.pow(a[0] - b[0], 2) +
            Math.pow(a[1] - b[1], 2) +
            Math.pow(a[2] - b[2], 2)
        );
      }
      return 0;
    }
    rotateAroundPointV3({ a, b, yaw, pitch, roll }) {
      a = JSON.parse(a);
      b = JSON.parse(b);

      if (a && b) {
        a[0] -= b[0];
        a[1] -= b[1];
        a[2] -= b[2];

        const sinAndCos = [
          Math.sin(yaw * d2r),
          Math.cos(yaw * d2r),
          Math.sin(pitch * d2r),
          Math.cos(pitch * d2r),
          Math.sin(roll * d2r),
          Math.cos(roll * d2r),
        ];

        let temp = a[0];

        a[0] = a[2] * sinAndCos[0] + a[0] * sinAndCos[1];
        a[2] = a[2] * sinAndCos[1] - temp * sinAndCos[0];

        temp = a[1];

        a[1] = a[2] * sinAndCos[2] + a[1] * sinAndCos[3];
        a[2] = a[2] * sinAndCos[3] - temp * sinAndCos[2];

        temp = a[0];

        a[0] = a[1] * sinAndCos[4] + a[0] * sinAndCos[5];
        a[1] = a[1] * sinAndCos[5] - temp * sinAndCos[4];

        a[0] += b[0];
        a[1] += b[1];
        a[2] += b[2];

        return JSON.stringify(a);
      }
      return "[0,0,0]";
    }
    rotateAroundCenterV3({ a, yaw, pitch, roll }) {
      a = JSON.parse(a);

      if (a) {
        const sinAndCos = [
          Math.sin(yaw * d2r),
          Math.cos(yaw * d2r),
          Math.sin(pitch * d2r),
          Math.cos(pitch * d2r),
          Math.sin(roll * d2r),
          Math.cos(roll * d2r),
        ];

        let temp = a[0];

        a[0] = a[2] * sinAndCos[0] + a[0] * sinAndCos[1];
        a[2] = a[2] * sinAndCos[1] - temp * sinAndCos[0];

        temp = a[1];

        a[1] = a[2] * sinAndCos[2] + a[1] * sinAndCos[3];
        a[2] = a[2] * sinAndCos[3] - temp * sinAndCos[2];

        temp = a[0];

        a[0] = a[1] * sinAndCos[4] + a[0] * sinAndCos[5];
        a[1] = a[1] * sinAndCos[5] - temp * sinAndCos[4];

        return JSON.stringify(a);
      }
      return "[0,0,0]";
    }
    newV2({ x, y }) {
      return JSON.stringify([
        Scratch.Cast.toNumber(x) || 0,
        Scratch.Cast.toNumber(y) || 0,
      ]);
    }
    newV2fromValue({ value }) {
      if (typeof value == "number") {
        return JSON.stringify([value, value]);
      }
      return JSON.stringify([0, 0]);
    }
    getAxisOfV2({ axis, vector }) {
      axis = Scratch.Cast.toNumber(axis);
      vector = JSON.parse(vector);
      if (vector) {
        return vector[axis];
      }
      return 0;
    }
    project2DFromCam({ a }) {
      a = JSON.parse(a);

      if (a) {
        a[0] -= camera.position[0];
        a[1] -= camera.position[1];
        a[2] -= camera.position[2];

        let temp = a[0];

        a[0] = a[2] * camera.sinAndCos[0] + a[0] * camera.sinAndCos[1];
        a[2] = a[2] * camera.sinAndCos[1] - temp * camera.sinAndCos[0];

        temp = a[1];

        a[1] = a[2] * camera.sinAndCos[2] + a[1] * camera.sinAndCos[3];
        a[2] = a[2] * camera.sinAndCos[3] - temp * camera.sinAndCos[2];

        temp = a[0];

        a[0] = a[1] * camera.sinAndCos[4] + a[0] * camera.sinAndCos[5];
        a[1] = a[1] * camera.sinAndCos[5] - temp * camera.sinAndCos[4];

        let project = fov / a[2];

        return JSON.stringify([a[0] * project, a[1] * project]);
      }
      return "[0,0]";
    }
    project2DFromPos({ a, b, yaw, pitch, roll }) {
      a = JSON.parse(a);
      b = JSON.parse(b);

      if (a && b) {
        a[0] -= b[0];
        a[1] -= b[1];
        a[2] -= b[2];

        const sinAndCos = [
          Math.sin(-yaw * d2r),
          Math.cos(-yaw * d2r),
          Math.sin(-pitch * d2r),
          Math.cos(-pitch * d2r),
          Math.sin(-roll * d2r),
          Math.cos(-roll * d2r),
        ];

        let temp = a[0];

        a[0] = a[2] * sinAndCos[0] + a[0] * sinAndCos[1];
        a[2] = a[2] * sinAndCos[1] - temp * sinAndCos[0];

        temp = a[1];

        a[1] = a[2] * sinAndCos[2] + a[1] * sinAndCos[3];
        a[2] = a[2] * sinAndCos[3] - temp * sinAndCos[2];

        temp = a[0];

        a[0] = a[1] * sinAndCos[4] + a[0] * sinAndCos[5];
        a[1] = a[1] * sinAndCos[5] - temp * sinAndCos[4];

        let project = fov / a[2];

        return JSON.stringify([a[0] * project, a[1] * project]);
      }
      return "[0,0]";
    }
    addV2({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        return JSON.stringify([a[0] + b[0], a[1] + b[1]]);
      }
      return "[0,0]";
    }
    subV2({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        return JSON.stringify([a[0] - b[0], a[1] - b[1], a[2] - b[2]]);
      }
      return "[0,0]";
    }
    mulV2({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        return JSON.stringify([a[0] * b[0], a[1] * b[1]]);
      }
      return "[0,0]";
    }
    divV2({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        const c = [0, 0];
        c[0] = a[0] / b[0];
        c[1] = a[1] / b[1];
        if (isNaN(c[0])) {
          c[0] = 0;
        }

        if (isNaN(c[1])) {
          c[1] = 0;
        }

        return JSON.stringify(c);
      }
      return "[0,0]";
    }
    crossProductOfV2({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);

      if (a && b) {
        const c = [0, 0];

        c[0] = a[1] - b[1];
        c[1] = b[0] - a[0];

        return JSON.stringify(c);
      }
      return 0;
    }
    magnitudeV2({ a }) {
      a = JSON.parse(a);
      if (a) {
        return Math.sqrt(Math.pow(a[0], 2) + Math.pow(a[1], 2));
      }
      return 0;
    }
    distanceV2({ a, b }) {
      a = JSON.parse(a);
      b = JSON.parse(b);
      if (a && b) {
        return Math.sqrt(Math.pow(a[0] - b[0], 2) + Math.pow(a[1] - b[1], 2));
      }
      return 0;
    }
    rotateAroundPointV2({ a, b, yaw }) {
      a = JSON.parse(a);
      b = JSON.parse(b);

      if (a && b) {
        a[0] -= b[0];
        a[1] -= b[1];

        const sinAndCos = [Math.sin(yaw * d2r), Math.cos(yaw * d2r)];

        let temp = a[0];

        a[0] = a[1] * sinAndCos[0] + a[0] * sinAndCos[1];
        a[1] = a[1] * sinAndCos[1] - temp * sinAndCos[0];

        a[0] += b[0];
        a[1] += b[1];

        return JSON.stringify(a);
      }
      return "[0,0]";
    }
    rotateAroundCenterV2({ a, yaw }) {
      a = JSON.parse(a);

      if (a) {
        const sinAndCos = [Math.sin(yaw * d2r), Math.cos(yaw * d2r)];

        let temp = a[0];

        a[0] = a[1] * sinAndCos[0] + a[0] * sinAndCos[1];
        a[1] = a[1] * sinAndCos[1] - temp * sinAndCos[0];

        return JSON.stringify(a);
      }
      return "[0,0]";
    }
    cam3DsetPosition({ a }) {
      a = JSON.parse(a);

      if (a) {
        camera.position = a;
      }
    }
    cam3DchangePosition({ a }) {
      a = JSON.parse(a);

      if (a[0] != undefined && a[1] != undefined && a[2] != undefined) {
        camera.position[0] += a[0];
        camera.position[1] += a[1];
        camera.position[2] += a[2];
      }
    }
    cam3DchangePositionOnAxis({ a, axis}) {
      a = Scratch.Cast.toNumber(a);
      axis = Scratch.Cast.toNumber(axis);

      if (camera.position[axis] != undefined) {
        camera.position[axis] += a;
      }
    }
    cam3DgetPosition() {
      return JSON.stringify(camera.position);
    }
    cam3DsetRotation({ a }) {
      a = JSON.parse(a);

      if (a) {
        camera.rotation = a;

        camera.sinAndCos = [
          Math.sin(-camera.rotation[0] * d2r),
          Math.cos(-camera.rotation[0] * d2r),
          Math.sin(-camera.rotation[1] * d2r),
          Math.cos(-camera.rotation[1] * d2r),
          Math.sin(-camera.rotation[2] * d2r),
          Math.cos(-camera.rotation[2] * d2r),
        ];
      }
    }
    cam3DchangeRotation({ a }) {
      a = JSON.parse(a);

      if (a[0] != undefined && a[1] != undefined && a[2] != undefined) {
        camera.rotation[0] += a[0];
        camera.rotation[1] += a[1];
        camera.rotation[2] += a[2];
        camera.sinAndCos = [
          Math.sin(-camera.rotation[0] * d2r),
          Math.cos(-camera.rotation[0] * d2r),
          Math.sin(-camera.rotation[1] * d2r),
          Math.cos(-camera.rotation[1] * d2r),
          Math.sin(-camera.rotation[2] * d2r),
          Math.cos(-camera.rotation[2] * d2r),
        ];
      }
    }
    cam3DchangeRotationOnAxis({ a, rotator}) {
      a = Scratch.Cast.toNumber(a);
      rotator = Scratch.Cast.toNumber(rotator);

      if (camera.rotation[rotator] != undefined) {
        camera.rotation[rotator] += a;
        camera.sinAndCos = [
          Math.sin(-camera.rotation[0] * d2r),
          Math.cos(-camera.rotation[0] * d2r),
          Math.sin(-camera.rotation[1] * d2r),
          Math.cos(-camera.rotation[1] * d2r),
          Math.sin(-camera.rotation[2] * d2r),
          Math.cos(-camera.rotation[2] * d2r),
        ];
      }
    }
    cam3DgetRotation() {
      return JSON.stringify(camera.rotation);
    }
    setFov({ dist }) {
      fov = dist;
    }
    changeFov({ dist }) {
      fov += dist;
    }
    getFov() {
      return fov;
    }
    checkFor3dPositionData(targetID) {
      if (!spriteData[targetID]) {
        spriteData[targetID] = {position:[0, 0, fov], size:100};
      }
    }
    spr3DsetPosition({ a }, util) {
      const target = util.target;
      this.checkFor3dPositionData(target.id);

      a = JSON.parse(a);
      if (a) {
        spriteData[target.id].position[0] = a[0];
        spriteData[target.id].position[1] = a[1];
        spriteData[target.id].position[2] = a[2];
      }
    }
    spr3DsetPositionComponent({ a, component }, util){
      const target = util.target;
      this.checkFor3dPositionData(target.id);

      a = JSON.parse(a);

      if (a) {
        //String literal for the funnies!
        if (spriteData[target.id].position[component] == undefined) throw `Component ${component} doesn't exist`;
        spriteData[target.id].position[component] = a;
      }
    }
    spr3DchangePosition({ a }, util) {
      const target = util.target;
      this.checkFor3dPositionData(target.id);

      a = JSON.parse(a);

      if (a) {
        spriteData[target.id].position[0] += a[0];
        spriteData[target.id].position[1] += a[1];
        spriteData[target.id].position[2] += a[2];
      }
    }
    spr3DchangePositionComponent({ a, component }, util){
      const target = util.target;
      this.checkFor3dPositionData(target.id);
      //String literal for the funnies!
      if (spriteData[target.id].position[component] == undefined) throw `Component ${component} doesn't exist`;
      spriteData[target.id].position[component] += a;
    }
    spr3DgetPositionComponent({component}, util) {
      const target = util.target;
      this.checkFor3dPositionData(target.id);
      //String literal for the funnies!
      if ((spriteData[target.id].position[component] == undefined)) throw `Component ${component} doesn't exist`;
      return spriteData[target.id].position[component];
    }
    spr3DgetPosition(args, util) {
      const target = util.target;
      this.checkFor3dPositionData(target.id);
      return JSON.stringify(spriteData[target.id].position);
    }
    spr3DsetSize({ a }, util) {
      const target = util.target;
      this.checkFor3dPositionData(target.id);
      spriteData[target.id].size = a;
    }
    spr3DchangeSize({ a }, util) {
      const target = util.target;
      this.checkFor3dPositionData(target.id);
      spriteData[target.id].size += a;
    }
    spr3DgetSize(args, util) {
      const target = util.target;
      this.checkFor3dPositionData(target.id);
      return spriteData[target.id].size;
    }
    spr3D(args, util) {
      const target = util.target;
      this.checkFor3dPositionData(target.id);
      const myData = JSON.parse(JSON.stringify(spriteData[target.id]));

      myData.position[0] -= camera.position[0];
      myData.position[1] -= camera.position[1];
      myData.position[2] -= camera.position[2];

      let temp = myData.position[0];

      myData.position[0] = myData.position[2] * camera.sinAndCos[0] + myData.position[0] * camera.sinAndCos[1];
      myData.position[2] = myData.position[2] * camera.sinAndCos[1] - temp * camera.sinAndCos[0];

      temp = myData.position[1];

      myData.position[1] = myData.position[2] * camera.sinAndCos[2] + myData.position[1] * camera.sinAndCos[3];
      myData.position[2] = myData.position[2] * camera.sinAndCos[3] - temp * camera.sinAndCos[2];

      temp = myData.position[0];

      myData.position[0] = myData.position[1] * camera.sinAndCos[4] + myData.position[0] * camera.sinAndCos[5];
      myData.position[1] = myData.position[1] * camera.sinAndCos[5] - temp * camera.sinAndCos[4];

      let project = fov / myData.position[2];

      if (myData.position[2] < 1) {
        target.setVisible(false);
      } else {
        target.setVisible(true);
        target.setSize(myData.size * project);
        target.setXY(myData.position[0] * project, myData.position[1] * project);
      }
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
