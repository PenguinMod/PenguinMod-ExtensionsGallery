class ExtensionLoader {
    static getTargetOrigin() {
        const isLocal = location.hostname === "localhost";
        return isLocal ? "http://localhost:3000" : "https://studio.penguinmod.com";
    }
    static tryLoadExtension(url) {
        const parent = window.opener || window.parent;
        if (!parent || parent === window) throw new Error("No parents");

        const origin = ExtensionLoader.getTargetOrigin();
        parent.postMessage({
            loadExt: `${url}`
        }, origin);
    }
    static handleWindowMessage(e) {
        // return false, invalid message; return extension "id", success; throw error, something failed
        const intendedOrigin = ExtensionLoader.getTargetOrigin();
        console.log('Recieved message from', e.origin, e);

        if (!e.origin.startsWith(intendedOrigin)) {
            console.warn('Message is not from set origin', intendedOrigin, e.origin);
            return false;
        }
        if (!e.data) {
            console.warn('No data attached to message');
            return false;
        }
        if (!e.data.p4) {
            console.warn('No data p4 attached to message');
            return false;
        }
        const eventData = e.data.p4;
        if (!eventData.type) {
            console.warn('No data type attached to message');
            return false;
        }

        // evil win
        if (eventData.type === 'success') {
            console.log('Loading extension was a success', eventData);
            return eventData.extensionId;
        }

        // evil fail
        console.error('Loading extension failed', eventData);
        throw new Error(eventData.error);
    }
}

export default ExtensionLoader;