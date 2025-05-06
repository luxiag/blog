---
title: MySQL数据库入门整理笔记
date: 2025-04-28
category:
  - MySQL
tag:
  - SQL
---      


启动MySQL客户端程序

`/bin`目录下`mysql`执行文件输入命令

```shell
mysql -h主机名  -u用户名 -p密码
```

 参数   描述   示例  
 `-u root`   以 `root` 用户身份连接   `mysql -u root`  
 `-p`   提示输入密码   `mysql -u root -p`  
 `-h 127.0.0.1`   连接到本地主机   `mysql -u root -h 127.0.0.1`  
 `-P 3306`   使用默认端口 `3306`   `mysql -u root -h 127.0.0.1 -P 3306`  
 `-D mydatabase`   连接到 `mydatabase` 数据库   `mysql -u root -p -D mydatabase`  
 `--default-character-set=utf8`   指定字符集为 UTF-8   `mysql -u root -p --default-character-set=utf8`  
 `-e "SELECT * FROM mytable;"`   执行 SQL 查询并退出   `mysql -u root -p -e "SELECT * FROM mytable;"`  

性能调优，索引优化，事务处理

## 数据类型

|类型大类 | 代表数据类型 | 特点|
|---|---|---|
|数值 | INT, BIGINT, DECIMAL | 整数、小数|
|字符串 | VARCHAR, TEXT, BLOB | 文字、大文本、二进制|
|时间 | DATE, DATETIME, TIMESTAMP | 日期时间|
|布尔 | BOOLEAN (TINYINT) | 真假值|
|JSON | JSON | 结构化数据|

### 整数 Number

|类型 | 范围（有符号） | 特点|
|---|---|---|
|TINYINT | -128 ~ 127 | 1字节，很小|
|SMALLINT | -32,768 ~ 32,767 | 2字节|
|MEDIUMINT | -8百万 ~ 8百万 | 3字节|
|INT / INTEGER | -21亿 ~ 21亿 | 4字节，最常用|
|BIGINT | 超大范围（9千万亿） | 8字节，适合大数据|

### 字符串类型 String

|类型 | 说明|
|---|---|
|CHAR(n) | 定长字符串，占用固定n个字符空间。适合存固定长度的，比如身份证号|
|VARCHAR(n) | 变长字符串，最多n字符，常用！|
|TEXT | 大文本（最大64KB），适合存文章正文|
|TINYTEXT、MEDIUMTEXT、LONGTEXT | 不同大小级别的超大文本|
|BLOB | 二进制大对象（图片、文件等）|

### 日期时间类型 Date

|类型 | 说明|
|---|---|
|DATE | 日期，格式：YYYY-MM-DD|
|TIME | 时间，格式：HH:MM:SS|
|DATETIME | 日期时间，格式：YYYY-MM-DD HH:MM:SS|
|TIMESTAMP | 时间戳，格式：YYYY-MM-DD HH:MM:SS，常用于记录数据的创建时间、更新时间等|
|YEAR | 年份，格式：YYYY|

### 布尔类型 Boolean

|类型 | 说明|
|---|---|
|BOOLEAN | 真假值，0 或 1，常用！|

### JSON类型 JSON

|类型 | 说明|
|---|---|
|JSON | 结构化数据，常用于存储 JSON 格式的数据|

## SQL

### SQL通用语法

1. SQL 语句可以单行或多行书写，以分号结尾。
2. 可以用空格和缩进来增强语句的可读性。
3. MySQL 数据库的 SQL 语句不区分大小写，关键字建议使用大写。
4. 3 种注释：单行注释：-- 注释内容 或 # 注释内容（MySQL 特有） 多行注释：/*注释内容*/

### DDL（Data Definition Languages）数据定义语言

DDL（Data Definition Language，数据定义语言） 主要负责定义和管理数据库结构，比如：创建、修改、删除数据库和表。

动作 | SQL
创建数据库 | CREATE DATABASE
创建表 | CREATE TABLE
修改表结构 | ALTER TABLE
删除表 | DROP TABLE
删除数据库 | DROP DATABASE
清空表数据 | TRUNCATE TABLE

查询
查询所有数据库

```sql
SHOW DATABASES;
```

查询当前数据库

```sql
SELECT DATABASE();
```

创建数据库

