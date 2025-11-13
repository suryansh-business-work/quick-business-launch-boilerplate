Multi-project Docker Compose

This repository contains three subprojects and a top-level Docker Compose configuration that runs them behind a single Nginx reverse-proxy.

Projects:
- `astro-website` — Astro site (TypeScript + SCSS)
- `react-app` — React app (TSX + SCSS, built with Vite)
- `node-api` — Node.js API (TypeScript)

Quick note: make sure Docker Desktop or your Docker daemon is running locally before using the compose stack.

How to build and run locally:

```bash
# from repo root
docker-compose up --build
```

Open http://localhost:8080
- `/` -> Astro site
- `/app/` -> React app
- `/api/` -> Node API (proxy)

Troubleshooting
- If you see connection errors like "open //./pipe/dockerDesktopLinuxEngine" on Windows, start Docker Desktop and/or unset an invalid DOCKER_HOST environment variable in your shell.
