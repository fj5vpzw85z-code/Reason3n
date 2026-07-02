# Reason3n

**Reason3n** is an operational layer on top of existing marketing and sales tools (HubSpot, Excel, Notion, Slack). It connects, remembers, and limits AI suggestions through a human-in-the-loop approval gate.

## Architecture

Based on the **Reason3n MVP Architecture & Build-Ready Specification v1.0**.

### Project Structure (Antigravity As-Built)

This repository is a monorepo designed for the Antigravity platform:

- `apps/web`: Frontend SPA (Next.js)
- `apps/api`: Backend service (REST + workers, Node.js)
- `apps/worker`: Async background jobs (Sync, Ledger integrity, write-back)
- `packages/contracts`: Shared TypeScript types and Zod schemas
- `packages/connectors`: HubSpot, CSV, Notion, Slack modules
- `packages/ledger-core`: Hash-chain logic
- `infrastructure/`: Platform manifests and DB migrations
- `tests/`: Unit, integration, and security tests

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development servers:
   ```bash
   npm run dev
   ```

*(Note: Antigravity-specific runtime placeholders need to be filled before full deployment. See Section 9 of the architecture specification).*
