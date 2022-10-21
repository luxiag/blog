---
title: vue-loader-15.9.8代码分析
reference: https://mp.weixin.qq.com/s/FJzDRLchG_DWA80Wp141Vg
next: init
date: 2021-06-18
category:
  - vue2
  - webpack
---

## loader 执行顺序

先左到右执行 loader 上的 pitch 方法,如果 pitch 方法有实际的返回值会跳过后续的 pitch 方法
在右到左执行 loader

## vue-loader

source => parse()转化 => descriptor => Vue-loader 生成 code

```js
const { parse } = require("@vue/component-compiler-utils");

module.exports = function (source) {
  //....
  const descriptor = parse({
    source,
    compiler: options.compiler || loadTemplateCompiler(loaderContext),
    filename,
    sourceRoot,
    needMap: sourceMap,
  });
  /**
  descriptor {
    template: { ... },
    script: { ... },
    styles: [ ... ],
    customBlocks: [],
    errors: []
  }
  */
  // 第二次进入 vue-loader 执行 匹配到.vue?type=template
  // if the query has a type field, this is a language block request
  // e.g. foo.vue?type=template&id=xxxxx
  // and we will return early
  if (incomingQuery.type) {
    return selectBlock(
      descriptor,
      loaderContext,
      incomingQuery,
      !!options.appendExtension
    );
  }

  // ....

  return code;
};
```

::: details console.log(source)

```js
<template>
  <div class="hello">
    <h1>{{ msg }}</h1>
    <p>
      For a guide and recipes on how to configure / customize this project,<br>
      check out the
      <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.
    </p>
    <h3>Installed CLI Plugins</h3>
    <ul>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>
      <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>
    </ul>
    <h3>Essential Links</h3>
    <ul>
      <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>
      <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>
      <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>
      <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>
      <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>
    </ul>
    <h3>Ecosystem</h3>
    <ul>
      <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>
      <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>
      <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>
      <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>
      <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
    data(){
    return {
      pageName:'App'
    }
  },
  create(){
      console.log('helloWorld --create')
  },
  mounted(){
    console.log('app -- mounted')
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>

```

:::

::: details console.log(descriptor)

```js
  template: {
    type: 'template',
    content: '\n' +
      '<div class="hello">\n' +
      '  <h1>{{ msg }}</h1>\n' +
      '  <p>\n' +
      '    For a guide and recipes on how to configure / customize this project,<br>\n' +
      '    check out the\n' +
      '    <a href="https://cli.vuejs.org" target="_blank" rel="noopener">vue-cli documentation</a>.\n' +
      '  </p>\n' +
      '  <h3>Installed CLI Plugins</h3>\n' +
      '  <ul>\n' +
      '    <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel" target="_blank" rel="noopener">babel</a></li>\n' +
      '    <li><a href="https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint" target="_blank" rel="noopener">eslint</a></li>\n' +
      '  </ul>\n' +
      '  <h3>Essential Links</h3>\n' +
      '  <ul>\n' +
      '    <li><a href="https://vuejs.org" target="_blank" rel="noopener">Core Docs</a></li>\n' +
      '    <li><a href="https://forum.vuejs.org" target="_blank" rel="noopener">Forum</a></li>\n' +
      '    <li><a href="https://chat.vuejs.org" target="_blank" rel="noopener">Community Chat</a></li>\n' +
      '    <li><a href="https://twitter.com/vuejs" target="_blank" rel="noopener">Twitter</a></li>\n' +
      '    <li><a href="https://news.vuejs.org" target="_blank" rel="noopener">News</a></li>\n' +
      '  </ul>\n' +
      '  <h3>Ecosystem</h3>\n' +
      '  <ul>\n' +
      '    <li><a href="https://router.vuejs.org" target="_blank" rel="noopener">vue-router</a></li>\n' +
      '    <li><a href="https://vuex.vuejs.org" target="_blank" rel="noopener">vuex</a></li>\n' +
      '    <li><a href="https://github.com/vuejs/vue-devtools#vue-devtools" target="_blank" rel="noopener">vue-devtools</a></li>\n' +
      '    <li><a href="https://vue-loader.vuejs.org" target="_blank" rel="noopener">vue-loader</a></li>\n' +
      '    <li><a href="https://github.com/vuejs/awesome-vue" target="_blank" rel="noopener">awesome-vue</a></li>\n' +
      '  </ul>\n' +
      '</div>\n',
    start: 10,
    attrs: {},
    end: 1681
  },
  script: {
    type: 'script',
    content: '//\n' +
      'export default {\n' +
      "  name: 'HelloWorld',\n" +
      '  props: {\n' +
      '    msg: String\n' +
      '  },\n' +
      '    data(){\n' +
      '    return {\n' +
      "      pageName:'App'\n" +
      '    }\n' +
      '  },\n' +
      '  create(){\n' +
      "      console.log('helloWorld --create')\n" +
      '  },\n' +
      '  mounted(){\n' +
      "    console.log('app -- mounted')\n" +
      '  }\n' +
      '}\n',
    start: 1702,
    attrs: {},
    end: 1942
  },
  styles: [
    {
      type: 'style',
      content: '\n' +
        'h3 {\n' +
        '  margin: 40px 0 0;\n' +
        '}\n' +
        'ul {\n' +
        '  list-style-type: none;\n' +
        '  padding: 0;\n' +
        '}\n' +
        'li {\n' +
        '  display: inline-block;\n' +
        '  margin: 0 10px;\n' +
        '}\n' +
        'a {\n' +
        '  color: #42b983;\n' +
        '}\n',
      start: 2035,
      attrs: [Object],
      scoped: true,
      end: 2183
    }
  ],
  customBlocks: [],
  errors: [ 'tag <br> has no matching end tag.' ]

```

