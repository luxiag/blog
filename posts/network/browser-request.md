---
title: web端的网络请求
category: 
 - Network
date: 2021-11-14
---

通过 XMLHttpRequest 可以在不刷新页面的情况下请求特定 URL，获取数据。这允许网页在不影响用户操作的情况下，更新页面的局部内容

# **1 创建 XMLHttpRequest 实例**

```jsx
let xhr = new XMLHttpRequest();
```

# **2 发出 HTTP 请求**

调用open()不会实际发送请求，只是为发送请求做好准备。

```jsx
xhrReq.open(method, url);
xhrReq.open(method, url, async);
xhrReq.open(method, url, async, user);
xhrReq.open(method, url, async, user, password);
```

**`method`**

要使用的HTTP方法，比如「GET」、「POST」、「PUT」、「DELETE」、等。对于非HTTP(S) URL被忽略。

**`url`**

一个[`DOMString`](https://developer.mozilla.org/zh-CN/docs/Web/API/DOMString)表示要向其发送请求的URL。

**`async` 可选**

一个可选的布尔参数，表示是否异步执行操作，默认为`true`。

**`user` 可选**

可选的用户名用于认证用途；默认为`null`

**`password` 可选**

可选的密码用于认证用途，默认为`null`。

```jsx
xhr.open("get","example.txt",false);
```

## **GET 请求**

用于向服务器查询某些信息。必要时，需要在 GET 请求的 URL后面添加查询字符串参数。

```jsx
xhr.open("get", "example.php?name1=value1&name2=value2", true);
```

## **POST请求**

用于向服务器发送应该保存的数据

```jsx
xhr.open("post", "example.php", true);
```

# **3 请求体发送的数据。**

如果不需要发送请求体，则必须传null

调用send()之后，请求就会发送到服务器。

```jsx
xhr.send(null)
```

## **HTTP头部**

默认情况下，XHR 请求会发送以下头部字段。

- Accept：浏览器可以处理的内容类型。
- Accept-Charset：浏览器可以显示的字符集。
- Accept-Encoding：浏览器可以处理的压缩编码类型。
- Accept-Language：浏览器使用的语言。
- Connection：浏览器与服务器的连接类型。
- Cookie：页面中设置的Cookie。
- Host：发送请求的页面所在的域。
- Referer：发送请求的页面的URI。注意，这个字段在HTTP 规范中就拼错了，所以考虑到兼容
性也必须将错就错。（正确的拼写应该是Referrer。）
- User-Agent：浏览器的用户代理字符串。

## **setRequestHeader()**

设置HTTP请求头部的方法

```jsx
xhr.setRequestHeader(header, value);
```

**`header`**

属性的名称。

**`value`**

属性的值。

## **POST请求**

```jsx
xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
let form = document.getElementById("user-info");
xhr.send(serialize(form));
```

# **4 接收服务器传回的数据**

请求是同步的 JavaScript 代码会等待服务器响应之后再继续执行。
**收到响应后，XHR对象的以下属性会被填充上数据。**

- responseText：作为响应体返回的文本。
- responseXML：如果响应的内容类型是"text/xml"或"application/xml"，那就是包含响应
数据的XML DOM 文档。
- status：响应的HTTP 状态。
- statusText：响应的HTTP 状态描述。

```jsx
if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) { 
  alert(xhr.responseText); 
} else { 
  alert("Request was unsuccessful: " + xhr.status); 
}
```

# readystatechange事件

XHR 对象有一个readyState 属性，表示当前处在请求/响应过程的哪个阶段。

**每次readyState 从一个值变成另一个值，都会触发readystatechange 事件。**

## readyState

- 0：未初始化（Uninitialized）。尚未调用open()方法。
- 1：已打开（Open）。已调用open()方法，尚未调用send()方法。
- 2：已发送（Sent）。已调用send()方法，尚未收到响应。
- 3：接收中（Receiving）。已经收到部分响应。
- 4：完成（Complete）。已经收到所有响应，可以使用了。

```jsx
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
 if (xhr.readyState == 4) {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
   alert(xhr.responseText);
  } else {
   alert("Request was unsuccessful: " + xhr.status);
  }
 }
};
xhr.open("get", "example.txt", true);
xhr.send(null);
```

# FormData

XMLHttpRequest Level 2 新增了FormData 类型。

```jsx
let data = new FormData();
data.append("name", "Nicholas");
```

```jsx
formData.append(name, value);
formData.append(name, value, filename)
```

**`name`**

value中包含的数据对应的表单名称。

**`value`**

表单的值。可以是[`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString) 或 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) (包括子类型，如 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File))。

**`filename` 可选**

传给服务器的文件名称 (一个 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString)), 当一个 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 或 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 被作为第二个参数的时候， [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob) 对象的默认文件名是 "blob"。 [`File`](https://developer.mozilla.org/zh-CN/docs/Web/API/File) 对象的默认文件名是该文件的名称。

不再需要给XHR 对象显式设置任何请求头部

XHR 对象能够识别作为FormData 实例传入的数据类型并自动配置相应的头部。

```jsx
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
 if (xhr.readyState == 4) {
  if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
   alert(xhr.responseText);
  } else {
   alert("Request was unsuccessful: " + xhr.status);
  }
 }
};

