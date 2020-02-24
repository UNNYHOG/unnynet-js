import DefaultSocial from "./DefaultSocial";
import Auth from "../Auth";

export default class Vkontakte extends DefaultSocial {
    authorize(callback) {
        this.API.authWithVK(this.environment, this._getVkUserId(), this._getVkAccessToken(), callback);
        this._autoAuthInNakama();
    }

    _getVkUserId() {
        return this.allGetParams.viewer_id;
    }

    _getVkAccessToken() {
        return this.allGetParams.access_token;
    }

    _autoAuthInNakama() {
        Auth.authorizeAsGuest("");//TODO take name from VK
    }

    getDeviceIdForNakama() {
        return "vkontakte_" + this._getVkUserId();
    }
}
