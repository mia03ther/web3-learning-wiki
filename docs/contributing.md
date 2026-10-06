# 贡献指南 · Contribution Guide

这个 Wiki 是开源的，编辑入口就在每一页的右上角（**Edit on GitHub**）。无论是修错别字、
补充来源、纠正过时信息还是新增笔记，都欢迎。

## 参与方式

- **提 Issue**：发现错误、过时信息或失效链接，去 [GitHub Issues](https://github.com/mia03ther/web3-learning-wiki/issues) 提出；
- **直接改**：在任意页面点击右上角 ✏️ **Edit on GitHub**，走 GitHub PR 流程提交修改；
- **资源推荐**：有好的课程 / 工具 / 一手资料，欢迎在 [Discussions](https://github.com/mia03ther/web3-learning-wiki/discussions) 里推荐；
- **申请编辑权限**：想成为持续贡献者，可以 [申请加入 Collaborator](https://github.com/mia03ther/web3-learning-wiki/issues/new?labels=edit-permission&template=edit-permission.md&title=申请编辑权限)。

## 本地预览

需要 Python 3.11+。

```bash
git clone https://github.com/mia03ther/web3-learning-wiki.git
cd web3-learning-wiki
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate  # macOS / Linux
pip install -r requirements.txt
mkdocs serve
```

打开 <http://127.0.0.1:8000> 预览。

## 提交前检查

PR 提交前请确保严格构建通过：

```bash
mkdocs build --strict
```

## 分支与部署

- `main` 分支存放全部源码与内容，**所有编辑都在这里完成**；
- `gh-pages` 分支由 GitHub Actions 自动生成，**不要手动编辑**；
- 每次 push 到 `main` 都会触发构建与部署。

## 内容规范

- 新增页面放在对应的板块目录下（`fundamentals/`、`ai-web3/`、`handbook/` …）；
- 中文内容写在 `docs/` 根目录，英文翻译放在 `docs/en/` 对应路径；
- 外部事实尽量附来源链接；不确定的内容标注「待核实」；
- 保持与现有页面一致的标题层级与 Markdown 风格。
