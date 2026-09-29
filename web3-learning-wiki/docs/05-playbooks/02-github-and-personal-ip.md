# GitHub 与个人 IP 搭建指南

> 手把手教你把这个 Wiki 推上 GitHub、一键变成个人网站，并长期经营属于你自己的 IP。
> 全程 Windows + PowerShell，照着复制即可。

## 一、GitHub 是什么，为什么它是「大本营」

- **GitHub** = 全球最大的代码 / 内容托管与协作平台，Web3 行业的「公共档案库」；
- 在 Web3，**你 GitHub 上公开做过什么，比简历更有说服力**：申请、求职、组队友、被投资人发现，都从这里开始；
- 它同时承担：作品集、博客（本 Wiki）、版本备份、协作记录。

## 二、第一次配置（约 30 分钟）

### 步骤 1：注册账号

1. 打开 <https://github.com> 注册，**用户名想清楚**（会出现在所有链接里，建议简洁、长期通用）；
2. 验证邮箱；建议开启两步验证（2FA）。

### 步骤 2：安装 Git

1. 下载 **Git for Windows**：<https://git-scm.com/download/win>，默认选项安装；
2. 安装后打开 **PowerShell**，配置身份（只需一次）：

```powershell
git config --global user.name "你的用户名"
git config --global user.email "你的邮箱"
```

### 步骤 3：在 GitHub 上新建空仓库

1. GitHub 右上角 `+` → `New repository`；
2. 名字填 `web3-learning-wiki`；
3. 选 **Public（公开）**；**不要**勾选 README / License（本地已经有了）；
4. 点 `Create repository`，复制仓库地址（形如 `https://github.com/用户名/web3-learning-wiki.git`）。

### 步骤 4：把本 Wiki 推上去

在 PowerShell 里执行（把路径和地址换成你的）：

```powershell
# 进入 wiki 文件夹
cd "C:\Users\24525\Doubao\chats\2026-09-29\new-chat\web3-learning-wiki"

# 初始化、提交全部文件
git init
git add .
git commit -m "init: web3 learning wiki"
git branch -M main

# 关联远程仓库并推送
git remote add origin https://github.com/用户名/web3-learning-wiki.git
git push -u origin main
```

刷新 GitHub 页面，文件就出现了。

### 以后每次更新，只需三行

```powershell
git add .
git commit -m "写明这次改了什么"
git push
```

> 登录凭证：首次 push 会弹窗让你登录 GitHub，按提示授权即可（Git Credential Manager 会帮你记住）。

## 三、让仓库更专业的小细节

- **README.md**：仓库门面（本项目已写好），别人点进来先看到它；
- **Commit 信息写人话**：如「add monad hackathon notes」，别总是 update；
- **置顶仓库**：GitHub 主页 → Customize your pins，把本仓库和项目置顶；
- **完善 Profile**：头像、简介（一句话定位 + 兴趣 + 联系方式）；
- 给每个项目仓库配 README：是什么、为什么、怎么运行、谁做的。

## 四、一键把 Wiki 变成个人网站（MkDocs）

本仓库已配置好 MkDocs Material，让你拥有带搜索、目录、移动端的个人知识网站，并免费部署。

### 本地预览

```powershell
# 安装（只需一次）
pip install mkdocs-material

# 在 wiki 目录运行
mkdocs serve
# 浏览器打开 http://127.0.0.1:8000 即可看到网站
```

### 部署到 GitHub Pages（免费托管）

```powershell
mkdocs gh-deploy
```

部署完成后：

1. 打开仓库 `Settings` → `Pages`；
2. Source 选择 `gh-pages` 分支、`/(root)`，保存；
3. 几分钟后你的网站上线，地址形如：
   `https://用户名.github.io/web3-learning-wiki/`

> 以后每次更新内容，重新跑一次 `mkdocs gh-deploy` 即可发布。

## 五、个人 IP：定位与经营

### 你的差异化定位（建议）

> **「语言 + 技术」的桥梁型学习者**：一个广外学生从 0 到 1 学 AI × Web3 的真实成长记录，主打华语 Builder 看世界——翻译信息差、沉淀学习笔记、连接东西方生态。

为什么这个定位靠谱：

- 真实、不装（你确实在成长，不需要装专家）；
- 发挥广外语言与跨文化优势；
- 踩中行业反复出现的「出海 / 东西方串联 / 信息差」需求；
- 可长期持续（四年成长 + 申研 + 入行，故事天然连贯）。

### 平台分工

| 平台 | 角色 | 发什么 |
|---|---|---|
| **GitHub / 个人网站** | 大本营、作品集 | 长文 Wiki、项目代码 |
| **X (Twitter)** | 行业主阵地 | 学习片段、项目进展、行业观察、和 Builder 互动 |
| **Mirror**（Web3 写作） | 长文 / 沉淀 | 会议精读、深度笔记（可绑定钱包） |
| **小红书 / B 站** | 中文成长向 | 大一自学、申研准备、资源分享 |
| **LinkedIn** | 职业 / 实习 | 经历、项目、技能 |

### 内容栏目（可持续生产）

1. **会议 / 文章精读**（像本 Wiki 这样）；
2. **小白概念词典**（一个概念一篇）；
3. **项目 / 黑客松复盘**；
4. **翻译 + 信息差**（优质英文资料的中文导读，注明来源）；
5. **每月成长 / 进度月报**；
6. **资源清单、工具测评**。

### 长期节奏

- **每周**：至少 1 篇内容（哪怕很短）+ 5 次高质量 commit；
- **每月**：1 篇月报 / 复盘，更新路线图；
- **每学期**：1 个可展示成果；
- 关键是**持续、真实、不中断**，时间会给复利。

## 六、个人 IP 防坑

1. **不装全知**：小白成长人设最讨喜，坦诚「我还在学」；
2. **不追热点炒币**：不发暴富、带单、赌价格内容，爱惜信誉；
3. **尊重版权**：翻译 / 转载要署名、获授权、注明来源；
4. **不追求完美才发**：先完成再完美，持续比单篇惊艳更重要；
5. **多互动**：真诚评论、帮人解答、连接他人，IP 是「帮出来的」。

## 七、今天就能完成的动作

- [ ] 注册 GitHub、安装 Git、配置身份；
- [ ] 把本 Wiki 推上 GitHub；
- [ ] 安装 mkdocs-material，本地预览成功；
- [ ] 注册 X 账号，写第一条「自我介绍 + 学习目标」；
- [ ] 把个人网站 / GitHub 链接写进 Wiki README 的联系方式。

> 相关：[黑客松指南](./01-hackathon-guide.md) ｜ [实习求职指南](./03-internship-job-guide.md)
