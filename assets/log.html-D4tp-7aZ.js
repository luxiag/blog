import{_ as n,c as l,a,o as e}from"./app-CBs_XKfp.js";const o="/blog/assets/847001911061912323-BUlCudg4.png",p="/blog/assets/831001911061912323-BfBKvue0.png",t="/blog/assets/655003611061912323-DHpKr86M.png",F={};function c(r,s){return e(),l("div",null,s[0]||(s[0]=[a(`<h2 id="日志" tabindex="-1"><a class="header-anchor" href="#日志"><span>日志</span></a></h2><p>日志记录是将应用程序运行生成的信息记录到日志文件中的过程，保存在日志文件中的记录称为日志，日志是一种保存应用程序信息的简单方法。</p><p>Debug(调试)、问题定位、用户行为、现场记录与根因分析</p><p>Console的底层</p><p>Process.stdout.write</p><p>Nodejs日志的原理</p><h3 id="console" tabindex="-1"><a class="header-anchor" href="#console"><span>console</span></a></h3><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">console.</span><span style="color:#50FA7B;">log</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">Hello there</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#8BE9FD;font-style:italic;">Console</span><span style="color:#F8F8F2;">.prototype.</span><span style="color:#50FA7B;">log</span><span style="color:#FF79C6;"> =</span><span style="color:#FF79C6;"> function</span><span style="color:#F8F8F2;"> () {</span></span>
<span class="line"><span style="color:#BD93F9;font-style:italic;">    this</span><span style="color:#F8F8F2;">._stdout.</span><span style="color:#50FA7B;">write</span><span style="color:#F8F8F2;">(util.format.</span><span style="color:#50FA7B;">apply</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;font-style:italic;">this</span><span style="color:#F8F8F2;">,</span><span style="color:#BD93F9;font-style:italic;">arguments</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">+</span><span style="color:#E9F284;"> &#39;</span><span style="color:#FF79C6;">\\n</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">}</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>底层调用process.stdout.write,stdin,stdout</p><p>process.stdout.write</p><ul><li>文件: 在Windows和POSIX上同步的</li><li>TTY(终端):在Windows上是异步的，在POSIX上是同步的</li><li>管道（和套接字）:在Windows上是同步的，在POSIX上是异步的</li><li>POSIX: Mac OS，Unix,Linux</li></ul><p><strong>日志写入文件</strong></p><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">fs.</span><span style="color:#50FA7B;">writeFile</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">log.txt</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">,</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">message</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">,</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">utf8</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">,callback)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">fs.</span><span style="color:#50FA7B;">readFile</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">log.txt</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">,{encoding</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">utf8</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">},(</span><span style="color:#FFB86C;font-style:italic;">err</span><span style="color:#F8F8F2;">,</span><span style="color:#FFB86C;font-style:italic;">data</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">    fs.</span><span style="color:#50FA7B;">writeFile</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">log.txt</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">,newData,</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">utf8</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">,callback)</span></span>
<span class="line"><span style="color:#F8F8F2;">})</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>写入新日志会打开一个文件，将所有文件数据加载到内存中，在打开同一文件写入新数据</p><p><code>appendFile</code></p><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#F8F8F2;">fs.</span><span style="color:#50FA7B;">appendFile</span><span style="color:#FF79C6;"> =</span><span style="color:#FF79C6;"> function</span><span style="color:#F8F8F2;">(</span><span style="color:#FFB86C;font-style:italic;">path</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">data</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">options</span><span style="color:#F8F8F2;">, </span><span style="color:#FFB86C;font-style:italic;">callback_</span><span style="color:#F8F8F2;">) {</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#FF79C6;">  var</span><span style="color:#F8F8F2;"> callback </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> maybeCallback</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;font-style:italic;">arguments</span><span style="color:#F8F8F2;">[</span><span style="color:#BD93F9;font-style:italic;">arguments</span><span style="color:#F8F8F2;">.length </span><span style="color:#FF79C6;">-</span><span style="color:#BD93F9;"> 1</span><span style="color:#F8F8F2;">]);</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#FF79C6;">  if</span><span style="color:#F8F8F2;"> (util.</span><span style="color:#50FA7B;">isFunction</span><span style="color:#F8F8F2;">(options) </span><span style="color:#FF79C6;">||</span><span style="color:#FF79C6;"> !</span><span style="color:#F8F8F2;">options) {</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#F8F8F2;">    options </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> { encoding</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">utf8</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">, mode</span><span style="color:#FF79C6;">:</span><span style="color:#BD93F9;"> 438</span><span style="color:#6272A4;"> /*=0666*/</span><span style="color:#F8F8F2;">, flag</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">a</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;"> };</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#F8F8F2;">  } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (util.</span><span style="color:#50FA7B;">isString</span><span style="color:#F8F8F2;">(options)) {</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#F8F8F2;">    options </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> { encoding</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> options, mode</span><span style="color:#FF79C6;">:</span><span style="color:#BD93F9;"> 438</span><span style="color:#F8F8F2;">, flag</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">a</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;"> };</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#F8F8F2;">  } </span><span style="color:#FF79C6;">else</span><span style="color:#FF79C6;"> if</span><span style="color:#F8F8F2;"> (</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">util.</span><span style="color:#50FA7B;">isObject</span><span style="color:#F8F8F2;">(options)) {</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#FF79C6;">    throw</span><span style="color:#FF79C6;font-weight:bold;"> new</span><span style="color:#50FA7B;"> TypeError</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">Bad arguments</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#FF79C6;">  if</span><span style="color:#F8F8F2;"> (</span><span style="color:#FF79C6;">!</span><span style="color:#F8F8F2;">options.flag)</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#F8F8F2;">    options </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> util.</span><span style="color:#50FA7B;">_extend</span><span style="color:#F8F8F2;">({ flag</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;"> &#39;</span><span style="color:#F1FA8C;">a</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;"> }, options);</span></span>
<span class="line"><span style="color:#F8F8F2;"> </span></span>
<span class="line"><span style="color:#F8F8F2;">  fs.</span><span style="color:#50FA7B;">writeFile</span><span style="color:#F8F8F2;">(path, data, options, callback);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>打开一个文件，获取文件句柄（fd)</li><li>将数据写入文件</li></ul><p>文件句柄:进程每新打开一个文件，系统会分配一个新的文件描述符（FD）</p><p>appendFile在每次需要写日志时都会打开一个文件，高并发会导致EMFILE错误</p><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> log </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> fs.</span><span style="color:#50FA7B;">createWriteStream</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">log.txt</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">,{flags</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">a</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">})</span></span>
<span class="line"><span style="color:#F8F8F2;">log.</span><span style="color:#50FA7B;">write</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">new entry</span><span style="color:#FF79C6;">\\n</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">)</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="服务器应用日志" tabindex="-1"><a class="header-anchor" href="#服务器应用日志"><span>服务器应用日志</span></a></h2><h2 id="日志的级别介绍" tabindex="-1"><a class="header-anchor" href="#日志的级别介绍"><span>日志的级别介绍</span></a></h2><ul><li><p>ALL 最低等级的，用于打开所有日志记录。</p></li><li><p>TRACE designates finer-grained informational events than the DEBUG.Since:1.2.12，很低的日志级别，一般不会使用。</p></li><li><p>DEBUG 指出细粒度信息事件对调试应用程序是非常有帮助的，主要用于开发过程中打印一些运行信息。</p></li><li><p>INFO 消息在粗粒度级别上突出强调应用程序的运行过程。打印一些你感兴趣的或者重要的信息，这个可以用于生产环境中输出程序运行的一些重要信息，但是不能滥用，避免打印过多的日志。</p></li><li><p>WARN 表明会出现潜在错误的情形，有些信息不是错误信息，但是也要给程序员的一些提示。</p></li><li><p>ERROR 指出虽然发生错误事件，但仍然不影响系统的继续运行。打印错误和异常信息，如果不想输出太多的日志，可以使用这个级别。</p></li><li><p>FATAL 指出每个严重的错误事件将会导致应用程序的退出。这个级别比较高了。重大错误，这种级别你可以直接停止程序了。</p></li><li><p>OFF 最高等级的，用于关闭所有日志记录。</p></li></ul><h3 id="好的日志" tabindex="-1"><a class="header-anchor" href="#好的日志"><span>好的日志</span></a></h3><ul><li>时间戳</li><li>计算机/服务器名称/ip</li><li>进程ID</li><li>消息，报错</li><li>堆栈跟踪</li><li>上下文</li></ul><h3 id="避免" tabindex="-1"><a class="header-anchor" href="#避免"><span>避免</span></a></h3><ul><li>不应该会产生异常</li><li>不应该产生副作用</li><li>不应该带敏感信息</li></ul><h2 id="日志切割技术-logrotate" tabindex="-1"><a class="header-anchor" href="#日志切割技术-logrotate"><span>日志切割技术（logrotate）</span></a></h2><ul><li>定时切割</li><li>按大小切割</li></ul><h3 id="create-copytruncate" tabindex="-1"><a class="header-anchor" href="#create-copytruncate"><span>create/copytruncate</span></a></h3><p>create</p><ul><li>将test.log重命名为test.log.1</li><li>创建一个新的test.log文件</li></ul><p>copytruncate</p><ul><li>将test.log拷贝一份为test.log.1</li><li>将test.log清空</li></ul><figure><img src="`+o+'" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><figure><img src="'+p+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><h2 id="命令行日志" tabindex="-1"><a class="header-anchor" href="#命令行日志"><span>命令行日志</span></a></h2><h3 id="彩色日志" tabindex="-1"><a class="header-anchor" href="#彩色日志"><span>彩色日志</span></a></h3><p>\\033+背景颜色+颜色+m作为前缀</p><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> chalk </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> require</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">chalk</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#6272A4;">//禁止打印彩色</span></span>
<span class="line"><span style="color:#F8F8F2;">console.</span><span style="color:#50FA7B;">log</span><span style="color:#F8F8F2;">(process.stdout.isTTY)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> ProgressBar </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> require</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&#39;</span><span style="color:#F1FA8C;">process</span><span style="color:#E9F284;">&#39;</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">process.stdout.</span><span style="color:#50FA7B;">cursorTo</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">0</span><span style="color:#F8F8F2;">)</span></span>
<span class="line"><span style="color:#F8F8F2;">process.stdout.</span><span style="color:#50FA7B;">write</span><span style="color:#F8F8F2;">(str)</span></span>
<span class="line"><span style="color:#F8F8F2;">process.stdout.</span><span style="color:#50FA7B;">clearLine</span><span style="color:#F8F8F2;">(</span><span style="color:#BD93F9;">1</span><span style="color:#F8F8F2;">);</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>inquirer.js:交互式命令行 blessed-contrib:命令行图表 commander.js:命令行基础库 cfonts:命令行大logo</p><h2 id="elk" tabindex="-1"><a class="header-anchor" href="#elk"><span>ELK</span></a></h2><figure><img src="`+t+`" alt="" tabindex="0" loading="lazy"><figcaption></figcaption></figure><p>“ELK”是三个开源项目的首字母缩写，这三个项目分别是：Elasticsearch、Logstash 和 Kibana。</p><ul><li>Elasticsearch 是一个搜索和分析引擎。</li><li>Logstash 是服务器端数据处理管道，能够同时从多个来源采集数据，转换数据，然后将数据发送到诸如 Elasticsearch 等“存储库”中。</li><li>Kibana 则可以让用户在 Elasticsearch 中使用图形和图表对数据进行可视化。</li></ul><div class="language-js line-numbers-mode" data-highlighter="shiki" data-ext="js" data-title="js" style="background-color:#282A36;color:#F8F8F2;"><pre class="shiki dracula vp-code"><code><span class="line"></span>
<span class="line"><span style="color:#6272A4;">//https://github.com/deviantony/docker-elk</span></span>
<span class="line"><span style="color:#FF79C6;">import</span><span style="color:#F8F8F2;"> express </span><span style="color:#FF79C6;">from</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">express</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">import</span><span style="color:#F8F8F2;"> log4js </span><span style="color:#FF79C6;">from</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">log4js</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">import</span><span style="color:#BD93F9;"> *</span><span style="color:#FF79C6;"> as</span><span style="color:#F8F8F2;"> homeController </span><span style="color:#FF79C6;">from</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">./controllers/home</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> app </span><span style="color:#FF79C6;">=</span><span style="color:#50FA7B;"> express</span><span style="color:#F8F8F2;">();</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> PORT</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> number</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> app.</span><span style="color:#50FA7B;">get</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">port</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">) </span><span style="color:#FF79C6;">||</span><span style="color:#BD93F9;"> 3000</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> ENV</span><span style="color:#FF79C6;">:</span><span style="color:#8BE9FD;font-style:italic;"> string</span><span style="color:#FF79C6;"> =</span><span style="color:#F8F8F2;"> app.</span><span style="color:#50FA7B;">get</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">env</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">log4js.</span><span style="color:#50FA7B;">configure</span><span style="color:#F8F8F2;">({</span></span>
<span class="line"><span style="color:#F8F8F2;">  appenders</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">    console</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> { type</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">console</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;"> },</span></span>
<span class="line"><span style="color:#6272A4;">    // file: { type: &quot;file&quot;, filename: &quot;all-the-logs.log&quot; },</span></span>
<span class="line"><span style="color:#6272A4;">    // https://github.com/Aigent/log4js-logstash-tcp</span></span>
<span class="line"><span style="color:#F8F8F2;">    elk_learn</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">      type</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">log4js-logstash-tcp</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">      host</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">127.0.0.1</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">,</span></span>
<span class="line"><span style="color:#F8F8F2;">      port</span><span style="color:#FF79C6;">:</span><span style="color:#BD93F9;"> 5000</span></span>
<span class="line"><span style="color:#F8F8F2;">    }</span></span>
<span class="line"><span style="color:#F8F8F2;">  },</span></span>
<span class="line"><span style="color:#F8F8F2;">  categories</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">    default</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> { appenders</span><span style="color:#FF79C6;">:</span><span style="color:#F8F8F2;"> [</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">elk_learn</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">], level</span><span style="color:#FF79C6;">:</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">debug</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;"> }</span></span>
<span class="line"><span style="color:#F8F8F2;">  }</span></span>
<span class="line"><span style="color:#F8F8F2;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> logger </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> log4js.</span><span style="color:#50FA7B;">getLogger</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">default</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">logger.level </span><span style="color:#FF79C6;">=</span><span style="color:#E9F284;"> &quot;</span><span style="color:#F1FA8C;">debug</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">;</span></span>
<span class="line"></span>
<span class="line"><span style="color:#F8F8F2;">app.</span><span style="color:#50FA7B;">get</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">/index</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">, homeController.index);</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">const</span><span style="color:#F8F8F2;"> server </span><span style="color:#FF79C6;">=</span><span style="color:#F8F8F2;"> app.</span><span style="color:#50FA7B;">listen</span><span style="color:#F8F8F2;">(PORT, () </span><span style="color:#FF79C6;">=&gt;</span><span style="color:#F8F8F2;"> {</span></span>
<span class="line"><span style="color:#F8F8F2;">  logger.</span><span style="color:#50FA7B;">info</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">App is running at http://localhost:%d in %s mode</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">, PORT, ENV);</span></span>
<span class="line"><span style="color:#F8F8F2;">  logger.</span><span style="color:#50FA7B;">info</span><span style="color:#F8F8F2;">(</span><span style="color:#E9F284;">&quot;</span><span style="color:#F1FA8C;">Press CTRL-C to stop</span><span style="color:#FF79C6;">\\n</span><span style="color:#E9F284;">&quot;</span><span style="color:#F8F8F2;">);</span></span>
<span class="line"><span style="color:#F8F8F2;">});</span></span>
<span class="line"></span>
<span class="line"><span style="color:#FF79C6;">export</span><span style="color:#FF79C6;"> default</span><span style="color:#F8F8F2;"> server;</span></span></code></pre><div class="line-numbers" aria-hidden="true" style="counter-reset:line-number 0;"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="sentry" tabindex="-1"><a class="header-anchor" href="#sentry"><span>Sentry</span></a></h2><h2 id="sentry和elk" tabindex="-1"><a class="header-anchor" href="#sentry和elk"><span>Sentry和ELK</span></a></h2><p>ELK一般适用于收集、整理全量日志，并且对日志内容进行切分并存储起来</p><p>Sentry不会收集全量日志，他只会在你主动上报给他的时候进行收集处理</p><p>分析类（行为日志分析，访问日志分析，流量分析）以及大规模的日志存储和检索合适使用ELK</p><p>预警类如错误监控，异常监控，波动预警等合适使用Sentry进行处理</p>`,52)]))}const y=n(F,[["render",c],["__file","log.html.vue"]]),d=JSON.parse('{"path":"/nodejs/log.html","title":"NodeJS中的日志","lang":"en-US","frontmatter":{"title":"NodeJS中的日志","category":["NodeJS"],"date":"2023-06-19T00:00:00.000Z","description":"日志 日志记录是将应用程序运行生成的信息记录到日志文件中的过程，保存在日志文件中的记录称为日志，日志是一种保存应用程序信息的简单方法。 Debug(调试)、问题定位、用户行为、现场记录与根因分析 Console的底层 Process.stdout.write Nodejs日志的原理 console 底层调用process.stdout.write,st...","head":[["meta",{"property":"og:url","content":"https://luxiag.github.io/luxiag/blog/nodejs/log.html"}],["meta",{"property":"og:title","content":"NodeJS中的日志"}],["meta",{"property":"og:description","content":"日志 日志记录是将应用程序运行生成的信息记录到日志文件中的过程，保存在日志文件中的记录称为日志，日志是一种保存应用程序信息的简单方法。 Debug(调试)、问题定位、用户行为、现场记录与根因分析 Console的底层 Process.stdout.write Nodejs日志的原理 console 底层调用process.stdout.write,st..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2023-06-21T03:33:01.000Z"}],["meta",{"property":"article:published_time","content":"2023-06-19T00:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-06-21T03:33:01.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"NodeJS中的日志\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-06-19T00:00:00.000Z\\",\\"dateModified\\":\\"2023-06-21T03:33:01.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"luxiag\\",\\"url\\":\\"https://luxiag.github.io/luxiag\\"}]}"]]},"headers":[{"level":2,"title":"日志","slug":"日志","link":"#日志","children":[{"level":3,"title":"console","slug":"console","link":"#console","children":[]}]},{"level":2,"title":"服务器应用日志","slug":"服务器应用日志","link":"#服务器应用日志","children":[]},{"level":2,"title":"日志的级别介绍","slug":"日志的级别介绍","link":"#日志的级别介绍","children":[{"level":3,"title":"好的日志","slug":"好的日志","link":"#好的日志","children":[]},{"level":3,"title":"避免","slug":"避免","link":"#避免","children":[]}]},{"level":2,"title":"日志切割技术（logrotate）","slug":"日志切割技术-logrotate","link":"#日志切割技术-logrotate","children":[{"level":3,"title":"create/copytruncate","slug":"create-copytruncate","link":"#create-copytruncate","children":[]}]},{"level":2,"title":"命令行日志","slug":"命令行日志","link":"#命令行日志","children":[{"level":3,"title":"彩色日志","slug":"彩色日志","link":"#彩色日志","children":[]}]},{"level":2,"title":"ELK","slug":"elk","link":"#elk","children":[]},{"level":2,"title":"Sentry","slug":"sentry","link":"#sentry","children":[]},{"level":2,"title":"Sentry和ELK","slug":"sentry和elk","link":"#sentry和elk","children":[]}],"git":{"createdTime":1687318381000,"updatedTime":1687318381000,"contributors":[{"name":"卢祥","email":"example@qq.com","commits":1}]},"readingTime":{"minutes":4.08,"words":1223},"filePathRelative":"nodejs/log.md","localizedDate":"June 19, 2023","excerpt":"<h2>日志</h2>\\n<p>日志记录是将应用程序运行生成的信息记录到日志文件中的过程，保存在日志文件中的记录称为日志，日志是一种保存应用程序信息的简单方法。</p>\\n<p>Debug(调试)、问题定位、用户行为、现场记录与根因分析</p>","autoDesc":true}');export{y as comp,d as data};