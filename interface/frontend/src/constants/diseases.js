/** Matches backend/model_meta.json target_diseases */
export const DISEASE_LABELS = [
  'normal',
  'copd signs',
  'cardiomegaly',
  'pleural effusion',
  'interstitial pattern',
  'alveolar pattern',
  'nodule',
  'atelectasis',
  'hilar enlargement',
  'pulmonary fibrosis',
  'tuberculosis sequelae',
  'rib fracture',
  'pneumothorax',
  'mediastinal mass',
]

export const PROB_DISPLAY_CAP = 0.985

export const formatDiseaseName = (name) =>
  name
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')

/** Format % for UI — never shows 100% */
export const formatPercent = (value) => {
  const capped = Math.min(value, PROB_DISPLAY_CAP)
  const pct = capped * 100
  if (pct >= 99.95) return '99.9%'
  return `${pct.toFixed(1)}%`
}

export const DISEASE_COLORS = [
  '#10b981', '#0ea5e9', '#8b5cf6', '#f59e0b', '#ef4444',
  '#ec4899', '#14b8a6', '#6366f1', '#f97316', '#84cc16',
  '#06b6d4', '#a855f7', '#e11d48', '#64748b',
]
