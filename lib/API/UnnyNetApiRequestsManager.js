import UnnyNetSystem from "../UnnyNetSystem";

const RETRY_PERIOD = 1;
const RETRY_COUNT = 0;
const MAX_REQUESTS_TO_SAVE = 100;

export default class UnnyNetApiRequestsManager {

    static instance;

    constructor(config) {
        this.localSaveKey = "UN_API_SAVE_" + config.environment + "_" + config.game_id;
        this.requestsQueue = [];
        UnnyNetApiRequestsManager.instance = this;

        this.loadRequests();
        this.last_update_time = Date.now();
        this.requests_were_updated = false;
        setInterval(() => this._checkRequestToSave(), 1000);
    }

    _getSaveKey() {
        return this.localSaveKey;
    }

    _updateTokenForRequests(newToken) {
        for (let i in this.requestsQueue) {
            const req = this.requestsQueue[i].data.request;
            if (req.headers.hasOwnProperty('Authorization'))
                req.headers['Authorization'] = "Bearer " + newToken;
        }
    }

    static updateTokenForRequests(newToken) {
        UnnyNetApiRequestsManager.instance._updateTokenForRequests(newToken);
    }

    /**
     *
     * @param {string} url
     * @param {object} request
     * @param {bool} save
     * @param {method} callback
     */
    static enqueueRequest(url, request, save, callback) {
        UnnyNetApiRequestsManager.instance._enqueueRequest(url, request, save, false, callback);
    }

    /**
     *
     * @param {string} url
     * @param {object} request
     * @param {bool} save
     * @param {method} callback
     */
    static enqueueImportantRequest(url, request, save, callback) {
        UnnyNetApiRequestsManager.instance._enqueueRequest(url, request, save, true, callback);
    }

    _enqueueRequest(url, request, save, important, callback) {
        const data = {
            data: {
                url: url,
                request: request
            },
            callback: callback,
            retries: 0,
            save: save
        };

        if (important)
            this.requestsQueue.unshift(data);
        else
            this.requestsQueue.push(data);

        this.requests_were_updated = true;

        if (this.requestsQueue.length === 1)
            this._sendNextRequest();
        else {
            //todo try to merge requests in queue, for example saves
        }
    }

    _checkRequestToSave() {
        if (this.requestsQueue.length > 0 && this.requests_were_updated) {
            const now = Date.now();
            if (now - this.last_update_time > 5000) {
                this.last_update_time = now;
                this.requests_were_updated = false;
                this.saveRequests();
            }
        }
    }

    _removeFirstRequest(request) {
        for (let i = 0; i < this.requestsQueue.length; i++) {
            if (this.requestsQueue[i] === request) {
                this.requestsQueue.splice(i, 1);
                break;
            }
        }
        this._sendNextRequest();
        this.last_update_time = Date.now();
    }

    _sendNextRequest() {
        if (this.requestsQueue.length === 0)
            return;

        const req = this.requestsQueue[0];
        const url = req.data.url;
        const request = req.data.request;
        const callback = req.callback;

        UnnyNetSystem.log('fetch', url, request.body);
        fetch(url, request).then(function (response) {
            UnnyNetSystem.log('fetch response', response);
            if (response.status >= 200 && response.status < 300)
                return response.json();
            else
                return Promise.reject(response);
        }).then((data) => {
            if (callback)
                callback(null, data);
            this._removeFirstRequest(req);
        }).catch((error) => {
            UnnyNetSystem.log('fetch failed', error);
            //todo check errors. we might need to reconnect or return error instantly
            if (req.retries < RETRY_COUNT) {
                req.retries++;
                setTimeout(() => this._sendNextRequest(), RETRY_PERIOD * 1000);
            } else {
                if (callback)
                    callback(error, null);
                this._removeFirstRequest(req);
            }
        });
    }

    loadRequests() {
        const load = localStorage.getItem(this._getSaveKey());
        if (load) {
            const loadJson = JSON.parse(load);
            if (loadJson) {
                for (let i in loadJson) {
                    const data = loadJson[i];
                    this._enqueueRequest(data.url, data.request, true, null);
                }
            }
            localStorage.removeItem(this._getSaveKey());
        }
    }

    saveRequests() {
        const count = Math.min(MAX_REQUESTS_TO_SAVE, this.requestsQueue.length);
        if (count > 0) {
            const list = [];
            for (let i = 0; i < count; i++) {
                if (this.requestsQueue[i].save)
                    list.push(this.requestsQueue[i].data);
            }
            localStorage.setItem(this._getSaveKey(), JSON.stringify(list));
        }
    }
}
