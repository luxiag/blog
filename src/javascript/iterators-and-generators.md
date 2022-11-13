---
title: 迭代器与生成器
category:
  - javascript
---

## 迭代器原理

### 理解迭代

在 JavaScript 中，计数循环就是一种最简单的迭代

```jsx
for (let i = 1; i <= 10; ++i) {
  console.log(i);
}
```

**缺点：**

** 迭代之前需要事先知道如何使用数据结构。**

数组中的每一项都只能先通过引用取得数组对象，
然后再通过[]操作符取得特定索引位置上的项。这种情况并不适用于所有数据结构。

** 遍历顺序并不是数据结构固有的**

通过递增索引来访问数据是特定于数组类型的方式，并不适用于其他具有隐式顺序的数据结构。

**可迭代对象**指的是任何具有专用迭代器方法，且该方法返回迭代器对象的对象。

**迭代器对象**指的是任何具有 next()方法，且该方法返回迭代结果对象的对象。

**迭代结果对象**是具有属性 value 和 done 的对象。

要迭代一个可迭代对象，首先要调用其迭代器方法获得一个迭代器对象。然后，重复调用这个迭代器对象的 next()方法，直至返回 done 属性为 true 的迭代结果对象。

```jsx
let iterable = [99];
let iterator = iterable[Symbol.iterator]();
for (let result = iterator.next(); !result.done; result = iterator.next()) {
  console.log(result.value); //result.value == 99
}
```

### Symbol.iterator

内置可迭代数据类型的迭代器对象本身也是可迭代的（也就是说，它们有一个名为 Symbol.iterator 的方法，返回它们自己）

```jsx
let list = [1, 2, 3, 4, 5];
let iter = list[Symbol.iterator]();
let head = iter.next().value; // head ==1
let tail = [...iter]; // tail == [2,3,4,5]
```

## 迭代器模式

### 可迭代协议

实现 Iterable 接口（可迭代协议）要求同时具备两种能力：

支持迭代的自我识别能力和创建实现
Iterator 接口的对象的能力。

在 ECMAScript 中，这意味着必须暴露一个属性作为“默认迭代器”，而且这个属性必须使用特殊的 Symbol.iterator 作为键。这个默认迭代器属性必须引用一个迭代器工厂函数，调用这个工厂函数必须返回一个新迭代器。

实现 Iterable 接口的内置类型：

-  字符串
-  数组
-  映射
-  集合
-  arguments 对象
-  NodeList 等 DOM 集合类型

检查是否存在默认迭代器属性可以暴露这个工厂函数：

```jsx
let num = 1;
let obj = {}; // 这两种类型没有实现迭代器工厂函数
console.log(num[Symbol.iterator]); // undefined
console.log(obj[Symbol.iterator]); // undefined
let str = "abc";
let arr = ["a", "b", "c"];
let map = new Map().set("a", 1).set("b", 2).set("c", 3);
let set = new Set().add("a").add("b").add("c");
let els = document.querySelectorAll("div"); // 这些类型都实现了迭代器工厂函数
console.log(str[Symbol.iterator]); // f values() { [native code] }
console.log(arr[Symbol.iterator]); // f values() { [native code] }
console.log(map[Symbol.iterator]); // f values() { [native code] }
console.log(set[Symbol.iterator]); // f values() { [native code] }
console.log(els[Symbol.iterator]); // f values() { [native code] } // 调用这个工厂函数会生成一个迭代器
console.log(str[Symbol.iterator]()); // StringIterator {}
console.log(arr[Symbol.iterator]()); // ArrayIterator {}
console.log(map[Symbol.iterator]()); // MapIterator {}
console.log(set[Symbol.iterator]()); // SetIterator {}
console.log(els[Symbol.iterator]()); // ArrayIterator {}
```

接收可迭代对象的原生语言特性包括：

-  for-of 循环
-  数组解构
-  扩展操作符
-  Array.from()
-  创建集合
-  创建映射
-  Promise.all()接收由期约组成的可迭代对象
-  Promise.race()接收由期约组成的可迭代对象
-  yield\*操作符，在生成器中使用

原生语言结构会在后台调用提供的可迭代对象的这个工厂函数，从而创建一个迭代器：

