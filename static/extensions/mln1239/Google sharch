// id: googlesharch
// name: Google sharch
// description: this extension api
// by: mln1239 <https://penguinmod.com/profile/?user=mln1239>
// license: MIT
            (async function(Scratch) {
                const blocks = [];
                const vars = {};
                const menus = {};

                function wait(m) {
                    return new Promise((r) => setTimeout(() => r(), m));
                }

                

                class Extension {
                    getInfo() {
                        return {
                            "id": "googlesharch",
                            "name": "Google sharch",
                            "color1": "#d6d6d6",
                            "blocks": blocks,
                            "menus": menus,
                        }
                    }
                }
                
blocks.push({
  opcode: "googlesharch_Block_1",
  blockType: Scratch.BlockType.COMMAND,
  text: "set search [1] to Google",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `penguinmod`
    },

  },
  disableMonitor: false
});
Extension.prototype["googlesharch_Block_1"] = async function(args, util) {
  const localVars = {};
    vars['1'] = (['https://www.google.com/search?q=',args["1"],'&sca_esv=5e99471b1a2d566a&biw=1366&bih=657&aic=0&sxsrf=ANbL-','n7BwrLp-2srYOdCkcD9UGg44Ewhtg%3A1770016003342&ei=A02AabfWFImgseMPtvqpiQE'].join(''));

};


blocks.push({
  opcode: "googlesharch_Block_2",
  blockType: Scratch.BlockType.REPORTER,
  text: "get search google",
  arguments: {

  },
  disableMonitor: false
});
Extension.prototype["googlesharch_Block_2"] = async function(args, util) {
  const localVars = {};
    return vars['1'];
};


blocks.push({
  opcode: "googlesharch_Block_3",
  blockType: Scratch.BlockType.COMMAND,
  text: "open to google search[2]",
  arguments: {
      "2": {
      type: Scratch.ArgumentType.empty,
      defaultValue: ``
    },

  },
  disableMonitor: false
});
Extension.prototype["googlesharch_Block_3"] = async function(args, util) {
  const localVars = {};
    eval((['open("',args["2"],'")'].join('')));

};


                
    blocks.push({
        opcode: "button_048882ea-0197-45c1-b3d0-e05f339c02af",
        func: "button_048882ea-0197-45c1-b3d0-e05f339c02af",
        blockType: Scratch.BlockType.BUTTON,
        text: "this api",
      });
      Extension.prototype["button_048882ea-0197-45c1-b3d0-e05f339c02af"] = async function(util) {
        const localVars = {};
          alert('yes, this is like api, or similar to Google api');

      };
                
    (() => {
    const temp = [
          "button_048882ea-0197-45c1-b3d0-e05f339c02af", 
    ];
    blocks.sort((a, b) => {
        a = temp.indexOf(a.opcode);
        b = temp.indexOf(b.opcode);
        if(a === -1) {
          if(b === -1) {
            return 0;
          } else {
            return 1;
          }
        } else if(b === -1) {
          return -1;
        }
        return a - b;
      })
})();
                Scratch.extensions.register(new Extension());
            })(Scratch);
            
