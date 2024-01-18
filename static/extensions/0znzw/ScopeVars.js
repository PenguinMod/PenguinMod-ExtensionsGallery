/**!
 * Scope Variables (Compiled)
 * @author 0znzw https://scratch.mit.edu/users/0znzw/
 * @version 1.0
 * @copyright MIT License
 * Original Idea: SinanShiki & SkyHigh173
 * Do not remove this comment
 */
(function(Scratch) {
    if (!Scratch.extensions.unsandboxed) {
        throw new Error(`"Scope Variables (Compiled)" extension must be ran unsandboxed.`);
    }

    const vm = Scratch.vm, runtime = vm.runtime;
    // @ts-ignore
    if (!vm?.compiler){
        /**!
         * Compiler-Utility [v1.9] created by 0znzw.
         * https://scratch.mit.edu/users/0znzw/
         * Patch code by CST1229
         * https://scratch.mit.edu/users/CST1229/
         * Licensed under MIT license.
         * DO NOT REMOVE THIS COMMENT
         * Development
         */
        // @ts-ignore
        // prettier-ignore
        function anon$compilerUtility(e){const t=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),n=window.vm,r=e;t(r,"enableDebug")||r.enableDebug;const o={missing_tw:{GTBAYWNRAS:"Could not find export for guaranteed_to_break_and_you_will_not_receive_support.",everything:"WARNING, Turbowarp is missing these exports:\n    jsexecute\n    CompileThread\n    TypedInput\n    ConstantInput\n    Frame",ST:"Could not find export for ScriptTreeGenerator."},missing_else:{exports:"Could not find working compiler exports :cri:",IR:"Could not find export for IRGenerator.",JS:"Could not find export for JSGenerator.",JE:"Could not find export for jsexecute.",ST_IR:"Could not find ScriptTreeGenerator in IRGenerator exports.",CI_JS:"Could not find ConstantInput in JSGenerator exports.",TI_JS:"Could not find TypedInput in JSGenerator exports.",F_JS:"Could not find Frame in JSGenerator exports."}};function i(){const e=console,t={toBoolean:e=>"number"==typeof e?e>0:Boolean(e)};return{ConstantInput:class{constructor(e,t){this.constantValue=e,this.safe=t}asNumber(){const e=+this.constantValue;return e?e.toString():Object.is(e,-0)?"-0":"0"}asNumberOrNaN(){return this.asNumber()}asString(){return`"${t=""+this.constantValue,"string"!=typeof t&&(e.warn("sanitize got unexpected type: "+typeof t),t=""+t),JSON.stringify(t).slice(1,-1)}"`;var t}asBoolean(){return t.toBoolean(this.constantValue).toString()}asColor(){if(/^#[0-9a-f]{6,8}$/i.test(this.constantValue)){const e=this.constantValue.substr(1);return Number.parseInt(e,16).toString()}return this.asUnknown()}asUnknown(){if("number"==typeof this.constantValue)return this.constantValue;return(+this.constantValue).toString()===this.constantValue?this.constantValue:this.asString()}asSafe(){return this.safe?this.asUnknown():this.asString()}isAlwaysNumber(){const e=+this.constantValue;return!Number.isNaN(e)&&(0!==e||""!==this.constantValue.toString().trim())}isAlwaysNumberOrNaN(){return this.isAlwaysNumber()}isNeverNumber(){return Number.isNaN(+this.constantValue)}},TypedInput:class{constructor(e,t){if("number"!=typeof t)throw new Error("type is invalid");this.source=e,this.type=t}asNumber(){return 1===this.type?this.source:5===this.type?`(${this.source} || 0)`:`(+${this.source} || 0)`}asNumberOrNaN(){return 1===this.type||5===this.type?this.source:`(+${this.source})`}asString(){return 2===this.type?this.source:`("" + ${this.source})`}asBoolean(){return 3===this.type?this.source:`toBoolean(${this.source})`}asColor(){return this.asUnknown()}asUnknown(){return this.source}asSafe(){return this.asUnknown()}isAlwaysNumber(){return 1===this.type}isAlwaysNumberOrNaN(){return 1===this.type||5===this.type}isNeverNumber(){return!1}},Frame:class{constructor(e){this.isLoop=e,this.isLastBlock=!1}}}}if(!function(){if(!t(n.exports,"Compiler")){if(function(){const e=n.exports,t=e?.guaranteed_to_break_and_you_will_not_receive_support?.(),r=o.missing_tw,s=o.missing_else,a=[];if(!t)return console.warn("Unable to find guaranteed_to_break_and_you_will_not_receive_support"),console.debug("Assuming the user is not using base turbowarp."),!1;const u=t.IRGenerator,c=t.JSGenerator,p=t.ScriptTreeGenerator;if(u||a.push(s.IR),c||a.push(s.JS),p||a.push(r.ST),a.length>0)return a.forEach((e=>console.warn(e))),!1;console.warn(r.everything),console.debug("Dont worry we can fake the InputTypes");const l=i(),_=l.ConstantInput,h=l.TypedInput,d=l.Frame;return e.Compiler={_:"TURBOWARP_LIMITED",IRGenerator:u,JSGenerator:c,ScriptTreeGenerator:p,Frame:d,ConstantInput:_,TypedInput:h},!0}())return;const e=o.missing_else,t=n.exports,r=[],s=t?.IRGenerator,a=t?.JSGenerator,u=t?.jsexecute,c=s?.exports?.ScriptTreeGenerator,p=a?.exports?.ConstantInput,l=a?.exports?.TypedInput,_=a?.exports?.Frame;return s||r.push(e.IR),a||r.push(e.JS),u||r.push(e.JE),r.length>0&&r.push("The following errors are most likely from missing top level exports."),c||r.push(e.ST_IR),p||r.push(e.CI_JS),l||r.push(e.TI_JS),_||r.push(e.F_JS),r.length>0?(t.Compiler={_:"FAIL"},r.forEach((e=>console.warn(e))),!1):(t.Compiler={_:"FULL",Frame:_,ConstantInput:p,TypedInput:l,ScriptTreeGenerator:c,IRGenerator:s,JSGenerator:a,jsexecute:u},2)}return!0}())return!1;n.enableDebug();const s=n.exports.Compiler;n.compiler={compilerExport:s,utilityVersion:1.9,__internal__:{descendStackedBlock_JSG(e,t){const r=n.compiler.nodeMixin.__internal__.mixins,o=t.kind;let i=r[o];if(!i&&r["*"]&&(i=r["*"]),!i)return e(t);if("function"==typeof i){const e=this.source;this.source="",this.overrideSource=e;let n=function(...e){return this.$patches.descendStackedBlock.apply(this,[t]),this}.bind(this);i=i.apply(this,[n,t]),e!==this.overrideSource?this.source=this.overrideSource:this.source=e}this.source+=`/*mixin:${o}*/${i}`,this.source.endsWith("\n")||(this.source+="\n")},descendInput_JSG(e,t){const r=n.compiler.jsInputMixin.__internal__.mixins;let o=r[t.kind];return!o&&r["*"]&&(o=r["*"]),o?("function"==typeof o&&(o=o.apply(this,[e,t])),o):e(t)},descendInput_STG(e,t){const r=n.compiler.inputMixin.__internal__.mixins[t.opcode];return r?"function"==typeof r?r.apply(this,[t]):r:e(t)},descendStackedBlock_STG(e,t){const r=n.compiler.blockMixin.__internal__.mixins[t.opcode];return r?"function"==typeof r?r.apply(this,[t]):r:e(t)},descendStackedBlock_IRG(e,t){const r=n.compiler.irBlockMixin.__internal__.mixins[t.opcode];return r?"function"==typeof r?r.apply(this,[t]):void 0:e(t)}},type:{NUMBER:1,STRING:2,BOOLEAN:3,UNKNOWN:4,NAN:5},tools:{JSGenerator:s.JSGenerator,jsexecute:s?.jsexecute,IRGenerator:s.IRGenerator,compileThread:s?.compileThread,ScriptTreeGenerator:s.IRGenerator.exports.ScriptTreeGenerator},inputs:{Typed:s.JSGenerator.exports.TypedInput,Constant:s.JSGenerator.exports.ConstantInput,Frame:s.JSGenerator.exports.Frame},pen:{ext:"runtime.ext_pen",state:"runtime.ext_pen._getPenState(target)"},inputMixin:{__internal__:{mixins:{}},register(e,t){this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]}},jsInputMixin:{__internal__:{mixins:{}},register(e,t){this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]}},blockMixin:{__internal__:{mixins:{}},register(e,t){"function"!=typeof t&&console.warn("Hey mixin needs to be a function or it wont register!");this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]}},irBlockMixin:{__internal__:{mixins:{}},register(e,t){this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]}},nodeMixin:{__internal__:{mixins:{}},register(e,t){this.__internal__.mixins[e]=t},remove(e){delete this.__internal__.mixins[e]},new:(e,t)=>`${e}.${t}`,newStgMixin:(e,t)=>({kind:`${e}.${t}`})}};let a=n.compiler.__internal__;const u="$patches";const c=(e,t)=>{if(!e[u]){e[u]={};for(const n in t){const r=e[n];e[u][n]=e[n],e[n]=r?function(...e){return t[n].call(this,((...e)=>r.call(this,...e)),...e)}:function(...e){return t[n].call(this,(()=>{}),...e)}}}},p=e=>{if("object"==typeof e[u]){for(const t in Object.keys(e[u])){const n=e[u][t];e[t]=n}e[u]=void 0}},l=n.compiler.tools.JSGenerator,_=n.compiler.tools.ScriptTreeGenerator,h=n.compiler.tools.IRGenerator,d=l.prototype,m=_.prototype;h.prototype;return p(d),p(m),c(d,{descendStackedBlock:a.descendStackedBlock_JSG,descendInput:a.descendInput_JSG}),c(m,{descendInput:a.descendInput_STG,descendStackedBlock:a.descendStackedBlock_STG}),n.constructor.prototype.compiler=n.compiler,!0}window?.anon$compilerUtilityImported||(window.anon$compilerUtilityImported=anon$compilerUtility({})),anon$compilerUtilityImported?console.log("Compiler utility loaded successfully.\nUse vm.compiler to access it."):console.error("The Compiler-Utility has failed to load.");
    }

    class e {
        getInfo() {
            return {
                id: '0zCsv',
                /* u could probally remove the "Compiled" part if you want */
                name: 'Compiled Scope Variables',
                /* *cough* steal color *cough* */
                color1: '#9999FF',
                blocks: [{
                    blockType: Scratch.BlockType.CONDITIONAL,
                    opcode: 'scope', func: 'nc',
                    text: 'scope'
                }, {
                    blockType: Scratch.BlockType.COMMAND,
                    opcode: 'set', func: 'nc',
                    text: 'set var [A1] to [A2]',
                    arguments: {
                        A1: {
                            type: Scratch.ArgumentType.STRING
                        },
                        A2: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                }, {
                    blockType: Scratch.BlockType.REPORTER,
                    opcode: 'get', func: 'nc',
                    text: 'get var [A1]',
                    arguments: {
                        A1: {
                            type: Scratch.ArgumentType.STRING
                        }
                    }
                }],
                menus: {}
            }
        }
        nc(_,$) {
            runtime.visualReport($.thread.peekStack(), 'compiler only');
        }
    }

    function sanitizeForEmbed(wrap, string) {
        // @ts-ignore Overdated syntax
        return String(string).replaceAll('\\', '\\\\').replaceAll(wrap, `\\${wrap}`);
    }

    // @ts-ignore
    if (window?.anon$compilerUtilityImported) {

        // @ts-ignore
        vm.compiler.blockMixin.register('0zCsv_scope', function (block) {
            return {
                kind: '0zCsv.scope',
                stack: this.descendSubstack(block, 'SUBSTACK')
            };
        });
        // @ts-ignore
        vm.compiler.blockMixin.register('0zCsv_set', function (block) {
            console.log(this.descendInputOfBlock(block, 'A1'));
            return {
                kind: '0zCsv.set',
                args: {
                    A1: this.descendInputOfBlock(block, 'A1'),
                    A2: this.descendInputOfBlock(block, 'A2')
                }
            };
        });
        // @ts-ignore
        vm.compiler.blockMixin.register('0zCsv_get', function (block) {
            return {
                kind: '0zCsv.get',
                blockId: block.id,
                args: {
                    A1: this.descendInputOfBlock(block, 'A1')
                }
            };
        });
        // @ts-ignore
        vm.compiler.inputMixin.register('0zCsv_get', function (block) {
            return {
                kind: '0zCsv.get',
                blockId: block.id,
                args: {
                    A1: this.descendInputOfBlock(block, 'A1')
                }
            };
        });

        // @ts-ignore
        vm.compiler.nodeMixin.register('0zCsv.scope', function (original, node) {
            // @ts-ignore
            const oldSrc = this.overrideSource;
            // @ts-ignore
            this.descendStack(node.stack, new vm.compiler.inputs.Frame(false));
            const stack = this.source;
            this.source = '';
            // @ts-ignore
            this.descendStack(node.stack, new vm.compiler.inputs.Frame(false));
            const src = `\n${oldSrc}\n/*rewrite data from src override ^ */(yield* (function*() {
                ${stack}
                }).call({ scoped: true, svars: (this.scoped ? structuredClone(this.svars) : {}) }))`;
            return src;
        });
        // @ts-ignore
        vm.compiler.nodeMixin.register('0zCsv.set', function (original, node) {
            let { A1, A2 } = node.args;
            A1 = this.descendInput(A1).source ?? `'${sanitizeForEmbed('\'', A1.value)}'`;
            A2 = this.descendInput(A2).source ?? `'${sanitizeForEmbed('\'', A2.value)}'`;
            return `if (this.scoped) this.svars[${A1}] = (${A2});`;
        });

        // @ts-ignore
        vm.compiler.nodeMixin.register('0zCsv.get', function (original, node) {
            return `runtime.visualReport('${node.blockId}', '');`;
        });
        // @ts-ignore
        vm.compiler.jsInputMixin.register('0zCsv.get', function (original, node) {
            // @ts-ignore
            const TypedInput = vm.compiler.inputs.Typed;
            // @ts-ignore
            const TYPE_UNKNOWN = vm.compiler.type.UNKNOWN;
            let { A1 } = node.args;
            A1 = this.descendInput(A1).source ?? `'${sanitizeForEmbed('\'', A1.value)}'`;
            return new TypedInput(`((this.scoped ? this.svars[${A1}] : ''))`, TYPE_UNKNOWN);
        });

    } else throw new Error('Missing compiler exports, please use a working VM :(.');

    // @ts-ignore
    Scratch.extensions.register(new e);
})(Scratch);
