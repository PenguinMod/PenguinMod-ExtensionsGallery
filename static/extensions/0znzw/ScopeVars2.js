/**!
 * Scope Variables
 * @author 0znzw <meow@miyo.icu> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 2.0.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment
 */
void !function() {
  'use strict';

  const global = (() => {
    try {
      return !!globalThis && globalThis;
    } catch(_error) {
      global = window || self;
    }
  })();

  const EXTENSION_ID = `0zCsv`;
  if (!global.Scratch || !global.Scratch.vm || !global.Scratch.extensions.unsandboxed) {
    throw new Error(`"${EXTENSION_ID}" must be ran unsandboxed.`);
  }
  const Scratch = global.Scratch;
  const vm = Scratch.vm, { extensionManager, runtime } = vm;

  if (!extensionManager.builtinExtensions || extensionManager._getScratch) {
    throw new Error(`"${EXTENSION_ID}": Too old to run this extension.`);
  }

  const Thread = (() => {
    let outThread = null;
    const array = [];
    array.push = (thread) => {
      outThread = thread;
      throw 'pass';
    };
    try {
      runtime._pushThread.apply({
        threads: array,
        monitorBlocks: null,
        threadMap: null,
      }, ['', { blocks: [] }, {}]);
    } catch(error) {
      if (error !== 'pass' || outThread === null) {
        throw new Error(`"${EXTENSION_ID}": Too old to run this extension.`);
      }
    }
    return outThread.__proto__.constructor;
  })();
  const _StackFrame = (() => {
    const thread = new Thread('');
    thread.pushStack('');
    return thread.stackFrames[0].__proto__.constructor;
  })();

  const { IRGenerator, ScriptTreeGenerator, JSGenerator, JSExports } = (() => {
    let IRG, STG, JSG;
    if (vm.exports.ScriptTreeGenerator) {
      STG = vm.exports.ScriptTreeGenerator;
    }
    if (vm.exports.IRGenerator) {
      IRG = vm.exports.IRGenerator;
      if (IRG.exports && IRG.exports.ScriptTreeGenerator) {
        STG = IRG.exports.ScriptTreeGenerator;
      }
    }
    if (vm.exports.JSGenerator) {
      JSG = vm.exports.JSGenerator;
    }
    if (IRG && STG && JSG) {
      return {
        IRGenerator: IRG,
        ScriptTreeGenerator: STG,
        JSGenerator: JSG,
        JSExports: Object.assign({}, vm.exports, JSG.exports),
      };
    };

    if (!vm.exports.i_will_not_ask_for_help_when_these_break && Thread.prototype.tryCompile) {
      throw new Error(`"${EXTENSION_ID}": Too old to run this extension.`);
    }

    const warn = console.warn;
    console.warn = () => {};

    let exps;
    if (vm.exports.these_broke_before_and_will_break_again) {
      exps = vm.exports.these_broke_before_and_will_break_again();
    } else {
      exps = vm.exports.i_will_not_ask_for_help_when_these_break();
    }

    console.warn = warn;

    if (!exps.JSGenerator || !exps.JSGenerator.unstable_exports) {
      throw new Error(`"${EXTENSION_ID}": Too old to run this extension.`);
    }

    return {
      IRGenerator: exps.IRGenerator,
      ScriptTreeGenerator: exps.ScriptTreeGenerator,
      JSGenerator: exps.JSGenerator,
      JSExports: Object.assign({}, vm.exports, exps, exps.JSGenerator.unstable_exports),
    };
  })();
  
  let __INSTANCE__ = null;
  function Extension(...args) {
    if (__INSTANCE__) {
      throw new TypeError(`Illegal constructor`);
    }

    if (!this || !(this instanceof Extension)) {
      return Extension.apply({ __proto__: Extension.prototype }, args);
    }
    return this;
  }
  Extension.getInstance = function getInstance() {
    if (__INSTANCE__) {
      return __INSTANCE__;
    }

    vm.enableDebug();

    __INSTANCE__ = Extension();
    __INSTANCE__.exports = Extension.exports;

    const { runtime } = Scratch.vm;
    runtime[`ext_${EXTENSION_ID}`] = __INSTANCE__;
    runtime[`cext_${EXTENSION_ID}`] = __INSTANCE__;
    Scratch.extensions.register(__INSTANCE__);

    return getInstance();
  };

  Object.setPrototypeOf(Extension.prototype, { __proto__: null });
  Extension.prototype.constructor = Extension;
  Extension.prototype.toString = function toString() {
    return `[object Object]`;
  };
  Extension.prototype.valueOf = function valueOf() {
    return this;
  };

  const { Cast, BlockType, ArgumentType } = Scratch;
  Extension.prototype.getInfo = function getInfo() {
    return {
      id: EXTENSION_ID,
      name: `Scope Variables`,
      blocks: [
        {
          blockType: BlockType.CONDITIONAL,
          opcode: 'scope',
          func: 'block_scope',
          text: 'scope',
          branchCount: 1,
        },
        /** @deprecated */
        {
          blockType: BlockType.COMMAND,
          opcode: 'set',
          func: 'block_legacySet',
          text: 'set var [A1] to [A2]',
          arguments: {
            A1: { exemptFromNormalization: true, type: ArgumentType.STRING },
            A2: { exemptFromNormalization: true, type: ArgumentType.STRING },
          },
        },
        /** @deprecated */
        {
          blockType: BlockType.REPORTER,
          opcode: 'get',
          func: 'block_legacyGet',
          text: 'get var [A1]',
          arguments: {
            A1: { exemptFromNormalization: true, type: ArgumentType.STRING },
          },
        },
      ],
    };
  };

  Extension.prototype._getScope = function _getScope(thread) {
    if (thread.stackFrames[0]) {
      for (let i = thread.stackFrames.length - 1; i >= 0; --i) {
        if (thread.stackFrames[i].executionContext && thread.stackFrames[i].executionContext[EXTENSION_ID]) {
          return thread.stackFrames[i].executionContext[EXTENSION_ID];
        }
      }
    }
    if (!thread[EXTENSION_ID]) {
      thread[EXTENSION_ID] = { __proto__: null };
    }
    return thread[EXTENSION_ID];
  };
  Extension.prototype._prefixVariable = function _prefixVariable(variable) {
    return `@${Cast.toString(variable)}`;
  };

  Extension.prototype.block_scope = function block_scope(_args, util) {
    const frame = util.thread.peekStackFrame();
    if (!frame.executionContext) {
      frame.executionContext = {};
    }
    frame.executionContext[EXTENSION_ID] = { __proto__: this._getScope(util.thread) };
    return 1;
  };
  /** @deprecated */
  Extension.prototype.block_legacyGet = function block_legacyGet(args, util) {
    return this._getScope(util.thread)[this._prefixVariable(args.A1)] ?? '';
  };
  /** @deprecated */
  Extension.prototype.block_legacySet = function block_legacySet(args, util) {
    this._getScope(util.thread)[this._prefixVariable(args.A1)] = args.A2 ?? '';
    return '';
  };

  {
    const exports = {
      __proto__: null,
      Thread, _StackFrame,
    };

    exports.Compiler = {
      __proto__: null,
      JSExports, JSGenerator, ScriptTreeGenerator, IRGenerator,
    }
    exports.Stack = class Stack {
      constructor(iterable) {
        this.__internal__ = Array.from(iterable);
        this.__size__ = this.__internal__.length;
      }

      arr() {
        return this.__internal__;
      }
      pop() {
        this.__internal__.pop();
        --this.__size__;
        return this;
      }
      push(value) {
        this.__internal__.push(value);
        ++this.__size__;
        return this;
      }
      peek() {
        return this.__internal__[this.__size__ - 1];
      }
    };

    Extension.exports = exports;
  };

  {
    const STGP = ScriptTreeGenerator.prototype;
    const JSGP = JSGenerator.prototype;

    class ScopeManager {
      static Scope = class Scope {
        constructor(variable, parent, manager) {
          this.parent = parent;
          this.variable = variable;

          this.manager = manager;
        }

        setup() {
          return `const ${this.variable} = { __proto__: ${this.parent ? this.parent.variable : null} };`;
        }

        get(variable) {
          return `(${this.variable}[${this.manager.prefixVariable(variable)}] ?? '')`;
        }
        set(variable, value) {
          return `${this.variable}[${this.manager.prefixVariable(variable)}] = ${value} ?? '';`;
        }
      };
      static patch(JSG) {
        if (JSG[EXTENSION_ID]) {
          return JSG[EXTENSION_ID];
        }
        JSG[EXTENSION_ID] = new this(JSG);

        return this.patch(JSG);
      }
      static findScope(JSG) {
        return this.patch(JSG).peekScope();
      }

      constructor(JSG) {
        this._variables = new JSExports.VariablePool(`$${EXTENSION_ID}$`);

        this._jsg = JSG;
        this._scopes = new Extension.exports.Stack([
          new ScopeManager.Scope(this._variables.next(), null, this),
        ]);
      }

      prefixVariable(_variable) {
        throw new Error('Not implemented.');
      }

      descendScopedStack(substack, dontGenerateSource) {
        const scope = this.pushScope();
        if (!dontGenerateSource) {
          this._jsg.source += `const ${scope.variable} = { __proto__: ${scope.parent ? scope.parent.variable : null} };`;
        }
        const res = this._jsg.descendStack(substack, new JSExports.Frame(false));
        this.popScope();
        return res;
      }

      pushScope() {
        const scope = new ScopeManager.Scope(this._variables.next(), this._scopes.peek(), this);
        this._scopes.push(scope);
        return scope;
      }
      popScope() {
        if (this._scopes.__size__ === 1) {
          return;
        }
        this._scopes.pop();
      }
      peekScope() {
        return this._scopes.peek();
      }
    }
    Extension.exports.Compiler.ScopeManager = ScopeManager;

    if (JSExports.StackOpcode) {
      //#region STG (1)

      const STGP_descendInput = STGP.descendInput;
      STGP.descendInput = function descendInput(...args) {
        const block = args[0];
        let node;
        switch(block && block.opcode) {
          /** @deprecated */
          case `${EXTENSION_ID}_get`:
            node = new JSExports.IntermediateInput(block.opcode, JSExports.InputType.ANY, {
              name: this.descendInputOfBlock(block, 'A1', true),
            }, false);
            break;
          default:
            return STGP_descendInput.apply(this, args);
        }
        node.type = block.opcode;
        node.$ = block;
        return node;
      };

      const STGP_descendStackedBlock = STGP.descendStackedBlock;
      STGP.descendStackedBlock = function descendStackedBlock(...args) {
        const block = args[0];
        let node;
        switch(block && block.opcode) {
          case `${EXTENSION_ID}_scope`:
            node = new JSExports.IntermediateStackBlock(block.opcode, {
              substack: this.descendSubstack(block, 'SUBSTACK'),
            }, false);
            break;
          /** @deprecated */
          case `${EXTENSION_ID}_set`:
            node = new JSExports.IntermediateStackBlock(block.opcode, {
              name: this.descendInputOfBlock(block, 'A1', true),
              value: this.descendInputOfBlock(block, 'A2', true),
            }, false);
            break;
          default:
            if (block && block.opcode.startsWith(`${EXTENSION_ID}_`)) {
              return this.descendVisualReport(block);
            }
            return STGP_descendStackedBlock.apply(this, args);
        }
        node.type = block.opcode;
        node.$ = block;
        return node;
      };

      //#region JSG (1)

      ScopeManager.prototype.prefixVariable = function prefixVariable(variable) {
        if (variable.opcode === JSExports.InputOpcode.CONSTANT) {
          return JSON.stringify(`@${'' + variable.inputs.value}`);
        }
        return `('@' + ${this._jsg.descendInput(variable)})`;
      };

      const JSGP_compile = JSGP.compile;
      JSGP.compile = function compile(...args) {
        const scope = ScopeManager.findScope(this);
        if (this.script.stack) {
          this.source += `const ${scope.variable} = { __proto__: null };\n`;
        }
        return JSGP_compile.apply(this, args);
      };

      const JSGP_descendInput = JSGP.descendInput;
      JSGP.descendInput = function descendInput(...args) {
        const node = args[0];

        switch(node && node.type) {
          /** @deprecated */
          case `${EXTENSION_ID}_get`:
            const scope = ScopeManager.findScope(this);
            return scope.get(node.inputs.name);
          default:
            return JSGP_descendInput.apply(this, args);
        }
      };

      const JSGP_descendStackedBlock = JSGP.descendStackedBlock;
      JSGP.descendStackedBlock = function descendStackedBlock(...args) {
        const node = args[0];

        switch(node && node.type) {
          case `${EXTENSION_ID}_scope`: {
            const manager = ScopeManager.patch(this);
            manager.descendScopedStack(node.inputs.substack);
            break;
          };
          /** @deprecated */
          case `${EXTENSION_ID}_set`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.set(node.inputs.name, this.descendInput(node.inputs.value));
            break;
          };
          default:
            return JSGP_descendStackedBlock.apply(this, args);
        }
      };
    } else {
      //#region STG (2)

      if (INPUT_DEBUG) {
        STGP.descendVisualReport = function descendVisualReport(block) {
          if (!this.thread.stackClick || block.next) {
            return null;
          }
          try {
            return {
              kind: 'visualReport',
              input: this.descendInput(block)
            };
          } catch (e) {
            console.error(e);
            return null;
          }
        };
      }

      const STGP_descendInput = STGP.descendInput;
      STGP.descendInput = function descendInput(...args) {
        const block = args[0];
        let node;
        switch(block && block.opcode) {
          /** @deprecated */
          case `${EXTENSION_ID}_get`:
            node = {
              inputs: {
                name: this.descendInputOfBlock(block, 'A1'),
              },
            };
            break;
          default:
            return STGP_descendInput.apply(this, args);
        }
        node.type = block.opcode;
        node.$ = block;
        return node;
      };

      const STGP_descendStackedBlock = STGP.descendStackedBlock;
      STGP.descendStackedBlock = function descendStackedBlock(...args) {
        const block = args[0];
        let node;
        switch(block && block.opcode) {
          case `${EXTENSION_ID}_scope`:
            node = {
              inputs: {
                substack: this.descendSubstack(block, 'SUBSTACK'),
              },
            };
            break;
          /** @deprecated */
          case `${EXTENSION_ID}_set`:
            node = {
              inputs: {
                name: this.descendInputOfBlock(block, 'A1'),
                value: this.descendInputOfBlock(block, 'A2'),
              },
            };
            break;
          default:
            if (block && block.opcode.startsWith(`${EXTENSION_ID}_`)) {
              return this.descendVisualReport(block);
            }
            return STGP_descendStackedBlock.apply(this, args);
        }
        node.type = block.opcode;
        node.$ = block;
        return node;
      };

      //#region JSG (2)

      ScopeManager.prototype.prefixVariable = function prefixVariable(variable) {
        if (variable instanceof JSExports.ConstantInput) {
          return JSON.stringify(`@${variable.asUnknown()}`);
        }
        if (variable && typeof variable.asUnknown === 'function') {
          return `('@' + ${variable.asUnknown()})`;
        }
        return JSON.stringify(`@${'' + variable}`);
      };

      const JSGP_compile = JSGP.compile;
      JSGP.compile = function compile(...args) {
        const scope = ScopeManager.findScope(this);
        if (this.script.stack) {
          this.source += `const ${scope.variable} = { __proto__: null };\n`;
        }
        return JSGP_compile.apply(this, args);
      };

      const JSGP_descendInput = JSGP.descendInput;
      JSGP.descendInput = function descendInput(...args) {
        const node = args[0];

        switch(node && node.type) {
          /** @deprecated */
          case `${EXTENSION_ID}_get`:
            const scope = ScopeManager.findScope(this);
            return new JSExports.TypedInput(
              scope.get(this.descendInput(node.inputs.name)),
              JSExports.TYPE_UNKNOWN,
            );
          default:
            return JSGP_descendInput.apply(this, args);
        }
      };

      const JSGP_descendStackedBlock = JSGP.descendStackedBlock;
      JSGP.descendStackedBlock = function descendStackedBlock(...args) {
        const node = args[0];

        switch(node && node.type) {
          case `${EXTENSION_ID}_scope`: {
            const manager = ScopeManager.patch(this);
            manager.descendScopedStack(node.inputs.substack);
            break;
          };
          /** @deprecated */
          case `${EXTENSION_ID}_set`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.set(this.descendInput(node.inputs.name), this.descendInput(node.inputs.value).asUnknown());
            break;
          };
          default:
            return JSGP_descendStackedBlock.apply(this, args);
        }
      };
    }
  };

  return Extension.getInstance();
}();
