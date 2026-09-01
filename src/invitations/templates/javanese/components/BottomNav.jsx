import { HomeIcon, HeartIcon, CalendarDaysIcon, PhotoIcon } from '@heroicons/react/24/outline'

const TABS = [
  { id: 'home',    icon: HomeIcon,         label: 'Beranda'  },
  { id: 'couple',  icon: HeartIcon,        label: 'Pasangan' },
  { id: 'events',  icon: CalendarDaysIcon, label: 'Acara'    },
  { id: 'gallery', icon: PhotoIcon,        label: 'Galeri'   },
]

export default function BottomNav({ active, onChange }) {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-[#0a0904]-dark/80 backdrop-blur-md border-t border-blush/20 safe-bottom">
      <div className="flex items-center justify-around h-16">
        {TABS.map(({ id, icon, label }) => {
          const isActive = active === id
          const Icon = icon
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex flex-col items-center gap-0.5 flex-1 py-2 transition-all ${
                isActive ? 'text-blush' : 'text-warm-gray'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 h-0.5 w-8 rounded-full bg-blush -translate-y-px" />
              )}
              <span className="leading-none">
                <Icon className="w-6 h-6" />
              </span>
              <span className="text-[10px] font-semibold tracking-wide">{label}</span>
            </button>
          )
        })}
      </div>
    </nav>
  )
}

