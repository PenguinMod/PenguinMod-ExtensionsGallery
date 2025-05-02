// Name: Update File (Direct Access)
// ID: ACatUpdateFile
// Description: Edit/Read files dynamically without prompting to reselect it.
// By: Anonymous_cat1

//  Version 1.1.0

(function (Scratch) {
    'use strict';

    // If running in a sandbox, kill the extension
    if (!Scratch.extensions.unsandboxed) {
        throw new Error(
            'Update File was loaded sandboxed. Update File requires to be loaded unsandboxed to save changes to files.'
        );
    }

    class ACatUpdateFile {
        constructor() {
            this.fileHandle = null;
        }

        getInfo() {
            return {
                id: 'ACatUpdateFile',
                name: 'Update File (Direct Access)',
                color1: '#e8ab1c',
                menuIconURI:
                    'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzNS40Nzc3NCIgaGVpZ2h0PSIzNS40Nzc3NCIgdmlld0JveD0iMCwwLDM1LjQ3Nzc0LDM1LjQ3Nzc0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIyLjI2MTEzLC0xNjIuMjYxMTMpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjIyLjI2MTEzLDE4MGMwLC05Ljc5NjkxIDcuOTQxOTYsLTE3LjczODg3IDE3LjczODg3LC0xNy43Mzg4N2M5Ljc5NjkxLDAgMTcuNzM4ODcsNy45NDE5NiAxNy43Mzg4NywxNy43Mzg4N2MwLDkuNzk2OTEgLTcuOTQxOTcsMTcuNzM4ODcgLTE3LjczODg3LDE3LjczODg3Yy05Ljc5NjkxLDAgLTE3LjczODg3LC03Ljk0MTk2IC0xNy43Mzg4NywtMTcuNzM4ODd6IiBmaWxsPSIjZThhYjFjIi8+PHBhdGggZD0iTTIzOC41NDU2NCwxOTAuMDMxODNjLTAuNDY4NDMsMCAtMC44NDgxNiwtMC40MDkxOSAtMC44NDgxNiwtMC45MTM5NnYtMTQuNDI0NDJjMCwtMC41MDQ3NiAwLjM3OTczLC0wLjkxMzk2IDAuODQ4MTYsLTAuOTEzOTZoMy42NzE2MXY0LjIwNTE4bC0yLjg2OTM3LDAuMDEzNzdsNC40NjU3LDUuNDYyNjFsNC4xNDQ3OCwtNS40NzQzOGwtMi43NTc3NiwtMC4wMDIwMXYtNC4yMDUxOGgzLjc4ODEyYzAuNDY4NDMsMCAwLjg0ODE2LDAuNDA5MTkgMC44NDgxNiwwLjkxMzk2djE0LjQyNDQyYzAsMC41MDQ3NiAtMC4zNzk3MywwLjkxMzk2IC0wLjg0ODE2LDAuOTEzOTZ6IiBmaWxsPSIjZmFmYWZhIi8+PHBhdGggZD0iTTIzMS4wMTEyOCwxODYuMjIwNWMtMC40Njg0MywwIC0wLjg0ODE2LC0wLjQwOTE5IC0wLjg0ODE2LC0wLjkxMzk1di0xNC40MjQ0MmMwLC0wLjUwNDc2IDAuMzc5NzMsLTAuOTEzOTYgMC44NDgxNiwtMC45MTM5NmgxMC40NDMwOWMwLjQ2ODQzLDAgMC44NDgxNiwwLjQwOTE5IDAuODQ4MTYsMC45MTM5NnYyLjA5MjUzaC00LjUwNTIxYy0wLjQ2ODQzLDAgLTAuODQ4MTYsMC40MDkxOSAtMC44NDgxNiwwLjkxMzk2djEyLjMzMTg5eiIgZmlsbD0iI2ZhZmFmYSIvPjwvZz48L2c+PC9zdmc+',
                blockIconURI:
                    'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMy4xOTU4NCIgaGVpZ2h0PSIyMy42NTU1NCIgdmlld0JveD0iMCwwLDIzLjE5NTg0LDIzLjY1NTU0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI4LjY3NjgsLTE2OC4xOTAyNCkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0iI2ZhZmFmYSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMzguNTYsMTkxLjg0NTc4Yy0wLjU1MjI5LDAgLTEsLTAuNDgyNDUgLTEsLTEuMDc3NTh2LTE3LjAwNjc0YzAsLTAuNTk1MTMgMC40NDc3MSwtMS4wNzc1OCAxLC0xLjA3NzU4aDQuMzI4OTJ2NC45NTgwMWwtMy4zODMwNiwwLjAxNjI0bDUuMjY1MTcsNi40NDA1NWw0Ljg4NjgsLTYuNDU0NDJsLTMuMjUxNDcsLTAuMDAyMzd2LTQuOTU4MDFoNC40NjYyOGMwLjU1MjI5LDAgMSwwLjQ4MjQ1IDEsMS4wNzc1OHYxNy4wMDY3NGMwLDAuNTk1MTMgLTAuNDQ3NzEsMS4wNzc1OCAtMSwxLjA3NzU4eiIvPjxwYXRoIGQ9Ik0yMjkuNjc2OCwxODcuMzUyMTNjLTAuNTUyMjksMCAtMSwtMC40ODI0NCAtMSwtMS4wNzc1N3YtMTcuMDA2NzRjMCwtMC41OTUxMyAwLjQ0NzcxLC0xLjA3NzU4IDEsLTEuMDc3NThoMTIuMzEyNjVjMC41NTIyOSwwIDEsMC40ODI0NSAxLDEuMDc3NTh2Mi40NjcxNGgtNS4zMTE3NWMtMC41NTIyOSwwIC0xLDAuNDgyNDUgLTEsMS4wNzc1OHYxNC41Mzk1OXoiLz48L2c+PC9nPjwvc3ZnPg==',
                blocks: [
                    {
                        opcode: 'noUseOPcode',
                        blockType: Scratch.BlockType.LABEL,
                        text: 'File Management'
                    },
                    {
                        opcode: 'setFile',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Set file'
                    },
                    {
                        opcode: 'closeFile',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Close file'
                    },
                    {
                        opcode: 'isFileOpen',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'Is file open?',
                        disableMonitor: true
                    },
                    {
                        opcode: 'checkFileSystemAPI',
                        blockType: Scratch.BlockType.BOOLEAN,
                        text: 'Browser supports Direct Access?',
                        disableMonitor: true
                    },
                    {
                        opcode: 'noUseOPcode',
                        blockType: Scratch.BlockType.LABEL,
                        text: 'File reading'
                    },
                    {
                        opcode: 'getFileContent',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get file content as [FORMAT]',
                        arguments: {
                            FORMAT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FormatMenu',
                                defaultValue: 'Text'
                            }
                        },
                        disableMonitor: true
                    },
                    {
                        opcode: 'getFileMetadata',
                        blockType: Scratch.BlockType.REPORTER,
                        text: 'Get file metadata as JSON',
                        disableMonitor: true
                    },
                    {
                        opcode: 'noUseOPcode',
                        blockType: Scratch.BlockType.LABEL,
                        text: 'File writing (Dangerous!)'
                    },
                    {
                        opcode: 'ACatUpdateFile',
                        blockType: Scratch.BlockType.COMMAND,
                        text: 'Write content to file from [FORMAT] [CONTENT]',
                        arguments: {
                            FORMAT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'FormatMenu',
                                defaultValue: 'Text'
                            },
                            CONTENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: 'Foo, Bar, Baz'
                            }
                        }
                    },
                    {
                        opcode: "updateFile",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "Write content to file from [FORMAT] [CONTENT]",
                        arguments: {
                            FORMAT: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "writeFormatMenu"
                            },
                            CONTENT: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Foo, Bar, Baz"
                            }
                        },
                        hideFromPalette: true,
                    }
                ],
                menus: {
                    FormatMenu: {
                        items: ['Text', 'URI', 'Hex (as array)'],
                        writeFormatMenu: ["Text", "URI/URL"]
                    }
                }
            };
        }

        async checkFileSystemAPI() {
            return 'showOpenFilePicker' in window;
        }

        async isFileOpen() {
            return this.fileHandle !== null;
        }

        async closeFile() {
            if (!this.fileHandle) {
                console.warn('Attempted to close no file');
                return;
            }
            this.fileHandle = null;
        }

        async setFile() {
            const userConfirmed = confirm(`
This project wants to open a file with Direct Access.
(Other files opened with Direct Access will be closed).

This project will be able to edit and read the opened file. 
Projects can corrupt, delete, infect, or upload files. 
DO NOT open files that are important (or back them up)!

Do you wish to continue?`);

            if (!userConfirmed) {
                console.warn('File selection was canceled by the user');
                return;
            }

            try {
                // Show the file picker and get the file handle
                [this.fileHandle] = await window.showOpenFilePicker();
                // Create a writable file handle immediately after selecting the file
                this.writableHandle = await this.fileHandle.createWritable();
            } catch (error) {
                if (error.name === 'AbortError') {
                    this.fileHandle = null;
                    console.warn('File selection was aborted by the user');
                } else if (error.message.includes('File System Access')) {
                    throw new Error('File System Access API is not supported or not available');
                } else {
                    this.fileHandle = null;
                    console.error('Unexpected error:', error.message);
                }
            }
        }

        async updateFile({ FORMAT, CONTENT }) {
            if (FORMAT == "URI/URL") {
                FORMAT = "URI";
            }

            await ACatUpdateFile({ FORMAT, CONTENT });
        }

        async ACatUpdateFile({ FORMAT, CONTENT }) {
            if (!this.fileHandle) {
                console.warn('Attempted to write to no file');
                return;
            }

            try {
                const writable = await this.fileHandle.createWritable();

                if (FORMAT === 'URI/URL') {
                    if (CONTENT.startsWith('data:')) {
                        const [meta, base64Content] = CONTENT.split(',');
                        const content = decodeURIComponent(escape(atob(base64Content)));
                        await writable.write(content);
                    } else {
                        const response = await fetch(CONTENT);
                        if (!response.ok) throw new Error('Failed to fetch content');
                        const content = await response.text();
                        await writable.write(content);
                    }
                } else if (FORMAT === 'Hex (as array)') {
                    const hexArray = JSON.parse(CONTENT);
                    const byteArray = new Uint8Array(
                        hexArray.map(hex => parseInt(hex.replace(/^"|"$/g, ''), 16))
                    );
                    await writable.write(byteArray);
                } else {
                    await writable.write(CONTENT);
                }

                await writable.close();
            } catch (error) {
                console.error('Error writing content to file:', error.message);
            }
        }

        async getFileContent({ FORMAT }) {
            if (!this.fileHandle) {
                console.warn('Attempted to read no file');
                return;
            }

            const file = await this.fileHandle.getFile();
            const text = await file.text();

            if (FORMAT === 'URI') {
                const base64Content = btoa(unescape(encodeURIComponent(text)));
                return `data:${file.type};charset=utf-8;base64,${base64Content}`;
            } else if (FORMAT === 'Hex (as array)') {
                const arrayBuffer = await file.arrayBuffer();
                const byteArray = new Uint8Array(arrayBuffer);
                const hexArray = Array.from(byteArray).map(byte =>
                    `"${byte.toString(16).padStart(2, '0')}"`
                );
                return `[${hexArray}]`;
            } else {
                return text;
            }
        }

        async getFileMetadata() {
            if (!this.fileHandle) {
                console.warn('Attempted to read metadata from no file');
                return;
            }

            const file = await this.fileHandle.getFile();
            const sizeInBytes = file.size;
            const lastModifiedDate = new Date(file.lastModified);

            const formattedDate = `${lastModifiedDate.getFullYear()}-${String(
                lastModifiedDate.getMonth() + 1
            ).padStart(2, '0')}-${String(lastModifiedDate.getDate()).padStart(2, '0')}`;
            const formattedTime = `${String(lastModifiedDate.getHours()).padStart(2, '0')}:${String(
                lastModifiedDate.getMinutes()
            ).padStart(2, '0')}.${String(lastModifiedDate.getSeconds()).padStart(2, '0')}`;

            const metadata = {
                name: file.name,
                bytes: `${sizeInBytes}`,
                type: file.type,
                lastModifiedTime: formattedTime,
                lastModifiedDate: formattedDate
            };

            return JSON.stringify(metadata);
        }
    }

    Scratch.extensions.register(new ACatUpdateFile());
})(Scratch);
