// CODE GENERATED USING mCompiler (v1.0) | Made by MubiLop
// Hash: 11314fe2 | Generated: 4/6/2025, 1:29:36 AM UTC
// Name: Toast Notifs
// ID: toastnotifs
// Description: Did you want alerts? Notifications that are easily customizable? This is the only and best notification extension!
// By: MubiLop, themeatly2 and ddededodediamante

(function (Scratch) {
    "use strict";
 
    // mCompiler will change these objects to have the values
    const icon = "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MC45ODciIGZpbGw9IiNmNzllNjAiIGQ9Ik0gMjI4LjUsLTAuNSBDIDIzMy4xNjcsLTAuNSAyMzcuODMzLC0wLjUgMjQyLjUsLTAuNUMgMjkyLjgzNSwxLjgzNjM4IDM0MC41MDEsMTQuNjY5NyAzODUuNSwzOEMgNDEzLjYxNSw1My4xMTUyIDQzNS40NDksNzQuNjE1MiA0NTEsMTAyLjVDIDQ1NC45NTMsMTEwLjA2NiA0NTcuNDUzLDExOC4wNjYgNDU4LjUsMTI2LjVDIDQ0OC4zOCwxMDEuMTU0IDQzMS4zOCw4MS42NTQxIDQwNy41LDY4QyAzNjcuNTYsNDUuMjYxMyAzMjQuNTYsMzIuNTk0NyAyNzguNSwzMEMgMjYzLjY2MSwyOS4xNzI0IDI0OC45OTQsMjkuMzM5MSAyMzQuNSwzMC41QyAxOTEuNDMsMzIuMjQ0NyAxNTAuNzYzLDQzLjA3OCAxMTIuNSw2M0MgOTQuMjgyLDczLjIxMDkgNzguNDQ4Niw4Ni4zNzc1IDY1LDEwMi41QyA0NS4yNDkyLDEzMS41OTUgNDUuOTE1OCwxNjAuMjYyIDY3LDE4OC41QyA3NS44MTM4LDE5OC43MzYgODUuNDgwNSwyMDguMDY5IDk2LDIxNi41QyA5Ny44NjA1LDIxOC44ODggOTkuMTkzOSwyMjEuNTU0IDEwMCwyMjQuNUMgMTAwLjUsMjkzLjQ5OSAxMDAuNjY3LDM2Mi40OTkgMTAwLjUsNDMxLjVDIDEwMC4wNjksNDQyLjU3OCAxMDAuNTY5LDQ1My41NzggMTAyLDQ2NC41QyAxMDUuMzU1LDQ3MS42ODcgMTEwLjUyMiw0NzcuMDIxIDExNy41LDQ4MC41QyA4OC42OTY0LDQ3My4zNjIgNzIuNjk2NCw0NTUuMDI5IDY5LjUsNDI1LjVDIDY5LjY2NjcsMzYxLjQ5OSA2OS41LDI5Ny40OTkgNjksMjMzLjVDIDQ5LjIyMDIsMjE3LjU5IDM0LjU1MzUsMTk3LjkyMyAyNSwxNzQuNUMgMTQuNDAzNywxMzYuODkgMjIuMDcwNCwxMDMuNTU3IDQ4LDc0LjVDIDc4Ljc4OTcsNDQuMDExNSAxMTUuMjksMjMuMTc4MSAxNTcuNSwxMkMgMTgwLjk3LDUuODY3NDggMjA0LjYzNiwxLjcwMDgyIDIyOC41LC0wLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2Q3N2Q0MSIgZD0iTSAyNDIuNSwtMC41IEMgMjU1LjgzMywtMC41IDI2OS4xNjcsLTAuNSAyODIuNSwtMC41QyAzMzMuOTk4LDIuOTQzMTQgMzgxLjk5OCwxNy43NzY1IDQyNi41LDQ0QyA0NTEuMjU2LDU5LjA4ODMgNDcwLjA5LDc5LjU4ODMgNDgzLDEwNS41QyA0OTcuNjY2LDE0NS41MDEgNDkwLjk5OSwxODEuNTAxIDQ2MywyMTMuNUMgNDU2LjMwMywyMjAuNTMyIDQ0OS4zMDMsMjI3LjE5OCA0NDIsMjMzLjVDIDQ0MS45NzksMzExLjE5MyA0NDEuMzEzLDM4OC44NiA0NDAsNDY2LjVDIDQzMy41NDMsNDkwLjQ1OCA0MTguMzc2LDUwNS40NTggMzk0LjUsNTExLjVDIDMwMS44MzMsNTExLjUgMjA5LjE2Nyw1MTEuNSAxMTYuNSw1MTEuNUMgOTIuNjIzOSw1MDUuNDU4IDc3LjQ1NzIsNDkwLjQ1OCA3MSw0NjYuNUMgNjkuNjM4NCw0NTIuODc0IDY5LjEzODQsNDM5LjIwOCA2OS41LDQyNS41QyA3Mi42OTY0LDQ1NS4wMjkgODguNjk2NCw0NzMuMzYyIDExNy41LDQ4MC41QyAyMDguMTM5LDQ4MS42NTkgMjk4LjgwNSw0ODEuODI2IDM4OS41LDQ4MUMgNDAxLjUxMiw0NzcuNjUyIDQwOC42NzksNDY5LjgxOSA0MTEsNDU3LjVDIDQxMS4zMzMsMzc5LjUgNDExLjY2NywzMDEuNSA0MTIsMjIzLjVDIDQxMi43MjUsMjIxLjA1MSA0MTMuNzI1LDIxOC43MTcgNDE1LDIxNi41QyA0MjQuMjY3LDIwOS4yMzYgNDMyLjkzNCwyMDEuMjM2IDQ0MSwxOTIuNUMgNDU3Ljc3MSwxNzMuNDE2IDQ2My42MDUsMTUxLjQxNiA0NTguNSwxMjYuNUMgNDU3LjQ1MywxMTguMDY2IDQ1NC45NTMsMTEwLjA2NiA0NTEsMTAyLjVDIDQzNS40NDksNzQuNjE1MiA0MTMuNjE1LDUzLjExNTIgMzg1LjUsMzhDIDM0MC41MDEsMTQuNjY5NyAyOTIuODM1LDEuODM2MzggMjQyLjUsLTAuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZmNkOGIzIiBkPSJNIDIzNC41LDMwLjUgQyAyNDguOTk0LDI5LjMzOTEgMjYzLjY2MSwyOS4xNzI0IDI3OC41LDMwQyAzMjQuNTYsMzIuNTk0NyAzNjcuNTYsNDUuMjYxMyA0MDcuNSw2OEMgNDMxLjM4LDgxLjY1NDEgNDQ4LjM4LDEwMS4xNTQgNDU4LjUsMTI2LjVDIDQ2My42MDUsMTUxLjQxNiA0NTcuNzcxLDE3My40MTYgNDQxLDE5Mi41QyA0MzIuOTM0LDIwMS4yMzYgNDI0LjI2NywyMDkuMjM2IDQxNSwyMTYuNUMgNDEzLjcyNSwyMTguNzE3IDQxMi43MjUsMjIxLjA1MSA0MTIsMjIzLjVDIDQxMS42NjcsMzAxLjUgNDExLjMzMywzNzkuNSA0MTEsNDU3LjVDIDQwOC42NzksNDY5LjgxOSA0MDEuNTEyLDQ3Ny42NTIgMzg5LjUsNDgxQyAyOTguODA1LDQ4MS44MjYgMjA4LjEzOSw0ODEuNjU5IDExNy41LDQ4MC41QyAxMTAuNTIyLDQ3Ny4wMjEgMTA1LjM1NSw0NzEuNjg3IDEwMiw0NjQuNUMgMTAwLjU2OSw0NTMuNTc4IDEwMC4wNjksNDQyLjU3OCAxMDAuNSw0MzEuNUMgMTA0LjA4LDQ0MS41NzcgMTExLjA4LDQ0OC4wNzcgMTIxLjUsNDUxQyAyMDAuODMzLDQ1MS42NjcgMjgwLjE2Nyw0NTEuNjY3IDM1OS41LDQ1MUMgMzcwLjM2LDQ0OC4xNCAzNzcuMTkzLDQ0MS4zMDcgMzgwLDQzMC41QyAzODAuMzMzLDM2MS44MzMgMzgwLjY2NywyOTMuMTY3IDM4MSwyMjQuNUMgMzg1LjAzNSwyMTUuNzk2IDM5MS4yMDEsMjA4Ljk2MyAzOTkuNSwyMDRDIDQ0MS43MjksMTYyLjMxMyA0NDAuNzI5LDEyMS42NDYgMzk2LjUsODJDIDM2Ni43MzcsNTkuNDU4NyAzMzMuNDAzLDQ0LjQ1ODcgMjk2LjUsMzdDIDI3Ni4wNjEsMzIuNTMyIDI1NS4zOTQsMzAuMzY1NCAyMzQuNSwzMC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmZWU3YzciIGQ9Ik0gMjM0LjUsMzAuNSBDIDI1NS4zOTQsMzAuMzY1NCAyNzYuMDYxLDMyLjUzMiAyOTYuNSwzN0MgMzMzLjQwMyw0NC40NTg3IDM2Ni43MzcsNTkuNDU4NyAzOTYuNSw4MkMgNDQwLjcyOSwxMjEuNjQ2IDQ0MS43MjksMTYyLjMxMyAzOTkuNSwyMDRDIDM5MS4yMDEsMjA4Ljk2MyAzODUuMDM1LDIxNS43OTYgMzgxLDIyNC41QyAzODAuNjY3LDI5My4xNjcgMzgwLjMzMywzNjEuODMzIDM4MCw0MzAuNUMgMzc3LjE5Myw0NDEuMzA3IDM3MC4zNiw0NDguMTQgMzU5LjUsNDUxQyAyODAuMTY3LDQ1MS42NjcgMjAwLjgzMyw0NTEuNjY3IDEyMS41LDQ1MUMgMTExLjA4LDQ0OC4wNzcgMTA0LjA4LDQ0MS41NzcgMTAwLjUsNDMxLjVDIDEwMC42NjcsMzYyLjQ5OSAxMDAuNSwyOTMuNDk5IDEwMCwyMjQuNUMgOTkuMTkzOSwyMjEuNTU0IDk3Ljg2MDUsMjE4Ljg4OCA5NiwyMTYuNUMgODUuNDgwNSwyMDguMDY5IDc1LjgxMzgsMTk4LjczNiA2NywxODguNUMgNDUuOTE1OCwxNjAuMjYyIDQ1LjI0OTIsMTMxLjU5NSA2NSwxMDIuNUMgNzguNDQ4Niw4Ni4zNzc1IDk0LjI4Miw3My4yMTA5IDExMi41LDYzQyAxNTAuNzYzLDQzLjA3OCAxOTEuNDMsMzIuMjQ0NyAyMzQuNSwzMC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTgiIGQ9Ik0gMTUzLjUsOTguNSBDIDE1OS41MjMsOTcuMTk2NiAxNjMuMTg5LDk5LjUzIDE2NC41LDEwNS41QyAxNjIuMDkxLDExMi43MDIgMTU3LjU5MSwxMTQuMzY5IDE1MSwxMTAuNUMgMTQ4LjUyMywxMDUuNjY5IDE0OS4zNTYsMTAxLjY2OSAxNTMuNSw5OC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmM0OTgiIGQ9Ik0gMzMwLjUsMTEyLjUgQyAzMzguMjAxLDExMi4zNjIgMzQxLjM2NywxMTYuMDI5IDM0MCwxMjMuNUMgMzM0LjgzNywxMjkuMDYyIDMzMC4xNzEsMTI4LjcyOSAzMjYsMTIyLjVDIDMyNS40MzgsMTE4LjIzMiAzMjYuOTM4LDExNC44OTggMzMwLjUsMTEyLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzM5OCIgZD0iTSAxMjQuNSwxNDAuNSBDIDEzMC41MjMsMTM5LjE5NyAxMzQuMTg5LDE0MS41MyAxMzUuNSwxNDcuNUMgMTMzLjA5MSwxNTQuNzAyIDEyOC41OTEsMTU2LjM2OSAxMjIsMTUyLjVDIDExOS41MjMsMTQ3LjY2OSAxMjAuMzU2LDE0My42NjkgMTI0LjUsMTQwLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzQ5OSIgZD0iTSAzNzQuNSwxNDIuNSBDIDM4NC4xMSwxNDIuOTM2IDM4Ni43NzYsMTQ3LjQzNiAzODIuNSwxNTZDIDM3NC40NjMsMTU5LjYwMSAzNzAuMjk2LDE1Ny4xMDEgMzcwLDE0OC41QyAzNzEuMzMyLDE0Ni4zNCAzNzIuODMyLDE0NC4zNCAzNzQuNSwxNDIuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNIDIwNy41LDE2MS41IEMgMjE1LjE2MSwxNjAuNjYzIDIxOC42NjEsMTYzLjk5NiAyMTgsMTcxLjVDIDIxNC4yOTUsMTc1Ljk4MiAyMDkuOTYyLDE3Ni42NDkgMjA1LDE3My41QyAyMDIuNTIzLDE2OC42NjkgMjAzLjM1NiwxNjQuNjY5IDIwNy41LDE2MS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMzUyLjUsMjE5LjUgQyAzNjEuNjEsMjE5Ljc3MiAzNjQuNDQzLDIyNC4xMDUgMzYxLDIzMi41QyAyOTQuMTY3LDI5OS4zMzMgMjI3LjMzMywzNjYuMTY3IDE2MC41LDQzM0MgMTUxLjg3Niw0MzUuNzEzIDE0OC4wNDMsNDMyLjU0NiAxNDksNDIzLjVDIDIxNy4wMzUsMzU1LjYzMiAyODQuODY4LDI4Ny42MzIgMzUyLjUsMjE5LjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzQ5OCIgZD0iTSAyOTYuNSwyMjEuNSBDIDMwNi4wOTgsMjIyLjM2MiAzMDguNTk4LDIyNy4wMjkgMzA0LDIzNS41QyAyNTcuMTY3LDI4Mi4zMzMgMjEwLjMzMywzMjkuMTY3IDE2My41LDM3NkMgMTU2Ljg2MSwzODAuMTc3IDE1Mi41MjcsMzc4LjUxMSAxNTAuNSwzNzFDIDE1MC41NDIsMzY5LjAzMyAxNTEuMDQyLDM2Ny4xOTkgMTUyLDM2NS41QyAyMDAuMDYyLDMxNy4yNzIgMjQ4LjIyOCwyNjkuMjcyIDI5Ni41LDIyMS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMjMxLjUsMjI5LjUgQyAyNDEuMjQ1LDIyOC40MDUgMjQ0LjQxMSwyMzIuNDA1IDI0MSwyNDEuNUMgMjE3LjE2NywyNjUuMzMzIDE5My4zMzMsMjg5LjE2NyAxNjkuNSwzMTNDIDE2MC44OTQsMzE1LjczMiAxNTcuMDYxLDMxMi41NjYgMTU4LDMwMy41QyAxODIuNzAyLDI3OC45NjUgMjA3LjIwMiwyNTQuMjk5IDIzMS41LDIyOS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMzQ5LjUsMjc2LjUgQyAzNTkuMTQ4LDI3NS40OCAzNjIuMzE1LDI3OS40OCAzNTksMjg4LjVDIDMxMS41LDMzNiAyNjQsMzgzLjUgMjE2LjUsNDMxQyAyMDcuOTI4LDQzMy43NjkgMjA0LjA5NCw0MzAuNjAyIDIwNSw0MjEuNUMgMjUzLjM2OCwzNzMuMjk5IDMwMS41MzUsMzI0Ljk2NSAzNDkuNSwyNzYuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNIDM0My41LDMzOS41IEMgMzUzLjYxNSwzNDAuMTExIDM1Ni4xMTUsMzQ0Ljc3OCAzNTEsMzUzLjVDIDMyNy44MzMsMzc2LjY2NyAzMDQuNjY3LDM5OS44MzMgMjgxLjUsNDIzQyAyNzYuNzQsNDI2Ljc3NyAyNzIuNTczLDQyNi4yNzcgMjY5LDQyMS41QyAyNjguMjEsNDE4LjM2NiAyNjguNTQzLDQxNS4zNjYgMjcwLDQxMi41QyAyOTQuMzk1LDM4Ny45MzggMzE4Ljg5NSwzNjMuNjA1IDM0My41LDMzOS41IFoiLz48L2c+Cjwvc3ZnPgo="
    const icons = {
  "block": "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPCFET0NUWVBFIHN2ZyBQVUJMSUMgIi0vL1czQy8vRFREIFNWRyAxLjEvL0VOIiAiaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkIj4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZlcnNpb249IjEuMSIgd2lkdGg9IjUxMnB4IiBoZWlnaHQ9IjUxMnB4IiBzdHlsZT0ic2hhcGUtcmVuZGVyaW5nOmdlb21ldHJpY1ByZWNpc2lvbjsgdGV4dC1yZW5kZXJpbmc6Z2VvbWV0cmljUHJlY2lzaW9uOyBpbWFnZS1yZW5kZXJpbmc6b3B0aW1pemVRdWFsaXR5OyBmaWxsLXJ1bGU6ZXZlbm9kZDsgY2xpcC1ydWxlOmV2ZW5vZGQiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MC45ODciIGZpbGw9IiNmNzllNjAiIGQ9Ik0gMjI4LjUsLTAuNSBDIDIzMy4xNjcsLTAuNSAyMzcuODMzLC0wLjUgMjQyLjUsLTAuNUMgMjkyLjgzNSwxLjgzNjM4IDM0MC41MDEsMTQuNjY5NyAzODUuNSwzOEMgNDEzLjYxNSw1My4xMTUyIDQzNS40NDksNzQuNjE1MiA0NTEsMTAyLjVDIDQ1NC45NTMsMTEwLjA2NiA0NTcuNDUzLDExOC4wNjYgNDU4LjUsMTI2LjVDIDQ0OC4zOCwxMDEuMTU0IDQzMS4zOCw4MS42NTQxIDQwNy41LDY4QyAzNjcuNTYsNDUuMjYxMyAzMjQuNTYsMzIuNTk0NyAyNzguNSwzMEMgMjYzLjY2MSwyOS4xNzI0IDI0OC45OTQsMjkuMzM5MSAyMzQuNSwzMC41QyAxOTEuNDMsMzIuMjQ0NyAxNTAuNzYzLDQzLjA3OCAxMTIuNSw2M0MgOTQuMjgyLDczLjIxMDkgNzguNDQ4Niw4Ni4zNzc1IDY1LDEwMi41QyA0NS4yNDkyLDEzMS41OTUgNDUuOTE1OCwxNjAuMjYyIDY3LDE4OC41QyA3NS44MTM4LDE5OC43MzYgODUuNDgwNSwyMDguMDY5IDk2LDIxNi41QyA5Ny44NjA1LDIxOC44ODggOTkuMTkzOSwyMjEuNTU0IDEwMCwyMjQuNUMgMTAwLjUsMjkzLjQ5OSAxMDAuNjY3LDM2Mi40OTkgMTAwLjUsNDMxLjVDIDEwMC4wNjksNDQyLjU3OCAxMDAuNTY5LDQ1My41NzggMTAyLDQ2NC41QyAxMDUuMzU1LDQ3MS42ODcgMTEwLjUyMiw0NzcuMDIxIDExNy41LDQ4MC41QyA4OC42OTY0LDQ3My4zNjIgNzIuNjk2NCw0NTUuMDI5IDY5LjUsNDI1LjVDIDY5LjY2NjcsMzYxLjQ5OSA2OS41LDI5Ny40OTkgNjksMjMzLjVDIDQ5LjIyMDIsMjE3LjU5IDM0LjU1MzUsMTk3LjkyMyAyNSwxNzQuNUMgMTQuNDAzNywxMzYuODkgMjIuMDcwNCwxMDMuNTU3IDQ4LDc0LjVDIDc4Ljc4OTcsNDQuMDExNSAxMTUuMjksMjMuMTc4MSAxNTcuNSwxMkMgMTgwLjk3LDUuODY3NDggMjA0LjYzNiwxLjcwMDgyIDIyOC41LC0wLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2Q3N2Q0MSIgZD0iTSAyNDIuNSwtMC41IEMgMjU1LjgzMywtMC41IDI2OS4xNjcsLTAuNSAyODIuNSwtMC41QyAzMzMuOTk4LDIuOTQzMTQgMzgxLjk5OCwxNy43NzY1IDQyNi41LDQ0QyA0NTEuMjU2LDU5LjA4ODMgNDcwLjA5LDc5LjU4ODMgNDgzLDEwNS41QyA0OTcuNjY2LDE0NS41MDEgNDkwLjk5OSwxODEuNTAxIDQ2MywyMTMuNUMgNDU2LjMwMywyMjAuNTMyIDQ0OS4zMDMsMjI3LjE5OCA0NDIsMjMzLjVDIDQ0MS45NzksMzExLjE5MyA0NDEuMzEzLDM4OC44NiA0NDAsNDY2LjVDIDQzMy41NDMsNDkwLjQ1OCA0MTguMzc2LDUwNS40NTggMzk0LjUsNTExLjVDIDMwMS44MzMsNTExLjUgMjA5LjE2Nyw1MTEuNSAxMTYuNSw1MTEuNUMgOTIuNjIzOSw1MDUuNDU4IDc3LjQ1NzIsNDkwLjQ1OCA3MSw0NjYuNUMgNjkuNjM4NCw0NTIuODc0IDY5LjEzODQsNDM5LjIwOCA2OS41LDQyNS41QyA3Mi42OTY0LDQ1NS4wMjkgODguNjk2NCw0NzMuMzYyIDExNy41LDQ4MC41QyAyMDguMTM5LDQ4MS42NTkgMjk4LjgwNSw0ODEuODI2IDM4OS41LDQ4MUMgNDAxLjUxMiw0NzcuNjUyIDQwOC42NzksNDY5LjgxOSA0MTEsNDU3LjVDIDQxMS4zMzMsMzc5LjUgNDExLjY2NywzMDEuNSA0MTIsMjIzLjVDIDQxMi43MjUsMjIxLjA1MSA0MTMuNzI1LDIxOC43MTcgNDE1LDIxNi41QyA0MjQuMjY3LDIwOS4yMzYgNDMyLjkzNCwyMDEuMjM2IDQ0MSwxOTIuNUMgNDU3Ljc3MSwxNzMuNDE2IDQ2My42MDUsMTUxLjQxNiA0NTguNSwxMjYuNUMgNDU3LjQ1MywxMTguMDY2IDQ1NC45NTMsMTEwLjA2NiA0NTEsMTAyLjVDIDQzNS40NDksNzQuNjE1MiA0MTMuNjE1LDUzLjExNTIgMzg1LjUsMzhDIDM0MC41MDEsMTQuNjY5NyAyOTIuODM1LDEuODM2MzggMjQyLjUsLTAuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZmNkOGIzIiBkPSJNIDIzNC41LDMwLjUgQyAyNDguOTk0LDI5LjMzOTEgMjYzLjY2MSwyOS4xNzI0IDI3OC41LDMwQyAzMjQuNTYsMzIuNTk0NyAzNjcuNTYsNDUuMjYxMyA0MDcuNSw2OEMgNDMxLjM4LDgxLjY1NDEgNDQ4LjM4LDEwMS4xNTQgNDU4LjUsMTI2LjVDIDQ2My42MDUsMTUxLjQxNiA0NTcuNzcxLDE3My40MTYgNDQxLDE5Mi41QyA0MzIuOTM0LDIwMS4yMzYgNDI0LjI2NywyMDkuMjM2IDQxNSwyMTYuNUMgNDEzLjcyNSwyMTguNzE3IDQxMi43MjUsMjIxLjA1MSA0MTIsMjIzLjVDIDQxMS42NjcsMzAxLjUgNDExLjMzMywzNzkuNSA0MTEsNDU3LjVDIDQwOC42NzksNDY5LjgxOSA0MDEuNTEyLDQ3Ny42NTIgMzg5LjUsNDgxQyAyOTguODA1LDQ4MS44MjYgMjA4LjEzOSw0ODEuNjU5IDExNy41LDQ4MC41QyAxMTAuNTIyLDQ3Ny4wMjEgMTA1LjM1NSw0NzEuNjg3IDEwMiw0NjQuNUMgMTAwLjU2OSw0NTMuNTc4IDEwMC4wNjksNDQyLjU3OCAxMDAuNSw0MzEuNUMgMTA0LjA4LDQ0MS41NzcgMTExLjA4LDQ0OC4wNzcgMTIxLjUsNDUxQyAyMDAuODMzLDQ1MS42NjcgMjgwLjE2Nyw0NTEuNjY3IDM1OS41LDQ1MUMgMzcwLjM2LDQ0OC4xNCAzNzcuMTkzLDQ0MS4zMDcgMzgwLDQzMC41QyAzODAuMzMzLDM2MS44MzMgMzgwLjY2NywyOTMuMTY3IDM4MSwyMjQuNUMgMzg1LjAzNSwyMTUuNzk2IDM5MS4yMDEsMjA4Ljk2MyAzOTkuNSwyMDRDIDQ0MS43MjksMTYyLjMxMyA0NDAuNzI5LDEyMS42NDYgMzk2LjUsODJDIDM2Ni43MzcsNTkuNDU4NyAzMzMuNDAzLDQ0LjQ1ODcgMjk2LjUsMzdDIDI3Ni4wNjEsMzIuNTMyIDI1NS4zOTQsMzAuMzY1NCAyMzQuNSwzMC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmZWU3YzciIGQ9Ik0gMjM0LjUsMzAuNSBDIDI1NS4zOTQsMzAuMzY1NCAyNzYuMDYxLDMyLjUzMiAyOTYuNSwzN0MgMzMzLjQwMyw0NC40NTg3IDM2Ni43MzcsNTkuNDU4NyAzOTYuNSw4MkMgNDQwLjcyOSwxMjEuNjQ2IDQ0MS43MjksMTYyLjMxMyAzOTkuNSwyMDRDIDM5MS4yMDEsMjA4Ljk2MyAzODUuMDM1LDIxNS43OTYgMzgxLDIyNC41QyAzODAuNjY3LDI5My4xNjcgMzgwLjMzMywzNjEuODMzIDM4MCw0MzAuNUMgMzc3LjE5Myw0NDEuMzA3IDM3MC4zNiw0NDguMTQgMzU5LjUsNDUxQyAyODAuMTY3LDQ1MS42NjcgMjAwLjgzMyw0NTEuNjY3IDEyMS41LDQ1MUMgMTExLjA4LDQ0OC4wNzcgMTA0LjA4LDQ0MS41NzcgMTAwLjUsNDMxLjVDIDEwMC42NjcsMzYyLjQ5OSAxMDAuNSwyOTMuNDk5IDEwMCwyMjQuNUMgOTkuMTkzOSwyMjEuNTU0IDk3Ljg2MDUsMjE4Ljg4OCA5NiwyMTYuNUMgODUuNDgwNSwyMDguMDY5IDc1LjgxMzgsMTk4LjczNiA2NywxODguNUMgNDUuOTE1OCwxNjAuMjYyIDQ1LjI0OTIsMTMxLjU5NSA2NSwxMDIuNUMgNzguNDQ4Niw4Ni4zNzc1IDk0LjI4Miw3My4yMTA5IDExMi41LDYzQyAxNTAuNzYzLDQzLjA3OCAxOTEuNDMsMzIuMjQ0NyAyMzQuNSwzMC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTgiIGQ9Ik0gMTUzLjUsOTguNSBDIDE1OS41MjMsOTcuMTk2NiAxNjMuMTg5LDk5LjUzIDE2NC41LDEwNS41QyAxNjIuMDkxLDExMi43MDIgMTU3LjU5MSwxMTQuMzY5IDE1MSwxMTAuNUMgMTQ4LjUyMywxMDUuNjY5IDE0OS4zNTYsMTAxLjY2OSAxNTMuNSw5OC41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmM0OTgiIGQ9Ik0gMzMwLjUsMTEyLjUgQyAzMzguMjAxLDExMi4zNjIgMzQxLjM2NywxMTYuMDI5IDM0MCwxMjMuNUMgMzM0LjgzNywxMjkuMDYyIDMzMC4xNzEsMTI4LjcyOSAzMjYsMTIyLjVDIDMyNS40MzgsMTE4LjIzMiAzMjYuOTM4LDExNC44OTggMzMwLjUsMTEyLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzM5OCIgZD0iTSAxMjQuNSwxNDAuNSBDIDEzMC41MjMsMTM5LjE5NyAxMzQuMTg5LDE0MS41MyAxMzUuNSwxNDcuNUMgMTMzLjA5MSwxNTQuNzAyIDEyOC41OTEsMTU2LjM2OSAxMjIsMTUyLjVDIDExOS41MjMsMTQ3LjY2OSAxMjAuMzU2LDE0My42NjkgMTI0LjUsMTQwLjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzQ5OSIgZD0iTSAzNzQuNSwxNDIuNSBDIDM4NC4xMSwxNDIuOTM2IDM4Ni43NzYsMTQ3LjQzNiAzODIuNSwxNTZDIDM3NC40NjMsMTU5LjYwMSAzNzAuMjk2LDE1Ny4xMDEgMzcwLDE0OC41QyAzNzEuMzMyLDE0Ni4zNCAzNzIuODMyLDE0NC4zNCAzNzQuNSwxNDIuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNIDIwNy41LDE2MS41IEMgMjE1LjE2MSwxNjAuNjYzIDIxOC42NjEsMTYzLjk5NiAyMTgsMTcxLjVDIDIxNC4yOTUsMTc1Ljk4MiAyMDkuOTYyLDE3Ni42NDkgMjA1LDE3My41QyAyMDIuNTIzLDE2OC42NjkgMjAzLjM1NiwxNjQuNjY5IDIwNy41LDE2MS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMzUyLjUsMjE5LjUgQyAzNjEuNjEsMjE5Ljc3MiAzNjQuNDQzLDIyNC4xMDUgMzYxLDIzMi41QyAyOTQuMTY3LDI5OS4zMzMgMjI3LjMzMywzNjYuMTY3IDE2MC41LDQzM0MgMTUxLjg3Niw0MzUuNzEzIDE0OC4wNDMsNDMyLjU0NiAxNDksNDIzLjVDIDIxNy4wMzUsMzU1LjYzMiAyODQuODY4LDI4Ny42MzIgMzUyLjUsMjE5LjUgWiIvPjwvZz4KPGc+PHBhdGggc3R5bGU9Im9wYWNpdHk6MSIgZmlsbD0iI2YyYzQ5OCIgZD0iTSAyOTYuNSwyMjEuNSBDIDMwNi4wOTgsMjIyLjM2MiAzMDguNTk4LDIyNy4wMjkgMzA0LDIzNS41QyAyNTcuMTY3LDI4Mi4zMzMgMjEwLjMzMywzMjkuMTY3IDE2My41LDM3NkMgMTU2Ljg2MSwzODAuMTc3IDE1Mi41MjcsMzc4LjUxMSAxNTAuNSwzNzFDIDE1MC41NDIsMzY5LjAzMyAxNTEuMDQyLDM2Ny4xOTkgMTUyLDM2NS41QyAyMDAuMDYyLDMxNy4yNzIgMjQ4LjIyOCwyNjkuMjcyIDI5Ni41LDIyMS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMjMxLjUsMjI5LjUgQyAyNDEuMjQ1LDIyOC40MDUgMjQ0LjQxMSwyMzIuNDA1IDI0MSwyNDEuNUMgMjE3LjE2NywyNjUuMzMzIDE5My4zMzMsMjg5LjE2NyAxNjkuNSwzMTNDIDE2MC44OTQsMzE1LjczMiAxNTcuMDYxLDMxMi41NjYgMTU4LDMwMy41QyAxODIuNzAyLDI3OC45NjUgMjA3LjIwMiwyNTQuMjk5IDIzMS41LDIyOS41IFoiLz48L2c+CjxnPjxwYXRoIHN0eWxlPSJvcGFjaXR5OjEiIGZpbGw9IiNmMmMzOTciIGQ9Ik0gMzQ5LjUsMjc2LjUgQyAzNTkuMTQ4LDI3NS40OCAzNjIuMzE1LDI3OS40OCAzNTksMjg4LjVDIDMxMS41LDMzNiAyNjQsMzgzLjUgMjE2LjUsNDMxQyAyMDcuOTI4LDQzMy43NjkgMjA0LjA5NCw0MzAuNjAyIDIwNSw0MjEuNUMgMjUzLjM2OCwzNzMuMjk5IDMwMS41MzUsMzI0Ljk2NSAzNDkuNSwyNzYuNSBaIi8+PC9nPgo8Zz48cGF0aCBzdHlsZT0ib3BhY2l0eToxIiBmaWxsPSIjZjJjNDk4IiBkPSJNIDM0My41LDMzOS41IEMgMzUzLjYxNSwzNDAuMTExIDM1Ni4xMTUsMzQ0Ljc3OCAzNTEsMzUzLjVDIDMyNy44MzMsMzc2LjY2NyAzMDQuNjY3LDM5OS44MzMgMjgxLjUsNDIzQyAyNzYuNzQsNDI2Ljc3NyAyNzIuNTczLDQyNi4yNzcgMjY5LDQyMS41QyAyNjguMjEsNDE4LjM2NiAyNjguNTQzLDQxNS4zNjYgMjcwLDQxMi41QyAyOTQuMzk1LDM4Ny45MzggMzE4Ljg5NSwzNjMuNjA1IDM0My41LDMzOS41IFoiLz48L2c+Cjwvc3ZnPgo="
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
                },
                {
                    opcode: "setConfig",
                    text: "Set config [CONFIG] to [VALUE]",
                    blockType: BlockType.COMMAND,
                    hideFromPalette: true,
                    arguments: {
                      CONFIG: {
                        type: ArgumentType.STRING,
                        defaultValue: "soundWhenAlertEnabled",
                        menu: "configs",
                      },
                      VALUE: {
                        type: ArgumentType.STRING,
                        defaultValue: "true",
                      },
                    },
                },
             ],
             menus: {
                configs: [
                    { text: "play sound when alert", value: "soundWhenAlertEnabled" },
                ],
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
             text: xmlEscape(Cast.toString(args.TITLE)),
             message: xmlEscape(Cast.toString(args.MESSAGE)),
             position: xmlEscape(Cast.toString(args.POSITION))
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

        setConfig(args) {
          const configname = Cast.toString(args.CONFIG);
          toastConfig[configname] = Cast.toString(args.VALUE);
        }
    }
 
    Scratch.extensions.register(new ToastNotifications());
 })(Scratch);
