---
title: IOC和DI
date: 2025-01-30
category: 
  - DotNet
---

# IOC

IoC，意为控制反转，英文（Inversion of Control），它不是一种技术，而是一种设计思想，一个重要的面向对象编程的法则。IoC意味着将你设计好的对象交给容器控制，而不是传统的在你的对象内部直接控制。

## 控制

传统程序当中，我们定义的一个A类，需要另一个B类时，直接就在A类的内部通过new进行创建依赖的b对象了，是我们的程序主动去创建依赖对象。

而IoC它的核心思想就是有一个容器专门来创建这些依赖的对象，即由IoC容器来控制依赖的对象的创建。
- IoC容器控制了对象
- 控制了外部资源的获取

## 反转

反转，即反转了依赖对象的获取方式，之前是主动去创建依赖对象，现在是由容器来帮忙创建，并注入到需要依赖对象的类中。


- 降低了类与类之间的耦合度
- 更容易进行单元测试
- 更好地实现了面向对象设计原则中的依赖倒置原则

## IOC容器

就相当于一个专门来创建对象的工厂，你要什么对象，他就给你什么对象。有了IoC容器，依赖关系就变了，原先的依赖关系就没有了，他们都依赖于IoC容器了，通过IoC容器来建立他们之间的关系。

- 传统程序设计当中，用户类依赖于用户信息类，都是主动去创建相关对象再组合起来，客户端向服务器发送请求之后经历了这三个过程:用户类的创建、用户信息类的创建，将用户信息类主动注入到用户类。
- 有了IoC/DI容器后，客户端获取这些服务，不再主动去索取了，不再主动去创建这些对象了。IoC会做这些动作：创建用户类，看用户类是否有依赖对象，有的话，首先创建依赖对象，之后再将其注入到用户类当中。由容器掌管这些对象的生命周期。
- 在一个大型项目一个模块当中，有这样若干个类 a，b，c，d；a依赖于b，b依赖于c，c依赖于d，甚至还可能交叉依赖，这时候我们引入了第三方“IoC”，使得a,b,c,d这四个对象之间没有了耦合关系，

# DI

DI，意为依赖注入，英文（Dependency Injection），它是在IoC容器运行时，动态地将依赖对象注入到需要这个对象的类中。

- 应用程序依赖于IoC容器；
- 应用程序需要IoC容器来提供对象需要的外部资源
- IoC容器注入应用程序
- 注入某个对象所需要的外部资源（包括对象、资源、数据等等）



依赖注入是IoC的一个方面，它允许应用程序组件之间的解耦。在依赖注入中，服务类（依赖）不负责创建其依赖的对象，而是从外部获取。这种将依赖对象传递给服务类的方式称为依赖注入。

## 依赖注入的方式

- 构造函数注入
- 属性注入
- 方法注入

### 构造函数注入

构造函数注入是指在类的构造函数中声明依赖项，并在创建类的实例时将依赖项传递给它。这种方式确保了在对象创建时，所有必需的依赖项都已提供。

```csharp
public class UserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public void CreateUser(User user)
    {
        _userRepository.Save(user);
    }
}
```

### 属性注入

属性注入是指在类的属性上使用属性来声明依赖项，并在运行时通过属性设置器将依赖项传递给它。这种方式允许在对象创建后动态地注入依赖项。

```csharp
public class UserService
{
    private IUserRepository _userRepository;

    public IUserRepository UserRepository
    {
        set { _userRepository = value; }
    }

    public void CreateUser(User user)
    {
        _userRepository.Save(user);
    }
}
```

### 方法注入

方法注入是指在类的方法上使用属性来声明依赖项，并在运行时通过方法调用将依赖项传递给它。这种方式允许在对象创建后动态地注入依赖项。

```csharp
public class UserService
{
    private IUserRepository _userRepository;

    public void SetUserRepository(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }

    public void CreateUser(User user)
    {
        _userRepository.Save(user);

    }
    }
```
## 服务注册

- 依赖项

  Microsoft.Extensions.DependencyInjection.Abstractions：抽象包，用于扩展容器

  Microsoft.Extensions.DependencyInjection：实现包，实现IOC的基本功能

