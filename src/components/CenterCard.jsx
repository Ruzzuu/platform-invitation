import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export default function CenterCard() {
  return (
    <motion.div
      className="relative z-10 mx-4 bg-white/40 backdrop-blur rounded-3xl shadow-2xl px-10 py-12 flex flex-col items-center text-center max-w-lg w-full"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      <motion.h1
        className="font-display text-5xl md:text-6xl font-extrabold tracking-tight text-pink-500 uppercase leading-tight mb-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.3 }}
      >
        Happy Wedding
      </motion.h1>

      <motion.p
        className="text-sm md:text-base text-dark/70 max-w-xs mb-8 leading-relaxed"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.5 }}
      >
        Beautiful, customizable digital invitations for your perfect day.
        Instantly download and print.
      </motion.p>

      <motion.div
        className="flex flex-col sm:flex-row gap-3 w-full justify-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.65 }}
      >
        <Link
          to="/catalog"
          className="flex-1 flex items-center justify-center px-6 py-3 rounded-full bg-pink-500 text-white font-semibold text-sm hover:bg-pink-600 transition shadow-md"
        >
          Explore Templates
        </Link>
        <Link
          to="/about"
          className="flex-1 flex items-center justify-center px-6 py-3 rounded-full bg-gray-100/80 text-dark font-semibold text-sm hover:bg-gray-200/90 transition shadow-sm"
          onClick={e => {
            e.preventDefault()
            window.open('https://wa.me/6281515263851?text=Halo%20Eterna!%20Saya%20tertarik%20dengan%20jasa%20custom%20design%20undangan.%20Bisa%20minta%20informasi%20lebih%20lanjut%3F', '_blank')
          }}
        >
          Request Custom Design
        </Link>
      </motion.div>
    </motion.div>
  )
}
