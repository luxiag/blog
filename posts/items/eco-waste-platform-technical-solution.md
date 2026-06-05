# 环保固废综合管理平台 - 技术方案

## 文档信息

| 项目 | 内容 |
|------|------|
| 项目名称 | 环保固废综合管理平台（EcoWaste Platform） |
| 技术栈 | .NET 8 + Vue 3 + UniApp + IoT |
| 预期规模 | 小型起步（<50车辆，<100智能回收箱） |
| 部署方式 | 混合部署（核心私有化 + 云端IoT/大数据） |
| 客户端 | C端微信小程序 + 作业人员App |

---

## 一、业务全景与系统边界

### 1.1 四大业务线概览

```
┌─────────────────────────────────────────────────────────────────────────┐
│                        环保固废综合管理平台                                │
├────────────┬────────────┬──────────────┬───────────────────────────────────┤
│  业务一     │  业务二     │   业务三      │         业务四                    │
│  建筑垃圾   │  街道清运   │  智能回收箱   │      固废/危废处置                 │
│  上门回收   │  承包清扫   │  无人回收     │    填埋场运营管理                  │
├────────────┴────────────┴──────────────┴───────────────────────────────────┤
│                         共享服务层                                         │
│  车辆调度 │ 地磅称重 │ IoT网关 │ GIS地图 │ 工单系统 │ 计费结算 │ 视频监控    │
├─────────────────────────────────────────────────────────────────────────────┤
│                         基础设施层                                         │
│  消息队列 │ 缓存 │ 数据库 │ 对象存储 │ 日志 │ 监控告警                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

### 1.2 各业务线详细流程

#### 业务一：建筑垃圾上门回收

```
客户下单 → 平台接单 → 调度派单 → 司机/业务员接单 → 上门评估 
→ 装车（散货装卸） → 地磅称重 → 运输 → 卸货（堆场/填埋场） → 结算
```

**核心功能点：**
- C端小程序下单（拍照上传、预估量、选择时间段）
- 智能派单（就近原则 + 车辆载重匹配 + 司机工作量均衡）
- 作业全程GPS追踪
- 地磅进出场称重（毛重-皮重=净重）
- 电子联单（从产生到处置全链路追踪）

#### 业务二：街道垃圾清运承包

```
合同管理 → 排班计划 → 路线规划 → 作业执行（清扫+清运） 
→ 作业记录仪录制 → 巡检考核 → 工时统计 → 结算
```

**核心功能点：**
- 合同/标段管理（按街道/片区划分）
- 车辆路线规划与排班（定时清运 + 动态调度）
- 垃圾箱满溢监测（可选IoT传感器）
- 作业记录仪实时上传 + 回放
- 清扫人员GPS轨迹 + 电子围栏考勤
- 一键呼叫（作业人员与调度中心通话）
- 作业质量考核评分

#### 业务三：智能回收箱运营

```
设备投放 → 用户扫码投放 → 箱内识别称重 → 积分/现金返还 
→ 满箱预警 → 调度清运 → 分拣处理 → 数据分析
```

**核心功能点：**
- 回收箱远程管理（开关门、故障诊断、固件升级）
- 箱内摄像头：投放物识别（纸类/塑料/金属/织物）
- 箱内称重仪：精确计量
- 用户积分/现金账户体系
- GIS热力图分析（投放高峰时段、地区分布、品类偏好）
- 满箱预警 → 自动触发清运工单
- 设备运维管理（巡检、维修工单）

#### 业务四：填埋场/危废化废处置

```
危废申报 → 审批 → 五联单 → 专车运输 → 入场称重 
→ 暂存 → 处置（填埋/焚烧/化学处理） → 出场 → 台账记录
```

**核心功能点：**
- 危废经营许可证管理
- 电子五联单（产生→收集→运输→处置→监管）
- 填埋库容管理（剩余库容计算、分区管理）
- 危废暂存仓库管理（FIFO、相容性检查）
- 处置工艺记录
- 环境监测数据采集（渗滤液、气体排放等）
- 政府监管数据上报预留接口

---

## 二、系统架构设计

### 2.1 整体架构（模块化单体 + 事件驱动）

考虑到小型起步的规模，采用 **模块化单体架构（Modular Monolith）**，而非微服务。这样降低运维复杂度，同时通过模块边界清晰划分，未来可平滑拆分为微服务。

```
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway (YARP)                        │
│              路由、限流、认证、API版本管理                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐           │
│  │ 建筑垃圾 │ │ 街道清运  │ │ 智能回收  │ │ 固危废处置│           │
│  │  Module   │ │  Module  │ │  Module  │ │  Module  │           │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘           │
│       │             │            │             │                  │
│  ┌────┴─────────────┴────────────┴─────────────┴──────────┐     │
│  │              Shared Kernel（共享内核）                    │     │
│  │  调度引擎│地磅服务│IoT网关│GIS服务│工单│计费│通知│视频   │     │
│  └──────────────────────────────────────────────────────────┘     │
│                                                                    │
│  ┌────────────────────────────────────────────────────────────┐   │
│  │              Infrastructure Layer                           │   │
│  │  EF Core │ Redis │ RabbitMQ │ MinIO │ Serilog │ Hangfire   │   │
│  └────────────────────────────────────────────────────────────┘   │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 2.2 技术选型清单

| 层次 | 技术选型 | 说明 |
|------|----------|------|
| **后端框架** | .NET 8 + ASP.NET Core | LTS版本，性能优异 |
| **API风格** | RESTful + SignalR（实时推送） | 标准REST + WebSocket实时通信 |
| **API网关** | YARP (Yet Another Reverse Proxy) | 微软官方反向代理，.NET原生 |
| **ORM** | EF Core 8 + Dapper | EF Core做CRUD，Dapper做复杂查询 |
| **数据库** | PostgreSQL 16 + PostGIS | 主库，PostGIS支持地理空间查询 |
| **时序数据库** | TimescaleDB（PostgreSQL扩展） | IoT设备时序数据存储 |
| **缓存** | Redis 7 (StackExchange.Redis) | 分布式缓存、会话、排行榜 |
| **消息队列** | RabbitMQ + MassTransit | 事件驱动、异步解耦 |
| **任务调度** | Hangfire | 定时任务、延迟任务 |
| **对象存储** | MinIO（私有） + 阿里云OSS（公有） | 视频/图片存储 |
| **搜索引擎** | Elasticsearch（可选） | 日志、工单全文检索 |
| **实时通信** | SignalR | 调度看板、设备状态推送 |
| **身份认证** | IdentityServer / OpenIddict | OAuth2.0 + JWT |
| **地图服务** | 高德地图 API | 路线规划、地理编码、围栏 |
| **视频流** | ZLMediaKit / SRS | 流媒体服务器 |
| **前端管理后台** | Vue 3 + TypeScript + Ant Design Vue | 运营管理后台 |
| **移动端** | UniApp (Vue 3) | 一套代码编译小程序 + App |
| **容器化** | Docker + Docker Compose | 容器部署 |
| **CI/CD** | GitLab CI / GitHub Actions | 自动化流水线 |
| **监控** | Prometheus + Grafana + Serilog | 指标监控 + 日志 |

### 2.3 项目工程结构

```
EcoWaste/
├── src/
│   ├── EcoWaste.ApiGateway/                 # API网关（YARP）
│   ├── EcoWaste.Web.Host/                   # 主Web Host（模块加载）
│   │
│   ├── Modules/                             # 业务模块
│   │   ├── EcoWaste.Module.Construction/    # 业务一：建筑垃圾回收
│   │   │   ├── Domain/                      # 领域模型
│   │   │   ├── Application/                 # 应用服务
│   │   │   ├── Infrastructure/              # 基础设施实现
│   │   │   └── Api/                         # API控制器
│   │   │
│   │   ├── EcoWaste.Module.StreetCleaning/  # 业务二：街道清运
│   │   ├── EcoWaste.Module.SmartRecycling/  # 业务三：智能回收箱
│   │   └── EcoWaste.Module.HazWaste/       # 业务四：固危废处置
│   │
│   ├── Shared/                              # 共享服务
│   │   ├── EcoWaste.Shared.Dispatch/        # 车辆调度引擎
│   │   ├── EcoWaste.Shared.Weighbridge/     # 地磅称重服务
│   │   ├── EcoWaste.Shared.IoT/            # IoT设备网关
│   │   ├── EcoWaste.Shared.GIS/            # GIS地图服务
│   │   ├── EcoWaste.Shared.Video/          # 视频监控服务
│   │   ├── EcoWaste.Shared.WorkOrder/      # 工单引擎
│   │   ├── EcoWaste.Shared.Billing/        # 计费结算
│   │   └── EcoWaste.Shared.Notification/   # 通知服务（短信/推送/微信）
│   │
│   ├── Core/                                # 核心框架
│   │   ├── EcoWaste.Core.Domain/           # 领域基类、值对象
│   │   ├── EcoWaste.Core.Application/      # CQRS基类、中间件
│   │   └── EcoWaste.Core.Infrastructure/   # 基础设施抽象
│   │
│   └── Clients/                             # 客户端
│       ├── ecowaste-admin/                  # Vue3管理后台
│       ├── ecowaste-uniapp/                 # UniApp（小程序+App）
│       └── ecowaste-driver-app/             # 司机端App（UniApp）
│
├── tests/
│   ├── EcoWaste.UnitTests/
│   ├── EcoWaste.IntegrationTests/
│   └── EcoWaste.E2ETests/
│
├── deploy/
│   ├── docker-compose.yml
│   ├── docker-compose.override.yml
│   └── k8s/                                 # 未来K8s部署配置
│
└── docs/
    ├── api/                                  # API文档
    └── architecture/                         # 架构文档
```

