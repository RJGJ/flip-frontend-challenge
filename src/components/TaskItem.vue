<template>
  <li class="item" :class="task.status">
    <label class="check">
      <input type="checkbox" :checked="task.status==='completed'" @change="$emit('toggle', task)" aria-label="Toggle complete" />
    </label>
    <div class="content">
      <div class="title">
        <span>{{ task.title }}</span>
        <small class="meta">#{{ task.id }} · {{ new Date(task.created_at).toLocaleString() }}</small>
      </div>
      <p v-if="task.description" class="desc">{{ task.description }}</p>
      <div class="badges">
        <span class="badge" :data-priority="task.priority">{{ task.priority }}</span>
        <span class="badge" :data-status="task.status">{{ task.status }}</span>
      </div>
    </div>
    <button class="danger" @click="$emit('delete', task)" aria-label="Delete">✕</button>
  </li>
</template>

<script setup lang="ts">
import type { Task } from '@/types/task'

defineProps<{ task: Task }>()
defineEmits<{ (e: 'toggle', task: Task): void; (e: 'delete', task: Task): void }>()
</script>

<style scoped>
.item { display: grid; grid-template-columns: auto 1fr auto; gap: .5rem; align-items: start; padding: .5rem .75rem; border: 1px solid #ddd; border-radius: .5rem; }
.item.completed { opacity: .8; }
.check { padding-top: .35rem; }
.title { display: flex; gap: .5rem; align-items: baseline; font-weight: 600; }
.meta { font-weight: 400; color: #666; }
.desc { margin: .25rem 0; color: #333; }
.badges { display: flex; gap: .5rem; }
.badge { font-size: .75rem; padding: .1rem .4rem; border-radius: .4rem; background: #f1f1f1; text-transform: capitalize; }
.badge[data-priority="high"] { background: #ffe1e1; }
.badge[data-priority="medium"] { background: #fff3cd; }
.badge[data-priority="low"] { background: #e7f3ff; }
.badge[data-status="completed"] { background: #e0ffe5; }
.danger { background: transparent; border: none; font-size: 1rem; cursor: pointer; color: #b30000; }
</style>
