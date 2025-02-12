---
title: H5兼容
category:
  - H5
date: 2024-10-02
---

# IOS兼容

## IOS系统下输入框光标高度不正常

- 问题症状：input输入框光标，在安卓手机上显示没有问题，但是在苹果手机上当点击输入的时候，光标的高度和父盒子的高度一样
- 原因分析：通常我们习惯用height属性设置行间的高度和line-height属性设置行间的距离（行高），当点击输入的时候，光标的高度就自动和父盒子的高度一样了。（谷歌浏览器的设计原则，还有一种可能就是当没有内容的时候光标的高度等于input的line-height的值，当有内容时，光标从input的顶端到文字的底部）
- 解决方案：高度height和行高line-height内容用padding撑开

## IOS键盘唤起，键盘收起以后页面不归位

- 问题症状：输入内容，软键盘弹出，页面内容整体上移，但是键盘收起，页面内容不下滑
- 原因分析：固定定位的元素 在元素内 input 框聚焦的时候 弹出的软键盘占位 失去焦点的时候软键盘消失 但是还是占位的 导致input框不能再次输入 在失去焦点的时候给一个事件
- 解决方案：
  ```js
  changeBlur () {
       let u = navigator.userAgent, app = navigator.appVersion;
       let isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
       if(isIOS){
          setTimeout(() => {
            const scrollHeight = document.documentElement.scrollTop || document.body.scrollTop || 0
            window.scrollTo(0, Math.max(scrollHeight - 1, 0))
            }, 200)
       }
  }
  ```
## IOS端h5页面上下滑动时卡顿、页面缺失

- 问题描述：在IOS端，上下滑动页面时，如果页面高度超出了一屏，就会出现明显的卡顿，页面有部分内容显示不全的情况
- 解决方案：只需要在公共样式加入下面这行代码

```css
* {
  -webkit-overflow-scrolling: touch;
}

```
**-webkit-overflow-scrolling 属性控制元素在移动设备上是否使用滚动回弹效果.**

auto: 使用普通滚动, 当手指从触摸屏上移开，滚动会立即停止。

touch: 使用具有回弹效果的滚动, 当手指从触摸屏上移开，内容会继续保持一段时间的滚动效果。继续滚动的速度和持续的时间和滚动手势的强烈程度成正比。同时也会创建一个新的堆栈上下文。

## IOS双击页面缩放禁止
- 问题描述：IOS10中自带的Safari浏览器不识别meta viewport
- 解决方案：
IOS10以外解决移动端禁止页面缩放的方法：
```html
<meta name="viewport" content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-scale=1.0,user-scalable=no">
```
IOS10解决方案：
```js
// 禁用双指缩放
document.documentElement.addEventListener('touchstart', function (event) {
  if (event.touches.length > 1) {
    event.preventDefault();
  }
}, false);
// 禁用手指双击缩放
var lastTouchEnd = 0;
document.documentElement.addEventListener('touchend', function (event) {
  var now = Date.now();
  if (now - lastTouchEnd <= 300) {
    event.preventDefault();
  }
  lastTouchEnd = now;
}, false);
```

# Android/IOS兼容

## 移动端click事件300ms的延迟响应

- 问题描述：移动设备上的web网页是有300ms延迟的，往往会造成按钮点击延迟甚至是点击失效
- 解决方案：用tap事件来取代click事件

## 点透问题
- 问题描述：移动端开发中，经常使用`touchstart`和`touchend`来模拟`click`事件，但是这样会产生一个点透的问题。当上层元素绑定`touchstart`事件，下层元素绑定`click`事件时，点击上层元素，会触发下层元素的`click`事件。
- 原因分析：touchstart 早于 touchend 早于click。 亦即click的触发是有延迟的，这个时间大概在300ms左右，也就是说我们tap触发之后蒙层隐藏， 此时 click还没有触发，300ms之后由于蒙层隐藏，我们的click触发到了下面的a链接上。
- 解决方案：touch事件来替换click事件

## audio autoplay 失效问题
- 问题描述：在移动端，`<audio autoplay>`属性在微信浏览器中无效
- 原因分析： 由于自动播放网页中的音频或视频，会给用户带来一些困扰或者不必要的流量消耗，所以苹果系统和安卓系统通常都会禁止自动播放和使用 JS 的触发播放，必须由用户来触发才可以播放。
- 解决方案：
```js
document.addEventListener('touchstart',function() {
  document.getElementsByTagName('audio')[0].play();
  document.getElementsByTagName('audio')[0].pause();
});
```

## 弹出的键盘遮盖文本框

- 问题描述：H5弹出软键盘后挡住input输入框，看不到输入的字符。
- 解决办法：给input和textarea标签添加focus事件，先判断是不是安卓手机下的操作，当然，也可以不用判断机型，Document 对象属性和方法setTimeout延时0.5秒，因为调用安卓键盘有一点迟钝，导致如果不延时处理的话，滚动就失效了。

```js
changefocus(){
    var userAgent = navigator.userAgent;
    var isAndroid = userAgent.indexOf('Android') > -1 || userAgent.indexOf('Linux') > -1;
    if(isAndroid){
        setTimeout(function() {
            document.activeElement.scrollIntoViewIfNeeded();
            document.activeElement.scrollIntoView();
        }, 500);       
    }
}
```
