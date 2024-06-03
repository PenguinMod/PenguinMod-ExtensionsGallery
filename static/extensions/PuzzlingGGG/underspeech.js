class Underspeech {
  constructor() {
    this.dialogueContainer = this.createDialogueContainer();
    const canvas = document.getElementById('sulfurous') || document.querySelector('canvas');
    if (canvas && canvas.parentNode) {
      canvas.parentNode.insertBefore(this.dialogueContainer, canvas.nextSibling);
    }
    this.dialogueText = '';
    this.timeout = null;
}

    getInfo() {
        return {
            id: 'puzzlingunderspeech',
            name: 'Underspeech',
            blocks: [
                {
                    opcode: 'showDialogueFromJSON',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'say [JSON] by [SPEAKER] as [TYPE]',
                    arguments: {
                        JSON: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: '{"line": [{"text": "Hello, ", "style": {"font": "Arial", "size": "14px", "color": "black"}}]}'
                        },
                        SPEAKER: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: "Dango"
                        },
                        TYPE: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'typeMenu',
                            defaultValue: 'normal'
                        },
                    }
                },
                {
                    opcode: 'hideDialogue',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'hide dialogue'
                },
                '---','---','---',
                {
                    func: 'openDialogueEditor',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'Open Dialogue Editor'
                },
                {
                    func: 'showPopup',
                    blockType: Scratch.BlockType.BUTTON,
                    text: 'Show Examples'
                }
            ],
            menus: {
                typeMenu: {
                    acceptReporters: false,
                    items: ['normal', 'typewriter']
                }
            }
        };
    }

  createDialogueContainer() {
    let container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.bottom = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    container.style.color = 'white';
    container.style.textAlign = 'left';
    container.style.padding = '10px';
    container.style.boxSizing = 'border-box';
    container.style.zIndex = '100';
    container.style.fontFamily = '"Helvetica Neue", Helvetica, Arial, sans-serif';
    container.style.display = 'none';
    container.style.pointerEvents = 'none';
    return container;
  }

showDialogueFromJSON(args, util) {
  this.dialogueContainer.innerHTML = '';
  this.dialogueContainer.style.display = 'block';

  try {
    const dialogueData = JSON.parse(args.JSON);
    const speakerHTML = `<div style="font-size: 1.2em; margin-bottom: 0.5em;"><strong>${args.SPEAKER}:</strong></div>`;
    this.dialogueContainer.innerHTML = speakerHTML;

    const typePart = (part, callback) => {
      const span = document.createElement('span');
      span.style.fontFamily = `${part.style.font}, sans-serif`;
      span.style.fontSize = part.style.size;
      span.style.color = part.style.color;
      span.style.cssText += part.style.css || '';
      this.dialogueContainer.appendChild(span);

      if (args.TYPE === 'typewriter') {
        let charIndex = 0;
        const typeWriterInterval = setInterval(() => {
          if (charIndex < part.text.length) {
            span.textContent += part.text[charIndex];
            charIndex++;
          } else {
            clearInterval(typeWriterInterval);
            callback();
          }
        }, 50);
      } else {
        span.textContent = part.text;
        callback();
      }
    };

    const parts = dialogueData.line;
    let currentPartIndex = 0;

    const typeNextPart = () => {
      if (currentPartIndex < parts.length) {
        typePart(parts[currentPartIndex], () => {
          currentPartIndex++;
          typeNextPart();
        });
      }
    };

    typeNextPart();

  } catch (error) {
    console.error('Invalid JSON:', error);
    this.dialogueContainer.innerHTML += `<div style="color: red;"><strong>Invalid JSON:</strong> ${error}</div>`;
  }
}

  hideDialogue() {
    if (this.dialogueContainer) {
      this.dialogueContainer.style.display = 'none';
    }
  }

  openDialogueEditor() {
    Scratch.openWindow("https://puzzlingggg.github.io/gen");
  }

