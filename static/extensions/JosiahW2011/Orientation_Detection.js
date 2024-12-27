/**!
  * @author JosiahW2011 https://github.com/JosiahW2011
  * @version 1.0
  * @copyright MIT License
  * Removing this will not do well...
*/
(function(Scratch) {
    'use strict';
    class Extension {
        getInfo() {
            return {
                id: "OrDe",
                name: "Orientation Detection",
                color1: "#FFD700",
                color2: "#473c00",
                blocks: [
                    {
                        /**! "isLandscape?" */
                        opcode: 'isLandscape',
                        text: 'isLandscape?',
                        blockType: Scratch.BlockType.BOOLEAN,
                        disableMonitor: false
                    },
                    {
                        /**! "isPortrait?" */
                        opcode: 'isPortrait',
                        text: 'isPortrait?',
                        blockType: Scratch.BlockType.BOOLEAN,
                        disableMonitor: false
                    },
                    {
                        /**! "currentOrientation?" */
                        opcode: 'currentOrientationType',
                        text: 'currentOrientation?',
                        blockType: Scratch.BlockType.REPORTER,
                        disableMonitor: false
                    }
                ],
            };
        }

        /**! "Functions section" */
        isLandscape() {
            let isLandscape = false;
            const handleOrientationChange = () => {
                const orientation = screen.orientation.type;
                isLandscape = orientation !== "portrait-primary" && orientation !== "portrait-secondary";
            };

            screen.orientation.addEventListener("change", handleOrientationChange);
            handleOrientationChange();
            return isLandscape;
        }

        isPortrait() {
            let isPortrait = false;
            const handleOrientationChange = () => {
                const orientation = screen.orientation.type;
                isPortrait = orientation !== "landscape-primary" && orientation !== "landscape-secondary";
            };

            screen.orientation.addEventListener("change", handleOrientationChange);
            handleOrientationChange();
            return isPortrait;
        }

        currentOrientationType() {
            return screen.orientation.type;
        }
    }
    /**! "End of class Extension" */
    Scratch.extensions.register(new Extension());
})(Scratch);
