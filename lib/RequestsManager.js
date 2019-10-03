export default class RequestsManager {

    static staticRequestsManagerInstance = null;

    constructor() {
        this.uniqueIds = 0;
        this.allRequests = {};
    }

    _requestId() {
        return this.uniqueIds++;
    }

    static getInstance() {
        if (!RequestsManager.staticRequestsManagerInstance)
            RequestsManager.staticRequestsManagerInstance = new RequestsManager();
        return RequestsManager.staticRequestsManagerInstance;
    }

    /***
     *
     * @param {UnnyCommandInfo} cmd
     */
    static addRequest(cmd) {
        const self = RequestsManager.getInstance();
        const id = self._requestId();
        self.allRequests[id] = cmd;

        if (cmd.getCode()) {
            const newCode = cmd.getCode().replace("<*id*>", id);
            cmd.setCode(newCode);
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
            const r = self.allRequests[id];
            r.invokeCallbackDelayed(reply);
            delete self.allRequests[id];
        }
    }
}