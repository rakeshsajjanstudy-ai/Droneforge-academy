// src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import App from './App'
import { AuthProvider } from './lib/AuthContext'
import './styles/index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <App />
        <Toaster
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'rgba(2,4,8,0.95)',
              color: '#e8f4f8',
              border: '1px solid rgba(0,245,255,0.2)',
              fontFamily: 'Rajdhani, sans-serif',
              fontSize: '0.95rem',
              backdropFilter: 'blur(16px)',
            },
            success: { iconTheme: { primary: '#00f5ff', secondary: '#000' } },
            error: { iconTheme: { primary: '#ff6b00', secondary: '#000' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
