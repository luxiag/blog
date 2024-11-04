

## 创建实体

Microsoft.EntityFrameworkCore.SqlServer

Book.cs
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

BookEntityConfig
```cs
    public class BookEntityConfig:IEntityTypeConfiguration<Book>
    {
        public void Configure(EntityTypeBuilder<Book> builder) {
            builder.ToTable("T_Books");
            builder.Property(b => b.Title).HasMaxLength(500).IsRequired();
        
        }
    }
```

MyDbContext
```cs
    public class MyDbContext:DbContext      
    {
        public DbSet<Book> Books { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlServer("Server=(localdb)\\MSSQLLocalDB;Database=c-sharp-learn;Trusted_Connection=True");
        }
    }

```

### 生成Migrations

Microsoft.EntityFrameworkCore.Tools
更改数据类型要重新生成Migration 
```PM
Add-Migration customName
```

更新数据表结构用生成的Migration

```PM
Update-database
```