- 核心接口
  Service：就是我们需要的服务实列（菜）

  ServiceDescriptor：用于描述服务的信息。比如服务名（ServiceType）、实现类(ImplementationType)、生命周期(Lifetime)。（某道菜的制作描述信息）

  IServiceCollection：是一个`List<ServiceDescriptor>`集合，用于保存服务描述信息。（菜谱，记录了很多菜的描述信息）

  IServiceProvider：用于解析服务实列，根容器和子容器实现类不同（厨师）实现类里面有字段用于标记是否是根容器，以及记录所有解析的实列，为将来释放做准备。

  ActivatorUtilities：用于解析一个容器中不存在，但是依赖了容器中的服务的实列。

- 关键字

  依赖：如果一个类A的构造器中有一个类B的参数，我们说A依赖B

  注入：如果A依赖B，要想实列化A，就必须先实列化B，然后把B载入A的构造器的过程

  依赖注入：IOC容器根据反射得到一个类的依赖关系，自动帮你载入依赖项的过程（注意循环依赖问题）



- 服务描述

  ```C#
  public class ServiceDescriptor
  {
  	//服务类型，解析时通过服务类型查找
  	public Type ServiceType { get; }
  	//实现类型必须是具体类，不能是抽象类或者接口（必须实现或者继承ServiceType）
  	public Type? ImplementationType { get; }
  	//描述生命周期
  	public ServiceLifetime Lifetime { get; }
  	//用于保存工厂
  	public Func<IServiceProvider, object>? ImplementationFactory { get; }
  	//用于保存单实例
  	public object? ImplementationInstance { get; }
  }
  ```

- 万能公式

  ```C#
  //需要安装：Microsoft.Extensions.DependencyInjection
  //创建IServiceCollection实列
  IServiceCollection services = new ServiceCollection();
  //由于IServiceCollection实现了IList<ServiceDescriptor>接口
  //因此下面是一个万能公式，其它的都是扩展方法，本质调用的还是这个万能公式，包括委托的方式（他的实现类型是一个委托）
  services.Add(new ServiceDescriptor(typeof(IConnection),typeof(SqlDbConnection),ServiceLifetime.Singleton));
  ```

- 泛型接口

  ```C#
  //泛型接口需要提前知道类型
  services.AddSingleton<IDbConnection, SqlDbConnection>();
  ```

- 反射接口

  ```C#
  //反射的方式在编写框架时十分有用，无反射无框架
  services.AddSingleton(typeof(IDbConnection), typeof(SqlDbConnection));
  ```

- 委托方式

  ```C#
  //当我们构建的对象需要编写逻辑时，委托方式十分有用
  services.AddSingleton<IDbConnection, SqlConnection>();
  //低级用法
  //假设DbContext依赖IDbConnection，并且需要一个name
  //sp是一个IServiceProvider的实列
  //委托方式在注册的同时还能进行预解析
  //sp到底是根容器还是子容器由解析时的IServiceProvider
  services.AddSingleton(sp =>
  {	
      var connection = sp.GetRequiredService<IDbConnection>();
  	return new DbContext(connection, "c1");
  });  
  //高级用法
  services.AddSingleton(sp =>
  {	    
  	return ActivatorUtilities.CreateInstance<DbContext>(sp,"c1");
  }); 
  ```

- 泛型注册

  ```C#
  //注册泛型时，只能使用反射接口，并且泛型参数不要写入，解析时来确立，如果有多个泛型参数使用逗号隔开
  services.AddSingleton(typeof(ILogger<>), typeof(ConsoleLogger<>));	
  
  ```

- 尝试注册

  ```C#
  //如果IDbConnection已注册则后续的services.TryAddSingleton(typeof(IDbConnection), typeof(SqlDbConnection));不会注册新的实现
  services.TryAddSingleton(typeof(IDbConnection), typeof(SqlDbConnection));	
  ```

- 默认服务

  ```C#
  IServiceCollection services = new ServiceCollection();
  var sp = services.BuildServiceProvider();
  var sp1 = sp.GetRequiredService<IServiceProvider>();
  ```

## 构建容器

```C#
IServiceProvider container = services.BuildServiceProvider(new ServiceProviderOptions 
{
     ValidateOnBuild = true,//构建时检查是否有依赖没有注册的服务
     ValidateScopes = true,//在解析服务时检查是否通过根容器来解析Scoped类型的实列
});
```

## 服务解析

