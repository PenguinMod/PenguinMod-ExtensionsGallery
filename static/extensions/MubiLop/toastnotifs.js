// CODE GENERATED USING mCompiler (v1.0) | Made by MubiLop
// Hash: 11314fe2 | Generated: 4/6/2025, 1:29:36 AM UTC
// Name: Toast Notifs
// ID: toastnotifs
// Description: Did you want alerts? Notifications that are easily customizable? This is the only and best notification extension!
// By: MubiLop, themeatly2 and ddededodediamante

(function (Scratch) {
    "use strict";
 
    // mCompiler will change these objects to have the values
    const icon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny40OTgiIGhlaWdodD0iNzcuNDk4IiB2aWV3Qm94PSIwLDAsNzcuNDk4LDc3LjQ5OCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwMS4yNTE1LC0xNDEuMjUxNSkiPjxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjAxLjI1MTUsMTgwLjAwMDVjMCwtMjEuNCAxNy4zNDksLTM4Ljc0OSAzOC43NDksLTM4Ljc0OWMyMS40LDAgMzguNzQ5LDE3LjM0OSAzOC43NDksMzguNzQ5YzAsMjEuNCAtMTcuMzQ5LDM4Ljc0OSAtMzguNzQ5LDM4Ljc0OWMtMjEuNCwwIC0zOC43NDksLTE3LjM0OSAtMzguNzQ5LC0zOC43NDkiIGZpbGw9IiNjYzU1MDAiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yMDUuODU4NSwxODAuMDAwNWMwLC0xOC44NTYgMTUuMjg2LC0zNC4xNDIgMzQuMTQyLC0zNC4xNDJjMTguODU2LDAgMzQuMTQyLDE1LjI4NiAzNC4xNDIsMzQuMTQyYzAsMTguODU2IC0xNS4yODYsMzQuMTQyIC0zNC4xNDIsMzQuMTQyYy0xOC44NTYsMCAtMzQuMTQyLC0xNS4yODYgLTM0LjE0MiwtMzQuMTQyIiBmaWxsPSIjZmY3NzI0IiBzdHJva2Utd2lkdGg9IjEiLz48Zz48cGF0aCBkPSJNMjMxLjI2NDEzLDE4Mi4yNzQxNGMwLjEwMzY0LDAuMTE0MDggMC4xNDU3OCwwLjI2NTIgMC4xMTQ1MywwLjQxMjY1bC0yLjU0OTc5LDEyLjU5NzI0Yy0wLjAwNTExLDAuMDIyNjcgLTAuMDEwMjIsMC4wNDUzNCAtMC4wMTkzLDAuMDY3ODFsLTEuMzQyNjIsMy42NjE3OGMxLjcxODM1LDAuMTg5MjQgMy4wMTc3MiwxLjYzNzQ1IDIuOTMzNTIsMy4zMTgxOGMtMC4wODc2MywxLjc0OTMzIC0xLjYzODQxLDMuMDk2NzggLTMuNDU5MSwzLjAwNTU3Yy0xLjgyMDY5LC0wLjA5MTIxIC0zLjIyOTAzLC0xLjU4NjkgLTMuMTQxMzksLTMuMzM2MjNsMC4wMTIyMiwtMC4yNDM5MmMwLjAzOTYyLC0wLjc5MDgyIDAuMzU5MDcsLTEuNTcxNDQgMC42OTg1OCwtMi4zOTQ5OWMwLjQ2NDM0LC0xLjEzMjUxIDEuMzQ4MDgsLTIuMzgxNTYgMS4zMTA1NCwtMy44OTQ1NWMtMC4wNTI0MywwLjAxNDU3IC0wLjEwODcyLDAuMDI3MDMgLTAuMTY4MjIsMC4wMjQwNWMtMS45NjM0OSwtMC4wOTgzNiAtMy4xOTQ4MSwwLjMwOTkgLTQuMjgwNjYsMC42NzE5NmMtMC44MTI4NSwwLjI3MDY3IC0xLjUxNjUxLDAuNTA0NzggLTIuMzM3NiwwLjQ2MzY1Yy0wLjAyMTgyLC0wLjAwMTA5IC0wLjA0MzYzLC0wLjAwMjE5IC0wLjA2MzQ3LC0wLjAwMzE4bC0wLjI0NTkzLC0wLjAxMjMyYy0xLjgyMDY5LC0wLjA5MTIxIC0zLjIyOTAzLC0xLjU4NjkgLTMuMTQxMzksLTMuMzM2MjNjMC4wODc2MywtMS43NDkzMyAxLjYzODQxLC0zLjA5Njc4IDMuNDU5MDksLTMuMDA1NTdjMS42ODk3OSwwLjA4NDY1IDMuMDI4NDQsMS4zODM5IDMuMTM3OSwyLjk2OTI3YzAuMDQ4MTcsLTAuMDA5MDUgMC4xMDIzOSwtMC4wMTk3MSAwLjE2ODg5LC0wLjAzNzM5YzAuNzQyODIsLTAuMTgyNDggMy4wNDAyNCwtMC41NTgzNSAzLjc3NTk1LC0wLjY3ODE1bDEuNTczNTgsLTcuMjc5OTJjMC4wNDM2MiwtMC4xNTYzNyAwLjQwMzQ4LC0zLjAxMzQ2IDMuMTU1NjIsLTMuMTM5MjFjMC4xNTM1OCwtMC4wMDk1IDAuMzA3NDksMC4wNTM2MSAwLjQwOTA1LDAuMTY5NXpNMjM5Ljk1MDQ2LDE5MS40NTMwN2MwLjEwNzgsMC4xMTA0NyAwLjE1NTk4LDAuMjU5OTggMC4xMzQ2NSwwLjQwNzkyYy0wLjQwNTUzLDIuNjE3OTEgLTMuNDYzLDIuODg1MDIgLTMuNTk1MzMsMi45MDcwNWwtNi43MDY1OSwwLjYzNjRjMC4wMjU0NCwtMC4wNzEzMiAwLjA0NDc1LC0wLjEzOTEzIDAuMDU4MSwtMC4yMDcyM2wwLjY3Mjk5LC0zLjExNDU4bDkuMDIwMjMsLTAuNzgwMzFjMC4wMzc5NywtMC4wMDM4MyAwLjA3NzczLC0wLjAwMzc1IDAuMTE1MjIsMC4wMDE5NWMwLjExNDU1LDAuMDE1MjkgMC4yMTkzNiwwLjA2NjM5IDAuMzAwNzMsMC4xNDg3OXpNMjE3LjEwNzI0LDE5My4zNTE5MWMtMC4wNDcxNiwwLjk0MTM2IDAuNzExNzYsMS43NDczNSAxLjY5MTUyLDEuNzk2NDNjMC45Nzk3NiwwLjA0OTA4IDEuODE1NDMsLTAuNjc3MDIgMS44NjI1OSwtMS42MTgzOGMwLjA0NzE2LC0wLjk0MTM2IC0wLjcxMTc2LC0xLjc0NzM1IC0xLjY5MTUyLC0xLjc5NjQzYy0wLjk3OTc2LC0wLjA0OTA4IC0xLjgxNTQzLDAuNjc3MDIgLTEuODYyNTksMS42MTgzOHpNMjI2Ljc2NjMyLDE5My41OTEyOGMtMC4wMTM0NiwwLjI2ODY5IDAuMjAzNjQsMC40OTkyNiAwLjQ4MzI5LDAuNTEzMjdjMC4yNzk2NSwwLjAxNDAxIDAuNTE4NzEsLTAuMTkzNzEgMC41MzIxNywtMC40NjI0YzAuMDEzNDYsLTAuMjY4NjkgLTAuMjAzNjQsLTAuNDk5MjYgLTAuNDgzMjksLTAuNTEzMjdjLTAuMjc5NjUsLTAuMDE0MDEgLTAuNTE4NzEsMC4xOTM3MSAtMC41MzIxNywwLjQ2MjR6TTIyNS4zMjMxOCwyMDIuMDc3NDRjLTAuMDQ3MTYsMC45NDEzNiAwLjcxMTc2LDEuNzQ3MzUgMS42OTE1MiwxLjc5NjQzYzAuOTc5NzYsMC4wNDkwOCAxLjgxNTQzLC0wLjY3NzAyIDEuODYyNTksLTEuNjE4MzhjMC4wNDcxNiwtMC45NDEzNiAtMC43MTE3NiwtMS43NDczNSAtMS42OTE1MiwtMS43OTY0M2MtMC45Nzk3NiwtMC4wNDkwOCAtMS44MTU0MywwLjY3NzAyIC0xLjg2MjU5LDEuNjE4Mzh6IiBmaWxsPSIjZjlmOWY5IiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjY0LjA5NTQzLDE2Ni42OTgzMmwtNC45MzU3MywtMC4zMzcyOWw1LjI2MDEzLC00LjQwOTcyek0yNTYuMjY4MTYsMTczLjUyNDI0bC01LjIyNjk5LC0wLjM1NzJsNS41NzA1MywtNC42Njk5NXpNMjY0LjAwNDQsMTY4LjAzMDQzbC0wLjQwOTY1LDUuOTk0NDlsLTUuOTk0NDksLTAuNDA5NjVsMC40MDk2NSwtNS45OTQ0OXpNMjQ4LjQ0MDg4LDE4MC4zNTAxNmwtNS41MTgyNiwtMC4zNzcxbDUuODgwOTQsLTQuOTMwMTd6TTI1Ni4xNzcxMiwxNzQuODU2MzVsLTAuNDA5NjUsNS45OTQ0OWwtNS45OTQ0OSwtMC40MDk2NWwwLjQwOTY1LC01Ljk5NDQ5ek0yNjMuNTAzNzIsMTc1LjM1NzAybC0wLjQwOTY1LDUuOTk0NDlsLTUuOTk0NDksLTAuNDA5NjVsMC40MDk2NSwtNS45OTQ0OXpNMjQwLjYxMzYsMTg3LjE3NjA4bC01LjMyODQ0LC0wLjM2NDEzYy0wLjEzNTAxLC0wLjAwOTIzIC0wLjI1ODIsLTAuMDU4NTUgLTAuMzU4NjgsLTAuMTM1NWw2LjA2ODk0LC01LjA4Nzc4ek0yNDguMzQ5ODUsMTgxLjY4MjI3bC0wLjQwOTY1LDUuOTk0NDlsLTUuOTk0NDksLTAuNDA5NjVsMC40MDk2NSwtNS45OTQ0OXpNMjU1LjY3NjQ1LDE4Mi4xODI5NWwtMC40MDk2NSw1Ljk5NDQ5bC01Ljk5NDQ5LC0wLjQwOTY1bDAuNDA5NjUsLTUuOTk0NDl6TTI2My4wMDMwNSwxODIuNjgzNjJsLTAuMzY0MTMsNS4zMjg0NGMtMC4wMjUwMywwLjM2NjMzIC0wLjM0NTI0LDAuNjQ1NTcgLTAuNzExNTcsMC42MjA1NGwtNS4zMjg0NCwtMC4zNjQxM2wwLjQwOTY1LC01Ljk5NDQ5eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTIzMy42MzM3LDE4MC4xNTg1NWw0LjkwMjc4LC0wLjY2MTczbC00LjI2NjM2LDUuMzc3MDZ6TTIzOS45MjkxMywxNzEuODk4NThsNS4xOTIxMSwtMC43MDA3OGwtNC41MTgxMiw1LjY5NDM3ek0yMzMuNDU1MTEsMTc4LjgzNTMzbC0wLjgwMzY4LC01Ljk1NDQ4bDUuOTU0NDgsLTAuODAzNjdsMC44MDM2Nyw1Ljk1NDQ4ek0yNDYuMjI0NTYsMTYzLjYzODYybDUuNDgxNDMsLTAuNzM5ODNsLTQuNzY5ODksNi4wMTE2OHpNMjM5Ljc1MDU0LDE3MC41NzUzN2wtMC44MDM2NywtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY3bDAuODAzNjcsNS45NTQ0OHpNMjMyLjQ3Mjg0LDE3MS41NTc2NGwtMC44MDM2NywtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY3bDAuODAzNjcsNS45NTQ0OHpNMjUyLjUxOTk5LDE1NS4zNzg2NWw1LjI5Mjg3LC0wLjcxNDM4YzAuMTM0MTEsLTAuMDE4MSAwLjI2NDcsMC4wMDU0NSAwLjM3ODU5LDAuMDYwNjNsLTQuOTIyMzcsNi4yMDM4NXpNMjQ2LjA0NTk2LDE2Mi4zMTU0bC0wLjgwMzY3LC01Ljk1NDQ4bDUuOTU0NDgsLTAuODAzNjhsMC44MDM2OCw1Ljk1NDQ4ek0yMzguNzY4MjcsMTYzLjI5NzY3bC0wLjgwMzY3LC01Ljk1NDQ4bDUuOTU0NDgsLTAuODAzNjdsMC44MDM2OCw1Ljk1NDQ4ek0yMzEuNDkwNTcsMTY0LjI3OTk0bC0wLjcxNDM4LC01LjI5Mjg3Yy0wLjA0OTExLC0wLjM2Mzg4IDAuMjA4NDMsLTAuNzAxNzkgMC41NzIzMSwtMC43NTA5MWw1LjI5Mjg3LC0wLjcxNDM4bDAuODAzNjcsNS45NTQ0OHoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yNTUuMDU0MDgsMTY1LjMxMzg4Yy0wLjI4ODI2LDAuMDY1NzQgLTAuNTc1MjUsLTAuMTE0NjQgLTAuNjQwOTksLTAuNDAyOTFsLTAuMjAyMTMsLTAuODg2MjhjLTAuMDY1NzQsLTAuMjg4MjYgMC4xMTQ2NCwtMC41NzUyNSAwLjQwMjkxLC0wLjY0MDk5bDAuODg2MjgsLTAuMjAyMTNjMC4yODgyNiwtMC4wNjU3NCAwLjU3NTI1LDAuMTE0NjQgMC42NDA5OSwwLjQwMjkxbDAuMjAyMTMsMC44ODYyOGMwLjA2NTc0LDAuMjg4MjYgLTAuMTE0NjQsMC41NzUyNSAtMC40MDI5MSwwLjY0MDk5eiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI2MS4wODgzMiwxNjEuMzQ1OTFjLTAuMjE2NTEsMC4wNDkzOCAtMC40MzIwNSwtMC4wODYxMSAtMC40ODE0MywtMC4zMDI2MmwtMC4xNTE4MiwtMC42NjU2NmMtMC4wNDkzOCwtMC4yMTY1MSAwLjA4NjExLC0wLjQzMjA1IDAuMzAyNjIsLTAuNDgxNDNsMC42NjU2NiwtMC4xNTE4MmMwLjIxNjUxLC0wLjA0OTM4IDAuNDMyMDUsMC4wODYxMSAwLjQ4MTQzLDAuMzAyNjJsMC4xNTE4MiwwLjY2NTY2YzAuMDQ5MzgsMC4yMTY1MSAtMC4wODYxMSwwLjQzMjA1IC0wLjMwMjYyLDAuNDgxNDN6IiBmaWxsPSIjZjlmOWY5IiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjU0LjQxMTk1LDE3Mi42MzM1Yy0wLjIxNjUxLDAuMDY1NzQgLTAuNDMyMDUsLTAuMTE0NjQgLTAuNDgxNDMsLTAuNDAyOTFsLTAuMTUxODIsLTAuODg2MjhjLTAuMDQ5MzgsLTAuMjg4MjYgMC4wODYxMSwtMC41NzUyNSAwLjMwMjYyLC0wLjY0MDk5bDAuNjY1NjYsLTAuMjAyMTNjMC4yMTY1MSwtMC4wNjU3NCAwLjQzMjA1LDAuMTE0NjQgMC40ODE0MywwLjQwMjkxbDAuMTUxODIsMC44ODYyOGMwLjA0OTM4LDAuMjg4MjYgLTAuMDg2MTEsMC41NzUyNSAtMC4zMDI2MiwwLjY0MDk5eiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI0Ny4yMTkwNCwxNzcuMzA4MWMtMC4yMTY1MSwwLjA0OTM4IC0wLjQzMjA1LC0wLjA4NjExIC0wLjQ4MTQzLC0wLjMwMjYybC0wLjE1MTgyLC0wLjY2NTY2Yy0wLjA0OTM4LC0wLjIxNjUxIDAuMDg2MTEsLTAuNDMyMDUgMC4zMDI2MiwtMC40ODE0M2wwLjY2NTY2LC0wLjE1MTgyYzAuMjE2NTEsLTAuMDQ5MzggMC40MzIwNSwwLjA4NjExIDAuNDgxNDMsMC4zMDI2MmwwLjE1MTgyLDAuNjY1NjZjMC4wNDkzOCwwLjIxNjUxIC0wLjA4NjExLDAuNDMyMDUgLTAuMzAyNjIsMC40ODE0M3oiIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNDkuNzgyODcsMTcwLjc0NDk5Yy0wLjIxNjUxLDAuMDQ5MzggLTAuNDMyMDUsLTAuMDg2MTEgLTAuNDgxNDMsLTAuMzAyNjJsLTAuMTUxODIsLTAuNjY1NjZjLTAuMDQ5MzgsLTAuMjE2NTEgMC4wODYxMSwtMC40MzIwNSAwLjMwMjYyLC0wLjQ4MTQzbDAuNjY1NjYsLTAuMTUxODJjMC4yMTY1MSwtMC4wNDkzOCAwLjQzMjA1LDAuMDg2MTEgMC40ODE0MywwLjMwMjYybDAuMTUxODIsMC42NjU2NmMwLjA0OTM4LDAuMjE2NTEgLTAuMDg2MTEsMC40MzIwNSAtMC4zMDI2MiwwLjQ4MTQzeiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIwIi8+PC9nPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM4Ljc0ODUwMDAwMDAwMDAxOjM4Ljc0ODUwMDAwMDAwMDAxLS0+"
    const icons = {
  "block": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0OC44Mzk2NiIgaGVpZ2h0PSI1MC42ODM0OCIgdmlld0JveD0iMCwwLDQ4LjgzOTY2LDUwLjY4MzQ4Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjE1LjU4MDE3LC0xNTQuNjU4MjYpIj48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PGc+PHBhdGggZD0iTTIzMS4yNjQxMywxODIuMjc0MTRjMC4xMDM2NCwwLjExNDA4IDAuMTQ1NzgsMC4yNjUyIDAuMTE0NTMsMC40MTI2NWwtMi41NDk3OSwxMi41OTcyNGMtMC4wMDUxMSwwLjAyMjY3IC0wLjAxMDIyLDAuMDQ1MzQgLTAuMDE5MywwLjA2NzgxbC0xLjM0MjYyLDMuNjYxNzhjMS43MTgzNSwwLjE4OTI0IDMuMDE3NzIsMS42Mzc0NSAyLjkzMzUyLDMuMzE4MThjLTAuMDg3NjMsMS43NDkzMyAtMS42Mzg0MSwzLjA5Njc4IC0zLjQ1OTEsMy4wMDU1N2MtMS44MjA2OSwtMC4wOTEyMSAtMy4yMjkwMywtMS41ODY5IC0zLjE0MTM5LC0zLjMzNjIzbDAuMDEyMjIsLTAuMjQzOTJjMC4wMzk2MiwtMC43OTA4MiAwLjM1OTA3LC0xLjU3MTQ0IDAuNjk4NTgsLTIuMzk0OTljMC40NjQzNCwtMS4xMzI1MSAxLjM0ODA4LC0yLjM4MTU2IDEuMzEwNTQsLTMuODk0NTVjLTAuMDUyNDMsMC4wMTQ1NyAtMC4xMDg3MiwwLjAyNzAzIC0wLjE2ODIyLDAuMDI0MDVjLTEuOTYzNDksLTAuMDk4MzYgLTMuMTk0ODEsMC4zMDk5IC00LjI4MDY2LDAuNjcxOTZjLTAuODEyODUsMC4yNzA2NyAtMS41MTY1MSwwLjUwNDc4IC0yLjMzNzYsMC40NjM2NWMtMC4wMjE4MiwtMC4wMDEwOSAtMC4wNDM2MywtMC4wMDIxOSAtMC4wNjM0NywtMC4wMDMxOGwtMC4yNDU5MywtMC4wMTIzMmMtMS44MjA2OSwtMC4wOTEyMSAtMy4yMjkwMywtMS41ODY5IC0zLjE0MTM5LC0zLjMzNjIzYzAuMDg3NjMsLTEuNzQ5MzMgMS42Mzg0MSwtMy4wOTY3OCAzLjQ1OTA5LC0zLjAwNTU3YzEuNjg5NzksMC4wODQ2NSAzLjAyODQ0LDEuMzgzOSAzLjEzNzksMi45NjkyN2MwLjA0ODE3LC0wLjAwOTA1IDAuMTAyMzksLTAuMDE5NzEgMC4xNjg4OSwtMC4wMzczOWMwLjc0MjgyLC0wLjE4MjQ4IDMuMDQwMjQsLTAuNTU4MzUgMy43NzU5NSwtMC42NzgxNWwxLjU3MzU4LC03LjI3OTkyYzAuMDQzNjIsLTAuMTU2MzcgMC40MDM0OCwtMy4wMTM0NiAzLjE1NTYyLC0zLjEzOTIxYzAuMTUzNTgsLTAuMDA5NSAwLjMwNzQ5LDAuMDUzNjEgMC40MDkwNSwwLjE2OTV6TTIzOS45NTA0NiwxOTEuNDUzMDdjMC4xMDc4LDAuMTEwNDcgMC4xNTU5OCwwLjI1OTk4IDAuMTM0NjUsMC40MDc5MmMtMC40MDU1MywyLjYxNzkxIC0zLjQ2MywyLjg4NTAyIC0zLjU5NTMzLDIuOTA3MDVsLTYuNzA2NTksMC42MzY0YzAuMDI1NDQsLTAuMDcxMzIgMC4wNDQ3NSwtMC4xMzkxMyAwLjA1ODEsLTAuMjA3MjNsMC42NzI5OSwtMy4xMTQ1OGw5LjAyMDIzLC0wLjc4MDMxYzAuMDM3OTcsLTAuMDAzODMgMC4wNzc3MywtMC4wMDM3NSAwLjExNTIyLDAuMDAxOTVjMC4xMTQ1NSwwLjAxNTI5IDAuMjE5MzYsMC4wNjYzOSAwLjMwMDczLDAuMTQ4Nzl6TTIxNy4xMDcyNCwxOTMuMzUxOTFjLTAuMDQ3MTYsMC45NDEzNiAwLjcxMTc2LDEuNzQ3MzUgMS42OTE1MiwxLjc5NjQzYzAuOTc5NzYsMC4wNDkwOCAxLjgxNTQzLC0wLjY3NzAyIDEuODYyNTksLTEuNjE4MzhjMC4wNDcxNiwtMC45NDEzNiAtMC43MTE3NiwtMS43NDczNSAtMS42OTE1MiwtMS43OTY0M2MtMC45Nzk3NiwtMC4wNDkwOCAtMS44MTU0MywwLjY3NzAyIC0xLjg2MjU5LDEuNjE4Mzh6TTIyNi43NjYzMiwxOTMuNTkxMjhjLTAuMDEzNDYsMC4yNjg2OSAwLjIwMzY0LDAuNDk5MjYgMC40ODMyOSwwLjUxMzI3YzAuMjc5NjUsMC4wMTQwMSAwLjUxODcxLC0wLjE5MzcxIDAuNTMyMTcsLTAuNDYyNGMwLjAxMzQ2LC0wLjI2ODY5IC0wLjIwMzY0LC0wLjQ5OTI2IC0wLjQ4MzI5LC0wLjUxMzI3Yy0wLjI3OTY1LC0wLjAxNDAxIC0wLjUxODcxLDAuMTkzNzEgLTAuNTMyMTcsMC40NjI0ek0yMjUuMzIzMTgsMjAyLjA3NzQ0Yy0wLjA0NzE2LDAuOTQxMzYgMC43MTE3NiwxLjc0NzM1IDEuNjkxNTIsMS43OTY0M2MwLjk3OTc2LDAuMDQ5MDggMS44MTU0MywtMC42NzcwMiAxLjg2MjU5LC0xLjYxODM4YzAuMDQ3MTYsLTAuOTQxMzYgLTAuNzExNzYsLTEuNzQ3MzUgLTEuNjkxNTIsLTEuNzk2NDNjLTAuOTc5NzYsLTAuMDQ5MDggLTEuODE1NDMsMC42NzcwMiAtMS44NjI1OSwxLjYxODM4eiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTI2NC4wOTU0MywxNjYuNjk4MzJsLTQuOTM1NzMsLTAuMzM3MjlsNS4yNjAxMywtNC40MDk3MnpNMjU2LjI2ODE2LDE3My41MjQyNGwtNS4yMjY5OSwtMC4zNTcybDUuNTcwNTMsLTQuNjY5OTV6TTI2NC4wMDQ0LDE2OC4wMzA0M2wtMC40MDk2NSw1Ljk5NDQ5bC01Ljk5NDQ5LC0wLjQwOTY1bDAuNDA5NjUsLTUuOTk0NDl6TTI0OC40NDA4OCwxODAuMzUwMTZsLTUuNTE4MjYsLTAuMzc3MWw1Ljg4MDk0LC00LjkzMDE3ek0yNTYuMTc3MTIsMTc0Ljg1NjM1bC0wLjQwOTY1LDUuOTk0NDlsLTUuOTk0NDksLTAuNDA5NjVsMC40MDk2NSwtNS45OTQ0OXpNMjYzLjUwMzcyLDE3NS4zNTcwMmwtMC40MDk2NSw1Ljk5NDQ5bC01Ljk5NDQ5LC0wLjQwOTY1bDAuNDA5NjUsLTUuOTk0NDl6TTI0MC42MTM2LDE4Ny4xNzYwOGwtNS4zMjg0NCwtMC4zNjQxM2MtMC4xMzUwMSwtMC4wMDkyMyAtMC4yNTgyLC0wLjA1ODU1IC0wLjM1ODY4LC0wLjEzNTVsNi4wNjg5NCwtNS4wODc3OHpNMjQ4LjM0OTg1LDE4MS42ODIyN2wtMC40MDk2NSw1Ljk5NDQ5bC01Ljk5NDQ5LC0wLjQwOTY1bDAuNDA5NjUsLTUuOTk0NDl6TTI1NS42NzY0NSwxODIuMTgyOTVsLTAuNDA5NjUsNS45OTQ0OWwtNS45OTQ0OSwtMC40MDk2NWwwLjQwOTY1LC01Ljk5NDQ5ek0yNjMuMDAzMDUsMTgyLjY4MzYybC0wLjM2NDEzLDUuMzI4NDRjLTAuMDI1MDMsMC4zNjYzMyAtMC4zNDUyNCwwLjY0NTU3IC0wLjcxMTU3LDAuNjIwNTRsLTUuMzI4NDQsLTAuMzY0MTNsMC40MDk2NSwtNS45OTQ0OXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yMzMuNjMzNywxODAuMTU4NTVsNC45MDI3OCwtMC42NjE3M2wtNC4yNjYzNiw1LjM3NzA2ek0yMzkuOTI5MTMsMTcxLjg5ODU4bDUuMTkyMTEsLTAuNzAwNzhsLTQuNTE4MTIsNS42OTQzN3pNMjMzLjQ1NTExLDE3OC44MzUzM2wtMC44MDM2OCwtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY3bDAuODAzNjcsNS45NTQ0OHpNMjQ2LjIyNDU2LDE2My42Mzg2Mmw1LjQ4MTQzLC0wLjczOTgzbC00Ljc2OTg5LDYuMDExNjh6TTIzOS43NTA1NCwxNzAuNTc1MzdsLTAuODAzNjcsLTUuOTU0NDhsNS45NTQ0OCwtMC44MDM2N2wwLjgwMzY3LDUuOTU0NDh6TTIzMi40NzI4NCwxNzEuNTU3NjRsLTAuODAzNjcsLTUuOTU0NDhsNS45NTQ0OCwtMC44MDM2N2wwLjgwMzY3LDUuOTU0NDh6TTI1Mi41MTk5OSwxNTUuMzc4NjVsNS4yOTI4NywtMC43MTQzOGMwLjEzNDExLC0wLjAxODEgMC4yNjQ3LDAuMDA1NDUgMC4zNzg1OSwwLjA2MDYzbC00LjkyMjM3LDYuMjAzODV6TTI0Ni4wNDU5NiwxNjIuMzE1NGwtMC44MDM2NywtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY4bDAuODAzNjgsNS45NTQ0OHpNMjM4Ljc2ODI3LDE2My4yOTc2N2wtMC44MDM2NywtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY3bDAuODAzNjgsNS45NTQ0OHpNMjMxLjQ5MDU3LDE2NC4yNzk5NGwtMC43MTQzOCwtNS4yOTI4N2MtMC4wNDkxMSwtMC4zNjM4OCAwLjIwODQzLC0wLjcwMTc5IDAuNTcyMzEsLTAuNzUwOTFsNS4yOTI4NywtMC43MTQzOGwwLjgwMzY3LDUuOTU0NDh6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjU1LjA1NDA4LDE2NS4zMTM4OGMtMC4yODgyNiwwLjA2NTc0IC0wLjU3NTI1LC0wLjExNDY0IC0wLjY0MDk5LC0wLjQwMjkxbC0wLjIwMjEzLC0wLjg4NjI4Yy0wLjA2NTc0LC0wLjI4ODI2IDAuMTE0NjQsLTAuNTc1MjUgMC40MDI5MSwtMC42NDA5OWwwLjg4NjI4LC0wLjIwMjEzYzAuMjg4MjYsLTAuMDY1NzQgMC41NzUyNSwwLjExNDY0IDAuNjQwOTksMC40MDI5MWwwLjIwMjEzLDAuODg2MjhjMC4wNjU3NCwwLjI4ODI2IC0wLjExNDY0LDAuNTc1MjUgLTAuNDAyOTEsMC42NDA5OXoiIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNjEuMDg4MzIsMTYxLjM0NTkxYy0wLjIxNjUxLDAuMDQ5MzggLTAuNDMyMDUsLTAuMDg2MTEgLTAuNDgxNDMsLTAuMzAyNjJsLTAuMTUxODIsLTAuNjY1NjZjLTAuMDQ5MzgsLTAuMjE2NTEgMC4wODYxMSwtMC40MzIwNSAwLjMwMjYyLC0wLjQ4MTQzbDAuNjY1NjYsLTAuMTUxODJjMC4yMTY1MSwtMC4wNDkzOCAwLjQzMjA1LDAuMDg2MTEgMC40ODE0MywwLjMwMjYybDAuMTUxODIsMC42NjU2NmMwLjA0OTM4LDAuMjE2NTEgLTAuMDg2MTEsMC40MzIwNSAtMC4zMDI2MiwwLjQ4MTQzeiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI1NC40MTE5NSwxNzIuNjMzNWMtMC4yMTY1MSwwLjA2NTc0IC0wLjQzMjA1LC0wLjExNDY0IC0wLjQ4MTQzLC0wLjQwMjkxbC0wLjE1MTgyLC0wLjg4NjI4Yy0wLjA0OTM4LC0wLjI4ODI2IDAuMDg2MTEsLTAuNTc1MjUgMC4zMDI2MiwtMC42NDA5OWwwLjY2NTY2LC0wLjIwMjEzYzAuMjE2NTEsLTAuMDY1NzQgMC40MzIwNSwwLjExNDY0IDAuNDgxNDMsMC40MDI5MWwwLjE1MTgyLDAuODg2MjhjMC4wNDkzOCwwLjI4ODI2IC0wLjA4NjExLDAuNTc1MjUgLTAuMzAyNjIsMC42NDA5OXoiIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNDcuMjE5MDQsMTc3LjMwODFjLTAuMjE2NTEsMC4wNDkzOCAtMC40MzIwNSwtMC4wODYxMSAtMC40ODE0MywtMC4zMDI2MmwtMC4xNTE4MiwtMC42NjU2NmMtMC4wNDkzOCwtMC4yMTY1MSAwLjA4NjExLC0wLjQzMjA1IDAuMzAyNjIsLTAuNDgxNDNsMC42NjU2NiwtMC4xNTE4MmMwLjIxNjUxLC0wLjA0OTM4IDAuNDMyMDUsMC4wODYxMSAwLjQ4MTQzLDAuMzAyNjJsMC4xNTE4MiwwLjY2NTY2YzAuMDQ5MzgsMC4yMTY1MSAtMC4wODYxMSwwLjQzMjA1IC0wLjMwMjYyLDAuNDgxNDN6IiBmaWxsPSIjZjlmOWY5IiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjQ5Ljc4Mjg3LDE3MC43NDQ5OWMtMC4yMTY1MSwwLjA0OTM4IC0wLjQzMjA1LC0wLjA4NjExIC0wLjQ4MTQzLC0wLjMwMjYybC0wLjE1MTgyLC0wLjY2NTY2Yy0wLjA0OTM4LC0wLjIxNjUxIDAuMDg2MTEsLTAuNDMyMDUgMC4zMDI2MiwtMC40ODE0M2wwLjY2NTY2LC0wLjE1MTgyYzAuMjE2NTEsLTAuMDQ5MzggMC40MzIwNSwwLjA4NjExIDAuNDgxNDMsMC4zMDI2MmwwLjE1MTgyLDAuNjY1NjZjMC4wNDkzOCwwLjIxNjUxIC0wLjA4NjExLDAuNDMyMDUgLTAuMzAyNjIsMC40ODE0M3oiIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoyNC40MTk4MjgzODIwOTkyNDoyNS4zNDE3MzYzODg0NDU5NTItLT4="
}
    const assets = {}

    if (!Scratch.extensions.unsandboxed) {
       throw new Error('"Toast Notifications" cannot run unsandboxed.');
    }
 
    const {
       BlockType,
       ArgumentType,
       Cast
    } = Scratch;
 
    // vulnerability go BRRRRRRRRRRRRR
    function xmlEscape(str) {
       return str.replace(/&/g, "&amp;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;")
          .replace(/"/g, "&quot;")
          .replace(/'/g, "&#39;");
    }
 
    function validColour(colour) {
       if (typeof colour != "string") return false;
       const hexRegex = /^#[0-9A-F]{6}$/i;
       return hexRegex.test(colour);
    }
 
    const toastConfig = {
        soundWhenEnabled: "true"
    };

    // Style system 
    const defaultStyles = {
       toast: {
          '--toast-bg': '#1a1a1a',
          '--toast-color': '#ffffff',
          '--toast-font-size': '16px',
          '--toast-border-radius': '16px',
          '--toast-padding': '15px',
          '--toast-duration': '3000',
          '--toast-min-width': '300px',
          '--toast-max-width': '400px',
          '--toast-shadow': '0 8px 16px rgba(0,0,0,0.2)',
          '--toast-z-index': 9999,
          '--toast-margin': '10px',
          'soundUrl': null
       },
       types: {
          origin: {
             '--toast-type-bg': '#1a1a1a',
             '--toast-type-color': '#ffffff'
          },
          success: {
             '--toast-type-bg': '#4CAF50',
             '--toast-type-color': '#ffffff'
          },
          error: {
             '--toast-type-bg': '#f44336',
             '--toast-type-color': '#ffffff'
          },
          warning: {
             '--toast-type-bg': '#ff9800',
             '--toast-type-color': '#000000'
          },
          info: {
             '--toast-type-bg': '#2196F3',
             '--toast-type-color': '#ffffff'
          }
       }
    };
 
    let styleConfig = JSON.parse(JSON.stringify(defaultStyles));
 
    // Enhanced container management for stacking
    const createToastContainer = (position) => {
       let container = document.getElementById('ToastContainer');
       if (!container) {
          container = document.createElement('div');
          container.id = 'ToastContainer';
          container.dataset.toasts = '0';
          document.body.appendChild(container);
       }
       container.className = `toast-container ${position}`;
       return container;
    };
 
    // Style injection
    const injectStyles = () => {
       const styleId = 'ToastStyles';
       if (document.getElementById(styleId)) return;
 
       const style = document.createElement('style');
       style.id = styleId;
       style.textContent = `
         :root {
           --toast-slide-duration: 0.3s;
         }
         
         .toast-container {
           position: fixed;
           z-index: 9999;
           padding: 20px;
         }
         
         .toast-container.top-left { top: 0; left: 0; }
         .toast-container.top-right { top: 0; right: 0; }
         .toast-container.top-center { top: 0; left: 50%; transform: translateX(-50%); }
         .toast-container.bottom-left { bottom: 0; left: 0; }
         .toast-container.bottom-right { bottom: 0; right: 0; }
         .toast-container.bottom-center { bottom: 0; left: 50%; transform: translateX(-50%); }
         .toast-container.center-left { top: 50%; left: 0; transform: translateY(-50%); }
         .toast-container.center-right { top: 50%; right: 0; transform: translateY(-50%); }
         .toast-container.center-center { 
           top: 50%; 
           left: 50%; 
           transform: translate(-50%, -50%); 
         }
         
         .toast {
           display: flex;
           align-items: center;
           margin-bottom: var(--toast-margin);
           background-color: var(--toast-type-bg);
           color: var(--toast-type-color);
           font-size: var(--toast-font-size);
           border-radius: var(--toast-border-radius);
           padding: var(--toast-padding);
           min-width: var(--toast-min-width);
           max-width: var(--toast-max-width);
           box-shadow: var(--toast-shadow);
           opacity: 0;
           transform: translateY(100%);
           animation: toastSlideIn var(--toast-slide-duration) cubic-bezier(0.0, 0.0, 0.2, 1) forwards;
         }
         
         .toast img {
           width: 40px;
           height: 40px;
           margin-right: 15px;
           object-fit: cover;
           border-radius: calc(var(--toast-border-radius) / 2);
         }
         
         .toast-content {
           flex-grow: 1;
         }
         
         .toast-title {
           font-weight: bold;
           margin-bottom: 4px;
         }
         
         .toast-description {
           font-size: 0.9em;
           opacity: 0.8;
         }
         
         @keyframes toastSlideIn {
           from {
             opacity: 0;
             transform: translateY(100%);
           }
           to {
             opacity: 1;
             transform: translateY(0);
           }
         }
         
         @keyframes toastSlideOut {
           from {
             opacity: 1;
             transform: translateY(0);
           }
           to {
             opacity: 0;
             transform: translateY(100%);
           }
         }
       `;
       document.head.appendChild(style);
    };
 
    class ToastNotifications {
       constructor() {
          injectStyles();
       }
 
       getInfo() {
          return {
             id: 'toastnotifs',
             name: 'Toast Notifs',
             color1: '#4CAF50',
             menuIconURI: icon,
             blockIconURI: assets.block,
             color1: "#905c1b",
             blocks: [{
                   opcode: 'showToastNew',
                   blockType: BlockType.COMMAND,
                   text: 'show [TYPE] toast with title [TITLE] message [MESSAGE] at [POSITION]',
                   arguments: {
                      TYPE: {
                         type: ArgumentType.STRING,
                         menu: 'types',
                         defaultValue: 'origin'
                      },
                      TITLE: {
                         type: ArgumentType.STRING,
                         defaultValue: 'Hello!'
                      },
                      MESSAGE: {
                         type: ArgumentType.STRING,
                         defaultValue: 'This is a toast message'
                      },
                      POSITION: {
                         type: ArgumentType.STRING,
                         menu: 'positions',
                         defaultValue: 'bottom-right'
                      }
                   }
                },
                {
                   opcode: 'showImageToast',
                   blockType: BlockType.COMMAND,
                   text: 'show [TYPE] toast with image [IMAGE] title [TITLE] message [MESSAGE] at [POSITION]',
                   arguments: {
                      TYPE: {
                         type: ArgumentType.STRING,
                         menu: 'types',
                         defaultValue: 'origin'
                      },
                      IMAGE: {
                         type: ArgumentType.STRING,
                         defaultValue: 'https://scratch.mit.edu/favicon.ico'
                      },
                      TITLE: {
                         type: ArgumentType.STRING,
                         defaultValue: 'Image Toast'
                      },
                      MESSAGE: {
                         type: ArgumentType.STRING,
                         defaultValue: 'This is a toast with an image!'
                      },
                      POSITION: {
                         type: ArgumentType.STRING,
                         menu: 'positions',
                         defaultValue: 'bottom-right'
                      }
                   }
                },
                {
                   opcode: 'setCustomStyle',
                   blockType: BlockType.COMMAND,
                   text: 'set toast style [STYLE] to [VALUE]',
                   arguments: {
                      STYLE: {
                         type: ArgumentType.STRING,
                         menu: 'styleProperties'
                      },
                      VALUE: {
                         type: ArgumentType.STRING,
                         defaultValue: ''
                      }
                   }
                },
                {
                   opcode: 'setTypeStyle',
                   blockType: BlockType.COMMAND,
                   text: 'set [TYPE] toast background to [BG] and text color to [COLOR]',
                   arguments: {
                      TYPE: {
                         type: ArgumentType.STRING,
                         menu: 'types'
                      },
                      BG: {
                         type: ArgumentType.COLOR
                      },
                      COLOR: {
                         type: ArgumentType.COLOR
                      }
                   }
                },
                {
                   opcode: 'resetStyles',
                   blockType: BlockType.COMMAND,
                   text: 'reset all styles to default'
                },
                {
                    opcode: 'showCustomNotification',
                    blockType: BlockType.COMMAND,
                    text: 'show notification [TYPE] with title [TITLE] message [MESSAGE] at [POSITION] with custom css [CSS]',
                    hideFromPalette: true,
                    arguments: {
                        TYPE: {
                            type: ArgumentType.STRING,
                            menu: 'types'
                        },
                        TITLE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Title'
                        },
                        MESSAGE: {
                            type: ArgumentType.STRING,
                            defaultValue: 'Message'
                        },
                        POSITION: {
                            type: ArgumentType.STRING,
                            menu: 'positions'
                        },
                        CSS: {
                            type: ArgumentType.STRING,
                            defaultValue: ''
                        }
                    }
                },
                {
                    opcode: 'setSoundEnabled',
                    blockType: BlockType.COMMAND,
                    text: 'set notification sounds [ENABLED]',
                    arguments: {
                        ENABLED: {
                            type: ArgumentType.STRING,
                            menu: 'enabledMenu'
                        }
                    }
                },
                {
                   opcode: 'showToast',
                   blockType: BlockType.COMMAND,
                   text: 'Show Toast with text [TEXT] with image [IMAGE] image rounded? [ROUNDED]',
                   hideFromPalette: true,
                   arguments: {
                      TEXT: {
                         type: ArgumentType.STRING,
                         defaultValue: 'Toast!'
                      },
                      IMAGE: {
                         type: ArgumentType.STRING,
                         defaultValue: 'https://scratch.mit.edu/favicon.ico'
                      },
                      ROUNDED: {
                         type: ArgumentType.STRING,
                         menu: 'yesorno',
                         defaultValue: 'no'
                      }
                   }
                },
                {
                   opcode: 'showNotificationToast',
                   blockType: BlockType.COMMAND,
                   text: 'Show Notification Toast with text [TEXT] at position [POSITION] custom css? [STYLES]',
                   hideFromPalette: true,
                   arguments: {
                      TEXT: {
                         type: ArgumentType.STRING,
                         defaultValue: 'Hello, World!'
                      },
                      POSITION: {
                         type: ArgumentType.STRING,
                         menu: 'position',
                         defaultValue: 'up'
                      },
                      STYLES: {
                         type: ArgumentType.STRING,
                         defaultValue: ''
                      }
                   }
                },
                {
                   opcode: 'showAlert',
                   blockType: BlockType.COMMAND,
                   text: 'Show Alert with text [TEXT] with duration of [DURATION] seconds',
                   hideFromPalette: true,
                   arguments: {
                      TEXT: {
                         type: ArgumentType.STRING,
                         defaultValue: 'Hello!'
                      },
                      DURATION: {
                         type: ArgumentType.STRING,
                         defaultValue: '5'
                      }
                   }
                }
             ],
             menus: {
                positions: {
                   acceptReporters: true,
                   items: [
                      'top-left',
                      'top-center',
                      'top-right',
                      'center-left',
                      'center-center',
                      'center-right',
                      'bottom-left',
                      'bottom-center',
                      'bottom-right'
                   ]
                },
                types: {
                   acceptReporters: true,
                   items: ['origin', 'success', 'error', 'warning', 'info']
                },
                styleProperties: {
                   acceptReporters: false,
                   items: [{
                         text: 'background color',
                         value: '--toast-bg'
                      },
                      {
                         text: 'text color',
                         value: '--toast-color'
                      },
                      {
                         text: 'font size',
                         value: '--toast-font-size'
                      },
                      {
                         text: 'border radius',
                         value: '--toast-border-radius'
                      },
                      {
                         text: 'padding',
                         value: '--toast-padding'
                      },
                      {
                         text: 'shadow',
                         value: '--toast-shadow'
                      },
                      {
                         text: 'duration (ms)',
                         value: '--toast-duration'
                      },
                      {
                         text: 'minimum width',
                         value: '--toast-min-width'
                      },
                      {
                         text: 'maximum width',
                         value: '--toast-max-width'
                      },
                      {
                         text: 'z-index (deprecated)',
                         value: '--toast-z-index'
                      },
                      {
                         text: 'margin',
                         value: '--toast-margin'
                      },
                      {
                         text: 'sound URL',
                         value: 'soundUrl'
                      }
                   ]
                },
                enabledMenu: ['true', 'false'],
                position: ['up', 'middle', 'down'],
                yesorno: ['yes', 'no']
             }
          };
       }
 
       setCustomStyle(args) {
          const style = Cast.toString(args.STYLE);
          const value = Cast.toString(args.VALUE);
 
          if (style === 'soundUrl') {
             styleConfig.toast[style] = value;
          } else {
             styleConfig.toast[style] = value.includes('px') ? value : `${value}px`;
          }
       }
 
       setTypeStyle(args) {
          const type = Cast.toString(args.TYPE);
          const bg = Cast.toString(args.BG);
          const color = Cast.toString(args.COLOR);
 
          if (styleConfig.types[type]) {
             styleConfig.types[type]['--toast-type-bg'] = validColour(bg) ? bg : defaultStyles.types[type]['--toast-type-bg'];
             styleConfig.types[type]['--toast-type-color'] = validColour(color) ? color : defaultStyles.types[type]['--toast-type-color'];
          }
       }
 
       resetStyles() {
          styleConfig = JSON.parse(JSON.stringify(defaultStyles));
       }
 
       showToastNew(args) {
          this._createToast({
             type: 'origin',
             text: xmlEscape(Cast.toString(args.TEXT)),
             imageRounded: Cast.toString(args.ROUNDED) === 'yes',
             position: 'bottom-right'
          });
       }

       showToast(args) {
         this._createToast({
            type: 'origin',
            text: xmlEscape(Cast.toString(args.TEXT)),
            image: xmlEscape(Cast.toString(args.IMAGE)),
            imageRounded: Cast.toString(args.ROUNDED) === 'yes',
            position: 'bottom-right'
         });
      }
 
       showImageToast(args) {
          this._createToast({
             type: Cast.toString(args.TYPE),
             image: xmlEscape(Cast.toString(args.IMAGE)),
             title: xmlEscape(Cast.toString(args.TITLE)),
             text: xmlEscape(Cast.toString(args.MESSAGE)),
             position: Cast.toString(args.POSITION)
          });
       }
 
       // general function so its better to handle things
       _createToast(options) {
          const container = createToastContainer(options.position);
          const toast = document.createElement('div');
          toast.className = 'toast';

          const zIndex = styleConfig.toast['--toast-z-index'] || 9999;
          toast.style.zIndex = zIndex;

          // Get current stack position
          const stackSize = parseInt(container.dataset.toasts || '0');
          container.dataset.toasts = stackSize + 1;
          
          // Style handling
          const typeStyle = styleConfig.types[options.type] || styleConfig.types.origin;
          Object.entries(typeStyle).forEach(([prop, value]) => {
             toast.style.setProperty(prop, value);
          });
 
          Object.entries(styleConfig.toast).forEach(([prop, value]) => {
             if (prop !== 'soundUrl') {
                toast.style.setProperty(prop, value);
             }
          });
 
          toast.style.transform = `translateY(${stackSize * 100}%)`;
          toast.style.transition = 'transform 0.3s ease-out';
 
          if (options.image) {
             const img = document.createElement('img');
             img.src = options.image;
             img.alt = 'Toast icon';
             if (options.imageRounded) {
                img.style.borderRadius = '50%';
             }
             toast.appendChild(img);
          }
 
          const content = document.createElement('div');
          content.className = 'toast-content';
 
          if (options.title) {
             const title = document.createElement('div');
             title.className = 'toast-title';
             title.textContent = options.title;
             content.appendChild(title);
          }

 
          const message = document.createElement('div');
          message.className = options.title ? 'toast-description' : 'toast-content';
          message.textContent = options.text;
          content.appendChild(message);
 
          toast.appendChild(content);
          container.appendChild(toast);
 
          if (toastConfig.soundWhenEnabled === "true" && styleConfig.toast.soundUrl) {
             const audio = new Audio(styleConfig.toast.soundUrl);
             audio.play().catch(() => {});
          }
 
          const duration = parseInt(styleConfig.toast['--toast-duration']) || defaultStyles.toast['--toast-duration'];
          setTimeout(() => {
             toast.style.animation = `toastSlideOut var(--toast-slide-duration) cubic-bezier(0.4, 0.0, 1, 1) forwards`;
             
             const toasts = container.querySelectorAll('.toast');
             toasts.forEach((t, i) => {
                if (t !== toast) {
                    t.style.transform = `translateY(${i * 100}%)`;
                }
             });
             
             setTimeout(() => {
                toast.remove();
                container.dataset.toasts = Math.max(0, stackSize - 1);
             }, 300);
          }, duration);
       }

       setSoundEnabled({ENABLED}) {
        toastConfig.soundWhenEnabled = Cast.toString(ENABLED);
       }
   
       showCustomNotification(args) {
           this._createToast({
               type: Cast.toString(args.TYPE),
               title: xmlEscape(Cast.toString(args.TITLE)),
               text: xmlEscape(Cast.toString(args.MESSAGE)),
               position: Cast.toString(args.POSITION),
               customCss: Cast.toString(args.CSS)
           });
       }

       showAlert(args) {
          const text = xmlEscape(Cast.toString(args.TEXT));
          const duration = Cast.toNumber(args.DURATION);
          
          this._createToast({
             type: 'origin',
             text: text,
             position: 'center-center',
             duration: duration * 1000 // Convert to milliseconds
          });
       }

       showNotificationToast(args) {
          const position = {
             'up': 'top-right',
             'middle': 'center-right',
             'down': 'bottom-right'
          }[Cast.toString(args.POSITION)] || 'bottom-right';

          this._createToast({
             type: 'origin',
             text: xmlEscape(Cast.toString(args.TEXT)),
             position: position,
             customCss: Cast.toString(args.STYLES)
          });
       }
    }
 
    Scratch.extensions.register(new ToastNotifications());
 })(Scratch);
