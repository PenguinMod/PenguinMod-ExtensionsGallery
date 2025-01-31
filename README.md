# Extension Gallery

## Submitting an extension

### NOTE!
Once submitted, your extension CANNOT be removed from the files. Your extension may be delisted, but the code must NEVER be removed.

This is to prevent projects being broken. If we remove your code, anyone who used your extension will have to remake their ENTIRE project without editing their file manually.

### Step 1.
Create your extension. You can find a lot of details [here](https://docs.turbowarp.org/development/extensions/introduction).

#### Important Guidelines:
- Your extension should not already exist on the gallery. Please check the
[Pull Requests](https://github.com/PenguinMod/PenguinMod-ExtensionsGallery/pulls)
and [Gallery page](https://extensions.penguinmod.com/) to confirm.
- Your extension should be created for a specific purpose. An extension with random blocks someone might need will likely not get accepted if the blocks are not in a certain theme, like math or rendering.
- Your extension should be easily explainable in 1-2 sentences or a single picture. This is what will determine whether you can be on the gallery or not.
- Your extension should be MIT licensed (not compatible with the MIT license, should be the actual MIT license. This may change in the future.)
- If your extension uses external content such as JS libraries or CSS stylesheets, you must include them inside the extension code itself. You **CANNOT** fetch/import content from URLs that is a core part of your extension as it'll make the extension unusable offline, or in offline packaged projects. This does not apply to content that obviously requires internet, like an extension that allows projects to use a public API.
- Your extension **CANNOT** be made entirely with AI or assistive tools such as TurboBuilder. You must understand the raw code your extension is running.
- Your extension **CANNOT** rely on the use of any generative AI. This is mainly for extensions that respond to messages from AI like ChatGPT. Any extensions added before this rule are an exception.
- Your extension **CANNOT** reference or use any content from a website not suitable for ages 13+
- Your extension **CANNOT** contain content not suitable for ages 10+ (including extension icon and extension code)
- Your extension **CANNOT** contain discriminatory content or content that is against a certain group or minority

### Step 2.
Create info for your extension, like a description and a banner / thumbnail.
The banner / thumbnail is not required, but it will be a solid color if not provided.

Your banner / thumbnail must also be MIT licensed (basically just make it yourself and the image should be usable anywhere)

Ideally, this banner / thumbnail should be 600x300 pixels. (may be resized if it does not fit this size or edited to fit this size)

### Step 3.
Add your extension in the `static/extensions` folder.

Open [this link](https://github.com/PenguinMod/PenguinMod-ExtensionsGallery/tree/main/static/extensions) in a new tab to open the folder.

Click `Add File` at the top and click `Create new file`.

GitHub will likely tell you to make a fork to do this step. Make sure to create one as you'll need to have the files somewhere.

Create a new folder with your **Scratch** or **GitHub** username. You can do this by typing the username as the file name, and then typing a `/`. Then type the actual file name, followed by `.js`.

Now, paste your extension's code into the file.
You should now be able to `Commit changes` or `Create a pull request`, it'll likely be a green button.

### Step 4.
Update the extension ID.

To avoid conflicts or issues with other extensions, please put your name in the extension ID.
Use only characters `a-z` lowercase and numbers to ensure that the ID is valid.

*Note: Some extensions may be accepted without this rule if they provide reason.*

For example: `myExtension` could be `johnMyExtension` or `johnmyExtension`

### Step 5.
Create the pull request.

Continue through the menus until it lets you create a pull request.

You can post your extension banner / thumbnail and or description in the pull request.

Once your pull request is merged, it'll be on the site or upcoming onto the site. You may get responses about things you should change or fix though.

*Note: Vercel may comment on your pull request. This is the hosting service we use.*

*If it has a link to visit a preview, you can click on it and see your changes. See the Optional Steps for more info on how to edit the site to show your extension.*

# Optional Steps

### Step 6.
Add your extension banner to the website.

To do this, your GitHub profile should now have a fork of the repository.
It will probably be under the same name.

Open this repository, and enter the `static/images` folder.

If you are using the website to add the file:

1. Click `Add File` at the top and click `Create new file`.
2. At the top where the file name is, type your username and then a `/` character.
3. Now type any file name and type anything inside the file, then create the file.
4. Exit back into the folder you created and instead, upload a file.
5. Upload your extension banner here. The banner should have the same name as your extension.
6. Go back to your original file you created to make the folder, and delete the file.

This should create the folder with the uploaded image inside.

### Step 7.
Create instructions on using your extension.

***This really only makes sense if your extension has features that may need explanation.***

Enter the `src/lib/Documentation` folder in the repository.

Inside this folder are a lot of `.md` files. You will need to make one for your documentation.
These are **Markdown** files. It's a simple way to write information nicely. Right now, you are reading a markdown file.

To learn how to write markdown, you can visit https://www.markdowntutorial.com/
or just write your `.md` file using the same formatting tools that Discord has.

If you are using the website to add the `.md` file:

1. Click `Add File` at the top and click `Create new file`.
2. At the top where the file name is, type your extensions name, and then `.md`. **DO NOT TYPE A `/` HERE!**
3. Now type your markdown code. GitHub may actually show you a preview of your markdown.

#### Typing Scratch Blocks in your tutorial
You might notice documentation pages like the one for [Particle Tools](https://extensions.penguinmod.com/docs/particle-tools)
have blocks on them.

To do this, `.md` files have something called code-blocks. You type \`\`\` and then some code, then type \`\`\` again.

Example:
````
```
this is probably code
```
````
will become
```
this is probably code
```

You can also specify a programming language (which will be important for showing blocks)

Example:
````
```js
console.log("Hello world!");
```
````
will become
```js
console.log("Hello world!");
```

To type blocks in your documentation, specify `scratch` as the programming lanugage.

Example:
````
```scratch
hello, i am a scratch block ()
```
````
will become

<img src="example_block.png" alt="Block" height="64"></img>

*(visit https://scratchblocks.github.io to play with creating blocks like this)*

Note that GitHub, Visual Studio Code or other Markdown editors likely will not support this. **This only works on the PenguinMod site.** This is also why Vercel may allow you to preview your pull request.

#### Adding the tutorial to the site
So far we have covered creating and filling out the `.md` file, but it's not available yet.

To do this, enter the `src/lib/Documentation/pages.js` file.

In this file you will see some instructions. First off at the start of the file, follow the instructions to import your `.md` file.

Example:
*The documentation file is called `extension.md` in these examples.*
```js
import PageExtension from "./extension.md?raw";
```
```js
import PageDocumentationExtension from "./extension.md?raw";
```

Now you will see some more instructions below. Here, you will create the page that leads to the documentation.

Example:
*The above example helps visualize this section easier.*
```js
"extension": PageExtension,
```
`/docs/extension` will lead to the docs here
```js
"extension": PageDocumentationExtension,
```
`/docs/extension` will lead to the docs here
```js
"afdoiewhfoqwijel": PageExtension,
```
`/docs/afdoiewhfoqwijel` will lead to the docs here

Do not type a `/` or any characters that cannot be used in a URL here. Uppercase letters may also not work for the page link.

Also try to keep the name recognizable to your extension as this name will also be used on the `/docs` page.

### Step 8.
Add your extension onto the actual website.

Enter the `src/lib/extensions.js` file in the repository.

If you know JSON then you can tell how to edit the list inside, but otherwise try to keep the format of the last extension listed.
Each extension is incased in `{}` brackets. Look below on how to copy it.

```js
{
    name: "Evaluating Expressions", // The name of the extension.
    description: "Blocks to return the result of an expression.", // The description for the extension.
    code: "Username/extension.js", // The folder and file name for the code of the extension.
    banner: "Username/Extension.png", // The folder and file name for the banner of the extension.
    creator: "Username", // Your username. Adds a link to your profile.
    
    // Only applies if you created a documentation page.
    documentation: "page-name", // This is the page name for the documentation you created.

    // These next ones are optional. You can choose not to include them.
    creatorAlias: "Joe", // Optional. This will not change the creator link, but change the name that links to it.
    notes: "Additional help by someguy", // Optional. Allows you to note anyone else who helped you or any small info.
    unstable: false, // Optional. Will add a warning message that your extension is unstable.
    unstableReason: "May break sometimes, Use at your own risk.", // Optional. Will change the reason that your extension is unstable.
    isGitHub: false, // Optional. false means this is your Scratch username, true means this is your GitHub username.
},
```