xhr.open("post", "postexample.php", true);

let form = document.getElementById("user-info");
xhr.send(new FormData(form));
```

# 超时

timeout 属性，用于表示发送请求后等待多少毫秒，如果响应不成功就中断请求

且在该时间过后没有收到响应时，XHR 对象就会触发timeout 事件

```jsx
let xhr = new XMLHttpRequest();
xhr.onreadystatechange = function() {
 if (xhr.readyState == 4) {
  try {
   if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
    alert(xhr.responseText);
   } else {
    alert("Request was unsuccessful: " + xhr.status);
   }
  } catch (ex) {
  // 假设由ontimeout 处理
  }
 }
};

xhr.open("get", "timeout.php", true);
xhr.timeout = 1000; // 设置1 秒超时
xhr.ontimeout = function() {
 alert("Request did not return in a second.");
};
xhr.send(null);
```

# overrideMimeType()

重写XHR 响应的MIME 类型。

**媒体类型**（通常称为 **Multipurpose Internet Mail Extensions** 或 **MIME** 类型 ****）是一种标准，用来表示文档、文件或字节流的性质和格式。

假设服务器实际发送了XML 数据，但响应头设置的MIME 类型是text/plain。结果就会导致虽然数据是XML，但responseXML 属性值是null。此时调用overrideMimeType()可以保证将响应当成XML 而不是纯文本来处理：

```jsx
let xhr = new XMLHttpRequest();
xhr.open("get", "text.php", true);
xhr.overrideMimeType("text/xml");
xhr.send(null);
```

# Fetch

`fetch()`的功能与 XMLHttpRequest 基本相同，但有三个主要的差异。

- `fetch()`使用 Promise，不使用回调函数，因此大大简化了写法，写起来更简洁。
- `fetch()`采用模块化设计，API 分散在多个对象上（Response 对象、Request 对象、Headers 对象），更合理一些；相比之下，XMLHttpRequest 的 API 设计并不是很好，输入、输出、状态都在同一个接口管理，容易写出非常混乱的代码。
- `fetch()`通过数据流（Stream 对象）处理数据，可以分块读取，有利于提高网站性能表现，减少内存占用，对于请求大文件或者网速慢的场景相当有用。XMLHTTPRequest 对象不支持数据流，所有的数据必须放在缓存里，不支持分块读取，必须等待全部拿到后，再一次性吐出来。

# 使用

fetch()的第一个参数是 URL，还可以接受第二个参数，作为配置对象，定制发出的 HTTP 请求。

```jsx
fetch(input[, init])
  .then(...)
  .catch(...)
