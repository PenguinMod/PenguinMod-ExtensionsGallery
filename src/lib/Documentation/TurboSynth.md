# TurboSynth
TurboSynth lets you play instruments and percussions.

## Notes
"new synthesizer with patches" block takes URI that points to ZIP file which contains GUS .pat files and .cfg file. These files can be generated from .sf2 file using [unsf](https://github.com/psi29a/unsf).

TurboSynth uses MIDI bank/program/percussion numbers, see [this PDF](https://sinclairdesign.com/application/files/2615/3528/3835/gm2_sound_list.pdf) for bank/program numbers (This PDF says "patch" but that is another word for "program"). For percussion numbers, see [this website](https://www.cs.cmu.edu/~music/cmp/archives/cmsip/readings/GMSpecs_PercMap.htm) (For what this website says, use bank 0. There are more banks for GM2 standard but author could not find one.)

Also note that "default patches" contains most of the GM2 instruments, but not all of them.

Channel is just a number for grouping notes/percussion sounds, change as you need. (Website for percussion numbers above this sentence says "MIDI Channel 10 is for percussion" but this does not apply to TurboSynth.)
