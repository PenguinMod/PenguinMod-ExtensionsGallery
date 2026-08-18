
(function(Scratch) {
    'use strict';
    

  const { vm, Cast } = Scratch;
  const runtime = vm.runtime;
  const isPM = Scratch.extensions.isPenguinMod;

  const keysMenu = [
    { text: "space", value: "space" }, { text: "up arrow", value: "up arrow" }, { text: "down arrow", value: "down arrow" },
    { text: "right arrow", value: "right arrow" }, { text: "left arrow", value: "left arrow" },
    { text: "a", value: "a" }, { text: "b", value: "b" }, { text: "c", value: "c" },
    { text: "d", value: "d" }, { text: "e", value: "e" }, { text: "f", value: "f" },
    { text: "g", value: "g" }, { text: "h", value: "h" }, { text: "i", value: "i" },
    { text: "j", value: "j" }, { text: "k", value: "k" }, { text: "l", value: "l" },
    { text: "m", value: "m" }, { text: "n", value: "n" }, { text: "o", value: "o" },
    { text: "p", value: "p" }, { text: "q", value: "q" }, { text: "r", value: "r" },
    { text: "s", value: "s" }, { text: "t", value: "t" }, { text: "u", value: "u" },
    { text: "v", value: "v" }, { text: "w", value: "w" }, { text: "x", value: "x" },
    { text: "y", value: "y" }, { text: "z", value: "z" }, { text: "0", value: "0" },
    { text: "1", value: "1" }, { text: "2", value: "2" }, { text: "3", value: "3" },
    { text: "4", value: "4" }, { text: "5", value: "5" }, { text: "6", value: "6" },
    { text: "7", value: "7" }, { text: "8", value: "8" }, { text: "9", value: "9" }
  ];

  let Thread; // defined by exports
  let conditionStorage = Object.create(null), keybinds = Object.create(null);
  let hats = { ...runtime._hats }, overrideCalls = {};
  window.scrtwpmrunpyIssueTimes = [];

  const regenReporters = ["scrtwpmrunpy_getarg"];
  if (Scratch.gui) Scratch.gui.getBlockly().then(SB => {
    const originalCheck = SB.scratchBlocksUtils.isShadowArgumentReporter;
    SB.scratchBlocksUtils.isShadowArgumentReporter = function (block) {
      if (originalCheck(block)) return true;
      return block.isShadow() && regenReporters.includes(block.type);
    };
  });

  const resetStorage = () => {
    conditionStorage = Object.create(null);
    window.scrtwpmrunpyIssueTimes = [];
  };
  runtime.on("PROJECT_STOP_ALL", resetStorage);
  runtime.on("PROJECT_START", resetStorage);

  const postData = (key, down) => {
    if (key === "space") key = " ";
    if (key.includes("arrow")) key = key.charAt(0).toUpperCase() + key.slice(1).replace(" arrow", "");
    runtime.ioDevices.keyboard.postData({ key, isDown: down });
  };
  runtime.on("KEY_PRESSED", (key) => {
    key = key.toLowerCase();
    // Use this for compatibility with other extensions
    if (keybinds[key] !== undefined) keybinds[key].keyV.forEach(item => postData(item, true));
  });
  runtime.on("AFTER_EXECUTE", () => {
    const keys = runtime.ioDevices.keyboard._keysPressed;
    for (let i = 0; i < Object.keys(keybinds).length; i++) {
      const keyName = Object.keys(keybinds)[i];
      const key = keybinds[keyName];
      if (keys.indexOf(keyName.toLowerCase()) === -1) key.keyV.forEach(i => postData(i, false));
    }
  });

  // capture all types of blockable Errors
  const ogError = Error;
  window.Error = function(message) {
    window.scrtwpmrunpyIssueTimes.push(Math.floor(Date.now() / 200) * 200);
    const err = new ogError(message);
    Object.setPrototypeOf(err, window.Error.prototype);
    return err;
  };
  Object.setPrototypeOf(window.Error, ogError);
  window.Error.prototype = Object.create(ogError.prototype);
  window.Error.prototype.constructor = window.Error;

  const ogConsoleEr = console.error;
  console.error = (...args) => {
    window.scrtwpmrunpyIssueTimes.push(Math.floor(Date.now() / 200) * 200);
    return ogConsoleEr.apply(this, args);
  }

  // Override needed for "ifRunBlock"
  const ogRestartThread = runtime._restartThread;
  runtime._restartThread = function (thread) {
    const forceStop = (t, c) => {
      if (c && t.procedures !== null && Object.keys(t.procedures).length > 0) try { t.generator.return() } catch {}
      t.status = 4;
    }
    // Check if we exist in the thread, then stop the script
    if (thread.isCompiled) {
      const e = thread.compatibilityStackFrame;
      if (e !== undefined && e !== null && e.SPifThread !== undefined) forceStop(e.SPifThread, true);
    } else {
      for (let i = 0; i < thread.stackFrames.length; i++) {
        const e = thread.stackFrames[i].executionContext;
        if (e !== null && e.SPifThread !== undefined) {
          forceStop(e.SPifThread, false);
          break;
        }
      }
    }
    return ogRestartThread.call(this, thread);
  };

  // override needed for "get from sprite" blocks
  const ogVisReport = runtime.visualReport;
  if (isPM) {
    runtime.visualReport = function (blockId, value) {
      if (overrideCalls[blockId]) {
        overrideCalls[blockId].pushReportedValue(value);
        delete overrideCalls[blockId];
        return;
      }
      return ogVisReport.call(this, blockId, value);
    }
  } else {
    runtime.visualReport = function (target, blockId, value) {
      if (overrideCalls[blockId]) {
        overrideCalls[blockId].pushReportedValue(value);
        delete overrideCalls[blockId];
        return;
      }
      return ogVisReport.call(this, target, blockId, value);
    }
  }

  // thread patcher for special threads
  const expRenderedTarget = new vm.exports.RenderedTarget({ blocks: null }, runtime);
  const Blocks = expRenderedTarget.blocks.constructor;
  const ogGetNext = Blocks.prototype.getNextBlock;
  Blocks.prototype.getNextBlock = function(name) {
    const thisBlock = ogGetNext.call(this, name);
    if (thisBlock) return thisBlock;
    for (const target of this.runtime.targets) {
      if (!target.isOriginal || target.blocks === this) continue;
      const targetBlock = ogGetNext.call(target.blocks, name);
      if (targetBlock) return targetBlock;
    }
    return undefined;
  }
  const ogGetBranch = Blocks.prototype.getBranch;
  Blocks.prototype.getBranch = function(id, branchNum) {
    const thisBlock = ogGetBranch.call(this, id, branchNum);
    if (thisBlock) return thisBlock;
    for (const target of this.runtime.targets) {
      if (!target.isOriginal || target.blocks === this) continue;
      const targetBlock = ogGetBranch.call(target.blocks, id, branchNum);
      if (targetBlock) return targetBlock;
    }
    return undefined;
  }

  // Thank you to @FurryR for the help
  function getUnsafeExports() {
    if (vm.exports.i_will_not_ask_for_help_when_these_break) return vm.exports.i_will_not_ask_for_help_when_these_break();
    else if (vm.exports.JSGenerator && vm.exports.IRGenerator?.exports) return {
      ...vm.exports, ScriptTreeGenerator: vm.exports.IRGenerator.exports.ScriptTreeGenerator
    };
  }
  const exports = getUnsafeExports();
  if (exports) {
    Thread = exports.Thread;
    const { JSGenerator, ScriptTreeGenerator } = exports;
    const _ogIRdescendStack = ScriptTreeGenerator.prototype.descendStackedBlock;
    ScriptTreeGenerator.prototype.descendStackedBlock = function (block) {
      switch (block.opcode) {
        case "scrtwpmrunpy_breakLoop": return { kind: "scrtwpmrunpy.break", id: block.id };
        case "scrtwpmrunpy_continueLoop": return { kind: "scrtwpmrunpy.continue", id: block.id };
        default: return _ogIRdescendStack.call(this, block);
      }
    };
    const _ogJSdescendStack = JSGenerator.prototype.descendStackedBlock;
    JSGenerator.prototype.descendStackedBlock = function (node) {
      switch (node.kind) {
        case "scrtwpmrunpy.break": {
          // execute in compatibility layer in case we are in a non-compiled loop block
          if (this.frames.find(frame => frame.isLoop)?.isLoop) this.source += "break;\n";
          else this.source += `yield* executeInCompatibilityLayer({}, runtime.getOpcodeFunction("scrtwpmrunpy_breakLoop"), false, false, "${node.id}", null);\n`;
          break;
        }
        case "scrtwpmrunpy.continue": {
          // execute in compatibility layer in case we are in a non-compiled loop block
          if (this.frames.find(frame => frame.isLoop)?.isLoop) this.source += "continue;\n";
          else this.source += `yield* executeInCompatibilityLayer({}, runtime.getOpcodeFunction("scrtwpmrunpy_continueLoop"), false, false, "${node.id}", null);\n`;
          break;
        }
        default: return _ogJSdescendStack.call(this, node);
      }
    };
  }

    
    class RunPython {
        constructor(runtime) {
      // Initialize an array holding your default dropdown menu options
      this.text = ""
        this.pytext = ""
        this.class = ""
      this.variables = ["var"];
      this.lists = ["list"];
      this.varvar = '0'
      this.lstlist = '["item"]'
      this.runtime = runtime
      this.strictEditing = true

    }
      getInfo() {
        return {
          id: "scrtwpmscrtwpmrunpy",
          name: "Python",
          menuIconURI : `data:image/webp;base64,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`,
          color1: "#4584b6",
          color3: "#ffdd55",
          color2: "#1e415e",
          blocks: [

                {
                opcode: 'openPyDocs',
                blockType: Scratch.BlockType.BUTTON, 
                text: 'Open Documentation',
                },

		 { blockType: Scratch.BlockType.LABEL, text: "Run Python" },

            {
                opcode: 'whenSessionStarts',
                text: 'when python code starts',
                blockType: Scratch.BlockType.HAT,
                isEdgeActivated: false,
                // arguments: {
                   
                // }
            },

            {
                opcode: 'startSession',
                text: 'run python code',
                blockType: Scratch.BlockType.COMMAND,
                // arguments: {
                   
                // }
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
		 { blockType: Scratch.BlockType.LABEL, text: "Strict Editing" },

                {
                opcode: 'aboutstrict',
                blockType: Scratch.BlockType.BUTTON, 
                text: 'What is Strict Editing?',
                },
            {
                opcode: 'setstrict',
                text: 'set strict editing to [OO]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    OO: {type: Scratch.ArgumentType.STRING, menu:"oo"}
                   
                },
                                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
            {
                opcode: 'isstrict',
                text: 'is strict editing on?',
                blockType: Scratch.BlockType.BOOLEAN,
                disableMonitor: true,
                // arguments: {
                   
                // }                    
                color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
        







		 { blockType: Scratch.BlockType.LABEL, text: "Display Output" },
            {
                opcode: 'displayBlock',
                text: 'show python output',
                blockType: Scratch.BlockType.COMMAND,
                // arguments: {
                   
                // }
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
            {
                opcode: 'deleteBlock',
                text: 'hide python output',
                blockType: Scratch.BlockType.COMMAND,
                // arguments: {
                   
                // }
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },           
            {
                opcode: 'clear',
                text: 'clear python output',
                blockType: Scratch.BlockType.COMMAND,
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
            {
                opcode: 'getpytext',
                text: 'python output',
                blockType: Scratch.BlockType.REPORTER,
                // arguments: {
                   
                // }
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
                    allowDropAnywhere: true,
            },
            






		 { blockType: Scratch.BlockType.LABEL, text: "Print" },

            {
                opcode: 'print',
                text: 'print [TEXT]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: 'Python is fun!'},
                   
                }
            },





        { blockType: Scratch.BlockType.LABEL, text: "Inputs" },

            {
                opcode: 'input',
                text: 'input [INPUT]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    INPUT: {type: Scratch.ArgumentType.STRING, defaultValue: 'Is Python fun? '},
                   
                }
            },
            {
                opcode: 'ans',
                text: 'entered answer',
                blockType: Scratch.BlockType.REPORTER,
                    allowDropAnywhere: true,

            },






		 { blockType: Scratch.BlockType.LABEL, text: "Variables" },

            {
                opcode: 'createvar',
                text: 'create variable named [NAME]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: 'var2'},
                    
                },
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
            {
                opcode: 'deletevar',
                text: 'delete variable [NAME]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, menu: 'vars'},
                    
                },
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
            {
                opcode: 'getvar',
                text: 'get variable [NAME]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, menu: "vars"},
                },
                    allowDropAnywhere: true,

            },
            {
                opcode: 'setvar',
                text: '[NAME] = [VALUE]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, menu: "vars"},
                    VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: '0'},
                    
                }
            },




            
		 { blockType: Scratch.BlockType.LABEL, text: "Lists" },

            {
                opcode: 'createlist',
                text: 'create list named [NAME]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: 'list2'},
                    
                },
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
            {
                opcode: 'deletelist',
                text: 'delete list [NAME]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, menu: 'lists'},
                    
                },
                    color2: "#4584b6",
                    color1: "#ffd015",
                    color3: "#1e415e",
            },
            {
                opcode: 'getlist',
                text: 'get list [NAME]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                },
                    allowDropAnywhere: true,
            },

            {
            opcode: "setlist",
            blockType: Scratch.BlockType.COMMAND,
            text: '[NAME] = \[',
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                    VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: '0'},
                    
                },

            mutator: "scrtwpmrunpyextender",
            extensions: ["scrtwpmrunpyextender_string"],
            disableMonitor: true,
          },     
            {
            opcode: "setlisttwo",
            blockType: Scratch.BlockType.COMMAND,
            text: '[NAME] = [VALUE]',
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                    VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: '["Python", "3.14"]'},
                    
                },
          },                      
          {
                opcode: 'reverselist',
                text: '[LIST].reverse()',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LIST: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                }
            },                
            {
                opcode: 'operatelist',
                text: '[LIST].[OPERATION] [TEXT]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LIST: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                    OPERATION: {type: Scratch.ArgumentType.STRING, menu: "listsops"},
                    TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: "item2"},
                }
            },                            
            {
                opcode: 'extendlist',
                text: '[LIST].extend[L2]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LIST: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                    L2: {type: Scratch.ArgumentType.STRING, defaultValue: '["item4","item5"]'},
                }
            },       
            {
                opcode: 'listinsert',
                text: '[LIST].insert [TEXT], [NUM]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    LIST: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                    TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: "item3"},
                    NUM: {type: Scratch.ArgumentType.NUMBER, defaultValue: "0"},
                }
            },
            {
                opcode: 'listpop',
                text: '[LIST].pop [TEXT]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    LIST: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                    TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: "item"},
                },
                    allowDropAnywhere: true,
            },           
                 
            {
                opcode: 'itrlist',
                text: '[LIST]([INDEX])',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    LIST: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                    INDEX: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0},
                },
                    allowDropAnywhere: true,
            },           
          {
                opcode: 'indexlist',
                text: '[LIST].index [TEXT]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    LIST: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                    TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: "item"},
                },
                    allowDropAnywhere: true,
            },            




            



		 { blockType: Scratch.BlockType.LABEL, text: "Controls" },

            {
                opcode: 'ifs',
                text: 'if [BOOL]:',
                blockType: Scratch.BlockType.LOOP,
                arguments: {
                    BOOL: {type: Scratch.ArgumentType.BOOLEAN},
                }
            },
            {
                opcode: 'elifs',
                text: 'elif [BOOL]:',
                blockType: Scratch.BlockType.LOOP,
                arguments: {
                    BOOL: {type: Scratch.ArgumentType.BOOLEAN},
                }
            },
            {
                opcode: 'elses',
                text: 'else:',
                blockType: Scratch.BlockType.LOOP,
                // arguments: {
                //     BOOL: {type: Scratch.ArgumentType.BOOLEAN},
                // }
            },
            {
                opcode: 'whileloop',
                text: 'while [BOOL]:',
                blockType: Scratch.BlockType.LOOP,
                arguments: {
                    BOOL: {type: Scratch.ArgumentType.BOOLEAN},
                }
            },
            {
                opcode: 'foriinlist',
                text: 'for [I] in [LIST]:',
                blockType: Scratch.BlockType.LOOP,
                arguments: {
                    I: {type: Scratch.ArgumentType.STRING, menu: "vars"},
                    LIST: {type: Scratch.ArgumentType.STRING, defaultValue: '["item1","item2","item3"]'},
                }
            },
            {
                opcode: 'rangesone',
                text: 'range [N2]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    N2: {type: Scratch.ArgumentType.NUMBER, defaultValue: 5},
                },
                    allowDropAnywhere: true,
            },
            {
                opcode: 'rangestwo',
                text: 'range [N1], [N2]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    N1: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2},
                    N2: {type: Scratch.ArgumentType.NUMBER, defaultValue: 7},
                },
                    allowDropAnywhere: true,
            },
            // break block still working onn...
            // {
            // opcode: 'breaknow',
            // text: 'break',
            // blockType: Scratch.BlockType.COMMAND, // COMMAND allows it to sit inside loops safely
            // isTerminal: true // Visually turns the block into a cap block (flat bottom)
            // },






		 { blockType: Scratch.BlockType.LABEL, text: "Functions" },

            {
                opcode: 'deffunc',
                text: 'def [NAME] ([ARG]):',
                blockType: Scratch.BlockType.LOOP,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "my_func"},
                    ARG: {type: Scratch.ArgumentType.STRING, defaultValue: "hello, goodbye"},
                }
            },
            {
            opcode: "returnfunc",
            blockType: Scratch.BlockType.COMMAND,
            text: "return [VALUE]",
            isTerminal: true,
            arguments: {
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: "1"}
            }
          },
            {
                opcode: 'callfunc',
                text: '[NAME] ([ARG])',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    ARG: {type: Scratch.ArgumentType.STRING, defaultValue: "one, two"},
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "my_func"},
                }
            },
            {
                opcode: 'getarg',
                text: 'parameter [ARG]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    ARG: {type: Scratch.ArgumentType.STRING, defaultValue: "hello"},
                    // NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "my_func"},
                },
                    allowDropAnywhere: true,
            },
            {
                opcode: 'callfuncrr',
                text: '[NAME] ([ARG])',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    ARG: {type: Scratch.ArgumentType.STRING, defaultValue: "one, two"},
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "my_func"},
                },
                    allowDropAnywhere: true,
            },
          {
            opcode: "argsreporter",
            blockType: Scratch.BlockType.REPORTER,
            text: ' ',
                // arguments: {
                //     NAME: {type: Scratch.ArgumentType.STRING, menu: "lists"},
                //     VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: '0'},
                    
                
                // },

            mutator: "scrtwpmrunpyextender",
            extensions: ["scrtwpmrunpyextender_argsreporter"],
            disableMonitor: true,
                    allowDropAnywhere: true,
          },
          




        { blockType: Scratch.BlockType.LABEL, text: "Classes" },

            {
                opcode: 'setclass',
                text: 'class [CLASS]:',
                blockType: Scratch.BlockType.LOOP,
                arguments: {
                    CLASS: {type: Scratch.ArgumentType.STRING, defaultValue: 'My_class'},
                }
            },
            // {
            //     opcode: 'instantiate',
            //     text: 'class [CLASS] ([ARGS])',
            //     blockType: Scratch.BlockType.REPORTER,
            //     arguments: {
            //         CLASS: {type: Scratch.ArgumentType.STRING, defaultValue: 'My_class'},
            //         ARGS: {type: Scratch.ArgumentType.STRING, defaultValue: 'one, two'},
            //     }
            // },
            {
                opcode: 'deffuncclass',
                text: 'def [NAME] (self, [ARG]) in class:',
                blockType: Scratch.BlockType.LOOP,
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "class_func"},
                    ARG: {type: Scratch.ArgumentType.STRING, defaultValue: "hello, goodbye"},
                }
            },
            {
                opcode: 'setclassvar',
                text: 'self.[VAR] = [VALUE] in class',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    VAR: {type: Scratch.ArgumentType.STRING, defaultValue: 'class_var'},
                    VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: '0'},
                }
            },            
            {
            opcode: "setclasslist",
            blockType: Scratch.BlockType.COMMAND,
            text: 'self.[NAME] = \[',
                arguments: {
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: 'class_list'},
                    VALUE: {type: Scratch.ArgumentType.STRING, defaultValue: '0'},
                    
                },

            mutator: "scrtwpmrunpyextender",
            extensions: ["scrtwpmrunpyextender_class"],
            disableMonitor: true,
          },       

            {
                opcode: 'callfuncclass',
                text: 'from class [CLASS].[NAME] ([ARG])',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    CLASS: {type: Scratch.ArgumentType.STRING, defaultValue: "My_class"},
                    ARG: {type: Scratch.ArgumentType.STRING, defaultValue: "one, two"},
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "class_func"},
                }
            },
            {
                opcode: 'callfuncclassrr',
                text: 'from class [CLASS].[NAME] ([ARG])',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    CLASS: {type: Scratch.ArgumentType.STRING, defaultValue: "My_class"},
                    ARG: {type: Scratch.ArgumentType.STRING, defaultValue: "one, two"},
                    NAME: {type: Scratch.ArgumentType.STRING, defaultValue: "class_func"},
                },
                    allowDropAnywhere: true,
            },
        {
                opcode: 'getfromclass',
                text: 'from class [CLASS].[VAR]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    CLASS: {type: Scratch.ArgumentType.STRING, defaultValue: 'My_class'},
                    VAR: {type: Scratch.ArgumentType.STRING, defaultValue: 'class_var'},
                },
                    allowDropAnywhere: true,
            },






		 { blockType: Scratch.BlockType.LABEL, text: "Strings" },

            {
                opcode: 'joiner',
                text: 'f[JOINED]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    JOINED: {type: Scratch.ArgumentType.STRING, defaultValue: "Python"},
                },
                
            mutator: "scrtwpmrunpyextender",
            extensions: ["scrtwpmrunpyextender_fstring"],
            disableMonitor: true,
                    allowDropAnywhere: true,
            },
            {
                opcode: 'toul',
                text: '[TEXT].[UL]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    TEXT: {type: Scratch.ArgumentType.STRING, defaultValue: "PyThOn"},
                    UL: {type: Scratch.ArgumentType.STRING, menu: "ul"},
                },
                    allowDropAnywhere: true,
            },
            {
                opcode: 'strreplace',
                text: '[STRING].replace [T1], [T2]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    STRING: {type: Scratch.ArgumentType.STRING, defaultValue: "Python is fun"},
                    T1: {type: Scratch.ArgumentType.STRING, defaultValue: "fun"},
                    T2: {type: Scratch.ArgumentType.STRING, defaultValue: "awesome"},
                },
                    allowDropAnywhere: true,
            },
            {
                opcode: 'strstrip',
                text: '[STRING].[STRIP]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    STRING: {type: Scratch.ArgumentType.STRING, defaultValue: "   whitespace?    "},
                    STRIP: {type: Scratch.ArgumentType.STRING, menu: "strip"},
                },
                    allowDropAnywhere: true,
            },
            {
                opcode: 'itrstr',
                text: '[STRING]([INDEX])',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    STRING: {type: Scratch.ArgumentType.STRING, defaultValue: "Python is fun"},
                    INDEX: {type: Scratch.ArgumentType.NUMBER, defaultValue: 0},
                },
                    allowDropAnywhere: true,
            },
            {
                opcode: 'strcount',
                text: '[STRING].count [LETTER]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    STRING: {type: Scratch.ArgumentType.STRING, defaultValue: "Python is fun"},
                    LETTER: {type: Scratch.ArgumentType.STRING, defaultValue: "n"},
                },
                    allowDropAnywhere: true,
            },
            {
                opcode: 'strcounttwo',
                text: '[STRING].count [LETTER], [N1], [N2]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    STRING: {type: Scratch.ArgumentType.STRING, defaultValue: "Python is fun"},
                    LETTER: {type: Scratch.ArgumentType.STRING, defaultValue: "n"},
                    N1: {type: Scratch.ArgumentType.NUMBER, defaultValue: 3},
                    N2: {type: Scratch.ArgumentType.NUMBER, defaultValue: 9},
                },
                    allowDropAnywhere: true,
            },
            {
                opcode: 'strfind',
                text: '[STRING].[FIND] [LETTER]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    STRING: {type: Scratch.ArgumentType.STRING, defaultValue: "Python is fun"},
                    FIND: {type: Scratch.ArgumentType.STRING, menu: "find"},
                    LETTER: {type: Scratch.ArgumentType.STRING, defaultValue: "n"},
                },
                    allowDropAnywhere: true,
            },






		 { blockType: Scratch.BlockType.LABEL, text: "Math" },
                {
            opcode: 'add',
            blockType: Scratch.BlockType.REPORTER,
            text: '[ONE][ADD][TWO]',
            arguments: {
                ONE: { type: Scratch.ArgumentType.NUMBER, defaultValue: 16 },
                ADD: { type: Scratch.ArgumentType.STRING, menu: "add" },
                TWO: { type: Scratch.ArgumentType.NUMBER, defaultValue: 16 }
            },
                    allowDropAnywhere: true,
            },
            {
            opcode: 'executePyMath',
            blockType: Scratch.BlockType.REPORTER,
            text: 'math.[OPERATION] ( [X] )',
            arguments: {
                OPERATION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'singleArgOps',
                defaultValue: 'sqrt'
                },
                X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 16 }
            },
                    allowDropAnywhere: true,
            },
            {
            opcode: 'getPyConstant',
            blockType: Scratch.BlockType.REPORTER,
            text: 'math.[CONSTANT]',
            arguments: {
                CONSTANT: {
                type: Scratch.ArgumentType.STRING,
                menu: 'mathConstants',
                defaultValue: 'pi'
                }
            },
                    allowDropAnywhere: true,
            },
                    {
          opcode: 'executePyMath2Arg',
          blockType: Scratch.BlockType.REPORTER,
          text: 'math.[OPERATION] ( [X] , [Y] )',
          arguments: {
            OPERATION: {
              type: Scratch.ArgumentType.STRING,
              menu: 'twoArgOps',
              defaultValue: 'pow'
            },
            X: { type: Scratch.ArgumentType.NUMBER, defaultValue: 4 },
            Y: { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 }
          },
                    allowDropAnywhere: true,
        },






		 { blockType: Scratch.BlockType.LABEL, text: "Operators" },

        {
            opcode: 'oneopstwo',
            text: '[ONE][OPERATION][TWO]',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
                ONE: {type: Scratch.ArgumentType.STRING, defaultValue: 21},
                OPERATION: {type: Scratch.ArgumentType.STRING, menu:"ops"},
                TWO: {type: Scratch.ArgumentType.STRING, defaultValue: 36},
            }
        },
        {
            opcode: 'oneandortwo',
            text: '[ONE][OPERATION][TWO]',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
                ONE: {type: Scratch.ArgumentType.BOOLEAN},
                OPERATION: {type: Scratch.ArgumentType.STRING, menu:"andorpython"},
                TWO: {type: Scratch.ArgumentType.BOOLEAN},
            }
        },
        {
            opcode: 'notone',
            text: 'not [ONE]',
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
                ONE: {type: Scratch.ArgumentType.BOOLEAN},
            }
        },





		 { blockType: Scratch.BlockType.LABEL, text: "Time" },

            {
                opcode: 'sleep',
                text: 'time.sleep [NUM]',
                blockType: Scratch.BlockType.COMMAND,
                arguments: {
                    NUM: {type: Scratch.ArgumentType.NUMBER, defaultValue: 2},
                    
                }
            },

          {
            opcode: 'runTimeOp',
            blockType: Scratch.BlockType.REPORTER,
            text: 'time.[OPERATION] [ARG]',
            arguments: {
              OPERATION: {
                type: Scratch.ArgumentType.STRING,
                menu: 'timeOps'
              },
              ARG: {
                type: Scratch.ArgumentType.STRING,
        
              },
            },
                    allowDropAnywhere: true,
          },




        { blockType: Scratch.BlockType.LABEL, text: "Random" },

            {
                opcode: 'randchoice',
                text: 'random.choice [ARR]',
                blockType: Scratch.BlockType.REPORTER,
                arguments: {
                    ARR: {type: Scratch.ArgumentType.STRING, defaultValue: '["yes","no"]'},
                },
                    allowDropAnywhere: true,
            },

            
          ],
          menus: {
          vars: {
            acceptReporters: true,
            items: 'getThoseVars' 
          },
          lists: {
            acceptReporters: true,
            items: 'getThoseLists'   
          },
          ul:{
            acceptReporters:false,
            items:["upper()", "lower()", "title()"]
          },
          strip:{
            acceptReporters:false,
            items:["strip()", "lstrip()", "rstrip()"],
          },
          find:{
            acceptReporters:false,
            items:["find", "rfind"]
          },
          ops:{
            acceptReporters:false,
            items:["==", "!=", "<", "<=", ">", ">="]
          },
          listsops:{
            acceptReporters:false,
            items:["append", "remove"]
          },
          andorpython:{
            acceptReporters:false,
            items:["and", "or"]
          },
          add:{
            acceptReporters:false,
            items:["+", "-", "*", "/"]
          },
        singleArgOps: {
          acceptReporters: false,
          items: [
            { text: 'sqrt', value: 'sqrt' },
            { text: 'cbrt', value: 'cbrt' },
            { text: 'floor', value: 'floor' },
            { text: 'ceil', value: 'ceil' },
            { text: 'trunc', value: 'trunc' },
            { text: 'fabs', value: 'fabs' },
            { text: 'factorial', value: 'factorial' },
            { text: 'exp', value: 'exp' },
            { text: 'exp2', value: 'exp2' },
            { text: 'log', value: 'log' },
            { text: 'log2', value: 'log2' },
            { text: 'log10', value: 'log10' },
            { text: 'sin', value: 'sin' },
            { text: 'cos', value: 'cos' },
            { text: 'tan', value: 'tan' },
            { text: 'asin', value: 'asin' },
            { text: 'acos', value: 'acos' },
            { text: 'atan', value: 'atan' },
            { text: 'sinh', value: 'sinh' },
            { text: 'cosh', value: 'cosh' },
            { text: 'tanh', value: 'tanh' },
            { text: 'asinh', value: 'asinh' },
            { text: 'acosh', value: 'acosh' },
            { text: 'atanh', value: 'atanh' },
            { text: 'degrees', value: 'degrees' },
            { text: 'radians', value: 'radians' }
          ]
        },
        mathConstants: {
          acceptReporters: false,
          items: [
            { text: 'pi', value: 'pi' },
            { text: 'e', value: 'e' },
            { text: 'tau', value: 'tau' },
            { text: 'inf', value: 'inf' },
            { text: 'nan', value: 'nan' }
          ]
        },
        twoArgOps: {
          acceptReporters: false,
          items: [
            { text: 'pow', value: 'pow' },
            { text: 'gcd', value: 'gcd' },
            { text: 'lcm', value: 'lcm' },
            { text: 'fmod', value: 'fmod' },
            { text: 'remainder', value: 'remainder' },
            { text: 'atan2', value: 'atan2' },
            { text: 'hypot', value: 'hypot' }
          ]
        },
          timeOps: {
            acceptReporters: false,
            items: [
              { text: 'time()', value: 'time' },
              { text: 'ctime()', value: 'ctime' },
              { text: 'sleep()', value: 'sleep' },
              { text: 'gmtime()', value: 'gmtime' },
              { text: 'localtime()', value: 'localtime' },
              { text: 'asctime()', value: 'asctime' }
            ]
          },
            oo: {
            acceptReporters: false,
            items: ["on","off"]
          }
          }
        };
      }


