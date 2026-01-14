(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        console.log('Cursor Controls: Attempting to reload unsandboxed...');
    }

    let moveX = 0;
    let moveY = 0;

    class CursorControls {
        getInfo() {
            return {
                id: 'moosanaeempclgtmcursorcontrols',
                name: 'Cursor Controls',
                color1: '#4fc694',
                blocks: [
                    {
                        opcode: 'lockPointer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'lock pointer'
                    },
                    {
                        opcode: 'unlockPointer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'unlock pointer'
                    },
                    {
                        opcode: 'isPointerLocked',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'pointer locked?'
                    },
                    {
                        opcode: 'getMovementX',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'mouse movement x'
                    },
                    {
                        opcode: 'getMovementY',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'mouse movement y'
                    }
                ]
            };
        }

        lockPointer() {
            const canvas = document.querySelector('canvas') || (Scratch.renderer && Scratch.renderer.canvas);
            if (canvas) {
                canvas.requestPointerLock();
            }
        }

        unlockPointer() {
            if (document.exitPointerLock) {
                document.exitPointerLock();
            }
        }

        isPointerLocked() {
            return !!document.pointerLockElement;
        }

        getMovementX() { return moveX; }
        getMovementY() { return moveY; }
    }

    document.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement) {
            moveX += e.movementX;
            // Up is positive in Scratch, negative in Browser
            moveY += -e.movementY;
        }
    });

    const setupReset = () => {
        const runtime = Scratch.vm ? Scratch.vm.runtime : Scratch.runtime;
        if (runtime) {
            runtime.on('RUNTIME_STEP_END', () => {
                moveX = 0;
                moveY = 0;
            });
        } else {
            setTimeout(setupReset, 100);
        }
    };
    setupReset();

    Scratch.extensions.register(new CursorControls());
})(Scratch);
