// Description: Quickly Process Multiple Selected Files.
// License: MPL-2.0

class MultiFileSelector {
  constructor(runtime) {
    this.runtime = runtime;
    this.files = [];
    this.fileContents = [];
  }

  getInfo() {
    return {
      id: "multiFileSelector",
      name: "Multi File Selector+",
      color1: "#fc6400",
      blocks: [
        {
          opcode: "selectFiles",
          blockType: Scratch.BlockType.COMMAND,
          text: "select files [TYPES] max [MAX]",
          arguments: {
            TYPES: {
              type: Scratch.ArgumentType.STRING,
              menu: "fileTypes",
              defaultValue: "all",
            },
            MAX: {
              type: Scratch.ArgumentType.NUMBER,
              defaultValue: 10,
            },
          },
        },
        {
          opcode: "clearFiles",
          blockType: Scratch.BlockType.COMMAND,
          text: "clear file selection",
        },
        {
          blockType: "label",
          text: "File Data",
        },
        {
          opcode: "getFileInfo",
          blockType: Scratch.BlockType.REPORTER,
          text: "file info list",
        },
        {
          opcode: "getFileData",
          blockType: Scratch.BlockType.REPORTER,
          text: "file data list",
        },
      ],
      menus: {
        fileTypes: {
          acceptReporters: true,
          items: ["all", "audio", "text", "image"],
        },
      },
    };
  }

  async selectFiles(args, util) {
    const maxFiles = Math.max(1, Math.floor(args.MAX));
    const typeMap = {
      all: "*",
      audio: "audio/*",
      text: "text/*",
      image: "image/*",
    };
    const acceptType = typeMap[args.TYPES] || "*";

    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = acceptType;

    this.files = [];
    this.fileContents = [];

    return new Promise((resolve) => {
      input.onchange = async (event) => {
        const selectedFiles = Array.from(event.target.files).slice(0, maxFiles);
        this.files = selectedFiles.map((file) => ({
          name: file.name,
          size: file.size,
          modified: file.lastModified,
          type: file.type,
        }));
        this.fileContents = await Promise.all(
          selectedFiles.map((file) => this.readFileAsDataURI(file))
        );
        resolve();
        util.target.runtime.requestRedraw();
      };

      input.oncancel = () => {
        this.files = [];
        this.fileContents = [];
        resolve();
        util.target.runtime.requestRedraw();
      };

      input.click();
    });
  }

  async readFileAsDataURI(file) {
    return new Promise((resolve) => {
      if (!file) {
        return resolve("");
      }
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  clearFiles() {
    this.files = [];
    this.fileContents = [];
  }

  getFileInfo() {
    return this.files.length > 0 ? JSON.stringify(this.files) : "[]";
  }

  getFileData() {
    return this.fileContents.length > 0
      ? JSON.stringify(this.fileContents)
      : "[]";
  }
}
Scratch.extensions.register(new MultiFileSelector());
