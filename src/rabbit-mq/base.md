---
title: RabbitMQ 基础
date: 2025-03-30
category:
  - DotNet
type:
  - RabbitMQ  
---
RabbitMQ 是一个实现了 AMQP 协议的消息队列，AMQP 被定义为作为消息传递中间件的开放标准的应用层协议。它代表高级消息队列协议，具有消息定位、路由、队列、安全性和可靠性等特点。

RabbitMQ 的优点、用途等，大概是可靠性高、灵活的路由规则配置、支持分布式部署、遵守 AMQP 协议等。可以用于异步通讯、日志收集(日志收集还是 Kafka 比较好)、事件驱动架构系统、应用通讯解耦等

特点

- 持多种消息传递协议、消息队列、传递确认、灵活的队列路由、多种交换类型(交换器)。

- 支持 Kubernetes 等分布式部署，提供多种语言的 SDK，如 Java、Go、C#。

- 可插入的身份验证、授权，支持 TLS 和 LDAP。

- 支持持续集成、操作度量和与其他企业系统集成的各种工具和插件。

- 提供一套用于管理和监视 RabbitMQ 的 HTTP-API、命令行工具和 UI。

## MQ是什么

## 为什么要用MQ

- 高并发的流量削峰
举个例子，假设某订单系统每秒最多能处理一万次订单，也就是最多承受的10000qps，这个处理能力应付正常时段的下单时绰绰有余，正常时段我们下单一秒后就能返回结果。但是在高峰期，如果有两万次下单操作系统是处理不了的，只能限制订单超过一万后不允许用户下单。使用消息队列做缓冲，我们可以取消这个限制，把一秒内下的订单分散成一段时间来处理，这时有些用户可能在下单十几秒后才能收到下单成功的操作，但是比不能下单的体验要好。

![](./images/base/1122171745299754136.png)

- 应用解耦

以电商应用为例，应用中有订单系统、库存系统、物流系统、支付系统。用户创建订单后，如果耦合调用库存系统、物流系统、支付系统，任何一个子系统出了故障，都会造成下单操作异常。当转变成基于消息队列的方式后，系统间调用的问题会减少很多，比如物流系统因为发生故障，需要几分钟来修复。在这几分钟的时间里，物流系统要处理的内存被缓存在消息队列中，用户的下单操作可以正常完成。当物流系统恢复后，继续处理订单信息即可，中单用户感受不到物流系统的故障，提升系统的可用性。

![](./images/base/1122171745321537572.png)

- 异步处理

例如 A 调用 B，B 需要花费很长时间执行，但是 A 需要知道 B 什么时候可以执行完，以前一般有两种方式，A 过一段时间去调用 B 的查询 api 查询。或者 A 提供一个 callback api， B 执行完之后调用 api 通知 A 服务。这两种方式都不是很优雅，使用消息队列，可以很方便解决这个问题，A 调用 B 服务后，只需要监听 B 处理完成的消息，当 B 处理完成后，会发送一条消息给 MQ，MQ 会将此消息转发给 A 服务。

![](./images/base/1122171745321691076.png)

- 分布式事务

传统的方式为单体应用，支付、修改订单状态、创建物流订单三个步骤集成在一个服务中，因此这三个步骤可以放在一个jdbc事务中，要么全成功，要么全失败。而在微服务的环境下，会将三个步骤拆分成三个服务，例如：支付服务，订单服务，物流服务。三者各司其职，相互之间进行服务间调用，但这会带来分布式事务的问题，因为三个步骤操作的不是同一个数据库，导致无法使用jdbc事务管理以达到一致性。而 MQ 能够很好的帮我们解决分布式事务的问题，有一个比较容易理解的方案，就是二次提交。基于MQ的特点，MQ作为二次提交的中间节点，负责存储请求数据，在失败的情况可以进行多次尝试，或者基于MQ中的队列数据进行回滚操作，是一个既能保证性能，又能保证业务一致性的方案

![](./images/base/1122171745323376735.png)

- 数据分发

