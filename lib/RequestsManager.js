import UnnyNetSystem from "./UnnyNetSystem";
import {Errors} from "./Commands";

export default class RequestsManager {

    static staticRequestsManagerInstance = null;

    constructor() {
        this.uniqueIds = 0;
        this.allRequests = {};
    }

    _requestId() {
        if (this.uniqueIds === Number.MAX_SAFE_INTEGER)
            this.uniqueIds = 0;
        else
            this.uniqueIds++;
        return this.uniqueIds;
    }

    static getInstance() {
        if (!RequestsManager.staticRequestsManagerInstance)
            RequestsManager.staticRequestsManagerInstance = new RequestsManager();
        return RequestsManager.staticRequestsManagerInstance;
    }

    /***
     *
     * @param {UnnyCommandInfoDelayed} cmd
     */
    static addRequest(cmd) {
        const self = RequestsManager.getInstance();
        const id = self._requestId();
        self.allRequests[id] = cmd;

        if (cmd.getCode()) {
            const newCode = cmd.getCode().replace("<*id*>", id);
            cmd.setRequestId(id);
            cmd.setCode(newCode);
        }
    }

    /***
     *
     * @param {UnnyCommandInfoDelayed} cmd
     */
    static addLoadedRequest(cmd) {
        if (cmd.req_id >= 0) {
            const self = RequestsManager.getInstance();
            const id = cmd.req_id;
            self.allRequests[id] = cmd;

            if (id >= self.uniqueIds)
                self.uniqueIds = id === Number.MAX_SAFE_INTEGER ? 0 : id + 1;
        }
    }

    /***
     *
     * @param {object} reply
     */
    static replyReceived(reply) {
        const self = RequestsManager.getInstance();
        const id = reply.id;
        if (self.allRequests.hasOwnProperty(id)) {
            const info = self.allRequests[id];
            const response = info.invokeCallbackDelayed(reply);
            if (info.isDelayedRequestConfirm()) {
                let check = response.success;
                if (!check) {
                    switch (response.error.code) {
                        case Errors.NoSuchLeaderboard:
                        case Errors.NoSuchAchievement:
                        case Errors.WrongAchievementType:
                        case Errors.AchievementIsNotPublished:
                            check = true;
                            break;
                    }
                }

                if (check) {
                    UnnyNetSystem.delayedCommandWasConfirmed(info);
                    delete self.allRequests[id];
                }
            } else
                delete self.allRequests[id];
        }
    }
}
