<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 class="text-2xl font-semibold">Mis Cargas Docentes</h1>
        <p class="mt-2 text-sm text-slate-600">Visualiza las cargas registradas en meses anteriores.</p>
      </div>
      <div class="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <span class="font-semibold">Periodo activo:</span>
        {{ currentMonthName }} {{ currentYear }}
      </div>
    </div>

    <section class="mt-6 rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Cargas docentes</p>
          <p class="mt-1 text-sm text-slate-600">Filtra por mes y año para ver las cargas deseadas.</p>
        </div>
        <div class="grid w-full gap-3 sm:w-auto sm:grid-cols-2 sm:items-center">
          <input
            v-model="monthFilter"
            type="search"
            placeholder="Buscar mes"
            class="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
          <input
            v-model="yearFilter"
            type="search"
            placeholder="Buscar año"
            class="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          />
        </div>
      </div>
      <div class="mt-6">
        <div v-if="isLoading" class="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">Cargando tus cargas docentes...</div>

        <div v-else>
          <div v-if="filteredCargas.length === 0" class="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No hay cargas anteriores registradas para este docente.
          </div>

          <div v-else class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white shadow-sm">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-100 text-slate-500">
                <tr>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">#</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Mes</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Año</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Modalidad</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Total horas</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Horas sob.</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Estado</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-for="(carga, index) in filteredCargas" :key="carga.id" class="hover:bg-slate-50">
                  <td class="px-6 py-4 font-medium text-slate-900">{{ index + 1 }}</td>
                  <td class="px-6 py-4 text-slate-700">{{ formatMonth(carga.mes) }}</td>
                  <td class="px-6 py-4 text-slate-700">{{ carga.anno }}</td>
                  <td class="px-6 py-4 text-slate-700">{{ formatModalidad(carga.modalidad) }}</td>
                  <td class="px-6 py-4 text-slate-700">{{ carga.total_horas ?? '—' }}</td>
                  <td class="px-6 py-4 text-slate-700">{{ carga.horas_sobrecarga ?? '—' }}</td>
                  <td class="px-6 py-4">
                    <span :class="statusClass(carga.estado)">{{ formatEstado(carga.estado) }}</span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      type="button"
                      @click.prevent="openCargaDetails(carga)"
                      class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                      title="Ver detalles"
                      aria-label="Ver detalles"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M2.75 12s3.5-6 9.25-6 9.25 6 9.25 6-3.5 6-9.25 6S2.75 12 2.75 12Z" />
                        <circle cx="12" cy="12" r="2.75" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>

    <div v-if="isCargaDetailsModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div class="w-full max-w-3xl overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-2xl">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Detalle de carga</p>
            <h3 class="mt-2 text-xl font-semibold text-slate-900">Carga {{ formatMonth(selectedCarga?.mes) }} {{ selectedCarga?.anno }}</h3>
            <p class="mt-1 text-sm text-slate-600">Docente: {{ docenteDisplayName }}</p>
          </div>
          <button type="button" @click="closeCargaDetails" class="rounded-full p-2 text-slate-500 hover:bg-slate-100">✕</button>
        </div>

        <div class="mt-6 space-y-5">
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Total horas</p>
              <p class="mt-2 text-xl font-semibold text-slate-900">{{ displayedTotalHoras }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p class="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Horas sobrecarga</p>
              <p class="mt-2 text-xl font-semibold text-slate-900">{{ horasSobre }}</p>
            </div>
          </div>

          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Actividades</p>
            <div v-if="detailsLoading" class="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">Cargando actividades...</div>
            <div v-else class="mt-4 overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white">
              <table class="min-w-full text-left text-sm">
                <thead class="bg-slate-100 text-slate-500">
                  <tr>
                    <th class="px-4 py-3 font-semibold uppercase tracking-[0.2em]">#</th>
                    <th class="px-4 py-3 font-semibold uppercase tracking-[0.2em]">Actividad</th>
                    <th class="px-4 py-3 font-semibold uppercase tracking-[0.2em] text-right">Horas</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-200 bg-white">
                  <tr v-for="(actividad, index) in cargaActivities" :key="actividad.id" class="hover:bg-slate-50">
                    <td class="px-4 py-3 text-slate-700">{{ index + 1 }}</td>
                    <td class="px-4 py-3 text-slate-700">{{ actividad.actividad?.nombre || 'Sin nombre' }}</td>
                    <td class="px-4 py-3 text-right text-slate-700">{{ actividad.horas ?? 0 }}</td>
                  </tr>
                  <tr v-if="cargaActivities.length === 0">
                    <td colspan="3" class="px-4 py-4 text-sm text-slate-600">No hay actividades asociadas a esta carga.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="closeCargaDetails" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const { api, getUserFromToken } = useApi()
const { showError } = useNotifications()
const currentUser = ref<any>(null)
const cargas = ref<any[]>([])
const monthFilter = ref('')
const yearFilter = ref('')
const selectedCarga = ref<any | null>(null)
const cargaActivities = ref<any[]>([])
const isCargaDetailsModalOpen = ref(false)
const detailsLoading = ref(false)
const detailsError = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const loadUser = () => {
  currentUser.value = getUserFromToken()
}

const currentMonth = new Date().getMonth() + 1
const currentYear = new Date().getFullYear()
const currentMonthName = computed(() => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[currentMonth - 1]
})

