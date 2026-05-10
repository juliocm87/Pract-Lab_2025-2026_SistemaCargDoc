<template>
    <header class="w-full bg-white shadow-md fixed top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div class="flex items-center gap-2">
          <NuxtLink to="/"
            class="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-500 to-blue-700 bg-clip-text text-transparent hover:from-blue-600 hover:to-blue-800 transition-colors duration-300">
            UNISS
          </NuxtLink>
        </div>
  
        <!-- Botón de menú para vista móvil -->
        <div class="sm:hidden flex items-center">
          <button @click="toggleMenu" class="text-gray-700 focus:outline-none">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </button>
        </div>
  
        <!-- Menú de acciones para vista de escritorio -->
        <div class="hidden sm:flex items-center gap-4 sm:gap-6 lg:gap-8">
          <!-- Opción Sobrecarga Docente -->
          <div>
            <NuxtLink to="/sobrecarga-docente" class="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
              Sobrecarga Docente
            </NuxtLink>
          </div>
          
          <!-- Opción Vincular Estudiante -->
          <div>
            <NuxtLink to="/vincular-estudiante" class="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
              Vincular Estudiante
            </NuxtLink>
          </div>
        </div>
  
      
        <!-- Botón Iniciar Sesión en la derecha -->
        <div class="hidden sm:block text-right">
          <NuxtLink to="/login" class="text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300">
            Iniciar Sesión
          </NuxtLink>
        </div>
      </nav>
  
      <!-- Menú desplegable para vista móvil -->
      <div v-if="isMenuOpen" class="sm:hidden bg-white shadow-md">
        <div class="px-4 pt-2 pb-3 space-y-1">
          <NuxtLink to="/sobrecarga-docente" @click="closeMenu"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
            Sobrecarga Docente
          </NuxtLink>
          <NuxtLink to="/vincular-estudiante" @click="closeMenu"
            class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
            Vincular Estudiante
          </NuxtLink>
          <div>
            <NuxtLink to="/login" @click="closeMenu"
              class="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-blue-600">
              Iniciar Sesión
            </NuxtLink>
          </div>
        </div>
      </div>
    </header>
    <main class="pt-20 container ">
      <slot />
    </main>
  </template>
  <script setup lang="ts">
  import { ref } from 'vue'
  
  const isMenuOpen = ref(false)

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value
  }
  
  const closeMenu = () => {
    isMenuOpen.value = false
  }
  
  </script>
  