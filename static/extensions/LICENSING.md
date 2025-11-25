# Licensing
PenguinMod extension code in this folder is under one of two licenses:
- [MIT](https://opensource.org/license/mit)
- [LGPL-3.0](https://www.gnu.org/licenses/lgpl-3.0.en.html)

For an extension to use a specific license, it should specify the [SPDX short identifier](https://spdx.org/licenses/) (seen above) in a comment at or near the top of the file.

Licensing examples:
```js
// By: PenguinMod <https://github.com/PenguinMod>
// License: LGPL-3.0
(function (Scratch) {
    // ...
```
```js
/**!
 * @file My Very Cool Extension
 * @author PenguinMod
 * @link https://github.com/PenguinMod
 * @copyright Licensed under LGPL-3.0
 */
(function (Scratch) {
    // ...
```

If an extension does not specify a license, it is assummed to be released under the MIT license with the copyright holders being the
people credited to said extension.

## Dual-licensing
An extension may also specify that you can use one license *or* the other, being "dual-licensing." In this case, you may choose the one that fits for you.

## Mixed licensing
Extensions currently **cannot** specify to use one license *and* another.
The only **exception** is extensions that specify a mix of MIT *and* LGPL-3.0.

This is not recommended for use, as the LGPL-3.0 license essentially overrides the MIT license. See [this thread for more information](https://github.com/PenguinMod/PenguinMod-ExtensionsGallery/pull/419#issuecomment-3565666951).

If you modify these extensions, you need to include both the MIT and LGPL-3.0 license texts. Avoid submitting extensions that use mixed licensing.