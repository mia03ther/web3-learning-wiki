# Web3 Learning Wiki

[在线阅读](https://mia03ther.github.io/web3-learning-wiki/) · [版本发布](https://mia03ther.github.io/web3-learning-wiki/changelog/) · [贡献指南](docs/contributing.md)

MIA_Ether 写给群友看的 Web3 × AI 学习笔记。v3.1 保留独立入口页，正文使用酒红色常驻目录，内容分成入门、知识库、现场笔记、成长和关于五个板块。直接打开在线版就能阅读、搜索和切换明暗主题，不需要安装软件。

中文内容在 `docs/`，英文骨架在 `docs/en/`。英文页面会标明哪些正文仍是中文，尚未翻译的页面由 [mkdocs-static-i18n](https://github.com/ultrabug/mkdocs-static-i18n) 回退到中文内容。

## 里面有什么

- 入门路线、精选课程、技能树和学习打卡。
- 区块链基础、智能合约、链上数据、AI × Web3、安全与隐私、AI 辅助开发。
- 四站现场笔记：R01 AI × Web3 产业创新交流会（09.19）、R02 Monad Metropolis 深圳（09.26）、R03 RustChinaConf 2026（10.15–17）、R04 ETHShenzhen 2026（10.24–25）。
- 黑客松、GitHub、实习求职等手册，以及持续更新的版本记录。

## 目录

```text
docs/
├── index.md                 # 中文入口页：最近一站、赛历、主题入口
├── start/ roadmap/          # 入门和学习路线
├── knowledge/               # 知识库索引
├── fundamentals/ smart-contracts/ onchain-data/
├── ai-web3/ security/ devtools/
├── field-notes/
│   ├── index.md             # 时间线和主题索引
│   ├── ai-web3-meetup.md    # R01 · 产业创新交流会
│   ├── monad-hackathon.md   # R02 · 宣讲与圆桌
│   ├── pitch-night.md       # R02 · 项目路演
│   ├── rustchinaconf-2026.md # R03 · 志愿者见闻和展位交流
│   └── ethshenzhen-2026/    # R04 · 总览和四篇正文
├── handbook/                # Builder、黑客松、求职等手册
├── about/ support/ contributing.md
├── changelog.md             # 带版本号的发布记录
├── en/                      # 英文骨架和已有译文
└── assets/
    ├── posters/             # 活动海报和现场照片
    ├── avatar/ f1/ fcb/     # 头像和个人兴趣元素
    └── stylesheets/ javascripts/
overrides/
├── landing.html             # 独立入口页模板
└── main.html                # 正文模板和版本公告条
mkdocs.yml                   # 导航、主题、语言等配置
serve.bat                    # Windows 一键预览
```

## 本地预览

需要 Python 3.11+。第一次使用先安装依赖：

```bash
git clone https://github.com/mia03ther/web3-learning-wiki.git
cd web3-learning-wiki
python -m venv .venv
```

激活环境：Windows PowerShell 使用 `.\.venv\Scripts\Activate.ps1`，macOS / Linux 使用 `source .venv/bin/activate`。然后运行：

```bash
python -m pip install -r requirements.txt
python -m mkdocs serve
```

打开终端提示的地址，默认为 [本地预览](http://127.0.0.1:8000/web3-learning-wiki/)。保存文件后页面会自动刷新。Windows 也可以双击 `serve.bat`；虚拟环境不可用时，它会尝试系统 Python，缺包时会显示安装命令。

提交前运行与 CI 相同的严格构建，确保没有警告：

```bash
python -m mkdocs build --strict
```

## 一起改

看到错误、过时信息，或想补一篇自己的活动笔记，随时欢迎。页面右上角的 **Edit on GitHub** 可以直接发起 PR；也可以提 [Issue](https://github.com/mia03ther/web3-learning-wiki/issues)，或者在群里 @我。新增笔记和发布版本的步骤见[贡献指南](docs/contributing.md)。

源码和内容都在 `main`。PR 会先跑严格构建；合并或推送到 `main` 后，GitHub Actions 自动构建并发布 GitHub Pages。`gh-pages` 和本地 `site/` 都是生成内容，不手动修改。

## 许可

原创内容采用 [CC BY-NC-SA 4.0](LICENSE)。活动照片、海报、F1 照片和队徽等第三方素材以各自的来源说明及许可为准。
