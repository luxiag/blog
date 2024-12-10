---
title: Entity Framework Core

---

# 基础使用

1.安装对应的数据库提供程序NuGet包

```bash
dotnet add packageMicrosoft.EntityFrameworkCore.SqlServer
```

2.创建实体类

`Book.cs`

```cs
    public class Book
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Author { get; set; }

        public DateTime publicTime { get; set; }

        public DateTime updatedTime { get; set; }

    }

```

3.实现EntityTypeConfiguration接口，并实现Configure方法，配置实体类与数据库表的映射关系

`BookEntityConfig.cs`

```cs
    public class BookEntityConfig:IEntityTypeConfiguration<Book>
    {
        public void Configure(EntityTypeBuilder<Book> builder) {
            // 配置表名
            builder.ToTable("T_Books");
            // 配置主键
            builder.HasKey(p => p.Id);

            // 配置字段属性
            builder.Property(p => p.Name)
                .IsRequired() // 必填字段
                .HasMaxLength(100); // 最大长度 100

            builder.Property(p => p.Price)
                .HasColumnType("decimal(18,2)"); // 指定数据类型

            // 配置关系
            builder.HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId); // 配置外键

            }
    }
```

4.创建DbContext类，并继承自 DbContext 的类，用于管理实体和数据库交互。

`MyDbContext.cs`

```cs
    public class MyDbContext:DbContext      
    {   
        // 提供对实体集合的访问，用于查询和保存数据。
        public DbSet<Book> Books { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {   
            // 如果基类配置了其他选项（如日志记录），调用 base.OnConfiguring 可以确保这些选项不会被覆盖。
            base.OnConfiguring(optionsBuilder);
        }
    }

```

5.注册DbContext

```json
"ConnectionStrings": {
  "DefaultConnection": "Server=localhost;Database=MyDatabase;User Id=myuser;Password=mypassword;"
}
```

```cs
var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();
app.Run();

```

6.创建数据库表

安装命令行工具支持的NuGet包

```bash
dotnet add packageMicrosoft.EntityFrameworkCore.Tools
```

主要用于开发阶段，支持管理数据库迁移、更新数据库、以及生成数据库模型代码等任务。

添加迁移

```bash
dotnet ef migrations add InitialCreate
```

更新数据库

```bash
dotnet ef database update
```

# 实体类

## 基础类型

```cs
// int / long / short / byte
// 用于存储整数类型的主键、计数器、或者状态标识。
public int PageCount { get; set; } // 书本的页数
public short Edition { get; set; } // 版本号

// decimal
// 适用于货币或高精度的数值计算。
public decimal Price { get; set; } // 书的价格

// float / double
// 用于存储浮点数，适用于需要高精度的小数计算的场合。
public float Latitude { get; set; } // 纬度
public double Longitude { get; set; } // 经度

// string
// 用于存储文本数据，可以指定最大长度。
public string Title { get; set; } // 书的标题
public string Description { get; set; } // 书的描述

// DateTime / DateTimeOffset
// 用于存储日期和时间信息。
public DateTime PublicationDate { get; set; } // 出版日期
public DateTimeOffset LastUpdated { get; set; } // 最后更新时间

// bool
// 用于存储布尔值，表示是/否、真/假等。
public bool IsAvailable { get; set; } // 是否可用

// Guid
// 用于存储全局唯一标识符，适用于需要唯一标识的场合。
public Guid UniqueId { get; set; } // 唯一标识符
```

## 高级类型

```cs
// byte[]
// 用于存储二进制数据，如文件内容、图像等。
public byte[] CoverImage { get; set; } // 封面图片

// Enum
// 用于存储枚举类型的值。
public BookStatus Status { get; set; } // 书的状态

// Complex Type
// 用于存储复杂的数据结构，如地址、坐标等。
public Address Address { get; set; } // 地址信息

// Navigation Property
// 用于表示实体之间的关联关系。
public Category Category { get; set; } // 所属类别
public ICollection<Author> Authors { get; set; } // 作者列表

```

## 实体关系

一对一关系 (One-to-One)

