import { create } from 'zustand'

interface SessionUiState {
  /** Evita spam de eventos expirada (en ms). */
  lastExpiredAt: number
  
  markExpired: () => void
  reset: () => void
}

export const useSessionUiStore = create<SessionUiState>()((set, get) => ({
  lastExpiredAt: 0,
  markExpired: () => {
    const now = Date.now()
    // Dedupe: 5s
    if (now - get().lastExpiredAt < 5000) return
    set({ lastExpiredAt: now })
  },
  reset: () => set({ lastExpiredAt: 0 }),
}))
