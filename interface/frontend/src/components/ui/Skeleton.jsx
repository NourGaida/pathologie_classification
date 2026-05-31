import clsx from 'clsx'

export default function Skeleton({ className }) {
  return (
    <div
      className={clsx(
        'animate-pulse rounded-lg bg-slate-200/80 dark:bg-slate-700/60',
        className
      )}
    />
  )
}
