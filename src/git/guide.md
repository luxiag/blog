---
title: Git
date: 2021-01-02
category:
  - Git
---


"HEAD"当前活跃分支的游标,

```sequence Greetings
Original ->> WorkSpace:  edit file
WorkSpace ->> Original: git checkout .(已跟踪)
WorkSpace ->> Original: git clean -df(未跟踪)
WorkSpace ->> Stage: git add .
Stage ->> WorkSpace: git reset HEAD/[fileName]
Stage ->> Repository: git commit
Repository ->>Stage: git reset --soft HEAD^
Repository ->> Remote: git push
Remote ->> Repository: git fetch
Remote ->> Repository: git remote update
Remote ->> WorkSpace: git pull
```






# stash

代码写一半，有bug要改

```bash
# 隐藏
git stash
# 弹出
git stash pop
```

# branch

## merge 和 rebase

```txt
     D---E test
    /
A---B---C---F master
```
`git merge test`

```txt
     D--------E
    /          \
A---B---C---F---G    test , master

```
`git rebase test`

```txt
 A---C---D---E---C `---F` test , master

```

## fork项目更新

```bash
git remote add <originname> <gitaddress>
git fetch <originname>
git checkout master
git rebase <originname>/master
```

## 合并其他分支的文件

```bash
# 合并其他分支的文件
git checkout <其他分支>  <合并的文件路径>
# --patch 交互式地从另一个分支或提交中选择性地合并文件的一部分
git checkout --patch <其他分支>  <合并的文件路径>
```


# commit

## 更改提交的commit注释

```bash
git commit --amend -m "new commit message"
```
## 找回被删除的文件

```bash
#  查找删除文件的记录， 获取对应的commitID及要恢复的文件路径filepath
git log --diff-filter=D --summary
#  恢复filepath这个文件， 原理： 撤回filepath这个文件到上次(～1)提交的commit状态
git checkout <commitID>~1 filepath
```
## 本地回到某次commit

```bash
# 会清除工作区和暂存区
git reset <commitId> --hard
```
## 合并单个commit

把某个commit id提交合并到当前分支
```bash
# 把某个commit id提交合并到当前分支
git cheery-pick <commitID>
```

## 合并多个commit


合并[startcommit] ~ [endCommitID] 到master分支
```bash
# 创建一个commit到[endcommitId]的新分支
git checkout -b <newbranch> <endcommitId>
# 从[startcommit]开始合并
git rebase --onto master <startcommit>^
```

## 将多个commit信息合并为一个commit


```bash
# 从HEAD版本开始往过去数3个版本
$ git rebase -i HEAD~3

# 合并到指定版本号（不包含此版本）
$ git rebase -i [commitid]
```
![](./images/guide/3371491733128342975.png)
![](./images/guide/3371491733128363601.png)

pick：保留该commit`（缩写:p) `
squash：将该commit和前一个commit合并`（缩写:s）`
![](./images/guide/3371491733128674792.png)
保存后再次进入vim
![](./images/guide/3371491733129012515.png)
更改去掉前面的commit信息，将最后一次的commit信息 `a-3`改为`a-1 and a-3`
![](./images/guide/3371491733129097719.png)


**vim操作**
打开文件：`vim 文件名`
编辑文件：进入编辑模式（按 `i` 键）
保存文件：退出插入模式（按 `Esc` 键），然后输入 `:w` 或 `:wq`
光标移动、复制粘贴、删除等操作在普通模式下进行
末行模式下的操作包括保存退出、替换、分屏等

# tag

## 对当前最新的commit打tag

```bash
git tag v1.0
```

## 对历史提交的


# rebase and revert