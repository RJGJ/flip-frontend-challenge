<template>
  <div class="modal" @click="onOverlayClick">
    <div class="modal__content" @click.stop>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted } from "vue";

const emit = defineEmits<{
  (e: "close"): void;
}>();

const onOverlayClick = () => {
  document.documentElement.classList.remove("no-scroll");
  emit("close");
};

onMounted(() => {
  document.documentElement.classList.add("no-scroll");
});

onBeforeUnmount(() => {
  document.documentElement.classList.remove("no-scroll");
});
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 9999;
}

.modal__content {
  margin-top: 200px;
  display: flex;
  justify-content: center;
}
</style>
