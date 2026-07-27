ASP.NET Core 体系可以按“从请求进入到系统落地”的路线掌握，而不是按零散 API 背。

核心路线是：

1. C# / .NET 基础
2. HTTP 与 Web 基础
3. ASP.NET Core 应用启动模型
4. 请求处理管道 Middleware
5. 路由与 Endpoint
6. Controller / Minimal API
7. 参数绑定与模型验证
8. 配置系统与 Options
9. 依赖注入
10. 日志与异常处理
11. 认证与授权
12. 数据访问 EF Core
13. 缓存、后台任务、HttpClient
14. API 文档、测试、部署、监控
15. 架构与工程化实践

下面按体系展开。

**1. C# 与 .NET 基础**
ASP.NET Core 不是孤立框架，它大量依赖 C# 和 .NET 基础能力。

需要掌握：

| 知识 | 为什么重要 |
|---|---|
| 类、接口、继承、多态 | Controller、Service、Repository 都是类和接口组合 |
| 泛型 | `IOptions<T>`、`ILogger<T>`、`DbSet<T>`、`IEnumerable<T>` 到处都是 |
| 委托、Lambda | Middleware、LINQ、事件、回调都依赖它 |
| LINQ | EF Core 查询、集合处理、投影转换 |
| async/await | Web API、数据库、HttpClient、文件 I/O 都应异步 |
| Attribute | 路由、验证、授权、过滤器都大量使用特性 |
| 反射 | 框架自动发现 Controller、服务、Attribute 的基础 |
| 可空引用类型 | 请求模型、实体、配置对象的 null 安全建模 |

如果 C# 基础不稳，ASP.NET Core 会变成“照抄模板但不理解”。

**2. HTTP 与 Web 基础**
ASP.NET Core 本质是处理 HTTP 请求，所以必须先理解 Web 协议。

需要掌握：

| 知识 | 重点 |
|---|---|
| HTTP 请求/响应 | Method、URL、Header、Body、Status Code |
| HTTP 方法 | `GET`、`POST`、`PUT`、`PATCH`、`DELETE` 的语义 |
| 状态码 | `200`、`201`、`204`、`400`、`401`、`403`、`404`、`409`、`500` |
| Header | `Content-Type`、`Authorization`、`Accept`、`Cache-Control` |
| Cookie | 认证、会话、浏览器状态管理 |
| CORS | 前后端分离跨域问题 |
| HTTPS | 生产环境安全基础 |
| RESTful | 资源建模、URL 设计、状态码设计 |

如果不懂 HTTP，就很难设计稳定的 Web API。

**3. ASP.NET Core 应用启动模型**
ASP.NET Core 应用通常从 `Program.cs` 启动。

需要理解：

```csharp
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

var app = builder.Build();

app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
```

重点掌握：

| 概念 | 作用 |
|---|---|
| `WebApplicationBuilder` | 创建应用构建器 |
| `builder.Services` | 注册依赖注入服务 |
| `builder.Configuration` | 读取配置 |
| `builder.Environment` | 判断环境 |
| `builder.Build()` | 构建应用 |
| `app.Use...` | 注册中间件 |
| `app.Map...` | 注册 Endpoint |
| `app.Run()` | 启动应用 |

这是 ASP.NET Core 的骨架。后面所有功能都挂在这个骨架上。

**4. Middleware 请求管道**
Middleware 是 ASP.NET Core 最核心的概念之一。

请求进入应用后，会经过一条中间件管道：

```text
Request
 -> Exception Middleware
 -> Static Files
 -> Routing
 -> CORS
 -> Authentication
 -> Authorization
 -> Endpoint
 -> Response
```

需要掌握：

| 知识 | 重点 |
|---|---|
| `app.Use` | 可在请求前后执行逻辑 |
| `app.Run` | 终止管道 |
| `app.Map` | 分支管道 |
| 中间件顺序 | 顺序错误会导致认证、授权、CORS 等失效 |
| 自定义中间件 | 统一异常、请求日志、耗时统计、租户识别 |
| 短路 | 中间件可以不调用 `next()`，直接返回响应 |

