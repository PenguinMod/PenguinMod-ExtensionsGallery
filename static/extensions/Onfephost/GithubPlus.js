(function (Scratch) {
  let lastStatus = "", encodeMode = true;
  let dangerousBlocksHidden = false;
  // Kullanıcı tarafından set edilen token (otomatik görünmez, fakat kullanıcı setToken ile koyduğunu bilir)
  let authToken = null;

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
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "README.md" },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: "repository" },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" }
            }
          },
          {
            opcode: "getStatus",
            blockType: Scratch.BlockType.REPORTER,
            text: "recent file status"
          },
          {
            opcode: "toggleEncode",
            blockType: Scratch.BlockType.COMMAND,
            text: "toggle file encoding [TYPE]",
            arguments: { TYPE: { type: Scratch.ArgumentType.STRING, menu: "TOGGLE" } }
          },
          ...(dangerousBlocksHidden ? ["---"] : []),
          { blockType: Scratch.BlockType.LABEL, text: "File Control", hideFromPalette: dangerousBlocksHidden },

          // Buton: tehlikeli blokları göster
          {
            blockType: Scratch.BlockType.BUTTON,
            hideFromPalette: !dangerousBlocksHidden,
            func: "showDangerousBlocks",
            text: Scratch.translate("Show Potentially Dangerous Blocks")
          },

          // ARTIK create/edit/delete blokları TOKEN argümanı istemez;
          // bunlar dahili authToken'ı kullanır. Kullanıcı önce setToken ile token koymalıdır.
          {
            hideFromPalette: dangerousBlocksHidden,
            opcode: "createFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "create file [FILE] with content [CONTENT] in repository [REPO] of user [NAME] (uses stored token)",
            arguments: {
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "newFile.txt" },
              CONTENT: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, world!" },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: "repository" },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" }
            }
          },
          {
            hideFromPalette: dangerousBlocksHidden,
            opcode: "editFileContent",
            blockType: Scratch.BlockType.COMMAND,
            text: "edit content of file [FILE] in repository [REPO] of user [NAME] to [CONTENT] (uses stored token)",
            arguments: {
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "newFile.txt" },
              CONTENT: { type: Scratch.ArgumentType.STRING, defaultValue: "Hello, world!" },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: "repository" },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" }
            }
          },
          {
            hideFromPalette: dangerousBlocksHidden,
            opcode: "deleteFile",
            blockType: Scratch.BlockType.COMMAND,
            text: "delete file [FILE] from repository [REPO] of user [NAME] (uses stored token)",
            arguments: {
              FILE: { type: Scratch.ArgumentType.STRING, defaultValue: "newFile.txt" },
              REPO: { type: Scratch.ArgumentType.STRING, defaultValue: "repository" },
              NAME: { type: Scratch.ArgumentType.STRING, defaultValue: "username" }
            }
          },

          // Yeni eklenen bloklar: token ayarla / temizle (kullanıcının açıkça çalıştırdığı komutlar)
          { blockType: Scratch.BlockType.LABEL, text: "Token Management" },
          {
            opcode: "setToken",
            blockType: Scratch.BlockType.COMMAND,
            text: "set GitHub token [TOKEN]",
            arguments: {
              TOKEN: { type: Scratch.ArgumentType.STRING, defaultValue: "YOUR_GITHUB_TOKEN" }
            }
          },
          {
            opcode: "clearToken",
            blockType: Scratch.BlockType.COMMAND,
            text: "clear stored GitHub token"
          },

        ],
        menus: { TOGGLE: ["on", "off"] }
      };
    }

    showDangerousBlocks() {
      const confirmationText = "I understand these blocks could compromise my account";
      ScratchBlocks.prompt(
        `WARNING: Anyone who has access to your GitHub token has control of your GitHub account. Depending on the access you gave your token, anyone can perform actions that can be used in a malicious way as if they were you. Never share your token in a public project. To reveal these blocks, type: '${confirmationText}'`,
        "",
        (answer) => {
          if (answer.toLowerCase() !== confirmationText.toLowerCase()) {
            if (answer) alert("Prompt answered incorrectly!");
            return;
          }
          dangerousBlocksHidden = false;
          Scratch.vm.extensionManager.refreshBlocks("gitpenguin");
        },
        "Danger Notice", "broadcast_msg"
      );
    }

    // --------- GET File Contents (data: URL döndürüyor) ----------
    async getFileContents({ FILE, REPO, NAME }) {
      const apiUrl = `https://api.github.com/repos/${NAME}/${REPO}/contents/${FILE}`;
      const response = await Scratch.fetch(apiUrl);
      const data = await response.json();
      lastStatus = response.status;
      if (response.ok) {
        let mime = "application/octet-stream";
        const ext = (FILE.split('.').pop() || "").toLowerCase();

        const mimeTypes = {
          "txt": "text/plain", "md": "text/markdown", "json": "application/json",
          "html": "text/html", "htm": "text/html", "css": "text/css",
          "js": "application/javascript", "xml": "application/xml",
          "csv": "text/csv", "tsv": "text/tab-separated-values",

          "png": "image/png", "jpg": "image/jpeg", "jpeg": "image/jpeg",
          "gif": "image/gif", "bmp": "image/bmp", "webp": "image/webp",
          "svg": "image/svg+xml", "ico": "image/x-icon",

          "mp3": "audio/mpeg", "wav": "audio/wav", "ogg": "audio/ogg",
          "m4a": "audio/mp4", "flac": "audio/flac", "aac": "audio/aac",

          "mp4": "video/mp4", "webm": "video/webm", "ogv": "video/ogg",
          "mov": "video/quicktime", "avi": "video/x-msvideo", "mkv": "video/x-matroska",

          "pdf": "application/pdf",
          "doc": "application/msword",
          "docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
          "ppt": "application/vnd.ms-powerpoint",
          "pptx": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
          "xls": "application/vnd.ms-excel",
          "xlsx": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",

          "zip": "application/zip", "rar": "application/vnd.rar",
          "7z": "application/x-7z-compressed", "tar": "application/x-tar",
          "gz": "application/gzip"
        };

        if (mimeTypes[ext]) mime = mimeTypes[ext];

        return `data:${mime};base64,${data.content}`;
      } else {
        return '';
      }
    }

    // --------- TOKEN yönetimi (kullanıcı tarafından açıkça çağrılır) ----------
    setToken(args) {
      // Kullanıcı burada açıkça token koymuş oluyor
      authToken = args.TOKEN ? String(args.TOKEN).trim() : null;
      if (authToken) {
        alert("GitHub token stored for this session. Do not share your project with others if it contains the token.");
      } else {
        alert("No token set.");
      }
    }

    clearToken() {
      authToken = null;
      alert("Stored GitHub token cleared.");
    }

    // --------- Helper: get auth header (uyarıyla) ----------
    _getAuthHeader() {
      if (!authToken) {
        // Kullanıcıya token olmadığı uyarısı göster
        alert("No stored GitHub token found. Please run 'set GitHub token [TOKEN]' before using create/edit/delete blocks.");
        return null;
      }
      return { 'Authorization': `token ${authToken}` };
    }

    // --------- create/edit/delete kullanarak GitHub ile işlem  ----------
    async createFile({ FILE, CONTENT, REPO, NAME }) {
      const apiUrl = `https://api.github.com/repos/${NAME}/${REPO}/contents/${FILE}`;
      const authHeader = this._getAuthHeader();
      if (!authHeader) return;
      const requestBody = JSON.stringify({
        message: `Create ${FILE}`,
        content: encodeMode ? btoa(CONTENT) : CONTENT
      });
      const response = await Scratch.fetch(apiUrl, {
        method: 'PUT',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeader),
        body: requestBody
      });
      lastStatus = response.status;
      if (!response.ok) {
        const err = await response.text().catch(()=>null);
        alert("Create failed: " + (err || response.status));
      }
    }

    async editFileContent({ FILE, CONTENT, REPO, NAME }) {
      const apiUrl = `https://api.github.com/repos/${NAME}/${REPO}/contents/${FILE}`;
      const authHeader = this._getAuthHeader();
      if (!authHeader) return;
      const getResponse = await Scratch.fetch(apiUrl, { headers: authHeader });
      lastStatus = getResponse.status;
      if (!getResponse.ok) {
        alert("Could not retrieve file to edit. Status: " + getResponse.status);
        return;
      }
      const fileData = await getResponse.json();
      const putResponse = await Scratch.fetch(apiUrl, {
        method: 'PUT',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeader),
        body: JSON.stringify({
          message: `Edit ${FILE}`,
          content: encodeMode ? btoa(CONTENT) : CONTENT,
          sha: fileData.sha
        })
      });
      lastStatus = putResponse.status;
      if (!putResponse.ok) {
        const err = await putResponse.text().catch(()=>null);
        alert("Edit failed: " + (err || putResponse.status));
      }
    }

    async deleteFile({ FILE, REPO, NAME }) {
      const apiUrl = `https://api.github.com/repos/${NAME}/${REPO}/contents/${FILE}`;
      const authHeader = this._getAuthHeader();
      if (!authHeader) return;
      const getResponse = await Scratch.fetch(apiUrl, { headers: authHeader });
      if (!getResponse.ok) {
        alert("Could not find file to delete. Status: " + getResponse.status);
        return;
      }
      const fileData = await getResponse.json();
      const deleteResponse = await Scratch.fetch(apiUrl, {
        method: 'DELETE',
        headers: Object.assign({ 'Content-Type': 'application/json' }, authHeader),
        body: JSON.stringify({ message: `Delete ${FILE}`, sha: fileData.sha })
      });
      lastStatus = deleteResponse.status;
      if (!deleteResponse.ok) {
        const err = await deleteResponse.text().catch(()=>null);
        alert("Delete failed: " + (err || deleteResponse.status));
      }
    }

    toggleEncode(args) { encodeMode = args.TYPE === "on"; }
    getStatus() { return lastStatus; }
  }

  Scratch.extensions.register(new GitPenguin());
})(Scratch);
