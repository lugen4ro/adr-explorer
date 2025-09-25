# ADR Explorer

A GitHub Action that deploys your Architecture Decision Records as a beautiful, searchable website.

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

Your site will be live at `https://username.github.io/repository-name/`

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

## License

MIT
