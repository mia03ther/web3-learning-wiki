# 贡献指南

这个本子谁都能改。修错别字、补来源、更新过时信息，或者写一篇自己的活动笔记，都欢迎。不会用 GitHub 也没关系，在群里 @我就行。

## 从哪里改

- 页面右上角的 **Edit on GitHub** 会打开对应文件，修改后按 GitHub 的提示提交 PR。
- 发现错误或失效链接，可以提 [Issue](https://github.com/mia03ther/web3-learning-wiki/issues)。课程和工具推荐也可以发在 [Discussions](https://github.com/mia03ther/web3-learning-wiki/discussions)。
- 想长期一起维护，可以[申请编辑权限](https://github.com/mia03ther/web3-learning-wiki/issues/new?labels=edit-permission&template=edit-permission.md&title=申请编辑权限)。

## 本地预览

需要 Python 3.11+。第一次使用先安装依赖：

```bash
git clone https://github.com/mia03ther/web3-learning-wiki.git
cd web3-learning-wiki
python -m venv .venv
```

Windows PowerShell 运行 `.\.venv\Scripts\Activate.ps1`，macOS / Linux 运行 `source .venv/bin/activate`，然后：

```bash
python -m pip install -r requirements.txt
python -m mkdocs serve
```

打开终端提示的[本地地址](http://127.0.0.1:8000/web3-learning-wiki/)，保存后会自动刷新。Windows 也可以双击仓库根目录的 `serve.bat`。

## 怎么加一篇活动笔记

可以照着 [RustChinaConf 2026](field-notes/rustchinaconf-2026.md) 这篇的结构写，源文件是 `docs/field-notes/rustchinaconf-2026.md`。

1. 在 `docs/field-notes/` 新建一个名字清楚的 `.md` 文件，开头填写 `title`、`description`，正文用一个一级标题。
2. 用 `w3-meta` 信息卡写清活动、日期、地点、自己的参与身份和官方资料链接。有海报就配一个 `figure.w3-poster`，没有也可以直接开始。
3. 用 `w3-tldr` 写几条读完能记住的要点，再按 `Part 1`、`Part 2` 等小节展开。结尾保留「小白能学到什么」和「现在能做什么」，方便群友接着学或动手。
4. 把活动加入[现场笔记时间线](field-notes/index.md)和英文索引 `docs/en/field-notes/index.md`；同步 `docs/index.md`、`docs/en/index.md` 的赛历，并在 `mkdocs.yml` 的 `nav` 中加入口。同一场活动拆成多篇时，沿用同一个 R 编号。
5. 预览新页面，点一遍目录、图片和来源链接，再运行严格构建。

信息卡可以沿用现有写法：

```html
<div class="w3-meta">
  <div><span class="k">活动</span><span class="v">活动名称（R05）</span></div>
  <div><span class="k">时间</span><span class="v">日期 · 城市 · 场地</span></div>
  <div><span class="k">我的身份</span><span class="v">参会者 / 志愿者 / 分享者</span></div>
</div>
```

海报和照片放在 `docs/assets/posters/`，文件名使用 `rNN-slug.jpg`。写好图片描述、宽高和来源图注，活动官方公众号提供的图片注明「图源：活动官方公众号」。合影加一句「照片里的人如果不希望出现在这里，告诉我就删」。使用其他来源的图片，先确认许可并按要求署名。R01 继续隐去主办机构，也不放该场海报。

## 怎么发一个版本

1. 按[版本号约定](changelog.md#版本号怎么定)确定版本号和日期。在 `docs/changelog.md` 顶部加最新版本卡片，旧卡片移到历史版本；同步 `docs/en/changelog.md`。
2. 更新 `overrides/main.html` 里中英文的版本公告条，以及中英文首页上的版本入口和更新摘要。版本号、日期、链接要一致。
3. 运行 `python -m mkdocs build --strict`，处理完所有警告。检查手机和深色模式，确认导航、图片和编辑入口都正常。
4. 用英文 conventional commit 说明修改，提交 PR 或推送到 `main`。等 GitHub Actions 构建和部署成功后，再发群通知。

群通知按 App Store 更新说明的写法，从版本页摘几条重点就够：

```text
Web3 Learning Wiki · v3.1.0（YYYY.MM.DD）
https://mia03ther.github.io/web3-learning-wiki/

新内容
· 新增了哪些笔记或专题

体验改进
· 哪些地方用起来更方便了

问题修复
· 修好了哪些问题

欢迎一起改：页面右上角点 Edit on GitHub，或者群里 @我。
```

没有变化的分类可以删掉。公告里的每条改动都应当已经上线。

## 内容和提交约定

- 中文放在 `docs/`，英文放在 `docs/en/` 的对应路径；英文骨架可以先用英文摘要链接到已有正文，并说明正文语言。
- 以个人笔记的口吻写，分清官方信息、现场交流和自己的理解。拿不准的事实先找公开资料核对，再附来源链接。
- 页面放进对应目录，使用相对链接，保持现有标题层级和排版。
- 源码和内容都在 `main`；`gh-pages` 和 `site/` 由工具生成。每次提交前都运行 `python -m mkdocs build --strict`，不要提交本机工具配置或密钥。
