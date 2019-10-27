import UnnyConstants from "./Constants";

export const ViewOpenDirection = {
    NONE: 0,
    LEFT_TO_RIGHT: 2,
    RIGHT_TO_LEFT: 4,
    TOP_TO_BOTTOM: 1,
    BOTTOM_TO_TOP: 3
};

export default class WebView {
    constructor(config) {
        const div = document.createElement("div");
        this.parent = document.body.appendChild(div);

        const iFrame = document.createElement("iframe");
        this.iFrame = this.parent.appendChild(iFrame);
        this.window = this.iFrame.contentWindow;

        const iStyle = this.iFrame.style;
        iStyle.position = 'absolute';
        iStyle.left = iStyle.right = '0';
        iStyle.top = iStyle.bottom = '0';
        iStyle.width = iStyle.height = '100%';
        iStyle.border = 'none';

        const style = this.parent.style;
        style.zIndex = '999999';
        style.position = 'fixed';
        style.visibility = 'hidden';

        this.config = config;
        this.evaluationsById = {};
        this.instanceId = 0;
        this.onMessageReceived = null;
        if (config.open_animation)
            this._setAnimationActive(true);

        this.setFrame({
            left: '0',
            top: '0',
            width: '50%',
            height: '100%',
        });

        window.addEventListener("message", this._receiveMessage.bind(this), false);
    }

    _receiveMessage(event) {
        if (event.origin === UnnyConstants.GENERAL_CONSTANTS.REMOTE_URL) {
            if (event.data) {
                if (event.data.reply) {
                    const id = event.data.id;
                    if (this.evaluationsById.hasOwnProperty(id)) {
                        const reply = event.data.reply;
                        const callback = this.evaluationsById[id].callback;
                        delete this.evaluationsById[id];

                        callback(reply);
                    }
                } else {
                    if (event.data && event.data.message && event.data.message.split) {
                        const message = decodeURIComponent(event.data.message);
                        const split1 = message.split('?');
                        let path;
                        let params = {};
                        if (split1.length > 0) {
                            path = split1[0];
                            if (split1.length > 1) {
                                const splitParams = split1[1].split('&');
                                for (let i = 0; i < splitParams.length; i++) {
                                    const kvp = splitParams[i].split('=');
                                    if (kvp.length > 1)
                                        params[kvp[0]] = kvp[1];
                                }
                            }
                        }
                        if (this.onMessageReceived)
                            this.onMessageReceived({
                                path: path,
                                args: params
                            });
                    }
                }
            }
        }
    }

    openUrl(url) {
        this.iFrame.src = url;
    }

    /**
     *
     * @param {object} info {left, top, right, left, width, height}
     */
    setFrame(info) {
        this.cachedFrame = info;

        if (this._isVisible()) {
            this._applyNormalPosition();
        } else {
            this._applyHiddenPosition();
        }
    }

    _applyNormalPosition() {
        const info = this.cachedFrame;
        const style = this.parent.style;
        style.left = info.left;
        style.right = info.right;
        style.top = info.top;
        style.bottom = info.bottom;

        style.width = info.width;
        style.height = info.height;
    }

    _applyHiddenPosition() {
        const style = this.parent.style;
        this._applyNormalPosition();
        switch (this.config.open_animation) {
            case ViewOpenDirection.LEFT_TO_RIGHT:
                style.left = "-" + style.width;
                style.right = undefined;
                break;
            case ViewOpenDirection.RIGHT_TO_LEFT:
                style.left = undefined;
                style.right = "-" + style.width;
                break;
            case ViewOpenDirection.TOP_TO_BOTTOM:
                style.top = "-" + style.height;
                style.bottom = undefined;
                break;
            case ViewOpenDirection.BOTTOM_TO_TOP:
                style.top = undefined;
                style.bottom = "-" + style.height;
                break;
        }
    }

    _isVisible() {
        return this.parent.style.visibility === 'visible';
    }

    _setAnimationActive(active) {
        const style = this.parent.style;
        style["-webkit-transition"] = style.transition = active ? ('all ' + UnnyConstants.ANIMATIONS.OPEN_DURATION + 's ease-in-out') : undefined;
    }

    _clearTimer() {
        if (this.timer) {
            clearTimeout(this.timer);
            this.timer = null;
        }
    }

    hide() {
        this._clearTimer();
        this._applyHiddenPosition();

        this.timer = setTimeout(() => {
            this.parent.style.visibility = 'hidden';
            this.timer = null;
        }, UnnyConstants.ANIMATIONS.OPEN_DURATION * 1000);
    }

    show() {
        this._clearTimer();
        this.parent.style.visibility = 'visible';
        this._applyNormalPosition();
    }

    evaluateJavaScript(script, callback) {
        const data = {
            eval_code: script,
            id: this.instanceId++
        };
        this.evaluationsById[data.id] = {
            callback: callback
        };

        this.window.postMessage(data, UnnyConstants.GENERAL_CONSTANTS.REMOTE_URL);
    }
}
