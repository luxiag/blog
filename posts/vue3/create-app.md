---
title: Vue 3.5 Dom挂载原理
date: 2024-12-20
category: Vue
tags:
  - Vue3
excerpt: 从 createApp().mount() 出发，逐层追踪 Vue 3.5 的 DOM 挂载流程：createApp → render → patch → processComponent → mountComponent → setupRenderEffect → processElement → mountElement → hostInsert，结合源码理解每一层的职责与衔接。
nextPost: vue3/patch
---

```js
import App from './App.vue'
const app = createApp(App)
app.mount('#app')
```

当我们调用 `createApp(App).mount('#app')` 时，Vue 3.5 会依次经过一系列函数调用，最终将虚拟 DOM 转化为真实 DOM 并插入页面。整个过程可以概括为：**创建应用实例 → 挂载入口 → 渲染 → 补丁比较 → 处理组件 → 挂载组件 → 建立响应式副作用 → 处理元素 → 挂载元素 → 插入 DOM**。下面我们从源码出发，逐层拆解每个环节。

# createApp

`createApp` 是整个挂载流程的起点。它的核心逻辑是确保渲染器已经创建，然后调用渲染器上的 `createApp` 方法生成应用实例。渲染器（renderer）是 Vue 中负责平台相关操作的核心模块，它将 DOM 操作抽象为可配置的 options，使得同一套核心逻辑可以运行在浏览器、SSR 等不同环境中。

```ts
const createApp = ({...args} => {
  const app = ensureRenderer().createApp(...args)
  // ...
})
function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer<Node, Element | ShadowRoot>(rendererOptions))
  )
}
function createRender(options){
  return baseCreateRenderer(options)
}

function baseCreateRenderer(options) {
  const render = (vnode,container,namespace)=>{
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace,
      )
    }
    container._vnode = vnode
    if (!isFlushing) {
      isFlushing = true
      flushPreFlushCbs()
      flushPostFlushCbs()
      isFlushing = false
    }
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  }
}
function createAppAPI(render, hydrate) {
  return function createApp(rootComponent, rootProps = null) {
    const app = {
      // 。。。
      use(plugin, ...options) {},
      mixin(mixin) {},
      component(name, component) {},
      directive(name, directive) {},
      mount(rootContainer, isHydrate = false) {},
      unmount() {},
      provide(key, value) {},
      inject(key, defaultValue, treatDefaultAsProvided = false) {}
    }
    return app
  }
}
```

注意 `createAppAPI(render, hydrate)` 将 `render` 函数闭包捕获到了应用实例中，这意味着后续调用 `app.mount()` 时，可以直接使用这个 `render` 来触发渲染。这种设计让应用实例和渲染器之间建立了关联。

# mount

`createApp` 返回的应用实例上有一个 `mount` 方法，但它被重写过了。重写的目的是处理容器选择器的标准化（将字符串选择器转为 DOM 元素），以及确定命名空间（namespace，用于 SVG 等场景）。重写之后，才调用原始的 `mount` 方法进入真正的挂载逻辑。

`app.mount`
```ts
const createApp = ((...args) => {
  const app = ensureRenderer().createApp(...args)
  const {mount} = app
  app.mount = (containerOrSelector:Element | ShadowRoot | string):any => {
    // normalizeContainer = document.querySelector(container)
    const container = normalizeContainer(containerOrSelector)
    if(container) {
      return mount(container,true,resolveRootNamespace(container))
    }
  }
})

function createAppAPI<HostElement>(
  render: RootRenderFunction<HostElement>,
  hydrate?: RootHydrateFunction,
): CreateAppFunction<HostElement> {
  return function createApp(rootComponent, rootProps = null) {
    const context = createAppContext()
    const installedPlugins = new Set()
    // 判断是否挂载
    let isMounted = false
    const app: App = (context.app = {
      // isHydrate 判断是否ssr渲染
      mount(rootContainer: HostElement, isHydrate?: boolean, namespace?: boolean | ElementNamespace){
        if(!isMounted){
          // vnode 就是一个js对象
          const vnode = app._ceVNode || createVNode(rootComponent, rootProps)
          if (isHydrate && hydrate) {
            // ssr 渲染
            hydrate(vnode as VNode<Node, Element>, rootContainer as any)
          } else {
            render(vnode, rootContainer, namespace)
          }
          isMounted = true
          app._container = rootContainer
          // 获取 defineExpose 暴露的属性
          return getComponentPublicInstance(vnode.component!)
        }
      }
    })
  }

}
```

在原始的 `mount` 方法中，关键步骤是：**创建根组件的 VNode**，然后调用 `render(vnode, rootContainer, namespace)` 进入渲染流程。`isMounted` 标志确保同一个应用不会被重复挂载。如果是 SSR 场景则走 `hydrate` 路径，否则走客户端渲染的 `render` 路径。

