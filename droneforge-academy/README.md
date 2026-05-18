# 🚁 DroneForge Academy

**Build. Fly. Master.** — A full-stack drone learning platform with courses, build wizard, community, and real-time progress tracking.

---

## 🏗️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Three.js, Framer Motion |
| **State** | Zustand (global), React Query (server state) |
| **Backend** | Node.js 20+, Express.js |
| **Database** | Firebase Firestore (NoSQL, real-time) |
| **Auth** | Firebase Authentication (Email, Google, GitHub) |
| **Storage** | Firebase Storage |
| **Hosting** | Vercel (frontend + serverless API) |
| **Routing** | React Router v6 |

---

## 📁 Project Structure

```
droneforge-academy/
├── frontend/                    # React + Vite app
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   │   ├── Layout.jsx       # Root layout (cursor, progress bar)
│   │   │   ├── Navbar.jsx       # Navigation with auth state
│   │   │   ├── Footer.jsx       # Site footer
│   │   │   ├── DroneCard.jsx    # Drone type display card
│   │   │   └── ThreeBackground.jsx  # Three.js 3D particle scene
│   │   ├── pages/
│   │   │   ├── HomePage.jsx     # Landing page + hero
│   │   │   ├── AuthPage.jsx     # Sign in / Sign up / Reset
│   │   │   ├── DashboardPage.jsx    # User dashboard + stats
│   │   │   ├── DronesPage.jsx   # Drone types explorer
│   │   │   ├── CoursesPage.jsx  # Course catalog
│   │   │   ├── LessonPage.jsx   # Individual lesson viewer
│   │   │   ├── BuildWizardPage.jsx  # Step-by-step build configurator
│   │   │   ├── ComponentsPage.jsx   # Component guide with tabs
│   │   │   ├── ComparePage.jsx  # Side-by-side drone comparison
│   │   │   ├── CommunityPage.jsx    # Community posts + likes
│   │   │   ├── ProfilePage.jsx  # User profile editor
│   │   │   └── NotFoundPage.jsx
│   │   ├── lib/
│   │   │   ├── firebase.js      # Firebase client SDK init
│   │   │   ├── firestore.js     # All Firestore service functions
│   │   │   ├── AuthContext.jsx  # Auth provider + hooks
│   │   │   ├── store.js         # Zustand stores
│   │   │   └── api.js           # Axios client → backend API
│   │   ├── styles/
│   │   │   └── index.css        # Global styles + Tailwind base
│   │   ├── App.jsx              # Route definitions
│   │   └── main.jsx             # Entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                     # Express.js API
│   ├── src/
│   │   ├── index.js             # Express app entry
│   │   ├── config/
│   │   │   └── firebase.js      # Firebase Admin SDK init
│   │   ├── middleware/
│   │   │   ├── auth.js          # JWT verification (Firebase tokens)
│   │   │   └── errorHandler.js  # Global error + request logger
│   │   └── routes/
│   │       ├── courses.js       # GET /api/courses, /lessons
│   │       ├── users.js         # GET/PATCH /api/user/me, /leaderboard
│   │       ├── builds.js        # CRUD /api/builds
│   │       ├── community.js     # Posts, likes, comments
│   │       ├── parts.js         # Parts database search
│   │       ├── progress.js      # Lesson completion + XP
│   │       └── analytics.js     # Platform stats
│   ├── .env.example
│   └── package.json
│
├── firestore.rules              # Firestore security rules
├── firestore.indexes.json       # Composite query indexes
├── firebase.json                # Firebase CLI config
├── vercel.json                  # Vercel deployment config
└── package.json                 # Root monorepo scripts
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- npm 9+
- Firebase project (free tier works)
- Vercel CLI (for deployment)

### 1. Clone & Install

```bash
git clone https://github.com/your-username/droneforge-academy.git
cd droneforge-academy
npm run install:all
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project (or use existing)
3. Enable these services:
   - **Authentication**: Email/Password + Google + GitHub
   - **Firestore Database**: Start in production mode
   - **Storage**: Default bucket
4. Go to **Project Settings → Your Apps → Add Web App**
5. Copy the config values

### 3. Configure Environment

**Frontend** — create `frontend/.env.local`:
```bash
cp frontend/.env.example frontend/.env.local
# Fill in your Firebase config values
```

**Backend** — create `backend/.env`:
```bash
cp backend/.env.example backend/.env
```

For the backend, download your **Service Account JSON**:
- Firebase Console → Project Settings → Service Accounts → Generate New Private Key
- Save as `backend/config/serviceAccount.json` (gitignored)

### 4. Deploy Firestore Security Rules

```bash
npm install -g firebase-tools
firebase login
firebase use --add   # select your project
firebase deploy --only firestore:rules,firestore:indexes
```

