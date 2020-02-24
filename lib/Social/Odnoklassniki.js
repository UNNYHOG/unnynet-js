import DefaultSocial from "./DefaultSocial";
import Auth from "../Auth";

export default class Odnoklassniki extends DefaultSocial {
    authorize(callback) {
        this.API.authWithOK(callback);
        this._autoAuthInNakama();
    }

    _autoAuthInNakama() {
        Auth.authorizeAsGuest("");//TODO take name from OK
    }

    getDeviceIdForNakama() {
        return "odnoklassniki_" + "user_id";
    }
}
