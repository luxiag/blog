---
title: TypeScript 基础
category: 
  - TypeScript
date: 2021-10-28
---

# 简介

# TypeScript

- TypeScript 是 JavaScript 的超集，它可以编译成纯 JavaScript。
- TypeScript 基于 ECMAScript 标准进行拓展，支持 ECMAScript 未来提案中的特性，如装饰器、异步功能等。
- TypeScript 编译的 JavaScript 可以在任何浏览器运行，TypeScript 编译工具可以运行在任何操作系统上。
- TypeScript 起源于开发较大规模 JavaScript 应用程序的需求。由微软在2012年发布了首个公开版本。

# ECMAScript

`ECMA International`: 一个制定技术标准的组织。

`ECMA-262`：由 ECMA International 发布。它包含了脚本语言的标准。

`ECMAScript`: 由 ECMA International 以 ECMA-262 和 ECMA-402 规范的形式进行标准化的。

`JavaScript`: 通用脚本编程语言，它遵循了 ECMAScript 标准。 换句话说，JavaScript 是 ECMAScript 的方言。

通过阅读 ECMAScript 标准，你可以学会怎样实现一个脚本语言；而通过阅读 JavaScript 文档，你可以学会怎样使用脚本语言编程。

2019年6月，ECMA-262 第10版定义了 ECMAScript 2019 通用编程语言。

# **类型系统**

## **类型安全---强类型、弱类型**

强类型不允许随意的类型转换，弱类型允许

**强类型 ：**要求语言层面限制函数的实参类型必须与形参类型相同。**弱类型 :** 语言层面不会限制实参的类型。

```jsx
class Main {
    // 这里定义了传入的参数是int类型，那么实际的时候也应该是int类型
    static void foo(int num) {
        System.out.printIn(num);
    }

    public static void main(Sting[] args) {
        // 下面的如果int类型就通过，如果不是int类型就会报错
        Main.foo(100); // ok
        Main.foo('100'); // error "100" is a string
        Main.foo(Integer.parseInt("100")); // ok
    }
}`

`// 传的时候没有规定是什么类型，那么实参是什么类型都不会报错
function foo(num) {
  console.log(num)
}

foo(100) // ok
foo("100") // ok
foo(parseInt("100")) // ok
```

**强类型语言中不允许有任何的隐式类型转换，而弱类型语言则允许任意的数据隐式类型转换。**

```jsx
// js报的错误都是在代码层面，运行的时候通过逻辑判断手动抛出的，并不是语法层面的类型限制
// 下面'100'是字符串，在做减法的时候进行了隐式类型转换，转换成了Number类型，最后得到的结果是50，Number类型。
> '100' - 50
50
// 下面字符串进行隐式类型转换，不是数字的成为NaN（不是数字）
> Math.floor('foo')
NaN
// 布尔值进行隐式类型转换，转成了数字1
> Math.floor(true)
1`

`# 这里无法进行隐式类型转换，会在语法层面上报类型错误
> '100' - 50
TypeError: unsupported operand type(s) for -: 'str' and 'int'
> abs('foo')
TypeError: bad operand type for abs(): 'str'
```

## **类型检查 --- 静态类型、动态类型**

**静态类型 ：**一个变量声明时它的类型就是明确的，声明过后，类型不能修改。**动态类型 ：**运行阶段才可以明确变量的类型，而且变量的类型随时可以改变。所以动态类型语言中的变量没有类型，变量中存放的值时有类型的。

**静态类型不能修改变量的类型，动态类型可以随时去修改变量的类型。**

# **JavaScript 类型系统特征**

JavaScript 是弱类型且动态类型的语言，灵活多变，可以进行 **隐式转换** ，也可以进行 **类型推断** ，但是缺失了类型系统的可靠性。

## **JS 是弱类型且动态类型**

- 早前的 JavaScript 应用简单，所以并没有复杂的类型系统
- JavaScript 是脚本语言，没有编译环节，所以设计成静态语言是没有意义的

## **需要类型检测**

- 因为现在的 JavaScript 应用越来越复杂，开发周期也越来越长，越来越大的项目几百行代码已经不满足现状了，所以现在弱类型已经成为了 JavaScript 的短板。
- 这些东西只能通过约定去规避问题，但是在大型项目中通过人为约定存在隐患

## **弱类型的不足**

只有在运行阶段才能发现代码的异常，代码没有执行的时候也无法发现代码异常，在隐藏比较深的情况下，测试不能百分百覆盖。

```jsx
const obj = {}
obj.foo() // TypeError: obj.foo is not a function

// 下面这个延时器，在时间到了之后才会运行，给测试带来麻烦
setTimeout(() => {
  obj.foo()
}, 100000)
```

函数参数类型不确定，输入的结果有偏差

```jsx
// 不明确是数字，所以结果不一样
function sum(a, b) {
  return a + b
}

console.log(sum(100, 100)) // 200
console.log(sum(100, "100")) // 100100
```

隐式类型转换在对象属性名转化成字符串，里面的内容会有很多的问题

```jsx
// 定义一个字符串，对象的属性名不能是对象，会自动转换成字符串，如果不满足就会有问题
const obj = {}
obj[true] = 100
obj[{ name: 1 }] = 1
console.log(obj) // {true: 100, [object Object]: 1}
console.log(obj["true"]) // 100
console.log(obj["[object Object]"]) // 1
```

## **强类型的优势**

- 错误在开发阶段就会暴露，越早发现越好
- 代码更智能，编码更准确（开发工具的智能提示因为有变量类型才有提示）
- 重构更牢靠（如果项目中很多地方用到的成员，需要删除成员或者修改成员名称的时候，弱类型语言会有隐患）
- 减少不必要的类型判断

```jsx
function sum(a, b) {
  if (typeof a !== "number" || typeof b !== "number") {
    throw new TypeError("arguments must be a number")
  }
  return a + b
}
```

## **类型系统问题解决方案**

- Flow
- TypeScript

## **编译型语言和解释型语言**

> **编译型语言**使用专门的编译器，针对特定的平台，将高级语言源代码一次性的编译成可被该平台硬件执行的机器码，并包装成该平台所能识别的可执行性程序的格式。编译型语言一次性的编译成平台相关的机器语言 文件，运行时脱离开发环境，与特定平台相关，一般无法移植到其他平台，现有的 C、C++、Objective 等都属于编译型语言。
**解释型语言**使用专门的解释器对源程序逐行解释成特定平台的机器码并立即执行。是 代码在执行时才被解释器一行行动态翻译成机器语言和执行，而不是在执行之前就完成翻译。解释型语言每次运行都需要将源代码解释称机器码并执行，只要平台提供相应的解释器，就可以运行源代码，Python、Java、JavaScript 等属于解释型语言。
>

# 数据类型

TypeScript 中的类型有：

- 原始类型
  - boolean
  - number
  - string
  - void
  - null
  - undefined
  - bigint
  - symbol
- 元组 tuple
- 枚举 enum
- 任意 any
- unknown
- never
- 数组 Array
- 对象 object

# array

```jsx
//第一种，可以在元素类型后面接上 []，表示由此类型元素组成的一个数组：
let list: number[] = [1, 2, 3];
//第二种方式是使用数组泛型，Array<元素类型>：
let list: Array<number> = [1, 2, 3];
```

# Tuple

表示一个已知元素数量和类型的数组，各元素的类型不必相同。

```jsx
// Declare a tuple type
let x: [string, number];
// Initialize it
x = ['hello', 10]; // OK
// Initialize it incorrectly
x = [10, 'hello']; // Error
```

# enum

```jsx
enum Color {Red, Green, Blue}
let c: Color = Color.Green;
```

# any

不希望类型检查器对这些值进行检查而是直接让它们通过编译阶段的检查

```jsx
let notSure: any = 4;
notSure = "maybe a string instead";
notSure = false; // okay, definitely a boolean
```

