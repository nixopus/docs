# Nixopus Documentation

User-facing documentation for [Nixopus](https://nixopus.com), a deployment platform for modern builders who want zero ops. Built with [Mintlify](https://mintlify.com).

## Structure

- `getting-started/` — Introduction and quickstart
- `guides/` — Deploying apps, AI chat, GitHub integration, notifications, and more
- `concepts/` — Authentication, organizations, deployments, domains
- `cloud/` — Nixopus Cloud features (machines, credits, API keys, custom domains, teams)
- `self-hosting/` — Installation, configuration, management CLI, updates, backups
- `extension/` — Nixopus extension for VS Code or Cursor
- `api-reference/` — Auto-generated from the [OpenAPI spec](https://github.com/nixopus/nixopus)
- `docs.json` — Site configuration (navigation, theme, integrations)

## Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mint):

```bash
npm i -g mint
```

Preview locally:

```bash
mint dev
```

Open `http://localhost:3000` to view the docs.

Check for broken links:

```bash
mint broken-links
```

## Publishing

Changes pushed to the default branch are deployed to production automatically via the Mintlify GitHub app.

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Resources

- [Nixopus](https://nixopus.com)
- [GitHub](https://github.com/nixopus/nixopus)
- [Discord](https://invite.nixopus.com)
- [Mintlify docs](https://mintlify.com/docs)
