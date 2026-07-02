export const useApi = () => {
  const runtimeConfig = useRuntimeConfig()
  const authToken = useState<string | null>('auth_token', () => null)

  const readStoredToken = () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('auth_token')
      if (stored) {
        authToken.value = stored
        return stored
      }
    }

    return authToken.value
  }

  const setAuthToken = (token: string | null) => {
    authToken.value = token

    if (typeof window !== 'undefined') {
      if (token) {
        window.localStorage.setItem('auth_token', token)
      } else {
        window.localStorage.removeItem('auth_token')
      }
    }
  }

  const getAuthHeaders = () => {
    const token = readStoredToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  const normalizeRole = (role: string | null | undefined) => {
    const value = String(role || '').toLowerCase().trim()

    if (!value) return 'docente'
    if (value === 'jefe de departamento' || value === 'jefe_departamento') {
      return 'jefe de departamento'
    }

    return value
  }

  const decodeJwtPayload = (token: string) => {
    const payload = token.split('.')[1]
    if (!payload) {
      return null
    }

    const normalized = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
    const binary = atob(padded)
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0))
    const decodedText = new TextDecoder('utf-8').decode(bytes)

    return JSON.parse(decodedText)
  }

  const roleMode = useState<string | null>('active_role', () => null)

  const readStoredRoleMode = () => {
    if (typeof window !== 'undefined') {
      const stored = window.localStorage.getItem('active_role')
      if (stored) {
        roleMode.value = normalizeRole(stored)
        return roleMode.value
      }
    }

    return roleMode.value
  }

  const setRoleMode = (mode: string | null) => {
    roleMode.value = mode ? normalizeRole(mode) : null
    if (typeof window !== 'undefined') {
      if (roleMode.value) {
        window.localStorage.setItem('active_role', roleMode.value)
      } else {
        window.localStorage.removeItem('active_role')
      }
    }
  }

  const getUserFromToken = () => {
    const token = readStoredToken()
    if (!token) {
      return null
    }

    try {
      const decoded = decodeJwtPayload(token)
      if (!decoded) {
        return null
      }

      const nombre = decoded.nombre || decoded.name || [decoded.nombre_usuario, decoded.apellido].filter(Boolean).join(' ')
      const roles = Array.isArray(decoded.roles)
        ? decoded.roles.map(normalizeRole).filter(Boolean)
        : [normalizeRole(decoded.role)]
      const activeRole = () => {
        const storedRole = readStoredRoleMode()
        if (storedRole && roles.includes(storedRole)) {
          return storedRole
        }
        return normalizeRole(decoded.role)
      }

      return {
        ...decoded,
        nombre,
        role: normalizeRole(decoded.role),
        roles,
        activeRole: activeRole()
      }
    } catch {
      return null
    }
  }

  const api = $fetch.create({
    baseURL: runtimeConfig.public.apiBase || 'http://localhost:3001',
    async onRequest({ options }) {
      const token = readStoredToken()
      if (token) {
        const activeRole = readStoredRoleMode()
        options.headers = {
          ...((options.headers || {}) as Record<string, string>),
          Authorization: `Bearer ${token}`,
          ...(activeRole ? { 'x-active-role': activeRole } : {})
        }
      }
    }
  })

  return {
    api,
    setAuthToken,
    getAuthHeaders,
    getUserFromToken,
    setRoleMode,
    authToken
  }
}
