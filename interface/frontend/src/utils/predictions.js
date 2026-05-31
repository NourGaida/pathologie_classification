import { formatDiseaseName, formatPercent } from '../constants/diseases'

export const sortPredictions = (predictions) =>
  Object.entries(predictions)
    .map(([name, score]) => ({ name, displayName: formatDiseaseName(name), score }))
    .sort((a, b) => b.score - a.score)

export const getTopPredictions = (predictions, threshold = 0.35, limit = 5) =>
  sortPredictions(predictions)
    .filter((p) => p.score >= threshold)
    .slice(0, limit)

export const generateSummary = (predictions, threshold = 0.35) => {
  const top = getTopPredictions(predictions, threshold, 3)
  if (top.length === 0) {
    return 'No significant findings above the confidence threshold. Consider lowering the threshold or reviewing manually.'
  }
  const primary = top[0]
  if (primary.name === 'normal' && primary.score > 0.7) {
    return `Chest X-ray appears largely normal (${formatPercent(primary.score)} confidence). Routine follow-up recommended.`
  }
  const findings = top.map((p) => `${p.displayName} (${formatPercent(p.score)})`).join(', ')
  return `AI detected potential findings: ${findings}. Clinical correlation and specialist review advised.`
}
