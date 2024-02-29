// Made by NotHouse
// Version 1.0.2 [This is a beta version, expect bugs]

class DiscordAuthExtension {
  constructor() {
    this.popup = null;
    this.privateCode = null;
  }

  getInfo() {
    return {
      id: 'discordauth',
      name: 'Discord Auth Extension',
      blocks: [
        {
          opcode: 'openPopupAndWait',
          blockType: Scratch.BlockType.COMMAND,
          text: 'Open authentification window and wait'
        },
        {
          opcode: 'getPrivateCode',
          blockType: Scratch.BlockType.REPORTER,
          text: 'private code'
        },
        {
          opcode: 'getUserObject',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get user object with private code [PRIVATECODE]',
          arguments: {
            PRIVATECODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Private code'
            }
          }
        },
        {
          opcode: 'getUserID',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get user ID with private code [PRIVATECODE]',
          arguments: {
            PRIVATECODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Private code'
            }
          }
        },
        {
          opcode: 'getUsername',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get username with private code [PRIVATECODE]',
          arguments: {
            PRIVATECODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Private code'
            }
          }
        },
        {
          opcode: 'getNickname',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get nickname with private code [PRIVATECODE]',
          arguments: {
            PRIVATECODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Private code'
            }
          }
        }
      ]
    };
  }

  openPopupAndWait() {
    return new Promise((resolve, reject) => {
      const callbackUrlBase64 = btoa(window.location.href);
      this.popup = window.open(`https://discordauth.penguinmod.com/verify?callback=${callbackUrlBase64}`, 'PopupWindow', 'width=450,height=700');
      const pollInterval = setInterval(()=> {
        if (!this.popup || this.popup.closed) {
          clearInterval(pollInterval);
          resolve();
        } else {
          try {
            const urlParams = new URLSearchParams(this.popup.location.search);
            const privateCode = urlParams.get('privatecode');
            if (privateCode) {
              this.privateCode = privateCode;
              clearInterval(pollInterval);
              this.popup.close();
              resolve();
            }
          } catch (error) {resolve();}
        }
      }, 1000);
    });
  }

  getPrivateCode() {
    return this.privateCode || "null";
  }

  async getUserObject(args) {
      if (/\s/.test(args.PRIVATECODE)) {
        return "null"
      }

      const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
      try {
          const response = await fetch(apiUrl);
          if (response.status === 200) {
              return await response.text();
          } else {
              return "null";
          }
      } catch (error) {
          console.error('Error:', error);
          return "null";
      }
  }

  async getUserID(args) {
    if (/\s/.test(args.PRIVATECODE)) {
      return "null"
    }

    const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
    try {
        const response = await fetch(apiUrl);
        if (response.status === 200) {
          const data = await response.json();
          return data.id;
        } else {
          return "null";
        }
    } catch (error) {
        console.error('Error:', error);
        return "null";
    }
  }

  async getUsername(args) {
    if (/\s/.test(args.PRIVATECODE)) {
      return "null"
    }

    const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
    try {
        const response = await fetch(apiUrl);
        if (response.status === 200) {
          const data = await response.json();
          return data.username;
        } else {
          return "null";
        }
    } catch (error) {
        console.error('Error:', error);
        return "null";
    }
  }

  async getNickname(args) {
    if (/\s/.test(args.PRIVATECODE)) {
      return "null"
    }

    const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
    try {
        const response = await fetch(apiUrl);
        if (response.status === 200) {
          const data = await response.json();
          return data.global_name;
        } else {
          return "null";
        }
    } catch (error) {
        console.error('Error:', error);
        return "null";
    }
  }

}

Scratch.extensions.register(new DiscordAuthExtension());
