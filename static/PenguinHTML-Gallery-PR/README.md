# Penguin HTML for PenguinMod

A single-file, no-CDN PenguinMod extension for composing, previewing, and downloading HTML source.

## Included files

- `static/extensions/GID12345609/penguinhtml.js` — extension implementation
- `static/images/GID12345609/PenguinHTML.png` — extension artwork
- `PenguinHTML-icon.png` — standalone icon

## Blocks

- **set HTML source to [HTML]** — replace the document source
- **append [HTML] to HTML source** — append markup
- **reset HTML source to starter page** — restore a sample document
- **open HTML preview in browser** — opens the current source in a new tab using a Blob URL
- **download HTML file named [FILENAME]** — requests a local `.html` download
- **HTML source** — returns the current source
- **Penguin HTML status** — returns the last action status
- **Penguin HTML last error** — returns the last error

## Example

Use `set HTML source to` with:

```html
<!doctype html>
<html>
<head><meta charset="utf-8"><title>My page</title></head>
<body>
  <h1>Hello from PenguinMod!</h1>
  <p>This page was made with Penguin HTML.</p>
</body>
</html>
```

Then run `open HTML preview in browser` or `download HTML file named my-page.html`.

## Important limitations

- This extension edits HTML source and opens a browser preview; it does **not** render arbitrary HTML inside the Scratch stage.
- Browser popup/download restrictions may prevent preview or download. If blocked, allow popups for the editor and retry.
- The Gallery repository may require artwork in a particular format/dimensions and a specific extension registry entry. Verify current repository conventions before opening a pull request. This ZIP is a starter package, not an already-merged Gallery submission.

## Gallery integration

Copy the two `static/` files into a local clone of the PenguinMod Extensions Gallery, then add an entry to `src/lib/extensions.js` following the exact schema used by neighboring entries. Open a pull request against:

https://github.com/PenguinMod/PenguinMod-ExtensionsGallery

Do not claim it is official until the pull request is accepted and merged.