最常见顺序：

```csharp
app.UseExceptionHandler();

app.UseHttpsRedirection();

app.UseRouting();

app.UseCors();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();
```

需要特别注意：

- `UseAuthentication()` 必须在 `UseAuthorization()` 前面
- `UseCors()` 通常要放在 `UseRouting()` 之后、鉴权之前
- `MapControllers()` 是 Endpoint 注册，不是普通中间件

**5. Routing 与 Endpoint**
路由负责把 URL 匹配到具体处理逻辑。

需要掌握：

| 知识 | 重点 |
|---|---|
| Attribute Routing | `[Route]`、`[HttpGet]`、`[HttpPost]` |
| Route Parameter | `/api/products/{id}` |
| Query String | `/api/products?page=1` |
| Endpoint Routing | ASP.NET Core 现代路由模型 |
| Route Constraint | `{id:int}` |
| Route Group | Minimal API 分组 |
| URL 生成 | `LinkGenerator`、`Url.Action` |

Controller 示例：

```csharp
[ApiController]
[Route("api/products")]
public class ProductsController : ControllerBase
{
    [HttpGet("{id:int}")]
    public IActionResult GetById(int id)
    {
        return Ok(new { Id = id, Name = "Keyboard" });
    }
}
```

路由是请求进入业务逻辑前的“分发系统”。

**6. Controller 与 Minimal API**
ASP.NET Core 有两种主流 API 风格。

Controller 适合：

- 中大型项目
- 分层架构
- 复杂过滤器、模型验证、版本控制
- 团队协作

Minimal API 适合：

- 小服务
- 网关
- BFF
- 微服务轻量接口
- 快速原型

Controller：

```csharp
[ApiController]
[Route("api/orders")]
public class OrdersController : ControllerBase
{
    [HttpGet("{id:long}")]
    public IActionResult Get(long id)
    {
        return Ok(new { Id = id });
    }
}
```

Minimal API：

```csharp
app.MapGet("/api/orders/{id:long}", (long id) =>
{
    return Results.Ok(new { Id = id });
});
```

建议先学 Controller，再学 Minimal API。因为 Controller 能覆盖更多传统企业项目场景。

**7. 参数绑定与模型验证**
API 的输入来源很多，ASP.NET Core 会自动绑定参数。

需要掌握：

| 来源 | 示例 |
|---|---|
| Route | `/products/{id}` |
| Query | `?page=1&pageSize=20` |
| Body | JSON 请求体 |
| Header | `Authorization`、自定义 Header |
| Form | 表单、文件上传 |
| Services | 从 DI 注入服务 |

示例：

```csharp
[HttpPost]
public IActionResult Create([FromBody] CreateProductRequest request)
{
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    return Created();
}

public class CreateProductRequest
{
    [Required]
    public string Name { get; set; } = string.Empty;

    [Range(0.01, 999)]
    public decimal Price { get; set; }
}
```

需要重点掌握：

- `[ApiController]` 会自动触发模型验证
- DTO 不要直接复用 EF Core Entity
- 输入模型要表达业务约束
- 验证失败应返回统一错误格式
- 文件上传要注意大小限制和安全检查

**8. 配置系统与 Options**
ASP.NET Core 配置来源很多：

- `appsettings.json`
- `appsettings.Development.json`
- 环境变量
- 命令行参数
- User Secrets
- Azure Key Vault / Consul 等外部配置源

基础读取：

```csharp
string? connectionString = builder.Configuration.GetConnectionString("Default");
```

更推荐 Options：

```csharp
builder.Services.Configure<SmtpOptions>(
    builder.Configuration.GetSection("Smtp"));

public class SmtpOptions
{
    public string Host { get; set; } = string.Empty;
    public int Port { get; set; }
}
```