# render

`render` 函数是渲染器的核心入口。它接收 VNode 和容器，决定是挂载新的 VNode 还是卸载旧的 VNode。当传入的 VNode 不为 `null` 时，调用 `patch` 进行新旧节点的对比处理；当传入 `null` 且容器中已有 VNode 时，执行卸载操作。

```ts
export const render = ((...args) => {
  ensureRenderer().render(...args)
}) as RootRenderFunction<Element | ShadowRoot>

function ensureRenderer() {
  return (
    renderer ||
    (renderer = createRenderer<Node, Element | ShadowRoot>(rendererOptions))
  )
}
export function createRenderer<
  HostNode = RendererNode,
  HostElement = RendererElement,
>(options: RendererOptions<HostNode, HostElement>): Renderer<HostElement> {
  return baseCreateRenderer<HostNode, HostElement>(options)
}
function baseCreateRenderer(options) {
  const render: RootRenderFunction = (vnode, container, namespace) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true)
      }
    } else {
      patch(
        container._vnode || null,
        vnode,
        container,
        null,
        null,
        null,
        namespace,
      )
    }
    // 缓存vnode标记已被渲染
    container._vnode = vnode
    if (!isFlushing) {
      isFlushing = true
      flushPreFlushCbs()
      flushPostFlushCbs()
      isFlushing = false
    }
  }
}
```

`render` 执行完毕后，会将当前 VNode 缓存到 `container._vnode`，这样下次更新时就可以用旧 VNode 与新 VNode 进行 diff 对比。同时，渲染完成后会刷新前后置的回调队列（`flushPreFlushCbs` / `flushPostFlushCbs`），确保 `onMounted` 等生命周期钩子在正确的时机执行。

# patch

`patch` 是 Vue 虚拟 DOM diff 算法的核心入口。它接收新旧 VNode，首先判断它们是否为相同类型的节点——如果类型不同，则直接卸载旧节点，将旧节点置为 `null`，然后按照新节点的 `type` 和 `shapeFlag` 分派到不同的处理函数。对于组件类型的 VNode，会进入 `processComponent`。

```ts
function baseCreateRenderer(options:RendererOptions){
  const patch:PatchFn = (
    n1,
    n2,
    container,
    anchor = null,
    parentComponent = null,
    parentSuspense = null,
    namespace = undefined,
    slotScopeIds = null,
    optimized = __DEV__ && isHmrUpdating ? false : !!n2.dynamicChildren,
  ) => {
    // 不是相同节点
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1)
      unmount(n1, parentComponent, parentSuspense, true)
      n1 = null
    }
    const { type, ref, shapeFlag } = n2
    switch(type){
      // ...
      default:
      processComponent(
        n1,
        n2,
        container,
        anchor,
        parentComponent,
        parentSuspense,
        namespace,
        slotScopeIds,
        optimized,
      )
    }
  }
}
```

在首次挂载的场景下，`n1`（旧 VNode）为 `null`，所以不会进入 `isSameVNodeType` 的判断，直接根据 `n2` 的类型走对应处理函数。对于根组件，类型是组件（Component），因此进入 `processComponent`。

## processComponent

`processComponent` 根据是否存在旧 VNode 来决定是挂载还是更新。首次渲染时 `n1` 为 `null`，所以走 `mountComponent` 分支。如果组件被 `<KeepAlive>` 缓存，则会走 `activate` 路径从缓存中恢复，而非重新创建。

```ts
  const processComponent = (
    n1: VNode | null,
    n2: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
  ) => {
    n2.slotScopeIds = slotScopeIds
    if (n1 == null) {
      // activate keep-alive 方法
      if (n2.shapeFlag & ShapeFlags.COMPONENT_KEPT_ALIVE) {
        ;(parentComponent!.ctx as KeepAliveContext).activate(
          n2,
          container,
          anchor,
          namespace,
          optimized,
        )
      } else {
        mountComponent(
          n2,
          container,
          anchor,
          parentComponent,
          parentSuspense,
          namespace,
          optimized,
        )
      }
    } else {
      updateComponent(n1, n2, optimized)
    }
  }
```

### mountComponent

`mountComponent` 负责组件实例的创建与初始化。它首先通过 `createComponentInstance` 创建组件实例对象，该实例包含了组件的全部内部状态（props、slots、refs、emit 等）。接着调用 `setupComponent` 处理 props、slots 并执行 `setup` 函数。最后调用 `setupRenderEffect` 建立响应式副作用，使组件具备响应式更新的能力。