# never

永不存在的值的类型

```jsx
// 返回never的函数必须存在无法达到的终点
function error(message: string): never {
    throw new Error(message);
}

// 推断的返回值类型为never
function fail() {
    return error("Something failed");
}

// 返回never的函数必须存在无法达到的终点
function infiniteLoop(): never {
    while (true) {
    }
}
```

# object

`object`表示非原始类型，也就是除`number`，`string`，`boolean`，`symbol`，`null`或`undefined`之外的类型。

```jsx
// node_modules/typescript/lib/lib.es5.d.ts
interface ObjectConstructor {
  create(o: object | null): any;
  // ...
}

const proto = {};

Object.create(proto);     // OK
Object.create(null);      // OK
Object.create(undefined); // Error
Object.create(1337);      // Error
Object.create(true);      // Error
Object.create("oops");    // Error
```

- boolean
- number
- string
- void
- null
- undefined
- bigint
- symbol

# boolean

```jsx
let isDone: boolean = false;
```

# number

```jsx
let decLiteral: number = 6;
let hexLiteral: number = 0xf00d;
let binaryLiteral: number = 0b1010;
let octalLiteral: number = 0o744;
```

# string

```jsx
let name: string = "bob";
name = "smith";
```

# void

表示没有任何类型

```jsx
//当一个函数没有返回值时，你通常会见到其返回值类型是 void：
function warnUser(): void {
    console.log("This is my warning message");
}
```

```jsx
//声明一个void类型的变量没有什么大用，因为你只能为它赋予undefined和null：
let unusable: void = undefined;
```

# null

```jsx
let n: null = null;
```

# undefined

```jsx
let u: undefined = undefined;
```

# bigInt

```jsx
const theBiggestInt: bigint = 9007199254740991n
const alsoHuge: bigint = BigInt(9007199254740991)
const hugeString: bigint = BigInt("9007199254740991")

theBiggestInt === alsoHuge // true
theBiggestInt === hugeString // true
```

`BigInt` 与 `Number` 的不同点：

- `BigInt` 不能用于 `Math` 对象中的方法。
- `BigInt` 不能和任何 `Number` 实例混合运算，两者必须转换成同一种类型。
- `BigInt` 变量在转换为 `Number` 变量时可能会丢失精度。

# symbol

Symbol() 函数会返回 symbol 类型的值。每个从 Symbol() 返回的 symbol 值都是唯一的。

```jsx
const sym1: symbol = Symbol()
const sym2: symbol = Symbol('foo')
const sym3: symbol = Symbol('foo')
```

相同类型元素组成成为数组，不同类型元素组成了元组（Tuple）。

```jsx
const list: [string, number] = ['Sherlock', 1887]   // ok

const list1: [string, number] = [1887, 'Sherlock']  // error
```

```jsx
const list: [string, number] = ['Sherlock', 1887]

list[0].substr(1)  // ok
list[1].substr(1)  // Property 'substr' does not exist on type 'number'.

//第 3 行，list[0] 是一个字符串类型，拥有 substr() 方法。
//第 4 行，list[1] 是一个数字类型，没有 substr() 方法，所以报错。
```

**可以越界添加元素（不建议），但是不可越界访问：**

```jsx
const list: [string, number] = ['Sherlock', 1887]
list.push('hello world')

console.log(list)      // ok [ 'Sherlock', 1887, 'hello world' ]
console.log(list[2])   // Tuple type '[string, number]' of length '2' has no element at index '2'
```

**允许在元素类型后缀一个 ? 来说明元素是可选的**

```jsx
const list: [number, string?, boolean?]
list = [10, 'Sherlock', true]
list = [10, 'Sherlock']
list = [10]
```

定义一些带名字的常量。TypeScript 支持数字的和基于字符串的枚举。

```jsx
enum Direction { Up, Down, Left, Right }

enum Months { Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec }

enum Size { big = '大', medium = '中', small = '小' }

enum Agency { province = 1, city = 2, district = 3 }
```

声明一个枚举类型，如果没有赋值，它们的值默认为数字类型且从 0 开始累加：

```jsx
enum Months {
  Jan,
  Feb,
  Mar,
  Apr
}

Months.Jan === 0 // true
Months.Feb === 1 // true
Months.Mar === 2 // true
Months.Apr === 3 // true
```

现实中月份是从 1 月开始的，那么只需要这样：

```jsx
// 从第一个数字赋值，往后依次累加
enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr
}

Months.Jan === 1 // true
Months.Feb === 2 // true
Months.Mar === 3 // true
Months.Apr === 4 // true
```

枚举类型的值可以是一个简单的计算表达式：

```jsx
enum Calculate {
  a,
  b,
  expired = 60 * 60 * 24,
  length = 'imooc'.length,
  plus = 'hello ' + 'world'
}

console.log(Calculate.expired)   // 86400
console.log(Calculate.length)    // 5
console.log(Calculate.plus)      // hello world
```

# 枚举合并

分开声明名称相同的枚举类型，会自动合并：

```jsx
enum Months {
  Jan = 1,
  Feb,
  Mar,
  Apr
}

enum Months {
  May = 5,
  Jun
}

console.log(Months.Apr) // 4
console.log(Months.Jun) // 6
```

never 类型表示那些永不存在的值的类型。

unknown 类型是 any 类型对应的安全类型。

# never类型

never 类型是任何类型的子类型，也可以赋值给任何类型；

```jsx
function error(message:string): never {
  throw new Error(message)
}
```

# unknown类型

unknown 类型在被确定为某个类型之前，不能被进行诸如函数执行、实例化等操作，一定程度上对类型进行了保护。

```jsx
let value: unknown

let value1: unknown = value   // OK
let value2: any = value       // OK

let value3: boolean = value   // Error
let value4: number = value    // Error
let value5: string = value    // Error
let value6: object = value    // Error
let value7: any[] = value     // Error
```

> TypeScript 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。——官方定义
>

接口是对 JavaScript 本身的随意性进行约束，通过定义一个接口，约定了变量、类、函数等应该按照什么样的格式进行声明，实现多人合作的一致性。

TypeScript 编译器依赖接口用于类型检查，最终编译为 JavaScript 后，接口将会被移除。

```jsx
interface Clothes {
  color: string;
  size: string;
  price: number;
}

function getClothesInfo(clothes: Clothes) {
  console.log(clothes.price)
}

let myClothes: Clothes = { 
  color: 'black', 
  size: 'XL', 
  price: 98 
}

getClothesInfo(myClothes)
```

# 接口属性

## 可选属性

接口中的属性不全是必需的。可选属性的含义是该属性在被变量定义时可以不存在。

```jsx
// 语法
interface Clothes {
  color?: string;
  size: string;
  price: number;
}

// 这里可以不定义属性 color
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98 
}
```

## 只读属性

属性名前用 `readonly` 来指定只读属性，比如价格是不能被修改的:

```jsx
// 语法
interface Clothes {
  color?: string;
  size: string;
  readonly price: number;
}

// 创建的时候给 price 赋值
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98 
}

// 不可修改
myClothes.price = 100
// error TS2540: Cannot assign to 'price' because it is a constant or a read-only property
```

TypeScript 可以通过 `ReadonlyArray<T>` 设置数组为只读，那么它的所有写方法都会失效。

```jsx
let arr: ReadonlyArray<number> = [1,2,3,4,5];
arr[0] = 6; // Index signature in type 'readonly number[]' only permits reading
```

# `readonly` vs `const`

最简单判断该用 `readonly` 还是 `const` 的方法是看要把它做为变量使用还是做为一个属性。做为 `变量` 使用的话用 const，若做为 `属性` 则使用 readonly。

# 任意属性

接口允许有任意的属性，语法是用 [] 将属性包裹起来：

