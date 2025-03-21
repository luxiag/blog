---
title: 浏览器的工作原理
category:
    - Browse
date: 2022-06-13
---
# 解析

![](./images/618005603122242222.png)

# 工作原理

## [导航](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E5%AF%BC%E8%88%AA)

*导航*是加载 web 页面的第一步。它发生在以下情形：用户通过在地址栏输入一个 URL、点击一个链接、提交表单或者是其他的行为。

Web 性能优化的目标之一就是缩短导航完成所花费的时间，在理想情况下，它通常不会花费太多的时间，但是等待时间和带宽会导致它的延时。

### [DNS 查询](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#dns_%E6%9F%A5%E8%AF%A2)

对于一个 web 页面来说导航的第一步是要去寻找页面资源的位置。如果导航到 `https://example.com`，HTML 页面被定位到 IP 地址为 `93.184.216.34` 的服务器。如果以前没有访问过这个网站，就需要进行 DNS 查询。

浏览器向**名称服务器**发起 DNS 查询请求，最终得到一个 IP 地址。第一次请求之后，这个 IP 地址可能会被缓存一段时间，这样可以通过从缓存里面检索 IP 地址而不是再通过名称服务器进行查询来加速后续的请求。

通过主机名加载一个页面通常仅需要一次 DNS 查询。但是，对于页面指向的不同的主机名，则需要多次 DNS 查询。如果字体（fonts）、图像（images）、脚本（scripts）、广告（ads）和网站统计（metrics）都有不同的主机名，则需要对每一个主机名进行 DNS 查询。

![https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/latency.jpg](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/latency.jpg)

DNS 查询可能存在性能问题，特别是对于移动网络。当一个用户使用了移动网络，每一个 DNS 查询必须从手机发送到基站，然后到达一个认证的 DNS 服务器。手机、信号塔、名称服务器之间的距离可能是一个大的时间等待。

### [TCP 握手](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#tcp_%E6%8F%A1%E6%89%8B)

