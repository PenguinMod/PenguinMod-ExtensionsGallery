(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This extension must be loaded unsandboxed!');
    }

    class StageMobileKeyboard {
        constructor() {
            this.currentInput = '';
            this.isCaps = false;
            this.mode = 'abc';
            this.container = null;
            this.inputElement = null;
            this.keysContainer = null;
            this.aiTriggered = false;
            
            this.layouts = {
                abc: [
                    ['q','w','e','r','t','y','u','i','o','p'],
                    ['a','s','d','f','g','h','j','k','l'],
                    ['SHIFT','z','x','c','v','b','n','m','BACK'],
                    ['123','ACCENT','SPACE','AI','DONE']
                ],
                num: [
                    ['1','2','3','4','5','6','7','8','9','0'],
                    ['-','/',':',';','(',')','$','&','@','"'],
                    ['.','',',','?','!','\'','BACK'],
                    ['ABC','ACCENT','SPACE','AI','DONE']
                ],
                accent: [
                    ['á','é','í','ó','ú','ñ','ä','ö','ü','ß'],
                    ['à','è','ì','ò','ù','â','ê','î','ô','û'],
                    ['SHIFT','ç','ã','õ','æ','œ','¿','¡','BACK'],
                    ['ABC','123','SPACE','AI','DONE']
                ]
            };

            this.createUI();
        }

        getInfo() {
            return {
                id: 'stageMobileKeyboard',
                name: 'Stage Keyboard',
                author: 'Reos',
                color1: '#1C1C1E',
                color2: '#2C2C2E',
                blocks: [
                    {
                        opcode: 'openKeyboard',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'open stage keyboard with text [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: ''
                            }
                        }
                    },
                    {
                        opcode: 'closeKeyboard',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'close stage keyboard'
                    },
                    {
                        opcode: 'getTypedText',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'stage keyboard text'
                    },
                    {
                        opcode: 'isKeyboardOpen',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'is stage keyboard open?'
                    },
                    {
                        opcode: 'whenAiPressed',
                        blockType: Scratch.BlockType.HAT,
                        text: 'when AI button pressed',
                        isEdgeActivated: false
                    },
                    {
                        opcode: 'setKeyboardText',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'set stage keyboard text to [TEXT]',
                        arguments: {
                            TEXT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'AI Response'
                            }
                        }
                    }
                ]
            };
        }

        createUI() {
            this.container = document.createElement('div');
            Object.assign(this.container.style, {
                position: 'absolute',
                bottom: '0',
                left: '0',
                width: '100%',
                backgroundColor: 'rgba(28, 28, 30, 0.95)',
                backdropFilter: 'blur(10px)',
                borderTopLeftRadius: '12px',
                borderTopRightRadius: '12px',
                padding: '8px 6px 12px 6px',
                boxShadow: '0 -4px 15px rgba(0,0,0,0.4)',
                zIndex: '999999',
                display: 'none',
                flexDirection: 'column',
                gap: '6px',
                fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
                userSelect: 'none',
                boxSizing: 'border-box'
            });

            this.inputElement = document.createElement('input');
            this.inputElement.type = 'text';
            this.inputElement.setAttribute('inputmode', 'none');
            this.inputElement.readOnly = true;

            Object.assign(this.inputElement.style, {
                backgroundColor: '#2c2c2e',
                color: '#ffffff',
                fontSize: '14px',
                padding: '6px 10px',
                borderRadius: '6px',
                minHeight: '20px',
                border: '1px solid #3a3a3c',
                outline: 'none',
                width: '100%',
                boxSizing: 'border-box'
            });

            this.container.appendChild(this.inputElement);

            this.keysContainer = document.createElement('div');
            Object.assign(this.keysContainer.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
            });
            this.container.appendChild(this.keysContainer);

            this.attachOverlay();
            this.renderKeys();
        }

        attachOverlay() {
            try {
                if (Scratch.vm && Scratch.vm.renderer && typeof Scratch.vm.renderer.addOverlay === 'function') {
                    Scratch.vm.renderer.addOverlay(this.container, 'scale');
                    return;
                }
            } catch (e) {
                console.warn('Could not attach via vm.renderer:', e);
            }

            const canvas = document.querySelector('canvas');
            if (canvas && canvas.parentElement) {
                canvas.parentElement.appendChild(this.container);
            } else {
                document.body.appendChild(this.container);
            }
        }

        renderKeys() {
            this.keysContainer.innerHTML = '';
            const currentLayout = this.layouts[this.mode];

            currentLayout.forEach(row => {
                const rowDiv = document.createElement('div');
                Object.assign(rowDiv.style, {
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '4px',
                    width: '100%'
                });

                row.forEach(key => {
                    if (key === '') return;

                    const btn = document.createElement('button');
                    btn.onmousedown = (e) => e.preventDefault();

                    let displayText = key;
                    if ((this.mode === 'abc' || this.mode === 'accent') && key.length === 1) {
                        displayText = this.isCaps ? key.toUpperCase() : key.toLowerCase();
                    }

                    switch (key) {
                        case 'SHIFT': displayText = '⇧'; break;
                        case 'BACK': displayText = '⌫'; break;
                        case 'DONE': displayText = 'return'; break;
                        case 'SPACE': displayText = 'space'; break;
                        case 'ACCENT': displayText = 'áéí'; break;
                        case 'AI': displayText = '🤖 AI'; break;
                    }

                    btn.innerText = displayText;

                    Object.assign(btn.style, {
                        flex: key === 'SPACE' ? '3.5' : (key === 'DONE' || key === '123' || key === 'ABC' || key === 'AI') ? '1.4' : '1',
                        height: '36px',
                        fontSize: key.length === 1 ? '15px' : (key === 'SHIFT' || key === 'BACK') ? '18px' : '11px',
                        fontWeight: '600',
                        border: 'none',
                        borderRadius: '5px',
                        backgroundColor: '#636366',
                        color: '#ffffff',
                        cursor: 'pointer',
                        padding: '0',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    });

                    if (key === 'DONE') {
                        btn.style.backgroundColor = '#0a84ff';
                    } else if (key === 'AI') {
                        btn.style.backgroundColor = '#5e5ce6';
                    } else if (key === 'SHIFT' || key === 'BACK' || key === '123' || key === 'ABC' || key === 'ACCENT') {
                        btn.style.backgroundColor = '#48484a';
                    }

                    if (key === 'SHIFT' && this.isCaps) {
                        btn.style.backgroundColor = '#ffffff';
                        btn.style.color = '#000000';
                    }

                    btn.onclick = () => this.handleKeyPress(key);

                    rowDiv.appendChild(btn);
                });

                this.keysContainer.appendChild(rowDiv);
            });
        }

        handleKeyPress(key) {
            switch (key) {
                case 'BACK':
                    this.currentInput = this.currentInput.slice(0, -1);
                    break;
                case 'SPACE':
                    this.currentInput += ' ';
                    break;
                case 'SHIFT':
                    this.isCaps = !this.isCaps;
                    this.renderKeys();
                    break;
                case '123':
                    this.mode = 'num';
                    this.renderKeys();
                    break;
                case 'ABC':
                    this.mode = 'abc';
                    this.renderKeys();
                    break;
                case 'ACCENT':
                    this.mode = 'accent';
                    this.renderKeys();
                    break;
                case 'DONE':
                    this.closeKeyboard();
                    break;
                case 'AI':
                    this.aiTriggered = true;
                    if (Scratch.vm && Scratch.vm.runtime) {
                        Scratch.vm.runtime.startHats('stageMobileKeyboard_whenAiPressed');
                    }
                    setTimeout(() => { this.aiTriggered = false; }, 100);
                    break;
                default:
                    const char = this.isCaps ? key.toUpperCase() : key.toLowerCase();
                    this.currentInput += char;
                    break;
            }

            this.updateDisplay();
        }

        updateDisplay() {
            if (this.inputElement) {
                this.inputElement.value = this.currentInput;
            }
        }

        openKeyboard(args) {
            this.attachOverlay();
            this.currentInput = String(args.TEXT || '');
            this.mode = 'abc';
            this.isCaps = false;
            this.updateDisplay();
            this.renderKeys();
            if (this.container) {
                this.container.style.display = 'flex';
            }
        }

        closeKeyboard() {
            if (this.container) {
                this.container.style.display = 'none';
            }
        }

        getTypedText() {
            return this.currentInput;
        }

        setKeyboardText(args) {
            this.currentInput = String(args.TEXT || '');
            this.updateDisplay();
        }

        isKeyboardOpen() {
            return this.container ? this.container.style.display !== 'none' : false;
        }

        whenAiPressed() {
            return this.aiTriggered;
        }
    }

    Scratch.extensions.register(new StageMobileKeyboard());
})(Scratch);
                          
