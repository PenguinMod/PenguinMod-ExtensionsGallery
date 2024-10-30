# Number Utilities Extension Documentation

The Number Utilities extension adds useful number formatting and manipulation capabilities to your projects. This extension provides blocks for formatting numbers in different locales, working with decimals, currencies, and performing various number checks and conversions.

## Basic Number Formatting

### Format Number with Locale
```scratch
(format number [10000] with locale [English (US) v] :: #59c059)
```
Formats a number according to the specified locale's conventions. This affects how decimal points, thousands separators, and other formatting elements appear.

Examples:
- US English: `1,234.56`
- German: `1.234,56`
- French: `1 234,56`

Available locales include system default and many country-specific options like English (US), Spanish (Spain), Japanese, and more.

### Format with Decimal Places
```scratch
(format [3.14159] with [2] decimal places :: #59c059)
```
Formats a number with a specific number of decimal places.

Examples:
- `3.14159` with 2 decimals → `3.14`
- `10.8` with 3 decimals → `10.800`
- `5` with 1 decimal → `5.0`

### Format with Significant Figures
```scratch
(format [3.14159] with [3] significant figures :: #59c059)
```
Formats a number to show a specific number of significant digits.

Examples:
- `3.14159` with 3 significant figures → `3.14`
- `123.456` with 2 significant figures → `120`
- `0.0012345` with 2 significant figures → `0.0012`

## Currency and Percentage Formatting

### Format as Currency
```scratch
(format [123.45] as currency in [USD v] :: #59c059)
```
Formats a number as currency in the specified currency code.

Examples:
- USD: `$123.45`
- EUR: `€123.45`
- JPY: `¥123`

Supports many currency codes including USD, EUR, GBP, JPY, CNY, and more.

### Format as Percentage
```scratch
(format [0.8547] as percentage with [1] decimals :: #59c059)
```
Converts a decimal number to a percentage with the specified number of decimal places.

Examples:
- `0.8547` with 1 decimal → `85.5%`
- `0.333` with 2 decimals → `33.30%`
- `1.5` with 0 decimals → `150%`

## Scientific Notation

### Convert to Exponential Notation
```scratch
(convert [1234.5678] to exponential notation with [2] decimals :: #59c059)
```
Converts a number to scientific notation with the specified number of decimal places.

Examples:
- `1234.5678` with 2 decimals → `1.23e+3`
- `0.00123` with 3 decimals → `1.230e-3`
- `1000000` with 1 decimal → `1.0e+6`

## Number Validation

### Check if Integer
```scratch
<is [5] an integer? :: #59c059>
```
Returns true if the number is an integer (whole number), false otherwise.

Examples:
- `5` → true
- `5.5` → false
- `0` → true

### Check if Finite
```scratch
<is [42] finite? :: #59c059>
```
Returns true if the number is finite (not infinity or -infinity), false otherwise.

Examples:
- `42` → true
- `Infinity` → false
- `-Infinity` → false

### Check if NaN
```scratch
<is [number] NaN? :: #59c059>
```
Returns true if the value is NaN (Not a Number), false otherwise.

Examples:
- `NaN` → true
- `42` → false
- `"hello"` → true (when converted to number)

## Number Manipulation

### Round to Multiple
```scratch
(round [127] to nearest [10] :: #59c059)
```
Rounds a number to the nearest multiple of the specified value.

Examples:
- `127` to nearest `10` → `130`
- `42` to nearest `5` → `40`
- `7.8` to nearest `2` → `8`

### Parse Number from Text
```scratch
(parse number from text [123.45] :: #59c059)
```
Converts a text string to a number. Returns an error message if the text cannot be converted.

Examples:
- `"123.45"` → `123.45`
- `"abc"` → `Error: Invalid number`
- `"1e3"` → `1000`

### Clamp Number
```scratch
(clamp [50] between [0] and [100] :: #59c059)
```
Restricts a number to stay within the specified minimum and maximum values.

Examples:
- `50` between `0` and `100` → `50`
- `150` between `0` and `100` → `100`
- `-10` between `0` and `100` → `0`

## Error Handling
It will mostly just go back to the default if something is invalid or doesn't seem to be right.

## Additional Notes

- The system locale is automatically detected from the user's browser settings
- Currency formatting uses standard international currency codes
- All number formatting follows international standards for maximum compatibility
