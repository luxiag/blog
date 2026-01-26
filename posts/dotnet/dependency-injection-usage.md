---
title: 依赖注入
subtitle: .NET Core 依赖注入完全指南
date: 2023-03-15 16:25:33
category:
  - DotNet
tags:
  - 依赖注入
  - DI
  - 设计模式
---

# 什么是依赖注入？

## 现实生活中的例子

想象一下，你需要一台电脑：

**没有依赖注入的情况：**
- 你需要自己去买CPU、内存、硬盘、主板等所有部件
- 自己组装电脑
- 如果某个部件坏了，需要自己购买并更换

**有依赖注入的情况：**
- 你只需要告诉商家你需要一台电脑
- 商家负责准备所有部件并组装好
- 电脑出现问题时，商家负责维修

在软件开发中，依赖注入就是那个"商家"，它负责创建和管理对象之间的依赖关系。

## 控制反转（IoC）

控制反转（Inversion of Control，简称IoC）是一种设计原则，它将控制权从组件本身转移给了外部容器。

**传统方式：**
```csharp
public class OrderService
{
    private readonly IRepository _repository;

    public OrderService()
    {
        // 自己创建依赖，控制权在自己手中
        _repository = new OrderRepository();
    }
}
```

**使用依赖注入：**
```csharp
public class OrderService
{
    private readonly IRepository _repository;

    // 依赖通过构造函数传入，控制权转移到了外部
    public OrderService(IRepository repository)
    {
        _repository = repository;
    }
}
```

依赖注入是控制反转的一种实现方式，通过将依赖的创建和管理权交给外部容器，实现了控制反转。

# 依赖注入的三种方式

## 1. 构造器注入（推荐）

这是最常见的依赖注入类型，也是最推荐的类型。依赖通过类的构造函数传递。

**优点：**
- 保证依赖在对象创建时就已经准备好
- 依赖关系清晰可见
- 便于单元测试
- 可以确保对象不可变

```csharp
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly ILogger<OrderController> _logger;

    // 所有依赖通过构造函数注入
    public OrderController(IOrderService orderService, ILogger<OrderController> logger)
    {
        _orderService = orderService;
        _logger = logger;
    }

    [HttpGet("{id}")]
    public IActionResult GetOrder(int id)
    {
        var order = _orderService.GetOrder(id);
        return Ok(order);
    }
}
```

## 2. 属性注入（不推荐）

依赖通过类的公共属性设置。这种类型的注入一般不推荐使用。

**使用场景：**
- 可选依赖
- 与框架集成
- 遗留代码改造

**缺点：**
- 对象创建后状态可能被改变
- 依赖关系不明确
- 难以进行单元测试

```csharp
public class OrderService
{
    [FromServices]
    public ILogger<OrderService> Logger { get; set; }

    public void ProcessOrder(Order order)
    {
        Logger?.LogInformation("Processing order {OrderId}", order.Id);
        // 处理订单逻辑
    }
}
```

## 3. 方法注入

依赖通过方法参数传递。主要用于特定方法调用时才需要依赖的情况。

**使用场景：**
- 依赖只在特定方法中使用
- 避免构造函数参数过多

```csharp
public class ReportGenerator
{
    public void GenerateReport(IReportExporter exporter, ReportData data)
    {
        exporter.Export(data);
    }
}
```

# .NET Core 中的依赖注入

## 基本使用

### 1. 定义服务接口和实现

```csharp
public interface IOrderService
{
    Order GetOrder(int id);
    void CreateOrder(Order order);
}

public class OrderService : IOrderService
{
    public Order GetOrder(int id)
    {
        // 获取订单逻辑
        return new Order { Id = id };
    }

    public void CreateOrder(Order order)
    {
        // 创建订单逻辑
    }
}
```

### 2. 在Startup.cs或Program.cs中注册服务

```csharp
// 在Startup.cs中
public void ConfigureServices(IServiceCollection services)
{
    // 注册服务
    services.AddScoped<IOrderService, OrderService>();
    services.AddControllers();
}

// 在.NET 6+的Program.cs中
var builder = WebApplication.CreateBuilder(args);

// 注册服务
builder.Services.AddScoped<IOrderService, OrderService>();

var app = builder.Build();
```

### 3. 在控制器中使用

```csharp
[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }

    [HttpGet("{id}")]
    public ActionResult<Order> Get(int id)
    {
        return _orderService.GetOrder(id);
    }
}
```

# 服务生命周期

