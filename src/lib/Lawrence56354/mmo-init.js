javascript
(function(Scratch) {
    'use strict';

    // Ensure the extension runs unsandboxed to allow internet/network access
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('This MMO extension must be run unsandboxed!');
    }

    class MMOExtension {
        getInfo() {
            return {
                id: 'mmoInitializer',
                name: 'MMO Engine',
                color1: '#4a90e2', // Theme color for your blocks
                blocks: [
                    {
                        opcode: 'connectMMO',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'connect to MMO server [SERVER_URL] with username [USER]',
                        arguments: {
                            SERVER_URL: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'wss://echo.websocket.org'
                            },
                            USER: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'player123'
                            }
                        }
                    }
                ]
            };
        }

        // This function executes when your single block runs
        connectMMO(args) {
            const serverUrl = args.SERVER_URL;
            const username = args.USER;

            console.log(`Connecting ${username} to server: ${serverUrl}`);
            
            // Example WebSocket initialization code
            try {
                const socket = new WebSocket(serverUrl);
                
                socket.onopen = () => {
                    console.log('Successfully connected to the MMO network!');
                    socket.send(JSON.stringify({ type: 'join', player: username }));
                };

                socket.onerror = (error) => {
                    console.error('MMO Connection Error:', error);
                };
            } catch (e) {
                console.error('Failed to create socket connection:', e);
            }
        }
    }

    // Register your extension into PenguinMod
    Scratch.extensions.register(new MMOExtension());
})(Scratch);
