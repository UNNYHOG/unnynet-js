import UnnySettings from "../UnnySettings";
import UnnyNetAPIRequest from "./UnnyNetAPIRequest";
import UnnyCommands, {Errors} from "../Commands";
import UnnyNetApiRequestsManager from "./UnnyNetApiRequestsManager";

// const API_URL = "https://test-un-api.unnynet.com";
const API_URL = "https://un-api.unnynet.com";

export default class UnnyNetAPI {
    /**
     *
     * @param {object} config (game_id, public_key)
     */
    constructor(config) {
        this.config = config;
    }

    _onAuth(data) {
        const accessToken = data ? data.accessToken : null;
        const refreshToken = data ? data.refreshToken : null;
        console.info("_onAuth", data);
        if (accessToken) {
            UnnySettings.setToken(accessToken);
            UnnyNetApiRequestsManager.updateTokenForRequests(accessToken);
        }
        if (refreshToken)
            UnnySettings.setRefreshToken(refreshToken);
    }

    _onAuthCallback(err, data, callback) {
        let response;
        if (err) {
            response = UnnyCommands.getErrorResponse(Errors.Unknown, err.status + ':' + err.statusText);
        } else {
            response = UnnyCommands.getSuccessResponse(data);
            this._onAuth(data);
        }
        if (callback)
            callback(response);
    }

    _onCallback(err, data, callback) {
        let response;
        if (err)
            response = UnnyCommands.getErrorResponse(Errors.Unknown, err.status + ':' + err.statusText);
        else
            response = UnnyCommands.getSuccessResponse(data);
        if (callback)
            callback(response);
    }

    /**
     *
     * @param {string} login
     * @param {string} password
     * @param {function} callback
     */
    authWithLogin(login, password, callback) {
        UnnySettings.clearTokens();
        const request = new UnnyNetAPIRequest(API_URL + '/v1/auth/name', {
            name: login,
            password: password,
            game_id: this.config.game_id,
            public_key: this.config.public_key
        }, (err, data) => this._onAuthCallback(err, data, callback));
        request.markAsAuth().post();
    }

    /**
     *
     * @param {string} userId
     * @param {int} platform
     * @param {string} oauthToken
     * @param {string} oauthTokenSecret
     * @param {string} autologinToken
     * @param {function} callback
     */
    authWithNutaku(userId, platform, oauthToken, oauthTokenSecret, autologinToken, callback) {
        UnnySettings.clearTokens();
        const request = new UnnyNetAPIRequest(API_URL + '/v1/auth/nutaku', {
            user_id: userId,
            platform: platform.toString(),
            oauth_token: oauthToken,
            oauth_token_secret: oauthTokenSecret,
            autologin_token: autologinToken,
            game_id: this.config.game_id,
            public_key: this.config.public_key
        }, (err, data) => this._onAuthCallback(err, data, callback));
        request.markAsAuth().post();
    }

    /**
     * This method is used for quthorization iside of iFrame
     * @param {function} callback
     */
    authWithNutakuGadget(callback) {
        UnnySettings.clearTokens();
        let params = {
            [gadgets.io.RequestParameters.METHOD]: gadgets.io.MethodType.POST,
            [gadgets.io.RequestParameters.CONTENT_TYPE]: gadgets.io.ContentType.JSON,
            [gadgets.io.RequestParameters.POST_DATA]: gadgets.io.encodeValues({
                game_id: this.config.game_id,
                public_key: this.config.public_key
            }),
            [gadgets.io.RequestParameters.AUTHORIZATION]: gadgets.io.AuthorizationType.SIGNED
        };
        console.error("SENDING...", params);
        gadgets.io.makeRequest(API_URL + "/v1/auth/nutaku_pc", (obj) => {
            console.info("NUTAKU REPLY", obj);
            if (obj.errors && obj.errors.length)
                console.error('AUTH ERROR', obj.errors);
            this._onAuthCallback(null, obj.data, callback);
        }, params);
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {string} data
     * @param {int} version
     * @param {function} callback
     * @private
     */
    _save(collection, key, data, version, callback) {
        const request = new UnnyNetAPIRequest(API_URL + '/v1/saves', {
            collection: collection,
            key: key,
            value: data
        }, (err, data) => this._onCallback(err, data, callback));

        if (!version)
            version = -1;
        request
            .setToken(UnnySettings.getToken())
            .setHeader("data-version", version.toString())
            .post();
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {string} data
     * @param {int} version
     * @param {function} callback
     */
    save(collection, key, data, version, callback) {
        const token = UnnySettings.getToken();
        if (!token) {
            if (callback)
                callback(UnnyCommands.getErrorResponse(Errors.NoAccessToken));
        } else {
            this._save(collection, key, data, version, callback);
        }
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {function} callback
     * @private
     */
    _load(collection, key, callback) {
        const request = new UnnyNetAPIRequest(
            API_URL + '/v1/saves?collection=' + collection + (key ? '&key=' + key : ''),
            null,
            (err, data) => this._onCallback(err, data, callback));

        request
            .setToken(UnnySettings.getToken())
            .get();
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {function} callback
     */
    load(collection, key, callback) {
        const token = UnnySettings.getToken();
        if (!token) {
            if (callback)
                callback(UnnyCommands.getErrorResponse(Errors.NoAccessToken));
        } else {
            this._load(collection, key, callback);
        }
    }
}
