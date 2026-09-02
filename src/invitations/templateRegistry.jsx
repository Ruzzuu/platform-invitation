import { lazy } from 'react'

export const TEMPLATE_REGISTRY = {
  'delta-gray': lazy(() => import('./templates/delta-gray/index.jsx')),
  'pink-flower': lazy(() => import('./templates/pink-flower/index.jsx')),
  javanese: lazy(() => import('./templates/javanese/index.jsx')),
  mahogany: lazy(() => import('./templates/mahogany/index.jsx')),
}

export const TEMPLATE_ALIASES = {
  'invitation-delta-gray': 'delta-gray',
  'invitation-pink-flower': 'pink-flower',
  'undangan-jawa': 'javanese',
  undanganjawa: 'javanese',
  mahogony: 'mahogany',
  'invitation-mahogony': 'mahogany',
  'invitation-mahogany': 'mahogany',
}

export function resolveRendererKey(value) {
  const key = String(value || '').toLowerCase()
  return TEMPLATE_REGISTRY[key] ? key : TEMPLATE_ALIASES[key]
}
