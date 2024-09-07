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
  const ico = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MC45ODciIGZpbGw9IiNmNzllNjAiIGQ9Ik0gMjI4LjUsLTAuNSBDIDIzMy4xNjcsLTAuNSAyMzcuODMzLC0wLjUgMjQyLjUsLTAuNUMgMjkyLjgzNSwxLjgzNjM4IDM0MC41MDEsMTQuNjY5NyAzODUuNSwzOEMgNDEzLjYxNSw1My4xMTUyIDQzNS40NDksNzQuNjE1MiA0NTEsMTAyLjVDIDQ1NC45NTMsMTEwLjA2NiA0NTcuNDUzLDExOC4wNjYgNDU4LjUsMTI2LjVDIDQ0OC4zOCwxMDEuMTU0IDQzMS4zOCw4MS42NTQxIDQwNy41LDY4QyAzNjcuNTYsNDUuMjYxMyAzMjQuNTYsMzIuNTk0NyAyNzguNSwzMEMgMjYzLjY2MSwyOS4xNzI0IDI0OC45OTQsMjkuMzM5MSAyMzQuNSwzMC41QyAxOTEuNDMsMzIuMjQ0NyAxNTAuNzYzLDQzLjA3OCAxMTIuNSw2M0MgOTQuMjgyLDczLjIxMDkgNzguNDQ4Niw4Ni4zNzc1IDY1LDEwMi41QyA0NS4yNDkyLDEzMS41OTUgNDUuOTE1OCwxNjAuMjYyIDY3LDE4OC41QyA3NS44MTM4LDE5OC43MzYgODUuNDgwNSwyMDguMDY5IDk2LDIxNi41QyA5Ny44NjA1LDIxOC44ODggOTkuMTkzOSwyMjEuNTU0IDEwMCwyMjQuNUMgMTAwLjUsMjkzLjQ5OSAxMDAuNjY3LDM2Mi40OTkgMTAwLjUsNDMxLjVDIDEwMC4wNjksNDQyLjU3OCAxMDAuNTY5LDQ1My41NzggMTAyLDQ2NC41QyAxMDUuMzU1LDQ3MS42ODcgMTEwLjUyMiw0NzcuMDIxIDExNy41LDQ4MC41QyA4OC42OTY0LDQ3My4zNjIgNzIuNjk2NCw0NTUuMDI5IDY5LjUsNDI1LjVDIDY5LjY2NjcsMzYxLjQ5OSA2OS41LDI5Ny40OTkgNjksMjMzLjVDIDQ5LjIyMDIsMjE3LjU5IDM0LjU1MzUsMTk3LjkyMyAyNSwxNzQuNUMgMTQuNDAzNywxMzYuODkgMjIuMDcwNCwxMDMuNTU3IDQ4LDc0LjVDIDc4Ljc4OTcsNDQuMDExNSAxMTUuMjksMjMuMTc4MSAxNTcuNSwxMkMgMTgwLjk3LDUuODY3NDggMjA0LjYzNiwxLjcwMDgyIDIyOC41LC0wLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2Q3N2Q0MSIgZD0iTSAyNDIuNSwtMC41IEMgMjU1LjgzMywtMC41IDI2OS4xNjcsLTAuNSAyODIuNSwtMC41QyAzMzMuOTk4LDIuOTQzMTQgMzgxLjk5OCwxNy43NzY1IDQyNi41LDQ0QyA0NTEuMjU2LDU5LjA4ODMgNDcwLjA5LDc5LjU4ODMgNDgzLDEwNS41QyA0OTcuNjY2LDE0NS41MDEgNDkwLjk5OSwxODEuNTAxIDQ2MywyMTMuNUMgNDU2LjMwMywyMjAuNTMyIDQ0OS4zMDMsMjI3LjE5OCA0NDIsMjMzLjVDIDQ0MS45NzksMzExLjE5MyA0NDEuMzEzLDM4OC44NiA0NDAsNDY2LjVDIDQzMy41NDMsNDkwLjQ1OCA0MTguMzc2LDUwNS40NTggMzk0LjUsNTExLjVDIDMwMS44MzMsNTExLjUgMjA5LjE2Nyw1MTEuNSAxMTYuNSw1MTEuNUMgOTIuNjIzOSw1MDUuNDU4IDc3LjQ1NzIsNDkwLjQ1OCA3MSw0NjYuNUMgNjkuNjM4NCw0NTIuODc0IDY5LjEzODQsNDM5LjIwOCA2OS41LDQyNS41QyA3Mi42OTY0LDQ1NS4wMjkgODguNjk2NCw0NzMuMzYyIDExNy41LDQ4MC41QyAyMDguMTM5LDQ4MS42NTkgMjk4LjgwNSw0ODEuODI2IDM4OS41LDQ4MUMgNDAxLjUxMiw0NzcuNjUyIDQwOC42NzksNDY5LjgxOSA0MTEsNDU3LjVDIDQxMS4zMzMsMzc5LjUgNDExLjY2NywzMDEuNSA0MTIsMjIzLjVDIDQxMi43MjUsMjIxLjA1MSA0MTMuNzI1LDIxOC43MTcgNDE1LDIxNi41QyA0MjQuMjY3LDIwOS4yMzYgNDMyLjkzNCwyMDEuMjM2IDQ0MSwxOTIuNUMgNDU3Ljc3MSwxNzMuNDE2IDQ2My42MDUsMTUxLjQxNiA0NTguNSwxMjYuNUMgNDU3LjQ1MywxMTguMDY2IDQ1NC45NTMsMTEwLjA2NiA0NTEsMTAyLjVDIDQzNS40NDksNzQuNjE1MiA0MTMuNjE1LDUzLjExNTIgMzg1LjUsMzhDIDM0MC41MDEsMTQuNjY5NyAyOTIuODM1LDEuODM2MzggMjQyLjUsLTAuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZmNkOGIzIiBkPSJNIDIzNC41LDMwLjUgQyAyNDguOTk0LDI5LjMzOTEgMjYzLjY2MSwyOS4xNzI0IDI3OC41LDMwQyAzMjQuNTYsMzIuNTk0NyAzNjcuNTYsNDUuMjYxMyA0MDcuNSw2OEMgNDMxLjM4LDgxLjY1NDEgNDQ4LjM4LDEwMS4xNTQgNDU4LjUsMTI2LjVDIDQ2My42MDUsMTUxLjQxNiA0NTcuNzcxLDE3My40MTYgNDQxLDE5Mi41QyA0MzIuOTM0LDIwMS4yMzYgNDI0LjI2NywyMDkuMjM2IDQxNSwyMTYuNUMgNDEzLjcyNSwyMTguNzE3IDQxMi43MjUsMjIxLjA1MSA0MTIsMjIzLjVDIDQxMS42NjcsMzAxLjUgNDExLjMzMywzNzkuNSA0MTEsNDU3LjVDIDQwOC42NzksNDY5LjgxOSA0MDEuNTEyLDQ3Ny42NTIgMzg5LjUsNDgxQyAyOTguODA1LDQ4MS44MjYgMjA4LjEzOSw0ODEuNjU5IDExNy41LDQ4MC41QyAxMTAuNTIyLDQ3Ny4wMjEgMTA1LjM1NSw0NzEuNjg3IDEwMiw0NjQuNUMgMTAwLjU2OSw0NTMuNTc4IDEwMC4wNjksNDQyLjU3OCAxMDAuNSw0MzEuNUMgMTA0LjA4LDQ0MS41NzcgMTExLjA4LDQ0OC4wNzcgMTIxLjUsNDUxQyAyMDAuODMzLDQ1MS42NjcgMjgwLjE2Nyw0NTEuNjY3IDM1OS41LDQ1MUMgMzcwLjM2LDQ0OC4xNCAzNzcuMTkzLDQ0MS4zMDcgMzgwLDQzMC41QyAzODAuMzMzLDM2MS44MzMgMzgwLjY2NywyOTMuMTY3IDM4MSwyMjQuNUMgMzg1LjAzNSwyMTUuNzk2IDM5MS4yMDEsMjA4Ljk2MyAzOTkuNSwyMDRDIDQ0MS43MjksMTYyLjMxMyA0NDAuNzI5LDEyMS42NDYgMzk2LjUsODJDIDM2Ni43MzcsNTkuNDU4NyAzMzMuNDAzLDQ0LjQ1ODcgMjk2LjUsMzdDIDI3Ni4wNjEsMzIuNTMyIDI1NS4zOTQsMzAuMzY1NCAyMzQuNSwzMC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmZWU3YzciIGQ9Ik0gMjM0LjUsMzAuNSBDIDI1NS4zOTQsMzAuMzY1NCAyNzYuMDYxLDMyLjUzMiAyOTYuNSwzN0MgMzMzLjQwMyw0NC40NTg3IDM2Ni43MzcsNTkuNDU4NyAzOTYuNSw4MkMgNDQwLjcyOSwxMjEuNjQ2IDQ0MS43MjksMTYyLjMxMyAzOTkuNSwyMDRDIDM5MS4yMDEsMjA4Ljk2MyAzODUuMDM1LDIxNS43OTYgMzgxLDIyNC41QyAzODAuNjY3LDI5My4xNjcgMzgwLjMzMywzNjEuODMzIDM4MCw0MzAuNUMgMzc3LjE5Myw0NDEuMzA3IDM3MC4zNiw0NDguMTQgMzU5LjUsNDUxQyAyODAuMTY3LDQ1MS42NjcgMjAwLjgzMyw0NTEuNjY3IDEyMS41LDQ1MUMgMTExLjA4LDQ0OC4wNzcgMTA0LjA4LDQ0MS41NzcgMTAwLjUsNDMxLjVDIDEwMC42NjcsMzYyLjQ5OSAxMDAuNSwyOTMuNDk5IDEwMCwyMjQuNUMgOTkuMTkzOSwyMjEuNTU0IDk3Ljg2MDUsMjE4Ljg4OCA5NiwyMTYuNUMgODUuNDgwNSwyMDguMDY5IDc1LjgxMzgsMTk4LjczNiA2NywxODguNUMgNDUuOTE1OCwxNjAuMjYyIDQ1LjI0OTIsMTMxLjU5NSA2NSwxMDIuNUMgNzguNDQ4Niw4Ni4zNzc1IDk0LjI4Miw3My4yMTA5IDExMi41LDYzQyAxNTAuNzYzLDQzLjA3OCAxOTEuNDMsMzIuMjQ0NyAyMzQuNSwzMC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTgiIGQ9Ik0gMTUzLjUsOTguNSBDIDE1OS41MjMsOTcuMTk2NiAxNjMuMTg5LDk5LjUzIDE2NC41LDEwNS41QyAxNjIuMDkxLDExMi43MDIgMTU3LjU5MSwxMTQuMzY5IDE1MSwxMTAuNUMgMTQ4LjUyMywxMDUuNjY5IDE0OS4zNTYsMTAxLjY2OSAxNTMuNSw5OC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmM0OTgiIGQ9Ik0gMzMwLjUsMTEyLjUgQyAzMzguMjAxLDExMi4zNjIgMzQxLjM2NywxMTYuMDI5IDM0MCwxMjMuNUMgMzM0LjgzNywxMjkuMDYyIDMzMC4xNzEsMTI4LjcyOSAzMjYsMTIyLjVDIDMyNS40MzgsMTE4LjIzMiAzMjYuOTM4LDExNC44OTggMzMwLjUsMTEyLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzM5OCIgZD0iTSAxMjQuNSwxNDAuNSBDIDEzMC41MjMsMTM5LjE5NyAxMzQuMTg5LDE0MS41MyAxMzUuNSwxNDcuNUMgMTMzLjA5MSwxNTQuNzAyIDEyOC41OTEsMTU2LjM2OSAxMjIsMTUyLjVDIDExOS41MjMsMTQ3LjY2OSAxMjAuMzU2LDE0My42NjkgMTI0LjUsMTQwLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzQ5OSIgZD0iTSAzNzQuNSwxNDIuNSBDIDM4NC4xMSwxNDIuOTM2IDM4Ni43NzYsMTQ3LjQzNiAzODIuNSwxNTZDIDM3NC40NjMsMTU5LjYwMSAzNzAuMjk2LDE1Ny4xMDEgMzcwLDE0OC41QyAzNzEuMzMyLDE0Ni4zNCAzNzIuODMyLDE0NC4zNCAzNzQuNSwxNDIuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNIDIwNy41LDE2MS41IEMgMjE1LjE2MSwxNjAuNjYzIDIxOC42NjEsMTYzLjk5NiAyMTgsMTcxLjVDIDIxNC4yOTUsMTc1Ljk4MiAyMDkuOTYyLDE3Ni42NDkgMjA1LDE3My41QyAyMDIuNTIzLDE2OC42NjkgMjAzLjM1NiwxNjQuNjY5IDIwNy41LDE2MS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMzUyLjUsMjE5LjUgQyAzNjEuNjEsMjE5Ljc3MiAzNjQuNDQzLDIyNC4xMDUgMzYxLDIzMi41QyAyOTQuMTY3LDI5OS4zMzMgMjI3LjMzMywzNjYuMTY3IDE2MC41LDQzM0MgMTUxLjg3Niw0MzUuNzEzIDE0OC4wNDMsNDMyLjU0NiAxNDksNDIzLjVDIDIxNy4wMzUsMzU1LjYzMiAyODQuODY4LDI4Ny42MzIgMzUyLjUsMjE5LjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzQ5OCIgZD0iTSAyOTYuNSwyMjEuNSBDIDMwNi4wOTgsMjIyLjM2MiAzMDguNTk4LDIyNy4wMjkgMzA0LDIzNS41QyAyNTcuMTY3LDI4Mi4zMzMgMjEwLjMzMywzMjkuMTY3IDE2My41LDM3NkMgMTU2Ljg2MSwzODAuMTc3IDE1Mi41MjcsMzc4LjUxMSAxNTAuNSwzNzFDIDE1MC41NDIsMzY5LjAzMyAxNTEuMDQyLDM2Ny4xOTkgMTUyLDM2NS41QyAyMDAuMDYyLDMxNy4yNzIgMjQ4LjIyOCwyNjkuMjcyIDI5Ni41LDIyMS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMjMxLjUsMjI5LjUgQyAyNDEuMjQ1LDIyOC40MDUgMjQ0LjQxMSwyMzIuNDA1IDI0MSwyNDEuNUMgMjE3LjE2NywyNjUuMzMzIDE5My4zMzMsMjg5LjE2NyAxNjkuNSwzMTNDIDE2MC44OTQsMzE1LjczMiAxNTcuMDYxLDMxMi41NjYgMTU4LDMwMy41QyAxODIuNzAyLDI3OC45NjUgMjA3LjIwMiwyNTQuMjk5IDIzMS41LDIyOS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMzQ5LjUsMjc2LjUgQyAzNTkuMTQ4LDI3NS40OCAzNjIuMzE1LDI3OS40OCAzNTksMjg4LjVDIDMxMS41LDMzNiAyNjQsMzgzLjUgMjE2LjUsNDMxQyAyMDcuOTI4LDQzMy43NjkgMjA0LjA5NCw0MzAuNjAyIDIwNSw0MjEuNUMgMjUzLjM2OCwzNzMuMjk5IDMwMS41MzUsMzI0Ljk2NSAzNDkuNSwyNzYuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNIDM0My41LDMzOS41IEMgMzUzLjYxNSwzNDAuMTExIDM1Ni4xMTUsMzQ0Ljc3OCAzNTEsMzUzLjVDIDMyNy44MzMsMzc2LjY2NyAzMDQuNjY3LDM5OS44MzMgMjgxLjUsNDIzQyAyNzYuNzQsNDI2Ljc3NyAyNzIuNTczLDQyNi4yNzcgMjY5LDQyMS41QyAyNjguMjEsNDE4LjM2NiAyNjguNTQzLDQxNS4zNjYgMjcwLDQxMi41QyAyOTQuMzk1LDM4Ny45MzggMzE4Ljg5NSwzNjMuNjA1IDM0My41LDMzOS41IFoiLz48L2c+Cjwvc3ZnPgo=";

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

  function xmlEscapeOld(str) { // love u :3 @yri5
    if (/[&<>"']/.test(str)) {
      return "You little piece of thingy i love you :3c Just don't try exploiting again.";
    }
    return str;
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
      var type = xmlEscape(args.TYPE);
      var duration = args.DURATION; // New argument for duration

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
      alert.className = `alert ${type}`;
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
