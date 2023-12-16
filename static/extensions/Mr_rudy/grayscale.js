(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("This extension must run unsandboxed");
  }

  const canvas = Scratch.renderer.canvas;

  const updateStyle = () => {
    const filter = grayscaleEnabled ? 'grayscale(100%)' : 'none';
    if (canvas.style.filter !== filter) {
      canvas.style.filter = filter;
    }
  };

  new MutationObserver(updateStyle).observe(canvas, {
    attributeFilter: ["style"],
    attributes: true,
  });

  let grayscaleEnabled = false;

  class GrayscaleExtension {
    getInfo() {
      return {
        id: "grayscaleextension",
        name: "Grayscale Extension",
        blocks: [
          {
            opcode: "togglegrayscale",
            blockType: Scratch.BlockType.COMMAND,
            text: "toggle grayscale effect",
          },
        ],
        menus: {},
      };
    }

    togglegrayscale() {
      grayscaleEnabled = !grayscaleEnabled;
      updateStyle();
    }
  }

  Scratch.extensions.register(new GrayscaleExtension());
})(Scratch);
