// Please run this extension without sandbox

(function(Scratch) {
    'use strict';

    let moveX = 0;
    let moveY = 0;
    let lastRealX = null;
    let lastRealY = null;

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
            const canvas = document.querySelector('canvas');
            if (canvas) canvas.requestPointerLock();
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
        } else {
            if (lastRealX !== null && lastRealY !== null) {
                moveX += e.clientX - lastRealX;
                moveY += -(e.clientY - lastRealY);
            }
        }
        lastRealX = e.clientX;
        lastRealY = e.clientY;
    });

    const runtime = Scratch.vm ? Scratch.vm.runtime : Scratch.runtime;
    if (runtime) {
        runtime.on('RUNTIME_STEP_END', () => {
            moveX = 0;
            moveY = 0;
        });
    }

    Scratch.extensions.register(new CursorControls());
})(Scratch);
