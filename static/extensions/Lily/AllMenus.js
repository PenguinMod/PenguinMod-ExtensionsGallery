(function (Scratch) {
  "use strict";

  var blockXML;
  const blacklist = ["looks_costumenumbername", "extension_wedo_tilt_menu"];
  const whitelist = ["looks_costume", "looks_backdrops", "sensing_keyoptions"];

  Scratch.vm.addListener("BLOCKSINFO_UPDATE", refreshMenus);

  function refreshMenus() {
    if (!window.ScratchBlocks) return;
    Scratch.vm.removeListener("BLOCKSINFO_UPDATE", refreshMenus);

    let allBlocks = Object.keys(ScratchBlocks.Blocks);

    allBlocks = allBlocks.filter(
      (item) => item.includes("menu") && !blacklist.includes(item) || whitelist.includes(item)
    );

    const menuBlocks = allBlocks.map(
      (item) => '<block id="' + item + '" type="' + item + '"/>'
    );

    blockXML = menuBlocks.join("");
    Scratch.vm.runtime.extensionManager.refreshBlocks();
  }

  class AllMenus {
    constructor() {
      Scratch.vm.runtime.on("EXTENSION_ADDED", () => {
        refreshMenus();
      });
    }

    getInfo() {
      return {
        id: "lmsAllMenus",
        name: "All Menus",
        blocks: [
          {
            blockType: Scratch.BlockType.XML,
            xml: blockXML,
          },
        ],
      };
    }
  }

  refreshMenus();

  Scratch.extensions.register(new AllMenus());
})(Scratch);