```cs
public class User
{
    public int Id { get; set; }
    public string Name { get; set; }
    public UserProfile Profile { get; set; }
}

public class UserProfile
{
    public int Id { get; set; }
    public string Address { get; set; }
    public User User { get; set; }
}

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        builder.ToTable("Users");

        // 配置一对一关系
        builder.HasOne(u => u.Profile) // 一个 User 有一个 Profile
               .WithOne(p => p.User)   // 一个 Profile 对应一个 User
               .HasForeignKey<UserProfile>(p => p.Id); // 外键在 UserProfile 中
    }
}
```

一对多

```cs
// 一对多关系
public class Book
{
    public int Id { get; set; }
    public string Title { get; set; }
    public ICollection<Review> Reviews { get; set; }
}

public class Review
{
    public int Id { get; set; }
    public string Content { get; set; }
    public int BookId { get; set; }
    public Book Book { get; set; }
}
public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.ToTable("Books");

        // 配置一对多关系
        builder.HasMany(b => b.Reviews)  // 一个 Book 有多个 Review
               .WithOne(r => r.Book)    // 一个 Review 关联一个 Book
               .HasForeignKey(r => r.BookId); // 外键在 Review 中
    }
}

```

多对多

```cs
public class Student
{
    public int Id { get; set; }
    public string Name { get; set; }
    public ICollection<Course> Courses { get; set; }
}

public class Course
{
    public int Id { get; set; }
    public string Title { get; set; }
    public ICollection<Student> Students { get; set; }
}

public class StudentConfiguration : IEntityTypeConfiguration<Student>
{
    public void Configure(EntityTypeBuilder<Student> builder)
    {
        builder.ToTable("Students");

        // 配置多对多关系
        builder.HasMany(s => s.Courses)  // 一个 Student 关联多个 Course
               .WithMany(c => c.Students) // 一个 Course 关联多个 Student
               .UsingEntity<StudentCourse>(); // 使用隐式中间表
    }
}
```

## Data Annotation

**Data Annotations** 是 **Entity Framework Core (EF Core)** 中用于配置模型属性的特性，它们使你可以在模型类中直接使用属性来指定数据库行为，如验证、映射和关系配置等。Data Annotations 是一种声明式的方式，用于在实体类中提供约束和配置选项。

### **如何使用 Data Annotations**

Data Annotations 通过在模型类的属性上使用特性（Attributes）来进行配置。这些特性帮助 EF Core 确定数据库中如何映射和处理这些属性。例如，你可以指定字段是否必填、字段长度的限制、最大值、最小值等。

### **常用的 Data Annotations 特性**

以下是一些常见的 Data Annotations 特性以及它们的用途：

1. **`[Key]`**  
   - **用途**：指定该属性是实体的主键。
   - **示例**：

     ```csharp
     public class Product
     {
         [Key]
         public int Id { get; set; }
     }
     ```

2. **`[Required]`**  
   - **用途**：指定该属性是必填的（不能为 `null`）。
   - **示例**：

     ```csharp
     public class Product
     {
         [Required]
         public string Name { get; set; }
     }
     ```

3. **`[StringLength]` / `[MaxLength]` / `[MinLength]`**  
   - **用途**：指定字符串字段的最大长度和最小长度。
   - **示例**：

     ```csharp
     public class Product
     {
         [StringLength(100)] // 最大长度为 100
         public string Name { get; set; }
     }
     ```

4. **`[Range]`**  
   - **用途**：指定属性的值必须在给定范围内（适用于数值类型，如 `int`、`decimal`）。
   - **示例**：

     ```csharp
     public class Product
     {
         [Range(1, 1000)] // 价格范围必须在 1 到 1000 之间
         public decimal Price { get; set; }
     }
     ```

5. **`[MaxLength]`**  
   - **用途**：为字符串属性指定最大长度。
   - **示例**：

     ```csharp
     public class Product
     {
         [MaxLength(255)] // 字符串最大长度为 255
         public string Description { get; set; }
     }
     ```

6. **`[Column]`**  
   - **用途**：为属性指定数据库中的列名和列的数据类型。
   - **示例**：

     ```csharp
     public class Product
     {
         [Column("ProductName", TypeName = "varchar(100)")]
         public string Name { get; set; }
     }
     ```

