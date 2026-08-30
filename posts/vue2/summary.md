---
title: Vue2.x 框架原理-总结
date: 2021-09-30
category:
  - Vue
tags:
  - vue2
excerpt: 'Vue2.x 框架原理系列文章总结，串联初始化、响应式、编译、挂载等核心流程'
---

本系列文章从源码层面分析了 Vue 2.x 框架的核心原理，以下是各篇文章的核心要点串联。

## 整体流程

Vue 应用的启动到渲染，经历了以下核心阶段：

1. **VueLoader 编译**：`.vue` 文件被 vue-loader 解析为 template、script、style 三个部分，分别处理
2. **初始化**：`new Vue()` 调用 `_init`，依次完成选项合并、生命周期初始化、事件初始化、状态初始化（props → methods → data → computed → watch）
3. **响应式**：通过 `Object.defineProperty` 拦截数据的 get/set，在 get 时收集依赖（Dep → Watcher），在 set 时派发更新（dep.notify → watcher.update → queueWatcher → nextTick → flushSchedulerQueue → watcher.run）
4. **编译**：模板字符串 → AST（parse）→ 标记静态节点（optimize）→ 渲染函数字符串（generate）
5. **挂载**：`$mount` → `mountComponent` → 创建渲染 Watcher → `_render` 生成 VNode → `_update` 执行 patch → DOM 渲染
6. **更新**：数据变化 → setter 触发 dep.notify → watcher 入队 → nextTick 批量执行 → 重新 render → patch Diff → 最小化 DOM 更新

## 核心机制

### 三种 Watcher

| 类型 | 创建时机 | 特点 |
|---|---|---|
| 渲染 Watcher | mountComponent | 每次数据变化触发组件重新渲染 |
| computed Watcher | initComputed | lazy: true，dirty 标志控制缓存 |
| user Watcher | $watch / watch 选项 | user: true，执行用户回调 |

### 路由与状态管理

- **Vue-Router**：通过路由映射表匹配路径，transitionTo 触发路由守卫链，最终更新 `_route` 响应式属性驱动 router-view 重新渲染
- **Vuex**：基于 Vue 响应式系统构建状态管理，commit 同步修改 state，dispatch 支持异步操作，模块化通过递归安装实现

### 组件缓存与样式隔离

- **keep-alive**：抽象组件，缓存 VNode 实例，LRU 策略淘汰，activated/deactivated 钩子替代 created/destroyed
- **Scoped CSS**：data 属性 + 属性选择器实现样式隔离，深度选择器穿透子组件

## 系列文章

- [vue-loader 代码分析](/posts/vue2/vue-loader-code-analysis)
- [初始化与响应式原理](/posts/vue2/init)
- [组件挂载](/posts/vue2/mount)
- [模板编译](/posts/vue2/parse)
- [生命周期](/posts/vue2/life-cycle)
- [computed 原理](/posts/vue2/computed-code-analysis)
- [watch 原理](/posts/vue2/watch-code-analysis)
- [指令原理](/posts/vue2/direct-code-analysis)
- [keep-alive 原理](/posts/vue2/keep-alive-code-analysis)
- [Scoped CSS 原理](/posts/vue2/scoped-code-analysis)
- [Vue-Router 原理](/posts/vue2/vue-router-code-analysis)
- [Vuex 原理](/posts/vue2/vuex-code-analysis)