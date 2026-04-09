import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ToastHost } from './components/ToastHost.jsx'
import { ThemeProvider } from './context/ThemeContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { MealProvider } from './context/MealContext.jsx'
import { SettingsProvider } from './context/SettingsContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <MealProvider>
          <SettingsProvider>
            <App />
            <ToastHost />
          </SettingsProvider>
        </MealProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
)
