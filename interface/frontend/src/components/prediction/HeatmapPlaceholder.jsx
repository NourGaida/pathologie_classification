import { motion } from 'framer-motion'
import { Layers, Info } from 'lucide-react'
import GlassCard from '../ui/GlassCard'
import { formatPercent } from '../../constants/diseases'
import { pickGradcamSample } from '../../data/gradcamSamples'

export default function HeatmapPlaceholder({
  heatmapUrl,
  loading,
  targetDisease,
  gradcamStatus,
  confidence,
  sampleIndex,
}) {
  const isLive = gradcamStatus === 'gradcam' && heatmapUrl?.startsWith('data:image')
  const isSample = gradcamStatus === 'sample' || (heatmapUrl?.startsWith('/gradcam/'))

  const displaySrc = isLive
    ? heatmapUrl
    : isSample && heatmapUrl
      ? heatmapUrl
      : pickGradcamSample(targetDisease, sampleIndex)

  const badge = isLive
    ? 'Généré sur votre image'
    : isSample
      ? 'Exemple illustratif'
      : 'Exemple'

  return (
    <GlassCard>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Layers className="h-5 w-5 text-violet-500" />
          <h3 className="text-lg font-semibold">Grad-CAM — DenseNet121</h3>
        </div>
        <span className="rounded-full bg-violet-500/15 px-3 py-1 text-xs font-medium text-violet-600 dark:text-violet-300">
          {badge}
        </span>
      </div>

      {loading ? (
        <div className="flex min-h-[320px] items-center justify-center rounded-xl border border-slate-200/50 dark:border-slate-700/50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
            className="h-10 w-10 rounded-full border-2 border-violet-500 border-t-transparent"
          />
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border border-slate-200/50 bg-white dark:border-slate-700/50 dark:bg-slate-900">
          <img
            src={displaySrc}
            alt={`Grad-CAM ${targetDisease || ''}`}
            className="mx-auto max-h-[480px] w-full object-contain"
          />
          <div className="border-t border-slate-200/50 px-4 py-3 text-center dark:border-slate-700/50">
            {targetDisease && (
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-100">
                Classe ciblée : {targetDisease}
                {confidence != null && (
                  <span className="ml-2 font-mono text-cyan-600 dark:text-cyan-400">
                    {formatPercent(confidence)}
                  </span>
                )}
              </p>
            )}
            {!isLive && (
              <p className="mt-1 text-xs text-slate-500">
                {isSample
                  ? 'Image de démonstration (une des 5 références PadChest).'
                  : 'Grad-CAM calculé localement si le backend est actif.'}
              </p>
            )}
          </div>
        </div>
      )}

      <div className="mt-4 flex items-start gap-2 rounded-lg bg-violet-500/5 p-3 text-sm text-slate-600 dark:text-slate-400">
        <Info className="h-4 w-4 shrink-0 text-violet-500 mt-0.5" />
        <p>
          Zones rouges/jaunes = régions les plus influentes pour la prédiction.
          Pas de matrice de confusion ici.
        </p>
      </div>
    </GlassCard>
  )
}