---

## 三、共享服务详细设计

### 3.1 车辆调度引擎

这是四个业务共用的核心系统，负责车辆的实时追踪、智能派单和路线优化。

#### 3.1.1 架构设计

```csharp
// 调度引擎核心接口
public interface IDispatchEngine
{
    /// <summary>
    /// 智能派单 - 根据工单类型、位置、车辆状态自动分配
    /// </summary>
    Task<DispatchResult> AutoDispatch(DispatchRequest request);
    
    /// <summary>
    /// 手动派单
    /// </summary>
    Task<DispatchResult> ManualDispatch(string workOrderId, string vehicleId, string driverId);
    
    /// <summary>
    /// 获取车辆实时位置
    /// </summary>
    Task<VehicleLocation> GetVehicleRealTimeLocation(string vehicleId);
    
    /// <summary>
    /// 路线规划
    /// </summary>
    Task<RoutePlan> PlanRoute(RoutePlanRequest request);
    
    /// <summary>
    /// 获取调度看板数据
    /// </summary>
    Task<DispatchDashboard> GetDashboard(string tenantId);
}

// 派单请求
public record DispatchRequest
{
    public string WorkOrderId { get; init; }
    public WorkOrderType Type { get; init; }          // 建筑垃圾/街道清运/回收箱清运/危废转运
    public GeoPoint Location { get; init; }           // 作业地点
    public DateTime RequiredTime { get; init; }       // 要求到达时间
    public decimal? EstimatedWeight { get; init; }    // 预估重量（吨）
    public VehicleCategory RequiredVehicle { get; init; } // 所需车型
    public int Priority { get; init; }                // 优先级
}

// 派单算法策略
public enum DispatchStrategy
{
    NearestFirst,           // 就近优先
    LoadBalancing,          // 负载均衡
    MinimumCost,            // 最低成本
    PriorityBased           // 优先级驱动
}
```

#### 3.1.2 智能派单算法

```csharp
public class SmartDispatchService : IDispatchEngine
{
    private readonly IVehicleRepository _vehicleRepo;
    private readonly IMapService _mapService;
    private readonly IRedisCache _cache;

    public async Task<DispatchResult> AutoDispatch(DispatchRequest request)
    {
        // 1. 获取可用车辆列表（状态=空闲/待命，且符合车型要求）
        var availableVehicles = await _vehicleRepo.GetAvailable(
            request.RequiredVehicle, 
            request.RequiredTime);

        // 2. 计算每辆车到目标点的距离和预计到达时间
        var candidates = new List<DispatchCandidate>();
        foreach (var vehicle in availableVehicles)
        {
            var location = await GetVehicleRealTimeLocation(vehicle.Id);
            var route = await _mapService.CalculateRoute(location.Point, request.Location);
            
            candidates.Add(new DispatchCandidate
            {
                Vehicle = vehicle,
                Distance = route.Distance,
                EstimatedArrival = route.Duration,
                DriverWorkload = await GetDriverWorkload(vehicle.DriverId),
                FuelCost = CalculateFuelCost(route.Distance, vehicle.FuelConsumption)
            });
        }

        // 3. 综合评分排序
        var scored = candidates.Select(c => new
        {
            Candidate = c,
            Score = CalculateScore(c, request)
        })
        .OrderByDescending(x => x.Score)
        .ToList();

        // 4. 选择最优车辆
        var selected = scored.First().Candidate;
        
        // 5. 创建调度记录
        return await CreateDispatchRecord(request, selected);
    }

    private double CalculateScore(DispatchCandidate c, DispatchRequest request)
    {
        // 综合评分 = 距离分(40%) + 负载均衡分(30%) + 成本分(20%) + 时效分(10%)
        double distanceScore = 1.0 / (1 + c.Distance / 1000);       // 距离越近分越高
        double workloadScore = 1.0 / (1 + c.DriverWorkload);        // 工作量越少分越高
        double costScore = 1.0 / (1 + c.FuelCost);                  // 成本越低分越高
        double timeScore = c.EstimatedArrival <= request.RequiredTime 
            ? 1.0 : 0.5;                                            // 能否按时到达

        return distanceScore * 0.4 + workloadScore * 0.3 + 
               costScore * 0.2 + timeScore * 0.1;
    }
}
```

#### 3.1.3 车辆实时追踪

```csharp
// 车辆位置上报 - 通过MQTT接收GPS终端数据
public class VehicleTrackingConsumer : IConsumer<VehicleLocationReported>
{
    private readonly IHubContext<DispatchHub> _hubContext;
    private readonly IRedisCache _cache;
    private readonly TimeScaleDbContext _tsDb;

    public async Task Consume(ConsumeContext<VehicleLocationReported> context)
    {
        var msg = context.Message;
        
        // 1. 更新Redis中的实时位置（用于调度查询）
        await _cache.GeoAddAsync("vehicle:locations", 
            msg.Longitude, msg.Latitude, msg.VehicleId);
        
        // 2. 存入时序数据库（用于轨迹回放）
        await _tsDb.VehicleTrackPoints.AddAsync(new VehicleTrackPoint
        {
            VehicleId = msg.VehicleId,
            Longitude = msg.Longitude,
            Latitude = msg.Latitude,
            Speed = msg.Speed,
            Direction = msg.Direction,
            Timestamp = msg.Timestamp
        });

        // 3. 推送到调度看板（SignalR）
        await _hubContext.Clients.Group($"dispatch:{msg.TenantId}")
            .SendAsync("VehicleLocationUpdated", new
            {
                msg.VehicleId,
                msg.Longitude,
                msg.Latitude,
                msg.Speed
            });

        // 4. 电子围栏检测
        await CheckGeofence(msg);
    }
}
```

### 3.2 地磅称重系统

#### 3.2.1 称重流程

```
车辆到达 → 车牌识别 → 一次称重（毛重） → 装/卸货 → 二次称重（皮重） 
→ 计算净重 → 打印磅单 → 数据上传
```

#### 3.2.2 核心实现

```csharp
public class WeighbridgeService
{
    private readonly IWeighbridgeDevice _device;           // 地磅设备通信
    private readonly IPlateRecognitionService _plateOcr;   // 车牌识别
    private readonly ICameraService _camera;               // 监控抓拍
    
    /// <summary>
    /// 执行称重流程
    /// </summary>
    public async Task<WeighRecord> PerformWeighing(WeighingRequest request)
    {
        // 1. 车牌自动识别
        var plateResult = await _plateOcr.Recognize(request.CameraId);
        
        // 2. 读取地磅稳定重量
        var weight = await _device.ReadStableWeight(request.WeighbridgeId);
        
        // 3. 抓拍存证（前后左右4个角度）
        var snapshots = await _camera.CaptureMultiAngle(request.WeighbridgeId);
        
        // 4. 创建称重记录
        var record = new WeighRecord
        {
            Id = Guid.NewGuid().ToString(),
            PlateNumber = plateResult.PlateNumber,
            WeighbridgeId = request.WeighbridgeId,
            WeighType = request.WeighType, // FirstWeigh(毛重) / SecondWeigh(皮重)
            Weight = weight,
            Snapshots = snapshots,
            Timestamp = DateTime.UtcNow,
            OperatorId = request.OperatorId
        };

        // 5. 如果是二次称重，计算净重
        if (request.WeighType == WeighType.SecondWeigh)
        {
            var firstRecord = await GetFirstWeighRecord(plateResult.PlateNumber);
            record.NetWeight = Math.Abs(firstRecord.Weight - weight);
            record.FirstWeighId = firstRecord.Id;
            
            // 触发业务事件（可能触发计费、库存更新等）
            await _eventBus.Publish(new WeighingCompleted
            {
                RecordId = record.Id,
                PlateNumber = record.PlateNumber,
                NetWeight = record.NetWeight,
                WorkOrderId = request.WorkOrderId
            });
        }

        await _repository.SaveAsync(record);
        return record;
    }
}

// 地磅设备通信接口（支持不同品牌地磅）
public interface IWeighbridgeDevice
{
    /// <summary>
    /// 读取当前重量
    /// </summary>
    Task<decimal> ReadCurrentWeight(string deviceId);
    
    /// <summary>
    /// 读取稳定重量（等待数据稳定后返回）
    /// </summary>
    Task<decimal> ReadStableWeight(string deviceId, 
        int stabilityDurationMs = 3000, 
        decimal toleranceKg = 20);
    
    /// <summary>
    /// 零点校准
    /// </summary>
    Task Calibrate(string deviceId);
}

// 地磅串口通信实现（适用于大多数国产地磅）
public class SerialWeighbridgeDevice : IWeighbridgeDevice
{
    public async Task<decimal> ReadStableWeight(string deviceId, 
        int stabilityDurationMs = 3000, decimal toleranceKg = 20)
    {
        var readings = new List<decimal>();
        var startTime = DateTime.UtcNow;

        while (true)
        {
            var weight = await ReadCurrentWeight(deviceId);
            readings.Add(weight);

            // 检查最近N秒的读数是否稳定
            var recentReadings = readings
                .Where(r => (DateTime.UtcNow - startTime).TotalMilliseconds >= stabilityDurationMs)
                .ToList();

            if (recentReadings.Count >= 5)
            {
                var maxDiff = recentReadings.Max() - recentReadings.Min();
                if (maxDiff <= toleranceKg)
                {
                    return recentReadings.Average(r => r);
                }
            }

            await Task.Delay(200); // 200ms采样一次
        }
    }
}
```

