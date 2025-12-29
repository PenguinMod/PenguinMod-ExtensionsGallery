# Pang AI
Hello, this is **Pang AI** created by Seigh_sword Its a really cool AI extension for people who wants to use **AI IN THERE PROJECTS**
as PenguinAI is ~~Broken~~ you can use this, tool and its powered by **[pollinations ai](https://pollinations.ai/)** which is a free AI software for people to
use and make **AI** so, I dont have to pay for the **AI myself** thank you **pollinations ai**

# blocks

| Block | Type | Description |
| :--- | :--- | :--- |
| **AI ready?** | Boolean | Returns true if the extension is loaded and ready to work. |
| **model?** | Boolean | Shows you which Text and Image models are currently selected. |
| **bot?** | Boolean | Returns the name of the first active bot in your list. |
| **memory** | Reporter | Returns the entire chat history of all bots as a JSON string. |
| **create bot named [NAME]** | Command | Starts a new chat history for a bot. Essential for "Memory." |
| **delete bot named [NAME]** | Command | Deletes the chat history for a specific bot. |
| **rename bot [OLD] to [NEW]** | Command | Changes a bot's name without losing its memories. |
| **set text model [MOD]** | Command | Choose your brain: OpenAI, Gemini, DeepSeek-R1, etc. |
| **set image model [MOD]** | Command | Choose your artist: Flux, Turbo, Anime, etc. |
| **prompt [TEXT]** | Reporter | Sends a message to the AI and gets a response. |
| **get url for image [TEXT]** | Reporter | Generates a URL for an image based on your prompt. |
| **attach file url [URL]** | Command | Gives the AI a reference image or any other file URL to look at |
| **set system log [LOG]** | Command | Set the AI's personality (e.g, "You are a cat, which meows"). |
| **set context and prompt** | Reporter | A shortcut to give the AI a persona and ask a question at once. |
| **set temperature [N]** | Command | 0.1 = Serious and Logical. 1.0 = Creative and Chaos |
| **set seed [N]** | Command | Set a number to get the exact same result every time |
| **seed / temperature** | Reporter | Shows your current seed or temperature values |

# about them

 <img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/aiready.svg" width="200" alt="AI Ready Block">

**AI ready** is boolean which returns true if the pollination servers are looking good and false when its not, you can use this with if/then blocks

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/currentmodel.svg" width="220" alt="Current Model Block">

**Current model** is, a reporter block which tells what the current model is, it is very usefull if you forgot model you are using or to show what model the user is using

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/createbot.svg" width="250" alt="Create Bot Block">

**Create bot** is a block which allows users to make bots as a example

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/examples/example1.svg" width="400" alt="Pang AI Example Script">

this, will make a bot named PangAI which can be used in such ways

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/delete.svg" width="250" alt="Delete Bot Block">

**delete block** is a block which deletes a bot can be usefull if you want to delete a bot when they leave but, it is as dangerous as it is usefull so use it wisely or you chould ruin scripts
an **example**

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/examples/example2.svg" width="450" alt="Pang AI Advanced Example">

use this block only for deleting bots that are unnecceccery deleting a usefull bot can lead to it being gone forever

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/scratchblocks.svg" width="320" alt="AI Prompt Block">

**prompt** is a reporter block used to send and reccive responces this is a important block as... this sends massages and returns the responce
and an example is

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/examples/example3.svg" width="500" alt="Full Pang AI Implementation">

this example shows how to set the prompt block up with the say block, but an even good idea will be to... use animated text

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/settxtmodel.svg" width="280" alt="Set Text Model Block">

**set text model** is a block which changes your ai model by default you get

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/openai.svg" width="180" alt="OpenAI Model">

**OPENAI**

also there mistral,deepseek r1, gemini and more 

an example

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/mistral.svg" width="180" alt="Mistral Model">

**Mistral**

we also have more models to choose from and they are pretty cool and if some some arent working then, it means pollination's ai servers may be down or anyother issues may be happening so I am really sorry about that.

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/imgmodel.svg" width="250">

**set image model** is a block which is used set the image generation model which is used, to generate images
example

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/turbo.svg" width="150" alt="Turbo Model">

**Turbo** for generating images quickly

and

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/flux.svg" width="150" alt="Flux Model">

**Flux** for high quality images

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/setseedandtemp.svg" width="300" alt="Set Seed and Temp Block">

**set seed & temperature** blocks are used to set the seed and temperature I recommend people who dont know how to use it, to set up like this

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/examples/example4.svg" width="500" alt="Advanced Configuration Example">

**this creates a random seed from 1 to 100 and temperature to 1**

this will ensure that the responce we get are true random and the creativity is set to the recommended value

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/seedandtemp.svg" width="220" alt="Seed and Temp Reporter">

**seed & temperature** are reporter blocks which are used to, know the seed & temperature which is set to, this can be usefull not only for creators to know when they forget the seed & temp it is also usefull for telling the user what temp and seed they are using


**and I know I havent put every block, in this. Thats becuase I am lazy and dont have a team I am working solo thats the reason but I am trying to work on projects that way** I know but I just did'nt get  the time so, I wish you guys make wonderfull projects

## project examples

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/examples/example5.svg" width="500" alt="Advanced Example 5">

this is a simple chatbot idea, but I know my users will make a **Better AI chatbot** then this.

<img src="https://raw.githubusercontent.com/Seigh-sword/PangAI-GithubPage/main/assets/examples/example6.svg" width="500" alt="Advanced Example 6">

This is a simple random name generater you can make for your game
