<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    <div class="mx-auto max-w-7xl px-4 pt-6 sm:px-6 lg:px-8">
      <section class="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_50px_-20px_rgba(15,23,42,0.15)]">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div class="space-y-4">
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Inicio</p>
            <h1 class="text-4xl font-semibold tracking-tight text-slate-900">¡Bienvenido/a, {{ personName }}!</h1>
            <p class="max-w-2xl text-base leading-7 text-slate-600">
              {{ isDepartmentHead ? 'Supervisa cargas docentes, revisa actividades y gestiona al equipo académico desde una vista clara.' : 'Consulta tus cargas actuales, revisa actividades asignadas y mantente al día con tus solicitudes docentes.' }}
            </p>
          </div>

          <div class="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p class="text-sm uppercase tracking-[0.3em] text-slate-500">Rol actual</p>
            <p class="mt-3 text-2xl font-semibold text-slate-900">{{ roleLabel }}</p>
            <p class="mt-2 text-sm text-slate-600">{{ isDepartmentHead ? 'Gestiona y supervisa' : 'Revisa y consulta' }}</p>
          </div>
        </div>
      </section>

      <div class="mt-8 grid gap-6 lg:grid-cols-2">
        <article class="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">{{ isDepartmentHead ? 'Cargas Docentes del Mes' : 'Estado de carga del mes' }}</p>

          <template v-if="isDepartmentHead">
            <h2 class="mt-3 text-2xl font-semibold text-slate-900">Resumen del departamento</h2>
            <p class="mt-4 text-sm leading-6 text-slate-600">Cargas registradas y no registradas en el mes actual.</p>

            <div class="mt-8 grid gap-4 sm:grid-cols-2">
              <div class="rounded-[1.5rem] bg-emerald-50 p-5">
                <p class="text-sm uppercase tracking-[0.3em] text-emerald-700">Registradas</p>
                <p class="mt-4 text-4xl font-semibold text-slate-900">{{ cargasRealizadasCount }}</p>
              </div>
              <div class="rounded-[1.5rem] bg-amber-50 p-5">
                <p class="text-sm uppercase tracking-[0.3em] text-amber-700">No registradas</p>
                <p class="mt-4 text-4xl font-semibold text-slate-900">{{ cargasNoRealizadasCount }}</p>
              </div>
            </div>
          </template>

          <template v-else>
            <h2 class="mt-3 text-2xl font-semibold text-slate-900">{{ cargaMesStatusTitle }}</h2>
            <p class="mt-4 text-sm leading-6 text-slate-600">{{ cargaMesStatusText }}</p>

            <div class="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div class="flex-1" />
              <span :class="['inline-flex rounded-full px-4 py-2 text-sm font-semibold', statusBadgeClass]">
                {{ cargaMesBadgeText }}
              </span>
            </div>
          </template>
        </article>

        <article class="flex h-full flex-col rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm">
          <p class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Acciones rápidas</p>
          <h2 class="mt-3 text-2xl font-semibold text-slate-900">Herramientas principales</h2>
          <p class="mt-4 text-sm leading-6 text-slate-600">Accede directamente a las acciones más comunes del sistema.</p>

          <div class="mt-8 flex flex-wrap justify-center gap-3">
            <NuxtLink
              v-for="item in toolLinks"
              :key="item.to"
              :to="item.to"
              class="inline-flex rounded-full border border-slate-200 bg-slate-100 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
            >
              {{ item.title }}
            </NuxtLink>
          </div>
        </article>
      </div>

      <section v-if="isDepartmentHead" class="mt-8 rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-slate-500">Estado general</p>
            <h2 class="mt-2 text-2xl font-semibold text-slate-900">Seguimiento del departamento</h2>
          </div>
        </div>

        <div class="mt-8 grid gap-4 md:grid-cols-3">
          <div class="rounded-[1.5rem] bg-slate-50 p-6">
            <p class="text-sm uppercase tracking-[0.35em] text-slate-500">Pendientes</p>
            <p class="mt-4 text-4xl font-semibold text-slate-900">{{ cargasPendientesCount }}</p>
            <p class="mt-3 text-sm text-slate-600">Cargas que aún esperan revisión.</p>
          </div>
          <div class="rounded-[1.5rem] bg-slate-50 p-6">
            <p class="text-sm uppercase tracking-[0.35em] text-slate-500">Aprobadas</p>
            <p class="mt-4 text-4xl font-semibold text-slate-900">{{ cargasAprobadasCount }}</p>
            <p class="mt-3 text-sm text-slate-600">Cargas revisadas y aprobadas.</p>
          </div>
          <div class="rounded-[1.5rem] bg-slate-50 p-6">
            <p class="text-sm uppercase tracking-[0.35em] text-slate-500">Rechazadas</p>
            <p class="mt-4 text-4xl font-semibold text-slate-900">{{ cargasRechazadasCount }}</p>
            <p class="mt-3 text-sm text-slate-600">Registros que han sido rechazados.</p>
          </div>
        </div>
      </section>

    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref, watch } from 'vue'

