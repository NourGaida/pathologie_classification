import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { Search, Filter, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import GlassCard from '../components/ui/GlassCard'
import { useHistory } from '../context/HistoryContext'
import { formatDiseaseName, formatPercent } from '../constants/diseases'

const PAGE_SIZE = 6

export default function History() {
  const { history, clearHistory } = useHistory()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('all')
  const [page, setPage] = useState(1)

  const diseases = useMemo(() => {
    const set = new Set(history.map((h) => h.topDisease))
    return ['all', ...set]
  }, [history])

  const filtered = useMemo(() => {
    return history.filter((item) => {
      const matchSearch =
        !search ||
        item.topDisease.toLowerCase().includes(search.toLowerCase()) ||
        item.summary?.toLowerCase().includes(search.toLowerCase())
      const matchFilter = filter === 'all' || item.topDisease === filter
      return matchSearch && matchFilter
    })
  }, [history, search, filter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="space-y-6">
      <GlassCard>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              placeholder="Search by disease or summary..."
              className="w-full rounded-xl border border-slate-200/60 bg-white/50 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-slate-900/50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-400" />
            <select
              value={filter}
              onChange={(e) => { setFilter(e.target.value); setPage(1) }}
              className="rounded-xl border border-slate-200/60 bg-white/50 px-3 py-2 text-sm dark:border-slate-700 dark:bg-slate-900/50"
            >
              {diseases.map((d) => (
                <option key={d} value={d}>{d === 'all' ? 'All findings' : d}</option>
              ))}
            </select>
            {history.length > 0 && (
              <button
                onClick={clearHistory}
                className="flex items-center gap-1 rounded-xl border border-red-500/30 px-3 py-2 text-sm text-red-600 hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Clear
              </button>
            )}
          </div>
        </div>
      </GlassCard>

      {paginated.length === 0 ? (
        <GlassCard>
          <p className="py-12 text-center text-slate-500">No prediction history found.</p>
        </GlassCard>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {paginated.map((item, i) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
              className="glass overflow-hidden rounded-2xl"
            >
              <img src={item.imagePreview} alt="" className="aspect-video w-full object-cover bg-slate-900" />
              <div className="p-4 space-y-2">
                <div className="flex justify-between items-start">
                  <p className="font-semibold">{item.topDisease}</p>
                  <span className="rounded-full bg-cyan-500/15 px-2 py-0.5 text-xs font-mono text-cyan-600 dark:text-cyan-300">
                    {formatPercent(item.confidence)}
                  </span>
                </div>
                <p className="text-xs text-slate-500">{new Date(item.date).toLocaleString()}</p>
                <div className="flex flex-wrap gap-1">
                  {Object.entries(item.predictions)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([name, score]) => (
                      <span key={name} className="rounded-md bg-slate-100 px-2 py-0.5 text-xs dark:bg-slate-800">
                        {formatDiseaseName(name)} {formatPercent(score)}
                      </span>
                    ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {filtered.length > PAGE_SIZE && (
        <div className="flex items-center justify-center gap-4">
          <button
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded-xl p-2 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
          <button
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="rounded-xl p-2 hover:bg-slate-100 disabled:opacity-40 dark:hover:bg-slate-800"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      )}
    </div>
  )
}
