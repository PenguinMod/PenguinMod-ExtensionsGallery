// MIT License
// Copyright (c) 2025 AskingAcake
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the “Software”), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all 
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL 
// THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
// SOFTWARE.

// Made by AskingAcake

(function (Scratch) {
  'use strict';

  const agents = {};

  class MindAgent {
    constructor(name) {
      this.name = name;
      this.memory = {};
      this.rules = [];
      this.lastResult = "idle";
    }

    think() {
      const matchingRules = [];

      for (const rule of this.rules) {
        try {
          const val = this.memory[rule.key];
          const condVal = SimpleBrain._parse(rule.value);
          let pass = false;

          switch (rule.op) {
            case '=': pass = val == condVal; break;
            case '>': pass = Number(val) > Number(condVal); break;
            case '<': pass = Number(val) < Number(condVal); break;
            case 'includes':
              pass = Array.isArray(val) && val.includes(condVal);
              break;
          }

          if (pass) {
            for (let i = 0; i < rule.weight; i++) {
              matchingRules.push(rule.result);
            }
          }

        } catch {}
      }

      if (matchingRules.length === 0) {
        this.lastResult = "idle";
        return "idle";
      }

      const choice = matchingRules[Math.floor(Math.random() * matchingRules.length)];
      this.lastResult = choice;
      return choice;
    }

    learn(result) {
      for (const [key, value] of Object.entries(this.memory)) {
        const op = typeof value === 'number' ? '>' : '=';
        this.rules.push({
          key: key,
          op: op,
          value: value,
          result: result,
          weight: 1
        });
      }
    }
  }

  class SimpleBrain {
    getInfo() {
      return {
        id: 'askingacakesimplebrain',
        name: 'Simple Brain',
        color1: '#4B0082',
        blocks: [
          {
            opcode: 'createAgent',
            blockType: Scratch.BlockType.COMMAND,
            text: 'create Simple Brain AI named [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' }
            }
          },
          {
            opcode: 'setMemory',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set memory [KEY] of [NAME] to [VALUE]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'mood' },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'happy' }
            }
          },
          {
            opcode: 'getMemory',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get memory [KEY] of [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'mood' }
            }
          },
          {
            opcode: 'hasMemory',
            blockType: Scratch.BlockType.BOOLEAN,
            text: 'has memory [KEY] in [NAME]?',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'mood' }
            }
          },
          {
            opcode: 'addRule',
            blockType: Scratch.BlockType.COMMAND,
            text: 'add rule to [NAME]: if memory [KEY] [OPERATOR] [VALUE] then [RESULT] with weight [WEIGHT]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
              KEY: { type: Scratch.ArgumentType.STRING, defaultValue: 'mood' },
              OPERATOR: {
                type: Scratch.ArgumentType.STRING,
                menu: 'operators',
                defaultValue: '='
              },
              VALUE: { type: Scratch.ArgumentType.STRING, defaultValue: 'happy' },
              RESULT: { type: Scratch.ArgumentType.STRING, defaultValue: 'dance' },
              WEIGHT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 }
            }
          },
          {
            opcode: 'clearRules',
            blockType: Scratch.BlockType.COMMAND,
            text: 'clear rules of [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' }
            }
          },
          {
            opcode: 'runLogic',
            blockType: Scratch.BlockType.REPORTER,
            text: 'run logic on [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' }
            }
          },
          {
            opcode: 'getLastResult',
            blockType: Scratch.BlockType.REPORTER,
            text: 'get last result of [NAME]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' }
            }
          },
          {
            opcode: 'learnRule',
            blockType: Scratch.BlockType.COMMAND,
            text: 'learn rule for [NAME] from memory and result [RESULT]',
            arguments: {
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: 'Bot1' },
              RESULT: { type: Scratch.ArgumentType.STRING, defaultValue: 'cry' }
            }
          }
        ],
        menus: {
          operators: {
            acceptReporters: false,
            items: ['=', '>', '<', 'includes']
          }
        }
      };
    }

    createAgent(args) {
      agents[args.NAME] = new MindAgent(args.NAME);
    }

    setMemory(args) {
      const agent = agents[args.NAME];
      if (!agent) return;
      agent.memory[args.KEY] = SimpleBrain._parse(args.VALUE);
    }

    getMemory(args) {
      const agent = agents[args.NAME];
      if (!agent) return 'ERROR';
      return agent.memory[args.KEY] ?? 'undefined';
    }

    hasMemory(args) {
      const agent = agents[args.NAME];
      if (!agent) return false;
      return Object.hasOwn(agent.memory, args.KEY);
    }

    addRule(args) {
      const agent = agents[args.NAME];
      if (!agent) return;

      agent.rules.push({
        key: args.KEY,
        op: args.OPERATOR,
        value: args.VALUE,
        result: args.RESULT,
        weight: Number(args.WEIGHT)
      });
    }

    clearRules(args) {
      const agent = agents[args.NAME];
      if (!agent) return;
      agent.rules = [];
    }

    runLogic(args) {
      const agent = agents[args.NAME];
      if (!agent) return "ERROR";
      return agent.think();
    }

    getLastResult(args) {
      const agent = agents[args.NAME];
      if (!agent) return "ERROR";
      return agent.lastResult;
    }

    learnRule(args) {
      const agent = agents[args.NAME];
      if (!agent) return;
      agent.learn(args.RESULT);
    }

    static _parse(v) {
      try {
        const n = Number(v);
        return isNaN(n) ? v : n;
      } catch {
        return v;
      }
    }
  }

  Scratch.extensions.register(new SimpleBrain());
})(Scratch);
