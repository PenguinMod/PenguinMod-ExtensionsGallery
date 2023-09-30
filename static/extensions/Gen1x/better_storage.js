let externalWindow;
let username;
let hadError = false;
let errorText = "";
let errors = [];

function addNewError(err) {
  errors.push(err + " | " + new Date().toLocaleString())
}

//Server icon by Icons8 (https://icons8.com/) - https://icons8.com/icon/1340/server

const image = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAACC0lEQVR4nO2bTStEURjHfyIrE+p+Aqz4AGwUFjJev4UNq7GQbsJMIgvlWygLKV9A7CllbWGLJGOaZHTqqGO6EzLnZZznX8/mLu7zf35zznOe7p0Lf1M/cAI8AzXH8QqcA6N40gTw5KHw+qhoL07VD9xrA+/AEbDrOA6BN+1BeRlwVXwXcG38AntAn6fYN3zcAN22i28DjgNY9o3i1DaAmQCK/C4mbQJYNRIVgMVAomD4Uh6tKTUSJYSjxPClPFpTKgCQFVCTLUDDHjAOrOhGZCPUvcdC7QGbDo+6jdAAtANlhwBedM5gACTG9RLQaylKP8jvHUD6j/Pj24Dv/Pg24Ds/vg34zo9vA77z08hAj3H9zOJToDMjT09IAJRuHc4BKhchAejUDyddAajonMEASGQQIu4mmAgAZAXUZAsQbw/IeRiEciEBULpyOAdc8lVBABgCLoCqxcKrOsdgiAB8SgAgKwDZAkgPQJogcgogxyAWlcocQNMGoXXgUUca2xwwnTHm5mMCUMwAsBUTgPkMALMxAVDa1u/5X/Rrb2IDoNShg1gBNEsCgBZdAR0xb4Ed/ceqsm6IUQFYyDgG52ICUIx9EMpnAJiKCcDnvR50rPE3tSSAZkoAICsA2QJID0CaIJZPgRWj2Rx4+Fy2URwYvpRHaxrR3wrXAg3lbRjLWgbuAii2PpSnpd9W8wED7Xp1rQr2cwAAAABJRU5ErkJggg=="

const menuimg = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAD+ElEQVR4nO1bW08TQRTe36D8LKNWXjT6ZkDlYhD1AbEUgsYQjS9A9AGEIjeh5VIqwRhALJIo9AKEFtgulwAJsDO1rc/kmLN2N61S7ZTusrizyZc0m+0533w9c85sZ44gpF3JZLKIUtpAKfVTSn9QSiFXHB4ewv7+viE4ODgAQkjO3CilSUrpAiHEkUgkzgvHXbIsXyaExFkGjSR2d3dhY2MDJEkyHDs7O6xC4PPfZVm+eNzgj1gMybIMW1tbpzLwdGxubipcGEU40kRIJpNF+fzy6FglIYoiTHg+QG9bP/S09emOMZcXIuHVDBHyiIRYPB4/J1BK61m+iNje3tacB/0hqK96AiW2MkPx8GYNBOYDGg/klIcIdQIhJMDypb29Pc1pJByBmtt2hdCt4gqoLXOAvbJBV9SWOxRf6PPRnTqFg8oH8xHjj7kgsGR7zL6qs2g0Cs/tL7XBj7new8ryiiHwuseh9Eq54rup9oXCReWFHBkESAj5hr7zVbfhYZ8NHa1dGVOBZUwCy8NquVsKLWlhaAYgl+XFZYUbctRFAEKIprJvalZz/unjDHyZmTsVoG+VB3JS+bEkQyHXB7HWqg4+T/o0x+lJyGigb5UHclLvs6wLBC4A5REAhZwCuCr8Ovet4PMdbaJtU0+ByEoEHlfU65bt0Tb6MK0AA10u3UvegNNlXgHamzuVew3VTwu++kObaBt9mF6AxgfPCl7y0CYXwMYjAPgUaDZxDuhocSr38J19cmKqoECbyptfi9O8Anjd47qXQfRhWgHcPcO6C4A+TCtAOy+DnXwdUMIXQmV8Jdho1aXwGwPWAejDtAJ4Br26l0HcFjOtAKIoQmvTayi/WlXwgaNNtJ3+r5DpBJD4v8KSoSLwCAjzKQA8B9h4EgReBWy8DMKZWwcM9Y5A5fVquHvjPgz3jVqrDAb9ISgt/nXEBYGfQ4FF6wjgSztgocI3PWsdAdbX15UTZaoNfNP7fef3vxZASu0k42YqbnbmbeMsCyAVAFyA8BmPgGg0mnHI0VIRMPjWDRXX7ilwdQ9ZS4CgP5hx0BI/49rAMgL4pi2+DhBFMeMwFZ4Cj4pR6wggKeRXlY1ORHrzg2UEkAoALkCYRwDwKWA7eQ5IWjUHEELiQqpLlKljBA8uq46xnOndKJUN6aUUOakCMDVNEUIcuX5B7RXEOn4arXLZ4Khq1N4pkGOu4yGE2AXspcV2UtaWubXVNRjp9xjSKPk3jL7zKFxUXsiRqXESL1mWL+XSOou9OGZol80G5JZLvxCONRaLXRDSL+ylRVVYI8EswKbJHAcf+2PwQurCkEjlhAVsKvxXNGCTolEt8ydspcexzOOc18I+df0EoxMBmk6ZTmQAAAAASUVORK5CYII="

function openWindow(url) {
  const windowFeatures = 'width=400,height=500,top=100,left=100';

  // Open the external window
  externalWindow = window.open(url, "_blank", windowFeatures);

  // Listen for messages from the external window
  window.addEventListener("message", handleMessage);

  function handleMessage(event) {
    // Check the origin of the message to ensure it's from the expected source
    // Handle the message data sent from the external window
    const data = event.data;
    username = data;
    //externalWindow.close();
    window.removeEventListener("message", handleMessage);
    access = true
  }
}

