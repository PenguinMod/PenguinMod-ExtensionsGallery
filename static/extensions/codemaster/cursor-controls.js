// Please run this extension without sandbox
(function(Scratch) {
    'use strict';
    let moveX = 0, moveY = 0, lastX = null, lastY = null;
    class CursorControls {
        getInfo() {
            return {
                id: 'codemasterCursorControls',
                name: 'Cursor Controls',
                color1: '#4fc694',
                blocks: [
                    { opcode: 'lockPointer', blockType: Scratch.BlockType.COMMAND, text: 'lock pointer' },
                    { opcode: 'exitPointerLock', blockType: Scratch.BlockType.COMMAND, text: 'exit pointer lock' },
                    { opcode: 'isPointerLocked', blockType: Scratch.BlockType.BOOLEAN, text: 'pointer locked?' },
                    { opcode: 'getMovementX', blockType: Scratch.BlockType.REPORTER, text: 'mouse movement x' },
                    { opcode: 'getMovementY', blockType: Scratch.BlockType.REPORTER, text: 'mouse movement y' }
                ]
            };
        }
        lockPointer() { const c = document.querySelector('canvas'); if (c) c.requestPointerLock(); }
        exitPointerLock() { if (document.exitPointerLock) document.exitPointerLock(); }
        isPointerLocked() { return !!document.pointerLockElement; }
        getMovementX() { return moveX; }
        getMovementY() { return moveY; }
    }
    document.addEventListener('mousemove', (e) => {
        if (document.pointerLockElement) {
            moveX += e.movementX; moveY += -e.movementY;
        } else {
            if (lastX !== null && lastY !== null) {
                moveX += e.clientX - lastX; moveY += -(e.clientY - lastY);
            }
        }
        lastX = e.clientX; lastY = e.clientY;
    });
    const rt = Scratch.vm ? Scratch.vm.runtime : Scratch.runtime;
    if (rt) { rt.on('RUNTIME_STEP_END', () => { moveX = 0; moveY = 0; }); }
    Scratch.extensions.register(new CursorControls());
})(Scratch);
