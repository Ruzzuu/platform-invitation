import { MusicalNoteIcon, SpeakerXMarkIcon } from '@heroicons/react/24/outline'

export default function MusicButton({ playing, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`fixed bottom-24 right-6 z-50 w-12 h-12 rounded-full bg-blush shadow-lg flex items-center justify-center text-white transition-all active:scale-90 border border-blush-dark/20 ${
        playing ? 'animate-spin-slow' : 'spin-paused'
      }`}
      aria-label="Toggle music"
    >
      {playing ? (
        <MusicalNoteIcon className="w-6 h-6" />
      ) : (
        <SpeakerXMarkIcon className="w-6 h-6" />
      )}
    </button>
  )
}
