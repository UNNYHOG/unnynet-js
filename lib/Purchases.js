import UnnyNetSystem from "./UnnyNetSystem";

export default class Purchases {

    /**
     *
     * @param {string} id
     * @param {function} doneCallback
     */
    static purchaseProduct(id, doneCallback) {
        UnnyNetSystem.getAPI().purchaseProduct(id, doneCallback);
    }

    restorePurchases() {

    }

    //region temporary
    /**
     *
     * @param {string} userId
     * @param {NutakuPlatform} nutakuPlatform
     * @param {string} orderId
     * @param {function} doneCallback
     */
    static completeNutakuPurchase(userId, nutakuPlatform, orderId, doneCallback) {
        UnnyNetSystem.getAPI().completeNutakuPurchase(userId, nutakuPlatform, orderId, doneCallback);
    }

    /**
     *
     * @param {string} userId
     * @param {NutakuPlatform} nutakuPlatform
     * @param {int} orderId
     * @param {function} doneCallback
     */
    static completeNutakuPurchase2(userId, nutakuPlatform, orderId, doneCallback) {
        UnnyNetSystem.getAPI().completeNutakuPurchase2(userId, nutakuPlatform, orderId, doneCallback);
    }

    /**
     *
     * @param {Constants.PurchaseStatusFilter} status
     * @param {function} doneCallback
     */
    static getPurchases(status, doneCallback) {
        UnnyNetSystem.getAPI().getPurchases(status, doneCallback);
    }

    /**
     *
     * @param {string} userId
     * @param {Constants.Platform} platform
     * @param {string} orderId
     * @param {function} doneCallback
     */
    static claimPurchase(userId, platform, orderId, doneCallback) {
        UnnyNetSystem.getAPI().claimPurchase(userId, platform, orderId, doneCallback);
    }

    /**
     *
     * @param {string} userId
     * @param {Constants.Platform} platform
     * @param {int} orderId
     * @param {function} doneCallback
     */
    static claimPurchase2(userId, platform, orderId, doneCallback) {
        UnnyNetSystem.getAPI().claimPurchase2(userId, platform, orderId, doneCallback);
    }

    //endregion
}