```jsx
// 语法
interface Clothes {
  color?: string;
  size: string;
  readonly price: number;
  [propName: string]: any;
}

// 任意属性 activity
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98,
  activity: 'coupon'
}
```

# 函数类型

```jsx
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;

mySearch = function(source: string, subString: string): boolean {
  return source.search(subString) > -1;
}
```

# 可索引类型

```jsx
// 正常的js代码
let arr = [1, 2, 3, 4, 5]
let obj = {
  brand: 'imooc',
  type: 'education'
}

arr[0]
obj['brand']
```

```jsx
interface ScenicInterface {
  [index: number]: string
}

let arr: ScenicInterface = ['西湖', '华山', '故宫']
let favorite: string = arr[0]
```

```jsx
// 正确
interface Foo {
  [index: string]: number;
  x: number;
  y: number;
}

// 错误
interface Bar {
  [index: string]: number;
  x: number;
  y: string; // Error: y 属性必须为 number 类型
}
```

# 类类型

类的实现必须遵循接口定义，那么可以使用 **`implements`** 关键字来确保兼容性。

```jsx
interface AnimalInterface {
  name: string

  eat(m: number): string
}

class Dog implements AnimalInterface {
  name: string;

  constructor(name: string){
    this.name = name
  }

  eat(m: number) {
    return `${this.name}吃肉${m}分钟`}
}
```

**接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。**

```jsx
interface AnimalInterface {
  name: string

  eat(m: number): string
}

class Dog implements AnimalInterface {
  name: string

  constructor(name: string) {
    this.name = name
  }
// error 
  private eat(m: number) {
    return `${this.name}吃肉${m}分钟`}
}
```

# 继承接口

```jsx
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

# 混合类型

希望一个对象同时具有上面提到多种类型

```jsx
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
//通过类型断言，将函数对象转换为 Counter 类型，转换后的对象不但实现了函数接口的描述，使之成为一个函数，还具有 interval 属性和 reset() 方法
  let counter = function (start: number) { } as Counter;
  counter.interval = 123;
  counter.reset = function () { };
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

> TypeScript 的核心原则之一是对值所具有的结构进行类型检查。 它有时被称做“鸭式辨型法”或“结构性子类型化”。 在 TypeScript 里，接口的作用就是为这些类型命名和为你的代码或第三方代码定义契约。——官方定义
>

接口是对 JavaScript 本身的随意性进行约束，通过定义一个接口，约定了变量、类、函数等应该按照什么样的格式进行声明，实现多人合作的一致性。

TypeScript 编译器依赖接口用于类型检查，最终编译为 JavaScript 后，接口将会被移除。

```jsx
interface Clothes {
  color: string;
  size: string;
  price: number;
}

function getClothesInfo(clothes: Clothes) {
  console.log(clothes.price)
}

let myClothes: Clothes = { 
  color: 'black', 
  size: 'XL', 
  price: 98 
}

getClothesInfo(myClothes)
```

# 接口属性

## 可选属性

接口中的属性不全是必需的。可选属性的含义是该属性在被变量定义时可以不存在。

```jsx
// 语法
interface Clothes {
  color?: string;
  size: string;
  price: number;
}

// 这里可以不定义属性 color
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98 
}
```

## 只读属性

属性名前用 `readonly` 来指定只读属性，比如价格是不能被修改的:

```jsx
// 语法
interface Clothes {
  color?: string;
  size: string;
  readonly price: number;
}

// 创建的时候给 price 赋值
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98 
}

// 不可修改
myClothes.price = 100
// error TS2540: Cannot assign to 'price' because it is a constant or a read-only property
```

TypeScript 可以通过 `ReadonlyArray<T>` 设置数组为只读，那么它的所有写方法都会失效。

```jsx
let arr: ReadonlyArray<number> = [1,2,3,4,5];
arr[0] = 6; // Index signature in type 'readonly number[]' only permits reading
```

# `readonly` vs `const`

最简单判断该用 `readonly` 还是 `const` 的方法是看要把它做为变量使用还是做为一个属性。做为 `变量` 使用的话用 const，若做为 `属性` 则使用 readonly。

# 任意属性

接口允许有任意的属性，语法是用 [] 将属性包裹起来：

```jsx
// 语法
interface Clothes {
  color?: string;
  size: string;
  readonly price: number;
  [propName: string]: any;
}

// 任意属性 activity
let myClothes: Clothes = { 
  size: 'XL', 
  price: 98,
  activity: 'coupon'
}
```

# 函数类型

```jsx
interface SearchFunc {
  (source: string, subString: string): boolean;
}

let mySearch: SearchFunc;

mySearch = function(source: string, subString: string): boolean {
  return source.search(subString) > -1;
}
```

# 可索引类型

```jsx
// 正常的js代码
let arr = [1, 2, 3, 4, 5]
let obj = {
  brand: 'imooc',
  type: 'education'
}

arr[0]
obj['brand']
```

```jsx
interface ScenicInterface {
  [index: number]: string
}

let arr: ScenicInterface = ['西湖', '华山', '故宫']
let favorite: string = arr[0]
```

```jsx
// 正确
interface Foo {
  [index: string]: number;
  x: number;
  y: number;
}

// 错误
interface Bar {
  [index: string]: number;
  x: number;
  y: string; // Error: y 属性必须为 number 类型
}
```

# 类类型

类的实现必须遵循接口定义，那么可以使用 **`implements`** 关键字来确保兼容性。

```jsx
interface AnimalInterface {
  name: string

  eat(m: number): string
}

class Dog implements AnimalInterface {
  name: string;

  constructor(name: string){
    this.name = name
  }

  eat(m: number) {
    return `${this.name}吃肉${m}分钟`}
}
```

**接口描述了类的公共部分，而不是公共和私有两部分。 它不会帮你检查类是否具有某些私有成员。**

```jsx
interface AnimalInterface {
  name: string

  eat(m: number): string
}

class Dog implements AnimalInterface {
  name: string

  constructor(name: string) {
    this.name = name
  }
// error 
  private eat(m: number) {
    return `${this.name}吃肉${m}分钟`}
}
```

# 继承接口

```jsx
interface Shape {
  color: string;
}

interface PenStroke {
  penWidth: number;
}

interface Square extends Shape, PenStroke {
  sideLength: number;
}

let square = {} as Square;
square.color = "blue";
square.sideLength = 10;
square.penWidth = 5.0;
```

# 混合类型

希望一个对象同时具有上面提到多种类型

```jsx
interface Counter {
  (start: number): string;
  interval: number;
  reset(): void;
}

function getCounter(): Counter {
//通过类型断言，将函数对象转换为 Counter 类型，转换后的对象不但实现了函数接口的描述，使之成为一个函数，还具有 interval 属性和 reset() 方法
  let counter = function (start: number) { } as Counter;
  counter.interval = 123;
  counter.reset = function () { };
  return counter;
}

let c = getCounter();
c(10);
c.reset();
c.interval = 5.0;
```

TypeScript 又为 JavaScript 函数添加了一些额外的功能，让我们可以更容易地使用：

- 函数类型
- 可选参数
- 默认参数
- 剩余参数
- 函数重载

1. 如果一个函数没有使用 `return` 语句，则它默认返回 `undefined`。
2. 调用函数时，传递给函数的值被称为函数的 `实参`（值传递），对应位置的函数参数被称为 `形参`。
3. 在函数执行时， `this` 关键字并不会指向正在运行的函数本身，而是 `指向调用函数的对象`。
4. `arguments` 对象是所有（非箭头）函数中都可用的 `局部变量`。你可以使用 arguments 对象在函数中引用函数的参数。

# 函数类型

在 TypeScript 中编写函数，需要给形参和返回值指定类型：

```jsx
const add = function(x: number, y: number): string {
  return (x + y).toString()
}
//= 等号右侧的匿名函数进行了类型定义，等号左侧的 add 同样可以添加类型：
const add: (x: number, y: number) => string = function(x: number, y: number): string {
  return (x + y).toString()
}
```

