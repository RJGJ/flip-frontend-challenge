<template>
  <div class="app">
    <header class="header">
      <h1>Tasks</h1>
      <button type="button" @click="toggleTheme" aria-label="Toggle theme">🌓</button>
    </header>
    <main>
      <TaskList />
    </main>
    <button class="fab" @click="openNew" aria-label="New Task">＋</button>
    <Toast />
  </div>
</template>

<script setup lang="ts">
import TaskList from '@/components/TaskList.vue'
import Toast from '@/components/Toast.vue'

function toggleTheme() {
  const d = document.documentElement
  d.dataset.theme = d.dataset.theme === 'dark' ? 'light' : 'dark'
  localStorage.setItem('theme', d.dataset.theme || 'light')
}
function openNew() {
  const ev = new CustomEvent('open-new-task')
  window.dispatchEvent(ev)
}
</script>

<style scoped>
.app { max-width: 960px; margin: 0 auto; padding: 1rem; }
.header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
.fab { position: fixed; right: 1rem; bottom: 1rem; font-size: 1.5rem; padding: .75rem 1rem; border-radius: .75rem; }
</style>
