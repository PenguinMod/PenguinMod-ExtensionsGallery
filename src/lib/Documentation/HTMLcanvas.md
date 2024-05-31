# HTML Canvas

HTML Canvas is an extension that allows you to use HTML and CSS to make stylistically pleasing and interactive projects. <br>
_You can also use it to make some of the worst looking projects in existance._

> To use this extension, you ***will*** need at least some knowlage of how html works

---

## Making your first element
When you want to make an element, you use the `Make element` block, and then set its content with the `Set content` block.
This is self explanitory until you start using the more complex elements.

```scratch
when gf clicked
Make element [div v] with id [element1] :: #6164ff
Set content of [#element1] to [Hello, world!] :: #6164ff
```

---

## Slightly more complex
Some elements are more interesting, like &#060;iframe> elements.
Iframe elements will work like normal elements with setcontent, but they have the added bonus of supporting urls. 

```scratch
when gf clicked
Make element [iframe v] with id [element1] :: #6164ff
Set content of [#element1] to [https://example.com/] :: #6164ff
```

The &#060;iframe> element will allow you to add other websites inside of it. 
This means that you can use it to show resources, include a single file across several pages, or sandbox for user made html content.

---

### Making an image
Much like iframes, &#060;img> elements also allow you to contains content, but they only take images. 
Whenever you set the content of this element, it will be taken in as a link.

```scratch
when gf clicked
Make element [img v] with id [element1] :: #6164ff
Set content of [#element1] to [https://extensions.penguinmod.com/navicon.png] :: #6164ff
```

---

## Elements that need some help
Some elements don't work by themselves. For these elements, you need to create another inside of it. 
One example of this is the &#060;audio> element.
When using audio elements _(or video elements)_, you will need to include a &#060;source> element inside of it. 
You can do this with the `Set parent` block.

```scratch
when gf clicked
Make element [audio v] with id [sound1] :: #6164ff
Make element [source v] with id [sound1] :: #6164ff
Set content of [#source1] to [https://pm-bapi.vercel.app/buauauau.mp3] :: #6164ff
Parent [#source1] to [#sound1] :: #6164ff
```

---

### Setting up a link
Another element that needs special treatment is the &#060;a> element. This element is used to create links to other websites. 
When you use it, it will work like the &#060;div> element, and can contain most anything, but where it differs is with the inclusion of a src.
A src is the source for elements that need more than just some inside content.
To set it, you will need to use the `Set property` block.

```scratch
when gf clicked
Make element [img v] with id [element1] :: #6164ff
Set content of [#element1] to [Click me to go to example.com] :: #6164ff
Set property [src] of [#element1] to [https://example.com/] :: #6164ff
```

---

## Working with styles
This extension allows you to modify the styling of any element with just 3 simple blocks.

Starting with the `Set style` block

```scratch
when gf clicked
Make element [p v] with id [element1] :: #6164ff
Set content of [#element1] to [Hello, world!] :: #6164ff
Set [backgroundColor] of [#element1] to [yellow] :: #6164ff
forever
  Set [backgroundColor] of [#element1] to [yellow] :: #6164ff
  wait (1) seconds
  Set [backgroundColor] of [#element1] to [orange] :: #6164ff
  wait (1) seconds
end
```

---

### Making global css
You can also add css files to the page with the `Add css` block.

```scratch
when gf clicked
Add css [body { background-color: yellow; }] with id [style1] :: #6164ff
Add css [https://example.com/style.css] with id [style2] :: #6164ff
```

---

### Animating elements
Changing the styles of elements is usually instant, but you can change that, and add animatons by using the `Set transition` block.

```scratch
when gf clicked
Make element [p v] with id [element1] :: #6164ff
Set content of [#element1] to [Hello, world!] :: #6164ff
Set [backgroundColor] of [#element1] to [red] :: #6164ff
Set transition of [backgroundColor v] on [#element1] to [1s ease-in-out] :: #6164ff
forever
  Set [backgroundColor] of [#element1] to [yellow] :: #6164ff
  wait (1) seconds
  Set [backgroundColor] of [#element1] to [orange] :: #6164ff
  wait (1) seconds
end
```

---

## Adding interactions
Once you have created and styled your elements, you might notice that you can't click on the elements you create.
To change this, you can simply use the `Set interaction` block.

> Please note that this will disable interactions with the scratch stage while enabled

```scratch
when gf clicked
Set interaction with HTML to [true v] :: #6164ff
```

You can also use the following blocks for more complex actions.

```scratch
([#element1] clicked :: #6164ff)
(Button [#element1] active :: #6164ff)
(Hovering [#element1] :: #6164ff) // Hover is not supported on mobile
```

---

Now that you can interact with the html, you have the ability to use the `When element clicked` block.

```scratch
When element [#element1] clicked :: #6164ff hat
Set [backgroundColor] of [#element1] to [yellow] :: #6164ff
```

---

### Working with scripts
Scripts are a touchy addition, as they allow for some not so nice things to be done.
This is why the first attempt to use scripts prompts the user about the action.
Although once agreed to once, all future scripts will not ask.

Scripts come in two parts: reporter scripts, and void scripts.

### Void scripts
Void scripts simply run a function, without returning anything.
Any data returned with the`Add script` block will just be sent into the void _(ignored)_.
Void scripts also take an id, as they are added to the page like an element.

```scratch
Add script [alert("Hello, World!");] with id [script1] :: #6164ff
```

### Reporter scripts
Reporter scripts are similar to void scripts, but they don't actually add any elements, and they return a value.

```scratch
(Run script [window.prompt("How are you today?"\);] :: #6164ff)
```

---

## Debugging your html
The HTML Canvas extension comes with a button in th block pallet that simply outlines every element on the page.
The page root and body are red, while everything else is highlighted in blue.
This makes debugging hitboxes and sizes much easier.

![](data:image/png;base64,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)

<br>

<p style="color: #7a7a7a;">For more info about html tags, check <a href="https://www.w3schools.com/tags/" target="_blank">W3Schools</a></p>
