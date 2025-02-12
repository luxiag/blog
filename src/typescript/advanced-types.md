---
title: TypeScript 高级类型
date: 2025-02-04
category:
  - TypeScript
---

# 高级类型

## Intersection Types 交叉类型

交叉类型是将多个类型合并为一个类型，表示同时具备多个类型的特性。

```ts
type A = { name: string };
type B = { age: number };

type C = A & B;

const c: C = {
  name: "张三",
  age: 18,
};
```

## Union Types 联合类型

联合类型表示一个值可以是几种类型之一。

```ts
type A = string | number;

const a: A = "hello";
const b: A = 123;
```

## Type Aliases 类型别名

类型别名用来给一个类型起一个新名字。

```ts
type A = { name: string };

const a: A = {
  name: "张三",
};
```

## Type Assertions 类型断言

类型断言可以用来告诉编译器变量的实际类型。

```ts
const a = "hello" as string;
const b = <string>"hello";
```

## Type Index 类型索引

类型索引可以用来获取一个类型的某个属性的类型。

```ts
type A = { name: string; age: number };

type B = A["name"]; // B 的类型为 string

type C = A["name" | "age"]; // C 的类型为 string | number

type D = A[keyof A]; // D 的类型为 string | number
```

## Type Constraints 类型约束

类型约束可以用来限制一个类型的范围。

```ts
// extends 关键词不同于在 class 后使用 extends 的继承作用，泛型内使用的主要作用是对泛型加以约束。
function process<T extends number | string>(value: T) {
  if (typeof value === "number") {
    console.log(value.toFixed(2));
  } else {
    console.log(value.toUpperCase());
  }
}
```

## Type Mapping 类型映射

类型映射可以用来创建一个新的类型，该类型是原类型的每个属性的类型都被替换为新的类型。

```ts
type A = { name: string; age: number };

type B = {
  // in 关键词的作用主要是做类型的映射，遍历已有接口的 key 或者是遍历联合类型。
  [K in keyof A]: A[K] extends number ? string : number;
};

const b: B = {
  name: 123,
  age: "hello",
};
```

## Type Inference 类型推断

类型推断是指在声明变量时，编译器会根据赋值的内容自动推断变量的类型。

```ts
const a = "hello"; // a 的类型为 string
```

## Type Guards 类型守卫

类型守卫是一种特殊的类型谓词，用于在运行时检查变量的类型。

### typeof

typeof 类型守卫可以用来检查一个变量的类型是否为某个值。

```ts
function isString(value: any): value is string {
  return typeof value === "string";
}

function isNumber(value: any): value is number {
  return typeof value === "number";
}

function process(value: any) {
  if (isString(value)) {
    console.log(value.toUpperCase());
  } else if (isNumber(value)) {
    console.log(value.toFixed(2));
  }
}
```

### instanceof

instanceof 类型守卫可以用来检查一个变量是否为某个类的实例。

```ts
class A {}

function isA(value: any): value is A {
  return value instanceof A;
}

function process(value: any) {
  if (isA(value)) {
    console.log(value.name);
  }
}
```

### in

in 类型守卫可以用来检查一个变量是否具有某个属性。

```ts
interface A {
  name: string;
}

interface B {
  age: number;
}

function isA(value: any): value is A {
  return "name" in value;
}
function isB(value: any): value is B {
  return "age" in value;
}

function process(value: any) {
  if (isA(value)) {
    console.log(value.name);
  } else if (isB(value)) {
    console.log(value.age);
  }
}
```

## Type Compatibility 类型兼容性

类型兼容性是指一个类型是否可以赋值给另一个类型。

```ts
interface A {
  name: string;
}

interface B {
  name: string;
  age: number;
}

const a: A = { name: "张三" };
const b: B = { name: "李四", age: 18 };

a = b; // OK
b = a; // Error
```

# Generic Types 泛型

泛型是指在定义函数、接口或类时不指定具体的类型，而是在使用时指定类型。

```ts
function identity<T>(value: T): T {
  return value;
}

const a = identity<string>("hello");
const b = identity<number>(123);
```

## Generic Function 泛型函数

泛型函数是指在定义函数时使用泛型参数。

```ts
function identity<T>(args: T): T {
  return args;
}

function genericFunction<T, U>(param1: T, param2: U): [T, U] {
    return [param1, param2];
}
```

## Generic Interface 泛型接口

泛型接口是指在定义接口时使用泛型参数。

```ts
interface A<T> {
  value: T;
}

const a: A<string> = { value: "hello" };
const b: A<number> = { value: 123 };
```

## Generic Class 泛型类

泛型类是指在定义类时使用泛型参数。

```ts
class A<T> {
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

const a = new A<string>("hello");
const b = new A<number>(123);
```

## Generic Constraints 泛型约束

泛型约束是指对泛型进行限制，确保泛型具有某些属性或方法。

```ts
function identity<T extends { length: number }>(value: T): T {
  console.log(value.length);
  return value;
}

const a = identity<string>("hello");
const b = identity<number[]>([1, 2, 3]);
```

## Generic Utility Types 泛型工具类型

