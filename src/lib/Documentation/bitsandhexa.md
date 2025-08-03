# Bits & Hexa v0.9
## Bitwise Operations for Decimals, Binary, and Hexadecimal
### By BurningHot687/Raichu-Model

If you are unfamiliar with bitwise operations, then hopefully this documentation can help you. If you still need further reading, you may go to this [Wikipedia Article](https://en.wikipedia.org/wiki/Bitwise_operation)

###### Keep in mind that version 0.9 currently only supports binary, decimal, and hexadecimal. Do not attempt other bases like base 64.

```scratch
<is [1011] [decimal v]?:: #15448f>
```

Checks if the provided string is one of the alloted bases

```scratch
convert [4d2] from dec/hexa to [decimal v] :: reporter :: #15448f
```

Assumes that the input is a decimal unless a letter is put in to make it hexadecimal (improve later!), then converts it to one of the alloted bases.