MQ 具有发布订阅机制，不仅仅是简单的上游和下游一对一的关系，还有支持一对多或者广播的模式，并且都可以根据规则选择分发的对象。
![](./images/base/1122171745323392517.png)

## RabbitMQ的架构

### 工作原理

![](./images/base/1122171745323770548.png)

生产者（Producer）
生产者是发送消息的客户端应用。在图中，有两个生产者，它们通过各自的连接（Connection）和通道（Channel）与 RabbitMQ 服务器进行通信。

连接（Connection）
连接是生产者和消费者与 RabbitMQ 服务器之间的 TCP 连接。一个客户端可以建立多个连接，每个连接可以包含多个通道。

通道（Channel）
通道是连接中的一个虚拟通道，用于在客户端和服务器之间发送和接收消息。一个连接可以包含多个通道，每个通道可以独立发送和接收消息。通道是线程安全的，可以提高通信效率。

交换器（Exchange）
交换器是 RabbitMQ 中的一个核心组件，它接收生产者发送的消息，并根据一定的规则将消息路由到一个或多个队列中。图中有两个交换器，每个交换器可以连接到多个队列。

队列（Queue）
队列是存储消息的容器，消息在队列中等待被消费者消费。图中有多个队列，每个队列可以接收来自一个或多个交换器的消息。

绑定（Binding）
绑定是交换器和队列之间的连接关系，它定义了消息如何从交换器路由到队列。绑定时，可以指定路由键（Routing Key）或主题模式（Binding Key），具体取决于交换器的类型。

消费者（Consumer）
消费者是接收消息的客户端应用。消费者通过各自的连接和通道从队列中获取消息并处理。图中有两个消费者，它们通过各自的连接和通道与 RabbitMQ 服务器进行通信。

工作流程

1. 生产者通过通道将消息发送到交换器。
2. 交换器根据绑定关系将消息路由到一个或多个队列。
3. 消费者通过通道从队列中获取消息并处理。

### 核心概念

![](./images/base/1122171745324528565.png)

- 生产者：产生数据发送消息的程序是生产者。
- 交换机：交换机是 RabbitMQ 非常重要的一个部件，一方面它接收来自生产者的消息，另一方面它将消息推送到队列中。交换机必须确切知道如何处理它接收到的消息，是将这些消息推送到特定队列还是推送到多个队列，亦或者是把消息丢弃，这个是由交换机类型决定的。- 队列：队列是 RabbitMQ 内部使用的一种数据结构，尽管消息流经 RabbitMQ 和应用程序，但它们只能存储在队列中。队列仅受主机的内存和磁盘限制的约束，本质上是一个大的消息缓冲区。许多生产者可以将消息发送到一个队列，许多消费者可以尝试从一个队列接收数据。
- 消费者：消费与接收具有相似的含义。消费者大多时候是一个等待接收消息的程序。请注意生产者，消费者和消息中间件很多时候并不在同一机器上。同一个应用程序既可以是生产者又是可以是消费者。

## 常用API

|用法 | 方法 | 说明|
|---|---|---|
|创建连接 | ConnectionFactory.CreateConnection() | 建立 TCP 连接|
|创建通道 | IConnection.CreateModel() | 建立操作通道|
|声明队列 | IModel.QueueDeclare() | 确保队列存在|
|发送消息 | IModel.BasicPublish() | 发布消息到队列或交换机|
|消费消息 | IModel.BasicConsume() | 注册消费者|
|确认消息 | IModel.BasicAck() | 手动确认（可选）|

