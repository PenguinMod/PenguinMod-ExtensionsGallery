/**!
 * Scope Variables
 * @author 0znzw <yri5@duck.com> (@link https://scratch.mit.edu/users/0znzw/)
 * @version 2.3.2
 * @license MIT AND LGPL-3.0
 * Do not remove this comment.
 */
void !function() {
  'use strict';

  const global_ = (() => {
    try {
      return !!globalThis && globalThis;
    } catch(_error1) {
      try {
        return window || self;
      } catch(_error2) {
        return global;
      }
    }
  })();

  const EXTENSION_ID = `0zCsv`;
  if (!global_.Scratch || !global_.Scratch.vm || !global_.Scratch.extensions.unsandboxed) {
    throw new Error(`"${EXTENSION_ID}" must be ran unsandboxed.`);
  }
  const Scratch = global_.Scratch;
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

    const iwnafhwtb = vm.exports[Object.getOwnPropertyNames(vm.exports).find((prop) => String(vm.exports[prop]).includes('JSGenerator:') && !String(vm.exports[prop]).includes('Stub'))];
    if (!iwnafhwtb && Thread.prototype.tryCompile) {
      throw new Error(`"${EXTENSION_ID}": Too old to run this extension.`);
    }

    const warn = Object.getOwnPropertyDescriptor(console, 'warn');
    console.warn = () => {};

    let exps = null;
    try {
      exps = iwnafhwtb();
    } catch(error) {
      console.error('Error while getting the compiler exports.', error);
    }

    Object.defineProperty(console, 'warn', warn);

    if (!exps || !exps.JSGenerator || !exps.JSGenerator.unstable_exports) {
      throw new Error(`"${EXTENSION_ID}": Too old to run this extension.`);
    }

    return {
      IRGenerator: exps.IRGenerator,
      ScriptTreeGenerator: exps.ScriptTreeGenerator,
      JSGenerator: exps.JSGenerator,
      JSExports: Object.assign({}, vm.exports, exps, exps.JSGenerator.unstable_exports),
    };
  })();

  const DEBUG = false;
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
      name: Scratch.translate('Scope Variables'),
      color1: '#9a99ff',
      color2: '#a2a0ff',
      color3: '#7b7acc',
      color4: '#7b7acc',
      menuIconURI: `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgd2lkdGg9IjY0cHgiIGhlaWdodD0iNjRweCIgdmlld0JveD0iMCAwIDk2IDk2IiBmaWxsPSJub25lIiBzdHJva2U9Im5vbmUiIHByZXNlcnZlQXNwZWN0UmF0aW89InhNaWRZbWlkIG1lZXQiPg0KICA8Zz4NCiAgICA8aW1hZ2UgaGVpZ2h0PSI5NiIgd2lkdGg9Ijk2IiBocmVmPSJkYXRhOmltYWdlL3dlYnA7YmFzZTY0LFVrbEdSaTRMQUFCWFJVSlFWbEE0V0FvQUFBQVFBQUFBWHdBQVJnQUFRVXhRU0xjRUFBQU5zRVRidG1uSjFwajdYSVl5NHRtMmJkdTJiWlQ0Zi9tMVg4M1N0MjNidHMyMEhjYTlaODlDWE80NHJmMXFSRXdBeFN3cFpDRXJsMHREQldXTGFFZlVLQ2pBRUlsMllVVkF0bU5oWVN4SFZGeFlkbkFzTUl4c0Z4bVcxQ3cwSWdyRmhsMTQ5Rnh5RjE0cXVCZHlVQ3hWeVdPTXNZMXBLUWxzTE1CTFJMaTA3K0hIN1R2cVpxUFJiTGhWM216UjJMSmpZbUp5ZHJJUmhaSHMvdUV1SkdvMzNsbmJQdFYwVnFtVXkyVzF5a290d3ZCZ3ZWNHZ6VTl0K05lYTlXdG44NGFJU1luYXdaZGNOV1BuMFlDQ0FxMmxGcXBXeXBWS2RZK3gvWTg2YVAvYTVMKy85cWVORThKWXVHZWRDbzY1OVpnRlJ5c0FpQjVLTExZTTJSNTdIbk50ZWVyWGY5bzBQemR2UzhRK1NmdmRjdGxzTktML1FtQ0oyckZIblgzUXFQTHRmL3pGUDhjYkp2WWpWTys4UDdkSjEyU0FQREphcnczdWQ4bzVlLy8zVjcvNTY0N2M3cFgydjIvUFBKS3dGVmdzc2RqWjJLbm5Iekg5bDIrc0VPNkZPT2VaMldnU2RxQnpDZER1WjUxenlyYy90eVhHN3NUeHIrUW1aUWQ2S0tUcWdVK2YrSzFQYkhCM0p6eWFtNlJGcndNNjZ0N1JqL3crZGhIMmVYemVKTzNlZ2NpdXZ1TDlmNC91UlBIeWdVakN0Z0o5VmVtTWg5NWMzeEY2TURxaHFFQy94Vm5YTEorTTdlU1RSMHk2ZWNqb3YzeXp2dHdCM09Lb1pCd0NLWWFSbTc2L0liYkxqaUJsa2FiT3FQeFVicVhkaGh3U2lpR1IrdlB2M2RWdTk0V29kSVNWQkp4NDc5dW0zSUphTTA4SXhVVGttNmUvYjdmSUhFbEpWaEtFM1IvNTlsOXN3TnVxeTFLQ1ZBaW5QN1I4QlFadmFCeG1wWlNzT1B1MmQvMHZZQnFmdjB0MDNBaEJmVkVxaUt2dis5WTNKbk9ZR3V5aVRIOGRrb0hLcWM4UC8vYTMydXR1dTdQQ2pQOGFIZ25ubkxTWnk4ZGpTRW5wNkQzdnpRbTFrZnBKT1lWc0RmOTdPa2RoZURRdEt4bDVxMlRzV2oydGhEMjdDWU1ZSEloSktaMjRMb1FJcGxTT1lDV1Q4cXJSekFCU3BJZ2RmMXNSaS9POEFpcWdUZjhKRkxuRDc2SmFMVFFHVkVUNllXZ3pNWDRneFQ2KzgxQ3JpRXJOTm5QL1BuUW9FYU9FNU10L04rNFcrdGNlWTRtSWxCWFAzT3RiMFl2OG44RURLZUF3ZHZlM1ZyU0kyOWFkRmtQeEVFNS81SzBURVpCL2VyNG9ZSVVMTDNyN2pnam01NmNNNXBLS0J2RXduMXlJd01hM1BIN0k4SkFzSkl5S0FnMC8vZGR2eUpndmZLUzYzK0dISEQ1U0hheXlPQ0tocFFlN3ZiaDh3Z0E3Ly91UGYreVlhdVQxM1pjZGZzamUrdzVuV0xhUjBGS1NUemprcXdKTVpHRml5MVJqMjRhSjFhczNOM2MvOExoRDl0dXJYS3RYS3lXSUlLU2xRUENUWDkxRWEwY0FrenZmdG1iMTMxYnRjRzFnMmZESTJFRHRrRnB0Tk95V2dkSXdGcWlGZmZKUlgyclQwaGl3RExQYnAzZHUycng5ZkQ2Znl2TjVEbmo1TUJ3bDljVTJJVmdMV2VZb0NjTFFWYi9zckswQmJNQUxlV05uWTJFNi92bTloOTE0eHRoZ1BSZ3dBWUZqRjRINWhabXRHMWY4Nm8vN1AzSFlIbDcrVGNiMlBQcUo0M3JTcVRFR3hLN3ZmbjM3bnFQNzdqR2N3ZUNCQjFkaDFjOUdLeG1RVlJiTnpZeHYyem8xdVNXRW9EWHZteHM3NEZneHZ2WGYvMVNmMnRzb1gvVy9OV3ZHRzRibVZQbnlTdy9jOHZiTnVRRkhDNWRLbFpwQ0ZpUkVjOU9LTlJLR1NMSWkyalRuNTIwYU8vNzF6VCtkK3VicHYyOUVJRFpsbEdWQmlxYTFUZkkyZ0kzQnlOdSsvTk5SK2kwbjFiWFJkdlhOTEdHRCtYOFpBRlpRT0NCUUJnQUE4QndBblFFcVlBQkhBRDV0THBKR3BDS2hvU3EwM1ppQURZbHNBTW1GNzFzZWNuNFg4aXZhYXRyK1ArKzNPSEhVaFRmZGp2cFBNQit1dit4L3VYdlArakwrK2VvQi9WZW82OUFEeTFQWTQvY1g5d1BhRi8rdDZQL284ZngwUXQxbGxhVithZDVEUHEvMkRkMGEvWTV1L1diYnk1eU9CMWhVbFRNaitLVDdSMXMveWU3T2w5eDJJZlQyNy9yS2ZJNkZuTnVBZ1Fwc1VJZTBoWnpnUDhHVWR2ZEk1UDBkdFpJTUJwbkJtZWJwWC9pakF2WE1iU2tVOTZCZ3ZhNjR4UFA2aUlRNFFWQnl4MUVzeXpFTTdacnRETzVFUlZNclRYb0dLbG9ydGdjczFRV1R6ODdDTW5sTE8wS2puK1dkQ2haZ0FQNy91V2YvL3FrQ3A2VEovbHpaL3cxN0oyaWNkeGRBMmxYempMNng5cCs2TStNd1NoWkpHU1BxbysrZFdzSDBielErRVFISjNPME9ieEFFdFFOMWJNekQrUXNHejF4L2QvQmVMS0JjOWR1dkxFL09Ebi91dURtWEM4UlhMbTY2YlhPaE84c3Z4cFpGVjVDQmxuVEJKaU5FR1VsYmlZaVp5a1FRSnFkYXJ2dysrWGtjY1UzRHpLUHZWZTMvMXdPb2krME9TZmdXNEZDb0RHRUxoY3I3cXAzdndMQ2FkOCtPNWVLdEFnWjFyRDd1cC92dVAzc1hTTGVoampUaWV6WWY0VTNLTytVcXZTK0tZQUxlS0ZQWW1RZ0JtK1lhQnJXWmlibndGaEw3d0F0MFhORVczTGNrcld0VkpTTW5hK0N6ai9IV1lLTzZ5TjhPT3dFVTZKVHIveXFuaVVpTGx1ZXJNNzFjcXZhbzU5Wnc2Tm0xeXFCYUxFZ1ZQYWMxWjhVRDV3azE2c1luMEwwR1JFTEVJTlpKNmNvbEZFcGV5RXQ5OCthbmc1aXVKa2E3bi9EdGdjc3p3bFQyRldZd0N2UzQydEgxekJaTE02VXk3dStjSHlDM3VLcnBEOUFEZEhwdUJuMWZmYU5oR3BkSWpCZFhIYS9uQmQ5T0JPclFRZ1hEMnVyUCtrRWxYb2w0TjNGTE5iSWdaOG5WYmsvZktXWVM4bmt4bi9vQlFlV3Q5Rm9GMkNTOGpSSjhLejEyNU0vamtGWVI0Z2VSTHNDWUxRSWU0Nk5aYnFKaE1uZlpva1oxTmZZcC9EdzI5Y3NEcWdYL1YvcFlSQkpWdXV1aEM3eEY4S2ozT21RSHlXWm1MZGxmbTJ0M0k4blhEYlN2VEFodkVrUzYyZE1GNUp3OWQyajJzeWFEZzlwSTI4VmtvTjFueXYyczJzOXg4MkdIeFAyUVY4ODJjN0JIallCQUpTSGEzTXhHSUdSQ1MrQlJmNm5oNmdMNjJJeGx6KzBTQU5yeXo5aWVWc2lmK2pBQmZ4bTYvajljSys2OGZDck9HMFF3b3R2NWxsUkc1ZVh2TkE1bytIY01EU3JaZ05kMHZsUHZKbG1ud01ZcGM4dThlWWd6VjJUSFM0bUI4Q1BhTHhNNnptcENIYUt2S2N0bG5qb1l3dFVhQkx6ZFpybzhtWTJOVldOSDF6WjVLUVFicHB0clVoVE9DWGl5VW00bW91ZFNhVmRtYlRqTUQzYmd0SkltS1A4U1hrUHJydVBzUGp4TjR4TGsvTEZoeHd1QjhEKzZxTmRXVkZxS2J5ckhPRTRmUFlxQUR0ZHhwYlUzcEx6SjdIb1ZBNW9LaWVtSU1mNG95N2pwbzdidkh6WC82WmIvUXpteGdQbnpnenNZRmYxc0toRkdOaWd4K1BUWVpZRjhNMHlsZ09zbElRcHlvMithbDFaQzlmdXRRSEp2UytUMlJWd3oxenVpcFFYclkxdFdJL0tqN09QdjZINUVFS1kvSXJvTmYwek1aSjA4VUQ3eWg2WGRuUVhKNmZJVld2Y0haSDV4bHZWTjRtanNlNUhNQUd3cCtNQVQvL0doZVBsTzB2RHd1MHd5TUVrb2xsakhEbDFnZGJZNWNzSWtQMC9WVUcwc2w2ZjB2bWdmQUo4VHpXS1BVckVtNTJxMXpsWk5sRHRHL2h1eGRYR2VqUy9QWXNkSXEyMjRtb1lzTkV1ZmZ4SEhQai9FL2lTRWZEYzBYbUZ6RVQ4NGkzUkdQM1dockRiVCs0S0lQeWVhK0dqOWEzdU9xQ0hzYldoWVpYd2RFSk0zTmQ2R3c4aEp6dnVPbEJPYjhYcGsyNjgzaTFtNXpZV2o1RHEvNEoveHVObm9VRmZ5Tjl1bTRyWHg4NXBQSWhIVTlwZkJyMnlIOXM2cCtPSHZuRnJ1UGxZdk95OHJTdGN0Qm91blRIOGMya1lNdm9QVG0valRpUWRyOEgwUXdCNkUvY3QzRExLWjI5TzVicmQ4OEdWSE1LdnVnRklWQTh0TUtuUVA1eHRuWkMvYk5Ja1hwbXF5aFZscHZCU0F3TlRkS1F1UkwvaGRhUDBXK3NGQWlzRnN2QjA4NmtaQnBRL0hlclRHS0JicDQ0cmsxRDJUSThlUFhHM01hdjZJck5Gc0VNV2dXWjFFazJ4QjBWODhuMk5Yc1o4MVh0aElyMTJ6VjQzekpvQmUrMmNyVS85SExxMXdqbUJlakorNDRuWGpCSEpKdU8zT3Q0YU9nZDV5WlpLcmlUSUxTdndhWnlCN3B4bjdWVFZRRGEyOTI3Q1VSd0l3bnBwOW1ZSkozdFJZYk1sM1NTSzZzWXhJQXZqL3Q5dHdzNS81bWNhMUs0QTdSQVBvR2Z3a3dDS2p0TzBxNElzKzV1MWVjRjRUWnNSVERlZGY2NWJCRlJ1NXZNQS9PSHp3QUFBPSI+PC9pbWFnZT4NCiAgICA8YW5pbWF0ZVRyYW5zZm9ybQ0KICAgICAgYXR0cmlidXRlTmFtZT0idHJhbnNmb3JtIg0KICAgICAgYXR0cmlidXRlVHlwZT0iWE1MIg0KICAgICAgdHlwZT0icm90YXRlIg0KICAgICAgZnJvbT0iMCA0OCA0OCINCiAgICAgIHRvPSIzNjAgNDggNDgiDQogICAgICBkdXI9IjJzIg0KICAgICAgcmVwZWF0Q291bnQ9ImluZGVmaW5pdGUiDQogICAgPjwvYW5pbWF0ZVRyYW5zZm9ybT4NCiAgPC9nPg0KPC9zdmc+DQo=`,
      blocks: [
        {
          blockType: BlockType.CONDITIONAL,
          opcode: 'scope',
          func: 'block_scope',
          text: Scratch.translate('new scope'),
          branchCount: 1,
        },
        '---',
        {
          blockType: BlockType.COMMAND,
          opcode: 'set',
          func: 'block_varSet',
          text: Scratch.translate('set this scopes variable [A1] to [A2]'),
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
          opcode: 'setSlow',
          func: 'block_varSetSlow',
          text: Scratch.translate('set scoped variable [A1] to [A2]'),
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
          text: Scratch.translate('change scoped variable [A1] by [A2]'),
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
          text: Scratch.translate('clear this scopes variables'),
          arguments: {},
        },
        {
          blockType: BlockType.COMMAND,
          opcode: 'varDelete',
          func: 'block_varDelete',
          text: Scratch.translate('remove this scopes variable [A1]'),
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
          text: Scratch.translate('is scoped variable [A1] in scope?'),
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
          text: Scratch.translate('get scoped variable [A1]'),
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
          blockType: BlockType.COMMAND,
          opcode: 'scopeUnlink',
          func: 'block_scopeUnlink',
          text: Scratch.translate('disinherit parent variables'),
          arguments: {},
        },
        {
          blockType: BlockType.REPORTER,
          opcode: 'scopeDump',
          func: 'block_scopeDump',
          text: Scratch.translate('dump scope'),
          arguments: {},
          disableMonitor: true,
        },
        {
          blockType: BlockType.REPORTER,
          opcode: 'scopeDumpMerged',
          func: 'block_scopeDumpMerged',
          text: Scratch.translate('dump scope (flat)'),
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
  Extension.prototype._findScope = function _findScope(thread, cond, doDefault) {
    const root = this._getScope(thread);
    let scope = root;
    while (scope && !cond(scope)) {
      scope = Object.getPrototypeOf(scope);
    }
    return doDefault ? (scope ?? root) : scope;
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
    this._getScope(util.thread)[Cast.toString(args.A1)] = args.A2;
    return '';
  };
  Extension.prototype.block_varSetSlow = function block_varSet(args, util) {
    const A1 = Cast.toString(args.A1);
    this._findScope(util.thread, (scope) => Object.prototype.hasOwnProperty.call(scope, A1),  true)[A1] = args.A2;
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
  Extension.prototype.block_scopeUnlink = function block_scopeUnlink(_args, util) {
    Object.setPrototypeOf(this._getScope(util.thread), null);
    return '';
  };

  {
    const exports = {
      __proto__: null,
      Thread, _StackFrame,
      // Magic version value for internal purposes.
      blue_haired_enigma: '9EEADi^^HHH]J@FEF36]4@>^oD6?K2H2',
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
          return `${this.variable}[${variable}] = ${value};`;
        }
        setSlow(variable, value) {
          const varl = `varl_${this.manager.variables.next()}`;
          const val = `val_${this.manager.variables.next()}`;
          const scope = `scope_${this.manager.variables.next()}`;
          return `;{
            const ${varl} = ${variable};
            const ${val} = ${value};
            if (Object.prototype.hasOwnProperty.call(${this.variable}, ${varl})) {
              ${this.variable}[${varl}] = ${val};
            } else {
              let ${scope} = Object.getPrototypeOf(${this.variable});
              while(${scope} && !Object.prototype.hasOwnProperty.call(${scope}, ${varl})) {
                ${scope} = Object.getPrototypeOf(${scope});
              }
              (${scope} ?? ${this.variable})[${varl}] = ${val};
            }
          };`;
        }
        changeBy(variable, value) {
          return `${this.variable}[${variable}] = (+${this.variable}[${variable}] || 0) + ${value};`;
        }
        deleteAll() {
          const i = `i_${this.manager.variables.next()}`;
          const keys = `keys_${this.manager.variables.next()}`;
          const keysLength = `keysLength_${this.manager.variables.next()}`;
          return `;{
            const ${keys} = Object.getOwnPropertyNames(${this.variable}), ${keysLength} = ${keys}.length;
            for (let ${i} = 0; ${i} < ${keysLength}; ++${i}) {
              delete ${this.variable}[${keys}[${i}]];
            };
          };`;
        }
        delete(variable) {
          return `void(delete ${this.variable}[${variable}]);`;
        }
        unlink() {
          return `Object.setPrototypeOf(${this.variable}, null);`;
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
          case `${EXTENSION_ID}_setSlow`:
            node = new JSExports.IntermediateStackBlock(block.opcode, {
              name: this.descendInputOfBlock(block, 'A1', true).toType(JSExports.InputType.STRING),
              value: this.descendInputOfBlock(block, 'A2', true),
            }, false);
            break;
          case `${EXTENSION_ID}_varChangeBy`:
            node = new JSExports.IntermediateStackBlock(block.opcode, {
              name: this.descendInputOfBlock(block, 'A1', true).toType(JSExports.InputType.STRING),
              value: this.descendInputOfBlock(block, 'A2', true).toType(JSExports.InputType.NUMBER),
            }, false);
            break;
          case `${EXTENSION_ID}_scopeUnlink`:
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
        node.$ = block;
        return node;
      };

      //#region JSG (1)

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

        switch(node && node.$ && node.$.opcode) {
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

        switch(node && node.$ && node.$.opcode) {
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
          case `${EXTENSION_ID}_setSlow`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.setSlow(this.descendInput(node.inputs.name), this.descendInput(node.inputs.value));
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
          case `${EXTENSION_ID}_scopeUnlink`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.unlink();
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
          case `${EXTENSION_ID}_setSlow`:
          case `${EXTENSION_ID}_varChangeBy`:
            node = {
              inputs: {
                name: this.descendInputOfBlock(block, 'A1'),
                value: this.descendInputOfBlock(block, 'A2'),
              },
            };
            break;
          case `${EXTENSION_ID}_scopeUnlink`:
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

        switch(node && node.$ && node.$.opcode) {
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

        switch(node && node.$ && node.$.opcode) {
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
          case `${EXTENSION_ID}_setSlow`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.setSlow(this.descendInput(node.inputs.name).asString(), this.descendInput(node.inputs.value).asUnknown());
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
          case `${EXTENSION_ID}_scopeUnlink`: {
            const scope = ScopeManager.findScope(this);
            this.source += scope.unlink();
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
