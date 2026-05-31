import { motion } from 'framer-motion'
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react'
import clsx from 'clsx'

const icons = {
  success: CheckCircle,
  error: AlertCircle,
  info: Info,
}

const styles = {
  success: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
  error: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-300',
  info: 'border-cyan-500/30 bg-cyan-500/10 text-cyan-700 dark:text-cyan-300',
}

export default function Toast({ message, type = 'info', onClose }) {
  const Icon = icons[type] || Info

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40, scale: 0.95 }}
      className={clsx(
        'glass-strong flex items-center gap-3 rounded-xl border px-4 py-3 shadow-lg min-w-[280px]',
        styles[type]
      )}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <p className="flex-1 text-sm font-medium">{message}</p>
      <button onClick={onClose} className="rounded-lg p-1 hover:bg-black/5 dark:hover:bg-white/10">
        <X className="h-4 w-4" />
      </button>
    </motion.div>
  )
}
