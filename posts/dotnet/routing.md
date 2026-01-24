---
title: 路由 Routing
date: 2025-04-16
category:
  - DotNet
---  

用户请求哪个 URL 时，应该由哪个代码逻辑（控制器/页面/处理方法）来处理这个请求。

- 通俗点说，路由就是个“导航系统”或“地址指引”：

- 用户访问一个网址（例如 /products/1）

- ASP.NET Core 就用“路由规则”找到对应的控制器、方法或页面，去处理这个请求

浏览器发请求 --> UseRouting() --> 路由匹配 --> UseAuthorization() --> UseEndpoints() 执行方法

路由是通过UseRouting和UseEndpoints两个中间件配合在一起来完成注册的：

## UseRouting

启用路由功能，并根据 URL 匹配到具体的路由终结点（endpoint）

- 读取请求 URL 和 HTTP 方法
- 匹配已经注册的路由（比如控制器或 endpoint）
- 把匹配结果存到 HttpContext 中，供后面的中间件使用（例如授权、执行控制器等）

>在调用UseRouting之前，你可以注册一些用于修改路由操作的数据，比如UseRewriter、UseHttpMethodOverride、UsePathBase等。

```csharp
var app = builder.Build();

app.UseRouting();              // 开启路由匹配
app.UseAuthentication();       // 认证（可选）
app.UseAuthorization();        // 授权（可选）

app.UseEndpoints(endpoints =>  // 注册终结点
{
    endpoints.MapControllers();    // 启用 Controller 路由
    endpoints.MapRazorPages();     // 启用 Razor 页面路由
});
```

## Endpoints

 ASP.NET Core 中负责“执行匹配到的路由终结点（Endpoint）”的中间件。

- 从 UseRouting() 那边“拿到”已匹配的 endpoint（比如 Controller 方法、页面等）

- 执行这个 endpoint 对应的处理逻辑

- 调用控制器、Razor 页面、最小 API、gRPC 方法等等

- 完成整个请求处理过程

```csharp
[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpGet("{id}")]
    public IActionResult Get(int id) => Ok($"Product {id}");
}
```

请求 /api/products/5 时：

- UseRouting()：匹配到 ProductsController.Get(int id)

- UseAuthorization()：检查是否有权限执行

- UseEndpoints()：执行这个方法，返回 Product 5

>在调用UseRouting和UseEndpoints之间，可以注册一些用于提前处理路由结果的中间件，如UseAuthentication、UseAuthorization、UseCors等

```csharp
public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
{
    app.Use(next => context =>
    {
        // 在 UseRouting 调用前，始终为 null
        Console.WriteLine($"1. Endpoint: {context.GetEndpoint()?.DisplayName ?? "null"}");
        return next(context);
    });

    // EndpointRoutingMiddleware 调用 SetEndpoint 来设置终结点
    app.UseRouting();

    app.Use(next => context =>
    {
        // 如果路由匹配到了终结点，那么此处就不为 null，否则，还是 null
        Console.WriteLine($"2. Endpoint: {context.GetEndpoint()?.DisplayName ?? "null"}");
        return next(context);
    });

    // EndpointMiddleware 通过 GetEndpoint 方法获取终结点，
    // 然后执行该终结点的 RequestDelegate 委托
    app.UseEndpoints(endpoints =>
    {
        endpoints.MapGet("/", context =>
        {
            // 匹配到了终结点，肯定不是 null
            Console.WriteLine($"3. Endpoint: {context.GetEndpoint()?.DisplayName ?? "null"}");
            return Task.CompletedTask;
        }).WithDisplayName("Custom Display Name");  // 自定义终结点名称
    });

    app.Use(next => context =>
    {
        // 只有当路由没有匹配到终结点时，才会执行这里
        Console.WriteLine($"4. Endpoint: {context.GetEndpoint()?.DisplayName ?? "null"}");
        return next(context);
    });
}
```

## Minimal API

 ASP.NET Core 中用于注册路由并直接处理请求的简洁方式,用于将 HTTP 请求（GET、POST 等）直接映射到一个处理函数，不用写控制器！

