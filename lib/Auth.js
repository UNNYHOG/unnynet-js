import UnnyBaseObject from "./UnnyBaseObject";
import UnnynetCommand from "./Commands";
import UnnyNetSystem from "./UnnyNetSystem";

export default class Auth {
    /**
     *
     * @param {string} login
     * @param {string} password
     * @param {string} displayName
     * @param {function} doneCallback
     */
    static authorizeWithCredentials(login, password, displayName, doneCallback) {
        UnnyBaseObject.evalCodeHighPriority(UnnynetCommand.Command.AuthorizeWithCredentials, doneCallback, login, password, displayName);
    }

    /**
     *
     * @param {string} displayName
     * @param {function} doneCallback
     */
    static authorizeAsGuest(displayName, doneCallback) {
        UnnyBaseObject.evalCodeHighPriority(UnnynetCommand.Command.AuthorizeAsGuest, doneCallback, displayName);
    }

    /**
     *
     * @param {string} userName
     * @param {string} displayName
     * @param {function} doneCallback
     */
    static authorizeWithCustomId(userName, displayName, doneCallback) {
        UnnyBaseObject.evalCodeHighPriority(UnnynetCommand.Command.AuthorizeWithCustomId, doneCallback, userName, displayName);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static forceLogout(doneCallback) {
        UnnyBaseObject.evalCode(UnnynetCommand.Command.ForceLogout, doneCallback);
    }

    //region API

    /**
     *
     * @param {string} login
     * @param {string} password
     * @param {function} doneCallback
     */
    static authorize(login, password, doneCallback) {
        UnnyNetSystem.getAPI().authWithLogin(login, password, doneCallback);
    }

    //endregion
}
