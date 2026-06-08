// ============================================================
// lib/firebase.ts — Firebase Realtime Database initialisation
// ============================================================
// SETUP INSTRUCTIONS:
//  1. Go to https://console.firebase.google.com and create a project.
//  2. Click "Add app" → Web (</>) and register it.
//  3. Copy the firebaseConfig object shown and paste the values
//     into your .env.local file (see .env.example).
//  4. In the Firebase console sidebar:
//       Build → Realtime Database → Create database
//     Choose "Start in test mode" for development
//     (allows all reads & writes — tighten for production).
// ============================================================

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey:            process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain:        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL:       process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId:         process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Prevent re-initialisation in Next.js hot-reload / SSR
const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const db = getDatabase(app);
