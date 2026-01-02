(function(Scratch) {
  'use strict';

  class HexDatePlugin {
    getInfo() {
      return {
        id: 'hexDate',
        name: 'Hex Date Converter',
        blocks: [
          {
            opcode: 'dateToHex',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert date [DATE] to hex bytes',
            arguments: {
              DATE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "2024-01-01"
              }
            }
          },
          {
            opcode: 'hexToDate',
            blockType: Scratch.BlockType.REPORTER,
            text: 'convert hex [HEX] to date string',
            arguments: {
              HEX: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0000018CD05D2000"
              }
            }
          }
        ]
      };
    }

    dateToHex(args) {
      const date = new Date(args.DATE);
      const timestamp = date.getTime();
      
      if (isNaN(timestamp)) return "Invalid Date";

      // Create an 8-byte buffer
      const buffer = new ArrayBuffer(8);
      const view = new DataView(buffer);

      // Write as Big-Endian 64-bit integer
      // Note: BigInt is used because JS numbers lose precision above 53 bits
      view.setBigUint64(0, BigInt(timestamp), false);

      // Convert buffer to Hex string
      return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .toUpperCase();
    }

    hexToDate(args) {
      try {
        const hex = args.HEX.replace(/\s/g, '');
        const bytes = new Uint8Array(hex.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
        const view = new DataView(bytes.buffer);
        
        // Read as Big-Endian 64-bit integer
        const timestamp = Number(view.getBigUint64(0, false));
        return new Date(timestamp).toString();
      } catch (e) {
        return "Invalid Hex";
      }
    }
  }

  Scratch.extensions.register(new HexDatePlugin());
})(Scratch);
