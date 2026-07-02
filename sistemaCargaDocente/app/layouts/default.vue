<template>
  <div class="min-h-screen bg-slate-50">
    <header class="sticky top-0 z-50 border-b border-slate-200 bg-white shadow-sm">
      <div class="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <NuxtLink to="/dashboard" class="flex items-center gap-3 text-slate-900 no-underline">
          <img src="/images/carga.png" alt="Carga Docente" class="h-12 w-12 rounded-3xl bg-white object-cover shadow-sm" />
          <div>
            <p class="text-xs uppercase tracking-[0.35em] text-slate-500">UNISS</p>
            <p class="text-lg font-semibold">Carga Docente</p>
          </div>
        </NuxtLink>

        <nav class="hidden items-center gap-2 md:flex">
          <NuxtLink
            v-for="item in navLinks"
            :key="item.to"
            :to="item.to"
            class="rounded-full px-4 py-2 text-sm font-medium transition"
            :class="item.to === route.path ? 'bg-blue-600 text-white' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'"
          >
            {{ item.title }}
          </NuxtLink>
        </nav>

        <div class="flex items-center gap-3">
          <div class="relative" @mouseenter="cancelCloseProfile" @mouseleave="scheduleCloseProfile">
            <button
              @click="toggleProfile"
              class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-slate-700 shadow-sm transition hover:bg-slate-100"
              aria-label="Abrir menú de perfil"
            >
              <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="8" r="4" />
                <path d="M5 20a7 7 0 0 1 14 0" />
              </svg>
            </button>

            <div v-if="isProfileOpen" class="absolute right-0 top-14 z-50 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl" @mouseenter="cancelCloseProfile" @mouseleave="scheduleCloseProfile">
              <div class="rounded-2xl bg-slate-50 px-3 py-3">
                <p class="text-sm font-semibold text-slate-900">{{ userName }}</p>
                <p class="mt-1 text-xs capitalize text-slate-500">{{ userRole }}</p>
              </div>
              <button v-if="alternateRole" @click="switchRoleMode" class="mt-2 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">
                Entrar como {{ alternateRole === 'docente' ? 'Docente' : 'Jefe de Departamento' }}
              </button>
              <button @click="goProfile" class="mt-2 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Ver perfil</button>
              <button @click="logout" class="mt-2 flex w-full items-center rounded-xl px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-100">Cerrar sesión</button>
            </div>
          </div>

          <button
            @click="toggleMenu"
            class="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-900 md:hidden"
            aria-label="Abrir menú"
          >
            <svg class="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div v-if="isMenuOpen" class="border-t border-slate-200 bg-white md:hidden">
        <div class="space-y-1 px-4 py-4">
          <NuxtLink
            v-for="item in navLinks"
            :key="item.to"
            :to="item.to"
            @click="closeMenu"
            class="block rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-900"
          >
            {{ item.title }}
          </NuxtLink>
        </div>
      </div>
    </header>

    <main class="pt-2">
      <div class="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const { getUserFromToken, setAuthToken, setRoleMode, authToken } = useApi()
const router = useRouter()
const route = useRoute()

const isMenuOpen = ref(false)
const isProfileOpen = ref(false)
const user = ref<{ nombre_usuario?: string; role?: string; roles?: string[]; activeRole?: string } | null>(null)

const activeRole = computed(() => user.value?.activeRole || user.value?.role || 'docente')
const userRoles = computed(() => user.value?.roles || [user.value?.role].filter(Boolean) as string[])
const alternateRole = computed(() => {
  if (!userRoles.value || userRoles.value.length < 2) return null
  return activeRole.value === 'docente' ? 'jefe de departamento' : 'docente'
})

const navLinks = computed(() => {
  const role = activeRole.value
  const links: Array<{ title: string; to: string }> = [
    { title: 'Inicio', to: '/dashboard' }
  ]

  if (role !== 'docente') {
    links.push({ title: 'Gestionar Actividades', to: '/gestionar-actividades' })
    links.push({ title: 'Cargas Docentes', to: '/sobrecarga-docente' })
  } else {
    links.push({ title: 'Mis Cargas Docentes', to: '/docente/mis-cargas' })
    links.push({ title: 'Carga Docente del Mes', to: '/docente/carga-del-mes' })
  }

  return links
})

const userName = computed(() => user.value?.nombre || user.value?.nombre_usuario || 'Usuario')
const userRole = computed(() => {
  const role = activeRole.value
  return role === 'jefe de departamento' ? 'Jefe de Departamento' : role === 'docente' ? 'Docente' : role
})
const userInitials = computed(() => {
  const name = userName.value || 'Usuario'
  const parts = name.split(' ').filter(Boolean)
  if (parts.length === 0) return 'US'
  return parts.slice(0, 2).map((part) => part[0]).join('').toUpperCase()
})

const closeProfileTimer = ref<number | null>(null)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  if (isMenuOpen.value) {
    isProfileOpen.value = false
  }
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const cancelCloseProfile = () => {
  if (closeProfileTimer.value) {
    window.clearTimeout(closeProfileTimer.value)
    closeProfileTimer.value = null
  }
}

const scheduleCloseProfile = () => {
  cancelCloseProfile()
  closeProfileTimer.value = window.setTimeout(() => {
    isProfileOpen.value = false
    closeProfileTimer.value = null
  }, 200)
}

const closeProfile = () => {
  cancelCloseProfile()
  isProfileOpen.value = false
}

const toggleProfile = () => {
  isProfileOpen.value = !isProfileOpen.value
  if (isProfileOpen.value) {
    isMenuOpen.value = false
  }
}

const logout = () => {
  setAuthToken(null)
  router.push('/login')
}

const goProfile = () => {
  isProfileOpen.value = false
  router.push('/perfil')
}

const switchRoleMode = () => {
  if (!alternateRole.value) return
  setRoleMode(alternateRole.value)
  isProfileOpen.value = false
  loadUser()
  if (route.path === '/dashboard') {
    window.location.href = '/dashboard'
  } else {
    router.push('/dashboard')
  }
}

const loadUser = () => {
  if (process.client) {
    user.value = getUserFromToken()
  }
}

onMounted(loadUser)
watch(authToken, loadUser)
</script>
