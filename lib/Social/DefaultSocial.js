import UnnyCommands, {Errors} from "../Commands";

export default class DefaultSocial {

    constructor(unnyNetBase) {
        this.environment = unnyNetBase.environment;
        this.API = unnyNetBase.API;
        this.allGetParams = unnyNetBase.allGetParams;
    }

    authorize(callback) {
        console.error("authorize isn't implemented for this platform");
        if (callback)
            callback(UnnyCommands.getErrorResponse(Errors.Unknown, "authorize isn't implemented for this platform"));
    }

    _autoAuthInNakama() {
        console.error("No nakama auth for current platform");
    }

    getDeviceIdForNakama() {
        return null;
    }
}
