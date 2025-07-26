// Name: Midi Devices
// ID: mididevicesjhub7682
// Description: An extention that exposes MIDI devices
// By: Jhub7682
// License: MIT AND LGPL-3.0

// Version V.1

let lastNote = 0;
let lastVelocity = 0;
let pressedNotes = new Set();
let pitchBendValue = 0;
let controlValues = new Map();
let programNumber = 0;
let aftertouchValue = 0;
let polyAftertouchValues = new Map();
let midiDeviceName = "None";

navigator.requestMIDIAccess()
  .then((midiAccess) => {
    for (let input of midiAccess.inputs.values()) {
      midiDeviceName = input.name;

      input.onmidimessage = (msg) => {
        const [status, data1, data2] = msg.data;
        const command = status & 0xF0;

        switch (command) {
          case 0x90: // Note On
            if (data2 > 0) {
              lastNote = data1;
              lastVelocity = data2;
              pressedNotes.add(data1);
            } else {
              pressedNotes.delete(data1); // Note Off via velocity 0
            }
            break;

          case 0x80: // Note Off
            pressedNotes.delete(data1);
            break;

          case 0xB0: // Control Change
            controlValues.set(data1, data2);
            break;

          case 0xC0: // Program Change
            programNumber = data1;
            break;

          case 0xD0: // Channel Pressure (Aftertouch)
            aftertouchValue = data1;
            break;

          case 0xE0: // Pitch Bend
            pitchBendValue = ((data2 << 7) | data1) - 8192;
            break;

          case 0xA0: // Polyphonic Aftertouch
            polyAftertouchValues.set(data1, data2);
            break;
        }
      };
    }

    Scratch.extensions.register({
      getInfo() {
        return {
          id: "MDjhub7682",
          name: "Midi Devices",
          color1: "#ff6363ff",
          blocks: [
            {
              opcode: "midiNoteOn",
              blockType: "reporter",
              text: "last MIDI note"
            },
            {
              opcode: "midiVelocity",
              blockType: "reporter",
              text: "last velocity"
            },
            {
              opcode: "anyNotePressed",
              blockType: "reporter",
              text: "MIDI note pressed?"
            },
            {
              opcode: "getCCValue",
              blockType: "reporter",
              text: "CC [CCNUM] value",
              arguments: {
                CCNUM: {
                  type: "number",
                  defaultValue: 1
                }
              }
            },
            {
              opcode: "getPitchBend",
              blockType: "reporter",
              text: "pitch bend value"
            },
            {
              opcode: "getProgramNumber",
              blockType: "reporter",
              text: "program number"
            },
            {
              opcode: "getAftertouch",
              blockType: "reporter",
              text: "aftertouch value"
            },
            {
              opcode: "getPolyAftertouch",
              blockType: "reporter",
              text: "poly aftertouch for note [NOTE]",
              arguments: {
                NOTE: {
                  type: "number",
                  defaultValue: 60
                }
              }
            },
            {
              opcode: "getDeviceName",
              blockType: "reporter",
              text: "MIDI device name"
            },
            {
              opcode: "midiOctave",
              blockType: "reporter",
              text: "last MIDI octave"
            }
          ]
        };
      },

      midiNoteOn() {
        return lastNote;
      },

      midiVelocity() {
        return lastVelocity;
      },

      anyNotePressed() {
        return pressedNotes.size > 0;
      },

      getCCValue(args) {
        return controlValues.get(Number(args.CCNUM)) || 0;
      },

      getPitchBend() {
        return pitchBendValue;
      },

      getProgramNumber() {
        return programNumber;
      },

      getAftertouch() {
        return aftertouchValue;
      },

      getPolyAftertouch(args) {
        return polyAftertouchValues.get(Number(args.NOTE)) || 0;
      },

      getDeviceName() {
        return midiDeviceName;
      },

      midiOctave() {
        return Math.floor(lastNote / 12) - 1;
      }
    });
  })
  .catch((err) => {
    console.error("MIDI access error:", err);
  });