### 5. Run Development

```bash
# Start both frontend (port 3000) and backend (port 5001) simultaneously
npm run dev

# Or individually:
npm run dev:frontend
npm run dev:backend
```

Open http://localhost:3000

---

## 🌐 Deploy to Vercel

### Automated (Recommended)

1. Push to GitHub
2. Go to [vercel.com](https://vercel.com) → Import Project
3. Set **Root Directory** to root of repo
4. Add all environment variables from `.env.example` files
5. For `FIREBASE_SERVICE_ACCOUNT`, paste the entire JSON content of `serviceAccount.json` as one line

### CLI

```bash
npm install -g vercel
vercel login
vercel --prod
```

### Required Vercel Environment Variables

```
VITE_FIREBASE_API_KEY
VITE_FIREBASE_AUTH_DOMAIN
VITE_FIREBASE_PROJECT_ID
VITE_FIREBASE_STORAGE_BUCKET
VITE_FIREBASE_MESSAGING_SENDER_ID
VITE_FIREBASE_APP_ID
VITE_FIREBASE_MEASUREMENT_ID
FIREBASE_SERVICE_ACCOUNT          (entire JSON as string)
FIREBASE_STORAGE_BUCKET
ALLOWED_ORIGINS                    (your Vercel domain)
NODE_ENV=production
```

---

## 🔌 API Reference

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/courses` | Optional | List all courses |
| GET | `/api/courses/:id` | Optional | Course details |
| GET | `/api/courses/:id/lessons` | Optional | Lesson list |
| GET | `/api/user/me` | Required | Current user profile |
| PATCH | `/api/user/me` | Required | Update profile |
| GET | `/api/user/leaderboard` | — | Top users by XP |
| GET | `/api/builds` | Required | User's builds |
| POST | `/api/builds` | Required | Create build |
| GET | `/api/builds/:id` | Required | Build details |
| PATCH | `/api/builds/:id` | Required | Update build |
| DELETE | `/api/builds/:id` | Required | Delete build |
| POST | `/api/builds/:id/components` | Required | Add component |
| GET | `/api/community/posts` | Optional | Community posts |
| POST | `/api/community/posts` | Required | Create post |
| POST | `/api/community/posts/:id/like` | Required | Like/unlike |
| GET | `/api/community/posts/:id/comments` | — | Get comments |
| POST | `/api/community/posts/:id/comments` | Required | Add comment |
| GET | `/api/parts` | — | Search parts |
| GET | `/api/parts/compatible` | — | Parts by build type |
| GET | `/api/progress` | Required | User progress |
| POST | `/api/progress/complete` | Required | Mark lesson done |
| GET | `/api/analytics/summary` | Required | Platform stats |

---

## 🗺️ Firestore Data Model

```
users/{uid}
  displayName, email, photoURL, bio
  xp, level, badges[]
  completedCourses[], activeBuild
  settings{}, joinedAt, lastSeen

builds/{buildId}
  uid, name, droneType, goal, budget
  status, components[], completedSteps[]
  totalCost, notes, createdAt, updatedAt

progress/{uid_courseId}
  uid, courseId
  completedLessons[], xpEarned, lastUpdated

community_posts/{postId}
  uid, authorName, category
  title, content, likes, likedBy[]
  commentCount, createdAt
  └── comments/{commentId}
        uid, authorName, text, createdAt

courses/{courseId}        (seeded / admin-managed)
  └── lessons/{lessonId}

notifications/{notifId}
  uid, type, message, read, createdAt
```

---

## ✨ Features

- 🎮 **Immersive UI** — Three.js particle background, custom cursor, neon cyber aesthetic
- 🔐 **Authentication** — Email/password, Google OAuth, GitHub OAuth
- 🚁 **Drone Explorer** — 12+ drone types with spec cards and filter
- 🧙 **Build Wizard** — Multi-step drone build configurator saved to Firestore
- 📚 **Courses** — 6 structured courses with lesson-by-lesson progress
- ⚡ **XP & Levels** — Gamified learning with ranks from Rookie to Master Pilot
- 🔧 **Component Guide** — Tabbed reference for FC, ESC, motors, batteries, VTX
- ⚖️ **Compare** — Side-by-side drone comparison table with spec bars
- 👥 **Community** — Post builds, ask questions, like and comment
- 📊 **Dashboard** — Personal stats, build history, badge collection
- 🌐 **Responsive** — Mobile-friendly with adaptive layouts

---

## 🛡️ Security

- Firebase ID tokens verified server-side on every protected route
- Firestore security rules enforce ownership at database level
- Rate limiting on all API routes (300 req/15min)
- Helmet.js headers, CORS restriction, input validation (express-validator)
- Environment variables never committed to git

---

## 📄 License

MIT License — free to use, modify, and deploy.
