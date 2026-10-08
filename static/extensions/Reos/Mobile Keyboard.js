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
            this.displayElement = null;
            this.keysContainer = null;
            
            this.layouts = {
                abc: [
                    ['q','w','e','r','t','y','u','i','o','p'],
                    ['a','s','d','f','g','h','j','k','l'],
                    ['SHIFT','z','x','c','v','b','n','m','BACK'],
                    ['123','SPACE','DONE']
                ],
                num: [
                    ['1','2','3','4','5','6','7','8','9','0'],
                    ['-','/',':',';','(',')','$','&','@','"'],
                    ['.','',',','?','!','\'','BACK'],
                    ['ABC','SPACE','DONE']
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
                    }
                ]
            };
        }

        findStageElement() {
            const canvas = document.querySelector('canvas');
            if (canvas && canvas.parentElement) {
                const parent = canvas.parentElement;
                if (getComputedStyle(parent).position === 'static') {
                    parent.style.position = 'relative';
                }
                return parent;
            }
            return document.body;
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

            this.displayElement = document.createElement('div');
            Object.assign(this.displayElement.style, {
                backgroundColor: '#2c2c2e',
                color: '#ffffff',
                fontSize: '14px',
                padding: '6px 10px',
                borderRadius: '6px',
                minHeight: '18px',
                wordBreak: 'break-all',
                display: 'flex',
                alignItems: 'center',
                border: '1px solid #3a3a3c'
            });
            this.container.appendChild(this.displayElement);

            this.keysContainer = document.createElement('div');
            Object.assign(this.keysContainer.style, {
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
            });
            this.container.appendChild(this.keysContainer);

            const targetParent = this.findStageElement();
            targetParent.appendChild(this.container);

            this.renderKeys();
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
                    let displayText = key;
                    
                    if (this.mode === 'abc' && key.length === 1) {
                        displayText = this.isCaps ? key.toUpperCase() : key.toLowerCase();
                    }

                    if (key === 'SHIFT') displayText = '⇪';
                    if (key === 'BACK') displayText = '⌫';
                    if (key === 'DONE') displayText = 'return';
                    if (key === 'SPACE') displayText = 'space';

                    btn.innerText = displayText;

                    Object.assign(btn.style, {
                        flex: key === 'SPACE' ? '4' : (key === 'DONE' || key === '123' || key === 'ABC') ? '1.5' : '1',
                        height: '32px',
                        fontSize: key.length === 1 ? '13px' : '10px',
                        fontWeight: '500',
                        border: 'none',
                        borderRadius: '4px',
                        backgroundColor: '#636366',
                        color: '#ffffff',
                        cursor: 'pointer',
                        padding: '0',
                        boxShadow: '0 1px 0 rgba(0,0,0,0.3)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    });

                    if (key === 'DONE') {
                        btn.style.backgroundColor = '#0a84ff';
                        btn.style.fontWeight = '600';
                    } else if (key === 'SHIFT' || key === 'BACK' || key === '123' || key === 'ABC') {
                        btn.style.backgroundColor = '#48484a';
                    }

                    if (key === 'SHIFT' && this.isCaps) {
                        btn.style.backgroundColor = '#ffffff';
                        btn.style.color = '#000000';
                    }

                    btn.onmousedown = () => btn.style.transform = 'scale(0.95)';
                    btn.onmouseup = () => btn.style.transform = 'scale(1)';
                    btn.onclick = () => this.handleKeyPress(key);

                    rowDiv.appendChild(btn);
                });

                this.keysContainer.appendChild(rowDiv);
            });
        }

        handleKeyPress(key) {
            if (key === 'BACK') {
                this.currentInput = this.currentInput.slice(0, -1);
            } else if (key === 'SPACE') {
                this.currentInput += ' ';
            } else if (key === 'SHIFT') {
                this.isCaps = !this.isCaps;
                this.renderKeys();
            } else if (key === '123') {
                this.mode = 'num';
                this.renderKeys();
            } else if (key === 'ABC') {
                this.mode = 'abc';
                this.renderKeys();
            } else if (key === 'DONE') {
                this.closeKeyboard();
            } else {
                const char = this.isCaps ? key.toUpperCase() : key.toLowerCase();
                this.currentInput += char;
            }

            this.updateDisplay();
        }

        updateDisplay() {
            if (this.displayElement) {
                this.displayElement.innerText = this.currentInput || '|';
            }
        }

        openKeyboard(args) {
            if (this.container && this.container.parentElement !== this.findStageElement()) {
                this.findStageElement().appendChild(this.container);
            }

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

        isKeyboardOpen() {
            return this.container ? this.container.style.display !== 'none' : false;
        }
    }

    Scratch.extensions.register(new StageMobileKeyboard());
})(Scratch);
                     