### 3.3 IoT设备网关

#### 3.3.1 架构

```
┌─────────────────────────────────────────────────────────┐
│                    IoT 设备层                             │
│  GPS终端 │ 地磅 │ 摄像头 │ 回收箱控制器 │ 作业记录仪     │
└──────┬──────────┬──────────┬───────────┬────────────────┘
       │          │          │           │
       │ MQTT     │ TCP/串口  │ RTSP     │ 4G/HTTP
       │          │          │           │
┌──────┴──────────┴──────────┴───────────┴────────────────┐
│                 IoT Gateway Service                       │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────┐  │
│  │  MQTT    │ │  TCP     │ │ Protocol │ │  Device   │  │
│  │  Broker  │ │  Server  │ │ Adapter  │ │  Shadow   │  │
│  └────┬─────┘ └────┬─────┘ └────┬─────┘ └─────┬─────┘  │
│       │             │            │              │         │
│  ┌────┴─────────────┴────────────┴──────────────┴─────┐  │
│  │              Device Manager                         │  │
│  │  设备注册 │ 状态管理 │ 指令下发 │ 固件升级 │ 告警    │  │
│  └─────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

#### 3.3.2 设备接入实现

```csharp
// MQTT消息处理（使用MQTTnet）
public class IoTMqttHandler
{
    private readonly IMqttServer _mqttServer;
    private readonly IDeviceRegistry _deviceRegistry;
    private readonly IEventBus _eventBus;

    public async Task HandleMessageReceived(MqttApplicationMessageReceivedEventArgs e)
    {
        var topic = e.ApplicationMessage.Topic;
        var payload = Encoding.UTF8.GetString(e.ApplicationMessage.PayloadSegment);
        
        // Topic格式: devices/{deviceId}/{dataType}
        // 示例: devices/RB001/telemetry  (回收箱遥测数据)
        //       devices/VH001/location   (车辆位置)
        //       devices/WB001/weight     (地磅重量)
        
        var parts = topic.Split('/');
        var deviceId = parts[1];
        var dataType = parts[2];

        // 验证设备身份
        var device = await _deviceRegistry.GetDevice(deviceId);
        if (device == null)
        {
            _logger.LogWarning("未注册设备: {DeviceId}", deviceId);
            return;
        }

        // 更新设备在线状态
        await _deviceRegistry.UpdateHeartbeat(deviceId);

        // 根据数据类型分发处理
        switch (dataType)
        {
            case "telemetry":
                await HandleTelemetry(device, payload);
                break;
            case "location":
                await HandleLocation(device, payload);
                break;
            case "weight":
                await HandleWeight(device, payload);
                break;
            case "alarm":
                await HandleAlarm(device, payload);
                break;
        }
    }

    // 下发指令到设备
    public async Task SendCommand(string deviceId, DeviceCommand command)
    {
        var topic = $"devices/{deviceId}/commands";
        var payload = JsonSerializer.Serialize(command);
        
        var message = new MqttApplicationMessageBuilder()
            .WithTopic(topic)
            .WithPayload(payload)
            .WithQualityOfServiceLevel(MqttQualityOfServiceLevel.AtLeastOnce)
            .Build();

        await _mqttServer.InjectApplicationMessage(
            new InjectedMqttApplicationMessage(message));
    }
}

// 设备影子（Device Shadow）- 缓存设备最新状态
public class DeviceShadow
{
    public string DeviceId { get; set; }
    public DeviceStatus Status { get; set; }           // Online/Offline/Error
    public DateTime LastHeartbeat { get; set; }
    public Dictionary<string, object> Reported { get; set; }   // 设备上报的状态
    public Dictionary<string, object> Desired { get; set; }    // 期望的状态（用于指令下发）
}
```

### 3.4 GIS地图与热力图服务

```csharp
public class GISService
{
    private readonly IGeoRepository _geoRepo;
    private readonly IRedisCache _cache;

    /// <summary>
    /// 生成智能回收箱投放热力图数据
    /// </summary>
    public async Task<HeatmapData> GetRecyclingHeatmap(HeatmapRequest request)
    {
        // 查询指定时间范围和区域内的投放记录
        var records = await _geoRepo.QueryRecyclingRecords(
            request.BoundingBox,
            request.StartTime,
            request.EndTime,
            request.Category // 可选：按品类筛选
        );

        // 按网格聚合（使用PostGIS的ST_SnapToGrid）
        var gridData = await _geoRepo.AggregateByGrid(
            records,
            request.GridSizeMeters // 网格大小，如500米
        );

        return new HeatmapData
        {
            Points = gridData.Select(g => new HeatmapPoint
            {
                Longitude = g.CenterLng,
                Latitude = g.CenterLat,
                Weight = g.Count,
                PeakHour = g.PeakHour,
                TopCategory = g.TopCategory
            }).ToList(),
            Statistics = new HeatmapStatistics
            {
                TotalRecords = records.Count,
                PeakTimeSlot = AnalyzePeakTime(records),
                TopAreas = GetTopAreas(gridData, 10)
            }
        };
    }

    /// <summary>
    /// 分析投放高峰时段
    /// </summary>
    public async Task<TimeSlotAnalysis> AnalyzePeakTime(string areaId, int days = 30)
    {
        var sql = @"
            SELECT 
                EXTRACT(HOUR FROM created_at) as hour,
                EXTRACT(DOW FROM created_at) as day_of_week,
                COUNT(*) as count
            FROM recycling_records
            WHERE area_id = @AreaId 
              AND created_at >= @StartDate
            GROUP BY hour, day_of_week
            ORDER BY count DESC";
        
        // 返回各时段投放量，用于前端渲染时间热力图
        return await _geoRepo.QueryTimeSlotAnalysis(areaId, days);
    }
}
```

### 3.5 视频监控与作业记录仪

```csharp
public class VideoService
{
    private readonly IStreamMediaServer _mediaServer;  // ZLMediaKit
    
    /// <summary>
    /// 获取实时视频流地址（用于Web/App播放）
    /// </summary>
    public async Task<StreamUrl> GetLiveStream(string deviceId)
    {
        // 检查设备是否在线
        var device = await _deviceRegistry.GetCamera(deviceId);
        if (device.Status != DeviceStatus.Online)
            throw new DeviceOfflineException(deviceId);

        // 通过流媒体服务器拉流并转码
        var streamInfo = await _mediaServer.StartProxy(new ProxyRequest
        {
            SourceUrl = device.RtspUrl,     // RTSP源地址
            App = "live",
            StreamId = deviceId,
            EnableHls = true,               // 支持HLS（兼容性好）
            EnableFlv = true                // 支持HTTP-FLV（低延迟）
        });

        return new StreamUrl
        {
            Flv = streamInfo.FlvUrl,        // 低延迟播放
            Hls = streamInfo.HlsUrl,        // 兼容性播放
            WebRTC = streamInfo.WebRtcUrl   // 超低延迟
        };
    }

