import { createContext, useContext } from 'react'

const InvitationContext = createContext(null)

export function InvitationProvider({ invitation, guestName, children }) {
  return <InvitationContext.Provider value={{ invitation, guestName }}>{children}</InvitationContext.Provider>
}

export function useInvitationContext() {
  const value = useContext(InvitationContext)
  if (!value) throw new Error('useInvitationContext must be used inside InvitationProvider')
  return value
}