```csharp
public class RabbitMqOptions
{
    public string HostName { get; set; } = "localhost";
    public string UserName { get; set; } = "guest";
    public string Password { get; set; } = "guest";
    public string QueueName { get; set; } = "order_created";
}

public interface IRabbitMqHelper
{
    void Publish<T>(T message);
    void Consume<T>(Action<T> onMessageReceived);
}

public class RabbitMqHelper : IRabbitMqHelper, IDisposable
{
    private readonly IConnection _connection;
    private readonly IModel _channel;
    private readonly RabbitMqOptions _options;

    public RabbitMqHelper(IConfiguration config)
    {
        _options = config.GetSection("RabbitMQ").Get<RabbitMqOptions>() ?? new();

        var factory = new ConnectionFactory
        {
            HostName = _options.HostName,
            UserName = _options.UserName,
            Password = _options.Password
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        _channel.QueueDeclare(
            queue: _options.QueueName,
            durable: true,
            exclusive: false,
            autoDelete: false,
            arguments: null
        );
    }

    public void Publish<T>(T message)
    {
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        _channel.BasicPublish(
            exchange: "",
            routingKey: _options.QueueName,
            basicProperties: null,
            body: body
        );
    }

    public void Consume<T>(Action<T> onMessageReceived)
    {
        var consumer = new EventingBasicConsumer(_channel);

        consumer.Received += (model, ea) =>
        {
            var json = Encoding.UTF8.GetString(ea.Body.ToArray());
            var obj = JsonSerializer.Deserialize<T>(json);
            if (obj != null)
                onMessageReceived(obj);
        };

        _channel.BasicConsume(
            queue: _options.QueueName,
            autoAck: true,
            consumer: consumer
        );
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}
```

## 队列

### 死信队列

死信指的是无法被正常消费的消息，RabbitMQ 会自动把它投递到一个“死信队列”里，以便你后续处理。

|场景 | 说明|
|---|---|
|❌ 消息被拒绝（Nack/Requeue = false） | 消费者明确拒收|
|⏱️ 消息过期（TTL 到期） | 设置了 TTL，未及时消费|
|📦 队列已满（max-length 限制） | 队列超过最大消息数量|

```text
[Producer] 
   ↓
[Delay Queue (TTL = 30s, DLX = real.exchange)]
   ↓ (30s later)
[Dead Letter → real.exchange → real.queue]
   ↓
[Consumer]
```

```csharp
var args = new Dictionary<string, object>
{
    { "x-dead-letter-exchange", "dlx.exchange" },             // 死信交换机
    { "x-dead-letter-routing-key", "dlx.routing.key" }        // 死信消息的路由键
};

_channel.QueueDeclare("normal.queue", durable: true, exclusive: false, autoDelete: false, arguments: args);

_channel.ExchangeDeclare("dlx.exchange", ExchangeType.Direct, durable: true);
_channel.QueueDeclare("dlx.queue", durable: true, exclusive: false, autoDelete: false);
_channel.QueueBind("dlx.queue", "dlx.exchange", "dlx.routing.key");

```

### 延时队列

#### 使用 x-delayed-message 插件

1.安装插件

```bash
rabbitmq-plugins enable rabbitmq_delayed_message_exchange
```

2.声明延迟交换机和队列（C#）

```csharp
_channel.ExchangeDeclare("delay-exchange", type: "x-delayed-message", durable: true, autoDelete: false,
    arguments: new Dictionary<string, object> { { "x-delayed-type", "direct" } });

_channel.QueueDeclare("delay-queue", durable: true, exclusive: false, autoDelete: false);

_channel.QueueBind("delay-queue", "delay-exchange", "delay-key");
```

3.发送延迟消息（C#）

```csharp
var props = _channel.CreateBasicProperties();
props.Headers = new Dictionary<string, object>
{
    { "x-delay", delayMs } // 以毫秒为单位设置延迟时间
};

_channel.BasicPublish("delay-exchange", "delay-key", props, body);
```

