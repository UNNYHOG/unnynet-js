import UnnynetCommand, {Errors} from "../Commands";
import UnnyNetAPIRequest from "../API/UnnyNetAPIRequest";
import UnnySettings from "../UnnySettings";
import UnnyNetAPI from "../API/UnnyNetAPI";
import UnnyConstants from "../Constants";

export default class DefaultSocial {

    constructor(unnyNetBase) {
        this.environment = unnyNetBase.environment;
        this.API = unnyNetBase.API;
        this.allGetParams = unnyNetBase.allGetParams;
        this.config = unnyNetBase.config;
        this.preloadedAds = [];
        this.platform = this.config.platform;
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
            this.preloadRewardedAd(callbacks, (cb) => this._playRewardedAd(cb));
    }

    _playRewardedAd(callbacks) {
        this._sendError("_playRewardedAd", callbacks.onError);
    }

    preloadRewardedAd(callbacks, playMethod) {
        this._sendError("preloadRewardedAd", callbacks.onError);
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
        return UnnyNetAPI.createDefaultRequest("/v1/payments/all/complete", {
            platform: this.platform,
            un_order_id: orderId
        });
    }

    /**
     *
     * @param {number} orderId
     * @param {function} callback
     */
    claimPurchase(orderId, callback) {
        return UnnyNetAPI.createDefaultRequest("/v1/payments/all/claim", {
            platform: this.platform,
            un_order_id: orderId
        });
    }

    //endregion

    _sendError(methodName, callback) {
        const str = methodName + " isn't implemented for this platform";
        console.error(str);
        if (callback)
            callback(UnnynetCommand.getErrorResponse(Errors.Unknown, str));
    }
}
