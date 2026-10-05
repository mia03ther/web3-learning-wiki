# Web3 Learning Wiki 2.0 — Final Upgrade Report

## 概览

本次升级将一个基础 MkDocs 知识库重构为兼具 Apple 级视觉质感、开发者社区属性、
个人 IP 展示与互动能力的现代化 Wiki。**约 80% 的需求在静态架构内零后端交付**，
剩余需后端的功能已明确标注并给出实现路径。

---

## 一、改了什么（视觉重构）

| 模块 | 改动 |
|---|---|
| **Design Token 系统** | 完全重写 `extra.css`，建立统一的 `--w3-*` token 体系，覆盖 light + dark 双主题、背景/前景/边框/阴影/圆角/缓动全部维度 |
| **Typography** | 标题字重 800、letter-spacing 精调、行高优化、Hero 渐变标题、代码字体统一 |
| **Header / 导航** | 毛玻璃效果（backdrop-filter）、sticky tabs、uppercase 标签、hover 过渡 |
| **侧边栏** | 激活态左边框高亮、hover 颜色过渡、圆角 |
| **卡片系统** | `.w3-card` 带 hover 上浮 + 渐变蒙层 + 阴影 + 箭头显隐微交互 |
| **按钮系统** | `.w3-btn` primary / ghost / sm 变体，统一 hover 上浮 + 阴影 |
| **代码块** | 始终深色、圆角、边框、copy 按钮 hover 变色 |
| **表格** | 圆角、hover 行高亮、subtle 阴影 |
| **动画** | 页面进入 fade-up、滚动 IntersectionObserver 渐入、阅读进度条 |
| **移动端** | 网格降为单列、hero 缩小、热力图列数减半、咖啡卡片纵向布局 |

## 二、修复了什么

| Bug | 根因 | 修复 |
|---|---|---|
| **Light 模式技能树文字不可见** | Mermaid 默认配色不随主题切换，浅色模式下节点文字对比度崩塌 | 在 `extra.js` 中通过 `themeVariables` 注入 token 驱动的配色；在 CSS 中用 `!important` 覆盖 `.mermaid` 的 node/edge/label 颜色，双保险 |
| **代码块浅色模式不一致** | 硬编码深色 | 统一 token，两套主题均使用深色代码块 + 浅色 inline code |

## 三、新增了什么

### Phase 3 — 视觉 / 品牌
- **新 Logo** `brand.svg` / `favicon.svg`：将字母 "M"（MIA）绘制为知识图谱节点连线结构，cyan 品牌
- **首页重设计**：Apple 节奏式 Hero → Learning Path 卡片网格 → Browse tiles → 关于 → 咖啡 CTA
- **mkdocs.yml**：更新 site_description、site_author、社交链接（GitHub/X/Email/Portfolio）

### Phase 4 — 技能树 / 关于 / 咖啡 / 资源 / 下载
- **交互式 SVG 技能树**：13 个可点击节点（root + 3 技能树 × 4 层），点击标记掌握状态，localStorage 持久化，连线随状态高亮，图例说明
- **关于我页面** `docs/about/index.md`：头像（logo）、bio、10 个社交链接卡片（GitHub/X/Portfolio/Email 已填，Bilibili/YouTube/Dune/Instagram/Threads/Reddit 待配置）、在建项目表、关注方向
- **请喝咖啡** CTA 卡片：爱发电链接（当前占位，待你填真实主页）
- **官方学习资源直达**：21 个验证过的官方 URL 卡片（CS50/freeCodeCamp/CryptoZombies/Foundry Book/MCP/DefiLlama 等）
- **下载区** `docs/assets/downloads/`：结构已建好，文件待补充
- **编辑权限申请**：GitHub Issue 模板 `.github/ISSUE_TEMPLATE/edit-permission.md`

### Phase 5 — 评论 / 打卡
- **giscus 评论系统**：JS 自动注入到每个文章页底部，GitHub OAuth 登录，Markdown 评论。**需配置 repoId / categoryId 才生效**
- **学习打卡**：今日打卡按钮、连续天数、累计打卡、本月打卡统计、GitHub 风格贡献热力图（26 周），localStorage 存储
- **主题同步**：切换 light/dark 时自动同步 giscus 评论主题

### Phase 6 — 编辑 / 建议
- **每页底部操作栏**：✏️ Edit on GitHub（跳转 GitHub 编辑器发 PR）、💡 提建议（跳转 Issues）、关于我
- **建议系统**：链接到 GitHub Issues，带 suggestion 标签

