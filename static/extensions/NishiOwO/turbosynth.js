// Name: TurboSynth
// ID: nishiowoTurboSynth
// Description: Synthesizer that uses TurboSynth.
// By: NishiOwO
// License: BSD-3-Clause

// Repository is at https://github.com/NishiOwO/tw-turbosynth

(async function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("TurboSynth must be run unsandboxed");
  }

  let embedded = false;
  let TurboSynth, TurboSynthWASM, Module;
  let FileStream_New, FileStream_Destroy;
  let WaveSynth_New,
    WaveSynth_Note,
    WaveSynth_NoteOffAll,
    WaveSynth_SetBank,
    WaveSynth_SetProgram,
    WaveSynth_SetDrum,
    WaveSynth_ChangePitchWheel,
    WaveSynth_SetVolume,
    WaveSynth_RenderFloat,
    WaveSynth_Reset,
    WaveSynth_Destroy;
  let JZZip, AudioPlayer;
  let florestanZip;

  let synth = {};

  const argSlider =
    Scratch.ArgumentType[Scratch.extensions.isNitroBolt ? "SLIDER" : "NUMBER"];

  /* DO NOT REMOVE THE COMMENT BELOW!!! */
// This code implements the `-sMODULARIZE` settings by taking the generated
// JS program code (INNER_JS_CODE) and wrapping it in a factory function.

// Single threaded MINIMAL_RUNTIME programs do not need access to
// document.currentScript, so a simple export declaration is enough.
var TurboSynthWASM = (() => {
  // When MODULARIZE this JS may be executed later,
  // after document.currentScript is gone, so we save it.
  // In EXPORT_ES6 mode we can just use 'import.meta.url'.
  var _scriptName = globalThis.document?.currentScript?.src;
  return async function(moduleArg = {}) {
    var Module = moduleArg;
// include: shell.js
// include: minimum_runtime_check.js
(function() {
  // "30.0.0" -> 300000
  function humanReadableVersionToPacked(str) {
    str = str.split('-')[0]; // Remove any trailing part from e.g. "12.53.3-alpha"
    var vers = str.split('.').slice(0, 3);
    while(vers.length < 3) vers.push('00');
    vers = vers.map((n, i, arr) => n.padStart(2, '0'));
    return vers.join('');
  }
  // 300000 -> "30.0.0"
  var packedVersionToHumanReadable = n => [n / 10000 | 0, (n / 100 | 0) % 100, n % 100].join('.');

  var TARGET_NOT_SUPPORTED = 2147483647;

  // Note: We use a typeof check here instead of optional chaining using
  // globalThis because older browsers might not have globalThis defined.

  // We skip the node version checking when running on Bun/Deno since the node
  // version they report doesn't seem to be useful.
  if (typeof process !== 'undefined' && !process.versions?.bun && typeof Deno == "undefined") {
    var currentNodeVersion = process.versions?.node ? humanReadableVersionToPacked(process.versions.node) : TARGET_NOT_SUPPORTED;
    if (currentNodeVersion < 180300) {
      throw new Error(`This emscripten-generated code requires node v${ packedVersionToHumanReadable(180300) } (detected v${packedVersionToHumanReadable(currentNodeVersion)})`);
    }
  }

  var userAgent = typeof navigator !== 'undefined' && navigator.userAgent;
  if (!userAgent) {
    return;
  }

  var currentSafariVersion = userAgent.includes("Safari/") && !userAgent.includes("Chrome/") && userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/) ? humanReadableVersionToPacked(userAgent.match(/Version\/(\d+\.?\d*\.?\d*)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentSafariVersion < 150000) {
    throw new Error(`This emscripten-generated code requires Safari v${ packedVersionToHumanReadable(150000) } (detected v${currentSafariVersion})`);
  }

  var currentFirefoxVersion = userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Firefox\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentFirefoxVersion < 79) {
    throw new Error(`This emscripten-generated code requires Firefox v79 (detected v${currentFirefoxVersion})`);
  }

  var currentChromeVersion = userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/) ? parseFloat(userAgent.match(/Chrome\/(\d+(?:\.\d+)?)/)[1]) : TARGET_NOT_SUPPORTED;
  if (currentChromeVersion < 85) {
    throw new Error(`This emscripten-generated code requires Chrome v85 (detected v${currentChromeVersion})`);
  }
})();

// end include: minimum_runtime_check.js
// The Module object: Our interface to the outside world. We import
// and export values on it. There are various ways Module can be used:
// 1. Not defined. We create it here
// 2. A function parameter, function(moduleArg) => Promise<Module>
// 3. pre-run appended it, var Module = {}; ..generated code..
// 4. External script tag defines var Module.
// We need to check if Module already exists (e.g. case 3 above).
// Substitution will be replaced with actual code on later stage of the build,
// this way Closure Compiler will not mangle it (e.g. case 4. above).
// Note that if you want to run closure, and also to use Module
// after the generated code, you will need to define   var Module = {};
// before the code. Then that object will be used in the code, and you
// can continue to use Module afterwards as well.

// Determine the runtime environment we are in. You can customize this by
// setting the ENVIRONMENT setting at compile time (see settings.js).

// Attempt to auto-detect the environment
var ENVIRONMENT_IS_WEB = !!globalThis.window;
var ENVIRONMENT_IS_WORKER = !!globalThis.WorkerGlobalScope;
// N.b. Electron.js environment is simultaneously a NODE-environment, but
// also a web environment.
var ENVIRONMENT_IS_NODE = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
var ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;

// --pre-jses are emitted after the Module integration code, so that they can
// refer to Module (if they choose; they can also define Module)


var programArgs = [];
var thisProgram = './this.program';
var quit_ = (status, toThrow) => {
  throw toThrow;
};

if (typeof __filename != 'undefined') { // Node
  _scriptName = __filename;
} else
if (ENVIRONMENT_IS_WORKER) {
  _scriptName = self.location.href;
}

// `/` should be present at the end if `scriptDirectory` is not empty
var scriptDirectory = '';
function locateFile(path) {
  if (Module['locateFile']) {
    return Module['locateFile'](path, scriptDirectory);
  }
  return scriptDirectory + path;
}

// Hooks that are implemented differently in different runtime environments.
var readAsync, readBinary;

if (ENVIRONMENT_IS_NODE) {
  const isNode = globalThis.process?.versions?.node && globalThis.process?.type != 'renderer';
  if (!isNode) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  // These modules will usually be used on Node.js. Load them eagerly to avoid
  // the complexity of lazy-loading.
  var fs = require('node:fs');

  scriptDirectory = __dirname + '/';

// include: node_shell_read.js
readBinary = (filename) => {
  // We need to re-wrap `file://` strings to URLs.
  filename = isFileURI(filename) ? new URL(filename) : filename;
  var ret = fs.readFileSync(filename);
  assert(Buffer.isBuffer(ret));
  return ret;
};

readAsync = async (filename, binary = true) => {
  // See the comment in the `readBinary` function.
  filename = isFileURI(filename) ? new URL(filename) : filename;
  var ret = fs.readFileSync(filename, binary ? undefined : 'utf8');
  assert(binary ? Buffer.isBuffer(ret) : typeof ret == 'string');
  return ret;
};
// end include: node_shell_read.js
  if (process.argv.length > 1) {
    thisProgram = process.argv[1].replace(/\\/g, '/');
  }

  programArgs = process.argv.slice(2);

  quit_ = (status, toThrow) => {
    process.exitCode = status;
    throw toThrow;
  };

} else
if (ENVIRONMENT_IS_SHELL) {

} else

// Note that this includes Node.js workers when relevant (pthreads is enabled).
// Node.js workers are detected as a combination of ENVIRONMENT_IS_WORKER and
// ENVIRONMENT_IS_NODE.
if (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) {
  try {
    scriptDirectory = new URL('.', _scriptName).href; // includes trailing slash
  } catch {
    // Must be a `blob:` or `data:` URL (e.g. `blob:http://site.com/etc/etc`), we cannot
    // infer anything from them.
  }

  if (!(globalThis.window || globalThis.WorkerGlobalScope)) throw new Error('not compiled for this environment (did you build to HTML and try to run it not on the web, or set ENVIRONMENT to something - like node - and run it someplace else - like on the web?)');

  {
// include: web_or_worker_shell_read.js
if (ENVIRONMENT_IS_WORKER) {
    readBinary = (url) => {
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, false);
      xhr.responseType = 'arraybuffer';
      xhr.send(null);
      return new Uint8Array(/** @type{!ArrayBuffer} */(xhr.response));
    };
  }

  readAsync = async (url) => {
    // Fetch has some additional restrictions over XHR, like it can't be used on a file:// url.
    // See https://github.com/github/fetch/pull/92#issuecomment-140665932
    // Cordova or Electron apps are typically loaded from a file:// url.
    // So use XHR on webview if URL is a file URL.
    if (isFileURI(url)) {
      return new Promise((resolve, reject) => {
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url, true);
        xhr.responseType = 'arraybuffer';
        xhr.onload = () => {
          if (xhr.status == 200 || (xhr.status == 0 && xhr.response)) { // file URLs can return 0
            resolve(xhr.response);
            return;
          }
          reject(xhr.status);
        };
        xhr.onerror = reject;
        xhr.send(null);
      });
    }
    var response = await fetch(url, { credentials: 'same-origin' });
    if (response.ok) {
      return response.arrayBuffer();
    }
    throw new Error(response.status + ' : ' + response.url);
  };
// end include: web_or_worker_shell_read.js
  }
} else
{
  throw new Error('environment detection error');
}

var out = console.log.bind(console);
var err = console.error.bind(console);

var IDBFS = 'IDBFS is no longer included by default; build with -lidbfs.js';
var PROXYFS = 'PROXYFS is no longer included by default; build with -lproxyfs.js';
var WORKERFS = 'WORKERFS is no longer included by default; build with -lworkerfs.js';
var FETCHFS = 'FETCHFS is no longer included by default; build with -lfetchfs.js';
var ICASEFS = 'ICASEFS is no longer included by default; build with -licasefs.js';
var JSFILEFS = 'JSFILEFS is no longer included by default; build with -ljsfilefs.js';
var OPFS = 'OPFS is no longer included by default; build with -lopfs.js';

var NODEFS = 'NODEFS is no longer included by default; build with -lnodefs.js';

// perform assertions in shell.js after we set up out() and err(), as otherwise
// if an assertion fails it cannot print the message

assert(!ENVIRONMENT_IS_SHELL, 'shell environment detected but not enabled at build time (add `shell` to `-sENVIRONMENT` to enable)');

// end include: shell.js

// include: preamble.js
// === Preamble library stuff ===

// Documentation for the public APIs defined in this file must be updated in:
//    site/source/docs/api_reference/preamble.js.rst
// A prebuilt local version of the documentation is available at:
//    site/build/text/docs/api_reference/preamble.js.txt
// You can also build docs locally as HTML or other formats in site/
// An online HTML version (which may be of a different version of Emscripten)
//    is up at http://kripken.github.io/emscripten-site/docs/api_reference/preamble.js.html

var wasmBinary;

if (!globalThis.WebAssembly) {
  err('no native wasm support detected');
}

// Wasm globals

//========================================
// Runtime essentials
//========================================

// whether we are quitting the application. no code should run after this.
// set in exit() and abort()
var ABORT = false;

// set by exit() and abort().  Passed to 'onExit' handler.
// NOTE: This is also used as the process return code in shell environments
// but only when noExitRuntime is false.
var EXITSTATUS;

// In STRICT mode, we only define assert() when ASSERTIONS is set.  i.e. we
// don't define it at all in release modes.  This matches the behaviour of
// MINIMAL_RUNTIME.
// TODO(sbc): Make this the default even without STRICT enabled.
/** @type {function(*, string=)} */
function assert(condition, text) {
  if (!condition) {
    abort('Assertion failed' + (text ? ': ' + text : ''));
  }
}

// We used to include malloc/free by default in the past. Show a helpful error in
// builds with assertions.

/**
 * Indicates whether filename is delivered via file protocol (as opposed to http/https)
 * @noinline
 */
var isFileURI = (filename) => filename.startsWith('file://');

// include: runtime_common.js
// include: runtime_exceptions.js
// Base Emscripten EH error class
class EmscriptenEH {}

class EmscriptenSjLj extends EmscriptenEH {}

// end include: runtime_exceptions.js
// include: runtime_debug.js
var runtimeDebug = true; // Switch to false at runtime to disable logging at the right times

// Used by XXXXX_DEBUG settings to output debug messages.
function dbg(...args) {
  if (!runtimeDebug && typeof runtimeDebug != 'undefined') return;
  // TODO(sbc): Make this configurable somehow.  Its not always convenient for
  // logging to show up as warnings.
  console.warn(...args);
}

// Endianness check
(() => {
  var h16 = new Int16Array(1);
  var h8 = new Int8Array(h16.buffer);
  h16[0] = 0x6373;
  if (h8[0] !== 0x73 || h8[1] !== 0x63) abort('Runtime error: expected the system to be little-endian! (Run with -sSUPPORT_BIG_ENDIAN to bypass)');
})();

function consumedModuleProp(prop) {
  var value = Module[prop];
  var msg = `Attempt to modify \`Module.${prop}\` after it has already been processed.  This can happen, for example, when code is injected via '--post-js' rather than '--pre-js'`;
  if (Array.isArray(value)) {
    value = new Proxy(value, {
      set(target, key, val) {
        abort(msg);
        return false;
      },
      defineProperty(target, key, descriptor) {
        abort(msg);
        return false;
      },
      deleteProperty(target, key) {
        abort(msg);
        return false;
      }
    });
  }
  Object.defineProperty(Module, prop, {
    configurable: true,
    get() { return value; },
    set() {
      abort(msg);
    }
  });
}

function makeInvalidEarlyAccess(name) {
  return () => assert(false, `call to '${name}' via reference taken before Wasm module initialization`);

}

function ignoredModuleProp(prop) {
  if (Object.getOwnPropertyDescriptor(Module, prop)) {
    abort(`\`Module.${prop}\` was supplied but \`${prop}\` not included in INCOMING_MODULE_JS_API`);
  }
}

// forcing the filesystem exports a few things by default
function isExportedByForceFilesystem(name) {
  return name === 'FS_createPath' ||
         name === 'FS_createDataFile' ||
         name === 'FS_createPreloadedFile' ||
         name === 'FS_preloadFile' ||
         name === 'FS_unlink' ||
         name === 'addRunDependency' ||
         // The old FS has some functionality that WasmFS lacks.
         name === 'FS_createLazyFile' ||
         name === 'FS_createDevice' ||
         name === 'removeRunDependency';
}

function missingLibrarySymbol(sym) {

  // Any symbol that is not included from the JS library is also (by definition)
  // not exported on the Module object.
  unexportedRuntimeSymbol(sym);
}

function unexportedRuntimeSymbol(sym) {
  if (!Object.getOwnPropertyDescriptor(Module, sym)) {
    Object.defineProperty(Module, sym, {
      configurable: true,
      get() {
        var msg = `'${sym}' was not exported. add it to EXPORTED_RUNTIME_METHODS (see the Emscripten FAQ)`;
        if (isExportedByForceFilesystem(sym)) {
          msg += '. Alternatively, forcing filesystem support (-sFORCE_FILESYSTEM) can export this for you';
        }
        abort(msg);
      },
    });
  }
}

// end include: runtime_debug.js
// include: runtime_stack_check.js
const stackCookie1 = 0x02135467;
const stackCookie2 = 0x89BACDFE;

// Initializes the stack cookie. Called at the startup of main and at the startup of each thread in pthreads mode.
function writeStackCookie() {
  var max = _emscripten_stack_get_end();
  assert((max & 3) == 0);
  // If the stack ends at address zero we write our cookies 4 bytes into the
  // stack.  This prevents interference with SAFE_HEAP and ASAN which also
  // monitor writes to address zero.
  if (max == 0) {
    max += 4;
  }
  // The stack grow downwards towards _emscripten_stack_get_end.
  // We write cookies to the final two words in the stack and detect if they are
  // ever overwritten.
  HEAPU32[((max)>>2)] = stackCookie1;
  HEAPU32[(((max)+(4))>>2)] = stackCookie2;
  // Also test the global address 0 for integrity.
  HEAPU32[((0)>>2)] = 1668509029;
}

function u32ToHexString(num) {
  return '0x' + (num >>> 0).toString(16).padStart(8, '0');
}

function checkStackCookie() {
  if (ABORT) return;
  var max = _emscripten_stack_get_end();
  // See writeStackCookie().
  if (max == 0) {
    max += 4;
  }
  var val1 = HEAPU32[((max)>>2)];
  var val2 = HEAPU32[(((max)+(4))>>2)];
  if (val1 != stackCookie1 || val2 != stackCookie2) {
    abort(`Stack overflow! Stack cookie has been overwritten at ${ptrToString(max)}, expected hex dwords ${u32ToHexString(stackCookie2)} and ${u32ToHexString(stackCookie1)}, but received ${u32ToHexString(val2)} ${u32ToHexString(val1)}`);
  }
  // Also test the global address 0 for integrity.
  if (HEAPU32[((0)>>2)] != 0x63736d65 /* 'emsc' */) {
    abort('Runtime error: The application has corrupted its heap memory area (address zero)!');
  }
}
// end include: runtime_stack_check.js
// Memory management

var runtimeInitialized = false;



// When ALLOW_MEMORY_GROWTH is enabled, the conversion from Wasm
// memory to ArrayBuffer requires some additional logic.
function getMemoryBuffer() {
  return wasmMemory.buffer;
}

function updateMemoryViews() {
  // If we already have a heap that is resizeable/growable buffer we don't
  // need to do anything in updateMemoryViews.
  if (HEAP8?.buffer?.resizable) return;
  var b = getMemoryBuffer();
  HEAP8 = new Int8Array(b);
  HEAP16 = new Int16Array(b);
  HEAPU8 = new Uint8Array(b);
  HEAPU16 = new Uint16Array(b);
  HEAP32 = new Int32Array(b);
  HEAPU32 = new Uint32Array(b);
  Module['HEAPF32'] = HEAPF32 = new Float32Array(b);
  HEAPF64 = new Float64Array(b);
  HEAP64 = new BigInt64Array(b);
  HEAPU64 = new BigUint64Array(b);
}

// include: memoryprofiler.js
// end include: memoryprofiler.js
// end include: runtime_common.js
assert(globalThis.Int32Array && globalThis.Float64Array && Int32Array.prototype.subarray && Int32Array.prototype.set,
       'JS engine does not provide full typed array support');

function preRun() {
  var preRun = Module['preRun'];
  if (preRun) {
    if (typeof preRun == 'function') preRun = [preRun];
    onPreRuns.push(...preRun);
  }
  consumedModuleProp('preRun');
  // Begin ATPRERUNS hooks
  callRuntimeCallbacks(onPreRuns);
  // End ATPRERUNS hooks
}

function initRuntime() {
  assert(!runtimeInitialized);
  runtimeInitialized = true;

  checkStackCookie();

  // Begin ATINITS hooks
  if (!Module['noFSInit'] && !FS.initialized) FS.init();
TTY.init();
  // End ATINITS hooks

  wasmExports['__wasm_call_ctors']();

  // Begin ATPOSTCTORS hooks
  FS.ignorePermissions = false;
  // End ATPOSTCTORS hooks

  checkStackCookie();
}

function postRun() {
  checkStackCookie();

  var postRun = Module['postRun'];
  if (postRun) {
    if (typeof postRun == 'function') postRun = [postRun];
    onPostRuns.push(...postRun);
  }
  consumedModuleProp('postRun');

  // Begin ATPOSTRUNS hooks
  callRuntimeCallbacks(onPostRuns);
  // End ATPOSTRUNS hooks
}

/**
 * @param {string|number=} what
 */
function abort(what) {
  Module['onAbort']?.(what);

  what = `Aborted(${what})`;
  // TODO(sbc): Should we remove printing and leave it up to whoever
  // catches the exception?
  err(what);

  ABORT = true;

  // Use a wasm runtime error, because a JS error might be seen as a foreign
  // exception, which means we'd run destructors on it. We need the error to
  // simply make the program stop.
  // FIXME This approach does not work in Wasm EH because it currently does not assume
  // all RuntimeErrors are from traps; it decides whether a RuntimeError is from
  // a trap or not based on a hidden field within the object. So at the moment
  // we don't have a way of throwing a wasm trap from JS. TODO Make a JS API that
  // allows this in the wasm spec.

  // Suppress closure compiler warning here. Closure compiler's builtin extern
  // definition for WebAssembly.RuntimeError claims it takes no arguments even
  // though it can.
  // TODO(https://github.com/google/closure-compiler/pull/3913): Remove if/when upstream closure gets fixed.
  /** @suppress {checkTypes} */
  var e = new WebAssembly.RuntimeError(what);

  // Throw the error whether or not MODULARIZE is set because abort is used
  // in code paths apart from instantiation where an exception is expected
  // to be thrown when abort is called.
  throw e;
}

function createExportWrapper(name, func, nargs) {
  assert(func);
  return (...args) => {
    assert(runtimeInitialized, `native function \`${name}\` called before runtime initialization`);
    // Only assert for too many arguments. Too few can be valid since the missing arguments will be zero filled.
    assert(args.length <= nargs, `native function \`${name}\` called with ${args.length} args but expects ${nargs}`);
    return func(...args);
  };
}

var wasmBinaryFile;

