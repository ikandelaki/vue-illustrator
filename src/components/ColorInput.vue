<script setup lang="ts">
import { ComputedRef } from 'vue';

defineProps<{ value: ComputedRef<string> }>()
defineEmits<{ (e: 'update:value', value?: string): () => void }>()

</script>
<template>
    <div class="context-menu_color">
        <p>Choose the color:</p>
        <input id="color-picker" type="color" :value="value.value" @input="$emit('update:value', $event?.target?.value)" />
    </div>
</template>