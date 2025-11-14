import { defineStore } from "pinia";
import { ref, computed } from "vue";
import type { Task } from "@/types/task";
import { http } from "@/api/http";

interface ApiListResponse<T> {
  data: T[];
}

export const useTasksStore = defineStore("tasks", () => {
  const tasks = ref<Task[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const count = computed(() => tasks.value.length);

  async function fetchTasks(params?: Record<string, unknown>) {
    loading.value = true;
    error.value = null;
    try {
      const res = await http.get<ApiListResponse<Task>>("/api/tasks", {
        params,
      });
      tasks.value = res.data.data;
    } catch (e) {
      error.value = e instanceof Error ? e.message : "Failed to load tasks";
      alert("Failed to load tasks, please try again");
    } finally {
      loading.value = false;
    }
  }

  async function createTask(
    input: Omit<Task, "id" | "created_at" | "updated_at">
  ) {
    const randomId = Math.floor(Math.random() * -10000);
    tasks.value.unshift({
      ...input,
      id: randomId,
      created_at: Date.now().toString(),
      updated_at: Date.now().toString(),
    });
    try {
      const res = await http.post<Task>("/api/tasks", input);
      tasks.value.map((newTask: Task) => {
        if (newTask.id === randomId) {
          newTask = res.data;
        }
      });
      return res.data;
    } catch (error) {
      tasks.value = tasks.value.filter((t: Task) => t.id !== randomId);
      throw error;
    }
  }

  async function updateTask(id: number, patch: Partial<Omit<Task, "id">>) {
    const oldvalue = tasks.value.find((t: Task) => t.id === id);
    tasks.value = tasks.value.map((task: Task) => {
      if (task.id === id) {
        const updated = {
          ...task,
          ...patch,
          updated_at: Date.now().toString(),
        };
        console.log(updated);
        return updated;
      }
      return task;
    });

    try {
      const res = await http.patch<Task>(`/api/tasks/${id}`, patch);
      const idx = tasks.value.findIndex((t: Task) => t.id === id);
      if (idx >= 0) tasks.value[idx] = res.data;

      tasks.value = tasks.value.map((task: Task) => {
        if (task.id === id) {
          return res.data;
        }
        return task;
      });

      return res.data;
    } catch (error) {
      if (oldvalue) {
        tasks.value = tasks.value.map((task: Task) => {
          if (task.id === id) {
            return oldvalue;
          }
          return task;
        });
      }
      throw error;
    }
  }

  async function deleteTask(id: number) {
    await http.delete(`/api/tasks/${id}`);
    tasks.value = tasks.value.filter((t: Task) => t.id !== id);
  }

  return {
    tasks,
    loading,
    error,
    count,
    fetchTasks,
    createTask,
    updateTask,
    deleteTask,
  };
});
