const indexStrItemReg = /\[\d+\]/g;
const indexNumberReg = /^\[(\d)+\]$/;

const Util = {
    safeEval(key, value, obj) {
        obj = obj || {};
        const keys = key.split(".");
        const len = keys.length;
        let lastObj = obj;
        keys.forEach(function(keyItem, index) {
            const indexStrItems = keyItem.match(indexStrItemReg);
            if (indexStrItems && indexStrItems.length > 0) {
                const firstIndexStr = indexStrItems[0];
                const arrKeyIndex = keyItem.indexOf(firstIndexStr);
                const arrKey = keyItem.slice(0, arrKeyIndex);
                if (!Array.isArray(lastObj[arrKey])) {
                    lastObj[arrKey] = [];
                }
                lastObj = lastObj[arrKey];
                indexStrItems.forEach(function(indexStr, indexStrIndex) {
                    const indexNumInfo = indexStr.match(indexNumberReg);
                    const indexNum = indexNumInfo[1];
                    if (indexStrIndex >= indexStrItems.length - 1) {
                        if (index >= len - 1) {
                            lastObj[indexNum] = value;
                        } else {
                            if (typeof lastObj[indexNum] !== "object") {
                                lastObj[indexNum] = {};
                            }
                            lastObj = lastObj[indexNum];
                        }
                        return;
                    }
                    if (!Array.isArray(lastObj[indexNum])) {
                        lastObj[indexNum] = [];
                    }
                    lastObj = lastObj[indexNum];
                });
                return;
            }
            if (index >= len - 1) {
                lastObj[keyItem] = value;
                return;
            }
            if (typeof lastObj[keyItem] !== "object") {
                lastObj[keyItem] = {};
            }
            lastObj = obj[keyItem];
        });
        return obj;
    }
};

module.exports = Util;