let access = false;

class Storage {
  getInfo() {
    return {
      id: 'g1nxbetterstorage',
      name: 'Better Server Storage',
      menuIconURI: menuimg,
      blockIconURI: image,
      color1: '#42a9cf',
      color2: '#327f9c',
      color3: '#245c70',
      blocks: [
        {
          opcode: 'lockbutton',
          blockType: Scratch.BlockType.BUTTON,
          text: 'Reserve a key...',
        },
        {
          opcode: 'login',
          blockType: Scratch.BlockType.COMMAND,
          text: 'log in first',
        },
        {
          opcode: 'loggedbool',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'logged in?',
        },
        {
          opcode: 'errorlog',
          blockType: Scratch.BlockType.REPORTER,
          text: 'error log (array format)',
          disableMonitor: true
        },
        {
          opcode: 'errorlogclear',
          blockType: Scratch.BlockType.COMMAND,
          text: 'clear the error log'
        },
        {
          opcode: 'islocked',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'is key [KEY] reserved (read-only) [MENU]?',
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'scratch'
            },
            MENU: {
              type: Scratch.ArgumentType.STRING,
              menu: 'BOOLEANLOCK'
            }
          }
        },
        "---",
        {
          opcode: 'haderror',
          blockType: Scratch.BlockType.BOOLEAN,
          text: 'server error?',
        },
        {
          opcode: 'errortext',
          blockType: Scratch.BlockType.REPORTER,
          text: 'error text',
        },
        {
          opcode: 'savetostorage',
          blockType: Scratch.BlockType.COMMAND,
          text: 'save key [KEY] and value [VALUE] to server',
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'hello'
            },
            VALUE: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'world!'
            }
          }
        },
        {
          opcode: 'getfromstorage',
          blockType: Scratch.BlockType.REPORTER,
          text: 'get value of key [KEY] from server',
          arguments: {
            KEY: {
              type: Scratch.ArgumentType.STRING,
              defaultValue: 'scratch'
            }
          }
        }
      ],
      menus: {
        BOOLEANLOCK: {
          acceptReporters: true,
          items: ['for everyone else', 'for me']
        }
      }
    };
  }

  savetostorage(args) {
    if (access) {
      fetch("https://corsproxy.io/?" + encodeURIComponent("http://better-storage.rf.gd/set.php?key=" + args.KEY + "&value=" + args.VALUE + "&username=" + username), {
        method: 'GET'
      })
        .then((response) => {
          if (!response.ok) {
            hadError = true;
            return response.text().then((errorContent) => {
              errorText = errorContent;
              addNewError(errorContent)
            });
          }
          hadError = false;
          errorText = "";
          return response.text();
        })
        .catch((error) => {
          console.error(error);
          hadError = true;
          errorText = error;
          addNewError(error)
          return 'Uh oh! Something went wrong.';
        });
    } else {
      alert("You are not logged in.");
    }
  }

  leaderset(args) {
    if (access) {
      fetch("https://corsproxy.io/?" + encodeURIComponent("http://better-storage.rf.gd/set.php?key=" + args.KEY + "&value=" + args.VALUE + "&username=" + username), {
        method: 'GET'
      })
        .then((response) => {
          if (!response.ok) {
            hadError = true;
            return response.text().then((errorContent) => {
              errorText = errorContent;
              addNewError(errorContent)
            });
          }
          hadError = false;
          errorText = "";
          return response.text();
        })
        .catch((error) => {
          console.error(error);
          hadError = true;
          errorText = error;
          addNewError(error)
          return 'Uh oh! Something went wrong.';
        });
    } else {
      alert("You are not logged in.");
    }
  }
  
  getfromstorage(args) {
    return fetch("https://corsproxy.io/?http://better-storage.rf.gd/get.php?key=" + encodeURIComponent(args.KEY), {
      method: 'GET'
    })
      .then((response) => {
          if (!response.ok) {
            hadError = true;
            return response.text().then((errorContent) => {
              errorText = errorContent;
              addNewError(errorContent)
            });
          }
          hadError = false;
          errorText = "";
          return response.text();
       })
      .catch((error) => {
        console.error(error);
        hadError = true
        errorText = error
        addNewError(error)
        return 'Uh oh! Something went wrong.';
      });
  }
  login() {
    openWindow("https://storage-extension-auth.onrender.com/")
  }
  haderror() {
    return hadError;
  }
  errortext() {
    return errorText;
  }
  errorlog() {
    return JSON.stringify(errors)
  }
  loggedbool() {
    return access
  }
  errorlogclear() {
    errors = []
  }
  islocked(args) {
    if (access) {
      var url;
      if (args.MENU == "for everyone else") {
        url = "https://corsproxy.io/?" + encodeURIComponent("http://better-storage.rf.gd/islocked.php?key=" + args.KEY)
      } else {
        url = "https://corsproxy.io/?" + encodeURIComponent("http://better-storage.rf.gd/islocked.php?key=" + args.KEY + "&username=" + username)
      }
      return fetch(url, {
        method: 'GET'
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          if (data.result !== undefined) {
            return data.result;
          } else {
            throw new Error('The "result" property was not found in the JSON response');
          }
        })
        .catch((error) => {
          console.error(error);
          addNewError(error)
          return 'Uh oh! Something went wrong.';
        });
    } else {
      alert("You are not logged in.")
    }
  }
  lockbutton() {
    window.open('https://forms.gle/hQ5Qiq1gtkppR1Fj7', '_blank');
  }
}
Scratch.extensions.register(new Storage());