```csharp
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

public class RabbitMqHelper : IDisposable
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    private const string ExchangeName = "delay-exchange";
    private const string QueueName = "delay-queue";
    private const string RoutingKey = "delay-key";

    public RabbitMqHelper(IConfiguration configuration)
    {
        var factory = new ConnectionFactory
        {
            HostName = configuration["RabbitMQ:Host"],
            Port = int.Parse(configuration["RabbitMQ:Port"] ?? "5672"),
            UserName = configuration["RabbitMQ:User"],
            Password = configuration["RabbitMQ:Password"]
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        // 声明延迟交换机
        _channel.ExchangeDeclare(ExchangeName, "x-delayed-message", durable: true, autoDelete: false,
            arguments: new Dictionary<string, object>
            {
                { "x-delayed-type", "direct" }
            });

        // 声明绑定队列
        _channel.QueueDeclare(QueueName, durable: true, exclusive: false, autoDelete: false);
        _channel.QueueBind(QueueName, ExchangeName, RoutingKey);
    }

    public void Publish<T>(T message)
    {
        PublishDelayed(message, delayMilliseconds: 0);
    }

    public void PublishDelayed<T>(T message, double delayMilliseconds)
    {
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));
        var props = _channel.CreateBasicProperties();
        props.DeliveryMode = 2; // persistent
        props.Headers = new Dictionary<string, object>
        {
            { "x-delay", (int)delayMilliseconds }
        };

        _channel.BasicPublish(
            exchange: ExchangeName,
            routingKey: RoutingKey,
            basicProperties: props,
            body: body
        );
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}
```

#### 死信队列 + TTL 延迟队列

```csharp
// Program.cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddSingleton<RabbitMqHelper>();
builder.Services.AddHostedService<DelayedConsumer>();

var app = builder.Build();
app.MapControllers();
app.Run();

// appsettings.json
{
  "RabbitMQ": {
    "Host": "localhost",
    "User": "guest",
    "Password": "guest"
  }
}

// Helpers/RabbitMqHelper.cs
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

public class RabbitMqHelper
{
    private readonly IConnection _connection;
    private readonly IModel _channel;

    public RabbitMqHelper(IConfiguration config)
    {
        var factory = new ConnectionFactory
        {
            HostName = config["RabbitMQ:Host"],
            UserName = config["RabbitMQ:User"],
            Password = config["RabbitMQ:Password"]
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();
        SetupQueues();
    }

    private void SetupQueues()
    {
        _channel.ExchangeDeclare("real.exchange", ExchangeType.Direct, durable: true);
        _channel.QueueDeclare("real.queue", durable: true, exclusive: false, autoDelete: false);
        _channel.QueueBind("real.queue", "real.exchange", "real.key");

        var args = new Dictionary<string, object>
        {
            { "x-dead-letter-exchange", "real.exchange" },
            { "x-dead-letter-routing-key", "real.key" }
        };
        _channel.QueueDeclare("delay.queue", durable: true, exclusive: false, autoDelete: false, arguments: args);
    }

    public void PublishWithDelay<T>(T message, int delayMs)
    {
        var props = _channel.CreateBasicProperties();
        props.DeliveryMode = 2;
        props.Expiration = delayMs.ToString();

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

        _channel.BasicPublish(
            exchange: "",
            routingKey: "delay.queue",
            basicProperties: props,
            body: body
        );
    }
}

// Consumers/DelayedConsumer.cs
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

public class DelayedConsumer : BackgroundService
{
    private readonly IConfiguration _config;

    public DelayedConsumer(IConfiguration config)
    {
        _config = config;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = _config["RabbitMQ:Host"],
            UserName = _config["RabbitMQ:User"],
            Password = _config["RabbitMQ:Password"]
        };

        var connection = factory.CreateConnection();
        var channel = connection.CreateModel();

        var consumer = new EventingBasicConsumer(channel);
        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var message = Encoding.UTF8.GetString(body);
            Console.WriteLine($"[Consumer] 接收到消息：{message} - 时间：{DateTime.Now:HH:mm:ss}");
        };

        channel.BasicConsume(queue: "real.queue", autoAck: true, consumer: consumer);
        return Task.CompletedTask;
    }
}

// Controllers/MessageController.cs
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/[controller]")]
public class MessageController : ControllerBase
{
    private readonly RabbitMqHelper _mq;

    public MessageController(RabbitMqHelper mq)
    {
        _mq = mq;
    }

    [HttpPost("send")]
    public IActionResult Send(string content, int delaySeconds = 10)
    {
        var payload = new
        {
            Content = content,
            CreatedAt = DateTime.Now.ToString("yyyy-MM-dd HH:mm:ss")
        };

        _mq.PublishWithDelay(payload, delaySeconds * 1000);
        return Ok($"消息将延迟 {delaySeconds} 秒后投递");
    }
}

```