openPyDocs(){
//     window.open('')
}

setstrict(args, util){
    if(args.OO === "on"){
        this.strictEditing = true
    } else {
        this.strictEditing = false
    }
}

isstrict(args, utii){
    return(this.strictEditing)
}
aboutstrict(){
                    window.alert("Strict editing makes the blue python blocks only work when they are under the When Python Code Starts hat block. This is similar to how the editor works in Edublocks. If you have it off, it will allow python blocks to be used outside of python scripts (not recommended). However, it can be turned off for certain debugging purposes, but by default it is on to mirror coding in Python as much as possible. Feel free to turn it off if it annoys you.")
}



 range = (start, end) => JSON.stringify(Array.from({ length: end - start }, (_, i) => start + i))

    reportParentLoop(args, util) {

    }
   reportParentLoop(args, util) {
      const loopBlock = this._getParentLoopBlock(util);
      
      if (!loopBlock) {
        return 'Not inside any loop block!';
      }

      // Returns the opcode (e.g., "control_repeat", "control_forever", "control_repeat_until")
      return `Inside a loop block of type: ${loopBlock.opcode}`;
    }
_getParentLoopBlock(util) {
  const target = util.target;
  const blocks = target.blocks;
  
  // 1. Get ALL block IDs currently active or paused in this thread stack
  const blockStack = util.thread.stack;

  // 2. Iterate through every active block in the running thread sequence
  for (let i = 0; i < blockStack.length; i++) {
    let currentBlockId = blockStack[i];

    // Traverse upwards from each block in the active thread sequence
    while (currentBlockId) {
      const block = blocks.getBlock(currentBlockId);
      if (!block) break;

      // Check if this block itself is a loop
      if (
        block.opcode.includes('repeat') || 
        block.opcode.includes('forever') ||
        block.opcode === 'control_for_each'
      ) {
        return block; // Found it!
      }

      // 3. Check if this block is nested directly inside a loop's mouth (SUBSTACK)
      for (const id of Object.keys(blocks._blocks)) {
        const potentialLoop = blocks.getBlock(id);
        if (potentialLoop && potentialLoop.inputs && potentialLoop.inputs.SUBSTACK) {
          if (potentialLoop.inputs.SUBSTACK.block === currentBlockId) {
            return potentialLoop; // Found it via loop mouth structural link!
          }
        }
      }

      // Check the block's physical parent connection
      currentBlockId = block.parent;
    }
  }

  return null; // Truly not inside any loop
}


      _getThreadStorage(util) {
      // util.thread represents the precise, actively-running block sequence
      if (!util.thread.temporaryVariablesStore) {
        util.thread.temporaryVariablesStore = {};
      }
      return util.thread.temporaryVariablesStore;
    }

    // Set variable inside the thread scope
    setTempVar(args, util, name, val) {
      const storage = this._getThreadStorage(util);
      storage[name] = val;
    }

    // Read variable from the thread scope
    getTempVar(args, util, name) {
      const storage = this._getThreadStorage(util);
      console.log(storage)
      // Returns the value, or 0 if it has not been defined yet
      return storage[name] !== undefined ? storage[name] : 0;
    }




    // Helper Functions
    getTargets(myself, all) {
      const spriteNames = [];
      if (myself) spriteNames.push({ text: "myself", value: "_myself_" });
      else spriteNames.push({ text: "Stage", value: "_stage_" });
      if (all) {
        spriteNames.push(
          { text: "All Sprites", value: "_all_" }, { text: "All Main Sprites", value: "_all_2" }, { text: "All Clones", value: "_all_3" }
        );
      }  
      const targets = runtime.targets;
      for (let i = 1; i < targets.length; i++) {
        const target = targets[i];
        const name = target.getName();
        if (target.isOriginal) spriteNames.push({ text: name, value: name });
      }
      return spriteNames.length > 0 ? spriteNames : [""];
    }

    organizeHats() {
      const allHats = runtime._hats;
      const vanillaHats = [
        {text: "when I start as clone", value: "control_start_as_clone"},
        {text: "when green flag clicked", value: "event_whenflagclicked"},
        {text: "when key pressed", value: "event_whenkeypressed"},
        {text: "when sprite clicked", value: "event_whenthisspriteclicked"},
        {text: "when stage clicked", value: "event_whenstageclicked"},
        {text: "when backdrop switches", value: "event_whenbackdropswitchesto"},
        {text: "when touching object", value: "event_whentouchingobject"},
        {text: "when value greater than", value: "event_whengreaterthan"},
        {text: "when broadcast received", value: "event_whenbroadcastreceived"}
      ];
      const startIndex = Object.keys(allHats).findIndex(k => k === "event_whenbroadcastreceived");
      const filteredHats = Object.keys(allHats).filter((_, i) => i > startIndex).map(k => ({ text: k, value: k }));
      return [...vanillaHats, ...filteredHats];
    }

    addMissKeys(sourceObj, checkedObj) {
      Object.keys(sourceObj).forEach(key => {
        if (!(key in checkedObj)) checkedObj[key] = sourceObj[key];
      });
      Object.keys(sourceObj.stackFrames[0]).forEach(key => {
        if (!(key in checkedObj.stackFrames[0])) checkedObj.stackFrames[0][key] = sourceObj.stackFrames[0][key];
      });
      return checkedObj;
    }

    pushThreadTarget(id, newT, oldT, stack) {
      const thread = runtime._pushThread(id, oldT, { stackClick: stack });
      thread.target = newT; thread.ogTarget = oldT;
      if (runtime.compilerOptions.enabled) thread.tryCompile();
      return thread;
    }

    pushThread(id, util, opts) {
      const ogTarget = util.thread.ogTarget;
      const target = ogTarget ? ogTarget : util.target;
      const thread = runtime._pushThread(id, target, opts);
      if (ogTarget) {
        thread.target = util.target;
        thread.ogTarget = target;
      }
      if (runtime.compilerOptions.enabled) thread.tryCompile();
      return thread;
    }

    genFakeCode(block, util, newTarget) {
      if (!Thread) return "Extra Controls could not access Exports!";
      if (!block) return "";
      return new Promise((resolve) => {
        const thread = util.thread;
        const tempThread = new Thread(block.id);
        tempThread.pushStack(block.id);
        overrideCalls[block.id] = tempThread;
        tempThread.stackClick = true;
        tempThread.blockContainer = thread.blockContainer;
        tempThread.target = newTarget;
        tempThread.ogTarget = util.ogTarget ?? util.target;
        tempThread.pushReportedValue = (value) => resolve(value);
        runtime.threads.push(tempThread);
        if (!tempThread.stackClick && !tempThread.updateMonitor) runtime.threadMap.set(tempThread.getId(), tempThread);
        if (runtime.compilerOptions.enabled) tempThread.tryCompile();
      });
    }

    getThisBlock(util, branch, optBranch) {
      if (branch) return util.thread.blockContainer.getBranch(util.thread.peekStack(), optBranch ? optBranch : 1);
      else return util.thread.blockContainer.getBlock(util.thread.isCompiled ? util.thread.peekStack() : util.thread.peekStackFrame().op.id);
    }

    getLoopBlock(thread) {
      const stackFrames = thread.stackFrames, frameCount = stackFrames.length;
      let loopBlock = null, stackIndex = -1;
      for (let i = frameCount - 1; i >= 0; i--) {
        if (i < 0) break;
        if (!stackFrames[i].isLoop) continue;
        loopBlock = stackFrames[i].op.id;
        stackIndex = i;
        break;
      }
      if (!loopBlock) return false;
      return { block: loopBlock, index: stackIndex };
    }


    getBlockAbove(args, util) {
      // 1. Identify the active script execution thread
      const thread = util.thread;
      if (!thread) return 'No active thread';

      // 2. Fetch the specific visual block currently executing this function
      const currentBlockId = thread.peekStack();
      if (!currentBlockId) return 'Could not find current block ID';

      // 3. Look up the block object inside the sprite's target runtime container
      const blockContainer = thread.blockContainer;
      const currentBlock = blockContainer.getBlock(currentBlockId);
      if (!currentBlock) return 'Error reading current block object';

      // 4. Extract the unique ID of the block attached to its top connection notch
      const parentBlockId = currentBlock.parent;
      if (!parentBlockId) {
        return 'Top of stack'; // No block is physically above this one
      }

      // 5. Look up the parent block to retrieve its identifier
      const parentBlock = blockContainer.getBlock(parentBlockId);
      if (!parentBlock) return 'Unknown block connection';

      // 6. Return the internal Scratch/PenguinMod execution opcode name
      return parentBlock.opcode;
    }



    // 1. Ensure the thread context exists
    check(args, util){
        if(this.strictEditing){
        // return true
    if (!util || !util.thread) {
      return 'No Thread Found';
    }
    

    const thread = util.thread;
    const blockContainer = thread.target.blocks;
    
    // 2. Get the block that is currently executing right now (this reporter)
    let currentBlockId = thread.peekStack();
    if (!currentBlockId) return false;

    let currentBlock = blockContainer.getBlock(currentBlockId);
    if (!currentBlock) return true;

    // 3. Trace upward through parents until hitting the top-level Hat block
    while (currentBlock && currentBlock.parent) {
      currentBlockId = currentBlock.parent;
      currentBlock = blockContainer.getBlock(currentBlockId);
    }

    // 4. Return the top block's opcode
    if (currentBlock) {
      return (currentBlock.opcode === "scrtwpmrunpy_whenSessionStarts");
    }

    return false;
} else {return true}
    }
 
    getThoseVars() {
      // Always ensure there is at least one fallback option so the dropdown doesn't crash
      if (this.variables.length === 0) {
        return ['Create a variable!'];
      }
      return this.variables;
    }

    getThoseLists() {
      // Always ensure there is at least one fallback option so the dropdown doesn't crash
      if (this.lists.length === 0) {
        return ['Create a list!'];
      }
      return this.lists;
    }

    startSession(args, util){
        util.startHats('scrtwpmrunpy_whenSessionStarts')
    }

    whenSessionStarts(args){
        return true
    }



      displayBlock(args, util) {
        
        try{
            Array.from(document.querySelectorAll("#pythonblock")).forEach((item, index) => {
                item.remove()
            })

        }catch(error){

        }
      const el = document.createElement("div");
      el.id = "pythonblock"
      el.style.width = "100%"
      el.style.height = "100%"
      el.style.backgroundColor = "black";
      el.style.fontFamily = "consolas"
      el.style.fontSize = "15px"
      el.style.color = "white"
      el.style.padding = "15px"
      el.style.overflowY = "scroll"
    
      // 2. Style it to float over the canvas
      el.style.position = 'absolute';
      el.style.pointerEvents = 'auto'; // Set to 'none' if it shouldn't block clicks
      el.style.zIndex = '10';
      
      // 3. Position (Note: Stage center is 0,0; HTML top-left is 0,0)
      el.style.left = 0;
      el.style.top = 0;

      // 4. Append to the stage parent container
      const container = Scratch.renderer.canvas.parentElement;
      container.appendChild(el);
          document.getElementById("pythonblock").innerHTML = this.pytext

      }

      deleteBlock(args, util){
        
        try{
            Array.from(document.querySelectorAll("#pythonblock")).forEach((item, index) => {
                item.remove()
            })

        }catch(error){

        }
      }

      clear(args, util){
        try{
          this.pytext = ""
          document.getElementById("pythonblock").innerHTML = this.pytext
          document.getElementById("theelemtnforpython").remove()

          
        }catch(error){

        }
      }
      print(args, util){if(this.check(args, util)){
        try{
        this.pytext = `${this.pytext}<br>${args.TEXT}`
        document.getElementById("pythonblock").innerHTML = this.pytext
        
        }catch(error){

        }
      } else {throw new Error("Block must be under the When Python Code Starts event")}}

