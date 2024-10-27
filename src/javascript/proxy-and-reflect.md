---
title: 代理与反射
category:
  - JavaScript
date: 2020-09-12
---

ECMAScript 6 新增的代理和反射为开发者提供了拦截并向基本操作嵌入额外行为的能力。

具体地说，可以给目标对象定义一个关联的代理对象，而这个代理对象可以作为抽象的目标对象来使用。

在对目标对象的各种操作影响目标对象之前，可以在代理对象中对这些操作加以控制。

## 代理基础

### 创建空代理

`Proxy()`

```js
const p = new Proxy(target, handler)
target
要使用 Proxy 包装的目标对象（可以是任何类型的对象，包括原生数组，函数，甚至另一个代理）。

handler
一个通常以函数作为属性的对象，各属性中的函数分别定义了在执行各种操作时代理 p 的行为。
```

在代理对象上执行的任何操作实际上都会应用到目标对象。

唯一可感知的不同就是代码中操作的是代理对象。

```js
const target = {
  id: "target",
};

const handler = {};

const proxy = new Proxy(target, handler);

// id 属性会访问同一个值
console.log(target.id); // target
console.log(proxy.id); // target

// 给目标属性赋值会反映在两个对象上
// 因为两个对象访问的是同一个值
target.id = "foo";
console.log(target.id); // foo
console.log(proxy.id); // foo

// 给代理属性赋值会反映在两个对象上
// 因为这个赋值会转移到目标对象
proxy.id = "bar";
console.log(target.id); // bar
console.log(proxy.id); // bar

// hasOwnProperty()方法在两个地方
// 都会应用到目标对象
console.log(target.hasOwnProperty("id")); // true
console.log(proxy.hasOwnProperty("id")); // true

// Proxy.prototype 是undefined
// 因此不能使用instanceof 操作符
console.log(target instanceof Proxy); // TypeError: Function has non-object prototype
// 'undefined' in instanceof check
console.log(proxy instanceof Proxy); // TypeError: Function has non-object prototype
// 'undefined' in instanceof check

// 严格相等可以用来区分代理和目标
console.log(target === proxy); // false
```

### 定义捕获器

使用代理的主要目的是可以定义捕获器（trap）。捕获器就是在处理程序对象中定义的“基本操作的拦截器”。每个处理程序对象可以包含零个或多个捕获器，每个捕获器都对应一种基本操作，可以直接或间接在代理对象上调用。每次在代理对象上调用这些基本操作时，代理可以在这些操作传播到目标对象之前先调用捕获器函数，从而拦截并修改相应的行为。

```js
const target = {
  foo: "bar",
};
const handler = {
  // 捕获器在处理程序对象中以方法名为键
  get() {
    return "handler override";
  },
};

const proxy = new Proxy(target, handler);

console.log(target.foo); // bar
console.log(proxy.foo); // handler override

console.log(target["foo"]); // bar
console.log(proxy["foo"]); // handler override

console.log(Object.create(target)["foo"]); // bar
console.log(Object.create(proxy)["foo"]); // handler override
```

### 捕获器参数和反射 API

所有捕获器都可以访问相应的参数，基于这些参数可以重建被捕获方法的原始行为

`get()`

```js
get(trapTarget,property,receiver))
捕获器会接收到目标对象、要查询的属性和代理对象三个参数。
```

```js
const target = {
  foo: "bar",
};
const handler = {
  get(trapTarget, property, receiver) {
    console.log(trapTarget === target);
    console.log(property);
    console.log(receiver === proxy);
  },
};
const proxy = new Proxy(target, handler);

proxy.foo;
// true
// foo
// true
```

反射（Reflect）API 方法，方法与捕获器拦截的方法具有相同的名称和函数签名，而且也具有与被拦截方法相同的行为。

```js
const target = {
  foo: "bar",
};
const handler = {
  get() {
    return Reflect.get(...arguments);
  },
};
const proxy = new Proxy(target, handler);
console.log(proxy.foo); // bar
console.log(target.foo); // bar
```

简洁

