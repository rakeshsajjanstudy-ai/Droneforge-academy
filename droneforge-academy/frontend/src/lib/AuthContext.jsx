// src/lib/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from 'react'
import {
  signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword,
  signOut, onAuthStateChanged, updateProfile, sendPasswordResetEmail,
  sendEmailVerification, GoogleAuthProvider, GithubAuthProvider
} from 'firebase/auth'
import { auth, googleProvider, githubProvider } from './firebase'
import { userService } from './firestore'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser)
      if (firebaseUser) {
        // Load or create Firestore profile
        let p = await userService.getProfile(firebaseUser.uid)
        if (!p) {
          await userService.createProfile(firebaseUser.uid, {
            displayName: firebaseUser.displayName,
            email: firebaseUser.email,
            photoURL: firebaseUser.photoURL,
          })
          p = await userService.getProfile(firebaseUser.uid)
        }
        setProfile(p)
        await userService.updateLastSeen(firebaseUser.uid)
      } else {
        setProfile(null)
      }
      setLoading(false)
    })
    return unsub
  }, [])

  const signInGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider)
      toast.success(`Welcome, ${result.user.displayName}!`)
      return result.user
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const signInGithub = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider)
      toast.success(`Welcome, ${result.user.displayName}!`)
      return result.user
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const signInEmail = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Logged in successfully!')
      return result.user
    } catch (err) {
      const messages = {
        'auth/user-not-found': 'No account found with this email.',
        'auth/wrong-password': 'Incorrect password.',
        'auth/too-many-requests': 'Too many attempts. Please try again later.',
      }
      toast.error(messages[err.code] || err.message)
      throw err
    }
  }

  const signUpEmail = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName })
      await sendEmailVerification(result.user)
      await userService.createProfile(result.user.uid, { displayName, email, photoURL: null })
      toast.success('Account created! Check your email to verify.')
      return result.user
    } catch (err) {
      const messages = {
        'auth/email-already-in-use': 'This email is already registered.',
        'auth/weak-password': 'Password must be at least 6 characters.',
        'auth/invalid-email': 'Invalid email address.',
      }
      toast.error(messages[err.code] || err.message)
      throw err
    }
  }

  const logout = async () => {
    await signOut(auth)
    toast.success('Logged out.')
  }

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email)
      toast.success('Password reset email sent!')
    } catch (err) {
      toast.error(err.message)
      throw err
    }
  }

  const refreshProfile = async () => {
    if (user) {
      const p = await userService.getProfile(user.uid)
      setProfile(p)
    }
  }

  return (
    <AuthContext.Provider value={{
      user, profile, loading,
      signInGoogle, signInGithub, signInEmail,
      signUpEmail, logout, resetPassword, refreshProfile,
    }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
