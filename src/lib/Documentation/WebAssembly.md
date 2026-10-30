# WebAssembly Extension Docs

Written by AndrewGaming587

### Warning: You should have decent knowledge of both WebAssembly and JavaScript before using this extension. The JavaScript V2 extension is heavily recommended to be installed and unsandboxed. 

This WebAssembly Extension is intended to be an extension used to allow PenguinMod projects to use the power of WebAssembly (WASM) in a way nearly identical to how you would use WASM in JavaScript. Therefore, if you want to learn more about WebAssembly, it is highly recommended that you use [the WASM MDN docs](https://developer.mozilla.org/en-US/docs/WebAssembly) as this documentation is not to teach you about WASM, rather help explain the stuff that won't be in the MDN docs and also what everything would map to in terms of the blocks.

This documentation will not tell you how to make your own WebAssembly modules, you will need to learn that yourself, or use already existing modules.

# Dependencies

This extension requires jwklong's Arrays extension, dogeiscut's Objects extension, and my Array Buffers extension, all of which this extension will automatically add, and the JavaScript V2 extension unsandboxed, and also jwklong's Integers extension if you plan to deal with any BigInts that may be required or output by any of the blocks, are both suggested but not automatically added.

# Custom Types

This extension has a plethora of custom types, most of them correspond to different classes inside of the `WebAssembly` object in JS.

I categorize these types into 3 different types: Major, Imports & Exports, and Functions.

## Major types
Types that are related to the main flow of WebAssembly.


### Module
Basically it's the template used to make instances.

In software development terms, this can be described as the actual program executable itself, and each 'process' (WebAssembly instance, see below) is created from this executable module.

Corresponds to a `WebAssembly.Module`.

### Instance
Basically a use-ready "instance" of a WebAssembly module. Separate instances have separate memory, exports, imports, etc.

Can basically be described as what a process is in software development, where each process has access to its own resources and permissions (for example, a process running as the superuser has more permissions than one that's not, this can be described as providing a WebAssembly Instance with reflection tools to give it access to a lot more than the WebAssembly sandbox would normally allow).

Corresponds to a `WebAssembly.Instance`.


## Imports & Exports types
Types that are commonly exported by or imported into a WebAssembly instance on instantiation.

### Memory
You should probably know what memory is. But if you don't, it's basically where the program stores information like variables and objects that are intended to last longer than the scope of a function call, etc.

Corresponds to a `WebAssembly.Memory`.

### Table
Kinda hard to explain, see the [MDN `WebAssembly.Table` Docs](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Table)

The best way I can describe it is, WebAssembly has strict policies on what can be stored in WebAssembly memory. These 'tables' serve to allow storing of stuff that can't be stored in WebAssembly memory, namely externrefs (references to JavaScript objects) and funcrefs (references to functions). These tables can be read by both JavaScript and WebAssembly, and have an initial size but can be grown to increase the size (but you can't shrink it again once it's grown).

Corresponds to a `WebAssembly.Table`.

### Global
Basically a reference to a primitive value that WASM and JS can share and both use. Commonly exported by compilers to help JS figure out where code variables are in its memory, among other things.

Corresponds to a `WebAssembly.Global`.

## Function Types
Function-related types.

### Function Reference
A wrapper for a function.

Corresponds to any kind of function in JS.

Can be called using a block, imported into a WebAssembly Instance, or exported by a WebAssembly Instance.

Does not necessarily have to be a function from WebAssembly, can also wrap a JS function using the JavaScript extension and behaves how you'd expect. Also useful to bridge JavaScript and PenguinMod due to the fact that these wrappers can be run and can also wrap a JavaScript function.

Can also wrap a JSv2 function if JSv2 is loaded unsandboxed.

### Suspending Function
An experimental WASM feature. Only *fully* supported in Chromium-based browsers and newer Firefox versions.
Safari needs to be a Safari Technical Preview build.
Older versions of Firefox require it to be enabled in about:config.

Represents an import function that can return a promise, such as an async function. If a function that returns a promise is imported without wrapping it in this, the function will not behave correctly in WASM.

When a WASM function that calls a suspending function is used from outside WASM, it needs to be wrapped as a "promising function".

# Notes
Using JSV2 is heavily recommended for importing functions into WebAssembly instances.

This extension commonly throws errors because there is little to no error handling in the project in order to prioritize speed. If you're using this extension, you should be experienced enough to know how to use the try-catch block in PenguinMod.

**Using Emscripten to create WASM stuff to use with this extension is not recommended as it can be a pain to get it to work with this extension!**

# Blocks
Note: when the term "Array Buffer" is used, it refers to an array buffer from the Array Buffers extension, which gets automatically added along with the WebAssembly extension. JavaScript ArrayBuffers aren't allowed because the blocks expect the Array Buffer custom type to map it to a JS ArrayBuffer.
When the term "Object" is used, most of the time a JavaScript object _or_ a Objects extension object can be passed and it will work fine.
## Module Creation Blocks
```scratch
create new module [Array Buffer] :: #644fef reporter
create new module [Array Buffer] with compile options [Object] :: #644fef reporter
```
These blocks are equivalent to `WebAssembly.compile` in JavaScript and create a WebAssembly module from an Array Buffer.
The latter accepts an Object for the optional compile options argument for the `WebAssembly.compile` function.

## Instance Creation Blocks
```scratch
instantiate module [Module] :: #644fef reporter
instantiate module [Module] with imports object [Object] :: #644fef reporter
```
These blocks are equivalent to `WebAssembly.instantiate` and create an instance from a module. The latter allows you to specify an import object which allows you to pass things like functions to the webassembly module for it to use. The import object needs to be structured the same way `WebAssembly.instantiate` expects; an Object containing "namespace" keys (where namespace is any string) that have object values that contain the imports themselves, so Function References, Tables, Memory, etc. An example object would be like so:
```
{
  env: {
    print: (Function Reference)
  }
}
```

## Export Handling Blocks
```scratch
get export [string] of [Instance]:: reporter #644fef
```
Returns an export of a WebAssembly Instance, mapped to one of the extension's custom types.

```scratch
(::ring)get all export names of [Instance]::ring #644fef
get all exports of [Instance]::reporter #644fef
```
The former returns an Arrays extension array of all the exports' names exported by the WebAssembly instance provided.
The latter returns an Objects extension object equivalent to the exports object itself but with all the values mapped to the proper custom types.
## Function Blocks
```scratch
call function reference [Function Reference] with [Array]:: #644fef
call function reference [Function Reference] with [Array]:: reporter #644fef
```
These blocks allow you to call a Function Reference. Arguments are passed as an array. On the PenguinMod Port, there is an additional dual block with similar function, but it also has an expandable input instead of an array for arguments.
```scratch
call export [string] of [Instance] with [Array]:: #644fef
call export [string] of [Instance] with [Array]:: reporter #644fef
```
These blocks are short-hands for getting an export and immediately calling it.
## Memory
```scratch
create new memory with initial pages [number]:: reporter #644fef
create new memory with settings [Object]:: reporter #644fef
```
Creates a new WebAssembly Memory. Equivalent to the WebAssembly.Memory constructor. See the [MDN Docs](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Memory/Memory) for info on how to use these blocks.

```scratch
grow memory [Memory] by [integer] pages :: #644fef
```
Grows a Memory by a certain amount of pages. One page is 65536 bytes (64 KiB).

```scratch
(::ring)get attached array buffer of memory [Memory]::ring #644fef
```
Outputs the Array Buffer attached to the Memory. This Array Buffer is linked to the memory and any writes to the Array Buffer will write to the Memory and vice versa. If the Memory is grown, the Array Buffer will be detached and will become unusable, so be sure to implement error handling if you grow the memory while still using the array buffer instance.

## Tables
```scratch
(::ring)new [table type v] wasm table with default size [integer]::ring #644fef
(::ring)new [table type v] wasm table with default size [integer] and max size [integer]::ring #644fef
(::ring)new [table type v] wasm table with default size [integer] and default value [depends]::ring #644fef
(::ring)new [table type v] wasm table with default size [integer] max size [integer] and default value [depends]::ring #644fef
```

Creates a new WebAssembly Table. Table Type can be either: 
- "anyfunc"
- "externref"
Externref tables can contain anything, though it's good practice to only use them for JavaScript objects or strings, not primitive types, and WebAssembly instances will treat them as externref values when reading from the table.
Anyfunc tables can contain functions, and WebAssembly instances will treat them as funcref values when reading from the table.

```scratch
get item [integer] from wasm table [Table]:: reporter #644fef
set item [integer] in wasm table [Table] to [depends]:: #644fef
```

These blocks are for reading and writing to tables.

## Globals
```scratch
new mutable (wasm primitive v) with value [number]:: reporter #644fef
new immutable (wasm primitive v) with value [number]:: reporter #644fef
```

Create a WebAssembly Global. These are references to a wasm primitive value that can be mutable or immutable. They can be shared.


```scratch
value of wasm global [Global]:: reporter #644fef
set wasm global [Global] to [number]:: #644fef
```

Reading and writing to Globals. The set block will error if the Global is immutable.

## Misc
```scratch
console.log [anything]:: #644fef
```
Simply just JavaScript `console.log`.

```scratch
get JSV2 global function named [string]:: reporter #644fef
```
Only exists if the JavaScript V2 extension is unsandboxed.
Returns a javascript function corresponding to a function created with jsv2's function blocks. In the case of functions created with block code, the function will be async.

# JS Promises & JS Promise Integration
```scratch
\(JSPI) suspending \(async) function [Function Reference]:: reporter #644fef
\(JSPI) promising wasm \(async) function [Function Reference (WASM function only)]:: reporter #644fef
```
These blocks correspond to the features added by the JS Promise Integration proposal. These features aren't supported on all browsers, so it's recommended to find an alternative until these become globally supported. Thes blocks allow WASM to properly handle JS promises and async functions. Async functions or functions that return a promise must be wrapped using the former block, and WASM functions that call a suspending function created by the former must be passed into the latter or else calling the function will throw an error. A promising wasm function may return a promise. Handle these promises with the below blocks. Can be used to run block code from WASM

```scratch
wait for JS promise [JavaScript promise object]:: reporter #644fef
wait for JS promise [JavaScript promise object]:: #644fef
```
These are essentially equivalent to JavaScript `await`, just that instead of halting async code to wait for a promise, it yields the scratch thread until the promise resolves, and in the case of the reporter, returns the output.

# Debug & Additional Features
```scratch
set debug option (bindImportsToInstance v)  to <> :: #644fef
```

Sets a debug option or experimental feature boolean. Currently the only option is `bindImportsToInstance`.

`bindImportsToInstance` automatically binds all functions to the WebAssembly Instance custom type so that the `this` JS keyword refers to the WebAssembly Instance custom type instead of `window`. Can be useful if you need to access properties of the WebAssembly Instance from a function. Does not affect arrow functions (functions created using `(args) => { body }`), so for functions that use this feature, define them like `function(args) { body }`.



