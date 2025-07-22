# Addons Extension Documentation

This extension provides a powerful and secure system to run external JavaScript code that can interact with your PenguinMod project. Think of it like a modding API for your creations. You can create a bridge between your project and JavaScript, allowing for complex calculations, interaction with web APIs, or creating dynamic game logic that would be difficult to do with blocks alone.

You can use this system to build entire modding platforms, similar to games like Garry's Mod, where external scripts can safely modify the game's behavior according to the rules you set.

### A Note on Power and Responsibility

The Addons extension is designed with **security as the top priority**. All addon code runs in a heavily restricted `iframe` sandbox. By default, an addon can do **nothing** to your project or the page it's running on. It cannot access your variables, control your sprites, or manipulate the page. Addons cannot access the internet, unless you directly give them a function to.

You, the project creator, grant the addon power by using the **"expose" blocks**. When you expose a variable or a function, you are opening a small, controlled door through that sandbox wall. This is what makes the extension so powerful.

It is your responsibility to only expose the functions and variables that you want addons to have access to. The sandbox is secure, but what you choose to unlock is up to you.

---
## Blocks

This is the reference guide for all blocks in the Addons extension.

### Addon Lifecycle

These blocks control the registration and execution of your addons.

```scratch
register addon [my-addon] with JS code [(function(AddonAPI){...})] :: #6A5ACD
```
The core block for adding an addon. It takes a unique **ID** and the **JavaScript code**. If an addon with the same ID already exists, this block updates its code and automatically restarts it if it was running (hot-reloading).

---

```scratch
start addon [my-addon v] :: #6A5ACD
```
Runs the code for the specified addon in its secure sandbox. The addon will remain active until it is stopped.

---

```scratch
stop addon [my-addon v] :: #6A5ACD
```
Immediately terminates the specified addon's sandbox. This will stop any running code, including loops or `setInterval` calls within the addon.

---

```scratch
restart addon [my-addon v] :: #6A5ACD
```
A convenience block that stops and then immediately starts a running addon. This is useful for reloading an addon with any newly exposed functions or variables.

---

```scratch
unregister addon [my-addon v] :: #6A5ACD
```
Stops the addon if it's running and completely removes it from the registry.

---

```scratch
is addon [my-addon v] running? :: #6A5ACD :: boolean
```
A boolean reporter that returns `true` if the specified addon is currently active and running.

### API Exposure

These blocks are how you grant an addon access to parts of your project.

```scratch
expose var [score v] to addons as [playerScore] :: #6A5ACD
```
Creates a two-way bridge to a PenguinMod variable.
*   **expose var**: The variable you want to share.
*   **as**: The name the variable will have in the JavaScript `AddonAPI` object. This name cannot contain spaces; the block will show an error if it does. This is so you can reliably have the variable have a consistent name, without worrying what the editor will do to the spaces in your variable name, or so you can give it names like `"Player.Score"` to make your API cleaner.

---

```scratch
unexpose variable [playerScore v] :: #6A5ACD
```
Removes a previously exposed variable from the `AddonAPI`. Active addons must be restarted for this change to take effect.

---

```scratch
expose function named [logToSprite] with [1] inputs :: #6A5ACD
```
Exposes a function name to all addons. When an addon calls this function, the `when addon calls function...` hat block is triggered.
*   **named**: The name the function will have in the `AddonAPI` object (e.g., `AddonAPI.logToSprite(...)`). This name cannot contain spaces.
*   **with inputs**: The number of arguments the function expects. The addon's call will be ignored if the argument count doesn't match.

---

```scratch
unexpose function [logToSprite v] :: #6A5ACD
```
Removes a previously exposed function from the `AddonAPI`. Active addons must be restarted for this change to take effect.

### Communication

These blocks handle the flow of information between your project and the addons.

```scratch
broadcast [game-event] with data [level 1] :: #6A5ACD
```
Sends a message to all listening addons. This uses a custom broadcast system separate from PenguinMod's built-in broadcasts. Addons can listen for these messages using `AddonAPI.onBroadcast`.

---

```scratch
(run callback [getPlayerStatus] in addon [game-logic v] with data [player1] :: #6A5ACD)
```
This is an **asynchronous** reporter that requests a value from a specific addon. When this block runs, the script will pause and wait for the addon to respond. The addon handles this with `AddonAPI.onCallback` and can `return` a value. If the addon doesn't respond within 60 seconds, this block will report `null`.

---

