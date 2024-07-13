// DiscordAuth - Made by NotHouse
// Version 1.2.1
// Get the lastest official release from https://extensions.penguinmod.com/extensions/NotHouse/DiscordAuth.js

function getDataFromObject(data, field) {
  if (data.hasOwnProperty(field)) {
    return data[field];
  } else {
    return "null";
  }
}

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
          text: 'Open authentification window'
        },
        {
          opcode: 'getPrivateCode',
          blockType: Scratch.BlockType.REPORTER,
          text: 'private code'
        },
        {
          opcode: 'isLoggedIn',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is user logged in with valid account?'
        },
        {
          opcode: 'isApiWorking',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is discord auth api working?'
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
          opcode: 'getUserField',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Get [FIELD] from user with private code [PRIVATECODE]',
          arguments: {
            FIELD: {
              type: Scratch.ArgumentType.STRING,
              menu: 'userFields',
              defaultValue: 'id'
            },
            PRIVATECODE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'Private code'
            }
          }
        }
      ],
      menus: {
        userFields: [
          {text: 'ID', value: 'id'},
          {text: 'Username', value: 'username'},
          {text: 'Avatar', value: 'avatar'},
          {text: 'Discriminator', value: 'discriminator'},
          {text: 'Public Flags', value: 'public_flags'},
          {text: 'Premium Type', value: 'premium_type'},
          {text: 'Flags', value: 'flags'},
          {text: 'Banner', value: 'banner'},
          {text: 'Accent Color', value: 'accent_color'},
          {text: 'Global Name', value: 'global_name'},
          {text: 'Avatar Decoration Data', value: 'avatar_decoration_data'},
          {text: 'Banner Color', value: 'banner_color'},
          {text: 'MFA Enabled', value: 'mfa_enabled'},
          {text: 'Locale', value: 'locale'},
          {text: 'Email', value: 'email'},
          {text: 'Verified', value: 'verified'}
        ]
      }
    };
  }

  async openPopupAndWait() {
    const callbackUrlBase64 = btoa("https://studio.penguinmod.com");
    this.popup = await window.open(`https://discordauth.penguinmod.com/verify?callback=${callbackUrlBase64}`, 'PopupWindow', 'width=450,height=700');
    const startTime = Date.now();
    const pollInterval = setInterval(async () => {
        if (!this.popup || this.popup.closed) {
            clearInterval(pollInterval);
            const elapsedTime = Date.now() - startTime;
            if (elapsedTime >= 5000) {
                console.log("Timeout reached, private code not obtained. Aborted. Report bug to NotHouse.");
            }
        } else {
            try {
                const urlParams = new URLSearchParams(this.popup.location.search);
                const privateCode = urlParams.get('privatecode');
                if (privateCode) {
                    this.privateCode = privateCode;
                    clearInterval(pollInterval);
                    this.popup.close();
                } else {
                    console.log("No private code found yet, waiting...");
                }
            } catch (error) {
                console.error("Error occurred while checking for private code:", error);
            }
        }
    }, 1000);
  }

  getPrivateCode() {
    return this.privateCode || "null";
  }
  
  async isLoggedIn() {
	if(!this.privateCode) return false;
    const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${this.privateCode}`;
    try {
        const response = await fetch(apiUrl);
        if (response.status === 200) {
          const data = await response.json();
          if(data.username){
			  return true;
		  } else {
			  return false;
		  }
        } else {
          return false;
        }
    } catch (error) {
        return false;
    }
  }
  
  async isApiWorking() {
    const apiUrl = `https://discordauth.penguinmod.com/`;
    try {
        const response = await fetch(apiUrl);
        if (response.status === 200) {
          return true;
        } else {
          return false;
        }
    } catch (error) {
        return false;
    }
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

  async getUserField(args) {
	if (/\s/.test(args.PRIVATECODE)) {
      return "null"
    }

    const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
    try {
        const response = await fetch(apiUrl);
        if (response.status === 200) {
          const data = await response.json();
          return getDataFromObject(data, args.FIELD) || "null";
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
