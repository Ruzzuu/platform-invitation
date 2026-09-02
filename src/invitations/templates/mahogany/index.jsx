import { useEffect, useRef, useState } from 'react'
import { useInvitationContext } from '../../InvitationContext'
import {
  MahoganyClosing,
  MahoganyCouple,
  MahoganyCover,
  MahoganyEvents,
  MahoganyGallery,
  MahoganyHome,
  MahoganyMusicButton,
  MahoganyNav,
} from './parts'

const SECTIONS = ['home', 'couple', 'events', 'gallery', 'closing']

export default function MahoganyTemplate() {
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
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((entry) => entry.isIntersecting && setActiveSection(entry.target.id)),
      { root: mainRef.current, threshold: 0.35 },
    )
    elements.forEach((element) => observer.observe(element))
    return () => observer.disconnect()
  }, [opened])

  function openInvitation() {
    setOpened(true)
    if (!audioRef.current || !invitation.media.musicUrl) return
    audioRef.current.volume = 0.5
    audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {})
  }

  function toggleMusic() {
    if (!audioRef.current) return
    if (musicPlaying) {
      audioRef.current.pause()
      setMusicPlaying(false)
    } else {
      audioRef.current.play().then(() => setMusicPlaying(true)).catch(() => {})
    }
  }

  function scrollToSection(id) {
    mainRef.current?.querySelector(`#${id}`)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div className="mahogany-theme min-h-[100dvh] w-full bg-mahogany text-ivory">
      {invitation.media.musicUrl && <audio ref={audioRef} src={invitation.media.musicUrl} preload="none" loop />}
      <div className="relative mx-auto h-[100dvh] w-full overflow-hidden bg-mahogany shadow-2xl">
        {!opened ? (
          <MahoganyCover onOpen={openInvitation} />
        ) : (
          <>
            <main ref={mainRef} className="relative z-10 h-full overflow-y-auto no-scrollbar">
              <section id="home"><MahoganyHome /></section>
              <section id="couple"><MahoganyCouple /></section>
              <section id="events"><MahoganyEvents /></section>
              <section id="gallery"><MahoganyGallery /></section>
              <section id="closing"><MahoganyClosing /></section>
            </main>
            {invitation.media.musicUrl && <MahoganyMusicButton playing={musicPlaying} onToggle={toggleMusic} />}
            <MahoganyNav active={activeSection} onChange={scrollToSection} />
          </>
        )}
      </div>
    </div>
  )
}
