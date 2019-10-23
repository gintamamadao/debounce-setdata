'use strict';

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

var indexStrItemReg = /\[\d+\]/g;
var indexNumberReg = /^\[(\d)+\]$/;
var Util = {
  safeEval: function safeEval(key, value, obj) {
    obj = obj || {};
    var keys = key.split(".");
    var len = keys.length;
    var lastObj = obj;
    keys.forEach(function (keyItem, index) {
      var indexStrItems = keyItem.match(indexStrItemReg);

      if (indexStrItems && indexStrItems.length > 0) {
        var firstIndexStr = indexStrItems[0];
        var arrKeyIndex = keyItem.indexOf(firstIndexStr);
        var arrKey = keyItem.slice(0, arrKeyIndex);

        if (!Array.isArray(lastObj[arrKey])) {
          lastObj[arrKey] = [];
        }

        lastObj = lastObj[arrKey];
        indexStrItems.forEach(function (indexStr, indexStrIndex) {
          var indexNumInfo = indexStr.match(indexNumberReg);
          var indexNum = indexNumInfo[1];

          if (indexStrIndex >= indexStrItems.length - 1) {
            if (index >= len - 1) {
              lastObj[indexNum] = value;
            } else {
              if (_typeof(lastObj[indexNum]) !== "object") {
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

      if (_typeof(lastObj[keyItem]) !== "object") {
        lastObj[keyItem] = {};
      }

      lastObj = obj[keyItem];
    });
    return obj;
  }
};
var util = Util;

function debounce(context, options) {
  context = context || {};
  options = options || {};
  var timeoutId;
  var cache = {};
  var cbArr = [];
  var lastTrigger = new Date().getTime();
  var showEndTime = options.showEndTime;
  var wait = +options.wait || 0;

  if (isNaN(wait) || wait < 0) {
    wait = 0;
  }

  var later = function later() {
    var keys = Object.keys(cache);

    if (typeof context.setData === "function" && keys.length > 0) {
      context.setData(cache, function () {
        if (showEndTime && console && typeof console.log === "function") {
          var time = new Date().getTime();
          console.log("SetData End Time\uFF1A".concat(time));
        }

        cbArr.forEach(function (cbItem) {
          setTimeout(function () {
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

  var _setData = function _setData(data, cb, setOpts) {
    data = data || {};
    setOpts = setOpts || {};
    var immediate = setOpts.immediate;
    var now = new Date().getTime();

    if (immediate) {
      context.setData(data, cb);
      return;
    }

    if (timeoutId) {
      clearTimeout(timeoutId);
    } else {
      lastTrigger = now;
    }

    var diffTime = now - lastTrigger;
    var triggerWait = 0;

    if (diffTime < 0 || diffTime > wait) {
      triggerWait = 0;
    } else {
      triggerWait = wait - diffTime;
    }

    lastTrigger = now;

    for (var key in data) {
      var value = data[key];
      var contextData = context.data;
      context.data = util.safeEval(key, value, contextData);
    }

    cache = Object.assign(cache, data);

    if (typeof cb === "function") {
      cbArr.push(cb);
    }

    timeoutId = setTimeout(later, triggerWait);
  };

  _setData.cancel = function () {
    clearTimeout(timeoutId);
    timeoutId = null;
    cache = {};
    cbArr = [];
  };

  _setData.immediate = function () {
    later();
  };

  return _setData;
}

var debounce_1 = debounce;

var src = debounce_1;

module.exports = src;