showPopup() {
  var backdrop = document.createElement('div');
  backdrop.style.position = 'fixed';
  backdrop.style.top = '0';
  backdrop.style.left = '0';
  backdrop.style.width = '100%';
  backdrop.style.height = '100%';
  backdrop.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
  backdrop.style.backdropFilter = 'blur(5px)';
  backdrop.style.display = 'flex';
  backdrop.style.justifyContent = 'center';
  backdrop.style.alignItems = 'center';
  backdrop.style.zIndex = '9999';

  var popup = document.createElement('div');
  popup.style.background = 'white';
  popup.style.padding = '20px';
  popup.style.borderRadius = '8px';
  popup.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
  popup.style.width = '80%';
  popup.style.maxWidth = '600px';
  popup.style.zIndex = '10000';
  popup.innerHTML = `
    <h2 style="color: black;">Examples, plug this in:</h2>
    <pre style="color: black;">#1: {"line":[{"text":"I","style":{"font":"Impact","size":"24px","color":"#00A1D6","css":"text-shadow: 2px 2px #888;"}},{"text":" ","style":{"font":"Arial","size":"24px","color":"transparent"}},{"text":"am","style":{"font":"Verdana","size":"20px","color":"#E67E22","css":"text-transform: uppercase;"}},{"text":" ","style":{"font":"Arial","size":"20px","color":"transparent"}},{"text":"the","style":{"font":"Georgia","size":"22px","color":"#2ECC71","css":"font-style: italic;"}},{"text":" ","style":{"font":"Arial","size":"22px","color":"transparent"}},{"text":"d","style":{"font":"Helvetica","size":"26px","color":"#fcb1e3","css":"letter-spacing: 3px;"}},{"text":"a","style":{"font":"Times New Roman","size":"26px","color":"#ffd983","css":"letter-spacing: 3px;"}},{"text":"n","style":{"font":"Courier New","size":"26px","color":"#a6d388","css":"letter-spacing: 3px;"}},{"text":"g","style":{"font":"Tahoma","size":"26px","color":"#fcb1e3","css":"letter-spacing: 3px;"}},{"text":"o","style":{"font":"Comic Sans MS","size":"26px","color":"#ffd983","css":"letter-spacing: 3px;"}},{"text":"!","style":{"font":"Futura","size":"28px","color":"#3498DB","css":"font-weight: bold;"}}]}</pre>
    <pre style="color: black;">#2: {"line":[{"text":"Never","style":{"font":"Rockwell","size":"22px","color":"#FF5733","css":"text-shadow: 2px 2px #888;"}},{"text":" ","style":{"font":"Arial","size":"22px","color":"transparent"}},{"text":"Gonna","style":{"font":"Calibri","size":"20px","color":"#1E8449","css":"text-transform: uppercase;"}},{"text":" ","style":{"font":"Arial","size":"20px","color":"transparent"}},{"text":"Give","style":{"font":"Verdana","size":"22px","color":"#5D6D7E","css":"font-style: italic;"}},{"text":" ","style":{"font":"Arial","size":"22px","color":"transparent"}},{"text":"You","style":{"font":"Times New Roman","size":"24px","color":"#884EA0","css":"letter-spacing: 3px;"}},{"text":" ","style":{"font":"Arial","size":"24px","color":"transparent"}},{"text":"Up","style":{"font":"Courier New","size":"26px","color":"#F4D03F","css":"letter-spacing: 3px;"}},{"text":"!","style":{"font":"Comic Sans MS","size":"28px","color":"#2980B9","css":"font-weight: bold;"}}]}</pre>
    <pre style="color: black;">#3: {"line":[{"text":"Hello","style":{"font":"Arial Black","size":"28px","color":"#E74C3C","css":"text-shadow: 3px 3px #888;"}},{"text":",","style":{"font":"Arial","size":"28px","color":"#E74C3C","css":""}},{"text":" ","style":{"font":"Arial","size":"28px","color":"transparent"}},{"text":"W","style":{"font":"Georgia","size":"30px","color":"#3498DB","css":"letter-spacing: 2px;"}},{"text":"o","style":{"font":"Tahoma","size":"30px","color":"#2ECC71","css":"letter-spacing: 2px;"}},{"text":"r","style":{"font":"Verdana","size":"30px","color":"#F39C12","css":"letter-spacing: 2px;"}},{"text":"l","style":{"font":"Comic Sans MS","size":"30px","color":"#9B59B6","css":"letter-spacing: 2px;"}},{"text":"d","style":{"font":"Courier New","size":"30px","color":"#34495E","css":"letter-spacing: 2px;"}},{"text":"!","style":{"font":"Impact","size":"32px","color":"#E74C3C","css":"font-weight: bold;"}}]}</pre>
  `;

  var closeButton = document.createElement('span');
  closeButton.innerHTML = 'Close';
  closeButton.style.float = 'right';
  closeButton.style.cursor = 'pointer';
  closeButton.style.fontSize = '16px';
  closeButton.style.background = 'red';
  closeButton.style.color = 'white';
  closeButton.style.padding = '5px 10px';
  closeButton.style.borderRadius = '5px';
  closeButton.onclick = function() { closePopup(); };
  popup.appendChild(closeButton);
  backdrop.appendChild(popup);
  document.body.appendChild(backdrop);

  window.closePopup = function() {
    document.body.removeChild(backdrop);
  }
}

}

Scratch.extensions.register(new Underspeech());

