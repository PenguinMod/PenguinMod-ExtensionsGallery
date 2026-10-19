# WebAssembly Extension Docs

Written by AndrewGaming587

### Warning: You should have decent knowledge of both WebAssembly and Javascript before using this extension. The Javascript V2 extension is heavily recommended to be installed and unsandboxed. 

This WebAssembly Extension is intended to be an extension used to allow PenguinMod projects to use the power of WebAssembly (WASM) in a way nearly identical to how you would use WASM in Javascript. Therefore, if you want to learn more about WebAssembly, it is highly recommended that you use [the WASM MDN docs](https://developer.mozilla.org/en-US/docs/WebAssembly) as this documentation is not to teach you about WASM, rather help explain the stuff that won't be in the MDN docs and also what everything would map to in terms of the blocks.

This documentation will not tell you how to make your own WebAssembly modules, you will need to learn that yourself, or use already existing modules.

# Dependencies

This extension requires jwklong's Arrays extension, dogeiscut's Objects extension, and my Array Buffers extension, all of which this extension will automatically add, and the Javascript V2 extension unsandboxed, and also jwklong's Integers extension if you plan to deal with any BigInts that may be required or output by any of the blocks, are both suggested but not automatically added.

# Custom Types

This extension has a plethora of custom types, most of them correspond to different classes inside of the `WebAssembly` object in JS.

I categorize these types into 3 different types: Major, Imports & Exports, and Functions.

## Major types
Types that are related to the main flow of WebAssembly.


### Module
Basically it's the template used to make instances.

Corresponds to a `WebAssembly.Module`.

### Instance
Basically a use-ready "instance" of a webassembly module. Separate instances have separate memory, exports, imports, etc.

Corresponds to a `WebAssembly.Instance`.


## Imports & Exports types
Types that are commonly exported by or imported into a WebAssembly instance on instantiation.

### Memory
You should probably know what memory is.

Corresponds to a `WebAssembly.Memory`.

### Table
Kinda hard to explain, see the [MDN `WebAssembly.Table` Docs](https://developer.mozilla.org/en-US/docs/WebAssembly/Reference/JavaScript_interface/Table)

Corresponds to a `WebAssembly.Table`.

### Global
Basically a reference to a value that WASM can use. Commonly exported by compilers to help JS figure out where code variables are, among other things.

Corresponds to a `WebAssembly.Global`

## Function Types
Function-related types.

### Function Reference
A wrapper for a function.

Corresponds to any kind of function in JS.
Can be called using a block, imported into a WebAssembly Instance, or exported by a WebAssembly Instance.

### Suspending Function
An experimental WASM feature. Only *fully* supported in Chromium-based browsers.
On Firefox an experimental flag needs to be on in about://flags
Safari needs to be a Safari Technical Preview build.

Represents an import function that can return a promise, such as an async function. If a function that returns a promise is imported without wrapping it in this, the function will not behave correctly in WASM.

When a WASM function that calls a suspending function is used from outside WASM, it needs to be wrapped as a "promising function".

# Notes
Using JSV2 is heavily recommended for importing functions into WebAssembly instances.

**Using emscripten to create wasm stuff to use with this extension is not recommended as it can be a pain to get it to work with this extension!**

# Blocks
TODO: Write this

