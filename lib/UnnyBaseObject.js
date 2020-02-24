import UnnynetCommand from "./Commands";
import CommandInfo, {UnnyCommandInfoDelayed} from "./CommandInfo";
import UnnyNetSystem from "./UnnyNetSystem";

export default class UnnyBaseObject {

    static openWindow(command, doneCallback)
    {
        UnnyNetSystem.evaluateCommand(command, true, doneCallback);
    }

    /**
     *
     * @param {UnnynetCommand.Command} command
     * @param {function} doneCallback
     * @param {boolean} openWindow
     * @param {boolean} highPriority
     * @param {array} args
     * @private
     */
    static _evalCodeFull(command, doneCallback, openWindow, highPriority, args)
    {
        const stringCommand = UnnynetCommand.GetCommand(command);
        const code = String.prototype.format.apply(stringCommand, args);
        const commandInfo = new CommandInfo(command, code, openWindow, doneCallback);

        UnnyNetSystem.evaluateCodeInJavaScript(commandInfo, highPriority);
    }

    /**
     *
     * @param {UnnynetCommand.Command} command
     * @param {function} doneCallback
     */
    static evalCode(command, doneCallback)
    {
        const args = Array.prototype.slice.call(arguments, 2);
        UnnyBaseObject._evalCodeFull(command, doneCallback, false, false, args);
    }

    /**
     *
     * @param {UnnynetCommand.Command} command
     * @param {function} doneCallback
     */
    static evalCodeAndOpen(command, doneCallback)
    {
        const args = Array.prototype.slice.call(arguments, 2);
        UnnyBaseObject._evalCodeFull(command, doneCallback, true, false, args);
    }

    /**
     *
     * @param {UnnynetCommand.Command} command
     * @param {function} doneCallback
     */
    static evalCodeDelayed(command, doneCallback)
    {
        const args = Array.prototype.slice.call(arguments, 2);
        const stringCommand = UnnynetCommand.GetCommand(command);
        const code = String.prototype.format.apply(stringCommand, args);

        const commandInfo = new UnnyCommandInfoDelayed(command, code, doneCallback);
        UnnyNetSystem.evaluateCodeInJavaScript(commandInfo);
    }

    /**
     *
     * @param {UnnynetCommand.Command} command
     * @param {function} doneCallback
     */
    static evalCodeHighPriority(command, doneCallback)
    {
        const args = Array.prototype.slice.call(arguments, 2);
        UnnyBaseObject._evalCodeFull(command, doneCallback, false, true, args);
    }




    /**
     *
     * @param {UnnynetCommand.Command} command
     * @param {function} doneCallback
     */
    static evalCodeAdvanced(command, doneCallback)
    {
        UnnyBaseObject.evalCodeDelayed.apply(this, arguments);
    }
}