**函数类型的 `=>` 和 箭头函数的 `=>` 是不同的含义**。

```jsx
const add = (x: number, y: number): string => (x + y).toString()
// 只要参数位置及类型不变，变量名称可以自己定义，比如把两个参数定位为 a b
const add: (a: number, b: number) => string = (x: number, y: number): string => (x + y).toString()
```

# 函数的参数

## 参数个数保持一致

TypeScript 中每个函数参数都是必须的。

```jsx
const fullName = (firstName: string, lastName: string): string => 
`${firstName}${lastName}`

let result1 = fullName('Sherlock', 'Holmes')
let result2 = fullName('Sherlock', 'Holmes', 'character') 
// Error, Expected 2 arguments, but got 3
let result3 = fullName('Sherlock')                        
// Error, Expected 2 arguments, but got 1
```

## 可选参数

在 TypeScript 里我们可以在参数名旁使用 `?` 实现可选参数的功能，**可选参数必须跟在必须参数后面**

```jsx
const fullName = (firstName: string, lastName?: string): string => `${firstName}${lastName}`

let result1 = fullName('Sherlock', 'Holmes')
let result2 = fullName('Sherlock', 'Holmes', 'character') // Error, Expected 1-2 arguments, but got 3
let result3 = fullName('Sherlock')                        // OK
```

## 默认参数

**可选参数必须跟在必须参数后面**，而**带默认值的参数不需要放在必须参数的后面，可随意调整位置**：

```jsx
const token = (expired = 60*60, secret: string): void  => {}
// 或
const token1 = (secret: string, expired = 60*60 ): void => {}
```

## 剩余参数

通过 `rest 参数` (形式为 `...变量名`)来获取函数的剩余参数，这样就不需要使用 `arguments` 对象了。

```jsx
function assert(ok: boolean, ...args: string[]): void {
  if (!ok) {
    throw new Error(args.join(' '));
  }
}

assert(false, '上传文件过大', '只能上传jpg格式')
```

## this参数

默认情况下，`tsconfig.json` 中，编译选项 `compilerOptions` 的属性 `noImplicitThis` 为 `false`，我们在一个对象中使用的 this 时，它的类型是 any 类型。

```jsx
let triangle = {
  a: 10,
  b: 15,
  c: 20,
  area: function () {
    return () => {
      // this 为 any 类型
      const p = (this.a + this.b + this.c) / 2
      return Math.sqrt(p * (p - this.a) * (p - this.b) *(p - this.c))
    }
  }
}

const myArea = triangle.area()
console.log(myArea())
```

第一种：在 `tsconfig.json` 中，将编译选项 `compilerOptions` 的属性 `noImplicitThis` 设置为 `true`，TypeScript 编译器就会帮你进行正确的类型推断

```jsx
let triangle = {
  a: 10,
  b: 15,
  c: 20,
  area: function () {
    return () => {
      const p = (this.a + this.b + this.c) / 2
      return Math.sqrt(p * (p - this.a) * (p - this.b) *(p - this.c))
    }
  }
}

const myArea = triangle.area()
console.log(myArea())
```

第二种：提供一个显式的 this 参数

```jsx
interface Triangle {
  a: number;
  b: number;
  c: number;
  area(this: Triangle): () => number;
}

let triangle: Triangle = {
  a: 10,
  b: 15,
  c: 20,
  area: function (this: Triangle) {
    return () => {
      const p = (this.a + this.b + this.c) / 2
      return Math.sqrt(p * (p - this.a) * (p - this.b) *(p - this.c))
    }
  }
}

const myArea = triangle.area()
console.log(myArea())
```

# 函数重载

函数重载是指函数根据传入不同的参数，返回不同类型的数据。

```jsx
function reverse(x: string): string
function reverse(x: number): number

function reverse(target: string | number) {
  if (typeof target === 'string') {
    return target.split('').reverse().join('')
  }
  if (typeof target === 'number') {
    return +[...target.toString()].reverse().join('')
  }
}
console.log(reverse('imooc'))   // coomi
console.log(reverse(23874800))  // 847832
```

# 字符串字面量类型

```jsx
let protagonist: 'Sherlock'

protagonist = 'Sherlock'
protagonist = 'Watson' // Error, Type '"Watson"' is not assignable to type '"Sherlock"'
```

# 布尔字面量类型

```jsx
let success: true
let fail: false
let value: true | false
```

# 数字字面量类型

```jsx
let die: 1 | 2 | 3 | 4 | 5 | 6

die = 9 // Error
```

泛型是指在定义函数、接口或者类时，未指定其参数类型，只有在运行时传入才能确定。

```jsx
//函数会返回任何传入它的值
function identity(arg: number): number {
    return arg
}
function identity(arg: string): string {
    return arg
}
//通过泛型，可以把两个函数统一起来：
function identity<T>(arg: T): T {
  return arg
}
```

# 多个类型参数

```jsx
function extend<T, U>(first: T, second: U): T & U {
  for(const key in second) {
    (first as T & U)[key] = second[key] as any
  }
  return first as T & U
}
```

# 泛型参数默认类型

```jsx
function min<T = number>(arr:T[]): T{
  let min = arr[0]
  arr.forEach((value)=>{
     if(value < min) {
         min = value
     }
  })
   return min
}
console.log(min([20, 6, 8n])) // 6
```

# 泛型类型与泛型接口

```jsx
//(x: number, y: number) => string 为函数类型。
const add: (x: number, y: number) => string 
= function(x: number, y: number): string {
  return (x + y).toString()
}
```

```jsx
//泛型
function identity<T>(arg: T): T {
  return arg
}
// identity 函数
let myIdentity: <T>(arg: T) => T = identity

//<T>(arg: T) => T 
// 另一种写法
//{ <T>(arg: T): T }

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: { <T>(arg: T): T } = identity
```

泛型接口

```jsx
interface GenericIdentityFn {
  <T>(arg: T): T
}

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: GenericIdentityFn = identity
```

```jsx
interface GenericIdentityFn<T> {
  (arg: T): T
}

function identity<T>(arg: T): T {
  return arg
}

let myIdentity: GenericIdentityFn<number> = identity
```

# 泛型类

```jsx
class MinClass {
  public list: number[] = []
  add(num: number) {
    this.list.push(num)
  }
  min(): number {
    let minNum = this.list[0]
    for (let i = 0; i < this.list.length; i++) {
      if (minNum > this.list[i]) {
        minNum = this.list[i]
      }
    }
    return minNum
  }
}

// 类名后加上 <T>
class MinClass<T> {
  public list: T[] = []
  add(num: T) {
    this.list.push(num)
  }
  min(): T {
    let minNum = this.list[0]
    for (let i = 0; i < this.list.length; i++) {
      if (minNum > this.list[i]) {
        minNum = this.list[i]
      }
    }
    return minNum
  }
}

let m = new MinClass<string>()
m.add('hello')
m.add('world')
m.add('generic')
console.log(m.min()) // generic
```

# 泛型约束

**通过 `extends` 关键字来实现泛型约束。**

```jsx
interface User {
  username: string
}

function info<T extends User>(user: T): string {
  return 'imooc ' + user.username
}
```

```jsx
type Args = number | string

class MinClass<T extends Args> {}

const m = new MinClass<boolean>() // Error, 必须是 number | string 类型
```

# 多重类型泛型约束

**通过 <T extends Interface1 & Interface2>**

```jsx
interface Sentence {
  title: string,
  content: string
}

interface Music {
  url: string
}

class Classic<T extends Sentence & Music> {
  private prop: T

  constructor(arg: T) {
    this.prop = arg
  }

  info() {
    return {
      url: this.prop.url,
      title: this.prop.title,
      content: this.prop.content
    }
  }
}
```

类型别名会给类型起个新名字。类型别名有时和接口很像，但是可以作用于原始值，联合类型，元组以及其它任何你需要手写的类型。