### 优先级队列

RabbitMQ 支持为队列和消息设置优先级。消息会根据优先级先入队，但只有在消费前才起效：

队列要声明支持最大优先级（比如 10）

每条消息可设置 priority 值（范围 0 ~ max，默认是 0）

```csharp
// 1️⃣ 声明支持优先级的队列
var args = new Dictionary<string, object>
{
    { "x-max-priority", 10 } // 支持 0 ~ 10 级优先级
};

_channel.QueueDeclare(queue: "priority.queue",
                      durable: true,
                      exclusive: false,
                      autoDelete: false,
                      arguments: args);
// 2️⃣ 发布消息时设置 priority
var props = _channel.CreateBasicProperties();
props.Priority = 9; // VIP = 高优先级（建议 5 以上）

_channel.BasicPublish(
    exchange: "", // 直连默认交换机
    routingKey: "priority.queue",
    basicProperties: props,
    body: Encoding.UTF8.GetBytes("VIP message"));

//   消费者按正常方式消费即可（RabbitMQ 会自动先投递高优先级消息）
var consumer = new EventingBasicConsumer(_channel);
consumer.Received += (model, ea) =>
{
    var body = ea.Body.ToArray();
    var message = Encoding.UTF8.GetString(body);
    Console.WriteLine($"收到消息：{message}");
};

_channel.BasicConsume("priority.queue", true, consumer);


public void PublishWithPriority<T>(T message, int priority)
{
    var props = _channel.CreateBasicProperties();
    props.Priority = (byte)Math.Clamp(priority, 0, 10);

    var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

    _channel.BasicPublish(
        exchange: "",
        routingKey: "priority.queue",
        basicProperties: props,
        body: body
    );
}
```

## 示例场景：订单系统 → 支付系统

- Order.API：用户创建订单，发送消息到 order_created 队列。

- Payment.API：监听 order_created 队列，当检测到有新订单创建时，模拟自动发起支付。

```bash
RabbitMqDemo/
├── Order.API/        # 订单服务：Controller 中发送消息
├── Payment.API/      # 支付服务：Controller 启动监听或调用消费者
├── Shared/           # 共享模型：OrderMessage
```

### Order.API

`Shared/Models/OrderMessage.cs`

```csharp
namespace Shared.Models;

public class OrderMessage
{
    public string OrderId { get; set; } = string.Empty;
    public decimal Amount { get; set; }
    public DateTime CreatedTime { get; set; }
}

```

`Order.API/Services/RabbitMqService.cs`

```csharp

using RabbitMQ.Client;
using Shared.Models;
using System.Text;
using System.Text.Json;

namespace Order.API.Services;

public interface IRabbitMqService
{
    void PublishOrder(OrderMessage message);
}

public class RabbitMqService : IRabbitMqService
{
    private readonly IConfiguration _config;

    public RabbitMqService(IConfiguration config)
    {
        _config = config;
    }

    public void PublishOrder(OrderMessage message)
    {
        var factory = new ConnectionFactory
        {
            HostName = _config["RabbitMQ:HostName"] ?? "localhost"
        };

        using var connection = factory.CreateConnection();
        using var channel = connection.CreateModel();

        channel.QueueDeclare(queue: "order_created",
                             durable: true,
                             exclusive: false,
                             autoDelete: false,
                             arguments: null);

        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

        channel.BasicPublish(exchange: "",
                             routingKey: "order_created",
                             basicProperties: null,
                             body: body);
    }
}
```

`Order.API/Program.cs`

```csharp
var app = builder.Build();
builder.Services.AddScoped<IRabbitMqService, RabbitMqService>();
```

`Order.API/Controllers/OrderController.cs`

