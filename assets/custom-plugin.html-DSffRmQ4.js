import{_ as n,c as l,b as a,o as e}from"./app-DmuFHWsy.js";const p={};function o(t,s){return e(),l("div",null,s[0]||(s[0]=[a(`<h2 id="plugin" tabindex="-1"><a class="header-anchor" href="#plugin"><span>plugin</span></a></h2><p>插件向第三方开发者提供了 webpack 引擎中完整的能力。 使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。</p><h3 id="可以加载插件的常用对象" tabindex="-1"><a class="header-anchor" href="#可以加载插件的常用对象"><span>可以加载插件的常用对象</span></a></h3><table><thead><tr><th>对象</th><th>钩子</th></tr></thead><tbody><tr><td>Compiler</td><td>run,compile,compilation,make,emit,done</td></tr><tr><td>Compilation</td><td>buildModule,normalModuleLoader,succeedModule,finishModules,seal,optimize,after-seal</td></tr><tr><td>Module Factory</td><td>beforeResolver,afterResolver,module,parser</td></tr><tr><td>Parser</td><td>program,statement,call,expression</td></tr><tr><td>Template</td><td>hash,bootstrap,localVars,render</td></tr></tbody></table><h2 id="创建插件" tabindex="-1"><a class="header-anchor" href="#创建插件"><span>创建插件</span></a></h2><p>webpack 插件由以下组成：</p><ul><li>一个 JavaScript 命名函数。</li><li>在插件函数的 prototype 上定义一个 apply 方法。</li><li>指定一个绑定到 webpack 自身的事件钩子。</li><li>处理 webpack 内部实例的特定数据。</li><li>功能完成后调用 webpack 提供的回调。</li></ul><h2 id="compiler-和-compilation" tabindex="-1"><a class="header-anchor" href="#compiler-和-compilation"><span>compiler 和 compilation</span></a></h2><ul><li><p>compiler 对象代表了完整的 webpack 环境配置。这个对象在启动 webpack 时被一次性建立，并配置好所有可操作的设置，包括 options，loader 和 plugin。当在 webpack 环境中应用一个插件时，插件将收到此 compiler 对象的引用。可以使用它来访问 webpack 的主环境。</p></li><li><p>compilation 对象代表了一次资源版本构建。当运行 webpack 开发环境中间件时，每当检测到一个文件变化，就会创建一个新的 compilation，从而生成一组新的编译资源。一个 compilation 对象表现了当前的模块资源、编译生成资源、变化的文件、以及被跟踪依赖的状态信息。compilation 对象也提供了很多关键时机的回调，以供插件做自定义处理时选择使用。</p></li></ul><h2 id="基本插件架构" tabindex="-1"><a class="header-anchor" href="#基本插件架构"><span>基本插件架构</span></a></h2><ul><li>插件是由「具有 apply 方法的 prototype 对象」所实例化出来的</li><li>这个 apply 方法在安装插件时，会被 webpack compiler 调用一次</li><li>apply 方法可以接收一个 webpack compiler 对象的引用，从而可以在回调函数中访问到 compiler 对象</li></ul><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">const</span><span style="color:#50FA7B;"> createCompiler</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> (</span><span style="color:#FFB86C;font-style:italic;">rawOptions</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#F8F8F2;"> options </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> getNormalizedWebpackOptions</span><span style="color:#F8F8F2;">(rawOptions);</span></span>
<span class="line"><span style="color:#50FA7B;">  applyWebpackOptionsBaseDefaults</span><span style="color:#F8F8F2;">(options);</span></span>
<span class="line"><span style="color:#FF79C6;">  const</span><span style="color:#F8F8F2;"> compiler </span><span style="color:#FF79C6;">=</span><span style="color:#FF79C6;font-weight:bold;"> new</span><span style="color:#50FA7B;"> Compiler</span><span style="color:#F8F8F2;">(options.context, options);</span></span>
<span class="line"><span style="color:#FF79C6;font-weight:bold;">  new</span><span style="color:#50FA7B;"> NodeEnvironmentPlugin</span><span style="color:#F8F8F2;">({</span></span>
<span class="line"><span style="color:#F8F8F2;">    infrastructureLogging</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> options.infrastructureLogging,</span></span>
<span class="line"><span style="color:#F8F8F2;">  }).</span><span style="color:#50FA7B;">apply</span><span style="color:#F8F8F2;">(compiler);</span></span>
<span class="line"><span style="color:#FF79C6;">  if</span><span style="color:#F8F8F2;"> (Array.</span><span style="color:#50FA7B;">isArray</span><span style="color:#F8F8F2;">(options.plugins)) {</span></span>
<span class="line"><span style="color:#FF79C6;">    for</span><span style="color:#F8F8F2;"> (</span><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> plugin </span><span style="color:#FF79C6;">of</span><span style="color:#F8F8F2;"> options.plugins) {</span></span>
<span class="line"><span style="color:#FF79C6;">      if</span><span style="color:#F8F8F2;"> (</span><span style="color:#FF79C6;">typeof</span><span style="color:#F8F8F2;"> plugin </span><span style="color:#FF79C6;">===</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">function</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">        plugin.</span><span style="color:#50FA7B;">call</span><span style="color:#F8F8F2;">(compiler, compiler);</span></span>
<span class="line"><span style="color:#F8F8F2;">      } </span><span style="color:#FF79C6;">else</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">        plugin.</span><span style="color:#50FA7B;">apply</span><span style="color:#F8F8F2;">(compiler);</span></span>
<span class="line"><span style="color:#F8F8F2;">      }</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#50FA7B;">  applyWebpackOptionsDefaults</span><span style="color:#F8F8F2;">(options);</span></span>
<span class="line"><span style="color:#F8F8F2;">  compiler.hooks.environment.</span><span style="color:#50FA7B;">call</span><span style="color:#F8F8F2;">();</span></span>
<span class="line"><span style="color:#F8F8F2;">  compiler.hooks.afterEnvironment.</span><span style="color:#50FA7B;">call</span><span style="color:#F8F8F2;">();</span></span>
<span class="line"><span style="color:#FF79C6;font-weight:bold;">  new</span><span style="color:#50FA7B;"> WebpackOptionsApply</span><span style="color:#F8F8F2;">().</span><span style="color:#50FA7B;">process</span><span style="color:#F8F8F2;">(options, compiler);</span></span>
<span class="line"><span style="color:#F8F8F2;">  compiler.hooks.initialize.</span><span style="color:#50FA7B;">call</span><span style="color:#F8F8F2;">();</span></span>
<span class="line"><span style="color:#FF79C6;">  return</span><span style="color:#F8F8F2;"> compiler;</span></span>
<span class="line"><span style="color:#F8F8F2;">};</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="同步" tabindex="-1"><a class="header-anchor" href="#同步"><span>同步</span></a></h3><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">class</span><span style="color:#8BE9FD;"> DonePlugin</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">  constructor</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">options</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#BD93F9;font-style:italic;">    this</span><span style="color:#F8F8F2;">.options </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> options;</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#50FA7B;">  apply</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">compiler</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">    compiler.hooks.done.</span><span style="color:#50FA7B;">tap</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">DonePlugin</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">, (</span><span style="color:#FFB86C;font-style:italic;">stats</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">      console.</span><span style="color:#50FA7B;">log</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">Hello </span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;font-style:italic;">this</span><span style="color:#F8F8F2;">.options.name);</span></span>
<span class="line"><span style="color:#F8F8F2;">    });</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#8BE9FD;font-style:italic;">module</span><span style="color:#F8F8F2;">.</span><span style="color:#8BE9FD;font-style:italic;">exports</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> DonePlugin;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h3 id="异步" tabindex="-1"><a class="header-anchor" href="#异步"><span>异步</span></a></h3><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">class</span><span style="color:#8BE9FD;"> DonePlugin</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#FF79C6;">  constructor</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">options</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#BD93F9;font-style:italic;">    this</span><span style="color:#F8F8F2;">.options </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> options;</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#50FA7B;">  apply</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">compiler</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;">    compiler.hooks.done.</span><span style="color:#50FA7B;">tapAsync</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">DonePlugin</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">, (</span><span style="color:#FFB86C;font-style:italic;">stats</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">callback</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">      console.</span><span style="color:#50FA7B;">log</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">Hello </span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">, </span><span style="color:#BD93F9;font-style:italic;">this</span><span style="color:#F8F8F2;">.options.name);</span></span>
<span class="line"><span style="color:#50FA7B;">      callback</span><span style="color:#F8F8F2;">();</span></span>
<span class="line"><span style="color:#F8F8F2;">    });</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span>
<span class="line"><span style="color:#8BE9FD;font-style:italic;">module</span><span style="color:#F8F8F2;">.</span><span style="color:#8BE9FD;font-style:italic;">exports</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> DonePlugin;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,16)]))}const c=n(p,[["render",o],["__file","custom-plugin.html.vue"]]),r=JSON.parse('{"path":"/webpack/custom-plugin.html","title":"自定义Plugin","lang":"en-US","frontmatter":{"title":"自定义Plugin","category":"Webpack","tag":"Webpack5","date":"2021-10-12T00:00:00.000Z","description":"plugin 插件向第三方开发者提供了 webpack 引擎中完整的能力。 使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。 可以加载插件的常用对象 创建插件 webpack 插件由以下组成： 一个 JavaScript 命名函数。 在插件函数的 prototype 上定义一个 apply 方法。 指定一个绑定到 we...","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/webpack/custom-plugin.html"}],["meta",{"property":"og:title","content":"自定义Plugin"}],["meta",{"property":"og:description","content":"plugin 插件向第三方开发者提供了 webpack 引擎中完整的能力。 使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。 可以加载插件的常用对象 创建插件 webpack 插件由以下组成： 一个 JavaScript 命名函数。 在插件函数的 prototype 上定义一个 apply 方法。 指定一个绑定到 we..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2023-05-08T02:45:06.000Z"}],["meta",{"property":"article:tag","content":"Webpack5"}],["meta",{"property":"article:published_time","content":"2021-10-12T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-05-08T02:45:06.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"自定义Plugin\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2021-10-12T00:00:00.000Z\\",\\"dateModified\\":\\"2023-05-08T02:45:06.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"headers":[{"level":2,"title":"plugin","slug":"plugin","link":"#plugin","children":[{"level":3,"title":"可以加载插件的常用对象","slug":"可以加载插件的常用对象","link":"#可以加载插件的常用对象","children":[]}]},{"level":2,"title":"创建插件","slug":"创建插件","link":"#创建插件","children":[]},{"level":2,"title":"compiler 和 compilation","slug":"compiler-和-compilation","link":"#compiler-和-compilation","children":[]},{"level":2,"title":"基本插件架构","slug":"基本插件架构","link":"#基本插件架构","children":[{"level":3,"title":"同步","slug":"同步","link":"#同步","children":[]},{"level":3,"title":"异步","slug":"异步","link":"#异步","children":[]}]}],"git":{"createdTime":1673184773000,"updatedTime":1683513906000,"contributors":[{"name":"luxiag","email":"luxiag@qq.com","commits":1},{"name":"卢祥","email":"example@qq.com","commits":1}]},"readingTime":{"minutes":1.9,"words":571},"filePathRelative":"webpack/custom-plugin.md","localizedDate":"October 12, 2021","excerpt":"<h2>plugin</h2>\\n<p>插件向第三方开发者提供了 webpack 引擎中完整的能力。\\n使用阶段式的构建回调，开发者可以引入它们自己的行为到 webpack 构建流程中。</p>\\n<h3>可以加载插件的常用对象</h3>","autoDesc":true}');export{c as comp,r as data};