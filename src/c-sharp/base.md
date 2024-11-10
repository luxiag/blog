---
title: C# 基础
category:
 - c-sharp
date: 2024-01-02
---

# 概括

```cs
// 命名空间
using System;
// 命名空间
namespace Simple {
  // 类
  class Program {
    // 
    static void Main(){
      Console.WriteLine("Hello World!");
    }
  }
}

```

## .Net和C#的关系

一、asp.net是一种用来快速创建动态Web网站的技术，不是语言，它使用C#(或者VB.net)为开发语言。C#是一种面向对象的编程语言；net只是一个框架，.net中所有的编程语言，比如c#、.net等编写的程序必须在.net framework框架下运行。

.NET 分成两个方面：WinForm和WebForm，ASP.NET就是属于WebForm，也就是平时说的B/S模式的开发。而WinForm就是属于C/S模式。

Asp.NET可以用C#或VB.NET来开发。编译后形成CLR，通过服务器的IIS+.NET> FrameWork再次编译来运行。

二、.Net全称.NET Framework是一个开发和运行环境，该战略是微软的一项全新创意，它将使得“互联网行业进入一个更先进的阶段”，.NET不是一种编程语言。简单说就是一组类库框架。

.NET有很多种语言组成，比如C#、 VB.NET、J#、Jsript、Managed、C++，但是都是运行在.NET FrameWork Run Time底下的。其中，C#是主流。

三、C#是.NET Framework框架支持的一种主力开发语言，可用于开发ASP.NET网站,Windows程序，控制台程序，甚至于手机软件(Windows> Phone)。

## 标识符

在C#中，标识符是用于表示变量、方法、类、接口、属性、事件等程序实体的名称。标识符可以由字母（A-Z，a-z）、数字（0-9）、下划线（_）和@符号组成，但是不能以数字开头。C#是区分大小写的，因此大写字母和小写字母被认为是不同的字符。标识符的命名应该遵循以下规则：

1. **合法性**：标识符必须以字母、下划线或@开头，后面可以跟任意数量的字母、数字、下划线或@符号。
2. **命名约定**：C#有一套命名约定，虽然不是强制性的，但遵循这些约定可以提高代码的可读性和一致性。例如：
   - 类名和接口名应该使用帕斯卡命名法（PascalCase），即每个单词的首字母大写，如`MyClass`、`IDataService`。
   - 方法和属性名也应该使用帕斯卡命名法，如`CalculateTotal`、`ProductName`。
   - 变量和参数名应该使用骆驼命名法（camelCase），即第一个单词的首字母小写，后续单词的首字母大写，如`backgroundColor`、`indexOf`。
   - 私有字段通常以一个下划线开头，如`_privateField`。
   - 常量名应该使用全大写字母，单词之间可以用下划线分隔，如`MAX_HEIGHT`、`DEFAULT_TIMEOUT`。
3. **关键字**：C#中有一些关键字，这些关键字有特定的语言含义，不能用作标识符。例如`class`、`int`、`if`等。如果确实需要使用与关键字相同的名称，可以在名称前后添加@符号，如`@class`。
4. **作用域**：标识符的作用域是指它们在代码中的可见性。在C#中，标识符可以在类、方法或代码块内部声明，其作用域限定在声明它们的区域。
5. **不推荐使用的字符**：虽然@符号是合法的，但通常不推荐在标识符中使用，除非是为了解决与关键字冲突的情况。
遵循这些规则和约定可以帮助创建清晰、易于理解和维护的C#代码。

## 关键字

C#中有一些关键字，这些关键字有特定的语言含义，不能用作标识符。例如`class`、`int`、`if`等。如果确实需要使用与关键字相同的名称，可以在名称前后添加@符号，如`@class`。

## Main方法

在C#中，`Main`方法是程序的入口点。当程序启动时，CLR会调用`Main`方法。`Main`方法通常返回一个整数类型，表示程序的退出代码。`Main`方法可以接受一个字符串数组作为参数，该数组包含传递给程序的命令行参数。

```cs
class Program
{
    static void Main(string[] args)
    {
  
    }
}

```

## CLI和CLR

### CLI

CLI（Common Language Infrastructure）是微软为.NET框架开发的一种语言无关的、平台无关的虚拟机规范。CLI包括以下几个部分：

1. **公共中间语言（Common Intermediate Language，CIL）**：CIL是一种低级、平台无关的中间语言，它将源代码编译成CIL代码。CIL代码可以在任何支持CLI的平台上运行。
2. **元数据（Metadata）**：元数据是CIL代码的一部分，它包含了关于代码的元数据信息，如类型信息、方法信息、字段信息等。元数据用于在运行时解析和执行代码。
3. **类型系统（Type System）**：CLI定义了一个类型系统，它支持值类型和引用类型，以及它们的继承和接口实现。
4. **垃圾回收（Garbage Collection）**：CLI提供了一个自动垃圾回收机制，用于管理内存的分配和释放。
5. **异常处理（Exception Handling）**：CLI支持异常处理机制，用于处理运行时错误。

CLI的全部体系结构，提供公共类型系统（CTS，Common Type System）、虚拟执行系统（VES，Virtual Execution System）和公共语言规范（CLS，Common Language Specification）的标准化描述，还提供对元数据（Metadata）的信息性描述。

通用类型系统（CTS）：规范.NET中数据的类型。

元数据系统（Metadata）：是.NET中描述数据的数据。

通用语言规范（CLS）：描述多语言之间进行交互的语言规范，.NET系统包括的语言有C#、C++、VB、J#，它们都遵守通用语言规范。

