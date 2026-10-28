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


TODO: finish

