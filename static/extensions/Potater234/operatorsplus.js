// Name: Operators+
// ID: OperatorsPlus
// Description: Operators expansion.
// By: Potater234 <https://odysee.com/$/invite/@Potater234:6>
// License: MIT
(async function(Scratch) {
  const blocks = [];
  let operatorsplus_result, operatorsplus_patience, operatorsplus_decimals;
  const wait = m => new Promise(r => setTimeout(r, m));
  const textCount = (haystack, needle) => (needle === "" ? haystack.length + 1 : haystack.split(needle).length - 1);
  const mathRandomInt = (a, b) => { const [min, max] = a > b ? [b, a] : [a, b]; return Math.floor(Math.random() * (max - min + 1)) + min; };
  const textReplace = (h, n, r) => h.replace(new RegExp(n.replace(/([-()\[\]{}+?*.$^|,:#<!\\])/g, '\\$1').replace(/\x08/g, '\\x08'), 'g'), r);

  class Extension {
    getInfo() {
      return {
        id: 'operatorsplus', name: 'Operators+', color1: '#59c059', blocks,
        menus: {
          operatorsplus_menu_0: { acceptReporters: true, items: ['decimal', 'direction', 'FPS'] },
          operatorsplus_menu_1: { acceptReporters: true, items: ['round', 'round down', 'round up'] },
          operatorsplus_menu_2: { acceptReporters: true, items: ['direction', 'FPS'] },
          operatorsplus_menu_3: { acceptReporters: true, items: ['false', 'random', 'true'] },
        },
      };
    }
    goldenRatio() { return 1.618033988749894; }
    get operatorsplus_Block_goldenRatio() { return this.goldenRatio; }

    changePatience({ 1: s }) { operatorsplus_patience = (operatorsplus_patience === undefined ? (s || 1) * 1000 : operatorsplus_patience + (s || 1) * 1000); }
    get operatorsplus_Block_waitChange() { return this.changePatience; }

    setPatience({ 1: s }) { operatorsplus_patience = (s || 1) * 1000; }
    get operatorsplus_Block_waitSet() { return this.setPatience; }

    atan2({ x, y }) { return Math.atan2(y, x) * 180 / Math.PI; }
    get operatorsplus_Block_atan2() { return this.atan2; }

    countIn({ 1: n, 2: h }) { return textCount(h, n); }
    get operatorsplus_Block_countIn() { return this.countIn; }

    fenceDirection({ dir }) {
      const f = Math.floor(dir);
      operatorsplus_decimals = dir - f;
      operatorsplus_result = f < 0 ? (0 - (((0 - f) + 179) % 360 - 179)) + operatorsplus_decimals : ((f + 179) % 360 - 179) + operatorsplus_decimals;
      return operatorsplus_result <= -180 ? Math.abs(operatorsplus_result) : operatorsplus_result;
    }
    get operatorsplus_Block_fenceDirection() { return this.fenceDirection; }

    patienceReporter() { return operatorsplus_patience; }
    get operatorsplus_Block_patienceReporter() { return this.patienceReporter; }

    percentOf({ 1: p, 2: w }) { return (p / w) * 100; }
    get operatorsplus_Block_percentOf2() { return this.percentOf; }

    randomDropdownReporter({ 1: t }) {
      switch (t) {
        case 'decimal': return Math.random();
        case 'direction': return mathRandomInt(-179, 180);
        case 'FPS': return mathRandomInt(0, 250);
        default: return Math.random();
      }
    }
    get operatorsplus_Block_randomDropdownReporter() { return this.randomDropdownReporter; }

    replaceWith({ 1: n, 2: r, 3: h }) { return textReplace(h, n, r); }
    get operatorsplus_Block_replaceWith() { return this.replaceWith; }

    reverseReporter({ 1: t }) { return t.split('').reverse().join(''); }
    get operatorsplus_Block_reverseReporter() { return this.reverseReporter; }

    roundNearest({ 1: o, 2: n, 3: m }) { const q = n / m; switch (o) { case 'round': return Math.round(q) * m; case 'round down': return Math.floor(q) * m; case 'round up': return Math.ceil(q) * m; default: return Math.round(q) * m; } }
    get operatorsplus_Block_roundNearest() { return this.roundNearest; }

    async waitAndReturn({ 1: v }) { await wait(operatorsplus_patience); return v; }
    get operatorsplus_Block_waitReporter() { return this.waitAndReturn; }

    isDropdownBoplean({ 1: v, 2: t }) { return (t === 'direction' && v >= -179 && v < 181) || (t === 'FPS' && v >= 1 && v <= 250) || false; }
    get operatorsplus_Block_isDropdownBoplean() { return this.isDropdownBoplean; }

    patienceBoolean() { return operatorsplus_patience > 0; }
    get operatorsplus_Block_patienceBoolean() { return this.patienceBoolean; }

    async waitBoolean({ 1: t }) { await wait(operatorsplus_patience); return t === 'random' ? Math.random() < 0.5 : t === 'true'; }
    get operatorsplus_Block_waitBoolean() { return this.waitBoolean; }
  }

  const ext = new Extension();

  blocks.push({ opcode: 'operatorsplus_Block_goldenRatio', blockType: Scratch.BlockType.REPORTER, text: 'φ' });
  blocks.push({ opcode: 'operatorsplus_Block_waitChange', blockType: Scratch.BlockType.COMMAND, text: 'change patience by [1] secs', arguments: { '1': { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } } });
  blocks.push({ opcode: 'operatorsplus_Block_waitSet', blockType: Scratch.BlockType.COMMAND, text: 'set patience to [1] secs', arguments: { '1': { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 } } });
  blocks.push({ opcode: 'operatorsplus_Block_atan2', blockType: Scratch.BlockType.REPORTER, text: 'atan2 x: [x] y: [y]', arguments: { x: { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }, y: { type: Scratch.ArgumentType.NUMBER, defaultValue: -1 } } });
  blocks.push({ opcode: 'operatorsplus_Block_countIn', blockType: Scratch.BlockType.REPORTER, text: 'count [1] in [2]', arguments: { '1': { type: Scratch.ArgumentType.STRING, defaultValue: 'o' }, '2': { type: Scratch.ArgumentType.STRING, defaultValue: 'foo' } } });
  blocks.push({ opcode: 'operatorsplus_Block_fenceDirection', blockType: Scratch.BlockType.REPORTER, text: 'fence direction [dir]', arguments: { dir: { type: Scratch.ArgumentType.NUMBER, defaultValue: 181 } } });
  blocks.push({ opcode: 'operatorsplus_Block_patienceReporter', blockType: Scratch.BlockType.REPORTER, text: 'patience' });
  blocks.push({ opcode: 'operatorsplus_Block_percentOf2', blockType: Scratch.BlockType.REPORTER, text: '% of [1] in [2]', arguments: { '1': { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }, '2': { type: Scratch.ArgumentType.NUMBER, defaultValue: 2 } } });
  blocks.push({ opcode: 'operatorsplus_Block_randomDropdownReporter', blockType: Scratch.BlockType.REPORTER, text: 'random [1]', arguments: { '1': { type: Scratch.ArgumentType.STRING, menu: 'operatorsplus_menu_0' } } });
  blocks.push({ opcode: 'operatorsplus_Block_replaceWith', blockType: Scratch.BlockType.REPORTER, text: 'replace [1] with [2] in [3]', arguments: { '1': { type: Scratch.ArgumentType.STRING, defaultValue: 'foo' }, '2': { type: Scratch.ArgumentType.STRING, defaultValue: 'bar' }, '3': { type: Scratch.ArgumentType.STRING, defaultValue: 'foobar' } } });
  blocks.push({ opcode: 'operatorsplus_Block_reverseReporter', blockType: Scratch.BlockType.REPORTER, text: 'reverse [1]', arguments: { '1': { type: Scratch.ArgumentType.STRING, defaultValue: 'Hello, World!' } } });
  blocks.push({ opcode: 'operatorsplus_Block_roundNearest', blockType: Scratch.BlockType.REPORTER, text: '[1] [2] to nearest [3]', arguments: { '1': { type: Scratch.ArgumentType.STRING, menu: 'operatorsplus_menu_1' }, '2': { type: Scratch.ArgumentType.NUMBER, defaultValue: 1.5 }, '3': { type: Scratch.ArgumentType.NUMBER, defaultValue: 3 } } });
  blocks.push({ opcode: 'operatorsplus_Block_waitReporter', blockType: Scratch.BlockType.REPORTER, text: 'wait and return [1]', arguments: { '1': { type: Scratch.ArgumentType.STRING, defaultValue: 'Hmm...' } }, disableMonitor: true });
  blocks.push({ opcode: 'operatorsplus_Block_isDropdownBoplean', blockType: Scratch.BlockType.BOOLEAN, text: 'is [1] [2] ?', arguments: { '1': { type: Scratch.ArgumentType.NUMBER, defaultValue: 1 }, '2': { type: Scratch.ArgumentType.STRING, menu: 'operatorsplus_menu_2' } } });
  blocks.push({ opcode: 'operatorsplus_Block_patienceBoolean', blockType: Scratch.BlockType.BOOLEAN, text: 'is patient?' });
  blocks.push({ opcode: 'operatorsplus_Block_waitBoolean', blockType: Scratch.BlockType.BOOLEAN, text: 'wait and return [1]', arguments: { '1': { type: Scratch.ArgumentType.STRING, menu: 'operatorsplus_menu_3' } }, disableMonitor: true });

  Scratch.extensions.register(ext);
})(Scratch);