function findWasmBinary() {
  return base64Decode('AGFzbQEAAAABpAEcYAN/f38Bf2ADf35/AX5gAX8Bf2ABfwBgAn9/AX9gAX8BfmACf34AYAJ/fwBgAABgBH9/f38Bf2AEf35/fwF/YAABf2ADf35/AX9gAXwBfGACf3wBfGABfwF8YAJ8fAF8YAF8AX9gAX4Bf2ACfn8BfGADfHx/AXxgA3x+fgF8YAF8AGAFf39/f38Bf2AEf39/fwBgA39/fwBgA39/fABgAn98AAL5AQkDZW52FmVtc2NyaXB0ZW5fcmVzaXplX2hlYXAAAgNlbnYJX2Fib3J0X2pzAAgWd2FzaV9zbmFwc2hvdF9wcmV2aWV3MQhmZF9jbG9zZQACFndhc2lfc25hcHNob3RfcHJldmlldzEIZmRfd3JpdGUACRZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3NlZWsACgNlbnYQX19zeXNjYWxsX29wZW5hdAAJA2VudhFfX3N5c2NhbGxfZmNudGw2NAAAA2Vudg9fX3N5c2NhbGxfaW9jdGwAABZ3YXNpX3NuYXBzaG90X3ByZXZpZXcxB2ZkX3JlYWQACQODAYEBCAsLAggAAAACAgIAAQEICwsLAwMLCAIAAwQEBAcCAgIEBAQABAQEAgIAAgQEAgkMDAAFBQICAwIEAAYFAwMEAA0ODQ8PDRAREhINExQVFgQXAwMEGAADAgICGBgCBxkZGRgZGhoZGRkZBAIDAgIbBwICBAQHBAQCGRkDAwQCAwILBAQBcAALBQcBAZECgIACBhMDfwFBgIDAAAt/AUEAC38BQQALB8wHLwZtZW1vcnkCABFfX3dhc21fY2FsbF9jdG9ycwAJDEVhc3lNaWRpX05ldwB7DUVhc3lNaWRpX05ldzIAfBVFYXN5TWlkaV9NaWRpQ2FsbGJhY2sAfQ1FYXN5TWlkaV9Mb2FkAH4ORWFzeU1pZGlfTG9hZDIAfxNFYXN5TWlkaV9Jc0ZpbmlzaGVkAIABFEVhc3lNaWRpX1JlbmRlclNob3J0AIEBFEVhc3lNaWRpX1JlbmRlckZsb2F0AIIBDkVhc3lNaWRpX1Jlc2V0AIMBEEVhc3lNaWRpX0Rlc3Ryb3kAhAEORmlsZVN0cmVhbV9OZXcAQRJGaWxlU3RyZWFtX0Rlc3Ryb3kARg5NaWRpU3RyZWFtX05ldwByEk1pZGlTdHJlYW1fRGVzdHJveQB0Ek1pZGlTdHJlYW1fQWR2YW5jZQB3DVdhdmVTeW50aF9OZXcAWA5XYXZlU3ludGhfTG9hZABZEVdhdmVTeW50aF9EZXN0cm95AFoPV2F2ZVN5bnRoX1Jlc2V0AFsQV2F2ZVN5bnRoX1VubG9hZABdDldhdmVTeW50aF9Ob3RlAGQUV2F2ZVN5bnRoX05vdGVPZmZBbGwAZhFXYXZlU3ludGhfU2V0QmFuawBnFFdhdmVTeW50aF9TZXRCYW5rTVNCAGgUV2F2ZVN5bnRoX1NldEJhbmtMU0IAaRRXYXZlU3ludGhfU2V0UHJvZ3JhbQBqEVdhdmVTeW50aF9TZXREcnVtAGsaV2F2ZVN5bnRoX0NoYW5nZVBpdGNoV2hlZWwAbBNXYXZlU3ludGhfU2V0Vm9sdW1lAG0WV2F2ZVN5bnRoX1NldFZvbHVtZU1TQgBuFldhdmVTeW50aF9TZXRWb2x1bWVMU0IAbxVXYXZlU3ludGhfUmVuZGVyU2hvcnQAcBVXYXZlU3ludGhfUmVuZGVyRmxvYXQAcQZmZmx1c2gAPghzdHJlcnJvcgCGAQZtYWxsb2MAHwRmcmVlACEVZW1zY3JpcHRlbl9zdGFja19pbml0ABcZZW1zY3JpcHRlbl9zdGFja19nZXRfZnJlZQAYGWVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2Jhc2UAGRhlbXNjcmlwdGVuX3N0YWNrX2dldF9lbmQAGhlfZW1zY3JpcHRlbl9zdGFja19yZXN0b3JlAIcBF19lbXNjcmlwdGVuX3N0YWNrX2FsbG9jAIgBHGVtc2NyaXB0ZW5fc3RhY2tfZ2V0X2N1cnJlbnQAiQEZX19pbmRpcmVjdF9mdW5jdGlvbl90YWJsZQEACRABAEEBCwoTFBYyQUJDREV9CvmqAoEBBAAQFwsHAD8AQRB0CwgAQYzJwIAAC2QCAX4BfwJAAkAgAK1CB3xC+P///x+DQQAoAvDHwIAAIgCtfCIBQv////8PVg0AEIqAgIAAIAGnIgJPDQEgAhCAgICAAA0BCxCLgICAAEEwNgIAQX8PC0EAIAI2AvDHwIAAIAALCQAQgYCAgAAAC/ICAgN/AX4CQCACRQ0AIAAgAToAACAAIAJqIgNBf2ogAToAACACQQNJDQAgACABOgACIAAgAToAASADQX1qIAE6AAAgA0F+aiABOgAAIAJBB0kNACAAIAE6AAMgA0F8aiABOgAAIAJBCUkNACAAQQAgAGtBA3EiBGoiAyABQf8BcUGBgoQIbCIBNgIAIAMgAiAEa0F8cSIEaiICQXxqIAE2AgAgBEEJSQ0AIAMgATYCCCADIAE2AgQgAkF4aiABNgIAIAJBdGogATYCACAEQRlJDQAgAyABNgIYIAMgATYCFCADIAE2AhAgAyABNgIMIAJBcGogATYCACACQWxqIAE2AgAgAkFoaiABNgIAIAJBZGogATYCACAEIANBBHFBGHIiBWsiAkEgSQ0AIAGtQoGAgIAQfiEGIAMgBWohAQNAIAEgBjcDGCABIAY3AxAgASAGNwMIIAEgBjcDACABQSBqIQEgAkFgaiICQR9LDQALCyAACxMAIAIEQCAAIAEgAvwKAAALIAALkwQBA38CQCACQYAESQ0AIAAgASACEI+AgIAADwsgACACaiEDAkACQCABIABzQQNxDQACQAJAIABBA3ENACAAIQIMAQsCQCACDQAgACECDAELIAAhAgNAIAIgAS0AADoAACABQQFqIQEgAkEBaiICQQNxRQ0BIAIgA0kNAAsLIANBfHEhBAJAIANBwABJDQAgAiAEQUBqIgVLDQADQCACIAEoAgA2AgAgAiABKAIENgIEIAIgASgCCDYCCCACIAEoAgw2AgwgAiABKAIQNgIQIAIgASgCFDYCFCACIAEoAhg2AhggAiABKAIcNgIcIAIgASgCIDYCICACIAEoAiQ2AiQgAiABKAIoNgIoIAIgASgCLDYCLCACIAEoAjA2AjAgAiABKAI0NgI0IAIgASgCODYCOCACIAEoAjw2AjwgAUHAAGohASACQcAAaiICIAVNDQALCyACIARPDQEDQCACIAEoAgA2AgAgAUEEaiEBIAJBBGoiAiAESQ0ADAILCwJAIANBBE8NACAAIQIMAQsCQCACQQRPDQAgACECDAELIANBfGohBCAAIQIDQCACIAEtAAA6AAAgAiABLQABOgABIAIgAS0AAjoAAiACIAEtAAM6AAMgAUEEaiEBIAJBBGoiAiAETQ0ACwsCQCACIANPDQADQCACIAEtAAA6AAAgAUEBaiEBIAJBAWoiAiADRw0ACwsgAAsZAAJAIAANAEEADwsQi4CAgAAgADYCAEF/CwQAIAALGQAgACgCPBCSgICAABCC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ACAAIAAoAiwiBDYCBCAAIAQgBSAGa2o2AggCQCAAKAIwRQ0AIAAgBEEBajYCBCABIAJqQX9qIAQtAAA6AAALIAIhBAsgA0EgaiSAgICAACAECzQBAn8gABCdgICAACIBKAIAIgI2AjgCQCACRQ0AIAIgADYCNAsgASAANgIAEJ6AgIAAIAALhAMBAn8jgICAgABBIGsiAiSAgICAAAJAAkACQAJAQaOAwIAAIAEsAAAQr4CAgAANABCLgICAAEEcNgIADAELQZgJEJ+AgIAAIgMNAQtBACEDDAELIANBAEGQARCOgICAABoCQCABQSsQr4CAgAANACADQQhBBCABLQAAQfIARhs2AgALAkACQCABLQAAQeEARg0AIAMoAgAhAQwBCwJAIABBA0EAEIaAgIAAIgFBgAhxDQAgAiABQYAIcjYCECAAQQQgAkEQahCGgICAABoLIAMgAygCAEGAAXIiATYCAAsgA0F/NgJQIANBgAg2AjAgAyAANgI8IAMgA0GYAWo2AiwCQCABQQhxDQAgAiACQRhqNgIAIABBk6gBIAIQh4CAgAANACADQQo2AlALIANBg4CAgAA2AiggA0GCgICAADYCJCADQYSAgIAANgIgIANBgYCAgAA2AgwCQEEALQClycCAAA0AIANBfzYCTAsgAxCzgICAACEDCyACQSBqJICAgIAAIAMLnQEBA38jgICAgABBEGsiAiSAgICAAAJAAkACQEGjgMCAACABLAAAEK+AgIAADQAQi4CAgABBHDYCAAwBCyABELCAgIAAIQMgAkG2AzYCAEEAIQRBnH8gACADQYCAAnIgAhCFgICAABCxgICAACIAQQBIDQEgACABELSAgIAAIgQNASAAEIKAgIAAGgtBACEECyACQRBqJICAgIAAIAQLiQEBAn8gACAAKAJIIgFBf2ogAXI2AkgCQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBGAgICAAICAgIAAGgsgAEEANgIcIABCADcDEAJAIAAoAgAiAUEEcUUNACAAIAFBIHI2AgBBfw8LIAAgACgCLCAAKAIwaiICNgIIIAAgAjYCBCABQRt0QR91C8cBAQN/IAMgAygCSCIEQX9qIARyNgJIIAIgAWwhBQJAAkAgAygCBCIEIAMoAggiBkcNACAFIQQMAQsgACAEIAYgBGsiBiAFIAYgBUkbIgYQkICAgAAaIAMgBCAGajYCBCAFIAZrIQQgACAGaiEACyACQQAgARshBgJAIARFDQADQAJAAkAgAxC2gICAAA0AIAMgACAEIAMoAiARgICAgACAgICAACICDQELIAUgBGsgAW4PCyAAIAJqIQAgBCACayIEDQALCyAGC7EBAQF/AkACQCACQQNJDQAQi4CAgABBHDYCAAwBCwJAIAJBAUcNACAAKAIIIgNFDQAgASADIAAoAgRrrH0hAQsCQCAAKAIUIAAoAhxGDQAgAEEAQQAgACgCJBGAgICAAICAgIAAGiAAKAIURQ0BCyAAQQA2AhwgAEIANwMQIAAgASACIAAoAigRgYCAgACAgICAAEIAUw0AIABCADcCBCAAIAAoAgBBb3E2AgBBAA8LQX8LDgAgACABIAIQuICAgAALDwAgACABrCACELmAgIAAC4YBAgJ/AX4gACgCKCEBQQEhAgJAIAAtAABBgAFxRQ0AQQFBAiAAKAIUIAAoAhxGGyECCwJAIABCACACIAERgYCAgACAgICAACIDQgBTDQACQAJAIAAoAggiAkUNAEEEIQEMAQsgACgCHCICRQ0BQRQhAQsgAyAAIAFqKAIAIAJrrHwhAwsgAwsKACAAELuAgIAACysBAX4CQCAAELyAgIAAIgFCgICAgAhTDQAQi4CAgABBPTYCAEF/DwsgAacLjAIBAn8CQCAADQBBACEBAkBBACgCoMnAgABFDQBBACgCoMnAgAAQvoCAgAAhAQsCQEEAKAKIycCAAEUNAEEAKAKIycCAABC+gICAACABciEBCwJAEJ2AgIAAKAIAIgBFDQADQAJAIAAoAhQgACgCHEYNACAAEL6AgIAAIAFyIQELIAAoAjgiAA0ACwsQnoCAgAAgAQ8LAkAgACgCFCAAKAIcRg0AIABBAEEAIAAoAiQRgICAgACAgICAABogACgCFA0AQX8PCwJAIAAoAgQiASAAKAIIIgJGDQAgACABIAJrrEEBIAAoAigRgYCAgACAgICAABoLIABBADYCHCAAQgA3AxAgAEIANwIEQQALAgALmwEBBX8gABC+gICAACEBIAAgACgCDBGCgICAAICAgIAAIQICQCAALQAAQQFxDQAgABC/gICAABCdgICAACEDIAAoAjghBAJAIAAoAjQiBUUNACAFIAQ2AjgLAkAgBEUNACAEIAU2AjQLAkAgAygCACAARw0AIAMgBDYCAAsQnoCAgAAgACgCYBChgICAACAAEKGAgIAACyACIAFyC64CAQZ/I4CAgIAAQSBrIQIgAiSAgICAACACIAA2AhggAiABNgIUIAJBAUEgEKKAgIAANgIQIAIoAhhBoIDAgAAQtYCAgAAhAyACIAM2AgwCQAJAIANBAEZBAXFFDQAgAigCEBChgICAACACQQA2AhwMAQsgAigCDCEEIAIoAhAgBDYCHCACKAIQQYWAgIAANgIAIAIoAhBBhoCAgAA2AgQgAigCEEGHgICAADYCCCACKAIQQYiAgIAANgIMIAIoAhBBiYCAgAA2AhAgAigCFCEFIAIoAhAgBTYCGCACKAIYEKaAgIAAQQFqEJ+AgIAAIQYgAigCECAGNgIUIAIoAhAoAhQgAigCGBCqgICAABogAiACKAIQNgIcCyACKAIcIQcgAkEgaiSAgICAACAHDwt2AQV/I4CAgIAAQSBrIQMgAySAgICAACADIAA2AhwgAyABNgIYIAMgAjYCFCADIAMoAhw2AhAgAygCGCEEIAMoAhQhBSADKAIQKAIcIQYgAyAEQQEgBSAGELeAgIAANgIMIAMoAgwhByADQSBqJICAgIAAIAcPC0gBAX8jgICAgABBEGshAiACJICAgIAAIAIgADYCDCACIAE3AwAgAigCDCgCHCACKQMAp0EAELqAgIAAGiACQRBqJICAgIAADws/AgF/AX4jgICAgABBEGshASABJICAgIAAIAEgADYCDCABKAIMKAIcEL2AgIAArCECIAFBEGokgICAgAAgAg8LXAEBfyOAgICAAEEQayEBIAEkgICAgAAgASAANgIMIAEgASgCDDYCCCABKAIMKAIUEKGAgIAAIAEoAggoAhwQwICAgAAaIAEoAggQoYCAgAAgAUEQaiSAgICAAA8LRgECfyOAgICAAEEQayEBIAEkgICAgAAgASAANgIMIAEoAgwoAhAhAiABKAIMIAIRg4CAgACAgICAACABQRBqJICAgIAADwtZAQJ/IAEtAAAhAgJAIAAtAAAiA0UNACADIAJB/wFxRw0AA0AgAS0AASECIAAtAAEiA0UNASABQQFqIQEgAEEBaiEAIAMgAkH/AXFGDQALCyADIAJB/wFxawuGAQECfwJAAkACQCACQQRJDQAgASAAckEDcQ0BA0AgACgCACABKAIARw0CIAFBBGohASAAQQRqIQAgAkF8aiICQQNLDQALCyACRQ0BCwJAA0AgAC0AACIDIAEtAAAiBEcNASABQQFqIQEgAEEBaiEAIAJBf2oiAkUNAgwACwsgAyAEaw8LQQALDAAgACAAoSIAIACjCxMAIAEgAZogASAAGxDLgICAAKILGQEBfyOAgICAAEEQayIBIAA5AwggASsDCAsTACAARAAAAAAAAABwEMqAgIAACxMAIABEAAAAAAAAABAQyoCAgAALBQAgAJkLoQUGBX8CfgF/AXwBfgF8I4CAgIAAQRBrIgIkgICAgAAgABDQgICAACEDIAEQ0ICAgAAiBEH/D3EiBUHCd2ohBiABvSEHIAC9IQgCQAJAAkAgA0GBcGpBgnBJDQBBACEJIAZB/35LDQELAkAgBxDRgICAAEUNAEQAAAAAAADwPyEKIAhCgICAgICAgPg/UQ0CIAdCAYYiC1ANAgJAAkAgCEIBhiIIQoCAgICAgIBwVg0AIAtCgYCAgICAgHBUDQELIAAgAaAhCgwDCyAIQoCAgICAgIDw/wBRDQJEAAAAAAAAAAAgASABoiAIQoCAgICAgIDw/wBUIAdCAFNzGyEKDAILAkAgCBDRgICAAEUNACAAIACiIQoCQCAIQn9VDQAgCpogCiAHENKAgIAAQQFGGyEKCyAHQn9VDQJEAAAAAAAA8D8gCqMQ04CAgAAhCgwCC0EAIQkCQCAIQn9VDQACQCAHENKAgIAAIgkNACAAEMmAgIAAIQoMAwtBgIAQQQAgCUEBRhshCSADQf8PcSEDIAC9Qv///////////wCDIQgLAkAgBkH/fksNAEQAAAAAAADwPyEKIAhCgICAgICAgPg/UQ0CAkAgBUG9B0sNACABIAGaIAhCgICAgICAgPg/VhtEAAAAAAAA8D+gIQoMAwsCQCAEQf8PSyAIQoCAgICAgID4P1ZGDQBBABDMgICAACEKDAMLQQAQzYCAgAAhCgwCCyADDQAgAEQAAAAAAAAwQ6K9Qv///////////wCDQoCAgICAgIDgfHwhCAsgB0KAgIBAg78iCiAIIAJBCGoQ1ICAgAAiDL1CgICAQIO/IgCiIAEgCqEgAKIgASACKwMIIAwgAKGgoqAgCRDVgICAACEKCyACQRBqJICAgIAAIAoLCQAgAL1CNIinCxsAIABCAYZCgICAgICAgBB8QoGAgICAgIAQVAtVAgJ/AX5BACEBAkAgAEI0iKdB/w9xIgJB/wdJDQBBAiEBIAJBswhLDQBBACEBQgFBswggAmuthiIDQn98IACDQgBSDQBBAkEBIAMgAINQGyEBCyABCxkBAX8jgICAgABBEGsiASAAOQMIIAErAwgLwwIEAX4BfAF/BXwgASAAQoCAgICw1dqMQHwiAkI0h7kiA0EAKwO4gMCAAKIgAkItiKdB/wBxQQV0IgQrA5CBwIAAoCAAIAJCgICAgICAgHiDfSIAQoCAgIAIfEKAgICAcIO/IgUgBCsD+IDAgAAiBqJEAAAAAAAA8L+gIgcgAL8gBaEgBqIiBqAiBSADQQArA7CAwIAAoiAEKwOIgcCAAKAiAyAFIAOgIgOhoKAgBiAFQQArA8CAwIAAIgiiIgkgByAIoiIIoKKgIAcgCKIiByADIAMgB6AiB6GgoCAFIAUgCaIiA6IgAyADIAVBACsD8IDAgACiQQArA+iAwIAAoKIgBUEAKwPggMCAAKJBACsD2IDAgACgoKIgBUEAKwPQgMCAAKJBACsDyIDAgACgoKKgIgUgByAHIAWgIgWhoDkDACAFC98CAwJ/AnwCfgJAIAAQ0ICAgABB/w9xIgNEAAAAAAAAkDwQ0ICAgAAiBGtEAAAAAAAAgEAQ0ICAgAAgBGtJDQACQCADIARPDQAgAEQAAAAAAADwP6AiAJogACACGw8LIANEAAAAAAAAkEAQ0ICAgABJIQRBACEDIAQNAAJAIAC9Qn9VDQAgAhDNgICAAA8LIAIQzICAgAAPCyABIABBACsD+KDAgACiQQArA4ChwIAAIgWgIgYgBaEiBUEAKwOQocCAAKIgBUEAKwOIocCAAKIgAKCgoCIAIACiIgEgAaIgAEEAKwOwocCAAKJBACsDqKHAgACgoiABIABBACsDoKHAgACiQQArA5ihwIAAoKIgBr0iB6dBBHRB8A9xIgQrA+ihwIAAIACgoKAhACAEKQPwocCAACAHIAKtfEIthnwhCAJAIAMNACAAIAggBxDWgICAAA8LIAi/IgEgAKIgAaAL7gEBBHwCQCACQoCAgIAIg0IAUg0AIAFCgICAgICAgPhAfL8iAyAAoiADoEQAAAAAAAAAf6IPCwJAIAFCgICAgICAgPA/fCICvyIDIACiIgQgA6AiABDOgICAAEQAAAAAAADwP2NFDQBEAAAAAAAAEAAQ04CAgABEAAAAAAAAEACiENeAgIAAIAJCgICAgICAgICAf4O/IABEAAAAAAAA8L9EAAAAAAAA8D8gAEQAAAAAAAAAAGMbIgWgIgYgBCADIAChoCAAIAUgBqGgoKAgBaEiACAARAAAAAAAAAAAYRshAAsgAEQAAAAAAAAQAKILEAAjgICAgABBEGsgADkDCAulEwE5fyOAgICAAEHgCGshAiACJICAgIAAIAIgADYC2AggAiABNgLUCCACQQFBkKAwEKKAgIAANgLQCCACQQA2AjggAkF/NgI0IAIoAtQIIQMgAigC0AggAzYCAAJAAkAgAigC2AhBAEZBAXFFDQAgAiACKALQCDYC3AgMAQsgAkEAOgBAIAJBADoAPwJAA0AgAigC2AgoAgQhBCACKALYCCACQT5qQQEgBBGAgICAAICAgIAAIQUgAiAFNgIwAkACQAJAIAVFDQAgAiwAPkEKRkEBcUUNAQsgAiACQcAAajYCLCACIAJBwABqNgIoA0AgAigCKCwAACEGQQAhBwJAIAZFDQAgAigCKCwAAEEgRyEIQQAhCSAIQQFxIQogCSEHIApFDQAgAigCKCwAAEEJRyEHCwJAIAdBAXFFDQAgAiACKAIoQQFqNgIoDAELCyACKAIoIQtBACEMQf8BGgJAIAstAAAgDEH/AXFHQQFxRQ0AIAIoAighDSACIA1BAWo2AiggDUEAOgAAA0AgAigCKCwAACEOQQAhDwJAIA5FDQAgAigCKCwAAEEgRiEQQQEhESAQQQFxIRIgESETAkAgEg0AIAIoAigsAABBCUYhEwsgEyEPCwJAIA9BAXFFDQAgAiACKAIoQQFqNgIoDAELCyACKAIoIRRBACEVQf8BGgJAIBQtAAAgFUH/AXFHQQFxRQ0AAkACQCACKAIoLAAAQSJGQQFxDQAgAigCKCwAAEEnRkEBcUUNAQsgAiACKAIoQQFqNgIoCwJAAkAgAigCKCACKAIoEKaAgIAAQQFraiwAAEEiRkEBcQ0AIAIoAiggAigCKBCmgICAAEEBa2osAABBJ0ZBAXFFDQELIAIoAiggAigCKBCmgICAAGpBADoAAAsCQAJAIAIoAjRBf0dBAXFFDQAgAigCLCwAACEWQTAgFkxBAXFFDQAgAigCLCwAAEE5TEEBcUUNACACIAIoAiwQp4CAgAA2AiQgAigCJCEXAkBBACAXTEEBcUUNACACKAIkQYABSEEBcUUNAAJAAkAgAigC2AgoAhRBAEZBAXFFDQBBqYDAgAAhGAwBCyACKALYCCgCFCEYCyACIBgQpoCAgABBCmogAigCKBCmgICAAGpBBGpBAWo2AhwgAiACKAIoEKaAgIAAQQRqQQFqEJ+AgIAANgIYIAIgAigCHBCfgICAADYCFCACIAIoAhwQn4CAgAA2AhAgAigCGCACKAIoEKqAgIAAGiACKAIYQYiAwIAAEKuAgIAAGgJAAkAgAigC2AgoAhRBAEZBAXFFDQAgAigCEEEAOgAAIAIoAhRBADoAAAwBCyACKAIUIAIoAtgIKAIUEKqAgIAAGiACKAIUQS8QrYCAgAAhGSACIBk2AgwCQAJAIBlBAEZBAXFFDQAgAigCFEGngMCAABCqgICAABoMAQsgAigCDEEAOgAAIAIgAigCDEF/ajYCDANAIAIoAgwgAigCFEchGkEAIRsgGkEBcSEcIBshHQJAIBxFDQAgAigCDCwAAEEvRiEeQQAhHyAeQQFxISAgHyEdICBFDQAgAigCDCwAAEHcAEYhHQsCQCAdQQFxRQ0AIAIoAgxBADoAACACIAIoAgxBf2o2AgwMAQsLIAIoAhRBqIDAgAAQq4CAgAAaCyACKAIUIAIoAigQq4CAgAAaIAIoAhAgAigCFBCqgICAABogAigCEEGIgMCAABCrgICAABoLIAIoAtgIKAIAISEgAigCKCACKALYCCgCGCAhEYSAgIAAgICAgAAhIiACICI2AiACQAJAAkAgIkEAR0EBcQ0AIAIoAtgIKAIAISMgAigCGCACKALYCCgCGCAjEYSAgIAAgICAgAAhJCACICQ2AiAgJEEAR0EBcQ0AIAIoAtgIKAIAISUgAigCFCACKALYCCgCGCAlEYSAgIAAgICAgAAhJiACICY2AiAgJkEAR0EBcQ0AIAIoAtgIKAIAIScgAigCECACKALYCCgCGCAnEYSAgIAAgICAgAAhKCACICg2AiAgKEEAR0EBcUUNAQsCQCACKALQCCACKAI0Qf8BcSACKAIkIAIoAjRBgAJxIAIoAiAQ2YCAgAANACACKAIgEMaAgIAAIAIoAhAQoYCAgAAgAigCFBChgICAACACKAIYEKGAgIAAIAIoAtAIENqAgIAAIAJBADYC3AgMDAsgAigCIBDGgICAACACKAIQEKGAgIAAIAIoAhQQoYCAgAAgAigCGBChgICAAAwBCyACKAIQEKGAgIAAIAIoAhQQoYCAgAAgAigCGBChgICAACACKALQCBDagICAACACQQA2AtwIDAoLCwwBCwJAAkAgAigCLEGbgMCAABDHgICAAEUNACACKAIsQYCAwIAAEMeAgIAADQELIAIoAigQp4CAgAAhKSACKAIsQYCAwIAAEMeAgIAAISpBgAIhKyACIClBACArICobcjYCNAJAIAIoAtAIQQRqIAIoAjRB/wFxQQJ0aigCAA0AIAIoAtAIKAKIgARBAWohLCACKALQCEEEaiACKAI0Qf8BcUECdGogLDYCAAJAAkAgAigC0AgoAoiABA0AQYAgEJ+AgIAAIS0MAQsgAigC0AgoAoSABCACKALQCCgCiIAEQQFqQQx0EKOAgIAAIS0LIC0hLiACKALQCCAuNgKEgAQgAigC0AgoAoSABCACKALQCCgCiIAEQQx0aiEvQYAgITAgL0EAIDD8CwAgAigC0AghMSAxIDEoAoiABEEBajYCiIAECwsLCwsgAkEAOgBAIAJBADYCOAJAIAIoAjANAAwECwwBCwJAAkAgAkHAAGoQpoCAgABBAEtBAXENACACLAA+QSBHQQFxRQ0BIAIsAD5BCUdBAXFFDQELIAIsAD5BDUdBAXFFDQAgAkHAAGoQpoCAgABBgAhJQQFxRQ0AAkACQCACLAA+QSNGQQFxRQ0AIAJBATYCOCACIAJBwABqEKaAgIAAQQFrNgIIA0AgAigCCEEATiEyQQAhMyAyQQFxITQgMyE1AkAgNEUNACACKAIIIAJBwABqaiwAAEEgRiE2QQEhNyA2QQFxITggNyE5AkAgOA0AIAIoAgggAkHAAGpqLAAAQQlGITkLIDkhNQsCQCA1QQFxRQ0AIAIoAgggAkHAAGpqQQA6AAAgAiACKAIIQX9qNgIIDAELCwwBCwJAIAIoAjgNACACQcAAaiACQT5qEKuAgIAAGgsLCwsMAAsLIAIoAtAIENuAgIAAIAIgAigC0Ag2AtwICyACKALcCCE6IAJB4AhqJICAgIAAIDoPC9kBAQZ/I4CAgIAAQSBrIQUgBSSAgICAACAFIAA2AhwgBSABNgIYIAUgAjYCFCAFIAM2AhAgBSAENgIMIAUgBSgCHCAFKAIYENyAgIAANgIIIAUoAgghBiAFKAIQIQcCQCAGQYABQQAgBxsgBSgCFHJBBHRqKAIMRQ0AIAUoAhwgBSgCGCAFKAIUIAUoAhAQ3YCAgAALIAUoAgghCCAFKAIQIQkgCEGAAUEAIAkbIAUoAhRyQQR0aiAFKAIMIAUoAhwoAgAQ3oCAgAAhCiAFQSBqJICAgIAAIAoPC5YCAQF/I4CAgIAAQRBrIQEgASSAgICAACABIAA2AgwgAUEANgIIAkADQCABKAIIQYABSEEBcUUNAQJAAkAgASgCDCABKAIIENyAgIAAQQBGQQFxRQ0ADAELIAFBADYCBAJAA0AgASgCBEECSEEBcUUNASABQQA2AgACQANAIAEoAgBBgAFIQQFxRQ0BIAEoAgwgASgCCCABKAIAIAEoAgQQ3YCAgAAgASABKAIAQQFqNgIADAALCyABIAEoAgRBAWo2AgQMAAsLCyABIAEoAghBAWo2AggMAAsLAkAgASgCDCgChIAEQQBHQQFxRQ0AIAEoAgwoAoSABBChgICAAAsgASgCDBChgICAACABQRBqJICAgIAADwuYAQEDfyOAgICAAEEQayEBIAEgADYCDCABKAIMQZCABGohAkGAoCwhAyACQQAgA/wLACABQQA2AggCQANAIAEoAghBgAFIQQFxRQ0BIAEoAgxBkIAEaiABKAIIQaAsbGpEAAAAAAAA8D85AxAgASgCDEGQgARqIAEoAghBoCxsakH//wA2AhggASABKAIIQQFqNgIIDAALCw8LcgEBfyOAgICAAEEQayECIAIgADYCCCACIAE2AgQCQAJAIAIoAghBBGogAigCBEECdGooAgANACACQQA2AgwMAQsgAiACKAIIKAKEgAQgAigCCEEEaiACKAIEQQJ0aigCAEEBa0EMdGo2AgwLIAIoAgwPC3wBA38jgICAgABBIGshBCAEJICAgIAAIAQgADYCHCAEIAE2AhggBCACNgIUIAQgAzYCECAEIAQoAhwgBCgCGBDcgICAADYCDCAEKAIMIQUgBCgCECEGIAVBgAFBACAGGyAEKAIUckEEdGoQ34CAgAAgBEEgaiSAgICAAA8LjQcBFX8jgICAgABB8ABrIQMgAySAgICAACADIAA2AmggAyABNgJkIAMgAjYCYCADKAJkKAIEIQQgAygCZCADQSBqQRYgBBGAgICAAICAgIAAGgJAAkAgA0EgakHoscCAAEEWEMiAgIAARQ0AIANBIGpB/7HAgABBFhDIgICAAEUNACADQQA2AmwMAQsgAygCZCgCCCEFIAMoAmQhBiADKAJkKAIMIQcgBiADKAJkIAcRhYCAgACAgICAAEI8fCAFEYaAgIAAgICAgAAgAyADKAJkEOCAgIAANgIUIAMoAmQQ4ICAgAAaIAMgAygCZBDggICAADYCECADKAJkEOGAgIAAGiADKAJkEOGAgIAAIQggAygCaCAINgIAIAMoAmQQ4oCAgAAaIAMoAmQoAgghCSADKAJkIQogAygCZCgCDCELIAogAygCZCALEYWAgIAAgICAgABCJHwgCRGGgICAAICAgIAAAkAgAygCFA0AIANBATYCFAsCQCADKAIQDQAgA0EBNgIQCwJAIAMoAhRBAUdBAXFFDQAgA0EANgJsDAELIAMoAmQQ4YCAgAAaIAMoAmQoAgghDCADKAJkIQ0gAygCZCgCDCEOIA0gAygCZCAOEYWAgIAAgICAgABCEHwgDBGGgICAAICAgIAAIAMoAmQQ4oCAgAAaIAMgAygCZBDggICAADYCDCADKAJkKAIIIQ8gAygCZCEQIAMoAmQoAgwhESAQIAMoAmQgERGFgICAAICAgIAAQih8IA8RhoCAgACAgICAACADQQA2AhwCQANAIAMoAhwgAygCDEhBAXFFDQEgAygCZBDggICAABogAygCZBDggICAABogAygCZBDigICAABogAyADKAJkEOCAgIAANgIIIAMoAmQoAgghEiADKAJkIRMgAygCZCgCDCEUIBMgAygCZCAUEYWAgIAAgICAgABCKHwgEhGGgICAAICAgIAAIAMoAghB5AAQooCAgAAhFSADKAJoIBU2AgQgAygCCCEWIAMoAmggFjYCCCADQQA2AhgCQANAIAMoAhggAygCCEhBAXFFDQEgAygCaCgCBCADKAIYQeQAbGogAygCZCADKAIQIAMoAmAQ44CAgAAgAyADKAIYQQFqNgIYDAALCyADIAMoAhxBAWo2AhwMAAsLIAMoAmhBATYCDCADQQE2AmwLIAMoAmwhFyADQfAAaiSAgICAACAXDwurAQEBfyOAgICAAEEQayEBIAEkgICAgAAgASAANgIMIAEoAgxBADYCDAJAIAEoAgwoAgRBAEdB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gIAADAELIAItADdBkH5qIQsgC0EPSxoCQAJAAkAgCw4QAAICAgICAgACAgICAgICAQILIAIgAigCPCgCABD2gICAADYCDCACKAI8KAIAKAIIIQwgAigCPCgCACENIAIoAjwoAgAoAgwhDiANIAIoAjwoAgAgDhGFgICAAICAgIAAIAI1Agx8IAwRhoCAgACAgICAAAwBCyACIAIoAjwoAgAQ+YCAgAA6AAsgAiACKAI8KAIAEPaAgIAANgIEIAItAAshDwJAAkACQAJAIA9BL0YNACAPQdEARg0BDAILAkAgAigCBA0AIAIoAjhBATYCJAwDCwsCQCACKAIEQQNGQQFxRQ0AIAIoAjwoAgAQ+oCAgAAhECACKAI8IBA2AhQMAgsLIAIoAjwoAgAoAgghESACKAI8KAIAIRIgAigCPCgCACgCDCETIBIgAigCPCgCACATEYWAgIAAgICAgAAgAjUCBHwgERGGgICAAICAgIAACwsLQf8BGgJAIAItADdBgAFOQQFxRQ0AQf8BGiACLQA3Qe8BTEEBcUUNACACLQA3IRQgAigCOCAUOgAgCyACQcAAaiSAgICAAA8LWwEDfyOAgICAAEEQayEBIAEkgICAgAAgASAANgIMIAEoAgwoAgQhAiABKAIMIAFBC2pBASACEYCAgIAAgICAgAAaQf8BGiABLQALIQMgAUEQaiSAgICAACADDwt9AQV/I4CAgIAAQRBrIQEgASSAgICAACABIAA2AgwgASgCDCgCBCECIAEoAgwgAUEJakEDIAIRgICAgACAgICAABpB/wEaIAEtAAlBEHQhA0H/ARogAyABLQAKQQh0ciEEQf8BGiAEIAEtAAtyIQUgAUEQaiSAgICAACAFDwuUAQEDfyOAgICAAEEgayECIAIkgICAgAAgAiAANgIYIAIgATYCFCACKAIYQQAQwYCAgAAhAyACIAM2AhACQAJAIANBAEZBAXFFDQAgAkEANgIcDAELIAIgAigCECACKAIUEPyAgIAANgIMIAIoAhAQxoCAgAAgAiACKAIMNgIcCyACKAIcIQQgAkEgaiSAgICAACAEDwulAQEEfyOAgICAAEEQayECIAIkgICAgAAgAiAANgIIIAIgATYCBCACQQFBEBCigICAADYCACACKAIEIQMgAigCACADNgIAIAIoAgggAigCBBDYgICAACEEIAIoAgAgBDYCDAJAAkAgBEEARkEBcUUNACACKAIAEKGAgIAAIAJBADYCDAwBCyACIAIoAgA2AgwLIAIoAgwhBSACQRBqJICAgIAAIAUPC/wFASh/I4CAgIAAQRBrIQIgAiSAgICAACACIAA2AgwgAiABNgIIIAIgAigCDCgCLDYCBCACKAIIIQNB/wEaAkACQCADLQAADQAgAigCBCEEIAIoAgghBUH/ARogBS0AASEGIAIoAgghB0H/ARogBy0AAiEIIAIoAgghCUH/ARogBCAGIAggCS0AAxDkgICAAAwBCyACKAIIIQpB/wEaAkACQCAKLQAAQQFGQQFxRQ0AIAIoAgghC0H/ARoCQAJAIAstAAINACACKAIEIQwgAigCCCENQf8BGiANLQABIQ4gAigCCCEPQf8BGiAMIA4gDy0AAxDogICAAAwBCyACKAIIIRBB/wEaAkACQCAQLQACQSBGQQFxRQ0AIAIoAgQhESACKAIIIRJB/wEaIBItAAEhEyACKAIIIRRB/wEaIBEgEyAULQADEOmAgIAADAELIAIoAgghFUH/ARoCQAJAIBUtAAJBB0ZBAXFFDQAgAigCBCEWIAIoAgghF0H/ARogFy0AASEYIAIoAgghGUH/ARogFiAYIBktAAMQ7oCAgAAMAQsgAigCCCEaQf8BGgJAIBotAAJBJ0ZBAXFFDQAgAigCBCEbIAIoAgghHEH/ARogHC0AASEdIAIoAgghHkH/ARogGyAdIB4tAAMQ74CAgAALCwsLDAELIAIoAgghH0H/ARoCQAJAIB8tAABBAkZBAXFFDQAgAkEANgIAIAIoAgRBkIAEaiEgIAIoAgghIUH/ARoCQAJAICAgIS0AAUGgLGxqKAIIQfgARkEBcQ0AIAIoAgghIkH/ARogIi0AAUEJRkEBcUUNAQsgAkEBNgIACyACKAIEISMgAigCCCEkQf8BGiAkLQABISUgAigCCCEmQf8BGiAjICUgJi0AAiACKAIAEOqAgIAADAELIAIoAgghJ0H/ARoCQCAnLQAAQQNGQQFxRQ0AIAIoAgQhKCACKAIIISlB/wEaICggKS0AASACKAIIKwMIEOyAgIAACwsLCyACQRBqJICAgIAADwurAQEDfyOAgICAAEEgayECIAIkgICAgAAgAiAANgIYIAIgATYCFCACKAIUQQAQwYCAgAAhAyACIAM2AhACQAJAIANBAEZBAXFFDQAgAkEANgIcDAELIAIgAigCGCACKAIQEP+AgIAANgIMAkAgAigCDA0AIAIoAhgoAggQxoCAgAAgAigCGEEANgIICyACIAIoAgw2AhwLIAIoAhwhBCACQSBqJICAgIAAIAQPC/EBAQV/I4CAgIAAQRBrIQIgAiSAgICAACACIAA2AgggAiABNgIEAkAgAigCCCgCBEEAR0EBcUUNACACKAIIKAIEEPSAgIAACwJAIAIoAggoAghBAEdBAXFFDQAgAigCCCgCCBDGgICAAAsgAigCBCEDIAIoAgggAzYCCCACKAIIQQA2AgQgAigCCCgCCEGKgICAABDygICAACEEIAIoAgggBDYCBAJAAkAgBEEARkEBcUUNACACQQA2AgwMAQsgAigCCCgCDCEFIAIoAggoAgQgBTYCLCACQQE2AgwLIAIoAgwhBiACQRBqJICAgIAAIAYPC9ABAQV/I4CAgIAAQRBrIQEgASAANgIIAkACQCABKAIIKAIEQQBGQQFxRQ0AIAFBADYCDAwBCyABQQA2AgQDQCABKAIEIAEoAggoAgQoAgxIIQJBACEDIAJBAXEhBCADIQUCQCAERQ0AIAEoAggoAgQoAiggASgCBEEobGooAiRBAEchBQsCQCAFQQFxRQ0AIAEgASgCBEEBajYCBAwBCwsCQCABKAIEIAEoAggoAgQoAgxGQQFxRQ0AIAFBATYCDAwBCyABQQA2AgwLIAEoAgwPC4IBAQF/I4CAgIAAQRBrIQMgAySAgICAACADIAA2AgwgAyABNgIIIAMgAjYCBAJAIAMoAgwoAgRBAEdBAXFFDQAgAygCDCgCBCADKAIEtyADKAIMKAIAt6MQ94CAgAALIAMoAgwoAgwgAygCCCADKAIEEPCAgIAAIANBEGokgICAgAAPC4IBAQF/I4CAgIAAQRBrIQMgAySAgICAACADIAA2AgwgAyABNgIIIAMgAjYCBAJAIAMoAgwoAgRBAEdBAXFFDQAgAygCDCgCBCADKAIEtyADKAIMKAIAt6MQ94CAgAALIAMoAgwoAgwgAygCCCADKAIEEPGAgIAAIANBEGokgICAgAAPCzgBAX8jgICAgABBEGshASABJICAgIAAIAEgADYCDCABKAIMKAIMENuAgIAAIAFBEGokgICAgAAPC4cBAQF/I4CAgIAAQRBrIQEgASSAgICAACABIAA2AgwCQCABKAIMKAIEQQBHQQFxRQ0AIAEoAgwoAgQQ9ICAgAALAkAgASgCDCgCCEEAR0EBcUUNACABKAIMKAIIEMaAgIAACyABKAIMKAIMENqAgIAAIAEoAgwQoYCAgAAgAUEQaiSAgICAAA8LRQEBf0GNgMCAACECAkAgAEGZAUsNAAJAAkAgAA0AQQAhAAwBCyAAQQF0LwGgtsCAACIARQ0BCyAAQdS4wIAAaiECCyACCwwAIAAgABCFgYCAAAsKACAAJICAgIAACxoBAn8jgICAgAAgAGtBcHEiASSAgICAACABCwgAI4CAgIAACwudSQIAQYCAwAAL7kdkcnVtc2V0AC5wYXQAVW5rbm93biBlcnJvcgBiYW5rAHJiAHJ3YQAuLwAAAAAAAAAAOPr+Qi7mPzBnx5NX8y49AAAAAAAA4L9gVVVVVVXlvwYAAAAAAOA/TlVZmZmZ6T96pClVVVXlv+lFSJtbSfK/wz8miysA8D8AAAAAAKD2PwAAAAAAAAAAAMi58oIs1r+AVjcoJLT6PAAAAAAAgPY/AAAAAAAAAAAACFi/vdHVvyD34NgIpRy9AAAAAABg9j8AAAAAAAAAAABYRRd3dtW/bVC21aRiI70AAAAAAED2PwAAAAAAAAAAAPgth60a1b/VZ7Ce5ITmvAAAAAAAIPY/AAAAAAAAAAAAeHeVX77Uv+A+KZNpGwS9AAAAAAAA9j8AAAAAAAAAAABgHMKLYdS/zIRMSC/YEz0AAAAAAOD1PwAAAAAAAAAAAKiGhjAE1L86C4Lt80LcPAAAAAAAwPU/AAAAAAAAAAAASGlVTKbTv2CUUYbGsSA9AAAAAACg9T8AAAAAAAAAAACAmJrdR9O/koDF1E1ZJT0AAAAAAID1PwAAAAAAAAAAACDhuuLo0r/YK7eZHnsmPQAAAAAAYPU/AAAAAAAAAAAAiN4TWonSvz+wz7YUyhU9AAAAAABg9T8AAAAAAAAAAACI3hNaidK/P7DPthTKFT0AAAAAAED1PwAAAAAAAAAAAHjP+0Ep0r922lMoJFoWvQAAAAAAIPU/AAAAAAAAAAAAmGnBmMjRvwRU52i8rx+9AAAAAAAA9T8AAAAAAAAAAACoq6tcZ9G/8KiCM8YfHz0AAAAAAOD0PwAAAAAAAAAAAEiu+YsF0b9mWgX9xKgmvQAAAAAAwPQ/AAAAAAAAAAAAkHPiJKPQvw4D9H7uawy9AAAAAACg9D8AAAAAAAAAAADQtJQlQNC/fy30nrg28LwAAAAAAKD0PwAAAAAAAAAAANC0lCVA0L9/LfSeuDbwvAAAAAAAgPQ/AAAAAAAAAAAAQF5tGLnPv4c8masqVw09AAAAAABg9D8AAAAAAAAAAABg3Mut8M6/JK+GnLcmKz0AAAAAAED0PwAAAAAAAAAAAPAqbgcnzr8Q/z9UTy8XvQAAAAAAIPQ/AAAAAAAAAAAAwE9rIVzNvxtoyruRuiE9AAAAAAAA9D8AAAAAAAAAAACgmsf3j8y/NISfaE95Jz0AAAAAAAD0PwAAAAAAAAAAAKCax/ePzL80hJ9oT3knPQAAAAAA4PM/AAAAAAAAAAAAkC10hsLLv4+3izGwThk9AAAAAADA8z8AAAAAAAAAAADAgE7J88q/ZpDNP2NOujwAAAAAAKDzPwAAAAAAAAAAALDiH7wjyr/qwUbcZIwlvQAAAAAAoPM/AAAAAAAAAAAAsOIfvCPKv+rBRtxkjCW9AAAAAACA8z8AAAAAAAAAAABQ9JxaUsm/49TBBNnRKr0AAAAAAGDzPwAAAAAAAAAAANAgZaB/yL8J+tt/v70rPQAAAAAAQPM/AAAAAAAAAAAA4BACiavHv1hKU3KQ2ys9AAAAAABA8z8AAAAAAAAAAADgEAKJq8e/WEpTcpDbKz0AAAAAACDzPwAAAAAAAAAAANAZ5w/Wxr9m4rKjauQQvQAAAAAAAPM/AAAAAAAAAAAAkKdwMP/FvzlQEJ9Dnh69AAAAAAAA8z8AAAAAAAAAAACQp3Aw/8W/OVAQn0OeHr0AAAAAAODyPwAAAAAAAAAAALCh4+Umxb+PWweQi94gvQAAAAAAwPI/AAAAAAAAAAAAgMtsK03Evzx4NWHBDBc9AAAAAADA8j8AAAAAAAAAAACAy2wrTcS/PHg1YcEMFz0AAAAAAKDyPwAAAAAAAAAAAJAeIPxxw786VCdNhnjxPAAAAAAAgPI/AAAAAAAAAAAA8B/4UpXCvwjEcRcwjSS9AAAAAABg8j8AAAAAAAAAAABgL9Uqt8G/lqMRGKSALr0AAAAAAGDyPwAAAAAAAAAAAGAv1Sq3wb+WoxEYpIAuvQAAAAAAQPI/AAAAAAAAAAAAkNB8ftfAv/Rb6IiWaQo9AAAAAABA8j8AAAAAAAAAAACQ0Hx+18C/9FvoiJZpCj0AAAAAACDyPwAAAAAAAAAAAODbMZHsv7/yM6NcVHUlvQAAAAAAAPI/AAAAAAAAAAAAACtuBye+vzwA8CosNCo9AAAAAAAA8j8AAAAAAAAAAAAAK24HJ76/PADwKiw0Kj0AAAAAAODxPwAAAAAAAAAAAMBbj1RevL8Gvl9YVwwdvQAAAAAAwPE/AAAAAAAAAAAA4Eo6bZK6v8iqW+g1OSU9AAAAAADA8T8AAAAAAAAAAADgSjptkrq/yKpb6DU5JT0AAAAAAKDxPwAAAAAAAAAAAKAx1kXDuL9oVi9NKXwTPQAAAAAAoPE/AAAAAAAAAAAAoDHWRcO4v2hWL00pfBM9AAAAAACA8T8AAAAAAAAAAABg5YrS8La/2nMzyTeXJr0AAAAAAGDxPwAAAAAAAAAAACAGPwcbtb9XXsZhWwIfPQAAAAAAYPE/AAAAAAAAAAAAIAY/Bxu1v1dexmFbAh89AAAAAABA8T8AAAAAAAAAAADgG5bXQbO/3xP5zNpeLD0AAAAAAEDxPwAAAAAAAAAAAOAbltdBs7/fE/nM2l4sPQAAAAAAIPE/AAAAAAAAAAAAgKPuNmWxvwmjj3ZefBQ9AAAAAAAA8T8AAAAAAAAAAACAEcAwCq+/kY42g55ZLT0AAAAAAADxPwAAAAAAAAAAAIARwDAKr7+RjjaDnlktPQAAAAAA4PA/AAAAAAAAAAAAgBlx3UKrv0xw1uV6ghw9AAAAAADg8D8AAAAAAAAAAACAGXHdQqu/THDW5XqCHD0AAAAAAMDwPwAAAAAAAAAAAMAy9lh0p7/uofI0RvwsvQAAAAAAwPA/AAAAAAAAAAAAwDL2WHSnv+6h8jRG/Cy9AAAAAACg8D8AAAAAAAAAAADA/rmHnqO/qv4m9bcC9TwAAAAAAKDwPwAAAAAAAAAAAMD+uYeeo7+q/ib1twL1PAAAAAAAgPA/AAAAAAAAAAAAAHgOm4Kfv+QJfnwmgCm9AAAAAACA8D8AAAAAAAAAAAAAeA6bgp+/5Al+fCaAKb0AAAAAAGDwPwAAAAAAAAAAAIDVBxu5l785pvqTVI0ovQAAAAAAQPA/AAAAAAAAAAAAAPywqMCPv5ym0/Z8Ht+8AAAAAABA8D8AAAAAAAAAAAAA/LCowI+/nKbT9nwe37wAAAAAACDwPwAAAAAAAAAAAAAQayrgf7/kQNoNP+IZvQAAAAAAIPA/AAAAAAAAAAAAABBrKuB/v+RA2g0/4hm9AAAAAAAA8D8AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADwPwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwO8/AAAAAAAAAAAAAIl1FRCAP+grnZlrxxC9AAAAAACA7z8AAAAAAAAAAACAk1hWIJA/0vfiBlvcI70AAAAAAEDvPwAAAAAAAAAAAADJKCVJmD80DFoyuqAqvQAAAAAAAO8/AAAAAAAAAAAAQOeJXUGgP1PX8VzAEQE9AAAAAADA7j8AAAAAAAAAAAAALtSuZqQ/KP29dXMWLL0AAAAAAIDuPwAAAAAAAAAAAMCfFKqUqD99JlrQlXkZvQAAAAAAQO4/AAAAAAAAAAAAwN3Nc8usPwco2EfyaBq9AAAAAAAg7j8AAAAAAAAAAADABsAx6q4/ezvJTz4RDr0AAAAAAODtPwAAAAAAAAAAAGBG0TuXsT+bng1WXTIlvQAAAAAAoO0/AAAAAAAAAAAA4NGn9b2zP9dO26VeyCw9AAAAAABg7T8AAAAAAAAAAACgl01a6bU/Hh1dPAZpLL0AAAAAAEDtPwAAAAAAAAAAAMDqCtMAtz8y7Z2pjR7sPAAAAAAAAO0/AAAAAAAAAAAAQFldXjO5P9pHvTpcESM9AAAAAADA7D8AAAAAAAAAAABgrY3Iars/5Wj3K4CQE70AAAAAAKDsPwAAAAAAAAAAAEC8AViIvD/TrFrG0UYmPQAAAAAAYOw/AAAAAAAAAAAAIAqDOce+P+BF5q9owC29AAAAAABA7D8AAAAAAAAAAADg2zmR6L8//QqhT9Y0Jb0AAAAAAADsPwAAAAAAAAAAAOAngo4XwT/yBy3OeO8hPQAAAAAA4Os/AAAAAAAAAAAA8CN+K6rBPzSZOESOpyw9AAAAAACg6z8AAAAAAAAAAACAhgxh0cI/obSBy2ydAz0AAAAAAIDrPwAAAAAAAAAAAJAVsPxlwz+JcksjqC/GPAAAAAAAQOs/AAAAAAAAAAAAsDODPZHEP3i2/VR5gyU9AAAAAAAg6z8AAAAAAAAAAACwoeTlJ8U/x31p5egzJj0AAAAAAODqPwAAAAAAAAAAABCMvk5Xxj94Ljwsi88ZPQAAAAAAwOo/AAAAAAAAAAAAcHWLEvDGP+EhnOWNESW9AAAAAACg6j8AAAAAAAAAAABQRIWNicc/BUORcBBmHL0AAAAAAGDqPwAAAAAAAAAAAAA566++yD/RLOmqVD0HvQAAAAAAQOo/AAAAAAAAAAAAAPfcWlrJP2//oFgo8gc9AAAAAAAA6j8AAAAAAAAAAADgijztk8o/aSFWUENyKL0AAAAAAODpPwAAAAAAAAAAANBbV9gxyz+q4axOjTUMvQAAAAAAwOk/AAAAAAAAAAAA4Ds4h9DLP7YSVFnESy29AAAAAACg6T8AAAAAAAAAAAAQ8Mb7b8w/0iuWxXLs8bwAAAAAAGDpPwAAAAAAAAAAAJDUsD2xzT81sBX3Kv8qvQAAAAAAQOk/AAAAAAAAAAAAEOf/DlPOPzD0QWAnEsI8AAAAAAAg6T8AAAAAAAAAAAAA3eSt9c4/EY67ZRUhyrwAAAAAAADpPwAAAAAAAAAAALCzbByZzz8w3wzK7MsbPQAAAAAAwOg/AAAAAAAAAAAAWE1gOHHQP5FO7RbbnPg8AAAAAACg6D8AAAAAAAAAAABgYWctxNA/6eo8FosYJz0AAAAAAIDoPwAAAAAAAAAAAOgngo4X0T8c8KVjDiEsvQAAAAAAYOg/AAAAAAAAAAAA+KzLXGvRP4EWpffNmis9AAAAAABA6D8AAAAAAAAAAABoWmOZv9E/t71HUe2mLD0AAAAAACDoPwAAAAAAAAAAALgObUUU0j/quka63ocKPQAAAAAA4Oc/AAAAAAAAAAAAkNx88L7SP/QEUEr6nCo9AAAAAADA5z8AAAAAAAAAAABg0+HxFNM/uDwh03riKL0AAAAAAKDnPwAAAAAAAAAAABC+dmdr0z/Id/GwzW4RPQAAAAAAgOc/AAAAAAAAAAAAMDN3UsLTP1y9BrZUOxg9AAAAAABg5z8AAAAAAAAAAADo1SO0GdQ/neCQ7DbkCD0AAAAAAEDnPwAAAAAAAAAAAMhxwo1x1D911mcJzicvvQAAAAAAIOc/AAAAAAAAAAAAMBee4MnUP6TYChuJIC69AAAAAAAA5z8AAAAAAAAAAACgOAeuItU/WcdkgXC+Lj0AAAAAAODmPwAAAAAAAAAAANDIU/d71T/vQF3u7a0fPQAAAAAAwOY/AAAAAAAAAAAAYFnfvdXVP9xlpAgqCwq9/oIrZUcVZ0AAAAAAAAA4QwAA+v5CLna/OjuevJr3DL29/f/////fPzxUVVVVVcU/kSsXz1VVpT8X0KRnERGBPwAAAAAAAMhC7zn6/kIu5j8kxIL/vb/OP7X0DNcIa6w/zFBG0quygz+EOk6b4NdVPwAAAAAAAAAAAAAAAAAA8D9uv4gaTzubPDUz+6k99u8/XdzYnBNgcbxhgHc+muzvP9FmhxB6XpC8hX9u6BXj7z8T9mc1UtKMPHSFFdOw2e8/+o75I4DOi7ze9t0pa9DvP2HI5mFO92A8yJt1GEXH7z+Z0zNb5KOQPIPzxso+vu8/bXuDXaaalzwPiflsWLXvP/zv/ZIatY4890dyK5Ks7z/RnC9wPb4+PKLR0zLso+8/C26QiTQDarwb0/6vZpvvPw69LypSVpW8UVsS0AGT7z9V6k6M74BQvMwxbMC9iu8/FvTVuSPJkbzgLamumoLvP69VXOnj04A8UY6lyJh67z9Ik6XqFRuAvHtRfTy4cu8/PTLeVfAfj7zqjYw4+WrvP79TEz+MiYs8dctv61tj7z8m6xF2nNmWvNRcBITgW+8/YC86PvfsmjyquWgxh1TvP504hsuC54+8Hdn8IlBN7z+Nw6ZEQW+KPNaMYog7Ru8/fQTksAV6gDyW3H2RST/vP5SoqOP9jpY8OGJ1bno47z99SHTyGF6HPD+msk/OMe8/8ucfmCtHgDzdfOJlRSvvP14IcT97uJa8gWP14d8k7z8xqwlt4feCPOHeH/WdHu8/+r9vGpshPbyQ2drQfxjvP7QKDHKCN4s8CwPkpoUS7z+Py86JkhRuPFYvPqmvDO8/tquwTXVNgzwVtzEK/gbvP0x0rOIBQoY8MdhM/HAB7z9K+NNdOd2PPP8WZLII/O4/BFuOO4Cjhrzxn5JfxfbuP2hQS8ztSpK8y6k6N6fx7j+OLVEb+AeZvGbYBW2u7O4/0jaUPujRcbz3n+U02+fuPxUbzrMZGZm85agTwy3j7j9tTCqnSJ+FPCI0Ekym3u4/imkoemASk7wcgKwERdruP1uJF0iPp1i8Ki73IQrW7j8bmklnmyx8vJeoUNn10e4/EazCYO1jQzwtiWFgCM7uP+9kBjsJZpY8VwAd7UHK7j95A6Ha4cxuPNA8wbWixu4/MBIPP47/kzze09fwKsPuP7CvervOkHY8Jyo21dq/7j934FTrvR2TPA3d/ZmyvO4/jqNxADSUj7ynLJ12srnuP0mjk9zM3oe8QmbPotq27j9fOA+9xt54vIJPnVYrtO4/9lx77EYShrwPkl3KpLHuP47X/RgFNZM82ie1Nkev7j8Fm4ovt5h7PP3Hl9QSre4/CVQc4uFjkDwpVEjdB6vuP+rGGVCFxzQ8t0ZZiiap7j81wGQr5jKUPEghrRVvp+4/n3aZYUrkjLwJ3Ha54aXuP6hN7zvFM4y8hVU6sH6k7j+u6SuJeFOEvCDDzDRGo+4/WFhWeN3Ok7wlIlWCOKLuP2QZfoCqEFc8c6lM1FWh7j8oIl6/77OTvM07f2aeoO4/grk0h60Sary/2gt1EqDuP+6pbbjvZ2O8LxplPLKf7j9RiOBUPdyAvISUUfl9n+4/zz5afmQfeLx0X+zodZ/uP7B9i8BK7oa8dIGlSJqf7j+K5lUeMhmGvMlnQlbrn+4/09QJXsuckDw/Xd5PaaDuPx2lTbncMnu8hwHrcxSh7j9rwGdU/eyUPDLBMAHtoe4/VWzWq+HrZTxiTs8286LuP0LPsy/FoYi8Eho+VCek7j80NzvxtmmTvBPOTJmJpe4/Hv8ZOoRegLytxyNGGqfuP25XcthQ1JS87ZJEm9mo7j8Aig5bZ62QPJlmitnHqu4/tOrwwS+3jTzboCpC5azuP//nxZxgtmW8jES1FjKv7j9EX/NZg/Z7PDZ3FZmuse4/gz0epx8Jk7zG/5ELW7TuPykebIu4qV285cXNsDe37j9ZuZB8+SNsvA9SyMtEuu4/qvn0IkNDkrxQTt6fgr3uP0uOZtdsyoW8ugfKcPHA7j8nzpEr/K9xPJDwo4KRxO4/u3MK4TXSbTwjI+MZY8juP2MiYiIExYe8ZeVde2bM7j/VMeLjhhyLPDMtSuyb0O4/Fbu809G7kbxdJT6yA9XuP9Ix7pwxzJA8WLMwE57Z7j+zWnNuhGmEPL/9eVVr3u4/tJ2Ol83fgrx689O/a+PuP4czy5J3Gow8rdNamZ/o7j/62dFKj3uQvGa2jSkH7u4/uq7cVtnDVbz7FU+4ovPuP0D2pj0OpJC8OlnljXL57j80k6049NZovEde+/J2/+4/NYpYa+LukbxKBqEwsAXvP83dXwrX/3Q80sFLkB4M7z+smJL6+72RvAke11vCEu8/swyvMK5uczycUoXdmxnvP5T9n1wy4448etD/X6sg7z+sWQnRj+CEPEvRVy7xJ+8/ZxpOOK/NYzy15waUbS/vP2gZkmwsa2c8aZDv3CA37z/StcyDGIqAvPrDXVULP+8/b/r/P12tj7x8iQdKLUfvP0mpdTiuDZC88okNCIdP7z+nBz2mhaN0PIek+9wYWO8/DyJAIJ6RgryYg8kW42DvP6ySwdVQWo48hTLbA+Zp7z9LawGsWTqEPGC0AfMhc+8/Hz60ByHVgrxfm3szl3zvP8kNRzu5Kom8KaH1FEaG7z/TiDpgBLZ0PPY/i+cukO8/cXKdUezFgzyDTMf7UZrvP/CR048S94+82pCkoq+k7z99dCPimK6NvPFnji1Ir+8/CCCqQbzDjjwnWmHuG7rvPzLrqcOUK4Q8l7prNyvF7z/uhdExqWSKPEBFblt20O8/7eM75Lo3jrwUvpyt/dvvP53NkU07iXc82JCegcHn7z+JzGBBwQVTPPFxjyvC8+8/R0YxUEFUQ0gxMDAASUQjMDAwMDAyAABHRjFQQVRDSDExMABJRCMwMDAwMDIAAAAAAAAAAAAAAADwHwAA1iEAANkjAAD7JQAAPSgAAKEqAAAqLQAA2i8AALIyAAC2NQAA6DgAAEo8AADgPwAArEMAALJHAAD1SwAAelAAAENVAABVWgAAtF8AAGVlAABsawAAz3EAAJR4AAC/fwAAWIcAAGSPAADrlwAA86AAAIaqAACptAAAZ78AAMnKAADY1gAAnuMAACfxAAB+/wAAsA4BAMgeAQDWLwEA50EBAAtVAQBTaQEAz34BAJKVAQCwrQEAPccBAE/iAQD9/gEAXx0CAJA9AgCrXwIAzoMCABaqAgCl0gIAnv0CACQrAwBgWwMAeo4DAJ7EAwD6/QMAvzoEACF7BABXvwQAnAcFACxUBQBKpQUAO/sFAElWBgDAtgYA9BwHADuJBwDz+wcAfXUIAEL2CACufgkANw8KAFioCgCVSgsAd/YLAJGsDACAbQ0A6DkOAHcSDwDm9w8A++oQAIPsEQBc/RIAbh4UALFQFQAqlRYA7uwXACNZGQAA2xoAz3McAO0kHgDN7x8A9dUhAAbZIwC4+iUA3DwoAGKhKgBTKi0A29kvAEayMgAAtjUAnuc4ANpJPACZ3z8A6qtDAAyyRwBw9UsAuXlQAMRCVQCnVFoAt7NfAItkZQAAbGsAPM9xALWTeAAyv38A1FeHABlkjwDf6pcAcvOgAIeFqgBOqbQAbme/AAAAoAJOAOsBpwV+BSABdQYYA4YE+gC5AywD/QW3AYoBegO8BB4A+gaiAD0DSQPXAQAECACTBggBjwIGAioGXwK3AvoCWAPZBCsHygK9BeEFzQXcAhAGQAJ4AH0CZwNhBOwA5QMKBdQAzAM+Bk8CdgGYA68EAABEABACrgCuA2AA+gF3BCEF6wQrAGABQQGSAKkGowFuAk4BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEwQAAAAAAAAAACoCAAAAAAAAAAAAAAAAAAAAAAAAAAAnBDkESAQAAAAAAAAAAAAAAAAAAAAAkgQAAAAAAAAAAAAAAAAAAAAAAAA4BVIFYAVTBgAAygG7BgAA0gYAAOkGCQcZBz4HWQdpB34HU3VjY2VzcwBJbGxlZ2FsIGJ5dGUgc2VxdWVuY2UARG9tYWluIGVycm9yAFJlc3VsdCBub3QgcmVwcmVzZW50YWJsZQBOb3QgYSB0dHkAUGVybWlzc2lvbiBkZW5pZWQAT3BlcmF0aW9uIG5vdCBwZXJtaXR0ZWQATm8gc3VjaCBmaWxlIG9yIGRpcmVjdG9yeQBObyBzdWNoIHByb2Nlc3MARmlsZSBleGlzdHMAVmFsdWUgdG9vIGxhcmdlIGZvciBkZWZpbmVkIGRhdGEgdHlwZQBObyBzcGFjZSBsZWZ0IG9uIGRldmljZQBPdXQgb2YgbWVtb3J5AFJlc291cmNlIGJ1c3kASW50ZXJydXB0ZWQgc3lzdGVtIGNhbGwAUmVzb3VyY2UgdGVtcG9yYXJpbHkgdW5hdmFpbGFibGUASW52YWxpZCBzZWVrAENyb3NzLWRldmljZSBsaW5rAFJlYWQtb25seSBmaWxlIHN5c3RlbQBEaXJlY3Rvcnkgbm90IGVtcHR5AENvbm5lY3Rpb24gcmVzZXQgYnkgcGVlcgBPcGVyYXRpb24gdGltZWQgb3V0AENvbm5lY3Rpb24gcmVmdXNlZABIb3N0IGlzIGRvd24ASG9zdCBpcyB1bnJlYWNoYWJsZQBBZGRyZXNzIGluIHVzZQBCcm9rZW4gcGlwZQBJL08gZXJyb3IATm8gc3VjaCBkZXZpY2Ugb3IgYWRkcmVzcwBCbG9jayBkZXZpY2UgcmVxdWlyZWQATm8gc3VjaCBkZXZpY2UATm90IGEgZGlyZWN0b3J5AElzIGEgZGlyZWN0b3J5AFRleHQgZmlsZSBidXN5AEV4ZWMgZm9ybWF0IGVycm9yAEludmFsaWQgYXJndW1lbnQAQXJndW1lbnQgbGlzdCB0b28gbG9uZwBTeW1ib2xpYyBsaW5rIGxvb3AARmlsZW5hbWUgdG9vIGxvbmcAVG9vIG1hbnkgb3BlbiBmaWxlcyBpbiBzeXN0ZW0ATm8gZmlsZSBkZXNjcmlwdG9ycyBhdmFpbGFibGUAQmFkIGZpbGUgZGVzY3JpcHRvcgBObyBjaGlsZCBwcm9jZXNzAEJhZCBhZGRyZXNzAEZpbGUgdG9vIGxhcmdlAFRvbyBtYW55IGxpbmtzAE5vIGxvY2tzIGF2YWlsYWJsZQBSZXNvdXJjZSBkZWFkbG9jayB3b3VsZCBvY2N1cgBTdGF0ZSBub3QgcmVjb3ZlcmFibGUAT3duZXIgZGllZABPcGVyYXRpb24gY2FuY2VsZWQARnVuY3Rpb24gbm90IGltcGxlbWVudGVkAE5vIG1lc3NhZ2Ugb2YgZGVzaXJlZCB0eXBlAElkZW50aWZpZXIgcmVtb3ZlZABEZXZpY2Ugbm90IGEgc3RyZWFtAE5vIGRhdGEgYXZhaWxhYmxlAERldmljZSB0aW1lb3V0AE91dCBvZiBzdHJlYW1zIHJlc291cmNlcwBMaW5rIGhhcyBiZWVuIHNldmVyZWQAUHJvdG9jb2wgZXJyb3IAQmFkIG1lc3NhZ2UARmlsZSBkZXNjcmlwdG9yIGluIGJhZCBzdGF0ZQBOb3QgYSBzb2NrZXQARGVzdGluYXRpb24gYWRkcmVzcyByZXF1aXJlZABNZXNzYWdlIHRvbyBsYXJnZQBQcm90b2NvbCB3cm9uZyB0eXBlIGZvciBzb2NrZXQAUHJvdG9jb2wgbm90IGF2YWlsYWJsZQBQcm90b2NvbCBub3Qgc3VwcG9ydGVkAFNvY2tldCB0eXBlIG5vdCBzdXBwb3J0ZWQATm90IHN1cHBvcnRlZABQcm90b2NvbCBmYW1pbHkgbm90IHN1cHBvcnRlZABBZGRyZXNzIGZhbWlseSBub3Qgc3VwcG9ydGVkIGJ5IHByb3RvY29sAEFkZHJlc3Mgbm90IGF2YWlsYWJsZQBOZXR3b3JrIGlzIGRvd24ATmV0d29yayB1bnJlYWNoYWJsZQBDb25uZWN0aW9uIHJlc2V0IGJ5IG5ldHdvcmsAQ29ubmVjdGlvbiBhYm9ydGVkAE5vIGJ1ZmZlciBzcGFjZSBhdmFpbGFibGUAU29ja2V0IGlzIGNvbm5lY3RlZABTb2NrZXQgbm90IGNvbm5lY3RlZABDYW5ub3Qgc2VuZCBhZnRlciBzb2NrZXQgc2h1dGRvd24AT3BlcmF0aW9uIGFscmVhZHkgaW4gcHJvZ3Jlc3MAT3BlcmF0aW9uIGluIHByb2dyZXNzAFN0YWxlIGZpbGUgaGFuZGxlAERhdGEgY29uc2lzdGVuY3kgZXJyb3IAUmVzb3VyY2Ugbm90IGF2YWlsYWJsZQBSZW1vdGUgSS9PIGVycm9yAFF1b3RhIGV4Y2VlZGVkAE5vIG1lZGl1bSBmb3VuZABXcm9uZyBtZWRpdW0gdHlwZQBNdWx0aWhvcCBhdHRlbXB0ZWQAUmVxdWlyZWQga2V5IG5vdCBhdmFpbGFibGUAS2V5IGhhcyBleHBpcmVkAEtleSBoYXMgYmVlbiByZXZva2VkAEtleSB3YXMgcmVqZWN0ZWQgYnkgc2VydmljZQAAQfDHwAALnAHQJhAAAAAAAAUAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAADAAAAmCQQAAAAAAAAAAAAAAAAAAIAAAAAAAAAAAAAAAAAAAD//////////wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAPgjEAAAlAEPdGFyZ2V0X2ZlYXR1cmVzCCsLYnVsay1tZW1vcnkrD2J1bGstbWVtb3J5LW9wdCsWY2FsbC1pbmRpcmVjdC1vdmVybG9uZysKbXVsdGl2YWx1ZSsPbXV0YWJsZS1nbG9iYWxzKxNub250cmFwcGluZy1mcHRvaW50Kw9yZWZlcmVuY2UtdHlwZXMrCHNpZ24tZXh0');
}

