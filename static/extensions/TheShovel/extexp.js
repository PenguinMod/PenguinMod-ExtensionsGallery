/**!
 * Extension Exposer
 * @author TheShovel https://github.com/TheShovel/
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @author Faunksys https://github.com/faunks/
 * @version 2.3
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
          FUNCNAME: { type: ArgumentType.STRING, defaultValue: 'movesteps' },
          EXTLIST: { type: ArgumentType.STRING, menu: 'EXTLIST' },
          INPUT: { type: ArgumentType.STRING, defaultValue: '{"STEPS":10}' },
        },
        getBlocksArgument = {
          EXTLIST: { type: ArgumentType.STRING, menu: 'EXTLIST' },
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
    // NOTE: This is only meant to return object values and nothing else (no Arrays or null as they don't count here)
    _convertToObject(obj) {
      if (typeof obj === 'object') {
        if (obj === null || Array.isArray(obj)) return {};
        // NOTE: Unlike the "JSON.parse" this is not guarenteed to actually be a safe object to pass around.
        return obj;
      }
      try {
        obj = JSON.parse(obj);
        // "JSON.parse" only returns Object, Array and null as "object-like" values.
        if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return {};
        return obj;
      } catch {
        return {};
      }
    }
    static _BUILT_IN_CATEGORIES = [
      // Built in categories.
      // The "scratch3_" prefix can be added if you want to access direct functions on the classes.
      `motion`,
      `looks`,
      `sound`,
      `event`,
      `control`,
      `sensing`,
      `operators`,
      `data`,
      `procedures`,
    ];
    _extensions() {
      const arr = Array.from(extensionManager._loadedExtensions.keys()).map(id => String(id));
      return jodieextexp._BUILT_IN_CATEGORIES.concat(arr);
    }
    _getExtensionObject(id) {
      // TurboWarp and PenguinMod export style.
      let ext = runtime[`ext_${id}`];
      if (ext) return ext;
      // Unsandboxed (mod) export style.
      // NOTE: This is only added because a large amount of extensions use it.
      ext = runtime[`cext_${id}`];
      if (ext) return ext;
      return null;
    }
    run({ FUNCNAME, EXTLIST, INPUT }, util, blockJSON) {
      EXTLIST = Cast.toString(EXTLIST);
      FUNCNAME = Cast.toString(FUNCNAME);

      // Real blocks have priority over class functions.
      let fn = runtime._primitives[`${EXTLIST}_${FUNCNAME}`];
      if (!fn) {
        // "scratch3_" will fall through to here, so no if check is needed.
        const ext = this._getExtensionObject(EXTLIST);
        fn = (typeof ext[FUNCNAME] === 'function') && ext[FUNCNAME].bind(ext);
      }
      
      // If the function does not exist then the function does not exist on the target extension, or the extension lied about existing.
      return fn(this._convertToObject(Cast.toString(INPUT)), util, blockJSON);
    }
    getBlocks({ EXTLIST }) {
      EXTLIST = `${Cast.toString(EXTLIST)}_`;
      // We use the primitives list here to make sure we aren't getting say.. buttons or labels, which are not really "blocks" in the traditional sense.
      return Object.getOwnPropertyNames(runtime._primitives).filter(opcode => opcode.startsWith(EXTLIST));
    }

    runcommand() { return ''; }
    runreporter() { return ''; }
    runboolean() { return ''; }

    getfunctions() { return ''; }

    // @depricated
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
        this.run = function run(args) {
          args.EXTLIST = Cast.toString(args.EXTLIST);
          args.FUNCNAME = Cast.toString(args.FUNCNAME);

          // Force old "scratch3_" style inputs into valid primitive categories.
          if (jodieextexp._BUILT_IN_CATEGORIES.includes(args.EXTLIST)) args.EXTLIST = args.EXTLIST.replace('scratch3_', '');
          
          if (!runtime._primitives[`${args.EXTLIST}_${args.FUNCNAME}`]) {
            console.error('The block a block tried to use does not exist.', args.EXTLIST, args.FUNCNAME);
            if (Scratch.extensions.isPenguinMod) throw new ReferenceError('The block a block tried to use does not exist.');
            return '';
          }

          if (Scratch.extensions.isPenguinMod) return this._strict[1].apply(this, arguments);
          try {
            return this._strict[1].apply(this, arguments) ?? '';
          } catch(error) {
            console.error('The block or extension a block tried to use failed to run.', args.EXTLIST, args.FUNCNAME, error);
            return '';
          }
        };
      }
      // We are doing `!== true` here because some mods pass special Blockly arguments to buttons.
      if (skipRefresh !== true) extensionManager.refreshBlocks(extId);
    }
  }

  Scratch.extensions.register(runtime[`ext_${extId}`] = new jodieextexp());
})(Scratch);
