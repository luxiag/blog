---
title: 依赖注入
category:
  - .NET
---

# 控制反转

设计原则，它将控制权从组件本身转移给了外部容器。依赖注入是控制反转的一种实现方式，通过将依赖的创建和管理权交给外部容器，实现了控制反转。

# 依赖注入

- 构造器注入：这是最常见的依赖注入类型，也是最推荐的类型。在这种情况下，依赖性（如服务或组件）通过类的构造函数传递。

- 属性注入：在这种情况下，依赖性通过类的公共属性设置。这种类型的注入一般不推荐，因为它可能会导致对象的状态在创建后被改变。但在某些情况下，例如在处理与框架集成的情况下，属性注入可能是必要的。

- 方法注入：在这种情况下，依赖性通过方法参数传递。这种类型的依赖注入主要用于那些只有在特定方法调用时才需要依赖的情况。

```cs
public interface IService
{
    void Serve();
}

public class Service : IService
{
    public void Serve()
    {
        Console.WriteLine("Service Called");




        //To Do: Some Stuff
    }
}

public class Client
{
    private IService _service;

    public Client(IService service)
    {
        this._service = service;
    }

    public void Start()
    {
        Console.WriteLine("Service Started");
        this._service.Serve();
        //To Do: Some Stuff
    }
}

```

## transient

每次被请求的时候都会创建⼀个新对象。这种⽣命周期适合有状态的对象，可以避免多段代码⽤于同⼀个对象⽽造成状态混乱，其缺点是⽣成的对象⽐较多，会浪费内存。
