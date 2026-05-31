import { createContext, useContext, useEffect, useState } from 'react'
import { formatDiseaseName } from '../constants/diseases'

const HistoryContext = createContext(null)

export function HistoryProvider({ children }) {
  const [history, setHistory] = useState(() => {
    try {
      const stored = localStorage.getItem('chestvision_history')
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem('chestvision_history', JSON.stringify(history.slice(0, 100)))
  }, [history])

  const addPrediction = (entry) => {
    const topDisease = Object.entries(entry.predictions)
      .sort(([, a], [, b]) => b - a)[0]

    const record = {
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      imagePreview: entry.imagePreview,
      predictions: entry.predictions,
      topDisease: topDisease ? formatDiseaseName(topDisease[0]) : 'Unknown',
      confidence: topDisease ? topDisease[1] : 0,
      summary: entry.summary || '',
    }
    setHistory((prev) => [record, ...prev])
    return record
  }

  const clearHistory = () => setHistory([])

  return (
    <HistoryContext.Provider value={{ history, addPrediction, clearHistory }}>
      {children}
    </HistoryContext.Provider>
  )
}

export const useHistory = () => {
  const ctx = useContext(HistoryContext)
  if (!ctx) throw new Error('useHistory must be used within HistoryProvider')
  return ctx
}
