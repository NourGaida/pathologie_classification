import { motion } from 'framer-motion'
import clsx from 'clsx'
import { PROB_DISPLAY_CAP } from '../../constants/diseases'

export default function ProgressBar({
  label,
  value,
  color = '#0ea5e9',
  delay = 0,
  showPercent = true,
}) {
  const capped = Math.min(value, PROB_DISPLAY_CAP)
  const percent = Math.min(99.9, Math.max(0, capped * 100))

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 dark:text-slate-200">{label}</span>
        {showPercent && (
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {percent >= 99.95 ? '99.9' : percent.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-700/80">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percent}%` }}
          transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
          className={clsx('h-full rounded-full')}
          style={{
            background: `linear-gradient(90deg, ${color}99, ${color})`,
            boxShadow: `0 0 12px ${color}44`,
          }}
        />
      </div>
    </div>
  )
}
