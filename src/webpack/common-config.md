---
title: webpack常见配置
date: 2021-06-18
category:
  - webpack
---

## `webpack.base.js`

::: details webpack.base.js

```js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const chalk = require("chalk");
// 进度条
const ProgressBarPlugin = require("progress-bar-webpack-plugin");
// const MiniCssExtractPlugin = require("mini-css-extract-plugin");
// cross-env   package中设置 cross-env NODE_ENV=production
// const isEnvProduction = process.env.NODE_ENV === "production";
const { VueLoaderPlugin } = require("vue-loader");
const FriendlyErrorsWebpackPlugin = require("friendly-errors-webpack-plugin");
// const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')

const notifier = require("node-notifier");

const path = require("path");

const paths = {
  entry: "./src/main.js",
};
function resolve(p) {
  return path.resolve(__dirname, p);
}
module.exports = {
  entry: paths.entry,
  module: {
    rules: [
      {
        test: /\.(t|j)s$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            cacheDirectory: true,
          },
        },
      },
      {
        test: /\.vue$/,
        use: [
          {
            loader: resolve("../source-code/vue-loader-15.9.8"),
            // loader:'vue-loader'
          },
        ],
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: "ts-loader",
        options: {
          appendTsSuffixTo: [/\.vue$/],
        },
      },
      {
        test: /\.(le|c)ss$/,
        use: [
          "style-loader",
          // isEnvProduction && MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "less-loader",
        ],
      },
      {
        test: /\.(png|svg|jpe?g|gif)$/,
        type: "asset",
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: "images/[name]-[hash][ext]",
        },
      },
      {
        test: /\.(eot|svg|ttf|woff2?)$/,
        type: "asset/resource",
        generator: {
          filename: "fonts/[name]-[hash][ext]",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "../src"),
    },
    // fallback:{
    //   path:require.resolve('path-browserify')
    // }
  },
  plugins: [
    // new NodePolyfillPlugin(),
    new HtmlWebpackPlugin({
      title: "source-test",
      template: "./public/index.html",
    }),
    new VueLoaderPlugin(),
    new ProgressBarPlugin({
      format: ` :msg [:bar] ${chalk.green.bold(":percent")}(:elapsed s)`,
    }),
    new FriendlyErrorsWebpackPlugin({
      onErrors: (severity, errors) => {
        if (severity !== "error") {
          return;
        }
        const error = errors[0];
        notifier.notify({
          title: "webpack error",
          message: severity + ":" + error.name,
          subtitle: error.file || "",
        });
      },
    }),
  ],
};
```

:::

## `webpack.dev.js`

::: details webpack.dev.js

```js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base");

module.exports = merge(baseConfig, {
  mode: "development",
  target: "web",
  devServer: {
    // contentBase:'./dist',
    hot: true,
    open: true,
    compress: true,
    http2: true,
  },
  // webpack5 内置缓存
  cache: {
    type: "filesystem",
  },
});
```

:::

## `webpack.prod.js`

details webpack.prod.js

```js
const { merge } = require("webpack-merge");
const baseConfig = require("./webpack.base.js");
// 匹配指定目录的文件
const glob = require("glob");
const paths = require("paths");
//将 css 单独抽出一个文件
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
//css tree shaking
const PurgeCssPlugin = require("purgecss-webpack-plugin");

const CompressionWebpackPlugin = require("compression-webpack-plugin");

const HtmlMinimizerPlugin = require("html-minimizer-webpack-plugin");

const TerserPlugin = require("terser-webpack-plugin");
// html 引入的文件 不会打包 需直接copy过去
const CopyWebpackPlugin = require("copy-webpack-plugin");

module.exports = merge(baseConfig, {
  mode: "development",
  output: {
    clean: true, //清理打包文件
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: "css/[name].css",
    }),
    new PurgeCssPlugin({
      paths: glob.sync(`${paths.appSrc}/**/*`, { nodir: true }),
    }),

    new CopyWebpackPlugin({
      // from后的路径是相对于项目的根目录，to后的路径是相对于打包后的dist目录
      patterns: [{ from: "./public", to: "./public" }],
    }),
    new HtmlMinimizerPlugin(),
    new CompressionWebpackPlugin({
      test: /\.(js|css)$/, //开启gzip压缩
    }),
  ],
  optimization: {
    splitChunks: {
      // 选择对哪些文件进行拆分，默认是async，即只对动态导入的文件进行拆分
      chunks: "all",
      // 提取chunk的最小体积
      minSize: 2000,
      // 要提取的chunk最少被引用次数
      minChunks: 1,
      // 对要提取的trunk进行分组
      cacheGroups: {
        // 匹配node_modules中的三方库，将其打包成一个trunk
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: "vendors",
          priority: -10,
        },
        default: {
          // 将至少被两个trunk引入的模块提取出来打包成单独trunk
          minChunks: 2,
          name: "default",
          priority: -20,
        },
      },
    },
    minimizer: [
      new TerserPlugin({
        parallel: 4,
        terserOptions: {
          parse: {
            ecma: 8,
          },
          compress: {
            ecma: 5,
            warnings: false,
            comparisons: false,
            inline: 2,
          },
          mangle: {
            safari10: true,
          },
          output: {
            ecma: 5,
            comments: false,
            ascii_only: true,
          },
        },
      }),
    ],
    // 为运行时代码创建一个额外的 chunk
    runtimeChunk: true,
  },
});

```

:::
