---
title: Vue2.x keep-alive原理分析
---

## 使用

```html
<!-- 失活的组件将会被缓存！ -->
<keep-alive>
  <component :is="view"></component>
</keep-alive>
<!-- include 和 exclude prop 允许组件有条件地缓存。二者都可以用逗号分隔字符串、正则表达式或一个数组来表示： -->
<!-- 逗号分隔字符串 -->
<keep-alive include="a,b">
  <component :is="view"></component>
</keep-alive>

<!-- 正则表达式 (使用 `v-bind`) -->
<keep-alive :include="/a|b/">
  <component :is="view"></component>
</keep-alive>

<!-- 数组 (使用 `v-bind`) -->
<keep-alive :include="['a', 'b']">
  <component :is="view"></component>
</keep-alive>
```

### 结合路由

```js
export default new Router({
    routes:[
        {
            path:'/',
            component: () => import('./views/Home.vue')
            name: 'home',
            meta:{
                keepAlive:true
            }
        }
    ]
})
```

```html
<keep-alive  v-if="$route.meta.keepAlive">
  <router-view :is="view"></router-vi>
</keep-alive>
<router-view v-if="!$route.meta.keepAlive"></router-view>
```
