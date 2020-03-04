import UnnyWebView from './UnnyWebView';
import CommandInfo from "./CommandInfo";
import UnnynetCommand, {Errors} from "./Commands";
import RequestsManager from "./RequestsManager";
import UnnyRequestResponse from "./UnnyRequestResponse";
import UnnyNet from "./UnnyNet";
import UnnyConstants from "./Constants";
import UnnyNetAPI from "./API/UnnyNetAPI";
import SocialManager from "./Social/SocialManager";
import Storage from "./Storage";
import Events from "./Events";

if (!String.prototype.format) {
    String.prototype.format = function () {
        let args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

const DefaultEnvironment = UnnyConstants.Environment.Development;

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

export default class UnnyNetSystem {

    static instance = null;
    storage = null;

    static initialize(config) {
        new UnnyNetSystem(config);
    }

    constructor(config) {
        UnnyNetSystem.instance = this;
        this.config = this._prepareConfig(config);
        this.allGetParams = parseGetParams();
        this.queue = [];
        this.environment = this.config.hasOwnProperty('environment') ? this.config.environment : DefaultEnvironment;

        this._initServices();
        this._setDebug(this.config.debug);
        UnnyNetSystem.log("INIT", this.config);

        this._prepareWebView();

        this.storage = new Storage(this.config.game_id,  () => {
            UnnyNetSystem.log("Storage was initialized");
            this.socialPlatform.authorize(this.config.callback);
        });

        setInterval(this._update.bind(this), UnnyConstants.CHECK_PERIOD * 1000);
    }

    _prepareConfig(config) {
        if (!config.game_id)
            console.error("You need to provide game_id");

        if (Events.onGameLoginRequest)
            config.game_login = 1;

        if (config.platform === UnnyConstants.Platform.FB_INSTANT) {
            if (!config.lite_version) {
                config.lite_version = true;
                console.warn("FB Instant can use only lite version of UnnyNet: Forced Lite");
            }
        }

        return config;
    }

    _initServices() {
        this.API = new UnnyNetAPI(this.config);
        this.socialPlatform = SocialManager.createSocialPlatform(this, this.config.platform);
    }

    static getAPI() {
        return UnnyNetSystem.instance.API;
    }

    static getSocialPlatform() {
        return UnnyNetSystem.instance.socialPlatform;
    }

    _prepareWebView() {
        if (!this.config.lite_version) {
            this.webView = new UnnyWebView(this.config);
            this.webView.openGameUrl(this.config, this.socialPlatform.getDeviceIdForNakama());
            this.webView.onMessageReceived = this._receiveMessage.bind(this);
            this._loadQueue();
        }
    }

    _setDebug(debug) {
        this.debug = debug;
    }

    static log(name, ...theArgs) {
        if (UnnyNetSystem.instance.debug)
            console.info("[UNNYNET_JS] " + name, ...theArgs);
    }

    _receiveMessage(data) {
        const path = data.path;
        const args = data.args;

        switch (path) {
            // case  'action'://Do We still need it?
            case "authorised":
                if (Events.onPlayerAuthorized)
                    Events.onPlayerAuthorized(args);
                if (this.config.default_channel)
                    UnnyNetSystem._setDefaultChannel(this.config.default_channel);
                break;
            case "logged_out":
                if (Events.onPlayerLoggedOut)
                    Events.onPlayerLoggedOut();
                break;
            case "renamed":
                if (Events.onPlayerNameChanged)
                    Events.onPlayerNameChanged(args.name);
                break;
            case "rank_changed":
                if (Events.onRankChanged)
                    Events.onRankChanged(args);
                break;
            case "new_guild":
                if (Events.onNewGuild != null)
                    Events.onNewGuild(args);
                break;
            case "ask_new_guild":
            case "popup_appeared":
                UnnyRequestResponse.create(path, args, UnnyNetSystem._sendRequestReply);
                break;
            case "popup_button_clicked":
                UnnyRequestResponse.buttonClicked(args);
                break;
            case "ach_completed":
                if (Events.onAchievementCompleted != null)
                    Events.onAchievementCompleted(args);
                break;
            case "new_message":
                if (Events.onNewMessageReceived != null)
                    Events.onNewMessageReceived(args);
                break;
            case "game_login_request":
                if (Events.onGameLoginRequest != null)
                    Events.onGameLoginRequest();
                break;
            case "request_reply":
                RequestsManager.replyReceived(args);
                break;
            case "open_url":
                if (args.url)
                    window.open(args.url, "_blank");
                break;
            case "debug":
                this._setDebug(args.enable == 1);
                break;
        }

        UnnyNetSystem.log("_receiveMessage", data);
    }

    static _setDefaultChannel(channelId) {
        const code = UnnynetCommand.GetCommand(UnnynetCommand.Command.SetDefaultChannel).format(channelId);
        UnnyNetSystem.evaluateCodeInJavaScript(new CommandInfo(UnnynetCommand.Command.SetDefaultChannel, code, false));
    }

    static _sendRequestReply(sys_id, reply) {
        const code = UnnynetCommand.GetCommand(UnnynetCommand.Command.RequestReply).format(sys_id, reply);
        UnnyNetSystem.evaluateCodeInJavaScript(new CommandInfo(UnnynetCommand.Command.RequestReply, code, false));
    }

    static _checkWebView() {
        if (!UnnyNetSystem.instance) {
            console.error("UnnyNet wasn't properly initialized");
            return false
        }
        return true;
    }

    static evaluateCommand(command, openWindow, doneCallback) {
        UnnyNetSystem.evaluateCodeInJavaScript(new CommandInfo(
            command, UnnynetCommand.GetCommand(command), openWindow, doneCallback));
    }

    static evaluateCodeInJavaScript(commandInfo, highPriority = false) {
        if (!UnnyNetSystem._checkWebView())
            return;

        if (UnnyNetSystem.instance.config.lite_version) {
            console.warn("You can't use this method in Lite Mode");
            return;
        }

        const queue = UnnyNetSystem.instance.queue;
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
                UnnyNetSystem.instance._checkQueue();
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

    _update() {
        this._checkQueue();

        if (!this.last_save_time || Date.now() - this.last_save_time >= UnnyConstants.REQUESTS_SAVE_TIME * 1000)
            this._saveQueue();
    }

    _getSaveKey() {
        return "UN_SAVE_" + this.config.game_id;
    }

    static delayedCommandWasConfirmed(commandInfo) {
        const queue = UnnyNetSystem.instance.queue;
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
        return;
        const key = this._getSaveKey();
        const item = localStorage.getItem(key);
        if (item) {
            const requests = JSON.parse(item);
            for (let i in requests) {
                const data = CommandInfo.loadData(requests[i]);
                this.queue.push(data);
            }

            UnnyNetSystem.log('_loadQueue', this.queue);
            localStorage.removeItem(key);
        }
    }

    _checkQueue() {
        if (this.queue.length === 0 || !UnnyNetSystem._checkWebView())
            return;

        let info = null;

        let fixedOrder = false;
        for (let i in this.queue) {
            const curInfo = this.queue[i];
            if (fixedOrder && curInfo.isRequestWithFixedOrder())
                continue;

            if (!curInfo.isWaiting()) {
                info = curInfo;
                break;
            }

            if (curInfo.isRequestWithFixedOrder())
                fixedOrder = true;

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
            UnnyNetSystem.log('evaluate', info.getCode());
            this.webView.evaluateJavaScript(info.getCode(), response => {
                UnnyNetSystem.log('response', response);

                let removeFromQueue = false;
                if (response.success) {
                    if (info.isDelayedRequestConfirm())
                        info.startWaiting();
                    else
                        removeFromQueue = true;
                    if (info.info.openWindow)
                        UnnyNetSystem.openUnnyNet();
                } else {
                    if (response.error) {
                        switch (response.error.code) {
                            case Errors.UnnynetNotReady:
                            case Errors.NotAuthorized:
                                UnnyNetSystem.log("Waiting...", response);
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
            // info.invokeCallback(UnnynetCommand.getResponceData(false, null, UnnynetCommand.Errors.Unknown, "Error occurred: " + e));
        }
    }

    static openUnnyNet() {
        if (UnnyNetSystem._checkWebView())
            UnnyNetSystem.instance.showWebView();
    }

    static closeUnnyNet() {
        if (UnnyNetSystem._checkWebView())
            UnnyNetSystem.instance.hideWebView();
    }

    hideWebView() {
        if (this.webView) {
            if (Events.onUnnyNetClosed != null)
                Events.onUnnyNetClosed();

            this.webView.hide(this.config);
        }
    }

    showWebView() {
        if (this.webView) {
            this.webView.show(this.config);
            UnnyNetSystem.evaluateCommand(UnnynetCommand.Command.UnnyNetWasOpened, false, null);
        }
    }

    /**
     *
     * @param {object} info {left, top, right, left, width, height}
     */
    static setFrame(info) {
        if (UnnyNetSystem.instance.webView)
            UnnyNetSystem.instance.webView.setFrame(info);
    }

    /**
     *
     * @param {boolean} visible
     */
    static setCloseButtonVisible(visible) {
        if (UnnyNetSystem.instance.webView)
            UnnyNetSystem.instance.webView.setCloseButtonVisible(visible);
    }
}
