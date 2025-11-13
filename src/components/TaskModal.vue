<template>
  <ModalWrapper @close="$emit('close')">
    <div classs="task">
      <h2>{{ task.title }}</h2>
      <p v-html="task.description"></p>
      <p>{{ task.status }}</p>
      <p>{{ task.priority }}</p>
      <p>{{ new Date(task.created_at).toLocaleString() }}</p>
      <p>{{ new Date(task.updated_at).toLocaleString() }}</p>
    </div>
  </ModalWrapper>
</template>

<script setup lang="ts">
import { Task } from "@/types/task";
import ModalWrapper from "./common/ModalWrapper.vue";

const props = defineProps<{ task: Task }>();
</script>

<style lang="css" scoped>
.task {
  /*  */
}
</style>
