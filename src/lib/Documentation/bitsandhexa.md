# Bitwise+ v0.17
## Bitwise Operations for Decimals, Binary, and Hexadecimal
### By BurningHot687/Raichu-Model/-Rig

If you are unfamiliar with bitwise operations, then hopefully this documentation can help you. If you still need further reading, you may go to this [Wikipedia Article](https://en.wikipedia.org/wiki/Bitwise_operation).

###### Keep in mind that version 0.17 currently only supports binary, decimal, and hexadecimal. All outputs, unless specified otherwise, are going to be in decimal. All inputs, unless specified otherwise, are assumed decimal unless there is a hexadecimal character within it.

---

```scratch
<is [1011] [decimal v]?:: #15448f>
```

Checks if the provided string is one of the alloted bases.

```scratch
convert [4d2] from [hexadecimal v] to [decimal v] :: reporter :: #15448f
```

If the input and its assigned base are the same, then it will convert to the requested base.

```scratch
get bit at index (3) of [13] :: reporter :: #15448f
```

Gets the bit (`0` or `1`) at the index of the binary representation of the input number. Index `0` refers to the least significant bit.

---

```scratch
[-13] >> (3) :: reporter :: #15448f
```

Think of it like this:

We have a number -13 in binary:
`11111111111111111111111111110011`

The sign bit at the very left is `1`, and let's say we shift it 3 places to the right without accounting for the sign.

`00011111111111111111111111111110`

That's a completely different number! (`536870899`)

For this reason, for each shift, we "duplicate" the sign bit and move it over to the left. After three shifts we end up with `-2`.

`11111111111111111111111111111110`

Obviously positive numbers wouldn't be affected drastically due to their sign bits being `0`.

```scratch
[13] << (3) :: reporter :: #15448f
```

Shifts the bits left by the amount requested (`1111` to `111100` if the amount was `2`).

```scratch
[-13] >>> (3) :: reporter :: #15448f
```

Just shifts it to the right without caring about the sign bit:

`11111111111111111111111111110011` to `00011111111111111111111111111110` or `-13` to `536870899`

---

## Extras

These blocks are more experimental and definitely require updates here and there. These are meant to be used for specific-use cases.

---

---



And that should be all! :D
