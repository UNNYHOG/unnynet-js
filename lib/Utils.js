export default class Utils {

    static loadScript(url, id, callback) {
        if (document.getElementById(id)) {
            if (callback)
                callback();
            return;
        }

        let js = document.createElement('script');
        js.id = id;
        js.src = url;
        js.onload = callback;
        document.body.appendChild(js);
    }

    static loadChainOfScripts(array, callback) {
        if (array.length === 0) {
            if (callback)
                callback();
            return;
        }

        const element = array.pop();
        Utils.loadScript(element.url, element.id, ()=>{
            Utils.loadChainOfScripts(array, callback);
        });
    }
}
