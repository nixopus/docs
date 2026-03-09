> For Mintlify product knowledge (components, configuration, writing standards),
> install the Mintlify skill: `npx skills add https://mintlify.com/docs`

# Nixopus Documentation

## About this project

- This is the user-facing documentation for [Nixopus](https://nixopus.com), a deployment platform
- Built on [Mintlify](https://mintlify.com) with MDX files and YAML frontmatter
- Configuration lives in `docs.json`
- Run `mint dev` to preview locally
- Run `mint broken-links` to check links
- API reference is auto-generated from `api-reference/openapi.json`

## Terminology

- Use "Nixopus" not "nixopus" in prose
- Use "Nixopus Cloud" for the managed service
- Use "self-hosted" (hyphenated) for the open-source deployment
- Use "deploy" not "deployment" as a verb (e.g., "deploy your app")
- Use "app" not "application" in guides
- Use "go live" not "launch" or "release"
- Use "dashboard" not "view" or "frontend" for the web UI
- Use "extension" not "plugin" for the editor extension
- Always say "VS Code or Cursor" not just "VS Code" alone

## Style preferences

- Use active voice and second person ("you")
- Keep sentences concise — one idea per sentence
- Use sentence case for headings
- Bold for UI elements: Click **Settings**
- Code formatting for file names, commands, paths, and code references
- Match the landing page energy: direct, confident, zero fluff
- Target audience: modern builders, solo founders, developers who want zero ops
- Do not add comments in code blocks that just narrate what the code does
