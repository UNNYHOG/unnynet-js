import UnnynetCommand, {Errors} from "../Commands";

export default class DefaultSocial {

    constructor(unnyNetBase) {
        this.environment = unnyNetBase.environment;
        this.API = unnyNetBase.API;
        this.allGetParams = unnyNetBase.allGetParams;
        this.preloadedAds = [];
    }

    authorize(callback) {
        console.error("authorize isn't implemented for this platform");
        if (callback)
            callback(UnnynetCommand.getErrorResponse(Errors.Unknown, "authorize isn't implemented for this platform"));
    }

    _autoAuthInNakama() {
        console.error("No nakama auth for current platform");
    }

    getDeviceIdForNakama() {
        return null;
    }

    /**
     *
     * @param {object} callbacks
     * onAdBlock
     * onError
     * onNoAds
     * onStarted
     * onCompleted
     * onSkipped
     * onClicked
     */
    playRewardedAd(callbacks) {
        if (this.preloadedAds.length > 0)
            this._playRewardedAd(callbacks);
        else
            this.preloadRewardedAd(callbacks, this._playRewardedAd);
    }

    _playRewardedAd(callbacks) {
        console.error("_playRewardedAd isn't implemented for this platform");
        if (callbacks && callbacks.onError)
            callbacks.onError(UnnynetCommand.getErrorResponse(Errors.Unknown, "_playRewardedAd isn't implemented for this platform"));
    }

    preloadRewardedAd(callbacks, playMethod) {
        console.error("preloadRewardedAd isn't implemented for this platform");
        if (callbacks && callbacks.onError)
            callbacks.onError(UnnynetCommand.getErrorResponse(Errors.Unknown, "preloadRewardedAd isn't implemented for this platform"));
    }
}