注入使用：

```csharp
public class EmailService
{
    private readonly SmtpOptions _options;

    public EmailService(IOptions<SmtpOptions> options)
    {
        _options = options.Value;
    }
}
```

需要掌握：

| 类型 | 场景 |
|---|---|
| `IOptions<T>` | 配置启动后基本不变 |
| `IOptionsSnapshot<T>` | 每个请求读取最新配置 |
| `IOptionsMonitor<T>` | 后台服务、配置热更新 |
| Options Validation | 启动时验证配置 |

**9. Dependency Injection 依赖注入**
ASP.NET Core 内置 DI 容器。大多数框架组件都通过 DI 工作。

生命周期：

| 生命周期 | 含义 | 场景 |
|---|---|---|
| Singleton | 应用全局一个实例 | 配置、无状态工具、缓存客户端 |
| Scoped | 每个请求一个实例 | DbContext、业务服务 |
| Transient | 每次注入新实例 | 轻量无状态服务 |

示例：

```csharp
builder.Services.AddScoped<IOrderService, OrderService>();
```

使用：

```csharp
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;

    public OrdersController(IOrderService orderService)
    {
        _orderService = orderService;
    }
}
```

需要重点掌握：

- 不要把 `DbContext` 注册成 Singleton
- Singleton 不要直接依赖 Scoped
- 服务依赖接口而不是具体类
- 构造函数注入优先
- 不要滥用 `IServiceProvider`

**10. 日志系统**
ASP.NET Core 内置日志抽象 `ILogger<T>`。

```csharp
public class OrderService
{
    private readonly ILogger<OrderService> _logger;

    public OrderService(ILogger<OrderService> logger)
    {
        _logger = logger;
    }

    public void CreateOrder(long id)
    {
        _logger.LogInformation("Creating order {OrderId}", id);
    }
}
```

需要掌握：

| 知识 | 重点 |
|---|---|
| 日志级别 | Trace、Debug、Information、Warning、Error、Critical |
| 结构化日志 | `{OrderId}` 而不是字符串拼接 |
| 日志分类 | `ILogger<T>` 中的 `T` |
| 日志 Provider | Console、Debug、EventSource、Serilog |
| TraceId | 请求链路排查 |
| 敏感信息 | 不记录密码、Token、身份证等 |

生产项目建议配合 Serilog / OpenTelemetry / Loki / ELK。

**11. 异常处理与统一响应**
不要在每个 Controller 里重复 `try/catch`。应该统一处理异常。

常用方式：

- `UseExceptionHandler`
- 自定义 Exception Middleware
- `ProblemDetails`
- 全局异常过滤器

示例：

```csharp
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = StatusCodes.Status500InternalServerError;
        await context.Response.WriteAsJsonAsync(new
        {
            Title = "Server Error",
            Status = 500
        });
    });
});
```

需要掌握：

| 异常类型 | 响应 |
|---|---|
| 参数错误 | 400 |
| 未认证 | 401 |
| 无权限 | 403 |
| 资源不存在 | 404 |
| 状态冲突 | 409 |
| 未处理异常 | 500 |

建议学习 `ProblemDetails`，它是标准化错误响应格式。

**12. Authentication 认证**
认证解决“你是谁”。

常见认证方式：

| 方式 | 场景 |
|---|---|
| Cookie | 后台管理、传统 Web |
| JWT Bearer | 前后端分离、移动端、开放 API |
| OAuth2 / OpenID Connect | 第三方登录、统一身份平台 |
| API Key | 内部系统、简单服务调用 |

JWT 示例：

```csharp
builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.Authority = "https://identity.example.com";
        options.Audience = "api";
    });

app.UseAuthentication();
```

需要掌握：

- Token 存在哪里
- Access Token 与 Refresh Token
- Token 过期与刷新
- Cookie SameSite / Secure
- JWT 签名和过期校验
- 不要把敏感信息直接放进 JWT Payload

