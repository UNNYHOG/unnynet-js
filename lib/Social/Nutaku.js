import DefaultSocial from "./DefaultSocial";
import UnnynetCommand, {Errors} from "../Commands";
import UnnySettings from "../UnnySettings";
import UnnyConstants from "../Constants";
import UnnyNetAPI from "../API/UnnyNetAPI";

export default class Nutaku extends DefaultSocial {

    nutaku_user_id = 0;

    constructor(unnyNetBase) {
        super(unnyNetBase);

        if (typeof opensocial != "undefined") {
            let req = opensocial.newDataRequest();
            req.add(req.newFetchPersonRequest(opensocial.IdSpec.PersonId.VIEWER), "viewer");
            req.send((response) => {
                if (response.hadError()) {
                    console.error("[NUTAKU] get user info error", response);
                } else {
                    let item = response.get("viewer");
                    if (item.hadError()) {
                        console.error("[NUTAKU] get item error", item);
                    } else {
                        let viewer = item.getData();
                        this.nutaku_user_id = viewer.getId();
                        // var nickname = viewer.getDisplayName();
                        console.info("USER", viewer);
                    }
                }
            });
        }
    }

    authorize(callback) {
        this.authWithNutakuGadget(callback);
    }

    getDeviceIdForNakama() {
        return null;
    }

    //region auth

    /**
     * This method is used for authorization inside of iFrame
     * @param {function} callback
     */
    authWithNutakuGadget(callback) {
        if (typeof gadgets !== 'undefined') {
            UnnySettings.clearTokens();
            let params = {
                [gadgets.io.RequestParameters.METHOD]: gadgets.io.MethodType.POST,
                [gadgets.io.RequestParameters.CONTENT_TYPE]: gadgets.io.ContentType.JSON,
                [gadgets.io.RequestParameters.POST_DATA]: gadgets.io.encodeValues({
                    game_id: this.config.game_id,
                    public_key: this.config.public_key,
                    env: this.config.environment
                }),
                [gadgets.io.RequestParameters.AUTHORIZATION]: gadgets.io.AuthorizationType.SIGNED
            };
            console.error("SENDING...", params);
            const url = UnnyConstants.GENERAL_CONSTANTS.API_URL + "/v1/auth/nutaku_pc";
            console.warn("URL = " + url);
            gadgets.io.makeRequest(url, (obj) => {
                console.info("NUTAKU REPLY", obj);
                if (obj.errors && obj.errors.length)
                    console.error('AUTH ERROR', obj.errors);
                UnnynetCommand.onAuthCallback(null, obj.data, callback);
            }, params);
        } else
            callback(UnnynetCommand.getErrorResponse(Errors.Unknown, "no Gadgets found to authorize"));
    }

    /**
     *
     * @param {string} userId
     * @param {number} platform
     * @param {string} oauthToken
     * @param {string} oauthTokenSecret
     * @param {string} autologinToken
     * @param {function} callback
     * We don't need this method for now
     */
    authWithNutaku(userId, platform, oauthToken, oauthTokenSecret, autologinToken, callback) {
        UnnySettings.clearTokens();
        return UnnyNetAPI.createAuthRequest('/v1/auth/nutaku', {
            user_id: userId,
            platform: platform.toString(),
            oauth_token: oauthToken,
            oauth_token_secret: oauthTokenSecret,
            autologin_token: autologinToken,
            game_id: this.config.game_id,
            public_key: this.config.public_key
        }, callback);
    }

    //end region

    //region payments

    purchaseProduct(productInfo, callback) {//TODO get real info by id
        var itemParams1 = {};
        itemParams1[opensocial.BillingItem.Field.SKU_ID] = productInfo.platform_product_id;
        itemParams1[opensocial.BillingItem.Field.PRICE] = Math.round(productInfo.price);
        itemParams1[opensocial.BillingItem.Field.COUNT] = 1;
        itemParams1[opensocial.BillingItem.Field.DESCRIPTION] = "item 001";
        itemParams1[nutaku.BillingItem.Field.NAME] = "Much Doge1";
        itemParams1[nutaku.BillingItem.Field.IMAGE_URL] = productInfo.icon;
        //jpg or gif. There are no specific size requirements for the image as long as the image looks good and it is not so big that it makes the containing pop-up be bigger than your game area.
        var item1 = opensocial.newBillingItem(itemParams1);

        var params = {};
        params[opensocial.Payment.Field.ITEMS] = [item1];
        // params[opensocial.Payment.Field.MESSAGE] = "Optional message to show alongside the items";
        params[opensocial.Payment.Field.PAYMENT_TYPE] = opensocial.Payment.PaymentType.PAYMENT;
        var payment = opensocial.newPayment(params);

        console.info("MAKE_PURCHASE", payment);
        opensocial.requestPayment(payment, (response) => {
            if (response.hadError()) {
                // error
                console.error("ERROR", response);
                UnnynetCommand.onCallback(response, null, callback);
            } else {
                var payment = response.getData();
                var paymentId = payment.getField(nutaku.Payment.Field.PAYMENT_ID);
                console.info("INFO> " + paymentId, payment);
                // ...
                UnnynetCommand.onCallback(null, response, callback);
            }
        });
    }

    /**
     *
     * @param {number} orderId
     * @param {function} callback
     */
    completePurchase(orderId, callback) {//TODO shall I call callback?
        return UnnyNetAPI.createDefaultRequest("/v1/payments/nutaku/complete", {
            un_order_id: orderId,
            user_id: this.nutaku_user_id
        });
    }

    /**
     *
     * @param {number} orderId
     * @param {function} callback
     */
    claimPurchase(orderId, callback) {
        return UnnyNetAPI.createDefaultRequest("/v1/payments/all/claim", {
            un_order_id: orderId
        });
    }

    //endregion
}
