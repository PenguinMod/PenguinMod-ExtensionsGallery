/**!
 * Extension Exposer
 * @author TheShovel https://github.com/TheShovel/
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.3
 * @copyright MIT & LGPLv3 License
 * @comment Thanks to TheShovel for the original code, I just updated some internals :3
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Extension Exposer" must be ran unsandboxed.`);
  }
  const { Cast, BlockType, ArgumentType, vm } = Scratch, { runtime } = vm,
        extId = 'jodieextexp', runText = 'run function [FUNCNAME] from [EXTLIST] with inputs [INPUT]',
        defaultArguments = {
          FUNCNAME: { type: ArgumentType.STRING, defaultValue: 'test' },
          EXTLIST: { type: ArgumentType.STRING, menu: 'EXTLIST', defaultValue: extId },
          INPUT: { type: ArgumentType.STRING, defaultValue: '{"INPUT":"Hello World!"}' },
        };
  class jodieextexp {
    getInfo() {
      return {
        id: extId,
        name: 'Extension Exposer',
        blocks: [{
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
      if (Array.isArray(obj)) return {};
      if (typeof obj === 'object') return obj;
      try {
        obj = JSON.parse(obj);
        if (Array.isArray(obj)) return {};
        if (typeof obj === 'object') return obj;
        return {};
      } catch {
        return {};
      }
    }
    _extensions() {
      const arr = Array.from(vm.extensionManager._loadedExtensions.keys());
      if (typeof arr[0] !== 'string') arr.push('');
      return arr;
    }
    test(args) {
      return Cast.toString(args.INPUT || '');
    }
    run({ FUNCNAME, EXTLIST, INPUT }, util, blockJSON) {
      EXTLIST = Cast.toString(EXTLIST);
      FUNCNAME = Cast.toString(FUNCNAME);
      // If the function does not exist then it is not referenced as a real block, or the extension is not global (fallback)
      return (runtime._primitives[`${EXTLIST}_${FUNCNAME}`] || runtime[`ext_${EXTLIST}`][FUNCNAME])(this._parseJSON(Cast.toString(INPUT)), util, blockJSON);
    }
    runcommand() {}
    runreporter() {}
    runboolean() {}
  }
  Scratch.extensions.register(runtime[`ext_${extId}`] = new jodieextexp());
})(Scratch);
