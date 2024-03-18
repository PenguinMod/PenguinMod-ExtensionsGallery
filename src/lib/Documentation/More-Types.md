# More Types
More Types introduces 8 new types to PenguinMod: Object, Array, Set, Map, Symbol, Nothing, Function, and Class. 

These types can be used to do all sorts of things.

All of the new types, except for Nothing, are passed by reference, meaning that each new instance you create is different from every other instance.

More Types also introduces OOP (Object Oriented Programming) to PenguinMod.

NOTE: The square inputs cannot be displayed here, and we have turned them into circular inputs.
## Blocks
Here are the blocks are their usage:

### print to console
```scratch
print [Hello, World!] to console::#B300FF
```
This block outputs a value into the JavaScript console. You can open the console by pressing Ctrl + Shift + I (but don't type anything in if you don't know what you're doing).

More on this block later.

### set variable to
```scratch
set [my variable v] to [0]::#B300FF
```
This is the same as the regular set variable block.

### variable
```scratch
variable [my variable v]::#B300FF reporter
```
This is the same as the regular get variable block, except that you know that it may not be text, a number, true or false.

### new
```scratch
new [Object v]::#B300FF reporter
```
Creates an object, array, set, or map.

### typeof
```scratch
typeof [Insert Anything Here]::#B300FF reporter
```
Gets the type of the value provided, it can be:
string,
number,
boolean,
Object,
Array,
Set,
Map,
Symbol,
nothing,
or Function.
### get / set / remove Key
```scratch
get key [foo] of [Insert Object / Array / Map Here]::#B300FF reporter
```
```scratch
set key [foo] of [Insert Object / Array / Map Here] to [bar]::#B300FF
```
```scratch
remove key [foo] of [Insert Object / Array / Map Here]::#B300FF
```

Here is an analogy to help you understand keys and values.
You have a giant, infinite hotel where each room is identified by its key. 
When you are using "set" key, you effectively kick out whatever was inside previously, and then put in the "value", which is the thing you want to put inside the room.
When you are using "get" key, you are peeking inside the room to see what is inside the room, without affecting anything.
When you are using "remove" key, you are kicking out whatever was inside the room, and leaving it empty.

Objects, Arrays, and Maps use these keys and value
Value can be anything, but key can be different things depending on the type.

For objects, key can be a symbol or a string. 
For arrays, key must be a number.
For maps, key can be anything; key can even be the map itself.
(You can delete values from sets)

### add to end
```scratch
add [foo] to the end of [Insert Array / Set Here]::#B300FF
```
Sets are really just a list of unique values, and arrays are really just a list.
This block adds a new value and puts it at the end.

### exactly the same?
```scratch
is [0] and [-0] EXACTLY the same?::#B300FF boolean
```
It's the same as Scratch's =, except it is case-sensitive, and can tell the difference between 0 and -0.
You should use this to compare objects, arrays, sets, maps, and symbols.

### In?
```scratch
[foo] in [Insert Object / Array / Set / Map Here]?::#B300FF boolean
```
It checks if key is a non-empty room. For sets, it checks if the value was previously added.

### sizeof
```scratch
sizeof [Insert Object / Array / Set / Map Here]::#B300FF reporter
```
It checks how many values are actually there.

### for key value in
 ```scratch
for key [my variable v] value [my variable v] in [Insert Object / Array / Map / Set Here] {

}@loopArrow::#B300FF
```
It loops through the object / array / set / map. The variable after "key" is the variable which is set to the key. The variable after "value" is the variable which is set to the value.
For sets, key and value are the same.

There is also a variation of this block which uses the variables from the PenguinMod Temporary Variables extension.
### create a symbol and nothing
```scratch
create a symbol::#B300FF reporter
nothing::#B300FF reporter
```
The first one creates a symbol (which is a guaranteed-to-be-unique value that can be used as an object or map key), and the second one is the special value called nothing (which is the value you get when you peek inside an empty room)

### Anonymous Function / return
```scratch
Anonymous Function {
}::#B300FF cap

return []::#B300FF cap
```
Anonymous Function essentially dynamically creates a custom block, which can then be "called". Return allows you to immediately stop the execution of the blocks inside of the function, and "returns" a value.

### Call function

```scratch
call function [Insert Function Here]::#B300FF

call function [Insert Function Here] and get return value::#B300FF reporter
```
The first block allows you to execute the function, as the sprite it was created in, but ignores whatever value the function returned.

The seconds block does what the first block does, but it is an input, and it gets you the value that the function returned.

### Classes

```scratch
anonymous class {

}::#B300FF cap

anonymous class extends [Put in a class, or use the menu] {

}::#B300FF
```

Classes are similar to functions, as they can execute code, but are slightly different.

Classes are basically blueprints for new objects, that can "extend" each other and be "constructed"

Extending another class is basically taking a blueprint, and modifying it. When a class extends another class, it will have access to a "super" call, which is basically calling the class that it extends before the actual class contents.

However, in More Types, you have no choice but to let the super call run.

The code inside your class can use a "this" block which will be discussed later.

### This

```scratch
this::#B300FF reporter
```
This block allows you to access the object being constructed inside classes, and allow you to access the receiver of the method (discussed later) inside a method.

### Methods

```scratch
append method [Insert Function Here] with name [foo] to class or object [Insert Object / Array / Set / Map / Class Here]::#B300FF

call method with name [foo] on [Insert Object / Array / Set / Map Here]::#B300FF

call method with name [foo] on [Insert Object / Array / Set / Map Here] and get return value::#B300FF reporter
```

Methods are functions that are executed with a receiver (the object the method was added to), where the receiver can be access via the "this" block.

When you append a method to an object, it creates an invisible property that can be called.

When you append a method to a class, it will create an invisible property on all current and future instances of the class (and classes that extend that class) that can be called.

Like functions, methods can execute code and return a value.

### Construct
```scratch
Construct an instance of [Insert Class Here]::#B300FF
```
This block creates an instance of the class, and executes the class on the instance.
### instanceof
```scratch
is [Insert Anything Here] an instance of [Put in a class, or use the menu]::#B300FF boolean
```
It checks if something is an instance of a class.
## How to read the console

The console is incredibly complex, but this section will teach you how to read the console.

The first thing you need to do is find a textbox that says "Filter", and in this textbox you want to type in "MORE TYPES LOG:" without the quotations.

You should see all of the outputs now.

### Reading objects

This section is for when you encounter the following items:

\> PlainObject (Objects)

\> Array (Arrays)

\> Set (Sets)

\> Map (Maps)

\> MORETYPESCLASS (Instances of More Types classes)

For PlainObject, Array, Set, Map, and MORETYPESCLASS, you need to press the arrow, and there should be a piece of text called __values, open the arrow for that, and you should see the raw object.

The raw object is either an object ({...}), an array (\[...\] or Array(n)), a map (Map(n) {... => ...}), or a set (Set(n) {...}}).

For objects, the thingy before the colon (:) is the key, and the thingy after the colon (:) is the value.

For arrays, you need to expand the array, and you should see n: value, where n is the key (starts from 0) and value is the value.

For maps, you need to expand the map, and expand \[\[Entries]], and only look at the items after the colon (:), you should see key => value.

For sets, you need to expand the set, and expand \[\[Entires]], and only look at the items after the colon (:), those items are the values of inside the set.

### Other Items

You can ignore all of the other things that More Types outputs, as they do not provide much information.
