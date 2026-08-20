# Run Python
Python Block coding has come!
Mirror python in PenguinMod!

## Blocks

This extension helps you create python scripts. 
Your Python script begins with this block
```scratch
when python code starts ::#4584b6 hat
```




```scratch
a yellow python block ::#ffdd55
```
Yellow blocks work anywhere in your project
```scratch
a blue python block ::#4584b6
```
Blue block sonly work while they are under the when python code starts event hat, unless you turn strict editing off. They are not meant to be used outside of Python scripts.

### Run Python

```scratch
when python code starts ::#4584b6 hat
```

When python code starts begins the python script. It is ideal to have only one of these in your project at a time.


```scratch
run python code ::#ffdd55
```
This will start your python script

---

### Strict Editing

**About strict editing** 

Strict editing makes the blue python blocks only work when they are under the When Python Code Starts hat block. This is similar to how the editor works in Edublocks. If you have it off, it will allow python blocks to be used outside of python scripts (not recommended). However, it can be turned off for certain debugging purposes, but by default it is on to mirror coding in Python as much as possible. Feel free to turn it off if it annoys you.


---


```scratch
set strict editing to [on v] ::#ffdd55
```
This will turn strict editing on or off.


---

```scratch
<is strict editing on? ::#ffdd55>
```
Self-explanitory

---

### Display Output

```scratch
show python output ::#ffdd55
```
This is like your terminal when you are coding in python. It displays printed text and inputs. It covers the canvas. 

**_Recommened:_** Use this block right before showing the python output.

---

```scratch
hide python output ::#ffdd55
```
Self-explanitory.

**_Note:_**The input blocks will not work if the python output is hidden

---

```scratch
clear python output ::#ffdd55
```
Clears the output. When the python script is restarted, the output is not automatically cleared. Use this to clear it.

---

```scratch
(python output ::#ffdd55)
```
Get the python output that you see on the canvas.

---

### Print


```scratch
print [Python is fun!] ::#4584b6
```
The simplest of the python statements. Prints the text on the output.

---

### Inputs

```scratch
input [is Python fun? ] ::#4584b6
```
Prints the prompt on the output and awaits an answer. The answer is submitted when the enter key is pressed. 
**_IMPORTANT:_** This will NOT work if the Python output is not showing.
**_Note:_** This does not work on mobile devices as it will not prompt the touch keyboard. 
**_Note:_** Do NOT click anything else during the prompt until you finish or your python code will stall.

---

```scratch
(entered answer ::#4584b6)
```
Returns the entered answer to be used in the code.

---


### Variables

```scratch
create a variable named [var2] ::#ffdd55
```
Create a variable to use in your code. Click the block to create the variable. Then, you need to put this block under the when python code starts hat and above any other blue blocks in the script.

**Example**
```scratch
when python code starts ::#4584b6 hat
create a variable named [coolvar] :: #ffdd55
((coolvar v) ::#33546f) = (26) :: #4584b6 stack
print (get ((coolvar v) ::#33546f) :: #4584b6) :: #4584b6
```

---

```scratch
delete variable ((var v) ::#6ba4d3) :: #ffdd55
```
Deletes the variable (never use this in your python scripts.)

---


```scratch
get variable ((var v) ::#33546f) :: #4584b6 reporter
```
Gets the value of the selected variable

In Python:
```py
variable
```

---

```scratch
((var v) ::#33546f) = [0] :: #4584b6 stack
```
Sets the variable to a value

In Python: 
```py
variable = 0
```
---


### Lists


```scratch
create a list named [list2] ::#ffdd55
```
Create a list to use in your code. Click the block to create the list. Then, you need to put this block under the when python code starts hat and above any other blue blocks in the script.

**Example**
```scratch
when python code starts ::#4584b6 hat
create a variable named [cool list] :: #ffdd55
((cool list v) ::#33546f) = () :: #4584b6 stack
print (get ((cool list v) ::#33546f) :: #4584b6) :: #4584b6
```

---

```scratch
delete list ((list v) ::#6ba4d3) :: #ffdd55
```
Deletes the list (never use this in your python scripts.)

---


```scratch
get list ((list v) ::#33546f) :: #4584b6 reporter
```
Gets the value of the selected list

In Python:
```py
lst
```

---

```scratch
((list v) ::#33546f) = \[ [item] @addInput \] :: #4584b6 stack
```
Sets the list to an array. The block is expandable if you want to add more items

In Python: 
```py
lst = ["item","item2"]
```

---


```scratch
((list v) ::#33546f) = [["Python", "3.14"]] :: #4584b6 stack
```
This is the same as the previous block except it is not expandable and the input is a full list

In Python: 
```py
lst = ["Python","3.14"]
```

---



```scratch
((list v) ::#33546f) .reverse\(\) :: #4584b6 stack
```
This will reverse the list and save the new list.

In python: 
```py
lst.reverse()
```


---


```scratch
((list v) ::#33546f) . [append v] [item2] :: #4584b6 stack
```
Based on the dropdown...
* append: Appends (adds) the value to the end of the list 
* remove: Removes the value from the list


In python:
```py
lst.append("item2")
```


