# Resolution

**Resolution** provides utility blocks that simplify the creation of projects with **dynamic resolution** support.

## Other Extensions

It's recommended to pair **Resolution** with an extension that allows dynamic project size changes at runtime, such as **Runtime Modifications**.

```scratch
set stage width\: [480] height\: [360]:: #777777
```

## Setup

> NOTE
> The stage might not match your exact screen resolution or the expected resolution in the editor. This happens because it's based on the browser window’s inner size. When packaged, the project will scale correctly.

A typical setup looks like this:

```scratch
when gf clicked
set stage width\: (suggested stage width::#009dff) height\: (suggested stage height::#009dff):: #777777
when window resized:: hat #009dff
set stage width\: (suggested stage width::#009dff) height\: (suggested stage height::#009dff):: #777777
```

Since `when window resized` does not trigger on project load or when the green flag is clicked, you need to handle resizing in both places. It's recommended to move all resize-dependent code into a custom block and call it from both events.

## Anchors

> CAUTION
> Sprites may get stuck to the stage's edge during resizing unless **Remove Fencing** is enabled.

Sometimes you’ll want sprites (e.g., UI elements) to remain attached to specific stage positions—like the bottom-right corner—regardless of resolution.

Use the anchor blocks provided:

```scratch
(x of a stage with width [640]'s (bottom right corner v):: #009dff)
(y of a stage with width [360]'s (bottom right corner v):: #009dff)
(x of stage anchor at [50]% to the right of a stage with width [640]:: #009dff)
(y of stage anchor at [50]% to the bottom of a stage with height [360]:: #009dff)
```

Example usage:

```scratch
when window resized:: hat #009dff
set x to (x of a stage with width (suggested stage width:: #009dff)'s (bottom right corner v):: #009dff)
set y to (y of a stage with height (suggested stage height:: #009dff)'s (bottom right corner v):: #009dff)
```

## Packaging

When packaging your project:
- **Keep** "Preserve aspect ratio when resized (recommended)" enabled.
- **Enable** "Remove Fencing" to prevent sprite edge collisions during resizing.
- **Set (optional)** "Framerate" to 0 to allow the packager to use the user's maximum refresh rate, making resizing smoother. Only do this if your project can reliably handle high frame rates.

You’re free to modify other settings as needed.