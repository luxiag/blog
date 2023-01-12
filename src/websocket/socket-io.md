---
title: Socket.IO
category: WebSocket
---

[Socket.IO](https://socket.io/zh-CN/) 是一个 WebSocket 库，包括了客户端的 js 和服务器端的 nodejs，它的目标是构建可以在不同浏览器和移动设备上使用的实时应用。

## 特点

- 易用性：socket.io 封装了服务端和客户端，使用起来非常简单方便。
- 跨平台：socket.io 支持跨平台，这就意味着你有了更多的选择，可以在自己喜欢的平台下开发实时应用。
- 自适应：它会自动根据浏览器从 WebSocket、AJAX 长轮询、Iframe 流等等各种方式中选择最佳的方式来实现网络实时应用，非常方便和人性化，而且支持的浏览器最低达 IE5.5。

## 使用

::: details 服务器

```js
var express = require("express");
var path = require("path");
var app = express();

app.get("/", function (req, res) {
  res.sendFile(path.resolve("index.html"));
});

var server = require("http").createServer(app);
var io = require("socket.io")(server);

io.on("connection", function (socket) {
  //向客户端发送消息
  socket.send("欢迎光临");
  //接收到客户端发过来的消息时触发
  socket.on("message", function (data) {
    console.log(data);
  });
});
server.listen(80);
```

:::

::: details 客户端

```js
window.onload = function () {
  const socket = io.connect("/");
  //监听与服务器端的连接成功事件
  socket.on("connect", function () {
    console.log("连接成功");
  });
  //客户端收到服务器发过来的消息后触发
  socket.on("message", function (message) {
    console.log(message);
  });
  //监听与服务器端断开连接事件
  socket.on("disconnect", function () {
    console.log("断开连接");
  });
};
```

:::
