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
                menuIconURI: "data:image/svg+xml;base64,PHN2ZyB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSI5Ny41IiBoZWlnaHQ9Ijk3LjUiIHZpZXdCb3g9IjAsMCw5Ny41LDk3LjUiPjxnIHRyYW5zZm9ybT0idHJhbnNsYXRlKC0xOTEuMjUsLTEzMS4yNSkiPjxnIHN0cm9rZS1taXRlcmxpbWl0PSIxMCI+PHBhdGggZD0iTTIyMi4yOTI4NSwyMDEuNDQwOGMyLjU3NzI5LDAuNDkxMzEgMy42OTgzOSwxLjY5ODM3IDUuMTY3NjUsMy44MDQzMWMwLDAuNjg5NjcgMCwxLjM3OTM1IDAsMi4wODk5MmMxLjgzOTEzLDAgMy42NzgyNSwwIDUuNTczMTEsMGMwLjA1NzQ3LC0wLjQwMjMxIDAuMTE0OTUsLTAuODA0NjIgMC4xNzQxNiwtMS4yMTkxMmMwLjczODYxLC0yLjIxNTgxIDEuMzU4MzEsLTMuMDIxOCAzLjMwOTAzLC00LjM1Mzk5YzIuNDAxMywtMC40NDIxMyA0LjU2Njc2LC0wLjQ1NzQ0IDYuOTY2MzksMGMyLjE3Njk5LDEuNjEwOTggMi4xNzY5OSwxLjYxMDk4IDMuNDgzMiwzLjQ4MzJjMCwwLjY4OTY3IDAsMS4zNzkzNSAwLDIuMDg5OTJjMS44MzkxMywwIDMuNjc4MjUsMCA1LjU3MzExLDBjMC4wNTc0NywtMC40MDIzMSAwLjExNDk1LC0wLjgwNDYyIDAuMTc0MTYsLTEuMjE5MTJjMC43Mzg2MSwtMi4yMTU4MSAxLjM1ODMxLC0zLjAyMTggMy4zMDkwMywtNC4zNTM5OWMyLjQwMTMsLTAuNDQyMTMgNC41NjY3NiwtMC40NTc0NCA2Ljk2NjM5LDBjMi4xNzY5OSwxLjYxMDk4IDIuMTc2OTksMS42MTA5OCAzLjQ4MzIsMy40ODMyYzAsMC42ODk2NyAwLDEuMzc5MzUgMCwyLjA4OTkyYzEuODM5MTMsMCAzLjY3ODI1LDAgNS41NzMxMSwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0xLjgzOTEzLDAgLTMuNjc4MjUsMCAtNS41NzMxMSwwYy0wLjA1NzQ3LDAuNDAyMzEgLTAuMTE0OTUsMC44MDQ2MiAtMC4xNzQxNiwxLjIxOTEyYy0wLjczODYxLDIuMjE1ODEgLTEuMzU4MzEsMy4wMjE4IC0zLjMwOTAzLDQuMzUzOTljLTIuNDAxMywwLjQ0MjEzIC00LjU2Njc2LDAuNDU3NDQgLTYuOTY2MzksMGMtMi4xNzY5OSwtMS42MTA5OCAtMi4xNzY5OSwtMS42MTA5OCAtMy40ODMyLC0zLjQ4MzJjMCwtMC42ODk2NyAwLC0xLjM3OTM1IDAsLTIuMDg5OTJjLTEuODM5MTMsMCAtMy42NzgyNSwwIC01LjU3MzExLDBjLTAuMDU3NDcsMC40MDIzMSAtMC4xMTQ5NSwwLjgwNDYyIC0wLjE3NDE2LDEuMjE5MTJjLTAuNzM4NjEsMi4yMTU4MSAtMS4zNTgzMSwzLjAyMTggLTMuMzA5MDMsNC4zNTM5OWMtMi40MDEzLDAuNDQyMTMgLTQuNTY2NzYsMC40NTc0NCAtNi45NjYzOSwwYy0yLjE3Njk5LC0xLjYxMDk4IC0yLjE3Njk5LC0xLjYxMDk4IC0zLjQ4MzIsLTMuNDgzMmMwLC0wLjY4OTY3IDAsLTEuMzc5MzUgMCwtMi4wODk5MmMtMS44MzkxMywwIC0zLjY3ODI1LDAgLTUuNTczMTEsMGMtMC4wNTc0NywwLjQwMjMxIC0wLjExNDk1LDAuODA0NjIgLTAuMTc0MTYsMS4yMTkxMmMtMC43Mzg2MSwyLjIxNTgxIC0xLjM1ODMxLDMuMDIxOCAtMy4zMDkwMyw0LjM1Mzk5Yy0yLjQwMTMsMC40NDIxMyAtNC41NjY3NiwwLjQ1NzQ0IC02Ljk2NjM5LDBjLTIuMTc2OTksLTEuNjEwOTggLTIuMTc2OTksLTEuNjEwOTggLTMuNDgzMiwtMy40ODMyYzAsLTAuNjg5NjcgMCwtMS4zNzkzNSAwLC0yLjA4OTkyYy0xLjgzOTEzLDAgLTMuNjc4MjUsMCAtNS41NzMxMSwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2YzEuODM5MTMsMCAzLjY3ODI1LDAgNS41NzMxMSwwYzAuMDU3NDcsLTAuNDAyMzEgMC4xMTQ5NSwtMC44MDQ2MiAwLjE3NDE2LC0xLjIxOTEyYzEuNDczOTUsLTQuNDIxODUgNC4zNDE3LC00LjgzODI5IDguNTkwOTcsLTQuNjc1MXpNMjE3LjAxMDkxLDIwNi42MzgzOGMtMC4yMzIyMSwyLjA4OTkyIC0wLjIzMjIxLDIuMDg5OTIgMCw0LjE3OTg0YzEuMzEzMTcsMS42MTMxNiAxLjMxMzE3LDEuNjEzMTYgMy40ODMyLDEuNTY3NDRjMi4xNzAwMywwLjA0NTcyIDIuMTcwMDMsMC4wNDU3MiAzLjQ4MzIsLTEuNTY3NDRjMC4yMzIyMSwtMi4wODk5MiAwLjIzMjIxLC0yLjA4OTkyIDAsLTQuMTc5ODRjLTEuMzEzMTcsLTEuNjEzMTYgLTEuMzEzMTcsLTEuNjEzMTYgLTMuNDgzMiwtMS41Njc0NGMtMi4xNzAwMywtMC4wNDU3MiAtMi4xNzAwMywtMC4wNDU3MiAtMy40ODMyLDEuNTY3NDR6TTIzNi41MTY4LDIwNi42MzgzOGMtMC4yMzIyMSwyLjA4OTkyIC0wLjIzMjIxLDIuMDg5OTIgMCw0LjE3OTg0YzEuMzEzMTcsMS42MTMxNiAxLjMxMzE3LDEuNjEzMTYgMy40ODMyLDEuNTY3NDRjMi4xNzAwMywwLjA0NTcyIDIuMTcwMDMsMC4wNDU3MiAzLjQ4MzIsLTEuNTY3NDRjMC4yMzIyMSwtMi4wODk5MiAwLjIzMjIxLC0yLjA4OTkyIDAsLTQuMTc5ODRjLTEuMzEzMTcsLTEuNjEzMTYgLTEuMzEzMTcsLTEuNjEzMTYgLTMuNDgzMiwtMS41Njc0NGMtMi4xNzAwMywtMC4wNDU3MiAtMi4xNzAwMywtMC4wNDU3MiAtMy40ODMyLDEuNTY3NDR6TTI1Ni4wMjI3LDIwNi42MzgzOGMtMC4yMzIyMSwyLjA4OTkyIC0wLjIzMjIxLDIuMDg5OTIgMCw0LjE3OTg0YzEuMzEzMTcsMS42MTMxNiAxLjMxMzE3LDEuNjEzMTYgMy40ODMyLDEuNTY3NDRjMi4xNzAwMywwLjA0NTcyIDIuMTcwMDMsMC4wNDU3MiAzLjQ4MzIsLTEuNTY3NDRjMC4yMzIyMSwtMi4wODk5MiAwLjIzMjIxLC0yLjA4OTkyIDAsLTQuMTc5ODRjLTEuMzEzMTcsLTEuNjEzMTYgLTEuMzEzMTcsLTEuNjEzMTYgLTMuNDgzMiwtMS41Njc0NGMtMi4xNzAwMywtMC4wNDU3MiAtMi4xNzAwMywtMC4wNDU3MiAtMy40ODMyLDEuNTY3NDR6TTIyMi4yOTI4NSwxNDguNDk2MjNjMi41NzcyOSwwLjQ5MTMxIDMuNjk4MzksMS42OTgzNyA1LjE2NzY1LDMuODA0MzFjMCwwLjY4OTY3IDAsMS4zNzkzNSAwLDIuMDg5OTJjMS44MzkxMywwIDMuNjc4MjUsMCA1LjU3MzExLDBjMC4wNTc0NywtMC40MDIzMSAwLjExNDk1LC0wLjgwNDYyIDAuMTc0MTYsLTEuMjE5MTJjMC43Mzg2MSwtMi4yMTU4MSAxLjM1ODMxLC0zLjAyMTggMy4zMDkwMywtNC4zNTM5OWMyLjQwMTMsLTAuNDQyMTMgNC41NjY3NiwtMC40NTc0NCA2Ljk2NjM5LDBjMi4xNzY5OSwxLjYxMDk4IDIuMTc2OTksMS42MTA5OCAzLjQ4MzIsMy40ODMyYzAsMC42ODk2NyAwLDEuMzc5MzUgMCwyLjA4OTkyYzEuODM5MTMsMCAzLjY3ODI1LDAgNS41NzMxMSwwYzAuMDU3NDcsLTAuNDAyMzEgMC4xMTQ5NSwtMC44MDQ2MiAwLjE3NDE2LC0xLjIxOTEyYzAuNzM4NjEsLTIuMjE1ODEgMS4zNTgzMSwtMy4wMjE4IDMuMzA5MDMsLTQuMzUzOTljMi40MDEzLC0wLjQ0MjEzIDQuNTY2NzYsLTAuNDU3NDQgNi45NjYzOSwwYzIuMTc2OTksMS42MTA5OCAyLjE3Njk5LDEuNjEwOTggMy40ODMyLDMuNDgzMmMwLDAuNjg5NjcgMCwxLjM3OTM1IDAsMi4wODk5MmMxLjgzOTEzLDAgMy42NzgyNSwwIDUuNTczMTEsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMS44MzkxMywwIC0zLjY3ODI1LDAgLTUuNTczMTEsMGMtMC4wNTc0NywwLjQwMjMxIC0wLjExNDk1LDAuODA0NjIgLTAuMTc0MTYsMS4yMTkxMmMtMC43Mzg2MSwyLjIxNTgxIC0xLjM1ODMxLDMuMDIxOCAtMy4zMDkwMyw0LjM1Mzk5Yy0yLjQwMTMsMC40NDIxMyAtNC41NjY3NiwwLjQ1NzQ0IC02Ljk2NjM5LDBjLTIuMTc2OTksLTEuNjEwOTggLTIuMTc2OTksLTEuNjEwOTggLTMuNDgzMiwtMy40ODMyYzAsLTAuNjg5NjcgMCwtMS4zNzkzNSAwLC0yLjA4OTkyYy0xLjgzOTEzLDAgLTMuNjc4MjUsMCAtNS41NzMxMSwwYy0wLjA1NzQ3LDAuNDAyMzEgLTAuMTE0OTUsMC44MDQ2MiAtMC4xNzQxNiwxLjIxOTEyYy0wLjczODYxLDIuMjE1ODEgLTEuMzU4MzEsMy4wMjE4IC0zLjMwOTAzLDQuMzUzOTljLTIuNDAxMywwLjQ0MjEzIC00LjU2Njc2LDAuNDU3NDQgLTYuOTY2MzksMGMtMi4xNzY5OSwtMS42MTA5OCAtMi4xNzY5OSwtMS42MTA5OCAtMy40ODMyLC0zLjQ4MzJjMCwtMC42ODk2NyAwLC0xLjM3OTM1IDAsLTIuMDg5OTJjLTEuODM5MTMsMCAtMy42NzgyNSwwIC01LjU3MzExLDBjLTAuMDU3NDcsMC40MDIzMSAtMC4xMTQ5NSwwLjgwNDYyIC0wLjE3NDE2LDEuMjE5MTJjLTAuNzM4NjEsMi4yMTU4MSAtMS4zNTgzMSwzLjAyMTggLTMuMzA5MDMsNC4zNTM5OWMtMi40MDEzLDAuNDQyMTMgLTQuNTY2NzYsMC40NTc0NCAtNi45NjYzOSwwYy0yLjE3Njk5LC0xLjYxMDk4IC0yLjE3Njk5LC0xLjYxMDk4IC0zLjQ4MzIsLTMuNDgzMmMwLC0wLjY4OTY3IDAsLTEuMzc5MzUgMCwtMi4wODk5MmMtMS44MzkxMywwIC0zLjY3ODI1LDAgLTUuNTczMTEsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NmMxLjgzOTEzLDAgMy42NzgyNSwwIDUuNTczMTEsMGMwLjA1NzQ3LC0wLjQwMjMxIDAuMTE0OTUsLTAuODA0NjIgMC4xNzQxNiwtMS4yMTkxMmMxLjQ3Mzk1LC00LjQyMTg1IDQuMzQxNywtNC44MzgyOSA4LjU5MDk3LC00LjY3NTF6TTIxNy4wMTA5MSwxNTMuNjkzODFjLTAuMjMyMjEsMi4wODk5MiAtMC4yMzIyMSwyLjA4OTkyIDAsNC4xNzk4NGMxLjMxMzE3LDEuNjEzMTYgMS4zMTMxNywxLjYxMzE2IDMuNDgzMiwxLjU2NzQ0YzIuMTcwMDMsMC4wNDU3MiAyLjE3MDAzLDAuMDQ1NzIgMy40ODMyLC0xLjU2NzQ0YzAuMjMyMjEsLTIuMDg5OTIgMC4yMzIyMSwtMi4wODk5MiAwLC00LjE3OTg0Yy0xLjMxMzE3LC0xLjYxMzE2IC0xLjMxMzE3LC0xLjYxMzE2IC0zLjQ4MzIsLTEuNTY3NDRjLTIuMTcwMDMsLTAuMDQ1NzIgLTIuMTcwMDMsLTAuMDQ1NzIgLTMuNDgzMiwxLjU2NzQ0ek0yMzYuNTE2OCwxNTMuNjkzODFjLTAuMjMyMjEsMi4wODk5MiAtMC4yMzIyMSwyLjA4OTkyIDAsNC4xNzk4NGMxLjMxMzE3LDEuNjEzMTYgMS4zMTMxNywxLjYxMzE2IDMuNDgzMiwxLjU2NzQ0YzIuMTcwMDMsMC4wNDU3MiAyLjE3MDAzLDAuMDQ1NzIgMy40ODMyLC0xLjU2NzQ0YzAuMjMyMjEsLTIuMDg5OTIgMC4yMzIyMSwtMi4wODk5MiAwLC00LjE3OTg0Yy0xLjMxMzE3LC0xLjYxMzE2IC0xLjMxMzE3LC0xLjYxMzE2IC0zLjQ4MzIsLTEuNTY3NDRjLTIuMTcwMDMsLTAuMDQ1NzIgLTIuMTcwMDMsLTAuMDQ1NzIgLTMuNDgzMiwxLjU2NzQ0ek0yNTYuMDIyNywxNTMuNjkzODFjLTAuMjMyMjEsMi4wODk5MiAtMC4yMzIyMSwyLjA4OTkyIDAsNC4xNzk4NGMxLjMxMzE3LDEuNjEzMTYgMS4zMTMxNywxLjYxMzE2IDMuNDgzMiwxLjU2NzQ0YzIuMTcwMDMsMC4wNDU3MiAyLjE3MDAzLDAuMDQ1NzIgMy40ODMyLC0xLjU2NzQ0YzAuMjMyMjEsLTIuMDg5OTIgMC4yMzIyMSwtMi4wODk5MiAwLC00LjE3OTg0Yy0xLjMxMzE3LC0xLjYxMzE2IC0xLjMxMzE3LC0xLjYxMzE2IC0zLjQ4MzIsLTEuNTY3NDRjLTIuMTcwMDMsLTAuMDQ1NzIgLTIuMTcwMDMsLTAuMDQ1NzIgLTMuNDgzMiwxLjU2NzQ0ek0yODAuNDA1MDYsMjA3LjMzNTAyYzAuOTE5NTYsMCAxLjgzOTEzLDAgMi43ODY1NiwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0wLjkxOTU2LDAgLTEuODM5MTMsMCAtMi43ODY1NiwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2ek0yNzQuODMxOTUsMjA3LjMzNTAyYzAuOTE5NTYsMCAxLjgzOTEzLDAgMi43ODY1NiwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0wLjkxOTU2LDAgLTEuODM5MTMsMCAtMi43ODY1NiwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2ek0yMDIuMzgxNDksMjA3LjMzNTAyYzAuOTE5NTYsMCAxLjgzOTEzLDAgMi43ODY1NiwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0wLjkxOTU2LDAgLTEuODM5MTMsMCAtMi43ODY1NiwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2ek0xOTYuODA4MzgsMjA3LjMzNTAyYzAuOTE5NTYsMCAxLjgzOTEzLDAgMi43ODY1NiwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0wLjkxOTU2LDAgLTEuODM5MTMsMCAtMi43ODY1NiwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2ek0yODAuNDA1MDYsMTU0LjM5MDQ1YzAuOTE5NTYsMCAxLjgzOTEzLDAgMi43ODY1NiwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0wLjkxOTU2LDAgLTEuODM5MTMsMCAtMi43ODY1NiwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2ek0yNzQuODMxOTUsMTU0LjM5MDQ1YzAuOTE5NTYsMCAxLjgzOTEzLDAgMi43ODY1NiwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0wLjkxOTU2LDAgLTEuODM5MTMsMCAtMi43ODY1NiwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2ek0yMDIuMzgxNDksMTU0LjM5MDQ1YzAuOTE5NTYsMCAxLjgzOTEzLDAgMi43ODY1NiwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0wLjkxOTU2LDAgLTEuODM5MTMsMCAtMi43ODY1NiwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2ek0xOTYuODA4MzgsMTU0LjM5MDQ1YzAuOTE5NTYsMCAxLjgzOTEzLDAgMi43ODY1NiwwYzAsMC45MTk1NiAwLDEuODM5MTMgMCwyLjc4NjU2Yy0wLjkxOTU2LDAgLTEuODM5MTMsMCAtMi43ODY1NiwwYzAsLTAuOTE5NTYgMCwtMS44MzkxMyAwLC0yLjc4NjU2eiIgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlLW9wYWNpdHk9IjAuMjMxMzciIHN0cm9rZT0iIzAwMDAwMCIgc3Ryb2tlLXdpZHRoPSI1Ii8+PGcgZmlsbD0iI2ZmZmZmZiIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjEiPjxwYXRoIGQ9Ik0yMjIuMjkyODUsMjAxLjQ0MDhjMi41NzcyOSwwLjQ5MTMxIDMuNjk4MzksMS42OTgzNyA1LjE2NzY1LDMuODA0MzFjMCwwLjY4OTY3IDAsMS4zNzkzNSAwLDIuMDg5OTJjMS44MzkxMywwIDMuNjc4MjUsMCA1LjU3MzExLDBjMC4wNTc0NywtMC40MDIzMSAwLjExNDk1LC0wLjgwNDYyIDAuMTc0MTYsLTEuMjE5MTJjMC43Mzg2MSwtMi4yMTU4MSAxLjM1ODMxLC0zLjAyMTggMy4zMDkwMywtNC4zNTM5OWMyLjQwMTMsLTAuNDQyMTMgNC41NjY3NiwtMC40NTc0NCA2Ljk2NjM5LDBjMi4xNzY5OSwxLjYxMDk4IDIuMTc2OTksMS42MTA5OCAzLjQ4MzIsMy40ODMyYzAsMC42ODk2NyAwLDEuMzc5MzUgMCwyLjA4OTkyYzEuODM5MTMsMCAzLjY3ODI1LDAgNS41NzMxMSwwYzAuMDU3NDcsLTAuNDAyMzEgMC4xMTQ5NSwtMC44MDQ2MiAwLjE3NDE2LC0xLjIxOTEyYzAuNzM4NjEsLTIuMjE1ODEgMS4zNTgzMSwtMy4wMjE4IDMuMzA5MDMsLTQuMzUzOTljMi40MDEzLC0wLjQ0MjEzIDQuNTY2NzYsLTAuNDU3NDQgNi45NjYzOSwwYzIuMTc2OTksMS42MTA5OCAyLjE3Njk5LDEuNjEwOTggMy40ODMyLDMuNDgzMmMwLDAuNjg5NjcgMCwxLjM3OTM1IDAsMi4wODk5MmMxLjgzOTEzLDAgMy42NzgyNSwwIDUuNTczMTEsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMS44MzkxMywwIC0zLjY3ODI1LDAgLTUuNTczMTEsMGMtMC4wNTc0NywwLjQwMjMxIC0wLjExNDk1LDAuODA0NjIgLTAuMTc0MTYsMS4yMTkxMmMtMC43Mzg2MSwyLjIxNTgxIC0xLjM1ODMxLDMuMDIxOCAtMy4zMDkwMyw0LjM1Mzk5Yy0yLjQwMTMsMC40NDIxMyAtNC41NjY3NiwwLjQ1NzQ0IC02Ljk2NjM5LDBjLTIuMTc2OTksLTEuNjEwOTggLTIuMTc2OTksLTEuNjEwOTggLTMuNDgzMiwtMy40ODMyYzAsLTAuNjg5NjcgMCwtMS4zNzkzNSAwLC0yLjA4OTkyYy0xLjgzOTEzLDAgLTMuNjc4MjUsMCAtNS41NzMxMSwwYy0wLjA1NzQ3LDAuNDAyMzEgLTAuMTE0OTUsMC44MDQ2MiAtMC4xNzQxNiwxLjIxOTEyYy0wLjczODYxLDIuMjE1ODEgLTEuMzU4MzEsMy4wMjE4IC0zLjMwOTAzLDQuMzUzOTljLTIuNDAxMywwLjQ0MjEzIC00LjU2Njc2LDAuNDU3NDQgLTYuOTY2MzksMGMtMi4xNzY5OSwtMS42MTA5OCAtMi4xNzY5OSwtMS42MTA5OCAtMy40ODMyLC0zLjQ4MzJjMCwtMC42ODk2NyAwLC0xLjM3OTM1IDAsLTIuMDg5OTJjLTEuODM5MTMsMCAtMy42NzgyNSwwIC01LjU3MzExLDBjLTAuMDU3NDcsMC40MDIzMSAtMC4xMTQ5NSwwLjgwNDYyIC0wLjE3NDE2LDEuMjE5MTJjLTAuNzM4NjEsMi4yMTU4MSAtMS4zNTgzMSwzLjAyMTggLTMuMzA5MDMsNC4zNTM5OWMtMi40MDEzLDAuNDQyMTMgLTQuNTY2NzYsMC40NTc0NCAtNi45NjYzOSwwYy0yLjE3Njk5LC0xLjYxMDk4IC0yLjE3Njk5LC0xLjYxMDk4IC0zLjQ4MzIsLTMuNDgzMmMwLC0wLjY4OTY3IDAsLTEuMzc5MzUgMCwtMi4wODk5MmMtMS44MzkxMywwIC0zLjY3ODI1LDAgLTUuNTczMTEsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NmMxLjgzOTEzLDAgMy42NzgyNSwwIDUuNTczMTEsMGMwLjA1NzQ3LC0wLjQwMjMxIDAuMTE0OTUsLTAuODA0NjIgMC4xNzQxNiwtMS4yMTkxMmMxLjQ3Mzk1LC00LjQyMTg1IDQuMzQxNywtNC44MzgyOSA4LjU5MDk3LC00LjY3NTF6TTIxNy4wMTA5MSwyMDYuNjM4MzhjLTAuMjMyMjEsMi4wODk5MiAtMC4yMzIyMSwyLjA4OTkyIDAsNC4xNzk4NGMxLjMxMzE3LDEuNjEzMTYgMS4zMTMxNywxLjYxMzE2IDMuNDgzMiwxLjU2NzQ0YzIuMTcwMDMsMC4wNDU3MiAyLjE3MDAzLDAuMDQ1NzIgMy40ODMyLC0xLjU2NzQ0YzAuMjMyMjEsLTIuMDg5OTIgMC4yMzIyMSwtMi4wODk5MiAwLC00LjE3OTg0Yy0xLjMxMzE3LC0xLjYxMzE2IC0xLjMxMzE3LC0xLjYxMzE2IC0zLjQ4MzIsLTEuNTY3NDRjLTIuMTcwMDMsLTAuMDQ1NzIgLTIuMTcwMDMsLTAuMDQ1NzIgLTMuNDgzMiwxLjU2NzQ0ek0yMzYuNTE2OCwyMDYuNjM4MzhjLTAuMjMyMjEsMi4wODk5MiAtMC4yMzIyMSwyLjA4OTkyIDAsNC4xNzk4NGMxLjMxMzE3LDEuNjEzMTYgMS4zMTMxNywxLjYxMzE2IDMuNDgzMiwxLjU2NzQ0YzIuMTcwMDMsMC4wNDU3MiAyLjE3MDAzLDAuMDQ1NzIgMy40ODMyLC0xLjU2NzQ0YzAuMjMyMjEsLTIuMDg5OTIgMC4yMzIyMSwtMi4wODk5MiAwLC00LjE3OTg0Yy0xLjMxMzE3LC0xLjYxMzE2IC0xLjMxMzE3LC0xLjYxMzE2IC0zLjQ4MzIsLTEuNTY3NDRjLTIuMTcwMDMsLTAuMDQ1NzIgLTIuMTcwMDMsLTAuMDQ1NzIgLTMuNDgzMiwxLjU2NzQ0ek0yNTYuMDIyNywyMDYuNjM4MzhjLTAuMjMyMjEsMi4wODk5MiAtMC4yMzIyMSwyLjA4OTkyIDAsNC4xNzk4NGMxLjMxMzE3LDEuNjEzMTYgMS4zMTMxNywxLjYxMzE2IDMuNDgzMiwxLjU2NzQ0YzIuMTcwMDMsMC4wNDU3MiAyLjE3MDAzLDAuMDQ1NzIgMy40ODMyLC0xLjU2NzQ0YzAuMjMyMjEsLTIuMDg5OTIgMC4yMzIyMSwtMi4wODk5MiAwLC00LjE3OTg0Yy0xLjMxMzE3LC0xLjYxMzE2IC0xLjMxMzE3LC0xLjYxMzE2IC0zLjQ4MzIsLTEuNTY3NDRjLTIuMTcwMDMsLTAuMDQ1NzIgLTIuMTcwMDMsLTAuMDQ1NzIgLTMuNDgzMiwxLjU2NzQ0eiIvPjxwYXRoIGQ9Ik0yMjIuMjkyODUsMTQ4LjQ5NjIzYzIuNTc3MjksMC40OTEzMSAzLjY5ODM5LDEuNjk4MzcgNS4xNjc2NSwzLjgwNDMxYzAsMC42ODk2NyAwLDEuMzc5MzUgMCwyLjA4OTkyYzEuODM5MTMsMCAzLjY3ODI1LDAgNS41NzMxMSwwYzAuMDU3NDcsLTAuNDAyMzEgMC4xMTQ5NSwtMC44MDQ2MiAwLjE3NDE2LC0xLjIxOTEyYzAuNzM4NjEsLTIuMjE1ODEgMS4zNTgzMSwtMy4wMjE4IDMuMzA5MDMsLTQuMzUzOTljMi40MDEzLC0wLjQ0MjEzIDQuNTY2NzYsLTAuNDU3NDQgNi45NjYzOSwwYzIuMTc2OTksMS42MTA5OCAyLjE3Njk5LDEuNjEwOTggMy40ODMyLDMuNDgzMmMwLDAuNjg5NjcgMCwxLjM3OTM1IDAsMi4wODk5MmMxLjgzOTEzLDAgMy42NzgyNSwwIDUuNTczMTEsMGMwLjA1NzQ3LC0wLjQwMjMxIDAuMTE0OTUsLTAuODA0NjIgMC4xNzQxNiwtMS4yMTkxMmMwLjczODYxLC0yLjIxNTgxIDEuMzU4MzEsLTMuMDIxOCAzLjMwOTAzLC00LjM1Mzk5YzIuNDAxMywtMC40NDIxMyA0LjU2Njc2LC0wLjQ1NzQ0IDYuOTY2MzksMGMyLjE3Njk5LDEuNjEwOTggMi4xNzY5OSwxLjYxMDk4IDMuNDgzMiwzLjQ4MzJjMCwwLjY4OTY3IDAsMS4zNzkzNSAwLDIuMDg5OTJjMS44MzkxMywwIDMuNjc4MjUsMCA1LjU3MzExLDBjMCwwLjkxOTU2IDAsMS44MzkxMyAwLDIuNzg2NTZjLTEuODM5MTMsMCAtMy42NzgyNSwwIC01LjU3MzExLDBjLTAuMDU3NDcsMC40MDIzMSAtMC4xMTQ5NSwwLjgwNDYyIC0wLjE3NDE2LDEuMjE5MTJjLTAuNzM4NjEsMi4yMTU4MSAtMS4zNTgzMSwzLjAyMTggLTMuMzA5MDMsNC4zNTM5OWMtMi40MDEzLDAuNDQyMTMgLTQuNTY2NzYsMC40NTc0NCAtNi45NjYzOSwwYy0yLjE3Njk5LC0xLjYxMDk4IC0yLjE3Njk5LC0xLjYxMDk4IC0zLjQ4MzIsLTMuNDgzMmMwLC0wLjY4OTY3IDAsLTEuMzc5MzUgMCwtMi4wODk5MmMtMS44MzkxMywwIC0zLjY3ODI1LDAgLTUuNTczMTEsMGMtMC4wNTc0NywwLjQwMjMxIC0wLjExNDk1LDAuODA0NjIgLTAuMTc0MTYsMS4yMTkxMmMtMC43Mzg2MSwyLjIxNTgxIC0xLjM1ODMxLDMuMDIxOCAtMy4zMDkwMyw0LjM1Mzk5Yy0yLjQwMTMsMC40NDIxMyAtNC41NjY3NiwwLjQ1NzQ0IC02Ljk2NjM5LDBjLTIuMTc2OTksLTEuNjEwOTggLTIuMTc2OTksLTEuNjEwOTggLTMuNDgzMiwtMy40ODMyYzAsLTAuNjg5NjcgMCwtMS4zNzkzNSAwLC0yLjA4OTkyYy0xLjgzOTEzLDAgLTMuNjc4MjUsMCAtNS41NzMxMSwwYy0wLjA1NzQ3LDAuNDAyMzEgLTAuMTE0OTUsMC44MDQ2MiAtMC4xNzQxNiwxLjIxOTEyYy0wLjczODYxLDIuMjE1ODEgLTEuMzU4MzEsMy4wMjE4IC0zLjMwOTAzLDQuMzUzOTljLTIuNDAxMywwLjQ0MjEzIC00LjU2Njc2LDAuNDU3NDQgLTYuOTY2MzksMGMtMi4xNzY5OSwtMS42MTA5OCAtMi4xNzY5OSwtMS42MTA5OCAtMy40ODMyLC0zLjQ4MzJjMCwtMC42ODk2NyAwLC0xLjM3OTM1IDAsLTIuMDg5OTJjLTEuODM5MTMsMCAtMy42NzgyNSwwIC01LjU3MzExLDBjMCwtMC45MTk1NiAwLC0xLjgzOTEzIDAsLTIuNzg2NTZjMS44MzkxMywwIDMuNjc4MjUsMCA1LjU3MzExLDBjMC4wNTc0NywtMC40MDIzMSAwLjExNDk1LC0wLjgwNDYyIDAuMTc0MTYsLTEuMjE5MTJjMS40NzM5NSwtNC40MjE4NSA0LjM0MTcsLTQuODM4MjkgOC41OTA5NywtNC42NzUxek0yMTcuMDEwOTEsMTUzLjY5MzgxYy0wLjIzMjIxLDIuMDg5OTIgLTAuMjMyMjEsMi4wODk5MiAwLDQuMTc5ODRjMS4zMTMxNywxLjYxMzE2IDEuMzEzMTcsMS42MTMxNiAzLjQ4MzIsMS41Njc0NGMyLjE3MDAzLDAuMDQ1NzIgMi4xNzAwMywwLjA0NTcyIDMuNDgzMiwtMS41Njc0NGMwLjIzMjIxLC0yLjA4OTkyIDAuMjMyMjEsLTIuMDg5OTIgMCwtNC4xNzk4NGMtMS4zMTMxNywtMS42MTMxNiAtMS4zMTMxNywtMS42MTMxNiAtMy40ODMyLC0xLjU2NzQ0Yy0yLjE3MDAzLC0wLjA0NTcyIC0yLjE3MDAzLC0wLjA0NTcyIC0zLjQ4MzIsMS41Njc0NHpNMjM2LjUxNjgsMTUzLjY5MzgxYy0wLjIzMjIxLDIuMDg5OTIgLTAuMjMyMjEsMi4wODk5MiAwLDQuMTc5ODRjMS4zMTMxNywxLjYxMzE2IDEuMzEzMTcsMS42MTMxNiAzLjQ4MzIsMS41Njc0NGMyLjE3MDAzLDAuMDQ1NzIgMi4xNzAwMywwLjA0NTcyIDMuNDgzMiwtMS41Njc0NGMwLjIzMjIxLC0yLjA4OTkyIDAuMjMyMjEsLTIuMDg5OTIgMCwtNC4xNzk4NGMtMS4zMTMxNywtMS42MTMxNiAtMS4zMTMxNywtMS42MTMxNiAtMy40ODMyLC0xLjU2NzQ0Yy0yLjE3MDAzLC0wLjA0NTcyIC0yLjE3MDAzLC0wLjA0NTcyIC0zLjQ4MzIsMS41Njc0NHpNMjU2LjAyMjcsMTUzLjY5MzgxYy0wLjIzMjIxLDIuMDg5OTIgLTAuMjMyMjEsMi4wODk5MiAwLDQuMTc5ODRjMS4zMTMxNywxLjYxMzE2IDEuMzEzMTcsMS42MTMxNiAzLjQ4MzIsMS41Njc0NGMyLjE3MDAzLDAuMDQ1NzIgMi4xNzAwMywwLjA0NTcyIDMuNDgzMiwtMS41Njc0NGMwLjIzMjIxLC0yLjA4OTkyIDAuMjMyMjEsLTIuMDg5OTIgMCwtNC4xNzk4NGMtMS4zMTMxNywtMS42MTMxNiAtMS4zMTMxNywtMS42MTMxNiAtMy40ODMyLC0xLjU2NzQ0Yy0yLjE3MDAzLC0wLjA0NTcyIC0yLjE3MDAzLC0wLjA0NTcyIC0zLjQ4MzIsMS41Njc0NHoiLz48cGF0aCBkPSJNMjgwLjQwNTA2LDIwNy4zMzUwMmMwLjkxOTU2LDAgMS44MzkxMywwIDIuNzg2NTYsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMC45MTk1NiwwIC0xLjgzOTEzLDAgLTIuNzg2NTYsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NnoiLz48cGF0aCBkPSJNMjc0LjgzMTk1LDIwNy4zMzUwMmMwLjkxOTU2LDAgMS44MzkxMywwIDIuNzg2NTYsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMC45MTk1NiwwIC0xLjgzOTEzLDAgLTIuNzg2NTYsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NnoiLz48cGF0aCBkPSJNMjAyLjM4MTQ5LDIwNy4zMzUwMmMwLjkxOTU2LDAgMS44MzkxMywwIDIuNzg2NTYsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMC45MTk1NiwwIC0xLjgzOTEzLDAgLTIuNzg2NTYsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NnoiLz48cGF0aCBkPSJNMTk2LjgwODM4LDIwNy4zMzUwMmMwLjkxOTU2LDAgMS44MzkxMywwIDIuNzg2NTYsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMC45MTk1NiwwIC0xLjgzOTEzLDAgLTIuNzg2NTYsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NnoiLz48cGF0aCBkPSJNMjgwLjQwNTA2LDE1NC4zOTA0NWMwLjkxOTU2LDAgMS44MzkxMywwIDIuNzg2NTYsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMC45MTk1NiwwIC0xLjgzOTEzLDAgLTIuNzg2NTYsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NnoiLz48cGF0aCBkPSJNMjc0LjgzMTk1LDE1NC4zOTA0NWMwLjkxOTU2LDAgMS44MzkxMywwIDIuNzg2NTYsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMC45MTk1NiwwIC0xLjgzOTEzLDAgLTIuNzg2NTYsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NnoiLz48cGF0aCBkPSJNMjAyLjM4MTQ5LDE1NC4zOTA0NWMwLjkxOTU2LDAgMS44MzkxMywwIDIuNzg2NTYsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMC45MTk1NiwwIC0xLjgzOTEzLDAgLTIuNzg2NTYsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NnoiLz48cGF0aCBkPSJNMTk2LjgwODM4LDE1NC4zOTA0NWMwLjkxOTU2LDAgMS44MzkxMywwIDIuNzg2NTYsMGMwLDAuOTE5NTYgMCwxLjgzOTEzIDAsMi43ODY1NmMtMC45MTk1NiwwIC0xLjgzOTEzLDAgLTIuNzg2NTYsMGMwLC0wLjkxOTU2IDAsLTEuODM5MTMgMCwtMi43ODY1NnoiLz48L2c+PHBhdGggZD0iTTE5MS4yNSwyMjguNzV2LTk3LjVoOTcuNXY5Ny41eiIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJub25lIiBzdHJva2Utd2lkdGg9IjAiLz48L2c+PC9nPjwvc3ZnPjwhLS1yb3RhdGlvbkNlbnRlcjo0OC43NTAwMDAwMDAwMDAwMzo0OC43NS0tPg==",
                color1: NODE1,
                color2: NODE2,

                blocks: [
                    {
                        blockType: Scratch.BlockType.LABEL,
                        text: "By ZiploxZQS and OutsideFlight, may be updated later"
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
