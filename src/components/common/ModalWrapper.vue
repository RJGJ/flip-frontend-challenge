<template>
  <div class="modal" @click="onOverlayClick">
    <div class="modal__content" @click.stop">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits<{
  (e: 'close'): void
}>();

const onOverlayClick = () => {
  emit('close');
}
</script>

<style scoped>

.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

</style>
