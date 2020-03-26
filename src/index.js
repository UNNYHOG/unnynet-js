import Auth from '../lib/Auth';
import Social from '../lib/Social';
import Events from '../lib/Events';
import Chat from '../lib/Chat';
import Storage from '../lib/Storage';
import Payments from '../lib/Payments';
import MainController from '../lib/MainController';
import PopupButtons, {ButtonType} from '../lib/PopupButtons';
import {ViewOpenDirection} from '../lib/WebView';
import {Errors} from '../lib/Commands';
import UnnyConstants from '../lib/Constants';
import Advertising from '../lib/Advertising';

export default {
    Auth,
    Chat,
    Events,
    Social,
    Storage,
    Payments,
    MainController,
    PopupButtons,
    ButtonType,
    ViewOpenDirection,
    Errors,
    Advertising,
    SubPlatform: UnnyConstants.SubPlatform,
    Platform: UnnyConstants.Platform,
    Environment: UnnyConstants.Environment,
    PurchaseStatusFilter: UnnyConstants.PurchaseStatusFilter
};