```jsx
type brand = string
type used = true | false

const str: brand = 'imooc'
const state: used = true
```

```jsx
type month = string | number

const currentMonth: month = 'February'
const nextMonth: month = 3
```

```jsx
interface Admin {
  id: number,
  administrator: string,
  timestamp: string
}

interface User {
  id: number,
  groups: number[],
  createLog: (id: number) => void,
  timestamp: number
}

type T = Admin & User
```

# 接口 vs. 类型别名

类型别名看起来和接口非常类似，区别之处在于：

- 接口可以实现 extends 和 implements，类型别名不行。
- 类型别名并不会创建新类型，是对原有类型的引用，而接口会定义一个新类型。
- 接口只能用于定义对象类型，而类型别名的声明方式除了对象之外还可以定义交叉、联合、原始类型等

类型推断的含义是不需要指定变量类型或函数的返回值类型，TypeScript 可以根据一些简单的规则推断其的类型。

# 基础类型推断

```jsx
let x = 3             // let x: number
let y = 'hello world' // let y: string

let z                 // let z: any
```

```jsx
// 返回值推断为 number
function add(a:number, b:10) {
  return a + b
}

const obj = {
  a: 10,
  b: 'hello world'
}

obj.b = 15 // Error，Type '15' is not assignable to type 'string'
```

```jsx
const obj = {
  protagonist: 'Sherlock',
  gender: 'male'
}

//let protagonist: string
let { protagonist } = obj
```

# 最佳通用类型推断

```jsx
//为了推断 x 的类型，必须考虑所有的元素类型。
//这里有三种元素类型 number、string 和 null，
//此时数组被推断为 let x: (string | number | null)[] 联合类型。
let x = [1, 'imooc', null]
```

# 上下文类型推断

```jsx
class Animal {
  public species: string | undefined
  public weight: number | undefined
}
//将 Animal 类型显示的赋值给 变量 simba，
//Animal 类型 没有 speak 属性，所以不可赋值。
const simba: Animal = {
  species: 'lion',
  speak: true  // Error, 'speak' does not exist in type 'Animal'
}
```

TypeScript 允许你覆盖它的推断，毕竟作为开发者你比编译器更了解你写的代码。

类型断言主要用于当 TypeScript 推断出来类型并不满足你的需求，你需要手动指定一个类型。

# as

```jsx
const user = {}

user.nickname = 'Evan'  // Error, Property 'nickname' does not exist on type '{}'
user.admin = true       // Error, Property 'admin' does not exist on type '{}'
```

使用类型断言（as关键字）覆盖其类型推断：

```jsx
interface User {
  nickname: string,
  admin: boolean,
  groups: number[]
}

const user = {} as User

user.nickname = 'Evan' 
user.admin = true       
user.groups = [2, 6]
```

# 首尾标签

类型断言还可以通过标签 `<>` 来实现：

```jsx
interface User {
  nickname: string,
  admin: boolean,
  groups: number[]
}

const user = <User>{} // User类型

user.nickname = 'Evan' 
user.admin = true       
user.groups = [2, 6]
```

# 非空断言

如果编译器不能够去除 null 或 undefined，可以使用非空断言 ! 手动去除。

```jsx
function fixed(name: string | null): string {
  function postfix(epithet: string) {
    return name!.charAt(0) + '.  the ' + epithet; // name 被断言为非空
  }
  name = name || "Bob"
  return postfix("great")
}
```

类型保护是指缩小类型的范围，在一定的块级作用域内由编译器推导其类型，提示并规避不合法的操作。

# typeof

```jsx
function doSome(x: number | string) {
    if (typeof x === 'string') {
        // 在这个块中，TypeScript 知道 `x` 的类型必须是 `string`
        console.log(x.subtr(1)); // Error: 'subtr' 方法并没有存在于 `string` 上
        console.log(x.substr(1)); // ok
    }

    x.substr(1); // Error: 无法保证 `x` 是 `string` 类型
}
```

# instanceof

```jsx
class User {
  public nickname: string | undefined
  public group: number | undefined
}

class Log {
  public count: number = 10
  public keyword: string | undefined
}

function typeGuard(arg: User | Log) {
  if (arg instanceof User) {
    arg.count = 15 // Error, User 类型无此属性
  }

  if (arg instanceof Log) {
    arg.count = 15 // OK
  }
}
```

# in

in 操作符用于确定属性是否存在于某个对象上，这也是一种缩小范围的类型保护。

```jsx
class User {
  public nickname: string | undefined
  public groups!: number[]
}

class Log {
  public count: number = 10
  public keyword: string | undefined
}

function typeGuard(arg: User | Log) {
  if ('nickname' in arg) {
    // (parameter) arg: User，编辑器将推断在当前块作用域 arg 为 User 类型
    arg.nickname = 'imooc'
  }

  if ('count' in arg) {
    // (parameter) arg: Log，编辑器将推断在当前块作用域 arg 为 Log 类型
    arg.count = 15
  }
}
```

# 字面量类型保护

```jsx
type Success = {
  success: true,
  code: number,
  object: object
}

type Fail = {
  success: false,
  code: number,
  errMsg: string,
  request: string
}

function test(arg: Success | Fail) {
  if (arg.success === true) {
    console.log(arg.object) // OK
    console.log(arg.errMsg) // Error, Property 'errMsg' does not exist on type 'Success'
  } else {
    console.log(arg.errMsg) // OK
    console.log(arg.object) // Error, Property 'object' does not exist on type 'Fail'
  }
}
```

类型兼容性用于确定一个类型是否能赋值给其他类型。

```jsx
let address: string = 'Baker Street 221B'
let year: number = 2010
address = year // Error
```

# 结构化

TypeScript 类型兼容性是基于结构类型的；结构类型只使用其成员来描述类型。

如果 x 要兼容 y，那么 y 至少具有与 x 相同的属性

```jsx
interface User {
  name: string,
  year: number
}

let protagonist = {
  name: 'Sherlock·Holmes',
  year: 1854,
  address: 'Baker Street 221B'
}

let user: User = protagonist // OK
```

# 比较两个函数

## 函数参数

**判断两个函数是否兼容，首先要看参数是否兼容，第二个还要看返回值是否兼容。**

```jsx
let fn1 = (a: number, b: string) => {}
let fn2 = (c: number, d: string, e: boolean) => {}

fn2 = fn1 // OK
fn1 = fn2 // Error
```

**参数类型对应即可，不需要完全相同：**

```jsx
let fn1 = (a: number | string, b: string) => {}
let fn2 = (c: number, d: string, e: boolean) => {}

fn2 = fn1 // OK
```

## 函数返回值

```jsx
let x = () => ({name: 'Alice'})
let y = () => ({name: 'Alice', location: 'Seattle'})

x = y // OK
y = x // Error
```

**类型系统强制源函数的返回值类型必须是目标函数返回值类型的子类型**。

```jsx
let x : () => void
let y = () => 'imooc'

x = y // OK
```

# 枚举的类型兼容性

枚举与数字类型相互兼容:

```jsx
enum Status {
  Pending,
  Resolved,
  Rejected
}

let current = Status.Pending
let num = 0

current = num
num = current
```

不同枚举类型之间是不兼容的：

```jsx
enum Status { Pending, Resolved, Rejected }
enum Color { Red, Blue, Green }

let current = Status.Pending
current = Color.Red // Error
```

# 类的类型兼容性

**比较两个类类型数据时，只有实例成员会被比较，静态成员和构造函数不会比较**

```jsx
class Animal {
  feet!: number
  constructor(name: string, numFeet: number) { }
}

class Size {
  feet!: number
  constructor(numFeet: number) { }
}

let a: Animal
let s: Size

a = s!  // OK
s = a  // OK
```

