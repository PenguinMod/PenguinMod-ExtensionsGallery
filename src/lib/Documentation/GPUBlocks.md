# GPUBlocks
Write GPU code using scratch blocks, and run it inside of scratch.
### Writing Scripts
GPU code works a little differently than normal scratch code, and it can error (many errors are my fault though so you can report them to [@PolyPenguin](https://scratch.mit.edu/users/PolyPenguin/) on scratch or polypenguindev@gmail.com)
First, you need to set up your script. You can simply do this:
```scratch
📜 GPU script with name: [<SCRIPT NAME>]::hat extension
GPU code {
}::cap extension
```
then you can write your script, make sure all the blocks your using in your script has the green gpu icon.
if else statements work slightly differently
instead of
```scratch
if <> then{
}else{
}::control
```
you have to do 
```scratch
🟩 if <> then{
}::control
🟩 else if <> then{
}::control //GPUBlocks also supports else if!
🟩 else{
}::control
```
Else and Else If can only be placed after If or Else If
Your script will run on every item in a list, to get that item you can use
```scratch
(🟩 value::extension)
```
and to get the index of the value you can do
```scratch
(🟩 index::extension)
```
The output of your script will be a list, to return a value use
```scratch
🟩 return[]::extension
```
variables also work differently than scratch, to create a varible, you have to do
```scratch
🟩 new variable[<VAR NAME>]with value[<VALUE>]::variables
```
to set it do
```scratch
🟩 set variable[<VAR NAME>]to value[<VALUE>]::variables
```
and to get it do
```
```scratch
(🟩 get variable[<VAR NAME>]::variables)
```
when your done, your script might look something like this
```scratch
📜 GPU script with name: [<SCRIPT NAME>]::hat extension
GPU code {
🟩new variable[i]with value[0]::variables
🟩 repeat (🟩index::extension) {
🟩change variable [i] by [1]::variables
}::control loop
🟩return(🟩get variable[i]::variables)::extension
}::cap extension
```
### Running Scripts
to run a script, you have to compile it, and then you can initialize the GPU inside an if statement, and then you can finally run your script either an amount of instances, or from a list.
