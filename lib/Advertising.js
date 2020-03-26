import UnnyNetSystem from "./UnnyNetSystem";

export default class Advertising {

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
    static playRewardedAd(callbacks) {
        const platform = UnnyNetSystem.getSocialPlatform();
        console.log("platform= " + platform);
        platform.playRewardedAd(callbacks);
    }
}
