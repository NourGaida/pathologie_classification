import { motion } from 'framer-motion'
import clsx from 'clsx'
import AnimatedCounter from './AnimatedCounter'

export default function StatCard({
  title,
  value,
  suffix = '',
  prefix = '',
  change,
  icon: Icon,
  color = 'cyan',
  delay = 0,
  numeric = true,
}) {
  const colors = {
    cyan: 'from-cyan-500/20 to-sky-500/10 text-cyan-600 dark:text-cyan-400',
    violet: 'from-violet-500/20 to-purple-500/10 text-violet-600 dark:text-violet-400',
    emerald: 'from-emerald-500/20 to-green-500/10 text-emerald-600 dark:text-emerald-400',
    amber: 'from-amber-500/20 to-orange-500/10 text-amber-600 dark:text-amber-400',
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.4 }}
      className="glass rounded-2xl p-5 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            {prefix}
            {numeric ? (
              <AnimatedCounter value={typeof value === 'number' ? value : parseFloat(value) || 0} decimals={value < 1 ? 2 : 1} />
            ) : (
              value
            )}
            {suffix}
          </p>
          {change !== undefined && (
            <p className={clsx('mt-1 text-xs font-medium', change >= 0 ? 'text-emerald-500' : 'text-red-500')}>
              {change >= 0 ? '+' : ''}{change}% vs last epoch
            </p>
          )}
        </div>
        {Icon && (
          <div className={clsx('rounded-xl bg-gradient-to-br p-3', colors[color])}>
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
    </motion.div>
  )
}
