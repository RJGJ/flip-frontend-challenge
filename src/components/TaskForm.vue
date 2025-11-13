<template>
  <dialog
    open
    class="dialog"
    role="dialog"
    aria-modal="true"
    aria-label="New Task"
  >
    <form @submit.prevent="onSubmit">
      <h2>New Task</h2>
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
        <button type="submit" :disabled="!title">Create</button>
      </div>
    </form>
  </dialog>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { useTasksStore } from "@/stores/tasks";

const emit = defineEmits<{ (e: "close"): void; (e: "created"): void }>();
const store = useTasksStore();

const title = ref("");
const description = ref("");
const priority = ref<"low" | "medium" | "high">("medium");

async function onSubmit() {
  await store.createTask({
    title: title.value,
    description: description.value,
    status: "pending",
    priority: priority.value,
  });
  emit("created");
}
</script>

<style scoped>
.dialog {
  position: absolute;
  top: 200px;
  left: 0;
  right: 0;
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
