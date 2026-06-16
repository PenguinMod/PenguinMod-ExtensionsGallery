// Version V.1.3.1

(function (Scratch) {
  "use strict";
  if (!Scratch.extensions.unsandboxed) throw new Error("Achievement Engine must run unsandboxed!");

  const menuIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1MC4wNDU4MyIgaGVpZ2h0PSI0Mi40MzczNSIgdmlld0JveD0iMCwwLDUwLjA0NTgzLDQyLjQzNzM1Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjMxOS44NjQ0MSIgeTE9IjE2MC4zMDg4NiIgeDI9IjMxOS44NjQ0MSIgeTI9IjE5OS42OTExOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZGE5MDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYzg0MDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjk0Ljk3NzA5LC0xNTguNzgxMzIpIj48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxnPjxwYXRoIGQ9Ik0zMzMuODYxMjgsMTU4Ljk5MzgzbDAuOTQ5NjksMC40OTQzNmMwLjg1NzU4LDEuMDM1NDYgMi4xOTA0NywyLjQzNTM4IDIuNTU2NDUsMy43NzMwMWMwLjM4Mjk5LDEuMzk5ODEgLTAuODg0ODgsMy4yMjQ5NiAwLjk0MTExLDMuNDAyNjJjMS42NzY2OSwwLjU1NzMyIDMuMzg2MDYsMC45MjQ5OSA0LjcwMjQ0LDIuMjM4OTFjNy4zNDAzMSw3LjMyNjU4IC03LjcyNDc5LDguODU4MDMgLTguMjc0OTMsMTAuNzY1MTJjLTIuMDA4MzQsMy4zNjI4MSAtNi4xOTc0LDMuNzQxNjcgLTcuODI0NjIsNS43MDI4OGMtMC43OTk2OCwwLjk2MzgyIDEuMDY4ODUsNy42MzUzNiAwLjk5MDE4LDkuMTAxMjNjLTAuMDA2OTksMC4xMzAyOCAtMC4xNDU2OSwwLjIxNjQ5IC0wLjIxODUyLDAuMzI0NzRjMi43MzU1MiwtMi4xMjE0MSA1LjQ0NzkxLDEuNzcxNDcgNC4xOTAyNyw0LjQyNTQxYy0xLjA3MTc2LDIuMjYxNjkgLTEwLjk5NTIzLDEuODcyMDYgLTEzLjI2MzMxLDEuODcyMDZjLTEuNjk0NzEsMCAtNC4yMTEzNiwwLjM3NTU3IC01LjgwNzc5LC0wLjE3Nzg4Yy0xLjQyMzkyLC0wLjQ5MzY0IC0xLjkyNjk5LC0zLjM3MTQ3IC0wLjk2NjIsLTQuNDg2MjFjMC43MTg3MSwtMC44MzM4OCA1Ljg3MDg2LC0wLjU4OSA1Ljk0NjM4LC0xLjExMjYyYzAuMzEwMDQsLTIuMTQ5NzEgLTAuMDc5NTIsLTQuNzE2MDQgLTAuNDYxNzUsLTYuODM4NjFjLTAuMDAyNTIsLTUuNzczMTEgLTQuODUwNzksLTEuNTU4ODMgLTkuMzg3MzYsLTUuNjE2NDZjLTAuNjY2MTYsLTAuNTk1ODMgLTEuMjY5NTIsLTIuMTE3MTEgLTEuNTYxMTcsLTEuNzM5NjljMCwwIC0wLjAzMzIzLDAuMDExMDggLTAuMDg3NzIsMC4wMjEyNmMtMC4xMzQxMSwwLjI1ODcgLTAuNDEzMywwLjM3MDM4IC0wLjQxMzMsMC4zNzAzOGwtMC43MTkzNiwwLjI4NjM1Yy0xLjcxMDM4LDAuNTYzOTEgLTMuOTYyNTEsMC45NzU2NSAtNS42ODg0MywwLjI0NzcxYy0zLjQyNjQsLTEuNDQ1MTQgLTUuMjgzNTIsLTYuNzA2MjUgLTQuMTU3MDYsLTkuOTk1OTRjMi42ODI4OCwtMy40MjM4MiA1LjQ5OTEsLTMuMjkyODUgOS4wNzc5OSwtNC4yMzk4N2MyLjA3NDExLC0wLjU0ODgzIC0xLjIwNTY0LC01LjA2NTg0IDAuNDU4NCwtNi40MjAxNGMxLjA3MDUyLC0wLjg3MTI1IDQuMTgyNSwtMC44NDg0NyA1LjQ5NTg2LC0wLjg1MDY1YzcuNDI5NDIsMC4wNDg2OSAxNS40NDI0NiwtMC42ODcwNiAyMi44MTAwNywtMS43NTUyNGMwLDAgMC4zNjE3OCwtMC4wNTE2OCAwLjYxNjM0LDAuMTY5NjVjMC4wNiwwLjAxOTQzIDAuMDk2MzMsMC4wMzc2IDAuMDk2MzMsMC4wMzc2ek0zMDUuODk3ODEsMTc5LjY5OTY5YzIuMDI3MjcsLTAuMzM3MTIgMy4xODA2OSwyLjYzMDI1IDUuNDY5OTksMy4zODMxNmMxLjE3MjQxLDAuMzg1NTggNi45MzQxNiwwLjU4MTIxIDcuNDM0MiwxLjIxNTg3YzAuMTA4OTMsMC4xMzgyNiAwLjAxMjc5LDMuNjQyMSAwLjAxMjYxLDQuMDQ1NDVjMC4zNjU1OCwxLjk5MDU3IDEuMTIxMzEsNS42MjQyOCAwLjM1MTgzLDcuNTUxNjZjLTAuMzI5NjYsMC44MjU3MyAtMTIuNDAzNywzLjcwNzEgLTIuNTkwMzksMy42OTgzNWMwLjY3Nzk5LC0wLjAwMDYxIDEuMzU1OTgsMCAyLjAzMzk3LDBjNC4yMjk2NywwIDE4LjQ2NDc0LC0yLjAyODMyIDguMDEyMzcsLTMuNzM2ODFjLTAuMzE3MDUsLTEuODg5NjYgLTIuMjI3MTMsLTkuODYyMjMgLTAuODU1NTMsLTExLjQ1NjJjMS45MTExNCwtMi4yMjA5NyA1LjU4NDk4LC0yLjAxOTc1IDcuNjMzNiwtNS40MTYxOWMwLjg1OTk4LC0xLjY4NDQ2IDE0LjA4MTUzLC0zLjQ3NTI2IDguNTM5MjcsLTkuMDMyMjRjLTEuMDkzOTEsLTEuMDk2ODIgLTIuNTg0OCwtMS4zNjQwMiAtMy45NzU4NiwtMS44MjkwNWMtMy4wNDg1NSwtMC41MzM2NyAtMS40ODQyNSwtMi40MDU2IC0yLjA0MjA1LC00LjQ2MjA5Yy0wLjI3OTgzLC0xLjAzMTY5IC0xLjQxNzY3LC0yLjE3MDExIC0yLjA1MzksLTMuMDA2OTFsLTAuNjc3NDksLTAuMzE5MjJjMCwwIC0wLjAyMTU2LC0wLjAxMDc4IC0wLjA1NTAxLC0wLjAzMjM0Yy03LjQxOTg5LDEuMDM2ODkgLTE1LjMyOTA0LDEuNjk4MzggLTIyLjc5NjkxLDEuNzM4N2MtNy4xMTg0OCwtMC4wMTMwMiAtMS45ODAyMSw0LjA3NzUgLTQuODkzNiw2LjgzMTQ1Yy0yLjEzOTcyLDIuMDIyNjIgLTYuMzM2ODEsMC44ODUxOSAtOC44MjEwMSwzLjg5NjA0Yy0xLjU5NDU4LDUuMDAxIDMuMzgyODEsOS4xODUyIDguMDUzNTEsNy42MDgzN2wwLjYzNjYyLC0wLjI1NjA0YzAsMCAwLjA0OTM2LC0wLjAxOTc1IDAuMTI3MDUsLTAuMDM1NThjMC4xNDA1OCwtMC4yODA5OSAwLjQ1NjcxLC0wLjM4NjM4IDAuNDU2NzEsLTAuMzg2Mzh6IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTMwNC41NzIyNywxNzMuNjYwODJjMC4xMzgxMywxLjA1MzY5IDAuNTI3MDgsMi4yMTMzNyAxLjAxMzE1LDMuMTYwNjJsMC4wNzkxOCwwLjQ3MTAxYzAsMCAwLDAuNjE3ODUgLTAuNTYwNzgsMC43MzE5OGMtMC4xNTUwMywwLjEwNzM4IC0wLjMxMzMzLDAuMTM5MDUgLTAuMzEzMzMsMC4xMzkwNWwtMC44MjUwOCwwLjE1MDE3Yy0xLjE1MjgyLDAgLTIuMDQ5NjcsMC4xMDE5MiAtMy4xMTgwMSwtMC41MjYyMmMtMy42NDIyOCwtMi4xNDE0OCAwLjE3Mjc2LC01LjI5MTgxIDIuODQ2ODEsLTUuMzEyOTRjMCwwIDAuNzUsMCAwLjc1LDAuNzVjMCwwLjAzNDI0IC0wLjAwMTU2LDAuMDY2OTEgLTAuMDA0NTUsMC4wOTgxYzAuMTA4MDcsMC4xNjY0OCAwLjEzMjYxLDAuMzM4MjMgMC4xMzI2MSwwLjMzODIzek0zMDMuOTM0NjIsMTc2LjgxMzU2Yy0wLjM4MDc2LC0wLjkwMTY1IC0wLjY3MTUyLC0xLjg2NDkyIC0wLjgyNzg3LC0yLjgxNzg1Yy0yLjk4MzQ5LDAuMjYwOTggLTIuMjk4NzIsMi44MDEyNyAwLjgyNzg3LDIuODE3ODV6IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTMzNy42MDY5NywxNzEuMzczNDJjLTAuMjA2ODIsMC43NzcyNyAtMC40MTM0NiwxLjYyOTA0IC0wLjMxMTc2LDIuMDIwM2MwLjEzMzczLDAuNTE0NSAxLjk1MTUxLC0wLjU4OTkyIDEuNjMyMTEsLTEuMTIxNTljLTAuMTcwNjYsLTAuMjg0MDkgLTAuODYxOTIsLTAuNjQ1MDMgLTEuMzIwMzUsLTAuODk4NzF6TTMzNy45MjY2NCwxNjkuODUxNDJjMC42NzA2MiwwLjM4NjI5IDIuMTU2MzQsMS4xOTA1IDIuNDAxNjMsMS44ODQ2NWMwLjc1MjE1LDIuMTI4NTIgLTIuOTI5NzMsNC42NTE5OCAtNC4zMzQyMSwyLjQwMzk4Yy0wLjMzOTksLTAuNTQ0MDUgLTAuMDI0NzQsLTIuMDk0NzkgMC4yMjk4LC0zLjI0MzIzYy0wLjEzNDM2LC0wLjEyOTczIC0wLjIzNTMxLC0wLjMzMTg3IC0wLjE4MzQyLC0wLjY0MzE5YzAuMDU5ODUsLTAuMzU5MSAwLjI2NDk2LC0wLjUxNDg0IDAuNDYwMjEsLTAuNTgwMDRjMC4wODc1OSwtMC4yMTAzNCAwLjMwNTQyLC0wLjUyNzMgMC44MDk2OCwtMC40NDMyNWMwLjQ2MTQxLDAuMDc2OSAwLjU4NzA3LDAuMzkzNjIgMC42MTYzMSwwLjYyMTA5eiIgZmlsbD0iIzAwMDAwMCIvPjxwYXRoIGQ9Ik0zMDUuNTUwMTEsMTgwLjEzMjY5Yy0wLjA3NzcsMC4wMTU4NCAtMC4xMjcwNiwwLjAzNTQ2IC0wLjEyNzA2LDAuMDM1NDZsLTAuNzM2NTksMC4yNTgwNmMtNC42NzA3LDEuNTc2ODMgLTkuNjQ1ODcsLTIuNjIzNTggLTguMDUxMjksLTcuNjI0NThjMi40ODQyLC0zLjAxMDg0IDYuNjg5NDYsLTEuODg5MTYgOC44MjkxOCwtMy45MTE3OGMyLjkxMzM5LC0yLjc1Mzk1IC0yLjIwODY1LC02Ljg1ODE0IDQuOTA5ODMsLTYuODQ1MTFjNy40Njc4NywtMC4wNDAzMiAxNS40Mjg0NywtMC42OTg5OSAyMi44NDgzNiwtMS43MzU4OGMwLjAzMzQ2LDAuMDIxNTYgMC4wNTUxMiwwLjAzMjQyIDAuMDU1MTIsMC4wMzI0MmwwLjY3ODc2LDAuMzIwMTFjMC42MzYyMywwLjgzNjggMS43Nzk3OCwxLjk4MDEgMi4wNTk2MiwzLjAxMTc4YzAuNTU3OCwyLjA1NjQ5IC0wLjk5OTc2LDMuOTM2NjcgMi4wNDg3OSw0LjQ3MDM0YzEuMzkxMDYsMC40NjUwMiAyLjg4NTYxLDAuNzM4OTMgMy45Nzk1MywxLjgzNTc1YzUuNTQyMjYsNS41NTY5OCAtNy42NzQ5OSw3LjM2NDgyIC04LjUzNDk2LDkuMDQ5MjhjLTIuMDQ4NjMsMy4zOTY0NSAtNS43MzIyOCwzLjIyODY5IC03LjY0MzQyLDUuNDQ5NjZjLTEuMzcxNjEsMS41OTM5NiAwLjUxODEyLDkuNTgyNTYgMC44MzUxNiwxMS40NzIyMmMxMC40NTIzNiwxLjcwODQ4IC0zLjgwNTQzLDMuNzQwNzYgLTguMDM1MSwzLjc0MDc2Yy0wLjY3Nzk5LDAgLTEuMzYxMDYsLTAuMDAxMTcgLTIuMDM5MDUsLTAuMDAwNTdjLTkuODEzMzEsMC4wMDg3NSAyLjI3MDg1LC0yLjk3MTkyIDIuNjAwNSwtMy43OTc2NWMwLjc2OTQ3LC0xLjkyNzM4IDAuMDA1ODgsLTUuNDYxNDggLTAuMzU5NywtNy40NTIwNGMwLjAwMDE4LC0wLjQwMzM1IDAuMDkwOTQsLTMuOTA4MTMgLTAuMDE3OTksLTQuMDQ2MzljLTAuNTAwMDUsLTAuNjM0NjYgLTYuMjk3NDIsLTAuODYxNTkgLTcuNDY5ODMsLTEuMjQ3MTdjLTIuMjg5MywtMC43NTI5IC0zLjQ0NTgzLC0zLjczODU3IC01LjQ3MzExLC0zLjQwMTQ2YzAsMCAtMC4yMTYxNCwwLjEwNTggLTAuMzU2NzIsMC4zODY3OXpNMzA0LjQ5ODY4LDE3My4zNjk2OWMwLjAwMjk5LC0wLjAzMTE4IDAuMDA0NTUsLTAuMDYzODUgMC4wMDQ1NSwtMC4wOTgxYzAsLTAuNzUgLTAuNzUsLTAuNzUgLTAuNzUsLTAuNzVjLTIuNjc0MDUsMC4wMjExMyAtNi40ODkxLDMuMTcxNDUgLTIuODQ2ODEsNS4zMTI5NGMxLjA2ODM1LDAuNjI4MTMgMS45NjUxOSwwLjUyNjIyIDMuMTE4MDEsMC41MjYyMmwwLjgyNTA4LC0wLjE1MDE3YzAsMCAwLjE1ODMsLTAuMDMxNjcgMC4zMTMzMywtMC4xMzkwNWMwLjU2MDc4LC0wLjExNDE0IDAuNTYwNzgsLTAuNzMxOTggMC41NjA3OCwtMC43MzE5OGwtMC4wNzkxOCwtMC40NzEwMWMtMC40ODYwNiwtMC45NDcyNSAtMC44NzUwMiwtMi4xMDY5MyAtMS4wMTMxNSwtMy4xNjA2MmMwLDAgLTAuMDI0NTQsLTAuMTcxNzUgLTAuMTMyNjEsLTAuMzM4MjN6TTMzNy4zNjkzNCwxNjkuMjc3NDNjLTAuNTA0MjYsLTAuMDg0MDUgLTAuNzIyMDksMC4yMzI5MSAtMC44MDk2OCwwLjQ0MzI1Yy0wLjE5NTI0LDAuMDY1MTkgLTAuNDAwMzYsMC4yMjA5MyAtMC40NjAyMSwwLjU4MDA0Yy0wLjA1MTg5LDAuMzExMzMgMC4wNDkwNywwLjUxMzQ3IDAuMTgzNDIsMC42NDMxOWMtMC4yNTQ1NCwxLjE0ODQ1IC0wLjU2OTcxLDIuNjk5MTggLTAuMjI5OCwzLjI0MzIzYzEuNDA0NDgsMi4yNDgwMSA1LjA4NjM3LC0wLjI3NTQ1IDQuMzM0MjIsLTIuNDAzOThjLTAuMjQ1MjksLTAuNjk0MTUgLTEuNzMxMDEsLTEuNDk4MzYgLTIuNDAxNjMsLTEuODg0NjVjLTAuMDI5MjQsLTAuMjI3NDcgLTAuMTU0OTEsLTAuNTQ0MTkgLTAuNjE2MzIsLTAuNjIxMDl6IiBmaWxsPSJ1cmwoI2NvbG9yLTEpIi8+PC9nPjwvZz48L2c+PC9zdmc+";

  const blockIconURI = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI1MC4wNDU4MyIgaGVpZ2h0PSI0Mi40MzczNSIgdmlld0JveD0iMCwwLDUwLjA0NTgzLDQyLjQzNzM1Ij48ZGVmcz48bGluZWFyR3JhZGllbnQgeDE9IjMxOS44NjQ0MSIgeTE9IjE2MC4zMDg4NiIgeDI9IjMxOS44NjQ0MSIgeTI9IjE5OS42OTExOCIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIGlkPSJjb2xvci0xIj48c3RvcCBvZmZzZXQ9IjAiIHN0b3AtY29sb3I9IiNmZGE5MDAiLz48c3RvcCBvZmZzZXQ9IjEiIHN0b3AtY29sb3I9IiNmYzg0MDAiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjk0Ljk3NzA5LC0xNTguNzgxMzIpIj48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMC41IiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxnPjxwYXRoIGQ9Ik0zMzMuODYxMjgsMTU4Ljk5MzgzbDAuOTQ5NjksMC40OTQzNmMwLjg1NzU4LDEuMDM1NDYgMi4xOTA0NywyLjQzNTM4IDIuNTU2NDUsMy43NzMwMWMwLjM4Mjk5LDEuMzk5ODEgLTAuODg0ODgsMy4yMjQ5NiAwLjk0MTExLDMuNDAyNjJjMS42NzY2OSwwLjU1NzMyIDMuMzg2MDYsMC45MjQ5OSA0LjcwMjQ0LDIuMjM4OTFjNy4zNDAzMSw3LjMyNjU4IC03LjcyNDc5LDguODU4MDMgLTguMjc0OTMsMTAuNzY1MTJjLTIuMDA4MzQsMy4zNjI4MSAtNi4xOTc0LDMuNzQxNjcgLTcuODI0NjIsNS43MDI4OGMtMC43OTk2OCwwLjk2MzgyIDEuMDY4ODUsNy42MzUzNiAwLjk5MDE4LDkuMTAxMjNjLTAuMDA2OTksMC4xMzAyOCAtMC4xNDU2OSwwLjIxNjQ5IC0wLjIxODUyLDAuMzI0NzRjMi43MzU1MiwtMi4xMjE0MSA1LjQ0NzkxLDEuNzcxNDcgNC4xOTAyNyw0LjQyNTQxYy0xLjA3MTc2LDIuMjYxNjkgLTEwLjk5NTIzLDEuODcyMDYgLTEzLjI2MzMxLDEuODcyMDZjLTEuNjk0NzEsMCAtNC4yMTEzNiwwLjM3NTU3IC01LjgwNzc5LC0wLjE3Nzg4Yy0xLjQyMzkyLC0wLjQ5MzY0IC0xLjkyNjk5LC0zLjM3MTQ3IC0wLjk2NjIsLTQuNDg2MjFjMC43MTg3MSwtMC44MzM4OCA1Ljg3MDg2LC0wLjU4OSA1Ljk0NjM4LC0xLjExMjYyYzAuMzEwMDQsLTIuMTQ5NzEgLTAuMDc5NTIsLTQuNzE2MDQgLTAuNDYxNzUsLTYuODM4NjFjLTAuMDAyNTIsLTUuNzczMTEgLTQuODUwNzksLTEuNTU4ODMgLTkuMzg3MzYsLTUuNjE2NDZjLTAuNjY2MTYsLTAuNTk1ODMgLTEuMjY5NTIsLTIuMTE3MTEgLTEuNTYxMTcsLTEuNzM5NjljMCwwIC0wLjAzMzIzLDAuMDExMDggLTAuMDg3NzIsMC4wMjEyNmMtMC4xMzQxMSwwLjI1ODcgLTAuNDEzMywwLjM3MDM4IC0wLjQxMzMsMC4zNzAzOGwtMC43MTkzNiwwLjI4NjM1Yy0xLjcxMDM4LDAuNTYzOTEgLTMuOTYyNTEsMC45NzU2NSAtNS42ODg0MywwLjI0NzcxYy0zLjQyNjQsLTEuNDQ1MTQgLTUuMjgzNTIsLTYuNzA2MjUgLTQuMTU3MDYsLTkuOTk1OTRjMi42ODI4OCwtMy40MjM4MiA1LjQ5OTEsLTMuMjkyODUgOS4wNzc5OSwtNC4yMzk4N2MyLjA3NDExLC0wLjU0ODgzIC0xLjIwNTY0LC01LjA2NTg0IDAuNDU4NCwtNi40MjAxNGMxLjA3MDUyLC0wLjg3MTI1IDQuMTgyNSwtMC44NDg0NyA1LjQ5NTg2LC0wLjg1MDY1YzcuNDI5NDIsMC4wNDg2OSAxNS40NDI0NiwtMC42ODcwNiAyMi44MTAwNywtMS43NTUyNGMwLDAgMC4zNjE3OCwtMC4wNTE2OCAwLjYxNjM0LDAuMTY5NjVjMC4wNiwwLjAxOTQzIDAuMDk2MzMsMC4wMzc2IDAuMDk2MzMsMC4wMzc2ek0zMDUuODk3ODEsMTc5LjY5OTY5YzIuMDI3MjcsLTAuMzM3MTIgMy4xODA2OSwyLjYzMDI1IDUuNDY5OTksMy4zODMxNmMxLjE3MjQxLDAuMzg1NTggNi45MzQxNiwwLjU4MTIxIDcuNDM0MiwxLjIxNTg3YzAuMTA4OTMsMC4xMzgyNiAwLjAxMjc5LDMuNjQyMSAwLjAxMjYxLDQuMDQ1NDVjMC4zNjU1OCwxLjk5MDU3IDEuMTIxMzEsNS42MjQyOCAwLjM1MTgzLDcuNTUxNjZjLTAuMzI5NjYsMC44MjU3MyAtMTIuNDAzNywzLjcwNzEgLTIuNTkwMzksMy42OTgzNWMwLjY3Nzk5LC0wLjAwMDYxIDEuMzU1OTgsMCAyLjAzMzk3LDBjNC4yMjk2NywwIDE4LjQ2NDc0LC0yLjAyODMyIDguMDEyMzcsLTMuNzM2ODFjLTAuMzE3MDUsLTEuODg5NjYgLTIuMjI3MTMsLTkuODYyMjMgLTAuODU1NTMsLTExLjQ1NjJjMS45MTExNCwtMi4yMjA5NyA1LjU4NDk4LC0yLjAxOTc1IDcuNjMzNiwtNS40MTYxOWMwLjg1OTk4LC0xLjY4NDQ2IDE0LjA4MTUzLC0zLjQ3NTI2IDguNTM5MjcsLTkuMDMyMjRjLTEuMDkzOTEsLTEuMDk2ODIgLTIuNTg0OCwtMS4zNjQwMiAtMy45NzU4NiwtMS44MjkwNWMtMy4wNDg1NSwtMC41MzM2NyAtMS40ODQyNSwtMi40MDU2IC0yLjA0MjA1LC00LjQ2MjA5Yy0wLjI3OTgzLC0xLjAzMTY5IC0xLjQxNzY3LC0yLjE3MDExIC0yLjA1MzksLTMuMDA2OTFsLTAuNjc3NDksLTAuMzE5MjJjMCwwIC0wLjAyMTU2LC0wLjAxMDc4IC0wLjA1NTAxLC0wLjAzMjM0Yy03LjQxOTg5LDEuMDM2ODkgLTE1LjMyOTA0LDEuNjk4MzggLTIyLjc5NjkxLDEuNzM4N2MtNy4xMTg0OCwtMC4wMTMwMiAtMS45ODAyMSw0LjA3NzUgLTQuODkzNiw2LjgzMTQ1Yy0yLjEzOTcyLDIuMDIyNjIgLTYuMzM2ODEsMC44ODUxOSAtOC44MjEwMSwzLjg5NjA0Yy0xLjU5NDU4LDUuMDAxIDMuMzgyODEsOS4xODUyIDguMDUzNTEsNy42MDgzN2wwLjYzNjYyLC0wLjI1NjA0YzAsMCAwLjA0OTM2LC0wLjAxOTc1IDAuMTI3MDUsLTAuMDM1NThjMC4xNDA1OCwtMC4yODA5OSAwLjQ1NjcxLC0wLjM4NjM4IDAuNDU2NzEsLTAuMzg2Mzh6IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTMwNC41NzIyNywxNzMuNjYwODJjMC4xMzgxMywxLjA1MzY5IDAuNTI3MDgsMi4yMTMzNyAxLjAxMzE1LDMuMTYwNjJsMC4wNzkxOCwwLjQ3MTAxYzAsMCAwLDAuNjE3ODUgLTAuNTYwNzgsMC43MzE5OGMtMC4xNTUwMywwLjEwNzM4IC0wLjMxMzMzLDAuMTM5MDUgLTAuMzEzMzMsMC4xMzkwNWwtMC44MjUwOCwwLjE1MDE3Yy0xLjE1MjgyLDAgLTIuMDQ5NjcsMC4xMDE5MiAtMy4xMTgwMSwtMC41MjYyMmMtMy42NDIyOCwtMi4xNDE0OCAwLjE3Mjc2LC01LjI5MTgxIDIuODQ2ODEsLTUuMzEyOTRjMCwwIDAuNzUsMCAwLjc1LDAuNzVjMCwwLjAzNDI0IC0wLjAwMTU2LDAuMDY2OTEgLTAuMDA0NTUsMC4wOTgxYzAuMTA4MDcsMC4xNjY0OCAwLjEzMjYxLDAuMzM4MjMgMC4xMzI2MSwwLjMzODIzek0zMDMuOTM0NjIsMTc2LjgxMzU2Yy0wLjM4MDc2LC0wLjkwMTY1IC0wLjY3MTUyLC0xLjg2NDkyIC0wLjgyNzg3LC0yLjgxNzg1Yy0yLjk4MzQ5LDAuMjYwOTggLTIuMjk4NzIsMi44MDEyNyAwLjgyNzg3LDIuODE3ODV6IiBmaWxsPSIjMDAwMDAwIi8+PHBhdGggZD0iTTMzNy42MDY5NywxNzEuMzczNDJjLTAuMjA2ODIsMC43NzcyNyAtMC40MTM0NiwxLjYyOTA0IC0wLjMxMTc2LDIuMDIwM2MwLjEzMzczLDAuNTE0NSAxLjk1MTUxLC0wLjU4OTkyIDEuNjMyMTEsLTEuMTIxNTljLTAuMTcwNjYsLTAuMjg0MDkgLTAuODYxOTIsLTAuNjQ1MDMgLTEuMzIwMzUsLTAuODk4NzF6TTMzNy45MjY2NCwxNjkuODUxNDJjMC42NzA2MiwwLjM4NjI5IDIuMTU2MzQsMS4xOTA1IDIuNDAxNjMsMS44ODQ2NWMwLjc1MjE1LDIuMTI4NTIgLTIuOTI5NzMsNC42NTE5OCAtNC4zMzQyMSwyLjQwMzk4Yy0wLjMzOTksLTAuNTQ0MDUgLTAuMDI0NzQsLTIuMDk0NzkgMC4yMjk4LC0zLjI0MzIzYy0wLjEzNDM2LC0wLjEyOTczIC0wLjIzNTMxLC0wLjMzMTg3IC0wLjE4MzQyLC0wLjY0MzE5YzAuMDU5ODUsLTAuMzU5MSAwLjI2NDk2LC0wLjUxNDg0IDAuNDYwMjEsLTAuNTgwMDRjMC4wODc1OSwtMC4yMTAzNCAwLjMwNTQyLC0wLjUyNzMgMC44MDk2OCwtMC40NDMyNWMwLjQ2MTQxLDAuMDc2OSAwLjU4NzA3LDAuMzkzNjIgMC42MTYzMSwwLjYyMTA5eiIgZmlsbD0iIzAwMDAwMCIvPjxwYXRoIGQ9Ik0zMDUuNTUwMTEsMTgwLjEzMjY5Yy0wLjA3NzcsMC4wMTU4NCAtMC4xMjcwNiwwLjAzNTQ2IC0wLjEyNzA2LDAuMDM1NDZsLTAuNzM2NTksMC4yNTgwNmMtNC42NzA3LDEuNTc2ODMgLTkuNjQ1ODcsLTIuNjIzNTggLTguMDUxMjksLTcuNjI0NThjMi40ODQyLC0zLjAxMDg0IDYuNjg5NDYsLTEuODg5MTYgOC44MjkxOCwtMy45MTE3OGMyLjkxMzM5LC0yLjc1Mzk1IC0yLjIwODY1LC02Ljg1ODE0IDQuOTA5ODMsLTYuODQ1MTFjNy40Njc4NywtMC4wNDAzMiAxNS40Mjg0NywtMC42OTg5OSAyMi44NDgzNiwtMS43MzU4OGMwLjAzMzQ2LDAuMDIxNTYgMC4wNTUxMiwwLjAzMjQyIDAuMDU1MTIsMC4wMzI0MmwwLjY3ODc2LDAuMzIwMTFjMC42MzYyMywwLjgzNjggMS43Nzk3OCwxLjk4MDEgMi4wNTk2MiwzLjAxMTc4YzAuNTU3OCwyLjA1NjQ5IC0wLjk5OTc2LDMuOTM2NjcgMi4wNDg3OSw0LjQ3MDM0YzEuMzkxMDYsMC40NjUwMiAyLjg4NTYxLDAuNzM4OTMgMy45Nzk1MywxLjgzNTc1YzUuNTQyMjYsNS41NTY5OCAtNy42NzQ5OSw3LjM2NDgyIC04LjUzNDk2LDkuMDQ5MjhjLTIuMDQ4NjMsMy4zOTY0NSAtNS43MzIyOCwzLjIyODY5IC03LjY0MzQyLDUuNDQ5NjZjLTEuMzcxNjEsMS41OTM5NiAwLjUxODEyLDkuNTgyNTYgMC44MzUxNiwxMS40NzIyMmMxMC40NTIzNiwxLjcwODQ4IC0zLjgwNTQzLDMuNzQwNzYgLTguMDM1MSwzLjc0MDc2Yy0wLjY3Nzk5LDAgLTEuMzYxMDYsLTAuMDAxMTcgLTIuMDM5MDUsLTAuMDAwNTdjLTkuODEzMzEsMC4wMDg3NSAyLjI3MDg1LC0yLjk3MTkyIDIuNjAwNSwtMy43OTc2NWMwLjc2OTQ3LC0xLjkyNzM4IDAuMDA1ODgsLTUuNDYxNDggLTAuMzU5NywtNy40NTIwNGMwLjAwMDE4LC0wLjQwMzM1IDAuMDkwOTQsLTMuOTA4MTMgLTAuMDE3OTksLTQuMDQ2MzljLTAuNTAwMDUsLTAuNjM0NjYgLTYuMjk3NDIsLTAuODYxNTkgLTcuNDY5ODMsLTEuMjQ3MTdjLTIuMjg5MywtMC43NTI5IC0zLjQ0NTgzLC0zLjczODU3IC01LjQ3MzExLC0zLjQwMTQ2YzAsMCAtMC4yMTYxNCwwLjEwNTggLTAuMzU2NzIsMC4zODY3OXpNMzA0LjQ5ODY4LDE3My4zNjk2OWMwLjAwMjk5LC0wLjAzMTE4IDAuMDA0NTUsLTAuMDYzODUgMC4wMDQ1NSwtMC4wOTgxYzAsLTAuNzUgLTAuNzUsLTAuNzUgLTAuNzUsLTAuNzVjLTIuNjc0MDUsMC4wMjExMyAtNi40ODkxLDMuMTcxNDUgLTIuODQ2ODEsNS4zMTI5NGMxLjA2ODM1LDAuNjI4MTMgMS45NjUxOSwwLjUyNjIyIDMuMTE4MDEsMC41MjYyMmwwLjgyNTA4LC0wLjE1MDE3YzAsMCAwLjE1ODMsLTAuMDMxNjcgMC4zMTMzMywtMC4xMzkwNWMwLjU2MDc4LC0wLjExNDE0IDAuNTYwNzgsLTAuNzMxOTggMC41NjA3OCwtMC43MzE5OGwtMC4wNzkxOCwtMC40NzEwMWMtMC40ODYwNiwtMC45NDcyNSAtMC44NzUwMiwtMi4xMDY5MyAtMS4wMTMxNSwtMy4xNjA2MmMwLDAgLTAuMDI0NTQsLTAuMTcxNzUgLTAuMTMyNjEsLTAuMzM4MjN6TTMzNy4zNjkzNCwxNjkuMjc3NDNjLTAuNTA0MjYsLTAuMDg0MDUgLTAuNzIyMDksMC4yMzI5MSAtMC44MDk2OCwwLjQ0MzI1Yy0wLjE5NTI0LDAuMDY1MTkgLTAuNDAwMzYsMC4yMjA5MyAtMC40NjAyMSwwLjU4MDA0Yy0wLjA1MTg5LDAuMzExMzMgMC4wNDkwNywwLjUxMzQ3IDAuMTgzNDIsMC42NDMxOWMtMC4yNTQ1NCwxLjE0ODQ1IC0wLjU2OTcxLDIuNjk5MTggLTAuMjI5OCwzLjI0MzIzYzEuNDA0NDgsMi4yNDgwMSA1LjA4NjM3LC0wLjI3NTQ1IDQuMzM0MjIsLTIuNDAzOThjLTAuMjQ1MjksLTAuNjk0MTUgLTEuNzMxMDEsLTEuNDk4MzYgLTIuNDAxNjMsLTEuODg0NjVjLTAuMDI5MjQsLTAuMjI3NDcgLTAuMTU0OTEsLTAuNTQ0MTkgLTAuNjE2MzIsLTAuNjIxMDl6IiBmaWxsPSJ1cmwoI2NvbG9yLTEpIi8+PC9nPjwvZz48L2c+PC9zdmc+";

  const Cast = Scratch.Cast;
  const runtime = Scratch.vm.runtime;

  const STORAGE_KEY_PREFIX = "scratch_achievement_";
  const REGISTRY_STORAGE_KEY = "scratch_achievement_registered_manifest";

  const BUILT_IN_FONTS = [
    { text: "Helvetica", value: "Helvetica" },
    { text: "Arial", value: "Arial" },
    ...[...new Set(Array.from(document.fonts).map(f => f.family))]
      .filter(f => f && !f.startsWith("scratch") && !["Arial", "Helvetica"].includes(f))
      .map(f => ({ text: f, value: f }))
  ];

  const styleStorage = {
    borderRadius: "12px",
    borderWidth: "5px",
    backgroundColor: "#141419",
    fontFamily: "Sans Serif",
    titleColor: "#ffffff",
    descColor: "#b3b3b3",
    outlineWidth: "0px",
    outlineColor: "#000000",
    outlineOpacity: "100"
  };

  const profileStorage = Object.create(null);

  const tierColors = {
    common: ["#808080", "rgba(128, 128, 128, 0.4)"],
    uncommon: ["#007e32", "rgba(0, 126, 50, 0.4)"],
    rare: ["#0055ff", "rgba(0, 85, 255, 0.4)"],
    epic: ["#ffee00", "rgba(255, 238, 0, 0.4)"],
    legendary: ["#ff00c3", "rgba(255, 0, 195, 0.4)"],
    mythic: ["#00aaff", "rgba(0, 170, 255, 0.4)"]
  };

  const loadRegistryFromStorage = () => {
    try {
      const saved = localStorage.getItem(REGISTRY_STORAGE_KEY);
      if (saved) Object.assign(profileStorage, JSON.parse(saved));
    } catch (e) {
      console.error("Failed to parse achievement storage manifest map:", e);
    }
  };

  const saveRegistryToStorage = () => {
    try {
      localStorage.setItem(REGISTRY_STORAGE_KEY, JSON.stringify(profileStorage));
    } catch (e) {
      console.error("Failed to commit achievement manifest configuration snapshot:", e);
    }
  };

  const xmlEscape = function (unsafe) {
    return Cast.toString(unsafe).replace(/[<>&'"]/g, c => {
      switch (c) {
        case "<": return "&lt;";
        case ">": return "&gt;";
        case "&": return "&amp;";
        case "'": return "&apos;";
        case "\"": return "&quot;";
      }
    });
  };

  const parseHexToRgba = (hex, opacityPercent) => {
    let c = hex.substring(1);
    if (c.length === 3) c = c.split('').map(x => x + x).join('');
    const num = parseInt(c, 16);
    const r = (num >> 16) & 255;
    const g = (num >> 8) & 255;
    const b = num & 255;
    const a = Math.max(0, Math.min(100, Cast.toNumber(opacityPercent))) / 100;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  };

  const injectStyles = () => {
    const styleId = 'AchievementStylesCore';
    if (document.getElementById(styleId)) return;

    const styleNode = document.createElement('style');
    styleNode.id = styleId;
    styleNode.textContent = `
      .ach-engine-container {
        position: fixed;
        z-index: 10000;
        bottom: 20px;
        right: 20px;
        font-family: var(--ach-font, 'Sans Serif', Arial, sans-serif);
        pointer-events: none;
        display: flex;
        flex-direction: column;
        align-items: flex-end;
      }
      .ach-engine-card {
        display: flex;
        align-items: center;
        background: var(--ach-bg, #141419) !important;
        border-radius: var(--ach-radius, 12px) !important;
        padding: 16px;
        width: 340px;
        box-shadow: 0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1);
        border-left-style: solid;
        border-left-width: var(--ach-bwidth, 5px) !important;
        margin-top: 12px;
        opacity: 0;
        transform: translateX(120%) scale(0.9);
        animation: achEngineSlideIn 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards,
                   achEngineSlideOut 0.5s cubic-bezier(0.6, -0.28, 0.735, 0.045) 4.5s forwards;
        pointer-events: auto;
        overflow: hidden;
        position: relative;
      }
      .ach-engine-icon-wrap {
        position: relative;
        width: 50px;
        height: 50px;
        margin-right: 16px;
        flex-shrink: 0;
      }
      .ach-engine-card img {
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
      .ach-engine-info {
        flex-grow: 1;
      }
      .ach-engine-header {
        font-size: 11px;
        text-transform: uppercase;
        letter-spacing: 1.5px;
        font-weight: bold;
        margin-bottom: 2px;
      }
      .ach-engine-title {
        font-size: 16px;
        font-weight: 700;
        color: var(--ach-tcolor, #ffffff) !important;
        margin-bottom: 4px;
        line-height: 1.2;
        -webkit-text-stroke: var(--ach-outwidth, 0px) var(--ach-outcolor, #000000) !important;
        text-stroke: var(--ach-outwidth, 0px) var(--ach-outcolor, #000000) !important;
      }
      .ach-engine-desc {
        font-size: 12px;
        color: var(--ach-dcolor, #b3b3b3) !important;
        line-height: 1.3;
      }
      .ach-engine-card::after {
        content: '';
        position: absolute;
        top: 0; left: -150%;
        width: 50%; height: 100%;
        background: linear-gradient(to right, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
        transform: skewX(-25deg);
        animation: achEngineShine 4.5s infinite ease;
      }
      @keyframes achEngineSlideIn { to { opacity: 1; transform: translateX(0) scale(1); } }
      @keyframes achEngineSlideOut { to { opacity: 0; transform: translateX(120%) scale(0.9); } }
      @keyframes achEngineShine { 0% { left: -150%; } 15% { left: 150%; } 100% { left: 150%; } }
    `;
    document.head.appendChild(styleNode);
  };

  const applyGlobalStyles = () => {
    const targets = [];
    const container = document.getElementById('AchievementEngineContainer');
    if (container) targets.push(container);
    
  const cards = document.querySelectorAll('.ach-engine-card');
    cards.forEach(card => targets.push(card));

    targets.forEach(el => {
      el.style.setProperty('--ach-radius', styleStorage.borderRadius);
      el.style.setProperty('--ach-bwidth', styleStorage.borderWidth);
      el.style.setProperty('--ach-bg', styleStorage.backgroundColor);
      el.style.setProperty('--ach-font', styleStorage.fontFamily);
      el.style.setProperty('--ach-tcolor', styleStorage.titleColor);
      el.style.setProperty('--ach-dcolor', styleStorage.descColor);
      el.style.setProperty('--ach-outwidth', styleStorage.outlineWidth);
      el.style.setProperty('--ach-outcolor', parseHexToRgba(styleStorage.outlineColor, styleStorage.outlineOpacity));
    });
  };

  function createBlockLabel(text) {
    return { blockType: Scratch.BlockType.LABEL, text: Scratch.translate(text) };
  }

  function createMenuItem(text, value) {
    return { text: Scratch.translate(text), value };
  }

  loadRegistryFromStorage();
  injectStyles();

  class AchievementEngine {
    getInfo() {
      return {
        id: "ziploxachievementengine",
        name: Scratch.translate("Achievements"),
        color1: "#d4af37",
        color2: "#b59226",
        color3: "#917316",
        menuIconURI,
        blockIconURI: blockIconURI,
        blocks: [
          {
            opcode: "createAchievement",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("register achievement ID [ID] title: [TITLE] description: [DESC] icon URL: [ICON] tier: [TIER]"),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "first_win" },
              TITLE: { type: Scratch.ArgumentType.STRING, defaultValue: "Victory!" },
              DESC: { type: Scratch.ArgumentType.STRING, defaultValue: "Win your very first match." },
              ICON: { type: Scratch.ArgumentType.STRING, defaultValue: "https://scratch.mit.edu/favicon.ico" },
              TIER: { type: Scratch.ArgumentType.STRING, menu: "TIERS", defaultValue: "common" }
            }
          },
          "---",
          {
            opcode: "unlockAchievement",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("unlock achievement ID [ID]"),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "first_win" }
            }
          },
          {
            opcode: "isUnlocked",
            blockType: Scratch.BlockType.BOOLEAN,
            text: Scratch.translate("achievement [ID] is unlocked?"),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "first_win" }
            }
          },
          {
            opcode: "everyAchievementUnlocked",
            blockType: Scratch.BlockType.REPORTER,
            text: Scratch.translate("every achievement unlocked")
          },
          {
            opcode: "clearAchievement",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("lock/reset achievement progress [ID]"),
            arguments: {
              ID: { type: Scratch.ArgumentType.STRING, defaultValue: "first_win" }
            }
          },
          {
            opcode: "clearAllAchievements",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("reset ALL achievement records")
          },
          "---",
          {
            opcode: "setCardNumberProperty",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set [PROP] to [NUM]"),
            arguments: {
              PROP: { type: Scratch.ArgumentType.STRING, menu: "NUMBER_PROPS", defaultValue: "corner-radius" },
              NUM: { type: Scratch.ArgumentType.NUMBER, defaultValue: 12 }
            }
          },
          {
            opcode: "setCardFontProperty",
            blockType: Scratch.BlockType.COMMAND,
            text: Scratch.translate("set font typography to [FONT]"),
            arguments: {
              FONT: { type: Scratch.ArgumentType.STRING, menu: "FONTS", defaultValue: "Sans Serif" }
            }
          }
        ],
        menus: {
          TIERS: {
            acceptReporters: true,
            items: [
              createMenuItem("common", "common"),
              createMenuItem("uncommon", "uncommon"),
              createMenuItem("rare", "rare"),
              createMenuItem("epic", "epic"),
              createMenuItem("legendary", "legendary"),
              createMenuItem("mythic", "mythic")
            ]
          },
          FONTS: {
            acceptReporters: true,
            items: BUILT_IN_FONTS
          },
          COLOR_PROPS: {
            acceptReporters: true,
            items: [
              createMenuItem("base-color", "base-color"),
              createMenuItem("title color", "title color"),
              createMenuItem("description color", "description color"),
              createMenuItem("text outline color", "text outline color")
            ]
          },
          NUMBER_PROPS: {
            acceptReporters: true,
            items: [
              createMenuItem("corner-radius", "corner-radius"),
              createMenuItem("left-border-width", "left-border-width")
            ]
          }
        }
      };
    }

    createAchievement(args) {
      const id = Cast.toString(args.ID).trim();
      if (!id) return;
      profileStorage[id] = {
        title: Cast.toString(args.TITLE),
        desc: Cast.toString(args.DESC),
        iconUrl: Cast.toString(args.ICON),
        tier: Cast.toString(args.TIER).toLowerCase()
      };
      saveRegistryToStorage();
    }

    unlockAchievement(args) {
      const id = Cast.toString(args.ID).trim();
      if (!id || !profileStorage[id]) return;

      const storageKey = STORAGE_KEY_PREFIX + id;
      if (localStorage.getItem(storageKey) === "true") return;

      localStorage.setItem(storageKey, "true");

      let container = document.getElementById('AchievementEngineContainer');
      if (!container) {
        container = document.createElement('div');
        container.id = 'AchievementEngineContainer';
        container.className = 'ach-engine-container';
        document.body.appendChild(container);
      }

      const record = profileStorage[id];
      const colors = tierColors[record.tier] || tierColors['common'];

      const card = document.createElement('div');
      card.className = 'ach-engine-card';
      card.style.borderLeftColor = colors[0];
      card.style.boxShadow = `0 10px 30px rgba(0,0,0,0.5), inset 0 0 0 1px rgba(255,255,255,0.1), 0 0 15px ${colors[1]}`;

      const headerText = `${record.tier.charAt(0).toUpperCase() + record.tier.slice(1)} Achievement!`;

      card.innerHTML = `
        <div class="ach-engine-icon-wrap">
          <img src="${xmlEscape(record.iconUrl)}" onerror="this.src='${menuIconURI}';" alt="Notification Icon" />
        </div>
        <div class="ach-engine-info">
          <div class="ach-engine-header" style="color: ${colors[0]}; text-shadow: 0 0 4px ${colors[1]};">${xmlEscape(headerText)}</div>
          <div class="ach-engine-title">${xmlEscape(record.title)}</div>
          <div class="ach-engine-desc">${xmlEscape(record.desc)}</div>
        </div>
      `;

      container.appendChild(card);
      applyGlobalStyles();

      setTimeout(() => {
        card.remove();
        if (container.children.length === 0) container.remove();
      }, 5100);
    }

    isUnlocked(args) {
      const id = Cast.toString(args.ID).trim();
      if (!id) return false;
      return localStorage.getItem(STORAGE_KEY_PREFIX + id) === "true";
    }

    everyAchievementUnlocked() {
      const unlockedList = [];
      for (const id in profileStorage) {
        if (localStorage.getItem(STORAGE_KEY_PREFIX + id) === "true") {
          unlockedList.push(id);
        }
      }
      return JSON.stringify(unlockedList);
    }

    clearAchievement(args) {
      const id = Cast.toString(args.ID).trim();
      if (!id) return;
      localStorage.removeItem(STORAGE_KEY_PREFIX + id);
    }

    clearAllAchievements() {
      const keysToRemove = [];
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && (key.startsWith(STORAGE_KEY_PREFIX) || key === REGISTRY_STORAGE_KEY)) {
          keysToRemove.push(key);
        }
      }
      keysToRemove.forEach(key => localStorage.removeItem(key));
      for (const key in profileStorage) delete profileStorage[key];
    }

    setCardColorProperty(args) {
      const prop = Cast.toString(args.PROP);
      const color = Cast.toString(args.COLOR);

      if (prop === "base-color") styleStorage.backgroundColor = color;
      if (prop === "title color") styleStorage.titleColor = color;
      if (prop === "description color") styleStorage.descColor = color;
      if (prop === "text outline color") styleStorage.outlineColor = color;

      applyGlobalStyles();
    }

    setCardNumberProperty(args) {
      const prop = Cast.toString(args.PROP);
      const num = Math.max(0, Cast.toNumber(args.NUM));

      if (prop === "corner-radius") styleStorage.borderRadius = `${num}px`;
      if (prop === "left-border-width") styleStorage.borderWidth = `${num}px`;

      applyGlobalStyles();
    }

    setCardFontProperty(args) {
      styleStorage.fontFamily = Cast.toString(args.FONT).replace(/[";']/g, '');
      applyGlobalStyles();
    }
  }

  Scratch.extensions.register(new AchievementEngine());
})(Scratch);
