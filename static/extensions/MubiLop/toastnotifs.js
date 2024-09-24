//                           ###((##
//                ##########################(((
//           ########&@@@@@@@@@@@@@@@@@@&&&%#####(((
//       ######%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&%##((((
//     #####@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&&#((((
//    ####@@@@@@@@@@%%@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&#(((
//   ####@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&((((
//   ###&@@@@@@@@%@@@@@@@@@@@@@@@@@@@@@@@@@@@@%%@@@@@&&&#(((
//   ####@@@@@@@@@@@@@@@@@&&@@@@@@@@@@@@@@@@@@@@@@@@&&&&(((/
//    #####@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&((((.
//      #####&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&%(((((
//         ###@@@@@@@@@@@@@@@%%@@@@@%%@@@@&%&@@&&&&(((
//         ###@@@@@@@@@@@@&%&@@@@%&%@@@&&%@@@@@&&&&(((
//         ###@@@@@@@@@@%%&@@@@%%@@@@%%&@@@&&@@&&&&(((
//         ###@@@@@@@&&%@@@@%%&@@@&%%@@@@%&&@@@&&&&(((
//         ###@@@@@@@@@@@@&%@@@@%%&@@@&%%@@@@@@&&&&(((
//         ###@@@@@@@@@&&&@@@&&&@@@@&&@@@@&&@@@&&&&(((
//         ###@@@@@@@%%@@@@%%&@@@&&%@@@@%%&@@@@&&&&(((
//         ###@@@@@@@@@@&%&@@@@%%&@@@&&%@@@@@@@&&&&(((
//         ###@@@@@@@@%%&@@@&%%@@@@%%&@@@@@@@@@&&&&(((
//         ###@@@@@@&%@@@@&%@@@@@@@@@@@@@@@@@@@&&&&(((
//         ###&&@@@@@@@@@@@@@@@@@@@@@@@@@@@@@&&&&&&(((
//         ((##&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&((((
//          (((((((((((((((((((((((((((((((((((((((((
//
//                       -= Toast Notifs =-
//  Did you want alerts? Notificationss that are easily customizable?
//        This is the only and best notification extension!
//                  Created by MubiLop + themeatly2

