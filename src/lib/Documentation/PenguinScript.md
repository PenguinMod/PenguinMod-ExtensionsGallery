# PenguinScript
PenguinScript is a programming language designed to be used with PenguinMod. 
This document will explain the syntax, and the global functions.

## Syntax

This section will cover the syntax of PenguinScript.

### Basic values

#### Numbers

Any valid Scratch (or PenguinMod) number is a valid PenguinScript number.

Additionally, you can use a 0 followed by an x (for hexadecimal), o (for octa) and b (for binary) and then the digits.

#### Strings

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

#### Booleans

You can also use true or false (also called booleans) by typing in `true` or `false`.

#### Null
There is also a special value called `null`. Null represents a lack of a value.

### Local Variables

You can define variables that are only accessible inside the the script using a special syntax. Note that these variables are scoped.

`let`, then followed by an identifier (a piece of text with only letters, numbers, and underscores, however, an identifier cannot start with a number to avoid confusion)
then optionally followed by an equals sign and an expression (a fancy word for value).

Note that any special word like if, forever, let and other reserved words or keywords cannot be used as a variable name.

You can mutate this variable later on using identifier = value. 

To prevent mutation of the value stored inside the variable, you can use const instead of let (note that the optional equals sign and expression becomes mandatory).

Defining a variable is a statement, and statements do not yield values.

Note that all statements (except control flow and braces) require a semicolon at the end of them.

Defining a variable inside a place that expects a statement except for at the top level will error.

### Operations

Operators allow you to create complex expressions (complex values like x + y, x * y, x mod y)

You can use some operators from PenguinMod in PenguinScript, along with some new ones. (this list will state them in order of precedence, with the first being the lowest)