虚拟执行系统（VES）：是一个可运行受管理代码（Managed Code）的运行环境，它提供了运行受管理代码所需要的内置数据类型（data type），以及假定的机器型态与状态设置、流程控制与例外处理等参数。

### CLR

CLR（Common Language Runtime，公共语言运行时）是CLI的实现，它是.NET框架的核心组件。CLR提供了运行CIL代码的环境，并提供了以下功能：

1. **代码执行**：CLR负责将CIL代码转换为机器代码，并在支持CLI的平台上执行。
2. **内存管理**：CLR提供了自动垃圾回收机制，用于管理内存的分配和释放。
3. **类型检查**：CLR在运行时检查类型信息，确保代码的正确性。
4. **异常处理**：CLR支持异常处理机制，用于处理运行时错误。
5. **跨语言互操作性**：CLR支持不同编程语言之间的互操作性，允许使用不同语言编写的代码相互调用。
6. **安全**：CLR提供了安全机制，用于保护代码免受恶意攻击。

### JIT编译器

JIT编译器（Just-In-Time编译器）是一种在程序运行时将中间语言（如CIL）编译为机器代码的编译器。JIT编译器在程序运行时将CIL代码转换为机器代码，并在需要时执行。这种编译策略的优点是可以在运行时根据程序的实际需求进行优化，从而提高程序的执行效率。JIT编译器通常用于.NET框架中，它将CIL代码编译为机器代码，并在运行时执行。

### AOT编译器

AOT编译器（Ahead-Of-Time编译器）是一种在程序编译时将中间语言（如CIL）编译为机器代码的编译器。AOT编译器在程序编译时将CIL代码转换为机器代码，并将机器代码嵌入到最终的可执行文件中。这种编译策略的优点是可以在程序运行时直接执行机器代码，而不需要再进行编译。AOT编译器通常用于移动平台和嵌入式系统，它将CIL代码编译为机器代码，并将机器代码嵌入到最终的可执行文件中。

# 类型

## 命名空间

命名空间是C#中用于组织代码的一种机制，它可以将相关的类、接口、结构体等组织在一起，避免命名冲突。命名空间可以嵌套，例如：

```cs
namespace MyNamespace {
  namespace SubNamespace {
    class MyClass {
      // ...
    }
  }
}
```

### using指令

`using`指令是C#中用于引入命名空间的一种机制，它可以将命名空间中的类型引入到当前代码文件中，从而可以直接使用这些类型，而不需要使用命名空间限定。例如：

```cs
using System;
using MyNamespace.SubNamespace;

class Program {
  static void Main() {
    MyClass myClass = new MyClass();
    // ...
  }
}
```

## 结构

结构（Struct）是一种值类型，用于封装数据和相关功能。系统在栈上分配内存，并存储实际的数据副本。

1. 不可继承：结构不能从其他结构或类继承，也不能被继承。
2. 默认值：结构的所有字段在实例化时会自动初始化为该字段类型的默认值。
3. 比类轻量：由于结构是值类型，通常在性能上比类更轻量。
4. 构造函数：结构可以定义构造函数，但不能定义析构函数。
5. 初始化：不允许使用实例属性和字段初始化语句

```cs
public struct Point
{
    public int X { get; set; }
    public int Y { get; set; }

    public Point(int x, int y)
    {
        X = x;
        Y = y;
    }

    public void Display()
    {
        Console.WriteLine($"Point({X}, {Y})");
    }
}

class Program
{
    static void Main()
    {
        Point p1 = new Point(10, 20);
        p1.Display(); // 输出: Point(10, 20)

        // 直接访问字段
        p1.X = 30;
        p1.Display(); // 输出: Point(30, 20)
    }
}

```

### 构造函数

结构（struct）也可以定义构造函数，但不能定义析构函数。

- 构造函数是一种特殊的方法，在创建对象时被调用，用于初始化对象的状态。构造函数的名称与类名相同，并且没有返回类型。
- 析构函数是一种特殊的方法，在对象被垃圾回收器（GC）回收之前调用，用于清理资源。析构函数的名称与类名相同，并以波浪号（~）开头。

```cs
public struct Point
{
    public int X { get; }
    public int Y { get; }

    // 带参数的构造函数
    public Point(int x, int y)
    {
        X = x;
        Y = y;
    }

    // 默认构造函数（可选，必须手动定义）
    public Point()
    {
        X = 0;
        Y = 0;
    }

    public void Display()
    {
        Console.WriteLine($"Point({X}, {Y})");
    }
}

class Program
{
    static void Main()
    {
        Point p1 = new Point(5, 10); // 使用带参数的构造函数
        Point p2 = new Point(); // 使用默认构造函数
        p1.Display(); // 输出: Point(5, 10)
        p2.Display(); // 输出: Point(0, 0)
    }
}

```

## 枚举

枚举（enum）是一种特殊的值类型，用于定义一组命名的常数。枚举使得代码更加可读和可维护，通常用于表示状态、选项或一组相关的值。默认情况下，枚举的第一个成员从0开始，后续成员的值会依次递增。

```cs
public enum DaysOfWeek
{
    Sunday,    // 0
    Monday,    // 1
    Tuesday,   // 2
    Wednesday, // 3
    Thursday,  // 4
    Friday,    // 5
    Saturday   // 6
}

```

### 指定枚举类型

使用 : 来指定其他整型类型（如 byte、sbyte、short、ushort、int、uint、long、ulong）

```cs
public enum ErrorCode : byte
{
    None = 0,
    NotFound = 1,
    InvalidInput = 2,
    ServerError = 3
}
```

### 枚举转换

