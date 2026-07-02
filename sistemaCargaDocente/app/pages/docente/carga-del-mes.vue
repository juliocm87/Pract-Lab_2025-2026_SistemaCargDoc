<template>
  <div>
    <div class="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <h1 class="text-2xl font-semibold">Carga Docente del Mes</h1>
        <label class="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
          <span class="font-medium">Modalidad</span>
          <select
            v-model="modalidadSeleccionada"
            @change="cambiarModalidad"
            class="rounded-full border border-slate-200 bg-white px-3 py-1 text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
          >
            <option :value="true">Presencial</option>
            <option :value="false">Virtual</option>
          </select>
        </label>
      </div>
      <div class="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
        <span class="font-semibold">Periodo actual:</span>
        {{ currentMonthName }} {{ currentYear }}
      </div>
    </div>

    <section class="mt-6 grid gap-6 md:grid-cols-[1.6fr_1fr]">
      <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Actividades</p>
            <p class="mt-1 text-sm text-slate-600">Selecciona una actividad para ver más detalles.</p>
          </div>
          <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Buscar actividad"
              class="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-72"
            />
          </div>
        </div>

        <div class="mt-6">
          <div v-if="isLoading" class="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            Cargando actividades de la carga docente...
          </div>

          <div v-if="filteredActivities.length === 0" class="rounded-3xl border border-slate-200 bg-slate-50 p-6 text-sm text-slate-600">
            No hay actividades registradas en la base de datos.
          </div>

          <div v-if="filteredActivities.length > 0" class="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-100 text-slate-500">
                <tr>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">#</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Actividad</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em] text-right">Horas</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr
                  v-for="(item, index) in filteredActivities"
                  :key="item.id"
                  @click="selectActivity(item)"
                  class="cursor-pointer hover:bg-slate-50"
                  :class="item.id === selectedActivity?.id ? 'bg-blue-50' : ''"
                >
                  <td class="px-6 py-4 font-medium text-slate-900">{{ item.actividad?.numero ?? index + 1 }}</td>
                  <td class="px-6 py-4 text-slate-700">{{ item.actividad?.nombre || 'Sin nombre' }}</td>
                  <td class="px-6 py-4 text-right">
                    <input
                      v-model.number="item.horas"
                      @click.stop="selectActivity(item)"
                      @blur="saveHoras(item)"
                      @keydown.enter.prevent="saveHoras(item)"
                      type="number"
                      min="0"
                      class="w-20 rounded border border-slate-300 bg-slate-50 px-2 py-1 text-center text-sm text-slate-900 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div class="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
        <div class="mb-4 flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Detalle de actividad</p>
          </div>
        </div>

        <div v-if="!selectedActivity" class="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
          Selecciona una actividad para ver sus detalles.
        </div>

        <div v-else class="space-y-3">
          <div class="grid gap-3 md:grid-cols-[1fr_0.9fr]">
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Número</p>
              <p class="mt-1 text-lg font-semibold text-slate-900">{{ selectedActivity.actividad?.numero ?? '—' }}</p>
            </div>
            <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
              <p class="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Horas</p>
              <p class="mt-1 text-lg font-semibold text-slate-900">{{ selectedActivity.horas ?? '0' }}</p>
            </div>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p class="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Nombre</p>
            <p class="mt-1 text-base font-semibold text-slate-900">{{ selectedActivity.actividad?.nombre || 'Sin nombre' }}</p>
          </div>
          <div class="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <p class="text-[0.65rem] uppercase tracking-[0.35em] text-slate-500">Descripción</p>
            <p class="mt-1 text-sm leading-5 text-slate-700">{{ selectedActivity.actividad?.descripcion || 'No hay descripción disponible.' }}</p>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

const { api, getUserFromToken, getAuthHeaders } = useApi()
const { showSuccess, showError, showInfo } = useNotifications()
const currentUser = ref<any>(null)
const cargaActual = ref<any | null>(null)
const activities = ref<any[]>([])
const modalidadSeleccionada = ref(true)
const selectedActivity = ref<any | null>(null)
const searchTerm = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

const currentMonth = new Date().getMonth() + 1
const currentYear = new Date().getFullYear()
const currentMonthName = computed(() => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[currentMonth - 1]
})

const loadUser = () => {
  currentUser.value = getUserFromToken()
}

const formatMonth = (mes: string | number) => {
  const monthIndex = Number(mes) - 1
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[monthIndex] || String(mes)
}

const infoMessage = ref('')

const loadCurrentCarga = async () => {
  loadUser()
  const docenteCI = currentUser.value?.id || currentUser.value?.trabajadorId
  if (!docenteCI) {
    errorMessage.value = 'No se pudo obtener el CI del docente.'
    return
  }

  isLoading.value = true
  errorMessage.value = ''
  infoMessage.value = ''

  try {
    const response = await api(`/carga-docente/docente/fecha/${String(currentMonth)}/${String(currentYear)}/${docenteCI}`)
    const cargas = Array.isArray(response?.rows) ? response.rows : []
    let currentCarga = cargas[0] || null

    if (!currentCarga) {
      const createResponse = await api('/carga-docente/create-con-actividades', {
        method: 'POST',
        body: {
          docenteCI,
          anno: currentYear,
          mes: String(currentMonth),
          estado: 'pendiente',
          modalidad: true,
          total_horas: 0,
          horas_sobrecarga: 0,
        },
        headers: getAuthHeaders()
      })
      currentCarga = createResponse
      infoMessage.value = '¡Carga del mes creada exitosamente!'
      showSuccess('¡Carga del mes creada exitosamente!')
    }

    if (currentCarga?.modalidad !== undefined) {
      modalidadSeleccionada.value = Boolean(currentCarga.modalidad)
    }

    cargaActual.value = currentCarga || null
  } catch (error) {
    console.error('loadCurrentCarga error', error)
    const err = error && typeof error === 'object' ? error : {}
    const message = err?.data?.message || err?.message || 'No se pudo cargar o crear la carga docente del mes actual.'
    const friendlyMessage = message === 'Necesita iniciar sesión'
      ? 'Necesita iniciar sesión de nuevo para crear la carga del mes.'
      : message
    errorMessage.value = friendlyMessage
    showError(friendlyMessage)
  } finally {
    isLoading.value = false
  }
}

