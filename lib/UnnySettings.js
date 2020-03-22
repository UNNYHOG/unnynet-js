// const KEY_TOKEN = "test_un_token";
// const KEY_REFRESH_TOKEN = "test_un_refresh_token";
const KEY_TOKEN = "un_token";
const KEY_REFRESH_TOKEN = "un_refresh_token";

export default class UnnySettings {
    /**
     *
     * @param {string} key
     * @param {string} value
     * @private
     */
    static _saveValue(key, value) {
        localStorage.setItem(key, value);
    }

    static _getValue(key) {
        return localStorage.getItem(key);
    }

    static _removeItem(key) {
        localStorage.removeItem(key);
    }

    /**
     *
     * @param {string} token
     * @param {number} environment
     */
    static setToken(token, environment) {
        UnnySettings._saveValue(UnnySettings._getTokenKeyForEnvironment(environment), token);
    }

    /**
     *
     * @param {number} environment
     */
    static getToken(environment) {
        return UnnySettings._getValue(UnnySettings._getTokenKeyForEnvironment(environment));
    }

    /**
     *
     * @param {string} token
     * @param {number} environment
     */
    static setRefreshToken(token, environment) {
        UnnySettings._saveValue(UnnySettings._getRefreshTokenKeyForEnvironment(environment), token);
    }

    /**
     *
     * @param {number} environment
     */
    static getRefreshToken(environment) {
        UnnySettings._getValue(UnnySettings._getRefreshTokenKeyForEnvironment(environment));
    }

    /**
     *
     * @param {number} environment
     */
    static clearTokens(environment) {
        UnnySettings._removeItem(UnnySettings._getTokenKeyForEnvironment(environment));
        UnnySettings._removeItem(UnnySettings._getRefreshTokenKeyForEnvironment(environment));
    }

    static _getTokenKeyForEnvironment(environment) {
        return 'env' + environment + KEY_TOKEN;
    }

    static _getRefreshTokenKeyForEnvironment(environment) {
        return 'env' + environment + KEY_REFRESH_TOKEN;
    }

}
