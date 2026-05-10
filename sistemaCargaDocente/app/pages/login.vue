<template>
  <div class="min-h-screen bg-gray-100 flex items-center justify-center">
    <LoginForm @close="handleClose" />
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function handleClose() {
  router.push('/');
}

definePageMeta({
    layout: false
    // Se eliminó la configuración de auth para evitar errores de compilación
});
</script>