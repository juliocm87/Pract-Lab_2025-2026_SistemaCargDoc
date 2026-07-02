<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    <div class="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
      <section class="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_50px_-20px_rgba(15,23,42,0.15)]">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Carga docente</p>
            <h1 class="mt-3 text-3xl font-semibold text-slate-900">Gestionar cargas docentes</h1>
            <p class="mt-2 text-sm text-slate-600">{{ departamentoTexto }}</p>
          </div>
          <div class="rounded-full border border-slate-200 bg-white px-5 py-3 shadow-sm">
            <p class="text-xs uppercase tracking-[0.35em] text-slate-500">Periodo actual</p>
            <p class="mt-1 text-sm font-semibold text-slate-900">{{ getCurrentMonth() }} {{ getCurrentYear() }}</p>
          </div>
        </div>

        <div class="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Centro de control</p>
              <p class="mt-2 text-sm text-slate-600">Revisa las cargas docentes registradas este mes.</p>
            </div>
            <div class="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input
                v-model="searchTerm"
                type="search"
                placeholder="Buscar trabajador"
                class="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
              <select
                v-model="estadoFiltro"
                class="rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100"
              >
                <option value="">Todos los estados</option>
                <option value="Revisada">Revisada</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Rechazada">Rechazada</option>
              </select>
            </div>
          </div>

          <div class="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <table class="min-w-full text-left text-sm">
              <thead class="bg-slate-100 text-slate-500">
                <tr>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Trabajador</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Estado</th>
                  <th class="px-6 py-4 text-right font-semibold uppercase tracking-[0.2em]">Acción</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-for="trabajador in trabajadoresFiltrados" :key="trabajador.id" class="hover:bg-slate-50">
                  <td class="px-6 py-4 font-medium text-slate-900">{{ trabajador.nombre }}</td>
                  <td class="px-6 py-4">
                    <span :class="['rounded-full px-3 py-1 text-xs font-semibold', trabajador.estado === 'Revisada' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700']">
                      {{ trabajador.estado }}
                    </span>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <button
                      type="button"
                      class="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-blue-600 hover:text-white"
                    >
                      Revisar
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'

definePageMeta({
  layout: 'default'
})

const { api, getUserFromToken } = useApi()
const { showError } = useNotifications()
const trabajadores = ref<any[]>([])
const estadoFiltro = ref('')
const searchTerm = ref('')
const isLoading = ref(false)
const errorMessage = ref('')
const currentUser = ref<any>(null)

const formatEstado = (estado: string) => {
  if (estado === 'aceptado') return 'Revisada'
  if (estado === 'rechazado') return 'Rechazada'
  return 'Pendiente'
}

const cargarTrabajadores = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const mes = String(new Date().getMonth() + 1)
    const anno = String(new Date().getFullYear())
    const response = await api(`/carga-docente/trabajadores-con-carga-docente/${mes}/${anno}`)
    const rows = Array.isArray(response?.rows) ? response.rows : []

    trabajadores.value = rows.map((item: any) => {
      const trabajador = item.docente?.trabajador || item.docente?.trabajadore
      const nombreCompleto = [trabajador?.nombre, trabajador?.apellido].filter(Boolean).join(' ')
      return {
        id: item.id,
        nombre: nombreCompleto || 'Sin nombre',
        estado: formatEstado(item.estado)
      }
    })
  } catch (error) {
    errorMessage.value = 'No se pudieron cargar las cargas docentes desde el backend.'
    showError(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const trabajadoresFiltrados = computed(() => {
  const term = searchTerm.value.toLowerCase()

  return trabajadores.value.filter((trabajador) => {
    const matchesStatus = !estadoFiltro.value || trabajador.estado === estadoFiltro.value
    const matchesSearch = !term || trabajador.nombre.toLowerCase().includes(term)
    return matchesStatus && matchesSearch
  })
})

onMounted(() => {
  currentUser.value = getUserFromToken()
  cargarTrabajadores()
})

const departamentoTexto = computed(() => {
  const departamento = currentUser.value?.departamento || currentUser.value?.docente?.departamento
  if (!departamento) return 'Sin departamento asignado'
  return departamento.startsWith('Departamento de') ? departamento : `Departamento de ${departamento}`
})

const getCurrentMonth = () => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']
  return months[new Date().getMonth()]
}

const getCurrentYear = () => new Date().getFullYear()
</script>