**类的私有成员和受保护成员会影响兼容性。** 允许子类赋值给父类，但是不能赋值给其它有同样类型的类。

```jsx
class Animal {
  protected feet!: number
  constructor(name: string, numFeet: number) { }
}

class Dog extends Animal {}

let a: Animal
let d: Dog

a = d! // OK
d = a // OK

class Size {
  feet!: number
  constructor(numFeet: number) { }
}

let s: Size

a = s! // Error
```

# 泛型的类型兼容性

泛型的类型兼容性根据其是否被成员使用而不同。

```jsx
interface Empty<T> {}

let x: Empty<number>
let y: Empty<string>
//x 和 y 是兼容的，因为它们的结构使用类型参数时并没有什么不同。
x = y! // OK
```

```jsx
interface NotEmpty<T> {
  data: T
}
let x: NotEmpty<number>
let y: NotEmpty<string>

x = y! // Error
```

如果没有指定泛型类型的泛型参数，会把所有泛型参数当成 any 类型比较:

```jsx
let identity = function<T>(x: T): void {
  // ...
}

let reverse = function<U>(y: U): void {
  // ...
}

identity = reverse // OK
```

交叉类型是将多个类型合并为一个类型

`类型一 & 类型二`

```jsx
interface Admin {
  id: number,
  administrator: string,
  timestamp: string
}

interface User {
  id: number,
  groups: number[],
  createLog: (id: number) => void,
  timestamp: number
}

let t: Admin & User

t!.administrator // 合法 Admin.administrator: string
t!.groups        // 合法 User.groups: number[]
t!.id            // 合法 id: number
t!.timestamp     // 合法 timestamp: never
```

**联合类型表示取值为多种中的一种类型，而交叉类型每次都是多个类型的合并类型。**

语法为：`类型一 | 类型二`。

```jsx
let currentMonth: string | number

currentMonth = 'February'
currentMonth = 2
```

如果一个值是联合类型，那么只能**访问联合类型的共有属性或方法**。

```jsx
interface Dog {
  name: string,
  eat: () => void,
  destroy: () => void
}

interface Cat {
  name: string,
  eat: () => void,
  climb: () => void
}

let pet: Dog | Cat
pet!.name    // OK
pet!.eat()   // OK
pet!.climb() // Error
```

```jsx
function pluck(o, names) {
  return names.map(n => o[n])
}
```

实现这样一个函数的**类型定义**要满足：

- 数组参数 `names` 中的元素，只能是对象 `o` 身上有的属性。
- 返回类型取决于参数 `o` 身上属性值的类型

**索引类型可以让 TypeScript 编译器覆盖检测到使用了动态属性名的代码。**

# keyof

**keyof 可以获取对象的可访问索引字符串字面量类型。**

```jsx
interface User {
  id: number,
  phone: string,
  nickname: string,
  readonly department: string,
}

class Token{
  private secret: string | undefined
  public accessExp: number = 60 * 60
  public refreshExp: number = 60 * 60 * 24 * 30 * 3
}

let user: keyof User // let user: "id" | "phone" | "nickname" | "department"
type token = keyof Token // type token = "accessExp" | "refreshExp"
```

# T[K]

```jsx
class Token{
  public secret: string = 'ixeFoe3x.2doa'
  public accessExp: number = 60 * 60
  public refreshExp: number = 60 * 60 * 24 * 30 * 3
}

type token = keyof Token
type valueType = Token[token] // type valueType = string | number
type secret = Token['secret'] // type secret = string
```

```jsx
function getProperty<T, K extends keyof T>(o: T, name: K): T[K] {
  return o[name]; // o[name] is of type T[K]
}
```

**映射类型可以将已知类型的每个属性都变为可选的或者只读的。**

# Readonly

```jsx
type Readonly<T> = {
  readonly [K in keyof T]: T[K]
}
```

```tsx
interface Person{
  name: string
  age: number
}
type PersonReadonly = Readonly<Person>
//type PersonReadonly = {
//  readonly name: string
//  readonly age: number
//}
```

# Partial

**`Partial`** 译为 部分的/局部的/不完全的, 作用是将一个接口的所有参数变为非必填

```tsx
type Partial<T> = {
  [K in keyof T]?: T[K]
}
```

```tsx
interface Person{
  name: string
  age: number
}

type PersonOptional = Partial<Person>

//type PersonOptional = {
//  name?: string
//  age?: number
//}
```

# Required

**`Required`** 译为必须的, 作用是将一个接口中所有非必填参数 变为必填，**`Required<T>`** 的作用就是将某个类型里的属性全部变为必选项。

```tsx
/**
 * Make all properties in T required
 */
type Required<T> = {
    [P in keyof T]-?: T[P];
};
```

```tsx
interface User {
  id: number;
  age: number;
}
type PartialUser = Partial<User>;
// type PartialUser = {
//     id?: number;
//     age?: number;
// }
type PickUser = Required<PartialUser>;
// type PickUser = {
//     id: number;
//     age: number;
// }
```

# Pick

**`Pick`**译为挑选/选择, 作用是从一个复合类型中，取出几个想要的类型的组合一个新的类型

```tsx
type Pick<T, K extends keyof T> = {
    [P in K]: T[P];
}
```

```tsx
interface B {
  id: number;
  name: string;
  age: number;
}

type PickB = Pick<B, "id" | "name">;

// type PickB = {
//     id: number;
//     name: string;
// }
```

# Record

**`Record`** 译为 记录/记载, 作用是将一个类型的所有属性值都映射到另一个类型上并创造一个新的类型

```tsx
type Record<K extends string, T> = {
    [P in K]: T;
}
```

```tsx
type petsGroup = 'dog' | 'cat' | 'fish';

type numOrStr = number | string;

type IPets = Record<petsGroup, numOrStr>;

// type IPets = {
//     dog: numOrStr;
//     cat: numOrStr;
//     fish: numOrStr;
// }
```

根据一个条件表达式来进行类型检测，从两个类型中选出其中一个：

```tsx
T extends U ? X : Y
```

```tsx
declare function f<T extends boolean>(x: T): T extends true ? string : number

const x = f(Math.random() < 0.5) // const x: string | number

const y = f(true) // const y: string
const z = f(false) // const z: number
```

- `Exclude<T, U>` – 从 `T` 中剔除可以赋值给 `U` 的类型。/ɪkˈskluːd/
- `Extract<T, U>` – 提取 `T` 中可以赋值给 `U` 的类型。/ˈekstrə/
- `NonNullable<T>` – 从 `T` 中剔除 null 和 undefined。
- `ReturnType<T>` – 获取函数返回值类型。
- `InstanceType<T>` – 获取构造函数类型的实例类型。

```tsx
type T00 = Exclude<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "b" | "d"
type T01 = Extract<"a" | "b" | "c" | "d", "a" | "c" | "f">;  // "a" | "c"

type T02 = Exclude<string | number | (() => void), Function>;  // string | number
type T03 = Extract<string | number | (() => void), Function>;  // () => void

type T04 = NonNullable<string | number | undefined>;  // string | number
type T05 = NonNullable<(() => string) | string[] | null | undefined>;  // (() => string) | string[]

function f1(s: string) {
    return { a: 1, b: s };
}

class C {
    x = 0;
    y = 0;
}

type T10 = ReturnType<() => string>;  // string
type T11 = ReturnType<(s: string) => void>;  // void
type T12 = ReturnType<(<T>() => T)>;  // {}
type T13 = ReturnType<(<T extends U, U extends number[]>() => T)>;  // number[]
type T14 = ReturnType<typeof f1>;  // { a: number, b: string }
type T15 = ReturnType<any>;  // any
type T16 = ReturnType<never>;  // any
type T17 = ReturnType<string>;  // Error
type T18 = ReturnType<Function>;  // Error

type T20 = InstanceType<typeof C>;  // C
type T21 = InstanceType<any>;  // any
type T22 = InstanceType<never>;  // any
type T23 = InstanceType<string>;  // Error
type T24 = InstanceType<Function>;  // Error
```

