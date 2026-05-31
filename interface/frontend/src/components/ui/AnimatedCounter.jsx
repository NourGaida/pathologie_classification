import { useEffect, useState } from 'react'

export default function AnimatedCounter({ value, decimals = 0, duration = 1200 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = display
    const startTime = performance.now()
    const tick = (now) => {
      const progress = Math.min(1, (now - startTime) / duration)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + (value - start) * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [value])

  return <span>{display.toFixed(decimals)}</span>
}