```csharp

using Microsoft.AspNetCore.Mvc;
using Order.API.Services;
using Shared.Models;

namespace Order.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class OrderController : ControllerBase
{
    private readonly IRabbitMqService _rabbitMqService;

    public OrderController(IRabbitMqService rabbitMqService)
    {
        _rabbitMqService = rabbitMqService;
    }

    [HttpPost]
    public IActionResult CreateOrder([FromBody] OrderMessage order)

    {
        order.CreatedTime = DateTime.UtcNow;
        _rabbitMqService.PublishOrder(order);
        return Ok(new { Message = "订单已创建并发送到消息队列", Order = order });
    }
}
```

### Payment.API

**Controller监听**
`Payment.API/Controllers/PaymentController.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using Payment.API.Services;

namespace Payment.API.Controllers;

[ApiController]
[Route("api/[controller]")]
public class PaymentController : ControllerBase
{
    private readonly OrderConsumerService _consumer;

    public PaymentController(OrderConsumerService consumer)
    {
        _consumer = consumer;
    }

    [HttpGet("listen")]
    public IActionResult Listen()
    {
        _consumer.Start(); // 启动 RabbitMQ 消息监听
        return Ok("支付服务已开始监听订单队列...");
    }
}
```

**BackgroundService 实现后台监听**
`Payment.API/Services/OrderConsumerService.cs`

```csharp
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using Shared.Models;
using System.Text;
using System.Text.Json;

namespace Payment.API.Services;

public class OrderConsumerBackgroundService : BackgroundService
{
    private readonly IConfiguration _config;
    private readonly ILogger<OrderConsumerBackgroundService> _logger;

    public OrderConsumerBackgroundService(IConfiguration config, ILogger<OrderConsumerBackgroundService> logger)
    {
        _config = config;
        _logger = logger;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = _config["RabbitMQ:HostName"] ?? "localhost"
        };

        var connection = factory.CreateConnection();
        var channel = connection.CreateModel();

        channel.QueueDeclare(queue: "order_created",
                             durable: true,
                             exclusive: false,
                             autoDelete: false,
                             arguments: null);

        _logger.LogInformation("📦 BackgroundService 启动中，监听订单队列...");

        var consumer = new EventingBasicConsumer(channel);

        consumer.Received += (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var json = Encoding.UTF8.GetString(body);
            var order = JsonSerializer.Deserialize<OrderMessage>(json);

            _logger.LogInformation($"💰 后台服务收到订单：{order?.OrderId} 金额：{order?.Amount} 创建时间：{order?.CreatedTime}");
        };

        channel.BasicConsume(queue: "order_created",
                             autoAck: true,
                             consumer: consumer);

        return Task.CompletedTask;
    }
}
```

`Payment.API`

```csharp
var app = builder.Build();
 builder.Services.AddHostedService<OrderConsumerBackgroundService>();
 
```

## 示例场景：定时推送

```bash
├── Controllers/
│   └── ReminderController.cs     # 提供创建推送任务的接口
├── Services/
│   ├── RabbitMqHelper.cs        # 延迟消息发布封装
│   ├── ReminderScheduler.cs     # 后台定时任务调度器
│   └── SignalRHub.cs            # 推送 SignalR 通知
├── Models/
│   └── ScheduledMessage.cs      # 推送任务实体模型
├── Data/
│   └── ReminderDbContext.cs     # EF Core 数据库上下文
├── appsettings.json             # 包含 RabbitMQ 配置
└── Program.cs                   # 注册服务/配置/启动后台服务
```

流程

```mermaid
sequenceDiagram
User ->> Reminder.API: 提交提醒任务（时间+内容）
Reminder.API ->> DB: 保存 ScheduledMessage
ReminderScheduler ->> DB: 每分钟查找近期待推送任务
ReminderScheduler ->> RabbitMQ: 延迟发布消息（x-delay）
RabbitMQ ->> ConsumerService: 时间到达后投递
ConsumerService ->> SignalRHub: 推送消息给指定用户
```

package包

```bash
dotnet add package Pomelo.EntityFrameworkCore.MySql
dotnet add package Microsoft.EntityFrameworkCore.Design
dotnet add package RabbitMQ.Client
```

`program.cs`