    /// <summary>
    /// 作业记录仪视频回放
    /// </summary>
    public async Task<VideoPlayback> GetRecordPlayback(
        string deviceId, DateTime startTime, DateTime endTime)
    {
        // 从存储中检索录像文件
        var recordings = await _storageService.FindRecordings(
            deviceId, startTime, endTime);

        return new VideoPlayback
        {
            Segments = recordings.Select(r => new VideoSegment
            {
                Url = r.PlaybackUrl,
                StartTime = r.StartTime,
                EndTime = r.EndTime,
                Duration = r.Duration
            }).ToList()
        };
    }
}
```

---

## 四、各业务模块详细设计

### 4.1 业务一：建筑垃圾上门回收

#### 4.1.1 领域模型

```csharp
// 回收工单（聚合根）
public class RecyclingOrder : AggregateRoot
{
    public string CustomerId { get; private set; }
    public Address PickupAddress { get; private set; }
    public WasteType WasteType { get; private set; }          // 装修垃圾/拆迁垃圾/土方
    public decimal EstimatedVolume { get; private set; }       // 预估方量（立方米）
    public DateTimeRange PreferredTime { get; private set; }   // 期望上门时间段
    public OrderStatus Status { get; private set; }
    public decimal? ActualWeight { get; private set; }          // 实际称重
    public decimal? TotalAmount { get; private set; }           // 费用
    public string? AssignedVehicleId { get; private set; }
    public string? AssignedDriverId { get; private set; }
    public List<string> PhotoUrls { get; private set; }        // 现场照片
    public List<OrderStatusLog> StatusLogs { get; private set; }

    // 业务方法
    public void AssignVehicle(string vehicleId, string driverId)
    {
        if (Status != OrderStatus.Pending)
            throw new DomainException("只有待处理的订单才能派单");
            
        AssignedVehicleId = vehicleId;
        AssignedDriverId = driverId;
        Status = OrderStatus.Assigned;
        AddDomainEvent(new OrderAssignedEvent(Id, vehicleId, driverId));
    }

    public void CompleteWeighing(decimal netWeight, string weighRecordId)
    {
        ActualWeight = netWeight;
        TotalAmount = CalculateAmount(netWeight, WasteType);
        Status = OrderStatus.Weighed;
        AddDomainEvent(new OrderWeighedEvent(Id, netWeight, TotalAmount.Value));
    }
}

public enum OrderStatus
{
    Pending,        // 待处理
    Assigned,       // 已派单
    EnRoute,        // 前往中
    Arrived,        // 已到达
    Loading,        // 装车中
    Transporting,   // 运输中
    Weighed,        // 已称重
    Completed,      // 已完成
    Cancelled       // 已取消
}
```

#### 4.1.2 API接口设计

```csharp
[ApiController]
[Route("api/v1/construction-orders")]
public class ConstructionOrderController : ControllerBase
{
    /// <summary>
    /// C端 - 客户下单
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "Customer")]
    public async Task<ActionResult<OrderResponse>> CreateOrder(
        [FromBody] CreateOrderRequest request)
    {
        // request: 地址、垃圾类型、预估量、照片、期望时间
        var orderId = await _mediator.Send(new CreateOrderCommand(request));
        return CreatedAtAction(nameof(GetOrder), new { id = orderId }, 
            new OrderResponse { OrderId = orderId });
    }

    /// <summary>
    /// 调度 - 智能派单
    /// </summary>
    [HttpPost("{orderId}/dispatch")]
    [Authorize(Roles = "Dispatcher")]
    public async Task<ActionResult<DispatchResult>> Dispatch(
        string orderId, [FromBody] DispatchOptions options)
    {
        var result = await _mediator.Send(new DispatchOrderCommand(orderId, options));
        return Ok(result);
    }

    /// <summary>
    /// 司机 - 更新作业状态
    /// </summary>
    [HttpPut("{orderId}/status")]
    [Authorize(Roles = "Driver")]
    public async Task<ActionResult> UpdateStatus(
        string orderId, [FromBody] UpdateStatusRequest request)
    {
        await _mediator.Send(new UpdateOrderStatusCommand(orderId, request.Status, request.Photos));
        return NoContent();
    }

    /// <summary>
    /// 获取订单详情（含实时追踪信息）
    /// </summary>
    [HttpGet("{orderId}")]
    public async Task<ActionResult<OrderDetailResponse>> GetOrder(string orderId)
    {
        var order = await _mediator.Send(new GetOrderDetailQuery(orderId));
        return Ok(order);
    }
}
```

### 4.2 业务二：街道清运

#### 4.2.1 核心模型

```csharp
// 清运合同/标段
public class CleaningContract : AggregateRoot
{
    public string ContractName { get; set; }
    public string StreetDistrict { get; set; }          // 负责街道/片区
    public GeoPolygon CoverageArea { get; set; }        // 覆盖区域（多边形）
    public DateRange ContractPeriod { get; set; }
    public List<CleaningRoute> Routes { get; set; }     // 清运路线
    public List<TrashBin> TrashBins { get; set; }       // 管辖垃圾箱
    public CleaningSchedule Schedule { get; set; }      // 排班计划
}

// 清运路线
public class CleaningRoute
{
    public string RouteId { get; set; }
    public string RouteName { get; set; }
    public List<GeoPoint> Waypoints { get; set; }       // 路线途经点
    public List<string> TrashBinIds { get; set; }       // 沿途垃圾箱
    public TimeOnly PlannedStartTime { get; set; }
    public int EstimatedDurationMinutes { get; set; }
    public VehicleCategory RequiredVehicle { get; set; }
}

// 作业记录
public class CleaningTask : AggregateRoot
{
    public string RouteId { get; set; }
    public string VehicleId { get; set; }
    public string DriverId { get; set; }
    public List<string> WorkerIds { get; set; }         // 随车清扫工
    public DateTime ActualStartTime { get; set; }
    public DateTime? ActualEndTime { get; set; }
    public CleaningTaskStatus Status { get; set; }
    public List<GeoPoint> ActualTrack { get; set; }     // 实际轨迹
    public List<TrashBinCollection> Collections { get; set; }  // 各箱清运记录
    public string BodyCamVideoId { get; set; }          // 作业记录仪视频
    public decimal QualityScore { get; set; }           // 质量评分
}

// 垃圾箱清运记录
public class TrashBinCollection
{
    public string BinId { get; set; }
    public DateTime CollectionTime { get; set; }
    public string BeforePhotoUrl { get; set; }
    public string AfterPhotoUrl { get; set; }
    public bool IsCompleted { get; set; }
}
```

#### 4.2.2 排班调度

```csharp
public class SchedulingService
{
    /// <summary>
    /// 生成每日排班计划
    /// </summary>
    public async Task<DailySchedule> GenerateDailySchedule(string contractId, DateTime date)
    {
        var contract = await _contractRepo.GetById(contractId);
        var schedule = contract.Schedule;
        var availableVehicles = await _vehicleRepo.GetAvailableForDate(date);
        var availableWorkers = await _workerRepo.GetAvailableForDate(date);

        var tasks = new List<PlannedTask>();

        foreach (var route in contract.Routes)
        {
            // 根据排班规则确定当天是否需要执行该路线
            if (!schedule.ShouldExecute(route.RouteId, date))
                continue;

            // 分配车辆和人员
            var vehicle = SelectBestVehicle(availableVehicles, route);
            var workers = SelectWorkers(availableWorkers, route);

            tasks.Add(new PlannedTask
            {
                RouteId = route.RouteId,
                VehicleId = vehicle.Id,
                DriverId = vehicle.DefaultDriverId,
                WorkerIds = workers.Select(w => w.Id).ToList(),
                PlannedStartTime = route.PlannedStartTime,
                Date = date
            });

            // 标记已分配
            availableVehicles.Remove(vehicle);
            availableWorkers.RemoveAll(w => workers.Contains(w));
        }

        return new DailySchedule { Date = date, Tasks = tasks };
    }
}
```

### 4.3 业务三：智能回收箱

#### 4.3.1 回收箱设备通信

```csharp
// 智能回收箱遥测数据
public class RecyclingBinTelemetry
{
    public string BinId { get; set; }
    public decimal CurrentWeight { get; set; }         // 当前重量
    public decimal CapacityPercent { get; set; }       // 容量百分比
    public decimal Temperature { get; set; }           // 箱内温度
    public bool DoorOpen { get; set; }                 // 门是否打开
    public BinStatus Status { get; set; }              // 正常/故障/满箱
    public decimal BatteryLevel { get; set; }          // 电池电量
    public DateTime Timestamp { get; set; }
}

// 用户投放事件
public class RecyclingDepositEvent
{
    public string BinId { get; set; }
    public string UserId { get; set; }                 // 用户ID（扫码获得）
    public RecyclableCategory Category { get; set; }   // 纸类/塑料/金属/织物/玻璃
    public decimal Weight { get; set; }                // 重量（kg）
    public decimal UnitPrice { get; set; }             // 单价（元/kg）
    public decimal Amount { get; set; }                // 金额
    public string PhotoUrl { get; set; }               // 箱内拍照（用于分类验证）
    public DateTime DepositTime { get; set; }
    public GeoPoint Location { get; set; }             // 回收箱位置
}

