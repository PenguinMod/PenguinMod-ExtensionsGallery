// Name: Update File (Direct Access)
// ID: ACatUpdateFile
// Description: Edit/Read files dynamically without prompting to reselect it.
// By: Anonymous_cat1

//  Version 1.0.0

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Update File was loaded sandboxed. Update File must run unsandboxed");

  const menuIconURI =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNS40NzgiIGhlaWdodD0iMzUuNDc4IiB2aWV3Qm94PSIwIDAgMzUuNDc4IDM1LjQ3OCI+PGcgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0wIDE3LjczOUMwIDcuOTQyIDcuOTQyIDAgMTcuNzM5IDBzMTcuNzM5IDcuOTQyIDE3LjczOSAxNy43MzktNy45NDIgMTcuNzM5LTE3LjczOSAxNy43MzlTMCAyNy41MzYgMCAxNy43MzkiIGZpbGw9IiNlOGFiMWMiLz48cGF0aCBkPSJNMTYuMjg1IDI3Ljc3MWMtLjQ2OSAwLS44NDktLjQxLS44NDktLjkxNFYxMi40MzJjMC0uNTA0LjM4LS45MTQuODQ5LS45MTRoMy42NzF2NC4yMDZsLTIuODcuMDEzIDQuNDY3IDUuNDYzIDQuMTQ0LTUuNDc0LTIuNzU3LS4wMDJ2LTQuMjA2aDMuNzg4Yy40NjggMCAuODQ4LjQxLjg0OC45MTR2MTQuNDI1YzAgLjUwNS0uMzguOTE0LS44NDguOTE0eiIgZmlsbD0iI2ZhZmFmYSIvPjxwYXRoIGQ9Ik04Ljc1IDIzLjk1OWMtLjQ2OCAwLS44NDgtLjQwOS0uODQ4LS45MTNWOC42MjFjMC0uNTA1LjM4LS45MTQuODQ4LS45MTRoMTAuNDQzYy40NjkgMCAuODQ5LjQxLjg0OS45MTR2Mi4wOTNoLTQuNTA2Yy0uNDY4IDAtLjg0OC40MDktLjg0OC45MTRWMjMuOTZ6IiBmaWxsPSIjZmFmYWZhIi8+PC9nPjwvc3ZnPg==";
  const blockIconURI =
    "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMy4xOTYiIGhlaWdodD0iMjMuNjU2IiB2aWV3Qm94PSIwIDAgMjMuMTk2IDIzLjY1NiI+PGcgZmlsbD0iI2ZhZmFmYSIgc3Ryb2tlLXdpZHRoPSIwIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik05Ljg4MyAyMy42NTZjLS41NTIgMC0xLS40ODMtMS0xLjA3OFY1LjU3MWMwLS41OTUuNDQ4LTEuMDc3IDEtMS4wNzdoNC4zMjl2NC45NThsLTMuMzgzLjAxNiA1LjI2NSA2LjQ0IDQuODg3LTYuNDU0LTMuMjUyLS4wMDJWNC40OTRoNC40NjdjLjU1MiAwIDEgLjQ4MiAxIDEuMDc3djE3LjAwN2MwIC41OTUtLjQ0OCAxLjA3OC0xIDEuMDc4eiIvPjxwYXRoIGQ9Ik0xIDE5LjE2MmMtLjU1MiAwLTEtLjQ4Mi0xLTEuMDc3VjEuMDc4QzAgLjQ4My40NDggMCAxIDBoMTIuMzEyYy41NTMgMCAxIC40ODMgMSAxLjA3OHYyLjQ2N0g5LjAwMWMtLjU1MyAwLTEgLjQ4Mi0xIDEuMDc4djE0LjU0eiIvPjwvZz48L3N2Zz4=";

  class ACatUpdateFile {
    constructor() {
      this.fileHandle = null;
    }
    getInfo() {
      return {
        id: "ACatUpdateFile",
        name: "Update File (Direct Access)",
        color1: "#e8ab1c",
        menuIconURI,
        blockIconURI,
        blocks: [
          { blockType: Scratch.BlockType.LABEL, text: "File Management" },
          {
            opcode: "setFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "Set file"
          },
          {
            opcode: "closeFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "Close file"
          },
          {
            opcode: "isFileOpen",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "Is file open?",
            disableMonitor: true
          },
          {
            opcode: "checkFileSystemAPI",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "Browser supports Direct Access?",
            disableMonitor: true,
          },
          { blockType: Scratch.BlockType.LABEL, text: "File reading" },
          {
            opcode: "getFileContent",
            blockType: Scratch.BlockType.REPORTER,
            text: "Get file content as [FORMAT]",
            disableMonitor: true,
            arguments: {
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: "readFormatMenu"
              }
            }
          },
          {
            opcode: "getFileMetadata",
            blockType: Scratch.BlockType.REPORTER,
            text: "Get file metadata as JSON",
            disableMonitor: true
          },
          { blockType: Scratch.BlockType.LABEL, text: "File writing (Dangerous!)" },
          {
            opcode: "updateFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "Write content to file from [FORMAT] [CONTENT]",
            arguments: {
              FORMAT: {
                type: Scratch.ArgumentType.STRING,
                menu: "writeFormatMenu"
              },
              CONTENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Foo, Bar, Baz"
              }
            }
          }
        ],
        menus: {
          readFormatMenu: ["Text", "URI", "Hex (as array)"],
          writeFormatMenu: ["Text", "URI/URL"]
        }
      };
    }

    async checkFileSystemAPI() {
      return "showOpenFilePicker" in window;
    }

    async isFileOpen() {
      return this.fileHandle !== null;
    }

    async closeFile() {
      if (!this.fileHandle) return;
      this.fileHandle = null;
    }

    async setFile() {
      if (!this.checkFileSystemAPI()) return;
      try {
        [this.fileHandle] = await window.showOpenFilePicker();
      } catch (error) {
        this.fileHandle = null; // Close previous file incase uses wanted to get rid of the last file
        if (error.name === "AbortError") console.warn("File selection was aborted by the user");
        else console.error("Unexpected error:", error.message);
      }
    }

    async updateFile(args) {
      if (!this.checkFileSystemAPI() || !this.fileHandle) return;
      const data = Scratch.Cast.toString(args.CONTENT);
      try {
        const writable = await this.fileHandle.createWritable();
        if (args.FORMAT === "URI/URL") {
          if (data.startsWith("data:")) {
            const [meta, base64Content] = data.split(",");
            const content = decodeURIComponent(escape(atob(base64Content)));
            await writable.write(content);
          } else {
            const response = await fetch(data);
            if (!response.ok) throw new Error("Failed to fetch content");
            const content = await response.text();
            await writable.write(content);
          }
        } else {
          await writable.write(data);
        }
        await writable.close();
      } catch (error) {
        console.error("Error writing content to file:", error.message);
      }
    }

    async getFileContent(args) {
      if (!this.checkFileSystemAPI() || !this.fileHandle) return;
      const file = await this.fileHandle.getFile();
      const text = await file.text();
      if (args.FORMAT === "URI") {
        const base64Content = btoa(unescape(encodeURIComponent(text)));
        return `data:${file.type};charset=utf-8;base64,${base64Content}`;
      } else if (args.FORMAT === "Hex (as array)") {
        const file = await this.fileHandle.getFile();
        const arrayBuffer = await file.arrayBuffer();
        const byteArray = new Uint8Array(arrayBuffer);
        const hexArray = Array.from(byteArray).map(byte => `"${byte.toString(16).padStart(2, "0")}"`);
        return `[${hexArray}]`;
      } else {
        return text;
      }
    }

    async getFileMetadata() {
      if (!this.checkFileSystemAPI() || !this.fileHandle) return;
      const file = await this.fileHandle.getFile();

      const modifyDate = new Date(file.lastModified);
      const year = modifyDate.getFullYear();
      const month = String(modifyDate.getMonth() + 1).padStart(2, "0");
      const day = String(modifyDate.getDate()).padStart(2, "0");
      const formattedDate = `${year}-${month}-${day}`;

      const hours = String(modifyDate.getHours()).padStart(2, "0");
      const minutes = String(modifyDate.getMinutes()).padStart(2, "0");
      const seconds = String(modifyDate.getSeconds()).padStart(2, "0");
      const formattedTime = `${hours}:${minutes}.${seconds}`;

      return JSON.stringify({
        name: file.name,
        bytes: Scratch.Cast.toString(file.size),
        type: file.type,
        lastModifiedTime: formattedTime,
        lastModifiedDate: formattedDate
      });
    }
  }
  Scratch.extensions.register(new ACatUpdateFile());
})(Scratch);
