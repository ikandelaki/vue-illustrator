<script setup lang="ts">
const value = defineModel('value')

defineProps<{ value?: number }>()

defineEmits<{
    (e: 'select-circle'): () => void
}>()

console.log('>> rangeinput')

</script>

<template>
    <div class="context-menu_header">
        <p>Adjust the radius of a selected circle</p>
        <button @click="$emit('select-circle')">X</button>
      </div>
      <div class="context-menu_range">
        <div class="range-input">
          <span>1</span>
          <input type="range" min="1" max="1000" step="1" v-model="value" />
          <span>1000</span>
        </div>
        <div class="selected-value">
          <span>Current: </span>
          <input id="circle-radius" name="circle-radius" type="number" v-model="value" min="1" max="1000" />
        </div>
    </div>
</template>