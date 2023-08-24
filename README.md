# Extension Gallery

## Submitting an extension
### Step 1.
Create your extension. You can find a lot of details [here](https://docs.turbowarp.org/development/extensions/introduction).

#### Important notes:
- Your extension should not already exist on the gallery. Please check the
[Pull Requests](https://github.com/PenguinMod/PenguinMod-ExtensionsGallery/pulls)
and [Gallery page](https://extensions.penguinmod.site/) to confirm.
- Your extension should be created for a specific purpose. An extension with random blocks someone might need will likely not get accepted if the blocks are not in a certain theme, like math or rendering.
- Your extension should be easily explainable in 1-2 sentences or a single picture. This is what will determine whether you can be on the gallery or not.
- Your extension should be MIT licensed (not compatible with the MIT license, should be the actual MIT license. This may change in the future.)

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
    isGitHub: false, // Optional. false means this is your Scratch username, true means this is your GitHub username.
},
```