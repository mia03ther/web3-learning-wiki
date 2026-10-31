# MCP 与 AI Agents

Model Context Protocol（MCP）与 AI Agent 基础设施的学习笔记：Agent 如何调用工具、如何完成支付、如何建立信任。

## 主题

- **MCP 基础**：MCP 是什么、为什么它成为 Agent 工具调用的事实标准；
- **Agent 支付**：x402 等 Agent 自主支付协议、Gasless 交易与支付基础设施；
- **可信 Agent**：可审计推理、声誉与链上记录，Agent 信任基础设施（VeritasOS 方向）；
- **工具调用**：Function Calling、工具注册、权限与预算控制。

## 用几个现场例子理解

### 支付：从调用付费资源到买到服务

[ETHShenzhen Day 1 的 FluxA 分享](../field-notes/ethshenzhen-2026/day1-workshops.md#part-3) 从 x402 谈到现实商户的结算和异常订单。Agent 发起付款之后，还要考虑商家能不能接单、服务怎样交付。

### 权限：预算检查交给独立程序

[Text Permit](../field-notes/pitch-night.md#项目三text-permit--给一群-ai-立预算和权限规矩) 用共同预算和权限规则管理多个 Agent 的请求。[ETHShenzhen 信任边界圆桌](../field-notes/ethshenzhen-2026/day2-afternoon.md#part-5) 则用订蛋糕的例子，讨论金额、交易对象、时间和必要数据该怎样限制。两篇可以一起读。

### 工具：看完整工作流怎么完成

[RustChinaConf 的 Kimi 展位交流](../field-notes/rustchinaconf-2026.md#part-3) 里有 Computer Use 操作 Blender 的例子，也讨论了 API、命令行和脚本接口的选择。挑哪种工具，要看任务的完成效果、稳定性和交付要求。

## 相关资料

- [核心概念词典](../fundamentals/core-concepts.md) —— Agent / MCP 相关术语；
- [Monad 黑客松与 Agent 金融](../field-notes/monad-hackathon.md) —— Agent 支付与 AI 金融实战记录；
- [路演夜 · 四个 AI × Web3 项目](../field-notes/pitch-night.md) —— 多 Agent 预算控制项目 Text Permit。

!!! note "板块建设中"
    这个板块正在成长中。欢迎在 [贡献指南](../contributing.md) 的指导下补充笔记。
