# debounce-setdata

对微信小程序 setData 的防抖节流封装

## 项目简介

> 开发微信小程序时常会碰到频繁 `setData` 导致的性能问题，本项目可以将某一段时间内的多次 `setData` 操作归并为一次 `setData` 操作。

## 安装

```sh
npm i debounce-setdata --save
```

## 使用例子

```js
import debounceSetdata from "debounce-setdata";

Page({
    data: {},
    onLoad: function() {
        this._setData = debounceSetdata(this, {
            wait: 100 // 将会归并100毫秒内的所有setData操作
        });

        // 例如下面操作中虽然循环了1000次，但最终只会进行一次setData操作
        for (let i = 0; i < 1000; i++) {
            this._setData({
                name: "名字"
            });
        }
    }
});
```

**注意事项**

-   `setData` 操作将被延时，最大延时时间由所设置的 `wait` 的值决定。
-   `this.data` 的修改是即时的，即数据将即时更新到 `this.data`，所以事实上只有视图的更新是被延时的。

# Api

## debounce-setdata

_参数_

```js
debounceSetdata(context, options);
```

> context (Object): `setData` 的主体，可以是小程序的页面对象或者组件对象。

> options (Object): 配置信息。属性说明：wait —— 表示归并多少毫秒内的 setData 操作。

_返回_

> 一个具有节流防抖功能的 `setData` 函数

_例子_

```js
this._setData = debounceSetdata(this, {
    wait: 100
});
```

## 封装后的 `setData` 函数

_参数_

```js
this._setData(data, cb, options);
```

> data (Object): 要修改的数据，。

> cb (Function): `setData` 操作结束时的回调函数。

> options (Object): 配置信息。属性说明：immediate —— 默认为 false, 如果为 true，则立即执行 `setData` 操作，即和原生的 `setData` 一样的效果。

_例子_

```js
this._setData(
    {
        name: "名字"
    },
    function() {
        console.log("setData over");
    }
);
```