```js
const target = {
  foo: "bar",
};
const handler = {
  get: Reflect.get,
};

const proxy = new Proxy(target, handler);

console.log(proxy.foo); // bar
console.log(target.foo); // bar
```

如果想创建一个可以捕获所有方法，然后将每个方法转发给对应反射 API 的空代理，那么甚至不需要定义处理程序对象：

```js
const target = {
  foo: "bar",
};
const proxy = new Proxy(target, Reflect);

console.log(proxy.foo); // bar
console.log(target.foo); // bar
```

反射 API 为开发者准备好了样板代码

```js
const target = {
  foo: "bar",
  baz: "qux",
};

const handler = {
  get(trapTarget, property, receiver) {
    let decoration = "";
    if (property === "foo") {
      decoration = "!!!";
    }
    return Reflect.get(...arguments) + decoration;
  },
};

const proxy = new Proxy(target, handler);

console.log(proxy.foo); // bar!!!
console.log(target.foo); // bar

console.log(proxy.baz); // qux
console.log(target.baz); // qux
```

### 捕获器不变式

捕获处理程序的行为必须遵循“捕获器不变式”

如果目标对象有一个不可配置且不可写的数据属性，那么在捕获器返回一个与该属性不同的值时，会抛出 TypeError：

```js
const target = {};
Object.defineProperty(target, "foo", {
  // 此处设置了foo属性不可配置且不可改写
  configurable: false,
  writable: false,
  value: "bar",
});
const handler = {
  get() {
    return "qux";
  },
};
const proxy = new Proxy(target, handler);

console.log(proxy.foo);
// TypeError
```

### 可撤销代理

`Proxy.revocable(target,handler)`

撤销代理对象与目标对象的关联。撤销代理的操作是不可逆的。而且，撤销函数（revoke()）是幂等的，调用多少次的结果都一样。

```js
const target = {
  foo: "bar",
};
const handler = {
  get() {
    return "intercepted";
  },
};

// 通过revocable()工厂方法，在实例化时同时生成撤销函数revoke和代理对象proxy
const { proxy, revoke } = Proxy.revocable(target, handler);

console.log(proxy.foo); // intercepted
console.log(target.foo); // bar
revoke(); // 执行撤销函数
console.log(proxy.foo); // TypeError
```

### 实用反射 API

#### 反射 API 与对象 API

(1) 反射 API 并不限于捕获处理程序；

(2) 大多数反射 API 方法在 Object 类型上有对应的方法。

通常，Object 上的方法适用于通用程序，而反射方法适用于细粒度的对象控制与操作。

#### 状态标记

很多反射方法返回称作“状态标记”的布尔值，表示意图执行的操作是否成功

**使用`Object.defineProperty()`方法定义对象属性时会返回对象
但使用`Reflect.defineProperty()`方法定义属性时会返回`true/false`表示成功/失败**

初始代码

```js
// 初始代码
const o = {};
try {
  Object.defineProperty(o, "foo", "bar"); // 不符合defineProperty的语法规则而报错
  console.log("success");
} catch (e) {
  console.log("failure");
}
```

**在定义新属性时如果发生问题，`Reflect.defineProperty()`会返回`false`，而不是抛出错误**

代码重构

```js
// 重构后的代码
const o = {};
if (Reflect.defineProperty(o, "foo", { value: "bar" })) {
  console.log("success");
} else {
  console.log("failure");
}
```

以下反射方法都会提供状态标记, 即返回值都是布尔值 true/false：
 Reflect.defineProperty()
 Reflect.preventExtensions()
 Reflect.setPrototypeOf()
 Reflect.set()
 Reflect.deleteProperty()

#### 一等函数代替操作符

 Reflect.get()：可以替代对象属性访问操作符。
 Reflect.set()：可以替代=赋值操作符。
 Reflect.has()：可以替代 in 操作符或 with()。
 Reflect.deleteProperty()：可以替代 delete 操作符。
 Reflect.construct()：可以替代 new 操作符。

#### 安全地应用函数

在通过 apply 方法调用函数时，被调用的函数可能也定义了自己的 apply 属性

为绕过这个问题，可以使用定义在 Function 原型上的 apply 方法

