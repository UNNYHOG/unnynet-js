import UnnyAdmin from "./UnnyAdmin";
import UnnyNetSystem from "./UnnyNetSystem";

export default class Storage {

    static RGC = null;

    constructor(game_id, readyCallback) {
        Storage.RGC = UnnyAdmin.UnnyRGC.initialize({
            game_id: game_id
        }, ()=>{
            //TODO prepare data and smart objects

            if (readyCallback)
                readyCallback();
        });
    }

    /**
     *
     * @param {string} key
     * @returns {object}
     */
    static getRawDictionary(key)
    {
        return Storage.RGC.getDictionary(key);
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {string} value
     * @param {int} version
     * @param {function} doneCallback
     * send 0, null or undefined version to ignore it
     */
    static save(collection, key, value, version, doneCallback) {
        UnnyNetSystem.getAPI().save(collection, key, value, version, doneCallback);
    }

    /**
     *
     * @param {string} collection
     * @param {string} key
     * @param {function} doneCallback
     */
    static load(collection, key, doneCallback) {
        UnnyNetSystem.getAPI().load(collection, key, doneCallback);
    }
}
