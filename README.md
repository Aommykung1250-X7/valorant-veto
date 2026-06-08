# 🎮 VALORANT Map Veto — Real-Time Bo3 Draft System

A production-ready real-time VALORANT map ban/pick application built with **Next.js 14 App Router**, **Tailwind CSS**, and **Firebase Realtime Database**.

---

## 📋 Table of Contents

1. [Features](#features)
2. [Firebase Console Setup](#1-firebase-console-setup)
3. [Project Initialisation](#2-project-initialisation)
4. [Environment Variables](#3-environment-variables)
5. [Running the App](#4-running-the-app)
6. [Firebase Database Schema](#5-firebase-realtime-database-schema)
7. [Firebase Security Rules](#6-firebase-security-rules)
8. [Project Architecture](#7-project-architecture)
9. [Bo3 Veto Sequence](#8-bo3-veto-sequence)
10. [Deployment](#9-deployment-to-vercel)

---

## Features

- 🔴 **Real-time sync** — All actions instantly reflected across every connected browser via Firebase Realtime Database (no polling, no refresh).
- 👥 **3 roles** — Team A, Team B, and Spectator. Only the correct team can act on their turn.
- 🗺️ **VCT Masters London 2026 map pool** — Ascent, Breeze, Fracture, Haven, Lotus, Pearl, Split.
- 🛡️ **Interaction guards** — Buttons are disabled for the wrong team and all spectators.
- 🎨 **VALORANT-style dark UI** — Diagonal lines, clip-path corners, red/blue/gold accents, noise texture.
- 📊 **Step progress bar** — 9-dot progress indicator showing the full sequence at a glance.
- 🏆 **Match summary screen** — Final 3 maps with sides, banned maps, and a "Reset Room" button.

---

## 1. Firebase Console Setup

### Step 1 — Create a Firebase Project

1. Navigate to [https://console.firebase.google.com](https://console.firebase.google.com).
2. Click **"Add project"** and give it a name (e.g. `valorant-veto`).
3. Disable Google Analytics (not needed for this app).
4. Click **"Create project"**.

### Step 2 — Register a Web App

1. On the project overview page, click the **Web icon** (`</>`).
2. Register the app with a nickname (e.g. `veto-web`).
3. Click **"Register app"**.
4. You will see the `firebaseConfig` object — **copy these values** for your `.env.local`.
5. Click **"Continue to console"**.

### Step 3 — Create the Realtime Database

1. In the left sidebar, go to **Build → Realtime Database**.
2. Click **"Create database"**.
3. Select a region (e.g. `us-central1` or the closest to your users).
4. When prompted for security rules, choose **"Start in test mode"** (allows all reads/writes — suitable for development and LAN events).
5. Click **"Enable"**.
6. Copy the **Database URL** from the top of the page — it looks like:
   ```
   https://your-project-default-rtdb.firebaseio.com
   ```
   This becomes `NEXT_PUBLIC_FIREBASE_DATABASE_URL` in your `.env.local`.

---

## 2. Project Initialisation

If you cloned this repository, run:

```bash
# Install all dependencies (Next.js, Firebase, Tailwind, Framer Motion)
npm install

# Copy the environment template
cp .env.example .env.local
# Then fill in your Firebase values (see Step 3 below)
```

### Starting from scratch (for reference)

```bash
# Create Next.js 14 app with TypeScript + Tailwind CSS
npx create-next-app@14 valorant-veto \
  --typescript \
  --tailwind \
  --eslint \
  --app \
  --src-dir \
  --import-alias "@/*"

cd valorant-veto

# Install Firebase SDK and Framer Motion
npm install firebase framer-motion
```

---

## 3. Environment Variables

Create a `.env.local` file in the root of the project:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_DATABASE_URL=https://your-project-default-rtdb.firebaseio.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abc123def456
```

> ⚠️ **Never commit `.env.local` to Git.** The `.gitignore` already excludes it.

---

## 4. Running the App

```bash
# Development server with hot reload
npm run dev
# App available at http://localhost:3000

# Production build
npm run build
npm start
```

### How to use the app

1. Open `http://localhost:3000` in **three separate browser windows** (or share the URL with teammates).
2. **Window 1** → "Join as Team A"
3. **Window 2** → "Join as Team B"
4. **Window 3** → "Join as Spectator"
5. Team A's window will show active buttons on Step 1 (ban). The other windows show disabled/waiting state.
6. All 9 steps proceed in sequence. Side picks appear as a dedicated panel instead of map clicks.
7. After Step 9, the Match Summary screen shows for everyone with a "Reset Room" button.

---

## 5. Firebase Realtime Database Schema

The entire room state is stored at the root path `/room`:

```json
{
  "room": {
    "currentStep": 1,
    "isComplete": false,
    "lastUpdated": 1718000000000,
    "maps": {
      "ascent": {
        "id": "ascent",
        "name": "Ascent",
        "status": "available"
      },
      "breeze": {
        "id": "breeze",
        "name": "Breeze",
        "status": "banned",
        "bannedBy": "teamA"
      },
      "fracture": {
        "id": "fracture",
        "name": "Fracture",
        "status": "picked",
        "pickedBy": "teamB",
        "pickOrder": 2,
        "side": "attack",
        "sideChosenBy": "teamA"
      },
      "haven":    { "id": "haven",    "name": "Haven",    "status": "available" },
      "lotus":    { "id": "lotus",    "name": "Lotus",    "status": "available" },
      "pearl":    { "id": "pearl",    "name": "Pearl",    "status": "available" },
      "split":    { "id": "split",    "name": "Split",    "status": "available" }
    }
  }
}
```

### MapState field reference

| Field          | Type                        | Description                                        |
|----------------|-----------------------------|----------------------------------------------------|
| `id`           | `string`                    | Unique map identifier (lowercase)                  |
| `name`         | `string`                    | Display name                                       |
| `status`       | `"available"│"banned"│"picked"` | Current state                                |
| `bannedBy`     | `"teamA"│"teamB"`           | Set when status = "banned"                         |
| `pickedBy`     | `"teamA"│"teamB"│undefined` | Set when status = "picked" (undefined = decider)   |
| `pickOrder`    | `1│2│3`                     | Sequence order of the picked map                   |
| `side`         | `"attack"│"defend"`         | Starting side chosen for this map                  |
| `sideChosenBy` | `"teamA"│"teamB"`           | Which team made the side selection                 |

---

## 6. Firebase Security Rules

### Development / LAN (open access — use for local testing)

```json
{
  "rules": {
    ".read": true,
    ".write": true
  }
}
```

### Production (recommended — lock to specific room path)

```json
{
  "rules": {
    "room": {
      ".read": true,
      ".write": true,
      ".validate": "newData.hasChildren(['currentStep', 'maps', 'isComplete', 'lastUpdated'])"
    }
  }
}
```

> For a full production setup with authentication, add Firebase Auth and restrict `.write` to authenticated users with the correct role claim.

To apply rules:
1. Firebase Console → Realtime Database → **Rules** tab.
2. Paste the JSON above and click **"Publish"**.

---

## 7. Project Architecture

```
src/
├── app/
│   ├── layout.tsx          # Root layout (fonts, metadata, global CSS)
│   ├── globals.css         # VALORANT visual system (variables, clip-paths, noise)
│   ├── page.tsx            # Landing page — role selection
│   └── veto/
│       └── page.tsx        # Veto room route (Suspense wrapper)
│
├── components/
│   ├── VetoRoom.tsx        # 🧠 Main orchestrator: reads role, dispatches actions
│   ├── TurnIndicator.tsx   # Status bar: whose turn + what action + progress
│   ├── MapGrid.tsx         # 7-card grid (4 + 3 layout)
│   ├── MapCard.tsx         # Individual map: banned/picked overlays, click handler
│   ├── SidePicker.tsx      # Attack / Defend selection panel
│   └── MatchSummary.tsx    # Post-draft results + Reset button
│
├── hooks/
│   └── useRoom.ts          # Custom hook: Firebase onValue subscription
│
├── lib/
│   ├── firebase.ts         # Firebase app initialisation (singleton)
│   ├── gameConstants.ts    # Map pool, 9-step sequence, colours, helpers
│   └── roomActions.ts      # All Firebase read/write operations
│
└── types/
    └── index.ts            # Shared TypeScript types
```

### Data flow

```
Firebase Realtime DB
       │
       │  onValue (subscribeToRoom)
       ▼
   useRoom hook  ──→  roomState (React state)
       │
       ▼
   VetoRoom.tsx  (determines isMyTurn, currentAction)
       │
       ├──→ TurnIndicator  (display only)
       ├──→ MapGrid → MapCard  (click → banMap / pickMap)
       ├──→ SidePicker  (click → pickSide)
       └──→ MatchSummary  (when isComplete)
                │
                ▼
         roomActions.ts  (set() to Firebase)
                │
                ▼
        Firebase DB  ──→  broadcasts to ALL clients
```

---

## 8. Bo3 Veto Sequence

| Step | Team   | Action              | Notes                                          |
|------|--------|---------------------|------------------------------------------------|
| 1    | Team A | 🚫 Ban a map        |                                                |
| 2    | Team B | 🚫 Ban a map        |                                                |
| 3    | Team A | 🗺️ Pick Map 1       |                                                |
| 4    | Team B | 🎯 Pick side Map 1  | Team B picks Attack or Defend for Map 1        |
| 5    | Team B | 🗺️ Pick Map 2       |                                                |
| 6    | Team A | 🎯 Pick side Map 2  | Team A picks Attack or Defend for Map 2        |
| 7    | Team A | 🚫 Ban a map        |                                                |
| 8    | Team B | 🚫 Ban a map        |                                                |
| 9    | Team A | 🎯 Pick side Map 3  | Remaining map auto-becomes Map 3; Team A picks side |

After Step 8, the one remaining `available` map is automatically set to `status: "picked", pickOrder: 3` before Step 9 begins.

---

## 9. Deployment to Vercel

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard:
# Project Settings → Environment Variables
# Add each NEXT_PUBLIC_FIREBASE_* variable
```

Or connect your GitHub repository to Vercel for automatic deployments on push.

> 💡 **Tip for LAN events:** Deploy to Vercel, open the URL on every team's laptop, and everyone shares the same live room automatically.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Firebase: No Firebase App '[DEFAULT]'" | Check `.env.local` exists and has correct values |
| Buttons not showing / always disabled | Confirm the `role` query param is `teamA` or `teamB` in the URL |
| Changes not syncing | Check Firebase Rules are in test mode (allow read/write) |
| Database URL error | Ensure `NEXT_PUBLIC_FIREBASE_DATABASE_URL` includes `https://` |
| Room stuck / corrupted | Click "Reset Room" button or manually delete `/room` in Firebase Console |

---

## License

MIT — Free to use for community tournaments and LAN events.