```sql
CREATE DATABASE 数据库名;
CREATE DATABASE [IF NOT EXISTS] 数据库名 [DEFAULT CHARSET 字符集] [COLLATE 排序规则];
CREATE DATABASE 数据库名 CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

删除数据库

```sql
DROP DATABASE 数据库名;
DROP DATABASE [IF EXISTS] 数据库名;
```

修改数据库

```sql
ALTER DATABASE 数据库名 CHARACTER SET 字符集 COLLATE 排序规则;
```

创建表

```sql
CREATE TABLE 表名 (
    列名1 数据类型1,
    列名2 数据类型2,
    ...
    列名n 数据类型n
);
CREATE TABLE 表名 (
    列名1 数据类型1 COMMENT '注释内容',
    列名2 数据类型2 COMMENT '注释内容',
    ......
    列名n 数据类型n COMMENT '注释内容'
);
```

查询表

```sql
SHOW TABLES;
```

查询表结构

```sql
DESC 表名;
DESCRIBE 表名;
```

查询指定表的建表语句

```sql
SHOW CREATE TABLE 表名;
```

修改表

```sql
ALTER TABLE 表名
ADD 列名 数据类型 [约束],             -- 添加列
MODIFY 列名 新数据类型 [新约束],      -- 修改列
CHANGE 旧列名 新列名 新数据类型 [约束], -- 重命名列
DROP COLUMN 列名;                    -- 删除列

-- 给 users 表加一列 phone
ALTER TABLE users ADD phone VARCHAR(20);

-- 修改 email 列长度
ALTER TABLE users MODIFY email VARCHAR(150);

-- 把 phone 列改名为 mobile
ALTER TABLE users CHANGE phone mobile VARCHAR(20);

-- 删除 mobile 列
ALTER TABLE users DROP COLUMN mobile;
```

删除表

```sql
DROP TABLE 表名;
DROP TABLE [IF EXISTS] 表名;
```

清空表数据

```sql
TRUNCATE TABLE 表名;
```

#### 创建简单电商系统

---

第一步：创建数据库

```sql
CREATE DATABASE OrderSystem CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
```

然后**使用这个数据库**：

```sql
USE OrderSystem;
```

---

第二步：创建表

- **用户表 users**

```sql
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(100) NOT NULL COMMENT '密码（加密存储）',
    email VARCHAR(100) COMMENT '邮箱',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
);
```

- **订单表 orders**

```sql
CREATE TABLE orders (
    id INT PRIMARY KEY AUTO_INCREMENT COMMENT '订单ID',
    user_id INT NOT NULL COMMENT '用户ID',
    order_number VARCHAR(100) NOT NULL UNIQUE COMMENT '订单编号',
    total_amount DECIMAL(10,2) NOT NULL COMMENT '订单总金额',
    status ENUM('pending', 'paid', 'shipped', 'completed', 'cancelled') DEFAULT 'pending' COMMENT '订单状态',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '下单时间',
    FOREIGN KEY (user_id) REFERENCES users(id) -- 外键关联用户表
);
```

---

第三步：修改表（比如后面想给订单表加一个备注字段）

```sql
ALTER TABLE orders ADD remark VARCHAR(255) COMMENT '备注';
```

---

第四步：清空表（如果想清理测试数据）

```sql
TRUNCATE TABLE orders;
TRUNCATE TABLE users;
```

---

第五步：删除表或数据库（慎用！！）

- 删除表：

```sql
DROP TABLE orders;
DROP TABLE users;
```

- 删除数据库：

```sql
DROP DATABASE OrderSystem;
```

---

### DML （Data Manipulation Language）数据操作语言

Data Manipulation Language（DML，数据操作语言） 是用来 操作表中的数据 的，比如 增、删、改、查。

|操作 | 关键字 | 作用|
|---|---|---|
|插入数据 | INSERT | 向表中增加新数据|
|更新数据 | UPDATE | 修改表中的已有数据|
|删除数据 | DELETE | 删除表中的已有数据|
|查询数据 | SELECT | 查询表中的数据|

插入数据（INSERT）

```sql
INSERT INTO 表名 (列1, 列2, ...) VALUES (值1, 值2, ...);

INSERT INTO users (username, password, email)
VALUES ('alice', '123456', 'alice@example.com');

