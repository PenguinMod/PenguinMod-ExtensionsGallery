// This extension is to only be used for memes and nothing else.

// Made with PenguinBuilder 3.0
// use PenguinBuilder at "https://chickencuber.github.io/PenguinBuilder/"
(function(Scratch) {
  const blocks = [];
  const vars = {};
  const menus = {};

  

  class Extension {
    getInfo() {
      return {
        "id": "mcdonaldsscenario",
        "name": "McDonaldsScenario",
        "color1": "#ff1900",
        "blocks": blocks,
        "menus": menus,
      }
    }
  }
  
blocks.push({
  opcode: "mcdonaldsscenario_Block_8",
  blockType: Scratch.BlockType.COMMAND,
  text: "commit arson",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["mcdonaldsscenario_Block_8"] = function(args, util) {
  const localVars = {};

};


blocks.push({
  opcode: "mcdonaldsscenario_Block_7",
  blockType: Scratch.BlockType.COMMAND,
  text: "die",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["mcdonaldsscenario_Block_7"] = function(args, util) {
  const localVars = {};

};


blocks.push({
  opcode: "mcdonaldsscenario_Block_5",
  blockType: Scratch.BlockType.COMMAND,
  text: "go to McDonald's and [6]",
  arguments: {
      "6": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `order a soda`
    },

  },
  disableMonitor: true
});
Extension.prototype["mcdonaldsscenario_Block_5"] = function(args, util) {
  const localVars = {};
    alert(prompt('you did something at McDonald\'s I don\'t know what but you definitely did something...'));
  // nananananna
  return 'you did something at McDonald\'s I don\'t know what but you definitely did something...';
};


blocks.push({
  opcode: "mcdonaldsscenario_Block_1",
  blockType: Scratch.BlockType.REPORTER,
  text: "order a [2] from mcdonalds",
  arguments: {
      "2": {
    type: Scratch.ArgumentType.STRING,
    menu: "mcdonaldsscenario_menu_0",
  },

  },
  disableMonitor: true
});
Extension.prototype["mcdonaldsscenario_Block_1"] = function(args, util) {
  const localVars = {};
    alert(prompt((args["2"] == 'Grimace Shake' ? 'One death wish coming up!' : 'One ' + String(String(args["2"]) + ' coming up!'))));
  return args["2"] == 'Grimace Shake' ? 'One death wish coming up!' : 'One ' + String(String(args["2"]) + ' coming up!');
};


blocks.push({
  opcode: "mcdonaldsscenario_Block_3",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "is grimace shake [4] ?",
  arguments: {
      "4": {
    type: Scratch.ArgumentType.STRING,
    menu: "mcdonaldsscenario_menu_1",
  },

  },
  disableMonitor: true
});
Extension.prototype["mcdonaldsscenario_Block_3"] = function(args, util) {
  const localVars = {};
    alert(prompt((args["4"] == 'sus' ? 'amongus' : (args["4"] == 'deathly' ? 'true' : 'false'))));
  // nananananna
  return args["4"] == 'sus' ? true : (args["4"] == 'deathly' ? true : false);
};


blocks.push({
  opcode: "mcdonaldsscenario_Block_9",
  blockType: Scratch.BlockType.REPORTER,
  text: "commit arson",
  arguments: {

  },
  disableMonitor: true
});
Extension.prototype["mcdonaldsscenario_Block_9"] = function(args, util) {
  const localVars = {};

};


blocks.push({
  opcode: "mcdonaldsscenario_Block_10",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "is ice cream machine [11]",
  arguments: {
      "11": {
    type: Scratch.ArgumentType.STRING,
    menu: "mcdonaldsscenario_menu_2",
  },

  },
  disableMonitor: true
});
Extension.prototype["mcdonaldsscenario_Block_10"] = function(args, util) {
  const localVars = {};
    alert(prompt((args["11"] == 'working' ? 'true' : 'false')));
  return args["11"] == 'working' ? false : true;
};



menus["mcdonaldsscenario_menu_0"] = {
acceptReporters: false,
items: ['Big Mac', 'Extra Large Fries', 'Grimace Shake'],
};


menus["mcdonaldsscenario_menu_1"] = {
acceptReporters: true,
items: ['deathly', 'perfectly fine'],
};


menus["mcdonaldsscenario_menu_2"] = {
acceptReporters: false,
items: ['working', 'broken'],
};


  Scratch.extensions.register(new Extension());
})(Scratch);
