---
title: 修改已经提交的commit的用户名和邮箱
date: 2022-10-12
category:
  - git
---

在项目根目录创建 email.sh

```sh
#!/bin/sh

git filter-branch --env-filter '

OLD_EMAIL="old@email"
CORRECT_NAME="newName"
CORRECT_EMAIL="new@email"

if [ "$GIT_COMMITTER_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_COMMITTER_NAME="$CORRECT_NAME"
    export GIT_COMMITTER_EMAIL="$CORRECT_EMAIL"
fi
if [ "$GIT_AUTHOR_EMAIL" = "$OLD_EMAIL" ]
then
    export GIT_AUTHOR_NAME="$CORRECT_NAME"
    export GIT_AUTHOR_EMAIL="$CORRECT_EMAIL"
fi
' --tag-name-filter cat -- --branches --tags
```

在 git bash 执行

```bash
./email.sh
```

在将文件推到远程仓库

```bash
git push origin --force --all
```
