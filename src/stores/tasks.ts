import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { Task } from '@/types/task'
import { http } from '@/api/http'

interface ApiListResponse<T> { data: T[] }

export const useTasksStore = defineStore('tasks', () => {
  const tasks = ref<Task[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  const count = computed(() => tasks.value.length)

  async function fetchTasks(params?: Record<string, unknown>) {
    loading.value = true
    error.value = null
    try {
      const res = await http.get<ApiListResponse<Task>>('/api/tasks', { params })
      tasks.value = res.data.data
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Failed to load tasks'
    } finally {
      loading.value = false
    }
  }

  async function createTask(input: Omit<Task, 'id' | 'created_at' | 'updated_at'>) {
    const res = await http.post<Task>('/api/tasks', input)
    tasks.value.unshift(res.data)
    return res.data
  }

  async function updateTask(id: number, patch: Partial<Omit<Task, 'id'>>) {
    const res = await http.patch<Task>(`/api/tasks/${id}`, patch)
    const idx = tasks.value.findIndex((t: Task) => t.id === id)
    if (idx >= 0) tasks.value[idx] = res.data
    return res.data
  }

  async function deleteTask(id: number) {
    await http.delete(`/api/tasks/${id}`)
    tasks.value = tasks.value.filter((t: Task) => t.id !== id)
  }

  return { tasks, loading, error, count, fetchTasks, createTask, updateTask, deleteTask }
})
