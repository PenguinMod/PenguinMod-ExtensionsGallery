let socket;
let currentevent;
function require(file,callback){
  var head=document.getElementsByTagName("head")[0];
  var script=document.createElement('script');
  script.src=file;
  script.type='text/javascript';
  //real browsers
  script.onload=callback;
  //Internet explorer
  script.onreadystatechange = function() {
      if (this.readyState == 'complete') {
          callback();
      }
  }
  head.appendChild(script);
}
if (!Scratch.extensions.unsandboxed) {
  throw new Error('This extension must run unsandboxed');
}

require("https://cdnjs.cloudflare.com/ajax/libs/socket.io/4.7.2/socket.io.js")

function listen(){
  socket.onAny((event, ...args) => {
    currentevent = {
      event: event,
      args: args
    }
    console.log(`got ${event}, ${args}`);
    Scratch.vm.runtime.startHats('socketio_onEvent');
  });
};
class SocketIO {
    getInfo() {
      return {
        id: 'giganttechsocketio',
        name: 'Socket.IO',
        blocks: [
          {
            opcode: 'connect',
            text: 'Connect to Socket.IO server [URL]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              URL: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "http://localhost:3000",
              }
            }
          },
          {
            opcode: 'emit',
            text: 'Send event ID: [ID] Arguments: [ARGS]',
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              ID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "hello",
              },
              ARGS: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "world",
              }
            }
          },
          {
            opcode: 'eventID',
            text: 'Event ID',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
            }
          },
          {
            opcode: 'eventARGS',
            text: 'Event Arguments',
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
            }
          },
          {
            opcode: 'disconnect',
            text: 'Disconnect from the current Socket.IO connection',
            blockType: Scratch.BlockType.COMMAND
          },
          {
            blockType: Scratch.BlockType.EVENT,
            opcode: 'onEvent',
            text: 'On Socket.IO event',
            isEdgeActivated: false,
            arguments: {
              KEY: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "test"
              }
            }
          }
        ]
      };
    } 
    connect (args) {
      return new Promise((resolve, reject) => {
        socket = io.connect(args.URL);
        socket.on('connect', function() {
          listen();
          resolve();
        });
      });
    }
    disconnect () {
      return new Promise((resolve, reject) => {
          socket.disconnect();
          resolve();
      });
    }
    eventID () {
      if(!currentevent) return "No Event";
      return currentevent.event;
    }
    eventARGS () {
      if(!currentevent) return "No Event";
      return currentevent.args;
    }
    emit(args) {
      return new Promise((resolve, reject) => {
        socket.emit(args.ID, args.ARGS);
        resolve();
      });
    }
  }
  Scratch.extensions.register(new SocketIO());
