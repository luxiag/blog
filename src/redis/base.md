---
title: Redis 基础
icon: redis
date: 2025-04-24
category:
  - Redis
  - DotNet
tag:
  - Redis
---

Redis（Remote Dictionary Server）是一个开源、基于内存、支持多种数据结构的高性能**键值**存储数据库。

**使用场景**

|场景 | 用法简述|
|---|---|
|接口缓存 | key=接口参数，value=接口返回数据，设置 TTL，减少 DB 压力|
|用户 Session | key=sessionId, value=用户数据|
|分布式锁 | SET key value NX PX 过期时间|
|限流 | INCR 计数器 + EXPIRE 设置时间窗口|
|延迟队列 | ZADD + SCORE 设定时间戳，轮询执行|
|实时排行榜 | ZINCRBY 增加分数，ZRANGE 查询前 N 名|
|消息中间件替代品 | 使用 Stream、List 或 Pub/Sub 构建简单的异步消息系统|

## 数据类型

|数据类型 | 描述 / 场景 | 常用命令 | .NET 使用示例 (IDatabase)|
|---|---|---|---|
|String | 最基本的类型，存储任意文本或数字 | SET / GET / INCR / DECR | db.StringSet("key", "value");db.StringGet("key");|
|Hash | 键值对集合，适合用户对象等结构体 | HSET / HGET / HGETALL | db.HashSet("user:1", new HashEntry[] {...});|
|List | 双向链表，适合任务队列等顺序操作 | LPUSH / RPUSH / LPOP | db.ListLeftPush("queue", "task1");|
|Set | 无序集合，不重复，适合标签等 | SADD / SMEMBERS / SISMEMBER | db.SetAdd("tags", "redis");|
|Sorted Set | 带分数的有序集合，适合排行榜 | ZADD / ZRANGE / ZREVRANGE | db.SortedSetAdd("rank", "user1", 100);|
|Stream | 消息队列结构，支持持久化订阅等 | XADD / XREAD / XGROUP | db.StreamAdd("stream", "field", "value");|
|Bitmap | 位数组，适合签到、活跃状态 | SETBIT / GETBIT / BITCOUNT | db.StringSetBit("bitmap", 5, true);|
|HyperLogLog | 基数估算，适合UV统计 | PFADD / PFCOUNT | db.HyperLogLogAdd("uv", "user1");|
|Geo | 地理位置，适合LBS应用 | GEOADD / GEODIST / GEORADIUS | db.GeoAdd("location", new GeoEntry(...));|

### ✅ 1. String 类型

📌 用途：用于缓存字符串、数字、JSON 等。是 Redis 中最常用的数据结构

---

#### 🧠 方法一：`StringSet(key, value, expiry = null)`
>
> **作用：** 设置一个字符串键值，可以加过期时间。

```csharp
// 设置 key 为 name 的值为 Alice，有效期 10 分钟
db.StringSet("name", "Alice", TimeSpan.FromMinutes(10));
```

---

#### 🧠 方法二：`StringGet(key)`
>
> **作用：** 获取字符串键对应的值。

```csharp
string name = db.StringGet("name");
Console.WriteLine(name); // 输出: Alice
```

---

#### 🧠 方法三：`StringIncrement(key)`
>
> **作用：** 对一个数字字符串进行 +1 操作（适合计数器）。

```csharp
db.StringIncrement("views:article:123");
```

---

### ✅ 2. Hash 类型

📌 用途：类似对象/字典，适合表示用户信息、商品详情

---

#### 🧠 方法一：`HashSet(key, HashEntry[])`
>
> **作用：** 设置一个 Hash 对象（键值对集合）

```csharp
db.HashSet("user:1", new HashEntry[] {
    new HashEntry("name", "Alice"),
    new HashEntry("age", 30)
});
```

---

#### 🧠 方法二：`HashGet(key, field)`
>
> **作用：** 获取某个字段的值

```csharp
string name = db.HashGet("user:1", "name");
```

---

#### 🧠 方法三：`HashGetAll(key)`
>
> **作用：** 获取 Hash 中所有键值对

```csharp
var all = db.HashGetAll("user:1");
foreach (var item in all)
    Console.WriteLine($"{item.Name} = {item.Value}");
```

---

### ✅ 3. List 类型

📌 用途：实现任务队列、消息列表、聊天记录等

---

#### 🧠 方法一：`ListLeftPush(key, value)`
>
> **作用：** 从左边添加一个值（像栈/队列）

```csharp
db.ListLeftPush("chat:room:1", "hello");
```

---

#### 🧠 方法二：`ListRightPush(key, value)`
>
> **作用：** 从右边添加（像队列尾部）

```csharp
db.ListRightPush("chat:room:1", "how are you?");
```

---

#### 🧠 方法三：`ListLeftPop(key)`
>
> **作用：** 从左边取出一个值（消费消息）

```csharp
string message = db.ListLeftPop("chat:room:1");
```

---

### ✅ 4. Set 类型

📌 用途：标签、唯一集合、抽奖等（不允许重复）

---

#### 🧠 方法一：`SetAdd(key, value)`
>
> **作用：** 添加一个不重复的元素

```csharp
db.SetAdd("post:123:tags", "Redis");
```

---

#### 🧠 方法二：`SetMembers(key)`
>
> **作用：** 获取所有元素

```csharp
var tags = db.SetMembers("post:123:tags");
```

---

#### 🧠 方法三：`SetContains(key, value)`
>
> **作用：** 判断某值是否存在

```csharp
bool hasRedis = db.SetContains("post:123:tags", "Redis");
```

