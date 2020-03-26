import DefaultSocial from "./DefaultSocial";
import Auth from "../Auth";
import Utils from "../Utils";
import Payments from "../Payments";

export default class Vkontakte extends DefaultSocial {
    authorize(callback) {
        this._initializeVk(() => {
            this.API.authWithVK(this.environment, this._getVkUserId(), this._getVkAccessToken(), callback);
            this._autoAuthInNakama();
        });
    }

    _getVkUserId() {
        return this.allGetParams.viewer_id;
    }

    _getVkAccessToken() {
        return this.allGetParams.access_token;
    }

    _getAdsAppId() {
        return this.allGetParams.ads_app_id;
    }

    _autoAuthInNakama() {
        Auth.authorizeAsGuest("");//TODO take name from VK
    }

    getDeviceIdForNakama() {
        return "vkontakte_" + this._getVkUserId();
    }

    _initializeVk(callback) {
        if (window === top) {//not an iframe
            if (callback)
                callback();
            return;
        }

        Utils.loadChainOfScripts([
            {
                url: "https://vk.com/js/api/xd_connection.js?2",
                id: "vk_api"
            },
            {
                url: "https://ad.mail.ru/static/admanhtml/rbadman-html5.min.js",
                id: "vk_adman"
            },
            {
                url: "https://vk.com/js/api/adman_init.js",
                id: "vk_adman_init"
            }
        ], ()=>{

            VK.addCallback('onOrderSuccess', (order_id) => {
                console.error("!!onOrderSuccess ", order_id);
                if (this.purchaseCallback)
                    Payments.restorePurchases(this.purchaseCallback);
            });

            callback();
        });
    }

    _playRewardedAd(callbacks) {
        if (this.preloadedAds.length > 0) {
            const adman = this.preloadedAds.pop();
            if (callbacks) {
                if (callbacks.onStarted)
                    adman.onStarted(() => callbacks.onStarted());

                if (callbacks.onCompleted)
                    adman.onCompleted(() => callbacks.onCompleted());

                if (callbacks.onSkipped)
                    adman.onSkipped(() => callbacks.onSkipped());

                if (callbacks.onClicked)
                    adman.onClicked(() => callbacks.onClicked());
            }
            adman.start('preroll');
            this.preloadRewardedAd();
        } else
            this.preloadRewardedAd(callbacks, this._playRewardedAd);
    }

    preloadRewardedAd(callbacks, playMethod) {
        if (typeof admanInit === 'undefined') {
            if (callbacks && callbacks.onAdBlock)
                callbacks.onAdBlock();
            return;
        }

        const onAdsReady = (adman) => {
            this.preloadedAds.push(adman);
            if (playMethod)
                playMethod(callbacks);
        };

        const onNoAds = () => {
            console.error("onNoAds");
            if (callbacks && callbacks.onNoAds)
                callbacks.onNoAds();
        };

        admanInit({
            user_id: null,
            app_id: this._getAdsAppId(),
            type: 'rewarded',         // 'preloader' или 'rewarded' (по умолчанию - 'preloader')
            // params: {preview: 1}   // для проверки корректности работы рекламы
        }, onAdsReady, onNoAds);
    }

    //region payments

    purchaseProduct(productInfo, callback) {
        console.info("!!!productInfo ", productInfo);
        const params = {
            type: 'item',
            item: productInfo.item_id
        };

        VK.callMethod('showOrderBox', params);
    }

    //endregion
}
