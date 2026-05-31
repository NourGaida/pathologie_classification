import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Bot, X, Send, Sparkles } from 'lucide-react'

const suggestions = [
  'Explain cardiomegaly findings',
  'What threshold should I use?',
  'How does GradCAM work?',
]

export default function AIAssistant() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hello! I\'m your ChestVision AI assistant. Ask me about predictions, findings, or model metrics.' },
  ])
  const [input, setInput] = useState('')

  const send = () => {
    if (!input.trim()) return
    const userMsg = input.trim()
    setMessages((m) => [...m, { role: 'user', text: userMsg }])
    setInput('')
    setTimeout(() => {
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          text: 'This is a demo assistant. In production, connect to your clinical LLM for evidence-based explanations and cite guidelines.',
        },
      ])
    }, 600)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500 to-violet-600 text-white shadow-xl shadow-cyan-500/30 lg:left-auto lg:right-6"
      >
        <Bot className="h-6 w-6" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 left-4 right-4 z-50 mx-auto max-h-[70vh] max-w-md overflow-hidden rounded-2xl glass-strong shadow-2xl lg:left-auto lg:right-6"
          >
            <div className="flex items-center justify-between border-b border-slate-200/50 px-4 py-3 dark:border-slate-700/50">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-cyan-500" />
                <span className="font-semibold">AI Assistant</span>
              </div>
              <button onClick={() => setOpen(false)} className="rounded-lg p-1 hover:bg-slate-100 dark:hover:bg-slate-800">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="max-h-64 space-y-3 overflow-y-auto p-4 scrollbar-thin">
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`rounded-xl px-3 py-2 text-sm ${
                    msg.role === 'user'
                      ? 'ml-8 bg-cyan-500/15 text-cyan-900 dark:text-cyan-100'
                      : 'mr-8 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200'
                  }`}
                >
                  {msg.text}
                </div>
              ))}
            </div>
            <div className="flex flex-wrap gap-2 border-t border-slate-200/50 px-4 py-2 dark:border-slate-700/50">
              {suggestions.map((s) => (
                <button
                  key={s}
                  onClick={() => setInput(s)}
                  className="rounded-lg bg-slate-100 px-2 py-1 text-xs dark:bg-slate-800"
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="flex gap-2 border-t border-slate-200/50 p-3 dark:border-slate-700/50">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                placeholder="Ask about findings..."
                className="flex-1 rounded-xl bg-slate-100 px-3 py-2 text-sm outline-none dark:bg-slate-800"
              />
              <button onClick={send} className="rounded-xl bg-cyan-500 p-2 text-white hover:bg-cyan-600">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
