---
title: 什么是loader
date: 2020-08-11
---

## loader 本质

| webpack 只能处理 JavaScript 和 JSON 文件，其他类型的文件 webpack 需要借助 loader 来处理,loader 本质就是一个 JavaScript 函数

## loader 的使用

- 配置方式（官方推荐）
- 内联方式

::: details 配置方式

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [
          // [style-loader](/loaders/style-loader)
          { loader: "style-loader" },
          // [css-loader](/loaders/css-loader)
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          // [sass-loader](/loaders/sass-loader)
          { loader: "sass-loader" },
        ],
      },
    ],
  },
};
```

:::

::: details 内联方式

```js
// 使用 ! 将资源中的 loader 分开。每个部分都会相对于当前目录解析。
import Styles from "style-loader!css-loader?modules!./styles.css";
```

:::

### loader 的分类

配置方式更具`Rule.enforce`的取值 loader 分为前置`pre`和后置`post`,默认为`normal`

```js
rules: [
  {
    test: /\.(t|j)s$/,
    exclude: /node_modules/,
    enforce: 'pre'// post
    use: {
      loader: "babel-loader",
      options: {
        cacheDirectory: true,
      },
    },
  },
];
```

内联方式的 loader 取值为行内`inline`

### inline 方式的 loader

使用 ! 将资源中的 loader 分开。每个部分都会相对于当前目录解析。

```js
import Styles from "style-loader!css-loader?modules!./styles.css";
```

使用 ! 前缀，将禁用所有已配置的 normal loader(普通 loader)

```js
import Styles from "!style-loader!css-loader?modules!./styles.css";
```

使用 !! 前缀，将禁用所有已配置的 loader（preLoader, loader, postLoader）

```js
import Styles from "!!style-loader!css-loader?modules!./styles.css";
```

使用 -! 前缀，将禁用所有已配置的 preLoader 和 loader，但是不禁用 postLoaders

```js
import Styles from "-!style-loader!css-loader?modules!./styles.css";
```

## loader 的优先级

四种 loader 调用先后顺序为：pre > normal > inline > post

每个 loader 都有 normal 函数和 pitch 函数

- normal 函数 相同种类 loader 的情况下，调用的优先级为，自下而上，自右向左。
- pitch 函数 则反过来

```js
// xx-loader
// normal函数
module.exports = function (source) {};
// pitch函数
module.exports.pitch = function (remainingRequest) {};
```

### pitch 函数

loader 有两个函数，默认`module.exports`导出函数为`normal`函数,`module.exports.pitch`导出函数为`pitch`方法

在 loader 从右向左调用之前，会进行一次从左到右的 pitch 方法调用，而在 pitch 调用过程中，如果任何一个有返回值，那么将阻断后续的 loader 调用链，进而将自身的返回结果传递给上一个 loader 作为 content

```js
use: ["a-loader", "b-loader", "c-loader"];
```

顺序
a-loader.pitch => b-loader.pitch => c-loader.pitch => c-loader => b-loader => a-loader

如果 pitch loader有返回值 将会跳过后面的loader 将结果传递给前一个loader
例如： b-loader.pitch 有返回值
a-loader.pitch => b-loader.pitch => a-loader
