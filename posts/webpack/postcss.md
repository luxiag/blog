---
title: PostCss
date: 2020-10-12
---

- PostCSS是一个通过JavaScript来转换样式的工具；
- 这个工具可以帮助我们进行一些CSS的转换和适配，比如自动添加浏览器前缀、css样式的重置；
- 但是实现这些工具，我们需要借助于PostCSS对应的插件；

# **命令行使用postcss**

`postcss-cli`: `cli`command line interface 命令行接口

```jsx
 npm install postcss postcss-cli -D
```

**通过postcss使用autoprefixer**

```jsx
 npx postcss --use autoprefixer -o end.css ./src/css/style.css
```

# webpack中使用

## **postcss-loader**

在webpack中使用postcss

```
 npm install postcss postcss-loader -D
```

**在postcss里使用autoprefixer**

`webpack.config.js`

```jsx
 module.exports = {
     module: {
         rules: [
             {
                 test: /\.css$/,
                 use: [
                     //loader的执行顺序是从右向左（或者说从下到上，或者说从后到前的），
                     //{ loader: 'style-loader'} 的简写
                     "style-loader",
                     "css-loader",
                     {
                         loader:"postcss-loader",
                         options:{
                             postcssOptions:{
                                 plugins:[
                                     require("autoprefixer")
                                 ]
                             }
                         }
                     }
                 ],
             },
         ],
     },
 }
```

**在postcss使用postcss-preset-env**

- 将一些现代的CSS特性，转成大多数浏览器认识的CSS，并且会根据目标浏览器或者运行时环境添加所需的polyfill；
- 也包括会自动添加autoprefixer（所以相当于已经内置了autoprefixer）；

`webpack.config.js`

```jsx
 module.exports = {
     module: {
         rules: [
             {
                 test: /\.css$/,
                 use: [
                     //loader的执行顺序是从右向左（或者说从下到上，或者说从后到前的），
                     //{ loader: 'style-loader'} 的简写
                     "style-loader",
                     "css-loader",
                     {
                         loader:"postcss-loader",
                         options:{
                             postcssOptions:{
                                 plugins:[
                                     require("postcss-preset-env")
                                 ]
                             }
                         }
                     }
                 ],
             },
         ],
     },
 }
```

# **单独的postcss配置文件**

当`.css`、`.less`都需要使用postcss插件时，可以将postcss单独抽离处理减少代码重复率

`不抽离webpack.config.js`

```jsx
 //.....
 rules: [
     {
         test: /\.css$/,
         use: [
             //loader的执行顺序是从右向左（或者说从下到上，或者说从后到前的），
             //{ loader: 'style-loader'} 的简写
             "style-loader",
             "css-loader",
             {
                 loader:"postcss-loader",
                 options:{
                     postcssOptions:{
                         plugins:[
                             require("postcss-preset-env")
                         ]
                     }
                 }
             }
         ],
     },
     {
         test:/\.less$/,
         use:[
             "style-loader",
             "css-loader",
             "less-loader",
             {
                 loader:"postcss-loader",
                 options:{
                     postcssOptions:{
                         plugins:[
                             require("postcss-preset-env")
                         ]
                     }
                 }
             }
         ]
     }
 ],
 
```

**抽离postcss配置**

`postcss.config.js`

```jsx
 module.exports = {
     plugins:[
         require('autoprefixer')
     ]
 }
```

`webpack.config.js`
```js
 rules:[
     {
         test:/\.css$/,
         use:[
             "style-loader",
             "css-loader",
             "postcss-loader"
         ]
     },
     {
         test:/\.less$/,
         use:[
             "style-loader",
             "css-loader",
             "postcss-loader"
         ]
     }
 ]
```