/**
 * @overview
 *
 * Defines the "Extra Timers" extension for PenguinMod.
 *
 * @license MIT
 * @author  Steve0Greatness
 * @version 1.0.1
 */

(function(Scratch) {

const selfid = "steve0greatnesstimers";

class Timer {
  constructor(name) {
    /**
     * The start time of the timer.
     * @type {number}
     */
    this.startTime = Date.now();

    /**
     * Indicates if, and when, the timer was paused
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
   * Returns the time since the start time, or the time between the start time and the paused time.
   * Time is returned in milliseconds.
   * @returns {number}
   */
  get elapsed() {
    return !this.isPaused 
        ? Date.now() - this.startTime       // If not paused, return time since starting
        : this.pausedTime - this.startTime; // If paused, return time since being paused
  }

  /**
   * Starts over a timer, also resets the pause time if it's not null.
   */
  restart() {
    this.startTime = Date.now();

    if (this.isPaused)
      this.pausedTime = this.startTime;
  }

  add(seconds) {
    this.startTime = this.startTime - seconds * 1000;
  }

  /* Pausing */

  /**
   * Checks if the timer is paused.
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

  /* Internal! Do not use outside of internal usage. */

  /**
   * @priv
   */
  _tempPause() {
    if (this.isPaused)
      return;
    this.pause();
    this.tempPaused = true;
  }
  /**
   * @priv
   */
  _unpauseFromTemp() {
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
    this.timers = {
      "timer": new Timer(),
    };

    this.runtime.addListener("RUNTIME_PAUSED", () => {
      Object.values(this.timers).forEach(timer => timer._tempPause());
    });
    this.runtime.addListener("RUNTIME_UNPAUSED", () => {
      Object.values(this.timers).forEach(timer => timer._unpauseFromTemp());
    });

    this.runtime.registerSerializer(selfid, () => this.serialize(), (data) => this.deserialize(data));
  }
  getInfo() {
    return {
      id: selfid,
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
          text: "remove timer",
          hideFromPalette: !this._has_timers()
        },
        {
          opcode: "listTimers",
          blockType: Scratch.BlockType.REPORTER,
          text: "timers in existance",
        },
        {
          opcode: "unpause",
          blockType: Scratch.BlockType.COMMAND,
          text: "start [TIMER]",
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
          hideFromPalette: !this._has_timers()
        },
        /*{ // Temp. disabled
          blockType: Scratch.BlockType.XML,
          xml: this._compute_sb_xml()
        },
        {
          opcode: "get",
          blockType: Scratch.BlockType.REPORTER,
          text: "[TIMER]",
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING
            }
          },
          hideFromPalette: true
        },*/
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
          },
          hideFromPalette: !this._has_timers()
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
          },
          hideFromPalette: !this._has_timers()
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
          },
          hideFromPalette: !this._has_timers()
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
          },
          hideFromPalette: !this._has_timers()
        },
        {
          opcode: "stop",
          blockType: Scratch.BlockType.COMMAND,
          text: "stop [TIMER]",
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
          hideFromPalette: !this._has_timers()
        },
        {
          opcode: "addSeconds",
          blockType: Scratch.BlockType.COMMAND,
          text: "add [SECONDS] secs to [TIMER]",
          arguments: {
            SECONDS: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
          hideFromPalette: !this._has_timers()
        },
        {
          opcode: "whengt",
          blockType: Scratch.BlockType.HAT,
          text: "when [TIMER] > [SECONDS] seconds",
          isEdgeActivated: true,
          restartExistingThreads: false,
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            },
            SECONDS: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            }
          },
          hideFromPalette: !this._has_timers()
        }
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

  _has_timers() {
    return Object.keys(this.timers).length > 0
  }

  _compute_sb_xml() {
    let XML = Object.keys(this.timers).map(timer => {
      return `<block type="${selfid}_get">
                <value name="TIMER">
                  <shadow type="text">
                    <field name="TEXT">${timer}</field>
                  </shadow>
                </value>
              </block>`
    }).join("");
    return XML
  }

  deserialize(data) {
    if (data[selfid] === undefined)
      return;
    for (let timer in data[selfid].timers) {
      this._newTimer(timer);
    }
  }
  serialize() {
    return {
      [selfid]: {
        timers: Object.keys(this.timers)
      }
    };
  }

  _newTimer(name) {
    this.timers[name] = new Timer();
  }
  _delTimer(name) {
    delete this.timers[name];
  }

  get _hasTimers() {
    return Object.keys(this.timers).length == 0;
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
        this._newTimer(name); 
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
        this._delTimer(name);
        Scratch.vm.extensionManager.refreshBlocks();
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

  get(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return 0;
    return this.timers[Scratch.Cast.toString(args.TIMER)].elapsed * 0.001;
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
    this.timers[Scratch.Cast.toString(args.TIMER)].restart();
  }

  stop(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return;
    this.timers[Scratch.Cast.toString(args.TIMER)].pause();
    this.timers[Scratch.Cast.toString(args.TIMER)].restart();
  }

  listTimers() {
    let timers = Object.keys(this.timers);
    return timers.length > 0
      ? "[\"" + timers.join("\",\"") + "\"]"
      : "[]";
  }

  whengt(args) {
    if (!this._exists(Scratch.Cast.toString(args.TIMER)))
      return false;
    let seconds = Scratch.Cast.toNumber(args.SECONDS);
    let elapsed_seconds = this.timers[Scratch.Cast.toString(args.TIMER)].elapsed * 0.001;
    console.log(elapsed_seconds, seconds, elapsed_seconds > seconds);
    return elapsed_seconds > seconds;
  }
}

ext = new SteveZeroGreatnessExtraTimersExt();
Scratch.extensions.register(ext);

})(Scratch);
