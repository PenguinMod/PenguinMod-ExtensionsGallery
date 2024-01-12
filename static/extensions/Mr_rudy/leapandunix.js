(async function (Scratch) {
    const blocks = [];

    class Extension {
        getInfo() {
            return {
                "id": "unixandleapUtils",
                "name": "Unix and Leap Year",
                "color1": "#4e6273",
                "color2": "#212c36",
                "blocks": blocks
            };
        }
    }

    blocks.push({
        opcode: `leap_year`,
        blockType: Scratch.BlockType.BOOLEAN,
        text: `Is it currently a leap year?`,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype[`leap_year`] = async () => {
        return new Date(new Date(Date.now()).getYear(), 1, 29).getDate() === 29;
    };

    blocks.push({
        opcode: `ms_since_1970`,
        blockType: Scratch.BlockType.REPORTER,
        text: `miliseconds since 1970 (unix)`,
        arguments: {},
        disableMonitor: true
    });

    Extension.prototype[`ms_since_1970`] = async () => {
        return Date.now();
    };

    blocks.push({
        opcode: `ms_to_seconds`,
        blockType: Scratch.BlockType.REPORTER,
        text: `[ms] miliseconds to seconds`,
        arguments: {
            "ms": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1705016478483,
            },
        },
        disableMonitor: true
    });

    Extension.prototype[`ms_to_seconds`] = async (args) => {
        return args["ms"] * 1 / 1000;
    };

    blocks.push({
        opcode: `ms_to_days`,
        blockType: Scratch.BlockType.REPORTER,
        text: `[ms] miliseconds to days`,
        arguments: {
            "ms": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1705016478483,
            },
        },
        disableMonitor: true
    });

    Extension.prototype[`ms_to_days`] = async (args) => {
        return args["ms"] * 1 / 86400000;
    };

    blocks.push({
        opcode: `ms_to_hours`,
        blockType: Scratch.BlockType.REPORTER,
        text: `[ms] miliseconds to hours`,
        arguments: {
            "ms": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1705016478483,
            },
        },
        disableMonitor: true
    });

    Extension.prototype[`ms_to_hours`] = async (args) => {
        return args["ms"] * 1 / 3600000;
    };

    blocks.push({
        opcode: `ms_to_min`,
        blockType: Scratch.BlockType.REPORTER,
        text: `[ms] miliseconds to minutes`,
        arguments: {
            "ms": {
                type: Scratch.ArgumentType.NUMBER,
                defaultValue: 1705016478483,
            },
        },
        disableMonitor: true
    });

    Extension.prototype[`ms_to_min`] = async (args) => {
        return args["ms"] * 1 / 60000;
    };

    Scratch.extensions.register(new Extension());
})(Scratch);