```cs
// 枚举转换为整型
int dayValue = (int)DaysOfWeek.Wednesday;
Console.WriteLine($"Wednesday's value is: {dayValue}"); // 输出: 3

// 整型转换为枚举
DaysOfWeek day = (DaysOfWeek)4;
Console.WriteLine($"The day for value 4 is: {day}"); // 输出: Thursday

```

### 位标志

```cs
[Flags]
public enum FileAccess
{
    None = 0,
    Read = 1,        // 2^0
    Write = 2,       // 2^1
    Execute = 4,     // 2^2
    ReadWrite = Read | Write, // 3 (1 + 2)
    FullControl = Read | Write | Execute // 7 (1 + 2 + 4)
}

class Program
{
    static void Main()
    {
        // 组合标志
        FileAccess access = FileAccess.Read | FileAccess.Write;

        // 检查标志
        bool canRead = (access & FileAccess.Read) == FileAccess.Read;
        bool canWrite = (access & FileAccess.Write) == FileAccess.Write;
        bool canExecute = (access & FileAccess.Execute) == FileAccess.Execute;

        Console.WriteLine($"Can Read: {canRead}");       // 输出: Can Read: True
        Console.WriteLine($"Can Write: {canWrite}");     // 输出: Can Write: True
        Console.WriteLine($"Can Execute: {canExecute}"); // 输出: Can Execute: False
    }
}

```

## 数组

数组（Array）是一种用于存储多个相同类型数据的集合。数组是一种固定大小的数据结构，可以通过索引访问其元素。

```cs
// 定义一个整数数组
int[] numbers = new int[5]; // 创建一个长度为5的整型数组

// 直接初始化
int[] numbers = { 1, 2, 3, 4, 5 };

// 逐个赋值
int[] numbers2 = new int[5];
numbers2[0] = 10;
numbers2[1] = 20;
// 依此类推


int[] numbers = { 1, 2, 3, 4, 5 };
Console.WriteLine(numbers[0]); // 输出: 1
Console.WriteLine(numbers[4]); // 输出: 5


int[] numbers = { 1, 2, 3, 4, 5 };

// 使用 for 循环
for (int i = 0; i < numbers.Length; i++)
{
    Console.WriteLine(numbers[i]);
}

// 使用 foreach 循环
foreach (int number in numbers)
{
    Console.WriteLine(number);

}

```

### 属性

- Length：获取数组的长度（元素个数）。

  ```cs
  int[] numbers = { 1, 2, 3, 4, 5 };
  Console.WriteLine(numbers.Length); // 输出: 5
  ```

- Rank：获取数组的维数（数组的维度）。

  ```cs
  int[,] matrix = new int[3, 4];
  Console.WriteLine(matrix.Rank); // 输出: 2
  ```

### 方法

- GetValue：获取指定索引处的元素值。

  ```cs
  int[] numbers = { 1, 2, 3, 4, 5 };
  int value = (int)numbers.GetValue(2); // 获取索引为2的元素值
  Console.WriteLine(value); // 输出: 3
  ```

- SetValue：设置指定索引处的元素值。

  ```cs
  int[] numbers = { 1, 2, 3, 4, 5 };
  numbers.SetValue(10, 2); // 将索引为2的元素值设置为10
  Console.WriteLine(numbers[2]); // 输出: 10
  ```

- Clone：复制数组。

  ```cs
  int[] numbers = { 1, 2, 3, 4, 5 };
  int[] clone = (int[])numbers.Clone();
  Console.WriteLine(clone[0]); // 输出: 1
  ```

- IndexOf：查找指定元素的索引。

  ```cs
  int[] numbers = { 1, 2, 3, 4, 5 };
  int index = Array.IndexOf(numbers, 3);
  Console.WriteLine(index); // 输出: 2

  ```

- Find：查找满足指定条件的第一个元素。

  ```cs
  int[] numbers = { 1, 2, 3, 4, 5 };
  int result = Array.Find(numbers, element => element % 2 == 0);
  Console.WriteLine(result); // 输出: 2
  ```

### 矩形数组

矩形数组（Rectangular Array）是一种二维数组，其中每一行都具有相同的列数。

```cs
// 定义一个3行4列的矩形数组
int[,] matrix = new int[3, 4];

// 初始化一个3行4列的矩形数组
int[,] matrix = {
    { 1, 2, 3, 4 },
    { 5, 6, 7, 8 },
    { 9, 10, 11, 12 }
};

// 访问元素
Console.WriteLine(matrix[0, 0]); // 输出: 1
Console.WriteLine(matrix[2, 3]); // 输出: 12

// 使用嵌套 for 循环
for (int i = 0; i < matrix.GetLength(0); i++) // 行数
{
    for (int j = 0; j < matrix.GetLength(1); j++) // 列数
    {
        Console.Write(matrix[i, j] + " ");
    }
    Console.WriteLine();
}
```

### 交错数组

交错数组（Jagged Array）是一种数组的数组，即一个数组的元素是另一个数组。

```cs

// 定义一个3行2列的交错数组
int[][] jaggedArray = new int[3][];
jaggedArray[0] = new int[2] { 1, 2 };
jaggedArray[1] = new int[3] { 3, 4, 5 };
jaggedArray[2] = new int[1] { 6 };

// 访问元素
Console.WriteLine(jaggedArray[0][0]); // 输出: 1
Console.WriteLine(jaggedArray[1][2]); // 输出: 5

// 使用嵌套 for 循环
for (int i = 0; i < jaggedArray.Length; i++)
{
    for (int j = 0; j < jaggedArray[i].Length; j++)
    {
        Console.Write(jaggedArray[i][j] + " ");
    }
    Console.WriteLine();
}
// 1 2 
// 3 4 5 
// 6 


int[][] jaggedArray = new int[][]
{
    new int[] {1, 2},    // 第一个内层数组
    new int[] {3, 4, 5}, // 第二个内层数组
    new int[] {6}        // 第三个内层数组
};
```

