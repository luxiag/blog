---
title: 身份认证 Authentication
date: 2025-04-20
category:
  - DotNet
---

Authentication（身份验证） 是一个核心的安全机制，用于验证用户的身份。它的主要目的是确定请求的发起者是否是他们声称的那个人。身份验证是安全体系中的第一步

```csharp
app.UseAuthentication();
```

`AuthenticationMiddleware`

```csharp
public class AuthenticationMiddleware
{
    private readonly RequestDelegate _next;

    public AuthenticationMiddleware(RequestDelegate next, IAuthenticationSchemeProvider schemes)
    {
        _next = next;
        Schemes = schemes;
    }

    public IAuthenticationSchemeProvider Schemes { get; set; }

    public async Task Invoke(HttpContext context)
    {
        // 记录原始路径和原始基路径
        context.Features.Set<IAuthenticationFeature>(new AuthenticationFeature
        {
            OriginalPath = context.Request.Path,
            OriginalPathBase = context.Request.PathBase
        });

        // 如果有显式指定的身份认证方案，优先处理（这里不用看，直接看下面）
        var handlers = context.RequestServices.GetRequiredService<IAuthenticationHandlerProvider>();
        foreach (var scheme in await Schemes.GetRequestHandlerSchemesAsync())
        {
            var handler = await handlers.GetHandlerAsync(context, scheme.Name) as IAuthenticationRequestHandler;
            if (handler != null && await handler.HandleRequestAsync())
            {
                return;
            }
        }

        // 使用默认的身份认证方案进行认证，并赋值 HttpContext.User
        var defaultAuthenticate = await Schemes.GetDefaultAuthenticateSchemeAsync();
        if (defaultAuthenticate != null)
        {
            var result = await context.AuthenticateAsync(defaultAuthenticate.Name);
            if (result?.Principal != null)
            {
                context.User = result.Principal;
            }
        }

        await _next(context);
    }
}
```

## Cookie认证

|场景 | 是否适合|
|---|---|
|网站登录（传统页面跳转） | ✅ 非常适合|
|前后端分离 API 接口 | ❌ 不推荐（推荐用 JWT）|
|管理后台 / 内网业务系统 | ✅ 合适|
|移动端 App、SPA、微信小程序 | ❌ Cookie 不可靠|

 `CookieAuthenticationDefaults`