const { api, getUserFromToken, authToken } = useApi()
const currentUser = ref<any>(null)
const cargasPendientesCount = ref(0)
const cargasAprobadasCount = ref(0)
const cargasRechazadasCount = ref(0)
const cargasRealizadasCount = ref(0)
const cargasNoRealizadasCount = ref(0)
const isLoadingCounts = ref(false)
const cargaMesStatusTitle = ref('Estado de tu carga')
const cargaMesStatusText = ref('Cargando estado de carga...')
const cargaMesBadgeText = ref('Pendiente')
const statusBadgeClass = ref('bg-slate-100 text-slate-700')

const loadUser = () => {
  currentUser.value = getUserFromToken()
}

const loadDashboardCounts = async () => {
  isLoadingCounts.value = true
  const mes = String(new Date().getMonth() + 1)
  const anno = String(new Date().getFullYear())

  try {
    const [pendientesResponse, aprobadasResponse, rechazadasResponse] = await Promise.all([
      api(`/carga-docente/estado/${mes}/${anno}/pendiente`),
      api(`/carga-docente/estado/${mes}/${anno}/aceptado`),
      api(`/carga-docente/estado/${mes}/${anno}/rechazado`),
    ])

    cargasPendientesCount.value = Number(pendientesResponse?.count || 0)
    cargasAprobadasCount.value = Number(aprobadasResponse?.count || 0)
    cargasRechazadasCount.value = Number(rechazadasResponse?.count || 0)
  } catch {
    cargasPendientesCount.value = 0
    cargasAprobadasCount.value = 0
    cargasRechazadasCount.value = 0
  }

  if (isDepartmentHead.value) {
    await loadDepartamentoCargaMesCounts()
  } else {
    await loadDocenteCargaMesStatus()
  }

  isLoadingCounts.value = false
}

const loadDepartamentoCargaMesCounts = async () => {
  const mes = String(new Date().getMonth() + 1)
  const anno = String(new Date().getFullYear())
  const departamento = currentUser.value?.departamento

  if (!departamento) {
    cargasRealizadasCount.value = 0
    cargasNoRealizadasCount.value = 0
    return
  }

  try {
    const [conCargaResponse, sinCargaResponse] = await Promise.all([
      api(`/carga-docente/trabajadores-con-carga-docente/${mes}/${anno}`),
      api(`/carga-docente/trabajadores-sin-carga-docente/${mes}/${anno}`),
    ])

    cargasRealizadasCount.value = Number(conCargaResponse?.count || 0)
    cargasNoRealizadasCount.value = Array.isArray(sinCargaResponse)
      ? sinCargaResponse.length
      : Number(sinCargaResponse?.count || 0)
  } catch (error) {
    console.error('loadDepartamentoCargaMesCounts error', error)
    cargasRealizadasCount.value = 0
    cargasNoRealizadasCount.value = 0
  }
}

