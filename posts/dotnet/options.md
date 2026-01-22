---
title: 选项 Options
date: 2025-04-18
category:
  - DotNet
--- 

在 .NET 中，Options 是一套 用于绑定和管理配置的推荐做法，比直接使用 IConfiguration 更加强类型、安全、可维护。

- 把配置项绑定到强类型对象（类似 `Get<AppSettings>()`）

- 支持依赖注入（通过 `IOptions<T>`注入配置）

- 支持配置验证、热更新（reload on change）等高级功能

- 让配置逻辑和业务逻辑分离，提高代码可读性和可测试性

## 使用

`appsettings.json`

```json
{
  "MySettings": {
    "Title": "Options Demo",
    "MaxUsers": 50
  }
}
```

配置options服务

```csharp
public class MySettings
{
    public string Title { get; set; }
    public int MaxUsers { get; set; }
}
builder.Services.Configure<MySettings>(
    builder.Configuration.GetSection("MySettings"));
```

使用

```csharp
public class MyService
{
    private readonly MySettings _settings;

    public MyService(IOptions<MySettings> options)
    {
        _settings = options.Value;
    }

    public void PrintSettings()
    {
        Console.WriteLine($"Title: {_settings.Title}, MaxUsers: {_settings.MaxUsers}");
    }
}
```

## Options读取

|接口名 | 生命周期 | 是否支持热更新 | 使用场景 |
|---|---|---|---|
|`IOptions<T>`| 单例（Singleton） | ❌ 否 | 默认选项，适合配置不变的场景 |
|`IOptionsSnapshot<T>` | 每请求一次（Scoped） | ✅ 是 | Web 应用中，每次请求获取新配置 |
|`IOptionsMonitor<T>` | 单例（Singleton） | ✅ 是 | 长时间运行的服务，动态监听配置变更 |
|`IOptionsFactory<T>` | 用于内部创建配置实例 | ✅ 取决于配置源 | 自定义配置构造逻辑时使用，不常直接注入 |

- ✅ 配置不需要变更：用 `IOptions<T>`

- 🔁 配置需要每请求更新：用 `IOptionsSnapshot<T>`

- 🔄 配置需要动态热更新或监听变化：用 `IOptionsMonitor<T>`

- 🏗️ 需要控制配置创建逻辑（很少用）：用 `IOptionsFactory<T>`

### IOptions

- 该接口对象实例生命周期为 Singleton，因此能够将该接口注入到任何生命周期的服务中
- 当该接口被实例化后，其中的选项值将永远保持不变，即使后续修改了与选项进行绑定的配置，也永远读取不到修改后的配置值
- 不支持命名选项（Named Options

```csharp
public class ValuesController : ControllerBase
{
    private readonly BookOptions _bookOptions;

    public ValuesController(IOptions<BookOptions> bookOptions)
    {
        // bookOptions.Value 始终是程序启动时加载的配置，永远不会改变
        _bookOptions = bookOptions.Value;
    }
}
```

### IOptionsSnapshot

该接口被注册为 Scoped，因此该接口无法注入到 Singleton 的服务中，只能注入到 Transient 和 Scoped 的服务中。
在作用域中，创建`IOptionsSnapshot<TOptions>`对象实例时，会从配置中读取最新选项值作为快照，并在作用域中始终使用该快照。
支持命名选项

```csharp
public class ValuesController : ControllerBase
{
    private readonly BookOptions _bookOptions;

    public ValuesController(IOptionsSnapshot<BookOptions> bookOptionsSnapshot)
    {
        // bookOptions.Value 是 Options 对象实例创建时读取的配置快照
        _bookOptions = bookOptionsSnapshot.Value;
    }
}
```

### IOptionsMonitor

- 该接口除了可以查看TOptions的值，还可以监控TOptions配置的更改。
- 该接口被注册为 Singleton，因此能够将该接口注入到任何生命周期的服务中
- 每次读取选项值时，都是从配置中读取最新选项值（具体读取逻辑查看下方三种接口对比测试）。
- 支持：
  - 命名选项
  - 重新加载配置（`CurrentValue`），并当配置发生更改时，进行通知（`OnChange`）
  - 缓存与缓存失效 (`IOptionsMonitorCache<TOptions>`)

```csharp
public class ValuesController : ControllerBase
{
    private readonly IOptionsMonitor<BookOptions> _bookOptionsMonitor;

    public ValuesController(IOptionsMonitor<BookOptions> bookOptionsMonitor)
    {
        // _bookOptionsMonitor.CurrentValue 的值始终是最新配置的值
        _bookOptionsMonitor = bookOptionsMonitor;
    }
}
```

## 命名选项

命名选项允许我们为同一个配置项定义多个不同的选项对象，每个选项对象都有唯一的名称，通过名称来区分不同的选项对象。

```csharp
// json
{
  "MvcOptions": {
    "Url": "123"
  },
  "WebOptions": {
    "Url": 456
  }
}
public class MvcOptions
{
    public string? Url { get; set; }
}
//  配置URL
static void TestNamed()
{
    var services = new ServiceCollection();
    var configuration = GetConfiguration();


    //name=Options.DefaultName
    services.Configure<MvcOptions>(configuration.GetSection("MvcOptions"));
    //name="o1"
    services.Configure<MvcOptions>("o1", configuration.GetSection("MvcOptions"));
    //name="o2"
    services.Configure<MvcOptions>("o2", configuration.GetSection("WebOptions"));


    var container = services.BuildServiceProvider();
    var o1 = container.GetRequiredService<IOptionsSnapshot<MvcOptions>>();
    var o2 = container.GetRequiredService<IOptionsMonitor<MvcOptions>>();
    //name="o1"
    Console.WriteLine("IOptionsSnapshot:Named:" + o1.Get("o1").Url);
    //name=Options.DefaultName
    Console.WriteLine("IOptionsSnapshot:Value:" + o1.Value.Url);
    //name="o2"
    Console.WriteLine("IOptionsMonitor:Named:" + o2.Get("o2").Url);
    //name=Options.DefaultName
    Console.WriteLine("IOptionsMonitor:Value:" + o2.CurrentValue.Url);
    var optionsFactory = sp.GetRequiredService<IOptionsFactory<MvcOptions>>();
    var options = optionsFactory.Create(Options.DefaultName);
}
```

