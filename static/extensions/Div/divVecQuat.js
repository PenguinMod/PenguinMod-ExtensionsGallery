(function(Scratch) {
    'use strict';
    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'3D Vectors & Quaternions\' must run unsandboxed!');
    }
    const {BlockType, BlockShape, ArgumentType, Cast, vm} = Scratch

    function formatNumber(x) {
        if (x >= 1e6) {
            return x.toExponential(4)
        } else {
            x = Math.floor(x * 1000) / 1000
            return x.toFixed(Math.min(3, (String(x).split('.')[1] || '').length))
        }
    }

    function span(text) {
        let el = document.createElement('span')
        el.innerHTML = text
        el.style.display = 'hidden'
        el.style.whiteSpace = 'nowrap'
        el.style.width = '100%'
        el.style.textAlign = 'center'
        return el
    }

    // Reporter display stuff is at the bottom of this script
    // Just takes too much space up here where custom type classes and smaller functions usually are lol

    const menuIconURI = `data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9Ii0wLjAwMDIgLTEuMjYwNSAyMC4wMDAyIDIwLjAwMDUiIHdpZHRoPSIyMC4wMDAycHgiIGhlaWdodD0iMjEuMjYwNXB4IiB4bWxuczpieD0iaHR0cHM6Ly9ib3h5LXN2Zy5jb20iPgogIDxkZWZzPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudC00LTAiIGhyZWY9IiNncmFkaWVudC00IiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjEwIiB5MT0iMCIgeDI9IjEwIiB5Mj0iMjAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTAuMDAwMzA3LCAtMS4yNjA5OTgpIi8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTQiPgogICAgICA8dGl0bGU+Um90b3IgT3V0bGluZTwvdGl0bGU+CiAgICAgIDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoODAsIDI2LCAxNDIpOyIgb2Zmc2V0PSIwIi8+CiAgICAgIDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoNDIsIDIyLCA5NSk7IiBvZmZzZXQ9IjEiLz4KICAgIDwvbGluZWFyR3JhZGllbnQ+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTEtMCIgaHJlZj0iI2dyYWRpZW50LTEiIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIiB4MT0iLTUiIHkxPSItMjAiIHgyPSItNSIgeTI9IjAiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMC4wMDEwOCwgMS4yNjE0NzgpIi8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTEiPgogICAgICA8dGl0bGU+VmVjdG9yIE91dGxpbmU8L3RpdGxlPgogICAgICA8c3RvcCBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDI1LCA2OCwgNTYpOyIgb2Zmc2V0PSIwIi8+CiAgICAgIDxzdG9wIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoNDAsIDExNSwgODMpOyIgb2Zmc2V0PSIxIi8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudC0wLTAiIGhyZWY9IiNncmFkaWVudC0wIiBncmFkaWVudFVuaXRzPSJ1c2VyU3BhY2VPblVzZSIgeDE9IjEwIiB5MT0iMSIgeDI9IjEwIiB5Mj0iMTkiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgLTAuMDAwMzA3LCAtMS4yNjA5OTgpIi8+CiAgICA8bGluZWFyR3JhZGllbnQgaWQ9ImdyYWRpZW50LTAiIGJ4OnBpbm5lZD0idHJ1ZSI+CiAgICAgIDx0aXRsZT5Sb3RvciBGaWxsPC90aXRsZT4KICAgICAgPHN0b3Agb2Zmc2V0PSIwIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDE5MiwgNTIsIDIxMCk7Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMSIgc3R5bGU9InN0b3AtY29sb3I6IHJnYigxNDksIDUyLCAyMTApOyIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQtMi0yIiBocmVmPSIjZ3JhZGllbnQtMiIgZ3JhZGllbnRVbml0cz0idXNlclNwYWNlT25Vc2UiIHgxPSIxNC41IiB5MT0iNS41IiB4Mj0iMTQuNSIgeTI9IjE0LjUiIGdyYWRpZW50VHJhbnNmb3JtPSJtYXRyaXgoMCwgLTIuMDAwMjM0LCAyLjAwMDIwMiwgMCwgLTEyLjE4NzUxMywgMzkuOTkwNzI5KSIvPgogICAgPGxpbmVhckdyYWRpZW50IGlkPSJncmFkaWVudC0yIiBieDpwaW5uZWQ9InRydWUiPgogICAgICA8dGl0bGU+VmVjdG9yIEZpbGw8L3RpdGxlPgogICAgICA8c3RvcCBvZmZzZXQ9IjAiIHN0eWxlPSJzdG9wLWNvbG9yOiByZ2IoNjAsIDE5OCwgMTExKTsiLz4KICAgICAgPHN0b3Agb2Zmc2V0PSIxIiBzdHlsZT0ic3RvcC1jb2xvcjogcmdiKDYwLCAxOTgsIDE0OSk7Ii8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8ZWxsaXBzZSBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBmaWxsOiB1cmwoJnF1b3Q7I2dyYWRpZW50LTQtMCZxdW90Oyk7IiBjeD0iMTAiIGN5PSI4Ljc0IiByeD0iMTAiIHJ5PSIxMCIgdHJhbnNmb3JtPSJtYXRyaXgoMSwgMCwgMCwgMSwgMy41NTI3MTM2Nzg4MDA1MDFlLTE1LCAxLjc3NjM1NjgzOTQwMDI1MDVlLTE1KSIvPgogIDxwYXRoIHN0eWxlPSJmaWxsOiB1cmwoJnF1b3Q7I2dyYWRpZW50LTEtMCZxdW90Oyk7IHRyYW5zZm9ybS1vcmlnaW46IC00Ljk5OXB4IC04LjczOXB4OyIgZD0iTSAtOS45OTkgLTE4LjczOSBBIDEwIDEwIDAgMSAxIC05Ljk5OSAxLjI2MSBBIDgxNjU2MTk2NzY1OTc2ODUwIDgxNjU2MTk2NzY1OTc2ODUwIDAgMCAxIC05Ljk5OSAtMTguNzM5IFoiIGJ4OnNoYXBlPSJjcmVzY2VudCAtOS45OTkgLTguNzM5IDEwIDE4MCAwLjUgMUA3Y2M5NDExZCIgdHJhbnNmb3JtPSJtYXRyaXgoLTEsIDAsIDAsIC0xLCA5Ljk5ODc3MjQzLCAxNy40Nzg0ODAxNSkiLz4KICA8cGF0aCBkPSJNIDE5IDguNzQgQyAxOSAxMy43MDggMTQuOTY3IDE3LjczNiAxMCAxNy43NCBDIDcuNTE4IDE3LjczNyA1LjUxNCAxNS43MjMgNS41MTQgMTMuMjQgQyA1LjUxNCAxMC43NTUgNy41MjkgOC43NCAxMC4wMTQgOC43NCBDIDEyLjQ5OSA4Ljc0IDE0LjUxNCA2LjcyNSAxNC41MTQgNC4yNCBDIDE0LjUxNCAxLjc2NiAxMi40NjkgLTAuMjQyIDEwIC0wLjI2IEMgMTQuOTQ5IC0wLjIzNCAxOSAzLjc4NSAxOSA4Ljc0IFoiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IGZpbGw6IHVybCgmcXVvdDsjZ3JhZGllbnQtMC0wJnF1b3Q7KTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDMuNTUyNzEzNjc4ODAwNTAxZS0xNSwgMS43NzYzNTY4Mzk0MDAyNTA1ZS0xNSkiLz4KICA8cGF0aCBkPSJNIDEyLjMxMiAxNS40OTcgQyAxNC43OTcgMTUuNDk3IDE2LjgxMiAxMy40ODIgMTYuODEyIDEwLjk5NyBDIDE2LjgxMiA0LjA2OSA5LjMxMiAtMC4yNjEgMy4zMTIgMy4yMDMgQyAwLjUyNyA0LjgxIC0xLjE4OCA3Ljc4MiAtMS4xODggMTAuOTk3IEMgLTEuMTg4IDguNTEyIDAuODI3IDYuNDk3IDMuMzEyIDYuNDk3IEMgNS43OTcgNi40OTcgNy44MTIgOC41MTIgNy44MTIgMTAuOTk3IEMgNy44MTIgMTMuNDgyIDkuODI3IDE1LjQ5NyAxMi4zMTIgMTUuNDk3IFoiIHN0eWxlPSJzdHJva2Utd2lkdGg6IDE7IGZpbGw6IHVybCgmcXVvdDsjZ3JhZGllbnQtMi0yJnF1b3Q7KTsgdHJhbnNmb3JtLW9yaWdpbjogNy44MTJweCA4Ljc0cHg7IiB0cmFuc2Zvcm09Im1hdHJpeCgwLCAtMSwgMSwgMCwgNWUtOCwgLTAuMDAwMDAxMTgpIi8+CiAgPHBhdGggZD0iTSAxMi44OTcgNy4wNjggQyAxMy42NDggNi4zMTcgMTQuMDY5IDUuMzggMTQuMDY5IDQuMjQgQyAxNC4wNjkgMy4xIDEzLjY0OSAyLjE2MyAxMi44OTcgMS40MTIgQyAxMi4xNDYgMC42NjEgMTEuMjA5IDAuMjQgMTAuMDY5IDAuMjQgQyA2Ljc0NCAwLjI0IDQuMTY4IDEuOTYxIDIuNzA4IDQuNDkgQyAxLjI0OCA3LjAxOSAxLjAwOSAxMC4xMzEgMi43MDggMTIuOTkgQyAzLjYyOCAxNC42MjYgNS4wMDYgMTYuMDI3IDYuNjM4IDE2Ljg3NCBDIDYuNjAyIDE2Ljg0MiA2LjU2OCAxNi44MDkgNi41MzMgMTYuNzc1IEMgNS42NTYgMTUuODk4IDUuMDY4IDE0LjU4NCA1LjA2OCAxMy4yNCBDIDUuMDY4IDExLjg5NSA1LjY1NSAxMC41ODIgNi41MzMgOS43MDUgQyA3LjQxIDguODI4IDguNzI0IDguMjQgMTAuMDY4IDguMjQgQyAxMS4yMDggOC4yNCAxMi4xNDUgNy44MiAxMi44OTYgNy4wNjggTCAxMi44OTcgNy4wNjggWiIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgZmlsbC1ydWxlOiBub256ZXJvOyBwYWludC1vcmRlcjogZmlsbDsgZmlsbC1vcGFjaXR5OiAwLjI1OyBmaWxsOiByZ2IoOTMsIDIzOCwgMTc0KTsiIHRyYW5zZm9ybT0ibWF0cml4KDEsIDAsIDAsIDEsIDMuNTUyNzEzNjc4ODAwNTAxZS0xNSwgMS43NzYzNTY4Mzk0MDAyNTA1ZS0xNSkiLz4KICA8cGF0aCBkPSJNIDE3LjM5IDcuNDM1IEMgMTguMTQxIDYuNjg0IDE4LjU2MiA1Ljc0NyAxOC41NjIgNC42MDcgQyAxOC41NjIgMy40NjcgMTguMTQyIDIuNTMgMTcuMzkgMS43NzkgQyAxNi42MzkgMS4wMjggMTUuNzAyIDAuNjA3IDE0LjU2MiAwLjYwNyBDIDExLjIzNyAwLjYwNyA4LjY2MSAyLjMyOCA3LjIwMSA0Ljg1NyBDIDUuNzQxIDcuMzg2IDUuNTAyIDEwLjQ5OCA3LjIwMSAxMy4zNTcgQyA4LjEyMSAxNC45OTMgOS40OTkgMTYuMzk0IDExLjEzMSAxNy4yNDEgQyAxMS4wOTUgMTcuMjA5IDExLjA2MSAxNy4xNzYgMTEuMDI2IDE3LjE0MiBDIDEwLjE0OSAxNi4yNjUgOS41NjEgMTQuOTUxIDkuNTYxIDEzLjYwNyBDIDkuNTYxIDEyLjI2MiAxMC4xNDggMTAuOTQ5IDExLjAyNiAxMC4wNzIgQyAxMS45MDMgOS4xOTUgMTMuMjE3IDguNjA3IDE0LjU2MSA4LjYwNyBDIDE1LjcwMSA4LjYwNyAxNi42MzggOC4xODcgMTcuMzg5IDcuNDM1IEwgMTcuMzkgNy40MzUgWiIgc3R5bGU9InN0cm9rZS13aWR0aDogMTsgZmlsbC1ydWxlOiBub256ZXJvOyBwYWludC1vcmRlcjogZmlsbDsgZmlsbC1vcGFjaXR5OiAwLjI1OyBmaWxsOiByZ2IoMjM3LCA5MywgMjM4KTsgdHJhbnNmb3JtLW9yaWdpbjogMTIuMjg4M3B4IDguOTI0cHg7IiB0cmFuc2Zvcm09Im1hdHJpeCgtMSwgMCwgMCwgLTEsIDAuMDAwMDA0MTgsIDIuN2UtNykiLz4KICA8cGF0aCBkPSJNIDEyLjMxMiAxNS40OTYgQyAxNC43OTcgMTUuNDk2IDE2LjgxMiAxMy40ODEgMTYuODEyIDEwLjk5NiBDIDE2LjgxMiA0LjA2OCA5LjMxMiAtMC4yNjIgMy4zMTIgMy4yMDIgQyAwLjUyNyA0LjgwOSAtMS4xODggNy43ODEgLTEuMTg4IDEwLjk5NiBDIC0xLjE4OCA4LjUxMSAwLjgyNyA2LjQ5NiAzLjMxMiA2LjQ5NiBDIDUuNzk3IDYuNDk2IDcuODEyIDguNTExIDcuODEyIDEwLjk5NiBDIDcuODEyIDEzLjQ4MSA5LjgyNyAxNS40OTYgMTIuMzEyIDE1LjQ5NiBaIiBzdHlsZT0ic3Ryb2tlLXdpZHRoOiAxOyBmaWxsOiBub25lOyB0cmFuc2Zvcm0tb3JpZ2luOiA3LjgxMnB4IDguNzM5NDJweDsiIHRyYW5zZm9ybT0ibWF0cml4KDAsIC0xLCAxLCAwLCA1ZS04LCAtMC4wMDAwMDE2NikiLz4KICA8ZyB0cmFuc2Zvcm09Im1hdHJpeCgxLjUwODI5Njk2NjU1MjczNDYsIDAsIDAsIDEuNTA4Mjk2OTY2NTUyNzM0NiwgMjQuMTg5MzQ2NjczOTI1OTE4LCAtMC4wMDU0NzIwMDAzMDQxOTE0ODIpIiBzdHlsZT0iIj4KICAgIDxwYXRoIGQ9Ik0gLTEuNzA4IDIuMjcgSCAxLjA5NiBMIDEuMDk2IDEuOTgzIEwgMS44NDkgMi40MzEgTCAxLjA5NiAyLjg3OSBMIDEuMDk2IDIuNTkzIEggLTEuNzA4IFYgMi4yNyBaIiBieDpzaGFwZT0iYXJyb3cgLTEuNzA4IDEuOTgzIDMuNTU3IDAuODk2IDAuMzIzIDAuNzUzIDAgMUAxNWFkZTc2ZCIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgc3Ryb2tlLXdpZHRoOiAwLjU4NzsiIHRyYW5zZm9ybT0ibWF0cml4KDAsIC0xLCAxLCAtMC4wMDA4OTYsIC0xMy43MzgwNzQsIDIuMDE0MzI3KSIvPgogICAgPHBhdGggZD0iTSAtMTEuMzAyIDEuNzU1IEwgLTkuNjczIDIuNjk2IEwgLTkuNjczIDQuNTc2IEwgLTExLjMwMiA1LjUxNyBMIC0xMi45MzEgNC41NzcgTCAtMTIuOTMxIDIuNjk2IFoiIGJ4OnNoYXBlPSJuLWdvbiAtMTEuMzAyIDMuNjM2IDEuODgxIDEuODgxIDYgMCAxQGJhNTE4YjIwIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDAuNTg3OyIvPgogICAgPHBhdGggZD0iTSAtMS43MDggMi4yNyBIIDEuMDk2IEwgMS4wOTYgMS45ODMgTCAxLjg0OSAyLjQzMSBMIDEuMDk2IDIuODc5IEwgMS4wOTYgMi41OTMgSCAtMS43MDggViAyLjI3IFoiIGJ4OnNoYXBlPSJhcnJvdyAtMS43MDggMS45ODMgMy41NTcgMC44OTYgMC4zMjMgMC43NTMgMCAxQDE1YWRlNzZkIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDAuNTg3OyB0cmFuc2Zvcm0tb3JpZ2luOiAwLjA3cHggMi40MzFweDsiIHRyYW5zZm9ybT0ibWF0cml4KDAuODY2MDI1LCAwLjUsIC0wLjQ5OTIyNCwgMC44NjY0NzQsIC05LjkyNzk2OSwgMi4wMDI2MjYpIi8+CiAgICA8cGF0aCBkPSJNIC0xLjcwOCAyLjI3IEggMS4wOTYgTCAxLjA5NiAxLjk4MyBMIDEuODQ5IDIuNDMxIEwgMS4wOTYgMi44NzkgTCAxLjA5NiAyLjU5MyBIIC0xLjcwOCBWIDIuMjcgWiIgYng6c2hhcGU9ImFycm93IC0xLjcwOCAxLjk4MyAzLjU1NyAwLjg5NiAwLjMyMyAwLjc1MyAwIDFAMTVhZGU3NmQiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMC41ODc7IHRyYW5zZm9ybS1vcmlnaW46IDAuMDdweCAyLjQzMXB4OyIgdHJhbnNmb3JtPSJtYXRyaXgoLTAuODY2MDI1LCAwLjUsIDAuNDk5MjI0LCAwLjg2NjQ3NCwgLTEyLjc0MTk3OSwgMi4wMTc1NSkiLz4KICA8L2c+CiAgPGcgdHJhbnNmb3JtPSJtYXRyaXgoMS40NjMyNzQwMDIwNzUxOTUzLCAwLCAwLCAxLjQ2MzI3NDAwMjA3NTE5NTMsIC0yLjU1NjgyOTk2NzQ1MTU0MTYsIC02LjQzMTQ3MDAxMzEzMzczMykiIHN0eWxlPSIiPgogICAgPHBhdGggZD0iTSAtMS43MDggMi4yNyBIIDEuMDk2IEwgMS4wOTYgMS45ODMgTCAxLjg0OSAyLjQzMSBMIDEuMDk2IDIuODc5IEwgMS4wOTYgMi41OTMgSCAtMS43MDggViAyLjI3IFoiIGJ4OnNoYXBlPSJhcnJvdyAtMS43MDggMS45ODMgMy41NTcgMC44OTYgMC4zMjMgMC43NTMgMCAxQDE1YWRlNzZkIiBzdHlsZT0iZmlsbDogcmdiKDI1NSwgMjU1LCAyNTUpOyBzdHJva2Utd2lkdGg6IDAuNTg3OyIgdHJhbnNmb3JtPSJtYXRyaXgoMCwgLTEsIDEsIC0wLjAwMDg5NiwgNS40OTc0MjYsIDEzLjA0NjU4MSkiLz4KICAgIDxwYXRoIGQ9Ik0gMTAuMTE5IDExLjM2MiBMIDExLjc0OCAxMi4zMDMgTCAxMS43NDggMTQuMTg0IEwgMTAuMTE5IDE1LjEyNCBMIDguNDkgMTQuMTg0IEwgOC40OSAxMi4zMDMgWiIgYng6c2hhcGU9Im4tZ29uIDEwLjExOSAxMy4yNDMgMS44ODEgMS44ODEgNiAwIDFAZjZkYjFlMGUiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMC41ODc7Ii8+CiAgICA8cGF0aCBkPSJNIC0xLjcwOCAyLjI3IEggMS4wOTYgTCAxLjA5NiAxLjk4MyBMIDEuODQ5IDIuNDMxIEwgMS4wOTYgMi44NzkgTCAxLjA5NiAyLjU5MyBIIC0xLjcwOCBWIDIuMjcgWiIgYng6c2hhcGU9ImFycm93IC0xLjcwOCAxLjk4MyAzLjU1NyAwLjg5NiAwLjMyMyAwLjc1MyAwIDFAMTVhZGU3NmQiIHN0eWxlPSJmaWxsOiByZ2IoMjU1LCAyNTUsIDI1NSk7IHN0cm9rZS13aWR0aDogMC41ODc7IHRyYW5zZm9ybS1ib3g6IGZpbGwtYm94OyB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlOyIgdHJhbnNmb3JtPSJtYXRyaXgoMC44NjYwMjUsIDAuNSwgLTAuNDk5MjI0LCAwLjg2NjQ3NCwgMTEuNDA0Mjc4LCA5LjE0MDM2OSkiLz4KICAgIDxwYXRoIGQ9Ik0gMS43MDggLTEuNjk3IEggNC41MTIgTCA0LjUxMiAtMS45ODMgTCA1LjI2NSAtMS41MzUgTCA0LjUxMiAtMS4wODcgTCA0LjUxMiAtMS4zNzQgSCAxLjcwOCBWIC0xLjY5NyBaIiBieDpzaGFwZT0iYXJyb3cgMS43MDggLTEuOTgzIDMuNTU3IDAuODk2IDAuMzIzIDAuNzUzIDAgMUA0YzFiNjg0OSIgc3R5bGU9ImZpbGw6IHJnYigyNTUsIDI1NSwgMjU1KTsgc3Ryb2tlLXdpZHRoOiAwLjU4NzsgdHJhbnNmb3JtLW9yaWdpbjogMy40ODdweCAtMS41MzVweDsiIHRyYW5zZm9ybT0ibWF0cml4KC0wLjg2NjAyNSwgMC41LCAwLjQ5OTIyNCwgMC44NjY0NzQsIDcuNDMxNzcxLCAxNi43NzYxNzgpIi8+CiAgPC9nPgo8L3N2Zz4=`

    class Vector3DType {
        customId = "divVector3D"
        constructor(x = 0, y = 0, z = 0) {
            this.x = x; this.y = y; this.z = z;
        }

        jwArrayHandler() {
            return 'Vector3D'
        }
        toString() {
            return `(${formatNumber(this.x)}, ${formatNumber(this.y)}, ${formatNumber(this.z)})`
        }
        toReporterContent() {
            const root = document.createElement('div')
            root.style.display = 'flex'
            root.style.minWidth = "190px"
            root.style.overflow = "hidden"
            root.style.padding = "2px"
            const details = document.createElement('div')
            details.style.display = 'flex'
            details.style.flexDirection = 'column'
            details.style.justifyContent = 'center'
            details.style.minWidth = "70px"
            details.style.paddingRight = "3px"
            details.appendChild(span(`<b>X:</b> ${formatNumber(this.x)}`))
            details.appendChild(span(`<b>Y:</b> ${formatNumber(this.y)}`))
            details.appendChild(span(`<b>Z:</b> ${formatNumber(this.z)}`))
            root.appendChild(details)
            
            const [scene, world] = mk3DScene()
            if(!this.isNaN && this.magsq > 0) {
                const {x, y, z} = this.norm.scale(40)
                world.appendChild(mkVector(x, y, z, '--text-primary'))
            }

            root.appendChild(scene)
            return root
        }

        get isNaN() {return Number.isNaN(this.x + this.y + this.z)}

        static toVector3D(v) {
            if(v instanceof Vector3DType) return v;
            return new Vector3DType()
        }

        getComp(comp) {
            switch(comp) {
                case "x": return this.x;
                case "y": return this.y;
                case "z": return this.z;
                default: return 0;
            }
        }

        add(rhs) {
            return new Vector3DType(this.x + rhs.x, this.y + rhs.y, this.z + rhs.z)
        }
        sub(rhs) {
            return new Vector3DType(this.x - rhs.x, this.y - rhs.y, this.z - rhs.z)
        }

        dot(rhs) {
            return this.x*rhs.x + this.y*rhs.y + this.z*rhs.z
        }
        cross(rhs) {
            return new Vector3DType(this.y*rhs.z - this.z*rhs.y, this.z*rhs.x - this.x*rhs.z, this.x*rhs.y - this.y*rhs.x)
        }

        get magsq() {
            return this.x*this.x + this.y*this.y + this.z*this.z
        }
        scale(s) {
            return new Vector3DType(this.x * s, this.y * s, this.z * s)
        }
        get norm() {
            const magsq = this.magsq;
            if(magsq == 0) return this;
            return this.scale(1/Math.sqrt(magsq))
        }

        project(target) {
            return target.scale(this.dot(target)/target.magsq)
        }
        reject(target) {
            return target.scale(-this.dot(target)/target.magsq).add(this)
        }
    }
    class QuaternionType {
        customId = "divQuaternion"
        constructor(r = 0, yz = 0, xz = 0, xy = 0) {
            this.r = r;
            this.yz = yz; this.xz = xz; this.xy = xy;
        }

        jwArrayHandler() {
            return 'Quaternion'
        }
        toString() {
            return `${formatNumber(this.r)} + ${formatNumber(this.yz)} 𝒊 + ${formatNumber(this.xz)} 𝑗 + ${formatNumber(this.xy)} 𝑘`
        }
        toReporterContent() {
            const root = document.createElement('div')
            root.style.display = 'flex'
            root.style.minWidth = "190px"
            root.style.overflow = "hidden"
            root.style.padding = "2px"
            root.style.flexDirection = "column"
            const top = document.createElement('div')
            top.style.display = 'flex'
            top.style.padding = "4px"
            top.style.height = "120px"
            const details = document.createElement('div')
            details.style.display = 'flex'
            details.style.flexDirection = 'column'
            details.style.justifyContent = 'center'
            details.style.minWidth = "70px"
            details.style.paddingRight = "3px"
            details.appendChild(span(`<b>1:</b> ${formatNumber(this.r)}`))
            details.appendChild(span(`<b>i:</b> ${formatNumber(this.yz)}`))
            details.appendChild(span(`<b>j:</b> ${formatNumber(this.xz)}`))
            details.appendChild(span(`<b>k:</b> ${formatNumber(this.xy)}`))
            top.appendChild(details)
            
            const [scene, world] = mk3DScene(true)
            const {yz, xz, xy} = this.norm.scale(40)
            let angle = 0;
            if(!this.isNaN && this.imag.magsq > 0) {
                world.appendChild(mkVector(yz, xz, xy, '--text-primary'));
                const plane = mkPlane(yz, xz, xy);
                world.appendChild(plane);
                const arc = document.createElement("div");
                arc.className = "divVecQuatArc";
                angle = this.angle*2;
                arc.style.setProperty('--angle', angle + 'rad')
                const arrow = document.createElement('div');
                arrow.className = 'divVecQuatArcArrow';
                arrow.style.transform = `translate(${-45+Math.sin(angle)*56/2}px, ${45 - Math.cos(angle)*56/2}px) rotate(${angle}rad) translate(-2px)`;
                plane.appendChild(arc);
                plane.appendChild(arrow);
            }
            top.appendChild(scene)
            root.appendChild(top)
            
            const bottom = document.createElement('div')
            bottom.style.display = 'flex'
            bottom.style.flexDirection = 'column'
            bottom.style.justifyContent = 'center'
            bottom.style.padding = "4px"
            bottom.appendChild(span(`<b>angle:</b> ${Math.round(angle*180/Math.PI)}°`))
            root.appendChild(bottom)
            return root
        }

        get isNaN() {return Number.isNaN(this.r + this.yz + this.xz + this.xy)}

        static toQuat(q) {
            if(q instanceof QuaternionType) return q;
            return new QuaternionType()
        }
        static withVec(r, v) {
            return new QuaternionType(r, v.x, v.y, v.z)
        }
        static aroundAxis(ax, angle) {
            if(ax.magsq === 0) return new QuaternionType();
            if(angle === 0) return new QuaternionType(1);
            angle = angle * (Math.PI / 180)
            return QuaternionType.withVec(Math.cos(angle/2), ax.norm.scale(Math.sin(angle/2)))
        }

        add(rhs) {
            return new QuaternionType(this.r + rhs.r, this.yz + rhs.yz, this.xz + rhs.xz, this.xy + rhs.xy)
        }
        sub(rhs) {
            return new QuaternionType(this.r - rhs.r, this.yz - rhs.yz, this.xz - rhs.xz, this.xy - rhs.xy)
        }
        // the big one
        mult(rhs) {
            return new QuaternionType(
                this.r*rhs.r  - this.yz*rhs.yz - this.xz*rhs.xz - this.xy*rhs.xy,
                this.r*rhs.yz + this.yz*rhs.r  + this.xz*rhs.xy - this.xy*rhs.xz,
                this.r*rhs.xz - this.yz*rhs.xy + this.xz*rhs.r  + this.xy*rhs.yz,
                this.r*rhs.xy + this.yz*rhs.xz - this.xz*rhs.yz + this.xy*rhs.r
            )
        }

        get magsq() {
            return this.r*this.r + this.yz*this.yz + this.xz*this.xz + this.xy*this.xy
        }
        scale(s) {
            return new QuaternionType(this.r * s, this.yz * s, this.xz * s, this.xy * s)
        }
        get norm() {
            const magsq = this.magsq;
            if(magsq == 0) return this;
            return this.scale(1/Math.sqrt(magsq))
        }

        get imag() {
            return new Vector3DType(this.yz, this.xz, this.xy);
        }
        get conj() {
            return new QuaternionType(this.r, -this.yz, -this.xz, -this.xy)
        }
        get inv() {
            return this.conj.scale(1/this.magsq)
        }
        get sqrt() {
            const mag = Math.sqrt(this.magsq);
            if(mag + this.r === 0) return new QuaternionType(0, mag, 0, 0)
            return this.add(new QuaternionType(mag, 0, 0, 0)).norm.scale(Math.sqrt(mag))
        }

        transform(v) {
            return this.mult(QuaternionType.withVec(0, v)).mult(this.inv).imag;
        }

        // psst, just so you know this is known as a *Geometric Product* hehehe
        static fromSpan(vec1, vec2) {
            const real = vec1.dot(vec2);
            const imag = vec1.cross(vec2);
            return QuaternionType.withVec(real, imag)
        }

        get angle() {
            return Math.atan2(Math.sqrt(this.imag.magsq), this.r)
        }

        get exp() {
            if(this.r === Number.NEGATIVE_INFINITY) return new QuaternionType()
            const vec = this.imag;
            const alpha = Math.sqrt(vec.magsq);
            return QuaternionType.withVec(Math.cos(alpha), vec.norm.scale(Math.sin(alpha))).scale(Math.exp(this.r))
        }
        get log() {
            if(this.magsq === 0) return new QuaternionType(Number.NEGATIVE_INFINITY, 0, 0, 0);
            return QuaternionType.withVec(Math.log(this.magsq)/2, this.imag.norm.scale(this.angle))
        }
    }

    const divVecQuat = {
        Vector: {
            Type: Vector3DType,
            Color: {
                color1: "#3cc66f",
                color2: "#2ea06f",
                color3: "#2ea06f",
            },
            Block: {
                blockType: BlockType.REPORTER,
                blockShape: BlockShape.LEAF,
                forceOutputType: "divVector3D",
                allowDropAnywhere: true,
                disableMonitor: true,
            },
            Argument: {
                shape: BlockShape.LEAF,
                exemptFromNormalization: true,
                check: ["divVector3D"]
            }
        },
        Quat: {
            Type: QuaternionType,
            Color: {
                color1: "#9534d2",
                color2: "#7027c3",
                color3: "#7027c3",
            },
            Block: {
                blockType: BlockType.REPORTER,
                blockShape: BlockShape.BUMPED,
                forceOutputType: "divQuaternion",
                allowDropAnywhere: true,
                disableMonitor: true,
            },
            Argument: {
                shape: BlockShape.BUMPED,
                exemptFromNormalization: true,
                check: ["divQuaternion"]
            }
        },
        // In case an extension accepts vector/quaternion input :eyes:
        descendVec3DInput(compiler, input) {
            if(input.kind === "constant") return "new vm.divVecQuat.Vector.Type()";
            const v = compiler.descendInput(input).asUnknown();
            return input.divType === "divVector3D" ? v : `vm.divVecQuat.Vector.Type.toVector3D(${v})`
        },
        descendQuatInput(compiler, input) {
            if(input.kind === "constant") return "new vm.divVecQuat.Quat.Type()";
            const q = compiler.descendInput(input).asUnknown();
            return input.divType === "divQuaternion" ? q : `vm.divVecQuat.Quat.Type.toQuat(${q})`
        }
    }
    const {descendVec3DInput, descendQuatInput} = divVecQuat;

    class Extension {
        constructor() {
            const style = initStyle();
            if(vm.divVecQuat) document.getElementById("divVecQuatStyle").replaceWith(style);
            else document.head.appendChild(style);

            vm.divVecQuat = divVecQuat;
            vm.runtime.registerCompiledExtensionBlocks('divVecQuat', this.getCompileInfo());
            vm.runtime.registerSerializer(
                "divVector3D", 
                v => [v.x, v.y, v.z], 
                v => new Vector3DType(v[0], v[1], v[2])
            );
            vm.runtime.registerSerializer(
                "divQuaternion", 
                q => [q.r, q.yz, q.xz, q.xy], 
                q => new QuaternionType(q[0], q[1], q[2], q[3])
            );
        }

        getInfo = () => ({
            id: "divVecQuat",
            name: "3D Vectors & Quats",
            menuIconURI,
            blocks: [
                {
                    blockType: BlockType.LABEL,
                    text: 'Vectors'
                },
                {
                    opcode: 'vecNew',
                    text: 'vector ([X], [Y], [Z])',
                    arguments: {
                        X: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Y: {type: ArgumentType.NUMBER, defaultValue: 0},
                        Z: {type: ArgumentType.NUMBER, defaultValue: 0},
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },
                {
                    opcode: 'vecComp',
                    text: 'get [COMP] of [V]',
                    arguments: {
                        COMP: {
                            type: Scratch.ArgumentType.STRING,
                            menu: "vecComp",
                            defaultValue: "x"
                        },
                        V: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },
                '---',
                {
                    opcode: 'vecAdd',
                    text: '[V1] + [V2]',
                    arguments: {
                        V1: divVecQuat.Vector.Argument,
                        V2: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },
                {
                    opcode: 'vecSub',
                    text: '[V1] - [V2]',
                    arguments: {
                        V1: divVecQuat.Vector.Argument,
                        V2: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },
                {
                    opcode: 'vecScale',
                    text: '[V] * [S]',
                    arguments: {
                        V: divVecQuat.Vector.Argument,
                        S: {type: ArgumentType.NUMBER, defaultValue: 2},
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },
                {
                    opcode: 'vecDot',
                    text: '[V1] ⋅ [V2]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        V1: divVecQuat.Vector.Argument,
                        V2: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Color,
                },
                {
                    opcode: 'vecCross',
                    text: '[V1] × [V2]',
                    arguments: {
                        V1: divVecQuat.Vector.Argument,
                        V2: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },
                '---',
                {
                    opcode: 'vecMagSq',
                    text: '‖[V]‖²',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        V: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Color,
                },
                {
                    opcode: 'vecNorm',
                    text: 'normalize [V]',
                    arguments: {
                        V: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },
                '---',
                {
                    opcode: 'vecProject',
                    text: 'project [V1] onto [V2]',
                    arguments: {
                        V1: divVecQuat.Vector.Argument,
                        V2: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },
                {
                    opcode: 'vecReject',
                    text: 'reject [V1] from [V2]',
                    arguments: {
                        V1: divVecQuat.Vector.Argument,
                        V2: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Vector.Color,
                },

                {
                    blockType: BlockType.LABEL,
                    text: 'Quaternions'
                },
                {
                    opcode: 'quatNew',
                    text: 'quaternion [R] + [YZ] i + [XZ] j + [XY] k',
                    arguments: {
                        R: {type: ArgumentType.NUMBER, defaultValue: 1},
                        YZ: {type: ArgumentType.NUMBER, defaultValue: 0},
                        XZ: {type: ArgumentType.NUMBER, defaultValue: 0},
                        XY: {type: ArgumentType.NUMBER, defaultValue: 0},
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatWithVec',
                    text: 'quaternion real: [R] imag: [VEC]',
                    arguments: {
                        R: {type: ArgumentType.NUMBER, defaultValue: 1},
                        VEC: divVecQuat.Vector.Argument
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatAround',
                    text: 'quaternion axis: [AXIS] angle: [ANGLE]',
                    arguments: {
                        AXIS: divVecQuat.Vector.Argument,
                        ANGLE: {type: ArgumentType.NUMBER, defaultValue: 90}
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                '---',
                {
                    opcode: 'quatReal',
                    text: 'real of [Q]',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatImag',
                    text: 'imag of [Q]',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Quat.Color,
                },
                '---',
                {
                    opcode: 'quatTransform',
                    text: 'apply [Q] on [V]',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                        V: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Vector.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatSpan',
                    text: 'from [V1] to [V2]',
                    arguments: {
                        V1: divVecQuat.Vector.Argument,
                        V2: divVecQuat.Vector.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                '---',
                {
                    opcode: 'quatAdd',
                    text: '[Q1] + [Q2]',
                    arguments: {
                        Q1: divVecQuat.Quat.Argument,
                        Q2: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatSub',
                    text: '[Q1] - [Q2]',
                    arguments: {
                        Q1: divVecQuat.Quat.Argument,
                        Q2: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatScale',
                    text: '[Q] * [S]',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                        S: {type: ArgumentType.NUMBER, defaultValue: 2},
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatMult',
                    text: '[Q1] * [Q2]',
                    arguments: {
                        Q1: divVecQuat.Quat.Argument,
                        Q2: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatInv',
                    text: '1 / [Q]',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                '---',
                {
                    opcode: 'quatMagSq',
                    text: '‖[Q]‖²',
                    blockType: BlockType.REPORTER,
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatNorm',
                    text: 'normalize [Q]',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatConj',
                    text: 'conjugate [Q]',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                "---",
                {
                    opcode: 'quatSqrt',
                    text: '√[Q]',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatExp',
                    text: 'exp([Q])',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
                {
                    opcode: 'quatLog',
                    text: 'log([Q])',
                    arguments: {
                        Q: divVecQuat.Quat.Argument,
                    },
                    ...divVecQuat.Quat.Block,
                    ...divVecQuat.Quat.Color,
                },
            ],
            menus: {
                vecComp: {
                    acceptReporters: true,
                    items: [{text: "x", value: "x"}, {text: "y", value: "y"}, {text: "z", value: "z"}]
                }
            }
        })

        getCompileInfo = () => ({
            ir: {
                // Vectors
                vecNew: (generator, block) => ({
                    kind: 'input',
                    X: generator.descendInputOfBlock(block, 'X'),
                    Y: generator.descendInputOfBlock(block, 'Y'),
                    Z: generator.descendInputOfBlock(block, 'Z'),
                    divType: "divVector3D",
                }),
                vecComp: (generator, block) => ({
                    kind: 'input',
                    COMP: generator.descendInputOfBlock(block, 'COMP'),
                    V: generator.descendInputOfBlock(block, 'V'),
                }),
                vecAdd: (generator, block) => ({
                    kind: 'input',
                    V1: generator.descendInputOfBlock(block, 'V1'),
                    V2: generator.descendInputOfBlock(block, 'V2'),
                    divType: "divVector3D",
                }),
                vecSub: (generator, block) => ({
                    kind: 'input',
                    V1: generator.descendInputOfBlock(block, 'V1'),
                    V2: generator.descendInputOfBlock(block, 'V2'),
                    divType: "divVector3D",
                }),
                vecDot: (generator, block) => ({
                    kind: 'input',
                    V1: generator.descendInputOfBlock(block, 'V1'),
                    V2: generator.descendInputOfBlock(block, 'V2'),
                }),
                vecCross: (generator, block) => ({
                    kind: 'input',
                    V1: generator.descendInputOfBlock(block, 'V1'),
                    V2: generator.descendInputOfBlock(block, 'V2'),
                    divType: "divVector3D",
                }),
                vecMagSq: (generator, block) => ({
                    kind: 'input',
                    V: generator.descendInputOfBlock(block, 'V'),
                }),
                vecScale: (generator, block) => ({
                    kind: 'input',
                    V: generator.descendInputOfBlock(block, 'V'),
                    S: generator.descendInputOfBlock(block, 'S'),
                    divType: "divVector3D",
                }),
                vecNorm: (generator, block) => ({
                    kind: 'input',
                    V: generator.descendInputOfBlock(block, 'V'),
                    divType: "divVector3D",
                }),
                vecProject: (generator, block) => ({
                    kind: 'input',
                    V1: generator.descendInputOfBlock(block, 'V1'),
                    V2: generator.descendInputOfBlock(block, 'V2'),
                    divType: "divVector3D",
                }),
                vecReject: (generator, block) => ({
                    kind: 'input',
                    V1: generator.descendInputOfBlock(block, 'V1'),
                    V2: generator.descendInputOfBlock(block, 'V2'),
                    divType: "divVector3D",
                }),

                // Quaternions
                quatNew: (generator, block) => ({
                    kind: 'input',
                    R : generator.descendInputOfBlock(block, 'R'),
                    YZ: generator.descendInputOfBlock(block, 'YZ'),
                    XZ: generator.descendInputOfBlock(block, 'XZ'),
                    XY: generator.descendInputOfBlock(block, 'XY'),
                    divType: "divQuaternion",
                }),
                quatWithVec: (generator, block) => ({
                    kind: 'input',
                    R: generator.descendInputOfBlock(block, 'R'),
                    VEC: generator.descendInputOfBlock(block, 'VEC'),
                    divType: "divQuaternion",
                }),
                quatReal: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                }),
                quatImag: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    divType: "divVector3D",
                }),
                quatAdd: (generator, block) => ({
                    kind: 'input',
                    Q1: generator.descendInputOfBlock(block, 'Q1'),
                    Q2: generator.descendInputOfBlock(block, 'Q2'),
                    divType: "divQuaternion",
                }),
                quatSub: (generator, block) => ({
                    kind: 'input',
                    Q1: generator.descendInputOfBlock(block, 'Q1'),
                    Q2: generator.descendInputOfBlock(block, 'Q2'),
                    divType: "divQuaternion",
                }),
                quatMult: (generator, block) => ({
                    kind: 'input',
                    Q1: generator.descendInputOfBlock(block, 'Q1'),
                    Q2: generator.descendInputOfBlock(block, 'Q2'),
                    divType: "divQuaternion",
                }),
                quatMagSq: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                }),
                quatScale: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    S: generator.descendInputOfBlock(block, 'S'),
                    divType: "divQuaternion",
                }),
                quatNorm: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    divType: "divQuaternion",
                }),
                quatConj: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    divType: "divQuaternion",
                }),
                quatSqrt: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    divType: "divQuaternion",
                }),
                quatInv: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    divType: "divQuaternion",
                }),
                quatExp: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    divType: "divQuaternion",
                }),
                quatLog: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    divType: "divQuaternion",
                }),
                quatAround: (generator, block) => ({
                    kind: 'input',
                    AXIS: generator.descendInputOfBlock(block, 'AXIS'),
                    ANGLE: generator.descendInputOfBlock(block, 'ANGLE'),
                    divType: "divQuaternion",
                }),
                quatTransform: (generator, block) => ({
                    kind: 'input',
                    Q: generator.descendInputOfBlock(block, 'Q'),
                    V: generator.descendInputOfBlock(block, 'V'),
                    divType: "divVector3D",
                }),
                quatSpan: (generator, block) => ({
                    kind: 'input',
                    V1: generator.descendInputOfBlock(block, 'V1'),
                    V2: generator.descendInputOfBlock(block, 'V2'),
                    divType: "divQuaternion",
                }),
            },
            js: {
                // Vectors
                vecNew(node, compiler, imports) {
                    const x = compiler.descendInput(node.X).asNumber(),
                          y = compiler.descendInput(node.Y).asNumber(),
                          z = compiler.descendInput(node.Z).asNumber();
                    return new imports.TypedInput(`new vm.divVecQuat.Vector.Type(${x}, ${y}, ${z})`, imports.TYPE_UNKNOWN);
                },
                vecComp(node, compiler, imports) {
                    const comp = compiler.descendInput(node.COMP).asString(),
                          v = descendVec3DInput(compiler, node.V);
                    if(node.COMP.kind == "constant")
                        return new imports.TypedInput(`${v}[${comp}]`, imports.TYPE_NUMBER);
                    return new imports.TypedInput(`${v}.getComp(${comp})`, imports.TYPE_NUMBER);
                },
                vecAdd(node, compiler, imports) {
                    const v1 = descendVec3DInput(compiler, node.V1),
                          v2 = descendVec3DInput(compiler, node.V2);
                    return new imports.TypedInput(`${v1}.add(${v2})`, imports.TYPE_UNKNOWN);
                },
                vecSub(node, compiler, imports) {
                    const v1 = descendVec3DInput(compiler, node.V1),
                          v2 = descendVec3DInput(compiler, node.V2);
                    return new imports.TypedInput(`${v1}.sub(${v2})`, imports.TYPE_UNKNOWN);
                },
                vecDot(node, compiler, imports) {
                    const v1 = descendVec3DInput(compiler, node.V1),
                          v2 = descendVec3DInput(compiler, node.V2);
                    return new imports.TypedInput(`${v1}.dot(${v2})`, imports.TYPE_NUMBER);
                },
                vecCross(node, compiler, imports) {
                    const v1 = descendVec3DInput(compiler, node.V1),
                          v2 = descendVec3DInput(compiler, node.V2);
                    return new imports.TypedInput(`${v1}.cross(${v2})`, imports.TYPE_UNKNOWN);
                },
                vecMagSq(node, compiler, imports) {
                    const v = descendVec3DInput(compiler, node.V);
                    return new imports.TypedInput(`${v}.magsq`, imports.TYPE_NUMBER);
                },
                vecScale(node, compiler, imports) {
                    const v = descendVec3DInput(compiler, node.V),
                          s = compiler.descendInput(node.S).asNumber();
                    return new imports.TypedInput(`${v}.scale(${s})`, imports.TYPE_UNKNOWN);
                },
                vecNorm(node, compiler, imports) {
                    const v = descendVec3DInput(compiler, node.V);
                    return new imports.TypedInput(`${v}.norm`, imports.TYPE_UNKNOWN);
                },
                vecProject(node, compiler, imports) {
                    const v1 = descendVec3DInput(compiler, node.V1),
                          v2 = descendVec3DInput(compiler, node.V2);
                    return new imports.TypedInput(`${v1}.project(${v2})`, imports.TYPE_UNKNOWN);
                },
                vecReject(node, compiler, imports) {
                    const v1 = descendVec3DInput(compiler, node.V1),
                          v2 = descendVec3DInput(compiler, node.V2);
                    return new imports.TypedInput(`${v1}.reject(${v2})`, imports.TYPE_UNKNOWN);
                },

                // Quaternions
                quatNew(node, compiler, imports) {
                    const r  = compiler.descendInput(node.R).asNumber(),
                          yz = compiler.descendInput(node.YZ).asNumber(),
                          xz = compiler.descendInput(node.XZ).asNumber(),
                          xy = compiler.descendInput(node.XY).asNumber();
                    return new imports.TypedInput(`new vm.divVecQuat.Quat.Type(${r}, ${yz}, ${xz}, ${xy})`, imports.TYPE_UNKNOWN);
                },
                quatWithVec(node, compiler, imports) {
                    const r = compiler.descendInput(node.R).asNumber(),
                          vec = descendVec3DInput(compiler, node.VEC);
                    return new imports.TypedInput(`vm.divVecQuat.Quat.Type.withVec(${r}, ${vec})`, imports.TYPE_UNKNOWN);
                },
                quatReal(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.r`, imports.TYPE_NUMBER);
                },
                quatImag(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.imag`, imports.TYPE_UNKNOWN);
                },
                quatAdd(node, compiler, imports) {
                    const q1 = descendQuatInput(compiler, node.Q1),
                          q2 = descendQuatInput(compiler, node.Q2);
                    return new imports.TypedInput(`${q1}.add(${q2})`, imports.TYPE_UNKNOWN);
                },
                quatSub(node, compiler, imports) {
                    const q1 = descendQuatInput(compiler, node.Q1),
                          q2 = descendQuatInput(compiler, node.Q2);
                    return new imports.TypedInput(`${q1}.sub(${q2})`, imports.TYPE_UNKNOWN);
                },
                quatMult(node, compiler, imports) {
                    const q1 = descendQuatInput(compiler, node.Q1),
                          q2 = descendQuatInput(compiler, node.Q2);
                    return new imports.TypedInput(`${q1}.mult(${q2})`, imports.TYPE_UNKNOWN);
                },
                quatMagSq(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.magsq`, imports.TYPE_NUMBER);
                },
                quatScale(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q),
                          s = compiler.descendInput(node.S).asNumber();
                    return new imports.TypedInput(`${q}.scale(${s})`, imports.TYPE_UNKNOWN);
                },
                quatNorm(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.norm`, imports.TYPE_UNKNOWN);
                },
                quatConj(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.conj`, imports.TYPE_UNKNOWN);
                },
                quatSqrt(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.sqrt`, imports.TYPE_UNKNOWN);
                },
                quatInv(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.inv`, imports.TYPE_UNKNOWN);
                },
                quatExp(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.exp`, imports.TYPE_UNKNOWN);
                },
                quatLog(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q);
                    return new imports.TypedInput(`${q}.log`, imports.TYPE_UNKNOWN);
                },
                quatAround(node, compiler, imports) {
                    const axis = descendVec3DInput(compiler, node.AXIS),
                          angle = compiler.descendInput(node.ANGLE).asNumber();
                    return new imports.TypedInput(`vm.divVecQuat.Quat.Type.aroundAxis(${axis}, ${angle})`, imports.TYPE_UNKNOWN);
                },
                quatTransform(node, compiler, imports) {
                    const q = descendQuatInput(compiler, node.Q),
                          v = descendVec3DInput(compiler, node.V);
                    return new imports.TypedInput(`${q}.transform(${v})`, imports.TYPE_UNKNOWN);
                },
                quatSpan(node, compiler, imports) {
                    const v1 = descendVec3DInput(compiler, node.V1),
                          v2 = descendVec3DInput(compiler, node.V2);
                    // Sqrt is applied here because fromSpan actually does twice the angle!!1!!
                    return new imports.TypedInput(`vm.divVecQuat.Quat.Type.fromSpan(${v1}, ${v2}).sqrt`, imports.TYPE_UNKNOWN);
                },
            },
        })

        // Uncompiled block definitions

        // Vectors
        vecNew({X, Y, Z}) {
            return new Vector3DType(Cast.toNumber(X), Cast.toNumber(Y), Cast.toNumber(Z))
        }
        vecComp({COMP, V}) {
            COMP = Cast.toString(COMP)
            V = Vector3DType.toVector3D(V)
            switch(COMP) {
                case "x": return V.x;
                case "y": return V.y;
                case "z": return V.z;
                default: return ""
            }
        }
        vecAdd({V1, V2}) {
            return Vector3DType.toVector3D(V1).add(Vector3DType.toVector3D(V2))
        }
        vecDot({V1, V2}) {
            return Vector3DType.toVector3D(V1).dot(Vector3DType.toVector3D(V2))
        }
        vecCross({V1, V2}) {
            return Vector3DType.toVector3D(V1).cross(Vector3DType.toVector3D(V2))
        }
        vecMagSq({V}) {
            return Vector3DType.toVector3D(V).magsq
        }
        vecScale({V, S}) {
            return Vector3DType.toVector3D(V).scale(Cast.toNumber(S))
        }
        vecNorm({V}) {
            return Vector3DType.toVector3D(V).norm
        }
        vecProject({V1, V2}) {
            return Vector3DType.toVector3D(V1).project(Vector3DType.toVector3D(V2))
        }
        vecReject({V1, V2}) {
            return Vector3DType.toVector3D(V1).reject(Vector3DType.toVector3D(V2))
        }

        // Quaternions
        quatNew({R, YZ, XZ, XY}) {
            return new QuaternionType(Cast.toNumber(R), Cast.toNumber(YZ), Cast.toNumber(XZ), Cast.toNumber(XY))
        }
        quatWithVec({R, VEC}) {
            return QuaternionType.withVec(Cast.toNumber(R), Vector3DType.toVector3D(VEC))
        }
        quatReal({Q}) {
            return QuaternionType.toQuat(Q).r
        }
        quatImag({Q}) {
            return QuaternionType.toQuat(Q).imag
        }
        quatAdd({Q1, Q2}) {
            return QuaternionType.toQuat(Q1).add(QuaternionType.toQuat(Q2))
        }
        quatMult({Q1, Q2}) {
            return QuaternionType.toQuat(Q1).mult(QuaternionType.toQuat(Q2))
        }
        quatMagSq({Q}) {
            return QuaternionType.toQuat(Q).magsq
        }
        quatScale({Q, S}) {
            return QuaternionType.toQuat(Q).scale(Cast.toNumber(S))
        }
        quatNorm({Q}) {
            return QuaternionType.toQuat(Q).norm
        }
        quatConj({Q}) {
            return QuaternionType.toQuat(Q).conj
        }
        quatSqrt({Q}) {
            return QuaternionType.toQuat(Q).sqrt
        }
        quatInv({Q}) {
            return QuaternionType.toQuat(Q).inv
        }
        quatExp({Q}) {
            return QuaternionType.toQuat(Q).exp
        }
        quatLog({Q}) {
            return QuaternionType.toQuat(Q).log
        }
        quatAround({AXIS, ANGLE}) {
            return QuaternionType.aroundAxis(Vector3DType.toVector3D(AXIS), Cast.toNumber(ANGLE))
        }
        quatTransform({Q, V}) {
            return QuaternionType.toQuat(Q).transform(Vector3DType.toVector3D(V))
        }
        quatSpan({V1, V2}) {
            return QuaternionType.fromSpan(Vector3DType.toVector3D(V1), Vector3DType.toVector3D(V2)).sqrt
        }
    }

    // All of the styles are concentrated here
    // Much more centeralized and also I can use cool 
    // css stuff like :hover, @keyframes and ::before
    function initStyle() {
        const style = document.createElement('style');
        style.id = "divVecQuatStyle"
        style.textContent = `
        .divVecQuatScene {
            width: 120px; height: 120px;
            display: inline-flex;
            justify-content: center;
            align-items: center;
            background-color: #5552;
            border-radius: 4px;
            perspective: 800px;
        }

        .divVecQuatWorld {
            position: relative;
            width: 0; height: 0;
            transform-style: preserve-3d;
            animation: divVecQuatSpinWorld var(--duration) linear infinite;
            transition: transform 0.25s ease-out, animation 0.2s ease-out;
        }
        .divVecQuatScene:hover > .divVecQuatWorld {
            animation: none;
            transform: perspective(20cm) rotateX(var(--my)) rotateZ(var(--mx));
        }
        
        @keyframes divVecQuatSpinWorld {
            from { transform: perspective(20cm) rotateX(var(--tilt)) rotateZ(-45deg  ); }
            to   { transform: perspective(20cm) rotateX(var(--tilt)) rotateZ(315deg); }
        }

        .divVecQuatLine {
            position: absolute;
            top: -1px; height: 2px;
            background-color: currentColor;
            transform-style: preserve-3d;
        }

        .divVecQuatLine::before {
            content: '';
            position: absolute;
            top: 0; left: 0; 
            width: 100%; height: 100%;
            background-color: currentColor;
            transform: rotateX(90deg);
        }

        .divVecQuatArrow {
            position: absolute;
            left: 100%; top: -4px;
            width: 0; height: 0;
            border-left: 10px solid currentColor;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            transform-style: preserve-3d;
        }

        .divVecQuatArrow::before {
            content: '';
            position: absolute;
            left: -10px; top: -5px;
            width: 0; height: 0;
            border-left: 10px solid currentColor;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            transform: rotateX(90deg);
        }

        .divVecQuatAxis {
            left: -45px; width: 90px;
            transform-origin: 50% 1px;
        }

        .divVecQuatVector {
            left: 0px; transform-origin: 0 1px;
        }

        .divVecQuatPlane {
            display: flex;
            justify-content: center;
            align-items: center;
            position: absolute;
            left: -45px; top: -45px;
            width: 90px; height: 90px;
            transform-origin: center;
            background-color: currentColor;
            transform-style: preserve-3d;
        }

        .divVecQuatArc {
            width: 60px;
            aspect-ratio: 1;
            padding: 4px;
            box-sizing: border-box;
            border-radius: 50%;
            background: #fff;
            transform-style: preserve-3d;
            mask:
                linear-gradient(#0000 0 0) content-box intersect,
                conic-gradient(#000 var(--angle),#0000 0);
        }

        .divVecQuatArcArrow {
            position: absolute;
            left: 100%; top: -4px;
            width: 0; height: 0;
            border-left: 10px solid #fff;
            border-top: 5px solid transparent;
            border-bottom: 5px solid transparent;
            transform-style: preserve-3d;
            transform-origin: 0% 50%;
        }
        `;
        return style;
    }

    function mk3DScene(quat = false) {
        const scene = document.createElement('div');
        scene.className = 'divVecQuatScene';
        document.body.appendChild(scene);
        
        const tiltX = 60;
        const duration = 15;
        const world = document.createElement('div');
        world.className = 'divVecQuatWorld';
        world.style.setProperty('--tilt', tiltX + 'deg');
        world.style.setProperty('--duration', duration + 's');
        scene.appendChild(world);
        scene.addEventListener("mousemove", (e) => {
            const { x, y, width, height } = scene.getBoundingClientRect();
            const mx = 2*(e.clientX - x)/width - 1, my = 2*(e.clientY - y)/height - 1;
            world.style.setProperty("--mx", -mx*90 + "deg");
            world.style.setProperty("--my", (-my+1)*90 + "deg");
        });

        // Vectors and Quaternions have differently colored axes cause I said so
        // (Not too different of course, that would be confusing)
        const xCol = quat ? '#FF4472' : '#FF4338';
        const yCol = quat ? '#7236FF' : '#7B77F1';
        const zCol = quat ? '#00FFB3' : '#22FF72';
        world.appendChild(createAxis(xCol,   0,  0));
        world.appendChild(createAxis(yCol,   0, 90));
        world.appendChild(createAxis(zCol, -90,  0));

        const xyPlane = document.createElement('div');
        xyPlane.className = 'divVecQuatPlane';
        xyPlane.style.color = "#5552";
        world.appendChild(xyPlane);

        return [scene, world]
    }

    function createAxis(color, rotY, rotZ) {
        const axis = document.createElement('div');
        axis.className = 'divVecQuatLine divVecQuatAxis';
        axis.style.color = color;
        axis.style.transform = `rotateZ(${rotZ}deg) rotateY(${rotY}deg)`;
        
        const arrow = document.createElement('div');
        arrow.className = 'divVecQuatArrow';
        axis.appendChild(arrow);

        return axis;
    }

    function mkVector(x, y, z, color) {
        const vector = document.createElement('div');
        vector.className = 'divVecQuatLine divVecQuatVector';
        vector.style.color = color;
        
        const length = Math.hypot(x, y, z);
        const xyLength = Math.hypot(x, y);
        
        const rotZ = Math.atan2(y, x);
        const rotY = Math.atan2(-z, xyLength);
        
        vector.style.width = `${length}px`;
        vector.style.transform = `rotateZ(${rotZ}rad) rotateY(${rotY}rad)`;
        
        const arrow = document.createElement('div');
        arrow.className = 'divVecQuatArrow';
        vector.appendChild(arrow);

        return vector;
    }

    function mkPlane(yz, xz, xy) {
        const plane = document.createElement('div');
        plane.className = 'divVecQuatPlane';
        plane.style.color = '#9307FF52';

        const xyLength = Math.hypot(yz, xz);
        const rotZ = Math.atan2(xz, yz);
        const rotY = Math.atan2(-xy, xyLength) + Math.PI/2;
        
        plane.style.transform = `rotateZ(${rotZ}rad) rotateY(${rotY}rad)`;

        return plane;
    }

    Scratch.extensions.register(new Extension())
})(Scratch)