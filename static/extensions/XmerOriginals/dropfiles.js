// Description: Manage Files Dragged and Dropped on Top of Your Standalone Project from the File Manager.
// License: MPL-2.0

class DropFiles {
  constructor(runtime) {
    this.runtime = runtime;
    this.enabled = false;
    this.dragging = false;
    this.droppedFile = null;
    this._boundDragOver = this._onDragOver.bind(this);
    this._boundDrop = this._onDrop.bind(this);
    this._boundDragLeave = this._onDragLeave.bind(this);
  }

  getInfo() {
    return {
      id: "dropfiles",
      name: "Drop Files",
      color1: "#05a047",
      blocks: [
        {
          opcode: "whenFileDropped",
          blockType: Scratch.BlockType.HAT,
          text: "when a file is dropped",
        },
        {
          opcode: "setEnabled",
          blockType: Scratch.BlockType.COMMAND,
          text: "set file drop to [STATE]",
          arguments: {
            STATE: {
              type: Scratch.ArgumentType.STRING,
              menu: "stateMenu",
            },
          },
        },
        {
          opcode: "clearDroppedFile",
          blockType: Scratch.BlockType.COMMAND,
          text: "clear dropped file",
        },
        {
          blockType: "label",
          text: "Controls",
        },
        {
          opcode: "isEnabled",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "file drop is enabled?",
        },
        {
          opcode: "isDragging",
          blockType: Scratch.BlockType.BOOLEAN,
          text: "a file is being dragged?",
        },
        {
          blockType: "label",
          text: "File",
        },
        {
          opcode: "getFileContent",
          blockType: Scratch.BlockType.REPORTER,
          text: "get dropped file content as [FORMAT]",
          arguments: {
            FORMAT: {
              type: Scratch.ArgumentType.STRING,
              menu: "formatMenu",
            },
          },
        },
        {
          opcode: "getFileInfo",
          blockType: Scratch.BlockType.REPORTER,
          text: "get dropped file [INFO]",
          arguments: {
            INFO: {
              type: Scratch.ArgumentType.STRING,
              menu: "infoMenu",
            },
          },
        },
      ],
      menus: {
        stateMenu: {
          acceptReporters: true,
          items: ["true", "false"],
        },
        formatMenu: {
          acceptReporters: true,
          items: ["text", "data uri"],
        },
        infoMenu: {
          acceptReporters: true,
          items: ["name", "size", "type"],
        },
      },
    };
  }

  setEnabled({ STATE }) {
    const enable = STATE === "true";
    if (enable && !this.enabled) {
      window.addEventListener("dragover", this._boundDragOver);
      window.addEventListener("drop", this._boundDrop);
      window.addEventListener("dragleave", this._boundDragLeave);
    } else if (!enable && this.enabled) {
      window.removeEventListener("dragover", this._boundDragOver);
      window.removeEventListener("drop", this._boundDrop);
      window.removeEventListener("dragleave", this._boundDragLeave);
    }
    this.enabled = enable;
  }

  clearDroppedFile() {
    this.droppedFile = null;
  }

  isEnabled() {
    return this.enabled;
  }

  isDragging() {
    return this.dragging;
  }

  getFileContent({ FORMAT }) {
    if (!this.droppedFile) return "";
    if (FORMAT === "data uri") {
      return this._getDataURI(this.droppedFile);
    } else {
      return this._getText(this.droppedFile);
    }
  }

  async _getDataURI(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }

  async _getText(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsText(file);
    });
  }

  getFileInfo({ INFO }) {
    if (!this.droppedFile) return "";
    switch (INFO) {
      case "name":
        return this.droppedFile.name;
      case "size":
        return this.droppedFile.size.toString();
      case "type":
        return this.droppedFile.type;
    }
    return "";
  }

  whenFileDropped() {
    return !!this.droppedFile;
  }

  _onDragOver(e) {
    e.preventDefault();
    this.dragging = true;
  }

  _onDragLeave(e) {
    e.preventDefault();
    this.dragging = false;
  }

  _onDrop(e) {
    e.preventDefault();
    this.dragging = false;
    if (e.dataTransfer.files.length > 0) {
      this.droppedFile = e.dataTransfer.files[0];
      this.runtime.startHats("dropfiles_whenFileDropped");
    }
  }
}

Scratch.extensions.register(new DropFiles());
