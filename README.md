# IAM DevOps Pipeline — Secure Identity and Access Management System

> **DevOps Pipelines CA1 — Quadri Adelakun | Atlantic Technological University**

-----

## Pipeline Architecture

```
Push to feature/* or fix/*  |  Pull Request → main
│
├── [lint]          ESLint — code quality gate
├── [unit-test]     Jest unit tests + coverage report
├── [sast-scan]     Semgrep — OWASP Top 10, JWT, Node.js rulesets
└── [dep-audit]     npm audit — blocks on HIGH/CRITICAL CVEs
         │
         └── All 4 pass → [build] Docker image → GHCR (SHA tag)
                                    │
                          ┌─────────┴──────────┐
                    [container-scan]     [integration-test]
                    Trivy (CRITICAL      Jest + Postgres
                    gate)                service container
                          └─────────┬──────────┘
                              [sbom-generate]
                              SPDX artifact

Merge to main →
  dev  (auto) → staging (auto, full E2E) → [APPROVAL GATE] → production
                                              rolling deploy + health check
                                              auto-rollback on failure
```

-----

## Workflows

|File          |Trigger        |Purpose                                             |
|--------------|---------------|----------------------------------------------------|
|`ci.yml`      |push / PR      |Lint → test → SAST → build → scan → integration test|
|`cd.yml`      |push to main   |Dev → Staging → Production with approval gate       |
|`release.yml` |push to main   |release-please versioning + changelog               |
|`rollback.yml`|manual dispatch|Roll production back to any image digest            |

-----

## Required GitHub Secrets

Set these in **Settings → Environments** for each environment:

|Secret                      |Environment   |Description                 |
|----------------------------|--------------|----------------------------|
|`RENDER_DEV_DEPLOY_HOOK`    |development   |Render deploy webhook URL   |
|`RENDER_STAGING_DEPLOY_HOOK`|staging       |Render deploy webhook URL   |
|`RENDER_PROD_DEPLOY_HOOK`   |production    |Render deploy webhook URL   |
|`RENDER_PROD_ROLLBACK_HOOK` |production    |Render rollback webhook URL |
|`STAGING_JWT_SECRET`        |staging       |JWT signing secret          |
|`STAGING_JWT_REFRESH_SECRET`|staging       |JWT refresh secret          |
|`STAGING_DATABASE_URL`      |staging       |Postgres connection string  |
|`TEST_JWT_SECRET`           |*(repo-level)*|Used in CI integration tests|

## Required GitHub Variables

|Variable          |Environment|Example                           |
|------------------|-----------|----------------------------------|
|`DEV_BASE_URL`    |development|`https://iam-dev.onrender.com`    |
|`STAGING_BASE_URL`|staging    |`https://iam-staging.onrender.com`|
|`PROD_BASE_URL`   |production |`https://iam.yourdomain.com`      |

-----

## Branch Protection Setup (main)

Configure in **Settings → Branches → Add rule** for `main`:

- ✅ Require 2 approving reviews
- ✅ Dismiss stale reviews on new commits
- ✅ Require status checks: `lint`, `unit-test`, `sast-scan`, `dependency-audit`
- ✅ Require branch to be up to date
- ✅ No direct pushes
- ✅ Require signed commits

-----

## Local Development

```bash
cp .env.example .env      # fill in your values
npm install
npm run lint
npm run test:unit
npm run dev               # starts server on :3000
```

-----

## Toolchain

|Category      |Tool             |Rationale                                   |
|--------------|-----------------|--------------------------------------------|
|CI/CD         |GitHub Actions   |Native secrets, Environments, GHCR          |
|Container     |Docker + BuildKit|Multi-stage builds, GHA layer cache         |
|Registry      |GHCR             |Immutable digests, GITHUB_TOKEN auth        |
|SAST          |Semgrep          |OWASP Top 10 + JWT rulesets, free OSS       |
|Container scan|Trivy            |CVE + misconfiguration, SARIF output        |
|Deployment    |Render           |Rolling updates, health checks, deploy hooks|
|Versioning    |release-please   |Conventional Commits → semver automation    |
|Feature flags |Unleash          |Deploy/release decoupling                   |
|Monitoring    |Grafana + Loki   |DORA dashboard, SLO alerting     


|

<!-- pipeline ttests -->
<!-- pipeline tests -->





