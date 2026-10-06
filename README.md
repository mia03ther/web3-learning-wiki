# Web3 Learning Wiki

> **📖 在线阅读 / Online Wiki：<https://mia03ther.github.io/web3-learning-wiki/>**
>
> **中文** 内容位于 `docs/`，**English** 翻译位于 `docs/en/`，右上角可随时切换语言。
> 普通读者无需 clone 或安装任何软件，直接打开上面的链接即可获得完整阅读体验
> （侧边导航、全文搜索、明暗主题）。

An open-source, continuously updated **Web3 learning knowledge base** maintained by
**MIA_Ether** — covering blockchain basics, smart contracts, **AI × Web3**, MCP &
AI agents, on-chain data, developer tooling and the Builder journey.

> ⚠️ 直接在 GitHub 上浏览 `.md` 源文件会丢失排版、导航与搜索功能，请始终使用在线阅读链接。

## What's Inside

- **Learning Paths**: getting started, staged roadmap, curated courses, skill trees and resources
- **Blockchain**: fundamentals, core concepts, glossary, smart contracts, on-chain data
- **AI × Web3**: on-chain agents, agent payments, MCP & AI agents
- **Developer**: builder handbook, developer tools, GitHub workflow, internships, interview bank
- **Projects**: hackathon guide and first-hand field notes
- **Community**: contribution guide, about, support

## Structure

```
docs/
├── index.md               # Homepage (中文 · default language)
├── start/ roadmap/ fundamentals/ smart-contracts/ ai-web3/
├── onchain-data/ devtools/ handbook/ field-notes/
├── about/ support/ contributing.md
├── en/                    # English translations (same structure)
└── assets/                # Shared brand, styles, scripts, support QR codes
```

Internationalisation uses [mkdocs-static-i18n](https://github.com/ultrabug/mkdocs-static-i18n):
`docs/` is the default language (zh); translations live under `docs/en/`.
Untranslated pages fall back to the default language until translated.

## Run Locally (Contributors & Editors Only)

> 只想阅读内容可以跳过本节。以下仅面向需要修改文档并在本地预览的人。

Requires Python 3.11+.

```bash
git clone https://github.com/mia03ther/web3-learning-wiki.git
cd web3-learning-wiki

python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate        # macOS / Linux

pip install -r requirements.txt
mkdocs serve
```

Preview at <http://127.0.0.1:8000>. On Windows you can also double-click `serve.bat`.

### Strict build (used by CI)

```bash
mkdocs build --strict
```

## Deployment Workflow

- `main` branch：全部源码与内容，**所有编辑必须提交到这里**。
- `gh-pages` branch：由 GitHub Actions 自动生成，**请勿手动编辑**。
- 每次 push 到 `main` 触发构建与部署；PR 会先跑 `mkdocs build --strict`。

## Contributing

- 每一页右上角都有 **Edit on GitHub**，点击即可提交 PR；
- 纠错、补充来源、新增笔记均欢迎 → [Issues](https://github.com/mia03ther/web3-learning-wiki/issues) / [Discussions](https://github.com/mia03ther/web3-learning-wiki/discussions)；
- 想成为持续贡献者？参见 [Contribution Guide](docs/contributing.md)。

## License

[CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/)（内容）· Code: MIT（代码与配置）。