(function (Scratch) {
  "use strict";
  const ico = "data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI1MTIiIGhlaWdodD0iNTEyIiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjt0ZXh0LXJlbmRlcmluZzpnZW9tZXRyaWNQcmVjaXNpb247aW1hZ2UtcmVuZGVyaW5nOm9wdGltaXplUXVhbGl0eTtmaWxsLXJ1bGU6ZXZlbm9kZDtjbGlwLXJ1bGU6ZXZlbm9kZCI+PHBhdGggc3R5bGU9Im9wYWNpdHk6Ljk4NyIgZmlsbD0iI2Y3OWU2MCIgZD0iTTIyOC41LS41aDE0cTc1LjUwMiAzLjUwNCAxNDMgMzguNSA0Mi4xNzMgMjIuNjczIDY1LjUgNjQuNSA1LjkzIDExLjM0OSA3LjUgMjQtMTUuMTgtMzguMDE5LTUxLTU4LjUtNTkuOTEtMzQuMTA4LTEyOS0zOC0yMi4yNTktMS4yNDEtNDQgLjUtNjQuNjA1IDIuNjE3LTEyMiAzMi41UTg1LjE3MyA3OC4zMTUgNjUgMTAyLjVxLTI5LjYyNiA0My42NDMgMiA4NmEyMTguNiAyMTguNiAwIDAgMCAyOSAyOCAyMi42IDIyLjYgMCAwIDEgNCA4cS43NSAxMDMuNDk5LjUgMjA3YTE5NSAxOTUgMCAwIDAgMS41IDMzcTUuMDMzIDEwLjc4MSAxNS41IDE2LTQzLjIwNi0xMC43MDctNDgtNTUgLjI1LTk2LjAwMS0uNS0xOTItMjkuNjctMjMuODY1LTQ0LTU5LTE1Ljg5NC01Ni40MTUgMjMtMTAwUTk0LjE4NSAyOC43NjcgMTU3LjUgMTJxMzUuMjA0LTkuMiA3MS0xMi41Ii8+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2Q3N2Q0MSIgZD0iTTI0Mi41LS41aDQwcTc3LjI0NyA1LjE2NSAxNDQgNDQuNSAzNy4xMzUgMjIuNjMyIDU2LjUgNjEuNSAyMS45OTkgNjAuMDAyLTIwIDEwOGEyOTYgMjk2IDAgMCAxLTIxIDIwIDE0MDAzIDE0MDAzIDAgMCAxLTIgMjMzcS05LjY4NiAzNS45MzctNDUuNSA0NWgtMjc4cS0zNS44MTQtOS4wNjMtNDUuNS00NWEzMjYgMzI2IDAgMCAxLTEuNS00MXE0Ljc5NCA0NC4yOTMgNDggNTVhMTI0MjQgMTI0MjQgMCAwIDAgMjcyIC41cTE4LjAxOC01LjAyMiAyMS41LTIzLjVsMS0yMzRhMzIuNSAzMi41IDAgMCAxIDMtNyAyMjAuNCAyMjAuNCAwIDAgMCAyNi0yNHEyNS4xNTctMjguNjI2IDE3LjUtNjYtMS41Ny0xMi42NTEtNy41LTI0LTIzLjMyNy00MS44MjgtNjUuNS02NC41LTY3LjQ5OC0zNC45OTUtMTQzLTM4LjUiLz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZmNkOGIzIiBkPSJNMjM0LjUgMzAuNXEyMS43NDEtMS43NDEgNDQtLjUgNjkuMDkgMy44OTIgMTI5IDM4IDM1LjgyIDIwLjQ4MSA1MSA1OC41IDcuNjU3IDM3LjM3NC0xNy41IDY2YTIyMC40IDIyMC40IDAgMCAxLTI2IDI0IDMyLjUgMzIuNSAwIDAgMC0zIDdsLTEgMjM0cS0zLjQ4MiAxOC40NzgtMjEuNSAyMy41LTEzNi4wNDIgMS4yMzktMjcyLS41LTEwLjQ2Ny01LjIxOS0xNS41LTE2YTE5NSAxOTUgMCAwIDEtMS41LTMzcTUuMzcgMTUuMTE1IDIxIDE5LjUgMTE5IDEgMjM4IDAgMTYuMjktNC4yOSAyMC41LTIwLjVsMS0yMDZxNi4wNTItMTMuMDU2IDE4LjUtMjAuNSA2My4zNDMtNjIuNTMtMy0xMjItNDQuNjQ1LTMzLjgxMS0xMDAtNDVhMjgxIDI4MSAwIDAgMC02Mi02LjUiLz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZmVlN2M3IiBkPSJNMjM0LjUgMzAuNWEyODEgMjgxIDAgMCAxIDYyIDYuNXE1NS4zNTUgMTEuMTg5IDEwMCA0NSA2Ni4zNDMgNTkuNDcgMyAxMjItMTIuNDQ4IDcuNDQ0LTE4LjUgMjAuNWwtMSAyMDZxLTQuMjEgMTYuMjEtMjAuNSAyMC41LTExOSAxLTIzOCAwLTE1LjYzLTQuMzg1LTIxLTE5LjUuMjUtMTAzLjUwMS0uNS0yMDdhMjIuNiAyMi42IDAgMCAwLTQtOCAyMTguNiAyMTguNiAwIDAgMS0yOS0yOHEtMzEuNjI2LTQyLjM1Ny0yLTg2UTg1LjE3MyA3OC4zMTUgMTEyLjUgNjNxNTcuMzk1LTI5Ljg4MyAxMjItMzIuNSIvPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTgiIGQ9Ik0xNTMuNSA5OC41cTkuMDM0LTEuOTU1IDExIDctMy42MTMgMTAuODAzLTEzLjUgNS0zLjcxNi03LjI0NiAyLjUtMTIiLz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNMzMwLjUgMTEyLjVxMTEuNTUxLS4yMDcgOS41IDExLTcuNzQ0IDguMzQzLTE0LTEtLjg0My02LjQwMyA0LjUtMTAiLz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjMzk4IiBkPSJNMTI0LjUgMTQwLjVxOS4wMzQtMS45NTUgMTEgNy0zLjYxMyAxMC44MDMtMTMuNSA1LTMuNzE2LTcuMjQ2IDIuNS0xMiIvPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmM0OTkiIGQ9Ik0zNzQuNSAxNDIuNXExNC40MTQuNjU0IDggMTMuNS0xMi4wNTYgNS40MDEtMTIuNS03LjVhNDEgNDEgMCAwIDEgNC41LTYiLz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNMjA3LjUgMTYxLjVxMTEuNDkxLTEuMjU2IDEwLjUgMTAtNS41NTcgNi43MjMtMTMgMi0zLjcxNi03LjI0NiAyLjUtMTIiLz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjMzk3IiBkPSJNMzUyLjUgMjE5LjVxMTMuNjY1LjQwOCA4LjUgMTNMMTYwLjUgNDMzcS0xMi45MzYgNC4wNy0xMS41LTkuNWE1ODY2NiA1ODY2NiAwIDAgMCAyMDMuNS0yMDQiLz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNMjk2LjUgMjIxLjVxMTQuMzk3IDEuMjkzIDcuNSAxNEwxNjMuNSAzNzZxLTkuOTU5IDYuMjY2LTEzLTVhMTEuNSAxMS41IDAgMCAxIDEuNS01LjUgMjk0MzggMjk0MzggMCAwIDEgMTQ0LjUtMTQ0Ii8+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzM5NyIgZD0iTTIzMS41IDIyOS41cTE0LjYxNy0xLjY0MiA5LjUgMTJMMTY5LjUgMzEzcS0xMi45MDkgNC4wOTktMTEuNS05LjVhNzY3MSA3NjcxIDAgMCAwIDczLjUtNzRtMTE4IDQ3cTE0LjQ3Mi0xLjUzIDkuNSAxMkwyMTYuNSA0MzFxLTEyLjg1OSA0LjE1My0xMS41LTkuNWEyOTYwNiAyOTYwNiAwIDAgMCAxNDQuNS0xNDUiLz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNMzQzLjUgMzM5LjVxMTUuMTczLjkxNyA3LjUgMTRMMjgxLjUgNDIzcS03LjE0IDUuNjY1LTEyLjUtMS41LTEuMTg1LTQuNzAxIDEtOWE3NTc1IDc1NzUgMCAwIDEgNzMuNS03MyIvPjwvc3ZnPg==";

  if (!Scratch.extensions.unsandboxed) {
      throw new Error('"ToastNotifs" cannot run unsandboxed.')
  }
  
  function defaultStyles() {
    return {
      toast: {
        backgroundColour: null,
        fontColour: null,
        fontSize: null,
        borderRadius: null,
        padding: null,
        soundLink: null,
      },
      notification: {
        backgroundColour: null,
        fontColour: null,
        fontSize: null,
        borderRadius: null,
        padding: null,
        soundLink: null,
      },
      alert: {
        backgroundColour: null,
        fontColour: null,
        fontSize: null,
        borderRadius: null,
        padding: null,
        soundLink: null,
      },
    };
  }

  var toastConfig = {
    soundWhenAlertEnabled: "true",
  };

  const stylesToast = defaultStyles();

  function validColour(colour) {
    if (typeof colour != "string") return false;

    const hexRegex = /^#[0-9A-F]{6}$/i;

    return hexRegex.test(colour);
  }

  function xmlEscape(str) {
    return str.replace(/&/g, "&amp;")
              .replace(/</g, "&lt;")
              .replace(/>/g, "&gt;")
              .replace(/"/g, "&quot;")
              .replace(/'/g, "&#39;");
  }

  class ToastNotifsExt {
    getInfo() {
      return {
        id: "toastnotifs",
        name: "Toast Notifs",
        menuIconURI: ico,
        blockIconURI: ico,
        color1: "#905c1b",
        blocks: [
          {
            opcode: "showToast",
            text: "Show Toast with text [TEXT] with image [IMAGE] image rounded? [ROUNDED]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Toast!",
              },
              IMAGE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "https://penguinmod.com/navicon.png",
              },
              ROUNDED: {
                type: Scratch.ArgumentType.STRING,
                menu: "yesorno",
                defaultValue: "no",
              },
            },
          },
          {
            opcode: "showNotificationToast",
            text: "Show Notification Toast with text [TEXT] at position [POSITION] custom css? [STYLES]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello, World!",
              },
              POSITION: {
                type: Scratch.ArgumentType.STRING,
                menu: "position",
                defaultValue: "up",
              },
              TYPE: {
                type: Scratch.ArgumentType.STRING,
                menu: "type",
              },
              STYLES: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "showAlert",
            text: "Show Alert with text [TEXT] with duration of [DURATION] seconds",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              TEXT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "Hello!",
              },
              DURATION: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "5",
              },
            },
          },
          {
            opcode: "__NOOPCODE",
            text: "Customization",
            blockType: Scratch.BlockType.LABEL,
          },
          {
            opcode: "setStyleOfTo",
            text: "Set [STYLE] of [ALLTYPES] to [VALUE]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              STYLE: {
                type: Scratch.ArgumentType.STRING,
                menu: "setStyle",
              },
              ALLTYPES: {
                type: Scratch.ArgumentType.STRING,
                menu: "setStyleAllTypes",
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "",
              },
            },
          },
          {
            opcode: "resetStyleOf",
            text: "Reset style of [ALLTYPES]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              ALLTYPES: {
                type: Scratch.ArgumentType.STRING,
                menu: "setStyleAllTypes",
              },
            },
          },
          {
            opcode: "getHexColour",
            text: "Colour [HEX]",
            blockType: Scratch.BlockType.REPORTER,
            arguments: {
              HEX: {
                type: Scratch.ArgumentType.COLOR,
              },
            },
          },
          {
            opcode: "__NOOPCODE",
            text: "Configuration (Can be experimental)",
            blockType: Scratch.BlockType.LABEL,
          },
          {
            opcode: "setConfig",
            text: "Set config [CONFIG] to [VALUE]",
            blockType: Scratch.BlockType.COMMAND,
            arguments: {
              CONFIG: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "soundWhenAlertEnabled",
                menu: "configs",
              },
              VALUE: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: "true",
              },
            },
          },
        ],
        menus: {
          position: ["up", "middle", "down"],
          type: ["info", "success", "warning", "error"],
          yesorno: ["yes", "no"],
          setStyle: [
            { text: "background colour", value: "backgroundColour" },
            { text: "font colour", value: "fontColour" },
            { text: "font size", value: "fontSize" },
            { text: "border roundness", value: "borderRadius" },
            "padding",
            { text: "sound url", value: "soundLink" },
          ],
          setStyleAllTypes: ["toast", "notification", "alert"],
          configs: [
            { text: "play sound when alert", value: "soundWhenAlertEnabled" },
          ],
        },
      };
    }

    showNotificationToast(args) {
      var text = xmlEscape(args.TEXT);
      var position = args.POSITION;
      var type = xmlEscape(args.TYPE);

      var size = stylesToast["notification"].fontSize ?? 16;
      var bgColour =
        stylesToast["notification"].backgroundColour ?? "rgba(0, 0, 0, 0.8)";
      var borderRadius = stylesToast["notification"].borderRadius ?? 5;
      var padding = stylesToast["notification"].padding ?? 10;
      var fontColour = stylesToast["notification"].fontColour ?? "#FFFFFF";

      var styles = args.STYLES;

      var existingStyle = document.getElementById("notificationToastStyle");
      if (existingStyle) {
        existingStyle.remove();
      }

      var notificationToastStyle = document.createElement("style");
      notificationToastStyle.id = "notificationToastStyle";
      notificationToastStyle.textContent = `
                  .notification-toast {
                      position: fixed;
                      z-index: 9999;
                      right: 10px;
                      padding: ${padding}px ${padding * 2}px;
                      border-radius: ${borderRadius}px;
                      font-family: Arial, sans-serif;
                      font-size: ${size}px;
                      color: ${fontColour};
                      background-color: ${bgColour};
                      animation: slideIn 0.5s ease-in-out;
                      ${styles}
                  }
                  .notification-toast.up {
                      top: 10px;
                  }
                  .notification-toast.middle {
                      top: 50%;
                      transform: translateY(-50%);
                  }
                  .notification-toast.down {
                      bottom: 10px;
                  }
                  .notification-toast.info {
                      color: #2196F3;
                  }
                  .notification-toast.success {
                      color: #4CAF50;
                  }
                  .notification-toast.warning {
                      color: #FFEB3B;
                  }
                  .notification-toast.error {
                      color: #F44336;
                  }
                  .notification-toast .line {
                      border-top: 3px solid;
                      margin-bottom: 5px;
                  }
                  .notification-toast .close-button {
                      position: absolute;
                      top: 5px;
                      right: 5px;
                      cursor: pointer;
                  }
                  .notification-toast .close-button:hover {
                      color: #fff;
                  }
                  @keyframes slideIn {
                      from {
                          right: -300px;
                      }
                      to {
                          right: 10px;
                      }
                  }
                  @keyframes fadeOut {
                      from {
                          opacity: 1;
                      }
                      to {
                          opacity: 0;
                      }
                  }
              `;
      document.head.appendChild(notificationToastStyle);

      var notificationToast = document.createElement("div");
      notificationToast.className = `notification-toast ${position} ${type}`;
      notificationToast.innerHTML = `<span class="close-button">×</span><div class="line ${type}"></div>${text}`;
      document.body.appendChild(notificationToast);

      if (toastConfig["soundWhenAlertEnabled"] == "true") {
        var audioLink =
          stylesToast["notification"].soundLink ??
          "https://ruby-devs.vercel.app/cdn/appear.mp3";
        var audio = new Audio(audioLink);
        audio.play();
      }

      var closeButton = notificationToast.querySelector(".close-button");
      closeButton.addEventListener("click", function () {
        notificationToast.classList.add("fade-out");
        setTimeout(function () {
          notificationToast.remove();
          notificationToastStyle.remove();
        }, 500);
      });

      setTimeout(function () {
        notificationToast.classList.add("fade-out");

        setTimeout(function () {
          notificationToast.remove();
          notificationToastStyle.remove();
        }, 500);
      }, 5000);
    }

    showToast(args) {
      let round;
      var text = xmlEscape(args.TEXT);
      var image = xmlEscape(args.IMAGE);
      var isRounded = args.ROUNDED;
      var existingStyle = document.getElementById("toastStyle");

      var size = stylesToast["toast"].fontSize ?? 18;
      var bgColour = stylesToast["toast"].backgroundColour ?? "#333";
      var borderRadius = stylesToast["toast"].borderRadius ?? 10;
      var padding = stylesToast["toast"].padding ?? 20;
      var fontColour = stylesToast["toast"].fontColour ?? "#FFFFFF";

      if (existingStyle) {
        existingStyle.remove();
      }

      if (isRounded === "yes") {
        round = "border-radius: 50%;";
      }

      var toastStyle = document.createElement("style");
      toastStyle.id = "toastStyle";
      toastStyle.textContent = `
                  #toast {
                      position: fixed;
                      z-index: 9999;
                      top: -100px;
                      left: 50%;
                      transform: translateX(-50%);
                      background-color: ${bgColour};
                      color: ${fontColour};
                      padding: ${padding}px;
                      border-radius: ${borderRadius}px;
                      font-family: Arial, sans-serif;
                      font-size: ${size}px;
                      display: flex;
                      align-items: center;
                      transition: top 0.5s ease;
                  }
                  #toast img {
                      width: 64px;
                      height: 64px;
                      margin-right: 10px;
                      ${round}
                  }
                  #toast .points {
                      margin-left: 10px;
                  }
              `;
      document.head.appendChild(toastStyle);

      var toast = document.createElement("div");
      toast.id = "toast";

      if (image) {
        var img = document.createElement("img");
        img.src = image;
        img.width = 64;
        img.height = 64;
        toast.appendChild(img);
      }

      var content = document.createElement("div");
      content.style.display = "flex";
      content.style.alignItems = "center";
      content.textContent = text;
      toast.appendChild(content);

      document.body.appendChild(toast);

      if (toastConfig["soundWhenAlertEnabled"] == "true") {
        var audioLink =
          stylesToast["toast"].soundLink ??
          "https://ruby-devs.vercel.app/cdn/appear.mp3";
        var audio = new Audio(audioLink);
        audio.play();
      }

      setTimeout(function () {
        toast.style.top = "0";
      }, 100);

      setTimeout(function () {
        toast.style.top = "-100px";
        setTimeout(function () {
          toast.remove();
          toastStyle.remove();
        }, 500);
      }, 2000);
    }

    showAlert(args) {
      var text = xmlEscape(args.TEXT);
      var duration = xmlEscape(args.DURATION); // New argument for duration

      var size = stylesToast["alert"].fontSize ?? 16;
      var bgColour = stylesToast["alert"].backgroundColour ?? "#2196F3";
      var borderRadius = stylesToast["alert"].borderRadius ?? 5;
      var padding = stylesToast["alert"].padding ?? 20;
      var fontColour = stylesToast["alert"].fontColour ?? "#FFFFFF";

      var alertStyle = document.createElement("style");
      alertStyle.id = "alertStyle";
      alertStyle.textContent = `
                  .alert {
                      position: fixed;
                      top: 50%;
                      left: 50%;
                      transform: translate(-50%, -50%);
                      padding: ${padding}px;
                      border-radius: ${borderRadius}px;
                      background-color: ${bgColour};
                      color: ${fontColour};
                      font-family: Arial, sans-serif;
                      font-size: ${size}px;
                      z-index: 9999;
                      opacity: 0; /* Initially transparent */
                      animation: fadeIn 0.5s ease-in forwards; /* Fade in animation */
                  }
  
                  @keyframes fadeIn {
                      from {
                          opacity: 0;
                      }
                      to {
                          opacity: 1;
                      }
                  }
                  @keyframes fadeOut {
                      from {
                          opacity: 1;
                      }
                      to {
                          opacity: 0;
                      }
                  }
              `;
      document.head.appendChild(alertStyle);

      var alert = document.createElement("div");
      alert.className = `alert`;
      alert.textContent = text;
      document.body.appendChild(alert);

      if (toastConfig["soundWhenAlertEnabled"] == "true") {
        var audioLink =
          stylesToast["alert"].soundLink ??
          "https://ruby-devs.vercel.app/cdn/appear.mp3";
        var audio = new Audio(audioLink);

        audio.play();
      }

      // Schedule removal of the alert after duration
      setTimeout(function () {
        alert.style.animation = "fadeOut 0.5s ease-out forwards"; // Apply fade-out animation
        setTimeout(function () {
          alert.remove();
          alertStyle.remove();
        }, 500); // Wait for fade-out animation to complete before removing
      }, duration * 1000); // Convert duration to milliseconds
    }

    setStyleOfTo(args) {
      const cast = Scratch.Cast;
      const styleNumbers = ["fontSize", "borderRadius", "padding"];

      var style = args.STYLE;
      var alltypes = args.ALLTYPES;
      var value = args.VALUE;

      if (value == "") {
        value = null;
      }

      if (styleNumbers.includes(style)) {
        stylesToast[alltypes][style] = cast.toNumber(value);
      } else if (style == "backgroundColour" || style == "fontColour") {
        stylesToast[alltypes][style] = validColour(value) ? value : null;
      } else {
        stylesToast[alltypes][style] = value;
      }
    }

    resetStyleOf(args) {
      const alltypes = args.ALLTYPES;
      stylesToast[alltypes] = defaultStyles()[alltypes];
    }

    getStyleOf(args) {
      const alltypes = args.ALLTYPES;
      const style = stylesToast[alltypes];
      return style == null ? "undefined" : style;
    }

    getHexColour(args) {
      return args.HEX;
    }

    setConfig(args) {
      const configname = args.CONFIG;
      toastConfig[configname] = args.VALUE;
    }
  }

  Scratch.extensions.register(new ToastNotifsExt());
})(Scratch);