**13. Authorization 授权**
授权解决“你能做什么”。

常见授权方式：

| 方式 | 示例 |
|---|---|
| Role-based | `[Authorize(Roles = "Admin")]` |
| Claim-based | 根据用户声明判断 |
| Policy-based | 推荐，灵活可组合 |
| Resource-based | 需要根据资源所有者判断 |

Policy 示例：

```csharp
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("CanManageOrders", policy =>
    {
        policy.RequireClaim("permission", "orders.manage");
    });
});
```

使用：

```csharp
[Authorize(Policy = "CanManageOrders")]
[HttpPost]
public IActionResult Create()
{
    return Ok();
}
```

重点：

- 认证和授权是两件事
- 401 是未登录，403 是已登录但无权限
- 复杂权限用 Policy，不要到处写角色判断
- 多租户系统要把租户隔离纳入授权设计

**14. Filters 过滤器**
Filter 是 MVC / Controller 层的扩展点，比 Middleware 更靠近 Action。

类型：

| Filter | 作用 |
|---|---|
| Authorization Filter | 授权阶段 |
| Resource Filter | 模型绑定前后 |
| Action Filter | Action 执行前后 |
| Exception Filter | MVC 内异常 |
| Result Filter | 结果执行前后 |

常见用途：

- 请求耗时统计
- 操作日志
- Action 参数检查
- 响应包装
- MVC 层异常处理

Middleware 面向整个请求管道；Filter 面向 MVC / Controller。不要混用职责。

**15. EF Core 数据访问**
ASP.NET Core 常配合 EF Core 访问数据库。

需要掌握：

| 知识 | 重点 |
|---|---|
| DbContext | 工作单元、变更跟踪 |
| DbSet | 表集合 |
| Entity 配置 | 主键、字段、关系 |
| Migration | 数据库迁移 |
| LINQ 查询 | 查询表达式 |
| Tracking | 是否跟踪实体 |
| Include | 加载关联数据 |
| Transaction | 事务 |
| Concurrency | 并发控制 |
| Query Filter | 软删除、多租户 |

基础注册：

```csharp
builder.Services.AddDbContext<AppDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("Default"));
});
```

重点建议：

- Web 请求中 `DbContext` 用 Scoped
- 查询 DTO 优先用 `Select` 投影
- 只读查询加 `AsNoTracking`
- 谨慎使用 `Include`，避免查出过多数据
- 不要在循环里触发 N+1 查询
- Migration 要纳入发布流程

**16. 缓存**
缓存用于降低数据库和外部服务压力。

常见类型：

| 类型 | 场景 |
|---|---|
| `IMemoryCache` | 单机缓存 |
| `IDistributedCache` | 分布式缓存抽象 |
| Redis | 多实例部署、共享缓存 |
| Output Cache | 缓存 HTTP 响应 |
| Response Cache | 基于 HTTP 缓存头 |

需要掌握：

- 缓存 Key 设计
- 过期策略
- 缓存穿透、击穿、雪崩
- 数据一致性
- 本地缓存和分布式缓存区别

缓存不是越多越好，关键是明确失效策略。

**17. HttpClientFactory**
调用外部 HTTP 服务时，不要手动频繁 `new HttpClient()`。

推荐：

```csharp
builder.Services.AddHttpClient<IWeatherClient, WeatherClient>(client =>
{
    client.BaseAddress = new Uri("https://api.example.com");
});
```

需要掌握：

- Named Client
- Typed Client
- 超时设置
- 重试和熔断
- Polly / Resilience Pipeline
- 日志和链路追踪
- 避免 Socket 耗尽

**18. BackgroundService 后台任务**
后台任务用于处理不直接阻塞请求的逻辑。

场景：

- 定时同步
- 消息消费
- Outbox 处理
- 清理临时文件
- 发送邮件
- 长轮询任务

示例：

