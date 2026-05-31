import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  LayoutDashboard,
  Scan,
  BarChart3,
  Cpu,
  History,
  Settings,
  Activity,
  X,
} from 'lucide-react'
import clsx from 'clsx'

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/prediction', icon: Scan, label: 'AI Prediction' },
  { to: '/analytics', icon: BarChart3, label: 'Analytics' },
  { to: '/performance', icon: Cpu, label: 'Model Performance' },
  { to: '/history', icon: History, label: 'History' },
  { to: '/settings', icon: Settings, label: 'Settings' },
]

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={clsx(
          'fixed left-0 top-0 z-50 flex h-full w-72 flex-col border-r border-slate-200/50 bg-white/80 backdrop-blur-2xl transition-transform duration-300 dark:border-slate-800/50 dark:bg-slate-950/90 lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex items-center justify-between border-b border-slate-200/50 px-6 py-5 dark:border-slate-800/50">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-violet-600 shadow-lg shadow-cyan-500/25">
              <Activity className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">ChestVision</h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">AI Radiology</p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden">
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-4 scrollbar-thin">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                clsx(
                  'group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-cyan-500/15 to-violet-500/10 text-cyan-700 dark:text-cyan-300 shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100/80 dark:text-slate-400 dark:hover:bg-slate-800/60'
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={clsx(
                      'h-5 w-5 transition-colors',
                      isActive ? 'text-cyan-500' : 'text-slate-400 group-hover:text-cyan-500'
                    )}
                  />
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="nav-indicator"
                      className="ml-auto h-1.5 w-1.5 rounded-full bg-cyan-500"
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-200/50 p-4 dark:border-slate-800/50">
          <div className="glass rounded-xl p-4">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-xs font-medium text-slate-600 dark:text-slate-300">Model Online</span>
            </div>
            <p className="mt-2 text-xs text-slate-500">PadChest · DenseNet121</p>
          </div>
        </div>
      </aside>
    </>
  )
}
