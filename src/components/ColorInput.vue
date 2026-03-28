<script setup lang="ts">
import { ComputedRef } from "vue";

const props = defineProps<{
  value: string;
  title?: string;
}>();
defineEmits<{ (e: "update:value", value?: string): () => void }>();
</script>
<template>
  <div class="context-menu_color">
    <p>{{ title }}</p>
    <input
      id="color-picker"
      type="color"
      :value="value"
      @input="$emit('update:value', $event?.target?.value)"
    />
  </div>
</template>
