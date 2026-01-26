---
title: ModernWMS学习笔记
date: 2025-04-25
---

## startup

```csharp
    public class Startup
    {
        /// <summary>
        /// startup
        /// </summary>
        /// <param name="configuration">Config</param>
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        /// <summary>
        ///  register service 
        /// </summary>
        /// <param name="services">services</param>
        public void ConfigureServices(IServiceCollection services)
        {
            services.AddExtensionsService(Configuration);
        }

        /// <summary>
        /// configure
        /// </summary>
        /// <param name="app">app</param>
        /// <param name="env">env</param>
        /// <param name="serviceProvider">serviceProvider</param>
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env, IServiceProvider service_provider)
        {
            app.UseExtensionsConfigure(env, service_provider, Configuration);
        }
    }
```

### configuration

`configuration`是配置，用来获取配置文件中的内容
例如：
`appsettings.json`

```json
{
  "MyAppSettings": {
    "ApiKey": "123456"
  }
}
```

通过 Configuration["MyAppSettings:ApiKey"] 来读取这个值。

### ConfigureServices

将你需要的服务添加到依赖注入容器中。所有通过 services.AddXxx() 添加的服务都可以在控制器、服务类中注入使用。

- 该方法是可选的
- 该方法用于添加服务到DI容器中
- 该方法在Configure方法之前被调用
- 该方法要么无参数，要么只能有一个参数且类型必须为IServiceCollection
- 该方法内的代码大多是形如Add{Service}的扩展方法

`AddExtensionsService`

```csharp
     public static void AddExtensionsService(this IServiceCollection services, IConfiguration configuration)
     {  
        // 注册本地化支持
         services.AddLocalization();
         services.AddSingleton<IStringLocalizer>((sp) =>
         {  
            // 注入 IStringLocalizer，默认使用泛型版 IStringLocalizer<MultiLanguage>，实现多语言功能。
             var sharedLocalizer = sp.GetRequiredService<IStringLocalizer<MultiLanguage>>();
             return sharedLocalizer;
         });

        //  用于发送 HTTP 请求。
         services.AddHttpClient();
        //  允许在服务类中访问 HttpContext，比如用户信息、请求头等。
        // 
         services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();

        //  注册缓存管理器
         services.AddSingleton<CacheManager>();
         services.AddSingleton<IMemoryCache>(factory =>
         {
             var cache = new MemoryCache(new MemoryCacheOptions());
             return cache;
         });
        // 数据库连接（多数据库支持）
         var database_config = configuration.GetSection("Database")["db"];
         services.AddDbContextPool<SqlDBContext>(t =>
         {
             if (database_config.ToUpper() == "SQLLITE")
             {
                 var SqlLite_connection = configuration.GetConnectionString("SqlLiteConn");
                 t.UseSqlite(SqlLite_connection, b => b.MigrationsAssembly("ModernWMS"));
             }
             else if (database_config.ToUpper() == "MYSQL")
             {
                 var Mysql_connection = configuration.GetConnectionString("MySqlConn");
                 t.UseMySql(Mysql_connection, new MySqlServerVersion(new Version(8, 0, 26)));
             }
             else if (database_config.ToUpper() == "SQLSERVER")
             {
                 var SqlServer_connection = configuration.GetConnectionString("SqlServerConn");
                 t.UseSqlServer(SqlServer_connection);
             }
             else if (database_config.ToUpper() == "POSTGRES")
             {
                 var Postgre_connection = configuration.GetConnectionString("PostGresConn");
                 t.UseNpgsql(Postgre_connection);
                 AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
                 AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);
             }
             t.EnableSensitiveDataLogging();
             t.UseLoggerFactory(new LoggerFactory(new[] { new DebugLoggerProvider() }));
         }, 100); ;
         services.AddMemoryCache();
         services.AddScoped<MultiTenancy.ITenantProvider, MultiTenancy.TenantProvider>();
         services.AddSwaggerService(configuration, AppContext.BaseDirectory);
         services.AddTokenGeneratorService(configuration);
         services.RegisterAssembly();
         services.AddControllers(c =>
         {
             c.Filters.Add(typeof(ViewModelActionFiter));
             c.MaxModelValidationErrors = 99999;
         }).ConfigureApiBehaviorOptions(o =>
         {
             o.SuppressModelStateInvalidFilter = true;
         })//format
           .AddNewtonsoftJson(options =>
           {
               options.SerializerSettings.ReferenceLoopHandling = ReferenceLoopHandling.Ignore;
               options.SerializerSettings.DateFormatString = "yyyy-MM-dd HH:mm:ss";
               options.SerializerSettings.Converters.Add(new JsonStringTrimConverter());
               options.SerializerSettings.Formatting = Formatting.Indented;
               options.SerializerSettings.ContractResolver = new Newtonsoft.Json.Serialization.CamelCasePropertyNamesContractResolver();
           }).AddDataAnnotationsLocalization(options =>
           {
               options.DataAnnotationLocalizerProvider = (type, factory) =>
                   factory.Create(typeof(ModernWMS.Core.MultiLanguage));
           });

         // Hangfire
         services.AddHangfire(x => x.SetDataCompatibilityLevel(CompatibilityLevel.Version_170)
             .UseSimpleAssemblyNameTypeSerializer()
             .UseRecommendedSerializerSettings()
             .UseStorage(new MemoryStorage()));
         services.AddHangfireServer();
         services.AddScoped<FunctionHelper>();
     }
```

