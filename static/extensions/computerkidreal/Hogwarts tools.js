(function(Scratch) {
  'use strict';

  // Check if we are unsandboxed - essential for some of the fancier stuff
  if (!Scratch.extensions.unsandboxed) {
    throw new Error('This extension must run unsandboxed to access all features.');
  }

  /**
   * Wizarding World Extension
   * Created by a fan, for the fans! 
   * Note: I'm currently on Book 5, so no spoilers for 6 or 7 please!!
   */
  class WizardExtension {
    constructor() {
      // Starting everyone at zero points. (Slytherin's probably cheating already though...)
      this.housePoints = {
        'Gryffindor': 0,
        'Hufflepuff': 0,
        'Ravenclaw': 0,
        'Slytherin': 0
      };
      
      this.apiKey = ""; // Internal use
    }

    getInfo() {
      return {
        id: 'hpWizardExtension',
        name: 'Wizarding World',
        color1: '#740001', // Gryffindor Red
        color2: '#D3A625', // Gryffindor Gold
        blocks: [
          // --- HOUSE POINT SYSTEM ---
          {
            opcode: 'addPoints',
            blockType: Scratch.BlockType.COMMAND,
            text: 'give [AMOUNT] points to [HOUSE]',
            arguments: {
              AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' }
            }
          },
          {
            opcode: 'takePoints',
            blockType: Scratch.BlockType.COMMAND,
            text: 'deduct [AMOUNT] points from [HOUSE]',
            arguments: {
              AMOUNT: { type: Scratch.ArgumentType.NUMBER, defaultValue: 10 },
              HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' }
            }
          },
          {
            opcode: 'resetPoints',
            blockType: Scratch.BlockType.COMMAND,
            text: 'reset the house cup'
          },
          {
            opcode: 'getTotalPoints',
            blockType: Scratch.BlockType.REPORTER,
            text: '[HOUSE] score',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getWinningHouse',
            blockType: Scratch.BlockType.REPORTER,
            text: 'who is winning?'
          },

          "--- SCHOOL LORE ---",
          {
            opcode: 'getCommonRoom',
            blockType: Scratch.BlockType.REPORTER,
            text: 'common room of [HOUSE]',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getHouseHead',
            blockType: Scratch.BlockType.REPORTER,
            text: 'head of [HOUSE]',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getHouseGhost',
            blockType: Scratch.BlockType.REPORTER,
            text: '[HOUSE] ghost',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getHouseAnimal',
            blockType: Scratch.BlockType.REPORTER,
            text: '[HOUSE] mascot',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getFounder',
            blockType: Scratch.BlockType.REPORTER,
            text: 'founder of [HOUSE]',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getHouseArtifact',
            blockType: Scratch.BlockType.REPORTER,
            text: 'artifact of [HOUSE]',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },

          "--- STUDENT LIFE ---",
          {
            opcode: 'getQuidditchCaptain',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Quidditch Captain of [HOUSE]',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getHouseLocation',
            blockType: Scratch.BlockType.REPORTER,
            text: 'where is [HOUSE] located?',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getFamousAlum',
            blockType: Scratch.BlockType.REPORTER,
            text: 'famous [HOUSE] member',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getDormDetail',
            blockType: Scratch.BlockType.REPORTER,
            text: 'describe [HOUSE] dorms',
            arguments: { HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } }
          },
          {
            opcode: 'getHousePassword',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Password for [HOUSE] (Book [BOOK_NUM])',
            arguments: { 
              BOOK_NUM: { type: Scratch.ArgumentType.NUMBER, menu: 'BOOKS_LITE' },
              HOUSE: { type: Scratch.ArgumentType.STRING, menu: 'HOUSES' } 
            }
          },

          "--- THE FORBIDDEN SECTION ---",
          {
            opcode: 'spoilBook',
            blockType: Scratch.BlockType.REPORTER,
            text: 'SPOILER for Book [BOOK_NUM] (DANGER!)',
            arguments: {
              BOOK_NUM: { type: Scratch.ArgumentType.NUMBER, menu: 'BOOKS' }
            }
          }
        ],
        menus: {
          HOUSES: {
            acceptReporters: true,
            items: ['Gryffindor', 'Hufflepuff', 'Ravenclaw', 'Slytherin']
          },
          BOOKS: {
            acceptReporters: true,
            items: ['1', '2', '3', '4', '5', '6', '7']
          },
          BOOKS_LITE: {
            acceptReporters: true,
            items: ['1', '2', '3', '4', '5']
          }
        }
      };
    }

    // --- Logic Implementation ---

    addPoints(args) {
      const house = args.HOUSE;
      const pts = Number(args.AMOUNT) || 0;
      if (this.housePoints.hasOwnProperty(house)) {
        this.housePoints[house] += pts;
      }
    }

    takePoints(args) {
      const house = args.HOUSE;
      const pts = Number(args.AMOUNT) || 0;
      if (this.housePoints.hasOwnProperty(house)) {
        this.housePoints[house] -= pts;
      }
    }

    resetPoints() {
      // Dumbledore probably just gave 1000 points to Gryffindor anyway...
      this.housePoints = { 'Gryffindor': 0, 'Hufflepuff': 0, 'Ravenclaw': 0, 'Slytherin': 0 };
    }

    getTotalPoints(args) {
      return this.housePoints[args.HOUSE] || 0;
    }

    getWinningHouse() {
      let winner = 'Nobody yet';
      let highscore = -Infinity;
      
      for (let h in this.housePoints) {
        if (this.housePoints[h] > highscore) {
          highscore = this.housePoints[h];
          winner = h;
        }
      }
      return winner;
    }

    getQuidditchCaptain(args) {
      const captains = {
        'Gryffindor': 'Oliver Wood (or Angelina in Book 5!)',
        'Hufflepuff': 'Cedric Diggory',
        'Ravenclaw': 'Roger Davies',
        'Slytherin': 'Marcus Flint'
      };
      return captains[args.HOUSE] || 'IDK... check the book?';
    }

    getHouseLocation(args) {
      const spots = {
        'Gryffindor': 'Up on the 7th Floor behind the Fat Lady',
        'Hufflepuff': 'In the basement near the kitchens (best spot tbh)',
        'Ravenclaw': 'A high tower on the west side',
        'Slytherin': 'The dungeons, right under the lake'
      };
      return spots[args.HOUSE] || 'Somewhere in the castle...';
    }

    getFamousAlum(args) {
      const legends = {
        'Gryffindor': 'Albus Dumbledore',
        'Hufflepuff': 'Newt Scamander',
        'Ravenclaw': 'Luna Lovegood (wait, is she an alum yet? let\'s go with Ollivander)',
        'Slytherin': 'Merlin (yes, really!)'
      };
      return legends[args.HOUSE] || 'A very talented witch or wizard';
    }

    getDormDetail(args) {
      const sleep = {
        'Gryffindor': 'Red hangings and four-poster beds.',
        'Hufflepuff': 'Very cozy, round doors, lots of plants.',
        'Ravenclaw': 'You can hear the wind whistling around the windows.',
        'Slytherin': 'Everything is green and you can see fish through the windows.'
      };
      return sleep[args.HOUSE] || 'Beds and trunks.';
    }

    getHousePassword(args) {
      const book = String(args.BOOK_NUM);
      const house = args.HOUSE;
      
      if (house === 'Ravenclaw') return 'No password, just gotta be smart enough for the riddle.';
      if (house === 'Hufflepuff') return 'Just tap the barrels to the rhythm of Helga Hufflepuff!';

      const passData = {
        'Gryffindor': { '1': 'Caput Draconis', '2': 'Wattlebird', '3': 'Fortuna Major', '4': 'Balderdash', '5': 'Mimbulus Mimbletonia' },
        'Slytherin': { '2': 'Pure-blood' }
      };

      return passData[house]?.[book] || 'Password unknown... you might be stuck outside.';
    }

    // Lore basics
    getCommonRoom(args) { return { 'Gryffindor': 'Gryffindor Tower', 'Hufflepuff': 'The Basement', 'Ravenclaw': 'Ravenclaw Tower', 'Slytherin': 'The Dungeons' }[args.HOUSE]; }
    getHouseHead(args) { return { 'Gryffindor': 'McGonagall', 'Hufflepuff': 'Sprout', 'Ravenclaw': 'Flitwick', 'Slytherin': 'Snape' }[args.HOUSE]; }
    getHouseGhost(args) { return { 'Gryffindor': 'Nearly Headless Nick', 'Hufflepuff': 'Fat Friar', 'Ravenclaw': 'Grey Lady', 'Slytherin': 'Bloody Baron' }[args.HOUSE]; }
    getHouseAnimal(args) { return { 'Gryffindor': 'Lion', 'Hufflepuff': 'Badger', 'Ravenclaw': 'Eagle', 'Slytherin': 'Snake' }[args.HOUSE]; }
    getFounder(args) { return { 'Gryffindor': 'Godric Gryffindor', 'Hufflepuff': 'Helga Hufflepuff', 'Ravenclaw': 'Rowena Ravenclaw', 'Slytherin': 'Salazar Slytherin' }[args.HOUSE]; }
    getHouseArtifact(args) { return { 'Gryffindor': 'Sword', 'Hufflepuff': 'Cup', 'Ravenclaw': 'Diadem', 'Slytherin': 'Locket' }[args.HOUSE]; }

    spoilBook(args) {
      const num = String(args.BOOK_NUM);
      // PLEASE DONT ADD 6 OR 7 SPOILERS HERE I WILL CRY
      const list = {
        '1': 'Quirrell was working for Voldy the whole time!',
        '2': 'Ginny was the one opening the Chamber (not her fault though).',
        '3': 'Scabbers is literally a middle-aged man named Peter.',
        '4': 'Moody was a fake! It was Barty Crouch Jr.',
        '5': 'Sirius is gone... I\'m still not over it.'
      };

      if (num === '6' || num === '7') return "SPOILER SHIELD ON! 🛡️ I haven't read these yet!";
      return list[num] || "Pick a book!";
    }
  }

  // Register it!
  Scratch.extensions.register(new WizardExtension());
})(Scratch);
