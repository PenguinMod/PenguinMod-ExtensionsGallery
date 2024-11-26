
{
    name: "Evaluating Expressions", // The name of the extension.
    description: "Blocks to return the result of an expression.", // The description for the extension.
    code: "Username/extension.js", // The folder and file name for the code of the extension.
    banner: "Username/Extension.png", // The folder and file name for the banner of the extension.
    documentation: "page-name", // Only applies if you created a documentation page. This is the page name for that documentation.
    creator: "Username", // Your username. Adds a link to your profile.
    isGitHub: false, // Optional. false means this is your Scratch username, true means this is your GitHub username.
},

class DateTimeExtension {
  getInfo() {
    return {
      id: 'datetimeexample',
      name: 'Date and Time',
      blocks: [
        {
          opcode: 'getCurrentDateTime',
          blockType: Scratch.BlockType.REPORTER,
          text: 'current date and time'
        }
      ]
    };
  }

  getCurrentDateTime() {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const now = new Date();
    const dayOfWeek = daysOfWeek[now.getDay()];
    const month = monthsOfYear[now.getMonth()];
    const dayOfMonth = now.getDate();
    const year = now.getFullYear();

    const formattedDateTime = `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
    
    return formattedDateTime;
  }
}

Scratch.extensions.register(new DateTimeExtension());
