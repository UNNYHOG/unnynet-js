import UnnyAdmin from "./UnnyAdmin";
import UnnyNetSystem from "./UnnyNetSystem";
import UnnyConstants from "./Constants";
import UnnynetCommand, {Errors} from "./Commands";

export default class Storage {

    static RGC = null;
    static _cachedData = {};

    constructor(game_id, readyCallback) {
        Storage.RGC = UnnyAdmin.UnnyRGC.initialize({
            game_id: game_id
        }, () => {
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
    static getRawDictionary(key) {
        return Storage.RGC.getDictionary(key);
    }

    /**
     *
     * @param {string} data.collection
     * @param {string} data.key
     * @param {string} data.value
     * @param {int} data.version
     * @param {function} doneCallback
     * send 0, null or undefined version to ignore it
     */
    static save(data, doneCallback) {
        if (!Storage._canSaveDataAndUpdateSaveTime(data)) {
            if (doneCallback)
                doneCallback(Storage._getStorageError());
            return;
        }

        const version = Storage._getLastVersion(data);

        UnnyNetSystem.getAPI().save(data.collection, data.key, data.value, version, (responseData) => {
            if (responseData.success)
                Storage._updateVersion(data, responseData.data.version);
            if (doneCallback)
                doneCallback(responseData);
        });
    }

    /**
     *
     * @param {string} data.collection
     * @param {string} data.key
     * @param {function} doneCallback
     */
    static load(data, doneCallback) {
        if (!Storage._canLoadDataAndUpdateLoadTime(data)) {
            if (doneCallback)
                doneCallback(Storage._getStorageError());
            return;
        }

        UnnyNetSystem.getAPI().load(data.collection, data.key, (responseData) => {
            if (responseData.success && responseData.data.length)
                Storage._updateVersion(data, responseData.data[0].version);
            if (doneCallback)
                doneCallback(responseData);
        });
    }

    static _updateVersion(data, version) {
        const key = Storage._getOrCreateDataObjectFromCache(data);
        key.version = version;
    }

    static _canSaveDataAndUpdateSaveTime(data) {
        const key = Storage._getOrCreateDataObjectFromCache(data);

        const nowTime = Date.now();
        if (!key.last_save || nowTime - key.last_save >= UnnyConstants.STORAGE_DELAY) {
            key.last_save = nowTime;
            return true;
        }
        return false;
    }

    static _canLoadDataAndUpdateLoadTime(data) {
        const key = Storage._getOrCreateDataObjectFromCache(data);

        const nowTime = Date.now();
        if (!key.last_load || nowTime - key.last_load >= UnnyConstants.STORAGE_DELAY) {
            key.last_load = nowTime;
            return true;
        }
        return false;
    }

    static _getOrCreateDataObjectFromCache(data) {
        const cache = Storage._cachedData;
        const collection = cache.hasOwnProperty(data.collection) ? cache[data.collection] : cache[data.collection] = {};
        return collection.hasOwnProperty(data.key) ? collection[data.key] : collection[data.key] = {};
    }

    static _getLastVersion(data) {
        if (data.version !== 0) {
            if (Storage._cachedData.hasOwnProperty(data.collection)) {
                const collection = Storage._cachedData[data.collection];
                if (collection.hasOwnProperty(data.key))
                    return collection[data.key].version;
            }
        }

        return -1;
    }

    static _getStorageError() {
        return UnnynetCommand.getErrorResponse(Errors.StorageRequestsMadeTooOften, "You were trying to save/load from the same collection/key too often. Please do that maximum once per 20 seconds.");
    }
}
