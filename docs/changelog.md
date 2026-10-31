---
title: 版本发布
description: Web3 Learning Wiki 的版本发布记录：每次更新了什么内容、改进了什么体验、修了哪些问题，按 App Store「新功能」的格式写。
---

# 版本发布

<p class="w3-lead">
像 App 一样，这个 Wiki 每次更新都会发一个版本号，并在这里写清楚「新增了什么、改进了什么、修了什么」。
群里的更新通知也是从这一页摘出来的。
</p>

## 最新版本

<div class="w3-release w3-release--latest" markdown>
<div class="w3-release__head">
  <span class="w3-release__icon" aria-hidden="true"><img src="../assets/avatar/logo.jpg" alt="" width="96" height="96"></span>
  <div class="w3-release__name"><b>版本 3.0</b><span>全新改版 · ETHShenzhen 2026 现场笔记</span></div>
  <span class="w3-release__ver">v3.0.0</span>
  <span class="w3-release__date">2026-10-30</span>
</div>

<p class="w3-release__summary">把整个 Wiki 从里到外重做了一遍：新设计、新导航、新专题，顺便修好了一堆一直没生效的功能。</p>

<p class="w3-release__sec">✨ 新内容</p>

- **ETHShenzhen 2026 系列专题**：[专题总览](field-notes/ethshenzhen-2026/index.md) + 四篇正文——[Day 1 工作坊](field-notes/ethshenzhen-2026/day1-workshops.md)（OSKey 硬件钱包、Tiny 熊讲 LLM 与 Agent）、[Day 1 黑客松展示](field-notes/ethshenzhen-2026/day1-demos.md)、[Day 2 上午](field-notes/ethshenzhen-2026/day2-morning.md)（Vitalik、Winderica、Nym、路线图圆桌）、[Day 2 下午](field-notes/ethshenzhen-2026/day2-afternoon.md)（Qi Zhou、数据上链、Agent 边界、获奖项目）
- **新笔记**：[AI × Web3 产业创新交流会](field-notes/ai-web3-meetup.md)（09.19 · 深圳），附一份付费培训避坑清单
- **新知识页**：[安全与隐私](security/index.md)、[AI 辅助开发](devtools/ai-coding.md)（含可以直接抄的 `AGENTS.md` / Skill 模板）、[知识库总览](knowledge/index.md)
- **新页面**：版本发布（就是这一页）
- 录音转写里的专有名词都已查证，直接在正文里改成正确写法

<p class="w3-release__sec">🎨 体验改进</p>

- 全站重新设计：浅色为主的清爽风格，深色模式和手机端同步重做
- 导航重组为 **入门 / 知识库 / 现场笔记 / 成长 / 关于** 五个板块
- 首页重做：最新笔记、按主题学、三条入门路径一眼看清
- 现场笔记统一为「信息卡 → TL;DR → 拆解 → 小白能学到什么 → 现在能做什么」的结构，新增时间线和主题索引
- 不再从 Google Fonts 加载字体，国内打开更快
- 中文标题也能生成可读的锚点链接，分享某一节更方便
- 顶部新增版本公告条，可以手动关掉

<p class="w3-release__sec">🐛 问题修复</p>

- 脚本文件损坏导致的一串问题：Mermaid 图表不显示、技能树点不亮、学习打卡无效、收款码不能放大——全部修复
- 「从这里开始」页面 Markdown 显示成源码
- 首页卡片区空白、正文栏被挤得太窄
- 支持页二维码在线上地址会 404
- Logo 在深色模式下看不见
- 本地一键预览（`serve.bat`）在虚拟环境失效时直接报错，现在会自动改用系统 Python
</div>

## 历史版本

<div class="w3-release" markdown>
<div class="w3-release__head">
  <div class="w3-release__name"><b>版本 2.1</b><span>文档站布局 · 双语站点</span></div>
  <span class="w3-release__ver">v2.1.0</span>
  <span class="w3-release__date">2026-10-06</span>
</div>

- 改成文档站式的三栏阅读布局
- 新增英文站，右上角可中英切换
- 新的品牌视觉：logo、favicon、分享卡片
- 新增「支持这个 Wiki」页面（微信 / 支付宝）
- 关于页补充学习理念与维护者信息
- 修复 YAML 编码与 emoji 生成器导致的构建失败
</div>

<div class="w3-release" markdown>
<div class="w3-release__head">
  <div class="w3-release__name"><b>版本 2.0</b><span>Wiki 2.0 · 视觉重建</span></div>
  <span class="w3-release__ver">v2.0.0</span>
  <span class="w3-release__date">2026-10-05</span>
</div>

- 第一次视觉重建
- 交互式技能树：点击节点标记「已掌握」
- 每日学习打卡 + 热力图
- 新增关于页
- 每页底部加入 Giscus 评论区
</div>

<div class="w3-release" markdown>
<div class="w3-release__head">
  <div class="w3-release__name"><b>版本 1.1</b><span>课程中心 · 面经 · 资源</span></div>
  <span class="w3-release__ver">v1.1.0</span>
  <span class="w3-release__date">2026-09-30</span>
</div>

- 新增 [精选课程中心](roadmap/courses.md)：从编程基础到 Solidity、安全、DeFi 的免费课
- 新增 [面经题库](handbook/interview.md) 和 [资源汇总](handbook/resources.md)
- Windows 双击 `serve.bat` 即可本地预览
- README 重写
</div>

<div class="w3-release" markdown>
<div class="w3-release__head">
  <div class="w3-release__name"><b>版本 1.0</b><span>首次发布</span></div>
  <span class="w3-release__ver">v1.0.0</span>
  <span class="w3-release__date">2026-09-29</span>
</div>

- Web3 Learning Wiki 上线
- 两篇现场笔记：[路演夜 · 四个 AI × Web3 项目](field-notes/pitch-night.md)、[Monad 黑客松与 Agent 金融](field-notes/monad-hackathon.md)
- [核心概念词典](fundamentals/core-concepts.md)、转写名词对照表
- 学习路线图、技能树与资源、海外深造参考、黑客松 / GitHub / 实习三本手册
- 推送到 GitHub 自动部署到 GitHub Pages
</div>

## 版本号怎么定

用「**大版本.小版本.补丁**」三段式，和大多数 App 一样：

| 变化 | 例子 | 版本号 |
|---|---|---|
| 改版、结构大调整 | 全站重新设计 | **3**.0.0 → **4**.0.0 |
| 新增笔记、新栏目、新功能 | 加了一场活动的现场笔记 | 3.**0**.0 → 3.**1**.0 |
| 修错别字、修链接、小调整 | 纠正一个转写错误 | 3.0.**0** → 3.0.**1** |

每次发版会同步做三件事：在这一页加一张版本卡片、更新首页和顶部公告条、在群里发更新通知。

## 怎么第一时间知道有更新

- **群里**：每次发版都会发一条带版本号的更新通知；
- **GitHub**：在 [仓库页面](https://github.com/mia03ther/web3-learning-wiki) 点 Watch，或者看 [提交记录](https://github.com/mia03ther/web3-learning-wiki/commits/main/)；
- **这一页**：最新版本永远在最上面。