---

### ✅ 5. SortedSet（有序集合）

📌 用途：积分榜、投票榜、排行榜等

---

#### 🧠 方法一：`SortedSetAdd(key, value, score)`
>
> **作用：** 添加一个有分数的用户到排行榜

```csharp
db.SortedSetAdd("game:rank", "player1", 88.5);
```

---

#### 🧠 方法二：`SortedSetRangeByScoreWithScores(...)`
>
> **作用：** 按分数获取前 N 名

```csharp
var top = db.SortedSetRangeByScoreWithScores("game:rank", order: Order.Descending, take: 3);
foreach (var entry in top)
    Console.WriteLine($"{entry.Element}: {entry.Score}");
```

---

## 示例场景

### Redis限流器

限定每个用户每分钟只能访问某个接口 N 次

- 使用 Redis 的 StringIncrement 实现计数。

- 设定过期时间为 1 分钟。

- 如果计数 > 限制数，返回 429 Too Many Requests

`Services/RateLimiter.cs`

```csharp
public class RateLimiter
{
    private readonly IDatabase _redis;
    private readonly int _maxCount;
    private readonly TimeSpan _timeWindow;

    public RateLimiter(IConnectionMultiplexer redis, int maxCount, TimeSpan timeWindow)
    {
        _redis = redis.GetDatabase();
        _maxCount = maxCount;
        _timeWindow = timeWindow;
    }

    public async Task<bool> IsAllowedAsync(string key)
    {
        var count = await _redis.StringIncrementAsync(key);

        if (count == 1)
        {
            // 第一次请求时设置过期时间
            await _redis.KeyExpireAsync(key, _timeWindow);
        }

        return count <= _maxCount;
    }
}
```

`Program.cs`

```csharp
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect("localhost:6379"));

builder.Services.AddScoped(sp =>
{
    var redis = sp.GetRequiredService<IConnectionMultiplexer>();
    return new RateLimiter(redis, maxCount: 5, timeWindow: TimeSpan.FromMinutes(1));
});
```

`Controller`

```csharp
[ApiController]
[Route("api/[controller]")]
public class UploadController : ControllerBase
{
    private readonly RateLimiter _rateLimiter;

    public UploadController(RateLimiter rateLimiter)
    {
        _rateLimiter = rateLimiter;
    }

    [HttpPost]
    public async Task<IActionResult> Upload()
    {
        string userKey = $"rate_limit:user:{GetUserId()}";

        if (!await _rateLimiter.IsAllowedAsync(userKey))
        {
            return StatusCode(429, "Too many requests. Please wait a minute.");
        }

        // 执行上传逻辑
        return Ok("Upload successful!");
    }

    private string GetUserId()
    {
        // 可根据实际情况从 Token 或 Header 中获取用户标识
        return HttpContext.Connection.RemoteIpAddress?.ToString() ?? "anonymous";
    }
}

```

### 排行榜

`Services/LeaderboardService.cs`

```csharp
public class LeaderboardService
{
    private readonly IDatabase _redis;

    public LeaderboardService(IConnectionMultiplexer connection)
    {
        _redis = connection.GetDatabase();
    }

    // 添加或更新用户得分
    public async Task AddScoreAsync(string boardKey, string userId, double score)
    {
        await _redis.SortedSetAddAsync(boardKey, userId, score);
    }

    // 获取用户当前排名（0-based）
    public async Task<long?> GetRankAsync(string boardKey, string userId)
    {
        var rank = await _redis.SortedSetRankAsync(boardKey, userId, Order.Descending);
        return rank.HasValue ? rank.Value + 1 : null;
    }

    // 获取用户得分
    public async Task<double?> GetScoreAsync(string boardKey, string userId)
    {
        return await _redis.SortedSetScoreAsync(boardKey, userId);
    }

    // 获取前 N 名用户（降序）
    public async Task<List<(string userId, double score)>> GetTopAsync(string boardKey, int count)
    {
        var results = await _redis.SortedSetRangeByRankWithScoresAsync(
            boardKey, 0, count - 1, Order.Descending);

        return results.Select(x => (x.Element.ToString(), x.Score)).ToList();
    }
}
```

`Program.cs`

```csharp
builder.Services.AddSingleton<IConnectionMultiplexer>(
    ConnectionMultiplexer.Connect("localhost:6379"));

builder.Services.AddScoped<LeaderboardService>();

```

`Controller`

```csharp
[ApiController]
[Route("api/[controller]")]
public class LeaderboardController : ControllerBase
{
    private readonly LeaderboardService _leaderboard;
    private const string BoardKey = "game:leaderboard";

    public LeaderboardController(LeaderboardService leaderboard)
    {
        _leaderboard = leaderboard;
    }

    [HttpPost("score")]
    public async Task<IActionResult> AddScore(string userId, double score)
    {
        await _leaderboard.AddScoreAsync(BoardKey, userId, score);
        return Ok("Score added");
    }

    [HttpGet("rank")]
    public async Task<IActionResult> GetRank(string userId)
    {
        var rank = await _leaderboard.GetRankAsync(BoardKey, userId);
        var score = await _leaderboard.GetScoreAsync(BoardKey, userId);

        if (rank == null)
            return NotFound("User not found in leaderboard");

        return Ok(new { userId, rank, score });
    }

    [HttpGet("top")]
    public async Task<IActionResult> GetTop(int count = 10)
    {
        var top = await _leaderboard.GetTopAsync(BoardKey, count);
        return Ok(top);
    }
}

```