```ts
// 没有旧vnode直接挂载
  const mountComponent: MountComponentFn = (
    initialVNode,
    container,
    anchor,
    parentComponent,
    parentSuspense,
    namespace: ElementNamespace,
    optimized,
  ) => {
      /*
      instance = {
        uid: uid++,
        vnode: vnode,
        type: vnode.type,
        parent: parentComponent,
        root: null!, // will be set synchronously right after creation
        next: null,
        appContext: (parentComponent && parentComponent.appContext) || context,
        props: EMPTY_OBJ,
        attrs: EMPTY_OBJ,
        slots: EMPTY_OBJ,
        refs: {},
        emit: null!,
        vnodeSlots: null,
        render: null,
        proxy: null,
        withProxy: null,
        .....
      }
      */
    const instance: ComponentInternalInstance =
      compatMountInstance ||
      (initialVNode.component = createComponentInstance(
        initialVNode,
        parentComponent,
        parentSuspense,
      ))
      /*
      处理props、slots
      执行setup
      */
      setupComponent(instance, false, optimized)
      // 创建update函数标记mounted = true,执行update
      setupRenderEffect(
        instance,
        initialVNode,
        container,
        anchor,
        parentSuspense,
        namespace,
        optimized,
      )

  }
```

组件实例 `instance` 是 Vue 组件运行时的核心数据结构，几乎所有的内部逻辑都围绕它展开：`setupComponent` 完成初始化后，`setupRenderEffect` 会创建一个响应式副作用（`ReactiveEffect`），当组件的响应式数据变化时，这个副作用会重新执行 `componentUpdateFn`，从而触发组件的重新渲染。

### setupRenderEffect

`setupRenderEffect` 是组件挂载与更新的核心调度器。它内部定义了 `componentUpdateFn`，并通过 `ReactiveEffect` 将其包装为响应式副作用。首次执行时，调用 `renderComponentRoot` 获取组件的渲染子树（subTree），然后通过 `patch` 递归处理子树。后续数据变化时，`componentUpdateFn` 会再次执行，走更新分支进行 diff。

```ts
const setupRenderEffect: SetupRenderEffectFn = () => {
  // ...
    const componentUpdateFn = () => {
      if(!instance.isMounted) {
        // 获取subTree
        const subTree = (instance.subTree = renderComponentRoot(instance))
        // 挂载
        patch(null, subTree, container, anchor, instance, parentSuspense, isSVG)

        // 调用mounted钩子
        queuePostRenderEffect(() => instance.emit('hook:mounted'),parentSuspense,)
        // 设置mounted = true
        instance.isMounted = true
      } else {
        // 更新
        let { next, bu, u, parent, vnode } = instance
        if (next) {
          next.el = vnode.el
          updateComponentPreRender(instance, next, optimized)
        } else {
          next = vnode
        }
        patch(
          prevTree,
          nextTree,
          // parent may have changed if it's in a teleport
          hostParentNode(prevTree.el!)!,
          // anchor may have changed if it's in a fragment
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          namespace,
        )
      }
    }
    const effect = (instance.effect = new ReactiveEffect(componentUpdateFn))
    const update = (instance.update = effect.run.bind(effect))
    update()
}

function renderComponentRoot(instance: ComponentInternalInstance): VNode {
  const {
    vnode,
    render,
    //...
  } = instance
  // 进行按位与操作后结果不为零 判断是否有状态
  if(vnode.shapeFlag & ShapeFlags.STATEFUL_COMPONENT) {
      result = normalizeVNode(
        render!.call(
          thisProxy,
          proxyToUse!,
          renderCache,
          props,
          setupState,
          data,
          ctx,
        ))
  }
}

class ReactiveEffect{
  constructor(public fn: ()=>T){}
  run(){
    // ...
    return this.fn()
  }
}
```

`update()` 执行实际执行 => `componentUpdateFn` => 执行组件的 `render` 获得 `subTree` => `patch`

这里的关键在于：`renderComponentRoot` 调用组件的 `render` 函数，返回的是组件模板对应的 VNode 树（subTree）。这个 subTree 会再次进入 `patch` 流程，但因为 subTree 的节点类型通常是原生元素（如 `div`、`span`），所以 `patch` 会将其分派到 `processElement` 而非 `processComponent`。

**patch**
```ts
const patch: PatchFn = (
  n1,
  n2,
  container,
  anchor = null,
  parentComponent = null,
  parentSuspense = null,
  namespace = undefined,
  slotScopeIds = null,
  optimized = __DEV__ && isHmrUpdating ? false : !!n2.dynamicChildren,
) => {
  // ...
    processElement(
      n1,
      n2,
      container,
      anchor,
      parentComponent,
      parentSuspense,
      namespace,
      slotScopeIds,
      optimized,
    )
}
```

