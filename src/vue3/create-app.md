---
title: Vue 3.5 Dom挂载原理
category:
  - Vue
tag: 
  - Vue3
---  

```js
import App from './App.vue'
const app = createApp(App)
app.mount('#app')
```

# createApp

```ts
const createApp = ({...args} => {
  const app = ensureRenderer().crateApp(...args)
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

# mount

`app.mount`
```ts
const createApp = ((...args) => {
  const app = ensureRenderer().crateApp(...args)
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
# render

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
function baseCrateRenderer(options) {
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
# patch

```ts
function baseCreateRenderer(options:RendererOptions){
  const path:PatchFn = (
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
## processComponent

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
### setupRenderEffect
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
`update()`执行实际执行=>`componentUpdateFn`=>执行组件的`render`获得`subTree`=>`patch`

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

# summary

`createApp`=>`mount` => `render` => `patch` => 
`processComponent` => `mountComponent` => `patch` => 
`processElement` => `mouseElement` => `hostInsert`

- `crateApp` 重写mount,获取挂载dom
- `mount` 创建vnode,调用`render`
- `render` 调用`patch`进行diff
- `patch` 判断vnode类型,调用`processComponent`
- `processComponent` 调用`mountComponent`
- `mountComponent` 调用`setupComponent` => `setupRenderEffect`
- `setupRenderEffect` 调用`renderComponent`获取`组件subTree` 进行`patch`
- `patch` 判断vnode类型,调用`processElement`
- `processElement` 调用`mountElement`
- `mountElement` 创建dom,调用`hostInsert`插入dom
- `hostInsert` 调用`nodeOps.insert`插入dom


