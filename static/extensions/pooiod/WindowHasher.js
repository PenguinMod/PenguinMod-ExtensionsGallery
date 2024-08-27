// A simple window hash extension by pooiod7

(function(Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed');
  }

  class p7windowhash {
    constructor() {
      window.addEventListener("hashchange", () => {
        Scratch.vm.runtime.startHats("p7windowhash_onhashchange");
      });
    }
    getInfo() {
      return {
        id: 'p7windowhash',
        name: 'Window Hasher',
        blocks: [
          {
            blockType: Scratch.BlockType.EVENT,
            shouldRestartExistingThreads: true,
            opcode: 'onhashchange',
            text: 'On hash change',
            isEdgeActivated: false
          },
          {
            opcode: 'Sethash',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set window hash to [HASH]',
            arguments: {
              HASH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hello',
              },
            },
          },
          {
            opcode: 'Gethash',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Get window hash',
          }
        ]
      };
    }

    Sethash(args) {
      window.location.hash = args.HASH;
      if (args.HASH == "") history.replaceState(null, document.title, location.pathname + location.search);
      else if (args.HASH == "/") {
        if (!window.location.pathname.endsWith('/') && !window.location.pathname.endsWith('html')) {
          window.history.replaceState({}, '', window.location.pathname + '/');
        }
      }
    }

    Gethash() {
      return window.location.hash.substring(1);
    }

  }
  Scratch.extensions.register(new p7windowhash());
})(Scratch);