function getBinarySync(file) {
  if (ArrayBuffer.isView(file)) {
    return file;
  }
  if (readBinary) {
    return readBinary(file);
  }
  // Throwing a plain string here, even though it not normally advisable since
  // this gets turning into an `abort` in instantiateArrayBuffer.
  throw 'both async and sync fetching of the wasm failed';
}

async function getWasmBinary(binaryFile) {

  // Otherwise, getBinarySync should be able to get it synchronously
  return getBinarySync(binaryFile);
}

async function instantiateArrayBuffer(binaryFile, imports) {
  try {
    var binary = await getWasmBinary(binaryFile);
    var instance = await WebAssembly.instantiate(binary, imports);
    return instance;
  } catch (reason) {
    err(`failed to asynchronously prepare wasm: ${reason}`);

    // Warn on some common problems.
    if (isFileURI(binaryFile)) {
      err(`warning: Loading from a file URI (${binaryFile}) is not supported in most browsers. See https://emscripten.org/docs/getting_started/FAQ.html#how-do-i-run-a-local-webserver-for-testing-why-does-my-program-stall-in-downloading-or-preparing`);
    }
    abort(reason);
  }
}

async function instantiateAsync(binary, binaryFile, imports) {
  return instantiateArrayBuffer(binaryFile, imports);
}

function getWasmImports() {
  // prepare imports
  var imports = {
    'env': wasmImports,
    'wasi_snapshot_preview1': wasmImports,
  };
  return imports;
}

// Create the wasm instance.
// Receives the wasm imports, returns the exports.
async function createWasm() {
  // Load the wasm module and create an instance of using native support in the JS engine.
  // handle a generated wasm instance, receiving its exports and
  // performing other necessary setup
  function receiveInstance(instance) {
    wasmExports = instance.exports;

    assignWasmExports(wasmExports);

    updateMemoryViews();

    return wasmExports;
  }

  // Prefer streaming instantiation if available.
  // Async compilation can be confusing when an error on the page overwrites Module
  // (for example, if the order of elements is wrong, and the one defining Module is
  // later), so we save Module and check it later.
  var trueModule = Module;
  function receiveInstantiationResult(result) {
    // 'result' is a ResultObject object which has both the module and instance.
    // receiveInstance() will swap in the exports (to Module.asm) so they can be called
    assert(Module === trueModule, 'the Module object should not be replaced during async compilation - perhaps the order of HTML elements is wrong?');
    trueModule = null;
    // TODO: Due to Closure regression https://github.com/google/closure-compiler/issues/3193, the above line no longer optimizes out down to the following line.
    // When the regression is fixed, can restore the above PTHREADS-enabled path.
    return receiveInstance(result['instance']);
  }

  var info = getWasmImports();

  // User shell pages can write their own Module.instantiateWasm = function(imports, successCallback) callback
  // to manually instantiate the Wasm module themselves. This allows pages to
  // run the instantiation parallel to any other async startup actions they are
  // performing.
  // Also pthreads and wasm workers initialize the wasm instance through this
  // path.
  var instantiateWasm = Module['instantiateWasm'];
  if (instantiateWasm) {
    return new Promise((resolve) => {
      try {
        instantiateWasm(info, (inst) => resolve(receiveInstance(inst)));
      } catch(e) {
        err(`Module.instantiateWasm callback failed with error: ${e}`);
        throw e;
      }
    });
  }

  wasmBinaryFile ??= findWasmBinary();
  var result = await instantiateAsync(wasmBinary, wasmBinaryFile, info);
  var exports = receiveInstantiationResult(result);
  return exports;
}

// end include: preamble.js

