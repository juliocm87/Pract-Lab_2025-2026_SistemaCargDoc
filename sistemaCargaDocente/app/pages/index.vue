<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div class="text-center mb-16">
        <h1 class="text-5xl font-bold text-gray-900 mb-4">
          Sistema de Sobrecarga Docente
        </h1>
        <p class="text-xl text-gray-600 mb-8">
          Gestiona la sobrecarga académica de docentes y vincula estudiantes de forma eficiente
        </p>
        <NuxtLink to="/login"
          class="inline-block bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
          Iniciar Sesión
        </NuxtLink>
      </div>

      <!-- Tarjetas de funcionalidades -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
        <!-- Tarjeta Sobrecarga Docente -->
        <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">Sobrecarga Docente</h2>
          <p class="text-gray-600 mb-6">
            Registra y gestiona la sobrecarga académica de los docentes. Controla horas adicionales y asignaciones especiales.
          </p>
          <NuxtLink to="/sobrecarga-docente"
            class="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-300">
            Acceder
          </NuxtLink>
        </div>

        <!-- Tarjeta Vincular Estudiante -->
        <div class="bg-white rounded-lg shadow-lg p-8 hover:shadow-xl transition-shadow duration-300">
          <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <h2 class="text-2xl font-bold text-gray-900 mb-3">Vincular Estudiante</h2>
          <p class="text-gray-600 mb-6">
            Vincula estudiantes a sobrecarga académica y gestiona sus asignaciones dentro del sistema.
          </p>
          <NuxtLink to="/vincular-estudiante"
            class="inline-block bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition-colors duration-300">
            Acceder
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>