```js
Function.prototype.apply.call(myFunc, thisVal, argumentList);
```

可以使用 Reflect.apply 来避免

```js
Reflect.apply(myFunc, thisVal, argumentsList);
```

### 代理另一个代理

代理可以拦截反射 API 的操作，而这意味着完全可以创建一个代理，通过它去代理另一个代理。这样就可以在一个目标对象之上构建多层拦截网：

```js
const target = {
  foo: "bar",
};
const firstProxy = new Proxy(target, {
  get() {
    console.log("first proxy");
    return Reflect.get(...arguments);
  },
});
const secondProxy = new Proxy(firstProxy, {
  get() {
    console.log("second proxy");
    return Reflect.get(...arguments);
  },
});
console.log(secondProxy.foo);
// second proxy
// first proxy
// bar
```

### 代理的问题与不足

#### 代理中的 this

```js
const target = {
  thisValEqualsProxy() {
    return this === proxy;
  },
};

const proxy = new Proxy(target, {});

console.log(target.thisValEqualsProxy()); // false
console.log(proxy.thisValEqualsProxy()); // true
```

```js
const wm = new WeakMap();
class User {
  constructor(userId) {
    wm.set(this, userId);
  }
  set id(userId) {
    wm.set(this, userId);
  }
  get id() {
    return wm.get(this);
  }
}
const user = new User(123);
console.log(user.id); // 123

const userInstanceProxy = new Proxy(user, {});
console.log(userInstanceProxy.id); // undefined
```

`User` 实例一开始使用目标对象作为 `WeakMap` 的键，代理对象却尝试从自身取得这个实例。

要解决这个问题，就需要重新配置代理，把代理`User`实例改为代理 `User` 类本身

```js
// 把代理`User`实例改为代理 `User` 类本身
const UserClassProxy = new Proxy(User, {});
const proxyUser = new UserClassProxy(456);
console.log(proxyUser.id); // 456
```

#### 代理与内部插槽

代理与内置引用类型（比如 Array）的实例通常可以很好地协同，但有些 ECMAScript 内置类型可能会依赖代理无法控制的机制，结果导致在代理上调用某些方法会出错。

一个典型的例子就是 Date 类型。根据 ECMAScript 规范，Date 类型方法的执行依赖 this 值上的内部槽位[[NumberDate]]。代理对象上不存在这个内部槽位，而且这个内部槽位的值也不能通过普通的 get()和 set()操作访问到，于是代理拦截后本应转发给目标对象的方法会抛出 TypeError：

```js
const target = new Date();
const proxy = new Proxy(target, {});
console.log(proxy instanceof Date); // true

target.getDate(); // 当前日期为几号, 如13号
proxy.getDate(); // TypeError: 'this' is not a Date object
```

## 代理捕获器与反射方法

**代理可以捕获 13 种不同的基本操作。这些操作有各自不同的反射 `API` 方法、参数、关联 `ECMAScript` 操作和不变式。**

### get() 对应 Reflect.get()

`get()`

get()捕获器会在获取属性值的操作中被调用

```js
Reflect.get(target, propertyKey[, receiver])
 target：目标对象。
 property：引用的目标对象上的字符串键属性。①
 receiver：代理对象或继承代理对象的对象
返回值
属性的值
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  get(target, property, receiver) {
    console.log("get()");
    return Reflect.get(...arguments);
  },
});
proxy.foo;
// get()
```

拦截的操作

- proxy.property
- proxy[property]
- Object.create(proxy)[property]
- Reflect.get(proxy, property, receiver)

**捕获器不变式**
如果 target.property 不可写且不可配置( 即 configurable: false, writable: false)，则处理程序返回的值必须与 target.property 匹配。
如果 target.property 不可配置( 即 configurable: false) 且[[Get]]特性为 undefined，处理程序的返回值也必须是 undefined

### set()对应 Reflect.set()

`set()`

set()捕获器会在设置属性值的操作中被调用