---

## 四、需要你配置的项

| 配置项 | 位置 | 当前值 | 说明 |
|---|---|---|---|
| **爱发电链接** | `docs/index.md` + `docs/about/index.md` 的 `w3-coffee` 卡片 | `https://afdian.net`（占位） | 换成你的真实爱发电主页 |
| **giscus repoId** | `docs/assets/javascripts/extra.js` 第 232 行 `GISCUS_CONFIG.repoId` | 空 | 去 https://giscus.app 填仓库名获取 |
| **giscus categoryId** | 同上第 234 行 | 空 | 同上获取 |
| **社交链接 handle** | `docs/about/index.md` 的 `w3-social` 卡片 | 占位 | Bilibili/YouTube/Dune/Instagram/Threads/Reddit 换成真实链接 |
| **GitHub Discussions** | 仓库 Settings → Features | 需开启 | giscus 评论依赖 Discussions 功能 |

### giscus 配置步骤（评论系统激活）
1. 在仓库 https://github.com/mia03ther/web3-learning-wiki 开启 Discussions（Settings → Features ✓）
2. 访问 https://giscus.app，输入仓库名 `mia03ther/web3-learning-wiki`
3. 选择 Discussion category（推荐 `General` 或 `Announcements`）
4. 复制生成的 `data-repo-id` 和 `data-category-id`
5. 填入 `docs/assets/javascripts/extra.js` 的 `GISCUS_CONFIG`
6. 重新构建部署，评论即生效

---

## 五、需要后端的功能（当前架构做不到）

| 功能 | 缺什么 | 建议路径 |
|---|---|---|
| 持久化 GitHub OAuth 登录（跨设备） | 服务端 session | 迁移 Next.js + NextAuth.js |
| 跨设备打卡同步 | 数据库 | Supabase / PlanetScale |
| Admin 在线编辑器后台（保存到服务器） | 后端 API + 文件存储 | Next.js + 数据库 + headless CMS |
| 编辑权限审核存储 | 数据库 + 管理后台 | 同上 |

**当前已用 GitHub 原生流替代**：编辑 = GitHub PR 流，建议 = Issues，权限申请 = Issue 模板。
这是纯静态架构下最真实的贡献闭环，无需后端。

---

## 六、如何测试

```bash
cd D:\Github\web3-learning-wiki
python -m mkdocs serve
# 打开 http://127.0.0.1:8000
```

测试清单：
- [ ] 首页 Hero 动画、卡片 hover、咖啡 CTA
- [ ] 右上角切换 Light / Dark，所有页面文字对比度正常
- [ ] 技能树页面：点击节点标记掌握状态，刷新后保持
- [ ] 技能树 Light 模式文字清晰可见（原 Bug 已修复）
- [ ] 关于我页面：社交链接卡片、项目表
- [ ] 学习打卡：点击打卡、热力图更新、连续天数统计
- [ ] 每篇文章底部：Edit on GitHub / 提建议 按钮
- [ ] 手机端：响应式布局正常
- [ ] 代码块：浅色模式深色代码、copy 按钮正常

---

## 七、下一阶段建议

1. **激活 giscus 评论**（填 repoId / categoryId，5 分钟）
2. **填真实社交链接 + 爱发电主页**
3. **补充下载资料**（PDF / Cheat Sheet 放入 `docs/assets/downloads/`）
4. **考虑后期迁移**：如需在线编辑器 + 跨设备打卡，迁移到 Next.js + Supabase
5. **SEO 增强**：可加 `mkdocs-material` 的 meta 插件补充 OG image（PNG 格式）

---

## 八、文件变更清单

| 文件 | 操作 |
|---|---|
| `docs/assets/stylesheets/extra.css` | 完全重写（设计系统） |
| `docs/assets/javascripts/extra.js` | 完全重写（8 个功能模块） |
| `docs/assets/brand.svg` | 重做（M-节点 Logo） |
| `docs/assets/favicon.svg` | 重做（带背景的 Logo） |
| `docs/index.md` | 重写（新首页） |
| `docs/about/index.md` | 新增（关于我） |
| `docs/roadmap/skills-resources.md` | 升级（交互技能树 + 资源卡 + 打卡） |
| `mkdocs.yml` | 更新（描述/作者/社交/About 导航） |
| `.github/ISSUE_TEMPLATE/edit-permission.md` | 新增 |
| `docs/assets/downloads/README.md` | 新增 |