```

**`input`**

定义要获取的资源。这可能是：
• 一个 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString) 字符串，包含要获取资源的 URL。一些浏览器会接受 `blob:` 和 `data:` 作为 schemes.
• 一个 [`Request`](https://developer.mozilla.org/zh-CN/docs/Web/API/Request) 对象。

**`init` 可选**

一个配置项对象，包括所有对请求的设置。

- `method`: 请求使用的方法，如 `GET、POST。`
- `headers`: 请求的头信息，形式为 [`Headers`](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers) 的对象或包含 [`ByteString`](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/JavaScript/Reference/Global_Objects/String) 值的对象字面量。
- `body`: 请求的 body 信息：可能是一个 [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)、[`BufferSource` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource)、[`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)、[`URLSearchParams`](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams) 或者 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString) 对象。注意 GET 或 HEAD 方法的请求不能包含 body 信息。
- `mode`: 请求的模式，如 `cors、` `no-cors 或者` `same-origin。`
- `credentials`: 请求的 credentials，如 `omit、same-origin 或者` `include`。为了在当前域名内自动发送 cookie ， 必须提供这个选项， 从 Chrome 50 开始， 这个属性也可以接受 [`FederatedCredential` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/FederatedCredential) 实例或是一个 [`PasswordCredential` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/PasswordCredential) 实例。
- `cache`: 请求的 cache 模式: `default`、 `no-store`、 `reload` 、 `no-cache` 、 `force-cache` 或者 `only-if-cached` 。
- `redirect`: 可用的 redirect 模式: `follow` (自动重定向), `error` (如果产生重定向将自动终止并且抛出一个错误）, 或者 `manual` (手动处理重定向). 在Chrome中默认使用`follow（`Chrome 47之前的默认值是`manual`）。
- `referrer`: 一个 [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString) 可以是 `no-referrer、client`或一个 URL。默认是 `client。`
- `referrerPolicy`: 指定了HTTP头部referer字段的值。可能为以下值之一： `no-referrer、` `no-referrer-when-downgrade、` `origin、` `origin-when-cross-origin、` `unsafe-url 。`
- `integrity`: 包括请求的 [subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) 值 （ 例如： `sha256-BpfBw7ivV8q2jLiT13fxDYAe2tJllusRSZ273h2nFSE=）。`

**默认值**

```jsx
const response = fetch(url, {
  method: "GET",
  headers: {
    "Content-Type": "text/plain;charset=UTF-
  },
  body: undefined,
  referrer: "about:client",
  referrerPolicy: "no-referrer-when-downgrade",
  mode: "cors", 
  credentials: "same-origin",
  cache: "default",
  redirect: "follow",
  integrity: "",
  keepalive: false,
  signal: undefined
});
```

# GET请求

```jsx
fetch('https://api.github.com/users/ruanyf')
  .then(response => response.json())
  .then(json => console.log(json))
  .catch(err => console.log('Request Failed', err))
```

# POST请求

```jsx
const response = await fetch(url, {
  method: 'POST',
  headers: {
    "Content-type": "application/x-www-form-urlencoded; charset=UTF-8",
  },
  body: 'foo=bar&lorem=ipsum',
});

const json = await response.json();
```

- method：HTTP 请求的方法，POST、DELETE、PUT都在这个属性设置。
- headers：一个对象，用来定制 HTTP 请求的标头。
- body：POST 请求的数据体

# 提交JSON数据

```jsx
const user =  { name:  'John', surname:  'Smith'  };
const response = await fetch('/article/fetch/post/user', {
  method: 'POST',
  headers: {
   'Content-Type': 'application/json;charset=utf-8'
  }, 
  body: JSON.stringify(user) 
});
```

# 提交表单

```jsx
const form = document.querySelector('form');

const response = await fetch('/users', {
  method: 'POST',
  body: new FormData(form)
})
```

# 文件上传

```jsx
const input = document.querySelector('input[type="file"]');

const data = new FormData();
data.append('file', input.files[0]);
data.append('user', 'foo');

fetch('/avatars', {
  method: 'POST',
  body: data
});
```

# 上传二进制数据

```jsx
let blob = await new Promise(resolve =>   
  canvasElem.toBlob(resolve,  'image/png')
);

let response = await fetch('/article/fetch/post/image', {
  method:  'POST',
  body: blob
});
```

**Headers 对象是所有外发请求和入站响应头部的容器。**

每个外发的Request 实例都包含一个空的Headers 实例，可以通过Request.prototype.headers 访问

每个入站Response 实例也可以通过Response.prototype.headers 访问包含着响应头部的Headers 对象。

```jsx
var myHeaders = new Headers(init);
```

**`*init*` 可选**

通过一个包含任意 [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers) 的对象来预设你的 `Headers`.

```jsx
var myHeaders = new Headers(); // Currently empty
myHeaders.append('Content-Type', 'image/jpeg');
myHeaders.get('Content-Type'); // Returns 'image/jpeg'
```

```jsx
var httpHeaders = { 'Content-Type' : 'image/jpeg', 'Accept-Charset' : 'utf-8', 'X-My-Custom-Header' : 'Zeke are cool' };
var myHeaders = new Headers(httpHeaders);
```

- Headers.get()：根据指定的键名，返回键值。
- Headers.has()： 返回一个布尔值，表示是否包含某个标头。
- Headers.set()：将指定的键名设置为新的键值，如果该键名不存在则会添加。
- Headers.append()：添加标头。
- Headers.delete()：删除标头。
- Headers.keys()：返回一个遍历器，可以依次遍历所有键名。
- Headers.values()：返回一个遍历器，可以依次遍历所有键值。
- Headers.entries()：返回一个遍历器，可以依次遍历所有键值对（[key, value]）。
- Headers.forEach()：依次遍历标头，每个标头都会执行一次参数函数

```jsx
let response =  await  fetch(url);  
response.headers.get('Content-Type')
// application/json; charset=utf-8
```

Request 对象是获取资源请求的接口

```jsx
var myRequest = new Request(input[, init]);
```

[Request - Web API 接口参考 | MDN](https://developer.mozilla.org/zh-CN/docs/Web/API/Request)

```jsx
let r = new Request('https://foo.com');
// 向foo.com 发送GET 请求
fetch(r);
// 向foo.com 发送POST 请求
fetch(r, { method: 'POST' });
```

Response 对象是获取资源响应的接口

```jsx
let myResponse = new Response(body, init);
```

**`body`可选**

一个定义 response 中 body 的对象. 可以为 `null` ，或是以下其中一个:
• [`Blob`](https://developer.mozilla.org/zh-CN/docs/Web/API/Blob)
• [`BufferSource` (en-US)](https://developer.mozilla.org/en-US/docs/Web/API/BufferSource)
• [`FormData`](https://developer.mozilla.org/zh-CN/docs/Web/API/FormData)
• [`ReadableStream`](https://developer.mozilla.org/zh-CN/docs/Web/API/ReadableStream)
• [`URLSearchParams`](https://developer.mozilla.org/zh-CN/docs/Web/API/URLSearchParams)
• [`USVString`](https://developer.mozilla.org/zh-CN/docs/Web/API/USVString)

**`init` 可选**

一个参数(options)对象，包含要应用到 response 上的任何自定义设置. 可能参数(options)是:
• `status`: response 的状态码, 例如:`200`.
• `statusText`: 和状态码关联的状态消息, 例如: `OK`.
• `headers`: 你想加到 response 上的任何 headers, 包含了一个 [`Headers`](https://developer.mozilla.org/zh-CN/docs/Web/API/Headers) 对象或满足对象语法的 [`ByteString`](https://developer.mozilla.org/zh-CN/docs/conflicting/Web/JavaScript/Reference/Global_Objects/String) key/value 对 (详见 [HTTP headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers)).

```jsx
fetch('//foo.com').then(console.log);
// Response {
// body: (...)
// bodyUsed: false
// headers: Headers {}
// ok: true
// redirected: false
// status: 200
// statusText: "OK"
// type: "basic"
// url: "https://foo.com/"
// }
```

# 处理HTTP回应

```jsx
async function fetchText() {
  let response = await fetch('/readme.txt');
  console.log(response.status); 
  console.log(response.statusText);
}
```

[**`Response.ok`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response/ok) 只读**

包含了一个布尔值，标示该 Response 成功（HTTP 状态码的范围在 200-299）。

[**`Response.redirected`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response/redirected) 只读**

表示该 Response 是否来自一个重定向，如果是的话，它的 URL 列表将会有多个条目。

[**`Response.status`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response/status) 只读**

包含 Response 的状态码 （例如 `200` 表示成功）。

[**`Response.statusText`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response/statusText) 只读**

包含了与该 Response 状态码一致的状态信息（例如，OK对应 `200`）。

[**`Response.type`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response/type) 只读**

包含 Response 的类型（例如，`basic`、`cors`）。

[**`Response.url`](https://developer.mozilla.org/zh-CN/docs/Web/API/Response/url) 只读**

包含 Response 的URL。

# 读取内容

- `response.text()`：得到文本字符串。
- `response.json()`：得到 JSON 对象。
- `response.blob()`：得到二进制 Blob 对象。
- `response.formData()`：得到 FormData 表单对象。
- `response.arrayBuffer()`：得到二进制 ArrayBuffer 对象。

```jsx
const response = await fetch('/users.html');
const body = await response.text();
document.body.innerHTML = body
```

# 判断请求是否成功

fetch()发出请求以后，有一个很重要的注意点：只有网络错误，或者无法连接时，fetch()才会报错，其他情况都不会报错，而是认为请求成功。

即使服务器返回的状态码是 4xx 或 5xx，fetch()也不会报错（即 Promise 不会变为 rejected状态）。

只有通过Response.status属性，得到 HTTP 回应的真实状态码，才能判断请求是否成功。

```jsx
async function fetchText() {
  let response = await fetch('/readme.txt');
  if (response.status >= 200 && response.status < 300) {
    return await response.text();
  } else {
    throw new Error(response.statusText);
  }
}
```
