<script setup lang="ts">
import { ComputedRef } from 'vue';

defineProps<{ value: ComputedRef<number> }>()

defineEmits<{
    (e: 'closeMenu'): () => void
    (e: 'update:value', value?: number): () => void
}>()

</script>

<template>
    <div class="context-menu_header">
        <p>Adjust the radius of a selected circle</p>
        <button @click="$emit('closeMenu')">X</button>
      </div>
      <div class="context-menu_range">
        <div class="range-input">
          <span>1</span>
          <input type="range"
            min="1"
            max="1000"
            step="1"
            :value="value.value"
            @input="$emit('update:value', $event?.target?.value)"
          />
          <span>1000</span>
        </div>
        <div class="selected-value">
          <span>Current: </span>
          <input
            id="circle-radius"
            name="circle-radius"
            type="number"
            :value="value.value"
            @input="$emit('update:value', $event?.target?.value)"
            min="1"
            max="1000"
          />
        </div>
    </div>
</template>