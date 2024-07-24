// --Update File (Direct Access)--
// Edit/Read files dynamically without prompting to reselect it.
// REQUIRES TO BE RAN UNSANDBOXED.
// Created by Anonymous_cat1, revised by GPT-4o-mini model.

(function (Scratch) {
	'use strict';
	// If running in a sandbox, kill the extension
	if (!Scratch.extensions.unsandboxed) {
		throw new Error('Update File was loaded sandboxed. Update File requires to be loaded unsandboxed to save changes to files.');
		return;
	}

	class UpdateFile {
		constructor() {
			// Initialize fileHandle to null
			this.fileHandle = null;
		}

		getInfo() {
			return {
				id: 'anonymouscat1updatefile',
				name: 'Update File (Direct Access)',
				color1: '#e8ab1c',
				menuIconURI: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzNS40Nzc3NCIgaGVpZ2h0PSIzNS40Nzc3NCIgdmlld0JveD0iMCwwLDM1LjQ3Nzc0LDM1LjQ3Nzc0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIyLjI2MTEzLC0xNjIuMjYxMTMpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjIyLjI2MTEzLDE4MGMwLC05Ljc5NjkxIDcuOTQxOTYsLTE3LjczODg3IDE3LjczODg3LC0xNy43Mzg4N2M5Ljc5NjkxLDAgMTcuNzM4ODcsNy45NDE5NiAxNy43Mzg4NywxNy43Mzg4N2MwLDkuNzk2OTEgLTcuOTQxOTcsMTcuNzM4ODcgLTE3LjczODg3LDE3LjczODg3Yy05Ljc5NjkxLDAgLTE3LjczODg3LC03Ljk0MTk2IC0xNy43Mzg4NywtMTcuNzM4ODd6IiBmaWxsPSIjZThhYjFjIi8+PHBhdGggZD0iTTIzOC41NDU2NCwxOTAuMDMxODNjLTAuNDY4NDMsMCAtMC44NDgxNiwtMC40MDkxOSAtMC44NDgxNiwtMC45MTM5NnYtMTQuNDI0NDJjMCwtMC41MDQ3NiAwLjM3OTczLC0wLjkxMzk2IDAuODQ4MTYsLTAuOTEzOTZoMy42NzE2MXY0LjIwNTE4bC0yLjg2OTM3LDAuMDEzNzdsNC40NjU3LDUuNDYyNjFsNC4xNDQ3OCwtNS40NzQzOGwtMi43NTc3NiwtMC4wMDIwMXYtNC4yMDUxOGgzLjc4ODEyYzAuNDY4NDMsMCAwLjg0ODE2LDAuNDA5MTkgMC44NDgxNiwwLjkxMzk2djE0LjQyNDQyYzAsMC41MDQ3NiAtMC4zNzk3MywwLjkxMzk2IC0wLjg0ODE2LDAuOTEzOTZ6IiBmaWxsPSIjZmFmYWZhIi8+PHBhdGggZD0iTTIzMS4wMTEyOCwxODYuMjIwNWMtMC40Njg0MywwIC0wLjg0ODE2LC0wLjQwOTE5IC0wLjg0ODE2LC0wLjkxMzk1di0xNC40MjQ0MmMwLC0wLjUwNDc2IDAuMzc5NzMsLTAuOTEzOTYgMC44NDgxNiwtMC45MTM5NmgxMC40NDMwOWMwLjQ2ODQzLDAgMC44NDgxNiwwLjQwOTE5IDAuODQ4MTYsMC45MTM5NnYyLjA5MjUzaC00LjUwNTIxYy0wLjQ2ODQzLDAgLTAuODQ4MTYsMC40MDkxOSAtMC44NDgxNiwwLjkxMzk2djEyLjMzMTg5eiIgZmlsbD0iI2ZhZmFmYSIvPjwvZz48L2c+PC9zdmc+',
				blockIconURI: 'data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMy4xOTU4NCIgaGVpZ2h0PSIyMy42NTU1NCIgdmlld0JveD0iMCwwLDIzLjE5NTg0LDIzLjY1NTU0Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjI4LjY3NjgsLTE2OC4xOTAyNCkiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0iI2ZhZmFmYSIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0yMzguNTYsMTkxLjg0NTc4Yy0wLjU1MjI5LDAgLTEsLTAuNDgyNDUgLTEsLTEuMDc3NTh2LTE3LjAwNjc0YzAsLTAuNTk1MTMgMC40NDc3MSwtMS4wNzc1OCAxLC0xLjA3NzU4aDQuMzI4OTJ2NC45NTgwMWwtMy4zODMwNiwwLjAxNjI0bDUuMjY1MTcsNi40NDA1NWw0Ljg4NjgsLTYuNDU0NDJsLTMuMjUxNDcsLTAuMDAyMzd2LTQuOTU4MDFoNC40NjYyOGMwLjU1MjI5LDAgMSwwLjQ4MjQ1IDEsMS4wNzc1OHYxNy4wMDY3NGMwLDAuNTk1MTMgLTAuNDQ3NzEsMS4wNzc1OCAtMSwxLjA3NzU4eiIvPjxwYXRoIGQ9Ik0yMjkuNjc2OCwxODcuMzUyMTNjLTAuNTUyMjksMCAtMSwtMC40ODI0NCAtMSwtMS4wNzc1N3YtMTcuMDA2NzRjMCwtMC41OTUxMyAwLjQ0NzcxLC0xLjA3NzU4IDEsLTEuMDc3NThoMTIuMzEyNjVjMC41NTIyOSwwIDEsMC40ODI0NSAxLDEuMDc3NTh2Mi40NjcxNGgtNS4zMTE3NWMtMC41NTIyOSwwIC0xLDAuNDgyNDUgLTEsMS4wNzc1OHYxNC41Mzk1OXoiLz48L2c+PC9nPjwvc3ZnPg==',
				blocks: [{
						// Label
						opcode: 'noUseOPcode',
						blockType: Scratch.BlockType.LABEL,
						text: 'File Management',
					},
					{
						// Block for setting the file using a file picker dialog
						opcode: 'setFile',
						blockType: Scratch.BlockType.COMMAND,
						text: 'Set file',
					},
					{
						// Block for updating the file with new content
						opcode: 'closeFile',
						blockType: Scratch.BlockType.COMMAND,
						text: 'Close file',
					},
					{
						// Block for checking if the browser supports the File System Access API
						opcode: 'checkFileSystemAPI',
						blockType: Scratch.BlockType.BOOLEAN,
						text: 'Browser supports Direct Access?',
						disableMonitor: true,
					},
					{
						// Label
						opcode: 'noUseOPcode',
						blockType: Scratch.BlockType.LABEL,
						text: 'File reading',
					},
					{
						// Block for getting the content of the file
						opcode: 'getFileContent',
						blockType: Scratch.BlockType.REPORTER,
						text: 'Get file content',
						disableMonitor: true
					},
					{
						// Block for getting the content of the file as URI
						opcode: 'getFileContentAsURI',
						blockType: Scratch.BlockType.REPORTER,
						text: 'Get file content as URI',
						disableMonitor: true
					},
					{
						// Block for getting file metadata
						opcode: 'getFileMetadata',
						blockType: Scratch.BlockType.REPORTER,
						text: 'Get file metadata as JSON',
						disableMonitor: true
					},
					{
						// Label
						opcode: 'noUseOPcode',
						blockType: Scratch.BlockType.LABEL,
						text: 'File writing (Dangerous!)',
					},
					{
						// Block for updating the file with new content
						opcode: 'updateFile',
						blockType: Scratch.BlockType.COMMAND,
						text: 'Update file with content [CONTENT]',
						arguments: {
							CONTENT: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'Foo, Bar, Baz',
							}
						}
					},
					{
						// Block for updating the file with new content
						opcode: 'updateFileAsURI',
						blockType: Scratch.BlockType.COMMAND,
						text: 'Update file with content from URI/URL [URI]',
						arguments: {
							URI: {
								type: Scratch.ArgumentType.STRING,
								defaultValue: 'data:text/plain;charset=utf-8;base64,Q3JlYXRlZCBieSBBbm9ueW1vdXNfY2F0MQ==',
							}
						}
					},
				]
			};
		}
		
		async checkFileSystemAPI() {
			// Checks for File System Access
			return 'showOpenFilePicker' in window;
		}

		async closeFile() {
			if (!this.fileHandle) {
				// If no file selected
				console.warn('Attempted to close no file');
				return;
			}
			// Initialize fileHandle to null
			this.fileHandle = null;
		}

		async setFile() {
			try {
				// Open file picker and assign the selected file handle
				[this.fileHandle] = await window.showOpenFilePicker();
			} catch (error) {
				// Handle specific errors
				if (error.name === 'AbortError') {
					console.warn('File selection was aborted by the user');
				} else if (error.message.includes('File System Access')) {
					throw new Error('File System Access API is not supported or not available');
				} else {
					console.error('Unexpected error:', error.message);
				}
			}
		}

		async updateFile({
			CONTENT
		}) {
			if (!this.fileHandle) {
				// If no file selected
				console.warn('Attempted to update no file');
				return;
			}

			// Create a writable stream and write the content to the file
			const writable = await this.fileHandle.createWritable();
			await writable.write(CONTENT);
			// Close to make sure the data is written properly
			await writable.close();
		}

		async getFileContent() {
			if (!this.fileHandle) {
				// If no file selected
				console.warn('Attempted to read no file');
				return;
			}

			// Get the file and read its content as text
			const file = await this.fileHandle.getFile();
			const text = await file.text();

			return text;
		}

		async getFileMetadata() {
			if (!this.fileHandle) {
				// If no file selected
				console.warn('Attempted to read metadata from no file');
				return;
			}

			// Get the file and extract metadata
			const file = await this.fileHandle.getFile();
			const sizeInBytes = file.size;

			// Convert timestamp to readable date
			const lastModifiedDate = new Date(file.lastModified);
			const year = lastModifiedDate.getFullYear();
			const month = String(lastModifiedDate.getMonth() + 1).padStart(2, '0');
			const day = String(lastModifiedDate.getDate()).padStart(2, '0');
			const formattedDate = `${year}-${month}-${day}`;

			// Convert timestamp to readable time
			const hours = String(lastModifiedDate.getHours()).padStart(2, '0');
			const minutes = String(lastModifiedDate.getMinutes()).padStart(2, '0');
			const seconds = String(lastModifiedDate.getSeconds()).padStart(2, '0');
			const formattedTime = `${hours}:${minutes}.${seconds}`;

			// Compile JSON string
			const metadata = {
				name: file.name,
				bytes: `${sizeInBytes}`,
				type: file.type,
				lastModifiedTime: formattedTime,
				lastModifiedDate: formattedDate
			};

			return JSON.stringify(metadata);
		}

		async updateFileAsURI({
			URI
		}) {
			if (!this.fileHandle) {
				// if no file
				console.warn('Attempted to update no file');
				return;
			}

			// Regular expression to validate a basic URI/URL format
			const urlPattern = /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/i;

			// Check if input is a data URI
			if (URI.startsWith('data:')) {
				try {
					// Decode URI
					const [meta, base64Content] = URI.split(',');
					const content = decodeURIComponent(escape(atob(base64Content)));

					// Open file for writing and update it
					const writable = await this.fileHandle.createWritable();
					await writable.write(content);
					await writable.close();

				} catch (error) {
					console.error('Error updating file from data URI:', error.message);
				}
				// If input is an URL
			} else if (urlPattern.test(URI)) {
				try {
					const response = await fetch(URI);
					if (!response.ok) {
						console.error('Failed to fetch content and update file');
					}

					// Load content
					const content = await response.text();

					// Open file for writing and update it
					const writable = await this.fileHandle.createWritable();
					await writable.write(content);
					await writable.close();

				} catch (error) {
					console.error('Error updating file from URI:', error.message);
				}
			} else {
				console.warn('Attempted to write a non URL/URI to file');
			}
		}

		async getFileContentAsURI() {
			if (!this.fileHandle) {
				// if no file
				console.warn('Attempted to read content from no file');
				return;
			}

			// Load data from file as text
			const file = await this.fileHandle.getFile();
			const content = await file.text();

			// Convert content to Base64
			const base64Content = btoa(unescape(encodeURIComponent(content)));

			// Construct data URI
			const dataURI = `data:${file.type};charset=utf-8;base64,${base64Content}`;

			return dataURI;
		}
	}

	// Register the extension with Scratch
	Scratch.extensions.register(new UpdateFile());
})(Scratch);
