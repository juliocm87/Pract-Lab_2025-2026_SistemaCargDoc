<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    <div class="mx-auto max-w-6xl px-4 pt-6 sm:px-6 lg:px-8">
      <section class="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_50px_-20px_rgba(15,23,42,0.15)]">
        <div class="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Actividades</p>
            <h1 class="mt-3 text-3xl font-semibold text-slate-900">Gestionar actividades</h1>
          </div>
          <button
            type="button"
            @click="openCreateModal"
            class="inline-flex items-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow transition hover:bg-blue-700"
          >
            Nueva actividad
          </button>
        </div>

        <div class="mt-8 rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
          <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p class="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Centro de control</p>
              <p class="mt-2 text-sm text-slate-600">Visualiza nombres y acciones de las actividades.</p>
            </div>
            <div class="flex items-center gap-2">
              <input
                type="search"
                placeholder="Buscar actividad"
                class="w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-100 sm:w-72"
              />
            </div>
          </div>

          <div class="mt-6 overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white">
            <table class="min-w-full text-left text-sm table-fixed">
              <colgroup>
                <col style="width:8%">
                <col style="width:30%">
                <col style="width:52%">
                <col style="width:10%">
              </colgroup>
              <thead class="bg-slate-100 text-slate-500">
                <tr>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">N°</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Nombre</th>
                  <th class="px-6 py-4 font-semibold uppercase tracking-[0.2em]">Descripción</th>
                  <th class="px-6 py-4 text-right font-semibold uppercase tracking-[0.2em]">Acciones</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-200 bg-white">
                <tr v-for="actividad in actividades" :key="actividad.id" class="hover:bg-slate-50">
                  <td class="px-6 py-4 font-medium text-slate-900">{{ actividad.id }}</td>
                  <td class="px-6 py-4 font-medium text-slate-900">{{ actividad.nombre }}</td>
                  <td class="px-6 py-4 text-slate-600">
                    <div :style="expandedId !== actividad.id ? clampStyle : {}" class="whitespace-pre-wrap break-words" >
                      {{ actividad.descripcion }}
                    </div>
                    <button v-if="actividad.descripcion && actividad.descripcion.length > 260" @click="toggleExpand(actividad.id)" class="mt-2 text-xs text-blue-600 hover:underline">
                      {{ expandedId === actividad.id ? 'Ver menos' : 'Ver más' }}
                    </button>
                  </td>
                  <td class="px-6 py-4 text-right">
                    <div class="flex justify-end gap-2">
                      <button
                        type="button"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-50 text-red-600 transition hover:bg-red-100"
                        title="Eliminar actividad"
                        aria-label="Eliminar actividad"
                        @click="eliminarActividad(actividad)"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M6 7h12m-9 0V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2m-7 0h10m-1 0v10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2V7" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click.prevent="openViewModal(actividad)"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200"
                        title="Ver detalles"
                        aria-label="Ver detalles"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="M2.75 12s3.5-6 9.25-6 9.25 6 9.25 6-3.5 6-9.25 6S2.75 12 2.75 12Z" />
                          <circle cx="12" cy="12" r="2.75" />
                        </svg>
                      </button>
                      <button
                        type="button"
                        @click.prevent="openEditModal(actividad)"
                        class="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                        title="Editar actividad"
                        aria-label="Editar actividad"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
                          <path stroke-linecap="round" stroke-linejoin="round" d="m16.5 3.5 4 4L8.25 19.75 3 21l1.25-5.25L16.5 3.5Z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>

    <div v-if="isCreateModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div class="w-full max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-2xl">
        <div class="flex items-start justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Nueva actividad</p>
            <h2 class="mt-2 text-2xl font-semibold text-slate-900">Crear actividad</h2>
          </div>
          <button type="button" @click="closeCreateModal" class="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-700">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8">
              <path stroke-linecap="round" stroke-linejoin="round" d="M6 6l12 12M18 6 6 18" />
            </svg>
          </button>
        </div>

        <form @submit.prevent="submitNuevaActividad" class="mt-8 space-y-6">
          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label for="numero-actividad" class="mb-2 block text-sm font-semibold text-slate-700">Número</label>
              <input
                id="numero-actividad"
                v-model="newActividad.numero"
                type="number"
                min="1"
                required
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                placeholder="Ej. 10"
              />
            </div>
            <div>
              <label for="nombre-actividad" class="mb-2 block text-sm font-semibold text-slate-700">Nombre</label>
              <input
                id="nombre-actividad"
                v-model="newActividad.nombre"
                type="text"
                required
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                placeholder="Ej. Tutoría académica"
              />
            </div>
          </div>

          <div>
            <label for="descripcion-actividad" class="mb-2 block text-sm font-semibold text-slate-700">Descripción</label>
            <textarea
              id="descripcion-actividad"
              v-model="newActividad.descripcion"
              rows="5"
              required
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="Describe la actividad"
            />
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <button type="button" @click="closeCreateModal" class="rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Cancelar
            </button>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              <span v-if="isSubmitting">Guardando...</span>
              <span v-else>Guardar actividad</span>
            </button>
          </div>
        </form>
      </div>
    </div>
    
    <!-- View details modal -->
    <div v-if="isViewModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div class="w-full max-w-lg rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-2xl">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Detalles</p>
            <h3 class="mt-2 text-xl font-semibold text-slate-900">Actividad #{{ viewActividad?.numero || viewActividad?.id }}</h3>
          </div>
          <button type="button" @click="isViewModalOpen = false" class="rounded-full p-2 text-slate-500 hover:bg-slate-100">
            ✕
          </button>
        </div>

        <div class="mt-4 space-y-3">
          <p><strong>Nombre:</strong> {{ viewActividad?.nombre }}</p>
          <p><strong>Descripción:</strong></p>
          <div class="whitespace-pre-wrap rounded-md border border-slate-100 p-3 text-sm text-slate-700">{{ viewActividad?.descripcion }}</div>
        </div>

        <div class="mt-6 flex justify-end">
          <button @click="isViewModalOpen = false" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100">Cerrar</button>
        </div>
      </div>
    </div>

    <!-- Edit modal -->
    <div v-if="isEditModalOpen" class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4">
      <div class="w-full max-w-lg rounded-[1.25rem] border border-slate-200 bg-white p-6 shadow-2xl">
        <div class="flex items-start justify-between">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Editar actividad</p>
            <h3 class="mt-2 text-xl font-semibold text-slate-900">Actividad #{{ editActividad?.numero || editActividad?.id }}</h3>
          </div>
          <button type="button" @click="isEditModalOpen = false" class="rounded-full p-2 text-slate-500 hover:bg-slate-100">✕</button>
        </div>

        <form @submit.prevent="submitEditarActividad" class="mt-6 space-y-4">
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Nombre</label>
            <input v-model="editForm.nombre" type="text" required class="w-full rounded-2xl border border-slate-200 px-4 py-2" />
          </div>
          <div>
            <label class="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
            <textarea v-model="editForm.descripcion" rows="5" class="w-full rounded-2xl border border-slate-200 px-4 py-2"></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button type="button" @click="isEditModalOpen = false" class="rounded-full border border-slate-200 px-4 py-2 text-sm">Cancelar</button>
            <button type="submit" :disabled="isSubmittingEdit" class="rounded-full bg-blue-600 px-4 py-2 text-sm text-white">Guardar</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

