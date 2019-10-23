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

var arrItemReg = /^(\S+)\[(\d)+\]$/;
var Util = {
  safeEval: function safeEval(key, value, obj) {
    obj = obj || {};
    var keys = key.split(".");
    var len = keys.length;
    var lastObj = obj;
    keys.forEach(function (keyItem, index) {
      var keyMatch = keyItem.match(arrItemReg);

      if (keyMatch) {
        var arrName = keyMatch[1];
        var arrIndex = keyMatch[2];

        if (!Array.isArray(lastObj[arrName])) {
          lastObj[arrName] = [];
        }

        if (index === len - 1) {
          lastObj[arrName][arrIndex] = value;
          return;
        }

        if (_typeof(lastObj[arrName][arrIndex]) !== "object") {
          lastObj[arrName][arrIndex] = {};
        }

        lastObj = lastObj[arrName][arrIndex];
        return;
      }

      if (index === len - 1) {
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
  var isShowLog = options.isShowLog;
  var wait = +options.wait || 0;

  if (isNaN(wait) || wait < 0) {
    wait = 0;
  }

  var later = function later() {
    var keys = Object.keys(cache);

    if (typeof context.setData === "function" && keys.length > 0) {
      context.setData(cache, function () {
        if (isShowLog && console && console.log) {
          var time = new Date().getTime();
          console.log("".concat(time, "\uFF1AsetData over"));
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