:::

::: details console.log(code)

```js
import {
  render,
  staticRenderFns,
} from "./HelloWorld.vue?vue&type=template&id=469af010&scoped=true&";
import script from "./HelloWorld.vue?vue&type=script&lang=js&";
export * from "./HelloWorld.vue?vue&type=script&lang=js&";
import style0 from "./HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css&";

/* normalize component */
import normalizer from "!../../source-code/vue-loader-15.9.8/lib/runtime/componentNormalizer.js";
var component = normalizer(
  script,
  render,
  staticRenderFns,
  false,
  null,
  "469af010",
  null
);

/* hot reload */
if (module.hot) {
  var api = require("F:\\github\\vue2-test\\node_modules\\vue-hot-reload-api\\dist\\index.js");
  api.install(require("vue"));
  if (api.compatible) {
    module.hot.accept();
    if (!api.isRecorded("469af010")) {
      api.createRecord("469af010", component.options);
    } else {
      api.reload("469af010", component.options);
    }
    module.hot.accept(
      "./HelloWorld.vue?vue&type=template&id=469af010&scoped=true&",
      function () {
        api.rerender("469af010", {
          render: render,
          staticRenderFns: staticRenderFns,
        });
      }
    );
  }
}
component.options.__file = "src/components/HelloWorld.vue";
export default component.exports;
```

:::

## VueLoaderPlugin

![webpack 插件](https://webpack.docschina.org/concepts/plugins/#root)是一个具有 apply 方法的 JavaScript 对象。apply 方法会被 webpack compiler 调用，并且在 整个 编译生命周期都可以访问 compiler 对象。

Plugin 的作用，主要有以下两条：

- 能够 hook 到在每个编译(compilation)中触发的所有关键事件。
- 在插件实例的 apply 方法中，可以通过 compiler.options 获取 Webpack 配置，并进行修改。

```js

class VueLoaderPlugin {
  apply (compiler) {
    // 对 Webpack 配置进行修改
    const rules = compiler.options.module.rules

    const clonedRules = rules
      .filter(r => r !== rawVueRules)
      .map((rawRule) => cloneRule(rawRule, refs))

    // pitcher
    const pitcher = {
      loader: require.resolve('./loaders/pitcher'),
      resourceQuery: query => {
        if (!query) { return false }
        const parsed = qs.parse(query.slice(1))
        return parsed.vue != null
      },
      options: { ... }
    }

    // 替换初始 module.rules，在原有 rule 上，增加 pitcher、clonedRules
    compiler.options.module.rules = [
       pitcher,
       ...clonedRules,
       ...rules
     ];
  }
}

```

### pitchLoader

```js

// vue-loader lib/loaders/pitcher.js
module.exports.pitch = function (remainingRequest) {

    // this.resourceQuery import文件?后的内容
    // ?vue&type=script&lang=js&
    // ?vue&type=template&id=3942140e&scoped=true&
    //
  const query = qs.parse(this.resourceQuery.slice(1))
  if (query.type === 'style') { ... }
  if (query.type === 'template') { ... }

  // 处理 script 块和 custom 块
  return `import mod from ${request}; export default mod; export * from ${request}`;
}
```

::: details pitch 处理结果

```js
//  template ?vue&type=template&id=39502b8f&scoped=true&
export * from "-!../../source-code/vue-loader-15.9.8/lib/loaders/templateLoader.js??vue-loader-options!../../source-code/vue-loader-15.9.8/lib/index.js??vue-loader-options!./HomeChild2.vue?vue&type=template&id=39502b8f&scoped=true&"

//  style vue&type=style&index=0&id=469af010&scoped=true&lang=css&
"-!../../node_modules/style-loader/dist/cjs.js!../../node_modules/css-loader/dist/cjs.js!../../source-code/vue-loader-15.9.8/lib/loaders/stylePostLoader.js!../../node_modules/postcss-loader/dist/cjs.js!../../node_modules/less-loader/dist/cjs.js!../../source-code/vue-loader-15.9.8/lib/index.js??vue-loader-options!./HelloWorld.vue?vue&type=style&index=0&id=469af010&scoped=true&lang=css&"
//  script vue&type=script&lang=js& 
import mod from "-!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!../../source-code/vue-loader-15.9.8/lib/index.js??vue-loader-options!./HomeChild2.vue?vue&type=script&lang=js&";
export default mod;
export * from "-!../../node_modules/babel-loader/lib/index.js??clonedRuleSet-1[0].rules[0].use!../../source-code/vue-loader-15.9.8/lib/index.js??vue-loader-options!./HomeChild2.vue?vue&type=script&lang=js&";
```

:::
