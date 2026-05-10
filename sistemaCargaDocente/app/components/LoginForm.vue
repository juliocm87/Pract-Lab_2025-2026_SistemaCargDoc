<template>
  <div class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg p-8 w-full max-w-md mx-4">
      <div class="text-center mb-8">
        <img 
          src="/images/UNISS.png" 
          alt="Logo UNISS" 
          class="w-64 h-64 mx-auto mb-6 object-contain"
        />
        <h2 class="text-2xl font-bold text-blue-600">Iniciar Sesión</h2>
      </div>
      
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700 mb-1">Usuario</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            :disabled="isLoading"
            class="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
            placeholder="Ingrese su usuario"
          />
        </div>

        <div>
          <label for="password" class="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
          <div class="relative">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              :disabled="isLoading"
              class="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent disabled:opacity-50"
              placeholder="Ingrese su contraseña"
            />
            <button
              type="button"
              @click="togglePassword"
              class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700"
            >
              <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
              </svg>
            </button>
          </div>
        </div>

        <div class="flex justify-between items-center">
          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300"
          >
            <span v-if="isLoading">Cargando vista...</span>
            <span v-else>Iniciar</span>
          </button>
        </div>
      </form>

      <button
        @click="$emit('close')"
        class="mt-4 w-full text-gray-600 hover:text-gray-800 font-medium"
      >
        Cancelar
      </button>
    </div>
  </div>
</template>

<script setup>
// 1. Borramos la línea de const { $toast } = useNuxtApp();
const router = useRouter();

const username = ref('');
const password = ref('');
const isLoading = ref(false);
const showPassword = ref(false);

const togglePassword = () => {
  showPassword.value = !showPassword.value;
};

const handleSubmit = async () => {
  isLoading.value = true;
  
  // Simulamos una espera de 1 segundo
  setTimeout(() => {
    isLoading.value = false;
    // 2. Usamos un alert nativo del navegador en lugar del toast
    alert('¡Login visual exitoso!'); 
    router.push('/');
  }, 1000);
};

defineEmits(['close']);
</script>

<style scoped>
img {
  filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>