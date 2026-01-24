---
title: linq
date: 2025-04-23
category:
  - DotNet
---

LINQ 全称是 Language Integrated Query，它把查询语言集成到 .NET 编程语言中，比如 C# 或 VB.NET。LINQ 主要目的是简化数据查询，让你能在代码中像写 SQL 一样操作各种数据源。

## 基本形式

### 方法语法（Method Syntax）

```csharp
var result = people.Where(p => p.Age > 18).OrderBy(p => p.Name).ToList();

```

|操作符 | 说明 | 示例|
|---|---|---|
|Where | 过滤 | Where(p => p.Age > 18)|
|Select | 投影（选择字段） | Select(p => p.Name)|
|OrderBy | 升序排序 | OrderBy(p => p.Name)|
|OrderByDescending | 降序排序 | OrderByDescending(p => p.Age)|
|GroupBy | 分组 | GroupBy(p => p.Gender)|
|Join | 联接（类似 SQL 的 JOIN） | Join(inner, key1, key2, (x, y) => new {...})|
|Distinct | 去重 | Distinct()|
|Any / All | 存在/全部满足 | Any(p => p.Age > 18) / All(p => p.Age > 18)|
|FirstOrDefault | 取第一个元素 | FirstOrDefault()|
|ToList / ToArray | 转换为集合 | ToList() / ToArray()|

```csharp
public class Person {
    public string Name { get; set; }
    public int Age { get; set; }
}

var people = new List<Person> {
    new Person { Name = "Tom", Age = 25 },
    new Person { Name = "Jerry", Age = 17 },
    new Person { Name = "Anna", Age = 30 }
};

// 获取年龄大于18的人的名字
var names = people
            .Where(p => p.Age > 18)
            .OrderBy(p => p.Name)
            .Select(p => p.Name)
            .ToList();

```

### 查询语法（Query Syntax）

```csharp
var result = from p in people
             where p.Age > 18
             orderby p.Name
             select p;
```
