import { motion } from 'framer-motion'
import { PROB_DISPLAY_CAP } from '../../constants/diseases'

export default function ConfidenceGauge({ value, size = 140, label = 'Confidence' }) {
  const radius = (size - 16) / 2
  const circumference = 2 * Math.PI * radius
  const percent = Math.min(PROB_DISPLAY_CAP, Math.max(0, value))
  const offset = circumference - percent * circumference

  const getColor = () => {
    if (percent >= 0.75) return '#10b981'
    if (percent >= 0.5) return '#0ea5e9'
    if (percent >= 0.35) return '#f59e0b'
    return '#94a3b8'
  }

  return (
    <div className="relative flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-slate-200 dark:text-slate-700"
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={getColor()}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          style={{ filter: `drop-shadow(0 0 8px ${getColor()}66)` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900 dark:text-white">
          {(percent * 100).toFixed(0)}%
        </span>
        <span className="text-xs text-slate-500 dark:text-slate-400">{label}</span>
      </div>
    </div>
  )
}