多个配置节点绑定同一属性

```json
{
  "DateTime": {
    "Beijing": {
      "Year": 2021,
      "Month": 1,
      "Day":1,
      "Hour":12,
      "Minute":0,
      "Second":0
    },
    "Tokyo": {
      "Year": 2021,
      "Month": 1,
      "Day":1,
      "Hour":13,
      "Minute":0,
      "Second":0
    },
  }
}
```

配置

```csharp
public class DateTimeOptions
{
    public const string Beijing = "Beijing";
    public const string Tokyo = "Tokyo";

    public int Year { get; set; }
    public int Month { get; set; }
    public int Day { get; set; }
    public int Hour { get; set; }
    public int Minute { get; set; }
    public int Second { get; set; }
}
public class Startup
{
    public Startup(IConfiguration configuration)
    {
        Configuration = configuration;
    }

    public IConfiguration Configuration { get; }

    public void ConfigureServices(IServiceCollection services)
    {
        services.Configure<BookOptions>(Configuration.GetSection(BookOptions.Book));
        services.Configure<DateTimeOptions>(DateTimeOptions.Beijing, Configuration.GetSection($"DateTime:{DateTimeOptions.Beijing}"));
        services.Configure<DateTimeOptions>(DateTimeOptions.Tokyo, Configuration.GetSection($"DateTime:{DateTimeOptions.Tokyo}"));
    }
}

public class ValuesController : ControllerBase
{
    private readonly DateTimeOptions _beijingDateTimeOptions;
    private readonly DateTimeOptions _tockyoDateTimeOptions;

    public ValuesController(IOptionsSnapshot<DateTimeOptions> dateTimeOptions)
    {
        _beijingDateTimeOptions = dateTimeOptions.Get(DateTimeOptions.Beijing);
        _tockyoDateTimeOptions = dateTimeOptions.Get(DateTimeOptions.Tokyo);
    }
}
```

## Options验证

### DataAnnotations

```shell
Install-Package Microsoft.Extensions.Options.DataAnnotations
```

```csharp

public class BookOptions
{
    public const string Book = "Book";

    [Range(1,1000,
        ErrorMessage = "必须 {1} <= {0} <= {2}")]
    public int Id { get; set; }

    [StringLength(10, MinimumLength = 1,
        ErrorMessage = "必须 {2} <= {0} Length <= {1}")]
    public string Name { get; set; }

    public string Author { get; set; }
}
public void ConfigureServices(IServiceCollection services)
{
    services.AddOptions<BookOptions>()
        .Bind(Configuration.GetSection(BookOptions.Book))
        .ValidateDataAnnotations();
        .Validate(options =>
        {
            // 校验通过 return true
            // 校验失败 return false
    
            if (options.Author.Contains("A"))
            {
                return false;
            }
    
            return true;
        });
}
```

### IValidateOptions

实现`IValidateOptions<TOptions>`接口，增加数据校验规则

```csharp
public class BookValidation : IValidateOptions<BookOptions>
{
    public ValidateOptionsResult Validate(string name, BookOptions options)
    {
        var failures = new List<string>();
        if(!(options.Id >= 1 && options.Id <= 1000))
        {
            failures.Add($"必须 1 <= {nameof(options.Id)} <= {1000}");
        }
        if(!(options.Name.Length >= 1 && options.Name.Length <= 10))
        {
            failures.Add($"必须 1 <= {nameof(options.Name)} <= 10");
        }

        if (failures.Any())
        {
            return ValidateOptionsResult.Fail(failures);
        }

        return ValidateOptionsResult.Success;
    }
}

public void ConfigureServices(IServiceCollection services)
{
    services.Configure<BookOptions>(Configuration.GetSection(BookOptions.Book));
    services.TryAddEnumerable(ServiceDescriptor.Singleton<IValidateOptions<BookOptions>, BookValidation>());
}
```

## Options 后期配置

✅ `PostConfigure<T>()`：对特定命名配置实例或默认实例，在配置绑定之后做“后处理”

✅ `PostConfigureAll<T>()`：对所有命名实例都执行相同的“后处理”

```csharp
public void ConfigureServices(IServiceCollection services)
{
    services.PostConfigure<DateTimeOptions>(options =>
    {
        Console.WriteLine($"我只对名称为{Options.DefaultName}的{nameof(DateTimeOptions)}实例进行后期配置");
    });

    services.PostConfigure<DateTimeOptions>(DateTimeOptions.Beijing, options =>
    {
        Console.WriteLine($"我只对名称为{DateTimeOptions.Beijing}的{nameof(DateTimeOptions)}实例进行后期配置");
    });

    services.PostConfigureAll<DateTimeOptions>(options =>
    {
        Console.WriteLine($"我对{nameof(DateTimeOptions)}的所有实例进行后期配置");
    });
}
```

## 参考

- [AspNetCore企业级开发](https://gitee.com/soul-au/aspnetcore/blob/master/docs/04-Options.md)
- [理解ASP.NET Core - 选项(Options)](https://www.cnblogs.com/xiaoxiaotank/p/15391905.html)
