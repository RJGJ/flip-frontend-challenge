<template>
  <ModalWrapper @close="emit('close')">
    <dialog
      open
      class="dialog"
      role="dialog"
      aria-modal="true"
      aria-label="New Task"
    >
      <form @submit.prevent="onSubmit">
        <h2>{{ task ? "Edit" : "New" }} Task</h2>
        <label>
          Title
          <input v-model.trim="title" name="title" required maxlength="120" />
        </label>
        <label>
          Description
          <textarea
            v-model.trim="description"
            name="description"
            maxlength="500"
          ></textarea>
        </label>
        <label>
          Priority
          <select v-model="priority" name="priority">
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </label>
        <div class="actions">
          <button type="button" @click="$emit('close')">Cancel</button>
          <button type="submit" :disabled="!title">
            {{ task ? "Save" : "Create" }}
          </button>
        </div>
      </form>
    </dialog>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTasksStore } from "@/stores/tasks";
import ModalWrapper from "./common/ModalWrapper.vue";
import { Task } from "@/types/task";

const props = defineProps<{ task: Task | null }>();
const emit = defineEmits<{ (e: "close"): void; (e: "created"): void }>();
const store = useTasksStore();

const title = ref(props.task?.title || "");
const description = ref(props.task?.description || "");
const priority = ref<"low" | "medium" | "high">(
  props.task?.priority || "medium"
);

async function onSubmit() {
  if (props.task) {
    store
      .updateTask(props.task.id, {
        title: title.value,
        description: description.value,
        priority: priority.value,
      })
      .catch(() => {
        alert("Failed to update task");
      });
    emit("close");
    return;
  }
  store
    .createTask({
      title: title.value,
      description: description.value,
      status: "pending",
      priority: priority.value,
    })
    .catch(() => {
      alert("Failed to create task");
    });
  emit("created");
}
</script>

<style scoped>
.dialog {
  border: none;
  border-radius: 0.75rem;
  padding: 0;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.15);
}
form {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  width: min(480px, 90vw);
}
label {
  display: grid;
  gap: 0.25rem;
}
.actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.5rem;
  margin-top: 0.5rem;
}
</style>