```c#
//如果同一个服务类型，注册多个实现，那么默认获取最后一个实现。
services.AddSingleton<IDbConnection, SqlConnection>();
services.AddSingleton<IDbConnection, MySqlConnection>();
IServiceProvider container = services.BuildServiceProvider();
//如果服务未注册，返回null
IDbConnection? connection = container.GetService<IDbConnection>();
//服务不存在讲引发异常
IDbConnection connection = container.GetRequiredService<IDbConnection>();
//获取IDbConnection所有实现
IEnumerable<IDbConnection> connections = container.GetRequiredServices<IDbConnection>();
//假设DbContext依赖IDbConnection，并且需要一个name，但是容器没有注册DbContext
var context = ActivatorUtilities.CreateInstance<DbContext>(container, "c1");
```

## 生命周期

- 容器除了会帮我们创建对象，还负责对象的销毁，特别对于托管资源。
- 不要试图通过根容器来解析Scoped或者Transient生命周期的实列
- 单实例的对象不能依赖一个Scoped或者Transient生命周期的实列
- 在Debug模式下可以看到容器是否是根容器，以及容器解析的实列，容器会记录由它解析的所有实列，为释放做准备。

我们需要会搭建测试案例，来验证是否是同一个实列，以及释放问题。

```C#
public class A : IDisposable
{
    public string ID { get; }

    public A()
    {
        ID = Guid.NewGuid().ToString();
    }

    public void Dispose()
    {
        Console.WriteLine(ID + ":已释放...");
    }
}

//测试
var services = new ServiceCollection();
//你可以测试其他生命周期
services.AddScoped<A>();//替换其他生命周期
                        //根容器：通过Debug模式查看container可以看到一个属性IsRootScope用来标记它是否是根容器
IServiceProvider container = services.BuildServiceProvider(new ServiceProviderOptions
{
    ValidateOnBuild = true,//构建时检查是否有依赖没有注册的服务
    ValidateScopes = false,//在解析服务时检查是否通过根容器来解析Scoped类型的实列
});
//a1:通过根容器创建，需要设ValidateScopes为false（危险）
var a1 = container.GetRequiredService<A>();
var a2 = container.GetRequiredService<A>();
using (var scope = container.CreateScope())
{
    //a2:通过子容器创建（合法）
    var a3 = scope.ServiceProvider.GetRequiredService<A>();
    var a4 = scope.ServiceProvider.GetRequiredService<A>();
    Console.WriteLine("scop0:" + a1.ID);
    Console.WriteLine("scop0:" + a2.ID);
    Console.WriteLine("scop1:" + a3.ID);
    Console.WriteLine("scop1:" + a4.ID);
}
```
通过修改A服务注册的生命周期我们可以得到一下结论。

测试Singleton发现：a1,a2,a3,a4的Id都相同
测试Scope发现：a1和a2的Id相同，a3和a4的Id相同，a1和a3的Id不相同
测试Transient发现：a1,a2,a3,a4的Id都不同

Singleton：无论通过根容器还是子容器，获取的都是同一实列，而且不会执行释放（除非释放根容器）。

Scoped：同一scope获取的都是同一实列，不同的scope获取的实列不同。scope释放会释放由它解析出来的所有实列（除了单实例以外），如果并执行Dispose方法（前提实现了IDisposable）。

Transient：无论是否同一scope获取的实列都不同，每次获取都是一个新的实列，scope释放会释放所有的实列。

注意：ServiceProvider会记录由它创建的所有实列，如果释放IServiceScope的实列，则会释放(ServiceProvider)和所有（单实列除外）由它创建的实列。

Scope范围：scope的范围有多大取决于你何时创建何时释放。从创建到释放就是他的生命周期。

```C#
//按时间5s之后释放
//实现了IDisposable接口服务在释放时，我们可以处理释放逻辑
public class A : IDisposable
{
    public string ID { get; } 
    
    public A()
    {
        //同一个实列的构造器只会执行一次
        ID = = Guid.NewGuid().ToString();
    }
    
    public void Dispose()
    {
        Console.WriteLine(ID + ":已释放...");
    }
}
IServiceProvider container = services.BuildServiceProvider();
var scope = rootContainer.CreateScope();
var a1 = container.GetRequiredService<A>();
Thread.Sleep(5 * 1000);
scope.Dispose();
```
## 组件扫描
组件扫描可以自定义规则，比如根据实现了某个接口，或者统一后缀

