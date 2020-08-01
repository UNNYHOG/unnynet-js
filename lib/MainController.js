import UnnyBaseObject from "./UnnyBaseObject";
import UnnyNetSystem from "./UnnyNetSystem";
import UnnynetCommand from "./Commands";

export default class MainController {

    //region main methods

    static init(config) {
        UnnyNetSystem.initialize(config);
    }

    //endregion

    //region open windows

    /**
     *
     * @param {function} doneCallback
     */
    static openLeaderboards(doneCallback) {
        UnnyBaseObject.openWindow(UnnynetCommand.Command.OpenLeaderBoards, doneCallback);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static openAchievements(doneCallback) {
        UnnyBaseObject.openWindow(UnnynetCommand.Command.OpenAchievements, doneCallback);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static openFriends(doneCallback) {
        UnnyBaseObject.openWindow(UnnynetCommand.Command.OpenFriends, doneCallback);
    }

    /**
     *
     * @param {string} channelId
     * @param {function} doneCallback
     */
    static openChannel(channelId, doneCallback) {
        UnnyBaseObject.evalCodeAndOpen(UnnynetCommand.Command.OpenChannel, doneCallback, channelId);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static openGuilds(doneCallback) {
        UnnyBaseObject.openWindow(UnnynetCommand.Command.OpenGuilds, doneCallback);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static openMyGuild(doneCallback) {
        UnnyBaseObject.openWindow(UnnynetCommand.Command.OpenMyGuild, doneCallback);
    }

    //endregion

    //region settings

    /**
     *
     * @param {object} rect {left, top, right, left, width, height}
     */
    static setFrame(rect)
    {
        UnnyNetSystem.setFrame(rect);
    }

    /**
     *
     * @param {boolean} visible
     */
    static setCloseButtonVisible(visible)
    {
        UnnyNetSystem.setCloseButtonVisible(visible);
    }

    //endregion

    //region getters

    /**
     *
     * @param {function} doneCallback
     */
    static getPlayerPublicInfo(doneCallback) {
        UnnyBaseObject.evalCodeAdvanced(UnnynetCommand.Command.GetPlayerPublicInfo, doneCallback);
    }

    //endregion
}
