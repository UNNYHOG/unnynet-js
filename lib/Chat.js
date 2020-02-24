import UnnyBaseObject from "./UnnyBaseObject";
import UnnynetCommand from "./Commands";

export default class Chat {
    /**
     *
     * @param {string} channelId
     * @param {string} message
     * @param {function} doneCallback
     */
    static sendMessageToChannel(channelId, message, doneCallback) {
        if (message)
            UnnyBaseObject.evalCode(UnnynetCommand.Command.SendMessage, doneCallback, channelId, message);
    }

    /**
     *
     * @param {string} channelId
     * @param {string} channelDisplayName
     * @param {function} doneCallback
     */
    static joinPrivateChannel(channelId, channelDisplayName, doneCallback)
    {
        UnnyBaseObject.evalCodeDelayed(UnnynetCommand.Command.JoinPrivateChannel, doneCallback, channelId, channelDisplayName);
    }

    /**
     *
     * @param {function} doneCallback
     */
    static leaveAllPrivateChannels(doneCallback)
    {
        UnnyBaseObject.evalCodeDelayed(UnnynetCommand.Command.LeaveAllPrivateChannels, doneCallback);
    }
}