const { api } = useApi()
const { showError, showSuccess } = useNotifications()
const actividades = ref<any[]>([])
const isLoading = ref(false)
const errorMessage = ref('')
const isCreateModalOpen = ref(false)
const isSubmitting = ref(false)
const formError = ref('')
const formSuccess = ref('')
const newActividad = ref({ numero: '', nombre: '', descripcion: '' })

const truncate = (text: string | null | undefined, length = 100) => {
  if (!text) return ''
  return text.length > length ? text.slice(0, length) + '…' : text
}
const expandedId = ref<number | null>(null)
const clampStyle = {
  display: '-webkit-box',
  WebkitLineClamp: '3',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  overflowWrap: 'anywhere',
  wordBreak: 'break-word'
}

const toggleExpand = (id: number | string | undefined) => {
  const num = typeof id === 'string' ? Number(id) : id
  expandedId.value = expandedId.value === num ? null : num
}

const cargarActividades = async () => {
  isLoading.value = true
  errorMessage.value = ''

  try {
    const response = await api('/actividades')
    const items = Array.isArray(response) ? response : []

    actividades.value = items.map((item: any) => ({
      id: item.numero ?? item.id,
      numero: item.numero ?? item.id,
      nombre: item.nombre ?? 'Sin nombre',
      descripcion: item.descripcion ?? ''
    }))
  } catch (error) {
    errorMessage.value = 'No se pudieron cargar las actividades desde el backend.'
    showError(errorMessage.value)
  } finally {
    isLoading.value = false
  }
}