// 智能回收箱服务
public class SmartRecyclingBinService
{
    /// <summary>
    /// 处理用户投放
    /// </summary>
    public async Task<DepositResult> ProcessDeposit(DepositRequest request)
    {
        // 1. 验证用户身份（扫码）
        var user = await _userService.ValidateUser(request.UserId);
        
        // 2. 开门指令
        await _iotGateway.SendCommand(request.BinId, new OpenDoorCommand
        {
            Compartment = request.Category.ToCompartment()
        });
        
        // 3. 等待投放完成（门关闭信号）
        var closeSignal = await WaitForDoorClose(request.BinId, TimeSpan.FromSeconds(60));
        
        // 4. 读取称重差值
        var weightBefore = request.WeightBefore;
        var weightAfter = await _iotGateway.ReadWeight(request.BinId, request.Category);
        var depositWeight = weightAfter - weightBefore;
        
        // 5. 箱内拍照识别（验证分类是否正确）
        var photo = await _iotGateway.CapturePhoto(request.BinId);
        var classifyResult = await _aiService.ClassifyWaste(photo);
        
        // 6. 计算金额
        var unitPrice = await _priceService.GetUnitPrice(request.Category);
        var amount = depositWeight * unitPrice;
        
        // 7. 积分/余额入账
        await _accountService.Credit(user.Id, amount, $"投放{request.Category}");
        
        // 8. 记录投放事件
        var depositEvent = new RecyclingDepositEvent
        {
            BinId = request.BinId,
            UserId = user.Id,
            Category = classifyResult.ActualCategory, // 以AI识别结果为准
            Weight = depositWeight,
            UnitPrice = unitPrice,
            Amount = amount,
            PhotoUrl = photo.Url,
            DepositTime = DateTime.UtcNow,
            Location = await _binRepo.GetLocation(request.BinId)
        };
        
        await _eventBus.Publish(depositEvent);

        // 9. 检查是否需要触发清运
        await CheckAndTriggerCollection(request.BinId);
        
        return new DepositResult
        {
            Success = true,
            Weight = depositWeight,
            Amount = amount,
            Balance = await _accountService.GetBalance(user.Id)
        };
    }

    /// <summary>
    /// 满箱预警 → 自动创建清运工单
    /// </summary>
    private async Task CheckAndTriggerCollection(string binId)
    {
        var telemetry = await _iotGateway.GetLatestTelemetry(binId);
        
        if (telemetry.CapacityPercent >= 80) // 80%触发预警
        {
            var existingOrder = await _workOrderRepo
                .GetPendingCollectionOrder(binId);
                
            if (existingOrder == null)
            {
                // 创建清运工单
                await _workOrderService.CreateCollectionOrder(new CollectionOrderRequest
                {
                    BinId = binId,
                    Priority = telemetry.CapacityPercent >= 95 ? Priority.High : Priority.Normal,
                    Location = await _binRepo.GetLocation(binId)
                });
            }
        }
    }
}
```

#### 4.3.2 GIS热力图数据分析

```csharp
public class RecyclingAnalyticsService
{
    /// <summary>
    /// 获取区域投放热力图数据
    /// </summary>
    public async Task<RegionAnalytics> GetRegionAnalytics(AnalyticsRequest request)
    {
        // SQL: 利用PostGIS空间聚合
        var sql = @"
            WITH grid AS (
                SELECT 
                    ST_SnapToGrid(location::geometry, @GridSize) as cell,
                    category,
                    EXTRACT(HOUR FROM deposit_time) as hour,
                    weight,
                    amount
                FROM recycling_deposits
                WHERE deposit_time BETWEEN @Start AND @End
                  AND ST_Within(location::geometry, ST_GeomFromGeoJSON(@BoundingBox))
            )
            SELECT 
                ST_X(ST_Centroid(cell)) as lng,
                ST_Y(ST_Centroid(cell)) as lat,
                COUNT(*) as deposit_count,
                SUM(weight) as total_weight,
                SUM(amount) as total_amount,
                MODE() WITHIN GROUP (ORDER BY category) as top_category,
                MODE() WITHIN GROUP (ORDER BY hour) as peak_hour
            FROM grid
            GROUP BY cell
            ORDER BY deposit_count DESC";

        var gridData = await _db.QueryAsync<GridCell>(sql, new
        {
            GridSize = request.GridSizeMeters / 111000.0, // 度转换
            Start = request.StartTime,
            End = request.EndTime,
            BoundingBox = request.BoundingBox.ToGeoJson()
        });

        return new RegionAnalytics
        {
            HeatmapPoints = gridData.ToList(),
            Summary = new AnalyticsSummary
            {
                TotalDeposits = gridData.Sum(g => g.DepositCount),
                TotalWeight = gridData.Sum(g => g.TotalWeight),
                TotalAmount = gridData.Sum(g => g.TotalAmount),
                TopCategory = gridData.GroupBy(g => g.TopCategory)
                    .OrderByDescending(g => g.Count())
                    .First().Key,
                PeakHourRange = CalculatePeakRange(gridData)
            }
        };
    }

    /// <summary>
    /// 获取单个回收箱的时段分析
    /// </summary>
    public async Task<BinTimeAnalysis> GetBinTimeAnalysis(string binId, int days = 30)
    {
        var records = await _depositRepo.GetByBin(binId, days);
        
        // 按小时统计
        var hourlyStats = records
            .GroupBy(r => r.DepositTime.Hour)
            .Select(g => new HourlyStats
            {
                Hour = g.Key,
                Count = g.Count(),
                TotalWeight = g.Sum(r => r.Weight)
            })
            .OrderBy(h => h.Hour)
            .ToList();

        // 按星期统计
        var weekdayStats = records
            .GroupBy(r => r.DepositTime.DayOfWeek)
            .Select(g => new WeekdayStats
            {
                DayOfWeek = g.Key,
                Count = g.Count(),
                TotalWeight = g.Sum(r => r.Weight)
            })
            .ToList();

        return new BinTimeAnalysis
        {
            BinId = binId,
            HourlyDistribution = hourlyStats,
            WeekdayDistribution = weekdayStats,
            PeakHours = hourlyStats.OrderByDescending(h => h.Count).Take(3).ToList(),
            RecommendedCollectionTime = CalculateOptimalCollectionTime(hourlyStats)
        };
    }
}
```

### 4.4 业务四：固废/危废处置

#### 4.4.1 核心模型

```csharp
// 危废转移联单（五联单电子化）
public class HazWasteManifest : AggregateRoot
{
    public string ManifestNo { get; set; }             // 联单编号（按规范生成）
    public ManifestStatus Status { get; set; }
    
    // 产废单位信息
    public string GeneratorId { get; set; }
    public string GeneratorName { get; set; }
    public string GeneratorLicense { get; set; }
    
    // 危废信息
    public string WasteCode { get; set; }              // 国标危废代码（如HW01-HW50）
    public string WasteName { get; set; }
    public decimal DeclaredWeight { get; set; }         // 申报重量
    public decimal? ActualWeight { get; set; }          // 实际过磅重量
    public string PackagingType { get; set; }           // 包装方式
    public int PackageCount { get; set; }               // 包装件数
    
    // 运输信息
    public string TransporterId { get; set; }
    public string TransporterLicense { get; set; }
    public string VehicleId { get; set; }
    public string DriverId { get; set; }
    public DateTime? DepartureTime { get; set; }
    public DateTime? ArrivalTime { get; set; }
    public List<GeoPoint> TransportTrack { get; set; } // GPS轨迹
    
    // 接收处置信息
    public string DisposalFacilityId { get; set; }
    public string DisposalMethod { get; set; }          // D1填埋/D10焚烧/R1溶剂回收...
    public DateTime? DisposalTime { get; set; }
    
    // 签收记录
    public List<ManifestSignature> Signatures { get; set; }
}

// 填埋场库容管理
public class LandfillCapacity
{
    public string LandfillId { get; set; }
    public string ZoneId { get; set; }                 // 分区
    public decimal DesignCapacity { get; set; }        // 设计库容（立方米）
    public decimal UsedCapacity { get; set; }          // 已用库容
    public decimal RemainingCapacity => DesignCapacity - UsedCapacity;
    public decimal UsageRate => UsedCapacity / DesignCapacity * 100;
    public DateTime? EstimatedFullDate { get; set; }   // 预计满库日期
}

// 环境监测数据
public class EnvironmentMonitorData
{
    public string FacilityId { get; set; }
    public string MonitorPointId { get; set; }
    public string ParameterName { get; set; }          // pH、COD、氨氮、H2S等
    public decimal Value { get; set; }
    public string Unit { get; set; }
    public decimal UpperLimit { get; set; }            // 排放标准上限
    public bool IsExceeding => Value > UpperLimit;     // 是否超标
    public DateTime SampleTime { get; set; }
}
```

#### 4.4.2 合规与监管对接

```csharp
// 政府监管数据上报接口（预留）
public interface IRegulatoryReportService
{
    /// <summary>
    /// 上报危废转移联单
    /// </summary>
    Task<ReportResult> ReportManifest(HazWasteManifest manifest);
    
    /// <summary>
    /// 上报环境监测数据
    /// </summary>
    Task<ReportResult> ReportEnvironmentData(List<EnvironmentMonitorData> data);
    
