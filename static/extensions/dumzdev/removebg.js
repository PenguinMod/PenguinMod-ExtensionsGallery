// Name: Background Remover
// ID: dumzdevBGRemover
// Description: Removes background from images. 
// By: dumzdev <https://scratch.mit.edu/users/dumzdev/>
// Uses: Kaleido AI
// License: MIT

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Background Remover must run unsandboxed!");

  const menuIconURI =
"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1NS43Njc0OSIgaGVpZ2h0PSI1Ni42NzQyOCIgdmlld0JveD0iMCwwLDU1Ljc2NzQ5LDU2LjY3NDI4Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjEyLjExNjI1LC0xNTEuNjYyODYpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTI2Ny44ODM3NCwxODBjMCwxNS42NTAxNyAtMTIuNDgzOTgsMjguMzM3MTQgLTI3Ljg4Mzc0LDI4LjMzNzE0Yy0xNS4zOTk3NywwIC0yNy44ODM3NSwtMTIuNjg2OTcgLTI3Ljg4Mzc1LC0yOC4zMzcxNGMwLC0xNS42NTAxNyAxMi40ODM5OCwtMjguMzM3MTQgMjcuODgzNzUsLTI4LjMzNzE0YzE1LjM5OTc3LDAgMjcuODgzNzQsMTIuNjg2OTcgMjcuODgzNzQsMjguMzM3MTR6IiBmaWxsLW9wYWNpdHk9IjAuMDMxMzciIGZpbGw9IiNmMmZhZmYiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMTkuMzE5MiwxNzcuMjY0NmMtMC4xNDI4NywtMC4wNzQ0IC0wLjI2MjYzLC0wLjE4NjcgLTAuMzQ2MjgsLTAuMzI0NWMtMC4wODM2NSwtMC4xMzc5IC0wLjEyNzk4LC0wLjI5NjEgLTAuMTI4MTYsLTAuNDU3NWMtMC4wMDAxOCwtMC4xNjE0IDAuMDQzNzksLTAuMzE5NyAwLjEyNzEzLC0wLjQ1NzhjMC4wODMzNCwtMC4xMzggMC4yMDI4NiwtMC4yNTA2IDAuMzQ1NTYsLTAuMzI1M2wyMC4yNzM2MSwtMTAuNjAwMmMwLjEyNjIsLTAuMDY1MiAwLjI2NjIsLTAuMDk5MyAwLjQwODIsLTAuMDk5M2MwLjE0MiwwIDAuMjgyLDAuMDM0MSAwLjQwODIsMC4wOTkzbDIwLjI3NCwxMC42MDAyYzAuMTQzLDAuMDc0NSAwLjI2MjcsMC4xODY4IDAuMzQ2MywwLjMyNDhjMC4wODM2LDAuMTM4IDAuMTI3OCwwLjI5NjMgMC4xMjc4LDAuNDU3OGMwLDAuMTYxNCAtMC4wNDQyLDAuMzE5NyAtMC4xMjc4LDAuNDU3N2MtMC4wODM2LDAuMTM4IC0wLjIwMzMsMC4yNTAzIC0wLjM0NjMsMC4zMjQ4bC0yMC4yNzQsMTAuNjAwMmMtMC4xMjU2LDAuMDY2MiAtMC4yNjU0LDAuMTAwOCAtMC40MDczLDAuMTAwOGMtMC4xNDE5LDAgLTAuMjgxNywtMC4wMzQ2IC0wLjQwNzMsLTAuMTAwOGwtMjAuMjczNjUsLTEwLjYwMDJ6IiBmaWxsPSIjNTQ2MTZjIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjYwLjY4MTI1LDE4Mi43MzM5YzAuMTQyOSwwLjA3NDYgMC4yNjI2LDAuMTg3IDAuMzQ2MiwwLjMyNWMwLjA4MzYsMC4xMzggMC4xMjc4LDAuMjk2NCAwLjEyNzgsMC40NTc4YzAsMC4xNjE0IC0wLjA0NDIsMC4zMTk4IC0wLjEyNzgsMC40NTc4Yy0wLjA4MzYsMC4xMzggLTAuMjAzMywwLjI1MDQgLTAuMzQ2MiwwLjMyNWwtMjAuMjc0MSwxMC41OTk3Yy0wLjEyNTYsMC4wNjYyIC0wLjI2NTQsMC4xMDA4IC0wLjQwNzMsMC4xMDA4Yy0wLjE0MTksMCAtMC4yODE3LC0wLjAzNDYgLTAuNDA3MywtMC4xMDA4bC0yMC4yNzM2LC0xMC41OTk3Yy0wLjE0MzAyLC0wLjA3NDQgLTAuMjYyOSwtMC4xODY4IC0wLjM0NjU4LC0wLjMyNDhjLTAuMDgzNjcsLTAuMTM4MSAtMC4xMjc5MiwtMC4yOTY1IC0wLjEyNzkyLC0wLjQ1OGMwLC0wLjE2MTUgMC4wNDQyNSwtMC4zMTk5IDAuMTI3OTIsLTAuNDU3OWMwLjA4MzY3LC0wLjEzODEgMC4yMDM1NSwtMC4yNTA0IDAuMzQ2NTgsLTAuMzI0OWwzLjM1NDUxLC0xLjc1MzdsMTYuMTEwMTksOC40MjM0YzAuMzc2OCwwLjE5NTYgMC43OTUxLDAuMjk3NCAxLjIxOTUsMC4yOTY4YzAuNDI0NCwtMC4wMDA2IDAuODQyNCwtMC4xMDM2IDEuMjE4NywtMC4zMDAzbDE2LjEwNDQsLTguNDE5MmwzLjM1NSwxLjc1Mzd6IiBmaWxsPSIjYmFjMGM0IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoyNy44ODM3NDUwMDAwMDAwMDU6MjguMzM3MTQwMDAwMDAwMDA1LS0+";

  const blockIconURI =
