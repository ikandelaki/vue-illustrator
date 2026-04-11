<script setup lang="ts">
defineProps<{
  value: string;
  title?: string;
}>();

defineEmits<{
  (e: "update:value", value?: number): () => void;
}>();
</script>
<template>
  <div class="text-input">
    <label v-if="title" for="input">{{ title }}</label>
    <input
      type="text"
      :value="value"
      @input="$emit('update:value', $event.target?.value)"
      name="input"
      id="input"
    />
  </div>
</template>

<style scoped lang="scss">
.text-input {
  input {
    margin-inline-start: 12px;
  }
}
</style>