```js
Reflect.set(target, propertyKey, value[, receiver])
 target：目标对象。
 property：设置的属性的名称。
 value：设置的值。
 receiver：如果遇到 setter，receiver则为setter调用时的this值。
返回值
返回true 表示成功；返回false 表示失败，严格模式下会抛出TypeError。
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  set(target, property, value, receiver) {
    console.log("set()");
    return Reflect.set(...arguments);
  },
});
proxy.foo = "bar";
// set()
// 'bar' // 返回值
```

**拦截的操作**
- proxy.property = value
- proxy[property] = value
- Object.create(proxy)[property] = value
- Reflect.set(proxy, property, value, receiver)

**捕获器不变式**
如果 target.property 不可写且不可配置，则不能修改目标属性的值。
如果 target.property 不可配置且[[Set]]特性为 undefined，则不能修改目标属性的值。
在严格模式下，处理程序中返回 false 会抛出 TypeError。

### has()对应 Reflect.has()

has()捕获器会在 in 操作符中被调用

`has()`

```js
Reflect.has(target, propertyKey)
 target：目标对象。
 property：属性名，需要检查目标对象是否存在此属性
返回值
has()必须返回布尔值，表示属性是否存在。返回非布尔值会被转型为布尔值
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  has(target, property) {
    console.log("has()");
    return Reflect.has(...arguments);
  },
});
"foo" in proxy;
// has()
// false // 返回值
```

**拦截的操作**
- property in proxy
- property in Object.create(proxy)
- with(proxy) {(property);}
- Reflect.has(proxy, property)

**捕获器不变式**
如果 target.property 存在且不可配置，则处理程序必须返回 true。
如果 target.property 存在且目标对象不可扩展，则处理程序必须返回 true。

### defineProperty()对应 Reflect.defineProperty()

defineProperty()捕获器会在 Object.defineProperty()中被调用

`defineProperty()`

```js
Reflect.defineProperty(target, property, descriptor)
 target：目标对象。
 property：引用的目标对象上的字符串键属性。
 descriptor：包含可选的enumerable、configurable、writable、value、get 和set
定义的对象。
返回值
defineProperty()必须返回布尔值，表示属性是否成功定义。返回非布尔值会被转型为布尔值。
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  defineProperty(target, property, descriptor) {
    console.log("defineProperty()");
    return Reflect.defineProperty(...arguments);
  },
});
Object.defineProperty(proxy, "foo", { value: "bar" });
// defineProperty()
```

**拦截的操作**
- Object.defineProperty(proxy, property, descriptor)
- Reflect.defineProperty(proxy, property, descriptor)

**捕获器不变式**
如果目标对象不可扩展，则无法定义属性。
如果目标对象有一个可配置的属性，则不能添加同名的不可配置属性。
如果目标对象有一个不可配置的属性，则不能添加同名的可配置属性。

### getOwnPropertyDescriptor()对应 Reflect.getOwnPropertyDescriptor()

getOwnPropertyDescriptor()捕获器会在 Object.getOwnPropertyDescriptor()中被调用

如果在对象中存在，则返回给定的属性的属性描述符

```js
Reflect.getOwnPropertyDescriptor(target, property)
 target：目标对象。
 property：引用的目标对象上的字符串键属性。
返回值
getOwnPropertyDescriptor()必须返回对象，或者在属性不存在时返回undefined
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  getOwnPropertyDescriptor(target, property) {
    console.log("getOwnPropertyDescriptor()");
    return Reflect.getOwnPropertyDescriptor(...arguments);
  },
});
Object.getOwnPropertyDescriptor(proxy, "foo");
// getOwnPropertyDescriptor()
// undefined
```

**拦截的操作**
- Object.getOwnPropertyDescriptor(proxy, property)
- Reflect.getOwnPropertyDescriptor(proxy, property)

**捕获器不变式**
如果自有的 target.property 存在且不可配置，则处理程序必须返回一个表示该属性存在的对象。
如果自有的 target.property 存在且可配置，则处理程序必须返回表示该属性可配置的对象。
如果自有的 target.property 存在且 target 不可扩展，则处理程序必须返回一个表示该属性存在的对象。
如果 target.property 不存在且 target 不可扩展，则处理程序必须返回 undefined 表示该属性不存在。
如果 target.property 不存在，则处理程序不能返回表示该属性可配置的对象。

