import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const links = [
  { to: '/', label: 'Home' },
  { to: '/catalog', label: 'Templates' },
  { to: '/about', label: 'About & FAQ' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 bg-cream-dark/90 backdrop-blur-md border-b border-cream-dark/60">
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="font-serif text-2xl font-bold tracking-tight text-black">
          Lembaranbaru<span className="text-pink-500">.</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `text-sm font-medium transition-colors hover:text-pink-500 ${isActive ? 'text-pink-500' : 'text-black/70'}`
              }
            >
              {l.label}
            </NavLink>
          ))}
          <Link
            to="/catalog"
            className="ml-2 px-5 py-2 rounded-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition shadow-sm"
          >
            Shop Now
          </Link>
        </nav>

        {/* Mobile burger */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 text-dark"
          aria-label="Toggle menu"
        >
          <span className="material-symbols-outlined text-2xl">{open ? 'close' : 'menu'}</span>
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="md:hidden overflow-hidden bg-cream border-t border-cream-dark/30"
          >
            <nav className="flex flex-col gap-1 p-4">
              {links.map((l) => (
                <NavLink
                  key={l.to}
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `px-4 py-3 rounded-lg text-sm font-medium transition ${isActive ? 'bg-pink-50 text-pink-500' : 'text-black/70 hover:bg-pink-50'}`
                  }
                >
                  {l.label}
                </NavLink>
              ))}
              <Link
                to="/catalog"
                onClick={() => setOpen(false)}
                className="mt-2 px-5 py-3 text-center rounded-full bg-pink-500 text-white text-sm font-semibold"
              >
                Shop Now
              </Link>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
