(function(Scratch) {
  'use strict';
   const gptIcon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3MC4wOTM4OCIgaGVpZ2h0PSI3MS4yMDk2MyIgdmlld0JveD0iMCwwLDcwLjA5Mzg4LDcxLjIwOTYzIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjA0Ljk1MzA2LC0xNDQuMzk1MTgpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGw9IiNlZWVlZWUiIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMjQ5Ljc5NDY2LDE1MC40NDYwNGM2Ljg2MTUyLC0xLjI0MjcgMTQuMTEyODMsMS4yMDk0MyAxOC4yNzk0OCw3LjEyNDUxYzMuMzk2NTksNC44MjMgNC4xOTM0NywxMC43NTU1NiAyLjQxNzAxLDE2LjE0MDg3YzQuNTA0NzcsNS4zMjA2MiA2LjAwNTc4LDEyLjgyMjY3IDIuOTY3NDksMTkuMzg2NzZjLTIuNDc5NTUsNS4zNTIzNCAtNy4yMDg1OSw5LjAwNjYyIC0xMi43NTU3OCwxMC4xNjE2Yy0yLjM1NDY4LDYuNTY0MTIgLTguMTEyMzcsMTEuNjE4NDIgLTE1LjMxODMyLDEyLjI2ODU4Yy01Ljg3NTI0LDAuNTMyNjIgLTExLjQwNDk4LC0xLjc0NDc4IC0xNS4xNzkxMiwtNS45NzI5NGMtNi44NjE1MiwxLjI0MjcgLTE0LjExOTE1LC0xLjIwOTQzIC0xOC4yODU4MiwtNy4xMjQ1MWMtMy4zOTI2NCwtNC44MjEyNiAtNC4xODQ3MSwtMTAuNzUwNzYgLTIuNDEwNjksLTE2LjEzNDU0Yy00LjUwNDk2LC01LjMyMDYzIC02LjAwNTgzLC0xMi44Mjg4OCAtMi45Njc0OSwtMTkuMzkzMDhjMi40Nzk1NSwtNS4zNTUwNyA3LjIwODU5LC05LjAwNjU2IDEyLjc1NTc4LC0xMC4xNjE1OWMyLjM1NDU3LC02LjU2NDM1IDguMTEyMiwtMTEuNjE4NCAxNS4zMTgzMiwtMTIuMjY4NThjMC44NzEwNCwtMC4wNzg1NiAxLjcyOTQxLC0wLjA5ODA1IDIuNTgxNTMsLTAuMDU2OTRjNC44OTU1MSwwLjIzNjE3IDkuMzgzLDIuNDI4NTIgMTIuNTk3Niw2LjAyOTg5ek0yMzQuOTI1NTcsMTQ5LjMyNjExYy02Ljg4NzMxLDAuNjgzNTUgLTExLjkzMzI0LDYuODYxMDkgLTExLjkzMzI0LDEzLjc4MDc5djEyLjQyMDQzYzAsMS4xNDM1NyAwLjYwMzMyLDIuMjA3MiAxLjU4ODE1LDIuNzkwMzJsNC4xMzE3MSwyLjQ1NDk4bDAuMTcwODQsLTE1LjkzMjA2YzAuMDI1OTIsLTIuMjkwMzcgMS4yNTY5NSwtNC4zOTkxMiAzLjIzOTU2LC01LjU0MjY5bDExLjQwMTc1LC02LjU4MDM2YzAuMzU3MTksLTAuMjA2MjUgMC43NDEsLTAuMzMwOTUgMS4xMDcyNywtMC41MTI1MWMtMi4xOTA4NCwtMS43Njk1NSAtNC44ODc1OCwtMi44MjIwMSAtNy43ODg4NywtMi45MzU4NWMtMC42MzE0MiwtMC4wMjQ3NyAtMS4yNzEyOCwtMC4wMDcwNCAtMS45MTcxNiwwLjA1Njk0ek0yNDYuMTI0ODQsMTU2LjgzMDI1bC0xMC43NTYzNiw2LjIwNzA1Yy0wLjk5MTMxLDAuNTczNCAtMS42MDY4MiwxLjYyMTQ1IC0xLjYxOTc4LDIuNzY1MDJsLTAuMDU2OTQsNC44MTUwNWwxMy44ODIwNCwtNy44MjA1MWMxLjk5NTU3LC0xLjEyNDEzIDQuNDMzMjQsLTEuMTE1MTcgNi40MTU4NSwwLjAzMTYzbDExLjQwMTc1LDYuNTgwMzZjMC4zNTc3NiwwLjIwNjU4IDAuNjU4ODYsMC40NzU0OCAwLjk5OTcsMC43MDIzM2MwLjUzMDUsLTMuMzg2MjMgLTAuMjQ0OTksLTYuODkyNzQgLTIuMzYwMDcsLTkuODM4OTFjLTIuNTIwNzgsLTMuNTE0OTMgLTYuNTQxOTIsLTUuMzM0NzEgLTEwLjY2Nzc4LC01LjM1OTJjLTIuNDc1NTEsLTAuMDE0NjkgLTQuOTkwOTUsMC42MTk3MiAtNy4yMzg0LDEuOTE3MTZ6TTIxMC45MDA5MiwxNjkuMDU0NTRjLTIuODUwODEsNi4zMDQxOSAtMC4wMjY1NywxMy43NjkzMSA1Ljk2NjYyLDE3LjIyOTE2bDEwLjc2MjY4LDYuMjEzMzhjMC45OTEzMSwwLjU3MzQgMi4yMTAxNCwwLjU3OTQzIDMuMjA3OTMsMC4wMTg5OGw0LjE5NDk4LC0yLjM1Mzc0bC0xMy43MjM4NSwtOC4xMTc4OWMtMS45Njk2NSwtMS4xNjYyNCAtMy4xNzYyOSwtMy4yOTAyOCAtMy4xNzYyOSwtNS41ODA2NXYtMTMuMTU0NGMwLC0wLjQxMTUyIDAuMDgxNzUsLTAuODA3NzggMC4xMDc1NiwtMS4yMTQ4NGMtMy4xOTY5MSwxLjIzNDAyIC01Ljg0MzAyLDMuNjU0MzIgLTcuMzM5NjMsNi45NnpNMjQ5LjE2ODI1LDE2Ny40ODUzN2wtNC4xODg2NiwyLjM1Mzc0bDEzLjcxMTIsOC4xMTc4OWMxLjk2OTY1LDEuMTY2MjQgMy4xNzYyOSwzLjI4Mzk1IDMuMTc2MjksNS41NzQzMnYxMy4xNjA3MmMwLDAuNDEyMjYgLTAuMDgxNjYsMC44MDcwNyAtMC4xMDc1NiwxLjIxNDg0YzMuMTk3OTIsLTEuMjMzNzUgNS44NDksLTMuNjUzNTUgNy4zNDU5NiwtNi45NmMyLjg1MDgxLC02LjMwNDE5IDAuMDIwMjUsLTEzLjc2OTMxIC01Ljk3Mjk0LC0xNy4yMjkxNmwtMTAuNzU2MzYsLTYuMjEzMzhjLTAuNDk1NjUsLTAuMjg2NyAtMS4wNDc2NCwtMC40MzMzNCAtMS42MDA4LC0wLjQzNjU4Yy0wLjU1MzE2LC0wLjAwMzI0IC0xLjEwODI0LDAuMTM3MzcgLTEuNjA3MTMsMC40MTc2ek0yMzMuNjIyMTUsMTc2LjIxNzAxbC0wLjA4ODU5LDcuNDA5MjRsNi4zODQyMSwzLjc5MDAzbDYuNDYwMTQsLTMuNjMxODVsMC4wODg1OSwtNy40MDkyNGwtNi4zODQyMSwtMy43ODM3ek0yNTEuMTEwNzMsMTk1LjE2MDg2Yy0wLjAyNTkyLDIuMjkwMzcgLTEuMjU2OTUsNC4zOTkxMiAtMy4yMzk1Niw1LjU0MjY5bC0xMS4zOTU0Miw2LjU4MDM2Yy0wLjM1NzE5LDAuMjA2MjUgLTAuNzQxLDAuMzMwOTUgLTEuMTA3MjcsMC41MTI1MWMyLjY2NzYzLDIuMTU0NjcgNi4wOTIzOSwzLjIzNjg3IDkuNzA2MDQsMi44Nzg5MWM2Ljg4NzMxLC0wLjY4MzU1IDExLjkzMzI0LC02Ljg2MTA5IDExLjkzMzI0LC0xMy43ODA3OXYtMTIuNDIwNDNjMCwtMS4xNDM1NyAtMC42MDMzMiwtMi4yMDcyIC0xLjU4ODE1LC0yLjc5MDMybC00LjEzODA0LC0yLjQ0ODY2ek0yMzIuNDI2MywxOTcuMjA0NTdjLTEuOTk1NTcsMS4xMjQxMyAtNC40MzMyNCwxLjExNTE3IC02LjQxNTg2LC0wLjAzMTYzbC0xMS40MDE3NCwtNi41ODAzNmMtMC4zNTc3NiwtMC4yMDY1OCAtMC42NTg4NiwtMC40NzU0OCAtMC45OTk3MSwtMC43MDIzM2MtMC41MzA1LDMuMzg2MjMgMC4yNDUsNi44OTI3NSAyLjM2MDA3LDkuODM4OTFjNC4wMzMyNiw1LjYyMzg4IDExLjkxMjk5LDYuOTAxODkgMTcuOTA2MTgsMy40NDIwNGwxMC43NTYzNiwtNi4yMDcwNWMwLjk5MTMxLC0wLjU3MzQgMS42MDY4MiwtMS42MjE0NSAxLjYxOTc4LC0yLjc2NTAybDAuMDU2OTQsLTQuODA4NzN6Ii8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6MzUuMDQ2OTM5NTY4MTQ0MTozNS42MDQ4MTY1MDg3OTAyOS0tPg==";
   const extIcon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxMTEuMzMzMzMiIGhlaWdodD0iMTExLjMzMzMzIiB2aWV3Qm94PSIwLDAsMTExLjMzMzMzLDExMS4zMzMzMyI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTE4NC4zMzMzMywtMTI0LjMzMzMzKSI+PGcgZGF0YS1wYXBlci1kYXRhPSJ7JnF1b3Q7aXNQYWludGluZ0xheWVyJnF1b3Q7OnRydWV9IiBmaWxsLXJ1bGU9Im5vbnplcm8iIHN0cm9rZS1saW5lY2FwPSJidXR0IiBzdHJva2UtbGluZWpvaW49Im1pdGVyIiBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiIHN0cm9rZS1kYXNoYXJyYXk9IiIgc3Ryb2tlLWRhc2hvZmZzZXQ9IjAiIHN0eWxlPSJtaXgtYmxlbmQtbW9kZTogbm9ybWFsIj48cGF0aCBkPSJNMTg0LjMzMzMzLDE4MGMwLC0zMC43NDM4NSAyNC45MjI4MiwtNTUuNjY2NjcgNTUuNjY2NjcsLTU1LjY2NjY3YzMwLjc0Mzg1LDAgNTUuNjY2NjcsMjQuOTIyODIgNTUuNjY2NjcsNTUuNjY2NjdjMCwzMC43NDM4NSAtMjQuOTIyODIsNTUuNjY2NjcgLTU1LjY2NjY3LDU1LjY2NjY3Yy0zMC43NDM4NSwwIC01NS42NjY2NywtMjQuOTIyODIgLTU1LjY2NjY3LC01NS42NjY2N3oiIGZpbGw9IiM1NWI5NjciIHN0cm9rZS1vcGFjaXR5PSIwLjIiIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI1Mi4wOTM3OSwxNDMuNTA4NzFjOC40NzIxNiwtMS41MzQ0IDE3LjQyNTYsMS40OTMzMyAyMi41NzAzMSw4Ljc5Njg4YzQuMTkzODksNS45NTUxMiA1LjE3NzgyLDEzLjI4MDI2IDIuOTg0MzcsMTkuOTI5NjljNS41NjIyLDYuNTY5NTYgNy40MTU1NSwxNS44MzI1OSAzLjY2NDA2LDIzLjkzNzVjLTMuMDYxNTksNi42MDg3MiAtOC45MDA3LDExLjEyMDc5IC0xNS43NSwxMi41NDY4OGMtMi45MDc0LDguMTA0OTUgLTEwLjAxNjYzLDE0LjM0NTY2IC0xOC45MTQwNiwxNS4xNDg0NGMtNy4yNTQzNiwwLjY1NzY1IC0xNC4wODIxMywtMi4xNTQzNCAtMTguNzQyMTksLTcuMzc1Yy04LjQ3MjE2LDEuNTM0NCAtMTcuNDMzNDEsLTEuNDkzMzMgLTIyLjU3ODEzLC04Ljc5Njg4Yy00LjE4OTAxLC01Ljk1Mjk4IC01LjE2NzAxLC0xMy4yNzQzNCAtMi45NzY1NiwtMTkuOTIxODhjLTUuNTYyNDMsLTYuNTY5NTcgLTcuNDE1NjEsLTE1Ljg0MDI2IC0zLjY2NDA2LC0yMy45NDUzMWMzLjA2MTU5LC02LjYxMjA5IDguOTAwNywtMTEuMTIwNzEgMTUuNzUsLTEyLjU0Njg3YzIuOTA3MjcsLTguMTA1MjMgMTAuMDE2NDIsLTE0LjM0NTY0IDE4LjkxNDA2LC0xNS4xNDg0NGMxLjA3NTUsLTAuMDk3IDIuMTM1MzYsLTAuMTIxMDcgMy4xODc1LC0wLjA3MDMxYzYuMDQ0NjYsMC4yOTE2MSAxMS41ODU1MSwyLjk5ODU4IDE1LjU1NDY5LDcuNDQ1MzF6TTIzMy43MzQ0MiwxNDIuMTI1OWMtOC41MDQsMC44NDQgLTE0LjczNDM4LDguNDcxNjMgLTE0LjczNDM4LDE3LjAxNTYydjE1LjMzNTk0YzAsMS40MTIgMC43NDQ5NCwyLjcyNTMxIDEuOTYwOTQsMy40NDUzMWw1LjEwMTU2LDMuMDMxMjVsMC4yMTA5NCwtMTkuNjcxODdjMC4wMzIsLTIuODI4IDEuNTUyLC01LjQzMTc1IDQsLTYuODQzNzVsMTQuMDc4MTMsLTguMTI1YzAuNDQxMDQsLTAuMjU0NjcgMC45MTQ5NCwtMC40MDg2NCAxLjM2NzE5LC0wLjYzMjgxYy0yLjcwNTEsLTIuMTg0OTIgLTYuMDM0ODYsLTMuNDg0NDMgLTkuNjE3MTksLTMuNjI1Yy0wLjc3OTY0LC0wLjAzMDU5IC0xLjU2OTY5LC0wLjAwODY5IC0yLjM2NzE5LDAuMDcwMzF6TTI0Ny41NjI1NCwxNTEuMzkxNTJsLTEzLjI4MTI1LDcuNjY0MDZjLTEuMjI0LDAuNzA4IC0xLjk4NCwyLjAwMjA2IC0yLDMuNDE0MDZsLTAuMDcwMzEsNS45NDUzMWwxNy4xNDA2MywtOS42NTYyNWMyLjQ2NCwtMS4zODggNS40NzM4NywtMS4zNzY5NCA3LjkyMTg3LDAuMDM5MDZsMTQuMDc4MTMsOC4xMjVjMC40NDE3NCwwLjI1NTA3IDAuODEzNTIsMC41ODcwOSAxLjIzNDM3LDAuODY3MTljMC42NTUwMywtNC4xODEwOSAtMC4zMDI1LC04LjUxMDcxIC0yLjkxNDA2LC0xMi4xNDg0NGMtMy4xMTI1LC00LjM0IC04LjA3NzU0LC02LjU4Njk1IC0xMy4xNzE4OCwtNi42MTcxOWMtMy4wNTY2LC0wLjAxODE0IC02LjE2MjUsMC43NjUxOSAtOC45Mzc1LDIuMzY3MTl6TTIwNC4wNzAzNSwxNjYuNDg1MjdjLTMuNTIsNy43ODQgLTAuMDMyODEsMTcuMDAxNDQgNy4zNjcxOSwyMS4yNzM0NGwxMy4yODkwNiw3LjY3MTg4YzEuMjI0LDAuNzA4IDIuNzI4OTQsMC43MTU0NCAzLjk2MDk0LDAuMDIzNDRsNS4xNzk2OSwtMi45MDYyNWwtMTYuOTQ1MzEsLTEwLjAyMzQ0Yy0yLjQzMiwtMS40NCAtMy45MjE4OCwtNC4wNjI2MiAtMy45MjE4OCwtNi44OTA2MnYtMTYuMjQyMTljMCwtMC41MDgxMiAwLjEwMDk0LC0wLjk5NzQgMC4xMzI4MSwtMS41Yy0zLjk0NzMzLDEuNTIzNjkgLTcuMjE0NTgsNC41MTIxMSAtOS4wNjI1LDguNTkzNzV6TTI1MS4zMjAzNSwxNjQuNTQ3NzdsLTUuMTcxODgsMi45MDYyNWwxNi45Mjk2OSwxMC4wMjM0NGMyLjQzMiwxLjQ0IDMuOTIxODgsNC4wNTQ4MSAzLjkyMTg4LDYuODgyODF2MTYuMjVjMCwwLjUwOTAzIC0wLjEwMDgzLDAuOTk2NTIgLTAuMTMyODEsMS41YzMuOTQ4NTgsLTEuNTIzMzUgNy4yMjE5NiwtNC41MTExNiA5LjA3MDMxLC04LjU5Mzc1YzMuNTIsLTcuNzg0IDAuMDI1LC0xNy4wMDE0NCAtNy4zNzUsLTIxLjI3MzQ0bC0xMy4yODEyNSwtNy42NzE4OGMtMC42MTIsLTAuMzU0IC0xLjI5MzU2LC0wLjUzNTA2IC0xLjk3NjU2LC0wLjUzOTA2Yy0wLjY4MywtMC4wMDQgLTEuMzY4MzgsMC4xNjk2MiAtMS45ODQzOCwwLjUxNTYzek0yMzIuMTI1MDQsMTc1LjMyOTAybC0wLjEwOTM4LDkuMTQ4NDRsNy44ODI4MSw0LjY3OTY4bDcuOTc2NTYsLTQuNDg0MzdsMC4xMDkzOCwtOS4xNDg0NGwtNy44ODI4MSwtNC42NzE4N3pNMjUzLjcxODc5LDE5OC43MTk2NWMtMC4wMzIsMi44MjggLTEuNTUyLDUuNDMxNzUgLTQsNi44NDM3NWwtMTQuMDcwMzIsOC4xMjVjLTAuNDQxMDQsMC4yNTQ2NyAtMC45MTQ5NCwwLjQwODY0IC0xLjM2NzE5LDAuNjMyODFjMy4yOTM4MiwyLjY2MDQ0IDcuNTIyNDksMy45OTY2OCAxMS45ODQzOCwzLjU1NDY5YzguNTA0LC0wLjg0NCAxNC43MzQzOCwtOC40NzE2MiAxNC43MzQzOCwtMTcuMDE1NjJ2LTE1LjMzNTk0YzAsLTEuNDEyIC0wLjc0NDk0LC0yLjcyNTMxIC0xLjk2MDk0LC0zLjQ0NTMxbC01LjEwOTM4LC0zLjAyMzQ0ek0yMzAuNjQ4NDgsMjAxLjI0MzA5Yy0yLjQ2NCwxLjM4OCAtNS40NzM4OCwxLjM3Njk0IC03LjkyMTg4LC0wLjAzOTA2bC0xNC4wNzgxMiwtOC4xMjVjLTAuNDQxNzQsLTAuMjU1MDcgLTAuODEzNTIsLTAuNTg3MDkgLTEuMjM0MzgsLTAuODY3MTljLTAuNjU1MDMsNC4xODEwOSAwLjMwMjUxLDguNTEwNzIgMi45MTQwNiwxMi4xNDg0NGM0Ljk4LDYuOTQ0IDE0LjcwOTM4LDguNTIyIDIyLjEwOTM4LDQuMjVsMTMuMjgxMjUsLTcuNjY0MDZjMS4yMjQsLTAuNzA4IDEuOTg0LC0yLjAwMjA2IDIsLTMuNDE0MDZsMC4wNzAzMSwtNS45Mzc1eiIgZmlsbD0iI2VlZWVlZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjo1NS42NjY2NjY2NjY2NjY2Njo1NS42NjY2NjY2NjY2NjY2ODYtLT4=";
   // Initialize the api_url variable with a default value
	let api_url = 'https://api.tmrace.net/v1/chat/completions';

  class WorkingTurboGPT {
    constructor() {
      this.chatHistories = {};
    }

    getInfo() {
      return {
        id: "workingturboGPT",
        name: "WorkingTurboGPT",
        menuIconURI: extIcon,
        blockIconURI: gptIcon,
        blocks: [
		{
            opcode: "__NOUSEOPCODE",
            blockType: Scratch.BlockType.LABEL,
            text: "Reverse Proxy API Blocks",
          },
					{
		  opcode: 'setApiUrl',
		  blockType: Scratch.BlockType.COMMAND,
		  text: 'Set reverse proxy API URL to [URL]',
		  arguments: {
			URL: {
			  type: Scratch.ArgumentType.STRING,
			  defaultValue: 'https://api.tmrace.net/v1/chat/completions'
			}
		  },
		},
		{
		  opcode: 'checkApiUrl',
		  blockType: Scratch.BlockType.BOOLEAN,
		  text: 'Is reverse proxy working?',
		  disableMonitor: true,
		},
		{
            opcode: "__NOUSEOPCODE",
            blockType: Scratch.BlockType.LABEL,
            text: "Prompts",
          },
          {
            opcode: 'singlePrompt',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Generate from text (No Context): [PROMPT]',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'How are you?',
              },
            },
          },
		  {
            opcode: 'advancedPrompt',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Send text [PROMPT] to [chatID]',
            arguments: {
              PROMPT: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'What is "Foo, Bar"?',
              },
              chatID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo'
              }
            },
          },
		  		  {
            opcode: 'informChat',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Inform [chatID] that [inform]',
            arguments: {
              chatID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo'
              },
              inform: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'You can only speak in meows and other cat noises.'
              }
            },
          },
		  {
            opcode: "__NOUSEOPCODE",
            blockType: Scratch.BlockType.LABEL,
            text: "Chatbot management",
          },
          {
            opcode: 'createChat',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Create chatbot named [chatID]',
            arguments: {
              chatID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo'
              }
            },
          },
		  		  {
            opcode: 'removeChat',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Delete chatbot [chatID]',
            arguments: {
              chatID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo'
              }
            },
          },
		  {
            opcode: 'resetChat',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Reset chat history of [chatID]',
            arguments: {
              chatID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo'
              }
            },
          },
		  {
            opcode: 'lastGeneration',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Last [type] from [chatID]',
            arguments: {
              type: {
                type: Scratch.ArgumentType.STRING,
                menu: 'types',
              },
              chatID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo'
              }
            },
          },
		  {
            opcode: 'exportChat',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Chat history of [chatID] as Array',
            arguments: {
              chatID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo',
				disableMonitor: false
              }
            },
          },
          {
            opcode: 'importChat',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Import chat history from [json] as [chatID]',
            arguments: {
              json: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Array goes here'
              },
              chatID: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Foo'
              }
            },
          },
		            {
            opcode: 'importAll',
            blockType: Scratch.BlockType.COMMAND,
            text: 'Import chats from [json] and [merge]',
            arguments: {
              json: {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'Array goes here'
              },
              merge: {
                type: Scratch.ArgumentType.STRING,
                menu: 'merge',
              }
            },
          },
          {
            opcode: 'exportAll',
            blockType: Scratch.BlockType.REPORTER,
            text: 'All chats as Arrays',
          },
		  		  {
            opcode: 'listChats',
            blockType: Scratch.BlockType.REPORTER,
            text: 'Currently Active chats'
          },
        ],
        menus: {
          types: {
            acceptReporters: true,
            items: ['Generated Text', 'Request']
          },
          merge: {
            acceptReporters: true,
            items: ['Merge/Update existing chats', 'Remove all chatbots and import']
          }
        }
      };
    }
	
		setApiUrl(args) {
	  const newApiUrl = args.URL;
	  // Update the api_url variable
	  api_url = newApiUrl;
	}
		checkApiUrl() {
	  // Send a simple GET request to the api_url
	  	  return Scratch.fetch(api_url, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  model: "gpt-3.5-turbo",
		  messages: [{ role: "user", content: "Return nothing" }]
		}),
	  })
	  .then(response => {
		// Check if the response status code is in the 200 range (success)
		return response.status >= 200 && response.status < 300;
	  })
	  .catch(error => {
		// If there's an error, return false
		return false;
	  });
	}


		singlePrompt(args) {
	  const prompt = args.PROMPT;

	  return Scratch.fetch(api_url, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  model: "gpt-3.5-turbo",
		  messages: [{ role: "user", content: prompt }]
		}),
	  })
	  .then(response => {
		if (!response.ok) {
		  // Check for specific error scenarios
		  if (response.status === 429) {
			// API quota exceeded
			throw new Error("API quota exceeded");
		  } else {
			// Generic error for other cases
			throw new Error(`Generic error: ${response.status} ${response.statusText}`);
		  }
		}
		return response.json();
	  })
	  .then(data => {
		if (!data.choices || data.choices.length === 0) {
		  throw new Error("No response");
		}
		const botResponse = data.choices[0].message.content;
		return botResponse;
	  })
	  .catch(error => {
		console.error("Error sending prompt to GPT", error.message);
		
		if (error.message === "API quota exceeded") {
		  return "Error: You exceeded the API's quota, Please try again later or use a different API URL.";
		} else if (error.message === "No response") {
		  return "Error: There was no response from the API. Please try again later or try a new API URL.";
		} else {
		  return "Error: An unexpected error occurred, perhaps try again later or use a different API URL. Check Console for response.";
		}
	  });
	}

    createChat(args) {
      const chatID = args.chatID;
      if (!(chatID in this.chatHistories)) {
        this.chatHistories[chatID] = [{ role: "system", content: "Your name is: " + chatID }];
      }
    }

    informChat(args) {
      const inform = args.inform;
      const chatID = args.chatID;
      if (chatID in this.chatHistories) {
        this.chatHistories[chatID].push({ role: "system", content: inform });
      }
    }

    lastGeneration(args) {
      const chatID = args.chatID;
      let type = args.type;
      if (type === 'prompt') {
        type = 'user';
      } else if (type === 'generated text') {
        type = 'assistant';
      }
      if (['user', 'assistant'].includes(type)) {
        if (this.chatHistories[chatID] !== undefined) {
          const chatHistory = this.chatHistories[chatID];
          for (let i = chatHistory.length - 1; i >= 0; i--) {
            if ('role' in chatHistory[i] && chatHistory[i].role === type) {
              return chatHistory[i].content;
            }
          }
        }
      }
      return 'Error: There is no chat history available for that chatbot.';
    }

    exportChat(args) {
      const chatID = args.chatID;
      if (this.chatHistories[chatID] !== undefined) {
        const chatHistory = this.chatHistories[chatID];
        const json = JSON.stringify(chatHistory);
        return json;
      } else {
        return 'Error: There is no chat history available for that chatbot.';
      }
    }

    listChats() {
      const activeChats = Object.keys(this.chatHistories);
      const json = JSON.stringify(activeChats);
      return json;
    }

    importChat(args) {
      const chatID = args.chatID;
      const json = args.json;
      let chatHistory;

      try {
        chatHistory = JSON.parse(json);
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return;
      }

      if (Array.isArray(chatHistory)) {
        this.chatHistories[chatID] = chatHistory;
      } else {
        console.error('Invalid JSON format. Expected an array.');
      }
    }

    resetChat(args) {
      const chatID = args.chatID;
      if (chatID in this.chatHistories) {
        this.chatHistories[chatID] = [{ role: "system", content: "Your name is: " + chatID }];
      }
    }

    removeChat(args) {
      const chatID = args.chatID;
      if (chatID in this.chatHistories) {
        delete this.chatHistories[chatID];
      }
	  else {
		return "Error: There is no chat history available for that chatbot.";
		}
    }

	advancedPrompt(args) {
	  const prompt = args.PROMPT;
	  const chatID = args.chatID;

	  if (!(chatID in this.chatHistories)) {
		return "Error: That chatbot does not exist.";
	  }

	  const chatHistory = this.chatHistories[chatID] || [];
	  chatHistory.push({ role: "user", content: prompt });

	  return Scratch.fetch(api_url, {
		method: 'POST',
		headers: {
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify({
		  model: "gpt-3.5-turbo",
		  messages: chatHistory
		})
	  })
	  .then(response => {
		if (!response.ok) {
		  throw new Error(`Network response was not ok: ${response.status} ${response.statusText}`);
		}
		return response.json();
	  })
	  .then(data => {
		if (data.choices && data.choices.length > 0) {
		  const botResponse = data.choices[0].message.content;
		  chatHistory.push({ role: "assistant", content: botResponse });
		  this.chatHistories[chatID] = chatHistory;
		  return botResponse;
		} else {
		  throw new Error("Unexpected response from the API");
		}
	  })
	  .catch(error => {
		console.error("Error sending prompt to GPT", error.message);
		
		// Handle different error scenarios with custom messages
		if (error.message === "Unexpected response from the API") {
		  return "Error: Unexpected response from the API.";
		} else if (error.message === "Network response was not ok: 429 Too Many Requests") {
		  return "Error: Too many requests. Please try again later.";
		} else {
		  return "Error: An unexpected error occurred. Please try again later.";
		}
	  });
	}


    exportAll() {
      const allChats = {};
      const chatIDs = Object.keys(this.chatHistories);
      for (const chatID of chatIDs) {
        allChats[chatID] = this.chatHistories[chatID];
      }
      const json = JSON.stringify(allChats);
      return json;
    }

    importAll(args) {
      const json = args.json;
      const mergeOption = args.merge.toLowerCase();
      let importedChats;
      try {
        importedChats = JSON.parse(json);
      } catch (error) {
        console.error('Error parsing JSON:', error.message);
        return;
      }
      if (typeof importedChats === 'object' && importedChats !== null) {
        if (mergeOption === 'remove all and import') {
          this.chatHistories = importedChats;
        } else if (mergeOption === 'merge with existing chats') {
          const importedChatIDs = Object.keys(importedChats);
          for (const chatID of importedChatIDs) {
            this.chatHistories[chatID] = importedChats[chatID];
          }
        } else {
          console.error('Invalid merge option. Expected "remove all and import" or "merge with existing chats".');
		  return 'Invalid merge option. Expected "remove all and import" or "merge with existing chats".';
        }
      } else {
        console.error('Invalid JSON format. Expected an object.');
		return "Invalid JSON format. Expected an object.";
      }
    }

  }
  Scratch.extensions.register(new WorkingTurboGPT());
})(Scratch);
