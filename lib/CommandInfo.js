import UnnynetCommand from "./Commands";
import RequestsManager from "./RequestsManager";

export default class CommandInfo {

    /***
     *
     * @param {UnnynetCommand.Command} command
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
            info = new CommandInfo(data.command, data.code);
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
        const response = UnnynetCommand.getResponceData(data);
        if (this.info.callbackDelayed)
            this.info.callbackDelayed(response);
        return response;
    }

    needToSave() {
        switch (this.info.command) {
            case UnnynetCommand.Command.SendMessage:
            case UnnynetCommand.Command.ReportLeaderboardScoresAsync:
            case UnnynetCommand.Command.ReportAchievementProgressAsync:
            case UnnynetCommand.Command.AddGuildExperience:
                return true;
            default:
                return false;
        }
    }

    couldBeReplaced(cmd) {
        const Command = this.getCommand();
        switch (cmd) {
            case UnnynetCommand.Command.OpenLeaderBoards:
            case UnnynetCommand.Command.OpenAchievements:
            case UnnynetCommand.Command.OpenFriends:
            case UnnynetCommand.Command.OpenChannel:
            case UnnynetCommand.Command.OpenGuilds:
            case UnnynetCommand.Command.OpenMyGuild:
                return Command === UnnynetCommand.Command.OpenLeaderBoards
                    || Command === UnnynetCommand.Command.OpenAchievements
                    || Command === UnnynetCommand.Command.OpenFriends
                    || Command === UnnynetCommand.Command.OpenChannel
                    || Command === UnnynetCommand.Command.OpenGuilds
                    || Command === UnnynetCommand.Command.OpenMyGuild;
            case UnnynetCommand.Command.AuthorizeWithCredentials:
            case UnnynetCommand.Command.AuthorizeAsGuest:
            case UnnynetCommand.Command.AuthorizeWithCustomId:
            case UnnynetCommand.Command.ForceLogout:
            case UnnynetCommand.Command.GetGuildInfo:
            case UnnynetCommand.Command.GetAchievementsInfo:
            case UnnynetCommand.Command.GetPlayerPublicInfo:
            case UnnynetCommand.Command.GetLeaderboardScores:
            case UnnynetCommand.Command.SetSafeArea:
            case UnnynetCommand.Command.UnnyNetWasOpened:
            case UnnynetCommand.Command.JoinPrivateChannel:
            case UnnynetCommand.Command.LeaveAllPrivateChannels:
                return Command === cmd;
            default:
                return false;
        }
    }

    _isOpenCommand(cmd) {
        switch (cmd) {
            case UnnynetCommand.Command.OpenLeaderBoards:
            case UnnynetCommand.Command.OpenAchievements:
            case UnnynetCommand.Command.OpenFriends:
            case UnnynetCommand.Command.OpenChannel:
            case UnnynetCommand.Command.OpenGuilds:
            case UnnynetCommand.Command.OpenMyGuild:
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
            case UnnynetCommand.Command.ReportLeaderboardScoresAsync:
            case UnnynetCommand.Command.ReportAchievementProgressAsync:
                return true;
        }
        return false;
    }

    isDelayedRequestConfirm() {
        return CommandInfo.isDelayedRequestConfirm(this.getCommand());
    }

    static isRequestWithFixedOrder(cmd) {
        switch (cmd) {
            case UnnynetCommand.Command.ReportLeaderboardScoresAsync:
                return true;
        }
        return false;
    }

    isRequestWithFixedOrder() {
        return CommandInfo.isRequestWithFixedOrder(this.getCommand());
    }

    startWaiting() {
        this.delayedRequestWaiting = true;
    }

    isWaiting() {
        return this.delayedRequestWaiting;
    }
}

export class UnnyCommandInfoDelayed extends CommandInfo {

    /***
     *
     * @param {UnnynetCommand.Command} command
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
