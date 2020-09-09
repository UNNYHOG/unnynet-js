import UnnyNetApiRequestsManager from "./UnnyNetApiRequestsManager";
import UnnySettings from "../UnnySettings";
import UnnyConstants from "../Constants";

export default class UnnyNetAPIRequest {
    /**
     *
     * @param {string} url
     * @param {object} data
     * @param {function} callback
     */
    constructor(url, data, callback = null) {
        this.url = url.startsWith('http') ? url : UnnyConstants.GENERAL_CONSTANTS.API_URL + url;
        this.data = data;
        this.callback = callback;

        this.retry = 0;
        this.savePost = true;
        this.important = false;
    }

    /**
     *
     * @param {object} headers
     * @returns {UnnyNetAPIRequest}
     * @constructor
     */
    setHeaders(headers) {
        this.headers = headers;

        return this;
    }

    /**
     *
     * @param {string} header
     * @param {string} value
     * @returns {UnnyNetAPIRequest}
     */
    setHeader(header, value) {
        if (!this.headers)
            this.headers = {};
        this.headers[header] = value;
        return this;
    }

    setToken(token) {
        return this.setHeader('Authorization', "Bearer " + token);
    }

    _sendRequest(request, save) {
        if (this.important)
            UnnyNetApiRequestsManager.enqueueImportantRequest(this.url, request, save, this.callback);
        else
            UnnyNetApiRequestsManager.enqueueRequest(this.url, request, save, this.callback);
    }

    _send(request, save) {
        request.headers = {
            "Content-Type": "application/json",
        };

        if (this.headers) {
            for (let k in this.headers)
                request.headers[k] = this.headers[k];
        }
        this._sendRequest(request, save);
    }

    markAsAuth() {
        return this.markAsUnsavable().markImportant();
    }

    markAsUnsavable() {
        this.savePost = false;
        return this;
    }

    markImportant() {
        this.important = true;
        return this;
    }

    get() {
        this._send({method: 'GET'}, false);
    }

    post() {
        const request = {
            method: 'POST'
        };

        if (this.data)
            request.body = JSON.stringify(this.data);

        this._send(request, this.savePost);
    }
}