在.NET Core的依赖注入容器中，服务有三种生命周期：Transient、Scoped和Singleton。理解这些生命周期对于正确使用依赖注入至关重要。

## Transient（瞬时）

每次请求服务时都会创建一个新实例。

**特点：**
- 每次请求都创建新对象
- 对象生命周期短暂
- 适合轻量级、无状态的服务

**适用场景：**
- 无状态的服务
- 轻量级服务
- 不需要维护状态的工具类

**示例：**

```csharp
// 注册瞬时服务
services.AddTransient<IEmailService, EmailService>();

// 或者使用工厂方法
services.AddTransient<ICacheService>(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    return new CacheService(config["Cache:ConnectionString"]);
});
```

**使用示例：**

```csharp
public class OrderService
{
    private readonly IEmailService _emailService;

    public OrderService(IEmailService emailService)
    {
        _emailService = emailService;
    }

    public void ProcessOrder(Order order)
    {
        // 每次调用ProcessOrder时，_emailService都是新实例
        _emailService.SendOrderConfirmation(order);
    }
}
```

## Scoped（作用域）

在同一个作用域（如HTTP请求）内，每次请求服务时返回同一个实例；不同作用域则创建新实例。

**特点：**
- 同一作用域内共享同一个实例
- 不同作用域使用不同实例
- 适合需要在单个请求中保持状态的服务

**适用场景：**
- 数据库上下文（DbContext）
- 工作单元（Unit of Work）
- 需要在单个请求中共享状态的服务

**示例：**

```csharp
// 注册作用域服务
services.AddScoped<IOrderService, OrderService>();
services.AddScoped<AppDbContext>();
```

**使用示例：**

```csharp
public class OrderController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly AppDbContext _dbContext;

    public OrderController(IOrderService orderService, AppDbContext dbContext)
    {
        _orderService = orderService;
        _dbContext = dbContext;
    }

    [HttpPost]
    public IActionResult CreateOrder(OrderDto dto)
    {
        // 在同一个HTTP请求中，_orderService和_dbContext都是同一个实例
        var order = _orderService.CreateOrder(dto);
        return Ok(order);
    }
}
```

## Singleton（单例）

整个应用程序生命周期中只创建一次实例，所有请求都共享同一个实例。

**特点：**
- 应用程序启动时创建
- 整个应用程序生命周期内共享
- 线程安全（需要自行处理）

**适用场景：**
- 配置服务
- 缓存服务
- 无状态的全局服务

**注意事项：**
- 不要在Singleton中注入Scoped服务
- 确保服务是线程安全的
- 注意内存泄漏问题

**示例：**

```csharp
// 注册单例服务
services.AddSingleton<ICacheService, CacheService>();
services.AddSingleton(sp =>
{
    var config = sp.GetRequiredService<IConfiguration>();
    return new CacheService(config["Cache:ConnectionString"]);
});
```

**使用示例：**

```csharp
public class ProductService
{
    private readonly ICacheService _cacheService;

    public ProductService(ICacheService cacheService)
    {
        _cacheService = cacheService;
    }

    public Product GetProduct(int id)
    {
        // 整个应用程序中，_cacheService都是同一个实例
        return _cacheService.GetOrCreate($"product_{id}", () =>
        {
            return LoadProductFromDatabase(id);
        });
    }
}
```

## 生命周期对比

| 特性 | Transient | Scoped | Singleton |
|------|-----------|--------|-----------|
| 实例创建时机 | 每次请求 | 每个作用域一次 | 应用程序启动时 |
| 实例共享范围 | 不共享 | 同一作用域内共享 | 全局共享 |
| 线程安全 | 不需要 | 需要考虑 | 必须保证 |
| 内存使用 | 较高 | 中等 | 最低 |
| 适用场景 | 无状态服务 | 单元工作 | 全局服务 |

## 常见错误

### 1. 在Singleton中注入Scoped服务

```csharp
// 错误示例
services.AddSingleton<OrderService>(); // OrderService依赖Scoped的DbContext
```

**解决方案：**

```csharp
// 方案1：改为Scoped
services.AddScoped<OrderService>();

// 方案2：使用IServiceScopeFactory
public class OrderService
{
    private readonly IServiceScopeFactory _scopeFactory;

    public OrderService(IServiceScopeFactory scopeFactory)
    {
        _scopeFactory = scopeFactory;
    }

    public async Task ProcessOrder(int orderId)
    {
        using var scope = _scopeFactory.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        // 使用dbContext处理订单
    }
}
```

### 2. 在Scoped服务中捕获Singleton服务