这里我们演示如何通过注解来扫描,大家也可以根据接口的方式来扫描

```C#
[AttributeUsage(AttributeTargets.Class)]
public class InjectionAttribute : Attribute
{
    public Type? ServiceType { get; set; }
    public ServiceLifetime Lifetime { get; set; } = ServiceLifetime.Transient;
}
public static class InjectionIServiceCollectionExtensions
{
    public static IServiceCollection AddServicesByInjection<T>(this IServiceCollection services)
    {
        var serviceTypes = typeof(T).Assembly.GetTypes()
            .Where(a => a.IsClass)
            .Where(a => a.GetCustomAttribute<InjectionAttribute>() != null)//扫描注解
            .Where(a => !a.IsAbstract);
        foreach (var item in serviceTypes)
        {
            var injection = item.GetCustomAttribute<InjectionAttribute>();
            if (injection!.ServiceType == null)
            {
                services.Add(new ServiceDescriptor(item, item, injection.Lifetime));
            }
            else
            {
                services.Add(new ServiceDescriptor(injection!.ServiceType, item, injection.Lifetime));
            }
        }
        return services;
    }
}

public interface IDbConnection
{

}

[Injection(ServiceType = typeof(IDbConnection), Lifetime = ServiceLifetime.Scoped)]
public class DbConnection : IDbConnection
{

}
 //测试
var services = new ServiceCollection();
//传入需要扫描的程序集
services.AddServicesByInjection<Program>();
var sp = services.BuildServiceProvider();
var connection = sp.GetService<IDbConnection>();
```

## 构造模式

- 构造器的目的和构造函数一样，但是构造器可以提供丰富的api来简化对象的构造
- 构造模式用于简化被构造对象的创建，通过提供一大堆的api来丰富简化构造过程，增加调用者的体验。
- 构造者需要提供一个Build方法用于构建和返回将要构造的对象实列。
- 在容器中一般需要提供一个公开的IServiceCollection类型的属性，用于注册服务。
- IServiceCollection是构造者模式

```C#
public enum ServiceLifetime
{
    Transient,
    Scoped,
}
public class ServiceDescriptor
{
    public Type ServiceType { get; }
  
    public ServiceLifetime Lifetime { get; }

    public ServiceDescriptor(Type serviceType, ServiceLifetime lifetime)
    {
        ServiceType = serviceType;
        Lifetime = lifetime;
    }
}
//目标对象
public interface IContainer
{

}
//如果直接创建成本很高，体验很差
public class Container: IContainer
{
    private List<ServiceDescriptor> _services = new();
   
    public Container(List<ServiceDescriptor> services)
    {
        _services = services;
    }
}
//目标对象的构造者
public interface IContainerBuilder
{
    //接口只提供一个通用方法，降低实现成本
    void Add(ServiceDescriptor descriptor);
    //构造目标对象
    IContainer Build();
}
//实现构造者
public class ContainerBuilder : IContainerBuilder
{
    private List<ServiceDescriptor> _services = new();

    public void Add(ServiceDescriptor descriptor)
    {
        _services.Add(descriptor);
    }

    public IContainer Build()
    {
        return new Container(_services);
    }
}
//扩展构造者，提供更加便捷的api
public static class IContainerBuilderExtensions
{
    public static void AddTransient<T>(this IContainerBuilder builder)
    {
        builder.Add(new ServiceDescriptor(typeof(T), ServiceLifetime.Transient));
    }
    public static void AddScoped<T>(this IContainerBuilder builder)
    {
        builder.Add(new ServiceDescriptor(typeof(T), ServiceLifetime.Scoped));
    }
}

//测试
var containerBuilder = new ContainerBuilder();
containerBuilder.AddScoped<DbContext>();
var container = containerBuilder.Build();
```

## 工厂模式

- 工厂模式侧重于对象的管理（创建销毁），一般提供一个Create方法，支持命名创建。
- 通过上面的学习我们发现IOC有一个弊端，就是他是通过服务类型的解析服务的。有些情况下我们需要通过命名的方式来解析服务。此时可以使用工厂模式。
- IServiceProvider也是工厂模式