```scratch
when addon calls function [logToSprite v] with inputs (last function call inputs :: #6A5ACD) :: #6A5ACD :: hat
```
This hat block is the receiving end for an exposed function. It triggers whenever any active addon calls the specified function. The `(last function call inputs)` reporter can be dragged out and used inside this script. It will report a JSON array of the arguments the addon provided.

### Data

These blocks let you see the current state of the addon system.

```scratch
(all addon IDs :: #6A5ACD)
```
Reports a JSON array of the IDs of all currently registered addons.

---

```scratch
(all exposed functions :: #6A5ACD)
```
Reports a JSON array of objects describing all currently exposed functions, including their name and required input count.

---

```scratch
(all exposed variables :: #6A5ACD)
```
Reports a JSON array of objects describing all currently exposed variables, including the name used in JavaScript (`jsName`) and the original PenguinMod variable name (`scratchName`).

---
## Writing an Addon

Addons are simple JavaScript files that run in a secure sandbox. They cannot affect your project unless you give them permission using the "expose" blocks. The only way for an addon to communicate with your project is through the special `AddonAPI` object that is provided to it.

Here is a basic template for an addon's code. The addon developer writes this entire snippet, including the `(function(AddonAPI){...})(AddonAPI);` wrapper.

```javascript
(function(AddonAPI) {
  'use strict';
  
  // Addon logic goes here.
  
  // Call a function you exposed from PenguinMod
  if (AddonAPI.log) {
    AddonAPI.log('My addon has started!');
  }
  
})(AddonAPI);
```

### The `AddonAPI` Object

This is the bridge between your addon and the PenguinMod project.

*   **Calling Exposed Functions**: `AddonAPI.yourFunctionName(arg1, arg2);`
    This will trigger the `when addon calls function...` hat in your project.

*   **Accessing Exposed Variables**: `let current = AddonAPI.yourVariableName;` `AddonAPI.yourVariableName = 100;`
    This is a live, two-way link. Reading the property gets the variable's current value from PenguinMod, and setting it updates the variable in PenguinMod.

*   **Listening for Broadcasts**: `AddonAPI.onBroadcast('broadcast-name', (data) => { ... });`
    This sets up a listener. When your project runs the `broadcast` block with the matching name, the code inside the `{...}` will run. The `data` from the broadcast block is passed as an argument.

*   **Handling Callbacks**: `AddonAPI.onCallback('callback-name', (data) => { ... return someValue; });`
    This defines a handler for a callback request. When your project runs the `run callback` block, this code will execute. The `data` is passed in, and whatever value you `return` will be sent back to the reporter block in PenguinMod.

---
## How It Works

The security and functionality of the Addons extension are built on modern web technologies.

*   **`iframe` Sandbox**: Every addon runs in its own invisible `<iframe>`. The browser treats this `iframe` as a separate, isolated world. Due to the **Same-Origin Policy**, code inside the `iframe` is fundamentally blocked from accessing or interfering with the main PenguinMod page.

*   **`postMessage` Bridge**: The only way for the addon to communicate is by sending messages (`postMessage`) to the main page. The Addons extension acts as a secure gatekeeper, listening for these messages and only performing actions that you have explicitly allowed via the "expose" blocks. This ensures that addons can only do what you permit them to.

---
## Example

Here is how to set up a simple project where an addon manages a game's score.

#### 1. The PenguinMod Setup

First, create a variable named `score`. Then, create this script.

```scratch
when green flag clicked
expose var [score v] to addons as [score] :: #6A5ACD
expose function named [log] with [1] inputs :: #6A5ACD
register addon [game-logic] with JS code [...] :: #6A5ACD
start addon [game-logic v] :: #6A5ACD
```

#### 2. The PenguinMod Listener

This script will listen for any `log` calls from our addon.

```scratch
when addon calls function [log v] with inputs (last function call inputs :: #6A5ACD) :: #6A5ACD :: hat
say (last function call inputs :: #6A5ACD) for (2) secs :: #9966ff
```

#### 3. The JavaScript Code

This addon code sets an interval loop where it keeps increasing the value of a variable defined in PenguinMod by 1.

```javascript
(function(AddonAPI) {
  'use strict';
  AddonAPI.log('Game Logic addon started.');
  if (AddonAPI.hasOwnProperty('score')) {
    setInterval(() => {
      AddonAPI.score = AddonAPI.score + 1;
    }, 1000);
  }
})(AddonAPI);
```

When you run this project, the `score` variable will begin counting up every second, controlled entirely by the sandboxed JavaScript addon.

It is reccomended to use the "More Fields" extension along with this, as it adds multiline inputs, making it easier to add addon code.