-- 插入多条数据
INSERT INTO 表名 (列1, 列2, ...) VALUES 
(值1, 值2, ...),
(值3, 值4, ...);

INSERT INTO users (username, password, email) VALUES
('bob', '654321', 'bob@example.com'),
('carol', 'abcdef', 'carol@example.com');
```

更新数据（UPDATE）

```sql
UPDATE 表名
SET 列1 = 新值1, 列2 = 新值2
WHERE 条件;
--  注意：一定要加 WHERE 条件！

UPDATE users
SET email = 'alice_new@example.com'
WHERE username = 'alice';
-- 修改多个字段
UPDATE users
SET password = 'newpass', email = 'new@example.com'
WHERE id = 1;

```

删除数据（DELETE）

```sql
DELETE FROM 表名 WHERE 条件;
DELETE FROM users WHERE id = 3;

-- 删除全部数据
DELETE FROM users;
```

查询数据（SELECT）

```sql
-- 查询所有列
SELECT * FROM 表名;

-- 查询指定列
SELECT 列1, 列2 FROM 表名;

-- 查询指定列并重命名
SELECT 列1 AS 别名1, 列2 AS 别名2 FROM 表名;

-- 查询指定列并过滤重复数据
SELECT DISTINCT 列1, 列2 FROM 表名;

-- 带条件查询
SELECT * FROM users WHERE id = 1;
```

插入时防止重复 INSERT IGNORE

```sql
INSERT IGNORE INTO users (username, password, email)
VALUES ('alice', '123456', 'alice@example.com');
```

INSERT ... ON DUPLICATE KEY UPDATE

```sql
INSERT INTO users (username, password, email)
VALUES ('alice', '123456', 'alice@example.com')
ON DUPLICATE KEY UPDATE
email = 'alice_new@example.com';
-- 如果 username 已存在，就把 email 更新为新值
-- 否则就插入一条新记录。
```

批量更新CASE WHEN

```sql
-- 批量把不同ID的用户，名字改掉：
UPDATE users
SET username = CASE id
    WHEN 1 THEN 'new_name1'
    WHEN 2 THEN 'new_name2'
    WHEN 3 THEN 'new_name3'
END
WHERE id IN (1, 2, 3);
```

更新+限制条数

```sql

UPDATE users SET email = 'test@example.com' WHERE is_deleted = 0 LIMIT 5;
```

## DQL （Data Query Language）数据查询语言

Data Query Language（DQL，数据查询语言），简单说，就是用来查询数据的SQL语句。

- WHERE（筛选）

- GROUP BY（分组）

- HAVING（分组后的筛选）

- ORDER BY（排序）

- LIMIT（分页）

基本查询（SELECT）

```sql
SELECT 列1, 列2 FROM 表名;
SELECT username, email FROM users;
```

条件筛选（WHERE）

```sql
SELECT * FROM users WHERE username = 'alice';

SELECT * FROM users WHERE email IS NOT NULL;
SELECT * FROM users WHERE username LIKE 'a%'; -- a开头
SELECT * FROM users WHERE id IN (1, 2, 3);
```

|运算符 | 说明|
|---|---|
|= | 等于|
|<> 或 != | 不等于|
|> / < | 大于 / 小于|
|>= / <= | 大于等于 / 小于等于|
|BETWEEN A AND B | 在区间|
|IN (值1, 值2) | 在列表中|
|LIKE | 模糊匹配（比如姓名以A开头）|
|IS NULL / IS NOT NULL | 是否为空|

分组（GROUP BY）
将查询结果按某个字段分类汇总：

```sql
-- 按订单状态（status）分类
-- 每种状态统计有多少条订单（count）
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status;
```

分组后筛选（HAVING）
HAVING 是对分组之后的数据再进行筛选的（WHERE 是分组前筛选）

```sql
-- 查出订单数大于10的状态类型：
SELECT status, COUNT(*) AS count
FROM orders
GROUP BY status
HAVING count > 10;
```

排序（ORDER BY）
按某个字段升序或降序排列：

- ASC：升序（默认）

- DESC：降序

```sql
SELECT * FROM orders ORDER BY created_at DESC; -- 按创建时间降序排列
SELECT * FROM orders ORDER BY status ASC, created_at DESC; -- 按状态升序，再按创建时间降序
```

限制返回条数（LIMIT）

```sql
SELECT * FROM users LIMIT 5;

