import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FAQItem({ question, answer }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-b border-cream-dark/40">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-5 text-left"
      >
        <span className="font-medium text-dark pr-4">{question}</span>
        <span className="material-symbols-outlined text-warm-gray transition-transform duration-300" style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          expand_more
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="pb-5 text-sm text-warm-gray leading-relaxed">{answer}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
