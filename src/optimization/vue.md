---
title: Vue优化
category:
  - Optimization
---

# 子组件拆分

由于 Vue 的更新是组件粒度的，虽然每一帧都通过数据修改导致了父组件的重新渲染，但是子组件却不会重新渲染，因为它的内部也没有任何响应式数据的变化。所以优化后的组件不会在每次渲染都执行耗时任务

# 局部变量
每次访问 `this.xxx` 的时候，由于 `this.xxx` 是一个响应式对象，所以会触发它的 getter，进而会执行依赖收集相关逻辑代码。

```js
result () {
    let result = this.start
}
// 优化
result ({start}) {
  let result = start
}
```

# v-show 复用 DOM

v-if 指令在编译阶段就会编译成一个三元运算符，条件渲染，当条件 value 的值变化的时候，会触发对应的组件更新，对于 v-if 渲染的节点，由于新旧节点 vnode 不一致，在核心 diff 算法比对过程中，会移除旧的 vnode 节点，创建新的 vnode 节点，那么就会创建新的 Heavy 组件，又会经历 Heavy 组件自身初始化、渲染 vnode、patch 等过程。

v-show 指令对应的钩子函数 update，根据 v-show 指令绑定的值来设置它作用的 DOM 元素的 style.display 的值控制显隐。

v-if 的性能优势是在组件的更新阶段，如果仅仅是在初始化阶段，v-if 性能还要高于 v-show，原因是在于它仅仅会渲染一个分支，而 v-show 把两个分支都渲染了，通过 style.display 来控制对应 DOM 的显隐。

# 区分computed和watch使用场景
computed是计算属性，依赖其它属性值，并且computed的值有缓存，只有它依赖的属性值发生改变，下一次获取computed的值时才会重新计算computed的值。
watch更多的是观察的作用，类似于某些数据的监听回调，每当监听的数据变化时都会执行回调进行后续操作。

需要进行数值计算，并且依赖于其它数据时，应该使用computed，因为可以利用computed的缓存特性，避免每次获取值时，都要重新计算。当我们需要在数据变化时执行异步或开销较大的操作时，应该使用watch，使用watch选项允许我们执行异步操作，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。

# KeepAlive

被 KeepAlive 包裹的组件在经过第一次渲染后，的 vnode 以及 DOM 都会被缓存起来，然后再下一次再次渲染该组件的时候，直接从缓存中拿到对应的 vnode 和 DOM，然后渲染，并不需要再走一次组件初始化，render 和 patch 等一系列流程，减少了 script 的执行时间，性能更好。

# 使用非响应式数据

# 路由懒加载

```js
{
  path: "/example",
  name: "example",
  //打包后，每个组件单独生成一个chunk文件
  component: () => import("@/views/example.vue")
}
```

# 参考
- https://juejin.cn/post/6922641008106668045#heading-3
