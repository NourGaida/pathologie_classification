import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Scan, TrendingUp, Clock, ArrowRight, Activity,
} from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import StatCard from '../components/ui/StatCard'
import { useHistory } from '../context/HistoryContext'
import { modelKPIs } from '../data/mockMetrics'

export default function Dashboard() {
  const { history } = useHistory()
  const recent = history.slice(0, 4)

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-8 overflow-hidden relative"
      >
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute -bottom-10 left-1/3 h-48 w-48 rounded-full bg-violet-500/15 blur-3xl" />
        <div className="relative">
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">Welcome back</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight lg:text-4xl">
            <span className="text-gradient">AI-Powered</span> Chest X-Ray Diagnosis
          </h2>
          <p className="mt-3 max-w-2xl text-slate-600 dark:text-slate-300">
            Upload radiographs for multi-label pathology detection across 14 conditions with
            real-time confidence scoring and explainability overlays.
          </p>
          <Link
            to="/prediction"
            className="mt-6 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-cyan-500/25 transition hover:opacity-90"
          >
            <Scan className="h-4 w-4" />
            New Analysis
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </motion.div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Model Accuracy" value={modelKPIs.accuracy} suffix="%" icon={TrendingUp} color="cyan" delay={0.05} />
        <StatCard title="Macro F1" value={modelKPIs.macroF1} icon={Activity} color="violet" delay={0.1} />
        <StatCard title="Scans Today" value={history.length || 12} numeric={false} icon={Scan} color="emerald" delay={0.15} />
        <StatCard title="Avg. Inference" value={1.2} suffix="s" icon={Clock} color="amber" delay={0.2} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <GlassCard className="lg:col-span-2" delay={0.1}>
          <h3 className="text-lg font-semibold mb-4">Live System Status</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { label: 'API Server', status: 'Operational', color: 'emerald' },
              { label: 'TensorFlow Model', status: 'Loaded', color: 'emerald' },
              { label: 'GradCAM Engine', status: 'Ready', color: 'cyan' },
            ].map((item) => (
              <div key={item.label} className="rounded-xl bg-slate-50/80 p-4 dark:bg-slate-800/50">
                <p className="text-sm text-slate-500">{item.label}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className={`h-2 w-2 rounded-full bg-${item.color}-500`} style={{ background: '#10b981' }} />
                  <span className="font-medium">{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard delay={0.15}>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { to: '/prediction', label: 'Upload X-Ray', icon: Scan },
              { to: '/analytics', label: 'View Analytics', icon: TrendingUp },
              { to: '/history', label: 'Scan History', icon: Clock },
            ].map((action) => (
              <Link
                key={action.to}
                to={action.to}
                className="flex items-center justify-between rounded-xl px-4 py-3 hover:bg-slate-100/80 dark:hover:bg-slate-800/60 transition"
              >
                <span className="flex items-center gap-3 text-sm font-medium">
                  <action.icon className="h-4 w-4 text-cyan-500" />
                  {action.label}
                </span>
                <ArrowRight className="h-4 w-4 text-slate-400" />
              </Link>
            ))}
          </div>
        </GlassCard>
      </div>

      <GlassCard delay={0.2}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Scans</h3>
          <Link to="/history" className="text-sm text-cyan-600 hover:underline dark:text-cyan-400">View all</Link>
        </div>
        {recent.length === 0 ? (
          <p className="text-sm text-slate-500 py-8 text-center">No scans yet. Run your first prediction!</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {recent.map((scan) => (
              <div key={scan.id} className="rounded-xl border border-slate-200/50 overflow-hidden dark:border-slate-700/50">
                <img src={scan.imagePreview} alt="" className="aspect-video w-full object-cover bg-slate-900" />
                <div className="p-3">
                  <p className="text-sm font-medium truncate">{scan.topDisease}</p>
                  <p className="text-xs text-slate-500">{new Date(scan.date).toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </GlassCard>
    </div>
  )
}
