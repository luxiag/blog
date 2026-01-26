---
title: AutoMapper
subtitle: .NET对象映射的最佳实践
date: 2023-03-15 16:25:33
---

# 简介

AutoMapper是一个基于约定的对象到对象映射工具，主要用于解决DTO（数据传输对象）与领域模型之间的转换问题。它可以极大地减少手动编写映射代码的工作量，提高开发效率和代码可维护性。

## 主要特性

- 基于约定的映射：自动匹配相同名称和类型的属性
- 灵活的配置：支持自定义映射规则
- 集合映射：自动处理集合类型的映射
- 嵌套映射：支持复杂对象图的映射
- 性能优化：编译时生成映射代码，运行时性能接近手动映射

# 使用

## 安装

安装AutoMapper和AutoMapper.Extensions.Microsoft.DependencyInjection包

```shell
PM> Install-Package AutoMapper
PM> Install-Package AutoMapper.Extensions.Microsoft.DependencyInjection
```

或使用.NET CLI:

```shell
dotnet add package AutoMapper
dotnet add package AutoMapper.Extensions.Microsoft.DependencyInjection
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

## 基本概念

- src：源对象。即映射操作中的源类型对象。在这个例子中，它是SourceModel类型的实例。
- dest：目标对象。即映射操作中的目标类型对象。在这个例子中，它是DestinationModel类型的实例。
- srcMember：源对象的成员值。即映射操作中当前成员在源对象中的值。
- destMember：目标对象的成员值。即映射操作中当前成员在目标对象中的值（在这个例子中未使用）。

## 成员映射

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

## 条件映射

```csharp
CreateMap<SourceModel, DestinationModel>()
    .ForMember(dest => dest.FullName, 
        opt => {
            opt.Condition(src => !string.IsNullOrEmpty(src.Name));
            opt.MapFrom(src => src.Name);
        });
```

## 值转换

```csharp
CreateMap<SourceModel, DestinationModel>()
    .ForMember(dest => dest.FullName, 
        opt => opt.MapFrom(src => $"{src.FirstName} {src.LastName}"))
    .ForMember(dest => dest.CreatedDate, 
        opt => opt.MapFrom(src => DateTime.Parse(src.DateString)));
```

## 忽略属性

```csharp
CreateMap<SourceModel, DestinationModel>()
    .ForMember(dest => dest.Id, opt => opt.Ignore());
```

## 反向映射

```csharp
CreateMap<SourceModel, DestinationModel>()
    .ReverseMap(); // 创建双向映射
```

## 集合映射

AutoMapper会自动处理集合类型的映射：

```csharp
// 源集合
var sourceList = new List<SourceModel> { /* ... */ };

// 映射到目标集合
var destList = _mapper.Map<List<DestinationModel>>(sourceList);

// 也支持其他集合类型
var destArray = _mapper.Map<DestinationModel[]>(sourceList);
var destIEnumerable = _mapper.Map<IEnumerable<DestinationModel>>(sourceList);
```

## 嵌套映射

处理复杂对象图的映射：

```csharp
public class Order
{
    public int Id { get; set; }
    public Customer Customer { get; set; }
    public List<OrderItem> Items { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public CustomerDto Customer { get; set; }
    public List<OrderItemDto> Items { get; set; }
}

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Order, OrderDto>();
        CreateMap<Customer, CustomerDto>();
        CreateMap<OrderItem, OrderItemDto>();
    }
}
```

## 扁平化映射

将嵌套对象扁平化到目标对象：

```csharp
public class Order
{
    public int Id { get; set; }
    public Customer Customer { get; set; }
}

public class Customer
{
    public string Name { get; set; }
    public string Address { get; set; }
}

public class OrderDto
{
    public int Id { get; set; }
    public string CustomerName { get; set; }
    public string CustomerAddress { get; set; }
}

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<Order, OrderDto>();
        // AutoMapper会自动匹配Customer.Name到CustomerName
    }
}
```

## 自定义值解析器

对于复杂的转换逻辑，可以创建自定义值解析器：

```csharp
public class CustomResolver : IValueResolver<SourceModel, DestinationModel, string>
{
    public string Resolve(SourceModel source, DestinationModel destination, string destMember, ResolutionContext context)
    {
        return $"Custom: {source.Name}";
    }
}

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SourceModel, DestinationModel>()
            .ForMember(dest => dest.FullName, 
                opt => opt.MapFrom<CustomResolver>());
    }
}
```

## 类型转换器

对于整个对象类型的转换，可以使用类型转换器：

```csharp
public class SourceToDestinationConverter : ITypeConverter<SourceModel, DestinationModel>
{
    public DestinationModel Convert(SourceModel source, DestinationModel destination, ResolutionContext context)
    {
        return new DestinationModel
        {
            Id = source.Id,
            FullName = $"Converted: {source.Name}"
        };
    }
}

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<SourceModel, DestinationModel>()
            .ConvertUsing<SourceToDestinationConverter>();
    }
}
# 最佳实践

## 1. 合理组织映射配置

建议按功能模块组织映射配置：

```csharp
public class UserProfile : Profile
{
    public UserProfile()
    {
        CreateMap<User, UserDto>();
        CreateMap<UserDto, User>();
    }
}

public class OrderProfile : Profile
{
    public OrderProfile()
    {
        CreateMap<Order, OrderDto>();
        CreateMap<OrderItem, OrderItemDto>();
    }
}
```

## 2. 使用验证

在开发环境中启用映射验证，及早发现配置问题：

```csharp
services.AddAutoMapper(cfg => 
{
    cfg.Advanced.AllowAdditiveTypeMapCreation = true;
    cfg.CompileMappings(); // 编译时检查映射配置
}, AppDomain.CurrentDomain.GetAssemblies());
```

## 3. 性能优化

- 使用`CompileMappings()`预编译映射配置
- 避免在映射过程中执行复杂逻辑
- 对于简单映射，考虑使用手动映射

## 4. 注意事项

- 避免过度使用AutoMapper，简单的映射可以考虑直接赋值
- 注意循环引用问题，使用`PreserveReferences()`处理
- 在单元测试中验证映射配置
- 定期审查和优化映射配置

## 5. 处理循环引用

```csharp
CreateMap<User, UserDto>()
    .PreserveReferences();
```

## 6. 空值处理

```csharp
CreateMap<SourceModel, DestinationModel>()
    .ForMember(dest => dest.FullName, 
        opt => opt.MapFrom(src => src.Name ?? "Unknown"));
```

# 总结

AutoMapper是一个强大的对象映射工具，合理使用可以显著提高开发效率。但在使用时需要注意：

1. 理解其工作原理和配置方式
2. 合理组织映射配置
3. 注意性能影响
4. 做好测试验证

通过本文的介绍，相信你已经掌握了AutoMapper的基本用法和高级特性，可以在实际项目中灵活运用。
