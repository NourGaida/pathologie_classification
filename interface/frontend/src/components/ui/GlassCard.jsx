import { motion } from 'framer-motion'
import clsx from 'clsx'

export default function GlassCard({
  children,
  className,
  hover = true,
  delay = 0,
  ...props
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay }}
      whileHover={hover ? { y: -2, transition: { duration: 0.2 } } : undefined}
      className={clsx(
        'glass rounded-2xl p-6 transition-shadow duration-300',
        hover && 'hover:shadow-2xl hover:shadow-cyan-500/5',
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
}
