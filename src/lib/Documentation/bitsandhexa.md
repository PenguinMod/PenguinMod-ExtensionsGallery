# Bitwise+ v1.3
## Bitwise Operations for Decimals, Binary, and Hexadecimal
### By BurningHot687/Raichu-Model/-Rig

If you are unfamiliar with bitwise operations, then hopefully this documentation can help you. If you still need further reading, you may go to this [Wikipedia Article](https://en.wikipedia.org/wiki/Bitwise_operation). I do not claim to be an expert, so these explanations might not be the best unless you've got the context for them.

###### Keep in mind that version 1.3 currently only supports binary, decimal, hexadecimal, and octals. All outputs, unless specified otherwise, are going to be in decimal. All inputs, unless specified otherwise, are assumed decimal unless there is a hexadecimal character within it. Also keep in mind Scratch has a 32 bit system.

---
```scratch
<is [1011] [decimal v]?::#15448f
```
Checks if the provided string is one of the alloted bases.
```scratch
(convert [4d2] from [hexadecimal v] to [decimal v]::#15448f
```
If the input and its assigned base are the same, then it will convert to the requested base.
```scratch
(get bit at index (3) of [13]::#15448f
```
Gets the bit (`0` or `1`) at the index of the binary representation of the input number. Index `0` refers to the least significant bit.

---
```scratch
([-13] >> (3)::#15448f
```
Signed right shift. Think of it like this:
We have a number -13 in binary:
`11111111111111111111111111110011`
The sign bit at the very left is `1`, and let's say we shift it 3 places to the right without accounting for the sign.
`00011111111111111111111111111110`
That's a completely different number! (`536870899`)
For this reason, for each shift, we "duplicate" the sign bit and move it over to the left. After three shifts we end up with `-2`.
`11111111111111111111111111111110`
Obviously positive numbers wouldn't be affected drastically due to their sign bits being `0`.
```scratch
([13] \<\< (3)::#15448f
```
Shifts the bits left by the amount requested (`1111` to `111100` if the amount was `2`).
```scratch
([-13] >>> (3)::#15448f
```
Unsigned right shift. Just shifts it to the right without caring about the sign bit:
`11111111111111111111111111110011` to `00011111111111111111111111111110` or `-13` to `536870899`
```scratch
([-13] ↻ (3)::#15448f
```
Circular right shift: 
Basically an unsigned right shift but instead of deleting bits they are looped to the 32nd bit.
```scratch
([-13] ↺ (3)::#15448f
```
Same as before but opposite direction.

---
```scratch
(() & () | and::#15448f
```
Bitwise and.

```scratch
(() | () | or::#15448f
```

Bitwise or.

```scratch
(() ^ () | xor::#15448f
```

Bitwise exclusive or (returns `1` if both bits are different).

```scratch
(~() | not::#15448f
```

Bitwise not.

```scratch
(~() & () | nand::#15448f
```

Bitwise nand (`0` if both inputs are on).

```scratch
(~() | () | nor::#15448f
```

Bitwise nor (`1` if both inputs are off).

```scratch
(~() ^ () | xnor::#15448f
```

Bitwise exclusive nor (`1` if both inputs are the same).

## Extras

These blocks are more experimental and definitely require updates here and there. These are meant to be used for specific-use cases.

---

```scratch
(character (0) of [f] to [UTF-16 v] in [decimal v]::#15448f
```

Takes in a string and applies
```javascript
"string".charCodeAt(number);
```

`codePointAt` is used for Unicode.

```scratch
(number (41) using [UTF-16 v] in [decimal v] to character::#15448f
```

Takes in a number and applies
```javascript
String.fromCharCode(number);
```

`fromCodePoint` is used for Unicode.

```scratch
(::ring)[foo?!] to [UTF-16 v] array in [decimal v](::ring)::ring control :: #15448f
```

Takes in an array and turns it into a string.

```scratch
([UTF-16 v] array ((::ring)(::ring):: ring control :: #0a094f) in [decimal v] to string::#15448f
```

Takes in an array and returns a string.

---

```scratch
(0x ()::#15448f
```

Takes in a hexadecimal number and returns a decimal.

```scratch
(0b ()::#15448f
```

Takes in a binary number and returns a decimal.

```scratch
(0o ()::#15448f
```

Takes in an octal number and returns a decimal.

```scratch
(convert float 32 (6.28) to [binary v]::#15448f
```

Takes in a single-precision float (32 bits) and turns it into the requested base. 

```scratch
(convert [f00] in [hexadecimal v] to float 32::#15448f
```
Takes in a number, reads it in the assigned base, and converts it into a float32. Because of the way floats are stored, using the above block as the number input in this block would most likely result in a different number being outputted, with a few exceptions.

```scratch
(reverse endianness of (37) in [decimal v]::#15448f
```

Switches the byte order of the provided number.

---

These blocks probably won't work with extra blocks and *might* break normal blocks (or at least show unexpected behavior).

```scratch
use a [static v] length for binary::#15448f
```

Changes the representation of binary numbers. Two's complement is applied to the most significant bit provided rather than the 32nd bit in dynamic mode.

```scratch
<using [static v] length?::#15448f
```

Checks if you're using static or dynamic length.

---

And that should be all! :D
