---
title: Dockerfile
date: 2024-11-26
category: 
    - Docker
--- 



# guide

Dockerfile 是一个文本文件，用于指导 Docker 构建镜像（images）

# 镜像的选择

- 基础镜像尽量选择官方的，比如 `alpine`，`ubuntu`，`centos` 等
- 镜像的标签尽量选择 `latest`，因为 `latest` 表示最新的稳定版本
- 镜像的标签尽量选择 `slim`，因为 `slim` 表示精简版，体积更小
- 镜像的标签尽量选择 `alpine`，因为 `alpine` 是基于 `musl libc` 和 `busybox` 的轻量级操作系统，体积更小，安全性更高

```dockerfile
FROM nginx:1.21.0-alpine

ADD index.html /user/share/nginx/html/index.html

```

```shell
docker image build -t nginx-demo .
```

`docker image build -t nginx-demo .` 是一个 Docker 命令，用于根据当前目录中的 Dockerfile 构建一个新的镜像，并将其命名为 `nginx-demo`。这个命令的各个部分解释如下：

- `docker image build`：这是 Docker 命令，用于构建新的镜像。
- `-t`：这是 `docker image build` 命令的选项，用于为镜像指定一个或多个标签。在这个例子中，标签是 `nginx-demo`。
- `nginx-demo`：这是新镜像的名称。
- `.`：这是 Dockerfile 的路径。`.` 表示当前目录，所以 Docker 会在这个目录中查找 Dockerfile 来构建镜像。
当你运行这个命令时，Docker 会读取当前目录中的 Dockerfile，并根据其中的指令构建一个新的镜像。构建完成后，这个镜像将具有标签 `nginx-demo`，并且你可以使用这个镜像来创建和运行容器。

# RUN

用于在Image里执行指令，比如安装 软件，下载文件

```dockerfile
FROM nginx:1.21.0-alpine
RUN apt-get update && apt-get install -y curl
Run curl -o /usr/share/nginx/html/index.html https://www.baidu.com
```

```dockerfile
FROM nginx:1.21.0-alpine
RUN apt-get update && apt-get install -y curl \
    curl -o /usr/share/nginx/html/index.html https://www.baidu.com
```

# 文件操作

```dockerfile

# 设置的工作目录路径。如果你不指定路径，默认的工作目录是 /

WORKDIR /path/to/workdir
# COPY <src> <dst>
#  从当前目录（.）复制所有文件和目录到容器的 /app 目录。
COPY . /app
#  从当前目录（.）复制 hello.py 文件到容器的 /app 目录。
COPY hello.py /app/hello.py

# ADD <src> <dst>
# 类似于 COPY，但可以处理压缩文件，自动解压文件。
#  从当前目录（.）复制所有文件和目录到容器的 /app 目录。
ADD . /app
#   从当前目录添加 package.tgz 文件到容器的 /app/ 目录，并自动解压。
ADD ./package.tgz /app/ 
```

# 环境变量

## ARG

用于定义构建参数，可以在构建时传入参数，比如版本号，镜像的标签等

```dockerfile
FROM nginx:1.21.0-alpine
ARG NODE_VERSION 14.17.0
RUN npm install -g npm@${NODE_VERSION}
```

## ENV

用于定义环境变量，可以在容器中引用，比如设置时区，设置语言等

```dockerfile
FROM nginx:1.21.0-alpine
ENV NODE_VERSION 14.17.0
RUN npm install -g npm@${NODE_VERSION}
```

- ARG 用于定义构建时传递的参数，它们在构建过程中使用。
- ENV 用于设置永久环境变量，它们在容器启动时设置，并在容器运行时一直存在。

## 启动命令

### CMD

CMD可以用来设置容器启动时默认会执行命令

- 容器启动时默认执行的命令
- 如果在运行容器时指定了其他命令，则 CMD 指定的命令会被覆盖
- 如果 Dockerfile 中有多个 CMD 指令，则只有最后一个 CMD 指令会被执行

```dockerfile
FROM nginx:1.21.0-alpine
CMD ["nginx", "-g", "daemon off;"]
```

### ENTRYPOINT

ENTRYPOINT 用于设置容器启动时默认会执行的命令，与 CMD 类似，但 ENTRYPOINT 指定的命令不会被覆盖，除非在运行容器时指定了 `--entrypoint` 参数

- 容器启动时默认执行的命令
- 如果在运行容器时指定了其他命令，则这些命令会被作为参数传递给 ENTRYPOINT 指定的命令
- 如果 Dockerfile 中有多个 ENTRYPOINT 指令，则只有最后一个 ENTRYPOINT 指令会被执行

```dockerfile
FROM nginx:1.21.0-alpine
ENTRYPOINT ["nginx", "-g", "daemon off;"]
```

- CMD 和 ENTRYPOINT 都可以用来设置容器启动时默认执行的命令，但它们的用法和特性有所不同。CMD 指令指定的命令可以被覆盖，而 ENTRYPOINT 指令指定的命令不会被覆盖。CMD 指令指定的命令可以作为参数传递给 ENTRYPOINT 指令指定的命令。

## 镜像构建

```shell
docker image build -t nginx-demo .
```

- `docker image build`：这是 Docker 命令，用于构建新的镜像。
- `-t`：这是 `docker image build` 命令的选项，用于为镜像指定一个或多个标签。在这个例子中，标签是 `nginx-demo`。
- `nginx-demo`：这是新镜像的名称。
- `.`：这是 Dockerfile 的路径。`.` 表示当前目录，所以 Docker 会在这个目录中查找 Dockerfile 来构建镜像。