const docenteDisplayName = computed(() => {
  if (currentUser.value?.nombre) return currentUser.value.nombre
  if (currentUser.value?.nombre_usuario) return currentUser.value.nombre_usuario
  return selectedCarga.value?.docenteCI || '—'
})

const formatMonth = (mes: string | number) => {
  const monthIndex = Number(mes) - 1
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[monthIndex] || String(mes)
}

const formatModalidad = (value: boolean | null) => {
  return value ? 'Presencial' : 'Virtual'
}

const formatEstado = (estado: string) => {
  if (estado === 'aceptado') return 'Aceptado'
  if (estado === 'rechazado') return 'Rechazado'
  return 'Pendiente'
}

const statusClass = (estado: string) => {
  if (estado === 'aceptado') return 'inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700'
  if (estado === 'rechazado') return 'inline-flex rounded-full bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700'
  return 'inline-flex rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-700'
}

const displayedTotalHoras = computed(() => {
  const total = cargaActivities.value.reduce((sum, item) => sum + (Number(item.horas) || 0), 0)
  return Math.min(total, 114)
})

const horasSobre = computed(() => {
  return selectedCarga.value?.horas_sobrecarga ?? 0
})

const filteredCargas = computed(() => {
  const monthTerm = monthFilter.value.trim().toLowerCase()
  const yearTerm = yearFilter.value.trim().toLowerCase()
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre']

  return cargas.value
    .filter((carga) => {
      const cargaMes = String(carga.mes || '').toLowerCase()
      const cargaAnno = String(carga.anno || '').toLowerCase()
      const cargaMesNombre = months[Number(carga.mes) - 1] || ''

      const matchesMonth = !monthTerm || (
        cargaMes.includes(monthTerm) ||
        cargaMesNombre.includes(monthTerm)
      )
      const matchesYear = !yearTerm || cargaAnno.includes(yearTerm)
      return matchesMonth && matchesYear
    })
    .sort((a, b) => {
      if (a.anno !== b.anno) return b.anno - a.anno
      return Number(b.mes) - Number(a.mes)
    })
})

const cargarCargas = async () => {
  loadUser()
  if (!currentUser.value?.id && !currentUser.value?.trabajadorId) {
    errorMessage.value = 'No se pudo obtener el identificador del docente.'
    showError(errorMessage.value)
    return
  }

  const docenteCI = currentUser.value.id || currentUser.value.trabajadorId
  if (!docenteCI) {
    errorMessage.value = 'No se pudo obtener el CI del docente.'
    showError(errorMessage.value)
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api(`/carga-docente/docente/${docenteCI}`)
    cargas.value = Array.isArray(response?.rows) ? response.rows : []
  } catch (error) {
    errorMessage.value = 'No se pudieron cargar las cargas docentes desde el backend.'
    showError(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const openCargaDetails = async (carga: any) => {
  selectedCarga.value = carga
  isCargaDetailsModalOpen.value = true
  detailsLoading.value = true
  detailsError.value = ''
  cargaActivities.value = []

  try {
    const response = await api(`/carga-docente-actividad/${carga.id}`)
    cargaActivities.value = Array.isArray(response?.rows) ? response.rows : []
  } catch (error) {
    detailsError.value = 'No se pudieron cargar las actividades de esta carga.'
    showError(detailsError.value)
  } finally {
    detailsLoading.value = false
  }
}

const closeCargaDetails = () => {
  isCargaDetailsModalOpen.value = false
  selectedCarga.value = null
  cargaActivities.value = []
  detailsError.value = ''
}

onMounted(cargarCargas)

definePageMeta({ layout: 'default' })
</script>