-- 跳过20行，从第21行开始取10条。
SELECT * FROM users LIMIT 10 OFFSET 20;
-- 简写：跳过20条，取10条。
SELECT * FROM users LIMIT 20, 10;

```

### 聚合函数

|函数名 | 作用 | 示例|
|---|---|---|
|COUNT() | 计数，统计数量 | COUNT(*), COUNT(id)|
|SUM() | 求和 | SUM(price)|
|AVG() | 求平均数 | AVG(score)|
|MAX() | 求最大值 | MAX(age)|
|MIN() | 求最小值 | MIN(salary)|
|GROUP_CONCAT() | 把一组值合并成字符串 | GROUP_CONCAT(name)|

```sql
SELECT COUNT(*) FROM users;
-- 查询用户表总共有多少条记录

SELECT COUNT(email) FROM users;
-- 查询邮箱不为空的用户数量

SELECT SUM(order_amount) FROM orders;
-- 查询所有订单金额的总和

SELECT AVG(score) FROM students;
-- 查询学生的平均分数

SELECT MAX(price) FROM products;
-- 查询最贵的商品价格

SELECT MIN(price) FROM products;
-- 查询最便宜的商品价格

SELECT GROUP_CONCAT(name) FROM students;
-- 把所有学生名字拼成一个字符串
-- "Tom, Jerry, Alice, Bob"

SELECT GROUP_CONCAT(name SEPARATOR '|') FROM students;
-- 变成用 | 分隔


```

## DCL （Data Control Language）数据控制语言

DCL主要用于控制数据库中的访问权限和安全管理。

## 函数

|类别 | 说明 | 举例|
|---|---|---|
|数学函数 | 处理数字计算 | ABS(), ROUND(), CEIL()|
|字符串函数 | 操作字符串 | CONCAT(), SUBSTRING(), LENGTH()|
|日期时间函数 | 处理日期时间 | NOW(), CURDATE(), DATE_FORMAT()|
|聚合函数 | 汇总一组数据 | SUM(), COUNT(), AVG()（前面讲过）|
|流程控制函数 | 根据条件判断 | IF(), CASE|
|加密函数 | 做哈希或加密 | MD5(), SHA1()|

### 数学函数

|函数名 | 作用 | 示例|
|---|---|---|
|ABS() | 求绝对值 | ABS(-10) = 10|
|ROUND() | 四舍五入 | ROUND(3.14159, 2) = 3.14|
|CEIL() | 向上取整 | CEIL(3.14) = 4|
|FLOOR() | 向下取整 | FLOOR(3.14) = 3|
|RAND() | 生成随机数 | RAND()|

```sql
SELECT ABS(-10); -- 10
SELECT ROUND(3.14159, 2); -- 3.14
SELECT CEIL(3.14); -- 4
SELECT FLOOR(3.14); -- 3
SELECT RAND(); -- 0.123456789
```

### 字符串函数

|函数名 | 作用 | 示例|
|---|---|---|
|CONCAT() | 拼接字符串 | CONCAT('Hello', 'World') = 'HelloWorld'|
|SUBSTRING() | 截取子串 | SUBSTRING('HelloWorld', 1, 5) = 'Hello'|
|LENGTH() | 计算字符串长度 | LENGTH('HelloWorld') = 10|
|LOWER() | 转小写 | LOWER('HelloWorld') = 'helloworld'|
|UPPER() | 转大写 | UPPER('HelloWorld') = 'HELLOWORLD'|
|TRIM() | 去除空格 | TRIM('  Hello World  ') = 'Hello World'|
|REPLACE() | 替换字符串 | REPLACE('HelloWorld', 'World', 'MySQL') = 'HelloMySQL'|

```sql
SELECT CONCAT('Hello', 'World'); -- HelloWorld
SELECT SUBSTRING('HelloWorld', 1, 5); -- HelloWorld
SELECT LENGTH('HelloWorld'); -- 10
SELECT LOWER('HelloWorld'); -- helloworld
SELECT UPPER('HelloWorld'); -- HELLOWORLD
SELECT TRIM('  Hello World  '); -- Hello World
SELECT REPLACE('HelloWorld', 'World', 'MySQL'); -- HelloMySQL
```

### 日期时间函数

|函数名 | 作用 | 示例|
|---|---|---|
|NOW() | 获取当前日期和时间 | NOW() = '2022-01-01 12:00:00'|
|CURDATE() | 获取当前日期 | CURDATE() = '2022-01-01'|
|CURTIME() | 获取当前时间(时分秒) | CURTIME() = '12:00:00'|
|YEAR(date) | 获取年份 | YEAR('2025-04-01') = 2025|
|MONTH(date) | 获取月份 | MONTH('2025-04-01') = 4|
|DAY(date) | 获取日期 | DAY('2025-04-01') = 1|
|DATE_FORMAT() | 格式化日期时间 | DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s') = '2022-01-01 12:00:00'|
|DATEDIFF() | 计算两个日期之间的天数 | DATEDIFF('2022-01-01', '2021-01-01') = 365|

```sql
SELECT NOW(); -- 2022-01-01 12:00:00
SELECT CURDATE(); -- 2022-01-01
SELECT DATE_FORMAT(NOW(), '%Y-%m-%d %H:%i:%s'); -- 2022-01-01 12:00:00
SELECT DATEDIFF('2022-01-01', '2021-01-01'); -- 365
```

### 流程控制函数

|函数名 | 作用 | 示例|
|---|---|---|
|IF(condition, value_if_true, value_if_false) | 判断条件，返回不同值 | IF(1 > 0, 'true', 'false') = 'true'|
|CASE WHEN condition1 THEN value1 WHEN condition2 THEN value2 ... ELSE default END | 多重判断 | CASE WHEN score >= 90 THEN 'A' WHEN score >= 80 THEN 'B' ELSE 'C' END|

```sql
SELECT IF(1 > 0, 'true', 'false'); -- true
SELECT 
    name,
    CASE 
        WHEN score >= 90 THEN '优秀'
        WHEN score >= 70 THEN '良好'
        WHEN score >= 60 THEN '及格'
        ELSE '不及格'
    END AS grade
