---
title: webpack启动流程
date: 2021-08-10
category:
  - Webpack
---

![image-20210903154856146](./images/image-20210903154856146.png)

`./node_modules/.bin/webpack`

![image-20210903151045187](./images/image-20210903151045187.png)

`./node_modules/webpack/bin/webpack.js`

```js
runCli(cli);
```

![image-20210903151518238](./images/image-20210903151518238.png)

![image-20210903152801392](./images/image-20210903152801392.png)

`webpack-cli/package.json`

![image-20210903150636053](./images/image-20210903150636053.png)

`bin/cli.js`

**执行`runCLi()`**

![image-20210903153242825](./images/image-20210903153242825.png)

`webpack-cli/lib/bootstrap.js/runCLi`

![image-20210903153231172](./images/image-20210903153231172.png)

`webpack-cli/lib/webpack-cli.js/constructor()`

**调用`WebpackCLi`**

![image-20210903154402992](./images/image-20210903154402992.png)

**引入`webpack`目的**

传入 webpack.config.js 等配置

![image-20210903155324975](./images/image-20210903155324975.png)

**执行 run 方法目的**

调用`this.makeCommand`

![image-20210903155606746](./images/image-20210903155606746.png)

`makeCommand`内部执行`makeOption`方法

![image-20210903155801295](./images/image-20210903155801295.png)

`makeCommand`在执行`runWebpack`方法

`runWebpack`执行`createCompiler`

![image-20210903150304488](./images/image-20210903150304488.png)

**`createCompiler`传入`webpack`配置生成 compiler**

![image-20210903150442697](./images/image-20210903150442697.png)

### 直接启动`webpack`

```js
const webpack = require("webpack");
const config = require("../webpack.config");
const compiler = webpack(config);
compiler.run((err, status) => {
  if (err) {
    console.error(err);
  } else {
    console.log(status);
  }
});
```

执行 node

## `webpack`源码

![img](./images/20191213181558564.jpg)
