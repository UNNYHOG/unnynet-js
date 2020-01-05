import DefaultSocial from "./DefaultSocial";
import UnnyNet from "../UnnyNet";

export default class Odnoklassniki extends DefaultSocial {
    authorize(callback) {
        this.API.authWithOK(callback);
        this._autoAuthInNakama();
    }

    _autoAuthInNakama() {
        UnnyNet.authorizeAsGuest("");//TODO take name from OK
    }

    getDeviceIdForNakama() {
        return "odnoklassniki_" + "user_id";
    }
}
