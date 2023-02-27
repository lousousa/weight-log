# Weight Log

## Overview

This application is focused on simplifying the task of saving log entries for daily weights and showing them visually organized. The data is written and read from a Google Sheets document for a pre-defined single user.

## Featured stack:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Google Spreadsheet for Node](https://theoephraim.github.io/node-google-spreadsheet/#/)

## Preview

[PREVIEW MOBILE]

[PREVIEW DESKTOP]

## Getting Started

#### 1. Configure Google Sheets

- **1.1.** Create a Google Sheets document in this structure, each row containing a **date** column (YYYY-MM-DD) and then a **weight** column (a number with 1 decimal place).

 [EXAMPLE IMAGE]

- **1.2.** Go to [Google Console](https://console.cloud.google.com/apis/credentials), create a new **service account** credential, then add the following variables to the `.env` file on the root project:
 - `GOOGLE_SPREADSHEET_ID`
 - `GOOGLE_SERVICE_ACCOUNT_EMAIL`
 - `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

- **1.3.** Go back to the Google Sheets document and share it with the same `GOOGLE_SERVICE_ACCOUNT_EMAIL`, allowing sharing as an **editor** role.

#### 2. Configure Google OAuth client ID

- **2.1.** Go again to [Google Console](https://console.cloud.google.com/apis/credentials), create a new **Oauth client ID** credential, and then enable the *localhost* and *remote host* access on its ID settings.

- **2.2.** Add new variables values to the `.env` file:

 - `GOOGLE_OAUTH2_CLIENT_ID`
 - `GOOGLE_OAUTH2_CLIENT_SECRET`

#### 3. Set remaining environment variables

- `JWT_SECRET`: a secret key required by Next Auth, that can be obtained by typing on terminal `openssl rand -base64 32`.

- `ALLOW_LIST`: a allow email list comma-separated for Google accounts that can log in to the application.

- `SERVER_PORT`: the server port used for the application in production.

- `NEXTAUTH_URL`: the URL used for the application in production (required by Next Auth).

#### 4. Run the development server

```bash
yarn install
```

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## That's it

I hope you enjoy the application!
