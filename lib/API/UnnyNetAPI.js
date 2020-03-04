import UnnySettings from "../UnnySettings";
import UnnyNetAPIRequest from "./UnnyNetAPIRequest";
import UnnynetCommand, {Errors} from "../Commands";
import UnnyNetApiRequestsManager from "./UnnyNetApiRequestsManager";
import Constants from "../Constants";



export default class UnnyNetAPI {
    /**
     *
     * @param {object} config (game_id, public_key)
     */
    constructor(config) {
        this.config = config;
        this.apiRequests = new UnnyNetApiRequestsManager(this.config);
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
        return UnnyNetAPI.createAuthRequest('/v1/auth/name', {
            name: login,
            password: password,
            game_id: this.config.game_id,
            public_key: this.config.public_key
        }, callback);
    }

    /**
     *
     * @param {number} env
     * @param {string} userId
     * @param {string} token
     * @param {function} callback
     */
    authWithVK(env, userId, token, callback) {
        if (!env && env !== 0)
            return this._sendDefaultError("[VK]: no environment provided", callback);
        if (!userId)
            return this._sendDefaultError("[VK]: no viewer_id provided", callback);
        if (!token)
            return this._sendDefaultError("[VK]: no auth_key provided", callback);

        return UnnyNetAPI.createAuthRequest('/v1/auth/vk', {
            env,
            user_id: userId,
            token: token,
            game_id: this.config.game_id,
            public_key: this.config.public_key
        }, callback);
    }

    /**
     * @param {number} env
     * @param {string} accessToken
     * @param {string} sessionSecretKey
     * @param {function} callback
     */
    authWithOK(env, accessToken, sessionSecretKey, callback) {
        if (!env && env !== 0)
            return this._sendDefaultError("[OK]: no environment provided", callback);
        if (!accessToken)
            return this._sendDefaultError("[OK]: no access_token provided", callback);
        if (!sessionSecretKey)
            return this._sendDefaultError("[OK]: no session_secret_key provided", callback);

        return UnnyNetAPI.createAuthRequest('/v1/auth/ok', {
            env,
            access_token: accessToken,
            session_secret_key: sessionSecretKey,
            game_id: this.config.game_id,
            public_key: this.config.public_key
        }, callback);
    }

    /**
     * @param {number} env
     * @param {string} token
     * @param {function} callback
     */
    authWithFB(env, token, callback) {
        if (!env && env !== 0)
            return this._sendDefaultError("[FB]: no environment provided", callback);
        if (!token)
            return this._sendDefaultError("[FB]: no auth_key provided", callback);

        return UnnyNetAPI.createAuthRequest('/v1/auth/fb', {
            env,
            token,
            game_id: this.config.game_id,
            public_key: this.config.public_key
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
        const request = new UnnyNetAPIRequest('/v1/saves', {
            collection: collection,
            key: key,
            value: data
        }, (err, data) => UnnynetCommand.onCallback(err, data, callback));

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
     * @param {object} data
     * @param {number} version
     * @param {function} callback
     */
    save(collection, key, data, version, callback) {
        const token = UnnySettings.getToken();
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
        const request = new UnnyNetAPIRequest(
            '/v1/saves?collection=' + collection + (key ? '&key=' + key : ''),
            null,
            (err, data) => UnnynetCommand.onCallback(err, data, callback));

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
                callback(UnnynetCommand.getErrorResponse(Errors.NoAccessToken));
        } else {
            this._load(collection, key, callback);
        }
    }

    //region utils

    static createDefaultRequest(url, params, callback) {
        return new UnnyNetAPIRequest(url, params, (err, data) => UnnynetCommand.onCallback(err, data, callback))
            .setToken(UnnySettings.getToken())
            .post();
    }

    static createAuthRequest(url, params, callback) {
        UnnySettings.clearTokens();
        return new UnnyNetAPIRequest(url, params, (err, data) => UnnynetCommand.onAuthCallback(err, data, callback))
            .markAsAuth()
            .post();
    }

    //endregion
}
