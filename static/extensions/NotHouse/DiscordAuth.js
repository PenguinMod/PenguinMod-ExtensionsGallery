// DiscordAuth - Made by NotHouse and changed by MubiLop
// Version 1.2.2
// Get the lastest official release from https://extensions.penguinmod.com/extensions/NotHouse/DiscordAuth.js

(function(Scratch) {
    'use strict';

    function getDataFromObject(data, field) {
        if (data.hasOwnProperty(field)) {
            return data[field];
        } else {
            return "null";
        }
    }

    const icon = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyODYuMzAzODIiIGhlaWdodD0iMjgzLjIyNTMiIHZpZXdCb3g9IjAsMCwyODYuMzAzODIsMjgzLjIyNTMiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC05Ni44NDgwOSwtMzguMzg3MzUpIj48ZyBkYXRhLXBhcGVyLWRhdGE9InsmcXVvdDtpc1BhaW50aW5nTGF5ZXImcXVvdDs6dHJ1ZX0iIGZpbGwtcnVsZT0ibm9uemVybyIgc3Ryb2tlPSJub25lIiBzdHJva2UtbGluZWNhcD0iYnV0dCIgc3Ryb2tlLWxpbmVqb2luPSJtaXRlciIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2UtZGFzaGFycmF5PSIiIHN0cm9rZS1kYXNob2Zmc2V0PSIwIiBzdHlsZT0ibWl4LWJsZW5kLW1vZGU6IG5vcm1hbCI+PHBhdGggZD0iTTM4My4xNTE5MSwxODBjMCw3OC4yMTA1MSAtNjQuMDkxMywxNDEuNjEyNjUgLTE0My4xNTE5MSwxNDEuNjEyNjVjLTc5LjA2MDYxLDAgLTE0My4xNTE5MSwtNjMuNDAyMTQgLTE0My4xNTE5MSwtMTQxLjYxMjY1YzAsLTc4LjIxMDUxIDY0LjA5MTMsLTE0MS42MTI2NSAxNDMuMTUxOTEsLTE0MS42MTI2NWM3OS4wNjA2MSwwIDE0My4xNTE5MSw2My40MDIxNCAxNDMuMTUxOTEsMTQxLjYxMjY1eiIgZmlsbD0iIzI4MmIzMCIgc3Ryb2tlLXdpZHRoPSJOYU4iLz48cGF0aCBkPSJNMzc1LjEwMjQ5LDE4MGMwLDczLjgxMjczIC02MC40ODc0NSwxMzMuNjQ5NzggLTEzNS4xMDI0OSwxMzMuNjQ5NzhjLTc0LjYxNTA1LDAgLTEzNS4xMDI0OSwtNTkuODM3MDUgLTEzNS4xMDI0OSwtMTMzLjY0OTc4YzAsLTczLjgxMjczIDYwLjQ4NzQ1LC0xMzMuNjQ5NzggMTM1LjEwMjQ5LC0xMzMuNjQ5NzhjNzQuNjE1MDUsMCAxMzUuMTAyNDksNTkuODM3MDUgMTM1LjEwMjQ5LDEzMy42NDk3OHoiIGZpbGw9IiM0MjQ1NDkiIHN0cm9rZS13aWR0aD0iTmFOIi8+PHBhdGggZD0iTTM2Ni4zMzU0NiwxODBjMCw2OS4wMjI5IC01Ni41NjIzMSwxMjQuOTc3MDEgLTEyNi4zMzU0NiwxMjQuOTc3MDFjLTY5Ljc3MzE1LDAgLTEyNi4zMzU0NiwtNTUuOTU0MTIgLTEyNi4zMzU0NiwtMTI0Ljk3NzAxYzAsLTY5LjAyMjkgNTYuNTYyMzEsLTEyNC45NzcwMSAxMjYuMzM1NDYsLTEyNC45NzcwMWM2OS43NzMxNSwwIDEyNi4zMzU0Niw1NS45NTQxMiAxMjYuMzM1NDYsMTI0Ljk3NzAxeiIgZmlsbD0iIzcyODlkYSIgc3Ryb2tlLXdpZHRoPSJOYU4iLz48cGF0aCBkPSJNMzAxLjMxNzgsMTIzLjc1NTMzYzAuMTAzNDUsMC4wMjk5NyAwLjE4NTk0LDAuMTA4MzEgMC4yMjExNiwwLjIxMDFjMTkuOTgxODksMjkuMzgxMjMgMjkuODU2NzIsNjIuNTMzMjUgMjYuMTYzMzMsMTAwLjY5NDU2Yy0wLjAxMjYxLDAuMTY0MTYgLTAuMDk3NzUsMC4zMTQxNiAtMC4yMzIyMiwwLjQwOTE1Yy0xMy4zNjY1OCw5LjkxMzM3IC0yOC4zMjk5OSwxNy40NjgwMSAtNDQuMjQzMjQsMjIuMzM3MjVjLTAuMjMwMTcsMC4wNzI2IC0wLjQ4MDgsLTAuMDEyNDQgLTAuNjE5MjUsLTAuMjEwMWMtMy4zMzk1MywtNC42NDQzOCAtNi4zODA0OSwtOS41NTQxNSAtOS4wMzQ0MiwtMTQuNjk2MTRjLTAuMDc1NTMsLTAuMTM5MzkgLTAuMDg3NjQsLTAuMzA0NDggLTAuMDMzMTcsLTAuNDUzMzhjMC4wNTU4NCwtMC4xNTQzMiAwLjE3NzQzLC0wLjI3NTkgMC4zMzE3NCwtMC4zMzE3NGM0Ljc4NDgyLC0xLjc4NjcgOS40MDU5MiwtMy45ODQzOCAxMy44MTE1LC02LjU2ODQ4YzAuMTY3NywtMC4wOTI5NCAwLjI3NTI5LC0wLjI2NjExIDAuMjg0MywtMC40NTc2NGMwLjAwOTAxLC0wLjE5MTUzIC0wLjA4MTgzLC0wLjM3NDA0IC0wLjI0MDA3LC0wLjQ4MjNjLTAuOTM2MjMsLTAuNzAwMzYgLTEuODUwNCwtMS40MTkxMyAtMi43NDI0LC0yLjE1NjMyYy0wLjE2Mzk5LC0wLjEzNjg0IC0wLjM5MjE3LC0wLjE2Njk4IC0wLjU4NjA4LC0wLjA3NzQxYy0yOC42MDcxNiwxMy4yMjU0MiAtNTkuOTU2NzIsMTMuMjI1NDIgLTg4LjkxNzc0LDBjLTAuMTg3ODIsLTAuMDgwMzkgLTAuNDA0NzIsLTAuMDUwNjUgLTAuNTYzOTYsMC4wNzc0MWMtMC44OTIsMC43MzcxOCAtMS44MDYxNywxLjQ1NTk2IC0yLjc0MjQsMi4xNTYzMmwtMC4xNjU4NywwLjIxMDFjLTAuMTMyNywwLjI2MzM1IC0wLjAzNTM5LDAuNTg0NDcgMC4yMjExNiwwLjcyOTgzYzQuNDI0NjYsMi41NDM3OSA5LjAzODQsNC43NDM0NiAxMy44MDA0NCw2LjU3OTU0bDAuMTk5MDQsMC4xMjE2NGMwLjE3NzMyLDAuMTY4OTcgMC4yMjIyNywwLjQzNDQ3IDAuMTEwNTgsMC42NTI0MmMtMi42MTcwNSw1LjE1MzA1IC01LjYzMjI1LDEwLjA1MTc2IC05LjA0NTQ4LDE0LjY5NjE0Yy0wLjEzODQ1LDAuMTk3NjYgLTAuMzg5MDgsMC4yODI3IC0wLjYxOTI1LDAuMjEwMWMtMTUuODgxOTUsLTQuODk2MjMgLTMwLjgxOTEsLTEyLjQ0ODkzIC00NC4xNzY4OSwtMjIuMzM3MjVjLTAuMTMyNywtMC4xMTA1OCAtMC4yMTAxLC0wLjI0Njk4IC0wLjIzMjIyLC0wLjQwOTE1Yy0zLjA4NTE5LC0zMy4wMDgyNiAzLjIwNjgzLC02Ni40MzY3NCAyNi4xNDEyMiwtMTAwLjcwNTYyYzAuMDUxMjUsLTAuMDkxODQgMC4xMzM1OCwtMC4xNjI0NCAwLjIzMjIyLC0wLjE5OTA0YzExLjQ2NzE5LC01LjI3NDY5IDIzLjU3NTc1LC05LjAzNDQyIDM2LjAxNjA1LC0xMS4xNzk2OGMwLjIzMDg5LC0wLjAzODg3IDAuNDYxMjMsMC4wNzE4OCAwLjU3NTAyLDAuMjc2NDVjMS42OTU4NiwyLjk3OTU5IDMuMjE3MDYsNi4wNTUyMiA0LjU1NTkxLDkuMjExMzVjMTMuNDA2ODMsLTIuMDMyOTEgMjcuMDQzNSwtMi4wMzI5MSA0MC40NTAzMywwYzEuMjA1MzMsLTIuODMwODYgMi45MzAzOCwtNi40NDY4NCA0LjQ4OTU3LC05LjIxMTM1YzAuMTEzNzksLTAuMjA0NTcgMC4zNDQxMywtMC4zMTUzMiAwLjU3NTAyLC0wLjI3NjQ1YzEyLjQzODI2LDIuMTUzNTUgMjQuNTQ0Niw1LjkxMTQ3IDM2LjAxNjA1LDExLjE3OTY4TTIxMC42NjM5NSwyMDQuNTU2NDdjOC44NTc0OSwwIDE1LjkwMTQ3LC04LjAwNjAyIDE1LjkwMTQ3LC0xNy44MjU1N2MwLjEzMjcsLTkuNzY0MjUgLTYuOTc3NjMsLTE3LjgzNjYzIC0xNS45MDE0NywtMTcuODM2NjNjLTguODU3NDksMCAtMTUuOTAxNDcsOC4wMTcwOCAtMTUuOTAxNDcsMTcuODM2NjNjMCw5LjgxOTU0IDcuMTc2NjcsMTcuODI1NTcgMTUuOTAxNDcsMTcuODI1NTdNMjY5LjQ0ODUyLDIwNC41NTY0N2M4LjkyMzg0LDAgMTUuOTAxNDcsLTguMDA2MDIgMTUuOTAxNDcsLTE3LjgyNTU3YzAuMTQzNzUsLTkuNzY0MjUgLTYuOTc3NjMsLTE3LjgzNjYzIC0xNS45MDE0NywtMTcuODM2NjNjLTguODU3NDksMCAtMTUuOTAxNDcsOC4wMTcwOCAtMTUuOTAxNDcsMTcuODM2NjNjMCw5LjgxOTU0IDcuMTg3NzMsMTcuODI1NTcgMTUuOTAxNDcsMTcuODI1NTciIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMSIvPjwvZz48L2c+PC9zdmc+PCEtLXJvdGF0aW9uQ2VudGVyOjE0My4xNTE5MToxNDEuNjEyNjUwMDAwMDAwMDMtLT4=";

    const iconBlock = "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIxNi4wMDAxNyIgaGVpZ2h0PSIxMi4xOTYwMiIgdmlld0JveD0iMCwwLDE2LjAwMDE3LDEyLjE5NjAyIj48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjkxLjk5OTgzLC0xNDMuODk1MykiPjxnIGRhdGEtcGFwZXItZGF0YT0ieyZxdW90O2lzUGFpbnRpbmdMYXllciZxdW90Ozp0cnVlfSIgZmlsbD0iI2ZmZmZmZiIgZmlsbC1ydWxlPSJub256ZXJvIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWxpbmVjYXA9ImJ1dHQiIHN0cm9rZS1saW5lam9pbj0ibWl0ZXIiIHN0cm9rZS1taXRlcmxpbWl0PSIxMCIgc3Ryb2tlLWRhc2hhcnJheT0iIiBzdHJva2UtZGFzaG9mZnNldD0iMCIgc3R5bGU9Im1peC1ibGVuZC1tb2RlOiBub3JtYWwiPjxwYXRoIGQ9Ik0zMDUuNTQ1LDE0NC45MDdjMC4wMDkzNiwwLjAwMjcxIDAuMDE2ODEsMC4wMDk4IDAuMDIsMC4wMTljMS44MDcsMi42NTcgMi43LDUuNjU1IDIuMzY2LDkuMTA2Yy0wLjAwMTE0LDAuMDE0ODQgLTAuMDA4ODQsMC4wMjg0MSAtMC4wMjEsMC4wMzdjLTEuMjA4NzcsMC44OTY0OSAtMi41NjE5MywxLjU3OTY3IC00LjAwMSwyLjAyYy0wLjAyMDgxLDAuMDA2NTcgLTAuMDQzNDgsLTAuMDAxMTIgLTAuMDU2LC0wLjAxOWMtMC4zMDIsLTAuNDIgLTAuNTc3LC0wLjg2NCAtMC44MTcsLTEuMzI5Yy0wLjAwNjgzLC0wLjAxMjYgLTAuMDA3OTIsLTAuMDI3NTQgLTAuMDAzLC0wLjA0MWMwLjAwNTA1LC0wLjAxMzk2IDAuMDE2MDQsLTAuMDI0OTUgMC4wMywtMC4wM2MwLjQzMjcsLTAuMTYxNTcgMC44NTA1OSwtMC4zNjAzMiAxLjI0OSwtMC41OTRjMC4wMTUxNywtMC4wMDg0IDAuMDI0OSwtMC4wMjQwNiAwLjAyNTcxLC0wLjA0MTM4YzAuMDAwODIsLTAuMDE3MzIgLTAuMDA3NCwtMC4wMzM4MiAtMC4wMjE3MSwtMC4wNDM2MmMtMC4wODQ2NywtMC4wNjMzMyAtMC4xNjczMywtMC4xMjgzMyAtMC4yNDgsLTAuMTk1Yy0wLjAxNDgzLC0wLjAxMjM3IC0wLjAzNTQ2LC0wLjAxNTEgLTAuMDUzLC0wLjAwN2MtMi41ODcsMS4xOTYgLTUuNDIyLDEuMTk2IC04LjA0MSwwYy0wLjAxNjk5LC0wLjAwNzI3IC0wLjAzNjYsLTAuMDA0NTggLTAuMDUxLDAuMDA3Yy0wLjA4MDY3LDAuMDY2NjcgLTAuMTYzMzMsMC4xMzE2NyAtMC4yNDgsMC4xOTVsLTAuMDE1LDAuMDE5Yy0wLjAxMiwwLjAyMzgxIC0wLjAwMzIsMC4wNTI4NSAwLjAyLDAuMDY2YzAuNDAwMTMsMC4yMzAwNCAwLjgxNzM2LDAuNDI4OTYgMS4yNDgsMC41OTVsMC4wMTgsMC4wMTFjMC4wMTYwMywwLjAxNTI4IDAuMDIwMSwwLjAzOTI5IDAuMDEsMC4wNTljLTAuMjM2NjcsMC40NjYgLTAuNTA5MzMsMC45MDkgLTAuODE4LDEuMzI5Yy0wLjAxMjUyLDAuMDE3ODggLTAuMDM1MTksMC4wMjU1NyAtMC4wNTYsMC4wMTljLTEuNDM2MjMsLTAuNDQyNzcgLTIuNzg3MDMsLTEuMTI1NzggLTMuOTk1LC0yLjAyYy0wLjAxMiwtMC4wMSAtMC4wMTksLTAuMDIyMzMgLTAuMDIxLC0wLjAzN2MtMC4yNzksLTIuOTg1IDAuMjksLTYuMDA4IDIuMzY0LC05LjEwN2MwLjAwNDY0LC0wLjAwODMxIDAuMDEyMDgsLTAuMDE0NjkgMC4wMjEsLTAuMDE4YzEuMDM3LC0wLjQ3NyAyLjEzMiwtMC44MTcgMy4yNTcsLTEuMDExYzAuMDIwODgsLTAuMDAzNTIgMC4wNDE3MSwwLjAwNjUgMC4wNTIsMC4wMjVjMC4xNTMzNiwwLjI2OTQ1IDAuMjkwOTIsMC41NDc1OCAwLjQxMiwwLjgzM2MxLjIxMjQsLTAuMTgzODQgMi40NDU2LC0wLjE4Mzg0IDMuNjU4LDBjMC4xMDksLTAuMjU2IDAuMjY1LC0wLjU4MyAwLjQwNiwtMC44MzNjMC4wMTAyOSwtMC4wMTg1IDAuMDMxMTIsLTAuMDI4NTIgMC4wNTIsLTAuMDI1YzEuMTI0ODIsMC4xOTQ3NSAyLjIxOTYyLDAuNTM0NTggMy4yNTcsMS4wMTFNMjk3LjM0NywxNTIuMjE0YzAuODAxLDAgMS40MzgsLTAuNzI0IDEuNDM4LC0xLjYxMmMwLjAxMiwtMC44ODMgLTAuNjMxLC0xLjYxMyAtMS40MzgsLTEuNjEzYy0wLjgwMSwwIC0xLjQzOCwwLjcyNSAtMS40MzgsMS42MTNjMCwwLjg4OCAwLjY0OSwxLjYxMiAxLjQzOCwxLjYxMk0zMDIuNjYzLDE1Mi4yMTRjMC44MDcsMCAxLjQzOCwtMC43MjQgMS40MzgsLTEuNjEyYzAuMDEzLC0wLjg4MyAtMC42MzEsLTEuNjEzIC0xLjQzOCwtMS42MTNjLTAuODAxLDAgLTEuNDM4LDAuNzI1IC0xLjQzOCwxLjYxM2MwLDAuODg4IDAuNjUsMS42MTIgMS40MzgsMS42MTIiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjo4LjAwMDE2ODkwMzAzOTg3ODo2LjEwNDY5Njk5NjM3MjU1My0tPg==";

    class DiscordAuthExtension {
        constructor() {
            this.popup = null;
            this.privateCode = null;
        }

        getInfo() {
            return {
                id: 'discordauth',
                name: 'Discord Auth',
		color1: "#7289da",
		menuIconURI: icon,
             	blockIconURI: iconBlock,
                blocks: [
                {
                    opcode: 'openPopupAndWait',
                    blockType: Scratch.BlockType.COMMAND,
                    text: 'Open authentification window'
                },
                {
                    opcode: 'getPrivateCode',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Private code'
                },
                {
                    opcode: 'isLoggedIn',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Is user logged in with valid account?'
                },
                {
                    opcode: 'isApiWorking',
                    blockType: Scratch.BlockType.BOOLEAN,
                    text: 'Is Discord Auth api working?'
                },
                {
                    opcode: 'getUserObject',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Get user object with private code [PRIVATECODE]',
                    arguments: {
                        PRIVATECODE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Private code'
                        }
                    }
                },
                {
                    opcode: 'getUserField',
                    blockType: Scratch.BlockType.REPORTER,
                    text: 'Get [FIELD] from user with private code [PRIVATECODE]',
                    arguments: {
                        FIELD: {
                            type: Scratch.ArgumentType.STRING,
                            menu: 'userFields',
                            defaultValue: 'id'
                        },
                        PRIVATECODE: {
                            type: Scratch.ArgumentType.STRING,
                            defaultValue: 'Private code'
                        }
                    }
                }],
                menus: {
                    userFields: [
                    {
                        text: 'ID',
                        value: 'id'
                    },
                    {
                        text: 'Username',
                        value: 'username'
                    },
                    {
                        text: 'Avatar',
                        value: 'avatar'
                    },
                    {
                        text: 'Discriminator',
                        value: 'discriminator'
                    },
                    {
                        text: 'Public Flags',
                        value: 'public_flags'
                    },
                    {
                        text: 'Premium Type',
                        value: 'premium_type'
                    },
                    {
                        text: 'Flags',
                        value: 'flags'
                    },
                    {
                        text: 'Banner',
                        value: 'banner'
                    },
                    {
                        text: 'Accent Color',
                        value: 'accent_color'
                    },
                    {
                        text: 'Global Name',
                        value: 'global_name'
                    },
                    {
                        text: 'Avatar Decoration Data',
                        value: 'avatar_decoration_data'
                    },
                    {
                        text: 'Banner Color',
                        value: 'banner_color'
                    },
                    {
                        text: 'MFA Enabled',
                        value: 'mfa_enabled'
                    },
                    {
                        text: 'Locale',
                        value: 'locale'
                    },
                    {
                        text: 'Email',
                        value: 'email'
                    },
                    {
                        text: 'Verified',
                        value: 'verified'
                    }]
                }
            };
        }

        async openPopupAndWait() {
            const callbackUrlBase64 = btoa("https://studio.penguinmod.com");
            this.popup = await window.open(`https://discordauth.penguinmod.com/verify?callback=${callbackUrlBase64}`, 'PopupWindow', 'width=450,height=700');
            const startTime = Date.now();
            const pollInterval = setInterval(async () => {
                if (!this.popup || this.popup.closed) {
                    clearInterval(pollInterval);
                    const elapsedTime = Date.now() - startTime;
                    if (elapsedTime >= 5000) {
                        console.log("Timeout reached, private code not obtained. Aborted. Report bug to NotHouse.");
                    }
                } else {
                    try {
                        const urlParams = new URLSearchParams(this.popup.location.search);
                        const privateCode = urlParams.get('privatecode');
                        if (privateCode) {
                            this.privateCode = privateCode;
                            clearInterval(pollInterval);
                            this.popup.close();
                        } else {
                            console.log("No private code found yet, waiting...");
                        }
                    } catch (error) {
                        console.error("Error occurred while checking for private code:", error);
                    }
                }
            }, 1000);
        }

        getPrivateCode() {
            return this.privateCode || "null";
        }

        async isLoggedIn() {
            if (!this.privateCode) return false;
            const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${this.privateCode}`;
            try {
                const response = await fetch(apiUrl);
                if (response.status === 200) {
                    const data = await response.json();
                    if (data.username) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            } catch (error) {
                return false;
            }
        }

        async isApiWorking() {
            const apiUrl = `https://discordauth.penguinmod.com/`;
            try {
                const response = await fetch(apiUrl);
                if (response.status === 200) {
                    return true;
                } else {
                    return false;
                }
            } catch (error) {
                return false;
            }
        }

        async getUserObject(args) {
            if (/\s/.test(args.PRIVATECODE)) {
                return "null"
            }

            const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
            try {
                const response = await fetch(apiUrl);
                if (response.status === 200) {
                    return await response.text();
                } else {
                    return "null";
                }
            } catch (error) {
                console.error('Error:', error);
                return "null";
            }
        }

        async getUserField(args) {
            if (/\s/.test(args.PRIVATECODE)) {
                return "null"
            }

            const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
            try {
                const response = await fetch(apiUrl);
                if (response.status === 200) {
                    const data = await response.json();
                    return getDataFromObject(data, args.FIELD) || "null";
                } else {
                    return "null";
                }
            } catch (error) {
                console.error('Error:', error);
                return "null";
            }
        }


        async getUserID(args) {
            if (/\s/.test(args.PRIVATECODE)) {
                return "null"
            }

            const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
            try {
                const response = await fetch(apiUrl);
                if (response.status === 200) {
                    const data = await response.json();
                    return data.id;
                } else {
                    return "null";
                }
            } catch (error) {
                console.error('Error:', error);
                return "null";
            }
        }

        async getUsername(args) {
            if (/\s/.test(args.PRIVATECODE)) {
                return "null"
            }

            const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
            try {
                const response = await fetch(apiUrl);
                if (response.status === 200) {
                    const data = await response.json();
                    return data.username;
                } else {
                    return "null";
                }
            } catch (error) {
                console.error('Error:', error);
                return "null";
            }
        }

        async getNickname(args) {
            if (/\s/.test(args.PRIVATECODE)) {
                return "null"
            }

            const apiUrl = `https://discordauth.penguinmod.com/user?privatecode=${args.PRIVATECODE}`;
            try {
                const response = await fetch(apiUrl);
                if (response.status === 200) {
                    const data = await response.json();
                    return data.global_name;
                } else {
                    return "null";
                }
            } catch (error) {
                console.error('Error:', error);
                return "null";
            }
        }

    }

    Scratch.extensions.register(new DiscordAuthExtension());
})(Scratch);