```C#
public interface IDbConnection
{

}
public class MySqlDbConnection : IDbConnection
{

}
public class SqlDbConnection : IDbConnection
{

}
//如果是一个重量级的工厂，建议注册成单实例
public class DbConnectionFactory
{  
    private Dictionary<string, Type> _connections;

    public DbConnectionFactory(Dictionary<string, Type> connections)
    {
        _serviceProvider = provider;
        _connections = connections;
    }

    public IDbConnection? Create(IServiceProvider serviceProvider, string name)
    {
        if (_connections.TryGetValue(name, out Type? connectionType))
        {
            return serviceProvider.GetRequiredService(connectionType) as IDbConnection;
        }
        return default;
    }
}

//测试
var services = new ServiceCollection();
services.AddScoped<MySqlDbConnection>();
services.AddScoped<SqlDbConnection>();
services.AddSingleton(sp => 
{
    var connections = new Dictionary<string, Type>
    {
        { "s1", typeof(SqlDbConnection) },
        { "s2", typeof(MySqlDbConnection) }
    };
    return new DbConnectionFactory(connections);
});
var sp = services.BuildServiceProvider();
var factory = sp.GetRequiredService<DbConnectionFactory>();
var s1 = factory.Create(sp, "s1");
var s2 = factory.Create(sp, "s2");
```

## 提供模式

- 如果看到提供者模式，说明我们可以提供多个方案，支持多实现
- 一般通过工厂来管理提供者，用以支持命名实列

```C#
public interface ILogger
{
    void Info(string message);
}

public interface ILoggerProvider
{
    ILogger CreateLogger(string name);
}
//日志提供方案1
public class ConsoleLoggerProvider : ILoggerProvider
{
    public ILogger CreateLogger(string name)
    {
        return new ConsoleLogger(name);
    }
    class ConsoleLogger : ILogger
    {
        private string _name;
        public ConsoleLogger(string name)
        {
            _name = name;
        }
        public void Info(string message)
        {
            Console.WriteLine($"{_name}:{message}");
        }
    }
}
//日志提供方案2
public class DebugLoggerProvider : ILoggerProvider
{
    public ILogger CreateLogger(string name)
    {
        return new DebugLogger(name);
    }

    class DebugLogger : ILogger
    {
        private string _name;
        public DebugLogger(string name)
        {
            _name = name;
        }
        public void Info(string message)
        {
            Debug.WriteLine($"{_name}:{message}");
        }
    }
}
public class LoggerFactoryBuilder
{
    private List<ILoggerProvider> _providers = new ();
    
    public void Add(ILoggerProvider provider)
    {
        _providers.Add(provider);
    }
    
    public LoggerFactory Build()
    {
        return new LoggerFactory(_providers);
    }
}
//这里用到了：代理模式，工厂模式，构造模式，提供模式
public class LoggerFactory
{
    private IEnumerable<ILoggerProvider> _providers = new ();
	
    public LoggerFactory(IEnumerable<ILoggerProvider> providers)
    {
        _providers = providers;
    }
    
    //通过委托的方式来构造
    public static LoggerFactory Create(Action<LoggerFactoryBuilder> configure)
    {
        var builder = new LoggerFactoryBuilder();
        configure(builder);
        return builder.Build();
    }
	
    public void AddProvider(ILoggerProvider provider)
    {
        _providers.Add(provider);
    }
    
    public ILogger Create(string name)
    {
        var loggers = _providers.Select(s=>s.CreateLogger(name));
        return new LoggerCollection(loggers);
    }
    //代理模式
    class LoggerCollection : ILogger
    {
        private IEnumerable<ILogger> _loggers;
        public LoggerCollection(IEnumerable<ILogger> loggers)
        {
            _loggers = loggers;
        }

        public void Info(string message)
        {
            foreach (var logger in _loggers)
            {
                logger.Info(message);
            }
        }
    }
}
```

## 代理模式

- 代理模式侧重于对目标对象进行加强，通过实现目标对象的接口具备目标对象的能力。
- 一般通过实现和目标对象相同的接口来获得目标对象的能力
- 代理可以通过目标对象来简化实现成本，代理只负责编写加强逻辑
- 一般代理器只代理单个目标对象，我们把下面这个模式也可以归纳到代理模式，因为它能满足代理的许多特点比如加强、拥有目标对象的能力
- 思考我们需要一个LoggerCollection，需要实现`ICollection<ILogger>`接口，如何降低实现成本？

