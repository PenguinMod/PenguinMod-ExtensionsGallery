# HTML Documents
Create HTML webpages and display them on the stage!

## Blocks

```scratch
create new page named [my-page] :: #e34f26
```

Create a new blank page  
(Clicking this after you have already made a page with that name will clear all content and reset all display settings)

---

```scratch
clear content of  [my-page] :: #e34f26
```

Clear HTML content of the page, but keep display settings

---

```scratch
all pages :: #e34f26 reporter
```

Returns an array of all created pages

---

```scratch
[my-page] html [code v] :: #e34f26 reporter
```

Based on the dropdown:
* **code:** Returns the html code of the page
* **preview:** Returns a visual preview of the page
Both options return the same value, just in different visual forms

---

```scratch
display page [my-page] :: #e34f26
```

Display the page on the stage

---

```scratch
hide page [my-page] :: #e34f26
```

Hide the page

---

```scratch
hide all pages :: #e34f26
```

Hide all pages

---

```scratch
current pages displayed:: #e34f26 reporter
```

Returns an array of all pages currently displayed on the stage

---

```scratch
add [div v] if [new-el] to [my-page] {
}:: #e34f26
```

Add an element to the page. These elements can have children, like ```div``` and ```h1```

---

```scratch
add [input v] if [new-el] to [my-page]:: #e34f26
```

Add a self-closing element to the page. These elements cannot have children, like ```input``` and ```img```

---

```scratch
add [hr v] to [my-page]:: #e34f26
```

Add a self-closing unidentified element to the page. Only ```hr``` and ```br``` elements can be unidentified. iF an element is unidentified it cannot be removed, styled, or accessed alone.

---

```scratch
remove element with id [new-el] from [my-page]:: #e34f26
```

Remove an element from the page. If it has children, they will be removed, too.

---

```scratch
set [class v] of [new-el] to [new-class] in [my-page]:: #e34f26
```

Set an attribute for an element

---

```scratch
change [new-el] in [my-page] to {
}:: #e34f26
```

Change the inner HTML, or content, of an element. Not used for self-closing elements.

---

```scratch
set (color v) for [id v] [new-el] to [red] in [my-page]:: #2965f1
```

Set a CSS property

---

```scratch
get (color v) for [id v] [new-el] in [my-page]:: #2965f1 reporter
```

Get the defined property of an element

---

```scratch
clear styling for [id v] [new-el] in [my-page]:: #2965f1
```

Clear the styling for a certain selector

---

```scratch
clear styling of [my-page]:: #2965f1
```

Clear all styling in the page

---

```scratch
when listener for [new-el] activated in [my-page]:: #e34f26 hat
```

Hat is started when the event listener is triggered

---

```scratch
add event listener [click v] for [new-el]  n [my-page]:: #e34f26
```

Add an event listener for an element. Use this after the element has been added.

---

```scratch
remove event listener from [new-el] in [my-page]:: #e34f26
```

Remove the event listener from the element

---

```scratch
listener of [new-el] in [my-page]:: #e34f26 reporter
```

Returns the current listener attached to the element

---

```scratch
all elements in [my-page]:: #e34f26 reporter
```

Returns an array of all elements in the page

---

```scratch
[inner HTML v] in [my-page]:: #e34f26 reporter
```

Returns a value based on the dropdown:
* **inner HTML:** The html contnt inside of the element
* **text content:** The text content inside of the element
* **children:** An array of all elements inside of the element
* **parent element:** The element's parent
* **tag name:** The element's tag name 
* **value:** The value of the element, if an input
* **checked:** The status of an element, if a checkbox input
* **class list:** The classes of an element
* **offset width:** Thw width of an element when displayed
* **offset height:** Thw height of an element when displayed
* **scroll width:** Thw scroll width of an element when displayed
* **scroll height:** Thw scroll height of an element when displayed
* **disabled:** If the inout is disabled

---

```scratch
move [my-page] to x: [50] y: [50]:: #e34f26
```

Move the page to a different location on the stage

---

```scratch
resize [my-page] to x: [50] y: [50]:: #e34f26
```

Resize the page

---

```scratch
set [my-page] display settings to stage size :: #e34f26
```

Automatically set the display settings to fit the stage size

---

```scratch
[x position v] of [my-page] :: #e34f26 reporter
```

Returns the page display settings. Based on the dropdown:
* **x position:** The x position of the page 
* **y position:** The y position of the page
* **width:** The width of the page
* **height:** The height of the page

---

```scratch
[width v] of the stage:: #e34f26 reporter
```

Get the width or height of the stage in pixels

