import UnnynetCommand, {Errors} from "../Commands";
import UnnyNetAPIRequest from "../API/UnnyNetAPIRequest";
import UnnySettings from "../UnnySettings";
import UnnyNetAPI from "../API/UnnyNetAPI";

export default class DefaultSocial {

    constructor(unnyNetBase) {
        this.environment = unnyNetBase.environment;
        this.API = unnyNetBase.API;
        this.allGetParams = unnyNetBase.allGetParams;
        this.config = unnyNetBase.config;
        this.preloadedAds = [];
    }

    authorize(callback) {
        this._sendError("authorize", callback);
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
        this._sendError("_playRewardedAd", callback);
    }

    preloadRewardedAd(callbacks, playMethod) {
        this._sendError("preloadRewardedAd", callback);
    }

    //region payments

    purchaseProduct(productInfo, callback) {
        this._sendError("purchaseProduct", callback);
    }

    /**
     *
     * @param {number} orderId
     * @param {function} callback
     */
    completePurchase(orderId, callback) {
        this._sendError("completePurchase", callback);
    }

    /**
     *
     * @param {number} orderId
     * @param {function} callback
     */
    claimPurchase(orderId, callback) {
        this._sendError("claimPurchase", callback);
    }

    //endregion

    _sendError(methodName, callback) {
        const str = methodName + " isn't implemented for this platform";
        console.error(str);
        if (callback)
            callback(UnnynetCommand.getErrorResponse(Errors.Unknown, str));
    }
}
