import { useEffect, useRef, useState } from 'react'
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

export default function DeltaGrayTemplate() {
  const { invitation } = useInvitationContext()
  const [opened, setOpened] = useState(false)
  const [activeSection, setActiveSection] = useState('home')
  const [musicPlaying, setMusicPlaying] = useState(false)
  const audioRef = useRef(null)
  const mainRef = useRef(null)
  useEffect(() => { document.title = invitation.title }, [invitation.title])
  useEffect(() => {
    if (!opened) return
    const elements = SECTIONS.map((id) => mainRef.current?.querySelector(`#${id}`)).filter(Boolean)
    const observer = new IntersectionObserver((entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)), { root: mainRef.current, threshold: 0.35 })
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [opened])
  function openInvitation() {
    setOpened(true)
    if (audioRef.current && invitation.media.musicUrl) { audioRef.current.volume = 0.5; audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {}) }
  }
  function toggleMusic() {
    if (!audioRef.current) return
    if (musicPlaying) { audioRef.current.pause(); setMusicPlaying(false) }
    else audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {})
  }
  const share = () => navigator.share ? navigator.share({ title: invitation.title, url: location.href }).catch(() => {}) : navigator.clipboard?.writeText(location.href)
  return (
    <div className="invitation-theme delta-gray-theme min-h-[100dvh] bg-[#0a0a0a] text-white">
      {invitation.media.musicUrl && <audio ref={audioRef} src={invitation.media.musicUrl} loop />}
      {!opened ? <Cover onOpen={openInvitation} /> : <div className="relative mx-auto flex h-[100dvh] w-full max-w-[430px] flex-col overflow-hidden bg-[#333] text-white/90"><main ref={mainRef} className="relative z-10 flex-1 overflow-y-auto no-scrollbar"><section id="home"><Home onShare={share} /></section><section id="couple"><CoupleProfile /></section><section id="events"><EventDetails /></section><section id="gallery"><GalleryRSVP /></section><section id="closing"><Closing /></section></main>{invitation.media.musicUrl && <MusicButton playing={musicPlaying} onToggle={toggleMusic} />}<NavWidget active={activeSection} onChange={(id) => mainRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })} /></div>}
    </div>
  )
}