```csharp
builder.Services.AddDbContext<ReminderDbContext>(options =>
{
    options.UseMySql(
        builder.Configuration.GetConnectionString("MySQL"),
        new MySqlServerVersion(new Version(8, 0, 34))
    );
});
builder.Services.AddSingleton<RabbitMqHelper>();
// appsettings.json
{
  "ConnectionStrings": {



  }
}
```

### Models

`Models/ScheduledMessage.cs`

```csharp
public class ScheduledMessage
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public string UserId { get; set; } = null!;     // 接收用户
    public string Content { get; set; } = null!;    // 消息内容

    public DateTime ScheduledTime { get; set; }     // 计划推送时间（UTC）
    public bool IsSent { get; set; } = false;       // 是否已发送
}
```

`Models/CreateReminderRequest.cs`

```csharp
public class CreateReminderRequest
{
    public string UserId { get; set; } = null!;
    public string Content { get; set; } = null!;
    public DateTime ScheduledTime { get; set; }  // 请以 UTC 提交
}
```

### Data

`Data/ReminderDbContext.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Reminder.API.Models;

public class ReminderDbContext : DbContext
{
    public ReminderDbContext(DbContextOptions<ReminderDbContext> options)
        : base(options) { }

    public DbSet<ScheduledMessage> ScheduledMessages => Set<ScheduledMessage>();
}
```

### Controllers

`Controllers/ReminderController.cs`

```csharp
using Microsoft.AspNetCore.Mvc;
using Reminder.API.Models;
using Reminder.API.Data;

[ApiController]
[Route("api/[controller]")]
public class ReminderController : ControllerBase
{
    private readonly ReminderDbContext _db;

    public ReminderController(ReminderDbContext db)
    {
        _db = db;
    }

    [HttpPost]
    public async Task<IActionResult> CreateReminder([FromBody] CreateReminderRequest request)
    {
        var message = new ScheduledMessage
        {
            UserId = request.UserId,
            Content = request.Content,
            ScheduledTime = request.ScheduledTime.ToUniversalTime()
        };

        _db.ScheduledMessages.Add(message);
        await _db.SaveChangesAsync();

        return Ok(new { message.Id, Status = "Scheduled" });
    }
}
```

### Services

`Services/RabbitMqHelper.cs`

```csharp
using RabbitMQ.Client;
using System.Text;
using System.Text.Json;

public class RabbitMqHelper : IDisposable
{
    private readonly IModel _channel;
    private readonly IConnection _connection;

    private const string ExchangeName = "reminder.delay.exchange";
    private const string QueueName = "reminder.delay.queue";
    private const string RoutingKey = "reminder";

    public RabbitMqHelper(IConfiguration config)
    {
        var factory = new ConnectionFactory
        {
            HostName = config["RabbitMQ:Host"],
            Port = int.Parse(config["RabbitMQ:Port"] ?? "5672"),
            UserName = config["RabbitMQ:User"],
            Password = config["RabbitMQ:Password"]
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        // 创建延迟交换机（需要启用 rabbitmq_delayed_message_exchange 插件）
        _channel.ExchangeDeclare(ExchangeName, "x-delayed-message", durable: true, autoDelete: false, arguments: new Dictionary<string, object>
        {
            { "x-delayed-type", "direct" }
        });

        _channel.QueueDeclare(QueueName, durable: true, exclusive: false, autoDelete: false);
        _channel.QueueBind(QueueName, ExchangeName, RoutingKey);
    }

    public void PublishDelayed<T>(T message, double delayMs)
    {
        var body = Encoding.UTF8.GetBytes(JsonSerializer.Serialize(message));

        var props = _channel.CreateBasicProperties();
        props.Headers = new Dictionary<string, object>
        {
            { "x-delay", delayMs }
        };

        _channel.BasicPublish(
            exchange: ExchangeName,
            routingKey: RoutingKey,
            basicProperties: props,
            body: body
        );
    }

    public void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
    }
}


```

`Services/ReminderScheduler.cs`

