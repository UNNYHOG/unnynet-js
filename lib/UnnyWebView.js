import WebView from "./WebView";
import UnnyConstants from './Constants';
import UnnyNet from "./UnnyNet";
import UnnyNetSystem from "./UnnyNetSystem";

// function unny_uuidv4() {
//     var d = new Date().getTime();
//     if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
//         d += performance.now(); //use high-precision timer if available
//     }
//     return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
//         var r = (d + Math.random() * 16) % 16 | 0;
//         d = Math.floor(d / 16);
//         return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
//     });
// }

export default class UnnyWebView extends WebView {
    constructor(config) {
        super(config);

        const closeBtn = document.createElement("button");
        this.closeBtn = this.parent.appendChild(closeBtn);
        this.closeBtn.innerHTML = '<img width="100%" height="100%" src="https://unnynet.azureedge.net/users/attachments/b246adbe-c1af-4532-88ca-f1d1709b0211/355f6e10-6a3c-11ea-a35e-ebf4b961e71e.png" />';
        this.closeBtn.onclick = UnnyNetSystem.closeUnnyNet;

        const bStyle = this.closeBtn.style;
        bStyle.position = 'absolute';
        bStyle.top = bStyle.right = '7px';
        bStyle.padding = '0';
        bStyle.width = bStyle.height = '36px';
        bStyle.outline = 'none';
        bStyle.background = 'none';
        bStyle.border = 'none';
    }

    openGameUrl(config, deviceId) {
        const data = {
            game_id: config.game_id,
            public_key: config.public_key,
            version: UnnyConstants.GENERAL_CONSTANTS.VERSION,
            device: 'web',
            location_origin: window.location.origin,//it's used for postMessages from UnnyNet
        };

        if (config.game_login)
            data.game_login = 1;

        if (deviceId)
            data.device_id = deviceId;
        if (config.platform)
            data.platform = config.platform;

        UnnyNetSystem.log("DEVICE_ID", deviceId);

        const stringData = encodeURIComponent(JSON.stringify(data));

        let path = UnnyConstants.GENERAL_CONSTANTS.REMOTE_URL + '/#/plugin/?data=' + stringData;

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
