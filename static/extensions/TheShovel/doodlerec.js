// Name: Doodle Recognition
// ID: imagevisionquickdraw
// Description: A implementation of Google's Quick Draw image vision model
// By: TheShovel <https://theshovel.rocks/>
// License: MIT

(function (Scratch) {
  "use strict";
  const menuIconURI =
    "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI2OS40MjE3IiBoZWlnaHQ9IjYyLjEzNTkxIiB2aWV3Qm94PSIwLDAsNjkuNDIxNyw2Mi4xMzU5MSI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwNi4zNzExOSwtMTQ2LjAwMzE3KSI+PGcgZmlsbD0iIzk5NjZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAuNSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjQzLjc2NjI4LDE1MS43NzAwOWMtMC4yMTY0MiwwIC0wLjQyNjQyLC0wLjAyNzUgLTAuNjI2NywtMC4wNzkybC0wLjAzNjIyLDAuMDA5ODhsLTAuMDYyNjYsLTAuMDM3NmMtMC4zOTg2MiwtMC4xMjA3IC0wLjc1NTE1LC0wLjMzODI3IC0xLjA0MjE5LC0wLjYyNTMybC0wLjAzMDA2LC0wLjAzMDA2bC0wLjAxMzksLTAuMDA0NjNoLTIuMDA0MTFsLTAuODA5NzEsMC4xNzk5M2wtMC43MjYyOCwwLjIwNzUxbC0wLjc0MDIyLDAuMjc3NThsLTAuNzIwMzIsMC40MTE2MWwtMC4xMjM3MiwwLjAzNDhsLTAuMTAxMjgsMC4wNzkxMmwtMS4wNDg4LDAuNDY2MTNsLTAuOTg4MDMsMC41NDg5MWwtMS4yNjIxMiwwLjgwMzE3bC0xLjQ1NzA0LDEuMDkyNzhsLTAuMTIwOTYsMC4wNTA5M2wtMC4wOTI4LDAuMDkyOGwtMS44NTA5OCwxLjExMDU5bC0xLjkzODkzLDEuMzMzMDFsLTEuNDkyNjMsMS4xMTk0N2wtMC4wODE1LDAuMDM0MzJsLTAuMDYwMzcsMC4wNjQ2MWwtMi4wNzY2OSwxLjM0Mzc0bC0xLjY3OTkxLDEuMzE5OTNsLTEuMjkwNDEsMS4wNTU3OWwtMy4wNzQ2MywzLjA3NDYzbC0xLjQ2ODI3LDEuNTgxMjJsLTEuMTA0NTgsMS43NjczM2wtMS4wNjgyNSwyLjAxNzgxbC0wLjk1NDU2LDIuMTQ3NzZsLTAuODEwNSwyLjE5OTkzbC0wLjYwMTg0LDIuNjQ4MTFsLTAuNDgwNjYsMi4xNjI5OGwtMC4yMzQwNiwyLjEwNjUxbC0wLjExOTE5LDEuOTA3MDR2MS4zNTEyN2wwLjMxNDU1LDEuNjc3NmwwLjQzNDIyLDEuNDExMjFsMC41NDI0NiwxLjMwMTkxbDAuNTkyNCwxLjA4NjA2bDEuMDAyNDMsMS4yMjUxOWwwLjAxMzUzLDAuMDI4NjhsMC4wMjQ5NiwwLjAxOTU2bDAuNzk5MTksMS4wMjc1M2wwLjkxNDcsMC45MTQ3bDEuMzUzNzUsMS4wMTUzMWwxLjYxOTMxLDEuMTIxMDZsMS45NDkxMiwxLjM0MDAybDEuODQ5NTEsMS4wNDAzNWw0LjkxMjQxLDIuMjEwNThsMi40MDYwMiwwLjg0MjExbDIuNjU1NywwLjgwODI2bDIuMjk2MDUsMC4yMjk2MWwyLjgxNTY5LDAuMjQ0ODRsMi41MTkzOSwwbDMuMjI0NDEsLTAuNDc3NjlsMy4yNzc3NiwtMC42MDY5OWwzLjMwNzUsLTAuOThsMy45NzIzLC0xLjI0MTM1bDMuMzM4NCwtMS4zNjAwOWwzLjEzNjkxLC0xLjMyNzE1bDQuNDE4NzcsLTIuNzAwMzZsMS42NDUxMiwtMS4wNTc1OGwxLjE0NzY2LC0wLjkzODk5bDAuNzY0NzcsLTAuODQ5NzVsMC40MzkxOSwtMC45NjYyMWwwLjQwNTY4LC0xLjExNTYxbDAuMTkxNDksLTEuMDUzMmwwLjExODY1LC0xLjg5ODQ2bDAuMDM0ODEsLTAuMTA5NjVsLTAuMDEwNjEsLTAuMTE0NTVsMC4yMjY1NywtMS40NzI3MXYtMS41OTgzMWwwLjAzNDE0LC0wLjEzNjU3bC0wLjAxODg1LC0wLjEzOTUxbDAuMjQwMzUsLTIuMTYzMTZ2LTEuNjUxMDNsMC4wNDA4MSwtMC4xNjMyMmwtMC4wMTg4OCwtMC4xNjcxOWwwLjIzMzcxLC0xLjc1Mjg0di0xLjYyMzU2bDAuMDQ2OSwtMC4xODc2bC0wLjAxNzgzLC0wLjE5MjU1bDAuMjI2NTcsLTEuNDcyNzFsMCwtMi4zMDE4N2wtMC4xODcyNSwtMS4yMTcxNWwtMC42NzYxNCwtMS44MDMwM2wtMC4wMzEwMSwtMC4yNzEzNGwtMC4xMDMwNCwtMC4yNTI5MmwtMC4wNjYyMiwtMC40NjM1NGwtMC45NDY1OCwtMS43ODc5OWwtMC4wMzI0NCwtMC4xMzE0N2wtMC4wNzkyOCwtMC4xMDk3N2wtMC4xNjY3OCwtMC40MTY5NWwtMC44NzU3NSwtMS4zNjIyOGwtMC4zMjEzNSwtMC4zMjEzNWwtMC4xMTY5MSwtMC4xOTQ4NmwtMC4xNzA4LC0wLjE0OTg5bC0xLjAyMjA3LC0xLjQ3NjMzbC0wLjIyNDA2LC0wLjIyNDA2bC0wLjAzODY4LC0wLjA2NDQ2bC0wLjA2MjA4LC0wLjA0MjRsLTAuODA4NjcsLTAuOTA5NzZsLTAuMTE1NTgsLTAuMDc3MDZsLTAuMDYyNzYsLTAuMDY5MDRsLTAuMDg1MzQsLTAuMDM3NzFsLTAuOTU0OTgsLTAuNzQyNzdsLTAuMjg5ODcsLTAuMTQ0OTNsLTAuMTg5MDYsLTAuMTYyMDVsLTAuMjI3NzYsLTAuMTAwNjRsLTEuMDc4MjksLTAuODM4NjdsLTAuMTc3OTYsLTAuMTE4NjRsLTAuODE3NjQsLTAuNDA4ODJsLTAuNTM3MTIsLTAuMjMwMTlsLTAuMjQ2MDQsLTAuMDYxNTFsLTAuNTYwNzUsLTAuMTI0NjFsLTAuMDYyMzEsLTAuMDMxMTVsLTAuMDY5NjYsLTAuMDE3NDJsLTAuMDEzOTMsLTAuMDI0MzhsLTAuNTU1NTEsLTAuMjc3NzZsLTAuMTQzODcsLTAuMDM1OTdsLTAuNTYwNzUsLTAuMTI0NjFsLTAuMDYyMzEsLTAuMDMxMTVsLTAuMDY5NjYsLTAuMDE3NDJsLTAuMDEzOTMsLTAuMDI0MzhsLTAuNDEzMjEsLTAuMjA2NmwtMC42NzEzNCwtMC4xOTE4MWwtMC4zMzUzNSwtMC4xOTM0N2wtMC4zNjQ2LC0wLjEzMDIxbC0wLjEwNDksLTAuMDY5OTNsLTAuMjk0NTYsLTAuMDk4MTlsLTAuMDI3MDksMC4wMDczOWwtMC4wNjE1NywtMC4wMzY5NGwtMC4wNjYwOSwtMC4wMjIwM2wtMC4zMTc0MiwtMC4yMDE5OWgtMC4xMzc0NmwtMC4yNzU1NCwtMC4wNjg4OWwtMC4wNTgzOSwwLjAyOTE5bC0wLjUzMDMzLC0wLjE4OTRsLTAuNTQ2MzIsLTAuMTM2NThsLTAuMDIxMywtMC4wMzcyOGwtMC4xMDE5MiwtMC4wMjU0OGwtMC4xODQ0MywwLjA1MDNsLTAuMjc1NDUsLTAuMTY1MjdsLTAuMzExNjQsLTAuMDc3OTFsLTAuMDYxNzcsLTAuMTA4MWwtMC40NDUzNiwtMC4wOTg5N2wtMC4wNjIzMSwtMC4wMzExNWwtMC4wNjk2NiwtMC4wMTc0MmwtMC4wMTM5MywtMC4wMjQzOGwtMC4zNjUzOSwtMC4xODI2OWwtMC4wNzc0MSwtMC4wNjYzNWgtMC4zMDU2NGwtMC41MTEyOCwtMC4xMjc4MmwtMC4xNTE3NCwtMC4wODA5M2wtMC4xNzA0LC0wLjAyMzI0bC0wLjYzOTEsLTAuMjU1NjRsLTAuMDg2LC0wLjA2MjExbC0wLjEwMzU2LC0wLjAyMzAxbC0wLjMwMzQ2LC0wLjE1MTczbC0wLjY3MTM0LC0wLjE5MTgxbC0wLjMzNTM1LC0wLjE5MzQ3bC0wLjM2NDYsLTAuMTMwMjFsLTAuMTQ0LC0wLjA5NmwtMC43NTMwOSwtMC4yODI0MWwtMC4yMzczOCwtMC4xNjM3MWwtMC4yNzE1NiwtMC4wOTY5OWwtMC4wNTg3NSwtMC4wMzkxN2wtMC41MTk1MSwtMC4xNDg0M2wtMC4wNDgyNCwtMC4wMjc4M2wtMC4wNTU1MywtMC4wMDQyN2wtMC43MjcxNiwtMC4yNDIzOWwtMC4wMDQxOSwwLjAwMjc5bC0wLjA3MDA5LC0wLjAxNTU4aC0wLjA2OTY2bC0wLjU1NzI4LC0wLjEzOTMybC0wLjAxNDU2LC0wLjAwMzI0Yy0wLjI2MDg5LDAuMDkyMzIgLTAuNTQxNjcsMC4xNDI1NiAtMC44MzQxOSwwLjE0MjU2ek0yNTAuNTIxNSwxNDguNDY4MThsMC4wNTg3NSwwLjAzOTE3bDAuNTE5NTEsMC4xNDg0M2wwLjIwMjc0LDAuMTE2OTdsMC4yMjg0OSwwLjA1MDc4bDAuNDE4MjgsMC4yMDkxNGwwLjM4NTAyLDAuMTU0MDFsMC4wNDgxLDAuMDEyMDNoMC4yMDM1MmwwLjA5NzU4LDAuMDI0NGwwLjA3NTc2LC0wLjAzNzg4bDAuNTMwMzMsMC4xODk0bDAuNTQ2MzIsMC4xMzY1OGwwLjA0MjAyLDAuMDczNTRsMC4wOTQ3MywwLjAzMzgzbDAuMjUzOTYsMC4xNjkzMWwwLjA1MDkxLDAuMDI1NDZsMC4wNjUwNywwLjAxNjI3bDAuMTg0NDMsLTAuMDUwM2wwLjI3NTQ1LDAuMTY1MjdsMC4zMTE2NCwwLjA3NzkxbDAuMDI4OTIsMC4wNTA2bDAuMTkxNjgsMC4wNjg0NmwwLjU0NjMyLDAuMTM2NThsMC4wMTI2MiwwLjAyMjA4bDAuMTk1NTQsMC4wNDg4OGgwLjA3NTdsMC40Nzg0OCwwLjExOTYybDAuMTg0NDMsLTAuMDUwM2wwLjI3NTQ1LDAuMTY1MjdsMC4zMTE2NCwwLjA3NzkxbDAuMDk0ODUsMC4xNjU5OGwwLjAxODc0LDAuMDExMjVsMC40NDk1NSwwLjE0OTg1bDAuMjgxNzIsMC4xNzkyN2wwLjMxNDQ3LDAuMTEyMzFsMC4wNTg3NSwwLjAzOTE3bDAuNTE5NTEsMC4xNDg0M2wwLjIwMjc0LDAuMTE2OTdsMC4yMjg0OSwwLjA1MDc4bDAuNDQ1NzcsMC4yMjI4OGwwLjE0Mzg3LDAuMDM1OTdsMC41NjA3NSwwLjEyNDYxbDAuMDYyMzEsMC4wMzExNWwwLjA2OTY2LDAuMDE3NDJsMC4wMTM5MywwLjAyNDM4bDAuNTU1NTEsMC4yNzc3NmwwLjA3NDY4LDAuMDE4NjdsMC40OTY3LDAuMDgwMTFsMC4yNDY3NSwwLjEwNTc1bDAuMDE4NDUsMC4wMDQ2MWwwLjAwMjQ5LDAuMDA0MzZsMC42MjcwNSwwLjI2ODc0bDAuMDU5ODUsMC4wNDU0OWwwLjA3MzM4LDAuMDE2MzFsMS4wMjI1NywwLjUxMTI4bDAuMTE5OTQsMC4xMDI4MWwwLjE0ODc3LDAuMDUzMTNsMC4zODM0NiwwLjI1NTY0bDAuMDYyNzYsMC4wNjkwNGwwLjA4NTM0LDAuMDM3NzFsMC45NTQ5OCwwLjc0Mjc3bDAuMjg5ODcsMC4xNDQ5M2wwLjE4OTA2LDAuMTYyMDVsMC4yMjc3NiwwLjEwMDY0bDEuMDc4MjksMC44Mzg2N2wwLjMwNzQ2LDAuMjA0OTdsMC4yMTYyNywwLjIzNzlsMC4yNjU1LDAuMTgxMzJsMC45NzM3NiwxLjA5NTQ4bDAuMzMxNTEsMC4zMzE1MWwwLjExNjkxLDAuMTk0ODZsMC4xNzA4LDAuMTQ5ODlsMS4wMjIwNywxLjQ3NjMzbDAuMzUxODgsMC4zNTE4OGwwLjEzODcyLDAuMjMxMmwwLjE5NjQ2LDAuMTg0NjdsMS4xNTAzOSwxLjc4OTQ5bDAuMDc3MjIsMC4yMjgxNWwwLjE0MTAyLDAuMTk1MjdsMC4yMDYyLDAuNTE1NTFsMS4wODgxLDIuMDU1MzFsMC4xMDMwNywwLjQxNzcybDAuMTYyMzMsMC4zOTg0NWwwLjA4OTMzLDAuNjI1MzJsMC42NzEzNiwxLjc5MDNsMC4wMjk1LDAuMjU4MTNsMC4xMDA2MSwwLjIzOTU0bDAuMjU1NjQsMS42NjE2N2wtMC4wMTc4MywwLjE5MjU1bDAuMDQ2OSwwLjE4NzZ2Mi42ODQyNGwtMC4wNDY5LDAuMTg3NmwwLjAxNzgzLDAuMTkyNTVsLTAuMjI2NTcsMS40NzI3MXYxLjU5ODMxbC0wLjA0MDgxLDAuMTYzMjJsMC4wMTg4OCwwLjE2NzE5bC0wLjIzMzcxLDEuNzUyODR2MS42MjM1NmwtMC4wMzQxNCwwLjEzNjU3bDAuMDE4ODUsMC4xMzk1MWwtMC4yNDAzNSwyLjE2MzE2djEuNjUxMDNsLTAuMDQ2OSwwLjE4NzZsMC4wMTc4MywwLjE5MjU1bC0wLjIzODQ4LDEuNTUwMTJsLTAuMTIwNzgsMS45MzI0OWwtMC4wNDUxNywwLjE0MjI5bDAuMDA5NzIsMC4xNDg5N2wtMC4yNTU2NCwxLjQwNjAzbC0wLjA4ODA2LDAuMTk0NjVsLTAuMDIyMTMsMC4yMTI0OWwtMC41MTEyOCwxLjQwNjAzbC0wLjA1NTYxLDAuMDgyMzlsLTAuMDE3OTYsMC4wOTc3NmwtMC42MzkxLDEuNDA2MDNsLTAuMjM4MjMsMC4yOTk3MWwtMC4xNzk0NSwwLjMzODJsLTEuMTUwMzksMS4yNzgyMWwtMC4xNTk5NCwwLjEwNzc5bC0wLjExNTIsMC4xNTQ2OWwtMS40MDYwMywxLjE1MDM5bC0wLjEzMTU3LDAuMDYyMDZsLTAuMDk5NjMsMC4xMDU5OWwtMS43ODk0OSwxLjE1MDM5bC0wLjAyNzczLDAuMDA5MzlsLTAuMDIwNTMsMC4wMjA4N2wtNC42MDE1NSwyLjgxMjA2bC0wLjE3OTM2LDAuMDU2MThsLTAuMTUwMTcsMC4xMTMwM2wtMy4zMjMzNCwxLjQwNjAzbC0wLjAxNjk5LDAuMDAyNjZsLTAuMDEzODcsMC4wMTAxNWwtMy40NTExNiwxLjQwNjAzbC0wLjEwNjA4LDAuMDE1MTVsLTAuMDkxNDcsMC4wNTU4MWwtNC4wOTAyNywxLjI3ODIxbC0wLjAxOTA0LDAuMDAxMWwtMC4wMTY0MywwLjAwOTY5bC0zLjQ1MTE2LDEuMDIyNTdsLTAuMTMzNDYsMC4wMDU3NWwtMC4xMjE1MywwLjA1NTQ2bC0zLjQ1MTE2LDAuNjM5MWwtMC4wNDYxNCwtMC4wMDI4NmwtMC4wNDI3MiwwLjAxNzY2bC0zLjQ1MTE2LDAuNTExMjhsLTAuMTg1NTIsLTAuMDE4MjJsLTAuMTgwODUsMC4wNDUyMWgtMi44MTIwNmwtMC4xMDczMywtMC4wMjY4M2wtMC4xMDkyNSwwLjAxNzQzbC0yLjkzOTg4LC0wLjI1NTY0bC0wLjAxNTczLC0wLjAwNTQybC0wLjAxNjQ2LDAuMDAyNDFsLTIuNTU2NDIsLTAuMjU1NjRsLTAuMjMyNDcsLTAuMDgzNDVsLTAuMjQ2NjgsLTAuMDEyNDZsLTIuOTM5ODgsLTAuODk0NzVsLTAuMDQ1MzMsLTAuMDI3MmwtMC4wNTI2NCwtMC4wMDQ4NGwtMi41NTY0MiwtMC44OTQ3NWwtMC4wOTE4NSwtMC4wNjAzOWwtMC4xMDgxOSwtMC4wMTk0NWwtNS4xMTI4MywtMi4zMDA3N2wtMC4wODk2NCwtMC4wNzA3bC0wLjExMDEsLTAuMDMwMTdsLTIuMDQ1MTMsLTEuMTUwMzlsLTAuMDgzMjksLTAuMDc4NzVsLTAuMTA3MzgsLTAuMDQwMDlsLTIuMDQ1MTMsLTEuNDA2MDNsLTAuMDAyNzgsLTAuMDAzMTRsLTAuMDAzOTMsLTAuMDAxNDhsLTEuNjYxNjcsLTEuMTUwMzlsLTAuMDMyMTEsLTAuMDM2NTlsLTAuMDQ0ODcsLTAuMDE4ODlsLTEuNTMzODUsLTEuMTUwMzlsLTAuMTEzNDcsLTAuMTM5NjVsLTAuMTU0MywtMC4wOTI1OGwtMS4xNTAzOSwtMS4xNTAzOWwtMC4wODEyOCwtMC4xMzU0NmwtMC4xMjQzNCwtMC4wOTc0NWwtMC44NzU4LC0xLjEyNjAzbC0xLjEzMDg1LC0xLjM4MjE1bC0wLjEwMDQsLTAuMjEyODZsLTAuMTU5NDQsLTAuMTczMTFsLTAuNzY2OTIsLTEuNDA2MDNsLTAuMDMzNDksLTAuMTI4ODJsLTAuMDc5NDYsLTAuMTA2NzhsLTAuNjM5MSwtMS41MzM4NWwtMC4wMTgzMSwtMC4xMjEzMWwtMC4wNjM0NCwtMC4xMDUwMWwtMC41MTEyOCwtMS42NjE2N2wtMC4wMDc3LC0wLjE0MzdsLTAuMDYwMDMsLTAuMTMwNzlsLTAuMzgzNDYsLTIuMDQ1MTNsMC4wMTM5NSwtMC4yMzM2NWwtMC4wNTY3NywtMC4yMjcwN3YtMS42NjE2N2wwLjAxOTM2LC0wLjA3NzQ0bC0wLjAxNDQ5LC0wLjA3ODVsMC4xMjc4MiwtMi4wNDUxM2wwLjAxODcsLTAuMDU4OWwtMC4wMDgyOCwtMC4wNjEyNGwwLjI1NTY0LC0yLjMwMDc3bDAuMDQ3ODYsLTAuMTI4ODVsLTAuMDAzNjIsLTAuMTM3NGwwLjUxMTI4LC0yLjMwMDc3bDAuMDAyNzcsLTAuMDA1NTRsLTAuMDAwMTMsLTAuMDA2MTlsMC42MzkxLC0yLjgxMjA2bDAuMDc0MjUsLTAuMTQ2NzNsMC4wMTc3MywtMC4xNjM0OGwwLjg5NDc1LC0yLjQyODZsMC4wNDY5NSwtMC4wNjg5M2wwLjAxNDM4LC0wLjA4MjE1bDEuMDIyNTcsLTIuMzAwNzdsMC4wNTQwMywtMC4wNjkxNmwwLjAyMTAzLC0wLjA4NTIxbDEuMTUwMzksLTIuMTcyOTVsMC4wNjEyMSwtMC4wNjgxNGwwLjAyODI2LC0wLjA4NzEzbDEuMjc4MjEsLTIuMDQ1MTNsMC4xNzI0NSwtMC4xNjYyOWwwLjExNTU3LC0wLjIwOTg0bDEuNjYxNjcsLTEuNzg5NDlsMC4wMzk3OSwtMC4wMjU5MmwwLjAyNDQzLC0wLjA0MDcybDMuMTk1NTIsLTMuMTk1NTJsMC4xMDg4NSwtMC4wNjUzMWwwLjA3NTgyLC0wLjEwMTgxbDEuNDA2MDMsLTEuMTUwMzlsMC4wMjI5NywtMC4wMTA4NGwwLjAxNTU3LC0wLjAyMDA3bDEuNzg5NDksLTEuNDA2MDNsMC4xMDY2NSwtMC4wNDc3NWwwLjA3OTc4LC0wLjA4NTM4bDIuMTAwMzEsLTEuMzU5MDJsMS40NjQ2MywtMS4wOTg0N2wwLjA0ODcsLTAuMDIwNWwwLjAzNDk4LC0wLjAzOTZsMi4wNDUxMywtMS40MDYwM2wwLjA3NDEzLC0wLjAyNzY4bDAuMDU1OTUsLTAuMDU1OTVsMS44MDY3MiwtMS4wODQwM2wxLjQzMDY4LC0xLjA3MzAxbDAuMDkwMzQsLTAuMDM4MDRsMC4wNjc0NywtMC4wNzExMWwxLjQwNjAzLC0wLjg5NDc1bDAuMDcyMzcsLTAuMDI0MTJsMC4wNTU3MSwtMC4wNTIxMmwxLjE1MDM5LC0wLjYzOTFsMC4xMDk0NiwtMC4wMjkzN2wwLjA4OTMsLTAuMDY5NzdsMS4wMzUwMSwtMC40NmwwLjc4NTEyLC0wLjQ0ODY0bDAuMTk1NDIsLTAuMDU0OTZsMC4xNjcxMiwtMC4xMTUyNWwxLjAyMjU3LC0wLjM4MzQ2bDAuMTAyMDQsLTAuMDExNjZsMC4wODg5NiwtMC4wNTEzMmwwLjg5NDc1LC0wLjI1NTY0bDAuMDc2MjQsLTAuMDAyNTRsMC4wNjgyMywtMC4wMzQxMmwxLjE1MDM5LC0wLjI1NTY0bDAuMjc1MjMsMC4wMDcyNGwwLjI2NzEsLTAuMDY2NzhoMy4xOTU1MmwwLjQ3ODQ4LDAuMTE5NjJsMC4xODQ0MywtMC4wNTAzbDAuMjc1NDUsMC4xNjUyN2wwLjA4NDIsMC4wMjEwNWgwLjEyNzgybDAuNDU5MzQsMC4xMTQ4NGwwLjQ2OTE0LDAuMDYzOTdsMC42MzkxLDAuMjU1NjRsMC4wODYsMC4wNjIxMWwwLjEwMzU2LDAuMDIzMDFsMC4wNjIzMSwwLjAzMTE1bDAuMjMyMSwwLjA1ODAzbDAuNDAwNjksMC4wMzA4MmwxLjA5ODg1LDAuMzY2MjhsMC44NDI1MSwwLjI0MDcybDAuMzM1MzUsMC4xOTM0N2wwLjM2NDYsMC4xMzAyMWwwLjE0NCwwLjA5NmwwLjc1MzA5LDAuMjgyNDFsMC4yMzczOCwwLjE2MzcxeiIvPjxwYXRoIGQ9Ik0yMzUuMDg3NDMsMTg5Ljk3MzU0YzQuNDQ5MDksMC4yNDQxNCAxMC44Njg5MSwwLjE5MTA1IDE1LjA5NjU4LC0xLjA0Njg3YzIuNDIzMzYsLTAuNzA5NTkgNi4xNjM2OCwtMy41NTQ2MSA4LjEyMTgyLC0yLjEzMDQzYzAuNzQ3MTcsMC41NDM0MyAxLjM3ODAxLDAuNzU2MzEgMS4xMjYsMS45NzA1Yy0xLjYwNDk2LDcuNzMyOCAtMjkuOTgyNzgsMTAuMjEzMDkgLTMwLjcwNDkxLDEuMDA3MDdjLTAuMDY4MjUsLTAuMjE2ODUgLTAuMTA3NzUsLTAuNDQ2NDUgLTAuMTE0MDIsLTAuNjg0MzJjLTAuMDAwNTksLTAuMDIyMyAtMC4wMDA4OCwtMC4wNDQ2NyAtMC4wMDA4OCwtMC4wNjcxMWMwLC0xLjM4MDcxIDEuMTE5MjksLTIuNSAyLjUsLTIuNWMxLjMyNTcsMCAyLjQxMDQsMS4wMzE4OCAyLjQ5NDcyLDIuMzM2MjdjMC42NzUsMC42MTA0MyAxLjI3NTY4LDEuMTAzNjQgMS40ODA2OSwxLjExNDg5eiIvPjxwYXRoIGQ9Ik0yMzAuOTEyNzksMTc0Ljk2MjA4YzAsLTEuMzgwNzEgMS4xMTkyOSwtMi41IDIuNSwtMi41YzEuMzgwNzEsMCAyLjUsMS4xMTkyOSAyLjUsMi41YzAsMS4zODA3MSAtMS4xMTkyOSwyLjUgLTIuNSwyLjVjLTEuMzgwNzEsMCAtMi41LC0xLjExOTI5IC0yLjUsLTIuNXoiLz48cGF0aCBkPSJNMjUwLjQ2OTM4LDE3My44MTE2OWMwLC0xLjM4MDcxIDEuMTE5MjksLTIuNSAyLjUsLTIuNWMxLjM4MDcxLDAgMi41LDEuMTE5MjkgMi41LDIuNWMwLDEuMzgwNzEgLTEuMTE5MjksMi41IC0yLjUsMi41Yy0xLjM4MDcxLDAgLTIuNSwtMS4xMTkyOSAtMi41LC0yLjV6Ii8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzMuNjI4ODEwNjA4MzMwODQ6MzMuOTk2ODMwMjY1NjEwNDEtLT4=";
  const blockIconURI = menuIconURI;
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  let mx = 0;
  let my = 0;
  document.addEventListener("click", function (event) {
    mx = event.pageX;
    my = event.pageY;
  });
  const cropArea = document.createElement("canvas");
  cropArea.id = "cropArea";
  cropArea.width = 480;
  cropArea.height = 360;
  const ctx = cropArea.getContext("2d");
  const canvas = vm.renderer.canvas;
  let img;
  let cropPosX = 0;
  let cropPosY = 0;
  let cropWidth = 100;
  let cropHeight = 100;
  let doodleModel = null;
  const classes = [
    "airplane",
    "alarm clock",
    "anvil",
    "apple",
    "axe",
    "baseball bat",
    "baseball",
    "basketball",
    "beard",
    "bed",
    "bench",
    "bicycle",
    "bird",
    "book",
    "bread",
    "bridge",
    "broom",
    "butterfly",
    "camera",
    "candle",
    "car",
    "cat",
    "ceiling fan",
    "cell phone",
    "chair",
    "circle",
    "clock",
    "cloud",
    "coffee cup",
    "cookie",
    "cup",
    "diving board",
    "donut",
    "door",
    "drums",
    "dumbbell",
    "envelope",
    "eye",
    "eyeglasses",
    "face",
    "fan",
    "flower",
    "frying pan",
    "grapes",
    "hammer",
    "hat",
    "headphones",
    "helmet",
    "hot dog",
    "ice cream",
    "key",
    "knife",
    "ladder",
    "laptop",
    "light bulb",
    "lightning",
    "line",
    "lollipop",
    "microphone",
    "moon",
    "mountain",
    "moustache",
    "mushroom",
    "pants",
    "paper clip",
    "pencil",
    "pillow",
    "pizza",
    "power outlet",
    "radio",
    "rainbow",
    "rifle",
    "saw",
    "scissors",
    "screwdriver",
    "shorts",
    "shovel",
    "smiley face",
    "snake",
    "sock",
    "spider",
    "spoon",
    "square",
    "star",
    "stop sign",
    "suitcase",
    "sun",
    "sword",
    "syringe",
    "t-shirt",
    "table",
    "tennis racquet",
    "tent",
    "tooth",
    "traffic light",
    "tree",
    "triangle",
    "umbrella",
    "wheel",
    "wristwatch",
  ];
  class imagevisionquickdraw {
    constructor() {
      this.loadModel();
    }

    getInfo() {
      return {
        id: "imagevisionquickdraw",
        name: "Doodle Recognition",
        menuIconURI: menuIconURI,
        blockIconURI: blockIconURI,
        color1: "#ffd139",
        blockText: "#000000",
        blocks: [
          {
            opcode: "areaposition",
            blockType: Scratch.BlockType.COMMAND,
            text: "set area position x: [X] y: [Y]",
            disableMonitor: true,
            arguments: {
              X: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
              Y: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 0,
              },
            },
          },
          {
            opcode: "areasize",
            blockType: Scratch.BlockType.COMMAND,
            text: "set area size width: [W]% height: [H]%",
            disableMonitor: true,
            arguments: {
              W: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
              H: {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 100,
              },
            },
          },
          {
            opcode: "fitstage",
            blockType: Scratch.BlockType.COMMAND,
            text: "fit area to stage",
            disableMonitor: true,
          },
          {
            blockType: Scratch.BlockType.LABEL,
            text: "This is what the computer sees",
          },
          {
            opcode: "cropareapreview",
            blockType: Scratch.BlockType.BUTTON,
            text: "Area preview",
            disableMonitor: true,
          },
          "---",
          {
            opcode: "classifyStage",
            blockType: Scratch.BlockType.REPORTER,
            text: "scan area",
            disableMonitor: true,
          },
          {
            opcode: "isinarea",
            blockType: Scratch.BlockType.BOOLEAN,
            text: "is a [GUESS] in area?",
            disableMonitor: true,
            arguments: {
              GUESS: {
                type: Scratch.ArgumentType.STRING,
                menu: "guesses",
              },
            },
          },
          "---",
          {
            opcode: "possibleguesses",
            blockType: Scratch.BlockType.REPORTER,
            text: "possible guesses",
            disableMonitor: true,
          },
        ],
        menus: {
          guesses: {
            acceptReporters: true,
            items: classes,
          },
        },
      };
    }

    async loadModel() {
      if (doodleModel) {
        return;
      }

      try {
        if (typeof tf === "undefined") {
          await this.loadScript(
            "https://unpkg.com/@tensorflow/tfjs@4.22.0/dist/tf.min.js",
          );
        }

        // The URL you are using to load your model is:
        // http://localhost:8000/model.json
        doodleModel = await tf.loadLayersModel(
          "https://raw.githubusercontent.com/TheShovel/doodle-recognition/refs/heads/main/model.json",
        );
        console.log("Custom Doodle Classifier model loaded successfully.");
      } catch (error) {
        console.error("Error loading the model:", error);
      }
    }

    loadScript(url) {
      return new Promise((resolve) => {
        const script = document.createElement("script");
        script.onload = resolve;
        script.src = url;
        document.head.appendChild(script);
      });
    }

    async clasifyThings(args, util) {
      return new Promise(async (resolve, reject) => {
        try {
          await this.loadModel();
          const imageData = await new Promise((e) => {
            vm.renderer.requestSnapshot((t) => {
              e(t);
            });
          });
          let tempImg;
          img = new Image();
          const stampWait = new Promise((resolve) => {
            tempImg = new Image();
            tempImg.onload = resolve;
            tempImg.src = imageData;
          });
          await stampWait;
          cropArea.width = canvas.width * (cropWidth / 100);
          cropArea.height = canvas.height * (cropHeight / 100);
          ctx.clearRect(0, 0, cropArea.width, cropArea.height);
          ctx.drawImage(
            tempImg,
            cropArea.width / 2 -
              tempImg.width / 2 +
              (cropPosX * canvas.width) / vm.runtime.stageWidth,
            cropArea.height / 2 -
              tempImg.height / 2 +
              (cropPosY * canvas.height) / vm.runtime.stageHeight,
            tempImg.width,
            tempImg.height,
          );
          img.src = cropArea.toDataURL();

          img.onload = async () => {
            const tensor = tf.browser.fromPixels(img, 1);
            const resized = tf.image
              .resizeBilinear(tensor, [28, 28])
              .reshape([28, 28, 1])
              .toFloat();
            const normalized = tf
              .scalar(1.0)
              .sub(resized.div(tf.scalar(255.0)));
            const batched = normalized.expandDims(0);
            const predictions = doodleModel.predict(batched);
            const predictionData = predictions.dataSync();
            const topk = tf.topk(predictions, 5);
            const topkValues = topk.values.dataSync();
            const topkIndices = topk.indices.dataSync();

            const results = [];
            for (let i = 0; i < topkIndices.length; i++) {
              results.push({
                className: classes[topkIndices[i]],
                probability: topkValues[i].toFixed(3),
              });
            }
            tensor.dispose();
            predictions.dispose();

            resolve(JSON.stringify(results.map((r) => r)));
          };
        } catch (error) {
          console.error("Image processing error:", error);
          resolve("Error");
        }
      });
    }
    async classifyStage(args, util) {
      return await this.clasifyThings(args, util);
    }
    areaposition(args) {
      cropPosX = args.X;
      cropPosY = args.Y;
    }
    areasize(args) {
      cropWidth = args.W;
      cropHeight = args.H;
    }
    fitstage() {
      cropWidth = 100;
      cropHeight = 100;
      cropPosX = 0;
      cropPosY = 0;
    }
    async cropareapreview(args, util, event) {
      await this.clasifyThings(args, util);
      const previewImage = document.createElement("img");
      cropArea.width = 28;
      cropArea.height = 28;
      ctx.clearRect(0, 0, cropArea.width, cropArea.height);
      ctx.drawImage(img, 0, 0, cropArea.width, cropArea.height);
      img.src = cropArea.toDataURL();
      previewImage.src = img.src;
      previewImage.style.position = "absolute";
      previewImage.style.left = mx + "px";
      previewImage.style.top = my + "px";
      previewImage.style.borderRadius = "4px";
      previewImage.style.width = "300px";
      previewImage.style.height = "300px";
      previewImage.style.filter = "grayscale(1)";
      previewImage.style.zIndex = 9999;
      previewImage.style.imageRendering = "pixelated";
      document.body.appendChild(previewImage);
      await delay(100);
      let oldm = mx + my;
      async function waitForClick() {
        if (oldm == mx + my) {
          await delay(50);
          waitForClick();
        } else {
          previewImage.remove();
        }
      }
      waitForClick();
    }
    possibleguesses() {
      return JSON.stringify(classes);
    }
    async isinarea(args, util) {
      const tempGuesses = await this.clasifyThings(args, util);
      const parsedGuesses = JSON.parse(tempGuesses);
      for (const guessResult of parsedGuesses) {
        if (guessResult.className === args.GUESS) {
          return true;
        }
      }
      return false;
    }
  }

  Scratch.extensions.register(new imagevisionquickdraw());
})(Scratch);
