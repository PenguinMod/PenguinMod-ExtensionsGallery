/**!
 * Extension Exposer
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.2.1
 * @copyright MIT & LGPLv3 License
 * @comment  Thanks to JodieTheShovel for the original concept:
 * @original https://extensions.penguinmod.com/extensions/TheShovel/extexp.js
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Extension Exposer" must be ran unsandboxed.`);
  }
  const extId = '0znzwExtensionExposerPrims', { Cast, BlockType, ArgumentType, vm } = Scratch, { runtime } = vm;
  class extension {
    getInfo() {
      return {
        id: extId,
        name: 'Extension Exposer',
        blocks: [{
          opcode: 'command',
          blockType: BlockType.COMMAND,
          text: 'run function [OPCODE] from [EXT] with args [ARGS]',
          arguments: {
            OPCODE: { type: ArgumentType.STRING, defaultValue: 'exampleA' },
            EXT: { type: ArgumentType.STRING, menu: 'exts', defaultValue: extId },
            ARGS: { type: ArgumentType.STRING, defaultValue: '{"TEXT":"AAAAHH"}' },
          },
        }, {
          opcode: 'inline',
          blockType: BlockType.REPORTER,
          text: 'run function [OPCODE] from [EXT] with args [ARGS]',
          arguments: {
            OPCODE: { type: ArgumentType.STRING, defaultValue: 'exampleB' },
            EXT: { type: ArgumentType.STRING, menu: 'exts', defaultValue: extId },
            ARGS: { type: ArgumentType.STRING, defaultValue: '{"PERSON":"Joe"}' },
          },
          allowDropAnywhere: true,
        }],
        menus: {
          exts: {
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
    exampleA(args) {
      alert(Cast.toString(args.TEXT || ''));
    }
    exampleB(args) {
      return `Hello, ${Cast.toString(args.PERSON || '')}`;
    }
    command({ EXT, OPCODE, ARGS }, util, blockJSON) {
      if (EXT = Cast.toString(EXT), (!this._extensions().includes(EXT) || EXT === '')) return '';
      OPCODE = Cast.toString(OPCODE);
      // If the function does not exist then it is not referenced as a real block, or the extension is not global (fallback)
      return (runtime._primitives[`${EXT}_${OPCODE}`] || runtime[`ext_${EXT}`][OPCODE])(this._parseJSON(ARGS), util, blockJSON);
    }
    inline({ EXT, OPCODE, ARGS }, util, blockJSON) {
      if (EXT = Cast.toString(EXT), (!this._extensions().includes(EXT) || EXT === '')) return '';
      OPCODE = Cast.toString(OPCODE);
      return (runtime._primitives[`${EXT}_${OPCODE}`] || runtime[`ext_${EXT}`][OPCODE])(this._parseJSON(ARGS), util, blockJSON);
    }
  }
  Scratch.extensions.register(runtime[`ext_${extId}`] = new extension());
})(Scratch);
