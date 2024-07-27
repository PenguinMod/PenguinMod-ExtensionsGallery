(async function(Scratch) {
    const variables = {};
    const blocks = [];
    const menus = {};


    if (!Scratch.extensions.unsandboxed) {
        alert("WebBuilder needs to be unsandboxed to run!")
        return
    }
    class Extension {
        getInfo() {
            return {
                "id": "webbuilderv11beta",
                "name": "WebBuilder v1.1 BETA",
                "color1": "#6b7985",
                "color2": "#555a5e",
                "blocks": blocks,
                "menus": menus
            }
        }
    }
    blocks.push({
        opcode: "buildwebsite",
        blockType: Scratch.BlockType.COMMAND,
        text: "Build website",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["buildwebsite"] = async (args, util) => {
        variables['website'] = ('<!-- This website was built with WebBuilder. -->' + ("\n" + ('<!DOCTYPE html>' + ("\n" + ('<html>' + ("\n" + ('<head>' + ("\n" + ('<title>' + (variables['title'] + ('</title>' + ("\n" + ('<link rel=\"icon\" type=\"image/x-icon\" href=\"' + (variables['favicon'] + ('\">' + ("\n" + ('</head>' + ("\n" + ('<body>' + ("\n" + (variables['body'] + ("\n" + ('<script src=\"' + (variables['script'] + ('\"></script>' + ("\n" + ('<h5>This website was made using WebBuilder.</h5>' + ("\n" + ('</body>' + ("\n" + '</html>'))))))))))))))))))))))))))))))
    };

    blocks.push({
        opcode: "addlabel",
        blockType: Scratch.BlockType.COMMAND,
        text: "Add label with text: [TEXT]",
        arguments: {
            "TEXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'This is a label.',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["addlabel"] = async (args, util) => {
        variables['body'] = (variables['body'] + ("\n" + ('<p>' + (args["TEXT"] + '</p>'))))
        variables['structure'] = (variables['structure'] + ("\n" + ('Label: ' + args["TEXT"])))
    };

    blocks.push({
        opcode: "websitestructure",
        blockType: Scratch.BlockType.REPORTER,
        text: "Website structure",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["websitestructure"] = async (args, util) => {
        return variables['structure']
    };

    menus["heasize"] = {
        acceptReporters: true,
        items: [...[...[...[...[...[...[], '1 (Biggest)'], '2'], '3'], '4'], '5'], '6']
    }

    blocks.push({
        opcode: "addbutton",
        blockType: Scratch.BlockType.COMMAND,
        text: "Add button with JS code: [JSCODE], text: [TEXT]",
        arguments: {
            "JSCODE": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'alert(\"Button has been clicked.\");',
            },
            "TEXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'This is a button. Click me!',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["addbutton"] = async (args, util) => {
        variables['body'] = (variables['body'] + ("\n" + ('<button onclick=\'' + (args["JSCODE"] + ('\'>' + (args["TEXT"] + '</button>'))))))
        variables['structure'] = (variables['structure'] + ("\n" + ('Button: ' + args["TEXT"])))
    };

    blocks.push({
        opcode: "websitecode",
        blockType: Scratch.BlockType.REPORTER,
        text: "Website code",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["websitecode"] = async (args, util) => {
        return variables['website']
    };

    blocks.push({
        opcode: "changetitle",
        blockType: Scratch.BlockType.COMMAND,
        text: "Create Website: Page Title: [TITLE], Page icon (Favicon): [FAVICON] (URL)",
        arguments: {
            "TITLE": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'My Website with WebBuilder',
            },
            "FAVICON": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/favicon.ico',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["changetitle"] = async (args, util) => {
        variables['title'] = args["TITLE"]
        variables['favicon'] = args["FAVICON"]
        variables['body'] = '<p></p>'
        variables['structure'] = 'Structure:'
        variables['script'] = 'https://example.com/script.js'
    };

    blocks.push({
        opcode: "addheader",
        blockType: Scratch.BlockType.COMMAND,
        text: "Add header with size: [SIZE], text: [TEXT]",
        arguments: {
            "TEXT": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'This is a header.',
            },
            "SIZE": {
                type: Scratch.ArgumentType.STRING,
                menu: 'heasize'
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["addheader"] = async (args, util) => {
        if (Boolean((args["SIZE"] == '1 (Biggest)'))) {
            variables['headersize'] = '1'

        } else {
            variables['headersize'] = args["SIZE"]

        };
        variables['body'] = (variables['body'] + ("\n" + ('<h' + (variables['headersize'] + ('>' + (args["TEXT"] + ('</h' + (variables['headersize'] + '>'))))))))
        variables['structure'] = (variables['structure'] + ("\n" + ('Header: ' + args["TEXT"])))
    };

    blocks.push({
        opcode: "addscript",
        blockType: Scratch.BlockType.COMMAND,
        text: "Add external script from [URL] URL.",
        arguments: {
            "URL": {
                type: Scratch.ArgumentType.STRING,
                defaultValue: 'https://example.com/script.js',
            },
        },
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["addscript"] = async (args, util) => {
        variables['script'] = args["URL"]
    };

    blocks.push({
        opcode: "clearwebsite",
        blockType: Scratch.BlockType.COMMAND,
        text: "Remove all items",
        arguments: {},
        disableMonitor: true,
        isEdgeActivated: false
    });
    Extension.prototype["clearwebsite"] = async (args, util) => {
        variables['body'] = '<p></p>'
        variables['structure'] = 'Structure:'
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