### 数组协变

数组类型的协变特性，即允许将一个派生类型的数组赋值给一个基类型的数组变量。
意味着你可以使用子类数组来替代父类数组。

```cs
class Animal { }
class Dog : Animal { }
class Cat : Animal { }

class Program
{
    static void Main()
    {
        Dog[] dogs = new Dog[] { new Dog(), new Dog() };
        
        // 协变: 子类数组可以赋给父类数组
        Animal[] animals = dogs;
        
        Console.WriteLine(animals.Length);  // 输出: 2
    }
}

```

## 委托

一种类型安全的函数指针，它允许你将方法作为参数传递，或者将方法存储在变量中。委托可以用来实现事件和回调机制

```cs
public delegate void MyDelegate(string message);
public class Program
{
    public static void Main()
    {
        MyDelegate del = new MyDelegate(PrintMessage);
        del("Hello, Delegate!");  // 调用委托，输出: Hello, Delegate!
    }

    public static void PrintMessage(string message)
    {
        Console.WriteLine(message);
    }
}
```

### 组合委托

委托可以组合在一起，这意味着可以将多个委托方法分配给同一个委托变量，然后通过调用该委托变量来依次调用这些方法。
使用 += 操作符将多个方法添加到委托链中，使用 -= 移除方法。

```cs
using System;

public delegate void MyDelegate(string message);

class Program
{
    public static void Main()
    {
        MyDelegate del = PrintMessage1;
        del += PrintMessage2;  // 添加方法到委托链中
        del += PrintMessage3;

        del("Hello, Combined Delegates!");  // 调用委托时，会依次调用三个方法
    }

    public static void PrintMessage1(string message)
    {
        Console.WriteLine("Message 1: " + message);
    }

    public static void PrintMessage2(string message)
    {
        Console.WriteLine("Message 2: " + message);
    }

    public static void PrintMessage3(string message)
    {
        Console.WriteLine("Message 3: " + message);
    }
}
// Message 1: Hello, Combined Delegates!
// Message 2: Hello, Combined Delegates!
// Message 3: Hello, Combined Delegates!
```

### 带返回值的委托

```cs
public delegate int MyDelegate(int x);

public class Program
{
    public static void Main()
    {
        MyDelegate del = Square;
        int result = del(4);
        Console.WriteLine(result);  // 输出: 16
    }

    public static int Square(int x)
    {
        return x * x;
    }
}

```

### 匿名委托

```cs
public delegate void MyDelegate(string message);

public class Program
{
    public static void Main()
    {
        MyDelegate del = delegate(string message)
        {
            Console.WriteLine(message);
        };
        del("Hello from Anonymous Method!");
    }
}
// Lambda
public delegate void MyDelegate(string message);

public class Program
{
    public static void Main()
    {
        MyDelegate del = (message) => Console.WriteLine(message);
        del("Hello from Lambda Expression!");
    }
}
```

### 带引用参数的委托

```cs
using System;

public delegate void RefDelegate(ref int x);

class Program
{
    static void Main()
    {
        int number = 5;

        // 创建委托实例，并将它绑定到修改值的方法
        RefDelegate del = ModifyNumber;
        
        Console.WriteLine("Before delegate call: " + number);  // 输出: 5
        
        // 调用委托
        del(ref number);
        
        Console.WriteLine("After delegate call: " + number);  // 输出: 10
    }

    // 该方法接收一个 ref 参数并修改它
    public static void ModifyNumber(ref int x)
    {
        x = x * 2;
    }
}
```

## 事件

事件是基于委托的一种特殊的机制。它允许在对象的状态发生变化时通知其他对象。你可以将事件视为一个信号，发布者发送信号，订阅者响应信号。

```cs

using System;

public class MyEventPublisher
{
    // 定义一个事件，使用预定义的 EventHandler 委托类型
    public event EventHandler MyEvent;

    // 触发事件的方法
    public void TriggerEvent()
    {
        Console.WriteLine("Event Triggered!");
        // 触发事件，检查是否有订阅者
        MyEvent?.Invoke(this, EventArgs.Empty);  // 使用空事件参数
    }
}

class Program
{


    
    static void Main()
    {
        MyEventPublisher publisher = new MyEventPublisher();

        // 订阅事件
        publisher.MyEvent += MyEventHandler;

        // 触发事件
        publisher.TriggerEvent();  // 输出: Event Triggered!
                                  // 输出: Event Handled!
    }

    // 事件处理程序
    public static void MyEventHandler(object sender, EventArgs e)
    {
        Console.WriteLine("Event Handled!");
    }
}
```

## 类

类是C#中的一种基本数据类型，它是一种用户自定义的数据类型，可以包含字段、属性、方法、事件等成员。类可以继承自其他类，也可以实现接口。例如：

```cs
class Program
{
    private int age; // 字段
    public int Age { get; set; }; // 属性
    public Program (age) // 构造函数
    {
      this.age = age;
    }
    
    public int Next() // 方法
    {  
      return age + 1;
    }
 }
```

### 成员

