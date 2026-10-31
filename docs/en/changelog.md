---
title: Releases
description: Release notes for Web3 Learning Wiki, written like an app's "What's New": what was added, what got better, what was fixed.
---

# Releases

<p class="w3-lead">
Like an app, the wiki gets a version number for every update, and this page says what was added, improved and fixed.
The group-chat announcement is taken from here. The notes themselves are in Chinese.
</p>

## Latest

<div class="w3-release w3-release--latest" markdown>
<div class="w3-release__head">
  <span class="w3-release__icon" aria-hidden="true"><img src="../../assets/avatar/logo.jpg" alt="" width="96" height="96"></span>
  <div class="w3-release__name"><b>Version 3.0.1</b><span>English entry pages and contribution guides</span></div>
  <span class="w3-release__ver">v3.0.1</span>
  <span class="w3-release__date">2026-10-31</span>
</div>

- **Content**: linked the AI × Web3 and MCP pages to field examples of payments, budgets, trust boundaries and Computer Use; removed unsupported names from older notes and added official technical references.
- **English**: updated Start, How to Use and About to match the current structure and maintainer introduction.
- **Contributing**: documented how to add an event note and publish a release in both languages; updated the README and local preview instructions.
- **Fixed**: the home page now keeps the theme selected on reading pages; corrected the Bayern sticker hover style.
</div>

## Previous releases

<div class="w3-release" markdown>
<div class="w3-release__head">
  <span class="w3-release__icon" aria-hidden="true"><img src="../../assets/avatar/logo.jpg" alt="" width="96" height="96"></span>
  <div class="w3-release__name"><b>Version 3.0</b><span>Redesign · four rounds of field notes</span></div>
  <span class="w3-release__ver">v3.0.0</span>
  <span class="w3-release__date">2026-10-31</span>
</div>

<p class="w3-release__summary">The whole wiki, rebuilt inside and out: new design, new navigation, new topics, and a pile of features that never worked now do.</p>

<p class="w3-release__sec">✨ New</p>

- **ETHShenzhen 2026 series**: an [overview](field-notes/ethshenzhen-2026/index.md) and four notes on hardware wallets and vibecoding, the hackathon demos, security and privacy with Vitalik, and AI development and agent boundaries
- **[RustChinaConf 2026](field-notes/rustchinaconf-2026.md)**: who runs Rust in production, the hiring wall, and a careers chat at the Kimi booth
- **[Monad Metropolis Shenzhen](field-notes/monad-hackathon.md)** and the **[AI × Web3 Industry Meetup](field-notes/ai-web3-meetup.md)**, with a checklist for judging paid courses
- **New topics**: [Security & Privacy](security/index.md), [AI-assisted Development](devtools/ai-coding.md) and a [knowledge overview](knowledge/index.md)
- Field notes laid out as a season, R01 → R04, with event posters and photos
- This releases page

<p class="w3-release__sec">🎨 Improved</p>

- A new look: ink on white with a little Ferrari red; dark mode and mobile redone too
- A new entrance page with the latest round, the season calendar and topics, plus a Leclerc postcard with an FC Bayern sticker in the corner
- Navigation regrouped into Start / Knowledge / Field Notes / Grow / About
- Fonts no longer load from Google Fonts, so pages open faster in mainland China
- Readable anchor links for Chinese headings
- Every page has an ✏️ edit button, and anyone is welcome to fix or add things

<p class="w3-release__sec">🐛 Fixed</p>

- A broken script file had disabled Mermaid diagrams, the skill tree, the study check-in and the QR code zoom; all of them work again
- Support page QR codes returned 404 on the live site
- The local preview script (`serve.bat`) now falls back to the system Python when the virtual environment is broken
</div>
