import UnnyNetSystem from "./UnnyNetSystem";
import UnnyConstants from "./Constants";
import UnnyNetAPIRequest from "./API/UnnyNetAPIRequest";
import UnnynetCommand from "./Commands";
import UnnySettings from "./UnnySettings";
import UnnyNetAPI from "./API/UnnyNetAPI";

export default class Payments {

    /**
     *
     * @param {string} id
     * @param {function} doneCallback
     */
    static purchaseProduct(id, doneCallback) {
        if (!doneCallback) {
            console.error("[Payments] You need to provide doneCallback for purchaseProduct");
            return;
        }

        const platform = UnnyNetSystem.getSocialPlatform();
        platform.purchaseProduct(id, (purchaseResponse) => {
            if (purchaseResponse.success) {
                console.info("purchased", purchaseResponse);
                //TODO test and finish this
                let un_order_id = purchaseResponse.data.id;
                platform.completePurchase(un_order_id, (completeResponse) => {
                    if (completeResponse.success) {
                        platform.claimPurchase(un_order_id, doneCallback);
                    } else
                        doneCallback(completeResponse);
                });
            } else
                doneCallback(purchaseResponse);
        });
    }

    /**
     *
     * @param {function} doneCallback
     * Checks for uncompleted purchases and finishes them
     * doneCallback can be called multiple times, once for each purchase
     */
    static restorePurchases(doneCallback) {
        if (!doneCallback) {
            console.error("[Payments] You need to provide doneCallback for restorePurchases");
            return;
        }

        Payments.getPurchases(UnnyConstants.PurchaseStatusFilter.COMPLETED, (completedResponse) => {
            if (completedResponse.success) {
                const completedPurchases = completedResponse.data;
                for (let completedItem of completedPurchases) {
                    const un_order_id = completedItem.id;
                    if (un_order_id)
                        Payments.claimPurchase(un_order_id, (claimResponse) => {
                            doneCallback(claimResponse);
                        });
                    else
                        console.error("[ERROR] restorePurchases - no order id", completedItem);
                }
            } else
                doneCallback(completedResponse);
        });

        Payments.getPurchases(UnnyConstants.PurchaseStatusFilter.PENDING, (pendingResponse) => {
            if (pendingResponse.success) {
                const pendingPurchases = pendingResponse.data;
                for (let pendingItem of pendingPurchases) {
                    const un_order_id = pendingItem.id;
                    if (un_order_id) {
                        Payments.completePurchase(un_order_id, (completeResponse) => {
                            if (completeResponse.success) {
                                Payments.claimPurchase(completeResponse.data.id, (claimResponse) => {
                                    doneCallback(claimResponse);
                                });
                            } else
                                doneCallback(completeResponse);
                        });
                    } else
                        console.error("[ERROR] restorePurchases - no order id", pendingItem);
                }
            } else
                doneCallback(pendingResponse);
        });
    }

    /**
     *
     * @param {number} orderId
     * @param {function} doneCallback
     */
    static completePurchase(orderId, doneCallback) {
        UnnyNetSystem.getSocialPlatform().completePurchase(orderId, doneCallback);
    }

    /**
     *
     * @param {UnnyConstants.PurchaseStatusFilter} status
     * @param {function} doneCallback
     */
    static getPurchases(status, doneCallback) {
        return UnnyNetAPI.createDefaultRequest("/v1/payments/purchases?status=" + status, null, doneCallback);
    }

    /**
     *
     * @param {int} orderId
     * @param {function} doneCallback
     */
    static claimPurchase(orderId, doneCallback) {
        UnnyNetSystem.getSocialPlatform().claimPurchase(orderId, doneCallback);
    }
}