```cs
using System;

// 1. 定义一个名为 SampleClass 的类
public class SampleClass
{
    // 常量 (Constant): 与类关联的常量值
    public const double PI = 3.14159;

    // 字段 (Field): 类的变量
    private string name;

    // 属性 (Property): 与读取和写入类的已命名属性相关联的操作
    public string Name
    {
        get { return name; }
        set { name = value; }
    }

    // 索引器 (Indexer): 与将类实例编入索引相关联的操作
    private string[] elements = new string[10];
    public string this[int index]
    {
        get { return elements[index]; }
        set { elements[index] = value; }
    }

    // 事件 (Event): 类可以生成的通知
    public event EventHandler NameChanged;

    // 运算符重载 (Operator Overloading): 类支持的运算符
    public static SampleClass operator +(SampleClass a, SampleClass b)
    {
        return new SampleClass { Name = a.Name + " " + b.Name };
    }

    // 构造函数 (Constructor): 初始化实例或类本身所需的操作
    public SampleClass()
    {
        name = "Default Name";
        Console.WriteLine("SampleClass Constructor called");
    }

    // 方法 (Method): 类可以执行的计算和操作
    public void DisplayInfo()
    {
        Console.WriteLine($"Name: {Name}");
    }

    // 构造函数重载 (Constructor Overloading)
    public SampleClass(string initialName)
    {
        name = initialName;
        Console.WriteLine($"SampleClass Constructor with parameter called, Name set to {initialName}");
    }

    // 终结器 (Destructor): 永久放弃类实例前要执行的操作
    ~SampleClass()
    {
        Console.WriteLine("SampleClass Destructor called");
    }

    // 嵌套类型 (Nested Type): 类声明的嵌套类型
    public class NestedClass
    {
        public void NestedMethod()
        {
            Console.WriteLine("Method inside NestedClass");
        }
    }

    // 引发事件的方法
    protected virtual void OnNameChanged(EventArgs e)
    {
        NameChanged?.Invoke(this, e);
    }

    // 示例方法来更改名称并引发事件
    public void ChangeName(string newName)
    {
        if (name != newName)
        {
            name = newName;
            OnNameChanged(EventArgs.Empty);
        }
    }
}

class Program
{
    static void Main(string[] args)
    {
        // 使用构造函数创建类的实例
        SampleClass instance1 = new SampleClass();
        SampleClass instance2 = new SampleClass("Instance 2");

        // 设置属性
        instance1.Name = "New Name";
        Console.WriteLine($"Instance1 Name: {instance1.Name}");

        // 使用方法
        instance1.DisplayInfo();
        instance2.DisplayInfo();

        // 使用索引器
        instance1[0] = "Element 0";
        Console.WriteLine($"Index 0 of instance1: {instance1[0]}");

        // 事件处理
        instance1.NameChanged += (sender, e) => Console.WriteLine("Name has changed.");
        instance1.ChangeName("Another Name");

        // 使用嵌套类
        SampleClass.NestedClass nestedInstance = new SampleClass.NestedClass();
        nestedInstance.NestedMethod();

        // 运算符重载的使用
        SampleClass combinedInstance = instance1 + instance2;
        combinedInstance.DisplayInfo();        // 程序结束时终结器被调用
    }
}

```

#### 字段

在C#中，字段（field）是类或结构中的变量，用于存储数据。字段可以是公开的、私有的、保护的或内部的，具体取决于它们的访问修饰符。

```cs
public class Person
{
    // 字段
    private string name;
    private int age;

    // 公共字段
    public string Address;
}
```

1. 字段通常在类或结构的主体内声明。可以为字段指定数据类型和访问修饰符。
2. 字段可以在声明时初始化，也可以在构造函数中进行初始化。
3. 字段也可以声明为静态字段，属于类而不是类的实例。
4. 访问修饰符决定了字段的可访问性，包括public、private、protected和internal。
5. 字段通常用于存储对象的状态，但过多的公共字段可能会导致封装破坏。通常推荐使用属性（properties）来访问字段。

**修饰符**

- public：可以在任何地方访问。
- private：只能在声明它的类或结构内部访问。
- protected：可以在声明它的类或结构及其派生类中访问。
- internal：可以在同一程序集内访问。

```cs
public class Example
{
    public int PublicValue;           // 公开成员
    private int PrivateValue;         // 私有成员
    protected int ProtectedValue;     // 受保护成员
    internal int InternalValue;       // 内部成员
    protected internal int ProtectedInternalValue; // 受保护的内部成员
}

```

#### 属性

```cs
public class Person
{
    private string name;  // 私有字段

    // 属性
    public string Name
    {
        get { return name; }  // 读取 name 字段
        set { name = value; } // 修改 name 字段
    }
    // 带有验证的属性示例
    private int score;

    public int Score
    {
        get { return score; }
        set
        {
            if (value < 0 || value > 100)
                throw new ArgumentOutOfRangeException("Score must be between 0 and 100.");
            score = value;
        }
    }

    // 自动属性
    public string Model { get; set; }
    public int Year { get; set; }


    public double Radius
    {
        get { return radius; } // 只读属性
    }

    public double Area
    {
        get { return Math.PI * radius * radius; } // 计算面积
    }
}

// 使用属性
Person person = new Person();
person.Name = "Alice";  // 调用 set 访问器
Console.WriteLine(person.Name);  // 调用 get 访问器，输出: Alice

```

#### 索引器

索引器让你能够通过索引（类似数组的方式）来访问类的内部数据。

```cs
public class StringCollection
{
    private List<string> _strings = new List<string>();

    // 定义索引器
    public string this[int index]
    {
        get
        {
            return _strings[index];  // 返回指定索引的值
        }
        set
        {
            _strings[index] = value;  // 设置指定索引的值
        }
    }

    public void Add(string value)
    {
        _strings.Add(value); // 向集合中添加一个字符串
    }

    public int Count => _strings.Count; // 返回集合中元素的数量
}

var collection = new StringCollection();
collection.Add("Hello");
collection.Add("World");

// 使用索引器访问元素
Console.WriteLine(collection[0]); // 输出: Hello

// 使用索引器设置元素
collection[1] = "C#"; 
Console.WriteLine(collection[1]); // 输出: C#

```