**implements**

实现，一个新的类，从父类或者接口实现所有的属性和方法，同时可以重写属性和方法，包含一些新的功能

**extends**

继承，一个新的接口或者类，从父类或者接口继承所有的属性和方法，不可以重写属性，但可以重写方法

- 接口不能实现接口或者类，所以实现只能用于类身上,即类可以实现接口或类
- 接口可以继承接口或类
- 类不可以继承接口，类只能继承类
- 可多继承或者多实现

`is` 关键字一般用于函数返回值类型中，判断参数是否属于某一类型，并根据结果返回对应的布尔类型

语法：`prop is type`

```tsx
function isString(s: unknown): boolean {
  return typeof s === 'string'
}

function toUpperCase(x: unknown) {
  if(isString(x)) {
    x.toUpperCase() // Error, Object is of type 'unknown'
  }
}
```

```tsx
const isString = (s: unknown): s is string => typeof val === 'string'

function toUpperCase(x: unknown) {
  if(isString(x)) {
    x.toUpperCase()
  }
}
```

# 扩展函数

```tsx
const isNumber = (val: unknown): val is number => typeof val === 'number'
const isString = (val: unknown): val is string => typeof val === 'string'
const isSymbol = (val: unknown): val is symbol => typeof val === 'symbol'
const isFunction = (val: unknown): val is Function => typeof val === 'function'
const isObject = (val: unknown): val is Record<any, any> => 
         val !== null && typeof val === 'object'

function isPromise<T = any>(val: unknown): val is Promise<T> {
  return isObject(val) && isFunction(val.then) && isFunction(val.catch)
}

const objectToString = Object.prototype.toString
const toTypeString = (value: unknown): string => objectToString.call(value)
const isPlainObject = (val: unknown): val is object => 
           toTypeString(val) === '[object Object]'
```

语句 `let num` 中，通过 `let` 来声明了一个变量，那怎样声明一个不确定的类型变量呢？

答案是使用 `infer` 关键字，`infer R` 就是声明了一个类型变量 `R`。

**`infer` 的作用是让 `TypeScript` 自己推断，并将推断的结果存储到一个类型变量中，`infer` 只能用于 `extends` 语句中。**

```tsx
const add = (x:number, y:number) => x + y
type t = ReturnType<typeof add> // type t = number

type ReturnType<T extends (...args: any) => any> = T extends (...args: any) => infer R ? R : any
```

Truthy 指的是转换后的值为’真‘的值，Falsy 是在 Boolean 上下文中已认定可转换为‘假‘的值。