const openCreateModal = () => {
  isCreateModalOpen.value = true
  formError.value = ''
  formSuccess.value = ''
  newActividad.value = { numero: '', nombre: '', descripcion: '' }
}

const closeCreateModal = () => {
  isCreateModalOpen.value = false
  formError.value = ''
  formSuccess.value = ''
}

const submitNuevaActividad = async () => {
  if (!newActividad.value.numero || !newActividad.value.nombre.trim() || !newActividad.value.descripcion.trim()) {
    formError.value = 'Completa todos los campos para continuar.'
    return
  }

  isSubmitting.value = true
  formError.value = ''
  formSuccess.value = ''

  try {
    await api('/actividades/create', {
      method: 'POST',
      body: {
        numero: Number(newActividad.value.numero),
        nombre: newActividad.value.nombre.trim(),
        descripcion: newActividad.value.descripcion.trim()
      }
    })

    formSuccess.value = 'Actividad creada correctamente.'
    showSuccess(formSuccess.value)
    await cargarActividades()
    closeCreateModal()
  } catch (error: any) {
    const message = error?.data?.message || error?.message || 'No se pudo crear la actividad.'
    formError.value = message
    showError(message)
  } finally {
    isSubmitting.value = false
  }
}

const eliminarActividad = async (actividad: any) => {
  const id = actividad.numero ?? actividad.id
  if (!id) return

  try {
    await api(`/actividades/delete/${id}`, { method: 'DELETE' })
    actividades.value = actividades.value.filter((item) => (item.numero ?? item.id) !== id)
  } catch (error) {
    errorMessage.value = 'No se pudo eliminar la actividad.'
    showError(errorMessage.value)
  }
}

// View/Edit modal state
const isViewModalOpen = ref(false)
const viewActividad = ref<any | null>(null)
const isEditModalOpen = ref(false)
const editActividad = ref<any | null>(null)
const editForm = ref({ nombre: '', descripcion: '' })
const isSubmittingEdit = ref(false)

const openViewModal = (actividad: any) => {
  viewActividad.value = actividad
  isViewModalOpen.value = true
}

const openEditModal = (actividad: any) => {
  editActividad.value = actividad
  editForm.value = { nombre: actividad.nombre || '', descripcion: actividad.descripcion || '' }
  isEditModalOpen.value = true
}

const submitEditarActividad = async () => {
  if (!editActividad.value) return
  isSubmittingEdit.value = true
  try {
    await api(`/actividades/update/${editActividad.value.numero ?? editActividad.value.id}`, {
      method: 'PUT',
      body: {
        nombre: editForm.value.nombre,
        descripcion: editForm.value.descripcion
      }
    })
    await cargarActividades()
    isEditModalOpen.value = false
  } catch (e) {
    console.error(e)
    showError('No se pudo actualizar la actividad')
  } finally {
    isSubmittingEdit.value = false
  }
}

onMounted(cargarActividades)

definePageMeta({
  layout: 'default'
})
</script>
