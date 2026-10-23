
(function (Scratch) {
    "use strict";

    if (!Scratch || !Scratch.extensions) return;

    let html = [
        "<!doctype html>",
        '<html lang="vi">',
        "<head>",
        '<meta charset="utf-8">',
        "<title>Penguin HTML</title>",
        "</head>",
        "<body>",
        "<h1>Hello from Penguin HTML!</h1>",
        "</body>",
        "</html>"
    ].join("");

    const icon =
        "https://upload.wikimedia.org/wikipedia/commons/6/61/HTML5_logo_and_wordmark.svg";

    class PenguinHTML {
        getInfo() {
            return {
                id: "penguinhtmlgid12345609",
                name: "Penguin HTML",
                color1: "#E34F26",
                color2: "#C83D20",
                color3: "#922B18",
                menuIconURI: icon,
                blocks: [
                    {
                        opcode: "setHTML",
                        blockType: Scratch.BlockType.COMMAND,
                        text: "set project HTML to [HTML]",
                        arguments: {
                            HTML: {
                                type: Scratch.ArgumentType.STRING,
                                defaultValue: "<h1>Hello!</h1>"
                            }
                        }
                    },
                    {
                        opcode: "projectHTML",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "project HTML"
                    },
                    {
                        opcode: "htmlLink",
                        blockType: Scratch.BlockType.REPORTER,
                        text: "project HTML data link"
                    }
                ]
            };
        }

        setHTML(args) {
            html = String(args.HTML ?? "");
        }

        projectHTML() {
            return html;
        }

        htmlLink() {
            return "data:text/html;charset=utf-8," +
                encodeURIComponent(html);
        }
    }

    Scratch.extensions.register(new PenguinHTML());
})(Scratch);
