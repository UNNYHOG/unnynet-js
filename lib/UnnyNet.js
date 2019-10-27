import UnnyNetBase from "./UnnyNetBase";
import UnnyCommands from "./Commands";
import UnnyCommandInfo, {UnnyCommandInfoDelayed} from "./CommandInfo";

export default class UnnyNet extends UnnyNetBase {
    static initialize(config) {
        new UnnyNet(config);
    }

    //region OpenPage
    /**
     *
     * @param {function} doneCallback
     */
    static openLeaderboards(doneCallback) {
        UnnyNetBase.evaluateCommand(UnnyCommands.Command.OpenLeaderBoards, true, doneCallback);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static openAchievements(doneCallback) {
        UnnyNetBase.evaluateCommand(UnnyCommands.Command.OpenAchievements, true, doneCallback);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static openFriends(doneCallback) {
        UnnyNetBase.evaluateCommand(UnnyCommands.Command.OpenFriends, true, doneCallback);
    }

    /**
     *
     * @param {string} channelId
     * @param {function} doneCallback
     */
    static openChannel(channelId, doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.OpenChannel).format(channelId);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.OpenChannel, code, true, doneCallback));
    }

    /**
     *
     * @param {function} doneCallback
     */
    static openGuilds(doneCallback) {
        UnnyNetBase.evaluateCommand(UnnyCommands.Command.OpenGuilds, true, doneCallback);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static openMyGuild(doneCallback) {
        UnnyNetBase.evaluateCommand(UnnyCommands.Command.OpenMyGuild, true, doneCallback);
    }

//endregion

//region Auth
    /**
     *
     * @param {string} login
     * @param {string} password
     * @param {string} displayName
     * @param {function} doneCallback
     */
    static authorizeWithCredentials(login, password, displayName, doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.AuthorizeWithCredentials).format(login, password, displayName);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.AuthorizeWithCredentials, code, false, doneCallback), true);
    }

    /**
     *
     * @param {string} displayName
     * @param {function} doneCallback
     */
    static authorizeAsGuest(displayName, doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.AuthorizeAsGuest).format(displayName);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.AuthorizeAsGuest, code, false, doneCallback), true);
    }

    /**
     *
     * @param {string} userName
     * @param {string} displayName
     * @param {function} doneCallback
     */
    static authorizeWithCustomId(userName, displayName, doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.AuthorizeWithCustomId).format(userName, displayName);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.AuthorizeWithCustomId, code, false, doneCallback), true);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static forceLogout(doneCallback) {
        UnnyNetBase.evaluateCommand(UnnyCommands.Command.ForceLogout, false, doneCallback);
    }

//endregion

//region Get
    /**
     *
     * @param {bool} fullInfo
     * @param {function} doneCallback
     */
    static getGuildInfo(fullInfo, doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.GetGuildInfo).format(fullInfo ? 1 : 0);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfoDelayed(UnnyCommands.Command.GetGuildInfo, code, doneCallback));
    }

    /**
     *
     * @param {function} doneCallback
     */
    static getAchievementsInfo(doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.GetAchievementsInfo);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfoDelayed(UnnyCommands.Command.GetAchievementsInfo, code, doneCallback));
    }

    /**
     *
     * @param {function} doneCallback
     */
    static getPlayerPublicInfo(doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.GetPlayerPublicInfo);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfoDelayed(UnnyCommands.Command.GetPlayerPublicInfo, code, doneCallback));
    }

    /**
     *
     * @param {string} leaderboardId
     * @param {function} doneCallback
     */
    static getLeaderboardScores(leaderboardId, doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.GetLeaderboardScores).format(leaderboardId);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfoDelayed(UnnyCommands.Command.GetLeaderboardScores, code, doneCallback));
    }

//endregion

//region API
    /**
     *
     * @param {string} channelId
     * @param {string} message
     * @param {function} doneCallback
     */
    static sendMessageToChannel(channelId, message, doneCallback) {
        if (message) {
            const code = UnnyCommands.GetCommand(UnnyCommands.Command.SendMessage).format(channelId, message);
            UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.SendMessage, code, false, doneCallback));
        }
    }

    /**
     *
     * @param {string} leaderboardId
     * @param {int} newScore
     * @param {string} custom_data
     * @param {function} doneCallback
     */
    static reportLeaderboards(leaderboardId, newScore, custom_data, doneCallback) {
        if (!custom_data)
            custom_data = "";
        else
            custom_data = encodeURIComponent(custom_data);
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.ReportLeaderboardScoresAsync).format(leaderboardId, newScore, custom_data);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfoDelayed(UnnyCommands.Command.ReportLeaderboardScoresAsync, code, doneCallback));
    }

    /**
     *
     * @param {int} achId
     * @param {int} progress
     * @param {function} doneCallback
     */
    static reportAchievements(achId, progress, doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.ReportAchievementProgressAsync).format(achId, progress);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfoDelayed(UnnyCommands.Command.ReportAchievementProgressAsync, code, doneCallback));
    }

    /**
     *
     * @param {int} experience
     * @param {function} doneCallback
     */
    static addGuildExperience(experience, doneCallback) {
        const code = UnnyCommands.GetCommand(UnnyCommands.Command.AddGuildExperience).format(experience);
        UnnyNetBase.evaluateCodeInJavaScript(new UnnyCommandInfo(UnnyCommands.Command.AddGuildExperience, code, false, doneCallback));
    }

//endregion
}
