const Util = require("./util");

function debounce(context, options) {
    context = context || {};
    options = options || {};
    let timeoutId;
    let cache = {};
    let cbArr = [];
    let lastTrigger = new Date().getTime();
    const wait = +options.wait || 0;
    const dSetData = function(data, cb, setOpts) {
        data = data || {};
        setOpts = setOpts || {};
        const immediate = setOpts.immediate;
        if (immediate) {
            context.setData(data, cb);
        }
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
                context.setData(cache, function() {
                    cbArr.forEach(function(cbItem) {
                        setTimeout(function() {
                            typeof cbItem === "function" && cbItem();
                        }, 0);
                    });
                    cbArr = [];
                });
            }
            cache = {};
        };
        for (const key in data) {
            const value = data[key];
            const contextData = context.data;
            context.data = Util.safeEval(key, value, contextData);
        }
        cache = Object.assign(cache, data);
        if (typeof cb === "function") {
            cbArr.push(cb);
        }
        timeoutId = setTimeout(later, triggerWait);
    };

    dSetData.cancel = function() {
        clearTimeout(timeoutId);
        timeoutId = null;
    };

    return dSetData;
}

module.exports = debounce;
