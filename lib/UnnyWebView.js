import WebView from "./WebView";
import UnnyConstants from './Constants';
import UnnyNet from "./UnnyNet";

function unny_uuidv4() {
    var d = new Date().getTime();
    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now(); //use high-precision timer if available
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
}

export default class UnnyWebView extends WebView {
    constructor(config) {
        super(config);

        const closeBtn = document.createElement("button");
        this.closeBtn = this.parent.appendChild(closeBtn);
        const bStyle = this.closeBtn.style;
        bStyle.position = 'absolute';
        bStyle.top = bStyle.right = '7px';
        bStyle.outline = 'none';
        bStyle.background = 'none';
        bStyle.border = 'none';
        this.closeBtn.innerHTML = '<img src="https://unnynet.azureedge.net/users/attachments/b246adbe-c1af-4532-88ca-f1d1709b0211/09b47e40-e61b-11e9-b83d-a5adea23c281.png" />';
        this.closeBtn.onclick = UnnyNet.closeUnnyNet;
    }

    openGameUrl(gameId, publicKey, gameLogin) {
        let path = UnnyConstants.GENERAL_CONSTANTS.REMOTE_URL + '/#/plugin/' + gameId +
            "?version=" + UnnyConstants.GENERAL_CONSTANTS.VERSION +
            "&public_key=" + publicKey;

        if (gameLogin)
            path += "&game_login=1";

        path += "&location_origin=" + window.location.origin;//it's used for postMessages from UnnyNet

        let deviceId = localStorage.getItem("js_device_id");
        if (!deviceId) {
            deviceId = unny_uuidv4();
            localStorage.setItem("js_device_id", deviceId);
        }
        path += "&device_id=" + deviceId;

        this.openUrl(path);
    }

    /**
     *
     * @param {boolean} visible
     */
    setCloseButtonVisible(visible) {
        this.closeBtn.style.visibility = visible ? 'visible' : 'hidden';
    }
}