```C#
public interface ILogger
{
    void Info(string message);
}
//代理模式必须要实现和目标相同的接口，并且可以注入目标对象
public class LoggerCollection : ILogger
{
    private IEnumerable<ILogger> _loggers;
    public LoggerCollection(IEnumerable<ILogger> loggers)
    {
        _loggers = loggers;
    }

    public void Info(string message)
    {   //加强逻辑
        foreach (var logger in _loggers)
        {
            //具体实现由目标对象实现
            logger.Info(message);
        }
    }
}

```

## 装饰者模式

装饰者模式侧重于添加装饰（方法），装饰者模式在Stream里面使用非常频繁，我们说流本质都是二进制。但是实际操作起来，有的是字符串。于是就有了TextStream、StreamReader把他们装饰成文本流，并提供新的api，我们看一个案例。

```C#
public interface IOStream
{
    void Write(byte[] buffer);
    byte[] ReadAll();
    void Close();
}

public class FileStream: IOStream
{
    private List<byte> _buffer = new List<byte>();

    public void Write(byte[] buffer)
    {
        _buffer.AddRange(buffer);
    }
    
    public byte[] ReadAll()
    {
        return _buffer.ToArray();
    }
    
    public void Close()
    {
        Console.WriteLine("文件已关闭");
    }
}
//TextStream既表现出代理特征，也表现出装饰特征，但是侧重装饰，因为它并没有加强目标对象的函数（没有不代表不可以）
//一个类可以使用很多设计模式，并没有谁规定只能使用一个，我们要分析侧重那个点，是侧重代理还是侧重装饰
public class TextStream: IOStream
{
    private IOStream _stream;
    
    public TextStream(IOStream stream)
    {
        _stream = stream;
    }
    //表现代理特征，因为我不关系具体实现，并且他是我要实现的标准
    public void Write(byte[] buffer)
    {
        //实打实的加强了
        Console.WriteLine("要开始写入了");
        _stream.Write(buffer);
    }
    //表现代理特征，因为我不关系具体实现，并且他是我要实现的标准
    public byte[] ReadAll()
    {
        //必须调用目标对象的函数才算代理
        return _stream.ReadAll();
    }
    //表现重写特征，因为我想自己写
    public void Close()
    {
        Console.WriteLine("释放了");
    }
    //表现装饰特征，因为这是多出来的装饰，不是标准要求的，额外的
    public string ReadToEnd()
    {
        return Encoding.UTF8.GetString(ReadAll());
    }
}
//测试
IOStream stream1 = new FileStream();
//当作代理来使用，此时我们只能调用到IOStream中的api
IOStream streamProxy = new TextStream(stream1);
//使用装饰者特征，因为现在这个流被装饰成文本了
TextStream textStream = new TextStream(stream1);
var text = textStream.ReadToEnd();
```

代理类型：一般需要接收一个目标对象（或者内部创建），不关系具体的实现逻辑，交给目标对象实现。代理类多出来的方法我们是不关系的，我们也不会去调用代理类中的函数。只要是实现标准的接口调用了目标对象的方法，我们就认为是代理，否则是重写。

装饰者模式：必须接收一个目标对象，不然装饰谁？装饰器就是为了装饰目标对象的，可以添加额外的方法用于实现装饰，而不是代理。

## 容器实现

实现容器有三个重要的对象，通过IContainerBuilder来构建Container实列。Container负责根据服务描述来找到服务实现，通过服务实现的依赖来进行注入。下面我们写一个简化版本的容器。

- ServiceDescriptor：负责描述服务信息
- IContainerBuilder：负责构建容器
- IContainer：负责根据服务描述信息解析服务

