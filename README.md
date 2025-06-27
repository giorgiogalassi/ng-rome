# DevFest Website Template (Angular)

A template for DevFest event websites, focusing on speed and accessibility. Built with Angular 20, static prerendering, Angular Material, and Tailwind CSS. Content is managed via JSON.

## Project Structure

Angular app: `/devfest-site`

## Prerequisites

- Node.js (v20.x+)
- npm
- Angular CLI (v20.x): `npm install -g @angular/cli@20`

## Setup

1.  `git clone <repository-url> && cd <repository-name>`
2.  `cd devfest-site`
3.  `npm install`

## Development Server

From `/devfest-site`:
`npm start` or `ng serve`
App runs at `http://localhost:4200/`.

To test SSR locally (after a build):
`npm run serve:ssr` (serves from `dist/devfest-site/server/server.mjs`, usually on `http://localhost:4000/`)

## Build & Prerendering

From `/devfest-site`:
`npm run prerender` (or `npm run build`)
Output: `devfest-site/dist/devfest-site/` (`browser/` for static files, `server/` for SSR bundle).

## Content Management

- Edit JSON files in `devfest-site/src/assets/data/`.
- Commit & push changes. GitHub Actions will redeploy.

## Deployment (Firebase Hosting via GitHub Actions)

1.  **Firebase Setup:**
    - Update `devfest-site/.firebaserc` with your Firebase Project ID.
    - `devfest-site/firebase.json` is pre-configured.

2.  **GitHub Actions:**
    - Workflow: `.github/workflows/firebase-hosting.yml`.
    - **Required Secret**: `FIREBASE_SERVICE_ACCOUNT_DEVFEST_SITE` (JSON key for Firebase service account). Set in GitHub repo settings.
    - **Project ID in Workflow**: Update `<YOUR_FIREBASE_PROJECT_ID>` in the workflow file.
    - **Deploys**:
        - `main` branch push -> Firebase preview channel.
        - `release` branch push -> Firebase live channel.

3.  **Custom Domain (`devfest.<region>.gdg.dev`):**
    - Configure in Firebase Console (Hosting > Add custom domain).
    - Update DNS records as instructed by Firebase. SSL is auto-provisioned.

## Testing

-   **Unit Tests**: Run `npm test` from `/devfest-site`. (Requires Karma/Jasmine setup; may need manual setup if using the minimal version of this template). Example `.spec.ts` files are provided.
-   **E2E/Accessibility/Performance**: Use tools like Cypress/Playwright (for E2E), axe-core (accessibility), and Lighthouse (performance). Integrate these into CI as needed.