### deleteProperty()对应 Reflect.deleteProperty()

deleteProperty()捕获器会在 delete 操作符中被调用。

```js
Reflect.deleteProperty(target, propertyKey)
target:删除属性的目标对象。
propertyKey:需要删除的属性的名称
返回值
Boolean 值表明该属性是否被成功删除。
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  deleteProperty(target, property) {
    console.log("deleteProperty()");
    return Reflect.deleteProperty(...arguments);
  },
});

delete proxy.foo;
// deleteProperty()
// true // 返回值
```

**拦截的操作**
- delete proxy.property
- delete proxy[property]
- Reflect.deleteProperty(proxy, property)

**捕获器不变式**
如果自有的 target.property 存在且不可配置，则处理程序不能删除这个属性。

### ownKeys()对应 Reflect.ownKeys()

ownKeys()捕获器会在 Object.keys()及类似方法中被调用。

返回一个由目标对象自身的属性键组成的数组。

```js
Reflect.ownKeys(target)
 target：目标对象
返回值
由目标对象的自身属性键组成的 Array。
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  ownKeys(target) {
    console.log("ownKeys()");
    return Reflect.ownKeys(...arguments);
  },
});
Object.keys(proxy);
// ownKeys()
//[]
```

**拦截的操作**
- Object.getOwnPropertyNames(proxy)
- Object.getOwnPropertySymbols(proxy)
- Object.keys(proxy)
- Reflect.ownKeys(proxy)

**捕获器不变式**
返回的可枚举对象必须包含 target 的所有不可配置的自有属性。
如果 target 不可扩展，则返回可枚举对象必须准确地包含自有属性键。

### getPrototypeOf()对应 Reflect.getPrototypeOf()

getPrototypeOf()捕获器会在 Object.getPrototypeOf()中被调用。

返回指定对象的原型（即内部的 `[[Prototype]]` 属性的值）。

```js
Reflect.getPrototypeOf(target)
 target：目标对象。
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  getPrototypeOf(target) {
    console.log("getPrototypeOf()");
    return Reflect.getPrototypeOf(...arguments);
  },
});
Object.getPrototypeOf(proxy);
// getPrototypeOf()
// 返回其原型, 此处即为object
```

**拦截的操作**
- Object.getPrototypeOf(proxy)
- Reflect.getPrototypeOf(proxy)
- proxy.**proto**
- Object.prototype.isPrototypeOf(proxy)
- proxy instanceof Object

**捕获器不变式**
如果 target 不可扩展，则 Object.getPrototypeOf(proxy)唯一有效的返回值就是 Object.
getPrototypeOf(target)的返回值

### setPrototypeOf()对应 Reflect.setPrototypeOf()

setPrototypeOf()捕获器会在 Object.setPrototypeOf()中被调用。

设置对象的原型（即内部的 `[[Prototype]]` 属性）为另一个对象或 [`null`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/null)，如果操作成功返回 `true`，否则返回 `false`。

```js
Reflect.setPrototypeOf(target, prototype)
 target：目标对象。
 prototype：对象的新原型（一个对象或 null）。
返回值
setPrototypeOf()必须返回布尔值，表示原型赋值是否成功。返回非布尔值会被转型为布尔值。
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  setPrototypeOf(target, prototype) {
    console.log("setPrototypeOf()");
    return Reflect.setPrototypeOf(...arguments);
  },
});
Object.setPrototypeOf(proxy, Object);
// setPrototypeOf()
```

**拦截的操作**
- Object.setPrototypeOf(proxy)
- Reflect.setPrototypeOf(proxy)

**捕获器不变式**
如果 target 不可扩展，则唯一有效的 prototype 参数就是 Object.getPrototypeOf(target)的返回值。

### isExtensible()对应 Reflect.isExtensible()

isExtensible()捕获器会在 Object.isExtensible()中被调用

判断一个对象是否可扩展 （即是否能够添加新的属性）

```js
Reflect.isExtensible(target)
 target：目标对象。
返回值
isExtensible()必须返回布尔值，表示target 是否可扩展。返回非布尔值会被转型为布尔值。
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  isExtensible(target) {
    console.log("isExtensible()");
    return Reflect.isExtensible(...arguments);
  },
});
Object.isExtensible(proxy);
// isExtensible()
// true // 返回值
```

