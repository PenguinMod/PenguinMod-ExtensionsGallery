(async function (Scratch) {
  let socket = null;

  let serverURL = "";
  let myId = "";

  let players = {};        // id -> player data
  let playerList = [];     // array of IDs
  let sharedVars = {};     // global shared variables
  let lobbies = {};        // lobby storage (optional)

  let lastMsg = "";
  let lastSender = "";

  let currentLobbyName = "";
  
  class MultiplayerCore {
    getInfo() {
      return {
        id: "multiplayercore",
        name: "Multiplayer Core",
        color1: "#0000FF",
        blocks: [
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Server"
          },
          {
            opcode: "setServer",
            text: "set multiplayer server to [URL]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "wss://example.com"
              }
            }
          },
          {
            opcode: "connect",
            text: "connect to server",
            blockType: Scratch.BlockType.COMMAND
          },
          {
            opcode: "disconnect",
            text: "disconnect from server",
            blockType: Scratch.BlockType.COMMAND
          },
          {
            opcode: "connectionStatus",
            text: "server connection status",
            blockType: Scratch.BlockType.REPORTER
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Lobby"
          },
          {
            opcode: "joinLobby",
            text: "join lobby [name]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "main"
              }
            }
          },
          {
            opcode: "leaveLobby",
            text: "leave lobby",
            blockType: Scratch.BlockType.COMMAND
          },
          {
            opcode: "currentLobby",
            text: "current lobby",
            blockType: Scratch.BlockType.REPORTER
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Players"
          },
          {
            opcode: "playerId",
            text: "my player ID",
            blockType: Scratch.BlockType.REPORTER
          },
          {
            opcode: "allPlayers",
            text: "all players",
            blockType: Scratch.BlockType.REPORTER
          },
          {
            opcode: "playerCount",
            text: "player count",
            blockType: Scratch.BlockType.REPORTER
          },
          {
            opcode: "isPlayerConnected",
            text: "player [id] is connected?",
            blockType: Scratch.BlockType.BOOLEAN,
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "player1"
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Messaging"
          },
          {
            opcode: "sendMessage",
            text: "send message [msg]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              msg: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hello"
              }
            }
          },
          {
            opcode: "sendToPlayer",
            text: "send message [msg] to player [id]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              msg: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hi"
              },
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "player1"
              }
            }
          },
          {
            opcode: "lastMessage",
            text: "last received message",
            blockType: Scratch.BlockType.REPORTER
          },
          {
            opcode: "lastSender",
            text: "last message sender",
            blockType: Scratch.BlockType.REPORTER
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Sync"
          },
          {
            opcode: "setSharedVar",
            text: "set shared variable [name] to [value]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "score"
              },
              value: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "0"
              }
            }
          },
          {
            opcode: "getSharedVar",
            text: "shared variable [name]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "score"
              }
            }
          },
          {
            opcode: "onSharedVarChange",
            text: "when shared variable [name] changes",
            blockType: Scratch.BlockType.HAT,
            arguments: {
              name: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "score"
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Movement"
          },
          {
            opcode: "setPlayerPos",
            text: "set my position to x: [x] y: [y]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              x: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              },
              y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0
              }
            }
          },
          {
            opcode: "getPlayerX",
            text: "x position of player [id]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "player1"
              }
            }
          },
          {
            opcode: "getPlayerY",
            text: "y position of player [id]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              id: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "player1"
              }
            }
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "Events"
          },
          {
            opcode: "onPlayerJoin",
            text: "when player joins",
            blockType: Scratch.BlockType.HAT
          },
          {
            opcode: "onPlayerLeave",
            text: "when player leaves",
            blockType: Scratch.BlockType.HAT
          },
          {
            opcode: "onMessage",
            text: "when message received",
            blockType: Scratch.BlockType.HAT
          },
          {
            opcode: "onConnect",
            text: "when connected to server",
            blockType: Scratch.BlockType.HAT
          },
          {
            opcode: "onDisconnect",
            text: "when disconnected from server",
            blockType: Scratch.BlockType.HAT
          }
        ]
      }
    }

    // --- Server ---
    setServer(args) {
      this.serverURL = args.URL;
    }

    connect() {
      if (!this.serverURL) return;

      this.socket = new WebSocket(this.serverURL);

      this.socket.onopen = () => {};

      this.socket.onclose = () => {};

      this.socket.onmessage = (event) => {
        let data;
        try {
          data = JSON.parse(event.data);
        } catch {
          return;
        }

        if (data.type === "id") {
          this.myId = data.id;
        }

        if (data.type === "players") {
          this.players = data.players;
        }

        if (data.type === "message") {
          this.lastMsg = data.message;
          this.lastSender = data.sender;
        }

        if (data.type === "sharedVar") {
          this.sharedVars[data.name] = data.value;
        }

        if (data.type === "position") {
          const id = data.id;
          this.sharedVars[`pos_${id}_x`] = data.x;
          this.sharedVars[`pos_${id}_y`] = data.y;
        }
      };
    }

    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }

    connectionStatus() {
      if (!this.socket) return "disconnected";
      return this.socket.readyState === 1 ? "connected" : "connecting";
    }

    // --- Lobby ---
    joinLobby(args) {
      const name = args.name;
      this.currentLobbyName = name;
      this.socket?.send(JSON.stringify({ type: "joinLobby", name }));
    }

    leaveLobby() {
      this.socket?.send(JSON.stringify({ type: "leaveLobby" }));
      this.currentLobbyName = "";
    }

    currentLobby() {
      return this.currentLobbyName;
    }

    // --- Players ---
    playerId() {
      return this.myId;
    }

    allPlayers() {
      return JSON.stringify(this.players);
    }

    playerCount() {
      return this.players.length;
    }

    isPlayerConnected(args) {
      const id = args.id;
      return this.players.includes(id);
    }

    // --- Messaging ---
    sendMessage(args) {
      const msg = args.msg;
      this.socket?.send(JSON.stringify({
        type: "message",
        message: msg
      }));
    }

    sendToPlayer(args) {
      const msg = args.msg;
      const id = args.id;
      this.socket?.send(JSON.stringify({
        type: "direct",
        message: msg,
        id
      }));
    }

    lastMessage() {
      return this.lastMsg;
    }

    lastSender() {
      return this.lastSender;
    }

    // --- Sync ---
    setSharedVar(args) {
      const name = args.name;
      const value = args.value;

      this.sharedVars[name] = value;

      this.socket?.send(JSON.stringify({
        type: "sharedVar",
        name,
        value
      }));
    }

    getSharedVar(args) {
      const name = args.name;
      return this.sharedVars[name] ?? "";
    }

    // --- Movement ---
    setPlayerPos(args) {
      const x = args.x;
      const y = args.y;

      this.socket?.send(JSON.stringify({
        type: "position",
        x,
        y
      }));
    }

    getPlayerX(args) {
      const id = args.id;
      return this.sharedVars[`pos_${id}_x`] ?? 0;
    }

    getPlayerY(args) {
      const id = args.id;
      return this.sharedVars[`pos_${id}_y`] ?? 0;
    }

    // --- Events (hat blocks) ---
    onPlayerJoin() {}
    onPlayerLeave() {}
    onMessage() {}
    onConnect() {}
    onDisconnect() {}
  }
  
  Scratch.extensions.register(new MultiplayerCore());
})(Scratch);
