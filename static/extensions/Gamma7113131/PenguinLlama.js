/*
@Under MIT LICENSE (C)
@Version 1.0
@Created by gamma7113131
@Description: A Scratch extension that allows users to ask an AI for responses based on their input.
*/

(function (Scratch) {
  "use strict";

  class PenguinLlama {
    getInfo() {
      return {
        id: 'gammaPenguinLlama', // Updated ID to include username
        name: 'PenguinLlama',
        color1: '#07f290',
        color2: '#1ee894',
        blocks: [
          {
            opcode: 'getAIResponse',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Ask AI: [MESSAGE]', // Prompt for user input
            disableMonitor: true, // Disable monitor for this block
            arguments: {
              MESSAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hi" // Default message
              },
            }
          },
        ],
      };
    }

    getAIResponse(args) {
      const message = encodeURIComponent(args.MESSAGE); // Encode the user's message for URL
      const apiUrl = `https://api4gamma.pythonanywhere.com/gammabot/${message}/api/Gamma-AI-34fe94fc-1986-4183-ab08-537b58c7c9d8`;
      const proxyUrl = `https://cors-anywhere.herokuapp.com/`; // Alternative proxy to bypass CORS issues

      return fetch(proxyUrl + apiUrl) // Fetch the AI response
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json(); // Parse the JSON response
        })
        .then(data => {
          return data.response; // Return the AI response to the Scratch environment
        })
        .catch(error => `Error: ${error.message}`); // Return error message if there's a fetch error
    }
  }

  Scratch.extensions.register(new PenguinLlama()); // Register the extension
})(Scratch);
