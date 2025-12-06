
Swadhin - Simple Firebase backend package
========================================

What this package contains
- admin.html        -> A lightweight admin UI to sign-in, view contact messages, and edit simple site content (key-value).
- contact.js        -> A small script to wire your frontend contact form to Firestore (contact_messages collection).
- firebase-config-example.js -> Example file to paste your Firebase project's config.
- README.md         -> This instructions file.

How it works (overview)
- Contact form submissions are saved into Firestore collection `contact_messages`.
- Site content (simple key→value) is stored in `site_content` collection (each document ID is the key).
- Admin UI allows email/password auth (enable Email/Password under Firebase Authentication), view messages, and edit content.
- Host the frontend (your static site) and admin.html on GitHub Pages (free). Use firebase-config.js with your real config.
- Firestore is part of Firebase and has a free tier (pay-as-you-go for large usage).

Step-by-step setup
1) Create Firebase project
   - Go to https://console.firebase.google.com/ and create a new project.

2) Create a Web App in Firebase
   - Project Settings -> Your apps -> Add app (</>) -> Register app.
   - Copy the config object and paste into firebase-config-example.js, then rename it to firebase-config.js in this package before deploying.

3) Enable Firestore
   - Build -> Firestore Database -> Create database -> Start in production or test mode (test mode is OK while building).

4) Enable Authentication (Email/Password)
   - Build -> Authentication -> Sign-in method -> Enable Email/Password.

5) Deploy files to GitHub Pages
   - Create a new repo (public), upload your frontend files and this package's files.
   - Make sure to include firebase-config.js (with your actual config) before uploading.
   - In repo Settings -> Pages -> Deploy from branch `main` / folder `/root`.

6) Use contact.js in your frontend
   - Include firebase-config.js and contact.js in your HTML pages where the contact form exists.
   - Ensure the contact form has id="contactForm" and fields name="name", name="email", name="subject", name="message".

7) Admin access
   - Open admin.html on your GitHub Pages URL (e.g. https://<username>.github.io/<repo>/admin.html).
   - Sign up with an email/password (or create admin first in Firebase console under Authentication).
   - You will be able to see and export messages and manage simple content keys.

Security notes
- Do NOT commit secrets (server API keys) in public repositories. The Firebase config is safe for client apps; however, restrict rules if necessary.
- For production, configure Firestore rules so public cannot read all messages. You can allow writes for contact messages, but make reads restricted to authenticated admin accounts.
  Example basic rules (start in test mode while building):
    rules_version = '2';
    service cloud.firestore {
      match /databases/{database}/documents {
        match /contact_messages/{msg} {
          allow create: if true;          // anyone can submit
          allow read, delete: if request.auth != null && request.auth.token.email_verified == true; // only signed-in admins
        }
        match /site_content/{doc} {
          allow read: if true;
          allow write: if request.auth != null;
        }
      }
    }

Need help?
- If you want, I can customize the admin UI to show specific site sections (Projects, About, etc.) and help set Firestore Rules and deploy. Reply "Customize admin" and tell me which sections you want to manage (e.g., Projects with images, About text, Social links).
