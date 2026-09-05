# ODE Extension

## Notes

### World/Space

In ODE you have to create them separately, but in this extension `new world` will create world and space at same time.

### Coordinate system

By default this extension uses `+Y = up` if you want to use different coordinate system, just change gravity.

Lengths in capsules/cylinders are based on Z axis.

## Things you might find useful

Maybe these would be useful if you're using ODE for first time.

### Difference between body and geometry

Body is for rigid body physics (like movemenet, gravity, and etc.), and geometry is for collision.

Which means if you want an object that never moves but has collision, you'd only make geometry. Or you can make the body kinematic.

### How you should create an object

1. Create a geometry
2. Create a body
3. Associate the body you created with the geometry you created
4. (optional) Move or rotate body (or geometry)

You **MUST** move or rotate after associating the body with geometry, otherwise object would not move to the position (or get rotated).
