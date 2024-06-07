// OnlineCaptcha, by NotHouse
// Powered via "captcha.penguinmod.com", by NotHouse
// 1.0.1, beta release

class onlinecaptcha {
  constructor() {
    this.captchaKey = null;
  }

  getInfo() {
    return {
      id: 'onlinecaptcha',
      name: 'Online Captcha',
      blocks: [
        {
          opcode: 'openCaptchaPopup',
          blockType: Scratch.BlockType.REPORTER,
          text: 'Open captcha page and get the key'
        },
        {
          opcode: 'isCaptchaSolved',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'Check captcha with key [KEY]',
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'key'
            }
          }
        }
      ]
    };
  }

  async openCaptchaPopup() {

    try {
      const response = await fetch(`https://captcha.penguinmod.com/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'PenguinMod' })
      });

      const data = await response.json();
      if (response.ok) {
        this.captchaKey = data.key;
        window.open(`https://captcha.penguinmod.com/?key=${this.captchaKey}`, 'PopupWindow', 'width=500,height=600');
        return this.captchaKey;
      } else {
        console.error('Failed to create CAPTCHA:', data.error);
        return "null";
      }
    } catch (error) {
      console.error('Error creating CAPTCHA:', error);
      return "null";
    }
  }

  async isCaptchaSolved(args) {
    const key = args.KEY;
    if (!key) return false;

    try {
      const response = await fetch(`https://captcha.penguinmod.com/check`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ key })
      });

      const result = await response.json();
      return result;
    } catch (error) {
      console.error('Error checking CAPTCHA status:', error);
      return false;
    }
  }
}

Scratch.extensions.register(new onlinecaptcha());
