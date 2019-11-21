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
     */
    static setToken(token) {
        UnnySettings._saveValue(KEY_TOKEN, token);
    }

    static getToken() {
        return UnnySettings._getValue(KEY_TOKEN);
    }

    /**
     *
     * @param {string} token
     */
    static setRefreshToken(token) {
        UnnySettings._saveValue(KEY_REFRESH_TOKEN, token);
    }

    static getRefreshToken() {
        UnnySettings._getValue(KEY_REFRESH_TOKEN);
    }

    static clearTokens() {
        UnnySettings._removeItem(KEY_TOKEN);
        UnnySettings._removeItem(KEY_REFRESH_TOKEN);
    }
}