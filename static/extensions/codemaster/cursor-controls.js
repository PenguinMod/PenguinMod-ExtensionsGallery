(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('Cursor Controls must run unsandboxed');
    }

    let moveX = 0;
    let moveY = 0;

    class CursorControls {
        getInfo() {
            return {
                id: 'moosanaeempclgtmcursorcontrols',
                name: 'Cursor Controls',
                color1: '#4fc694',
                featured: true,
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
            const canvas = Scratch.renderer.canvas;
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
            moveY += -e.movementY;
        }
    });

    const runtime = Scratch.vm.runtime;
    runtime.on('RUNTIME_STEP_END', () => {
        moveX = 0;
        moveY = 0;
    });

    Scratch.extensions.register(new CursorControls());
})(Scratch);
