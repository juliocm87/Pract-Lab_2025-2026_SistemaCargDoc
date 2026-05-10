<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="mb-8">
        <h1 class="text-4xl font-bold text-gray-900 mb-2">Sobrecarga Docente</h1>
        <p class="text-gray-600">{{ getCurrentMonth() }} de {{ getCurrentYear() }}</p>
      </div>

      <!-- Contenedor principal con tabla y panel de detalles -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Tabla de actividades -->
        <div class="lg:col-span-2">
          <div class="bg-white rounded-lg shadow-lg overflow-hidden">
            <table class="w-full">
              <thead class="bg-blue-600 text-white">
                <tr>
                  <th class="px-4 py-3 text-left text-sm font-semibold w-12">No</th>
                  <th class="px-4 py-3 text-left text-sm font-semibold">Actividades</th>
                  <th class="px-4 py-3 text-center text-sm font-semibold w-24">Horas</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(actividad, index) in actividades" :key="actividad.id"
                  @click="selectActividad(actividad)"
                  :class="[
                    'border-b hover:bg-blue-50 cursor-pointer transition-colors',
                    selectedActividad?.id === actividad.id ? 'bg-blue-100' : ''
                  ]">
                  <td class="px-4 py-3 text-sm text-gray-900 font-semibold">{{ index + 1 }}</td>
                  <td class="px-4 py-3 text-sm text-gray-900">{{ actividad.nombre }}</td>
                  <td class="px-4 py-3 text-center">
                    <input v-model.number="actividad.horas" type="number" min="0"
                      @click.stop
                      class="w-20 px-2 py-1 text-center border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" />
                  </td>
                </tr>
                <!-- Fila de Total -->
                <tr class="bg-blue-100 font-bold border-t-2 border-blue-600">
                  <td colspan="2" class="px-4 py-3 text-sm text-gray-900">Total de Horas</td>
                  <td class="px-4 py-3 text-center text-sm text-gray-900">{{ totalHoras }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Texto de cálculo de carga -->
          <div class="mt-6 bg-white rounded-lg shadow p-4">
            <p class="text-gray-700 font-semibold">
              Cálculo de la carga docente (≤114h/m)
            </p>
            <p class="text-sm text-gray-600 mt-2">
              Horas totales: <span class="font-bold text-blue-600">{{ totalHoras }}h/m</span>
              <span v-if="totalHoras <= 114" class="text-green-600 ml-4">✓ Dentro del límite permitido</span>
              <span v-else class="text-red-600 ml-4">✗ Excede el límite permitido</span>
            </p>
          </div>
        </div>

        <!-- Panel de detalles -->
        <div class="lg:col-span-1">
          <div v-if="selectedActividad" class="bg-white rounded-lg shadow-lg p-6 sticky top-24">
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Detalles</h2>
            
            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Actividad</h3>
              <p class="text-gray-900">{{ selectedActividad.nombre }}</p>
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Horas Dedicadas</h3>
              <input v-model.number="selectedActividad.horas" type="number" min="0"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>

            <div class="mb-6">
              <h3 class="text-sm font-semibold text-gray-700 mb-2">Descripción</h3>
              <textarea v-model="selectedActividad.descripcion"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="4"
                placeholder="Añade notas sobre esta actividad..."></textarea>
            </div>

            <button @click="guardarActividad"
              class="w-full bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
              Guardar Cambios
            </button>

            <button @click="selectedActividad = null"
              class="w-full mt-2 bg-gray-300 text-gray-900 px-6 py-2 rounded-lg font-semibold hover:bg-gray-400 transition-colors duration-300">
              Cerrar
            </button>
          </div>

          <div v-else class="bg-white rounded-lg shadow-lg p-6 sticky top-24 text-center">
            <p class="text-gray-500">Selecciona una actividad para ver sus detalles</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

definePageMeta({
  layout: 'default'
})

interface Actividad {
  id: number
  nombre: string
  horas: number
  descripcion: string
}

const actividades = ref<Actividad[]>([
  { id: 1, nombre: 'Docencia en pregrado y posgrado', horas: 0, descripcion: '' },
  { id: 2, nombre: 'Preparación de la asignatura de pregrado y posgrado, presencial y entornos virtuales', horas: 0, descripcion: '' },
  { id: 3, nombre: 'Calificación de exámenes', horas: 0, descripcion: '' },
  { id: 4, nombre: 'Trabajo docente - metodológico', horas: 0, descripcion: '' },
  { id: 5, nombre: 'Tutoría de práctica preprofesional, de trabajos de cursos y de proyectos de curso', horas: 0, descripcion: '' },
  { id: 6, nombre: 'Tutoría de trabajos de diplomas', horas: 0, descripcion: '' },
  { id: 7, nombre: 'Tutoría de otras formas de culminación de estudios', horas: 0, descripcion: '' },
  { id: 8, nombre: 'Tutoría de tesis de maestría y de especialidad', horas: 0, descripcion: '' },
  { id: 9, nombre: 'Tutoría de tesis de doctorado', horas: 0, descripcion: '' },
  { id: 10, nombre: 'Presidente Comisión Nacional de Carrera', horas: 0, descripcion: '' },
  { id: 11, nombre: 'Jefe de Colectivo de carrera', horas: 0, descripcion: '' },
  { id: 12, nombre: 'Jefe de Disciplina', horas: 0, descripcion: '' },
  { id: 13, nombre: 'Jefe de Asignatura', horas: 0, descripcion: '' },
  { id: 14, nombre: 'Profesor Guía', horas: 0, descripcion: '' }
])

const selectedActividad = ref<Actividad | null>(null)

const totalHoras = computed(() => {
  return actividades.value.reduce((sum, act) => sum + (act.horas || 0), 0)
})

const selectActividad = (actividad: Actividad) => {
  selectedActividad.value = actividad
}

const guardarActividad = () => {
  // La reactividad ya actualiza automáticamente los datos
  // Este método podría enviar datos a una API en el futuro
  console.log('Actividad actualizada:', selectedActividad.value)
}

const getCurrentMonth = () => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]
  return months[new Date().getMonth()]
}

const getCurrentYear = () => {
  return new Date().getFullYear()
}
</script>
