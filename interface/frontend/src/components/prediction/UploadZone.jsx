import { useCallback, useState } from 'react'
import { motion } from 'framer-motion'
import { Upload, ImageIcon, FileImage } from 'lucide-react'
import clsx from 'clsx'

export default function UploadZone({ onFileSelect, preview, disabled }) {
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback(
    (e) => {
      e.preventDefault()
      setDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file?.type.startsWith('image/')) onFileSelect(file)
    },
    [onFileSelect]
  )

  const handleChange = (e) => {
    const file = e.target.files?.[0]
    if (file) onFileSelect(file)
  }

  return (
    <motion.div
      onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      animate={{
        borderColor: dragging ? 'rgb(14 165 233)' : undefined,
        scale: dragging ? 1.01 : 1,
      }}
      className={clsx(
        'relative overflow-hidden rounded-2xl border-2 border-dashed transition-colors',
        dragging
          ? 'border-cyan-500 bg-cyan-500/5'
          : 'border-slate-300 dark:border-slate-600',
        disabled && 'pointer-events-none opacity-60'
      )}
    >
      {preview ? (
        <div className="relative aspect-[4/3] max-h-96 w-full">
          <img src={preview} alt="X-ray preview" className="h-full w-full object-contain bg-slate-900/5 dark:bg-slate-900" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-lg bg-black/50 px-3 py-1.5 text-sm text-white backdrop-blur">
            <FileImage className="h-4 w-4" />
            Ready for analysis
          </div>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center px-6 py-16">
          <motion.div
            animate={{ y: dragging ? -4 : [0, -6, 0] }}
            transition={{ repeat: dragging ? 0 : Infinity, duration: 2.5 }}
            className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20"
          >
            <Upload className="h-8 w-8 text-cyan-500" />
          </motion.div>
          <p className="text-lg font-semibold text-slate-800 dark:text-slate-100">
            Drop chest X-ray here
          </p>
          <p className="mt-1 text-sm text-slate-500">or click to browse · PNG, JPG, DICOM*</p>
          <input
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleChange}
            disabled={disabled}
          />
          <div className="mt-6 flex items-center gap-4 text-xs text-slate-400">
            <span className="flex items-center gap-1"><ImageIcon className="h-3.5 w-3.5" /> 224×224 auto-resize</span>
            <span>HIPAA-ready pipeline</span>
          </div>
        </label>
      )}
    </motion.div>
  )
}
