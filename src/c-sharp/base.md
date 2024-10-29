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

一、http://asp.net是一种用来快速创建动态Web网站的技术，不是语言，它使用C#(或者http://vb.net)为开发语言。C#是一种面向对象的编程语言；net只是一个框架，.net中所有的编程语言，比如c# http://vb.net等编写的程序必须在.net framework框架下运行。

.NET 分成两个方面：WinForm和WebForm，http://ASP.NET就是属于WebForm，也就是平时说的B/S模式的开发。而WinForm就是属于C/S模式。

http://Asp.NET可以用C#或http://VB.NET来开发。编译后形成CLR，通过服务器的IIS+.NET FrameWork再次编译来运行。

二、.Net全称.NET Framework是一个开发和运行环境，该战略是微软的一项全新创意，它将使得“互联网行业进入一个更先进的阶段”，.NET不是一种编程语言。简单说就是一组类库框架。

.NET有很多种语言组成，比如C#、 http://VB.NET、J#、Jsript、Managed C++，但是都是运行在.NET FrameWork Run Time底下的。其中，C#是主流。

三、C#是.NET Framework框架支持的一种主力开发语言，可用于开发http://ASP.NET网站,Windows程序，控制台程序，甚至于手机软件(Windows Phone)。


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
}

public class Dog : Animal
{
    public override void MakeSound()
    {
        Console.WriteLine("Barking...");
    }
}
```

## 记录


## 接口


## 泛型


# 参考

https://blog.csdn.net/qq_51040417/article/details/141551584