---



```scratch
((list v) ::#33546f) . extend [["item4","item5"\]] :: #4584b6 stack
```
Marges the list with the input list

In Python:
```py
lst.extend(["item4","item5"])
```


---


```scratch
((list v) ::#33546f) . insert [item3], [0] :: #4584b6 stack
```
Inserts the item to the specified index 

**_Note:_** Python is zero-indexed, meaning the first item of a list is cosidered at position 0, the second item is considered at position 1, and so on.

If this block was used, "item3" would be inserted as the first item in the list.

In python: 
```py
lst.insert("item3", 0)
```


---



```scratch
((list v) ::#33546f) . pop [item] :: #4584b6 reporter
```
If the list contains the value, it will return the value then remove it from the list

In python:
```py
lst.pop("item")
```


---


```scratch
((list v) ::#33546f) \( [0] \) :: #4584b6 reporter
```
Returns the item at the specified index

**_Remember_:_** Python is zero-indexed, meaning the first item of a list is cosidered at position 0, the second item is considered at position 1, and so on.

In python:
```py
lst[0]
```

---


```scratch
((list v) ::#33546f) .index [item]:: #4584b6 reporter
```
Returns the index of the specified item in the list, if it is not found it will return -1


---


### Controls


```scratch
if <> : {
} :: #4584b6 loop
```
Runs the inside code if the boolean is true

In python: 
```py
if bool :
    #runs if true
```


---


```scratch
elif <> : {
} :: #4584b6 loop
```
Runs the inside code if the boolean is true and the above if statement is false. You can add many elifs after an if

In python: 
```py
if bool :
    #it was false
elif bool :
    #runs if true
```


---


```scratch
else : {
} :: #4584b6 loop
```
The last condition. If the if statement and all elifs are false, this code runs.

In python: 
```py
if bool :
    #this was false
elif bool :
    #this was also false
elif bool :
    #this was false too?!?!?!
else bool :
    #this runs
```

**Example**

```scratch
if <[21] [== v] [36] :: #4584b6>  : {
print [21 is 36] :: #4584b6
} :: #4584b6 loop
elif <[48] [== v] [36] :: #4584b6>  : {
print [48 is 36] :: #4584b6
} :: #4584b6 loop
else :{
print [i guess 48 and 21 are not 36] :: #4584b6
} :: #4584b6 loop
```
This will print
``` 
"i guess 48 and 21 are not 36"
```

---

```scratch
while <>  : {

} :: #4584b6 loop
```
Runs the inside code while the boolean is true

In python:
```py
while bool :
    #runs while true
``` 

---

```scratch
for ((var v) ::#33546f) in [["item1","item2","item3"\]] : {

} :: #4584b6 loop
```
Loops through all items in the list, and the var will be the item on which the loop is in

In python:
```py
for var in lst:
    #see the example for a better explnation
```

**Example**

```scratch
for ((var v) ::#33546f) in [["item1","item2","item3"\]] : {
print (get variable ((var v) ::#33546f) :: #4584b6)  :: #4584b6
} :: #4584b6 loop
```
This will print
```
item1
item2
item3
```

---

```scratch
range [5] :: #4584b6 reporter
```
Creates an array of positive integers from 0 to the specified length.  
Useful in for loops.
**_Remember:_** Python is zero-indexed, so range (5) would end at 4

In python:
```py
range(5)
```

---

```scratch
range [2] , [7] :: #4584b6 reporter
```
Creates an array of integers counting up from the first number to the specified length.  
Useful in for loops.
**_Remember:_** Python is zero-indexed, so range (2,7) would end at 6

In python:
```py
range(2,7)
```

---



### Functions

```scratch
def [my_func] \( [hello, goodbye] \) : {
} :: #4584b6 loop
```
Defines a function with parameters. If your functions don't use parameters, leave the second input blank

In python:
```py
def my_func (hello, goodbye) :
    #stuff the function does... 
```
**_Remember:_** You can only use a function after it is defined in the python script.
**_Helpful Hint:_** For advanced users, use * before the last parameter name to use *args. **kwargs is not supported yet.

---

```scratch
return [1] :: #4584b6 cap
```
return a value at the end of a function

In python:
```py
return 1
```

---


```scratch
[my_func] \( [one,two] \) :: #4584b6
```
call a function. If your funciton has parameters, pass the arguements in the same order that you defined them in the function. 

In python:
```py
my_func("one","two")
```

**Example**

```scratch
def [my_func] \( [hello, goodbye] \) : {
print (parameter [hello] :: #4584b6) :: #4584b6
} :: #4584b6 loop
[my_func] \( [one,two] \) :: #4584b6
```

When the function is called, 
* parameter **hello** = "one"
* parameter **goodbye** = "two"

This will print "one" because the hello parameter was first and so is "one" in the list of args

---



```scratch
parameter [hello] :: #4584b6 reporter
```
Access the values of the parameter inside your function when it is called

In python:
```py
def my_func (parameter) :
    parameter # this is a parameter
```

---


```scratch
[my_func] \( [one,two] \) :: #4584b6 reporter
```
Use this to call a function if it returns a value