const loadActivities = async () => {
  if (!cargaActual.value?.id) {
    activities.value = []
    selectedActivity.value = null
    return
  }

  isLoading.value = true
  errorMessage.value = ''

  try {
    let response = await api(`/carga-docente-actividad/${cargaActual.value.id}`)
    let rows = Array.isArray(response?.rows) ? response.rows : []

    if (rows.length === 0 && cargaActual.value?.docenteCI) {
      await api('/carga-docente/create-con-actividades', {
        method: 'POST',
        body: {
          docenteCI: cargaActual.value.docenteCI,
          anno: cargaActual.value.anno,
          mes: cargaActual.value.mes,
          estado: cargaActual.value.estado || 'pendiente',
          modalidad: cargaActual.value.modalidad ?? false,
          total_horas: cargaActual.value.total_horas ?? 0,
          horas_sobrecarga: cargaActual.value.horas_sobrecarga ?? 0,
        },
        headers: getAuthHeaders()
      })
      response = await api(`/carga-docente-actividad/${cargaActual.value.id}`)
      rows = Array.isArray(response?.rows) ? response.rows : []
    }

    rows.sort((a: any, b: any) => {
      const aNumero = Number(a.actividad?.numero ?? a.actividadId)
      const bNumero = Number(b.actividad?.numero ?? b.actividadId)
      return aNumero - bNumero
    })

    activities.value = rows.map((item: any) => ({
      id: item.id,
      actividadId: item.actividadId,
      actividad: {
        numero: item.actividad?.numero || item.actividadId,
        nombre: item.actividad?.nombre || '',
        descripcion: item.actividad?.descripcion || ''
      },
      horas: item.horas ?? 0,
      cargaDocenteId: item.cargaDocenteId
    }))
    selectedActivity.value = activities.value[0] || null
  } catch (error) {
    const friendlyMessage = 'No se pudieron cargar las actividades de la carga docente.'
    errorMessage.value = friendlyMessage
    showError(friendlyMessage)
  } finally {
    isLoading.value = false
  }
}

const filteredActivities = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return activities.value

  return activities.value.filter((item) => {
    const nombre = item.actividad?.nombre?.toLowerCase() || ''
    const numero = String(item.actividad?.numero || '')
    return nombre.includes(term) || numero.includes(term) || String(item.horas).includes(term)
  })
})

const saveHoras = async (item: any) => {
  errorMessage.value = ''
  infoMessage.value = ''

  const newHoras = Number(item.horas)
  if (Number.isNaN(newHoras) || newHoras < 0) {
    item.horas = 0
    return
  }

  if (!item?.id || !cargaActual.value?.id) {
    errorMessage.value = 'No se pudo actualizar las horas: falta la carga o la actividad.'
    return
  }

  try {
    await api(`/carga-docente-actividad/update/${item.id}`, {
      method: 'PUT',
      body: {
        horas: newHoras,
      }
    })

    if (selectedActivity.value?.id === item.id) {
      selectedActivity.value.horas = newHoras
    }
  } catch (error: any) {
    console.error('saveHoras error', error)
    const message = error?.data?.message || error?.message || JSON.stringify(error)
    const friendlyMessage = message || 'No se pudo actualizar las horas. Intenta nuevamente.'
    errorMessage.value = friendlyMessage
    showError(friendlyMessage)
  }
}

const cambiarModalidad = async () => {
  if (!cargaActual.value?.id) return

  try {
    await api(`/carga-docente/update/${cargaActual.value.id}`, {
      method: 'PUT',
      body: {
        docenteCI: cargaActual.value.docenteCI,
        anno: cargaActual.value.anno,
        mes: cargaActual.value.mes,
        estado: cargaActual.value.estado || 'pendiente',
        modalidad: modalidadSeleccionada.value,
        total_horas: cargaActual.value.total_horas ?? 0,
        horas_sobrecarga: cargaActual.value.horas_sobrecarga ?? 0,
      },
      headers: getAuthHeaders()
    })

    cargaActual.value.modalidad = modalidadSeleccionada.value
    infoMessage.value = `Modalidad actualizada a ${modalidadSeleccionada.value ? 'Presencial' : 'Virtual'}.`
    showSuccess(infoMessage.value)
  } catch (error) {
    console.error('cambiarModalidad error', error)
    errorMessage.value = 'No se pudo cambiar la modalidad de la carga docente.'
    showError(errorMessage.value)
  }
}

const selectActivity = (item: any) => {
  selectedActivity.value = item
}

onMounted(async () => {
  await loadCurrentCarga()
  await loadActivities()
})

definePageMeta({ layout: 'default' })
</script>
