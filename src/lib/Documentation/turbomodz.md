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
adds an image as a costume for the chosen sprite in the mod. same for the block below except it uses actual costumes:
``` scratch
add costume (costume 1 v) to sprite:(myself v) in mod:(foobar mod v) :: #e84cff
```

### Add Sound URL () to sprite:() in mod:()
``` scratch
add sound url [https://extensions.turbowarp.org/srpelo.mp3] to sprite:(SPRITE v) in mod:(foobar mod v) :: #e84cff
```
adds a sound using it's URL for the chosen sprite in the mod. same for the block below except it doesn't use URLs:
``` scratch
add sound (sr pelo.mp3 v) to sprite:(myself v) in mod:(foobar mod v) :: #e84cff
```
## Mods & Runtime Values
### Set [] to [] In Mod:[]
```scratch
set [interpolation v] to (enabled v) in mod:(foobar mod v) :: #e84cff
```
### Set FPS limit to [FPS] In Mod:[]
```scratch
set FPS limit to [69] in mod:(foobar mod v):: #e84cff
```
### Set Clone Limit to [infinite] In Mod:[]
```scratch
set [interpolation v] to (enabled v) in mod:(foobar mod v) :: #e84cff
```
### Set Clone Limit to [infinite] In Mod:[]
```scratch
set [interpolation v] to (enabled v) in mod:(foobar mod v) :: #e84cff
```
### set stage size to width:[640] height:[360] in mod:()
```scratch
set stage size to width:[640] height:[420] in mod:(foobar mod v):: #e84cff
```
if you know how to use runtime values, skip this section.
## Loading Mods
### load [MOD] mod in project
``` scratch
load (foobar mod v) mod in project:: #e84cff
```
Loads The Mod in The Project.
#### WARNING
- This May Take a Long Time and Cause Heavy Lag.
- It Can Also Break the Entire Project.
- USE AT YOUR OWN RISK!
### unload all mods in project
``` scratch
is project loading a mod?:: #e84cff boolean

is project modded?:: #e84cff boolean
```
does the opposite of the upper block.
### is project loading a mod? & is project modded?
``` scratch

```
adds checks to if the project is loading a mod and if it's modded