```csharp
public class OrderWorker : BackgroundService
{
    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        while (!stoppingToken.IsCancellationRequested)
        {
            await Task.Delay(TimeSpan.FromSeconds(5), stoppingToken);
        }
    }
}
```

注册：

```csharp
builder.Services.AddHostedService<OrderWorker>();
```

重点：

- 必须支持 `CancellationToken`
- 不要吞异常
- Scoped 服务要用 `IServiceScopeFactory`
- 定时任务复杂时考虑 Quartz.NET 或 Hangfire

**19. API 文档与版本控制**
OpenAPI / Swagger 是 Web API 项目的基础设施。

需要掌握：

- Swagger UI
- XML 注释
- JWT 鉴权按钮配置
- API 分组
- API Versioning
- Deprecated 标记
- 请求/响应示例

API 一旦被前端或第三方使用，就要考虑版本兼容。

**20. 测试**
ASP.NET Core 测试分几层：

| 类型 | 工具 |
|---|---|
| 单元测试 | xUnit / NUnit / MSTest |
| Mock | Moq / NSubstitute |
| 集成测试 | `WebApplicationFactory` |
| API 测试 | HttpClient |
| 数据库测试 | Testcontainers / SQLite / InMemory |

重点：

- 业务逻辑尽量放 Service，便于单元测试
- Controller 测试不要过多 Mock 框架细节
- 关键 API 做集成测试
- 数据库行为不要完全依赖 EF InMemory 模拟

**21. 部署与运行环境**
需要掌握：

- `appsettings.Production.json`
- 环境变量覆盖配置
- `ASPNETCORE_ENVIRONMENT`
- Kestrel
- IIS / Nginx / YARP 反向代理
- Docker
- HTTPS
- 健康检查
- 日志采集
- 进程守护 / 容器编排

生产环境需要关注：

- 配置安全
- 数据库连接字符串
- 日志级别
- 异常信息不要暴露给用户
- 健康检查和自动重启
- 资源限制

**22. 可观测性**
生产问题不能靠猜。

需要掌握：

| 方向 | 内容 |
|---|---|
| Logging | 结构化日志 |
| Metrics | QPS、错误率、延迟、CPU、内存 |
| Tracing | 分布式链路追踪 |
| Health Checks | 存活检查、就绪检查 |
| OpenTelemetry | 统一采集标准 |

OpenTelemetry 是现代 .NET 项目非常值得掌握的方向。

**23. 安全基础**
ASP.NET Core 安全不只是登录。

需要掌握：

- HTTPS
- CORS
- CSRF
- XSS 基础防护
- SQL 注入防护
- 文件上传安全
- Rate Limiting
- 安全响应头
- 敏感配置管理
- Data Protection
- 密码哈希
- Token 过期与吊销策略

安全要作为系统设计的一部分，而不是上线前补丁。

**24. 架构与工程化**
当项目变大，需要考虑代码组织。

常见结构：

```text
src/
 MyApp.Api
 MyApp.Application
 MyApp.Domain
 MyApp.Infrastructure
tests/
 MyApp.UnitTests
 MyApp.IntegrationTests
```

需要掌握：

| 主题 | 作用 |
|---|---|
| 分层架构 | 控制依赖方向 |
| Clean Architecture | 领域与基础设施解耦 |
| DDD 基础 | 实体、值对象、聚合、领域服务 |
| CQRS | 读写模型分离 |
| MediatR | 请求/处理器解耦 |
| Repository | 数据访问抽象 |
| Unit of Work | 事务边界 |
| Outbox Pattern | 消息和数据库一致性 |

不要一开始就过度架构。先保证边界清楚、依赖方向正确、业务逻辑不塞进 Controller。

**推荐学习顺序**
如果你要系统掌握 ASP.NET Core，我建议按下面顺序：

