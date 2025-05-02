/**
 * @overview
 *
 * Allows for the creation and management of additional timers in PenguinMod.
 *
 * @license MIT
 * @author  Steve0Greatness
 * @version 1.1.4
 */

(function(Scratch) {

Scratch.translate.setup({});

const selfid = "steve0greatnesstimers";

  
function uid_clone() {
  const soup = "!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 20;

  const max = num => (num & 127) >= soup.length ? (num & 127) - soup.length : (num & 127);
  
  return [...crypto.getRandomValues(new Uint8Array(length))]
    .map((e) => soup.charAt(max(e)))
    .join("");
}

function xml_escape(unsafe) {
  return unsafe.replace(/[<>&'"]/g, c => {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '\'': return '&apos;';
      case '"': return '&quot;';
    }
  });
}

class Timer {
  static customId = "externaltimer";

  constructor(runtime, id, name) {
    this.runtime = runtime;

    this.id   = id ?? uid_clone();
    this.name = name;

    this.attached_getter_id = uid_clone();

    this.customId = Timer.customId;
    this.type = Timer.customId;

    runtime.on("RUNTIME_PAUSED", () => {
      this._tempPause();
    });
    runtime.on("RUNTIME_UNPAUSED", () => {
      this._unpauseFromTemp();
    });

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

  // Scratch Type Methods
  
  serialize(obj = this) {
    return [obj.id, obj.name, obj.toString()];
  }

  toString() {
    return this.elapsed.toString();
  }

  toReporterContent() {
    const element = document.createElement("span");
    element.innerText = this.toString();
    return element;
  }

  toXML(isLocal) {
    return `<variable type="${this.type}" id="${this.id}" islocal="${isLocal}" iscloud="false">${xml_escape(this.name)}</variable>`;
  }

  toToolboxDefault(field_name) {
    return `<field name="${field_name}" id="${this.id}" variabletype="${this.type}">${xml_escape(this.name)}</field>`;
  }

  // Timer Methods

  /**
   * Returns the time since the start time, or the time between the start time and the paused time.
   * Time is returned in milliseconds.
   * @returns {number}
   */
  get elapsed() {
    return !this.is_paused 
        ? Date.now() - this.startTime       // If not paused, return time since starting
        : this.pausedTime - this.startTime; // If paused, return time since being paused
  }

  /**
   * Starts over a timer, also resets the pause time if it's not null.
   */
  restart() {
    this.startTime = Date.now();

    if (this.is_paused)
      this.pausedTime = this.startTime;
  }

  add(time) {
    this.startTime = this.startTime - time;
  }

  /* Pausing */

  /**
   * Checks if the timer is paused.
   * @returns {boolean}
   */
  get is_paused() {
    return this.pausedTime !== null;
  }

  pause() {
    this.tempPaused = false;
    this.pausedTime = Date.now();
  }
  unpause() {
    if (!this.is_paused)
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
    if (this.is_paused)
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

    this.runtime.registerVariable(Timer.customId, Timer);
    this.runtime.registerSerializer(
      Timer.customId,
      timer => timer.id,
      (variableId, target) => {
        let variable = target.variables[variableId];
        if (!variable) {
          for (const target of this.runtime.targets) {
            if (!target.variables[variableId]) { continue; }
            variable = target.variables[variableId];
            break;
          }
        }
        return variable;
      }
    );

    this.runtime.on("variableCreate", (type, id) => {
      if (type !== Timer.customId) return;

      this.runtime.vm.extensionManager.refreshDynamicCategorys();
    });
    this.runtime.on("variableChange", (type, adf) => {
      if (type !== Timer.customId) return;

      this.runtime.vm.extensionManager.refreshDynamicCategorys();
    });
    this.runtime.on("variableDelete", (type, adf) => {
      if (type !== Timer.customId) return;

      this.runtime.vm.extensionManager.refreshDynamicCategorys();
      //this.runtime.monitorBlocks
    });
  }

  order_blocks(blocks) {
    const button = blocks[0];
    const getter = blocks[1];
    const output = [button];
    delete blocks[0];
    delete blocks[1];

    const filterTimers = ({variables}) => {
      return Object.values(variables)
               .filter(vari => vari.type === Timer.customId)
               .map(vari => [vari.toToolboxDefault("TIMER"), vari.attached_getter_id])
               .map(([xml, g_id]) => getter.replace(
                  "></block>",
                  ` id="${xml_escape(g_id)}">${xml}</block>`
                ))
    };

    const stage_target = this.runtime.getTargetForStage();
    const local_target = this.runtime.vm.editingTarget;
    const is_sprite    = local_target.id !== stage_target.id;
    const stage        = filterTimers(stage_target);
    const local        = filterTimers(local_target);
    
    if (stage.length) {
      output.push(`<label text="${Scratch.translate("Timers for all sprites")}"></label>`);
      output.push(...stage);
    }
    if (local.length && is_sprite) {
      output.push(`<label text="${Scratch.translate("Timers for this sprites")}"></label>`);
      output.push(...local);
    }
    if (stage.length || local.length) {
      output.push(...blocks);
    }

    return output;
  }

  getInfo() {
    return {
      id: selfid,
      name: "Extra Timers",
      isDynamic: true,
      orderBlocks: this.order_blocks.bind(this),
      color1: "#1166CC",
      blocks: [
        {
          opcode: "createTimerModal",
          blockType: Scratch.BlockType.BUTTON,
          text: Scratch.translate("create timer")
        },
        {
          opcode: "getter",
          blockType: Scratch.BlockType.REPORTER,
          text: "[TIMER]",
          arguments: {
            "TIMER": {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
        },
        {
          opcode: "elapsed",
          blockType: Scratch.BlockType.REPORTER,
          text: Scratch.translate("time elapsed for [TIMER] in [UNITS]"),
          disableMonitor: true,
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            },
            UNITS: {
              type: Scratch.ArgumentType.NUMBER,
              menu: "UNITS"
            }
          },
        },
        {
          opcode: "pause",
          blockType: Scratch.BlockType.COMMAND,
          text: Scratch.translate("pause [TIMER]"),
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
        },
        {
          opcode: "toggle",
          blockType: Scratch.BlockType.COMMAND,
          text: Scratch.translate("toggle [TIMER]"),
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
        },
        {
          opcode: "unpause",
          blockType: Scratch.BlockType.COMMAND,
          text: Scratch.translate("start [TIMER]"),
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
        },
        {
          opcode: "is_paused",
          blockType: Scratch.BlockType.BOOLEAN,
          text: Scratch.translate("is [TIMER] paused?"),
          disableMonitor: true,
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
        },
        {
          opcode: "restart",
          blockType: Scratch.BlockType.COMMAND,
          text: Scratch.translate("restart [TIMER]"),
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
        },
        {
          opcode: "stop",
          blockType: Scratch.BlockType.COMMAND,
          text: Scratch.translate("stop [TIMER]"),
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
        },
        {
          opcode: "add",
          blockType: Scratch.BlockType.COMMAND,
          text: Scratch.translate("add [TIME] [UNITS] to [TIMER]"),
          arguments: {
            TIME: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            UNITS: {
              type: Scratch.ArgumentType.NUMBER,
              menu: "UNITS2"
            },
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            }
          },
        },
        {
          opcode: "whengt",
          blockType: Scratch.BlockType.HAT,
          text: Scratch.translate("when [TIMER] > [TIME] [UNITS]"),
          isEdgeActivated: true,
          restartExistingThreads: false,
          arguments: {
            TIMER: {
              type: Scratch.ArgumentType.STRING,
              menu: "TIMERS"
            },
            TIME: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 1
            },
            UNITS: {
              type: Scratch.ArgumentType.NUMBER,
              menu: "UNITS"
            }
          },
        }
      ],
      menus: {
        TIMERS: {
          variableType: Timer.customId
        },
        UNITS: {
          acceptReporters: false,
          items: [
            {
              text: Scratch.translate("seconds"),
              value: "0.001"
            },
            {
              text: Scratch.translate("milliseconds"),
              value: "1"
            },
            {
              text: Scratch.translate("minutes"),
              value: "0.000016666666666666667"
            },
          ]
        },
        UNITS2: {
          acceptReporters: false,
          items: [
            { text: Scratch.translate("seconds"),
              value: "1000" },
            {
              text: Scratch.translate("milliseconds"),
              value: "1"
            },
            {
              text: Scratch.translate("minutes"),
              value: "60000"
            },
          ]
        }
      }
    }
  }

  // Util

  get_or_create(target, id, name) {
    const stage    = this.runtime.getTargetForStage();
    const variable = target.variables[id] ?? stage.variables[id];
    
    if (!variable) {
      return target.createVariable(id, name, Timer.customId);
    }
    if (variable.type != Timer.customId) {
      throw "Bad variable type '" + variable.type +  "'"
    }
    
    return variable;
  }

  // Buttons
  createTimerModal() {
    ScratchBlocks.prompt(
      "Timer name:", "", 
      (name, more_vars, {scope}) => {
        name = ScratchBlocks.Variables.validateScalarVarOrListName_(
          name, ScratchBlocks.getMainWorkspace(), more_vars,
          false, Timer.customId, "\"%1\" already exists."
        );
        if (!name) return;
        
        const target = scope === "global"
          ? this.runtime.getTargetForStage() // Global
          : this.runtime.vm.editingTarget;   // Local
        target.createVariable(uid_clone(), name, Timer.customId);
        this.runtime.vm.emitWorkspaceUpdate();
      },
      "New Timer",
      Timer.customId
    );
  }

  // Blocks
  add({ TIMER: timer, TIME: timing, UNITS: units }, util) {
    let multi = Scratch.Cast.toNumber(units)
    let time  = Scratch.Cast.toNumber(timing)
    this.get_or_create(util.target, timer.id, timer.name).add(time * multi)
  }

  getter({ TIMER: timer }, util) {
    return this.get_or_create(util.target, timer.id, timer.name) * 0.001;
  }

  pause({ TIMER: timer }, util) {
    this.get_or_create(util.target, timer.id, timer.name).pause();
  }

  unpause({ TIMER: timer }, util) {
    this.get_or_create(util.target, timer.id, timer.name).unpause();
  }

  toggle({ TIMER: timer }, util) {
    const timer_var = this.get_or_create(util.target, timer.id, timer.name);
    if (timer_var.is_paused)
      timer_var.unpause();
    else
      timer_var.pause();
  }

  is_paused({ TIMER: timer }, util) {
    return this.get_or_create(util.target, timer.id, timer.name).is_paused;
  }

  elapsed({ TIMER: timer, UNITS: units }, util) {
    let multiplier = Scratch.Cast.toNumber(units);
    return this.get_or_create(util.target, timer.id, timer.name) * multiplier;
  }

  restart({ TIMER: timer }, util) {
    this.get_or_create(util.target, timer.id, timer.name).restart();
  }

  stop({ TIMER: timer }, util) {
    this.get_or_create(util.target, timer.id, timer.name).pause();
    this.get_or_create(util.target, timer.id, timer.name).restart();
  }

  whengt({ TIMER: timer, TIME: timing, UNITS: units }, util) {
    let multi = Scratch.Cast.toNumber(units);
    let time  = Scratch.Cast.toNumber(timing);

    let elapsed_seconds = this.get_or_create(util.target, timer.id, timer.name).elapsed * multi;
    return elapsed_seconds > time;
  }
}

ext = new SteveZeroGreatnessExtraTimersExt();
Scratch.extensions.register(ext);

})(Scratch);