// Begin JS library code


  class ExitStatus {
      name = 'ExitStatus';
      constructor(status) {
        this.message = `Program terminated with exit(${status})`;
        this.status = status;
      }
    }

  /** @type {!Int16Array} */
  var HEAP16;

  /** @type {!Int32Array} */
  var HEAP32;

  /** not-@type {!BigInt64Array} */
  var HEAP64;

  /** @type {!Int8Array} */
  var HEAP8;

  /** @type {!Float32Array} */
  var HEAPF32;

  /** @type {!Float64Array} */
  var HEAPF64;

  /** @type {!Uint16Array} */
  var HEAPU16;

  /** @type {!Uint32Array} */
  var HEAPU32;

  /** not-@type {!BigUint64Array} */
  var HEAPU64;

  /** @type {!Uint8Array} */
  var HEAPU8;

  var callRuntimeCallbacks = (callbacks) => {
      while (callbacks.length > 0) {
        // Pass the module as the first argument.
        callbacks.shift()(Module);
      }
    };
  var onPostRuns = [];
  var addOnPostRun = (cb) => onPostRuns.push(cb);

  var onPreRuns = [];
  var addOnPreRun = (cb) => onPreRuns.push(cb);

  /** @noinline */
  var base64Decode = (b64) => {
      if (ENVIRONMENT_IS_NODE) {
        var buf = Buffer.from(b64, 'base64');
        return new Uint8Array(buf.buffer, buf.byteOffset, buf.length);
      }
  
      assert(b64.length % 4 == 0);
      var b1, b2, i = 0, j = 0, bLength = b64.length;
      var output = new Uint8Array((bLength*3>>2) - (b64[bLength-2] == '=') - (b64[bLength-1] == '='));
      for (; i < bLength; i += 4, j += 3) {
        b1 = base64ReverseLookup[b64.charCodeAt(i+1)];
        b2 = base64ReverseLookup[b64.charCodeAt(i+2)];
        output[j] = base64ReverseLookup[b64.charCodeAt(i)] << 2 | b1 >> 4;
        output[j+1] = b1 << 4 | b2 >> 2;
        output[j+2] = b2 << 6 | base64ReverseLookup[b64.charCodeAt(i+3)];
      }
      return output;
    };


  
    /**
   * @param {number} ptr
   * @param {string} type
   */
  function getValue(ptr, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': return HEAP8[ptr];
      case 'i8': return HEAP8[ptr];
      case 'i16': return HEAP16[((ptr)>>1)];
      case 'i32': return HEAP32[((ptr)>>2)];
      case 'i64': return HEAP64[((ptr)>>3)];
      case 'float': return HEAPF32[((ptr)>>2)];
      case 'double': return HEAPF64[((ptr)>>3)];
      case '*': return HEAPU32[((ptr)>>2)];
      default: abort(`invalid type for getValue: ${type}`);
    }
  }

  var noExitRuntime = true;

  function ptrToString(ptr) {
      assert(typeof ptr === 'number', `ptrToString expects a number, got ${typeof ptr}`);
      // Convert to 32-bit unsigned value
      ptr >>>= 0;
      return '0x' + ptr.toString(16).padStart(8, '0');
    }

  
    /**
   * @param {number} ptr
   * @param {number} value
   * @param {string} type
   */
  function setValue(ptr, value, type = 'i8') {
    if (type.endsWith('*')) type = '*';
    switch (type) {
      case 'i1': HEAP8[ptr] = value; break;
      case 'i8': HEAP8[ptr] = value; break;
      case 'i16': HEAP16[((ptr)>>1)] = value; break;
      case 'i32': HEAP32[((ptr)>>2)] = value; break;
      case 'i64': HEAP64[((ptr)>>3)] = BigInt(value); break;
      case 'float': HEAPF32[((ptr)>>2)] = value; break;
      case 'double': HEAPF64[((ptr)>>3)] = value; break;
      case '*': HEAPU32[((ptr)>>2)] = value; break;
      default: abort(`invalid type for setValue: ${type}`);
    }
  }

  var stackRestore = (val) => __emscripten_stack_restore(val);

  var stackSave = () => _emscripten_stack_get_current();

  var warnOnce = (text) => {
      warnOnce.shown ||= {};
      if (!warnOnce.shown[text]) {
        warnOnce.shown[text] = 1;
        if (ENVIRONMENT_IS_NODE) text = 'warning: ' + text;
        err(text);
      }
    };

  

  var syscallGetVarargI = () => {
      assert(SYSCALLS.varargs != undefined);
      // the `+` prepended here is necessary to convince the JSCompiler that varargs is indeed a number.
      var ret = HEAP32[((+SYSCALLS.varargs)>>2)];
      SYSCALLS.varargs += 4;
      return ret;
    };
  var syscallGetVarargP = syscallGetVarargI;
  
  
  var PATH = {
  isAbs:(path) => path.charAt(0) === '/',
  splitPath:(filename) => {
        var splitPathRe = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
        return splitPathRe.exec(filename).slice(1);
      },
  normalizeArray:(parts, allowAboveRoot) => {
        // if the path tries to go above the root, `up` ends up > 0
        var up = 0;
        for (var i = parts.length - 1; i >= 0; i--) {
          var last = parts[i];
          if (last === '.') {
            parts.splice(i, 1);
          } else if (last === '..') {
            parts.splice(i, 1);
            up++;
          } else if (up) {
            parts.splice(i, 1);
            up--;
          }
        }
        // if the path is allowed to go above the root, restore leading ..s
        if (allowAboveRoot) {
          for (; up; up--) {
            parts.unshift('..');
          }
        }
        return parts;
      },
  normalize:(path) => {
        var isAbsolute = PATH.isAbs(path),
            trailingSlash = path.slice(-1) === '/';
        // Normalize the path
        path = PATH.normalizeArray(path.split('/').filter((p) => !!p), !isAbsolute).join('/');
        if (!path && !isAbsolute) {
          path = '.';
        }
        if (path && trailingSlash) {
          path += '/';
        }
        return (isAbsolute ? '/' : '') + path;
      },
  dirname:(path) => {
        var result = PATH.splitPath(path),
            root = result[0],
            dir = result[1];
        if (!root && !dir) {
          // No dirname whatsoever
          return '.';
        }
        if (dir) {
          // It has a dirname, strip trailing slash
          dir = dir.slice(0, -1);
        }
        return root + dir;
      },
  basename:(path) => path && path.match(/([^\/]+|\/)\/*$/)[1],
join:(...paths) => PATH.normalize(paths.join('/')),
join2:(l, r) => PATH.normalize(l + '/' + r),
};

var initRandomFill = () => {
    // This block is not needed on v19+ since crypto.getRandomValues is builtin
    if (ENVIRONMENT_IS_NODE) {
      var nodeCrypto = require('node:crypto');
      return (view) => (nodeCrypto.randomFillSync(view), 0);
    }

    return (view) => (crypto.getRandomValues(view), 0);
  };
var randomFill = (view) => (randomFill = initRandomFill())(view);



var PATH_FS = {
resolve:(...args) => {
      var resolvedPath = '',
        resolvedAbsolute = false;
      for (var i = args.length - 1; i >= -1 && !resolvedAbsolute; i--) {
        var path = (i >= 0) ? args[i] : FS.cwd();
        // Skip empty and invalid entries
        if (typeof path != 'string') {
          throw new TypeError('Arguments to path.resolve must be strings');
        } else if (!path) {
          return ''; // an invalid portion invalidates the whole thing
        }
        resolvedPath = path + '/' + resolvedPath;
        resolvedAbsolute = PATH.isAbs(path);
      }
      // At this point the path should be resolved to a full absolute path, but
      // handle relative paths to be safe (might happen when process.cwd() fails)
      resolvedPath = PATH.normalizeArray(resolvedPath.split('/').filter((p) => !!p), !resolvedAbsolute).join('/');
      return ((resolvedAbsolute ? '/' : '') + resolvedPath) || '.';
    },
relative:(from, to) => {
      from = PATH_FS.resolve(from).slice(1);
      to = PATH_FS.resolve(to).slice(1);
      function trim(arr) {
        var start = 0;
        for (; start < arr.length; start++) {
          if (arr[start] !== '') break;
        }
        var end = arr.length - 1;
        for (; end >= 0; end--) {
          if (arr[end] !== '') break;
        }
        if (start > end) return [];
        return arr.slice(start, end - start + 1);
      }
      var fromParts = trim(from.split('/'));
      var toParts = trim(to.split('/'));
      var length = Math.min(fromParts.length, toParts.length);
      var samePartsLength = length;
      for (var i = 0; i < length; i++) {
        if (fromParts[i] !== toParts[i]) {
          samePartsLength = i;
          break;
        }
      }
      var outputParts = [];
      for (var i = samePartsLength; i < fromParts.length; i++) {
        outputParts.push('..');
      }
      outputParts = outputParts.concat(toParts.slice(samePartsLength));
      return outputParts.join('/');
    },
};


var UTF8Decoder = globalThis.TextDecoder && new TextDecoder();


  /**
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul
   * @return {number}
   */
  var findStringEnd = (heapOrArray, idx, maxBytesToRead, ignoreNul) => {
      var maxIdx = idx + maxBytesToRead;
      if (ignoreNul) return maxIdx;
      // TextDecoder needs to know the byte length in advance, it doesn't stop on
      // null terminator by itself.
      // As a tiny code save trick, compare idx against maxIdx using a negation,
      // so that maxBytesToRead=undefined/NaN means Infinity.
      while (heapOrArray[idx] && !(idx >= maxIdx)) ++idx;
      return idx;
    };
  
  
    /**
   * Given a pointer 'idx' to a null-terminated UTF8-encoded string in the given
   * array that contains uint8 values, returns a copy of that string as a
   * Javascript String object.
   * heapOrArray is either a regular array, or a JavaScript typed array view.
   * @param {number=} idx
   * @param {number=} maxBytesToRead
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ArrayToString = (heapOrArray, idx = 0, maxBytesToRead, ignoreNul) => {
  
      var endPtr = findStringEnd(heapOrArray, idx, maxBytesToRead, ignoreNul);
  
      // When using conditional TextDecoder, skip it for short strings as the overhead of the native call is not worth it.
      if (endPtr - idx > 16 && heapOrArray.buffer && UTF8Decoder) {
        return UTF8Decoder.decode(heapOrArray.subarray(idx, endPtr));
      }
      var str = '';
      while (idx < endPtr) {
        // For UTF8 byte structure, see:
        // http://en.wikipedia.org/wiki/UTF-8#Description
        // https://www.ietf.org/rfc/rfc2279.txt
        // https://tools.ietf.org/html/rfc3629
        var u0 = heapOrArray[idx++];
        if (!(u0 & 0x80)) { str += String.fromCharCode(u0); continue; }
        var u1 = heapOrArray[idx++] & 63;
        if ((u0 & 0xE0) == 0xC0) { str += String.fromCharCode(((u0 & 31) << 6) | u1); continue; }
        var u2 = heapOrArray[idx++] & 63;
        if ((u0 & 0xF0) == 0xE0) {
          u0 = ((u0 & 15) << 12) | (u1 << 6) | u2;
        } else {
          if ((u0 & 0xF8) != 0xF0) warnOnce(`Invalid UTF-8 leading byte ${ptrToString(u0)} encountered when deserializing a UTF-8 string in wasm memory to a JS string!`);
          u0 = ((u0 & 7) << 18) | (u1 << 12) | (u2 << 6) | (heapOrArray[idx++] & 63);
        }
  
        if (u0 < 0x10000) {
          str += String.fromCharCode(u0);
        } else {
          var ch = u0 - 0x10000;
          str += String.fromCharCode(0xD800 | (ch >> 10), 0xDC00 | (ch & 0x3FF));
        }
      }
      return str;
    };
  
  var FS_stdin_getChar_buffer = [];
  
  var lengthBytesUTF8 = (str) => {
      var len = 0;
      for (var i = 0; i < str.length; ++i) {
        // Gotcha: charCodeAt returns a 16-bit word that is a UTF-16 encoded code
        // unit, not a Unicode code point of the character! So decode
        // UTF16->UTF32->UTF8.
        // See http://unicode.org/faq/utf_bom.html#utf16-3
        var c = str.charCodeAt(i); // possibly a lead surrogate
        if (c <= 0x7F) {
          len++;
        } else if (c <= 0x7FF) {
          len += 2;
        } else if (c >= 0xD800 && c <= 0xDFFF) {
          len += 4; ++i;
        } else {
          len += 3;
        }
      }
      return len;
    };
  
  var stringToUTF8Array = (str, heap, outIdx, maxBytesToWrite) => {
      assert(typeof str === 'string', `stringToUTF8Array expects a string (got ${typeof str})`);
      // Parameter maxBytesToWrite is not optional. Negative values, 0, null,
      // undefined and false each don't write out any bytes.
      if (!(maxBytesToWrite > 0))
        return 0;
  
      var startIdx = outIdx;
      var endIdx = outIdx + maxBytesToWrite - 1; // -1 for string null terminator.
      for (var i = 0; i < str.length; ++i) {
        // For UTF8 byte structure, see http://en.wikipedia.org/wiki/UTF-8#Description
        // and https://www.ietf.org/rfc/rfc2279.txt
        // and https://tools.ietf.org/html/rfc3629
        var u = str.codePointAt(i);
        if (u <= 0x7F) {
          if (outIdx >= endIdx) break;
          heap[outIdx++] = u;
        } else if (u <= 0x7FF) {
          if (outIdx + 1 >= endIdx) break;
          heap[outIdx++] = 0xC0 | (u >> 6);
          heap[outIdx++] = 0x80 | (u & 63);
        } else if (u <= 0xFFFF) {
          if (outIdx + 2 >= endIdx) break;
          heap[outIdx++] = 0xE0 | (u >> 12);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
        } else {
          if (outIdx + 3 >= endIdx) break;
          if (u > 0x10FFFF) warnOnce(`Invalid Unicode code point ${ptrToString(u)} encountered when serializing a JS string to a UTF-8 string in wasm memory! (Valid unicode code points should be in range 0-0x10FFFF).`);
          heap[outIdx++] = 0xF0 | (u >> 18);
          heap[outIdx++] = 0x80 | ((u >> 12) & 63);
          heap[outIdx++] = 0x80 | ((u >> 6) & 63);
          heap[outIdx++] = 0x80 | (u & 63);
          // Gotcha: if codePoint is over 0xFFFF, it is represented as a surrogate pair in UTF-16.
          // We need to manually skip over the second code unit for correct iteration.
          i++;
        }
      }
      // Null-terminate the pointer to the buffer.
      heap[outIdx] = 0;
      return outIdx - startIdx;
    };
  /** @type {function(string, boolean=, number=)} */
  var intArrayFromString = (stringy, dontAddNull, length) => {
      var len = length > 0 ? length : lengthBytesUTF8(stringy)+1;
      var u8array = new Array(len);
      var numBytesWritten = stringToUTF8Array(stringy, u8array, 0, u8array.length);
      if (dontAddNull) u8array.length = numBytesWritten;
      return u8array;
    };
  var FS_stdin_getChar = () => {
      if (!FS_stdin_getChar_buffer.length) {
        var result = null;
        if (ENVIRONMENT_IS_NODE) {
          // we will read data by chunks of BUFSIZE
          var BUFSIZE = 256;
          var buf = Buffer.alloc(BUFSIZE);
          var bytesRead = 0;
  
          // For some reason we must suppress a closure warning here, even though
          // fd definitely exists on process.stdin, and is even the proper way to
          // get the fd of stdin,
          // https://github.com/nodejs/help/issues/2136#issuecomment-523649904
          // This started to happen after moving this logic out of library_tty.js,
          // so it is related to the surrounding code in some unclear manner.
          /** @suppress {missingProperties} */
          var fd = process.stdin.fd;
  
          try {
            bytesRead = fs.readSync(fd, buf, 0, BUFSIZE);
          } catch(e) {
            // Cross-platform differences: on Windows, reading EOF throws an
            // exception, but on other OSes, reading EOF returns 0. Uniformize
            // behavior by treating the EOF exception to return 0.
            if (e.toString().includes('EOF')) bytesRead = 0;
            else throw e;
          }
  
          if (bytesRead > 0) {
            result = buf.slice(0, bytesRead).toString('utf-8');
          }
        } else
        if (globalThis.window?.prompt) {
          // Browser.
          result = window.prompt('Input: ');  // returns null on cancel
          if (result !== null) {
            result += '\n';
          }
        } else
        {}
        if (!result) {
          return null;
        }
        FS_stdin_getChar_buffer = intArrayFromString(result, true);
      }
      return FS_stdin_getChar_buffer.shift();
    };
  var TTY = {
  ttys:[],
  init() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // currently, FS.init does not distinguish if process.stdin is a file or TTY
        //   // device, it always assumes it's a TTY device. because of this, we're forcing
        //   // process.stdin to UTF8 encoding to at least make stdin reading compatible
        //   // with text files until FS.init can be refactored.
        //   process.stdin.setEncoding('utf8');
        // }
      },
  shutdown() {
        // https://github.com/emscripten-core/emscripten/pull/1555
        // if (ENVIRONMENT_IS_NODE) {
        //   // inolen: any idea as to why node -e 'process.stdin.read()' wouldn't exit immediately (with process.stdin being a tty)?
        //   // isaacs: because now it's reading from the stream, you've expressed interest in it, so that read() kicks off a _read() which creates a ReadReq operation
        //   // inolen: I thought read() in that case was a synchronous operation that just grabbed some amount of buffered data if it exists?
        //   // isaacs: it is. but it also triggers a _read() call, which calls readStart() on the handle
        //   // isaacs: do process.stdin.pause() and i'd think it'd probably close the pending call
        //   process.stdin.pause();
        // }
      },
  register(dev, ops) {
        TTY.ttys[dev] = { input: [], output: [], ops: ops };
        FS.registerDevice(dev, TTY.stream_ops);
      },
  stream_ops:{
  open(stream) {
          var tty = TTY.ttys[stream.node.rdev];
          if (!tty) {
            throw new FS.ErrnoError(43);
          }
          stream.tty = tty;
          stream.seekable = false;
        },
  close(stream) {
          // flush any pending line data
          stream.tty.ops.fsync(stream.tty);
        },
  fsync(stream) {
          stream.tty.ops.fsync(stream.tty);
        },
  read(stream, buffer, offset, length, pos /* ignored */) {
          if (!stream.tty || !stream.tty.ops.get_char) {
            throw new FS.ErrnoError(60);
          }
          var bytesRead = 0;
          for (var i = 0; i < length; i++) {
            var result;
            try {
              result = stream.tty.ops.get_char(stream.tty);
            } catch (e) {
              throw new FS.ErrnoError(29);
            }
            if (result === undefined && bytesRead === 0) {
              throw new FS.ErrnoError(6);
            }
            if (result === null || result === undefined) break;
            bytesRead++;
            buffer[offset+i] = result;
          }
          if (bytesRead) {
            stream.node.atime = Date.now();
          }
          return bytesRead;
        },
  write(stream, buffer, offset, length, pos) {
          if (!stream.tty || !stream.tty.ops.put_char) {
            throw new FS.ErrnoError(60);
          }
          try {
            for (var i = 0; i < length; i++) {
              stream.tty.ops.put_char(stream.tty, buffer[offset+i]);
            }
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
          if (length) {
            stream.node.mtime = stream.node.ctime = Date.now();
          }
          return i;
        },
  },
  default_tty_ops:{
  get_char(tty) {
          return FS_stdin_getChar();
        },
  put_char(tty, val) {
          if (val === null || val === 10) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val); // val == 0 would cut text output off in the middle.
          }
        },
  fsync(tty) {
          if (tty.output?.length > 0) {
            out(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        },
  ioctl_tcgets(tty) {
          // typical setting
          return {
            c_iflag: 25856,
            c_oflag: 5,
            c_cflag: 191,
            c_lflag: 35387,
            c_cc: [
              0x03, 0x1c, 0x7f, 0x15, 0x04, 0x00, 0x01, 0x00, 0x11, 0x13, 0x1a, 0x00,
              0x12, 0x0f, 0x17, 0x16, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
              0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00,
            ]
          };
        },
  ioctl_tcsets(tty, optional_actions, data) {
          // currently just ignore
          return 0;
        },
  ioctl_tiocgwinsz(tty) {
          return [24, 80];
        },
  },
  default_tty1_ops:{
  put_char(tty, val) {
          if (val === null || val === 10) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          } else {
            if (val != 0) tty.output.push(val);
          }
        },
  fsync(tty) {
          if (tty.output?.length > 0) {
            err(UTF8ArrayToString(tty.output));
            tty.output = [];
          }
        },
  },
  };
  
  
  var mmapAlloc = (size) => {
      abort('internal error: mmapAlloc called but `emscripten_builtin_memalign` native symbol not exported');
    };
  var MEMFS = {
  ops_table:null,
  mount(mount) {
        return MEMFS.createNode(null, '/', 16895, 0);
      },
  createNode(parent, name, mode, dev) {
        if (FS.isBlkdev(mode) || FS.isFIFO(mode)) {
          // not supported
          throw new FS.ErrnoError(63);
        }
        MEMFS.ops_table ||= {
          dir: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              lookup: MEMFS.node_ops.lookup,
              mknod: MEMFS.node_ops.mknod,
              rename: MEMFS.node_ops.rename,
              unlink: MEMFS.node_ops.unlink,
              rmdir: MEMFS.node_ops.rmdir,
              readdir: MEMFS.node_ops.readdir,
              symlink: MEMFS.node_ops.symlink
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek
            }
          },
          file: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: {
              llseek: MEMFS.stream_ops.llseek,
              read: MEMFS.stream_ops.read,
              write: MEMFS.stream_ops.write,
              mmap: MEMFS.stream_ops.mmap,
              msync: MEMFS.stream_ops.msync
            }
          },
          link: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr,
              readlink: MEMFS.node_ops.readlink
            },
            stream: {}
          },
          chrdev: {
            node: {
              getattr: MEMFS.node_ops.getattr,
              setattr: MEMFS.node_ops.setattr
            },
            stream: FS.chrdev_stream_ops
          }
        };
        var node = FS.createNode(parent, name, mode, dev);
        if (FS.isDir(node.mode)) {
          node.node_ops = MEMFS.ops_table.dir.node;
          node.stream_ops = MEMFS.ops_table.dir.stream;
          node.contents = {};
        } else if (FS.isFile(node.mode)) {
          node.node_ops = MEMFS.ops_table.file.node;
          node.stream_ops = MEMFS.ops_table.file.stream;
          // The actual number of bytes used in the typed array, as opposed to
          // contents.length which gives the whole capacity.
          node.usedBytes = 0;
          // The byte data of the file is stored in a typed array.
          // Note: typed arrays are not resizable like normal JS arrays are, so
          // there is a small penalty involved for appending file writes that
          // continuously grow a file similar to std::vector capacity vs used.
          node.contents = MEMFS.emptyFileContents ??= new Uint8Array(0);
        } else if (FS.isLink(node.mode)) {
          node.node_ops = MEMFS.ops_table.link.node;
          node.stream_ops = MEMFS.ops_table.link.stream;
        } else if (FS.isChrdev(node.mode)) {
          node.node_ops = MEMFS.ops_table.chrdev.node;
          node.stream_ops = MEMFS.ops_table.chrdev.stream;
        }
        node.atime = node.mtime = node.ctime = Date.now();
        // add the new node to the parent
        if (parent) {
          parent.contents[name] = node;
          parent.atime = parent.mtime = parent.ctime = node.atime;
        }
        return node;
      },
  getFileDataAsTypedArray(node) {
        assert(FS.isFile(node.mode), 'getFileDataAsTypedArray called on non-file');
        return node.contents.subarray(0, node.usedBytes); // Make sure to not return excess unused bytes.
      },
  expandFileStorage(node, newCapacity) {
        var prevCapacity = node.contents.length;
        if (prevCapacity >= newCapacity) return; // No need to expand, the storage was already large enough.
        // Don't expand strictly to the given requested limit if it's only a very
        // small increase, but instead geometrically grow capacity.
        // For small filesizes (<1MB), perform size*2 geometric increase, but for
        // large sizes, do a much more conservative size*1.125 increase to avoid
        // overshooting the allocation cap by a very large margin.
        var CAPACITY_DOUBLING_MAX = 1024 * 1024;
        newCapacity = Math.max(newCapacity, (prevCapacity * (prevCapacity < CAPACITY_DOUBLING_MAX ? 2.0 : 1.125)) >>> 0);
        if (prevCapacity) newCapacity = Math.max(newCapacity, 256); // At minimum allocate 256b for each file when expanding.
        var oldContents = MEMFS.getFileDataAsTypedArray(node);
        node.contents = new Uint8Array(newCapacity); // Allocate new storage.
        node.contents.set(oldContents);
      },
  resizeFileStorage(node, newSize) {
        if (node.usedBytes == newSize) return;
        var oldContents = node.contents;
        node.contents = new Uint8Array(newSize); // Allocate new storage.
        node.contents.set(oldContents.subarray(0, Math.min(newSize, node.usedBytes))); // Copy old data over to the new storage.
        node.usedBytes = newSize;
      },
  node_ops:{
  getattr(node) {
          var attr = {};
          // device numbers reuse inode numbers.
          attr.dev = FS.isChrdev(node.mode) ? node.id : 1;
          attr.ino = node.id;
          attr.mode = node.mode;
          attr.nlink = 1;
          attr.uid = 0;
          attr.gid = 0;
          attr.rdev = node.rdev;
          if (FS.isDir(node.mode)) {
            attr.size = 4096;
          } else if (FS.isFile(node.mode)) {
            attr.size = node.usedBytes;
          } else if (FS.isLink(node.mode)) {
            attr.size = node.link.length;
          } else {
            attr.size = 0;
          }
          attr.atime = new Date(node.atime);
          attr.mtime = new Date(node.mtime);
          attr.ctime = new Date(node.ctime);
          // NOTE: In our implementation, st_blocks = Math.ceil(st_size/st_blksize),
          //       but this is not required by the standard.
          attr.blksize = 4096;
          attr.blocks = Math.ceil(attr.size / attr.blksize);
          return attr;
        },
  setattr(node, attr) {
          for (const key of ["mode", "atime", "mtime", "ctime"]) {
            if (attr[key] != null) {
              node[key] = attr[key];
            }
          }
          if (attr.size !== undefined) {
            MEMFS.resizeFileStorage(node, attr.size);
          }
        },
  lookup(parent, name) {
          throw new FS.ErrnoError(44);
        },
  mknod(parent, name, mode, dev) {
          return MEMFS.createNode(parent, name, mode, dev);
        },
  rename(old_node, new_dir, new_name) {
          var new_node;
          try {
            new_node = FS.lookupNode(new_dir, new_name);
          } catch (e) {}
          if (new_node) {
            if (FS.isDir(old_node.mode)) {
              // if we're overwriting a directory at new_name, make sure it's empty.
              for (var i in new_node.contents) {
                throw new FS.ErrnoError(55);
              }
            }
            FS.hashRemoveNode(new_node);
          }
          // do the internal rewiring
          delete old_node.parent.contents[old_node.name];
          new_dir.contents[new_name] = old_node;
          old_node.name = new_name;
          new_dir.ctime = new_dir.mtime = old_node.parent.ctime = old_node.parent.mtime = Date.now();
        },
  unlink(parent, name) {
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        },
  rmdir(parent, name) {
          var node = FS.lookupNode(parent, name);
          for (var i in node.contents) {
            throw new FS.ErrnoError(55);
          }
          delete parent.contents[name];
          parent.ctime = parent.mtime = Date.now();
        },
  readdir(node) {
          return ['.', '..', ...Object.keys(node.contents)];
        },
  symlink(parent, newname, oldpath) {
          var node = MEMFS.createNode(parent, newname, 0o777 | 40960, 0);
          node.link = oldpath;
          return node;
        },
  readlink(node) {
          if (!FS.isLink(node.mode)) {
            throw new FS.ErrnoError(28);
          }
          return node.link;
        },
  },
  stream_ops:{
  read(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= stream.node.usedBytes) return 0;
          var size = Math.min(stream.node.usedBytes - position, length);
          assert(size >= 0);
          buffer.set(contents.subarray(position, position + size), offset);
          return size;
        },
  write(stream, buffer, offset, length, position, canOwn) {
          assert(buffer.subarray, 'FS.write expects a TypedArray');
          // If the buffer is located in main memory (HEAP), and if
          // memory can grow, we can't hold on to references of the
          // memory buffer, as they may get invalidated. That means we
          // need to copy its contents.
          if (buffer.buffer === HEAP8.buffer) {
            canOwn = false;
          }
  
          if (!length) return 0;
          var node = stream.node;
          node.mtime = node.ctime = Date.now();
  
          if (canOwn) {
            assert(position === 0, 'canOwn must imply no weird position inside the file');
            node.contents = buffer.subarray(offset, offset + length);
            node.usedBytes = length;
          } else if (node.usedBytes === 0 && position === 0) { // If this is a simple first write to an empty file, do a fast set since we don't need to care about old data.
            node.contents = buffer.slice(offset, offset + length);
            node.usedBytes = length;
          } else {
            MEMFS.expandFileStorage(node, position+length);
            // Use typed array write which is available.
            node.contents.set(buffer.subarray(offset, offset + length), position);
            node.usedBytes = Math.max(node.usedBytes, position + length);
          }
          return length;
        },
  llseek(stream, offset, whence) {
          var position = offset;
          if (whence === 1) {
            position += stream.position;
          } else if (whence === 2) {
            if (FS.isFile(stream.node.mode)) {
              position += stream.node.usedBytes;
            }
          }
          if (position < 0) {
            throw new FS.ErrnoError(28);
          }
          return position;
        },
  mmap(stream, length, position, prot, flags) {
          if (!FS.isFile(stream.node.mode)) {
            throw new FS.ErrnoError(43);
          }
          var ptr;
          var allocated;
          var contents = stream.node.contents;
          // Only make a new copy when MAP_PRIVATE is specified.
          if (!(flags & 2) && contents.buffer === HEAP8.buffer) {
            // We can't emulate MAP_SHARED when the file is not backed by the
            // buffer we're mapping to (e.g. the HEAP buffer).
            allocated = false;
            ptr = contents.byteOffset;
          } else {
            allocated = true;
            ptr = mmapAlloc(length);
            if (!ptr) {
              throw new FS.ErrnoError(48);
            }
            if (contents) {
              // Try to avoid unnecessary slices.
              if (position > 0 || position + length < contents.length) {
                if (contents.subarray) {
                  contents = contents.subarray(position, position + length);
                } else {
                  contents = Array.prototype.slice.call(contents, position, position + length);
                }
              }
              HEAP8.set(contents, ptr);
            }
          }
          return { ptr, allocated };
        },
  msync(stream, buffer, offset, length, mmapFlags) {
          MEMFS.stream_ops.write(stream, buffer, 0, length, offset, false);
          // should we check if bytesWritten and length are the same?
          return 0;
        },
  },
  };
  
  var FS_modeStringToFlags = (str) => {
      if (typeof str != 'string') return str;
      var flagModes = {
        'r': 0,
        'r+': 2,
        'w': 512 | 64 | 1,
        'w+': 512 | 64 | 2,
        'a': 1024 | 64 | 1,
        'a+': 1024 | 64 | 2,
      };
      var flags = flagModes[str];
      if (typeof flags == 'undefined') {
        throw new Error(`Unknown file open mode: ${str}`);
      }
      return flags;
    };
  
  var FS_fileDataToTypedArray = (data) => {
      if (typeof data == 'string') {
        data = intArrayFromString(data, true);
      }
      if (!data.subarray) {
        data = new Uint8Array(data);
      }
      return data;
    };
  
  var FS_getMode = (canRead, canWrite) => {
      var mode = 0;
      if (canRead) mode |= 292 | 73;
      if (canWrite) mode |= 146;
      return mode;
    };
  
  
  
  
    /**
   * Given a pointer 'ptr' to a null-terminated UTF8-encoded string in the
   * emscripten HEAP, returns a copy of that string as a Javascript String object.
   *
   * @param {number} ptr
   * @param {number=} maxBytesToRead - An optional length that specifies the
   *   maximum number of bytes to read. You can omit this parameter to scan the
   *   string until the first 0 byte. If maxBytesToRead is passed, and the string
   *   at [ptr, ptr+maxBytesToReadr[ contains a null byte in the middle, then the
   *   string will cut short at that byte index.
   * @param {boolean=} ignoreNul - If true, the function will not stop on a NUL character.
   * @return {string}
   */
  var UTF8ToString = (ptr, maxBytesToRead, ignoreNul) => {
      assert(typeof ptr == 'number', `UTF8ToString expects a number (got ${typeof ptr})`);
      return ptr ? UTF8ArrayToString(HEAPU8, ptr, maxBytesToRead, ignoreNul) : '';
    };
  
  var strError = (errno) => UTF8ToString(_strerror(errno));
  
  var ERRNO_CODES = {
      'EPERM': 63,
      'ENOENT': 44,
      'ESRCH': 71,
      'EINTR': 27,
      'EIO': 29,
      'ENXIO': 60,
      'E2BIG': 1,
      'ENOEXEC': 45,
      'EBADF': 8,
      'ECHILD': 12,
      'EAGAIN': 6,
      'EWOULDBLOCK': 6,
      'ENOMEM': 48,
      'EACCES': 2,
      'EFAULT': 21,
      'ENOTBLK': 105,
      'EBUSY': 10,
      'EEXIST': 20,
      'EXDEV': 75,
      'ENODEV': 43,
      'ENOTDIR': 54,
      'EISDIR': 31,
      'EINVAL': 28,
      'ENFILE': 41,
      'EMFILE': 33,
      'ENOTTY': 59,
      'ETXTBSY': 74,
      'EFBIG': 22,
      'ENOSPC': 51,
      'ESPIPE': 70,
      'EROFS': 69,
      'EMLINK': 34,
      'EPIPE': 64,
      'EDOM': 18,
      'ERANGE': 68,
      'ENOMSG': 49,
      'EIDRM': 24,
      'ECHRNG': 106,
      'EL2NSYNC': 156,
      'EL3HLT': 107,
      'EL3RST': 108,
      'ELNRNG': 109,
      'EUNATCH': 110,
      'ENOCSI': 111,
      'EL2HLT': 112,
      'EDEADLK': 16,
      'ENOLCK': 46,
      'EBADE': 113,
      'EBADR': 114,
      'EXFULL': 115,
      'ENOANO': 104,
      'EBADRQC': 103,
      'EBADSLT': 102,
      'EDEADLOCK': 16,
      'EBFONT': 101,
      'ENOSTR': 100,
      'ENODATA': 116,
      'ETIME': 117,
      'ENOSR': 118,
      'ENONET': 119,
      'ENOPKG': 120,
      'EREMOTE': 121,
      'ENOLINK': 47,
      'EADV': 122,
      'ESRMNT': 123,
      'ECOMM': 124,
      'EPROTO': 65,
      'EMULTIHOP': 36,
      'EDOTDOT': 125,
      'EBADMSG': 9,
      'ENOTUNIQ': 126,
      'EBADFD': 127,
      'EREMCHG': 128,
      'ELIBACC': 129,
      'ELIBBAD': 130,
      'ELIBSCN': 131,
      'ELIBMAX': 132,
      'ELIBEXEC': 133,
      'ENOSYS': 52,
      'ENOTEMPTY': 55,
      'ENAMETOOLONG': 37,
      'ELOOP': 32,
      'EOPNOTSUPP': 138,
      'EPFNOSUPPORT': 139,
      'ECONNRESET': 15,
      'ENOBUFS': 42,
      'EAFNOSUPPORT': 5,
      'EPROTOTYPE': 67,
      'ENOTSOCK': 57,
      'ENOPROTOOPT': 50,
      'ESHUTDOWN': 140,
      'ECONNREFUSED': 14,
      'EADDRINUSE': 3,
      'ECONNABORTED': 13,
      'ENETUNREACH': 40,
      'ENETDOWN': 38,
      'ETIMEDOUT': 73,
      'EHOSTDOWN': 142,
      'EHOSTUNREACH': 23,
      'EINPROGRESS': 26,
      'EALREADY': 7,
      'EDESTADDRREQ': 17,
      'EMSGSIZE': 35,
      'EPROTONOSUPPORT': 66,
      'ESOCKTNOSUPPORT': 137,
      'EADDRNOTAVAIL': 4,
      'ENETRESET': 39,
      'EISCONN': 30,
      'ENOTCONN': 53,
      'ETOOMANYREFS': 141,
      'EUSERS': 136,
      'EDQUOT': 19,
      'ESTALE': 72,
      'ENOTSUP': 138,
      'ENOMEDIUM': 148,
      'EILSEQ': 25,
      'EOVERFLOW': 61,
      'ECANCELED': 11,
      'ENOTRECOVERABLE': 56,
      'EOWNERDEAD': 62,
      'ESTRPIPE': 135,
    };
  
  var asyncLoad = async (url) => {
      var arrayBuffer = await readAsync(url);
      assert(arrayBuffer, `Loading data file "${url}" failed (no arrayBuffer).`);
      return new Uint8Array(arrayBuffer);
    };
  
  
  var FS_createDataFile = (...args) => FS.createDataFile(...args);
  
  var getUniqueRunDependency = (id) => {
      var orig = id;
      while (1) {
        if (!runDependencyTracking[id]) return id;
        id = orig + Math.random();
      }
    };
  
  var dependenciesPromise = null;
  var resolveRunDependencies = async () => dependenciesPromise;
  var runDependencies = 0;
  
  
  var dependenciesPromiseResolve = null;
  
  var runDependencyTracking = {
  };
  
  var runDependencyWatcher = null;
  var removeRunDependency = (id) => {
      runDependencies--;
  
      Module['monitorRunDependencies']?.(runDependencies);
  
      assert(id, 'removeRunDependency requires an ID');
      assert(runDependencyTracking[id]);
      delete runDependencyTracking[id];
      if (!runDependencies) {
        if (runDependencyWatcher !== null) {
          clearInterval(runDependencyWatcher);
          runDependencyWatcher = null;
        }
        dependenciesPromiseResolve();
      }
    };
  
  
  
  
  var addRunDependency = (id) => {
      if (!runDependencies) {
        dependenciesPromise = new Promise((resolve) => dependenciesPromiseResolve = resolve);
      }
      runDependencies++;
  
      Module['monitorRunDependencies']?.(runDependencies);
  
      assert(id, 'addRunDependency requires an ID')
      assert(!runDependencyTracking[id]);
      runDependencyTracking[id] = 1;
      if (runDependencyWatcher === null && globalThis.setInterval) {
        // Check for missing dependencies every few seconds
        runDependencyWatcher = setInterval(() => {
          if (ABORT) {
            clearInterval(runDependencyWatcher);
            runDependencyWatcher = null;
            return;
          }
          var shown = false;
          for (var dep in runDependencyTracking) {
            if (!shown) {
              shown = true;
              err('still waiting on run dependencies:');
            }
            err(`dependency: ${dep}`);
          }
          if (shown) {
            err('(end of list)');
          }
        }, 10000);
        // Prevent this timer from keeping the runtime alive if nothing
        // else is.
        runDependencyWatcher.unref?.()
      }
    };
  
  
  var preloadPlugins = [];
  var FS_handledByPreloadPlugin = async (byteArray, fullname) => {
      // Ensure plugins are ready.
      if (typeof Browser != 'undefined') Browser.init();
  
      for (var plugin of preloadPlugins) {
        if (plugin['canHandle'](fullname)) {
          assert(plugin['handle'].constructor.name === 'AsyncFunction', 'Filesystem plugin handlers must be async functions (See #24914)')
          return plugin['handle'](byteArray, fullname);
        }
      }
      // If no plugin handled this file then return the original/unmodified
      // byteArray.
      return byteArray;
    };
  var FS_preloadFile = async (parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish) => {
      // TODO we should allow people to just pass in a complete filename instead
      // of parent and name being that we just join them anyways
      var fullname = name ? PATH_FS.resolve(PATH.join2(parent, name)) : parent;
      var dep = getUniqueRunDependency(`cp ${fullname}`); // might have several active requests for the same fullname
      addRunDependency(dep);
  
      try {
        var byteArray = url;
        if (typeof url == 'string') {
          byteArray = await asyncLoad(url);
        }
  
        byteArray = await FS_handledByPreloadPlugin(byteArray, fullname);
        preFinish?.();
        if (!dontCreateFile) {
          FS_createDataFile(parent, name, byteArray, canRead, canWrite, canOwn);
        }
      } finally {
        removeRunDependency(dep);
      }
    };
  var FS_createPreloadedFile = (parent, name, url, canRead, canWrite, onload, onerror, dontCreateFile, canOwn, preFinish) => {
      FS_preloadFile(parent, name, url, canRead, canWrite, dontCreateFile, canOwn, preFinish).then(onload).catch(onerror);
    };
  var FS = {
  root:null,
  mounts:[],
  devices:{
  },
  streams:[],
  nextInode:1,
  nameTable:null,
  currentPath:"/",
  initialized:false,
  ignorePermissions:true,
  filesystems:null,
  syncFSRequests:0,
  ErrnoError:class extends Error {
        name = 'ErrnoError';
        // We set the `name` property to be able to identify `FS.ErrnoError`
        // - the `name` is a standard ECMA-262 property of error objects. Kind of good to have it anyway.
        // - when using PROXYFS, an error can come from an underlying FS
        // as different FS objects have their own FS.ErrnoError each,
        // the test `err instanceof FS.ErrnoError` won't detect an error coming from another filesystem, causing bugs.
        // we'll use the reliable test `err.name == "ErrnoError"` instead
        constructor(errno) {
          super(runtimeInitialized ? strError(errno) : '');
          this.errno = errno;
          for (var key in ERRNO_CODES) {
            if (ERRNO_CODES[key] === errno) {
              this.code = key;
              break;
            }
          }
        }
      },
  FSStream:class {
        shared = {};
        get object() {
          return this.node;
        }
        set object(val) {
          this.node = val;
        }
        get isRead() {
          return (this.flags & 2097155) !== 1;
        }
        get isWrite() {
          return (this.flags & 2097155) !== 0;
        }
        get isAppend() {
          return (this.flags & 1024);
        }
        get flags() {
          return this.shared.flags;
        }
        set flags(val) {
          this.shared.flags = val;
        }
        get position() {
          return this.shared.position;
        }
        set position(val) {
          this.shared.position = val;
        }
      },
  FSNode:class {
        node_ops = {};
        stream_ops = {};
        readMode = 292 | 73;
        writeMode = 146;
        mounted = null;
        constructor(parent, name, mode, rdev) {
          if (!parent) {
            parent = this;  // root node sets parent to itself
          }
          this.parent = parent;
          this.mount = parent.mount;
          this.id = FS.nextInode++;
          this.name = name;
          this.mode = mode;
          this.rdev = rdev;
          this.atime = this.mtime = this.ctime = Date.now();
        }
        get read() {
          return (this.mode & this.readMode) === this.readMode;
        }
        set read(val) {
          val ? this.mode |= this.readMode : this.mode &= ~this.readMode;
        }
        get write() {
          return (this.mode & this.writeMode) === this.writeMode;
        }
        set write(val) {
          val ? this.mode |= this.writeMode : this.mode &= ~this.writeMode;
        }
        get isFolder() {
          return FS.isDir(this.mode);
        }
        get isDevice() {
          return FS.isChrdev(this.mode);
        }
        // The per-inode readiness wait-queue. The node carries a Set of listener
        // entries {cb}; producers (SOCKFS, PIPEFS) call notifyListeners on a
        // readiness transition, and poll()/epoll consume it. It lives on the node
        // (not the fd) so dup'd fds share one queue. Only nodes that derive real
        // readiness (sockets, pipes, and an epoll's own node) ever use this -
        // always-ready types (regular files, ttys) never register or notify.
        addListener(cb, exclusive = false) {
          var entry = {cb, exclusive};
          var listeners = (this.listeners ??= new Set());
          listeners.add(entry);
          return {listeners, entry};
        }
        notifyListeners(flags) {
          // Iterates the set without copying, which is safe ONLY under a
          // load-bearing contract that every internal listener must honour:
          //   1. A listener must not run user code synchronously (a poll waiter only
          //      resolves a Promise; an epoll registration only re-lists +
          //      re-notifies; the epoll callback only schedules a tick). User code
          //      runs on a later tick, never inside this loop.
          //   2. A listener may delete entries only from ITS OWN waiter, never from
          //      a sibling node's set that may be mid-iteration. (Deleting an entry
          //      of the set being iterated here is fine - a Set tolerates removal of
          //      a not-yet-visited entry mid-iteration; mutating a *different* node's
          //      set is fine because that set is not being iterated.)
          // Violating either gives silently skipped wakeups that are near-impossible
          // to reproduce. Any new producer/listener must preserve it.
          if (!this.listeners) return;
          // Fire every non-exclusive listener. Among EPOLLEXCLUSIVE registrations
          // (one fd watched by several epolls) wake only one, rotating round-robin
          // per node, to avoid a thundering herd. (Only epoll registrations are ever
          // exclusive; poll waiters and a node's own consumers are not.)
          var excl;
          for (var entry of this.listeners) {
            if (entry.exclusive) (excl ||= []).push(entry);
            else entry.cb(flags);
          }
          if (excl) {
            var i = (this.exclTurn || 0) % excl.length;
            this.exclTurn = i + 1;
            excl[i].cb(flags);
          }
        }
      },
  lookupPath(path, opts = {}) {
        if (!path) {
          throw new FS.ErrnoError(44);
        }
        opts.follow_mount ??= true
  
        if (!PATH.isAbs(path)) {
          path = FS.cwd() + '/' + path;
        }
  
        // limit max consecutive symlinks to SYMLOOP_MAX.
        linkloop: for (var nlinks = 0; nlinks < 40; nlinks++) {
          // split the absolute path
          var parts = path.split('/').filter((p) => !!p);
  
          // start at the root
          var current = FS.root;
          var current_path = '/';
  
          for (var i = 0; i < parts.length; i++) {
            var islast = (i === parts.length-1);
            if (islast && opts.parent) {
              // stop resolving
              break;
            }
  
            if (parts[i] === '.') {
              continue;
            }
  
            if (parts[i] === '..') {
              current_path = PATH.dirname(current_path);
              if (FS.isRoot(current)) {
                path = current_path + '/' + parts.slice(i + 1).join('/');
                // We're making progress here, don't let many consecutive ..'s
                // lead to ELOOP
                nlinks--;
                continue linkloop;
              } else {
                current = current.parent;
              }
              continue;
            }
  
            current_path = PATH.join2(current_path, parts[i]);
            try {
              current = FS.lookupNode(current, parts[i]);
            } catch (e) {
              // if noent_okay is true, suppress a ENOENT in the last component
              // and return an object with an undefined node. This is needed for
              // resolving symlinks in the path when creating a file.
              if ((e?.errno === 44) && islast && opts.noent_okay) {
                return { path: current_path };
              }
              throw e;
            }
  
            // jump to the mount's root node if this is a mountpoint
            if (FS.isMountpoint(current) && (!islast || opts.follow_mount)) {
              current = current.mounted.root;
            }
  
            // by default, lookupPath will not follow a symlink if it is the final path component.
            // setting opts.follow = true will override this behavior.
            if (FS.isLink(current.mode) && (!islast || opts.follow)) {
              if (!current.node_ops.readlink) {
                throw new FS.ErrnoError(52);
              }
              var link = current.node_ops.readlink(current);
              if (!PATH.isAbs(link)) {
                link = PATH.dirname(current_path) + '/' + link;
              }
              path = link + '/' + parts.slice(i + 1).join('/');
              continue linkloop;
            }
          }
          return { path: current_path, node: current };
        }
        throw new FS.ErrnoError(32);
      },
  getPath(node) {
        var path;
        while (true) {
          if (FS.isRoot(node)) {
            var mount = node.mount.mountpoint;
            if (!path) return mount;
            return mount[mount.length-1] !== '/' ? `${mount}/${path}` : mount + path;
          }
          path = path ? `${node.name}/${path}` : node.name;
          node = node.parent;
        }
      },
  hashName(parentid, name) {
        var hash = 0;
  
        for (var i = 0; i < name.length; i++) {
          hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0;
        }
        return ((parentid + hash) >>> 0) % FS.nameTable.length;
      },
  hashAddNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        node.name_next = FS.nameTable[hash];
        FS.nameTable[hash] = node;
      },
  hashRemoveNode(node) {
        var hash = FS.hashName(node.parent.id, node.name);
        if (FS.nameTable[hash] === node) {
          FS.nameTable[hash] = node.name_next;
        } else {
          var current = FS.nameTable[hash];
          while (current) {
            if (current.name_next === node) {
              current.name_next = node.name_next;
              break;
            }
            current = current.name_next;
          }
        }
      },
  lookupNode(parent, name) {
        var errCode = FS.mayLookup(parent);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        var hash = FS.hashName(parent.id, name);
        for (var node = FS.nameTable[hash]; node; node = node.name_next) {
          var nodeName = node.name;
          if (node.parent.id === parent.id && nodeName === name) {
            return node;
          }
        }
        // if we failed to find it in the cache, call into the VFS
        return FS.lookup(parent, name);
      },
  createNode(parent, name, mode, rdev) {
        assert(typeof parent == 'object')
        var node = new FS.FSNode(parent, name, mode, rdev);
  
        FS.hashAddNode(node);
  
        return node;
      },
  destroyNode(node) {
        FS.hashRemoveNode(node);
      },
  isRoot(node) {
        return node === node.parent;
      },
  isMountpoint(node) {
        return !!node.mounted;
      },
  isFile(mode) {
        return (mode & 61440) === 32768;
      },
  isDir(mode) {
        return (mode & 61440) === 16384;
      },
  isLink(mode) {
        return (mode & 61440) === 40960;
      },
  isChrdev(mode) {
        return (mode & 61440) === 8192;
      },
  isBlkdev(mode) {
        return (mode & 61440) === 24576;
      },
  isFIFO(mode) {
        return (mode & 61440) === 4096;
      },
  isSocket(mode) {
        return (mode & 49152) === 49152;
      },
  flagsToPermissionString(flag) {
        var perms = ['r', 'w', 'rw'][flag & 3];
        if ((flag & 512)) {
          perms += 'w';
        }
        return perms;
      },
  nodePermissions(node, perms) {
        if (FS.ignorePermissions) {
          return 0;
        }
        // return 0 if any user, group or owner bits are set.
        if (perms.includes('r') && !(node.mode & 292)) {
          return 2;
        }
        if (perms.includes('w') && !(node.mode & 146)) {
          return 2;
        }
        if (perms.includes('x') && !(node.mode & 73)) {
          return 2;
        }
        return 0;
      },
  mayLookup(dir) {
        if (!FS.isDir(dir.mode)) return 54;
        var errCode = FS.nodePermissions(dir, 'x');
        if (errCode) return errCode;
        if (!dir.node_ops.lookup) return 2;
        return 0;
      },
  mayCreate(dir, name) {
        if (!FS.isDir(dir.mode)) {
          return 54;
        }
        try {
          var node = FS.lookupNode(dir, name);
          return 20;
        } catch (e) {
        }
        return FS.nodePermissions(dir, 'wx');
      },
  mayDelete(dir, name, isdir) {
        var node;
        try {
          node = FS.lookupNode(dir, name);
        } catch (e) {
          return e.errno;
        }
        var errCode = FS.nodePermissions(dir, 'wx');
        if (errCode) {
          return errCode;
        }
        if (isdir) {
          if (!FS.isDir(node.mode)) {
            return 54;
          }
          if (FS.isRoot(node) || FS.getPath(node) === FS.cwd()) {
            return 10;
          }
        } else if (FS.isDir(node.mode)) {
          return 31;
        }
        return 0;
      },
  mayOpen(node, flags) {
        if (!node) {
          return 44;
        }
        if (FS.isLink(node.mode)) {
          return 32;
        }
        var mode = FS.flagsToPermissionString(flags);
        if (FS.isDir(node.mode)) {
          // opening for write
          // TODO: check for O_SEARCH? (== search for dir only)
          if (mode !== 'r' || (flags & (512 | 64))) {
            return 31;
          }
        }
        return FS.nodePermissions(node, mode);
      },
  checkOpExists(op, err) {
        if (!op) {
          throw new FS.ErrnoError(err);
        }
        return op;
      },
  MAX_OPEN_FDS:4096,
  nextfd() {
        for (var fd = 0; fd <= FS.MAX_OPEN_FDS; fd++) {
          if (!FS.streams[fd]) {
            return fd;
          }
        }
        throw new FS.ErrnoError(33);
      },
  getStreamChecked(fd) {
        var stream = FS.getStream(fd);
        if (!stream) {
          throw new FS.ErrnoError(8);
        }
        return stream;
      },
  getStream:(fd) => FS.streams[fd],
  createStream(stream, fd = -1) {
        assert(fd >= -1);
  
        // clone it, so we can return an instance of FSStream
        stream = Object.assign(new FS.FSStream(), stream);
        if (fd == -1) {
          fd = FS.nextfd();
        }
        stream.fd = fd;
        FS.streams[fd] = stream;
        return stream;
      },
  closeStream(fd) {
        FS.streams[fd] = null;
      },
  dupStream(origStream, fd = -1) {
        var stream = FS.createStream(origStream, fd);
        stream.stream_ops?.dup?.(stream);
        return stream;
      },
  doSetAttr(stream, node, attr) {
        var setattr = stream?.stream_ops.setattr;
        var arg = setattr ? stream : node;
        setattr ??= node.node_ops.setattr;
        FS.checkOpExists(setattr, 63)
        try {
          setattr(arg, attr);
        } catch (e) {
          if (e instanceof RangeError) {
            throw new FS.ErrnoError(22);
          }
          throw e;
        }
      },
  chrdev_stream_ops:{
  open(stream) {
          var device = FS.getDevice(stream.node.rdev);
          // override node's stream ops with the device's
          stream.stream_ops = device.stream_ops;
          // forward the open call
          stream.stream_ops.open?.(stream);
        },
  llseek() {
          throw new FS.ErrnoError(70);
        },
  },
  major:(dev) => ((dev) >> 8),
  minor:(dev) => ((dev) & 0xff),
  makedev:(ma, mi) => ((ma) << 8 | (mi)),
  registerDevice(dev, ops) {
        FS.devices[dev] = { stream_ops: ops };
      },
  getDevice:(dev) => FS.devices[dev],
  getMounts(mount) {
        var mounts = [];
        var check = [mount];
  
        while (check.length) {
          var m = check.pop();
  
          mounts.push(m);
  
          check.push(...m.mounts);
        }
  
        return mounts;
      },
  syncfs(populate, callback) {
        if (typeof populate == 'function') {
          callback = populate;
          populate = false;
        }
  
        FS.syncFSRequests++;
  
        if (FS.syncFSRequests > 1) {
          err(`warning: ${FS.syncFSRequests} FS.syncfs operations in flight at once, probably just doing extra work`);
        }
  
        var mounts = FS.getMounts(FS.root.mount);
        var completed = 0;
  
        function doCallback(errCode) {
          assert(FS.syncFSRequests > 0);
          FS.syncFSRequests--;
          return callback(errCode);
        }
  
        function done(errCode) {
          if (errCode) {
            if (!done.errored) {
              done.errored = true;
              return doCallback(errCode);
            }
            return;
          }
          if (++completed >= mounts.length) {
            doCallback(null);
          }
        };
  
        // sync all mounts
        for (var mount of mounts) {
          if (mount.type.syncfs) {
            mount.type.syncfs(mount, populate, done);
          } else {
            done(null);
          }
        }
      },
  mount(type, opts, mountpoint) {
        if (typeof type == 'string') {
          // The filesystem was not included, and instead we have an error
          // message stored in the variable.
          throw type;
        }
        var root = mountpoint === '/';
        var pseudo = !mountpoint;
        var node;
  
        if (root && FS.root) {
          throw new FS.ErrnoError(10);
        } else if (!root && !pseudo) {
          var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
          mountpoint = lookup.path;  // use the absolute path
          node = lookup.node;
  
          if (FS.isMountpoint(node)) {
            throw new FS.ErrnoError(10);
          }
  
          if (!FS.isDir(node.mode)) {
            throw new FS.ErrnoError(54);
          }
        }
  
        var mount = {
          type,
          opts,
          mountpoint,
          mounts: []
        };
  
        // create a root node for the fs
        var mountRoot = type.mount(mount);
        mountRoot.mount = mount;
        mount.root = mountRoot;
  
        if (root) {
          FS.root = mountRoot;
        } else if (node) {
          // set as a mountpoint
          node.mounted = mount;
  
          // add the new mount to the current mount's children
          if (node.mount) {
            node.mount.mounts.push(mount);
          }
        }
  
        return mountRoot;
      },
  unmount(mountpoint) {
        var lookup = FS.lookupPath(mountpoint, { follow_mount: false });
  
        if (!FS.isMountpoint(lookup.node)) {
          throw new FS.ErrnoError(28);
        }
  
        // destroy the nodes for this mount, and all its child mounts
        var node = lookup.node;
        var mount = node.mounted;
        var mounts = FS.getMounts(mount);
  
        for (var [hash, current] of Object.entries(FS.nameTable)) {
          while (current) {
            var next = current.name_next;
  
            if (mounts.includes(current.mount)) {
              FS.destroyNode(current);
            }
  
            current = next;
          }
        }
  
        // no longer a mountpoint
        node.mounted = null;
  
        // remove this mount from the child mounts
        var idx = node.mount.mounts.indexOf(mount);
        assert(idx !== -1);
        node.mount.mounts.splice(idx, 1);
      },
  lookup(parent, name) {
        return parent.node_ops.lookup(parent, name);
      },
  mknod(path, mode, dev) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        if (!name) {
          throw new FS.ErrnoError(28);
        }
        if (name === '.' || name === '..') {
          throw new FS.ErrnoError(20);
        }
        var errCode = FS.mayCreate(parent, name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.mknod) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.mknod(parent, name, mode, dev);
      },
  statfs(path) {
        return FS.statfsNode(FS.lookupPath(path, {follow: true}).node);
      },
  statfsStream(stream) {
        // We keep a separate statfsStream function because noderawfs overrides
        // it. In noderawfs, stream.node is sometimes null. Instead, we need to
        // look at stream.path.
        return FS.statfsNode(stream.node);
      },
  statfsNode(node) {
        // NOTE: None of the defaults here are true. We're just returning safe and
        //       sane values. Currently nodefs and rawfs replace these defaults,
        //       other file systems leave them alone.
        var rtn = {
          bsize: 4096,
          frsize: 4096,
          blocks: 1e6,
          bfree: 5e5,
          bavail: 5e5,
          files: FS.nextInode,
          ffree: FS.nextInode - 1,
          fsid: 42,
          flags: 2,
          namelen: 255,
        };
  
        if (node.node_ops.statfs) {
          Object.assign(rtn, node.node_ops.statfs(node.mount.opts.root));
        }
        return rtn;
      },
  create(path, mode = 0o666) {
        mode &= 4095;
        mode |= 32768;
        return FS.mknod(path, mode, 0);
      },
  mkdir(path, mode = 0o777) {
        mode &= 511 | 512;
        mode |= 16384;
        return FS.mknod(path, mode, 0);
      },
  mkdirTree(path, mode) {
        var dirs = path.split('/');
        var d = '';
        for (var dir of dirs) {
          if (!dir) continue;
          if (d || PATH.isAbs(path)) d += '/';
          d += dir;
          try {
            FS.mkdir(d, mode);
          } catch(e) {
            if (e.errno != 20) throw e;
          }
        }
      },
  mkdev(path, mode, dev) {
        if (typeof dev == 'undefined') {
          dev = mode;
          mode = 0o666;
        }
        mode |= 8192;
        return FS.mknod(path, mode, dev);
      },
  symlink(oldpath, newpath) {
        if (!PATH_FS.resolve(oldpath)) {
          throw new FS.ErrnoError(44);
        }
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.symlink) {
          throw new FS.ErrnoError(63);
        }
        return parent.node_ops.symlink(parent, newname, oldpath);
      },
  link(oldpath, newpath, flags) {
        var lookup = FS.lookupPath(newpath, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var newname = PATH.basename(newpath);
        var errCode = FS.mayCreate(parent, newname);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        // Hardlinks are only supported by filesystem backends that provide a
        // `link` node op (e.g. NODERAWFS backed by the host). NODEFS omits it:
        // a host hardlink cannot be confined to the mount root.
        if (!parent.node_ops.link) {
          throw new FS.ErrnoError(34);
        }
        return parent.node_ops.link(parent, newname, oldpath, flags);
      },
  rename(old_path, new_path) {
        var old_dirname = PATH.dirname(old_path);
        var new_dirname = PATH.dirname(new_path);
        var old_name = PATH.basename(old_path);
        var new_name = PATH.basename(new_path);
        // parents must exist
        var lookup, old_dir, new_dir;
  
        // let the errors from non existent directories percolate up
        lookup = FS.lookupPath(old_path, { parent: true });
        old_dir = lookup.node;
        lookup = FS.lookupPath(new_path, { parent: true });
        new_dir = lookup.node;
  
        if (!old_dir || !new_dir) throw new FS.ErrnoError(44);
        // need to be part of the same mount
        if (old_dir.mount !== new_dir.mount) {
          throw new FS.ErrnoError(75);
        }
        // source must exist
        var old_node = FS.lookupNode(old_dir, old_name);
        // old path should not be an ancestor of the new path
        var relative = PATH_FS.relative(old_path, new_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(28);
        }
        // new path should not be an ancestor of the old path
        relative = PATH_FS.relative(new_path, old_dirname);
        if (relative.charAt(0) !== '.') {
          throw new FS.ErrnoError(55);
        }
        // see if the new path already exists
        var new_node;
        try {
          new_node = FS.lookupNode(new_dir, new_name);
        } catch (e) {
          // not fatal
        }
        // early out if nothing needs to change
        if (old_node === new_node) {
          return;
        }
        // we'll need to delete the old entry
        var isdir = FS.isDir(old_node.mode);
        var errCode = FS.mayDelete(old_dir, old_name, isdir);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        // need delete permissions if we'll be overwriting.
        // need create permissions if new doesn't already exist.
        errCode = new_node ?
          FS.mayDelete(new_dir, new_name, isdir) :
          FS.mayCreate(new_dir, new_name);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!old_dir.node_ops.rename) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(old_node) || (new_node && FS.isMountpoint(new_node))) {
          throw new FS.ErrnoError(10);
        }
        // if we are going to change the parent, check write permissions
        if (new_dir !== old_dir) {
          errCode = FS.nodePermissions(old_dir, 'w');
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // remove the node from the lookup hash
        FS.hashRemoveNode(old_node);
        // do the underlying fs rename
        try {
          old_dir.node_ops.rename(old_node, new_dir, new_name);
          // update old node (we do this here to avoid each backend
          // needing to)
          old_node.parent = new_dir;
        } catch (e) {
          throw e;
        } finally {
          // add the node back to the hash (in case node_ops.rename
          // changed its name)
          FS.hashAddNode(old_node);
        }
      },
  rmdir(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, true);
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.rmdir) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.rmdir(parent, name);
        FS.destroyNode(node);
      },
  readdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        var node = lookup.node;
        var readdir = FS.checkOpExists(node.node_ops.readdir, 54);
        return readdir(node);
      },
  unlink(path) {
        var lookup = FS.lookupPath(path, { parent: true });
        var parent = lookup.node;
        if (!parent) {
          throw new FS.ErrnoError(44);
        }
        var name = PATH.basename(path);
        var node = FS.lookupNode(parent, name);
        var errCode = FS.mayDelete(parent, name, false);
        if (errCode) {
          // According to POSIX, we should map EISDIR to EPERM, but
          // we instead do what Linux does (and we must, as we use
          // the musl linux libc).
          throw new FS.ErrnoError(errCode);
        }
        if (!parent.node_ops.unlink) {
          throw new FS.ErrnoError(63);
        }
        if (FS.isMountpoint(node)) {
          throw new FS.ErrnoError(10);
        }
        parent.node_ops.unlink(parent, name);
        FS.destroyNode(node);
      },
  readlink(path) {
        var lookup = FS.lookupPath(path);
        var link = lookup.node;
        if (!link) {
          throw new FS.ErrnoError(44);
        }
        if (!link.node_ops.readlink) {
          throw new FS.ErrnoError(28);
        }
        return link.node_ops.readlink(link);
      },
  stat(path, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        var node = lookup.node;
        var getattr = FS.checkOpExists(node.node_ops.getattr, 63);
        return getattr(node);
      },
  fstat(fd) {
        var stream = FS.getStreamChecked(fd);
        var node = stream.node;
        var getattr = stream.stream_ops.getattr;
        var arg = getattr ? stream : node;
        getattr ??= node.node_ops.getattr;
        FS.checkOpExists(getattr, 63)
        return getattr(arg);
      },
  lstat(path) {
        return FS.stat(path, true);
      },
  doChmod(stream, node, mode, dontFollow) {
        FS.doSetAttr(stream, node, {
          mode: (mode & 4095) | (node.mode & ~4095),
          ctime: Date.now(),
          dontFollow
        });
      },
  chmod(path, mode, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doChmod(null, node, mode, dontFollow);
      },
  lchmod(path, mode) {
        FS.chmod(path, mode, true);
      },
  fchmod(fd, mode) {
        var stream = FS.getStreamChecked(fd);
        FS.doChmod(stream, stream.node, mode, false);
      },
  doChown(stream, node, dontFollow) {
        FS.doSetAttr(stream, node, {
          timestamp: Date.now(),
          dontFollow
          // we ignore the uid / gid for now
        });
      },
  chown(path, uid, gid, dontFollow) {
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: !dontFollow });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doChown(null, node, dontFollow);
      },
  lchown(path, uid, gid) {
        FS.chown(path, uid, gid, true);
      },
  fchown(fd, uid, gid) {
        var stream = FS.getStreamChecked(fd);
        FS.doChown(stream, stream.node, false);
      },
  doTruncate(stream, node, len) {
        if (FS.isDir(node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!FS.isFile(node.mode)) {
          throw new FS.ErrnoError(28);
        }
        var errCode = FS.nodePermissions(node, 'w');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.doSetAttr(stream, node, {
          size: len,
          timestamp: Date.now()
        });
      },
  truncate(path, len) {
        if (len < 0) {
          throw new FS.ErrnoError(28);
        }
        var node;
        if (typeof path == 'string') {
          var lookup = FS.lookupPath(path, { follow: true });
          node = lookup.node;
        } else {
          node = path;
        }
        FS.doTruncate(null, node, len);
      },
  ftruncate(fd, len) {
        var stream = FS.getStreamChecked(fd);
        if (len < 0 || (stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(28);
        }
        FS.doTruncate(stream, stream.node, len);
      },
  utime(path, atime, mtime, dontFollow) {
        var lookup = FS.lookupPath(path, { follow: !dontFollow });
        FS.doSetAttr(null, lookup.node, {
          atime: atime,
          mtime: mtime,
          dontFollow
        });
      },
  open(path, flags, mode = 0o666) {
        if (path === "") {
          throw new FS.ErrnoError(44);
        }
        flags = FS_modeStringToFlags(flags);
        if ((flags & 64)) {
          mode = (mode & 4095) | 32768;
        } else {
          mode = 0;
        }
        var node;
        var isDirPath;
        if (typeof path == 'object') {
          node = path;
        } else {
          isDirPath = path.endsWith("/");
          // noent_okay makes it so that if the final component of the path
          // doesn't exist, lookupPath returns `node: undefined`. `path` will be
          // updated to point to the target of all symlinks.
          var lookup = FS.lookupPath(path, {
            follow: !(flags & 131072),
            noent_okay: true
          });
          node = lookup.node;
          path = lookup.path;
        }
        // perhaps we need to create the node
        var created = false;
        if ((flags & 64)) {
          if (node) {
            // if O_CREAT and O_EXCL are set, error out if the node already exists
            if ((flags & 128)) {
              throw new FS.ErrnoError(20);
            }
          } else if (isDirPath) {
            throw new FS.ErrnoError(31);
          } else {
            // node doesn't exist, try to create it
            // Ignore the permission bits here to ensure we can `open` this new
            // file below. We use chmod below to apply the permissions once the
            // file is open.
            node = FS.mknod(path, mode | 0o777, 0);
            created = true;
          }
        }
        if (!node) {
          throw new FS.ErrnoError(44);
        }
        // can't truncate a device
        if (FS.isChrdev(node.mode)) {
          flags &= ~512;
        }
        // if asked only for a directory, then this must be one
        if ((flags & 65536) && !FS.isDir(node.mode)) {
          throw new FS.ErrnoError(54);
        }
        // check permissions, if this is not a file we just created now (it is ok to
        // create and write to a file with read-only permissions; it is read-only
        // for later use)
        if (!created) {
          var errCode = FS.mayOpen(node, flags);
          if (errCode) {
            throw new FS.ErrnoError(errCode);
          }
        }
        // do truncation if necessary
        if ((flags & 512) && !created) {
          FS.truncate(node, 0);
        }
        // we've already handled these, don't pass down to the underlying vfs
        flags &= ~(128 | 512 | 131072);
  
        // register the stream with the filesystem
        var stream = FS.createStream({
          node,
          path: FS.getPath(node),  // we want the absolute path to the node
          flags,
          seekable: true,
          position: 0,
          stream_ops: node.stream_ops,
          // used by the file family libc calls (fopen, fwrite, ferror, etc.)
          ungotten: [],
          error: false
        });
        // call the new stream's open function
        if (stream.stream_ops.open) {
          stream.stream_ops.open(stream);
        }
        if (created) {
          FS.chmod(node, mode & 0o777);
        }
        return stream;
      },
  close(stream) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (stream.getdents) stream.getdents = null; // free readdir state
        // The fd is going away: wake anything waiting on it (poll/epoll) with
        // POLLNVAL so a blocking wait unblocks and an epoll registration is evicted
        // on its next derive. Only sockets/pipes/epoll ever carry a wait-queue, so
        // for every other stream (incl. nodeless noderawfs stdio) this is a no-op.
        stream.node?.notifyListeners(32);
        try {
          if (stream.stream_ops.close) {
            stream.stream_ops.close(stream);
          }
        } catch (e) {
          throw e;
        } finally {
          FS.closeStream(stream.fd);
        }
        stream.fd = null;
      },
  isClosed(stream) {
        return stream.fd === null;
      },
  llseek(stream, offset, whence) {
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if (!stream.seekable || !stream.stream_ops.llseek) {
          throw new FS.ErrnoError(70);
        }
        if (whence != 0 && whence != 1 && whence != 2) {
          throw new FS.ErrnoError(28);
        }
        stream.position = stream.stream_ops.llseek(stream, offset, whence);
        stream.ungotten = [];
        return stream.position;
      },
  read(stream, buffer, offset, length, position) {
        assert(offset >= 0);
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.read) {
          throw new FS.ErrnoError(28);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesRead = stream.stream_ops.read(stream, buffer, offset, length, position);
        if (!seeking) stream.position += bytesRead;
        return bytesRead;
      },
  write(stream, buffer, offset, length, position, canOwn) {
        assert(offset >= 0);
        assert(buffer.subarray, 'FS.write expects a TypedArray');
        if (length < 0 || position < 0) {
          throw new FS.ErrnoError(28);
        }
        if (FS.isClosed(stream)) {
          throw new FS.ErrnoError(8);
        }
        if ((stream.flags & 2097155) === 0) {
          throw new FS.ErrnoError(8);
        }
        if (FS.isDir(stream.node.mode)) {
          throw new FS.ErrnoError(31);
        }
        if (!stream.stream_ops.write) {
          throw new FS.ErrnoError(28);
        }
        if (stream.seekable && stream.flags & 1024) {
          // seek to the end before writing in append mode
          FS.llseek(stream, 0, 2);
        }
        var seeking = typeof position != 'undefined';
        if (!seeking) {
          position = stream.position;
        } else if (!stream.seekable) {
          throw new FS.ErrnoError(70);
        }
        var bytesWritten = stream.stream_ops.write(stream, buffer, offset, length, position, canOwn);
        if (!seeking) stream.position += bytesWritten;
        return bytesWritten;
      },
  mmap(stream, length, position, prot, flags) {
        // User requests writing to file (prot & PROT_WRITE != 0).
        // Checking if we have permissions to write to the file unless
        // MAP_PRIVATE flag is set. According to POSIX spec it is possible
        // to write to file opened in read-only mode with MAP_PRIVATE flag,
        // as all modifications will be visible only in the memory of
        // the current process.
        if ((prot & 2) !== 0
            && (flags & 2) === 0
            && (stream.flags & 2097155) !== 2) {
          throw new FS.ErrnoError(2);
        }
        if ((stream.flags & 2097155) === 1) {
          throw new FS.ErrnoError(2);
        }
        if (!stream.stream_ops.mmap) {
          throw new FS.ErrnoError(43);
        }
        if (!length) {
          throw new FS.ErrnoError(28);
        }
        return stream.stream_ops.mmap(stream, length, position, prot, flags);
      },
  msync(stream, buffer, offset, length, mmapFlags) {
        assert(offset >= 0);
        if (!stream.stream_ops.msync) {
          return 0;
        }
        return stream.stream_ops.msync(stream, buffer, offset, length, mmapFlags);
      },
  ioctl(stream, cmd, arg) {
        if (!stream.stream_ops.ioctl) {
          throw new FS.ErrnoError(59);
        }
        return stream.stream_ops.ioctl(stream, cmd, arg);
      },
  readFile(path, opts = {}) {
        opts.flags = opts.flags ?? 0;
        opts.encoding = opts.encoding ?? 'binary';
        if (opts.encoding !== 'utf8' && opts.encoding !== 'binary') {
          abort(`Invalid encoding type "${opts.encoding}"`);
        }
        var stream = FS.open(path, opts.flags);
        var stat = FS.stat(path);
        var length = stat.size;
        var buf = new Uint8Array(length);
        FS.read(stream, buf, 0, length, 0);
        if (opts.encoding === 'utf8') {
          buf = UTF8ArrayToString(buf);
        }
        FS.close(stream);
        return buf;
      },
  writeFile(path, data, opts = {}) {
        opts.flags = opts.flags ?? 577;
        var stream = FS.open(path, opts.flags, opts.mode);
        data = FS_fileDataToTypedArray(data);
        FS.write(stream, data, 0, data.byteLength, undefined, opts.canOwn);
        FS.close(stream);
      },
  cwd:() => FS.currentPath,
  chdir(path) {
        var lookup = FS.lookupPath(path, { follow: true });
        if (lookup.node === null) {
          throw new FS.ErrnoError(44);
        }
        if (!FS.isDir(lookup.node.mode)) {
          throw new FS.ErrnoError(54);
        }
        var errCode = FS.nodePermissions(lookup.node, 'x');
        if (errCode) {
          throw new FS.ErrnoError(errCode);
        }
        FS.currentPath = lookup.path;
      },
  createDefaultDirectories() {
        FS.mkdir('/tmp');
        FS.mkdir('/home');
        FS.mkdir('/home/web_user');
      },
  createDefaultDevices() {
        // create /dev
        FS.mkdir('/dev');
        // setup /dev/null
        FS.registerDevice(FS.makedev(1, 3), {
          read: () => 0,
          write: (stream, buffer, offset, length, pos) => length,
          llseek: () => 0,
        });
        FS.mkdev('/dev/null', FS.makedev(1, 3));
        // setup /dev/tty and /dev/tty1
        // stderr needs to print output using err() rather than out()
        // so we register a second tty just for it.
        TTY.register(FS.makedev(5, 0), TTY.default_tty_ops);
        TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops);
        FS.mkdev('/dev/tty', FS.makedev(5, 0));
        FS.mkdev('/dev/tty1', FS.makedev(6, 0));
        // setup /dev/[u]random
        // use a buffer to avoid overhead of individual crypto calls per byte
        var randomBuffer = new Uint8Array(1024), randomLeft = 0;
        var randomByte = () => {
          if (randomLeft === 0) {
            randomFill(randomBuffer);
            randomLeft = randomBuffer.byteLength;
          }
          return randomBuffer[--randomLeft];
        };
        FS.createDevice('/dev', 'random', randomByte);
        FS.createDevice('/dev', 'urandom', randomByte);
        // we're not going to emulate the actual shm device,
        // just create the tmp dirs that reside in it commonly
        FS.mkdir('/dev/shm');
        FS.mkdir('/dev/shm/tmp');
      },
  createSpecialDirectories() {
        // create /proc/self/fd which allows /proc/self/fd/6 => readlink gives the
        // name of the stream for fd 6 (see test_unistd_ttyname)
        FS.mkdir('/proc');
        var proc_self = FS.mkdir('/proc/self');
        FS.mkdir('/proc/self/fd');
        FS.mount({
          mount() {
            var node = FS.createNode(proc_self, 'fd', 16895, 73);
            node.stream_ops = {
              llseek: MEMFS.stream_ops.llseek,
            };
            node.node_ops = {
              lookup(parent, name) {
                var fd = +name;
                var stream = FS.getStreamChecked(fd);
                var ret = {
                  parent: null,
                  mount: { mountpoint: 'fake' },
                  node_ops: { readlink: () => stream.path },
                  id: fd + 1,
                };
                ret.parent = ret; // make it look like a simple root node
                return ret;
              },
              readdir() {
                return Array.from(FS.streams.entries())
                  .filter(([k, v]) => v)
                  .map(([k, v]) => k.toString());
              }
            };
            return node;
          }
        }, {}, '/proc/self/fd');
      },
  createStandardStreams(input, output, error) {
        // TODO deprecate the old functionality of a single
        // input / output callback and that utilizes FS.createDevice
        // and instead require a unique set of stream ops
  
        // by default, we symlink the standard streams to the
        // default tty devices. however, if the standard streams
        // have been overwritten we create a unique device for
        // them instead.
        if (input) {
          FS.createDevice('/dev', 'stdin', input);
        } else {
          FS.symlink('/dev/tty', '/dev/stdin');
        }
        if (output) {
          FS.createDevice('/dev', 'stdout', null, output);
        } else {
          FS.symlink('/dev/tty', '/dev/stdout');
        }
        if (error) {
          FS.createDevice('/dev', 'stderr', null, error);
        } else {
          FS.symlink('/dev/tty1', '/dev/stderr');
        }
  
        // open default streams for the stdin, stdout and stderr devices
        var stdin = FS.open('/dev/stdin', 0);
        var stdout = FS.open('/dev/stdout', 1);
        var stderr = FS.open('/dev/stderr', 1);
        assert(stdin.fd === 0, `invalid handle for stdin (${stdin.fd})`);
        assert(stdout.fd === 1, `invalid handle for stdout (${stdout.fd})`);
        assert(stderr.fd === 2, `invalid handle for stderr (${stderr.fd})`);
      },
  staticInit() {
        FS.nameTable = new Array(4096);
  
        FS.mount(MEMFS, {}, '/');
  
        FS.createDefaultDirectories();
        FS.createDefaultDevices();
        FS.createSpecialDirectories();
  
        FS.filesystems = {
          'MEMFS': MEMFS,
        };
      },
  init(input, output, error) {
        assert(!FS.initialized, 'FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)');
        FS.initialized = true;
  
        // Allow Module.stdin etc. to provide defaults, if none explicitly passed to us here
        input ??= Module['stdin'];
        output ??= Module['stdout'];
        error ??= Module['stderr'];
  
        FS.createStandardStreams(input, output, error);
      },
  quit() {
        FS.initialized = false;
        // force-flush all streams, so we get musl std streams printed out
        _fflush(0);
        // close all of our streams
        for (var stream of FS.streams) {
          if (stream) {
            FS.close(stream);
          }
        }
      },
  findObject(path, dontResolveLastLink) {
        var ret = FS.analyzePath(path, dontResolveLastLink);
        if (!ret.exists) {
          return null;
        }
        return ret.object;
      },
  analyzePath(path, dontResolveLastLink) {
        // operate from within the context of the symlink's target
        try {
          var lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          path = lookup.path;
        } catch (e) {
        }
        var ret = {
          isRoot: false, exists: false, error: 0, name: null, path: null, object: null,
          parentExists: false, parentPath: null, parentObject: null
        };
        try {
          var lookup = FS.lookupPath(path, { parent: true });
          ret.parentExists = true;
          ret.parentPath = lookup.path;
          ret.parentObject = lookup.node;
          ret.name = PATH.basename(path);
          lookup = FS.lookupPath(path, { follow: !dontResolveLastLink });
          ret.exists = true;
          ret.path = lookup.path;
          ret.object = lookup.node;
          ret.name = lookup.node.name;
          ret.isRoot = lookup.path === '/';
        } catch (e) {
          ret.error = e.errno;
        };
        return ret;
      },
  createPath(parent, path, canRead, canWrite) {
        parent = typeof parent == 'string' ? parent : FS.getPath(parent);
        var parts = path.split('/').reverse();
        while (parts.length) {
          var part = parts.pop();
          if (!part) continue;
          var current = PATH.join2(parent, part);
          try {
            FS.mkdir(current);
          } catch (e) {
            if (e.errno != 20) throw e;
          }
          parent = current;
        }
        return current;
      },
  createFile(parent, name, properties, canRead, canWrite) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(canRead, canWrite);
        return FS.create(path, mode);
      },
  createDataFile(parent, name, data, canRead, canWrite, canOwn) {
        var path = name;
        if (parent) {
          parent = typeof parent == 'string' ? parent : FS.getPath(parent);
          path = name ? PATH.join2(parent, name) : parent;
        }
        var mode = FS_getMode(canRead, canWrite);
        var node = FS.create(path, mode);
        if (data) {
          data = FS_fileDataToTypedArray(data);
          // make sure we can write to the file
          FS.chmod(node, mode | 146);
          var stream = FS.open(node, 577);
          FS.write(stream, data, 0, data.length, 0, canOwn);
          FS.close(stream);
          FS.chmod(node, mode);
        }
      },
  createDevice(parent, name, input, output) {
        var path = PATH.join2(typeof parent == 'string' ? parent : FS.getPath(parent), name);
        var mode = FS_getMode(!!input, !!output);
        FS.createDevice.major ??= 64;
        var dev = FS.makedev(FS.createDevice.major++, 0);
        // Create a fake device that a set of stream ops to emulate
        // the old behavior.
        FS.registerDevice(dev, {
          open(stream) {
            stream.seekable = false;
          },
          close(stream) {
            // flush any pending line data
            if (output?.buffer?.length) {
              output(10);
            }
          },
          read(stream, buffer, offset, length, pos /* ignored */) {
            var bytesRead = 0;
            for (var i = 0; i < length; i++) {
              var result;
              try {
                result = input();
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
              if (result === undefined && bytesRead === 0) {
                throw new FS.ErrnoError(6);
              }
              if (result === null || result === undefined) break;
              bytesRead++;
              buffer[offset+i] = result;
            }
            if (bytesRead) {
              stream.node.atime = Date.now();
            }
            return bytesRead;
          },
          write(stream, buffer, offset, length, pos) {
            for (var i = 0; i < length; i++) {
              try {
                output(buffer[offset+i]);
              } catch (e) {
                throw new FS.ErrnoError(29);
              }
            }
            if (length) {
              stream.node.mtime = stream.node.ctime = Date.now();
            }
            return i;
          }
        });
        return FS.mkdev(path, mode, dev);
      },
  forceLoadFile(obj) {
        if (obj.isDevice || obj.isFolder || obj.link || obj.contents) return true;
        if (globalThis.XMLHttpRequest) {
          abort("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
        } else { // Command-line.
          try {
            obj.contents = readBinary(obj.url);
          } catch (e) {
            throw new FS.ErrnoError(29);
          }
        }
      },
  createLazyFile(parent, name, url, canRead, canWrite) {
        // Lazy chunked Uint8Array (implements get and length from Uint8Array).
        // Actual getting is abstracted away for eventual reuse.
        class LazyUint8Array {
          lengthKnown = false;
          chunks = []; // Loaded chunks. Index is the chunk number
          get(idx) {
            if (idx > this.length-1 || idx < 0) {
              return undefined;
            }
            var chunkOffset = idx % this.chunkSize;
            var chunkNum = (idx / this.chunkSize)|0;
            return this.getter(chunkNum)[chunkOffset];
          }
          setDataGetter(getter) {
            this.getter = getter;
          }
          cacheLength() {
            // Find length
            var xhr = new XMLHttpRequest();
            xhr.open('HEAD', url, false);
            xhr.send(null);
            if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
            var datalength = Number(xhr.getResponseHeader("Content-length"));
            var header;
            var hasByteServing = (header = xhr.getResponseHeader("Accept-Ranges")) && header === "bytes";
            var usesGzip = (header = xhr.getResponseHeader("Content-Encoding")) && header === "gzip";
  
            var chunkSize = 1024*1024; // Chunk size in bytes
  
            if (!hasByteServing) chunkSize = datalength;
  
            // Function to get a range from the remote URL.
            var doXHR = (from, to) => {
              if (from > to) abort(`invalid range (${from}, ${to}) or no bytes requested!`);
              if (to > datalength-1) abort(`only ${datalength} bytes available! programmer error!`);
  
              // TODO: Use mozResponseArrayBuffer, responseStream, etc. if available.
              var xhr = new XMLHttpRequest();
              xhr.open('GET', url, false);
              if (datalength !== chunkSize) xhr.setRequestHeader("Range", "bytes=" + from + "-" + to);
  
              // Some hints to the browser that we want binary data.
              xhr.responseType = 'arraybuffer';
              if (xhr.overrideMimeType) {
                xhr.overrideMimeType('text/plain; charset=x-user-defined');
              }
  
              xhr.send(null);
              if (!(xhr.status >= 200 && xhr.status < 300 || xhr.status === 304)) abort("Couldn't load " + url + ". Status: " + xhr.status);
              if (xhr.response !== undefined) {
                return new Uint8Array(/** @type{Array<number>} */(xhr.response || []));
              }
              return intArrayFromString(xhr.responseText ?? '', true);
            };
            var lazyArray = this;
            lazyArray.setDataGetter((chunkNum) => {
              var start = chunkNum * chunkSize;
              var end = (chunkNum+1) * chunkSize - 1; // including this byte
              end = Math.min(end, datalength-1); // if datalength-1 is selected, this is the last block
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') {
                lazyArray.chunks[chunkNum] = doXHR(start, end);
              }
              if (typeof lazyArray.chunks[chunkNum] == 'undefined') abort('doXHR failed!');
              return lazyArray.chunks[chunkNum];
            });
  
            if (usesGzip || !datalength) {
              // if the server uses gzip or doesn't supply the length, we have to download the whole file to get the (uncompressed) length
              chunkSize = datalength = 1; // this will force getter(0)/doXHR do download the whole file
              datalength = this.getter(0).length;
              chunkSize = datalength;
              out("LazyFiles on gzip forces download of the whole file when length is accessed");
            }
  
            this._length = datalength;
            this._chunkSize = chunkSize;
            this.lengthKnown = true;
          }
          get length() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._length;
          }
          get chunkSize() {
            if (!this.lengthKnown) {
              this.cacheLength();
            }
            return this._chunkSize;
          }
        }
  
        if (globalThis.XMLHttpRequest) {
          if (!ENVIRONMENT_IS_WORKER) abort('Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc');
          var lazyArray = new LazyUint8Array();
          var properties = { isDevice: false, contents: lazyArray };
        } else {
          var properties = { isDevice: false, url: url };
        }
  
        var node = FS.createFile(parent, name, properties, canRead, canWrite);
        // This is a total hack, but I want to get this lazy file code out of the
        // core of MEMFS. If we want to keep this lazy file concept I feel it should
        // be its own thin LAZYFS proxying calls to MEMFS.
        if (properties.contents) {
          node.contents = properties.contents;
        } else if (properties.url) {
          node.contents = null;
          node.url = properties.url;
        }
        // Add a function that defers querying the file size until it is asked the first time.
        Object.defineProperties(node, {
          usedBytes: {
            get: function() { return this.contents.length; }
          }
        });
        // override each stream op with one that tries to force load the lazy file first
        var stream_ops = {};
        for (const [key, fn] of Object.entries(node.stream_ops)) {
          stream_ops[key] = (...args) => {
            FS.forceLoadFile(node);
            return fn(...args);
          };
        }
        function writeChunks(stream, buffer, offset, length, position) {
          var contents = stream.node.contents;
          if (position >= contents.length)
            return 0;
          var size = Math.min(contents.length - position, length);
          assert(size >= 0);
          if (contents.slice) { // normal array
            for (var i = 0; i < size; i++) {
              buffer[offset + i] = contents[position + i];
            }
          } else {
            for (var i = 0; i < size; i++) { // LazyUint8Array from sync binary XHR
              buffer[offset + i] = contents.get(position + i);
            }
          }
          return size;
        }
        // use a custom read function
        stream_ops.read = (stream, buffer, offset, length, position) => {
          FS.forceLoadFile(node);
          return writeChunks(stream, buffer, offset, length, position)
        };
        // use a custom mmap function
        stream_ops.mmap = (stream, length, position, prot, flags) => {
          FS.forceLoadFile(node);
          var ptr = mmapAlloc(length);
          if (!ptr) {
            throw new FS.ErrnoError(48);
          }
          writeChunks(stream, HEAP8, ptr, length, position);
          return { ptr, allocated: true };
        };
        node.stream_ops = stream_ops;
        return node;
      },
  };
  
  var SYSCALLS = {
  currentUmask:18,
  calculateAt(dirfd, path, allowEmpty) {
        if (PATH.isAbs(path)) {
          return path;
        }
        // relative path
        var dir;
        if (dirfd === -100) {
          dir = FS.cwd();
        } else {
          var dirstream = SYSCALLS.getStreamFromFD(dirfd);
          dir = dirstream.path;
        }
        if (path.length == 0) {
          if (!allowEmpty) {
            throw new FS.ErrnoError(44);;
          }
          return dir;
        }
        return dir + '/' + path;
      },
  writeStat(buf, stat) {
        HEAPU32[((buf)>>2)] = stat.dev;
        HEAPU32[(((buf)+(4))>>2)] = stat.mode;
        HEAPU32[(((buf)+(8))>>2)] = stat.nlink;
        HEAPU32[(((buf)+(12))>>2)] = stat.uid;
        HEAPU32[(((buf)+(16))>>2)] = stat.gid;
        HEAPU32[(((buf)+(20))>>2)] = stat.rdev;
        HEAP64[(((buf)+(24))>>3)] = BigInt(stat.size);
        HEAP32[(((buf)+(32))>>2)] = 4096;
        HEAP32[(((buf)+(36))>>2)] = stat.blocks;
        var atime = stat.atime.getTime();
        var mtime = stat.mtime.getTime();
        var ctime = stat.ctime.getTime();
        HEAP64[(((buf)+(40))>>3)] = BigInt(Math.floor(atime / 1000));
        HEAPU32[(((buf)+(48))>>2)] = (atime % 1000) * 1000 * 1000;
        HEAP64[(((buf)+(56))>>3)] = BigInt(Math.floor(mtime / 1000));
        HEAPU32[(((buf)+(64))>>2)] = (mtime % 1000) * 1000 * 1000;
        HEAP64[(((buf)+(72))>>3)] = BigInt(Math.floor(ctime / 1000));
        HEAPU32[(((buf)+(80))>>2)] = (ctime % 1000) * 1000 * 1000;
        HEAP64[(((buf)+(88))>>3)] = BigInt(stat.ino);
        return 0;
      },
  writeStatFs(buf, stats) {
        HEAPU32[(((buf)+(4))>>2)] = stats.bsize;
        HEAPU32[(((buf)+(60))>>2)] = stats.bsize;
        HEAP64[(((buf)+(8))>>3)] = BigInt(stats.blocks);
        HEAP64[(((buf)+(16))>>3)] = BigInt(stats.bfree);
        HEAP64[(((buf)+(24))>>3)] = BigInt(stats.bavail);
        HEAP64[(((buf)+(32))>>3)] = BigInt(stats.files);
        HEAP64[(((buf)+(40))>>3)] = BigInt(stats.ffree);
        HEAPU32[(((buf)+(48))>>2)] = stats.fsid;
        HEAPU32[(((buf)+(64))>>2)] = stats.flags;  // ST_NOSUID
        HEAPU32[(((buf)+(56))>>2)] = stats.namelen;
      },
  doMsync(addr, stream, len, flags, offset) {
        if (!FS.isFile(stream.node.mode)) {
          throw new FS.ErrnoError(43);
        }
        if (flags & 2) {
          // MAP_PRIVATE calls need not to be synced back to underlying fs
          return 0;
        }
        var buffer = HEAPU8.subarray(addr, addr + len);
        FS.msync(stream, buffer, offset, len, flags);
      },
  getStreamFromFD(fd) {
        var stream = FS.getStreamChecked(fd);
        return stream;
      },
  varargs:undefined,
  getStr(ptr) {
        var ret = UTF8ToString(ptr);
        return ret;
      },
  };
  function ___syscall_fcntl64(fd, cmd, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (cmd) {
        case 0: {
          var arg = syscallGetVarargI();
          if (arg < 0) {
            return -28;
          }
          while (FS.streams[arg]) {
            arg++;
          }
          var newStream;
          newStream = FS.dupStream(stream, arg);
          return newStream.fd;
        }
        case 1:
        case 2:
          return 0;  // FD_CLOEXEC makes no sense for a single process.
        case 3:
          return stream.flags;
        case 4: {
          var arg = syscallGetVarargI();
          var mask = 289792;
          stream.flags = (stream.flags & ~mask) | (arg & mask);
          return 0;
        }
        case 12: {
          var arg = syscallGetVarargP();
          var offset = 0;
          // We're always unlocked.
          HEAP16[(((arg)+(offset))>>1)] = 2;
          return 0;
        }
        case 13:
        case 14:
          // Pretend that the locking is successful. These are process-level locks,
          // and Emscripten programs are a single process. If we supported linking a
          // filesystem between programs, we'd need to do more here.
          // See https://github.com/emscripten-core/emscripten/issues/23697
          return 0;
      }
      return -28;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }
  

  
  function ___syscall_ioctl(fd, op, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      switch (op) {
        case 21509: {
          if (!stream.tty) return -59;
          return 0;
        }
        case 21505: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcgets) {
            var termios = stream.tty.ops.ioctl_tcgets(stream);
            var argp = syscallGetVarargP();
            HEAP32[((argp)>>2)] = termios.c_iflag || 0;
            HEAP32[(((argp)+(4))>>2)] = termios.c_oflag || 0;
            HEAP32[(((argp)+(8))>>2)] = termios.c_cflag || 0;
            HEAP32[(((argp)+(12))>>2)] = termios.c_lflag || 0;
            for (var i = 0; i < 32; i++) {
              HEAP8[(argp + i)+(17)] = termios.c_cc[i] || 0;
            }
            return 0;
          }
          return 0;
        }
        case 21510:
        case 21511:
        case 21512: {
          if (!stream.tty) return -59;
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21506:
        case 21507:
        case 21508: {
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tcsets) {
            var argp = syscallGetVarargP();
            var c_iflag = HEAP32[((argp)>>2)];
            var c_oflag = HEAP32[(((argp)+(4))>>2)];
            var c_cflag = HEAP32[(((argp)+(8))>>2)];
            var c_lflag = HEAP32[(((argp)+(12))>>2)];
            var c_cc = []
            for (var i = 0; i < 32; i++) {
              c_cc.push(HEAP8[(argp + i)+(17)]);
            }
            return stream.tty.ops.ioctl_tcsets(stream.tty, op, { c_iflag, c_oflag, c_cflag, c_lflag, c_cc });
          }
          return 0; // no-op, not actually adjusting terminal settings
        }
        case 21519: {
          if (!stream.tty) return -59;
          var argp = syscallGetVarargP();
          HEAP32[((argp)>>2)] = 0;
          return 0;
        }
        case 21520: {
          if (!stream.tty) return -59;
          return -28; // not supported
        }
        case 21537:
        case 21531: {
          var argp = syscallGetVarargP();
          return FS.ioctl(stream, op, argp);
        }
        case 21523: {
          // TODO: in theory we should write to the winsize struct that gets
          // passed in, but for now musl doesn't read anything on it
          if (!stream.tty) return -59;
          if (stream.tty.ops.ioctl_tiocgwinsz) {
            var winsize = stream.tty.ops.ioctl_tiocgwinsz(stream.tty);
            var argp = syscallGetVarargP();
            HEAP16[((argp)>>1)] = winsize[0];
            HEAP16[(((argp)+(2))>>1)] = winsize[1];
          }
          return 0;
        }
        case 21524: {
          // TODO: technically, this ioctl call should change the window size.
          // but, since emscripten doesn't have any concept of a terminal window
          // yet, we'll just silently throw it away as we do TIOCGWINSZ
          if (!stream.tty) return -59;
          return 0;
        }
        case 21515: {
          if (!stream.tty) return -59;
          return 0;
        }
        default: return -28; // not supported
      }
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }
  

  
  function ___syscall_openat(dirfd, path, flags, varargs) {
  SYSCALLS.varargs = varargs;
  try {
  
      path = SYSCALLS.getStr(path);
      path = SYSCALLS.calculateAt(dirfd, path);
      var mode = varargs ? syscallGetVarargI() : 0;
      if (flags & 64) {
        mode &= ~SYSCALLS.currentUmask;
      }
      return FS.open(path, flags, mode).fd;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return -e.errno;
  }
  }
  

  var __abort_js = () =>
      abort('native code called abort()');

  var getHeapMax = () =>
      // Stay one Wasm page short of 4GB: while e.g. Chrome is able to allocate
      // full 4GB Wasm memories, the size will wrap back to 0 bytes in Wasm side
      // for any code that deals with heap sizes, which would require special
      // casing all heap size related code to treat 0 specially.
      2147483648;
  
  var alignMemory = (size, alignment) => {
      assert(alignment, 'alignment argument is required');
      return Math.ceil(size / alignment) * alignment;
    };
  
  var growMemory = (size) => {
      var oldHeapSize = wasmMemory.buffer.byteLength;
      var pages = ((size - oldHeapSize + 65535) / 65536) | 0;
      try {
        // round size grow request up to wasm page size (fixed 64KB per spec)
        wasmMemory.grow(pages); // .grow() takes a delta compared to the previous size
        updateMemoryViews();
        return 1 /*success*/;
      } catch(e) {
        err(`growMemory: Attempted to grow heap from ${oldHeapSize} bytes to ${size} bytes, but got error: ${e}`);
      }
      // implicit 0 return to save code size (caller will cast "undefined" into 0
      // anyhow)
    };
  var _emscripten_resize_heap = (requestedSize) => {
      var oldSize = HEAPU8.length;
      // With CAN_ADDRESS_2GB or MEMORY64, pointers are already unsigned.
      requestedSize >>>= 0;
      // With multithreaded builds, races can happen (another thread might increase the size
      // in between), so return a failure, and let the caller retry.
      assert(requestedSize > oldSize);
  
      // Memory resize rules:
      // 1.  Always increase heap size to at least the requested size, rounded up
      //     to next page multiple.
      // 2a. If MEMORY_GROWTH_LINEAR_STEP == -1, excessively resize the heap
      //     geometrically: increase the heap size according to
      //     MEMORY_GROWTH_GEOMETRIC_STEP factor (default +20%), At most
      //     overreserve by MEMORY_GROWTH_GEOMETRIC_CAP bytes (default 96MB).
      // 2b. If MEMORY_GROWTH_LINEAR_STEP != -1, excessively resize the heap
      //     linearly: increase the heap size by at least
      //     MEMORY_GROWTH_LINEAR_STEP bytes.
      // 3.  Max size for the heap is capped at 2048MB-WASM_PAGE_SIZE, or by
      //     MAXIMUM_MEMORY, or by ASAN limit, depending on which is smallest
      // 4.  If we were unable to allocate as much memory, it may be due to
      //     over-eager decision to excessively reserve due to (3) above.
      //     Hence if an allocation fails, cut down on the amount of excess
      //     growth, in an attempt to succeed to perform a smaller allocation.
  
      // A limit is set for how much we can grow. We should not exceed that
      // (the wasm binary specifies it, so if we tried, we'd fail anyhow).
      var maxHeapSize = getHeapMax();
      if (requestedSize > maxHeapSize) {
        err(`Cannot enlarge memory, requested ${requestedSize} bytes, but the limit is ${maxHeapSize} bytes!`);
        return false;
      }
  
      // Loop through potential heap size increases. If we attempt a too eager
      // reservation that fails, cut down on the attempted size and reserve a
      // smaller bump instead. (max 3 times, chosen somewhat arbitrarily)
      for (var cutDown = 1; cutDown <= 4; cutDown *= 2) {
        var overGrownHeapSize = oldSize * (1 + 0.2 / cutDown); // ensure geometric growth
        // but limit overreserving (default to capping at +96MB overgrowth at most)
        overGrownHeapSize = Math.min(overGrownHeapSize, requestedSize + 100663296 );
  
        var newSize = Math.min(maxHeapSize, alignMemory(Math.max(requestedSize, overGrownHeapSize), 65536));
  
        var replacement = growMemory(newSize);
        if (replacement) {
  
          return true;
        }
      }
      err(`Failed to grow the heap from ${oldSize} bytes to ${newSize} bytes, not enough memory!`);
      return false;
    };

  function _fd_close(fd) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.close(stream);
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }
  

  /** @param {number=} offset */
  var doReadv = (stream, iov, iovcnt, offset) => {
      var ret = 0;
      for (var i = 0; i < iovcnt; i++) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        iov += 8;
        try {
          var curr = FS.read(stream, HEAP8, ptr, len, offset);
        } catch (e) {
          // On a non-blocking stream a subsequent read may would-block after we
          // already gathered data. POSIX readv is a single gather-read: return
          // what we have rather than failing the whole call.
          if (ret > 0 && e instanceof FS.ErrnoError &&
              (e.errno == 6 || e.errno == 6)) {
            break;
          }
          throw e;
        }
        if (curr < 0) return -1;
        ret += curr;
        if (curr < len) break; // nothing more to read
        if (typeof offset != 'undefined') {
          offset += curr;
        }
      }
      return ret;
    };
  
  function _fd_read(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doReadv(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }
  

  
  var INT53_MAX = 9007199254740992;
  
  var INT53_MIN = -9007199254740992;
  var bigintToI53Checked = (num) => (num < INT53_MIN || num > INT53_MAX) ? NaN : Number(num);
  function _fd_seek(fd, offset, whence, newOffset) {
    offset = bigintToI53Checked(offset);
  
  
  try {
  
      if (isNaN(offset)) return 22;
      var stream = SYSCALLS.getStreamFromFD(fd);
      FS.llseek(stream, offset, whence);
      HEAP64[((newOffset)>>3)] = BigInt(stream.position);
      if (stream.getdents && offset === 0 && whence === 0) stream.getdents = null; // reset readdir state
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  ;
  }

  /** @param {number=} offset */
  var doWritev = (stream, iov, iovcnt, offset) => {
      // Gather all iovecs into one contiguous buffer and issue a single
      // FS.write, matching POSIX writev's single gather-write semantics (as
      // __syscall_sendmsg already does). Per-iovec writes fragment a stream
      // socket send into multiple segments, breaking stream byte semantics.
      if (iovcnt == 1) {
        // Single iovec: write directly from HEAP8, no gather buffer needed.
        return FS.write(stream, HEAP8, HEAPU32[((iov)>>2)], HEAPU32[(((iov)+(4))>>2)], offset);
      }
      var total = 0;
      for (var i = 0, p = iov; i < iovcnt; i++, p += 8) {
        total += HEAPU32[(((p)+(4))>>2)];
      }
      var view = new Uint8Array(total);
      var voff = 0;
      for (var i = 0; i < iovcnt; i++, iov += 8) {
        var ptr = HEAPU32[((iov)>>2)];
        var len = HEAPU32[(((iov)+(4))>>2)];
        view.set(HEAPU8.subarray(ptr, ptr + len), voff);
        voff += len;
      }
      return FS.write(stream, view, 0, total, offset);
    };
  
  function _fd_write(fd, iov, iovcnt, pnum) {
  try {
  
      var stream = SYSCALLS.getStreamFromFD(fd);
      var num = doWritev(stream, iov, iovcnt);
      HEAPU32[((pnum)>>2)] = num;
      return 0;
    } catch (e) {
    if (typeof FS == 'undefined' || !(e.name === 'ErrnoError')) throw e;
    return e.errno;
  }
  }
  


  var getCFunc = (ident) => {
      var func = Module['_' + ident]; // closure exported function
      assert(func, `Cannot call unknown function ${ident}, make sure it is exported`);
      return func;
    };
  
  var writeArrayToMemory = (array, buffer) => {
      assert(array.length >= 0, 'writeArrayToMemory array must have a length (should be an array or typed array)')
      HEAP8.set(array, buffer);
    };
  
  
  var stringToUTF8 = (str, outPtr, maxBytesToWrite) => {
      assert(typeof maxBytesToWrite == 'number', 'stringToUTF8 requires a third parameter that specifies the length of the output buffer');
      return stringToUTF8Array(str, HEAPU8, outPtr, maxBytesToWrite);
    };
  
  var stackAlloc = (sz) => __emscripten_stack_alloc(sz);
  var stringToUTF8OnStack = (str) => {
      var size = lengthBytesUTF8(str) + 1;
      var ret = stackAlloc(size);
      stringToUTF8(str, ret, size);
      return ret;
    };
  
  
  
  
  
    /**
   * @param {string|null=} returnType
   * @param {Array=} argTypes
   * @param {Array=} args
   * @param {Object=} opts
   */
  var ccall = (ident, returnType, argTypes, args, opts) => {
      // For fast lookup of conversion functions
      var toC = {
        'string': (str) => {
          var ret = 0;
          if (str !== null && str !== undefined && str !== 0) { // null string
            ret = stringToUTF8OnStack(str);
          }
          return ret;
        },
        'array': (arr) => {
          var ret = stackAlloc(arr.length);
          writeArrayToMemory(arr, ret);
          return ret;
        }
      };
  
      function convertReturnValue(ret) {
        if (returnType === 'string') {
          return UTF8ToString(ret);
        }
        if (returnType === 'boolean') return Boolean(ret);
        return ret;
      }
  
      var func = getCFunc(ident);
      var cArgs = [];
      var stack = 0;
      assert(returnType !== 'array', 'return type should not be "array"');
      if (args) {
        for (var i = 0; i < args.length; i++) {
          var converter = toC[argTypes[i]];
          if (converter) {
            if (stack === 0) stack = stackSave();
            cArgs[i] = converter(args[i]);
          } else {
            cArgs[i] = args[i];
          }
        }
      }
      var ret = func(...cArgs);
      function onDone(ret) {
        if (stack !== 0) stackRestore(stack);
        return convertReturnValue(ret);
      }
  
      ret = onDone(ret);
      return ret;
    };
  
    /**
   * @param {string=} returnType
   * @param {Array=} argTypes
   * @param {Object=} opts
   */
  var cwrap = (ident, returnType, argTypes, opts) => {
      return (...args) => ccall(ident, returnType, argTypes, args, opts);
    };



  var wasmTableMirror = [];
  
  
  var getWasmTableEntry = (funcPtr) => {
      var func = wasmTableMirror[funcPtr];
      if (!func) {
        /** @suppress {checkTypes} */
        wasmTableMirror[funcPtr] = func = wasmTable.get(funcPtr);
      }
      /** @suppress {checkTypes} */
      assert(wasmTable.get(funcPtr) == func, 'table mirror is out of date');
      return func;
    };
  
  var updateTableMap = (offset, count) => {
      if (functionsInTableMap) {
        for (var i = offset; i < offset + count; i++) {
          var item = getWasmTableEntry(i);
          // Ignore null values.
          if (item) {
            functionsInTableMap.set(item, i);
          }
        }
      }
    };
  
  var functionsInTableMap;
  
  var getFunctionAddress = (func) => {
      // First, create the map if this is the first use.
      if (!functionsInTableMap) {
        functionsInTableMap = new WeakMap();
        updateTableMap(0, wasmTable.length);
      }
      return functionsInTableMap.get(func) || 0;
    };
  
  
  var freeTableIndexes = [];
  
  var getEmptyTableSlot = () => {
      // Reuse a free index if there is one, otherwise grow.
      if (freeTableIndexes.length) {
        return freeTableIndexes.pop();
      }
      try {
        // Grow the table
        return wasmTable['grow'](1);
      } catch (err) {
        if (!(err instanceof RangeError)) {
          throw err;
        }
        abort('Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.');
      }
    };
  
  
  var setWasmTableEntry = (idx, func) => {
      /** @suppress {checkTypes} */
      wasmTable.set(idx, func);
      // With ABORT_ON_WASM_EXCEPTIONS wasmTable.get is overridden to return wrapped
      // functions so we need to call it here to retrieve the potential wrapper correctly
      // instead of just storing 'func' directly into wasmTableMirror
      /** @suppress {checkTypes} */
      wasmTableMirror[idx] = wasmTable.get(idx);
    };
  
  var uleb128EncodeWithLen = (arr) => {
      const n = arr.length;
      assert(n < 16384);
      // Note: this LEB128 length encoding produces extra byte for n < 128,
      // but we don't care as it's only used in a temporary representation.
      return [(n % 128) | 128, n >> 7, ...arr];
    };
  
  
  var wasmTypeCodes = {
      'i': 0x7f, // i32
      'p': 0x7f, // i32
      'j': 0x7e, // i64
      'f': 0x7d, // f32
      'd': 0x7c, // f64
      'e': 0x6f, // externref
    };
  var generateTypePack = (types) => uleb128EncodeWithLen(Array.from(types, (type) => {
      var code = wasmTypeCodes[type];
      assert(code, `invalid signature char: ${type}`);
      return code;
    }));
  var convertJsFunctionToWasm = (func, sig) => {
      // TODO: If the type reflection proposal ever makes progress we can use
      // it here instead of creatign a new module.
      var bytes = Uint8Array.of(
        0x00, 0x61, 0x73, 0x6d, // magic ("\0asm")
        0x01, 0x00, 0x00, 0x00, // version: 1
        0x01, // Type section code
          // The module is static, with the exception of the type section, which is
          // generated based on the signature passed in.
          ...uleb128EncodeWithLen([
            0x01, // count: 1
            0x60 /* form: func */,
            // param types
            ...generateTypePack(sig.slice(1)),
            // return types (for now only supporting [] if `void` and single [T] otherwise)
            ...generateTypePack(sig[0] === 'v' ? '' : sig[0])
          ]),
        // The rest of the module is static
        0x02, 0x07, // import section
          // (import "e" "f" (func 0 (type 0)))
          0x01, 0x01, 0x65, 0x01, 0x66, 0x00, 0x00,
        0x07, 0x05, // export section
          // (export "f" (func 0 (type 0)))
          0x01, 0x01, 0x66, 0x00, 0x00,
      );
  
      // We can compile this wasm module synchronously because it is very small.
      // This accepts an import (at "e.f"), that it reroutes to an export (at "f")
      var module = new WebAssembly.Module(bytes);
      var instance = new WebAssembly.Instance(module, { 'e': { 'f': func } });
      var wrappedFunc = instance.exports['f'];
      return wrappedFunc;
    };
  /** @param {string=} sig */
  var addFunction = (func, sig) => {
      assert(typeof func != 'undefined');
      // Check if the function is already in the table, to ensure each function
      // gets a unique index.
      var rtn = getFunctionAddress(func);
      if (rtn) {
        return rtn;
      }
  
      // It's not in the table, add it now.
  
      var ret = getEmptyTableSlot();
  
      // Set the new value.
      try {
        // Attempting to call this with JS function will cause table.set() to fail
        setWasmTableEntry(ret, func);
      } catch (err) {
        if (!(err instanceof TypeError)) {
          throw err;
        }
        assert(typeof sig != 'undefined', 'Missing signature argument to addFunction: ' + func);
        var wrapped = convertJsFunctionToWasm(func, sig);
        setWasmTableEntry(ret, wrapped);
      }
  
      functionsInTableMap.set(func, ret);
  
      return ret;
    };


  var FS_createPath = (...args) => FS.createPath(...args);



  var FS_unlink = (...args) => FS.unlink(...args);

  var FS_createLazyFile = (...args) => FS.createLazyFile(...args);

  var FS_createDevice = (...args) => FS.createDevice(...args);



    // Precreate a reverse lookup table from chars
    // "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/" back to
    // bytes to make decoding fast.
    for (var base64ReverseLookup = new Uint8Array(123/*'z'+1*/), __b64i = 25; __b64i >= 0; --__b64i) {
      base64ReverseLookup[48+__b64i] = 52+__b64i; // '0-9'
      base64ReverseLookup[65+__b64i] = __b64i; // 'A-Z'
      base64ReverseLookup[97+__b64i] = 26+__b64i; // 'a-z'
    }
    base64ReverseLookup[43] = 62; // '+'
    base64ReverseLookup[47] = 63; // '/'
  ;

  FS.createPreloadedFile = FS_createPreloadedFile;
  FS.preloadFile = FS_preloadFile;
  FS.staticInit();;
// End JS library code

// include: postlibrary.js
// This file is included after the automatically-generated JS library code
// but before the wasm module is created.

{

  // Begin ATMODULES hooks
  if (Module['noExitRuntime']) noExitRuntime = Module['noExitRuntime'];

if (Module['print']) out = Module['print'];
if (Module['printErr']) err = Module['printErr'];
  // End ATMODULES hooks

  checkIncomingModuleAPI();

  if (Module['arguments']) programArgs = Module['arguments'];
  if (Module['thisProgram']) thisProgram = Module['thisProgram'];

  // Assertions on removed incoming Module JS APIs.
  assert(typeof Module['memoryInitializerPrefixURL'] == 'undefined', 'Module.memoryInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['pthreadMainPrefixURL'] == 'undefined', 'Module.pthreadMainPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['cdInitializerPrefixURL'] == 'undefined', 'Module.cdInitializerPrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['filePackagePrefixURL'] == 'undefined', 'Module.filePackagePrefixURL option was removed, use Module.locateFile instead');
  assert(typeof Module['read'] == 'undefined', 'Module.read option was removed');
  assert(typeof Module['readAsync'] == 'undefined', 'Module.readAsync option was removed (modify readAsync in JS)');
  assert(typeof Module['readBinary'] == 'undefined', 'Module.readBinary option was removed (modify readBinary in JS)');
  assert(typeof Module['setWindowTitle'] == 'undefined', 'Module.setWindowTitle option was removed (modify emscripten_set_window_title in JS)');
  assert(typeof Module['TOTAL_MEMORY'] == 'undefined', 'Module.TOTAL_MEMORY has been renamed Module.INITIAL_MEMORY');
  assert(typeof Module['ENVIRONMENT'] == 'undefined', 'Module.ENVIRONMENT has been deprecated. To force the environment, use the ENVIRONMENT compile-time option (for example, -sENVIRONMENT=web or -sENVIRONMENT=node)');
  assert(typeof Module['STACK_SIZE'] == 'undefined', 'STACK_SIZE can no longer be set at runtime.  Use -sSTACK_SIZE at link time')
  // If memory is defined in wasm, the user can't provide it, or set INITIAL_MEMORY
  assert(typeof Module['wasmMemory'] == 'undefined', 'Use of `wasmMemory` detected.  Use -sIMPORTED_MEMORY to define wasmMemory externally');
  assert(typeof Module['INITIAL_MEMORY'] == 'undefined', 'Detected runtime INITIAL_MEMORY setting.  Use -sIMPORTED_MEMORY to define wasmMemory dynamically');

  var preInit = Module['preInit'];
  if (preInit) {
    if (typeof preInit == 'function') Module['preInit'] = preInit = [preInit];
    // Written as a loop so that preInit functions that themselves add more
    // preInit functions.  Is this actually needed?
    while (preInit.length > 0) {
      preInit.shift()();
    }
  }
  consumedModuleProp('preInit');
}

// Begin runtime exports
  Module['addRunDependency'] = addRunDependency;
  Module['removeRunDependency'] = removeRunDependency;
  Module['ccall'] = ccall;
  Module['cwrap'] = cwrap;
  Module['addFunction'] = addFunction;
  Module['FS_preloadFile'] = FS_preloadFile;
  Module['FS_unlink'] = FS_unlink;
  Module['FS_createPath'] = FS_createPath;
  Module['FS_createDevice'] = FS_createDevice;
  Module['FS'] = FS;
  Module['FS_createDataFile'] = FS_createDataFile;
  Module['FS_createLazyFile'] = FS_createLazyFile;
  var missingLibrarySymbols = [
  'writeI53ToI64',
  'writeI53ToI64Clamped',
  'writeI53ToI64Signaling',
  'writeI53ToU64Clamped',
  'writeI53ToU64Signaling',
  'readI53FromI64',
  'readI53FromU64',
  'convertI32PairToI53',
  'convertI32PairToI53Checked',
  'convertU32PairToI53',
  'getTempRet0',
  'setTempRet0',
  'createNamedFunction',
  'zeroMemory',
  'exitJS',
  'withStackSave',
  'inetPton4',
  'inetNtop4',
  'inetPton6',
  'inetNtop6',
  'readSockaddr',
  'writeSockaddr',
  'readEmAsmArgs',
  'jstoi_q',
  'getExecutableName',
  'autoResumeAudioContext',
  'getDynCaller',
  'dynCall',
  'handleException',
  'keepRuntimeAlive',
  'runtimeKeepalivePush',
  'runtimeKeepalivePop',
  'callUserCallback',
  'maybeExit',
  'asmjsMangle',
  'HandleAllocator',
  'addOnInit',
  'addOnPostCtor',
  'addOnPreMain',
  'addOnExit',
  'STACK_SIZE',
  'STACK_ALIGN',
  'POINTER_SIZE',
  'ASSERTIONS',
  'removeFunction',
  'intArrayToString',
  'AsciiToString',
  'stringToAscii',
  'UTF16ToString',
  'stringToUTF16',
  'lengthBytesUTF16',
  'UTF32ToString',
  'stringToUTF32',
  'lengthBytesUTF32',
  'stringToNewUTF8',
  'registerKeyEventCallback',
  'maybeCStringToJsString',
  'findEventTarget',
  'getBoundingClientRect',
  'fillMouseEventData',
  'registerMouseEventCallback',
  'registerWheelEventCallback',
  'registerUiEventCallback',
  'registerFocusEventCallback',
  'fillDeviceOrientationEventData',
  'registerDeviceOrientationEventCallback',
  'fillDeviceMotionEventData',
  'registerDeviceMotionEventCallback',
  'screenOrientation',
  'fillOrientationChangeEventData',
  'registerOrientationChangeEventCallback',
  'fillFullscreenChangeEventData',
  'registerFullscreenChangeEventCallback',
  'callCanvasResizedCallback',
  'JSEvents_requestFullscreen',
  'JSEvents_resizeCanvasForFullscreen',
  'registerRestoreOldStyle',
  'hideEverythingExceptGivenElement',
  'restoreHiddenElements',
  'setLetterbox',
  'currentFullscreenStrategy',
  'softFullscreenResizeWebGLRenderTarget',
  'doRequestFullscreen',
  'fillPointerlockChangeEventData',
  'registerPointerlockChangeEventCallback',
  'registerPointerlockErrorEventCallback',
  'requestPointerLock',
  'fillVisibilityChangeEventData',
  'registerVisibilityChangeEventCallback',
  'registerTouchEventCallback',
  'fillGamepadEventData',
  'registerGamepadEventCallback',
  'registerBeforeUnloadEventCallback',
  'fillBatteryEventData',
  'registerBatteryEventCallback',
  'setCanvasElementSize',
  'getCanvasElementSize',
  'jsStackTrace',
  'getCallstack',
  'convertPCtoSourceLocation',
  'getEnvStrings',
  'checkWasiClock',
  'wasiRightsToMuslOFlags',
  'wasiOFlagsToMuslOFlags',
  'safeSetTimeout',
  'setImmediateWrapped',
  'safeRequestAnimationFrame',
  'clearImmediateWrapped',
  'registerPostMainLoop',
  'registerPreMainLoop',
  'getPromise',
  'makePromise',
  'addPromise',
  'idsToPromises',
  'makePromiseCallback',
  'ExceptionInfo',
  'findMatchingCatch',
  'incrementUncaughtExceptionCount',
  'decrementUncaughtExceptionCount',
  'Browser_asyncPrepareDataCounter',
  'isLeapYear',
  'ydayFromDate',
  'arraySum',
  'addDays',
  'getSocketFromFD',
  'getSocketAddress',
  'FS_mkdirTree',
  '_setNetworkCallback',
  'heapObjectForWebGLType',
  'toTypedArrayIndex',
  'webgl_enable_ANGLE_instanced_arrays',
  'webgl_enable_OES_vertex_array_object',
  'webgl_enable_WEBGL_draw_buffers',
  'webgl_enable_WEBGL_multi_draw',
  'webgl_enable_EXT_polygon_offset_clamp',
  'webgl_enable_EXT_clip_control',
  'webgl_enable_WEBGL_polygon_mode',
  'emscriptenWebGLGet',
  'computeUnpackAlignedImageSize',
  'colorChannelsInGlTextureFormat',
  'emscriptenWebGLGetTexPixelData',
  'emscriptenWebGLGetUniform',
  'webglGetProgramUniformLocation',
  'webglGetUniformLocation',
  'webglPrepareUniformLocationsBeforeFirstUse',
  'webglGetLeftBracePos',
  'emscriptenWebGLGetVertexAttrib',
  '__glGetActiveAttribOrUniform',
  'writeGLArray',
  'registerWebGlEventCallback',
  'runAndAbortIfError',
  'ALLOC_NORMAL',
  'ALLOC_STACK',
  'allocate',
  'writeStringToMemory',
  'writeAsciiToMemory',
  'allocateUTF8',
  'allocateUTF8OnStack',
  'demangle',
  'stackTrace',
  'getNativeTypeSize',
];
missingLibrarySymbols.forEach(missingLibrarySymbol)

  var unexportedSymbols = [
  'run',
  'out',
  'err',
  'callMain',
  'abort',
  'wasmExports',
  'writeStackCookie',
  'checkStackCookie',
  'INT53_MAX',
  'INT53_MIN',
  'bigintToI53Checked',
  'HEAP8',
  'HEAPU8',
  'HEAP16',
  'HEAPU16',
  'HEAP32',
  'HEAPU32',
  'HEAPF64',
  'HEAP64',
  'HEAPU64',
  'stackSave',
  'stackRestore',
  'stackAlloc',
  'ptrToString',
  'getHeapMax',
  'growMemory',
  'ENV',
  'ERRNO_CODES',
  'strError',
  'DNS',
  'Protocols',
  'Sockets',
  'timers',
  'warnOnce',
  'readEmAsmArgsArray',
  'asyncLoad',
  'alignMemory',
  'mmapAlloc',
  'wasmTable',
  'wasmMemory',
  'getUniqueRunDependency',
  'noExitRuntime',
  'addOnPreRun',
  'addOnPostRun',
  'convertJsFunctionToWasm',
  'freeTableIndexes',
  'functionsInTableMap',
  'getEmptyTableSlot',
  'updateTableMap',
  'getFunctionAddress',
  'setValue',
  'getValue',
  'PATH',
  'PATH_FS',
  'UTF8Decoder',
  'UTF8ArrayToString',
  'UTF8ToString',
  'stringToUTF8Array',
  'stringToUTF8',
  'lengthBytesUTF8',
  'intArrayFromString',
  'UTF16Decoder',
  'stringToUTF8OnStack',
  'writeArrayToMemory',
  'JSEvents',
  'specialHTMLTargets',
  'findCanvasEventTarget',
  'restoreOldWindowedStyle',
  'UNWIND_CACHE',
  'ExitStatus',
  'doReadv',
  'doWritev',
  'initRandomFill',
  'randomFill',
  'emSetImmediate',
  'emClearImmediate_deps',
  'emClearImmediate',
  'promiseMap',
  'uncaughtExceptionCount',
  'exceptionCaught',
  'Browser',
  'requestFullscreen',
  'requestFullScreen',
  'setCanvasSize',
  'getUserMedia',
  'createContext',
  'getPreloadedImageData__data',
  'wget',
  'MONTH_DAYS_REGULAR',
  'MONTH_DAYS_LEAP',
  'MONTH_DAYS_REGULAR_CUMULATIVE',
  'MONTH_DAYS_LEAP_CUMULATIVE',
  'base64Decode',
  'SYSCALLS',
  'preloadPlugins',
  'FS_createPreloadedFile',
  'FS_modeStringToFlags',
  'FS_getMode',
  'FS_fileDataToTypedArray',
  'FS_stdin_getChar_buffer',
  'FS_stdin_getChar',
  'FS_readFile',
  'FS_root',
  'FS_mounts',
  'FS_devices',
  'FS_streams',
  'FS_nextInode',
  'FS_nameTable',
  'FS_currentPath',
  'FS_initialized',
  'FS_ignorePermissions',
  'FS_filesystems',
  'FS_syncFSRequests',
  'FS_lookupPath',
  'FS_getPath',
  'FS_hashName',
  'FS_hashAddNode',
  'FS_hashRemoveNode',
  'FS_lookupNode',
  'FS_createNode',
  'FS_destroyNode',
  'FS_isRoot',
  'FS_isMountpoint',
  'FS_isFile',
  'FS_isDir',
  'FS_isLink',
  'FS_isChrdev',
  'FS_isBlkdev',
  'FS_isFIFO',
  'FS_isSocket',
  'FS_flagsToPermissionString',
  'FS_nodePermissions',
  'FS_mayLookup',
  'FS_mayCreate',
  'FS_mayDelete',
  'FS_mayOpen',
  'FS_checkOpExists',
  'FS_nextfd',
  'FS_getStreamChecked',
  'FS_getStream',
  'FS_createStream',
  'FS_closeStream',
  'FS_dupStream',
  'FS_doSetAttr',
  'FS_chrdev_stream_ops',
  'FS_major',
  'FS_minor',
  'FS_makedev',
  'FS_registerDevice',
  'FS_getDevice',
  'FS_getMounts',
  'FS_syncfs',
  'FS_mount',
  'FS_unmount',
  'FS_lookup',
  'FS_mknod',
  'FS_statfs',
  'FS_statfsStream',
  'FS_statfsNode',
  'FS_create',
  'FS_mkdir',
  'FS_mkdev',
  'FS_symlink',
  'FS_link',
  'FS_rename',
  'FS_rmdir',
  'FS_readdir',
  'FS_readlink',
  'FS_stat',
  'FS_fstat',
  'FS_lstat',
  'FS_doChmod',
  'FS_chmod',
  'FS_lchmod',
  'FS_fchmod',
  'FS_doChown',
  'FS_chown',
  'FS_lchown',
  'FS_fchown',
  'FS_doTruncate',
  'FS_truncate',
  'FS_ftruncate',
  'FS_utime',
  'FS_open',
  'FS_close',
  'FS_isClosed',
  'FS_llseek',
  'FS_read',
  'FS_write',
  'FS_mmap',
  'FS_msync',
  'FS_ioctl',
  'FS_writeFile',
  'FS_cwd',
  'FS_chdir',
  'FS_createDefaultDirectories',
  'FS_createDefaultDevices',
  'FS_createSpecialDirectories',
  'FS_createStandardStreams',
  'FS_staticInit',
  'FS_init',
  'FS_quit',
  'FS_findObject',
  'FS_analyzePath',
  'FS_createFile',
  'FS_forceLoadFile',
  'MEMFS',
  'TTY',
  'PIPEFS',
  'SOCKFS',
  'tempFixedLengthArray',
  'miniTempWebGLFloatBuffers',
  'miniTempWebGLIntBuffers',
  'GL',
  'AL',
  'GLUT',
  'EGL',
  'GLEW',
  'IDBStore',
  'SDL',
  'SDL_gfx',
  'print',
  'printErr',
  'jstoi_s',
];
unexportedSymbols.forEach(unexportedRuntimeSymbol);

  // End runtime exports
  // Begin JS library exports
  // End JS library exports

// end include: postlibrary.js

function checkIncomingModuleAPI() {
  ignoredModuleProp('fetchSettings');
  ignoredModuleProp('logReadFiles');
  ignoredModuleProp('loadSplitModule');
  ignoredModuleProp('onMalloc');
  ignoredModuleProp('onRealloc');
  ignoredModuleProp('onFree');
  ignoredModuleProp('onSbrkGrow');
  ignoredModuleProp('onCOSCacheHit');
  ignoredModuleProp('onCOSCacheMiss');
  ignoredModuleProp('onCOSStore');
  ignoredModuleProp('GL_MAX_TEXTURE_IMAGE_UNITS');
  ignoredModuleProp('SDL_canPlayWithWebAudio');
  ignoredModuleProp('SDL_numSimultaneouslyQueuedBuffers');
  ignoredModuleProp('freePreloadedMediaOnUse');
  ignoredModuleProp('preinitializedWebGLContext');
  ignoredModuleProp('keyboardListeningElement');
  ignoredModuleProp('doNotCaptureKeyboard');
  ignoredModuleProp('extraStackTrace');
  ignoredModuleProp('preloadPlugins');
  ignoredModuleProp('preMainLoop');
  ignoredModuleProp('postMainLoop');
  ignoredModuleProp('forcedAspectRatio');
  ignoredModuleProp('mainScriptUrlOrBlob');
  ignoredModuleProp('onFullScreen');
  ignoredModuleProp('INITIAL_MEMORY');
  ignoredModuleProp('wasmMemory');
  ignoredModuleProp('wasmBinary');
}

// Imports from the Wasm binary.
var _EasyMidi_New = Module['_EasyMidi_New'] = makeInvalidEarlyAccess('_EasyMidi_New');
var _EasyMidi_New2 = Module['_EasyMidi_New2'] = makeInvalidEarlyAccess('_EasyMidi_New2');
var _EasyMidi_MidiCallback = Module['_EasyMidi_MidiCallback'] = makeInvalidEarlyAccess('_EasyMidi_MidiCallback');
var _EasyMidi_Load = Module['_EasyMidi_Load'] = makeInvalidEarlyAccess('_EasyMidi_Load');
var _EasyMidi_Load2 = Module['_EasyMidi_Load2'] = makeInvalidEarlyAccess('_EasyMidi_Load2');
var _EasyMidi_IsFinished = Module['_EasyMidi_IsFinished'] = makeInvalidEarlyAccess('_EasyMidi_IsFinished');
var _EasyMidi_RenderShort = Module['_EasyMidi_RenderShort'] = makeInvalidEarlyAccess('_EasyMidi_RenderShort');
var _EasyMidi_RenderFloat = Module['_EasyMidi_RenderFloat'] = makeInvalidEarlyAccess('_EasyMidi_RenderFloat');
var _EasyMidi_Reset = Module['_EasyMidi_Reset'] = makeInvalidEarlyAccess('_EasyMidi_Reset');
var _EasyMidi_Destroy = Module['_EasyMidi_Destroy'] = makeInvalidEarlyAccess('_EasyMidi_Destroy');
var _FileStream_New = Module['_FileStream_New'] = makeInvalidEarlyAccess('_FileStream_New');
var _FileStream_Destroy = Module['_FileStream_Destroy'] = makeInvalidEarlyAccess('_FileStream_Destroy');
var _MidiStream_New = Module['_MidiStream_New'] = makeInvalidEarlyAccess('_MidiStream_New');
var _MidiStream_Destroy = Module['_MidiStream_Destroy'] = makeInvalidEarlyAccess('_MidiStream_Destroy');
var _MidiStream_Advance = Module['_MidiStream_Advance'] = makeInvalidEarlyAccess('_MidiStream_Advance');
var _WaveSynth_New = Module['_WaveSynth_New'] = makeInvalidEarlyAccess('_WaveSynth_New');
var _WaveSynth_Load = Module['_WaveSynth_Load'] = makeInvalidEarlyAccess('_WaveSynth_Load');
var _WaveSynth_Destroy = Module['_WaveSynth_Destroy'] = makeInvalidEarlyAccess('_WaveSynth_Destroy');
var _WaveSynth_Reset = Module['_WaveSynth_Reset'] = makeInvalidEarlyAccess('_WaveSynth_Reset');
var _WaveSynth_Unload = Module['_WaveSynth_Unload'] = makeInvalidEarlyAccess('_WaveSynth_Unload');
var _WaveSynth_Note = Module['_WaveSynth_Note'] = makeInvalidEarlyAccess('_WaveSynth_Note');
var _WaveSynth_NoteOffAll = Module['_WaveSynth_NoteOffAll'] = makeInvalidEarlyAccess('_WaveSynth_NoteOffAll');
var _WaveSynth_SetBank = Module['_WaveSynth_SetBank'] = makeInvalidEarlyAccess('_WaveSynth_SetBank');
var _WaveSynth_SetBankMSB = Module['_WaveSynth_SetBankMSB'] = makeInvalidEarlyAccess('_WaveSynth_SetBankMSB');
var _WaveSynth_SetBankLSB = Module['_WaveSynth_SetBankLSB'] = makeInvalidEarlyAccess('_WaveSynth_SetBankLSB');
var _WaveSynth_SetProgram = Module['_WaveSynth_SetProgram'] = makeInvalidEarlyAccess('_WaveSynth_SetProgram');
var _WaveSynth_SetDrum = Module['_WaveSynth_SetDrum'] = makeInvalidEarlyAccess('_WaveSynth_SetDrum');
var _WaveSynth_ChangePitchWheel = Module['_WaveSynth_ChangePitchWheel'] = makeInvalidEarlyAccess('_WaveSynth_ChangePitchWheel');
var _WaveSynth_SetVolume = Module['_WaveSynth_SetVolume'] = makeInvalidEarlyAccess('_WaveSynth_SetVolume');
var _WaveSynth_SetVolumeMSB = Module['_WaveSynth_SetVolumeMSB'] = makeInvalidEarlyAccess('_WaveSynth_SetVolumeMSB');
var _WaveSynth_SetVolumeLSB = Module['_WaveSynth_SetVolumeLSB'] = makeInvalidEarlyAccess('_WaveSynth_SetVolumeLSB');
var _WaveSynth_RenderShort = Module['_WaveSynth_RenderShort'] = makeInvalidEarlyAccess('_WaveSynth_RenderShort');
var _WaveSynth_RenderFloat = Module['_WaveSynth_RenderFloat'] = makeInvalidEarlyAccess('_WaveSynth_RenderFloat');
var _fflush = makeInvalidEarlyAccess('_fflush');
var _strerror = makeInvalidEarlyAccess('_strerror');
var _malloc = Module['_malloc'] = makeInvalidEarlyAccess('_malloc');
var _free = Module['_free'] = makeInvalidEarlyAccess('_free');
var _emscripten_stack_init = makeInvalidEarlyAccess('_emscripten_stack_init');
var _emscripten_stack_get_free = makeInvalidEarlyAccess('_emscripten_stack_get_free');
var _emscripten_stack_get_base = makeInvalidEarlyAccess('_emscripten_stack_get_base');
var _emscripten_stack_get_end = makeInvalidEarlyAccess('_emscripten_stack_get_end');
var __emscripten_stack_restore = makeInvalidEarlyAccess('__emscripten_stack_restore');
var __emscripten_stack_alloc = makeInvalidEarlyAccess('__emscripten_stack_alloc');
var _emscripten_stack_get_current = makeInvalidEarlyAccess('_emscripten_stack_get_current');
var memory = makeInvalidEarlyAccess('memory');
var __indirect_function_table = makeInvalidEarlyAccess('__indirect_function_table');
var wasmMemory = makeInvalidEarlyAccess('wasmMemory');
var wasmTable = makeInvalidEarlyAccess('wasmTable');

function assignWasmExports(wasmExports) {
  assert(typeof wasmExports['EasyMidi_New'] != 'undefined', 'missing Wasm export: EasyMidi_New');
  assert(typeof wasmExports['EasyMidi_New2'] != 'undefined', 'missing Wasm export: EasyMidi_New2');
  assert(typeof wasmExports['EasyMidi_MidiCallback'] != 'undefined', 'missing Wasm export: EasyMidi_MidiCallback');
  assert(typeof wasmExports['EasyMidi_Load'] != 'undefined', 'missing Wasm export: EasyMidi_Load');
  assert(typeof wasmExports['EasyMidi_Load2'] != 'undefined', 'missing Wasm export: EasyMidi_Load2');
  assert(typeof wasmExports['EasyMidi_IsFinished'] != 'undefined', 'missing Wasm export: EasyMidi_IsFinished');
  assert(typeof wasmExports['EasyMidi_RenderShort'] != 'undefined', 'missing Wasm export: EasyMidi_RenderShort');
  assert(typeof wasmExports['EasyMidi_RenderFloat'] != 'undefined', 'missing Wasm export: EasyMidi_RenderFloat');
  assert(typeof wasmExports['EasyMidi_Reset'] != 'undefined', 'missing Wasm export: EasyMidi_Reset');
  assert(typeof wasmExports['EasyMidi_Destroy'] != 'undefined', 'missing Wasm export: EasyMidi_Destroy');
  assert(typeof wasmExports['FileStream_New'] != 'undefined', 'missing Wasm export: FileStream_New');
  assert(typeof wasmExports['FileStream_Destroy'] != 'undefined', 'missing Wasm export: FileStream_Destroy');
  assert(typeof wasmExports['MidiStream_New'] != 'undefined', 'missing Wasm export: MidiStream_New');
  assert(typeof wasmExports['MidiStream_Destroy'] != 'undefined', 'missing Wasm export: MidiStream_Destroy');
  assert(typeof wasmExports['MidiStream_Advance'] != 'undefined', 'missing Wasm export: MidiStream_Advance');
  assert(typeof wasmExports['WaveSynth_New'] != 'undefined', 'missing Wasm export: WaveSynth_New');
  assert(typeof wasmExports['WaveSynth_Load'] != 'undefined', 'missing Wasm export: WaveSynth_Load');
  assert(typeof wasmExports['WaveSynth_Destroy'] != 'undefined', 'missing Wasm export: WaveSynth_Destroy');
  assert(typeof wasmExports['WaveSynth_Reset'] != 'undefined', 'missing Wasm export: WaveSynth_Reset');
  assert(typeof wasmExports['WaveSynth_Unload'] != 'undefined', 'missing Wasm export: WaveSynth_Unload');
  assert(typeof wasmExports['WaveSynth_Note'] != 'undefined', 'missing Wasm export: WaveSynth_Note');
  assert(typeof wasmExports['WaveSynth_NoteOffAll'] != 'undefined', 'missing Wasm export: WaveSynth_NoteOffAll');
  assert(typeof wasmExports['WaveSynth_SetBank'] != 'undefined', 'missing Wasm export: WaveSynth_SetBank');
  assert(typeof wasmExports['WaveSynth_SetBankMSB'] != 'undefined', 'missing Wasm export: WaveSynth_SetBankMSB');
  assert(typeof wasmExports['WaveSynth_SetBankLSB'] != 'undefined', 'missing Wasm export: WaveSynth_SetBankLSB');
  assert(typeof wasmExports['WaveSynth_SetProgram'] != 'undefined', 'missing Wasm export: WaveSynth_SetProgram');
  assert(typeof wasmExports['WaveSynth_SetDrum'] != 'undefined', 'missing Wasm export: WaveSynth_SetDrum');
  assert(typeof wasmExports['WaveSynth_ChangePitchWheel'] != 'undefined', 'missing Wasm export: WaveSynth_ChangePitchWheel');
  assert(typeof wasmExports['WaveSynth_SetVolume'] != 'undefined', 'missing Wasm export: WaveSynth_SetVolume');
  assert(typeof wasmExports['WaveSynth_SetVolumeMSB'] != 'undefined', 'missing Wasm export: WaveSynth_SetVolumeMSB');
  assert(typeof wasmExports['WaveSynth_SetVolumeLSB'] != 'undefined', 'missing Wasm export: WaveSynth_SetVolumeLSB');
  assert(typeof wasmExports['WaveSynth_RenderShort'] != 'undefined', 'missing Wasm export: WaveSynth_RenderShort');
  assert(typeof wasmExports['WaveSynth_RenderFloat'] != 'undefined', 'missing Wasm export: WaveSynth_RenderFloat');
  assert(typeof wasmExports['fflush'] != 'undefined', 'missing Wasm export: fflush');
  assert(typeof wasmExports['strerror'] != 'undefined', 'missing Wasm export: strerror');
  assert(typeof wasmExports['malloc'] != 'undefined', 'missing Wasm export: malloc');
  assert(typeof wasmExports['free'] != 'undefined', 'missing Wasm export: free');
  assert(typeof wasmExports['emscripten_stack_init'] != 'undefined', 'missing Wasm export: emscripten_stack_init');
  assert(typeof wasmExports['emscripten_stack_get_free'] != 'undefined', 'missing Wasm export: emscripten_stack_get_free');
  assert(typeof wasmExports['emscripten_stack_get_base'] != 'undefined', 'missing Wasm export: emscripten_stack_get_base');
  assert(typeof wasmExports['emscripten_stack_get_end'] != 'undefined', 'missing Wasm export: emscripten_stack_get_end');
  assert(typeof wasmExports['_emscripten_stack_restore'] != 'undefined', 'missing Wasm export: _emscripten_stack_restore');
  assert(typeof wasmExports['_emscripten_stack_alloc'] != 'undefined', 'missing Wasm export: _emscripten_stack_alloc');
  assert(typeof wasmExports['emscripten_stack_get_current'] != 'undefined', 'missing Wasm export: emscripten_stack_get_current');
  assert(typeof wasmExports['memory'] != 'undefined', 'missing Wasm export: memory');
  assert(typeof wasmExports['__indirect_function_table'] != 'undefined', 'missing Wasm export: __indirect_function_table');
  _EasyMidi_New = Module['_EasyMidi_New'] = createExportWrapper('EasyMidi_New', wasmExports['EasyMidi_New'], 2);
  _EasyMidi_New2 = Module['_EasyMidi_New2'] = createExportWrapper('EasyMidi_New2', wasmExports['EasyMidi_New2'], 2);
  _EasyMidi_MidiCallback = Module['_EasyMidi_MidiCallback'] = createExportWrapper('EasyMidi_MidiCallback', wasmExports['EasyMidi_MidiCallback'], 2);
  _EasyMidi_Load = Module['_EasyMidi_Load'] = createExportWrapper('EasyMidi_Load', wasmExports['EasyMidi_Load'], 2);
  _EasyMidi_Load2 = Module['_EasyMidi_Load2'] = createExportWrapper('EasyMidi_Load2', wasmExports['EasyMidi_Load2'], 2);
  _EasyMidi_IsFinished = Module['_EasyMidi_IsFinished'] = createExportWrapper('EasyMidi_IsFinished', wasmExports['EasyMidi_IsFinished'], 1);
  _EasyMidi_RenderShort = Module['_EasyMidi_RenderShort'] = createExportWrapper('EasyMidi_RenderShort', wasmExports['EasyMidi_RenderShort'], 3);
  _EasyMidi_RenderFloat = Module['_EasyMidi_RenderFloat'] = createExportWrapper('EasyMidi_RenderFloat', wasmExports['EasyMidi_RenderFloat'], 3);
  _EasyMidi_Reset = Module['_EasyMidi_Reset'] = createExportWrapper('EasyMidi_Reset', wasmExports['EasyMidi_Reset'], 1);
  _EasyMidi_Destroy = Module['_EasyMidi_Destroy'] = createExportWrapper('EasyMidi_Destroy', wasmExports['EasyMidi_Destroy'], 1);
  _FileStream_New = Module['_FileStream_New'] = createExportWrapper('FileStream_New', wasmExports['FileStream_New'], 2);
  _FileStream_Destroy = Module['_FileStream_Destroy'] = createExportWrapper('FileStream_Destroy', wasmExports['FileStream_Destroy'], 1);
  _MidiStream_New = Module['_MidiStream_New'] = createExportWrapper('MidiStream_New', wasmExports['MidiStream_New'], 2);
  _MidiStream_Destroy = Module['_MidiStream_Destroy'] = createExportWrapper('MidiStream_Destroy', wasmExports['MidiStream_Destroy'], 1);
  _MidiStream_Advance = Module['_MidiStream_Advance'] = createExportWrapper('MidiStream_Advance', wasmExports['MidiStream_Advance'], 2);
  _WaveSynth_New = Module['_WaveSynth_New'] = createExportWrapper('WaveSynth_New', wasmExports['WaveSynth_New'], 2);
  _WaveSynth_Load = Module['_WaveSynth_Load'] = createExportWrapper('WaveSynth_Load', wasmExports['WaveSynth_Load'], 5);
  _WaveSynth_Destroy = Module['_WaveSynth_Destroy'] = createExportWrapper('WaveSynth_Destroy', wasmExports['WaveSynth_Destroy'], 1);
  _WaveSynth_Reset = Module['_WaveSynth_Reset'] = createExportWrapper('WaveSynth_Reset', wasmExports['WaveSynth_Reset'], 1);
  _WaveSynth_Unload = Module['_WaveSynth_Unload'] = createExportWrapper('WaveSynth_Unload', wasmExports['WaveSynth_Unload'], 4);
  _WaveSynth_Note = Module['_WaveSynth_Note'] = createExportWrapper('WaveSynth_Note', wasmExports['WaveSynth_Note'], 4);
  _WaveSynth_NoteOffAll = Module['_WaveSynth_NoteOffAll'] = createExportWrapper('WaveSynth_NoteOffAll', wasmExports['WaveSynth_NoteOffAll'], 2);
  _WaveSynth_SetBank = Module['_WaveSynth_SetBank'] = createExportWrapper('WaveSynth_SetBank', wasmExports['WaveSynth_SetBank'], 3);
  _WaveSynth_SetBankMSB = Module['_WaveSynth_SetBankMSB'] = createExportWrapper('WaveSynth_SetBankMSB', wasmExports['WaveSynth_SetBankMSB'], 3);
  _WaveSynth_SetBankLSB = Module['_WaveSynth_SetBankLSB'] = createExportWrapper('WaveSynth_SetBankLSB', wasmExports['WaveSynth_SetBankLSB'], 3);
  _WaveSynth_SetProgram = Module['_WaveSynth_SetProgram'] = createExportWrapper('WaveSynth_SetProgram', wasmExports['WaveSynth_SetProgram'], 4);
  _WaveSynth_SetDrum = Module['_WaveSynth_SetDrum'] = createExportWrapper('WaveSynth_SetDrum', wasmExports['WaveSynth_SetDrum'], 3);
  _WaveSynth_ChangePitchWheel = Module['_WaveSynth_ChangePitchWheel'] = createExportWrapper('WaveSynth_ChangePitchWheel', wasmExports['WaveSynth_ChangePitchWheel'], 3);
  _WaveSynth_SetVolume = Module['_WaveSynth_SetVolume'] = createExportWrapper('WaveSynth_SetVolume', wasmExports['WaveSynth_SetVolume'], 3);
  _WaveSynth_SetVolumeMSB = Module['_WaveSynth_SetVolumeMSB'] = createExportWrapper('WaveSynth_SetVolumeMSB', wasmExports['WaveSynth_SetVolumeMSB'], 3);
  _WaveSynth_SetVolumeLSB = Module['_WaveSynth_SetVolumeLSB'] = createExportWrapper('WaveSynth_SetVolumeLSB', wasmExports['WaveSynth_SetVolumeLSB'], 3);
  _WaveSynth_RenderShort = Module['_WaveSynth_RenderShort'] = createExportWrapper('WaveSynth_RenderShort', wasmExports['WaveSynth_RenderShort'], 3);
  _WaveSynth_RenderFloat = Module['_WaveSynth_RenderFloat'] = createExportWrapper('WaveSynth_RenderFloat', wasmExports['WaveSynth_RenderFloat'], 3);
  _fflush = createExportWrapper('fflush', wasmExports['fflush'], 1);
  _strerror = createExportWrapper('strerror', wasmExports['strerror'], 1);
  _malloc = Module['_malloc'] = createExportWrapper('malloc', wasmExports['malloc'], 1);
  _free = Module['_free'] = createExportWrapper('free', wasmExports['free'], 1);
  _emscripten_stack_init = wasmExports['emscripten_stack_init'];
  _emscripten_stack_get_free = wasmExports['emscripten_stack_get_free'];
  _emscripten_stack_get_base = wasmExports['emscripten_stack_get_base'];
  _emscripten_stack_get_end = wasmExports['emscripten_stack_get_end'];
  __emscripten_stack_restore = wasmExports['_emscripten_stack_restore'];
  __emscripten_stack_alloc = wasmExports['_emscripten_stack_alloc'];
  _emscripten_stack_get_current = wasmExports['emscripten_stack_get_current'];
  memory = wasmMemory = wasmExports['memory'];
  __indirect_function_table = wasmTable = wasmExports['__indirect_function_table'];
}

var wasmImports = {
  /** @export */
  __syscall_fcntl64: ___syscall_fcntl64,
  /** @export */
  __syscall_ioctl: ___syscall_ioctl,
  /** @export */
  __syscall_openat: ___syscall_openat,
  /** @export */
  _abort_js: __abort_js,
  /** @export */
  emscripten_resize_heap: _emscripten_resize_heap,
  /** @export */
  fd_close: _fd_close,
  /** @export */
  fd_read: _fd_read,
  /** @export */
  fd_seek: _fd_seek,
  /** @export */
  fd_write: _fd_write
};


// include: postamble.js
// === Auto-generated postamble setup entry stuff ===

var calledRun;

function stackCheckInit() {
  // This is normally called automatically during __wasm_call_ctors but need to
  // get these values before even running any of the ctors so we call it redundantly
  // here.
  _emscripten_stack_init();
  // TODO(sbc): Move writeStackCookie to native to to avoid this.
  writeStackCookie();
}

async function run() {
  assert(!calledRun);
  calledRun = true;

  stackCheckInit();

  preRun();

  if (runDependencies) {
    await resolveRunDependencies();
  }

  var setStatus = Module['setStatus'];
  if (setStatus) {
    setStatus('Running...');
    // Yield to the event loop to allow the browser to paint "Running..."
    await new Promise((resolve) => setTimeout(resolve, 1));
    // Then we want to clear the status text, but only after the rest of this function runs.
    setTimeout(setStatus, 1, '');
  }

  if (ABORT) return;

  initRuntime();

  Module['onRuntimeInitialized']?.();
  consumedModuleProp('onRuntimeInitialized');

  assert(!Module['_main'], 'compiled without a main, but one is present. if you added it from JS, use Module["onRuntimeInitialized"]');

  postRun();
}

function checkUnflushedContent() {
  // Compiler settings do not allow exiting the runtime, so flushing
  // the streams is not possible. but in ASSERTIONS mode we check
  // if there was something to flush, and if so tell the user they
  // should request that the runtime be exitable.
  // Normally we would not even include flush() at all, but in ASSERTIONS
  // builds we do so just for this check, and here we see if there is any
  // content to flush, that is, we check if there would have been
  // something a non-ASSERTIONS build would have not seen.
  // How we flush the streams depends on whether we are in SYSCALLS_REQUIRE_FILESYSTEM=0
  // mode (which has its own special function for this; otherwise, all
  // the code is inside libc)
  var oldOut = out;
  var oldErr = err;
  var has = false;
  out = err = (x) => {
    has = true;
  }
  try { // it doesn't matter if it fails
    _fflush(0);
    // also flush in the JS FS layer
    for (var name of ['stdout', 'stderr']) {
      var info = FS.analyzePath('/dev/' + name);
      if (!info) return;
      var stream = info.object;
      var rdev = stream.rdev;
      var tty = TTY.ttys[rdev];
      if (tty?.output?.length) {
        has = true;
      }
    }
  } catch(e) {}
  out = oldOut;
  err = oldErr;
  if (has) {
    warnOnce('stdio streams had content in them that was not flushed. you should set EXIT_RUNTIME to 1 (see the Emscripten FAQ), or make sure to emit a newline when you printf etc.');
  }
}

var wasmExports;

// In modularize mode the generated code is within a factory function so we
// can use await here (since it's not top-level-await).
wasmExports = await createWasm();
await run();

// end include: postamble.js

// include: postamble_modularize.js
// In MODULARIZE mode we wrap the generated code in a factory function
// and return either the Module itself, or a promise of the module.

// Assertion for attempting to access module properties on the incoming
// moduleArg.  In the past we used this object as the prototype of the module
// and assigned properties to it, but now we return a distinct object.  This
// keeps the instance private until it is ready (i.e the promise has been
// resolved).
for (const prop of Object.keys(Module)) {
  if (!(prop in moduleArg)) {
    Object.defineProperty(moduleArg, prop, {
      configurable: true,
      get() {
        abort(`Access to module property ('${prop}') is no longer possible via the module constructor argument; Instead, use the result of the module constructor.`)
      }
    });
  }
}
// end include: postamble_modularize.js



    return Module;
  };
})();