1. C# 语言基础
2. HTTP / REST / Web API 基础
3. ASP.NET Core 启动模型与 `Program.cs`
4. Middleware 请求管道
5. Routing 与 Endpoint
6. Controller / Minimal API
7. 参数绑定与模型验证
8. 配置系统与 Options
9. 依赖注入与生命周期
10. 日志与异常处理
11. Authentication 认证
12. Authorization 授权
13. Filters
14. EF Core 数据访问
15. 缓存
16. HttpClientFactory
17. BackgroundService
18. Swagger / OpenAPI / API Versioning
19. 测试
20. 部署
21. 可观测性
22. 安全
23. 架构与工程化

**最小必学闭环**
如果只想先具备开发一个标准 Web API 项目的能力，先掌握这 12 个：

1. `Program.cs` 启动模型
2. Middleware
3. Routing
4. Controller
5. 参数绑定
6. 模型验证
7. DI
8. Configuration / Options
9. Logging
10. Exception Handling
11. Authentication / Authorization
12. EF Core

掌握这 12 个，就能写出一个基本合格的 ASP.NET Core Web API 项目。

**进阶闭环**
再往上就是：

1. 缓存
2. HttpClientFactory
3. BackgroundService
4. Rate Limiting
5. Health Checks
6. OpenTelemetry
7. Integration Testing
8. Docker 部署
9. Clean Architecture
10. DDD / CQRS / Outbox

**一句话总结**
ASP.NET Core 的学习重点不是背 `AddXxx` 和 `UseXxx`，而是理解这条链路：

```text
HTTP 请求
-> Middleware 管道
-> Routing / Endpoint
-> 参数绑定与验证
-> Controller / Minimal API
-> Service / DI
-> EF Core / 外部服务
-> 日志 / 异常 / 缓存 / 授权
-> HTTP 响应
```

把这条链路理解透，再补齐部署、测试、安全、可观测性和架构，ASP.NET Core 体系就基本完整了。

建议拆成 **24 篇左右**，不要写成一篇大而全。ASP.NET Core 的体系很长，一篇文章会变成目录百科，读者看不完，也不方便后续维护。

我建议分成 **4 个阶段、24 篇文章**。

**阶段一：入门主线，先能写 Web API**
这一阶段目标是让读者能理解一个请求怎么进入 ASP.NET Core，并写出基本 API。

| 顺序 | 建议文章 | 重点 |
|---|---|---|
| 1 | `ASP.NET Core 学习路线：从 HTTP 请求到生产部署` | 总览、学习路径、知识地图 |
| 2 | `HTTP 与 RESTful API 基础：ASP.NET Core 开发前置知识` | HTTP 方法、状态码、Header、Body、REST |
| 3 | `ASP.NET Core 启动模型：Program.cs、Builder 与 WebApplication` | `builder`、`services`、`app`、环境、启动流程 |
| 4 | `ASP.NET Core Middleware：请求管道与中间件顺序` | `Use`、`Run`、`Map`、自定义中间件、顺序 |
| 5 | `ASP.NET Core Routing：路由与 Endpoint 机制` | Attribute Routing、Endpoint Routing、路由参数 |
| 6 | `ASP.NET Core Web API：Controller、Action 与结果返回` | Controller、ActionResult、状态码、REST 返回 |
| 7 | `ASP.NET Core 参数绑定与模型验证：FromRoute、FromQuery、FromBody` | 参数来源、DTO、DataAnnotations、验证失败 |
| 8 | `ASP.NET Core Minimal API：轻量接口开发实践` | Minimal API、Route Group、TypedResults、过滤器 |

阶段一建议 **8 篇**。

**阶段二：应用基础设施，写出可维护项目**
这一阶段目标是让项目结构稳定，配置、依赖、日志、异常、认证授权都能合理处理。