**拦截的操作**
- Object.isExtensible(proxy)
- Reflect.isExtensible(proxy)

**捕获器不变式**
如果 target 可扩展，则处理程序必须返回 true。
如果 target 不可扩展，则处理程序必须返回 false。

### preventExtensions()对应 Reflect.preventExtensions()

preventExtensions()捕获器会在 Object.preventExtensions()中被调用

方法阻止新属性添加到对象 (例如：防止将来对对象的扩展被添加到对象中)。

```js
Reflect.preventExtensions(target)
 target：目标对象。
返回值
preventExtensions()必须返回布尔值，表示target 是否已经不可扩展。返回非布尔值会被转
型为布尔值。
```

```js
const myTarget = {};
const proxy = new Proxy(myTarget, {
  preventExtensions(target) {
    console.log("preventExtensions()");
    return Reflect.preventExtensions(...arguments);
  },
});
Object.preventExtensions(proxy);
// preventExtensions()
```

**拦截的操作**
- Object.preventExtensions(proxy)
- Reflect.preventExtensions(proxy)

**捕获器不变式**
如果 Object.isExtensible(proxy)是 false，则处理程序必须返回 true。

### apply()对应 Reflect.apply()

apply()捕获器会在调用函数时中被调用

通过指定的参数列表发起对目标(target)函数的调用。

```js
Reflect.apply(target, thisArgument, argumentsList)
 target：目标对象。
 thisArgument：调用函数时的this 参数。
 argumentsList：target函数调用时传入的实参列表，该参数应该是一个类数组的对象。
```

```js
const myTarget = () => {};
const proxy = new Proxy(myTarget, {
  apply(target, thisArg, ...argumentsList) {
    console.log("apply()");
    return Reflect.apply(...arguments);
  },
});
proxy();
// apply()
// undefined // 返回值
```

**拦截的操作**
- proxy(...argumentsList)
- Function.prototype.apply(thisArg, argumentsList)
- Function.prototype.call(thisArg, ...argumentsList)
- Reflect.apply(target, thisArgument, argumentsList)

**捕获器不变式**
target 必须是一个函数对象。

### construct()对应 Reflect.construct()

construct()捕获器会在 new 操作符中被调用

方法的行为有点像 [`new` 操作符](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/new) 构造函数 ， 相当于运行 `new target(...args)`.

```js
Reflect.construct(target, argumentsList[, newTarget])
 target：目标构造函数。
 argumentsList：传给目标构造函数的参数列表。
 newTarget：最初被调用的构造函数。
返回值
construct()必须返回一个对象
```

**拦截的操作**
- new proxy(...argumentsList)
- Reflect.construct(target, argumentsList, newTarget)

**捕获器不变式**
target 必须可以用作构造函数

## 代理模式

### 跟踪属性访问

通过捕获 get、set 和 has 等操作，可以知道对象属性什么时候被访问、被查询。

把实现相应捕获器的某个对象代理放到应用中，可以监控这个对象何时在何处被访问过：

```js
const user = {
  name: "Jake",
};
const proxy = new Proxy(user, {
  get(target, property, receiver) {
    console.log(`Getting ${property}`);
    return Reflect.get(...arguments);
  },
  set(target, property, value, receiver) {
    console.log(`Setting ${property}=${value}`);
    return Reflect.set(...arguments);
  },
});
proxy.name; // Getting name
proxy.age = 27; // Setting age=27
```

### 隐藏属性

代理的内部实现对外部代码是不可见的，因此要隐藏目标对象上的属性也轻而易举

