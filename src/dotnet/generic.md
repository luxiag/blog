---
title: 泛型
date: 2024-12-05
category:
  - DotNet
---

# 没有泛型

没有泛型,需要处理不同传入类型参数

```cs
public static void ShowInt(int iParameter) {
  Console.WriteLine(iParameter);
}

public static void ShowString(string sParameter) {
  Console.WriteLine(sParameter);
}

public static void ShowDateTime(DateTime dtParameter)
{
    Console.WriteLine("This is {0},parameter={1},type={2}",
      typeof(CommonMethod).Name, dtParameter.GetType().Name, dtParameter);
}

```

使用继承优化

```cs
// 为什么使用Object
// 1.任何父类出现的地方都可以使用子类来代替
// 2.Object是所有类的父类

public static void ShowObject(object oParameter) {
  Console.WriteLine(oParameter.GetType().Name,oParameter)
}

```

设计思想--延迟声明：在声明的时候不指定类型，在调用的时候再指定类型

# 泛型

在泛型类型或方法定义中，类型参数是在其实例化泛型类型的一个变量时，客户端指定的特定类型的占位符。 泛型类`( GenericList<T>)`无法按原样使用，因为它不是真正的类型；它更像是类型的蓝图。 若要使用 `GenericList<T>`，客户端代码必须通过指定尖括号内的类型参数来声明并实例化构造类型。 此特定类的类型参数可以是编译器可识别的任何类型。 可创建任意数量的构造类型实例，其中每个使用不同的类型参数。

```cs
public static void Show<T>(T tParameter)
{
    Console.WriteLine("This is {0},parameter={1},type={2}",
        typeof(GenericMethod), tParameter.GetType().Name, tParameter.ToString());
}

```

**泛型如何工作的**

泛型加入到语法以后，VS自带的编译器又做了升级，升级之后编译时遇到泛型，会做特殊的处理：生成占位符。再次经过JIT编译的时候，会把上面编译生成的占位符替换成具体的数据类型。

**泛型的好处**

1. 提高代码的重用性
2. 提高代码的安全性
3. 提高代码的执行效率

## 使用

**泛型方法**

```cs
public static void Show<T>(T tParameter)
{
    Console.WriteLine("This is {0},parameter={1},type={2}",
        typeof(GenericMethod), tParameter.GetType().Name, tParameter.ToString());
}
```

**泛型类**

```cs
public class GenericClass<T>
{
    private T tValue;
    public T TValue
    {
        get { return tValue; }
        set { tValue = value; }
    }
}
```

**泛型接口**

```cs
public interface IGenericInterface<T>
{
    T GetValue();
}
```

**泛型委托**

```cs
public delegate T GenericDelegate<T>(T tParameter);
```

## 约束

**泛型约束**

1. where T : class
2. where T : struct
3. where T : new()
4. where T : IComparable
5. where T : BaseClass
6. where T : BaseInterface

```cs
public class GenericClass<T> where T : class
{
    private T tValue;
    public T TValue
    {
        get { return tValue; }
        set { tValue = value; }
    }
}
```

**泛型方法约束**

```cs
public static void Show<T>(T tParameter) where T : class
{
    Console.WriteLine("This is {0},parameter={1},type={2}",
        typeof(GenericMethod), tParameter.GetType().Name, tParameter.ToString());
}
```

**泛型委托约束**

```cs
public delegate T GenericDelegate<T>(T tParameter) where T : class;
```

**泛型接口约束**

```cs
public interface IGenericInterface<T> where T : class
{
    T GetValue();
}
```

## 协变和逆变

协变和逆变是泛型编程中的两个重要概念，它们允许在泛型类型和泛型方法中使用更灵活的类型参数。

协变（Covariance）允许将泛型类型的子类型赋值给泛型类型的父类型。例如，如果有一个泛型接口 `IEnumerable<T>`，其中 `T` 是一个协变类型参数，那么 `IEnumerable<Derived>` 可以被赋值给 `IEnumerable<Base>`，其中 `Derived` 是 `Base` 的子类。协变在需要将泛型类型用作父类型时非常有用。

```cs

using System;

public class Animal
{
    public string Name { get; set; }
}

public class Dog : Animal
{
    public string Breed { get; set; }
}

public class AnimalRepository<T> where T : Animal
{
    public T GetAnimal()
    {
        return new T();
    }
}

public class Program
{
    public static void Main(string[] args)
    {
        AnimalRepository<Dog> dogRepository = new AnimalRepository<Dog>();
        Dog dog = dogRepository.GetAnimal();

        AnimalRepository<Animal> animalRepository = new AnimalRepository<Animal>();
        Animal animal = animalRepository.GetAnimal();

        // 使用协变将AnimalRepository<Dog>转换为AnimalRepository<Animal>
        AnimalRepository<Animal> animalRepository2 = dogRepository;
        Animal animal2 = animalRepository2.GetAnimal();
    }
}

```

逆变（Contravariance）允许将泛型类型的父类型赋值给泛型类型的子类型。例如，如果有一个泛型接口 `Action<T>`，其中 `T` 是一个逆变类型参数，那么 `Action<Base>` 可以被赋值给 `Action<Derived>`，其中 `Base` 是 `Derived` 的父类。逆变在需要将泛型类型用作子类型时非常有用。

```ts
using System;

public class Animal
{
    public string Name { get; set; }
}

public class Dog : Animal
{
    public string Breed { get; set; }
}

public class AnimalRepository<T> where T : Animal
{
    public void AddAnimal(T animal)
    {
        Console.WriteLine($"Adding {animal.Name} to the repository");
    }
}

public class Program
{
    public static void Main(string[] args)
    {
        AnimalRepository<Dog> dogRepository = new AnimalRepository<Dog>();
        Dog dog = new Dog { Name = "Buddy", Breed = "Golden Retriever" };
        dogRepository.AddAnimal(dog);

        AnimalRepository<Animal> animalRepository = new AnimalRepository<Animal>();
        Animal animal = new Animal { Name = "Max" };
        animalRepository.AddAnimal(animal);

        // 使用逆变将AnimalRepository<Animal>转换为AnimalRepository<Dog>
        AnimalRepository<Dog> dogRepository2 = animalRepository;
        dogRepository2.AddAnimal(dog);
    }
}
```
