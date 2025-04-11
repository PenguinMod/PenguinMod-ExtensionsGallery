// == Extra Timers ==
// By Steve0Greatness
// License: MIT

(function(Scratch) {

class Timer {
  constructor() {
    /**
     * @type {number}
     */
    this.startTime = Date.now();

    /**
     * Indicates if the timer
     * @type {(null|number)}
     */
    this.pausedTime = null;

    /**
     * If true, that means the timer was paused temporary by the runtime.
     * @type {boolean}
     */
    this.tempPaused = false;
  }

  /**
   * @returns {number}
   */
  get elapsed() {
    return !this.isPaused 
        ? Date.now() - this.startTime       // If not paused, return time since starting
        : this.pausedTime - this.startTime; // If paused, return time since being paused
  }

  restart() {
    this.startTime = Date.now();

    if (this.isPaused)
      this.pausedTime = this.startTime;
  }

  /**
   * @param {number} seconds Time to be added in seconds.
   */
  add(seconds) {
    this.startTime = this.startTime - seconds * 1000;
  }

  /* Pausing */

  /**
   * @returns {boolean}
   */
  get isPaused() {
    return this.pausedTime !== null;
  }

  pause() {
    this.tempPaused = false;
    this.pausedTime = Date.now();
  }
  unpause() {
    if (!this.isPaused)
      return;
    this.tempPaused = false;
    this.startTime += Date.now() - this.pausedTime;
    this.pausedTime = null;
  }

  tempPause() {
    if (this.isPaused)
      return;
    this.pause();
    this.tempPaused = true;
  }
  unpauseFromTemp() {
    if (!this.tempPaused)
      return;
    this.unpause();
  }
}

class SteveZeroGreatnessExtraTimersExt {
  constructor() {
    this.runtime = Scratch.vm.runtime;

    /**
     * @type {Object.<string, Timer>}
     */
    this.timers = {};

    this.runtime.addListener("RUNTIME_PAUSED", () => {
      Object.values(this.timers).forEach(timer => timer.tempPause());
    });
    this.runtime.addListener("RUNTIME_UNPAUSED", () => {
      Object.values(this.timers).forEach(timer => timer.unpauseFromTemp());
    });
  }
  getInfo() {
    return {
      id: "steve0greatnesstimers",
      name: "Extra Timers",
      blocks: [
        {
          func: "createTimerModal",
          blockType: Scratch.BlockType.BUTTON,
          text: "create timer"
        },
        {
          func: "removeTimerModal",
          blockType: Scratch.BlockType.BUTTON,
          text: "remove timer"
        },
        {
          opcode: "pause",
          blockType: Scratch.BlockType.COMMAND,
          text: "pause [TIMER]",
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          }
        },
        {
          opcode: "unpause",
          blockType: Scratch.BlockType.COMMAND,
          text: "unpause [TIMER]",
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          }
        },
        {
          opcode: "addSeconds",
          blockType: Scratch.BlockType.COMMAND,
          text: "add [SECONDS] secs to [TIMER]",
          arguments: {
            SECONDS: {
              type: Scratch.ArgumentType.NUMBER
            },
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          }
        },
        {
          opcode: "isPaused",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "is [TIMER] paused?",
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          }
        },
        {
          opcode: "elapsed",
          blockType: Scratch.BlockType.REPORTER,
          text: "time elapsed for [TIMER] in [UNITS]",
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            },
            UNITS: {
              type: Scratch.ArgumentType.STRING,
              menu: "UNITS"
            }
          }
        },
        {
          opcode: "restart",
          blockType: Scratch.BlockType.COMMAND,
          text: "restart [TIMER]",
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          }
        },
      ],
      menus: {
        TIMERS: { acceptReporters: true, items: "timersMenu" },
        UNITS: {
          acceptReporters: false,
          items: [
            "seconds",
            "milliseconds",
            "minutes"
          ]
        }
      }
    }
  }

  // Util
  _exists(timer) {
    return Object.keys(this.timers).includes(timer);
  }

  // Menus
  timersMenu() {
    let timers = Object.keys(this.timers);
    return timers.length > 0 ? timers : [ "no timers" ];
  }

  // Buttons
  createTimerModal() {
    ScratchBlocks.prompt(
      "Timer name",
      "",
      (name) => {
        this.timers[name] = new Timer();
      },
      "Create a Timer",
      "broadcast_msg"
    );
  }
  removeTimerModal() {
    ScratchBlocks.prompt(
      "Timer name",
      "",
      (name) => {
        delete this.timers[name];
      },
      "Delete a Timer",
      "broadcast_msg"
    );
  }


  // Blocks
  addSeconds(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return;
    this.timers[Scratch.Cast.toString(args.TIMER)].add(Scratch.Cast.toNumber(args.SECONDS));
  }

  pause(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return;
    this.timers[Scratch.Cast.toString(args.TIMER)].pause();
  }

  unpause(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return;
    this.timers[Scratch.Cast.toString(args.TIMER)].unpause();
  }

  isPaused(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return;
    return this.timers[Scratch.Cast.toString(args.TIMER)].isPaused;
  }

  elapsed(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return;
    let multiplier = 1;
    switch (Scratch.Cast.toString(args.UNITS)) {
      case "seconds":
        multiplier = 0.001;
        break;
      case "minutes":
        multiplier = 0.06;
        break;
      default:
        multiplier = 1;
        break;
    }
    return this.timers[Scratch.Cast.toString(args.TIMER)].elapsed * multiplier;
  }

  restart(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return;
    return this.timers[Scratch.Cast.toString(args.TIMER)].restart();
  }

  listTimers() {
    let timers = Object.keys(this.timers);
    return timers.length > 0
      ? "[\"" + timers.join("\",\"") + "\"]"
      : "[]";
  }
}

ext = new SteveZeroGreatnessExtraTimersExt();
Scratch.extensions.register(ext);

})(Scratch);
