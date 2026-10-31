# Contribution Guide

Anyone is welcome to edit this notebook. Fix a typo, add a source, update a page, or write about an event you attended. You can also tag me in the group chat if you would rather leave the GitHub part to me.

## Where to start

- Use **Edit on GitHub** at the top-right of a page, edit the file and follow GitHub's steps to open a pull request.
- Report errors and broken links in [Issues](https://github.com/mia03ther/web3-learning-wiki/issues). Share courses and tools in [Discussions](https://github.com/mia03ther/web3-learning-wiki/discussions).
- To help maintain the wiki regularly, [request edit access](https://github.com/mia03ther/web3-learning-wiki/issues/new?labels=edit-permission&template=edit-permission.md&title=Edit%20permission%20request).

## Preview locally

Requires Python 3.11+. Set up the environment once:

```bash
git clone https://github.com/mia03ther/web3-learning-wiki.git
cd web3-learning-wiki
python -m venv .venv
```

Activate it with `.\.venv\Scripts\Activate.ps1` in Windows PowerShell, or `source .venv/bin/activate` on macOS / Linux. Then run:

```bash
python -m pip install -r requirements.txt
python -m mkdocs serve
```

Open the address printed in the terminal, normally the [local preview](http://127.0.0.1:8000/web3-learning-wiki/). Saving a file refreshes the page. On Windows, you can also double-click `serve.bat` in the repository root.

## Add an event note

Use the [RustChinaConf 2026 note](field-notes/rustchinaconf-2026.md) as a starting point. Its source is `docs/field-notes/rustchinaconf-2026.md`; the note is in Chinese.

1. Create a clearly named `.md` file under `docs/field-notes/`, with `title` and `description` metadata and one top-level heading.
2. Add a `w3-meta` information card with the event, dates, location, your role and official sources. Include a `figure.w3-poster` if you have a poster.
3. Write a short `w3-tldr`, then the body in sections such as `Part 1` and `Part 2`. End with takeaways for beginners and things readers can try next.
4. Update `docs/field-notes/index.md`, `docs/en/field-notes/index.md`, the season calendars in `docs/index.md` and `docs/en/index.md`, and `nav` in `mkdocs.yml`. Notes from the same event share a round number.
5. Preview the page and check its headings, images and source links before running the strict build.

Keep posters and event photos in `docs/assets/posters/`, named `rNN-slug.jpg`. Include descriptive alt text, image dimensions and a source caption. For images from the event's official WeChat account, use “图源：活动官方公众号”. For group photos, add “照片里的人如果不希望出现在这里，告诉我就删” so people know they can ask for removal. Check the license and attribution requirements of any other source. Keep the R01 organizers anonymous and leave its poster out.

## Publish a release

1. Choose a version and date: major for redesigns, minor for new notes or features, patch for corrections. Add a new latest card to `docs/changelog.md`, move the previous card to the history, and update `docs/en/changelog.md`.
2. Update both languages of the announcement in `overrides/main.html`, plus the release links and summaries on the Chinese and English home pages. Keep versions, dates and links consistent.
3. Run `python -m mkdocs build --strict` and resolve every warning. Check mobile and dark mode, including navigation, images and the edit button.
4. Use an English conventional commit message and open a PR or push to `main`. Wait for the GitHub Actions build and deployment to succeed before sharing the update.

Write the group announcement like an app's What's New, taking the main points from the release page:

```text
Web3 Learning Wiki · v3.1.0 (YYYY.MM.DD)
https://mia03ther.github.io/web3-learning-wiki/

New
· Notes or topics added

Improved
· Changes that make the wiki easier to use

Fixed
· Problems resolved

Edits welcome: use Edit on GitHub on any page, or tag me in the group.
```

Omit categories with no changes. Announce only changes that are already live.

## Content and commits

- Chinese pages live under `docs/`; English pages use matching paths under `docs/en/`. An English summary can link to an existing article while noting its language.
- Keep a personal notebook tone. Distinguish official information, event conversations and your own interpretation. Verify uncertain facts against public sources and link to them.
- Put pages in the matching section, use relative links, and follow the existing heading and layout styles.
- `main` holds sources and content. `gh-pages` and `site/` are generated. Run `python -m mkdocs build --strict` before each submission, and leave local tool settings and secrets out of commits.
