---
title: NodeJS安全风险
category:
 - NodeJS
date: 2023-06-21 
---

## CSRF

CSRF（Cross-site request forgery）跨站请求伪造：攻击者诱导受害者进入第三方网站，在第三方网站中，向被攻击网站发送跨站请求。利用受害者在被攻击网站已经获取的注册凭证，绕过后台的用户验证，达到冒充用户对被攻击的网站执行某项操作的目的。

- 当用户已经登录成功了一个网站
- 然后通过被诱导进了第三方网站「钓鱼网站」
- 跳转过去了自动提交表单，冒用受害者信息
- 后台则正常走逻辑将用户提交的表单信息进行处理


## XSS

XSS是跨站脚本攻击(Cross Site Scripting)，为不和层叠样式表(Cascading Style Sheets, CSS)的缩写混淆，故将跨站脚本攻击缩写为XSS。

### 反射型xss攻击

- 用户误点开了带攻击的`url : http://xxx?keyword=<script>alert('aaa')</script>`
- 网站给受害者的返回中包含了来自URL的的恶意文本
- 用户的浏览器收到文本后执行页面，会在网页中弹窗aaa

### 储存型xss攻击

- 攻击者通过评论表单提交将`<script>alert(‘aaa’)</script>`提交到网站
- 网站后端对提交的评论数据不做任何操作，直接存储到数据库中
- 其他用户访问正常访问网站，并且需要请求网站的评论数据
- 网站后端会从数据库中取出数据，直接返回给用户
- 用户得到页面后，直接运行攻击者提交的代码`<script>alert(‘aaa’)</script>`，所有用户都会在网页中弹出aaa的弹窗#


### DOM型xss攻击

- 用户误点开了带攻击的`url : http://xxx?name=<script>alert('aaa')</script>`
- 网站给受害者的返回中正常的网页
- 用户的浏览器收到文本后执行页面合法脚本，这时候页面恶意脚本会被执行，会在网页中弹窗aaa


## 越权

水平越权:指相同权限下不同的用户可以互相访问

垂直越权:指使用权限低的用户可以访问到权限较高的用户

水平越权测试方法：主要通过看看能否通过A用户操作影响到B用户

垂直越权测试思路：看看低权限用户是否能越权使用高权限用户的功能，比如普通用户可以使用管理员的功能。

## SSRF

服务端请求伪造(Server-Side Request Forgery),指的是攻击者在未能取得服务器所有权限时，利用服务器漏洞以服务器的身份发送一条构造好的请求给服务器所在内网。SSRF攻击通常针对外部网络无法直接访问的内部系统。


## HPP

HPP，即 HTTP Parameter Pollution，HTTP 参数污染。在 HTTP 协议中是运行同样名称的参数出现多次，攻击者通过传播参数的时候传输 key 相同而 value 不同的参数，从而达到绕过某些防护与参数校验的后果。它是一种注入型的漏洞，攻击者通过在 HTTP 请求中插入特定的参数来发起攻击。

## 不安全的跳转(钓鱼)

- 伪造假网站，攻击者创建一个与受害者所用的合法企业网站（例如银行网站）基本一样的网站。
- 预付金诈骗，骗子联系受害者来利用他们的贪婪和同情，声称要偷偷带出一位富有的西班牙囚犯，囚犯愿意以丰厚的报酬感谢受害者，以换取用于贿赂一些狱警所需的金钱。
- 帐户停用诈骗，通过操控受害者的紧迫感，使其认为重要帐户将被停用，攻击者便可诱使某些人交出登录凭证等重要信息。


## 不安全的NPM包


## 目录遍历攻击

目录遍历攻击又称目录穿越、恶意浏览、文件泄露等，攻击者利用系统漏洞访问合法应用之外的数据或文件目录，导致数据泄露或被篡改

