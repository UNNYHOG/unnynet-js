import Auth from '../lib/Auth';
import Social from '../lib/Social';
import Events from '../lib/Events';
import Chat from '../lib/Chat';
import Storage from '../lib/Storage';
import Purchases from '../lib/Purchases';
import MainController from '../lib/MainController';
import PopupButtons, {ButtonType} from '../lib/PopupButtons';
import {ViewOpenDirection} from '../lib/WebView';
import {Errors} from '../lib/Commands';
import {NutakuPlatform} from '../lib/Constants';
import UnnyConstants from '../lib/Constants';

export default {
    Auth,
    Chat,
    Events,
    Social,
    Storage,
    Purchases,
    MainController,
    PopupButtons,
    ButtonType,
    ViewOpenDirection,
    Errors,
    NutakuPlatform,
    Platform: UnnyConstants.Platform,
    Environment: UnnyConstants.Environment,
    PurchaseStatusFilter: UnnyConstants.PurchaseStatusFilter
};