#### 静态成员

静态成员是属于类本身的，而不是类的实例。这意味着你可以不创建类的实例就可以访问静态成员。

1. 共享：静态成员在所有实例之间共享。
2. 无需实例化：可以直接通过类名访问静态成员。
3. 生命周期：静态成员的生命周期从类加载开始，直到程序结束。

```cs
public class MathHelper
{
    // 静态字段
    public static double Pi = 3.14159;

    // 静态方法
    public static double CalculateArea(double radius)
    {
        return Pi * radius * radius;
    }
}

// 使用静态成员
double area = MathHelper.CalculateArea(5.0);
Console.WriteLine("Area: " + area);
```

#### 构造函数

```cs
using System;
namespace LineApplication
{
   class Line
   {
      private double length;   // 线条的长度
      public Line()
      {
         Console.WriteLine("对象已创建");
      }

      public void setLength( double len )
      {
         length = len;
      }
      public double getLength()
      {
         return length;
      }

      static void Main(string[] args)
      {
         Line line = new Line();    
         // 设置线条长度
         line.setLength(6.0);
         Console.WriteLine("线条的长度： {0}", line.getLength());
         Console.ReadKey();
      }
   }
}

// 输出：
// 对象已创建
// 线条的长度： 6

```

##### 重载

```cs
public class Rectangle
{
    public double Width { get; }
    public double Height { get; }

    // 默认构造函数
    public Rectangle()
    {
        Width = 1;
        Height = 1;
    }

    // 带参数的构造函数
    public Rectangle(double width, double height)
    {
        Width = width;
        Height = height;
    }
}

```

### 继承

使用 : 符号表示继承关系

1. 基类（Base Class）：被继承的类。
2. 派生类（Derived Class）：从基类派生出来的类。
3. 重写（Override）：在派生类中重新定义基类中已定义的方法。
4. 隐藏（Hide）：在派生类中定义与基类同名的成员，但不使用重写。

```cs
// 定义一个基类
public class Animal
{
    public void Eat()
    {
        Console.WriteLine("Eating...");
    }
}

// 定义一个派生类
public class Dog : Animal
{
    public void Bark()
    {
        Console.WriteLine("Barking...");
    }
}

class Program
{
    static void Main(string[] args)
    {
        Dog myDog = new Dog();
        myDog.Eat();  // 输出: Eating...
        myDog.Bark(); // 输出: Barking...
    }
}

```

```cs
public class Animal
{
    public virtual void MakeSound()
    {
        Console.WriteLine("Some generic animal sound");
    }
    public void Speak()
    {
        Console.WriteLine("Animal makes a sound.");
    }
}

public class Dog : Animal
{   
    // 方法屏蔽
    public new void Speak()
    {
        Console.WriteLine("Dog barks.");
    }
    // 当派生类重写基类的方法时，这个行为被称为覆盖。
    //覆盖的目的是提供基类方法的新实现。使用 virtual 和 override 关键字来实现。
    public override void MakeSound()
    {
        Console.WriteLine("Barking...");
    }
}
```

## 记录

使用 record 关键字定义，与类类似，但它默认支持不可变性和值比较。

```cs
public record Person(string FirstName, string LastName);
var person = new Person("John", "Doe");
// person.FirstName = "Jane";  // 编译错误，因为 FirstName 是不可变的

// 记录的两个实例在值相等时被认为是相等的，而不是引用相等。
var person1 = new Person("John", "Doe");
var person2 = new Person("John", "Doe");

Console.WriteLine(person1 == person2);  // 输出: True

// 解构：记录支持解构，可以方便地提取属性值。
var (firstName, lastName) = person1;
Console.WriteLine(firstName);  // 输出: John

// 记录是不可变的，但可以使用 with 表达式创建记录的副本，并在此过程中更改某些属性的值。
var updatedPerson = person1 with { FirstName = "Jane" };
Console.WriteLine(updatedPerson);  // 输出: Person { FirstName = Jane, LastName = Doe }
```

## 接口

接口使用 interface 关键字定义，可以包含方法、属性、事件和索引器的声明，但不能包含实现。

```cs
// 定义
public interface IAnimal
{
    void Speak();  // 方法声明
    string Name { get; }  // 只读属性
}
// 实现
public class Dog : IAnimal
{
    public string Name { get; private set; }

    public Dog(string name)
    {
        Name = name;
    }

    public void Speak()
    {
        Console.WriteLine("Bark");
    }
}

public class Cat : IAnimal
{
    public string Name { get; private set; }

    public Cat(string name)
    {
        Name = name;
    }

    public void Speak()
    {
        Console.WriteLine("Meow");
    }
}

// 多重实现

public interface IMammal
{
    void GiveBirth();
}

public class Dog : IAnimal, IMammal
{
    public string Name { get; private set; }

    public Dog(string name)
    {
        Name = name;
    }

    public void Speak()
    {
        Console.WriteLine("Bark");
    }

    public void GiveBirth()
    {
        Console.WriteLine("Dog gives birth.");
    }
}

```

### 实现具有重复成员的接口

