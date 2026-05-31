import GlassCard from '../components/ui/GlassCard'
import StatCard from '../components/ui/StatCard'
import ProgressCircle from '../components/ui/ProgressCircle'
import { modelKPIs } from '../data/mockMetrics'
import { Target, Layers, Zap, Award } from 'lucide-react'

const indicators = [
  { label: 'Excellent', range: '≥ 90%', color: '#10b981' },
  { label: 'Good', range: '80–89%', color: '#0ea5e9' },
  { label: 'Fair', range: '70–79%', color: '#f59e0b' },
  { label: 'Needs work', range: '< 70%', color: '#ef4444' },
]

export default function ModelPerformance() {
  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard title="Accuracy" value={modelKPIs.accuracy} suffix="%" icon={Target} color="cyan" />
        <StatCard title="Macro F1" value={modelKPIs.macroF1} icon={Layers} color="violet" />
        <StatCard title="Micro F1" value={modelKPIs.microF1} icon={Zap} color="emerald" />
        <StatCard title="mAP" value={modelKPIs.mAP} icon={Award} color="amber" />
        <StatCard title="AUC macro" value={modelKPIs.auc} icon={Target} color="cyan" />
      </div>

      <GlassCard>
        <h3 className="text-lg font-semibold mb-6">Performance Rings</h3>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          <ProgressCircle value={modelKPIs.accuracy} label="Accuracy" color="#0ea5e9" />
          <ProgressCircle value={Math.round(modelKPIs.macroF1 * 100)} label="Macro F1" color="#8b5cf6" />
          <ProgressCircle value={Math.round(modelKPIs.microF1 * 100)} label="Micro F1" color="#10b981" />
          <ProgressCircle value={Math.round(modelKPIs.mAP * 100)} label="mAP" color="#f59e0b" />
          <ProgressCircle value={Math.round(modelKPIs.auc * 100)} label="AUC" color="#06b6d4" />
        </div>
      </GlassCard>

      <div className="grid gap-6 lg:grid-cols-2">
        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Color Indicators</h3>
          <div className="space-y-3">
            {indicators.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl bg-slate-50/80 px-4 py-3 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full" style={{ background: item.color }} />
                  <span className="font-medium">{item.label}</span>
                </div>
                <span className="text-sm text-slate-500">{item.range}</span>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <h3 className="text-lg font-semibold mb-4">Model Architecture</h3>
          <dl className="space-y-3 text-sm">
            {[
              ['Architecture', 'DenseNet121PadChest + meta branch'],
              ['Input size', '224 × 224 × 3 + 5 meta features'],
              ['Output classes', '14 multi-label (PadChest)'],
              ['Activation', 'Sigmoid (BCEWithLogits training)'],
              ['Framework', 'PyTorch / TorchScript'],
              ['Last trained', '2025-03-15'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between border-b border-slate-200/50 pb-2 dark:border-slate-700/50">
                <dt className="text-slate-500">{k}</dt>
                <dd className="font-medium text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </div>
    </div>
  )
}
