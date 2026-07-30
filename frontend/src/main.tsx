// frontend/src/main.tsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { SystemProvider } from './contexts/SystemContext'
import { AuthProvider } from './contexts/AuthContext'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <SystemProvider>
        <App />
      </SystemProvider>
    </AuthProvider>
  </React.StrictMode>,
)