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
        VKONTAKTE: 3,
        FACEBOOK: 4,
        ODNOKLASSNIKI: 5,
        FB_INSTANT: 6,
        IOS_APPSTORE: 7,
        ANDROID_GOOGLE_PLAY: 8,
        NUTAKU_PC_BROWSER: 9,
        NUTAKU_SP_BROWSER: 10,
        NUTAKU_ANDROID: 11,
        NUTAKU_CLIENT_GAMES: 12
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
    }
};

export default UnnyConstants;