```C#
public class DbConnection
{
}

public class DbContext
{
    public DbConnection Connection { get; }

    public DbContext(DbConnection connection)
    {
        Connection = connection;
    }
}

public class ServiceDescriptor
{
    public Type ServiceType { get; }
    public Type ImplementionType { get; }
    public object? Instance { get; }

    public ServiceDescriptor(Type serviceType, Type implementionType, object? instance = null)
    {
        ServiceType = serviceType;
        ImplementionType = implementionType;
        Instance = instance;
    }
}

public interface IContainer
{
    object? GetService(Type serviceType);
}

public interface IContainerBuilder
{
    void Add(ServiceDescriptor descriptor);
    IContainer Build();
}

public class Container : IContainer
{
    private IEnumerable<ServiceDescriptor> _services;

    public Container(IEnumerable<ServiceDescriptor> services)
    {
        _services = services;
    }

    public object? GetService(Type serviceType)
    {
        var descriptor = _services
            .FirstOrDefault(a => a.ServiceType == serviceType);
        if (descriptor == null)
        {
            throw new InvalidOperationException("服务未注册");
        }
        //判断是否是委托(涉及到了协变)
        var invokerType = typeof(Func<IContainer, object>);
        if (descriptor.Instance != null && typeof(Func<IContainer, object>).IsInstanceOfType(descriptor.Instance))
        {
            var func = descriptor.Instance as Func<IContainer, object> ?? throw new ArgumentNullException();
            return func(this);
        }
        var constructor = serviceType.GetConstructors()
            .OrderByDescending(a => a.GetParameters().Length)
            .FirstOrDefault() ?? throw new ArgumentNullException();
        //递归解析依赖
        var parameters = constructor.GetParameters()
            //递归
            .Select(s => GetService(s.ParameterType));
        //反射
        return Activator.CreateInstance(descriptor.ImplementionType, parameters.ToArray());
    }
}

public class ContainerBuilder : IContainerBuilder
{
    private List<ServiceDescriptor> _services = new();

    public void Add(ServiceDescriptor descriptor)
    {
        _services.Add(descriptor);
    }

    public IContainer Build()
    {
        return new Container(_services);
    }
}

public static class IContainerBuilderExtensions
{
    public static void Add<TService>(this IContainerBuilder builder)
        where TService : class
    {
        builder.Add(new ServiceDescriptor(typeof(TService), typeof(TService)));
    }
    
    public static void Add<TService, TImplement>(this IContainerBuilder builder)
    {
        builder.Add(new ServiceDescriptor(typeof(TService), typeof(TImplement)));
    }

    public static void Add<TService>(this IContainerBuilder builder, Func<IContainer, TService> func)
    {
        builder.Add(new ServiceDescriptor(typeof(TService), typeof(Action<IContainer, TService>), func));
    }
}
//测试
IContainerBuilder builder = new ContainerBuilder();
builder.Add(c => new DbConnection());
builder.Add<DbContext>();
var container = builder.Build();
var context = container.GetService(typeof(DbContext));
```

## 逆变协变

### 协变

- 我们说泛型是不完整的，当指定泛型参数时，才使得其完整。
- 在接口或者委托上，在泛型参数上使用out关键字，使得完整泛型，完整的泛型满足泛型参数的多态

```c#
public interface IEnumerable<out T> : IEnumerable
{    
    IEnumerator<T> GetEnumerator();
}
```

```C#
//语法应用
//因为string继承自object，IEnumerable泛型参数支持协变，因此IEnumerable<string>也继承自IEnumerable<object>
IEnumerable<string> list = new List<string>();
IEnumerable<object> obj = list;
//反射应用
//判断typeof(IEnumerable<object>的引用是否可以指向typeof(IEnumerable<string>的实列
var flag = typeof(IEnumerable<object>).IsAssignableFrom(typeof(IEnumerable<string>));
```

```c#
public delegate TResult Func<out TResult>();
```

```C#
//语法应用
Func<string> func1 = () => "ff";
Func<object> func2 = func1;
//反射应用
//判断Func<object>的引用是否可以指向Func<string>的实列
var flag = typeof(Func<object>).IsAssignableFrom(typeof(Func<string>));
```

### 逆变

和协变相反，有点叛逆，目前不知道具体应用场景

## Autofac

需要安装Autofac.Extensions.DependencyInjection，是Autofac来集成微软IOC，不是微软去集成它

```c#
var services = new ServiceCollection();
//微软的容器注册服务
services.AddScoped(typeof(ILogger<>),typeof(Logger<>));
var builder = new ContainerBuilder();
//autofac容器注册服务
builder.RegisterType<CService>().PropertiesAutowired()
	.As<CService>()
.InstancePerLifetimeScope();
//将IServiceCollection中的服务注册到autofac
builder.Populate(services);
//使用AutofacServiceProvider的实现方案，创建容器
//加载autofac中的服务
IServiceProvider container = new AutofacServiceProvider(builder.Build());
var logger = container.GetRequiredService<ILogger<Program>>();
var service = container.GetRequiredService<CService>();
```
# 参考
https://www.bilibili.com/video/BV1W14y1c7yt
https://zhuanlan.zhihu.com/p/91218464