```csharp
public static class CookieAuthenticationDefaults
{
    // 认证方案名
    public const string AuthenticationScheme = "Cookies";

    // Cookie名字的前缀
    public static readonly string CookiePrefix = ".AspNetCore.";
    
    // 登录路径
    public static readonly PathString LoginPath = new PathString("/Account/Login");

    // 注销路径
    public static readonly PathString LogoutPath = new PathString("/Account/Logout");

    // 访问拒绝路径
    public static readonly PathString AccessDeniedPath = new PathString("/Account/AccessDenied");

    // return url 的参数名
    public static readonly string ReturnUrlParameter = "ReturnUrl";
}

public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // 注册基于 Cookie 的身份验证选项，并指定默认的身份验证方案
        services.AddOptions<CookieAuthenticationOptions>(CookieAuthenticationDefaults.AuthenticationScheme)
            .Configure<IDataProtectionProvider>((options, dp) =>
            {
                // 配置登录路径，未登录用户尝试访问受保护资源时会被重定向到这里
                options.LoginPath = new PathString("/Account/Login");
                // 配置登出路径，用户登出时会调用此路径
                options.LogoutPath = new PathString("/Account/Logout");
                // 配置无权限访问资源时的路径
                options.AccessDeniedPath = new PathString("/Account/AccessDenied");
                // 配置返回 URL 的查询字符串参数名称
                options.ReturnUrlParameter = "returnUrl";

                // 设置 Cookie 的过期时间为 14 天
                options.ExpireTimeSpan = TimeSpan.FromDays(14);
                // 启用滑动过期，每次请求都会重置 Cookie 的过期时间
                options.SlidingExpiration = true;

                // 配置 Cookie 的名称
                options.Cookie.Name = "auth";
                // 配置 Cookie 的路径
                options.Cookie.Path = "/";
                // 设置 Cookie 的 SameSite 属性为 Lax，防止 CSRF 攻击
                options.Cookie.SameSite = SameSiteMode.Lax;
                // 设置 Cookie 为 HttpOnly，防止通过 JavaScript 访问
                options.Cookie.HttpOnly = true;
                // 设置 Cookie 的安全策略，与请求的安全性相同
                options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
                // 标记 Cookie 为必需
                options.Cookie.IsEssential = true;
                // 使用分块 Cookie 管理器，用于处理大 Cookie
                options.CookieManager = new ChunkingCookieManager();

                // 如果 DataProtectionProvider 未设置，则使用注入的 IDataProtectionProvider
                options.DataProtectionProvider ??= dp;
                // 创建一个数据保护器，用于保护和解密身份验证票据
                var dataProtector = options.DataProtectionProvider.CreateProtector(
                    "Microsoft.AspNetCore.Authentication.Cookies.CookieAuthenticationMiddleware",
                    CookieAuthenticationDefaults.AuthenticationScheme,
                    "v2");
                // 指定用于序列化和反序列化身份验证票据的格式
                options.TicketDataFormat = new TicketDataFormat(dataProtector);

                // 在用户登录之前触发的事件
                options.Events.OnSigningIn = context =>
                {
                    // 打印正在登录的用户名称
                    Console.WriteLine($"{context.Principal.Identity.Name} 正在登录...");
                    return Task.CompletedTask;
                };

                // 在用户登录之后触发的事件
                options.Events.OnSignedIn = context =>
                {
                    // 打印已登录的用户名称
                    Console.WriteLine($"{context.Principal.Identity.Name} 已登录");
                    return Task.CompletedTask;
                };

                // 在用户登出时触发的事件
                options.Events.OnSigningOut = context =>
                {
                    // 打印注销的用户名称
                    Console.WriteLine($"{context.HttpContext.User.Identity.Name} 注销");
                    return Task.CompletedTask;
                };

                // 在验证用户身份时触发的事件
                options.Events.OnValidatePrincipal += context =>
                {
                    // 打印正在验证的用户名称
                    Console.WriteLine($"{context.Principal.Identity.Name} 验证 Principal");
                    return Task.CompletedTask;
                };
            });

        // 添加身份验证服务，并指定默认的身份验证方案
        services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
            // 添加基于 Cookie 的身份验证服务
            .AddCookie(CookieAuthenticationDefaults.AuthenticationScheme);
    }
}

```

### demo

```csharp
// ✅ Program.cs
using Microsoft.AspNetCore.Authentication.Cookies;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {   
      // 登录页路径
        options.LoginPath = "/account/login";
        // 访问拒绝页路径
        options.AccessDeniedPath = "/account/denied";
        // 认证票据（authentication ticket）的有效期
        options.ExpireTimeSpan = TimeSpan.FromMinutes(30);
    });

builder.Services.AddAuthorization();
builder.Services.AddControllersWithViews();

var app = builder.Build();

app.UseStaticFiles();
app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);

app.Run();


// ✅ Controllers/AccountController.cs
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

public class AccountController : Controller
{
    [HttpGet("/account/login")]
    public IActionResult Login() => View();

    [HttpPost("/account/login")]
    public async Task<IActionResult> Login(string username, string password)
    {
        // 示例：账号密码验证通过（实际需查数据库）
        if (username == "admin" && password == "123456")
        {
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, username),
                new Claim("role", "admin")
            };
            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);

            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal);

            return Redirect("/home/secure");
        }

        ViewBag.Error = "用户名或密码错误";
        return View();
    }

    [Authorize]
    [HttpGet("/account/logout")]
    public async Task<IActionResult> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Redirect("/account/login");
    }

    [HttpGet("/account/denied")]
    public IActionResult Denied() => Content("权限不足");
}


// ✅ Controllers/HomeController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

public class HomeController : Controller
{
    public IActionResult Index() => View();

    [Authorize]
    public IActionResult Secure() => Content($"欢迎你，{User.Identity?.Name}");
}

```