FROM students;


```

### 加密函数

|函数名 | 作用 | 示例|
|---|---|---|
|MD5() | 计算MD5哈希值 | MD5('password') = '5f4dcc3b5aa765d61d8327deb882cf99'|
|SHA1() | 计算SHA1哈希值 | SHA1('password') = '5baa61e4c9b93f3f0682250b6cf8331b7ee68fd8'|

## 约束

约束是作用于表中字段上的规则，用于限制存储在表中的数据
目的确保数据库中的数据的正确、有效性和完整性

|约束类型 | 说明 | 使用场景|
|---|---|---|
|NOT NULL | 不允许为NULL值 | 确保数据字段有值，如用户名、邮箱|
|UNIQUE | 唯一约束，保证列的值唯一 | 确保用户名、邮箱地址唯一|
|PRIMARY KEY | 主键约束，保证唯一性和非空性 | 一般用于标识每一行数据的唯一性|
|FOREIGN KEY | 外键约束，用于保证引用的完整性 | 保证父表（如用户表）与子表（如订单表）数据一致性|
|CHECK | 检查约束，用于保证字段值的合法性 | 确保年龄字段在0到150岁之间|
|DEFAULT | 默认值约束，当插入数据时，字段没有指定值时使用默认值 | 自动给某些字段赋默认值|

### NOT NULL

作用：确保某一列数据不能为空。
在插入数据时，如果没有提供这个字段的值，则会报错。

```sql
CREATE TABLE users (
    id INT NOT NULL,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100)
);
```

### UNIQUE

作用：确保列中的所有值都是唯一的，即不能重复。
但是，它可以包含NULL值（一个表可以有多个NULL值）

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE,
    email VARCHAR(100) UNIQUE
);
```

### PRIMARY KEY

作用：主键，保证该列的值唯一且不能为空。
一个表只能有一个主键。主键自动隐式添加了 NOT NULL 和 UNIQUE 约束。

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT,
    username VARCHAR(50),
    email VARCHAR(100),
    PRIMARY KEY (id)
);
```

### FOREIGN KEY

作用：外键，用于建立表与表之间的关联关系。
外键约束可以保证数据的完整性和一致性。

```sql
CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    product_name VARCHAR(100),
    FOREIGN KEY (user_id) REFERENCES users(id)
);
```

### CHECK

作用：检查约束，用于保证字段值的合法性。
MySQL 8.0.16版本开始支持CHECK约束。

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    age INT CHECK (age >= 0 AND age <= 150)
);
```

