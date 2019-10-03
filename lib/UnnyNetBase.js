import UnnyWebView from './UnnyWebView';
import UnnyCommandInfo from "./CommandInfo";
import UnnyCommands, {Errors} from "./Commands";
import UnnyConstants from "./Constants";
import RequestsManager from "./RequestsManager";
import UnnyRequestResponse from "./UnnyRequestResponse";
import UnnyNet from "./UnnyNet";

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

export default class UnnyNetBase {

    static staticUnnyNetInstance = null;

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

    constructor(config) {
        this.config = config;
        this.webView = new UnnyWebView(config);
        this.queue = [];
        UnnyNetBase.staticUnnyNetInstance = this;

        if (!config.game_id)
            config.game_id = "8ff16d3c-ebcc-4582-a734-77ca6c14af29";//Default UnnyNet group for developers

        this.webView.openGameUrl(config.game_id, config.public_key, !!UnnyNet.onGameLoginRequest);
        this.webView.onMessageReceived = this._receiveMessage.bind(this);

        setInterval(this._update.bind(this), 1000);
    }

    _receiveMessage(data) {
        const path = data.path;
        const args = data.args;

        switch (path) {
            // case  'action'://Do We still need it?
            case "authorised":
                if (UnnyNet.onPlayerAuthorized)
                    UnnyNet.onPlayerAuthorized(args);
                if (this.config.default_channel)
                    this._setDefaultChannel(this.config.default_channel);
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
                UnnyRequestResponse.create(path, args, this._sendRequestReply);
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

    _setDefaultChannel(channelId) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.SetDefaultChannel).format(channelId);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.SetDefaultChannel, code, false));
    }

    _sendRequestReply(sys_id, reply) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.RequestReply).format(sys_id, reply);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.RequestReply, code, false));
    }

    static _сheckWebView() {
        if (!UnnyNetBase.staticUnnyNetInstance) {
            console.error("UnnyNet wasn't properly initialized");
            return false
        }
        return true;
    }

    static evaluateCommand(command, openWindow, doneCallback) {
        console.log(">>openWindow " + openWindow);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(
            command, UnnyCommands.GetCommand(command), openWindow, doneCallback));
    }

    static evaluateCodeInJavaScript(commandInfo, highPriority = false) {
        console.info("><><", commandInfo);
        if (!UnnyNetBase._сheckWebView())
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
        } else
            queue[indexToReplace] = commandInfo;
    }

    static openUnnyNet() {
        if (UnnyNetBase._сheckWebView())
            UnnyNetBase.staticUnnyNetInstance.showWebView();
    }

    static closeUnnyNet() {
        if (UnnyNetBase.staticUnnyNetInstance != null)
            UnnyNetBase.staticUnnyNetInstance.hideWebView();
    }

    _update() {
        this._checkQueue();
    }

    _checkQueue() {
        if (this.queue.length === 0 || !UnnyNetBase._сheckWebView())
            return;

        const info = this.queue[0];

        if (info.startedTime == null) {
            info.startedTime = Date.now();
        } else {
            const timeNow = Date.now();
            const ms = timeNow - info.startedTime;
            if (ms > UnnyConstants.SEND_REQUEST_RETRY_DELAY) {
                info.StartedTime = timeNow;
                info.retries++;
                if (info.getRetries() > UnnyConstants.MAX_RETRIES) {
                    console.error("Max retries: " + info.Command.toString());
                }
            } else {
                return;
            }
        }

        try {
            this.webView.evaluateJavaScript(info.getCode(), response => {
                // if (typeof response === 'string')
                //     response = JSON.parse(response);
                let removeFromQueue = false;
                if (response.success) {
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
    }

    /**
     *
     * @param {object} info {left, top, right, left, width, height}
     */
    static setFrame(info) {
        UnnyNetBase.staticUnnyNetInstance.webView.setFrame(info);
    }
}