```csharp
using Microsoft.EntityFrameworkCore;
using Reminder.API.Data;
using Reminder.API.Models;

public class ReminderScheduler : BackgroundService
{
    private readonly IServiceScopeFactory _scopeFactory;
    private readonly RabbitMqHelper _rabbitMqHelper;
    private readonly ILogger<ReminderScheduler> _logger;

    public ReminderScheduler(IServiceScopeFactory scopeFactory, RabbitMqHelper rabbitMqHelper, ILogger<ReminderScheduler> logger)
    {
        _scopeFactory = scopeFactory;
        _rabbitMqHelper = rabbitMqHelper;
        _logger = logger;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("⏰ ReminderScheduler started");

        while (!stoppingToken.IsCancellationRequested)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<ReminderDbContext>();

                var now = DateTime.UtcNow;

                var upcomingMessages = await db.ScheduledMessages
                    .Where(m => !m.IsSent && m.ScheduledTime <= now.AddMinutes(1))
                    .ToListAsync(stoppingToken);

                foreach (var msg in upcomingMessages)
                {
                    var delay = (msg.ScheduledTime - now).TotalMilliseconds;
                    delay = Math.Max(0, delay);

                    _rabbitMqHelper.PublishDelayed(msg, delay);
                    msg.IsSent = true;
                    _logger.LogInformation("📨 发布延迟提醒消息: {Id}, 延迟: {Delay}ms", msg.Id, delay);
                }

                await db.SaveChangesAsync(stoppingToken);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "后台调度失败");
            }

            await Task.Delay(TimeSpan.FromSeconds(30), stoppingToken); // 每 30 秒检查一次
        }
    }
}
// program

builder.Services.AddHostedService<ReminderScheduler>();
```

`Services/ReminderConsumer.cs`

```csharp
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;
using System.Text.Json;
using Reminder.API.Models;
using Microsoft.AspNetCore.SignalR;

public class ReminderConsumer : BackgroundService
{
    private readonly IHubContext<SignalRHub> _hub;
    private readonly IConfiguration _config;
    private IConnection? _connection;
    private IModel? _channel;

    private const string ExchangeName = "reminder.delay.exchange";
    private const string QueueName = "reminder.delay.queue";
    private const string RoutingKey = "reminder";

    public ReminderConsumer(IHubContext<SignalRHub> hub, IConfiguration config)
    {
        _hub = hub;
        _config = config;
    }

    protected override Task ExecuteAsync(CancellationToken stoppingToken)
    {
        var factory = new ConnectionFactory
        {
            HostName = _config["RabbitMQ:Host"],
            Port = int.Parse(_config["RabbitMQ:Port"] ?? "5672"),
            UserName = _config["RabbitMQ:User"],
            Password = _config["RabbitMQ:Password"]
        };

        _connection = factory.CreateConnection();
        _channel = _connection.CreateModel();

        _channel.QueueDeclare(QueueName, durable: true, exclusive: false, autoDelete: false);

        var consumer = new EventingBasicConsumer(_channel);
        consumer.Received += async (model, ea) =>
        {
            var body = ea.Body.ToArray();
            var json = Encoding.UTF8.GetString(body);
            var msg = JsonSerializer.Deserialize<ScheduledMessage>(json);

            if (msg != null)
            {
                Console.WriteLine($"🔔 收到提醒消息: {msg.Content}");
                await _hub.Clients.User(msg.UserId).SendAsync("ReceiveReminder", msg.Content);
            }
        };

        _channel.BasicConsume(queue: QueueName, autoAck: true, consumer: consumer);

        return Task.CompletedTask;
    }

    public override void Dispose()
    {
        _channel?.Close();
        _connection?.Close();
        base.Dispose();
    }
}

```

## 参考

- [RabbitMQ超详细学习笔记（章节清晰+通俗易懂）](https://blog.csdn.net/qq_45173404/article/details/121687489)
- [万字长文：从 C# 入门学会 RabbitMQ 消息队列编程](https://www.cnblogs.com/whuanle/p/17837034.html)
- [RabbitMQ是什么？架构是怎么样的？](https://www.bilibili.com/video/BV1oCwEeVEe4/?spm_id_from=333.337.search-card.all.click&vd_source=b4222cc2ad9f3adc653a4768dbfd9b95)