```csharp
// 错误示例
public class OrderService
{
    private readonly ICacheService _cache;

    public OrderService(ICacheService cache)
    {
        _cache = cache;
    }

    public void ProcessOrder()
    {
        // 错误：在闭包中捕获了Singleton服务
        Task.Run(() => _cache.Set("key", "value"));
    }
}
```

**解决方案：**

```csharp
public class OrderService
{
    private readonly ICacheService _cache;

    public OrderService(ICacheService cache)
    {
        _cache = cache;
    }

    public void ProcessOrder()
    {
        // 正确：不捕获Singleton服务
        var key = "key";
        var value = "value";
        Task.Run(() =>
        {
            var cache = _cache; // 局部变量
            cache.Set(key, value);
        });
    }
}
```

# 高级主题

## 服务解析

### 直接解析

```csharp
public class HomeController : Controller
{
    private readonly IServiceProvider _serviceProvider;

    public HomeController(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IActionResult Index()
    {
        // 直接解析服务
        var service = _serviceProvider.GetRequiredService<IOrderService>();
        return View();
    }
}
```

### 尝试解析

```csharp
// 尝试解析服务，如果不存在则返回null
var service = _serviceProvider.GetService<IOrderService>();
if (service != null)
{
    // 使用服务
}
```

### 解析所有实现

```csharp
// 解析接口的所有实现
var services = _serviceProvider.GetServices<IOrderService>();
foreach (var service in services)
{
    service.ProcessOrder();
}
```

## 工厂模式

### 使用工厂创建服务

```csharp
// 注册工厂
services.AddTransient<IOrderService>(sp => 
{
    var config = sp.GetRequiredService<IConfiguration>();
    var logger = sp.GetRequiredService<ILogger<OrderService>>();
    return new OrderService(config, logger);
});
```

### 使用工厂接口

```csharp
public interface IOrderServiceFactory
{
    IOrderService Create();
}

public class OrderServiceFactory : IOrderServiceFactory
{
    private readonly IServiceProvider _serviceProvider;

    public OrderServiceFactory(IServiceProvider serviceProvider)
    {
        _serviceProvider = serviceProvider;
    }

    public IOrderService Create()
    {
        return _serviceProvider.GetRequiredService<IOrderService>();
    }
}

// 注册工厂
services.AddSingleton<IOrderServiceFactory, OrderServiceFactory>();
```

## 泛型服务注册

```csharp
// 定义泛型接口和实现
public interface IRepository<T> where T : class
{
    T GetById(int id);
    void Add(T entity);
}

public class Repository<T> : IRepository<T> where T : class
{
    public T GetById(int id) => default;
    public void Add(T entity) { }
}

// 注册泛型服务
services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// 使用泛型服务
public class ProductService
{
    private readonly IRepository<Product> _productRepository;

    public ProductService(IRepository<Product> productRepository)
    {
        _productRepository = productRepository;
    }
}
```

## 批量注册

```csharp
// 批量注册程序集中的所有服务
var assembly = Assembly.GetExecutingAssembly();

// 注册所有实现I*接口的服务
services.Scan(scan => scan
    .FromAssemblies(assembly)
    .AddClasses(classes => classes.AssignableTo<IRepository>())
    .AsImplementedInterfaces()
    .WithScopedLifetime());
```

# 最佳实践

## 1. 依赖注入原则

- **依赖倒置原则（DIP）**：高层模块不应依赖低层模块，两者都应依赖抽象
- **接口隔离原则（ISP）**：客户端不应依赖它不需要的接口
- **单一职责原则（SRP）**：每个服务只负责一个功能

## 2. 服务设计建议

### 接口设计

```csharp
// 好的接口设计
public interface IOrderService
{
    Task<Order> GetOrderAsync(int id);
    Task<Order> CreateOrderAsync(OrderDto dto);
}

// 避免过于宽泛的接口
public interface IService // 不推荐
{
    // 包含太多不相关的方法
}
```

### 服务实现

```csharp
// 好的服务实现
public class OrderService : IOrderService
{
    private readonly IRepository<Order> _repository;
    private readonly ILogger<OrderService> _logger;

    public OrderService(IRepository<Order> repository, ILogger<OrderService> logger)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
        _logger = logger ?? throw new ArgumentNullException(nameof(logger));
    }

    public async Task<Order> GetOrderAsync(int id)
    {
        try
        {
            return await _repository.GetByIdAsync(id);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "获取订单失败: {OrderId}", id);
            throw;
        }
    }
}
```

## 3. 错误处理