| 顺序 | 建议文章 | 重点 |
|---|---|---|
| 9 | `ASP.NET Core Configuration：配置系统与环境变量` | 配置来源、环境配置、User Secrets、优先级 |
| 10 | `ASP.NET Core Options：强类型配置、验证与热更新` | `IOptions`、`IOptionsSnapshot`、`IOptionsMonitor` |
| 11 | `ASP.NET Core Dependency Injection：服务注册与生命周期` | Singleton、Scoped、Transient、生命周期陷阱 |
| 12 | `ASP.NET Core Logging：ILogger、结构化日志与日志配置` | 日志级别、结构化日志、Serilog |
| 13 | `ASP.NET Core 异常处理：ExceptionHandler、ProblemDetails 与统一响应` | 全局异常、错误码、ProblemDetails |
| 14 | `ASP.NET Core Authentication：Cookie、JWT 与认证流程` | Cookie、JWT、登录态、Token |
| 15 | `ASP.NET Core Authorization：Role、Claim、Policy 与资源授权` | 授权策略、权限模型、401/403 |
| 16 | `ASP.NET Core Filters：过滤器管道与横切逻辑` | ActionFilter、ExceptionFilter、ResourceFilter |

阶段二建议 **8 篇**。

**阶段三：生产项目常用能力**
这一阶段目标是补齐真实后端项目常用组件。

| 顺序 | 建议文章 | 重点 |
|---|---|---|
| 17 | `ASP.NET Core 与 EF Core：数据访问、DbContext 与查询实践` | DbContext、实体、查询、事务入口 |
| 18 | `ASP.NET Core 缓存：MemoryCache、DistributedCache 与 Redis` | 本地缓存、分布式缓存、缓存失效 |
| 19 | `ASP.NET Core HttpClientFactory：外部服务调用、重试与超时` | Typed Client、Named Client、Polly/Resilience |
| 20 | `ASP.NET Core BackgroundService：后台任务、定时任务与队列消费` | `IHostedService`、`BackgroundService`、作用域服务 |
| 21 | `ASP.NET Core 文件上传下载：FormFile、Stream 与安全限制` | 上传、下载、大小限制、MIME、安全 |
| 22 | `ASP.NET Core OpenAPI：Swagger、接口文档与版本控制` | Swagger、JWT 按钮、API Versioning |
| 23 | `ASP.NET Core 测试：单元测试、集成测试与 WebApplicationFactory` | xUnit、Mock、集成测试、测试数据库 |
| 24 | `ASP.NET Core 安全基础：CORS、CSRF、限流与安全响应头` | CORS、RateLimiter、CSRF、Header、安全配置 |

阶段三建议 **8 篇**。

**阶段四：部署、监控和架构进阶**
如果你想把 ASP.NET Core 系列做成完整生产级路线，可以再加 8 篇进阶文章。

| 顺序 | 建议文章 | 重点 |
|---|---|---|
| 25 | `ASP.NET Core 部署基础：Kestrel、Nginx、IS 与 Docker` | Kestrel、反代、Docker、环境变量 |
| 26 | `ASP.NET Core Health Checks：存活检查、就绪检查与依赖探测` | `/health/live`、`/health/ready`、数据库检查 |
| 27 | `ASP.NET Core 可观测性：日志、指标、链路追踪与 OpenTelemetry` | Logging、Metrics、Tracing、OTel |
| 28 | `ASP.NET Core 性能优化：异步、连接池、压缩、缓存与诊断工具` | 性能思路、dotnet-counters、Benchmark |
| 29 | `ASP.NET Core 项目结构：分层架构、Clean Architecture 与模块化` | API/Application/Domain/Infrastructure |
| 30 | `ASP.NET Core DDD 入门：实体、值对象、聚合与领域服务` | DDD 基础建模 |
| 31 | `ASP.NET Core CQRS 与 MediatR：命令查询分离实践` | Command、Query、Handler、Pipeline |
| 32 | `ASP.NET Core Outbox Pattern：数据库与消息一致性` | 事务消息、事件表、后台发布 |

阶段四建议 **8 篇**。

**最推荐的最终数量**
如果你是想系统建设博客分类，我建议：

