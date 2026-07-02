<template>
  <div class="min-h-screen bg-slate-50 pb-12">
    <div class="mx-auto max-w-3xl px-4 pt-6 sm:px-6 lg:px-8">
      <section class="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_25px_50px_-20px_rgba(15,23,42,0.15)]">
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-sm uppercase tracking-[0.35em] text-slate-400">Actividades</p>
            <h1 class="mt-3 text-3xl font-semibold text-slate-900">Nueva actividad</h1>
            <p class="mt-3 text-sm leading-6 text-slate-600">Completa los datos para registrar una nueva actividad en la base de datos.</p>
          </div>
          <NuxtLink to="/gestionar-actividades" class="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
            Volver
          </NuxtLink>
        </div>

        <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
          <div class="grid gap-6 md:grid-cols-2">
            <div>
              <label for="numero" class="mb-2 block text-sm font-semibold text-slate-700">Número</label>
              <input
                id="numero"
                v-model="form.numero"
                type="number"
                min="1"
                required
                :disabled="isSubmitting"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                placeholder="Ej. 10"
              />
            </div>

            <div>
              <label for="nombre" class="mb-2 block text-sm font-semibold text-slate-700">Nombre</label>
              <input
                id="nombre"
                v-model="form.nombre"
                type="text"
                required
                :disabled="isSubmitting"
                class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
                placeholder="Ej. Tutoría académica"
              />
            </div>
          </div>

          <div>
            <label for="descripcion" class="mb-2 block text-sm font-semibold text-slate-700">Descripción</label>
            <textarea
              id="descripcion"
              v-model="form.descripcion"
              rows="5"
              required
              :disabled="isSubmitting"
              class="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-blue-500 focus:bg-white"
              placeholder="Describe la actividad"
            />
          </div>

          <div class="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:justify-end">
            <NuxtLink to="/gestionar-actividades" class="inline-flex items-center justify-center rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100">
              Cancelar
            </NuxtLink>
            <button
              type="submit"
              :disabled="isSubmitting"
              class="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-300"
            >
              <span v-if="isSubmitting">Guardando...</span>
              <span v-else>Guardar actividad</span>
            </button>
          </div>
        </form>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const router = useRouter()
const { api } = useApi()
const { showError, showSuccess } = useNotifications()

const form = ref({
  numero: '',
  nombre: '',
  descripcion: ''
})
const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

const handleSubmit = async () => {
  if (!form.value.numero || !form.value.nombre.trim() || !form.value.descripcion.trim()) {
    errorMessage.value = 'Completa todos los campos para continuar.'
    return
  }

  isSubmitting.value = true
  errorMessage.value = ''
  successMessage.value = ''

  try {
    await api('/actividades/create', {
      method: 'POST',
      body: {
        numero: Number(form.value.numero),
        nombre: form.value.nombre.trim(),
        descripcion: form.value.descripcion.trim()
      }
    })

    successMessage.value = 'Actividad creada correctamente.'
    showSuccess(successMessage.value)
    form.value = { numero: '', nombre: '', descripcion: '' }
    router.push('/gestionar-actividades')
  } catch (error: any) {
    const message = error?.data?.message || error?.message || 'No se pudo crear la actividad.'
    errorMessage.value = message
    showError(message)
  } finally {
    isSubmitting.value = false
  }
}

definePageMeta({
  layout: 'default'
})
</script>
