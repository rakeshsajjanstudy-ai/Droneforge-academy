// src/lib/firestore.js
// Centralized Firestore service layer
// All database reads/writes go through here

import {
  doc, collection, addDoc, setDoc, getDoc, getDocs,
  updateDoc, deleteDoc, query, where, orderBy, limit,
  onSnapshot, serverTimestamp, increment, arrayUnion, arrayRemove,
  writeBatch, runTransaction
} from 'firebase/firestore'
import { db } from './firebase'

// ─────────────────────────────────────────────
// COLLECTIONS
// ─────────────────────────────────────────────
export const COLLECTIONS = {
  USERS: 'users',
  COURSES: 'courses',
  LESSONS: 'lessons',
  PROGRESS: 'progress',
  BUILDS: 'builds',
  COMMUNITY_POSTS: 'community_posts',
  COMMENTS: 'comments',
  NOTIFICATIONS: 'notifications',
  LEADERBOARD: 'leaderboard',
}

// ─────────────────────────────────────────────
// USER SERVICES
// ─────────────────────────────────────────────
export const userService = {
  async createProfile(uid, data) {
    const userRef = doc(db, COLLECTIONS.USERS, uid)
    await setDoc(userRef, {
      uid,
      displayName: data.displayName || 'Pilot',
      email: data.email,
      photoURL: data.photoURL || null,
      bio: '',
      level: 'beginner',
      xp: 0,
      badges: [],
      completedCourses: [],
      activeBuild: null,
      joinedAt: serverTimestamp(),
      lastSeen: serverTimestamp(),
      settings: {
        emailNotifications: true,
        publicProfile: true,
        theme: 'dark',
      },
    }, { merge: true })
  },

  async getProfile(uid) {
    const snap = await getDoc(doc(db, COLLECTIONS.USERS, uid))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  },

  async updateProfile(uid, updates) {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  },

  async updateLastSeen(uid) {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      lastSeen: serverTimestamp(),
    })
  },

  async addXP(uid, amount) {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      xp: increment(amount),
    })
  },

  async addBadge(uid, badge) {
    await updateDoc(doc(db, COLLECTIONS.USERS, uid), {
      badges: arrayUnion(badge),
    })
  },

  subscribeToProfile(uid, callback) {
    return onSnapshot(doc(db, COLLECTIONS.USERS, uid), (snap) => {
      callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
  },
}

// ─────────────────────────────────────────────
// COURSE SERVICES
// ─────────────────────────────────────────────
export const courseService = {
  async getAll() {
    const snap = await getDocs(
      query(collection(db, COLLECTIONS.COURSES), orderBy('order', 'asc'))
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getById(courseId) {
    const snap = await getDoc(doc(db, COLLECTIONS.COURSES, courseId))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  },

  async getLessons(courseId) {
    const snap = await getDocs(
      query(
        collection(db, COLLECTIONS.COURSES, courseId, COLLECTIONS.LESSONS),
        orderBy('order', 'asc')
      )
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },
}

// ─────────────────────────────────────────────
// PROGRESS SERVICES
// ─────────────────────────────────────────────
export const progressService = {
  async getUserProgress(uid) {
    const snap = await getDocs(
      query(collection(db, COLLECTIONS.PROGRESS), where('uid', '==', uid))
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async markLessonComplete(uid, courseId, lessonId) {
    const progressRef = doc(db, COLLECTIONS.PROGRESS, `${uid}_${courseId}`)
    await setDoc(progressRef, {
      uid,
      courseId,
      completedLessons: arrayUnion(lessonId),
      lastUpdated: serverTimestamp(),
    }, { merge: true })
  },

  async getCourseProgress(uid, courseId) {
    const snap = await getDoc(doc(db, COLLECTIONS.PROGRESS, `${uid}_${courseId}`))
    return snap.exists() ? snap.data() : { completedLessons: [] }
  },

  subscribeToProgress(uid, courseId, callback) {
    return onSnapshot(
      doc(db, COLLECTIONS.PROGRESS, `${uid}_${courseId}`),
      (snap) => callback(snap.exists() ? snap.data() : { completedLessons: [] })
    )
  },
}

// ─────────────────────────────────────────────
// BUILD TRACKER SERVICES
// ─────────────────────────────────────────────
export const buildService = {
  async createBuild(uid, buildData) {
    const ref = await addDoc(collection(db, COLLECTIONS.BUILDS), {
      uid,
      ...buildData,
      status: 'planning',
      components: [],
      totalCost: 0,
      completedSteps: [],
      notes: '',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    })
    return ref.id
  },

  async getUserBuilds(uid) {
    const snap = await getDocs(
      query(
        collection(db, COLLECTIONS.BUILDS),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      )
    )
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async getBuild(buildId) {
    const snap = await getDoc(doc(db, COLLECTIONS.BUILDS, buildId))
    return snap.exists() ? { id: snap.id, ...snap.data() } : null
  },

  async updateBuild(buildId, updates) {
    await updateDoc(doc(db, COLLECTIONS.BUILDS, buildId), {
      ...updates,
      updatedAt: serverTimestamp(),
    })
  },

  async addComponent(buildId, component) {
    await updateDoc(doc(db, COLLECTIONS.BUILDS, buildId), {
      components: arrayUnion(component),
      updatedAt: serverTimestamp(),
    })
  },

  async completeStep(buildId, stepId) {
    await updateDoc(doc(db, COLLECTIONS.BUILDS, buildId), {
      completedSteps: arrayUnion(stepId),
      updatedAt: serverTimestamp(),
    })
  },

  async deleteBuild(buildId) {
    await deleteDoc(doc(db, COLLECTIONS.BUILDS, buildId))
  },

  subscribeToBuilds(uid, callback) {
    return onSnapshot(
      query(
        collection(db, COLLECTIONS.BUILDS),
        where('uid', '==', uid),
        orderBy('createdAt', 'desc')
      ),
      (snap) => callback(snap.docs.map(d => ({ id: d.id, ...d.data() })))
    )
  },
}

// ─────────────────────────────────────────────
// COMMUNITY SERVICES
// ─────────────────────────────────────────────
export const communityService = {
  async createPost(uid, postData) {
    const ref = await addDoc(collection(db, COLLECTIONS.COMMUNITY_POSTS), {
      uid,
      ...postData,
      likes: 0,
      likedBy: [],
      commentCount: 0,
      createdAt: serverTimestamp(),
    })
    return ref.id
  },

  async getPosts(category = null, limitCount = 20) {
    let q = query(
      collection(db, COLLECTIONS.COMMUNITY_POSTS),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    )
    if (category) {
      q = query(
        collection(db, COLLECTIONS.COMMUNITY_POSTS),
        where('category', '==', category),
        orderBy('createdAt', 'desc'),
        limit(limitCount)
      )
    }
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  },

  async likePost(postId, uid) {
    await updateDoc(doc(db, COLLECTIONS.COMMUNITY_POSTS, postId), {
      likes: increment(1),
      likedBy: arrayUnion(uid),
    })
  },

  async unlikePost(postId, uid) {
    await updateDoc(doc(db, COLLECTIONS.COMMUNITY_POSTS, postId), {
      likes: increment(-1),
      likedBy: arrayRemove(uid),
    })
  },

  async addComment(postId, uid, text) {
    const batch = writeBatch(db)
    const commentRef = doc(collection(db, COLLECTIONS.COMMUNITY_POSTS, postId, COLLECTIONS.COMMENTS))
    batch.set(commentRef, { uid, text, createdAt: serverTimestamp() })
    batch.update(doc(db, COLLECTIONS.COMMUNITY_POSTS, postId), { commentCount: increment(1) })
    await batch.commit()
  },

  subscribeToPost(postId, callback) {
    return onSnapshot(doc(db, COLLECTIONS.COMMUNITY_POSTS, postId), (snap) => {
      callback(snap.exists() ? { id: snap.id, ...snap.data() } : null)
    })
  },
}

// ─────────────────────────────────────────────
// LEADERBOARD SERVICES
// ─────────────────────────────────────────────
export const leaderboardService = {
  async getTop(limitCount = 10) {
    const snap = await getDocs(
      query(
        collection(db, COLLECTIONS.USERS),
        orderBy('xp', 'desc'),
        limit(limitCount)
      )
    )
    return snap.docs.map((d, i) => ({ id: d.id, rank: i + 1, ...d.data() }))
  },
}
