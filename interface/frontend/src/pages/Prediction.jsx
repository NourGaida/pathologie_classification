import { useState } from 'react'
import { motion } from 'framer-motion'
import { Sparkles, Loader2, RotateCcw } from 'lucide-react'
import UploadZone from '../components/prediction/UploadZone'
import PredictionResults from '../components/prediction/PredictionResults'
import HeatmapPlaceholder from '../components/prediction/HeatmapPlaceholder'
import GlassCard from '../components/ui/GlassCard'
import { predictImage, fetchGradcam } from '../api/client'
import { useSettings } from '../context/SettingsContext'
import { useHistory } from '../context/HistoryContext'
import { useToast } from '../context/ToastContext'
import { generateSummary } from '../utils/predictions'

export default function Prediction() {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [heatmapUrl, setHeatmapUrl] = useState(null)
  const [gradcamLoading, setGradcamLoading] = useState(false)
  const [gradcamStatus, setGradcamStatus] = useState(null)
  const [gradcamTarget, setGradcamTarget] = useState(null)
  const [gradcamConf, setGradcamConf] = useState(null)
  const [gradcamSampleIdx, setGradcamSampleIdx] = useState(null)
  const [meta, setMeta] = useState({ age: '', sex: 'M', projection: 'PA' })
  const { settings } = useSettings()
  const { addPrediction } = useHistory()
  const { addToast } = useToast()

  const handleFile = (f) => {
    setFile(f)
    setResults(null)
    setHeatmapUrl(null)
    setGradcamStatus(null)
    setGradcamTarget(null)
    setGradcamConf(null)
    setGradcamSampleIdx(null)
    const reader = new FileReader()
    reader.onload = (e) => setPreview(e.target.result)
    reader.readAsDataURL(f)
  }

  const analyze = async () => {
    if (!file) return
    setLoading(true)
    setResults(null)
    setHeatmapUrl(null)
    setGradcamStatus(null)
    setGradcamTarget(null)
    setGradcamConf(null)
    setGradcamSampleIdx(null)
    try {
      const data = await predictImage(file, {
        age: meta.age ? Number(meta.age) : undefined,
        sex: meta.sex,
        projection: meta.projection,
      })
      const summary = generateSummary(data.predictions, settings.confidenceThreshold)
      setResults({ predictions: data.predictions, summary })
      addToast('Analysis complete', 'success')

      if (settings.autoSaveHistory) {
        addPrediction({
          predictions: data.predictions,
          imagePreview: preview,
          summary,
        })
      }

      const topDisease = Object.entries(data.predictions).sort(([, a], [, b]) => b - a)[0]?.[0]
      setGradcamTarget(topDisease)

      if (settings.showGradcam) {
        setGradcamLoading(true)
        try {
          const gradcam = await fetchGradcam(file, topDisease)
          setGradcamStatus(gradcam?.status || 'sample')
          setGradcamConf(gradcam?.confidence ?? data.predictions[topDisease])
          setGradcamSampleIdx(gradcam?.sample_index ?? null)
          setHeatmapUrl(gradcam?.heatmap || null)
        } catch {
          setGradcamStatus('sample')
          setHeatmapUrl(null)
          setGradcamConf(data.predictions[topDisease])
        } finally {
          setGradcamLoading(false)
        }
      }
    } catch (err) {
      addToast(err.response?.data?.detail || 'Prediction failed. Is the backend running?', 'error')
    } finally {
      setLoading(false)
    }
  }

  const reset = () => {
    setFile(null)
    setPreview(null)
    setResults(null)
    setHeatmapUrl(null)
    setGradcamStatus(null)
    setGradcamTarget(null)
    setGradcamConf(null)
    setGradcamSampleIdx(null)
  }

  return (
    <div className="space-y-8">
      <GlassCard>
        <UploadZone onFileSelect={handleFile} preview={preview} disabled={loading} />
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          <label className="text-sm">
            <span className="text-slate-500">Age (optional)</span>
            <input
              type="number"
              min="18"
              max="100"
              value={meta.age}
              onChange={(e) => setMeta((m) => ({ ...m, age: e.target.value }))}
              placeholder="61"
              className="mt-1 w-full rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50"
            />
          </label>
          <label className="text-sm">
            <span className="text-slate-500">Sex</span>
            <select
              value={meta.sex}
              onChange={(e) => setMeta((m) => ({ ...m, sex: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50"
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </label>
          <label className="text-sm">
            <span className="text-slate-500">Projection</span>
            <select
              value={meta.projection}
              onChange={(e) => setMeta((m) => ({ ...m, projection: e.target.value }))}
              className="mt-1 w-full rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/50"
            >
              <option value="PA">PA</option>
              <option value="AP">AP</option>
            </select>
          </label>
        </div>
        <p className="mt-2 text-xs text-slate-500">
          Metadata feeds the meta_branch (5 features) — same as PadChest training.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={analyze}
            disabled={!file || loading}
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-violet-600 px-6 py-3 text-sm font-semibold text-white shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Analyze X-Ray
              </>
            )}
          </motion.button>
          {(preview || results) && (
            <button
              onClick={reset}
              className="inline-flex items-center gap-2 rounded-xl border border-slate-300 px-5 py-3 text-sm font-medium hover:bg-slate-100 dark:border-slate-600 dark:hover:bg-slate-800"
            >
              <RotateCcw className="h-4 w-4" />
              Reset
            </button>
          )}
        </div>
      </GlassCard>

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass rounded-2xl p-12 flex flex-col items-center gap-4"
        >
          <Loader2 className="h-12 w-12 animate-spin text-cyan-500" />
          <p className="text-lg font-medium">Running neural inference...</p>
          <p className="text-sm text-slate-500">Preprocessing → DenseNet → Sigmoid multi-label</p>
        </motion.div>
      )}

      {results && !loading && (
        <>
          <PredictionResults
            predictions={results.predictions}
            imagePreview={preview}
            summary={results.summary}
            threshold={settings.confidenceThreshold}
          />
          <HeatmapPlaceholder
            heatmapUrl={heatmapUrl}
            loading={gradcamLoading}
            targetDisease={gradcamTarget}
            gradcamStatus={gradcamStatus}
            confidence={gradcamConf}
            sampleIndex={gradcamSampleIdx}
          />
        </>
      )}
    </div>
  )
}