|Operator(s)|Example Usage|Notes|Associativty
|--------|-------------|-----|-----------|
| = | `x = y` | Sets an assignable value (an identifier or global identifier (we will explore later)) to a different value|Right-Left
| If/Else | `if x y else z` | If x is not falsy (null or false), return y, otherwise, if z is there, return z, else, return null.|Left-Right
| and | `x and y` | Returns the first operand that is falsy, and if none are, always return the second one.|Left-Right
| xor | `x xor y` | If the both operands are falsy, return the second one, if only one is truthy (not null or false) return that operand, if both are truthy return false.|Left-Right
| or | `x or y` | Returns the first operand that is truthy, and if both are false, always return the second one.|Left-Right
| < > == <= >= | `x < y` | All of these operators (except for ==) convert their operands to numbers. < is less than, > is greater than, == is exactly equals to, <= is less than or equal to, >= is greater than or equal to.|Left-Right
| + - | `x + y` | Converts both operands into numbers, and does the arithmetic (addition + or subtraction -). | Left-right
| * / % | `x * y` | Converts both operands into numbers, and does the arithmetic (multiplication *, division /, or mod %)|Left-right
| ^ | `x ^ y` | Converts both operands into numbers, and raises the first operand to the second. | Right-Left
| -> | `x -> prop` | x should be a struct, and prop can be an identifier or string (the value will be static). We will discuss this operator in detail later. | Left-Right
| in | `prop in x` | x should be a struct, and prop can be an identifier or string (the value will be static). We will discuss this operator in detail later. | N/A (prop in prop in x is invalid since it doesn't make sense)
| (arg1, arg2, arg3... argN) | `x(arg1, arg2, arg3... argN)` | Executes the function (we will discuss them later) on the left of the args list with the args list.|Left-Right
| not | `not x` | If the value is falsy, return true, otherwise, return false. | Right-Left
| - (unary version) | -x | Negates x. | Left-Right

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

### Try/Catch/Finally

Try/Catch/Finally allows you to deal with control flow and errors better.

The syntax is `try stmt` followed by `catch errorVar stmt`, `finally stmt`, or both.

If an error occurs in the `try stmt`, the error will be caught and the stmt in catch will be executed with `errorVar` set to the error object (we will discuss error objects later).

Regardless of if the try or catch executed correctly, returned, broke or continued in a loop, if finally is present, the statement inside `finally stmt` will be executed.

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

### Structs and chaining

Structs are a nice way of storing multiple pieces of data in one variable. You can create a struct "constructor" which creates structs.

Structs contain pieces of data called props (short for properties) that are effectively a variable contained in the struct. Like variables, props can be redefined (we will show how later).

To create a struct constructor, you can do the following:

`let structName = struct[prop1; prop2 = 5; "prop3" = fn(struct, value){struct.prop1 = value;}]`

It follows the format: `struct[IdentifierOrStaticString = value;...]`

The `= value` is optional, you do not need to include it, as all it does it create a default value when the struct is created. If you do not specify a default value, the default value will be null.

Functions created in structs are given a special treatment; they are considered methods. Methods are passed the struct as the first argument, and the passed arguments as the rest of the arguments. This means that the method can access the struct itself, allowing you to create reusable self-contained code.

To use the struct constructor, you can run it like any other function: `structName()` and it will create a struct.

You can artificially create a method using `global createMethod(struct, func)`.


To access a prop of a struct, you can use the chaining operator ->. Remember the IdentifierOrStaticString? That same "key" can be used to get the prop associated with that key.

If you defined a struct constructor as `struct[prop;prop2 = 5;]`, and constructed a struct, you would do `constructedStruct -> prop` or `constructedStruct -> prop2`.

You can reassign the value of any prop like this: `constructedStruct -> prop = something` and you can replace `something` with any value.

### Objects and Arrays.

There are two built-in struct constructors that provide functionality not possible using PenguinScript: `global Object` and `global Array`.

The Object struct constructor creates structs which allow you to dynamically define props on a struct. (note: they are not directly on the struct itself, but rather linked to the struct)

The Object struct defines special methods: get(key), set(key, value), has(key), delete(key), remove(key), and append(key, value).

Get returns the value associated with the key (or null), set sets the prop associated with the key to a value, and returns that value, has returns whether or not the prop was created before, delete deletes a prop, making it inexistent and returns whether or not the operation was successful.

Remove and append do the same as delete and set respectively but returns the struct itself, allowing you to do chaining like this: `global Object() -> append("someProp",5) -> append("someOtherProp", "some text")`

The Array struct constructor allows you to create a list (similar to Scratch lists, but not quite).

The Array struct defines special methods: get(key), set(key, value), has(key), delete(key), push(value), pop(), shift(), unshift(value) and a special prop: length.

Get, set, has, delete behave exactly the same as the ones in the Object struct, but have one difference: The key has to be a number, and the first key is 0 (the second key is 1, the third key is 2, and so on).

Push adds a value to the end of an Array. Pop deletes the value at the end of an Array, and returns it. Unshift and shift work like push and pop respectively but work with the first item in the listen.

The length prop stores the amount of items in the list. It is reassignable too (not recommended).

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

If you wish to exit your script early, you may use the global exit() function with an optional parameter, which is the actual return value of the script, if not provided, by default it will just be null.

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

getCostumeName(sprite)

getCostumeNumber(sprite)

getBackdropName()

getBackdropNumber()

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

### Clone-related globals

createClone(sprite) (returns the clone as well)

getCloneWithVar(mainSpriteOrMainSpriteName, variableName, expectedValue)

### Sensing-related globals

isTouchingSprite(sprite1, sprite2)

isTouchingMouse(sprite)

isTouchingEdge(sprite)

isTouchingXY(sprite, x, y)

isKeyDown(key)

isKeyHit(key)

and four global values (that are always updated)

mouseDown, mouseClicked, mouseX, and mouseY.

#### User defined globals

You can also define your own globals with `global GLOBALNAME = someValue;`

## End

Have fun using PenguinScript!

If you would like to know how PenguinScript is made, please visit the [repo](https://github.com/lego7set/PenguinScript/)
