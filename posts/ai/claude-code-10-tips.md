---
title: Claude Code 10 倍效率的 10 个隐藏技巧
date: 2026-02-06
---

# Claude Code 10 倍效率的 10 个隐藏技巧

Claude Code 自发布以来，迅速成为 AI 编程领域的明星工具。然而，大多数开发者只使用了它 10% 的功能。Claude Code 创始人 Boris Cherny 分享了团队内部使用的最佳实践，揭示了如何将其从简单的 CLI 工具升级为支持并行、具备规划能力、能自我进化的"数字研发团队"。

## 1. 并行工程——多线程并发

**核心技巧：** 利用 git worktree 创建 3-5 个独立工作目录，每个目录启动独立的 Claude Session，分别处理不同功能。

这是最大的生产力提升。你的大脑带宽不再受限于 AI 的生成速度，而是受限于"多任务指挥能力"：

- 窗口 1：重构后端 API
- 窗口 2：编写前端组件
- 窗口 3：运行全链路测试

团队建议：为 worktree 设置 shell 别名（如 za, zb, zc），一键切换。还可以设置专门的 "analysis" worktree 用于日志分析和查询执行。

## 2. 左右互搏——Agent 审查 Agent

**核心技巧：** 让 AI 审查 AI 的输出。

实践方法：
- **Session A (Writer)：** 负责生成计划和代码
- **Session B (Reviewer)：** 扮演 "Staff Engineer"，专门负责审查和挑刺

这种方式不仅能发现 Bug，还能显著提升代码的鲁棒性。当任务出错时，不要强行推进，回到 Plan Mode 重新规划。

## 3. Plan Mode 的"一击必杀"

**核心技巧：** 复杂任务先在 Plan Mode 中打磨计划，再切换到 Execute Mode 一次性完成实现。

操作方法：按 `Shift+Tab` 进入 Plan Mode，将精力全部花在打磨计划上。一旦计划完美，让 Claude "One-shot" 完成实现。

**关键要点：**
- 验证步骤也要让 Claude 进入 Plan Mode
- 两个 Claude 分工：一个写计划，一个做审查
- 出现问题时，回到 Plan Mode 重新规划，不要强行推进

## 4. 子智能体探索

**核心技巧：** 使用多个子智能体并行探索代码库。

命令示例：
```
use 5 subagents to explore the codebase and map out the dependency graph
```

这 5 个子智能体会并行阅读代码，互不干扰，最后将精华信息汇总给主 Agent。相当于派出了 5 个侦察兵，特别适合处理陌生的大型代码库，避免主 Agent 上下文溢出。

## 5. 把重复劳动封装为 Skill

**核心技巧：** 如果某件事一天要做两次以上，就把它写成 Skill。

实用示例：
- `/techdebt`：每次会话结束前运行，自动扫描并删除重复代码
- `/sync`：将 Slack、GDrive、Asana、GitHub 同步到一个上下文转储中
- `/review`：dbt 模型的代码审查和测试

这些自定义技能可以提交到 git，在所有项目中复用。

## 6. 自我进化的 CLAUDE.md

**核心技巧：** 不要手写规则，让 Claude 自己写。当它犯错并被你修正后，说：

```
更新 CLAUDE.md，让同样的错误不再发生
```

Claude 非常擅长为自己编写规则。持续迭代优化 CLAUDE.md，直到 Claude 的错误率下降到可测量的水平。

进阶技巧：让 Claude 管理每个任务/项目的 notes 目录，每个 PR 后更新，然后在 CLAUDE.md 中引用这些笔记。

## 7. Slack 驱动修 Bug

**核心技巧：** 配置 Slack MCP，实现零上下文切换。

操作流程：
1. 在 Claude Code 中直接粘贴 Slack 上的 Bug 链接
2. 只说一个字："fix"
3. Claude 自动读取 Slack 讨论上下文，复现问题，提交修复

告别"看到 Bug → 复制报错 → 切换 IDE → 粘贴报错"的低效流程。

## 8. Chrome 驱动验 UI

**核心技巧：** 配置 Chrome MCP，让 Claude 自己验证前端代码。

工作流程：
1. Claude 写完代码
2. 自动打开浏览器
3. 截图对比设计稿
4. 自动点击按钮进行验证

正如 Boris 所说："Chrome MCP 是一个游戏规则改变者。"

## 9. 任务拆解的思维方式

**核心技巧：** 将大任务拆分为多个子任务，每个子任务使用独立的子 Agent。

策略：
- 一个问题使用一个子 Agent
- 让子 Agent 相互讨论得出答案
- 使用 diff 格式进行代码审查（比行号范围更健壮）

把 AI 当作人类团队成员：明确任务边界，提供清晰上下文，让它自主决策。

## 10. 持续运行——Stop Hooks

**核心技巧：** 使用 Stop Hooks 让 Claude 持续运行数小时甚至数天。

当 Claude 停止时，Stop Hook 可以"戳"它继续工作。例如，可以在任务完成后自动触发下一个任务，或在遇到错误时自动重试。

最新版本的 Claude Code 支持在自定义 Agent 的 frontmatter 中添加 hooks，这意味着你可以为特定任务定义专门的持续运行策略。

## 总结

这 10 个技巧的核心思想：

| 维度 | 核心理念 |
|-----|---------|
| **并行化** | 一个人就是一支队伍，多 Session 并行工作 |
| **规划优先** | 复杂任务先规划再执行，追求一次性成功 |
| **自动化** | 重复任务技能化，Bug 修复流程化 |
| **自我进化** | 让 Claude 自己学习，持续优化规则 |
| **工具整合** | 集成 Slack、Chrome 等工具，零上下文切换 |

正如 Boris Cherny 所说："软件工程正在改变，我们正在进入编程历史的新阶段。而这仅仅是个开始。"

---

## 参考

- Boris Cherny 原推文：https://x.com/bcherny/status/2017742741636321619
- Claude Code 官方文档：https://code.claude.com/docs
