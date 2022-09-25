import{_ as p,r as n,o,c as l,e as s,w as i,b as a}from"./app.a393d442.js";const c="/assets/20220824144717.92595d39.png",r="/assets/20220824102531.94e31068.png",u="/assets/20220824102931.ce88df8e.png",d="/assets/20220824103614.62809f86.png",k="/assets/20220824164740.169d4403.png",v="/assets/20220824144942.5b58e6d0.png",m="/assets/20220824170620.571bccbd.png",g="/assets/20220824102931.ce88df8e.png",b={},y=a('<p><img src="'+c+'" alt=""></p><p><img src="'+r+'" alt=""><br><img src="'+u+'" alt=""><img src="'+d+`" alt=""></p><h1 id="loader-\u6267\u884C\u987A\u5E8F" tabindex="-1"><a class="header-anchor" href="#loader-\u6267\u884C\u987A\u5E8F" aria-hidden="true">#</a> loader \u6267\u884C\u987A\u5E8F</h1><p>\u5148\u5DE6\u5230\u53F3\u6267\u884C loader \u4E0A\u7684 pitch \u65B9\u6CD5 \u5728\u53F3\u5230\u5DE6\u6267\u884C loader</p><h1 id="vue-loader" tabindex="-1"><a class="header-anchor" href="#vue-loader" aria-hidden="true">#</a> vue-loader</h1><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">const</span> <span class="token punctuation">{</span> parse <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token function">require</span><span class="token punctuation">(</span><span class="token string">&quot;@vue/component-compiler-utils&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
module<span class="token punctuation">.</span><span class="token function-variable function">exports</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">source</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">//....</span>
  <span class="token keyword">const</span> descriptor <span class="token operator">=</span> <span class="token function">parse</span><span class="token punctuation">(</span><span class="token punctuation">{</span>
    source<span class="token punctuation">,</span>
    <span class="token literal-property property">compiler</span><span class="token operator">:</span> options<span class="token punctuation">.</span>compiler <span class="token operator">||</span> <span class="token function">loadTemplateCompiler</span><span class="token punctuation">(</span>loaderContext<span class="token punctuation">)</span><span class="token punctuation">,</span>
    filename<span class="token punctuation">,</span>
    sourceRoot<span class="token punctuation">,</span>
    <span class="token literal-property property">needMap</span><span class="token operator">:</span> sourceMap<span class="token punctuation">,</span>
  <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token doc-comment comment">/**
  descriptor <span class="token punctuation">{</span>
    template: <span class="token punctuation">{</span> ... <span class="token punctuation">}</span>,
    script: <span class="token punctuation">{</span> ... <span class="token punctuation">}</span>,
    styles: [ ... ],
    customBlocks: [],
    errors: []
  <span class="token punctuation">}</span>
  */</span>
  <span class="token comment">// ....</span>
<span class="token punctuation">}</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><code>console.log(descriptor)</code></p>`,7),q=a(`<div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>  <span class="token literal-property property">template</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;template&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;&lt;div class=&quot;hello&quot;&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;h1&gt;{{ msg }}&lt;/h1&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;p&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    For a guide and recipes on how to configure / customize this project,&lt;br&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    check out the\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;a href=&quot;https://cli.vuejs.org&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;vue-cli documentation&lt;/a&gt;.\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;/p&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;h3&gt;Installed CLI Plugins&lt;/h3&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;ul&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-babel&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;babel&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://github.com/vuejs/vue-cli/tree/dev/packages/%40vue/cli-plugin-eslint&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;eslint&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;/ul&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;h3&gt;Essential Links&lt;/h3&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;ul&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://vuejs.org&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;Core Docs&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://forum.vuejs.org&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;Forum&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://chat.vuejs.org&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;Community Chat&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://twitter.com/vuejs&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;Twitter&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://news.vuejs.org&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;News&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;/ul&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;h3&gt;Ecosystem&lt;/h3&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;ul&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://router.vuejs.org&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;vue-router&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://vuex.vuejs.org&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;vuex&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://github.com/vuejs/vue-devtools#vue-devtools&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;vue-devtools&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://vue-loader.vuejs.org&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;vue-loader&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    &lt;li&gt;&lt;a href=&quot;https://github.com/vuejs/awesome-vue&quot; target=&quot;_blank&quot; rel=&quot;noopener&quot;&gt;awesome-vue&lt;/a&gt;&lt;/li&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  &lt;/ul&gt;\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;&lt;/div&gt;\\n&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">start</span><span class="token operator">:</span> <span class="token number">10</span><span class="token punctuation">,</span>
    <span class="token literal-property property">attrs</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">end</span><span class="token operator">:</span> <span class="token number">1681</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">script</span><span class="token operator">:</span> <span class="token punctuation">{</span>
    <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;script&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;//\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;export default {\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&quot;  name: &#39;HelloWorld&#39;,\\n&quot;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  props: {\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    msg: String\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  },\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    data(){\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    return {\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&quot;      pageName:&#39;App&#39;\\n&quot;</span> <span class="token operator">+</span>
      <span class="token string">&#39;    }\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  },\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  create(){\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&quot;      console.log(&#39;helloWorld --create&#39;)\\n&quot;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  },\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  mounted(){\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&quot;    console.log(&#39;app -- mounted&#39;)\\n&quot;</span> <span class="token operator">+</span>
      <span class="token string">&#39;  }\\n&#39;</span> <span class="token operator">+</span>
      <span class="token string">&#39;}\\n&#39;</span><span class="token punctuation">,</span>
    <span class="token literal-property property">start</span><span class="token operator">:</span> <span class="token number">1702</span><span class="token punctuation">,</span>
    <span class="token literal-property property">attrs</span><span class="token operator">:</span> <span class="token punctuation">{</span><span class="token punctuation">}</span><span class="token punctuation">,</span>
    <span class="token literal-property property">end</span><span class="token operator">:</span> <span class="token number">1942</span>
  <span class="token punctuation">}</span><span class="token punctuation">,</span>
  <span class="token literal-property property">styles</span><span class="token operator">:</span> <span class="token punctuation">[</span>
    <span class="token punctuation">{</span>
      <span class="token literal-property property">type</span><span class="token operator">:</span> <span class="token string">&#39;style&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">content</span><span class="token operator">:</span> <span class="token string">&#39;\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;h3 {\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;  margin: 40px 0 0;\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;}\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;ul {\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;  list-style-type: none;\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;  padding: 0;\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;}\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;li {\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;  display: inline-block;\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;  margin: 0 10px;\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;}\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;a {\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;  color: #42b983;\\n&#39;</span> <span class="token operator">+</span>
        <span class="token string">&#39;}\\n&#39;</span><span class="token punctuation">,</span>
      <span class="token literal-property property">start</span><span class="token operator">:</span> <span class="token number">2035</span><span class="token punctuation">,</span>
      <span class="token literal-property property">attrs</span><span class="token operator">:</span> <span class="token punctuation">[</span>Object<span class="token punctuation">]</span><span class="token punctuation">,</span>
      <span class="token literal-property property">scoped</span><span class="token operator">:</span> <span class="token boolean">true</span><span class="token punctuation">,</span>
      <span class="token literal-property property">end</span><span class="token operator">:</span> <span class="token number">2183</span>
    <span class="token punctuation">}</span>
  <span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">customBlocks</span><span class="token operator">:</span> <span class="token punctuation">[</span><span class="token punctuation">]</span><span class="token punctuation">,</span>
  <span class="token literal-property property">errors</span><span class="token operator">:</span> <span class="token punctuation">[</span> <span class="token string">&#39;tag &lt;br&gt; has no matching end tag.&#39;</span> <span class="token punctuation">]</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code><span class="token keyword">let</span> templateImport <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">var render, staticRenderFns</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token keyword">let</span> templateRequest<span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span>template<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ....</span>
  templateImport <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">import { render, staticRenderFns } from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>request<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token comment">// script</span>
<span class="token keyword">let</span> scriptImport <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">var script = {}</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span>script<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ....</span>
  scriptImport <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">import script from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>request<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">\\n</span><span class="token template-punctuation string">\`</span></span> <span class="token operator">+</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">export * from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>request<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span> <span class="token comment">// support named exports</span>
<span class="token punctuation">}</span>

<span class="token comment">// styles</span>
<span class="token keyword">let</span> stylesCode <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>descriptor<span class="token punctuation">.</span>styles<span class="token punctuation">.</span>length<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// ....</span>
<span class="token punctuation">}</span>
<span class="token keyword">let</span> code <span class="token operator">=</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">
</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>templateImport<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>scriptImport<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
</span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>stylesCode<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">
// ...
</span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
console<span class="token punctuation">.</span><span class="token function">log</span><span class="token punctuation">(</span>code<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">/*
import render from &#39;app.vue?vue&amp;type=template&#39;

import script from &#39;app.vue?vue&amp;type=script&#39;
export * from &#39;app.vue?vue&amp;type=script&#39;

import &#39;app.vue?vue&amp;type=style&amp;index=1&#39;
script.render = render
export default script

*/</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h1 id="vueloaderplugin" tabindex="-1"><a class="header-anchor" href="#vueloaderplugin" aria-hidden="true">#</a> VueLoaderPlugin</h1><p>Plugin \u7684\u4F5C\u7528\uFF0C\u4E3B\u8981\u6709\u4EE5\u4E0B\u4E24\u6761\uFF1A</p><ul><li>\u80FD\u591F hook \u5230\u5728\u6BCF\u4E2A\u7F16\u8BD1(compilation)\u4E2D\u89E6\u53D1\u7684\u6240\u6709\u5173\u952E\u4E8B\u4EF6\u3002</li><li>\u5728\u63D2\u4EF6\u5B9E\u4F8B\u7684 apply \u65B9\u6CD5\u4E2D\uFF0C\u53EF\u4EE5\u901A\u8FC7 compiler.options \u83B7\u53D6 Webpack \u914D\u7F6E\uFF0C\u5E76\u8FDB\u884C\u4FEE\u6539\u3002</li></ul><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>
<span class="token keyword">class</span> <span class="token class-name">VueLoaderPlugin</span> <span class="token punctuation">{</span>
  <span class="token function">apply</span> <span class="token punctuation">(</span><span class="token parameter">compiler</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// \u5BF9 Webpack \u914D\u7F6E\u8FDB\u884C\u4FEE\u6539</span>
    <span class="token keyword">const</span> rawRules <span class="token operator">=</span> compiler<span class="token punctuation">.</span>options<span class="token punctuation">.</span>module<span class="token punctuation">.</span>rules<span class="token punctuation">;</span>
    <span class="token keyword">const</span> <span class="token punctuation">{</span> rules <span class="token punctuation">}</span> <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">RuleSet</span><span class="token punctuation">(</span>rawRules<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token operator">...</span>

    <span class="token comment">// pitcher</span>
    <span class="token keyword">const</span> pitcher <span class="token operator">=</span> <span class="token punctuation">{</span>
      <span class="token literal-property property">loader</span><span class="token operator">:</span> require<span class="token punctuation">.</span><span class="token function">resolve</span><span class="token punctuation">(</span><span class="token string">&#39;./loaders/pitcher&#39;</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
      <span class="token function-variable function">resourceQuery</span><span class="token operator">:</span> <span class="token parameter">query</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span>query<span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token keyword">return</span> <span class="token boolean">false</span> <span class="token punctuation">}</span>
        <span class="token keyword">const</span> parsed <span class="token operator">=</span> qs<span class="token punctuation">.</span><span class="token function">parse</span><span class="token punctuation">(</span>query<span class="token punctuation">.</span><span class="token function">slice</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token comment">// \u5339\u914D\u7B2C\u4E00\u4E2A\u67E5\u8BE2\u6761\u4EF6\u662F\u5426\u662F vue</span>
        <span class="token keyword">return</span> parsed<span class="token punctuation">.</span>vue <span class="token operator">!=</span> <span class="token keyword">null</span>
      <span class="token punctuation">}</span><span class="token punctuation">,</span>
      <span class="token literal-property property">options</span><span class="token operator">:</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// \u66FF\u6362\u521D\u59CB module.rules\uFF0C\u5728\u539F\u6709 rule \u4E0A\uFF0C\u589E\u52A0 pitcher\u3001clonedRules</span>
    compiler<span class="token punctuation">.</span>options<span class="token punctuation">.</span>module<span class="token punctuation">.</span>rules <span class="token operator">=</span> <span class="token punctuation">[</span>
       pitcher<span class="token punctuation">,</span>
       <span class="token operator">...</span>clonedRules<span class="token punctuation">,</span>
       <span class="token operator">...</span>rules
     <span class="token punctuation">]</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+k+'" alt=""></p><h1 id="pitchloader" tabindex="-1"><a class="header-anchor" href="#pitchloader" aria-hidden="true">#</a> pitchLoader</h1><p><img src="'+v+'" alt=""></p><p>| \u63D0\u793A\uFF1AWebpack \u5185\u90E8\u4F1A\u4F7F\u7528 loader-runner \u8FD9\u4E2A\u5E93\u6765\u8FD0\u884C\u5DF2\u914D\u7F6E\u7684 loaders\u3002</p><p><img src="'+m+`" alt=""></p><div class="language-javascript ext-js line-numbers-mode"><pre class="language-javascript"><code>
<span class="token comment">// vue-loader lib/loaders/pitcher.js</span>

<span class="token comment">// PitcherLoader.pitch \u65B9\u6CD5\uFF0C\u6240\u6709\u5E26 ?vue \u7684\u6A21\u5757\u8BF7\u6C42\uFF0C\u90FD\u4F1A\u8D70\u5230\u8FD9\u91CC</span>
module<span class="token punctuation">.</span>exports<span class="token punctuation">.</span><span class="token function-variable function">pitch</span> <span class="token operator">=</span> <span class="token keyword">function</span> <span class="token punctuation">(</span><span class="token parameter">remainingRequest</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token comment">// \u5982 ./demo?vue&amp;type=script&amp;lang=js</span>
  <span class="token comment">// \u6B64\u65F6\uFF0Cloaders \u662F\u6240\u6709\u80FD\u5904\u7406 .vue \u548C .xxx \u7684 loader \u5217\u8868</span>
  <span class="token keyword">let</span> loaders <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>loaders<span class="token punctuation">;</span>
  <span class="token operator">...</span>
  <span class="token comment">// \u5F97\u5230 -!babel-loader!vue-loader!</span>
  <span class="token keyword">const</span> <span class="token function-variable function">genRequest</span> <span class="token operator">=</span> <span class="token parameter">loaders</span> <span class="token operator">=&gt;</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span><span class="token punctuation">;</span>

  <span class="token comment">// \u5904\u7406 style \u5757 \u548C template \u5757\uFF0C\u652F\u6301</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&#39;style&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>query<span class="token punctuation">.</span>type <span class="token operator">===</span> <span class="token string">&#39;template&#39;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token operator">...</span> <span class="token punctuation">}</span>

  <span class="token comment">// \u5904\u7406 script \u5757\u548C custom \u5757</span>
  <span class="token keyword">return</span> <span class="token template-string"><span class="token template-punctuation string">\`</span><span class="token string">import mod from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>request<span class="token interpolation-punctuation punctuation">}</span></span><span class="token string">; export default mod; export * from </span><span class="token interpolation"><span class="token interpolation-punctuation punctuation">\${</span>request<span class="token interpolation-punctuation punctuation">}</span></span><span class="token template-punctuation string">\`</span></span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><img src="`+g+'" alt=""></p>',13);function h(f,_){const t=n("el-collapse-item"),e=n("el-collapse");return o(),l("div",null,[y,s(e,null,{default:i(()=>[s(t,{title:"console.log(descriptor)",name:"1"})]),_:1}),q])}const j=p(b,[["render",h],["__file","vue-loader.html.vue"]]);export{j as default};