[转换](https://www.notion.so/022c2c82353a4d46a608cdae347e81e2?pvs=21)

需要注意下，空函数、空数组、空对象这些都是 Truthy，返回 true。

#

操作符 ! 表示取反，得到一个布尔值：

```tsx
let fn = () => {}
let obj = {}
let arr: never[] = []

console.log(!fn)  // false
console.log(!obj) // false
console.log(!arr) // false

let num = 10
let str = 'imooc'

console.log(!num) // false
console.log(!str) // false

let n = null
let u = undefined
let N = NaN
let z = 0

console.log(!n)   // true
console.log(!u)   // true
console.log(!N)   // true
console.log(!z)   // true
```

#

操作符 !! 表示变量被强制类型转换为布尔值后的值：

```tsx
let fn = () => {}
let obj = {}
let arr: never[] = []

console.log(!!fn)  // true
console.log(!!obj) // true
console.log(!!arr) // true

let num = 10
let str = 'imooc'

console.log(!!num) // true
console.log(!!str) // true

let n = null
let u = undefined
let N = NaN
let z = 0

console.log(!!n)   // false
console.log(!!u)   // false
console.log(!!N)   // false
console.log(!!z)   // false
```

当一个对象实现了[`Symbol.iterator`](https://www.tslang.cn/docs/handbook/symbols.html#symboliterator)属性时，我们认为它是可迭代的。

# **`for..of` 语句**

`for..of`会遍历可迭代的对象，调用对象上的`Symbol.iterator`方法。

```tsx
let someArray = [1, "string", false];

for (let entry of someArray) {
    console.log(entry); // 1, "string", false
}
```

# **`*for..of` vs. `for..in` 语句***

`for..of`和`for..in`均可迭代一个列表；但是用于迭代的值却不同，`for..in`迭代的是对象的 *键* 的列表，而`for..of`则迭代对象的键对应的值。

```tsx
let list = [4, 5, 6];

for (let i in list) {
    console.log(i); // "0", "1", "2",
}

for (let i of list) {
    console.log(i); // "4", "5", "6"
}
```

# 使用

```tsx
npm i reflect-metadata --save
```

```tsx
//tsconfig.json
{
  "compilerOptions": {
    "target": "ES5",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}
```

```tsx
import 'reflect-metadata'

@Reflect.metadata('token', 'aW1vb2M=')
class Employee {

  @Reflect.metadata('level', 'D2')
  salary() {
    console.log('这是个秘密')
  }

  @Reflect.metadata('times', 'daily')
  static meeting() {}

}

const token = Reflect.getMetadata('token', Employee)
const level = Reflect.getMetadata('level', new Employee(), 'salary')
const times = Reflect.getMetadata('times', Employee, 'meeting')

console.log(token) // aW1vb2M=
console.log(level) // D2
console.log(times) // daily
```

```tsx
import 'reflect-metadata'
 
// 元数据的命令式定义，定义对象或属性的元数据
Reflect.defineMetadata(metadataKey, metadataValue, target)
Reflect.defineMetadata(metadataKey, metadataValue, target, propertyKey)
 
// 检查对象或属性的原型链上是否存在元数据键
let result = Reflect.hasMetadata(metadataKey, target)
let result = Reflect.hasMetadata(metadataKey, target, propertyKey)
 
// 检查对象或属性是否存在自己的元数据键
let result = Reflect.hasMetadata(metadataKey, target)
let result = Reflect.hasMetadata(metadataKey, target, propertyKey)
 
// 获取对象或属性原型链上元数据键的元数据值
let result = Reflect.getMetadata(metadataKey, target)
let result = Reflect.getMetadata(metadataKey, target, propertyKey)
 
// 获取对象或属性的自己的元数据键的元数据值
let result = Reflect.getOwnMetadata(metadataKey, target)
let result = Reflect.getOwnMetadata(metadataKey, target, propertyKey)
 
// 获取对象或属性原型链上的所有元数据键
let result = Reflect.getMetadataKeys(target)
let result = Reflect.getMetadataKeys(target, propertyKey)
 
// 获取对象或属性的所有自己的元数据键
let result = Reflect.getOwnMetadataKeys(target)
let result = Reflect.getOwnMetadataKeys(target, propertyKey)
 
// 从对象或属性中删除元数据
let result = Reflect.deleteMetadata(metadataKey, target)
let result = Reflect.deleteMetadata(metadataKey, target, propertyKey)
 
// 通过装饰器将元数据应用于构造函数
@Reflect.metadata(metadataKey, metadataValue)
class C {
  // 通过装饰器将元数据应用于方法(属性)
  @Reflect.metadata(metadataKey, metadataValue)
  method() {
  }
}
```

在 TypeScript 中，可以根据不同的功能定义多个可复用的类，它们将作为 `mixins`。因为 `extends` 只支持继承一个父类，我们可以通过 `implements` 来连接多个 `mixins`，并且使用原型链连接子类的方法和父类的方法。

```tsx
let target = {  a: 1,  b: 1 }
let source1 = {  a: 2,  c: 3 }
let source2 = {  b: 2,  d: 4 }

Object.assign(target, source1, source2)

console.log(target) // { a: 2, b: 2, c: 3, d: 4 }
```

```tsx
// Disposable Mixin
class Disposable {
    isDisposed: boolean;
    dispose() {
        this.isDisposed = true;
    }

}

// Activatable Mixin
class Activatable {
    isActive: boolean;
    activate() {
        this.isActive = true;
    }
    deactivate() {
        this.isActive = false;
    }
}

class SmartObject implements Disposable, Activatable {
    constructor() {
        setInterval(() => console.log(this.isActive + " : " + this.isDisposed), 500);
    }

    interact() {
        this.activate();
    }

//将要 mixin 进来的属性/方法创建出占位属性。
    // Disposable
    isDisposed: boolean = false;
    dispose: () => void;
    // Activatable
    isActive: boolean = false;
    activate: () => void;
    deactivate: () => void;
}
applyMixins(SmartObject, [Disposable, Activatable]);

let smartObj = new SmartObject();
setTimeout(() => smartObj.interact(), 1000);

//applyMixins() 方法借助 Object.getOwnPropertyNames() 遍历 mixins 上的所有属性，
//并复制到目标上去，把之前的占位属性替换成真正的实现代码
function applyMixins(derivedCtor: any, baseCtors: any[]) {
    baseCtors.forEach(baseCtor => {
        Object.getOwnPropertyNames(baseCtor.prototype).forEach(name => {
            derivedCtor.prototype[name] = baseCtor.prototype[name];
        });
    });
}
```

`export`： 导出模块中的变量、函数、类、接口等；

`import`： 导入其他模块导出的变量、函数、类、接口等。

TypeScript 与 ECMAScript 2015 一样，任何包含顶级 `import` 或者 `export` 的文件都被当成一个模块。相反的，如果一个文件不带有顶级的 `import` 或者 `export` 声明，那么它的内容被视为全局可见的。

# 全局模块

在一个 TypeScript 工程创建一个 `test.ts` 文件，写入代码：

```tsx
const a = 1

```

然后，在相同的工程下创建另一个 `test2.ts` 文件，写入代码：

```tsx
const a = 2

```

此时编译器会提示重复定义错误，虽然是在不同的文件下，但处于同一全局空间。

如果加上 `export` 导出语句：

```tsx
export const a = 1

```

这样，两个 `a` 因处于不同的命名空间，就不会报错。

# 导出语法

# 使用export 导出声明

任何声明（比如变量，函数，类，类型别名或接口）都能够通过添加 export 关键字来导出。

```tsx
export const a: number = 1
export const add = (x: number, y:number) => x + y 

export interface User {
  nickname: string,
  department: string
}
export class Employee implements User {
  public nickname!: string
  public department!: string
}

export type used = true | false
```

## 先声明，后导出

先进行声明操作，最终统一使用 export 关键字导出

```tsx
const a: number = 1
const add = (x: number, y:number) => x + y 

interface User {
  nickname: string,
  department: string
}
class Employee implements User {
  public nickname!: string
  public department!: string
}

type used = true | false

export { a, add, Employee }
```

## 导出时重命名

```tsx
const a: number = 1
const add = (x: number, y:number) => x + y 

interface User {
  nickname: string,
  department: string
}
class Employee implements User {
  public nickname!: string
  public department!: string
}

type used = true | false

export { add }
export { a as level, used as status, Employee }
```

## 重新导出

重新导出功能并不会在当前模块导入那个模块或定义一个新的局部变量。

```tsx
export interface StringValidator {
  isAcceptable(s: string): boolean
}

export const numberRegexp = /^[0-9]+$/

class ZipCodeValidator implements StringValidator {
isAcceptable(s: string) {
  return s.length === 5 && numberRegexp.test(s)
}
}
export { ZipCodeValidator }
export { ZipCodeValidator as mainValidator }
```

一个模块可以包裹多个模块，并把他们导出的内容联合在一起通过语法：`export * from 'module'`。

```tsx
// validator.ts
export * from './ZipCodeValidator'
export * from './ParseIntBasedZipCodeValidator'
```

## 默认导出

```tsx
export default class ZipCodeValidator {
  static numberRegexp = /^[0-9]+$/
  isAcceptable(s: string) {
    return s.length === 5 && ZipCodeValidator.numberRegexp.test(s)
  }
}
```

# 导入语法

## 使用import导入

```tsx
import { a, add, Employee } from './export'
```

## 导入时重命名

```tsx
import { a as level, used as status } from './export'
```

## 将整个模块导入到一个变量

```tsx
import * as TYPES from './export'
```

## 直接导入

```tsx
import './export'
```

使用 `namespace` 关键字来声明命名空间。

TypeScript 的命名空间可以将代码包裹起来，只对外暴露这个命名空间对象，通过 `export` 关键字将命名空间内的变量挂载到命名空间对象上。

命名空间本质上就是一个对象，将其内部的变量组织到这个对象的属性上：

```tsx
namespace Calculate {
  const fn = (x: number, y: number) => x * y 
  export const add = (x: number, y:number) => x + y
}
```

TypeScript 中的声明会创建以下三种实体之一：命名空间、类型或值。

[类型声明](https://www.notion.so/3aa3e95cdf3848799c4f87a16b75e704?pvs=21)

# 接口合并

```tsx
interface Box {
  height: number
  width: number
}

interface Box {
  scale: number
  width: number // 类型相同 OK
}

let box: Box = {height: 5, width: 6, scale: 10}
```

接口合并时，将遵循以下规范：

- 接口内优先级是从上到下；
- 后面的接口具有更高优先级；
- 如果函数的参数是字符串字面量，会被提升到函数声明的最顶端。

```tsx
interface Document {
  createElement(tagName: any): Element              // 5
}
interface Document {
  createElement(tagName: 'div'): HTMLDivElement     // 2
  createElement(tagName: 'span'): HTMLSpanElement   // 3
}
interface Document {
  createElement(tagName: string): HTMLElement         // 4
  createElement(tagName: 'canvas'): HTMLCanvasElement // 1
}

interface Document {
  createElement(tagName: 'canvas'): HTMLCanvasElement
  createElement(tagName: 'div'): HTMLDivElement
  createElement(tagName: 'span'): HTMLSpanElement
  createElement(tagName: string): HTMLElement
  createElement(tagName: any): Element
}
```

# 命名空间合并

合并多个具有相同名称的命名空间：

- 导出成员不可重复定义
- 非导出成员仅在其原有的（合并前的）命名空间内可见

```tsx
namespace A {
  let used = true

  export function fn() {
      return used
  }
}

namespace A {
  export function fnOther() {
      return used // Error, 未找到变量 used
  }
}

A.fn()      // OK
A.fnOther() // OK
```

# 命名空间与其他类型的合并

## 命名空间与类的合并

合并名称相同的命名空间与类：

- 命名空间内的成员必须导出，合并后的类才能访问
- 命名空间内导出的成员，相当于合并后类的静态属性
- 命名空间要放在类的定义后面

```tsx
class Album {
  label!: Album.AlbumLabel
}
namespace Album {
  export class AlbumLabel { }
  export const num = 10
}

console.log(Album.num) // 10
```

## 命名空间与函数的合并

- 名称相同的命名空间与函数挂载同一个对象
- 命名空间要放在函数的定义后面

```tsx
function buildLabel(name: string): string {
  return buildLabel.prefix + name + buildLabel.suffix
}

namespace buildLabel {
  export let suffix = '.C'
  export let prefix = 'Hello, '
}

console.log(buildLabel('Mr.Pioneer')) // Hello, Mr.Pioneer.C
```

## 命名空间与枚举的合并

```tsx
enum Color {
  red = 1,
  green = 2,
  blue = 4
}

namespace Color {
  export function mixColor(colorName: string) {
    switch (colorName) {
      case 'yellow':
        return Color.red + Color.green
      case 'white':
        return Color.red + Color.green + Color.blue
      default:
        break
    }
  }
}

console.log(Color.mixColor('yellow')) // 3
```
