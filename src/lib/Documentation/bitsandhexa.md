# Bits & Hexa v0.11
## Bitwise Operations for Decimals, Binary, and Hexadecimal
### By BurningHot687/Raichu-Model

If you are unfamiliar with bitwise operations, then hopefully this documentation can help you. If you still need further reading, you may go to this [Wikipedia Article](https://en.wikipedia.org/wiki/Bitwise_operation).

###### Keep in mind that version 0.11 currently only supports binary, decimal, and hexadecimal. Do not attempt other bases like base 64 or octals because they're not here yet.

```scratch
<is [1011] [decimal v]?:: #15448f>
```

Checks if the provided string is one of the alloted bases.

```scratch
convert [4d2] from [hexadecimal v] to [decimal v] :: reporter :: #15448f
```

If the input and its assigned base are the same, then it will convert to the requested base.

```scratch
[-13] >> (3) :: reporter :: #15448f
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
