# Weight Log

[![react](https://badges.aleen42.com/src/react.svg)](https://badges.aleen42.com/src/react.svg) [![typescript](https://badges.aleen42.com/src/typescript.svg)](https://badges.aleen42.com/src/typescript.svg)

## Overview

This application is focused on simplifying the task of saving log entries for daily body weight and showing them visually organized. The data is written and read from a Google Sheets document for a pre-defined single user.

## Featured stack:

- [Next.js](https://nextjs.org/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [NextAuth.js](https://next-auth.js.org/)
- [Google Spreadsheet for Node](https://theoephraim.github.io/node-google-spreadsheet/#/)

## Preview

### Mobile:

![mobile](https://user-images.githubusercontent.com/2921281/221741703-0ecce18f-82cf-45a8-8272-68c63cbd0159.gif)

### Desktop:

![desktop](https://user-images.githubusercontent.com/2921281/221742346-08782544-d99d-40ff-9296-49539a3255c6.gif)

## Getting started

### 1. Configure Google Sheets

- **1.1.** Create a [Google Sheets](https://sheets.google.com) document with this structure, each row containing a **date** column (YYYY-MM-DD) and a **weight** column (a number with 1 decimal place), and then rename the current sheet title to an **allowed user's email**:

 ![image](https://user-images.githubusercontent.com/2921281/221711464-73155a9a-af19-4353-af90-41a4bbb628ac.png)

 **... on the footer:**

 ![image](https://github.com/lousousa/weight-log/assets/2921281/9e787800-d5eb-4afd-b674-7361f456ad46)

- **1.2.** Add the variable `GOOGLE_SPREADSHEET_ID` to the `.env` file on the project root, by getting the following URL param on the created document:
```
https://docs.google.com/spreadsheets/d/GOOGLE_SPREADSHEET_ID
```

- **1.3.** Go to [Google Console](https://console.cloud.google.com/apis/credentials), create a new **service account** credential, then add the following variables to the `.env` file:

  * `GOOGLE_SERVICE_ACCOUNT_EMAIL`
  * `GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY`

- **1.4.** Go back to the Google Sheets document and share it with the same `GOOGLE_SERVICE_ACCOUNT_EMAIL`, allowing sharing as an **editor** role.

### 2. Configure Google OAuth client ID

- **2.1.** Go again to [Google Console](https://console.cloud.google.com/apis/credentials), create a new **Oauth client ID** credential, and then enable the *localhost* and *remote host* access on its ID settings.

![image](https://github.com/lousousa/weight-log/assets/2921281/9f644e80-217a-4d8c-a6a9-fe97ee293a5b)

- **2.2.** Add new variables values to the `.env` file:

  * `GOOGLE_OAUTH2_CLIENT_ID`
  * `GOOGLE_OAUTH2_CLIENT_SECRET`

### 3. Set remaining environment variables

- `JWT_SECRET`: a secret key required by Next Auth, that can be obtained by typing on terminal:

```bash
openssl rand -base64 32
```

- `ALLOW_LIST`: a allow email list comma-separated for Google accounts that can log in to the application.

- `SERVER_PORT`: the server port used for the application in production.

- `NEXTAUTH_URL`: the URL used for the application in production (required by Next Auth).

### 4. Run the development server

```bash
yarn install
```

```bash
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 5. Build for production

```bash
yarn build
```

```bash
yarn start
```

## That's it

I developed this app to have a simple interactive method to daily log my body weight, and because I knew it'd be fun to code it. Feel free to fork it and make your own custom needs or experience. I sincerely hope you enjoy it too!
