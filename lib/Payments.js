import UnnyNetSystem from "./UnnyNetSystem";
import UnnyConstants from "./Constants";
import UnnyNetAPI from "./API/UnnyNetAPI";
import UnnynetCommand, {Errors} from "./Commands";

const PAYMENTS_CACHE_DURATION = 60000;

export default class Payments {

    static cachedProducts = {};

    /**
     *
     * @param {string} base_id
     * @param {function} doneCallback
     */
    static purchaseProduct(base_id, doneCallback) {
        if (!doneCallback) {
            console.error("[Payments] You need to provide doneCallback for purchaseProduct");
            return;
        }

        Payments.getProducts(productsResponse => {
            if (productsResponse.success) {
                const productInfo = Payments._getProductById(base_id);
                if (!productInfo) {
                    doneCallback(UnnynetCommand.getErrorResponse(Errors.NoSuchProduct, "No such product with Id: " + base_id));
                } else {
                    const platform = UnnyNetSystem.getSocialPlatform();

                    platform.purchaseProduct(productInfo, (purchaseResponse) => {
                        if (purchaseResponse.success) {
                            let un_order_id = purchaseResponse.data.id;
                            platform.completePurchase(un_order_id, (completeResponse) => {
                                if (completeResponse.success) {
                                    platform.claimPurchase(completeResponse.data.id, doneCallback);
                                } else
                                    doneCallback(completeResponse);
                            });
                        } else
                            doneCallback(purchaseResponse);
                    });
                }
            } else
                doneCallback(productsResponse);
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
                        Payments.claimPurchase(un_order_id, doneCallback);
                    else
                        console.error("[ERROR] restorePurchases - no order id", completedItem);
                }

                Payments.getPurchases(UnnyConstants.PurchaseStatusFilter.PENDING, (pendingResponse) => {
                    if (pendingResponse.success) {
                        const pendingPurchases = pendingResponse.data;
                        for (let pendingItem of pendingPurchases) {
                            const un_order_id = pendingItem.id;
                            if (un_order_id) {
                                Payments.completePurchase(un_order_id, (completeResponse) => {
                                    if (completeResponse.success) {
                                        Payments.claimPurchase(completeResponse.data.id, doneCallback);
                                    } else
                                        doneCallback(completeResponse);
                                });
                            } else
                                console.error("[ERROR] restorePurchases - no order id", pendingItem);
                        }
                    } else
                        doneCallback(pendingResponse);
                });

            } else
                doneCallback(completedResponse);
        });
    }

    static _getProductById(base_id) {
        return Payments.cachedProducts.formattedProducts[base_id];
    }

    static _createFormattedProducts(products) {
        const formattedProducts = {};
        for (let product of products)
            formattedProducts[product.base_id] = product;
        return formattedProducts;
    }

    /**
     *
     * @param {function} doneCallback
     */
    static getProducts(doneCallback) {
        if (Date.now() - Payments.cachedProducts.time <= PAYMENTS_CACHE_DURATION)
            doneCallback(Payments.cachedProducts.originalResponse);
        else {
            return UnnyNetAPI.createDefaultGetRequest("/v1/payments/products", responseData => {
                if (responseData.success) {
                    Payments.cachedProducts = {
                        time: Date.now(),
                        originalResponse: responseData,
                        formattedProducts: Payments._createFormattedProducts(responseData.data)
                    }
                }
                doneCallback(responseData);
            });
        }
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
        return UnnyNetAPI.createDefaultGetRequest("/v1/payments/purchases?status=" + status, doneCallback);
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
