import UnnyWebView from './UnnyWebView';
import UnnyCommandInfo from "./CommandInfo";
import UnnyCommands, {Errors} from "./Commands";
import RequestsManager from "./RequestsManager";
import UnnyRequestResponse from "./UnnyRequestResponse";
import UnnyNet from "./UnnyNet";
import UnnyConstants from "./Constants";
import UnnyNetApiRequestsManager from "./API/UnnyNetApiRequestsManager";
import UnnyNetAPI from "./API/UnnyNetAPI";
import UnnyAdmin from "./UnnyAdmin";

if (!String.prototype.format) {
    String.prototype.format = function () {
        var args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

function parseGetParams() {
    const prms = {};
    let queryString = window.location.search;
    if (queryString && queryString.length > 0) {
        queryString = queryString.substring(1);
        const queries = queryString.split("&");

        for (let i = 0; i < queries.length; i++) {
            const kvp = queries[i].split('=');
            if (kvp[0].startsWith("amp;"))//vk hack
                prms[kvp[0].substring(4)] = kvp[1];
            else
                prms[kvp[0]] = kvp[1];
        }
    }
    return prms;
}

export default class UnnyNetBase {

    static staticUnnyNetInstance = null;
    static RGC = null;
    static Nutaku = null;

    //region callbacks
    static onPlayerAuthorized;
    static onPlayerLoggedOut;
    static onUnnyNetClosed;
    static onPlayerNameChanged;
    static onRankChanged;
    static onNewGuild;
    static onAchievementCompleted;
    static onNewMessageReceived;
    static onGameLoginRequest;
    static onNewGuildRequest;
    static onPopupOpened;

    //end region

    constructor(config, callback) {
        this.config = config;
        this.allGetParams = parseGetParams();
        this.webView = new UnnyWebView(config);
        this.queue = [];
        UnnyNetBase.staticUnnyNetInstance = this;

        if (!config.game_id)
            config.game_id = "8ff16d3c-ebcc-4582-a734-77ca6c14af29";//Default UnnyNet group for developers

        this.webView.openGameUrl(config, !!UnnyNet.onGameLoginRequest, this._getDeviceId());
        this.webView.onMessageReceived = this._receiveMessage.bind(this);

        setInterval(this._update.bind(this), UnnyConstants.CHECK_PERIOD * 1000);

        this._loadQueue();

        this.API = new UnnyNetAPI(config);
        this.apiRequests = new UnnyNetApiRequestsManager(config);

        UnnyNetBase.RGC = UnnyAdmin.UnnyRGC.initialize({
            game_id: config.game_id
        }, () => {
            if (callback)
                callback();
        });

        UnnyNetBase.Nutaku = {
            /**
             *
             * @param {function} callback
             */
            authorize: (callback) => {
                UnnyNetBase.staticUnnyNetInstance.API.authWithNutakuGadget(callback);
            }
        };

        UnnyNetBase.Vkontakte = {
            /**
             *
             * @param {function} callback
             */
            authorize: (callback) => {
                UnnyNetBase.staticUnnyNetInstance.API.authWithVK(this._getVkUserId(), this.allGetParams.access_token, callback);
            }
        };

        switch (this.config.platform) {
            case UnnyConstants.Platform.VKONTAKTE:
                UnnyNet.authorizeAsGuest("");//TODO take name from VK
                break;
        }
    }

    //region social
    _getDeviceId() {
        switch (this.config.platform) {
            case UnnyConstants.Platform.VKONTAKTE:
                return "vkontakte_" + this._getVkUserId();
        }
        return null;
    }
    _getVkUserId(){
        return this.allGetParams.viewer_id;
    }
    //end region

    _receiveMessage(data) {
        const path = data.path;
        const args = data.args;

        switch (path) {
            // case  'action'://Do We still need it?
            case "authorised":
                if (UnnyNet.onPlayerAuthorized)
                    UnnyNet.onPlayerAuthorized(args);
                if (this.config.default_channel)
                    UnnyNetBase._setDefaultChannel(this.config.default_channel);
                break;
            case "logged_out":
                if (UnnyNet.onPlayerLoggedOut)
                    UnnyNet.onPlayerLoggedOut();
                break;
            case "renamed":
                if (UnnyNet.onPlayerNameChanged)
                    UnnyNet.onPlayerNameChanged(args.name);
                break;
            case "rank_changed":
                if (UnnyNet.onRankChanged)
                    UnnyNet.onRankChanged(args);
                break;
            case "new_guild":
                if (UnnyNet.onNewGuild != null)
                    UnnyNet.onNewGuild(args);
                break;
            case "ask_new_guild":
            case "popup_appeared":
                UnnyRequestResponse.create(path, args, UnnyNetBase._sendRequestReply);
                break;
            case "popup_button_clicked":
                UnnyRequestResponse.buttonClicked(args);
                break;
            case "ach_completed":
                if (UnnyNet.onAchievementCompleted != null)
                    UnnyNet.onAchievementCompleted(args);
                break;
            case "new_message":
                if (UnnyNet.onNewMessageReceived != null)
                    UnnyNet.onNewMessageReceived(args);
                break;
            case "game_login_request":
                if (UnnyNet.onGameLoginRequest != null)
                    UnnyNet.onGameLoginRequest();
                break;
            case "request_reply":
                RequestsManager.replyReceived(args);
                break;
            case "open_url":
                if (args.url)
                    window.open(args.url, "_blank");
                break;
        }
    }

    static _setDefaultChannel(channelId) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.SetDefaultChannel).format(channelId);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.SetDefaultChannel, code, false));
    }

    static _sendRequestReply(sys_id, reply) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.RequestReply).format(sys_id, reply);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.RequestReply, code, false));
    }

    static _checkWebView() {
        if (!UnnyNetBase.staticUnnyNetInstance) {
            console.error("UnnyNet wasn't properly initialized");
            return false
        }
        return true;
    }

    static evaluateCommand(command, openWindow, doneCallback) {
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(
            command, UnnyCommands.GetCommand(command), openWindow, doneCallback));
    }

    static evaluateCodeInJavaScript(commandInfo, highPriority = false) {
        if (!UnnyNetBase._checkWebView())
            return;

        const queue = UnnyNetBase.staticUnnyNetInstance.queue;
        let indexToReplace = -1;
        for (let i = 1; i < queue.length; i++) {
            if (queue[i].couldBeReplaced(commandInfo.Command)) {
                indexToReplace = i;
                break;
            }
        }

        if (indexToReplace === -1) {
            if (highPriority)
                queue.unshift(commandInfo);
            else
                queue.push(commandInfo);

            if (queue.length === 1)
                UnnyNetBase.staticUnnyNetInstance._checkQueue();
            else {
                //The queue is too long -> we need to clean it
                if (queue.length >= UnnyConstants.MAX_QUEUE_LENGTH) {
                    for (let i = 0; i < queue.length; i++) {
                        if (queue[i].isDelayedRequestConfirm()) {
                            queue.splice(i, 1);
                            break;
                        }
                    }
                }
            }
        } else
            queue[indexToReplace] = commandInfo;
    }

    static openUnnyNet() {
        if (UnnyNetBase._checkWebView())
            UnnyNetBase.staticUnnyNetInstance.showWebView();
    }

    static closeUnnyNet() {
        if (UnnyNetBase.staticUnnyNetInstance != null)
            UnnyNetBase.staticUnnyNetInstance.hideWebView();
    }

    _update() {
        this._checkQueue();

        if (!this.last_save_time || Date.now() - this.last_save_time >= UnnyConstants.REQUESTS_SAVE_TIME * 1000)
            this._saveQueue();
    }

    _getSaveKey() {
        return "UN_SAVE_" + this.config.game_id;
    }

    static delayedCommandWasConfirmed(commandInfo) {
        const queue = UnnyNetBase.staticUnnyNetInstance.queue;
        for (let i in queue) {
            if (commandInfo === queue[i]) {
                queue.splice(i, 1);
                break;
            }
        }
    }

    _saveQueue() {
        this.last_save_time = Date.now();
        const listToSave = [];
        for (let i in this.queue) {
            const info = this.queue[i];
            if (info.needToSave())
                listToSave.push(info.getSaveData());
        }

        const key = this._getSaveKey();
        if (listToSave.length === 0) {
            localStorage.removeItem(key);
        } else {
            localStorage.setItem(key, JSON.stringify(listToSave));
        }
    }

    _loadQueue() {
        const key = this._getSaveKey();
        const item = localStorage.getItem(key);
        if (item) {
            const requests = JSON.parse(item);
            for (let i in requests) {
                const data = UnnyCommandInfo.loadData(requests[i]);
                this.queue.push(data);
            }

            localStorage.removeItem(key);
        }
    }

    _checkQueue() {
        if (this.queue.length === 0 || !UnnyNetBase._checkWebView())
            return;

        let info = null;

        for (let i in this.queue) {
            const curInfo = this.queue[i];
            if (!curInfo.isWaiting()) {
                info = curInfo;
                break;
            }

            if (curInfo.startedTime) {
                let secs = Date.now() - curInfo.startedTime;
                if (secs < UnnyConstants.MAX_DELAYED_CONFIRMATIONS * 1000)
                    continue;
            }
            info = curInfo;
            break;
        }

        if (!info)
            return;

        info.startedTime = Date.now();

        try {
            this.webView.evaluateJavaScript(info.getCode(), response => {
                let removeFromQueue = false;
                if (response.success) {
                    if (info.isDelayedRequestConfirm())
                        info.startWaiting();
                    else
                        removeFromQueue = true;
                    if (info.info.openWindow)
                        UnnyNetBase.openUnnyNet();
                } else {
                    if (response.error) {
                        switch (response.error.code) {
                            case Errors.UnnynetNotReady:
                            case Errors.NotAuthorized:
                                console.log("Waiting..." + response.error.message);
                                break;
                            default:
                                removeFromQueue = true;
                                break;
                        }
                    }
                }

                if (removeFromQueue) {
                    this.queue.shift();
                    if (info != null)
                        info.invokeCallback(response);
                    this._checkQueue();
                }
            });
        } catch (e) {
            console.error("EVAL ERROR: ", e);
            // info.invokeCallback(UnnyCommands.getResponceData(false, null, UnnyCommands.Errors.Unknown, "Error occurred: " + e));
        }
    }

    hideWebView() {
        if (UnnyNet.onUnnyNetClosed != null)
            UnnyNet.onUnnyNetClosed();

        this.webView.hide(this.config);
    }

    showWebView() {
        this.webView.show(this.config);
        UnnyNetBase.evaluateCommand(UnnyCommands.Command.UnnyNetWasOpened, false, null);
    }

    /**
     *
     * @param {object} info {left, top, right, left, width, height}
     */
    static setFrame(info) {
        UnnyNetBase.staticUnnyNetInstance.webView.setFrame(info);
    }

    /**
     *
     * @param {boolean} visible
     */
    static setCloseButtonVisible(visible) {
        UnnyNetBase.staticUnnyNetInstance.webView.setCloseButtonVisible(visible);
    }
}
