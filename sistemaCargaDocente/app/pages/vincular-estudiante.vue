<template>
  <div class="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Vincular Estudiante</h1>
        <p class="text-gray-600">Gestiona la vinculación de estudiantes con el profesor</p>
      </div>

      <!-- Información del profesor loggeado -->
      <div class="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <div class="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center">
              <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 10a4 4 0 100-8 4 4 0 000 8zM2 18a8 8 0 1116 0H2z" />
              </svg>
            </div>
            <div>
              <h2 class="text-2xl font-bold text-gray-900">{{ profesorActual.nombre }}</h2>
              <p class="text-gray-600">{{ profesorActual.titulo }}</p>
              <p class="text-sm text-gray-500">{{ profesorActual.departamento }}</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-gray-600">Estudiantes vinculados</p>
            <p class="text-3xl font-bold text-green-600">{{ vinculos.length }}</p>
          </div>
        </div>
      </div>

      <!-- Botón para vincular nuevo estudiante -->
      <div class="mb-8">
        <button @click="showForm = true"
          class="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300 flex items-center gap-2">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
          </svg>
          Vincular Nuevo Estudiante
        </button>
      </div>

      <!-- Tabla de vínculos -->
      <div class="bg-white rounded-lg shadow-lg overflow-hidden">
        <table class="w-full">
          <thead class="bg-green-600 text-white">
            <tr>
              <th class="px-6 py-3 text-left text-sm font-semibold">Estudiante</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Cédula</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Tipo de Tutoría</th>
              <th class="px-6 py-3 text-left text-sm font-semibold">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="vinculos.length === 0" class="border-b">
              <td colspan="5" class="px-6 py-8 text-center text-gray-500">
                No hay estudiantes vinculados. Crea uno nuevo para comenzar.
              </td>
            </tr>
            <tr v-for="vinculo in vinculos" :key="vinculo.id" class="border-b hover:bg-gray-50">
              <td class="px-6 py-4 text-sm text-gray-900 font-semibold">{{ vinculo.estudiante }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ vinculo.cedula }}</td>
              <td class="px-6 py-4 text-sm text-gray-900">{{ vinculo.tipoTutoria }}</td>
              <td class="px-6 py-4 text-sm">
                <button @click="editVinculo(vinculo)"
                  class="text-blue-600 hover:text-blue-900 mr-4">Editar</button>
                <button @click="deleteVinculo(vinculo.id)"
                  class="text-red-600 hover:text-red-900">Eliminar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Modal para crear/editar vínculo -->
      <div v-if="showForm" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-40">
        <div class="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
          <h2 class="text-2xl font-bold text-gray-900 mb-6">
            {{ editingId ? 'Editar Vínculo' : 'Vincular Nuevo Estudiante' }}
          </h2>
          
          <form @submit.prevent="saveVinculo">
            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Profesor Responsable</label>
              <input v-model="formData.profesor" type="text" disabled
                class="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100 cursor-not-allowed" />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Nombre del Estudiante</label>
              <input v-model="formData.estudiante" type="text"
                @input="formData.estudiante = formData.estudiante.replace(/[^a-záéíóúàèìòùâêîôûäëïöüñ\s]/gi, '')"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Nombre completo" required />
            </div>

            <div class="mb-4">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Cédula del Estudiante</label>
              <input v-model="formData.cedula" type="text"
                @input="formData.cedula = formData.cedula.replace(/[^0-9]/g, '')"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Número de cédula" required />
            </div>

            <div class="mb-6">
              <label class="block text-sm font-semibold text-gray-700 mb-2">Tipo de Tutoría</label>
              <select v-model="formData.tipoTutoria"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500" required>
                <option value="">Selecciona un tipo de tutoría</option>
                <option value="Tutoría de práctica preprofesional">Tutoría de práctica preprofesional</option>
                <option value="Tutoría de trabajos de cursos">Tutoría de trabajos de cursos</option>
                <option value="Tutoría de proyectos de curso">Tutoría de proyectos de curso</option>
                <option value="Tutoría de trabajos de diplomas">Tutoría de trabajos de diplomas</option>
                <option value="Tutoría de otras formas de culminación">Tutoría de otras formas de culminación</option>
                <option value="Tutoría de tesis de maestría">Tutoría de tesis de maestría</option>
                <option value="Tutoría de tesis de especialidad">Tutoría de tesis de especialidad</option>
                <option value="Tutoría de tesis de doctorado">Tutoría de tesis de doctorado</option>
              </select>
            </div>

            <div class="flex gap-4">
              <button type="submit"
                class="flex-1 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300">
                Guardar
              </button>
              <button type="button" @click="closeForm"
                class="flex-1 bg-gray-300 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-300">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

definePageMeta({
  layout: 'default'
})

interface Vinculo {
  id: number
  estudiante: string
  cedula: string
  tipoTutoria: string
}

interface Profesor {
  nombre: string
  titulo: string
  departamento: string
}

// Simular profesor loggeado
const profesorActual = ref<Profesor>({
  nombre: 'Dr. Juan Pérez',
  titulo: 'Profesor Titular',
  departamento: 'Departamento de Matemáticas'
})

const showForm = ref(false)
const editingId = ref<number | null>(null)
const vinculos = ref<Vinculo[]>([
  {
    id: 1,
    estudiante: 'Carlos López',
    cedula: '27456321',
    tipoTutoria: 'Tutoría de tesis de maestría'
  },
  {
    id: 2,
    estudiante: 'Ana Martínez',
    cedula: '28123654',
    tipoTutoria: 'Tutoría de trabajos de diplomas'
  }
])

const formData = ref({
  profesor: profesorActual.value.nombre,
  estudiante: '',
  cedula: '',
  tipoTutoria: ''
})

const resetForm = () => {
  formData.value = {
    profesor: profesorActual.value.nombre,
    estudiante: '',
    cedula: '',
    tipoTutoria: ''
  }
  editingId.value = null
}

const closeForm = () => {
  showForm.value = false
  resetForm()
}

const saveVinculo = () => {
  if (editingId.value) {
    const index = vinculos.value.findIndex(v => v.id === editingId.value)
    if (index !== -1) {
      vinculos.value[index] = {
        id: editingId.value,
        estudiante: formData.value.estudiante,
        cedula: formData.value.cedula,
        tipoTutoria: formData.value.tipoTutoria
      }
    }
  } else {
    vinculos.value.push({
      id: Math.max(...vinculos.value.map(v => v.id), 0) + 1,
      estudiante: formData.value.estudiante,
      cedula: formData.value.cedula,
      tipoTutoria: formData.value.tipoTutoria
    })
  }
  closeForm()
}

const editVinculo = (vinculo: Vinculo) => {
  formData.value = {
    profesor: profesorActual.value.nombre,
    estudiante: vinculo.estudiante,
    cedula: vinculo.cedula,
    tipoTutoria: vinculo.tipoTutoria
  }
  editingId.value = vinculo.id
  showForm.value = true
}

const deleteVinculo = (id: number) => {
  vinculos.value = vinculos.value.filter(v => v.id !== id)
}
</script>