    /// <summary>
    /// 上报经营情况年报
    /// </summary>
    Task<ReportResult> ReportAnnualSummary(AnnualSummary summary);
}

// 预留实现（接口适配器模式，未来对接时只需实现具体适配器）
public class RegulatoryReportStub : IRegulatoryReportService
{
    private readonly ILogger<RegulatoryReportStub> _logger;
    
    public Task<ReportResult> ReportManifest(HazWasteManifest manifest)
    {
        _logger.LogInformation("监管上报（预留）: 联单 {ManifestNo}", manifest.ManifestNo);
        // 先存入本地待上报队列，待对接后批量上报
        return Task.FromResult(ReportResult.Pending("接口未对接，已存入待报队列"));
    }
}
```

---

## 五、数据库设计

### 5.1 数据库选型与分库策略

| 数据类型 | 数据库 | 说明 |
|----------|--------|------|
| 业务数据 | PostgreSQL 16 + PostGIS | 核心业务CRUD + 空间查询 |
| 时序数据 | TimescaleDB | IoT遥测、GPS轨迹、环境监测 |
| 缓存 | Redis 7 | 会话、设备状态、实时位置、排行 |
| 文件 | MinIO + 阿里云OSS | 视频、图片、文档 |
| 搜索 | PostgreSQL全文检索（初期） | 工单搜索，后期可迁移ES |

### 5.2 核心表结构概览

```sql
-- ============================================
-- 基础模块
-- ============================================