const loadDocenteCargaMesStatus = async () => {
  cargaMesStatusTitle.value = 'Estado de tu carga'
  cargaMesStatusText.value = 'Consultando tu carga docente del mes…'
  cargaMesBadgeText.value = 'Consultando'
  statusBadgeClass.value = 'bg-slate-100 text-slate-700'

  const mes = String(new Date().getMonth() + 1)
  const anno = String(new Date().getFullYear())
  const docenteCI = currentUser.value?.trabajadorId || currentUser.value?.id

  if (!docenteCI) {
    cargaMesStatusTitle.value = 'CI no disponible'
    cargaMesStatusText.value = 'No se pudo determinar tu CI de docente. Inicia sesión de nuevo o verifica tu perfil.'
    cargaMesBadgeText.value = 'Error'
    statusBadgeClass.value = 'bg-rose-100 text-rose-700'
    return
  }

  try {
    const response = await api(`/carga-docente/docente/fecha/${mes}/${anno}/${docenteCI}`)
    const cargas = Array.isArray(response?.rows) ? response.rows : []
    const carga = cargas[0] || null

    if (!carga) {
      cargaMesStatusTitle.value = 'Carga no registrada'
      cargaMesStatusText.value = 'Aún no has registrado tu carga docente de este mes. Completa tu carga para continuar con el proceso.'
      cargaMesBadgeText.value = 'No registrada'
      statusBadgeClass.value = 'bg-amber-100 text-amber-700'
    } else {
      const estadoCarga = String(carga.estado || '').trim().toLowerCase()

      if (estadoCarga === 'pendiente' || estadoCarga === 'pendiente_revision' || estadoCarga === 'en_revision') {
        cargaMesStatusTitle.value = 'Pendiente'
        cargaMesStatusText.value = 'Tu carga de este mes ya está registrada y aún está pendiente de revisión por el jefe de departamento.'
        cargaMesBadgeText.value = 'Pendiente'
        statusBadgeClass.value = 'bg-sky-100 text-sky-700'
      } else if (['aceptado', 'aceptada', 'aprobado', 'aprobada'].includes(estadoCarga)) {
        cargaMesStatusTitle.value = 'Aceptada'
        cargaMesStatusText.value = '¡Excelente! Tu carga docente de este mes ya fue revisada y aceptada.'
        cargaMesBadgeText.value = 'Aceptada'
        statusBadgeClass.value = 'bg-emerald-100 text-emerald-700'
      } else if (['rechazado', 'rechazada'].includes(estadoCarga)) {
        cargaMesStatusTitle.value = 'Rechazada'
        cargaMesStatusText.value = 'Tu carga de este mes fue registrada, pero fue rechazada. Revisa las observaciones y actualízala cuanto antes.'
        cargaMesBadgeText.value = 'Rechazada'
        statusBadgeClass.value = 'bg-rose-100 text-rose-700'
      } else {
        cargaMesStatusTitle.value = 'Registrada'
        cargaMesStatusText.value = `Tu carga de este mes está registrada con estado: ${carga.estado}.`
        cargaMesBadgeText.value = String(carga.estado || 'Registrada')
        statusBadgeClass.value = 'bg-slate-100 text-slate-700'
      }
    }
  } catch (error) {
    console.error('loadDocenteCargaMesStatus error', error)
    cargaMesStatusTitle.value = 'Error de consulta'
    cargaMesStatusText.value = 'No se pudo obtener el estado de tu carga mensual. Intenta nuevamente más tarde.'
    cargaMesBadgeText.value = 'Error'
    statusBadgeClass.value = 'bg-rose-100 text-rose-700'
  }
}

const personName = computed(() => currentUser.value?.nombre || currentUser.value?.nombre_usuario || 'Usuario')
const activeRole = computed(() => currentUser.value?.activeRole || currentUser.value?.role || 'docente')
const roleLabel = computed(() => {
  const role = activeRole.value
  return role === 'jefe de departamento' ? 'Jefe de Departamento' : role === 'docente' ? 'Docente' : role
})
const isDepartmentHead = computed(() => activeRole.value === 'jefe de departamento')

const toolLinks = computed(() => {
  const role = activeRole.value
  if (role === 'docente') {
    return [
      { title: 'Mis Cargas Docentes', to: '/docente/mis-cargas' },
      { title: 'Carga Docente del Mes', to: '/docente/carga-del-mes' }
    ]
  }

  return [
    { title: 'Gestionar Actividades', to: '/gestionar-actividades' },
    { title: 'Ver cargas docentes', to: '/sobrecarga-docente' }
  ]
})

onMounted(() => {
  loadUser()
  loadDashboardCounts()
})
watch(authToken, () => {
  loadUser()
  loadDashboardCounts()
})

definePageMeta({
  layout: 'default'
})
</script>
