<script setup lang="ts">
defineProps<{ value: number }>();

defineEmits<{
  (e: "update:value", value?: number): () => void;
}>();
</script>

<template>
  <div class="context-menu_header">
    <p>Adjust the opacity of a shape</p>
  </div>
  <div class="context-menu_range">
    <div class="range-input">
      <span>1</span>
      <input
        type="range"
        min="0"
        max="1"
        step="0.01"
        :value="value"
        @input="$emit('update:value', $event?.target?.value)"
      />
      <span>100</span>
    </div>
  </div>
</template>
