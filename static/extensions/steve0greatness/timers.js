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

const color1 = "#1166CC";

const stylesheet = document.createElement("style");
stylesheet.textContent = `
div[data-opcode^="${selfid}_"] :is(div[class^="monitor_value_"], div[class^="monitor_large-value_"]) {
  background-color: ${color1} !important;
}
`;
document.head.appendChild(stylesheet);


function uid_clone() {
  const soup = "!#%()*+,-./:;=?@[]^_`{|}~ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const length = 20;

  const max = num => (num * soup.length) >> 8;
  
  return [...crypto.getRandomValues(new Uint8Array(length))]
    .map((e) => soup.charAt(max(e)))
    .join("");
}

function xml_escape(unsafe) {
    if (typeof unsafe !== 'string') {
        if (Array.isArray(unsafe)) {
            // This happens when we have hacked blocks from 2.0
            // See #1030
            unsafe = String(unsafe);
        } else {
            console.log.error(`Unexptected type ${typeof unsafe} in xmlEscape at: ${new Error().stack}`);
            return unsafe;
        }
    }

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
    if (this.is_paused)
      return;

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
      output.push(`<label text="${Scratch.translate("Timers for this sprite")}"></label>`);
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
      color1,
      menuIconURI: menu_icon(),
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
          }
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
              menu: "UNITS_GET"
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
              menu: "UNITS_SET"
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
              menu: "UNITS_GET"
            }
          },
        }
      ],
      menus: {
        TIMERS: {
          variableType: Timer.customId
        },
        UNITS_GET: {
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
        UNITS_SET: {
          acceptReporters: false,
          items: [
            {
              text: Scratch.translate("seconds"),
              value: "1000"
            },
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

// Made this a function so I could put it at the bottom :P
function menu_icon() {
  return "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iNDAiCiAgIGhlaWdodD0iNDAiCiAgIHZpZXdCb3g9IjAgMCAxMC41ODMzMzMgMTAuNTgzMzMzIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmcxIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjMgKDBlMTUwZWQ2YzQsIDIwMjMtMDctMjEpIgogICBzb2RpcG9kaTpkb2NuYW1lPSJ0aW1lcnMtbWVudUljb24uc3ZnIgogICB4bWxuczppbmtzY2FwZT0iaHR0cDovL3d3dy5pbmtzY2FwZS5vcmcvbmFtZXNwYWNlcy9pbmtzY2FwZSIKICAgeG1sbnM6c29kaXBvZGk9Imh0dHA6Ly9zb2RpcG9kaS5zb3VyY2Vmb3JnZS5uZXQvRFREL3NvZGlwb2RpLTAuZHRkIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MSIKICAgICBwYWdlY29sb3I9IiNmZmZmZmYiCiAgICAgYm9yZGVyY29sb3I9IiMwMDAwMDAiCiAgICAgYm9yZGVyb3BhY2l0eT0iMC4yNSIKICAgICBpbmtzY2FwZTpzaG93cGFnZXNoYWRvdz0iMiIKICAgICBpbmtzY2FwZTpwYWdlb3BhY2l0eT0iMC4wIgogICAgIGlua3NjYXBlOnBhZ2VjaGVja2VyYm9hcmQ9IjAiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIgogICAgIGlua3NjYXBlOmRvY3VtZW50LXVuaXRzPSJtbSIKICAgICBpbmtzY2FwZTp6b29tPSIxNy4zNTU3ODEiCiAgICAgaW5rc2NhcGU6Y3g9IjE1LjcwMDgyIgogICAgIGlua3NjYXBlOmN5PSIxOC4xNzgzODEiCiAgICAgaW5rc2NhcGU6d2luZG93LXdpZHRoPSIxOTIwIgogICAgIGlua3NjYXBlOndpbmRvdy1oZWlnaHQ9IjEwNTciCiAgICAgaW5rc2NhcGU6d2luZG93LXg9Ii04IgogICAgIGlua3NjYXBlOndpbmRvdy15PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9ImxheWVyMSIgLz4KICA8ZGVmcwogICAgIGlkPSJkZWZzMSIgLz4KICA8ZwogICAgIGlua3NjYXBlOmxhYmVsPSJMYXllciAxIgogICAgIGlua3NjYXBlOmdyb3VwbW9kZT0ibGF5ZXIiCiAgICAgaWQ9ImxheWVyMSI+CiAgICA8Y2lyY2xlCiAgICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7b3BhY2l0eToxO2ZpbGw6IzExNjZjYztmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzBmNWJiODtzdHJva2Utd2lkdGg6MC4yNTgxMztzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1vcGFjaXR5OjE7cGFpbnQtb3JkZXI6c3Ryb2tlIGZpbGwgbWFya2VycyIKICAgICAgIGlkPSJwYXRoMiIKICAgICAgIGN4PSI1LjI5MTY2NjUiCiAgICAgICBjeT0iNS4yOTE2NjciCiAgICAgICByPSI1LjE2MjYwMTkiIC8+CiAgICA8ZwogICAgICAgaWQ9ImcyIgogICAgICAgaW5rc2NhcGU6bGFiZWw9IjdzZWctdGVtcGwiCiAgICAgICBzdHlsZT0iZGlzcGxheTppbmxpbmU7c3Ryb2tlOiMwZjViYjg7c3Ryb2tlLW9wYWNpdHk6MC41NDkwMiIKICAgICAgIHRyYW5zZm9ybT0ibWF0cml4KDAuMDQ4MjMxMzQsMCwwLDAuMDQ4MjMxMzQsLTQuMTEzNDQ0NiwtMi42NjY1MDQ0KSI+CiAgICAgIDxwYXRoCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwZjViYjg7c3Ryb2tlLXdpZHRoOjA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1vcGFjaXR5OjAuNTQ5MDI7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgICAgZD0ibSAxNzAsMTU3IGggNTAgbCAxNiw4IC0xNiw4IGggLTUwIGwgLTE2LC04IgogICAgICAgICBpZD0icGF0aDEiCiAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjIgogICAgICAgICBpbmtzY2FwZTpsYWJlbD0ic2VnMSIgLz4KICAgICAgPHBhdGgKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzBmNWJiODtzdHJva2Utd2lkdGg6MDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW9wYWNpdHk6MC41NDkwMjtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgICBkPSJtIDE3MCw2OSBoIDUwIGwgMTYsOCAtMTYsOCBoIC01MCBsIC0xNiwtOCIKICAgICAgICAgaWQ9InBhdGgxLTIiCiAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjIgogICAgICAgICBpbmtzY2FwZTpsYWJlbD0ic2VnNCIgLz4KICAgICAgPHBhdGgKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzBmNWJiODtzdHJva2Utd2lkdGg6MDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW9wYWNpdHk6MC41NDkwMjtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgICBkPSJtIDE2Miw5NiB2IDUwIGwgLTgsMTYgLTgsLTE2IFYgOTYgbCA4LC0xNS45OTk5OTkiCiAgICAgICAgIGlkPSJwYXRoMS0xIgogICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjYyIKICAgICAgICAgaW5rc2NhcGU6bGFiZWw9InNlZzIiIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIHN0eWxlPSJmaWxsOiMyYzY4YjE7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwZjViYjg7c3Ryb2tlLXdpZHRoOjA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1vcGFjaXR5OjAuNTQ5MDI7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgICAgZD0ibSAyNDQsOTYuMDAwMDAxIHYgNTAuMDAwMDA5IGwgLTgsMTYgLTgsLTE2IFYgOTYuMDAwMDAxIGwgOCwtMTYiCiAgICAgICAgIGlkPSJwYXRoMS0xLTkiCiAgICAgICAgIHNvZGlwb2RpOm5vZGV0eXBlcz0iY2NjY2NjIgogICAgICAgICBpbmtzY2FwZTpsYWJlbD0ic2VnMyIgLz4KICAgICAgPHBhdGgKICAgICAgICAgc3R5bGU9ImZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6IzBmNWJiODtzdHJva2Utd2lkdGg6MDtzdHJva2UtbGluZWNhcDpyb3VuZDtzdHJva2UtbGluZWpvaW46cm91bmQ7c3Ryb2tlLW9wYWNpdHk6MC41NDkwMjtwYWludC1vcmRlcjptYXJrZXJzIHN0cm9rZSBmaWxsIgogICAgICAgICBkPSJtIDE3MCwyNDUgaCA1MCBsIDE2LDggLTE2LDggaCAtNTAgbCAtMTYsLTgiCiAgICAgICAgIGlkPSJwYXRoMS04IgogICAgICAgICBzb2RpcG9kaTpub2RldHlwZXM9ImNjY2NjYyIKICAgICAgICAgaW5rc2NhcGU6bGFiZWw9InNlZzciIC8+CiAgICAgIDxwYXRoCiAgICAgICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiMwZjViYjg7c3Ryb2tlLXdpZHRoOjA7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1vcGFjaXR5OjAuNTQ5MDI7cGFpbnQtb3JkZXI6bWFya2VycyBzdHJva2UgZmlsbCIKICAgICAgICAgZD0ibSAxNjIsMTg0IHYgNTAgbCAtOCwxNiAtOCwtMTYgdiAtNTAgbCA4LC0xNiIKICAgICAgICAgaWQ9InBhdGgxLTEtMCIKICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2MiCiAgICAgICAgIGlua3NjYXBlOmxhYmVsPSJzZWc1IiAvPgogICAgICA8cGF0aAogICAgICAgICBzdHlsZT0iZmlsbDojZmZmZmZmO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTojMGY1YmI4O3N0cm9rZS13aWR0aDowO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utb3BhY2l0eTowLjU0OTAyO3BhaW50LW9yZGVyOm1hcmtlcnMgc3Ryb2tlIGZpbGwiCiAgICAgICAgIGQ9Im0gMjQ0LDE4NCB2IDUwLjAwMDAxIGwgLTgsMTYgLTgsLTE2IFYgMTg0IGwgOCwtMTYiCiAgICAgICAgIGlkPSJwYXRoMS0xLTktMiIKICAgICAgICAgc29kaXBvZGk6bm9kZXR5cGVzPSJjY2NjY2MiCiAgICAgICAgIGlua3NjYXBlOmxhYmVsPSJzZWc2IiAvPgogICAgPC9nPgogIDwvZz4KPC9zdmc+Cg==";
}

})(Scratch);
