import DefaultSocial from "./DefaultSocial";
import Auth from "../Auth";
import Utils from "../Utils";
import Payments from "../Payments";

export default class Odnoklassniki extends DefaultSocial {

    callbackOnNoAds = null;
    callbackAdIsReady = null;
    callbackAdStarted = null;
    callbackAdCompleted = null;

    authorize(callback) {
        this._initializeOk(() => {
            // okId, okSecret, okSessionKey
            // authData.logged_user_id, authData.auth_sig, authData.session_key
            this.API.authWithOK(this.authData.session_key, this.authData.session_secret_key, callback);//TODO get other params
            this._autoAuthInNakama();
        });
    }

    _autoAuthInNakama() {
        Auth.authorizeAsGuest("");//TODO take name from OK
    }

    getDeviceIdForNakama() {
        return "odnoklassniki_" + this.allGetParams.logged_user_id;
    }

    _initializeOk(callback) {
        if (window === top) {//not an iframe
            if (callback)
                callback();
            return;
        }

        Utils.loadChainOfScripts([
            {
                url: "//api.ok.ru/js/fapi5.js",
                id: "ok_fapi"
            }
        ], ()=>{
            this._initFAPI();
            if (callback)
                callback();
        });
    }


    _initFAPI () {
        if (typeof FAPI !== 'undefined') {
            const rParams = FAPI.Util.getRequestParameters();
            console.info("rParams", rParams);
            this.authData = rParams;
            FAPI.init(this.authData["api_server"], this.authData["apiconnection"],
                /*
                * Первый параметр:
                * функция, которая будет вызвана после успешной инициализации.
                */
                () => {
                    window.API_callback = (method, result, data) => {
                        console.info("FAPI method " + method + "; result = " + result + "; data = ", data);
                        switch (method) {
                            case "postMediatopic":
                                // if (result === "ok") {
                                //     if (callbackPostMessage) {
                                //         callbackPostMessage();
                                //         callbackPostMessage = null;
                                //     }
                                // }
                                break;
                            case "showInvite":
                                if (result === "ok" && data) {
                                    // const ids = data.split(",");
                                    // if (ids && ids.length > 0)
                                    //     gameInit.likedSuccessfull(ids);
                                }
                                break;
                            case "showPayment":
                                if (result === "ok")
                                    Payments.restorePurchases(this.purchaseProductCallback);
                                break;
                            case "prepareMidroll":
                                switch (data) {
                                    case "ready":
                                        if (this.callbackAdIsReady)
                                            this.callbackAdIsReady();
                                        break;
                                    case "in_use":
                                        if (this.callbackAdStarted)
                                            this.callbackAdStarted();
                                        break;
                                    default:
                                        if (this.callbackOnNoAds)
                                            this.callbackOnNoAds();
                                        break;
                                }
                                break;
                            case "showMidroll":
                                if (result === "ok") {
                                    switch (data) {
                                        case "complete":
                                            if (this.callbackAdCompleted)
                                                this.callbackAdCompleted();
                                            break;
                                    }
                                } else {
                                    if (this.callbackOnNoAds)
                                        this.callbackOnNoAds();
                                }
                                break;
                        }
                    }
                },
                /*
                * Второй параметр:
                * функция, которая будет вызвана, если инициализация не удалась.
                */
                function (error) {
                    alert("Ошибка инициализации");
                }
            );
        }
    }

    preloadRewardedAd(callbacks, playMethod) {
        this.callbackAdIsReady = () => {
            this.preloadedAds.push(1);
            if (playMethod)
                playMethod(callbacks);
            this.callbackAdIsReady = null;
        };

        this.callbackOnNoAds = () => {
            console.warn("onNoAds");
            if (callbacks && callbacks.onNoAds)
                callbacks.onNoAds();
            this.callbackOnNoAds = null;
        };

        FAPI.invokeUIMethod("prepareMidroll");
    }

    _playRewardedAd(callbacks) {
        if (callbacks) {
            if (callbacks.onStarted)
                this.callbackAdStarted = () => {
                    callbacks.onStarted();
                    this.callbackAdStarted = null;
                };

            if (callbacks.onCompleted)
                this.callbackAdCompleted = () => {
                    callbacks.onCompleted();
                    this.callbackAdCompleted = null;
                };
        }

        if (this.preloadedAds.length > 0) {
            this.preloadedAds.pop();

            FAPI.invokeUIMethod("showMidroll");
            this.preloadRewardedAd();
        } else
            this.preloadRewardedAd(callbacks, this._playRewardedAd);
    }

    //region payments

    purchaseProduct(productInfo, callback) {
        console.info("!!!productInfo ", productInfo);
        this.purchaseProductCallback = callback;
        FAPI.UI.showPayment(productInfo.name, productInfo.description, productInfo.platform_product_id, productInfo.price, null, null, "ok", "true");
    }

    //endregion
}
