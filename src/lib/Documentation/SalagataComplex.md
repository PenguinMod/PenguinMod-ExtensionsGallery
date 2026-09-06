# Complex Numbers

---

[Complex Numbers](https://en.wikipedia.org/wiki/Complex_number) is an extension that allows you to use Complex Numbers in Scratch, by introducing a new type: `ComplexNumber`. <br>
These Complex Numbers can be used in, for example:
- Computer Graphics: Used for do transforms, simulations like the design of fractals(like the Mandelbrot Set) and rendering images.
- Video games and 2D/3D graphics: Rotations, Scaling, Translation, Reflection.
- Signal processing and signal integration: like in FFT and the Frequency spectrum.
- Cryptography and Computer Security.

These Complex numbers have the property to choose the representation you want to use. Either the polar form or rectangular form

---

## Angles

While developing this extension, I found a problem in the way that Scratch represents the Angles (Internally, and in ANGLE inputs). 
![Representation of angles in Scratch](https://files.catbox.moe/7uz5t7.png) <br>
In Scratch, 90° is pointing right, with 0° pointing up, which is different from the common representation which is the opposite.
The trigonometrical functions (even the ones defined in ([sin v] of ()) block, Scratch-core), recieve as argument a different kind of angle. <br>
Internally, Scratch has to do `90 - SCRATCH_ANGLE` in order to perform any trigonometrical operation. It converts the Scratch angle recieved commonly as input into a Plane angle(The one used in Mathematics).
![Complex Plane angles](https://files.catbox.moe/umf5i8.png)
> ‍Kan8eDie, CC BY-SA 3.0 <https://creativecommons.org/licenses/by-sa/3.0>, via Wikimedia Commons <br>
In this documentation. I'm going to define `Scratch Angle` as the angles that are used in Scratch angle inputs, and `Complex Plane angle` as the angles that are used in Trigonometry (and Complex Analysis). And `to transform ANGLE into ANGLE` to the mathematical operation of converting one kind of angle into another, and viceversa.
```scratch
set direction to (90) ::motion  // Arguments are in Scratch angles
direction ::motion reporter // Returns in Scratch angles
[sin v] of (60) ::operators reporter // Arguments are in Complex Plane angles
```

In general.
```
COMPLEX_PLANE_ANGLE = 90 - SCRATCH_ANGLE
SCRATCH_ANGLE = 90 - COMPLEX_PLANE_ANGLE
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

The `ComplexNumberType` in this extension has 2 representations. Rectangular and Polar. <br>
This division is for be specific if you want to save the phase and modulus, and to not recalculate them each time.
At the moment of creating a complex number in polar form, instead of calculating the real and imaginary part and lose the phase and modulus(which will lead to precision error), it saves the phase and modulus in packages properties, and then, it calculates the real and imaginary part, while using the phase and modulus for calculus that involves the polar components (maybe will change this to choose if do the math using `rectangular or polar` or either `rectangular` or `polar`, for improve optimization).

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
| _modulus      | *(Package property)* Modulus of the angle |
| _phase     | *(Package property)* The complex phase(in degrees) transformed into a *complex plane angle* |
| _fromPolar     | *(Package property)* If the complex number is or comes from a `Polar->Complex` function, like `new complex number modulus: [1], angle: [45]` |

At the moment of needing the phase or the modulus, if it comes from the polar form, it will use `_phase` or `_modulus`, if no, then it will calculate it.

## Parsing, Serialization and Deserialization

For parsing functions like .toArray(), toJSON(), it will return a polar representation if `_fromPolar` is `true`, if not, it will return a rectangular representation, as shown as above.

At the moment of returning an Array, a delimitated string, or any well-sorted format, it will use the next order. Whether to use Pthe Rectangular or Polar representation is determined by the `_fromPolar` property

### Rectangular representation

Representation used at the moment of parsing Arrays, or any well-sorted format into Complex Numbers
| Index  | Description |
| ------------- |:-------------:|
| 0      | Real part |
| 1     | Imaginary Part |

Representation used at the moment of parsing Objects into Complex Numbers (NOT FINISHED YET)
| Property  | Description |
| ------------- |:-------------:|
| real      | Real part |
| imaginary     | Imaginary Part |

---

### Polar representation

Representation used at the moment of parsing Arrays, or any well-sorted format into Complex Numbers
| Index  | Description |
| ------------- |:-------------:|
| 0      | Real part |
| 1     | Imaginary Part |
| 2      | Modulus of the angle |
| 3     | The complex phase(in degrees) as a *scratch angle* |

Representation used at the moment of casting Objects into Complex Numbers (NOT FINISHED YET)
| Property  | Description |
| ------------- |:-------------:|
| real      | Real part |
| imaginary     | Imaginary Part |
| modulus      | Modulus of the angle |
| phase     | The complex phase(in degrees) as a *scratch angle* |

Serialization and Deserialization are done using an array, using the indexes as shown above. <br>
If the index number 3 exist `z[3]`, at the moment of serialization it will *transform it into a scratch angle*, and at the moment of deserialization, it will *transform it back as a complex plane angle*. <br>
This distinction is important for extensions with functions that use a `.toJSON()` function or similar, and uses only the JSON representation(Like in SwiftJSON, where the complex numbers when they are in a list are shown as JSON objects, but at the moment of accessing it's properties, it's the `ComplexNumberType`), because the angle internally is represented as a *complex plane angle*, but it returns a *scratch angle* for most of the blocks. This extension has already an integration with JwArray and dogeiscutSet, although you can put the blocks that return a list inside functions like in the next example with SwiftJSON

```scratch
for each (key) (value) in [{"Object": "or array"}] { 
    do something with (value) :: extension 
} :: #748BEE // SwiftJSON inputs are the raw objects, no the "parsed" objects
// they mantain the same properties and prototypes, you should check if your extension allows this
```

## Extension Object
This extension saves many data related to the extension inside the object `vm.salagataComplexNumber`, which has the following properties.

| Property  | Definition | Description |
| ------------- | ------------- |:-------------:|
| `Type`      | `typeof ComplexNumberType` | Custom Type class defined for Complex Numbers |
| `Block`     | `object` | Template for generate blocks compatible with the Custom Type |
| `Argument`      | `object` | Template for generate arguments compatible with the Custom Type |
| `Serializer`     | `function(z: ComplexNumberType): [number,number] \| [number,number,number,number]` | Serializer for the Custom Type |
| `Deseralizer`     | `function(z: [number,number] \| [number,number,number,number]): ComplexNumberType` | Deserializer for the Custom Type |
<!-- const ComplexNumber: {
    Type: typeof ComplexNumberType;
    Block: {
        blockType: any;
        blockShape: any;
        forceOutputType: string;
        disableMonitor: boolean;
    };
    Argument: {
        shape: any;
        check: string[];
    };
    Serializer(z: ComplexNumberType): {};
    Deserializer(z: [number, number] | [number, number, number, number]): ComplexNumberType;
}  -->

---

The type Complex Number Type has the following properties and methods, in addition of the mandatory ones for Custom Types.

| Property  | Definition | Description |
| ------------- | ------------- |:-------------:|
| `customId`      | `String` | Used for identify the object during serialization |
| `toReporterContent`     | `function(): HTMLElement` | Content for a script reporter |
| `toMonitorContent`     | `function():HTMLElement` | Content for a variable monitor |
| `toString`     | `function(polarForm = false): String` | Casts the complex number as a string, choose whether to use rectangular or polar form.  Choose whether to convert it as polar form when casting to string |

The table shown in Internal Representation Section, all values are stored as numbers

| Property  | Definition | Description |
| ------------- | ------------- |:-------------:|
| `toComplex`      | `static function(u): ComplexNumberType` | Internal parsing functions, representations are shown in Parsing, Serialization and Deserialization Section. It has support for arrays[2,4], strings delimited by commas[2,4], VectorType from JwVector, ArrayType from JwArray[2,4], and numbers. If failed, it fallbacks to 0 |
| `jwArrayHandler`     | `function(): string` | Representation in a reporter content from `ArrayType` defined in JwArray |
| `modulus`     | `function(): number` | Returns the absolute value or modulus of a complex number, if it comes from the polar form, it will use `_modulus`, if no, then it will calculate it. |
| `phase`     | `function(): number` | Returns the argument or phase of a complex number in degrees, if it comes from the polar form, it will use `_phase`, if no, then it will calculate it. |
| `conjugate`     | `function(): ComplexNumberType` | Returns the conjugate of a complex number, if it comes from the polar form, it will also count the angle and process it, instead of relying that *"it will be recovered after calculating it back after calculating `real` and `imaginary`"*  |
| `toJSON`  | `function(): { real:    number;     imaginary: number;     modulus?: number \| null;     phase?: number; }` | Representation as a JSON Object, (seems like it's only used in SwiftJSON and in dogeiscutObject). Remember that the phase is in degrees and *transformed into a scratch angle*
| `toArray`  | `function(): [number,number] \| [number,number,number,number]` | Representation as an Array. Remember that the phase is in degrees and *transformed into a scratch angle*
| `fromPolar`     | `function(modulus: number, phase: number): ComplexNumberType` | Creates a complex number given it's polar form. `modulus` The absolute value, or modulus of the original number, `phase` The angle, in degrees, transformed as a *complex plane angle*


NOTE: **IS NOT RECOMMENDED TO RETRIEVE THE VALUE DIRECLY USING THE PARSED OBJECT OR ARRAY REPRESENTATION, as it doesn't have the phase correcly expressed**, it's recommended to use the blocks already defined in the extension, or use the getters `modulus`  and `phase`.

```scratch
(get [real] in (parse [A complex number] as an object :: #EEB354) :: #EEB354)  // try avoiding this
```

# Reference

NOTE: The bumped inputs cannot be displayed here, and we have turned them into circular inputs.

---
```scratch
(complex number from [REAL] :: #847E3F)
```
Creates a new complex number in rectangular form with only the real part, imaginary part as 0

| Argument  | Description |
| ------------- |:-------------:|
| REAL      | Real part |

---
```scratch
(complex number from [IMAGINARY] i :: #847E3F)
```
Creates a new complex number in rectangular form with only the imaginary part, real part as 0

| Argument  | Description |
| ------------- |:-------------:|
| IMAGINARY      | Imaginary part |

---
```scratch
(complex number [REAL] + [IMAGINARY] i :: #847E3F)
```
Creates a new complex number in rectangular form with the real part and imaginary part
| Argument  | Description |
| ------------- |:-------------:|
| REAL      | Real part |
| IMAGINARY      | Imaginary part |

---
```scratch
(complex number modulus: [R] phase: [PHASE] :: #847E3F)
```
Creates a new complex number in polar form with modulus and phase as a *scratch angle*
| Argument  | Description |
| ------------- |:-------------:|
| R      | Modulus of complex number|
| PHASE      | Phase of complex number, in degrees, as a *scratch angle* |


---
```scratch
(complex number modulus: 1 phase: [PHASE] :: #847E3F)
```
Creates a new complex number in polar form with modulus 1 and phase as a *scratch angle*
| Argument  | Description |
| ------------- |:-------------:|
| PHASE      | Phase of complex number, in degrees, as a *scratch angle* |

---
```scratch
(parse [A] to a complex number :: #847E3F)
```
Parses a type into a complex number
| Argument  | Description |
| ------------- |:-------------:|
| A      | A compatible type. At the moment it has support for arrays[2,4], strings delimited by commas[2,4], VectorType from JwVector, ArrayType from JwArray[2,4], and numbers. If failed, it fallbacks to 0 |
Check Parsing, Serialization and Deserializaiton

---
```scratch
(real part [A] :: #847E3F)
```
Returns the Real part of a complex number, independent of it's representation
| Argument  | Description |
| ------------- |:-------------:|
| A      | Complex number using any representation |

---
```scratch
(imaginary part [A] :: #847E3F)
```
Returns the Imaginary part of a complex number, independent of it's representation
| Argument  | Description |
| ------------- |:-------------:|
| A      | Complex number using any representation |

---
```scratch
(absolute value [A] :: #847E3F)
```
Returns the Absolute value, or modulus of a complex number, independent of it's representation
| Argument  | Description |
| ------------- |:-------------:|
| A      | Complex number using any representation |

---
```scratch
(phase [A] :: #847E3F)
```
Returns the Argument, or the phase of a complex number *as a scratch angle*, independent of it's representation
| Argument  | Description |
| ------------- |:-------------:|
| A      | Complex number using any representation |


UNFINISHED