import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Sidebar from './Sidebar'
import Header from './Header'
import AIAssistant from '../ui/AIAssistant'

const pageMeta = {
  '/': { title: 'Dashboard', subtitle: 'Overview of your AI radiology platform' },
  '/prediction': { title: 'AI Prediction', subtitle: 'Upload chest X-rays for multi-label diagnosis' },
  '/analytics': { title: 'Analytics', subtitle: 'Training metrics and model evaluation charts' },
  '/performance': { title: 'Model Performance', subtitle: 'Key performance indicators and benchmarks' },
  '/history': { title: 'History', subtitle: 'Previous predictions and scan records' },
  '/settings': { title: 'Settings', subtitle: 'Configure API, thresholds, and preferences' },
}

export default function MainLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] || { title: 'ChestVision AI', subtitle: '' }

  return (
    <div className="min-h-screen gradient-mesh">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className="lg:pl-72">
        <Header
          title={meta.title}
          subtitle={meta.subtitle}
          onMenuClick={() => setSidebarOpen(true)}
        />
        <main className="p-4 pb-24 lg:p-8">
          <Outlet />
        </main>
      </div>
      <AIAssistant />
    </div>
  )
}
