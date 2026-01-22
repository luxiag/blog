---
title: AutoMapper
date: 2023-03-15 16:25:33
category:
  - DotNet
---

# 使用

安装AutoMapper和AutoMapper.Extensions.Microsoft.DependencyInjection包
```shell
PM> Install-Package AutoMapper
```

定义源模型和目标模型

```csharp
public class SourceModel
{
    public int Id { get; set; }
    public string Name { get; set; }
}

public class DestinationModel
{
    public int Id { get; set; }
    public string FullName { get; set; }
}
```

创建映射配置

```csharp
using AutoMapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // 在这里添加你的映射配置
        CreateMap<SourceModel, DestinationModel>();
        // 例如：CreateMap<User, UserDTO>();
    }
}
```

注入autoMapper依赖

```csharp
    //注入autoMapper依赖
    services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
    /**
    AppDomain.CurrentDomain.GetAssemblies()
    - 获取当前应用程序域中所有已加载的程序集
    - AutoMapper 会扫描这些程序集
    - 自动查找并注册所有继承自 Profile 的映射配置类
    **/ 
```

配置映射规则

```csharp
public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SourceModel, DestinationModel>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Name));
    }
}
```

在控制器中使用AutoMapper

```csharp
using AutoMapper;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class ExampleController : ControllerBase
{
    private readonly IMapper _mapper;

    public ExampleController(IMapper mapper)
    {
        _mapper = mapper  ?? throw new ArgumentNullException(nameof(mapper));
    }

    [HttpGet]
    public ActionResult<DestinationModel> Get()
    {
        var source = new SourceModel();
        var destination = _mapper.Map<DestinationModel>(source);
        return Ok(destination);
    }
}
```

# 映射规则

- src：源对象。即映射操作中的源类型对象。在这个例子中，它是SourceModel类型的实例。
- dest：目标对象。即映射操作中的目标类型对象。在这个例子中，它是DestinationModel类型的实例。
- srcMember：源对象的成员值。即映射操作中当前成员在源对象中的值。
- destMember：目标对象的成员值。即映射操作中当前成员在目标对象中的值（在这个例子中未使用）。

```csharp
using AutoMapper;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // 自定义成员映射规则：将 SourceModel 的 Name 成员映射到 DestinationModel 的 FullName 成员
        CreateMap<SourceModel, DestinationModel>()
            .ForMember(dest => dest.FullName, opt => opt.MapFrom(src => src.Name));
    }
}
```
