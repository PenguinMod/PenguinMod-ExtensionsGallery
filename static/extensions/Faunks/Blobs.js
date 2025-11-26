/**!
 * @file My Very Cool Extension (It's still true Ion need to change a thing) (I hate saying Ion)
 * @author Faunks
 * @link https://github.com/faunks
 * @copyright Licensed under LGPL-3.0 
 * I used LilyMakesThings's McUtils addon as a base so there's that ig...
 */
 
(function (Scratch) {
  "use strict";

  class faunks_Blobs {
    getInfo() {
      return {
        id: "FaunksBlobs",
        // eslint-disable-next-line extension/should-translate
        name: "Blobs",
        color1: "#41964cff",
        color3: "#53df5aff",
        blocks: [
          {
              opcode: "toBlob",
              blockType: Scratch.BlockType.REPORTER,
              text: "Turn [DATA] to a [TYPE] blob",
              arguments: {
                  DATA: {
                      type: Scratch.ArgumentType.STRING
                  },
                  TYPE: {
                      type: Scratch.ArgumentType.STRING,
                      defaultValue: "text/plain",
                      menu: "types"
                  },
              },
          },
        ]
        ,menus: {
          types: {
            acceptReporters: true,
            items: [
                { text: "text/plain", value: "text/plain" },
                { text: "text/html", value: "text/html" },
                { text: "text/css", value: "text/css" },
                { text: "text/javascript", value: "text/javascript" },
                { text: "text/markdown", value: "text/markdown" },
                { text: "text/csv", value: "text/csv" },
                { text: "text/xml", value: "text/xml" },
                { text: "text/yaml", value: "text/yaml" },
                { text: "text/rtf", value: "text/rtf" },
                { text: "text/calendar", value: "text/calendar" },

                { text: "image/png", value: "image/png" },
                { text: "image/jpeg", value: "image/jpeg" },
                { text: "image/webp", value: "image/webp" },
                { text: "image/gif", value: "image/gif" },
                { text: "image/bmp", value: "image/bmp" },
                { text: "image/svg+xml", value: "image/svg+xml" },
                { text: "image/tiff", value: "image/tiff" },
                { text: "image/x-icon", value: "image/x-icon" },

                { text: "audio/mpeg", value: "audio/mpeg" },
                { text: "audio/wav", value: "audio/wav" },
                { text: "audio/ogg", value: "audio/ogg" },
                { text: "audio/aac", value: "audio/aac" },
                { text: "audio/flac", value: "audio/flac" },
                { text: "audio/webm", value: "audio/webm" },

                { text: "video/mp4", value: "video/mp4" },
                { text: "video/webm", value: "video/webm" },
                { text: "video/ogg", value: "video/ogg" },
                { text: "video/x-msvideo", value: "video/x-msvideo" },
                { text: "video/quicktime", value: "video/quicktime" },
                { text: "video/x-matroska", value: "video/x-matroska" },

                { text: "font/otf", value: "font/otf" },
                { text: "font/ttf", value: "font/ttf" },
                { text: "font/woff", value: "font/woff" },
                { text: "font/woff2", value: "font/woff2" },

                { text: "application/json", value: "application/json" },
                { text: "application/xml", value: "application/xml" },
                { text: "application/pdf", value: "application/pdf" },
                { text: "application/zip", value: "application/zip" },
                { text: "application/gzip", value: "application/gzip" },
                { text: "application/x-tar", value: "application/x-tar" },
                { text: "application/x-bzip2", value: "application/x-bzip2" },
                { text: "application/x-7z-compressed", value: "application/x-7z-compressed" },
                { text: "application/x-rar-compressed", value: "application/x-rar-compressed" },
                { text: "application/octet-stream", value: "application/octet-stream" },
                { text: "application/javascript", value: "application/javascript" },
                { text: "application/x-www-form-urlencoded", value: "application/x-www-form-urlencoded" },
                { text: "application/wasm", value: "application/wasm" },

                { text: "model/gltf-binary", value: "model/gltf-binary" },
                { text: "model/gltf+json", value: "model/gltf+json" },
                { text: "model/stl", value: "model/stl" },
                { text: "model/obj", value: "model/obj" },
            ]

          }
        }
      }
    }

    toBlob(args, util) {
        const text = String(args.DATA);      // ensure it's a string (why can't it be just like python or smth)
        const blob = new Blob([text], { type: args.TYPE });
        return URL.createObjectURL(blob);
    } 
  }
  Scratch.extensions.register(new faunks_Blobs());
})(Scratch);
