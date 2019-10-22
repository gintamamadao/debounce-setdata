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

        // 例如下面操作中虽然循环了1000次，但最终只会有一次setData操作
        for (let i = 0; i < 1000; i++) {
            this._setData({
                name: "名字"
            });
        }
    }
});
```
