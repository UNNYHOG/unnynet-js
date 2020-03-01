const UnnyConstants = {
    GENERAL_CONSTANTS: {
        REMOTE_URL: 'https://unnynet.com',
        //REMOTE_URL: 'https://test-nakama-react2.unnynet.com',
        // REMOTE_URL: 'http://localhost:8887',
        VERSION: 3,
        PLUGIN_VERSION: "3.0"
    },

    MAX_DELAYED_CONFIRMATIONS: 10,
    REQUESTS_SAVE_TIME: 60,
    CHECK_PERIOD: 1,
    MAX_QUEUE_LENGTH: 100,

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

export const NutakuPlatform = {
    PCBrowser: 1,
    SPBrowser: 2,
    Android: 3,
    ClientGames: 4
};

export default UnnyConstants;
