import {Errors} from "./Commands";
import UnnyNet from "./UnnyNet";
import Events from "./Events";

export default class UnnyRequestResponse {
    /**
     *
     * @param {string} type
     * @param {object} prms
     * @param {function} action
     */
    static create(type, prms, action) {
        switch (type) {
            case "ask_new_guild": {
                UnnyRequestResponse._askNewGuildRequest(prms, action);
                break;
            }
            case "popup_appeared": {
                UnnyRequestResponse._playerPopupAppearedRequest(prms, action);
                break;
            }
        }
    }

    /**
     *
     * @param {string} systemId
     * @param {function} action
     * @param {string} errorMessage
     * @param {int} errorCode
     * @private
     */
    static sendFailed(systemId, action, errorMessage = "", errorCode = Errors.Unknown) {
        action(systemId, "{\"success\": 0, \"error\": {\"code\":" + errorCode + ", \"message\": \"" + errorMessage + "\"}}");
    }

    /**
     *
     * @param {string} systemId
     * @param {function} action
     * @private
     */
    static sendSuccess(systemId, action) {
        action(systemId, "{\"success\": 1}");
    }

    /**
     *
     * @param {string} systemId
     * @param {string} jsonData
     * @param {function} action
     * @private
     */
    static sendSuccessWithData(systemId, jsonData, action) {
        action(systemId, "{\"success\": 1, \"data\":" + jsonData + "}");
    }

    /**
     *
     * @param {object} prms
     * @param {function} action
     * @private
     */
    static _askNewGuildRequest(prms, action) {
        const systemId = prms.sys_id;
        let error = null;

        if (Events.onNewGuildRequest)
            error = Events.onNewGuildRequest(prms);

        if (!error)
            UnnyRequestResponse.sendSuccess(systemId, action);
        else
            UnnyRequestResponse.sendFailed(systemId, action, error);
    }


    /**
     *
     * @param {object} prms
     * @param {function} action
     * @private
     */
    static _playerPopupAppearedRequest(prms, action) {
        const systemId = prms.sys_id;

        if (Events.onPopupOpened != null) {
            const buttons = Events.onPopupOpened(prms);

            if (buttons != null) {
                UnnyRequestResponse.sendSuccessWithData(systemId, buttons.parse(), action);
                return;
            }
        }

        UnnyRequestResponse.sendSuccess(systemId, action);
    }

    /**
     *
     * @param {object} prms
     */
    static buttonClicked(prms) {
        if (PopupButtons.activePopup) {

            const buttonString = prms.button_id;

            if (buttonString) {
                const buttonId = parseInt(buttonString);
                PopupButtons.activePopup.buttonClicked(buttonId);
            }
        }
    }
}
