import { useEffect, useRef, useState } from 'react'
import { AnimatePresence } from 'framer-motion'
import Opening from './components/Opening'
import Cover from './components/Cover'
import NavWidget from './components/NavWidget'
import MusicButton from './components/MusicButton'
import Home from './components/Home'
import CoupleProfile from './components/CoupleProfile'
import EventDetails from './components/EventDetails'
import GalleryRSVP from './components/GalleryRSVP'
import Closing from './components/Closing'
import { useInvitationContext } from '../../InvitationContext'

const SECTIONS = ['home', 'couple', 'events', 'gallery', 'closing']

export default function PinkFlowerTemplate({ preview = false }) {
  const { invitation } = useInvitationContext()
  const [stage, setStage] = useState(preview ? 'cover' : 'opening')
  const [activeSection, setActiveSection] = useState('home')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)
  const mainRef = useRef(null)
  useEffect(() => { document.title = invitation.title }, [invitation.title])
  useEffect(() => {
    if (stage !== 'main') return
    const elements = SECTIONS.map((id) => mainRef.current?.querySelector(`#${id}`)).filter(Boolean)
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)), { root: mainRef.current, threshold: 0.35 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [stage])
  function openInvitation() { setStage('main'); if (audioRef.current && invitation.media.musicUrl) audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {}) }
  function toggleMusic() { if (!audioRef.current) return; if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false) } else audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {}) }
  const share = () => navigator.share ? navigator.share({ title: invitation.title, url: location.href }).catch(() => {}) : navigator.clipboard?.writeText(location.href)
  return (
    <div className="invitation-theme pink-flower-theme min-h-[100dvh] bg-cream text-dark">
      {invitation.media.musicUrl && <audio ref={audioRef} src={invitation.media.musicUrl} loop />}
      {stage === 'main' ? <div className="relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-cream text-dark"><main ref={mainRef} className="relative z-10 flex-1 overflow-y-auto no-scrollbar"><section id="home"><Home onShare={share} /></section><section id="couple"><CoupleProfile /></section><section id="events"><EventDetails /></section><section id="gallery"><GalleryRSVP /></section><section id="closing"><Closing /></section></main>{invitation.media.musicUrl && <MusicButton playing={musicPlaying} onToggle={toggleMusic} />}<NavWidget active={activeSection} onChange={(id) => mainRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })} /></div> : <div className="mx-auto h-[100dvh] max-w-[430px]">{stage === 'cover' && <Cover onOpen={openInvitation} />}</div>}
      <AnimatePresence>{stage === 'opening' && <Opening onDone={() => setStage('cover')} />}</AnimatePresence>
    </div>
  )
}
