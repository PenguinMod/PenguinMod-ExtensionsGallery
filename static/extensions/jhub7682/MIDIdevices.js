// Name: Midi Devices
// ID: jhub7682MidiDevices
// Description: An extension that exposes MIDI devices
// By: Jhub7682
// License: MIT AND LGPL-3.0
// Version: V.1

class MidiDevicesExtension {
  constructor() {
    this.lastNote = 0;
    this.lastVelocity = 0;
    this.pressedNotes = new Set();
    this.pitchBendValue = 0;
    this.controlValues = new Map();
    this.programNumber = 0;
    this.aftertouchValue = 0;
    this.polyAftertouchValues = new Map();
    this.midiDeviceName = "None";


    this.initializeMIDI();
  }

  initializeMIDI() {
    navigator.requestMIDIAccess()
      .then((midiAccess) => {
        for (let input of midiAccess.inputs.values()) {
          this.midiDeviceName = input.name;

          input.onmidimessage = (msg) => {
            const [status, data1, data2] = msg.data;
            const command = status & 0xF0;

            switch (command) {
              case 0x90:
                if (data2 > 0) {
                  this.lastNote = data1;
                  this.lastVelocity = data2;
                  this.pressedNotes.add(data1);
                } else {
                  this.pressedNotes.delete(data1);
                }
                break;

              case 0x80:
                this.pressedNotes.delete(data1);
                break;

              case 0xB0:
                this.controlValues.set(data1, data2);
                break;

              case 0xC0:
                this.programNumber = data1;
                break;

              case 0xD0:
                this.aftertouchValue = data1;
                break;

              case 0xE0:
                this.pitchBendValue = ((data2 << 7) | data1) - 8192;
                break;

              case 0xA0:
                this.polyAftertouchValues.set(data1, data2);
                break;
            }
          };
        }
      })
      .catch((err) => {
        console.error("MIDI access error:", err);
      });
  }

  getInfo() {
    return {
      id: "jhub7682MidiDevices",
      name: "Midi Devices",
      color1: "#ff2c2cff",
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
  }

  midiNoteOn() {
    return this.lastNote;
  }

  midiVelocity() {
    return this.lastVelocity;
  }

  anyNotePressed() {
    return this.pressedNotes.size > 0;
  }

  getCCValue(args) {
    return this.controlValues.get(Number(args.CCNUM)) || 0;
  }

  getPitchBend() {
    return this.pitchBendValue;
  }

  getProgramNumber() {
    return this.programNumber;
  }

  getAftertouch() {
    return this.aftertouchValue;
  }

  getPolyAftertouch(args) {
    return this.polyAftertouchValues.get(Number(args.NOTE)) || 0;
  }

  getDeviceName() {
    return this.midiDeviceName;
  }

  midiOctave() {
    return Math.floor(this.lastNote / 12) - 1;
  }
}


Scratch.extensions.register(new MidiDevicesExtension());