// Export using a UMD style export, or ES6 exports if selected
if (typeof exports === 'object' && typeof module === 'object') {
  module.exports = TurboSynthWASM;
  // This default export looks redundant, but it allows TS to import this
  // commonjs style module.
  module.exports.default = TurboSynthWASM;
} else if (typeof define === 'function' && define['amd'])
  define([], () => TurboSynthWASM);

embedded = true;

  if (embedded) {
    TurboSynth = TurboSynthWASM;
  } else {
    TurboSynth = await Scratch.external.evalAndReturn(
      "https://raw.githubusercontent.com/pyrite-dev/pmidi/42a8c0657b71c54a59a2a7bc0f74e74907afa24d/web/turbosynthwasm.js",
      "TurboSynthWASM"
    );
  }

  Module = await TurboSynth();

  FileStream_New = Module.cwrap("FileStream_New", "number", [
    "string",
    "number",
  ]);
  FileStream_Destroy = Module.cwrap("FileStream_Destroy", null, ["number"]);

  WaveSynth_New = Module.cwrap("WaveSynth_New", "number", ["number", "number"]);
  WaveSynth_Note = Module.cwrap("WaveSynth_Note", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  WaveSynth_NoteOffAll = Module.cwrap("WaveSynth_NoteOffAll", null, [
    "number",
    "number",
  ]);
  WaveSynth_SetBank = Module.cwrap("WaveSynth_SetBank", null, [
    "number",
    "number",
    "number",
  ]);
  WaveSynth_SetProgram = Module.cwrap("WaveSynth_SetProgram", null, [
    "number",
    "number",
    "number",
    "number",
  ]);
  WaveSynth_SetDrum = Module.cwrap("WaveSynth_SetDrum", null, [
    "number",
    "number",
    "number",
  ]);
  WaveSynth_ChangePitchWheel = Module.cwrap(
    "WaveSynth_ChangePitchWheel",
    null,
    ["number", "number", "number"]
  );
  WaveSynth_SetVolume = Module.cwrap("WaveSynth_SetVolume", null, [
    "number",
    "number",
    "number",
  ]);
  WaveSynth_RenderFloat = Module.cwrap("WaveSynth_RenderFloat", null, [
    "number",
    "number",
    "number",
  ]);
  WaveSynth_Reset = Module.cwrap("WaveSynth_Reset", null, ["number"]);
  WaveSynth_Destroy = Module.cwrap("WaveSynth_Destroy", null, ["number"]);

  JZZip = await Scratch.external.evalAndReturn(
    "https://cdn.jsdelivr.net/npm/jszip@3.10.1/dist/jszip.min.js",
    "JSZip"
  );
  AudioPlayer = await Scratch.external.evalAndReturn(
    "https://raw.githubusercontent.com/pyrite-dev/pmidi/42a8c0657b71c54a59a2a7bc0f74e74907afa24d/web/audioplayer.js",
    "AudioPlayer"
  );

  florestanZip = await Scratch.external.dataURL(
    "https://raw.githubusercontent.com/pyrite-dev/pmidi/42a8c0657b71c54a59a2a7bc0f74e74907afa24d/web/florestan.zip"
  );

  function newSynthId() {
    let id;

    do {
      id = Math.floor(Math.random() * 0x100000000).toString();
    } while (synth[id]);

    synth[id] = { tempo: 60 };

    return id;
  }

  function destroySynthId(id) {
    delete synth[id];
  }

  async function fileOpSynthId(id, callback) {
    return navigator.locks.request("turboSynthFS", async (lock) => {
      Module.FS.mkdir(`/${id}`);
      Module.FS.mount(Module.FS.filesystems.MEMFS, {}, `/${id}`);
      Module.FS.chdir(`/${id}`);

      await callback(lock);

      Module.FS.chdir("/");
      Module.FS.unmount(`/${id}`);
      Module.FS.rmdir(`/${id}`);
    });
  }

  function beatsToMs(synth, beats) {
    return ((beats * 60) / synth.tempo) * 1000;
  }

  function playNote(synth, channel, note, velocity = 127) {
    WaveSynth_Note(synth, channel, note, velocity);
  }

  function stopNote(synth, channel, note) {
    playNote(synth, channel, note, 0);
  }

  function after(callback, ms) {
    return new Promise((res, rej) => {
      setTimeout(async () => {
        await callback();
        res();
      }, ms);
    });
  }

  const blockIconURI =
    "data:image/svg+xml;base64,PHN2ZyB4bWxuczp4PSJodHRwOi8vbnMuYWRvYmUuY29tL0V4dGVuc2liaWxpdHkvMS4wLyIgeG1sbnM6aT0iaHR0cDovL25zLmFkb2JlLmNvbS9BZG9iZUlsbHVzdHJhdG9yLzEwLjAvIiB4bWxuczpncmFwaD0iaHR0cDovL25zLmFkb2JlLmNvbS9HcmFwaHMvMS4wLyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDEwMCA5Ny45NDMiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDEwMCA5Ny45NDMiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxtZXRhZGF0YT48c2Z3IHhtbG5zPSJodHRwOi8vbnMuYWRvYmUuY29tL1NhdmVGb3JXZWIvMS4wLyI+PHNsaWNlcz48L3NsaWNlcz48c2xpY2VTb3VyY2VCb3VuZHMgd2lkdGg9IjkwLjA3OSIgaGVpZ2h0PSI4NC40NSIgeD0iMzc1LjQ2MSIgeT0iNTU2LjgzMyIgYm90dG9tTGVmdE9yaWdpbj0idHJ1ZSI+PC9zbGljZVNvdXJjZUJvdW5kcz48L3Nmdz48L21ldGFkYXRhPjxwYXRoIGZpbGw9IndoaXRlIiBkPSJNOTUuMDQsNzYuNTU4bC0wLjAwNi0xLjAwNmMtMC4xNzctMjkuMTQyLTExLjc3Ni0zMS4yNTYtMTguNzA3LTMyLjUyYy0xLjE3MS0wLjIxMy0yLjE4My0wLjM5OC0zLjAxNC0wLjY3NSAgYy0xMC4yOTMtMy40MjgtMTQuNzkyLTExLjU1My0xOS4xNDMtMTkuNDFDNDguNzkyLDEzLjIzNCw0My4yMywzLjE4OSwyNi44MzIsMy4xODljLTEuMTk1LDAtMi40NTMsMC4wNTQtMy43MzgsMC4xNiAgQzEyLjkyNiw0LjE4NSw0Ljc5MywxMi43ODMsNC45NjMsMjIuNTE0YzAuMTA3LDYuMDk1LDAuMDAxLDUyLjU3MywwLDUzLjA0MmwtMC4wMDIsMS4wMDJoMC4yMDZ2MTEuMDgxaDg5LjY2NlY3Ni41NThIOTUuMDR6ICAgTTkyLjgzMyw4NS42MzlINy4xNjd2LTguNTQzSDkuMzF2Ni4wMDVoMS44NzF2LTYuMDA1aDEuNDAzdjYuMDA1aDEuODd2LTYuMDA1aDMuNTh2Ni4wMDVoMS44N3YtNi4wMDVoMS40MDN2Ni4wMDVoMS44N3YtNi4wMDUgIGgxLjYxOXY2LjAwNWgxLjg3MXYtNi4wMDVoNC4zNTR2Ni4wMDVoMS44N3YtNi4wMDVoMS40MDF2Ni4wMDVoMS44NzF2LTYuMDA1aDMuNTh2Ni4wMDVoMS44NzF2LTYuMDA1aDEuNDAzdjYuMDA1aDEuODd2LTYuMDA1ICBoMS42MTl2Ni4wMDVoMS44NzF2LTYuMDA1aDMuNjAydjYuMDA1aDEuODd2LTYuMDA1aDEuNDAzdjYuMDA1aDEuODY5di02LjAwNWgzLjU4djYuMDA1aDEuODcxdi02LjAwNWgxLjQwMXY2LjAwNWgxLjg2OXYtNi4wMDUgIGgxLjYydjYuMDA1aDEuODcxdi02LjAwNWgzLjY2NXY2LjAwNWgxLjg3di02LjAwNWgxLjQwM3Y2LjAwNWgxLjg2OXYtNi4wMDVoMy41ODF2Ni4wMDVoMS44N3YtNi4wMDVoMS40MDF2Ni4wMDVoMS44N3YtNi4wMDVoMS42MTggIHY2LjAwNWgxLjg3MnYtNi4wMDVoMi40OFY4NS42Mzl6Ij48L3BhdGg+PC9zdmc+Cg==";

  class TurboSynth {
    getInfo() {
      return {
        id: "nishiowoTurboSynth",
        name: Scratch.translate("TurboSynth"),
        blockIconURI: blockIconURI,
        docsURI: "https://extensions.nitrobolt.org/NishiOwO/turbosynth",
        color1: "#884400",
        blocks: [
          {
            opcode: "resetAll",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("reset all"),
          },
          {
            blockType: "label",
            text: Scratch.translate("Synthesizer"),
          },
          {
            opcode: "newSynth",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("new synthesizer with patches [PATCHES]"),
            arguments: {
              PATCHES: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "destroySynth",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("destroy synthesizer [SYNTH]"),
            arguments: {
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "resetSynth",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("reset synthesizer [SYNTH]"),
            arguments: {
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "defaultPatches",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("default patches"),
          },
          {
            blockType: "label",
            text: Scratch.translate("Tempo control"),
          },
          {
            opcode: "synthTempo",
            blockType: Scratch.BlockType.REPORTER,
            disableMonitor: true,
            text: Scratch.translate("tempo of synthesizer [SYNTH]"),
            arguments: {
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setSynthTempo",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set tempo to [TEMPO] for synthesizer [SYNTH]"
            ),
            arguments: {
              TEMPO: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 60,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "synthRest",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "rest for [BEATS] beats for synthesizer [SYNTH]"
            ),
            arguments: {
              BEATS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.25,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Note control"),
          },
          {
            opcode: "playNote",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "play note [NOTE] for channel [CHANNEL] for [BEATS] beats on synthesizer [SYNTH]"
            ),
            arguments: {
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: 60,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              BEATS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.25,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "playNoteAsync",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "play note [NOTE] for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: 60,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "stopNote",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "stop note [NOTE] for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: 60,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Drum control"),
          },
          {
            opcode: "playDrum",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "play drum [DRUM] for channel [CHANNEL] for [BEATS] beats on synthesizer [SYNTH]"
            ),
            arguments: {
              DRUM: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              BEATS: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0.25,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "playDrumAsync",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "play drum [DRUM] for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              DRUM: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "stopDrum",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "stop drum [DRUM] for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              DRUM: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            blockType: "label",
            text: Scratch.translate("Channel control"),
          },
          {
            opcode: "setBank",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set bank to [BANK] on channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              BANK: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 16383,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setProgram",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set program to [PROGRAM] on channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              PROGRAM: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "changePitchWheel",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "change pitchwheel to [SEMITONE] semitones on channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              SEMITONE: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "setVolume",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "set volume to [VOLUME]% semitones on channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              VOLUME: {
                type: argSlider,
                defaultValue: 100,
                min: 0,
                max: 100,
                precision: 1,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "stopChannel",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate(
              "stop all sounds for channel [CHANNEL] on synthesizer [SYNTH]"
            ),
            arguments: {
              NOTE: {
                type: Scratch.ArgumentType.NOTE,
                defaultValue: 60,
              },
              CHANNEL: {
                type: argSlider,
                defaultValue: 0,
                min: 0,
                max: 127,
                precision: 1,
              },
              SYNTH: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
        ],
      };
    }

    resetAll() {
      let p = [];
      for (let i in synth) {
        p.push(this.destroySynth({ SYNTH: i }));
      }
      return Promise.all(p);
    }

    newSynth(args) {
      let zip, cfgs, fs;
      let id = newSynthId();

      synth[id].promise = (async () => {
        try {
          const res = await Scratch.fetch(args.PATCHES);
          zip = await JSZip.loadAsync(await res.arrayBuffer());
          cfgs = Object.keys(zip.files).filter((x) =>
            x.toLowerCase().endsWith(".cfg")
          );

          if (cfgs.length == 0) throw new Error();
        } catch {
          destroySynthId(id);
          return "";
        }

        await fileOpSynthId(id, async () => {
          for (let i in zip.files) {
            if (zip.files[i].dir) {
              Module.FS.mkdir(i);
            } else {
              Module.FS.writeFile(i, await zip.files[i].async("arraybuffer"));
            }
          }

          if ((fs = FileStream_New(cfgs[0], 0)) == 0) {
            destroySynthId(id);

            return "";
          }

          if ((synth[id].synth = WaveSynth_New(fs, 44100)) == 0) {
            FileStream_Destroy(fs);
            destroySynthId(id);

            return "";
          }

          FileStream_Destroy(fs);
        });

        synth[id].audioPlayer = new AudioPlayer(
          Scratch.vm.runtime.audioEngine.audioContext,
          44100
        );

        synth[id].bufferPtr = Module._malloc(
          2 * synth[id].audioPlayer.frames * 4
        );
        synth[id].buffer = new Float32Array(
          Module.HEAPF32.buffer,
          synth[id].bufferPtr
        );

        synth[id].audioPlayer.onbuffer = (audioBuffer, frames) => {
          const lChannelData = audioBuffer.getChannelData(0);
          const rChannelData = audioBuffer.getChannelData(1);

          WaveSynth_RenderFloat(synth[id].synth, synth[id].bufferPtr, frames);

          for (let i = 0; i < frames; i++) {
            lChannelData[i] = synth[id].buffer[2 * i + 0];
            rChannelData[i] = synth[id].buffer[2 * i + 1];
          }
        };

        synth[id].audioPlayer.resume();

        return id;
      })();

      return synth[id].promise;
    }

    destroySynth(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(async () => {
        await new Promise((res, rej) => {
          synth[args.SYNTH].audioPlayer.onended = () => {
            Module._free(synth[args.SYNTH].bufferPtr);
            WaveSynth_Destroy(synth[args.SYNTH].synth);
            destroySynthId(args.SYNTH);

            res();
          };

          synth[args.SYNTH].audioPlayer.shutdown();
        });
      });
    }

    resetSynth(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        WaveSynth_Reset(synth[args.SYNTH].synth);
      });
    }

    synthTempo(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        return synth[args.SYNTH].tempo;
      });
    }

    setSynthTempo(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        synth[args.SYNTH].tempo = args.TEMPO;
      });
    }

    synthRest(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(async () => {
        await after(() => {}, beatsToMs(synth[args.SYNTH], args.BEATS));
      });
    }

    defaultPatches() {
      return florestanZip;
    }

    playNote(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(async () => {
        playNote(synth[args.SYNTH].synth, args.CHANNEL, args.NOTE);

        await after(
          () => {
            stopNote(synth[args.SYNTH].synth, args.CHANNEL, args.NOTE);
          },
          beatsToMs(synth[args.SYNTH], args.BEATS)
        );
      });
    }

    playNoteAsync(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        playNote(synth[args.SYNTH].synth, args.CHANNEL, args.NOTE);
      });
    }

    stopNote(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        stopNote(synth[args.SYNTH].synth, args.CHANNEL, args.NOTE);
      });
    }

    setBank(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        WaveSynth_SetBank(synth[args.SYNTH].synth, args.CHANNEL, args.BANK);
      });
    }

    setProgram(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        WaveSynth_SetProgram(
          synth[args.SYNTH].synth,
          args.CHANNEL,
          args.PROGRAM,
          0
        );
      });
    }

    playDrum(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(async () => {
        WaveSynth_SetDrum(synth[args.SYNTH].synth, args.CHANNEL, 1);
        playNote(synth[args.SYNTH].synth, args.CHANNEL, args.DRUM);

        await after(
          () => {
            stopNote(synth[args.SYNTH].synth, args.CHANNEL, args.DRUM);
            WaveSynth_SetDrum(synth[args.SYNTH].synth, args.CHANNEL, 0);
          },
          beatsToMs(synth[args.SYNTH], args.BEATS)
        );
      });
    }

    playDrumAsync(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        WaveSynth_SetDrum(synth[args.SYNTH].synth, args.CHANNEL, 1);
        playNote(synth[args.SYNTH].synth, args.CHANNEL, args.DRUM);
        WaveSynth_SetDrum(synth[args.SYNTH].synth, args.CHANNEL, 0);
      });
    }

    stopDrum(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        stopNote(synth[args.SYNTH].synth, args.CHANNEL, args.DRUM);
      });
    }

    changePitchWheel(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        WaveSynth_ChangePitchWheel(
          synth[args.SYNTH].synth,
          args.CHANNEL,
          args.SEMITONE
        );
      });
    }

    setVolume(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        WaveSynth_SetVolume(
          synth[args.SYNTH].synth,
          args.CHANNEL,
          args.VOLUME / 100
        );
      });
    }

    stopChannel(args) {
      if (!synth[args.SYNTH]) return;

      return synth[args.SYNTH].promise.then(() => {
        WaveSynth_NoteOffAll(synth[args.SYNTH].synth, args.CHANNEL);
      });
    }
  }

  Scratch.extensions.register(new TurboSynth());
})(Scratch);