## JwtBearer认证

Jwt是一个开放行业标准（RFC7519），英文为Json Web Token，译为“Json网络令牌”，它可以以紧凑、URL安全的方式在各方之间传递声明（claims）。

在Jwt中，声明会被编码为Json对象，用作Jws(Json Web Signature)结构的负载（payload），或作为Jwe（Json Web Encryption）结构的明文，这就使得声明可以使用MAC（Message Authentication Code）进行数字签名或完整性保护和加密。

：：：info 跨站

传统的cookie只能实现跨域，而不能实现跨站（如my.abc.com和you.xyz.com），而Jwt原生支持跨域、跨站，因为它要求每次请求时，都要在请求头中携带token。
:::

::: info 跨服务器
在当前应用基本都是集群部署的情况下，如果使用传统cookie + session的认证方式，为了实现session跨服务器共享，还必须引入分布式缓存中间件。而Jwt不需要分布式缓存中间件，因为它可以不存储在服务器端。
:::

::: info Native App友好
对于原生平台（如iOS、Android、WP）的App，没有浏览器的支持，Cookie丧失了它的优势，而使用Jwt就很简单。
:::

### Jwt结构

Jwt由三部分组成，分别是头部（Header）、载荷（Payload）和签名（Signature），三部分之间使用点（.）分隔，格式如下：

```
Header.Payload.Signature
```

#### Header

头部包含两部分信息：类型（typ）和算法（alg），示例如下：

```json
{
  "typ": "JWT",
  "alg": "HS256"
}
```

#### Payload

载荷包含声明（claims），声明是关于实体（通常是用户）和其他数据的声明，声明包含三个部分：注册声明（Registered Claims）、公共声明和私有声明。示例如下：

- **注册声明（Registered Claims）**
  - iss  （Issuer）：发行者
  - exp  （Expiration Time）：过期时间  
  - sub  （Subject）：主题（通常是用户ID）  
  - aud  （Audience）：受众
  - iat  （Issued At）：发行时间
  - nbf  （Not Before）：生效时间
  - jti  （JWT ID）：JWT ID
- **公共声明（Public Claims）**
  - 可以添加任何自定义声明
  
- **私有声明（Private Claims）**
  - 可以添加任何自定义声明，应用程序内部使用的声明，不会公开

```json
{
  "sub": "1234567890",
  "name": "John Doe",
  "admin": true
}
```

#### Signature

签名是对头部和载荷进行签名，防止数据被篡改。签名算法如下：

```
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  secret)
```

### Bearer

Bearer 是一种身份验证方法，常用于 HTTP 请求头中的 Authorization 字段，它指明请求携带的是一个 Bearer Token。在认证过程中，Bearer Token 通常是一个 JWT（JSON Web Token） 或其他类型的令牌，用户或客户端在成功登录后会获得这个令牌，并且可以在后续的 API 请求中通过 Authorization 请求头携带该令牌，以证明自己的身份。

```plaintext
Authorization: Bearer <token>
```

**特点**

1. 无状态：

- • 令牌本身包含了所有必要的信息，服务器不需要存储会话信息。
- • 这使得 Bearer Token 非常适合无状态的分布式系统。

2. 可扩展性：

- • 由于不需要服务器存储会话信息，Bearer Token 可以轻松扩展到多个服务器。

3. 安全性：

- • 令牌通常包含签名，防止被篡改。
- • 令牌可以设置过期时间，减少被滥用的风险。

4. 灵活性：

- • 令牌可以包含任意的声明（如用户角色、权限等），适用于多种应用场景

**工作流程**

- 用户登录：用户输入用户名和密码，通过后端验证后，后端生成一个 JWT，并将其作为 Bearer Token 返回给前端（客户端）。

