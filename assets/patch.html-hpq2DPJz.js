import{_ as a,c as l,a as e,g as p,b as n,o}from"./app-DwrwhhBt.js";const c={};function F(i,s){return o(),l("div",null,[s[0]||(s[0]=e(`<p>组件挂载=&gt;<code>mountComponent</code> =&gt; <code>setupRenderEffect</code></p><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">const</span><span style="color:#50FA7B;"> setupRenderEffect</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> () </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> componentUpdateFn</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> () </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">    // ...</span></span>
<span class="line"><span style="color:#50FA7B;">    patch</span><span style="color:#F8F8F2;">()</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#F8F8F2;"> effect </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (instance.effect </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;font-weight:bold;"> new</span><span style="color:#50FA7B;"> ReactiveEffect</span><span style="color:#F8F8F2;">(componentUpdateFn))</span></span>
<span class="line"><span style="color:#6272A4;">  // ...</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>组件更新 =&gt; <code>trigger</code> =&gt; <code>effect.trigger</code></p><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">class</span><span style="color:#8BE9FD;"> ReactiveEffect</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#50FA7B;">  trigger</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    // 就是运行this.run</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;font-style:italic;">this</span><span style="color:#F8F8F2;">.flags </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> EffectFlags.</span><span style="color:#BD93F9;">PAUSED</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">      pausedQueueEffects.</span><span style="color:#50FA7B;">add</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;font-style:italic;">this</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (</span><span style="color:#BD93F9;font-style:italic;">this</span><span style="color:#F8F8F2;">.scheduler) {</span></span>
<span class="line"><span style="color:#BD93F9;font-style:italic;">      this</span><span style="color:#F8F8F2;">.</span><span style="color:#50FA7B;">scheduler</span><span style="color:#F8F8F2;">()</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#BD93F9;font-style:italic;">      this</span><span style="color:#F8F8F2;">.</span><span style="color:#50FA7B;">runIfDirty</span><span style="color:#F8F8F2;">()</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#50FA7B;">  run</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    // 传入的componentUpdateFn方法 =&gt; patch</span></span>
<span class="line"><span style="color:#BD93F9;font-style:italic;">    this</span><span style="color:#F8F8F2;">.</span><span style="color:#50FA7B;">fn</span><span style="color:#F8F8F2;">()</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="patchflag" tabindex="-1"><a class="header-anchor" href="#patchflag"><span>patchFlag</span></a></h1><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">export</span><span style="color:#FF79C6;"> enum</span><span style="color:#8BE9FD;font-style:italic;"> PatchFlags</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">  // TEXT：表示元素具有动态的 textContent。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;div&gt;{{ dynamicText }}&lt;/div&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  TEXT </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // CLASS：表示元素具有动态的 class。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;div :class=&quot;dynamicClass&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  CLASS </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 1</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // STYLE：表示元素具有动态的 style。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;div :style=&quot;{ color: dynamicColor }&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  STYLE </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 2</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // PROPS：表示元素具有动态的 props。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;div :id=&quot;dynamicId&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  PROPS </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 3</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // FULL_PROPS：表示元素具有动态的 props，并且需要完整的 diff。</span></span>
<span class="line"><span style="color:#F8F8F2;">  FULL_PROPS </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 4</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // HYDRATION：表示元素需要进行 hydration。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;div v-html=&quot;dynamicHtml&quot;&gt;&lt;/div&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  NEED_HYDRATION </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 5</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // STABLE_FRAGMENT：表示元素是一个稳定的 fragment。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;template v-for=&quot;item in items&quot;&gt;&lt;/template&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  STABLE_FRAGMENT </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 6</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // KEYED_FRAGMENT：表示元素是一个带 key 的 fragment。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;template v-for=&quot;item in items&quot; :key=&quot;item.id&quot;&gt;&lt;/template&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  KEYED_FRAGMENT </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 7</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // UNKEYED_FRAGMENT：表示元素是一个不带 key 的 fragment。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;template v-for=&quot;item in items&quot;&gt;&lt;/template&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  UNKEYED_FRAGMENT </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 8</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // NEED_PATCH：表示元素需要进行 patch。，通常对应ref、指令等使用场景。</span></span>
<span class="line"><span style="color:#F8F8F2;">  NEED_PATCH </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 9</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // DYNAMIC_SLOTS：表示元素具有动态的 slots。</span></span>
<span class="line"><span style="color:#6272A4;">  // &lt;component :is=&quot;dynamicComponent&quot; v-slot:default=&quot;slotProps&quot;&gt;&lt;/component&gt;</span></span>
<span class="line"><span style="color:#F8F8F2;">  DYNAMIC_SLOTS </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 10</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // DEV_ROOT_FRAGMENT：表示用户在template的顶层写了注释而创建的flag。</span></span>
<span class="line"><span style="color:#F8F8F2;">  DEV_ROOT_FRAGMENT </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;&lt;</span><span style="color:#BD93F9;"> 11</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // HOISTED：表示提升的静态虚拟节点。patch过程可以跳过整个子树，因为静态内容永远不需要更新。</span></span>
<span class="line"><span style="color:#F8F8F2;">  HOISTED </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">  // 表示diff算法应退出优化模式，通常是对应用户使用h函数自定义渲染函数的情况。</span></span>
<span class="line"><span style="color:#F8F8F2;">  BAIL </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;"> -</span><span style="color:#BD93F9;">2</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="patch" tabindex="-1"><a class="header-anchor" href="#patch"><span>patch</span></a></h1><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">const</span><span style="color:#50FA7B;"> patch</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> PatchFn</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">  n1</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">  n2</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">  container</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  anchor </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  parentComponent </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  parentSuspense </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  namespace </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> undefined</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  slotScopeIds </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  optimized </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> __DEV__ </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> isHmrUpdating </span><span style="color:#FF79C6;">?</span><span style="color:#BD93F9;"> false</span><span style="color:#FF79C6;"> :</span><span style="color:#FF79C6;"> !!</span><span style="color:#F8F8F2;">n2.dynamicChildren,</span></span>
<span class="line"><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">  if</span><span style="color:#F8F8F2;"> (n1 </span><span style="color:#FF79C6;">===</span><span style="color:#F8F8F2;"> n2) {</span></span>
<span class="line"><span style="color:#FF79C6;">    return</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#6272A4;">  // patching &amp; not same type, unmount old tree</span></span>
<span class="line"><span style="color:#FF79C6;">  if</span><span style="color:#F8F8F2;"> (n1 </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#FF79C6;"> !</span><span style="color:#50FA7B;">isSameVNodeType</span><span style="color:#F8F8F2;">(n1, n2)) {</span></span>
<span class="line"><span style="color:#F8F8F2;">    anchor </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> getNextHostNode</span><span style="color:#F8F8F2;">(n1)</span></span>
<span class="line"><span style="color:#50FA7B;">    unmount</span><span style="color:#F8F8F2;">(n1, parentComponent, parentSuspense, </span><span style="color:#BD93F9;">true</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">    n1 </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> null</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#FF79C6;">  if</span><span style="color:#F8F8F2;"> (n2.patchFlag </span><span style="color:#FF79C6;">===</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">BAIL</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">    optimized </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> false</span></span>
<span class="line"><span style="color:#F8F8F2;">    n2.dynamicChildren </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> null</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#F8F8F2;"> { type, ref, shapeFlag } </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2</span></span>
<span class="line"><span style="color:#FF79C6;">  switch</span><span style="color:#F8F8F2;"> (type) {</span></span>
<span class="line"><span style="color:#6272A4;">    // 纯文本</span></span>
<span class="line"><span style="color:#FF79C6;">    case</span><span style="color:#F8F8F2;"> Text:</span></span>
<span class="line"><span style="color:#50FA7B;">      processText</span><span style="color:#F8F8F2;">(n1, n2, container, anchor)</span></span>
<span class="line"><span style="color:#FF79C6;">      break</span></span>
<span class="line"><span style="color:#6272A4;">      // 注释</span></span>
<span class="line"><span style="color:#FF79C6;">    case</span><span style="color:#F8F8F2;"> Comment:</span></span>
<span class="line"><span style="color:#50FA7B;">      processCommentNode</span><span style="color:#F8F8F2;">(n1, n2, container, anchor)</span></span>
<span class="line"><span style="color:#FF79C6;">      break</span></span>
<span class="line"><span style="color:#6272A4;">      // 静态</span></span>
<span class="line"><span style="color:#FF79C6;">    case</span><span style="color:#F8F8F2;"> Static:</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (n1 </span><span style="color:#FF79C6;">==</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">        mountStaticNode</span><span style="color:#F8F8F2;">(n2, container, anchor, namespace)</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#FF79C6;">      break</span></span>
<span class="line"><span style="color:#6272A4;">      // 多个根节点</span></span>
<span class="line"><span style="color:#FF79C6;">    case</span><span style="color:#F8F8F2;"> Fragment:</span></span>
<span class="line"><span style="color:#50FA7B;">      processFragment</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">        n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">        container,</span></span>
<span class="line"><span style="color:#F8F8F2;">        anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">        namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">        optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#FF79C6;">      break</span></span>
<span class="line"><span style="color:#FF79C6;">    default</span><span style="color:#F8F8F2;">:</span></span>
<span class="line"><span style="color:#6272A4;">      // 原生DOM</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">ELEMENT</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">        processElement</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#6272A4;">        // Vue组件</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">COMPONENT</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">        processComponent</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#6272A4;">        // teleport组件</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">TELEPORT</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">        ;(type </span><span style="color:#FF79C6;">as</span><span style="color:#FF79C6;"> typeof</span><span style="color:#F8F8F2;"> TeleportImpl).</span><span style="color:#50FA7B;">process</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n1 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> TeleportVNode</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> TeleportVNode</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">          internals,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#6272A4;">        // suspense组件</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (__FEATURE_SUSPENSE__ </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">SUSPENSE</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">        ;(type </span><span style="color:#FF79C6;">as</span><span style="color:#FF79C6;"> typeof</span><span style="color:#F8F8F2;"> SuspenseImpl).</span><span style="color:#50FA7B;">process</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">          internals,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (__DEV__) {</span></span>
<span class="line"><span style="color:#50FA7B;">        warn</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">Invalid VNode type:</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">, type, </span><span style="color:#F1FA8C;">\`(</span><span style="color:#FF79C6;">\${</span><span style="color:#FF79C6;">typeof</span><span style="color:#F8F8F2;"> type</span><span style="color:#FF79C6;">}</span><span style="color:#F1FA8C;">)\`</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#6272A4;">  // set ref</span></span>
<span class="line"><span style="color:#FF79C6;">  if</span><span style="color:#F8F8F2;"> (ref </span><span style="color:#FF79C6;">!=</span><span style="color:#BD93F9;"> null</span><span style="color:#FF79C6;"> &amp;&amp;</span><span style="color:#F8F8F2;"> parentComponent) {</span></span>
<span class="line"><span style="color:#50FA7B;">    setRef</span><span style="color:#F8F8F2;">(ref, n1 </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> n1.ref, parentSuspense, n2 </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> n1, </span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">n2)</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="processtext" tabindex="-1"><a class="header-anchor" href="#processtext"><span>processText</span></a></h2><p>纯文本</p><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> processText</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ProcessTextOrCommentFn</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span><span style="color:#FFB86C;font-style:italic;">n1</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">n2</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">container</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">anchor</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (n1 </span><span style="color:#FF79C6;">==</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">      hostInsert</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#6272A4;">        // hostCreateText = createText </span></span>
<span class="line"><span style="color:#6272A4;">        // createText: text =&gt; doc.createTextNode(text),</span></span>
<span class="line"><span style="color:#F8F8F2;">        (n2.el </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> hostCreateText</span><span style="color:#F8F8F2;">(n2.children </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">)),</span></span>
<span class="line"><span style="color:#F8F8F2;">        container,</span></span>
<span class="line"><span style="color:#F8F8F2;">        anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">      // hostSetText = setText </span></span>
<span class="line"><span style="color:#6272A4;">      // setText: textNode,text =&gt; textNode.nodeValue = text,</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> el </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (n2.el </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1.el</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (n2.children </span><span style="color:#FF79C6;">!==</span><span style="color:#F8F8F2;"> n1.children) {</span></span>
<span class="line"><span style="color:#50FA7B;">        hostSetText</span><span style="color:#F8F8F2;">(el, n2.children </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="processcomponent" tabindex="-1"><a class="header-anchor" href="#processcomponent"><span>processComponent</span></a></h2><p>Vue组件</p><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> processComponent</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n1</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n2</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    container</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererElement</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    anchor</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererNode</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentComponent</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ComponentInternalInstance</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentSuspense</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> SuspenseBoundary</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    namespace</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ElementNamespace</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    slotScopeIds</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">[] </span><span style="color:#FF79C6;">|</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    optimized</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> boolean</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  ) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">    n2.slotScopeIds </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> slotScopeIds</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (n1 </span><span style="color:#FF79C6;">==</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">      // keep alive 组件</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (n2.shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">COMPONENT_KEPT_ALIVE</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">        ;(parentComponent</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">.ctx </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> KeepAliveContext</span><span style="color:#F8F8F2;">).</span><span style="color:#50FA7B;">activate</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#50FA7B;">        mountComponent</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#50FA7B;">      updateComponent</span><span style="color:#F8F8F2;">(n1, n2, optimized)</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> updateComponent</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span><span style="color:#FFB86C;font-style:italic;">n1</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">n2</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">optimized</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> boolean</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> instance </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (n2.component </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1.component)</span><span style="color:#FF79C6;">!</span></span>
<span class="line"><span style="color:#6272A4;">    // 根据新旧虚拟节点VNode上的属性、指令、子节点等判断是否需要更新组件</span></span>
<span class="line"><span style="color:#6272A4;">    //  optimized 参数用于设置是否开启 diff 优化</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (</span><span style="color:#50FA7B;">shouldUpdateComponent</span><span style="color:#F8F8F2;">(n1, n2, optimized)) {</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#F8F8F2;">        __FEATURE_SUSPENSE__ </span><span style="color:#FF79C6;">&amp;&amp;</span></span>
<span class="line"><span style="color:#F8F8F2;">        instance.asyncDep </span><span style="color:#FF79C6;">&amp;&amp;</span></span>
<span class="line"><span style="color:#FF79C6;">        !</span><span style="color:#F8F8F2;">instance.asyncResolved</span></span>
<span class="line"><span style="color:#F8F8F2;">      ) {</span></span>
<span class="line"><span style="color:#6272A4;">        //异步组件，预更新组件</span></span>
<span class="line"><span style="color:#50FA7B;">        updateComponentPreRender</span><span style="color:#F8F8F2;">(instance, n2, optimized)</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">        //  更新对应组件实例的 next 为新的 VNode</span></span>
<span class="line"><span style="color:#F8F8F2;">        instance.next </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2</span></span>
<span class="line"><span style="color:#6272A4;">        // 触发更新</span></span>
<span class="line"><span style="color:#F8F8F2;">        instance.</span><span style="color:#50FA7B;">update</span><span style="color:#F8F8F2;">()</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">      // no update needed. just copy over properties</span></span>
<span class="line"><span style="color:#F8F8F2;">      n2.el </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1.el</span></span>
<span class="line"><span style="color:#F8F8F2;">      instance.vnode </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="instance-update" tabindex="-1"><a class="header-anchor" href="#instance-update"><span>instance.update</span></a></h3><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> effect </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (instance.effect </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;font-weight:bold;"> new</span><span style="color:#50FA7B;"> ReactiveEffect</span><span style="color:#F8F8F2;">(componentUpdateFn))</span></span>
<span class="line"><span style="color:#F8F8F2;">instance.update </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> effect.run.</span><span style="color:#50FA7B;">bind</span><span style="color:#F8F8F2;">(effect)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">class</span><span style="color:#8BE9FD;"> ReactiveEffect</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#FF79C6;">  constructor</span><span style="color:#F8F8F2;">(</span><span style="color:#FF79C6;">public</span><span style="color:#50FA7B;"> fn</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> () </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#8BE9FD;font-style:italic;"> T</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#50FA7B;">  run</span><span style="color:#F8F8F2;">(){</span></span>
<span class="line"><span style="color:#6272A4;">    // fn = componentUpdateFn</span></span>
<span class="line"><span style="color:#BD93F9;font-style:italic;">    this</span><span style="color:#F8F8F2;">.</span><span style="color:#50FA7B;">fn</span><span style="color:#F8F8F2;">()</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#FF79C6;">const</span><span style="color:#50FA7B;"> componentUpdateFn</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> () </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">  if</span><span style="color:#F8F8F2;">(</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">instance.isMounted){</span></span>
<span class="line"><span style="color:#6272A4;">    // ...</span></span>
<span class="line"><span style="color:#6272A4;">      // return normalizeVNode(...)</span></span>
<span class="line"><span style="color:#F8F8F2;">      instance.subTree </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> renderComponentRoot</span><span style="color:#F8F8F2;">(instance)</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">    // ...</span></span>
<span class="line"><span style="color:#50FA7B;">      toggleRecurse</span><span style="color:#F8F8F2;">(instance, </span><span style="color:#BD93F9;">false</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (next) {</span></span>
<span class="line"><span style="color:#F8F8F2;">        next.el </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> vnode.el</span></span>
<span class="line"><span style="color:#6272A4;">        // 更新props,slots</span></span>
<span class="line"><span style="color:#50FA7B;">        updateComponentPreRender</span><span style="color:#F8F8F2;">(instance, next, optimized)</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">        next </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> vnode</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#50FA7B;">      patch</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        prevTree,</span></span>
<span class="line"><span style="color:#F8F8F2;">        nextTree,</span></span>
<span class="line"><span style="color:#6272A4;">        // parent may have changed if it&#39;s in a teleport</span></span>
<span class="line"><span style="color:#50FA7B;">        hostParentNode</span><span style="color:#F8F8F2;">(prevTree.el</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">)</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#6272A4;">        // anchor may have changed if it&#39;s in a fragment</span></span>
<span class="line"><span style="color:#50FA7B;">        getNextHostNode</span><span style="color:#F8F8F2;">(prevTree),</span></span>
<span class="line"><span style="color:#F8F8F2;">        instance,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">        namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#6272A4;">      //... </span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="processelement" tabindex="-1"><a class="header-anchor" href="#processelement"><span>processElement</span></a></h2><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> processElement</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n1</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n2</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    container</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererElement</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    anchor</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererNode</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentComponent</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ComponentInternalInstance</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentSuspense</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> SuspenseBoundary</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    namespace</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ElementNamespace</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    slotScopeIds</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">[] </span><span style="color:#FF79C6;">|</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    optimized</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> boolean</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  ) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (n2.type </span><span style="color:#FF79C6;">===</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">svg</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">      namespace </span><span style="color:#FF79C6;">=</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">svg</span><span style="color:#E9F284;">&#39;</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (n2.type </span><span style="color:#FF79C6;">===</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">math</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">      namespace </span><span style="color:#FF79C6;">=</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">mathml</span><span style="color:#E9F284;">&#39;</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (n1 </span><span style="color:#FF79C6;">==</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">      mountElement</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">        container,</span></span>
<span class="line"><span style="color:#F8F8F2;">        anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">        namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">        optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#50FA7B;">      patchElement</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">        n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">        namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">        optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> patchElement</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n1</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n2</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentComponent</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ComponentInternalInstance</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentSuspense</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> SuspenseBoundary</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    namespace</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ElementNamespace</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    slotScopeIds</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">[] </span><span style="color:#FF79C6;">|</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    optimized</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> boolean</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  ) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> el </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (n2.el </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1.el</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">    let</span><span style="color:#F8F8F2;"> { patchFlag, dynamicChildren, dirs } </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2</span></span>
<span class="line"><span style="color:#6272A4;">    // #1426 take the old vnode&#39;s patch flag into account since user may clone a</span></span>
<span class="line"><span style="color:#6272A4;">    // compiler-generated vnode, which de-opts to FULL_PROPS</span></span>
<span class="line"><span style="color:#F8F8F2;">    patchFlag </span><span style="color:#FF79C6;">|=</span><span style="color:#F8F8F2;"> n1.patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">FULL_PROPS</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> oldProps </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1.props </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> EMPTY_OBJ</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> newProps </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2.props </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> EMPTY_OBJ</span></span>
<span class="line"><span style="color:#FF79C6;">    let</span><span style="color:#F8F8F2;"> vnodeHook</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNodeHook</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> undefined</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // disable recurse in beforeUpdate hooks</span></span>
<span class="line"><span style="color:#F8F8F2;">    parentComponent </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#50FA7B;"> toggleRecurse</span><span style="color:#F8F8F2;">(parentComponent, </span><span style="color:#BD93F9;">false</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> ((vnodeHook </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> newProps.onVnodeBeforeUpdate)) {</span></span>
<span class="line"><span style="color:#50FA7B;">      invokeVNodeHook</span><span style="color:#F8F8F2;">(vnodeHook, parentComponent, n2, n1)</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (dirs) {</span></span>
<span class="line"><span style="color:#50FA7B;">      invokeDirectiveHook</span><span style="color:#F8F8F2;">(n2, n1, parentComponent, </span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">beforeUpdate</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">    parentComponent </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#50FA7B;"> toggleRecurse</span><span style="color:#F8F8F2;">(parentComponent, </span><span style="color:#BD93F9;">true</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // #9135 innerHTML / textContent unset needs to happen before possible</span></span>
<span class="line"><span style="color:#6272A4;">    // new children mount</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#F8F8F2;">      (oldProps.innerHTML </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> newProps.innerHTML </span><span style="color:#FF79C6;">==</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">||</span></span>
<span class="line"><span style="color:#F8F8F2;">      (oldProps.textContent </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> newProps.textContent </span><span style="color:#FF79C6;">==</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">    ) {</span></span>
<span class="line"><span style="color:#50FA7B;">      hostSetElementText</span><span style="color:#F8F8F2;">(el, </span><span style="color:#E9F284;">&#39;&#39;</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#6272A4;">     // 存在动态子节点，对动态子节点执行 diff 过程</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (dynamicChildren) {</span></span>
<span class="line"><span style="color:#50FA7B;">      patchBlockChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        n1.dynamicChildren</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">        dynamicChildren,</span></span>
<span class="line"><span style="color:#F8F8F2;">        el,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#50FA7B;">        resolveChildrenNamespace</span><span style="color:#F8F8F2;">(n2, namespace),</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">optimized) {</span></span>
<span class="line"><span style="color:#6272A4;">      // full diff</span></span>
<span class="line"><span style="color:#50FA7B;">      patchChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">        n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">        el,</span></span>
<span class="line"><span style="color:#BD93F9;">        null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#50FA7B;">        resolveChildrenNamespace</span><span style="color:#F8F8F2;">(n2, namespace),</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#BD93F9;">        false</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // 处理属性和文本更新</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&gt;</span><span style="color:#BD93F9;"> 0</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">FULL_PROPS</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">        // element props contain dynamic keys, full diff needed</span></span>
<span class="line"><span style="color:#50FA7B;">        patchProps</span><span style="color:#F8F8F2;">(el, oldProps, newProps, parentComponent, namespace)</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">        // class</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">CLASS</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">          if</span><span style="color:#F8F8F2;"> (oldProps.class </span><span style="color:#FF79C6;">!==</span><span style="color:#F8F8F2;"> newProps.class) {</span></span>
<span class="line"><span style="color:#50FA7B;">            hostPatchProp</span><span style="color:#F8F8F2;">(el, </span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">class</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;">null</span><span style="color:#F8F8F2;">, newProps.class, namespace)</span></span>
<span class="line"><span style="color:#F8F8F2;">          }</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">        // style</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">STYLE</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">          hostPatchProp</span><span style="color:#F8F8F2;">(el, </span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">style</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">, oldProps.style, newProps.style, namespace)</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">PROPS</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">          const</span><span style="color:#F8F8F2;"> propsToUpdate </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2.dynamicProps</span><span style="color:#FF79C6;">!</span></span>
<span class="line"><span style="color:#FF79C6;">          for</span><span style="color:#F8F8F2;"> (</span><span style="color:#FF79C6;">let</span><span style="color:#F8F8F2;"> i </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0</span><span style="color:#F8F8F2;">; i </span><span style="color:#FF79C6;">&lt;</span><span style="color:#F8F8F2;"> propsToUpdate.length; i</span><span style="color:#FF79C6;">++</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">            const</span><span style="color:#F8F8F2;"> key </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> propsToUpdate[i]</span></span>
<span class="line"><span style="color:#FF79C6;">            const</span><span style="color:#F8F8F2;"> prev </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> oldProps[key]</span></span>
<span class="line"><span style="color:#FF79C6;">            const</span><span style="color:#F8F8F2;"> next </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> newProps[key]</span></span>
<span class="line"><span style="color:#6272A4;">            // #1471 force patch value</span></span>
<span class="line"><span style="color:#FF79C6;">            if</span><span style="color:#F8F8F2;"> (next </span><span style="color:#FF79C6;">!==</span><span style="color:#F8F8F2;"> prev </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> key </span><span style="color:#FF79C6;">===</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">value</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">              hostPatchProp</span><span style="color:#F8F8F2;">(el, key, prev, next, namespace, parentComponent)</span></span>
<span class="line"><span style="color:#F8F8F2;">            }</span></span>
<span class="line"><span style="color:#F8F8F2;">          }</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">      // text</span></span>
<span class="line"><span style="color:#6272A4;">      // This flag is matched when the element has only dynamic text children.</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">TEXT</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (n1.children </span><span style="color:#FF79C6;">!==</span><span style="color:#F8F8F2;"> n2.children) {</span></span>
<span class="line"><span style="color:#50FA7B;">          hostSetElementText</span><span style="color:#F8F8F2;">(el, n2.children </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">optimized </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> dynamicChildren </span><span style="color:#FF79C6;">==</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">      // unoptimized, full diff</span></span>
<span class="line"><span style="color:#50FA7B;">      patchProps</span><span style="color:#F8F8F2;">(el, oldProps, newProps, parentComponent, namespace)</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> ((vnodeHook </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> newProps.onVnodeUpdated) </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> dirs) {</span></span>
<span class="line"><span style="color:#50FA7B;">      queuePostRenderEffect</span><span style="color:#F8F8F2;">(() </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">        vnodeHook </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#50FA7B;"> invokeVNodeHook</span><span style="color:#F8F8F2;">(vnodeHook, parentComponent, n2, n1)</span></span>
<span class="line"><span style="color:#F8F8F2;">        dirs </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#50FA7B;"> invokeDirectiveHook</span><span style="color:#F8F8F2;">(n2, n1, parentComponent, </span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">updated</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">      }, parentSuspense)</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="patchblockchildren" tabindex="-1"><a class="header-anchor" href="#patchblockchildren"><span>patchBlockChildren</span></a></h3><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> patchBlockChildren</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> PatchBlockChildrenFn</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    oldChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    newChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    fallbackContainer</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentComponent</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentSuspense</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    namespace</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ElementNamespace</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    slotScopeIds</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  ) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">    for</span><span style="color:#F8F8F2;"> (</span><span style="color:#FF79C6;">let</span><span style="color:#F8F8F2;"> i </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0</span><span style="color:#F8F8F2;">; i </span><span style="color:#FF79C6;">&lt;</span><span style="color:#F8F8F2;"> newChildren.length; i</span><span style="color:#FF79C6;">++</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> oldVNode </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> oldChildren[i]</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> newVNode </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> newChildren[i]</span></span>
<span class="line"><span style="color:#6272A4;">      // Determine the container (parent element) for the patch.</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> container </span><span style="color:#FF79C6;">=</span></span>
<span class="line"><span style="color:#6272A4;">        // oldVNode may be an errored async setup() component inside Suspense</span></span>
<span class="line"><span style="color:#6272A4;">        // which will not have a mounted element</span></span>
<span class="line"><span style="color:#F8F8F2;">        oldVNode.el </span><span style="color:#FF79C6;">&amp;&amp;</span></span>
<span class="line"><span style="color:#6272A4;">        // - In the case of a Fragment, we need to provide the actual parent</span></span>
<span class="line"><span style="color:#6272A4;">        // of the Fragment itself so it can move its children.</span></span>
<span class="line"><span style="color:#F8F8F2;">        (oldVNode.type </span><span style="color:#FF79C6;">===</span><span style="color:#F8F8F2;"> Fragment </span><span style="color:#FF79C6;">||</span></span>
<span class="line"><span style="color:#6272A4;">          // - In the case of different nodes, there is going to be a replacement</span></span>
<span class="line"><span style="color:#6272A4;">          // which also requires the correct parent container</span></span>
<span class="line"><span style="color:#FF79C6;">          !</span><span style="color:#50FA7B;">isSameVNodeType</span><span style="color:#F8F8F2;">(oldVNode, newVNode) </span><span style="color:#FF79C6;">||</span></span>
<span class="line"><span style="color:#6272A4;">          // - In the case of a component, it could contain anything.</span></span>
<span class="line"><span style="color:#F8F8F2;">          oldVNode.shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> (ShapeFlags.</span><span style="color:#BD93F9;">COMPONENT</span><span style="color:#FF79C6;"> |</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">TELEPORT</span><span style="color:#F8F8F2;">))</span></span>
<span class="line"><span style="color:#FF79C6;">          ?</span><span style="color:#50FA7B;"> hostParentNode</span><span style="color:#F8F8F2;">(oldVNode.el)</span><span style="color:#FF79C6;">!</span></span>
<span class="line"><span style="color:#FF79C6;">          :</span><span style="color:#6272A4;"> // In other cases, the parent container is not actually used so we</span></span>
<span class="line"><span style="color:#6272A4;">            // just pass the block element here to avoid a DOM parentNode call.</span></span>
<span class="line"><span style="color:#F8F8F2;">            fallbackContainer</span></span>
<span class="line"><span style="color:#50FA7B;">      patch</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        oldVNode,</span></span>
<span class="line"><span style="color:#F8F8F2;">        newVNode,</span></span>
<span class="line"><span style="color:#F8F8F2;">        container,</span></span>
<span class="line"><span style="color:#BD93F9;">        null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">        namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#BD93F9;">        true</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="processfragment" tabindex="-1"><a class="header-anchor" href="#processfragment"><span>processFragment</span></a></h2><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> processFragment</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n1</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n2</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    container</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererElement</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    anchor</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererNode</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentComponent</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ComponentInternalInstance</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentSuspense</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> SuspenseBoundary</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    namespace</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ElementNamespace</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    slotScopeIds</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">[] </span><span style="color:#FF79C6;">|</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    optimized</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> boolean</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  ) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> fragmentStartAnchor </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (n2.el </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1 </span><span style="color:#FF79C6;">?</span><span style="color:#F8F8F2;"> n1.el </span><span style="color:#FF79C6;">:</span><span style="color:#50FA7B;"> hostCreateText</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;&#39;</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">!</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> fragmentEndAnchor </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (n2.anchor </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1 </span><span style="color:#FF79C6;">?</span><span style="color:#F8F8F2;"> n1.anchor </span><span style="color:#FF79C6;">:</span><span style="color:#50FA7B;"> hostCreateText</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;&#39;</span><span style="color:#F8F8F2;">))</span><span style="color:#FF79C6;">!</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    let</span><span style="color:#F8F8F2;"> { patchFlag, dynamicChildren, slotScopeIds</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> fragmentSlotScopeIds } </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // check if this is a slot fragment with :slotted scope ids</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (fragmentSlotScopeIds) {</span></span>
<span class="line"><span style="color:#F8F8F2;">      slotScopeIds </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> slotScopeIds</span></span>
<span class="line"><span style="color:#FF79C6;">        ?</span><span style="color:#F8F8F2;"> slotScopeIds.</span><span style="color:#50FA7B;">concat</span><span style="color:#F8F8F2;">(fragmentSlotScopeIds)</span></span>
<span class="line"><span style="color:#FF79C6;">        :</span><span style="color:#F8F8F2;"> fragmentSlotScopeIds</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (n1 </span><span style="color:#FF79C6;">==</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">      hostInsert</span><span style="color:#F8F8F2;">(fragmentStartAnchor, container, anchor)</span></span>
<span class="line"><span style="color:#50FA7B;">      hostInsert</span><span style="color:#F8F8F2;">(fragmentEndAnchor, container, anchor)</span></span>
<span class="line"><span style="color:#6272A4;">      // a fragment can only have array children</span></span>
<span class="line"><span style="color:#6272A4;">      // since they are either generated by the compiler, or implicitly created</span></span>
<span class="line"><span style="color:#6272A4;">      // from arrays.</span></span>
<span class="line"><span style="color:#50FA7B;">      mountChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#6272A4;">        // #10007</span></span>
<span class="line"><span style="color:#6272A4;">        // such fragment like \`&lt;&gt;&lt;/&gt;\` will be compiled into</span></span>
<span class="line"><span style="color:#6272A4;">        // a fragment which doesn&#39;t have a children.</span></span>
<span class="line"><span style="color:#6272A4;">        // In this case fallback to an empty array</span></span>
<span class="line"><span style="color:#F8F8F2;">        (n2.children </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> []) </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNodeArrayChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">        container,</span></span>
<span class="line"><span style="color:#F8F8F2;">        fragmentEndAnchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">        namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">        optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#F8F8F2;">        patchFlag </span><span style="color:#FF79C6;">&gt;</span><span style="color:#BD93F9;"> 0</span><span style="color:#FF79C6;"> &amp;&amp;</span></span>
<span class="line"><span style="color:#F8F8F2;">        patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">STABLE_FRAGMENT</span><span style="color:#FF79C6;"> &amp;&amp;</span></span>
<span class="line"><span style="color:#F8F8F2;">        dynamicChildren </span><span style="color:#FF79C6;">&amp;&amp;</span></span>
<span class="line"><span style="color:#6272A4;">        // #2715 the previous fragment could&#39;ve been a BAILed one as a result</span></span>
<span class="line"><span style="color:#6272A4;">        // of renderSlot() with no valid children</span></span>
<span class="line"><span style="color:#F8F8F2;">        n1.dynamicChildren</span></span>
<span class="line"><span style="color:#F8F8F2;">      ) {</span></span>
<span class="line"><span style="color:#6272A4;">        // a stable fragment (template root or &lt;template v-for&gt;) doesn&#39;t need to</span></span>
<span class="line"><span style="color:#6272A4;">        // patch children order, but it may contain dynamicChildren.</span></span>
<span class="line"><span style="color:#50FA7B;">        patchBlockChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n1.dynamicChildren,</span></span>
<span class="line"><span style="color:#F8F8F2;">          dynamicChildren,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">       if</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#6272A4;">          // #2080 if the stable fragment has a key, it&#39;s a &lt;template v-for&gt; that may</span></span>
<span class="line"><span style="color:#6272A4;">          //  get moved around. Make sure all root level vnodes inherit el.</span></span>
<span class="line"><span style="color:#6272A4;">          // #2134 or if it&#39;s a component root, it may also get moved around</span></span>
<span class="line"><span style="color:#6272A4;">          // as the component is being moved.</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2.key </span><span style="color:#FF79C6;">!=</span><span style="color:#BD93F9;"> null</span><span style="color:#FF79C6;"> ||</span></span>
<span class="line"><span style="color:#F8F8F2;">          (parentComponent </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> n2 </span><span style="color:#FF79C6;">===</span><span style="color:#F8F8F2;"> parentComponent.subTree)</span></span>
<span class="line"><span style="color:#F8F8F2;">        ) {</span></span>
<span class="line"><span style="color:#50FA7B;">          traverseStaticChildren</span><span style="color:#F8F8F2;">(n1, n2, </span><span style="color:#BD93F9;">true</span><span style="color:#6272A4;"> /* shallow */</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">        // keyed / unkeyed, or manual fragments.</span></span>
<span class="line"><span style="color:#6272A4;">        // for keyed &amp; unkeyed, since they are compiler generated from v-for,</span></span>
<span class="line"><span style="color:#6272A4;">        // each child is guaranteed to be a block so the fragment will never</span></span>
<span class="line"><span style="color:#6272A4;">        // have dynamicChildren.</span></span>
<span class="line"><span style="color:#50FA7B;">        patchChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          fragmentEndAnchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="patchchildren" tabindex="-1"><a class="header-anchor" href="#patchchildren"><span>patchChildren</span></a></h1><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> patchChildren</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> PatchChildrenFn</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n1</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    n2</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    container</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    anchor</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentComponent</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentSuspense</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    namespace</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ElementNamespace</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    slotScopeIds</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">    optimized </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> false</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  ) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> c1 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1 </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> n1.children</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> prevShapeFlag </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n1 </span><span style="color:#FF79C6;">?</span><span style="color:#F8F8F2;"> n1.shapeFlag </span><span style="color:#FF79C6;">:</span><span style="color:#BD93F9;"> 0</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> c2 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2.children</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> { patchFlag, shapeFlag } </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> n2</span></span>
<span class="line"><span style="color:#6272A4;">    // fast path</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&gt;</span><span style="color:#BD93F9;"> 0</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">KEYED_FRAGMENT</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">        // this could be either fully-keyed or mixed (some keyed some not)</span></span>
<span class="line"><span style="color:#6272A4;">        // presence of patchFlag means children are guaranteed to be arrays</span></span>
<span class="line"><span style="color:#50FA7B;">        patchKeyedChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          c1 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">[],</span></span>
<span class="line"><span style="color:#F8F8F2;">          c2 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNodeArrayChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (patchFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> PatchFlags.</span><span style="color:#BD93F9;">UNKEYED_FRAGMENT</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">        // unkeyed</span></span>
<span class="line"><span style="color:#50FA7B;">        patchUnkeyedChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          c1 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">[],</span></span>
<span class="line"><span style="color:#F8F8F2;">          c2 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNodeArrayChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#F8F8F2;">          anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#FF79C6;">        return</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // children has 3 possibilities: text, array or no children.</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">TEXT_CHILDREN</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">      // text children fast path</span></span>
<span class="line"><span style="color:#6272A4;">      // 旧子节点是数组，则卸载旧子节点</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (prevShapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">ARRAY_CHILDREN</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">        unmountChildren</span><span style="color:#F8F8F2;">(c1 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">[], parentComponent, parentSuspense)</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#6272A4;">      // // 子节点是文本节点，新旧文本不一致时，直接更新</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (c2 </span><span style="color:#FF79C6;">!==</span><span style="color:#F8F8F2;"> c1) {</span></span>
<span class="line"><span style="color:#50FA7B;">        hostSetElementText</span><span style="color:#F8F8F2;">(container, c2 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">      // children is array (either full array or empty array)</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (prevShapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">ARRAY_CHILDREN</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">        // prev children was array</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">ARRAY_CHILDREN</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">          // two arrays, cannot assume anything, do full diff</span></span>
<span class="line"><span style="color:#50FA7B;">          patchKeyedChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">            c1 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">[],</span></span>
<span class="line"><span style="color:#F8F8F2;">            c2 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNodeArrayChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">            container,</span></span>
<span class="line"><span style="color:#F8F8F2;">            anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">            namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">            slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">            optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">          )</span></span>
<span class="line"><span style="color:#F8F8F2;">        } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">          // no new children, just unmount old</span></span>
<span class="line"><span style="color:#50FA7B;">          unmountChildren</span><span style="color:#F8F8F2;">(c1 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">[], parentComponent, parentSuspense, </span><span style="color:#BD93F9;">true</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">        // prev children was text OR null</span></span>
<span class="line"><span style="color:#6272A4;">        // new children is array OR null</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (prevShapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">TEXT_CHILDREN</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">          hostSetElementText</span><span style="color:#F8F8F2;">(container, </span><span style="color:#E9F284;">&#39;&#39;</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#6272A4;">        // mount new if array</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (shapeFlag </span><span style="color:#FF79C6;">&amp;</span><span style="color:#F8F8F2;"> ShapeFlags.</span><span style="color:#BD93F9;">ARRAY_CHILDREN</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#50FA7B;">          mountChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">            c2 </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNodeArrayChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">            container,</span></span>
<span class="line"><span style="color:#F8F8F2;">            anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">            namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">            slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">            optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">          )</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="patchkeyedchildren" tabindex="-1"><a class="header-anchor" href="#patchkeyedchildren"><span>patchKeyedChildren</span></a></h2><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#6272A4;">  // can be all-keyed or mixed</span></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> patchKeyedChildren</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    c1</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">[],</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    c2</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNodeArrayChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    container</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererElement</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentAnchor</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererNode</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentComponent</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ComponentInternalInstance</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentSuspense</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> SuspenseBoundary</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    namespace</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ElementNamespace</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    slotScopeIds</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">[] </span><span style="color:#FF79C6;">|</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    optimized</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> boolean</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  ) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">    let</span><span style="color:#F8F8F2;"> i </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> l2 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c2.length</span></span>
<span class="line"><span style="color:#FF79C6;">    let</span><span style="color:#F8F8F2;"> e1 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c1.length </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1</span><span style="color:#6272A4;"> // prev ending index</span></span>
<span class="line"><span style="color:#FF79C6;">    let</span><span style="color:#F8F8F2;"> e2 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> l2 </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1</span><span style="color:#6272A4;"> // next ending index</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // 1. sync from start</span></span>
<span class="line"><span style="color:#6272A4;">    // 相同的前置节点</span></span>
<span class="line"><span style="color:#6272A4;">    // (a b) c</span></span>
<span class="line"><span style="color:#6272A4;">    // (a b) d e</span></span>
<span class="line"><span style="color:#FF79C6;">    while</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e1 </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e2) {</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> n1 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c1[i]</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> n2 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (c2[i] </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> optimized</span></span>
<span class="line"><span style="color:#FF79C6;">        ?</span><span style="color:#50FA7B;"> cloneIfMounted</span><span style="color:#F8F8F2;">(c2[i] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">        :</span><span style="color:#50FA7B;"> normalizeVNode</span><span style="color:#F8F8F2;">(c2[i]))</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (</span><span style="color:#50FA7B;">isSameVNodeType</span><span style="color:#F8F8F2;">(n1, n2)) {</span></span>
<span class="line"><span style="color:#50FA7B;">        patch</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#BD93F9;">          null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">        // 遇到不同的节点，跳出循环</span></span>
<span class="line"><span style="color:#FF79C6;">        break</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">      i</span><span style="color:#FF79C6;">++</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // 2. sync from end</span></span>
<span class="line"><span style="color:#6272A4;">    // 相同的后置节点</span></span>
<span class="line"><span style="color:#6272A4;">    // a (b c)</span></span>
<span class="line"><span style="color:#6272A4;">    // d e (b c)</span></span>
<span class="line"><span style="color:#FF79C6;">    while</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e1 </span><span style="color:#FF79C6;">&amp;&amp;</span><span style="color:#F8F8F2;"> i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e2) {</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> n1 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c1[e1]</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> n2 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (c2[e2] </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> optimized</span></span>
<span class="line"><span style="color:#FF79C6;">        ?</span><span style="color:#50FA7B;"> cloneIfMounted</span><span style="color:#F8F8F2;">(c2[e2] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">        :</span><span style="color:#50FA7B;"> normalizeVNode</span><span style="color:#F8F8F2;">(c2[e2]))</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (</span><span style="color:#50FA7B;">isSameVNodeType</span><span style="color:#F8F8F2;">(n1, n2)) {</span></span>
<span class="line"><span style="color:#50FA7B;">        patch</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">          n1,</span></span>
<span class="line"><span style="color:#F8F8F2;">          n2,</span></span>
<span class="line"><span style="color:#F8F8F2;">          container,</span></span>
<span class="line"><span style="color:#BD93F9;">          null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">          parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">          namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">          slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">          optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        )</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">        break</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">      e1</span><span style="color:#FF79C6;">--</span></span>
<span class="line"><span style="color:#F8F8F2;">      e2</span><span style="color:#FF79C6;">--</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // 3. common sequence + mount</span></span>
<span class="line"><span style="color:#6272A4;">    // 新增节点的情况</span></span>
<span class="line"><span style="color:#6272A4;">    // (a b)</span></span>
<span class="line"><span style="color:#6272A4;">    // (a b) c</span></span>
<span class="line"><span style="color:#6272A4;">    // i = 2, e1 = 1, e2 = 2</span></span>
<span class="line"><span style="color:#6272A4;">    // (a b)</span></span>
<span class="line"><span style="color:#6272A4;">    // c (a b)</span></span>
<span class="line"><span style="color:#6272A4;">    // i = 0, e1 = -1, e2 = 0</span></span>
<span class="line"><span style="color:#6272A4;">    // i &gt; e1 说明在预处理的过程中，所有旧子节点处理完毕了</span></span>
<span class="line"><span style="color:#6272A4;">    // i &lt;= e2 说明在预处理过后，在新的一组子节点中，仍然有未被处理的节点，这些遗留的节点将被视作新增节点。</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">&gt;</span><span style="color:#F8F8F2;"> e1) {</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e2) {</span></span>
<span class="line"><span style="color:#FF79C6;">        const</span><span style="color:#F8F8F2;"> nextPos </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> e2 </span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;"> 1</span></span>
<span class="line"><span style="color:#FF79C6;">        const</span><span style="color:#F8F8F2;"> anchor </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> nextPos </span><span style="color:#FF79C6;">&lt;</span><span style="color:#F8F8F2;"> l2 </span><span style="color:#FF79C6;">?</span><span style="color:#F8F8F2;"> (c2[nextPos] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">).el </span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> parentAnchor</span></span>
<span class="line"><span style="color:#FF79C6;">        while</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e2) {</span></span>
<span class="line"><span style="color:#6272A4;">          // 采用 while 循环，调用 patch 函数逐个挂载新增节点</span></span>
<span class="line"><span style="color:#50FA7B;">          patch</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#BD93F9;">            null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">            (c2[i] </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> optimized</span></span>
<span class="line"><span style="color:#FF79C6;">              ?</span><span style="color:#50FA7B;"> cloneIfMounted</span><span style="color:#F8F8F2;">(c2[i] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">              :</span><span style="color:#50FA7B;"> normalizeVNode</span><span style="color:#F8F8F2;">(c2[i])),</span></span>
<span class="line"><span style="color:#F8F8F2;">            container,</span></span>
<span class="line"><span style="color:#F8F8F2;">            anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">            namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">            slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">            optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">          )</span></span>
<span class="line"><span style="color:#F8F8F2;">          i</span><span style="color:#FF79C6;">++</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // 4. common sequence + unmount</span></span>
<span class="line"><span style="color:#6272A4;">    // 删除节点的情况</span></span>
<span class="line"><span style="color:#6272A4;">    // (a b) c</span></span>
<span class="line"><span style="color:#6272A4;">    // (a b)</span></span>
<span class="line"><span style="color:#6272A4;">    // i = 2, e1 = 2, e2 = 1</span></span>
<span class="line"><span style="color:#6272A4;">    // a (b c)</span></span>
<span class="line"><span style="color:#6272A4;">    // (b c)</span></span>
<span class="line"><span style="color:#6272A4;">    // i = 0, e1 = 0, e2 = -1</span></span>
<span class="line"><span style="color:#6272A4;">    // i &gt; e2 说明新的一组子节点已经全部处理完毕了</span></span>
<span class="line"><span style="color:#6272A4;">    // i &lt;= e1 说明在旧的一组子节点中还有遗留的节点未被处理，这些节点是需要卸载的</span></span>
<span class="line"><span style="color:#FF79C6;">    else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">&gt;</span><span style="color:#F8F8F2;"> e2) {</span></span>
<span class="line"><span style="color:#FF79C6;">      while</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e1) {</span></span>
<span class="line"><span style="color:#50FA7B;">        unmount</span><span style="color:#F8F8F2;">(c1[i], parentComponent, parentSuspense, </span><span style="color:#BD93F9;">true</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">        i</span><span style="color:#FF79C6;">++</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">    // 5. unknown sequence</span></span>
<span class="line"><span style="color:#6272A4;">    // 非理想的情况</span></span>
<span class="line"><span style="color:#6272A4;">    // [i ... e1 + 1]: a b [c d e] f g</span></span>
<span class="line"><span style="color:#6272A4;">    // [i ... e2 + 1]: a b [e d c h] f g</span></span>
<span class="line"><span style="color:#6272A4;">    // i = 2, e1 = 4, e2 = 5</span></span>
<span class="line"><span style="color:#FF79C6;">    else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">      // i 第一个未处理节点的索引位置</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> s1 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> i </span><span style="color:#6272A4;">// prev starting index</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> s2 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> i </span><span style="color:#6272A4;">// next starting index</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">      // 5.1 build key:index map for newChildren</span></span>
<span class="line"><span style="color:#6272A4;">     // 未处理节点的 key 和 索引位置的映射</span></span>
<span class="line"><span style="color:#6272A4;">    // map 集合的键是节点的 key</span></span>
<span class="line"><span style="color:#6272A4;">    // map 集合的值是节点的索引位置</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> keyToNewIndexMap</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> Map</span><span style="color:#F8F8F2;">&lt;</span><span style="color:#FFB86C;font-style:italic;">PropertyKey</span><span style="color:#F8F8F2;">, </span><span style="color:#8BE9FD;font-style:italic;">number</span><span style="color:#F8F8F2;">&gt; </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;font-weight:bold;"> new</span><span style="color:#50FA7B;"> Map</span><span style="color:#F8F8F2;">()</span></span>
<span class="line"><span style="color:#FF79C6;">      for</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> s2; i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e2; i</span><span style="color:#FF79C6;">++</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">        const</span><span style="color:#F8F8F2;"> nextChild </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (c2[i] </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> optimized</span></span>
<span class="line"><span style="color:#FF79C6;">          ?</span><span style="color:#50FA7B;"> cloneIfMounted</span><span style="color:#F8F8F2;">(c2[i] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">          :</span><span style="color:#50FA7B;"> normalizeVNode</span><span style="color:#F8F8F2;">(c2[i]))</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (nextChild.key </span><span style="color:#FF79C6;">!=</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">          // 将新节点的 key 和 索引位置添加到 map 集合中</span></span>
<span class="line"><span style="color:#F8F8F2;">          keyToNewIndexMap.</span><span style="color:#50FA7B;">set</span><span style="color:#F8F8F2;">(nextChild.key, i)</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">      // 5.2 loop through old children left to be patched and try to patch</span></span>
<span class="line"><span style="color:#6272A4;">      // matching nodes &amp; remove nodes that are no longer present</span></span>
<span class="line"><span style="color:#FF79C6;">      let</span><span style="color:#F8F8F2;"> j</span></span>
<span class="line"><span style="color:#6272A4;">      //  代表已更新过的节点数量</span></span>
<span class="line"><span style="color:#FF79C6;">      let</span><span style="color:#F8F8F2;"> patched </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0</span></span>
<span class="line"><span style="color:#6272A4;">      //  新的一组子节点中剩余未处理节点的数量</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> toBePatched </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> e2 </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> s2 </span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;"> 1</span></span>
<span class="line"><span style="color:#FF79C6;">      let</span><span style="color:#F8F8F2;"> moved </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> false</span></span>
<span class="line"><span style="color:#6272A4;">      // 代表遍历旧的一组子节点的过程中遇到的最大索引值</span></span>
<span class="line"><span style="color:#6272A4;">      // used to track whether any node has moved</span></span>
<span class="line"><span style="color:#FF79C6;">      let</span><span style="color:#F8F8F2;"> maxNewIndexSoFar </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0</span></span>
<span class="line"><span style="color:#6272A4;">      // works as Map&lt;newIndex, oldIndex&gt;</span></span>
<span class="line"><span style="color:#6272A4;">      // Note that oldIndex is offset by +1</span></span>
<span class="line"><span style="color:#6272A4;">      // and oldIndex = 0 is a special value indicating the new node has</span></span>
<span class="line"><span style="color:#6272A4;">      // no corresponding old node.</span></span>
<span class="line"><span style="color:#6272A4;">      // used for determining longest stable subsequence</span></span>
<span class="line"><span style="color:#6272A4;">       // 存储新的一组子节点中在旧的一组子节点中的位置索引</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> newIndexToOldIndexMap </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;font-weight:bold;"> new</span><span style="color:#50FA7B;"> Array</span><span style="color:#F8F8F2;">(toBePatched)</span></span>
<span class="line"><span style="color:#FF79C6;">      for</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0</span><span style="color:#F8F8F2;">; i </span><span style="color:#FF79C6;">&lt;</span><span style="color:#F8F8F2;"> toBePatched; i</span><span style="color:#FF79C6;">++</span><span style="color:#F8F8F2;">) newIndexToOldIndexMap[i] </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0</span></span>
<span class="line"><span style="color:#6272A4;">      // s1 代表旧的一组子节点的起始索引</span></span>
<span class="line"><span style="color:#6272A4;">      // e1 代表旧的一组子节点的结束索引</span></span>
<span class="line"><span style="color:#FF79C6;">      for</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> s1; i </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e1; i</span><span style="color:#FF79C6;">++</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">        const</span><span style="color:#F8F8F2;"> prevChild </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c1[i]</span></span>
<span class="line"><span style="color:#6272A4;">        // 如果更新过的节点数量大于需要更新的节点数量，则卸载多余的节点</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (patched </span><span style="color:#FF79C6;">&gt;=</span><span style="color:#F8F8F2;"> toBePatched) {</span></span>
<span class="line"><span style="color:#6272A4;">          // all new children have been patched so this can only be a removal</span></span>
<span class="line"><span style="color:#50FA7B;">          unmount</span><span style="color:#F8F8F2;">(prevChild, parentComponent, parentSuspense, </span><span style="color:#BD93F9;">true</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">          continue</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#6272A4;">        // // 新的一组子节点中未被处理节点在新子节点中的位置索引</span></span>
<span class="line"><span style="color:#FF79C6;">        let</span><span style="color:#F8F8F2;"> newIndex</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (prevChild.key </span><span style="color:#FF79C6;">!=</span><span style="color:#BD93F9;"> null</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">          // 从索引表中获取与旧节点具有相同key的新节点在新的一组子节点中的位置索引</span></span>
<span class="line"><span style="color:#F8F8F2;">          newIndex </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> keyToNewIndexMap.</span><span style="color:#50FA7B;">get</span><span style="color:#F8F8F2;">(prevChild.key)</span></span>
<span class="line"><span style="color:#F8F8F2;">        } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">          // key-less node, try to locate a key-less node of the same type</span></span>
<span class="line"><span style="color:#6272A4;">          // 旧子节点没有 key ，那么尝试在新的一组子节点中查找具有相同类型的没有key的新子节点</span></span>
<span class="line"><span style="color:#FF79C6;">          for</span><span style="color:#F8F8F2;"> (j </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> s2; j </span><span style="color:#FF79C6;">&lt;=</span><span style="color:#F8F8F2;"> e2; j</span><span style="color:#FF79C6;">++</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">            if</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#F8F8F2;">              newIndexToOldIndexMap[j </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> s2] </span><span style="color:#FF79C6;">===</span><span style="color:#BD93F9;"> 0</span><span style="color:#FF79C6;"> &amp;&amp;</span></span>
<span class="line"><span style="color:#50FA7B;">              isSameVNodeType</span><span style="color:#F8F8F2;">(prevChild, c2[j] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">            ) {</span></span>
<span class="line"><span style="color:#F8F8F2;">              newIndex </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> j</span></span>
<span class="line"><span style="color:#FF79C6;">              break</span></span>
<span class="line"><span style="color:#F8F8F2;">            }</span></span>
<span class="line"><span style="color:#F8F8F2;">          }</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (newIndex </span><span style="color:#FF79C6;">===</span><span style="color:#BD93F9;"> undefined</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">          //  如果在新的一组子节点中没有找到与旧的一组子节点中具有相同key</span></span>
<span class="line"><span style="color:#6272A4;">          // 新节点没有这个key了</span></span>
<span class="line"><span style="color:#50FA7B;">          unmount</span><span style="color:#F8F8F2;">(prevChild, parentComponent, parentSuspense, </span><span style="color:#BD93F9;">true</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">        } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">          // 记录新的一组子节点中在旧的一组子节点中的位置索引</span></span>
<span class="line"><span style="color:#F8F8F2;">          newIndexToOldIndexMap[newIndex </span><span style="color:#FF79C6;">-</span><span style="color:#F8F8F2;"> s2] </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> i </span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;"> 1</span></span>
<span class="line"><span style="color:#6272A4;">          //  如果在遍历过程中遇到的索引值呈现递增趋势，则说明不需要移动节点</span></span>
<span class="line"><span style="color:#6272A4;">          // maxNewIndexSoFar 记录遍历的最大索引</span></span>
<span class="line"><span style="color:#FF79C6;">          if</span><span style="color:#F8F8F2;"> (newIndex </span><span style="color:#FF79C6;">&gt;=</span><span style="color:#F8F8F2;"> maxNewIndexSoFar) {</span></span>
<span class="line"><span style="color:#F8F8F2;">            maxNewIndexSoFar </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> newIndex</span></span>
<span class="line"><span style="color:#F8F8F2;">          } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">            moved </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> true</span></span>
<span class="line"><span style="color:#F8F8F2;">          }</span></span>
<span class="line"><span style="color:#50FA7B;">          patch</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">            prevChild,</span></span>
<span class="line"><span style="color:#F8F8F2;">            c2[newIndex] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">            container,</span></span>
<span class="line"><span style="color:#BD93F9;">            null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">            namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">            slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">            optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">          )</span></span>
<span class="line"><span style="color:#F8F8F2;">          patched</span><span style="color:#FF79C6;">++</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">      </span></span>
<span class="line"><span style="color:#6272A4;">      // 5.3 move and mount</span></span>
<span class="line"><span style="color:#6272A4;">      // generate longest stable subsequence only when nodes have moved</span></span>
<span class="line"><span style="color:#6272A4;">      // 计算最长递增子序列</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> increasingNewIndexSequence </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> moved</span></span>
<span class="line"><span style="color:#FF79C6;">        ?</span><span style="color:#50FA7B;"> getSequence</span><span style="color:#F8F8F2;">(newIndexToOldIndexMap)</span></span>
<span class="line"><span style="color:#FF79C6;">        :</span><span style="color:#F8F8F2;"> EMPTY_ARR</span></span>
<span class="line"><span style="color:#6272A4;">        // j是最长递增子序列的最后一个索引</span></span>
<span class="line"><span style="color:#F8F8F2;">      j </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> increasingNewIndexSequence.length </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1</span></span>
<span class="line"><span style="color:#6272A4;">      // looping backwards so that we can use last patched node as anchor</span></span>
<span class="line"><span style="color:#6272A4;">      // i是新节点的最后一个元素</span></span>
<span class="line"><span style="color:#FF79C6;">      for</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> toBePatched </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1</span><span style="color:#F8F8F2;">; i </span><span style="color:#FF79C6;">&gt;=</span><span style="color:#BD93F9;"> 0</span><span style="color:#F8F8F2;">; i</span><span style="color:#FF79C6;">--</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">        // 获取真实的索引</span></span>
<span class="line"><span style="color:#FF79C6;">        const</span><span style="color:#F8F8F2;"> nextIndex </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> s2 </span><span style="color:#FF79C6;">+</span><span style="color:#F8F8F2;"> i</span></span>
<span class="line"><span style="color:#FF79C6;">        const</span><span style="color:#F8F8F2;"> nextChild </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c2[nextIndex] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span></span>
<span class="line"><span style="color:#FF79C6;">        const</span><span style="color:#F8F8F2;"> anchor </span><span style="color:#FF79C6;">=</span></span>
<span class="line"><span style="color:#F8F8F2;">          nextIndex </span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;"> 1</span><span style="color:#FF79C6;"> &lt;</span><span style="color:#F8F8F2;"> l2 </span><span style="color:#FF79C6;">?</span><span style="color:#F8F8F2;"> (c2[nextIndex </span><span style="color:#FF79C6;">+</span><span style="color:#BD93F9;"> 1</span><span style="color:#F8F8F2;">] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">).el </span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> parentAnchor</span></span>
<span class="line"><span style="color:#6272A4;">          // 是全新的节点</span></span>
<span class="line"><span style="color:#FF79C6;">        if</span><span style="color:#F8F8F2;"> (newIndexToOldIndexMap[i] </span><span style="color:#FF79C6;">===</span><span style="color:#BD93F9;"> 0</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#6272A4;">          // mount new</span></span>
<span class="line"><span style="color:#50FA7B;">          patch</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#BD93F9;">            null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">            nextChild,</span></span>
<span class="line"><span style="color:#F8F8F2;">            container,</span></span>
<span class="line"><span style="color:#F8F8F2;">            anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">            parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">            namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">            slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">            optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">          )</span></span>
<span class="line"><span style="color:#F8F8F2;">        } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (moved) {</span></span>
<span class="line"><span style="color:#6272A4;">          // move if:</span></span>
<span class="line"><span style="color:#6272A4;">          // There is no stable subsequence (e.g. a reverse)</span></span>
<span class="line"><span style="color:#6272A4;">          // OR current node is not among the stable sequence</span></span>
<span class="line"><span style="color:#6272A4;">         // i 指向的是新的一组子节点中元素的位置索引</span></span>
<span class="line"><span style="color:#6272A4;">         // j 指向的是最长递增子序列中元素的位置索引</span></span>
<span class="line"><span style="color:#FF79C6;">          if</span><span style="color:#F8F8F2;"> (j </span><span style="color:#FF79C6;">&lt;</span><span style="color:#BD93F9;"> 0</span><span style="color:#FF79C6;"> ||</span><span style="color:#F8F8F2;"> i </span><span style="color:#FF79C6;">!==</span><span style="color:#F8F8F2;"> increasingNewIndexSequence[j]) {</span></span>
<span class="line"><span style="color:#50FA7B;">            move</span><span style="color:#F8F8F2;">(nextChild, container, anchor, MoveType.</span><span style="color:#BD93F9;">REORDER</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">          } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">            j</span><span style="color:#FF79C6;">--</span></span>
<span class="line"><span style="color:#F8F8F2;">          }</span></span>
<span class="line"><span style="color:#F8F8F2;">        }</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="patchunkeyedchildren" tabindex="-1"><a class="header-anchor" href="#patchunkeyedchildren"><span>patchUnkeyedChildren</span></a></h2><div class="language-ts line-numbers-mode" data-highlighter="shiki" data-ext="ts" data-title="ts" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#50FA7B;"> patchUnkeyedChildren</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    c1</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">[],</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    c2</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> VNodeArrayChildren</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    container</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererElement</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    anchor</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> RendererNode</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentComponent</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ComponentInternalInstance</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    parentSuspense</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> SuspenseBoundary</span><span style="color:#FF79C6;"> |</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    namespace</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> ElementNamespace</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    slotScopeIds</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#F8F8F2;">[] </span><span style="color:#FF79C6;">|</span><span style="color:#8BE9FD;font-style:italic;"> null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#FFB86C;font-style:italic;">    optimized</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> boolean</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">  ) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">    c1 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c1 </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> EMPTY_ARR</span></span>
<span class="line"><span style="color:#F8F8F2;">    c2 </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c2 </span><span style="color:#FF79C6;">||</span><span style="color:#F8F8F2;"> EMPTY_ARR</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> oldLength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c1.length</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> newLength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> c2.length</span></span>
<span class="line"><span style="color:#FF79C6;">    const</span><span style="color:#F8F8F2;"> commonLength </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> Math.</span><span style="color:#50FA7B;">min</span><span style="color:#F8F8F2;">(oldLength, newLength)</span></span>
<span class="line"><span style="color:#FF79C6;">    let</span><span style="color:#F8F8F2;"> i</span></span>
<span class="line"><span style="color:#6272A4;">    // 遍历最短的长度</span></span>
<span class="line"><span style="color:#FF79C6;">    for</span><span style="color:#F8F8F2;"> (i </span><span style="color:#FF79C6;">=</span><span style="color:#BD93F9;"> 0</span><span style="color:#F8F8F2;">; i </span><span style="color:#FF79C6;">&lt;</span><span style="color:#F8F8F2;"> commonLength; i</span><span style="color:#FF79C6;">++</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#FF79C6;">      const</span><span style="color:#F8F8F2;"> nextChild </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> (c2[i] </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> optimized</span></span>
<span class="line"><span style="color:#FF79C6;">        ?</span><span style="color:#50FA7B;"> cloneIfMounted</span><span style="color:#F8F8F2;">(c2[i] </span><span style="color:#FF79C6;">as</span><span style="color:#8BE9FD;font-style:italic;"> VNode</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#FF79C6;">        :</span><span style="color:#50FA7B;"> normalizeVNode</span><span style="color:#F8F8F2;">(c2[i]))</span></span>
<span class="line"><span style="color:#50FA7B;">      patch</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        c1[i],</span></span>
<span class="line"><span style="color:#F8F8F2;">        nextChild,</span></span>
<span class="line"><span style="color:#F8F8F2;">        container,</span></span>
<span class="line"><span style="color:#BD93F9;">        null</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">        namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">        optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#FF79C6;">    if</span><span style="color:#F8F8F2;"> (oldLength </span><span style="color:#FF79C6;">&gt;</span><span style="color:#F8F8F2;"> newLength) {</span></span>
<span class="line"><span style="color:#6272A4;">      // remove old</span></span>
<span class="line"><span style="color:#50FA7B;">      unmountChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        c1,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#BD93F9;">        true</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#BD93F9;">        false</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">        commonLength,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#6272A4;">      // mount new</span></span>
<span class="line"><span style="color:#50FA7B;">      mountChildren</span><span style="color:#F8F8F2;">(</span></span>
<span class="line"><span style="color:#F8F8F2;">        c2,</span></span>
<span class="line"><span style="color:#F8F8F2;">        container,</span></span>
<span class="line"><span style="color:#F8F8F2;">        anchor,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentComponent,</span></span>
<span class="line"><span style="color:#F8F8F2;">        parentSuspense,</span></span>
<span class="line"><span style="color:#F8F8F2;">        namespace,</span></span>
<span class="line"><span style="color:#F8F8F2;">        slotScopeIds,</span></span>
<span class="line"><span style="color:#F8F8F2;">        optimized,</span></span>
<span class="line"><span style="color:#F8F8F2;">        commonLength,</span></span>
<span class="line"><span style="color:#F8F8F2;">      )</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,28)),p(` # summary

**patchChildren**

\`i\`指向新旧前置节点索引
\`e1\` 旧节点长度
\`e2\` 新节点长度


**理想情况**
- 处理前置节点
![](./images/patch/3662011735632172586.png)
- 处理后置节点 `),s[1]||(s[1]=n("h1",{id:"参考",tabindex:"-1"},[n("a",{class:"header-anchor",href:"#参考"},[n("span",null,"参考")])],-1)),s[2]||(s[2]=n("ul",null,[n("li",null,"《Vue.js 设计与实现》")],-1))])}const r=a(c,[["render",F],["__file","patch.html.vue"]]),y=JSON.parse('{"path":"/vue3/patch.html","title":"Vue3 patch","lang":"en-US","frontmatter":{"title":"Vue3 patch","date":"2024-12-18T00:00:00.000Z","category":["Vue"],"tag":["Vue3"],"description":"组件挂载=>mountComponent => setupRenderEffect 组件更新 => trigger => effect.trigger patchFlag patch processText 纯文本 processComponent Vue组件 instance.update processElement patchBlockChild...","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/vue3/patch.html"}],["meta",{"property":"og:title","content":"Vue3 patch"}],["meta",{"property":"og:description","content":"组件挂载=>mountComponent => setupRenderEffect 组件更新 => trigger => effect.trigger patchFlag patch processText 纯文本 processComponent Vue组件 instance.update processElement patchBlockChild..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2025-01-15T01:45:13.000Z"}],["meta",{"property":"article:tag","content":"Vue3"}],["meta",{"property":"article:published_time","content":"2024-12-18T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2025-01-15T01:45:13.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Vue3 patch\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2024-12-18T00:00:00.000Z\\",\\"dateModified\\":\\"2025-01-15T01:45:13.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"headers":[{"level":2,"title":"processText","slug":"processtext","link":"#processtext","children":[]},{"level":2,"title":"processComponent","slug":"processcomponent","link":"#processcomponent","children":[{"level":3,"title":"instance.update","slug":"instance-update","link":"#instance-update","children":[]}]},{"level":2,"title":"processElement","slug":"processelement","link":"#processelement","children":[{"level":3,"title":"patchBlockChildren","slug":"patchblockchildren","link":"#patchblockchildren","children":[]}]},{"level":2,"title":"processFragment","slug":"processfragment","link":"#processfragment","children":[]},{"level":2,"title":"patchKeyedChildren","slug":"patchkeyedchildren","link":"#patchkeyedchildren","children":[]},{"level":2,"title":"patchUnkeyedChildren","slug":"patchunkeyedchildren","link":"#patchunkeyedchildren","children":[]}],"git":{"createdTime":1736905513000,"updatedTime":1736905513000,"contributors":[{"name":"luxiag","email":"luxiag@qq.com","commits":1}]},"readingTime":{"minutes":12.34,"words":3703},"filePathRelative":"vue3/patch.md","localizedDate":"December 18, 2024","excerpt":"<p>组件挂载=&gt;<code>mountComponent</code> =&gt; <code>setupRenderEffect</code></p>\\n<div class=\\"language-ts line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"ts\\" data-title=\\"ts\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#FF79C6\\">const</span><span style=\\"color:#50FA7B\\"> setupRenderEffect</span><span style=\\"color:#FF79C6\\"> =</span><span style=\\"color:#F8F8F2\\"> () </span><span style=\\"color:#FF79C6\\">=&gt;</span><span style=\\"color:#F8F8F2\\"> {</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">  const</span><span style=\\"color:#50FA7B\\"> componentUpdateFn</span><span style=\\"color:#FF79C6\\"> =</span><span style=\\"color:#F8F8F2\\"> () </span><span style=\\"color:#FF79C6\\">=&gt;</span><span style=\\"color:#F8F8F2\\"> {</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">    // ...</span></span>\\n<span class=\\"line\\"><span style=\\"color:#50FA7B\\">    patch</span><span style=\\"color:#F8F8F2\\">()</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">  }</span></span>\\n<span class=\\"line\\"><span style=\\"color:#FF79C6\\">  const</span><span style=\\"color:#F8F8F2\\"> effect </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#F8F8F2\\"> (instance.effect </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#FF79C6;font-weight:bold\\"> new</span><span style=\\"color:#50FA7B\\"> ReactiveEffect</span><span style=\\"color:#F8F8F2\\">(componentUpdateFn))</span></span>\\n<span class=\\"line\\"><span style=\\"color:#6272A4\\">  // ...</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">}</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{r as comp,y as data};
