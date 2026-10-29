/**!
 * Scope Variables
 * @author 0znzw <yri5@duck.com> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 2.2.0
 * @license MIT AND LGPL-3.0
 * Do not remove this comment.
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

    const iwnafhwtb = vm.exports[Object.getOwnPropertyNames(vm.exports).find((prop) => vm.exports[prop].toString().includes('JSGenerator:') && !vm.exports[prop].toString().includes('Stub'))];
    if (!iwnafhwtb && Thread.prototype.tryCompile) {
      throw new Error(`"${EXTENSION_ID}": Too old to run this extension.`);
    }

    const warn = Object.getOwnPropertyDescriptor(console, 'warn');
    console.warn = () => {};

    const exps = iwnafhwtb();

    Object.defineProperty(console, 'warn', warn);

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

  const DEBUG = true;
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

    if (DEBUG) {
      vm.enableDebug();
    }

    __INSTANCE__ = Extension();
    __INSTANCE__.exports = Extension.exports;

    const { runtime } = Scratch.vm;
    runtime[`ext_${EXTENSION_ID}`] = __INSTANCE__;
    runtime[`cext_${EXTENSION_ID}`] = __INSTANCE__;
    Scratch.extensions.register(__INSTANCE__);

    return getInstance();
  };

  Object.setPrototypeOf(Extension.prototype, { __proto__: Object });
  Extension.prototype.constructor = Extension;

  const { Cast, BlockType, ArgumentType } = Scratch;
  Extension.prototype.getInfo = function getInfo() {
    return {
      id: EXTENSION_ID,
      name: `Scope Variables`,
      color1: '#9a99ff',
      color2: '#a2a0ff',
      color3: '#7b7acc',
      color4: '#7b7acc',
      blocks: [
        {
          blockType: BlockType.CONDITIONAL,
          opcode: 'scope',
          func: 'block_scope',
          text: 'new scope',
          branchCount: 1,
        },
        '---',
        {
          blockType: BlockType.COMMAND,
          opcode: 'set',
          func: 'block_varSet',
          text: 'set scoped variable [A1] to [A2]',
          arguments: {
            A1: {
              exemptFromNormalization: true,
              type: ArgumentType.STRING,
              defaultValue: 'foo',
            },
            A2: {
              exemptFromNormalization: true,
              type: ArgumentType.STRING,
              defaultValue: 'bar',
            },
          },
        },
        {
          blockType: BlockType.COMMAND,
          opcode: 'varChangeBy',
          func: 'block_varChangeBy',
          text: 'change scoped variable [A1] by [A2]',
          arguments: {
            A1: {
              exemptFromNormalization: true,
              type: ArgumentType.STRING,
              defaultValue: 'foo',
            },
            A2: {
              exemptFromNormalization: true,
              type: ArgumentType.NUMBER,
              defaultValue: '5',
            },
          },
        },
        {
          blockType: BlockType.COMMAND,
          opcode: 'varDeleteAll',
          func: 'block_varDeleteAll',
          text: 'remove all scoped variables',
          arguments: {},
        },
        {
          blockType: BlockType.COMMAND,
          opcode: 'varDelete',
          func: 'block_varDelete',
          text: 'remove scoped variable [A1]',
          arguments: {
            A1: {
              exemptFromNormalization: true,
              type: ArgumentType.STRING,
              defaultValue: 'foo',
            },
          },
        },
        '---',
        {
          blockType: BlockType.BOOLEAN,
          opcode: 'varInScope',
          func: 'block_varInScope',
          text: 'is scoped variable [A1] in scope?',
          arguments: {
            A1: {
              exemptFromNormalization: true,
              type: ArgumentType.STRING,
              defaultValue: 'foo',
            },
          },
          disableMonitor: true,
        },
        {
          blockType: BlockType.REPORTER,
          opcode: 'get',
          func: 'block_varGet',
          text: 'get scoped variable [A1]',
          arguments: {
            A1: {
              exemptFromNormalization: true,
              type: ArgumentType.STRING,
              defaultValue: 'foo',
            },
          },
          disableMonitor: true,
          allowDropAnywhere: true,
          outputShape: 2,
          output: null,
        },
        '---',
        {
          blockType: BlockType.REPORTER,
          opcode: 'scopeDump',
          func: 'block_scopeDump',
          text: 'dump scope',
          arguments: {},
          disableMonitor: true,
        },
        {
          blockType: BlockType.REPORTER,
          opcode: 'scopeDumpMerged',
          func: 'block_scopeDumpMerged',
          text: 'dump scope (flat)',
          arguments: {},
          disableMonitor: true,
        },
      ],
    };
  };

  Extension.prototype._getScope = function _getScope(thread) {
    if (thread.stackFrames[0]) {
      for (let i = thread.stackFrames.length - 1; i >= 0; --i) {
        const frame = thread.stackFrames[i];
        const executionContext = frame.executionContext;
        if (!executionContext) {
          continue;
        }
        // Procedure calls are a scope boundary.
        if ((frame.op && frame.op.opcode) === 'procedures_call') {
          if (!executionContext[EXTENSION_ID]) {
            executionContext[EXTENSION_ID] = { __proto__: null }; // Do NOT inherit the outer scope.
          }
        }
        if (executionContext[EXTENSION_ID]) {
          return executionContext[EXTENSION_ID];
        }
      }
    }
    if (!thread[EXTENSION_ID]) {
      thread[EXTENSION_ID] = { __proto__: null };
    }
    return thread[EXTENSION_ID];
  };
  Extension.prototype._dumpScope = function _dumpScope(scope, merged) {
    const parent = Object.getPrototypeOf(scope);
    const dumped = (
      merged
        ? (
            parent != null
              ? this._dumpScope(parent, merged)
              : { __proto__: null }
          )
        : {
            __proto__: null,
            current: { __proto__: null },
            parent: (
              parent != null
                ? this._dumpScope(parent, merged)
                : { __proto__: null }
            ),
          }
    );
    const keys = Object.getOwnPropertyNames(scope);
    const keysLength = keys.length;
    if (merged) {
      for (let i = 0; i < keysLength; ++i) {
        dumped[keys[i]] = scope[keys[i]];
      }
    } else {
      for (let i = 0; i < keysLength; ++i) {
        dumped.current[keys[i]] = scope[keys[i]];
      }
    }
    return dumped;
  };

  Extension.prototype.block_scope = function block_scope(_args, util) {
    const frame = util.thread.peekStackFrame();
    if (!frame.executionContext) {
      frame.executionContext = {};
    }
    frame.executionContext[EXTENSION_ID] = { __proto__: this._getScope(util.thread) };
    return 1;
  };
  Extension.prototype.block_varGet = function block_varGet(args, util) {
    return this._getScope(util.thread)[Cast.toString(args.A1)] ?? '';
  };
  Extension.prototype.block_varSet = function block_varSet(args, util) {
    this._getScope(util.thread)[Cast.toString(args.A1)] = args.A2 ?? '';
    return '';
  };
  Extension.prototype.block_varChangeBy = function block_varChangeBy(args, util) {
    const scope = this._getScope(util.thread);
    const A1 = Cast.toString(args.A1);
    scope[A1] = Cast.toNumber(scope[A1]) + Cast.toNumber(args.A2);
    return '';
  };
  Extension.prototype.block_varDelete = function block_varDelete(args, util) {
    delete this._getScope(util.thread)[Cast.toString(args.A1)];
    return '';
  };
  Extension.prototype.block_varDeleteAll = function block_varDeleteAll(_args, util) {
    const scope = this._getScope(util.thread);
    const keys = Object.getOwnPropertyNames(scope);
    const keysLength = keys.length;
    for (let i = 0; i < keysLength; ++i) {
      delete scope[keys[i]];
    }
    return '';
  };
  Extension.prototype.block_varInScope = function block_varInScope(args, util) {
    return Cast.toString(args.A1) in this._getScope(util.thread);
  };
  Extension.prototype.block_scopeDump = function block_scopeDump(_args, util) {
    return JSON.stringify(this._dumpScope(this._getScope(util.thread), false));
  };
  Extension.prototype.block_scopeDumpMerged = function block_scopeDumpMerged(_args, util) {
    return JSON.stringify(this._dumpScope(this._getScope(util.thread), true));
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
          return `(${this.variable}[${variable}] ?? '')`;
        }
        isInScope(variable) {
          return `((${variable}) in ${this.variable})`;
        }
        dumpScope(merged) {
          return `JSON.stringify(runtime['cext_${EXTENSION_ID}']._dumpScope(${this.variable}, ${merged}))`;
        }

        set(variable, value) {
          return `${this.variable}[${variable}] = ${value} ?? '';`;
        }
        changeBy(variable, value) {
          return `${this.variable}[${variable}] = (+${this.variable}[${variable}] || 0) + ${value};`;
        }
        deleteAll() {
          const i = `i_${this.manager.variables.next()}`;
          const keys = `keys_${this.manager.variables.next()}`;
          const keysLength = `keysLength_${this.manager.variables.next()}`;
          return `
            const ${keys} = Object.getOwnPropertyNames(${this.variable}), ${keysLength} = ${keys}.length;
            for (let ${i} = 0; ${i} < ${keysLength}; ++${i}) {
              delete ${this.variable}[${keys}[${i}]];
            };
          `;
        }
        delete(variable) {
          return `void(delete ${this.variable}[${variable}]);`;
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
        this.variables = new JSExports.VariablePool(`$${EXTENSION_ID}$`);

        this._jsg = JSG;
        this._scopes = new Extension.exports.Stack([
          new ScopeManager.Scope(this.variables.next(), null, this),
        ]);
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
        const scope = new ScopeManager.Scope(this.variables.next(), this._scopes.peek(), this);
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

      if (DEBUG) {
        STGP.descendVisualReport = function descendVisualReport(block) {
          if (!this.thread.stackClick || block.next) {
            return null;
          }
          try {
            const input = this.descendInput(block);
            return new JSExports.IntermediateStackBlock(JSExports.StackOpcode.VISUAL_REPORT, {
              input,
            }, input.yields);
          } catch (err) {
            console.error(err);
            return null;
          }
        };
      }

      const STGP_descendInput = STGP.descendInput;
      STGP.descendInput = function descendInput(...args) {
        const block = args[0];
        let node;
        switch(block && block.opcode) {
          case `${EXTENSION_ID}_get`:
            node = new JSExports.IntermediateInput(block.opcode, JSExports.InputType.ANY, {
              name: this.descendInputOfBlock(block, 'A1', true).toType(JSExports.InputType.STRING),
            }, false);
            break;
          case `${EXTENSION_ID}_varInScope`:
            node = new JSExports.IntermediateInput(block.opcode, JSExports.InputType.BOOLEAN, {
              name: this.descendInputOfBlock(block, 'A1', true).toType(JSExports.InputType.STRING),
            }, false);
            break;
          case `${EXTENSION_ID}_scopeDump`:
            node = new JSExports.IntermediateInput(block.opcode, JSExports.InputType.STRING, {
            }, false);
            break;
          case `${EXTENSION_ID}_scopeDumpMerged`:
            node = new JSExports.IntermediateInput(block.opcode, JSExports.InputType.STRING, {
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
          case `${EXTENSION_ID}_set`:
            node = new JSExports.IntermediateStackBlock(block.opcode, {
              name: this.descendInputOfBlock(block, 'A1', true).toType(JSExports.InputType.STRING),
              value: this.descendInputOfBlock(block, 'A2', true),
            }, false);
            break;
          case `${EXTENSION_ID}_varChangeBy`:
            node = new JSExports.IntermediateStackBlock(block.opcode, {
              name: this.descendInputOfBlock(block, 'A1', true).toType(JSExports.InputType.STRING),
              value: this.descendInputOfBlock(block, 'A2', true),
            }, false);
            break;
          case `${EXTENSION_ID}_varDeleteAll`:
            node = new JSExports.IntermediateStackBlock(block.opcode, {
            }, false);
            break;
          case `${EXTENSION_ID}_varDelete`:
            node = new JSExports.IntermediateStackBlock(block.opcode, {
              name: this.descendInputOfBlock(block, 'A1', true).toType(JSExports.InputType.STRING),
            }, false);
            break;
          default:
            if (DEBUG && block && block.opcode.startsWith(`${EXTENSION_ID}_`)) {
              return this.descendVisualReport(block) ?? STGP_descendStackedBlock.apply(this, args);
            }
            return STGP_descendStackedBlock.apply(this, args);
        }
        node.type = block.opcode;
        node.$ = block;
        return node;
      };

      //#region JSG (1)

      ScopeManager.prototype.descendVariableString = function descendVariableString(variable) {
        return `(${this._jsg.descendInput(variable)})`;
      };
      ScopeManager.prototype.descendVariableNumber = function descendVariableNumber(variable) {
        return `(${this._jsg.descendInput(variable)})`;
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
          case `${EXTENSION_ID}_get`: {
            const scope = ScopeManager.findScope(this);
            return scope.get(this.descendInput(node.inputs.name));
          };
          case `${EXTENSION_ID}_varInScope`: {
            const scope = ScopeManager.findScope(this);
            return scope.isInScope(this.descendInput(node.inputs.name));
          };
          case `${EXTENSION_ID}_scopeDump`: {
            const scope = ScopeManager.findScope(this);
            return scope.dumpScope(false);
          };
          case `${EXTENSION_ID}_scopeDumpMerged`: {
            const scope = ScopeManager.findScope(this);
            return scope.dumpScope(true);
          };
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
          case `${EXTENSION_ID}_set`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.set(this.descendInput(node.inputs.name), this.descendInput(node.inputs.value));
            break;
          };
          case `${EXTENSION_ID}_varChangeBy`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.changeBy(this.descendInput(node.inputs.name), this.descendInput(node.inputs.value));
            break;
          };
          case `${EXTENSION_ID}_varDeleteAll`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.deleteAll();
            break;
          };
          case `${EXTENSION_ID}_varDelete`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.delete(this.descendInput(node.inputs.name));
            break;
          };
          default:
            return JSGP_descendStackedBlock.apply(this, args);
        }
      };
    } else {
      //#region STG (2)

      const STGP_descendInput = STGP.descendInput;
      STGP.descendInput = function descendInput(...args) {
        const block = args[0];
        let node;
        switch(block && block.opcode) {
          case `${EXTENSION_ID}_get`:
          case `${EXTENSION_ID}_varInScope`:
            node = {
              inputs: {
                name: this.descendInputOfBlock(block, 'A1'),
              },
            };
            break;
          case `${EXTENSION_ID}_scopeDump`:
          case `${EXTENSION_ID}_scopeDumpMerged`:
            node = {
              inputs: {},
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
          case `${EXTENSION_ID}_set`:
          case `${EXTENSION_ID}_varChangeBy`:
            node = {
              inputs: {
                name: this.descendInputOfBlock(block, 'A1'),
                value: this.descendInputOfBlock(block, 'A2'),
              },
            };
            break;
          case `${EXTENSION_ID}_varDeleteAll`:
            node = {
              inputs: {},
            };
            break;
          case `${EXTENSION_ID}_varDelete`:
            node = {
              inputs: {
                name: this.descendInputOfBlock(block, 'A1'),
              },
            };
            break;
          default:
            if (DEBUG && block && block.opcode.startsWith(`${EXTENSION_ID}_`)) {
              if (this.thread.stackClick) {
                try {
                  const input = this.descendInput(block);
                  return {
                    kind: 'visualReport',
                    input: input,
                  };
                } catch (err) {
                  console.error(err);
                }
              }
            }
            return STGP_descendStackedBlock.apply(this, args);
        }
        node.type = block.opcode;
        node.$ = block;
        return node;
      };

      //#region JSG (2)

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
          case `${EXTENSION_ID}_get`: {
            const scope = ScopeManager.findScope(this);
            return new JSExports.TypedInput(
              scope.get(this.descendInput(node.inputs.name).asString()),
              JSExports.TYPE_UNKNOWN,
            );
          };
          case `${EXTENSION_ID}_varInScope`: {
            const scope = ScopeManager.findScope(this);
            return new JSExports.TypedInput(
              scope.isInScope(this.descendInput(node.inputs.name).asString()),
              JSExports.TYPE_BOOLEAN,
            );
          };
          case `${EXTENSION_ID}_scopeDump`: {
            const scope = ScopeManager.findScope(this);
            return new JSExports.TypedInput(
              scope.dumpScope(false),
              JSExports.TYPE_STRING,
            );
          };
          case `${EXTENSION_ID}_scopeDumpMerged`: {
            const scope = ScopeManager.findScope(this);
            return new JSExports.TypedInput(
              scope.dumpScope(true),
              JSExports.TYPE_STRING,
            );
          };
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
          case `${EXTENSION_ID}_set`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.set(this.descendInput(node.inputs.name).asString(), this.descendInput(node.inputs.value).asUnknown());
            break;
          };
          case `${EXTENSION_ID}_varChangeBy`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.changeBy(this.descendInput(node.inputs.name).asString(), this.descendInput(node.inputs.value).asNumber());
            break;
          };
          case `${EXTENSION_ID}_varDeleteAll`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.deleteAll();
            break;
          };
          case `${EXTENSION_ID}_varDelete`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.delete(this.descendInput(node.inputs.name).asString());
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
