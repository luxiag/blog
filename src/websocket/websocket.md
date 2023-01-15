---
title: WebSocket
category: WebSocket
date: 2021-03-26
---

## 双向通信

> Comet 是一种用于 web 的推送技术，能使服务器能实时地将更新的信息传送到客户端，而无须客户端发出请求，目前有三种实现方式:轮询（polling） 长轮询（long-polling）和 iframe 流（streaming）。

### 轮询

- 轮询是客户端和服务器之间会一直进行连接，每隔一段时间就询问一次
- 这种方式连接数会很多，一个接受，一个发送。而且每次发送请求都会有 Http 的 Header，会很耗流量，也会消耗 CPU 的利用率

`服务端`

```js
let express = require("express");
let app = express();
app.use(express.static(__dirname));
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8000");
  res.end(new Date().toLocaleTimeString());
});
app.listen(8080);
```

`客户端`

```js
setInterval(function () {
  let xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      document.querySelector("#clock").innerHTML = xhr.responseText;
    }
  };
  xhr.send();
}, 1000);
```

### 长轮询

- 长轮询是对轮询的改进版，客户端发送 HTTP 给服务器之后，看有没有新消息，如果没有新消息，就一直等待
- 当有新消息的时候，才会返回给客户端。在某种程度上减小了网络带宽和 CPU 利用率等问题。
- 由于 http 数据包的头部数据量往往很大（通常有 400 多个字节），但是真正被服务器需要的数据却很少（有时只有 10 个字节左右），这样的数据包在网络上周期性的传输，难免对网络带宽是一种浪费

```js
let xhr = new XMLHttpRequest();
xhr.open("GET", "http://localhost:8080", true);
// 一直等待 有消息
xhr.onreadystatechange = function () {
  if (xhr.readyState == 4 && xhr.status == 200) {
    document.querySelector("#clock").innerHTML = xhr.responseText;
    poll();
  }
};
xhr.send();
```

### iframe

通过在 HTML 页面里嵌入一个隐藏的 iframe,然后将这个 iframe 的 src 属性设为对一个长连接的请求,服务器端就能源源不断地往客户推送数据

`服务端`

```js
const express = require("express");
const app = express();
app.use(express.static(__dirname));
app.get("/clock", function (req, res) {
  setInterval(function () {
    res.write(`
            <script type="text/javascript">
                parent.document.getElementById('clock').innerHTML = "${new Date().toLocaleTimeString()}";
            </script>
        `);
  }, 1000);
});
app.listen(8080);
```

`客户端`

```js
<iframe src="/clock" style=" display:none" />
```

## websocket

- WebSockets_API 规范定义了一个 API 用以在网页浏览器和服务器建立一个 socket 连接。通俗地讲：在客户端和服务器保有一个持久的连接，两边可以在任意时间开始发送数据。
- HTML5 开始提供的一种浏览器与服务器进行全双工通讯的网络技术
- 属于应用层协议，它基于 TCP 传输协议，并复用 HTTP 的握手通道。

**优势**

- 支持双向通信，实时性更强。
- 更好的二进制支持。
- 较少的控制开销。连接创建后，ws 客户端、服务端进行数据交换时，协议控制的数据包头部较小。

### 使用

::: details 服务器

```js
let express = require("express");
const path = require("path");
let app = express();
let server = require("http").createServer(app);
app.get("/", function (req, res) {
  res.sendFile(path.resolve(__dirname, "index.html"));
});
app.listen(3000);

//-----------------------------------------------
let WebSocketServer = require("ws").Server;
let wsServer = new WebSocketServer({ port: 8888 });
wsServer.on("connection", function (socket) {
  console.log("连接成功");
  socket.on("message", function (message) {
    console.log("接收到客户端消息:" + message);
    socket.send("服务器回应:" + message);
  });
});
```

:::

::: details 客户端

```js
let ws = new WebSocket("ws://localhost:8888");
ws.onopen = function () {
  console.log("客户端连接成功");
  ws.send("hello");
};
ws.onmessage = function (event) {
  console.log("收到服务器的响应 " + event.data);
};
```

:::

## WebSocket 连接过程

