/**!
 * Extension Exposer
 * @author TheShovel https://github.com/TheShovel/
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @author Faunksys https://github.com/faunks/
 * @version 2.2
 * @copyright MIT License
 * Do not remove this comment
 */
(function(Scratch) {
  'use strict';
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Extension Exposer" must be ran unsandboxed.`);
  }
  const { Cast, BlockType, ArgumentType, vm } = Scratch, { runtime, extensionManager } = vm,
        extId = 'jodieextexp', runText = 'run function [FUNCNAME] from [EXTLIST] with inputs [INPUT]',
        getFunctionsText = 'get blocks from [EXTLIST]',
        defaultArguments = {
          FUNCNAME: { type: ArgumentType.STRING, defaultValue: 'test' },
          EXTLIST: { type: ArgumentType.STRING, menu: 'EXTLIST', defaultValue: extId },
          INPUT: { type: ArgumentType.STRING, defaultValue: '{"INPUT":"Hello World!"}' },
        },
        getBlocksArgument = {
          EXTLIST: { type: ArgumentType.STRING, menu: 'EXTLIST', defaultValue: extId },
        };
  
  const isPackaged = ('scaffolding' in globalThis) && !Scratch.gui;
  class jodieextexp {
    constructor() {
      this._strict = [false, null];
      // Packaged projects can do whatever, strict mode is mainly for when the user
      // is in the editor or on the project page anyways.
      if (!isPackaged) this._toggleStrict(true);
    }
    getInfo() {
      return {
        id: extId,
        name: 'Extension Exposer',
        blocks: [{
          func: '_toggleStrict',
          blockType: BlockType.BUTTON,
          text: `${this._strict[0] ? 'Disable' : 'Enable'} strict mode`,
        }, '---', {
          func: 'getBlocks',
          opcode: 'getfunctions',
          blockType: BlockType.REPORTER,
          text: getFunctionsText,
          arguments: getBlocksArgument,
        },  {
          func: 'run',
          opcode: 'runcommand',
          blockType: BlockType.COMMAND,
          text: runText,
          arguments: defaultArguments,
        }, {
          func: 'run',
          opcode: 'runreporter',
          blockType: BlockType.REPORTER,
          text: runText,
          arguments: defaultArguments,
          allowDropAnywhere: true,
        }, {
          func: 'run',
          opcode: 'runboolean',
          blockType: BlockType.BOOLEAN,
          text: runText,
          arguments: defaultArguments,
          allowDropAnywhere: true,
        }],
        menus: {
          EXTLIST: {
            acceptReporters: true,
            acceptText: true,
            items: '_extensions',
          },
        },
      };
    }
    _parseJSON(obj) {
      if (typeof obj === 'object') {
        if (
          obj === null ||
          !Object.is(Object.getPrototypeOf(obj), Object.prototype)
        ) return {};
        return obj;
      }
      try {
        obj = JSON.parse(obj);
        if (
          obj === null ||
          !Object.is(Object.getPrototypeOf(obj), Object.prototype)
        ) return {};
        return obj;
      } catch {
        return {};
      }
    }
    _extensions() {
      const arr = Array.from(extensionManager._loadedExtensions.keys()).map(id => String(id));
      return [
        // Built in categories.
        `scratch3_motion`,
        `scratch3_looks`,
        `scratch3_sound`,
        `scratch3_event`,
        `scratch3_control`,
        `scratch3_sensing`,
        `scratch3_operators`,
        `scratch3_data`,
        `scratch3_procedures`,
      ].concat(arr);
    }
    _getExtensionObject(id) {
      // TurboWarp and PenguinMod export style.
      let ext = runtime[`ext_${id}`];
      if (ext) return ext;
      // Unsandboxed (mod) export style.
      ext = runtime[`cext_${id}`];
      if (ext) return ext;
      return null;
    }
    run({ FUNCNAME, EXTLIST, INPUT }, util, blockJSON) {
      EXTLIST = Cast.toString(EXTLIST);
      FUNCNAME = Cast.toString(FUNCNAME);

      // Blocks have priority over built-in functions.
      let fn = runtime._primitives[`${EXTLIST}_${FUNCNAME}`];
      if (!fn) {
        const ext = this._getExtensionObject(EXTLIST);
        fn = (typeof ext[FUNCNAME] === 'function') && ext[FUNCNAME].bind(ext);
      }
      
      // If the function does not exist then the function does not exist on the target extension, or the extension lied about existing.
      return fn(this._parseJSON(Cast.toString(INPUT)), util, blockJSON);
    }
    getBlocks({ EXTLIST }) {
      const ext = this._getExtensionObject(Cast.toString(EXTLIST));
      if (!ext) return [];
      if (typeof ext.getInfo === 'function') {
        return (ext.getInfo().blocks || []).flatMap(block => (
          block && (typeof block.opcode === 'string') ? [block.opcode] : []
        ));
      } else if (typeof ext.getPrimitives === 'function') {
        return Object.getOwnPropertyNames(ext.getPrimitives()).map(opcode => String(opcode));
      }
      return [];
    }

    runcommand() { return ''; }
    runreporter() { return ''; }
    runboolean() { return ''; }

    getfunctions() { return ''; }

    test({ INPUT }) {
      return Cast.toString(INPUT);
    }

    // Strict mode disables any non-block related functions.
    async _toggleStrict(skipRefresh) {
      if (this._strict[0]) {
        if (!isPackaged) {
          const confirmation = await confirm('Disabling strict mode only works in the editor and packaged projects, it may also expose you to unsafe JavaScript, are you SURE you want to disable strict mode?');
          if (!confirmation) return;
        }
        this.run = this._strict[1];
        this._strict[0] = false;
        this._strict[1] = null;
      } else {
        this._strict[0] = true;
        this._strict[1] = this.run;
        this.run = function run({ FUNCNAME, EXTLIST }) {
          EXTLIST = Cast.toString(EXTLIST);
          FUNCNAME = Cast.toString(FUNCNAME);

          if (!runtime._primitives[`${EXTLIST}_${FUNCNAME}`]) {
            console.error('The block a block tried to use does not exist.', EXTLIST, FUNCNAME);
            if (runtime.ext_pm_liveTests) throw new ReferenceError('The block a block tried to use does not exist.');
            return '';
          }

          if (runtime.ext_pm_liveTests) return this._strict[1].apply(this, arguments);
          try {
            return this._strict[1].apply(this, arguments) ?? '';
          } catch(error) {
            console.error('The block or extension a block tried to use failed to run.', EXTLIST, FUNCNAME, error);
            return '';
          }
        };
      }
      // We are doing `!== true` here because some mods pass special Blockly arguments to buttons.
      if (skipRefresh !== true) extensionManager.refreshBlocks(extId);
    }
  }

  const instance = (runtime[`ext_${extId}`] = new jodieextexp());
  runtime._primitives[`${extId}_test`] = instance.test.bind(instance);
  Scratch.extensions.register(instance);
})(Scratch);
