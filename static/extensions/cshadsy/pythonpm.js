class PythonRunnerExtension {
    constructor(vm) {
        this.vm = vm;
        this.pyReady = false;
        this._lastStdout = '';
        this._variables = {}; // store variable names
        this.loadPython();
    }

    getStdout() {
        return this._lastStdout ? this._lastStdout.toString() : '';
    }

    getInfo() {
        return {
            id: 'conipythonpm',
            name: 'Python',
            color1: '#306998',
            blocks: [
                {
                    opcode: 'runPythonCommand',
                    blockType: 'command',
                    text: 'run python code [CODE]',
                    arguments: { CODE: { type: 'string', defaultValue: 'print("hello world")' } }
                },
                {
                    opcode: 'getStdout',
                    blockType: 'reporter',
                    text: 'stdout',
                    arguments: {}
                },
                {
                    opcode: 'runPython',
                    blockType: 'reporter',
                    text: 'run python code [CODE]',
                    arguments: { CODE: { type: 'string', defaultValue: '2+2' } }
                },
                {
                    opcode: 'runPythonBoolean',
                    blockType: 'Boolean',
                    text: 'run python code [CODE]',
                    arguments: { CODE: { type: 'string', defaultValue: '5 > 2' } }
                },
                {
                    opcode: 'setPythonVariable',
                    blockType: 'command',
                    text: 'set python variable [VAR] to [VAL]',
                    arguments: {
                        VAR: { type: 'string', defaultValue: 'x' },
                        VAL: { type: 'string', defaultValue: '0' }
                    }
                },
                {
                    opcode: 'getPythonVariable',
                    blockType: 'reporter',
                    text: 'value of python variable [VAR]',
                    arguments: {
                        VAR: { type: 'string', defaultValue: 'x' }
                    }
                }
            ]
        };
    }

    async loadPython() {
        if (typeof window !== 'undefined' && !window.loadPyodide) {
            const script = document.createElement('script');
            script.type = 'text/javascript';
            script.src = 'https://cdn.jsdelivr.net/pyodide/v0.23.4/full/pyodide.js';
            script.onload = async () => {
                try {
                    this.pyodide = await loadPyodide();
                    this.pyReady = true;
                    console.log('[PythonRunnerExtension] Pyodide loaded');
                } catch (e) {
                    console.error('[PythonRunnerExtension] Pyodide failed to initialize', e);
                }
            };
            script.onerror = () => {
                console.error('[PythonRunnerExtension] Could not load Pyodide from CDN.');
            };
            document.head.appendChild(script);
        } else if (window.pyodide) {
            this.pyodide = window.pyodide;
            this.pyReady = true;
        }
    }

    async runPythonCommand(args) {
        if (!this.pyReady || !this.pyodide) return;
        try {
            let code = args.CODE;
            let output = '';
            this.pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);
            await this.pyodide.runPythonAsync(code);
            output = this.pyodide.runPython('sys.stdout.getvalue()');
            this._lastStdout = output;
        } catch (e) {
            this._lastStdout = 'Python error: ' + e;
        }
    }

    async runPython(args) {
        if (!this.pyReady || !this.pyodide) return 'Python not ready';
        try {
            let code = args.CODE;
            this.pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
sys.stderr = StringIO()
`);
            let result = await this.pyodide.runPythonAsync(code);
            let output = this.pyodide.runPython('sys.stdout.getvalue()');
            if (result === undefined || result === null) return output || 'None';
            return output ? output : result.toString();
        } catch (e) {
            return 'Python error: ' + e;
        }
    }

    async runPythonBoolean(args) {
        if (!this.pyReady || !this.pyodide) return false;
        try {
            let code = args.CODE;
            let result = await this.pyodide.runPythonAsync(code);
            return result === true;
        } catch (e) {
            return false;
        }
    }

    async setPythonVariable(args) {
        if (!this.pyReady || !this.pyodide) return;
        try {
            let varName = args.VAR;
            let val = args.VAL;
            // store variable in Python
            await this.pyodide.runPythonAsync(`${varName} = ${val}`);
            this._variables[varName] = true;
        } catch (e) {
            console.error('[PythonRunnerExtension] Error setting variable:', e);
        }
    }

    async getPythonVariable(args) {
        if (!this.pyReady || !this.pyodide) return 'Python not ready';
        try {
            let varName = args.VAR;
            if (!this._variables[varName]) return 'undefined';
            let val = await this.pyodide.runPythonAsync(varName);
            return val !== undefined && val !== null ? val.toString() : 'None';
        } catch (e) {
            return 'Python error: ' + e;
        }
    }
}

(function() {
    if (typeof window !== 'undefined') {
        if (window.TurboWarpExtensions && window.vm) {
            // needs unsandbox xoxo
            window.TurboWarpExtensions.register(
                'pythonRunner',
                vm => new PythonRunnerExtension(vm),
                { unsandboxed: true }
            );
        } else if (window.vm && window.vm.extensionManager) {
            window.vm.extensionManager._registerInternalExtension(new PythonRunnerExtension(window.vm));
        }
    }
})();
