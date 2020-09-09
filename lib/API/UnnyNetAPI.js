import UnnySettings from "../UnnySettings";
import UnnyNetAPIRequest from "./UnnyNetAPIRequest";
import UnnynetCommand, {Errors} from "../Commands";
import UnnyNetApiRequestsManager from "./UnnyNetApiRequestsManager";
import Constants from "../Constants";
import UnnyNetSystem from "../UnnyNetSystem";



export default class UnnyNetAPI {

    getHeaderParams;
    static instance;

    /**
     *
     * @param {object} config (game_id, public_key)
     */
    constructor(config) {
        UnnyNetAPI.instance = this;
        this.config = config;
        this.apiRequests = new UnnyNetApiRequestsManager(this.config);

        this.getHeaderParams = "env={0}&platform={1}".format(this.config.environment, this.config.platform);
    }

    _sendDefaultError(message, callback) {
        if (callback)
            callback(UnnynetCommand.getErrorResponse(Errors.Unknown, message));

        console.error(message);
    }

    /**
     *
     * @param {string} login
     * @param {string} password
     * @param {function} callback
     */
    authWithLogin(login, password, callback) {
        this._clearTokens();
        return UnnyNetAPI.createAuthRequest('/v1/auth/name', {
            name: login,
            password: password
        }, callback);
    }

    /**
     *
     * @param {string} userId
     * @param {string} token
     * @param {function} callback
     */
    authWithVK(userId, token, callback) {
        this._clearTokens();
        if (!userId)
            return this._sendDefaultError("[VK]: no viewer_id provided", callback);
        if (!token)
            return this._sendDefaultError("[VK]: no auth_key provided", callback);

        return UnnyNetAPI.createAuthRequest('/v1/auth/vk', {
            user_id: userId,
            token: token
        }, callback);
    }

    /**
     * @param {string} accessToken
     * @param {string} sessionSecretKey
     * @param {function} callback
     */
    authWithOK(accessToken, sessionSecretKey, callback) {
        this._clearTokens();
        if (!accessToken)
            return this._sendDefaultError("[OK]: no access_token provided", callback);
        if (!sessionSecretKey)
            return this._sendDefaultError("[OK]: no session_secret_key provided", callback);

        return UnnyNetAPI.createAuthRequest('/v1/auth/ok', {
            access_token: accessToken,
            session_secret_key: sessionSecretKey
        }, callback);
    }

    /**
     * @param {string} token
     * @param {function} callback
     */
    authWithFB(token, callback) {
        this._clearTokens();
        if (!token)
            return this._sendDefaultError("[FB]: no auth_key provided", callback);

        return UnnyNetAPI.createAuthRequest('/v1/auth/fb', {
            token,
        }, callback);
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {object} data
     * @param {number} version
     * @param {function} callback
     * @private
     */
    _save(collection, key, data, version, callback) {
        const request = UnnyNetAPI.instance._createNewRequest('/v1/saves', {
            collection: collection,
            key: key,
            value: data
        }, (err, data) => UnnynetCommand.onCallback(err, data, callback));

        if (!(version >= 0))
            version = -1;
        request
            .setToken(this._getToken())
            .setHeader("data-version", version.toString())
            .post();
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {object} data
     * @param {number} version
     * @param {function} callback
     */
    save(collection, key, data, version, callback) {
        const token = this._getToken();
        if (!token) {
            if (callback)
                callback(UnnynetCommand.getErrorResponse(Errors.NoAccessToken));
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
        UnnyNetAPI.createDefaultGetRequest('/v1/saves?collection=' + collection + (key ? '&key=' + key : ''), callback);
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {function} callback
     */
    load(collection, key, callback) {
        const token = this._getToken();
        if (!token) {
            if (callback)
                callback(UnnynetCommand.getErrorResponse(Errors.NoAccessToken));
        } else {
            this._load(collection, key, callback);
        }
    }

    //region utils

    static createDefaultRequest(url, params, callback) {
        return UnnyNetAPI.instance._createNewRequest(url, params, (err, data) => UnnynetCommand.onCallback(err, data, callback))
            .setToken(UnnyNetAPI.instance._getToken())
            .post();
    }

    static createDefaultGetRequest(url, callback) {
        return UnnyNetAPI.instance._createNewRequest(url, null, (err, data) => UnnynetCommand.onCallback(err, data, callback))
            .setToken(UnnyNetAPI.instance._getToken())
            .get();
    }

    static createAuthRequest(url, params, callback) {

        params.env = UnnyNetAPI.instance._getEnvironment();
        params.game_id = UnnyNetAPI.instance.config.game_id;
        params.public_key = UnnyNetAPI.instance.config.public_key;

        return UnnyNetAPI.instance._createNewRequest(url, params, (err, data) => UnnynetCommand.onAuthCallback(err, data, callback))
            .markAsAuth()
            .post();
    }

    sendInitEvent() {
        return this._createNewRequest(Constants.GENERAL_CONSTANTS.ANAL_URL + "/v1/event/init/device",
            {
                "device_id": UnnyNetSystem.getSocialPlatform().getDeviceIdForNakama(),
                "game_id": this.config.api_game_id
            })
            .post();
    }

    _createNewRequest(url, params, callback) {
        if (params) {
            params.env = this._getEnvironment();
            params.platform = this.config.platform;
        } else
            url += (url.includes('?') ? '&' : '?') + this.getHeaderParams;
        return new UnnyNetAPIRequest(url, params, callback);
    }

    _clearTokens() {
        UnnySettings.clearTokens();
    }

    _getToken() {
        return UnnySettings.getToken();
    }

    _getEnvironment() {
        return this.config.environment;
    }

    //endregion
}
