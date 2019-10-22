const arrItemReg = /^(\S+)\[(\d)+\]$/;

const Util = {
    safeEval(key, value, obj) {
        obj = obj || {};
        const keys = key.split(".");
        const len = keys.length;
        let lastObj = obj;
        keys.forEach(function(keyItem, index) {
            const keyMatch = keyItem.match(arrItemReg);
            if (keyMatch) {
                const arrName = keyMatch[1];
                const arrIndex = keyMatch[2];
                if (!Array.isArray(lastObj[arrName])) {
                    lastObj[arrName] = [];
                }
                if (index === len - 1) {
                    lastObj[arrName][arrIndex] = value;
                    return;
                }
                if (typeof lastObj[arrName][arrIndex] !== "object") {
                    lastObj[arrName][arrIndex] = {};
                }
                lastObj = lastObj[arrName][arrIndex];
                return;
            }
            if (index === len - 1) {
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
