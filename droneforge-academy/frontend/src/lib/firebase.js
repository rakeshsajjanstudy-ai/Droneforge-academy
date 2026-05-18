// src/lib/firebase.js
// Firebase client SDK configuration
// Replace these values with your actual Firebase project config from:
// Firebase Console > Project Settings > Your Apps > Web App > SDK setup

import { initializeApp } from 'firebase/app'
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from 'firebase/auth'
import { getFirestore, enableIndexedDbPersistence } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getAnalytics, isSupported } from 'firebase/analytics'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Auth
export const auth = getAuth(app)
export const googleProvider = new GoogleAuthProvider()
export const githubProvider = new GithubAuthProvider()

googleProvider.setCustomParameters({ prompt: 'select_account' })

// Firestore
export const db = getFirestore(app)

// Enable offline persistence (optional but great for UX)
if (typeof window !== 'undefined') {
  enableIndexedDbPersistence(db).catch((err) => {
    if (err.code === 'failed-precondition') {
      console.warn('Firestore persistence: multiple tabs open')
    } else if (err.code === 'unimplemented') {
      console.warn('Firestore persistence: browser not supported')
    }
  })
}

// Storage
export const storage = getStorage(app)

// Analytics (client-side only)
export const getAnalyticsInstance = async () => {
  const supported = await isSupported()
  if (supported) return getAnalytics(app)
  return null
}

export default app
