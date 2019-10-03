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

    constructor(command, code, openWindow, callback) {
        this.info = {
            command: command,
            code: code,
            openWindow: openWindow,
            callback: callback
        };

        this.retries = 0;
        this.startedTime = null;
    }

    shallOpenWindow() {
        return this.info.openWindow;
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

    getRetries() {
        return this.info.retries;
    }

    invokeCallback(data) {
        if (this.info.callback)
            this.info.callback(data);
    }

    invokeCallbackNative(data) {
        if (this.info.callbackNative)
            this.info.callbackNative(data);
    }

    invokeCallbackDelayed(data) {
        if (this.info.callbackDelayed)
            this.info.callbackDelayed(UnnyCommands.getResponceData(data));
    }

// public DateTime? StartedTime { get; set; }

    needToSave() {
        switch (this.Command) {
            case UnnyCommands.Command.SendMessage:
            case UnnyCommands.Command.ReportLeaderboardScores:
            case UnnyCommands.Command.ReportAchievementProgress:
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
            case UnnyCommands.Command.GetAvatarURL:
            case UnnyCommands.Command.SetSafeArea:
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
}

export class UnnyCommandInfoDelayed extends UnnyCommandInfo {

    /***
     *
     * @param {UnnyCommands.Command} command
     * @param {string} code
     * @param {function} callback
     */
    constructor(command, code, callback) {
        super(command, code, false, null);
        this.info.callbackDelayed = callback;
        RequestsManager.addRequest(this);
    }
}
