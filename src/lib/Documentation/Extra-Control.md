# Extra Control
This Extensions provides you with numerous new Control Blocks for controlling scripts, sprites, clones, and more!

---
## Hat/Event Control

```scratch
force hat (when I start as clone v) to [restart v] on activate :: control

force hat (when I start as clone v) to [finish v] on activate :: control
```
This Block allows you to control whether Selected Hat/Event Blocks should (if already running) **restart** the script or wait for it to **finish** before running again.

---

```scratch
reset forced hats ::control
```
This Block Resets all modified Hats/Events from the previous Block

---
## Keybinds

```scratch
bind key (up arrow v) to (space v) ::control
```
This Block will Bind the first selected Key to the Second.
In this example, after running the Block, when 'Space' is pressed, **Both** Event Blocks will Run:

```scratch
when [space v] key pressed // Up Arrow is Binded to this Key
when [up arrow v] key pressed // When Space is Pressed, this will Run Too
```

---

```scratch
(binds of (space v) key ::control)
```
This Block Returns an Array of all Keys Binded to the Selected Key

---

```scratch
unbind all keybinds of (space v) ::control
```
This Block Resets the Keybinds of the Selected Key

```scratch
reset keybinds ::control
```
This Block Resets all Keybinds

---
## Basic Control Blocks

```scratch
(loop index ::control)
```
This Block returns the amount of Times it is Looped Through in a Script, For Example:
```scratch
repeat(5) {
add (loop index ::control) to [my list v]
}@loopArrow ::control // The List will have the items: 1, 2, 3, 4, 5

repeat until <key (space v) pressed? > {
set [my variable v] to (loop index ::control)
...
}@loopArrow ::control // The Variable will be Set to the Amount of Times the Loop Repeats Before "space" is Pressed
```

---

```scratch
repeat (10) or until <> {
} ::control
```
This Block will Run the Inner Code "x" amount of Times **OR** until a Condition is **true**

```scratch
repeat for (1) secs or until <> {
} ::control
```
Similarly, this Block will Run the Inner Code for "x" Seconds **OR** until a Condition is **true**

---

```scratch
if <> start loop {
} repeat until <>::control
```
This Block will Run the Inner Code in a Loop if a Condition is **true**
The Loop will stop when a Second Condition is **false**

---

```scratch
run next cycle      @loopArrow  ::control cap
```
This Block will Move to the Next Iteration (top of the loop script) in the Loop it is in.

---

```scratch
break out loop @turnRight  ::control cap
```
This Block will Break Out of the Loop it is in.

---

```scratch
wait until (...:: #EC9C13) changes ::control
```
This Block will wait until the inputted Block changes its Value

---

```scratch
run @greenFlag and continue ::control
```
This Block will Run the **Green Flag** (Restarting the Project) and will continue the Script

---

```scratch
simultaneously run {
} {
} ::control
```
This Block will Run Both Inner Scripts Simultaneously

```scratch
if <> then {
} while running {
} then {
} @loopArrow::control
```
If the condition is true, this Block will Run the **First** Inner Script, while it Runs, the **Second** Inner Script will also Run.
Once both Scripts Finish, the **Third** Inner Script will Run.

---

```scratch
run (forward v) {
} ::control

run (reversed v) {
} ::control

run (forward and reversed v) {
} ::control

run (randomized v) {
} ::control
```
This Block will Run its Inner Script either:
  - **Forward** (First to Last)
  - **Reversed** (Last to First)
  - **Forward and Reversed** (First to Last, then Last to First)
  - **Randomized** (Random Order)

---
## Advanced Control Blocks
```scratch
try{
}catch{
}:: control
```
This Block will Run the Blocks in the "try" Branch. If it encounters any Errors, it will Stop it and Run the "catch" Branch instead.
This Block also has a **intended functionality** of Running the "catch" Branch when an Error is encountered in another **try catch** Block 
**(so long as both are Active)**

---
```scratch
🕒 async {
} ::control
```
This Block will Each Inner Block **Individually** and will wait for Each to **Completely** Finish

---

```scratch
new thread with (data ::control) [123] {
} @loopArrow ::control
```
This Block Run the Inner Script in a **new Thread** without Waiting for it to Finish

The "argument" input acts as Temporary Data (variable for example) that is only accessible to the **new Thread**

---

```scratch
step through blocks while <> {
} ::control
```
This Block Functions Similarly to:
```scratch
if <> then {
} ::control
```
The **key difference** is that once the Condition becomes **false**, the Block will stop Running and move onto the Next

---

```scratch
if <> {
} my ID [my-block1] ::control

else {
} my ID [my-block1] ::control
```
These Blocks are essentially "if else" Blocks but with a Twist...
First, assign these Blocks a **Custom ID**, whatever you want it to be (Fun Fact: Multiple "if" & "else" Blocks can use the Same ID)

Now that the **ID** is setup, lets see how the Block works:

If the Condition is **true**, it will Run the Inner Script inside the "if" Block.
If the Condition is **false**, the "else" Block will Run the Inner Script whenever a **Script Reaches The Block**

Additionally, you are allowed to put these Blocks in different **Scripts**, so long as they use the same **ID** and the **Scripts** are **Active** it will run.

**Important:** These do **NOT** start new Threads.
**Important:** The "else" Block will **NEVER** run until an "if" Block with the same ID is ran.

```scratch
<if with ID [my-block1] true? ::control>
```
Additionally, this block simply reports wether the Condition in the "if/else" Block with the same ID was true/false

---
## Inline Message Blocks

```scratch
on call [message 1] run {
} ::control

call [message 1] to run ::control
call [message 1] to run and wait ::control
```
These Blocks work in the same way as "messages", the **Key Differences** are that these Blocks can be placed **Inside Scripts/By Itself** and there is no **menu**

---
## Thread Functions

```scratch
define thread func [my-function] (data ::control) {
return [value] ::control cap
}::control

run func [my-function] with data [123]::control
(run func [my-function] with data [123]::control)
```
These Blocks work in a similar way as "Custom Blocks", the **Key Difference** is that the "run func" Blocks *only* work in the thread the function is defined in

---
## Sprite and Clone Control Blocks

```scratch
as (Stage v) do {
} and (wait v) :: control
```
This Block Runs the Inner Script in a Selected **Sprite**
You can Choose whether to **wait** or **dont wait** for the Script to **Finish**

---

```scratch
(get (...:: #EC9C13) from (Stage v) :: control)
```
This Block returns the Value of the Inputted Block (**Reporter/Boolean**) from the Selected **Sprite**

---

```scratch
as clones of (myself v) with [private variable] set to [value] {
} :: control
```
This Block Runs the Inner Script in a Selected **Clone** of a **Sprite**.
**Private Variable** Refers to Variables set to "for this sprite only"


---
```scratch
(get (...:: #EC9C13) from clone (1) of (myself v) with [private variable] set to [0] :: control)
```
This Block returns the Value of the Inputted Block (**Reporter/Boolean**) from the Selected **Clone** of a **Sprite**
**Private Variable** Refers to Variables set to "for this sprite only"

---

```scratch
delete this clone and tell main sprite {
} @loopArrow :: control cap
```
This Block will Delete the **Clone** it is Running in and will make the **Main Sprite** to run the Inner Script