block(){
    return(this.text)
}

      getpytext(args, util){if(this.check(args, util)){
        return(this.pytext.replaceAll("<br>", "\n"))
      } else {throw new Error("Block must be under the When Python Code Starts event")}}

      
    getvar(args, util) {if(this.check(args, util)){
        try{
        if(args.NAME !== "Create a variable!"){
            return(this[`var${args.NAME}`])
        }
                  
        }catch(error){

        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    deletevar(args, util) {
      const newItem = String(args.NAME);

        let vars = this.variables;
        let index = vars.indexOf(newItem);

        if (index > -1) {
        vars.splice(index, 1);
        }
    }
    createvar (args, util){
        const newItem = String(args.NAME);
      if (!this.variables.includes(newItem)) {
        this.variables.push(newItem);
      }
      this[`var${newItem}`] = "0"

    }

    setvar(args, util){if(this.check(args, util)){
        if(this.variables.includes(args.NAME)){
            this[`var${args.NAME}`] = args.VALUE
        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}



    getlist(args, util) {if(this.check(args, util)){
        try{
        if(args.NAME !== "Create a list!"){
            return(this[`lst${args.NAME}`])
        }
                  
        }catch(error){

        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    deletelist(args, util) {
      const newItem = String(args.NAME);

        let lsts = this.lists;
        let index = lsts.indexOf(newItem);

        if (index > -1) {
        lsts.splice(index, 1);
        }
    }
    createlist (args, util){
        const newItem = String(args.NAME);
      if (!this.lists.includes(newItem)) {
        this.lists.push(newItem);
      }
      this[`lst${newItem}`] = '["item"]'

    }

    setlist(args, util){if(this.check(args, util)){

    const prefix = "ARG";
      let string = "[";
      for (let i = 0; prefix + i in args; i++) {
        string += '"'
        string += Scratch.Cast.toString(args[prefix + i]);
        string += '"'
        string += ","
      }
      string = string.slice(0, -1)
      string += "]"



        if(this.lists.includes(args.NAME)){
            this[`lst${args.NAME}`] = string
        }

    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    setlisttwo(args, util){if(this.check(args, util)){

        if(this.lists.includes(args.NAME)){
            this[`lst${args.NAME}`] = args.VALUE
        }

    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    joiner(args, util){if(this.check(args, util)){

    const prefix = "ARG";
      let string = args.JOINED;
      for (let i = 0; prefix + i in args; i++) {
        string += Scratch.Cast.toString(args[prefix + i]);
      }
      return(string)
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    sleep(args, util){if(this.check(args, util)){
    return new Promise((resolve) => {
        const delayMs = Number(args.NUM) * 1000;
        
        setTimeout(() => {
            resolve();
        }, delayMs);
    });
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    toul(args, util){if(this.check(args, util)){
    const inputStr = String(args.TEXT);
    // Check the selected dropdown menu choice
    if (args.UL === "upper()") {
        return inputStr.toUpperCase();
    } else if (args.UL === "lower()") {
        return inputStr.toLowerCase();
    } else {
        return inputStr
            .toLowerCase()
            .replace(/\b\w/g, char => char.toUpperCase());
    }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}
    
    strreplace(args, util){if(this.check(args, util)){
        return(args.STRING.replaceAll(args.T1, args.T2))
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    
    input(args, util){if(this.check(args, util)){
      if (document.querySelector('#pythonblock')) {

try{

this.pytext = `${this.pytext}<br>${args.INPUT}`;
document.getElementById("pythonblock").innerHTML = this.pytext;
this.text = "";

try {
    const oldEl = document.getElementById("theelemtnforpython");
    if (oldEl) oldEl.remove();
} catch (error) {
}

const els = document.createElement('span');
els.id = "theelemtnforpython";
els.setAttribute("tabindex", -1);
els.style.outline = "none"; // Hide focus ring

const container = Scratch.renderer.canvas.parentElement;
container.appendChild(els);
els.focus();

return new Promise((resolve) => {
    const handleKeyDown = (event) => {
        const key = event.key;

        if (key === "Enter") {
            this.pytext = `${this.pytext}${this.text}`;
            document.getElementById("pythonblock").innerHTML = this.pytext;
            
            els.removeEventListener('keydown', handleKeyDown);
            els.remove();
            
            resolve(this.text);
            return;
        }

        if (key === "Backspace") {
            this.text = this.text.slice(0, -1);
            document.getElementById("pythonblock").innerHTML = `${this.pytext}${this.text}`;
        } else if (key.length === 1) {
            this.text = this.text + key;
            document.getElementById("pythonblock").innerHTML = `${this.pytext}${this.text}`;
        }
    };

    els.addEventListener('keydown', handleKeyDown);
});
}catch(error){

}

      } else {throw new Error("The python output must be showing.")}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


        ans(args, util){if(this.check(args, util)){
        return(this.text)
    } else {throw new Error("Block must be under the When Python Code Starts event")}}
        
    strstrip(args, util){if(this.check(args, util)){
        if(args.STRIP === "strip()"){
            return(args.STRING.trim())
        } else if(args.STRIP === "lstrip()"){
            return(args.STRING.trimStart())
        } else {
            return(args.STRING.trimEnd())
        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}




    itrstr(args, util){if(this.check(args, util)){
        try{
        return(args.STRING[Number(args.INDEX)])
        } catch (error){}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    itrlist(args, util){if(this.check(args, util)){
        try{
        return(JSON.parse(this[`lst${args.LIST}`] )[Number(args.INDEX)])
        } catch (error){}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    strcount(args, util){if(this.check(args, util)){
        return(args.STRING.split(args.LETTER).length - 1)
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    strcounttwo(args, util){if(this.check(args, util)){
        return(args.STRING.slice(args.N1, args.N2).split(args.LETTER).length - 1)
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    strfind(args, util){if(this.check(args, util)){
        if(args.FIND === "find"){
            return(args.STRING.indexOf(args.LETTER))
        } else {
            return(args.STRING.lastIndexOf(args.LETTER))
        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    mathematics(args, util){if(this.check(args, util)){
        return(Math[args.MATH](args.NUM))
    } else {throw new Error("Block must be under the When Python Code Starts event")}}
    

  executePyMath(args, util) {if(this.check(args, util)){
    const x = Number(args.X);
    const op = args.OPERATION;

    switch (op) {
      case 'sqrt': return x < 0 ? "ValueError: math domain error" : Math.sqrt(x);
      case 'cbrt': return Math.cbrt(x);
      case 'floor': return Math.floor(x);
      case 'ceil': return Math.ceil(x);
      case 'trunc': return Math.trunc(x);
      case 'fabs': return Math.abs(x);
      case 'exp': return Math.exp(x);
      case 'exp2': return Math.pow(2, x);
      case 'log': return x <= 0 ? "ValueError: math domain error" : Math.log(x);
      case 'log2': return x <= 0 ? "ValueError: math domain error" : Math.log2(x);
      case 'log10': return x <= 0 ? "ValueError: math domain error" : Math.log10(x);
      
      case 'factorial':
        if (x < 0 || !Number.isInteger(x)) return "ValueError: factorial() only accepts non-negative integers";
        let r = 1;
        for (let i = 2; i <= x; i++) r *= i;
        return r;

      case 'sin': return Math.sin(x);
      case 'cos': return Math.cos(x);
      case 'tan': return Math.tan(x);
      case 'asin': return (x < -1 || x > 1) ? "ValueError: math domain error" : Math.asin(x);
      case 'acos': return (x < -1 || x > 1) ? "ValueError: math domain error" : Math.acos(x);
      case 'atan': return Math.atan(x);

      case 'sinh': return Math.sinh(x);
      case 'cosh': return Math.cosh(x);
      case 'tanh': return Math.tanh(x);
      case 'asinh': return Math.asinh(x);
      case 'acosh': return x < 1 ? "ValueError: math domain error" : Math.acosh(x);
      case 'atanh': return (x <= -1 || x >= 1) ? "ValueError: math domain error" : Math.atanh(x);

      case 'degrees': return x * (180 / Math.PI);
      case 'radians': return x * (Math.PI / 180);

      default: return 0;
    }
  } else {throw new Error("Block must be under the When Python Code Starts event")}}

  getPyConstant(args, util) {if(this.check(args, util)){
    switch (args.CONSTANT) {
      case 'pi': return Math.PI;
      case 'e': return Math.E;
      case 'tau': return 2 * Math.PI;
      case 'inf': return Infinity;
      case 'nan': return NaN;
      default: return 0;
    }
  }else {throw new Error("Block must be under the When Python Code Starts event")}}

  executePyMath2Arg(args, util) {if(this.check(args, util)){
    const x = Number(args.X);
    const y = Number(args.Y);
    const op = args.OPERATION;

    switch (op) {
      case 'pow': return Math.pow(x, y);
      case 'fmod': return x % y;
      case 'atan2': return Math.atan2(x, y); 
      case 'hypot': return Math.hypot(x, y);
      
      case 'gcd':
        const _gcd = (a, b) => {
          a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
          while (b) { let t = b; b = a % b; a = t; }
          return a;
        };
        return _gcd(x, y);
        
      case 'lcm':
        if (x === 0 && y === 0) return 0;
        const _lcmGcd = (a, b) => {
          a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b));
          while (b) { let t = b; b = a % b; a = t; }
          return a;
        };
        return Math.abs(Math.round(x) * Math.round(y)) / _lcmGcd(x, y);
        
      case 'remainder':
        return x - y * Math.round(x / y);

      default: return 0;
    }
  } else {throw new Error("Block must be under the When Python Code Starts event")}}
  

    ifs(args, util){if(this.check(args, util)){

        let theval = ""
const blockContainer = util.thread.blockContainer;
const currentBlockId = util.thread.peekStack(); //
const currentBlock = blockContainer.getBlock(currentBlockId);
if (args.BOOL){
    util.startBranch(1, false)
}

if (currentBlock) {
  // 2. Add your custom hidden property (give it a unique name)
  currentBlock.myHiddenPythonMeta = {
    isElifChained: args.BOOL,
    compiledScope: 'global',
    fallbackLine: 42
  };
  
  console.log("Successfully attached hidden property to the block!");
}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    elifs(args, util){if(this.check(args, util)){
        if(this.getBlockAbove(args, util) === "scrtwpmrunpy_ifs" || this.getBlockAbove(args, util) === "scrtwpmrunpy_elifs"){


let theval = false; 

const blockContainer = util.thread.blockContainer;
const currentBlockId = util.thread.peekStack();
const currentBlock = blockContainer.getBlock(currentBlockId);

if (currentBlock && currentBlock.parent) {
  const parentBlockId = currentBlock.parent;
  const parentBlock = blockContainer.getBlock(parentBlockId);

  if (parentBlock && parentBlock.myHiddenPythonMeta) {
    const meta = parentBlock.myHiddenPythonMeta;
    console.log("Read hidden data from parent status:", meta.isElifChained);

    // If any block above us in the chain already evaluated to true, 
    // then this block is blocked from running (theval becomes true to signify 'already handled')
    if (meta.isElifChained === true) {
      theval = true;
    }
  }
} else {
  console.log("This block does not have a parent sitting directly above it.");
}

// Evaluate this current block's input condition (using the 'BOOL' slot)
const currentConditionResult = Boolean(args.BOOL);

if (currentBlock) {
  // If the chain was already handled above us, pass down 'true'.
  // If the chain wasn't handled, but THIS block is true, pass down 'true'.
  // Otherwise, pass down 'false' so the next block down the stack gets a turn.
  currentBlock.myHiddenPythonMeta = {
    isElifChained: theval || currentConditionResult,
    compiledScope: 'global',
    fallbackLine: 42
  };
  
  console.log("Successfully attached hidden property to the block!");
}

// ONLY execute this block's branch if the chain hasn't been handled yet
// AND this block's condition slot evaluates to true
if (!theval && currentConditionResult) {
  util.startBranch(1, false);
}


        } else {
            throw new Error("elif: must be under an if: or elif: block")
        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    elses(args, util){if(this.check(args, util)){
        if(this.getBlockAbove(args, util) === "scrtwpmrunpy_ifs" || this.getBlockAbove(args, util) === "scrtwpmrunpy_elifs" ){let theval = false; 

const blockContainer = util.thread.blockContainer;
const currentBlockId = util.thread.peekStack();
const currentBlock = blockContainer.getBlock(currentBlockId);

if (currentBlock && currentBlock.parent) {
  const parentBlockId = currentBlock.parent;
  const parentBlock = blockContainer.getBlock(parentBlockId);

  if (parentBlock && parentBlock.myHiddenPythonMeta) {
    const meta = parentBlock.myHiddenPythonMeta;
    console.log("Read hidden data from parent status:", meta.isElifChained);

    // If any block above us in the chain already evaluated to true, 
    // then this block is blocked from running (theval becomes true to signify 'already handled')
    if (meta.isElifChained === true) {
      theval = true;
    }
  }
} else {
  console.log("This block does not have a parent sitting directly above it.");
}

// Evaluate this current block's input condition (using the 'BOOL' slot)
// const currentConditionResult = Boolean(args.BOOL);

if (currentBlock) {
  // If the chain was already handled above us, pass down 'true'.
  // If the chain wasn't handled, but THIS block is true, pass down 'true'.
  // Otherwise, pass down 'false' so the next block down the stack gets a turn.
  currentBlock.myHiddenPythonMeta = {
    isElifChained: theval,
    compiledScope: 'global',
    fallbackLine: 42
  };
  
  console.log("Successfully attached hidden property to the block!");
}

// ONLY execute this block's branch if the chain hasn't been handled yet
// AND this block's condition slot evaluates to true
if (!theval) {
  util.startBranch(1, false);
}


        } else {
            throw new Error("elif: must be under an if: or elif: block")
        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    oneopstwo(args, util){if(this.check(args, util)){
        switch(args.OPERATION){
            case ">" : return Number(args.ONE) > Number(args.TWO);
            case "<" : return Number(args.ONE) < Number(args.TWO);
            case ">=" : return Number(args.ONE) >= Number(args.TWO);
            case "<=" : return Number(args.ONE) <= Number(args.TWO);
            case "==" : return args.ONE == args.TWO
            case "!=" : return !(args.ONE == args.TWO)
        }

    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    oneandortwo(args, util){if(this.check(args, util)){
        if(args.OPERATION === "and"){
            return(args.ONE && args.TWO)
        } else {
            return(args.ONE || args.TWO)
        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    notone(args, util){if(this.check(args, util)){
        return(!args.ONE)
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    reverselist(args, util){if(this.check(args, util)){
        console.log(this)
        console.log(JSON.parse((this[`lst${args.LIST}`])))
        this[`lst${args.LIST}`] = JSON.stringify(JSON.parse((this[`lst${args.LIST}`])).toReversed())
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    
    indexlist(args, util){if(this.check(args, util)){
        return(JSON.parse(this[`lst${args.LIST}`]).indexOf(args.TEXT))
    } else {throw new Error("Block must be under the When Python Code Starts event")}}



    
    operatelist(args, util){if(this.check(args, util)){
switch(args.OPERATION) {
    // items:["append", "insert", "extend", "pop", "remove"]
    case "append": {
        console.log(this[`lst${args.LIST}`]);
        let array = JSON.parse(this[`lst${args.LIST}`]);
        array.push(String(args.TEXT));
        this[`lst${args.LIST}`] = JSON.stringify(array);
        break; // Prevents falling through to extend
    }
    case "remove": {
        let list = JSON.parse(this[`lst${args.LIST}`]);
        let index = list.indexOf(args.TEXT);
        if (index !== -1) {
            list.splice(index, 1);
        }
        this[`lst${args.LIST}`] = JSON.stringify(list);
        break;
    }
}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    listpop(args, util){if(this.check(args, util)){
                let list = JSON.parse(this[`lst${args.LIST}`])
                // Find the index of the first "banana"
                let index = list.indexOf(args.TEXT);
                let item = list[index]
                if (index !== -1) {
                    list.splice(index, 1); // Removes 1 item at that index
                }

                this[`lst${args.LIST}`] = JSON.stringify(list);
                return(item)
        
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    listinsert(args, util){if(this.check(args, util)){
        console.log(JSON.parse(this[`lst${args.LIST}`]))
        console.log(args.NUM)
        console.log(args.TEXT)
        let array = JSON.parse(this[`lst${args.LIST}`]);

        // Splice modifies 'array' in-place and returns the deleted items (none)
        array.splice(Number(args.NUM), 0, args.TEXT); 

        // Save the mutated 'array' back to your state
        this[`lst${args.LIST}`] = JSON.stringify(array);
    } else {throw new Error("Block must be under the When Python Code Starts event")}}
 


    extendlist(args, util){if(this.check(args, util)){
        // if(this.lists.includes(args.LISTR))
        let array = JSON.parse(this[`lst${args.LIST}`]);
        let itemsToAdd = JSON.parse(args.L2);
        array.push(...itemsToAdd); // Modifies the array in-place
        this[`lst${args.LIST}`] = JSON.stringify(array);
        // break; // Prevents falling through to remove
    } else {throw new Error("Block must be under the When Python Code Starts event")}}



    whileloop(args, util){if(this.check(args, util)){
        if (args.BOOL) {
            util.startBranch(1, true)
        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    foriinlist(args, util){if(this.check(args, util)){
  let arr;
  try {
    arr = typeof args.LIST === 'object' ? args.LIST : JSON.parse(args.LIST);
    if (!Array.isArray(arr)) arr = []; // Fallback if input is JSON object but not an array
  } catch (e) {
    arr = []; // Fallback if text is not valid JSON
  }

  // 2. Initialize tracking index on the persistent block stack frame
  if (typeof util.stackFrame.index === 'undefined') {
    util.stackFrame.index = 0;
  }

  // 3. Check your custom evaluation condition and verify array bounds
  if (this.check(args, util) && util.stackFrame.index < arr.length) {
    
    // Extract the element corresponding to the current step sequence
    const currentItem = arr[util.stackFrame.index];

    // Assign your context index tracking pointer (e.g. this.varIndexName)
    // Supports dynamic variable naming flags passed into the arguments channel
    this[`var${args.I}`] = currentItem;

    // Increment tracking pointer safely BEFORE starting the branch processing frame
    util.stackFrame.index++;

    // Execute internal blocks, looping back smoothly for the next item sequence
    util.startBranch(1, true);
  }
        
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    breaknow(args, util){if(this.check(args, util)){
  if (!util || !util.thread) return;
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    rangesone(args, util){if(this.check(args, util)){
        return(this.range(0, Number(args.N2)))
    } else {throw new Error("Block must be under the When Python Code Starts event")}}



    rangestwo(args, util){if(this.check(args, util)){
        return(this.range(Number(args.N1), Number(args.N2)))
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    
    deffunc(args, util){if(this.check(args, util)){
        util.thread[`pythonfunc${args.NAME}`] = this.getThisBlock(util, true, 1);
        util.thread[`pythonfunc${args.NAME}args`] = args.ARG.replace(/\s/g, "").split(",")
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    
    deffuncclass(args, util){if(this.check(args, util)){

        let yes
    let loopBlock
    let classs
        try{
         loopBlock = this._getParentLoopBlock(util);

      if (loopBlock.opcode === "scrtwpmrunpy_setclass") {
        yes = true
      } else {
        yes = false
      }



      console.log("yes", yes)
        console.log(this.getBlockAbove(args, util))
      // Check the execution thread history array to verify the active block trail
      const blockStack = util.thread.stack;
      const target = util.target;
      const blocks = target.blocks;

      for (let i = 0; i < blockStack.length; i++) {
        let currentBlockId = blockStack[i];

        while (currentBlockId) {
          const block = blocks.getBlock(currentBlockId);
            console.log("is und:" , util.thread.lastClassName)
          if (!block) break;

          // If the thread actively contains our specific custom loop block opcode
        //   if (block.opcode === 'scrtwpmrunpy_setclass') {
            // Safely fall back to the thread property we cached during the loop step execution
            if (util.thread.lastClassName !== undefined) {
              classs =  util.thread.lastClassName;
            //   console.log(lastClassName)
            }

            // Fallback: directly parse the static input text if the thread hasn't cached it yet
            if (block.inputs && block.inputs.CLASS) {
              const inputBlockId = block.inputs.CLASS.block;
              const rawValue = util.runtime.getScriptRuntimePosition(target, inputBlockId);
              classs =  rawValue;
            }
        //   }

        //   Traverse upwards to see if it's nested inside secondary loops or conditionals
          currentBlockId = block.parent;
        }
      }

    //   return 'Not inside a custom loop!';


    
} catch (error) {
}
    if(yes){

        util.thread[`pythonfuncclass${classs}${args.NAME}`] = this.getThisBlock(util, true, 1);
        util.thread[`pythonfuncclass${classs}${args.NAME}args`] = args.ARG.replace(/\s/g, "").split(",")
        console.log("1", `pythonfuncclass${classs}${args.NAME}`)
    } else {throw new Error("Class vars must be set inside of a Class: loop")}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}



     callfuncclass(args, util){if(this.check(args, util)){
        try{
      if (util.stackFrame.SPran) {
        if (runtime.isActiveThread(util.stackFrame.SPran)) util.yield();
      } else {
        console.log("2:", `pythonfuncclass${args.CLASS}${args.NAME}`)
        const func = util.thread[`pythonfuncclass${args.CLASS}${args.NAME}`];
        if (func !== undefined) {
            try{
          const thread = this.pushThread(func, util, { stackClick: false });
          this.addMissKeys(util.thread, thread);
          let argsarg = args.ARG//.replace(/\s/g, ""); 
          let arguement = argsarg.split(",")
          const argNames = util.thread[`pythonfuncclass${args.CLASS}${args.NAME}args`]
          const argVals = arguement
          const argsJSON = Object.fromEntries(
            argNames.map((fruit, index) => [fruit, argVals[index]])
          );
          let last = Object.keys(argsJSON).at(-1)
          console.log("l1", last)
          let lengthOfObject = argNames.length
          console.log("lo", lengthOfObject)
          console.log("sliced", argVals.slice(lengthOfObject - 1))

          console.log("truth:" ,last.slice(0, 2))
          if(last.slice(0, 1) === "*"){
                argsJSON[last] = argVals.slice(lengthOfObject - 1)
          }

          if (thread.RunPython === undefined) { 
            thread.stackFrames[0].RunPython = arguement;
            thread.stackFrames[0].RunPythonARGS = argsJSON;
            }

          util.stackFrame.SPran = thread;
          util.yield();
            } catch (error) {}
        }
      }
    } catch (error) {}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    callfuncclassrr(args, util){if(this.check(args, util)){
      if (util.stackFrame.SPran) {
        if (runtime.isActiveThread(util.stackFrame.SPran)) util.yield();
        else return util.stackFrame.SPran.justReported ?? "";
      } else {
        const func = util.thread[`pythonfuncclass${args.CLASS}${args.NAME}`];
        if (func === undefined) return "";
        else {
          const thread = this.pushThread(func, util, { stackClick: false });
          this.addMissKeys(util.thread, thread);
          let argsarg = args.ARG//.replace(/\s/g, ""); 
          let arguement = argsarg.split(",")
          const argNames = util.thread[`pythonfuncclass${args.CLASS}${args.NAME}args`]
          const argVals = arguement
          const argsJSON = Object.fromEntries(
            argNames.map((fruit, index) => [fruit, argVals[index]])
          );
          let last = Object.keys(argsJSON).at(-1)
          console.log("l1", last)
          let lengthOfObject = argNames.length
          console.log("lo", lengthOfObject)
          console.log("sliced", argVals.slice(lengthOfObject - 1))

          console.log("truth:" ,last.slice(0, 2))
          if(last.slice(0, 1) === "*"){
                argsJSON[last] = argVals.slice(lengthOfObject - 1)
          }

          if (thread.RunPython === undefined) { 
            thread.stackFrames[0].RunPython = arguement;
            thread.stackFrames[0].RunPythonARGS = argsJSON;
            }

          util.stackFrame.SPran = thread;
          util.yield();
        }
      }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    callfunc(args, util){if(this.check(args, util)){
        try{
      if (util.stackFrame.SPran) {
        if (runtime.isActiveThread(util.stackFrame.SPran)) util.yield();
      } else {
        const func = util.thread[`pythonfunc${args.NAME}`];
        if (func !== undefined) {
            try{
          const thread = this.pushThread(func, util, { stackClick: false });
          this.addMissKeys(util.thread, thread);
          let argsarg = args.ARG//.replace(/\s/g, ""); 
          let arguement = argsarg.split(",")
          const argNames = util.thread[`pythonfunc${args.NAME}args`]
          const argVals = arguement
          const argsJSON = Object.fromEntries(
            argNames.map((fruit, index) => [fruit, argVals[index]])
          );
          let last = Object.keys(argsJSON).at(-1)
          console.log("l1", last)
          let lengthOfObject = argNames.length
          console.log("lo", lengthOfObject)
          console.log("sliced", argVals.slice(lengthOfObject - 1))

          console.log("truth:" ,last.slice(0, 2))
          if(last.slice(0, 1) === "*"){
                argsJSON[last] = argVals.slice(lengthOfObject - 1)
          }

          if (thread.RunPython === undefined) { 
            thread.stackFrames[0].RunPython = arguement;
            thread.stackFrames[0].RunPythonARGS = argsJSON;
            }

          util.stackFrame.SPran = thread;
          util.yield();
            } catch (error) {}
        }
      }
    } catch (error) {}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    // templatefunc(args, util){if(this.check(args, util)){
    getarg(args, util) {if(this.check(args, util)){ 
        let returned
        let array = util.thread.stackFrames[0].RunPython
        // let newarr = array.split(",")
        console.log ("array is: " + array, "new array is:" + array)
        console.log (array, array)
        // return (Object.values(array).indexOf(args.ARG))
        if (util.thread.stackFrames[0].RunPythonARGS[args.ARG] === undefined ){
            if (util.thread.stackFrames[0].RunPythonARGS[`*${args.ARG}`] !== undefined) {
                returned = util.thread.stackFrames[0].RunPythonARGS[`*${args.ARG}`]
            }
        } else {
            returned = util.thread.stackFrames[0].RunPythonARGS[args.ARG] 
        }
        return(returned)
    } else {throw new Error("Block must be under the When Python Code Starts event")}}




    callfuncrr(args, util){if(this.check(args, util)){
      if (util.stackFrame.SPran) {
        if (runtime.isActiveThread(util.stackFrame.SPran)) util.yield();
        else return util.stackFrame.SPran.justReported ?? "";
      } else {
        const func = util.thread[`pythonfunc${args.NAME}`];
        if (func === undefined) return "";
        else {
          const thread = this.pushThread(func, util, { stackClick: false });
          this.addMissKeys(util.thread, thread);
          let argsarg = args.ARG//.replace(/\s/g, ""); 
          let arguement = argsarg.split(",")
          const argNames = util.thread[`pythonfunc${args.NAME}args`]
          const argVals = arguement
          const argsJSON = Object.fromEntries(
            argNames.map((fruit, index) => [fruit, argVals[index]])
          );
          let last = Object.keys(argsJSON).at(-1)
          console.log("l1", last)
          let lengthOfObject = argNames.length
          console.log("lo", lengthOfObject)
          console.log("sliced", argVals.slice(lengthOfObject - 1))

          console.log("truth:" ,last.slice(0, 2))
          if(last.slice(0, 1) === "*"){
                argsJSON[last] = argVals.slice(lengthOfObject - 1)
          }

          if (thread.RunPython === undefined) { 
            thread.stackFrames[0].RunPython = arguement;
            thread.stackFrames[0].RunPythonARGS = argsJSON;
            }

          util.stackFrame.SPran = thread;
          util.yield();
        }
      }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    returnfunc(args, util){if(this.check(args, util)){
      util.thread.justReported = args.VALUE;
      //Delay the Deletion of this Thread
      if (util.stackTimerNeedsInit()) {
        util.startStackTimer(0);
        runtime.requestRedraw();
        util.yield();
      } else if (!util.stackTimerFinished()) util.yield();
      util.thread.stopThisScript();
    } else {throw new Error("Block must be under the When Python Code Starts event")}}





    getarg2(args, util) {if(this.check(args, util)){ return util.thread.stackFrames[0].RunPython ?? "" } else {throw new Error("Block must be under the When Python Code Starts event")}}
    // } else {throw new Error("Block must be under the When Python Code Starts event")}}



    argsreporter(args, util){if(this.check(args, util)){
        
    const prefix = "ARG";
      let string = "";
      for (let i = 0; prefix + i in args; i++) {
        string += Scratch.Cast.toString(args[prefix + i]);
        string += ","
      }
      string = string.slice(0, -1)

      return(string)
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    randchoice(args, util){if(this.check(args, util)){
        return (JSON.parse(args.ARR)[Math.floor(Math.random() * JSON.parse(args.ARR).length)])
    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    add(args, util){if(this.check(args, util)){
        switch(args.ADD) {
            case "+" : return Number(args.ONE) + Number(args.TWO);
            case "-" : return Number(args.ONE) - Number(args.TWO);
            case "*" : return Number(args.ONE) * Number(args.TWO);
            case "/" : return Number(args.ONE) / Number(args.TWO);
        }
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    setclass(args, util){if(this.check(args, util)){
        util.thread.lastClassName = args.CLASS;
        util.startBranch(1, false)
    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    setclassvar(args, util){if(this.check(args, util)){
    let yes
    let loopBlock
    let classs
        try{
         loopBlock = this._getParentLoopBlock(util);

      if (loopBlock.opcode === "scrtwpmrunpy_setclass" || loopBlock.opcode === "scrtwpmrunpy_deffuncclass") {
        yes = true
      } else {
        yes = false
      }
      console.log("yes", yes)

      // Check the execution thread history array to verify the active block trail
      const blockStack = util.thread.stack;
      const target = util.target;
      const blocks = target.blocks;

      for (let i = 0; i < blockStack.length; i++) {
        let currentBlockId = blockStack[i];

        while (currentBlockId) {
          const block = blocks.getBlock(currentBlockId);
          if (!block) break;

          // If the thread actively contains our specific custom loop block opcode
          if (block.opcode === 'scrtwpmrunpy_setclass') {
            // Safely fall back to the thread property we cached during the loop step execution
            if (util.thread.lastClassName !== undefined) {
              classs =  util.thread.lastClassName;
            }

            // Fallback: directly parse the static input text if the thread hasn't cached it yet
            if (block.inputs && block.inputs.COUNT) {
              const inputBlockId = block.inputs.COUNT.block;
              const rawValue = util.runtime.getScriptRuntimePosition(target, inputBlockId);
              classs =  rawValue;
            }
          }

          // Traverse upwards to see if it's nested inside secondary loops or conditionals
          currentBlockId = block.parent;
        }
      }

    //   return 'Not inside a custom loop!';


} catch (error) {
}
    
    if(yes){
          console.log("classs", classs)
          this.setTempVar(args, util, `class${classs}${args.VAR}`, args.VALUE)
          
    } else {throw new Error("Class vars must be set inside of a Class: loop")}
    } else {throw new Error("Block must be under the When Python Code Starts event")}}



    setclasslist(args, util){if(this.check(args, util)){
    let yes
    let loopBlock
    let classs
        try{
         loopBlock = this._getParentLoopBlock(util);

      if (loopBlock.opcode === "scrtwpmrunpy_setclass" || loopBlock.opcode === "scrtwpmrunpy_deffuncclass") {
        yes = true
      } else {
        yes = false
      }
      console.log("yes", yes)

      // Check the execution thread history array to verify the active block trail
      const blockStack = util.thread.stack;
      const target = util.target;
      const blocks = target.blocks;

      for (let i = 0; i < blockStack.length; i++) {
        let currentBlockId = blockStack[i];

        while (currentBlockId) {
          const block = blocks.getBlock(currentBlockId);
          if (!block) break;

          // If the thread actively contains our specific custom loop block opcode
          if (block.opcode === 'scrtwpmrunpy_setclass') {
            // Safely fall back to the thread property we cached during the loop step execution
            if (util.thread.lastClassName !== undefined) {
              classs =  util.thread.lastClassName;
            }

            // Fallback: directly parse the static input text if the thread hasn't cached it yet
            if (block.inputs && block.inputs.COUNT) {
              const inputBlockId = block.inputs.COUNT.block;
              const rawValue = util.runtime.getScriptRuntimePosition(target, inputBlockId);
              classs =  rawValue;
            }
          }

          // Traverse upwards to see if it's nested inside secondary loops or conditionals
          currentBlockId = block.parent;
        }
      }

    //   return 'Not inside a custom loop!';


} catch (error) {
}
    
    if(yes){
        
    const prefix = "ARG";
      let string = "[";
      for (let i = 0; prefix + i in args; i++) {
        string += '"'
        string += Scratch.Cast.toString(args[prefix + i]);
        string += '"'
        string += ","
      }
      string = string.slice(0, -1)
      string += "]"

          console.log("classs", classs)
          this.setTempVar(args, util, `class${classs}${args.NAME}`, string)
          
    } else {throw new Error("Class vars must be set inside of a Class: loop")}

    } else {throw new Error("Block must be under the When Python Code Starts event")}}



    instantiate(args, util){if(this.check(args, util)){
        // return(this.getTempVar(args, util, `class${args.CLASS}${args.ARGS}`))

    } else {throw new Error("Block must be under the When Python Code Starts event")}}

    getfromclass(args, util){if(this.check(args, util)){
        return(this.getTempVar(args, util, `class${args.CLASS}${args.VAR}`))
    } else {throw new Error("Block must be under the When Python Code Starts event")}}




    async runTimeOp(args, util) {if(this.check(args, util)){
      const op = args.OPERATION;
      const argInput = args.ARG.trim();

      // Helper to parse input into a numeric timestamp or default to current time
      const getTimestamp = (input) => {
        if (!input) return Date.now() / 1000;
        const num = Number(input);
        return isNaN(num) ? Date.now() / 1000 : num;
      };

      try {
        switch (op) {
          case 'time':
            // Returns current Unix timestamp in seconds
            return Date.now() / 1000;

          case 'ctime': {
            // Converts seconds since epoch into a readable string format
            const secs = getTimestamp(argInput);
            return new Date(secs * 1000).toString();
          }

          case 'sleep': {
            // Pauses the execution thread for X seconds
            const seconds = Number(argInput) || 0;
            await new Promise(resolve => setTimeout(resolve, seconds * 1000));
            return '';
          }

          case 'gmtime': {
            // Returns structured UTC time components as a JSON string matching Python struct_time
            const secs = getTimestamp(argInput);
            const d = new Date(secs * 1000);
            return JSON.stringify({
              tm_year: d.getUTCFullYear(),
              tm_mon: d.getUTCMonth() + 1,
              tm_mday: d.getUTCDate(),
              tm_hour: d.getUTCHours(),
              tm_min: d.getUTCMinutes(),
              tm_sec: d.getUTCSeconds(),
              tm_wday: (d.getUTCDay() + 6) % 7, // Python starts Monday (0) to Sunday (6)
              tm_yday: Math.floor((d - new Date(d.getUTCFullYear(), 0, 0)) / 86400000),
              tm_isdst: 0
            });
          }

          case 'localtime': {
            // Returns structured local time components as a JSON string matching Python struct_time
            const secs = getTimestamp(argInput);
            const d = new Date(secs * 1000);
            return JSON.stringify({
              tm_year: d.getFullYear(),
              tm_mon: d.getMonth() + 1,
              tm_mday: d.getDate(),
              tm_hour: d.getHours(),
              tm_min: d.getMinutes(),
              tm_sec: d.getSeconds(),
              tm_wday: (d.getDay() + 6) % 7,
              tm_yday: Math.floor((d - new Date(d.getFullYear(), 0, 0)) / 86400000),
              tm_isdst: -1
            });
          }

          case 'asctime': {
            // Formats a JSON struct_time string back into a uniform text timestamp
            try {
              const parsed = JSON.parse(argInput);
              const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
              const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
              
              const dayStr = days[parsed.tm_wday] || 'Mon';
              const monStr = months[parsed.tm_mon - 1] || 'Jan';
              const pad = (num) => String(num).padStart(2, '0');
              
              return `${dayStr} ${monStr} ${pad(parsed.tm_mday)} ${pad(parsed.tm_hour)}:${pad(parsed.tm_min)}:${pad(parsed.tm_sec)} ${parsed.tm_year}`;
            } catch (e) {
              return new Date().toString(); // Fallback if input object is invalid
            }
          }

          default:
            return 'Unknown operation';
        }
      } catch (err) {
        return `Error: ${err.message}`;
      }
    

    } else {throw new Error("Block must be under the When Python Code Starts event")}}



    templatefunc(args, util){if(this.check(args, util)){

    } else {throw new Error("Block must be under the When Python Code Starts event")}}


    






























    
    getCurrentMutation(args, util) {
      // In the interpreter, args.mutation exists (thanks FurryR for notifying me about this, yes that's their username),
      // and in the compiler, util.thread.peekStack() works for reporters
      return (
        args.mutation ||
        util.target.blocks.getBlock(util.thread.peekStack())?.mutation ||
        Scratch.vm.runtime.flyoutBlocks.getBlock(util.thread.peekStack())
          ?.mutation
      );
    }


    }


  // Based on https://github.com/Xeltalliv/extensions/blob/examples/examples/extension-colors.js
  // Add `mutator`
//   const runtime = Scratch.vm.runtime;
  // @ts-ignore
  const cbfsb = runtime._convertBlockForScratchBlocks.bind(runtime);
  // @ts-ignore
  runtime._convertBlockForScratchBlocks = function (blockInfo, categoryInfo) {
    const res = cbfsb(blockInfo, categoryInfo);
    if (blockInfo.mutator) {
      res.json.mutator = blockInfo.mutator;
    }
    return res;
  };

  function patchSB() {
    // @ts-ignore
    const ScratchBlocks = window?.ScratchBlocks;
    if (!ScratchBlocks) return;

    Scratch.vm.removeListener("EXTENSION_ADDED", patchSB);
    Scratch.vm.removeListener("BLOCKSINFO_UPDATE", patchSB);

    const leftArrowIcon = 
    `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNDIuMTUzODUiIGhlaWdodD0iMTQwIiB2aWV3Qm94PSIwLDAsMTQyLjE1Mzg1LDE0MCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE2OC45MjMwNywtMTEwKSI+PGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTE2OC45MjMwOCwyNTB2LTE0MGgxNDIuMTUzODV2MTQweiIgZmlsbC1vcGFjaXR5PSIwLjAxNTY5IiBmaWxsPSIjZmZmZmZmIi8+PHBhdGggZD0iTTE5Mi42NTUyOSwxOTZjLTkuMzg4ODQsMCAtMTcsLTcuMTYzNDQgLTE3LC0xNmMwLC04LjgzNjU2IDcuNjExMTYsLTE2IDE3LC0xNmg5NC42ODk0NmM5LjM4ODg0LDAgMTcsNy4xNjM0NCAxNywxNmMwLDguODM2NTYgLTcuNjExMTYsMTYgLTE3LDE2eiIgZmlsbD0iI2ZmZmZmZiIvPjwvZz48L2c+PC9zdmc+`
    const rightArrowIcon = 
    `data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNjgiIGhlaWdodD0iMTU2IiB2aWV3Qm94PSIwLDAsMTY4LDE1NiI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE1NiwtMTAyKSI+PGcgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTE5Mi42NTUyNywxOTZjLTkuMzg4ODQsMCAtMTcsLTcuMTYzNDQgLTE3LC0xNnYwYzAsLTguODM2NTYgNy42MTExNiwtMTYgMTcsLTE2aDk0LjY4OTQ2YzkuMzg4ODQsMCAxNyw3LjE2MzQ0IDE3LDE2djBjMCw4LjgzNjU2IC03LjYxMTE2LDE2IC0xNywxNnoiIGZpbGw9IiNmZmZmZmYiLz48cGF0aCBkPSJNMjQwLDI0NC4zNTEyN2MtOS42OTA4NiwwIC0xNy41NDY4NiwtOC4yODI3MyAtMTcuNTQ2ODYsLTE4LjV2LTkxLjcwMjU0YzAsLTEwLjIxNzI3IDcuODU2LC0xOC41IDE3LjU0Njg2LC0xOC41djBjOS42OTA4NiwwIDE3LjU0Njg2LDguMjgyNzMgMTcuNTQ2ODYsMTguNXY5MS43MDI1NGMwLDEwLjIxNzI3IC03Ljg1NiwxOC41IC0xNy41NDY4NiwxOC41eiIgZmlsbD0iI2ZmZmZmZiIvPjxwYXRoIGQ9Ik0xNTYsMjU4di0xNTZoMTY4djE1NnoiIGZpbGwtb3BhY2l0eT0iMC4wMTU2OSIgZmlsbD0iI2ZmZmZmZiIvPjwvZz48L2c+PC9zdmc+`
    const arrowWidth = 16;
    const arrowHeight = 32;

    class FieldImageButton extends ScratchBlocks.FieldImage {
      constructor(src, width, height, callback, opt_alt, flip_rtl, noPadding) {
        super(src, width, height, opt_alt, flip_rtl);
        this._callback = callback.bind(this);
        this.noPadding = noPadding;
      }
      init() {
        if (this.fieldGroup_) {
          // Image has already been initialized once.
          return;
        }
        super.init();
        this.mouseDownWrapper_ = ScratchBlocks.bindEventWithChecks_(
          this.getSvgRoot(),
          "mousedown",
          this,
          this.onMouseDown_
        );
        this.getSvgRoot().style.cursor = "pointer";
      }
      showEditor_() {
        if (this._callback) {
          this._callback();
        }
      }
      getSize() {
        if (!this.size_.width) {
          this.render_();
        }
        if (!this.noPadding) return this.size_;
        return new this.size_.constructor(
          Math.max(1, this.size_.width - ScratchBlocks.BlockSvg.SEP_SPACE_X),
          this.size_.height
        );
      }
      EDITABLE = true;
    }

    // heavily based on scratch-blocks' procedures code
    // https://github.com/TurboWarp/scratch-blocks
    ScratchBlocks.Extensions.registerMutator(
      "scrtwpmrunpyextender",
      {
        domToMutation(xmlElement) {
          this.inputCount = Math.floor(
            Number(xmlElement.getAttribute("inputcount"))
          );
          this.inputCount = Math.min(
            Math.max(this.minInputs, this.inputCount),
            this.maxInputs
          );
          if (isNaN(this.inputCount) || !Number.isFinite(this.inputCount))
            this.inputCount = this.minInputs;
          this.prevInputCount = this.inputCount;

           this.branchCount = 1 + this.inputCount + (this.extendableDefsEnd.length > 0 ? 1 : 0);
          // HACK: fixes alt+drag duplicate not adding blocks inside
          this.updateDisplay_(true);
        },
        mutationToDom() {
          const container = document.createElement("mutation");
          container.setAttribute("inputcount", this.inputCount.toString());
          return container;
        },

        isExtendableInput(input) {
          return (
            input.name.startsWith("ARROW_") ||
            this.extendableDefs.some((def) => input.name.startsWith(def.id)) ||
            this.extendableDefsStart.some((def) =>
              input.name.startsWith(def.id)
            ) ||
            this.extendableDefsEnd.some((def) => input.name.startsWith(def.id))
          );
        },

        // Disconnects all blocks in extendable inputs and returns them.
        disconnectOldBlocks_() {
          const connectionMap = {};
          const hasEndBlocks = this.extendableDefsEnd.length > 0;
          const hasStartBlocks = this.extendableDefsStart.length > 0;
          const prevEndIndex =
            this.prevInputCount + (this.extendableDefsStart.length > 0);

          // Reattach end blocks when inputs are added/removed
          const reattachMap = Object.create(null);
          if (hasEndBlocks) {
            for (const def of this.extendableDefsEnd) {
              const input = this.getInput(
                this.getExtendableInput(def.id, prevEndIndex)
              );
              if (input && input.connection) {
                reattachMap[input.name] = def.id;
              }
            }
          }

          for (const input of this.inputList) {
            if (input.connection && this.isExtendableInput(input)) {
              const target = input.connection.targetBlock();
              const saveInfo = {
                shadow: input.connection.getShadowDom(),
                block: target,
              };

              let name = input.name;
              if (reattachMap[name]) {
                name = this.getExtendableInput(
                  reattachMap[name],
                  this.inputCount + hasStartBlocks
                );
                if (connectionMap[name]) {
                  connectionMap["$UNUSED" + name] = connectionMap[name];
                  delete connectionMap[name];
                }
              }

              if (connectionMap[name]) {
                connectionMap["$UNUSED" + name] = saveInfo;
              } else {
                connectionMap[name] = saveInfo;
              }

              // Remove the shadow DOM, then disconnect the block.	Otherwise a shadow
              // block will respawn instantly, and we'd have to remove it when we remove
              // the input.
              input.connection.setShadowDom(null);
              if (target) {
                input.connection.disconnect();
              }
            }
          }
          return connectionMap;
        },

        removeAllInputs_() {
          this.inputList = this.inputList.filter((input) => {
            if (
              this.isExtendableInput(input) ||
              (input.type === ScratchBlocks.DUMMY_INPUT && this.clearLabels)
            ) {
              input.dispose();
              return false;
            }
            return true;
          });
        },

        // Creates a shadow input for an extendable definition.
        attachShadow_(input, def) {
          if (!def.shadowType) return;
          ScratchBlocks.Events.disable();
          let newBlock;
          try {
            newBlock = this.workspace.newBlock(def.shadowType);
            newBlock.setFieldValue(def.shadowDefault, def.shadowField);
            newBlock.setShadow(true);
            if (!this.isInsertionMarker()) {
              newBlock.initSvg();
              newBlock.render(false);
            }
          } finally {
            ScratchBlocks.Events.enable();
          }
          if (ScratchBlocks.Events.isEnabled()) {
            ScratchBlocks.Events.fire(
              new ScratchBlocks.Events.BlockCreate(newBlock)
            );
          }
          if (newBlock.outputConnection)
            newBlock.outputConnection.connect(input.connection);
          else newBlock.previousConnection.connect(input.connection);
        },
        buildShadowDom_(def) {
          const shadowDom = document.createElement("shadow");
          shadowDom.setAttribute("type", def.shadowType);
          const fieldDom = document.createElement("field", null);
          fieldDom.setAttribute("name", def.shadowField);
          shadowDom.appendChild(fieldDom);
          return shadowDom;
        },

        // Populates an argument.
        // Puts existing blocks back in or creates new ones.
        populateArgument_(connectionMap, id, input, def) {
          let oldBlock = null;
          let oldShadow = null;

          if (connectionMap && id in connectionMap) {
            const saveInfo = connectionMap[id];
            oldBlock = saveInfo["block"];
            oldShadow = saveInfo["shadow"];
          }

          if (connectionMap && oldBlock) {
            // Reattach the old block and shadow DOM.
            connectionMap[id] = null;
            if (oldBlock.outputConnection)
              oldBlock.outputConnection.connect(input.connection);
            else oldBlock.previousConnection.connect(input.connection);
            if (def.shadowType) {
              const shadowDom = oldShadow || this.buildShadowDom_(def);
              input.connection.setShadowDom(shadowDom);
            }
          } else {
            this.attachShadow_(input, def);
          }
        },

        // Removes unused inputs from the VM
        cleanInputs() {
          const target = Scratch.vm.editingTarget;
          if (!target) return;
          const blocks = this.isInFlyout
            ? Scratch.vm.runtime.flyoutBlocks
            : target.blocks;
          const vmBlock = blocks.getBlock(this.id);
          if (!vmBlock) return;

          const usedInputs = new Set(this.inputList.map((i) => i?.name));

          const inputs = vmBlock.inputs;
          for (const name of Object.keys(inputs)) {
            const input = inputs[name];
            if (!usedInputs.has(name)) {
              // @ts-ignore
              blocks.deleteBlock(input.block);
              // @ts-ignore
              blocks.deleteBlock(input.shadow);
              delete inputs[name];
            }
          }
        },

        // Gets an argument name for a prefix + index.
        getExtendableInput(prefix, index) {
          let id = prefix;
          // Special handling for substacks,
          // as their names matter for execution
          if (prefix === "SUBSTACK") {
            index += 1;
            if (index > 1) id += index;
          } else {
            id += index;
          }
          return id;
        },


        // The internal create input function.
        addInput_(def, i, connectionMap = null) {
          const id = this.getExtendableInput(def.id, i);
          const input = this.appendInput_(def.type, id);
          if (def.type === ScratchBlocks.DUMMY_INPUT) {
            input.appendField(def.check);
          } else {
            if (def.check) {
              input.setCheck(def.check);
            }
            this.populateArgument_(connectionMap, id, input, def);
          }
        },

        // The "user create input" function.
        insertInput() {
          ScratchBlocks.Events.setGroup(true);
          const oldMutation = ScratchBlocks.Xml.domToText(this.mutationToDom());
          this.inputCount++;
      this.branchCount = 1 + this.inputCount + (this.extendableDefsEnd.length > 0 ? 1 : 0)

          this.updateDisplay_();

          // i have no idea if this is the correct way or not
          const newMutation = ScratchBlocks.Xml.domToText(this.mutationToDom());
          const ev = new ScratchBlocks.Events.BlockChange(
            this,
            "mutation",
            null,
            oldMutation,
            newMutation
          );
          ScratchBlocks.Events.fire(ev);
          ScratchBlocks.Events.setGroup(false);
        },
        // The "user delete input" function.
        deleteInput() {
          ScratchBlocks.Events.setGroup(true);
          const oldMutation = ScratchBlocks.Xml.domToText(this.mutationToDom());
          this.inputCount--;

             this.branchCount = 1 + this.inputCount + (this.extendableDefsEnd.length > 0 ? 1 : 0);
          const plusInputs = this.extendableDefsStart.length > 0 ? 1 : 0;

          for (const def of this.extendableDefs) {
            this.removeInput(
              this.getExtendableInput(def.id, this.inputCount + plusInputs)
            );
          }
          this.updateDisplay_();

          const newMutation = ScratchBlocks.Xml.domToText(this.mutationToDom());
          const ev = new ScratchBlocks.Events.BlockChange(
            this,
            "mutation",
            null,
            oldMutation,
            newMutation
          );
          ScratchBlocks.Events.fire(ev);
          ScratchBlocks.Events.setGroup(false);

          this.cleanInputs();
        },

        createAllInputs_(connectionMap) {
          let index = 0;
          if (this.extendableDefsStart.length > 0) {
            for (const def of this.extendableDefsStart)
              this.addInput_(def, index, connectionMap);
            index++;
          }
          for (let i = 0; i < this.inputCount; i++) {
            for (const def of this.extendableDefs)
              this.addInput_(def, index, connectionMap);
            index++;
          }
          return index;
        },

        addArrowButtons_() {
          if (this.inputCount > this.minInputs) {
            const leftInput = this.appendDummyInput("ARROW_LEFT");
            const leftArrow = new FieldImageButton(
              leftArrowIcon,
              arrowWidth,
              arrowHeight,
              function () {
                this.sourceBlock_.deleteInput();
              },
              Scratch.translate({
                default: "Remove input",
                description:
                  "Alt text for the button that removes an input on blocks",
              }),
              true,
              this.inputCount < this.maxInputs
            );
            leftInput.appendField(leftArrow);
          }
          if (this.inputCount < this.maxInputs) {
            const rightInput = this.appendDummyInput("ARROW_RIGHT");
            const rightArrow = new FieldImageButton(
              rightArrowIcon,
              arrowWidth,
              arrowHeight,
              function () {
                this.sourceBlock_.insertInput();
              },
              Scratch.translate({
                default: "Add input",
                description:
                  "Alt text for the button that adds an input on blocks",
              }),
              true,
              false
            );
            rightInput.appendField(rightArrow);
          }
        },

        // Updates this block's inputs.
              updateDisplay_(force) {
          if (!this.isInsertionMarker() && !force && this.workspace?.currentGesture_?.isDraggingBlock_ && this.workspace?.currentGesture_?.targetBlock_.type === this.type)
            return;

          const wasRendered = this.rendered;
          if (this.isInFlyout) ScratchBlocks.Events.disable();

          this.rendered = false;
          this.extendableUpdatedDisplay = true;

          const connectionMap = this.disconnectOldBlocks_();
          this.removeAllInputs_();

          let index = this.createAllInputs_(connectionMap);
          this.addArrowButtons_();

          if (this.extendableDefsEnd) {
            for (const def of this.extendableDefsEnd) {
              this.addInput_(def, index, connectionMap);
            }
          }

          // ==========================================
          // CRITICAL FIX: FORCIBLY SYNC THE VM BLOCK DATA 
          // ==========================================
          if (!this.isInsertionMarker()) {
            const target = Scratch.vm.editingTarget;
            if (target) {
              // 1. Calculate actual branches: Base If (1) + User Added Slots (inputCount) + Fallback Else (1)
              const computedBranches = 1 + this.inputCount + (this.extendableDefsEnd.length > 0 ? 1 : 0);
              
              // 2. Fetch the block instance directly from the VM repository
              const blocksRepository = this.isInFlyout ? Scratch.vm.runtime.flyoutBlocks : target.blocks;
              const vmBlockInstance = blocksRepository.getBlock(this.id);
              
              if (vmBlockInstance) {
                // 3. Directly assign the updated branch bounds onto the block instance!
                vmBlockInstance.branchCount = computedBranches;
                
                // (Optional) Keep a record on the Blockly block state for security
                this.branchCount = computedBranches;
              }
            }
          }
          // ==========================================

          this.rendered = wasRendered;
          if (this.isInFlyout) ScratchBlocks.Events.enable();

          if (this.rendered && !this.isInsertionMarker()) {
            this.initSvg();
            this.render();
          }
        }
      },
      function () {
        // An array of extendable input definitions;
        // for each click of the right arrow button,
        // all of these inputs will be added
        this.extendableDefs = [];
        // Inputs to put before any extendable inputs.
        // If non-empty, also increases the maximum index by one
        this.extendableDefsStart = [];
        // Inputs to put after the extendable inputs (after the arrow buttons).
        // If non-empty, also increases the maximum index by one
        this.extendableDefsEnd = [];
        // The default number of inputs.
        this.inputCount = 2;
        // The minimum number of inputs.
        this.minInputs = 1;
        // The maximum number of inputs.
        this.maxInputs = Infinity;
        // If true, clears all blockInfo labels.
        this.clearLabels = false;

        // Internal.
        this.prevInputCount = this.inputCount;
      }
    );

    const createInput = (
      type, // ScratchBlocks.INPUT_VALUE, NEXT_STATEMENT or DUMMY_INPUT
      id, // The argument ID (a number will be appended to this)
      check = null, // null or "Boolean" (or the label text for DUMMY_INPUTs)
      shadowType = undefined, // The type of shadow block (or falsy for none)
      shadowField = undefined, // The field to use in the shadow block
      shadowDefault = undefined // The default shadow block value
    ) => ({ type, id, check, shadowType, shadowField, shadowDefault });

    // Configuration extensions
    ScratchBlocks.Extensions.register("scrtwpmrunpyextender_clear", function () {
      this.clearLabels = true;
    });
    
        ScratchBlocks.Extensions.register("scrtwpmrunpyextender_argsreporter", function () {
          this.extendableDefs = [
            createInput(ScratchBlocks.INPUT_VALUE, "ARG", null, "text", "TEXT", "args"),
            createInput(ScratchBlocks.DUMMY_INPUT, "WORD", ",")
          ];
    
            this.inputCount = 1;
          
        });
    ScratchBlocks.Extensions.register("scrtwpmrunpyextender_string", function () {
      this.extendableDefs = [
        createInput(ScratchBlocks.INPUT_VALUE, "ARG", null, "text", "TEXT", "item"),
        createInput(ScratchBlocks.DUMMY_INPUT, "WORD", ",")
      ];

        this.extendableDefsEnd = [
          createInput(ScratchBlocks.DUMMY_INPUT, "OLDWORD", "]")
        ]
        this.inputCount = 1;
      
    });
     ScratchBlocks.Extensions.register("scrtwpmrunpyextender_fstring", function () {
      this.extendableDefs = [
        createInput(ScratchBlocks.INPUT_VALUE, "ARG", null, "text", "TEXT", " 3.14"),
      ];

        this.inputCount = 1;
      
    });
    ScratchBlocks.Extensions.register("scrtwpmrunpyextender_class", function () {
      this.extendableDefs = [
        createInput(ScratchBlocks.INPUT_VALUE, "ARG", null, "text", "TEXT", "item"),
        createInput(ScratchBlocks.DUMMY_INPUT, "WORD", ",")
      ];

        this.extendableDefsEnd = [
          createInput(ScratchBlocks.DUMMY_INPUT, "OLDWORD", "] in class")
        ]
        this.inputCount = 1;
      
    });
    
    // HACK: fixes the flyout, also with dynamic enable/disable addons
    const ogInitSvg = ScratchBlocks.BlockSvg.prototype.initSvg;
    ScratchBlocks.BlockSvg.prototype.initSvg = function () {
      if (this.getExtendableInput && !this.extendableUpdatedDisplay) {
        this.updateDisplay_();
      }
      return ogInitSvg.call(this);
    };
  }

  // https://github.com/LilyMakesThings/extensions/blob/5b9ce572683e403933cab3b23c4a9bbb2a08ecf9/extensions/Lily/Dictionaries.js#L37C1-L45
  if (!("scaffolding" in window)) {
    Scratch.vm.on("EXTENSION_ADDED", patchSB);
    Scratch.vm.on("BLOCKSINFO_UPDATE", patchSB);
  }
    Scratch.extensions.register(new RunPython(Scratch.runtime));
  })(Scratch);