### DEFAULT

作用：默认值约束，当插入数据时，如果没有提供这个字段的值，则会使用默认值。

```sql
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50),
    email VARCHAR(100),
    age INT DEFAULT 18
);
```

## 多表查询

|类型 | 说明|
|---|---|
|INNER JOIN | 内连接，只返回两个表中符合条件的记录|
|LEFT JOIN | 左连接，返回左表的全部记录，右表匹配的有就返回，没有就补NULL|
|RIGHT JOIN | 右连接，返回右表的全部记录，左表匹配的有就返回，没有就补NULL|
|FULL JOIN | 全连接（MySQL原生不支持，需要用 UNION 模拟）|

### INNER JOIN（内连接）

只返回两张表都能匹配上的数据。

```sql
SELECT a.列1, b.列2
FROM 表A a
INNER JOIN 表B b
ON a.关联字段 = b.关联字段;
--  只显示那些【有订单】的用户。
SELECT u.username, o.amount
FROM users u
INNER JOIN orders o ON u.id = o.user_id;
```

### LEFT JOIN（左连接）

返回左表的全部数据，右表没有的用NULL补齐。

```sql
SELECT a.列1, b.列2
FROM 表A a
LEFT JOIN 表B b
ON a.关联字段 = b.关联字段;

-- 例子：查出所有用户和他们的订单（没有订单也要显示）
SELECT u.username, o.amount
FROM users u
LEFT JOIN orders o ON u.id = o.user_id;
```

### RIGHT JOIN（右连接）

反过来：以右表为主。

```sql
SELECT a.列1, b.列2
FROM 表A a
RIGHT JOIN 表B b
ON a.关联字段 = b.关联字段;

-- 查出所有订单及对应下单人（哪怕有些订单找不到用户也列出来）
SELECT u.username, o.amount
FROM users u
RIGHT JOIN orders o ON u.id = o.user_id;
```

### SELF JOIN（自连接）

一张表自己和自己连接。

```sql
SELECT a.列1, b.列2
FROM 表A a
LEFT JOIN 表A b
ON a.关联字段 = b.关联字段;

-- 查询员工及其上级的名字
SELECT e1.name AS '员工', e2.name AS '上级'
FROM employees e1
LEFT JOIN employees e2 ON e1.manager_id = e2.id;
```

### UNION

UNION 操作符用于将两个或多个 SELECT 查询的结果合并到一个结果集中。合并后的结果将包含所有查询的记录，但重复的记录默认会去除。

`employees`表
id | name | role
1 | Alice | Developer
2 | Bob | Designer
3 | Charlie | Manager

`contractors`表
id | name | role
1 | Dave | Developer
2 | Eve | Designer
3 | Frank | Developer

```sql
SELECT name, role FROM employees WHERE role = 'Developer'
UNION
SELECT name, role FROM contractors WHERE role = 'Developer'
```

查询结果
name | role
Alice | Developer
Charlie | Manager

Dave | Developer
Frank | Developer

UNION ALL 保留重复的行

```sql
SELECT name, role FROM employees WHERE role = 'Developer'
UNION ALL
SELECT name, role FROM contractors WHERE role = 'Developer';
```

name | role
Alice | Developer
Dave | Developer
Frank | Developer

### 子查询

子查询（也称为嵌套查询）是指在一个查询中嵌套另一个查询。子查询可以出现在SELECT、FROM、WHERE等子句中。

子查询可以返回标量值（单个值）、列、行或表。根据子查询返回的结果类型，可以分为以下几种：

1. 标量子查询：子查询返回单个值，通常用于比较运算符（如=、<、>等）中。
2. 列子查询：子查询返回一列值，通常用于IN、ANY、ALL等运算符中。
3. 行子查询：子查询返回一行值，通常用于比较运算符（如=、<、>等）中。
4. 表子查询：子查询返回一个表，通常用于FROM子句中。

### 标量子查询

标量子查询返回单个值，通常用于比较运算符（如=、<、>等）中。

```sql
SELECT name, age FROM employees WHERE age > (SELECT AVG(age) FROM employees);
```

### 列子查询

列子查询返回一列值，通常用于IN、ANY、ALL等运算符中。

```sql
SELECT name, age FROM employees WHERE age IN (SELECT age FROM employees WHERE department = 'IT');
```

