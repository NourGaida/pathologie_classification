import GlassCard from '../components/ui/GlassCard'
import { densenetNotebookFigures } from '../data/mockMetrics'
import { Database, Layers, SlidersHorizontal, Tags } from 'lucide-react'

function NotebookFigure({ src, title, caption, delay = 0 }) {
  return (
    <GlassCard delay={delay} className="overflow-hidden">
      <h3 className="mb-1 text-lg font-semibold">{title}</h3>
      <p className="mb-3 text-xs text-slate-500">{caption}</p>
      <img
        src={src}
        alt={title}
        className="w-full rounded-xl border border-slate-200/50 dark:border-slate-700/50"
        loading="lazy"
      />
    </GlassCard>
  )
}

export default function Analytics() {
  return (
    <div className="space-y-8">
      <GlassCard className="relative overflow-hidden">
        <div className="absolute -right-16 -top-16 h-48 w-48 rounded-full bg-cyan-500/10 blur-3xl" />
        <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
          densenet121-seuiltbadel.ipynb
        </p>
        <h2 className="mt-1 text-2xl font-bold">Résultats DenseNet121 — PadChest224</h2>
        <p className="mt-2 max-w-2xl text-sm text-slate-600 dark:text-slate-300">
          Visualisations extraites du pipeline d&apos;entraînement : exploration des données,
          courbes d&apos;apprentissage, performance par pathologie et matrices de confusion
          avec seuils optimisés par classe.
        </p>
        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { icon: Database, label: 'Dataset', value: 'PadChest224' },
            { icon: Layers, label: 'Architecture', value: 'DenseNet121 + meta' },
            { icon: Tags, label: 'Tâche', value: '14 pathologies' },
            { icon: SlidersHorizontal, label: 'Décision', value: 'Seuils optimaux' },
          ].map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-xl border border-slate-200/60 bg-slate-50/80 px-4 py-3 dark:border-slate-700/60 dark:bg-slate-800/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15">
                <Icon className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
              </div>
              <div>
                <p className="text-xs text-slate-500">{label}</p>
                <p className="text-sm font-semibold">{value}</p>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        {densenetNotebookFigures.map((fig, i) => (
          <NotebookFigure key={fig.src} {...fig} delay={i * 0.03} />
        ))}
      </div>
    </div>
  )
}
