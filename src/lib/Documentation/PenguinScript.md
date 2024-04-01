# PenguinScript
PenguinScript is a programming language designed to be used with PenguinMod. 
This document will explain the syntax, and the global functions.

## Syntax

This section will cover the syntax of PenguinScript.

### Basic values

You can use number digits to create a number.

`1234567890.1234567890` is a valid number.
`1e+10` is not a valid number sadly, but can you use a workaround, factor * 10 ^ exponent.

You can create "strings" (which are pieces of text) using string literals.
String literals are pieces of text wrapped inside double quotes.
`"this is some really, really cool text"` is a valid string.
You can also use "escape sequences" in strings, which are a letter (or symbol) that follows a backslash (this character: \\ ).
Escape sequences let you type characters that are inconvenient (or impossible) to type.
Here are the escape sequences:
|What to type| What you get                                                                                                                                                                   |
|-----------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| \\n        | A newline character                                                                                                                                               |
| \\f        | A form feed character                                                                                                                                             |
| \\r        | A carriage return character                                                                                                                                       |
| \\t        | A horizontal tabulator                                                                                                                                            |
| \\v        | A vertical tabulator                                                                                                                                              |
| \\b        | A backspace character (note: it doesn't behave like you expect)                                                                                                   |
| \\cX       | An ascii control character whose codepoint is the codepoint of X (which should be replaced by a letter) mod 32. (don't worry if you do not know what this means)  |
| \\xFF      | An ascii character, more specifically, from the two hexadecimal digits following \\x.                                                                             |
| \\uFFFF    | A unicode character, more specifically, from the four hexadecimal digits following \\u.                                                                           |
| \\UFFFFFF  | A unicode character, more specifically, from the six hexadecimal digits following \\U.                                                                            |
| \\s        | This emoji -> 💀 (skull emoji)                                                                                                                                     |
| \\m        | This emoji -> 🗿 (mo'ai emoji)                                                                                                                                     |
| \\z        | This emoji -> 🥶 (cold face emoji)                                                                                                                                  |
| \\l or \\T | This emoji -> 🐢 (turtle emoji)                                                                                                                                    |
| \\F        | This emoji -> 🔥 (fire emoji)                                                                                                                                      |
| \\S or \\a | This emoji -> ✨ (sparkles emoji)                                                                                                                                  |
| \\p        | This emoji -> 🐧 (penguin emoji)                                                                                                                                   |
| \\0        | The null character (\\x00)                                                                                                                                         |
| \\"        | A double quote character.                                                                                                                                         |
| \\\\       | A backslash character                                                                                                                                             |

You can also use true or false (also called booleans) by typing in `true` or `false`.
There is also a special value called `null`.

### Local Variables

You can define variables that are only accessible inside the the script using a special syntax. Note that these variables are scoped.

`let`, then followed by an identifier (a piece of text with only letters, numbers, and underscores, however, an identifier cannot start with a number to avoid confusion)
then optionally followed by an equals sign and an expression (a fancy word for value).

You can mutate this variable later on using identifier = value. 

To prevent mutation, you can use const instead of let (note that the optional equals sign and expression becomes mandatory).

Defining a variable is a statement; it is like this:

```scratch
Statement
```

Note that all statements (except control flow and braces) require a semicolon at the end of them.

### Operations

Operators allow you to create complex expressions (complex values like x + y, x * y, x mod y)

You can use some operators from PenguinMod in PenguinScript, along with some new ones. (this list will state them in order of precedence, with the first being the lowest)

|Operator(s)|Example Usage|Notes|Associativty
|--------|-------------|-----|-----------|
| = | `x = y` | Sets an assignable value (an identifier or global identifier (we will explore later)) to a different value|Right-Left
| and | `x and y` | Returns the first operand that is falsy (null or false), and if none are, always return the second one.|Left-Right
| xor | `x xor y` | If the both operands are falsy, return the second one, if only one is truthy (not null or false) return that operand, if both are truthy return false.|Left-Right
| or | `x or y` | Returns the first operand that is truthy, and if both are false, always return the second one.|Left-Right
| < > == <= >= | `x < y` | All of these operators (except for ==) convert their operands to numbers. < is less than, > is greater than, == is exactly equals to, <= is less than or equal to, >= is greater than or equal to.|Left-Right
| not | `not x` | If the value is falsy, return true, otherwise, return false. | Right-Left
| + - | `x + y` | Converts both operands into numbers, and does the arithmetic (addition + or subtraction -). | Left-right
| * / % | `x * y` | Converts both operands into numbers, and does the arithmetic (multiplication *, division /, or mod %)|Left-right
| ^ | `x ^ y` | Converts both operands into numbers, and raises the first operand to the second. | Right-Left
| (arg1, arg2, arg3... argN) | `x(arg1, arg2, arg3... argN)` | Executes the function (we will discuss them later) on the left of the args list with the args list.|Left-Right

### Control flow

There are special statements that can control the flow of your program (expr stands for expression, and stmt stands for statement):

`if expr stmt else if expr stmt... else stmt`

`while expr stmt`

`repeatUntil expr stmt`

`forever stmt`

The first one works as you expect, as it allows you conditionally execute things.

The second is repeat until not expr, and the third is repeat until expr, and the last one just executes the code forever. (these are loops)

Note that you cannot declare a variable without braces (these -> {stmt1; stmt2; stmt3; ... stmtN;}) when using these statements.

You can also break out of loops using the `break` keyword, and go to the next iteration of the loop using the `continue` keyword.

### Braces

Braces allow you to define a new scope, and also execute multiple statements where only one would be expected.

The syntax for braces are {stmt1; stmt2; stmt3; ... stmtN;}

### Functions

Functions are similar to custom blocks, as they can be used to create reusable code.

Unlike in PenguinMod, all functions are inline (which means that they aren't statements).

To create a function, you would do `fn`, followed by an optional identifier (which refers to the function from within the function), an parameter list which is (param1, param2, param3... paramN) where paramN can be replaced with an identifier and then a function body, which are statements inside curly braces.

### Return

In order to make the evaluate block return a value, you must return a value from not within any functions.

Return can also be used to make a function (or inline statements) return a value.

The syntax is `return` followed by a value, then followed by a semicolon.

### Inline

Inline allows you to execute statements from within an expression, kind of similar to a block with a similar name in controls expansion.

The syntax for inline is `inline`, then followed by a statement.

Inline is for really complicated expressions.

### Target

There is a special value called `target` and it contains the sprite that evaluated the code.

It isn't really useful on its own, but can be used with the global functions discussed below.

### Useful Globals

#### Random globals

You can use a global by typing `global`, hitting the space bar, and then typing in an identifier.

The first three globals that are useful are functions (print, warn, error) and they display text to the developer console (don't type anything into the console though)

Then, there are 5 really useful functions for casting between types (toString, toNumber, toBoolean, charFromCodePoint, charToCodePoint)

The first three convert the values like how JavaScript does.

The other two allow you to convert the first character of a string (first arg) into a unicode codepoint, and the second one allows you to convert a unicode codepoint back into a character.

There is a typeof function that can be used to tell the type of different values.

There is a function called getMath (takes in one arg), which returns something related to math.

Notable ones include random, sin, cos, and tan.

You can use the global join and concat functions to join two strings.

There is also a global function called getSprite that returns null, or a non-clone sprite with the name passed as the first arg.

There is also, also, a global function called isSprite that returns true if the value passed is a sprite, and false otherwise.

#### Motion globals

These globals allow you to move sprites around. (we're just going to do GLOBALNAME(argList) to speed things up since most of these functions are self-explanatory)

getX(sprite)

getY(sprite)

getDirection(sprite)

setX(sprite, x)

setY(sprite, y)

setXY(sprite, x, y)

changeX(sprite, x)

changeY(sprite, y)

changeXY(sprite, x, y)

moveSteps(sprite, steps, direction?) (? means optional)

moveStepsBack(sprite, steps, direction?)

moveUpSteps(sprite, steps, direction?)

moveDownSteps(sprite, steps, direction?)

turnLeft(sprite, direction)

turnRight(sprite, direction)

setDirection(sprite, direction)

degToRad(degrees) (converts a scratch direction into radians)

#### Looks globals

setCostume(sprite, indexOrName)

nextCostume(sprite)

previousCostume(sprite)

setBackdrop(indexOrName)

nextBackdrop()

previousBackdrop()

say(sprite, msg)

think(sprite, msg)

setSize(sprite, size)

setVisible(sprite, visible)

getXStretch(sprite)

getYStretch(sprite)

setXStretch(sprite, x)

setYStretch(sprite, y)

setXYStretch(sprite, x, y)

changeXStretch(sprite, x)

changeYStretch(sprite, y)

changeXYStretch(sprite, x, y)

getSize(sprite)

getVisible(sprite)

#### Variable-related globals

These globals allow you to interact with variables for a sprite or variables for all sprites

getVariableForSprite(sprite, variableName)

setVariableForSprite(sprite, variableName, newValue)

getVariableForAllSprites(variableName)

setVariableForAllSprites(variableName, newValue)

### Broadcast-related globals

broadcast(message)

broadcastToSprite(message, sprite)

#### User defined globals

You can also define your own globals with `global GLOBALNAME = someValue;`

## End

Have fun using PenguinScript!

If you would like to know how PenguinScript is made, please visit the [repo](https://github.com/lego7set/PenguinScript/)