```jsx
let arr = ["foo", "bar", "baz"]; // for-of 循环
for (let el of arr) {
  console.log(el);
} // foo // bar // baz // 数组解构
let [a, b, c] = arr;
console.log(a, b, c); // foo, bar, baz // 扩展操作符
let arr2 = [...arr];
console.log(arr2); // ['foo', 'bar', 'baz'] // Array.from()
let arr3 = Array.from(arr);
console.log(arr3); // ['foo', 'bar', 'baz'] // Set 构造函数
let set = new Set(arr);
console.log(set); // Set(3) {'foo', 'bar', 'baz'} // Map 构造函数
let pairs = arr.map((x, i) => [x, i]);
console.log(pairs); // [['foo', 0], ['bar', 1], ['baz', 2]]
let map = new Map(pairs);
console.log(map); // Map(3) { 'foo'=>0, 'bar'=>1, 'baz'=>2 }
```

如果对象原型链上的父类实现了 Iterable 接口，那这个对象也就实现了这个接口：

```jsx
class FooArray extends Array {}
let fooArr = new FooArray("foo", "bar", "baz");
for (let el of fooArr) {
  console.log(el);
} // foo // bar // baz
```

### 实现可迭代对象

```js
class Range {
  constructor(from, to) {
    this.from = from;
    this.to = to;
  }

  has(x) {
    return typeof x === "number" && this.from <= x && x <= this.to;
  }

  toString() {
    return `{x | ${this.from} <= x <= ${this.to}}`;
  }
  [Symbol.iterator]() {
    let next = Math.ceil(this.from);
    let last = this.to;
    return {
      next() {
        return next <= last ? { value: next++ } : { done: true };
      },
      [Symbol.iterator]() {
        return this;
      },
    };
  }
}
for (let x of new Range(1, 10)) {
  // 打印 1 到10
  console.log(x);
}
```

### 迭代器协议

迭代器是一种一次性使用的对象，用于迭代与其关联的可迭代对象。

迭代器 API 使用 next()方法在可迭代对象中遍历数据。每次成功调用 next()，都会返回一个 IteratorResult 对象，其中包含迭代器返回的下一个值。若不调用 next()，则无法知道迭代器的当前位置。

`next()`

方法返回的迭代器对象 IteratorResult 包含两个属性：done 和 value。

done 是一个布尔值，表示是否还可以再次调用 next()取得下一个值(遍历是否结束)

value 包含可迭代对象的下一个值（done 为 false），或者 undefined（done 为 true）。done: true 状态称为“耗尽”。

Iterator 的遍历过程是这样的。

（1）创建一个指针对象，指向当前数据结构的起始位置。也就是说，遍历器对象本质上，就是一个指针对象。

（2）第一次调用指针对象的`next`方法，可以将指针指向数据结构的第一个成员。

（3）第二次调用指针对象的`next`方法，指针就指向数据结构的第二个成员。

（4）不断调用指针对象的`next`方法，直到它指向数据结构的结束位置。

```jsx
// 可迭代对象
let arr = ["foo", "bar"]; // 迭代器工厂函数
console.log(arr[Symbol.iterator]); // f values() { [native code] } // 迭代器
let iter = arr[Symbol.iterator]();
console.log(iter); // ArrayIterator {} // 执行迭代
console.log(iter.next()); // { done: false, value: 'foo' }
console.log(iter.next()); // { done: false, value: 'bar' }
console.log(iter.next()); // { done: true, value: undefined }
```

通过创建迭代器并调用 next()方法按顺序迭代了数组，直至不再产生新值。

迭代器并不知道怎么从可迭代对象中取得下一个值，也不知道可迭代对象有多大。

只要迭代器到达 done: true 状态，后续调用 next()就一直返回同样的值了：

```jsx
let arr = ["foo"];
let iter = arr[Symbol.iterator]();
console.log(iter.next()); // { done: false, value: 'foo' }
console.log(iter.next()); // { done: true, value: undefined }
console.log(iter.next()); // { done: true, value: undefined }
console.log(iter.next()); // { done: true, value: undefined }
```

### 实现迭代器对象

```jsx
class Counter {
  // Counter 的实例应该迭代limit 次
  constructor(limit) {
    this.count = 1;
    this.limit = limit;
  }
  next() {
    if (this.count <= this.limit) {
      return {
        done: false,
        value: this.count++,
      };
    } else {
      return {
        done: true,
        value: undefined,
      };
    }
  }
  [Symbol.iterator]() {
    return this;
  }
}
let counter = new Counter(3);
for (let i of counter) {
  console.log(i);
}
// 1
// 2
// 3
```

这个类实现了 Iterator 接口，但不理想。这是因为它的每个实例只能被迭代一次：

```jsx
for (let i of counter) {
  console.log(i);
}
// 1
// 2
// 3
for (let i of counter) {
  console.log(i);
}
// (nothing logged)
```

