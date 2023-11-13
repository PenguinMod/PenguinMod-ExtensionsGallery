// Name: Free Servers
// Id: WAYLIVES
// Description: Here you can find a free server for your projects. And also check whether it is working now or not.
// Created by: WAYLIVES (https://scratch.mit.edu/users/WAYLIVES/)



(function (Scratch) {
  "use strict";

  if (!Scratch.extensions.unsandboxed) {
    throw new Error("Error");
  }

  const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiByeD0iMTAiIGZpbGw9IiNFMjI2NDgiLz4KPHJlY3QgeD0iMjUiIHk9IjI1IiB3aWR0aD0iNTAiIGhlaWdodD0iMjUiIHJ4PSIzIiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjYiLz4KPHJlY3QgeD0iNDciIHk9IjQ4IiB3aWR0aD0iNiIgaGVpZ2h0PSIyNSIgZmlsbD0id2hpdGUiLz4KPHJlY3QgeD0iNzgiIHk9IjY4IiB3aWR0aD0iNiIgaGVpZ2h0PSI1NiIgcng9IjMiIHRyYW5zZm9ybT0icm90YXRlKDkwIDc4IDY4KSIgZmlsbD0id2hpdGUiLz4KPGNpcmNsZSBjeD0iNTAiIGN5PSI3MSIgcj0iNSIgZmlsbD0iI0UyMjY0OCIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLXdpZHRoPSI0Ii8+CjxjaXJjbGUgY3g9IjYyLjUiIGN5PSIzNy41IiByPSI1LjUiIGZpbGw9IndoaXRlIi8+Cjwvc3ZnPgo="; 
  
  const computing = new Map();
  const computed = new Map();

  const pingWebSocket = async (uri) => {
    if (!(await Scratch.canFetch(uri))) {
      return {
        expires: 0,
        value: false,
      };
    }

    let ws;
    try {
      ws = new WebSocket(uri);
    } catch (e) {
      return {
        expires: 0,
        value: false,
      };
    }

    let timeoutId;
    const isUp = await new Promise((resolve) => {
      ws.onopen = () => {
        setTimeout(() => {
          resolve(true);
        }, 2000);
      };
      ws.onclose = () => {
        resolve(false);
      };
      ws.onerror = () => {
        resolve(false);
      };
      timeoutId = setTimeout(() => {
        ws.close();
      }, 5000);
    });

    ws.close();
    clearTimeout(timeoutId);

    return {
      expires: Date.now() + 60000,
      value: isUp,
    };
  };  

  const cachedPingWebSocket = (uri) => {
    const computingEntry = computing.get(uri);
    if (computingEntry) {
      return computingEntry.then((entry) => entry.value);
    }

    const computedEntry = computed.get(uri);
    if (computedEntry && Date.now() < computedEntry.expires) {
      return computedEntry.value;
    }

    const promise = pingWebSocket(uri);
    computing.set(uri, promise);
    return promise.then((entry) => {
      computing.delete(uri);
      computed.set(uri, entry);
      return entry.value;
    });
  };

  
  class lmsmcutils {
    getInfo() {
      return {              
        id: "FreeServers",
        name: "Free Servers",
        color1: "#E22648",
        color2: "#B01D38",
        color3: "#B01D38",
        menuIconURI: menuIconURI,
        
        blocks: [
          
          {
            blockType: "label",
            text: "Is cloud data server up?",
          },          
          
          {
            opcode: "ping",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "Is cloud data server up [SERVER] ?",
            arguments: {
              SERVER: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          
          {
            blockType: "label",
            text: "Free servers:",
          },          
          
          {
            opcode: "one",
            blockType: Scratch.BlockType.REPORTER,
            text: "1 - (wss://clouddata.turbowarp.org)",
          },
          
          {
            opcode: "two",
            blockType: Scratch.BlockType.REPORTER,
            text: "2 - (ws://127.0.0.1:3000/)",
          },
          
          {
            opcode: "three",
            blockType: Scratch.BlockType.REPORTER,
            text: "3 - (wss://cloudlink.mikedev101.cc/0.2.0)",
          },
          
          {
            opcode: "four",
            blockType: Scratch.BlockType.REPORTER,
            text: "4 - (wss://cl4-test.meower.org)",
          },
          
          {
            opcode: "five",
            blockType: Scratch.BlockType.REPORTER,
            text: "5 - (wss://cl4.tnix.dev/)",
          },
          
          {
            opcode: "six",
            blockType: Scratch.BlockType.REPORTER,
            text: "6 - (wss://cl.ssh.surf/)",
          },
          
          {
            opcode: "seven",
            blockType: Scratch.BlockType.REPORTER,
            text: "7 - (wss://cl2.ssh.surf/)",
          },
          
          {
            opcode: "eight",
            blockType: Scratch.BlockType.REPORTER,
            text: "8 - (wss://echoserver.redman13.repl.co)",
          },
          
          "---",
        ],
      };
    }

    ping({ SERVER }) {
      return cachedPingWebSocket(SERVER);
    }

    one() {
      return 'wss://clouddata.turbowarp.org';
    }
    
    two() {
      return 'ws://127.0.0.1:3000/';
    }
    
    three() {
      return 'wss://cloudlink.mikedev101.cc/0.2.0';
    }
    
    four() {
      return 'wss://cl4-test.meower.org';
    }
    
    five() {
      return 'wss://cl4.tnix.dev/';
    }

    six() {
      return 'wss://cl.ssh.surf/';
    }

    seven() {
      return 'wss://cl2.ssh.surf/';
    }

    eight() {
      return 'wss://echoserver.redman13.repl.co';
    }  
  }
  Scratch.extensions.register(new lmsmcutils());
})(Scratch);
