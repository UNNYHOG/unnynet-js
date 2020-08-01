import UnnyConstants from "./Constants";
import UnnyNetAPI from "./API/UnnyNetAPI";
import SocialManager from "./Social/SocialManager";
import Storage from "./Storage";
import UnnySettings from "./UnnySettings";

if (!String.prototype.format) {
    String.prototype.format = function () {
        let args = arguments;
        return this.replace(/{(\d+)}/g, function (match, number) {
            return typeof args[number] != 'undefined'
                ? args[number]
                : match
                ;
        });
    };
}

const DefaultEnvironment = UnnyConstants.Environment.Development;

function parseGetParams() {
    const prms = {};
    let queryString = window.location.search;
    if (queryString && queryString.length > 0) {
        queryString = queryString.substring(1);
        const queries = queryString.split("&");

        for (let i = 0; i < queries.length; i++) {
            const kvp = queries[i].split('=');
            if (kvp[0].startsWith("amp;"))//vk hack
                prms[kvp[0].substring(4)] = kvp[1];
            else
                prms[kvp[0]] = kvp[1];
        }
    }
    return prms;
}

export default class UnnyNetSystem {

    static instance = null;
    storage = null;

    static initialize(config) {
        new UnnyNetSystem(config);
    }

    constructor(config) {
        UnnyNetSystem.instance = this;
        this.config = this._prepareConfig(config);
        this.allGetParams = parseGetParams();
        this.queue = [];
        this.environment = this.config.hasOwnProperty('environment') ? this.config.environment : DefaultEnvironment;
        UnnySettings.setEnvironment(this.environment);

        this._initServices();
        this._setDebug(this.config.debug);
        UnnyNetSystem.log("INIT", this.config);

        this.storage = new Storage(this.config.game_id,  () => {
            UnnyNetSystem.log("Storage was initialized");
            this.socialPlatform.authorize(this.config.callback);
        });
    }

    _prepareConfig(config) {
        if (!config.game_id)
            console.error("You need to provide game_id");

        return config;
    }

    _initServices() {
        this.API = new UnnyNetAPI(this.config);
        this.socialPlatform = SocialManager.createSocialPlatform(this, this.config.platform);
    }

    static getAPI() {
        return UnnyNetSystem.instance.API;
    }

    static getSocialPlatform() {
        return UnnyNetSystem.instance.socialPlatform;
    }

    _setDebug(debug) {
        this.debug = debug;
    }

    static log(name, ...theArgs) {
        if (UnnyNetSystem.instance.debug)
            console.info("[UNNYNET_JS] " + name, ...theArgs);
    }
}
