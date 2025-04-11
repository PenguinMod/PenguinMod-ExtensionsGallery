// == Extra Timers ==
// By Steve0Greatness
// License: MIT

(function(Scratch) {

class Timer {
  constructor() {
    /**
     * @type {Date}
     */
    this.startTime = Date.now();

    /**
     * Indicates if the timer
     * @type {(null|Date)}
     */
    this.pausedTime = null;

    /**
     * If true, that means the timer was paused temporary by the runtime.
     * @type {boolean}
     */
    this.tempPaused = false;
  }

  get elapsed() {
    return !this.isPaused 
      ? Date.now() - this.startTime // If not paused, return the time since the start
      : this.pausedTime - this.startTime; // If paused, return time since being paused
  }

  restart() {
    this.startTime = Date.now();

    if (this.isPaused)
      this.pausedTime = this.startTime();
  }

  /**
   * @param {number} seconds Time to be added in seconds.
   */
  add(seconds) {
    this.startTime = this.startTime - seconds
  }

  /* Pausing */

  get isPaused() {
    return this.pausedTime !== null;
  }

  pause() {
    this.tempPaused = false;
    this.pause();
  }
  unpause() {
    this.tempPaused = false;
    this.startTime -= Date.now() - this.pausedTime;
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
        }
      ],
      menus: {
        TIMERS: { acceptReporters: true, items: "timersMenu" }
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
}

ext = new SteveZeroGreatnessExtraTimersExt();
Scratch.extensions.register(ext);

})(Scratch);
