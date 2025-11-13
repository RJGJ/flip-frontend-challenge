<template>
  <div class="toasts" role="status" aria-live="polite">
    <div v-for="t in toasts" :key="t.id" class="toast" :data-type="t.type">
      {{ t.message }}
      <button class="x" aria-label="Dismiss" @click="dismiss(t.id)">×</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, reactive } from 'vue'

type ToastType = 'info' | 'success' | 'error'
interface ToastMsg { id: number; message: string; type: ToastType }

const toasts = reactive<ToastMsg[]>([])
let id = 1

function add(message: string, type: ToastType = 'info') {
  const t = { id: id++, message, type }
  toasts.push(t)
  setTimeout(() => dismiss(t.id), 3500)
}
function dismiss(tid: number) {
  const i = toasts.findIndex(t => t.id === tid)
  if (i >= 0) toasts.splice(i, 1)
}

function onEvt(e: Event) {
  const ce = e as CustomEvent<{ message: string; type?: ToastType }>
  add(ce.detail.message, ce.detail.type || 'info')
}

onMounted(() => window.addEventListener('toast', onEvt as EventListener))
onBeforeUnmount(() => window.removeEventListener('toast', onEvt as EventListener))
</script>

<style scoped>
.toasts { position: fixed; right: 1rem; bottom: 4.25rem; display: grid; gap: .5rem; }
.toast { background: #222; color: #fff; padding: .5rem .75rem; border-radius: .5rem; box-shadow: 0 6px 16px rgba(0,0,0,.2); display: flex; gap: .5rem; align-items: center; }
.toast[data-type="success"] { background: #14532d; }
.toast[data-type="error"] { background: #7f1d1d; }
.x { color: inherit; background: transparent; border: none; font-size: 1.1rem; cursor: pointer; }
</style>
