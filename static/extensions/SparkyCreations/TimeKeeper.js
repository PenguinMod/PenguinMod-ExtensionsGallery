class PauseResumeExtension {
  constructor(runtime) {
    this.runtime = runtime;
    this.timers = {}; // Initialize an empty object to store timer values
    this.countUpValues = {}; // Initialize an empty object to store count-up values
    this.intervals = {}; // Initialize an empty object to store intervals
  }

  getInfo() {
    return {
      id: 'pauseresume',
      name: 'TimeKeeper',
      color1: '#5CB1D6',
      blocks: [
        {
          opcode: 'pauseClock',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Pause Clock',
          arguments: {},
        },
        {
          opcode: 'resumeClock',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Resume Clock',
          arguments: {},
        },
        {
          opcode: 'reportTimerInSeconds',
          blockType: Scratch.BlockType.REPORTER,
          text: 'report timer in seconds',
          arguments: {},
        },
        {
          opcode: 'reportTimerInMinutes',
          blockType: Scratch.BlockType.REPORTER,
          text: 'report timer in minutes',
          arguments: {},
        },
        {
          opcode: 'reportTimerInHours',
          blockType: Scratch.BlockType.REPORTER,
          text: 'report timer in hours',
          arguments: {},
        },
        {
          opcode: 'reportTimerInInputSeconds',
          blockType: Scratch.BlockType.REPORTER,
          text: 'report timer in [SECONDS] seconds',
          arguments: {
            SECONDS: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
        },
        {
          opcode: 'timePaused',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Time Paused',
          arguments: {},
        },
        {
          opcode: 'createTimerNamed',
          blockType: Scratch.BlockType.COMMAND,
          text: 'create timer named [TIMERNAME] count up by [COUNTUP]',
          arguments: {
            TIMERNAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Timer',
            },
            COUNTUP: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1,
            },
          },
        },
        {
          opcode: 'reportTimers',
          blockType: Scratch.BlockType.REPORTER,
          text: 'report timers',
          arguments: {},
        },
        {
          opcode: 'setTimer',
          blockType: Scratch.BlockType.COMMAND,
          text: 'set timer [NAME] to [VALUE]',
          arguments: {
            NAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Timer',
            },
            VALUE: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 0,
            },
          },
        },
        {
          opcode: 'deleteAllTimers',
          blockType: Scratch.BlockType.COMMAND,
          text: 'delete all timers',
          arguments: {},
        },
        {
          opcode: 'deleteTimerNamed',
          blockType: Scratch.BlockType.COMMAND,
          text: 'delete timer [TIMERNAME]',
          arguments: {
            TIMERNAME: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Timer',
            },
          },
        },
      ],
    };
  }

  async pauseClock() {
    if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.pause === 'function') {
      Scratch.vm.runtime.ioDevices.clock.pause();
    }
  }

  async resumeClock() {
    if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.resume === 'function') {
      Scratch.vm.runtime.ioDevices.clock.resume();
    }
  }

  reportTimerInSeconds() {
    if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.projectTimer === 'function') {
      const timer = Scratch.vm.runtime.ioDevices.clock.projectTimer();
      return timer / 1000; // Convert milliseconds to seconds
    }
    return 0;
  }

  reportTimerInMinutes() {
    if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.projectTimer === 'function') {
      const timer = Scratch.vm.runtime.ioDevices.clock.projectTimer();
      return timer / (1000 * 60); // Convert milliseconds to minutes
    }
    return 0;
  }

  reportTimerInHours() {
    if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.projectTimer === 'function') {
      const timer = Scratch.vm.runtime.ioDevices.clock.projectTimer();
      return timer / (1000 * 60 * 60); // Convert milliseconds to hours
    }
    return 0;
  }

  async reportTimerInInputSeconds(args) {
    const seconds = args.SECONDS;
    await new Promise(resolve => setTimeout(resolve, seconds * 1000)); // Wait for input seconds
    if (Scratch.vm.runtime.ioDevices.clock && typeof Scratch.vm.runtime.ioDevices.clock.projectTimer === 'function') {
      return Scratch.vm.runtime.ioDevices.clock.projectTimer();
    }
    return 0;
  }

  timePaused() {
    if (Scratch.vm.runtime.ioDevices.clock && Scratch.vm.runtime.ioDevices.clock._projectTimer) {
      return Scratch.vm.runtime.ioDevices.clock._projectTimer._pausedTime;
    }
    return 0;
  }

  createTimerNamed(args) {
    const timerName = args.TIMERNAME;
    const countUpValue = args.COUNTUP;
    if (!this.timers.hasOwnProperty(timerName)) {
      this.timers[timerName] = 0; // Initialize the timer value to 0 if it doesn't exist
      this.countUpValues[timerName] = countUpValue; // Set the count-up value for the timer
      // Create an interval to increment the timer value
      this.intervals[timerName] = setInterval(() => {
        this.timers[timerName] += this.countUpValues[timerName];
      }, 1); // Run every millisecond
    }
  }

  reportTimers() {
    return JSON.stringify(this.timers);
  }

  setTimer(args) {
    const timerName = args.NAME;
    const value = args.VALUE;
    if (this.timers.hasOwnProperty(timerName)) {
      this.timers[timerName] = value;
    }
  }

  deleteAllTimers() {
    this.timers = {}; // Clear all timers
    this.countUpValues = {}; // Clear all count-up values
    for (const timerName in this.intervals) {
      clearInterval(this.intervals[timerName]); // Clear all intervals
    }
    this.intervals = {}; // Clear all interval references
  }

  deleteTimerNamed(args) {
    const timerName = args.TIMERNAME;
    if (this.timers.hasOwnProperty(timerName)) {
      delete this.timers[timerName]; // Delete timer value
    }
    if (this.countUpValues.hasOwnProperty(timerName)) {
      delete this.countUpValues[timerName]; // Delete count-up value
    }
    if (this.intervals.hasOwnProperty(timerName)) {
      clearInterval(this.intervals[timerName]); // Clear interval
      delete this.intervals[timerName]; // Delete interval reference
    }
  }
}

Scratch.extensions.register(new PauseResumeExtension());
