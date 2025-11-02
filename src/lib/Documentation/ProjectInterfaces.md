# Project Interfaces

---

Project Interfaces is an extension to easily create GUI's inside your projects.
This documentation will teach you the basics of how to use it.

---

## Getting started
An "element" refers to an image, button, video, etc on the screen.
This extension uses an ID system to keep track of GUI elements for later customization.

To create an element, use the "create element block".
```scratch
    Create [Label v] element with ID [My element] :: #707eff
```
It's important to note that most elements (Like images) wont show up right away. They require more customization, like having the source url set to them.

It's good practice to name your id's such that it gives you a clue of what it's purpose is.
Example: profile-image, button-1, button-2, ..

## Styling and Customization
There are several element types to pick from, each with different attributes and ways to customize them.

Blocks under the "Styling" section of the extension can modify any element.
```scratch
    Set position of ID [My element] to x: [50] y: [100] :: #707eff
```
Each element type also has its own section on the extension, with blocks that can customize that element specifically.

Lets take an input element for example, under the "Inputs" section of the extension you'll find blocks that can customize its input type, placeholder, accent color, value, get the value of the input, and detect when the input is changed.

```scratch
    when gf clicked
    Create [Input v] element with ID [My input] :: #707eff
    Set placeholder of ID [My input] to [What's your name?] :: #707eff

    When input with ID [My input] changed :: hat :: #707eff
    Say (join [Hello ](Value of input with ID [My input] :: #707eff))
```

## Advanced
It's important to note that Project Interfaces uses [HTML elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements) to create GUI's in projects.

This extension has several blocks to further customize elements for those who have a deeper understanding of HTML and CSS.

The "Create html element" block will allow you to create an element based of a HTML tag of your choice.
The "Set custom CSS" block will override an elements CSS properties.

```scratch
Create html element [h1] with ID [HTML header] :: #707eff
Set custom CSS of [HTML header] to [background-color: red] :: #707eff
```

## Security
For security reasons, only Label elements (Or span tags) can have text set for them.
This prevents script execution from &lt;script&gt;&lt;/script&gt; tags.
If you wish to execute JavaScript inside your project, please use the JavaScript V2 extension.