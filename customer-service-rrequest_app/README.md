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

## Solution overview

This project is a customer service request portal built with React, TypeScript, Vite, and Tailwind CSS. It supports request listing, request detail viewing, request creation, and request status updates. The app uses an OIDC provider for authentication and provides a local API mock fallback when the backend is unavailable.

## Technology and library choices

- React 19 and TypeScript for a modern, type-safe frontend.
- Vite for fast development builds and HMR.
- Tailwind CSS for utility-first styling.
- React Router v7 for client-side routing.
- React Query v5 for server-state management and caching.
- `react-oidc-context` for OIDC authentication flows.
- `axios` only remains in legacy files; the current API layer uses the custom `apiRequest` wrapper with Fetch.

## Architecture summary

- `src/pages/` holds page-level route components.
- `src/components/` contains reusable UI and form components.
- `src/hooks/` defines React Query hooks for API interactions.
- `src/api/` stores the API client, error handling, request wrapper, and mock API behavior.
- `src/auth/` contains OIDC configuration.
- `src/types/` defines shared domain models and request/response types.
- `Dockerfile` and `nginx.conf` support production container builds and SPA routing.

## Local setup instructions

1. Clone the repo.
2. Run `npm install`.
3. Copy `.env` from `.env.example` if available, or create a `.env` file with the required variables.
4. Start the app with `npm run dev`.
5. Open `http://localhost:5173` in your browser.

## OIDC provider configuration

The app expects an OpenID Connect provider such as Keycloak running locally. Configure the following variables in `.env`:

- `VITE_OIDC_AUTHORITY` — the OIDC issuer URL (e.g. `http://localhost:8080/realms/customer-service`).
- `VITE_OIDC_CLIENT_ID` — the client ID registered in the OIDC provider.
- `VITE_OIDC_REDIRECT_URI` — typically `http://localhost:5173`.
- `VITE_OIDC_POST_LOGOUT_REDIRECT_URI` — typically `http://localhost:5173`.
- `VITE_OIDC_RESPONSE_TYPE` — usually `code`.
- `VITE_OIDC_SCOPE` — usually `openid profile email`.
- `VITE_OIDC_AUDIENCE` — the API audience accepted by the provider.
- `VITE_OIDC_SILENT_REDIRECT_URI` — for silent renew, e.g. `http://localhost:5173/silent-renew.html`.

## Environment-variable configuration

The app also supports these environment variables:

- `VITE_API_BASE_URL` — base path for API requests, default is `/api`.
- `VITE_USE_MOCK_API` — set to `true` to use the built-in local mock API fallback.
- `VITE_OIDC_AUTHORITY`, `VITE_OIDC_CLIENT_ID`, `VITE_OIDC_REDIRECT_URI`, `VITE_OIDC_POST_LOGOUT_REDIRECT_URI`, `VITE_OIDC_RESPONSE_TYPE`, `VITE_OIDC_SCOPE`, `VITE_OIDC_AUDIENCE`, `VITE_OIDC_SILENT_REDIRECT_URI` — OIDC settings.

## API-mocking approach

The app includes a local mock API implementation in `src/api/mockApi.ts`. When `VITE_USE_MOCK_API=true`, the client will fall back to these mock handlers for:

- `GET /requests`
- `GET /requests/{id}`
- `POST /requests`
- `PATCH /requests/{id}/status`

Mock data is seeded from the OpenAPI examples in `src/api/frontend-challenge-api.openapi.yaml` or generated locally if none are available. The mock layer stores data in `localStorage` to preserve state across page reloads.

## Development, lint, test, and build commands

- `npm run dev` — start Vite dev server.
- `npm run build` — compile production assets.
- `npm run preview` — preview the production build.
- `npm run lint` — run ESLint.

## Testing strategy

This repo uses Vitest for automated unit and component tests, with React Testing Library for UI interactions.

- `npm run test` starts the Vitest interactive runner.
- `npm run test:run` executes the test suite once in CI-style mode.
- keyboard and form flows can be tested using React Testing Library and user event simulation.
- add API integration tests for `src/api/client.ts` and mock behavior in `src/api/mockApi.ts`.

## GitHub Actions workflow description

The repository includes a GitHub Actions workflow at `.github/workflows/ci.yml`.

The workflow installs dependencies, runs linting, executes the build, and runs the test suite.

## Security and accessibility considerations
As I could find and make some research about OIDC ann other Authentications and security based on project description:

- OIDC authentication is used for secure login.
- API calls include bearer tokens when available.
- User input is validated before form submission.
- The app should be audited for keyboard navigation and focus order.
- Accessible labels are added to form controls and buttons.

## Known limitations
Yet some features are about have deep understanding, in this project o could basic features based on my core knowledge base, so, there then there are points i could take bellow:

- The repo currently relies on a local backend proxy or mock mode for API requests.
- The GitHub Actions workflow is not present.
- Some components may still use legacy colors or CSS classes that should be unified.