```csharp
public class OrderService : IOrderService
{
    private readonly IRepository<Order> _repository;

    public OrderService(IRepository<Order> repository)
    {
        _repository = repository ?? throw new ArgumentNullException(nameof(repository));
    }

    public async Task<Order> GetOrderAsync(int id)
    {
        // 验证参数
        if (id <= 0)
        {
            throw new ArgumentException("订单ID必须大于0", nameof(id));
        }

        // 处理业务逻辑
        var order = await _repository.GetByIdAsync(id);
        if (order == null)
        {
            throw new NotFoundException($"订单不存在: {id}");
        }

        return order;
    }
}
```

## 4. 日志记录

```csharp
public class OrderService : IOrderService
{
    private readonly IRepository<Order> _repository;
    private readonly ILogger<OrderService> _logger;

    public OrderService(IRepository<Order> repository, ILogger<OrderService> logger)
    {
        _repository = repository;
        _logger = logger;
    }

    public async Task<Order> CreateOrderAsync(OrderDto dto)
    {
        _logger.LogInformation("开始创建订单: {@OrderDto}", dto);

        try
        {
            var order = await _repository.AddAsync(new Order
            {
                // 映射属性
            });

            _logger.LogInformation("订单创建成功: {OrderId}", order.Id);
            return order;
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "创建订单失败: {@OrderDto}", dto);
            throw;
        }
    }
}
```

## 5. 配置管理

```csharp
// 定义配置选项
public class EmailOptions
{
    public const string SectionName = "Email";
    public string SmtpServer { get; set; }
    public int Port { get; set; }
    public string Username { get; set; }
    public string Password { get; set; }
}

// 注册配置
builder.Services.Configure<EmailOptions>(
    builder.Configuration.GetSection(EmailOptions.SectionName));

// 使用配置
public class EmailService : IEmailService
{
    private readonly EmailOptions _options;

    public EmailService(IOptions<EmailOptions> options)
    {
        _options = options.Value;
    }

    public void SendEmail(string to, string subject, string body)
    {
        // 使用_options中的配置
    }
}
```

## 6. 测试友好

```csharp
// 服务接口设计应便于测试
public interface IOrderService
{
    Task<Order> GetOrderAsync(int id);
}

// 单元测试示例
public class OrderControllerTests
{
    [Fact]
    public async Task GetOrder_ReturnsOrder()
    {
        // Arrange
        var mockService = new Mock<IOrderService>();
        mockService.Setup(s => s.GetOrderAsync(It.IsAny<int>()))
            .ReturnsAsync(new Order { Id = 1 });

        var controller = new OrderController(mockService.Object);

        // Act
        var result = await controller.GetOrder(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var order = Assert.IsType<Order>(okResult.Value);
        Assert.Equal(1, order.Id);
    }
}
```

# 常见问题

## Q1: 什么时候应该使用依赖注入？

A: 在以下情况下应该使用依赖注入：
- 需要降低组件之间的耦合度
- 需要提高代码的可测试性
- 需要灵活替换实现
- 需要管理对象生命周期

## Q2: 构造函数参数太多怎么办？

A: 如果构造函数参数过多，可能违反了单一职责原则，考虑：
- 重构服务，拆分职责
- 使用参数对象模式
- 使用门面模式

## Q3: 如何处理循环依赖？

A: 解决循环依赖的方法：
- 重新设计服务关系，消除循环依赖
- 使用属性注入（不推荐）
- 使用延迟加载
- 使用中介者模式

## Q4: 依赖注入会影响性能吗？

A: 依赖注入的影响：
- 初始化时有一定开销（可忽略）
- 运行时性能影响极小
- 使用Singleton可以减少实例创建开销
- 避免在循环中频繁解析服务

# 总结

依赖注入是现代.NET开发的核心技术之一，掌握它对于构建可维护、可测试的应用程序至关重要。通过本文的学习，你应该已经了解了：

1. 依赖注入的基本概念和原理
2. 三种依赖注入方式的适用场景
3. .NET Core中依赖注入的使用方法
4. 服务生命周期的选择和注意事项
5. 高级主题和最佳实践

在实际项目中，合理使用依赖注入可以显著提高代码质量和开发效率。记住：

- 优先使用构造函数注入
- 根据业务需求选择合适的服务生命周期
- 保持接口简洁，遵循单一职责原则
- 编写可测试的代码
- 注意常见陷阱和最佳实践

持续学习和实践，你将能够更好地运用依赖注入来构建优秀的.NET应用程序。