一旦获取到服务器 IP 地址，浏览器就会通过 [TCP “三次握手” (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/TCP_handshake)与服务器建立连接。这个机制的是用来让两端尝试进行通信——在浏览器和服务器通过上层协议 [HTTPS](https://developer.mozilla.org/zh-CN/docs/Glossary/https) 发送数据之前，可以协商网络 TCP 套接字连接的一些参数。

TCP 的“三次握手”技术经常被称为“SYN-SYN-ACK”——更确切的说是 SYN、SYN-ACK、ACK——因为通过 TCP 首先发送了三个消息进行协商，然后在两台电脑之间开始一个 TCP 会话。是的，这意味着终端与每台服务器之间还要来回发送三条消息，而请求尚未发出。

### [TLS 协商](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#tls_%E5%8D%8F%E5%95%86)

为了在 HTTPS 上建立安全连接，另一种握手是必须的。更确切的说是 [TLS](https://developer.mozilla.org/zh-CN/docs/Glossary/TLS) 协商，它决定了什么密码将会被用来加密通信，验证服务器，在进行真实的数据传输之前建立安全连接。在发送真正的请求内容之前还需要三次往返服务器。

![https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/ssl.jpg](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/ssl.jpg)

虽然建立安全连接对增加了加载页面的等待时间，对于建立一个安全的连接来说，以增加等待时间为代价是值得的，因为在浏览器和 web 服务器之间传输的数据不可以被第三方解密。

经过 8 次往返，浏览器终于可以发出请求。

## [响应](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E5%93%8D%E5%BA%94)

一旦我们建立了到 web 服务器的连接，浏览器就代表用户发送一个初始的 [HTTP `GET` 请求](https://developer.mozilla.org/zh-CN/docs/Web/HTTP/Methods)，对于网站来说，这个请求通常是一个 HTML 文件。一旦服务器收到请求，它将使用相关的响应头和 HTML 的内容进行回复。

`<!doctype HTML><html><head><meta charset="UTF-8"/><title>My simple page</title><link rel="stylesheet" src="styles.css"/><script src="myscript.js"></script></head><body><h1 class="heading">My Page</h1><p>A paragraph with a <a href="https://example.com/about">link</a></p><div><img src="myimage.jpg" alt="image description"/></div><script src="anotherscript.js"></script></body></html>`Copy to Clipboard

初始请求的响应包含所接收数据的第一个字节。[Time to First Byte](https://developer.mozilla.org/zh-CN/docs/Glossary/time_to_first_byte)（TTFB）是用户通过点击链接进行请求与收到第一个 HTML 数据包之间的时间。第一个内容分块通常是 14KB 的数据。

上面的例子中，这个请求肯定是小于 14KB 的，但是直到浏览器在解析阶段遇到链接时才会去请求链接的资源，下面有进行描述。

### [TCP 慢启动 / 14KB 规则](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#tcp_%E6%85%A2%E5%90%AF%E5%8A%A8_14kb_%E8%A7%84%E5%88%99)

第一个响应数据包是 14KB 大小的。这是慢启动的一部分，慢启动是一种均衡网络连接速度的算法。慢启动逐渐增加发送数据的数量直到达到网络的最大带宽。

在 [TCP 慢启动](https://developer.mozilla.org/zh-CN/docs/Glossary/TCP_slow_start) 中，在收到初始包之后，服务器会将下一个数据包的大小加倍到大约 28KB。后续的数据包依次是前一个包大小的二倍直到达到预定的阈值，或者遇到拥塞。

![https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/congestioncontrol.jpg](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/congestioncontrol.jpg)

如果您听说过初始页面加载的 14KB 规则，TCP 慢启动就是初始响应为 14KB 的原因，也是为什么 web 性能优化需要将此初始 14KB 响应作为优化重点的原因。TCP 慢启动逐渐建立适合网络能力的传输速度，以避免拥塞。

### [拥塞控制](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E6%8B%A5%E5%A1%9E%E6%8E%A7%E5%88%B6)

当服务器用 TCP 数据包来发送数据时，客户端通过返回确认帧来确认传输。由于硬件和网络条件，连接的容量是有限的。如果服务器太快地发送太多的包，它们可能会被丢弃。这意味着，将不会有确认帧的返回。服务器把它们当做确认帧丢失。拥塞控制算法使用这个发送包和确认帧流来确定发送速率。

## [解析](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E8%A7%A3%E6%9E%90)

一旦浏览器收到数据的第一块，它就可以开始解析收到的信息。[“解析”](https://developer.mozilla.org/zh-CN/docs/Glossary/Parse)是浏览器将通过网络接收的数据转换为 [DOM](https://developer.mozilla.org/zh-CN/docs/Glossary/DOM) 和 [CSSOM](https://developer.mozilla.org/zh-CN/docs/Glossary/CSSOM) 的步骤，通过渲染器把 DOM 和 CSSOM 在屏幕上绘制成页面。

DOM 是浏览器标记的内部表示。DOM 也是被暴露的，可以通过 JavaScript 中的各种 API 进行 DOM 操作。

即使请求页面的 HTML 大于初始的 14KB 数据包，浏览器也将开始解析并尝试根据其拥有的数据进行渲染。这就是为什么在前 14KB 中包含浏览器开始渲染页面所需的所有内容，或者至少包含页面模板（第一次渲染所需的 CSS 和 HTML ）对于 web 性能优化来说是重要的。但是在渲染到屏幕上面之前，HTML、CSS、JavaScript 必须被解析完成。

### [构建 DOM 树](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E6%9E%84%E5%BB%BA_dom_%E6%A0%91)

我们描述五个步骤在[关键渲染路径](https://developer.mozilla.org/zh-CN/docs/Web/Performance/Critical_rendering_path)这篇文章中。

第一步是处理 HTML 标记并构造 DOM 树。HTML 解析涉及到 [tokenization](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMTokenList) 和树的构造。HTML 标记包括开始和结束标记，以及属性名和值。 如果文档格式良好，则解析它会简单而快速。解析器将标记化的输入解析到文档中，构建文档树。

DOM 树描述了文档的内容。[`<html>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/html) 元素是第一个标签也是文档树的根节点。树反映了不同标记之间的关系和层次结构。嵌套在其他标记中的标记是子节点。DOM 节点的数量越多，构建 DOM 树所需的时间就越长。

![https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/dom.gif](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/dom.gif)

当解析器发现非阻塞资源，例如一张图片，浏览器会请求这些资源并且继续解析。当遇到一个 CSS 文件时，解析也可以继续进行，但是对于 `<script>` 标签（特别是没有 [`async`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Statements/async_function) 或者 `defer` 属性的）会阻塞渲染并停止 HTML 的解析。尽管浏览器的预加载扫描器加速了这个过程，但过多的脚本仍然是一个重要的瓶颈。

### [预加载扫描器](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E9%A2%84%E5%8A%A0%E8%BD%BD%E6%89%AB%E6%8F%8F%E5%99%A8)

浏览器构建 DOM 树时，这个过程占用了主线程。当这种情况发生时，预加载扫描仪将解析可用的内容并请求高优先级资源，如 CSS、JavaScript 和 web 字体。多亏了预加载扫描器，我们不必等到解析器找到对外部资源的引用来请求它。它将在后台检索资源，以便在主 HTML 解析器到达请求的资源时，它们可能已经在运行，或者已经被下载。预加载扫描仪提供的优化减少了阻塞。

`<link rel="stylesheet" src="styles.css"/><script src="myscript.js" async></script><img src="myimage.jpg" alt="image description"/><script src="anotherscript.js" async></script>`Copy to Clipboard

在这个例子中，当主线程在解析 HTML 和 CSS 时，预加载扫描器将找到脚本和图像，并开始下载它们。为了确保脚本不会阻塞进程，当 JavaScript 解析和执行顺序不重要时，可以添加 `async` 属性或 `defer` 属性。

等待获取 CSS 不会阻塞 HTML 的解析或者下载，但是它确实会阻塞 JavaScript，因为 JavaScript 经常用于查询元素的 CSS 属性。

### [构建 CSSOM 树](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E6%9E%84%E5%BB%BA_cssom_%E6%A0%91)

第二步是处理 CSS 并构建 CSSOM 树。CSS 对象模型和 DOM 是相似的。DOM 和 CSSOM 是两棵树。它们是独立的数据结构。浏览器将 CSS 规则转换为可以理解和使用的样式映射。浏览器遍历 CSS 中的每个规则集，根据 CSS 选择器创建具有父、子和兄弟关系的节点树。

与 HTML 一样，浏览器需要将接收到的 CSS 规则转换为可以使用的内容。因此，它重复了 HTML 到对象的过程，但对于 CSS。

CSSOM 树包括来自用户代理样式表的样式。浏览器从适用于节点的最通用规则开始，并通过应用更具体的规则递归地优化计算的样式。换句话说，它级联属性值。

构建 CSSOM 非常非常快，并且在当前的开发工具中没有以独特的颜色显示。相反，开发人员工具中的“重新计算样式”显示解析 CSS、构建 CSSOM 树和递归计算计算样式所需的总时间。在 web 性能优化方面，它是可轻易实现的，因为创建 CSSOM 的总时间通常小于一次 DNS 查询所需的时间。

### [其他过程](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E5%85%B6%E4%BB%96%E8%BF%87%E7%A8%8B)

### JavaScript 编译

当 CSS 被解析并创建 CSSOM 时，其他资源，包括 JavaScript 文件正在下载（借助预加载扫描器）。JavaScript 被解释、编译、解析和执行。脚本被解析为抽象语法树。一些浏览器引擎使用[抽象语法树](https://zh.wikipedia.org/wiki/%E6%8A%BD%E8%B1%A1%E8%AF%AD%E6%B3%95%E6%A0%91)并将其传递到解释器中，输出在主线程上执行的字节码。这就是所谓的 JavaScript 编译。

### 构建辅助功能树

浏览器还构建辅助设备用于分析和解释内容的辅助功能（[accessibility](https://developer.mozilla.org/zh-CN/docs/learn/Accessibility)）树。可访问性对象模型（AOM）类似于 DOM 的语义版本。当 DOM 更新时，浏览器会更新辅助功能树。辅助技术本身无法修改可访问性树。

在构建 AOM 之前，屏幕阅读器（[screen readers (en-US)](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Screen_Reader_Implementors_Guide)）无法访问内容。

## [渲染](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E6%B8%B2%E6%9F%93)

渲染步骤包括样式、布局、绘制，在某些情况下还包括合成。在解析步骤中创建的 CSSOM 树和 DOM 树组合成一个 Render 树，然后用于计算每个可见元素的布局，然后将其绘制到屏幕上。在某些情况下，可以将内容提升到它们自己的层并进行合成，通过在 GPU 而不是 CPU 上绘制屏幕的一部分来提高性能，从而释放主线程。

### [Style](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#style)

第三步是将 DOM 和 CSSOM 组合成一个 Render 树，计算样式树或渲染树从 DOM 树的根开始构建，遍历每个可见节点。

像 [`<head>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/head) 和它的子节点以及任何具有 `display: none` 样式的结点，例如 `script { display: none; }`（在 user agent stylesheets 可以看到这个样式）这些标签将不会显示，也就是它们不会出现在 Render 树上。具有 `visibility: hidden` 的节点会出现在 Render 树上，因为它们会占用空间。由于我们没有给出任何指令来覆盖用户代理的默认值，因此上面代码示例中的 `script` 节点将不会包含在 Render 树中。

每个可见节点都应用了其 CSSOM 规则。Render 树保存所有具有内容和计算样式的可见节点——将所有相关样式匹配到 DOM 树中的每个可见节点，并根据 [CSS 级联](https://developer.mozilla.org/en-US/docs/Web/CSS/Cascade)确定每个节点的计算样式。

### [Layout](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#layout)

第四步是在渲染树上运行布局以计算每个节点的几何体。布局是确定呈现树中所有节点的宽度、高度和位置，以及确定页面上每个对象的大小和位置的过程。回流是对页面的任何部分或整个文档的任何后续大小和位置的确定。

构建渲染树后，开始布局。渲染树标识显示哪些节点（即使不可见）及其计算样式，但不标识每个节点的尺寸或位置。为了确定每个对象的确切大小和位置，浏览器从渲染树的根开始遍历它。

在网页上，大多数东西都是一个盒子。不同的设备和不同的桌面意味着无限数量的不同的视区大小。在此阶段，考虑到视区大小，浏览器将确定屏幕上所有不同框的尺寸。以视区的大小为基础，布局通常从 body 开始，用每个元素的框模型属性排列所有 body 的子孙元素的尺寸，为不知道其尺寸的替换元素（例如图像）提供占位符空间。

第一次确定节点的大小和位置称为布局。随后对节点大小和位置的重新计算称为回流。在我们的示例中，假设初始布局发生在返回图像之前。由于我们没有声明图像的大小，因此一旦知道图像大小，就会有回流。

### [绘制](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E7%BB%98%E5%88%B6)

最后一步是将各个节点绘制到屏幕上，第一次出现的节点称为 [first meaningful paint (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/first_meaningful_paint)。在绘制或光栅化阶段，浏览器将在布局阶段计算的每个框转换为屏幕上的实际像素。绘画包括将元素的每个可视部分绘制到屏幕上，包括文本、颜色、边框、阴影和替换的元素（如按钮和图像）。浏览器需要非常快地完成这项工作。

为了确保平滑滚动和动画，占据主线程的所有内容，包括计算样式，以及回流和绘制，必须让浏览器在 16.67 毫秒内完成。在 2048x1536 分辨率的 iPad 上，有超过 314.5 万像素将被绘制到屏幕上。那是很多像素需要快速绘制。为了确保重绘的速度比初始绘制的速度更快，屏幕上的绘图通常被分解成数层。如果发生这种情况，则需要进行合成。

绘制可以将布局树中的元素分解为多个层。将内容提升到 GPU 上的层（而不是 CPU 上的主线程）可以提高绘制和重新绘制性能。有一些特定的属性和元素可以实例化一个层，包括 [`<video>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/video) 和 [`<canvas>`](https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/canvas)，任何 CSS 属性为 [`opacity`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/opacity) 、3D [`transform`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/transform)、[`will-change`](https://developer.mozilla.org/zh-CN/docs/Web/CSS/will-change) 的元素，还有一些其他元素。这些节点将与子节点一起绘制到它们自己的层上，除非子节点由于上述一个（或多个）原因需要自己的层。

分层确实可以提高性能，但是它以内存管理为代价，因此不应作为 web 性能优化策略的一部分过度使用。

### [Compositing](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#compositing)

当文档的各个部分以不同的层绘制，相互重叠时，必须进行合成，以确保它们以正确的顺序绘制到屏幕上，并正确显示内容。

当页面继续加载资产时，可能会发生回流（回想一下我们迟到的示例图像），回流会触发重新绘制和重新组合。如果我们定义了图像的大小，就不需要重新绘制，只需要重新绘制需要重新绘制的层，并在必要时进行合成。但我们没有包括图像大小！从服务器获取图像后，渲染过程将返回到布局步骤并从那里重新开始。

## [交互](https://developer.mozilla.org/zh-CN/docs/Web/Performance/How_browsers_work#%E4%BA%A4%E4%BA%92)

一旦主线程绘制页面完成，你会认为我们已经“准备好了”，但事实并非如此。如果加载包含 JavaScript（并且延迟到 [`onload`](https://developer.mozilla.org/zh-CN/docs/Web/API/GlobalEventHandlers/onload) 事件激发后执行），则主线程可能很忙，无法用于滚动、触摸和其他交互。

[Time to Interactive (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/Time_to_interactive)（TTI）是测量从第一个请求导致 DNS 查询和 SSL 连接到页面可交互时所用的时间——可交互是 [First Contentful Paint (en-US)](https://developer.mozilla.org/en-US/docs/Glossary/First_contentful_paint) 之后的时间点，页面在 50ms 内响应用户的交互。如果主线程正在解析、编译和执行 JavaScript，则它不可用，因此无法及时（小于 50ms）响应用户交互。

在我们的示例中，可能图像加载很快，但 `anotherscript.js` 文件可能是 2MB，而且用户的网络连接很慢。在这种情况下，用户可以非常快地看到页面，但是在下载、解析和执行脚本之前，就无法滚动。这不是一个好的用户体验。避免占用主线程，如下面的网页测试示例所示：

![https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/visa_network.png](https://developer.mozilla.org/en-US/docs/Web/Performance/How_browsers_work/visa_network.png)

在本例中，DOM 内容加载过程花费了超过 1.5 秒的时间，主线程在这段时间内完全被占用，对单击事件或屏幕点击没有响应。
