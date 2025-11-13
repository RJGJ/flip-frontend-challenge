import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useTasksStore } from './tasks'

describe('tasks store', () => {
  beforeEach(() => setActivePinia(createPinia()))

  it('fetches seed tasks from MSW', async () => {
    const store = useTasksStore()
    await store.fetchTasks()
    expect(store.tasks.length).toBeGreaterThan(0)
  })
})