In python:
```py
my_func("one","two")
```

---


```scratch
[args], @addInput :: #4584b6 reporter
```
an expandable block to list parameters

In python:
```py
def my_func (data, use, issue_date, target): # a lot of parameters!
```

---


### Classes

```scratch
class [My_Class] : {
} :: #4594b6 loop
```
Create a class

In python:
```py
class My_Class:
    # data...
```

---


```scratch
def [class_func] \( self, [hello, goodbye] \) in class : {
} :: #4594b6 loop
```
This is the same as defining a normal function, except it is used in a class. It is able to change properties in a class.

In python:
```py
def class_func (self, hello, goodbye):
    #Do something
```

---


```scratch
self. [class_var] = [0] in class :: #4584b6
```
Define a property in a class. This will define a variable.

In python:
```py
self.class_var = 0
```

---


```scratch
self. [class_list] = \[ [item] @addInput \] in class :: #4584b6
```
Define a property in a class. This will define a list. It is expandable to add items.



In python:
```py
self.class_list = ["item","item2"]
```

---


```scratch
from class [My_class].[class_func] \( [one,two] \) :: #4584b6
```
Run a function from a class. For more details on how to run functions, scroll up to the define my_func block.

In python:
```py
My_class.class_func("one","two")
```

---


```scratch
from class [My_class].[class_func] \( [one,two] \) :: #4584b6 reporter
```
Run a function from a class to return a value. For more details on how to run functions, scroll up to the define my_func block.

In python:
```py
range(2,7)
```

---


```scratch
from class [My_class].[class_var] :: #4584b6 reporter
```
Get a property from a class

In python:
```py
My_class.class_var
```

---


### Strings

```scratch
f [Python] [ 3.14] @addInput :: #4584b6 reporter
```
Make an f-string. Basically an expandable join block.

In python:
```py
f"Python 3.14"
```

---


```scratch
[PyThOn].[upper () v] :: #4584b6 reporter
```
Based on the dropdown
* upper(): Converts to uppercase
* lower(): Converts to lowercase
* title(): Converts to title case


In python:
```py
string.upper()
```

---


```scratch
[Python is fun] .replace [fun], [awesome]:: #4584b6 reporter
```
Replaces the word fun with awesome in "Python is fun"

In python:
```py
string.replace("fun", "awesome")
```

---


```scratch
[   whitespace?    ]. [strip() v]:: #4584b6 reporter
```
Based on the dropdown
* strip(): trims whitespace on both sides
* lstrip(): trims whitespace from the front (left)
* rstrip(): trims whitespace from the back (right)

In python:
```py
string.strip()
```

---


```scratch
[Python is fun] \( [0]\):: #4584b6 reporter
```
Get the letter at the specified index in the string

**_Note:_** Python is zero-indexed, meaning the first item of a list is cosidered at position 0, the second item is considered at position 1, and so on.

In python:
```py
string[0]
```

---


```scratch
[Python is fun]. count [n]:: #4584b6 reporter
```
Count the number of times a character appears in a string

In python:
```py
string.count("n")
```

---


```scratch
[Python is fun]. count [n], [3], [9]:: #4584b6 reporter
```
Count the number of times a character appears in a section of a string

In python:
```py
string.count("n", 3, 9)
```

---


```scratch
[Python is fun] .[find  v] [n]:: #4584b6 reporter
```
Find a character. Based on the dropdown
* find(): search from the left (first occurance)
* rfind(): search from the right (last occurance)
In python:
```py
string.find("n")
```

---


### Math


```scratch
[16] [+ v] [16]:: #4584b6 reporter
```
Add, subtract, multiply, or divide numbers

In python:
```py
16 + 16
```

---


```scratch
math. [sqrt v] \( [16] \):: #4584b6 reporter
```
Run various math functions

In python:
```py
math.sqrt(16)
```

---


```scratch
math. [pi v]:: #4584b6 reporter
```
Get various math constants

In python:
```py
math.pi
```

---


```scratch
math. [pow v] \( [4], [2]\):: #4584b6 reporter
```
Run various math operations

In python:
```py
math.pow(4, 2)
```

---


### Operators

```scratch
[21] [== v] [36]:: #4584b6 boolean
```
Complete various checks between values  
== means is equal to   
!= means not equal to

In python:
```py
21 == 36
```

---


```scratch
<> [and v] <>:: #4584b6 boolean
```
Based on the dropdown
* and: returns true if both conditions are ture
* or: returns true if either condition is ture (or both)

In python:
```py
bool and bool
```

---


```scratch
not <>:: #4584b6 boolean
```
Returns true if the boolean is false

In python:
```py
not bool
```


---

### Time


```scratch
time.sleep [2]:: #4584b6 
```
Waits the number of seconds

In python:
```py
time.sleep(2)
```

---


```scratch
time. [time() v] []:: #4584b6 reporter
```
Return various time calculations

In python:
```py
time.time()
```

---


### Random


```scratch
random.choice [["yes","no"\]] :: #4584b6 reporter
```
Get a randomly selected value from the list

In python:
```py
random.choice(["yes","no"])
```



