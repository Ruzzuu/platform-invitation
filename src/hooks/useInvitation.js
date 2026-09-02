import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { normalizeInvitationRow } from '../invitations/invitationData'

export function useInvitation(slug) {
  const [state, setState] = useState({ data: null, loading: true, error: null })

  useEffect(() => {
    let cancelled = false
    async function load() {
      setState({ data: null, loading: true, error: null })
      const { data: invitation, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', slug.toLowerCase())
        .eq('status', 'published')
        .maybeSingle()
      if (cancelled) return
      if (error) {
        setState({ data: null, loading: false, error: error.message })
        return
      }
      if (!invitation) {
        setState({ data: null, loading: false, error: null })
        return
      }

      const expired = invitation.expires_at && new Date(invitation.expires_at).getTime() <= Date.now()
      if (invitation.is_active === false || expired) {
        setState({ data: null, loading: false, error: null })
        return
      }

      // Older rows may have template_slug but no template_id. Support both
      // forms so existing invitations do not need to be recreated.
      const templateQuery = invitation.template_id
        ? supabase.from('templates').select('slug, renderer_key, name').eq('id', invitation.template_id).maybeSingle()
        : supabase.from('templates').select('slug, renderer_key, name').eq('slug', invitation.template_slug).maybeSingle()
      const { data: template, error: templateError } = await templateQuery
      if (cancelled) return
      if (templateError) {
        setState({ data: null, loading: false, error: templateError.message })
        return
      }

      setState({
        data: normalizeInvitationRow({ ...invitation, templates: template }),
        loading: false,
        error: null,
      })
    }
    if (slug) load()
    return () => { cancelled = true }
  }, [slug])

  return state
}
