// Name: Operators+
// ID: OperatorsPlus
// Description: Operators expansion for PenguinMod.
// By: Potater234 <https://odysee.com/$/invite/@Potater234:6>
// License: MIT
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
        "id": "operatorsplus",
        "name": "Operators+",
        "color1": "#59c059",
        "blocks": blocks,
        "menus": menus,
      }
    }
  }
  
var operatorsplus_result, operatorsplus_patience, operatorsplus_decimals;

function textCount(haystack, needle) {
  if (needle.length === 0) {
    return haystack.length + 1;
  } else {
    return haystack.split(needle).length - 1;
  }
}

function mathRandomInt(a, b) {
  if (a > b) {
    // Swap a and b to ensure a is smaller.
    var c = a;
    a = b;
    b = c;
  }
  return Math.floor(Math.random() * (b - a + 1) + a);
}

function textReplace(haystack, needle, replacement) {
  needle = needle.replace(/([-()\[\]{}+?*.$\^|,:#<!\\])/g, '\\$1')
                 .replace(/\x08/g, '\\x08');
  return haystack.replace(new RegExp(needle, 'g'), replacement);
}



blocks.push({
  opcode: "operatorsplus_Block_goldenRatio",
  blockType: Scratch.BlockType.REPORTER,
  text: "φ",
  arguments: {

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_goldenRatio"] = async function(args, util) {
  const localVars = {};
    return 1.618033988749894;
};


blocks.push({
  opcode: "operatorsplus_Block_waitChange",
  blockType: Scratch.BlockType.COMMAND,
  text: "change patience by [1] secs",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `1`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_waitChange"] = async function(args, util) {
  const localVars = {};
    operatorsplus_patience = operatorsplus_patience == '' ? args["1"] * 1000 : operatorsplus_patience + args["1"] * 1000;

};


blocks.push({
  opcode: "operatorsplus_Block_waitSet",
  blockType: Scratch.BlockType.COMMAND,
  text: "set patience to [1] secs",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `1`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_waitSet"] = async function(args, util) {
  const localVars = {};
    operatorsplus_patience = args["1"] * 1000;

};


blocks.push({
  opcode: "operatorsplus_Block_atan2",
  blockType: Scratch.BlockType.REPORTER,
  text: "atan2 x: [x] y: [y]",
  arguments: {
      "x": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `1`
    },
  "y": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `-1`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_atan2"] = async function(args, util) {
  const localVars = {};
    return Math.atan2(args["y"], args["x"]) / Math.PI * 180;
};


blocks.push({
  opcode: "operatorsplus_Block_countIn",
  blockType: Scratch.BlockType.REPORTER,
  text: "count [1] in [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `o`
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `foo`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_countIn"] = async function(args, util) {
  const localVars = {};
    return textCount(args["2"], args["1"]);
};


blocks.push({
  opcode: "operatorsplus_Block_fenceDirection",
  blockType: Scratch.BlockType.REPORTER,
  text: "fence direction [dir]",
  arguments: {
      "dir": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `181`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_fenceDirection"] = async function(args, util) {
  const localVars = {};
    operatorsplus_result = Math.floor(args["dir"]);
  operatorsplus_decimals = args["dir"] - operatorsplus_result;
  operatorsplus_result = operatorsplus_result < 0 ? (0 - (((0 - operatorsplus_result) + 179) % 360 - 179)) + operatorsplus_decimals : ((operatorsplus_result + 179) % 360 - 179) + operatorsplus_decimals;
  return operatorsplus_result <= -180 ? Math.abs(operatorsplus_result) : operatorsplus_result;
};


blocks.push({
  opcode: "operatorsplus_Block_patienceReporter",
  blockType: Scratch.BlockType.REPORTER,
  text: "patience",
  arguments: {

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_patienceReporter"] = async function(args, util) {
  const localVars = {};
    return operatorsplus_patience;
};


blocks.push({
  opcode: "operatorsplus_Block_percentOf2",
  blockType: Scratch.BlockType.REPORTER,
  text: "% of [1] in [2]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `1`
    },
  "2": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `2`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_percentOf2"] = async function(args, util) {
  const localVars = {};
    return (args["1"] / args["2"]) * 100;
};


blocks.push({
  opcode: "operatorsplus_Block_randomDropdownReporter",
  blockType: Scratch.BlockType.REPORTER,
  text: "random [1]",
  arguments: {
      "1": {
    type: Scratch.ArgumentType.STRING,
    menu: "operatorsplus_menu_0",
  },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_randomDropdownReporter"] = async function(args, util) {
  const localVars = {};
    return args["1"] == 'decimal' ? Math.random(0.0000000000000001, 0.9999999999999999) : (args["1"] == 'FPS' ? mathRandomInt(-179, 180) : mathRandomInt(0, 250));
};


blocks.push({
  opcode: "operatorsplus_Block_replaceWith",
  blockType: Scratch.BlockType.REPORTER,
  text: "replace [1] with [2] in [3]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `foo`
    },
  "2": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `bar`
    },
  "3": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `foobar`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_replaceWith"] = async function(args, util) {
  const localVars = {};
    return textReplace(args["3"], args["1"], args["2"]);
};


blocks.push({
  opcode: "operatorsplus_Block_reverseReporter",
  blockType: Scratch.BlockType.REPORTER,
  text: "reverse [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `Hello, World!`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_reverseReporter"] = async function(args, util) {
  const localVars = {};
    return args["1"].split('').reverse().join('');
};


blocks.push({
  opcode: "operatorsplus_Block_roundNearest",
  blockType: Scratch.BlockType.REPORTER,
  text: "[1] [2] to nearest [3]",
  arguments: {
      "1": {
    type: Scratch.ArgumentType.STRING,
    menu: "operatorsplus_menu_1",
  },
  "2": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `1.5`
    },
  "3": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `3`
    },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_roundNearest"] = async function(args, util) {
  const localVars = {};
    return (args["1"] == 'round' ? Math.round(args["2"] / args["3"]) : (args["1"] == 'round down' ? Math.floor(args["2"] / args["3"]) : Math.ceil(args["2"] / args["3"]))) * args["3"];
};


blocks.push({
  opcode: "operatorsplus_Block_waitReporter",
  blockType: Scratch.BlockType.REPORTER,
  text: "wait and return [1]",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.STRING,
      defaultValue: `Hmm...`
    },

  },
  disableMonitor: true
});
Extension.prototype["operatorsplus_Block_waitReporter"] = async function(args, util) {
  const localVars = {};
    await wait(operatorsplus_patience);
  return args["1"];
};


blocks.push({
  opcode: "operatorsplus_Block_isDropdownBoplean",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "is [1] [2] ?",
  arguments: {
      "1": {
      type: Scratch.ArgumentType.NUMBER,
      defaultValue: `1`
    },
  "2": {
    type: Scratch.ArgumentType.STRING,
    menu: "operatorsplus_menu_2",
  },

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_isDropdownBoplean"] = async function(args, util) {
  const localVars = {};
    return args["2"] == 'direction' ? args["1"] >= -179 && args["1"] < 181 : (args["2"] == 'FPS' ? args["1"] >= 1 && args["1"] <= 250 : false);
};


blocks.push({
  opcode: "operatorsplus_Block_patienceBoolean",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "is patient?",
  arguments: {

  },
  disableMonitor: false
});
Extension.prototype["operatorsplus_Block_patienceBoolean"] = async function(args, util) {
  const localVars = {};
    return operatorsplus_patience > 0;
};


blocks.push({
  opcode: "operatorsplus_Block_waitBoolean",
  blockType: Scratch.BlockType.BOOLEAN,
  text: "wait and return [1]",
  arguments: {
      "1": {
    type: Scratch.ArgumentType.STRING,
    menu: "operatorsplus_menu_3",
  },

  },
  disableMonitor: true
});
Extension.prototype["operatorsplus_Block_waitBoolean"] = async function(args, util) {
  const localVars = {};
    await wait(operatorsplus_patience);
  return args["1"] == 'random' ? mathRandomInt(0, 1) == 0 : args["1"];
};


  
menus["operatorsplus_menu_0"] = {
acceptReporters: true,
items: ['decimal', 'direction', 'FPS'],
};


menus["operatorsplus_menu_1"] = {
acceptReporters: true,
items: ['round', 'round down', 'round up'],
};


menus["operatorsplus_menu_2"] = {
acceptReporters: true,
items: ['direction', 'FPS'],
};


menus["operatorsplus_menu_3"] = {
acceptReporters: true,
items: ['false', 'random', 'true'],
};


  
  Scratch.extensions.register(new Extension());
})(Scratch)
