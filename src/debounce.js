const Util = require("./util");

function debounce(context, options) {
    context = context || {};
    options = options || {};
    let timeoutId;
    let cache = {};
    let cbArr = [];
    let lastTrigger = new Date().getTime();
    let isShowLog = options.isShowLog;
    let wait = +options.wait || 0;
    if (isNaN(wait) || wait < 0) {
        wait = 0;
    }
    const later = function() {
        const keys = Object.keys(cache);
        if (typeof context.setData === "function" && keys.length > 0) {
            context.setData(cache, function() {
                if (isShowLog && console && typeof console.log === "function") {
                    const time = new Date().getTime();
                    console.log(`${time}：setData over`);
                }
                cbArr.forEach(function(cbItem) {
                    setTimeout(function() {
                        typeof cbItem === "function" && cbItem();
                    }, 0);
                });
                cbArr = [];
            });
        }
        cache = {};
        clearTimeout(timeoutId);
        timeoutId = null;
    };
    const _setData = function(data, cb, setOpts) {
        data = data || {};
        setOpts = setOpts || {};
        const immediate = setOpts.immediate;
        const now = new Date().getTime();
        if (immediate) {
            context.setData(data, cb);
            return;
        }

        if (timeoutId) {
            clearTimeout(timeoutId);
        } else {
            lastTrigger = now;
        }

        const diffTime = now - lastTrigger;
        let triggerWait = 0;
        if (diffTime < 0 || diffTime > wait) {
            triggerWait = 0;
        } else {
            triggerWait = wait - diffTime;
        }

        lastTrigger = now;
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

    _setData.cancel = function() {
        clearTimeout(timeoutId);
        timeoutId = null;
        cache = {};
        cbArr = [];
    };

    _setData.immediate = function() {
        later();
    };

    return _setData;
}

module.exports = debounce;
