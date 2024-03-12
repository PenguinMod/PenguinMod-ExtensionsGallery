// Name: TimeKeeper
// ID: TimeSparkyCreations
// Description: Extra blocks to control the timer reporter.
// By: SparkyCreations

//  Version 1.0.0

(function(Scratch) {
  class PauseResumeExtension {
    constructor(runtime) {
      this.runtime = runtime;
      this.timers = {};
      this.countUpValues = {};
      this.intervals = {};
    }
    getInfo() {
      return {
        id: "TimeSparkyCreations",
        name: "TimeKeeper",
        color1: "#5CB1D6",
        blocks: [
          {
            opcode: "pauseClock",
            blockType: Scratch.BlockType.COMMAND,
            text: "Pause Clock"
          },
          {
            opcode: "resumeClock",
            blockType: Scratch.BlockType.COMMAND,
            text: "Resume Clock"
          },
          {
            opcode: "reportTimerInSeconds",
            blockType: Scratch.BlockType.REPORTER,
            text: "report timer in seconds"
          },
          {
            opcode: "reportTimerInMinutes",
            blockType: Scratch.BlockType.REPORTER,
            text: "report timer in minutes"
          },
          {
            opcode: "reportTimerInHours",
            blockType: Scratch.BlockType.REPORTER,
            text: "report timer in hours"
          },
          {
            opcode: "reportTimerInInputSeconds",
            blockType: Scratch.BlockType.REPORTER,
            text: "report timer in [SECONDS] seconds",
            arguments: {
              SECONDS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
            },
          },
          {
            opcode: "timePaused",
            blockType: Scratch.BlockType.REPORTER,
            text: "Time Paused"
          },
          {
            opcode: "createTimerNamed",
            blockType: Scratch.BlockType.COMMAND,
            text: "create timer named [TIMERNAME] count up by [COUNTUP]",
            arguments: {
              TIMERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer"
              },
              COUNTUP: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1
              },
            },
          },
          {
            opcode: "reportTimers",
            blockType: Scratch.BlockType.REPORTER,
            text: "report timers"
          },
          {
            opcode: "setTimer",
            blockType: Scratch.BlockType.COMMAND,
            text: "set timer [NAME] to [VALUE]",
            arguments: {
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer"
              },
              VALUE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
            },
          },
          {
            opcode: "deleteAllTimers",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete all timers"
          },
          {
            opcode: "deleteTimerNamed",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete timer [TIMERNAME]",
            arguments: {
              TIMERNAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Timer"
              },
            },
          },
        ],
      };
    }
  
    pauseClock() {
      if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.pause === "function") {
        Scratch.vm.runtime.ioDevices.clock.pause();
      }
    }
  
    resumeClock() {
      if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.resume === "function") {
        Scratch.vm.runtime.ioDevices.clock.resume();
      }
    }
  
    reportTimerInSeconds() {
      if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.projectTimer === "function") {
        const timer = Scratch.vm.runtime.ioDevices.clock.projectTimer();
        return timer / 1000;
      }
      return 0;
    }
  
    reportTimerInMinutes() {
      if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.projectTimer === "function") {
        const timer = Scratch.vm.runtime.ioDevices.clock.projectTimer();
        return timer / (1000 * 60);
      }
      return 0;
    }
  
    reportTimerInHours() {
      if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.projectTimer === "function") {
        const timer = Scratch.vm.runtime.ioDevices.clock.projectTimer();
        return timer / (1000 * 60 * 60);
      }
      return 0;
    }
  
    async reportTimerInInputSeconds(args) {
      const seconds = args.SECONDS;
      await new Promise(resolve => setTimeout(resolve, seconds * 1000));
      if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.projectTimer === "function") {
        return Scratch.vm.runtime.ioDevices.clock.projectTimer();
      }
      return 0;
    }
  
    timePaused() {
      if (Scratch.vm.runtime.ioDevices.clock && Scratch.vm.runtime.ioDevices.clock._projectTimer) {
        return Scratch.vm.runtime.ioDevices.clock._pausedTime
      }
      return 0;
    }
  
    createTimerNamed(args) {
      const timerName = args.TIMERNAME;
      const countUpValue = Scratch.Cast.toNumber(args.COUNTUP);
      if (!this.timers.hasOwnProperty(timerName)) {
        this.timers[timerName] = 0;
        this.countUpValues[timerName] = countUpValue;
        this.intervals[timerName] = setInterval(() => {
          this.timers[timerName] += this.countUpValues[timerName];
        }, 1);
      }
    }
  
    reportTimers() { return JSON.stringify(this.timers) }
  
    setTimer(args) {
      const timerName = args.NAME;
      const value = Scratch.Cast.toNumber(args.VALUE);
      if (this.timers.hasOwnProperty(timerName)) this.timers[timerName] = value;
    }
  
    deleteAllTimers() {
      this.timers = {};
      this.countUpValues = {};
      for (const timerName in this.intervals) {
        clearInterval(this.intervals[timerName]);
      }
      this.intervals = {};
    }
  
    deleteTimerNamed(args) {
      const timerName = args.TIMERNAME;
      delete this.timers[timerName];
      delete this.countUpValues[timerName];
      if (this.intervals.hasOwnProperty(timerName)) {
        clearInterval(this.intervals[timerName]);
        delete this.intervals[timerName];
      }
    }
  }

  Scratch.extensions.register(new PauseResumeExtension());
})(Scratch);
