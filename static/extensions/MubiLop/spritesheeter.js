// CODE GENERATED USING mCompiler (v1.0) | Made by MubiLop | https://github.com/cicerorph/mCompiler
// Hash: 6b8205cd | Generated: 3/25/2025, 10:02:58 PM UTC
// Name: Spritesheeter
// ID: spritesheeter
// Description: Load and manipulate spritesheets with customizable frames and XML support
// By: MubiLop

(function(Scratch) {
    'use strict';
    
    if (!Scratch.extensions.unsandboxed) {
      throw new Error('"Spritesheeter" cannot run unsandboxed.');
    }
    
    const { BlockType, ArgumentType, Cast } = Scratch;

    // mCompiler will change these objects to have the values
    const icon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI3Ny40OTgiIGhlaWdodD0iNzcuNDk4IiB2aWV3Qm94PSIwLDAsNzcuNDk4LDc3LjQ5OCI+PGcgdHJhbnNmb3JtPSJ0cmFuc2xhdGUoLTIwMS4yNTE1LC0xNDEuMjUxNSkiPjxnIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIj48cGF0aCBkPSJNMjAxLjI1MTUsMTgwLjAwMDVjMCwtMjEuNCAxNy4zNDksLTM4Ljc0OSAzOC43NDksLTM4Ljc0OWMyMS40LDAgMzguNzQ5LDE3LjM0OSAzOC43NDksMzguNzQ5YzAsMjEuNCAtMTcuMzQ5LDM4Ljc0OSAtMzguNzQ5LDM4Ljc0OWMtMjEuNCwwIC0zOC43NDksLTE3LjM0OSAtMzguNzQ5LC0zOC43NDkiIGZpbGw9IiNjYzU1MDAiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yMDUuODU4NSwxODAuMDAwNWMwLC0xOC44NTYgMTUuMjg2LC0zNC4xNDIgMzQuMTQyLC0zNC4xNDJjMTguODU2LDAgMzQuMTQyLDE1LjI4NiAzNC4xNDIsMzQuMTQyYzAsMTguODU2IC0xNS4yODYsMzQuMTQyIC0zNC4xNDIsMzQuMTQyYy0xOC44NTYsMCAtMzQuMTQyLC0xNS4yODYgLTM0LjE0MiwtMzQuMTQyIiBmaWxsPSIjZmY3NzI0IiBzdHJva2Utd2lkdGg9IjEiLz48Zz48cGF0aCBkPSJNMjMxLjI2NDEzLDE4Mi4yNzQxNGMwLjEwMzY0LDAuMTE0MDggMC4xNDU3OCwwLjI2NTIgMC4xMTQ1MywwLjQxMjY1bC0yLjU0OTc5LDEyLjU5NzI0Yy0wLjAwNTExLDAuMDIyNjcgLTAuMDEwMjIsMC4wNDUzNCAtMC4wMTkzLDAuMDY3ODFsLTEuMzQyNjIsMy42NjE3OGMxLjcxODM1LDAuMTg5MjQgMy4wMTc3MiwxLjYzNzQ1IDIuOTMzNTIsMy4zMTgxOGMtMC4wODc2MywxLjc0OTMzIC0xLjYzODQxLDMuMDk2NzggLTMuNDU5MSwzLjAwNTU3Yy0xLjgyMDY5LC0wLjA5MTIxIC0zLjIyOTAzLC0xLjU4NjkgLTMuMTQxMzksLTMuMzM2MjNsMC4wMTIyMiwtMC4yNDM5MmMwLjAzOTYyLC0wLjc5MDgyIDAuMzU5MDcsLTEuNTcxNDQgMC42OTg1OCwtMi4zOTQ5OWMwLjQ2NDM0LC0xLjEzMjUxIDEuMzQ4MDgsLTIuMzgxNTYgMS4zMTA1NCwtMy44OTQ1NWMtMC4wNTI0MywwLjAxNDU3IC0wLjEwODcyLDAuMDI3MDMgLTAuMTY4MjIsMC4wMjQwNWMtMS45NjM0OSwtMC4wOTgzNiAtMy4xOTQ4MSwwLjMwOTkgLTQuMjgwNjYsMC42NzE5NmMtMC44MTI4NSwwLjI3MDY3IC0xLjUxNjUxLDAuNTA0NzggLTIuMzM3NiwwLjQ2MzY1Yy0wLjAyMTgyLC0wLjAwMTA5IC0wLjA0MzYzLC0wLjAwMjE5IC0wLjA2MzQ3LC0wLjAwMzE4bC0wLjI0NTkzLC0wLjAxMjMyYy0xLjgyMDY5LC0wLjA5MTIxIC0zLjIyOTAzLC0xLjU4NjkgLTMuMTQxMzksLTMuMzM2MjNjMC4wODc2MywtMS43NDkzMyAxLjYzODQxLC0zLjA5Njc4IDMuNDU5MDksLTMuMDA1NTdjMS42ODk3OSwwLjA4NDY1IDMuMDI4NDQsMS4zODM5IDMuMTM3OSwyLjk2OTI3YzAuMDQ4MTcsLTAuMDA5MDUgMC4xMDIzOSwtMC4wMTk3MSAwLjE2ODg5LC0wLjAzNzM5YzAuNzQyODIsLTAuMTgyNDggMy4wNDAyNCwtMC41NTgzNSAzLjc3NTk1LC0wLjY3ODE1bDEuNTczNTgsLTcuMjc5OTJjMC4wNDM2MiwtMC4xNTYzNyAwLjQwMzQ4LC0zLjAxMzQ2IDMuMTU1NjIsLTMuMTM5MjFjMC4xNTM1OCwtMC4wMDk1IDAuMzA3NDksMC4wNTM2MSAwLjQwOTA1LDAuMTY5NXpNMjM5Ljk1MDQ2LDE5MS40NTMwN2MwLjEwNzgsMC4xMTA0NyAwLjE1NTk4LDAuMjU5OTggMC4xMzQ2NSwwLjQwNzkyYy0wLjQwNTUzLDIuNjE3OTEgLTMuNDYzLDIuODg1MDIgLTMuNTk1MzMsMi45MDcwNWwtNi43MDY1OSwwLjYzNjRjMC4wMjU0NCwtMC4wNzEzMiAwLjA0NDc1LC0wLjEzOTEzIDAuMDU4MSwtMC4yMDcyM2wwLjY3Mjk5LC0zLjExNDU4bDkuMDIwMjMsLTAuNzgwMzFjMC4wMzc5NywtMC4wMDM4MyAwLjA3NzczLC0wLjAwMzc1IDAuMTE1MjIsMC4wMDE5NWMwLjExNDU1LDAuMDE1MjkgMC4yMTkzNiwwLjA2NjM5IDAuMzAwNzMsMC4xNDg3OXpNMjE3LjEwNzI0LDE5My4zNTE5MWMtMC4wNDcxNiwwLjk0MTM2IDAuNzExNzYsMS43NDczNSAxLjY5MTUyLDEuNzk2NDNjMC45Nzk3NiwwLjA0OTA4IDEuODE1NDMsLTAuNjc3MDIgMS44NjI1OSwtMS42MTgzOGMwLjA0NzE2LC0wLjk0MTM2IC0wLjcxMTc2LC0xLjc0NzM1IC0xLjY5MTUyLC0xLjc5NjQzYy0wLjk3OTc2LC0wLjA0OTA4IC0xLjgxNTQzLDAuNjc3MDIgLTEuODYyNTksMS42MTgzOHpNMjI2Ljc2NjMyLDE5My41OTEyOGMtMC4wMTM0NiwwLjI2ODY5IDAuMjAzNjQsMC40OTkyNiAwLjQ4MzI5LDAuNTEzMjdjMC4yNzk2NSwwLjAxNDAxIDAuNTE4NzEsLTAuMTkzNzEgMC41MzIxNywtMC40NjI0YzAuMDEzNDYsLTAuMjY4NjkgLTAuMjAzNjQsLTAuNDk5MjYgLTAuNDgzMjksLTAuNTEzMjdjLTAuMjc5NjUsLTAuMDE0MDEgLTAuNTE4NzEsMC4xOTM3MSAtMC41MzIxNywwLjQ2MjR6TTIyNS4zMjMxOCwyMDIuMDc3NDRjLTAuMDQ3MTYsMC45NDEzNiAwLjcxMTc2LDEuNzQ3MzUgMS42OTE1MiwxLjc5NjQzYzAuOTc5NzYsMC4wNDkwOCAxLjgxNTQzLC0wLjY3NzAyIDEuODYyNTksLTEuNjE4MzhjMC4wNDcxNiwtMC45NDEzNiAtMC43MTE3NiwtMS43NDczNSAtMS42OTE1MiwtMS43OTY0M2MtMC45Nzk3NiwtMC4wNDkwOCAtMS44MTU0MywwLjY3NzAyIC0xLjg2MjU5LDEuNjE4Mzh6IiBmaWxsPSIjZjlmOWY5IiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjY0LjA5NTQzLDE2Ni42OTgzMmwtNC45MzU3MywtMC4zMzcyOWw1LjI2MDEzLC00LjQwOTcyek0yNTYuMjY4MTYsMTczLjUyNDI0bC01LjIyNjk5LC0wLjM1NzJsNS41NzA1MywtNC42Njk5NXpNMjY0LjAwNDQsMTY4LjAzMDQzbC0wLjQwOTY1LDUuOTk0NDlsLTUuOTk0NDksLTAuNDA5NjVsMC40MDk2NSwtNS45OTQ0OXpNMjQ4LjQ0MDg4LDE4MC4zNTAxNmwtNS41MTgyNiwtMC4zNzcxbDUuODgwOTQsLTQuOTMwMTd6TTI1Ni4xNzcxMiwxNzQuODU2MzVsLTAuNDA5NjUsNS45OTQ0OWwtNS45OTQ0OSwtMC40MDk2NWwwLjQwOTY1LC01Ljk5NDQ5ek0yNjMuNTAzNzIsMTc1LjM1NzAybC0wLjQwOTY1LDUuOTk0NDlsLTUuOTk0NDksLTAuNDA5NjVsMC40MDk2NSwtNS45OTQ0OXpNMjQwLjYxMzYsMTg3LjE3NjA4bC01LjMyODQ0LC0wLjM2NDEzYy0wLjEzNTAxLC0wLjAwOTIzIC0wLjI1ODIsLTAuMDU4NTUgLTAuMzU4NjgsLTAuMTM1NWw2LjA2ODk0LC01LjA4Nzc4ek0yNDguMzQ5ODUsMTgxLjY4MjI3bC0wLjQwOTY1LDUuOTk0NDlsLTUuOTk0NDksLTAuNDA5NjVsMC40MDk2NSwtNS45OTQ0OXpNMjU1LjY3NjQ1LDE4Mi4xODI5NWwtMC40MDk2NSw1Ljk5NDQ5bC01Ljk5NDQ5LC0wLjQwOTY1bDAuNDA5NjUsLTUuOTk0NDl6TTI2My4wMDMwNSwxODIuNjgzNjJsLTAuMzY0MTMsNS4zMjg0NGMtMC4wMjUwMywwLjM2NjMzIC0wLjM0NTI0LDAuNjQ1NTcgLTAuNzExNTcsMC42MjA1NGwtNS4zMjg0NCwtMC4zNjQxM2wwLjQwOTY1LC01Ljk5NDQ5eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTIzMy42MzM3LDE4MC4xNTg1NWw0LjkwMjc4LC0wLjY2MTczbC00LjI2NjM2LDUuMzc3MDZ6TTIzOS45MjkxMywxNzEuODk4NThsNS4xOTIxMSwtMC43MDA3OGwtNC41MTgxMiw1LjY5NDM3ek0yMzMuNDU1MTEsMTc4LjgzNTMzbC0wLjgwMzY4LC01Ljk1NDQ4bDUuOTU0NDgsLTAuODAzNjdsMC44MDM2Nyw1Ljk1NDQ4ek0yNDYuMjI0NTYsMTYzLjYzODYybDUuNDgxNDMsLTAuNzM5ODNsLTQuNzY5ODksNi4wMTE2OHpNMjM5Ljc1MDU0LDE3MC41NzUzN2wtMC44MDM2NywtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY3bDAuODAzNjcsNS45NTQ0OHpNMjMyLjQ3Mjg0LDE3MS41NTc2NGwtMC44MDM2NywtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY3bDAuODAzNjcsNS45NTQ0OHpNMjUyLjUxOTk5LDE1NS4zNzg2NWw1LjI5Mjg3LC0wLjcxNDM4YzAuMTM0MTEsLTAuMDE4MSAwLjI2NDcsMC4wMDU0NSAwLjM3ODU5LDAuMDYwNjNsLTQuOTIyMzcsNi4yMDM4NXpNMjQ2LjA0NTk2LDE2Mi4zMTU0bC0wLjgwMzY3LC01Ljk1NDQ4bDUuOTU0NDgsLTAuODAzNjhsMC44MDM2OCw1Ljk1NDQ4ek0yMzguNzY4MjcsMTYzLjI5NzY3bC0wLjgwMzY3LC01Ljk1NDQ4bDUuOTU0NDgsLTAuODAzNjdsMC44MDM2OCw1Ljk1NDQ4ek0yMzEuNDkwNTcsMTY0LjI3OTk0bC0wLjcxNDM4LC01LjI5Mjg3Yy0wLjA0OTExLC0wLjM2Mzg4IDAuMjA4NDMsLTAuNzAxNzkgMC41NzIzMSwtMC43NTA5MWw1LjI5Mjg3LC0wLjcxNDM4bDAuODAzNjcsNS45NTQ0OHoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yNTUuMDU0MDgsMTY1LjMxMzg4Yy0wLjI4ODI2LDAuMDY1NzQgLTAuNTc1MjUsLTAuMTE0NjQgLTAuNjQwOTksLTAuNDAyOTFsLTAuMjAyMTMsLTAuODg2MjhjLTAuMDY1NzQsLTAuMjg4MjYgMC4xMTQ2NCwtMC41NzUyNSAwLjQwMjkxLC0wLjY0MDk5bDAuODg2MjgsLTAuMjAyMTNjMC4yODgyNiwtMC4wNjU3NCAwLjU3NTI1LDAuMTE0NjQgMC42NDA5OSwwLjQwMjkxbDAuMjAyMTMsMC44ODYyOGMwLjA2NTc0LDAuMjg4MjYgLTAuMTE0NjQsMC41NzUyNSAtMC40MDI5MSwwLjY0MDk5eiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI2MS4wODgzMiwxNjEuMzQ1OTFjLTAuMjE2NTEsMC4wNDkzOCAtMC40MzIwNSwtMC4wODYxMSAtMC40ODE0MywtMC4zMDI2MmwtMC4xNTE4MiwtMC42NjU2NmMtMC4wNDkzOCwtMC4yMTY1MSAwLjA4NjExLC0wLjQzMjA1IDAuMzAyNjIsLTAuNDgxNDNsMC42NjU2NiwtMC4xNTE4MmMwLjIxNjUxLC0wLjA0OTM4IDAuNDMyMDUsMC4wODYxMSAwLjQ4MTQzLDAuMzAyNjJsMC4xNTE4MiwwLjY2NTY2YzAuMDQ5MzgsMC4yMTY1MSAtMC4wODYxMSwwLjQzMjA1IC0wLjMwMjYyLDAuNDgxNDN6IiBmaWxsPSIjZjlmOWY5IiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjU0LjQxMTk1LDE3Mi42MzM1Yy0wLjIxNjUxLDAuMDY1NzQgLTAuNDMyMDUsLTAuMTE0NjQgLTAuNDgxNDMsLTAuNDAyOTFsLTAuMTUxODIsLTAuODg2MjhjLTAuMDQ5MzgsLTAuMjg4MjYgMC4wODYxMSwtMC41NzUyNSAwLjMwMjYyLC0wLjY0MDk5bDAuNjY1NjYsLTAuMjAyMTNjMC4yMTY1MSwtMC4wNjU3NCAwLjQzMjA1LDAuMTE0NjQgMC40ODE0MywwLjQwMjkxbDAuMTUxODIsMC44ODYyOGMwLjA0OTM4LDAuMjg4MjYgLTAuMDg2MTEsMC41NzUyNSAtMC4zMDI2MiwwLjY0MDk5eiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI0Ny4yMTkwNCwxNzcuMzA4MWMtMC4yMTY1MSwwLjA0OTM4IC0wLjQzMjA1LC0wLjA4NjExIC0wLjQ4MTQzLC0wLjMwMjYybC0wLjE1MTgyLC0wLjY2NTY2Yy0wLjA0OTM4LC0wLjIxNjUxIDAuMDg2MTEsLTAuNDMyMDUgMC4zMDI2MiwtMC40ODE0M2wwLjY2NTY2LC0wLjE1MTgyYzAuMjE2NTEsLTAuMDQ5MzggMC40MzIwNSwwLjA4NjExIDAuNDgxNDMsMC4zMDI2MmwwLjE1MTgyLDAuNjY1NjZjMC4wNDkzOCwwLjIxNjUxIC0wLjA4NjExLDAuNDMyMDUgLTAuMzAyNjIsMC40ODE0M3oiIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNDkuNzgyODcsMTcwLjc0NDk5Yy0wLjIxNjUxLDAuMDQ5MzggLTAuNDMyMDUsLTAuMDg2MTEgLTAuNDgxNDMsLTAuMzAyNjJsLTAuMTUxODIsLTAuNjY1NjZjLTAuMDQ5MzgsLTAuMjE2NTEgMC4wODYxMSwtMC40MzIwNSAwLjMwMjYyLC0wLjQ4MTQzbDAuNjY1NjYsLTAuMTUxODJjMC4yMTY1MSwtMC4wNDkzOCAwLjQzMjA1LDAuMDg2MTEgMC40ODE0MywwLjMwMjYybDAuMTUxODIsMC42NjU2NmMwLjA0OTM4LDAuMjE2NTEgLTAuMDg2MTEsMC40MzIwNSAtMC4zMDI2MiwwLjQ4MTQzeiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIwIi8+PC9nPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjM4Ljc0ODUwMDAwMDAwMDAxOjM4Ljc0ODUwMDAwMDAwMDAxLS0+"
    const icons = {
  "block": "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI0OC44Mzk2NiIgaGVpZ2h0PSI1MC42ODM0OCIgdmlld0JveD0iMCwwLDQ4LjgzOTY2LDUwLjY4MzQ4Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjE1LjU4MDE3LC0xNTQuNjU4MjYpIj48ZyBzdHJva2U9Im5vbmUiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PGc+PHBhdGggZD0iTTIzMS4yNjQxMywxODIuMjc0MTRjMC4xMDM2NCwwLjExNDA4IDAuMTQ1NzgsMC4yNjUyIDAuMTE0NTMsMC40MTI2NWwtMi41NDk3OSwxMi41OTcyNGMtMC4wMDUxMSwwLjAyMjY3IC0wLjAxMDIyLDAuMDQ1MzQgLTAuMDE5MywwLjA2NzgxbC0xLjM0MjYyLDMuNjYxNzhjMS43MTgzNSwwLjE4OTI0IDMuMDE3NzIsMS42Mzc0NSAyLjkzMzUyLDMuMzE4MThjLTAuMDg3NjMsMS43NDkzMyAtMS42Mzg0MSwzLjA5Njc4IC0zLjQ1OTEsMy4wMDU1N2MtMS44MjA2OSwtMC4wOTEyMSAtMy4yMjkwMywtMS41ODY5IC0zLjE0MTM5LC0zLjMzNjIzbDAuMDEyMjIsLTAuMjQzOTJjMC4wMzk2MiwtMC43OTA4MiAwLjM1OTA3LC0xLjU3MTQ0IDAuNjk4NTgsLTIuMzk0OTljMC40NjQzNCwtMS4xMzI1MSAxLjM0ODA4LC0yLjM4MTU2IDEuMzEwNTQsLTMuODk0NTVjLTAuMDUyNDMsMC4wMTQ1NyAtMC4xMDg3MiwwLjAyNzAzIC0wLjE2ODIyLDAuMDI0MDVjLTEuOTYzNDksLTAuMDk4MzYgLTMuMTk0ODEsMC4zMDk5IC00LjI4MDY2LDAuNjcxOTZjLTAuODEyODUsMC4yNzA2NyAtMS41MTY1MSwwLjUwNDc4IC0yLjMzNzYsMC40NjM2NWMtMC4wMjE4MiwtMC4wMDEwOSAtMC4wNDM2MywtMC4wMDIxOSAtMC4wNjM0NywtMC4wMDMxOGwtMC4yNDU5MywtMC4wMTIzMmMtMS44MjA2OSwtMC4wOTEyMSAtMy4yMjkwMywtMS41ODY5IC0zLjE0MTM5LC0zLjMzNjIzYzAuMDg3NjMsLTEuNzQ5MzMgMS42Mzg0MSwtMy4wOTY3OCAzLjQ1OTA5LC0zLjAwNTU3YzEuNjg5NzksMC4wODQ2NSAzLjAyODQ0LDEuMzgzOSAzLjEzNzksMi45NjkyN2MwLjA0ODE3LC0wLjAwOTA1IDAuMTAyMzksLTAuMDE5NzEgMC4xNjg4OSwtMC4wMzczOWMwLjc0MjgyLC0wLjE4MjQ4IDMuMDQwMjQsLTAuNTU4MzUgMy43NzU5NSwtMC42NzgxNWwxLjU3MzU4LC03LjI3OTkyYzAuMDQzNjIsLTAuMTU2MzcgMC40MDM0OCwtMy4wMTM0NiAzLjE1NTYyLC0zLjEzOTIxYzAuMTUzNTgsLTAuMDA5NSAwLjMwNzQ5LDAuMDUzNjEgMC40MDkwNSwwLjE2OTV6TTIzOS45NTA0NiwxOTEuNDUzMDdjMC4xMDc4LDAuMTEwNDcgMC4xNTU5OCwwLjI1OTk4IDAuMTM0NjUsMC40MDc5MmMtMC40MDU1MywyLjYxNzkxIC0zLjQ2MywyLjg4NTAyIC0zLjU5NTMzLDIuOTA3MDVsLTYuNzA2NTksMC42MzY0YzAuMDI1NDQsLTAuMDcxMzIgMC4wNDQ3NSwtMC4xMzkxMyAwLjA1ODEsLTAuMjA3MjNsMC42NzI5OSwtMy4xMTQ1OGw5LjAyMDIzLC0wLjc4MDMxYzAuMDM3OTcsLTAuMDAzODMgMC4wNzc3MywtMC4wMDM3NSAwLjExNTIyLDAuMDAxOTVjMC4xMTQ1NSwwLjAxNTI5IDAuMjE5MzYsMC4wNjYzOSAwLjMwMDczLDAuMTQ4Nzl6TTIxNy4xMDcyNCwxOTMuMzUxOTFjLTAuMDQ3MTYsMC45NDEzNiAwLjcxMTc2LDEuNzQ3MzUgMS42OTE1MiwxLjc5NjQzYzAuOTc5NzYsMC4wNDkwOCAxLjgxNTQzLC0wLjY3NzAyIDEuODYyNTksLTEuNjE4MzhjMC4wNDcxNiwtMC45NDEzNiAtMC43MTE3NiwtMS43NDczNSAtMS42OTE1MiwtMS43OTY0M2MtMC45Nzk3NiwtMC4wNDkwOCAtMS44MTU0MywwLjY3NzAyIC0xLjg2MjU5LDEuNjE4Mzh6TTIyNi43NjYzMiwxOTMuNTkxMjhjLTAuMDEzNDYsMC4yNjg2OSAwLjIwMzY0LDAuNDk5MjYgMC40ODMyOSwwLjUxMzI3YzAuMjc5NjUsMC4wMTQwMSAwLjUxODcxLC0wLjE5MzcxIDAuNTMyMTcsLTAuNDYyNGMwLjAxMzQ2LC0wLjI2ODY5IC0wLjIwMzY0LC0wLjQ5OTI2IC0wLjQ4MzI5LC0wLjUxMzI3Yy0wLjI3OTY1LC0wLjAxNDAxIC0wLjUxODcxLDAuMTkzNzEgLTAuNTMyMTcsMC40NjI0ek0yMjUuMzIzMTgsMjAyLjA3NzQ0Yy0wLjA0NzE2LDAuOTQxMzYgMC43MTE3NiwxLjc0NzM1IDEuNjkxNTIsMS43OTY0M2MwLjk3OTc2LDAuMDQ5MDggMS44MTU0MywtMC42NzcwMiAxLjg2MjU5LC0xLjYxODM4YzAuMDQ3MTYsLTAuOTQxMzYgLTAuNzExNzYsLTEuNzQ3MzUgLTEuNjkxNTIsLTEuNzk2NDNjLTAuOTc5NzYsLTAuMDQ5MDggLTEuODE1NDMsMC42NzcwMiAtMS44NjI1OSwxLjYxODM4eiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIxIi8+PHBhdGggZD0iTTI2NC4wOTU0MywxNjYuNjk4MzJsLTQuOTM1NzMsLTAuMzM3MjlsNS4yNjAxMywtNC40MDk3MnpNMjU2LjI2ODE2LDE3My41MjQyNGwtNS4yMjY5OSwtMC4zNTcybDUuNTcwNTMsLTQuNjY5OTV6TTI2NC4wMDQ0LDE2OC4wMzA0M2wtMC40MDk2NSw1Ljk5NDQ5bC01Ljk5NDQ5LC0wLjQwOTY1bDAuNDA5NjUsLTUuOTk0NDl6TTI0OC40NDA4OCwxODAuMzUwMTZsLTUuNTE4MjYsLTAuMzc3MWw1Ljg4MDk0LC00LjkzMDE3ek0yNTYuMTc3MTIsMTc0Ljg1NjM1bC0wLjQwOTY1LDUuOTk0NDlsLTUuOTk0NDksLTAuNDA5NjVsMC40MDk2NSwtNS45OTQ0OXpNMjYzLjUwMzcyLDE3NS4zNTcwMmwtMC40MDk2NSw1Ljk5NDQ5bC01Ljk5NDQ5LC0wLjQwOTY1bDAuNDA5NjUsLTUuOTk0NDl6TTI0MC42MTM2LDE4Ny4xNzYwOGwtNS4zMjg0NCwtMC4zNjQxM2MtMC4xMzUwMSwtMC4wMDkyMyAtMC4yNTgyLC0wLjA1ODU1IC0wLjM1ODY4LC0wLjEzNTVsNi4wNjg5NCwtNS4wODc3OHpNMjQ4LjM0OTg1LDE4MS42ODIyN2wtMC40MDk2NSw1Ljk5NDQ5bC01Ljk5NDQ5LC0wLjQwOTY1bDAuNDA5NjUsLTUuOTk0NDl6TTI1NS42NzY0NSwxODIuMTgyOTVsLTAuNDA5NjUsNS45OTQ0OWwtNS45OTQ0OSwtMC40MDk2NWwwLjQwOTY1LC01Ljk5NDQ5ek0yNjMuMDAzMDUsMTgyLjY4MzYybC0wLjM2NDEzLDUuMzI4NDRjLTAuMDI1MDMsMC4zNjYzMyAtMC4zNDUyNCwwLjY0NTU3IC0wLjcxMTU3LDAuNjIwNTRsLTUuMzI4NDQsLTAuMzY0MTNsMC40MDk2NSwtNS45OTQ0OXoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjxwYXRoIGQ9Ik0yMzMuNjMzNywxODAuMTU4NTVsNC45MDI3OCwtMC42NjE3M2wtNC4yNjYzNiw1LjM3NzA2ek0yMzkuOTI5MTMsMTcxLjg5ODU4bDUuMTkyMTEsLTAuNzAwNzhsLTQuNTE4MTIsNS42OTQzN3pNMjMzLjQ1NTExLDE3OC44MzUzM2wtMC44MDM2OCwtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY3bDAuODAzNjcsNS45NTQ0OHpNMjQ2LjIyNDU2LDE2My42Mzg2Mmw1LjQ4MTQzLC0wLjczOTgzbC00Ljc2OTg5LDYuMDExNjh6TTIzOS43NTA1NCwxNzAuNTc1MzdsLTAuODAzNjcsLTUuOTU0NDhsNS45NTQ0OCwtMC44MDM2N2wwLjgwMzY3LDUuOTU0NDh6TTIzMi40NzI4NCwxNzEuNTU3NjRsLTAuODAzNjcsLTUuOTU0NDhsNS45NTQ0OCwtMC44MDM2N2wwLjgwMzY3LDUuOTU0NDh6TTI1Mi41MTk5OSwxNTUuMzc4NjVsNS4yOTI4NywtMC43MTQzOGMwLjEzNDExLC0wLjAxODEgMC4yNjQ3LDAuMDA1NDUgMC4zNzg1OSwwLjA2MDYzbC00LjkyMjM3LDYuMjAzODV6TTI0Ni4wNDU5NiwxNjIuMzE1NGwtMC44MDM2NywtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY4bDAuODAzNjgsNS45NTQ0OHpNMjM4Ljc2ODI3LDE2My4yOTc2N2wtMC44MDM2NywtNS45NTQ0OGw1Ljk1NDQ4LC0wLjgwMzY3bDAuODAzNjgsNS45NTQ0OHpNMjMxLjQ5MDU3LDE2NC4yNzk5NGwtMC43MTQzOCwtNS4yOTI4N2MtMC4wNDkxMSwtMC4zNjM4OCAwLjIwODQzLC0wLjcwMTc5IDAuNTcyMzEsLTAuNzUwOTFsNS4yOTI4NywtMC43MTQzOGwwLjgwMzY3LDUuOTU0NDh6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMjU1LjA1NDA4LDE2NS4zMTM4OGMtMC4yODgyNiwwLjA2NTc0IC0wLjU3NTI1LC0wLjExNDY0IC0wLjY0MDk5LC0wLjQwMjkxbC0wLjIwMjEzLC0wLjg4NjI4Yy0wLjA2NTc0LC0wLjI4ODI2IDAuMTE0NjQsLTAuNTc1MjUgMC40MDI5MSwtMC42NDA5OWwwLjg4NjI4LC0wLjIwMjEzYzAuMjg4MjYsLTAuMDY1NzQgMC41NzUyNSwwLjExNDY0IDAuNjQwOTksMC40MDI5MWwwLjIwMjEzLDAuODg2MjhjMC4wNjU3NCwwLjI4ODI2IC0wLjExNDY0LDAuNTc1MjUgLTAuNDAyOTEsMC42NDA5OXoiIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNjEuMDg4MzIsMTYxLjM0NTkxYy0wLjIxNjUxLDAuMDQ5MzggLTAuNDMyMDUsLTAuMDg2MTEgLTAuNDgxNDMsLTAuMzAyNjJsLTAuMTUxODIsLTAuNjY1NjZjLTAuMDQ5MzgsLTAuMjE2NTEgMC4wODYxMSwtMC40MzIwNSAwLjMwMjYyLC0wLjQ4MTQzbDAuNjY1NjYsLTAuMTUxODJjMC4yMTY1MSwtMC4wNDkzOCAwLjQzMjA1LDAuMDg2MTEgMC40ODE0MywwLjMwMjYybDAuMTUxODIsMC42NjU2NmMwLjA0OTM4LDAuMjE2NTEgLTAuMDg2MTEsMC40MzIwNSAtMC4zMDI2MiwwLjQ4MTQzeiIgZmlsbD0iI2Y5ZjlmOSIgc3Ryb2tlLXdpZHRoPSIwIi8+PHBhdGggZD0iTTI1NC40MTE5NSwxNzIuNjMzNWMtMC4yMTY1MSwwLjA2NTc0IC0wLjQzMjA1LC0wLjExNDY0IC0wLjQ4MTQzLC0wLjQwMjkxbC0wLjE1MTgyLC0wLjg4NjI4Yy0wLjA0OTM4LC0wLjI4ODI2IDAuMDg2MTEsLTAuNTc1MjUgMC4zMDI2MiwtMC42NDA5OWwwLjY2NTY2LC0wLjIwMjEzYzAuMjE2NTEsLTAuMDY1NzQgMC40MzIwNSwwLjExNDY0IDAuNDgxNDMsMC40MDI5MWwwLjE1MTgyLDAuODg2MjhjMC4wNDkzOCwwLjI4ODI2IC0wLjA4NjExLDAuNTc1MjUgLTAuMzAyNjIsMC42NDA5OXoiIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0yNDcuMjE5MDQsMTc3LjMwODFjLTAuMjE2NTEsMC4wNDkzOCAtMC40MzIwNSwtMC4wODYxMSAtMC40ODE0MywtMC4zMDI2MmwtMC4xNTE4MiwtMC42NjU2NmMtMC4wNDkzOCwtMC4yMTY1MSAwLjA4NjExLC0wLjQzMjA1IDAuMzAyNjIsLTAuNDgxNDNsMC42NjU2NiwtMC4xNTE4MmMwLjIxNjUxLC0wLjA0OTM4IDAuNDMyMDUsMC4wODYxMSAwLjQ4MTQzLDAuMzAyNjJsMC4xNTE4MiwwLjY2NTY2YzAuMDQ5MzgsMC4yMTY1MSAtMC4wODYxMSwwLjQzMjA1IC0wLjMwMjYyLDAuNDgxNDN6IiBmaWxsPSIjZjlmOWY5IiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjQ5Ljc4Mjg3LDE3MC43NDQ5OWMtMC4yMTY1MSwwLjA0OTM4IC0wLjQzMjA1LC0wLjA4NjExIC0wLjQ4MTQzLC0wLjMwMjYybC0wLjE1MTgyLC0wLjY2NTY2Yy0wLjA0OTM4LC0wLjIxNjUxIDAuMDg2MTEsLTAuNDMyMDUgMC4zMDI2MiwtMC40ODE0M2wwLjY2NTY2LC0wLjE1MTgyYzAuMjE2NTEsLTAuMDQ5MzggMC40MzIwNSwwLjA4NjExIDAuNDgxNDMsMC4zMDI2MmwwLjE1MTgyLDAuNjY1NjZjMC4wNDkzOCwwLjIxNjUxIC0wLjA4NjExLDAuNDMyMDUgLTAuMzAyNjIsMC40ODE0M3oiIGZpbGw9IiNmOWY5ZjkiIHN0cm9rZS13aWR0aD0iMCIvPjwvZz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoyNC40MTk4MjgzODIwOTkyNDoyNS4zNDE3MzYzODg0NDU5NTItLT4="
}
    const assets = {}
    
    const parseXML = (xmlString) => {
      try {
        const parser = new DOMParser();
        return parser.parseFromString(xmlString, "text/xml");
      } catch (e) {
        throw new Error("Error parsing XML:", e);
        return null;
      }
    };
    
    class Spritesheet {
      constructor() {
        this.sheet = null;
        this.frames = [];
        this.frameWidth = 0;
        this.frameHeight = 0;
        this.currentFrame = 0;
        this.totalFrames = 0;
        this.xmlData = null;
        this.frameNames = [];
      }
      
      loadImage(url) {
        return new Promise((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous"; // Add CORS support
          img.onload = () => {
            this.sheet = img;
            resolve(img);
          };
          img.onerror = (e) => reject(e);
          img.src = url;
        });
      }
      
      loadUniformSpritesheet(url, frameWidth, frameHeight) {
        return this.loadImage(url).then(() => {
          this.frameWidth = frameWidth;
          this.frameHeight = frameHeight;
          this.frames = [];
          this.frameNames = [];
          
          const cols = Math.floor(this.sheet.width / frameWidth);
          const rows = Math.floor(this.sheet.height / frameHeight);
          this.totalFrames = cols * rows;
          
          for (let y = 0; y < rows; y++) {
            for (let x = 0; x < cols; x++) {
              const index = y * cols + x;
              const frameName = `frame_${index}`;
              this.frameNames.push(frameName);
              this.frames.push({
                name: frameName,
                x: x * frameWidth,
                y: y * frameHeight,
                width: frameWidth,
                height: frameHeight
              });
            }
          }
          
          return this.totalFrames;
        });
      }
      
      loadFromXML(url, xmlString) {
        this.xmlData = parseXML(xmlString);
        if (!this.xmlData) return Promise.reject("Invalid XML");
        
        return this.loadImage(url).then(() => {
          this.frames = [];
          this.frameNames = [];
          
          const subtextures = this.xmlData.getElementsByTagName('SubTexture');
          if (subtextures.length > 0) {
            for (let i = 0; i < subtextures.length; i++) {
              const frame = subtextures[i];
              const frameName = frame.getAttribute('name') || `frame_${i}`;
              this.frameNames.push(frameName);
              this.frames.push({
                name: frameName,
                x: parseInt(frame.getAttribute('x'), 10),
                y: parseInt(frame.getAttribute('y'), 10),
                width: parseInt(frame.getAttribute('width'), 10),
                height: parseInt(frame.getAttribute('height'), 10),
                frameX: frame.getAttribute('frameX') ? parseInt(frame.getAttribute('frameX'), 10) : 0,
                frameY: frame.getAttribute('frameY') ? parseInt(frame.getAttribute('frameY'), 10) : 0,
                frameWidth: frame.getAttribute('frameWidth') ? parseInt(frame.getAttribute('frameWidth'), 10) : 0,
                frameHeight: frame.getAttribute('frameHeight') ? parseInt(frame.getAttribute('frameHeight'), 10) : 0
              });
            }
          }
          
          const frameTags = this.xmlData.getElementsByTagName('frame');
          if (frameTags.length > 0 && this.frames.length === 0) {
            for (let i = 0; i < frameTags.length; i++) {
              const frame = frameTags[i];
              const frameName = frame.getAttribute('name') || `frame_${i}`;
              this.frameNames.push(frameName);
              this.frames.push({
                name: frameName,
                x: parseInt(frame.getAttribute('x'), 10),
                y: parseInt(frame.getAttribute('y'), 10),
                width: parseInt(frame.getAttribute('width'), 10),
                height: parseInt(frame.getAttribute('height'), 10)
              });
            }
          }
          
          this.totalFrames = this.frames.length;
          return this.totalFrames;
        });
      }
      
      getCurrentFrameCanvas() {
        if (!this.sheet || this.totalFrames === 0) return null;
        
        const canvas = document.createElement('canvas');
        const frame = this.frames[this.currentFrame];
        canvas.width = frame.width;
        canvas.height = frame.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          this.sheet, 
          frame.x, frame.y, frame.width, frame.height,
          0, 0, frame.width, frame.height
        );
        
        return canvas;
      }
      
      getFrameCanvas(index) {
        if (!this.sheet || index < 0 || index >= this.totalFrames) return null;
        
        const canvas = document.createElement('canvas');
        const frame = this.frames[index];
        canvas.width = frame.width;
        canvas.height = frame.height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          this.sheet, 
          frame.x, frame.y, frame.width, frame.height,
          0, 0, frame.width, frame.height
        );
        
        return canvas;
      }
      
      getFrameBase64(index) {
        try {
          const canvas = this.getFrameCanvas(index);
          if (!canvas) return '';
          return canvas.toDataURL('image/png');
        } catch (e) {
          throw new Error("Cannot export canvas (possibly tainted):", e);
          return '';
        }
      }
      
      getFrameData(index) {
        if (index >= 0 && index < this.frames.length) {
          return JSON.stringify(this.frames[index]);
        }
        return "{}";
      }
      
      getFrameByName(name) {
        const frame = this.frames.find(f => f.name === name);
        if (frame) {
          return this.frames.indexOf(frame);
        }
        return -1;
      }
      
      getAllFrameNames() {
        return JSON.stringify(this.frameNames);
      }
      
      getGridDimensions() {
        if (!this.sheet || this.frameWidth <= 0 || this.frameHeight <= 0) {
          return { rows: 0, cols: 0 };
        }
        const cols = Math.floor(this.sheet.width / this.frameWidth);
        const rows = Math.floor(this.sheet.height / this.frameHeight);
        return { rows, cols };
      }
      
      getFrameGroups() {
        const groups = {};
        this.frameNames.forEach(name => {
          const prefix = name.match(/^([a-zA-Z]+)/);
          if (prefix && prefix[1]) {
            if (!groups[prefix[1]]) {
              groups[prefix[1]] = [];
            }
            groups[prefix[1]].push(name);
          }
        });
        return groups;
      }

      cleanup() {
        // Clear image data
        if (this.sheet) {
          this.sheet.src = '';
          this.sheet.onload = null;
          this.sheet.onerror = null;
          this.sheet = null;
        }
        
        // Clear frames data
        this.frames = [];
        this.frameNames = [];
        this.totalFrames = 0;
        this.currentFrame = 0;
        
        // Clear XML data
        this.xmlData = null;
      }
    }
    
    const spritesheetsMap = {};
    
    class Spritesheeter {
      getInfo() {
        return {
          id: 'spritesheeter',
          name: 'Spritesheeter',
          color1: '#ff8800',
          color2: '#cc5500',
          menuIconURI: icon,
          blockIconURI: icons.block || icon,
          blocks: [
            {
              opcode: '__LABEL0',
              blockType: BlockType.LABEL,
              text: 'SPRITESHEET INFO'
            },
            {
              opcode: 'getSpritesheetNames',
              blockType: BlockType.REPORTER,
              text: 'all spritesheet names',
            },
            {
              opcode: 'doesSpritesheetExist',
              blockType: BlockType.BOOLEAN,
              text: 'spritesheet [NAME] exists?',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getSpritesheetDimensions',
              blockType: BlockType.REPORTER,
              text: 'dimensions of spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'deleteSheet',
              blockType: BlockType.COMMAND,
              text: 'delete spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: '__LABEL1',
              blockType: BlockType.LABEL,
              text: 'LOADING'
            },
            {
              opcode: 'createUniformSpritesheet',
              blockType: BlockType.COMMAND,
              text: 'create spritesheet named [NAME] from [URL] with frame size width: [WIDTH] height: [HEIGHT]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                },
                URL: {
                  type: ArgumentType.STRING,
                  defaultValue: 'https://example.com/spritesheet.png'
                },
                WIDTH: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 64
                },
                HEIGHT: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 64
                }
              }
            },
            {
              opcode: 'createXMLSpritesheet',
              blockType: BlockType.COMMAND,
              text: 'create spritesheet named [NAME] from [URL] with XML [XML]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                },
                URL: {
                  type: ArgumentType.STRING,
                  defaultValue: 'https://example.com/spritesheet.png'
                },
                XML: {
                  type: ArgumentType.STRING,
                  defaultValue: '<TextureAtlas><SubTexture name="frame1" x="0" y="0" width="64" height="64"/></TextureAtlas>'
                }
              }
            },
            {
              opcode: '__LABEL2',
              blockType: BlockType.LABEL,
              text: 'NAVIGATION & BASIC INFO'
            },
            {
              opcode: 'getTotalFrames',
              blockType: BlockType.REPORTER,
              text: 'total frames in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'setCurrentFrame',
              blockType: BlockType.COMMAND,
              text: 'set current frame to [FRAME] in spritesheet [NAME]',
              arguments: {
                FRAME: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 0
                },
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getCurrentFrame',
              blockType: BlockType.REPORTER,
              text: 'current frame index in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'advanceFrame',
              blockType: BlockType.COMMAND,
              text: 'advance to next frame in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getSpriteWidth',
              blockType: BlockType.REPORTER,
              text: 'width of current frame in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getSpriteHeight',
              blockType: BlockType.REPORTER,
              text: 'height of current frame in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: '__LABEL3',
              blockType: BlockType.LABEL,
              text: 'FRAME DATA'
            },
            {
              opcode: 'getFrameJSON',
              blockType: BlockType.REPORTER,
              text: 'get JSON data for frame [FRAME] in spritesheet [NAME]',
              arguments: {
                FRAME: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 0
                },
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getFrameBase64',
              blockType: BlockType.REPORTER,
              text: 'get base64 image data for frame [FRAME] in spritesheet [NAME]',
              arguments: {
                FRAME: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 0
                },
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getCurrentFrameBase64',
              blockType: BlockType.REPORTER,
              text: 'get base64 image data for current frame in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getFrameAsSprite',
              blockType: BlockType.COMMAND,
              text: 'set sprite [SPRITE] costume to frame from spritesheet [NAME]',
              arguments: {
                SPRITE: {
                  type: ArgumentType.STRING,
                  defaultValue: 'Sprite1'
                },
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: '__LABEL4', 
              blockType: BlockType.LABEL,
              text: 'FRAME NAMES'
            },
            {
              opcode: 'getFrameByName',
              blockType: BlockType.REPORTER,
              text: 'get frame index for name [FRAMENAME] in spritesheet [NAME]',
              arguments: {
                FRAMENAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'frame1'
                },
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getAllFrameNames',
              blockType: BlockType.REPORTER,
              text: 'all frame names in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getFrameNameAt',
              blockType: BlockType.REPORTER,
              text: 'name of frame [INDEX] in spritesheet [NAME]',
              arguments: {
                INDEX: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 0
                },
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getCurrentFrameName',
              blockType: BlockType.REPORTER,
              text: 'name of current frame in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: '__LABEL5',
              blockType: BlockType.LABEL,
              text: 'ANIMATION HELPERS'
            },
            {
              opcode: 'getFramesWithPrefix',
              blockType: BlockType.REPORTER,
              text: 'frames with prefix [PREFIX] in spritesheet [NAME]',
              arguments: {
                PREFIX: {
                  type: ArgumentType.STRING,
                  defaultValue: 'idle'
                },
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getGridDimensions',
              blockType: BlockType.REPORTER,
              text: 'grid dimensions of spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getFrameGroups',
              blockType: BlockType.REPORTER,
              text: 'animation groups in spritesheet [NAME]',
              arguments: {
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            },
            {
              opcode: 'getFramesInRange',
              blockType: BlockType.REPORTER,
              text: 'frames from [START] to [END] in spritesheet [NAME]',
              arguments: {
                START: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 0
                },
                END: {
                  type: ArgumentType.NUMBER,
                  defaultValue: 5
                },
                NAME: {
                  type: ArgumentType.STRING,
                  defaultValue: 'mysheet'
                }
              }
            }
          ]
        };
      }
      
      createUniformSpritesheet(args) {
        const name = Cast.toString(args.NAME);
        const url = Cast.toString(args.URL);
        const width = Cast.toNumber(args.WIDTH);
        const height = Cast.toNumber(args.HEIGHT);
        
        if (!name || !url || width <= 0 || height <= 0) return;
        
        spritesheetsMap[name] = new Spritesheet();
        spritesheetsMap[name].loadUniformSpritesheet(url, width, height)
          .catch(e => { throw new Error(`Failed to load spritesheet: ${e}`); });
      }
      
      createXMLSpritesheet(args) {
        const name = Cast.toString(args.NAME);
        const url = Cast.toString(args.URL);
        const xml = Cast.toString(args.XML);
        
        if (!name || !url || !xml) return;
        
        spritesheetsMap[name] = new Spritesheet();
        spritesheetsMap[name].loadFromXML(url, xml)
          .catch(e => { throw new Error(`Failed to load XML spritesheet: ${e}`); });
      }
      
      getTotalFrames(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        return sheet ? sheet.totalFrames : 0;
      }
      
      setCurrentFrame(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        const frame = Math.floor(Cast.toNumber(args.FRAME));
        
        if (sheet && frame >= 0 && frame < sheet.totalFrames) {
          sheet.currentFrame = frame;
        }
      }
      
      getCurrentFrame(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        return sheet ? sheet.currentFrame : 0;
      }
      
      getFrameJSON(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        const frame = Math.floor(Cast.toNumber(args.FRAME));
        
        if (sheet && frame >= 0 && frame < sheet.totalFrames) {
          return sheet.getFrameData(frame);
        }
        
        return "{}";
      }
      
      getFrameBase64(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        const frame = Math.floor(Cast.toNumber(args.FRAME));
        
        if (sheet && frame >= 0 && frame < sheet.totalFrames) {
          return sheet.getFrameBase64(frame);
        }
        
        return "";
      }
      
      getCurrentFrameBase64(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        
        if (sheet) {
          return sheet.getFrameBase64(sheet.currentFrame);
        }
        
        return "";
      }
      
      getFrameByName(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        const frameName = Cast.toString(args.FRAMENAME);
        
        if (sheet && frameName) {
          return sheet.getFrameByName(frameName);
        }
        
        return -1;
      }
      
      getFrameAsSprite(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        const spriteName = Cast.toString(args.SPRITE);
        
        if (!sheet || !spriteName) return;
        
        try {
          const canvas = sheet.getCurrentFrameCanvas();
          if (!canvas) return;
          
          const target = Scratch.vm.runtime.getSpriteTargetByName(spriteName);
          if (!target) return;
          
          const dataURL = canvas.toDataURL();
          
          Scratch.vm.runtime.addCostume(
            `frame_${sheet.currentFrame}`,
            {
              format: 'png',
              baseLayerID: `frame_${Date.now()}`,
              baseLayerMD5: `frame_${Date.now()}.png`,
              dataFormat: 'png',
              asset: new Scratch.vm.runtime.Storage.Asset(
                Scratch.vm.runtime.storage.AssetType.ImageBitmap,
                `frame_${Date.now()}`,
                'png',
                new Uint8Array(Scratch.vm.runtime._bufferedImage(dataURL))
              )
            },
            target.currentCostume,
            target
          );
        } catch (e) {
          throw new Error("Error setting sprite costume:", e);
        }
      }
      
      advanceFrame(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        if (!sheet) return;
        
        sheet.currentFrame = (sheet.currentFrame + 1) % sheet.totalFrames;
      }
      
      getSpriteWidth(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        if (!sheet || sheet.currentFrame >= sheet.frames.length) return 0;
        
        return sheet.frames[sheet.currentFrame].width;
      }
      
      getSpriteHeight(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        if (!sheet || sheet.currentFrame >= sheet.frames.length) return 0;
        
        return sheet.frames[sheet.currentFrame].height;
      }
      
      getAllFrameNames(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        if (!sheet) return "[]";
        
        return sheet.getAllFrameNames();
      }
      
      getFrameNameAt(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        const index = Math.floor(Cast.toNumber(args.INDEX));
        
        if (sheet && index >= 0 && index < sheet.frameNames.length) {
          return sheet.frameNames[index];
        }
        
        return "";
      }
      
      getCurrentFrameName(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        
        if (sheet && sheet.currentFrame >= 0 && sheet.currentFrame < sheet.frameNames.length) {
          return sheet.frameNames[sheet.currentFrame];
        }
        
        return "";
      }
      
      getFramesWithPrefix(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        const prefix = Cast.toString(args.PREFIX);
        
        if (!sheet || !prefix) return "[]";
        
        const framesWithPrefix = sheet.frameNames.filter(name => name.startsWith(prefix));
        return JSON.stringify(framesWithPrefix);
      }
      
      getGridDimensions(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        
        if (!sheet) return "{}";
        
        const dimensions = sheet.getGridDimensions();
        return JSON.stringify(dimensions);
      }
      
      getFrameGroups(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        
        if (!sheet) return "{}";
        
        const groups = sheet.getFrameGroups();
        return JSON.stringify(groups);
      }
      
      getFramesInRange(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        const start = Math.floor(Cast.toNumber(args.START));
        const end = Math.floor(Cast.toNumber(args.END));
        
        if (!sheet) return "[]";
        
        const validStart = Math.max(0, Math.min(start, sheet.frameNames.length - 1));
        const validEnd = Math.max(validStart, Math.min(end, sheet.frameNames.length - 1));
        
        const framesInRange = sheet.frameNames.slice(validStart, validEnd + 1);
        return JSON.stringify(framesInRange);
      }
      
      getSpritesheetNames() {
        return JSON.stringify(Object.keys(spritesheetsMap));
      }
      
      doesSpritesheetExist(args) {
        const name = Cast.toString(args.NAME);
        return spritesheetsMap.hasOwnProperty(name);
      }
      
      getSpritesheetDimensions(args) {
        const sheet = spritesheetsMap[Cast.toString(args.NAME)];
        
        if (!sheet || !sheet.sheet) return "{}";
        
        return JSON.stringify({
          width: sheet.sheet.width,
          height: sheet.sheet.height,
          frameWidth: sheet.frameWidth,
          frameHeight: sheet.frameHeight
        });
      }
      
      deleteSheet(args) {
        const name = Cast.toString(args.NAME);
          
        if (spritesheetsMap.hasOwnProperty(name)) {
          spritesheetsMap[name].cleanup(); // Probable fix to Memory leak (reported by gomigg on Discord) by cleaning up the map before deleting the map
          delete spritesheetsMap[name];
        }
      }
    }
    
    Scratch.extensions.register(new Spritesheeter());
})(Scratch);