7. **`[ForeignKey]`**  
   - **用途**：指定外键关联的字段。
   - **示例**：

     ```csharp
     public class Order
     {
         public int ProductId { get; set; }
         [ForeignKey("ProductId")]
         public Product Product { get; set; }
     }
     ```

8. **`[NotMapped]`**  
   - **用途**：将属性标记为不需要映射到数据库的列。
   - **示例**：

     ```csharp
     public class Product
     {
         [NotMapped]
         public string DisplayName => $"{Name} - {Price}";
     }
     ```

9. **`[Timestamp]`**  
   - **用途**：指定该属性是用于乐观并发控制的时间戳字段。
   - **示例**：

     ```csharp

     
     public class Product
     {
         [Timestamp]
         public byte[] RowVersion { get; set; }
     }
     ```

10. **`[EmailAddress]`**  
    - **用途**：验证属性是否为有效的电子邮件地址。
    - **示例**：

      ```csharp
      public class User
      {
          [EmailAddress]
          public string Email { get; set; }
      }
      ```

11. **`[Phone]`**  
    - **用途**：验证属性是否为有效的电话号码。
    - **示例**：

      ```csharp
      public class User
      {
          [Phone]
          public string PhoneNumber { get; set; }
      }
      ```

# `IEntityTypeConfiguration<T>`

IEntityTypeConfiguration`<T>` 是 Entity Framework Core (EF Core) 中的一个接口，允许你为实体类型提供配置逻辑。它是 EF Core 提供的 Fluent API 的一部分，用于将实体的配置（如表名、主键、外键、列约束、索引等）从 DbContext 类中分离出来，帮助你保持代码的组织性和可维护性。

- 分离配置逻辑：IEntityTypeConfiguration`<T>` 接口允许你将配置逻辑从 DbContext 中提取到单独的类中，使代码更清晰、可维护。特别是在实体模型很复杂时，使用 IEntityTypeConfiguration<T> 可以将每个实体的配置单独管理。
- 实现 Fluent API 配置：通过实现该接口的 Configure 方法，你可以利用 Fluent API 为实体指定数据库表名、列类型、关系（如一对多、一对一）等属性。
- 配置继承：你可以通过继承 IEntityTypeConfiguration`<T>`接口来为派生实体提供配置，从而实现配置的继承和重用。

```cs

public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {   
        // 配置实体映射到的表名及架构：
        builder.ToTable("Books");

        // 配置字段的数据类型、必填属性、默认值等：
        builder.Property(b => b.Title).IsRequired().HasMaxLength(100);
        builder.Property(b => b.Price).HasColumnType("decimal(18, 2)");

        // 配置主键
        builder.HasKey(b => b.Id);

        // 配置关系
        builder.HasOne(b => b.Category)
               .WithMany(c => c.Books)
               .HasForeignKey(b => b.CategoryId);

        // 配置索引
        builder.HasIndex(b => b.Title);


        // 配置字段的值转换，例如枚举类型转字符串：
        builder.Property(p => p.Status).HasConversion<string>();
        

        // 添加初始数据
        builder.HasData(new Book { Id = 1, Name = "Laptop", Price = 1000 });

    }
}
```

## Fluent API

```cs
public class BookConfiguration : IEntityTypeConfiguration<Book>
{
    public void Configure(EntityTypeBuilder<Book> builder)
    {
        builder.Property(b => b.Name)
            .HasMaxLength(100)  // 限制字符串最大长度为 100
            .IsRequired();      // 设置为必填字段

        builder.Property(b => b.Description)
            .HasMaxLength(500); // 限制描述字段最大长度为 500

        builder.Property(p => p.Price)
          .HasColumnType("decimal(18,2)");  // 设置 decimal 类型，精度为 18，规模为 2    

        builder.Property(e => e.EventDate)
            .HasColumnType("datetime2");  // 设置数据库中为 datetime2 类型

        builder.Property(o => o.Status)
            .HasConversion<string>();  // 将枚举值存储为字符串类型

        builder.Property(e => e.HireDate)
            .IsRequired(false);  // 允许 HireDate 为 null

        builder.Property(e => e.HireDate)
            .HasDefaultValueSql("GETDATE()");  // 设置默认值为当前日期时间

        


    }
}
```