#### AddHttpClient

在依赖注入（Dependency Injection, DI）容器中注册   HttpClient   实例。这使得你可以在应用程序中方便地使用   HttpClient   来发送 HTTP 请求，并且可以利用 ASP.NET Core 的依赖注入机制来管理   HttpClient   的生命周期。

```csharp
// **注册**
public void ConfigureServices(IServiceCollection services)
{
    services.AddHttpClient();
}
// 使用
public class MyController : ControllerBase
{
    private readonly HttpClient _httpClient;

    public MyController(HttpClient httpClient)
    {
        _httpClient = httpClient;
    }

    [HttpGet("api/data")]
    public async Task<IActionResult> GetData()
    {
        var response = await _httpClient.GetAsync("https://api.example.com/data");
        var content = await response.Content.ReadAsStringAsync();
        return Ok(content);
    }
}


```

#### HttpContextAccessor

::: info httpContext
HttpContext 是 ASP.NET Core 处理每一个 HTTP 请求时的重要对象。

它包含了请求、响应、用户、Session、请求头、Cookies 等等信息。

但是它默认只能在中间件或控制器中使用，在普通的服务类里是无法直接访问的。
:::

::: info  `AsyncLocal<T>`

在异步编程中，任务（  Task  ）可能会在不同的线程之间切换，这使得传统的线程局部存储（TLS）无法正确地维护上下文信息。例如，如果你在异步方法中使用   `ThreadLocal<T>`  ，可能会因为任务切换到不同的线程而导致上下文丢失或混乱。

`AsyncLocal<T>`   解决了这个问题，它确保在异步任务切换时，上下文信息能够正确地传播和保持一致。
:::

```csharp
// 让你在服务类、工具类或中间件之外的地方，也能获取当前的 HttpContext
services.AddSingleton<IHttpContextAccessor, HttpContextAccessor>();
// IHttpContextAccessor 是 ASP.NET Core 提供的接口，它能让你在任何地方拿到当前请求的 HttpContext
public class HttpContextAccessor : IHttpContextAccessor
{   
    /*
    🔧 AsyncLocal<T> 是 .NET 提供的一个异步线程本地变量容器，适用于：

    每个请求独立（不会被并发污染）

    跨中间件、跨异步方法传递状态
    
    */ 
    private static readonly AsyncLocal<HttpContextHolder> _httpContextCurrent = new AsyncLocal<HttpContextHolder>();

    /// <inheritdoc/>
    public HttpContext? HttpContext
    {
        get
        {
            return _httpContextCurrent.Value?.Context;
        }
        set
        {
            var holder = _httpContextCurrent.Value;
            if (holder != null)
            {
                // Clear current HttpContext trapped in the AsyncLocals, as its done.
                holder.Context = null;
            }

            if (value != null)
            {
                // Use an object indirection to hold the HttpContext in the AsyncLocal,
                // so it can be cleared in all ExecutionContexts when its cleared.
                _httpContextCurrent.Value = new HttpContextHolder { Context = value };
            }
        }
    }

    private sealed class HttpContextHolder
    {   
        // 解决 AsyncLocal<T> 对象生命周期和线程清理的问题。
        public HttpContext? Context;
    }
}

```

### Configure

Configure 是 ASP.NET Core 框架在应用启动时调用的方法之一

- 该方法是必须的
- 该方法用于配置HTTP请求管道，通过向管道添加中间件，应用不同的响应方式。
- 该方法在ConfigureServices方法之后被调用
- 该方法中的参数可以接受任何已注入到DI容器中的服务
- 该方法内的代码大多是形如Use{Middleware}的扩展方法
- 该方法内中间件的注册顺序与代码的书写顺序是一致的，先注册的先执行，后注册的后执行
