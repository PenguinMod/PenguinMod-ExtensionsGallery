
            (function(Scratch) {
                const blocks = [];
                const vars = {};
                const menus = {};

                function wait(m) {
                    return new Promise((r) => setTimeout(() => r(), m));
                }

                if (!Scratch.extensions.unsandboxed) {
                    throw new Error('Unit converter must run unsandboxed');
                }

                class Extension {
                    getInfo() {
                        return {
                            "id": "unitconverter",
                            "name": "Unit converter",
                            "color1": "#00f0ec",
                            "blocks": blocks,
                            "menus": menus,
                        }
                    }
                }
                
blocks.push({
  opcode: "unitconverter_Block_converttemp",
  blockType: Scratch.BlockType.REPORTER,
  text: "Convert temperature [valuet] [temp] to [temp2]",
  arguments: {
      "valuet": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: ``
    },
  "temp": {
    type: Scratch.ArgumentType.STRING,
    menu: "unitconverter_customMenu_temperature",
  },
  "temp2": {
    type: Scratch.ArgumentType.STRING,
    menu: "unitconverter_customMenu_temperature",
  },

  },
  disableMonitor: false
});
Extension.prototype["unitconverter_Block_converttemp"] = async function(args, util) {
  const localVars = {};
    if (args["temp"] == args["temp2"]) {
    return args["valuet"];}
  if (args["temp"] == 'Celsius') {
    if (args["temp2"] == 'Farenheit') {
      return args["valuet"] * 1.8 + 32;}
  }
  if (args["temp"] == 'Farenheit') {
    if (args["temp2"] == 'Celsius') {
      return (args["valuet"] - 32) / 1.8;}
  }
  if (args["temp2"] == 'Celsius') {
    if (args["temp2"] == 'Kelvin') {
      return args["valuet"] + 273;}
  }
  if (args["temp"] == 'Kelvin') {
    if (args["temp2"] == 'Celsius') {
      return args["valuet"] - 273;}
  }
  if (args["temp"] == 'Kelvin') {
    if (args["temp2"] == 'Farenheit') {
      return (args["valuet"] - 273) * 1.8 + 32;}
  }
  if (args["temp"] == 'Farenheit') {
    if (args["temp2"] == 'Kelvin') {
      return (args["valuet"] - 32) / 1.8 + 273;}
  }

};

menus["unitconverter_customMenu_temperature"] = {
acceptReporters: false,
items: ['Farenheit', 'Celsius', 'Kelvin'],
};
menus["unitconverter_customMenu_distance"] = {
acceptReporters: false,
items: ('Miles-Kilometers-Meters-Foots-Inches-Centimeters'.split('-')),
};

                
    blocks.push({
        opcode: "button_d0aeab3a-10f1-4bb8-b79a-20d64e6cbf7a",
        func: "button_d0aeab3a-10f1-4bb8-b79a-20d64e6cbf7a",
        blockType: Scratch.BlockType.BUTTON,
        text: "Alert",
      });
      Extension.prototype["button_d0aeab3a-10f1-4bb8-b79a-20d64e6cbf7a"] = async function(util) {
        const localVars = {};
          alert('Some blocks that convert units may have inaccurate/wrong conversions or may give an error (The block will return the message "Extension error")');

      };
                
    (() => {
    const temp = [
          "button_d0aeab3a-10f1-4bb8-b79a-20d64e6cbf7a", "unitconverter_Block_converttemp","unitconverter_Block_convertdistance",
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
            
