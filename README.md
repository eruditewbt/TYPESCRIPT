# TypeScript Academy

TypeScript Academy is a product-first learning ecosystem where students learn by contributing to real software. The first anchor product is a TypeScript SaaS starter platform with a CLI, backend, and React dashboard.

## Repository Shape

```text
apps/
  api/        Backend platform
  web/        React dashboard
  mobile/     React Native app (later)
packages/
  types/      Shared TypeScript contracts
  ui/         Shared component system
  config/     Shared configs
  sdk/        Generated API client
  auth/       Shared auth logic
tools/
  cli/        Project generator and developer CLI
  generator/  Code generation engine
infra/
  docker/     Container assets
  ci/         CI/CD workflows and scripts
docs/         Product, curriculum, and operating docs
```

## Principles

- Learn by shipping production-grade features.
- Every stage produces a real asset the platform uses.
- Students progress from learner to contributor to creator.
- Monetization starts early through starter kits, cohorts, and subscriptions.

## First Build Target

The v1 product is the TypeScript SaaS Starter Platform:

- `tools/cli`: scaffold projects and templates
- `apps/api`: auth, billing, organizations, and core APIs
- `apps/web`: admin dashboard and control panel
- `packages/*`: shared contracts and reusable building blocks

## Getting Started

This repo is currently the execution foundation. The next implementation milestone is to scaffold the CLI, API, and web apps while following the roadmap in [`docs/mvp-roadmap.md`](docs/mvp-roadmap.md).
