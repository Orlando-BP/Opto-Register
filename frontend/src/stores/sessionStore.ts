import { User } from '@/types'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface SessionState {
  user: User
  setUser: (user: User) => void
  clearUser: () => void
}

const initialUser: User = {
  id : 0,
  token: null as any, // null to prevent Bearer header on unauthenticated requests
  name: '',
  lastName1: '',
  lastName2: '',
  fullName: '',
  email: '',
  profilePic: '',
  alumnCode: 0,
  bloodType: 0,
  permissions: [],
  status: 'checking',
}

/**
 * Valida si el token JWT no ha expirado
 */
function isTokenValid(token: string | null): boolean {
  if (!token || token.trim() === '') return false
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]))
    const exp = payload.exp * 1000
    return exp > Date.now()
  } catch {
    return false
  }
}

export const useSessionStore = create<SessionState>()(
  persist(
    (set) => ({
      user: initialUser,
      setUser: (user) => set(() => ({ user })),
      clearUser: () =>
        set(() => ({
          user: {
            ...initialUser,
            token: null as any, // ensure token is null on logout
            status: 'unauthenticated',
          },
        })),
    }),
    {
      name: 'session-storage', // nombre en localStorage
      onRehydrateStorage: () => (state) => {
        // Validar token al cargar desde localStorage
        if (state && state.user.status === 'authenticated') {
          if (!isTokenValid(state.user.token)) {
            state.clearUser()
          }
        }
      },
    }
  )
)
