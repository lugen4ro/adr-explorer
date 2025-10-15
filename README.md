# ADR Explorer

A GitHub Action that deploys your Architecture Decision Records as a beautiful website using GitHub Pages.

<img width="6624" height="3774" alt="CleanShot2025-10-15at18 17 21@2x" src="https://github.com/user-attachments/assets/dec03941-1e3c-4898-a253-46921f8c0ffc" />


## Features

- 🚀 Get started by just adding a single GitHub Actions workflow
- 🎨 Modern dark theme
- 📱 Mobile responsive

## Quick Start

### 1. Enable GitHub Pages

Go to **Settings → Pages** and set source to "GitHub Actions"

### 2. Add Workflow

Create `.github/workflows/adr-explorer-deploy.yml`:

```yaml
name: Deploy ADR Explorer

on:
  push:
    paths: ["doc/adr/**"] # NOTE: Change this if you place your adrs elsewhere
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: lugen4ro/adr-explorer@main
        with:
          adr-path: "doc/adr" # NOTE: Change this if you place your adrs elsewhere
      - uses: actions/deploy-pages@v4
```

### 3. Add ADRs

Put your markdown adr files in `doc/adr/`:

```markdown
# ADR-001: Database Choice

## Status

Accepted

## Decision

We will use PostgreSQL...
```
The supported format is mainly the one of [adr-tools](https://github.com/npryce/adr-tools).

Your site will be live at `https://username.github.io/repository-name/`
For example for this repository it is [https://lugen4ro.github.io/adr-explorer/](https://lugen4ro.github.io/adr-explorer/)

## Configuration

| Input      | Default   | Description       |
| ---------- | --------- | ----------------- |
| `adr-path` | `doc/adr` | Path to ADR files |

```yaml
- uses: lugen4ro/adr-explorer@main
  with:
    adr-path: "doc/arch_decisions"
```

## Supported Statuses

- Proposed
- Accepted
- Deprecated
- Superseded
- Rejected

## Roadmap

- [x] Explore ADRs in modern UI
- [x] Support ADR format of [adr-tools](https://github.com/npryce/adr-tools)
- [x] Support images, syntax colored code snippets & Mermaid charts
- [x] Support non-English ADRs (Mainly Japanese)
- [x] Support date extraction from filename
- [x] Support nested ADR directory structures
- [x] Free-text search
- [ ] Support realtive links

## License

MIT
