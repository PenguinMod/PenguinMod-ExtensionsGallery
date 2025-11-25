# PenguinAI Extension Documentation

# PENGUINAI IS NOW DEPRECATED. USE AT YOUR OWN RISK.

Most of the models in this extension no longer work, and will not be fixed. See [This github issue](https://github.com/PenguinMod/PenguinMod-Home/issues/421) for more information. If this extension is present on an extension gallery, alert the owner to have it removed.

## Documentation

The PenguinAI extension brings the power of artificial intelligence to your PenguinMod projects. This extension provides blocks for AI text generation, image creation, streaming conversations, and advanced chatbot management. Perfect for creating interactive AI-powered games, educational tools, and creative projects.

## Getting Started

### Simple Blocks (For Beginners)

### Ask AI
```scratch
(ask AI: [Hello! How are you?] :: #009CCC)
```
The simplest way to interact with AI. Ask any question and get an instant response.

Examples:
- `"Hello! How are you?"` → AI greeting response
- `"Tell me a joke"` → AI-generated joke
- `"What is 2+2?"` → `4`

### Set Model
```scratch
set Model to [GPT-4o v] :: #009CCC
```
Choose which AI model to use for your requests. Different models have different capabilities and response styles.

Available models include:
- GPT-4o (recommended for most tasks)
- GPT-3.5 Turbo (faster, good for simple tasks)
- Claude models (good for creative writing)
- And many more depending on current API availability

### Get Current Model
```scratch
(get current model :: #009CCC)
```
Returns the name of the currently selected AI model.

### Check Model Status
```scratch
<is model [gpt-4o] working? :: #009CCC>
```
Checks if a specific AI model is currently available and functioning properly.

## Message Management

### Get Prompt Templates  
```scratch
(get prompt [PenguinBot (Character) v] :: #009CCC)
```
Access pre-made prompt templates for different AI personalities and use cases.

Available templates include:
- **PenguinBot**: Friendly Antarctic penguin character
- **Stand Up Comedian**: Creates humorous responses
- **Minecraft Commander**: Generates Minecraft commands
- **Lua Console**: Acts as a programming console
- And more creative character options

### Generate Text (No Context)
```scratch
(generate from text (no context): [How are you?] :: #009CCC)
```
Send a single message to AI without maintaining conversation history. Each request is independent.

Use cases:
- Quick questions
- One-off text generation
- When you don't need conversation memory

### Send to Chat
```scratch
(send text [What is "Foo, Bar"?] to [Foo] :: #009CCC)
```
Send a message to a named chatbot that remembers conversation history. This allows for ongoing conversations with context.

### Attach Image to Next Message
```scratch
attach image [datauri or url] to next message :: #009CCC
```
Add an image to your next AI request. The AI can analyze, describe, or answer questions about the image.

Supported formats:
- Data URIs (base64 encoded images)
- Image URLs from the internet
- Screenshots or uploaded images

### Inform Chat
```scratch
inform [Foo] that [You can only speak in meows and other cat noises.] :: #009CCC
```
Give special instructions or personality traits to a chatbot. This affects all future responses from that chatbot.

Examples:
- `"You are a helpful teacher"` 
- `"Respond only in rhymes"`
- `"You are an expert in science"`

## Chatbot Management

### Create Chatbot
```scratch
create chatbot named [Foo] :: #009CCC
```
Create a new chatbot with its own conversation history and personality.

### Delete Chatbot
```scratch
delete chatbot [Foo] :: #009CCC
```
Permanently remove a chatbot and all its conversation history.

### Reset Chat History
```scratch
reset chat history of [Foo] :: #009CCC
```
Clear all conversation history for a chatbot while keeping the chatbot itself.

### Export Chat History
```scratch
(chat history of [Foo] as Array :: #009CCC)
```
Get the complete conversation history of a chatbot as JSON data for saving or analysis.

### Import Chat History
```scratch
import chat history from [Array goes here] as [Foo] :: #009CCC
```
Load previously saved conversation history into a chatbot.

### Import All Chats
```scratch
Import chats from [Array goes here] and [Merge/Update existing chats v] :: #009CCC
```
Load multiple chatbots at once. Choose whether to merge with existing chats or replace them entirely.

### Export All Chats
```scratch
(all chats as Arrays :: #009CCC)
```
Export all your chatbots and their histories as JSON data for backup or sharing.

### List Active Chats
```scratch
(currently active chats :: #009CCC)
```
Get a list of all currently created chatbot names.

## Streaming (Advanced) (CURRENTLY IN DEVELOPMENT | NOT IN EXTENSION)

### Start Streaming Request
```scratch
start streaming request [Tell me a story] to [StreamChat] :: #009CCC
```
Begin a streaming AI conversation where responses arrive in real-time chunks instead of waiting for the complete response.

Benefits:
- See responses as they're being generated
- More interactive user experience
- Better for long responses like stories or explanations

### When New Stream Chunk Received
```scratch
when new stream chunk received :: #009CCC hat
```
This hat block triggers every time a new piece of text arrives from a streaming request. Use this to update your interface in real-time.

### Current Stream Chunk
```scratch
(current stream chunk :: #009CCC)
```
Get the latest piece of text that just arrived from the streaming request. This updates with each new chunk.

### Is Stream Active?
```scratch
<is stream active? :: #009CCC>
```
Check if a streaming request is currently in progress.

### Stop Current Stream
```scratch
stop current stream :: #009CCC
```
Manually stop an active streaming request before it completes naturally.

## Image Generation

### Generate Image URL
```scratch
(generate [Penguin in Space] from [Dall-e 3 v] and get URL :: #009CCC)
```
Create an AI-generated image from a text description and get the URL to the image.

Examples:
- `"Penguin in Space"` → URL to space penguin image
- `"Sunset over mountains"` → URL to landscape image
- `"Cartoon robot playing guitar"` → URL to cartoon image

### Generate and Import Image
```scratch
generate [Penguin in Space] from [Dall-e 3 v] and import as costume with name [Penguin] :: #009CCC
```
Generate an AI image and automatically add it as a costume to your current sprite.

This is perfect for:
- Creating unique sprites
- Dynamic costume generation
- Art creation within projects

### Advanced Image Generation
```scratch
(generate [1] images of [Penguin in Space] from [Dall-e 3 v] with size [1024]x[1024] and get URLs :: #009CCC)
```
Generate multiple AI images with custom dimensions and get all URLs as a JSON array.

Parameters:
- **Number of images**: How many variations to generate (1-10 depending on model)
- **Prompt**: Description of what you want to create
- **Model**: AI image generation model to use
- **Width**: Image width in pixels (e.g., 512, 1024, 1920)
- **Height**: Image height in pixels (e.g., 512, 1024, 1080)

Returns: JSON array of image URLs, for example:
```json
["https://image1.url", "https://image2.url", "https://image3.url"]
```

Use cases:
- Generate multiple variations of the same concept
- Create images in specific aspect ratios (16:9, 4:3, square)
- Batch generate images for galleries or slideshows
- Create different sized versions for different uses

## Advanced API Settings

### Set API URL
```scratch
set Reverse Proxy API URL to [https://api.example.com/v1] :: #009CCC
```
Configure a custom API endpoint for AI requests. This allows you to use different AI service providers.

### Set Temperature
```scratch
set Temperature to [1] :: #009CCC
```
Control the randomness and creativity of AI responses:
- `0` = Very focused and deterministic
- `1` = Balanced creativity (default)
- `2` = Very creative and random

### Check API Status
```scratch
<is the Reverse Proxy working? :: #009CCC>
```
Test if your configured API endpoint is responding properly.

## Practical Examples

### Simple Chatbot
```scratch
when flag clicked
create chatbot named [Helper]
inform [Helper] that [You are a helpful assistant]

when space key pressed
ask [What would you like to know?] and wait
set [response v] to (send text (answer) to [Helper])
say (response) for (2) seconds
```

### Streaming Story Generator (CURRENTLY USES FEATURES IN DEVELOPMENT | NOT IN EXTENSION)
```scratch
when flag clicked
start streaming request [Tell me a fantasy adventure story] to [Storyteller]

when new stream chunk received
set [story v] to (join (story) (current stream chunk))
say (current stream chunk) for (1) seconds
```

### Image Generator
```scratch
when flag clicked
ask [Describe an image to generate:] and wait
set [image url v] to (generate (answer) from [Dall-e 3 v] and get URL)
generate (answer) from [Dall-e 3 v] and import as costume with name [Generated]
switch costume to [Generated v]
```

### Advanced Image Generation
```scratch
when flag clicked
ask [Describe images to generate:] and wait
set [image urls v] to (generate [3] images of (answer) from [flux v] with size [512]x[512] and get URLs)
set [url list v] to (image urls)
repeat (3)
  set [current url v] to (item (counter) of (url list))
  // Use the URL to display or save the image
  say (current url) for (2) seconds
end
```

### Multi-Character Conversation
```scratch
when flag clicked
create chatbot named [Alice]
create chatbot named [Bob]
inform [Alice] that [You are optimistic and cheerful]
inform [Bob] that [You are logical and analytical]

when [1 v] key pressed
set [alice response v] to (send text [What do you think about space exploration?] to [Alice])
set [bob response v] to (send text (alice response) to [Bob])
say (join [Alice: ] (alice response))
wait (2) seconds
say (join [Bob: ] (bob response))
```

## Error Handling

The extension includes built-in error handling:
- Invalid API responses return error messages
- Network failures are caught and reported
- Malformed requests return descriptive errors
- Model availability is checked before requests

Common error messages:
- `"API Error: [message]"` - Server-side issues
- `"Error: That chatbot does not exist"` - Chatbot not created
- `"Error: Invalid number"` - Self explanatory

## Tips and Best Practices

1. **Model Selection**: Use GPT-4o for complex tasks, GPT-3.5 for simple questions, you can also do research on the other models available on the Reverse Proxy.
2. **Temperature Settings**: Lower values (0.3-0.7) for factual content, higher (1.0+) for creative writing
3. **Chat Management**: Create separate chatbots for different purposes or characters
4. **Image Generation**: Be specific in your descriptions for better results
5. **Error Handling**: Always check for error messages in responses

## Privacy and Safety

- All requests are sent to external AI service providers
- No conversation data is stored locally beyond your project
- Be mindful of sharing sensitive information in prompts
