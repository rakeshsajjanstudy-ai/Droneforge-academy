// backend/src/config/firebase.js
import admin from 'firebase-admin'
import { readFileSync, existsSync } from 'fs'
import { resolve } from 'path'

let initialized = false

export function initFirebase() {
  if (initialized) return admin

  // Option 1: Service account JSON file (local dev)
  const serviceAccountPath = resolve(process.cwd(), 'config/serviceAccount.json')

  // Option 2: Environment variable (Vercel/production)
  const serviceAccountEnv = process.env.FIREBASE_SERVICE_ACCOUNT

  try {
    let credential

    if (serviceAccountEnv) {
      // Vercel: store the entire JSON as a single env var
      const serviceAccount = JSON.parse(serviceAccountEnv)
      credential = admin.credential.cert(serviceAccount)
      console.log('Firebase Admin: Using environment variable credentials')
    } else if (existsSync(serviceAccountPath)) {
      const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'))
      credential = admin.credential.cert(serviceAccount)
      console.log('Firebase Admin: Using service account file')
    } else {
      // Fallback: use application default credentials
      credential = admin.credential.applicationDefault()
      console.log('Firebase Admin: Using application default credentials')
    }

    admin.initializeApp({
      credential,
      databaseURL: process.env.FIREBASE_DATABASE_URL,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    })

    initialized = true
    console.log('Firebase Admin SDK initialized ✓')
  } catch (err) {
    console.error('Firebase Admin initialization failed:', err.message)
    process.exit(1)
  }

  return admin
}

export const getFirestore = () => admin.firestore()
export const getAuth = () => admin.auth()
export const getStorage = () => admin.storage()

export default admin
