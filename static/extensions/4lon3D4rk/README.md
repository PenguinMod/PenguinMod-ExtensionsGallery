# Platformer Physics Extension for PenguinMod

A professional, high-performance 2D platformer physics extension designed for PenguinMod. It provides smooth movement, gravity, collision detection, and advanced platformer mechanics without complex math blocks.

## Features
- **Smooth Movement:** Left/right movement, variable jump force, and dashing.
- **Advanced Physics:** Configurable gravity, friction, air resistance, bounce, and max speed.
- **Platform Support:** Add static and moving platforms easily with built-in collision handling.
- **Quality of Life:** Coyote time, jump buffering, wall sliding, and wall jumping support.
- **Event Blocks:** Trigger code blocks when hitting the ground, hitting walls, or starting to fall.
- **State Reporters:** Check velocity, speed, jump count, and ground/air status instantly.

## Blocks Overview

### Movement
- `Move left with speed [SPEED]`
- `Move right with speed [SPEED]`
- `Jump with force [FORCE]`
- `Buffered jump with force [FORCE]`
- `Dash [DIRECTION] with power [POWER]`
- `Stop movement`
- `Set velocity to x: [VX] y: [VY]`

### Physics Settings
- `Set gravity to [VALUE]`
- `Set friction to [VALUE]`
- `Set max speed to [VALUE]`
- `Set bounce to [VALUE]`
- `Set air resistance to [VALUE]`
- `Set coyote time to [FRAMES] frames`
- `Set max jumps to [COUNT]`

### Ground & Platforms
- `Set ground level to y: [Y]`
- `Add platform at x: [X] y: [Y] width: [W] height: [H]`
- `Add moving platform at x: [X] y: [Y] width: [W] height: [H] speed x: [SX] y: [SY]`
- `Clear all platforms`

### Physics Engine
- `Update physics`
- `Update physics with delta [DELTA]`
- `Apply force x: [FX] y: [FY]`
- `Reset physics`

### Reporters & Booleans
- `Velocity X` / `Velocity Y` / `Total speed` / `Jump count`
- `Is on ground?` / `Is falling?` / `Is moving?` / `Can jump?` / `Is sliding?`

### Events
- `When hit ground`
- `When hit wall`
- `When start falling`

### Advanced
- `Enable wall slide [ENABLED]`
- `Set wall slide speed to [SPEED]`
- `Wall jump with force [FORCE]`

## How to Use
1. Initialize your character's physics or set a ground level.
2. In a `forever` loop, place the `Update physics` block.
3. Use the movement blocks tied to keyboard inputs (e.g., *when key right arrow pressed* -> *Move right*).