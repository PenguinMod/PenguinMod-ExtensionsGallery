# Boxed Physics
<!-- Based on https://p7scratchextensions.pages.dev/ext/BoxedPhysics/doc.md but re-worked to be compatable with normal markdown parsers -->
---

Boxed Physics is an implementation of the Box2D physics engine that allows for the use of joints, springs, sliders, and other complex physics interactions within your projects. <br>
This documentation will guide you through the process of using Boxed Physics.

---

## Working with Worlds
When using the Boxed Physics extension, you must initialize the physics environment before starting your project. To do this, use the `Make world, Scale 1m: [SCALE] Gravity: [GRAVITY] Wind: [WIND] Scene: [SCENE]` block.

> Note: the environment is initialised to the default every time the project starts, but it's good practice to use this block every flag click anyways

### Scene Types
The scene type determines the containment type for your physics world:
- **Semi-closed stage:** Prevents objects from leaving the bottom and sides of the stage but allows infinite upward movement.
- **Boxed stage:** Fully contains objects within the stage, preventing them from leaving the top, bottom, or sides.
- **Opened stage:** Only prevents objects from falling off the bottom.
- **Nothing:** Removes all walls, allowing objects to move freely.

```scratch
when gf clicked
Make world, Scale 1m: [50] Gravity: [-10] Wind: [0] Scene: [semi-closed stage v] :: #2cb0c0
```

### Changing World Options
Once the world is created, you can modify gravity and wind dynamically without creating a new world.

```scratch
when gf clicked
forever
    Set world options, Gravity: (-10) Wind: ((5) * ([sin v] of ((timer) * (70)))) :: #2cb0c0
end
```

Additionally, you can enable slow motion using the `Set slow motion to [VALUE]` block.

---

## Creating Your First Object
Objects in Boxed Physics are invisible physics-based hitboxes. To add an object, define its shape and attributes, and then create it in the world.

### Basic Box Example
```scratch
when gf clicked
Dеfine Box, Width: [100] Height: [100] :: #2cb0c0
Make object [Object1] at X: [0] y: [0] Dir: [90] :: #2cb0c0
forever
    Step Simulation :: #2cb0c0 //Remember to run this block every tick
end
```

You can create multiple objects efficiently:
```scratch
when gf clicked
Dеfine Box, Width: [100] Height: [100] :: #2cb0c0
set [index v] to (0)
repeat (4)
    change [index v] by (1)
    Make object (join [Object] (index)) at X: [random(-100, 100)] y: [random(-100, 100)] Dir: [0] :: #2cb0c0
end
```

### Other Shapes

#### Circles
```scratch
Dеfine Circle, Size: [100] :: #2cb0c0
Make object [Object1] at X: [0] y: [0] Dir: [90] :: #2cb0c0
```

#### Polygons
1. **Costume-based:** Directly convert the current costume into a polygon (no holes).
2. **Point-based:** Define polygons with a list of coordinates.

```scratch
Dеfine polygon as this costume :: #2cb0c0
Make object [Object2] at X: [50] y: [50] Dir: [0] :: #2cb0c0

Dеfine polygon, Points: [0 50   40 -50   -40 -50] :: #2cb0c0 // Triangle
Make object [Object3] at X: [0] y: [0] Dir: [90] :: #2cb0c0
```

<!-- this is meant to be a player embed, but I don't think I'm allowed to do that here -->
> Point-based objects simply take an array of "x y" values seperated by 3 spaces. You can visualise any point-based polygon in [this demo](https://studio.penguinmod.com/fullscreen.html?project_url=https://p7scratchextensions.pages.dev/ext/BoxedPhysics/examples/BoxedPhysics point render system.pmp).

### Defining Base Attributes
Customize objects with the `Define base` block:
- **Type** Determines if the object is static or dynamic.
- **Density, Friction, Bounce** Control physical properties like weight, surface interaction, and bounciness.

```scratch
when gf clicked //Super bouncy imovable triangle
Dеfine polygon, Points: [0 50   40 -50   -40 -50] :: #2cb0c0
Dеfine base, Type: [static v] Density: [0.1] Friction: [0.5] Bounce: [2] :: #2cb0c0
Make object [Object1] at X: [0] y: [0] Dir: [90] :: #2cb0c0
```

---

## Modifying Objects

### Damping (air resistance)
The damping of each object can also be changed with the `Set [BODYATTR] of object [NAME] to [VALUE]` block.

```scratch
when gf clicked
Set [damping v] of object [Object1] to [0.1] :: #2cb0c0
```

### Destroying Objects
You can delete individual objects or clear all objects at once.
```scratch
when I receive [Destroy Object1 v]
Destroy object [Object1] :: #2cb0c0

when I receive [Nuke everything! v]
Destroy every object :: #2cb0c0 //This will also remove all joints
```

### Moving Objects

#### Direct Movement
```scratch
Move object [Object1] to X: [50] Y: [50] :: #2cb0c0
Set rotation of object [Object1] to [45] :: #2cb0c0
```

#### Velocity and Impulse
Rotational impulses are simple, just a number for power, but positional impulses are a little more complex. <br>
Positional impulses can be one of two types: `World Impulse` or `Impulse`.
They both take a direction, and power, but they behave differently.
The `Impulse` option is meant for quick movements (like jumping)
while the `World Impulse` option is meant for movement over time (like pushing a wheel).

```scratch
Set Velocity of object [Object1] to X: [10] Y: [0] Dir: [0] :: #2cb0c0
Apply Angular Impulse to object [Wheel1] power: [20] :: #2cb0c0
```

---

## Making Joints
Joints connect objects and enable complex interactions like wheels, sliders and more. <br>
You can create many types of joints, including:

- Rotating
- Spring
- Weld
- Slider


```scratch
Dеfine Spring, Length: [100] Damping: [0.7] Freq: [5] :: #2cb0c0
Create Joint [Spring1] of type [Spring v] between [Object1] at [0] [0] and [Object2] at [0] [0] :: #2cb0c0
```

<!-- This is also meant to be an embed-->
> Experiment with all the joint types in [this demo](https://studio.penguinmod.com/fullscreen.html?project_url=https://p7scratchextensions.pages.dev/ext/BoxedPhysics/examples/Joints.pmp) to see what they do.

### Joint Properties
- **Settable:** Motor On, Speed, Limits, Torque
- **Gettable:** Angle, Speed, Torque, Tension

---

## Performance Options
You can optimize your simulation by configuring iteration settings to allow for more objets with less lag, or have better physics with fewer objects. <br>
While this doesn't visually change anything _(usually)_ it does change how performant things are, and you will notice that with bigger simulations.

```scratch
Set physics options, Position iterations: [10] Velocity iterations: [10] Continuous physics: <true :: #5EC15D> Warm starting: <true :: #5EC15D> :: #2cb0c0
```

---

## Math Utilities
Boxed Physics also includes some math blocks for convenience:
- **Rotate a point:** Rotate a point around the origin (0, 0).
- **Get rotation from:** Find the direction from one point to another.
- **Magnitude:** Calculate the vector length.
- **Distance:** Measure the distance between two points.

```scratch
(Get [x v] from point x [10] y [-10] rotated by [90] :: #2cb0c0)
(Get rotation from x [0] y [0] to x [10] y [15] :: #2cb0c0)
(Magnitude of x [5] y [3] :: #2cb0c0)
(Distance between x [0] y [0] and x [-20] y [10] :: #2cb0c0)
```

---

## Examples
Need more help?
Try some example projects [here](https://p7scratchextensions.pages.dev/ext/BoxedPhysics/examples).