```cs
public interface IAnimal
{
    void Speak();
}

public interface IMammal
{
    void Speak();
}

public class Dog : IAnimal, IMammal
{
    // 显式接口实现
    void IAnimal.Speak()
    {
        Console.WriteLine("Dog barks (IAnimal).");
    }

    void IMammal.Speak()
    {
        Console.WriteLine("Dog barks (IMammal).");
    }
}


// 使用显式接口实现，可以避免重复成员的冲突。
class Program
{
    static void Main()
    {
        Dog dog = new Dog();

        IAnimal animal = dog;
        animal.Speak();  // 输出: Dog barks (IAnimal).

        IMammal mammal = dog;
        mammal.Speak();  // 输出: Dog barks (IMammal).
    }
}
```

### 多个接口的引用

```cs
public interface IFlyable
{
    void Fly();
}

public interface ISwimmable
{
    void Swim();
}

public interface IAnimal
{
    void Speak();
}

// 实现
public class Duck : IFlyable, ISwimmable, IAnimal
{
    public void Fly()
    {
        Console.WriteLine("Duck is flying.");
    }

    public void Swim()
    {
        Console.WriteLine("Duck is swimming.");
    }

    public void Speak()
    {
        Console.WriteLine("Duck quacks.");
    }
}
class Program
{
    static void Main()
    {
        // 创建一个 Duck 对象
        Duck duck = new Duck();

        // 通过 IFlyable 引用调用飞行方法
        IFlyable flyableDuck = duck;
        flyableDuck.Fly();  // 输出: Duck is flying.

        // 通过 ISwimmable 引用调用游泳方法
        ISwimmable swimmableDuck = duck;
        swimmableDuck.Swim();  // 输出: Duck is swimming.

        // 通过 IAnimal 引用调用说话方法
        IAnimal animalDuck = duck;
        animalDuck.Speak();  // 输出: Duck quacks.
    }
}
```

动态处理

```cs
public class Fish : ISwimmable, IAnimal
{
    public void Swim()
    {
        Console.WriteLine("Fish is swimming.");
    }

    public void Speak()
    {
        Console.WriteLine("Fish makes bubbles.");
    }
}

class Program
{
    static void MakeAnimalSpeak(IAnimal animal)
    {
        animal.Speak();
    }

    static void MakeAnimalSwim(ISwimmable swimmable)
    {
        swimmable.Swim();
    }

    static void Main()
    {
        Duck duck = new Duck();
        Fish fish = new Fish();

        MakeAnimalSpeak(duck);  // 输出: Duck quacks.
        MakeAnimalSpeak(fish);  // 输出: Fish makes bubbles.

        MakeAnimalSwim(duck);   // 输出: Duck is swimming.
        MakeAnimalSwim(fish);   // 输出: Fish is swimming.
    }
}
```

### 派生成员作为实现

```cs

public class Animal
{
    public virtual void Speak()  // 虚方法
    {
        Console.WriteLine("Animal makes a sound.");
    }
}

public interface IFlyable
{
    void Fly();
}

public interface ISwimmable
{
    void Swim();
}

public class Duck : Animal, IFlyable, ISwimmable
{
    public override void Speak()
    {
        Console.WriteLine("Duck quacks.");
    }

    public void Fly()  // 实现 IFlyable
    {
        Console.WriteLine("Duck is flying.");
    }

    public void Swim()  // 实现 ISwimmable
    {
        Console.WriteLine("Duck is swimming.");
    }
}

class Program
{
    static void Main()
    {
        Duck duck = new Duck();
        duck.Speak();  // 输出: Duck quacks.
        duck.Fly();    // 输出: Duck is flying.
        duck.Swim();   // 输出: Duck is swimming.
    }
}
```

### 显示接口实现

```cs
public interface IAnimal
{
    void Speak();
}

public interface IMammal
{
    void Speak();
}

public class Dog : IAnimal, IMammal
{
    void IAnimal.Speak()
    {
        Console.WriteLine("Dog barks (IAnimal).");
    }

    void IMammal.Speak()
    {
        Console.WriteLine("Dog barks (IMammal).");
    }
}

```

### 接口继承接口

```cs
public interface IAnimal
{
    void Speak();
}

public interface IMammal : IAnimal  // IMammal 继承 IAnimal
{
    void GiveBirth();  // 新方法
}

public class Dog : IMammal
{
    public void Speak()
    {
        Console.WriteLine("Dog barks.");
    }

    public void GiveBirth()
    {
        Console.WriteLine("Dog gives birth to puppies.");
    }
}

public class Cat : IMammal
{
    public void Speak()
    {
        Console.WriteLine("Cat meows.");
    }

    public void GiveBirth()
    {
        Console.WriteLine("Cat gives birth to kittens.");
    }
}

class Program
{
    static void Main()
    {
        IMammal dog = new Dog();
        dog.Speak();      // 输出: Dog barks.
        dog.GiveBirth();  // 输出: Dog gives birth to puppies.

        IMammal cat = new Cat();
        cat.Speak();      // 输出: Cat meows.
        cat.GiveBirth();  // 输出: Cat gives birth to kittens.
    }
}

```

继承多个接口

```cs
public interface IFlyable
{
    void Fly();
}

public interface ISwimmable
{
    void Swim();
}

public interface IAnimal : IMammal, IFlyable, ISwimmable  // 继承多个接口
{
}

public class Duck : IAnimal
{
    public void Speak()
    {
        Console.WriteLine("Duck quacks.");
    }

    public void GiveBirth()
    {
        Console.WriteLine("Duck lays eggs.");
    }

    public void Fly()
    {
        Console.WriteLine("Duck is flying.");
    }

    public void Swim()
    {
        Console.WriteLine("Duck is swimming.");
    }
}

```

## 泛型

定义时指定，使用时再指定具体的类型。

### 泛型类

