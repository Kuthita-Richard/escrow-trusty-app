# Vercel Deployment Guide for Trusty Escrow

## ✅ Pre-Deployment Checklist

All critical issues have been fixed:

- ✅ Firebase dependency added to `package.json`
- ✅ Type definitions fixed in `vite-env.d.ts`
- ✅ Environment variables documented in `.env.example`
- ✅ Vercel configuration created in `vercel.json`
- ✅ Build configuration ready (Vite + React)

## 🚀 Steps to Deploy on Vercel

### 1. **Prepare Firebase Credentials**
   - Go to your Firebase Console: https://console.firebase.google.com/
   - Select your project
   - Click **Project Settings** (gear icon)
   - Copy these values from the "General" tab:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`

### 2. **Push Code to Git Repository**
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

### 3. **Deploy on Vercel**

   **Option A: Via Vercel Dashboard**
   - Go to https://vercel.com/new
   - Import your Git repository (GitHub/GitLab/Bitbucket)
   - Select the `trusty-escrow-main` folder as root
   - Add Environment Variables:
     - `VITE_FIREBASE_API_KEY`
     - `VITE_FIREBASE_AUTH_DOMAIN`
     - `VITE_FIREBASE_PROJECT_ID`
     - `VITE_FIREBASE_STORAGE_BUCKET`
     - `VITE_FIREBASE_MESSAGING_SENDER_ID`
     - `VITE_FIREBASE_APP_ID`
   - Click **Deploy**

   **Option B: Via Vercel CLI**
   ```bash
   # Install Vercel CLI
   npm install -g vercel

   # Login to Vercel
   vercel login

   # Navigate to project
   cd trusty-escrow-main

   # Deploy
   vercel --env VITE_FIREBASE_API_KEY=YOUR_VALUE \
          --env VITE_FIREBASE_AUTH_DOMAIN=YOUR_VALUE \
          --env VITE_FIREBASE_PROJECT_ID=YOUR_VALUE \
          --env VITE_FIREBASE_STORAGE_BUCKET=YOUR_VALUE \
          --env VITE_FIREBASE_MESSAGING_SENDER_ID=YOUR_VALUE \
          --env VITE_FIREBASE_APP_ID=YOUR_VALUE
   ```

## 🔧 Configuration Details

### Build Settings
- **Build Command**: `npm run build` (or `bun run build`)
- **Output Directory**: `dist/`
- **Framework**: Vite + React

### Environment Variables
All Firebase environment variables are **required** for production builds. They are configured in:
- `vercel.json` (defines required variables)
- `.env.example` (reference for local development)
- `src/vite-env.d.ts` (TypeScript definitions)

### Rewrites & Routing
The `vercel.json` includes a rewrite rule to support client-side routing:
```json
"rewrites": [
  {
    "source": "/(.*)",
    "destination": "/index.html"
  }
]
```
This ensures all routes are handled by React Router.

## ⚠️ Known Limitations & Notes

1. **Firebase Emulator**: Emulator connections (on `localhost:9099`, `localhost:8080`, `localhost:9199`) are only active in development mode. In production, the code connects to live Firebase services.

2. **Environment Variables**: All `VITE_FIREBASE_*` variables must be set in Vercel for the app to work. The build will fail or the app won't function without them.

3. **Bun Lock File**: The project uses `bun.lockb`. Vercel can handle this, but if you encounter issues, you can use `package.json` with npm instead.

## 🔍 Troubleshooting

### Build Fails with "Cannot find module 'firebase'"
- Ensure dependencies are installed: `bun install` or `npm install`
- Check that `firebase` is in `package.json` (it has been added)

### Blank Page or 404 Errors
- Verify all Firebase environment variables are set in Vercel dashboard
- Check browser console for errors
- Ensure the rewrite rules in `vercel.json` are deployed

### Firebase Connection Issues
- Confirm Firebase credentials are correct
- Check Firebase project security rules allow your domain
- Verify CORS settings in Firebase if accessing from client-side

## 📊 Project Structure
```
trusty-escrow-main/
├── src/
│   ├── pages/          # All route pages
│   ├── components/     # React components
│   ├── lib/           # Firebase config & utilities
│   └── hooks/         # Custom React hooks
├── package.json       # Dependencies (Firebase added)
├── vite.config.ts     # Vite configuration
├── vercel.json        # Vercel deployment config
├── .env.example       # Environment variables reference
└── tsconfig.json      # TypeScript configuration
```

## ✨ Next Steps After Deployment

1. Test all pages load correctly
2. Verify Firebase auth, Firestore, and Storage are accessible
3. Test user sign-up and login flows
4. Create a test transaction to verify data persistence
5. Monitor Vercel dashboard for errors
6. Share the URL with your client for preview

---

**Status**: ✅ Ready for Vercel deployment
**Last Updated**: January 25, 2026