- Websocket 一开始的握手需要借助 HTTP 请求完成，也是建立在 TCP 之上的，即浏览器、服务器建立 TCP 连接，三次握手。
- TCP 连接成功后，浏览器通过 HTTP 协议向服务器传送 WebSocket 支持的版本号等信息。
- 服务器收到客户端的握手请求后，同样采用 HTTP 协议回馈数据。
- 当收到了连接成功的消息后，通过 TCP 通道进行传输通信。
  客户端通过 HTTP 请求与 WebSocket 服务端协商升级协议。协议升级完成后，后续的数据交换则遵照 WebSocket 的协议。

### 客户端发起：申请协议升级

首先，客户端发起协议升级请求。可以看到，采用的是标准的 HTTP 报文格式，且只支持 GET 方法。

```http
GET ws://localhost:8888/ HTTP/1.1
Host: localhost:8888
Connection: Upgrade
Upgrade: websocket
Sec-WebSocket-Version: 13
Sec-WebSocket-Key: IHfMdf8a0aQXbwQO1pkGdA==
```

- Connection: Upgrade：表示要升级协议
- Upgrade: websocket：表示要升级到 websocket 协议
- Sec-WebSocket-Version: 13：表示 websocket 的版本
- Sec-WebSocket-Key：与后面服务端响应首部的 Sec-WebSocket-Accept 是配套的，提供基本的防护，比如恶意的连接，或者无意的连接。

### 服务器响应协议升级

服务端返回内容如下，状态代码 101 表示协议切换。到此完成协议升级，后续的数据交互都按照新的协议来。

```http
HTTP/1.1 101 Switching Protocols
Upgrade: websocket
Connection: Upgrade
Sec-WebSocket-Accept: aWAY+V/uyz5ILZEoWuWdxjnlb7E=
```

#### Sec-WebSocket-Accept 的计算

Sec-WebSocket-Accept 根据客户端请求首部的 Sec-WebSocket-Key 计算出来。 计算公式为：

- 将 Sec-WebSocket-Key 跟 258EAFA5-E914-47DA-95CA-C5AB0DC85B11 拼接。
- 通过 SHA1 计算出摘要，并转成 base64 字符串

```http
const crypto = require('crypto');
const number = '258EAFA5-E914-47DA-95CA-C5AB0DC85B11';
const webSocketKey = 'IHfMdf8a0aQXbwQO1pkGdA==';
let websocketAccept = require('crypto').createHash('sha1').update(webSocketKey + number).digest('base64');
console.log(websocketAccept);//aWAY+V/uyz5ILZEoWuWdxjnlb7E=
```

**Sec-WebSocket-Key/Accept 的作用**

- 避免服务端收到非法的 websocket 连接
- 确保服务端理解 websocket 连接
- 用浏览器里发起 ajax 请求，设置 header 时，Sec-WebSocket-Key 以及其他相关的 header 是被禁止的
- Sec-WebSocket-Key 主要目的并不是确保数据的安全性，因为 Sec-WebSocket-Key、Sec-WebSocket-Accept 的转换计算公式是公开的，而且非常简单，最主要的作用是预防一些常见的意外情况（非故意的）

## WebSocket 数据帧

WebSocket 客户端、服务端通信的最小单位是帧，由 1 个或多个帧组成一条完整的消息（message）。

- 发送端：将消息切割成多个帧，并发送给服务端
- 接收端：接收消息帧，并将关联的帧重新组装成完整的消息

### 数据帧格式

单位是比特。比如 FIN、RSV1 各占据 1 比特，opcode 占据 4 比特

```http
  0                   1                   2                   3
  0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1 2 3 4 5 6 7 8 9 0 1
 +-+-+-+-+-------+-+-------------+-------------------------------+
 |F|R|R|R| opcode|M| Payload len |    Extended payload length    |
 |I|S|S|S|  (4)  |A|     (7)     |             (16/64)           |
 |N|V|V|V|       |S|             |   (if payload len==126/127)   |
 | |1|2|3|       |K|             |                               |
 +-+-+-+-+-------+-+-------------+ - - - - - - - - - - - - - - - +
 |     Extended payload length continued, if payload len == 127  |
 + - - - - - - - - - - - - - - - +-------------------------------+
 |                               |Masking-key, if MASK set to 1  |
 +-------------------------------+-------------------------------+
 | Masking-key (continued)       |          Payload Data         |
 +-------------------------------- - - - - - - - - - - - - - - - +
 :                     Payload Data continued ...                :
 + - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
 |                     Payload Data continued ...                |
 +---------------------------------------------------------------+
```