```cs
public class GenericList<T>
{
    private T[] items;
    private int count;

    public GenericList(int size)
    {
        items = new T[size];
        count = 0;
    }

    public void Add(T item)
    {
        if (count < items.Length)
        {
            items[count] = item;
            count++;
        }
    }

    public T Get(int index)
    {
        if (index >= 0 && index < count)
        {
            return items[index];
        }
        throw new IndexOutOfRangeException();
    }
}

class Program
{
    static void Main()
    {
        var intList = new GenericList<int>(5);
        intList.Add(1);
        intList.Add(2);
        Console.WriteLine(intList.Get(0)); // 输出: 1

        var stringList = new GenericList<string>(5);
        stringList.Add("Hello");
        stringList.Add("World");
        Console.WriteLine(stringList.Get(1)); // 输出: World
    }
}
```

### 参数约束

```cs
public class GenericList<T> where T : Animal  // 约束T为Animal类或其派生类
{
    // 类实现
}

public class Animal
{
    public string Name { get; set; }
}

public class Dog : Animal { }
public class Cat : Animal { }

public class GenericList<T> where T : Animal
{
    private List<T> items = new List<T>();

    public void Add(T item)
    {
        items.Add(item);
    }

    public T Get(int index)
    {
        return items[index];
    }
}

class Program
{
    static void Main()
    {
        var dogList = new GenericList<Dog>();
        dogList.Add(new Dog { Name = "Buddy" });
        
        var catList = new GenericList<Cat>();
        catList.Add(new Cat { Name = "Whiskers" });
        
        Console.WriteLine(dogList.Get(0).Name);  // 输出: Buddy
        Console.WriteLine(catList.Get(0).Name);  // 输出: Whiskers
    }
}
```

### 泛型方法

```cs
public class GenericMethods
{
    public static T GetDefaultValue<T>()
    {
        return default(T);  // 返回类型T的默认值
    }
}

class Program
{
    static void Main()
    {
        int defaultInt = GenericMethods.GetDefaultValue<int>(); // 0
        string defaultString = GenericMethods.GetDefaultValue<string>(); // null

        Console.WriteLine(defaultInt);  // 输出: 0
        Console.WriteLine(defaultString);  // 输出: 
    }
}
```

### 泛型结构

```cs
public struct GenericStruct<T>
{
    public T Value;

    public GenericStruct(T value)
    {
        Value = value;
    }
}

class Program
{
    static void Main()
    {
        var intStruct = new GenericStruct<int>(42);
        Console.WriteLine(intStruct.Value);  // 输出: 42

        var stringStruct = new GenericStruct<string>("Hello");
        Console.WriteLine(stringStruct.Value);  // 输出: Hello
    }
}
```

### 泛型委托

```cs
public delegate T MyDelegate<T>(T arg);

public class GenericDelegate
{
    public static T Process<T>(T arg, MyDelegate<T> func)
    {
        return func(arg);
    }
}

class Program
{
    static void Main()
    {
        int result = GenericDelegate.Process(10, (x) => x * 2);  // 输出: 20
        Console.WriteLine(result);

        string result2 = GenericDelegate.Process("Hello", (x) => x.ToUpper());  // 输出: HELLO
        Console.WriteLine(result2);
    }
}
```

### 泛型接口

```cs
public interface IGenericInterface<T>
{
    T GetItem();
}

public class GenericClass<T> : IGenericInterface<T>
{
    private T item;

    public GenericClass(T item)
    {
        this.item = item;
    }

    public T GetItem()
    {
        return item;
    }
}

class Program
{
    static void Main()
    {
        var intClass = new GenericClass<int>(42);
        Console.WriteLine(intClass.GetItem());  // 输出: 42

        var stringClass = new GenericClass<string>("Hello"); // 输出: Hello
    }
}
```

### 协变

协变允许你将某种类型的泛型参数替换为其派生类。这在输出（返回）类型的场景中非常有用。协变通常用于返回值的泛型接口和委托。协变通过 `out` 关键字来实现。

```cs
public class Animal { }
public class Dog : Animal { }

public interface IAnimalRepository<out T> where T : Animal
{
    T GetAnimal();
}

public class AnimalRepository : IAnimalRepository<Animal>
{
    public Animal GetAnimal()
    {
        return new Animal();
    }
}

public class DogRepository : IAnimalRepository<Dog>
{
    public Dog GetAnimal()
    {
        return new Dog();
    }
}

class Program
{
    static void Main()
    {
        IAnimalRepository<Animal> animalRepo = new AnimalRepository();
        IAnimalRepository<Dog> dogRepo = new DogRepository();

        // 使用协变，dogRepo可以赋值给animalRepo
        animalRepo = dogRepo;

        Animal animal = animalRepo.GetAnimal();
        Dog dog = dogRepo.GetAnimal();
    }
}
```

### 逆变

逆变允许你将某种类型的泛型参数替换为其基类。这在输入（参数）类型的场景中非常有用。逆变通常用于参数的泛型接口和委托。逆变通过 `in` 关键字来实现。

```cs
public interface IAnimalRepository<in T> where T : Animal
{
    void AddAnimal(T animal);
}

public class AnimalRepository : IAnimalRepository<Animal>
{
    public void AddAnimal(Animal animal)
    {
        // 添加动物到仓库
    }
}

public class DogRepository : IAnimalRepository<Dog>
{
    public void AddAnimal(Dog dog)
    {
        // 添加狗到仓库
    }
}

class Program
{
    static void Main()
    {
        IAnimalRepository<Dog> dogRepo = new DogRepository();
        IAnimalRepository<Animal> animalRepo = dogRepo;

        animalRepo.AddAnimal(new Dog());
    }
}
```

# 参考

<https://blog.csdn.net/qq_51040417/article/details/141551584>
