# 3. Use Biome for linting and formatting

Date: 2025-09-06

## Status

Accepted

## Context

We need to decide on a linter and formatter.
The main options are eslint and biome.
Biome is faster, and provides formatting as well.

## Decision

Use Biome for formatting and linting.

## Consequences

Use `pnpm check` which runs `biome check --fix .`
