// Name: Enumerations
// ID: dogeiscutenumerations
// Description: No description provided.
// By: DogeisCut <https://scratch.mit.edu/users/DogeisCut/>
// License: MIT

(function(Scratch) {
    'use strict';

    if (!Scratch.extensions.unsandboxed) {
        throw new Error('\'Enumerations\' must run unsandboxed!');
    }

    const vm = Scratch.vm;
    const runtime = vm.runtime;

    let enumBlocks = [];
    const defaultEnumBlock = {
        opcode: "enum...", text: "...",
        blockType: Scratch.BlockType.REPORTER
    };

    let hideEnumBlocks = true;

    let enums = {};

    // tiny patch for events to update the dropdown
    if (Scratch.gui) Scratch.gui.getBlockly().then(SB => {
        const { Events, mainWorkspace } = SB;
        const workspaceEvents = (event) => {
            if (mainWorkspace.id === event.workspaceId) {
                if (event.type === Events.CHANGE) {
                    if (event.name == "ENUM") {
                        const block = mainWorkspace.getBlockById(event.blockId)
                        if (block.type == "dogeiscutenumerations_keyOfEnum") {
                            const chosenEnum = event.newValue
                            block.getInput(0).fieldRow[0].setValue(Object.keys(enums[chosenEnum])[0])
                        }
                    }
                }
            }
        };
        mainWorkspace.addChangeListener(workspaceEvents);
      });

    function openModal(titleName, promptTitle, addSelector, func) {
        let enumData = {};
        ScratchBlocks.prompt(
          titleName,
          "",
          (value) => {
            enumData = getEnumData();
            func(value, enumData);
          },
          promptTitle,
          "broadcast_msg"
        );

        if (addSelector) {
            const input = document.querySelector(`div[class="ReactModalPortal"] input`);
            const newLabel = input.parentNode.previousSibling.cloneNode(true);
            newLabel.textContent = "Labels and values:";

            const container = document.createElement("div");
            container.setAttribute("class", "enum-container");

            const addButton = document.createElement("button");
            addButton.textContent = "+";
            addButton.addEventListener("click", () => {
                const enumEntry = document.createElement("div");
                enumEntry.setAttribute("class", "enum-entry");

                const label = document.createElement("input");
                label.setAttribute("type", "text");
                label.setAttribute("placeholder", "Label");

                const numberInput = document.createElement("input");
                numberInput.setAttribute("type", "number");
                numberInput.setAttribute("placeholder", "Value");

                // Autofill with a unique number
                const existingEntries = container.querySelectorAll('.enum-entry');
                numberInput.value = existingEntries.length + 1;

                const removeButton = document.createElement("button");
                removeButton.textContent = "-";
                removeButton.addEventListener("click", () => {
                    container.removeChild(enumEntry);
                });
                
                enumEntry.appendChild(label);
                enumEntry.appendChild(numberInput);
                enumEntry.appendChild(removeButton);
                container.appendChild(enumEntry);
            });

            input.parentNode.append(newLabel, container, addButton);
        }
    }

    function getEnumData() {
        const enumData = {};
        const entries = document.querySelectorAll('.enum-entry');
        entries.forEach((entry, index) => {
            let label = entry.querySelector('input[type="text"]').value.trim();
            let value = parseFloat(entry.querySelector('input[type="number"]').value);
            if (!label) {
                label = `Label${index + 1}`;
            }
            if (isNaN(value)) {
                value = index + 1;
            }
            let uniqueLabel = label;
            let counter = 1;
            while (enumData.hasOwnProperty(uniqueLabel)) {
                uniqueLabel = `${label}${counter}`;
                counter++;
            }
            if (uniqueLabel !== label) {
                entry.querySelector('input[type="text"]').value = uniqueLabel;
            }
            enumData[uniqueLabel] = value;
        });
        return enumData;
    }

    function getCurrentBlockArgs() {
        const ScratchBlocks = window.ScratchBlocks;
        if (!ScratchBlocks) return {};
        const source = ScratchBlocks.selected;
        if (!source) return {};
        
        const args = {};
        for (const input of source.inputList) {
            for (const field of input.fieldRow) {
                if (field.isCurrentlyEditable()) args[field.name] = field.getValue();
            }
            if (!input.connection) continue;
            const block = input.connection.targetConnection.sourceBlock_;
            if (!block || !block.isShadow()) continue;
            for (const input2 of block.inputList) {
                for (const field2 of input2.fieldRow) {
                    if (field2.isCurrentlyEditable()) args[input.name] = field2.getValue();
                }
            }
        }
        return args;
    }

    const icon = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjxzdmcKICAgd2lkdGg9Ijc3LjIyMiIKICAgaGVpZ2h0PSI3Ny4yMjIiCiAgIHZpZXdCb3g9IjAgMCA3Ny4yMjIgNzcuMjIyIgogICB2ZXJzaW9uPSIxLjEiCiAgIGlkPSJzdmczIgogICBzb2RpcG9kaTpkb2NuYW1lPSJFbnVtZXJhdG9ycy1JY29uLnN2ZyIKICAgaW5rc2NhcGU6dmVyc2lvbj0iMS4zICgwZTE1MGVkNmM0LCAyMDIzLTA3LTIxKSIKICAgeG1sbnM6aW5rc2NhcGU9Imh0dHA6Ly93d3cuaW5rc2NhcGUub3JnL25hbWVzcGFjZXMvaW5rc2NhcGUiCiAgIHhtbG5zOnNvZGlwb2RpPSJodHRwOi8vc29kaXBvZGkuc291cmNlZm9yZ2UubmV0L0RURC9zb2RpcG9kaS0wLmR0ZCIKICAgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIgogICB4bWxuczpzdmc9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcwogICAgIGlkPSJkZWZzMyIgLz4KICA8c29kaXBvZGk6bmFtZWR2aWV3CiAgICAgaWQ9Im5hbWVkdmlldzMiCiAgICAgcGFnZWNvbG9yPSIjNTA1MDUwIgogICAgIGJvcmRlcmNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcm9wYWNpdHk9IjEiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjAiCiAgICAgaW5rc2NhcGU6cGFnZW9wYWNpdHk9IjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMSIKICAgICBpbmtzY2FwZTpkZXNrY29sb3I9IiM1MDUwNTAiCiAgICAgaW5rc2NhcGU6em9vbT0iMS43NTU4MTczIgogICAgIGlua3NjYXBlOmN4PSItMTE4LjE3ODU4IgogICAgIGlua3NjYXBlOmN5PSItMjguNDc2NzY3IgogICAgIGlua3NjYXBlOndpbmRvdy13aWR0aD0iMTkyMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctaGVpZ2h0PSIxMDI3IgogICAgIGlua3NjYXBlOndpbmRvdy14PSItOCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iLTgiCiAgICAgaW5rc2NhcGU6d2luZG93LW1heGltaXplZD0iMSIKICAgICBpbmtzY2FwZTpjdXJyZW50LWxheWVyPSJzdmczIiAvPgogIDxwYXRoCiAgICAgZD0iTSAyLDM4LjYxMSBDIDIsMTguMzkxIDE4LjM5MSwyIDM4LjYxMSwyIGMgMjAuMjIsMCAzNi42MTEsMTYuMzkxIDM2LjYxMSwzNi42MTEgMCwyMC4yMiAtMTYuMzkxLDM2LjYxMSAtMzYuNjExLDM2LjYxMSBDIDE4LjM5MSw3NS4yMjIgMiw1OC44MzEgMiwzOC42MTEgWiIKICAgICBmaWxsPSIjNTljMDU5IgogICAgIHN0cm9rZT0iIzQ3OWE0NyIKICAgICBzdHJva2Utd2lkdGg9IjQiCiAgICAgaWQ9InBhdGgxIgogICAgIHN0eWxlPSJmaWxsOiNiZTI3MWE7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOiM5ODFmMTU7c3Ryb2tlLW1pdGVybGltaXQ6MTA7c3Ryb2tlLW9wYWNpdHk6MSIgLz4KICA8cGF0aAogICAgIGQ9Ik0gMSwxIEggNzUuMjIyIFYgNzUuMjIyIEggMSBaIgogICAgIGZpbGw9Im5vbmUiCiAgICAgaWQ9InBhdGgyIgogICAgIHN0eWxlPSJzdHJva2UtbWl0ZXJsaW1pdDoxMCIgLz4KICA8ZwogICAgIGlkPSJnNCIKICAgICB0cmFuc2Zvcm09Im1hdHJpeCgxLjMwNTM0MjUsMCwwLDEuMzA1MzQyNSwtMTEuNzkwMDA4LC0xMS43ODk1NzkpIgogICAgIHN0eWxlPSJmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNzY2MDgyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utb3BhY2l0eToxIj4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6NDBweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OkltcGFjdDstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOkltcGFjdDtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNTg2ODgyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utb3BhY2l0eToxIgogICAgICAgZD0ibSA0Ny42MzQ3NjYsMTkuODQxNDY5IHYgNC42Njc5NjkgYyAxLjYyNzYwMiwwIDIuNjM2NzE5LDAuMTE3MTg3IDMuMDI3MzQzLDAuMzUxNTYyIDAuNDAzNjQ2LDAuMjM0Mzc1IDAuNjU3NTUzLDAuNTE0MzIzIDAuNzYxNzE5LDAuODM5ODQ0IDAuMTA0MTY3LDAuMzI1NTIgMC4xOTUzMTMsMS42MTQ1ODUgMC4yNzM0MzgsMy44NjcxODcgMC4wNzgxMywyLjIzOTU4MSAwLjE5NTMxMiwzLjc3NjA0MyAwLjM1MTU2Miw0LjYwOTM3NSAwLjE1NjI1LDAuODIwMzEyIDAuNDU1NzMsMS41ODIwMzIgMC44OTg0MzgsMi4yODUxNTcgMC40NDI3MDgsMC43MDMxMjQgMS4yMjM5NTksMS40MTkyNzEgMi4zNDM3NSwyLjE0ODQzNyAtMS4wNTQ2ODcsMC42MTE5NzkgLTEuODI5NDI4LDEuMzI4MTI2IC0yLjMyNDIxOSwyLjE0ODQzOCAtMC40ODE3NywwLjgyMDMxMSAtMC44MDcyOTIsMS43MDU3MyAtMC45NzY1NjMsMi42NTYyNSAtMC4xNTYyNDksMC45Mzc0OTkgLTAuMjczNDM3LDMuMDcyOTIgLTAuMzUxNTYyLDYuNDA2MjUgLTAuMDI2MDQsMS4xNTg4NTMgLTAuMjQ3Mzk2LDEuOTI3MDgzIC0wLjY2NDA2MywyLjMwNDY4NyAtMC40MDM2NDUsMC4zNzc2MDQgLTEuNTEwNDE4LDAuNTY2NDA2IC0zLjMyMDMxMiwwLjU2NjQwNiB2IDQuNjg3NSBoIDEuMDM1MTU2IGMgMS44MDk4OTQsMCAzLjIwOTYzNywtMC4xNjI3NiA0LjE5OTIxOSwtMC40ODgyODEgMC45ODk1ODIsLTAuMzEyNSAxLjc5Njg3NSwtMC44MjY4MjQgMi40MjE4NzUsLTEuNTQyOTY5IDAuNjI0OTk5LC0wLjcxNjE0NSAxLjAxNTYyNSwtMS42MDgwNzQgMS4xNzE4NzUsLTIuNjc1NzgxIDAuMTU2MjUsLTEuMDU0Njg2IDAuMjM0Mzc1LC0yLjY4ODgwNCAwLjIzNDM3NSwtNC45MDIzNDQgMCwtMi44NjQ1OCAwLjM1ODA3NCwtNC43MTM1NDIgMS4wNzQyMTksLTUuNTQ2ODc1IDAuNzE2MTQ1LC0wLjgzMzMzMiAxLjc4Mzg1NSwtMS4yNTY1MSAzLjIwMzEyNSwtMS4yNjk1MzEgdiAtNC42ODc1IGMgLTEuNDE5MjcsLTAuMDUyMDggLTIuMzg5MzI0LC0wLjM3MTA5NCAtMi45MTAxNTcsLTAuOTU3MDMxIC0wLjUwNzgxMiwtMC41OTg5NTggLTAuODY1ODg1LC0xLjI1NjUxMSAtMS4wNzQyMTgsLTEuOTcyNjU2IC0wLjE5NTMxMywtMC43MTYxNDUgLTAuMjkyOTY5LC0yLjQ1NDQzIC0wLjI5Mjk2OSwtNS4yMTQ4NDQgMCwtMi40MDg4NTIgLTAuMjUzOTA3LC00LjE1MzY0NyAtMC43NjE3MTksLTUuMjM0Mzc1IC0wLjUwNzgxMiwtMS4wODA3MjggLTEuMzI4MTI2LC0xLjg1NTQ2OSAtMi40NjA5MzcsLTIuMzI0MjE5IC0xLjEzMjgxMiwtMC40ODE3NyAtMi43NDA4ODgsLTAuNzIyNjU2IC00LjgyNDIxOSwtMC43MjI2NTYgeiIKICAgICAgIGlkPSJwYXRoNCIgLz4KICAgIDxwYXRoCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6NDBweDtsaW5lLWhlaWdodDoxLjI1O2ZvbnQtZmFtaWx5OkltcGFjdDstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOkltcGFjdDtmaWxsOiNmZmZmZmY7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjAuNTg2ODgyO3N0cm9rZS1saW5lY2FwOnJvdW5kO3N0cm9rZS1saW5lam9pbjpyb3VuZDtzdHJva2Utb3BhY2l0eToxIgogICAgICAgZD0ibSAzMS45NTExNzIsMjIuODAwNDUzIHYgMzEuNjIxMDk0IGggMTQuMjU3ODEyIHYgLTYuMzI4MTI1IGggLTYuMDM1MTU2IHYgLTYuOTUzMTI1IGggNS4xMzY3MTkgdiAtNi4wMTU2MjUgaCAtNS4xMzY3MTkgdiAtNS45OTYwOTQgaCA1LjQ4ODI4MSB2IC02LjMyODEyNSB6IgogICAgICAgaWQ9InBhdGgzIiAvPgogICAgPHBhdGgKICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTo0MHB4O2xpbmUtaGVpZ2h0OjEuMjU7Zm9udC1mYW1pbHk6SW1wYWN0Oy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246SW1wYWN0O2ZpbGw6I2ZmZmZmZjtmaWxsLW9wYWNpdHk6MTtzdHJva2U6bm9uZTtzdHJva2Utd2lkdGg6MC41ODY4ODI7c3Ryb2tlLWxpbmVjYXA6cm91bmQ7c3Ryb2tlLWxpbmVqb2luOnJvdW5kO3N0cm9rZS1vcGFjaXR5OjEiCiAgICAgICBkPSJtIDI4LjU1MjczNCwxOS44NDE0NjkgYyAtMS44MDk4OTQsMCAtMy4yMDk2MzYsMC4xNjI3NjEgLTQuMTk5MjE4LDAuNDg4MjgxIC0wLjk4OTU4MywwLjMxMjUgLTEuNzk2ODc2LDAuODI2ODI0IC0yLjQyMTg3NSwxLjU0Mjk2OSAtMC42MjUsMC43MTYxNDUgLTEuMDIyMTM2LDEuNjA4MDc0IC0xLjE5MTQwNywyLjY3NTc4MSAtMC4xNTYyNDksMS4wNTQ2ODcgLTAuMjM0Mzc1LDIuNjgyMjk0IC0wLjIzNDM3NSw0Ljg4MjgxMyAwLDIuODkwNjIyIC0wLjM1ODA3Myw0Ljc1MjYwNSAtMS4wNzQyMTgsNS41ODU5MzcgLTAuNzE2MTQ1LDAuODIwMzEyIC0xLjc4Mzg1NiwxLjIzNjk3OSAtMy4yMDMxMjUsMS4yNSB2IDQuNjg3NSBjIDEuNDQ1MzExLDAuMDUyMDggMi40MjgzODYsMC4zOTA2MjYgMi45NDkyMTgsMS4wMTU2MjUgMC41MjA4MzMsMC42MTE5NzkgMC44NzIzOTYsMS4yODkwNjMgMS4wNTQ2ODgsMi4wMzEyNSAwLjE4MjI5MSwwLjc0MjE4NyAwLjI3MzQzNywyLjQ0MTQwOSAwLjI3MzQzNyw1LjA5NzY1NiAwLDIuNDA4ODUyIDAuMjUzOTA3LDQuMTUzNjQ3IDAuNzYxNzE5LDUuMjM0Mzc1IDAuNTA3ODEyLDEuMDgwNzI4IDEuMzI4MTI2LDEuODU1NDcgMi40NjA5MzgsMi4zMjQyMTkgMS4xMzI4MTEsMC40ODE3NyAyLjc0MDg4NywwLjcyMjY1NiA0LjgyNDIxOCwwLjcyMjY1NiBoIDEuMDE1NjI1IHYgLTQuNjg3NSBjIC0xLjU4ODU0LDAgLTIuNjA0MTY3LC0wLjE0MzIyOSAtMy4wNDY4NzUsLTAuNDI5Njg3IC0wLjQ0MjcwOCwtMC4yNzM0MzcgLTAuNzIyNjU2LC0wLjY4MzU5NCAtMC44Mzk4NDMsLTEuMjMwNDY5IGwgLTAuMjkyOTY5LC01LjY4MzU5NCBjIC0wLjA5MTE1LC0xLjgzNTkzNSAtMC40MDM2NDYsLTMuMjQyMTg4IC0wLjkzNzUsLTQuMjE4NzUgLTAuNTIwODMzLC0wLjk3NjU2MSAtMS4zNjA2NzgsLTEuODE2NDA3IC0yLjUxOTUzMSwtMi41MTk1MzEgMS4yMjM5NTcsLTAuNzgxMjQ5IDIuMDU3MjkyLC0xLjU5NTA1MyAyLjUsLTIuNDQxNDA2IDAuNDU1NzI4LC0wLjg1OTM3NCAwLjc0MjE4NywtMS43NTc4MTQgMC44NTkzNzUsLTIuNjk1MzEzIDAuMTMwMjA4LC0wLjkzNzQ5OSAwLjIzNDM3NSwtMi45Njg3NTMgMC4zMTI1LC02LjA5Mzc1IDAuMDI2MDQsLTEuMTMyODExIDAuMjIxMzU0LC0xLjg5NDUzMSAwLjU4NTkzNywtMi4yODUxNTYgMC4zNzc2MDQsLTAuMzkwNjI0IDEuNTEwNDE5LC0wLjU4NTkzNyAzLjM5ODQzOCwtMC41ODU5MzcgdiAtNC42Njc5NjkgeiIKICAgICAgIGlkPSJ0ZXh0MSIgLz4KICA8L2c+Cjwvc3ZnPgo='

    class Enumerations {
        getInfo() {
            return {
                id: 'dogeiscutenumerations',
                name: 'Enumerations',
                color1: "#BE271A",
                menuIconURI: icon,
                blocks: [
                    {
                        func: "makeAnEnum",
                        blockType: Scratch.BlockType.BUTTON,
                        text: "Make an Enum"
                    },
                    {
                        func: "removeAnEnum",
                        blockType: Scratch.BlockType.BUTTON,
                        text: "Remove an Enum"
                    },
                    '---',
                    ...enumBlocks,
                    '---',
                    /*
                    ...enumDropdownBlocks,
                    '---',
                    */
                    {
                        opcode: "keyOfEnum",
                        text: "[KEY] of enum [ENUM]",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: hideEnumBlocks,
                        disableMonitor: true,
                        arguments: {
                            KEY: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'getKeysOf'
                            },
                            ENUM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'getEnums'
                            }
                        }
                    },
                    {
                        opcode: "enumLength",
                        text: "length of [ENUM]",
                        blockType: Scratch.BlockType.REPORTER,
                        hideFromPalette: hideEnumBlocks,
                        disableMonitor: true,
                        arguments: {
                            ENUM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'getEnums'
                            }
                        }
                    },
                    {
                        opcode: "enumContains",
                        text: "[ENUM] contains [KEY]?",
                        blockType: Scratch.BlockType.BOOLEAN,
                        hideFromPalette: hideEnumBlocks,
                        disableMonitor: true,
                        arguments: {
                            ENUM: {
                                type: Scratch.ArgumentType.STRING,
                                menu: 'getEnums'
                            },
                            KEY: {
                                type: Scratch.ArgumentType.STRING
                            }
                        }
                    }
                ],
                /*menus: enumMenus*/
                menus: {
                    getEnums: {
                        acceptReporters: false,
                        items: 'getEnums'
                    },
                    getKeysOf: {
                        acceptReporters: false,
                        items: 'getKeysOf'
                    }
                }
            }
        }

        serialize() {
            return { dogeiscutenumerations: {enumBlocks, enums} }
        }

        deserialize(data) {
            if (data.dogeiscutenumerations) {
            const { enumBlocks: savedEnumBlocks, enums: savedEnums } = data.dogeiscutenumerations;
            enumBlocks = savedEnumBlocks || [];
            enums = savedEnums || {};

            enumBlocks.forEach(block => {
                this.addBlock(block.opcode);
            });

            hideEnumBlocks = false;
            }
        }

        /* helper functions */

        addBlock(opcode) {
            Object.defineProperty(Enumerations.prototype, opcode, {
              value: function (_, util, blockInfo) {
                return this.thisEnum("", util, blockInfo);
              },
              writable: true,
              configurable: true,
            });
        }

        addDropdownBlock(opcode) {
            Object.defineProperty(Enumerations.prototype, opcode, {
              value: function (args, util, blockInfo) {
                return this.thisEnum(args, util, blockInfo);
              },
              writable: true,
              configurable: true,
            });
        }

        getPrevBlock(util) {
            const contain = util.thread.blockContainer;
            const block = contain.getBlock(util.thread.isCompiled ? util.thread.peekStack() : util.thread.peekStackFrame().op?.id);
            return contain.getBlock(block?.parent);
        }

        /* menus */

        getEnums() {
            return Object.keys(enums);
        }

        getKeysOf() {
            const args = getCurrentBlockArgs();
            const enumName = args.ENUM;
            if (enums[enumName]) {
                const keys = Object.keys(enums[enumName])
                if (keys.length != 0) {
                    return keys;
                }
            }
            return [""];
        }

        /* blocks */
        
        thisEnum(_, util, blockInfo) {
            const isInExtBlock = this.getPrevBlock(util)?.opcode.startsWith("dogeiscutenumerations_");
            const enumInfo = enums[blockInfo.text];
            return enumInfo ? isInExtBlock ? enumInfo : JSON.stringify(enumInfo) : "";
        }

        keyOfEnum(args) {
            const enumName = args.ENUM;
            const key = args.KEY;
            if (enums[enumName] && enums[enumName].hasOwnProperty(key)) {
                return enums[enumName][key];
            }
            return "";
        }

        enumLength(args) {
            const enumName = args.ENUM;
            if (enums[enumName]) {
            return Object.keys(enums[enumName]).length;
            }
            return 0;
        }

        enumContains(args) {
            const enumName = args.ENUM;
            const key = args.KEY;
            if (enums[enumName]) {
            return enums[enumName].hasOwnProperty(key);
            }
            return false;
        }

        /* buttons */

        makeAnEnum() {
            openModal("New enum name:", "New Enum", true, ((value, enumData) => {
                if (!value) return;
                if (Object.keys(enumData).length === 0) return;
                const newBlock = {
                    ...defaultEnumBlock,
                    opcode: "enum_" + value, text: value
                };
                this.addBlock(newBlock.opcode);

                const block = enumBlocks.find((i) => { return i.text == value });
                if (block) block.hideFromPalette = false;
                else enumBlocks.push(newBlock);
                
                hideEnumBlocks = false;

                vm.extensionManager.refreshBlocks("dogeiscutenumerations");
                this.serialize();
                enums[value] = enumData
            }))
        }

        removeAnEnum() {
            openModal("Remove enum named:", "Remove Enum", false, (value) => {
              const block = enumBlocks.find((i) => { return i.text == value });
              if (!block) return;
              block.hideFromPalette = true;
              delete enums[value];
              runtime.monitorBlocks.changeBlock({ id: `dogeiscutenumerations_enum_${value}`, element: "checkbox", value: false }, runtime);
      
              if (Object.keys(enums).length === 0) hideEnumBlocks = true;
              this.serialize();
              vm.extensionManager.refreshBlocks("dogeiscutenumerations");
            });
        }
    }

    Scratch.extensions.register(new Enumerations());
})(Scratch);