### 行子查询

行子查询返回一行值，通常用于比较运算符（如=、<、>等）中。

```sql
SELECT name, age, department FROM employees WHERE (age, department) = (SELECT MIN(age), department FROM employees);
```

### 表子查询

表子查询返回一个表，通常用于FROM子句中。

```sql
SELECT * FROM (SELECT name, age FROM employees WHERE age > 30) AS subquery;
```

### demo练习

|表名 | 说明 | 关键字段|
|---|---|---|
|users | 用户表 | id, username|
|orders | 订单表 | id, user_id, total_amount, order_date|
|order_items | 订单明细表 | id, order_id, product_name, price, quantity|

一个用户（users）可以下很多订单（orders）
一个订单可以包含很多商品（order_items）

```txt
查询每个用户：

下了多少个订单
买了多少件商品
花了多少钱
按花的钱最多的用户排序
只展示前10名
```

```sql
SELECT 
    u.username,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(oi.quantity) AS total_products,
    SUM(oi.price * oi.quantity) AS total_spent
FROM 
    users u
LEFT JOIN 
    orders o ON u.id = o.user_id
LEFT JOIN 
    order_items oi ON o.id = oi.order_id
GROUP BY 
    u.id, u.username
ORDER BY 
    total_spent DESC
LIMIT 10;
```

```txt
查询每个用户：

只统计【2024年】内的订单
只统计【已支付】状态的订单（假设 orders.status = 'paid'）
计算下单数、购买商品总数、消费总金额
按消费金额倒序排列
只取前10名
```

```sql
SELECT 
    u.username,
    COUNT(DISTINCT o.id) AS total_orders,
    SUM(oi.quantity) AS total_products,
    SUM(oi.price * oi.quantity) AS total_spent
FROM 
    users u
LEFT JOIN 
    orders o ON u.id = o.user_id
    AND o.status = 'paid'
    AND o.order_date BETWEEN '2024-01-01' AND '2024-12-31'
LEFT JOIN 
    order_items oi ON o.id = oi.order_id
GROUP BY 
    u.id, u.username
ORDER BY 
    total_spent DESC
LIMIT 10;
```

```txt
在之前的基础上，新需求：

查询【每个用户】在【2024年支付成功的订单】中
他们【买得最多的一种商品名称】（即数量最多的商品）
同时显示：用户名、最多购买的商品名、购买数量
```

```sql
SELECT 
    t.username,
    t.product_name,
    t.total_quantity
FROM (
    SELECT 
        u.username,
        oi.product_name,
        SUM(oi.quantity) AS total_quantity,
        ROW_NUMBER() OVER (PARTITION BY u.id ORDER BY SUM(oi.quantity) DESC) AS rn
    FROM 
        users u
    LEFT JOIN 
        orders o ON u.id = o.user_id
        AND o.status = 'paid'
        AND o.order_date BETWEEN '2024-01-01' AND '2024-12-31'
    LEFT JOIN 
        order_items oi ON o.id = oi.order_id
    GROUP BY 
        u.id, u.username, oi.product_name
) t
WHERE t.rn = 1
ORDER BY t.total_quantity DESC;

```

::: info 窗口函数
窗口函数名称 (参数) OVER (
    [PARTITION BY 分组列]
    [ORDER BY 排序列]
    [窗口框架]
)

:::

```txt
查询【每个用户】在【2024年支付成功的订单】中：

统计用户的消费总额
计算在所有用户中【消费总额排名】

要显示：
用户名
总消费金额
消费排名
```

```sql
SELECT 
    u.username,
    COALESCE(SUM(oi.price * oi.quantity), 0) AS total_spent,
    RANK() OVER (ORDER BY SUM(oi.price * oi.quantity) DESC) AS spending_rank
FROM 
    users u
LEFT JOIN 
    orders o ON u.id = o.user_id
    AND o.status = 'paid'
    AND o.order_date BETWEEN '2024-01-01' AND '2024-12-31'
LEFT JOIN 
    order_items oi ON o.id = oi.order_id
GROUP BY 
    u.id, u.username
ORDER BY 
    spending_rank;

```

## 事务

## 储存引擎

## 索引

## SQL优化

## 视图

## 储存过程

## 触发器

## 锁

## InnoDB引擎

##