**为了让一个可迭代对象能够创建多个迭代器，必须每创建一个迭代器就对应一个新计数器。为此，
可以把计数器变量放到闭包里，然后通过闭包返回迭代器**：

```jsx
class Counter {
  constructor(limit) {
    this.limit = limit;
  }
  [Symbol.iterator]() {
    let count = 1,
      limit = this.limit;
    return {
      next() {
        if (count <= limit) {
          return {
            done: false,
            value: count++,
          };
        } else {
          return {
            done: true,
            value: undefined,
          };
        }
      },
    };
  }
}
let counter = new Counter(3);
for (let i of counter) {
  console.log(i);
}
// 1
// 2
// 3
for (let i of counter) {
  console.log(i);
}
// 1
// 2
// 3
```

## 生成器

### 生成器基础

函数名称前面加一个星号（\*）表示它是一个生成器

```jsx
// 生成器函数声明
function* generatorFn() {} // 生成器函数表达式
let generatorFn = function* () {}; // 作为对象字面量方法的生成器函数
let foo = {
  *generatorFn() {},
}; // 作为类实例方法的生成器函数
class Foo {
  *generatorFn() {}
} // 作为类静态方法的生成器函数
class Bar {
  static *generatorFn() {}
}
```

箭头函数不能用来定义生成器函数。

**标识生成器函数的星号不受两侧空格的影响**

```jsx
// 等价的生成器函数：
function* generatorFnA() {}
function* generatorFnB() {}
function* generatorFnC() {} // 等价的生成器方法：
class Foo {
  *generatorFnD() {}
  *generatorFnE() {}
}
```

调用生成器函数会产生一个生成器对象。

生成器对象一开始处于暂停执行（suspended）的状态

调用 next()方法会让生成器开始或恢复执行。

```jsx
function* generatorFn() {}
const g = generatorFn();
console.log(g); // generatorFn {<suspended>}
console.log(g.next); // f next() { [native code] }
```

next()方法的返回值类似于迭代器，有一个 done 属性和一个 value 属性。

```jsx
function* generatorFn() {
  return "foo";
}
let generatorObject = generatorFn();
console.log(generatorObject); // generatorFn {<suspended>}
console.log(generatorObject.next()); // { done: true, value: 'foo' }
```

**生成器函数只会在初次调用 next()方法后开始执行**

```jsx
function* generatorFn() {
  console.log("foobar");
} // 初次调用生成器函数并不会打印日志
let generatorObject = generatorFn();
generatorObject.next(); // foobar
```

### 通过 yield 中断执行

yield 关键字可以让生成器停止和开始执行，也是生成器最有用的地方。

生成器函数在遇到 yield 关键字之前会正常执行。遇到这个关键字后，执行会停止，函数作用域的状态会被保留。

停止执行的生成器函数只能通过在生成器对象上调用 next()方法来恢复执行：

```jsx
function* generatorFn() {
  yield;
}
let generatorObject = generatorFn();
console.log(generatorObject.next()); // { done: false, value: undefined }
console.log(generatorObject.next()); // { done: true, value: undefined }
```

此时的 yield 关键字有点像函数的中间返回语句，它生成的值会出现在 next()方法返回的对象里。

通过 yield 关键字退出的生成器函数会处在 done: false 状态；

通过 return 关键字退出的生成器函数会处于 done: true 状态。

```jsx
function* generatorFn() {
  yield "foo";
  yield "bar";
  return "baz";
}
let generatorObject = generatorFn();
console.log(generatorObject.next()); // { done: false, value: 'foo' }
console.log(generatorObject.next()); // { done: false, value: 'bar' }
console.log(generatorObject.next()); // { done: true, value: 'baz' }
```

yield 关键字只能在生成器函数内部使用，用在其他地方会抛出错误,类似于函数 return

```jsx
// 有效
function* validGeneratorFn() {
  yield;
}

// 无效
function* invalidGeneratorFnA() {
  function a() {
    yield;
  }
}

// 无效
function* invalidGeneratorFnB() {
  const b = () => {
    yield;
  };
}

// 无效
function* invalidGeneratorFnC() {
  (() => {
    yield;
  })();
}
```

#### 生成器对象作为可迭代对象

在生成器对象上显式调用 next()方法的用处并不大。其实，如果把生成器对象当成可迭代对象，
那么使用起来会更方便：

```jsx
function* generatorFn() {
  yield 1;
  yield 2;
  yield 3;
}
for (const x of generatorFn()) {
  console.log(x);
}
// 1
// 2
// 3
```

