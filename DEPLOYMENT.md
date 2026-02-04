# Vercel Deployment Guide for Trusty Escrow

## ✅ Pre-Deployment Checklist

- ✅ Next.js (App Router) + Firebase
- ✅ Environment variables documented in `.env.example`
- ✅ Vercel configuration in `vercel.json`

## 🚀 Steps to Deploy on Vercel

### 1. **Prepare Firebase Credentials**
   - Go to your Firebase Console: https://console.firebase.google.com/
   - Select your project
   - Click **Project Settings** (gear icon)
   - Under "Your apps", copy values from the web app config:
     - `NEXT_PUBLIC_FIREBASE_API_KEY`
     - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
     - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
     - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
     - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
     - `NEXT_PUBLIC_FIREBASE_APP_ID`
     - `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` (optional, for Analytics)

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
   - Add Environment Variables with the `NEXT_PUBLIC_` prefix
   - Click **Deploy**

   **Option B: Via Vercel CLI**
   ```bash
   npm install -g vercel
   vercel login
   vercel --prod
   ```
   Add env vars in the Vercel dashboard after linking.

## 🔧 Configuration Details

- **Framework**: Next.js (auto-detected by Vercel)
- **Build Command**: `npm run build`
- **Output**: Next.js handles `.next` output automatically

## ⚠️ Notes

1. All `NEXT_PUBLIC_FIREBASE_*` variables must be set in Vercel for the app to work.
2. Enable Email/Password (and any other) sign-in methods in Firebase Console → Authentication.

## 📊 Project Structure

```
trusty-escrow-main/
├── src/app/           # Next.js App Router routes
├── src/screens/       # Page components
├── src/components/    # Shared UI
├── src/lib/           # Firebase, utils, types
├── package.json
├── vercel.json
└── .env.example
```

---

**Status**: ✅ Ready for Vercel deployment (Next.js)
**Last Updated**: February 3, 2026
