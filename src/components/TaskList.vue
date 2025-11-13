<template>
  <section>
    <div class="toolbar">
      <label>
        Status
        <select v-model="status" @change="reload">
          <option value="all">All</option>
          <option value="pending">Pending</option>
          <option value="completed">Completed</option>
        </select>
      </label>
      <label>
        Sort by
        <select v-model="sortBy" @change="reload">
          <option value="created_at">Created</option>
          <option value="priority">Priority</option>
        </select>
      </label>
    </div>

    <div v-if="store.loading" class="state">Loading…</div>
    <div v-else-if="!store.tasks.length" class="state">No tasks</div>

    <TransitionGroup v-else class="list" name="fade" tag="ul">
      <TaskItem
        v-for="t in sorted"
        :key="t.id"
        :task="t"
        @toggle="onToggle"
        @delete="onDelete"
      />
    </TransitionGroup>

    <Transition name="fade">
      <TaskForm
        v-if="showForm"
        @close="showForm = false"
        @created="onCreated"
      />
    </Transition>

    <!-- TODO: implement -->
    <!-- <Transition name="fade">
      <TaskModal v-if="task" :task="task" @close="task = null" />
    </Transition> -->
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, Transition } from "vue";
import { useTasksStore } from "@/stores/tasks";
import type { Task } from "@/types/task";
import TaskItem from "./TaskItem.vue";
import TaskForm from "./TaskForm.vue";
import TaskModal from "./TaskModal.vue";

const store = useTasksStore();
const status = ref<"all" | "pending" | "completed">("all");
const sortBy = ref<"created_at" | "priority">("created_at");
const showForm = ref(false);

const sorted = computed(() => {
  let arr = [...store.tasks];
  if (status.value !== "all")
    arr = arr.filter((t) => t.status === status.value);
  if (sortBy.value === "created_at")
    arr.sort((a, b) => b.created_at.localeCompare(a.created_at));
  else {
    const pr = { high: 3, medium: 2, low: 1 } as const;
    arr.sort((a, b) => pr[b.priority] - pr[a.priority]);
  }
  return arr;
});

function reload() {
  store.fetchTasks();
}

function onToggle(task: Task) {
  const next = task.status === "completed" ? "pending" : "completed";
  store.updateTask(task.id, { status: next });
}
function onDelete(task: Task) {
  if (confirm("Delete this task?")) store.deleteTask(task.id);
}
function onCreated() {
  showForm.value = false;
}

function onOpenNew() {
  showForm.value = true;
}

onMounted(() => {
  store.fetchTasks();
  window.addEventListener("open-new-task", onOpenNew as EventListener);
});

onBeforeUnmount(() => {
  window.removeEventListener("open-new-task", onOpenNew as EventListener);
});
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 0.75rem;
}
.state {
  opacity: 0.7;
  padding: 0.5rem 0;
}
.list {
  display: grid;
  gap: 0.5rem;
  padding: 0;
  list-style: none;
}
</style>
