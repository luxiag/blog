---
title: 配置系统
date: 2022-10-07
category:
  - .Net
---

# Json文件配置

- 创建一个json文件，例如test.json,右键设置“如果较新则复制”
- NuGet安装Microsoft.Extensions.Configuration和Microsoft.Extensions.Configuration.Json

`test.json`
```json
{   
    "port":8080,
    
    "proxy":{
       "address": "https://example.com",
       "class":{
        "className":"red"
       }
    }
}

```

`xxx.cs`
```cs
using Microsoft.Extensions.Configuration;
static void Main(string[] args) {
    ConfigurationBuilder configBuilder = new ConfigurationBuilder();
    //optional参数:表示文件是否可选，初学时，建议optional设置为false，这样写错了的话能够及时发现。
    //reloadOnChange参数：表示如果文件修改了，是否重新加载配置
    configBuilder.AddJsonFile("config.json", optional: false, reloadOnChange: false);
    IConfigurationRoot config = configBuilder.Build();

    //json的单结构读取
    string port = config["port"];
    Console.WriteLine($"port={port}");

    //json的多级结构采用proxy:address
    string proxyAddress = config.GetSection("proxy:address").Value;
    string className=config.GetSection("proxy:class:className").Value;
    Console.WriteLine($"Address:{proxyAddress}");
    Console.WriteLine($"ClassName:{className}");
}

```

**绑定读取JSON方式**

- NuGet安装：Microsoft.Extensions.Configuration.Binder

`xxx.cs`
```cs
class Config {
    public int port {get;set;}
    public Proxy Proxy {get;set;}
}

class Proxy {
    public string address {get;set;}
 
}

static void Main(string[] args) {
    ConfigurationBuilder configBuilder = new ConfigurationBuilder();
    //optional参数:表示文件是否可选，初学时，建议optional设置为false，这样写错了的话能够及时发现。
    //reloadOnChange参数：表示如果文件修改了，是否重新加载配置
    configBuilder.AddJsonFile("config.json", optional: false, reloadOnChange: false);
    IConfigurationRoot configRoot = configBuilder.Build();

    //
    Proxy proxy = configRoot.GetSection("proxy").Get<Proxy>();
    Console.WriteLine($"{proxy.address}");

    //多级结构
    Config config = configRoot.Get<config>();
    Console.WriteLine(config.Name)
 
}

```