**processElement**
```ts
const processElement = (
  n1: VNode | null,
  n2: VNode,
  container: RendererElement,
  anchor: RendererNode | null,
  parentComponent: ComponentInternalInstance | null,
  parentSuspense: SuspenseBoundary | null,
  namespace: ElementNamespace,
  slotScopeIds: string[] | null,
  optimized: boolean,
) => {
  if (n2.type === 'svg') {
    namespace = 'svg'
  } else if (n2.type === 'math') {
    namespace = 'mathml'
  }
  if (n1 == null) {
    mountElement(
      n2,
      container,
      anchor,
      parentComponent,
      parentSuspense,
      namespace,
      slotScopeIds,
      optimized,
    )
  } else {
    patchElement(
      n1,
      n2,
      parentComponent,
      parentSuspense,
      namespace,
      slotScopeIds,
      optimized,
    )
  }
}

const mountElement = (
    vnode: VNode,
    container: RendererElement,
    anchor: RendererNode | null,
    parentComponent: ComponentInternalInstance | null,
    parentSuspense: SuspenseBoundary | null,
    namespace: ElementNamespace,
    slotScopeIds: string[] | null,
    optimized: boolean,
) => {
  let el: RendererElement
  el = vnode.el = hostCreateElement(
    vnode.type as string,
    namespace,
    props && props.is,
    props,
  )
  // ...
  hostInsert(el, container, anchor)
}
```

`processElement` 处理原生 DOM 元素。首次挂载时 `n1` 为 `null`，进入 `mountElement`；更新时进入 `patchElement`。`mountElement` 负责创建真实 DOM 元素并插入到容器中。`hostCreateElement` 和 `hostInsert` 是对 DOM API 的封装，最终调用的是 `nodeOps` 中的平台相关方法。

**nodeOps**
```ts
const doc = (typeof document !== 'undefined' ? document : null) as Document
export const nodeOps: Omit<RendererOptions<Node, Element>, 'patchProp'> = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null)
  },

  remove: child => {
    const parent = child.parentNode
    if (parent) {
      parent.removeChild(child)
    }
  },

  createElement: (tag, namespace, is, props): Element => {
    const el =
      namespace === 'svg'
        ? doc.createElementNS(svgNS, tag)
        : namespace === 'mathml'
          ? doc.createElementNS(mathmlNS, tag)
          : is
            ? doc.createElement(tag, { is })
            : doc.createElement(tag)

    if (tag === 'select' && props && props.multiple != null) {
      ;(el as HTMLSelectElement).setAttribute('multiple', props.multiple)
    }

    return el
  }
}
```

`nodeOps` 是渲染器与真实 DOM 之间的桥梁。`createElement` 根据命名空间选择不同的 DOM 创建方式（SVG 使用 `createElementNS`，普通元素使用 `createElement`）。`insert` 调用 `parent.insertBefore` 将子节点插入到指定锚点位置。这种抽象层的设计使得 Vue 可以在不修改核心逻辑的情况下适配不同的渲染目标（如原生渲染、Canvas 渲染等）。

# 总结

整条挂载链路如下：

`createApp` => `mount` => `render` => `patch` =>
`processComponent` => `mountComponent` => `setupRenderEffect` => `patch` =>
`processElement` => `mountElement` => `hostInsert`

各环节的职责：

- `createApp`：确保渲染器创建，返回应用实例；重写 `mount` 方法处理容器标准化
- `mount`：创建根 VNode，调用 `render` 进入渲染流程
- `render`：调用 `patch` 进行新旧节点对比；缓存 VNode 并刷新回调队列
- `patch`：判断 VNode 类型，分派到对应处理函数；首次挂载时进入 `processComponent`
- `processComponent`：首次渲染调用 `mountComponent`，更新时调用 `updateComponent`
- `mountComponent`：创建组件实例，执行 `setupComponent` 初始化 props/slots/setup，调用 `setupRenderEffect`
- `setupRenderEffect`：创建 `ReactiveEffect` 响应式副作用，首次执行时调用 `renderComponentRoot` 获取 subTree，再通过 `patch` 递归处理
- `patch`（第二轮）：subTree 为原生元素类型，分派到 `processElement`
- `processElement`：首次渲染调用 `mountElement`，更新时调用 `patchElement`
- `mountElement`：通过 `hostCreateElement` 创建真实 DOM，通过 `hostInsert` 插入容器
- `hostInsert`：最终调用 `nodeOps.insert`，即 `parent.insertBefore`，完成真实 DOM 的挂载

至此，从 `createApp().mount()` 到真实 DOM 出现在页面上，整条链路已经完整闭环。理解了这个流程，后续阅读 `patch` 的 diff 算法、组件更新机制等内容时，就能清楚地知道每个函数在整个链路中的位置与职责。
