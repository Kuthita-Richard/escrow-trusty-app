# Trusty Escrow

Next.js (App Router) + TypeScript + Tailwind + shadcn/ui + **Firebase backend** demo app for an escrow platform.

## Local development

```sh
npm install
npm run dev
```

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run start`: run production server
- `npm run lint`: run Next/ESLint
- `npm run test`: run Jest

## Project structure

- `src/app`: Next.js App Router routes
- `src/screens`: client-side “screens” used by routes (kept out of `src/pages` to avoid Pages Router conflicts)
- `src/components`: shared UI components
- `src/lib`: utilities + dummy data

## Firebase backend

Backend services (auth, database, storage) are provided by Firebase.

Create a `.env.local` file and add:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Then use the helpers in `src/lib/firebase.ts` (for example `getFirestoreDb()`, `getFirebaseAuth()`) from your server components, route handlers, or client components to read/write real data instead of the dummy data.

# escrow-trusty-app