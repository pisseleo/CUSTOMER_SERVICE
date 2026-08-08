# Customer Service Request App

A React + TypeScript + Vite application for managing customer service requests. This repo includes Tailwind CSS integration, React Router, React Query, OIDC authentication, and a production-ready Docker/Nginx deployment flow.

The application that consumes the Customer Service API and authenticates users through an external **OpenID Connect (OIDC)** provider using **Keycloak**.

## Features

- React 19 + TypeScript + Vite
- Tailwind CSS 4 via `@tailwindcss/vite`
- React Router v7
- React Query v5 for server state
- OIDC authentication with `react-oidc-context`
- API interaction via Axios
- Docker + Nginx production deployment

## Project structure

- `src/` — app source code
- `src/pages/` — page-level screens
- `src/components/` — reusable UI components
- `src/api/` — API client, errors, and mock data
    src/api/
    ├── frontend-challenge-api.openapi.yaml
    ├── mockApi.ts
    ├── client.ts
    └── apiRequest.ts
- `src/hooks/` — React Query hooks
- `src/auth/` — OIDC auth config
- `src/types/` — shared TypeScript types
- `Dockerfile` — production container build
- `nginx.conf` — Nginx static server config
- `vite.config.ts` — Vite build/dev server config

then configure the .env with variables based on .env.example structure

## Prerequisites

- Node.js 22+ or compatible
- npm
- Docker (for container builds)

## Install dependencies

```bash
npm install
```

## Development

Start the Vite dev server:

```bash
npm run dev
```

Open the app at `http://localhost:5173`.

### Dev server proxy

During development, the app proxies `/realms` requests to `http://localhost:8080`.
This avoids CORS issues when your Keycloak/OpenID provider is running locally.

## Build

Compile the app for production:

```bash
npm run build
```

The production assets are generated in `dist/`.

## Preview

Serve the production build locally with Vite:

```bash
npm run preview
```

## Docker and Nginx

This repo contains a multi-stage `Dockerfile` and `nginx.conf` for building and serving the app as a static site.

### Docker build

```bash
docker build -t customer-service-app .
```
or you can use this command bellow
```bash
docker compose up -d --build
```

in case you're might be running in development mode just user

```
docker compose up
```
the command enables watching the processes on console

### Run container

```bash
docker run -p 80:80 customer-service-app
```

Then open `http://localhost`.

### Nginx config

`nginx.conf` is configured to:

- listen on port `80`
- serve static files from `/usr/share/nginx/html`
- fallback unresolved routes to `index.html` for SPA routing

```nginx
server {
    listen 80;
    server_name localhost;

    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## Tailwind CSS

Tailwind is enabled through `@tailwindcss/vite` in `vite.config.ts`.
The entry CSS file is `src/index.css` and includes:

```css
@tailwind
```

## Scripts

- `npm run dev` — start Vite dev server
- `npm run build` — build production assets
- `npm run preview` — preview the production build
- `npm run lint` — run ESLint

## Troubleshooting

- If Tailwind styles are missing, verify `src/index.css` contains the Tailwind directives and `@tailwindcss/vite` is enabled in `vite.config.ts`.
- If you see CORS errors against `/realms`, ensure your auth server is reachable at `http://localhost:8080` or update the proxy target in `vite.config.ts`.
- For production, adapt the Nginx config and auth settings to your deployed domain.

## Notes

- This app uses client-side routing, so Nginx must rewrite unknown paths to `index.html`.
- The Dockerfile builds the app in Node and serves it with Nginx for a simple production deployment.