| 目标 | 篇数 |
|---|---|
| 只覆盖 Web API 入门 | 8 篇 |
| 覆盖日常业务开发 | 16 篇 |
| 覆盖真实生产项目 | 24 篇 |
| 覆盖架构和工程化进阶 | 32 篇 |

我的建议是：**先规划 24 篇，后续再扩展到 32 篇。**

因为 24 篇能覆盖一个 ASP.NET Core 后端开发者最常用的 80% 知识：

- 请求管道
- 路由
- Controller
- 参数绑定
- 配置
- DI
- 日志
- 异常
- 认证授权
- EF Core
- 缓存
- HttpClient
- 后台任务
- 文档
- 测试
- 安全

32 篇则更适合做“生产级 / 架构级”系列。

**不建议的拆法**
不建议把所有内容写成这些大文章：

- `ASP.NET Core 完全指南`
- `ASP.NET Core 从入门到精通`
- `.NET 后端开发大全`

这种文章容易变成概念堆砌，不利于搜索、维护和后续补充。

也不建议拆得太碎，比如：

- `UseRouting 是什么`
- `UseAuthorization 是什么`
- `MapControllers 是什么`
- `[FromBody] 是什么`

这种适合做小节，不适合单独成篇。

**推荐目录命名**
建议文件统一放在：

```text
posts/dotnet/
```

并用统一前缀：

```text
aspnet-core-roadmap.mdx
aspnet-core-http-rest-basics.mdx
aspnet-core-startup-model.mdx
aspnet-core-middleware.mdx
aspnet-core-routing-endpoint.mdx
aspnet-core-webapi-controller.mdx
aspnet-core-model-binding-validation.mdx
aspnet-core-minimal-api.mdx
aspnet-core-configuration.mdx
aspnet-core-options.mdx
aspnet-core-dependency-injection.mdx
aspnet-core-logging.mdx
aspnet-core-exception-handling.mdx
aspnet-core-authentication.mdx
aspnet-core-authorization.mdx
aspnet-core-filters.mdx
aspnet-core-ef-core.mdx
aspnet-core-caching.mdx
aspnet-core-httpclient-factory.mdx
aspnet-core-background-service.mdx
aspnet-core-file-upload-download.mdx
aspnet-core-openapi-versioning.mdx
aspnet-core-testing.mdx
aspnet-core-security.mdx
```

后续进阶：

```text
aspnet-core-deployment.mdx
aspnet-core-health-checks.mdx
aspnet-core-observability.mdx
aspnet-core-performance.mdx
aspnet-core-project-structure.mdx
aspnet-core-ddd-basics.mdx
aspnet-core-cqrs-mediatr.mdx
aspnet-core-outbox-pattern.mdx
```

**建议先写的 10 篇**
如果你不想一次铺 24 篇，先从这 10 篇开始：

1. `ASP.NET Core 学习路线：从 HTTP 请求到生产部署`
2. `ASP.NET Core 启动模型：Program.cs、Builder 与 WebApplication`
3. `ASP.NET Core Middleware：请求管道与中间件顺序`
4. `ASP.NET Core Routing：路由与 Endpoint 机制`
5. `ASP.NET Core Web API：Controller、Action 与结果返回`
6. `ASP.NET Core 参数绑定与模型验证`
7. `ASP.NET Core Configuration：配置系统与环境变量`
8. `ASP.NET Core Dependency Injection：服务注册与生命周期`
9. `ASP.NET Core 异常处理：ProblemDetails 与统一响应`
10. `ASP.NET Core Authentication 与 Authorization：认证授权基础`

这 10 篇能先把主链路串起来。

**一句话建议**
最好按 **24 篇主系列 + 8 篇进阶系列** 规划；先写前 24 篇中的核心 10 篇，确保 ASP.NET Core 的请求管道、路由、Controller、绑定验证、配置、DI、日志异常、认证授权这些主干内容完整，再补缓存、后台任务、测试、安全和部署。
