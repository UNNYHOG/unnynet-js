import UnnyCommands from "./Commands";
import RequestsManager from "./RequestsManager";

export default class UnnyCommandInfo {

    /***
     *
     * @param {UnnyCommands.Command} command
     * @param {string} code
     * @param {boolean} openWindow
     * @param {function} callback
     */

    constructor(command, code, openWindow = false, callback = null) {
        this.info = {
            command: command,
            code: code,
            openWindow: openWindow,
            callback: callback
        };

        this.startedTime = null;
        this.req_id = -1;
        this.delayedRequestWaiting = false;
    }

    getSaveData() {
        const data = {
            command: this.info.command,
            code: this.info.code
        };

        if (this.req_id >= 0)
            data.req_id = this.req_id;

        return data;
    }

    static loadData(data) {
        let info = null;
        if (data.hasOwnProperty("req_id")) {
            info = new UnnyCommandInfoDelayed(data.command, data.code);
            info.setRequestId(data.req_id);
            RequestsManager.addLoadedRequest(info);
        } else {
            info = new UnnyCommandInfo(data.command, data.code);
        }

        return info;
    }

    getCode() {
        return this.info.code;
    }

    setCode(newCode) {
        this.info.code = newCode;
    }

    getCommand() {
        return this.info.command;
    }

    invokeCallback(data) {
        if (this.info.callback)
            this.info.callback(data);
    }

    invokeCallbackDelayed(data) {
        const response = UnnyCommands.getResponceData(data);
        if (this.info.callbackDelayed)
            this.info.callbackDelayed(response);
        return response;
    }

    needToSave() {
        switch (this.info.command) {
            case UnnyCommands.Command.SendMessage:
            case UnnyCommands.Command.ReportLeaderboardScoresAsync:
            case UnnyCommands.Command.ReportAchievementProgressAsync:
            case UnnyCommands.Command.AddGuildExperience:
                return true;
            default:
                return false;
        }
    }

    couldBeReplaced(cmd) {
        const Command = this.getCommand();
        switch (cmd) {
            case UnnyCommands.Command.OpenLeaderBoards:
            case UnnyCommands.Command.OpenAchievements:
            case UnnyCommands.Command.OpenFriends:
            case UnnyCommands.Command.OpenChannel:
            case UnnyCommands.Command.OpenGuilds:
            case UnnyCommands.Command.OpenMyGuild:
                return Command === UnnyCommands.Command.OpenLeaderBoards
                    || Command === UnnyCommands.Command.OpenAchievements
                    || Command === UnnyCommands.Command.OpenFriends
                    || Command === UnnyCommands.Command.OpenChannel
                    || Command === UnnyCommands.Command.OpenGuilds
                    || Command === UnnyCommands.Command.OpenMyGuild;
            case UnnyCommands.Command.AuthorizeWithCredentials:
            case UnnyCommands.Command.AuthorizeAsGuest:
            case UnnyCommands.Command.AuthorizeWithCustomId:
            case UnnyCommands.Command.ForceLogout:
            case UnnyCommands.Command.GetGuildInfo:
            case UnnyCommands.Command.GetAchievementsInfo:
            case UnnyCommands.Command.GetPlayerPublicInfo:
            case UnnyCommands.Command.GetLeaderboardScores:
            case UnnyCommands.Command.SetSafeArea:
            case UnnyCommands.Command.UnnyNetWasOpened:
                return Command === cmd;
            default:
                return false;
        }
    }

    _isOpenCommand(cmd) {
        switch (cmd) {
            case UnnyCommands.Command.OpenLeaderBoards:
            case UnnyCommands.Command.OpenAchievements:
            case UnnyCommands.Command.OpenFriends:
            case UnnyCommands.Command.OpenChannel:
            case UnnyCommands.Command.OpenGuilds:
            case UnnyCommands.Command.OpenMyGuild:
                return true;
            default:
                return false;
        }
    }

    sameType(cmd) {
        const Command = this.getCommand();
        if (this._isOpenCommand(cmd) && this._isOpenCommand(Command))
            return true;

        return cmd === Command;
    }

    static isDelayedRequestConfirm(cmd) {
        switch (cmd) {
            case UnnyCommands.Command.ReportLeaderboardScoresAsync:
            case UnnyCommands.Command.ReportAchievementProgressAsync:
                return true;
        }
        return false;
    }

    isDelayedRequestConfirm() {
        return UnnyCommandInfo.isDelayedRequestConfirm(this.getCommand());
    }

    static isRequestWithFixedOrder(cmd) {
        switch (cmd) {
            case UnnyCommands.Command.ReportLeaderboardScoresAsync:
                return true;
        }
        return false;
    }

    isRequestWithFixedOrder() {
        return UnnyCommandInfo.isRequestWithFixedOrder(this.getCommand());
    }

    startWaiting() {
        this.delayedRequestWaiting = true;
    }

    isWaiting() {
        return this.delayedRequestWaiting;
    }
}

export class UnnyCommandInfoDelayed extends UnnyCommandInfo {

    /***
     *
     * @param {UnnyCommands.Command} command
     * @param {string} code
     * @param {function} callback
     */
    constructor(command, code, callback = null) {
        super(command, code, false, null);
        this.info.callbackDelayed = callback;
        RequestsManager.addRequest(this);
    }

    setRequestId(id) {
        this.req_id = id;
    }
}
