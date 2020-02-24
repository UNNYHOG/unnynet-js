import UnnyBaseObject from "./UnnyBaseObject";
import UnnynetCommand from "./Commands";

export default class Social {

    //region leaderboards
    /**
     *
     * @param {string} leaderboardId
     * @param {int} newScore
     * @param {string} customData
     * @param {function} doneCallback
     */
    static reportLeaderboardScore(leaderboardId, newScore, customData, doneCallback) {
        const filteredCustomData = !customData ? "" : encodeURIComponent(customData);
        UnnyBaseObject.evalCodeDelayed(UnnynetCommand.Command.ReportLeaderboardScoresAsync, doneCallback, leaderboardId, newScore, filteredCustomData);
    }

    /**
     *
     * @param {string} leaderboardId
     * @param {function} doneCallback
     */
    static getLeaderboardScores(leaderboardId, doneCallback) {
        UnnyBaseObject.evalCodeAdvanced(UnnynetCommand.Command.GetLeaderboardScores, doneCallback, leaderboardId);
    }

    //endregion

    //region achievements

    /**
     *
     * @param {int} achId
     * @param {int} progress
     * @param {function} doneCallback
     */
    static reportAchievementProgress(achId, progress, doneCallback) {
        UnnyBaseObject.evalCodeDelayed(UnnynetCommand.Command.ReportAchievementProgressAsync, doneCallback, achId, progress);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static getAchievementsInfo(doneCallback) {
        UnnyBaseObject.evalCodeAdvanced(UnnynetCommand.Command.GetAchievementsInfo, doneCallback);
    }

    //endregion


    //region guilds

    /**
     *
     * @param {int} experience
     * @param {function} doneCallback
     */
    static addGuildExperience(experience, doneCallback) {
        UnnyBaseObject.evalCode(UnnynetCommand.Command.AddGuildExperience, doneCallback, experience);
    }

    /**
     *
     * @param {bool} fullInfo
     * @param {function} doneCallback
     */
    static getGuildInfo(fullInfo, doneCallback) {
        UnnyBaseObject.evalCodeAdvanced(UnnynetCommand.Command.GetGuildInfo, doneCallback, fullInfo ? 1 : 0);
    }

    //endregion
}
