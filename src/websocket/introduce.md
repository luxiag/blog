---
title: Websocket
category: WebSocket
---

| 参考 | 珠峰架构师 |
| ---- | ---------- |

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
