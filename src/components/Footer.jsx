import { useState } from 'react'
import { Link } from 'react-router-dom'
import { supabase } from '../lib/supabase'

const WA_CONTACT = 'https://wa.me/6281515263851?text=Halo%20Eterna!%20Saya%20butuh%20bantuan.'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [subStatus, setSubStatus] = useState(null) // null | 'loading' | 'success' | 'duplicate' | 'error'

  async function handleSubscribe(e) {
    e.preventDefault()
    if (!email.trim()) return
    setSubStatus('loading')
    const { error } = await supabase.from('newsletter').insert({ email: email.trim().toLowerCase() })
    if (!error) {
      setSubStatus('success')
      setEmail('')
    } else if (error.code === '23505') {
      setSubStatus('duplicate')
    } else {
      setSubStatus('error')
    }
  }
  return (
    <footer className="bg-black text-white/80">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div>
            <h3 className="font-serif text-xl font-bold text-white mb-3">
              Lembaranbaru<span className="text-pink-400">.</span>
            </h3>
            <p className="text-sm leading-relaxed text-white/60">
              Creating beautiful, accessible design for life's most important moments.
            </p>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/catalog" className="hover:text-pink-400 transition">All Templates</Link></li>
              <li><Link to="/catalog" className="hover:text-pink-400 transition">Save the Dates</Link></li>
              <li><Link to="/catalog" className="hover:text-pink-400 transition">Invitations</Link></li>
              <li><Link to="/catalog" className="hover:text-pink-400 transition">Day-of Essentials</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/about" className="hover:text-pink-400 transition">FAQ</Link></li>
              <li><a href={WA_CONTACT} target="_blank" rel="noopener noreferrer" className="hover:text-pink-400 transition">Contact Us</a></li>
              <li><span className="cursor-default">Terms of Service</span></li>
              <li><span className="cursor-default">Privacy Policy</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-sm font-semibold text-white mb-4 uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-white/60 mb-3">Subscribe untuk inspirasi, update, dan penawaran eksklusif.</p>
            {subStatus === 'success' ? (
              <p className="text-green-400 text-sm">Terima kasih! Email Anda sudah terdaftar ✓</p>
            ) : (
              <>
                <form onSubmit={handleSubscribe} className="flex">
                  <input
                    type="email"
                    value={email}
                    onChange={e => { setEmail(e.target.value); setSubStatus(null) }}
                    placeholder="Email Anda"
                    className="flex-1 px-4 py-2 rounded-l-full bg-white/10 text-white text-sm placeholder:text-white/40 border border-white/20 focus:outline-none focus:border-pink-400"
                  />
                  <button
                    type="submit"
                    disabled={subStatus === 'loading'}
                    className="px-5 py-2 rounded-r-full bg-pink-500 text-white text-sm font-semibold hover:bg-pink-600 transition disabled:opacity-60"
                  >
                    {subStatus === 'loading' ? '...' : 'Subscribe'}
                  </button>
                </form>
                {subStatus === 'duplicate' && <p className="text-yellow-400 text-xs mt-1">Email sudah terdaftar.</p>}
                {subStatus === 'error' && <p className="text-red-400 text-xs mt-1">Terjadi kesalahan. Coba lagi.</p>}
              </>
            )}
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-cream/10 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-cream/40">
          <p>&copy; 2024 Eterna Invitations. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="material-symbols-outlined text-lg hover:text-pink-400 transition cursor-pointer">photo_camera</span>
            <span className="material-symbols-outlined text-lg hover:text-pink-400 transition cursor-pointer">push_pin</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
