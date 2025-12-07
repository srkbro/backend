# Firebase Admin Backend (for Md Sadikur Rahman Shadhin)

**Important:** DO NOT upload your `serviceAccountKey.json` to a public GitHub repository.
Instead, keep it locally on your server or use secret storage when deploying (Cloud Run secrets, Railway environment variables, etc.).

## What is included
- firebase-admin-backend.js  (Express + Firebase Admin)
- views/admin.ejs            (Admin UI to view + delete messages)
- package.json
- frontend/                  (instructions & placeholder contact form changes)
- serviceAccountKey.example.json (placeholder - replace with your real file locally)

## Quick start (local)
1. Copy your real service account JSON to this folder and rename it to `serviceAccountKey.json`.
2. Run:
   ```
   npm install
   ADMIN_PASS=shadhin123 node firebase-admin-backend.js
   ```
3. Open admin UI:
   `http://localhost:3000/admin?admin_pass=shadhin123`

## Firestore setup
- Create a Firestore database (in production mode or test as you prefer).
- The default collection used is `contacts`. You can change it by setting `CONTACTS_COLLECTION` env var.

## Frontend (GitHub Pages) integration (Option A - direct Firestore)
If your website is hosted on GitHub Pages, the easiest option is to let the frontend write directly to Firestore (no server needed for writes).

1. In Firebase Console -> Project Settings -> General -> Add web app and copy the Firebase config object.
2. In `frontend/contact.form.example.html` replace the firebaseConfig placeholder with your config.
3. Commit only the frontend files to GitHub Pages. **Do not** commit `serviceAccountKey.json`.

## Notes on security
- The admin UI uses a very simple `ADMIN_PASS` check (query param or header). For production, secure it with Firebase Auth or server-level auth.
- Keep service account JSON private.
