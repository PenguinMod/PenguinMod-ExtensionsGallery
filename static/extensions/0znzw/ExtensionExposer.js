/**!
 * Extension Exposer
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT & LGPLv3 License
 * @comment  Thanks to JodieTheShovel for the original concept:
 * @original https://extensions.penguinmod.com/extensions/TheShovel/extexp.js
 * Do not remove this comment
 */
(function(Scratch) {
  if (!Scratch.extensions.unsandboxed) {
    throw new Error(`"Extension Exposer" must be ran unsandboxed.`);
  }
  const { Cast, BlockType, ArgumentType, vm } = Scratch, { runtime } = vm;
  class extension {
    getInfo() {
      return {
        id: '0znzwExtensionExposerPrims',
        name: 'Extension Exposer',
        blocks: [{
          opcode: 'command',
          blockType: BlockType.COMMAND,
          text: 'run function [OPCODE] from [EXT] with args [ARGS]',
          arguments: {
            OPCODE: { type: ArgumentType.STRING, defaultValue: 'opcode' },
            EXT: { type: ArgumentType.STRING, menu: 'exts', defaultValue: '' },
            ARGS: { type: ArgumentType.STRING, defaultValue: '{"input1":"yep"}' },
          },
        }, {
          opcode: 'inline',
          blockType: BlockType.REPORTER,
          text: 'run function [OPCODE] from [EXT] with args [ARGS]',
          arguments: {
            OPCODE: { type: ArgumentType.STRING, defaultValue: 'opcode' },
            EXT: { type: ArgumentType.STRING, menu: 'exts', defaultValue: '' },
            ARGS: { type: ArgumentType.STRING, defaultValue: '{"input1":"yep"}' },
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
    command({ EXT, OPCODE, ARGS }, util, blockJSON) {
      if (EXT = Cast.toString(EXT), (!this._extensions().includes(EXT) || EXT === '')) return '';
      const fn = runtime._primitives[`${EXT}_${Cast.toString(OPCODE)}`];
      if (!fn) return '';
      return fn(this._parseJSON(ARGS), util, blockJSON);
    }
    inline({ EXT, OPCODE, ARGS }, util, blockJSON) {
      if (EXT = Cast.toString(EXT), (!this._extensions().includes(EXT) || EXT === '')) return '';
      const fn = runtime._primitives[`${EXT}_${Cast.toString(OPCODE)}`];
      if (!fn) return '';
      return fn(this._parseJSON(ARGS), util, blockJSON);
    }
  }
  Scratch.extensions.register(new extension());
})(Scratch);
