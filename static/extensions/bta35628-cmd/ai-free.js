(function (Scratch) {
  'use strict';

  if (!Scratch.extensions.unsandboxed) {
    throw new Error('Tiện ích puterAI cần bật chế độ Unsandboxed để hoạt động!');
  }

  // Tải tự động thư viện Puter.js
  let scriptLoaded = false;
  const loadPuterScript = () => {
    return new Promise((resolve, reject) => {
      if (window.puter) return resolve();
      const script = document.createElement('script');
      script.src = 'https://js.puter.com/v2/';
      script.onload = () => {
        scriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error('Không thể kết nối với Puter.js'));
      document.head.appendChild(script);
    });
  };

  class PuterAIExtension {
    constructor() {
      loadPuterScript().catch(err => console.error(err));
    }

    getInfo() {
      return {
        id: 'bta35628cmdputerai',
        name: 'puterAI',
        color1: '#6a0eab',
        color2: '#520b85',
        blocks: [
          {
            opcode: 'askAI',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Send the question [PROMPT] to puterAI',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hi'
              }
            }
          },
          {
            opcode: 'askAIModel',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Ask [PROMPT] with the [MODEL] model',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'hi'
              },
              MODEL: {
                type: Scratch.ArgumentType.STRING,
                menu: 'models',
                defaultValue: 'gpt-4o-mini'
              }
            }
          }
        ],
        menus: {
          models: {
            acceptReporters: true,
            items: ['gpt-4o-mini', 'claude-3-5-sonnet', 'deepseek-chat']
          }
        }
      };
    }

    async askAI(args) {
      if (!window.puter) await loadPuterScript();
      try {
        const response = await window.puter.ai.chat(String(args.PROMPT));
        return response.toString();
      } catch (error) {
        return 'Lỗi: ' + error.message;
      }
    }

    async askAIModel(args) {
      if (!window.puter) await loadPuterScript();
      try {
        const response = await window.puter.ai.chat(String(args.PROMPT), { model: args.MODEL });
        return response.toString();
      } catch (error) {
        return 'Lỗi: ' + error.message;
      }
    }
  }

  Scratch.extensions.register(new PuterAIExtension());
})(Scratch);
