(function(Scratch) {
	'use strict';

	if (!Scratch.extensions.unsandboxed) {
		throw new Error('Addons Manager must run unsandboxed!');
	}

	const vm = Scratch.vm;
	const runtime = vm.runtime;

	class AddonsManager {
		constructor() {
			this.addonsRegistry = new Map();
			this.exposedFunctions = new Map();
			this.exposedVariables = new Map(); // jsVarName -> scratchVarId
			this.broadcastListeners = new Map(); // broadcastId -> Set of addonIds
			this.pendingCallbacks = new Map(); // requestId -> { resolve, reject, timeoutId }
			this.lastCalledArgs = '[]';
			this.variableListeners = new Map();
			this.lastKnownVarValues = new Map();
			this.pollingInterval = setInterval(this._checkVariableChanges.bind(this), 100);

			window.addEventListener('message', this._handleIframeMessage.bind(this));
		}

		_checkVariableChanges() {
			this.exposedVariables.forEach((varId, jsVarName) => {
				const scratchVar = vm.runtime.getTargetForStage().variables[varId];
				if (scratchVar) {
					const currentValue = scratchVar.value;
					const lastValue = this.lastKnownVarValues.get(varId);
					if (currentValue !== lastValue) {
						this.lastKnownVarValues.set(varId, currentValue);
						if (this.variableListeners.has(varId)) {
							this.variableListeners.get(varId).forEach(iframeWindow => {
								iframeWindow.postMessage({
									type: 'scratch_variable_update',
									varId,
									value: currentValue
								}, '*');
							});
						}
					}
				}
			});
		}

		_handleIframeMessage(event) {
			if (!event.data || !event.data.addonId || !this.addonsRegistry.has(event.data.addonId)) return;
			const data = event.data;
			switch (data.type) {
				case 'addon_function_call':
					this._processAddonFunctionCall(data.addonId, data.funcName, data.args);
					break;
				case 'addon_variable_set':
					this._processAddonVariableSet(data.varName, data.value);
					break;
				case 'addon_listen_broadcast':
					this._registerBroadcastListener(data.addonId, data.broadcastId);
					break;
				case 'addon_callback_response':
					this._processCallbackResponse(data.requestId, data.value);
					break;
			}
		}

		_processAddonFunctionCall(addonId, funcName, args) {
			if (!this.exposedFunctions.has(funcName)) return;
			const def = this.exposedFunctions.get(funcName);
			if (args.length !== def.inputCount) return;
			this.lastCalledArgs = JSON.stringify(args);
			runtime.startHats('puzzlinggggaddons_whenFunctionCalled', {
				FUNC_NAME_HAT: funcName
			});
		}

		_processAddonVariableSet(varName, value) {
			if (!this.exposedVariables.has(varName)) return;
			const varId = this.exposedVariables.get(varName);
			const scratchVar = vm.runtime.getTargetForStage().variables[varId];
			if (scratchVar) {
				scratchVar.value = value;
				this.lastKnownVarValues.set(varId, value);
			}
		}

		_registerBroadcastListener(addonId, broadcastId) {
			if (!this.broadcastListeners.has(broadcastId)) {
				this.broadcastListeners.set(broadcastId, new Set());
			}
			this.broadcastListeners.get(broadcastId).add(addonId);
		}

		_processCallbackResponse(requestId, value) {
			if (this.pendingCallbacks.has(requestId)) {
				const {
					resolve,
					timeoutId
				} = this.pendingCallbacks.get(requestId);
				clearTimeout(timeoutId);
				resolve(value);
				this.pendingCallbacks.delete(requestId);
			}
		}

		_createApiBootstrapScript(addonId) {
			let apiScript = `
        const AddonAPI = {};
        const addonId = '${addonId}';
        const _scratchVars = {};
        const _broadcastCallbacks = new Map();
        const _callbackHandlers = new Map();

        window.addEventListener('message', (event) => {
            const data = event.data;
            if (!data) return;
            switch(data.type) {
                case 'scratch_variable_update':
                    for (const varName in _scratchVars) { if (_scratchVars[varName].id === data.varId) { _scratchVars[varName].value = data.value; break; } }
                    break;
                case 'scratch_broadcast_triggered':
                    if (_broadcastCallbacks.has(data.broadcastId)) { _broadcastCallbacks.get(data.broadcastId)(data.data); }
                    break;
                case 'scratch_callback_request':
                    if (_callbackHandlers.has(data.callbackName)) {
                        const result = _callbackHandlers.get(data.callbackName)(data.data);
                        window.parent.postMessage({ type: 'addon_callback_response', addonId, requestId: data.requestId, value: result }, '*');
                    }
                    break;
            }
        });

        AddonAPI.onBroadcast = (broadcastId, callback) => {
            _broadcastCallbacks.set(broadcastId, callback);
            window.parent.postMessage({ type: 'addon_listen_broadcast', addonId, broadcastId }, '*');
        };

        AddonAPI.onCallback = (callbackName, handler) => { _callbackHandlers.set(callbackName, handler); };
        `;
			this.exposedFunctions.forEach((def, funcName) => {
				apiScript += `AddonAPI['${funcName}'] = (...args) => window.parent.postMessage({ type: 'addon_function_call', addonId, funcName: '${funcName}', args }, '*');`;
			});
			this.exposedVariables.forEach((varId, jsVarName) => {
				const scratchVar = vm.runtime.getTargetForStage().variables[varId];
				if (scratchVar) {
					apiScript += `_scratchVars['${jsVarName}'] = { id: '${varId}', value: ${JSON.stringify(scratchVar.value)} };
                Object.defineProperty(AddonAPI, '${jsVarName}', {
                    get: () => _scratchVars['${jsVarName}'].value,
                    set: (newValue) => { _scratchVars['${jsVarName}'].value = newValue; window.parent.postMessage({ type: 'addon_variable_set', addonId, varName: '${jsVarName}', value: newValue }, '*'); },
                    enumerable: true
                });`;
				}
			});
			return apiScript;
		}

		_runAddonInIframeSandbox(addonId, jsCode) {
			const addonEntry = this.addonsRegistry.get(addonId);
			if (!addonEntry) return;
			const apiScript = this._createApiBootstrapScript(addonId);
			const iframeContent = `<!DOCTYPE html><html><body><script>${apiScript}</script><script>${jsCode}</script></body></html>`;
			const iframe = document.createElement('iframe');
			iframe.sandbox = 'allow-scripts';
			iframe.style.display = 'none';
			iframe.srcdoc = iframeContent;
			document.body.appendChild(iframe);
			addonEntry.iframe = iframe;
			addonEntry.isActive = true;
			this.exposedVariables.forEach(varId => {
				if (!this.variableListeners.has(varId)) this.variableListeners.set(varId, new Set());
				this.variableListeners.get(varId).add(iframe.contentWindow);
			});
		}

		getInfo() {
			return {
				id: 'puzzlinggggaddons',
				name: 'Addons',
				color1: '#6A5ACD',
				color2: '#5B4FBC',
				color3: '#4C42AA',
				docsURI: 'https://extensions.penguinmod.com/docs/Addons',
				blocks: [{
						opcode: 'registerAddon',
						blockType: Scratch.BlockType.COMMAND,
						text: 'register addon [ADDON_ID] with JS code [ADDON_CODE]',
						arguments: {
							ADDON_ID: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'my-addon'
							},
							ADDON_CODE: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: '(function(AddonAPI) {})(AddonAPI);'
							}
						}
					},
					{
						opcode: 'startAddon',
						blockType: Scratch.BlockType.COMMAND,
						text: 'start addon [ADDON_ID_MENU]',
						arguments: {
							ADDON_ID_MENU: {
								type: Scratch.ArgumentType.STRING,
								menu: 'REGISTERED_ADDONS_MENU'
							}
						}
					},
					{
						opcode: 'stopAddon',
						blockType: Scratch.BlockType.COMMAND,
						text: 'stop addon [ADDON_ID_MENU]',
						arguments: {
							ADDON_ID_MENU: {
								type: Scratch.ArgumentType.STRING,
								menu: 'ACTIVE_ADDONS_MENU'
							}
						}
					},
					{
						opcode: 'restartAddon',
						blockType: Scratch.BlockType.COMMAND,
						text: 'restart addon [ADDON_ID_MENU]',
						arguments: {
							ADDON_ID_MENU: {
								type: Scratch.ArgumentType.STRING,
								menu: 'ACTIVE_ADDONS_MENU'
							}
						}
					},
					{
						opcode: 'unregisterAddon',
						blockType: Scratch.BlockType.COMMAND,
						text: 'unregister addon [ADDON_ID_MENU]',
						arguments: {
							ADDON_ID_MENU: {
								type: Scratch.ArgumentType.STRING,
								menu: 'REGISTERED_ADDONS_MENU'
							}
						}
					},
					'---',
					{
						opcode: 'isAddonRunning',
						blockType: Scratch.BlockType.BOOLEAN,
						text: 'is addon [ADDON_ID_STATUS_MENU] running?',
						arguments: {
							ADDON_ID_STATUS_MENU: {
								type: Scratch.ArgumentType.STRING,
								menu: 'REGISTERED_ADDONS_STATUS_MENU'
							}
						}
					},
					'---',
					{
						opcode: 'exposeVariable',
						blockType: Scratch.BlockType.COMMAND,
						text: 'expose var [SCRATCH_VAR] to addons as [JS_VAR_NAME]',
						arguments: {
							SCRATCH_VAR: {
								type: Scratch.ArgumentType.STRING,
								menu: 'ALL_VARIABLES_MENU'
							},
							JS_VAR_NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'myVariable'
							}
						}
					},
					{
						opcode: 'unexposeVariable',
						blockType: Scratch.BlockType.COMMAND,
						text: 'unexpose variable [JS_VAR_NAME]',
						arguments: {
							JS_VAR_NAME: {
								type: Scratch.ArgumentType.STRING,
								menu: 'EXPOSED_VARIABLES_MENU'
							}
						}
					},
					{
						opcode: 'exposeFunction',
						blockType: Scratch.BlockType.COMMAND,
						text: 'expose function named [JS_FUNC_NAME] with [INPUT_COUNT] inputs',
						arguments: {
							JS_FUNC_NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'myFunction'
							},
							INPUT_COUNT: {
								type: Scratch.ArgumentType.NUMBER,
								defaultValue: 1
							},
						}
					},
					{
						opcode: 'unexposeFunction',
						blockType: Scratch.BlockType.COMMAND,
						text: 'unexpose function [JS_FUNC_NAME]',
						arguments: {
							JS_FUNC_NAME: {
								type: Scratch.ArgumentType.STRING,
								menu: 'EXPOSED_FUNCTIONS_MENU'
							}
						}
					},
					'---',
					{
						opcode: 'broadcastTo_Addon',
						blockType: Scratch.BlockType.COMMAND,
						text: 'broadcast [BROADCAST_ID] with data [DATA]',
						arguments: {
							BROADCAST_ID: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'game-event'
							},
							DATA: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'level 1'
							}
						}
					},
					{
						opcode: 'runCallback',
						blockType: Scratch.BlockType.REPORTER,
						text: 'run callback [CALLBACK_NAME] in addon [ADDON_ID_CALLBACK_MENU] with data [DATA]',
						arguments: {
							CALLBACK_NAME: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'getPlayerScore'
							},
							ADDON_ID_CALLBACK_MENU: {
								type: Scratch.ArgumentType.STRING,
								menu: 'REGISTERED_ADDONS_STATUS_MENU'
							},
							DATA: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'player1'
							}
						}
					},
					'---',
					{
						opcode: 'whenFunctionCalled',
						blockType: Scratch.BlockType.EVENT,
						text: 'when addon calls function [FUNC_NAME_HAT] with inputs [FUNC_CALL_INPUTS_HAT]',
						isEdgeActivated: false,
						arguments: {
							FUNC_NAME_HAT: {
								type: Scratch.ArgumentType.STRING,
								menu: 'EXPOSED_FUNCTIONS_MENU'
							},
							FUNC_CALL_INPUTS_HAT: {
								type: Scratch.ArgumentType.STRING,
								canDragDuplicate: true,
								disableMonitor: true,
								hideFromPalette: true,
								fillIn: 'getLatestAddonCallArgs'
							}
						}
					},
					{
						opcode: 'getLatestAddonCallArgs',
						text: 'last function call inputs',
						blockType: Scratch.BlockType.REPORTER,
						canDragDuplicate: true,
						disableMonitor: true,
						hideFromPalette: true
					},
					'---',
					{
						opcode: 'getAddons',
						blockType: Scratch.BlockType.REPORTER,
						text: 'all addon IDs'
					},
					{
						opcode: 'getExposedFunctionsList',
						blockType: Scratch.BlockType.REPORTER,
						text: 'all exposed functions'
					},
					{
						opcode: 'getExposedVariablesList',
						blockType: Scratch.BlockType.REPORTER,
						text: 'all exposed variables'
					},
				],
				menus: {
					REGISTERED_ADDONS_MENU: {
						acceptReporters: true,
						items: '_getRegisteredAddonsMenuWithAll'
					},
					ACTIVE_ADDONS_MENU: {
						acceptReporters: true,
						items: '_getActiveAddonsMenuWithAll'
					},
					REGISTERED_ADDONS_STATUS_MENU: {
						acceptReporters: true,
						items: 'getRegisteredAddonsMenu'
					},
					ALL_VARIABLES_MENU: {
						acceptReporters: false,
						items: 'getAllVariablesMenu'
					},
					EXPOSED_FUNCTIONS_MENU: {
						acceptReporters: false,
						items: 'getExposedFunctionsMenu'
					},
					EXPOSED_VARIABLES_MENU: {
						acceptReporters: false,
						items: 'getExposedVariablesMenu'
					}
				}
			};
		}

		_getRegisteredAddonsMenuWithAll() {
			return [{
				text: 'all addons',
				value: '_all_'
			}, ...this.getRegisteredAddonsMenu()];
		}
		_getActiveAddonsMenuWithAll() {
			return [{
				text: 'all addons',
				value: '_all_'
			}, ...this.getActiveAddonsMenu()];
		}
		getRegisteredAddonsMenu() {
			const addons = Array.from(this.addonsRegistry.keys()).map(id => ({
				text: id,
				value: id
			}));
			return addons.length > 0 ? addons : [{
				text: '(no addons)',
				value: ''
			}];
		}
		getActiveAddonsMenu() {
			const activeAddons = Array.from(this.addonsRegistry.values()).filter(e => e.isActive).map(e => ({
				text: e.id,
				value: e.id
			}));
			return activeAddons.length > 0 ? activeAddons : [{
				text: '(no active addons)',
				value: ''
			}];
		}
		getAllVariablesMenu() {
			try {
				if (typeof Blockly === 'undefined' || !Blockly.getMainWorkspace()) return [{
					text: '(no variables)',
					value: ''
				}];
				const variables = Blockly.getMainWorkspace().getVariableMap().getAllVariables().map(model => ({
					text: model.name,
					value: model.getId()
				}));
				return variables.length > 0 ? variables : [{
					text: '(no variables)',
					value: ''
				}];
			} catch (e) {
				return [{
					text: '(error loading vars)',
					value: ''
				}];
			}
		}
		getExposedFunctionsMenu() {
			const funcs = Array.from(this.exposedFunctions.keys()).map(funcName => ({
				text: funcName,
				value: funcName
			}));
			return funcs.length > 0 ? funcs : [{
				text: '(no funcs exposed)',
				value: ''
			}];
		}
		getExposedVariablesMenu() {
			const vars = Array.from(this.exposedVariables.keys()).map(varName => ({
				text: varName,
				value: varName
			}));
			return vars.length > 0 ? vars : [{
				text: '(no vars exposed)',
				value: ''
			}];
		}

		_forEachAddon(addonId, callback) {
			if (addonId === '_all_') {
				this.addonsRegistry.forEach(callback);
			} else {
				const addonEntry = this.addonsRegistry.get(addonId);
				if (addonEntry) {
					callback(addonEntry);
				}
			}
		}
		registerAddon(args) {
			const addonId = String(args.ADDON_ID).trim();
			if (!addonId || addonId === '_all_') throw new Error('Addon ID cannot be empty or "_all_".');
			const wasActive = this.addonsRegistry.has(addonId) && this.addonsRegistry.get(addonId).isActive;
			if (wasActive) this.stopAddon({
				ADDON_ID_MENU: addonId
			});
			this.addonsRegistry.set(addonId, {
				id: addonId,
				scriptCode: String(args.ADDON_CODE),
				isActive: false,
				iframe: null
			});
			if (wasActive) setTimeout(() => this.startAddon({
				ADDON_ID_MENU: addonId
			}), 100);
		}
		startAddon(args) {
			this._forEachAddon(String(args.ADDON_ID_MENU), (entry) => {
				if (entry.isActive) return;
				this._runAddonInIframeSandbox(entry.id, entry.scriptCode);
			});
		}
		stopAddon(args) {
			this._forEachAddon(String(args.ADDON_ID_MENU), (entry) => {
				if (entry.isActive && entry.iframe) {
					this.exposedVariables.forEach(varId => {
						this.variableListeners.get(varId)?.delete(entry.iframe.contentWindow);
					});
					entry.iframe.remove();
					entry.iframe = null;
					entry.isActive = false;
					console.log(`Addon '${entry.id}' stopped.`);
				}
			});
		}
		restartAddon(args) {
			this._forEachAddon(String(args.ADDON_ID_MENU), (entry) => {
				if (entry.isActive) {
					this.stopAddon({
						ADDON_ID_MENU: entry.id
					});
					setTimeout(() => this.startAddon({
						ADDON_ID_MENU: entry.id
					}), 100);
				}
			});
		}
		unregisterAddon(args) {
			this._forEachAddon(String(args.ADDON_ID_MENU), (entry) => {
				this.stopAddon({
					ADDON_ID_MENU: entry.id
				});
				this.addonsRegistry.delete(entry.id);
			});
		}
		isAddonRunning(args) {
			const entry = this.addonsRegistry.get(String(args.ADDON_ID_STATUS_MENU));
			return !!(entry && entry.isActive);
		}
		exposeVariable(args) {
			const varId = String(args.SCRATCH_VAR);
			const jsVarName = String(args.JS_VAR_NAME).trim();
			if (/\s/.test(jsVarName)) throw new Error(`Variable name "${jsVarName}" cannot contain spaces.`);
			if (jsVarName) {
				this.exposedVariables.set(jsVarName, varId);
				const scratchVar = vm.runtime.getTargetForStage().variables[varId];
				if (scratchVar) this.lastKnownVarValues.set(varId, scratchVar.value);
			}
		}
		unexposeVariable(args) {
			const jsVarName = String(args.JS_VAR_NAME);
			if (this.exposedVariables.has(jsVarName)) {
				const varId = this.exposedVariables.get(jsVarName);
				this.exposedVariables.delete(jsVarName);
				this.lastKnownVarValues.delete(varId);
				this.variableListeners.delete(varId);
			}
		}
		exposeFunction(args) {
			const jsFuncName = String(args.JS_FUNC_NAME).trim();
			if (/\s/.test(jsFuncName)) throw new Error(`Function name "${jsFuncName}" cannot contain spaces.`);
			const inputCount = Math.max(0, Math.floor(Scratch.Cast.toNumber(args.INPUT_COUNT)));
			if (jsFuncName) this.exposedFunctions.set(jsFuncName, {
				inputCount
			});
		}
		unexposeFunction(args) {
			const jsFuncName = String(args.JS_FUNC_NAME);
			if (this.exposedFunctions.has(jsFuncName)) this.exposedFunctions.delete(jsFuncName);
		}
		broadcastTo_Addon(args) {
			const broadcastId = String(args.BROADCAST_ID);
			const data = args.DATA;
			if (this.broadcastListeners.has(broadcastId)) {
				this.broadcastListeners.get(broadcastId).forEach(addonId => {
					const entry = this.addonsRegistry.get(addonId);
					if (entry && entry.isActive && entry.iframe) entry.iframe.contentWindow.postMessage({
						type: 'scratch_broadcast_triggered',
						broadcastId,
						data
					}, '*');
				});
			}
		}
		runCallback(args) {
			const callbackName = String(args.CALLBACK_NAME);
			const addonId = String(args.ADDON_ID_CALLBACK_MENU);
			const data = args.DATA;
			const entry = this.addonsRegistry.get(addonId);
			if (!entry || !entry.isActive || !entry.iframe) return Promise.resolve(null);
			return new Promise((resolve) => {
				const requestId = `${Date.now()}-${Math.random()}`;
				const timeoutId = setTimeout(() => {
					this.pendingCallbacks.delete(requestId);
					resolve(null);
				}, 60000);
				this.pendingCallbacks.set(requestId, {
					resolve,
					timeoutId
				});
				entry.iframe.contentWindow.postMessage({
					type: 'scratch_callback_request',
					callbackName,
					data,
					requestId
				}, '*');
			});
		}
		getLatestAddonCallArgs() {
			return this.lastCalledArgs;
		}
		getAddons() {
			return JSON.stringify(Array.from(this.addonsRegistry.keys()));
		}
		getExposedFunctionsList() {
			const funcs = Array.from(this.exposedFunctions.entries()).map(([name, def]) => ({
				name,
				inputs: def.inputCount
			}));
			return JSON.stringify(funcs);
		}
		getExposedVariablesList() {
			const vars = Array.from(this.exposedVariables.entries()).map(([jsName, varId]) => {
				const scratchVar = vm.runtime.getTargetForStage().variables[varId];
				return {
					jsName,
					scratchName: scratchVar ? scratchVar.name : '(unknown)'
				};
			});
			return JSON.stringify(vars);
		}
	}

	Scratch.extensions.register(new AddonsManager());
})(Scratch);