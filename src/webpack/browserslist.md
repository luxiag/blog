---
title: Browserslist
date: 2020-10-15
category:
  - Webpack
---

Browserslist 是一个在不同的前端工具之间，共享目标浏览器和 Node.js 版本的配置：

- Autoprefixer
- Babel
- postcss-preset-env
- eslint-plugin-compat
- stylelint-no-unsupported-browser-features
- postcss-normalize
- obsolete-webpack-plugin

## **浏览器兼容**

- 针对不同的浏览器支持的特性：比如 css 特性、js 语法，之间的兼容性；
- Chrome、Safari、IE、Edge、Chrome for Android、UC Browser、QQ Browser 等等；

## **浏览器市场占有率**

caniuse

## **浏览器查询过程**

```
 > 1% #css要兼容市场占有率大于1%的浏览器，js也要兼容市场占有率大于1%的浏览器；
 last 2 versions # 每个浏览器最新2个版本
 not dead #还在更新的浏览器
```

工具会根据我们的配置来获取相关的浏览器信息，以方便决定是否需要进行兼容性的支持：

- 条件查询使用的是 caniuse-lite 的工具，这个工具的数据来自于 caniuse 的网站上；

## **编写规则**

- **defaults：Browserslist 的默认浏览器（> 0.5%, last 2 versions, Firefox ESR, not dead）。**
- **5%：通过全局使用情况统计信息选择的浏览器版本。 >=，<和<=工作过。**
  - 5% in US：使用美国使用情况统计信息。它接受两个字母的国家/地区代码。
  - `> 5% in alt-AS`：使用亚洲地区使用情况统计信息。有关所有区域代码的列表，请参见 caniuse-lite/data/regions
  - `> 5% in my stats`：使用自定义用法数据。
  - `> 5% in browserslist-config-mycompany stats`：使用 来自的自定义使用情况数据 browserslist-config-mycompany/browserslist-stats.json。
  - cover 99.5%：提供覆盖率的最受欢迎的浏览器。
  - cover 99.5% in US：与上述相同，但国家/地区代码由两个字母组成。
  - cover 99.5% in my stats：使用自定义用法数据。
- **dead：24 个月内没有官方支持或更新的浏览器。现在是 IE 10，IE_Mob 11，BlackBerry 10**，BlackBerry 7， Samsung 4 和 OperaMobile 12.1。
- **last 2 versions：每个浏览器的最后 2 个版本。**
  - last 2 Chrome versions：最近 2 个版本的 Chrome 浏览器。
  - last 2 major versions 或 last 2 iOS major versions：最近 2 个主要版本的所有次要/补丁版本。
- node 10 和 node 10.4：选择最新的 Node.js10.x.x 或 10.4.x 版本。
  - current node：Browserslist 现在使用的 Node.js 版本。
  - maintained node versions：所有 Node.js 版本，仍由 Node.js Foundation 维护。
- iOS 7：直接使用 iOS 浏览器版本 7。
  - Firefox > 20：Firefox 的版本高于 20 >=，<并且<=也可以使用。它也可以与 Node.js 一起使用。
  - ie 6-8：选择一个包含范围的版本。
  - Firefox ESR：最新的[Firefox ESR]版本。
  - PhantomJS 2.1 和 PhantomJS 1.9：选择类似于 PhantomJS 运行时的 Safari 版本。
- extends browserslist-config-mycompany：从 browserslist-config-mycompanynpm 包中查询 。
- supports es6-module：支持特定功能的浏览器。 es6-module 这是“我可以使用” 页面 feat 的 URL 上的参数。有关所有可用功能的列表，请参见 。caniuse￾lite/data/features
- browserslist config：在 Browserslist 配置中定义的浏览器。在差异服务中很有用，可用于修改用户的配置，例如 browserslist config and supports es6-module。
- since 2015 或 last 2 years：自 2015 年以来发布的所有版本（since 2015-03 以及 since 2015-03-10）。
- unreleased versions 或 unreleased Chrome versions：Alpha 和 Beta 版本。
- **not ie <= 8：排除先前查询选择的浏览器**。

## **命令行使用 browserslist**

```jsx
 npx browserslist ">1%, last 2 version, not dead"
```

## **配置 browserslist**

- 在`package.json`配置

```json
 "browserslist":[
     "last 2 version",
     "not dead",
     ">0.2%"
 ]
```

- `.browserslistrc`文件

```json
 > 0.5%
 last 2 version
 not dead
```
