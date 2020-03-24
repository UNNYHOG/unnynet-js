// const KEY_TOKEN = "test_un_token";
// const KEY_REFRESH_TOKEN = "test_un_refresh_token";
const KEY_TOKEN = "un_token";
const KEY_REFRESH_TOKEN = "un_refresh_token";

export default class UnnySettings {

    static environment;

    static setEnvironment(env) {
        UnnySettings.environment = env;
    }

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
     */
    static setToken(token) {
        UnnySettings._saveValue(UnnySettings._getTokenKeyForEnvironment(), token);
    }

    static getToken() {
        return UnnySettings._getValue(UnnySettings._getTokenKeyForEnvironment());
    }

    /**
     *
     * @param {string} token
     */
    static setRefreshToken(token) {
        UnnySettings._saveValue(UnnySettings._getRefreshTokenKeyForEnvironment(), token);
    }

    static getRefreshToken() {
        UnnySettings._getValue(UnnySettings._getRefreshTokenKeyForEnvironment());
    }

    static clearTokens() {
        UnnySettings._removeItem(UnnySettings._getTokenKeyForEnvironment());
        UnnySettings._removeItem(UnnySettings._getRefreshTokenKeyForEnvironment());
    }

    static _getTokenKeyForEnvironment() {
        return 'env' + UnnySettings.environment + KEY_TOKEN;
    }

    static _getRefreshTokenKeyForEnvironment() {
        return 'env' + UnnySettings.environment + KEY_REFRESH_TOKEN;
    }

}
