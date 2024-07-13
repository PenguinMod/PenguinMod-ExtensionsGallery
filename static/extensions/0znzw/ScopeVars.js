/**!
 * Scope Variables (Compiled)
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.1.2
 * @copyright MIT License
 * Original Idea: SinanShiki & SkyHigh173
 * Do not remove this comment
 */
(function (Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Scope Variables (Compiled)" extension must be ran unsandboxed.`);
    }

    const vm = Scratch.vm,
        runtime = vm.runtime;

    /**!
     * Compiler-Utility [v2.1.1] created by 0znzw.
     * https://scratch.mit.edu/users/0znzw/
     * Patch code by CST1229
     * https://scratch.mit.edu/users/CST1229/
     * Licensed under MIT license.
     * DO NOT REMOVE THIS COMMENT
     * Production
     */
    // just uh set the output to a variable :D
    // prettier-ignore
    /* eslint-disable */
    // @ts-ignore
    var get$compilerUtility=function(e){const t=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n=window.vm,r=e;let o={_:"FAIL"};t(r,"enableDebug")||(r.enableDebug=!1),t(r,"vmExpose")||(r.vmExpose=!0);const s={missing_tw:{GTBAYWNRAS:"Could not find export for i_will_not_ask_for_help_when_these_break.",everything:"WARNING, Turbowarp is missing these exports:\n        jsexecute\n        CompileThread\n        TypedInput\n        ConstantInput\n        Frame",ST:"Could not find export for ScriptTreeGenerator."},missing_else:{exports:"Could not find working compiler exports :cri:",IR:"Could not find export for IRGenerator.",JS:"Could not find export for JSGenerator.",JE:"Could not find export for jsexecute.",ST_IR:"Could not find ScriptTreeGenerator in IRGenerator exports.",CI_JS:"Could not find ConstantInput in JSGenerator exports.",TI_JS:"Could not find TypedInput in JSGenerator exports.",F_JS:"Could not find Frame in JSGenerator exports."}};function i(){const e=console,t={toBoolean:e=>"number"==typeof e?e>0:Boolean(e)};return{ConstantInput:class{constructor(e,t){this.constantValue=e,this.safe=t}asNumber(){const e=+this.constantValue;return e?e.toString():Object.is(e,-0)?"-0":"0"}asNumberOrNaN(){return this.asNumber()}asString(){return`"${t=""+this.constantValue,"string"!=typeof t&&(e.warn("sanitize got unexpected type: "+typeof t),t=""+t),JSON.stringify(t).slice(1,-1)}"`;var t}asBoolean(){return t.toBoolean(this.constantValue).toString()}asColor(){if(/^#[0-9a-f]{6,8}$/i.test(this.constantValue)){const e=this.constantValue.substr(1);return Number.parseInt(e,16).toString()}return this.asUnknown()}asUnknown(){return"number"==typeof this.constantValue||(+this.constantValue).toString()===this.constantValue?this.constantValue:this.asString()}asSafe(){return this.safe?this.asUnknown():this.asString()}isAlwaysNumber(){const e=+this.constantValue;return!Number.isNaN(e)&&(0!==e||""!==this.constantValue.toString().trim())}isAlwaysNumberOrNaN(){return this.isAlwaysNumber()}isNeverNumber(){return Number.isNaN(+this.constantValue)}},TypedInput:class{constructor(e,t){if("number"!=typeof t)throw new Error("type is invalid");this.source=e,this.type=t}asNumber(){return 1===this.type?this.source:5===this.type?`(${this.source} || 0)`:`(+${this.source} || 0)`}asNumberOrNaN(){return 1===this.type||5===this.type?this.source:`(+${this.source})`}asString(){return 2===this.type?this.source:`("" + ${this.source})`}asBoolean(){return 3===this.type?this.source:`toBoolean(${this.source})`}asColor(){return this.asUnknown()}asUnknown(){return this.source}asSafe(){return this.asUnknown()}isAlwaysNumber(){return 1===this.type}isAlwaysNumberOrNaN(){return 1===this.type||5===this.type}isNeverNumber(){return!1}},Frame:class{constructor(e){this.isLoop=e,this.isLastBlock=!1}}}}if(!function(){if(!t(n.exports,"Compiler")||!r.vmExpose){if(function(){const e=n.exports,t=e?.i_will_not_ask_for_help_when_these_break?.(),r=s.missing_tw,a=s.missing_else,p=[];if(!t)return console.warn("Unable to find i_will_not_ask_for_help_when_these_break"),console.debug("Assuming the user is not using base turbowarp."),!1;const u=t.IRGenerator,c=t.JSGenerator,l=t.ScriptTreeGenerator;if(u||p.push(a.IR),c||p.push(a.JS),l||p.push(r.ST),p.length>0)return p.forEach((e=>console.warn(e))),!1;console.warn(r.everything),console.debug("Dont worry we can fake the InputTypes");const _=i(),h=_.ConstantInput,d=_.TypedInput,m=_.Frame;return console.debug("Copying ScriptTreeGenerator to IRGenerator exports for compatibility."),u.exports=u.exports??{},u.exports.ScriptTreeGenerator=l,console.debug("Copying Inputs to JSGenerator exports for compatibility."),c.exports=c.exports??{},c.exports.Frame=m,c.exports.ConstantInput=h,c.exports.TypedInput=d,o={_:"TURBOWARP_LIMITED",IRGenerator:u,JSGenerator:c,ScriptTreeGenerator:l,Frame:m,ConstantInput:h,TypedInput:d},!0}())return;const e=s.missing_else,t=n.exports,r=[],a=t?.IRGenerator,p=t?.JSGenerator,u=t?.jsexecute,c=a?.exports?.ScriptTreeGenerator,l=p?.exports?.ConstantInput,_=p?.exports?.TypedInput,h=p?.exports?.Frame;return a||r.push(e.IR),p||r.push(e.JS),u||r.push(e.JE),r.length>0&&r.push("The following errors are most likely from missing top level exports."),c||r.push(e.ST_IR),l||r.push(e.CI_JS),_||r.push(e.TI_JS),h||r.push(e.F_JS),r.length>0?(o={_:"FAIL"},r.forEach((e=>console.warn(e))),!1):(o={_:"FULL",Frame:h,ConstantInput:l,TypedInput:_,ScriptTreeGenerator:c,IRGenerator:a,JSGenerator:p,jsexecute:u},2)}return!0}())return!1;r.enableDebug&&n.enableDebug();const a={compilerExport:o,utilityVersion:2,__internal__:{descendStackedBlock_JSG(e,t){const n=a.nodeMixin.__internal__.mixins,r=t.kind;let o=n[r];if(!o&&n["*"]&&(o=n["*"]),!o)return e(t);if("function"==typeof o){const e=this.source;this.source="",this.overrideSource=e;let n=function(...e){return this.$patches.descendStackedBlock.apply(this,[t]),this}.bind(this);o=o.apply(this,[n,t]),e!==this.overrideSource?this.source=this.overrideSource:this.source=e}this.source+=`/*mixin:${r}*/${o}`,this.source.endsWith("\n")||(this.source+="\n")},descendInput_JSG(e,t){const n=a.jsInputMixin.__internal__.mixins;let r=n[t.kind];return!r&&n["*"]&&(r=n["*"]),r?("function"==typeof r&&(r=r.apply(this,[e,t])),r):e(t)},descendInput_STG(e,t){const n=a.inputMixin.__internal__.mixins[t.opcode];return n?"function"==typeof n?n.apply(this,[t]):n:e(t)},descendStackedBlock_STG(e,t){const n=a.blockMixin.__internal__.mixins[t.opcode];return n?"function"==typeof n?n.apply(this,[t]):n:e(t)},descendStackedBlock_IRG(e,t){const n=a.irBlockMixin.__internal__.mixins[t.opcode];return n?"function"==typeof n?n.apply(this,[t]):void 0:e(t)}},type:{NUMBER:1,STRING:2,BOOLEAN:3,UNKNOWN:4,NAN:5},tools:{JSGenerator:o.JSGenerator,jsexecute:o?.jsexecute,IRGenerator:o.IRGenerator,compileThread:o?.compileThread,ScriptTreeGenerator:o.IRGenerator.exports.ScriptTreeGenerator,VariablePool:class{constructor(e){if(0===e.trim().length)throw new Error("prefix cannot be empty");this.prefix=e,this.count=0}next(){return`${this.prefix}${this.count++}`}}},inputs:{Typed:o.JSGenerator.exports.TypedInput,Constant:o.JSGenerator.exports.ConstantInput,Frame:o.JSGenerator.exports.Frame},pen:{ext:"runtime.ext_pen",state:"runtime.ext_pen._getPenState(target)"},inputMixin:{__internal__:{mixins:{}},register(e,t){this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]}},jsInputMixin:{__internal__:{mixins:{}},register(e,t){this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]}},blockMixin:{__internal__:{mixins:{}},register(e,t){"function"!=typeof t&&console.warn("Hey mixin needs to be a function or it wont register!"),this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]}},irBlockMixin:{__internal__:{mixins:{}},register(e,t){this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]}},nodeMixin:{__internal__:{mixins:{}},register(e,t){this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]},new:(e,t)=>`${e}.${t}`,newStgMixin:(e,t)=>({kind:`${e}.${t}`})}};let p=a.__internal__;const u="$patches",c=(e,t)=>{if(!e[u]){e[u]={};for(const n in t){const r=e[n];e[u][n]=e[n],e[n]=r?function(...e){return t[n].call(this,((...e)=>r.call(this,...e)),...e)}:function(...e){return t[n].call(this,(()=>{}),...e)}}}},l=e=>{if("object"==typeof e[u]){for(const t in Object.keys(e[u])){const n=e[u][t];e[t]=n}e[u]=void 0}},_=a.tools.JSGenerator,h=a.tools.ScriptTreeGenerator,d=a.tools.IRGenerator,m=_.prototype,x=h.prototype;return d.prototype,l(m),l(x),c(m,{descendStackedBlock:p.descendStackedBlock_JSG,descendInput:p.descendInput_JSG}),c(x,{descendInput:p.descendInput_STG,descendStackedBlock:p.descendStackedBlock_STG}),r.vmExpose&&(n.exports.Compiler=o,n.constructor.prototype.compiler=a,n.compiler=a),{Compiler:a,compilerExport:o}};
    /* eslint-enable */
    /** WARNING
     * Turbowarp may or may not support some API's.
     * Also this may be outdated and not work anymore.
     * Use at your own risk
     */

    const CompilerUtil = get$compilerUtility({ vmExpose: false });

    class ScopeVars {
        getInfo() {
            return {
                id: '0zCsv',
                /* u could probally remove the "Compiled" part if you want */
                name: 'Scope Variables (Compiled)',
                /* *cough* steal color *cough* */
                color1: '#9999FF',
                blocks: [
                    {
                        blockType: Scratch.BlockType.CONDITIONAL,
                        opcode: 'scope',
                        func: 'nc',
                        text: 'scope',
                    },
                    {
                        blockType: Scratch.BlockType.COMMAND,
                        opcode: 'set',
                        func: 'nc',
                        text: 'set var [A1] to [A2]',
                        arguments: {
                            A1: {
                                type: Scratch.ArgumentType.STRING,
                            },
                            A2: {
                                type: Scratch.ArgumentType.STRING,
                            },
                        },
                    },
                    {
                        blockType: Scratch.BlockType.REPORTER,
                        opcode: 'get',
                        func: 'nc',
                        text: 'get var [A1]',
                        arguments: {
                            A1: {
                                type: Scratch.ArgumentType.STRING,
                            },
                        },
                    },
                ],
                menus: {},
            };
        }
        nc(_, $) {
            runtime.visualReport($.thread.peekStack(), 'compiler only');
        }
    }

    function sanitizeForEmbed(wrap, string) {
        // @ts-ignore Overdated syntax
        return String(string).replaceAll('\\', '\\\\').replaceAll(wrap, `\\${wrap}`);
    }

    const compiler = CompilerUtil.Compiler;
    compiler.blockMixin.register('0zCsv_scope', function (block) {
        return {
            kind: '0zCsv.scope',
            stack: this.descendSubstack(block, 'SUBSTACK'),
        };
    });
    compiler.blockMixin.register('0zCsv_set', function (block) {
        return {
            kind: '0zCsv.set',
            args: {
                A1: this.descendInputOfBlock(block, 'A1'),
                A2: this.descendInputOfBlock(block, 'A2'),
            },
        };
    });
    compiler.blockMixin.register('0zCsv_get', function (block) {
        return {
            kind: '0zCsv.get',
            blockId: block.id,
            args: {
                A1: this.descendInputOfBlock(block, 'A1'),
            },
        };
    });
    compiler.inputMixin.register('0zCsv_get', function (block) {
        return {
            kind: '0zCsv.get',
            blockId: block.id,
            args: {
                A1: this.descendInputOfBlock(block, 'A1'),
            },
        };
    });

    compiler.nodeMixin.register('0zCsv.scope', function (original, node) {
        // @ts-ignore
        const oldSrc = this.overrideSource;
        // @ts-ignore
        this.descendStack(node.stack, new compiler.inputs.Frame(false));
        const stack = this.source;
        this.source = '';
        // @ts-ignore
        this.descendStack(node.stack, new compiler.inputs.Frame(false));
        const src = `\n${oldSrc}\n/*rewrite data from src override ^ */(yield* (function*() {
                ${stack}
                }).call({ scoped: true, svars: (this.scoped ? structuredClone(this.svars) : {}) }))`;
        return src;
    });
    compiler.nodeMixin.register('0zCsv.set', function (original, node) {
        let { A1, A2 } = node.args;
        A1 = this.descendInput(A1).source ?? `'${sanitizeForEmbed("'", A1.value)}'`;
        A2 = this.descendInput(A2).source ?? `'${sanitizeForEmbed("'", A2.value)}'`;
        return `if (this.scoped) this.svars[${A1}] = (${A2});`;
    });

    compiler.nodeMixin.register('0zCsv.get', function (original, node) {
        return `runtime.visualReport('${node.blockId}', '');`;
    });
    compiler.jsInputMixin.register('0zCsv.get', function (original, node) {
        const TypedInput = compiler.inputs.Typed;
        const TYPE_UNKNOWN = compiler.type.UNKNOWN;
        let { A1 } = node.args;
        A1 = this.descendInput(A1).source ?? `'${sanitizeForEmbed("'", A1.value)}'`;
        return new TypedInput(`((this.scoped ? this.svars[${A1}] : ''))`, TYPE_UNKNOWN);
    });

    // @ts-ignore
    Scratch.extensions.register(new ScopeVars());
})(Scratch);
