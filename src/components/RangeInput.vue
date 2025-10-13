<script setup lang="ts">
const modelValue = defineModel('modelValue')

// defineProps<{ modelValue?: any }>()

defineEmits<{
    (e: 'select-circle'): () => void
    (e: 'update:modelValue', value: number): void
}>()

console.log('modelValue', modelValue);

</script>

<template>
    <div class="context-menu_header">
        <p>Adjust the radius of a selected circle</p>
        <button @click="$emit('select-circle')">X</button>
      </div>
      <div class="context-menu_range">
        <div class="range-input">
          <span>1</span>
          <input type="range" min="1" max="1000" step="1" v-model="modelValue" />
          <span>1000</span>
        </div>
        <div class="selected-value">
          <span>Current: </span>
          <input id="circle-radius" name="circle-radius" type="number" v-model="modelValue" min="1" max="1000" />
        </div>
    </div>
</template>