```js
const hiddenProperties = ["foo", "bar"]; // 隐藏起foo, bar这两个属性
const targetObject = {
  foo: 1,
  bar: 2,
  baz: 3,
};
// 对设置隐藏的foo, bar两个属性单独处理
const proxy = new Proxy(targetObject, {
  get(target, property) {
    if (hiddenProperties.includes(property)) {
      return undefined;
    } else {
      return Reflect.get(...arguments);
    }
  },
  has(target, property) {
    if (hiddenProperties.includes(property)) {
      return false;
    } else {
      return Reflect.has(...arguments);
    }
  },
});
// get()
console.log(proxy.foo); // undefined
console.log(proxy.bar); // undefined
console.log(proxy.baz); // 3
// has()
console.log("foo" in proxy); // false
console.log("bar" in proxy); // false
console.log("baz" in proxy); // true
```

### 属性验证

所有赋值操作都会触发 set()捕获器，所以可以根据所赋的值决定是允许还是拒绝赋值：

```js
const target = {
  onlyNumbersGoHere: 0,
};
const proxy = new Proxy(target, {
  set(target, property, value) {
    if (typeof value !== "number") {
      // 判断所赋的值
      return false;
    } else {
      return Reflect.set(...arguments);
    }
  },
});

proxy.onlyNumbersGoHere = 1;
console.log(proxy.onlyNumbersGoHere); // 1
proxy.onlyNumbersGoHere = "2";
console.log(proxy.onlyNumbersGoHere); // 1
```

### 函数与构造函数参数验证

跟保护和验证对象属性类似，也可对函数和构造函数参数进行审查。比如，可以让函数只接收某种类型的值：

```js
function median(...nums) {
  // Math.floor() 返回小于或等于一个给定数字的最大整数。
  // Note:  可以理解 Math.floor()为向下取整
  return nums.sort()[Math.floor(nums.length / 2)];
}
const proxy = new Proxy(median, {
  apply(target, thisArg, argumentsList) {
    for (const arg of argumentsList) {
      if (typeof arg !== "number") {
        throw "Non-number argument provided";
      }
    }
    return Reflect.apply(...arguments);
  },
});
console.log(proxy(4, 7, 1)); // 4
console.log(proxy(4, "7", 1));
// Error: Non-number argument provided
```

```js
class User {
  constructor(id) {
    this.id_ = id;
  }
}
const proxy = new Proxy(User, {
  construct(target, argumentsList, newTarget) {
    if (argumentsList[0] === undefined) {
      throw "User cannot be instantiated without id";
    } else {
      return Reflect.construct(...arguments);
    }
  },
});
new proxy(1);
new proxy();
// Error: User cannot be instantiated without id
```

### 数据绑定与可观测对象

通过代理可以把运行时中原本不相关的部分联系到一起。这样就可以实现各种模式，从而让不同的代码互操作。

比如，可以将被代理的类绑定到一个全局实例集合，让所有创建的实例都被添加到这个集合中：

```js
const userList = [];

class User {
  constructor(name) {
    this.name_ = name;
  }
}

const proxy = new Proxy(User, {
  construct() {
    const newUser = Reflect.construct(...arguments);
    userList.push(newUser);
    return newUser;
  },
});

new proxy("John");
new proxy("Jacob");
new proxy("Jingleheimerschmidt");
console.log(userList); // [User {}, User {}, User{}]
```

还可以把集合绑定到一个事件分派程序，每次插入新实例时都会发送消息：

```js
const userList = [];

function emit(newValue) {
  console.log(newValue);
}

const proxy = new Proxy(userList, {
  set(target, property, value, receiver) {
    // Reflect.set() 返回true表示设置property为值value成功, false表示失败
    const result = Reflect.set(...arguments);
    if (result) {
      // 传参Reflect.get()的返回值, 即property属性的value值
      emit(Reflect.get(target, property, receiver));
    }
    return result;
  },
});

proxy.push("John");
// John
proxy.push("Jacob");
// Jacob
```

```js
// 创建一个代理对象a,代理的目标对象是数组,通过reduce方法返回了处理器对象,拦截了所有的代理API方法.
// 在拦截器内部,每个方法都会通过console.log打印出其key值(拦截器的名字/反射api的名字)和参数
var a = new Proxy(
  [],
  Reflect.ownKeys(Reflect).reduce((handlers, key) => {
    handlers[key] = (...args) => {
      console.log(key, ...args);
      return Reflect[key](...args);
    };
    return handlers;
  }, {})
);
```
