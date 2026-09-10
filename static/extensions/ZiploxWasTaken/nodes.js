// Created by ZiploxZQS and OutsideFlight X3
// There will be unnecessary comments because why not

(async function (Scratch) {
    "use strict";

    if (!Scratch.extensions.unsandboxed) {
        alert("This extension must be unsandboxed.");
        return;
    }

    const nodes = new Map();
    let links = [];

    const NODE1 = "#56ad57";
    const NODE2 = "#419b42";
    const NODE3 = "#348235";

    const LINK1 = "#2f8242";
    const LINK2 = "#256e35";
    const LINK3 = "#1c5729";

    function getNode(id) {
        id = Scratch.Cast.toNumber(id);

        if (!Number.isFinite(id)) return null;

        return nodes.get(id);
    }

    function linkExists(a, b) {
        a = Scratch.Cast.toNumber(a);
        b = Scratch.Cast.toNumber(b);

        return links.some(
            l =>
                (l.from === a && l.to === b) ||
                (l.from === b && l.to === a)
        );
    }

    function getNodeNeighbors(id) {
        id = Scratch.Cast.toNumber(id);

        return [
            ...new Set(
                links.flatMap(link => {
                    if (link.from === id) {
                        return [link.to];
                    }

                    if (link.to === id) {
                        return [link.from];
                    }

                    return [];
                })
            )
        ];
    }

    function areAdjacent(a, b) {
        const dx = Math.abs(a.x - b.x);
        const dy = Math.abs(a.y - b.y);

        return (
            (dx === 1 && dy === 0) ||
            (dx === 0 && dy === 1)
        );
    }

    function findNodeAt(x, y) {
        for (const node of nodes.values()) {
            if (node.x === x && node.y === y) {
                return node;
            }
        }

        return null;
    }

    class NodeSystem {
        getInfo() {
            return {
                id: "ziploxnodesystem",
                name: "Nodes",
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIzMC40MTY2NiIgaGVpZ2h0PSIzMC40MTY2NiIgdmlld0JveD0iMCwwLDMwLjQxNjY2LDMwLjQxNjY2Ij48ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSgtMjIzLjgxNzM3LC0xNTIuNTE2NTgpIj48ZyBzdHJva2UtbWl0ZXJsaW1pdD0iMTAiPjxwYXRoIGQ9Ik0yMjQuMTkyMzcsMTY3LjcyNDkxYzAsLTguMTkyMjIgNi42NDExMSwtMTQuODMzMzMgMTQuODMzMzMsLTE0LjgzMzMzYzguMTkyMjIsMCAxNC44MzMzMyw2LjY0MTExIDE0LjgzMzMzLDE0LjgzMzMzYzAsOC4xOTIyMiAtNi42NDExMSwxNC44MzMzMyAtMTQuODMzMzMsMTQuODMzMzNjLTguMTkyMjIsMCAtMTQuODMzMzMsLTYuNjQxMTEgLTE0LjgzMzMzLC0xNC44MzMzM3oiIGZpbGw9IiM1NmFkNTciIHN0cm9rZT0iIzI1NmUzNSIgc3Ryb2tlLXdpZHRoPSIwLjUiLz48cGF0aCBkPSJNMjQ5LjUxNDQ1LDE1Ny4yMzYxNmM1Ljc5Mjc4LDUuNzkyNzggNS43OTI3OCwxNS4xODQ3MiAwLDIwLjk3NzVjLTUuNzkyNzgsNS43OTI3OCAtMTUuMTg0NzMsNS43OTI3OCAtMjAuOTc3NSwwYy0wLjA0MDUxLC0wLjA0MDUxIDIwLjkxMzY1LC0yMS4wNDEzNSAyMC45Nzc1LC0yMC45Nzc1eiIgZmlsbD0iIzJmODI0MiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48cGF0aCBkPSJNMjI0LjE5MjM3LDE2Ny43MjQ5MWMwLC04LjE5MjIyIDYuNjQxMTEsLTE0LjgzMzMzIDE0LjgzMzMzLC0xNC44MzMzM2M4LjE5MjIyLDAgMTQuODMzMzMsNi42NDExMSAxNC44MzMzMywxNC44MzMzM2MwLDguMTkyMjIgLTYuNjQxMTEsMTQuODMzMzMgLTE0LjgzMzMzLDE0LjgzMzMzYy04LjE5MjIyLDAgLTE0LjgzMzMzLC02LjY0MTExIC0xNC44MzMzMywtMTQuODMzMzN6IiBmaWxsPSJub25lIiBzdHJva2U9IiMzNDgyMzUiIHN0cm9rZS13aWR0aD0iMC43NSIvPjxwYXRoIGQ9Ik0yNDkuNTE0NDMsMTU3LjIzNjE0YzEuMzY2MjgsMS4zNjYyOCAyLjQ2NzI3LDIuOTk3ODUgMy4yMTkwNyw0LjgxMDgxYzEuNTAwNzEsMy42MjcxMSAxLjUwMDcxLDcuNzI4OCAwLDExLjM1NTkxYy0xLjUwMzU5LDMuNjI1OTEgLTQuNDAzOTMsNi41MjYyNSAtOC4wMjk4NCw4LjAyOTg0Yy0zLjYyNzEsMS41MDA3MSAtNy43Mjg4LDEuNTAwNzEgLTExLjM1NTkxLDBjLTEuODEyOTYsLTAuNzUxNzkgLTMuNDQ0NTMsLTEuODUyNzggLTQuODEwODEsLTMuMjE5MDYiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzFjNTcyOSIgc3Ryb2tlLXdpZHRoPSIwLjc1Ii8+PHBhdGggZD0iTTIzMS40NzUyMywxNzAuODcyNTJjMC45MjY5NywtMC42MzAxMyAxLjYzMDI3LC0wLjYwNDE3IDIuNzEwMjcsLTAuNDExODRjMC4yMDgzNCwwLjIwODM0IDAuNDE2NjcsMC40MTY2NyAwLjYzMTMzLDAuNjMxMzNjMC41NTU1NywtMC41NTU1NyAxLjExMTE0LC0xLjExMTE0IDEuNjgzNTUsLTEuNjgzNTVjLTAuMTA0MTcsLTAuMTM4ODkgLTAuMjA4MzQsLTAuMjc3NzggLTAuMzE1NjYsLTAuNDIwODhjLTAuNDQ2MjQsLTAuODkyNDggLTAuNTAyNTIsLTEuMzIzMTYgLTAuMzE1NjcsLTIuMzE0ODhjMC41OTE4MywtMC44NTg5NSAxLjI0MTM2LC0xLjUxNzczIDIuMTA0NDQsLTIuMTA0NDNjMS4xNDQyOCwtMC4xNzA5OSAxLjE0NDI3LC0wLjE3MDk5IDIuMTA0NDIsMGMwLjIwODM0LDAuMjA4MzQgMC40MTY2NywwLjQxNjY3IDAuNjMxMzMsMC42MzEzM2MwLjU1NTU3LC0wLjU1NTU3IDEuMTExMTQsLTEuMTExMTQgMS42ODM1NSwtMS42ODM1NWMtMC4xMDQxNywtMC4xMzg4OSAtMC4yMDgzMywtMC4yNzc3NyAtMC4zMTU2NiwtMC40MjA4OGMtMC40NDYyNCwtMC44OTI0OCAtMC41MDI1MSwtMS4zMjMxNiAtMC4zMTU2NiwtMi4zMTQ4OGMwLjU5MTgzLC0wLjg1ODk1IDEuMjQxMzYsLTEuNTE3NzMgMi4xMDQ0MywtMi4xMDQ0M2MxLjE0NDI4LC0wLjE3MDk5IDEuMTQ0MjcsLTAuMTcwOTkgMi4xMDQ0MiwwYzAuMjA4MzQsMC4yMDgzNCAwLjQxNjY4LDAuNDE2NjcgMC42MzEzMywwLjYzMTMzYzAuNTU1NTcsLTAuNTU1NTcgMS4xMTExNCwtMS4xMTExNCAxLjY4MzU0LC0xLjY4MzU1YzAuMjc3NzgsMC4yNzc3OCAwLjU1NTU4LDAuNTU1NTggMC44NDE3OCwwLjg0MTc4Yy0wLjU1NTU3LDAuNTU1NTcgLTEuMTExMTQsMS4xMTExNCAtMS42ODM1NSwxLjY4MzU1YzAuMTA0MTcsMC4xMzg4OSAwLjIwODM0LDAuMjc3NzcgMC4zMTU2NiwwLjQyMDg4YzAuNDQ2MjQsMC44OTI0OCAwLjUwMjUyLDEuMzIzMTYgMC4zMTU2NywyLjMxNDg4Yy0wLjU5MTgzLDAuODU4OTUgLTEuMjQxMzUsMS41MTc3MyAtMi4xMDQ0MywyLjEwNDQ0Yy0xLjE0NDI4LDAuMTcwOTkgLTEuMTQ0MjgsMC4xNzA5OSAtMi4xMDQ0MywwYy0wLjIwODM0LC0wLjIwODM0IC0wLjQxNjY3LC0wLjQxNjY4IC0wLjYzMTMzLC0wLjYzMTMzYy0wLjU1NTU3LDAuNTU1NTcgLTEuMTExMTQsMS4xMTExNCAtMS42ODM1NSwxLjY4MzU1YzAuMTA0MTcsMC4xMzg4OSAwLjIwODM0LDAuMjc3NzggMC4zMTU2NiwwLjQyMDg4YzAuNDQ2MjQsMC44OTI0OCAwLjUwMjUxLDEuMzIzMTYgMC4zMTU2NiwyLjMxNDg4Yy0wLjU5MTgzLDAuODU4OTUgLTEuMjQxMzUsMS41MTc3MyAtMi4xMDQ0MiwyLjEwNDQzYy0xLjE0NDI4LDAuMTcwOTkgLTEuMTQ0MjgsMC4xNzA5OSAtMi4xMDQ0MywwYy0wLjIwODM0LC0wLjIwODM0IC0wLjQxNjY4LC0wLjQxNjY3IC0wLjYzMTMzLC0wLjYzMTMzYy0wLjU1NTU3LDAuNTU1NTcgLTEuMTExMTQsMS4xMTExNCAtMS42ODM1NCwxLjY4MzU1YzAuMTA0MTcsMC4xMzg4OSAwLjIwODM0LDAuMjc3NzcgMC4zMTU2NiwwLjQyMDg4YzAuNDQ2MjQsMC44OTI0OCAwLjUwMjUxLDEuMzIzMTYgMC4zMTU2NiwyLjMxNDg4Yy0wLjU5MTgzLDAuODU4OTUgLTEuMjQxMzUsMS41MTc3MyAtMi4xMDQ0MywyLjEwNDQzYy0xLjE0NDI4LDAuMTcwOTkgLTEuMTQ0MjgsMC4xNzA5OSAtMi4xMDQ0MywwYy0wLjIwODM0LC0wLjIwODM0IC0wLjQxNjY3LC0wLjQxNjY3IC0wLjYzMTMzLC0wLjYzMTMzYy0wLjU1NTU3LDAuNTU1NTcgLTEuMTExMTQsMS4xMTExNCAtMS42ODM1NSwxLjY4MzU1Yy0wLjI3Nzc4LC0wLjI3Nzc4IC0wLjU1NTU3LC0wLjU1NTU4IC0wLjg0MTc3LC0wLjg0MTc4YzAuNTU1NTcsLTAuNTU1NTcgMS4xMTExMywtMS4xMTExNCAxLjY4MzU0LC0xLjY4MzU1Yy0wLjEwNDE3LC0wLjEzODg5IC0wLjIwODM0LC0wLjI3Nzc3IC0wLjMxNTY2LC0wLjQyMDg4Yy0wLjg5MDUxLC0xLjc4MTAyIC0wLjE1LC0yLjc3MzEzIDEuMTgyOTMsLTQuMDA3NDd6TTIzMS40NDk3NCwxNzQuMDM4MjFjMC41NjExOCwwLjcwMTQ3IDAuNTYxMTksMC43MDE0OCAxLjI2MjY2LDEuMjYyNjZjMC44ODM5OSwwLjA5MDYyIDAuODgzOTgsMC4wOTA2MiAxLjUyNTcxLC0wLjU3ODcyYzAuNjY5MzQsLTAuNjQxNzMgMC42NjkzNCwtMC42NDE3MiAwLjU3ODcyLC0xLjUyNTcxYy0wLjU2MTE4LC0wLjcwMTQ3IC0wLjU2MTE5LC0wLjcwMTQ4IC0xLjI2MjY2LC0xLjI2MjY2Yy0wLjg4Mzk5LC0wLjA5MDYyIC0wLjg4Mzk4LC0wLjA5MDYyIC0xLjUyNTcxLDAuNTc4NzJjLTAuNjY5MzQsMC42NDE3MyAtMC42NjkzNSwwLjY0MTcyIC0wLjU3ODczLDEuNTI1NzF6TTIzNy4zNDIxNiwxNjguMTQ1OGMwLjU2MTE4LDAuNzAxNDcgMC41NjExOSwwLjcwMTQ3IDEuMjYyNjYsMS4yNjI2NWMwLjg4Mzk5LDAuMDkwNjIgMC44ODM5OCwwLjA5MDYyIDEuNTI1NzEsLTAuNTc4NzJjMC42NjkzNCwtMC42NDE3MyAwLjY2OTM1LC0wLjY0MTcyIDAuNTc4NzIsLTEuNTI1NzJjLTAuNTYxMTgsLTAuNzAxNDcgLTAuNTYxMTksLTAuNzAxNDcgLTEuMjYyNjYsLTEuMjYyNjVjLTAuODgzOTksLTAuMDkwNjIgLTAuODgzOTgsLTAuMDkwNjMgLTEuNTI1NzEsMC41Nzg3MWMtMC42NjkzNCwwLjY0MTczIC0wLjY2OTM0LDAuNjQxNzMgLTAuNTc4NzIsMS41MjU3MnpNMjQzLjIzNDU3LDE2Mi4yNTMzOWMwLjU2MTE4LDAuNzAxNDcgMC41NjExOCwwLjcwMTQ3IDEuMjYyNjUsMS4yNjI2NWMwLjg4Mzk5LDAuMDkwNjIgMC44ODM5OSwwLjA5MDYyIDEuNTI1NzIsLTAuNTc4NzJjMC42NjkzNCwtMC42NDE3MyAwLjY2OTM0LC0wLjY0MTcyIDAuNTc4NzEsLTEuNTI1NzFjLTAuNTYxMTgsLTAuNzAxNDcgLTAuNTYxMTgsLTAuNzAxNDcgLTEuMjYyNjUsLTEuMjYyNjVjLTAuODgzOTksLTAuMDkwNjIgLTAuODgzOTksLTAuMDkwNjMgLTEuNTI1NzIsMC41Nzg3MWMtMC42NjkzNCwwLjY0MTczIC0wLjY2OTM0LDAuNjQxNzMgLTAuNTc4NzEsMS41MjU3MnoiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjoxNi4xODI2Mjk5OTk5OTk5OToyNy40ODM0MTk5OTk5OTk5OTUtLT4=",
                blockIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI4My41IiBoZWlnaHQ9IjgzLjUiIHZpZXdCb3g9IjAsMCw4My41LDgzLjUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xOTguMjUsLTEzOC4yNTAwMSkiPjxnIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTIxNi4zNzg3OSwxODkuODQ3MDhjMi44OTk5NywtMS45NzEzMyA1LjEwMDIxLC0xLjg5MDExIDguNDc4OTMsLTEuMjg4NDJjMC42NTE3OCwwLjY1MTc4IDEuMzAzNTMsMS4zMDM1MyAxLjk3NTA4LDEuOTc1MDhjMS43MzgwNywtMS43MzgwNyAzLjQ3NjE0LC0zLjQ3NjE0IDUuMjY2ODksLTUuMjY2ODljLTAuMzI1ODksLTAuNDM0NTEgLTAuNjUxNzgsLTAuODY5MDIgLTAuOTg3NTIsLTEuMzE2N2MtMS4zOTYwNCwtMi43OTIwNyAtMS41NzIxMSwtNC4xMzk0MyAtMC45ODc1NiwtNy4yNDE5N2MxLjg1MTUxLC0yLjY4NzE4IDMuODgzNTMsLTQuNzQ4MTMgNi41ODM2MiwtNi41ODM1OWMzLjU3OTgyLC0wLjUzNDkzIDMuNTc5NzgsLTAuNTM0OTMgNi41ODM1NiwwYzAuNjUxNzgsMC42NTE3OCAxLjMwMzUzLDEuMzAzNTMgMS45NzUwOCwxLjk3NTA4YzEuNzM4MDcsLTEuNzM4MDcgMy40NzYxNCwtMy40NzYxNCA1LjI2Njg5LC01LjI2Njg5Yy0wLjMyNTg5LC0wLjQzNDUxIC0wLjY1MTc1LC0wLjg2ODk5IC0wLjk4NzUyLC0xLjMxNjdjLTEuMzk2MDQsLTIuNzkyMDcgLTEuNTcyMDcsLTQuMTM5NDMgLTAuOTg3NTIsLTcuMjQxOTdjMS44NTE1MSwtMi42ODcxOCAzLjg4MzUzLC00Ljc0ODEzIDYuNTgzNTksLTYuNTgzNTljMy41Nzk4MiwtMC41MzQ5MyAzLjU3OTc4LC0wLjUzNDkzIDYuNTgzNTYsMGMwLjY1MTc4LDAuNjUxNzggMS4zMDM1NiwxLjMwMzUzIDEuOTc1MDgsMS45NzUwOGMxLjczODA3LC0xLjczODA3IDMuNDc2MTQsLTMuNDc2MTQgNS4yNjY4NiwtNS4yNjY4OWMwLjg2OTAyLDAuODY5MDIgMS43MzgxLDEuNzM4MSAyLjYzMzQ2LDIuNjMzNDZjLTEuNzM4MDcsMS43MzgwNyAtMy40NzYxNCwzLjQ3NjE0IC01LjI2Njg5LDUuMjY2ODljMC4zMjU4OSwwLjQzNDUxIDAuNjUxNzgsMC44Njg5OSAwLjk4NzUyLDEuMzE2N2MxLjM5NjA0LDIuNzkyMDcgMS41NzIxMSw0LjEzOTQzIDAuOTg3NTYsNy4yNDE5N2MtMS44NTE1MSwyLjY4NzE4IC0zLjg4MzQ5LDQuNzQ4MTMgLTYuNTgzNTksNi41ODM2MmMtMy41Nzk4MiwwLjUzNDkzIC0zLjU3OTgyLDAuNTM0OTMgLTYuNTgzNTksMGMtMC42NTE3OCwtMC42NTE3OCAtMS4zMDM1MywtMS4zMDM1NiAtMS45NzUwOCwtMS45NzUwOGMtMS43MzgwNywxLjczODA3IC0zLjQ3NjE0LDMuNDc2MTQgLTUuMjY2ODksNS4yNjY4OWMwLjMyNTg5LDAuNDM0NTEgMC42NTE3OCwwLjg2OTAyIDAuOTg3NTIsMS4zMTY3YzEuMzk2MDQsMi43OTIwNyAxLjU3MjA3LDQuMTM5NDMgMC45ODc1Miw3LjI0MTk3Yy0xLjg1MTUxLDIuNjg3MTggLTMuODgzNDksNC43NDgxMyAtNi41ODM1Niw2LjU4MzU5Yy0zLjU3OTgyLDAuNTM0OTMgLTMuNTc5ODIsMC41MzQ5MyAtNi41ODM1OSwwYy0wLjY1MTc4LC0wLjY1MTc4IC0xLjMwMzU2LC0xLjMwMzUzIC0xLjk3NTA4LC0xLjk3NTA4Yy0xLjczODA3LDEuNzM4MDcgLTMuNDc2MTQsMy40NzYxNCAtNS4yNjY4Niw1LjI2Njg5YzAuMzI1ODksMC40MzQ1MSAwLjY1MTc4LDAuODY4OTkgMC45ODc1MiwxLjMxNjdjMS4zOTYwNCwyLjc5MjA3IDEuNTcyMDcsNC4xMzk0MyAwLjk4NzUyLDcuMjQxOTdjLTEuODUxNTEsMi42ODcxOCAtMy44ODM0OSw0Ljc0ODEzIC02LjU4MzU5LDYuNTgzNTljLTMuNTc5ODIsMC41MzQ5MyAtMy41Nzk4MiwwLjUzNDkzIC02LjU4MzU5LDBjLTAuNjUxNzgsLTAuNjUxNzggLTEuMzAzNTMsLTEuMzAzNTMgLTEuOTc1MDgsLTEuOTc1MDhjLTEuNzM4MDcsMS43MzgwNyAtMy40NzYxNCwzLjQ3NjE0IC01LjI2Njg5LDUuMjY2ODljLTAuODY5MDIsLTAuODY5MDIgLTEuNzM4MDcsLTEuNzM4MSAtMi42MzM0MywtMi42MzM0NmMxLjczODA3LC0xLjczODA3IDMuNDc2MTEsLTMuNDc2MTQgNS4yNjY4NiwtNS4yNjY4OWMtMC4zMjU4OSwtMC40MzQ1MSAtMC42NTE3OCwtMC44Njg5OSAtMC45ODc1MiwtMS4zMTY3Yy0yLjc4NTkxLC01LjU3MTgyIC0wLjQ2OTI3LC04LjY3NTU4IDMuNzAwNzMsLTEyLjUzNzE1ek0yMTYuMjk5MDUsMTk5Ljc1MDc2YzEuNzU1NjIsMi4xOTQ1MSAxLjc1NTY1LDIuMTk0NTQgMy45NTAxNiwzLjk1MDE2YzIuNzY1NTEsMC4yODM1IDIuNzY1NDgsMC4yODM1IDQuNzczMSwtMS44MTA0OWMyLjA5Mzk5LC0yLjAwNzYyIDIuMDkzOTksLTIuMDA3NTkgMS44MTA0OSwtNC43NzMxYy0xLjc1NTYyLC0yLjE5NDUxIC0xLjc1NTY1LC0yLjE5NDU0IC0zLjk1MDE2LC0zLjk1MDE2Yy0yLjc2NTUxLC0wLjI4MzUgLTIuNzY1NDgsLTAuMjgzNSAtNC43NzMxLDEuODEwNDljLTIuMDkzOTksMi4wMDc2MiAtMi4wOTQwMiwyLjAwNzU5IC0xLjgxMDUyLDQuNzczMXpNMjM0LjczMzE1LDE4MS4zMTY2OGMxLjc1NTYyLDIuMTk0NTEgMS43NTU2NSwyLjE5NDUxIDMuOTUwMTYsMy45NTAxM2MyLjc2NTUxLDAuMjgzNSAyLjc2NTQ4LDAuMjgzNSA0Ljc3MzEsLTEuODEwNDljMi4wOTM5OSwtMi4wMDc2MiAyLjA5NDAyLC0yLjAwNzU5IDEuODEwNDksLTQuNzczMTNjLTEuNzU1NjIsLTIuMTk0NTEgLTEuNzU1NjUsLTIuMTk0NTEgLTMuOTUwMTYsLTMuOTUwMTNjLTIuNzY1NTEsLTAuMjgzNSAtMi43NjU0OCwtMC4yODM1MyAtNC43NzMxLDEuODEwNDZjLTIuMDkzOTksMi4wMDc2MiAtMi4wOTM5OSwyLjAwNzYyIC0xLjgxMDQ5LDQuNzczMTN6TTI1My4xNjcyMywxNjIuODgyNjFjMS43NTU2MiwyLjE5NDUxIDEuNzU1NjIsMi4xOTQ1MSAzLjk1MDEzLDMuOTUwMTNjMi43NjU1MSwwLjI4MzUgMi43NjU1MSwwLjI4MzUgNC43NzMxMywtMS44MTA0OWMyLjA5Mzk5LC0yLjAwNzYyIDIuMDkzOTksLTIuMDA3NTkgMS44MTA0NiwtNC43NzMxYy0xLjc1NTYyLC0yLjE5NDUxIC0xLjc1NTYyLC0yLjE5NDUxIC0zLjk1MDEzLC0zLjk1MDEzYy0yLjc2NTUxLC0wLjI4MzUgLTIuNzY1NTEsLTAuMjgzNTMgLTQuNzczMTMsMS44MTA0NmMtMi4wOTM5OSwyLjAwNzYyIC0yLjA5Mzk5LDIuMDA3NjIgLTEuODEwNDYsNC43NzMxM3oiIGZpbGw9IiNmZmZmZmYiIHN0cm9rZS1vcGFjaXR5PSIwLjEyOTQxIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS13aWR0aD0iMyIvPjxwYXRoIGQ9Ik0yMTYuMzc4NzksMTg5Ljg0NzA4YzIuODk5OTcsLTEuOTcxMzMgNS4xMDAyMSwtMS44OTAxMSA4LjQ3ODkzLC0xLjI4ODQyYzAuNjUxNzgsMC42NTE3OCAxLjMwMzUzLDEuMzAzNTMgMS45NzUwOCwxLjk3NTA4YzEuNzM4MDcsLTEuNzM4MDcgMy40NzYxNCwtMy40NzYxNCA1LjI2Njg5LC01LjI2Njg5Yy0wLjMyNTg5LC0wLjQzNDUxIC0wLjY1MTc4LC0wLjg2OTAyIC0wLjk4NzUyLC0xLjMxNjdjLTEuMzk2MDQsLTIuNzkyMDcgLTEuNTcyMTEsLTQuMTM5NDMgLTAuOTg3NTYsLTcuMjQxOTdjMS44NTE1MSwtMi42ODcxOCAzLjg4MzUzLC00Ljc0ODEzIDYuNTgzNjIsLTYuNTgzNTljMy41Nzk4MiwtMC41MzQ5MyAzLjU3OTc4LC0wLjUzNDkzIDYuNTgzNTYsMGMwLjY1MTc4LDAuNjUxNzggMS4zMDM1MywxLjMwMzUzIDEuOTc1MDgsMS45NzUwOGMxLjczODA3LC0xLjczODA3IDMuNDc2MTQsLTMuNDc2MTQgNS4yNjY4OSwtNS4yNjY4OWMtMC4zMjU4OSwtMC40MzQ1MSAtMC42NTE3NSwtMC44Njg5OSAtMC45ODc1MiwtMS4zMTY3Yy0xLjM5NjA0LC0yLjc5MjA3IC0xLjU3MjA3LC00LjEzOTQzIC0wLjk4NzUyLC03LjI0MTk3YzEuODUxNTEsLTIuNjg3MTggMy44ODM1MywtNC43NDgxMyA2LjU4MzU5LC02LjU4MzU5YzMuNTc5ODIsLTAuNTM0OTMgMy41Nzk3OCwtMC41MzQ5MyA2LjU4MzU2LDBjMC42NTE3OCwwLjY1MTc4IDEuMzAzNTYsMS4zMDM1MyAxLjk3NTA4LDEuOTc1MDhjMS43MzgwNywtMS43MzgwNyAzLjQ3NjE0LC0zLjQ3NjE0IDUuMjY2ODYsLTUuMjY2ODljMC44NjkwMiwwLjg2OTAyIDEuNzM4MSwxLjczODEgMi42MzM0NiwyLjYzMzQ2Yy0xLjczODA3LDEuNzM4MDcgLTMuNDc2MTQsMy40NzYxNCAtNS4yNjY4OSw1LjI2Njg5YzAuMzI1ODksMC40MzQ1MSAwLjY1MTc4LDAuODY4OTkgMC45ODc1MiwxLjMxNjdjMS4zOTYwNCwyLjc5MjA3IDEuNTcyMTEsNC4xMzk0MyAwLjk4NzU2LDcuMjQxOTdjLTEuODUxNTEsMi42ODcxOCAtMy44ODM0OSw0Ljc0ODEzIC02LjU4MzU5LDYuNTgzNjJjLTMuNTc5ODIsMC41MzQ5MyAtMy41Nzk4MiwwLjUzNDkzIC02LjU4MzU5LDBjLTAuNjUxNzgsLTAuNjUxNzggLTEuMzAzNTMsLTEuMzAzNTYgLTEuOTc1MDgsLTEuOTc1MDhjLTEuNzM4MDcsMS43MzgwNyAtMy40NzYxNCwzLjQ3NjE0IC01LjI2Njg5LDUuMjY2ODljMC4zMjU4OSwwLjQzNDUxIDAuNjUxNzgsMC44NjkwMiAwLjk4NzUyLDEuMzE2N2MxLjM5NjA0LDIuNzkyMDcgMS41NzIwNyw0LjEzOTQzIDAuOTg3NTIsNy4yNDE5N2MtMS44NTE1MSwyLjY4NzE4IC0zLjg4MzQ5LDQuNzQ4MTMgLTYuNTgzNTYsNi41ODM1OWMtMy41Nzk4MiwwLjUzNDkzIC0zLjU3OTgyLDAuNTM0OTMgLTYuNTgzNTksMGMtMC42NTE3OCwtMC42NTE3OCAtMS4zMDM1NiwtMS4zMDM1MyAtMS45NzUwOCwtMS45NzUwOGMtMS43MzgwNywxLjczODA3IC0zLjQ3NjE0LDMuNDc2MTQgLTUuMjY2ODYsNS4yNjY4OWMwLjMyNTg5LDAuNDM0NTEgMC42NTE3OCwwLjg2ODk5IDAuOTg3NTIsMS4zMTY3YzEuMzk2MDQsMi43OTIwNyAxLjU3MjA3LDQuMTM5NDMgMC45ODc1Miw3LjI0MTk3Yy0xLjg1MTUxLDIuNjg3MTggLTMuODgzNDksNC43NDgxMyAtNi41ODM1OSw2LjU4MzU5Yy0zLjU3OTgyLDAuNTM0OTMgLTMuNTc5ODIsMC41MzQ5MyAtNi41ODM1OSwwYy0wLjY1MTc4LC0wLjY1MTc4IC0xLjMwMzUzLC0xLjMwMzUzIC0xLjk3NTA4LC0xLjk3NTA4Yy0xLjczODA3LDEuNzM4MDcgLTMuNDc2MTQsMy40NzYxNCAtNS4yNjY4OSw1LjI2Njg5Yy0wLjg2OTAyLC0wLjg2OTAyIC0xLjczODA3LC0xLjczODEgLTIuNjMzNDMsLTIuNjMzNDZjMS43MzgwNywtMS43MzgwNyAzLjQ3NjExLC0zLjQ3NjE0IDUuMjY2ODYsLTUuMjY2ODljLTAuMzI1ODksLTAuNDM0NTEgLTAuNjUxNzgsLTAuODY4OTkgLTAuOTg3NTIsLTEuMzE2N2MtMi43ODU5MSwtNS41NzE4MiAtMC40NjkyNywtOC42NzU1OCAzLjcwMDczLC0xMi41MzcxNXpNMjE2LjI5OTA1LDE5OS43NTA3NmMxLjc1NTYyLDIuMTk0NTEgMS43NTU2NSwyLjE5NDU0IDMuOTUwMTYsMy45NTAxNmMyLjc2NTUxLDAuMjgzNSAyLjc2NTQ4LDAuMjgzNSA0Ljc3MzEsLTEuODEwNDljMi4wOTM5OSwtMi4wMDc2MiAyLjA5Mzk5LC0yLjAwNzU5IDEuODEwNDksLTQuNzczMWMtMS43NTU2MiwtMi4xOTQ1MSAtMS43NTU2NSwtMi4xOTQ1NCAtMy45NTAxNiwtMy45NTAxNmMtMi43NjU1MSwtMC4yODM1IC0yLjc2NTQ4LC0wLjI4MzUgLTQuNzczMSwxLjgxMDQ5Yy0yLjA5Mzk5LDIuMDA3NjIgLTIuMDk0MDIsMi4wMDc1OSAtMS44MTA1Miw0Ljc3MzF6TTIzNC43MzMxNSwxODEuMzE2NjhjMS43NTU2MiwyLjE5NDUxIDEuNzU1NjUsMi4xOTQ1MSAzLjk1MDE2LDMuOTUwMTNjMi43NjU1MSwwLjI4MzUgMi43NjU0OCwwLjI4MzUgNC43NzMxLC0xLjgxMDQ5YzIuMDkzOTksLTIuMDA3NjIgMi4wOTQwMiwtMi4wMDc1OSAxLjgxMDQ5LC00Ljc3MzEzYy0xLjc1NTYyLC0yLjE5NDUxIC0xLjc1NTY1LC0yLjE5NDUxIC0zLjk1MDE2LC0zLjk1MDEzYy0yLjc2NTUxLC0wLjI4MzUgLTIuNzY1NDgsLTAuMjgzNTMgLTQuNzczMSwxLjgxMDQ2Yy0yLjA5Mzk5LDIuMDA3NjIgLTIuMDkzOTksMi4wMDc2MiAtMS44MTA0OSw0Ljc3MzEzek0yNTMuMTY3MjMsMTYyLjg4MjYxYzEuNzU1NjIsMi4xOTQ1MSAxLjc1NTYyLDIuMTk0NTEgMy45NTAxMywzLjk1MDEzYzIuNzY1NTEsMC4yODM1IDIuNzY1NTEsMC4yODM1IDQuNzczMTMsLTEuODEwNDljMi4wOTM5OSwtMi4wMDc2MiAyLjA5Mzk5LC0yLjAwNzU5IDEuODEwNDYsLTQuNzczMWMtMS43NTU2MiwtMi4xOTQ1MSAtMS43NTU2MiwtMi4xOTQ1MSAtMy45NTAxMywtMy45NTAxM2MtMi43NjU1MSwtMC4yODM1IC0yLjc2NTUxLC0wLjI4MzUzIC00Ljc3MzEzLDEuODEwNDZjLTIuMDkzOTksMi4wMDc2MiAtMi4wOTM5OSwyLjAwNzYyIC0xLjgxMDQ2LDQuNzczMTN6IiBmaWxsPSIjZmZmZmZmIiBzdHJva2U9Im5vbmUiIHN0cm9rZS13aWR0aD0iMCIvPjxwYXRoIGQ9Ik0xOTguMjUsMjIxLjc1MDAxdi04My41aDgzLjV2ODMuNXoiIGZpbGw9Im5vbmUiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIwIi8+PC9nPjwvZz48L3N2Zz48IS0tcm90YXRpb25DZW50ZXI6NDEuNzUwMDAwNjg3MTE5Mjc6NDEuNzQ5OTkwMTIxMTQ5MzgtLT4=",
                color1: NODE1,
                color2: NODE2,

                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Credits: Ziplox and OutF"
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "May be updated later"
                    },
                    {
                        opcode: "createNode",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "create node at x: [X] y: [Y] with an id of [ID]",

                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },

                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },

                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "deleteNode",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "delete node [ID]",

                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "clearNodes",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "remove all nodes"
                    },

                    {
                        opcode: "makeGrid",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "make a grid from x: [X1] y: [Y1] to x: [X2] y: [Y2]",

                        arguments: {
                            X1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -1
                            },

                            Y1: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },

                            X2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },

                            Y2: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: -1
                            }
                        }
                    },

                    {
                        opcode: "nodeExists",
                        blockType: Scratch.BlockType.BOOLEAN,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "node [ID] exists?",

                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "setNodePosition",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "set node [ID] position x: [X] y: [Y]",

                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },

                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },

                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    {
                        opcode: "getNodeX",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "x of node [ID]",

                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "getNodeY",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "y of node [ID]",

                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "closestNode",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "node closest to x: [X] y: [Y]",

                        arguments: {
                            X: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            },

                            Y: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 0
                            }
                        }
                    },

                    {
                        opcode: "lowestNodeID",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "lowest node ID"
                    },

                    {
                        opcode: "highestNodeID",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "highest node ID"
                    },

                    {
                        opcode: "nodeCount",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "number of nodes"
                    },

                    {
                        opcode: "allNodes",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: NODE1,
                        color2: NODE2,
                        color3: NODE3,
                        text: "all nodes"
                    },
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "Links"
                    },

                    {
                        opcode: "linkNodes",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "link node [A] to node [B]",

                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },

                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },

                    {
                        opcode: "unlinkNodes",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "unlink node [A] from node [B]",

                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },

                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },

                    {
                        opcode: "unlinkAllNeighbors",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "unlink all neighbors of node [ID]",

                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "connectNodesAnyWay",
                        blockType: Scratch.BlockType.COMMAND,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "connect nodes from the range [A] to [B] in any way possible",

                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },

                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 5
                            }
                        }
                    },

                    {
                        opcode: "nodesLinked",
                        blockType: Scratch.BlockType.BOOLEAN,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "node [A] linked to node [B]?",

                        arguments: {
                            A: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },

                            B: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 2
                            }
                        }
                    },

                    {
                        opcode: "goDirection",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "go [DIR] of node id [ID]",

                        arguments: {
                            DIR: {
                                type: Scratch.ArgumentType.STRING,
                                menu: "directions"
                            },

                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "getNeighbors",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "neighbors of node [ID]",

                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "linkCount",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "node [ID] neighbor amount",

                        arguments: {
                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "linkedNode",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "linked node #[INDEX] of node ID [ID]",

                        arguments: {
                            INDEX: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            },

                            ID: {
                                type: Scratch.ArgumentType.NUMBER,
                                defaultValue: 1
                            }
                        }
                    },

                    {
                        opcode: "linkCountTotal",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "number of links"
                    },

                    {
                        opcode: "allLinks",
                        blockType: Scratch.BlockType.REPORTER,
                        color1: LINK1,
                        color2: LINK2,
                        color3: LINK3,
                        text: "all links"
                    }
                ],

                menus: {
                    directions: {
                        acceptReporters: true,

                        items: [
                            "right",
                            "left",
                            "up",
                            "down"
                        ]
                    }
                }
            };
        }

        createNode(args) {
            const id = Scratch.Cast.toNumber(args.ID);
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);

            if (!Number.isFinite(id)) return;
            if (!Number.isFinite(x)) return;
            if (!Number.isFinite(y)) return;

            const existing = findNodeAt(x, y);

            // no stacking!!!
            if (existing && existing.id !== id) {
                return;
            }

            // remove old links if replacing node
            if (nodes.has(id)) {
                links = links.filter(
                    l =>
                        l.from !== id &&
                        l.to !== id
                );
            }

            nodes.set(id, {
                id,
                x,
                y
            });
        }

        deleteNode(args) {
            const id = Scratch.Cast.toNumber(args.ID);

            nodes.delete(id);

            links = links.filter(
                link =>
                    link.from !== id &&
                    link.to !== id
            );
        }

        clearNodes() {
            nodes.clear();
            links = [];
        }

        nodeExists(args) {
            return nodes.has(
                Scratch.Cast.toNumber(args.ID)
            );
        }

        setNodePosition(args) {
            const node = getNode(args.ID);

            if (!node) return;

            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);

            if (!Number.isFinite(x)) return;
            if (!Number.isFinite(y)) return;

            const existing = findNodeAt(x, y);

            // don't overlap nodes
            if (existing && existing.id !== node.id) {
                return;
            }

            node.x = x;
            node.y = y;
        }

        getNodeX(args) {
            const node = getNode(args.ID);

            return node ? node.x : 0;
        }

        getNodeY(args) {
            const node = getNode(args.ID);

            return node ? node.y : 0;
        }

        closestNode(args) {
            const x = Scratch.Cast.toNumber(args.X);
            const y = Scratch.Cast.toNumber(args.Y);

            let best = null;
            let bestDist = Infinity;

            for (const node of nodes.values()) {
                const dx = node.x - x;
                const dy = node.y - y;

                const dist = dx * dx + dy * dy;

                if (dist < bestDist) {
                    bestDist = dist;
                    best = node;
                }
            }

            return best ? best.id : "";
        }

        lowestNodeID() {
            if (nodes.size === 0) return "";

            return Math.min(...nodes.keys());
        }

        highestNodeID() {
            if (nodes.size === 0) return 0;

            return Math.max(...nodes.keys());
        }

        nodeCount() {
            return nodes.size;
        }

        allNodes() {
            return JSON.stringify([
                ...nodes.values()
            ]);
        }

        linkNodes(args) {
            const a = getNode(args.A);
            const b = getNode(args.B);

            if (!a || !b) return;
            if (a.id === b.id) return;
            if (!areAdjacent(a, b)) return;
            if (linkExists(a.id, b.id)) return;

            links.push({
                from: a.id,
                to: b.id
            });
        }

        unlinkNodes(args) {
            const a = Scratch.Cast.toNumber(args.A);
            const b = Scratch.Cast.toNumber(args.B);

            links = links.filter(
                l =>
                    !(
                        (l.from === a &&
                            l.to === b) ||
                        (l.from === b &&
                            l.to === a)
                    )
            );
        }

        unlinkAllNeighbors(args) {
            const id = Scratch.Cast.toNumber(args.ID);

            links = links.filter(
                l =>
                    !(
                        l.from === id ||
                        l.to === id
                    )
            );
        }

        nodesLinked(args) {
            return linkExists(args.A, args.B);
        }

        connectNodesAnyWay(args) {
            const A = Scratch.Cast.toNumber(args.A);
            const B = Scratch.Cast.toNumber(args.B);

            const minID = Math.min(A, B);
            const maxID = Math.max(A, B);

            const directions = [
                { dx: 1, dy: 0 },
                { dx: -1, dy: 0 },
                { dx: 0, dy: 1 },
                { dx: 0, dy: -1 }
            ];

            for (const node of nodes.values()) {
                if (
                    node.id < minID ||
                    node.id > maxID
                ) {
                    continue;
                }

                for (const dir of directions) {
                    const neighbor = findNodeAt(
                        node.x + dir.dx,
                        node.y + dir.dy
                    );

                    // they find their lovers awwwww!!!
                    if (!neighbor) continue;

                    if (
                        neighbor.id < minID ||
                        neighbor.id > maxID
                    ) {
                        continue;
                    }

                    if (
                        neighbor.id !== node.id &&
                        !linkExists(
                            node.id,
                            neighbor.id
                        )
                    ) {
                        links.push({
                            from: node.id,
                            to: neighbor.id
                        });
                    }
                }
            }
        }

        getNeighbors(args) {
            return JSON.stringify(
                getNodeNeighbors(args.ID)
            );
        }

        linkCount(args) {
            return getNodeNeighbors(args.ID).length;
        }

        linkedNode(args) {
            const neighbors =
                getNodeNeighbors(args.ID);

            const index =
                Math.floor(
                    Scratch.Cast.toNumber(args.INDEX)
                ) - 1;

            if (index < 0) return "";

            return neighbors[index] ?? "";
        }

        goDirection(args) {
            const node = getNode(args.ID);

            if (!node) return "";

            let targetX = node.x;
            let targetY = node.y;

            switch (
                String(args.DIR).toLowerCase()
            ) {
                case "right":
                    targetX += 1;
                    break;

                case "left":
                    targetX -= 1;
                    break;

                case "up":
                    targetY += 1;
                    break;

                case "down":
                    targetY -= 1;
                    break;

                default:
                    return "";
            }

            const target = findNodeAt(
                targetX,
                targetY
            );

            if (!target) return "";

            if (
                !linkExists(node.id, target.id)
            ) {
                return "";
            }

            return target.id;
        }

        linkCountTotal() {
            return links.length;
        }

        allLinks() {
            return JSON.stringify(links);
        }

        makeGrid(args) {
            const x1 = Scratch.Cast.toNumber(args.X1);
            const y1 = Scratch.Cast.toNumber(args.Y1);
            const x2 = Scratch.Cast.toNumber(args.X2);
            const y2 = Scratch.Cast.toNumber(args.Y2);

            const minX = Math.min(x1, x2);
            const maxX = Math.max(x1, x2);

            const minY = Math.min(y1, y2);
            const maxY = Math.max(y1, y2);

            let id = this.highestNodeID() + 1;

            for (let y = maxY; y >= minY; y--) {
                for (
                    let x = minX;
                    x <= maxX;
                    x++
                ) {
                    if (findNodeAt(x, y)) {
                        continue;
                    }

                    nodes.set(id, {
                        id,
                        x,
                        y
                    });

                    id++;
                }
            }
        }
    }

    Scratch.extensions.register(
        new NodeSystem()
    );
})(Scratch);