- 客户端发送请求：客户端在后续请求中，将 JWT 放在 Authorization 请求头中，以 Bearer Token 的形式发送给服务器：

```plaintext
Authorization: Bearer <JWT>

```

- 服务器验证：服务器接收到请求后，解析出 JWT 并验证其有效性，确保用户身份合法。如果验证成功，则授权访问请求的资源。

### Jwt使用

安装包

```csharp
Install-Package IdentityModel
Install-Package System.IdentityModel.Tokens.Jwt
Install-Package Microsoft.AspNetCore.Authentication.JwtBearer
```

配置选项类

```csharp
public class JwtOptions
{
    // JWT 配置的名称，用于标识该配置
    public const string Name = "Jwt";

    // 默认的编码方式，使用 UTF-8 编码
    public readonly static Encoding DefaultEncoding = Encoding.UTF8;

    // 默认的过期时间（以分钟为单位），默认为 30 分钟
    public readonly static double DefaultExpiresMinutes = 30d;

    // JWT 的受众（Audience），指定谁可以接收这个 JWT
    public string Audience { get; set; }

    // JWT 的发行者（Issuer），指定谁发行了这个 JWT
    public string Issuer { get; set; }

    // JWT 的过期时间（以分钟为单位），默认值为 DefaultExpiresMinutes
    public double ExpiresMinutes { get; set; } = DefaultExpiresMinutes;

    // 用于编码和解码的编码方式，默认值为 DefaultEncoding
    public Encoding Encoding { get; set; } = DefaultEncoding;

    // 对称安全密钥的字符串表示，用于签名和验证 JWT
    public string SymmetricSecurityKeyString { get; set; }

    // 通过 SymmetricSecurityKeyString 生成的对称安全密钥
    // 使用 Encoding.GetBytes 方法将字符串转换为字节数组
    public SymmetricSecurityKey SymmetricSecurityKey => new(Encoding.GetBytes(SymmetricSecurityKeyString));
}
```

配置

```csharp
public class Startup
{
    public void ConfigureServices(IServiceCollection services)
    {
        // 配置 JwtOptions，从 appsettings.json 中加载 JWT 配置
        services.Configure<JwtOptions>(Configuration.GetSection(JwtOptions.Name));
        
        // 从配置中获取 JwtOptions 实例
        var jwtOptions = Configuration.GetSection(JwtOptions.Name).Get<JwtOptions>();

        // 注册一个单例服务，用于生成签名凭据
        // 使用 jwtOptions 中的对称安全密钥和 HMAC SHA256 算法
        services.AddSingleton(sp => new SigningCredentials(jwtOptions.SymmetricSecurityKey, SecurityAlgorithms.HmacSha256Signature));

        // 注册一个作用域服务，用于处理 JWT 身份验证事件
        // AppJwtBearerEvents 类可以自定义 JWT 身份验证的事件处理逻辑
        services.AddScoped<AppJwtBearerEvents>();

        // 添加身份验证服务，并指定默认的身份验证方案为 JWT Bearer
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, options =>
            {
                // 配置 JWT 验证参数
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    // 允许的签名算法
                    ValidAlgorithms = new[] { SecurityAlgorithms.HmacSha256, SecurityAlgorithms.RsaSha256 },
                    // 允许的令牌类型
                    ValidTypes = new[] { JwtConstants.HeaderType },

                    // 验证发行者
                    ValidIssuer = jwtOptions.Issuer,
                    ValidateIssuer = true,

                    // 验证受众
                    ValidAudience = jwtOptions.Audience,
                    ValidateAudience = true,

                    // 验证签名密钥
                    IssuerSigningKey = jwtOptions.SymmetricSecurityKey,
                    ValidateIssuerSigningKey = true,

                    // 验证令牌的生命周期
                    ValidateLifetime = true,

                    // 要求令牌必须签名
                    RequireSignedTokens = true,
                    // 要求令牌必须有过期时间
                    RequireExpirationTime = true,

                    // 指定名称声明的类型
                    NameClaimType = JwtClaimTypes.Name,
                    // 指定角色声明的类型
                    RoleClaimType = JwtClaimTypes.Role,

                    // 设置时钟偏差为 0，避免因服务器时间不同步导致的验证失败
                    ClockSkew = TimeSpan.Zero,
                };

                // 保存令牌到请求上下文中，便于后续访问
                options.SaveToken = true;

                // 清空默认的安全令牌验证器
                options.SecurityTokenValidators.Clear();
                // 添加自定义的 JWT 安全令牌处理器
                options.SecurityTokenValidators.Add(new JwtSecurityTokenHandler());

                // 指定自定义的 JWT 身份验证事件处理器
                options.EventsType = typeof(AppJwtBearerEvents);
            });
    }
}

```