- FIN：1 个比特 如果是 1，表示这是消息（message）的最后一个分片（fragment），如果是 0，表示不是是消息（message）的最后一个分片（fragment）
- RSV1, RSV2, RSV3：各占 1 个比特。一般情况下全为 0。当客户端、服务端协商采用 WebSocket 扩展时，这三个标志位可以非 0，且值的含义由扩展进行定义。如果出现非零的值，且并没有采用 WebSocket 扩展，连接出错。
- Opcode: 4 个比特。操作代码，Opcode 的值决定了应该如何解析后续的数据载荷（data payload）。如果操作代码是不认识的，那么接收端应该断开连接（fail the connection）
  - %x0：表示一个延续帧。当 Opcode 为 0 时，表示本次数据传输采用了数据分片，当前收到的数据帧为其中一个数据分片。
  - %x1：表示这是一个文本帧（frame）
  - %x2：表示这是一个二进制帧（frame）
  - %x3-7：保留的操作代码，用于后续定义的非控制帧。
  - %x8：表示连接断开。
  - %x9：表示这是一个 ping 操作。
  - %xA：表示这是一个 pong 操作。
  - %xB-F：保留的操作代码，用于后续定义的控制帧。
- Mask: 1 个比特。表示是否要对数据载荷进行掩码操作
  - 从客户端向服务端发送数据时，需要对数据进行掩码操作；从服务端向客户端发送数据时，不需要对数据进行掩码操作,如果服务端接收到的数据没有进行过掩码操作，服务端需要断开连接。
  - 如果 Mask 是 1，那么在 Masking-key 中会定义一个掩码键（masking key），并用这个掩码键来对数据载荷进行反掩码。所有客户端发送到服务端的数据帧，Mask 都是 1。
- Payload length：数据载荷的长度，单位是字节。为 7 位，或 7+16 位，或 7+64 位。
  - Payload length=x 为 0~125：数据的长度为 x 字节。
  - Payload length=x 为 126：后续 2 个字节代表一个 16 位的无符号整数，该无符号整数的值为数据的长度。
  - Payload length=x 为 127：后续 8 个字节代表一个 64 位的无符号整数（最高位为 0），该无符号整数的值为数据的长度。
  - 如果 payload length 占用了多个字节的话，payload length 的二进制表达采用网络序（big endian，重要的位在前)
- Masking-key：0 或 4 字节(32 位) 所有从客户端传送到服务端的数据帧，数据载荷都进行了掩码操作，Mask 为 1，且携带了 4 字节的 Masking-key。如果 Mask 为 0，则没有 Masking-key。载荷数据的长度，不包括 mask key 的长度
- Payload data：(x+y) 字节
  - 载荷数据：包括了扩展数据、应用数据。其中，扩展数据 x 字节，应用数据 y 字节。
  - 扩展数据：如果没有协商使用扩展的话，扩展数据数据为 0 字节。所有的扩展都必须声明扩展数据的长度，或者可以如何计算出扩展数据的长度。此外，扩展如何使用必须在握手阶段就协商好。如果扩展数据存在，那么载荷数据长度必须将扩展数据的长度包含在内。
  - 应用数据：任意的应用数据，在扩展数据之后（如果存在扩展数据），占据了数据帧剩余的位置。载荷数据长度 减去 扩展数据长度，就得到应用数据的长度。

### 掩码算法

掩码键（Masking-key）是由客户端挑选出来的 32 位的随机数。掩码操作不会影响数据载荷的长度。掩码、反掩码操作都采用如下算法：

- 对索引 i 模以 4 得到 j,因为掩码一共就是四个字节
- 对原来的索引进行异或对应的掩码字节
- 异或就是两个数的二进制形式，按位对比，相同取 0，不同取 1

```js
function unmask(buffer, mask) {
  const length = buffer.length;
  for (let i = 0; i < length; i++) {
    buffer[i] ^= mask[i & 3];
  }
}
```
