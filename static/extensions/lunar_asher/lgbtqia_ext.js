/**!
 * LGBTQIA+ Extension
 * author Ash https://discord.com/users/1274550888706474169
 * version 1.0
 * copyright MIT License
 * DO NOT REMOVE THIS COMMENT
 */

(function (Scratch) {
  'use strict';

  class LGBTQIAPlusExtension {
    constructor() {
      this._selGenders = [];
      this._selSexualities = [];
      this._selPronouns = [];

      this._genders = [
        'agender','androgyne','bigender','cisgender','demiboy','demigirl',
        'genderfluid','genderqueer','intergender','man','neutrois','non-binary',
        'pangender','polygender','transgender','two-spirit','woman','xenogender','questioning'
      ];
      this._sexualities = [
        'asexual','bisexual','gay','lesbian','pansexual','omnisexual',
        'heterosexual / straight','queer','demisexual','polysexual','graysexual','questioning'
      ];
      this._pronouns = [
        'she/her','he/him','they/them','she/they','he/they','any pronouns',
        'no pronouns (name only)','it/its','xe/xem','ze/zir','fae/faer','ve/ver','ey/em'
      ];
    }

    getInfo() {
      return {
        id: 'lgbtqiaPlusExtension',
        name: 'LGBTQIA+',
        color1: '#8557ff',
        color2: '#6a43e6',
        color3: '#4b2fb3',
        blocks: [
          { blockType: Scratch.BlockType.BUTTON, text: 'Disclaimer', func: 'showDisclaimer' },

          { blockType: Scratch.BlockType.LABEL, text: 'Gender' },
          {
            opcode: 'setGender',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set Gender [G]',
            arguments: { G: { type: Scratch.ArgumentType.STRING, menu: 'genderMenu' } }
          },
          {
            opcode: 'addGender',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add Gender [G]',
            arguments: { G: { type: Scratch.ArgumentType.STRING, menu: 'genderMenu' } }
          },
          {
            opcode: 'removeGender',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Remove Gender [G]',
            arguments: { G: { type: Scratch.ArgumentType.STRING, menu: 'genderMenu' } }
          },
          { opcode: 'getGender', blockType: Scratch.BlockType.REPORTER, text: 'Gender' },

          { blockType: Scratch.BlockType.LABEL, text: 'Sexuality' },
          {
            opcode: 'setSexuality',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set Sexuality [S]',
            arguments: { S: { type: Scratch.ArgumentType.STRING, menu: 'sexualityMenu' } }
          },
          {
            opcode: 'addSexuality',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add Sexuality [S]',
            arguments: { S: { type: Scratch.ArgumentType.STRING, menu: 'sexualityMenu' } }
          },
          {
            opcode: 'removeSexuality',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Remove Sexuality [S]',
            arguments: { S: { type: Scratch.ArgumentType.STRING, menu: 'sexualityMenu' } }
          },
          { opcode: 'getSexuality', blockType: Scratch.BlockType.REPORTER, text: 'Sexuality' },

          { blockType: Scratch.BlockType.LABEL, text: 'Pronouns' },
          {
            opcode: 'setPronouns',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Set Pronouns [P]',
            arguments: { P: { type: Scratch.ArgumentType.STRING, menu: 'pronounMenu' } }
          },
          {
            opcode: 'addPronouns',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Add Pronouns [P]',
            arguments: { P: { type: Scratch.ArgumentType.STRING, menu: 'pronounMenu' } }
          },
          {
            opcode: 'removePronouns',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Remove Pronouns [P]',
            arguments: { P: { type: Scratch.ArgumentType.STRING, menu: 'pronounMenu' } }
          },
          { opcode: 'getPronouns', blockType: Scratch.BlockType.REPORTER, text: 'Pronouns' }
        ],
        menus: {
          genderMenu:    { acceptReporters: false, items: 'genderMenuItems' },
          sexualityMenu: { acceptReporters: false, items: 'sexualityMenuItems' },
          pronounMenu:   { acceptReporters: false, items: 'pronounMenuItems' }
        }
      };
    }

    showDisclaimer() {
      if (typeof window !== 'undefined' && window.alert) {
        window.alert(
          'Disclaimer:\n\n' +
          'This extension contains most of the genders,\n' +
          'sexualities, and pronouns, but remember it\n' +
          'does NOT contain everything.'
        );
      }
    }

    genderMenuItems()    { return this._genders.map(x => ({ text: x, value: x })); }
    sexualityMenuItems() { return this._sexualities.map(x => ({ text: x, value: x })); }
    pronounMenuItems()   { return this._pronouns.map(x => ({ text: x, value: x })); }

    _norm(s) { return String(s || '').trim(); }
    _removeOne(list, item) {
      const needle = this._norm(item).toLowerCase();
      const i = list.findIndex(x => this._norm(x).toLowerCase() === needle);
      if (i !== -1) list.splice(i, 1);
    }
    _csv(list) { return list.join(', '); }

    setGender(args)    { this._selGenders = [ this._norm(args.G) ]; }
    addGender(args)    { this._selGenders.push(this._norm(args.G)); }
    removeGender(args) { this._removeOne(this._selGenders, args.G); }
    getGender()        { return this._csv(this._selGenders); }
    
    setSexuality(args)    { this._selSexualities = [ this._norm(args.S) ]; }
    addSexuality(args)    { this._selSexualities.push(this._norm(args.S)); }
    removeSexuality(args) { this._removeOne(this._selSexualities, args.S); }
    getSexuality()        { return this._csv(this._selSexualities); }

    setPronouns(args)    { this._selPronouns = [ this._norm(args.P) ]; }
    addPronouns(args)    { this._selPronouns.push(this._norm(args.P)); }
    removePronouns(args) { this._removeOne(this._selPronouns, args.P); }
    getPronouns()        { return this._csv(this._selPronouns); }
  }

  Scratch.extensions.register(new LGBTQIAPlusExtension());
})(Scratch);