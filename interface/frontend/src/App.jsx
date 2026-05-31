import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './components/layout/MainLayout'
import Dashboard from './pages/Dashboard'
import Prediction from './pages/Prediction'
import Analytics from './pages/Analytics'
import ModelPerformance from './pages/ModelPerformance'
import History from './pages/History'
import Settings from './pages/Settings'
import { ThemeProvider } from './context/ThemeContext'
import { SettingsProvider } from './context/SettingsContext'
import { HistoryProvider } from './context/HistoryContext'
import { ToastProvider } from './context/ToastContext'

export default function App() {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <HistoryProvider>
          <ToastProvider>
            <BrowserRouter>
              <Routes>
                <Route element={<MainLayout />}>
                  <Route path="/" element={<Dashboard />} />
                  <Route path="/prediction" element={<Prediction />} />
                  <Route path="/analytics" element={<Analytics />} />
                  <Route path="/performance" element={<ModelPerformance />} />
                  <Route path="/history" element={<History />} />
                  <Route path="/settings" element={<Settings />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </ToastProvider>
        </HistoryProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
