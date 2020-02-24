import UnnyNetSystem from "./UnnyNetSystem";

export default class UnnyNet {
    //TODO do something with it
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
