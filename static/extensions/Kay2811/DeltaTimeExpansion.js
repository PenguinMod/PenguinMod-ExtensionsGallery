(function (Scratch) {
    const icon = 
    
    "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwLDAsNjAwLDYwMCIgaGVpZ2h0PSI2MDAiIHdpZHRoPSI2MDAiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJjb2xvci0xIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeTI9IjI1MS42MDc4MyIgeDI9IjQxNi4wOTkyMSIgeTE9IjE2Ni4xNTY5NyIgeDE9IjQxNi4wOTkyMSI+PHN0b3Agc3RvcC1jb2xvcj0iIzYwNjA2MCIgb2Zmc2V0PSIwIj48L3N0b3A+PHN0b3Agc3RvcC1jb2xvcj0iIzYxMjM2MSIgb2Zmc2V0PSIxIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48bGluZWFyR3JhZGllbnQgaWQ9ImNvbG9yLTIiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB5Mj0iMjA4LjU3MDE3IiB4Mj0iNDU1LjEyNjQzIiB5MT0iMjA4LjU3MDE3IiB4MT0iMzY5LjY3NTU3Ij48c3RvcCBzdG9wLWNvbG9yPSIjNjA2MDYwIiBvZmZzZXQ9IjAiPjwvc3RvcD48c3RvcCBzdG9wLWNvbG9yPSIjNjEyMzYxIiBvZmZzZXQ9IjEiPjwvc3RvcD48L2xpbmVhckdyYWRpZW50PjxsaW5lYXJHcmFkaWVudCBpZD0iY29sb3ItMyIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHkyPSIyMzYuNzc2NjYiIHgyPSI0MDMuMTAxMiIgeTE9IjE1MS4zMjU4IiB4MT0iNDAzLjEwMTIiPjxzdG9wIHN0b3AtY29sb3I9IiNmZmZmZmYiIG9mZnNldD0iMCI+PC9zdG9wPjxzdG9wIHN0b3AtY29sb3I9IiNmZjVjZmYiIG9mZnNldD0iMSI+PC9zdG9wPjwvbGluZWFyR3JhZGllbnQ+PGxpbmVhckdyYWRpZW50IGlkPSJjb2xvci00IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeTI9IjE5NC43MzkwMSIgeDI9IjQ0NS4xMjg0MyIgeTE9IjE5NC43MzkwMSIgeDE9IjM1OS42Nzc1NyI+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmZmZmZiIgb2Zmc2V0PSIwIj48L3N0b3A+PHN0b3Agc3RvcC1jb2xvcj0iI2ZmNWNmZiIgb2Zmc2V0PSIxIj48L3N0b3A+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoNjAsMTIwKSI+PGcgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLXdpZHRoPSIxIiBzdHJva2U9Im5vbmUiIGZpbGw9IiMyMTAwMDAiIGQ9Ik0tNjAsMTgwYzAsLTE2NS42ODU0MiAxMzQuMzE0NTgsLTMwMCAzMDAsLTMwMGMxNjUuNjg1NDMsMCAzMDAsMTM0LjMxNDU4IDMwMCwzMDBjMCwxNjUuNjg1NDMgLTEzNC4zMTQ1NywzMDAgLTMwMCwzMDBjLTE2NS42ODU0MiwwIC0zMDAsLTEzNC4zMTQ1NyAtMzAwLC0zMDB6Ij48L3BhdGg+PHBhdGggc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlPSJub25lIiBmaWxsPSIjMzAwMDAwIiBkPSJNMjcuODY4LDM5Mi4xMzJjLTI3Ljg1NzYsLTI3Ljg1OCAtNDkuOTU1NSwtNjAuOTI5IC02NS4wMzE5LC05Ny4zMjdjLTE1LjA3NjM4LC0zNi4zOTggLTIyLjgzNjExLC03NS40MDggLTIyLjgzNjEsLTExNC44MDVjMC4wMDAwMSwtMzkuMzk3IDcuNzU5NzQsLTc4LjQwNyAyMi44MzYyLC0xMTQuODA1YzE1LjA3NjQsLTM2LjM5OCAzNy4xNzQyLC02OS40NjkgNjUuMDMxOCwtOTcuMzI3MWMyNy44NTgsLTI3Ljg1NzUgNjAuOTI5LC00OS45NTU0IDk3LjMyNywtNjUuMDMxOGMzNi4zOTgsLTE1LjA3NjM5IDc1LjQwOSwtMjIuODM2MTEgMTE0LjgwNSwtMjIuODM2MWMzOS4zOTcsMC4wMDAwMSA3OC40MDcsNy43NTk3NSAxMTQuODA1LDIyLjgzNjJjMzYuMzk4LDE1LjA3NjQgNjkuNDcsMzcuMTc0MiA5Ny4zMjcsNjUuMDMxOGwtMjEyLjEzMiwyMTIuMTMyeiI+PC9wYXRoPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIgc3Ryb2tlPSJ1cmwoI2NvbG9yLTEpIiBmaWxsPSJub25lIiBkPSJNNDE2LjA5OTIxLDI1MS42MDc4M3YtODUuNDUwODYiPjwvcGF0aD48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiIHN0cm9rZT0idXJsKCNjb2xvci0yKSIgZmlsbD0ibm9uZSIgZD0iTTM2OS42NzU1NywyMDguNTcwMTdoODUuNDUwODYiPjwvcGF0aD48cGF0aCBzdHJva2UtbGluZWNhcD0icm91bmQiIHN0cm9rZS13aWR0aD0iMzIiIHN0cm9rZT0iIzYxMjM2MSIgZmlsbD0ibm9uZSIgZD0iTTE0OS40NTE5LDg0LjE4NTg2bDgzLjMxNjY1LDIwOC4yOTE2MiI+PC9wYXRoPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIgc3Ryb2tlPSIjNjA2MDYwIiBmaWxsPSJub25lIiBkPSJNMzA3Ljc1MzUzLDg0LjE4NTg1aC04My4zMTY2NU0zMDcuNzUzNTMsODQuMTg1ODVoODMuMzE2NjVNMzA3Ljc1MzUzLDI5Mi40Nzc0OHYtMjA4LjI5MTYyTTIwNi41NDI5NywyOTIuNDc3NDhoLTE2NC4xNzIxM2MtMC41ODkwNSwwIC0wLjk5MjMsLTAuNTk1NzEgLTAuNzczMTgsLTEuMTQyMjdsODIuMDg2MDYsLTIwNS4yMTU1N2MwLjI3OTExLC0wLjY5ODE5IDEuMjY3MjUsLTAuNjk4MTkgMS41NDYzNiwwbDgyLjA4NjA2LDIwNS4yMTU1N2MwLjIxOTEyLDAuNTQ2NTYgLTAuMTg0MTMsMS4xNDIyNyAtMC43NzMxOCwxLjE0MjI3eiI+PC9wYXRoPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIgc3Ryb2tlPSIjZmY1Y2ZmIiBmaWxsPSJub25lIiBkPSJNMjE2LjEwNTIyLDI3NS44MTQxNWwtODMuMzE2NjUsLTIwOC4yOTE2MiI+PC9wYXRoPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIgc3Ryb2tlPSIjZmZmZmZmIiBmaWxsPSJub25lIiBkPSJNMjkxLjA5MDIsNjcuNTIyNTJoLTgzLjMxNjY1TTI5MS4wOTAyLDY3LjUyMjUyaDgzLjMxNjY1TTI5MS4wOTAyLDI3NS44MTQxNXYtMjA4LjI5MTYyTTE4OS44Nzk2NCwyNzUuODE0MTVoLTE2NC4xNzIxM2MtMC41ODkzOCwwIC0wLjk5MjQ3LC0wLjU5NTcxIC0wLjc3MzUxLC0xLjE0MjI3bDgyLjA4NjQsLTIwNS4yMTU1N2MwLjI3OTExLC0wLjY5ODE5IDEuMjY3MjUsLTAuNjk4MTkgMS41NDYzNiwwbDgyLjA4NjA2LDIwNS4yMTU1N2MwLjIxOTEyLDAuNTQ2NTYgLTAuMTg0MTMsMS4xNDIyNyAtMC43NzMxOCwxLjE0MjI3eiI+PC9wYXRoPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIgc3Ryb2tlPSJ1cmwoI2NvbG9yLTMpIiBmaWxsPSJub25lIiBkPSJNNDAzLjEwMTIsMjM2Ljc3NjY2di04NS40NTA4NiI+PC9wYXRoPjxwYXRoIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIzMiIgc3Ryb2tlPSJ1cmwoI2NvbG9yLTQpIiBmaWxsPSJub25lIiBkPSJNMzU5LjY3NzU3LDE5NC43MzkwMWg4NS40NTA4NiI+PC9wYXRoPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjMwMC4wMDAwMDAwMDAwMDk2NjozMDAuMDAwMDAwMDAwMDA5NjYtLT4=";

if (!Scratch.extensions.unsandboxed) {
    throw new Error("DeltaTime Expansion must be run unsandboxed");
  }

  const vm = Scratch.vm;

  let deltaTime = 0;
  let previousTime = 0;

  vm.runtime.on("BEFORE_EXECUTE", () => {
    const now = performance.now();

    if (previousTime === 0) {
      deltaTime = 1 / vm.runtime.frameLoop.framerate;
    } else {
      deltaTime = (now - previousTime) / 1000;
    }

    previousTime = now;
  });

  class DtE {
    getInfo() {
      return {
        id: "dtplus",
        name: Scratch.translate("DeltaTime Expansion"),
        color1: "#333333",
        color2: "#444444",
        color3: "#ffffff",
        menuIconURI: icon,
        blocks: [
          {
            opcode: "dt",
            blockType: Scratch.BlockType.REPORTER,
            text: "deltaTime",
            disableMonitor: false
          },
          {
            opcode: "fps",
            blockType: Scratch.BlockType.REPORTER,
            text: "FPS",
            disableMonitor: false
          },
          {
            opcode: "xdt",
            blockType: Scratch.BlockType.REPORTER,
            text: "[VALUE] Frame Multiplier [FM] [OPERATION] deltaTime",
            arguments:{
                VALUE:{
                    type: Scratch.ArgumentType.NUMBER,
                    defaultValue: 10
                },
                OPERATION:{
                    type: Scratch.ArgumentType.STRING,
                    menu: "XDTO"
                },
                FM:{
                  type: Scratch.ArgumentType.NUMBER,
                  defaultValue: 30
                }
            },
            disableMonitor: true
          },
          {
            opcode: "perfectfps",
            blockType: Scratch.BlockType.REPORTER,
            text: "Perfect FPS",
            disableMonitor: false
          }
        ],
        menus:{
            XDTO:{
                acceptReporters: false,
                items: ['*', '/', '^', '+', '-']
            }
        }
      };
    }

    dt() {
      return deltaTime;
    }

    fps() {
      return +(1 / deltaTime).toFixed(2);
    }

    xdt(args) {
        if (args.OPERATION === '*') {
            return args.VALUE * args.FM * deltaTime;
        } else if (args.OPERATION === '/') {
            return args.VALUE * args.FM / deltaTime;
        } else if (args.OPERATION === '^') {
            return (args.VALUE * args.FM) ** deltaTime;
        } else if (args.OPERATION === '+') {
            return args.VALUE * args.FM + deltaTime;
        } else {
            return args.VALUE * args.FM - deltaTime;
        }
    }

    perfectfps() {
        return +(1 / deltaTime).toFixed(0);
    }
  }

  Scratch.extensions.register(new DtE());
})(Scratch);
