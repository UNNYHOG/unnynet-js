const UnnyConstants = {
    GENERAL_CONSTANTS: {
        REMOTE_URL: 'https://unnynet.com',
        //REMOTE_URL: 'https://test-nakama-react2.unnynet.com',
        // REMOTE_URL: 'http://localhost:8887',
        VERSION: 3,
        PLUGIN_VERSION: "3.0",
        // API_URL: "https://test-un-api.unnynet.com",
        API_URL: "https://un-api.unnynet.com",
    },

    MAX_DELAYED_CONFIRMATIONS: 10,
    REQUESTS_SAVE_TIME: 60,
    CHECK_PERIOD: 1,
    MAX_QUEUE_LENGTH: 100,

    STORAGE_DELAY: 20000,//20 s

    SEND_REQUEST_RETRY_DELAY: 1,
    ANIMATIONS: {
        OPEN_DURATION: 0.5
    },

    Platform: {
        NUTAKU: 2,
        VKONTAKTE: 3,
        FACEBOOK: 4,
        ODNOKLASSNIKI: 5,
        FB_INSTANT: 6,

        //TODO what are the numbers
        IOS_APPSTORE: 7,
        ANDROID_GOOGLE_PLAY: 8
    },

    PurchaseStatusFilter: {
        ALL: 0,
        PENDING: 1,
        COMPLETED: 2,
        CLAIMED: 3
    },

    Environment: {
        Development: 0,
        Stage: 1,
        Production: 2
    },

    SubPlatform: {
        NutakuPCBrowser:   1,
        NutakuSPBrowser:   2,
        NutakuAndroid:     3,
        NutakuClientGames: 4,
        VK_DEFAULT:        5,
        FB_DEFAULT:        6,
        OK_DEFAULT:        7,
        DEVICE_DEFAULT:    8,
        GP_DEFAULT:        9,
        IOS_DEFAULT:       10
    }
};

export default UnnyConstants;
