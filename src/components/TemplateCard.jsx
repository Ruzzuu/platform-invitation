import { Link } from 'react-router-dom'

export default function TemplateCard({ id, image, title, subtitle, price, badge }) {
  return (
    <Link to={`/template/${id}`} className="group block">
      <div className="relative overflow-hidden rounded-2xl bg-pink-50 aspect-[9/16]">
        <img
          src={image}
          alt={title}
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        {badge && (
          <span className="absolute top-3 left-3 px-3 py-1 text-xs font-semibold rounded-full bg-pink-500 text-white uppercase tracking-wide">
            {badge}
          </span>
        )}
      </div>
      <div className="mt-3 px-1">
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-serif text-base font-semibold text-dark">{title}</h3>
          {price && <span className="text-sm font-bold text-pink-500 whitespace-nowrap">{price}</span>}
        </div>
        {subtitle && <p className="text-xs text-warm-gray mt-0.5">{subtitle}</p>}
        <p className="text-xs font-medium text-pink-500 mt-1.5 group-hover:underline">View details &rarr;</p>
      </div>
    </Link>
  )
}
