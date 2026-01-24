import { useEffect, useRef, useState, useCallback } from 'react'
import fetchApi from '@/api/fetchApi'
import { useSessionStore } from '@/stores/sessionStore'
import { sessionManager } from '@/utils/sessionManager'
import { toast } from 'sonner'
import { useSessionUiStore } from '@/stores/sessionUiStore'

// Configuración de tiempos (en milisegundos)
const SESSION_CONFIG = {
  /** Tiempo antes de expiración para mostrar advertencia (2 minutos) */
  WARNING_THRESHOLD: 2 * 60 * 1000,
  /** Tiempo antes de expiración para refrescar el token automáticamente (10 minutos) */
  REFRESH_THRESHOLD: 10 * 60 * 1000,
  /** Intervalo para verificar el estado de la sesión (30 segundos) */
  CHECK_INTERVAL: 30 * 1000,
  /** Tiempo de inactividad para refrescar token automáticamente cuando hay actividad (1 minuto) */
  ACTIVITY_REFRESH_THROTTLE: 60 * 1000,
}

export const useSession = () => {
  const user = useSessionStore((state) => state.user)
  const setUser = useSessionStore((state) => state.setUser)
  const clearUser = useSessionStore((state) => state.clearUser)

  const sessionModalState = useSessionUiStore((s) => s.modalState)
  const setSessionModalState = useSessionUiStore((s) => s.setModalState)
  const [timeRemaining, setTimeRemaining] = useState(0)
  const [isExtending, setIsExtending] = useState(false)
  
  const logoutInProgressRef = useRef(false)
  const checkIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const lastRefreshRef = useRef<number>(0)
  const abortControllerRef = useRef<AbortController | null>(null)

  // Función para obtener el tiempo restante del token
  const getTokenTimeRemaining = useCallback(() => {
    if (!user?.token) return 0
    try {
      const payload = JSON.parse(atob(user.token.split('.')[1]))
      const exp = payload.exp * 1000
      return Math.max(exp - Date.now(), 0)
    } catch {
      return 0
    }
  }, [user?.token])

  // Función para refrescar el token
  const refreshToken = useCallback(async (showToast = false) => {
    if (logoutInProgressRef.current || !user?.token) return false

    // Verificar que el token no haya expirado antes de intentar refrescar
    const timeLeft = getTokenTimeRemaining()
    if (timeLeft <= 0) {
      console.warn('Token ya expirado, no se puede refrescar')
      return false
    }

    // Evitar refrescar demasiado seguido
    const now = Date.now()
    if (now - lastRefreshRef.current < SESSION_CONFIG.ACTIVITY_REFRESH_THROTTLE) {
      return true
    }

    try {
      abortControllerRef.current = new AbortController()
      
      const res = await fetchApi.patch({
        url: '/v1/usuarios/userSession/refresh-token',
        token: user.token,
        signal: abortControllerRef.current.signal,
      })

      if (!res.ok) {
        console.error('Error al refrescar token:', res.status)
        throw new Error('No se pudo refrescar token')
      }

      const json = await res.json()
      const newToken = json.data.token

      setUser({ ...user, token: newToken })
      lastRefreshRef.current = now
      setSessionModalState(null) // Cerrar modal si estaba abierto

      if (showToast) {
        toast.success('Sesión renovada', {
          description: 'Tu sesión ha sido extendida exitosamente.',
        })
      }

      return true
    } catch (error) {
      if ((error as Error).name === 'AbortError') return false
      console.error('Error al refrescar token:', error)
      return false
    }
  }, [user, setUser, getTokenTimeRemaining])

  // Función para cerrar sesión
  const handleLogout = useCallback(() => {
    if (logoutInProgressRef.current) return
    logoutInProgressRef.current = true
    setSessionModalState(null)
    sessionManager.logout()
  }, [])

  // Función para manejar la sesión expirada
  const handleSessionExpired = useCallback(() => {
    if (logoutInProgressRef.current) return
    setSessionModalState('expired')
  }, [])

  // Función para extender la sesión manualmente (desde el modal)
  const extendSession = useCallback(async () => {
    // Verificar si el token ya expiró antes de intentar refrescar
    const remaining = getTokenTimeRemaining()
    if (remaining <= 0) {
      handleSessionExpired()
      return
    }

    setIsExtending(true)
    const success = await refreshToken(true)
    setIsExtending(false)
    
    if (!success) {
      // Si falla el refresh, verificar si es porque el token expiró
      const newRemaining = getTokenTimeRemaining()
      if (newRemaining <= 0) {
        handleSessionExpired()
      } else {
        // Error de red u otro problema
        toast.error('Error al renovar sesión', {
          description: 'Hubo un problema al extender tu sesión. Inténtalo nuevamente.',
        })
      }
    }
  }, [refreshToken, handleSessionExpired, getTokenTimeRemaining])

  // Efecto principal para verificar el estado de la sesión
  useEffect(() => {
    if (!user?.token || user.status !== 'authenticated') {
      // Limpiar estados cuando no hay sesión
      setSessionModalState(null)
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      return
    }

    // Resetear estado de logout
    logoutInProgressRef.current = false

    // Validar inmediatamente si el token ya expiró
    const initialTimeRemaining = getTokenTimeRemaining()
    if (initialTimeRemaining <= 0) {
      handleSessionExpired()
      return
    }

    // Función para verificar el estado de la sesión
    const checkSessionState = () => {
      if (logoutInProgressRef.current) return

      const remaining = getTokenTimeRemaining()

      if (remaining <= 0) {
        // Token expirado
        handleSessionExpired()
        return
      }

      if (remaining <= SESSION_CONFIG.WARNING_THRESHOLD) {
        // Mostrar advertencia
        setTimeRemaining(Math.ceil(remaining / 1000))
        setSessionModalState('warning')
      } else if (sessionModalState === 'warning') {
        // Si ya no estamos en zona de advertencia, cerrar modal
        setSessionModalState(null)
      }
    }

    // Verificar inmediatamente
    checkSessionState()

    // Configurar intervalo de verificación
    checkIntervalRef.current = setInterval(checkSessionState, SESSION_CONFIG.CHECK_INTERVAL)

    // Refrescar permisos al iniciar

    return () => {
      if (checkIntervalRef.current) {
        clearInterval(checkIntervalRef.current)
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [user?.token, user?.status, setUser, getTokenTimeRemaining, handleSessionExpired, sessionModalState])

  // Actualizar countdown mientras el modal está abierto
  useEffect(() => {
    if (sessionModalState !== 'warning') return

    const interval = setInterval(() => {
      const remaining = getTokenTimeRemaining()
      if (remaining <= 0) {
        handleSessionExpired()
      } else {
        setTimeRemaining(Math.ceil(remaining / 1000))
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [sessionModalState, getTokenTimeRemaining, handleSessionExpired])

  return {
    user,
    setUser,
    clearUser,
    // Estado del modal de sesión
    sessionModalState,
    timeRemaining,
    isExtending,
    extendSession,
    handleLogout,
    // Utilidades
    getTokenTimeRemaining,
    refreshToken,
  }
}
