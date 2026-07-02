<template>
  <div>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>

    <div class="pointer-events-none fixed inset-x-0 top-4 z-[1000] flex flex-col items-center gap-3 px-4">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        :class="[
          'pointer-events-auto max-w-md rounded-2xl border px-4 py-3 text-sm shadow-lg backdrop-blur',
          toast.type === 'success' ? 'border-emerald-200 bg-emerald-50 text-emerald-800' :
          toast.type === 'error' ? 'border-rose-200 bg-rose-50 text-rose-800' :
          'border-sky-200 bg-sky-50 text-sky-800'
        ]"
      >
        {{ toast.message }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { toasts } = useNotifications()
</script>