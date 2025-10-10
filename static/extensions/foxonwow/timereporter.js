class foxonwowTimeExtension {
  getInfo() {
    return {
      id: 'foxonwowtimeExtension',
      name: 'Time Reporter',
      color1: '#ffd500',
      color2: '#dde000',
      blocks: [
        {
          opcode: 'year',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Current Year',
        },
        {
          opcode: 'leapyear',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Leap year?',
        },
        {
          opcode: 'getTime',
          blockType: Scratch.BlockType.REPORTER,
          text: 'current [THING]',
          arguments: {
            THING: {
              type: Scratch.ArgumentType.STRING,
              menu: 'timeOptions',
              defaultValue: 'full time'
            }
          }
        }
      ],
      menus: {
        timeOptions: {
          acceptReporters: true,
          items: ['full time', 'time only', 'date and time', 'hours', 'minutes', 'seconds']
        }
      }
    };
  }

  year() {
    return new Date().getFullYear();
  }

  leapyear() {
    const year = new Date().getFullYear();
    return (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0));
  }

  getTime(args) {
    const now = new Date();
    switch (args.THING) {
      case 'full time':
        return now.toString();
      case 'time only':
        return now.toLocaleTimeString();
      case 'date and time':
        return now.toLocaleString();
      case 'hours':
        return now.getHours();
      case 'minutes':
        return now.getMinutes();
      case 'seconds':
        return now.getSeconds();
      default:
        return 'Invalid option';
    }
  }
}

Scratch.extensions.register(new foxonwowTimeExtension());
