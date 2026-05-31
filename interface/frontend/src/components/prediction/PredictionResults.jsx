import { motion } from 'framer-motion'
import GlassCard from '../ui/GlassCard'
import ProgressBar from '../ui/ProgressBar'
import ConfidenceGauge from '../ui/ConfidenceGauge'
import { DISEASE_COLORS, formatPercent, PROB_DISPLAY_CAP } from '../../constants/diseases'
import { sortPredictions } from '../../utils/predictions'
import { AlertTriangle, CheckCircle2 } from 'lucide-react'

export default function PredictionResults({ predictions, imagePreview, summary, threshold }) {
  const sorted = sortPredictions(predictions)
  const top = sorted[0]
  const flagged = sorted.filter((p) => p.score >= threshold && p.name !== 'normal')

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <GlassCard delay={0.1}>
        <h3 className="mb-4 text-lg font-semibold">X-Ray Analysis</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <img src={imagePreview} alt="Analyzed X-ray" className="w-full object-contain bg-slate-950/5 dark:bg-slate-900" />
        </div>
      </GlassCard>

      <div className="space-y-6">
        <GlassCard delay={0.15} className="flex items-center gap-6">
          <ConfidenceGauge value={Math.min(top?.score || 0, PROB_DISPLAY_CAP)} label="Top confidence" />
          <div className="flex-1">
            <p className="text-sm text-slate-500">Primary finding</p>
            <p className="text-2xl font-bold">{top?.displayName || '—'}</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              {flagged.length} finding{flagged.length !== 1 ? 's' : ''} above {Math.round(threshold * 100)}% threshold
            </p>
          </div>
        </GlassCard>

        <GlassCard delay={0.2}>
          <h3 className="mb-4 text-lg font-semibold">Disease Probabilities</h3>
          <div className="max-h-80 space-y-3 overflow-y-auto pr-2 scrollbar-thin">
            {sorted.map((item, i) => (
              <ProgressBar
                key={item.name}
                label={item.displayName}
                value={item.score}
                color={DISEASE_COLORS[i % DISEASE_COLORS.length]}
                delay={0.05 * i}
              />
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard delay={0.25} className="lg:col-span-2">
        <div className="flex items-start gap-3">
          {top?.name === 'normal' && top.score > 0.6 ? (
            <CheckCircle2 className="h-6 w-6 shrink-0 text-emerald-500" />
          ) : (
            <AlertTriangle className="h-6 w-6 shrink-0 text-amber-500" />
          )}
          <div>
            <h3 className="text-lg font-semibold">Clinical Summary</h3>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-2 text-slate-600 dark:text-slate-300 leading-relaxed"
            >
              {summary}
            </motion.p>
            <p className="mt-3 text-xs text-slate-400">
              AI-assisted analysis only — not a substitute for professional medical diagnosis.
            </p>
          </div>
        </div>
      </GlassCard>

      <GlassCard delay={0.3} className="lg:col-span-2">
        <h3 className="mb-2 text-lg font-semibold">Top Predicted Conditions</h3>
        <div className="flex flex-wrap gap-2">
          {sorted.slice(0, 5).map((item, i) => (
            <motion.span
              key={item.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i }}
              className="rounded-full px-4 py-2 text-sm font-medium"
              style={{
                background: `${DISEASE_COLORS[i]}22`,
                color: DISEASE_COLORS[i],
                border: `1px solid ${DISEASE_COLORS[i]}44`,
              }}
            >
              {item.displayName} · {formatPercent(item.score)}
            </motion.span>
          ))}
        </div>
      </GlassCard>
    </div>
  )
}
