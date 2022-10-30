---
title: babel是什么
date: 2021-02-11
category:
    - webpack
    - babel
---



Babel是一个工具链，主要用于旧浏览器或者缓解中将ECMAScript 2015+代码转换为向后兼容版本的
JavaScript；

**babel会根据browserslist工具进行适配**

## plugins

本质就是一个JS程序, 指示着Babel如何对代码进行转换.

- 插件在 Presets 前运行。
- 插件顺序从前往后排列。
- Preset 顺序是颠倒的（从后往前）。

### @babel/plugin-transform-runtime

转换箭头函数

### **@babel/plugin-transform-block-scoping**

将const、let转换为var

## preset

预设就是一堆插件(Plugin)的组合

预设有三个：

- env
- react
- TypeScript

### @babel/preset-env

允许您使用最新的JavaScript，而不需要微管理您的目标环境需要哪些语法转换(以及可选的浏览器填充)

会根据browerslist工具或者target属性自动配置

```jsx
presets:[
	["@babel/reset-env",{
// 配置的targets属性会覆盖browserslist；
		targets:"last 2 version"
	}]
]
```

### @babel/preset-react

设置 React

## **polyfill**

当使用了一些语法特性（例如：Promise, Generator, Symbol等以及实例方法例如Array.prototype.includes等）浏览器不认识这些特性就可以使用polyfill来填充或者说打一个补丁，那么就会包含该特性了；

**使用**

babel7.4.0之前，直接使用@babel/polyfill

babel7.4.0之后，单独引入core-js和regenerator-runtime来完成polyfill的使用

`webpack.config.js`

```jsx
 module.exports = {
     module:{
         rules:[
             {
                 test: /\.js$/,
                 //该文件下的包可能开发已经使用过了
                 exclude:/node_modules/,
                 use:{
                     loader:"babel-loader"
                 }
             }
         ]
     }
 }
```

`babel.config.js`

```jsx
 module.exports = {
     presets:[
         [
             "@babel/preset-env",{
                 //在该preset里使用profill
                 //useBuiltIns: 设置以什么样的方式来使用polyfill；
                 useBuiltIns:"usage",
                 //false 不使用polyfill 不需要设置corejs
                 //usage 根据源代码中出现的语言特性，自动检测所需要的polyfill；
                 //      可以设置corejs属性来确定使用的corejs的版本；
                 //entry 根据 browserslist 目标导入所有的polyfill，
                 //      并且需要在入口文件中添加 `import 'core-js/stable';
                 //      import 'regenerator-runtime/runtime';
                 corejs: 3.8  //设置corejs的版本
 
             }
         ]
     ]
 }
```

### **Plugin-transform-runtime**

使用的polyfill，默认情况是添加的所有特性都是全局的

编写一个工具库，工具库需要使用polyfill；避免污染全局代码使用@babel/plugin-transform-runtime来完成polyfill的功能；

**使用**

`babel.config.js`

```jsx
 module.exports = {
   plugins:[
       ["@babel/plugin-transform-tuntime",{
           "corejs":3
       }]
   ]
 }
```

![image-20210824150749960.png](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/44cf47ba-2317-4939-ac66-76f027030662/image-20210824150749960.png)

## **Babel命令行使用**

babel本身可以作为一个独立的工具（和postcss一样），不和webpack等构建工具配置来单独使用。

- @babel/core：babel的核心代码，必须安装；
- @babel/cli：可以让我们在命令行使用babel；

### **插件的使用**

转换箭头函数

```bash
 npm install @babel/plugin-transform-arrow-functions -D

 npx babel src --out-dir dist --plugins=@babel/plugin-transform-arrow-functions
```

变量转换

```bash
 npm install @babel/plugin-transform-block-scoping -D

 npx babel src --out-dir dist --plugins=@babel/plugin-transform-block-scoping
 ,@babel/plugin-transform-arrow-functions
 
```

## **在webpack中使用**

`webpack.config.js`

```jsx
 module.exports = {
     module:{
         rules:[
             {
                 test:/\.js$/,
                 use:{
                     loader:"babel-loader"
                 }
             }
         ]
     }
 }
```

### **使用plugins**

`webpack.config.js`

```jsx
 module.exports = {
     module:{
         rules:[
             {
                 test:/\.js$/,
                 use:{
                     loader:"babel-loader",
                     options:{
                         plugins:[
                             "@babel/plugin-transform-arrow-functions",
                             "@babel/plugin-transform-block-scoping"
                         ]
                     }
                 }
             }
         ]
     }
 }
```

### **使用preset**

`webpack.config.js`

```jsx
 module.exports = {
     module:{
         rules:[
             {
                 test:/\.js$/,
                 use:{
                     loader:"babel-loader",
                     options:{
                         presets:[
                             //第一种写法：不使用属性
                             //“@babel/preset-env”

                             //第二种写法：使用预设属性
                             ["@babel/preset-env",{
                                 //使用属性
                                 //https://www.babeljs.cn/docs/babel-preset-env
                             }]
                         ]
                     }
                 }
             }
         ]
     }
 }
```

## **独立babel配置**

将webpack中的重复使用的plugins和preset单独抽离出来

**babel提供了两种配置文件的编写：**

- babel.config.json（或者.js，.cjs，.mjs）文件；
- .babelrc.json（或者.babelrc，.js，.cjs，.mjs）文件；
- .babelrc.json：早期使用较多的配置方式，但是对于配置Monorepos项目是比较麻烦的；
- babel.config.json（babel7）：可以直接作用于Monorepos项目的子包，更加推荐；

`babel.config.js`

```jsx
 module.exports = {
     preset:[
         [
             "@babel/preset-env"
         ]
     ]
 }
```

## **Babel底层原理**

可以将babel看成就是一个编译器

Babel也拥有编译器的工作流程：

- 解析阶段（Parsing）
- 转换阶段（Transformation）
- 生成阶段（Code Generation）

