import { createContext, useContext, useEffect, useState } from 'react'

const defaultSettings = {
  confidenceThreshold: 0.35,
  apiUrl: 'http://localhost:8000',
  showGradcam: true,
  autoSaveHistory: true,
}

const SettingsContext = createContext(null)

export function SettingsProvider({ children }) {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('chestvision_settings')
      return stored ? { ...defaultSettings, ...JSON.parse(stored) } : defaultSettings
    } catch {
      return defaultSettings
    }
  })

  useEffect(() => {
    localStorage.setItem('chestvision_settings', JSON.stringify(settings))
    localStorage.setItem('chestvision_api_url', settings.apiUrl)
  }, [settings])

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <SettingsContext.Provider value={{ settings, setSettings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  )
}

export const useSettings = () => {
  const ctx = useContext(SettingsContext)
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider')
  return ctx
}
