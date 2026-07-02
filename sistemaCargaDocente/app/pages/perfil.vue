<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    <div class="mx-auto max-w-5xl px-4 pt-6 sm:px-6 lg:px-8">
      <section class="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_50px_-20px_rgba(15,23,42,0.15)]">
        <div class="flex flex-col gap-6">
          <div class="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-slate-50 p-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Mi perfil</p>
              <h2 class="mt-3 text-3xl font-semibold text-slate-900">Detalles de usuario</h2>
              <p class="mt-2 text-sm leading-6 text-slate-600">Revisa tu información de acceso y los permisos asignados en el sistema.</p>
            </div>

            <div class="flex items-center gap-3">
              <div class="text-left md:text-right">
                <h1 class="text-xl font-semibold text-slate-900">{{ user?.nombre_usuario || 'Invitado' }}</h1>
                <p class="mt-1 text-sm text-slate-500 capitalize">{{ user?.role || 'sin rol asignado' }}</p>
              </div>
              <div class="flex h-14 w-14 items-center justify-center rounded-full border border-slate-200 bg-white text-xl font-bold text-blue-600 shadow-sm">{{ userAvatar }}</div>
            </div>
          </div>

          <div class="grid gap-6 sm:grid-cols-2">
            <div class="rounded-[1.5rem] bg-slate-50 p-6">
              <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Nombre</p>
              <p class="mt-3 text-base font-semibold text-slate-900">{{ user?.nombre || user?.nombre_usuario || 'Invitado' }}</p>
            </div>
            <div class="rounded-[1.5rem] bg-slate-50 p-6">
              <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Rol</p>
              <p class="mt-3 text-base font-semibold text-slate-900 capitalize">{{ user?.roles?.join(', ') || user?.role || 'No asignado' }}</p>
            </div>
            <div class="rounded-[1.5rem] bg-slate-50 p-6">
              <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Departamento</p>
              <p class="mt-3 text-base font-semibold text-slate-900">{{ user?.departamento || 'Sin departamento asignado' }}</p>
            </div>
            <div class="rounded-[1.5rem] bg-slate-50 p-6">
              <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Categoría</p>
              <p class="mt-3 text-base font-semibold text-slate-900">{{ user?.categoria || 'Sin categoría asignada' }}</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'

const user = ref<{ nombre?: string; nombre_usuario?: string; role?: string; roles?: string[]; departamento?: string; categoria?: string } | null>(null)

const loadUser = () => {
  if (process.client) {
    const tokenUser = useApi().getUserFromToken()
    user.value = tokenUser
  }
}

onMounted(loadUser)

const userAvatar = computed(() => {
  if (!user.value?.nombre_usuario) return 'UN'
  return user.value.nombre_usuario
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
})

definePageMeta({
  layout: 'default'
})
</script>
