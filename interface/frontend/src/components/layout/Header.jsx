import { Menu, Moon, Sun, Bell, Search } from 'lucide-react'
import { useTheme } from '../../context/ThemeContext'
import { motion } from 'framer-motion'

export default function Header({ title, subtitle, onMenuClick }) {
  const { isDark, toggleTheme } = useTheme()

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-slate-200/50 bg-white/60 px-4 py-4 backdrop-blur-xl dark:border-slate-800/50 dark:bg-slate-950/60 lg:px-8">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="rounded-xl p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div>
          <motion.h2
            key={title}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-xl font-bold tracking-tight text-slate-900 dark:text-white lg:text-2xl"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <div className="hidden items-center gap-2 rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 dark:border-slate-700/60 dark:bg-slate-900/50 md:flex">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            type="search"
            placeholder="Search scans..."
            className="w-40 bg-transparent text-sm outline-none placeholder:text-slate-400 lg:w-56"
          />
        </div>
        <button className="relative rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="h-5 w-5 text-slate-500" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500" />
        </button>
        <button
          onClick={toggleTheme}
          className="rounded-xl p-2.5 hover:bg-slate-100 dark:hover:bg-slate-800"
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5 text-slate-600" />}
        </button>
        <div className="hidden h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-cyan-500 to-violet-600 text-sm font-bold text-white sm:flex">
          DR
        </div>
      </div>
    </header>
  )
}