### demo

```csharp
// ✅ Program.cs
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

// 添加 JWT 认证服务
var jwtKey = "MySuperSecretKey12345"; // 应保存在配置文件中
var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = "myapp",
            ValidAudience = "myapp-users",
            IssuerSigningKey = key,
            ClockSkew = TimeSpan.Zero
        };
    });

builder.Services.AddAuthorization();

// 添加 Swagger + JWT 安全支持
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "JWT Auth API", Version = "v1" });
    var jwtSecurityScheme = new OpenApiSecurityScheme
    {
        BearerFormat = "JWT",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        Description = "输入: Bearer {你的token}",
        Reference = new OpenApiReference
        {
            Id = JwtBearerDefaults.AuthenticationScheme,
            Type = ReferenceType.SecurityScheme
        }
    };
    c.AddSecurityDefinition(jwtSecurityScheme.Reference.Id, jwtSecurityScheme);
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        { jwtSecurityScheme, Array.Empty<string>() }
    });
});

// 添加内存缓存保存 RefreshToken（可替换为 Redis）
builder.Services.AddMemoryCache();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();


// ✅ Models/LoginRequest.cs
public class LoginRequest
{
    public string Username { get; set; }
    public string Password { get; set; }
}


// ✅ Models/TokenResponse.cs
public class TokenResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}


// ✅ Controllers/AuthController.cs
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IConfiguration _config;
    private readonly IMemoryCache _cache;

    public AuthController(IConfiguration config, IMemoryCache cache)
    {
        _config = config;
        _cache = cache;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest request)
    {
        if (request.Username == "admin" && request.Password == "123456")
        {
            var accessToken = GenerateToken(request.Username);
            var refreshToken = Guid.NewGuid().ToString("N");

            _cache.Set("refresh_" + refreshToken, request.Username, TimeSpan.FromHours(2));

            return Ok(new TokenResponse
            {
                AccessToken = accessToken,
                RefreshToken = refreshToken
            });
        }

        return Unauthorized("用户名或密码错误");
    }

    [HttpPost("refresh")]
    public IActionResult RefreshToken([FromQuery] string refreshToken)
    {
        if (_cache.TryGetValue("refresh_" + refreshToken, out string? username))
        {
            var newToken = GenerateToken(username);
            return Ok(new TokenResponse
            {
                AccessToken = newToken,
                RefreshToken = refreshToken // 可返回旧的或生成新 token
            });
        }
        return Unauthorized("无效的 refresh token");
    }

    [Authorize]
    [HttpGet("userinfo")]
    public IActionResult UserInfo()
    {
        var username = User.Identity?.Name;
        var role = User.FindFirst("role")?.Value;
        return Ok(new { username, role });
    }

    private string GenerateToken(string username)
    {
        var claims = new[]
        {
            new Claim(ClaimTypes.Name, username),
            new Claim("role", "admin"),
            new Claim("ip", HttpContext.Connection.RemoteIpAddress?.ToString() ?? "")
        };

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("MySuperSecretKey12345"));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: "myapp",
            audience: "myapp-users",
            claims: claims,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: creds);

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}

```
