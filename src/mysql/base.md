
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

## DDL

## DML

## DQL

## DCL

## 函数

## 约束

## 多表查询

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
