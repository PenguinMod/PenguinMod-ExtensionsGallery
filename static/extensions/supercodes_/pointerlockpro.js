(function(Scratch) {
    'use strict';

    let moveX = 0;
    let moveY = 0;

    class PointerLockPro {
        getInfo() {
            return {
                id: 'supercodesPointerLockPro',
                name: 'Pointer Lock Pro',
                blocks: [
                    {
                        opcode: 'lockPointer',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'lock pointer'
                    },
                    {
                        opcode: 'exitPointerLock',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'escape pointer lock'
                    },
                    {
                        opcode: 'isPointerLocked',
                        blockType: Scratch.BlockType.REPORTER,
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

        exitPointerLock() {
            if (document.exitPointerLock) document.exitPointerLock();
        }

        isPointerLocked() {
            return String(!!document.pointerLockElement);
        }

        getMovementX() { return moveX; }
        getMovementY() { return moveY; }
    }

    document.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement) {
            moveX = e.movementX;
            moveY = -e.movementY;
        } else {
            moveX = 0;
            moveY = 0;
        }
    });

    const ext = new PointerLockPro();
    Scratch.extensions.register(ext);

    Scratch.vm.runtime.on('PROJECT_STOP_ALL', () => {
        if (document.exitPointerLock) document.exitPointerLock();
    });
})(Scratch);