-- 租户/公司
CREATE TABLE tenants (
    id VARCHAR(32) PRIMARY KEY,
    name VARCHAR(200) NOT NULL,
    contact_phone VARCHAR(20),
    address TEXT,
    business_license VARCHAR(50),
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 用户表
CREATE TABLE users (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) REFERENCES tenants(id),
    username VARCHAR(50) UNIQUE NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(50) NOT NULL, -- Admin/Dispatcher/Driver/Worker/Customer
    status SMALLINT DEFAULT 1,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 车辆调度模块
-- ============================================

-- 车辆信息
CREATE TABLE vehicles (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    plate_number VARCHAR(20) UNIQUE NOT NULL,
    vehicle_type VARCHAR(50) NOT NULL,    -- 清运车/勾臂车/危废专车/散装车
    capacity_tons DECIMAL(10,2),          -- 载重（吨）
    capacity_cubic DECIMAL(10,2),         -- 容积（立方米）
    gps_device_id VARCHAR(50),
    status VARCHAR(20) DEFAULT 'idle',    -- idle/busy/maintenance/offline
    default_driver_id VARCHAR(32),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 车辆实时位置（时序表）
CREATE TABLE vehicle_tracks (
    vehicle_id VARCHAR(32) NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    speed DECIMAL(6,2),
    direction SMALLINT,
    timestamp TIMESTAMPTZ NOT NULL
);
-- TimescaleDB超级表
SELECT create_hypertable('vehicle_tracks', 'timestamp');

-- 调度记录
CREATE TABLE dispatch_records (
    id VARCHAR(32) PRIMARY KEY,
    work_order_id VARCHAR(32) NOT NULL,
    vehicle_id VARCHAR(32) NOT NULL,
    driver_id VARCHAR(32) NOT NULL,
    dispatch_type VARCHAR(20),           -- auto/manual
    dispatch_time TIMESTAMPTZ NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 地磅称重模块
-- ============================================

CREATE TABLE weigh_records (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    weighbridge_id VARCHAR(32) NOT NULL,
    plate_number VARCHAR(20) NOT NULL,
    work_order_id VARCHAR(32),
    weigh_type VARCHAR(20) NOT NULL,     -- first_weigh/second_weigh
    weight DECIMAL(12,2) NOT NULL,       -- 重量（kg）
    net_weight DECIMAL(12,2),            -- 净重（二次称重时计算）
    first_weigh_id VARCHAR(32),          -- 关联一次称重记录
    snapshot_urls TEXT[],                 -- 抓拍图片
    operator_id VARCHAR(32),
    weigh_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- 智能回收箱模块
-- ============================================

-- 回收箱设备
CREATE TABLE recycling_bins (
    id VARCHAR(32) PRIMARY KEY,
    tenant_id VARCHAR(32) NOT NULL,
    bin_code VARCHAR(50) UNIQUE NOT NULL,
    location GEOGRAPHY(Point, 4326) NOT NULL,  -- PostGIS地理点
    address TEXT,
    area_id VARCHAR(32),
    status VARCHAR(20) DEFAULT 'normal',
    installed_at TIMESTAMPTZ,
    last_maintenance TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 空间索引
CREATE INDEX idx_recycling_bins_location ON recycling_bins USING GIST(location);

-- 投放记录
CREATE TABLE recycling_deposits (
    id VARCHAR(32) PRIMARY KEY,
    bin_id VARCHAR(32) NOT NULL,
    user_id VARCHAR(32) NOT NULL,
    category VARCHAR(20) NOT NULL,        -- paper/plastic/metal/textile/glass
    weight DECIMAL(8,3) NOT NULL,         -- 重量（kg）
    unit_price DECIMAL(8,2) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    photo_url TEXT,
    location GEOGRAPHY(Point, 4326),
    deposit_time TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 时间+空间复合索引（用于热力图查询）
CREATE INDEX idx_deposits_time_location 
    ON recycling_deposits USING GIST(location) 
    WHERE deposit_time IS NOT NULL;
CREATE INDEX idx_deposits_time ON recycling_deposits(deposit_time DESC);

-- 回收箱遥测数据（时序）
CREATE TABLE bin_telemetry (
    bin_id VARCHAR(32) NOT NULL,
    capacity_percent DECIMAL(5,2),
    current_weight DECIMAL(8,2),
    temperature DECIMAL(5,2),
    battery_level DECIMAL(5,2),
    door_status BOOLEAN,
    timestamp TIMESTAMPTZ NOT NULL
);
SELECT create_hypertable('bin_telemetry', 'timestamp');

-- ============================================
-- 危废管理模块
-- ============================================

-- 危废转移联单
CREATE TABLE hazwaste_manifests (
    id VARCHAR(32) PRIMARY KEY,
    manifest_no VARCHAR(50) UNIQUE NOT NULL,
    status VARCHAR(20) NOT NULL,
    -- 产废方
    generator_id VARCHAR(32) NOT NULL,
    generator_name VARCHAR(200),
    -- 危废信息
    waste_code VARCHAR(20) NOT NULL,
    waste_name VARCHAR(200) NOT NULL,
    declared_weight DECIMAL(12,2),
    actual_weight DECIMAL(12,2),
    packaging_type VARCHAR(50),
    package_count INT,
    -- 运输
    transporter_id VARCHAR(32),
    vehicle_id VARCHAR(32),
    driver_id VARCHAR(32),
    departure_time TIMESTAMPTZ,
    arrival_time TIMESTAMPTZ,
    -- 处置
    disposal_facility_id VARCHAR(32),
    disposal_method VARCHAR(50),
    disposal_time TIMESTAMPTZ,
    -- 审计
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ
);

-- 填埋场库容
CREATE TABLE landfill_zones (
    id VARCHAR(32) PRIMARY KEY,
    landfill_id VARCHAR(32) NOT NULL,
    zone_name VARCHAR(100),
    design_capacity DECIMAL(12,2),       -- 设计库容（m³）
    used_capacity DECIMAL(12,2) DEFAULT 0,
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## 六、IoT设备选型建议

### 6.1 设备清单

| 设备类型 | 推荐品牌/型号 | 通信协议 | 用途 | 参考价格 |
|----------|--------------|----------|------|----------|
| **车载GPS终端** | 合众思壮 T300 / 博实结 | 4G + MQTT | 车辆定位追踪 | 300-600元/台 |
| **地磅** | 耀华XK3190-A12E | RS232/RS485串口 + TCP | 车辆称重 | 2-5万元/台 |
| **车牌识别摄像头** | 海康威视 iDS-2CD7A46G0 | RTSP + HTTP API | 进出场识别 | 2000-5000元/台 |
| **监控摄像头** | 海康威视 DS-2CD3T46WDV3 | RTSP + GB28181 | 场地监控 | 800-2000元/台 |
| **作业记录仪** | 海康威视 DS-MH2211/B | 4G + WiFi | 清扫人员作业录像 | 1500-3000元/台 |
| **回收箱控制器** | 定制（基于STM32/ESP32） | 4G + MQTT | 开关门、称重、拍照 | 500-1500元/套 |
| **回收箱称重模块** | 梅特勒-托利多 / 宁波柯力 | 串口→主控板 | 箱内物品称重 | 200-800元/个 |
| **回收箱摄像头** | 海康微型网络摄像机 | RTSP/ONVIF | 箱内物品识别 | 300-800元/个 |
| **环境监测仪** | 雪迪龙 / 聚光科技 | Modbus TCP/RTU | 渗滤液、气体监测 | 按监测因子定价 |

### 6.2 通信架构

```
设备层                   网络层                    平台层
┌──────────┐                                    ┌──────────────┐
│GPS终端    │──── 4G ────┐                       │              │
├──────────┤            │                       │   EMQX/      │
│地磅       │── RS485 ──┤ 边缘网关 ── 4G/有线 ──│   Mosquitto  │
├──────────┤            │ (工控机)              │   MQTT Broker│
│摄像头     │── 网线 ───┤                       │              │
├──────────┤            │                       ├──────────────┤
│作业记录仪 │──── 4G ────┘                       │              │
├──────────┤                                    │  IoT Gateway │
│回收箱     │──── 4G ─────────────────── MQTT ──│  Service     │
├──────────┤                                    │              │
│环境监测   │── Modbus ── 边缘网关 ── 有线 ─────│              │
└──────────┘                                    └──────────────┘
```

### 6.3 边缘网关方案

对于填埋场/地磅站等固定场所，部署边缘网关（工控机）：
- **硬件**：研华UNO-2271G / 华为AR502H
- **作用**：协议转换（Modbus/串口→MQTT）、本地缓存（断网续传）、视频缓存

---

## 七、部署架构

### 7.1 混合部署方案

```
┌─────────────────────────────────────────────────────────────────┐
│                        私有化部署（本地机房/IDC）                   │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  Docker Host / K3s 集群                                      │ │
│  │                                                              │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐ │ │
│  │  │ API      │ │ Web Host │ │ IoT      │ │ Hangfire      │ │ │
│  │  │ Gateway  │ │ (业务)    │ │ Gateway  │ │ Worker        │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────────┘ │ │
│  │                                                              │ │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────┐ │ │
│  │  │PostgreSQL│ │ Redis    │ │ RabbitMQ │ │ MinIO         │ │ │
│  │  │+PostGIS  │ │          │ │          │ │ (视频/文件)    │ │ │
│  │  └──────────┘ └──────────┘ └──────────┘ └───────────────┘ │ │
│  │                                                              │ │
│  │  ┌──────────────────────────┐ ┌────────────────────────┐   │ │
│  │  │ ZLMediaKit (流媒体)       │ │ EMQX (MQTT Broker)     │   │ │
│  │  └──────────────────────────┘ └────────────────────────┘   │ │
│  └─────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  硬件配置建议：                                                    │
│  - 服务器：2台（主备/负载均衡），16核32G + 1TB SSD                  │
│  - 网络：100M专线上行                                              │
│  - UPS + 冗余电源                                                 │
└───────────────────────────────────────────────────────────────────┘

               │ VPN / 专线 │

┌─────────────────────────────────────────────────────────────────┐
│                        公有云（阿里云）                            │
│                                                                   │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌───────────────────┐  │
│  │ 阿里云   │ │ OSS      │ │ CDN      │ │ 短信/推送服务      │  │
│  │ IoT平台  │ │ 对象存储  │ │ 加速     │ │ (阿里云通信)       │  │
│  └──────────┘ └──────────┘ └──────────┘ └───────────────────┘  │
│                                                                   │
│  ┌──────────┐ ┌──────────────────────────────────────────────┐  │
│  │ 高德地图  │ │ 阿里云DataV / Quick BI（数据可视化大屏）       │  │
│  │ API      │ │                                               │  │
│  └──────────┘ └──────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 7.2 Docker Compose 部署配置

```yaml
# docker-compose.yml
version: '3.8'

services:
  # ===== 应用服务 =====
  api-gateway:
    image: ecowaste/api-gateway:latest
    ports:
      - "8080:8080"
    depends_on:
      - redis
    environment:
      - ASPNETCORE_ENVIRONMENT=Production
    restart: always

  web-host:
    image: ecowaste/web-host:latest
    ports:
      - "5000:5000"
    depends_on:
      - postgres
      - redis
      - rabbitmq
    environment:
      - ConnectionStrings__Default=Host=postgres;Database=ecowaste;Username=ecowaste;Password=${DB_PASSWORD}
      - ConnectionStrings__Redis=redis:6379
      - ConnectionStrings__RabbitMQ=amqp://admin:${MQ_PASSWORD}@rabbitmq:5672
    restart: always

  iot-gateway:
    image: ecowaste/iot-gateway:latest
    ports:
      - "1883:1883"   # MQTT
      - "8883:8883"   # MQTTS
    depends_on:
      - redis
      - rabbitmq
    restart: always

  hangfire-worker:
    image: ecowaste/hangfire-worker:latest
    depends_on:
      - postgres
      - redis
    restart: always

  # ===== 流媒体 =====
  zlmediakit:
    image: zlmediakit/zlmediakit:latest
    ports:
      - "8554:554"    # RTSP
      - "8080:80"     # HTTP-FLV/HLS
      - "8443:443"
    volumes:
      - media-data:/opt/media/data
    restart: always

  # ===== 基础设施 =====
  postgres:
    image: timescale/timescaledb-ha:pg16-latest  # 含PostGIS+TimescaleDB
    ports:
      - "5432:5432"
    environment:
      - POSTGRES_DB=ecowaste
      - POSTGRES_USER=ecowaste
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - pg-data:/home/postgres/pgdata
    restart: always

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    restart: always

  rabbitmq:
    image: rabbitmq:3-management
    ports:
      - "5672:5672"
      - "15672:15672"
    environment:
      - RABBITMQ_DEFAULT_USER=admin
      - RABBITMQ_DEFAULT_PASS=${MQ_PASSWORD}
    volumes:
      - rabbitmq-data:/var/lib/rabbitmq
    restart: always

  minio:
    image: minio/minio:latest
    ports:
      - "9000:9000"
      - "9001:9001"
    command: server /data --console-address ":9001"
    environment:
      - MINIO_ROOT_USER=admin
      - MINIO_ROOT_PASSWORD=${MINIO_PASSWORD}
    volumes:
      - minio-data:/data
    restart: always

  # ===== 监控 =====
  prometheus:
    image: prom/prometheus:latest
    ports:
      - "9090:9090"
    volumes:
      - ./config/prometheus.yml:/etc/prometheus/prometheus.yml
    restart: always

  grafana:
    image: grafana/grafana:latest
    ports:
      - "3000:3000"
    volumes:
      - grafana-data:/var/lib/grafana
    restart: always

volumes:
  pg-data:
  redis-data:
  rabbitmq-data:
  minio-data:
  media-data:
  grafana-data:
```

---

## 八、关键技术实现细节

### 8.1 认证与多端接入

```csharp
// 多端认证策略
public static class AuthConfiguration
{
    public static IServiceCollection AddMultiPlatformAuth(
        this IServiceCollection services, IConfiguration config)
    {
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options =>
            {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidateLifecycleToken = true,
                    ValidIssuer = config["Jwt:Issuer"],
                    ValidAudiences = new[] 
                    { 
                        "ecowaste-miniapp",      // 小程序
                        "ecowaste-driver-app",   // 司机App
                        "ecowaste-admin"         // 管理后台
                    },
                    IssuerSigningKey = new SymmetricSecurityKey(
                        Encoding.UTF8.GetBytes(config["Jwt:Key"]!))
                };
            });

        // 微信小程序登录
        services.AddScoped<IWeChatAuthService, WeChatAuthService>();
        // 手机号+验证码登录（司机/工人）
        services.AddScoped<ISmsAuthService, SmsAuthService>();
        // 账号密码登录（管理后台）
        services.AddScoped<IPasswordAuthService, PasswordAuthService>();

        return services;
    }
}
```

### 8.2 事件驱动架构（MassTransit + RabbitMQ）

```csharp
// 事件定义
public record OrderCreatedEvent(string OrderId, string CustomerId, GeoPoint Location);
public record OrderAssignedEvent(string OrderId, string VehicleId, string DriverId);
public record WeighingCompletedEvent(string OrderId, decimal NetWeight);
public record BinFullAlertEvent(string BinId, decimal CapacityPercent);

// MassTransit配置
public static class MassTransitConfiguration
{
    public static IServiceCollection AddMessaging(
        this IServiceCollection services, IConfiguration config)
    {
        services.AddMassTransit(x =>
        {
            // 自动扫描并注册所有Consumer
            x.AddConsumersFromNamespaceContaining<OrderCreatedConsumer>();

            x.UsingRabbitMq((context, cfg) =>
            {
                cfg.Host(config["RabbitMQ:Host"], h =>
                {
                    h.Username(config["RabbitMQ:Username"]!);
                    h.Password(config["RabbitMQ:Password"]!);
                });

                // 配置重试策略
                cfg.UseMessageRetry(r => r.Exponential(5, 
                    TimeSpan.FromSeconds(1), 
                    TimeSpan.FromMinutes(5), 
                    TimeSpan.FromSeconds(5)));

                cfg.ConfigureEndpoints(context);
            });
        });

        return services;
    }
}

// 事件消费者示例：订单创建后自动派单
public class OrderCreatedConsumer : IConsumer<OrderCreatedEvent>
{
    private readonly IDispatchEngine _dispatchEngine;
    private readonly INotificationService _notification;

    public async Task Consume(ConsumeContext<OrderCreatedEvent> context)
    {
        var evt = context.Message;

        // 尝试自动派单
        var result = await _dispatchEngine.AutoDispatch(new DispatchRequest
        {
            WorkOrderId = evt.OrderId,
            Type = WorkOrderType.ConstructionWaste,
            Location = evt.Location,
            RequiredVehicle = VehicleCategory.HookArm // 勾臂车
        });

        if (result.Success)
        {
            // 通知司机
            await _notification.SendPush(result.DriverId, 
                "新工单", $"您有一个新的建筑垃圾回收工单，请及时处理");
            
            // 通知客户
            await _notification.SendWeChatTemplate(evt.CustomerId,
                "order_assigned", new { DriverName = result.DriverName, ETA = result.ETA });
        }
        else
        {
            // 无可用车辆，通知调度员手动处理
            await _notification.SendToDispatchers(
                "需要手动派单", $"工单 {evt.OrderId} 无法自动派单: {result.Reason}");
        }
    }
}
```

### 8.3 实时通信（SignalR Hub）

```csharp
// 调度中心实时看板
[Authorize(Roles = "Dispatcher,Admin")]
public class DispatchHub : Hub
{
    public override async Task OnConnectedAsync()
    {
        var tenantId = Context.User!.FindFirst("tenant_id")!.Value;
        await Groups.AddToGroupAsync(Context.ConnectionId, $"dispatch:{tenantId}");
        await base.OnConnectedAsync();
    }

    /// <summary>
    /// 客户端订阅特定车辆追踪
    /// </summary>
    public async Task SubscribeVehicle(string vehicleId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, $"vehicle:{vehicleId}");
    }

    /// <summary>
    /// 客户端取消订阅
    /// </summary>
    public async Task UnsubscribeVehicle(string vehicleId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"vehicle:{vehicleId}");
    }
}

// 推送消息到前端的方法（由后台服务调用）
// 前端会收到：
// - VehicleLocationUpdated: 车辆位置更新
// - OrderStatusChanged: 工单状态变化
// - BinAlertCreated: 回收箱告警
// - WeighingCompleted: 称重完成
```

### 8.4 定时任务（Hangfire）

```csharp
public static class HangfireJobs
{
    public static void RegisterRecurringJobs()
    {
        // 每天凌晨2点：生成次日排班计划
        RecurringJob.AddOrUpdate<SchedulingService>(
            "generate-daily-schedule",
            s => s.GenerateNextDaySchedule(),
            "0 2 * * *");  // Cron: 每天02:00

        // 每5分钟：检查设备离线告警
        RecurringJob.AddOrUpdate<DeviceMonitorService>(
            "check-device-offline",
            s => s.CheckOfflineDevices(),
            "*/5 * * * *");

        // 每小时：回收箱数据聚合（用于热力图）
        RecurringJob.AddOrUpdate<RecyclingAnalyticsService>(
            "aggregate-recycling-data",
            s => s.AggregateHourlyData(),
            "0 * * * *");

        // 每天凌晨3点：TimescaleDB数据压缩（30天前的数据）
        RecurringJob.AddOrUpdate<DataMaintenanceService>(
            "compress-timeseries",
            s => s.CompressOldData(TimeSpan.FromDays(30)),
            "0 3 * * *");

        // 每月1号：生成月度运营报表
        RecurringJob.AddOrUpdate<ReportService>(
            "monthly-report",
            s => s.GenerateMonthlyReport(),
            "0 6 1 * *");
    }
}
```

---

## 九、前端架构

### 9.1 管理后台（Vue 3）

```
ecowaste-admin/
├── src/
│   ├── api/                    # API请求封装
│   ├── assets/
│   ├── components/
│   │   ├── MapView/           # 地图组件（高德）
│   │   ├── VideoPlayer/       # 视频播放组件
│   │   └── common/
│   ├── layouts/
│   ├── router/
│   ├── stores/                # Pinia状态管理
│   ├── views/
│   │   ├── dashboard/         # 数据大屏
│   │   ├── dispatch/          # 调度中心（地图+车辆列表+工单）
│   │   ├── construction/      # 建筑垃圾管理
│   │   ├── street-cleaning/   # 街道清运管理
│   │   ├── smart-recycling/   # 智能回收箱管理
│   │   ├── hazwaste/          # 危废管理
│   │   ├── weighbridge/       # 地磅管理
│   │   ├── iot-devices/       # 设备管理
│   │   ├── analytics/         # 数据分析（热力图）
│   │   └── system/            # 系统设置
│   └── utils/
│       ├── signalr.ts         # SignalR连接管理
│       └── map.ts             # 地图工具
```

### 9.2 移动端（UniApp）

```
ecowaste-uniapp/
├── src/
│   ├── pages/
│   │   ├── customer/          # C端-客户下单
│   │   │   ├── order-create/  # 创建订单
│   │   │   ├── order-list/    # 订单列表
│   │   │   ├── order-track/   # 订单追踪（地图）
│   │   │   └── recycling/     # 智能回收（扫码投放）
│   │   │
│   │   ├── driver/            # 司机端
│   │   │   ├── task-list/     # 任务列表
│   │   │   ├── navigation/    # 导航
│   │   │   ├── weighing/      # 称重确认
│   │   │   └── sign/          # 签收
│   │   │
│   │   └── worker/            # 清扫工人端
│   │       ├── attendance/    # 考勤打卡
│   │       ├── task/          # 今日任务
│   │       ├── recorder/      # 作业记录仪控制
│   │       └── call/          # 一键呼叫
│   │
│   ├── components/
│   ├── stores/
│   └── utils/
```

---

## 十、安全设计

| 安全领域 | 措施 |
|----------|------|
| 传输安全 | HTTPS + MQTTS(TLS) |
| 认证鉴权 | JWT + RBAC + 数据权限隔离（租户级） |
| API安全 | 限流（令牌桶）+ 请求签名（小程序端） |
| 数据安全 | 敏感字段加密存储（AES-256） |
| IoT安全 | 设备证书认证 + Topic权限控制 |
| 视频安全 | 播放鉴权 + 防盗链 + 录像水印 |
| 审计日志 | 关键操作全记录（谁/何时/做了什么） |
| 备份恢复 | PostgreSQL WAL归档 + 每日全量备份 |

---

## 十一、项目实施计划

### 11.1 分阶段交付

| 阶段 | 周期 | 内容 | 里程碑 |
|------|------|------|--------|
| **P0 基础框架** | 4周 | 项目骨架、认证、车辆调度、地磅称重 | 跑通派单→称重流程 |
| **P1 业务一** | 3周 | 建筑垃圾回收完整流程 + 小程序下单 | 客户可下单并追踪 |
| **P2 业务二** | 4周 | 街道清运 + 排班 + 作业记录仪 + 考核 | 清运班组可使用 |
| **P3 业务三** | 4周 | 智能回收箱 + 用户投放 + 热力图 | 回收箱上线运营 |
| **P4 业务四** | 3周 | 危废联单 + 填埋场管理 | 合规管理闭环 |
| **P5 优化** | 2周 | 数据大屏、报表、性能优化 | 正式上线 |

**总工期预估：约 20 周（5个月）**

### 11.2 团队配置建议

| 角色 | 人数 | 职责 |
|------|------|------|
| 技术负责人 | 1 | 架构设计、技术选型、Code Review |
| .NET后端开发 | 2-3 | 业务模块开发、IoT对接 |
| 前端开发 | 1-2 | Vue3管理后台 + UniApp移动端 |
| IoT/嵌入式 | 1 | 设备对接、协议适配、边缘网关 |
| 测试 | 1 | 功能测试、IoT联调测试 |

---

## 十二、补充说明与开放问题

### 12.1 我对业务的补充建议

1. **统一工单引擎**：四个业务都抽象为「工单」，统一生命周期管理（创建→派单→执行→验收→结算）
2. **电子联单**：建筑垃圾也应该有转移联单（部分城市已有要求），与危废联单复用框架
3. **司机/工人App应包含**：离线模式（地磅/偏远地区信号差时缓存后同步）
4. **计费引擎**：建议抽象为独立模块，支持不同计费规则（按重量/体积/趟次/月度包干）
5. **客户CRM**：建筑垃圾业务的客户（装修公司、工地）需要客户管理能力
6. **供应商管理**：如果有分包场景（外包车辆），需要供应商结算模块

### 12.2 仍需确认的问题

- 是否有多租户需求？（一套系统服务多个分公司/区域）
- 计费规则具体是怎样的？（按吨计费？包月？阶梯价？）
- 智能回收箱的用户积分/提现规则？
- 是否需要对接第三方支付（微信支付）？
- 是否需要电子发票？

---

*文档版本：v1.0 | 最后更新：2026-06-05*
