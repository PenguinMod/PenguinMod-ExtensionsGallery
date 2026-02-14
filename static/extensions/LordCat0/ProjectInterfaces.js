// Name: Project Interfaces
// ID: lordcatprojectinterfaces
// Description: Easily create more interactive projects!
// By: LordCat0
// Licence: MIT

(Scratch => {
    if (!Scratch.extensions.unsandboxed) {
        alert("This extension must run unsandboxed!");
        return;
    }
    const lookup = {
        Label: "span",
        Video: "video",
        Image: "img",
        Input: "input",
        Box: "div",
        Button: "button",
    };
    const extIcon =
        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iOTMxIiBoZWlnaHQ9IjkzMSIgdmlld0JveD0iMCAwIDkzMSA5MzEiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjQ2NS41IiBjeT0iNDY1LjUiIHI9IjQ0MyIgZmlsbD0iIzcwN0VGRiIgc3Ryb2tlPSIjNjA2REU0IiBzdHJva2Utd2lkdGg9IjQ1Ii8+CjxwYXRoIGQ9Ik0zMSAzOTZDMzEgMzgyLjE5MyA0Mi4xOTI5IDM3MSA1NiAzNzFINTEyQzUyNS44MDcgMzcxIDUzNyAzODIuMTkzIDUzNyAzOTZWNTM2QzUzNyA1NDkuODA3IDUyNS44MDcgNTYxIDUxMiA1NjFINTZDNDIuMTkyOSA1NjEgMzEgNTQ5LjgwNyAzMSA1MzZWMzk2WiIgZmlsbD0iIzYwNkRFNCIvPgo8cGF0aCBkPSJNMjYwIDY3N0MyNjAgNjYzLjE5MyAyNzEuMTkzIDY1MiAyODUgNjUySDgxOS45NTJDODM5LjE0IDY1MiA4NTEuMTc1IDY3Mi43MjMgODQxLjY2NiA2ODkuMzlMNzczLjE5NSA4MDkuMzlDNzY4Ljc0NiA4MTcuMTg3IDc2MC40NTggODIyIDc1MS40ODEgODIySDI4NUMyNzEuMTkzIDgyMiAyNjAgODEwLjgwNyAyNjAgNzk3VjY3N1oiIGZpbGw9IiM2MDZERTQiLz4KPHBhdGggZD0iTTI4MSAyNzVDMjgxIDI4OC44MDcgMjkyLjE5MyAzMDAgMzA2IDMwMEg4NDAuOTUyQzg2MC4xNCAzMDAgODcyLjE3NSAyNzkuMjc3IDg2Mi42NjYgMjYyLjYxTDc5NC4xOTUgMTQyLjYxQzc4OS43NDYgMTM0LjgxMyA3ODEuNDU4IDEzMCA3NzIuNDgxIDEzMEgzMDZDMjkyLjE5MyAxMzAgMjgxIDE0MS4xOTMgMjgxIDE1NVYyNzVaIiBmaWxsPSIjNjA2REU0Ii8+CjxyZWN0IHg9IjE4NyIgeT0iMjAyIiB3aWR0aD0iNTQ5IiBoZWlnaHQ9IjI5NSIgcng9IjQ2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQyIi8+CjxyZWN0IHg9IjE4NyIgeT0iNTY2IiB3aWR0aD0iMTc5IiBoZWlnaHQ9IjE2NCIgcng9IjQ2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQyIi8+CjxyZWN0IHg9IjQzMSIgeT0iNTY2IiB3aWR0aD0iMzE0IiBoZWlnaHQ9IjE2NCIgcng9IjQ2IiBzdHJva2U9IndoaXRlIiBzdHJva2Utd2lkdGg9IjQyIi8+Cjwvc3ZnPgo=";
    const textIcon =
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cGF0aCBkPSJNOCA0VjIwTTE3IDEyVjIwTTYgMjBIMTBNMTUgMjBIMTlNMTMgN1Y0SDNWN00yMSAxNFYxMkgxM1YxNCIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPC9zdmc+";
    const imageIcon =
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8ZyBpZD0iTWVkaWEgLyBJbWFnZV8wMSI+DQo8cGF0aCBpZD0iVmVjdG9yIiBkPSJNMy4wMDAwNSAxNy4wMDAxQzMgMTYuOTM1NSAzIDE2Ljg2ODkgMyAxNi44MDAyVjcuMjAwMkMzIDYuMDgwMDkgMyA1LjUxOTYyIDMuMjE3OTkgNS4wOTE4QzMuNDA5NzMgNC43MTU0NyAzLjcxNTQ3IDQuNDA5NzMgNC4wOTE4IDQuMjE3OTlDNC41MTk2MiA0IDUuMDgwMDkgNCA2LjIwMDIgNEgxNy44MDAyQzE4LjkyMDMgNCAxOS40ODAxIDQgMTkuOTA3OSA0LjIxNzk5QzIwLjI4NDIgNC40MDk3MyAyMC41OTA1IDQuNzE1NDcgMjAuNzgyMiA1LjA5MThDMjEgNS41MTkyIDIxIDYuMDc4OTkgMjEgNy4xOTY5MVYxNi44MDMxQzIxIDE3LjI4ODEgMjEgMTcuNjY3OSAyMC45ODIyIDE3Ljk3NzRNMy4wMDAwNSAxNy4wMDAxQzMuMDAwODIgMTcuOTg4NCAzLjAxMzM3IDE4LjUwNTggMy4yMTc5OSAxOC45MDc0QzMuNDA5NzMgMTkuMjgzNyAzLjcxNTQ3IDE5LjU5MDUgNC4wOTE4IDE5Ljc4MjJDNC41MTkyIDIwIDUuMDc4OTkgMjAgNi4xOTY5MSAyMEgxNy44MDM2QzE4LjkyMTUgMjAgMTkuNDgwNSAyMCAxOS45MDc5IDE5Ljc4MjJDMjAuMjg0MiAxOS41OTA1IDIwLjU5MDUgMTkuMjgzNyAyMC43ODIyIDE4LjkwNzRDMjAuOTA1NSAxOC42NjU0IDIwLjk1OSAxOC4zODEzIDIwLjk4MjIgMTcuOTc3NE0zLjAwMDA1IDE3LjAwMDFMNy43Njc5OCAxMS40Mzc1TDcuNzY5MzkgMTEuNDM2QzguMTkyMjcgMTAuOTQyNiA4LjQwNDA2IDEwLjY5NTUgOC42NTUyNyAxMC42MDY0QzguODc1OTQgMTAuNTI4MiA5LjExNjg2IDEwLjUzIDkuMzM2NDMgMTAuNjExM0M5LjU4NjY0IDEwLjcwNCA5Ljc5NTA2IDEwLjk1MzkgMTAuMjExOSAxMS40NTQxTDEyLjg4MzEgMTQuNjU5NUMxMy4yNjkgMTUuMTIyNiAxMy40NjMgMTUuMzU1NCAxMy42OTg2IDE1LjQ0ODlDMTMuOTA2NSAxNS41MzEzIDE0LjEzNTcgMTUuNTQwNiAxNC4zNTAxIDE1LjQ3NzNDMTQuNTk0MiAxNS40MDUzIDE0LjgwOTEgMTUuMTkwNCAxNS4yMzg4IDE0Ljc2MDdMMTUuNzM1OCAxNC4yNjM3QzE2LjE3MzMgMTMuODI2MiAxNi4zOTIxIDEzLjYwNzYgMTYuNjM5NyAxMy41MzYxQzE2Ljg1NzEgMTMuNDczNCAxNy4wODk2IDEzLjQ4NjkgMTcuMjk4OCAxMy41NzMyQzE3LjUzNyAxMy42NzE2IDE3LjczMDIgMTMuOTEyNCAxOC4xMTY3IDE0LjM5NTVMMjAuOTgyMiAxNy45Nzc0TTIwLjk4MjIgMTcuOTc3NEwyMSAxNy45OTk2TTE1IDEwQzE0LjQ0NzcgMTAgMTQgOS41NTIyOCAxNCA5QzE0IDguNDQ3NzIgMTQuNDQ3NyA4IDE1IDhDMTUuNTUyMyA4IDE2IDguNDQ3NzIgMTYgOUMxNiA5LjU1MjI4IDE1LjU1MjMgMTAgMTUgMTBaIiBzdHJva2U9IiNmZmZmZmYiIHN0cm9rZS13aWR0aD0iMiIgc3Ryb2tlLWxpbmVjYXA9InJvdW5kIiBzdHJva2UtbGluZWpvaW49InJvdW5kIi8+DQo8L2c+DQo8L3N2Zz4=";
    const videoIcon =
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjxzdmcgd2lkdGg9IjgwMHB4IiBoZWlnaHQ9IjgwMHB4IiB2aWV3Qm94PSIwIDAgMjQgMjQiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+DQo8cGF0aCBkPSJNMTYgMTBMMTguNTc2OCA4LjQ1MzkyQzE5LjM2OTkgNy45NzgwMyAxOS43NjY1IDcuNzQwMDkgMjAuMDkyOCA3Ljc3MDUxQzIwLjM3NzMgNy43OTcwMyAyMC42MzY5IDcuOTQ0IDIwLjgwNiA4LjE3NDMzQzIxIDguNDM4NDggMjEgOC45MDA5NSAyMSA5LjgyNTlWMTQuMTc0MUMyMSAxNS4wOTkgMjEgMTUuNTYxNSAyMC44MDYgMTUuODI1N0MyMC42MzY5IDE2LjA1NiAyMC4zNzczIDE2LjIwMyAyMC4wOTI4IDE2LjIyOTVDMTkuNzY2NSAxNi4yNTk5IDE5LjM2OTkgMTYuMDIyIDE4LjU3NjggMTUuNTQ2MUwxNiAxNE02LjIgMThIMTIuOEMxMy45MjAxIDE4IDE0LjQ4MDIgMTggMTQuOTA4IDE3Ljc4MkMxNS4yODQzIDE3LjU5MDMgMTUuNTkwMyAxNy4yODQzIDE1Ljc4MiAxNi45MDhDMTYgMTYuNDgwMiAxNiAxNS45MjAxIDE2IDE0LjhWOS4yQzE2IDguMDc5OSAxNiA3LjUxOTg0IDE1Ljc4MiA3LjA5MjAyQzE1LjU5MDMgNi43MTU2OSAxNS4yODQzIDYuNDA5NzMgMTQuOTA4IDYuMjE3OTlDMTQuNDgwMiA2IDEzLjkyMDEgNiAxMi44IDZINi4yQzUuMDc5OSA2IDQuNTE5ODQgNiA0LjA5MjAyIDYuMjE3OTlDMy43MTU2OSA2LjQwOTczIDMuNDA5NzMgNi43MTU2OSAzLjIxNzk5IDcuMDkyMDJDMyA3LjUxOTg0IDMgOC4wNzk4OSAzIDkuMlYxNC44QzMgMTUuOTIwMSAzIDE2LjQ4MDIgMy4yMTc5OSAxNi45MDhDMy40MDk3MyAxNy4yODQzIDMuNzE1NjkgMTcuNTkwMyA0LjA5MjAyIDE3Ljc4MkM0LjUxOTg0IDE4IDUuMDc5ODkgMTggNi4yIDE4WiIgc3Ryb2tlPSIjZmZmZmZmIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIvPg0KPC9zdmc+";
    const buttonicon =
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48IS0tIFVwbG9hZGVkIHRvOiBTVkcgUmVwbywgd3d3LnN2Z3JlcG8uY29tLCBHZW5lcmF0b3I6IFNWRyBSZXBvIE1peGVyIFRvb2xzIC0tPgo8c3ZnIGZpbGw9IiNmZmZmZmYiIHdpZHRoPSI4MDBweCIgaGVpZ2h0PSI4MDBweCIgdmlld0JveD0iMCAwIDUyIDUyIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxwYXRoIGQ9Ik0zMS45OTgxNjg5LDExLjk5OTUxMDQgQzMzLjQ2NTk0MjQsMTEuOTk4NTExNyAzNC45OTgyOTEsMTMuMTMyOCAzNC45OTgyOTEsMTYuMTM0OCBMMzQuOTk4MjkxLDE2LjEzNDggTDM0Ljk5ODI5MSwyNiBDMzQuOTk4MjkxLDI3LjUxMzQyNzcgMzYuMzc3OTA1MywyOC4xMTE0MDE0IDM2Ljk3NzkwNTMsMjguMzExNDAxNCBMMzYuOTc3OTA1MywyOC4zMTE0MDE0IEw0My44LDMwLjggQzQ2LjcsMzEuOSA0OC41LDM1IDQ3LjcsMzguMiBMNDcuNywzOC4yIEw0NC41LDQ4LjU5OTUgQzQ0LjMsNDkuMzk5NSA0My42LDQ5Ljk5OTUgNDIuNyw0OS45OTk1IEw0Mi43LDQ5Ljk5OTUgTDI2LjYsNDkuOTk5NSBDMjUuOCw0OS45OTk1IDI1LjEsNDkuNTk5NSAyNC44LDQ4Ljg5OTUgQzIwLjkzMTg2ODUsMzkuOTE5MDU1MyAxOC43ODY5ODczLDM0LjkzOTU3NTIgMTguMzY1MzU2NCwzMy45NjEwNTk2IEMxNy45NDM3MjU2LDMyLjk4MjU0MzkgMTguMjIxOTQwMSwzMi4xOTU1MjQxIDE5LjIsMzEuNiBDMjEsMzAuMyAyMy43LDMxLjYzOTU1MDggMjQuOCwzMy41Mzk1NTA4IEwyNC44LDMzLjUzOTU1MDggTDI2LjQxNTc3MTUsMzUuNzQzMTgyOCBDMjcuMDUxNTEzNywzNi45NTA4IDI5LDM2Ljk1MDggMjksMzUuMTUwOCBMMjksMzUuMTUwOCBMMjksMTYuMTM0OCBDMjksMTMuMTMyOCAzMC41MzAzOTU1LDEyLjAwMDUxMTcgMzEuOTk4MTY4OSwxMS45OTk1MTA0IFogTTQ2LDIgQzQ4LjIsMiA1MCwzLjggNTAsNiBMNTAsNiBMNTAsMjEgQzUwLDIyLjg4MjMyMyA0OC4xODEzMzg5LDI1LjAwMzAzNDggNDYsMjUgTDQ2LDI1IEw0MC4wMTA0MzcsMjUgQzM5LDI1IDM5LDI0LjE4ODExNTcgMzksMjQuMDU5MDgyIEwzOSwxNS41IEMzOSwxMS42NTQ3MDE4IDM3LjAxODc5ODgsOCAzMiw4IEMyNi45ODEyMDEyLDggMjUsMTEuMTg3OTc4MyAyNSwxNS41IEwyNSwxNS41IEwyNSwyNC4wNTkwODIgQzI1LDI0LjQwNzgwMDcgMjQuNzM1MjI5NSwyNSAyMy45ODc3OTMsMjUgTDIzLjk4Nzc5MywyNSBMNiwyNSBDMy44LDI1IDIsMjMuMiAyLDIxIEwyLDIxIEwyLDYgQzIsMy44IDMuOCwyIDYsMiBMNiwyIFoiIC8+Cjwvc3ZnPg==";
    const inputIcon =
        "data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPHN2ZyBmaWxsPSIjZmZmZmZmIiBoZWlnaHQ9IjgwMHB4IiB3aWR0aD0iODAwcHgiIHZlcnNpb249IjEuMSIgaWQ9Ikljb25zIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiANCgkgdmlld0JveD0iMCAwIDMyIDMyIiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwYXRoIGQ9Ik0yOSwxMUgxNVY5aDFjMC42LDAsMS0wLjQsMS0xcy0wLjQtMS0xLTFoLTRjLTAuNiwwLTEsMC40LTEsMXMwLjQsMSwxLDFoMXYySDNjLTAuNiwwLTEsMC40LTEsMXYxMGMwLDAuNiwwLjQsMSwxLDFoMTB2Mg0KCWgtMWMtMC42LDAtMSwwLjQtMSwxczAuNCwxLDEsMWg0YzAuNiwwLDEtMC40LDEtMXMtMC40LTEtMS0xaC0xdi0yaDE0YzAuNiwwLDEtMC40LDEtMVYxMkMzMCwxMS40LDI5LjYsMTEsMjksMTF6IE0xMCwxNkg5djMNCgljMCwwLjYtMC40LDEtMSwxcy0xLTAuNC0xLTF2LTNINmMtMC42LDAtMS0wLjQtMS0xczAuNC0xLDEtMWg0YzAuNiwwLDEsMC40LDEsMVMxMC42LDE2LDEwLDE2eiBNMTUsMjFjMCwwLjUtMC41LDEtMSwxcy0xLTAuNS0xLTENCgl2LThjMC0wLjUsMC41LTEsMS0xczEsMC41LDEsMVYyMXoiLz4NCjwvc3ZnPg==";
    const vm = Scratch.vm;
    const elementbox = document.createElement("div");
    elementbox.classList.add("LordCatInterfaces");
    vm.renderer.addOverlay(elementbox, "scale");
    let elements = {};
    let metadata = {};
    let inputhold = {};
    let lastValues = {};
    const css = document.createElement("style");
    css.textContent = `
        .LordCatInterfaces svg{
            vertical-align: top;
        }
        .LordCatInterfaces[hidden]{
            display: none
        }
    `;
    css.classList.add("LordCatInterfaces-Style");
    document.head.append(css);

    const textDecoder = new TextDecoder("utf-8");
    const domParser = new DOMParser();

    const datauri = (file) => {
        return new Promise((resolve, reject) => {
            if (!(file instanceof File)) resolve("");
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = () => reject(reader.error);
        });
    };

    const datauriFromCostume = (costume, target) => {
        let costumeIndex = target.getCostumeIndexByName(costume);
        if (costumeIndex === -1) {
            switch (costume) {
                case "next costume":
                    costumeIndex =
                        target.currentCostume ===
                        target.sprite.costumes_.length - 1
                            ? 0
                            : target.currentCostume + 1;
                    break;
                case "previous costume":
                    costumeIndex =
                        target.currentCostume === 0
                            ? target.sprite.costumes_.length - 1
                            : target.currentCostume - 1;
                    break;
                case "random costume":
                    costumeIndex = Math.floor(
                        Math.random() * target.sprite.costumes_.length,
                    );
                    break;
            }
        }
        return target.sprite.costumes[costumeIndex].asset.encodeDataURI();
    };
    
    const replaceElement = (oldElement, newElement, id) => {
        newElement.dataset.id = id;
        newElement.setAttribute("style", oldElement.getAttribute("style"));
        newElement.addEventListener(
            "mouseover",
            () => (metadata[id].hovered = true),
        );
        newElement.addEventListener(
            "mouseout",
            () => (metadata[id].hovered = false),
        );
        newElement.addEventListener(
            "click",
            () => (metadata[id].clicked = true),
        );
        if (
            oldElement.tagName === "INPUT" ||
            oldElement.tagName === "TEXTAREA"
        ) {
            newElement.value = oldElement.value;
            newElement.addEventListener(
                "input",
                () => (metadata[id].inputdirty = true),
            );
        }
        oldElement.replaceWith(newElement);
        return newElement;
    };

    let fonts = [];
    document.fonts.ready.then(() => {
        fonts = Array.from(document.fonts.values()).map(f => f.family);
    });

    class ProjectInterfaces {
        getInfo () {
            return {
                id: "lordcatprojectinterfaces",
                name: "Project interfaces",
                color1: "#707eff",
                color2: "#6675fa",
                docsURI:
                    "https://extensions.penguinmod.com/docs/ProjectInterfaces",
                menuIconURI: extIcon,
                blocks: [
                    {
                        opcode: "ClearAll",
                        text: "clear all elements",
                        blockType: Scratch.BlockType.COMMAND,
                    },
                    {
                        opcode: "Create",
                        text: "create [type] element with id [id]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            type: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "ElementType",
                            },
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                    },
                    {
                        opcode: "Delete",
                        text: "delete element with id [id]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                    },
                    {
                        opcode: "Visibility",
                        text: "[menu] element with id [id]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            menu: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "Visibility",
                            },
                        },
                    },
                    {
                        opcode: "ElementVisibility",
                        text: "element with id [id] is [status]",
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            status: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "VisibilityStatus",
                            },
                        },
                    },
                    {
                        opcode: "AllElements",
                        text: "All elements",
                        blockType: Scratch.BlockType.REPORTER,
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Styling" },
                    {
                        opcode: "Position",
                        text: "set position of id [id] to x [x] y [y]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            x: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                            y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0,
                            },
                        },
                    },
                    {
                        opcode: "Direction",
                        text: "set direction of id [id] to [dir]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            dir: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 90,
                            },
                        },
                    },
                    {
                        opcode: "Scale",
                        text: "set scale of id [id] to width [width]px height [height]px",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            width: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                            height: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                        },
                    },
                    {
                        opcode: "Layer",
                        text: "set layer of id [id] to [layer]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            layer: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1,
                            },
                        },
                    },
                    {
                        opcode: "Cursor",
                        text: "set hover cursor of id [id] to [cursor]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            cursor: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "Cursors",
                            },
                        },
                    },
                    {
                        opcode: "Color",
                        text: "set color of id [id] to [color]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            color: { type: Scratch.ArgumentType.COLOR },
                        },
                    },
                    {
                        opcode: "BackgroundColor",
                        text: "set background color of id [id] to [color]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            color: { type: Scratch.ArgumentType.COLOR },
                        },
                    },
                    {
                        opcode: "CustomCSS",
                        text: "set custom css of id [id] to [css]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            css: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "background-color: red",
                            },
                        },
                    },
                    {
                        opcode: "HtmlElement",
                        text: "create html element [htmltag] with id [id]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            htmltag: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "h1",
                            },
                        },
                    },
                    "---",
                    {
                        opcode: "WhenClicked",
                        text: "when id [id] is clicked",
                        blockType: Scratch.BlockType.HAT,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                    },
                    {
                        opcode: "Attribute",
                        text: "[attr] of id [id]",
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            attr: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "Attributes",
                            },
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                    },
                    {
                        opcode: "IsHovered",
                        text: "[id] hovered?",
                        blockType: Scratch.BlockType.BOOLEAN,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Labels",
                    },
                    {
                        opcode: "LabelText",
                        text: "set label text with id [id] to [text]",
                        arguments: {
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello world!",
                            },
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                        blockIconURI: textIcon,
                    },
                    {
                        opcode: "LabelAlign",
                        text: "set label alignment with id [id] to [align]",
                        arguments: {
                            align: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "Alignment",
                            },
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                        blockIconURI: textIcon,
                    },
                    {
                        opcode: "LabelFontSize",
                        text: "set label font size with id [id] to [size]px",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            size: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 40,
                            },
                        },
                        blockIconURI: textIcon,
                    },
                    {
                        opcode: "LabelFont",
                        text: "set label font with id [id] to [font]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            font: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "Fonts",
                            },
                        },
                        blockIconURI: textIcon,
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Images" },
                    {
                        opcode: "ImageUrl",
                        text: "set image with id [id] to url [url]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue:
                                    "https://extensions.turbowarp.org/dango.png",
                            },
                        },
                        blockIconURI: imageIcon,
                    },
                    {
                        opcode: "ImageCostume",
                        text: "set image with id [id] to costume [costume]",
                        blockType: Scratch.BlockType.COMMAND,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            costume: { type: Scratch.ArgumentType.COSTUME },
                        },
                        blockIconURI: imageIcon,
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Videos" },
                    {
                        opcode: "VideoSource",
                        text: "set video with id [id] to url [url]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            url: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue:
                                    "https://extensions.turbowarp.org/dango.png",
                            },
                        },
                        blockIconURI: videoIcon,
                    },
                    {
                        opcode: "VideoControl",
                        text: "[control] video with id [id]",
                        arguments: {
                            control: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "VideoControls",
                            },
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                        blockIconURI: videoIcon,
                    },
                    {
                        opcode: "VideoVolume",
                        text: "set volume of video [id] to [volume]%",
                        arguments: {
                            volume: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 100,
                            },
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                        blockIconURI: videoIcon,
                    },
                    {
                        opcode: "VideoLoop",
                        text: "set loop of video [id] to [toggle]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            toggle: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "EnableDisable",
                            },
                        },
                        blockIconURI: videoIcon,
                    },
                    {
                        opcode: "VideoHtmlControls",
                        text: "set video controls of id [id] to [toggle]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            toggle: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "EnableDisable",
                            },
                        },
                        blockIconURI: videoIcon,
                    },
                    { blockType: Scratch.BlockType.LABEL, text: "Inputs" },
                    {
                        opcode: "InputType",
                        text: "set input type of id [id] to [input]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            input: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "Inputs",
                            },
                        },
                        blockIconURI: inputIcon,
                    },
                    {
                        opcode: "InputAccent",
                        text: "set input accent color of id [id] to [color]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            color: { type: Scratch.ArgumentType.COLOR },
                        },
                        blockIconURI: inputIcon,
                    },
                    {
                        opcode: "InputPlaceholder",
                        text: "set placeholder of id [id] to [placeholder]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            placeholder: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello world!",
                            },
                        },
                        blockIconURI: inputIcon,
                    },
                    {
                        opcode: "InputSetValue",
                        text: "set value of id [id] to [value]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            value: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello world!",
                            },
                        },
                        blockIconURI: inputIcon,
                    },
                    {
                        opcode: "InputValue",
                        text: "value of input with id [id]",
                        blockType: Scratch.BlockType.REPORTER,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                        blockIconURI: inputIcon,
                    },
                    {
                        opcode: "WhenInputChanged",
                        text: "when input with id [id] changed",
                        blockType: Scratch.BlockType.HAT,
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                        },
                        blockIconURI: inputIcon,
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Buttons",
                    },
                    {
                        opcode: "ButtonText",
                        text: "set text of button [id] to [text]",
                        arguments: {
                            id: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "My element",
                            },
                            text: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "Hello world!",
                            },
                        },
                        blockIconURI: buttonicon,
                    },
                ],
                menus: {
                    ElementType: {
                        acceptReporters: false,
                        items: [
                            "Label",
                            "Image",
                            "Video",
                            "Input",
                            "Box",
                            "Button",
                        ],
                    },
                    Inputs: {
                        acceptReporters: false,
                        items: [
                            "Text",
                            "Text Area",
                            "Number",
                            "Color",
                            "Checkbox",
                            "File",
                            "Email",
                            "Range",
                            "Image",
                        ],
                    },
                    Cursors: {
                        acceptReporters: false,
                        items: [
                            "default",
                            "pointer",
                            "text",
                            "wait",
                            "move",
                            "not-allowed",
                            "crosshair",
                            "help",
                            "progress",
                            "grab",
                            "grabbing",
                        ],
                    },
                    Fonts: { acceptReporters: true, items: fonts },
                    Attributes: {
                        acceptReporters: false,
                        items: [
                            "X",
                            "Y",
                            "Direction",
                            "Width",
                            "Height",
                            "Cursor",
                            "Source",
                        ],
                    },
                    VideoControls: {
                        acceptReporters: false,
                        items: ["Play", "Stop", "Pause"],
                    },
                    EnableDisable: {
                        acceptReporters: false,
                        items: ["Enabled", "Disabled"],
                    },
                    Alignment: {
                        acceptReporters: false,
                        items: ["Left", "Right", "Center"],
                    },
                    Visibility: {
                        acceptReporters: false,
                        items: ["Show", "Hide"],
                    },
                    VisibilityStatus: {
                        acceptReporters: false,
                        items: ["Shown", "Hidden"],
                    },
                },
            };
        }
        FixPos (elementid) {
            setTimeout(() => {
                if (!elements[elementid]) {
                    return;
                }
                this.Position({
                    id: elementid,
                    x: metadata[elementid].x,
                    y: metadata[elementid].y,
                });
            }, 1); // Timeout needed because for some reason it wont run otherwise..
        }
        FixTransform (elementid) {
            setTimeout(() => {
                elements[elementid].style.transform =
                    elements[elementid].tagName === "SVG"
                        ? `translate(-50%, -50%) rotate(${metadata[elementid] - 90}deg)`
                        : `rotate(${metadata[elementid] - 90}deg)`;
            }, 1); // Timeout needed because for some reason it wont run otherwise..
        }
        ClearAll () {
            Object.entries(elements).forEach(([id, element]) => {
                if (
                    element.tagName === "INPUT" ||
                    element.tagName === "TEXTAREA"
                )
                    inputhold[id] =
                        element.type === "checkbox"
                            ? element.checked
                            : element.value;
            });
            elements = {};
            metadata = {};
            elementbox.innerHTML = "";
        }
        Create (args) {
            if (elements[args.id]) return;
            const element = document.createElement(lookup[args.type]);
            if (lookup[args.type] === "button") {
                element.append(document.createElement("span"));
                element.append(document.createElement("img"));
            }
            const boundingRect = element.getBoundingClientRect();
            element.dataset.id = args.id;
            element.style.position = "absolute";
            element.style.pointerEvents = "auto";
            element.style.userSelect = "none";
            element.style.color = "black";
            if (args.type === "Image") {
                element.draggable = false;
            }
            elements[args.id] = element;
            elementbox.append(element);
            metadata[args.id] = {
                x: 0,
                y: 0,
                direction: 90,
                width: boundingRect.width,
                height: boundingRect.height,
                hovered: false,
                clicked: false,
            };
            this.FixPos(args.id);
            if (args.type === "Input") {
                metadata[args.id].inputdirty = false;
                element.addEventListener(
                    "input",
                    () => (metadata[args.id].inputdirty = true),
                );
            }
            element.addEventListener(
                "mouseover",
                () => (metadata[args.id].hovered = true),
            );
            element.addEventListener(
                "mouseout",
                () => (metadata[args.id].hovered = false),
            );
            element.addEventListener(
                "click",
                () => (metadata[args.id].clicked = true),
            );
        }
        Position (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            if (element.tagName === "svg") {
                const bbox = element.getBBox();
                element.style.left = `${vm.runtime.stageWidth / 2 + args.x - bbox.width / 2}px`;
                element.style.top = `${vm.runtime.stageHeight / 2 - args.y - bbox.height / 2}px`;
            } else {
                element.style.left = `${vm.runtime.stageWidth / 2 + args.x - element.offsetWidth / 2}px`;
                element.style.top = `${vm.runtime.stageHeight / 2 - args.y - element.offsetHeight / 2}px`;
            }
            metadata[args.id].x = args.x;
            metadata[args.id].y = args.y;
        }
        Direction (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            metadata[args.id].direction = args.dir;
            element.style.transform = `rotate(${args.dir - 90}deg)`;
        }
        Scale (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            element.style.width = `${args.width}px`;
            element.style.height = `${args.height}px`;
            metadata[args.id].width = args.width + "px";
            metadata[args.id].height = args.height + "px";
            element.style.objectFit = "fill";
            this.FixPos(args.id);
        }
        Layer (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            element.style.zIndex = args.layer;
        }
        Cursor (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            element.style.cursor = args.cursor;
        }
        Color (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            if (element.tagName === "DIV") {
                // If the element is a box, set it's background color instead
                // This probably avoids some confusion with users
                element.style.backgroundColor = args.color;
            } else {
                element.style.color = args.color;
            }
        }
        BackgroundColor (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            element.style.backgroundColor = args.color;
        }
        CustomCSS (args) {
            if (!elements[args.id]) {
                return;
            }
            let style = document.getElementById(`LCGuiStyle_${args.id}`);
            let lines = args.css.split(";");
            if (!style) {
                style = document.createElement("style");
                style.id = `LCGuiStyle_${args.id}`;
                document.head.append(style);
            }
            style.textContent = `[data-id='${args.id}']{\n${lines.join(" !important;\n") + " !important"}\n}`;
        }
        HtmlElement (args) {
            if (elements[args.id]) return;
            const element = document.createElement(args.htmltag.toLowerCase());
            const boundingRect = element.getBoundingClientRect();
            element.dataset.id = args.id;
            element.style.position = "absolute";
            element.style.pointerEvents = "auto";
            element.style.userSelect = "none";
            element.style.color = "black";
            elements[args.id] = element;
            elementbox.append(element);
            metadata[args.id] = {
                x: 0,
                y: 0,
                direction: 90,
                width: boundingRect.width,
                height: boundingRect.height,
                hovered: false,
                clicked: false,
            };
            this.FixPos(args.id);
            element.addEventListener(
                "mouseover",
                () => (metadata[args.id].hovered = true),
            );
            element.addEventListener(
                "mouseout",
                () => (metadata[args.id].hovered = false),
            );
            element.addEventListener(
                "click",
                () => (metadata[args.id].clicked = true),
            );
        }
        Attribute (args) {
            const element = elements[args.id];
            if (!element) return;
            const meta = metadata[args.id];
            switch (args.attr) {
                case "Cursor":
                    return element.style.cursor === ""
                        ? "default"
                        : element.style.cursor;
                case "Source":
                    if (
                        element.tagName != "IMG" &&
                        element.tagName != "VIDEO" &&
                        element.tagName != "svg"
                    )
                        return;
                    return element.tagName === "svg"
                        ? element.outerHTML
                        : element.src;
                case "Width":
                    if (element.tagName === 'SVG') {
                        return element.getBBox().width;
                    } else {
                        return element.getBoundingClientRect().width;
                    }
                case "Height":
                    if (element.tagName === 'SVG') {
                        return element.getBBox().height;
                    } else {
                        return element.getBoundingClientRect().height;
                    }
                default:
                    return meta[args.attr.toLowerCase()];
            }
        }
        IsHovered (args) {
            if (!elements[args.id]) {
                return "";
            }
            return metadata[args.id].hovered;
        }
        Delete (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            if (element.tagName === "INPUT" || element.tagName === "TEXTAREA")
                inputhold[args.id] =
                    element.type === "checkbox"
                        ? element.checked
                        : element.value;
            if (document.getElementById(`LCGuiStyle_${args.id}`))
                document.getElementById(`LCGuiStyle_${args.id}`).remove();
            element.remove();
            delete elements[args.id];
            delete metadata[args.id];
        }
        Visibility (args) {
            const element = elements[args.id];
            if (!element) {
                return;
            }
            element.hidden = args.menu === "Hide";
        }
        ElementVisibility (args) {
            const element = elements[args.id];
            if (!element) return;
            return args.status === "Shown"
                ? !element.hidden
                : !!element.hidden;
        }
        AllElements () {
            return JSON.stringify(Object.keys(elements));
        }
        LabelText (args) {
            const element = elements[args.id];
            if (!element || element.tagName != "SPAN") {
                return;
            }
            element.textContent = args.text;
            this.FixPos(args.id);
        }
        LabelAlign (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "SPAN") {
                return;
            }
            element.style.textAlign = args.align.toLowerCase();
            this.FixPos(args.id);
        }
        LabelFontSize (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "SPAN") {
                return;
            }
            element.style.fontSize = `${args.size}px`;
            this.FixPos(args.id);
        }
        LabelFont (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "SPAN") {
                return;
            }
            element.style.fontFamily = args.font;
            this.FixPos(args.id);
        }
        ImageUrl (args) {
            const element = elements[args.id];
            if (
                !element ||
                (element.tagName !== "IMG" &&
                    element.tagName !== "svg")
            ) return;

            if (element.tagName === "svg") {
                elements[args.id] = replaceElement(
                    elements[args.id],
                    document.createElement("img"),
                    args.id,
                );
            }
            elements[args.id].src = args.url;
            this.FixPos(args.id);
        }
        ImageCostume (args, util) {
            const element = elements[args.id];
            if (
                !element ||
                (element.tagName != "IMG" &&
                    element.tagName != "svg")
            ) return;

            const costume = util.target.getCostumes().find(c => c.name === args.costume);
            if (!costume) return;

            if (costume.dataFormat === "svg") {
                elements[args.id] = replaceElement(
                    element,
                    domParser.parseFromString(
                        textDecoder.decode(costume.asset.data),
                        "image/svg+xml",
                    ).documentElement,
                    args.id,
                );
            } else {
                if (element.tagName === "svg") {
                    elements[args.id] = replaceElement(
                        element,
                        document.createElement("img"),
                        args.id,
                    );
                }
                elements[args.id].src = datauriFromCostume(
                    args.costume,
                    util.target,
                );
            }
            this.FixPos(args.id);
            this.FixTransform(args.id);
        }
        InputType (args) {
            const element = elements[args.id];
            if (
                !element ||
                (element.tagName != "INPUT" &&
                    element.tagName != "TEXTAREA")
            ) return;

            if (args.input === "Text Area") {
                elements[args.id] = replaceElement(
                    element,
                    document.createElement("textarea"),
                    args.id,
                );
                elements[args.id].style.resize = "none";
            } else {
                if (element.tagName == "TEXTAREA") {
                    elements[args.id] = replaceElement(
                        element,
                        document.createElement("input"),
                        args.id,
                    );
                }
                elements[args.id].type = args.input;
                if (args.input == "File") {
                    elements[args.id].value = null;
                }
            }
            this.FixPos(args.id);
        }
        InputAccent (args) {
            const element = elements[args.id];
            if (
                !element ||
                (element.tagName != "INPUT" &&
                    element.tagName != "TEXTAREA")
            ) return;
            element.style.accentColor = args.color;
        }
        InputPlaceholder (args) {
            const element = elements[args.id];
            if (
                !element ||
                (element.tagName !== "INPUT" &&
                    element.tagName !== "TEXTAREA")
            ) return;
            element.setAttribute("placeholder", args.placeholder);
        }
        InputSetValue (args) {
            const element = elements[args.id];
            if (
                !element ||
                (element.tagName !== "INPUT" &&
                    element.tagName !== "TEXTAREA")
            ) return;

            if (element.type === "checkbox") {
                element.checked = Scratch.Cast.toBoolean(args.value);
            } else {
                element.value = args.value;
            }
        }
        InputValue (args) {
            const element = elements[args.id];
            if (!element) {
                if (
                    inputhold[args.id] && (element.tagName !== "INPUT" && element.tagName !== "TEXTAREA")
                ) {
                    return inputhold[args.id];
                } else {
                    return "";
                }
            }
            switch (element.type) {
                case 'checkbox':
                    return element.checked;
                case 'file':
                    return datauri(element.files[0]);
                default:
                    return element.value;
            }
        }
        WhenInputChanged (args, util) {
            const element = elements[args.id];
            if (
                !element ||
                (element.tagName !== "INPUT" &&
                    element.tagName !== "TEXTAREA")
            )
                return false;

            const value = Scratch.Cast.toString(element.type === "checkbox" ? element.checked : element.value);
            const blockId = util.thread.peekStack();

            if (lastValues[blockId] !== value) {
                lastValues[blockId] = value;
                return true;
            } else {
                return false;
            }
        }
        WhenClicked (args) {
            if (!metadata[args.id]) return false;

            if (metadata[args.id].clicked) {
               metadata[args.id].clicked = false;
               return true;
            } else {
                return false;
            }
        }
        VideoSource (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "VIDEO") return;
            element.src = args.url;
            this.FixPos(args.id);
        }
        VideoControl (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "VIDEO") return;
            switch (args.control) {
                case "Play":
                    element.play();
                    break;
                case "Stop":
                    element.pause();
                    element.currentTime = 0;
                    break;
                case "Pause":
                    element.pause();
                    break;
            }
        }
        VideoVolume (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "VIDEO") return;
            element.volume = args.volume / 100;
        }
        VideoHtmlControls (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "VIDEO") return;
            if (args.toggle === 'Enabled') {
                element.setAttribute('controls', 'true');
            } else {
                element.removeAttribute('controls');
            }
        }
        VideoLoop (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "VIDEO") return;
            element.loop = args.toggle == "Enabled";
        }
        ButtonText (args) {
            const element = elements[args.id];
            if (!element || element.tagName !== "BUTTON") return;
            element.children[0].textContent = args.text;
            this.FixPos(args.id);
        }
    }
    Scratch.extensions.register(new ProjectInterfaces());
})(Scratch);