```jsx
function* nTimes(n) {
  while (n--) {
    yield;
  }
}
for (let _ of nTimes(3)) {
  console.log("foo");
}
// foo
// foo
// foo
```

#### 使用 yield 实现输入和输出

让生成器函数暂停的 yield 关键字会接收到传给 next()方法的第一个值

第一次调用 next()传入的值不会被使用，因为这一次调用是为了开始执行生成器函数：

```jsx
function* generatorFn(initial) {
  console.log(initial);
  console.log(yield);
  console.log(yield);
}
let generatorObject = generatorFn("foo");
generatorObject.next("bar"); // foo
generatorObject.next("baz"); // baz
generatorObject.next("qux"); // qux
```

函数必须对整个表达式求值才能确定要返回的值，所以它在遇到 yield 关键字时暂停执行并计算出要产生的值："foo"。下一次调用 next()传入了"bar"，作为交给同一个 yield 的值。然后这个值被确定为本次生成器函数要返回的值。

```jsx
function* generatorFn() {
  return yield "foo";
}
let generatorObject = generatorFn();
console.log(generatorObject.next()); // { done: false, value: 'foo' }
console.log(generatorObject.next("bar")); // { done: true, value: 'bar' }
```

```jsx
function* generatorFn() {
	for (let i = 0;;++i) {
		yield i;
	}
}
let generatorObject = generatorFn();
console.log(generatorObject.next().value); // 0
console.log(generatorObject.next().value); // 1
console.log(generatorObject.next().value); // 2
console.log(generatorObject.next().value); // 3
console.log(generatorObject.next().value); // 4
console.log(generatorObject.next().value); // 5
...
```

```jsx
function* range(start, end) {
  while (end > start) {
    yield start++;
  }
}
for (const x of range(4, 7)) {
  console.log(x);
}
// 4
// 5
// 6

function* zeroes(n) {
  while (n--) {
    yield 0;
  }
}
console.log(Array.from(zeroes(8))); // [0, 0, 0, 0, 0, 0, 0, 0]
```

#### 产生可迭代对象

使用星号增强 yield 的行为，让它能够迭代一个可迭代对象，从而一次产出一个值：

```jsx
// 等价的generatorFn：
// function* generatorFn() {
//   for (const x of [1, 2, 3]) {
//     yield x;
//   }
// }
function* generatorFn() {
  yield* [1, 2, 3];
}
let generatorObject = generatorFn();
for (const x of generatorFn()) {
  console.log(x);
}
// 1
// 2
// 3
```

### 生成器作为默认迭代器

生成器对象实现了 Iterable 接口，而且生成器函数和默认迭代器被调用之后都产生迭代器，所以生成器格外适合作为默认迭代器。

```jsx
class Foo {
  constructor() {
    this.values = [1, 2, 3];
  }
  *[Symbol.iterator]() {
    yield* this.values;
  }
}
const f = new Foo();
for (const x of f) {
  console.log(x);
}
// 1
// 2
// 3
```

### 提前终止生成器

**return()**

强制生成器进入关闭状态

```jsx
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
}
const g = generatorFn();
console.log(g); // generatorFn {<suspended>}
console.log(g.return(4)); // { done: true, value: 4 }
console.log(g); // generatorFn {<closed>}
```

与迭代器不同，所有生成器对象都有 return()方法，只要通过它进入关闭状态，就无法恢复了。

```jsx
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
}
const g = generatorFn();
console.log(g.next()); // { done: false, value: 1 }
console.log(g.return(4)); // { done: true, value: 4 }
console.log(g.next()); // { done: true, value: undefined }
console.log(g.next()); // { done: true, value: undefined }
console.log(g.next()); // { done: true, value: undefined }
```

**throw()**

会在暂停的时候将一个提供的错误注入到生成器对象中。如果错误未被处理，生成器就会关闭：

```jsx
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    yield x;
  }
}
const g = generatorFn();
console.log(g); // generatorFn {<suspended>}
try {
  g.throw("foo");
} catch (e) {
  console.log(e); // foo
}
console.log(g); // generatorFn {<closed>}
```

**假如生成器函数内部处理了这个错误，那么生成器就不会关闭，而且还可以恢复执行。错误处理会跳过对应的 yield**

```jsx
function* generatorFn() {
  for (const x of [1, 2, 3]) {
    try {
      yield x;
    } catch (e) {}
  }
}
const g = generatorFn();
console.log(g.next()); // { done: false, value: 1}
g.throw("foo");
console.log(g.next()); // { done: false, value: 3}
```