"data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1NS43Njc0OSIgaGVpZ2h0PSI1Ni42NzQyOCIgdmlld0JveD0iMCwwLDU1Ljc2NzQ5LDU2LjY3NDI4Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjEyLjExNjI1LC0xNTEuNjYyODYpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTI2Ny44ODM3NCwxODBjMCwxNS42NTAxNyAtMTIuNDgzOTgsMjguMzM3MTQgLTI3Ljg4Mzc0LDI4LjMzNzE0Yy0xNS4zOTk3NywwIC0yNy44ODM3NSwtMTIuNjg2OTcgLTI3Ljg4Mzc1LC0yOC4zMzcxNGMwLC0xNS42NTAxNyAxMi40ODM5OCwtMjguMzM3MTQgMjcuODgzNzUsLTI4LjMzNzE0YzE1LjM5OTc3LDAgMjcuODgzNzQsMTIuNjg2OTcgMjcuODgzNzQsMjguMzM3MTR6IiBmaWxsLW9wYWNpdHk9IjAuMDMxMzciIGZpbGw9IiNmMmZhZmYiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yMTkuMzE5MiwxNzcuMjY0NmMtMC4xNDI4NywtMC4wNzQ0IC0wLjI2MjYzLC0wLjE4NjcgLTAuMzQ2MjgsLTAuMzI0NWMtMC4wODM2NSwtMC4xMzc5IC0wLjEyNzk4LC0wLjI5NjEgLTAuMTI4MTYsLTAuNDU3NWMtMC4wMDAxOCwtMC4xNjE0IDAuMDQzNzksLTAuMzE5NyAwLjEyNzEzLC0wLjQ1NzhjMC4wODMzNCwtMC4xMzggMC4yMDI4NiwtMC4yNTA2IDAuMzQ1NTYsLTAuMzI1M2wyMC4yNzM2MSwtMTAuNjAwMmMwLjEyNjIsLTAuMDY1MiAwLjI2NjIsLTAuMDk5MyAwLjQwODIsLTAuMDk5M2MwLjE0MiwwIDAuMjgyLDAuMDM0MSAwLjQwODIsMC4wOTkzbDIwLjI3NCwxMC42MDAyYzAuMTQzLDAuMDc0NSAwLjI2MjcsMC4xODY4IDAuMzQ2MywwLjMyNDhjMC4wODM2LDAuMTM4IDAuMTI3OCwwLjI5NjMgMC4xMjc4LDAuNDU3OGMwLDAuMTYxNCAtMC4wNDQyLDAuMzE5NyAtMC4xMjc4LDAuNDU3N2MtMC4wODM2LDAuMTM4IC0wLjIwMzMsMC4yNTAzIC0wLjM0NjMsMC4zMjQ4bC0yMC4yNzQsMTAuNjAwMmMtMC4xMjU2LDAuMDY2MiAtMC4yNjU0LDAuMTAwOCAtMC40MDczLDAuMTAwOGMtMC4xNDE5LDAgLTAuMjgxNywtMC4wMzQ2IC0wLjQwNzMsLTAuMTAwOGwtMjAuMjczNjUsLTEwLjYwMDJ6IiBmaWxsPSIjNTQ2MTZjIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjYwLjY4MTI1LDE4Mi43MzM5YzAuMTQyOSwwLjA3NDYgMC4yNjI2LDAuMTg3IDAuMzQ2MiwwLjMyNWMwLjA4MzYsMC4xMzggMC4xMjc4LDAuMjk2NCAwLjEyNzgsMC40NTc4YzAsMC4xNjE0IC0wLjA0NDIsMC4zMTk4IC0wLjEyNzgsMC40NTc4Yy0wLjA4MzYsMC4xMzggLTAuMjAzMywwLjI1MDQgLTAuMzQ2MiwwLjMyNWwtMjAuMjc0MSwxMC41OTk3Yy0wLjEyNTYsMC4wNjYyIC0wLjI2NTQsMC4xMDA4IC0wLjQwNzMsMC4xMDA4Yy0wLjE0MTksMCAtMC4yODE3LC0wLjAzNDYgLTAuNDA3MywtMC4xMDA4bC0yMC4yNzM2LC0xMC41OTk3Yy0wLjE0MzAyLC0wLjA3NDQgLTAuMjYyOSwtMC4xODY4IC0wLjM0NjU4LC0wLjMyNDhjLTAuMDgzNjcsLTAuMTM4MSAtMC4xMjc5MiwtMC4yOTY1IC0wLjEyNzkyLC0wLjQ1OGMwLC0wLjE2MTUgMC4wNDQyNSwtMC4zMTk5IDAuMTI3OTIsLTAuNDU3OWMwLjA4MzY3LC0wLjEzODEgMC4yMDM1NSwtMC4yNTA0IDAuMzQ2NTgsLTAuMzI0OWwzLjM1NDUxLC0xLjc1MzdsMTYuMTEwMTksOC40MjM0YzAuMzc2OCwwLjE5NTYgMC43OTUxLDAuMjk3NCAxLjIxOTUsMC4yOTY4YzAuNDI0NCwtMC4wMDA2IDAuODQyNCwtMC4xMDM2IDEuMjE4NywtMC4zMDAzbDE2LjEwNDQsLTguNDE5MmwzLjM1NSwxLjc1Mzd6IiBmaWxsPSIjYmFjMGM0IiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoyNy44ODM3NDUwMDAwMDAwMDU6MjguMzM3MTQwMDAwMDAwMDA1LS0+";

  class dumzdevBGRemover {
    constructor() {
      this.apiKey = '4LjLg3UzLPWtkU2VX9H38hqx'; 
    }
    getInfo() {
      return {
        id: 'dumzdevBGRemover',
        name: 'Background Remover',
        color1: '#FFC536', 
        color2: '#FFD06B', 
        color3: '#FFC536',
        docsURI: 'https://www.remove.bg/api',
        menuIconURI,
        blockIconURI,
        blocks: [
          { blockType: Scratch.BlockType.LABEL, text: 'API Key Must Be Valid to Work' },
          {
            opcode: 'setApiKey',
            blockType: Scratch.BlockType.COMMAND,
            text: 'set API key to [APIKEY]',
            arguments: {
              APIKEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: '4LjLg3UzLPWtkU2VX9H38hqx'
              }
            }
          },
          {
            opcode: 'removeBackground',
            blockType: Scratch.BlockType.REPORTER,
            text: 'remove background from image [IMAGE]',
            arguments: {
              IMAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'data:image/png;base64,...'
              }
            }
          }
        ],
      };
    }

    setApiKey(args) {
      this.apiKey = args.APIKEY;
    }

    async removeBackground(args) {
      const formData = new FormData();
      formData.append('image_file_b64', args.IMAGE.split(',')[1]);
      formData.append('size', 'auto');
      return new Promise((resolve) => {
        Scratch.fetch("https://api.remove.bg/v1.0/removebg", {
          method: "POST",
          headers: { "X-Api-Key": this.apiKey },
          body: formData
        }).then(response => {
          if (!response.ok) {
            return response.json().then(err => {
              resolve(err.errors[0].title);
            });
          }
          return response.blob();
        }).then(blob => {
          const reader = new FileReader();
          reader.onloadend = () => { resolve(reader.result) };
          reader.onerror = () => { resolve("Failed to read the response blob") };
          reader.readAsDataURL(blob);
        }).catch(error => reject(error.message));
      });
    }
  }

  Scratch.extensions.register(new dumzdevBGRemover());
})(Scratch);
