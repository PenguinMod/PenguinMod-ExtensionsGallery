# TurboModz Documentation (W.I.P)
in this documentation, you will learn how to use Turbomodz and Create your Own Mods
## Create Your Own Mod
### Create New Mod Called ()
``` scratch
create new mod called [foobar mod] :: #e84cff
```
Creates a New Mod. 

here is the default data for the newly created mod:
```javascript
{
  name: "name", // Name of The Mod
  id: "random id", // ID of The Mod
  sprites: [], // Sprites inside The Mod
  costumes: [], // Costumes Inside The Mod
  sounds: [], // Sounds Inside The Mod
  runtime_values: { //Runtime Values of The Mod
    turbo_mode: false,
    interpolation: false,
    remove_fencing: false,
    remove_misc_limits: false,
    high_quality_pen: false,
    framerate: 30,
    clone_limit: 300,
    stage_size: "480x360"
  }
}
```
### Get Mod Called () as [JSON]
``` scratch
get mod called (foobar mod v) as [JSON v] :: #e84cff reporter
```
Reports the data of the mod in three formats:
  - Raw Object (JSON)
  - Stringified JSON (text)
  - Raw Array
if you don't want to use external extensions to read this data, use these blocks instead:
``` scratch
get (key v) of mod called (foobar mod v) :: #e84cff reporter

get runtime value of (value v) of mod called (foobar mod v):: #e84cff reporter
```
## Project Modding
### Add Sprite \(url\) to Mod:()
``` scratch
add sprite [https://example.com/Sprite1.sprite3] to mod:(foobar mod v) :: #e84cff
```
Adds a Sprite using an Url or Data:URI (Recommended)
### Add Image \[URL\] to Sprite:\[SPRITE\] in Mod:\[MOD\]
``` scratch
add image [URL] to sprite:(myself v) in mod:(foobar mod v) :: #e84cff
```
adds an image as a costume for the chosen sprite in the mod.
