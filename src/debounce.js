const Util = require("./util");

function debounce(context, options) {
    context = context || {};
    options = options || {};
    let timeoutId;
    let cache = {};
    let lastTrigger = new Date().getTime();
    const wait = +options.wait || 0;
    const dSetData = function(data, cb) {
        data = data || {};
        if (timeoutId) {
            clearTimeout(timeoutId);
        }
        const now = new Date().getTime();
        let triggerWait = wait - (now - lastTrigger);
        if (triggerWait < 0 || triggerWait > wait) {
            triggerWait = 0;
        }
        lastTrigger = now;
        const later = function() {
            const keys = Object.keys(cache);
            if (typeof context.setData === "function" && keys.length > 0) {
                context.setData(cache, cb);
            }
            cache = {};
        };
        for (const key in data) {
            const value = data[key];
            const contextData = context.data;
            context.data = Util.safeEval(key, value, contextData);
        }
        cache = Object.assign(cache, data);
        timeoutId = setTimeout(later, triggerWait);
    };

    dSetData.cancel = function() {
        clearTimeout(timeoutId);
        timeoutId = null;
    };

    return dSetData;
}

module.exports = debounce;