泛型工具类型是指 TypeScript 提供的一些内置泛型类型，用于处理常见的类型操作。

```ts
type A = { name: string; age: number };
// Partial 允许你将T类型的所有属性设为可选。 它将在每一个字段后面添加一个?。
type B = Partial<A>; // { name?: string; age?: number; }
// 将某个类型里的属性全部变为必选项
type C = Required<A>; // { name: string; age: number; }
// Pick<T, K> T中选择一些属性作为K,
type D = Pick<A, "name">; // { name: string; }
// Omit<T, K> 从类型T中删除K个属性。
type E = Omit<A, "age">; // { name: string; }
// 排除两个不同类型中已经存在的共有属性来构造新的类型
type F = Exclude<string | number, number>; // string
// Extract<T, U> 选择两种不同类型中的共有属性来构造新的类型
type G = Extract<string | number, number>; // number
// 剔除 null 和 undefined
type H = NonNullable<string | number | null | undefined>; // string | number
// 给定类型T的一组属性K的类型。将一个类型的属性映射到另一个类型的属性
type I = Record<string, number>; // { [key: string]: number; }
interface EmployeeType {
    id: number;
    fullname: string;
    role: string;
}
let employees: Record<number, EmployeeType> = {
    0: { id: 1, fullname: 'John Doe', role: 'Designer' },
    1: { id: 2, fullname: 'Ibrahima Fall', role: 'Developer' },
    2: { id: 3, fullname: 'Sara Duckson', role: 'Developer' },
};
//  获取函数类型的参数类型，并返回一个元组类型，其中包含这些参数类型。
type J = Parameters<() => void>; // []
//  获取函数类型的返回类型。
type K = ReturnType<() => void>; // void
```

# extends 和 implements

- implements 实现，一个新的类，从父类或者接口实现所有的属性和方法，同时可以重写属性和方法，包含一些新的功能
- 接口不能实现接口或者类，所以实现只能用于类身上,即类可以实现接口或类

- extends 继承，从父类或者接口继承所有的属性和方法，不可以重写属性，但可以重写方法，接口可以继承多个接口，类只能继承一个类
- 类不可以继承接口，类只能继承类
- 接口可以继承接口或类，

```ts
// 继承类
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }

  speak(): void {
    console.log(`My name is ${this.name}`);
  }
}

class Dog extends Animal {
  breed: string;

  constructor(name: string, breed: string) {
    super(name);
    this.breed = breed;
  }

  speak(): void {
    console.log(`Woof! My name is ${this.name} and I am a ${this.breed}`);
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // 输出：Woof! My name is Buddy and I am a Golden Retriever


// 接口继承类
class Animal {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

interface AnimalInterface {
  name: string;
  speak(): void;
}

interface DogInterface extends AnimalInterface {
  breed: string;
}

class Dog implements DogInterface {
  name: string;
  breed: string;

  constructor(name: string, breed: string) {
    this.name = name;
    this.breed = breed;
  }

  speak(): void {
    console.log(`Woof! My name is ${this.name} and I am a ${this.breed}`);
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // 输出：Woof! My name is Buddy and I am a Golden Retriever

// 继承接口
interface Animal {
  name: string;
  speak(): void;
}

interface Dog extends Animal {
  breed: string;
}

class Dog implements Dog {
  name: string;
  breed: string;

  constructor(name: string, breed: string) {
    this.name = name;
    this.breed = breed;
  }

  speak(): void {
    console.log(`Woof! My name is ${this.name} and I am a ${this.breed}`);
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // 输出：Woof! My name is Buddy and I am a Golden Retriever

// 多继承
interface Animal {
  name: string;
  speak(): void;
}

interface Walkable {
  walk(): void;
}

interface Dog extends Animal, Walkable {
  breed: string;
}

class Dog implements Dog {
  name: string;
  breed: string;

  constructor(name: string, breed: string) {
    this.name = name;
    this.breed = breed;
  }

  speak(): void {
    console.log(`Woof! My name is ${this.name} and I am a ${this.breed}`);
  }

  walk(): void {
    console.log(`I am walking`);
  }
}

const dog = new Dog("Buddy", "Golden Retriever");
dog.speak(); // 输出：Woof! My name is Buddy and I am a Golden Retriever
dog.walk(); // 输出：I am walking


```

# Type 和 Interface的区别

- type 是 类型别名，给一些类型的组合起别名，这样能够更方便地在各个地方使用。
- type 能表示的任何类型组合。

```ts
type ID = string | number;
type Circle = {
  x: number;
  y: number;
  radius: number;
}
```

- interface 是接口，用于定义对象的类型，只能描述对象结构。
- interface 可以继承（extends）另一个 interface，也可以继承自 type，但只能是对象结构，或多个对象组成交叉类型（&）的 type。
- interface 支持声明合并，文件下多个同名的 interface，它们的属性会进行合并。

```ts
interface Position {
  x: number;
  y: number;
}

// 声明合并
interface Point {
  x: number;
}

interface Point {
  y: number;
}

const point: Point = { x: 10, y: 30 };
```
