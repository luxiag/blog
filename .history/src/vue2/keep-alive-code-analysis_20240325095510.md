---
title: Vue2.x keep-alive原理分析
date: 2021-09-12
category:
  - Vue
type:
  - vue2
---

`<keep-alive>`是 Vue 中内置的一个抽象组件，自身不会渲染，也不会出现在父组件链中。当它包裹动态组件时，会缓存不活动的组件实例，而不是销毁它们。
组件一旦被 `<keep-alive>` 缓存，再次渲染的时候不会执行 created、mounted 等钩子函数

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

## keep-alive

::: details keep-alive

```js
function matches(
  pattern: string | RegExp | Array<string>,
  name: string
): boolean {
  if (isArray(pattern)) {
    return pattern.indexOf(name) > -1;
  } else if (typeof pattern === "string") {
    return pattern.split(",").indexOf(name) > -1;
  } else if (isRegExp(pattern)) {
    return pattern.test(name);
  }
  /* istanbul ignore next */
  return false;
}

function pruneCache(
  keepAliveInstance: { cache: CacheEntryMap, keys: string[], _vnode: VNode },
  filter: Function
) {
  const { cache, keys, _vnode } = keepAliveInstance;
  for (const key in cache) {
    const entry = cache[key];
    if (entry) {
      const name = entry.name;
      if (name && !filter(name)) {
        pruneCacheEntry(cache, key, keys, _vnode);
      }
    }
  }
}

// 判断是否存在缓存的组件 将其摧毁
function pruneCacheEntry(
  cache: CacheEntryMap,
  key: string,
  keys: Array<string>,
  current?: VNode
) {
  const entry = cache[key];
  if (entry && (!current || entry.tag !== current.tag)) {
    // @ts-expect-error can be undefined
    // 执行组件的destory钩子函数
    entry.componentInstance.$destroy();
  }
  cache[key] = null;
  remove(keys, key);
}

const patternTypes: Array<Function> = [String, RegExp, Array];

export default {
  name: "keep-alive",
  // 创建实例时这个属性决定是否忽略某个组件
  abstract: true,

  props: {
    include: patternTypes,
    exclude: patternTypes,
    max: [String, Number],
  },

  methods: {
    cacheVNode() {
      const { cache, keys, vnodeToCache, keyToCache } = this;
      // 判断是否存在缓存对象
      // 将其缓存起来
      if (vnodeToCache) {
        const { tag, componentInstance, componentOptions } = vnodeToCache;
        cache[keyToCache] = {
          name: getComponentName(componentOptions),
          tag,
          componentInstance,
        };
        keys.push(keyToCache);
        // prune oldest entry
        // 检查缓存数量是否超过 max设置值
        if (this.max && keys.length > parseInt(this.max)) {
          pruneCacheEntry(cache, keys[0], keys, this._vnode);
        }
        this.vnodeToCache = null;
      }
    },
  },

  created() {
    this.cache = Object.create(null); // 缓存虚拟dom
    this.keys = []; // 缓存的虚拟dom的健集合
  },

  destroyed() {
    // 删除所有的缓存
    for (const key in this.cache) {
      pruneCacheEntry(this.cache, key, this.keys);
    }
  },

  mounted() {
    this.cacheVNode();
    // 实时监听黑白名单的变动
    this.$watch("include", (val) => {
      pruneCache(this, (name) => matches(val, name));
    });
    this.$watch("exclude", (val) => {
      pruneCache(this, (name) => !matches(val, name));
    });
  },

  updated() {
    this.cacheVNode();
  },

  render() {
    // this 当前 keep-alive 组件
    const slot = this.$slots.default;
    const vnode = getFirstComponentChild(slot);
    const componentOptions = vnode && vnode.componentOptions;
    if (componentOptions) {
      // check pattern
      // 获取组件
      const name = getComponentName(componentOptions);
      const { include, exclude } = this;
      if (
        // not included
        (include && (!name || !matches(include, name))) ||
        // excluded
        (exclude && name && matches(exclude, name))
      ) {
        return vnode;
      }

      const { cache, keys } = this;
      // 定义组件的缓存key
      const key =
        vnode.key == null
          ? // same constructor may get registered as different local components
            // so cid alone is not enough (#3269)
            componentOptions.Ctor.cid +
            (componentOptions.tag ? `::${componentOptions.tag}` : "")
          : vnode.key;

      if (cache[key]) {
        vnode.componentInstance = cache[key].componentInstance;
        // make current key freshest
        remove(keys, key);
        keys.push(key);
      } else {
        // delay setting the cache until update
        // 调用update的时候会缓存该组件
        this.vnodeToCache = vnode;
        this.keyToCache = key;
      }
      // 渲染和执行被包裹组件的钩子函数需要用到
      // @ts-expect-error can vnode.data can be undefined
      vnode.data.keepAlive = true;
    }
    return vnode || (slot && slot[0]);
  },
};
```

:::

## 使用渲染

首次渲染只会在keep-alive建立缓存，其他和普通缓存没有区别

vnode.elm缓存创建的DOM节点

patch => createElm => 如果是组件 createComponent() => reactivateComponent() => 将vnode.elm插入父节点

### createComponent

::: details createComponent

```js
function createComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
  let i = vnode.data;
  if (isDef(i)) {
    // 首次加载 vnode.componentInstance 为undefined
    const isReactivated = isDef(vnode.componentInstance) && i.keepAlive;
    if (isDef((i = i.hook)) && isDef((i = i.init))) {
      // 执行初始化 init
      i(vnode, false /* hydrating */);
    }
    // after calling the init hook, if the vnode is a child component
    // it should've created a child instance and mounted it. the child
    // component also has set the placeholder vnode's elm.
    // in that case we can just return the element and be done.
    if (isDef(vnode.componentInstance)) {
      // 将 vnode.elm 赋值为真实DOM
      initComponent(vnode, insertedVnodeQueue);
      // 将组件真实DOM插入到父元素
      insert(parentElm, vnode.elm, refElm);
      // 如果被keep alive 包裹 且不是首次加载
      if (isTrue(isReactivated)) {
        reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm);
      }
      return true;
    }
  }
}
```

```js
  function reactivateComponent(vnode, insertedVnodeQueue, parentElm, refElm) {
    let i
    // hack for #4339: a reactivated component with inner transition
    // does not trigger because the inner node's created hooks are not called
    // again. It's not ideal to involve module-specific logic in here but
    // there doesn't seem to be a better way to do it.
    let innerNode = vnode
    while (innerNode.componentInstance) {
      innerNode = innerNode.componentInstance._vnode
      if (isDef((i = innerNode.data)) && isDef((i = i.transition))) {
        for (i = 0; i < cbs.activate.length; ++i) {
          cbs.activate[i](emptyNode, innerNode)
        }
        insertedVnodeQueue.push(innerNode)
        break
      }
    }
    // unlike a newly created component,
    // a reactivated keep-alive component doesn't insert itself
    // 将缓存的DOM插入父节点
    insert(parentElm, vnode.elm, refElm)
  }

```

:::
