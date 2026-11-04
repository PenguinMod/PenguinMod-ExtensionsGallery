# Date Format

Date Format is an extension that lets you create, format, compare, and manipulate dates.

## Blocks

NOTE: The ticket shapes cannot be displayed here, they show up as circular shapes.

### Creation & Format

```scratch
current date::#59c074 reporter
```

Returns the current date.

---

```scratch
new date from [2025-03-12]::#59c074 reporter
```

Creates a date value from a string. Accepts most common date formats (e.g. `2025-03-12`, `March 12 2025`, `12/03/2025`). If the string cannot be parsed, it returns an Invalid date.

---

```scratch
format [date] as [dddd, MMMM D, YYYY]::#59c074 reporter
```

Formats a date using a custom pattern string. Tokens in the pattern are replaced with the corresponding date parts. Unrecognised characters aren't modified.

| Token  | Output example | Meaning                   |
| ------ | -------------- | ------------------------- |
| `YYYY` | `2025`         | 4-digit year              |
| `YY`   | `25`           | 2-digit year              |
| `MMMM` | `January`      | Full month name           |
| `MMM`  | `Jan`          | Short month name          |
| `MM`   | `01`           | Month, zero-padded        |
| `M`    | `1`            | Month, no padding         |
| `DD`   | `09`           | Day of month, zero-padded |
| `D`    | `9`            | Day of month, no padding  |
| `dddd` | `Wednesday`    | Full weekday name         |
| `ddd`  | `Wed`          | Short weekday name        |
| `HH`   | `14`           | Hour (24h), zero-padded   |
| `H`    | `14`           | Hour (24h), no padding    |
| `hh`   | `02`           | Hour (12h), zero-padded   |
| `h`    | `2`            | Hour (12h), no padding    |
| `mm`   | `05`           | Minutes, zero-padded      |
| `m`    | `5`            | Minutes, no padding       |
| `ss`   | `08`           | Seconds, zero-padded      |
| `s`    | `8`            | Seconds, no padding       |
| `A`    | `AM` / `PM`    | AM/PM indicator           |
| `a`    | `am` / `pm`    | am/pm indicator           |
| `SSS`  | `042`          | Milliseconds, zero-padded |
| `Z`    | `+02:00`       | UTC timezone offset       |

---

```scratch
format [date] as [short v] locale::#59c074 reporter
```

Formats a date using the active locale.

Examples:
- `short` looks like `Wed, May 20, 2026`
- `long` looks like `Wednesday, May 20, 2026`

---

```scratch
format [date] as [relative v]::#59c074 reporter
```

Formats a date using a special format type.

Examples:
- `relative` looks like `3 days ago` or `in 2 hours`
- `ISO string` looks like `2025-03-12T14:05:00.000Z`

---

### Comparisons

```scratch
is [date] valid?::#59c074 boolean
```

Checks if the date is a valid date value.

---

```scratch
is [date1] [after v] [date2]?::#59c074 boolean
```

Compares two dates based on the chosen operation.

---

```scratch
is [date] [weekend v]?::#59c074 boolean
```

Checks a specific property of a date.

- `weekend` = if the day is Saturday or Sunday
- `weekday` = if the day is Monday through Friday
- `today` = if the date is in the same day as today
- `yesterday` = if the date is in the same day as yesterday
- `tomorrow` = if the day is in the same day as tomorrow
- `first of month` = if the day of the month is 1
- `last of month` = if the day is the last day of its month
- `leap year` = if the year is a leap year

---

### Operators

```scratch
get [days v] between [date1] and [date2]::#59c074 reporter
```

Returns the absolute difference between two dates in the given unit.

---

```scratch
get [year v] of [date]::#59c074 reporter
```

Extracts a component from a date with local time.

| Part           | Returns                        |
| -------------- | ------------------------------ |
| `milliseconds` | 0-999                          |
| `seconds`      | 0-59                           |
| `minutes`      | 0-59                           |
| `hours`        | 0-23                           |
| `day (week)`   | 0 (Sunday) - 6 (Saturday)      |
| `day (month)`  | 1-31                           |
| `day (year)`   | 1-366                          |
| `month`        | 1-12                           |
| `year`         | e.g. `2025`                    |
| `time`         | Unix timestamp in milliseconds |

---

```scratch
set [year v] of [date] to [2026]::#59c074 reporter
```

Returns a new date with one component replaced by the given value.
Setting `weekday` shifts the date to the matching day within the same week.

---

```scratch
add [1] [days v] to [date]::#59c074 reporter
```

Returns a new date with the specified amount of time added. Use a negative number to subtract.

---

```scratch
round [date] to nearest [minutes v]::#59c074 reporter
```

Returns a new date rounded to the nearest given unit. For example, rounding `14:08` to `minutes` gives `14:08:00.000`, while rounding to `hours` gives `14:00` or `15:00` depending on which is closer.

---

### Locale

```scratch
set locale to [English (US) v]::#59c074
```

Sets the locale used when formatting dates with the *format as locale* block. The option `browser default` uses whatever language the user's browser is set to. This setting is saved with the project.

---

```scratch
current locale::#59c074 reporter
```

Returns the currently active locale code (e.g. `en-US`), or `default` if none has been set.
