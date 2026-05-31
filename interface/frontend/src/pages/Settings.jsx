import { useState } from 'react'
import { Moon, Sun, Server, Sliders, Cpu, Save } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import { useTheme } from '../context/ThemeContext'
import { useSettings } from '../context/SettingsContext'
import { useToast } from '../context/ToastContext'
import { fetchHealth } from '../api/client'

export default function Settings() {
  const { isDark, toggleTheme, setTheme } = useTheme()
  const { settings, updateSetting } = useSettings()
  const { addToast } = useToast()
  const [apiUrl, setApiUrl] = useState(settings.apiUrl)
  const [testing, setTesting] = useState(false)

  const saveApi = () => {
    updateSetting('apiUrl', apiUrl)
    addToast('API URL saved', 'success')
  }

  const testConnection = async () => {
    setTesting(true)
    try {
      localStorage.setItem('chestvision_api_url', apiUrl)
      await fetchHealth()
      addToast('Backend connection successful', 'success')
    } catch {
      addToast('Could not reach backend', 'error')
    } finally {
      setTesting(false)
    }
  }

  return (
    <div className="max-w-3xl space-y-6">
      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          {isDark ? <Moon className="h-5 w-5 text-violet-400" /> : <Sun className="h-5 w-5 text-amber-500" />}
          <h3 className="text-lg font-semibold">Appearance</h3>
        </div>
        <div className="flex items-center justify-between rounded-xl bg-slate-50/80 p-4 dark:bg-slate-800/50">
          <div>
            <p className="font-medium">Dark mode</p>
            <p className="text-sm text-slate-500">Toggle between light and dark themes</p>
          </div>
          <button
            onClick={toggleTheme}
            className={`relative h-8 w-14 rounded-full transition ${isDark ? 'bg-cyan-600' : 'bg-slate-300'}`}
          >
            <span
              className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition ${isDark ? 'left-7' : 'left-1'}`}
            />
          </button>
        </div>
        <div className="mt-3 flex gap-2">
          <button onClick={() => setTheme('light')} className="text-sm text-slate-500 hover:text-cyan-600">Light</button>
          <span className="text-slate-300">|</span>
          <button onClick={() => setTheme('dark')} className="text-sm text-slate-500 hover:text-cyan-600">Dark</button>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <Sliders className="h-5 w-5 text-cyan-500" />
          <h3 className="text-lg font-semibold">Detection Threshold</h3>
        </div>
        <label className="block text-sm text-slate-500 mb-2">
          Confidence threshold: {Math.round(settings.confidenceThreshold * 100)}%
        </label>
        <input
          type="range"
          min="10"
          max="90"
          value={settings.confidenceThreshold * 100}
          onChange={(e) => updateSetting('confidenceThreshold', Number(e.target.value) / 100)}
          className="w-full accent-cyan-500"
        />
        <label className="mt-4 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.showGradcam}
            onChange={(e) => updateSetting('showGradcam', e.target.checked)}
            className="accent-cyan-500"
          />
          Request GradCAM heatmap after prediction
        </label>
        <label className="mt-2 flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={settings.autoSaveHistory}
            onChange={(e) => updateSetting('autoSaveHistory', e.target.checked)}
            className="accent-cyan-500"
          />
          Auto-save predictions to history
        </label>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <Server className="h-5 w-5 text-emerald-500" />
          <h3 className="text-lg font-semibold">API Configuration</h3>
        </div>
        <input
          value={apiUrl}
          onChange={(e) => setApiUrl(e.target.value)}
          placeholder="http://localhost:8000"
          className="w-full rounded-xl border border-slate-200/60 bg-white/50 px-4 py-3 text-sm dark:border-slate-700 dark:bg-slate-900/50"
        />
        <div className="mt-4 flex gap-2">
          <button
            onClick={saveApi}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-600"
          >
            <Save className="h-4 w-4" />
            Save
          </button>
          <button
            onClick={testConnection}
            disabled={testing}
            className="rounded-xl border border-slate-300 px-4 py-2 text-sm dark:border-slate-600"
          >
            {testing ? 'Testing...' : 'Test connection'}
          </button>
        </div>
      </GlassCard>

      <GlassCard>
        <div className="flex items-center gap-3 mb-6">
          <Cpu className="h-5 w-5 text-violet-500" />
          <h3 className="text-lg font-semibold">Model Information</h3>
        </div>
        <dl className="space-y-3 text-sm">
          {[
            ['Architecture', 'DenseNet121PadChest (timm)'],
            ['Model file', 'model.pt or best_model.pth'],
            ['Classes', '14 PadChest pathologies'],
            ['Metadata', 'age, sex (M/F), projection (PA/AP) — 5 features'],
            ['Preprocessing', '224×224, CLAHE, PadChest mean/std'],
            ['Inference', 'PyTorch TorchScript / state_dict + sigmoid'],
          ].map(([k, v]) => (
            <div key={k} className="flex flex-col sm:flex-row sm:justify-between gap-1 border-b border-slate-200/50 pb-2 dark:border-slate-700/50">
              <dt className="text-slate-500">{k}</dt>
              <dd className="font-medium">{v}</dd>
            </div>
          ))}
        </dl>
      </GlassCard>
    </div>
  )
}
