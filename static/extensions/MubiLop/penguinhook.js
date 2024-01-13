// Penguin Hook
// By MubiLop from Ruby Team (https://rubyteam.tech/)
// I didn't see any extension with embed support so yeah i made it.

(function (Scratch) {

    class MubilopPenguinHook {
      embedProperties = {};
  
      getInfo() {
        return {
          id: 'penguinhook',
          name: 'PenguinHook',
          color1: "#02b4e0",
          color2: "#02b4e0",
          color3: "#02b4e0",
          blocks: [
            {
              opcode: 'sendWebhook',
              text: 'send webhook with name [NAME] icon [IMAGEURL] message [MESSAGE] to webhook [WEBHOOK]',
              blockType: Scratch.BlockType.COMMAND,
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'user'
                },
                IMAGEURL: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'https://example.com/image.jpg'
                },
                MESSAGE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'Hello, world!'
                },
                WEBHOOK: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'https://your.webhook.url'
                }
              }
            },
            {
              opcode: 'setHexColor',
              text: 'set hex color to [COLOR]',
              blockType: Scratch.BlockType.COMMAND,
              arguments: {
                COLOR: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: '#000000'
                }
              }
            },
            {
              opcode: 'setName',
              text: 'set name to [NAME]',
              blockType: Scratch.BlockType.COMMAND,
              arguments: {
                NAME: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'Ruby Utils'
                }
              }
            },
            {
              opcode: 'setTitle',
              text: 'set embed title to [TITLE]',
              blockType: Scratch.BlockType.COMMAND,
              arguments: {
                TITLE: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'Title'
                }
              }
            },
            {
              opcode: 'setDescription',
              text: 'set embed description to [DESCRIPTION]',
              blockType: Scratch.BlockType.COMMAND,
              arguments: {
                DESCRIPTION: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'Description'
                }
              }
            },
            {
              opcode: 'setFooter',
              text: 'set embed footer to [FOOTER]',
              blockType: Scratch.BlockType.COMMAND,
              arguments: {
                FOOTER: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'Footer'
                }
              }
            },
            {
              opcode: 'sendWebhookWithEmbed',
              text: 'send webhook with embeds to webhook [WEBHOOK]',
              blockType: Scratch.BlockType.COMMAND,
              arguments: {
                WEBHOOK: {
                  type: Scratch.ArgumentType.STRING,
                  defaultValue: 'https://your.webhook.url'
                }
              }
            },
            {
                blockType: Scratch.BlockType.LABEL,
                text: 'Customizable Section'
            },
            {
                opcode: 'sendjson',
                blockType: Scratch.BlockType.COMMAND,
                text: 'send using json [JSON_DATA] webhook url: [WEBHOOK]',
                arguments: {
                  JSON_DATA: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: '{"content": "Sent with JSON!!","embeds": null,"attachments": []}'
                  },
                  WEBHOOK: {
                    type: Scratch.ArgumentType.STRING,
                    defaultValue: 'https://your.webhook.url'
                  }
                 }
            }
          ]
        };
      }
  
      // New functions for setting individual embed properties
      setTitle(args) {
        this.embedProperties.title = args.TITLE;
      }
  
      setDescription(args) {
        this.embedProperties.description = args.DESCRIPTION;
      }
  
      setFooter(args) {
        this.embedProperties.footer = args.FOOTER;
      }
  
      setHexColor(args) {
        this.embedProperties.hexColor = args.COLOR;
      }
  
      setName(args) {
        this.embedProperties.name = args.NAME;
      }
  
      sendWebhook(args) {
        const name = args.NAME;
        const imageUrl = args.IMAGEURL;
        const message = args.MESSAGE;
        const webhookUrl = args.WEBHOOK;
  
        const payload = {
          username: name,
          avatar_url: imageUrl,
          content: message
        };
  
        return fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (!response.ok) {
            console.error('Webhook request failed:', response.statusText);
            return 'Webhook request failed';
          }
          return 'Webhook sent successfully';
        })
        .catch(error => {
          console.error('Error sending webhook:', error);
          return 'Error sending webhook';
        });
      }
  
      sendWebhookWithEmbed(args) {
        const embed = {};
        const name = {};
  
        if (this.embedProperties.title) {
          embed.title = this.embedProperties.title;
        }
  
        if (this.embedProperties.description) {
          embed.description = this.embedProperties.description;
        }
  
        if (this.embedProperties.footer) {
          embed.footer = { text: this.embedProperties.footer };
        }
  
        if (this.embedProperties.name) {
          name.name = this.embedProperties.name;
        }
  
        const webhookUrl = args.WEBHOOK;
        const payload = {
          embeds: [embed],
          username: name.name,
        };
  
        return fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        })
        .then(response => {
          if (!response.ok) {
            console.error('Webhook request with embeds failed:', response.statusText);
            return 'Webhook request with embeds failed';
          }
          return 'Webhook with embeds sent successfully';
        })
        .catch(error => {
          console.error('Error sending webhook with embeds:', error);
          return 'Error sending webhook with embeds';
        });
      }

      send_json_block(args){
        try {return fetch(args.WEBHOOK, {
              method: "POST",
              headers: {
                'Content-type': 'application/json'
              },
              body: (args.JSON_DATA)
            }).then(res => {
              console.log(res);
            })
        }
      catch(err) {}
      }
    }
  
    Scratch.extensions.register(new MubilopPenguinHook());
})(Scratch);
