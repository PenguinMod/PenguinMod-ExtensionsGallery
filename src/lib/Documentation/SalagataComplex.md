# Complex Numbers

---

[Complex Numbers](https://en.wikipedia.org/wiki/Complex_number) is an extension that allows you to use Complex Numbers in Scratch, by introducing a new type: `ComplexNumber`.
These Complex Numbers can be used in, for example:
- Computer Graphics: Used for do transforms, simulations like the design of fractals(like the Mandelbrot Set) and rendering images.
- Video games and 2D/3D graphics: Rotations, Scaling, Translation, Reflection.
- Signal processing and signal integration: like in FFT and the Frequency spectrum.
- Cryptography and Computer Security.

These Complex numbers have the property to choose the representation you want to use. Either the polar form or rectangular form

---

## Angles

While developing this extension, I found a problem in the way that Scratch represents the Angles (Internally, and in ANGLE inputs).
![Representation of angles in Scratch](https://files.catbox.moe/7uz5t7.png)
The angles basically start in 0° but 0° is the top (when it should be in the right), then the front is 90°(when it should be in the top), which it's confusing.
The trigonometrical functions (even the ones defined in ([sin v] of ()) block), recieve as argument a different kind of angle.
Internally, Scratch has to do `90 - SCRATCH_ANGLE` in order to perform any trigonometrical operation. It converts the Scratch angle recieved commonly as input into a Plane angle(The one used in Mathematics).
![Complex Plane angles](https://files.catbox.moe/umf5i8.png)
In this documentation. I'm going to define `Scratch Angle` as the angles that are used in Scratch angle inputs, and `Complex Plane angle` as the angles that are used in Trigonometry (and Complex Analysis). And `to transform ANGLE into ANGLE` to the mathematical operation of converting one kind of angle into another, and viceversa.
```scratch
set direction to (90) ::motion  // Arguments are in Scratch angles
direction ::motion reporter // Returns in Scratch angles
[sin v] of (60) ::operators reporter // Arguments are in Complex Plane angles
```

In general.
```
COMPLEX_PLANE_ANGLE = 90 - SCRATCH_ANGLE
SCRATCH_ANGLE = -COMPLEX_PLANE_ANGLE + 90
```

JwVector doesn't solve the problem, it just abstracts the vector functions for use only Scratch angles (in addition of casting degrees to radians and floating-point precision errors).

```scratch
new vector magnitude: (1) angle: (0) ::#6BABFF reporter // Recieves the angle in Scratch angles
angle of () ::#6BABFF reporter // Returns the answer in Scratch angles
```

This point is important because Scratch Angles doesn't follow the natural properties that Complex Plane angles do, like
*"The angle of the product of a complex number of modulus 1 and angle `ANGLE_1` with a complex number of modulus 1 and angle  `ANGLE_2` is equal to `ANGLE_1 + ANGLE_2`"*(One of the properties of complex numbers in polar form) is **not** true if the angles are defined in Scratch angles. Or, ilustrated.
![Angle equivalency](https://files.catbox.moe/fz14md.png)

This extension interally expresses the angles of Complex Numbers in Complex Plane Angles and recieves/returns Scratch angles for deal with this problem. In addition of the following blocks.

```scratch
transform (90) into Complex Plane Angle ::operators reporter // Trasnsforms Scratch angles into Complex Plane Angle, this also has the Angle input
transform (0) into Scratch Angle  ::operators reporter // Trasnsforms Complex Plane Angle into Scratch angles 
```

This might look confusing(because it is), so, stay with the idea that Scratch uses a different kind of angles that doesn't follow the same properties as the normal angles. And you just need to "rotate and invert them" to convert one into another 
## Internal Representation

The `ComplexNumberType` in this extension has 2 representations. Rectangular and Polar.
At the moment of creating a complex number in polar form, it is created

### Rectangular representation

| Property  | Description |
| ------------- |:-------------:|
| real      | Real part |
| imaginary     | Imaginary Part |

### Polar representation

| Property  | Description |
| ------------- |:-------------:|
| real      | Real part |
| imaginary     | Imaginary Part |
| modulus      | Modulus of the angle |
| phase     | The complex phase transfomed into a *complex plane angle* |

NOTE: The bumped inputs cannot be displayed here, and we have turned them into circular inputs.