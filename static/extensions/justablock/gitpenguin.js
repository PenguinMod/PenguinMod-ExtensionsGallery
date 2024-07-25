(function (Scratch) {
  class GitPenguin {
    getInfo() {
      return {
        id: "gitpenguin",
        name: "GitHub File Extension",
        color1: "#303030",
        color2: "#212121",
        color3: "#212121",
        blocks: [
          { blockType: Scratch.BlockType.LABEL, text: "Get" },
          {
            opcode: "getFileContents",
            blockType: Scratch.BlockType.REPORTER,
            text: "get contents of file [FILE] from repository [REPO] of user [NAME]",
            arguments: {
              FILE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "README.md"
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "repository"
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "username"
              }
            }
          },
          { blockType: Scratch.BlockType.LABEL, text: "File control" },
          {
            opcode: "createFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "create file [FILE] with content [CONTENT] in repository [REPO] of user [NAME] using token [TOKEN]",
            arguments: {
              FILE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "newFile.txt"
              },
              CONTENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello, world!"
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "repository"
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "username"
              },
              TOKEN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "YOUR_GITHUB_TOKEN"
              }
            }
          },
          {
            opcode: "editFileContent",
            blockType: Scratch.BlockType.COMMAND,
            text: "edit content of file [FILE] in repository [REPO] of user [NAME] to [CONTENT] using token [TOKEN]",
            arguments: {
              FILE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "newFile.txt"
              },
              CONTENT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello, world!"
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "repository"
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "username"
              },
              TOKEN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "YOUR_GITHUB_TOKEN"
              }
            }
          },
          { blockType: Scratch.BlockType.LABEL, text: "DANGEROUS" },
          {
            opcode: "deleteFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete file [FILE] from repository [REPO] of user [NAME] using token [TOKEN]",
            arguments: {
              FILE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "newFile.txt"
              },
              REPO: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "repository"
              },
              NAME: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "username"
              },
              TOKEN: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "YOUR_GITHUB_TOKEN"
              }
            }
          }
        ]
      };
    }

    async getFileContents({ FILE, REPO, NAME }) {
      const apiUrl = `https://api.github.com/repos/${NAME}/${REPO}/contents/${FILE}`;
      const response = await Scratch.fetch(apiUrl);
      const data = await response.json();
      if (response.ok) return atob(data.content);
      else return '';
    }

    async createFile({ FILE, CONTENT, REPO, NAME, TOKEN }) {
      const apiUrl = `https://api.github.com/repos/${NAME}/${REPO}/contents/${FILE}`;
      const encodedContent = btoa(CONTENT);
      const requestBody = JSON.stringify({
        message: `Create ${FILE}`,
        content: encodedContent
      });
      const response = await Scratch.fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${TOKEN}`
        },
        body: requestBody
      });
      if (!response.ok) return;
    }

    async editFileContent({ FILE, CONTENT, REPO, NAME, TOKEN }) {
      const apiUrl = `https://api.github.com/repos/${NAME}/${REPO}/contents/${FILE}`;
      const getResponse = await Scratch.fetch(apiUrl, {
        headers: {
          'Authorization': `token ${TOKEN}`
        }
      });
      if (!getResponse.ok) return;
      const fileData = await getResponse.json();
      const encodedContent = btoa(CONTENT);
      const putResponse = await Scratch.fetch(apiUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${TOKEN}`
        },
        body: JSON.stringify({
          message: `Edit ${FILE}`,
          content: encodedContent,
          sha: fileData.sha
        })
      });
      if (!putResponse.ok) return;
    }

    async deleteFile({ FILE, REPO, NAME, TOKEN }) {
      const apiUrl = `https://api.github.com/repos/${NAME}/${REPO}/contents/${FILE}`;
      const getResponse = await Scratch.fetch(apiUrl, {
        headers: {
          'Authorization': `token ${TOKEN}`
        }
      });
      if (!getResponse.ok) return;
      const fileData = await getResponse.json();
      const deleteResponse = await Scratch.fetch(apiUrl, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${TOKEN}`
        },
        body: JSON.stringify({
          message: `Delete ${FILE}`,
          sha: fileData.sha
        })
      });
      if (!deleteResponse.ok) return;
    }
  }
  Scratch.extensions.register(new GitPenguin());
})(Scratch);
