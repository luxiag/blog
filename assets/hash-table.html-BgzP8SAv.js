import{_ as a,c as e,a as l,o as t}from"./app-CBs_XKfp.js";const n={};function o(p,s){return t(),e("div",null,s[0]||(s[0]=[l(`<h1 id="散列表" tabindex="-1"><a class="header-anchor" href="#散列表"><span>散列表</span></a></h1><p>打造一个让你能够迅速获悉商品价格的工具</p><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> table </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> [];</span></span>
<span class="line"><span style="color:#F8F8F2;">table[</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">apple</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">] </span><span style="color:#FF79C6;">=</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">5块</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#F8F8F2;">table[</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">milk</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">] </span><span style="color:#FF79C6;">=</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">4块</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,3)]))}const c=a(n,[["render",o],["__file","hash-table.html.vue"]]),i=JSON.parse('{"path":"/algorithm/hash-table.html","title":"散列表","lang":"en-US","frontmatter":{"title":"散列表","date":"2022-09-23T00:00:00.000Z","category":["算法"],"tag":["算法图解"],"description":"散列表 打造一个让你能够迅速获悉商品价格的工具","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/algorithm/hash-table.html"}],["meta",{"property":"og:title","content":"散列表"}],["meta",{"property":"og:description","content":"散列表 打造一个让你能够迅速获悉商品价格的工具"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2022-10-07T12:55:53.000Z"}],["meta",{"property":"article:tag","content":"算法图解"}],["meta",{"property":"article:published_time","content":"2022-09-23T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2022-10-07T12:55:53.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"散列表\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2022-09-23T00:00:00.000Z\\",\\"dateModified\\":\\"2022-10-07T12:55:53.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"headers":[],"git":{"createdTime":1663833246000,"updatedTime":1665147353000,"contributors":[{"name":"卢祥","email":"example@gmail.com","commits":3},{"name":"luxiang","email":"luxiag@qq.com","commits":2}]},"readingTime":{"minutes":0.16,"words":49},"filePathRelative":"algorithm/hash-table.md","localizedDate":"September 23, 2022","excerpt":"\\n<p>打造一个让你能够迅速获悉商品价格的工具</p>\\n<div class=\\"language-js line-numbers-mode\\" data-highlighter=\\"shiki\\" data-ext=\\"js\\" data-title=\\"js\\" style=\\"background-color:#282A36;color:#F8F8F2\\"><pre class=\\"shiki dracula vp-code\\"><code><span class=\\"line\\"><span style=\\"color:#FF79C6\\">const</span><span style=\\"color:#F8F8F2\\"> table </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#F8F8F2\\"> [];</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">table[</span><span style=\\"color:#E9F284\\">\\"</span><span style=\\"color:#F1FA8C\\">apple</span><span style=\\"color:#E9F284\\">\\"</span><span style=\\"color:#F8F8F2\\">] </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#E9F284\\"> \\"</span><span style=\\"color:#F1FA8C\\">5块</span><span style=\\"color:#E9F284\\">\\"</span><span style=\\"color:#F8F8F2\\">;</span></span>\\n<span class=\\"line\\"><span style=\\"color:#F8F8F2\\">table[</span><span style=\\"color:#E9F284\\">\\"</span><span style=\\"color:#F1FA8C\\">milk</span><span style=\\"color:#E9F284\\">\\"</span><span style=\\"color:#F8F8F2\\">] </span><span style=\\"color:#FF79C6\\">=</span><span style=\\"color:#E9F284\\"> \\"</span><span style=\\"color:#F1FA8C\\">4块</span><span style=\\"color:#E9F284\\">\\"</span><span style=\\"color:#F8F8F2\\">;</span></span></code></pre>\\n<div class=\\"line-numbers\\" aria-hidden=\\"true\\" style=\\"counter-reset:line-number 0\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{c as comp,i as data};