|方法名 | 对应的 HTTP 动作 | 用途示例 |
|---|---|---|
|MapGet | GET | 获取数据 |
|MapPost | POST | 创建资源 |
|MapPut | PUT | 更新资源 |
|MapDelete | DELETE | 删除资源 |
|MapPatch | PATCH | 局部更新 |

方法是挂在 IEndpointRouteBuilder 上的，比如 WebApplication（var app = builder.Build() 之后的那个 app）。

```csharp
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

// GET 路由：返回 Hello 字符串
app.MapGet("/", () => "Hello, world!");

// POST 路由：接受表单或 JSON 数据
app.MapPost("/submit", (UserData data) =>
{
    return $"Hi {data.Name}, age {data.Age}";
});

app.Run();

record UserData(string Name, int Age);

```

### 参数绑定

Minimal API 支持直接从请求中自动绑定参数（包括 query、body、route、service 等）。

```csharp
// GET 路由：从 query 中获取参数
app.MapGet("/query", (int id) => $"Id: {id}");

// POST 路由：从 body 中获取参数
app.MapPost("/body", (UserData data) => $"Hi {data.Name}, age {data.Age}");

// GET 路由：从 route 中获取参数
app.MapGet("/route/{id}", (int id) => $"Id: {id}");

// GET 路由：从 service 中获取参数
app.MapGet("/service", (MyService service) => $"Service: {service.Name}");



```

## 路由种类

|路由方式 | 说明 | 示例|
|---|---|---|
|属性路由（Attribute Routing） | 路由信息写在控制器或方法的特性中 | [Route("api/items/{id}")] |
|约定路由（Conventional Routing） | 统一在 UseEndpoints 中写一套规则 | "controller/action/id?"|

**属性路由**

```js
[Route("api/users")]
public class UsersController : Controller
{
    [HttpGet("{id}")]
    public IActionResult Get(int id) => Ok($"User {id}");
}
```

**约定路由**

```js
app.UseEndpoints(endpoints =>
{
    endpoints.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
});
```

## 路由模板

ASP.NET Core 中用来定义 URL 路径结构的语法规则，主要用于控制器路由和 Minimal API 中的 URL 匹配。

- 路由是 大小写不敏感（默认）

- 参数名与方法参数要 匹配

- 多个路由不能冲突（例如两个路由都匹配 /product/1，但含义不一样）

- 越具体的路由应该放前面，越“模糊”（带 *）的放后面

|模板片段 | 说明 | 示例|
|---|---|---|
|固定路径 | 精确匹配 | `/home/index`|
|`{参数名}` | 匹配路径中的变量 | `/product/{id}`|
|`{参数名?}` | 可选参数 | `/product/{id?}`|
|`{参数名=默认值}` | 可选参数 + 默认值 | `{lang=en}`|
|`{*参数名}` | 匹配剩余路径（catch-all） | `/files/{*filepath}`|
|`[Route("api/[controller]")]` | 占位符，会自动替换成控制器名 | `[controller] => Product`|
|`[action]` | 替换为方法名 | `[action] => GetById`|

### Catch-all

路由模板中的星号`*`和双星号`**`被称为catch-all参数，该参数可以作为路由参数的前缀，如/Book/{*id}、/Book/{**id}，可以匹配以/Book开头的任意Url，如/Book、/Book/、/Book/abc、/Book/abc/def等。
`*`和`**`在一般使用上没有什么区别，它们仅仅在使用LinkGenerator时会有不同，如id = abc/def，当使用/Book/{*id}模板时，会生成`/Book/abc%2Fdef`，当使用/Book/{**id}模板时，会生成/Book/abc/def。

# 参考

- [ASP.NET Core 路由](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/routing?view=aspnetcore-6.0)
- [Minimal API](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/minimal-apis?view=aspnetcore-6.0)
- [ASP.NET Core 路由模板](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/routing?view=aspnetcore-6.0#route-template-syntax)
- [ASP.NET Core 路由种类](https://docs.microsoft.com/zh-cn/aspnet/core/fundamentals/routing?view=aspnetcore-6.0#route-types)
- [理解ASP.NET Core - 路由(Routing)](https://www.cnblogs.com/xiaoxiaotank/p/15468491.html)
